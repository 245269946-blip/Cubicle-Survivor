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

  const MODULE_PROMISES = {
    spread: {
      now: [
        "错误过载目标死亡会留下第一块错误区域，死亡第一次变成新的状态源。",
        "错误区域扩大并延长，开始稳定感染后续进入的敌人。",
        "相邻错误区域可以融合，污染会从散点长成大型故障空间。",
        "解锁系统崩溃：集中回收多个错误区域并按错误层数爆发。"
      ],
      playstyle: "优先处理处于团块中的过载目标，用死亡位置决定污染网络的形状。",
      terminal: "Lv4 · 系统崩溃：先经营污染战场，再把所有错误区域一次性兑现。"
    },
    correction: {
      now: [
        "每轮同时培养 2 个错误目标，状态制造速度立刻提高。",
        "每轮同时培养 3 个目标，并继续追踪已有错误与高生命敌人。",
        "每轮同时培养 4 个目标；过载目标进入更稳定的待修正窗口。",
        "解锁最终纠错：定期锁定最高错误目标，清空状态并集中爆发。"
      ],
      playstyle: "保留一个高错误核心目标，靠高频喷射把它培养成可主动兑现的处决资源。",
      terminal: "Lv4 · 最终纠错：多目标制造错误，周期性集中清算最高错误目标。"
    }
  };

  function desireLoopEnabled(state) {
    return !!(state.demoV2 && state.demoV2.allWeaponDesireLoopPass);
  }

  function componentMountView(partId, statId) {
    if (!statId) return "";
    if (partId === "tip") return statId === "damage"
      ? "人物外圈的真实修正液喷头"
      : "喷头根部的高频挤压泵";
    if (partId === "body") return statId === "attackSpeed"
      ? "肩背分配器上的故障扫描核心"
      : "肩背分配器两侧的广域喷口";
    return statId === "range"
      ? "背部修正液储液囊"
      : "储液囊与腰部相连的移动供液软管";
  }

  function componentVisualPromise(partId, statId) {
    if (partId === "tip") return "品质提高时真实喷头数量与喷射脉冲更清晰，白色介质仍从喷头出发";
    if (partId === "tail" && statId === "range") return "品质提高时储液囊液位和残留时间辉光逐级提升";
    return "品质提高时对应实体结构更大、更亮，并和错误状态反馈同步";
  }

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
      offer.mountText = componentMountView(offer.partId, offer.statId);
      offer.visualPromise = componentVisualPromise(offer.partId, offer.statId);
    });
  }

  function normalizeState(state) {
    const test = runtime(state);
    if (!test) return;
    normalizeOffers(test);
    if (state.stage) {
      state.stage.demoV2Phase = "correction-fluid-fixed";
      state.stage.phase = "修正液 · 阶段 " + (test.currentPhase || 1);
      if (test.collecting) state.stage.name = "第 " + (state.stage.id || 1) + "/17 关 · 资源回收";
    }
    if (state.flags && state.flags.won) {
      state.lastRewardReason = "修正液完成：错误状态、污染扩散、致命纠错、组件取舍与赛博故障视觉均已结束。";
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
    const desireLoop = desireLoopEnabled(state);
    const pureMastery = desireLoop ? test.pureRouteCommitted || "" : "";
    const cascadingRollback = desireLoop && spreadLevel > 0 && correctionLevel > 0;
    const highFrequency = !!(state.demoV2 && state.demoV2.combatDensityPass);
    const deepTriangle = !!(state.demoV2 && state.demoV2.combatTrianglePass);
    const openingPass = !!(state.demoV2 && state.demoV2.correctionOpeningPass);
    const attributeImpact = !!(state.demoV2 && state.demoV2.attributeImpactPass);
    const parity = !!(state.demoV2 && state.demoV2.weaponParityPass);
    const damage = (openingPass ? (parity ? 6.4 : 5.8) : deepTriangle ? 5 : highFrequency ? 6.5 : 11) * Math.pow(1.05, experience.damage || 0) * Math.pow(attributeImpact ? 1.18 : 1.15, tip.damage || 0);
    const cooldown = (openingPass ? (parity ? 0.245 : 0.27) : deepTriangle ? 0.29 : highFrequency ? 0.36 : 0.62) * Math.pow(attributeImpact ? 0.84 : 0.87, tip.pierce || 0) * Math.pow(0.95, experience.attackSpeed || 0);
    const rangeScale = Math.pow(attributeImpact ? 1.14 : 1.1, tube.amount || 0) * Math.pow(1.05, experience.range || 0);
    const durationScale = Math.pow(1.24, bottle.range || 0);
    const targetCount = correctionLevel >= 3 ? 4 : correctionLevel === 2 ? 3 : correctionLevel === 1 ? 2 : 1;

    state.activeFormParams = {
      damage,
      cooldown: Math.max(deepTriangle ? 0.14 : highFrequency ? 0.18 : 0.24, cooldown),
      range: Math.min(attributeImpact ? 620 : 560, 360 * rangeScale),
      width: 24 * rangeScale,
      amount: 1,
      pierce: 1,
      markerFixedHpRegen: (experience.hpRegen || 0) * 0.8,
      markerFixedLifeStealChance: (experience.lifeSteal || 0) * 0.015,
      markerFixedCritChance: Math.min(0.72, (experience.critChance || 0) * 0.03 + (tube.attackSpeed || 0) * 0.05),
      markerFixedArmor: experience.armor || 0,
      markerFixedDodgeChance: Math.min(0.6, (experience.dodge || 0) * 0.03),
      markerFixedLuck: (experience.luck || 0) * 5,
      markerFixedHarvesting: (experience.harvesting || 0) * 5,
      correctionFluidFixedTest: true,
      correctionSpreadLevel: spreadLevel,
      correctionFatalLevel: correctionLevel,
      correctionTargetCount: targetCount,
      correctionOpeningOverspray: openingPass && correctionLevel === 0,
      correctionOpeningOversprayRadius: (parity ? 78 : 68) * Math.min(attributeImpact ? 1.45 : 1.25, rangeScale),
      correctionOpeningOversprayDamageScale: parity ? 0.62 : 0.52,
      correctionErrorDuration: 5.3 * durationScale * (correctionLevel >= 3 ? 1.35 : 1),
      correctionSlowMultiplier: 0.82,
      correctionVulnerability: correctionLevel >= 3 ? 1.5 : parity ? 1.32 : 1.28,
      correctionAreaRadius: Math.min(attributeImpact ? 165 : 140, (82 + spreadLevel * 8) * (1 + (rangeScale - 1) * (attributeImpact ? 0.7 : 0.45))),
      correctionAreaDuration: (3.2 + (spreadLevel >= 2 ? 1.1 : 0)) * durationScale,
      correctionAreaDamage: Math.max(0.7, damage * (spreadLevel >= 2 ? 0.16 : 0.12)),
      correctionAreaTick: spreadLevel >= 3 ? 0.58 : 0.72,
      correctionAreaMerge: spreadLevel >= 3,
      correctionCrashEnabled: spreadLevel >= 4,
      correctionCrashAreaThreshold: pureMastery === "copy" ? 2 : 3,
      correctionCrashCooldown: pureMastery === "copy" ? 4.2 : 5.4,
      correctionCrashDamage: damage * (pureMastery === "copy" ? 4.15 : 3.25),
      correctionFinalEnabled: correctionLevel >= 4,
      correctionFinalCooldown: pureMastery === "archive" ? 3 : 3.8,
      correctionFinalDamage: damage * (pureMastery === "archive" ? 2.9 : 2.3),
      correctionFinalPercentPerStack: pureMastery === "archive" ? 0.035 : 0.025,
      correctionFinalBlastRadius: 72 * rangeScale * (pureMastery === "archive" ? 1.2 : 1),
      correctionFinalBlastDamage: damage * (pureMastery === "archive" ? 1.4 : 1.05),
      correctionCascadingRollback: cascadingRollback,
      correctionRollbackDamage: Math.max(1.8, damage * (0.26 + 0.035 * Math.min(8, spreadLevel + correctionLevel))),
      correctionRollbackCooldown: 0.82,
      correctionPureSpreadMastery: pureMastery === "copy",
      correctionPureFatalMastery: pureMastery === "archive"
    };
    state.maxHp = 64 + (experience.maxHp || 0) * 12;
    state.hp = Math.min(state.hp, state.maxHp);
    state.player.speed = 222 * Math.pow(1.03, experience.moveSpeed || 0) * Math.pow(1.07, bottle.duration || 0);
    state.activeForm = Object.assign({}, state.activeForm || {}, {
      weaponId: "correction_fluid",
      displayName: "修正液 · 错误双路线",
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
    test.bossAreaLeakReadyAt = 0;
    test.activeErrorAreas = 0;
    test.largestErrorArea = 0;
    test.totalErrorsApplied = 0;
    test.totalOverloads = 0;
    test.totalAreasCreated = 0;
    test.totalAreaMerges = 0;
    test.totalSystemCrashes = 0;
    test.totalFinalCorrections = 0;
    test.totalFinalKills = 0;
    test.bodyFacing = 0;
    test.facingAngle = 0;
    test.weaponVisualTime = 0;
    test.weaponVisualAngles = [];
    test.rollbackReadyAt = 0;
    test.totalRollbacks = 0;
    test.totalRollbackHits = 0;
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
    const desireLoop = desireLoopEnabled(state);
    return ["spread", "correction"].map(function (id) {
      const module = MODULES[id];
      const internalId = id === "spread" ? "copy" : "archive";
      const level = test.modules[internalId];
      if (!desireLoop) {
        return {
          id, name: module.name, family: module.family, level,
          effect: module.levels[Math.min(3, level)],
          intent: id === "spread" ? "把错误过载目标的死亡变成新的污染源，Lv4 以系统崩溃回收场上区域。" : "增加同时培养的错误目标，Lv4 以最终纠错集中处理最高错误目标。",
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
          ? (id === "spread" ? "锁定纯扩散终局：系统崩溃更快、更广、爆发更高。" : "锁定纯纠错终局：最终纠错更频繁、百分比清算与爆炸更强。")
          : module.levels[Math.min(3, level)],
        intent: id === "spread" ? "把错误过载目标的死亡变成新的污染源，Lv4 以系统崩溃回收场上区域。" : "增加同时培养的错误目标，Lv4 以最终纠错集中处理最高错误目标。",
        immediate: mastery ? "立刻强化已经解锁的 Lv4 终局技能，不增加 Lv5。" : promise.now[nextLevel - 1],
        playstyle: promise.playstyle,
        terminalPromise: promise.terminal,
        relationPromise: willFuse
          ? "选择后接通“级联回滚”：过载目标死亡时，既有污染区会同步闪回、伤害并追加错误。"
          : otherLevel > 0
            ? "级联回滚已接通；单体错误培养会反向驱动整张污染网络。"
            : "后续接入另一模块时，过载死亡会让既有污染区同步回滚。",
        confirmation: mastery
          ? (id === "spread" ? "纯扩散终局已锁定；系统崩溃获得更强战场回收能力。" : "纯纠错终局已锁定；最终纠错获得更强关键目标清算。")
          : willFuse ? "级联回滚已接通；下一次过载死亡会让旧污染区同步闪回。" : promise.now[nextLevel - 1],
        combo: willFuse || otherLevel > 0 ? (willFuse ? "本次选择建立新关系：级联回滚" : "当前混合关系：级联回滚") : mastery ? "保持纯路线，不接入另一模块" : "",
        levelLabel: mastery ? "终局专精" : "Lv." + nextLevel,
        mastery,
        disabled: level >= 4 && !mastery
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
    normalizeOffers({ offers });
    return offers;
  }
  function buyComponent(state, offerId) { callBase(state, "buyComponent", [state, offerId]); rebuildParams(state); }
  function chooseComponentStat(state, statId) { callBase(state, "chooseComponentStat", [state, statId]); rebuildParams(state); }
  function refreshShop(state) { callBase(state, "refreshShop", [state]); }
  function toggleOfferLock(state, offerId) { callBase(state, "toggleOfferLock", [state, offerId]); }
  function closeShop(state) { callBase(state, "closeShop", [state]); rebuildParams(state); }
  function gainExperience(state, amount) { callBase(state, "gainExperience", [state, amount]); }
  function makeExperienceChoices(state) {
    return callBase(state, "makeExperienceChoices", [state]) || [];
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
    baseMaxHp: 64,
    title: "修正液错误系统",
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
    componentMountView,
    experienceStats: base.experienceStats,
    qualities: base.qualities,
    qualityIndex: base.qualityIndex,
    nextThreshold: base.nextThreshold,
    uiFramework: {
      weaponSelection: { activeIds: ["correction_fluid"], cardCapacity: 8, registryLabel: "当前武器" },
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
