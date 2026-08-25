const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const report = JSON.parse(fs.readFileSync(path.join(root, "formal-cartoon-boss-runtime-report.json"), "utf8"));

function check(condition, message) {
  if (!condition) throw new Error("Formal cartoon Boss QA: " + message);
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function pngDimensions(file) {
  const buffer = fs.readFileSync(file);
  check(buffer.length > 24 && buffer.subarray(1, 4).toString("ascii") === "PNG", `${file} is not a valid PNG`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

check(report.schemaVersion === 1 && report.entry === "demo-v3-15.html", "report identity drifted");
check(report.status === "passed" && report.phase === "four-weapon-v3-15", "Boss runtime report did not pass");
check(JSON.stringify(report.viewport) === JSON.stringify([1280, 720]), "runtime viewport drifted");
check(report.runtimeTarget.baseBodySize === 96 && report.runtimeTarget.formalVisualScale === 1.25
  && report.runtimeTarget.leadVisibleHeight === 129.6 && report.runtimeTarget.directorVisibleHeight === 132
  && report.runtimeTarget.deliveryVisibleHeight === 136.8 && report.runtimeTarget.clientVisibleHeight === 135.6
  && report.runtimeTarget.ceoVisibleHeight === 139.2,
  "formal Bosses must keep the enlarged V3.15 readability targets");
check(report.runtimeTarget.firstLoadSettleMs >= 6500, "first-load decode wait is missing");
check(Array.isArray(report.bossTypes) && JSON.stringify(report.bossTypes) === JSON.stringify(["lead", "director", "delivery", "client", "ceo"]),
  "formal Boss roster must contain all five encounter Bosses");
check(Array.isArray(report.cases) && report.cases.length === 52, "five formal Bosses need fifty-two representative runtime cases");
check(new Set(report.cases.map((item) => item.sha256)).size === 52, "Boss runtime cases must remain visually distinct");
check(report.cases.every((item) => item.mode === "combat" && item.hudVisible && /^[a-f0-9]{64}$/.test(item.sha256)),
  "a Boss runtime case lacks combat/HUD evidence or a screenshot hash");
check(Object.keys(report.assetFiles || {}).length === 24, "five formal Bosses must keep all twenty-four authored atlases");

Object.entries(report.assetFiles || {}).forEach(([name, expected]) => {
  const file = path.join(root, name);
  check(fs.existsSync(file), `missing ${name}`);
  const dimensions = pngDimensions(file);
  check(dimensions.width === expected.width && dimensions.height === expected.height, `${name} dimensions drifted`);
  check(expected.width / expected.frames === 320 && expected.height === 320, `${name} must remain a 320px horizontal atlas`);
  check(sha256(file) === expected.sha256, `${name} evidence is stale`);
});

Object.entries(report.sourceHashes || {}).forEach(([name, expected]) => {
  const file = path.join(root, name);
  check(fs.existsSync(file) && sha256(file) === expected, `runtime evidence is stale for ${name}`);
});

const combatSource = fs.readFileSync(path.join(root, "src/v2/combat/systems.js"), "utf8");
check(combatSource.includes("const FORMAL_CARTOON_BOSS_DEFS") && combatSource.includes("function drawFormalCartoonBoss"),
  "formal Boss definition or renderer is missing");
check(combatSource.includes("enemy.bossPatternMax = warningTime") && combatSource.includes("enemy.bossPatternReleaseKind = kind"),
  "real Boss warning/release state is not bound to authored animation");
check(combatSource.includes("bossPatternReleaseTime = 0.28") && combatSource.includes("frame = enemy.bossPatternReleaseTime"),
  "release-frame linger or recovery is missing");
check(combatSource.includes("/^boss-(lead|director|delivery|client|ceo)-") && combatSource.includes("formalBossDebugFrame"),
  "deterministic Boss browser pose harness is missing");
check(combatSource.includes('chargeDuration: 1.05') && combatSource.includes('launchAt: 0.35')
  && combatSource.includes('recoverAt: 0.94'),
  "Independent Delivery charge timing is not bound to its authored windup and impact frames");
check(combatSource.includes('attackDuration: 0.82') && combatSource.includes('impactAt: 0.68')
  && combatSource.includes('formalCartoonEnemyDef(state, enemy) || formalCartoonBossDef(state, enemy)'),
  "Big Client ordinary call must bind the authored release frame and receiver muzzle to the real projectile");
check(combatSource.includes('rangedAttack: true, chargeAttack: true') && combatSource.includes('attackDuration: 0.88')
  && combatSource.includes('chargeDuration: 1.15') && combatSource.includes('launchAt: 0.36')
  && combatSource.includes('recoverAt: 0.9') && combatSource.includes('chargeDef.chargeDuration || chargeDef.attackDuration'),
  "Final Approval CEO must bind separate stamp and drive-lever timelines to its hybrid ranged/charge behavior");
check(Object.values(report.assertions || {}).every(Boolean), "one or more Boss assertions did not pass");
check(Array.isArray(report.remainingBlockers) && report.remainingBlockers.length === 0, "cleared Boss blockers drifted");

console.log(JSON.stringify({
  entry: report.entry,
  bossTypes: report.bossTypes,
  runtimeCases: report.cases.length,
  assets: Object.keys(report.assetFiles).length,
  targetVisibleHeights: [report.runtimeTarget.leadVisibleHeight, report.runtimeTarget.directorVisibleHeight,
    report.runtimeTarget.deliveryVisibleHeight, report.runtimeTarget.clientVisibleHeight,
    report.runtimeTarget.ceoVisibleHeight],
  status: report.status
}, null, 2));
