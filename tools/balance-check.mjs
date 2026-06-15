import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../main.js", import.meta.url), "utf8");

function extractConst(name) {
  const match = source.match(new RegExp(`const\\s+${name}\\s*=\\s*([^;]+);`));
  if (!match) throw new Error(`Missing ${name}`);
  return Number(vm.runInNewContext(match[1]));
}

function extractCosts(id) {
  const match = source.match(new RegExp(`id:\\s*"${id}"[\\s\\S]*?costs:\\s*\\[([^\\]]+)\\]`));
  if (!match) throw new Error(`Missing costs for ${id}`);
  return match[1].split(",").map((value) => Number(value.trim())).filter(Number.isFinite);
}

const DAMAGE_MULT_SOFT_CAP = extractConst("DAMAGE_MULT_SOFT_CAP");
const DAMAGE_MULT_HARD_CAP = extractConst("DAMAGE_MULT_HARD_CAP");
const ATTACK_SPEED_SOFT_CAP = extractConst("ATTACK_SPEED_SOFT_CAP");
const ATTACK_SPEED_HARD_CAP = extractConst("ATTACK_SPEED_HARD_CAP");

function softCap(value, softCap, hardCap, tail = 0.35) {
  if (value <= softCap) return value;
  return Math.min(hardCap, softCap + (value - softCap) * tail);
}

function stageCurve(stage) {
  const pressureStage = stage === 3 || stage === 5 || stage === 8 || stage === 10;
  const burstStage = stage === 4 || stage === 7 || stage === 9;
  const midStage = Math.max(0, stage - 6);
  const lateStage = Math.max(0, stage - 10);
  const scalingStage = Math.max(0, stage - 1);
  const latePressure = Math.max(0, stage - 8);
  return {
    stage,
    totalEnemies: Math.round((24 + stage * 9.2 + midStage * 5.5 + lateStage * 6 - (stage <= 3 ? 4 + stage * 2 : 0)) * (stage === 1 ? 0.82 : 1)),
    maxConcurrent: Math.round((14 + stage * 3.4 + midStage * 2 + lateStage * 2.4) * (pressureStage ? 1.12 : 1) * (stage === 1 ? 0.72 : 1)),
    spawnInterval: Math.max(0.2, 0.92 - stage * 0.046 - midStage * 0.02 - lateStage * 0.012) * (stage === 1 ? 1.28 : 1),
    batchSize: stage === 1 ? 1 : Math.min(6, 1 + Math.floor(stage / 2) + (burstStage ? 1 : 0)),
    healthMult: 1 + stage * 0.108 + scalingStage * scalingStage * 0.0165 + midStage * 0.058 + latePressure * latePressure * 0.013,
    speedMult: 0.98 + stage * 0.042 + midStage * 0.013 + lateStage * 0.028 + (burstStage ? 0.04 : 0),
    damageMult: (1 + stage * 0.07 + midStage * 0.065 + latePressure * 0.04) * (pressureStage ? 1.075 : 1),
  };
}

function playerCurve(rawDamage, rawAttackSpeed) {
  return {
    rawDamage,
    effectiveDamage: softCap(rawDamage, DAMAGE_MULT_SOFT_CAP, DAMAGE_MULT_HARD_CAP, 0.35),
    rawAttackSpeed,
    effectiveAttackSpeed: softCap(rawAttackSpeed, ATTACK_SPEED_SOFT_CAP, ATTACK_SPEED_HARD_CAP, 0.34),
  };
}

function classScenario(name, bonuses) {
  const rawDamage = 1 + (bonuses.damageMult || 0);
  const rawAttackSpeed = bonuses.attackSpeed || 0;
  const armor = bonuses.armor || 0;
  const fieldRadius = bonuses.fieldRadius || 0;
  const engineering = bonuses.engineering || 0;
  const survivalIndex = 1 + armor * 0.055 + fieldRadius * 0.0045;
  const powerIndex = softCap(rawDamage, DAMAGE_MULT_SOFT_CAP, DAMAGE_MULT_HARD_CAP, 0.35)
    * (1 + softCap(rawAttackSpeed, ATTACK_SPEED_SOFT_CAP, ATTACK_SPEED_HARD_CAP, 0.34) * 0.003)
    * (1 + engineering * 0.55);
  return {
    name,
    rawDamage: Number(rawDamage.toFixed(3)),
    rawAttackSpeed,
    powerIndex: Number(powerIndex.toFixed(3)),
    survivalIndex: Number(survivalIndex.toFixed(3)),
  };
}

const enemy = [1, 3, 5, 8, 10, 12, 14].map(stageCurve);
const players = [
  playerCurve(1.4, 40),
  playerCurve(1.82, 62),
  playerCurve(2.2, 95),
  playerCurve(2.7, 150),
  playerCurve(3.2, 200),
];

const classScenarios = [
  classScenario("none", {}),
  classScenario("early-field-2", { fieldRadius: 12 }),
  classScenario("early-engineering-2", { engineering: 0.08 }),
  classScenario("mid-barrage-4", { attackSpeed: 22 }),
  classScenario("mid-field-4", { fieldRadius: 38, armor: 2 }),
  classScenario("mid-engineering-4", { engineering: 0.3 }),
];

const permanentMeta = [
  { name: "none", hp: 100, speed: 245, materials: 0, luck: 0, refreshDiscount: 0 },
  { name: "half", hp: 116, speed: 257, materials: 6, luck: 10, refreshDiscount: 1 },
  { name: "max", hp: 132, speed: 263, materials: 9, luck: 15, refreshDiscount: 2 },
].map((meta) => {
  const stageOne = stageCurve(1);
  const rawBugHit = 7 * stageOne.damageMult * 0.72;
  const firstRefreshCost = Math.max(2, 7 - meta.refreshDiscount);
  return {
    ...meta,
    stageOneHitsToDie: Number((meta.hp / rawBugHit).toFixed(1)),
    firstRefreshCost,
    startPowerIndex: Number(((meta.hp / 100) * (meta.speed / 245) * (1 + meta.luck * 0.002)).toFixed(3)),
  };
});

const permanentCostTotal = ["maxHp", "speed", "materials", "luck", "refresh"]
  .flatMap(extractCosts)
  .reduce((sum, cost) => sum + cost, 0);

const sampleClearPoints = {
  solidWin: Math.round(14 * 8 + 70 + 420 * 0.18 + 18 * 2 + 16 * 3),
  failedMid: Math.round(8 * 8 + 0 + 210 * 0.18 + 12 * 2 + 10 * 3),
};

const standStillPressure = [5, 8, 12].map((stage) => {
  const curve = stageCurve(stage);
  const rawThreat = curve.maxConcurrent * curve.damageMult * curve.speedMult / 100;
  const campPressure = (0.08 + stage * 0.008);
  return {
    stage,
    rawThreat: Number(rawThreat.toFixed(3)),
    campThreat: Number((rawThreat * (1 + campPressure)).toFixed(3)),
  };
});

const issues = [];
for (let i = 1; i < enemy.length; i += 1) {
  if (enemy[i].healthMult <= enemy[i - 1].healthMult) issues.push(`health not increasing at stage ${enemy[i].stage}`);
  if (enemy[i].damageMult <= enemy[i - 1].damageMult) issues.push(`damage not increasing at stage ${enemy[i].stage}`);
}
for (const player of players) {
  if (player.effectiveDamage > DAMAGE_MULT_HARD_CAP + 0.001) issues.push(`damage cap exceeded ${player.effectiveDamage}`);
  if (player.effectiveAttackSpeed > ATTACK_SPEED_HARD_CAP + 0.001) issues.push(`attack cap exceeded ${player.effectiveAttackSpeed}`);
}

if (stageCurve(1).healthMult > 1.14) issues.push("stage 1 health pressure too high");
if (stageCurve(5).damageMult < 1.45) issues.push("stage 5 damage pressure too low");
if (stageCurve(8).speedMult < 1.34) issues.push("stage 8 speed pressure too low");
if (stageCurve(14).healthMult < 6.1) issues.push("stage 14 health pressure too low");
if (standStillPressure.find((entry) => entry.stage === 8).campThreat < 0.95) issues.push("stage 8 camp threat too low");

const maxMeta = permanentMeta.find((entry) => entry.name === "max");
if (maxMeta.startPowerIndex > 1.46) issues.push(`permanent meta start power too high ${maxMeta.startPowerIndex}`);
if (maxMeta.materials > 10) issues.push("permanent meta starting materials too high");
if (maxMeta.firstRefreshCost < 5) issues.push("permanent meta refresh discount too strong");

const earlyField = classScenarios.find((entry) => entry.name === "early-field-2");
const midEngineering = classScenarios.find((entry) => entry.name === "mid-engineering-4");
if (earlyField.survivalIndex > 1.08) issues.push(`early field survival too strong ${earlyField.survivalIndex}`);
if (midEngineering.powerIndex > 1.18) issues.push(`engineering 4-piece power too high ${midEngineering.powerIndex}`);

if (permanentCostTotal < sampleClearPoints.solidWin * 8) issues.push("permanent progression too short");
if (permanentCostTotal > sampleClearPoints.solidWin * 13) issues.push("permanent progression too long");

console.log(JSON.stringify({
  enemy,
  players,
  classScenarios,
  permanentMeta,
  permanentCostTotal,
  sampleClearPoints,
  standStillPressure,
  issues,
}, null, 2));
if (issues.length) process.exitCode = 1;
