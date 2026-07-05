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
console.log(`\n=== ${results.length} V2 builds tested ===`);
for (const r of results) {
  console.log(`${r.clearedAll ? "OK" : "FAIL"} ${r.name} | ${r.form} | ${r.mechanicType} | slots ${r.slots}`);
}
if (failed.length) {
  console.error("Failed builds:", failed.map((r) => r.name).join(", "));
  process.exit(1);
}

const V2 = sandbox.CS.V2;
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
  console.log("OK combat:", label);
}

assertCombatEvent("thermos tech spawns orbiting steam module", "thermos", "tech", (s) => { s.activeFormParams.heat = 100; }, (s) => s.damageZones.some(z => z.visual === "steam_drone" && z.orbitPlayer));
assertCombatEvent("thermos ops creates shield event", "thermos", "ops", () => {}, (s) => s.formEvents.some(e => e.kind === "shield"));
assertCombatEvent("sticky tech creates seeking note", "sticky_note", "tech", () => {}, (s) => s.damageZones.some(z => z.visual === "seeking_note" && z.seek));
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

assertPromotionTiming("marker tech promotes after stage completion", "marker", "tech", (p) => p.promotionFullscreenChance >= 0.1 && p.secondarySplit === true);
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

assertFullPromotionLoop("marker full loop reaches promotion reward", "marker", "tech", "mechanic", (p) => p.promotionFullscreenChance >= 0.1);
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

console.log("\nALL TESTS PASSED");
