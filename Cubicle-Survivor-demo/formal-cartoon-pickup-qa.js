const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const report = JSON.parse(fs.readFileSync(path.join(root, "formal-cartoon-pickup-runtime-report.json"), "utf8"));
const contract = JSON.parse(fs.readFileSync(path.join(root, "assets/cartoon-office-pickups/cartoon-office-pickup-contract.json"), "utf8"));

function check(condition, message) {
  if (!condition) throw new Error("Formal cartoon pickup QA: " + message);
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function pngInfo(file) {
  const buffer = fs.readFileSync(file);
  check(buffer.length > 25 && buffer.subarray(1, 4).toString("ascii") === "PNG", `${file} is not a valid PNG`);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    colorType: buffer[25]
  };
}

check(report.schemaVersion === 1 && report.entry === "demo-v3-15.html", "report identity drifted");
check(report.status === "passed" && report.phase === "four-weapon-v3-15", "pickup runtime report did not pass");
check(JSON.stringify(report.viewport) === JSON.stringify([1280, 720]), "browser viewport drifted");
check(JSON.stringify(report.pickupTypes) === JSON.stringify(["xp", "material", "heal"]), "three-type identity mapping drifted");
check(JSON.stringify(report.frameOrder) === JSON.stringify(["rest", "lift", "glint", "settle"]), "four-frame order drifted");
check(Array.isArray(report.cases) && report.cases.length === 8, "pickup browser matrix must keep eight cases");
check(new Set(report.cases.map((item) => item.sha256)).size === report.cases.length,
  "every pickup pose and collection case must remain visually distinct");
check(report.cases.every((item) => item.hudVisible && !item.runtimeError && /^[a-f0-9]{64}$/.test(item.sha256)),
  "browser evidence lost HUD visibility, hash identity, or zero-error status");
check(report.cases.some((item) => item.type === "all") && report.cases.some((item) => item.collected),
  "browser evidence must retain the family lineup and collect feedback cases");

Object.entries(report.assetFiles || {}).forEach(([name, expected]) => {
  const file = path.join(root, name);
  check(fs.existsSync(file), `missing ${name}`);
  const info = pngInfo(file);
  check(info.width === expected.width && info.height === expected.height, `${name} dimensions drifted`);
  check(info.colorType === 6, `${name} must remain an RGBA PNG`);
  check(sha256(file) === expected.sha256, `${name} evidence is stale`);
});

Object.entries(report.sourceHashes || {}).forEach(([name, expected]) => {
  const file = path.join(root, name);
  check(fs.existsSync(file) && sha256(file) === expected, `runtime evidence is stale for ${name}`);
});

check(contract.schemaVersion === 1 && contract.family === "formal-cartoon-office-pickups-v1", "atlas contract identity drifted");
check(contract.layout.columns === 4 && contract.layout.rows === 1
  && contract.layout.cellWidth === 320 && contract.layout.cellHeight === 320
  && contract.layout.width === 1280 && contract.layout.height === 320,
"atlas layout must remain four exact 320px cells");
check(JSON.stringify(contract.layout.frameOrder) === JSON.stringify(report.frameOrder), "contract frame order disagrees with runtime report");
check(Array.isArray(contract.assets) && contract.assets.length === 3, "contract must contain exactly three pickup atlases");
check(contract.assets.every((asset) => asset.fourCornersTransparent
  && asset.visibleGreenPixels === 0
  && asset.referenceHeight === 228
  && asset.frameAlphaCoverage.length === 4
  && asset.frameAlphaCoverage.every((coverage) => coverage > 0.3 && coverage < 0.55)),
"pickup alpha, chroma cleanup, reference scale, or per-frame coverage drifted");

const combatSource = fs.readFileSync(path.join(root, "src/v2/combat/systems.js"), "utf8");
const stateSource = fs.readFileSync(path.join(root, "src/v2/runtime/state.js"), "utf8");
const configSource = fs.readFileSync(path.join(root, "src/v2/demo-v2/four-weapon-fixed.js"), "utf8");
const mainSource = fs.readFileSync(path.join(root, "main.js"), "utf8");
check(configSource.includes("formalCartoonPickupPass: true") && stateSource.includes("formalCartoonPickupPass"),
  "V3.15 formal pickup gate is missing");
check(["formal_pickup_xp_v1", "formal_pickup_material_v1", "formal_pickup_heal_v1"].every((name) => combatSource.includes(name)),
  "one or more pickup assets are not registered in runtime");
check(combatSource.includes("function formalCartoonPickupDef")
  && combatSource.includes("function addFormalPickupCollectEvent")
  && combatSource.includes("p.magnetRatio =")
  && combatSource.includes('event.kind === "formal_pickup_collect"'),
"formal idle, magnet, or collect feedback runtime is missing");
check(combatSource.includes('search.get("formalPickup")') && mainSource.includes('params.get("formalPickup")'),
  "deterministic pickup browser harness is missing");
check(Object.values(report.assertions || {}).every(Boolean), "one or more pickup assertions did not pass");
check(Array.isArray(report.remainingBlockers) && report.remainingBlockers.length === 0, "cleared pickup blockers drifted");

console.log(JSON.stringify({
  entry: report.entry,
  pickupTypes: report.pickupTypes,
  runtimeCases: report.cases.length,
  assets: Object.keys(report.assetFiles).length,
  status: report.status
}, null, 2));
