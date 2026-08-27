const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const report = JSON.parse(fs.readFileSync(path.join(root, "formal-cartoon-vfx-runtime-report.json"), "utf8"));

function check(condition, message) {
  if (!condition) throw new Error("Formal cartoon VFX QA: " + message);
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

check(report.schemaVersion === 2 && report.entry === "demo-v3-15.html", "report identity drifted");
check(report.status === "passed" && report.phase === "four-weapon-v3-15", "runtime report did not pass");
check(JSON.stringify(report.viewport) === JSON.stringify([1280, 720]), "browser viewport drifted");
check(report.production.method === "imagegen-raster-atlas"
  && report.production.alphaPipeline === "chroma-key-to-real-alpha"
  && report.production.lineArtFallbackAllowed === false,
"formal VFX must remain generated raster atlases; line-art fallback is forbidden");
check(report.contract.combatProgressionEconomyChanged === false, "VFX pass must remain presentation-only");
check(report.contract.atlas.columns === 4 && report.contract.atlas.rows === 2
  && JSON.stringify(report.contract.frameOrder) === JSON.stringify(["anticipation", "release", "impact", "fade"]),
"atlas or frame-order contract drifted");

const expectedPoses = ["marker-line", "marker-archive", "thermos-steam", "thermos-heat",
  "scissors-closed", "scissors-open", "correction-spray", "correction-error"];
check(report.cases.length === expectedPoses.length
  && JSON.stringify(report.cases.map((item) => item.pose)) === JSON.stringify(expectedPoses),
"browser matrix must retain all eight action identities");
check(report.cases.every((item) => item.vfxGate === "true" && item.frame === 2 && item.runtimeErrors === 0
  && /^(line|area)$/.test(item.geometry) && /^[a-f0-9]{64}$/.test(item.sha256)),
"browser evidence lost gate, geometry, impact frame, hash, or zero-error status");
check(new Set(report.cases.map((item) => item.sha256)).size === report.cases.length,
  "all eight action identities must remain visually distinct");
check(report.frameAudit.length === 4 && report.frameAudit.every((item) => item.distinct === 4
  && item.hashes.length === 4 && new Set(item.hashes).size === 4
  && item.hashes.every((hash) => /^[a-f0-9]{16}$/.test(hash))
  && item.runtimeErrors.every((value) => value === 0)),
"one representative action per weapon must expose four distinct zero-error frames");
check(report.onlineRuntimeEvidence && report.onlineRuntimeEvidence.localAssetMatched
  && report.onlineRuntimeEvidence.assetSha256 === sha256(path.join(root, "assets", "cartoon-office-vfx", "scissors-vfx-v3.png"))
  && report.onlineRuntimeEvidence.scissorsFrames.length === 8
  && report.onlineRuntimeEvidence.scissorsFrames.every((item, index) => item.asset === "formal_scissors_vfx_v3"
    && item.frame === index % 4 && item.vfxGate === "true" && item.geometry === "line" && item.runtimeErrors === 0),
"online GitHub Pages evidence must cover all eight Scissors V3 runtime frames");
check(report.v314Isolation.formalVfxPose === "" && report.v314Isolation.formalVfxAsset === ""
  && report.v314Isolation.formalCartoonVfx === "" && report.v314Isolation.matchingEvents === 0
  && report.v314Isolation.runtimeErrors === 0, "V3.14 isolation drifted");

Object.entries(report.sourceHashes || {}).forEach(([name, expected]) => {
  const file = path.join(root, name);
  check(fs.existsSync(file) && sha256(file) === expected, `runtime evidence is stale for ${name}`);
});

const assetDir = path.join(root, "assets", "cartoon-office-vfx");
const contract = JSON.parse(fs.readFileSync(path.join(assetDir, "cartoon-office-vfx-contract.json"), "utf8"));
check(contract.schemaVersion === 2 && contract.family === "formal-cartoon-office-vfx-v2"
  && contract.layout.columns === 4 && contract.layout.rows === 2
  && contract.layout.width === 1024 && contract.layout.height === 512
  && contract.runtimeRules.transparentByConstruction
  && contract.runtimeRules.eventGeometryAuthoritative
  && contract.runtimeRules.timelineDrivenFrameSelection
  && contract.runtimeRules.scissorsCompleteWeaponEveryFrame
  && contract.runtimeRules.v314GateOff, "asset contract drifted");
contract.assets.forEach((item) => {
  const file = path.join(assetDir, item.file);
  const png = fs.readFileSync(file);
  check(/-v[23]\.png$/.test(item.file) && png.subarray(1, 4).toString("ascii") === "PNG",
    `${item.file} is not a formal PNG atlas`);
  check(png.readUInt32BE(16) === 1024 && png.readUInt32BE(20) === 512,
    `${item.file} lost its exact 4x2 atlas dimensions`);
  check([4, 6].includes(png[25]), `${item.file} lost its alpha channel`);
  check(png.length > 100000, `${item.file} is too small to qualify as painted production art`);
  check(item.source && fs.existsSync(path.join(root, item.source)), `${item.file} lost its generated source provenance`);
});
const scissorsAsset = contract.assets.find((item) => item.weapon === "scissors");
check(scissorsAsset && scissorsAsset.file === "scissors-vfx-v3.png"
  && scissorsAsset.completeWeaponEveryFrame === true
  && scissorsAsset.row0.includes("complete-scissors")
  && scissorsAsset.row1.includes("complete-scissors"),
"Scissors must keep one complete two-ring, pivot, two-blade weapon in every authored frame");

const config = fs.readFileSync(path.join(root, "src/v2/demo-v2/four-weapon-fixed.js"), "utf8");
const state = fs.readFileSync(path.join(root, "src/v2/runtime/state.js"), "utf8");
const combat = fs.readFileSync(path.join(root, "src/v2/combat/systems.js"), "utf8");
const render = fs.readFileSync(path.join(root, "src/v2/ui/render.js"), "utf8");
const main = fs.readFileSync(path.join(root, "main.js"), "utf8");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");

check((config.match(/formalCartoonVfxPass:\s*true/g) || []).length === 1
  && (state.match(/formalCartoonVfxPass/g) || []).length >= 2, "V3.15-only gate or state propagation drifted");
check(render.includes('dataset.formalCartoonVfx'), "render layer lost its formal VFX runtime gate");
check(["formal_marker_vfx_v2", "formal_thermos_vfx_v2", "formal_scissors_vfx_v3", "formal_correction_vfx_v2"]
  .every((id) => combat.includes(id)), "one or more formal atlases left the runtime registry");
check(combat.includes('const MAX_CONCURRENT_SPRITE_LOADS = 6')
  && combat.includes('const MAX_SPRITE_LOAD_ATTEMPTS = 4')
  && combat.includes('strategy: "critical-first-limited-concurrency-retry"')
  && combat.includes('window.__cubicleAssetAudit = spriteLoadSnapshot')
  && combat.includes('startButton.textContent = "正在准备画面 "')
  && combat.includes('img.onerror = function ()')
  && combat.includes('finishSpriteLoad(record, img, "timeout")')
  && combat.includes('/_vfx_v[23]$/.test(id) ? "v=315-vfx-5"')
  && combat.includes("function drawFormalCartoonLinearVfx")
  && combat.includes("function drawFormalCartoonAreaVfx")
  && combat.includes("function applyFormalVfxDebugPose")
  && combat.includes('if (!drawFormalCartoonAreaVfx(ctx, state, z, alpha, progress, radius))'),
"cache, real-geometry renderers, debug harness, or heatwave overlay fix drifted");
const runtimeAssetRefs = [...combat.matchAll(/:\s*"(assets\/[A-Za-z0-9_./-]+\.(?:png|webp|svg))"/g)]
  .map((match) => match[1]);
check(runtimeAssetRefs.length >= 120
  && runtimeAssetRefs.every((ref) => fs.existsSync(path.join(root, ref))),
"runtime sprite registry references a missing local asset");
check(main.includes('params.get("formalVfx")') && main.includes('params.get("formalVfxFrame")'),
  "deterministic browser harness drifted");
check(index.includes("four-weapon-fixed.js?v=14") && index.includes("state.js?v=31")
  && index.includes("systems.js?v=94") && index.includes("render.js?v=46") && index.includes("main.js?v=94"),
"runtime cache versions drifted");
check(Object.values(report.assertions || {}).every(Boolean), "one or more VFX assertions did not pass");
check(Array.isArray(report.remainingBlockers) && report.remainingBlockers.length === 0, "cleared VFX blockers drifted");

console.log(JSON.stringify({
  entry: report.entry,
  runtimeCases: report.cases.length,
  animatedFamilies: report.frameAudit.length,
  status: report.status
}, null, 2));
