const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const assetRoot = path.join(root, "assets", "cartoon-character-system");
const manifest = JSON.parse(fs.readFileSync(path.join(assetRoot, "asset-manifest.json"), "utf8"));
const matrixReport = JSON.parse(fs.readFileSync(path.join(root, "character-walk-runtime-matrix-report.json"), "utf8"));
const combatSource = fs.readFileSync(path.join(root, "src", "v2", "combat", "systems.js"), "utf8");
const mainSource = fs.readFileSync(path.join(root, "main.js"), "utf8");
const stateSource = fs.readFileSync(path.join(root, "src", "v2", "runtime", "state.js"), "utf8");
const markerFixedSource = fs.readFileSync(path.join(root, "src", "v2", "demo-v2", "marker-fixed.js"), "utf8");

function check(condition, message) {
  if (!condition) throw new Error("Character walk state QA: " + message);
}

function pngDimensions(file) {
  const buffer = fs.readFileSync(file);
  check(buffer.length > 24, "PNG is too small");
  check(buffer.subarray(1, 4).toString("ascii") === "PNG", "asset is not a PNG");
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

check(manifest.schemaVersion === 1, "unsupported manifest schema");
check(Array.isArray(manifest.assets) && manifest.assets.length === 1,
  "manifest must contain one authoritative shared body atlas");
check(JSON.stringify(manifest.compositeContract) === JSON.stringify([
  "weapon-rig-back",
  "neutral-worker-body",
  "weapon-rig-front",
  "aim-facing-weapon",
  "route-state-effects"
]), "composite order drifted");

const asset = manifest.assets.find((item) => item.role === "shared-player-body-walk-atlas");
check(asset, "shared body atlas is missing");
const atlasPath = path.join(assetRoot, asset.file);
check(fs.existsSync(atlasPath), `missing ${asset.file}`);
check(fs.statSync(atlasPath).size > 100000, "atlas is unexpectedly small");
check(asset.readiness === "runtime-ready", "shared character system has not passed its runtime gate");
check(asset.role === "shared-player-body-walk-atlas", "shared body role drifted");

const dimensions = pngDimensions(atlasPath);
check(dimensions.width === 1260 && dimensions.height === 2480, "atlas dimensions drifted");
const layout = manifest.sharedLayout;
check(layout.columns === 3 && layout.rows === 4, "atlas grid must remain 3 x 4");
check(layout.cellWidth === 420 && layout.cellHeight === 620, "atlas cell contract drifted");
check(layout.columns * layout.cellWidth === dimensions.width, "column geometry does not fill atlas");
check(layout.rows * layout.cellHeight === dimensions.height, "row geometry does not fill atlas");

check(JSON.stringify(layout.directionOrder) === JSON.stringify(["down", "right", "up", "left"]),
  "direction order drifted");
check(JSON.stringify(layout.phaseOrder) === JSON.stringify(["idle", "step-a", "step-b"]),
  "phase order drifted");
check(layout.frameCount === 12, "four directions x three phases are required");
check(layout.footBaselineY === 590 && layout.bodyCenterX === 210, "shared anchor contract drifted");
check(layout.rightDirectionDerivedByMirroringLeft === true, "right direction must preserve left-side identity");

check(asset.evidence.targetScaleChecked === true, "78px and 132px evidence missing");
check(asset.evidence.alphaBoundsChecked === true && asset.evidence.fourCornersTransparent === true,
  "alpha evidence missing");
check(asset.evidence.footBaselineAligned === true && asset.evidence.oppositeWalkStepsChecked === true,
  "walk alignment evidence missing");
check(asset.evidence.runtimeAtlasSelectionConnected === true, "runtime body-atlas selection evidence is missing");
check(asset.evidence.walkCadenceConnected === true, "runtime walk cadence evidence is missing");
check(asset.evidence.runtimeWalkMatrixChecked === true && asset.evidence.runtimeWalkMatrixCases === 576,
  "runtime body walk-matrix evidence is missing");
check(asset.evidence.runtimeActionMatrixChecked === true && asset.evidence.runtimeActionMatrixCases === 64 &&
  asset.evidence.totalRuntimeMatrixCases === 640, "runtime body action-matrix evidence is missing");
check(asset.evidence.motionJudgmentAligned === true,
  "attack, hit and completion motion judgment has not passed");
check(Array.isArray(asset.blockers) && asset.blockers.length === 0, "cleared body blockers drifted");

const expectedWeapons = ["marker", "thermos", "scissors", "correction"];
check(Array.isArray(manifest.weaponRigSets) && manifest.weaponRigSets.length === expectedWeapons.length,
  "all four weapon rig sets are required");
check(JSON.stringify(manifest.weaponRigSets.map((item) => item.weapon)) === JSON.stringify(expectedWeapons),
  "weapon rig order or identity drifted");
manifest.weaponRigSets.forEach((rig) => {
  [rig.backFile, rig.frontFile].forEach((name) => {
    const file = path.join(assetRoot, name);
    check(fs.existsSync(file) && fs.statSync(file).size > 1000, `${name} is missing or too small`);
    const rigDimensions = pngDimensions(file);
    check(rigDimensions.width === dimensions.width && rigDimensions.height === dimensions.height,
      `${name} does not match the body atlas dimensions`);
  });
  check(rig.readiness === "runtime-ready", `${rig.weapon} rig has not passed runtime integration`);
  check(Array.isArray(rig.routeChannels) && rig.routeChannels.length === 2,
    `${rig.weapon} must preserve two route channels for mixed builds`);
});
check(manifest.rigSetEvidence.allBodyPixelsExcluded === true, "rig atlases must not bake a second character body");
check(manifest.rigSetEvidence.fourDirectionsComposited === true &&
  manifest.rigSetEvidence.threePhasesComposited === true, "four-direction three-phase composite evidence missing");
check(manifest.rigSetEvidence.runtimeLayerSelectionConnected === true,
  "runtime rig-layer selection evidence is missing");
check(manifest.rigSetEvidence.mixedRouteRuntimeChecked === true,
  "mixed-route runtime evidence is missing");
check(manifest.rigSetEvidence.runtimeWalkMatrixChecked === true &&
  manifest.rigSetEvidence.runtimeWalkMatrixCases === 576,
  "runtime rig walk-matrix evidence is missing");
check(manifest.rigSetEvidence.runtimeActionMatrixChecked === true &&
  manifest.rigSetEvidence.runtimeActionMatrixCases === 64 &&
  manifest.rigSetEvidence.totalRuntimeMatrixCases === 640,
  "runtime rig action-matrix evidence is missing");
check(manifest.rigSetEvidence.motionJudgmentAligned === true,
  "rig action-state judgment has not passed");
check(Array.isArray(manifest.rigSetBlockers) && manifest.rigSetBlockers.length === 0,
  "cleared rig blockers drifted");

[
  "neutral-worker-walk-v1.png",
  "marker-rig-back-v1.png", "marker-rig-front-v1.png",
  "thermos-rig-back-v1.png", "thermos-rig-front-v1.png",
  "scissors-rig-back-v1.png", "scissors-rig-front-v1.png",
  "correction-rig-back-v1.png", "correction-rig-front-v1.png"
].forEach((name) => check(combatSource.indexOf(name) >= 0, `${name} is not connected to runtime loading`));
check(combatSource.indexOf("function sliceGridAtlas") >= 0, "runtime atlas slicer is missing");
check(combatSource.indexOf("function cartoonWalkPhase") >= 0 && combatSource.indexOf("/ 0.115") >= 0,
  "A/B walk cadence contract is missing");
check(combatSource.indexOf("state.player.walkClock") >= 0 && combatSource.indexOf("state.player.walkMoving") >= 0,
  "movement state is not driving the shared walk clock");
expectedWeapons.forEach((weapon) => {
  const callPattern = new RegExp(`drawCartoonLayeredPlayer\\(\\s*ctx,\\s*state,\\s*"${weapon}"`);
  check(callPattern.test(combatSource), `${weapon} does not use the shared layered character renderer`);
});
check(combatSource.indexOf("layer.routeA") >= 0 && combatSource.indexOf("layer.routeB") >= 0,
  "independent route A/B rig masks are missing");
check(combatSource.indexOf("embeddedBasePack ? 1 : 0") >= 0,
  "Thermos must not duplicate its embedded Lv1 route packs");
check(combatSource.indexOf("function applyPlayerActionTransform") >= 0 &&
  combatSource.indexOf("attackReactionTime") >= 0 &&
  combatSource.indexOf("hitReactionTime") >= 0 &&
  combatSource.indexOf("completionTime") >= 0,
  "shared attack, hit and completion transforms are missing");
check(stateSource.indexOf("attackReactionTime: 0") >= 0 &&
  stateSource.indexOf("hitReactionTime: 0") >= 0 &&
  stateSource.indexOf("completionTime: 0") >= 0,
  "player action-state defaults are missing");
check(markerFixedSource.indexOf("state.player.completionTime = 0.82") >= 0,
  "encounter completion does not trigger the shared completion motion");
check(mainSource.indexOf('params.get("walkPose")') >= 0 &&
  mainSource.indexOf('debugState.player.walkClock = walkPhase === "b" ? 0.116 : 0') >= 0,
  "deterministic debug walk-pose harness is missing");
check(mainSource.indexOf('params.get("walkMatrix")') >= 0 &&
  mainSource.indexOf("function runDebugWalkMatrix") >= 0,
  "runtime browser matrix harness is missing");
check(mainSource.indexOf('params.get("actionPose")') >= 0,
  "deterministic debug action-pose harness is missing");

check(matrixReport.schemaVersion === 1 && matrixReport.entry === "demo-v3-14.html",
  "runtime matrix report identity drifted");
check(matrixReport.matrix.status === "passed", "runtime matrix report did not pass");
check(matrixReport.matrix.caseCount === 576 && matrixReport.matrix.expectedCaseCount === 576,
  "runtime matrix must cover 4 weapons x 4 directions x 3 phases x 12 route states");
check(matrixReport.matrix.walkGroups === 192 && matrixReport.matrix.distinctWalkGroups === 192,
  "one or more idle/A/B runtime groups collide");
check(matrixReport.matrix.routeGroups === 48 && matrixReport.matrix.distinctRouteGroups === 48,
  "one or more route-state runtime groups collide");
check(matrixReport.matrix.emptyCaseCount === 0 && matrixReport.matrix.runtimeErrorCount === 0,
  "runtime matrix contains an empty player crop or browser error");
check(matrixReport.matrix.actionCaseCount === 64 && matrixReport.matrix.expectedActionCaseCount === 64 &&
  matrixReport.matrix.totalCaseCount === 640,
  "runtime action matrix must cover 4 weapons x 4 directions x 4 action states");
check(matrixReport.matrix.actionGroups === 16 && matrixReport.matrix.distinctActionGroups === 16,
  "one or more neutral/attack/hit/complete runtime groups collide");
check(matrixReport.matrix.emptyActionCaseCount === 0,
  "runtime action matrix contains an empty player crop");
check(Array.isArray(matrixReport.routeStates) && matrixReport.routeStates.length === 12,
  "runtime route-state coverage drifted");
Object.keys(matrixReport.sourceHashes || {}).forEach((name) => {
  const file = path.join(root, name);
  check(fs.existsSync(file), `matrix source hash target is missing: ${name}`);
  check(sha256(file) === matrixReport.sourceHashes[name],
    `runtime matrix evidence is stale for ${name}; rerun browser matrix`);
});
check(Array.isArray(matrixReport.remainingBlockers) && matrixReport.remainingBlockers.length === 0,
  "cleared runtime character blockers drifted");

console.log(JSON.stringify({
  asset: asset.file,
  directions: layout.directionOrder.length,
  phases: layout.phaseOrder.length,
  frames: layout.frameCount,
  weaponRigSets: manifest.weaponRigSets.length,
  rigLayers: manifest.weaponRigSets.length * 2,
  runtimeMatrixCases: matrixReport.matrix.totalCaseCount,
  checkedTargetHeights: [132, 78],
  readiness: asset.readiness,
  status: "passed"
}, null, 2));
