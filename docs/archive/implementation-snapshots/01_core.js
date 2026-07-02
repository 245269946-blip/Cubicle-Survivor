// ================================================================
// 01_CORE RULES 核心规则
// 伤害公式·暴击·冷却·各类上限·经验曲线·掉落规则
// File: 01_core.js | Load order: 1/7
// ================================================================

﻿const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const ui = {
  time: document.querySelector("#timeText"),
  stage: document.querySelector("#stageText"),
  level: document.querySelector("#levelText"),
  kills: document.querySelector("#killsText"),
  remaining: document.querySelector("#remainingText"),
  skillCount: document.querySelector("#skillCountText"),
  material: document.querySelector("#materialText"),
  hp: document.querySelector("#hpText"),
  hpFill: document.querySelector("#hpFill"),
  xp: document.querySelector("#xpFill"),
  buildSummary: document.querySelector("#buildSummary"),
  buildPanel: document.querySelector("#buildPanel"),
  buildToggle: document.querySelector("#buildToggle"),
  buildList: document.querySelector("#buildList"),
  routeMap: document.querySelector("#routeMap"),
  statList: document.querySelector("#statList"),
  itemSummary: document.querySelector("#itemSummary"),
  itemList: document.querySelector("#itemList"),
  startPanel: document.querySelector("#startPanel"),
  upgradePanel: document.querySelector("#upgradePanel"),
  upgradeRerollButton: document.querySelector("#upgradeRerollButton"),
  upgradeRerollCount: document.querySelector("#upgradeRerollCount"),
  weaponPanel: document.querySelector("#weaponPanel"),
  resultPanel: document.querySelector("#resultPanel"),
  upgradeChoices: document.querySelector("#upgradeChoices"),
  weaponChoices: document.querySelector("#weaponChoices"),
  armoryBuildStrip: document.querySelector("#armoryBuildStrip"),
  armoryRouteMap: document.querySelector("#armoryRouteMap"),
  offerPreview: document.querySelector("#offerPreview"),
  armoryMaterial: document.querySelector("#armoryMaterialText"),
  armoryReason: document.querySelector("#armoryReasonText"),
  refreshButton: document.querySelector("#refreshButton"),
  refreshCost: document.querySelector("#refreshCostText"),
  resultEyebrow: document.querySelector("#resultEyebrow"),
  resultTitle: document.querySelector("#resultTitle"),
  resultStats: document.querySelector("#resultStats"),
  perkPanel: document.querySelector("#perkPanel"),
  perkList: document.querySelector("#perkList"),
  perkPoints: document.querySelector("#perkPointsText"),
  perkShopButton: document.querySelector("#perkShopButton"),
  perkCloseButton: document.querySelector("#perkCloseButton"),
  startPerkButton: document.querySelector("#startPerkButton"),
  startEndlessButton: document.querySelector("#startEndlessButton"),
  itemReplacePanel: document.querySelector("#itemReplacePanel"),
  itemReplaceNew: document.querySelector("#itemReplaceNew"),
  itemReplaceList: document.querySelector("#itemReplaceList"),
  itemReplaceCount: document.querySelector("#itemReplaceCount"),
  itemConvertButton: document.querySelector("#itemConvertButton"),
  itemKeepButton: document.querySelector("#itemKeepButton"),
  pausePanel: document.querySelector("#pausePanel"),
  pauseStats: document.querySelector("#pauseStats"),
  pauseButton: document.querySelector("#pauseButton"),
  resumeButton: document.querySelector("#resumeButton"),
  restartFromPause: document.querySelector("#restartFromPause"),
  objectiveStageMeta: document.querySelector("#objectiveStageMeta"),
  objectiveStageName: document.querySelector("#objectiveStageName"),
  objectiveTime: document.querySelector("#objectiveTime"),
  objectiveRemaining: document.querySelector("#objectiveRemaining"),
  objectiveKills: document.querySelector("#objectiveKills"),
  objectiveAlert: document.querySelector("#objectiveAlert"),
  stageBanner: document.querySelector("#stageBanner"),
  stageBannerMeta: document.querySelector("#stageBannerMeta"),
  stageBannerTitle: document.querySelector("#stageBannerTitle"),
  stageBannerText: document.querySelector("#stageBannerText"),
  fusionNotice: document.querySelector("#fusionNotice"),
  fusionNoticeMeta: document.querySelector("#fusionNoticeMeta"),
  fusionNoticeTitle: document.querySelector("#fusionNoticeTitle"),
  fusionNoticeText: document.querySelector("#fusionNoticeText"),
  fusionNoticeClose: document.querySelector("#fusionNoticeClose"),
  guideOverlay: document.querySelector("#guideOverlay"),
  policyPanel: document.querySelector("#policyPanel"),
  policyChoices: document.querySelector("#policyChoices"),
  policySkip: document.querySelector("#policySkip"),
  bestOvertimeText: document.querySelector("#bestOvertimeText"),
  startButton: document.querySelector("#startButton"),
  restartButton: document.querySelector("#restartButton"),
  endlessButton: document.querySelector("#endlessButton"),
  continueButton: document.querySelector("#continueButton"),
  // Death recap & event UI
  deathRecap: document.querySelector("#deathRecap"),
  eventPanel: document.querySelector("#eventPanel"),
  eventTitle: document.querySelector("#eventTitle"),
  eventChoices: document.querySelector("#eventChoices"),
  eventSkipButton: document.querySelector("#eventSkipButton"),
  routeScanlines: document.querySelector("#routeScanlines"),
  lowHpVignette: document.querySelector("#lowHpVignette"),
};

const TAU = Math.PI * 2;
const WORLD = { w: 4800, h: 3000 };
const WAVE_SECONDS = 50;
const RECOVERY_SECONDS = 10;
const MAX_STAGE = 14;
const STAGE_ONE_WARMUP_SECONDS = 18;
const EMPLOYEE_POINTS_KEY = "cb_employee_points";
const EMPLOYEE_UPGRADES_KEY = "cb_employee_upgrades";
const DAMAGE_MULT_SOFT_CAP = 1.82;
const DAMAGE_MULT_HARD_CAP = 2.18;
const ATTACK_SPEED_SOFT_CAP = 62;
const ATTACK_SPEED_HARD_CAP = 92;
// Weapon-specific size/radius caps to prevent screen-filling AoE
const WSIZE_SOFT_FACTOR = 1.5;   // up to 1.5x base: full growth
const WSIZE_HARD_FACTOR = 2.5;   // absolute max 2.5x base
const WSIZE_TAIL = 0.30;         // growth rate beyond soft cap
const SPRITE_ATLAS_SRC = "assets/office-rogue-atlas.png";
const PROPS_ATLAS_SRC = "assets/office-rogue-props.png";
const UI_ATLAS_SRC = "assets/office-rogue-ui-icons.png";
const SPRITE_GRID = 4;
const keys = new Set();
const pointer = { active: false, x: 0, y: 0 };

let game = null;
let lastTime = 0;
let state = "menu";
let pausedFromState = "playing";
let enemyId = 1;
let buildHudSignature = "";
let statHudSignature = "";
let itemHudSignature = "";
let pendingPolicy = null;
let policySelectionOpen = false;
let swarmId = 1;

const spriteAtlas = new Image();
let spriteAtlasReady = false;
spriteAtlas.onload = () => {
  spriteAtlasReady = true;
};
spriteAtlas.src = SPRITE_ATLAS_SRC;

const propsAtlas = new Image();
let propsAtlasReady = false;
propsAtlas.onload = () => {
  propsAtlasReady = true;
};
propsAtlas.src = PROPS_ATLAS_SRC;

function cooldown(base) {
  return Math.max(0.18, base * (100 / (100 + Math.max(-60, getEffectiveStat("attackSpeed")))));
}
function weaponCooldown(base, weaponId) {
  const attackSpeed = Math.max(-60, getEffectiveStat("attackSpeed"));
  const coefficients = {
    coffee: 0.78,
    keyboard: 1.1,
    stapler: 0.92,
    sticky: 0.42,
    marker: 1.25,
    calculator: 0.58,
    headset: 1.35,
    report: 0.7,
    shredder: 0.62,
    thermos: 0.35,
  };
  const coefficient = coefficients[weaponId] ?? 1;
  const floor = weaponId === "marker" ? 0.42 : weaponId === "coffee" ? 0.16 : 0.22;
  const hybrid = getHybridBonus();
  const hybridMult = hybrid.active ? hybrid.cooldownMult : 1;
  // Barrage T3: surrounded => faster cooldowns (scaled by effectiveness)
  const barrageEff = game.routeEff?.barrage || 0;
  const barrageSurroundMult = (barrageEff > 0 && hasWeaponPair("keyboard", "stapler", 2) && getRouteTier("barrage") >= 3
    && game.enemies.filter(en => Math.hypot(en.x - game.player.x, en.y - game.player.y) < 140).length >= 5) 
    ? Math.max(0.55, 1 - 0.25 * barrageEff) : 1;
  return Math.max(floor, base * (100 / (100 + attackSpeed * coefficient)) * hybridMult * (game.policyCooldownMult || 1) * barrageSurroundMult * (game.sudsidyCdBoost ? 0.8 : 1));
}
function getHybridBonus() {
  if (!game) return { active: false };
  const counts = getWeaponClassCounts();
  const owned = getOwnedWeaponCount();
  const classCount = Object.keys(counts).length;
  const anyRouteActive = routeDefinitions.some((route) => getRouteTier(route.id) >= 2);
  if (owned < 3 || classCount < 3 || anyRouteActive) return { active: false };
  return {
    active: true,
    cooldownMult: 0.92,
    label: classCount >= 5 ? "全能工位+" : "全能工位",
    text: classCount >= 5 ? "冷却 -8%，伤害 +4%" : "冷却 -8%",
    damageMult: classCount >= 5 ? 0.04 : 0,
  };
}
function softCap(value, softCap, hardCap, tail = 0.35) {
  if (value <= softCap) return value;
  const extra = value - softCap;
  return Math.min(hardCap, softCap + extra * tail);
}
function softCapWeaponSize(actual, base) {
  if (typeof base !== "number" || base <= 0) return actual;
  return Math.round(softCap(actual, base * WSIZE_SOFT_FACTOR, base * WSIZE_HARD_FACTOR, WSIZE_TAIL));
}
function addPlayerDamage(g, amount) {
  const current = g.player.damageMult;
  const scaled = current >= DAMAGE_MULT_SOFT_CAP ? amount * 0.45 : amount;
  g.player.damageMult = Math.min(DAMAGE_MULT_HARD_CAP, current + scaled);
}
function addPlayerAttackSpeed(g, amount) {
  const current = g.player.attackSpeed;
  const scaled = current >= ATTACK_SPEED_SOFT_CAP ? amount * 0.42 : amount;
  g.player.attackSpeed = Math.min(ATTACK_SPEED_HARD_CAP, current + scaled);
}
function getRawDamageMult() {
  const hybrid = getHybridBonus();
  return game.player.damageMult + getClassBonus("damageMult") + getBuildFocusDamageBonus() + (hybrid.active ? hybrid.damageMult : 0);
}
function getRawAttackSpeed() {
  return game.player.attackSpeed + getClassBonus("attackSpeed");
}
function getAnchorDamageReduction() {
  const fortify = Math.max(0, getEffectiveStat("fortify"));
  return clamp(getAnchorCharge() * (0.1 + fortify * 0.011), 0, 0.42);
}
function rangeBonus(scale = 1) {
  return Math.max(-80, game.player.range + getClassBonus("range")) * scale;
}
function hitDamage(base) {
  const p = game.player;
  const crit = Math.random() < clamp(p.crit + getClassBonus("crit"), 0, 75) / 100;
  if (crit && game.paperStormActive) {
    const ps = hiddenSynergies.find(s => s.id === "paperStorm");
    if (ps?.onCrit) ps.onCrit(game);
  }
  return base * getDamageMult() * (crit ? 1.85 : 1);
}
function continuousDamage(base) {
  const p = game.player;
  return base * getDamageMult() * (1 + clamp(p.crit + getClassBonus("crit"), 0, 75) * 0.006);
}
function getDamageMult() {
  return softCap(getRawDamageMult(), DAMAGE_MULT_SOFT_CAP, DAMAGE_MULT_HARD_CAP, 0.35);
}
function getBuildFocusDamageBonus() {
  const owned = getOwnedWeaponCount();
  if (owned < 3) return 0;
  const topCount = Math.max(0, ...Object.values(getWeaponClassCounts()));
  const late = game.stage >= 8;
  if (topCount >= 4) return late ? 0.2 : 0.14;
  if (topCount >= 3) return late ? 0.11 : 0.08;
  return 0;
}
function getMaterialMult() {
  return 1 + clamp(getEffectiveStat("luck"), 0, 260) * 0.0026;
}
function getEffectiveStat(key) {
  const p = game.player;
  const values = {
    attackSpeed: softCap(getRawAttackSpeed(), ATTACK_SPEED_SOFT_CAP, ATTACK_SPEED_HARD_CAP, 0.34),
    crit: p.crit + getClassBonus("crit"),
    range: p.range + getClassBonus("range"),
    dodge: p.dodge,
    armor: p.armor + getClassBonus("armor") + (game.tempArmor || 0),
    luck: p.luck + getClassBonus("luck"),
    pickupRange: p.pickupRange + getClassBonus("pickupRange"),
    regen: p.regen + (game.tempRegen || 0),
    fortify: p.fortify,
  };
  return values[key] || 0;
}
function getWeaponStatScale(kind) {
  if (kind === "precise") {
    return 1
      + clamp(getEffectiveStat("crit"), 0, 90) * 0.0025
      + Math.max(0, getEffectiveStat("range")) * 0.00115;
  }
  if (kind === "barrage") {
    return 1 + clamp(getEffectiveStat("attackSpeed"), 0, 180) * 0.0015 + clamp(getEffectiveStat("dodge"), 0, 60) * 0.002;
  }
  if (kind === "engineering") {
    return 1
      + clamp(getEffectiveStat("luck"), 0, 180) * 0.0018
      + Math.max(0, getEffectiveStat("pickupRange") - 150) * 0.0008
      + getClassBonus("engineering") * 0.55;
  }
  if (kind === "field") {
    return 1
      + Math.max(0, getEffectiveStat("armor")) * 0.018
      + Math.max(0, getEffectiveStat("regen")) * 0.024
      + Math.max(0, getEffectiveStat("fortify")) * 0.017
      + getAnchorCharge() * 0.34;
  }
  return 1;
}
function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}