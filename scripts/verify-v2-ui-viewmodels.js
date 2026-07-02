const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");

function makeElement() {
  return {
    style: { setProperty() {} },
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    dataset: {},
    textContent: "",
    innerHTML: "",
    onclick: null,
    setAttribute() {},
    getAttribute() { return null; },
    addEventListener() {},
    querySelectorAll() { return []; }
  };
}

const elements = {};
const canvas = Object.assign(makeElement(), {
  getContext() {
    return {
      fillRect() {}, clearRect() {}, strokeRect() {}, save() {}, restore() {}, translate() {},
      drawImage() {}, beginPath() {}, arc() {}, fill() {}, stroke() {}, moveTo() {}, lineTo() {},
      createLinearGradient() { return { addColorStop() {} }; },
      createRadialGradient() { return { addColorStop() {} }; },
      fillText() {}, measureText() { return { width: 0 }; }
    };
  }
});

const sandbox = {
  window: {},
  document: {
    readyState: "complete",
    getElementById(id) {
      if (id === "game") return canvas;
      if (!elements[id]) elements[id] = makeElement();
      return elements[id];
    },
    querySelector() { return makeElement(); },
    querySelectorAll() { return []; },
    addEventListener() {},
    body: makeElement(),
    head: makeElement()
  },
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  console,
  setTimeout() { return 0; },
  clearTimeout() {},
  setInterval() { return 0; },
  clearInterval() {},
  requestAnimationFrame() { return 0; },
  cancelAnimationFrame() {},
  performance: { now: () => Date.now() },
  navigator: { language: "zh-CN" },
  location: { search: "" },
  URLSearchParams,
  alert() {}
};
sandbox.window = sandbox;
sandbox.global = sandbox;

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

const ctx = vm.createContext(sandbox);
for (const script of scripts) {
  new vm.Script(fs.readFileSync(path.join(root, script), "utf8"), { filename: script }).runInContext(ctx);
}

function fail(message) {
  console.error("FAIL:", message);
  process.exit(1);
}

function assertClean(label, text) {
  const bad = [
    "\\?{3,}",
    "[\\uE000-\\uF8FF]",
    "�|锟",
    "\\u940f",
    "\\u95b8",
    "\\u9227",
    "\\u951b",
    "\\u93c8\\u613d\\u67a1",
    "\\u59dd\\ufe40",
    "\\u5bb8\\u30e7",
    "\\u8930\\u64b3"
  ];
  if (new RegExp(bad.join("|")).test(String(text))) {
    fail(label + " contains mojibake: " + text);
  }
}

const V2 = sandbox.CS.V2;
const GameV2 = sandbox.GameV2;

if (!Array.isArray(V2.runPhases) || V2.runPhases.length !== 5) fail("run phase map should define 5 macro phases");
if (V2.runPhases[0].key !== "weapon_intro" || V2.runPhases[0].weaponStageShort !== "基础攻击") {
  fail("phase 1 should describe the initial weapon motif");
}
if (V2.runPhases[1].key !== "promotion" || V2.runPhases[1].weaponStageShort !== "部门形态") {
  fail("phase 2 should describe badge form mastery");
}
if (V2.runPhases.slice(2).some(item => item.status !== "playable")) {
  fail("all five macro phases should be playable in the current vertical slice");
}

const weapons = V2.getViewModel("weapon_select");
if (weapons.length !== 10) fail("weapon select should expose 10 weapons");
for (const expected of ["马克笔", "保温杯", "即时贴"]) {
  if (!weapons.some(item => item.name === expected)) fail("missing weapon: " + expected);
}
weapons.forEach(item => assertClean("weapon " + item.id, JSON.stringify(item)));

GameV2.startRun({ weaponId: "marker" });
let hud = V2.getViewModel("hud");
if (hud.formText !== "实习马克笔") fail("intern marker form not visible in HUD");
if (hud.phaseMeta !== "实习期 · 基础攻击") fail("HUD should show current weapon upgrade layer");

GameV2.dispatch({ type: "COMPLETE_STAGE" });
const badgeForms = V2.getViewModel("badge_select");
if (!badgeForms.some(item => item.formName === "多线程荧光笔")) fail("marker tech form missing");
if (!badgeForms.some(item => item.formName === "P0 标记笔")) fail("marker product form missing");
badgeForms.forEach(item => assertClean("badge " + item.dept, JSON.stringify(item)));

GameV2.dispatch({ type: "SET_BADGE", dept: "tech" });
const armory = V2.getViewModel("armory");
if (armory.theme.id !== "line") fail("tech marker armory should use line theme");
if (!armory.offers.some(item => /分裂|支线|伤害|间隔/.test(item.title + item.reason))) {
  fail("armory offers should mention current marker split form");
}
assertClean("armory", JSON.stringify(armory));

const state = GameV2.getState();
state.stage.id = 4;
state.stage.phaseKey = "promotion";
state.stage.phaseStep = 3;
state.slotChoices = V2.progression.makeSlotChoices(state);
const slots = V2.getViewModel("slot_select");
if (slots.theme.id !== "line") fail("slot page should inherit line theme");
if (!slots.choices.find(item => item.slotId === "mechanic" && item.unlocked)) fail("mechanic slot should open at promotion phase step 3");
if (!slots.build.slots.find(item => item.slotId === "cost" && !item.open && /转正期第 4 步/.test(item.unlockLabel))) {
  fail("slot lock label should reference promotion phase progress, not stage id");
}
if (!slots.choices.some(item => /分裂|支线|命中/.test(item.replaceGain + item.augmentGain))) {
  fail("slot choices should explain current form changes");
}
assertClean("slots", JSON.stringify(slots));

GameV2.startRun({ weaponId: "thermos" });
GameV2.dispatch({ type: "COMPLETE_STAGE" });
GameV2.dispatch({ type: "SET_BADGE", dept: "tech" });
const thermosArmory = V2.getViewModel("armory");
if (thermosArmory.theme.id !== "charge") fail("thermos tech armory should use charge theme");
if (!thermosArmory.build.params.some(item => item.label === "蓄热" || item.label === "模块")) fail("thermos params should expose heat/module language");
if (!thermosArmory.offers.some(item => /巡航|模块|续航/.test(item.title + item.reason))) fail("thermos tech shop should sell patrol-module upgrades");
assertClean("thermos armory", JSON.stringify(thermosArmory));

GameV2.startRun({ weaponId: "sticky_note" });
GameV2.dispatch({ type: "COMPLETE_STAGE" });
GameV2.dispatch({ type: "SET_BADGE", dept: "marketing" });
const stickyArmory = V2.getViewModel("armory");
if (stickyArmory.theme.id !== "wave") fail("sticky marketing armory should use spread theme");
if (!stickyArmory.build.params.some(item => item.label === "贴纸" || item.label === "传播")) fail("sticky params should expose note/spread language");
if (!stickyArmory.offers.some(item => /传播|贴纸|连锁/.test(item.title + item.reason))) fail("sticky marketing shop should sell spread upgrades");
assertClean("sticky armory", JSON.stringify(stickyArmory));

console.log("V2 UI view-model checks passed");
