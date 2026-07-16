// ================================================================
// Demo V2.2 isolated thermos fixed-type test.
// Reuses the V2.1 encounter/economy cadence while replacing every
// weapon-facing rule with the thermos condensation / kill-heatwave spec.
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});
  const V2 = CS.V2 || (CS.V2 = {});
  const base = V2.demoV2 && V2.demoV2.markerFixed;
  if (!base) return;

  const MODULES = {
    condensation: {
      id: "condensation", name: "冷凝区域", family: "持续范围控制",
      levels: [
        "每组基础蒸汽结束后，在路径末端留下 1 个持续冷凝区。",
        "每组基础蒸汽沿路径留下前后排列的 2 个冷凝区。",
        "每组基础蒸汽沿完整路径留下 3 个连续冷凝区。",
        "每轮有 15% 概率让整个可视战场短暂进入全屏冷凝。"
      ]
    },
    heatwave: {
      id: "heatwave", name: "击杀热浪", family: "集火击杀转化",
      levels: [
        "主扇面追加 1 次聚焦高温；聚焦击杀会释放一次不连锁热浪。",
        "每轮连续进行 2 次聚焦高温，目标死亡后重新选择低生命目标。",
        "每轮连续进行 3 次聚焦高温，提高击杀与热浪转化机会。",
        "每轮有 15% 概率点杀全场关键目标；被点杀目标正常释放热浪。"
      ]
    }
  };

  // The inherited shop engine keeps stable internal slot/stat ids. V2.2
  // changes their player-facing meaning instead of duplicating the economy.
  const PARTS = {
    tip: { id: "tip", name: "杯盖", stats: ["damage", "pierce"], statNames: { damage: "伤害", pierce: "暴击" } },
    body: { id: "body", name: "杯身", stats: ["attackSpeed", "amount"], statNames: { attackSpeed: "攻速", amount: "数量" } },
    tail: { id: "tail", name: "杯底", stats: ["range", "duration"], statNames: { range: "范围", duration: "持续时间" } }
  };

  function runtime(state) {
    return state.demoV2 && state.demoV2.phase === "thermos-fixed" ? state.demoV2.thermos : null;
  }

  function withBaseRuntime(state, callback) {
    if (!state || !state.demoV2) return null;
    const phase = state.demoV2.phase;
    const marker = state.demoV2.marker;
    state.demoV2.phase = "marker-fixed";
    state.demoV2.marker = state.demoV2.thermos;
    try {
      return callback();
    } finally {
      state.demoV2.phase = phase;
      if (marker === undefined) delete state.demoV2.marker;
      else state.demoV2.marker = marker;
    }
  }

  function normalizeOffers(test) {
    (test && test.offers || []).forEach(function (offer) {
      const part = PARTS[offer.partId];
      if (!part) return;
      offer.partName = part.name;
      offer.statName = part.statNames[offer.statId];
      offer.name = offer.statName + part.name;
      offer.activeStatName = offer.activeStat ? part.statNames[offer.activeStat] : "空槽";
      offer.id = String(offer.id || "component").replace(/^marker-part-/, "thermos-part-");
    });
  }

  function normalizeState(state) {
    const test = runtime(state);
    if (!test) return;
    normalizeOffers(test);
    if (state.stage) {
      state.stage.demoV2Phase = "thermos-fixed";
      state.stage.phase = "保温杯 · 阶段 " + (test.currentPhase || 1);
      if (test.collecting) state.stage.name = "第 " + (state.stage.id || 1) + "/17 关 · 资源回收";
    }
    if (state.flags && state.flags.won) {
      state.lastRewardReason = "保温杯完成：近距扇面、冷凝铺场、聚焦击杀热浪与组件取舍均已结束。";
    }
  }

  function callBase(state, method, args) {
    const value = withBaseRuntime(state, function () {
      return base[method].apply(base, args || []);
    });
    normalizeState(state);
    return value;
  }

  function rebuildParams(state) {
    const test = runtime(state);
    if (!test) return;
    const lid = test.parts.tip.allocations;
    const body = test.parts.body.allocations;
    const cupBase = test.parts.tail.allocations;
    const experience = test.experienceAllocations;
    const condensationLevel = test.modules.copy;
    const heatwaveLevel = test.modules.archive;
    const damage = 18 * Math.pow(1.05, experience.damage || 0) * Math.pow(1.15, lid.damage || 0);
    const rangeScale = Math.pow(1.1, cupBase.range || 0);
    state.activeFormParams = Object.assign({}, state.activeFormParams, {
      damage,
      cooldown: 1.05 * Math.pow(0.88, body.attackSpeed || 0) * Math.pow(0.95, experience.attackSpeed || 0),
      range: 225 * rangeScale * Math.pow(1.05, experience.range || 0),
      amount: 1 + (body.amount || 0),
      width: 205 * Math.pow(1.08, cupBase.range || 0),
      markerFixedHpRegen: (experience.hpRegen || 0) * 0.8,
      markerFixedLifeStealChance: (experience.lifeSteal || 0) * 0.015,
      markerFixedCritChance: Math.min(0.72, (experience.critChance || 0) * 0.03 + (lid.pierce || 0) * 0.05),
      markerFixedArmor: experience.armor || 0,
      markerFixedDodgeChance: Math.min(0.6, (experience.dodge || 0) * 0.03),
      markerFixedLuck: (experience.luck || 0) * 5,
      markerFixedHarvesting: (experience.harvesting || 0) * 5,
      thermosFixedTest: true,
      thermosFixedCondensationLevel: condensationLevel,
      thermosFixedHeatwaveLevel: heatwaveLevel,
      thermosFixedCondensationZones: Math.min(3, condensationLevel),
      thermosFixedBaseSteamDuration: 0.68 * Math.pow(1.16, cupBase.duration || 0),
      thermosFixedBaseSteamDamage: Math.max(1, damage * 0.09),
      thermosFixedBaseSteamSlow: 0.3,
      thermosFixedCondensationDuration: 1.65 * Math.pow(1.27, cupBase.duration || 0),
      thermosFixedCondensationDamage: Math.max(1.3, damage * (condensationLevel >= 4 ? 0.105 : 0.125)),
      thermosFixedFocusHits: Math.min(3, heatwaveLevel),
      thermosFixedFocusDamage: damage * (heatwaveLevel >= 4 ? 1.32 : 1.55),
      thermosFixedHeatwaveDamage: damage * 0.52,
      thermosFixedFullscreenCondensation: condensationLevel >= 4,
      thermosFixedFullscreenIgnition: heatwaveLevel >= 4,
      thermosFixedFullscreenChance: 0.15,
      thermosFixedFullscreenCooldown: 4.8,
      thermosFixedKnockback: 15
    });
    const expectedMaxHp = 74 + (experience.maxHp || 0) * 12;
    if (state.maxHp !== expectedMaxHp) state.maxHp = expectedMaxHp;
    state.hp = Math.min(state.hp, state.maxHp);
    state.player.speed = 220 * Math.pow(1.03, experience.moveSpeed || 0);
    if (state.activeForm) {
      state.activeForm.displayName = "保温杯 · 控场双路线";
      state.activeForm.short = "冷凝铺场处理群体；聚焦击杀把单体优势转成热浪";
      state.activeForm.combatVerb = "靠近敌群，以共享冷却的正面短距扇面调整覆盖位置。";
      state.activeForm.mechanicType = "thermos_fixed_fan";
    }
  }

  function makeRuntime() {
    const test = base.makeRuntime();
    test.pendingFocusHits = [];
    test.fullscreenCondensationReadyAt = 0;
    test.fullscreenIgnitionReadyAt = 0;
    test.fullscreenCondensationTriggers = 0;
    test.fullscreenIgnitionTriggers = 0;
    test.stageFocusKills = 0;
    test.stageHeatwaveTriggers = 0;
    test.totalFocusKills = 0;
    test.totalHeatwaveTriggers = 0;
    return test;
  }

  function currentEncounter(state) { return callBase(state, "currentEncounter", [state]); }
  function totalElapsed(state) { return callBase(state, "totalElapsed", [state]); }

  function startEncounter(state, index) {
    callBase(state, "startEncounter", [state, index]);
    const test = runtime(state);
    if (test) {
      test.stageFocusKills = 0;
      test.stageHeatwaveTriggers = 0;
      test.pendingFocusHits = [];
    }
    rebuildParams(state);
  }

  function makeModuleChoices(state) {
    const test = runtime(state);
    if (!test) return [];
    return ["condensation", "heatwave"].map(function (id) {
      const module = MODULES[id];
      const internalId = id === "condensation" ? "copy" : "archive";
      const level = test.modules[internalId];
      return {
        id, name: module.name, family: module.family, level,
        effect: module.levels[Math.min(3, level)],
        intent: id === "condensation" ? "增加持续区域数量、覆盖路径与留场时间。" : "增加聚焦攻击事件，并把真实击杀转化成非连锁范围热浪。",
        disabled: level >= 4
      };
    });
  }

  function applyModule(state, moduleId, stayInEncounter) {
    const internalId = moduleId === "condensation" ? "copy" : moduleId === "heatwave" ? "archive" : moduleId;
    callBase(state, "applyModule", [state, internalId, stayInEncounter]);
    rebuildParams(state);
  }

  function makeShopOffers(state, preserved, firstOpen) {
    const offers = callBase(state, "makeShopOffers", [state, preserved, firstOpen]) || [];
    normalizeOffers(runtime(state));
    return offers;
  }

  function buyComponent(state, offerId) {
    callBase(state, "buyComponent", [state, offerId]);
    rebuildParams(state);
  }

  function refreshShop(state) { callBase(state, "refreshShop", [state]); }
  function toggleOfferLock(state, offerId) { callBase(state, "toggleOfferLock", [state, offerId]); }
  function closeShop(state) { callBase(state, "closeShop", [state]); rebuildParams(state); }
  function gainExperience(state, amount) { callBase(state, "gainExperience", [state, amount]); }

  function makeExperienceChoices(state) {
    return callBase(state, "makeExperienceChoices", [state]) || [];
  }

  function chooseExperienceStat(state, statId) {
    callBase(state, "chooseExperienceStat", [state, statId]);
    rebuildParams(state);
  }

  function collectLoosePickups(state) { return callBase(state, "collectLoosePickups", [state]); }
  function beginCollection(state) { callBase(state, "beginCollection", [state]); }
  function finishCollection(state) { callBase(state, "finishCollection", [state]); rebuildParams(state); }
  function completeEncounter(state, immediate) { callBase(state, "completeEncounter", [state, immediate]); }
  function tick(state, dt) { callBase(state, "tick", [state, dt]); }

  const thermosFixed = {
    id: "thermos-fixed",
    version: "Demo V2.2",
    visualVersion: "Demo V2.4",
    runtimeKey: "thermos",
    weaponId: "thermos",
    weaponName: "保温杯",
    baseMaxHp: 74,
    title: "保温杯控场双路线",
    subtitle: "共享近距扇面负责站位；冷凝负责铺场；聚焦击杀负责把单体优势转成热浪。",
    phaseCount: base.phaseCount,
    encounterCount: base.encounterCount,
    moduleCount: base.moduleCount,
    shopCount: base.shopCount,
    duration: base.duration,
    collectionDuration: base.collectionDuration,
    guaranteedMaterialTotal: base.guaranteedMaterialTotal,
    moduleTimes: base.moduleTimes,
    shopTimes: base.shopTimes,
    moduleEncounters: base.moduleEncounters,
    shopEncounters: base.shopEncounters,
    encounters: base.encounters,
    waves: base.waves,
    stage: Object.assign({}, base.stage, { demoV2Phase: "thermos-fixed" }),
    modules: MODULES,
    parts: PARTS,
    experienceStats: base.experienceStats,
    qualities: base.qualities,
    qualityIndex: base.qualityIndex,
    nextThreshold: base.nextThreshold,
    uiFramework: {
      weaponSelection: { activeIds: ["thermos"], cardCapacity: 6, registryLabel: "当前武器" },
      itemShop: { enabled: false, mountId: "itemOfferSection", offerCapacity: 4 }
    },
    makeRuntime,
    currentEncounter,
    totalElapsed,
    startEncounter,
    rebuildParams,
    makeModuleChoices,
    applyModule,
    makeShopOffers,
    buyComponent,
    chooseComponentStat: function (state, statId) { return statId; },
    refreshShop,
    toggleOfferLock,
    closeShop,
    gainExperience,
    makeExperienceChoices,
    chooseExperienceStat,
    collectLoosePickups,
    beginCollection,
    finishCollection,
    completeEncounter,
    tick
  };

  V2.demoV2 = Object.assign(V2.demoV2 || {}, { thermosFixed });
  V2.demoV2.fixedTests = Object.assign(V2.demoV2.fixedTests || {}, { "thermos-fixed": thermosFixed });
})();
