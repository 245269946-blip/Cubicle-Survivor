const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "cartoon-marker-slice.html"), "utf8");
const css = fs.readFileSync(path.join(root, "cartoon-marker-slice.css"), "utf8");
const js = fs.readFileSync(path.join(root, "src", "cartoon-marker-slice.js"), "utf8");
const assetManifest = JSON.parse(fs.readFileSync(
  path.join(root, "assets", "cartoon-marker-slice", "asset-manifest.json"),
  "utf8"
));
const enemyAtlasContract = JSON.parse(fs.readFileSync(
  path.join(root, "assets", "cartoon-marker-slice", "enemy-action-atlas-contract.json"),
  "utf8"
));
const enemyRuntimeReport = JSON.parse(fs.readFileSync(
  path.join(root, "enemy-action-runtime-report.json"),
  "utf8"
));
const officeAnimationContract = JSON.parse(fs.readFileSync(
  path.join(root, "assets", "cartoon-marker-slice", "office-chibi-animation-contract.json"),
  "utf8"
));
const officeAnimationReport = JSON.parse(fs.readFileSync(
  path.join(root, "office-chibi-animation-runtime-report.json"),
  "utf8"
));
const sharedCharacterManifest = JSON.parse(fs.readFileSync(
  path.join(root, "assets", "cartoon-character-system", "asset-manifest.json"),
  "utf8"
));

function check(condition, message) {
  if (!condition) throw new Error("Cartoon marker slice QA: " + message);
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

[
  "game", "startPanel", "upgradePanel", "completePanel", "startButton",
  "upgradeButton", "restartButton", "remaining", "progressFill", "buildName"
].forEach((id) => check(html.includes(`id="${id}"`), `missing #${id}`));

check(html.includes("清空 30 份积压"), "task must stay concrete and short");
check(html.includes("复写"), "upgrade name missing");
check(html.includes("多画一条"), "immediate upgrade result missing");
check(html.includes("已归档"), "completion result missing");
check(!html.includes("组件") && !html.includes("工坊") && !html.includes("协同"), "P0 entry leaked parallel systems");
check(css.includes("@media (max-width: 760px)"), "narrow-screen treatment missing");

check(/const TOTAL = 30;/.test(js), "task quota drifted from 30");
check(js.includes("state.killed >= 11"), "upgrade timing gate missing");
check(js.includes("state.upgraded ? [-13, 13] : [0]"), "double-line payoff missing");
check(js.includes("state.attacks = []"), "completion does not clear attack residue");
check(js.includes("remaining === 0"), "zero-state archive prop missing");
check(js.includes("window.CartoonMarkerSlice"), "test/debug contract missing");

const runtimeAssets = [
  "office-arena-v1.webp",
  "marker-weapon-v2.png",
  "backlog-enemy-actions-v2.png",
  "backlog-enemy-walk-v3.png",
  "backlog-enemy-slam-v3.png",
  "urgent-email-enemy-actions-v2.png",
  "urgent-email-run-v3.png",
  "urgent-email-dash-v3.png"
];
runtimeAssets.forEach((name) => {
  const file = path.join(root, "assets", "cartoon-marker-slice", name);
  check(fs.existsSync(file), `missing asset ${name}`);
  check(fs.statSync(file).size > 10000, `asset ${name} is unexpectedly small`);
});
[
  "neutral-worker-walk-v1.png",
  "marker-rig-back-v1.png",
  "marker-rig-front-v1.png"
].forEach((name) => {
  const file = path.join(root, "assets", "cartoon-character-system", name);
  check(fs.existsSync(file), `missing shared character asset ${name}`);
  check(fs.statSync(file).size > 10000, `shared character asset ${name} is unexpectedly small`);
});

check(assetManifest.schemaVersion === 1, "unsupported asset manifest schema");
check(Array.isArray(assetManifest.assets), "asset manifest must contain assets");
check(assetManifest.assets.length >= runtimeAssets.length, "asset manifest omits audited assets");

const allowedReadiness = new Set(["reference-only", "prototype-cutout", "runtime-ready"]);
assetManifest.assets.forEach((asset) => {
  const file = path.join(root, "assets", "cartoon-marker-slice", asset.file);
  check(fs.existsSync(file), `manifest asset is missing: ${asset.file}`);
  check(allowedReadiness.has(asset.readiness), `invalid readiness for ${asset.file}`);
  check(asset.source && asset.source.width > 0 && asset.source.height > 0, `missing source dimensions for ${asset.file}`);

  if (asset.readiness === "runtime-ready") {
    check(asset.evidence && asset.evidence.targetScaleChecked === true, `${asset.file} lacks target-scale evidence`);
    check(asset.evidence.cameraMatched === true, `${asset.file} lacks camera-fit evidence`);
    check(asset.evidence.aspectPreserved === true, `${asset.file} distorts at runtime`);
    if (asset.role !== "background") {
      check(asset.evidence.alphaBoundsChecked === true, `${asset.file} lacks alpha-bounds evidence`);
      check(asset.evidence.motionJudgmentAligned === true, `${asset.file} lacks motion/judgment evidence`);
    }
  }

  if (asset.readiness === "prototype-cutout") {
    check(Array.isArray(asset.blockers) && asset.blockers.length > 0, `${asset.file} needs explicit production blockers`);
  }
});

check(assetManifest.assets.filter((asset) => asset.readiness === "runtime-ready").length === 8,
  "arena, aiming weapon, action atlases and both enemies' motion atlases must pass the runtime-ready gate");
check(assetManifest.assets.filter((asset) => asset.readiness === "prototype-cutout").length === 4,
  "only the four superseded P0 single-frame player directions remain prototypes");
check(assetManifest.assets.filter((asset) => asset.readiness === "reference-only").length === 4,
  "superseded player and single-pose enemy images must remain reference-only");
check(js.includes('playerBody: "../cartoon-character-system/neutral-worker-walk-v1.png"'),
  "shared neutral worker atlas is not mapped at runtime");
check(js.includes('markerRigBack: "../cartoon-character-system/marker-rig-back-v1.png"') &&
  js.includes('markerRigFront: "../cartoon-character-system/marker-rig-front-v1.png"'),
  "Marker back/front wear layers are not mapped at runtime");
check(js.includes("const playerDirectionRows") && js.includes("Math.floor(state.time / .115)"),
  "four-direction idle/A/B player selection is missing");
check(js.includes("state.player.bodyDirection = inputDirection"), "quick keyboard taps do not update body direction immediately");
check(js.includes("drawPlayerAtlasLayer(images.markerRigBack") &&
  js.includes("drawPlayerAtlasLayer(images.playerBody") &&
  js.includes("drawPlayerAtlasLayer(images.markerRigFront"),
  "player draw order is not back rig -> shared body -> front rig");
check(js.includes('bodyDirection: state.player.bodyDirection'), "direction state is not exposed to the debug contract");
check(js.includes('markerWeapon: "marker-weapon-v2.png"'), "independent aiming weapon is not mapped at runtime");
check(js.includes("ctx.rotate(p.aimAngle)"), "weapon sprite does not follow authoritative aim angle");
check(js.includes('backlog: "backlog-enemy-actions-v2.png"'), "backlog action atlas is not mapped at runtime");
check(js.includes('backlogWalk: "backlog-enemy-walk-v3.png"') &&
  js.includes('backlogSlam: "backlog-enemy-slam-v3.png"'),
  "backlog walk/slam sequence atlases are not mapped at runtime");
check(js.includes('emailActions: "urgent-email-enemy-actions-v2.png"'), "email action atlas is not mapped at runtime");
check(js.includes('emailRun: "urgent-email-run-v3.png"') &&
  js.includes('emailDash: "urgent-email-dash-v3.png"'),
  "email run/dash sequence atlases are not mapped at runtime");
check(js.includes('e.debugSequence === "run"') && js.includes('e.debugSequence === "dash"'),
  "deterministic email sequence frames are not connected");
check(js.includes('e.debugSequence === "walk"') && js.includes('e.debugSequence === "slam"'),
  "deterministic backlog sequence frames are not connected");
check(js.includes("slamProgress >= .62") && js.includes("e.slamHit = true") &&
  js.includes('e.type === "email" && touch <'),
  "backlog slam impact is not the authoritative contact-damage moment");
check(js.includes("debugSlamProbe") && js.includes('dataset.debugSlamProbe = "1"'),
  "deterministic backlog slam judgment probe is missing");
check(js.includes("debugEnemyFacing") && js.includes("facing * sx"),
  "enemy left/right facing mirror is not wired to movement and fixed-frame QA");
check(js.includes("function enemyActionFrame") && js.includes("enemyActionAtlas.frames.attack") &&
  js.includes("enemyActionAtlas.frames.hit") && js.includes("enemyActionAtlas.frames.defeat"),
  "enemy movement/attack/hit/defeat state selection is incomplete");
check(js.includes("e.deathTime = .34") && js.includes("!e.dead || e.deathTime > 0"),
  "defeat pose is removed before it can be seen");
check(js.includes('get("enemyPose")') && js.includes("function applyDebugEnemyPose"),
  "deterministic enemy-pose browser entry is missing");

check(enemyAtlasContract.schemaVersion === 1, "unsupported enemy atlas contract schema");
check(enemyAtlasContract.layout.width === 1280 && enemyAtlasContract.layout.height === 320,
  "enemy atlas dimensions drifted");
check(JSON.stringify(enemyAtlasContract.layout.frameOrder) === JSON.stringify(["move", "attack", "hit", "defeat"]),
  "enemy action frame order drifted");
check(enemyAtlasContract.layout.cellWidth === 320 && enemyAtlasContract.layout.baselineY === 296,
  "enemy atlas cell or baseline drifted");
const p0EnemyActionAssets = (enemyAtlasContract.assets || []).filter((asset) =>
  asset.enemy === "backlog" || asset.enemy === "email");
check(p0EnemyActionAssets.length === 2 &&
  p0EnemyActionAssets.some((asset) => asset.enemy === "backlog") &&
  p0EnemyActionAssets.some((asset) => asset.enemy === "email"),
  "both P0 enemy action atlases are required");
p0EnemyActionAssets.forEach((asset) => {
  check(asset.fourCornersTransparent === true, `${asset.file} corners are not transparent`);
  check(Array.isArray(asset.runtimeBounds) && asset.runtimeBounds.length === 4,
    `${asset.file} does not contain four normalized poses`);
  asset.runtimeBounds.forEach((bounds, index) => {
    check(bounds[0] >= 0 && bounds[1] >= 0 && bounds[2] <= 320 && bounds[3] === 296,
      `${asset.file} frame ${index} clips or misses the shared baseline`);
  });
  const manifestAsset = assetManifest.assets.find((item) => item.file === asset.file);
  check(manifestAsset && manifestAsset.readiness === "runtime-ready",
    `${asset.file} has not passed the runtime-ready gate`);
  check(manifestAsset.evidence.runtimePoseMatrixChecked === true &&
    manifestAsset.evidence.runtimePoseMatrixCases === 4 &&
    manifestAsset.evidence.liveRuntimeChecked === true &&
    manifestAsset.evidence.motionJudgmentAligned === true,
    `${asset.file} lacks browser pose-matrix or live-runtime evidence`);
});

check(enemyRuntimeReport.schemaVersion === 1 && enemyRuntimeReport.entry === "cartoon-marker-slice.html",
  "enemy runtime report identity drifted");
check(enemyRuntimeReport.status === "passed" && enemyRuntimeReport.caseCount === 8 &&
  enemyRuntimeReport.distinctCaseCount === 8 && enemyRuntimeReport.runtimeErrorCount === 0,
  "enemy runtime pose matrix did not pass all eight distinct cases");
check(JSON.stringify(enemyRuntimeReport.actions) === JSON.stringify(["move", "attack", "hit", "defeat"]),
  "enemy runtime action coverage drifted");
check(Object.keys(enemyRuntimeReport.screenshotHashes || {}).length === 8 &&
  new Set(Object.values(enemyRuntimeReport.screenshotHashes)).size === 8,
  "enemy runtime screenshots are missing or collide");
Object.keys(enemyRuntimeReport.sourceHashes || {}).forEach((name) => {
  const file = path.join(root, name);
  check(fs.existsSync(file), `enemy runtime hash target is missing: ${name}`);
  check(sha256(file) === enemyRuntimeReport.sourceHashes[name],
    `enemy runtime evidence is stale for ${name}; rerun browser pose matrix`);
});

check(sharedCharacterManifest.sharedLayout.frameCount === 12 &&
  sharedCharacterManifest.sharedLayout.directionOrder.join(",") === "down,right,up,left" &&
  sharedCharacterManifest.sharedLayout.phaseOrder.join(",") === "idle,step-a,step-b",
  "shared player atlas contract drifted");
check(sharedCharacterManifest.assets[0].readiness === "runtime-ready" &&
  sharedCharacterManifest.rigSetEvidence.totalRuntimeMatrixCases === 640,
  "shared player identity or Marker wear layers lost their runtime-ready evidence");

check(officeAnimationContract.schemaVersion === 1 &&
  officeAnimationContract.cellWidth === 320 && officeAnimationContract.baselineY === 296,
  "office animation atlas cell or baseline drifted");
const p0OfficeAnimationAssets = (officeAnimationContract.assets || []).filter((asset) =>
  ["backlog-walk", "backlog-slam", "email-run", "email-dash"].includes(asset.sequence));
check(p0OfficeAnimationAssets.length === 4,
  "backlog walk/slam and email run/dash contracts are all required");
p0OfficeAnimationAssets.forEach((asset) => {
  const expectedFrames = asset.sequence.endsWith("walk") || asset.sequence.endsWith("run") ? 4 : 5;
  check(asset.frames === expectedFrames && asset.runtimeBounds.length === expectedFrames,
    `${asset.file} frame count drifted`);
  check(asset.fourCornersTransparent === true, `${asset.file} corners are not transparent`);
  asset.runtimeBounds.forEach((bounds, index) => {
    check(bounds[0] >= 0 && bounds[1] >= 0 && bounds[2] <= 320 && bounds[3] === 296,
      `${asset.file} frame ${index} clips or misses the shared baseline`);
  });
  const manifestAsset = assetManifest.assets.find((item) => item.file === asset.file);
  check(manifestAsset && manifestAsset.readiness === "runtime-ready" &&
    manifestAsset.evidence.runtimePoseMatrixCases === expectedFrames &&
    manifestAsset.evidence.liveRuntimeChecked === true,
    `${asset.file} lacks fixed-frame or live-runtime evidence`);
});

check(officeAnimationReport.schemaVersion === 1 &&
  officeAnimationReport.entry === "cartoon-marker-slice.html" &&
  officeAnimationReport.status === "passed",
  "office animation runtime report identity drifted");
check(officeAnimationReport.caseCount === 32 && officeAnimationReport.distinctCaseCount === 32 &&
  officeAnimationReport.playerCases === 12 && officeAnimationReport.backlogWalkCases === 4 &&
  officeAnimationReport.backlogSlamCases === 5 && officeAnimationReport.emailRunCases === 4 &&
  officeAnimationReport.emailDashCases === 5 && officeAnimationReport.facingCases === 2 &&
  officeAnimationReport.runtimeErrorCount === 0,
  "player/enemy animation matrix did not pass all 32 distinct cases");
check(officeAnimationReport.liveRuntime.started === true &&
  officeAnimationReport.liveRuntime.upgradeApplied === true &&
  officeAnimationReport.liveRuntime.consoleErrors === 0 &&
  officeAnimationReport.liveRuntime.slamProbe.startHp === 100 &&
  officeAnimationReport.liveRuntime.slamProbe.windupHp === 100 &&
  officeAnimationReport.liveRuntime.slamProbe.impactHp === 93 &&
  officeAnimationReport.liveRuntime.slamProbe.consoleErrors === 0,
  "new animations were not verified through a live upgraded run");
check(Object.keys(officeAnimationReport.screenshotHashes || {}).length === 32 &&
  new Set(Object.values(officeAnimationReport.screenshotHashes)).size === 32,
  "office animation screenshots are missing or collide");
Object.keys(officeAnimationReport.sourceHashes || {}).forEach((name) => {
  const file = path.join(root, name);
  check(fs.existsSync(file), `office animation hash target is missing: ${name}`);
  check(sha256(file) === officeAnimationReport.sourceHashes[name],
    `office animation evidence is stale for ${name}; rerun the 32-case browser matrix`);
});

console.log(JSON.stringify({
  entry: "cartoon-marker-slice.html",
  quota: 30,
  upgrade: "复写｜多画一条",
  assets: runtimeAssets.length,
  runtimeReadyAssets: assetManifest.assets.filter((asset) => asset.readiness === "runtime-ready").length,
  prototypeCutouts: assetManifest.assets.filter((asset) => asset.readiness === "prototype-cutout").length,
  referenceOnlyAssets: assetManifest.assets.filter((asset) => asset.readiness === "reference-only").length,
  enemyActionCases: enemyRuntimeReport.caseCount,
  officeAnimationCases: officeAnimationReport.caseCount,
  status: "passed"
}, null, 2));
