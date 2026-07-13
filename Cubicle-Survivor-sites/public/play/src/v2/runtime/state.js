// ================================================================
// src/v2/runtime/state.js
// One state machine for the active Demo V1 loop. The v2 path is an internal architecture namespace.
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
    { id: 1, phaseKey: "weapon_intro", phaseStep: 1, phase: "实习期", name: "工具热身", duration: 34, targetKills: 20, spawnEvery: 1.18, enemyHp: 17, enemySpeed: 58, material: 7, enemyMix: [{ type: "todo", weight: 10 }], note: "先体验初始武器的基础清怪方式。", threatHint: "基础清怪：看懂马克笔、保温杯、即时贴各自的攻击动词。" },
    { id: 2, phaseKey: "weapon_intro", phaseStep: 2, phase: "实习期", name: "工位熟悉", duration: 38, targetKills: 27, spawnEvery: 1.02, enemyHp: 20, enemySpeed: 63, material: 8, enemyMix: [{ type: "todo", weight: 7 }, { type: "email", weight: 3 }], note: "用经验和材料微调这把武器，但还不改变部门形态。", threatHint: "移动配合：用走位把敌人带进武器喜欢的形状。" },
    { id: 3, phaseKey: "weapon_intro", phaseStep: 3, phaseFinal: true, phase: "实习期", name: "实习小考", duration: 50, targetKills: 1, boss: true, bossType: "lead", bossHitCap: 0.16, spawnEvery: 1.5, enemyHp: 380, enemySpeed: 50, material: 10, enemyMix: [{ type: "todo", weight: 6 }, { type: "email", weight: 2 }], note: "完成实习后再选择工牌，进入转正阶段。", threatHint: "基础爆发：确认初始武器能否处理厚血目标。" },
    { id: 4, phaseKey: "promotion", phaseStep: 1, phase: "转正期", name: "工牌定型", duration: 44, targetKills: 34, spawnEvery: 0.96, enemyHp: 24, enemySpeed: 66, material: 11, enemyMix: [{ type: "todo", weight: 6 }, { type: "meeting", weight: 3 }, { type: "email", weight: 2 }], note: "工牌让同一把武器变成新的战斗形态。", threatHint: "形态识别：观察工牌如何改写主武器打法。" },
    { id: 5, phaseKey: "promotion", phaseStep: 2, phase: "转正期", name: "职责加压", duration: 47, targetKills: 40, spawnEvery: 0.86, enemyHp: 27, enemySpeed: 70, material: 12, enemyMix: [{ type: "todo", weight: 5 }, { type: "ping", weight: 3 }, { type: "meeting", weight: 2 }], note: "卡槽开始围绕当前形态做取舍。", threatHint: "短板暴露：远程群消息会逼你移动，厚会议怪会检验单体。" },
    { id: 6, phaseKey: "promotion", phaseStep: 3, phase: "转正期", name: "流程压测", duration: 50, targetKills: 46, spawnEvery: 0.8, enemyHp: 31, enemySpeed: 74, material: 14, enemyMix: [{ type: "todo", weight: 4 }, { type: "deadline", weight: 3 }, { type: "ping", weight: 2 }, { type: "meeting", weight: 2 }], note: "继续补强主形态，准备转正评审。", threatHint: "空间压测：冲刺截止日期会打断站桩，验证移动容错。" },
    { id: 7, phaseKey: "promotion", phaseStep: 4, phaseFinal: true, phase: "转正期", name: "转正评审", duration: 64, targetKills: 1, boss: true, bossType: "director", bossHitCap: 0.12, spawnEvery: 1.5, enemyHp: 820, enemySpeed: 56, material: 22, enemyMix: [{ type: "todo", weight: 4 }, { type: "ping", weight: 2 }], note: "通过评审后，主武器获得专属转正强化。", threatHint: "成型检查：评审目标带护盾，第一套主轴必须能处理厚血目标。" },
    { id: 8, phaseKey: "promoted_mastery", phaseStep: 1, phase: "独当一面", name: "主轴复盘", duration: 52, targetKills: 54, spawnEvery: 0.72, enemyHp: 35, enemySpeed: 78, material: 16, enemyMix: [{ type: "todo", weight: 4 }, { type: "scope", weight: 3 }, { type: "deadline", weight: 2 }], note: "围绕转正强化继续堆主形态，但还保留成长空间。", threatHint: "持续输出：需求变更死亡后会拆成小待办，检验连锁清怪。" },
    { id: 9, phaseKey: "promoted_mastery", phaseStep: 2, phase: "独当一面", name: "单人负责", duration: 54, targetKills: 60, spawnEvery: 0.67, enemyHp: 39, enemySpeed: 82, material: 18, enemyMix: [{ type: "deadline", weight: 3 }, { type: "approval", weight: 3 }, { type: "ping", weight: 2 }, { type: "todo", weight: 2 }], note: "主工牌打法开始稳定成型，工坊和卡槽只补强当前主轴。", threatHint: "补短板：审批流抗伤更高，远程消息继续压走位。" },
    { id: 10, phaseKey: "promoted_mastery", phaseStep: 3, phaseFinal: true, phase: "独当一面", name: "独立交付", duration: 72, targetKills: 1, boss: true, bossType: "delivery", bossHitCap: 0.1, spawnEvery: 1.4, enemyHp: 1280, enemySpeed: 60, material: 26, enemyMix: [{ type: "deadline", weight: 3 }, { type: "scope", weight: 2 }], note: "完成独立交付后，开放第二部门的初级专属能力。", threatHint: "主轴验收：交付目标会冲刺压迫，验证转正强化是否值得继续构筑。" },
    { id: 11, phaseKey: "cross_department", phaseStep: 1, phase: "跨部门协作", name: "协作磨合", duration: 54, targetKills: 62, spawnEvery: 0.64, enemyHp: 43, enemySpeed: 86, material: 20, enemyMix: [{ type: "todo", weight: 3 }, { type: "client", weight: 3 }, { type: "approval", weight: 2 }, { type: "email", weight: 2 }], note: "主武器保留主工牌打法，并叠加第二部门的初级形态。", threatHint: "协作入口：客户追问会拉开距离开火，第二部门只补一条能力。" },
    { id: 12, phaseKey: "cross_department", phaseStep: 2, phase: "跨部门协作", name: "联合推进", duration: 57, targetKills: 70, spawnEvery: 0.6, enemyHp: 47, enemySpeed: 90, material: 22, enemyMix: [{ type: "scope", weight: 3 }, { type: "client", weight: 3 }, { type: "deadline", weight: 2 }, { type: "approval", weight: 2 }], note: "观察两个部门形态如何互相补位，而不是追求单一路线封顶。", threatHint: "协同验证：分裂、远程、冲刺同时出现，看主形态和第二部门是否补位。" },
    { id: 13, phaseKey: "cross_department", phaseStep: 3, phaseFinal: true, phase: "跨部门协作", name: "联合评审", duration: 78, targetKills: 1, boss: true, bossType: "client", bossHitCap: 0.09, spawnEvery: 1.35, enemyHp: 1680, enemySpeed: 62, material: 30, enemyMix: [{ type: "client", weight: 3 }, { type: "approval", weight: 2 }], note: "完成联合评审后，开放跨技能学习。", threatHint: "双部门验收：Boss 会远程追问，主轴、副形态和生存容错都要交卷。" },
    { id: 14, phaseKey: "cross_weapon", phaseStep: 1, phase: "跨技能学习", name: "技能借调", duration: 58, targetKills: 72, spawnEvery: 0.58, enemyHp: 51, enemySpeed: 92, material: 24, enemyMix: [{ type: "deadline", weight: 3 }, { type: "scope", weight: 3 }, { type: "client", weight: 2 }, { type: "approval", weight: 2 }], note: "副武器只保留本质技能作为辅助，不抢主武器的 Build 主轴。", threatHint: "副武器入口：借用技能应能补一条短板，而不是重新洗构筑。" },
    { id: 15, phaseKey: "cross_weapon", phaseStep: 2, phase: "跨技能学习", name: "组合压测", duration: 62, targetKills: 80, spawnEvery: 0.54, enemyHp: 56, enemySpeed: 96, material: 26, enemyMix: [{ type: "deadline", weight: 3 }, { type: "client", weight: 3 }, { type: "approval", weight: 3 }, { type: "scope", weight: 2 }], note: "用经验和材料继续补属性，最终形态仍留有下一局可调整空间。", threatHint: "完整压测：清场、单体、生存、经济都开始同时吃紧。" },
    { id: 16, phaseKey: "cross_weapon", phaseStep: 3, phaseFinal: true, phase: "跨技能学习", name: "最终形态验证", duration: 84, targetKills: 1, boss: true, bossType: "ceo", bossHitCap: 0.075, spawnEvery: 1.3, enemyHp: 2150, enemySpeed: 66, material: 36, enemyMix: [{ type: "client", weight: 3 }, { type: "deadline", weight: 2 }, { type: "approval", weight: 2 }], note: "完成三层进化链路：主形态强化、第二部门、跨技能辅助。", threatHint: "终局验收：完整 Build 必须证明每个阶段选择都有意义。" }
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
      stageBossSpawned: false,
      stageBossDefeated: false,
      totalTime: 0,
      kills: 0,
      stageKills: 0,
      level: 1,
      xp: 0,
      xpNeed: 20,
      materials: 0,
      hp: 100,
      maxHp: 100,
      world: { width: 2600, height: 1800 },
      camera: { x: 0, y: 0, width: 1280, height: 720 },
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
      shopRerolls: 0,
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
        materialsCollected: 0,
        enemyTypesSpawned: {},
        enemyShots: 0,
        weaponEvents: [],
        audioEvents: []
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
    state.player.x = state.camera ? state.camera.width / 2 : 640;
    state.player.y = state.camera ? state.camera.height / 2 : 360;
    state.player.vx = 0;
    state.player.vy = 0;
    if (state.camera && state.world) {
      state.camera.x = Math.max(0, state.player.x - state.camera.width / 2);
      state.camera.y = Math.max(0, state.player.y - state.camera.height / 2);
    }
  }

  function startStage(state, index) {
    state.stageIndex = Math.max(0, Math.min(index, STAGE_BLUEPRINTS.length - 1));
    state.stage = deepClone(STAGE_BLUEPRINTS[state.stageIndex]);
    state.phaseMeta = getPhaseMeta(state.stage.phaseKey);
    state.stageTime = state.stage.duration;
    state.warmupTime = state.stage.id === 1 ? 2.4 : 0.75;
    state.stageKills = 0;
    state.stageBossSpawned = false;
    state.stageBossDefeated = false;
    state.mode = "combat";
    resetCombatEntities(state);
  }

  function openArmory(state, reason) {
    state.mode = "armory";
    state.lastRewardReason = reason || "阶段完成";
    state.shopRerolls = 0;
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
    state.flags.badgeSeen = true;
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
    state.hp = Math.min(state.maxHp, state.hp + Math.round(state.maxHp * 0.12));
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
      state.flags.slotUnlocked = true;
      state.mode = "slot_select";
      return;
    }
    if (state.stage.phaseKey === "promoted_mastery" && V2.progression) {
      state.slotChoices = V2.progression.makeSlotChoices(state);
      state.flags.slotUnlocked = true;
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
          if (V2.combat && V2.combat.startLoop) V2.combat.startLoop({ force: true });
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
          if (V2.progression) {
            const cost = V2.progression.getRefreshCost ? V2.progression.getRefreshCost(state) : 3;
            if (state.materials < cost) break;
            state.materials -= cost;
            state.shopRerolls = (state.shopRerolls || 0) + 1;
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
