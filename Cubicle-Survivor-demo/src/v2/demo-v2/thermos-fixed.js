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

  const MODULE_PROMISES = {
    condensation: {
      now: [
        "蒸汽末端新增 1 个冷凝区；下一场开始拥有第一块可反复利用的减速空间。",
        "冷凝区扩为前后 2 段，开始沿喷射方向铺出安全通道。",
        "冷凝区扩为连续 3 段，单次喷射能够改写整条近战路径。",
        "解锁全屏冷凝：局部铺场之外，间歇冻结整个可视战场。"
      ],
      playstyle: "围绕冷凝区调整站位，让高速敌人进入减速带后再贴近喷射。",
      terminal: "Lv4 · 全屏冷凝：持续经营局部安全区，间歇接管全场节奏。"
    },
    heatwave: {
      now: [
        "每轮追加 1 次聚焦高温；聚焦击杀会从死亡点转发热浪。",
        "聚焦提高到 2 次，并会在击杀后重新寻找低生命目标。",
        "聚焦提高到 3 次，形成稳定的点杀—热浪转发链。",
        "解锁全场点杀：间歇处理关键目标并把死亡继续转成热浪。"
      ],
      playstyle: "把低生命敌人留在团块中心，用聚焦击杀启动范围热浪。",
      terminal: "Lv4 · 全场点杀：局部点杀持续点火，间歇引爆整张战场的关键目标。"
    }
  };

  function desireLoopEnabled(state) {
    return !!(state.demoV2 && state.demoV2.allWeaponDesireLoopPass);
  }

  function componentMountView(partId, statId) {
    if (!statId) return "";
    if (partId === "tip") return statId === "damage"
      ? "杯口外圈的高压喷汽冠"
      : "杯盖顶部的过热校准阀";
    if (partId === "body") return statId === "amount"
      ? "背部压力装置两侧的真实喷汽口"
      : "背部压力装置中央的脉冲调压器";
    return statId === "duration"
      ? "背部冷凝/储热双罐"
      : "杯口外围的宽幅导流环";
  }

  function componentVisualPromise(partId, statId) {
    if (partId === "body" && statId === "amount") return "数量提升会增加可见喷汽口，并让每组蒸汽拥有独立出口";
    if (partId === "tail" && statId === "duration") return "品质提高时双罐液位、冰雾或热汽余辉逐级增强";
    return "品质提高时对应实体的尺寸、亮度与攻击脉冲同步增强";
  }

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
      offer.mountText = componentMountView(offer.partId, offer.statId);
      offer.visualPromise = componentVisualPromise(offer.partId, offer.statId);
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
    const desireLoop = desireLoopEnabled(state);
    const pureMastery = desireLoop ? test.pureRouteCommitted || "" : "";
    const thermalExchange = desireLoop && condensationLevel > 0 && heatwaveLevel > 0;
    const highFrequency = !!(state.demoV2 && state.demoV2.combatDensityPass);
    const deepTriangle = !!(state.demoV2 && state.demoV2.combatTrianglePass);
    const attributeImpact = !!(state.demoV2 && state.demoV2.attributeImpactPass);
    const parity = !!(state.demoV2 && state.demoV2.weaponParityPass);
    const damage = (deepTriangle ? (parity ? 6.75 : 7.2) : highFrequency ? 9.5 : 18) * Math.pow(1.05, experience.damage || 0) * Math.pow(attributeImpact ? 1.18 : 1.15, lid.damage || 0);
    const experienceRangeScale = Math.pow(1.05, experience.range || 0);
    const rangeScale = Math.pow(attributeImpact ? 1.16 : 1.1, cupBase.range || 0) * experienceRangeScale;
    state.activeFormParams = Object.assign({}, state.activeFormParams, {
      damage,
      cooldown: (deepTriangle ? (parity ? 0.49 : 0.46) : highFrequency ? 0.58 : 1.05) * Math.pow(attributeImpact ? 0.84 : 0.88, body.attackSpeed || 0) * Math.pow(0.95, experience.attackSpeed || 0),
      range: 225 * rangeScale,
      amount: 1 + (body.amount || 0),
      width: 205 * Math.pow(attributeImpact ? 1.14 : 1.08, cupBase.range || 0) * experienceRangeScale,
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
      thermosFixedCondensationDuration: 1.65 * Math.pow(1.27, cupBase.duration || 0) * (pureMastery === "copy" ? 1.32 : 1),
      thermosFixedCondensationDamage: Math.max(1.3, damage * (condensationLevel >= 4 ? 0.105 : 0.125) * (pureMastery === "copy" ? 1.34 : 1)),
      thermosFixedFocusHits: Math.min(3, heatwaveLevel),
      thermosFixedFocusDamage: damage * (heatwaveLevel >= 4 ? 1.32 : 1.55),
      thermosFixedHeatwaveDamage: damage * 0.52 * (pureMastery === "archive" ? 1.38 : 1),
      thermosFixedFullscreenCondensation: condensationLevel >= 4,
      thermosFixedFullscreenIgnition: heatwaveLevel >= 4,
      thermosFixedFullscreenChance: 0.15,
      thermosFixedFullscreenCondensationChance: pureMastery === "copy" ? 0.24 : desireLoop ? 0.15 : 0,
      thermosFixedFullscreenIgnitionChance: pureMastery === "archive" ? 0.24 : desireLoop ? 0.15 : 0,
      thermosFixedFullscreenCooldown: 4.8,
      thermosFixedPureCondensationMastery: pureMastery === "copy",
      thermosFixedPureHeatwaveMastery: pureMastery === "archive",
      thermosFixedThermalExchange: thermalExchange,
      thermosFixedThermalExchangeDamage: Math.max(2.4, damage * (0.34 + 0.04 * Math.min(8, condensationLevel + heatwaveLevel))),
      thermosFixedThermalExchangeCooldown: 0.7,
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
    test.bodyFacing = 0;
    test.facingAngle = 0;
    test.condensationRecoil = 0;
    test.heatwaveRecoil = 0;
    test.thermalExchangeReadyAt = 0;
    test.totalThermalExchanges = 0;
    test.totalThermalExchangeHits = 0;
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
    const desireLoop = desireLoopEnabled(state);
    return ["condensation", "heatwave"].map(function (id) {
      const module = MODULES[id];
      const internalId = id === "condensation" ? "copy" : "archive";
      const level = test.modules[internalId];
      if (!desireLoop) {
        return {
          id, name: module.name, family: module.family, level,
          effect: module.levels[Math.min(3, level)],
          intent: id === "condensation" ? "增加持续区域数量、覆盖路径与留场时间。" : "增加聚焦攻击事件，并把真实击杀转化成非连锁范围热浪。",
          disabled: level >= 4
        };
      }
      const otherId = internalId === "copy" ? "archive" : "copy";
      const otherLevel = test.modules[otherId];
      const mastery = level >= 4 && otherLevel === 0 && !test.pureRouteCommitted;
      const willFuse = level === 0 && otherLevel > 0;
      const promise = MODULE_PROMISES[id];
      const nextLevel = Math.min(4, level + 1);
      return {
        id, name: module.name, family: module.family, level,
        effect: mastery
          ? (id === "condensation"
            ? "锁定纯冷凝终局：全屏冷凝更常触发、持续更久且覆盖伤害提高。"
            : "锁定纯热浪终局：全场点杀更常触发、处理目标更多且热浪更强。")
          : module.levels[Math.min(3, level)],
        intent: id === "condensation" ? "增加持续区域数量、覆盖路径与留场时间。" : "增加聚焦攻击事件，并把真实击杀转化成非连锁范围热浪。",
        immediate: mastery ? "立刻强化已经解锁的 Lv4 终局技能，不增加 Lv5。" : promise.now[nextLevel - 1],
        playstyle: promise.playstyle,
        terminalPromise: promise.terminal,
        relationPromise: willFuse
          ? "选择后接通“热交换”：橙色击杀热浪碰到冷青冷凝区时，会爆出白紫温差冲击。"
          : otherLevel > 0
            ? "热交换已接通；冷凝负责储存空间，热浪负责把空间瞬间兑现。"
            : "后续接入另一模块时，两条路线会建立热交换，而不是只并排生效。",
        confirmation: mastery
          ? (id === "condensation" ? "纯冷凝终局已锁定；全屏冷凝获得更强统治力。" : "纯热浪终局已锁定；全场点杀与死亡热浪获得强化。")
          : willFuse ? "热交换已接通；下一场热浪触碰冷凝区时会出现白紫温差冲击。" : promise.now[nextLevel - 1],
        combo: willFuse || otherLevel > 0 ? (willFuse ? "本次选择建立新关系：热交换" : "当前混合关系：热交换") : mastery ? "保持纯路线，不接入另一模块" : "",
        levelLabel: mastery ? "终局专精" : "Lv." + nextLevel,
        mastery,
        disabled: level >= 4 && !mastery
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
    normalizeOffers({ offers });
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
    componentMountView,
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
