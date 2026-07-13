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
