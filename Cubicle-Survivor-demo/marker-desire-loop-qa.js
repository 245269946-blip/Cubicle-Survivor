const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = __dirname;
const files = {
  html: path.join(root, "marker-desire-loop.html"),
  css: path.join(root, "marker-desire-loop.css"),
  js: path.join(root, "marker-desire-loop.js"),
  parts: path.join(root, "assets/generated-vfx/sprites/marker-growth-parts.svg"),
  person: path.join(root, "assets/generated-vfx/sprites/marker-person-directional-v4.png"),
  riggedPerson: path.join(root, "assets/generated-vfx/sprites/marker-person-printer-rig-directions-v5.png"),
  weapons: path.join(root, "assets/generated-vfx/sprites/marker-weapon-directions-v4.png"),
  attacks: path.join(root, "assets/generated-vfx/sprites/marker-attack-atlas-v2.png")
};

Object.entries(files).forEach(([name, file]) => {
  if (!fs.existsSync(file)) throw new Error(`Missing ${name}: ${file}`);
});

const html = fs.readFileSync(files.html, "utf8");
const css = fs.readFileSync(files.css, "utf8");
const js = fs.readFileSync(files.js, "utf8");
const parts = fs.readFileSync(files.parts, "utf8");

new vm.Script(js, { filename: "marker-desire-loop.js" });

[
  "gameCanvas", "introPanel", "decisionPanel", "recapPanel", "evolutionChain",
  "damageBreakdown", "copyLevel", "archiveLevel", "fusionReadout"
].forEach((id) => {
  if (!html.includes(`id="${id}"`)) throw new Error(`Missing required UI id: ${id}`);
});

[
  "embodiedGrowthPass", "workflowFusionPass", "triggerRetrieval", "segmentIntersection",
  "复写 Lv.", "留档 Lv.", "调阅回路", "本轮已回读", "time: 25", "time: 60",
  "time: 100", "time: 140", "time: 155", "time: 180", "triggerCopyUltimate",
  "triggerArchiveUltimate", "全页批注", "整页归档", "marker-person-directional-v4.png",
  "marker-weapon-directions-v4.png", "marker-printer-rig-v1.svg", "weaponDirection",
  "marker-attack-atlas-v2.png", "BUILD_LAYOUT", "getAttackEmitters", "buildVisualNodes",
  "muzzlePoint", "bodySafetyRadius: 48", "PHYSICAL_MOUNTS", "archiveReservoir",
  "back-printer-dock", "printer-dock-left", "printer-dock-right", "componentMountRule", "drawEmitterComponent", "durationTailComponent",
  "duplicate-emitter", "zMode: \"world-y\"", "player.facing",
  "基础白线", "laserWhite", "emitterAttackPath", "rigSpread", "marker-printer-rig-v1.svg"
].forEach((token) => {
  if (!js.includes(token)) throw new Error(`Missing experiment contract token: ${token}`);
});

if (js.includes("state.player.x + Math.cos(angle) * 34")) {
  throw new Error("Marker attacks still originate from the old player-centre offset");
}
if (!js.includes("guardX1: state.player.x") || !js.includes("x1: muzzle.x") || !js.includes("muzzle.x + forwardX * outwardLength")) {
  throw new Error("Combat geometry does not preserve the hidden body guard plus one visible muzzle beam");
}
if (js.includes('socket: "right-hover"')) {
  throw new Error("Copy controller regressed to a detached hover prop instead of the shared printer dock");
}
if ((js.match(/const aimAngle = baseAngle;/g) || []).length < 3) {
  throw new Error("Marker Lv1-Lv3 emitters are no longer locked to parallel forward fire");
}
if (js.includes("copyBarrage") || js.includes("archiveBand")) {
  throw new Error("A non-damaging forward overlay is competing with the authoritative laser/ink path");
}
if (!js.includes('id: "copy-ultimate-core-"') || !js.includes('"copy-ultimate-spill-"') || !js.includes("const baseAngle = state.player.angle") || !js.includes("Math.PI * 0.75")) {
  throw new Error("Copy Lv4 no longer preserves a dominant focused front plus secondary scattered beams");
}
if (js.includes("Math.PI * 2 * index / 18")) {
  throw new Error("Copy Lv4 regressed to an evenly distributed radial burst");
}

[
  "#ffd75f", "#68efff", "#ff65dc", ".weapon-preview", ".decision-card", ".recap-grid"
].forEach((token) => {
  if (!css.includes(token)) throw new Error(`Missing visual grammar token: ${token}`);
});

if (!parts.includes('<svg')) throw new Error("Marker fallback visual parts are not valid SVG sources");
for (const key of ["person", "riggedPerson", "weapons", "attacks"]) {
  if (!fs.readFileSync(files[key]).subarray(1, 4).equals(Buffer.from("PNG"))) throw new Error(`${key} atlas is not a PNG`);
}
if (!html.includes("marker-growth-parts.svg") && !js.includes("marker-growth-parts.svg")) throw new Error("Physical marker parts are not consumed by the runtime");
for (const filename of ["marker-person-printer-rig-directions-v5.png", "marker-weapon-directions-v4.png"]) {
  if (!css.includes(filename)) throw new Error(`Image-generated ${filename} is not consumed by the intro`);
}

[
  "marker-person-printer-rig-directions-v5.png", "sliceAlphaAtlas", "makeRiggedRouteVisuals",
  "routePixelFamily", "drawRiggedRouteGlow", "assets.riggedPersonVisuals[player.facing]",
  "assets.waveCopy", "assets.waveArchive"
].forEach((token) => {
  if (!js.includes(token)) throw new Error(`Missing integrated rig contract token: ${token}`);
});
if (css.includes("marker-printer-rig-v1.svg")) {
  throw new Error("The retired placeholder printer rig is still present in the player-facing intro");
}
if (js.includes("hue-rotate(250deg)")) {
  throw new Error("Hybrid Marker Person regressed to a global magenta recolor instead of separate route light layers");
}

console.log("Marker desire-loop QA passed: four-facing worn printer rig, separate level-bright route cores, forward-parallel Lv1-Lv3 emitters, one authoritative beam, focused-front Copy Lv4, fusion and pure-route contracts are present.");
