// ================================================================
// Demo V2.5 isolated correction-fluid fixed-type test.
// Reuses the V2.1 encounter/economy cadence while replacing the
// weapon-facing rules with the error-state / correction-loop spec.
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});
  const V2 = CS.V2 || (CS.V2 = {});
  const base = V2.demoV2 && V2.demoV2.markerFixed;
  if (!base) return;

  const MODULES = {
    spread: {
      id: "spread", name: "错误扩散", family: "击杀污染 / 战场蔓延",
      levels: [
        "错误过载目标死亡时留下错误区域：低额持续伤害，并为进入的敌人添加错误。",
        "错误区域扩大并延长，持续伤害与错误覆盖更稳定。",
        "邻近错误区域会融合为大型污染区，更快叠加错误。",
        "错误区域达到条件时触发系统崩溃：清除区域并按错误层数爆发。"
      ]
    },
    correction: {
      id: "correction", name: "致命纠错", family: "多目标培养 / 单点处决",
      levels: [
        "每轮同时处理 2 个目标，优先已有错误的敌人。",
        "每轮同时处理 3 个目标，随后优先高生命目标。",
        "每轮同时处理 4 个目标；错误过载目标进入待修正，承受更多修正液伤害。",
        "定期锁定错误层数最高的目标，清除错误并执行最终纠错。"
      ]
    }
  };

  // Stable shop ids are inherited from the proven component engine. Their
  // player-facing meanings are correction-fluid-specific and mutually exclusive.
  const PARTS = {
    tip: { id: "tip", name: "笔头", stats: ["damage", "pierce"], statNames: { damage: "伤害", pierce: "攻速" } },
    body: { id: "body", name: "墨管", stats: ["attackSpeed", "amount"], statNames: { attackSpeed: "暴击", amount: "范围" } },
    tail: { id: "tail", name: "瓶身", stats: ["range", "duration"], statNames: { range: "持续时间", duration: "移动速度" } }
  };

  const WEAPON_CARD = {
    id: "correction_fluid",
    name: "修正液",
    emoji: "▰",
    motif: "制造错误 / 利用错误 / 纠错爆发",
    description: "状态型武器。喷射只负责制造错误，扩散路线污染战场，纠错路线培养并处决关键目标。",
    topology: "correction_fluid_fixed",
    tagDescription: "中距离 · 错误状态 · 白色介质与赛博故障霓虹",
    implemented: true
  };

  function runtime(state) {
    return state.demoV2 && state.demoV2.phase === "correction-fluid-fixed" ? state.demoV2.correctionFluid : null;
  }

  function withBaseRuntime(state, callback) {
    if (!state || !state.demoV2) return null;
    const phase = state.demoV2.phase;
    const marker = state.demoV2.marker;
    state.demoV2.phase = "marker-fixed";
    state.demoV2.marker = state.demoV2.correctionFluid;
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
      offer.id = String(offer.id || "component").replace(/^marker-part-/, "correction-fluid-part-");
    });
  }

  function normalizeState(state) {
    const test = runtime(state);
    if (!test) return;
    normalizeOffers(test);
    if (state.stage) {
      state.stage.demoV2Phase = "correction-fluid-fixed";
      state.stage.phase = "Demo V2.5 修正液固定测试 · 阶段 " + (test.currentPhase || 1);
      if (test.collecting) state.stage.name = "第 " + (state.stage.id || 1) + "/17 关 · 资源回收";
    }
    if (state.flags && state.flags.won) {
      state.lastRewardReason = "修正液 Demo V2.5 完成：错误状态、污染扩散、致命纠错、组件取舍与赛博故障视觉均已完成固定测试。";
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
    const tip = test.parts.tip.allocations;
    const tube = test.parts.body.allocations;
    const bottle = test.parts.tail.allocations;
    const experience = test.experienceAllocations;
    const spreadLevel = test.modules.copy;
    const correctionLevel = test.modules.archive;
    const damage = 7 * Math.pow(1.05, experience.damage || 0) * Math.pow(1.15, tip.damage || 0);
    const cooldown = 0.92 * Math.pow(0.87, tip.pierce || 0) * Math.pow(0.95, experience.attackSpeed || 0);
    const rangeScale = Math.pow(1.1, tube.amount || 0) * (1 + (experience.range || 0) * 0.025);
    const durationScale = Math.pow(1.24, bottle.range || 0);
    const targetCount = correctionLevel >= 3 ? 4 : correctionLevel === 2 ? 3 : correctionLevel === 1 ? 2 : 1;

    state.activeFormParams = {
      damage,
      cooldown: Math.max(0.24, cooldown),
      range: Math.min(560, 360 * rangeScale),
      width: 24 * rangeScale,
      amount: 1,
      pierce: 1,
      markerFixedHpRegen: (experience.hpRegen || 0) * 0.7,
      markerFixedLifeStealChance: (experience.lifeSteal || 0) * 0.012,
      markerFixedCritChance: Math.min(0.72, (experience.critChance || 0) * 0.03 + (tube.attackSpeed || 0) * 0.05),
      markerFixedArmor: experience.armor || 0,
      markerFixedDodgeChance: Math.min(0.6, (experience.dodge || 0) * 0.03),
      markerFixedLuck: (experience.luck || 0) * 5,
      markerFixedHarvesting: (experience.harvesting || 0) * 5,
      correctionFluidFixedTest: true,
      correctionSpreadLevel: spreadLevel,
      correctionFatalLevel: correctionLevel,
      correctionTargetCount: targetCount,
      correctionErrorDuration: 4.8 * durationScale * (correctionLevel >= 3 ? 1.35 : 1),
      correctionSlowMultiplier: 0.82,
      correctionVulnerability: correctionLevel >= 3 ? 1.5 : 1.28,
      correctionAreaRadius: (68 + spreadLevel * 10) * rangeScale,
      correctionAreaDuration: (3.2 + (spreadLevel >= 2 ? 1.1 : 0)) * durationScale,
      correctionAreaDamage: Math.max(0.8, damage * (spreadLevel >= 2 ? 0.24 : 0.17)),
      correctionAreaTick: spreadLevel >= 3 ? 0.42 : 0.7,
      correctionAreaMerge: spreadLevel >= 3,
      correctionCrashEnabled: spreadLevel >= 4,
      correctionCrashAreaThreshold: 3,
      correctionCrashCooldown: 5.4,
      correctionCrashDamage: damage * 3.25,
      correctionFinalEnabled: correctionLevel >= 4,
      correctionFinalCooldown: 3.8,
      correctionFinalDamage: damage * 2.3,
      correctionFinalPercentPerStack: 0.025,
      correctionFinalBlastRadius: 72 * rangeScale,
      correctionFinalBlastDamage: damage * 1.05
    };
    state.maxHp = 88 + (experience.maxHp || 0) * 11;
    state.hp = Math.min(state.hp, state.maxHp);
    state.player.speed = 222 * Math.pow(1.03, experience.moveSpeed || 0) * Math.pow(1.07, bottle.duration || 0);
    state.activeForm = Object.assign({}, state.activeForm || {}, {
      weaponId: "correction_fluid",
      displayName: "修正液 · 双路线固定测试",
      short: "喷射制造错误；扩散把击杀变成污染源；纠错把错误目标变成处决资源",
      combatVerb: "先标记并培养错误，再选择让错误蔓延或集中完成最终纠错。",
      mechanicType: "correction_fluid_fixed",
      theme: state.activeForm && state.activeForm.theme || { phase: { label: "Demo V2.5", weaponStageShort: "错误双路线" } }
    });
  }

  function makeRuntime() {
    const test = base.makeRuntime();
    test.nextAreaId = 1;
    test.crashReadyAt = 0;
    test.finalReadyAt = 0;
    test.activeErrorAreas = 0;
    test.largestErrorArea = 0;
    test.totalErrorsApplied = 0;
    test.totalOverloads = 0;
    test.totalAreasCreated = 0;
    test.totalAreaMerges = 0;
    test.totalSystemCrashes = 0;
    test.totalFinalCorrections = 0;
    test.totalFinalKills = 0;
    return test;
  }

  function currentEncounter(state) { return callBase(state, "currentEncounter", [state]); }
  function totalElapsed(state) { return callBase(state, "totalElapsed", [state]); }

  function startEncounter(state, index) {
    callBase(state, "startEncounter", [state, index]);
    const test = runtime(state);
    if (test) {
      test.activeErrorAreas = 0;
      test.largestErrorArea = 0;
      test.crashReadyAt = 0;
      test.finalReadyAt = 0;
    }
    rebuildParams(state);
  }

  function makeModuleChoices(state) {
    const test = runtime(state);
    if (!test) return [];
    return ["spread", "correction"].map(function (id) {
      const module = MODULES[id];
      const internalId = id === "spread" ? "copy" : "archive";
      const level = test.modules[internalId];
      return {
        id, name: module.name, family: module.family, level,
        effect: module.levels[Math.min(3, level)],
        intent: id === "spread" ? "把错误过载目标的死亡变成新的污染源，Lv4 以系统崩溃回收场上区域。" : "增加同时培养的错误目标，Lv4 以最终纠错集中处理最高错误目标。",
        disabled: level >= 4
      };
    });
  }

  function applyModule(state, moduleId, stayInEncounter) {
    const internalId = moduleId === "spread" ? "copy" : moduleId === "correction" ? "archive" : moduleId;
    callBase(state, "applyModule", [state, internalId, stayInEncounter]);
    rebuildParams(state);
  }

  function makeShopOffers(state, preserved, firstOpen) {
    const offers = callBase(state, "makeShopOffers", [state, preserved, firstOpen]) || [];
    normalizeOffers(runtime(state));
    return offers;
  }
  function buyComponent(state, offerId) { callBase(state, "buyComponent", [state, offerId]); rebuildParams(state); }
  function chooseComponentStat(state, statId) { callBase(state, "chooseComponentStat", [state, statId]); rebuildParams(state); }
  function refreshShop(state) { callBase(state, "refreshShop", [state]); }
  function toggleOfferLock(state, offerId) { callBase(state, "toggleOfferLock", [state, offerId]); }
  function closeShop(state) { callBase(state, "closeShop", [state]); rebuildParams(state); }
  function gainExperience(state, amount) { callBase(state, "gainExperience", [state, amount]); }
  function makeExperienceChoices(state) {
    return (callBase(state, "makeExperienceChoices", [state]) || []).map(function (choice) {
      if (choice.id === "damage") choice.effect = "修正液喷射、错误区域与纠错爆发伤害 +5%";
      if (choice.id === "range") choice.effect = "喷射距离、错误区域与最终纠错爆炸范围小幅提高";
      return choice;
    });
  }
  function chooseExperienceStat(state, statId) { callBase(state, "chooseExperienceStat", [state, statId]); rebuildParams(state); }
  function collectLoosePickups(state) { return callBase(state, "collectLoosePickups", [state]); }
  function beginCollection(state) { callBase(state, "beginCollection", [state]); }
  function finishCollection(state) { callBase(state, "finishCollection", [state]); rebuildParams(state); }
  function completeEncounter(state, immediate) { callBase(state, "completeEncounter", [state, immediate]); }
  function tick(state, dt) { callBase(state, "tick", [state, dt]); }

  const correctionFluidFixed = {
    id: "correction-fluid-fixed",
    version: "Demo V2.5",
    visualVersion: "Demo V2.5",
    runtimeKey: "correctionFluid",
    weaponId: "correction_fluid",
    weaponName: "修正液",
    weaponStageShort: "错误双路线",
    baseMaxHp: 88,
    title: "修正液错误系统固定测试",
    subtitle: "白色修正介质负责留下可读状态；青与品红故障霓虹负责提示错误、污染与纠错爆发。",
    weaponCard: WEAPON_CARD,
    moduleLabels: ["错误扩散", "致命纠错"],
    resultEventLabels: ["系统崩溃", "最终纠错"],
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
    stage: Object.assign({}, base.stage, { demoV2Phase: "correction-fluid-fixed" }),
    modules: MODULES,
    parts: PARTS,
    experienceStats: base.experienceStats,
    qualities: base.qualities,
    qualityIndex: base.qualityIndex,
    nextThreshold: base.nextThreshold,
    uiFramework: {
      weaponSelection: { activeIds: ["correction_fluid"], cardCapacity: 8, registryLabel: "当前验证武器" },
      itemShop: { enabled: false, mountId: "itemOfferSection", offerCapacity: 4, reserved: true }
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
    chooseComponentStat,
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

  V2.demoV2 = Object.assign(V2.demoV2 || {}, { correctionFluidFixed });
  V2.demoV2.fixedTests = Object.assign(V2.demoV2.fixedTests || {}, { "correction-fluid-fixed": correctionFluidFixed });
})();
