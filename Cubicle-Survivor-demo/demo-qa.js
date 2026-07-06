const fs = require("fs");
const path = require("path");
const vm = require("vm");

const baseDir = __dirname;
let randomSeed = 13371337;

function seededRandom() {
  randomSeed = (randomSeed * 1664525 + 1013904223) >>> 0;
  return randomSeed / 0x100000000;
}

const seededMath = Object.create(Math);
seededMath.random = seededRandom;

function fail(message, details) {
  console.error("QA FAIL:", message);
  if (details) console.error(JSON.stringify(details, null, 2));
  process.exit(1);
}

function makeElement() {
  return {
    style: { setProperty() {}, removeProperty() {} },
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    dataset: {},
    textContent: "",
    innerHTML: "",
    value: "",
    disabled: false,
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
      setLineDash() {},
      globalAlpha: 1,
      globalCompositeOperation: "source-over",
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      font: "",
      textAlign: "left",
      textBaseline: "alphabetic",
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
  setTimeout() { return 0; },
  clearTimeout() {},
  setInterval() { return 0; },
  clearInterval() {},
  requestAnimationFrame() { return 0; },
  cancelAnimationFrame() {},
  addEventListener() {},
  removeEventListener() {},
  performance: { now: () => Date.now() },
  navigator: { userAgent: "node-demo-qa", language: "zh-CN" },
  location: { search: "", href: "http://localhost/" },
  URLSearchParams,
  Image: function Image() {
    this.complete = true;
    this.naturalWidth = 64;
    this.naturalHeight = 64;
    this.src = "";
  },
  Math: seededMath,
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
  "src/v2/compat/legacy.js",
  "src/v2/runtime/state.js",
  "src/v2/progression/progression.js",
  "src/v2/combat/systems.js",
  "src/v2/ui/view-model.js",
  "src/v2/ui/render.js",
  "main.js"
];

function loadGame() {
  const ctx = vm.createContext(sandbox);
  for (const script of scripts) {
    const fullPath = path.join(baseDir, script);
    const code = fs.readFileSync(fullPath, "utf8");
    new vm.Script(code, { filename: script }).runInContext(ctx);
  }
  if (!sandbox.GameV2 || !sandbox.CS || !sandbox.CS.V2) fail("GameV2 public API missing");
  return sandbox.CS.V2;
}

function collectStaticRefs() {
  const refs = new Set();
  const html = fs.readFileSync(path.join(baseDir, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(baseDir, "styles.css"), "utf8");
  for (const text of [html, css]) {
    for (const match of text.matchAll(/(?:href|src)="([^"]+)"/g)) refs.add(match[1]);
    for (const match of text.matchAll(/url\("?([^")]+)"?\)/g)) refs.add(match[1]);
  }
  return Array.from(refs)
    .filter(ref => !/^(data:|https?:|#)/.test(ref))
    .map(ref => ref.split("?")[0]);
}

function assertPackageAssets() {
  const missing = collectStaticRefs().filter(ref => !fs.existsSync(path.join(baseDir, ref)));
  if (missing.length) fail("Static package references missing files", missing);

  const publicTextFiles = ["index.html", "README.md", "DEMO_README.md", "src/v2/ui/view-model.js", "src/v2/ui/render.js"];
  const internalPhrases = [
    "Build Prototype",
    "主流程已经跑通",
    "继续加深每把武器",
    "Steam Demo Candidate",
    "active prototype",
    "平均帧耗时",
    "Paused"
  ];
  const internalHits = [];
  for (const file of publicTextFiles) {
    const text = fs.readFileSync(path.join(baseDir, file), "utf8");
    for (const phrase of internalPhrases) {
      if (text.includes(phrase)) internalHits.push({ file, phrase });
    }
  }
  if (internalHits.length) fail("Public demo text should not expose internal prototype wording", internalHits);

  const html = fs.readFileSync(path.join(baseDir, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(baseDir, "styles.css"), "utf8");
  if (/\.game-wrap:has\(/.test(css)) fail("HUD visibility should use data-page-mode instead of :has selectors for demo compatibility");
  if (!css.includes('.v2-game:not([data-page-mode="combat"]) > .objective-hud')) {
    fail("HUD visibility should hide combat HUD outside combat mode");
  }
  if (!css.includes('.v2-game[data-page-mode="combat"] > .objective-hud')) {
    fail("Objective HUD should have a combat-mode safe layout rule");
  }
  if (!css.includes('.v2-game[data-page-mode="combat"] > .build-panel.collapsed')) {
    fail("Collapsed build panel should use a combat-mode safe layout rule");
  }
  if (/\.debug-(test-button|state)\b|\.error-log\b/.test(css) || /id="(?:debugState|errLog|testAllBtn)"/.test(html)) {
    fail("Public demo package should not include visible debug UI nodes or styles");
  }

  const requiredSprites = [
    "marker_beam", "marker_split", "marker_blast", "marker_counter", "marker_wave", "marker_grid",
    "thermos_steam", "thermos_drone", "thermos_boil", "thermos_shield", "thermos_shield_break", "thermos_station", "thermos_tea_wave",
    "sticky_base", "sticky_seeking", "sticky_sync_blast", "sticky_route", "sticky_spread", "sticky_notice_board"
  ];
  const missingSprites = requiredSprites.filter(id => !fs.existsSync(path.join(baseDir, "assets/v2-weapon-vfx/sprites/" + id + ".png")));
  if (missingSprites.length) fail("Required weapon VFX sprites missing", missingSprites);
}

function assertStageModel(V2) {
  const state = sandbox.GameV2.getState();
  const blueprints = V2.store && V2.store.stageBlueprints;
  if (!Array.isArray(blueprints) || blueprints.length !== 16) fail("V2 stage blueprint must contain exactly 16 stages");
  const ids = blueprints.map(stage => stage.id);
  if (ids.join(",") !== "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16") fail("Stage ids should be continuous 1-16", ids);
  const finals = blueprints.filter(stage => stage.phaseFinal).map(stage => stage.id).join(",");
  if (finals !== "3,7,10,13,16") fail("Phase finals should be stages 3,7,10,13,16", finals);
  const missingMix = blueprints.filter(stage => !Array.isArray(stage.enemyMix) || !stage.enemyMix.length).map(stage => stage.id);
  if (missingMix.length) fail("Every stage should define an enemyMix", missingMix);
  const enemyTypes = Array.from(new Set(blueprints.flatMap(stage => stage.enemyMix.map(item => item.type)))).sort();
  const requiredTypes = ["approval", "client", "deadline", "email", "meeting", "ping", "scope", "todo"];
  const missingTypes = requiredTypes.filter(type => !enemyTypes.includes(type));
  if (missingTypes.length) fail("Stage enemyMix is missing required threat types", { missingTypes, enemyTypes });
  const bossTypes = blueprints.filter(stage => stage.boss).map(stage => stage.bossType).join(",");
  if (bossTypes !== "lead,director,delivery,client,ceo") fail("Boss stages should escalate through five named boss types", bossTypes);
  if (!state || !state.stage || state.stage.id !== 1) fail("Initial state should point to stage 1");
}

function forceSpawnedEnemy(type) {
  const state = sandbox.GameV2.getState();
  state.mode = "combat";
  state.warmupTime = 0;
  state.stageTime = 99;
  state.stage.targetKills = 999;
  state.stage.boss = false;
  state.stage.enemyMix = [{ type, weight: 1 }];
  state.enemies = [];
  state.projectiles = [];
  sandbox.CS.V2.combat.spawnEnemy(state);
  if (!state.enemies.length || state.enemies[0].typeId !== type) fail("Forced enemy spawn created the wrong type", { type, enemy: state.enemies[0] });
  state.stage.boss = true;
  return state.enemies[0];
}

function assertEnemyBehaviorContract() {
  sandbox.GameV2.startRun({ weaponId: "marker" });
  const state = sandbox.GameV2.getState();
  state.player.x = 640;
  state.player.y = 360;
  state.activeFormParams.damage = 20;
  state.activeFormParams.range = 520;

  const client = forceSpawnedEnemy("client");
  client.x = state.player.x + 230;
  client.y = state.player.y;
  client.hp = 500;
  client.maxHp = 500;
  client.shootCooldown = 0;
  const shotsBefore = state.stats.enemyShots || 0;
  sandbox.CS.V2.combat.update(1 / 60);
  if ((state.stats.enemyShots || 0) <= shotsBefore || !state.projectiles.some(p => p.hostile)) fail("Shooter enemy should fire hostile projectiles", { enemyShots: state.stats.enemyShots, projectiles: state.projectiles });

  const deadline = forceSpawnedEnemy("deadline");
  deadline.x = state.player.x + 180;
  deadline.y = state.player.y;
  deadline.hp = 500;
  deadline.maxHp = 500;
  deadline.chargeCooldown = 0;
  sandbox.CS.V2.combat.update(1 / 60);
  if (!(deadline.chargeTime > 0)) fail("Charger enemy should enter charge state", { chargeTime: deadline.chargeTime, behavior: deadline.behavior });

  const approval = forceSpawnedEnemy("approval");
  approval.x = state.player.x + 130;
  approval.y = state.player.y;
  approval.hp = 100;
  approval.maxHp = 100;
  sandbox.CS.V2.combat.fireWeapon(state);
  if (!(approval.hp > 80 && approval.hp < 100)) fail("Shield enemy should reduce incoming weapon damage", { hpAfter: approval.hp });

  const scope = forceSpawnedEnemy("scope");
  scope.x = state.player.x + 130;
  scope.y = state.player.y;
  scope.hp = 1;
  scope.maxHp = 1;
  sandbox.CS.V2.combat.fireWeapon(state);
  if (!state.enemies.some(enemy => enemy.fragment)) fail("Splitter enemy should create fragments on death", state.enemies.map(enemy => ({ typeId: enemy.typeId, fragment: enemy.fragment })));
}

function assertPauseViewModelContract(V2) {
  sandbox.GameV2.startRun({ weaponId: "marker" });
  sandbox.GameV2.dispatch({ type: "SET_BADGE", dept: "tech" });
  const state = sandbox.GameV2.getState();
  state.mode = "paused";
  state.stageTime = 18;
  state.stageKills = 7;
  state.materials = 42;
  state.level = 3;

  const vm = V2.getViewModel("pause");
  const requiredTextFields = ["stageMeta", "stageName", "phaseMeta", "stageNote", "time", "remaining", "kills", "hp", "weapon", "formName", "objective"];
  const missing = requiredTextFields.filter(field => vm[field] === undefined || vm[field] === null || vm[field] === "");
  if (missing.length) fail("Pause view model should expose player-facing run context", { missing, vm });

  const forbiddenFields = ["avgFrameMs", "updateCount", "lastError", "running", "raf", "interval", "enemies", "projectiles", "zones"];
  const leaked = forbiddenFields.filter(field => Object.prototype.hasOwnProperty.call(vm, field));
  if (leaked.length) fail("Pause view model should not expose debug/runtime counters", { leaked, vm });

  const summaryText = [vm.stageMeta, vm.stageName, vm.phaseMeta, vm.stageNote, vm.weapon, vm.formName, vm.objective].join(" ");
  const forbiddenCopy = ["平均帧耗时", "Paused", "敌人", "投射物"];
  const leakedCopy = forbiddenCopy.filter(phrase => summaryText.includes(phrase));
  if (leakedCopy.length) fail("Pause view model copy should stay player-facing", { leakedCopy, summaryText });
}

function assertFoundationContracts(V2) {
  const renderSource = fs.readFileSync(path.join(baseDir, "src/v2/ui/render.js"), "utf8");
  if (!renderSource.includes("node.__lastHtml === html")) {
    fail("UI renderer should cache repeated HTML writes so choice cards are not rebuilt every frame");
  }
  if (!V2.combat || !V2.combat.primitives || typeof V2.combat.primitives.beam !== "function" || typeof V2.combat.primitives.zone !== "function") {
    fail("Combat layer should expose explicit primitive factories for weapon rewrites");
  }

  sandbox.GameV2.startRun({ weaponId: "marker" });
  const state = sandbox.GameV2.getState();
  if (!state.world || !state.camera || !(state.world.width > state.camera.width && state.world.height > state.camera.height)) {
    fail("Combat state should separate world size from camera viewport", { world: state.world, camera: state.camera });
  }
  state.warmupTime = 0;
  state.player.x = state.camera.width / 2 + 360;
  V2.combat.updateCamera(state);
  if (!(state.player.x > state.camera.width / 2 + 180) || !(state.camera.x > 120)) {
    fail("Camera should follow the player through a larger world", { player: state.player, camera: state.camera, world: state.world });
  }
  V2.combat.spawnEnemy(state);
  const spawned = state.enemies[state.enemies.length - 1];
  if (!spawned || spawned.x < -60 || spawned.x > state.world.width + 60 || spawned.y < -60 || spawned.y > state.world.height + 60) {
    fail("Enemy spawning should use world-space bounds around the camera", { spawned, camera: state.camera, world: state.world });
  }
}

function makeMechanicEnemy(id, x, y, hp) {
  return {
    id,
    typeId: "contract_dummy",
    name: "机制靶",
    x,
    y,
    vx: 0,
    vy: 0,
    r: 14,
    hp: hp || 80,
    maxHp: hp || 80,
    speed: 0,
    damage: 0,
    xp: 0,
    material: 0,
    dead: false,
    hitCooldown: 0
  };
}

function setupMechanicState(weaponId, dept) {
  sandbox.GameV2.startRun({ weaponId });
  if (dept) sandbox.GameV2.dispatch({ type: "SET_BADGE", dept });
  const state = sandbox.GameV2.getState();
  state.mode = "combat";
  state.warmupTime = 0;
  state.stageTime = 45;
  state.stageKills = 0;
  state.enemies = [];
  state.projectiles = [];
  state.damageZones = [];
  state.formEvents = [];
  state.particles = [];
  state.pickups = [];
  state.stats.weaponEvents = [];
  state.stats.damageDone = {};
  state.player.x = 400;
  state.player.y = 360;
  state.camera.x = 0;
  state.camera.y = 0;
  return state;
}

function weaponEvents(state, type, source) {
  return (state.stats.weaponEvents || []).filter(event => {
    if (type && event.type !== type) return false;
    if (source && event.source !== source) return false;
    return true;
  });
}

function expectWeaponEvent(state, type, source, min, message) {
  const events = weaponEvents(state, type, source);
  if (events.length < min) {
    fail(message, {
      expected: { type, source, min },
      actual: events.length,
      allEvents: (state.stats.weaponEvents || []).map(event => ({ type: event.type, source: event.source, formId: event.formId }))
    });
  }
  if (source && events.some(event => !event.vfxPhase)) {
    fail("Weapon event is missing VFX phase metadata", {
      source,
      events: events.map(event => ({ type: event.type, source: event.source, vfxPhase: event.vfxPhase, sprite: event.sprite }))
    });
  }
  return events;
}

function expectDamageZone(state, source, message) {
  const zones = state.damageZones.filter(zone => zone.source === source);
  if (!zones.length) {
    fail(message, {
      source,
      zones: state.damageZones.map(zone => ({ source: zone.source, visual: zone.visual, type: zone.type, radius: zone.radius, width: zone.width }))
    });
  }
  if (zones.some(zone => !zone.vfxPhase)) {
    fail("Damage zone is missing VFX phase metadata", {
      source,
      zones: zones.map(zone => ({ source: zone.source, visual: zone.visual, vfxPhase: zone.vfxPhase }))
    });
  }
  return zones;
}

function assertWeaponFormSignatures(V2) {
  const required = [
    ["marker", "tech", ["marker_main", "marker_split"]],
    ["marker", "product", ["marker_p0_mark", "marker_p0_blast"]],
    ["marker", "ops", ["marker_counter"]],
    ["marker", "marketing", ["marker_wave"]],
    ["marker", "general", ["marker_grid_line"]],
    ["thermos", "tech", ["thermos_drone_summon", "thermos_drone"]],
    ["thermos", "product", ["thermos_warmup", "thermos_release"]],
    ["thermos", "ops", ["thermos_shield_break"]],
    ["thermos", "marketing", ["thermos_tea_wave"]],
    ["thermos", "general", ["thermos_station"]],
    ["sticky_note", "tech", ["sticky_seeking"]],
    ["sticky_note", "product", ["sticky_sync_blast"]],
    ["sticky_note", "ops", ["sticky_route"]],
    ["sticky_note", "marketing", ["sticky_spread_attach"]],
    ["sticky_note", "general", ["sticky_notice_trap", "sticky_link_line", "sticky_notice_zone"]]
  ];
  required.forEach(([weaponId, dept, sources]) => {
    const form = V2.getWeaponForm(weaponId, dept);
    const sig = V2.getWeaponFormSignature(form);
    if (!sig || !sig.topology || !sig.process || !sig.focus || sig.focus.length < 2) {
      fail("Weapon form signature is incomplete", { weaponId, dept, mechanicType: form.mechanicType, sig });
    }
    sources.forEach(source => {
      if (!sig.sources || sig.sources.indexOf(source) < 0) {
        fail("Weapon form signature does not cover expected VFX source", {
          weaponId,
          dept,
          mechanicType: form.mechanicType,
          source,
          signatureSources: sig.sources
        });
      }
      if (!V2.getWeaponEventPhase(source)) {
        fail("Weapon VFX source is missing phase mapping", { source });
      }
    });
  });
}

function assertWeaponMechanicContracts(V2) {
  assertWeaponFormSignatures(V2);
  let state = setupMechanicState("marker", "tech");
  Object.assign(state.activeFormParams, {
    damage: 28,
    range: 720,
    width: 8,
    pierce: 6,
    splitCount: 2,
    splitDamage: 0.55,
    extraTrigger: false,
    promotionFullscreenChance: 0
  });
  state.enemies = [
    makeMechanicEnemy("line-a", 620, 360, 100),
    makeMechanicEnemy("split-up", 705, 295, 100),
    makeMechanicEnemy("split-down", 705, 425, 100),
    makeMechanicEnemy("line-b", 820, 360, 100)
  ];
  V2.combat.fireWeapon(state);
  const markerSplitHits = weaponEvents(state, "hit", "marker_split").length;
  expectWeaponEvent(state, "beam", "marker_main", 1, "Marker tech should always fire one piercing main beam");
  expectWeaponEvent(state, "beam", "marker_split", 4, "Marker tech should create visible split laser branches");
  if (markerSplitHits < 2) {
    fail("Marker tech contract broken: main beam should create damaging split lasers", {
      beams: weaponEvents(state, "beam", "marker_split").length,
      hits: markerSplitHits,
      enemies: state.enemies.map(enemy => ({ id: enemy.id, hp: enemy.hp }))
    });
  }
  if (!(state.enemies.find(enemy => enemy.id === "line-b").hp < 100)) {
    fail("Marker base line should pierce through a row instead of behaving like a short projectile");
  }

  state = setupMechanicState("marker", "product");
  Object.assign(state.activeFormParams, { damage: 24, pierce: 4, explosionRadius: 70, explosionDamage: 48 });
  state.enemies = [makeMechanicEnemy("p0-target", 640, 360, 180)];
  V2.combat.fireWeapon(state);
  expectWeaponEvent(state, "circle", "marker_p0_mark", 1, "Product Marker should first tag a priority target with P0");
  V2.combat.fireWeapon(state);
  expectWeaponEvent(state, "circle", "marker_p0_blast", 1, "Product Marker should detonate a re-hit P0 target");
  expectDamageZone(state, "marker_p0_blast", "Product Marker P0 detonation should create an actual blast damage zone");

  state = setupMechanicState("marker", "ops");
  Object.assign(state.activeFormParams, { damage: 20, pierce: 4, shieldPerHit: 22, counterLines: 4, counterDamage: 35 });
  state.enemies = [makeMechanicEnemy("counter-a", 610, 360, 80), makeMechanicEnemy("counter-b", 720, 360, 80)];
  V2.combat.fireWeapon(state);
  expectWeaponEvent(state, "beam", "marker_counter", 4, "Ops Marker should convert shield charge into radial counter lasers");

  state = setupMechanicState("marker", "marketing");
  Object.assign(state.activeFormParams, { damage: 20, waveCount: 2, waveRadius: 96, waveDamage: 18 });
  state.enemies = [makeMechanicEnemy("wave-line", 620, 360, 100)];
  V2.combat.fireWeapon(state);
  expectWeaponEvent(state, "circle", "marker_wave", 2, "Marketing Marker should turn line endpoint into expanding wave rings");
  expectDamageZone(state, "marker_wave", "Marketing Marker wave rings should be real damage zones");

  state = setupMechanicState("marker", "general");
  Object.assign(state.activeFormParams, { damage: 18, gridDamage: 13, trailDuration: 3 });
  state.enemies = [makeMechanicEnemy("grid-line", 620, 360, 100)];
  V2.combat.fireWeapon(state);
  expectDamageZone(state, "marker_grid_line", "Admin Marker should leave a lingering grid line after the beam path");

  state = setupMechanicState("thermos", "tech");
  Object.assign(state.activeFormParams, { heat: 90, heatRate: 20, steamRange: 260, summonCount: 2, summonDuration: 4, damage: 12 });
  state.enemies = [makeMechanicEnemy("drone-target", 600, 360, 100)];
  V2.combat.fireWeapon(state);
  expectWeaponEvent(state, "circle", "thermos_drone_summon", 1, "Tech Thermos should announce an automatic refill module");
  expectDamageZone(state, "thermos_drone", "Tech Thermos should create orbiting steam module zones");

  state = setupMechanicState("thermos", "product");
  Object.assign(state.activeFormParams, {
    damage: 16,
    heat: 0,
    heatRate: 55,
    heatMax: 100,
    steamRange: 230,
    releaseRange: 430,
    releaseWidth: 22,
    releaseDamage: 90
  });
  state.enemies = [makeMechanicEnemy("boil-target", 650, 360, 300)];
  V2.combat.fireWeapon(state);
  const warmupDamage = 300 - state.enemies[0].hp;
  if (!weaponEvents(state, "beam", "thermos_warmup").length || weaponEvents(state, "beam", "thermos_release").length) {
    fail("Thermos product warmup should show weak steam before the boil release", weaponEvents(state));
  }
  V2.combat.fireWeapon(state);
  const releaseDamage = 300 - state.enemies[0].hp - warmupDamage;
  if (!weaponEvents(state, "beam", "thermos_release").length || !(releaseDamage > warmupDamage * 2)) {
    fail("Thermos product contract broken: heat should culminate in a visibly stronger release beam", {
      warmupDamage,
      releaseDamage,
      events: weaponEvents(state)
    });
  }

  state = setupMechanicState("thermos", "ops");
  Object.assign(state.activeFormParams, { damage: 12, shieldGain: 35, shieldThreshold: 30, pulseDamage: 40, pulseRadius: 120 });
  state.enemies = [makeMechanicEnemy("shield-target", 620, 360, 100)];
  V2.combat.fireWeapon(state);
  expectWeaponEvent(state, "circle", "thermos_shield_break", 1, "Ops Thermos should break warm shield into a pulse");
  expectDamageZone(state, "thermos_shield_break", "Ops Thermos shield break should create a real pulse damage zone");

  state = setupMechanicState("thermos", "marketing");
  Object.assign(state.activeFormParams, { damage: 10, waveCount: 3, waveRadius: 110, spreadDamage: 14 });
  state.enemies = [makeMechanicEnemy("tea-target", 620, 360, 100)];
  V2.combat.fireWeapon(state);
  expectWeaponEvent(state, "circle", "thermos_tea_wave", 3, "Marketing Thermos should emit multiple tea-wave rings");
  expectDamageZone(state, "thermos_tea_wave", "Marketing Thermos tea waves should be actual damage zones");

  state = setupMechanicState("thermos", "general");
  Object.assign(state.activeFormParams, { stationRadius: 120, stationDuration: 5, stationPulseDamage: 10, heal: 1 });
  V2.combat.fireWeapon(state);
  expectWeaponEvent(state, "circle", "thermos_station", 1, "Admin Thermos should deploy a visible safe station");
  expectDamageZone(state, "thermos_station", "Admin Thermos station should be a persistent zone");

  state = setupMechanicState("sticky_note", "tech");
  Object.assign(state.activeFormParams, { damage: 10, trapRadius: 44, seekSpeed: 160 });
  state.enemies = [makeMechanicEnemy("seek-target", 640, 360, 90)];
  V2.combat.fireWeapon(state);
  expectWeaponEvent(state, "circle", "sticky_seeking", 1, "Tech Sticky Note should create a seeking trap");
  if (!expectDamageZone(state, "sticky_seeking", "Tech Sticky Note seeking trap should be an actual zone").some(zone => zone.seek)) {
    fail("Tech Sticky Note zone should actively seek enemies");
  }

  state = setupMechanicState("sticky_note", "product");
  Object.assign(state.activeFormParams, { damage: 13, trapRadius: 48, explosionRadius: 74 });
  state.enemies = [makeMechanicEnemy("blast-target", 640, 360, 120)];
  V2.combat.fireWeapon(state);
  V2.combat.fireWeapon(state);
  V2.combat.fireWeapon(state);
  expectWeaponEvent(state, "circle", "sticky_sync_blast", 2, "Product Sticky Note should sync-detonate prepared traps");
  expectDamageZone(state, "sticky_sync_blast", "Product Sticky Note synced detonation should create blast zones");

  state = setupMechanicState("sticky_note", "ops");
  Object.assign(state.activeFormParams, { damage: 9, trapRadius: 48, routeHeal: 1.2, shieldGain: 5 });
  state.input.right = true;
  state.enemies = [makeMechanicEnemy("route-target", 640, 360, 90)];
  V2.combat.fireWeapon(state);
  expectWeaponEvent(state, "circle", "sticky_route", 1, "Ops Sticky Note should lay a route buff trap");
  const routeZone = expectDamageZone(state, "sticky_route", "Ops Sticky Note route should be a zone with player benefits")[0];
  if (!(routeZone.heal > 0 && routeZone.playerShield > 0)) fail("Ops Sticky Note route should heal or shield the player", routeZone);

  state = setupMechanicState("sticky_note", "marketing");
  Object.assign(state.activeFormParams, { damage: 11, spreadRadius: 130, spreadLimit: 3, spreadDepth: 2 });
  state.enemies = [makeMechanicEnemy("spread-target", 640, 360, 120)];
  V2.combat.fireWeapon(state);
  expectWeaponEvent(state, "circle", "sticky_spread_attach", 1, "Marketing Sticky Note should visibly attach a spreading note");
  if (!state.enemies[0].stickyDebuff) fail("Marketing Sticky Note should attach a spread-on-death debuff to the target");

  state = setupMechanicState("sticky_note", "general");
  Object.assign(state.activeFormParams, {
    damage: 11,
    zoneDamage: 12,
    trapRadius: 58,
    linkRadius: 145,
    slow: 0.3
  });
  state.enemies = [makeMechanicEnemy("notice-target", 640, 360, 120)];
  V2.combat.fireWeapon(state);
  V2.combat.fireWeapon(state);
  V2.combat.fireWeapon(state);
  if (weaponEvents(state, "circle", "sticky_notice_trap").length < 3 || weaponEvents(state, "beam", "sticky_link_line").length < 3) {
    fail("Sticky admin contract broken: three notes should link into a visible notice-board field", {
      circles: weaponEvents(state, "circle", "sticky_notice_trap").length,
      links: weaponEvents(state, "beam", "sticky_link_line").length,
      zones: state.damageZones.map(zone => zone.source || zone.visual)
    });
  }
  if (!state.damageZones.some(zone => zone.source === "sticky_notice_zone")) {
    fail("Sticky admin should create a persistent control zone after linked notes");
  }
}

function assertShopContract(V2) {
  sandbox.GameV2.startRun({ weaponId: "marker" });
  sandbox.GameV2.dispatch({ type: "SET_BADGE", dept: "tech" });
  const state = sandbox.GameV2.getState();
  state.materials = 99;
  const first = V2.progression.makeShopOffers(state);
  const cats = first.map(offer => offer.category).sort().join(",");
  if (cats !== "core,patch,risk") fail("Shop should always expose core, patch and risk choices", first.map(o => ({ id: o.id, category: o.category })));
  const c1 = V2.progression.getRefreshCost(state);
  sandbox.GameV2.dispatch({ type: "REFRESH_ARMORY" });
  const c2 = V2.progression.getRefreshCost(state);
  sandbox.GameV2.dispatch({ type: "REFRESH_ARMORY" });
  const c3 = V2.progression.getRefreshCost(state);
  if (!(c1 < c2 && c2 < c3)) fail("Shop refresh cost should increase inside one armory visit", { c1, c2, c3 });
}

function chooseAffordableOffer(state) {
  const offers = state.shopOffers || [];
  const needsRecovery = state.hp < state.maxHp * 0.62;
  const preferred = (needsRecovery && offers.find(offer => offer.category === "patch" && state.materials >= offer.cost))
    || offers.find(offer => offer.category === "core" && state.materials >= offer.cost)
    || offers.find(offer => offer.category === "patch" && state.materials >= offer.cost)
    || offers.find(offer => state.materials >= offer.cost);
  if (preferred) sandbox.GameV2.dispatch({ type: "BUY_OFFER", offerId: preferred.id });
}

function selectSlot(state, step) {
  const order = ["offense", "survival", "mechanic", "resource", "cost"];
  const choices = sandbox.CS.V2.progression.makeSlotChoices(state);
  const slot = order.find(slotId => choices.some(choice => choice.slotId === slotId && choice.unlocked && !state.slotAssignments[slotId]))
    || order.find(slotId => choices.some(choice => choice.slotId === slotId && choice.unlocked));
  if (!slot) fail("No unlocked slot available", { stage: state.stage && state.stage.id, choices });
  sandbox.GameV2.dispatch({ type: "SELECT_SLOT", slotId: slot, action: state.slotAssignments[slot] ? "augment" : "replace" });
}

function runFullDemoPath(config) {
  sandbox.GameV2.startRun({ weaponId: config.weaponId });
  const visited = [];
  const armoryCategories = [];
  let guard = 0;
  while (guard++ < 120) {
    const state = sandbox.GameV2.getState();
    if (state.mode === "combat") {
      visited.push(state.stage.id);
      sandbox.GameV2.dispatch({ type: "COMPLETE_STAGE" });
      continue;
    }
    if (state.mode === "badge_select") {
      sandbox.GameV2.dispatch({ type: "SET_BADGE", dept: config.dept });
      continue;
    }
    if (state.mode === "secondary_badge_select") {
      sandbox.GameV2.dispatch({ type: "SET_SECONDARY_BADGE", dept: config.secondaryDept });
      continue;
    }
    if (state.mode === "support_weapon_select") {
      sandbox.GameV2.dispatch({ type: "SET_SUPPORT_WEAPON", weaponId: config.supportWeaponId });
      continue;
    }
    if (state.mode === "slot_select") {
      selectSlot(state, guard);
      continue;
    }
    if (state.mode === "level_up") {
      const choice = (state.upgradeChoices || [])[0];
      if (choice) sandbox.GameV2.dispatch({ type: "SELECT_UPGRADE", upgradeId: choice.id });
      else sandbox.GameV2.dispatch({ type: "SKIP_UPGRADE" });
      continue;
    }
    if (state.mode === "armory") {
      const cats = (state.shopOffers || []).map(offer => offer.category).sort().join(",");
      armoryCategories.push(cats);
      if (cats !== "core,patch,risk") fail("Armory categories broke during full run", { config, stage: state.stage && state.stage.id, cats, offers: state.shopOffers });
      chooseAffordableOffer(state);
      sandbox.GameV2.dispatch({ type: "CONTINUE_NEXT_STAGE" });
      continue;
    }
    if (state.mode === "result") {
      const uniqueVisited = Array.from(new Set(visited));
      if (!state.flags.won) fail("Full demo path ended without win flag", { config, state: { mode: state.mode, flags: state.flags } });
      if (uniqueVisited.join(",") !== "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16") fail("Full demo path did not visit all 16 stages", { config, visited: uniqueVisited });
      if (!state.flags.badgeSeen || !state.flags.slotUnlocked || !state.flags.promoted || !state.flags.mastered || !state.flags.crossDepartment || !state.flags.crossWeapon) fail("Full demo path missed a progression flag", { config, flags: state.flags });
      if (state.secondaryBadgeDept !== config.secondaryDept || state.supportWeaponId !== config.supportWeaponId) fail("Full demo path selected wrong late-game support", { config, secondary: state.secondaryBadgeDept, support: state.supportWeaponId });
      return {
        weaponId: config.weaponId,
        dept: config.dept,
        secondaryDept: config.secondaryDept,
        supportWeaponId: config.supportWeaponId,
        level: state.level,
        materials: state.materials,
        flags: Object.assign({}, state.flags),
        armoryVisits: armoryCategories.length,
        supportSkill: state.supportSkill && state.supportSkill.type
      };
    }
    fail("Unexpected mode during full demo path", { config, mode: state.mode, stage: state.stage && state.stage.id });
  }
  fail("Full demo path exceeded guard", config);
}

function sumDamage(state) {
  return Object.keys(state.stats.damageDone || {}).reduce(function (total, key) {
    return total + (state.stats.damageDone[key] || 0);
  }, 0);
}

function steerForSecond(state, second) {
  state.input.up = false;
  state.input.down = false;
  state.input.left = false;
  state.input.right = false;
  let vx = 0;
  let vy = 0;
  for (const enemy of state.enemies || []) {
    const dx = state.player.x - enemy.x;
    const dy = state.player.y - enemy.y;
    const d = Math.hypot(dx, dy) || 1;
    if (d < 260) {
      const weight = (enemy.boss ? 1.4 : 1) * Math.pow((260 - d) / 260, 1.15);
      vx += dx / d * weight;
      vy += dy / d * weight;
    }
  }
  for (const shot of state.projectiles || []) {
    if (!shot.hostile) continue;
    const dx = state.player.x - shot.x;
    const dy = state.player.y - shot.y;
    const d = Math.hypot(dx, dy) || 1;
    if (d < 190) {
      const weight = Math.pow((190 - d) / 190, 1.25) * 1.6;
      vx += dx / d * weight;
      vy += dy / d * weight;
    }
  }
  const orbit = second * 1.2;
  vx += Math.cos(orbit) * 0.28;
  vy += Math.sin(orbit) * 0.28;
  if (state.player.x < 160) vx += 1.2;
  if (state.player.x > 1120) vx -= 1.2;
  if (state.player.y < 120) vy += 1.2;
  if (state.player.y > 600) vy -= 1.2;
  if (Math.abs(vx) < 0.05 && Math.abs(vy) < 0.05) {
    const phase = Math.floor(second / 1.35) % 4;
    if (phase === 0) vx = 1;
    if (phase === 1) vy = 1;
    if (phase === 2) vx = -1;
    if (phase === 3) vy = -1;
  }
  if (vx > 0.12) state.input.right = true;
  if (vx < -0.12) state.input.left = true;
  if (vy > 0.12) state.input.down = true;
  if (vy < -0.12) state.input.up = true;
}

function clearInput(state) {
  state.input.up = false;
  state.input.down = false;
  state.input.left = false;
  state.input.right = false;
}

function advanceToCombatStage(config, targetStageId) {
  sandbox.GameV2.startRun({ weaponId: config.weaponId });
  let guard = 0;
  while (guard++ < 160) {
    const state = sandbox.GameV2.getState();
    if (state.mode === "combat") {
      if (state.stage.id === targetStageId) return state;
      sandbox.GameV2.dispatch({ type: "COMPLETE_STAGE" });
      continue;
    }
    if (state.mode === "badge_select") {
      sandbox.GameV2.dispatch({ type: "SET_BADGE", dept: config.dept || "general" });
      continue;
    }
    if (state.mode === "secondary_badge_select") {
      sandbox.GameV2.dispatch({ type: "SET_SECONDARY_BADGE", dept: config.secondaryDept || "ops" });
      continue;
    }
    if (state.mode === "support_weapon_select") {
      sandbox.GameV2.dispatch({ type: "SET_SUPPORT_WEAPON", weaponId: config.supportWeaponId || "marker" });
      continue;
    }
    if (state.mode === "slot_select") {
      selectSlot(state, guard);
      continue;
    }
    if (state.mode === "level_up") {
      const choice = (state.upgradeChoices || [])[0];
      sandbox.GameV2.dispatch(choice ? { type: "SELECT_UPGRADE", upgradeId: choice.id } : { type: "SKIP_UPGRADE" });
      continue;
    }
    if (state.mode === "armory") {
      chooseAffordableOffer(state);
      sandbox.GameV2.dispatch({ type: "CONTINUE_NEXT_STAGE" });
      continue;
    }
    fail("Could not advance to combat stage", { config, targetStageId, mode: state.mode, stage: state.stage && state.stage.id });
  }
  fail("advanceToCombatStage exceeded guard", { config, targetStageId });
}

function runCombatSmoke(config) {
  const state = advanceToCombatStage(config, config.targetStageId);
  const start = {
    shots: state.stats.shots,
    kills: state.kills,
    stageKills: state.stageKills,
    damage: sumDamage(state),
    hp: state.hp
  };
  const seconds = config.seconds || 18;
  const dt = 1 / 60;
  let simulated = 0;
  for (let frame = 0; frame < seconds * 60; frame++) {
    const current = sandbox.GameV2.getState();
    if (current.mode === "level_up") {
      const choice = (current.upgradeChoices || [])[0];
      sandbox.GameV2.dispatch(choice ? { type: "SELECT_UPGRADE", upgradeId: choice.id } : { type: "SKIP_UPGRADE" });
      continue;
    }
    if (current.mode !== "combat") break;
    steerForSecond(current, simulated);
    V2.combat.update(dt);
    simulated += dt;
    if (sandbox.window._errors && sandbox.window._errors.length) fail("Runtime errors during combat smoke", sandbox.window._errors);
    if (sandbox.GameV2.getState().flags.gameOver) break;
  }
  const end = sandbox.GameV2.getState();
  clearInput(end);
  const delta = {
    shots: end.stats.shots - start.shots,
    kills: end.kills - start.kills,
    stageKills: end.stageKills - start.stageKills,
    damage: sumDamage(end) - start.damage,
    hpLost: start.hp - end.hp,
    simulated: Number(simulated.toFixed(2))
  };
  if (end.flags.gameOver) fail("Combat smoke ended in game over", { config, delta, hp: end.hp, mode: end.mode });
  if (delta.shots <= 0) fail("Combat smoke did not fire weapon", { config, delta });
  if (delta.damage <= 0) fail("Combat smoke did not deal damage", { config, delta, damageDone: end.stats.damageDone });
  if (delta.kills < (config.minKills == null ? 1 : config.minKills)) fail("Combat smoke did not secure expected kills", { config, delta });
  return {
    label: config.label,
    weaponId: config.weaponId,
    stageId: config.targetStageId,
    activeForm: end.activeForm && end.activeForm.formId,
    modeAfterSmoke: end.mode,
    delta
  };
}

function runPressureStage(config) {
  const state = advanceToCombatStage(config, config.targetStageId);
  state.hp = state.maxHp;
  const start = {
    damage: sumDamage(state),
    shots: state.stats.shots,
    kills: state.kills,
    hp: state.hp,
    enemyShots: state.stats.enemyShots || 0
  };
  const seconds = config.seconds || 40;
  const dt = 1 / 60;
  let simulated = 0;
  let bossMaxHp = 0;
  let bossLowestHp = Infinity;
  let completed = false;
  for (let frame = 0; frame < seconds * 60; frame++) {
    const current = sandbox.GameV2.getState();
    if (current.mode === "level_up") {
      const choice = (current.upgradeChoices || [])[0];
      sandbox.GameV2.dispatch(choice ? { type: "SELECT_UPGRADE", upgradeId: choice.id } : { type: "SKIP_UPGRADE" });
      continue;
    }
    if (current.mode !== "combat" || !current.stage || current.stage.id !== config.targetStageId) {
      completed = true;
      break;
    }
    steerForSecond(current, simulated + (config.steerOffset || 0));
    V2.combat.update(dt);
    simulated += dt;
    const boss = current.enemies.find(enemy => enemy.boss);
    if (boss) {
      bossMaxHp = Math.max(bossMaxHp, boss.maxHp || 0);
      bossLowestHp = Math.min(bossLowestHp, boss.hp || 0);
    }
    if (sandbox.window._errors && sandbox.window._errors.length) fail("Runtime errors during pressure stage", sandbox.window._errors);
    if (sandbox.GameV2.getState().flags.gameOver) break;
  }
  const end = sandbox.GameV2.getState();
  clearInput(end);
  if (end.flags.gameOver) fail("Pressure stage ended in game over", { config, hp: end.hp, mode: end.mode });
  const bossDamage = bossMaxHp ? Math.max(0, bossMaxHp - bossLowestHp) : 0;
  const delta = {
    damage: sumDamage(end) - start.damage,
    shots: end.stats.shots - start.shots,
    kills: end.kills - start.kills,
    hpLost: Math.max(0, start.hp - end.hp),
    enemyShots: (end.stats.enemyShots || 0) - start.enemyShots,
    bossDamage: Math.round(bossDamage),
    simulated: Number(simulated.toFixed(2)),
    completed
  };
  if (delta.shots <= 0) fail("Pressure stage did not fire weapon", { config, delta });
  if (delta.damage < (config.minDamage || 1)) fail("Pressure stage did not deal enough damage", { config, delta });
  if (delta.kills < (config.minKills || 0)) fail("Pressure stage did not clear enough enemies", { config, delta });
  if ((config.minBossDamage || 0) > 0 && !delta.completed && delta.bossDamage < config.minBossDamage) fail("Pressure stage did not pressure boss enough", { config, delta });
  return {
    label: config.label,
    weaponId: config.weaponId,
    stageId: config.targetStageId,
    activeForm: end.activeForm && end.activeForm.formId,
    modeAfterPressure: end.mode,
    delta
  };
}

function runActualFullCombatPath(config) {
  sandbox.GameV2.startRun({ weaponId: config.weaponId });
  const stageSummaries = [];
  let guard = 0;
  while (guard++ < 400) {
    const state = sandbox.GameV2.getState();
    if (state.mode === "combat") {
      const stageId = state.stage.id;
      const start = {
        damage: sumDamage(state),
        kills: state.kills,
        shots: state.stats.shots,
        hp: state.hp,
        enemyShots: state.stats.enemyShots || 0
      };
      let simulated = 0;
      const maxSeconds = config.maxStageSeconds || Math.max(35, (state.stage.duration || 60) + 8);
      while (simulated < maxSeconds) {
        const current = sandbox.GameV2.getState();
        if (current.mode === "level_up") {
          const choice = (current.upgradeChoices || [])[0];
          sandbox.GameV2.dispatch(choice ? { type: "SELECT_UPGRADE", upgradeId: choice.id } : { type: "SKIP_UPGRADE" });
          continue;
        }
        if (current.mode !== "combat" || !current.stage || current.stage.id !== stageId) break;
        steerForSecond(current, simulated + (stageId % 3) * 0.45);
        V2.combat.update(1 / 30);
        simulated += 1 / 30;
        if (sandbox.window._errors && sandbox.window._errors.length) fail("Runtime errors during actual full combat path", sandbox.window._errors);
        if (sandbox.GameV2.getState().flags.gameOver) break;
      }
      const end = sandbox.GameV2.getState();
      clearInput(end);
      if (end.flags.gameOver) fail("Actual full combat path died", { config, stageId, hp: end.hp, mode: end.mode });
      if (end.mode === "combat" && end.stage && end.stage.id === stageId) fail("Actual full combat path failed to complete a stage in time", { config, stageId, simulated: Number(simulated.toFixed(2)), kills: end.stageKills + "/" + end.stage.targetKills, hp: end.hp });
      stageSummaries.push({
        stageId,
        simulated: Number(simulated.toFixed(2)),
        damage: Number((sumDamage(end) - start.damage).toFixed(2)),
        kills: end.kills - start.kills,
        shots: end.stats.shots - start.shots,
        hpLost: Number(Math.max(0, start.hp - end.hp).toFixed(2)),
        enemyShots: (end.stats.enemyShots || 0) - start.enemyShots,
        nextMode: end.mode
      });
      continue;
    }
    if (state.mode === "badge_select") {
      sandbox.GameV2.dispatch({ type: "SET_BADGE", dept: config.dept });
      continue;
    }
    if (state.mode === "secondary_badge_select") {
      sandbox.GameV2.dispatch({ type: "SET_SECONDARY_BADGE", dept: config.secondaryDept });
      continue;
    }
    if (state.mode === "support_weapon_select") {
      sandbox.GameV2.dispatch({ type: "SET_SUPPORT_WEAPON", weaponId: config.supportWeaponId });
      continue;
    }
    if (state.mode === "slot_select") {
      selectSlot(state, guard);
      continue;
    }
    if (state.mode === "level_up") {
      const choice = (state.upgradeChoices || [])[0];
      sandbox.GameV2.dispatch(choice ? { type: "SELECT_UPGRADE", upgradeId: choice.id } : { type: "SKIP_UPGRADE" });
      continue;
    }
    if (state.mode === "armory") {
      chooseAffordableOffer(state);
      sandbox.GameV2.dispatch({ type: "CONTINUE_NEXT_STAGE" });
      continue;
    }
    if (state.mode === "result") {
      const ids = stageSummaries.map(item => item.stageId).join(",");
      if (ids !== "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16") fail("Actual full combat path did not fight every stage", { config, ids, stageSummaries });
      if (!state.flags.won || state.flags.gameOver) fail("Actual full combat path did not end in a clean win", { config, flags: state.flags });
      const zeroOutput = stageSummaries.filter(item => item.damage <= 0 || item.shots <= 0);
      if (zeroOutput.length) fail("Actual full combat path had stages without weapon output", zeroOutput);
      const bossStages = stageSummaries.filter(item => [3, 7, 10, 13, 16].includes(item.stageId));
      const missedBossKills = bossStages.filter(item => item.kills < 1);
      if (missedBossKills.length) fail("Actual full combat path had boss stages without confirmed kills", { config, missedBossKills });
      return {
        weaponId: config.weaponId,
        dept: config.dept,
        secondaryDept: config.secondaryDept,
        supportWeaponId: config.supportWeaponId,
        stageCount: stageSummaries.length,
        totalDamage: Number(stageSummaries.reduce((sum, item) => sum + item.damage, 0).toFixed(2)),
        totalKills: stageSummaries.reduce((sum, item) => sum + item.kills, 0),
        maxHpLost: Math.max.apply(null, stageSummaries.map(item => item.hpLost)),
        finalLevel: state.level,
        finalMaterials: state.materials,
        supportSkill: state.supportSkill && state.supportSkill.type,
        stageSummaries
      };
    }
    fail("Unexpected mode during actual full combat path", { config, mode: state.mode, stage: state.stage && state.stage.id });
  }
  fail("Actual full combat path exceeded guard", config);
}

const V2 = loadGame();
assertPackageAssets();
assertStageModel(V2);
assertShopContract(V2);
assertEnemyBehaviorContract();
assertPauseViewModelContract(V2);
assertFoundationContracts(V2);
assertWeaponMechanicContracts(V2);

const combatSmokes = [
  runCombatSmoke({ label: "marker-base", weaponId: "marker", targetStageId: 1, seconds: 20, minKills: 3 }),
  runCombatSmoke({ label: "thermos-dept", weaponId: "thermos", dept: "product", targetStageId: 4, seconds: 20, minKills: 3 }),
  runCombatSmoke({ label: "sticky-cross-weapon", weaponId: "sticky_note", dept: "general", secondaryDept: "marketing", supportWeaponId: "marker", targetStageId: 14, seconds: 16, minKills: 2 })
];

const pressureStages = [
  runPressureStage({ label: "marker-promotion-boss", weaponId: "marker", dept: "tech", secondaryDept: "product", supportWeaponId: "thermos", targetStageId: 7, seconds: 42, minDamage: 500, minBossDamage: 220, steerOffset: 0.3 }),
  runPressureStage({ label: "thermos-cross-dept-boss", weaponId: "thermos", dept: "product", secondaryDept: "ops", supportWeaponId: "sticky_note", targetStageId: 13, seconds: 42, minDamage: 650, minBossDamage: 260, steerOffset: 0.9 }),
  runPressureStage({ label: "sticky-final-boss", weaponId: "sticky_note", dept: "general", secondaryDept: "marketing", supportWeaponId: "marker", targetStageId: 16, seconds: 45, minDamage: 900, minBossDamage: 320, steerOffset: 1.4 })
];

const actualFullCombatPaths = [
  runActualFullCombatPath({ weaponId: "marker", dept: "tech", secondaryDept: "product", supportWeaponId: "thermos" }),
  runActualFullCombatPath({ weaponId: "thermos", dept: "product", secondaryDept: "ops", supportWeaponId: "sticky_note" }),
  runActualFullCombatPath({ weaponId: "sticky_note", dept: "general", secondaryDept: "marketing", supportWeaponId: "marker" })
];
const actualFullCombatPath = actualFullCombatPaths[0];

const fullRuns = [
  runFullDemoPath({ weaponId: "marker", dept: "tech", secondaryDept: "product", supportWeaponId: "thermos" }),
  runFullDemoPath({ weaponId: "thermos", dept: "product", secondaryDept: "ops", supportWeaponId: "sticky_note" }),
  runFullDemoPath({ weaponId: "sticky_note", dept: "general", secondaryDept: "marketing", supportWeaponId: "marker" })
];

const report = {
  checkedAt: new Date().toISOString(),
  package: "Cubicle-Survivor-demo",
  staticRefs: collectStaticRefs().length,
  enemyThreatTypes: Array.from(new Set(V2.store.stageBlueprints.flatMap(stage => stage.enemyMix.map(item => item.type)))).sort(),
  combatSmokes,
  pressureStages,
  actualFullCombatPaths,
  actualFullCombatPath,
  fullRuns
};

fs.writeFileSync(path.join(baseDir, "demo-qa-report.json"), JSON.stringify(report, null, 2));
console.log("DEMO QA PASSED");
console.log(JSON.stringify(report, null, 2));
