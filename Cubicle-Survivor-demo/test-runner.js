const fs = require("fs");
const path = require("path");
const vm = require("vm");

const baseDir = __dirname;

function makeElement() {
  return {
    style: { setProperty(name, value) { this[name] = value; } },
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    dataset: {},
    textContent: "",
    innerHTML: "",
    value: "",
    onclick: null,
    appendChild() {},
    removeChild() {},
    replaceChildren() {},
    setAttribute() {},
    getAttribute() { return null; },
    addEventListener() {},
    removeEventListener() {},
    querySelectorAll() { return []; }
  };
}

const element = makeElement();
const canvas = Object.assign(makeElement(), {
  width: 1280,
  height: 720,
  getContext() {
    return {
      fillRect() {}, clearRect() {}, strokeRect() {}, save() {}, restore() {}, translate() {}, rotate() {}, scale() {},
      drawImage() {}, beginPath() {}, arc() {}, fill() {}, stroke() {}, moveTo() {}, lineTo() {}, closePath() {},
      setLineDash() {},
      createLinearGradient() { return { addColorStop() {} }; },
      createRadialGradient() { return { addColorStop() {} }; },
      measureText() { return { width: 0 }; },
      fillText() {}, setTransform() {}, clip() {}, quadraticCurveTo() {}, bezierCurveTo() {},
      globalAlpha: 1,
      globalCompositeOperation: "source-over",
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      font: "",
      textAlign: "left",
      lineCap: "butt",
      shadowBlur: 0,
      shadowColor: ""
    };
  }
});

const sandbox = {
  window: {},
  document: {
    readyState: "complete",
    getElementById(id) { return id === "game" ? canvas : element; },
    createElement() { return makeElement(); },
    querySelector() { return element; },
    querySelectorAll() { return []; },
    addEventListener() {},
    body: makeElement(),
    head: makeElement()
  },
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
    clear() { this._data = {}; }
  },
  console,
  setTimeout(fn) { return 0; },
  clearTimeout() {},
  setInterval() { return 0; },
  clearInterval() {},
  requestAnimationFrame() { return 0; },
  cancelAnimationFrame() {},
  performance: { now: () => Date.now() },
  navigator: { userAgent: "node-test", language: "zh-CN" },
  location: { search: "", href: "http://localhost/" },
  URLSearchParams,
  Math,
  Date,
  JSON,
  Object,
  Array,
  String,
  Number,
  Boolean,
  RegExp,
  Error,
  TypeError,
  parseInt,
  parseFloat,
  isNaN,
  Infinity,
  NaN,
  alert() {}
};
sandbox.window = sandbox;
sandbox.global = sandbox;

const ctx = vm.createContext(sandbox);
const scripts = [
  "src/data/departments.js",
  "src/data/attributes.js",
  "src/data/tags.js",
  "src/data/cards.js",
  "src/data/weapons.js",
  "src/data/synergies.js",
  "src/data/milestones.js",
  "src/data/stages.js",
  "src/data/balance.js",
  "src/core/build-state.js",
  "src/v2/data/weapon-forms.js",
  "src/v2/data/form-signatures.js",
  "src/v2/audio/audio.js",
  "src/v2/compat/legacy.js",
  "src/v2/demo-v2/phase-a.js",
  "src/v2/demo-v2/phase-b.js",
  "src/v2/demo-v2/marker-fixed.js",
  "src/v2/demo-v2/thermos-fixed.js",
  "src/v2/demo-v2/scissors-fixed.js",
  "src/v2/demo-v2/correction-fluid-fixed.js",
  "src/v2/demo-v2/four-weapon-fixed.js",
  "src/v2/runtime/state.js",
  "src/v2/progression/progression.js",
  "src/v2/combat/systems.js",
  "src/v2/ui/view-model.js",
  "src/v2/ui/render.js",
  "main.js"
];

for (const script of scripts) {
  const fullPath = path.join(baseDir, script);
  const code = fs.readFileSync(fullPath, "utf8");
  new vm.Script(code, { filename: script }).runInContext(ctx);
  console.log("OK:", script);
}

if (typeof sandbox._testAllBuilds !== "function") {
  console.error("_testAllBuilds missing");
  process.exit(1);
}

const results = sandbox._testAllBuilds();
const failed = results.filter((r) => !r.clearedAll);
console.log(`\n=== ${results.length} Demo V1 builds tested ===`);
for (const r of results) {
  console.log(`${r.clearedAll ? "OK" : "FAIL"} ${r.name} | ${r.form} | ${r.mechanicType} | slots ${r.slots}`);
}
if (failed.length) {
  console.error("Failed builds:", failed.map((r) => r.name).join(", "));
  process.exit(1);
}

const V2 = sandbox.CS.V2;
const phaseA = V2.demoV2 && V2.demoV2.phaseA;
if (!phaseA || phaseA.duration !== 60 || phaseA.enemyFloor < 12 || phaseA.enemyCap !== 60) {
  console.error("Demo V2 Phase A contract missing or drifted", phaseA);
  process.exit(1);
}
if (phaseA.waves.map((wave) => wave.id).join(",") !== "queue,cluster,pursuit,review"
  || Object.keys(phaseA.weaponOverrides).sort().join(",") !== "marker,sticky_note,thermos") {
  console.error("Demo V2 Phase A must stay locked to three weapons and four wave grammars", phaseA);
  process.exit(1);
}
V2.dispatch({ type: "INIT", demoV2Phase: "phase-a" });
V2.dispatch({ type: "START_RUN", weaponId: "marker" });
let phaseAState = V2.getState();
if (phaseAState.mode !== "combat" || phaseAState.stage.demoV2Phase !== "phase-a" || phaseAState.stageTime !== 60
  || phaseAState.badgeDept || !phaseAState.activeFormParams.demoV2BaseBranch) {
  console.error("Demo V2 Phase A did not start as an isolated marker weapon test", phaseAState);
  process.exit(1);
}
V2.dispatch({ type: "GAIN_XP", amount: 999 });
if (V2.getState().mode !== "combat" || V2.getState().level !== 1) {
  console.error("Demo V2 Phase A must not open the legacy level-up flow");
  process.exit(1);
}
V2.dispatch({ type: "COMPLETE_STAGE" });
if (V2.getState().mode !== "result" || !V2.getState().flags.won) {
  console.error("Demo V2 Phase A must finish directly in its result screen");
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "phase-a" });
V2.dispatch({ type: "START_RUN", weaponId: "thermos" });
phaseAState = V2.getState();
const thermosPhaseA = phaseAState.activeFormParams;
if (!thermosPhaseA.demoV2SteamFan || thermosPhaseA.steamRange >= phaseA.weaponOverrides.marker.range * 0.5
  || thermosPhaseA.steamWidth < thermosPhaseA.steamRange * 0.75 || thermosPhaseA.steamDuration <= thermosPhaseA.cooldown
  || thermosPhaseA.steamSlow <= 0 || thermosPhaseA.releaseWidth < thermosPhaseA.releaseRange * 0.9) {
  console.error("Demo V2 Thermos must remain a short, wide, persistent control fan instead of a Marker-like beam", thermosPhaseA);
  process.exit(1);
}
phaseAState.enemies = [{
  id: "phase-a-thermos-target",
  typeId: "todo",
  x: phaseAState.player.x + 120,
  y: phaseAState.player.y,
  r: 14,
  hp: 200,
  maxHp: 200,
  speed: 0,
  baseSpeed: 0,
  damage: 0,
  dead: false,
  color: "#ffffff"
}];
V2.combat.fireWeapon(phaseAState);
if (!phaseAState.damageZones.some((zone) => zone.type === "polygon" && zone.source === "thermos_warmup" && zone.slow > 0 && zone.life > thermosPhaseA.cooldown)) {
  console.error("Demo V2 Thermos warmup did not create its persistent slowing fan", phaseAState.damageZones);
  process.exit(1);
}
thermosPhaseA.heat = 75;
V2.combat.fireWeapon(phaseAState);
if (!phaseAState.damageZones.some((zone) => zone.type === "polygon" && zone.source === "thermos_release" && zone.slow >= thermosPhaseA.steamSlow)) {
  console.error("Demo V2 Thermos boil did not expand the persistent fan", phaseAState.damageZones);
  process.exit(1);
}
console.log("OK Demo V2 Phase A contract: 3 weapons, 4 wave grammars, 60 seconds, no legacy progression; Thermos uses a short wide control fan");
V2.dispatch({ type: "RESTART" });

const phaseB = V2.demoV2 && V2.demoV2.phaseB;
if (!phaseB || phaseB.duration !== 180 || Object.keys(phaseB.modules).sort().join(",") !== "archive,copy,expedite,forward,merge,overdraft"
  || Object.keys(phaseB.representative).sort().join(",") !== "marker,sticky_note,thermos") {
  console.error("Demo V2 Phase B contract missing or drifted", phaseB);
  process.exit(1);
}
const phaseBExpectations = {
  marker: { dept: "tech", mechanic: "line_split" },
  thermos: { dept: "product", mechanic: "charge_release_beam" },
  sticky_note: { dept: "general", mechanic: "trap_link_control_zone" }
};
for (const weaponId of Object.keys(phaseBExpectations)) {
  V2.dispatch({ type: "RESTART" });
  V2.dispatch({ type: "INIT", demoV2Phase: "phase-b" });
  V2.dispatch({ type: "START_RUN", weaponId });
  const state = V2.getState();
  if (state.stage.demoV2Phase !== "phase-b" || state.stageTime !== 180 || state.badgeDept || state.level !== 1) {
    console.error("Demo V2 Phase B must begin with the isolated base weapon", weaponId, state);
    process.exit(1);
  }
  state.stageTime = 150;
  phaseB.tick(state);
  const expected = phaseBExpectations[weaponId];
  if (!state.demoV2.identityApplied || state.badgeDept !== expected.dept || state.activeForm.mechanicType !== expected.mechanic || state.mode !== "combat") {
    console.error("Demo V2 Phase B representative identity did not apply at 30 seconds", weaponId, state);
    process.exit(1);
  }
  V2.dispatch({ type: "GAIN_XP", amount: 999 });
  if (state.mode !== "combat" || state.level !== 1) {
    console.error("Demo V2 Phase B leaked into legacy XP progression", weaponId, state.mode, state.level);
    process.exit(1);
  }
  phaseB.applyModule(state, "copy");
  const forwardOffer = phaseB.makeChoices(state).find((choice) => choice.id === "forward");
  if (!forwardOffer || forwardOffer.combo.indexOf("：") < 0 || forwardOffer.combo.indexOf("组合流程成立") >= 0) {
    console.error("Phase B combo cards must state the weapon-specific rule instead of a generic combo label", weaponId, forwardOffer);
    process.exit(1);
  }
  phaseB.applyModule(state, "forward");
  if (state.demoV2.moduleOrder.join(",") !== "copy,forward" || !state.demoV2.lastCombo.length) {
    console.error("Demo V2 Phase B module combo was not recorded", weaponId, state.demoV2);
    process.exit(1);
  }
  if (weaponId === "marker" && (state.activeFormParams.demoV2ParallelLines < 1 || !state.activeFormParams.secondarySplit || state.activeFormParams.splitCount !== 1)) {
    console.error("Marker copy and forward must remain distinct: parallel main lines versus second-generation relay branches", state.activeFormParams);
    process.exit(1);
  }
  if (weaponId === "thermos" && (!state.activeFormParams.demoV2SteamFan || state.activeFormParams.demoV2FanCount < 2 || !state.activeFormParams.demoV2ForwardHeatwave)) {
    console.error("Thermos copy + forward did not preserve the fan or add outlets and relay heatwaves", state.activeFormParams);
    process.exit(1);
  }
  if (weaponId === "sticky_note" && (state.activeFormParams.demoV2StickyCopies < 1 || !state.activeFormParams.demoV2StickyForward)) {
    console.error("Sticky copy + forward did not add synchronous and relay nodes", state.activeFormParams);
    process.exit(1);
  }
}
function phaseBTarget(id, x, y) {
  return { id, typeId: "todo", x, y, r: 14, hp: 500, maxHp: 500, speed: 0, baseSpeed: 0, damage: 0, dead: false, color: "#ffffff", rooted: 0 };
}

V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "phase-b" });
V2.dispatch({ type: "START_RUN", weaponId: "marker" });
let markerModuleState = V2.getState();
phaseB.applyIdentity(markerModuleState);
phaseB.applyModule(markerModuleState, "copy");
markerModuleState.enemies = [
  phaseBTarget("copy-main", markerModuleState.player.x + 110, markerModuleState.player.y),
  phaseBTarget("copy-lane", markerModuleState.player.x + 170, markerModuleState.player.y + markerModuleState.activeFormParams.demoV2ParallelSpacing)
];
V2.combat.fireWeapon(markerModuleState);
if (!(markerModuleState.stats.damageDone.marker_module_copy > 0)
  || !markerModuleState.formEvents.some((event) => event.source === "marker_module_copy")) {
  console.error("Marker Copy must create and damage with a complete parallel main line", markerModuleState.stats.damageDone, markerModuleState.formEvents);
  process.exit(1);
}
phaseB.applyModule(markerModuleState, "forward");
markerModuleState.enemies = [
  phaseBTarget("combo-main", markerModuleState.player.x + 105, markerModuleState.player.y),
  phaseBTarget("combo-copy", markerModuleState.player.x + 160, markerModuleState.player.y + markerModuleState.activeFormParams.demoV2ParallelSpacing),
  phaseBTarget("combo-relay", markerModuleState.player.x + 245, markerModuleState.player.y + 105)
];
markerModuleState.formEvents = [];
V2.combat.fireWeapon(markerModuleState);
if (!markerModuleState.formEvents.some((event) => event.source === "marker_module_forward" && event.meta && event.meta.generation === "copy-relay")) {
  console.error("Marker Copy + Forward must turn parallel-line hits into additional relay origins", markerModuleState.formEvents);
  process.exit(1);
}

V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "phase-b" });
V2.dispatch({ type: "START_RUN", weaponId: "marker" });
markerModuleState = V2.getState();
phaseB.applyIdentity(markerModuleState);
phaseB.applyModule(markerModuleState, "archive");
const archiveTarget = phaseBTarget("archive-target", markerModuleState.player.x + 150, markerModuleState.player.y);
markerModuleState.enemies = [archiveTarget];
V2.combat.fireWeapon(markerModuleState);
const archiveZone = markerModuleState.damageZones.find((zone) => zone.source === "marker_module_archive");
const hpAfterMarkerShot = archiveTarget.hp;
V2.combat.qa.updateZones(markerModuleState, 0.02);
if (!archiveZone || archiveZone.damage <= 0 || archiveZone.width < 16 || archiveTarget.hp >= hpAfterMarkerShot
  || !(markerModuleState.stats.damageDone.marker_module_archive > 0)) {
  console.error("Marker Archive must leave a wide, persistent line that deals real follow-up damage", archiveZone, hpAfterMarkerShot, archiveTarget.hp, markerModuleState.stats.damageDone);
  process.exit(1);
}

V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "phase-b" });
V2.dispatch({ type: "START_RUN", weaponId: "marker" });
markerModuleState = V2.getState();
phaseB.applyIdentity(markerModuleState);
phaseB.applyModule(markerModuleState, "forward");
markerModuleState.enemies = [
  phaseBTarget("forward-main", markerModuleState.player.x + 100, markerModuleState.player.y),
  phaseBTarget("forward-first", markerModuleState.player.x + 100, markerModuleState.player.y + 90),
  phaseBTarget("forward-second", markerModuleState.player.x + 210, markerModuleState.player.y + 90)
];
V2.combat.fireWeapon(markerModuleState);
if (!(markerModuleState.stats.damageDone.marker_module_forward > 0)
  || !markerModuleState.formEvents.some((event) => event.source === "marker_module_forward")) {
  console.error("Marker Forward must relay from a first-generation branch into a new target", markerModuleState.stats.damageDone, markerModuleState.formEvents);
  process.exit(1);
}

function phaseBModuleState(weaponId, moduleId, level) {
  V2.dispatch({ type: "RESTART" });
  V2.dispatch({ type: "INIT", demoV2Phase: "phase-b" });
  V2.dispatch({ type: "START_RUN", weaponId });
  const state = V2.getState();
  phaseB.applyIdentity(state);
  for (let index = 0; index < level; index++) phaseB.applyModule(state, moduleId);
  return state;
}

const branchGrowth = {
  marker: {
    copy: (p) => p.demoV2ParallelLines,
    archive: (p) => p.demoV2TrailDuration,
    forward: (p) => p.secondarySplitCount,
    expedite: (p) => p.demoV2MarkerExpedite ? 10 - p.demoV2MarkerExpediteEvery : 0,
    merge: (p) => p.demoV2MarkerMerge,
    overdraft: (p) => p.demoV2MarkerOverdraftLines
  },
  thermos: {
    copy: (p) => p.demoV2FanCount - 1,
    archive: (p) => p.demoV2ThermosArchive,
    forward: (p) => p.demoV2ForwardHeatwave,
    expedite: (p) => p.demoV2ThermosExpedite ? 10 - p.demoV2ThermosExpediteEvery : 0,
    merge: (p) => p.demoV2ThermosMerge,
    overdraft: (p) => p.demoV2ThermosOverdraft
  },
  sticky_note: {
    copy: (p) => p.demoV2StickyCopies,
    archive: (p) => p.demoV2StickyArchive,
    forward: (p) => p.demoV2StickyForward,
    expedite: (p) => p.demoV2StickyExpedite ? 10 - p.demoV2StickyExpediteEvery : 0,
    merge: (p) => p.demoV2StickyMerge,
    overdraft: (p) => p.demoV2StickyOverdraft
  }
};
for (const weaponId of Object.keys(branchGrowth)) {
  for (const moduleId of Object.keys(branchGrowth[weaponId])) {
    const levelOne = phaseBModuleState(weaponId, moduleId, 1);
    const levelOneGrowth = branchGrowth[weaponId][moduleId](levelOne.activeFormParams);
    const levelThree = phaseBModuleState(weaponId, moduleId, 3);
    const read = branchGrowth[weaponId][moduleId];
    if (!(levelOneGrowth > 0) || !(read(levelThree.activeFormParams) > levelOneGrowth)) {
      console.error("Every Phase B module must unlock a branch at Lv1 and visibly grow through Lv3", weaponId, moduleId, levelOneGrowth, read(levelThree.activeFormParams));
      process.exit(1);
    }
  }
}

let moduleState = phaseBModuleState("marker", "expedite", 3);
moduleState.stats.shots = moduleState.activeFormParams.demoV2MarkerExpediteEvery - 1;
moduleState.enemies = [phaseBTarget("marker-expedite", moduleState.player.x + 130, moduleState.player.y)];
V2.combat.fireWeapon(moduleState);
if (!moduleState.formEvents.some((event) => event.source === "marker_module_expedite")) {
  console.error("Marker Expedite must create an independent redraw line");
  process.exit(1);
}
moduleState = phaseBModuleState("marker", "merge", 3);
moduleState.enemies = [100, 170, 240].map((offset, index) => phaseBTarget("marker-merge-" + index, moduleState.player.x + offset, moduleState.player.y));
V2.combat.fireWeapon(moduleState);
if (!moduleState.damageZones.some((zone) => zone.source === "marker_module_merge")) {
  console.error("Marker Merge must create an independent summary burst");
  process.exit(1);
}
moduleState = phaseBModuleState("marker", "overdraft", 3);
moduleState.stats.shots = moduleState.activeFormParams.demoV2OverdraftEvery - 1;
moduleState.enemies = [phaseBTarget("marker-overdraft", moduleState.player.x + 130, moduleState.player.y)];
V2.combat.fireWeapon(moduleState);
if (moduleState.formEvents.filter((event) => event.source === "marker_module_overdraft").length < moduleState.activeFormParams.demoV2MarkerOverdraftLines) {
  console.error("Marker Overdraft must add one visible line per level-grown branch");
  process.exit(1);
}

moduleState = phaseBModuleState("thermos", "copy", 3);
moduleState.enemies = [phaseBTarget("thermos-copy", moduleState.player.x + 150, moduleState.player.y)];
V2.combat.fireWeapon(moduleState);
if (moduleState.damageZones.filter((zone) => zone.source === "thermos_warmup").length < 4) {
  console.error("Thermos Copy Lv3 must create three independent outlets in addition to the base fan");
  process.exit(1);
}
for (const moduleId of ["archive", "expedite", "merge", "overdraft"]) {
  moduleState = phaseBModuleState("thermos", moduleId, 3);
  moduleState.enemies = [phaseBTarget("thermos-" + moduleId, moduleState.player.x + 150, moduleState.player.y)];
  if (moduleId === "expedite") moduleState.stats.shots = moduleState.activeFormParams.demoV2ThermosExpediteEvery - 1;
  if (moduleId === "merge" || moduleId === "overdraft") moduleState.activeFormParams.heat = moduleState.activeFormParams.heatMax - moduleState.activeFormParams.heatRate;
  V2.combat.fireWeapon(moduleState);
  const source = "thermos_module_" + moduleId;
  if (!moduleState.damageZones.some((zone) => zone.source === source)) {
    console.error("Thermos module must create its own combat branch", moduleId, moduleState.damageZones);
    process.exit(1);
  }
}
moduleState = phaseBModuleState("thermos", "forward", 3);
const forwardVictim = phaseBTarget("thermos-forward", moduleState.player.x + 100, moduleState.player.y);
forwardVictim.hp = 1;
moduleState.enemies = [forwardVictim];
V2.combat.qa.damageEnemy(moduleState, forwardVictim, 2, "thermos_release");
if (moduleState.damageZones.filter((zone) => zone.source === "thermos_module_heatwave").length !== 3) {
  console.error("Thermos Forward must add one death heatwave per level");
  process.exit(1);
}

function closeStickyBoard(state) {
  state.enemies = [phaseBTarget("sticky-board", state.player.x + 150, state.player.y)];
  for (let index = 0; index < 3; index++) {
    V2.combat.fireWeapon(state);
    V2.combat.qa.updateZones(state, 0.34);
  }
}
moduleState = phaseBModuleState("sticky_note", "copy", 3);
moduleState.enemies = [phaseBTarget("sticky-copy", moduleState.player.x + 150, moduleState.player.y)];
V2.combat.fireWeapon(moduleState);
if (moduleState.damageZones.filter((zone) => zone.noticeNode).length < 4) {
  console.error("Sticky Copy Lv3 must add three synchronized nodes to the base placement");
  process.exit(1);
}
moduleState = phaseBModuleState("sticky_note", "expedite", 3);
moduleState.stats.shots = moduleState.activeFormParams.demoV2StickyExpediteEvery - 1;
moduleState.enemies = [phaseBTarget("sticky-expedite", moduleState.player.x + 150, moduleState.player.y)];
V2.combat.fireWeapon(moduleState);
if (!moduleState.damageZones.some((zone) => zone.source === "sticky_module_expedite")) {
  console.error("Sticky Expedite must create an independent urgent annotation");
  process.exit(1);
}
for (const moduleId of ["archive", "overdraft"]) {
  moduleState = phaseBModuleState("sticky_note", moduleId, 3);
  moduleState.enemies = [phaseBTarget("sticky-expiry-" + moduleId, moduleState.player.x + 150, moduleState.player.y)];
  V2.combat.fireWeapon(moduleState);
  const originalNode = moduleState.damageZones.find((zone) => zone.noticeNode);
  originalNode.life = 0.01;
  V2.combat.qa.updateZones(moduleState, 0.02);
  const source = "sticky_module_" + moduleId;
  if (!moduleState.damageZones.some((zone) => zone.source === source)) {
    console.error("Sticky expiry module must create its own combat branch", moduleId, moduleState.damageZones);
    process.exit(1);
  }
}
moduleState = phaseBModuleState("sticky_note", "archive", 3);
closeStickyBoard(moduleState);
if (moduleState.formEvents.filter((event) => event.source === "sticky_module_archive").length < 3) {
  console.error("Sticky Archive must create visible echo nodes immediately when a board closes");
  process.exit(1);
}
moduleState = phaseBModuleState("sticky_note", "merge", 3);
closeStickyBoard(moduleState);
if (moduleState.formEvents.filter((event) => event.source === "sticky_module_merge").length !== 3) {
  console.error("Sticky Merge must add one closure pulse per level");
  process.exit(1);
}
moduleState = phaseBModuleState("sticky_note", "forward", 3);
closeStickyBoard(moduleState);
if (moduleState.damageZones.filter((zone) => zone.source === "sticky_notice_relay").length !== 3) {
  console.error("Sticky Forward must add one relay node per level");
  process.exit(1);
}
console.log("OK Demo V2 module branch gate: all 18 weapon-module mappings unlock at Lv1, grow through Lv3, and Thermos/Sticky create distinct runtime branches");
console.log("OK Demo V2 Phase B contract: 3 minutes, three fixed representative identities, six lightweight modules, weapon-specific copy + forward combos, no legacy XP");

const markerFixed = V2.demoV2 && V2.demoV2.markerFixed;
if (!markerFixed || markerFixed.duration !== 865 || markerFixed.phaseCount !== 5 || markerFixed.encounterCount !== 17
  || markerFixed.encounters.length !== 17 || markerFixed.shopCount !== 6
  || markerFixed.moduleEncounters.join(",") !== "1,3,6,9,12"
  || markerFixed.shopEncounters.join(",") !== "2,5,8,11,14,16"
  || markerFixed.moduleTimes.length !== 5 || markerFixed.shopTimes.length !== 6
  || markerFixed.componentCost !== 7 || markerFixed.refreshBaseCost !== 2 || markerFixed.collectionDuration !== 10 || markerFixed.guaranteedMaterialTotal !== 124
  || !markerFixed.uiFramework || markerFixed.uiFramework.weaponSelection.activeIds.join(",") !== "marker"
  || markerFixed.uiFramework.weaponSelection.cardCapacity !== 6 || markerFixed.uiFramework.itemShop.enabled !== false
  || markerFixed.uiFramework.itemShop.mountId !== "itemOfferSection" || markerFixed.uiFramework.itemShop.offerCapacity !== 4
  || markerFixed.encounters.some((encounter) => !encounter.spawnTotal || !encounter.enemyTypes || !encounter.preview)
  || markerFixed.encounters.filter((encounter) => encounter.boss).some((encounter) => !encounter.normalEnemyHp || encounter.normalEnemyHp >= encounter.enemyHp)
  || [1, 2, 3, 4, 5].map((phase) => markerFixed.encounters.filter((encounter) => encounter.phase === phase).length).join(",") !== "3,3,3,3,5"
  || Object.keys(markerFixed.modules).sort().join(",") !== "archive,copy"
  || Object.keys(markerFixed.parts).sort().join(",") !== "body,tail,tip"
  || Object.keys(markerFixed.experienceStats).sort().join(",") !== "armor,attackSpeed,critChance,damage,dodge,harvesting,hpRegen,lifeSteal,luck,maxHp,moveSpeed,range") {
  console.error("Marker fixed-type test contract missing or drifted", markerFixed);
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "marker-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "thermos" });
let markerFixedState = V2.getState();
const openingTransition = V2.getViewModel("hud").transition;
if (markerFixedState.selectedWeaponId !== "marker" || markerFixedState.stage.demoV2Phase !== "marker-fixed"
  || markerFixedState.stageTime !== 30 || markerFixedState.stage.id !== 1 || markerFixedState.maxHp !== 70 || markerFixedState.hp !== 70
  || markerFixedState.stage.phase.indexOf("马克笔 · 阶段 1") !== 0
  || V2.getViewModel("hud").stageMeta.indexOf("Demo V2.1 · 阶段 1/5") !== 0
  || openingTransition.kind !== "encounter" || openingTransition.tags.join(",") !== "待办,邮件"
  || openingTransition.rule.indexOf("倒计时结束或固定怪量清空") < 0) {
  console.error("Marker fixed test must force the marker and remain isolated", markerFixedState.selectedWeaponId, markerFixedState.stage);
  process.exit(1);
}
markerFixedState.pickups = [];
V2.combat.qa.damageEnemy(markerFixedState, {
  id: "marker-fixed-elite-drop", typeId: "meeting", x: 500, y: 360, r: 14,
  hp: 1, maxHp: 1, xp: 10, damage: 0, dead: false, markerFixedElite: true
}, 2, "marker_test_base");
if (!markerFixedState.pickups.some((pickup) => pickup.type === "xp")
  || !markerFixedState.pickups.some((pickup) => pickup.type === "material" && pickup.markerFixedDrop)) {
  console.error("Marker elites must drop separate proximity-picked XP and material entities", markerFixedState.pickups);
  process.exit(1);
}
markerFixedState.pickups = [];
V2.combat.qa.damageEnemy(markerFixedState, {
  id: "marker-fixed-boss-heal", typeId: "lead", x: 500, y: 360, r: 30,
  hp: 1, maxHp: 1, xp: 10, damage: 0, dead: false, boss: true, markerFixedBoss: true
}, 2, "marker_test_base");
if (!markerFixedState.pickups.some((pickup) => pickup.type === "heal" && pickup.fixedHealDrop && pickup.amount >= 6)) {
  console.error("Fixed-suite Bosses must guarantee a readable healing-pack drop", markerFixedState.pickups);
  process.exit(1);
}
markerFixedState.hp = 20;
markerFixed.collectLoosePickups(markerFixedState);
if (markerFixedState.hp <= 20 || markerFixedState.pickups.some((pickup) => pickup.type === "heal")) {
  console.error("Healing packs must restore health when collected or auto-collected", markerFixedState.hp, markerFixedState.pickups);
  process.exit(1);
}
const baseMarkerDamage = markerFixedState.activeFormParams.damage;
const baseMarkerMaxHp = markerFixedState.maxHp;
const baseMarkerCooldown = markerFixedState.activeFormParams.cooldown;
const baseMarkerRange = markerFixedState.activeFormParams.range;
V2.dispatch({ type: "GAIN_XP", amount: 999 });
if (markerFixedState.level <= 1 || markerFixedState.mode !== "combat"
  || markerFixedState.activeFormParams.damage !== baseMarkerDamage || markerFixedState.maxHp !== baseMarkerMaxHp
  || markerFixedState.demoV2.marker.pendingExperiencePoints <= 0
  || markerFixedState.demoV2.marker.experienceLevels !== markerFixedState.level - 1) {
  console.error("Marker XP must queue player-assigned stat points without interrupting combat", markerFixedState.level, markerFixedState.mode, markerFixedState.demoV2.marker);
  process.exit(1);
}
Object.keys(markerFixedState.demoV2.marker.experienceAllocations).forEach((id) => {
  markerFixedState.demoV2.marker.experienceAllocations[id] = 1;
});
markerFixed.rebuildParams(markerFixedState);
if (markerFixedState.activeFormParams.damage <= baseMarkerDamage
  || markerFixedState.activeFormParams.cooldown >= baseMarkerCooldown
  || markerFixedState.activeFormParams.range <= baseMarkerRange
  || markerFixedState.maxHp !== baseMarkerMaxHp + 12
  || markerFixedState.player.speed <= 220
  || markerFixedState.activeFormParams.markerFixedHpRegen !== 0.8
  || markerFixedState.activeFormParams.markerFixedLifeStealChance !== 0.015
  || markerFixedState.activeFormParams.markerFixedCritChance !== 0.03
  || markerFixedState.activeFormParams.markerFixedArmor !== 1
  || markerFixedState.activeFormParams.markerFixedDodgeChance !== 0.03
  || markerFixedState.activeFormParams.markerFixedLuck !== 5
  || markerFixedState.activeFormParams.markerFixedHarvesting !== 5) {
  console.error("Marker simplified Brotato-style stats must all feed real combat or economy parameters", markerFixedState.activeFormParams, markerFixedState.maxHp, markerFixedState.player.speed);
  process.exit(1);
}
Object.keys(markerFixedState.demoV2.marker.experienceAllocations).forEach((id) => {
  markerFixedState.demoV2.marker.experienceAllocations[id] = 0;
});
markerFixed.rebuildParams(markerFixedState);
markerFixed.applyModule(markerFixedState, "copy", true);
markerFixed.applyModule(markerFixedState, "copy", true);
markerFixed.applyModule(markerFixedState, "archive", true);
if (markerFixedState.activeFormParams.markerFixedParallelLines !== 2 || markerFixedState.activeFormParams.markerFixedArchiveTrails !== 1
  || markerFixedState.demoV2.marker.modules.copy !== 2 || markerFixedState.demoV2.marker.modules.archive !== 1) {
  console.error("Marker modules must independently rebuild mechanism parameters", markerFixedState.activeFormParams, markerFixedState.demoV2.marker.modules);
  process.exit(1);
}
markerFixedState.enemies = [{ id: "marker-fixed-target", typeId: "todo", x: markerFixedState.player.x + 180, y: markerFixedState.player.y, r: 14, hp: 900, maxHp: 900, speed: 0, baseSpeed: 0, damage: 0, dead: false, color: "#fff", rooted: 0 }];
const markerTargetXBefore = markerFixedState.enemies[0].x;
V2.combat.fireWeapon(markerFixedState);
if (!markerFixedState.formEvents.some((event) => event.source === "marker_test_copy")
  || !markerFixedState.damageZones.some((zone) => zone.source === "marker_test_archive")) {
  console.error("Copy and Archive must create distinct instant-line and persistent-zone branches", markerFixedState.formEvents, markerFixedState.damageZones);
  process.exit(1);
}
const markerArchiveZone = markerFixedState.damageZones.find((zone) => zone.source === "marker_test_archive");
if (markerFixedState.enemies[0].x !== markerTargetXBefore || !markerArchiveZone.inkTrail || !markerArchiveZone.noKnockback
  || markerArchiveZone.width < 24 || markerArchiveZone.slow < 0.24 || markerArchiveZone.damage >= baseMarkerDamage * 0.1) {
  console.error("Marker fixed beams must not knock back; Archive must be a wide, low-damage slowing ink band", markerFixedState.enemies[0], markerArchiveZone);
  process.exit(1);
}
// Mandatory Boss objectives must not become untargetable just because closer
// adds keep spawning on the opposite side of the player.
const markerBossAim = { id: "marker-boss-aim", typeId: "boss", x: markerFixedState.player.x + 230, y: markerFixedState.player.y, r: 28, hp: 1200, maxHp: 1200, speed: 0, baseSpeed: 0, damage: 0, dead: false, color: "#fff", rooted: 0, boss: true };
const markerAimAdd = { id: "marker-aim-add", typeId: "todo", x: markerFixedState.player.x - 70, y: markerFixedState.player.y, r: 14, hp: 900, maxHp: 900, speed: 0, baseSpeed: 0, damage: 0, dead: false, color: "#fff", rooted: 0 };
markerFixedState.enemies = [markerBossAim, markerAimAdd];
const markerBossHpBefore = markerBossAim.hp;
V2.combat.fireWeapon(markerFixedState);
if (markerBossAim.hp >= markerBossHpBefore) {
  console.error("Marker must aim its piercing line at an in-range mandatory Boss instead of a closer add", markerBossAim, markerFixedState.formEvents);
  process.exit(1);
}
const markerRuntime = markerFixedState.demoV2.marker;
const modulesBeforeComponents = JSON.stringify(markerRuntime.modules);
markerFixedState.materials = 500;
for (let copy = 0; copy < 8; copy++) {
  const offer = { id: "forced-tip-" + copy, partId: "tip", statId: "damage", cost: 7, sold: false, locked: false };
  markerRuntime.offers = [offer];
  markerFixed.buyComponent(markerFixedState, offer.id);
}
if (markerRuntime.parts.tip.copies !== 8 || markerFixed.qualityIndex(markerRuntime.parts.tip.copies) !== 4
  || markerRuntime.parts.tip.activeStat !== "damage" || markerRuntime.parts.tip.allocations.damage !== 4 || markerRuntime.parts.tip.allocations.pierce !== 0
  || JSON.stringify(markerRuntime.modules) !== modulesBeforeComponents) {
  console.error("Only identical component variants may accumulate to red without mutating modules", markerRuntime.parts.tip, markerRuntime.modules);
  process.exit(1);
}
const replacementOffer = { id: "forced-tip-replace", partId: "tip", statId: "pierce", cost: 7, sold: false, locked: false };
markerRuntime.offers = [replacementOffer];
markerFixed.buyComponent(markerFixedState, replacementOffer.id);
if (markerRuntime.parts.tip.copies !== 1 || markerRuntime.parts.tip.activeStat !== "pierce"
  || markerRuntime.parts.tip.allocations.damage !== 0 || markerRuntime.parts.tip.allocations.pierce !== 1) {
  console.error("Buying the mutually exclusive component variant must replace and reset the whole slot", markerRuntime.parts.tip);
  process.exit(1);
}

V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "marker-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "marker" });
markerFixedState = V2.getState();
markerFixedState.warmupTime = 0;
markerFixedState.stageTime = 0;
markerFixedState.demoV2.marker.encounterSpawned = markerFixed.encounters[0].spawnTotal - 1;
markerFixedState.enemies = [{ id: "quota-not-cleared", typeId: "todo", hp: 10, maxHp: 10, dead: false, boss: false, x: 500, y: 360, r: 12, speed: 0, baseSpeed: 0, damage: 0, rooted: 0 }];
markerFixedState.pickups = [
  { type: "xp", amount: markerFixedState.xpNeed, x: 0, y: 0, radius: 6 },
  { type: "material", amount: 3, x: 0, y: 0, radius: 6, markerFixedDrop: true }
];
V2.combat.update(0.05);
if (markerFixedState.mode !== "combat" || !markerFixedState.demoV2.marker.collecting || markerFixedState.warmupTime !== 10
  || markerFixedState.pickups.length < 2 || markerFixedState.enemies.length !== 0
  || !markerFixedState.pickups.some((pickup) => pickup.type === "material" && pickup.amount === 3)) {
  console.error("A normal encounter must enter collection when either its timer expires or its quota is cleared", markerFixedState.mode, markerFixedState.demoV2.marker, markerFixedState.pickups);
  process.exit(1);
}
const collectionTransition = V2.getViewModel("hud").transition;
if (collectionTransition.kind !== "collection" || collectionTransition.duration !== 10
  || collectionTransition.tags.length !== 4 || collectionTransition.tags[3].indexOf("恢复") < 0 || collectionTransition.next.indexOf("经验") < 0) {
  console.error("Marker collection transition must explain pickup rules and the next growth node", collectionTransition);
  process.exit(1);
}
markerFixed.finishCollection(markerFixedState);
if (markerFixedState.mode !== "level_up" || markerFixedState.materials < 10 || markerFixedState.level !== 2
  || markerFixedState.demoV2.marker.lastAutoCollect.xp <= 0 || markerFixedState.demoV2.marker.lastAutoCollect.materials < 3
  || markerFixedState.upgradeChoices.length !== 4
  || new Set(markerFixedState.upgradeChoices.map((choice) => choice.id)).size !== 4
  || markerFixedState.upgradeChoices.some((choice) => !markerFixed.experienceStats[choice.id])) {
  console.error("Collection expiry must auto-pick leftovers, grant stage materials, and open queued XP choices", markerFixedState.mode, markerFixedState.materials, markerFixedState.demoV2.marker);
  process.exit(1);
}
const markerPostFirstMaterials = markerFixedState.materials;
markerFixed.chooseExperienceStat(markerFixedState, "damage");
if (markerFixedState.mode !== "module_select" || markerFixedState.stage.id !== 1 || markerFixedState.activeFormParams.damage <= baseMarkerDamage) {
  console.error("Spending the final XP point after encounter 1 must immediately reach the first module choice", markerFixedState.mode, markerFixedState.stage.id, markerFixedState.activeFormParams.damage);
  process.exit(1);
}
markerFixed.applyModule(markerFixedState, "copy");
if (markerFixedState.mode !== "combat" || markerFixedState.stage.id !== 2) {
  console.error("The first module choice must lead into encounter 2 before the first component shop", markerFixedState.mode, markerFixedState.stage);
  process.exit(1);
}
markerFixed.completeEncounter(markerFixedState, true);
if (markerFixedState.mode !== "component_shop" || markerFixedState.demoV2.marker.offers.length !== 4
  || markerFixedState.demoV2.marker.refreshCost !== 2 || markerFixedState.demoV2.marker.currentShopEncounter !== 2
  || markerFixedState.materials !== markerPostFirstMaterials + 7) {
  console.error("Encounter 2 must open shop 1 with four white offers and at least two guaranteed purchases", markerFixedState.mode, markerFixedState.demoV2.marker.offers, markerFixedState.materials);
  process.exit(1);
}
const lockedPart = markerFixedState.demoV2.marker.offers[0].partId;
const lockedStat = markerFixedState.demoV2.marker.offers[0].statId;
markerFixed.toggleOfferLock(markerFixedState, markerFixedState.demoV2.marker.offers[0].id);
markerFixed.refreshShop(markerFixedState);
if (markerFixedState.demoV2.marker.refreshCost !== 4
  || !markerFixedState.demoV2.marker.offers.some((offer) => offer.partId === lockedPart && offer.statId === lockedStat && offer.locked)) {
  console.error("Shop refresh cost must rise and locked offers must survive rerolls", markerFixedState.demoV2.marker.refreshCost, markerFixedState.demoV2.marker.offers);
  process.exit(1);
}
markerFixed.closeShop(markerFixedState);
if (markerFixedState.mode !== "combat" || markerFixedState.stage.id !== 3 || !markerFixedState.stage.boss) {
  console.error("Closing shop 1 must enter encounter 3 Boss instead of another choice screen", markerFixedState.mode, markerFixedState.stage);
  process.exit(1);
}
markerFixedState.warmupTime = 0;
V2.combat.update(0.05);
const markerBoss = markerFixedState.enemies.find((enemy) => enemy.markerFixedBoss);
const markerBossAdds = markerFixedState.enemies.filter((enemy) => !enemy.boss);
if (!markerBoss || markerBoss.markerFixedBossMaterial !== 2 || !markerFixedState.stageBossSpawned
  || !markerBossAdds.length || markerBossAdds.some((enemy) => enemy.maxHp >= 80)
  || markerBoss.maxHp <= markerBossAdds[0].maxHp * 8) {
  console.error("Marker Boss encounters must spawn a real Boss with stable material drops", markerBoss, markerFixedState.stageBossSpawned);
  process.exit(1);
}
for (let hit = 0; hit < 12 && !markerBoss.dead; hit++) V2.combat.qa.damageEnemy(markerFixedState, markerBoss, markerBoss.maxHp, "marker_test_base");
V2.combat.update(0.05);
if (markerFixedState.mode !== "combat" || markerFixedState.demoV2.marker.collecting) {
  console.error("Killing a Boss early must not end the encounter before time expires or adds are cleared", markerFixedState.mode, markerFixedState.stageTime, markerFixedState.demoV2.marker);
  process.exit(1);
}
markerFixedState.stageTime = 0;
V2.combat.update(0.05);
if (!markerFixedState.demoV2.marker.collecting || markerFixedState.warmupTime !== 10) {
  console.error("Boss death plus timer expiry must enter the pickup window", markerFixedState.mode, markerFixedState.stageTime, markerFixedState.demoV2.marker);
  process.exit(1);
}
markerFixed.finishCollection(markerFixedState);
if (markerFixedState.mode !== "module_select" || markerFixedState.demoV2.marker.currentShopStage !== 0
  || markerFixedState.pickups.length !== 0) {
  console.error("Encounter 3 collection must resolve into module choice without opening a shop", markerFixedState.mode, markerFixedState.demoV2.marker);
  process.exit(1);
}
markerFixed.applyModule(markerFixedState, "copy");
if (markerFixedState.mode !== "combat" || markerFixedState.stage.id !== 4) {
  console.error("Module choice must be followed by a full combat encounter", markerFixedState.mode, markerFixedState.stage);
  process.exit(1);
}
markerFixed.completeEncounter(markerFixedState, true);
markerFixed.completeEncounter(markerFixedState, true);
if (markerFixedState.mode !== "component_shop" || markerFixedState.demoV2.marker.shopIndex !== 2
  || !markerFixedState.demoV2.marker.offers.some((offer) => offer.partId === lockedPart && offer.statId === lockedStat && offer.locked)) {
  console.error("Encounter 5 must open shop 2 and carry the previously locked offer", markerFixedState.mode, markerFixedState.demoV2.marker.offers);
  process.exit(1);
}
markerFixedState.demoV2.marker.parts.tail.copies = 4;
markerFixedState.demoV2.marker.parts.tail.activeStat = "range";
markerFixedState.demoV2.marker.parts.tail.allocations.range = 3;
const guaranteedOffers = markerFixed.makeShopOffers(markerFixedState, [], true);
if (!guaranteedOffers.some((offer) => offer.partId === "tail" && offer.statId === "range" && offer.action === "upgrade")) {
  console.error("An unfinished equipped variant must receive one guaranteed identical upgrade offer on first shop open", guaranteedOffers);
  process.exit(1);
}

V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "marker-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "marker" });
markerFixedState = V2.getState();
const shopsSeen = [];
const modulesSeen = [];
while (markerFixedState.mode !== "result") {
  const encounter = markerFixed.currentEncounter(markerFixedState);
  if (!encounter) break;
  if (encounter.bossMaterial) {
    markerFixedState.pickups.push({ type: "material", amount: encounter.bossMaterial, x: 0, y: 0, radius: 6, markerFixedDrop: true });
  }
  markerFixed.completeEncounter(markerFixedState, true);
  if (markerFixedState.mode === "component_shop") {
    shopsSeen.push(encounter.id);
    markerFixed.closeShop(markerFixedState);
  } else if (markerFixedState.mode === "module_select") {
    modulesSeen.push(encounter.id);
    markerFixed.applyModule(markerFixedState, modulesSeen.length % 2 ? "copy" : "archive");
  }
}
if (markerFixedState.mode !== "result" || markerFixedState.demoV2.marker.completedEncounters !== 17
  || shopsSeen.join(",") !== "2,5,8,11,14,16" || modulesSeen.join(",") !== "1,3,6,9,12"
  || markerFixedState.materials !== markerFixed.guaranteedMaterialTotal
  || markerFixedState.demoV2.marker.moduleChoiceIndex !== 5) {
  console.error("The 17-encounter schedule, six shops, five modules, or guaranteed economy drifted", shopsSeen, modulesSeen, markerFixedState.materials, markerFixedState.demoV2.marker);
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "marker-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "marker" });
markerFixedState = V2.getState();
for (let index = 0; index < 4; index++) markerFixed.applyModule(markerFixedState, "copy", true);
if (markerFixedState.activeFormParams.markerFixedBaseLineScale >= 1
  || markerFixedState.activeFormParams.markerFixedCopyLineScale >= markerFixedState.activeFormParams.markerFixedBaseLineScale
  || markerFixedState.activeFormParams.markerFixedSecondRoundScale >= 1) {
  console.error("Stage-4 Copy growth must add visible lines without letting every line inherit full damage", markerFixedState.activeFormParams);
  process.exit(1);
}
markerFixedState.activeFormParams.markerFixedFullscreenChance = 1;
markerFixedState.enemies = [{ id: "copy-ultimate-target", typeId: "todo", x: markerFixedState.player.x + 180, y: markerFixedState.player.y, r: 14, hp: 900, maxHp: 900, speed: 0, baseSpeed: 0, damage: 0, dead: false, color: "#fff", rooted: 0 }];
V2.combat.fireWeapon(markerFixedState);
if (!markerFixedState.formEvents.some((event) => event.source === "marker_test_fullscreen_copy")) {
  console.error("Copy Lv4 must produce a non-recursive fullscreen laser event");
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "marker-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "marker" });
markerFixedState = V2.getState();
for (let index = 0; index < 4; index++) markerFixed.applyModule(markerFixedState, "archive", true);
markerFixedState.activeFormParams.markerFixedFullscreenChance = 1;
markerFixedState.enemies = [{ id: "archive-ultimate-target", typeId: "todo", x: markerFixedState.player.x + 180, y: markerFixedState.player.y, r: 14, hp: 900, maxHp: 900, speed: 0, baseSpeed: 0, damage: 0, dead: false, color: "#fff", rooted: 0 }];
V2.combat.fireWeapon(markerFixedState);
if (!markerFixedState.damageZones.some((zone) => zone.source === "marker_test_fullscreen_archive")) {
  console.error("Archive Lv4 must produce a temporary fullscreen ink zone");
  process.exit(1);
}
const markerGrowthAssetPaths = [
  "assets/generated-ui-v2/marker-v21-build-icons.png",
  "assets/generated-ui-v2/marker-v21-experience-icons.png"
];
const markerGrowthCss = fs.readFileSync(path.join(baseDir, "styles.css"), "utf8");
const markerGrowthRender = fs.readFileSync(path.join(baseDir, "src/v2/ui/render.js"), "utf8");
if (markerGrowthAssetPaths.some((assetPath) => !fs.existsSync(path.join(baseDir, assetPath)))
  || markerGrowthAssetPaths.some((assetPath) => !markerGrowthCss.includes(assetPath))
  || !markerGrowthRender.includes('markerGrowthIconHtml("experience", choice.id')
  || !markerGrowthRender.includes('fixedComponentIconHtml(fixedConfig, offer.statId')
  || !markerGrowthRender.includes('fixedConfig.weaponId === "marker" ? markerGrowthIconHtml("build", choice.id')) {
  console.error("Demo V2.1 growth icon assets must remain wired into XP, module, and component decisions");
  process.exit(1);
}
console.log("OK Demo V2.1 Marker: first-stage module, timer-or-clear normal stages, 70 HP, no line knockback, soft slowing ink bands, mutually exclusive component variants, Boss/add HP separation, 17 encounters / 6 shops / 5 modules");

const thermosFixed = V2.demoV2 && V2.demoV2.thermosFixed;
if (!thermosFixed || thermosFixed.version !== "Demo V2.2" || thermosFixed.weaponId !== "thermos"
  || thermosFixed.runtimeKey !== "thermos" || thermosFixed.encounterCount !== 17 || thermosFixed.shopCount !== 6
  || Object.keys(thermosFixed.modules).sort().join(",") !== "condensation,heatwave"
  || thermosFixed.parts.tip.statNames.pierce !== "暴击"
  || thermosFixed.uiFramework.weaponSelection.activeIds.join(",") !== "thermos") {
  console.error("Thermos fixed-type test contract missing or drifted", thermosFixed);
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "thermos-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "marker" });
let thermosState = V2.getState();
if (thermosState.selectedWeaponId !== "thermos" || thermosState.stage.demoV2Phase !== "thermos-fixed"
  || thermosState.maxHp !== 74 || thermosState.activeFormParams.range > 240 || thermosState.activeFormParams.cooldown > 1.05
  || thermosState.activeFormParams.width < 190 || thermosState.activeForm.mechanicType !== "thermos_fixed_fan") {
  console.error("Demo V2.2 must force a vulnerable short-wide thermos fixed test", thermosState.selectedWeaponId, thermosState.maxHp, thermosState.activeFormParams);
  process.exit(1);
}
thermosFixed.applyModule(thermosState, "condensation", true);
thermosFixed.applyModule(thermosState, "condensation", true);
thermosFixed.applyModule(thermosState, "heatwave", true);
const front = { id: "thermos-front", typeId: "todo", x: thermosState.player.x + 120, y: thermosState.player.y, r: 14, hp: 22, maxHp: 22, speed: 0, baseSpeed: 0, damage: 0, dead: false, color: "#fff", rooted: 0 };
const frontCompanion = { id: "thermos-front-companion", typeId: "todo", x: thermosState.player.x + 128, y: thermosState.player.y + 34, r: 14, hp: 900, maxHp: 900, speed: 0, baseSpeed: 0, damage: 0, dead: false, color: "#fff", rooted: 0 };
const back = { id: "thermos-back", typeId: "todo", x: thermosState.player.x - 90, y: thermosState.player.y, r: 14, hp: 900, maxHp: 900, speed: 0, baseSpeed: 0, damage: 0, dead: false, color: "#fff", rooted: 0 };
thermosState.enemies = [front, frontCompanion, back];
const backX = back.x;
V2.combat.fireWeapon(thermosState);
const condensationZones = thermosState.damageZones.filter((zone) => zone.source === "thermos_test_condensation");
const baseSteamZones = thermosState.damageZones.filter((zone) => zone.source === "thermos_test_base");
if (condensationZones.length !== 2 || condensationZones.some((zone) => !zone.noKnockback)
  || baseSteamZones.length !== 1 || baseSteamZones.some((zone) => zone.type !== "polygon" || !zone.noKnockback || zone.slow < 0.25 || zone.life < 0.6)
  || back.x !== backX || front.x <= thermosState.player.x + 120
  || new Set(thermosState.formEvents.filter((event) => event.source === "thermos_test_base").map((event) => event.meta && event.meta.groupIndex)).size !== 1) {
  console.error("Thermos base attack must be one shared-CD short-wide fan with fixed push, slow/DOT residue and two condensation segments", baseSteamZones, condensationZones, thermosState.formEvents, front, back);
  process.exit(1);
}
thermosState.demoV2.thermos.pendingFocusHits.forEach((pending) => { pending.due = 0; });
V2.combat.qa.updateThermosFixedPendingFocus(thermosState);
if (!front.dead || thermosState.demoV2.thermos.stageFocusKills !== 1
  || thermosState.demoV2.thermos.stageHeatwaveTriggers !== 1
  || thermosState.damageZones.filter((zone) => zone.source === "thermos_test_kill_heatwave").length !== 1) {
  console.error("Focused heat must finish a low-health target and create exactly one non-chaining death heatwave", front, thermosState.demoV2.thermos, thermosState.damageZones);
  process.exit(1);
}
const heatwaveCount = thermosState.demoV2.thermos.stageHeatwaveTriggers;
V2.combat.qa.updateZones(thermosState, 0.5);
if (thermosState.demoV2.thermos.stageHeatwaveTriggers !== heatwaveCount) {
  console.error("Death heatwaves must never recursively create more heatwaves", thermosState.demoV2.thermos);
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "thermos-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "thermos" });
thermosState = V2.getState();
for (let index = 0; index < 4; index++) thermosFixed.applyModule(thermosState, "condensation", true);
thermosState.activeFormParams.thermosFixedFullscreenChance = 1;
thermosState.enemies = [{ id: "thermos-condensation-ultimate", typeId: "todo", x: thermosState.player.x + 120, y: thermosState.player.y, r: 14, hp: 900, maxHp: 900, speed: 0, baseSpeed: 0, damage: 0, dead: false, color: "#fff", rooted: 0 }];
V2.combat.fireWeapon(thermosState);
if (!thermosState.damageZones.some((zone) => zone.source === "thermos_test_fullscreen_condensation" && zone.noKnockback)) {
  console.error("Condensation Lv4 must create a temporary non-knockback fullscreen damage field");
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "thermos-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "thermos" });
thermosState = V2.getState();
for (let index = 0; index < 4; index++) thermosFixed.applyModule(thermosState, "heatwave", true);
thermosState.activeFormParams.thermosFixedFullscreenChance = 1;
thermosState.enemies = [{ id: "thermos-ignition-ultimate", typeId: "meeting", x: thermosState.player.x + 120, y: thermosState.player.y, r: 14, hp: 25, maxHp: 25, speed: 0, baseSpeed: 0, damage: 0, dead: false, color: "#fff", rooted: 0, markerFixedElite: true }];
V2.combat.fireWeapon(thermosState);
if (!thermosState.formEvents.some((event) => event.source === "thermos_test_fullscreen_ignition")
  || thermosState.damageZones.some((zone) => zone.source === "thermos_test_fullscreen_ignition")) {
  console.error("Heatwave Lv4 must point-kill key targets instead of becoming a generic fullscreen AoE", thermosState.formEvents, thermosState.damageZones);
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "thermos-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "thermos" });
thermosState = V2.getState();
const thermosPriorityBoss = { id: "thermos-priority-boss", typeId: "lead", boss: true, x: thermosState.player.x + 175, y: thermosState.player.y, r: 30, hp: 400, maxHp: 400, speed: 0, damage: 0, dead: false, color: "#fff" };
thermosState.enemies = [
  thermosPriorityBoss,
  { id: "thermos-cluster-a", typeId: "todo", x: thermosState.player.x - 120, y: thermosState.player.y - 20, r: 12, hp: 100, maxHp: 100, speed: 0, damage: 0, dead: false, color: "#fff" },
  { id: "thermos-cluster-b", typeId: "todo", x: thermosState.player.x - 130, y: thermosState.player.y + 10, r: 12, hp: 100, maxHp: 100, speed: 0, damage: 0, dead: false, color: "#fff" },
  { id: "thermos-cluster-c", typeId: "todo", x: thermosState.player.x - 110, y: thermosState.player.y + 35, r: 12, hp: 100, maxHp: 100, speed: 0, damage: 0, dead: false, color: "#fff" }
];
V2.combat.fireWeapon(thermosState);
if (thermosPriorityBoss.hp >= thermosPriorityBoss.maxHp) {
  console.error("Thermos must aim its short fan at an in-range Boss instead of ignoring it for a denser add pack", thermosState.formEvents);
  process.exit(1);
}
console.log("OK Demo V2.2 Thermos: short-wide shared-CD front fans, fixed single knockback, segmented condensation, focused kill conversion, non-chaining heatwaves, distinct Lv4 ultimates");

if (thermosFixed.visualVersion !== "Demo V2.4") {
  console.error("Thermos fixed test must expose the Demo V2.4 visual-pass identity", thermosFixed.visualVersion);
  process.exit(1);
}
const scissorsFixed = V2.demoV2 && V2.demoV2.scissorsFixed;
if (!scissorsFixed || scissorsFixed.version !== "Demo V2.3" || scissorsFixed.weaponId !== "scissors"
  || scissorsFixed.runtimeKey !== "scissors" || scissorsFixed.baseMaxHp !== 58 || scissorsFixed.visualVersion !== "Demo V2.4"
  || Object.keys(scissorsFixed.modules).sort().join(",") !== "closed,open"
  || scissorsFixed.parts.tip.statNames.pierce !== "暴击"
  || scissorsFixed.parts.body.statNames.amount !== "闪避"
  || scissorsFixed.parts.tail.statNames.duration !== "移速"
  || !scissorsFixed.fixedItem || scissorsFixed.uiFramework.itemShop.enabled !== false
  || scissorsFixed.uiFramework.weaponSelection.activeIds.join(",") !== "scissors") {
  console.error("Scissors fixed-type test contract missing or drifted", scissorsFixed);
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "scissors-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "marker" });
let scissorsState = V2.getState();
if (scissorsState.selectedWeaponId !== "scissors" || scissorsState.stage.demoV2Phase !== "scissors-fixed"
  || scissorsState.maxHp !== 58 || scissorsState.activeForm.mechanicType !== "scissors_fixed_melee"
  || scissorsState.activeFormParams.range > 252 || scissorsState.player.speed < 250) {
  console.error("Demo V2.3 must force a vulnerable, mobile, capped-range melee test", scissorsState.selectedWeaponId, scissorsState.maxHp, scissorsState.activeFormParams);
  process.exit(1);
}
if (scissorsState.activeFormParams.scissorsDashChargeTime !== 7.2
  || scissorsState.activeFormParams.scissorsDashRoundCharge !== 0.13) {
  console.error("Demo V2.8 Light Step must charge deliberately instead of refreshing every few attacks", scissorsState.activeFormParams);
  process.exit(1);
}
scissorsFixed.onRoundComplete(scissorsState, 5);
if (scissorsState.demoV2.scissors.dashCharge > 0.191) {
  console.error("Multi-target scissors rounds must have a capped, modest dash-charge bonus", scissorsState.demoV2.scissors.dashCharge);
  process.exit(1);
}
scissorsState.demoV2.scissors.dashCharge = 0;
const scissorsFront = { id: "scissors-front", typeId: "todo", x: scissorsState.player.x + 82, y: scissorsState.player.y, r: 12, hp: 500, maxHp: 500, speed: 0, damage: 0, dead: false, color: "#fff", rooted: 0 };
const scissorsBack = { id: "scissors-back", typeId: "todo", x: scissorsState.player.x - 82, y: scissorsState.player.y, r: 12, hp: 500, maxHp: 500, speed: 0, damage: 0, dead: false, color: "#fff", rooted: 0 };
scissorsState.enemies = [scissorsFront, scissorsBack];
V2.combat.qa.fireScissorsFixedTest(scissorsState);
V2.combat.qa.fireScissorsFixedTest(scissorsState);
if (scissorsState.demoV2.scissors.pendingActions.length !== 1 || scissorsState.stats.shots !== 1) {
  console.error("Scissors may not start a second attack round while the current timeline is active", scissorsState.demoV2.scissors);
  process.exit(1);
}
V2.combat.qa.updateScissorsFixedActions(scissorsState, 0.2);
if (scissorsFront.hp >= scissorsFront.maxHp || scissorsBack.hp !== scissorsBack.maxHp
  || !scissorsState.formEvents.some((event) => event.source === "scissors_test_base")) {
  console.error("Unmodded scissors must be a short forward cut with no rear hit", scissorsFront, scissorsBack, scissorsState.formEvents);
  process.exit(1);
}

// Light Step remains charged while idle and becomes a short, readable movement
// timeline only when the player supplies a direction.
scissorsState.demoV2.scissors.dashCharge = 1;
scissorsState.demoV2.scissors.dashReady = true;
const idleDashStartX = scissorsState.player.x;
V2.combat.qa.fireScissorsFixedTest(scissorsState);
if (!scissorsState.demoV2.scissors.dashReady || scissorsState.player.x !== idleDashStartX
  || scissorsState.demoV2.scissors.dashMotionTime !== 0
  || scissorsState.formEvents.some((event) => event.source === "scissors_test_dash")) {
  console.error("Light Step must not trigger or consume charge while the player is standing still", scissorsState.demoV2.scissors, scissorsState.formEvents);
  process.exit(1);
}
V2.combat.qa.updateScissorsFixedActions(scissorsState, 1);
scissorsState.input.right = true;
const dashStartX = scissorsState.player.x;
const dashTargetHp = scissorsFront.hp;
V2.combat.qa.fireScissorsFixedTest(scissorsState);
if (scissorsState.player.x !== dashStartX || scissorsFront.hp !== dashTargetHp
  || !scissorsState.formEvents.some((event) => event.source === "scissors_test_dash" && event.meta && event.meta.noDamage)
  || scissorsState.demoV2.scissors.dashWindow !== 0.22 || scissorsState.demoV2.scissors.dashMotionTime !== 0.18) {
  console.error("Light Step must start a visible movement timeline, grant its fixed dodge window, and deal no damage", scissorsState.player, scissorsState.demoV2.scissors, scissorsState.formEvents);
  process.exit(1);
}
V2.combat.qa.updateInput(scissorsState, 0.09);
const halfDashDistance = scissorsState.player.x - dashStartX;
V2.combat.qa.updateInput(scissorsState, 0.09);
if (halfDashDistance < 38 || halfDashDistance > 44 || Math.abs(scissorsState.player.x - dashStartX - 82) > 0.01) {
  console.error("Light Step must travel progressively for 82px instead of teleporting", halfDashDistance, scissorsState.player.x - dashStartX, scissorsState.demoV2.scissors);
  process.exit(1);
}
V2.combat.qa.updateScissorsFixedActions(scissorsState, 1);
scissorsState.input.right = false;

// Component attack speed scales the complete timeline once; range and movement
// cannot mutate the fixed dash distance/window.
const baseScissorsCooldown = scissorsState.activeFormParams.cooldown;
const baseDashDistance = scissorsState.activeFormParams.scissorsDashDistance;
scissorsState.demoV2.scissors.parts.body.allocations.attackSpeed = 2;
scissorsState.demoV2.scissors.parts.tail.allocations.range = 4;
scissorsState.demoV2.scissors.parts.tail.allocations.duration = 4;
scissorsFixed.rebuildParams(scissorsState);
if (scissorsState.activeFormParams.cooldown >= baseScissorsCooldown
  || scissorsState.activeFormParams.scissorsDashDistance !== baseDashDistance
  || scissorsState.activeFormParams.scissorsDashWindow !== 0.22
  || scissorsState.activeFormParams.scissorsThrustRange > 252
  || scissorsState.activeFormParams.scissorsFanRange > 205
  || scissorsState.player.speed <= 250) {
  console.error("Scissors components must improve the intended stat without scaling dash or breaking the melee cap", scissorsState.activeFormParams, scissorsState.player.speed);
  process.exit(1);
}

// Closed Blade Lv4 stays a long strip and applies reduced slow to elites/Bosses.
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "scissors-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "scissors" });
scissorsState = V2.getState();
for (let index = 0; index < 4; index++) scissorsFixed.applyModule(scissorsState, "closed", true);
const severTarget = { id: "scissors-sever-target", typeId: "meeting", x: scissorsState.player.x + 150, y: scissorsState.player.y, r: 15, hp: 2000, maxHp: 2000, speed: 100, damage: 0, dead: false, color: "#fff", rooted: 0, markerFixedElite: true };
scissorsState.enemies = [severTarget];
V2.combat.qa.fireScissorsFixedTest(scissorsState);
V2.combat.qa.updateScissorsFixedActions(scissorsState, 2);
if (scissorsState.demoV2.scissors.totalClosedHits !== 3 || scissorsState.demoV2.scissors.totalSevers !== 1
  || severTarget.scissorsSlowTime <= 0 || severTarget.scissorsSlow >= scissorsState.activeFormParams.scissorsSeverSlow
  || !scissorsState.formEvents.some((event) => event.source === "scissors_test_sever")) {
  console.error("Closed Blade Lv4 must be three locked thrusts followed by a reduced-on-elite slowing sever", scissorsState.demoV2.scissors, severTarget, scissorsState.formEvents);
  process.exit(1);
}

// Open Blade Lv4 has six cuts plus one non-crit execution check.
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "scissors-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "scissors" });
scissorsState = V2.getState();
for (let index = 0; index < 4; index++) scissorsFixed.applyModule(scissorsState, "open", true);
const executeTarget = { id: "scissors-execute-target", typeId: "todo", x: scissorsState.player.x + 78, y: scissorsState.player.y, r: 13, hp: 150, maxHp: 1000, speed: 0, damage: 0, dead: false, color: "#fff", rooted: 0 };
scissorsState.enemies = [executeTarget];
V2.combat.qa.fireScissorsFixedTest(scissorsState);
V2.combat.qa.updateScissorsFixedActions(scissorsState, 2);
if (!executeTarget.dead || scissorsState.demoV2.scissors.totalOpenHits !== 6
  || scissorsState.demoV2.scissors.totalFinales !== 1 || scissorsState.demoV2.scissors.totalExecutions !== 1
  || !scissorsState.formEvents.some((event) => event.source === "scissors_test_finale")) {
  console.error("Open Blade Lv4 must perform six locked cuts and execute only on the closing hit", executeTarget, scissorsState.demoV2.scissors, scissorsState.formEvents);
  process.exit(1);
}

// A 2/2 mixed route preserves both phases and is longer than either Lv2 route.
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "scissors-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "scissors" });
scissorsState = V2.getState();
for (let index = 0; index < 2; index++) scissorsFixed.applyModule(scissorsState, "closed", true);
const closedTwoDuration = scissorsState.activeFormParams.scissorsActionDuration;
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "scissors-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "scissors" });
scissorsState = V2.getState();
for (let index = 0; index < 2; index++) scissorsFixed.applyModule(scissorsState, "open", true);
const openTwoDuration = scissorsState.activeFormParams.scissorsActionDuration;
for (let index = 0; index < 2; index++) scissorsFixed.applyModule(scissorsState, "closed", true);
if (scissorsState.activeFormParams.scissorsActionDuration <= Math.max(closedTwoDuration, openTwoDuration)
  || scissorsState.activeFormParams.scissorsThrustCount !== 2 || scissorsState.activeFormParams.scissorsCutCount !== 4
  || scissorsState.activeFormParams.scissorsSever || scissorsState.activeFormParams.scissorsFinale) {
  console.error("Mixed scissors routes must contain both sequential phases, last longer, and gain neither Lv4 finisher", scissorsState.activeFormParams);
  process.exit(1);
}

// Fixed low-HP shelter blocks exterior shots, but is not invulnerability.
scissorsState.hp = scissorsState.maxHp * 0.3 + 1;
V2.combat.damagePlayer(scissorsState, 3, "#fff");
const hpInsideShelter = scissorsState.hp;
const outsideShot = { x: scissorsState.player.x + 100, y: scissorsState.player.y, originX: scissorsState.player.x + 240, originY: scissorsState.player.y, radius: 5 };
const insideShot = { x: scissorsState.player.x + 40, y: scissorsState.player.y, originX: scissorsState.player.x + 40, originY: scissorsState.player.y, radius: 5 };
if (!scissorsState.demoV2.scissors.shelterActive || !scissorsFixed.blocksHostileProjectile(scissorsState, outsideShot)
  || scissorsFixed.blocksHostileProjectile(scissorsState, insideShot)) {
  console.error("Low-HP shelter must block only projectiles that originate outside its zone", scissorsState.demoV2.scissors);
  process.exit(1);
}
V2.combat.damagePlayer(scissorsState, 2, "#fff");
if (scissorsState.hp >= hpInsideShelter || scissorsState.demoV2.scissors.totalShelterTriggers !== 1) {
  console.error("Low-HP shelter must not block contact/direct damage or retrigger in the same low-health state", scissorsState.hp, scissorsState.demoV2.scissors);
  process.exit(1);
}
console.log("OK Demo V2.3 Scissors: pure-melee locked timeline, fixed no-damage Light Step, Closed/Open routes, capped components, execution, and directional low-HP shelter");

const combatVisualSource = fs.readFileSync(path.join(baseDir, "src/v2/combat/systems.js"), "utf8");
const v24VisualAssets = [
  "thermos-body-v24.png",
  "thermos-fan-v24-sheet.png",
  "thermos-condensation-v24-sheet.png",
  "thermos-focus-v24-sheet.png",
  "thermos-heatwave-v24-sheet.png",
  "scissors-dash-v24-sheet.png",
  "scissors-slash-v24-sheet.png",
  "scissors-thrust-v24-sheet.png",
  "scissors-shelter-v24-sheet.png",
  "scissors-strike-v27-sheet.png",
  "scissors-shelter-v27-sheet.png",
  "scissors-dash-direction-v27-sheet.png"
];
if (!combatVisualSource.includes("function drawSpriteFrame")
  || !combatVisualSource.includes("function drawV24LinearEvent")
  || !combatVisualSource.includes("function drawV24AreaEvent")
  || v24VisualAssets.some((asset) => !combatVisualSource.includes(asset) || !fs.existsSync(path.join(baseDir, "assets/generated-vfx/sprites", asset)))) {
  console.error("Demo V2.4 must keep all Thermos/Scissors frame assets and judgment-driven render hooks", v24VisualAssets);
  process.exit(1);
}
console.log("OK Demo V2.4 combat visuals: Thermos/Scissors static identity plus judgment-driven 2x2 frame animation assets");

const correctionFixed = V2.demoV2 && V2.demoV2.correctionFluidFixed;
if (!correctionFixed || correctionFixed.version !== "Demo V2.5" || correctionFixed.weaponId !== "correction_fluid"
  || correctionFixed.runtimeKey !== "correctionFluid" || correctionFixed.encounterCount !== 17 || correctionFixed.shopCount !== 6
  || Object.keys(correctionFixed.modules).sort().join(",") !== "correction,spread"
  || correctionFixed.parts.tip.statNames.pierce !== "攻速"
  || correctionFixed.parts.body.statNames.attackSpeed !== "暴击"
  || correctionFixed.parts.body.statNames.amount !== "范围"
  || correctionFixed.parts.tail.statNames.range !== "持续时间"
  || correctionFixed.parts.tail.statNames.duration !== "移动速度"
  || correctionFixed.uiFramework.weaponSelection.activeIds.join(",") !== "correction_fluid") {
  console.error("Correction-fluid fixed-type test contract missing or drifted", correctionFixed);
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "correction-fluid-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "marker" });
let correctionState = V2.getState();
correctionState.warmupTime = 0;
const correctionTarget = { id: "correction-base", typeId: "meeting", x: correctionState.player.x + 150, y: correctionState.player.y, r: 15, hp: 900, maxHp: 900, speed: 100, damage: 0, dead: false, color: "#fff", rooted: 0 };
correctionState.enemies = [correctionTarget];
V2.combat.fireWeapon(correctionState);
if (correctionState.selectedWeaponId !== "correction_fluid" || correctionTarget.correctionErrorStacks !== 1
  || !correctionState.formEvents.some((event) => event.source === "correction_test_spray")
  || !correctionState.formEvents.some((event) => event.source === "correction_test_error_apply")) {
  console.error("Correction-fluid base spray must force the weapon and create one readable error stack", correctionState.selectedWeaponId, correctionTarget, correctionState.formEvents);
  process.exit(1);
}
const nearestCorrectionTarget = { id: "correction-nearest", typeId: "todo", x: correctionState.player.x + 70, y: correctionState.player.y, r: 12, hp: 800, maxHp: 800, speed: 0, damage: 0, dead: false, color: "#fff", rooted: 0 };
const distantLowHpTarget = { id: "correction-distant-low", typeId: "todo", x: correctionState.player.x + 220, y: correctionState.player.y, r: 12, hp: 1, maxHp: 100, speed: 0, damage: 0, dead: false, color: "#fff", rooted: 0 };
correctionState.enemies = [distantLowHpTarget, nearestCorrectionTarget];
V2.combat.fireWeapon(correctionState);
if (nearestCorrectionTarget.correctionErrorStacks !== 1 || distantLowHpTarget.correctionErrorStacks) {
  console.error("Correction Fluid primary spray must protect the player by selecting the nearest threat before distant low-HP targets", nearestCorrectionTarget, distantLowHpTarget);
  process.exit(1);
}
correctionFixed.applyModule(correctionState, "spread", true);
correctionTarget.correctionErrorStacks = 3;
correctionTarget.correctionErrorTime = 4;
V2.combat.qa.damageEnemy(correctionState, correctionTarget, 9999, "correction_test_spray");
const firstErrorArea = correctionState.damageZones.find((zone) => zone.correctionArea);
if (!firstErrorArea || firstErrorArea.damage >= correctionState.activeFormParams.damage * 0.5 || !firstErrorArea.noKnockback) {
  console.error("An overloaded death must create a low-damage, no-knockback error area", firstErrorArea);
  process.exit(1);
}
const correctionRadiusLv1 = correctionState.activeFormParams.correctionAreaRadius;
const correctionAreaDamageLv1 = correctionState.activeFormParams.correctionAreaDamage;
correctionFixed.applyModule(correctionState, "spread", true);
const correctionRadiusLv2 = correctionState.activeFormParams.correctionAreaRadius;
correctionFixed.applyModule(correctionState, "spread", true);
const correctionRadiusLv3 = correctionState.activeFormParams.correctionAreaRadius;
if (!(correctionRadiusLv1 >= 88 && correctionRadiusLv1 < correctionRadiusLv2 && correctionRadiusLv2 < correctionRadiusLv3)
  || correctionRadiusLv3 - correctionRadiusLv2 > 12 || correctionRadiusLv3 > 110
  || correctionAreaDamageLv1 >= correctionState.activeFormParams.damage * 0.2) {
  console.error("Correction areas must start useful, grow linearly, and remain auxiliary damage", correctionRadiusLv1, correctionRadiusLv2, correctionRadiusLv3, correctionAreaDamageLv1);
  process.exit(1);
}
const areaVictim = { id: "correction-area-victim", typeId: "todo", x: firstErrorArea.x, y: firstErrorArea.y, r: 12, hp: 100, maxHp: 100, speed: 100, damage: 0, dead: false, color: "#fff", rooted: 0 };
correctionState.enemies = [areaVictim];
firstErrorArea.tick = 0;
V2.combat.qa.updateZones(correctionState, 0.01);
if (areaVictim.correctionErrorStacks !== 1 || areaVictim.hp >= 100) {
  console.error("Error areas must both infect and deal auxiliary correction-fluid damage", areaVictim);
  process.exit(1);
}

V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "correction-fluid-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "correction_fluid" });
correctionState = V2.getState();
correctionState.warmupTime = 0;
for (let index = 0; index < 4; index++) correctionFixed.applyModule(correctionState, "spread", true);
for (let index = 0; index < 3; index++) {
  const overloaded = { id: "correction-crash-source-" + index, typeId: "todo", x: correctionState.player.x + 90 + index * 240, y: correctionState.player.y + (index % 2) * 180, r: 12, hp: 1, maxHp: 100, speed: 0, damage: 0, dead: false, color: "#fff", rooted: 0, correctionErrorStacks: 3, correctionErrorTime: 4 };
  correctionState.enemies.push(overloaded);
  V2.combat.qa.damageEnemy(correctionState, overloaded, 999, "correction_test_spray");
}
const crashTarget = { id: "correction-crash-target", typeId: "meeting", x: correctionState.player.x + 120, y: correctionState.player.y, r: 14, hp: 900, maxHp: 900, speed: 0, damage: 0, dead: false, color: "#fff", rooted: 0, correctionErrorStacks: 2, correctionErrorTime: 4 };
correctionState.enemies.push(crashTarget);
V2.combat.fireWeapon(correctionState);
if (correctionState.demoV2.correctionFluid.totalSystemCrashes !== 1
  || !correctionState.formEvents.some((event) => event.source === "correction_test_system_crash")) {
  console.error("Spread Lv4 must consume three live areas in a real System Crash", correctionState.demoV2.correctionFluid, correctionState.formEvents);
  process.exit(1);
}

V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "correction-fluid-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "correction_fluid" });
correctionState = V2.getState();
correctionState.warmupTime = 0;
for (let index = 0; index < 4; index++) correctionFixed.applyModule(correctionState, "correction", true);
const finalTarget = { id: "correction-final-target", typeId: "meeting", x: correctionState.player.x + 140, y: correctionState.player.y, r: 14, hp: 22, maxHp: 240, speed: 0, damage: 0, dead: false, color: "#fff", rooted: 0, correctionErrorStacks: 3, correctionErrorTime: 5 };
correctionState.enemies = [finalTarget];
V2.combat.fireWeapon(correctionState);
if (correctionState.demoV2.correctionFluid.totalFinalCorrections !== 1
  || !correctionState.formEvents.some((event) => event.source === "correction_test_final")) {
  console.error("Fatal Correction Lv4 must consume the highest error target and emit Final Correction", correctionState.demoV2.correctionFluid, correctionState.formEvents);
  process.exit(1);
}

V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "correction-fluid-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "correction_fluid" });
correctionState = V2.getState();
correctionState.warmupTime = 0;
correctionFixed.applyModule(correctionState, "spread", true);
const correctionBoss = { id: "correction-boss-leak", typeId: "lead", x: correctionState.player.x + 120, y: correctionState.player.y, r: 30, hp: 1000, maxHp: 1000, speed: 0, damage: 0, dead: false, color: "#fff", rooted: 0, boss: true, correctionErrorStacks: 2, correctionErrorTime: 5 };
correctionState.enemies = [correctionBoss];
V2.combat.fireWeapon(correctionState);
if (!correctionState.damageZones.some((zone) => zone.correctionArea)
  || correctionState.demoV2.correctionFluid.bossAreaLeakReadyAt <= 0) {
  console.error("Spread route must create a live error area after overloading a Boss, even before the Boss dies", correctionState.damageZones, correctionState.demoV2.correctionFluid);
  process.exit(1);
}

const correctionVisualAssets = [
  "correction-fluid-body-v25.png",
  "correction-fluid-spray-v25-sheet.png",
  "correction-fluid-error-v25-sheet.png",
  "correction-fluid-area-v25-sheet.png",
  "correction-fluid-crash-v25-sheet.png",
  "correction-fluid-glitch-v25-sheet.png",
  "correction-fluid-final-v25-sheet.png"
];
if (correctionVisualAssets.some((asset) => !combatVisualSource.includes(asset) || !fs.existsSync(path.join(baseDir, "assets/generated-vfx/sprites", asset)))) {
  console.error("Demo V2.5 must keep all correction-fluid identity and four-frame dynamic assets", correctionVisualAssets);
  process.exit(1);
}
console.log("OK Demo V2.5 Correction Fluid: three error stacks, infection fields, System Crash, Final Correction, exclusive components and seven cyber-neon assets");

const fourWeaponFixed = V2.demoV2 && V2.demoV2.fourWeaponFixed;
if (!fourWeaponFixed || fourWeaponFixed.version !== "Demo V2.9" || !fourWeaponFixed.coordinator
  || fourWeaponFixed.weaponCards.map((weapon) => weapon.id).join(",") !== "marker,thermos,scissors,correction_fluid"
  || Object.keys(fourWeaponFixed.childPhaseByWeapon).length !== 4
  || !combatVisualSource.includes("function drawSuiteNeonLine") || !combatVisualSource.includes("function drawSuiteNeonArea")) {
  console.error("Demo V2.9 four-weapon coordinator or shared cyber-neon combat layer missing", fourWeaponFixed);
  process.exit(1);
}
const fourWeaponV3 = V2.demoV2 && V2.demoV2.fourWeaponV3;
const v3SkinSource = fs.readFileSync(path.join(baseDir, "generated-skin.css"), "utf8");
const v3EntrySource = fs.readFileSync(path.join(baseDir, "demo-v3-0.html"), "utf8");
if (!fourWeaponV3 || fourWeaponV3.version !== "Demo V3.0" || !fourWeaponV3.combatExperiencePass || !fourWeaponV3.neonCityTheme
  || fourWeaponV3.weaponCards.map((weapon) => weapon.id).join(",") !== fourWeaponFixed.weaponCards.map((weapon) => weapon.id).join(",")
  || !v3EntrySource.includes('params.set("demoV2", "four-weapon-v3")')
  || !v3SkinSource.includes('data-experience-pass="true"') || !v3SkinSource.includes(".growth-feedback")) {
  console.error("Demo V3.0 must remain a scoped perception pass over V2.9 with its own entry, neon surface and growth confirmation", fourWeaponV3);
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-v3" });
V2.dispatch({ type: "START_RUN", weaponId: "marker" });
const v3FeedbackState = V2.getState();
const v3FeedbackConfig = V2.getDemoV2FixedTestConfig(v3FeedbackState);
const v3ModuleChoice = v3FeedbackConfig.makeModuleChoices(v3FeedbackState).find((choice) => !choice.disabled);
V2.dispatch({ type: "SELECT_DEMO_V2_MODULE", moduleId: v3ModuleChoice.id });
if (v3FeedbackState.demoV2.suiteVersion !== "Demo V3.0" || !v3FeedbackState.demoV2.combatExperiencePass
  || !v3FeedbackState.demoV2.neonCityTheme || !v3FeedbackState.demoV2.growthFeedback
  || v3FeedbackState.demoV2.growthFeedback.kind !== "module") {
  console.error("Demo V3.0 selection must retain suite identity and queue a player-visible mechanism confirmation", v3FeedbackState.demoV2);
  process.exit(1);
}
if (!combatVisualSource.includes("enemy.hitFlash") || !combatVisualSource.includes("correction_test_lock")
  || !combatVisualSource.includes("marker_test_defeat") || !combatVisualSource.includes("thermos_test_defeat")
  || !combatVisualSource.includes("scissors_test_defeat") || !combatVisualSource.includes("correction_test_defeat")) {
  console.error("Demo V3.0 combat perception grammar must cover hit, target lock and four family-specific defeat confirmations");
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-v3" });
V2.dispatch({ type: "START_RUN", weaponId: "scissors" });
const v3ScissorsBalanceState = V2.getState();
if (v3ScissorsBalanceState.activeFormParams.damage !== 25
  || Math.abs(v3ScissorsBalanceState.activeFormParams.scissorsSeverDamage - 42.5) > 0.0001) {
  console.error("Demo V3.0 Scissors balance pass must reduce standing damage without removing its full visual model", v3ScissorsBalanceState.activeFormParams);
  process.exit(1);
}
console.log("OK Demo V3.0 perception pass: scoped neon UI, growth confirmation, hit/lock/defeat grammar and Scissors damage correction");

const fourWeaponV31 = V2.demoV2 && V2.demoV2.fourWeaponV31;
const v31EntrySource = fs.readFileSync(path.join(baseDir, "demo-v3-1.html"), "utf8");
if (!fourWeaponV31 || fourWeaponV31.version !== "Demo V3.1"
  || !fourWeaponV31.combatDensityPass || !fourWeaponV31.skillSilhouettePass
  || !v31EntrySource.includes('params.set("demoV2", "four-weapon-v3-1")')) {
  console.error("Demo V3.1 must preserve V3.0 while opting into high-frequency combat and distinct skill silhouettes", fourWeaponV31);
  process.exit(1);
}
const v31ExpectedBase = {
  marker: { damage: 11, cooldown: 0.58 },
  thermos: { damage: 9.5, cooldown: 0.58 },
  scissors: { damage: 13.5, cooldown: 0.3 },
  correction_fluid: { damage: 6.5, cooldown: 0.36 }
};
for (const weaponId of Object.keys(v31ExpectedBase)) {
  V2.dispatch({ type: "RESTART" });
  V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-v3-1" });
  V2.dispatch({ type: "START_RUN", weaponId });
  const tempoState = V2.getState();
  const expected = v31ExpectedBase[weaponId];
  if (!tempoState.demoV2.combatDensityPass || !tempoState.demoV2.skillSilhouettePass
    || Math.abs(tempoState.activeFormParams.damage - expected.damage) > 0.0001
    || Math.abs(tempoState.activeFormParams.cooldown - expected.cooldown) > 0.0001) {
    console.error("Demo V3.1 weapon budget must use smaller, faster attack events", weaponId, tempoState.activeFormParams, tempoState.demoV2);
    process.exit(1);
  }
  const tempoConfig = V2.getDemoV2FixedTestConfig(tempoState);
  const opening = tempoConfig.currentEncounter(tempoState);
  if (opening.spawnTotal < 70 || opening.floor < 18 || opening.cap < 49 || opening.batchSize < 9 || opening.cadence > 1.7) {
    console.error("Demo V3.1 opening encounter must sustain a materially denser enemy field", weaponId, opening);
    process.exit(1);
  }
}
if (!combatVisualSource.includes("const directionDistance = 94 + charge * 18")
  || !combatVisualSource.includes("ringSize * 1.16")
  || !combatVisualSource.includes('"热浪转发"')
  || !combatVisualSource.includes("markerEncounter.batchSize")) {
  console.error("Demo V3.1 must keep the dash indicator ahead of the weapon and give Kill Heatwave a distinct layered silhouette");
  process.exit(1);
}
console.log("OK Demo V3.1 density pass: smaller faster hits, denser authored encounters, projected dash intent and layered Kill Heatwave");

const fourWeaponV32 = V2.demoV2 && V2.demoV2.fourWeaponV32;
const v32EntrySource = fs.readFileSync(path.join(baseDir, "demo-v3-2.html"), "utf8");
if (!fourWeaponV32 || fourWeaponV32.version !== "Demo V3.2"
  || !fourWeaponV32.combatTrianglePass || !fourWeaponV32.neonBloomPass
  || !v32EntrySource.includes('params.set("demoV2", "four-weapon-v3-2")')) {
  console.error("Demo V3.2 must preserve V3.1 while deepening the combat triangle and neon bloom", fourWeaponV32);
  process.exit(1);
}
const v32ExpectedBase = {
  marker: { damage: 8.5, cooldown: 0.46 },
  thermos: { damage: 7.2, cooldown: 0.46 },
  scissors: { damage: 10.5, cooldown: 0.25 },
  correction_fluid: { damage: 5, cooldown: 0.29 }
};
for (const weaponId of Object.keys(v32ExpectedBase)) {
  V2.dispatch({ type: "RESTART" });
  V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-v3-2" });
  V2.dispatch({ type: "START_RUN", weaponId });
  const triangleState = V2.getState();
  const expected = v32ExpectedBase[weaponId];
  if (!triangleState.demoV2.combatTrianglePass || !triangleState.demoV2.neonBloomPass
    || Math.abs(triangleState.activeFormParams.damage - expected.damage) > 0.0001
    || Math.abs(triangleState.activeFormParams.cooldown - expected.cooldown) > 0.0001) {
    console.error("Demo V3.2 must deepen smaller/faster weapon events without changing V3.1", weaponId, triangleState.activeFormParams, triangleState.demoV2);
    process.exit(1);
  }
  const triangleConfig = V2.getDemoV2FixedTestConfig(triangleState);
  const opening = triangleConfig.currentEncounter(triangleState);
  if (!opening.v32CombatTrianglePass || opening.spawnTotal < 83 || opening.floor < 21
    || opening.cap < 58 || opening.batchSize < 10 || opening.cadence > 1.36) {
    console.error("Demo V3.2 opening must hold a deeper effective-target floor", weaponId, opening);
    process.exit(1);
  }
}
if (!combatVisualSource.includes('globalCompositeOperation = "lighter"')
  || !combatVisualSource.includes("size * 1.34")
  || !combatVisualSource.includes("ringSize * 1.22")
  || !v3SkinSource.includes('[data-neon-bloom="true"] canvas')) {
  console.error("Demo V3.2 neon amplification must use layered event-driven bloom and a scoped UI surface");
  process.exit(1);
}
console.log("OK Demo V3.2 combat triangle and neon bloom: deeper target floor, smaller faster events, layered event-driven light");
const fourWeaponV33 = V2.demoV2 && V2.demoV2.fourWeaponV33;
const v33EntrySource = fs.readFileSync(path.join(baseDir, "demo-v3-3.html"), "utf8");
if (!fourWeaponV33 || fourWeaponV33.version !== "Demo V3.3" || !fourWeaponV33.correctionOpeningPass
  || !fourWeaponV33.combatTrianglePass || !fourWeaponV33.neonBloomPass
  || !v33EntrySource.includes('params.set("demoV2", "four-weapon-v3-3")')) {
  console.error("Demo V3.3 must preserve V3.2 while enabling the Correction Fluid opening pass", fourWeaponV33);
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-v3-3" });
V2.dispatch({ type: "START_RUN", weaponId: "correction_fluid" });
const v33CorrectionState = V2.getState();
v33CorrectionState.warmupTime = 0;
const v33Primary = { id: "v33-primary", typeId: "todo", x: v33CorrectionState.player.x + 120, y: v33CorrectionState.player.y, r: 12, hp: 100, maxHp: 100, speed: 0, damage: 0, dead: false, color: "#fff", rooted: 0 };
const v33Overspray = { id: "v33-overspray", typeId: "todo", x: v33CorrectionState.player.x + 158, y: v33CorrectionState.player.y + 18, r: 12, hp: 100, maxHp: 100, speed: 0, damage: 0, dead: false, color: "#fff", rooted: 0 };
v33CorrectionState.enemies = [v33Primary, v33Overspray];
V2.combat.fireWeapon(v33CorrectionState);
if (Math.abs(v33CorrectionState.activeFormParams.damage - 5.8) > 0.0001
  || Math.abs(v33CorrectionState.activeFormParams.cooldown - 0.27) > 0.0001
  || !v33CorrectionState.activeFormParams.correctionOpeningOverspray
  || v33Primary.correctionErrorStacks !== 1 || v33Overspray.correctionErrorStacks !== 1
  || v33Overspray.hp >= v33Overspray.maxHp
  || !v33CorrectionState.formEvents.some((event) => event.source === "correction_test_spray" && event.meta && event.meta.overspray)) {
  console.error("Demo V3.3 Correction Fluid must turn one primary lock into one weak nearby overspray", v33CorrectionState.activeFormParams, v33Primary, v33Overspray, v33CorrectionState.formEvents);
  process.exit(1);
}
correctionFixed.applyModule(v33CorrectionState, "correction", true);
if (v33CorrectionState.activeFormParams.correctionTargetCount !== 2 || v33CorrectionState.activeFormParams.correctionOpeningOverspray) {
  console.error("Fatal Correction Lv1 must replace opening overspray with two independent primary locks", v33CorrectionState.activeFormParams);
  process.exit(1);
}
console.log("OK Demo V3.3 Correction Fluid opening: stronger primary cadence, one nearby overspray, and preserved Fatal Correction identity");
const fourWeaponV34 = V2.demoV2 && V2.demoV2.fourWeaponV34;
const v34EntrySource = fs.readFileSync(path.join(baseDir, "demo-v3-4.html"), "utf8");
if (!fourWeaponV34 || fourWeaponV34.version !== "Demo V3.4"
  || !fourWeaponV34.centeredRunStart || !fourWeaponV34.randomizedPerimeterSpawns || !fourWeaponV34.bossPatternPass
  || !fourWeaponV34.correctionOpeningPass || !fourWeaponV34.combatTrianglePass || !fourWeaponV34.neonBloomPass
  || !v34EntrySource.includes('params.set("demoV2", "four-weapon-v3-4")')) {
  console.error("Demo V3.4 must preserve V3.3 while enabling the spatial and Boss-pattern pass", fourWeaponV34);
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-v3-4" });
V2.dispatch({ type: "START_RUN", weaponId: "marker" });
const v34State = V2.getState();
if (v34State.player.x !== v34State.world.width / 2 || v34State.player.y !== v34State.world.height / 2
  || !v34State.demoV2.randomizedPerimeterSpawns || !v34State.demoV2.bossPatternPass) {
  console.error("Demo V3.4 must begin at the actual world centre with both encounter flags active", v34State.player, v34State.world, v34State.demoV2);
  process.exit(1);
}
V2.combat.updateCamera(v34State);
const perimeterSamples = Array.from({ length: 12 }, function (_, index) {
  return V2.combat.qa.demoV2PerimeterPoint(v34State, Math.PI * 2 * index / 12, 0, 0);
});
const perimeterQuadrants = new Set(perimeterSamples.map(function (point) {
  return (point.x >= v34State.player.x ? "R" : "L") + (point.y >= v34State.player.y ? "B" : "T");
}));
if (perimeterQuadrants.size !== 4 || perimeterSamples.some(function (point) {
  return point.x > v34State.camera.x && point.x < v34State.camera.x + v34State.camera.width
    && point.y > v34State.camera.y && point.y < v34State.camera.y + v34State.camera.height;
})) {
  console.error("Randomized perimeter spawning must cover the whole ring while staying outside the visible field", perimeterSamples, v34State.camera);
  process.exit(1);
}
const v34Config = V2.getDemoV2FixedTestConfig(v34State);
v34Config.startEncounter(v34State, 2);
v34State.warmupTime = 0;
V2.combat.update(0.02);
const v34Boss = v34State.enemies.find(function (enemy) { return enemy.boss; });
if (!v34Boss) {
  console.error("Demo V3.4 Boss encounter must spawn a real Boss before pattern validation", v34State.enemies);
  process.exit(1);
}
const hpBeforeWarning = v34State.hp;
const projectilesBeforeWarning = v34State.projectiles.length;
V2.combat.qa.beginBossPattern(v34State, v34Boss);
if (v34State.hp !== hpBeforeWarning || v34State.projectiles.length !== projectilesBeforeWarning
  || !v34State.formEvents.some(function (event) { return event.source === "boss_test_lane_warning"; })) {
  console.error("Boss lane must telegraph its real corridor before creating damage", v34State.formEvents, v34State.projectiles);
  process.exit(1);
}
V2.combat.qa.releaseBossPattern(v34State, v34Boss);
if (v34State.projectiles.filter(function (shot) { return shot.source === "boss_test_priority_lane"; }).length !== 5
  || !v34State.formEvents.some(function (event) { return event.source === "boss_test_lane_release"; })) {
  console.error("Boss lane release must create one readable five-projectile corridor", v34State.projectiles, v34State.formEvents);
  process.exit(1);
}
v34Boss.typeId = "director";
v34Boss.bossPatternIndex = 0;
V2.combat.qa.beginBossPattern(v34State, v34Boss);
if (!v34State.formEvents.some(function (event) { return event.source === "boss_test_burst_warning"; })
  || v34State.formEvents.filter(function (event) { return event.source === "boss_test_safe_gap"; }).length < 2) {
  console.error("Boss radial burst must show both the danger ring and the real safe-gap edges", v34State.formEvents);
  process.exit(1);
}
V2.combat.qa.releaseBossPattern(v34State, v34Boss);
if (v34State.projectiles.filter(function (shot) { return shot.source === "boss_test_audit_burst"; }).length < 8
  || !v34State.stats.bossPatterns.some(function (pattern) { return pattern.kind === "lane" && pattern.step === "release"; })
  || !v34State.stats.bossPatterns.some(function (pattern) { return pattern.kind === "burst" && pattern.step === "release"; })) {
  console.error("Demo V3.4 Bosses must expose two distinct damaging pattern families", v34State.projectiles, v34State.stats.bossPatterns);
  process.exit(1);
}
console.log("OK Demo V3.4 encounter space: centred start, full-ring perimeter entries, and two telegraphed Boss damage grammars");
const fourWeaponV35 = V2.demoV2 && V2.demoV2.fourWeaponV35;
const v35EntrySource = fs.readFileSync(path.join(baseDir, "demo-v3-5.html"), "utf8");
if (!fourWeaponV35 || fourWeaponV35.version !== "Demo V3.5"
  || !fourWeaponV35.sustainedPressurePass || !fourWeaponV35.bossPressurePass || !fourWeaponV35.attributeImpactPass
  || !fourWeaponV35.centeredRunStart || !fourWeaponV35.randomizedPerimeterSpawns || !fourWeaponV35.bossPatternPass
  || !v35EntrySource.includes('params.set("demoV2", "four-weapon-v3-5")')) {
  console.error("Demo V3.5 must preserve V3.4 while enabling sustained pressure, Boss pressure, and visible attribute impact", fourWeaponV35);
  process.exit(1);
}

function makeVersionedWeaponState(version, weaponId) {
  V2.dispatch({ type: "RESTART" });
  V2.dispatch({ type: "INIT", demoV2Phase: version });
  V2.dispatch({ type: "START_RUN", weaponId });
  return V2.getState();
}

const v35State = makeVersionedWeaponState("four-weapon-v3-5", "marker");
const v35Config = V2.getDemoV2FixedTestConfig(v35State);
v35Config.startEncounter(v35State, 2);
const v35BossEncounter = v35Config.currentEncounter(v35State);
const v34ComparisonState = makeVersionedWeaponState("four-weapon-v3-4", "marker");
const v34ComparisonConfig = V2.getDemoV2FixedTestConfig(v34ComparisonState);
v34ComparisonConfig.startEncounter(v34ComparisonState, 2);
const v34BossEncounter = v34ComparisonConfig.currentEncounter(v34ComparisonState);
if (v35BossEncounter.enemyHp < v34BossEncounter.enemyHp * 1.35
  || v35BossEncounter.enemySpeed <= v34BossEncounter.enemySpeed
  || v35BossEncounter.spawnTotal <= v34BossEncounter.spawnTotal) {
  console.error("Demo V3.5 Boss encounters must add material durability, approach speed, and sustained adds", v34BossEncounter, v35BossEncounter);
  process.exit(1);
}

const openingV35State = makeVersionedWeaponState("four-weapon-v3-5", "marker");
const openingV35Config = V2.getDemoV2FixedTestConfig(openingV35State);
const openingV35Encounter = openingV35Config.currentEncounter(openingV35State);
const openingV35Runtime = openingV35State.demoV2[openingV35Config.runtimeKey];
const releasedAtStart = V2.combat.qa.demoV2ReleasedQuota(openingV35State, openingV35Encounter, openingV35Runtime);
openingV35State.stageTime = openingV35Encounter.duration * 0.08;
const releasedNearEnd = V2.combat.qa.demoV2ReleasedQuota(openingV35State, openingV35Encounter, openingV35Runtime);
if (!(releasedAtStart < openingV35Encounter.spawnTotal * 0.7)
  || releasedAtStart < openingV35Encounter.batchSize
  || releasedNearEnd !== openingV35Encounter.spawnTotal) {
  console.error("Demo V3.5 quota must begin with a readable pack and release the complete roster across the encounter", openingV35Encounter, releasedAtStart, releasedNearEnd);
  process.exit(1);
}

const v35BossState = makeVersionedWeaponState("four-weapon-v3-5", "marker");
const v35BossConfig = V2.getDemoV2FixedTestConfig(v35BossState);
v35BossConfig.startEncounter(v35BossState, 2);
v35BossState.warmupTime = 0;
V2.combat.update(0.02);
const v35Boss = v35BossState.enemies.find(function (enemy) { return enemy.boss; });
v35Boss.x = v35BossState.player.x + 260;
v35Boss.y = v35BossState.player.y;
v35Boss.bossPatternKind = "";
v35Boss.bossPatternCooldown = 3;
v35Boss.shootCooldown = 0;
const ordinaryShotsBefore = v35BossState.projectiles.length;
const ownsCooldownIntent = V2.combat.qa.updateBossPatternIntent(v35BossState, v35Boss, 0.02);
V2.combat.qa.updateEnemyIntent(v35BossState, v35Boss, 0.02, -260, 0, 260);
if (ownsCooldownIntent || v35BossState.projectiles.length <= ordinaryShotsBefore) {
  console.error("Demo V3.5 Bosses must keep ordinary attacks active between special-pattern windows", ownsCooldownIntent, v35Boss, v35BossState.projectiles);
  process.exit(1);
}
V2.combat.qa.beginBossPattern(v35BossState, v35Boss);
V2.combat.qa.releaseBossPattern(v35BossState, v35Boss);
if (v35BossState.projectiles.filter(function (shot) { return shot.source === "boss_test_priority_lane"; }).length < 7
  || v35Boss.bossPatternCooldown >= 3.8) {
  console.error("Demo V3.5 Boss specials must be denser and return faster", v35Boss.bossPatternCooldown, v35BossState.projectiles);
  process.exit(1);
}

function componentShape(version, weaponId, partId, statId, readShape) {
  const state = makeVersionedWeaponState(version, weaponId);
  const config = V2.getDemoV2FixedTestConfig(state);
  const runtime = state.demoV2[config.runtimeKey];
  runtime.parts[partId].allocations[statId] = 4;
  config.rebuildParams(state);
  return readShape(state);
}

const attributeShapes = [
  { weaponId: "marker", partId: "tail", statId: "range", read: function (state) { return state.activeFormParams.width; } },
  { weaponId: "thermos", partId: "tail", statId: "range", read: function (state) { return state.activeFormParams.width; } },
  { weaponId: "scissors", partId: "tail", statId: "range", read: function (state) { return state.activeFormParams.scissorsFanRange; } },
  { weaponId: "correction_fluid", partId: "body", statId: "amount", read: function (state) { return state.activeFormParams.correctionAreaRadius; } }
];
attributeShapes.forEach(function (shape) {
  const before = componentShape("four-weapon-v3-4", shape.weaponId, shape.partId, shape.statId, shape.read);
  const after = componentShape("four-weapon-v3-5", shape.weaponId, shape.partId, shape.statId, shape.read);
  if (after < before * 1.14) {
    console.error("Demo V3.5 range investment must visibly enlarge each weapon's real attack shape", shape, before, after);
    process.exit(1);
  }
});
if (!combatVisualSource.includes('const fixedMarkerLaser = /^marker_test_(base|copy|second_round|retrieval)$/.test(source);')
  || !combatVisualSource.includes('Archive owns a soft, low-frequency cyan band on the world layer.')
  || !combatVisualSource.includes('const closedStrikeActive = scissors.weaponVisualTime > 0')
  || !combatVisualSource.includes('event.x2 - Math.cos(angle) * (source === "scissors_test_sever" ? 20 : 14)')) {
  console.error("Demo V3.5 mixed Marker and Closed-Blade Scissors must preserve their distinct visual layers");
  process.exit(1);
}
console.log("OK Demo V3.5 sustained pressure: staged quota, faster contact, active Boss cooldowns, denser specials, and visible attack-shape scaling");

const fourWeaponV36 = V2.demoV2 && V2.demoV2.fourWeaponV36;
const v36EntrySource = fs.readFileSync(path.join(baseDir, "demo-v3-6.html"), "utf8");
if (!fourWeaponV36 || fourWeaponV36.version !== "Demo V3.6" || !fourWeaponV36.weaponEmbodimentPass
  || !fourWeaponV36.sustainedPressurePass || !fourWeaponV36.bossPressurePass || !fourWeaponV36.attributeImpactPass
  || !v36EntrySource.includes('params.set("demoV2", "four-weapon-v3-6")')) {
  console.error("Demo V3.6 must preserve the V3.5 combat package and enable only the Marker embodiment pass", fourWeaponV36);
  process.exit(1);
}

function numericCombatSnapshot(version, weaponId) {
  const state = makeVersionedWeaponState(version, weaponId);
  const keys = Object.keys(state.activeFormParams).filter(function (key) {
    return typeof state.activeFormParams[key] === "number" || typeof state.activeFormParams[key] === "boolean";
  }).sort();
  return JSON.stringify(keys.reduce(function (snapshot, key) {
    snapshot[key] = state.activeFormParams[key];
    return snapshot;
  }, {}));
}

["marker", "thermos", "scissors", "correction_fluid"].forEach(function (weaponId) {
  const v35Numbers = numericCombatSnapshot("four-weapon-v3-5", weaponId);
  const v36Numbers = numericCombatSnapshot("four-weapon-v3-6", weaponId);
  if (v35Numbers !== v36Numbers) {
    console.error("Demo V3.6 must not import experiment balance into the fixed suite", weaponId, v35Numbers, v36Numbers);
    process.exit(1);
  }
});

const v36MarkerState = makeVersionedWeaponState("four-weapon-v3-6", "marker");
const v36MarkerConfig = V2.getDemoV2FixedTestConfig(v36MarkerState);
const v36MarkerRuntime = v36MarkerState.demoV2[v36MarkerConfig.runtimeKey];
v36MarkerRuntime.modules.copy = 2;
v36MarkerRuntime.modules.archive = 3;
v36MarkerRuntime.parts.tip.copies = 4;
v36MarkerRuntime.parts.tip.activeStat = "damage";
v36MarkerRuntime.parts.body.copies = 2;
v36MarkerRuntime.parts.body.activeStat = "amount";
v36MarkerRuntime.parts.tail.copies = 8;
v36MarkerRuntime.parts.tail.activeStat = "duration";
v36MarkerRuntime.parts.body.allocations.amount = 1;
v36MarkerConfig.rebuildParams(v36MarkerState);
v36MarkerState.input.right = true;
V2.combat.qa.updateInput(v36MarkerState, 0.01);
v36MarkerState.input.right = false;
const v36Visual = V2.combat.qa.markerEmbodimentVisualState(v36MarkerState);
if (!v36Visual.enabled || v36Visual.facing !== 1 || v36Visual.copyLevel !== 2 || v36Visual.archiveLevel !== 3
  || v36Visual.baseAmount !== 2 || v36Visual.copyLines !== 2 || v36Visual.penCount !== 6
  || v36Visual.components.tip.copies !== 4 || v36Visual.components.tip.activeStat !== "damage"
  || v36Visual.components.body.copies !== 2 || v36Visual.components.body.activeStat !== "amount"
  || v36Visual.components.tail.copies !== 8 || v36Visual.components.tail.activeStat !== "duration"
  || !combatVisualSource.includes("marker-person-printer-rig-directions-v5.png")
  || !combatVisualSource.includes("marker-weapon-directions-v4.png")
  || !combatVisualSource.includes("marker-growth-parts.svg")
  || !combatVisualSource.includes("drawMarkerEmbodiedPlayer")
  || !combatVisualSource.includes("drawMarkerPenComponents")
  || !combatVisualSource.includes("drawMarkerWornComponents")) {
  console.error("Demo V3.6 Marker visuals must bind body-facing cartridges and aim-facing pens to real Demo state", v36Visual);
  process.exit(1);
}
console.log("OK Demo V3.6 Marker embodiment: V3.5 numbers preserved, body-facing cartridges, aim-facing pens, amount and route levels bound to live state");

const fourWeaponV37 = V2.demoV2 && V2.demoV2.fourWeaponV37;
const v37EntrySource = fs.readFileSync(path.join(baseDir, "demo-v3-7.html"), "utf8");
if (!fourWeaponV37 || fourWeaponV37.version !== "Demo V3.7" || !fourWeaponV37.weaponEmbodimentPass
  || !fourWeaponV37.thermosEmbodimentPass || !fourWeaponV37.sustainedPressurePass
  || !fourWeaponV37.bossPressurePass || !fourWeaponV37.attributeImpactPass
  || !v37EntrySource.includes('params.set("demoV2", "four-weapon-v3-7")')) {
  console.error("Demo V3.7 must preserve V3.6 and enable the Thermos pressure-rig pass", fourWeaponV37);
  process.exit(1);
}

["marker", "thermos", "scissors", "correction_fluid"].forEach(function (weaponId) {
  const v36Numbers = numericCombatSnapshot("four-weapon-v3-6", weaponId);
  const v37Numbers = numericCombatSnapshot("four-weapon-v3-7", weaponId);
  if (v36Numbers !== v37Numbers) {
    console.error("Demo V3.7 visual work must preserve the V3.6 combat snapshot", weaponId, v36Numbers, v37Numbers);
    process.exit(1);
  }
});

const v37ThermosState = makeVersionedWeaponState("four-weapon-v3-7", "thermos");
const v37ThermosConfig = V2.getDemoV2FixedTestConfig(v37ThermosState);
const v37ThermosRuntime = v37ThermosState.demoV2[v37ThermosConfig.runtimeKey];
v37ThermosRuntime.modules.copy = 3;
v37ThermosRuntime.modules.archive = 2;
v37ThermosRuntime.parts.tip.copies = 4;
v37ThermosRuntime.parts.tip.activeStat = "damage";
v37ThermosRuntime.parts.body.copies = 2;
v37ThermosRuntime.parts.body.activeStat = "amount";
v37ThermosRuntime.parts.tail.copies = 8;
v37ThermosRuntime.parts.tail.activeStat = "duration";
v37ThermosRuntime.parts.body.allocations.amount = 1;
v37ThermosConfig.rebuildParams(v37ThermosState);
v37ThermosRuntime.facingAngle = Math.PI / 4;
v37ThermosState.input.left = true;
V2.combat.qa.updateInput(v37ThermosState, 0.01);
v37ThermosState.input.left = false;
const v37ThermosVisual = V2.combat.qa.thermosEmbodimentVisualState(v37ThermosState);
if (!v37ThermosVisual.enabled || v37ThermosVisual.facing !== 3
  || v37ThermosVisual.condensationLevel !== 3 || v37ThermosVisual.heatwaveLevel !== 2
  || v37ThermosVisual.cupCount !== 2 || v37ThermosVisual.components.lid.copies !== 4
  || v37ThermosVisual.components.body.activeStat !== "amount"
  || v37ThermosVisual.components.base.activeStat !== "duration"
  || !combatVisualSource.includes("thermos-person-pressure-rig-directions-v1.png")
  || !combatVisualSource.includes("thermos-weapon-directions-v1.png")
  || !combatVisualSource.includes("thermos-route-packs-directions-v2.png")
  || !combatVisualSource.includes("drawThermosEmbodiedPlayer")
  || !combatVisualSource.includes("visualOriginDistance: state.demoV2 && state.demoV2.thermosEmbodimentPass ? 24 : 0")) {
  console.error("Demo V3.7 Thermos visuals must bind the worn pressure rig, aim-facing cup, module levels and real outlet", v37ThermosVisual);
  process.exit(1);
}
console.log("OK Demo V3.7 Thermos pressure rig: V3.6 numbers preserved, body-facing modules, aim-facing cups, visible outlet and route levels bound to live state");

const fourWeaponV38 = V2.demoV2 && V2.demoV2.fourWeaponV38;
const v38EntrySource = fs.readFileSync(path.join(baseDir, "demo-v3-8.html"), "utf8");
if (!fourWeaponV38 || fourWeaponV38.version !== "Demo V3.8" || !fourWeaponV38.weaponEmbodimentPass
  || !fourWeaponV38.thermosEmbodimentPass || !fourWeaponV38.thermosBackPressurePass
  || !v38EntrySource.includes('params.set("demoV2", "four-weapon-v3-8")')) {
  console.error("Demo V3.8 must preserve V3.7 and enable the Thermos dual-route back-pressure pass", fourWeaponV38);
  process.exit(1);
}

["marker", "thermos", "scissors", "correction_fluid"].forEach(function (weaponId) {
  const v37Numbers = numericCombatSnapshot("four-weapon-v3-7", weaponId);
  const v38Numbers = numericCombatSnapshot("four-weapon-v3-8", weaponId);
  if (v37Numbers !== v38Numbers) {
    console.error("Demo V3.8 back-pressure feedback must preserve the V3.7 combat snapshot", weaponId, v37Numbers, v38Numbers);
    process.exit(1);
  }
});

const v38ThermosState = makeVersionedWeaponState("four-weapon-v3-8", "thermos");
const v38ThermosConfig = V2.getDemoV2FixedTestConfig(v38ThermosState);
const v38ThermosRuntime = v38ThermosState.demoV2[v38ThermosConfig.runtimeKey];
v38ThermosRuntime.modules.copy = 3;
v38ThermosRuntime.modules.archive = 2;
v38ThermosConfig.rebuildParams(v38ThermosState);
V2.combat.qa.triggerThermosBackPressure(v38ThermosState, v38ThermosRuntime);
const v38PressureEvents = v38ThermosState.formEvents.filter(function (event) {
  return event.kind === "thermos_backpressure";
});
if (v38PressureEvents.length !== 2
  || !v38PressureEvents.some(function (event) { return event.family === "condensation" && event.level === 3; })
  || !v38PressureEvents.some(function (event) { return event.family === "heatwave" && event.level === 2; })
  || v38ThermosRuntime.condensationRecoil !== 0.32 || v38ThermosRuntime.heatwaveRecoil !== 0.32
  || !combatVisualSource.includes("drawThermosBackPressureEvent")
  || !combatVisualSource.includes("thermos-backpressure-half-ring-v38-sheet.png")
  || !combatVisualSource.includes('source: "thermos_backpressure_" + emitter.family')
  || !combatVisualSource.includes('const size = 118 + level * 9')
  || !combatVisualSource.includes('"screen"')) {
  console.error("Demo V3.8 Thermos attacks must drive distinct frost and hot-steam half-rings with physical route-pack recoil", v38PressureEvents, v38ThermosRuntime);
  process.exit(1);
}
console.log("OK Demo V3.8 Thermos back-pressure: V3.7 numbers preserved, every attack can release route-specific frost/steam half-rings and recoil the worn pressure packs");

const fourWeaponV39 = V2.demoV2 && V2.demoV2.fourWeaponV39;
const v39EntrySource = fs.readFileSync(path.join(baseDir, "demo-v3-9.html"), "utf8");
if (!fourWeaponV39 || fourWeaponV39.version !== "Demo V3.9"
  || !fourWeaponV39.weaponEmbodimentPass || !fourWeaponV39.thermosEmbodimentPass
  || !fourWeaponV39.thermosBackPressurePass || !fourWeaponV39.scissorsEmbodimentPass
  || !fourWeaponV39.correctionEmbodimentPass
  || !v39EntrySource.includes('params.set("demoV2", "four-weapon-v3-9")')) {
  console.error("Demo V3.9 must preserve V3.8 and enable Scissors/Correction embodiment", fourWeaponV39);
  process.exit(1);
}
["marker", "thermos", "scissors", "correction_fluid"].forEach(function (weaponId) {
  const v38Numbers = numericCombatSnapshot("four-weapon-v3-8", weaponId);
  const v39Numbers = numericCombatSnapshot("four-weapon-v3-9", weaponId);
  if (v38Numbers !== v39Numbers) {
    console.error("Demo V3.9 embodiment must preserve the V3.8 combat snapshot", weaponId, v38Numbers, v39Numbers);
    process.exit(1);
  }
});
const v39ScissorsState = makeVersionedWeaponState("four-weapon-v3-9", "scissors");
const v39ScissorsRuntime = v39ScissorsState.demoV2.scissors;
v39ScissorsRuntime.modules.copy = 2;
v39ScissorsRuntime.modules.archive = 3;
V2.getDemoV2FixedTestConfig(v39ScissorsState).rebuildParams(v39ScissorsState);
const v39ScissorsVisual = V2.combat.qa.scissorsEmbodimentVisualState(v39ScissorsState);
const v39CorrectionState = makeVersionedWeaponState("four-weapon-v3-9", "correction_fluid");
const v39CorrectionRuntime = v39CorrectionState.demoV2.correctionFluid;
v39CorrectionRuntime.modules.copy = 3;
v39CorrectionRuntime.modules.archive = 2;
V2.getDemoV2FixedTestConfig(v39CorrectionState).rebuildParams(v39CorrectionState);
const v39CorrectionVisual = V2.combat.qa.correctionEmbodimentVisualState(v39CorrectionState);
if (!v39ScissorsVisual.enabled || v39ScissorsVisual.closedLevel !== 2 || v39ScissorsVisual.openLevel !== 3
  || !v39CorrectionVisual.enabled || v39CorrectionVisual.spreadLevel !== 3 || v39CorrectionVisual.fatalLevel !== 2
  || !combatVisualSource.includes("scissors-person-pivot-rig-directions-v39.png")
  || !combatVisualSource.includes("scissors-complete-directions-v39.png")
  || !combatVisualSource.includes("scissors-cut-routes-v39.png")
  || !combatVisualSource.includes("correction-person-reservoir-directions-v39.png")
  || !combatVisualSource.includes("correction-nozzle-directions-v39.png")
  || !combatVisualSource.includes("correction-route-mutations-v39.png")
  || !combatVisualSource.includes("correction-spray-error-v39.png")
  || !combatVisualSource.includes("drawScissorsEmbodiedPlayer")
  || !combatVisualSource.includes("drawCorrectionEmbodiedPlayer")
  || !combatVisualSource.includes("if (!visual.attacking")
  || !combatVisualSource.includes("test.weaponVisualAngles = targets.map")) {
  console.error("Demo V3.9 must bind one complete Scissors weapon and the Correction body-to-nozzle-to-error causal chain", v39ScissorsVisual, v39CorrectionVisual);
  process.exit(1);
}
console.log("OK Demo V3.9 Scissors/Correction embodiment: V3.8 numbers preserved, shared chibi scale, one complete scissors, and visible correction-state causality");

const fourWeaponV310 = V2.demoV2 && V2.demoV2.fourWeaponV310;
const v310EntrySource = fs.readFileSync(path.join(baseDir, "demo-v3-10.html"), "utf8");
if (!fourWeaponV310 || fourWeaponV310.version !== "Demo V3.10"
  || !fourWeaponV310.combatScaleOrbitPass
  || !fourWeaponV310.scissorsEmbodimentPass || !fourWeaponV310.correctionEmbodimentPass
  || !v310EntrySource.includes('params.set("demoV2", "four-weapon-v3-10")')) {
  console.error("Demo V3.10 must preserve V3.9 and enable the battlefield-scale/outer-orbit repair", fourWeaponV310);
  process.exit(1);
}
["marker", "thermos", "scissors", "correction_fluid"].forEach(function (weaponId) {
  const v39Numbers = numericCombatSnapshot("four-weapon-v3-9", weaponId);
  const v310Numbers = numericCombatSnapshot("four-weapon-v3-10", weaponId);
  if (v39Numbers !== v310Numbers) {
    console.error("Demo V3.10 visual scale repair must preserve the V3.9 combat snapshot", weaponId, v39Numbers, v310Numbers);
    process.exit(1);
  }
});
const v310Layouts = [
  V2.combat.qa.markerEmbodimentVisualState(makeVersionedWeaponState("four-weapon-v3-10", "marker")).layout,
  V2.combat.qa.thermosEmbodimentVisualState(makeVersionedWeaponState("four-weapon-v3-10", "thermos")).layout,
  V2.combat.qa.scissorsEmbodimentVisualState(makeVersionedWeaponState("four-weapon-v3-10", "scissors")).layout,
  V2.combat.qa.correctionEmbodimentVisualState(makeVersionedWeaponState("four-weapon-v3-10", "correction_fluid")).layout
];
if (v310Layouts.some(function (layout) { return !layout || !layout.compact || layout.bodyHeight !== 78; })
  || v310Layouts[0].markerOrbit !== 54 || v310Layouts[0].markerWeaponHeight !== 22
  || v310Layouts[1].thermosOrbit !== 47 || v310Layouts[1].thermosWeaponHeight !== 32
  || v310Layouts[2].scissorsOrbit !== 49 || v310Layouts[2].scissorsWeaponHeight !== 48
  || v310Layouts[3].correctionOrbit !== 51 || v310Layouts[3].correctionWeaponHeight !== 18
  || !combatVisualSource.includes("function embodiedCombatLayout")
  || !combatVisualSource.includes("combatScaleOrbitPass")) {
  console.error("Demo V3.10 must use one compact body scale and weapon-specific outer-ring clearances", v310Layouts);
  process.exit(1);
}
console.log("OK Demo V3.10 battlefield scale: old-size player footprint restored and all aim-facing weapons clear the body core on weapon-specific outer rings");

const fourWeaponV311 = V2.demoV2 && V2.demoV2.fourWeaponV311;
const v311EntrySource = fs.readFileSync(path.join(baseDir, "demo-v3-11.html"), "utf8");
if (!fourWeaponV311 || fourWeaponV311.version !== "Demo V3.11"
  || !fourWeaponV311.openingComfortPass || !fourWeaponV311.weaponParityPass
  || !fourWeaponV311.combatScaleOrbitPass
  || !v311EntrySource.includes('params.set("demoV2", "four-weapon-v3-11")')) {
  console.error("Demo V3.11 must inherit V3.10 and enable only opening comfort plus weapon parity", fourWeaponV311);
  process.exit(1);
}
const v310OpeningState = makeVersionedWeaponState("four-weapon-v3-10", "marker");
const v310OpeningConfig = V2.getDemoV2FixedTestConfig(v310OpeningState);
const v310Encounter1 = v310OpeningConfig.currentEncounter(v310OpeningState);
v310OpeningConfig.startEncounter(v310OpeningState, 1);
const v310Encounter2 = v310OpeningConfig.currentEncounter(v310OpeningState);
const v311OpeningState = makeVersionedWeaponState("four-weapon-v3-11", "marker");
const v311OpeningConfig = V2.getDemoV2FixedTestConfig(v311OpeningState);
const v311Encounter1 = v311OpeningConfig.currentEncounter(v311OpeningState);
v311OpeningConfig.startEncounter(v311OpeningState, 1);
const v311Encounter2 = v311OpeningConfig.currentEncounter(v311OpeningState);
if (!(v311Encounter1.spawnTotal >= 75 && v311Encounter1.spawnTotal < v310Encounter1.spawnTotal)
  || !(v311Encounter1.floor >= 18 && v311Encounter1.floor < v310Encounter1.floor)
  || !(v311Encounter1.enemyHp <= v310Encounter1.enemyHp * 0.81)
  || !(v311Encounter1.enemySpeed <= v310Encounter1.enemySpeed * 0.85)
  || v311Encounter1.enemyDamageScale !== 0.68
  || !(v311Encounter2.spawnTotal >= 95 && v311Encounter2.spawnTotal < v310Encounter2.spawnTotal)
  || !(v311Encounter2.floor >= 24 && v311Encounter2.floor < v310Encounter2.floor)
  || !(v311Encounter2.enemyHp <= v310Encounter2.enemyHp * 0.89)
  || !(v311Encounter2.enemySpeed <= v310Encounter2.enemySpeed * 0.91)
  || v311Encounter2.enemyDamageScale !== 0.78) {
  console.error("Demo V3.11 encounters 1-2 must preserve grass-cut density while lowering contact pressure", {
    v310Encounter1, v311Encounter1, v310Encounter2, v311Encounter2
  });
  process.exit(1);
}
const v310MarkerParams = makeVersionedWeaponState("four-weapon-v3-10", "marker").activeFormParams;
const v311MarkerParams = makeVersionedWeaponState("four-weapon-v3-11", "marker").activeFormParams;
const v310ThermosParams = makeVersionedWeaponState("four-weapon-v3-10", "thermos").activeFormParams;
const v311ThermosParams = makeVersionedWeaponState("four-weapon-v3-11", "thermos").activeFormParams;
const v310ScissorsParams = makeVersionedWeaponState("four-weapon-v3-10", "scissors").activeFormParams;
const v311ScissorsParams = makeVersionedWeaponState("four-weapon-v3-11", "scissors").activeFormParams;
const v310CorrectionParams = makeVersionedWeaponState("four-weapon-v3-10", "correction_fluid").activeFormParams;
const v311CorrectionParams = makeVersionedWeaponState("four-weapon-v3-11", "correction_fluid").activeFormParams;
if (!(v311MarkerParams.damage < v310MarkerParams.damage && v311MarkerParams.cooldown > v310MarkerParams.cooldown)
  || !(v311ThermosParams.damage < v310ThermosParams.damage && v311ThermosParams.cooldown > v310ThermosParams.cooldown)
  || !(v311ScissorsParams.damage > v310ScissorsParams.damage
    && v311ScissorsParams.scissorsBaseRange > v310ScissorsParams.scissorsBaseRange
    && v311ScissorsParams.scissorsBaseHalfAngle > v310ScissorsParams.scissorsBaseHalfAngle
    && v311ScissorsParams.scissorsDashChargeTime < v310ScissorsParams.scissorsDashChargeTime
    && v311ScissorsParams.markerFixedDodgeChance > v310ScissorsParams.markerFixedDodgeChance
    && v311ScissorsParams.scissorsRealRangeAcquisition
    && !v310ScissorsParams.scissorsRealRangeAcquisition)
  || !(v311CorrectionParams.damage > v310CorrectionParams.damage
    && v311CorrectionParams.cooldown < v310CorrectionParams.cooldown
    && v311CorrectionParams.correctionOpeningOversprayRadius > v310CorrectionParams.correctionOpeningOversprayRadius
    && v311CorrectionParams.correctionOpeningOversprayDamageScale > v310CorrectionParams.correctionOpeningOversprayDamageScale)
  || !combatVisualSource.includes("Ordinary rounds must not begin outside the real")
  || !combatVisualSource.includes("p.scissorsBaseRange || 138")) {
  console.error("Demo V3.11 weapon parity must trim the two leaders and repair Scissors/Correction mechanism loss", {
    v310MarkerParams, v311MarkerParams, v310ThermosParams, v311ThermosParams,
    v310ScissorsParams, v311ScissorsParams, v310CorrectionParams, v311CorrectionParams
  });
  process.exit(1);
}
console.log("OK Demo V3.11 opening comfort and weapon parity: encounters 1-2 teach before punishing, Scissors stops whiffing, and Correction reaches error payoff sooner");

const fourWeaponV312 = V2.demoV2 && V2.demoV2.fourWeaponV312;
const v312EntrySource = fs.readFileSync(path.join(baseDir, "demo-v3-12.html"), "utf8");
if (!fourWeaponV312 || fourWeaponV312.version !== "Demo V3.12"
  || !fourWeaponV312.markerDesireLoopPass
  || !fourWeaponV312.openingComfortPass || !fourWeaponV312.weaponParityPass
  || !v312EntrySource.includes('params.set("demoV2", "four-weapon-v3-12")')) {
  console.error("Demo V3.12 must inherit V3.11 and enable the Marker desire-chain experiment", fourWeaponV312);
  process.exit(1);
}
["thermos", "scissors", "correction_fluid"].forEach(function (weaponId) {
  const before = numericCombatSnapshot("four-weapon-v3-11", weaponId);
  const after = numericCombatSnapshot("four-weapon-v3-12", weaponId);
  if (before !== after) {
    console.error("Demo V3.12 Marker experiment must preserve all non-Marker combat snapshots", weaponId, before, after);
    process.exit(1);
  }
});
const v312MarkerOpening = makeVersionedWeaponState("four-weapon-v3-12", "marker");
const v312MarkerOpeningConfig = V2.getDemoV2FixedTestConfig(v312MarkerOpening);
const v312OpeningOffers = v312MarkerOpeningConfig.makeShopOffers(v312MarkerOpening);
const v312OpeningChoices = v312MarkerOpeningConfig.makeModuleChoices(v312MarkerOpening);
if (v312MarkerOpening.activeFormParams.damage !== v311MarkerParams.damage
  || v312MarkerOpening.activeFormParams.cooldown !== v311MarkerParams.cooldown
  || v312MarkerOpening.activeFormParams.range !== v311MarkerParams.range
  || v312OpeningChoices.some(function (choice) {
    return !choice.immediate || !choice.playstyle || !choice.terminalPromise || !choice.relationPromise || !choice.levelLabel;
  })
  || v312OpeningOffers.some(function (offer) { return !offer.mountText || !offer.visualPromise; })) {
  console.error("Demo V3.12 must preserve V3.11 opening numbers while exposing complete module and component promises", {
    params: v312MarkerOpening.activeFormParams,
    choices: v312OpeningChoices,
    offers: v312OpeningOffers
  });
  process.exit(1);
}
const v312PureState = makeVersionedWeaponState("four-weapon-v3-12", "marker");
const v312PureConfig = V2.getDemoV2FixedTestConfig(v312PureState);
for (let index = 0; index < 4; index++) v312PureConfig.applyModule(v312PureState, "copy", true);
const v312TerminalChoices = v312PureConfig.makeModuleChoices(v312PureState);
const v312PureChoice = v312TerminalChoices.find(function (choice) { return choice.id === "copy"; });
const v312MixChoice = v312TerminalChoices.find(function (choice) { return choice.id === "archive"; });
if (!v312PureChoice || !v312PureChoice.mastery || v312PureChoice.disabled || v312PureChoice.levelLabel !== "终局专精"
  || !v312MixChoice || v312MixChoice.disabled) {
  console.error("Demo V3.12 fifth Marker choice must be a real pure-mastery versus mixed-route split", v312TerminalChoices);
  process.exit(1);
}
v312PureConfig.applyModule(v312PureState, "copy", true);
if (v312PureState.demoV2.marker.modules.copy !== 4
  || v312PureState.demoV2.marker.moduleChoiceIndex !== 5
  || v312PureState.demoV2.marker.pureRouteCommitted !== "copy"
  || !v312PureState.activeFormParams.markerFixedPureCopyMastery
  || v312PureState.activeFormParams.markerFixedRetrieval) {
  console.error("Demo V3.12 pure Copy mastery must strengthen Lv4 without inventing Lv5 or silently enabling Retrieval", v312PureState.demoV2.marker);
  process.exit(1);
}
const v312MixedState = makeVersionedWeaponState("four-weapon-v3-12", "marker");
const v312MixedConfig = V2.getDemoV2FixedTestConfig(v312MixedState);
v312MixedConfig.applyModule(v312MixedState, "copy", true);
const v312FirstCrossChoice = v312MixedConfig.makeModuleChoices(v312MixedState).find(function (choice) { return choice.id === "archive"; });
v312MixedConfig.applyModule(v312MixedState, "archive", true);
const v312ConnectedChoices = v312MixedConfig.makeModuleChoices(v312MixedState);
if (!v312FirstCrossChoice || v312FirstCrossChoice.relationPromise.indexOf("立即接通") < 0
  || v312ConnectedChoices.some(function (choice) { return choice.relationPromise.indexOf("调阅已接通") < 0; })) {
  console.error("Demo V3.12 must announce Retrieval only on the first cross-route choice and show an established relation afterward", {
    firstCross: v312FirstCrossChoice,
    connected: v312ConnectedChoices
  });
  process.exit(1);
}
V2.combat.spawnEnemy(v312MixedState);
const v312RetrievalTarget = v312MixedState.enemies[0];
v312RetrievalTarget.x = v312MixedState.player.x + 180;
v312RetrievalTarget.y = v312MixedState.player.y;
v312RetrievalTarget.hp = 9999;
v312RetrievalTarget.maxHp = 9999;
V2.combat.qa.fireMarkerFixedTest(v312MixedState, false);
const retrievalBeforeSecondAttack = v312MixedState.demoV2.marker.retrievalTriggers;
v312MixedState.totalTime += 1;
V2.combat.qa.fireMarkerFixedTest(v312MixedState, false);
if (!v312MixedState.activeFormParams.markerFixedRetrieval
  || retrievalBeforeSecondAttack !== 0
  || v312MixedState.demoV2.marker.retrievalTriggers <= 0
  || !v312MixedState.formEvents.some(function (event) { return event.source === "marker_test_retrieval"; })) {
  console.error("Demo V3.12 mixed Marker route must re-read an older Archive with a distinct Retrieval event", {
    params: v312MixedState.activeFormParams,
    runtime: v312MixedState.demoV2.marker,
    events: v312MixedState.formEvents
  });
  process.exit(1);
}
console.log("OK Demo V3.12 Marker desire chain: explicit promises, visible component mounting, pure Lv4 mastery, and mixed-route Retrieval all execute");

const fourWeaponV313 = V2.demoV2 && V2.demoV2.fourWeaponV313;
const v313EntrySource = fs.readFileSync(path.join(baseDir, "demo-v3-13.html"), "utf8");
const v313IndexSource = fs.readFileSync(path.join(baseDir, "index.html"), "utf8");
if (!fourWeaponV313 || fourWeaponV313.version !== "Demo V3.13"
  || !fourWeaponV313.markerDesireLoopPass || !fourWeaponV313.allWeaponDesireLoopPass
  || !v313EntrySource.includes('params.set("demoV2", "four-weapon-v3-13")')
  || !v313IndexSource.includes("systems.js?v=96")
  || !v313IndexSource.includes("state.js?v=31")
  || !v313IndexSource.includes("four-weapon-fixed.js?v=14")) {
  console.error("Demo V3.13 must inherit the Marker experiment and extend it to all four weapons", fourWeaponV313);
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-v3-13" });
V2.dispatch({ type: "START_RUN", weaponId: "scissors" });
const v313PlayableStart = V2.getState();
V2.combat.updateCamera(v313PlayableStart);
const v313StartX = v313PlayableStart.player.x;
const v313StartCameraX = v313PlayableStart.camera.x;
v313PlayableStart.input.right = true;
V2.combat.qa.updateInput(v313PlayableStart, 0.2);
v313PlayableStart.input.right = false;
if (v313StartX !== v313PlayableStart.world.width / 2
  || v313PlayableStart.player.y !== v313PlayableStart.world.height / 2
  || v313StartCameraX <= 0
  || v313PlayableStart.player.x <= v313StartX
  || v313PlayableStart.camera.x <= v313StartCameraX) {
  console.error("Demo V3.13 real start must spawn at world centre and immediately accept movement with camera follow", {
    startX: v313StartX,
    startCameraX: v313StartCameraX,
    player: v313PlayableStart.player,
    camera: v313PlayableStart.camera,
    world: v313PlayableStart.world
  });
  process.exit(1);
}
const isolatedLayerCalls = [];
const isolatedLayerErrors = [];
V2.combat.qa.drawIsolatedLayers(
  canvas.getContext("2d"),
  v313PlayableStart,
  [
    { name: "effects", world: true, draw: function () { isolatedLayerCalls.push("effects"); throw new Error("probe"); } },
    { name: "enemies", world: true, draw: function () { isolatedLayerCalls.push("enemies"); } },
    { name: "player", world: true, draw: function () { isolatedLayerCalls.push("player"); } }
  ],
  function (_, layer) { isolatedLayerErrors.push(layer); }
);
if (isolatedLayerCalls.join(",") !== "effects,enemies,player" || isolatedLayerErrors.join(",") !== "effects") {
  console.error("A failed VFX layer must never prevent enemies or player from rendering", isolatedLayerCalls, isolatedLayerErrors);
  process.exit(1);
}
console.log("OK Demo V3.13 playability guard: cache-coherent runtime, centered start, live input/camera, and isolated render layers");
const v313RouteSpecs = [
  { weaponId: "thermos", ids: ["condensation", "heatwave"], runtimeKey: "thermos", pureFlags: ["thermosFixedPureCondensationMastery", "thermosFixedPureHeatwaveMastery"] },
  { weaponId: "scissors", ids: ["closed", "open"], runtimeKey: "scissors", pureFlags: ["scissorsPureClosedMastery", "scissorsPureOpenMastery"] },
  { weaponId: "correction_fluid", ids: ["spread", "correction"], runtimeKey: "correctionFluid", pureFlags: ["correctionPureSpreadMastery", "correctionPureFatalMastery"] }
];
v313RouteSpecs.forEach(function (spec) {
  const before = makeVersionedWeaponState("four-weapon-v3-12", spec.weaponId);
  const state = makeVersionedWeaponState("four-weapon-v3-13", spec.weaponId);
  const config = V2.getDemoV2FixedTestConfig(state);
  ["damage", "cooldown", "range", "width", "amount"].forEach(function (key) {
    if (state.activeFormParams[key] !== before.activeFormParams[key]) {
      console.error("Demo V3.13 must preserve V3.12 opening combat numbers", spec.weaponId, key, before.activeFormParams[key], state.activeFormParams[key]);
      process.exit(1);
    }
  });
  const choices = config.makeModuleChoices(state);
  const offers = config.makeShopOffers(state);
  if (choices.some(function (choice) {
    return !choice.immediate || !choice.playstyle || !choice.terminalPromise || !choice.relationPromise || !choice.levelLabel;
  }) || offers.some(function (offer) { return !offer.mountText || !offer.visualPromise; })) {
    console.error("Every V3.13 weapon must expose complete but readable module promises and physical component mounts", spec.weaponId, choices, offers);
    process.exit(1);
  }
  spec.ids.forEach(function (routeId, routeIndex) {
    const pureState = makeVersionedWeaponState("four-weapon-v3-13", spec.weaponId);
    const pureConfig = V2.getDemoV2FixedTestConfig(pureState);
    for (let index = 0; index < 4; index++) pureConfig.applyModule(pureState, routeId, true);
    const masteryChoice = pureConfig.makeModuleChoices(pureState).find(function (choice) { return choice.id === routeId; });
    if (!masteryChoice || !masteryChoice.mastery || masteryChoice.disabled || masteryChoice.levelLabel !== "终局专精") {
      console.error("V3.13 fifth choice must preserve a pure Lv4 mastery option", spec.weaponId, routeId, masteryChoice);
      process.exit(1);
    }
    pureConfig.applyModule(pureState, routeId, true);
    const runtime = pureState.demoV2[spec.runtimeKey];
    if (runtime.modules[routeIndex === 0 ? "copy" : "archive"] !== 4
      || runtime.moduleChoiceIndex !== 5
      || runtime.pureRouteCommitted !== (routeIndex === 0 ? "copy" : "archive")
      || !pureState.activeFormParams[spec.pureFlags[routeIndex]]) {
      console.error("V3.13 pure mastery must strengthen Lv4 without creating Lv5", spec.weaponId, routeId, runtime, pureState.activeFormParams);
      process.exit(1);
    }
  });
});

const v313ThermosMixed = makeVersionedWeaponState("four-weapon-v3-13", "thermos");
const v313ThermosConfig = V2.getDemoV2FixedTestConfig(v313ThermosMixed);
v313ThermosConfig.applyModule(v313ThermosMixed, "condensation", true);
v313ThermosConfig.applyModule(v313ThermosMixed, "heatwave", true);
V2.combat.spawnEnemy(v313ThermosMixed);
const v313ThermosEnemy = v313ThermosMixed.enemies[0];
Object.assign(v313ThermosEnemy, { x: v313ThermosMixed.player.x + 90, y: v313ThermosMixed.player.y, hp: 500, maxHp: 500, dead: false });
v313ThermosMixed.damageZones.push({
  type: "circle", source: "thermos_test_condensation", x: v313ThermosEnemy.x, y: v313ThermosEnemy.y,
  radius: 70, life: 2, maxLife: 2, condensationZone: true, groupIndex: 0, zoneIndex: 0
});
V2.combat.qa.triggerThermosFixedThermalExchange(v313ThermosMixed, v313ThermosMixed.activeFormParams, v313ThermosEnemy.x, v313ThermosEnemy.y, 90, v313ThermosMixed.demoV2.thermos);
if (!v313ThermosMixed.formEvents.some(function (event) { return event.source === "thermos_test_thermal_exchange"; })
  || v313ThermosMixed.demoV2.thermos.totalThermalExchanges <= 0) {
  console.error("V3.13 mixed Thermos route must visibly turn Heatwave + Condensation into Thermal Exchange");
  process.exit(1);
}

const v313ScissorsMixed = makeVersionedWeaponState("four-weapon-v3-13", "scissors");
const v313ScissorsConfig = V2.getDemoV2FixedTestConfig(v313ScissorsMixed);
v313ScissorsConfig.applyModule(v313ScissorsMixed, "closed", true);
v313ScissorsConfig.applyModule(v313ScissorsMixed, "open", true);
V2.combat.spawnEnemy(v313ScissorsMixed);
const v313ScissorsEnemy = v313ScissorsMixed.enemies[0];
Object.assign(v313ScissorsEnemy, {
  x: v313ScissorsMixed.player.x + 80, y: v313ScissorsMixed.player.y,
  hp: 500, maxHp: 500, dead: false, scissorsCutSeamTime: 1.5
});
V2.combat.qa.scissorsLine(v313ScissorsMixed, v313ScissorsMixed.activeFormParams, 0, 150, 36, 1, "scissors_test_thrust");
if (!v313ScissorsMixed.formEvents.some(function (event) { return event.source === "scissors_test_crosscut"; })
  || v313ScissorsMixed.demoV2.scissors.totalCrossCuts <= 0) {
  console.error("V3.13 mixed Scissors route must visibly turn Open seam + Closed hit into Cross Cut");
  process.exit(1);
}

const v313CorrectionMixed = makeVersionedWeaponState("four-weapon-v3-13", "correction_fluid");
const v313CorrectionConfig = V2.getDemoV2FixedTestConfig(v313CorrectionMixed);
v313CorrectionConfig.applyModule(v313CorrectionMixed, "spread", true);
v313CorrectionConfig.applyModule(v313CorrectionMixed, "correction", true);
V2.combat.spawnEnemy(v313CorrectionMixed);
const v313CorrectionEnemy = v313CorrectionMixed.enemies[0];
Object.assign(v313CorrectionEnemy, { x: v313CorrectionMixed.player.x + 60, y: v313CorrectionMixed.player.y, hp: 500, maxHp: 500, dead: false });
v313CorrectionMixed.damageZones.push({
  type: "circle", source: "correction_test_error_area", x: v313CorrectionEnemy.x, y: v313CorrectionEnemy.y,
  radius: 80, life: 3, maxLife: 3, correctionArea: true, correctionAreaId: 1
});
V2.combat.qa.triggerCorrectionCascadingRollback(
  v313CorrectionMixed,
  v313CorrectionMixed.demoV2.correctionFluid,
  v313CorrectionMixed.activeFormParams,
  { id: "rollback-trigger", x: v313CorrectionEnemy.x, y: v313CorrectionEnemy.y, r: 14 }
);
if (!v313CorrectionMixed.formEvents.some(function (event) { return event.source === "correction_test_rollback"; })
  || v313CorrectionMixed.demoV2.correctionFluid.totalRollbacks <= 0) {
  console.error("V3.13 mixed Correction Fluid route must visibly turn overload resolution into Cascading Rollback");
  process.exit(1);
}
console.log("OK Demo V3.13 all-weapon desire chains: concise promises, physical mounts, pure Lv4 mastery, and three distinct mixed-route causal events all execute");

const fourWeaponV314 = V2.demoV2 && V2.demoV2.fourWeaponV314;
const v314EntrySource = fs.readFileSync(path.join(baseDir, "demo-v3-14.html"), "utf8");
if (!fourWeaponV314 || fourWeaponV314.version !== "Demo V3.14"
  || !fourWeaponV314.decisionCompressionPass
  || !fourWeaponV314.allWeaponDesireLoopPass
  || !fourWeaponV314.weaponParityPass
  || !v314EntrySource.includes('params.set("demoV2", "four-weapon-v3-14")')) {
  console.error("Demo V3.14 must inherit V3.13 and enable only the compact decision-page contract", fourWeaponV314);
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-v3-14" });
V2.dispatch({ type: "START_RUN", weaponId: "marker" });
const v314State = V2.getState();
if (v314State.demoV2.suiteVersion !== "Demo V3.14"
  || !v314State.demoV2.decisionCompressionPass
  || v314State.demoV2.formalCartoonPickupPass
  || v314State.demoV2.formalCartoonHudPass
  || v314State.demoV2.formalCartoonVfxPass
  || v314State.demoV2.formalCartoonAudioPass
  || v314State.stage.demoV2Phase !== fourWeaponV314.childPhaseByWeapon.marker) {
  console.error("Demo V3.14 must preserve the isolated weapon route while carrying compact decision state", v314State.demoV2);
  process.exit(1);
}
console.log("OK Demo V3.14 decision density: V3.13 combat is preserved and the compact choice contract reaches runtime");

const fourWeaponV315 = V2.demoV2 && V2.demoV2.fourWeaponV315;
const v315EntrySource = fs.readFileSync(path.join(baseDir, "demo-v3-15.html"), "utf8");
if (!fourWeaponV315 || fourWeaponV315.version !== "Demo V3.15"
  || !fourWeaponV315.formalCartoonAssetPass
  || !fourWeaponV315.formalCartoonScenePass
  || !fourWeaponV315.formalCartoonPickupPass
  || !fourWeaponV315.formalCartoonHudPass
  || !fourWeaponV315.formalCartoonVfxPass
  || !fourWeaponV315.formalCartoonAudioPass
  || !fourWeaponV315.decisionCompressionPass
  || !fourWeaponV315.allWeaponDesireLoopPass
  || !fourWeaponV315.weaponParityPass
  || !v315EntrySource.includes('params.set("demoV2", "four-weapon-v3-15")')) {
  console.error("Demo V3.15 must inherit V3.14 and add only the gated formal-cartoon asset pass", fourWeaponV315);
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-v3-15" });
V2.dispatch({ type: "START_RUN", weaponId: "marker" });
const v315State = V2.getState();
if (v315State.demoV2.suiteVersion !== "Demo V3.15"
  || !v315State.demoV2.formalCartoonAssetPass
  || !v315State.demoV2.formalCartoonScenePass
  || !v315State.demoV2.formalCartoonPickupPass
  || !v315State.demoV2.formalCartoonHudPass
  || !v315State.demoV2.formalCartoonVfxPass
  || !v315State.demoV2.formalCartoonAudioPass
  || !v315State.demoV2.decisionCompressionPass
  || v315State.stage.demoV2Phase !== fourWeaponV315.childPhaseByWeapon.marker) {
  console.error("Demo V3.15 must preserve V3.14 gameplay while carrying the formal-cartoon runtime flag", v315State.demoV2);
  process.exit(1);
}
V2.ui.render();
const formalHudSkinSource = fs.readFileSync(path.join(baseDir, "generated-skin.css"), "utf8");
const formalHudIndexSource = fs.readFileSync(path.join(baseDir, "index.html"), "utf8");
if (element.dataset.formalCartoonHud !== "true"
  || element.dataset.formalCartoonVfx !== "true"
  || element.dataset.formalCartoonAudio !== "true"
  || !formalHudSkinSource.includes('[data-formal-cartoon-hud="true"]')
  || !formalHudSkinSource.includes("--formal-hud-paper")
  || !formalHudSkinSource.includes("> .objective-hud::before")
  || !formalHudSkinSource.includes(".objective-row span:nth-child(3)")
  || !formalHudSkinSource.includes("> .hud.top-right .hp-stat::before")
  || !formalHudSkinSource.includes("> .warmup-overlay.transition-card")
  || !formalHudSkinSource.includes("> .growth-feedback::before")
  || !formalHudSkinSource.includes(".objective-hud .objective-alert")
  || !formalHudSkinSource.includes('.warmup-overlay.transition-card.hidden')
  || !formalHudSkinSource.includes('[data-health-state="critical"]')
  || !formalHudSkinSource.includes('> #buildPanel')
  || !formalHudIndexSource.includes("generated-skin.css?v=52")
  || !formalHudIndexSource.includes("view-model.js?v=30")
  || !formalHudIndexSource.includes("render.js?v=47")
  || !formalHudIndexSource.includes("main.js?v=94")) {
  console.error("Demo V3.15 formal combat HUD must reach runtime with paper-folder, first-aid, transition, and concise-copy contracts", {
    dataset: element.dataset,
    formalHudIndexSource: formalHudIndexSource.match(/(?:generated-skin|view-model|render|main)[^\"']+/g)
  });
  process.exit(1);
}
const v315LandingSource = fs.readFileSync(path.join(baseDir, "main.js"), "utf8");
if (!v315LandingSource.includes('subtitle.textContent = "四把办公武器，17 关。选一种打法，开工。"')
  || !v315LandingSource.includes('quickGuide.style.display = "none"')
  || v315LandingSource.includes("未通过门禁的素材不会覆盖 V3.14")) {
  console.error("Demo V3.15 landing must stay player-facing and must not expose production-gate copy");
  process.exit(1);
}
if (!formalHudSkinSource.includes('[data-decision-density="compact"] #componentShopPanel .component-install-promise')
  || !formalHudSkinSource.includes("display: none !important")
  || formalHudSkinSource.includes('[data-decision-density="compact"] #moduleChoices .module-promise-line b {\n  font-size: 10px')
  || formalHudSkinSource.includes('[data-decision-density="compact"] #componentShopPanel .marker-component-card .compare-line,\n.v2-game[data-decision-density="compact"] #componentShopPanel .component-install-promise')) {
  console.error("Demo V3.15 compact decisions must not hide excess copy behind tiny text or secondary install-position prose");
  process.exit(1);
}
const v315RenderSource = fs.readFileSync(path.join(baseDir, "src/v2/ui/render.js"), "utf8");
if (!v315RenderSource.includes("const immediateText = compactDecision ? choice.effect : choice.immediate")
  || !v315RenderSource.includes('String(choice.terminalPromise || "").split("：")[0]')) {
  console.error("Demo V3.15 module cards must use the immediate combat result plus one short future cue");
  process.exit(1);
}
console.log("OK Demo V3.15 formal combat HUD: gated paper-folder materials, concise labels, health, transition, and growth feedback reach runtime");
const formalTodoAttack = V2.combat.applyFormalEnemyDebugPose(v315State, "todo-attack-3");
const formalEmailDefeat = V2.combat.applyFormalEnemyDebugPose(v315State, "email-defeat");
const formalMeetingAttack = V2.combat.applyFormalEnemyDebugPose(v315State, "meeting-attack-3");
const formalPingAttack = V2.combat.applyFormalEnemyDebugPose(v315State, "ping-attack-3");
const formalDeadlineAttack = V2.combat.applyFormalEnemyDebugPose(v315State, "deadline-attack-3");
const formalScopeAttack = V2.combat.applyFormalEnemyDebugPose(v315State, "scope-attack-3");
const formalApprovalAttack = V2.combat.applyFormalEnemyDebugPose(v315State, "approval-attack-3");
const formalClientAttack = V2.combat.applyFormalEnemyDebugPose(v315State, "client-attack-3");
const formalLeadLane = V2.combat.applyFormalEnemyDebugPose(v315State, "boss-lead-lane-3");
const formalDirectorBurst = V2.combat.applyFormalEnemyDebugPose(v315State, "boss-director-burst-3");
const formalBossClientAttack = V2.combat.applyFormalEnemyDebugPose(v315State, "boss-client-attack-3");
const formalBossCeoAttack = V2.combat.applyFormalEnemyDebugPose(v315State, "boss-ceo-attack-3");
const formalBossCeoCharge = V2.combat.applyFormalEnemyDebugPose(v315State, "boss-ceo-charge-3");
if (!formalTodoAttack || formalTodoAttack.typeId !== "todo" || formalTodoAttack.contactAttackTime <= 0
  || !formalEmailDefeat || formalEmailDefeat.typeId !== "email" || !formalEmailDefeat.dead || formalEmailDefeat.deathTime <= 0
  || !formalMeetingAttack || formalMeetingAttack.typeId !== "meeting" || formalMeetingAttack.contactAttackTime <= 0
  || !formalPingAttack || formalPingAttack.typeId !== "ping" || formalPingAttack.rangedAttackTime <= 0
  || !formalDeadlineAttack || formalDeadlineAttack.typeId !== "deadline" || formalDeadlineAttack.chargeTime <= 0
  || !formalScopeAttack || formalScopeAttack.typeId !== "scope" || formalScopeAttack.splitAttackTime <= 0
  || !formalApprovalAttack || formalApprovalAttack.typeId !== "approval" || formalApprovalAttack.armorGuardTime <= 0
  || !formalClientAttack || formalClientAttack.typeId !== "client" || formalClientAttack.rangedAttackTime <= 0
  || !formalLeadLane || !formalLeadLane.boss || formalLeadLane.typeId !== "lead"
  || formalLeadLane.formalBossDebugAction !== "lane" || formalLeadLane.formalBossDebugFrame !== 3
  || !formalDirectorBurst || !formalDirectorBurst.boss || formalDirectorBurst.typeId !== "director"
  || formalDirectorBurst.formalBossDebugAction !== "burst" || formalDirectorBurst.formalBossDebugFrame !== 3
  || !formalBossClientAttack || !formalBossClientAttack.boss || formalBossClientAttack.typeId !== "client"
  || formalBossClientAttack.formalBossDebugAction !== "attack" || formalBossClientAttack.formalBossDebugFrame !== 3
  || formalBossClientAttack.rangedAttackTime <= 0
  || !formalBossCeoAttack || !formalBossCeoAttack.boss || formalBossCeoAttack.typeId !== "ceo"
  || formalBossCeoAttack.formalBossDebugAction !== "attack" || formalBossCeoAttack.formalBossDebugFrame !== 3
  || formalBossCeoAttack.rangedAttackTime <= 0
  || !formalBossCeoCharge || !formalBossCeoCharge.boss || formalBossCeoCharge.typeId !== "ceo"
  || formalBossCeoCharge.formalBossDebugAction !== "charge" || formalBossCeoCharge.formalBossDebugFrame !== 3
  || formalBossCeoCharge.chargeTime <= 0) {
  console.error("Demo V3.15 formal enemy debug poses must reach real attack and defeat runtime states", {
    formalTodoAttack,
    formalEmailDefeat,
    formalMeetingAttack,
    formalPingAttack,
    formalDeadlineAttack,
    formalScopeAttack,
    formalApprovalAttack,
    formalClientAttack,
    formalLeadLane,
    formalDirectorBurst,
    formalBossClientAttack,
    formalBossCeoAttack,
    formalBossCeoCharge
  });
  process.exit(1);
}
const formalImpactTodo = V2.combat.applyFormalEnemyDebugPose(v315State, "todo-move-0");
formalImpactTodo.x = v315State.player.x + v315State.player.radius + formalImpactTodo.r - 2;
formalImpactTodo.y = v315State.player.y;
formalImpactTodo.speed = 0;
formalImpactTodo.contactAttackTime = 0;
formalImpactTodo.contactAttackMax = 0;
formalImpactTodo.contactAttackCooldown = 0;
formalImpactTodo.contactAttackHit = false;
v315State.player.invuln = 0;
const formalImpactHpBefore = v315State.hp;
for (let formalPreImpactStep = 0; formalPreImpactStep < 4; formalPreImpactStep++) {
  V2.combat.qa.updateEnemies(v315State, 0.1);
}
if (v315State.hp !== formalImpactHpBefore) {
  console.error("Demo V3.15 formal contact damage must not occur before the authored impact frame", {
    before: formalImpactHpBefore,
    after: v315State.hp,
    contactAttackTime: formalImpactTodo.contactAttackTime
  });
  process.exit(1);
}
V2.combat.qa.updateEnemies(v315State, 0.1);
const formalImpactHpAfter = v315State.hp;
V2.combat.qa.updateEnemies(v315State, 0.05);
if (!(formalImpactHpAfter < formalImpactHpBefore) || v315State.hp !== formalImpactHpAfter) {
  console.error("Demo V3.15 formal contact damage must occur once at the authored impact frame", {
    before: formalImpactHpBefore,
    afterImpact: formalImpactHpAfter,
    afterFollowup: v315State.hp
  });
  process.exit(1);
}
const formalPingTiming = V2.combat.applyFormalEnemyDebugPose(v315State, "ping-move-0");
formalPingTiming.x = v315State.player.x + 250;
formalPingTiming.y = v315State.player.y;
formalPingTiming.speed = 0;
formalPingTiming.shootCooldown = 0;
formalPingTiming.rangedAttackTime = 0;
formalPingTiming.rangedAttackMax = 0;
formalPingTiming.rangedAttackFired = false;
const formalPingShotsBefore = v315State.stats.enemyShots || 0;
for (let formalPingPreReleaseStep = 0; formalPingPreReleaseStep < 4; formalPingPreReleaseStep++) {
  V2.combat.qa.updateEnemies(v315State, 0.1);
}
if ((v315State.stats.enemyShots || 0) !== formalPingShotsBefore) {
  console.error("Demo V3.15 Ping must not spawn its projectile before the authored release frame");
  process.exit(1);
}
V2.combat.qa.updateEnemies(v315State, 0.1);
const formalPingShotsAfter = v315State.stats.enemyShots || 0;
V2.combat.qa.updateEnemies(v315State, 0.05);
if (formalPingShotsAfter !== formalPingShotsBefore + 1 || (v315State.stats.enemyShots || 0) !== formalPingShotsAfter) {
  console.error("Demo V3.15 Ping must spawn exactly one projectile at the authored release frame", {
    before: formalPingShotsBefore,
    afterRelease: formalPingShotsAfter,
    afterFollowup: v315State.stats.enemyShots || 0
  });
  process.exit(1);
}
const formalDeadlineTiming = V2.combat.applyFormalEnemyDebugPose(v315State, "deadline-move-0");
formalDeadlineTiming.x = v315State.player.x + 90;
formalDeadlineTiming.y = v315State.player.y;
formalDeadlineTiming.speed = 0;
formalDeadlineTiming.chargeCooldown = 0;
formalDeadlineTiming.chargeTime = 0;
formalDeadlineTiming.chargeMax = 0;
formalDeadlineTiming.chargeHit = false;
v315State.player.invuln = 0;
const formalDeadlineHpBefore = v315State.hp;
for (let formalDeadlinePreHitStep = 0; formalDeadlinePreHitStep < 3; formalDeadlinePreHitStep++) {
  V2.combat.qa.updateEnemies(v315State, 0.1);
}
if (v315State.hp !== formalDeadlineHpBefore) {
  console.error("Demo V3.15 Deadline must not deal damage during its ring/compress anticipation", {
    before: formalDeadlineHpBefore,
    after: v315State.hp
  });
  process.exit(1);
}
V2.combat.qa.updateEnemies(v315State, 0.1);
const formalDeadlineHpAfter = v315State.hp;
V2.combat.qa.updateEnemies(v315State, 0.05);
if (!(formalDeadlineHpAfter < formalDeadlineHpBefore) || v315State.hp !== formalDeadlineHpAfter || !formalDeadlineTiming.chargeHit) {
  console.error("Demo V3.15 Deadline must deal exactly one hit during the authored dash window", {
    before: formalDeadlineHpBefore,
    afterDash: formalDeadlineHpAfter,
    afterFollowup: v315State.hp,
    chargeHit: formalDeadlineTiming.chargeHit
  });
  process.exit(1);
}
const formalScopeTiming = V2.combat.applyFormalEnemyDebugPose(v315State, "scope-move-0");
formalScopeTiming.hp = 1;
const formalScopeFragmentsBefore = v315State.enemies.filter(function (enemy) { return enemy.fragment; }).length;
V2.combat.qa.damageEnemy(v315State, formalScopeTiming, 2, "marker_test");
if (v315State.enemies.filter(function (enemy) { return enemy.fragment; }).length !== formalScopeFragmentsBefore) {
  console.error("Demo V3.15 Scope must not spawn child tasks before the authored paper-release frame");
  process.exit(1);
}
for (let formalScopePreReleaseStep = 0; formalScopePreReleaseStep < 4; formalScopePreReleaseStep++) {
  V2.combat.qa.updateEnemies(v315State, 0.1);
}
if (v315State.enemies.filter(function (enemy) { return enemy.fragment; }).length !== formalScopeFragmentsBefore) {
  console.error("Demo V3.15 Scope must keep child tasks hidden during swell/compress/tear anticipation");
  process.exit(1);
}
V2.combat.qa.updateEnemies(v315State, 0.1);
const formalScopeFragmentsAfter = v315State.enemies.filter(function (enemy) { return enemy.fragment; }).length;
V2.combat.qa.updateEnemies(v315State, 0.05);
if (formalScopeFragmentsAfter !== formalScopeFragmentsBefore + 2
  || v315State.enemies.filter(function (enemy) { return enemy.fragment; }).length !== formalScopeFragmentsAfter) {
  console.error("Demo V3.15 Scope must spawn exactly two child tasks at the authored release frame", {
    before: formalScopeFragmentsBefore,
    afterRelease: formalScopeFragmentsAfter
  });
  process.exit(1);
}
const formalApprovalTiming = V2.combat.applyFormalEnemyDebugPose(v315State, "approval-move-0");
formalApprovalTiming.x = v315State.player.x + 260;
formalApprovalTiming.y = v315State.player.y;
formalApprovalTiming.speed = 0;
formalApprovalTiming.hp = 100;
formalApprovalTiming.maxHp = 100;
formalApprovalTiming.armorGuardMax = 10;
formalApprovalTiming.armorGuardHp = 10;
const formalApprovalHpBefore = formalApprovalTiming.hp;
V2.combat.qa.damageEnemy(v315State, formalApprovalTiming, 10, "marker_test");
if (Math.abs(formalApprovalTiming.hp - (formalApprovalHpBefore - 7.2)) > 0.001 || formalApprovalTiming.armorGuardTime <= 0) {
  console.error("Demo V3.15 Approval must visibly guard while its 28% armor reduction is active", {
    before: formalApprovalHpBefore,
    after: formalApprovalTiming.hp,
    guardTime: formalApprovalTiming.armorGuardTime
  });
  process.exit(1);
}
for (let formalApprovalBreakHit = 0; formalApprovalBreakHit < 3; formalApprovalBreakHit++) {
  V2.combat.qa.damageEnemy(v315State, formalApprovalTiming, 10, "marker_test");
}
if (formalApprovalTiming.armorBrokenTime <= 0 || formalApprovalTiming.armorGuardHp > 0) {
  console.error("Demo V3.15 Approval must enter a real vulnerable window at the authored break frame");
  process.exit(1);
}
const formalApprovalBrokenHpBefore = formalApprovalTiming.hp;
V2.combat.qa.damageEnemy(v315State, formalApprovalTiming, 5, "marker_test");
if (Math.abs(formalApprovalTiming.hp - (formalApprovalBrokenHpBefore - 5)) > 0.001) {
  console.error("Demo V3.15 Approval armor must stop reducing damage during the vulnerable window");
  process.exit(1);
}
V2.combat.qa.updateEnemies(v315State, 1.35);
if (formalApprovalTiming.armorBrokenTime > 0 || formalApprovalTiming.armorGuardHp !== formalApprovalTiming.armorGuardMax) {
  console.error("Demo V3.15 Approval armor must recover after the visible vulnerable window");
  process.exit(1);
}
const formalClientTiming = V2.combat.applyFormalEnemyDebugPose(v315State, "client-move-0");
formalClientTiming.x = v315State.player.x + 215;
formalClientTiming.y = v315State.player.y;
formalClientTiming.speed = 0;
formalClientTiming.shootCooldown = 0;
formalClientTiming.rangedAttackTime = 0;
formalClientTiming.rangedAttackMax = 0;
formalClientTiming.rangedAttackFired = false;
const formalClientShotsBefore = v315State.stats.enemyShots || 0;
for (let formalClientPreReleaseStep = 0; formalClientPreReleaseStep < 4; formalClientPreReleaseStep++) {
  V2.combat.qa.updateEnemies(v315State, 0.1);
}
if ((v315State.stats.enemyShots || 0) !== formalClientShotsBefore) {
  console.error("Demo V3.15 Client must keep both call projectiles hidden before the authored double-release frame");
  process.exit(1);
}
V2.combat.qa.updateEnemies(v315State, 0.1);
const formalClientShotsAfter = v315State.stats.enemyShots || 0;
const formalClientProjectiles = v315State.projectiles.slice(-2);
V2.combat.qa.updateEnemies(v315State, 0.05);
if (formalClientShotsAfter !== formalClientShotsBefore + 2
  || (v315State.stats.enemyShots || 0) !== formalClientShotsAfter
  || formalClientProjectiles.length !== 2
  || formalClientProjectiles.some(function (projectile) { return projectile.x >= formalClientTiming.x; })
  || Math.sign(formalClientProjectiles[0].vy) === Math.sign(formalClientProjectiles[1].vy)) {
  console.error("Demo V3.15 Client must spawn exactly two separated projectiles from the handset at the authored release frame", {
    before: formalClientShotsBefore,
    afterRelease: formalClientShotsAfter,
    afterFollowup: v315State.stats.enemyShots || 0,
    projectiles: formalClientProjectiles
  });
  process.exit(1);
}
const formalLeadTiming = V2.combat.applyFormalEnemyDebugPose(v315State, "boss-lead-move-0");
formalLeadTiming.formalBossDebugAction = "";
formalLeadTiming.formalBossDebugFrame = 0;
formalLeadTiming.bossPatternIndex = 0;
formalLeadTiming.bossPatternKind = "";
formalLeadTiming.bossPatternCooldown = 0;
V2.combat.qa.beginBossPattern(v315State, formalLeadTiming);
if (formalLeadTiming.bossPatternKind !== "lane" || formalLeadTiming.bossPatternMax !== formalLeadTiming.bossPatternTimer) {
  console.error("Demo V3.15 Intern Mentor lane animation must own the real Boss warning window");
  process.exit(1);
}
V2.combat.qa.releaseBossPattern(v315State, formalLeadTiming);
if (formalLeadTiming.bossPatternKind || formalLeadTiming.bossPatternReleaseKind !== "lane"
  || formalLeadTiming.bossPatternReleaseTime !== 0.28) {
  console.error("Demo V3.15 Intern Mentor release frame must linger after the real lane volley");
  process.exit(1);
}
V2.combat.qa.updateEnemies(v315State, 0.3);
if (formalLeadTiming.bossPatternReleaseKind || formalLeadTiming.bossPatternReleaseTime > 0) {
  console.error("Demo V3.15 Intern Mentor release recovery must clear after its authored linger");
  process.exit(1);
}
const formalDirectorTiming = V2.combat.applyFormalEnemyDebugPose(v315State, "boss-director-move-0");
formalDirectorTiming.hp = 100;
formalDirectorTiming.maxHp = 100;
const formalDirectorHpBefore = formalDirectorTiming.hp;
V2.combat.qa.damageEnemy(v315State, formalDirectorTiming, 10, "marker_test");
if (Math.abs(formalDirectorTiming.hp - (formalDirectorHpBefore - 7.4)) > 0.001
  || formalDirectorTiming.hitFlash <= 0 || formalDirectorTiming.armor !== 0.26) {
  console.error("Demo V3.15 Department Director approval screens must visibly own the existing 26% armor", {
    before: formalDirectorHpBefore,
    after: formalDirectorTiming.hp,
    armor: formalDirectorTiming.armor,
    hitFlash: formalDirectorTiming.hitFlash
  });
  process.exit(1);
}
formalDirectorTiming.formalBossDebugAction = "";
formalDirectorTiming.formalBossDebugFrame = 0;
formalDirectorTiming.bossPatternIndex = 0;
formalDirectorTiming.bossPatternKind = "";
formalDirectorTiming.bossPatternCooldown = 0;
V2.combat.qa.beginBossPattern(v315State, formalDirectorTiming);
if (formalDirectorTiming.bossPatternKind !== "burst"
  || formalDirectorTiming.bossPatternMax !== formalDirectorTiming.bossPatternTimer) {
  console.error("Demo V3.15 Department Director barrier ring must own the real first Boss warning window");
  process.exit(1);
}
const formalDirectorProjectilesBefore = v315State.projectiles.length;
V2.combat.qa.releaseBossPattern(v315State, formalDirectorTiming);
if (formalDirectorTiming.bossPatternReleaseKind !== "burst"
  || formalDirectorTiming.bossPatternReleaseTime !== 0.28
  || v315State.projectiles.length <= formalDirectorProjectilesBefore) {
  console.error("Demo V3.15 Department Director safe-gap release frame must own the real burst volley");
  process.exit(1);
}
V2.combat.qa.updateEnemies(v315State, 0.3);
formalDirectorTiming.bossPatternCooldown = 0;
V2.combat.qa.beginBossPattern(v315State, formalDirectorTiming);
if (formalDirectorTiming.bossPatternKind !== "lane") {
  console.error("Demo V3.15 Department Director second authored pattern must be the real corridor callout");
  process.exit(1);
}
const formalDeliveryDebug = V2.combat.applyFormalEnemyDebugPose(v315State, "boss-delivery-charge-3");
if (!formalDeliveryDebug || formalDeliveryDebug.formalBossDebugAction !== "charge"
  || formalDeliveryDebug.formalBossDebugFrame !== 3) {
  console.error("Demo V3.15 Independent Delivery charge atlas must expose its authored impact frame");
  process.exit(1);
}
const formalDeliveryTiming = V2.combat.applyFormalEnemyDebugPose(v315State, "boss-delivery-move-0");
formalDeliveryTiming.formalBossDebugAction = "";
formalDeliveryTiming.formalBossDebugFrame = 0;
formalDeliveryTiming.x = v315State.player.x + 46;
formalDeliveryTiming.y = v315State.player.y;
formalDeliveryTiming.speed = 0;
formalDeliveryTiming.chargeCooldown = 0;
formalDeliveryTiming.chargeTime = 0;
formalDeliveryTiming.bossPatternCooldown = 999;
v315State.hp = v315State.maxHp;
v315State.player.invuln = 0;
const formalDeliveryStartX = formalDeliveryTiming.x;
const formalDeliveryHpBefore = v315State.hp;
for (let formalDeliveryWindupStep = 0; formalDeliveryWindupStep < 3; formalDeliveryWindupStep++) {
  V2.combat.qa.updateEnemies(v315State, 0.1);
}
if (formalDeliveryTiming.chargeMax !== 1.05 || formalDeliveryTiming.x !== formalDeliveryStartX
  || v315State.hp !== formalDeliveryHpBefore || formalDeliveryTiming.chargeHit) {
  console.error("Demo V3.15 Independent Delivery must keep movement and contact damage closed during its strap-and-seal windup", {
    chargeMax: formalDeliveryTiming.chargeMax,
    startX: formalDeliveryStartX,
    currentX: formalDeliveryTiming.x,
    hpBefore: formalDeliveryHpBefore,
    hpAfter: v315State.hp,
    chargeHit: formalDeliveryTiming.chargeHit
  });
  process.exit(1);
}
V2.combat.qa.updateEnemies(v315State, 0.1);
if (formalDeliveryTiming.x >= formalDeliveryStartX || v315State.hp >= formalDeliveryHpBefore
  || !formalDeliveryTiming.chargeHit) {
  console.error("Demo V3.15 Independent Delivery impact frame must own the real charging movement and one-hit contact window", {
    startX: formalDeliveryStartX,
    currentX: formalDeliveryTiming.x,
    hpBefore: formalDeliveryHpBefore,
    hpAfter: v315State.hp,
    chargeHit: formalDeliveryTiming.chargeHit
  });
  process.exit(1);
}
formalDeliveryTiming.chargeTime = 0;
formalDeliveryTiming.bossPatternIndex = 0;
formalDeliveryTiming.bossPatternKind = "";
formalDeliveryTiming.bossPatternCooldown = 0;
const formalDeliveryPatternOrder = [];
for (let formalDeliveryPatternStep = 0; formalDeliveryPatternStep < 3; formalDeliveryPatternStep++) {
  V2.combat.qa.beginBossPattern(v315State, formalDeliveryTiming);
  formalDeliveryPatternOrder.push(formalDeliveryTiming.bossPatternKind);
  V2.combat.qa.releaseBossPattern(v315State, formalDeliveryTiming);
}
if (JSON.stringify(formalDeliveryPatternOrder) !== JSON.stringify(["lane", "lane", "burst"])) {
  console.error("Demo V3.15 Independent Delivery must preserve its two corridor pressures before the safe-gap burst", formalDeliveryPatternOrder);
  process.exit(1);
}
const formalBossClientTiming = V2.combat.applyFormalEnemyDebugPose(v315State, "boss-client-move-0");
formalBossClientTiming.formalBossDebugAction = "";
formalBossClientTiming.formalBossDebugFrame = 0;
formalBossClientTiming.x = v315State.player.x + 220;
formalBossClientTiming.y = v315State.player.y;
formalBossClientTiming.speed = 0;
formalBossClientTiming.shootCooldown = 0;
formalBossClientTiming.rangedAttackTime = 0;
formalBossClientTiming.rangedAttackMax = 0;
formalBossClientTiming.rangedAttackFired = false;
formalBossClientTiming.bossPatternCooldown = 999;
const formalBossClientShotsBefore = v315State.stats.enemyShots || 0;
for (let formalBossClientPreReleaseStep = 0; formalBossClientPreReleaseStep < 5; formalBossClientPreReleaseStep++) {
  V2.combat.qa.updateEnemies(v315State, 0.1);
}
if ((v315State.stats.enemyShots || 0) !== formalBossClientShotsBefore) {
  console.error("Demo V3.15 Big Client must keep its ordinary projectile hidden during listen, dial, and compression frames");
  process.exit(1);
}
V2.combat.qa.updateEnemies(v315State, 0.1);
const formalBossClientShotsAfter = v315State.stats.enemyShots || 0;
const formalBossClientProjectile = v315State.projectiles[v315State.projectiles.length - 1];
V2.combat.qa.updateEnemies(v315State, 0.05);
if (formalBossClientShotsAfter !== formalBossClientShotsBefore + 1
  || (v315State.stats.enemyShots || 0) !== formalBossClientShotsAfter
  || !formalBossClientTiming.rangedAttackFired
  || !formalBossClientProjectile || formalBossClientProjectile.x >= formalBossClientTiming.x) {
  console.error("Demo V3.15 Big Client must release exactly one ordinary projectile from the receiver on its authored call frame", {
    before: formalBossClientShotsBefore,
    afterRelease: formalBossClientShotsAfter,
    afterFollowup: v315State.stats.enemyShots || 0,
    fired: formalBossClientTiming.rangedAttackFired,
    projectile: formalBossClientProjectile
  });
  process.exit(1);
}
formalBossClientTiming.rangedAttackTime = 0;
formalBossClientTiming.bossPatternIndex = 0;
formalBossClientTiming.bossPatternKind = "";
formalBossClientTiming.bossPatternCooldown = 0;
const formalBossClientPatternOrder = [];
for (let formalBossClientPatternStep = 0; formalBossClientPatternStep < 3; formalBossClientPatternStep++) {
  V2.combat.qa.beginBossPattern(v315State, formalBossClientTiming);
  formalBossClientPatternOrder.push(formalBossClientTiming.bossPatternKind);
  V2.combat.qa.releaseBossPattern(v315State, formalBossClientTiming);
}
if (JSON.stringify(formalBossClientPatternOrder) !== JSON.stringify(["burst", "lane", "burst"])) {
  console.error("Demo V3.15 Big Client must preserve its safe-gap, corridor, safe-gap escalation order", formalBossClientPatternOrder);
  process.exit(1);
}
const formalBossCeoTiming = V2.combat.applyFormalEnemyDebugPose(v315State, "boss-ceo-move-0");
formalBossCeoTiming.formalBossDebugAction = "";
formalBossCeoTiming.formalBossDebugFrame = 0;
v315State.player.x = 600;
v315State.player.y = 360;
formalBossCeoTiming.x = 820;
formalBossCeoTiming.y = 360;
formalBossCeoTiming.speed = 0;
formalBossCeoTiming.hp = 100;
formalBossCeoTiming.maxHp = 100;
const formalBossCeoArmoredHpBefore = formalBossCeoTiming.hp;
V2.combat.qa.damageEnemy(v315State, formalBossCeoTiming, 10, "marker_test");
if (Math.abs(formalBossCeoTiming.hp - (formalBossCeoArmoredHpBefore - 8.2)) > 0.001
  || formalBossCeoTiming.armor !== 0.18 || formalBossCeoTiming.hitFlash <= 0) {
  console.error("Demo V3.15 Final Approval CEO ledger shield must visibly own the existing 18% armor", {
    before: formalBossCeoArmoredHpBefore,
    after: formalBossCeoTiming.hp,
    armor: formalBossCeoTiming.armor,
    hitFlash: formalBossCeoTiming.hitFlash
  });
  process.exit(1);
}
formalBossCeoTiming.shootCooldown = 0;
formalBossCeoTiming.rangedAttackTime = 0;
formalBossCeoTiming.rangedAttackMax = 0;
formalBossCeoTiming.rangedAttackFired = false;
formalBossCeoTiming.chargeCooldown = 0;
formalBossCeoTiming.chargeTime = 0;
formalBossCeoTiming.chargeMax = 0;
formalBossCeoTiming.chargeHit = false;
formalBossCeoTiming.bossPatternCooldown = 999;
const formalBossCeoShotsBefore = v315State.stats.enemyShots || 0;
for (let formalBossCeoPreReleaseStep = 0; formalBossCeoPreReleaseStep < 5; formalBossCeoPreReleaseStep++) {
  V2.combat.qa.updateEnemies(v315State, 0.1);
}
if ((v315State.stats.enemyShots || 0) !== formalBossCeoShotsBefore || formalBossCeoTiming.chargeTime > 0) {
  console.error("Demo V3.15 Final Approval CEO must keep the memo hidden and prevent charge overlap during stamp windup");
  process.exit(1);
}
V2.combat.qa.updateEnemies(v315State, 0.1);
const formalBossCeoShotsAfter = v315State.stats.enemyShots || 0;
const formalBossCeoProjectile = v315State.projectiles[v315State.projectiles.length - 1];
V2.combat.qa.updateEnemies(v315State, 0.05);
if (formalBossCeoShotsAfter !== formalBossCeoShotsBefore + 1
  || (v315State.stats.enemyShots || 0) !== formalBossCeoShotsAfter
  || !formalBossCeoTiming.rangedAttackFired || formalBossCeoTiming.chargeTime > 0
  || !formalBossCeoProjectile || formalBossCeoProjectile.x >= formalBossCeoTiming.x) {
  console.error("Demo V3.15 Final Approval CEO stamp frame must release one memo without overlapping its charge", {
    before: formalBossCeoShotsBefore,
    afterRelease: formalBossCeoShotsAfter,
    chargeTime: formalBossCeoTiming.chargeTime,
    projectile: formalBossCeoProjectile
  });
  process.exit(1);
}
formalBossCeoTiming.x = v315State.player.x + 46;
formalBossCeoTiming.y = v315State.player.y;
formalBossCeoTiming.shootCooldown = 999;
formalBossCeoTiming.rangedAttackTime = 0;
formalBossCeoTiming.rangedAttackMax = 0;
formalBossCeoTiming.chargeCooldown = 0;
formalBossCeoTiming.chargeTime = 0;
formalBossCeoTiming.chargeMax = 0;
formalBossCeoTiming.chargeHit = false;
v315State.hp = v315State.maxHp;
v315State.player.invuln = 0;
const formalBossCeoChargeStartX = formalBossCeoTiming.x;
const formalBossCeoChargeHpBefore = v315State.hp;
for (let formalBossCeoWindupStep = 0; formalBossCeoWindupStep < 4; formalBossCeoWindupStep++) {
  V2.combat.qa.updateEnemies(v315State, 0.1);
}
if (formalBossCeoTiming.chargeMax !== 1.15 || formalBossCeoTiming.x !== formalBossCeoChargeStartX
  || v315State.hp !== formalBossCeoChargeHpBefore || formalBossCeoTiming.chargeHit
  || formalBossCeoTiming.rangedAttackTime > 0) {
  console.error("Demo V3.15 Final Approval CEO must keep movement, contact damage, and ranged fire closed during drive-lever windup", {
    chargeMax: formalBossCeoTiming.chargeMax,
    startX: formalBossCeoChargeStartX,
    currentX: formalBossCeoTiming.x,
    hpBefore: formalBossCeoChargeHpBefore,
    hpAfter: v315State.hp,
    rangedAttackTime: formalBossCeoTiming.rangedAttackTime
  });
  process.exit(1);
}
V2.combat.qa.updateEnemies(v315State, 0.1);
if (formalBossCeoTiming.x >= formalBossCeoChargeStartX || v315State.hp >= formalBossCeoChargeHpBefore
  || !formalBossCeoTiming.chargeHit || formalBossCeoTiming.rangedAttackTime > 0) {
  console.error("Demo V3.15 Final Approval CEO shield-impact frame must own one charge hit without ranged overlap", {
    startX: formalBossCeoChargeStartX,
    currentX: formalBossCeoTiming.x,
    hpBefore: formalBossCeoChargeHpBefore,
    hpAfter: v315State.hp,
    chargeHit: formalBossCeoTiming.chargeHit,
    rangedAttackTime: formalBossCeoTiming.rangedAttackTime
  });
  process.exit(1);
}
formalBossCeoTiming.chargeTime = 0;
formalBossCeoTiming.bossPatternIndex = 0;
formalBossCeoTiming.bossPatternKind = "";
formalBossCeoTiming.bossPatternCooldown = 0;
const formalBossCeoPatternOrder = [];
for (let formalBossCeoPatternStep = 0; formalBossCeoPatternStep < 2; formalBossCeoPatternStep++) {
  V2.combat.qa.beginBossPattern(v315State, formalBossCeoTiming);
  formalBossCeoPatternOrder.push(formalBossCeoTiming.bossPatternKind);
  V2.combat.qa.releaseBossPattern(v315State, formalBossCeoTiming);
}
if (JSON.stringify(formalBossCeoPatternOrder) !== JSON.stringify(["lane", "burst"])) {
  console.error("Demo V3.15 Final Approval CEO must preserve corridor audit before safe-gap final review", formalBossCeoPatternOrder);
  process.exit(1);
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-v3-15" });
V2.dispatch({ type: "START_RUN", weaponId: "marker" });
const formalPickupState = V2.getState();
formalPickupState.mode = "combat";
const formalMagnetPickup = {
  type: "xp", x: formalPickupState.player.x + 100, y: formalPickupState.player.y,
  amount: 5, radius: 7
};
formalPickupState.pickups = [formalMagnetPickup];
formalPickupState.formEvents = [];
const formalMagnetDistanceBefore = Math.hypot(
  formalPickupState.player.x - formalMagnetPickup.x,
  formalPickupState.player.y - formalMagnetPickup.y
);
V2.combat.qa.updatePickups(formalPickupState, 0.1);
const formalMagnetDistanceAfter = Math.hypot(
  formalPickupState.player.x - formalMagnetPickup.x,
  formalPickupState.player.y - formalMagnetPickup.y
);
if (!(formalMagnetDistanceAfter < formalMagnetDistanceBefore)
  || formalPickupState.pickups.length !== 1
  || formalMagnetPickup.visualAge !== 0.1
  || formalMagnetPickup.magnetRatio <= 0) {
  console.error("Demo V3.15 formal pickups must use the real magnet path and advance authored animation timing", {
    before: formalMagnetDistanceBefore,
    after: formalMagnetDistanceAfter,
    pickup: formalMagnetPickup
  });
  process.exit(1);
}
const formalPickupCases = [
  { type: "xp", amount: 5 },
  { type: "material", amount: 2 },
  { type: "heal", amount: 9 }
];
formalPickupCases.forEach(function (spec) {
  formalPickupState.formEvents = [];
  formalPickupState.pickups = [{
    type: spec.type,
    x: formalPickupState.player.x,
    y: formalPickupState.player.y,
    amount: spec.amount,
    radius: spec.type === "material" ? 6 : spec.type === "heal" ? 8 : 7
  }];
  if (spec.type === "heal") formalPickupState.hp = formalPickupState.maxHp - 20;
  const xpBefore = formalPickupState.stats.xpCollected;
  const materialsBefore = formalPickupState.materials;
  const materialStatsBefore = formalPickupState.stats.materialsCollected;
  const hpBefore = formalPickupState.hp;
  V2.combat.qa.updatePickups(formalPickupState, 0.016);
  const rewardPassed = spec.type === "xp" ? formalPickupState.stats.xpCollected === xpBefore + spec.amount
    : spec.type === "material" ? formalPickupState.materials === materialsBefore + spec.amount
      && formalPickupState.stats.materialsCollected === materialStatsBefore + spec.amount
      : formalPickupState.hp === Math.min(formalPickupState.maxHp, hpBefore + spec.amount);
  if (formalPickupState.pickups.length || !rewardPassed
    || !formalPickupState.formEvents.some(function (event) {
      return event.kind === "formal_pickup_collect" && event.pickupType === spec.type;
    })) {
    console.error("Demo V3.15 formal pickup collection must preserve the real reward and emit its raster collect feedback", {
      spec,
      state: formalPickupState
    });
    process.exit(1);
  }
});
const formalPickupDebug = V2.combat.applyFormalPickupDebugPose(formalPickupState, "all", 3, false);
const formalPickupCollectDebug = V2.combat.applyFormalPickupDebugPose(formalPickupState, "heal", 2, true);
if (!formalPickupDebug || formalPickupDebug.length !== 3
  || formalPickupDebug.some(function (pickup) { return pickup.formalDebugFrame !== 3; })
  || !formalPickupCollectDebug || !formalPickupCollectDebug.some(function (event) {
    return event.kind === "formal_pickup_collect" && event.pickupType === "heal" && event.debugHold;
  })) {
  console.error("Demo V3.15 formal pickup browser harness must expose every frame and the collection beat", {
    formalPickupDebug,
    formalPickupCollectDebug
  });
  process.exit(1);
}
const formalPickupAssets = ["xp-pickup-idle-v1.png", "material-pickup-idle-v1.png", "heal-pickup-idle-v1.png"];
if (formalPickupAssets.some(function (asset) {
  return !combatVisualSource.includes(asset)
    || !fs.existsSync(path.join(baseDir, "assets", "cartoon-office-pickups", asset));
}) || !combatVisualSource.includes("function formalCartoonPickupDef")
  || !combatVisualSource.includes("function addFormalPickupCollectEvent")
  || !fs.readFileSync(path.join(baseDir, "main.js"), "utf8").includes('params.get("formalPickup")')) {
  console.error("Demo V3.15 formal pickup family is missing assets, runtime gates, collection feedback, or deterministic browser poses");
  process.exit(1);
}
console.log("OK Demo V3.15 formal pickup batch: XP, material, and healing use gated four-frame sprites, real magnet timing, rewards, and collect feedback");
const formalVfxDir = path.join(baseDir, "assets", "cartoon-office-vfx");
const formalVfxContract = JSON.parse(fs.readFileSync(path.join(formalVfxDir, "cartoon-office-vfx-contract.json"), "utf8"));
const formalVfxCases = [
  { pose: "marker-line", family: "marker", source: "marker_test_copy", asset: "marker-vfx-v2.png", row: 0, shape: "line" },
  { pose: "marker-archive", family: "marker", source: "marker_test_archive", asset: "marker-vfx-v2.png", row: 1, shape: "line" },
  { pose: "thermos-steam", family: "thermos", source: "thermos_test_base", asset: "thermos-vfx-v2.png", row: 0, shape: "line" },
  { pose: "thermos-heat", family: "thermos", source: "thermos_test_kill_heatwave", asset: "thermos-vfx-v2.png", row: 1, shape: "area" },
  { pose: "scissors-closed", family: "scissors", source: "scissors_test_thrust", asset: "scissors-vfx-v3.png", row: 0, shape: "line" },
  { pose: "scissors-open", family: "scissors", source: "scissors_test_open", asset: "scissors-vfx-v3.png", row: 1, shape: "line" },
  { pose: "correction-spray", family: "correction_fluid", source: "correction_test_spray", asset: "correction-vfx-v2.png", row: 0, shape: "line" },
  { pose: "correction-error", family: "correction_fluid", source: "correction_test_system_crash", asset: "correction-vfx-v2.png", row: 1, shape: "area" }
];
const formalV314VfxState = makeVersionedWeaponState("four-weapon-v3-14", "marker");
if (formalV314VfxState.demoV2.formalCartoonVfxPass
  || V2.combat.applyFormalVfxDebugPose(formalV314VfxState, "marker-line", 0) !== null) {
  console.error("Demo V3.14 must reject the V3.15 formal VFX renderer and debug harness");
  process.exit(1);
}
const formalVfxState = makeVersionedWeaponState("four-weapon-v3-15", "marker");
formalVfxCases.forEach(function (spec) {
  const event = V2.combat.applyFormalVfxDebugPose(formalVfxState, spec.pose, 3);
  if (!event || event.source !== spec.source || !event.debugHold || event.debugProgress !== 0.875
    || V2.combat.qa.formalCartoonVfxFamily(formalVfxState, event.source) !== spec.family
    || V2.combat.qa.formalCartoonVfxRow(spec.family, event.source) !== spec.row
    || (spec.shape === "line" && (event.x1 == null || event.x2 == null))
    || (spec.shape === "area" && (event.x == null || event.radius == null))) {
    console.error("Demo V3.15 formal VFX debug pose must preserve real event source, geometry, family, row, and frame timing", spec, event);
    process.exit(1);
  }
});
const formalVfxAssetFiles = formalVfxCases.map(function (spec) { return spec.asset; }).filter(function (asset, index, list) {
  return list.indexOf(asset) === index;
});
if (formalVfxContract.layout.columns !== 4 || formalVfxContract.layout.rows !== 2
  || formalVfxContract.layout.cellWidth !== 256 || formalVfxContract.layout.cellHeight !== 256
  || JSON.stringify(formalVfxContract.frameOrder) !== JSON.stringify(["anticipation", "release", "impact", "fade"])
  || !formalVfxContract.runtimeRules.transparentByConstruction
  || !formalVfxContract.runtimeRules.eventGeometryAuthoritative
  || !formalVfxContract.runtimeRules.timelineDrivenFrameSelection
  || !formalVfxContract.runtimeRules.scissorsCompleteWeaponEveryFrame
  || !formalVfxContract.runtimeRules.noCanvasGeometrySubstitute
  || !formalVfxContract.runtimeRules.v314GateOff
  || !formalVfxContract.assets.some(function (item) {
    return item.weapon === "scissors" && item.file === "scissors-vfx-v3.png"
      && item.completeWeaponEveryFrame === true;
  })
  || formalVfxAssetFiles.some(function (asset) {
    const png = fs.readFileSync(path.join(formalVfxDir, asset));
    return !/-v[23]\.png$/.test(asset) || png.subarray(1, 4).toString("ascii") !== "PNG"
      || png.readUInt32BE(16) !== 1024 || png.readUInt32BE(20) !== 512
      || [4, 6].indexOf(png[25]) < 0 || png.length <= 100000;
  })
  || !combatVisualSource.includes('formal_marker_vfx_v2')
  || !combatVisualSource.includes('formal_thermos_vfx_v2')
  || !combatVisualSource.includes('formal_scissors_vfx_v3')
  || !combatVisualSource.includes('formal_correction_vfx_v2')
  || !combatVisualSource.includes('/_vfx_v[23]$/.test(id) ? "v=315-vfx-5"')
  || !combatVisualSource.includes('const MAX_CONCURRENT_SPRITE_LOADS = 6')
  || !combatVisualSource.includes('function ensureWeaponAssets(weaponId)')
  || !combatVisualSource.includes('window.__cubicleAssetAudit = spriteLoadSnapshot')
  || !fs.readFileSync(path.join(baseDir, "main.js"), "utf8").includes('params.get("formalVfx")')) {
  console.error("Demo V3.15 formal VFX family is missing atlas, transparent-grid, cache, browser-harness, or V3.14 isolation contracts");
  process.exit(1);
}
console.log("OK Demo V3.15 formal weapon VFX: four gated 4x2 atlases drive eight real-source line/area identities through authored timing");
const formalAudioDir = path.join(baseDir, "assets", "cartoon-office-audio");
const formalAudioContract = JSON.parse(fs.readFileSync(path.join(formalAudioDir, "cartoon-office-audio-contract.json"), "utf8"));
const formalAudioCueIds = Object.keys(formalAudioContract.cues || {});
const formalAudioRuntimeCueIds = Object.keys(V2.formalAudioCues || {});
if (formalAudioCueIds.length !== 21
  || JSON.stringify(formalAudioCueIds.sort()) !== JSON.stringify(formalAudioRuntimeCueIds.sort())
  || formalAudioCueIds.some(function (cueId) {
    const cue = formalAudioContract.cues[cueId];
    const runtimeCue = V2.getFormalAudioCue(cueId);
    const filePath = path.join(formalAudioDir, cue.file);
    return !runtimeCue || runtimeCue.file !== cue.file || runtimeCue.role !== cue.role
      || !fs.existsSync(filePath) || fs.statSync(filePath).size <= 44;
  })) {
  console.error("Demo V3.15 formal audio contract and runtime cue table must expose the same 21 playable WAV assets");
  process.exit(1);
}
const formalV314AudioState = makeVersionedWeaponState("four-weapon-v3-14", "marker");
formalV314AudioState.stats.audioEvents = [];
V2.audio.handleFormalEvent({ kind: "encounter_complete", source: "gate_probe" }, formalV314AudioState);
if (formalV314AudioState.demoV2.formalCartoonAudioPass || formalV314AudioState.stats.audioEvents.length) {
  console.error("Demo V3.14 must reject the V3.15 formal audio event path");
  process.exit(1);
}
const formalAudioState = makeVersionedWeaponState("four-weapon-v3-15", "marker");
formalAudioState.stats.audioEvents = [];
[
  { kind: "weapon", family: "marker" },
  { kind: "weapon", family: "thermos" },
  { kind: "weapon", family: "scissors" },
  { kind: "weapon", family: "correction_fluid" },
  ...formalAudioContract.enemyMapping.normal.map(function (enemyType) { return { kind: "enemy_action", enemyType, boss: false }; }),
  ...formalAudioContract.enemyMapping.boss.map(function (enemyType) { return { kind: "enemy_action", enemyType, boss: true }; }),
  { kind: "enemy_defeat", enemyType: "todo", boss: false, stage: "impact" },
  { kind: "enemy_defeat", enemyType: "ceo", boss: true, stage: "impact" },
  { kind: "encounter_complete", stage: "release" },
  { kind: "run_complete", stage: "release" }
].forEach(function (event, index) {
  V2.audio.handleFormalEvent(Object.assign({ source: "formal_audio_probe_" + index }, event), formalAudioState);
});
if (!formalAudioState.demoV2.formalCartoonAudioPass
  || formalAudioState.stats.audioEvents.length !== 21
  || formalAudioState.stats.audioEvents.some(function (event) {
    return !event.formal || !event.cue || !event.voice || !event.role || !event.stage || !event.reason;
  })) {
  console.error("Demo V3.15 formal audio semantic matrix did not reach the gated audit path", formalAudioState.stats.audioEvents);
  process.exit(1);
}
console.log("OK Demo V3.15 formal audio: 21 runtime WAV cues cover four weapons, 13 enemy identities, defeat, encounter clear, and final clear behind an isolated gate");
const formalEnemyAssets = [
  "backlog-enemy-actions-v2.png", "backlog-enemy-walk-v3.png", "backlog-enemy-slam-v3.png",
  "urgent-email-enemy-actions-v2.png", "urgent-email-run-v3.png", "urgent-email-dash-v3.png",
  "meeting-enemy-actions-v3.png", "meeting-enemy-walk-v3.png", "meeting-enemy-slam-v3.png",
  "ping-enemy-actions-v3.png", "ping-enemy-float-v3.png", "ping-enemy-send-v3.png",
  "deadline-enemy-actions-v3.png", "deadline-enemy-run-v3.png", "deadline-enemy-charge-v3.png",
  "scope-enemy-actions-v3.png", "scope-enemy-run-v3.png", "scope-enemy-split-v3.png",
  "approval-enemy-actions-v3.png", "approval-enemy-walk-v3.png", "approval-enemy-guard-v3.png",
  "client-enemy-actions-v3.png", "client-enemy-run-v3.png", "client-enemy-call-v3.png",
  "lead-boss-actions-v1.png", "lead-boss-walk-v1.png", "lead-boss-lane-v1.png", "lead-boss-burst-v1.png",
  "director-boss-actions-v1.png", "director-boss-walk-v1.png", "director-boss-lane-v1.png", "director-boss-burst-v1.png",
  "delivery-boss-actions-v1.png", "delivery-boss-walk-v1.png", "delivery-boss-charge-v1.png",
  "delivery-boss-lane-v1.png", "delivery-boss-burst-v1.png",
  "client-boss-actions-v1.png", "client-boss-walk-v1.png", "client-boss-call-v1.png",
  "client-boss-lane-v1.png", "client-boss-burst-v1.png",
  "ceo-boss-actions-v1.png", "ceo-boss-walk-v1.png", "ceo-boss-stamp-v1.png",
  "ceo-boss-charge-v1.png", "ceo-boss-lane-v1.png", "ceo-boss-burst-v1.png"
];
if (formalEnemyAssets.some(function (asset) {
  return !combatVisualSource.includes(asset) || !fs.existsSync(path.join(baseDir, "assets", "cartoon-marker-slice", asset));
}) || !combatVisualSource.includes("function updateFormalContactAttack")
  || !combatVisualSource.includes("function drawFormalCartoonEnemy")
  || !combatVisualSource.includes("enemy.deathTime = 0.34")
  || !fs.readFileSync(path.join(baseDir, "main.js"), "utf8").includes('params.get("formalEnemyPose")')) {
  console.error("Demo V3.15 first formal enemy batch is missing assets, real action timing, defeat linger, or deterministic browser poses");
  process.exit(1);
}
console.log("OK Demo V3.15 formal enemy batch: all eight normal enemies and all five Bosses use gated authored runtime states");

if (!combatVisualSource.includes('drawSpriteFrame(ctx, "scissors_slash_v24"')
  || !combatVisualSource.includes('drawSpriteFrame(ctx, "scissors_strike_v27"')
  || !combatVisualSource.includes('source === "scissors_test_open" || source === "scissors_test_finale"')
  || !combatVisualSource.includes('const openLevel = scissors.modules && (scissors.modules.archive || 0)')) {
  console.error("Open-Blade Scissors must restore the complete anchored scissors model and strike frames while the base route keeps its rooted slash arc");
  process.exit(1);
}
for (const weapon of fourWeaponFixed.weaponCards) {
  V2.dispatch({ type: "RESTART" });
  V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-fixed" });
  V2.dispatch({ type: "START_RUN", weaponId: weapon.id });
  const suiteState = V2.getState();
  if (suiteState.selectedWeaponId !== weapon.id || suiteState.demoV2.suiteVersion !== "Demo V2.9"
    || !suiteState.demoV2.cyberNeonSuite || suiteState.stage.demoV2Phase !== fourWeaponFixed.childPhaseByWeapon[weapon.id]) {
    console.error("Demo V2.9 must route every selection into its isolated fixed test while preserving suite identity", weapon.id, suiteState.demoV2, suiteState.stage);
    process.exit(1);
  }
}
for (const weaponId of ["scissors", "thermos", "correction_fluid"]) {
  V2.dispatch({ type: "RESTART" });
  V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-fixed" });
  V2.dispatch({ type: "START_RUN", weaponId });
  const pathState = V2.getState();
  pathState.warmupTime = 0;
  V2.combat.update(0.05);
  if (!pathState.enemies.length) {
    console.error("Playable path must spawn real encounter enemies before the first module", weaponId, pathState.stage);
    process.exit(1);
  }
  pathState.stageTime = 0;
  V2.combat.update(0.05);
  const pathConfig = V2.getDemoV2FixedTestConfig(pathState);
  if (!pathState.demoV2[pathConfig.runtimeKey].collecting) {
    console.error("A normal encounter must enter collection when its timer expires even with live enemies", weaponId, pathState.stage, pathState.enemies);
    process.exit(1);
  }
  pathConfig.finishCollection(pathState);
  if (pathState.mode !== "module_select" || pathState.stage.id !== 1) {
    console.error("Scissors, Thermos and Correction Fluid must all reach a first module after encounter 1, before any component shop", weaponId, pathState.mode, pathState.stage);
    process.exit(1);
  }
}
V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "scissors" });
V2.dispatch({ type: "RESTART" });
const restartedSuiteState = V2.getState();
const restartedSuiteConfig = V2.getDemoV2FixedTestConfig(restartedSuiteState);
if (!restartedSuiteConfig || !restartedSuiteConfig.coordinator || restartedSuiteConfig.weaponCards.length !== 4) {
  console.error("Restarting the suite must return to the four-weapon coordinator instead of locking the last weapon", restartedSuiteState.demoV2, restartedSuiteConfig);
  process.exit(1);
}

V2.dispatch({ type: "INIT", demoV2Phase: "correction-fluid-fixed" });
V2.dispatch({ type: "START_RUN", weaponId: "correction_fluid" });
const stageTenState = V2.getState();
const stageTenConfig = V2.getDemoV2FixedTestConfig(stageTenState);
stageTenConfig.startEncounter(stageTenState, 9);
stageTenState.warmupTime = 0;
const stageTenHeavyHp = stageTenState.stage.normalEnemyHp * 1.45 + 29;
stageTenState.enemies = [{ id: "stage-ten-heavy", typeId: "meeting", x: stageTenState.player.x + 110, y: stageTenState.player.y, r: 17, hp: stageTenHeavyHp, maxHp: stageTenHeavyHp, speed: 0, damage: 0, dead: false, color: "#fff", rooted: 0 }];
for (let shot = 0; shot < 8 && !stageTenState.enemies[0].dead; shot++) V2.combat.fireWeapon(stageTenState);
if (stageTenState.stage.normalEnemyHp !== 30 || stageTenState.stageKills < 1) {
  console.error("A starter Correction Fluid must be able to record kills in Stage 10 instead of completing at 0/92", stageTenState.stage, stageTenState.enemies[0], stageTenState.activeFormParams);
  process.exit(1);
}
const forbiddenExperienceTerms = /马克笔|激光|保温杯|扇面|剪刀|近战|修正液|喷射/;
if (Object.values(markerFixed.experienceStats).some((stat) => forbiddenExperienceTerms.test(stat.effect))) {
  console.error("Experience descriptions must remain universal across all playable weapons", markerFixed.experienceStats);
  process.exit(1);
}

// A universal attribute name is a player contract, not just shared copy. The
// actual increment must stay identical across all four weapons.
const universalExpectations = {
  maxHp: { read: (state) => state.maxHp, delta: 12 },
  hpRegen: { read: (state) => state.activeFormParams.markerFixedHpRegen, delta: 0.8 },
  lifeSteal: { read: (state) => state.activeFormParams.markerFixedLifeStealChance, delta: 0.015 },
  range: { read: (state) => state.activeFormParams.range, ratio: 1.05 }
};
for (const weaponId of ["marker", "thermos", "scissors", "correction_fluid"]) {
  for (const statId of Object.keys(universalExpectations)) {
    V2.dispatch({ type: "RESTART" });
    V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-fixed" });
    V2.dispatch({ type: "START_RUN", weaponId });
    const state = V2.getState();
    const config = V2.getDemoV2FixedTestConfig(state);
    const runtime = state.demoV2[config.runtimeKey];
    const expectation = universalExpectations[statId];
    const before = expectation.read(state);
    runtime.experienceAllocations[statId] += 1;
    config.rebuildParams(state);
    const after = expectation.read(state);
    const valid = expectation.delta != null
      ? Math.abs((after - before) - expectation.delta) < 0.0001
      : Math.abs(after / before - expectation.ratio) < 0.0001;
    if (!valid) {
      console.error("Universal experience stats must have identical real increments across weapons", weaponId, statId, before, after, expectation);
      process.exit(1);
    }
  }
}

// Every component variant shown in the shop must mutate a parameter consumed
// by that weapon's combat loop. Both module branches are opened so route-
// dependent stats such as duration are tested against a real mechanism.
const componentReaders = {
  marker: {
    "tip.damage": (s) => s.activeFormParams.damage,
    "tip.pierce": (s) => s.activeFormParams.pierce,
    "body.attackSpeed": (s) => -s.activeFormParams.cooldown,
    "body.amount": (s) => s.activeFormParams.amount,
    "tail.range": (s) => s.activeFormParams.range,
    "tail.duration": (s) => s.activeFormParams.markerFixedTrailDuration
  },
  thermos: {
    "tip.damage": (s) => s.activeFormParams.damage,
    "tip.pierce": (s) => s.activeFormParams.markerFixedCritChance,
    "body.attackSpeed": (s) => -s.activeFormParams.cooldown,
    "body.amount": (s) => s.activeFormParams.amount,
    "tail.range": (s) => s.activeFormParams.range,
    "tail.duration": (s) => s.activeFormParams.thermosFixedCondensationDuration
  },
  scissors: {
    "tip.damage": (s) => s.activeFormParams.damage,
    "tip.pierce": (s) => s.activeFormParams.markerFixedCritChance,
    "body.attackSpeed": (s) => -s.activeFormParams.cooldown,
    "body.amount": (s) => s.activeFormParams.markerFixedDodgeChance,
    "tail.range": (s) => s.activeFormParams.scissorsFanRange,
    "tail.duration": (s) => s.player.speed
  },
  correction_fluid: {
    "tip.damage": (s) => s.activeFormParams.damage,
    "tip.pierce": (s) => -s.activeFormParams.cooldown,
    "body.attackSpeed": (s) => s.activeFormParams.markerFixedCritChance,
    "body.amount": (s) => s.activeFormParams.range,
    "tail.range": (s) => s.activeFormParams.correctionErrorDuration,
    "tail.duration": (s) => s.player.speed
  }
};
for (const weaponId of Object.keys(componentReaders)) {
  for (const key of Object.keys(componentReaders[weaponId])) {
    V2.dispatch({ type: "RESTART" });
    V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-fixed" });
    V2.dispatch({ type: "START_RUN", weaponId });
    const state = V2.getState();
    const config = V2.getDemoV2FixedTestConfig(state);
    const runtime = state.demoV2[config.runtimeKey];
    runtime.modules.copy = 1;
    runtime.modules.archive = 1;
    config.rebuildParams(state);
    const reader = componentReaders[weaponId][key];
    const before = reader(state);
    const [partId, statId] = key.split(".");
    runtime.parts[partId].allocations[statId] = 1;
    config.rebuildParams(state);
    const after = reader(state);
    if (!(after > before)) {
      console.error("Every offered component variant must improve a combat-consumed parameter", weaponId, key, before, after, state.activeFormParams);
      process.exit(1);
    }
  }
}

// Encounter copy and actual spawns share one roster. Walk all 17 encounter
// transitions for every weapon, including the asymmetric Boss completion rule,
// so no later stage can silently become an unfinishable wait room.
const publicCopyPattern = /测试|验证|检验|复盘/;
const weaponSpecificEncounterCopyPattern = /单线|贯穿|复写|留档|墨迹|扇面|冷凝|热浪|合刃|张刃|修正液|错误层/;
for (const encounter of markerFixed.encounters) {
  const wave = markerFixed.waves[encounter.id - 1];
  if (!encounter.enemyRoster || !encounter.enemyRoster.length || wave.enemyRoster.join(",") !== encounter.enemyRoster.join(",")
    || publicCopyPattern.test(encounter.preview) || weaponSpecificEncounterCopyPattern.test(encounter.preview)
    || encounter.hint !== encounter.preview) {
    console.error("Encounter roster, preview and live objective must be one authored contract", encounter, wave);
    process.exit(1);
  }
}
for (const weaponId of ["marker", "thermos", "scissors", "correction_fluid"]) {
  V2.dispatch({ type: "RESTART" });
  V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-fixed" });
  V2.dispatch({ type: "START_RUN", weaponId });
  const state = V2.getState();
  const config = V2.getDemoV2FixedTestConfig(state);
  for (let index = 0; index < config.encounterCount; index++) {
    config.startEncounter(state, index);
    state.warmupTime = 0;
    V2.combat.update(0.05);
    const encounter = config.encounters[index];
    const normalTypes = state.enemies.filter((enemy) => !enemy.boss).map((enemy) => enemy.typeId);
    if (normalTypes.some((typeId) => encounter.enemyRoster.indexOf(typeId) < 0)) {
      console.error("Encounter spawned an enemy role not announced by its preview", weaponId, encounter.id, normalTypes, encounter.enemyRoster);
      process.exit(1);
    }
    if (encounter.boss) {
      const boss = state.enemies.find((enemy) => enemy.boss);
      if (!boss || state.stage.normalEnemyHp === state.stage.enemyHp) {
        console.error("Boss encounters must spawn a real Boss while keeping add HP on the normal curve", weaponId, encounter.id, state.stage, state.enemies);
        process.exit(1);
      }
      boss.hp = 1;
      V2.combat.qa.damageEnemy(state, boss, 999, "fixed_suite_flow_audit");
    }
    state.stageTime = 0;
    V2.combat.update(0.05);
    const runtime = state.demoV2[config.runtimeKey];
    if (!runtime.collecting) {
      console.error("Every fixed-suite encounter must reach its pickup window under its published completion rule", weaponId, encounter.id, state.mode, state.stage);
      process.exit(1);
    }
  }
}
console.log("OK Demo V2.9 horizontal audit: universal stats, 24 component variants, authored enemy rosters and all 68 weapon/encounter transitions");

// Deterministic end-to-end QA paths. Short pressure probes retain real incoming
// damage. Full 17-encounter soaks disable only enemy outgoing damage, while
// retaining real spawn counts, HP, timers, Boss kill requirements, targeting,
// pickups, XP choices, modules and component purchases. Keeping those concerns
// separate avoids declaring a melee build broken because a generic ranged bot
// cannot kite, while still catching the actual "cannot reach module choice" and
// "timer ended but stage never ends" failures reported by players.
function makeSeededRandom(seed) {
  let value = seed >>> 0;
  return function seededRandom() {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function driveFixedSuiteMovement(state, weaponId, elapsed) {
  const living = state.enemies.filter((enemy) => !enemy.dead);
  const runtime = state.demoV2[V2.getDemoV2FixedTestConfig(state).runtimeKey];
  const nearest = living.slice().sort((a, b) => Math.hypot(a.x - state.player.x, a.y - state.player.y) - Math.hypot(b.x - state.player.x, b.y - state.player.y))[0] || null;
  const target = living.find((enemy) => enemy.boss) || nearest;
  // A real player deliberately crosses a health pack when hurt and sweeps the
  // arena during the explicit collection window. The audit bot must exercise
  // that public pickup loop instead of depending on end-of-window auto-pickup.
  const pickupCandidates = (state.pickups || []).filter((pickup) => !pickup.dead);
  const wantedPickups = state.hp < state.maxHp * 0.72
    ? pickupCandidates.filter((pickup) => pickup.type === "heal")
    : runtime.collecting ? pickupCandidates : [];
  wantedPickups.sort((a, b) => Math.hypot(a.x - state.player.x, a.y - state.player.y) - Math.hypot(b.x - state.player.x, b.y - state.player.y));
  const pickupGoal = wantedPickups[0] || null;

  // Evaluate a small ring of legal movement directions and choose the safest
  // future position that still keeps the weapon in its working band. This is
  // ordinary kiting expressed deterministically, with no hidden stat or damage
  // immunity, and it is much closer to a competent player than vector sums
  // that can cancel in the middle of a pack.
  const preferred = weaponId === "scissors" ? 82 : weaponId === "thermos" ? 175 : weaponId === "correction_fluid" ? 245 : 350;
  const inner = weaponId === "scissors" ? 30 : weaponId === "thermos" ? 100 : weaponId === "correction_fluid" ? 170 : 255;
  const lookAhead = Math.max(90, state.player.speed * 0.55);
  let best = { score: -Infinity, vx: 1, vy: 0 };
  for (let index = 0; index < 16; index++) {
    const angle = index / 16 * Math.PI * 2 + elapsed * 0.015;
    const vx = Math.cos(angle);
    const vy = Math.sin(angle);
    const fx = state.player.x + vx * lookAhead;
    const fy = state.player.y + vy * lookAhead;
    let score = 0;
    const edge = Math.min(fx, fy, state.world.width - fx, state.world.height - fy);
    if (edge < 95) score -= (95 - edge) * 5;
    let nearestFuture = 9999;
    for (const enemy of living) {
      const d = Math.hypot(fx - enemy.x, fy - enemy.y) - enemy.r;
      nearestFuture = Math.min(nearestFuture, d);
      const normalDanger = weaponId === "scissors" ? 48 : 105;
      const bossDanger = weaponId === "scissors" ? 82 : 155;
      const danger = (enemy.boss ? bossDanger : normalDanger) - d;
      if (danger > 0) score -= danger * danger * (enemy.boss ? 0.09 : 0.055);
    }
    score += Math.min(240, nearestFuture) * 0.18;
    for (const projectile of (state.projectiles || [])) {
      if (!projectile.hostile) continue;
      const px = projectile.x + (projectile.vx || 0) * 0.42;
      const py = projectile.y + (projectile.vy || 0) * 0.42;
      const d = Math.hypot(fx - px, fy - py);
      if (d < 125) score -= (125 - d) * 2.7;
    }
    if (target) {
      const targetDistance = Math.hypot(fx - target.x, fy - target.y) - target.r;
      if (targetDistance < inner) score -= (inner - targetDistance) * 1.7;
      if (targetDistance > preferred) score -= (targetDistance - preferred) * (weaponId === "marker" ? 0.08 : 0.34);
    }
    if (pickupGoal) {
      const pickupDistance = Math.hypot(fx - pickupGoal.x, fy - pickupGoal.y);
      score -= pickupDistance * (runtime.collecting ? 0.72 : 0.2);
    }
    if (score > best.score) best = { score, vx, vy };
  }
  const vx = best.vx;
  const vy = best.vy;
  state.input.left = vx < -0.2;
  state.input.right = vx > 0.2;
  state.input.up = vy < -0.2;
  state.input.down = vy > 0.2;
}

function chooseAutomatedExperience(state) {
  const priorities = ["armor", "maxHp", "moveSpeed", "dodge", "hpRegen", "lifeSteal", "damage", "attackSpeed", "range", "critChance", "luck", "harvesting"];
  const choices = state.upgradeChoices || [];
  const choice = choices.slice().sort((a, b) => priorities.indexOf(a.id) - priorities.indexOf(b.id))[0];
  if (!choice) throw new Error("Automated full-run path reached an empty experience shop");
  V2.dispatch({ type: "SELECT_UPGRADE", upgradeId: choice.id });
}

function buyAutomatedComponents(state) {
  const config = V2.getDemoV2FixedTestConfig(state);
  const runtime = state.demoV2[config.runtimeKey];
  let guard = 0;
  while (guard++ < 12) {
    const affordable = runtime.offers.filter((offer) => !offer.sold && offer.cost <= state.materials && offer.action !== "replace");
    if (!affordable.length) break;
    affordable.sort((a, b) => (a.action === "upgrade" ? -1 : 0) - (b.action === "upgrade" ? -1 : 0));
    V2.dispatch({ type: "BUY_MARKER_COMPONENT", offerId: affordable[0].id });
  }
  V2.dispatch({ type: "CONTINUE_MARKER_TEST" });
}

function runAutomatedFixedSuite(weaponId, routeIndex, seed, demoPhase) {
  const originalRandom = Math.random;
  Math.random = makeSeededRandom(seed);
  try {
    V2.dispatch({ type: "RESTART" });
    V2.dispatch({ type: "INIT", demoV2Phase: demoPhase || "four-weapon-fixed" });
    V2.dispatch({ type: "START_RUN", weaponId });
    const state = V2.getState();
    let simulated = 0;
    let steps = 0;
    let lastEncounter = state.stage.id;
    let encounterElapsed = 0;
    while (state.mode !== "result" && steps++ < 160000) {
      if (state.mode === "combat") {
        const dt = state.demoV2[V2.getDemoV2FixedTestConfig(state).runtimeKey].collecting ? 0.25 : 0.1;
        // Progression soak: enemies remain real targets with real health and
        // movement, but cannot turn this flow test into a bot-skill contest.
        state.enemies.forEach((enemy) => { enemy.damage = 0; });
        (state.projectiles || []).forEach((projectile) => { if (projectile.hostile) projectile.hostile = false; });
        driveFixedSuiteMovement(state, weaponId, simulated);
        V2.combat.update(dt);
        simulated += dt;
        if (state.stage.id !== lastEncounter) {
          lastEncounter = state.stage.id;
          encounterElapsed = 0;
        } else if (!state.demoV2[V2.getDemoV2FixedTestConfig(state).runtimeKey].collecting) {
          encounterElapsed += dt;
        }
        const encounter = V2.getDemoV2FixedTestConfig(state).currentEncounter(state);
        if (encounter && encounterElapsed > encounter.duration + 120) {
          throw new Error(weaponId + " stalled in encounter " + encounter.id + " for " + encounterElapsed.toFixed(1) + "s");
        }
      } else if (state.mode === "module_select") {
        const choices = V2.getDemoV2FixedTestConfig(state).makeModuleChoices(state);
        const preferred = choices[routeIndex];
        const fallback = choices.find((choice) => !choice.disabled);
        V2.dispatch({ type: "SELECT_DEMO_V2_MODULE", moduleId: preferred && !preferred.disabled ? preferred.id : fallback.id });
      } else if (state.mode === "level_up") {
        chooseAutomatedExperience(state);
      } else if (state.mode === "component_shop") {
        buyAutomatedComponents(state);
      } else {
        throw new Error(weaponId + " reached unexpected mode " + state.mode + " during full-run audit");
      }
    }
    const config = V2.getDemoV2FixedTestConfig(state);
    const runtime = state.demoV2[config.runtimeKey];
    if (state.mode !== "result" || !state.flags.won || runtime.completedEncounters !== 17 || runtime.moduleChoiceIndex !== 5 || runtime.completedStages !== 6) {
      throw new Error(weaponId + " route " + routeIndex + " did not complete the real 17-encounter flow: " + JSON.stringify({ mode: state.mode, won: state.flags.won, hp: state.hp, completed: runtime.completedEncounters, modules: runtime.moduleChoiceIndex, shops: runtime.completedStages, stage: state.stage.id }));
    }
    return { demoPhase: demoPhase || "four-weapon-fixed", weaponId, routeIndex, hp: state.hp, kills: state.kills, level: state.level, components: runtime.componentsBought };
  } finally {
    Math.random = originalRandom;
  }
}

function runEarlyPressureProbe(weaponId, seed, demoPhase) {
  const originalRandom = Math.random;
  Math.random = makeSeededRandom(seed);
  try {
    V2.dispatch({ type: "RESTART" });
    V2.dispatch({ type: "INIT", demoV2Phase: demoPhase || "four-weapon-fixed" });
    V2.dispatch({ type: "START_RUN", weaponId });
    const state = V2.getState();
    for (let step = 0; step < 120 && state.mode === "combat"; step++) {
      driveFixedSuiteMovement(state, weaponId, step * 0.1);
      V2.combat.update(0.1);
    }
    const damageDone = Object.values(state.stats.damageDone || {}).reduce((sum, value) => sum + value, 0);
    if (state.mode === "result" || state.hp <= 0 || damageDone <= 0 || state.kills <= 0) {
      throw new Error(weaponId + " failed the real-damage opening pressure probe: " + JSON.stringify({ mode: state.mode, hp: state.hp, kills: state.kills, damageDone }));
    }
    return { weaponId, hp: state.hp, kills: state.kills, damageDone: Math.round(damageDone) };
  } finally {
    Math.random = originalRandom;
  }
}

const pressureProbes = ["marker", "thermos", "scissors", "correction_fluid"].map((weaponId, index) => runEarlyPressureProbe(weaponId, 2500 + index));
const v35PressureProbes = ["marker", "thermos", "scissors", "correction_fluid"].map((weaponId, index) => runEarlyPressureProbe(weaponId, 7500 + index, "four-weapon-v3-5"));
const v310PressureProbes = ["marker", "thermos", "scissors", "correction_fluid"].map((weaponId, index) => runEarlyPressureProbe(weaponId, 7500 + index, "four-weapon-v3-10"));
const v311PressureProbes = ["marker", "thermos", "scissors", "correction_fluid"].map((weaponId, index) => runEarlyPressureProbe(weaponId, 7500 + index, "four-weapon-v3-11"));
if (v311PressureProbes[0].kills < 14 || v311PressureProbes[1].kills < 14
  || v311PressureProbes[2].hp <= v310PressureProbes[2].hp + 20
  || v311PressureProbes[2].kills <= v310PressureProbes[2].kills
  || v311PressureProbes[3].kills <= v310PressureProbes[3].kills) {
  throw new Error("Demo V3.11 opening parity must retain leader throughput while materially improving Scissors/Correction: "
    + JSON.stringify({ v310PressureProbes, v311PressureProbes }));
}
const correctionV32Opening = runEarlyPressureProbe("correction_fluid", 6800, "four-weapon-v3-2");
const correctionV33Opening = runEarlyPressureProbe("correction_fluid", 6800, "four-weapon-v3-3");
if (correctionV33Opening.kills <= correctionV32Opening.kills || correctionV33Opening.damageDone <= correctionV32Opening.damageDone * 1.25) {
  throw new Error("Demo V3.3 must materially improve Correction Fluid opening throughput over V3.2: " + JSON.stringify({ correctionV32Opening, correctionV33Opening }));
}
const automatedRuns = [];
for (const weaponId of ["marker", "thermos", "scissors", "correction_fluid"]) {
  automatedRuns.push(runAutomatedFixedSuite(weaponId, 0, 2900 + automatedRuns.length));
  automatedRuns.push(runAutomatedFixedSuite(weaponId, 1, 3900 + automatedRuns.length));
}
const v35AutomatedRuns = ["marker", "thermos", "scissors", "correction_fluid"].map((weaponId, index) => runAutomatedFixedSuite(weaponId, index % 2, 8900 + index, "four-weapon-v3-5"));
const v311AutomatedRuns = ["marker", "thermos", "scissors", "correction_fluid"].map((weaponId, index) => runAutomatedFixedSuite(weaponId, index % 2, 12900 + index, "four-weapon-v3-11"));
const v312MarkerPressure = runEarlyPressureProbe("marker", 7500, "four-weapon-v3-12");
const v312MarkerRuns = [
  runAutomatedFixedSuite("marker", 0, 13900, "four-weapon-v3-12"),
  runAutomatedFixedSuite("marker", 1, 13901, "four-weapon-v3-12")
];
const v313RemainingRuns = [
  runAutomatedFixedSuite("thermos", 1, 12901, "four-weapon-v3-13"),
  runAutomatedFixedSuite("scissors", 0, 12902, "four-weapon-v3-13"),
  runAutomatedFixedSuite("correction_fluid", 1, 12903, "four-weapon-v3-13")
];
if (v312MarkerPressure.kills !== v311PressureProbes[0].kills
  || v312MarkerPressure.damageDone !== v311PressureProbes[0].damageDone) {
  throw new Error("Demo V3.12 must preserve the V3.11 Marker opening before its first module choice: "
    + JSON.stringify({ v311: v311PressureProbes[0], v312: v312MarkerPressure }));
}
console.log("OK Demo V2.9 pressure/flow audit: four real-damage openings and eight real-timer pure-route progression soaks completed", pressureProbes, automatedRuns);
console.log("OK Demo V3.5 pressure/flow audit: four moving real-damage openings and four complete sustained-pressure progression soaks completed", v35PressureProbes, v35AutomatedRuns);
console.log("OK Demo V3.11 pressure/flow audit: matched V3.10/V3.11 openings and four complete balance-pass progression soaks completed", v310PressureProbes, v311PressureProbes, v311AutomatedRuns);
console.log("OK Demo V3.12 pressure/flow audit: V3.11 opening parity and both pure Lv4 mastery routes complete all 17 encounters", v312MarkerPressure, v312MarkerRuns);
console.log("OK Demo V3.13 pressure/flow audit: Thermos, Scissors and Correction Fluid complete all 17 encounters with the extended desire-chain contract", v313RemainingRuns);
console.log("OK Demo V3.3 opening pressure: Correction Fluid materially exceeds its V3.2 first-stage throughput", correctionV32Opening, correctionV33Opening);
console.log("OK Demo V2.9 integration: four weapons share one selection/version and neon layer while retaining isolated mechanisms");

V2.dispatch({ type: "RESTART" });
V2.dispatch({ type: "INIT" });
const VISUAL_TIMELINE_STAGES = new Set(["anticipation", "release", "impact", "residual", "fade"]);
const visualSources = Object.keys(V2.weaponEventPhases || {});
if (!visualSources.length || visualSources.length !== Object.keys(V2.weaponVisualEvents || {}).length) {
  console.error("Weapon visual event map must cover every phase source", visualSources.length, Object.keys(V2.weaponVisualEvents || {}).length);
  process.exit(1);
}
for (const source of visualSources) {
  const visual = V2.getWeaponVisualEvent(source);
  if (!visual || !visual.family || !visual.topology || !visual.cue || !visual.role || !visual.palette || !Array.isArray(visual.timeline) || !visual.timeline.length) {
    console.error("Incomplete weapon visual event contract", source, visual);
    process.exit(1);
  }
  if (visual.topology === "impact_burst") {
    console.error("Registered weapon event fell back to a generic visual instead of an explicit mapping", source, visual);
    process.exit(1);
  }
  if (visual.timeline.some((stage) => !VISUAL_TIMELINE_STAGES.has(stage))) {
    console.error("Unknown weapon visual timeline stage", source, visual.timeline);
    process.exit(1);
  }
}
for (const signature of Object.values(V2.weaponFormSignatures || {})) {
  for (const source of signature.sources || []) {
    if (!V2.weaponVisualEvents[source]) {
      console.error("Form signature source lacks an explicit visual event mapping", source, signature);
      process.exit(1);
    }
  }
}
if (V2.getWeaponVisualEvent("marker_wave").cue === V2.getWeaponVisualEvent("marker_wave_return").cue
  || V2.getWeaponVisualEvent("thermos_release").topology === V2.getWeaponVisualEvent("thermos_warmup").topology
  || V2.getWeaponVisualEvent("sticky_notice_zone").topology === V2.getWeaponVisualEvent("sticky_notice_trap").topology
  || V2.getWeaponVisualEvent("support_marker").role !== "support") {
  console.error("Key weapon mechanics do not retain distinct visual readings");
  process.exit(1);
}
console.log(`OK visual event contract: ${visualSources.length} sources map to family, topology, role, cue and five-stage timelines`);
const AUDIO_STAGES = new Set(["anticipation", "release", "impact", "residual", "fade"]);
const audioSources = Object.keys(V2.weaponAudioEvents || {});
if (audioSources.length !== visualSources.length) {
  console.error("Weapon audio event map must cover every visual source", audioSources.length, visualSources.length);
  process.exit(1);
}
for (const source of visualSources) {
  const audio = V2.getWeaponAudioEvent(source);
  const visual = V2.getWeaponVisualEvent(source);
  const triggerStages = audio && Object.values(audio.triggers || {});
  if (!audio || !audio.family || !audio.role || !audio.voice || !Array.isArray(audio.timeline) || !audio.timeline.length || !triggerStages.length) {
    console.error("Incomplete weapon audio event contract", source, audio);
    process.exit(1);
  }
  if (audio.family !== visual.family || audio.role !== visual.role || !(audio.mix > 0) || !(audio.cooldown > 0) || triggerStages.some((stage) => !AUDIO_STAGES.has(stage))) {
    console.error("Weapon audio contract diverged from its visual source", source, audio, visual);
    process.exit(1);
  }
}
if (V2.getWeaponAudioEvent("marker_main").voice === V2.getWeaponAudioEvent("thermos_release").voice
  || V2.getWeaponAudioEvent("thermos_release").voice === V2.getWeaponAudioEvent("sticky_base").voice
  || V2.getWeaponAudioEvent("support_marker").mix >= V2.getWeaponAudioEvent("marker_main").mix) {
  console.error("Key weapon families or support layer do not retain distinct audio readings");
  process.exit(1);
}
console.log(`OK audio event contract: ${audioSources.length} sources map to family, voice, role, stage, cooldown and mix`);
const phaseKeys = ["weapon_intro", "promotion", "promoted_mastery", "cross_department", "cross_weapon"];
if (Object.keys(V2.musicScenes || {}).length !== 10) {
  console.error("Music contract must define normal and boss scenes for all five phases", Object.keys(V2.musicScenes || {}));
  process.exit(1);
}
for (const phase of phaseKeys) {
  const normal = V2.audio.getMusicScene(phase + ":normal");
  const boss = V2.audio.getMusicScene(phase + ":boss");
  if (!normal || !boss || !normal.label || !boss.label || !Array.isArray(normal.pattern) || normal.pattern.length < 8 || !Array.isArray(boss.pattern) || boss.pattern.length < 8 || !(boss.bpm > normal.bpm)) {
    console.error("Incomplete or non-escalating phase music contract", phase, normal, boss);
    process.exit(1);
  }
}
V2.audio.syncMusic({ mode: "combat", stage: { phaseKey: "cross_weapon", boss: true } });
if (V2.audio.getStatus().musicScene !== "cross_weapon:boss" || V2.audio.getStatus().musicVariant !== "boss") {
  console.error("Music state did not follow the active phase and boss flag", V2.audio.getStatus());
  process.exit(1);
}
console.log("OK music contract: five phase themes each expose distinct normal and faster boss arrangements");
if (!Array.isArray(V2.runPhases) || V2.runPhases.length !== 5) {
  console.error("Run phase map should define exactly 5 macro phases");
  process.exit(1);
}
if (V2.runPhases[0].key !== "weapon_intro" || V2.runPhases[1].key !== "promotion") {
  console.error("First two playable phases should be weapon_intro then promotion");
  process.exit(1);
}
if (V2.runPhases[2].status !== "playable" || V2.runPhases[3].status !== "playable" || V2.runPhases[4].status !== "playable") {
  console.error("All five macro phases should be active in the V2 vertical slice");
  process.exit(1);
}

function assertSlotMutation(label, weaponId, dept, stageId, slotId, action, predicate) {
  sandbox.GameV2.startRun({ weaponId });
  sandbox.GameV2.dispatch({ type: "SET_BADGE", dept });
  const state = sandbox.GameV2.getState();
  state.stage.id = 3 + stageId;
  state.stage.phaseKey = "promotion";
  state.stage.phaseStep = stageId;
  state.slotChoices = V2.progression.makeSlotChoices(state);
  sandbox.GameV2.dispatch({ type: "SELECT_SLOT", slotId, action: action || "replace" });
  if (!predicate(state.activeFormParams, state)) {
    console.error("Slot mutation failed:", label, JSON.stringify(state.activeFormParams));
    process.exit(1);
  }
  console.log("OK slot:", label);
}

assertSlotMutation("marker tech mechanic enables secondary split", "marker", "tech", 6, "mechanic", "replace", (p) => p.secondarySplit === true);
assertSlotMutation("marker product offense expands P0 blast", "marker", "product", 2, "offense", "replace", (p) => p.explosionRadius > 58);
assertSlotMutation("thermos product offense widens release", "thermos", "product", 2, "offense", "replace", (p) => p.releaseWidth > 20 || p.releaseDamage > 72);
assertSlotMutation("sticky admin mechanic widens link radius", "sticky_note", "general", 6, "mechanic", "replace", (p) => p.linkRadius > 170);
assertSlotMutation("thermos tech mechanic adds patrol module", "thermos", "tech", 6, "mechanic", "replace", (p) => p.summonCount > 1);
assertSlotMutation("thermos marketing mechanic adds heat wave", "thermos", "marketing", 6, "mechanic", "replace", (p) => p.waveCount > 1 && p.teaRadius > 96);
assertSlotMutation("sticky ops survival improves safe route", "sticky_note", "ops", 3, "survival", "replace", (p) => p.shieldGain > 3 && p.routeHeal > 0.7);
assertSlotMutation("sticky marketing mechanic expands spread chain", "sticky_note", "marketing", 6, "mechanic", "replace", (p) => p.spreadLimit > 3 && p.spreadRadius > 120);

function assertCombatEvent(label, weaponId, dept, setup, predicate) {
  sandbox.GameV2.startRun({ weaponId });
  sandbox.GameV2.dispatch({ type: "SET_BADGE", dept });
  const state = sandbox.GameV2.getState();
  state.mode = "combat";
  state.enemies = [{ id: "test_enemy", x: 760, y: 360, r: 13, hp: 80, maxHp: 80, speed: 0, damage: 0, xp: 0, dead: false }];
  setup(state);
  V2.combat.fireWeapon(state);
  if (!predicate(state)) {
    console.error("Combat event failed:", label, JSON.stringify({ zones: state.damageZones, events: state.formEvents, enemy: state.enemies[0] }));
    process.exit(1);
  }
  if (!state.stats.audioEvents || !state.stats.audioEvents.length || state.stats.audioEvents.some((event) => !event.source || !event.voice || !event.stage || !event.reason)) {
    console.error("Combat event did not reach the audio event audit:", label, JSON.stringify(state.stats.audioEvents));
    process.exit(1);
  }
  console.log("OK combat:", label);
}
const stageBlueprints = V2.store.stageBlueprints;
const normalStages = stageBlueprints.filter((stage) => !stage.boss);
const bossStages = stageBlueprints.filter((stage) => stage.boss);
if (normalStages.some((stage) => stage.duration < 30 || stage.duration > 65 || stage.targetKills < 20 || stage.targetKills > 80)
  || bossStages.some((stage) => !(stage.bossHitCap > 0 && stage.bossHitCap <= 0.16))) {
  console.error("Stage pacing contract is outside the Demo V1 target window", stageBlueprints);
  process.exit(1);
}
console.log("OK pacing contract: normal stages stay concise and all five bosses use burst-resilience caps");

assertCombatEvent("thermos tech spawns orbiting steam module", "thermos", "tech", (s) => { s.activeFormParams.heat = 100; }, (s) => s.damageZones.some(z => z.visual === "thermos_drone_module" && z.orbitPlayer && z.droneModule));
assertCombatEvent("thermos ops creates shield event", "thermos", "ops", () => {}, (s) => s.formEvents.some(e => e.kind === "shield"));
assertCombatEvent("sticky tech creates one-shot seeking note", "sticky_note", "tech", () => {}, (s) => s.damageZones.some(z => z.visual === "seeking_note" && z.seekingSticky && z.damage === 0 && z.triggerDamage > 0));
assertCombatEvent("sticky marketing attaches spread debuff", "sticky_note", "marketing", () => {}, (s) => !!s.enemies[0].stickyDebuff);

function assertInternCombatEvent(label, weaponId, setup, predicate) {
  sandbox.GameV2.startRun({ weaponId });
  const state = sandbox.GameV2.getState();
  state.mode = "combat";
  state.enemies = [{ id: "test_enemy", x: 760, y: 360, r: 13, hp: 120, maxHp: 120, speed: 0, damage: 0, xp: 0, dead: false }];
  setup(state);
  V2.combat.fireWeapon(state);
  if (!predicate(state)) {
    console.error("Intern combat event failed:", label, JSON.stringify({ zones: state.damageZones, events: state.formEvents, damage: state.stats.damageDone, enemy: state.enemies[0] }));
    process.exit(1);
  }
  console.log("OK intern combat:", label);
}

assertInternCombatEvent("thermos intern heat releases boiling beam", "thermos", (s) => { s.activeFormParams.heat = 100; }, (s) => (s.stats.damageDone.thermos_intern_release || 0) > 0);
assertCombatEvent("sticky admin pins priority target", "sticky_note", "general", () => {}, (s) => (s.stats.damageDone.sticky_notice_pin || 0) > 0);

function assertPromotionTiming(label, weaponId, dept, predicate) {
  sandbox.GameV2.startRun({ weaponId });
  sandbox.GameV2.dispatch({ type: "SET_BADGE", dept });
  const state = sandbox.GameV2.getState();
  state.mode = "combat";
  state.stageIndex = 3;
  state.stage = { id: 4, phaseKey: "promotion", phaseStep: 1, phase: "转正期", name: "工牌定型", duration: 52, targetKills: 40, material: 11 };
  state.stageTime = 58;
  state.stageKills = 0;
  if (state.flags.promoted || state.activeFormParams.promoted) {
    console.error("Promotion should not happen on entering stage:", label);
    process.exit(1);
  }
  sandbox.GameV2.dispatch({ type: "COMPLETE_STAGE" });
  if (state.flags.promoted || state.activeFormParams.promoted || state.mode !== "slot_select") {
    console.error("Promotion should not happen after a non-final promotion stage:", label, JSON.stringify({
      mode: state.mode,
      promoted: state.flags.promoted,
      params: state.activeFormParams
    }));
    process.exit(1);
  }
  state.mode = "combat";
  state.stageIndex = 6;
  state.stage = { id: 7, phaseKey: "promotion", phaseStep: 4, phaseFinal: true, phase: "转正期", name: "转正评审", duration: 68, targetKills: 1, material: 22 };
  if (!state.flags.promoted || !state.activeFormParams.promoted || state.mode !== "armory" || !predicate(state.activeFormParams, state)) {
    sandbox.GameV2.dispatch({ type: "COMPLETE_STAGE" });
  }
  if (!state.flags.promoted || !state.activeFormParams.promoted || state.mode !== "armory" || !predicate(state.activeFormParams, state)) {
    console.error("Promotion timing failed:", label, JSON.stringify({
      mode: state.mode,
      promoted: state.flags.promoted,
      params: state.activeFormParams,
      log: state.promotionLog
    }));
    process.exit(1);
  }
  console.log("OK promotion:", label);
}

assertPromotionTiming("marker tech promotes after stage completion", "marker", "tech", (p) => p.promotionFullscreenEvery === 6 && p.secondarySplit === true);
assertPromotionTiming("thermos product promotes after stage completion", "thermos", "product", (p) => p.releaseDamage > 72 && p.releaseWidth > 22);
assertPromotionTiming("sticky admin promotes after stage completion", "sticky_note", "general", (p) => p.linkRadius > 170 && p.zoneDamage > 9);

function assertFullPromotionLoop(label, weaponId, dept, slotId, predicate) {
  sandbox.GameV2.startRun({ weaponId });
  let state = sandbox.GameV2.getState();
  sandbox.GameV2.dispatch({ type: "COMPLETE_STAGE" });
  if (state.mode !== "armory" || state.badgeDept || state.flags.promoted) {
    console.error("Expected armory after weapon intro stage 1:", label, state.mode);
    process.exit(1);
  }
  sandbox.GameV2.dispatch({ type: "CONTINUE_NEXT_STAGE" });
  if (state.stage.id !== 2 || state.badgeDept || state.flags.promoted) {
    console.error("Expected weapon intro stage 2 without badge:", label, state.stage.id, state.badgeDept, state.flags.promoted);
    process.exit(1);
  }
  sandbox.GameV2.dispatch({ type: "COMPLETE_STAGE" });
  if (state.mode !== "armory") {
    console.error("Expected armory after weapon intro stage 2:", label, state.mode);
    process.exit(1);
  }
  sandbox.GameV2.dispatch({ type: "CONTINUE_NEXT_STAGE" });
  if (state.stage.id !== 3 || state.badgeDept || state.flags.promoted) {
    console.error("Expected weapon intro final stage without badge:", label, state.stage.id, state.badgeDept, state.flags.promoted);
    process.exit(1);
  }
  sandbox.GameV2.dispatch({ type: "COMPLETE_STAGE" });
  if (state.mode !== "badge_select") {
    console.error("Expected badge select after weapon intro final:", label, state.mode);
    process.exit(1);
  }
  sandbox.GameV2.dispatch({ type: "SET_BADGE", dept });
  if (state.mode !== "armory") {
    console.error("Expected armory after badge selection:", label, state.mode);
    process.exit(1);
  }
  sandbox.GameV2.dispatch({ type: "CONTINUE_NEXT_STAGE" });
  if (state.stage.id !== 4 || state.flags.promoted) {
    console.error("Expected entering promotion stage 1 without promotion:", label, state.stage.id, state.flags.promoted);
    process.exit(1);
  }
  sandbox.GameV2.dispatch({ type: "COMPLETE_STAGE" });
  if (state.mode !== "slot_select" || state.flags.promoted) {
    console.error("Expected slot select after promotion stage 1:", label, state.mode, state.flags.promoted);
    process.exit(1);
  }
  sandbox.GameV2.dispatch({ type: "SELECT_SLOT", slotId: "offense", action: "replace" });
  sandbox.GameV2.dispatch({ type: "CONTINUE_NEXT_STAGE" });
  if (state.stage.id !== 5 || state.flags.promoted) {
    console.error("Expected promotion stage 2 without promotion:", label, state.stage.id, state.flags.promoted);
    process.exit(1);
  }
  sandbox.GameV2.dispatch({ type: "COMPLETE_STAGE" });
  if (state.mode !== "slot_select" || state.flags.promoted) {
    console.error("Expected slot select after promotion stage 2:", label, state.mode, state.flags.promoted);
    process.exit(1);
  }
  sandbox.GameV2.dispatch({ type: "SELECT_SLOT", slotId: "survival", action: "replace" });
  sandbox.GameV2.dispatch({ type: "CONTINUE_NEXT_STAGE" });
  if (state.stage.id !== 6 || state.flags.promoted) {
    console.error("Expected promotion stage 3 without promotion:", label, state.stage.id, state.flags.promoted);
    process.exit(1);
  }
  sandbox.GameV2.dispatch({ type: "COMPLETE_STAGE" });
  if (state.mode !== "slot_select" || state.flags.promoted) {
    console.error("Expected slot select after promotion stage 3:", label, state.mode, state.flags.promoted);
    process.exit(1);
  }
  sandbox.GameV2.dispatch({ type: "SELECT_SLOT", slotId, action: "replace" });
  sandbox.GameV2.dispatch({ type: "CONTINUE_NEXT_STAGE" });
  if (state.stage.id !== 7 || state.flags.promoted) {
    console.error("Expected promotion review without reward yet:", label, state.stage.id, state.flags.promoted);
    process.exit(1);
  }
  sandbox.GameV2.dispatch({ type: "COMPLETE_STAGE" });
  if (!state.flags.promoted || state.mode !== "armory" || !predicate(state.activeFormParams, state)) {
    console.error("Expected promotion reward after promotion review completion:", label, JSON.stringify({
      mode: state.mode,
      stage: state.stage.id,
      promoted: state.flags.promoted,
      params: state.activeFormParams,
      log: state.promotionLog
    }));
    process.exit(1);
  }
  console.log("OK loop:", label);
}

assertFullPromotionLoop("marker full loop reaches promotion reward", "marker", "tech", "mechanic", (p) => p.promotionFullscreenEvery === 6);
assertFullPromotionLoop("thermos full loop reaches promotion reward", "thermos", "product", "offense", (p) => p.releaseDamage > 72 && p.overheatBank === true);
assertFullPromotionLoop("sticky full loop reaches promotion reward", "sticky_note", "general", "mechanic", (p) => p.linkRadius > 170 && p.zoneDamage > 9);

function assertSupportWeaponChoices(label, weaponId) {
  sandbox.GameV2.startRun({ weaponId });
  const state = sandbox.GameV2.getState();
  state.mode = "support_weapon_select";
  const choices = V2.getViewModel("support_weapon_select").map((item) => item.id);
  if (choices.includes(weaponId) || choices.length !== 2) {
    console.error("Support weapon choices should exclude current main weapon:", label, choices);
    process.exit(1);
  }
  console.log("OK support choices:", label, choices.join(", "));
}

assertSupportWeaponChoices("marker can only borrow thermos/sticky", "marker");
assertSupportWeaponChoices("thermos can only borrow marker/sticky", "thermos");
assertSupportWeaponChoices("sticky can only borrow marker/thermos", "sticky_note");

function assertFullFivePhaseLoop(label, weaponId, dept, secondaryDept, supportWeaponId, predicate) {
  sandbox.GameV2.startRun({ weaponId });
  const state = sandbox.GameV2.getState();
  sandbox.GameV2.dispatch({ type: "SET_BADGE", dept });

  state.mode = "combat";
  state.stageIndex = 6;
  state.stage = { id: 7, phaseKey: "promotion", phaseStep: 4, phaseFinal: true, phase: "转正期", name: "转正评审", duration: 68, targetKills: 1, material: 22 };
  sandbox.GameV2.dispatch({ type: "COMPLETE_STAGE" });
  if (!state.flags.promoted || state.mode !== "armory") {
    console.error("Expected promotion reward before mastery:", label, state.mode, state.flags);
    process.exit(1);
  }

  state.mode = "combat";
  state.stageIndex = 9;
  state.stage = { id: 10, phaseKey: "promoted_mastery", phaseStep: 3, phaseFinal: true, phase: "独当一面", name: "独立交付", duration: 76, targetKills: 1, material: 26 };
  sandbox.GameV2.dispatch({ type: "COMPLETE_STAGE" });
  if (!state.flags.mastered || state.mode !== "secondary_badge_select") {
    console.error("Expected mastery then secondary badge select:", label, state.mode, state.flags);
    process.exit(1);
  }

  sandbox.GameV2.dispatch({ type: "SET_SECONDARY_BADGE", dept: secondaryDept });
  if (!state.flags.crossDepartment || state.secondaryBadgeDept !== secondaryDept || state.mode !== "armory") {
    console.error("Expected secondary department ability:", label, state.mode, state.secondaryBadgeDept, state.flags);
    process.exit(1);
  }

  state.mode = "combat";
  state.stageIndex = 12;
  state.stage = { id: 13, phaseKey: "cross_department", phaseStep: 3, phaseFinal: true, phase: "跨部门协作", name: "联合评审", duration: 82, targetKills: 1, material: 30 };
  sandbox.GameV2.dispatch({ type: "COMPLETE_STAGE" });
  if (state.mode !== "support_weapon_select") {
    console.error("Expected support weapon select:", label, state.mode);
    process.exit(1);
  }

  sandbox.GameV2.dispatch({ type: "SET_SUPPORT_WEAPON", weaponId: supportWeaponId });
  if (!state.flags.crossWeapon || state.supportWeaponId !== supportWeaponId || !state.supportSkill || state.mode !== "armory") {
    console.error("Expected cross weapon support:", label, state.mode, state.supportWeaponId, state.supportSkill, state.flags);
    process.exit(1);
  }

  state.mode = "combat";
  state.stageIndex = 15;
  state.stage = { id: 16, phaseKey: "cross_weapon", phaseStep: 3, phaseFinal: true, phase: "跨技能学习", name: "最终形态验证", duration: 88, targetKills: 1, material: 36 };
  sandbox.GameV2.dispatch({ type: "COMPLETE_STAGE" });
  if (!state.flags.won || state.mode !== "result" || !predicate(state.activeFormParams, state)) {
    console.error("Expected final form result:", label, JSON.stringify({
      mode: state.mode,
      flags: state.flags,
      params: state.activeFormParams,
      secondary: state.secondaryBadgeDept,
      support: state.supportSkill
    }));
    process.exit(1);
  }
  console.log("OK five-phase:", label);
}

assertFullFivePhaseLoop("marker reaches final form with product plus tech mix", "marker", "product", "tech", "thermos", (p, s) => p.p0Chain && p.crossSplit && s.supportSkill.type === "support_thermos_pulse");
assertFullFivePhaseLoop("thermos reaches final form with product plus ops mix", "thermos", "product", "ops", "sticky_note", (p, s) => p.releaseWidth > 22 && p.crossWarmShield && s.supportSkill.type === "support_sticky_trap");
assertFullFivePhaseLoop("sticky reaches final form with admin plus marketing mix", "sticky_note", "general", "marketing", "marker", (p, s) => p.crossStickySpread && p.linkRadius > 170 && s.supportSkill.type === "support_marker_line");

const CORE_WEAPONS = ["marker", "thermos", "sticky_note"];
const CORE_DEPTS = ["tech", "product", "ops", "marketing", "general"];
const SLOT_IDS = ["offense", "survival", "resource", "mechanic", "cost"];
const COMBAT_PARAM_KEYS = new Set([
  "damage", "cooldown", "splitCount", "splitDamage", "shieldPerHit", "materialBonus", "secondarySplit",
  "risk", "explosionRadius", "explosionDamage", "shieldOnDetonate", "markWindow", "splashRefreshMark",
  "pauseAfterBlast", "counterLines", "counterDamage", "waveCount", "waveKnockback", "xpBonus", "waveReturn",
  "waveRadius", "waveDamage", "gridDamage", "gridSlow", "trailDuration", "gridEcho", "releaseWidth",
  "releaseDamage", "shieldAfterRelease", "overheatBank", "heatMax", "pulseDamage", "shieldGain", "pulseCount",
  "stationPulseDamage", "heal", "stationLimit", "stationRadius", "stationDuration", "trapDuration", "zoneDamage", "slow",
  "linkRadius", "blastKnockback", "chainDetonate", "seekSpeed", "seekBounce", "summonCount", "steamRadius",
  "summonDuration", "teaRadius", "teaDamage", "routeHeal", "spreadDamage", "spreadLimit", "spreadRadius",
  "promotionFullscreenEvery", "orbitSpeed", "heatRate", "shieldThreshold", "p0Chain"
]);

function changedMechanicalKeys(before, after, ignored) {
  const ignore = new Set(ignored || []);
  return Array.from(new Set(Object.keys(before).concat(Object.keys(after)))).filter((key) => {
    if (ignore.has(key)) return false;
    return JSON.stringify(before[key]) !== JSON.stringify(after[key]);
  });
}

const COST_DOWNSIDES = {
  line_split: (b, a) => a.cooldown > b.cooldown,
  mark_detonate: (b, a) => a.risk > (b.risk || 0),
  shield_counter_line: (b, a) => a.shieldPerHit < b.shieldPerHit,
  line_to_wave: (b, a) => a.damage < b.damage,
  line_grid_field: (b, a) => a.damage < b.damage,
  patrol_summon_steam: (b, a) => a.cooldown > b.cooldown,
  charge_release_beam: (b, a) => a.cooldown > b.cooldown,
  shield_break_pulse: (b, a) => a.shieldGain < b.shieldGain,
  periodic_wave_spread: (b, a) => a.cooldown > b.cooldown,
  deployable_safe_station: (b, a) => a.risk > (b.risk || 0),
  seeking_trap_summon: (b, a) => a.trapDuration < b.trapDuration,
  manual_trap_detonate: (b, a) => a.trapDuration < b.trapDuration,
  route_buff_trap: (b, a) => a.damage < b.damage,
  sticky_debuff_spread: (b, a) => a.damage < b.damage,
  trap_link_control_zone: (b, a) => a.trapDuration < b.trapDuration
};

for (const weaponId of CORE_WEAPONS) {
  for (const dept of CORE_DEPTS) {
    for (const slotId of SLOT_IDS) {
      sandbox.GameV2.startRun({ weaponId });
      sandbox.GameV2.dispatch({ type: "SET_BADGE", dept });
      const state = sandbox.GameV2.getState();
      state.stage = { id: 6, phaseKey: "promotion", phaseStep: 4 };
      const before = JSON.parse(JSON.stringify(state.activeFormParams));
      if (!V2.progression.applySlotChoice(state, slotId, "replace")) {
        console.error("All form slots must be selectable at promotion step 4", weaponId, dept, slotId);
        process.exit(1);
      }
      const after = state.activeFormParams;
      const changed = changedMechanicalKeys(before, after);
      if (!changed.some((key) => COMBAT_PARAM_KEYS.has(key))) {
        console.error("Slot did not change a combat-consumed parameter", weaponId, dept, slotId, changed);
        process.exit(1);
      }
      if (slotId === "cost" && (!COST_DOWNSIDES[state.activeForm.mechanicType] || !COST_DOWNSIDES[state.activeForm.mechanicType](before, after))) {
        console.error("Cost slot must contain a real downside", weaponId, dept, state.activeForm.mechanicType, before, after);
        process.exit(1);
      }
    }
  }
}
console.log("OK enhancement matrix: all 75 form-slot combinations mutate combat-consumed parameters and all 15 cost slots have real downsides");

for (const weaponId of CORE_WEAPONS) {
  for (const dept of CORE_DEPTS) {
    sandbox.GameV2.startRun({ weaponId });
    sandbox.GameV2.dispatch({ type: "SET_BADGE", dept });
    const state = sandbox.GameV2.getState();
    state.stage = { id: 7, phaseKey: "promotion", phaseFinal: true };
    const beforePromotion = JSON.parse(JSON.stringify(state.activeFormParams));
    if (!V2.progression.applyPromotion(state)) {
      console.error("Missing promotion rule", weaponId, dept, state.activeForm.mechanicType);
      process.exit(1);
    }
    const promotionKeys = changedMechanicalKeys(beforePromotion, state.activeFormParams, ["promoted"]);
    if (!promotionKeys.some((key) => COMBAT_PARAM_KEYS.has(key))) {
      console.error("Promotion lacks a real mechanic/stat reinforcement", weaponId, dept, promotionKeys);
      process.exit(1);
    }
    state.stage = { id: 10, phaseKey: "promoted_mastery", phaseFinal: true };
    const beforeMastery = JSON.parse(JSON.stringify(state.activeFormParams));
    if (!V2.progression.applyMastery(state)) {
      console.error("Missing mastery rule", weaponId, dept, state.activeForm.mechanicType);
      process.exit(1);
    }
    const masteryKeys = changedMechanicalKeys(beforeMastery, state.activeFormParams, ["mastered"]);
    if (!masteryKeys.some((key) => COMBAT_PARAM_KEYS.has(key))) {
      console.error("Mastery lacks a real mechanic/stat reinforcement", weaponId, dept, masteryKeys);
      process.exit(1);
    }
  }
}
console.log("OK enhancement matrix: all 15 promotion rules and all 15 mastery rules change combat-consumed behavior");

for (const weaponId of CORE_WEAPONS) {
  for (const dept of CORE_DEPTS) {
    sandbox.GameV2.startRun({ weaponId });
    sandbox.GameV2.dispatch({ type: "SET_BADGE", dept });
    const state = sandbox.GameV2.getState();
    state.stage = { id: 6, phaseKey: "promotion", phaseStep: 4 };
    V2.progression.applySlotChoice(state, "resource", "replace");
    const sources = V2.combat.qa.resourceSources[state.activeForm.mechanicType] || [];
    if (!sources.length || V2.combat.qa.resourceSourceMatches(state, "generic_main_attack") || !V2.combat.qa.resourceSourceMatches(state, sources[0])) {
      console.error("Resource slot source contract missing", weaponId, dept, state.activeForm.mechanicType, sources);
      process.exit(1);
    }
    const savedRandom = sandbox.Math.random;
    sandbox.Math.random = () => 0.4;
    state.pickups = [];
    V2.combat.qa.damageEnemy(state, { id: "generic", x: 500, y: 360, r: 12, hp: 1, maxHp: 1, xp: 10, dead: false }, 2, "generic_main_attack");
    if (state.pickups.some((item) => item.type === "material") || state.pickups.find((item) => item.type === "xp").amount !== 10) {
      console.error("Resource slot leaked onto unrelated kills", weaponId, dept, state.pickups);
      process.exit(1);
    }
    state.pickups = [];
    V2.combat.qa.damageEnemy(state, { id: "matching", x: 500, y: 360, r: 12, hp: 1, maxHp: 1, xp: 10, dead: false }, 2, sources[0]);
    const materialExpected = (state.activeFormParams.materialBonus || 0) > 0;
    const materialFound = state.pickups.some((item) => item.type === "material");
    const matchingXp = state.pickups.find((item) => item.type === "xp").amount;
    if (materialExpected !== materialFound || ((state.activeFormParams.xpBonus || 0) > 0 ? matchingXp <= 10 : matchingXp !== 10)) {
      console.error("Resource slot did not reward its own mechanism", weaponId, dept, sources[0], state.pickups, state.activeFormParams);
      process.exit(1);
    }
    sandbox.Math.random = savedRandom;
  }
}
console.log("OK resource matrix: all 15 resource slots reward only their matching damage sources");

function testEnemy(id, x, y) {
  return { id, x, y, r: 13, hp: 600, maxHp: 600, speed: 0, damage: 0, xp: 0, dead: false };
}

function sourceSeen(state, source) {
  return state.stats.weaponEvents.some((event) => event.source === source)
    || state.damageZones.some((zone) => zone.source === source)
    || (state.stats.damageDone[source] || 0) > 0;
}

const CROSS_EXPECTATIONS = {
  marker: {
    tech: (s) => sourceSeen(s, "secondary_split"),
    product: (s) => sourceSeen(s, "secondary_marker_blast"),
    ops: (s) => sourceSeen(s, "secondary_shield_charge") && sourceSeen(s, "secondary_counter"),
    marketing: (s) => sourceSeen(s, "secondary_marker_wave"),
    general: (s) => sourceSeen(s, "secondary_marker_grid")
  },
  thermos: {
    tech: (s) => s.damageZones.some((z) => z.source === "thermos_drone" && z.droneModule),
    product: (s) => sourceSeen(s, "secondary_thermos_boil"),
    ops: (s) => sourceSeen(s, "secondary_thermos_shield_charge") && sourceSeen(s, "secondary_thermos_shield_break"),
    marketing: (s) => sourceSeen(s, "secondary_thermos_tea_wave"),
    general: (s) => sourceSeen(s, "secondary_thermos_station")
  },
  sticky_note: {
    tech: (s) => s.damageZones.some((z) => z.source === "secondary_sticky_seeking" && z.seekingSticky),
    product: (s) => sourceSeen(s, "secondary_sticky_blast"),
    ops: (s) => s.damageZones.some((z) => z.source === "secondary_sticky_route" && z.routeSticky),
    marketing: (s) => s.enemies.some((enemy) => !!enemy.stickyDebuff),
    general: (s) => s.damageZones.some((z) => z.source === "secondary_sticky_notice" && z.type === "polygon")
  }
};

for (const weaponId of CORE_WEAPONS) {
  for (const secondaryDept of CORE_DEPTS) {
    const primaryDept = CORE_DEPTS.find((dept) => dept !== secondaryDept);
    sandbox.GameV2.startRun({ weaponId });
    sandbox.GameV2.dispatch({ type: "SET_BADGE", dept: primaryDept });
    const state = sandbox.GameV2.getState();
    state.mode = "combat";
    state.enemies = [
      testEnemy("main-a", 550, 360),
      testEnemy("main-b", 640, 360),
      testEnemy("branch-a", 560, 430),
      testEnemy("branch-b", 650, 450)
    ];
    V2.progression.applyCrossDepartment(state, secondaryDept);
    V2.combat.fireWeapon(state);
    if (secondaryDept === "ops" && (weaponId === "marker" || weaponId === "thermos")) {
      V2.combat.damagePlayer(state, (state.activeFormParams.shield || 0) + 1, "#ff8a7a");
    }
    if (!CROSS_EXPECTATIONS[weaponId][secondaryDept](state)) {
      console.error("Cross-department mechanic did not produce its real secondary behavior", weaponId, primaryDept, secondaryDept, JSON.stringify({ params: state.activeFormParams, zones: state.damageZones, events: state.stats.weaponEvents }));
      process.exit(1);
    }
  }
}
console.log("OK cross-department matrix: all 15 department overlays create their real secondary mechanism");

for (const mainWeapon of CORE_WEAPONS) {
  for (const supportWeapon of CORE_WEAPONS.filter((weapon) => weapon !== mainWeapon)) {
    sandbox.GameV2.startRun({ weaponId: mainWeapon });
    const state = sandbox.GameV2.getState();
    state.mode = "combat";
    state.enemies = [testEnemy("support-target", 496, 360)];
    V2.progression.applyCrossWeapon(state, supportWeapon);
    V2.combat.qa.fireSupportSkill(state);
    if (supportWeapon === "thermos") V2.combat.qa.updateZones(state, 0.52);
    if (supportWeapon === "sticky_note") {
      V2.combat.qa.updateZones(state, 0.34);
      V2.combat.qa.updateZones(state, 0.02);
    }
    const passed = supportWeapon === "marker" ? sourceSeen(state, "support_marker")
      : supportWeapon === "thermos" ? sourceSeen(state, "support_thermos_wave") && (state.stats.damageDone.support_thermos_wave || 0) > 0
        : sourceSeen(state, "support_sticky_trap") && sourceSeen(state, "support_sticky_trigger");
    if (!passed) {
      console.error("Cross-weapon support lost the borrowed weapon's core verb", mainWeapon, supportWeapon, JSON.stringify({ zones: state.damageZones, damage: state.stats.damageDone, events: state.stats.weaponEvents }));
      process.exit(1);
    }
  }
}
console.log("OK cross-weapon matrix: all 6 valid main/support pairs preserve the borrowed weapon core verb");

console.log("\nALL TESTS PASSED");
