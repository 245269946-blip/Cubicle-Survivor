const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const report = JSON.parse(fs.readFileSync(path.join(root, "formal-cartoon-scene-runtime-report.json"), "utf8"));

function check(condition, message) {
  if (!condition) throw new Error("Formal cartoon scene QA: " + message);
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function webpDimensions(file) {
  const buffer = fs.readFileSync(file);
  check(buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP",
    `${file} is not a valid WebP`);
  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const type = buffer.subarray(offset, offset + 4).toString("ascii");
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (type === "VP8X") {
      const width = 1 + buffer[data + 4] + (buffer[data + 5] << 8) + (buffer[data + 6] << 16);
      const height = 1 + buffer[data + 7] + (buffer[data + 8] << 8) + (buffer[data + 9] << 16);
      return { width, height };
    }
    if (type === "VP8 ") {
      return { width: buffer.readUInt16LE(data + 6) & 0x3fff, height: buffer.readUInt16LE(data + 8) & 0x3fff };
    }
    if (type === "VP8L") {
      const bits = buffer.readUInt32LE(data + 1);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    offset = data + size + (size % 2);
  }
  throw new Error(`Formal cartoon scene QA: no WebP dimensions found in ${file}`);
}

function pngDimensions(file) {
  const buffer = fs.readFileSync(file);
  check(buffer.length > 24 && buffer.subarray(1, 4).toString("ascii") === "PNG", `${file} is not a valid PNG`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

check(report.schemaVersion === 1 && report.entry === "demo-v3-15.html", "report identity drifted");
check(report.status === "passed" && report.phase === "four-weapon-v3-15", "scene runtime report did not pass");
check(JSON.stringify(report.worldSize) === JSON.stringify([2600, 1800]) && JSON.stringify(report.viewport) === JSON.stringify([1280, 720]),
  "world or viewport geometry drifted");
check(report.framing.mode === "world-anchored-map" && report.framing.worldScale === 1
  && report.framing.cameraParallax === false && report.framing.navigationOverlay === true,
"formal office must remain a world-anchored navigable map");
check(JSON.stringify(report.scenePhases) === JSON.stringify([1, 2, 3, 4, 5]), "five-phase mapping drifted");
check(Array.isArray(report.cases) && report.cases.length === 6, "five phases plus completion need six browser cases");
check(new Set(report.cases.map((item) => item.sha256)).size === 6, "scene browser cases must remain visually distinct");
check(report.cases.every((item) => item.hudVisible && !item.runtimeError && /^[a-f0-9]{64}$/.test(item.sha256)),
  "scene evidence lost HUD visibility, hash identity or zero-error status");
check(report.cases.at(-1).completionProgress === 0.5, "completion frame evidence drifted");
check(Object.keys(report.assetFiles || {}).length === 7, "formal office family must contain five stages, one map overlay, and one completion icon");

Object.entries(report.assetFiles).forEach(([name, expected]) => {
  const file = path.join(root, name);
  check(fs.existsSync(file), `missing ${name}`);
  const dimensions = path.extname(file).toLowerCase() === ".png" ? pngDimensions(file) : webpDimensions(file);
  check(dimensions.width === expected.width && dimensions.height === expected.height, `${name} dimensions drifted`);
  check(sha256(file) === expected.sha256, `${name} evidence is stale`);
});

Object.entries(report.sourceHashes || {}).forEach(([name, expected]) => {
  const file = path.join(root, name);
  check(fs.existsSync(file) && sha256(file) === expected, `runtime evidence is stale for ${name}`);
});

const combatSource = fs.readFileSync(path.join(root, "src/v2/combat/systems.js"), "utf8");
const stateSource = fs.readFileSync(path.join(root, "src/v2/runtime/state.js"), "utf8");
const configSource = fs.readFileSync(path.join(root, "src/v2/demo-v2/four-weapon-fixed.js"), "utf8");
const mainSource = fs.readFileSync(path.join(root, "main.js"), "utf8");
check(configSource.includes("formalCartoonScenePass: true") && stateSource.includes("formalCartoonScenePass"),
  "V3.15 formal scene gate is missing");
check(combatSource.includes("formal_office_phase_5_v1") && combatSource.includes("formal_office_map_overlay_v1")
  && combatSource.includes("function drawFormalSceneCompletion"),
  "scene family or completion renderer is missing");
check(combatSource.includes("ctx.drawImage(img, -camera.x, -camera.y, worldWidth(state), worldHeight(state))")
  && combatSource.includes("ctx.drawImage(runtimeImages.formal_office_map_overlay_v1")
  && !combatSource.includes("const sceneX = -(drawWidth - W)"),
  "formal office must bind its background and map markings to world coordinates");
check(combatSource.includes('search.get("formalScene")') && mainSource.includes('params.get("formalScene")'),
  "deterministic scene browser harness is missing");
check(Object.values(report.assertions || {}).every(Boolean), "one or more scene assertions did not pass");
check(Array.isArray(report.remainingBlockers) && report.remainingBlockers.length === 0, "cleared scene blockers drifted");

console.log(JSON.stringify({
  entry: report.entry,
  phases: report.scenePhases,
  runtimeCases: report.cases.length,
  assets: Object.keys(report.assetFiles).length,
  status: report.status
}, null, 2));
