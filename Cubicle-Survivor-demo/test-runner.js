const fs = require("fs");
const path = require("path");
const vm = require("vm");

const baseDir = __dirname;

function makeElement() {
  return {
    style: {},
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
if (!combatVisualSource.includes('drawSpriteFrame(ctx, "scissors_slash_v24"')
  || combatVisualSource.includes('drawSpriteFrame(ctx, "scissors_strike_v27"')) {
  console.error("Scissors attacks must use the held-body plus rooted slash arc, not a second full-scissor strike sprite");
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

function runAutomatedFixedSuite(weaponId, routeIndex, seed) {
  const originalRandom = Math.random;
  Math.random = makeSeededRandom(seed);
  try {
    V2.dispatch({ type: "RESTART" });
    V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-fixed" });
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
    return { weaponId, routeIndex, hp: state.hp, kills: state.kills, level: state.level, components: runtime.componentsBought };
  } finally {
    Math.random = originalRandom;
  }
}

function runEarlyPressureProbe(weaponId, seed) {
  const originalRandom = Math.random;
  Math.random = makeSeededRandom(seed);
  try {
    V2.dispatch({ type: "RESTART" });
    V2.dispatch({ type: "INIT", demoV2Phase: "four-weapon-fixed" });
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
const automatedRuns = [];
for (const weaponId of ["marker", "thermos", "scissors", "correction_fluid"]) {
  automatedRuns.push(runAutomatedFixedSuite(weaponId, 0, 2900 + automatedRuns.length));
  automatedRuns.push(runAutomatedFixedSuite(weaponId, 1, 3900 + automatedRuns.length));
}
console.log("OK Demo V2.9 pressure/flow audit: four real-damage openings and eight real-timer pure-route progression soaks completed", pressureProbes, automatedRuns);
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
