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

  function stagePhase(state) {
    const stage = state.stage || {};
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
    const weapon = state.selectedWeaponId ? CS.weapons && CS.weapons[state.selectedWeaponId] : null;
    const form = state.activeForm || {};
    const topology = form.mechanicType || (weapon && weapon.formTopology) || "basic";
    const signature = V2.getWeaponFormSignature ? V2.getWeaponFormSignature(form.mechanicType || weapon && weapon.formTopology) : null;
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

  function weaponList() {
    const weapons = CS.weapons || {};
    return WEAPON_ORDER.map(function (id) {
      const w = weapons[id];
      if (!w) return null;
      const theme = THEME_BY_TOPOLOGY.find(item => item.test.test(w.formTopology || "")) || { id: "generic", label: "基础形态" };
      const signature = V2.getWeaponFormSignature ? V2.getWeaponFormSignature(w.formTopology || "") : null;
      return {
        id,
        name: w.name,
        emoji: w.emoji,
        motif: w.motif,
        description: w.description,
        topology: w.formTopology,
        tagDescription: w.tagDescription,
        themeId: theme.id,
        themeLabel: theme.label,
        signatureLabel: signature ? signature.topology : theme.label,
        signatureProcess: signature ? signature.process : w.description,
        signatureFocus: signature ? signature.focus : [],
        implemented: id === "marker" || id === "thermos" || id === "sticky_note"
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
    const weapon = state.selectedWeaponId ? V2.compat.weaponName(state.selectedWeaponId) : "未选择武器";
    const form = state.activeForm;
    const params = state.activeFormParams || {};
    const theme = pageTheme(state);
    const openSlots = V2.progression && V2.progression.getOpenSlots ? V2.progression.getOpenSlots(state) : [];
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

  function hud(state) {
    const form = buildSummary(state);
    return {
      stageMeta: state.stage ? "第 " + state.stage.id + " 关 · " + form.theme.phase.label + " · " + form.theme.phase.weaponStageShort : "第 1 关",
      phaseMeta: form.theme.phase.label + " · " + form.theme.phase.weaponStageShort,
      stageName: state.stage ? state.stage.name : "热身工位",
      stageNote: state.stage ? [state.stage.note, state.stage.threatHint].filter(Boolean).join(" · ") : "",
      time: fmtTime(state.stageTime),
      remaining: Math.max(0, (state.stage ? state.stage.targetKills : 0) - state.stageKills),
      kills: state.stageKills + "/" + (state.stage ? state.stage.targetKills : 0),
      level: state.level,
      materials: state.materials,
      hp: Math.max(0, Math.ceil(state.hp)) + " / " + state.maxHp,
      hpPct: Math.max(0, state.hp / state.maxHp * 100),
      xpPct: Math.max(0, Math.min(100, state.xp / state.xpNeed * 100)),
      formText: form.formName,
      warmup: state.warmupTime,
      build: form,
      theme: form.theme
    };
  }

  function upgrades(state) {
    return {
      theme: pageTheme(state),
      context: state.activeForm ? state.activeForm.displayName + " · " + state.activeForm.short : "当前主武器",
      choices: state.upgradeChoices || []
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

  function result(state) {
    const damage = Object.entries(state.stats.damageDone || {})
      .sort(function (a, b) { return b[1] - a[1]; })
      .slice(0, 5)
      .map(function (entry) { return { source: entry[0], damage: Math.round(entry[1]) }; });
    return {
      title: state.flags.won ? "完成终局转正" : "本轮结束",
      theme: pageTheme(state),
      build: buildSummary(state),
      kills: state.kills,
      level: state.level,
      materials: state.materials,
      damage,
      note: state.flags.won
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
    hud,
    upgrades,
    slots,
    armory,
    result,
    pause,
    debug
  };

  V2.getViewModel = function getViewModel(name) {
    const state = V2.getState();
    if (name === "weapon_select") return weaponList();
    if (name === "support_weapon_select") return supportWeaponList(state);
    if (name === "badge_select") return badgeForms(state);
    if (name === "hud") return hud(state);
    if (name === "level_up") return upgrades(state);
    if (name === "slot_select") return slots(state);
    if (name === "armory") return armory(state);
    if (name === "result") return result(state);
    if (name === "pause") return pause(state);
    if (name === "debug") return debug(state);
    return buildSummary(state);
  };
})();
