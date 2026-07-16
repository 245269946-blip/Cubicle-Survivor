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

  function mechanicStatus(state) {
    const p = state.activeFormParams || {};
    const form = state.activeForm || {};
    const mechanic = form.mechanicType || "";
    const zones = state.damageZones || [];
    const enemies = state.enemies || [];
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

  function hud(state) {
    const form = buildSummary(state);
    const status = mechanicStatus(state);
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
      controlHint: form.mechanicType === "manual_trap_detonate" ? "WASD 移动；开关贴装订后按空格同步引爆。" : "WASD 移动，武器自动攻击。",
      combatStatus: status,
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

  function damageSourceLabel(source) {
    const id = String(source || "");
    if (/[一-鿿]/.test(id)) return id;
    const exact = {
      marker_split: "马克笔 · 分裂支线",
      marker_secondary_split: "马克笔 · 二次分裂",
      secondary_split: "马克笔 · 二次分裂",
      marker_fullscreen: "马克笔 · 全屏贯穿",
      thermos_intern_release: "保温杯 · 沸点释放",
      thermos_release: "保温杯 · 蓄热释放",
      thermos_drone_steam: "保温杯 · 蒸汽无人机",
      sticky_attach: "即时贴 · 附着伤害",
      sticky_spread: "即时贴 · 传播伤害",
      sticky_notice_pin: "即时贴 · 公告钉扎",
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
    mechanicStatus,
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
