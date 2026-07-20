// ================================================================
// Demo V2.3 isolated scissors fixed-type test.
// Reuses the V2.1 encounter/economy cadence while replacing the
// weapon-facing rules with one locked melee action timeline.
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});
  const V2 = CS.V2 || (CS.V2 = {});
  const base = V2.demoV2 && V2.demoV2.markerFixed;
  if (!base) return;

  const MODULES = {
    closed: {
      id: "closed", name: "合刃", family: "窄线贴身突刺",
      levels: [
        "每轮追加 1 次窄线合刃突刺。",
        "每轮沿锁定方向连续突刺 2 次，距离与宽度小幅提高。",
        "每轮沿锁定方向连续突刺 3 次。",
        "三次突刺后追加一次长而宽的裁断，造成高伤害并固定减速。"
      ]
    },
    open: {
      id: "open", name: "张刃", family: "短宽扇面连剪",
      levels: [
        "每轮追加 2 次正面短宽扇面剪切。",
        "每轮追加 4 次扇面剪切，覆盖略微扩大。",
        "每轮追加 6 次扇面剪切；中心目标可吃满整段。",
        "六次剪切后追加合剪终结，按本轮命中层数触发处决。"
      ]
    }
  };

  // Keep the proven component/economy engine's stable internal ids. Player-
  // facing meanings are scissors-specific and remain mutually exclusive.
  const PARTS = {
    tip: { id: "tip", name: "剪刃", stats: ["damage", "pierce"], statNames: { damage: "伤害", pierce: "暴击" } },
    body: { id: "body", name: "转轴", stats: ["attackSpeed", "amount"], statNames: { attackSpeed: "攻速", amount: "闪避" } },
    tail: { id: "tail", name: "手柄", stats: ["range", "duration"], statNames: { range: "范围", duration: "移速" } }
  };

  const WEAPON_CARD = {
    id: "scissors",
    name: "剪刀",
    emoji: "✂",
    motif: "贴近 / 穿梭 / 裁断",
    description: "第一把纯近战武器。用轻步穿入敌群，以合刃突刺或张刃连剪完成一整轮动作。",
    topology: "scissors_fixed_melee",
    tagDescription: "高机动 · 高闪避 · 高近战伤害",
    implemented: true
  };

  function runtime(state) {
    return state.demoV2 && state.demoV2.phase === "scissors-fixed" ? state.demoV2.scissors : null;
  }

  function withBaseRuntime(state, callback) {
    if (!state || !state.demoV2) return null;
    const phase = state.demoV2.phase;
    const marker = state.demoV2.marker;
    state.demoV2.phase = "marker-fixed";
    state.demoV2.marker = state.demoV2.scissors;
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
      offer.id = String(offer.id || "component").replace(/^marker-part-/, "scissors-part-");
    });
  }

  function normalizeState(state) {
    const test = runtime(state);
    if (!test) return;
    normalizeOffers(test);
    if (state.stage) {
      state.stage.demoV2Phase = "scissors-fixed";
      state.stage.phase = "剪刀 · 阶段 " + (test.currentPhase || 1);
      if (test.collecting) state.stage.name = "第 " + (state.stage.id || 1) + "/17 关 · 资源回收";
    }
    if (state.flags && state.flags.won) {
      state.lastRewardReason = "剪刀完成：近战时间线、轻步突进、合刃/张刃路线、组件取舍与低血安全区均已完成。";
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
    const blade = test.parts.tip.allocations;
    const pivot = test.parts.body.allocations;
    const handle = test.parts.tail.allocations;
    const experience = test.experienceAllocations;
    const closedLevel = test.modules.copy;
    const openLevel = test.modules.archive;
    // V3.1 redistributes melee output across more visible cuts. V3.0 and the
    // isolated historical entry retain their previous values.
    const highFrequency = !!(state.demoV2 && state.demoV2.combatDensityPass);
    const damage = (highFrequency ? 13.5 : 25) * Math.pow(1.05, experience.damage || 0) * Math.pow(1.15, blade.damage || 0);
    const speedScale = Math.max(0.55, Math.pow(0.9, pivot.attackSpeed || 0) * Math.pow(0.96, experience.attackSpeed || 0));
    const rangeScale = Math.min(1.38, Math.pow(1.09, handle.range || 0) * Math.pow(1.05, experience.range || 0));
    const thrustCount = Math.min(3, closedLevel);
    const cutCount = openLevel >= 3 ? 6 : openLevel === 2 ? 4 : openLevel === 1 ? 2 : 0;
    const thrustEnd = thrustCount ? 0.06 + (thrustCount - 1) * 0.11 : 0;
    const openStart = thrustCount ? thrustEnd + 0.16 : 0.06;
    const openEnd = cutCount ? openStart + (cutCount - 1) * 0.085 : 0;
    const specialEnd = closedLevel >= 4 ? thrustEnd + 0.14 : 0;
    const finaleEnd = openLevel >= 4 ? openEnd + 0.14 : 0;
    const actionDuration = Math.max(0.16, thrustEnd, openEnd, specialEnd, finaleEnd) * speedScale;
    const cooldown = highFrequency
      ? Math.max(0.3, actionDuration * 0.82 + 0.16 * speedScale)
      : Math.max(0.42, actionDuration + 0.28 * speedScale);
    const maxHp = 58 + (experience.maxHp || 0) * 12;

    state.activeFormParams = {
      damage,
      cooldown,
      range: Math.min(252, (190 + closedLevel * 8) * rangeScale),
      width: 26 * rangeScale,
      amount: 1,
      pierce: 99,
      markerFixedHpRegen: (experience.hpRegen || 0) * 0.8,
      markerFixedLifeStealChance: (experience.lifeSteal || 0) * 0.015,
      markerFixedCritChance: Math.min(0.72, (experience.critChance || 0) * 0.03 + (blade.pierce || 0) * 0.055),
      markerFixedArmor: experience.armor || 0,
      markerFixedDodgeChance: Math.min(0.62, (experience.dodge || 0) * 0.03 + (pivot.amount || 0) * 0.05),
      markerFixedLuck: (experience.luck || 0) * 5,
      markerFixedHarvesting: (experience.harvesting || 0) * 5,
      scissorsFixedTest: true,
      scissorsClosedLevel: closedLevel,
      scissorsOpenLevel: openLevel,
      scissorsThrustCount: thrustCount,
      scissorsCutCount: cutCount,
      scissorsSever: closedLevel >= 4,
      scissorsFinale: openLevel >= 4,
      scissorsActionScale: speedScale,
      scissorsActionDuration: actionDuration,
      scissorsThrustRange: Math.min(252, (190 + closedLevel * 8) * rangeScale),
      scissorsThrustWidth: Math.min(54, 32 * rangeScale + closedLevel * 2),
      scissorsThrustDamage: damage * 1.08,
      scissorsFanRange: Math.min(205, (140 + openLevel * 7) * rangeScale),
      scissorsFanHalfAngle: Math.min(0.78, 0.54 + openLevel * 0.045 + (rangeScale - 1) * 0.08),
      scissorsFanDamage: damage * 0.5,
      scissorsSeverRange: Math.min(305, 246 * rangeScale),
      scissorsSeverWidth: Math.min(92, 64 * rangeScale),
      scissorsSeverDamage: damage * 1.7,
      scissorsSeverSlow: 0.35,
      scissorsSeverSlowDuration: 1.75,
      scissorsFinaleDamage: damage * 1.35,
      scissorsExecuteBase: 0.05,
      scissorsExecutePerHit: 0.02,
      scissorsDashDistance: 82,
      scissorsDashDuration: 0.18,
      scissorsDashWindow: 0.22,
      scissorsDashChargeTime: 7.2,
      scissorsDashRoundCharge: 0.13,
      scissorsShelterRadius: 132,
      scissorsShelterDuration: 3.2,
      scissorsShelterCooldown: 18
    };
    state.maxHp = maxHp;
    state.hp = Math.min(state.hp, state.maxHp);
    state.player.speed = 250 * Math.pow(1.03, experience.moveSpeed || 0) * Math.pow(1.07, handle.duration || 0);
    state.activeForm = Object.assign({}, state.activeForm || {}, {
      weaponId: "scissors",
      displayName: "剪刀 · 近战双路线",
      short: "轻步负责进场；合刃负责窄线贯穿；张刃负责短宽连剪",
      combatVerb: "贴近敌人完成一整轮锁向剪切，再以高机动重新选择进场角度。",
      mechanicType: "scissors_fixed_melee",
      theme: state.activeForm && state.activeForm.theme || { phase: { label: "Demo V2.3", weaponStageShort: "贴身双路线" } }
    });
  }

  function makeRuntime() {
    const test = base.makeRuntime();
    test.pendingActions = [];
    test.activeRound = false;
    test.roundSerial = 0;
    test.roundAngle = 0;
    test.roundTargetIds = [];
    test.openHitsByEnemy = {};
    test.dashCharge = 0;
    test.dashReady = false;
    test.dashWindow = 0;
    test.dashMotionTime = 0;
    test.dashMotionDuration = 0;
    test.dashMotionVx = 0;
    test.dashMotionVy = 0;
    test.dashActionDelay = 0;
    test.dashAvoidedIds = {};
    test.facingAngle = 0;
    test.weaponVisualAngle = 0;
    test.weaponVisualTime = 0;
    test.weaponVisualKind = "idle";
    test.shelterActive = false;
    test.shelterTime = 0;
    test.shelterCooldown = 0;
    test.shelterArmed = true;
    test.totalDashes = 0;
    test.totalDashDodges = 0;
    test.totalClosedHits = 0;
    test.totalOpenHits = 0;
    test.totalSevers = 0;
    test.totalFinales = 0;
    test.totalExecutions = 0;
    test.totalShelterTriggers = 0;
    test.totalBlockedShots = 0;
    return test;
  }

  function currentEncounter(state) { return callBase(state, "currentEncounter", [state]); }
  function totalElapsed(state) { return callBase(state, "totalElapsed", [state]); }

  function startEncounter(state, index) {
    callBase(state, "startEncounter", [state, index]);
    const test = runtime(state);
    if (test) {
      test.pendingActions = [];
      test.activeRound = false;
      test.openHitsByEnemy = {};
      test.dashAvoidedIds = {};
    }
    rebuildParams(state);
  }

  function makeModuleChoices(state) {
    const test = runtime(state);
    if (!test) return [];
    return ["closed", "open"].map(function (id) {
      const module = MODULES[id];
      const internalId = id === "closed" ? "copy" : "archive";
      const level = test.modules[internalId];
      return {
        id, name: module.name, family: module.family, level,
        effect: module.levels[Math.min(3, level)],
        intent: id === "closed" ? "增加窄线突刺次数，Lv4 以裁断减速收尾。" : "增加短宽扇面剪切次数，Lv4 以合剪处决收尾。",
        disabled: level >= 4
      };
    });
  }

  function applyModule(state, moduleId, stayInEncounter) {
    const internalId = moduleId === "closed" ? "copy" : moduleId === "open" ? "archive" : moduleId;
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
    return callBase(state, "makeExperienceChoices", [state]) || [];
  }
  function chooseExperienceStat(state, statId) { callBase(state, "chooseExperienceStat", [state, statId]); rebuildParams(state); }
  function collectLoosePickups(state) { return callBase(state, "collectLoosePickups", [state]); }
  function beginCollection(state) { callBase(state, "beginCollection", [state]); }
  function finishCollection(state) { callBase(state, "finishCollection", [state]); rebuildParams(state); }
  function completeEncounter(state, immediate) { callBase(state, "completeEncounter", [state, immediate]); }

  function tick(state, dt) {
    callBase(state, "tick", [state, dt]);
    const test = runtime(state);
    const params = state.activeFormParams || {};
    if (!test || state.mode !== "combat") return;
    const delta = dt || 0;
    if (!test.collecting && !test.dashReady) {
      test.dashCharge = Math.min(1, (test.dashCharge || 0) + delta / Math.max(1, params.scissorsDashChargeTime || 7.2));
      if (test.dashCharge >= 1) test.dashReady = true;
    }
    test.dashWindow = Math.max(0, (test.dashWindow || 0) - delta);
    test.weaponVisualTime = Math.max(0, (test.weaponVisualTime || 0) - delta);
    test.shelterTime = Math.max(0, (test.shelterTime || 0) - delta);
    test.shelterCooldown = Math.max(0, (test.shelterCooldown || 0) - delta);
    test.shelterActive = test.shelterTime > 0;
    if (state.hp > state.maxHp * 0.3) test.shelterArmed = true;
  }

  function onRoundComplete(state, uniqueTargets) {
    const test = runtime(state);
    const params = state.activeFormParams || {};
    if (!test) return;
    const multiBonus = Math.min(0.06, Math.max(0, (uniqueTargets || 0) - 1) * 0.015);
    test.dashCharge = Math.min(1, (test.dashCharge || 0) + (params.scissorsDashRoundCharge || 0.13) + multiBonus);
    if (test.dashCharge >= 1) test.dashReady = true;
  }

  function onPlayerDamaged(state) {
    const test = runtime(state);
    const params = state.activeFormParams || {};
    if (!test || !test.shelterArmed || test.shelterCooldown > 0 || state.hp > state.maxHp * 0.3) return false;
    test.shelterActive = true;
    test.shelterTime = params.scissorsShelterDuration || 3.2;
    test.shelterCooldown = params.scissorsShelterCooldown || 18;
    test.shelterArmed = false;
    test.totalShelterTriggers += 1;
    return true;
  }

  function blocksHostileProjectile(state, projectile) {
    const test = runtime(state);
    const params = state.activeFormParams || {};
    if (!test || !test.shelterActive || !projectile) return false;
    const radius = params.scissorsShelterRadius || 108;
    const inside = Math.hypot(projectile.x - state.player.x, projectile.y - state.player.y) <= radius;
    const originOutside = Math.hypot((projectile.originX || projectile.x) - state.player.x, (projectile.originY || projectile.y) - state.player.y) > radius;
    if (!inside || !originOutside) return false;
    test.totalBlockedShots += 1;
    return true;
  }

  const scissorsFixed = {
    id: "scissors-fixed",
    version: "Demo V2.3",
    visualVersion: "Demo V2.4",
    runtimeKey: "scissors",
    weaponId: "scissors",
    weaponName: "剪刀",
    weaponStageShort: "贴身双路线",
    baseMaxHp: 58,
    title: "剪刀近战双路线",
    subtitle: "轻步负责进场；合刃负责窄线贯穿；张刃负责短宽连剪与处决。",
    weaponCard: WEAPON_CARD,
    fixedItem: {
      id: "low-hp-shelter", name: "临时安全区", trigger: "生命首次跌至 30% 以下",
      effect: "短时间拦截从区域外射入的敌方弹体；区域内敌人、近战接触与环境伤害照常生效。"
    },
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
    stage: Object.assign({}, base.stage, { demoV2Phase: "scissors-fixed" }),
    modules: MODULES,
    parts: PARTS,
    experienceStats: base.experienceStats,
    qualities: base.qualities,
    qualityIndex: base.qualityIndex,
    nextThreshold: base.nextThreshold,
    uiFramework: {
      weaponSelection: { activeIds: ["scissors"], cardCapacity: 6, registryLabel: "当前武器" },
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
    tick,
    onRoundComplete,
    onPlayerDamaged,
    blocksHostileProjectile
  };

  V2.demoV2 = Object.assign(V2.demoV2 || {}, { scissorsFixed });
  V2.demoV2.fixedTests = Object.assign(V2.demoV2.fixedTests || {}, { "scissors-fixed": scissorsFixed });
})();
