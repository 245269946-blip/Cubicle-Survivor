const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const report = JSON.parse(fs.readFileSync(path.join(root, "formal-cartoon-enemy-runtime-report.json"), "utf8"));

function check(condition, message) {
  if (!condition) throw new Error("Formal cartoon enemy QA: " + message);
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
check(report.phase === "four-weapon-v3-15" && report.status === "passed", "V3.15 runtime report did not pass");
check(JSON.stringify(report.viewport) === JSON.stringify([1280, 720]), "runtime viewport drifted");
check(report.runtimeTarget.baseBodySize === 48, "formal enemies must be judged at the real 48px base body size");
check(report.runtimeTarget.formalVisualScale === 1.25,
  "formal enemies must retain the readability scale used by the V3.15 renderer");
check(report.runtimeTarget.firstLoadSettleMs >= 4000, "first-load atlas settle was not represented in evidence");
check(Array.isArray(report.cases) && report.cases.length === 48, "eight enemies need six representative runtime cases each");

const expectedCases = [
  "todo-move-0", "todo-move-1", "todo-attack-0", "todo-attack-3", "todo-hit", "todo-defeat",
  "email-move-0", "email-move-1", "email-attack-0", "email-attack-3", "email-hit", "email-defeat",
  "meeting-move-0", "meeting-move-1", "meeting-attack-0", "meeting-attack-3", "meeting-hit", "meeting-defeat",
  "ping-move-0", "ping-move-1", "ping-attack-0", "ping-attack-3", "ping-hit", "ping-defeat",
  "deadline-move-0", "deadline-move-1", "deadline-attack-0", "deadline-attack-3", "deadline-hit", "deadline-defeat",
  "scope-move-0", "scope-move-1", "scope-attack-0", "scope-attack-3", "scope-hit", "scope-defeat",
  "approval-move-0", "approval-move-1", "approval-attack-0", "approval-attack-3", "approval-hit", "approval-defeat",
  "client-move-0", "client-move-1", "client-attack-0", "client-attack-3", "client-hit", "client-defeat"
];
check(JSON.stringify(report.cases.map((item) => item.requested)) === JSON.stringify(expectedCases), "runtime case order or coverage drifted");
check(report.cases.every((item) => item.mode === "combat" && item.hudVisible && /^[a-f0-9]{64}$/.test(item.sha256)),
  "a runtime case is missing combat/HUD evidence or a screenshot hash");
["todo", "email", "meeting", "ping", "deadline", "scope", "approval", "client"].forEach((type) => {
  const hashes = report.cases.filter((item) => item.requested.indexOf(type + "-") === 0).map((item) => item.sha256);
  check(new Set(hashes).size === hashes.length, `${type} move, attack, hit, and defeat evidence must remain visually distinct`);
});

Object.entries(report.assetFiles || {}).forEach(([name, expected]) => {
  const file = path.join(root, name);
  check(fs.existsSync(file), `missing ${name}`);
  const dimensions = pngDimensions(file);
  check(dimensions.width === expected.width && dimensions.height === expected.height, `${name} dimensions drifted`);
  check(expected.width / expected.frames === 320 && expected.height === 320, `${name} must remain a horizontal square-cell atlas`);
  check(sha256(file) === expected.sha256, `${name} evidence is stale`);
});

Object.entries(report.sourceHashes || {}).forEach(([name, expected]) => {
  const file = path.join(root, name);
  check(fs.existsSync(file) && sha256(file) === expected, `runtime evidence is stale for ${name}`);
});

const combatSource = fs.readFileSync(path.join(root, "src/v2/combat/systems.js"), "utf8");
const stateSource = fs.readFileSync(path.join(root, "src/v2/runtime/state.js"), "utf8");
const mainSource = fs.readFileSync(path.join(root, "main.js"), "utf8");
check(combatSource.includes("function updateFormalContactAttack") && combatSource.includes("progress >= visualDef.impactAt"),
  "authored contact-impact timing is missing");
check(combatSource.includes('visualDef.attackKind === "ranged"') && combatSource.includes("enemy.rangedAttackFired") &&
  combatSource.includes('formalRangedDef.attackKind === "ranged"') && combatSource.includes("formalRangedDef.muzzleOffset"),
  "authored ranged release timing or visible muzzle origin is missing");
check(combatSource.includes("const burstCount = rangedVisualDef.burstCount || 1") && combatSource.includes("burstSpread: 0.14") &&
  combatSource.includes("kiteDistance: 215"), "Client double-call burst or close ranged identity is missing");
check(combatSource.includes('formalChargeVisualDef') && combatSource.includes("enemy.chargeHit") &&
  combatSource.includes("chargeProgress >= formalChargeVisualDef.launchAt") && combatSource.includes("chargeProgress < formalChargeVisualDef.recoverAt"),
  "authored charge launch window or one-hit lock is missing");
check(combatSource.includes('deadVisualDef.attackKind === "split"') && combatSource.includes("enemy.splitReleased") &&
  combatSource.includes("splitProgress >= deadVisualDef.releaseAt"),
  "authored split release timing or one-release lock is missing");
check(combatSource.includes('formalGuardDef.attackKind === "guard"') && combatSource.includes("enemy.armorGuardHp") &&
  combatSource.includes("enemy.armorBrokenTime") && combatSource.includes("formalGuardDef.brokenDuration"),
  "authored armor guard, break, or recovery timing is missing");
check(combatSource.includes("function drawFormalCartoonEnemy") && combatSource.includes("enemy.deathTime = 0.34"),
  "formal action renderer or defeat linger is missing");
check(stateSource.includes("formalCartoonAssetPass") && mainSource.includes('params.get("formalEnemyPose")'),
  "V3.15 gate or deterministic browser pose harness is missing");
check(Object.values(report.assertions || {}).every(Boolean), "one or more formal asset assertions did not pass");
check(Array.isArray(report.remainingBlockers) && report.remainingBlockers.length === 0, "cleared first-batch blockers drifted");

console.log(JSON.stringify({
  entry: report.entry,
  enemyTypes: report.enemyTypes,
  runtimeCases: report.cases.length,
  assets: Object.keys(report.assetFiles).length,
  targetVisibleHeights: [report.runtimeTarget.todoVisibleHeight, report.runtimeTarget.emailVisibleHeight, report.runtimeTarget.meetingVisibleHeight, report.runtimeTarget.pingVisibleHeight, report.runtimeTarget.deadlineVisibleHeight, report.runtimeTarget.scopeVisibleHeight, report.runtimeTarget.approvalVisibleHeight, report.runtimeTarget.clientVisibleHeight],
  status: report.status
}, null, 2));
