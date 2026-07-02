// ================================================================
// src/v2/runtime/state.js
// One state machine for the active V2 prototype.
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});
  const V2 = CS.V2 || (CS.V2 = {});

  const RUN_PHASES = [
    {
      key: "weapon_intro",
      label: "实习期",
      weaponStage: "初始武器母题",
      weaponStageShort: "基础攻击",
      playerGoal: "先理解这把办公工具的基础清怪动词。",
      rewardTiming: "阶段结束后选择工牌",
      status: "playable"
    },
    {
      key: "promotion",
      label: "转正期",
      weaponStage: "工牌核心变体",
      weaponStageShort: "部门形态",
      playerGoal: "用多关时间熟悉同一武器被工牌改造成的新打法。",
      rewardTiming: "转正评审结束后获得专属强化",
      status: "playable"
    },
    {
      key: "promoted_mastery",
      label: "独当一面",
      weaponStage: "转正专属强化",
      weaponStageShort: "强化形态",
      playerGoal: "围绕转正强化继续堆数值、卡槽和工坊，让主流派成型。",
      rewardTiming: "阶段结束后开放跨部门协作",
      status: "playable"
    },
    {
      key: "cross_department",
      label: "跨部门协作",
      weaponStage: "第二工牌初级形态",
      weaponStageShort: "双部门形态",
      playerGoal: "选择第二部门，让主武器叠加一个初级攻击形态。",
      rewardTiming: "阶段结束后开放跨技能学习",
      status: "playable"
    },
    {
      key: "cross_weapon",
      label: "跨技能学习",
      weaponStage: "副武器本质技能",
      weaponStageShort: "副武器协同",
      playerGoal: "选择一把副武器，只保留它的核心技能作为辅助。",
      rewardTiming: "进入终局验证完整 Build",
      status: "playable"
    }
  ];

  const PHASE_LOOKUP = RUN_PHASES.reduce(function (map, phase) {
    map[phase.key] = phase;
    return map;
  }, {});

  const STAGE_BLUEPRINTS = [
    { id: 1, phaseKey: "weapon_intro", phaseStep: 1, phase: "实习期", name: "工具热身", duration: 38, targetKills: 24, spawnEvery: 1.25, enemyHp: 18, enemySpeed: 58, material: 7, note: "先体验初始武器的基础清怪方式。" },
    { id: 2, phaseKey: "weapon_intro", phaseStep: 2, phase: "实习期", name: "工位熟悉", duration: 44, targetKills: 32, spawnEvery: 1.08, enemyHp: 21, enemySpeed: 63, material: 8, note: "用经验和材料微调这把武器，但还不改变部门形态。" },
    { id: 3, phaseKey: "weapon_intro", phaseStep: 3, phaseFinal: true, phase: "实习期", name: "实习小考", duration: 50, targetKills: 1, boss: true, spawnEvery: 1.5, enemyHp: 360, enemySpeed: 50, material: 10, note: "完成实习后再选择工牌，进入转正阶段。" },
    { id: 4, phaseKey: "promotion", phaseStep: 1, phase: "转正期", name: "工牌定型", duration: 52, targetKills: 40, spawnEvery: 1.02, enemyHp: 24, enemySpeed: 66, material: 11, note: "工牌让同一把武器变成新的战斗形态。" },
    { id: 5, phaseKey: "promotion", phaseStep: 2, phase: "转正期", name: "职责加压", duration: 56, targetKills: 48, spawnEvery: 0.94, enemyHp: 28, enemySpeed: 70, material: 12, note: "卡槽开始围绕当前形态做取舍。" },
    { id: 6, phaseKey: "promotion", phaseStep: 3, phase: "转正期", name: "流程压测", duration: 60, targetKills: 56, spawnEvery: 0.86, enemyHp: 32, enemySpeed: 74, material: 14, note: "继续补强主形态，准备转正评审。" },
    { id: 7, phaseKey: "promotion", phaseStep: 4, phaseFinal: true, phase: "转正期", name: "转正评审", duration: 68, targetKills: 1, boss: true, spawnEvery: 1.5, enemyHp: 760, enemySpeed: 56, material: 22, note: "通过评审后，主武器获得专属转正强化。" },
    { id: 8, phaseKey: "promoted_mastery", phaseStep: 1, phase: "独当一面", name: "主轴复盘", duration: 62, targetKills: 66, spawnEvery: 0.78, enemyHp: 36, enemySpeed: 78, material: 16, note: "围绕转正强化继续堆主形态，但还保留成长空间。" },
    { id: 9, phaseKey: "promoted_mastery", phaseStep: 2, phase: "独当一面", name: "单人负责", duration: 66, targetKills: 72, spawnEvery: 0.72, enemyHp: 40, enemySpeed: 82, material: 18, note: "主工牌打法开始稳定成型，工坊和卡槽只补强当前主轴。" },
    { id: 10, phaseKey: "promoted_mastery", phaseStep: 3, phaseFinal: true, phase: "独当一面", name: "独立交付", duration: 76, targetKills: 1, boss: true, spawnEvery: 1.4, enemyHp: 1180, enemySpeed: 60, material: 26, note: "完成独立交付后，开放第二部门的初级专属能力。" },
    { id: 11, phaseKey: "cross_department", phaseStep: 1, phase: "跨部门协作", name: "协作磨合", duration: 66, targetKills: 78, spawnEvery: 0.68, enemyHp: 44, enemySpeed: 86, material: 20, note: "主武器保留主工牌打法，并叠加第二部门的初级形态。" },
    { id: 12, phaseKey: "cross_department", phaseStep: 2, phase: "跨部门协作", name: "联合推进", duration: 70, targetKills: 86, spawnEvery: 0.64, enemyHp: 48, enemySpeed: 90, material: 22, note: "观察两个部门形态如何互相补位，而不是追求单一路线封顶。" },
    { id: 13, phaseKey: "cross_department", phaseStep: 3, phaseFinal: true, phase: "跨部门协作", name: "联合评审", duration: 82, targetKills: 1, boss: true, spawnEvery: 1.35, enemyHp: 1500, enemySpeed: 62, material: 30, note: "完成联合评审后，开放跨技能学习。" },
    { id: 14, phaseKey: "cross_weapon", phaseStep: 1, phase: "跨技能学习", name: "技能借调", duration: 70, targetKills: 88, spawnEvery: 0.62, enemyHp: 52, enemySpeed: 92, material: 24, note: "副武器只保留本质技能作为辅助，不抢主武器的 Build 主轴。" },
    { id: 15, phaseKey: "cross_weapon", phaseStep: 2, phase: "跨技能学习", name: "组合压测", duration: 76, targetKills: 96, spawnEvery: 0.58, enemyHp: 58, enemySpeed: 96, material: 26, note: "用经验和材料继续补属性，最终形态仍留有下一局可调整空间。" },
    { id: 16, phaseKey: "cross_weapon", phaseStep: 3, phaseFinal: true, phase: "跨技能学习", name: "最终形态验证", duration: 88, targetKills: 1, boss: true, spawnEvery: 1.3, enemyHp: 1880, enemySpeed: 66, material: 36, note: "完成三层进化链路：主形态强化、第二部门、跨技能辅助。" }
  ];

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function defaultFormParams(form) {
    const params = Object.assign({}, form && form.baseParams ? form.baseParams : {});
    return Object.assign({
      damage: 12,
      cooldown: 1.4,
      range: 320,
      pierce: 0,
      area: 1,
      amount: 1,
      shield: 0
    }, params);
  }

  function makeInitialState() {
    return {
      mode: "menu",
      previousMode: "menu",
      runId: 0,
      selectedWeaponId: null,
      badgeDept: null,
      secondaryBadgeDept: null,
      secondaryForm: null,
      supportWeaponId: null,
      supportSkill: null,
      activeForm: null,
      activeFormParams: {},
      stageIndex: 0,
      stage: deepClone(STAGE_BLUEPRINTS[0]),
      phaseMeta: getPhaseMeta(STAGE_BLUEPRINTS[0].phaseKey),
      stageTime: 0,
      warmupTime: 0,
      totalTime: 0,
      kills: 0,
      stageKills: 0,
      level: 1,
      xp: 0,
      xpNeed: 20,
      materials: 0,
      hp: 100,
      maxHp: 100,
      player: { x: 640, y: 360, vx: 0, vy: 0, speed: 220, radius: 16, invuln: 0 },
      enemies: [],
      projectiles: [],
      damageZones: [],
      particles: [],
      pickups: [],
      formEvents: [],
      slotAssignments: {},
      slotAugments: {},
      supportItems: [],
      upgrades: [],
      shopOffers: [],
      upgradeChoices: [],
      slotChoices: [],
      lastRewardReason: "",
      flags: {
        badgeSeen: false,
        slotUnlocked: false,
        promoted: false,
        mastered: false,
        crossDepartment: false,
        crossWeapon: false,
        gameOver: false,
        won: false,
        debug: false
      },
      promotionLog: [],
      phaseRewardLog: [],
      loop: {
        running: false,
        raf: 0,
        interval: 0,
        lastFrameAt: 0,
        fallbackLastAt: 0,
        accumulator: 0,
        avgFrameMs: 16,
        frameCount: 0,
        updateCount: 0,
        lastError: ""
      },
      input: { up: false, down: false, left: false, right: false },
      stats: {
        damageDone: {},
        damageTaken: 0,
        shots: 0,
        xpCollected: 0,
        materialsCollected: 0
      }
    };
  }

  const store = {
    state: makeInitialState(),
      listeners: [],
      stageBlueprints: STAGE_BLUEPRINTS,
      runPhases: RUN_PHASES,
    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(function (item) { return item !== listener; });
      };
    },
    emit() {
      this.listeners.forEach(function (listener) {
        try { listener(store.state); } catch (err) { V2.reportError(err); }
      });
    }
  };

  V2.reportError = function reportError(err) {
    const message = err && err.message ? err.message : String(err);
    store.state.loop.lastError = message;
    if (!window._errors) window._errors = [];
    window._errors.push({ msg: message, stack: err && err.stack ? String(err.stack) : "" });
    const log = document.getElementById("errLog");
    if (log) {
      log.classList.remove("hidden");
      log.textContent = window._errors.slice(-5).map(function (item) { return item.msg; }).join("\n");
    }
  };

  function applyActiveForm(state) {
    if (!state.selectedWeaponId) return;
    if (!state.badgeDept) {
      const weapon = CS.weapons && CS.weapons[state.selectedWeaponId];
      const base = {
        weaponId: state.selectedWeaponId,
        badgeDept: null,
        formId: state.selectedWeaponId + "_intern",
        displayName: weapon ? "实习" + weapon.name : "实习武器",
        combatVerb: weapon ? weapon.description : "基础攻击形态。",
        visualStyle: "基础蓝色系武器特效",
        mechanicType: weapon ? weapon.formTopology : "basic",
        short: weapon ? weapon.tagDescription : "基础形态",
        weakness: "第一关只体验母题，过关后再选择工牌变体。",
        baseParams: weapon && weapon.baseStats ? weapon.baseStats : {},
        scalingHooks: {},
        ultimateHook: null,
        bestMatch: false
      };
      state.activeForm = deepClone(base);
      state.activeFormParams = defaultFormParams(base);
      return;
    }
    const form = V2.getWeaponForm(state.selectedWeaponId, state.badgeDept);
    state.activeForm = deepClone(form);
    state.activeFormParams = defaultFormParams(form);
  }

  function resetCombatEntities(state) {
    state.enemies = [];
    state.projectiles = [];
    state.damageZones = [];
    state.particles = [];
    state.pickups = [];
    state.formEvents = [];
    state.player.x = 640;
    state.player.y = 360;
    state.player.vx = 0;
    state.player.vy = 0;
  }

  function startStage(state, index) {
    state.stageIndex = Math.max(0, Math.min(index, STAGE_BLUEPRINTS.length - 1));
    state.stage = deepClone(STAGE_BLUEPRINTS[state.stageIndex]);
    state.phaseMeta = getPhaseMeta(state.stage.phaseKey);
    state.stageTime = state.stage.duration;
    state.warmupTime = state.stage.id === 1 ? 3 : 1.2;
    state.stageKills = 0;
    state.mode = "combat";
    resetCombatEntities(state);
  }

  function openArmory(state, reason) {
    state.mode = "armory";
    state.lastRewardReason = reason || "阶段完成";
    if (V2.progression) state.shopOffers = V2.progression.makeShopOffers(state);
  }

  function selectWeapon(state, weaponId) {
    const previousDebug = state.flags.debug;
    const previousLoop = state.loop;
    const fresh = makeInitialState();
    Object.keys(fresh).forEach(function (key) { state[key] = fresh[key]; });
    state.runId += 1;
    state.flags.debug = previousDebug;
    state.loop = previousLoop;
    state.selectedWeaponId = (V2.compat && V2.compat.normalizeWeaponId(weaponId)) || weaponId || "marker";
    state.maxHp = 124;
    state.hp = state.maxHp;
    applyActiveForm(state);
    if (CS.buildState && typeof CS.buildState.reset === "function") {
      CS.buildState.reset();
      CS.buildState.weapons = [state.selectedWeaponId];
    }
    startStage(state, 0);
  }

  function selectBadge(state, dept) {
    state.badgeDept = V2.compat.normalizeDeptId(dept);
    applyActiveForm(state);
    if (CS.buildState) {
      CS.buildState.badgeDept = state.badgeDept;
      CS.buildState.weapons = [state.selectedWeaponId];
    }
    openArmory(state, "工牌形态已确定，先用材料补强主武器。");
  }

  function selectSecondaryBadge(state, dept) {
    const normalized = V2.compat.normalizeDeptId(dept);
    if (!state.badgeDept) return;
    if (normalized === state.badgeDept) return;
    state.secondaryBadgeDept = normalized;
    state.secondaryForm = V2.getWeaponForm(state.selectedWeaponId, normalized);
    if (V2.progression && V2.progression.applyCrossDepartment) {
      V2.progression.applyCrossDepartment(state, normalized);
    }
    openArmory(state, state.lastRewardReason || "第二部门能力已接入，主武器获得一条初级副形态。");
  }

  function selectSupportWeapon(state, weaponId) {
    const normalized = (V2.compat && V2.compat.normalizeWeaponId(weaponId)) || weaponId;
    if (!normalized || normalized === state.selectedWeaponId) return;
    state.supportWeaponId = normalized;
    if (V2.progression && V2.progression.applyCrossWeapon) {
      V2.progression.applyCrossWeapon(state, normalized);
    }
    openArmory(state, state.lastRewardReason || "跨技能学习完成，副武器只保留本质技能作为辅助。");
  }

  function continueToNextStage(state) {
    const next = state.stageIndex + 1;
    if (next >= STAGE_BLUEPRINTS.length) {
      state.flags.won = true;
      state.mode = "result";
      return;
    }
    startStage(state, next);
  }

  function completeStage(state) {
    state.materials += state.stage.material || 0;
    state.stats.materialsCollected += state.stage.material || 0;
    if (!state.badgeDept && state.stage.phaseKey === "weapon_intro" && state.stage.phaseFinal) {
      state.mode = "badge_select";
      return;
    }
    if (!state.badgeDept) {
      openArmory(state, "实习阶段完成，用材料继续微调当前初始武器。");
      return;
    }
    if (state.stage.phaseKey === "promotion" && state.stage.phaseFinal && !state.flags.promoted && V2.progression && V2.progression.applyPromotion) {
      V2.progression.applyPromotion(state);
      openArmory(state, state.lastRewardReason || "转正阶段完成，主武器获得专属强化。");
      return;
    }
    if (state.stage.phaseKey === "promoted_mastery" && state.stage.phaseFinal && !state.flags.mastered && V2.progression && V2.progression.applyMastery) {
      V2.progression.applyMastery(state);
      state.mode = "secondary_badge_select";
      return;
    }
    if (state.stage.phaseKey === "cross_department" && state.stage.phaseFinal && state.secondaryBadgeDept && !state.flags.crossWeapon) {
      state.mode = "support_weapon_select";
      return;
    }
    if (state.stage.phaseKey === "cross_weapon" && state.stage.phaseFinal) {
      state.flags.won = true;
      state.mode = "result";
      return;
    }
    if (state.stage.phaseKey === "promotion" && !state.stage.phaseFinal && V2.progression) {
      state.slotChoices = V2.progression.makeSlotChoices(state);
      state.mode = "slot_select";
      return;
    }
    if (state.stage.phaseKey === "promoted_mastery" && V2.progression) {
      state.slotChoices = V2.progression.makeSlotChoices(state);
      state.mode = "slot_select";
      return;
    }
    openArmory(state, "阶段完成，材料用于强化当前主形态。");
  }

  function gainXp(state, amount) {
    state.xp += amount;
    state.stats.xpCollected += amount;
    if (state.xp >= state.xpNeed && state.mode === "combat") {
      state.xp -= state.xpNeed;
      state.level += 1;
      state.xpNeed = Math.round(state.xpNeed * 1.22 + 8);
      state.previousMode = "combat";
      state.mode = "level_up";
      if (V2.progression) state.upgradeChoices = V2.progression.makeUpgradeChoices(state);
    }
  }

  function applyUpgrade(state, upgradeId) {
    if (V2.progression) V2.progression.applyUpgrade(state, upgradeId);
    state.mode = state.previousMode || "combat";
  }

  function applySlot(state, slotId, action, cardId) {
    if (V2.progression) V2.progression.applySlotChoice(state, slotId, action, cardId);
    openArmory(state, "卡槽强化已记录，工坊继续补强主武器。");
  }

  function buyOffer(state, offerId) {
    if (V2.progression) V2.progression.buyOffer(state, offerId);
  }

  function dispatch(action) {
    try {
      const state = store.state;
      switch (action.type) {
        case "INIT":
          state.flags.debug = !!action.debug;
          state.mode = "menu";
          break;
        case "OPEN_WEAPON_SELECT":
          state.mode = "weapon_select";
          break;
        case "START_RUN":
          selectWeapon(state, action.weaponId);
          break;
        case "SET_BADGE":
          selectBadge(state, action.dept);
          break;
        case "SET_SECONDARY_BADGE":
          selectSecondaryBadge(state, action.dept);
          break;
        case "SET_SUPPORT_WEAPON":
          selectSupportWeapon(state, action.weaponId);
          break;
        case "GAIN_XP":
          gainXp(state, action.amount || 0);
          break;
        case "COMPLETE_STAGE":
          completeStage(state);
          break;
        case "SELECT_UPGRADE":
          applyUpgrade(state, action.upgradeId);
          break;
        case "SKIP_UPGRADE":
          state.mode = state.previousMode || "combat";
          break;
        case "SELECT_SLOT":
          applySlot(state, action.slotId, action.action || "replace", action.cardId);
          break;
        case "BUY_OFFER":
          buyOffer(state, action.offerId);
          break;
        case "REFRESH_ARMORY":
          if (state.materials >= 3 && V2.progression) {
            state.materials -= 3;
            state.shopOffers = V2.progression.makeShopOffers(state, true);
          }
          break;
        case "CONTINUE_NEXT_STAGE":
          continueToNextStage(state);
          break;
        case "PAUSE":
          if (state.mode !== "paused") {
            state.previousMode = state.mode;
            state.mode = "paused";
          }
          break;
        case "RESUME":
          state.mode = state.previousMode || "combat";
          break;
        case "END_RUN":
          state.flags.gameOver = true;
          state.mode = "result";
          break;
        case "RESTART":
          {
            const previousLoop = state.loop;
            const previousDebug = state.flags.debug;
            Object.assign(state, makeInitialState());
            state.loop = previousLoop;
            state.flags.debug = previousDebug;
          }
          break;
        default:
          throw new Error("Unknown action: " + action.type);
      }
      store.emit();
    } catch (err) {
      V2.reportError(err);
    }
  }

  V2.store = store;
  V2.runPhases = RUN_PHASES;
  function getPhaseMeta(key) {
    return PHASE_LOOKUP[key] || {
      key: key || "unknown",
      label: "构筑推进",
      weaponStage: "主武器成长",
      weaponStageShort: "成长",
      playerGoal: "经验和材料服务当前主形态。",
      rewardTiming: "阶段完成后继续推进 Build",
      status: "fallback"
    };
  }
  V2.getPhaseMeta = getPhaseMeta;
  V2.dispatch = dispatch;
  V2.startRun = function startRun(options) {
    dispatch({ type: "START_RUN", weaponId: options && options.weaponId });
  };
  V2.getState = function getState() {
    return store.state;
  };
  V2.internal = Object.assign(V2.internal || {}, {
    makeInitialState,
    completeStage,
    gainXp,
    startStage,
    applyActiveForm
  });
})();
