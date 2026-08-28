const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const report = JSON.parse(fs.readFileSync(path.join(root, "formal-cartoon-hud-runtime-report.json"), "utf8"));

function check(condition, message) {
  if (!condition) throw new Error("Formal cartoon HUD QA: " + message);
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

check(report.schemaVersion === 1 && report.entry === "demo-v3-15.html", "report identity drifted");
check(report.status === "passed" && report.phase === "four-weapon-v3-15", "HUD runtime report did not pass");
check(JSON.stringify(report.viewport) === JSON.stringify([1280, 720]), "browser viewport drifted");
check(report.contract.combatProgressionEconomyChanged === false, "HUD pass must remain presentation-only");
check(JSON.stringify(report.contract.persistent) === JSON.stringify([
  "level", "materials", "stage", "task", "time", "pending", "health", "mechanism", "xp", "collapsed-build"
]), "persistent information contract drifted");

const expectedCases = ["normal", "danger", "boss", "growth", "warmup", "build"];
check(Array.isArray(report.cases) && report.cases.length === expectedCases.length, "browser matrix must keep six cases");
check(JSON.stringify(report.cases.map((item) => item.name)) === JSON.stringify(expectedCases), "browser matrix order or identity drifted");
check(new Set(report.cases.map((item) => item.sha256)).size === report.cases.length,
  "every HUD state must retain distinct visual evidence");
check(report.cases.every((item) => item.formalHud && item.runtimeErrors === 0 && !item.topOverlap
  && /^[a-f0-9]{64}$/.test(item.sha256)), "browser evidence lost gate, zero-error, no-overlap, or hash status");

const byName = Object.fromEntries(report.cases.map((item) => [item.name, item]));
check(byName.normal.objectiveWidth === 350 && byName.normal.xpVisible, "normal HUD density or XP strip drifted");
check(byName.danger.healthState === "critical" && byName.danger.health === "16 / 74", "critical-health state drifted");
check(byName.boss.objective.includes("3/17") && byName.boss.objective.includes("待办 1"), "Boss objective was not compact");
check(byName.growth.feedbackSize[0] === 340 && byName.growth.feedbackSize[1] <= 70
  && byName.growth.feedback.includes("下一轮攻击更宽。"), "growth result is no longer immediate or compact");
check(byName.warmup.countdown === "3s" && byName.warmup.statusDisplay === "none" && byName.warmup.buildDisplay === "none"
  && byName.warmup.warmupSize[0] === 760 && byName.warmup.warmupSize[1] <= 90,
"warmup must be genuinely active, compact, and free of competing bottom panels");
check(byName.build.buildSize[0] === 350 && byName.build.buildSize[1] < 320 && byName.build.centerStatusVisible,
  "optional build drawer dimensions or centre status changed");

check(report.domProbe.formalCartoonHud === "true" && report.domProbe.completedCounterDisplay === "none"
  && report.domProbe.xpDisplay === "block" && report.domProbe.runtimeErrors === 0,
"DOM probe lost the formal gate, hidden redundant counter, visible XP strip, or zero-error state");
check(Object.values(report.safeAreaProbe.topHudBottoms).every((value) => value <= 95)
  && Object.values(report.safeAreaProbe.bottomHudStarts).every((value) => value >= 637)
  && report.safeAreaProbe.objectiveSize[0] <= 410 && report.safeAreaProbe.objectiveSize[1] <= 66
  && report.safeAreaProbe.mechanismSize[0] <= 420 && report.safeAreaProbe.mechanismSize[1] <= 48
  && report.safeAreaProbe.collapsedBuildSize[0] <= 210 && report.safeAreaProbe.collapsedBuildSize[1] <= 44,
"combat display-space hard contract drifted");
check(report.v314Isolation.formalCartoonHud === false && report.v314Isolation.runtimeErrors === 0
  && report.v314Isolation.stageMeta.startsWith("Demo V3.14"), "V3.14 isolation drifted");
check(report.bossCacheRegression.coherentSingleCharacter && report.bossCacheRegression.assetQuery === "v=315-formal-3"
  && report.bossCacheRegression.runtimeErrors === 0 && /^[a-f0-9]{64}$/.test(report.bossCacheRegression.sha256),
"Boss sprite cache regression evidence is missing");

Object.entries(report.sourceHashes || {}).forEach(([name, expected]) => {
  const file = path.join(root, name);
  check(fs.existsSync(file) && sha256(file) === expected, `runtime evidence is stale for ${name}`);
});

const css = fs.readFileSync(path.join(root, "generated-skin.css"), "utf8");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const main = fs.readFileSync(path.join(root, "main.js"), "utf8");
const config = fs.readFileSync(path.join(root, "src/v2/demo-v2/four-weapon-fixed.js"), "utf8");
const state = fs.readFileSync(path.join(root, "src/v2/runtime/state.js"), "utf8");
const combat = fs.readFileSync(path.join(root, "src/v2/combat/systems.js"), "utf8");
const vm = fs.readFileSync(path.join(root, "src/v2/ui/view-model.js"), "utf8");
const render = fs.readFileSync(path.join(root, "src/v2/ui/render.js"), "utf8");

check((config.match(/formalCartoonHudPass:\s*true/g) || []).length === 1 && state.includes("formalCartoonHudPass"),
  "formal HUD gate must exist only on the V3.15 config and reach runtime state");
check(css.includes('--formal-hud-paper: #fff3d2')
  && css.includes('.objective-row span:nth-child(3)')
  && css.includes('> .objective-hud .objective-alert')
  && css.includes('> .combat-status span')
  && css.includes('> #buildPanel')
  && css.includes('.warmup-overlay.transition-card.hidden')
  && css.includes('#warmupHint,')
  && css.includes('[data-health-state="critical"]'), "formal material or information-density CSS contract drifted");
check(combat.includes('id.indexOf("formal_") === 0 || id.indexOf("cartoon_") === 0 ? "v=315-formal-3"')
  && combat.includes('/_vfx_v[23]$/.test(id) ? "v=315-vfx-5"'),
  "formal raster assets lost their shared cache fingerprint");
check(vm.includes('formalHud') && vm.includes('? "阶段 " + (markerTest.currentPhase || 1) + "/5 · "'),
  "view model no longer emits the compact stage identity");
check(render.includes('dataset.formalCartoonHud') && render.includes('dataset.transitionActive')
  && render.includes('dataset.healthState') && render.includes('vm.formalHud ? "时间" : "倒计时"'),
"render layer lost the formal HUD states or concise labels");
check(main.includes('params.get("formalHud")') && main.includes('params.get("warmup") === "1"'),
  "deterministic HUD browser harness drifted");
check(index.includes('generated-skin.css?v=52') && index.includes('systems.js?v=96')
  && index.includes('view-model.js?v=30') && index.includes('render.js?v=47') && index.includes('main.js?v=94'),
"runtime cache versions drifted");
check(Object.values(report.assertions || {}).every(Boolean), "one or more HUD assertions did not pass");
check(Array.isArray(report.remainingBlockers) && report.remainingBlockers.length === 0, "cleared HUD blockers drifted");

console.log(JSON.stringify({
  entry: report.entry,
  runtimeCases: report.cases.length,
  persistentFields: report.contract.persistent.length,
  bossCacheRegression: report.bossCacheRegression.coherentSingleCharacter,
  status: report.status
}, null, 2));
