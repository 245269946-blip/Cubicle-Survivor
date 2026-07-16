// ================================================================
// src/v2/ui/view-model.js
// UI reads view models; it does not own combat/progression decisions.
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});
  const V2 = CS.V2 || (CS.V2 = {});

  const WEAPON_ORDER = ["marker", "thermos", "sticky_note"];

  const THEME_BY_TOPOLOGY = [
    { test: /line|pierce|split|beam|grid|mark/, id: "line", label: "拉线贯穿", action: "用走位把敌人排成一条线。" },
    { test: /heat|charge|steam|release|pulse/, id: "charge", label: "蓄力释放", action: "等能量到点，再把一波敌人打穿。" },
    { test: /trap|field|zone|link|path/, id: "trap", label: "布阵连线", action: "提前放置，让敌人自己走进规则区。" },
    { test: /homing|projectile|chain|bounce/, id: "projectile", label: "追踪跳点", action: "依赖高频命中和目标转移滚雪球。" },
    { test: /melee|counter|arc/, id: "counter", label: "近身反击", action: "贴近压力，把撞击变成反击窗口。" },
    { test: /aura|wave|broadcast|spread/, id: "wave", label: "扩散传播", action: "让一次命中扩散成一片影响。" },
    { test: /orbit|window|settle/, id: "orbit", label: "窗口结算", action: "围绕目标积累，再一次性结算。" },
    { test: /cone|vortex|channel/, id: "vortex", label: "持续牵引", action: "维持方向和节奏，把敌人卷进主轴。" }
  ];

  function fmtTime(seconds) {
    const s = Math.max(0, Math.ceil(seconds || 0));
    const m = Math.floor(s / 60);
    const rest = s % 60;
    return String(m).padStart(2, "0") + ":" + String(rest).padStart(2, "0");
  }

  function fixedTestConfig(state) {
    return V2.getDemoV2FixedTestConfig ? V2.getDemoV2FixedTestConfig(state) : null;
  }

  function fixedTestRuntime(state, config) {
    const activeConfig = config || fixedTestConfig(state);
    return activeConfig && state.demoV2 ? state.demoV2[activeConfig.runtimeKey] : null;
  }

  function markerExperienceSummary(test, config) {
    const defs = config && config.experienceStats || V2.demoV2 && V2.demoV2.markerFixed && V2.demoV2.markerFixed.experienceStats || {};
    const entries = Object.keys(defs).filter(function (id) {
      return test.experienceAllocations[id] > 0;
    }).map(function (id) {
      return (defs[id].short || defs[id].name) + test.experienceAllocations[id];
    });
    return entries.length ? entries.join("/") : "未分配";
  }

  function stagePhase(state) {
    const stage = state.stage || {};
    const suiteVersion = state.demoV2 && state.demoV2.suiteVersion;
    if (stage.demoV2Phase === "phase-a") {
      return {
        id: "demo-v2-phase-a",
        key: "demo-v2-phase-a",
        label: "Demo V2 阶段 A",
        weaponStage: "基础武器 × 敌群",
        weaponStageShort: "暴力测试",
        playerGoal: "只判断武器母题和敌群互动，不判断 Build 深度。",
        rewardTiming: "60 秒后直接进入测试复盘。",
        status: "prototype",
        note: "无工牌、无模块、无卡槽、无军械库"
      };
    }
    if (stage.demoV2Phase === "phase-b") {
      return {
        id: "demo-v2-phase-b",
        key: "demo-v2-phase-b",
        label: "Demo V2 阶段 B",
        weaponStage: "代表工牌 × 办公模块",
        weaponStageShort: "身份膨胀",
        playerGoal: "验证重武器母题能否承载轻、快、立即可见的成长。",
        rewardTiming: "30 秒身份定型；随后三次轻模块选择。",
        status: "prototype",
        note: "一把武器、一个代表工牌、最多三个模块"
      };
    }
    if (stage.demoV2Phase === "marker-fixed") {
      return {
        id: "demo-v2-marker-fixed",
        key: "demo-v2-marker-fixed",
        label: (suiteVersion || "Demo V2.1") + " 马克笔固定测试",
        weaponStage: "模块机制 × 组件属性",
        weaponStageShort: "三线验证",
        playerGoal: "验证经验稳定成长、模块机制变化与材料组件取舍能否同时成立。",
        rewardTiming: "八个战斗阶段；指定阶段先选模块，再进入四格组件商店。",
        status: "prototype",
        note: "只有马克笔；无工牌、卡牌、协同和其他武器"
      };
    }
    if (stage.demoV2Phase === "thermos-fixed") {
      return {
        id: "demo-v2-thermos-fixed",
        key: "demo-v2-thermos-fixed",
        label: (suiteVersion || "Demo V2.2") + " 保温杯固定测试",
        weaponStage: "冷凝铺场 × 聚焦击杀热浪",
        weaponStageShort: "近距双路线",
        playerGoal: "验证短距扇面是否要求站位，以及群体铺场与单体击杀能否形成两条清晰路线。",
        rewardTiming: "5 阶段 17 关；四次模块与六次组件商店沿用固定节奏。",
        status: "prototype",
        note: "只有保温杯；无工牌、卡牌、协同和其他武器"
      };
    }
    if (stage.demoV2Phase === "scissors-fixed") {
      return {
        id: "demo-v2-scissors-fixed",
        key: "demo-v2-scissors-fixed",
        label: (suiteVersion || "Demo V2.3") + " 剪刀固定测试",
        weaponStage: "轻步进场 × 双段近战时间线",
        weaponStageShort: "贴身双路线",
        playerGoal: "验证纯近战风险、自动闪身进场，以及合刃/张刃两段动作能否形成清晰取舍。",
        rewardTiming: "5 阶段 17 关；四次模块与六次组件商店沿用固定节奏。",
        status: "prototype",
        note: "只有剪刀；固定携带低血安全区；无随机道具池"
      };
    }
    if (stage.demoV2Phase === "correction-fluid-fixed") {
      return {
        id: "demo-v2-correction-fluid-fixed",
        key: "demo-v2-correction-fluid-fixed",
        label: (suiteVersion || "Demo V2.5") + " 修正液固定测试",
        weaponStage: "错误状态 × 污染/纠错双路线",
        weaponStageShort: "错误双路线",
        playerGoal: "验证改变敌人状态能否形成独立于路径、空间和自身位移的第四种武器关系。",
        rewardTiming: "5 阶段 17 关；四次模块与六次组件商店沿用固定节奏。",
        status: "prototype",
        note: "只有修正液；不接入其他武器、工牌、卡牌、协同或随机道具池"
      };
    }
    const phase = V2.getPhaseMeta ? V2.getPhaseMeta(stage.phaseKey) : {};
    const id = stage.phaseFinal ? "phase-final" : (phase.key || "growth");
    let note = phase.playerGoal || "经验和材料服务当前主形态。";
    if (stage.phaseFinal) note = phase.rewardTiming || note;
    return {
      id,
      key: phase.key || stage.phaseKey || "unknown",
      label: phase.label || stage.phase || "构筑推进",
      weaponStage: phase.weaponStage || "主武器成长",
      weaponStageShort: phase.weaponStageShort || "成长",
      playerGoal: phase.playerGoal || note,
      rewardTiming: phase.rewardTiming || "",
      status: phase.status || "fallback",
      note
    };
  }

  function pageTheme(state) {
    const config = fixedTestConfig(state);
    const weapon = state.selectedWeaponId ? CS.weapons && CS.weapons[state.selectedWeaponId] || config && config.weaponCard : null;
    const form = state.activeForm || {};
    const topology = form.mechanicType || (weapon && (weapon.formTopology || weapon.topology)) || "basic";
    const signature = V2.getWeaponFormSignature ? V2.getWeaponFormSignature(form.mechanicType || weapon && (weapon.formTopology || weapon.topology)) : null;
    const theme = THEME_BY_TOPOLOGY.find(item => item.test.test(topology)) || { id: "generic", label: "基础形态", action: "先看攻击方式，再决定如何强化。" };
    const dept = state.badgeDept;
    return {
      id: theme.id,
      label: theme.label,
      action: theme.action,
      topology,
      weaponId: state.selectedWeaponId || "",
      weaponName: weapon ? weapon.name : "未选择武器",
      weaponMotif: weapon ? weapon.motif : "基础武器",
      formName: form.displayName || (weapon ? "实习" + weapon.name : "实习武器"),
      formShort: form.short || (weapon ? weapon.tagDescription : "基础形态"),
      combatVerb: form.combatVerb || (weapon ? weapon.description : ""),
      signature,
      signatureLabel: signature ? signature.topology : "",
      signatureProcess: signature ? signature.process : "",
      signatureFocus: signature ? signature.focus : [],
      badgeName: dept ? V2.compat.deptName(dept) : "未选择工牌",
      badgeColor: dept ? V2.compat.deptColor(dept) : "#00e5ff",
      phase: stagePhase(state)
    };
  }

  function weaponList(state) {
    const weapons = CS.weapons || {};
    const config = fixedTestConfig(state);
    const order = config && config.weaponCards ? config.weaponCards.map(function (item) { return item.id; }) : config && config.weaponCard ? [config.weaponId] : WEAPON_ORDER;
    return order.map(function (id) {
      const w = config && config.weaponCards ? config.weaponCards.find(function (item) { return item.id === id; }) : weapons[id] || config && config.weaponCard;
      if (!w) return null;
      const topology = w.formTopology || w.topology || "";
      const theme = THEME_BY_TOPOLOGY.find(item => item.test.test(topology)) || { id: "generic", label: "基础形态" };
      const signature = V2.getWeaponFormSignature ? V2.getWeaponFormSignature(topology) : null;
      return {
        id,
        name: w.name,
        emoji: w.emoji,
        motif: w.motif,
        description: w.description,
        topology,
        tagDescription: w.tagDescription,
        themeId: theme.id,
        themeLabel: theme.label,
        signatureLabel: signature ? signature.topology : theme.label,
        signatureProcess: signature ? signature.process : w.description,
        signatureFocus: signature ? signature.focus : [],
        implemented: !!w.implemented || id === "marker" || id === "thermos" || id === "sticky_note"
      };
    }).filter(Boolean);
  }

  function supportWeaponList(state) {
    const supportOrder = ["marker", "thermos", "sticky_note"];
    const current = state.selectedWeaponId;
    const weapons = CS.weapons || {};
    return supportOrder.filter(function (id) { return id !== current && weapons[id]; }).map(function (id) {
      const w = weapons[id];
      const theme = THEME_BY_TOPOLOGY.find(item => item.test.test(w.formTopology || "")) || { id: "generic", label: "基础辅助" };
      const signature = V2.getWeaponFormSignature ? V2.getWeaponFormSignature(w.formTopology || "") : null;
      const supportCopy = {
        marker: "每隔一段时间射出一条短贯穿线。",
        thermos: "每隔一段时间释放一圈小热浪。",
        sticky_note: "每隔一段时间放置一张延迟贴纸。"
      };
      return {
        id,
        name: w.name,
        emoji: w.emoji,
        motif: w.motif,
        description: supportCopy[id] || w.description,
        topology: w.formTopology,
        tagDescription: w.tagDescription,
        themeId: theme.id,
        themeLabel: theme.label,
        signatureLabel: signature ? signature.topology : theme.label,
        signatureProcess: signature ? signature.process : supportCopy[id] || w.description,
        signatureFocus: signature ? signature.focus : [],
        implemented: true
      };
    });
  }

  function badgeForms(state) {
    return ["tech", "product", "ops", "marketing", "general"].map(function (dept) {
      const form = V2.getWeaponForm(state.selectedWeaponId, dept);
      const fakeState = Object.assign({}, state, { activeForm: form, badgeDept: dept });
      const theme = pageTheme(fakeState);
      const signature = V2.getWeaponFormSignature ? V2.getWeaponFormSignature(form) : null;
      return {
        dept,
        deptName: V2.compat.deptName(dept),
        deptEmoji: V2.compat.deptEmoji(dept),
        color: V2.compat.deptColor(dept),
        formName: form.displayName,
        short: form.short,
        combatVerb: form.combatVerb,
        mechanicType: form.mechanicType,
        signatureLabel: signature ? signature.topology : "",
        signatureProcess: signature ? signature.process : form.combatVerb,
        signatureFocus: signature ? signature.focus : [],
        weakness: form.weakness,
        bestMatch: !!form.bestMatch,
        theme
      };
    });
  }

  function paramSummary(params, theme) {
    const topology = theme.topology || "";
    if (params.correctionFluidFixedTest) {
      return [
        { label: "喷射", value: Math.round(params.damage || 0) },
        { label: "目标", value: params.correctionTargetCount || 1 },
        { label: "攻速", value: (params.cooldown || 0).toFixed(2) + "s" },
        { label: "错误", value: "0—3 层" },
        { label: "污染区", value: Math.round(params.correctionAreaRadius || 0) },
        { label: "状态", value: (params.correctionErrorDuration || 0).toFixed(1) + "s" }
      ];
    }
    if (params.scissorsFixedTest) {
      return [
        { label: "伤害", value: Math.round(params.damage || 0) },
        { label: "暴击", value: Math.round((params.markerFixedCritChance || 0) * 100) + "%" },
        { label: "动作轮", value: (params.cooldown || 0).toFixed(2) + "s" },
        { label: "闪避", value: Math.round((params.markerFixedDodgeChance || 0) * 100) + "%" },
        { label: "突刺", value: params.scissorsThrustCount || 0 },
        { label: "连剪", value: params.scissorsCutCount || 0 }
      ];
    }
    if (params.thermosFixedTest) {
      return [
        { label: "伤害", value: Math.round(params.damage || 0) },
        { label: "暴击", value: Math.round((params.markerFixedCritChance || 0) * 100) + "%" },
        { label: "攻速", value: (params.cooldown || 0).toFixed(2) + "s" },
        { label: "喷射组", value: params.amount || 1 },
        { label: "扇面", value: Math.round(params.range || 0) + "×" + Math.round(params.width || 0) },
        { label: "冷凝", value: (params.thermosFixedCondensationDuration || 0).toFixed(1) + "s" }
      ];
    }
    if (params.markerFixedTest) {
      return [
        { label: "伤害", value: Math.round(params.damage || 0) },
        { label: "穿透", value: params.pierce || 0 },
        { label: "攻速", value: (params.cooldown || 0).toFixed(2) + "s" },
        { label: "数量", value: params.amount || 1 },
        { label: "范围", value: Math.round(params.range || 0) },
        { label: "持续", value: (params.markerFixedTrailDuration || 0).toFixed(1) + "s" }
      ];
    }
    if (/split/.test(topology)) {
      return [
        { label: "伤害", value: Math.round(params.damage || 0) },
        { label: "穿透", value: params.pierce || 0 },
        { label: "分裂", value: params.splitCount || 0 },
        { label: "间隔", value: (params.cooldown || 0).toFixed(2) + "s" }
      ];
    }
    if (/detonate|mark/.test(topology)) {
      return [
        { label: "伤害", value: Math.round(params.damage || 0) },
        { label: "光爆", value: Math.round(params.explosionRadius || 0) },
        { label: "窗口", value: (params.markWindow || 0).toFixed(1) + "s" },
        { label: "间隔", value: (params.cooldown || 0).toFixed(2) + "s" }
      ];
    }
    if (/charge|heat|steam|pulse/.test(topology)) {
      return [
        { label: "蓄热", value: Math.round(params.heatRate || 0) },
        { label: "释放", value: Math.round(params.releaseDamage || params.pulseDamage || params.damage || 0) },
        { label: "范围", value: Math.round(params.releaseRange || params.pulseRadius || params.stationRadius || params.waveRadius || 0) },
        { label: "模块", value: params.summonCount || params.stationLimit || params.pulseCount || 1 }
      ];
    }
    if (/trap|field|zone|link|path|sticky/.test(topology)) {
      return [
        { label: "贴纸", value: Math.round(params.damage || 0) },
        { label: "范围", value: Math.round(params.linkRadius || params.spreadRadius || params.explosionRadius || params.trapRadius || 0) },
        { label: "持续", value: (params.trapDuration || 0).toFixed(1) + "s" },
        { label: "传播", value: params.spreadLimit || params.summonCount || params.stationLimit || 0 }
      ];
    }
    return [
      { label: "伤害", value: Math.round(params.damage || 0) },
      { label: "间隔", value: (params.cooldown || 0).toFixed(2) + "s" },
      { label: "距离", value: Math.round(params.range || params.releaseRange || 0) },
      { label: "护盾", value: Math.round(params.shield || params.shieldGain || 0) }
    ];
  }

  function buildSummary(state) {
    const currentFixedConfig = fixedTestConfig(state);
    const weapon = state.selectedWeaponId ? (currentFixedConfig ? currentFixedConfig.weaponName : V2.compat.weaponName(state.selectedWeaponId)) : "未选择武器";
    const form = state.activeForm;
    const params = state.activeFormParams || {};
    const theme = pageTheme(state);
    const openSlots = V2.progression && V2.progression.getOpenSlots ? V2.progression.getOpenSlots(state) : [];
    const fixedConfig = fixedTestConfig(state);
    const fixedRuntime = fixedTestRuntime(state, fixedConfig);
    const markerComponents = fixedConfig && fixedRuntime
      ? Object.keys(fixedConfig.parts).map(function (id) {
          return markerComponentPartView(fixedConfig, fixedRuntime, id);
        })
      : [];
    return {
      weapon,
      badge: state.badgeDept ? V2.compat.deptName(state.badgeDept) : "未选择工牌",
      secondaryBadge: state.secondaryBadgeDept ? V2.compat.deptName(state.secondaryBadgeDept) : "",
      supportWeapon: state.supportWeaponId ? V2.compat.weaponName(state.supportWeaponId) : "",
      supportSkill: state.supportSkill ? state.supportSkill.label : "",
      formName: form ? form.displayName : "基础实习形态",
      formShort: form ? form.short : "先体验基础武器",
      mechanicType: form ? form.mechanicType : "",
      signature: theme.signature,
      signatureLabel: theme.signatureLabel,
      signatureProcess: theme.signatureProcess,
      signatureFocus: theme.signatureFocus,
      theme,
      promoted: !!(state.flags && state.flags.promoted),
      promotion: state.promotionLog && state.promotionLog.length ? state.promotionLog[state.promotionLog.length - 1] : null,
      params: paramSummary(params, theme),
      components: markerComponents,
      slots: ["offense", "survival", "resource", "mechanic", "cost"].map(function (slotId) {
        const def = V2.progression.SLOT_DEFS[slotId];
        return {
          slotId,
          name: def.name,
          open: openSlots.indexOf(slotId) >= 0,
          unlock: def.unlock,
          unlockLabel: "转正期第 " + def.unlock + " 步开放",
          value: state.slotAssignments[slotId] || "空",
          augments: state.slotAugments[slotId] || []
        };
      })
    };
  }

  function mechanicStatus(state) {
    const p = state.activeFormParams || {};
    const form = state.activeForm || {};
    const mechanic = form.mechanicType || "";
    const zones = state.damageZones || [];
    const enemies = state.enemies || [];
    if (p.correctionFluidFixedTest && state.demoV2 && state.demoV2.correctionFluid) {
      const test = state.demoV2.correctionFluid;
      const overloaded = enemies.filter(function (enemy) { return (enemy.correctionErrorStacks || 0) >= 3; }).length;
      const highest = enemies.reduce(function (max, enemy) { return Math.max(max, enemy.correctionErrorStacks || 0); }, 0);
      const elapsed = V2.demoV2.correctionFluidFixed.totalElapsed(state);
      function readyText(unlocked, readyAt) {
        if (!unlocked) return "未解锁";
        const remaining = Math.max(0, (readyAt || 0) - elapsed);
        return remaining > 0 ? "冷却 " + remaining.toFixed(1) + "s" : "可触发";
      }
      return {
        label: "修正液错误系统",
        value: "最高错误 " + highest + "/3 · 过载 " + overloaded + " · 污染区 " + (test.activeErrorAreas || 0),
        hint: "错误扩散 Lv." + test.modules.copy + " / 致命纠错 Lv." + test.modules.archive + " · 系统崩溃 " + readyText(p.correctionCrashEnabled, test.crashReadyAt) + " / 最终纠错 " + readyText(p.correctionFinalEnabled, test.finalReadyAt),
        tone: "correction"
      };
    }
    if (p.scissorsFixedTest && state.demoV2 && state.demoV2.scissors) {
      const test = state.demoV2.scissors;
      return {
        label: "剪刀近战流程",
        value: "轻步 " + (test.dashReady ? "已就绪" : Math.round((test.dashCharge || 0) * 100) + "%") + " · 合刃 " + (p.scissorsThrustCount || 0) + " · 张刃 " + (p.scissorsCutCount || 0),
        hint: "合刃 Lv." + test.modules.copy + " / 张刃 Lv." + test.modules.archive + " · 当前动作轮 " + (test.activeRound ? "进行中" : "待机") + " · 裁断 " + (p.scissorsSever ? "已解锁" : "未解锁") + " / 合剪 " + (p.scissorsFinale ? "已解锁" : "未解锁") + " · 安全区 " + (test.shelterActive ? test.shelterTime.toFixed(1) + "s" : test.shelterCooldown > 0 ? "冷却 " + test.shelterCooldown.toFixed(1) + "s" : "可触发"),
        tone: "scissors"
      };
    }
    if (p.thermosFixedTest && state.demoV2 && state.demoV2.thermos) {
      const test = state.demoV2.thermos;
      const config = V2.demoV2.thermosFixed;
      const elapsed = config.totalElapsed(state);
      function readyText(unlocked, readyAt) {
        if (!unlocked) return "未解锁";
        const remaining = Math.max(0, (readyAt || 0) - elapsed);
        return remaining > 0 ? "冷却 " + remaining.toFixed(1) + "s" : "可触发";
      }
      const condensationCount = zones.filter(function (zone) { return zone.condensationZone; }).length;
      return {
        label: "保温杯近距流程",
        value: "喷射组 " + (p.amount || 1) + " · 冷凝在场 " + condensationCount + " · 聚焦/轮 " + (p.thermosFixedFocusHits || 0),
        hint: "冷凝 Lv." + test.modules.copy + " / 击杀热浪 Lv." + test.modules.archive + " · 本关聚焦击杀 " + test.stageFocusKills + " · 热浪 " + test.stageHeatwaveTriggers + " · 全屏冷凝 " + readyText(p.thermosFixedFullscreenCondensation, test.fullscreenCondensationReadyAt) + " / 全场点杀 " + readyText(p.thermosFixedFullscreenIgnition, test.fullscreenIgnitionReadyAt),
        tone: "thermos"
      };
    }
    if (p.markerFixedTest && state.demoV2 && state.demoV2.marker) {
      const test = state.demoV2.marker;
      const base = Math.max(1, p.amount || 1);
      const instant = base * (1 + (p.markerFixedParallelLines || 0)) * (p.markerFixedSecondRound ? 2 : 1);
      const trails = base * (p.markerFixedArchiveTrails || 0);
      const elapsed = V2.demoV2 && V2.demoV2.markerFixed && V2.demoV2.markerFixed.totalElapsed
        ? V2.demoV2.markerFixed.totalElapsed(state)
        : Math.max(0, 720 - state.stageTime);
      function readyText(unlocked, readyAt) {
        if (!unlocked) return "未解锁";
        const remaining = Math.max(0, (readyAt || 0) - elapsed);
        return remaining > 0 ? "冷却 " + remaining.toFixed(1) + "s" : "可触发";
      }
      return {
        label: "马克笔三线成长",
        value: "激光 " + instant + " · 墨迹 " + trails,
        hint: "复写 Lv." + test.modules.copy + " / 留档 Lv." + test.modules.archive + " · 基础属性 " + markerExperienceSummary(test) + " · 全屏复写 " + readyText(p.markerFixedFullscreenCopy, test.fullscreenCopyReadyAt) + " / 全屏留档 " + readyText(p.markerFixedFullscreenArchive, test.fullscreenArchiveReadyAt),
        tone: "marker"
      };
    }
    if (mechanic === "line_split") {
      return state.stage && state.stage.boss
        ? { label: "分裂回折", value: (p.splitCount || 2) + " 路", hint: "优先锁定工作项；空闲支线以较低伤害回折聚焦 Boss。", tone: "marker" }
        : { label: "锁敌分裂", value: (p.splitCount || 2) + " 路/命中点", hint: "把敌人拉近主线，真实命中点才会长出支线。", tone: "marker" };
    }
    if (mechanic === "mark_detonate") {
      const marked = enemies.filter(function (enemy) { return enemy.p0Marked && enemy.p0MarkTime > 0; });
      const remaining = marked.length ? Math.max.apply(null, marked.map(function (enemy) { return enemy.p0MarkTime; })) : 0;
      return { label: "P0 窗口", value: marked.length ? marked.length + " 个 · " + remaining.toFixed(1) + "s" : "等待高血目标", hint: "窗口内再次命中才会引爆；过期不会爆炸。", tone: "marker" };
    }
    if (mechanic === "shield_counter_line") return { label: "应急盾", value: Math.round(p.shield || 0) + " / " + Math.round(p.markerShieldMax || 18), hint: "敌方伤害真正打破护盾后，才会触发反刺。", tone: "marker" };
    if (mechanic === "line_to_wave") return { label: "扩散波", value: zones.filter(function (zone) { return zone.source === "marker_wave" || zone.source === "marker_wave_return"; }).length + " 圈在场", hint: "波纹从主线最后命中点出发，扫到敌人才结算。", tone: "marker" };
    if (mechanic === "line_grid_field") return { label: "审批留痕", value: zones.filter(function (zone) { return zone.source === "marker_grid_line"; }).length + " 条残线", hint: "两条真实残线相交才会生成控制区。", tone: "marker" };
    if (mechanic === "charge_release_beam" || mechanic === "heat_meter_steam") {
      const heatMax = p.heatMax || 100;
      const heat = Math.round(p.heat || 0);
      const lockout = p.releaseLockout || 0;
      if (p.demoV2SteamFan) {
        return {
          label: lockout > 0 ? "沸点空窗" : "扇面蓄热",
          value: lockout > 0 ? lockout.toFixed(1) + "s" : heat + " / " + heatMax,
          hint: lockout > 0 ? "宽幅释放结束，利用减速区拉开距离。" : heat >= heatMax * 0.75 ? "接近沸点：贴近团块，让扩大扇面覆盖更多目标。" : "近距离宽幅蒸汽持续减速灼烧并积热。",
          tone: "thermos"
        };
      }
      return { label: lockout > 0 ? "释放空窗" : "蓄热", value: lockout > 0 ? lockout.toFixed(1) + "s" : heat + " / " + heatMax, hint: lockout > 0 ? "沸点释放后暂时不能攻击，先走位拉开。" : heat >= heatMax * 0.75 ? "接近沸点：让敌人排成直线。" : "攻击自动积热，满热释放蒸汽柱。", tone: "thermos" };
    }
    if (mechanic === "patrol_summon_steam") return { label: "恒温模块", value: zones.filter(function (zone) { return zone.droneModule; }).length + " 个巡航", hint: "模块会从自身位置主动锁敌喷汽。", tone: "thermos" };
    if (mechanic === "shield_break_pulse") return { label: "暖流盾", value: Math.round(p.shield || 0) + " / " + Math.round(p.shieldThreshold || 30), hint: "承伤破盾后释放热浪，不会自动触发。", tone: "thermos" };
    if (mechanic === "periodic_wave_spread") return { label: "茶香传播", value: zones.filter(function (zone) { return zone.source === "thermos_tea_wave" || zone.source === "thermos_tea_echo"; }).length + " 圈在场", hint: "主波附着茶香，目标死亡时产生回声。", tone: "thermos" };
    if (mechanic === "deployable_safe_station") return { label: "茶水间", value: zones.filter(function (zone) { return zone.source === "thermos_station"; }).length + " / " + (p.stationLimit || 1), hint: "站进范围获得补给，离开后只保留区域效果。", tone: "thermos" };
    if (mechanic === "manual_trap_detonate") {
      const traps = zones.filter(function (zone) { return zone.stickyTrap && (zone.source === "sticky_manual_trap" || zone.triggerSource === "sticky_sync_blast"); });
      const armed = traps.filter(function (zone) { return zone.armed; }).length;
      return { label: "开关贴", value: armed + " / " + traps.length + " 已装订", hint: armed ? "按 空格 同步引爆已装订贴纸。" : "先自动放置并等待装订，再按空格。", tone: "sticky" };
    }
    if (mechanic === "seeking_trap_summon") return { label: "智能待办", value: zones.filter(function (zone) { return zone.seekingSticky; }).length + " 张寻敌", hint: "装订完成后主动寻敌，碰撞只爆一次。", tone: "sticky" };
    if (mechanic === "route_buff_trap") return { label: "值班路线", value: zones.filter(function (zone) { return zone.routeSticky; }).length + " 张铺路", hint: "每张贴纸只在首次经过时提供一次补给。", tone: "sticky" };
    if (mechanic === "sticky_debuff_spread") return { label: "传播贴", value: enemies.filter(function (enemy) { return !!enemy.stickyDebuff; }).length + " 个附着", hint: "附着目标死亡后向附近敌人接力。", tone: "sticky" };
    if (mechanic === "trap_link_control_zone") return { label: "公告板", value: zones.filter(function (zone) { return zone.noticeNode; }).length + " / 3 节点", hint: "三张贴纸距离有效时才会连边闭合。", tone: "sticky" };
    if (state.selectedWeaponId === "thermos") return { label: "基础蓄热", value: Math.round(p.heat || 0) + " / " + (p.heatMax || 100), hint: "攻击自动积热，满热释放。", tone: "thermos" };
    if (state.selectedWeaponId === "sticky_note") return { label: "基础贴纸", value: zones.filter(function (zone) { return zone.stickyTrap; }).length + " 张在场", hint: "贴纸完成装订后由敌人触发。", tone: "sticky" };
    return { label: "基础贯穿", value: (p.pierce || 2) + " 个目标", hint: "移动让敌人排成线，武器自动攻击。", tone: "marker" };
  }

  function transitionView(state, markerTest, config) {
    const encounter = config && config.currentEncounter ? config.currentEncounter(state) : null;
    if (!config || !markerTest || !encounter) {
      return {
        kind: "encounter",
        symbol: "预告",
        eyebrow: state.stage ? "第 " + state.stage.id + " 关 · 关卡预告" : "关卡预告",
        title: state.stage ? state.stage.name : "准备中",
        hint: "WASD 移动，武器自动攻击。",
        tags: [],
        rule: "观察本关目标与敌人压力",
        next: "下一步：开始战斗",
        duration: 3
      };
    }
    const scheduledRoute = encounter.id >= config.encounterCount
      ? "本局结算"
      : encounter.shopAfter
        ? "组件商店"
        : encounter.moduleAfter
          ? "模块选择"
          : "第 " + (encounter.id + 1) + " 关";
    const nextRoute = markerTest.pendingExperiencePoints > 0 ? "经验属性选择" : scheduledRoute;
    if (markerTest.collecting) {
      return {
        kind: "collection",
        symbol: "回收",
        eyebrow: "第 " + encounter.id + "/" + config.encounterCount + " 关完成 · 10 秒收集窗口",
        title: "资源回收进行中",
        hint: "自由移动拾取经验与材料；倒计时结束会自动吸取遗漏资源。",
        tags: ["经验靠近拾取", "材料靠近拾取", "结束自动吸取"],
        rule: "战斗已暂停生成，不会出现新敌人",
        next: "下一步：" + (markerTest.pendingExperiencePoints > 0 || (state.pickups || []).some(function (pickup) { return pickup.type === "xp"; }) ? "经验结算 → " + scheduledRoute : nextRoute),
        duration: config.collectionDuration
      };
    }
    return {
      kind: "encounter",
      symbol: encounter.boss ? "BOSS" : encounter.kind === "reinforced" || encounter.kind === "pressure" ? "强化" : "预告",
      eyebrow: "阶段 " + encounter.phase + "/" + config.phaseCount + " · 第 " + encounter.id + "/" + config.encounterCount + " 关",
      title: encounter.label,
      hint: encounter.preview,
      tags: encounter.enemyTypes.slice(),
      rule: encounter.boss ? "通关：Boss 必须击破，且倒计时结束或杂兵清空" : "通关：倒计时结束或固定怪量清空",
      next: "下一步：开始战斗",
      duration: 3
    };
  }

  function hud(state) {
    const form = buildSummary(state);
    const status = mechanicStatus(state);
    const demoPhase = state.stage && state.stage.demoV2Phase;
    const phaseA = demoPhase === "phase-a";
    const phaseB = demoPhase === "phase-b";
    const fixedConfig = fixedTestConfig(state);
    const markerTest = fixedTestRuntime(state, fixedConfig);
    const markerFixed = !!(fixedConfig && markerTest);
    const waveLabel = (phaseA || phaseB || markerFixed) && state.demoV2 && state.demoV2.waveId
      ? ({ queue: "队列波", cluster: "团块波", pursuit: "追逐波", review: "混合评审波" }[state.demoV2.waveId] || state.demoV2.waveId.replace(/-\d+$/, ""))
      : "";
    if (phaseB && state.demoV2 && state.demoV2.moduleOrder && state.demoV2.moduleOrder.length) {
      const config = V2.demoV2 && V2.demoV2.phaseB;
      const seenModules = [];
      state.demoV2.moduleOrder.forEach(function (id) { if (seenModules.indexOf(id) < 0) seenModules.push(id); });
      const moduleSummary = seenModules.map(function (id) {
        return config.modules[id].name + "×" + (state.demoV2.modules[id] || 1);
      }).join(" · ");
      status.hint = "模块：" + moduleSummary + "。" + status.hint;
      if (state.selectedWeaponId === "marker") {
        const params = state.activeFormParams || {};
        status.label = "划线流程";
        status.value = "主线×" + (1 + (params.demoV2ParallelLines || 0)) + " · 分叉" + (params.splitCount || 1) + " · " + (params.secondarySplit ? "二代转发" : "未转发");
      } else if (state.selectedWeaponId === "thermos") {
        const params = state.activeFormParams || {};
        status.label = "蒸汽流程";
        status.value = "出口×" + (params.demoV2FanCount || 1) + " · 冷凝" + (params.demoV2ThermosArchive || 0) + " · 热浪" + (params.demoV2ForwardHeatwave || 0);
      } else if (state.selectedWeaponId === "sticky_note") {
        const noticeNodes = (state.damageZones || []).filter(function (zone) { return zone.noticeNode; });
        const archiveNodes = noticeNodes.filter(function (zone) { return zone.archiveEcho; }).length;
        status.label = "公告流程";
        status.value = "节点" + noticeNodes.length + " · 留档" + archiveNodes + " · 三点闭合";
      }
    }
    const transition = transitionView(state, markerTest, fixedConfig);
    return {
      stageMeta: phaseA || phaseB || markerFixed ? (markerFixed ? ((state.demoV2 && state.demoV2.suiteVersion) || fixedConfig.version) + " · 阶段 " + (markerTest.currentPhase || 1) + "/5 · 第 " + (state.stage.id || 1) + "/17 关" : "Demo V2 · " + (phaseB ? "阶段 B" : "阶段 A") + (waveLabel ? " · " + waveLabel : "")) : state.stage ? "第 " + state.stage.id + " 关 · " + form.theme.phase.label + " · " + form.theme.phase.weaponStageShort : "第 1 关",
      phaseMeta: form.theme.phase.label + " · " + form.theme.phase.weaponStageShort,
      stageName: state.stage ? state.stage.name : "热身工位",
      stageNote: state.stage ? [state.stage.note, markerFixed && state.warmupTime > 0 && !(markerTest && markerTest.collecting) ? state.stage.enemyPreview : state.stage.threatHint].filter(Boolean).join(" · ") : "",
      time: fmtTime(markerTest && markerTest.collecting ? state.warmupTime : state.stageTime),
      remaining: markerFixed ? Math.max(0, (state.stage ? state.stage.targetKills : 0) - state.stageKills) : phaseA || phaseB ? state.enemies.length : Math.max(0, (state.stage ? state.stage.targetKills : 0) - state.stageKills),
      kills: markerFixed ? state.stageKills + "/" + (state.stage ? state.stage.targetKills : 0) : phaseA || phaseB ? String(state.stageKills) : state.stageKills + "/" + (state.stage ? state.stage.targetKills : 0),
      level: state.level,
      materials: state.materials,
      hp: Math.max(0, Math.ceil(state.hp)) + " / " + state.maxHp,
      hpPct: Math.max(0, state.hp / state.maxHp * 100),
      xpPct: Math.max(0, Math.min(100, state.xp / state.xpNeed * 100)),
      formText: form.formName,
      warmup: state.warmupTime,
      controlHint: markerTest && markerTest.collecting ? "10秒内自由移动回收经验与材料；结束时自动吸取遗漏资源。" : markerFixed && state.stage && state.stage.enemyPreview ? state.stage.enemyPreview : form.mechanicType === "manual_trap_detonate" ? "WASD 移动；开关贴装订后按空格同步引爆。" : "WASD 移动，武器自动攻击。",
      collecting: !!(markerTest && markerTest.collecting),
      transition,
      pendingExperiencePoints: markerTest ? markerTest.pendingExperiencePoints : 0,
      combatStatus: status,
      build: form,
      theme: form.theme
    };
  }

  function upgrades(state) {
    const config = fixedTestConfig(state);
    const test = fixedTestRuntime(state, config);
    const markerFixed = !!(config && test);
    return {
      theme: pageTheme(state),
      context: markerFixed ? "待分配经验点 " + test.pendingExperiencePoints + " · 已完成第 " + test.completedEncounters + "/17 关" : state.activeForm ? state.activeForm.displayName + " · " + state.activeForm.short : "当前主武器",
      choices: state.upgradeChoices || [],
      markerFixed,
      pendingPoints: markerFixed ? test.pendingExperiencePoints : 0
    };
  }

  function slots(state) {
    return {
      theme: pageTheme(state),
      build: buildSummary(state),
      choices: state.slotChoices && state.slotChoices.length ? state.slotChoices : V2.progression.makeSlotChoices(state)
    };
  }

  function armory(state) {
    return {
      theme: pageTheme(state),
      reason: state.lastRewardReason || "材料工坊",
      materials: state.materials,
      refreshCost: V2.progression && V2.progression.getRefreshCost ? V2.progression.getRefreshCost(state) : 3,
      build: buildSummary(state),
      offers: state.shopOffers && state.shopOffers.length ? state.shopOffers : V2.progression.makeShopOffers(state)
    };
  }

  function moduleSelect(state) {
    const runtime = state.demoV2 || {};
    const fixedConfig = fixedTestConfig(state);
    if (fixedConfig) {
      const test = fixedTestRuntime(state, fixedConfig);
      return {
        theme: pageTheme(state),
        identity: fixedConfig.weaponName + "模块路线",
        totalRounds: 4,
        round: (test.moduleChoiceIndex || 0) + 1,
        owned: (fixedConfig.moduleLabels || (fixedConfig.weaponId === "scissors" ? ["合刃", "张刃"] : fixedConfig.weaponId === "thermos" ? ["冷凝", "击杀热浪"] : ["复写", "留档"])).map(function (label, index) {
          return label + " Lv." + (index === 0 ? test.modules.copy : test.modules.archive);
        }),
        choices: fixedConfig.makeModuleChoices(state)
      };
    }
    const config = V2.demoV2 && V2.demoV2.phaseB;
    return {
      theme: pageTheme(state),
      identity: state.activeForm ? state.activeForm.displayName : "代表工牌",
      totalRounds: 3,
      round: (runtime.choiceIndex || 0) + 1,
      owned: (runtime.moduleOrder || []).map(function (id) { return config.modules[id].name; }),
      choices: runtime.moduleChoices || []
    };
  }

  function markerComponentPartView(config, test, partId) {
    const part = config.parts[partId];
    const state = test.parts[partId];
    const quality = config.qualities[config.qualityIndex(state.copies)];
    const next = config.nextThreshold(state.copies);
    const activeStatName = state.activeStat ? part.statNames[state.activeStat] : "未选择";
    return {
      id: partId,
      name: part.name,
      copies: state.copies,
      activeStat: state.activeStat,
      activeStatName,
      quality,
      progress: state.copies >= 8 ? "已达红色" : state.copies + " / " + next,
      allocationText: state.activeStat
        ? activeStatName + "专精 · 强化 " + state.allocations[state.activeStat] + " 次"
        : part.stats.map(function (stat) { return part.statNames[stat]; }).join(" / ") + " · 二选一互斥"
    };
  }

  function componentShop(state) {
    const config = fixedTestConfig(state);
    const test = fixedTestRuntime(state, config);
    return {
      weaponName: config.weaponName,
      version: config.version,
      materials: state.materials,
      refreshCost: test.refreshCost,
      shopRound: test.shopIndex,
      shopCount: config.shopCount,
      encounterId: test.currentShopEncounter,
      stageReward: test.lastStageReward,
      shopIncome: test.lastShopIncome,
      rerolls: test.rerolls,
      lockedCount: test.offers.filter(function (offer) { return offer.locked && !offer.sold; }).length,
      parts: Object.keys(config.parts).map(function (id) { return markerComponentPartView(config, test, id); }),
      offers: test.offers || []
    };
  }

  function componentStat(state) {
    const config = fixedTestConfig(state);
    const test = fixedTestRuntime(state, config);
    const part = config.parts[test.pendingStatPart];
    const quality = config.qualities[test.pendingQualityIndex];
    return {
      partName: part.name,
      quality,
      choices: part.stats.map(function (stat) {
        return { id: stat, name: part.statNames[stat], current: test.parts[part.id].allocations[stat] };
      })
    };
  }

  function damageSourceLabel(source) {
    const id = String(source || "");
    if (/[一-鿿]/.test(id)) return id;
    const exact = {
      marker_split: "马克笔 · 分裂支线",
      marker_secondary_split: "马克笔 · 二次分裂",
      marker_module_copy: "马克笔模块 · 复写主线",
      marker_module_forward: "马克笔模块 · 转发接力",
      marker_module_archive: "马克笔模块 · 留档墨迹",
      marker_module_expedite: "马克笔模块 · 加急重划",
      marker_module_merge: "马克笔模块 · 汇总爆点",
      marker_module_overdraft: "马克笔模块 · 透支划线",
      secondary_split: "马克笔 · 二次分裂",
      marker_fullscreen: "马克笔 · 全屏贯穿",
      marker_test_base: "马克笔测试 · 基础激光",
      marker_test_copy: "马克笔测试 · 平行复写",
      marker_test_second_round: "马克笔测试 · 第二轮复写",
      marker_test_archive: "马克笔测试 · 路径墨迹",
      marker_test_fullscreen_copy: "马克笔测试 · 全屏复写",
      marker_test_fullscreen_archive: "马克笔测试 · 全屏留档",
      thermos_intern_release: "保温杯 · 沸点释放",
      thermos_release: "保温杯 · 蓄热释放",
      thermos_drone_steam: "保温杯 · 蒸汽无人机",
      thermos_module_archive: "保温杯模块 · 留档冷凝区",
      thermos_module_expedite: "保温杯模块 · 加急补喷",
      thermos_module_merge: "保温杯模块 · 高压汇流",
      thermos_module_overdraft: "保温杯模块 · 反向过压",
      thermos_module_heatwave: "保温杯模块 · 转发热浪",
      thermos_test_base: "保温杯测试 · 近距蒸汽扇面",
      thermos_test_condensation: "保温杯测试 · 分段冷凝",
      thermos_test_focus: "保温杯测试 · 聚焦喷汽",
      thermos_test_kill_heatwave: "保温杯测试 · 击杀热浪",
      thermos_test_fullscreen_condensation: "保温杯测试 · 全屏冷凝",
      thermos_test_fullscreen_ignition: "保温杯测试 · 全场点杀",
      scissors_test_base: "剪刀测试 · 基础剪击",
      scissors_test_thrust: "剪刀测试 · 合刃突刺",
      scissors_test_sever: "剪刀测试 · 贯穿裁断",
      scissors_test_open: "剪刀测试 · 张刃连剪",
      scissors_test_finale: "剪刀测试 · 合剪终结",
      scissors_test_finale_boss_bonus: "剪刀测试 · Boss 终剪转化",
      scissors_test_execution: "剪刀测试 · 裁决处决",
      correction_test_spray: "修正液测试 · 错误喷射",
      correction_test_error_area: "修正液测试 · 错误区域",
      correction_test_area_merge: "修正液测试 · 污染融合",
      correction_test_system_crash: "修正液测试 · 系统崩溃",
      correction_test_final: "修正液测试 · 最终纠错",
      correction_test_final_blast: "修正液测试 · 纠错爆炸",
      sticky_attach: "即时贴 · 附着伤害",
      sticky_spread: "即时贴 · 传播伤害",
      sticky_notice_pin: "即时贴 · 公告钉扎",
      sticky_module_archive: "即时贴模块 · 留档回声",
      sticky_module_expedite: "即时贴模块 · 加急批注",
      sticky_module_merge: "即时贴模块 · 汇总脉冲",
      sticky_module_overdraft: "即时贴模块 · 透支爆破",
      support_marker: "跨武器 · 马克笔",
      support_thermos: "跨武器 · 保温杯",
      support_sticky: "跨武器 · 即时贴",
      ring_zone: "波纹留场",
      line_zone: "贯穿留场",
      polygon_zone: "阵地留场",
      zone: "持续留场"
    };
    if (exact[id]) return exact[id];
    if (id.indexOf("support_marker") === 0) return "跨武器 · 马克笔";
    if (id.indexOf("support_thermos") === 0) return "跨武器 · 保温杯";
    if (id.indexOf("support_sticky") === 0) return "跨武器 · 即时贴";
    if (id.indexOf("marker") === 0) return "马克笔 · 主束";
    if (id.indexOf("thermos") === 0) return "保温杯 · 蒸汽";
    if (id.indexOf("sticky") === 0) return "即时贴 · 陷阱";
    return id.replace(/_/g, " · ");
  }

  function result(state) {
    const damage = Object.entries(state.stats.damageDone || {})
      .sort(function (a, b) { return b[1] - a[1]; })
      .slice(0, 5)
      .map(function (entry) { return { source: damageSourceLabel(entry[0]), damage: Math.round(entry[1]) }; });
    const phaseA = !!(state.stage && state.stage.demoV2Phase === "phase-a");
    const phaseB = !!(state.stage && state.stage.demoV2Phase === "phase-b");
    const fixedConfig = fixedTestConfig(state);
    const fixedRuntime = fixedTestRuntime(state, fixedConfig);
    const markerFixed = !!(fixedConfig && fixedRuntime);
    const seen = (phaseA || phaseB || markerFixed) && state.demoV2 && state.demoV2.wavesSeen ? state.demoV2.wavesSeen.length : 0;
    const peak = phaseA || phaseB || markerFixed ? Math.max(state.stats.peakEnemies || 0, state.demoV2 && state.demoV2.peakEnemies || 0) : 0;
    const config = V2.demoV2 && V2.demoV2.phaseB;
    const moduleNames = phaseB && config ? (state.demoV2.moduleOrder || []).map(function (id) { return config.modules[id].name; }) : [];
    const isThermos = markerFixed && fixedConfig.weaponId === "thermos";
    const isScissors = markerFixed && fixedConfig.weaponId === "scissors";
    const isCorrection = markerFixed && fixedConfig.weaponId === "correction_fluid";
    return {
      title: markerFixed ? fixedConfig.weaponName + (state.flags.won ? " 5 阶段 17 关测试完成" : " 固定测试中止") : phaseB ? "阶段 B 身份膨胀测试完成" : phaseA ? "阶段 A 武器测试完成" : state.flags.won ? "完成终局转正" : "本轮结束",
      theme: pageTheme(state),
      build: buildSummary(state),
      kills: state.kills,
      level: state.level,
      materials: state.materials,
      phaseA: phaseA ? { wavesSeen: seen, peakEnemies: peak } : null,
      phaseB: phaseB ? { wavesSeen: seen, peakEnemies: peak, modules: moduleNames, combo: state.demoV2.lastCombo || [] } : null,
      markerFixed: markerFixed ? {
        weaponId: fixedConfig.weaponId,
        weaponName: fixedConfig.weaponName,
        wavesSeen: seen,
        peakEnemies: peak,
        modules: Object.assign({}, fixedRuntime.modules),
        moduleLabels: fixedConfig.moduleLabels || (isScissors ? ["合刃", "张刃"] : isThermos ? ["冷凝", "击杀热浪"] : ["复写", "留档"]),
        parts: Object.keys(fixedConfig.parts).map(function (id) { return markerComponentPartView(fixedConfig, fixedRuntime, id); }),
        fullscreenLabels: fixedConfig.resultEventLabels || (isScissors ? ["裁断", "合剪终结"] : isThermos ? ["全屏冷凝", "全场点杀"] : ["全屏复写", "全屏留档"]),
        fullscreenCopyTriggers: isCorrection ? fixedRuntime.totalSystemCrashes : isScissors ? fixedRuntime.totalSevers : isThermos ? fixedRuntime.fullscreenCondensationTriggers : fixedRuntime.fullscreenCopyTriggers,
        fullscreenArchiveTriggers: isCorrection ? fixedRuntime.totalFinalCorrections : isScissors ? fixedRuntime.totalFinales : isThermos ? fixedRuntime.fullscreenIgnitionTriggers : fixedRuntime.fullscreenArchiveTriggers,
        focusKills: isThermos ? fixedRuntime.totalFocusKills : 0,
        heatwaveTriggers: isThermos ? fixedRuntime.totalHeatwaveTriggers : 0,
        dashes: isScissors ? fixedRuntime.totalDashes : 0,
        dashDodges: isScissors ? fixedRuntime.totalDashDodges : 0,
        closedHits: isScissors ? fixedRuntime.totalClosedHits : 0,
        openHits: isScissors ? fixedRuntime.totalOpenHits : 0,
        executions: isScissors ? fixedRuntime.totalExecutions : 0,
        shelterTriggers: isScissors ? fixedRuntime.totalShelterTriggers : 0,
        blockedShots: isScissors ? fixedRuntime.totalBlockedShots : 0,
        errorsApplied: isCorrection ? fixedRuntime.totalErrorsApplied : 0,
        overloads: isCorrection ? fixedRuntime.totalOverloads : 0,
        errorAreas: isCorrection ? fixedRuntime.totalAreasCreated : 0,
        areaMerges: isCorrection ? fixedRuntime.totalAreaMerges : 0,
        finalKills: isCorrection ? fixedRuntime.totalFinalKills : 0,
        completedEncounters: fixedRuntime.completedEncounters,
        shopsVisited: fixedRuntime.completedStages,
        experienceLevels: fixedRuntime.experienceLevels,
        experienceAllocations: Object.assign({}, fixedRuntime.experienceAllocations),
        experienceSummary: markerExperienceSummary(fixedRuntime, fixedConfig),
        componentsBought: fixedRuntime.componentsBought,
        stageMaterialsEarned: fixedRuntime.stageMaterialsEarned,
        harvestingMaterialsEarned: fixedRuntime.harvestingMaterialsEarned,
        dropMaterialsEarned: fixedRuntime.dropMaterialsEarned,
        materialsSpent: fixedRuntime.materialsSpent
      } : null,
      damage,
      note: markerFixed
        ? (isCorrection
          ? "只复盘三件事：三层错误是否一眼可懂；错误扩散与致命纠错是否形成群体/关键目标两种节奏；白色修正介质与赛博故障霓虹是否既有主题又不遮挡战斗。"
          : isScissors
          ? "只复盘三件事：贴身风险是否真实；轻步是否帮助进场而非代替走位；合刃、张刃与混合路线是否形成不同动作节奏和组件判断。"
          : isThermos
          ? "只复盘三件事：近距扇面是否真的要求靠近和转向；冷凝与击杀热浪是否形成不同购买判断；混合路线是否以适应性而非数值碾压成立。"
          : "只复盘三件事：复写与留档是否形成不同攻击结构；混合加点是否值得；模块 Lv3 后组件刷新是否仍有期待。")
        : phaseB
        ? "代表工牌：" + (state.badgeDept ? V2.compat.deptName(state.badgeDept) : "未定型") + "；模块：" + (moduleNames.join(" → ") || "无") + "。现在只回答：每次选择是否立刻改变画面，以及能否说清为什么前一个模块让后一个更有用。"
        : phaseA
        ? "已经历 " + seen + "/4 类问题波，峰值 " + peak + " 个目标。现在只回答：这把武器是否在 10 秒内显出母题，以及面对四种敌群时是否需要不同走位。"
        : state.flags.won
        ? "完整构筑已经通过终局压测。换一把武器、工牌或副武器，能跑出另一条打法。"
        : "这次失败应该让你看见哪里没成型，而不是只看见一堆文字。"
    };
  }

  function pause(state) {
    const build = buildSummary(state);
    const hudVm = hud(state);
    return {
      theme: build.theme,
      stageMeta: hudVm.stageMeta,
      stageName: hudVm.stageName,
      phaseMeta: hudVm.phaseMeta,
      stageNote: hudVm.stageNote || "继续完成本关目标。",
      time: hudVm.time,
      remaining: hudVm.remaining,
      kills: hudVm.kills,
      hp: hudVm.hp,
      level: hudVm.level,
      materials: hudVm.materials,
      weapon: build.weapon,
      formName: build.formName,
      formShort: build.formShort,
      badge: build.badge,
      secondaryBadge: build.secondaryBadge,
      supportSkill: build.supportSkill,
      objective: state.stage && state.stage.boss ? "击破评审目标" : "撑过本关压力，并尽量完成击破目标"
    };
  }

  function debug(state) {
    return {
      mode: state.mode,
      stage: state.stage && state.stage.id,
      stageTime: state.stageTime,
      warmupTime: state.warmupTime,
      running: !!state.loop.running,
      raf: !!state.loop.raf,
      interval: !!state.loop.interval,
      enemies: state.enemies.length,
      projectiles: state.projectiles.length,
      zones: state.damageZones.length,
      particles: state.particles.length,
      avgFrameMs: Math.round(state.loop.avgFrameMs * 10) / 10,
      updateCount: state.loop.updateCount,
      lastError: state.loop.lastError
    };
  }

  V2.viewModel = {
    fmtTime,
    pageTheme,
    weaponList,
    supportWeaponList,
    badgeForms,
    buildSummary,
    mechanicStatus,
    hud,
    upgrades,
    moduleSelect,
    componentShop,
    componentStat,
    slots,
    armory,
    result,
    pause,
    debug
  };

  V2.getViewModel = function getViewModel(name) {
    const state = V2.getState();
    if (name === "weapon_select") return weaponList(state);
    if (name === "support_weapon_select") return supportWeaponList(state);
    if (name === "badge_select") return badgeForms(state);
    if (name === "hud") return hud(state);
    if (name === "level_up") return upgrades(state);
    if (name === "module_select") return moduleSelect(state);
    if (name === "component_shop") return componentShop(state);
    if (name === "component_stat_select") return componentStat(state);
    if (name === "slot_select") return slots(state);
    if (name === "armory") return armory(state);
    if (name === "result") return result(state);
    if (name === "pause") return pause(state);
    if (name === "debug") return debug(state);
    return buildSummary(state);
  };
})();
