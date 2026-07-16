// ================================================================
// Demo V2 isolated marker fixed-type test.
// Modules own mechanics. Components own stats. Neither unlocks the other.
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});
  const V2 = CS.V2 || (CS.V2 = {});

  const PHASE_COUNT = 5;
  const ENCOUNTER_COUNT = 17;
  const MODULE_ENCOUNTERS = [3, 6, 9, 12];
  const SHOP_ENCOUNTERS = [2, 5, 8, 11, 14, 16];
  const UI_FRAMEWORK = {
    weaponSelection: {
      activeIds: ["marker"],
      cardCapacity: 6,
      registryLabel: "当前验证武器"
    },
    itemShop: {
      enabled: false,
      mountId: "itemOfferSection",
      offerCapacity: 4
    }
  };
  const ENCOUNTERS = [
    { id: 1, phase: 1, step: 1, kind: "normal", pattern: "queue", label: "基础队列", duration: 40, materialReward: 5, enemyHp: 18, enemySpeed: 70, floor: 12, cap: 34, batchSize: 6, cadence: 2.55, hint: "低至中密度近战队列，先看懂单线贯穿与覆盖不足。" },
    { id: 2, phase: 1, step: 2, kind: "reinforced", pattern: "cluster", label: "强化团块", duration: 40, materialReward: 5, shopAfter: true, enemyHp: 20, enemySpeed: 72, floor: 14, cap: 38, batchSize: 7, cadence: 2.45, hint: "团块逐渐变厚，在第一次商店前建立清楚的属性短板。" },
    { id: 3, phase: 1, step: 3, kind: "boss", pattern: "queue", label: "实习导师", duration: 60, materialReward: 3, bossMaterial: 2, moduleAfter: true, boss: true, bossType: "lead", enemyHp: 680, enemySpeed: 66, bossHitCap: 0.15, floor: 8, cap: 24, batchSize: 4, cadence: 4.2, hint: "第一名导师带少量待办，检验基础单体与贯穿清杂。" },
    { id: 4, phase: 2, step: 1, kind: "normal", pattern: "queue", label: "数量提升", duration: 40, materialReward: 4, enemyHp: 24, enemySpeed: 75, floor: 16, cap: 42, batchSize: 7, cadence: 2.3, hint: "敌人数量提高，让第一次模块升级立刻拥有表现对象。" },
    { id: 5, phase: 2, step: 2, kind: "reinforced", pattern: "pursuit", label: "快速混入", duration: 45, materialReward: 5, shopAfter: true, enemyHp: 26, enemySpeed: 78, floor: 17, cap: 44, batchSize: 8, cadence: 2.3, hint: "低血快速敌人混入，检验线数、攻速与转向覆盖。" },
    { id: 6, phase: 2, step: 3, kind: "boss", pattern: "cluster", label: "部门总监", duration: 60, materialReward: 3, bossMaterial: 2, moduleAfter: true, boss: true, bossType: "director", enemyHp: 920, enemySpeed: 68, bossHitCap: 0.13, floor: 10, cap: 28, batchSize: 5, cadence: 4, hint: "护甲总监与低血团块并存，检验第一次模块是否真的补强。" },
    { id: 7, phase: 3, step: 1, kind: "normal", pattern: "pursuit", label: "多向追逐", duration: 45, materialReward: 4, enemyHp: 31, enemySpeed: 82, floor: 19, cap: 48, batchSize: 8, cadence: 2.15, hint: "截止日期从多方向逼近，迫使玩家持续移动和重新瞄准。" },
    { id: 8, phase: 3, step: 2, kind: "reinforced", pattern: "review", label: "远程混合", duration: 45, materialReward: 5, shopAfter: true, enemyHp: 34, enemySpeed: 82, floor: 20, cap: 50, batchSize: 9, cadence: 2.2, hint: "远程消息、快速敌人与普通敌人混合，避免原地输出。" },
    { id: 9, phase: 3, step: 3, kind: "boss", pattern: "pursuit", label: "独立交付", duration: 65, materialReward: 4, bossMaterial: 3, moduleAfter: true, boss: true, bossType: "delivery", enemyHp: 1280, enemySpeed: 72, bossHitCap: 0.115, floor: 12, cap: 32, batchSize: 5, cadence: 3.8, hint: "冲刺交付与多向杂兵一起检验移动、持续输出和铺场。" },
    { id: 10, phase: 4, step: 1, kind: "normal", pattern: "cluster", label: "高密度敌群", duration: 45, materialReward: 4, enemyHp: 40, enemySpeed: 84, floor: 23, cap: 56, batchSize: 10, cadence: 2.05, hint: "高密度团块让复写与留档开始进入明显膨胀阶段。" },
    { id: 11, phase: 4, step: 2, kind: "reinforced", pattern: "review", label: "重型混合", duration: 50, materialReward: 5, shopAfter: true, enemyHp: 45, enemySpeed: 86, floor: 24, cap: 60, batchSize: 10, cadence: 2.05, hint: "重型、远程与快速敌人共同出现，商店前暴露真实短板。" },
    { id: 12, phase: 4, step: 3, kind: "boss", pattern: "review", label: "大客户评审", duration: 70, materialReward: 5, bossMaterial: 3, moduleAfter: true, boss: true, bossType: "client", enemyHp: 1750, enemySpeed: 74, bossHitCap: 0.1, floor: 15, cap: 38, batchSize: 6, cadence: 3.6, hint: "远程 Boss 与混合工作项同时检验清杂、追击和单体输出。" },
    { id: 13, phase: 5, step: 1, kind: "normal", pattern: "cluster", label: "成型高密度", duration: 45, materialReward: 4, enemyHp: 50, enemySpeed: 88, floor: 27, cap: 64, batchSize: 11, cadence: 1.95, hint: "不给新模块，直接让完整机制面对高密度敌群。" },
    { id: 14, phase: 5, step: 2, kind: "reinforced", pattern: "review", label: "精英混合", duration: 50, materialReward: 5, shopAfter: true, enemyHp: 54, enemySpeed: 90, floor: 28, cap: 66, batchSize: 11, cadence: 1.95, hint: "精英与普通敌人混合，在第五次商店前检验成型度。" },
    { id: 15, phase: 5, step: 3, kind: "boss", pattern: "review", label: "终局预审", duration: 60, materialReward: 5, bossMaterial: 12, boss: true, bossType: "director", enemyHp: 2250, enemySpeed: 78, bossHitCap: 0.09, floor: 17, cap: 42, batchSize: 7, cadence: 3.35, hint: "中期 Boss 检验当前 Build，并掉落最后成长所需的大量材料。" },
    { id: 16, phase: 5, step: 4, kind: "pressure", pattern: "pursuit", label: "最终压力战", duration: 50, materialReward: 5, shopAfter: true, enemyHp: 60, enemySpeed: 94, floor: 30, cap: 68, batchSize: 12, cadence: 1.85, hint: "高压追逐逼迫玩家暴露短板，然后进入最后一次组件商店。" },
    { id: 17, phase: 5, step: 5, kind: "final_boss", pattern: "review", label: "老板最终确认", duration: 80, materialReward: 6, bossMaterial: 6, boss: true, bossType: "ceo", enemyHp: 3400, enemySpeed: 80, bossHitCap: 0.075, floor: 18, cap: 46, batchSize: 8, cadence: 3.2, hint: "最终 Boss 与有限工作项共同检验群体、单体、空间和持续移动。" }
  ];
  const DEMO_V2_0_ENCOUNTER_OVERRIDES = [
    { spawnTotal: 44, materialReward: 7, enemyHp: 12, enemyTypes: ["待办", "邮件"], preview: "基础近战队列；先观察单线贯穿与覆盖空档。" },
    { spawnTotal: 52, materialReward: 7, enemyTypes: ["待办", "会议"], preview: "团块会压缩走位；第一次商店前确认最缺的属性。" },
    { spawnTotal: 20, materialReward: 4, enemyTypes: ["待办", "实习导师 Boss"], preview: "Boss 必须击破；同时处理有限待办，不能秒杀后直接跳关。" },
    { spawnTotal: 60, materialReward: 5, enemyHp: 18, enemyTypes: ["待办", "邮件"], preview: "数量上升；第一次模块需要立刻吃到更多目标。" },
    { spawnTotal: 68, materialReward: 6, enemyTypes: ["截止日期", "邮件"], preview: "低血快速目标混入，要求持续转向和移动。" },
    { spawnTotal: 28, materialReward: 4, enemyTypes: ["会议", "部门总监 Boss"], preview: "护甲总监与团块并存；Boss 与清杂缺一不可。" },
    { spawnTotal: 76, materialReward: 5, enemyHp: 24, enemyTypes: ["截止日期", "邮件"], preview: "多方向追逐；重新瞄准比原地输出更重要。" },
    { spawnTotal: 84, materialReward: 6, enemyTypes: ["催办", "审批", "快速敌人"], preview: "远程与快速压力混合，持续寻找安全输出角度。" },
    { spawnTotal: 36, materialReward: 5, enemyTypes: ["冲刺敌人", "交付负责人 Boss"], preview: "冲刺 Boss 带杂兵进场；检验移动、铺场和单体输出。" },
    { spawnTotal: 92, materialReward: 5, enemyHp: 48, enemyTypes: ["高密度团块", "重型敌人"], preview: "阶段4第一关降低基础血量，用密度而不是厚血检验成型武器。" },
    { spawnTotal: 100, materialReward: 6, enemyHp: 78, enemyTypes: ["重型", "远程", "快速敌人"], preview: "三类威胁并存；用组件补短板，不能只堆瞬间伤害。" },
    { spawnTotal: 44, materialReward: 6, enemyHp: 2600, bossHitCap: 0.085, enemyTypes: ["客户远程压力", "混合杂兵", "大客户 Boss"], preview: "阶段4终审；必须持续移动并同时完成清杂与Boss处理。" },
    { spawnTotal: 108, materialReward: 5, enemyHp: 68, enemyTypes: ["高密度团块", "重型敌人"], preview: "完整模块进入成型测试；倒计时或清场均可结束本关。" },
    { spawnTotal: 116, materialReward: 6, enemyHp: 96, enemyTypes: ["精英", "远程", "快速敌人"], preview: "精英混合压力；为第五次商店争取更多材料。" },
    { spawnTotal: 52, materialReward: 6, enemyHp: 3150, bossHitCap: 0.075, enemyTypes: ["混合敌群", "预审总监 Boss"], preview: "成型 Build 预审；Boss材料用于最后一轮组件成长。" },
    { spawnTotal: 124, materialReward: 6, enemyHp: 108, enemyTypes: ["高压追逐", "精英"], preview: "最终压力关；清完固定配额后进入最后商店。" },
    { spawnTotal: 64, materialReward: 7, enemyHp: 4600, bossHitCap: 0.06, enemyTypes: ["老板 Boss", "有限混合工作项"], preview: "最终确认；Boss死亡且时间到或杂兵清完才算结束。" }
  ];
  ENCOUNTERS.forEach(function (encounter, index) {
    Object.assign(encounter, DEMO_V2_0_ENCOUNTER_OVERRIDES[index]);
  });
  const DURATION = ENCOUNTERS.reduce(function (sum, encounter) { return sum + encounter.duration; }, 0);
  const MODULE_TIMES = MODULE_ENCOUNTERS.map(function (encounterId) {
    return ENCOUNTERS.slice(0, encounterId).reduce(function (sum, encounter) { return sum + encounter.duration; }, 0);
  });
  const SHOP_TIMES = SHOP_ENCOUNTERS.map(function (encounterId) {
    return ENCOUNTERS.slice(0, encounterId).reduce(function (sum, encounter) { return sum + encounter.duration; }, 0);
  });
  const COMPONENT_COST = 7;
  const REFRESH_BASE_COST = 2;
  const REFRESH_COST_STEP = 2;
  const COLLECTION_DURATION = 10;
  const GUARANTEED_MATERIAL_TOTAL = ENCOUNTERS.reduce(function (sum, encounter) { return sum + encounter.materialReward + (encounter.bossMaterial || 0); }, 0);
  const QUALITY_THRESHOLDS = [1, 2, 4, 8];
  const QUALITY = [
    { id: "none", name: "未装配", color: "#7f8b9a" },
    { id: "white", name: "白色", color: "#eef7ff" },
    { id: "blue", name: "蓝色", color: "#69b8ff" },
    { id: "purple", name: "紫色", color: "#c58cff" },
    { id: "red", name: "红色", color: "#ff746d" }
  ];

  const PARTS = {
    tip: { id: "tip", name: "笔头", stats: ["damage", "pierce"], statNames: { damage: "伤害", pierce: "穿透" } },
    body: { id: "body", name: "笔身", stats: ["attackSpeed", "amount"], statNames: { attackSpeed: "攻速", amount: "数量" } },
    tail: { id: "tail", name: "笔尾", stats: ["range", "duration"], statNames: { range: "范围", duration: "持续时间" } }
  };

  const EXPERIENCE_STATS = {
    maxHp: { id: "maxHp", name: "最大生命", effect: "最大生命 +12，并恢复 12 点生命", family: "生存", short: "血" },
    hpRegen: { id: "hpRegen", name: "生命再生", effect: "每秒生命恢复 +0.8", family: "恢复", short: "回" },
    lifeSteal: { id: "lifeSteal", name: "生命窃取", effect: "造成伤害时 +1.5% 概率恢复 1 点生命", family: "恢复", short: "吸" },
    damage: { id: "damage", name: "伤害", effect: "所有马克笔伤害 +5%", family: "输出", short: "伤" },
    attackSpeed: { id: "attackSpeed", name: "攻击速度", effect: "攻击速度 +5%", family: "输出", short: "速" },
    critChance: { id: "critChance", name: "暴击率", effect: "暴击率 +3%，暴击造成 2 倍伤害", family: "输出", short: "暴" },
    range: { id: "range", name: "范围", effect: "激光长度 +15", family: "覆盖", short: "距" },
    armor: { id: "armor", name: "护甲", effect: "护甲 +1，降低受到的伤害", family: "生存", short: "甲" },
    dodge: { id: "dodge", name: "闪避", effect: "闪避 +3%，上限 60%", family: "生存", short: "闪" },
    moveSpeed: { id: "moveSpeed", name: "速度", effect: "移动速度 +3%", family: "走位", short: "移" },
    luck: { id: "luck", name: "幸运", effect: "幸运 +5，提高普通敌人材料掉落概率", family: "资源", short: "幸" },
    harvesting: { id: "harvesting", name: "收获", effect: "收获 +5，每关结算材料 +1", family: "资源", short: "收" }
  };

  function makeExperienceAllocations() {
    const allocations = {};
    Object.keys(EXPERIENCE_STATS).forEach(function (id) { allocations[id] = 0; });
    return allocations;
  }

  const MODULES = {
    copy: {
      id: "copy", name: "复写", family: "即时激光",
      levels: [
        "每条基础激光额外生成 1 条平行激光。",
        "每条基础激光两侧各生成 1 条平行激光。",
        "第一轮结束后重新锁定目标，再释放第二轮三线攻击。",
        "每轮有 15% 概率触发多方向全屏激光清扫。"
      ]
    },
    archive: {
      id: "archive", name: "留档", family: "持续墨迹减速",
      levels: [
        "每条基础激光路径留下 1 条宽墨迹，低伤并减速群体。",
        "每条基础激光留下 2 条平行宽墨迹，扩大控制覆盖。",
        "每条基础激光留下 3 条平行宽墨迹，加快铺满通道。",
        "每轮有 15% 概率让整个可视区域短暂进入低伤墨迹覆盖。"
      ]
    }
  };

  function makeWaves() {
    let start = 0;
    return ENCOUNTERS.map(function (encounter) {
      const wave = {
        id: encounter.pattern + "-encounter-" + encounter.id,
        encounterId: encounter.id,
        pattern: encounter.pattern,
        label: "第 " + encounter.id + " 关 · " + encounter.label,
        cadence: encounter.cadence,
        batchSize: encounter.batchSize,
        hint: encounter.hint,
        start,
        end: start + encounter.duration + 0.1
      };
      start += encounter.duration;
      return wave;
    });
  }

  function qualityIndex(copies) {
    if (copies >= 8) return 4;
    if (copies >= 4) return 3;
    if (copies >= 2) return 2;
    if (copies >= 1) return 1;
    return 0;
  }

  function nextThreshold(copies) {
    return QUALITY_THRESHOLDS.find(function (threshold) { return threshold > copies; }) || 8;
  }

  function makePartState(partId) {
    const part = PARTS[partId];
    const allocations = {};
    part.stats.forEach(function (stat) { allocations[stat] = 0; });
    return { copies: 0, activeStat: "", allocations };
  }

  function runtime(state) {
    return state.demoV2 && state.demoV2.phase === "marker-fixed" ? state.demoV2.marker : null;
  }

  function currentEncounter(state) {
    const test = runtime(state);
    return test ? ENCOUNTERS[test.currentEncounterIndex] || null : null;
  }

  function elapsedBeforeEncounter(index) {
    return ENCOUNTERS.slice(0, Math.max(0, index)).reduce(function (sum, encounter) { return sum + encounter.duration; }, 0);
  }

  function totalElapsed(state) {
    const test = runtime(state);
    const encounter = currentEncounter(state);
    if (!test || !encounter) return 0;
    return elapsedBeforeEncounter(test.currentEncounterIndex) + Math.max(0, encounter.duration - state.stageTime);
  }

  function clearEncounterEntities(state) {
    state.enemies = [];
    state.projectiles = [];
    state.damageZones = [];
    state.formEvents = [];
    state.particles = [];
  }

  function collectLoosePickups(state) {
    const test = runtime(state);
    if (!test) return { xp: 0, materials: 0 };
    let xp = 0;
    let materials = 0;
    const remaining = [];
    (state.pickups || []).forEach(function (pickup) {
      if (pickup.type === "xp") xp += pickup.amount || 0;
      else if (pickup.type === "material") materials += pickup.amount || 0;
      else remaining.push(pickup);
    });
    state.pickups = remaining;
    if (xp > 0) gainExperience(state, xp);
    if (materials > 0) {
      state.materials += materials;
      state.stats.materialsCollected += materials;
      test.dropMaterialsEarned += materials;
      test.materialsSinceLastShop += materials;
    }
    test.lastAutoCollect = { xp, materials };
    return test.lastAutoCollect;
  }

  function startEncounter(state, index) {
    const test = runtime(state);
    const encounter = ENCOUNTERS[index];
    if (!test || !encounter) return;
    test.currentEncounterIndex = index;
    test.currentPhase = encounter.phase;
    test.currentPhaseStep = encounter.step;
    test.elapsed = elapsedBeforeEncounter(index);
    test.lastEncounterStarted = encounter.id;
    state.stage.id = encounter.id;
    state.stage.phaseStep = encounter.step;
    state.stage.phase = "Demo V2.1 马克笔固定测试 · 阶段 " + encounter.phase;
    state.stage.name = "第 " + encounter.id + "/" + ENCOUNTER_COUNT + " 关 · " + encounter.label;
    state.stage.duration = encounter.duration;
    state.stage.targetKills = encounter.spawnTotal + (encounter.boss ? 1 : 0);
    state.stage.enemyHp = encounter.enemyHp;
    state.stage.enemySpeed = encounter.enemySpeed;
    state.stage.boss = !!encounter.boss;
    state.stage.bossType = encounter.bossType || "";
    state.stage.bossHitCap = encounter.bossHitCap || 0;
    state.stage.threatHint = encounter.hint;
    state.stage.enemyTypes = encounter.enemyTypes.slice();
    state.stage.enemyPreview = "本关怪物：" + encounter.enemyTypes.join("、") + " · " + encounter.preview;
    state.stage.note = "阶段 " + encounter.phase + "/" + PHASE_COUNT + " · " + (encounter.boss ? "Boss 评审" : encounter.kind === "reinforced" || encounter.kind === "pressure" ? "强化战斗" : "基础战斗");
    state.stageTime = encounter.duration;
    state.stageKills = 0;
    state.stageBossSpawned = false;
    state.stageBossDefeated = false;
    state.warmupTime = 3;
    state.demoV2.waveIndex = -1;
    state.demoV2.waveId = "";
    state.demoV2.waveTimer = 0;
    state.demoV2.floorTimer = 0;
    test.encounterSpawned = 0;
    test.collecting = false;
    test.collectionTime = 0;
    test.lastCollection = null;
    test.pendingRounds = [];
    clearEncounterEntities(state);
    state.pickups = [];
    state.mode = "combat";
  }

  function advanceToNextEncounter(state) {
    const test = runtime(state);
    if (!test) return;
    startEncounter(state, test.currentEncounterIndex + 1);
  }

  function rebuildParams(state) {
    const test = runtime(state);
    if (!test) return;
    const tip = test.parts.tip.allocations;
    const body = test.parts.body.allocations;
    const tail = test.parts.tail.allocations;
    const copyLevel = test.modules.copy;
    const archiveLevel = test.modules.archive;
    const experience = test.experienceAllocations;
    const damage = 18 * Math.pow(1.05, experience.damage || 0) * Math.pow(1.15, tip.damage);
    const rangeScale = Math.pow(1.1, tail.range);
    state.activeFormParams = Object.assign({}, state.activeFormParams, {
      damage,
      cooldown: 1.05 * Math.pow(0.88, body.attackSpeed) * Math.pow(0.95, experience.attackSpeed || 0),
      range: 720 * rangeScale + (experience.range || 0) * 15,
      pierce: 4 + tip.pierce,
      amount: 1 + body.amount,
      width: 8 * Math.pow(1.12, tail.range),
      markerFixedHpRegen: (experience.hpRegen || 0) * 0.8,
      markerFixedLifeStealChance: (experience.lifeSteal || 0) * 0.015,
      markerFixedCritChance: (experience.critChance || 0) * 0.03,
      markerFixedArmor: experience.armor || 0,
      markerFixedDodgeChance: Math.min(0.6, (experience.dodge || 0) * 0.03),
      markerFixedLuck: (experience.luck || 0) * 5,
      markerFixedHarvesting: (experience.harvesting || 0) * 5,
      markerFixedTest: true,
      markerFixedCopyLevel: copyLevel,
      markerFixedArchiveLevel: archiveLevel,
      markerFixedParallelLines: copyLevel >= 2 ? 2 : copyLevel === 1 ? 1 : 0,
      markerFixedSecondRound: copyLevel >= 3,
      markerFixedBaseLineScale: copyLevel >= 4 ? 0.78 : copyLevel >= 3 ? 0.86 : 1,
      markerFixedCopyLineScale: copyLevel >= 4 ? 0.44 : copyLevel >= 3 ? 0.5 : 0.58,
      markerFixedSecondRoundScale: 0.62,
      markerFixedFullscreenCopy: copyLevel >= 4,
      markerFixedArchiveTrails: Math.min(3, archiveLevel),
      markerFixedFullscreenArchive: archiveLevel >= 4,
      markerFixedTrailDuration: 2 * Math.pow(1.25, tail.duration),
      markerFixedTrailDamage: Math.max(1.6, damage * 0.1),
      markerFixedFullscreenChance: 0.15,
      markerFixedFullscreenCooldown: 4.5
    });
    const expectedMaxHp = 120 + (experience.maxHp || 0) * 12;
    if (state.maxHp !== expectedMaxHp) state.maxHp = expectedMaxHp;
    state.hp = Math.min(state.hp, state.maxHp);
    state.player.speed = 220 * Math.pow(1.03, experience.moveSpeed || 0);
    if (state.activeForm) {
      state.activeForm.displayName = "马克笔 · 三线成长测试";
      state.activeForm.short = "经验稳定成长；复写与留档改变攻击；组件只强化属性";
      state.activeForm.combatVerb = "向目标方向划出远程直线激光，以模块改变攻击结构，以组件强化基础参数。";
      state.activeForm.mechanicType = "line_pierce";
    }
  }

  function makeModuleChoices(state) {
    const test = runtime(state);
    return ["copy", "archive"].map(function (id) {
      const module = MODULES[id];
      const level = test.modules[id];
      return {
        id, name: module.name, family: module.family, level,
        effect: module.levels[Math.min(3, level)],
        intent: id === "copy" ? "强化即时激光数量、轮次与正面覆盖。" : "强化墨迹条数、持续覆盖与铺场速度。",
        disabled: level >= 4
      };
    });
  }

  function openModuleChoice(state) {
    const test = runtime(state);
    if (!test || test.moduleChoiceIndex >= MODULE_TIMES.length) return;
    state.demoV2.moduleChoices = makeModuleChoices(state);
    state.previousMode = "combat";
    state.mode = "module_select";
  }

  function applyModule(state, moduleId, stayInEncounter) {
    const test = runtime(state);
    if (!test || !MODULES[moduleId] || test.modules[moduleId] >= 4) return;
    test.modules[moduleId] += 1;
    test.moduleOrder.push(moduleId);
    test.lastModule = moduleId;
    test.moduleChoiceIndex += 1;
    state.demoV2.moduleChoices = [];
    rebuildParams(state);
    if (stayInEncounter) state.mode = "combat";
    else advanceToNextEncounter(state);
  }

  function weightedVariant(test) {
    const candidates = [];
    Object.keys(PARTS).forEach(function (partId) {
      PARTS[partId].stats.forEach(function (statId) {
        const partState = test.parts[partId];
        if (partState.activeStat === statId && partState.copies >= 8) return;
        candidates.push({ partId, statId });
      });
    });
    if (!candidates.length) return null;
    const weighted = candidates.map(function (candidate) {
      const partState = test.parts[candidate.partId];
      const copies = partState.activeStat === candidate.statId ? partState.copies : 0;
      let weight = 1;
      if (!partState.activeStat) weight += 0.35;
      else if (partState.activeStat === candidate.statId) {
        weight += 3;
        if (nextThreshold(copies) - copies === 1) weight += 2.4;
      } else {
        weight *= 0.58;
      }
      return { partId: candidate.partId, statId: candidate.statId, weight };
    });
    let roll = Math.random() * weighted.reduce(function (sum, item) { return sum + item.weight; }, 0);
    for (const item of weighted) {
      roll -= item.weight;
      if (roll <= 0) return item;
    }
    return weighted[weighted.length - 1];
  }

  function offerForVariant(test, partId, statId, slot, locked) {
    if (!partId || !statId) return null;
    const part = PARTS[partId];
    const partState = test.parts[partId];
    const sameType = partState.activeStat === statId;
    const replacing = !!partState.activeStat && !sameType;
    const owned = sameType ? partState.copies : 0;
    return {
      id: "marker-part-" + test.shopIndex + "-" + test.rerolls + "-" + slot,
      partId,
      statId,
      name: part.statNames[statId] + part.name,
      partName: part.name,
      statName: part.statNames[statId],
      cost: COMPONENT_COST,
      sold: false,
      locked: !!locked,
      owned,
      slotCopies: partState.copies,
      activeStat: partState.activeStat,
      activeStatName: partState.activeStat ? part.statNames[partState.activeStat] : "空槽",
      action: !partState.activeStat ? "install" : sameType ? "upgrade" : "replace",
      replacing,
      quality: QUALITY[qualityIndex(owned)],
      purchaseQuality: QUALITY[qualityIndex(replacing || !partState.activeStat ? 1 : Math.min(8, owned + 1))],
      nextQuality: QUALITY[Math.min(4, qualityIndex(owned) + 1)],
      nextThreshold: nextThreshold(owned)
    };
  }

  function syncOfferState(test, offer) {
    const fresh = offerForVariant(test, offer.partId, offer.statId, 0, offer.locked);
    if (!fresh) return;
    const identity = { id: offer.id, sold: offer.sold, locked: offer.locked };
    Object.assign(offer, fresh, identity);
  }

  function offerFor(test, slot) {
    const variant = weightedVariant(test);
    return variant ? offerForVariant(test, variant.partId, variant.statId, slot, false) : null;
  }

  function makeShopOffers(state, preservedOffers, firstOpen) {
    const test = runtime(state);
    if (!test) return [];
    const offers = [];
    (preservedOffers || []).forEach(function (offer) {
      if (offers.length >= 4 || !offer) return;
      const partState = test.parts[offer.partId];
      if (partState.activeStat === offer.statId && partState.copies >= 8) return;
      offers.push(offerForVariant(test, offer.partId, offer.statId, offers.length, true));
    });
    if (firstOpen) {
      Object.keys(PARTS).filter(function (partId) {
        const partState = test.parts[partId];
        return partState.activeStat && partState.copies < 8
          && !offers.some(function (offer) { return offer.partId === partId && offer.statId === partState.activeStat; });
      }).forEach(function (partId) {
        const partState = test.parts[partId];
        if (offers.length < 4) offers.push(offerForVariant(test, partId, partState.activeStat, offers.length, false));
      });
    }
    while (offers.length < 4) {
      const offer = offerFor(test, offers.length);
      if (!offer) break;
      offers.push(offer);
    }
    return offers;
  }

  function openShop(state, shopNumber, encounterId) {
    const test = runtime(state);
    if (!test || shopNumber > SHOP_ENCOUNTERS.length) return;
    test.shopIndex = shopNumber;
    test.currentShopStage = shopNumber;
    test.currentShopEncounter = encounterId || SHOP_ENCOUNTERS[shopNumber - 1];
    test.lastShopIncome = test.materialsSinceLastShop;
    test.materialsSinceLastShop = 0;
    test.rerolls = 0;
    test.refreshCost = REFRESH_BASE_COST;
    test.offers = makeShopOffers(state, test.carriedLocks, true);
    test.carriedLocks = [];
    state.previousMode = "combat";
    state.mode = "component_shop";
  }

  function buyComponent(state, offerId) {
    const test = runtime(state);
    if (!test) return;
    const offer = test.offers.find(function (item) { return item.id === offerId; });
    if (!offer || offer.sold || state.materials < offer.cost) return;
    const partState = test.parts[offer.partId];
    state.materials -= offer.cost;
    test.materialsSpent += offer.cost;
    test.componentsBought += 1;
    const actualAction = !partState.activeStat ? "install" : partState.activeStat === offer.statId ? "upgrade" : "replace";
    if (!partState.activeStat || partState.activeStat !== offer.statId) {
      partState.activeStat = offer.statId;
      partState.copies = 1;
    } else {
      partState.copies = Math.min(8, partState.copies + 1);
    }
    Object.keys(partState.allocations).forEach(function (statId) {
      partState.allocations[statId] = statId === partState.activeStat ? qualityIndex(partState.copies) : 0;
    });
    offer.sold = true;
    test.lastComponentAction = { partId: offer.partId, statId: offer.statId, action: actualAction, copies: partState.copies };
    test.offers.forEach(function (item) { if (!item.sold) syncOfferState(test, item); });
    rebuildParams(state);
  }

  function chooseComponentStat(state, statId) {
    return statId;
  }

  function refreshShop(state) {
    const test = runtime(state);
    const cost = test && test.refreshCost || REFRESH_BASE_COST;
    if (!test || state.materials < cost) return;
    state.materials -= cost;
    test.materialsSpent += cost;
    test.rerolls += 1;
    test.offers = makeShopOffers(state, test.offers.filter(function (offer) { return offer.locked && !offer.sold; }), false);
    test.refreshCost = REFRESH_BASE_COST + test.rerolls * REFRESH_COST_STEP;
  }

  function toggleOfferLock(state, offerId) {
    const test = runtime(state);
    if (!test) return;
    const offer = test.offers.find(function (item) { return item.id === offerId; });
    if (!offer || offer.sold) return;
    offer.locked = !offer.locked;
  }

  function closeShop(state) {
    const test = runtime(state);
    if (!test || test.pendingStatPart) return;
    test.carriedLocks = test.offers.filter(function (offer) { return offer.locked && !offer.sold; }).map(function (offer) {
      return { partId: offer.partId, statId: offer.statId };
    });
    test.completedStages = Math.max(test.completedStages, test.currentShopStage || 0);
    test.currentShopStage = 0;
    test.currentShopEncounter = 0;
    test.offers = [];
    advanceToNextEncounter(state);
  }

  function gainExperience(state, amount) {
    const test = runtime(state);
    if (!test || amount <= 0) return;
    state.xp += amount;
    state.stats.xpCollected += amount;
    while (state.xp >= state.xpNeed) {
      state.xp -= state.xpNeed;
      state.level += 1;
      test.experienceLevels += 1;
      test.pendingExperiencePoints += 1;
      state.xpNeed = Math.round(state.xpNeed * 1.25 + 15);
      test.lastExperienceGain = { level: state.level, pending: test.pendingExperiencePoints };
    }
  }

  function makeExperienceChoices(state) {
    const test = runtime(state);
    if (!test) return [];
    if (!test.experienceOfferIds || test.experienceOfferIds.length !== 4) {
      const pool = Object.keys(EXPERIENCE_STATS);
      for (let index = pool.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        const held = pool[index];
        pool[index] = pool[swapIndex];
        pool[swapIndex] = held;
      }
      test.experienceOfferIds = pool.slice(0, 4);
    }
    return test.experienceOfferIds.map(function (id) {
      const stat = EXPERIENCE_STATS[id];
      return {
        id,
        title: stat.name,
        effect: stat.effect,
        formLine: stat.family + " · 已投入 " + test.experienceAllocations[id]
      };
    });
  }

  function routeAfterEncounter(state) {
    const test = runtime(state);
    const encounter = currentEncounter(state);
    if (!test || !encounter) return;
    test.postCollectionRoute = "";
    if (encounter.id >= ENCOUNTER_COUNT) {
      state.flags.won = true;
      state.lastRewardReason = "马克笔 Demo V2.1 完成：固定怪量、成长选择、组件制造与最终混合评审均已结束。";
      state.mode = "result";
      return;
    }
    if (encounter.shopAfter) {
      openShop(state, SHOP_ENCOUNTERS.indexOf(encounter.id) + 1, encounter.id);
    } else if (encounter.moduleAfter && test.moduleChoiceIndex < MODULE_ENCOUNTERS.length) {
      openModuleChoice(state);
    } else {
      advanceToNextEncounter(state);
    }
  }

  function openExperienceShop(state) {
    const test = runtime(state);
    if (!test || test.pendingExperiencePoints <= 0) {
      routeAfterEncounter(state);
      return;
    }
    state.previousMode = "combat";
    test.experienceOfferIds = [];
    state.upgradeChoices = makeExperienceChoices(state);
    state.mode = "level_up";
  }

  function chooseExperienceStat(state, statId) {
    const test = runtime(state);
    if (!test || !EXPERIENCE_STATS[statId] || test.pendingExperiencePoints <= 0) return;
    const previousHp = state.hp;
    test.experienceAllocations[statId] += 1;
    test.pendingExperiencePoints -= 1;
    rebuildParams(state);
    if (statId === "maxHp") state.hp = Math.min(state.maxHp, previousHp + 12);
    test.lastExperienceChoice = statId;
    if (test.pendingExperiencePoints > 0) {
      test.experienceOfferIds = [];
      state.upgradeChoices = makeExperienceChoices(state);
      state.mode = "level_up";
    } else {
      state.upgradeChoices = [];
      routeAfterEncounter(state);
    }
  }

  function beginCollection(state) {
    const test = runtime(state);
    const encounter = currentEncounter(state);
    if (!test || !encounter || test.collecting || encounter.id <= test.completedEncounters) return;
    test.collecting = true;
    test.collectionTime = COLLECTION_DURATION;
    test.collectionStartedFor = encounter.id;
    test.enemiesDispersedAtCollection = state.enemies.filter(function (enemy) { return !enemy.dead; }).length;
    state.warmupTime = COLLECTION_DURATION;
    state.stage.name = "第 " + encounter.id + "/" + ENCOUNTER_COUNT + " 关 · 资源回收";
    clearEncounterEntities(state);
  }

  function finishCollection(state) {
    const test = runtime(state);
    const encounter = currentEncounter(state);
    if (!test || !encounter || !test.collecting || encounter.id <= test.completedEncounters) return;
    const autoCollected = collectLoosePickups(state);
    const harvestingReward = test.experienceAllocations.harvesting || 0;
    const stageReward = encounter.materialReward + harvestingReward;
    state.materials += stageReward;
    state.stats.materialsCollected += stageReward;
    test.stageMaterialsEarned += stageReward;
    test.harvestingMaterialsEarned += harvestingReward;
    test.materialsSinceLastShop += stageReward;
    test.lastStageReward = stageReward;
    test.completedEncounters = encounter.id;
    test.completedEncounterOrder.push(encounter.id);
    test.lastEncounterSummary = {
      id: encounter.id,
      phase: encounter.phase,
      autoCollected,
      materialReward: stageReward,
      harvestingReward,
      remainingEnemiesDispersed: test.enemiesDispersedAtCollection,
      spawned: test.encounterSpawned,
      quota: encounter.spawnTotal
    };
    test.lastCollection = { encounterId: encounter.id, autoCollected, duration: COLLECTION_DURATION };
    test.collecting = false;
    test.collectionTime = 0;
    state.warmupTime = 0;
    clearEncounterEntities(state);
    state.pickups = [];
    if (test.pendingExperiencePoints > 0) openExperienceShop(state);
    else routeAfterEncounter(state);
  }

  function completeEncounter(state, immediate) {
    beginCollection(state);
    if (immediate) finishCollection(state);
  }

  function tick(state, dt) {
    const test = runtime(state);
    if (!test || state.mode !== "combat") return;
    test.elapsed = totalElapsed(state);
    test.lifeStealCooldown = Math.max(0, test.lifeStealCooldown - (dt || 0));
    if (!test.collecting && state.hp > 0 && state.hp < state.maxHp && state.activeFormParams.markerFixedHpRegen > 0) {
      state.hp = Math.min(state.maxHp, state.hp + state.activeFormParams.markerFixedHpRegen * (dt || 0));
    }
    if (test.collecting) test.collectionTime = state.warmupTime;
  }

  const markerFixed = {
    id: "marker-fixed",
    version: "Demo V2.1",
    runtimeKey: "marker",
    weaponId: "marker",
    weaponName: "马克笔",
    title: "马克笔双成长轴固定测试",
    subtitle: "远程直线贯穿负责拉线；复写负责即时膨胀；留档负责持续铺场。",
    duration: DURATION,
    phaseCount: PHASE_COUNT,
    encounterCount: ENCOUNTER_COUNT,
    shopCount: SHOP_ENCOUNTERS.length,
    encounters: ENCOUNTERS,
    moduleEncounters: MODULE_ENCOUNTERS,
    shopEncounters: SHOP_ENCOUNTERS,
    enemyFloor: 14,
    normalEnemyTarget: 30,
    enemyCap: 68,
    moduleTimes: MODULE_TIMES,
    shopTimes: SHOP_TIMES,
    componentCost: COMPONENT_COST,
    refreshBaseCost: REFRESH_BASE_COST,
    refreshCostStep: REFRESH_COST_STEP,
    collectionDuration: COLLECTION_DURATION,
    guaranteedMaterialTotal: GUARANTEED_MATERIAL_TOTAL,
    uiFramework: UI_FRAMEWORK,
    waves: makeWaves(),
    stage: {
      id: 1,
      phaseKey: "weapon_intro",
      phaseStep: 1,
      phase: "Demo V2.1 马克笔固定测试",
      name: "第 1/17 关 · 基础队列",
      duration: ENCOUNTERS[0].duration,
      targetKills: 99999,
      spawnEvery: 99,
      enemyHp: 20,
      enemySpeed: 72,
      material: 0,
      enemyMix: [{ type: "todo", weight: 1 }],
      note: "只验证马克笔：经验稳定成长，模块改变机制，组件只强化属性。",
      threatHint: ENCOUNTERS[0].hint,
      demoV2Phase: "marker-fixed"
    },
    modules: MODULES,
    parts: PARTS,
    experienceStats: EXPERIENCE_STATS,
    qualities: QUALITY,
    qualityIndex,
    nextThreshold,
    currentEncounter,
    totalElapsed,
    startEncounter,
    makeRuntime: function makeRuntime() {
      return {
        modules: { copy: 0, archive: 0 },
        moduleOrder: [], moduleChoiceIndex: 0, lastModule: "",
        parts: { tip: makePartState("tip"), body: makePartState("body"), tail: makePartState("tail") },
        experienceLevels: 0, pendingExperiencePoints: 0, lastExperienceGain: null, lastExperienceChoice: "",
        experienceAllocations: makeExperienceAllocations(), experienceOfferIds: [], lifeStealCooldown: 0,
        currentEncounterIndex: 0, currentPhase: 1, currentPhaseStep: 1,
        encounterSpawned: 0, collecting: false, collectionTime: 0, collectionStartedFor: 0,
        enemiesDispersedAtCollection: 0, lastCollection: null, postCollectionRoute: "",
        completedEncounters: 0, completedEncounterOrder: [], completedStages: 0,
        stageMaterialsEarned: 0, harvestingMaterialsEarned: 0, dropMaterialsEarned: 0, materialsSpent: 0, componentsBought: 0,
        materialsSinceLastShop: 0, lastShopIncome: 0, lastStageReward: 0, lastAutoCollect: null,
        shopIndex: 0, currentShopStage: 0, currentShopEncounter: 0, rerolls: 0, refreshCost: REFRESH_BASE_COST,
        offers: [], carriedLocks: [], pendingStatPart: "", pendingQualityIndex: 0,
        eliteCandidateSerial: 0,
        pendingRounds: [], fullscreenCopyReadyAt: 0, fullscreenArchiveReadyAt: 0,
        fullscreenCopyTriggers: 0, fullscreenArchiveTriggers: 0
      };
    },
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

  V2.demoV2 = Object.assign(V2.demoV2 || {}, { markerFixed });
})();
