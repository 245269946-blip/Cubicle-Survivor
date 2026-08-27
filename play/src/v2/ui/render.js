// ================================================================
// src/v2/ui/render.js
// V2 active UI renderer.
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});
  const V2 = CS.V2 || (CS.V2 = {});

  const idsByMode = {
    menu: "startPanel",
    weapon_select: "weaponSelectPanel",
    badge_select: "badgePanel",
    secondary_badge_select: "badgePanel",
    support_weapon_select: "weaponSelectPanel",
    level_up: "upgradePanel",
    module_select: "modulePanel",
    component_shop: "componentShopPanel",
    component_stat_select: "componentStatPanel",
    slot_select: "slotPanel",
    armory: "weaponPanel",
    result: "resultPanel",
    paused: "pausePanel"
  };

  function el(id) {
    return document.getElementById(id);
  }

  function setText(id, text) {
    const node = el(id);
    if (node) node.textContent = text;
  }

  function setHtml(id, html) {
    const node = el(id);
    if (!node || node.__lastHtml === html) return false;
    node.innerHTML = html;
    node.__lastHtml = html;
    return true;
  }

  function show(id, visible) {
    const node = el(id);
    if (node) node.classList.toggle("hidden", !visible);
  }

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderMode(state) {
    const activeId = idsByMode[state.mode] || "";
    const uniqueIds = {};
    Object.keys(idsByMode).forEach(function (mode) {
      uniqueIds[idsByMode[mode]] = true;
    });
    Object.keys(uniqueIds).forEach(function (id) {
      show(id, id === activeId);
    });
    show("warmupOverlay", state.mode === "combat" && state.warmupTime > 0);
  }

  function previewClass(topology) {
    if (/line|pierce|split|beam|grid|mark/.test(topology)) return "preview-line";
    if (/homing|projectile|chain|bounce/.test(topology)) return "preview-homing";
    if (/melee|arc|counter/.test(topology)) return "preview-arc";
    if (/trap|field|zone|link|path/.test(topology)) return "preview-trap";
    if (/charge|heat|steam|release|pulse/.test(topology)) return "preview-charge";
    if (/aura|wave|broadcast|spread/.test(topology)) return "preview-wave";
    if (/orbit|window|settle/.test(topology)) return "preview-orbit";
    if (/cone|vortex|channel/.test(topology)) return "preview-vortex";
    return "preview-generic";
  }

  function vfxSpritePath(id) {
    return "assets/v2-weapon-vfx/sprites/" + id + ".png";
  }

  const PREVIEW_SOURCE_BY_MECHANIC = {
    line_pierce: "marker_main",
    line_split: "marker_split",
    mark_detonate: "marker_p0_mark",
    shield_counter_line: "marker_counter",
    line_to_wave: "marker_wave",
    line_grid_field: "marker_grid_field",
    heat_meter_steam: "thermos_release",
    patrol_summon_steam: "thermos_drone",
    charge_release_beam: "thermos_release",
    shield_break_pulse: "thermos_shield_break",
    periodic_wave_spread: "thermos_tea_wave",
    deployable_safe_station: "thermos_station",
    ground_trap: "sticky_base",
    seeking_trap_summon: "sticky_seeking",
    manual_trap_detonate: "sticky_manual_trigger",
    route_buff_trap: "sticky_route",
    sticky_debuff_spread: "sticky_spread",
    trap_link_control_zone: "sticky_notice_zone"
    ,correction_fluid_fixed: "correction_test_error_overload"
  };

  const BADGE_COMBAT_COPY = {
    line_split: "主光束贯穿；每个命中点再锁定附近目标，分出可继续贯穿的支线。",
    mark_detonate: "首次命中高血或精英目标挂 P0；窗口内再次命中才会引爆。",
    shield_counter_line: "命中积攒护盾；护盾被敌人打破后，向附近目标反刺。",
    line_to_wave: "最后命中点放出延迟扩散环；波前扫到敌人时结算伤害。",
    line_grid_field: "光束留下线段；两条线真实相交时形成减速与定身区。",
    patrol_summon_steam: "满热生成巡航模块；模块主动锁敌并喷出贯穿短蒸汽。",
    charge_release_beam: "弱蒸汽蓄热；满热释放高伤蒸汽柱，随后进入攻击空窗。",
    shield_break_pulse: "蒸汽命中积攒护盾；护盾被敌人打破后释放反击热浪。",
    periodic_wave_spread: "释放茶香波；附香目标死亡时，再从死亡点传播回声。",
    deployable_safe_station: "满热后在当前位置部署茶水间；区域内补给并减速敌人。",
    seeking_trap_summon: "贴纸装订后主动寻敌；碰撞时爆开一次，强化后可短跳续贴。",
    manual_trap_detonate: "自动布置开关贴；按空格同步引爆同屏已装订贴纸。",
    route_buff_trap: "沿移动反方向铺提醒贴；首次经过获得护盾，敌人经过受伤减速。",
    sticky_debuff_spread: "贴纸附着目标；目标死亡后向附近敌人接力传播。",
    trap_link_control_zone: "三张贴纸闭合成公告板；边线与内部区域持续控场。"
  };

  function badgeCombatCopy(form) {
    return BADGE_COMBAT_COPY[form.mechanicType] || form.combatVerb || "";
  }

  function badgeSignatureCopy(form) {
    const focus = (form.signatureFocus || []).slice(0, 2).join(" / ");
    return [form.signatureLabel, focus].filter(Boolean).join(" · ");
  }

  function approvedPreviewSprite(weaponId, mechanicType) {
    if (weaponId === "thermos" && mechanicType === "patrol_summon_steam") return "thermos_drone_v2";
    if (weaponId === "thermos" && mechanicType === "deployable_safe_station") return "thermos_station_v2";
    if (weaponId === "sticky_note") return "sticky_note_v2";
    return "";
  }

  function eventPreviewShape(topology) {
    if (/steam_column|steam_line/.test(topology)) return "event-preview-steam";
    if (/line|scan/.test(topology)) return "event-preview-line";
    if (/ring|shield_arc|heat_orb/.test(topology)) return "event-preview-ring";
    if (/trap|seeking_entity|trail_route|orbit_entity/.test(topology)) return "event-preview-trap";
    if (/field|link/.test(topology)) return "event-preview-field";
    return "event-preview-impact";
  }

  function vfxPreviewHtml(weaponId, mechanicType, className) {
    const source = PREVIEW_SOURCE_BY_MECHANIC[mechanicType] || (weaponId === "correction_fluid" ? "correction_test_error_overload" : weaponId === "scissors" ? "scissors_test_base" : weaponId === "thermos" ? "thermos_release" : weaponId === "sticky_note" ? "sticky_base" : "marker_main");
    const visual = V2.getWeaponVisualEvent ? V2.getWeaponVisualEvent(source) : { family: weaponId || "marker", topology: "piercing_line", cue: "preview" };
    const spriteId = approvedPreviewSprite(weaponId, mechanicType);
    const sprite = spriteId
      ? '<img class="event-preview-sprite" src="' + escapeHtml(vfxSpritePath(spriteId)) + '" alt="" aria-hidden="true" />'
      : "";
    return '<span class="event-vfx-preview ' + escapeHtml(className || "") + ' ' + eventPreviewShape(visual.topology) + ' event-family-' + escapeHtml(visual.family) + '" data-event-cue="' + escapeHtml(visual.cue) + '" aria-hidden="true">' +
      sprite + '<i></i><i></i><i></i><b></b></span>';
  }

  function atlasIconHtml(kind, id, label) {
    const safeKind = kind === "ui" ? "ui" : "office";
    return '<span class="runtime-atlas-icon atlas-' + safeKind + ' icon-' + escapeHtml(id) + '" role="img" aria-label="' + escapeHtml(label || "") + '"></span>';
  }

  function weaponIconHtml(weaponId, label) {
    if (weaponId === "scissors") {
      return '<img class="fixed-weapon-icon scissors-weapon-icon" src="assets/generated-vfx/sprites/scissors-v23.png" alt="' + escapeHtml(label || "剪刀") + '" />';
    }
    if (weaponId === "thermos") {
      return '<img class="fixed-weapon-icon thermos-weapon-icon" src="assets/generated-vfx/sprites/thermos-body-v24.png" alt="' + escapeHtml(label || "保温杯") + '" />';
    }
    if (weaponId === "correction_fluid") {
      return '<img class="fixed-weapon-icon correction-fluid-weapon-icon" src="assets/generated-vfx/sprites/correction-fluid-body-v25.png" alt="' + escapeHtml(label || "修正液") + '" />';
    }
    return atlasIconHtml("office", "weapon-" + weaponId, label);
  }

  function departmentIconHtml(dept, label) {
    return atlasIconHtml("ui", "dept-" + dept, label);
  }

  function markerGrowthIconHtml(group, id, label) {
    const safeGroup = group === "experience" ? "experience" : "build";
    return '<span class="marker-growth-icon marker-growth-' + safeGroup + ' icon-' + escapeHtml(id) + '" role="img" aria-label="' + escapeHtml(label || "") + '"></span>';
  }

  function fixedTestConfig(state) {
    return V2.getDemoV2FixedTestConfig ? V2.getDemoV2FixedTestConfig(state) : null;
  }

  function compactDecisionEnabled(state, config) {
    return !!((config && config.decisionCompressionPass) || (state && state.demoV2 && state.demoV2.decisionCompressionPass));
  }

  function fixedComponentIconHtml(config, id, label) {
    return config && (config.weaponId === "scissors" || config.weaponId === "correction_fluid")
      ? weaponIconHtml(config.weaponId, label)
      : markerGrowthIconHtml("build", "component-" + id, label);
  }

  function quickWeaponCopy(id, fallback) {
    const copy = {
      marker: "远程画线，贯穿成排敌人。",
      thermos: "贴近喷汽，用冷凝控场、热浪清群。",
      scissors: "轻步贴身，用突刺与连剪打完整动作轮。",
      correction_fluid: "叠加错误，在污染扩散与集中纠错间取舍。"
    };
    return copy[id] || fallback;
  }

  function quickWeaponLabel(id, fallback) {
    const label = {
      marker: "远程贯穿",
      thermos: "近距控场",
      scissors: "贴身连剪",
      correction_fluid: "中距叠错"
    };
    return label[id] || fallback;
  }

  function applyShellState(state) {
    const wrap = document.querySelector(".v2-game");
    if (!wrap || !V2.viewModel) return;
    const theme = V2.viewModel.pageTheme(state);
    wrap.dataset.weaponTheme = theme.id;
    wrap.dataset.pageMode = state.mode;
    wrap.dataset.stagePhase = theme.phase.id;
    const fixedConfig = fixedTestConfig(state);
    wrap.dataset.fixedSuite = fixedConfig && (fixedConfig.coordinator || (state.demoV2 && state.demoV2.suiteVersion)) ? "four-weapon" : "";
    const experiencePass = !!(fixedConfig && fixedConfig.combatExperiencePass) || !!(state.demoV2 && state.demoV2.combatExperiencePass);
    const neonCity = !!(fixedConfig && fixedConfig.neonCityTheme) || !!(state.demoV2 && state.demoV2.neonCityTheme);
    wrap.dataset.experiencePass = experiencePass ? "true" : "";
    wrap.dataset.neonCity = neonCity ? "true" : "";
    wrap.dataset.neonBloom = state.demoV2 && state.demoV2.neonBloomPass ? "true" : "";
    wrap.dataset.decisionDensity = compactDecisionEnabled(state, fixedConfig) ? "compact" : "";
    const formalHud = !!((fixedConfig && fixedConfig.formalCartoonHudPass) || (state.demoV2 && state.demoV2.formalCartoonHudPass));
    wrap.dataset.formalCartoonHud = formalHud ? "true" : "";
    wrap.dataset.formalCartoonVfx = state.demoV2 && state.demoV2.formalCartoonVfxPass ? "true" : "";
    wrap.dataset.formalCartoonAudio = state.demoV2 && state.demoV2.formalCartoonAudioPass ? "true" : "";
    wrap.dataset.transitionActive = state.mode === "combat" && state.warmupTime > 0 ? "true" : "";
    const healthRatio = state.maxHp > 0 ? state.hp / state.maxHp : 0;
    wrap.dataset.healthState = healthRatio <= 0.25 ? "critical" : healthRatio <= 0.5 ? "low" : "normal";
    const versionStamp = el("titleVersionStamp");
    if (versionStamp) versionStamp.textContent = (state.demoV2 && state.demoV2.suiteVersion) || (fixedConfig && fixedConfig.version) || "Demo V1";
    wrap.style.setProperty("--active-badge-color", theme.badgeColor || "#00e5ff");
  }

  function themeBrief(theme, pageLabel, focusText) {
    const focus = theme.signatureFocus && theme.signatureFocus.length
      ? '<div class="v2-signature-tags">' + theme.signatureFocus.map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join("") + '</div>'
      : "";
    return '<div class="v2-page-identity theme-' + escapeHtml(theme.id) + '">' +
      '<div class="v2-theme-preview ' + previewClass(theme.topology) + '" aria-hidden="true">' +
        vfxPreviewHtml(theme.weaponId, theme.topology, "theme-vfx-preview") +
      '</div>' +
      '<div class="v2-theme-copy">' +
        '<span>' + escapeHtml(pageLabel) + '</span>' +
        '<strong>' + escapeHtml(theme.formName) + '</strong>' +
        '<p>' + escapeHtml(focusText || theme.signatureProcess || theme.action) + '</p>' +
        focus +
      '</div>' +
      '<div class="v2-stage-chip"><b>' + escapeHtml(theme.phase.label + " · " + theme.phase.weaponStageShort) + '</b><em>' + escapeHtml(theme.phase.note) + '</em></div>' +
    '</div>';
  }

  function signatureTags(tags) {
    if (!tags || !tags.length) return "";
    return '<div class="v2-signature-tags compact">' + tags.slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join("") + '</div>';
  }

  function decisionFlowHtml(steps, activeIndex) {
    return (steps || []).map(function (step, index) {
      const stateClass = index < activeIndex ? "is-done" : index === activeIndex ? "is-active" : "is-next";
      return '<span class="decision-flow-step ' + stateClass + '"><b>' + (index + 1) + '</b><em>' + escapeHtml(step) + '</em></span>';
    }).join('<i aria-hidden="true"></i>');
  }

  function renderHud(state) {
    const vm = V2.getViewModel("hud");
    setText("objectiveStageMeta", vm.stageMeta);
    setText("objectiveStageName", vm.stageName);
    setText("objectiveTime", vm.time);
    setText("objectiveRemaining", vm.remaining);
    setText("objectiveKills", vm.kills);
    setText("objectiveTimeLabel", vm.formalHud ? "时间" : "倒计时");
    setText("objectiveRemainingLabel", vm.formalHud ? "待办" : "剩余");
    setText("objectiveKillsLabel", vm.formalHud ? "完成" : "击破");
    setText("objectiveAlert", vm.stageNote);
    setText("levelText", vm.level);
    setText("materialLabel", "材料");
    setText("materialText", vm.materials);
    setText("formText", vm.formText);
    setText("hpText", vm.hp);
    setText("buildToggle", vm.formalHud ? "构筑" : "构筑 B");
    const hpFill = el("hpFill");
    if (hpFill) hpFill.style.width = vm.hpPct + "%";
    const xpFill = el("xpFill");
    if (xpFill) xpFill.style.width = vm.xpPct + "%";
    const transition = vm.transition || {};
    const warmupOverlay = el("warmupOverlay");
    if (warmupOverlay) warmupOverlay.setAttribute("data-transition-kind", transition.kind || "encounter");
    setText("warmupEmoji", transition.symbol || "预告");
    setText("warmupEyebrow", transition.eyebrow || "关卡预告");
    setText("warmupTitle", transition.title || (state.stage ? state.stage.name + " 准备中" : "准备中"));
    setText("warmupTimer", Math.ceil(vm.warmup) + "s");
    setText("warmupHint", transition.hint || vm.controlHint);
    setText("warmupRule", transition.rule || "观察本关目标与敌人压力");
    setText("warmupNext", transition.next || "下一步：开始战斗");
    setHtml("warmupTags", (transition.tags || []).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join(""));
    const warmupFill = el("warmupFill");
    if (warmupFill) warmupFill.style.width = Math.max(0, Math.min(100, (1 - vm.warmup / (transition.duration || (vm.collecting ? 10 : 3))) * 100)) + "%";
    const combatStatus = el("combatStatus");
    if (combatStatus && vm.combatStatus) {
      combatStatus.classList.remove("hidden", "tone-marker", "tone-thermos", "tone-sticky", "tone-scissors", "tone-correction");
      combatStatus.classList.add("tone-" + vm.combatStatus.tone);
      setText("combatStatusLabel", vm.combatStatus.label);
      setText("combatStatusValue", vm.combatStatus.value);
      setText("combatStatusHint", vm.combatStatus.hint);
    }
    const growthFeedback = el("growthFeedback");
    const growth = state.demoV2 && state.demoV2.growthFeedback;
    if (growthFeedback) {
      const visible = !!growth && growth.time > 0 && state.mode === "combat";
      growthFeedback.classList.toggle("hidden", !visible);
      if (visible) {
        growthFeedback.dataset.family = growth.family || "marker";
        growthFeedback.dataset.kind = growth.kind || "growth";
        const feedbackProgress = Math.max(0, Math.min(1, growth.time / (growth.maxTime || 2.2)));
        growthFeedback.style.setProperty("--feedback-progress", feedbackProgress);
        growthFeedback.style.setProperty("--feedback-opacity", Math.min(1, feedbackProgress * 5));
        setText("growthFeedbackKind", vm.formalHud
          ? growth.kind === "module" ? "模块" : growth.kind === "component" ? "组件" : "能力"
          : growth.kind === "module" ? "WORKFLOW MUTATION" : growth.kind === "component" ? "COMPONENT SYNC" : "ATTRIBUTE UPLINK");
        setText("growthFeedbackTitle", growth.title);
        setText("growthFeedbackDetail", growth.detail);
      }
    }

    const b = vm.build;
    setText("buildSummary", b.formName);
    const extraBuildBits = [
      b.secondaryBadge ? '<span>第二部门：' + escapeHtml(b.secondaryBadge) + '</span>' : '',
      b.supportSkill ? '<span>跨技能：' + escapeHtml(b.supportSkill) + '</span>' : ''
    ].filter(Boolean).join('');
    setHtml("routeMap", '<div class="v2-form-chip theme-' + escapeHtml(b.theme.id) + '"><b>' + escapeHtml(b.weapon) + '</b><span>' + escapeHtml(b.theme.phase.weaponStageShort) + '</span><em>' + escapeHtml(b.formShort) + '</em>' + extraBuildBits + '</div>');
    setHtml("buildList", b.params.map(function (item) {
      return '<div><span>' + escapeHtml(item.label) + '</span><strong>' + escapeHtml(item.value) + '</strong></div>';
    }).join("") + (b.components || []).map(function (part) {
      return '<div><span>' + escapeHtml(part.name + " · " + part.quality.name) + '</span><strong>' + escapeHtml(part.allocationText) + '</strong></div>';
    }).join("") + ((b.components || []).length ? "" : b.slots.map(function (slot) {
      return '<div class="' + (slot.open ? "" : "dim") + '"><span>' + escapeHtml(slot.name) + '</span><strong>' + escapeHtml(slot.open ? slot.value : slot.unlockLabel) + '</strong></div>';
    }).join("")));
  }

  function renderWeaponSelect() {
    const state = V2.getState();
    const supportMode = state.mode === "support_weapon_select";
    const phaseA = !supportMode && state.demoV2 && state.demoV2.phase === "phase-a";
    const phaseB = !supportMode && state.demoV2 && state.demoV2.phase === "phase-b";
    const fixedConfig = !supportMode && fixedTestConfig(state);
    const markerFixed = !!fixedConfig;
    const suitePlayable = !!(markerFixed && (fixedConfig.coordinator || (state.demoV2 && state.demoV2.suiteVersion)));
    const publicVersion = suitePlayable ? (state.demoV2 && state.demoV2.suiteVersion || fixedConfig.version) : fixedConfig && fixedConfig.version;
    const framework = fixedConfig && fixedConfig.uiFramework;
    const compactDecision = compactDecisionEnabled(state, fixedConfig);
    let items = V2.getViewModel(supportMode ? "support_weapon_select" : "weapon_select");
    if (framework && framework.weaponSelection) {
      items = items.filter(function (item) { return framework.weaponSelection.activeIds.indexOf(item.id) >= 0; });
    }
    setText("weaponSelectEyebrow", supportMode ? "跨技能学习" : suitePlayable ? publicVersion + " · 可玩版本" : markerFixed ? fixedConfig.version + " · " + fixedConfig.weaponName : phaseB ? "Demo V2 · 阶段 B" : phaseA ? "Demo V2 · 阶段 A" : "选择初始武器");
    const coordinator = !!(fixedConfig && fixedConfig.coordinator);
    setText("weaponSelectTitle", supportMode ? "选择一个副武器本质技能" : compactDecision ? "选一种打法" : coordinator ? "选择一种异化关系" : markerFixed ? "选择" + fixedConfig.weaponName + "开始本局" : phaseB ? "选择接受 3 分钟成长测试的武器" : phaseA ? "选择接受 60 秒压测的武器" : "先决定你怎么清场");
    setText("weaponSelectNote", supportMode ? "副武器只保留核心技能作为辅助，不会替代当前主武器形态。" : compactDecision ? "四选一，立即开打。" : coordinator ? "四把武器共用同一关卡与成长骨架，各自围绕路径、空间、自身位置或敌人状态形成不同打法。" : markerFixed ? fixedConfig.subtitle + " 经验、模块与组件三条成长线互不替代。" : phaseB ? "前 30 秒只用基础武器；随后自动定型唯一代表工牌，再进行三次轻模块选择。" : phaseA ? "本轮只有基础武器和四类敌群。它验证武器本身是否好玩，不用升级系统替它制造爽感。" : "武器决定基础战斗动词。下一步选择工牌后，同一把武器会变成不同形态。");
    setText("weaponSelectFooter", supportMode ? "点击卡片学习副武器技能 · 主武器形态保持不变" : compactDecision ? "" : coordinator ? "选择一把武器进入 5 阶段 17 关挑战" : markerFixed ? "点击" + fixedConfig.weaponName + "进入 5 阶段 17 关挑战" : phaseB ? "选择后直接进入 3 分钟测试 · 不接入旧成长系统" : phaseA ? "选择后直接进入 60 秒测试 · 不开放工牌与成长" : "点击卡片确定武器 · 下一步选择工牌形态");
    setHtml("weaponSelectFlow", markerFixed
      ? (compactDecision ? "" : decisionFlowHtml(["主武器", "关卡战斗", "资源回收", "成长选择"], 0))
      : decisionFlowHtml(["主武器", "工牌形态", "关卡战斗", "成长选择"], supportMode ? 3 : 0));
    const weaponSelectFlow = el("weaponSelectFlow");
    const weaponSelectFooter = el("weaponSelectFooter");
    if (weaponSelectFlow) {
      weaponSelectFlow.classList.toggle("hidden", compactDecision);
      weaponSelectFlow.hidden = compactDecision;
      weaponSelectFlow.style.display = compactDecision ? "none" : "";
    }
    if (weaponSelectFooter) {
      weaponSelectFooter.classList.toggle("hidden", compactDecision);
      weaponSelectFooter.hidden = compactDecision;
      weaponSelectFooter.style.display = compactDecision ? "none" : "";
    }
    const rosterMeta = el("weaponRosterMeta");
    if (rosterMeta) {
      const showFramework = !!(framework && framework.weaponSelection && !compactDecision);
      rosterMeta.classList.toggle("hidden", !showFramework);
      if (showFramework) {
        rosterMeta.innerHTML = '<strong>' + escapeHtml(framework.weaponSelection.registryLabel) + ' · ' + items.length + ' 把</strong><span>' + (coordinator ? '每把武器拥有独立攻击关系与双路线成长。' : '当前武器：' + escapeHtml(fixedConfig.weaponName) + '。') + '</span>';
      }
    }
    setHtml("weaponSelectGrid", items.map(function (w) {
      return '<button class="weapon-card theme-' + escapeHtml(w.themeId) + ' ' + previewClass(w.topology) + '" type="button" data-weapon="' + escapeHtml(w.id) + '">' +
        weaponIconHtml(w.id, w.name) +
        '<strong>' + escapeHtml(w.name) + '</strong>' +
        '<em>' + escapeHtml(compactDecision ? quickWeaponLabel(w.id, w.tagDescription || w.motif) : w.motif) + '</em>' +
        vfxPreviewHtml(w.id, w.topology, "weapon-vfx-preview") +
        (compactDecision ? '' : '<p>' + escapeHtml(w.description) + '</p>') +
        (compactDecision ? '' : '<small>' + escapeHtml(w.signatureLabel) + ' · ' + escapeHtml(w.signatureProcess) + '</small>' + signatureTags(w.signatureFocus)) +
      '</button>';
    }).join(""));
    document.querySelectorAll("[data-weapon]").forEach(function (button) {
      button.onclick = function () {
        if (supportMode) V2.dispatch({ type: "SET_SUPPORT_WEAPON", weaponId: button.getAttribute("data-weapon") });
        else {
          const weaponId = button.getAttribute("data-weapon");
          if (!compactDecision || !V2.combat || !V2.combat.ensureWeaponAssets) {
            V2.dispatch({ type: "START_RUN", weaponId: weaponId });
            return;
          }
          document.querySelectorAll("[data-weapon]").forEach(function (choice) { choice.disabled = true; });
          setText("weaponSelectNote", "正在准备" + V2.compat.weaponName(weaponId) + "…");
          V2.combat.ensureWeaponAssets(weaponId).then(function (ready) {
            if (ready) {
              V2.dispatch({ type: "START_RUN", weaponId: weaponId });
              return;
            }
            document.querySelectorAll("[data-weapon]").forEach(function (choice) { choice.disabled = false; });
            setText("weaponSelectNote", "素材加载失败，点击重试。");
          });
        }
      };
    });
  }

  function renderBadgeSelect(state) {
    const secondaryMode = state.mode === "secondary_badge_select";
    const forms = V2.getViewModel("badge_select").filter(function (form) {
      return !secondaryMode || form.dept !== state.badgeDept;
    });
    setText("badgePanelEyebrow", secondaryMode ? "跨部门协作" : "选择工牌形态");
    setText("badgePanelTitle", secondaryMode ? "选择第二部门的初级能力" : V2.compat.weaponName(state.selectedWeaponId) + "要被养成哪种形态？");
    setText("badgePanelFooter", secondaryMode ? "点击卡片建立跨部门协作 · 已选部门不会重复出现" : "点击卡片选择部门形态 · 同一武器会获得不同战斗动词");
    setHtml("badgeGrid", forms.map(function (f) {
      return '<button class="badge-card ' + escapeHtml(f.dept) + ' theme-' + escapeHtml(f.theme.id) + (f.bestMatch ? " best" : "") + '" type="button" data-dept="' + escapeHtml(f.dept) + '" style="--dept-color:' + escapeHtml(f.color) + '">' +
        departmentIconHtml(f.dept, f.deptName) +
        '<strong class="badge-name">' + escapeHtml(f.formName) + '</strong>' +
        '<span class="badge-dept-desc">' + escapeHtml(f.deptName) + (f.bestMatch ? " · 代表方向" : "") + '</span>' +
        vfxPreviewHtml(state.selectedWeaponId, f.mechanicType, "badge-vfx-preview") +
        '<p class="badge-desc">' + escapeHtml(badgeCombatCopy(f)) + '</p>' +
        '<small class="badge-signature">' + escapeHtml(badgeSignatureCopy(f)) + '</small>' +
        signatureTags(f.signatureFocus) +
        '<em class="badge-risk">' + escapeHtml(f.weakness) + '</em>' +
      '</button>';
    }).join(""));
    document.querySelectorAll("[data-dept]").forEach(function (button) {
      button.onclick = function () {
        if (secondaryMode) V2.dispatch({ type: "SET_SECONDARY_BADGE", dept: button.getAttribute("data-dept") });
        else V2.dispatch({ type: "SET_BADGE", dept: button.getAttribute("data-dept") });
      };
    });
  }

  function renderUpgrade() {
    const vm = V2.getViewModel("level_up");
    const upgradeState = V2.getState && V2.getState();
    const fixedConfig = upgradeState && fixedTestConfig(upgradeState);
    const compactDecision = compactDecisionEnabled(upgradeState, fixedConfig);
    const choices = el("upgradeChoices");
    if (choices) {
      choices.classList.toggle("marker-experience-grid", !!vm.markerFixed);
      choices.style.gridTemplateColumns = vm.markerFixed ? "1fr 1fr 1fr 1fr" : "";
    }
    const skip = el("skipUpgradeButton");
    if (skip) {
      skip.classList.toggle("hidden", !!vm.markerFixed);
      if (skip.parentElement) skip.parentElement.classList.toggle("hidden", !!vm.markerFixed);
    }
    setHtml("upgradeFlow", decisionFlowHtml(["关卡战斗", "10秒回收", "经验分配", "继续流程"], 2));
    if (compactDecision) setText("upgradeContext", "剩余 " + vm.pendingPoints + " 点 · 选一项，立即生效");
    else setHtml("upgradeContext", themeBrief(vm.theme, vm.markerFixed ? "经验升级属性商店" : "经验成长", vm.markerFixed ? "还有 " + vm.pendingPoints + " 点待分配。每点从 12 项基础属性中随机出现 4 项。" : "只选一个通用成长，但它会直接作用在当前主形态上。"));
    setHtml("upgradeChoices", vm.choices.map(function (choice) {
      return '<button class="choice learning-card theme-card" type="button" data-upgrade="' + escapeHtml(choice.id) + '">' +
        (vm.markerFixed ? markerGrowthIconHtml("experience", choice.id, choice.title) : atlasIconHtml("ui", "upgrade", choice.title)) +
        (compactDecision ? '' : '<span class="tag route-tag">' + escapeHtml(choice.formLine) + '</span>') +
        '<strong>' + escapeHtml(choice.title) + '</strong>' +
        '<span class="card-desc">' + escapeHtml(choice.effect) + '</span>' +
      '</button>';
    }).join(""));
    document.querySelectorAll("[data-upgrade]").forEach(function (button) {
      button.onclick = function () {
        V2.dispatch({ type: "SELECT_UPGRADE", upgradeId: button.getAttribute("data-upgrade") });
      };
    });
  }

  function renderModuleSelect() {
    const vm = V2.getViewModel("module_select");
    const fixedConfig = V2.getState && fixedTestConfig(V2.getState());
    const markerFixed = !!fixedConfig;
    const moduleState = V2.getState ? V2.getState() : null;
    const simpleDesireChain = !!(markerFixed && moduleState && moduleState.demoV2 && moduleState.demoV2.allWeaponDesireLoopPass);
    const compactDecision = compactDecisionEnabled(moduleState, fixedConfig);
    const ownedModules = (vm.owned || []).filter(function (item) { return item.indexOf("Lv.0") < 0; });
    const choices = el("moduleChoices");
    if (choices) choices.classList.toggle("marker-module-grid", !!markerFixed);
    setText("moduleContext", compactDecision
      ? "第 " + vm.round + "/" + (vm.totalRounds || 3) + " 次 · " + (ownedModules.length ? "已有 " + ownedModules.join("、") : "选第一条路线")
      : "第 " + vm.round + "/" + (vm.totalRounds || 3) + " 次追加 · 当前身份：" + vm.identity + (vm.owned.length ? " · 已接入：" + vm.owned.join("、") : ""));
    setText("modulePanelFooter", compactDecision
      ? "看本次变化，选完立即开打"
      : simpleDesireChain
      ? "先看“立刻”和“怎么用”即可决定；混搭与 Lv4 只负责预告未来。"
      : markerFixed ? "选定后直接回到战斗；每条路线最高 Lv4。" : "三秒内能读懂，选完立即回到战斗。");
    setHtml("moduleFlow", decisionFlowHtml(["关卡完成", "10秒回收", "模块选择", "下一关"], 2));
    setHtml("moduleChoices", vm.choices.map(function (choice) {
      const compactSecondaryLabel = choice.mastery ? "专精" : choice.combo ? "协同" : "终局";
      const compactSecondaryText = choice.mastery
        ? "强化已解锁的 Lv4 终局"
        : choice.combo
          ? String(choice.combo).replace(/^本次选择建立新关系：/, "建立").replace(/^当前混合关系：/, "已接通")
          : String(choice.terminalPromise || "").split("：")[0];
      const immediateText = compactDecision ? choice.effect : choice.immediate;
      return '<button class="choice learning-card module-card theme-card" type="button" data-module="' + escapeHtml(choice.id) + '"' + (choice.disabled ? " disabled" : "") + '>' +
        (markerFixed ? (fixedConfig.weaponId === "marker" ? markerGrowthIconHtml("build", choice.id, choice.name + "模块") : weaponIconHtml(fixedConfig.weaponId, choice.name + "模块")) : "") +
        '<span class="tag route-tag">' + escapeHtml(choice.family) + ' · ' + escapeHtml(choice.levelLabel || ("Lv." + (choice.level + 1))) + '</span>' +
        '<strong>' + escapeHtml(choice.name) + '</strong>' +
        (simpleDesireChain ? "" : '<span class="card-desc">' + escapeHtml(choice.effect) + '</span>' +
          '<small>' + escapeHtml(choice.intent) + '</small>') +
        (choice.immediate ? '<div class="module-promise-grid">' +
          '<span class="module-promise-line promise-now"><b>' + (simpleDesireChain ? "立刻" : "现在改变") + '</b>' + escapeHtml(immediateText) + '</span>' +
          (compactDecision
            ? '<span class="module-promise-line ' + (choice.combo ? 'promise-relation' : 'promise-terminal') + '"><b>' + compactSecondaryLabel + '</b>' + escapeHtml(compactSecondaryText) + '</span>'
            : '<span class="module-promise-line promise-play"><b>' + (simpleDesireChain ? "怎么用" : "玩法要求") + '</b>' + escapeHtml(choice.playstyle) + '</span>' +
              '<span class="module-promise-line promise-relation"><b>' + (simpleDesireChain ? "混搭" : "组合关系") + '</b>' + escapeHtml(choice.relationPromise) + '</span>' +
              '<span class="module-promise-line promise-terminal"><b>' + (simpleDesireChain ? "Lv4" : "终局承诺") + '</b>' + escapeHtml(choice.terminalPromise) + '</span>') +
        '</div>' : '') +
        (!compactDecision && choice.combo ? '<em class="module-combo">' + escapeHtml(choice.combo) + '</em>' : '') +
      '</button>';
    }).join(""));
    document.querySelectorAll("[data-module]").forEach(function (button) {
      button.onclick = function () {
        V2.dispatch({ type: "SELECT_DEMO_V2_MODULE", moduleId: button.getAttribute("data-module") });
      };
    });
  }

  function renderComponentShop() {
    const vm = V2.getViewModel("component_shop");
    const componentState = V2.getState && V2.getState();
    const fixedConfig = componentState && fixedTestConfig(componentState);
    const compactDecision = compactDecisionEnabled(componentState, fixedConfig);
    setText("componentShopEyebrow", vm.version + " · " + vm.weaponName + "组件商店");
    setText("componentShopTitle", compactDecision ? "升级组件" : "只强化" + vm.weaponName + "基础属性，不解锁模块机制");
    setText("componentCreditsText", vm.materials);
    setHtml("componentShopFlow", compactDecision ? "" : decisionFlowHtml(["关卡战斗", "10秒回收", "组件商店", vm.shopRound >= vm.shopCount ? "最终 Boss" : "下一关"], 2));
    const componentShopFlow = el("componentShopFlow");
    if (componentShopFlow) {
      componentShopFlow.classList.toggle("hidden", compactDecision);
      componentShopFlow.hidden = compactDecision;
      componentShopFlow.style.display = compactDecision ? "none" : "";
    }
    setText("componentShopNote", compactDecision
      ? "同名升级；换属性会重置。" + (vm.lockedCount ? " 已锁 " + vm.lockedCount + " 件。" : "")
      : "第 " + vm.shopRound + "/" + vm.shopCount + " 次商店 · 每个槽位只能选择一个属性方向 · 同属性累计 1/2/4/8 件升色 · 购买另一属性会替换并清空原进度。" + (vm.lockedCount ? " 已锁定 " + vm.lockedCount + " 件。" : ""));
    setHtml("componentSlotsStrip", vm.parts.map(function (part) {
      return '<div class="marker-component-slot" style="--quality-color:' + escapeHtml(part.quality.color) + '">' +
        (part.activeStat ? fixedComponentIconHtml(fixedConfig, part.activeStat, part.activeStatName + part.name) : "") +
        '<div class="marker-component-slot-copy">' +
        '<strong>' + escapeHtml(part.name) + ' · ' + escapeHtml(part.quality.name) + '</strong>' +
        '<span>' + escapeHtml(compactDecision ? part.allocationText.replace(" · 二选一互斥", "") : part.allocationText) + '</span>' +
        '<small>' + (compactDecision ? '进度 ' : '品质进度：') + escapeHtml(part.progress) + '</small>' +
        (!compactDecision && part.mountText ? '<small class="component-mount-state">实体位置：' + escapeHtml(part.mountText) + '</small>' : '') +
        '</div>' +
      '</div>';
    }).join(""));
    setHtml("componentOffers", vm.offers.length ? vm.offers.map(function (offer) {
      const affordable = vm.materials >= offer.cost;
      const nextCount = Math.min(8, offer.owned + 1);
      const willUpgrade = nextCount === offer.nextThreshold;
      const actionLabel = offer.action === "install" ? "装入" : offer.action === "upgrade" ? "同类升级" : "替换并重置";
      const resultLine = compactDecision
        ? offer.action === "replace"
          ? "换成“" + offer.statName + "”（原进度清零）"
          : offer.action === "install"
            ? "获得白色“" + offer.statName + "”"
            : willUpgrade
              ? "升级为" + offer.nextQuality.name
              : "同名 +1 · " + nextCount + "/" + offer.nextThreshold
        : offer.action === "replace"
        ? "当前" + offer.partName + "为“" + offer.activeStatName + "”累计 " + offer.slotCopies + " 件；购买后重置为白色“" + offer.statName + "”"
        : offer.action === "install"
          ? "空槽装入后获得白色“" + offer.statName + "”组件"
          : willUpgrade
            ? "同类购买后合成为" + offer.nextQuality.name + "组件"
            : "同类购买后累计 " + nextCount + " / " + offer.nextThreshold;
      return '<div class="choice shop-card theme-card marker-component-card ' + (offer.sold ? "sold" : "") + (offer.locked ? " locked" : "") + '" style="--quality-color:' + escapeHtml(offer.purchaseQuality.color) + '">' +
        '<div class="marker-component-heading">' +
          fixedComponentIconHtml(fixedConfig, offer.statId, offer.statName + offer.partName) +
          '<div class="marker-component-heading-copy">' +
            '<span class="tag route-tag quality-name">' + escapeHtml(offer.partName + " · " + actionLabel) + '</span>' +
            '<strong>' + (offer.sold ? "已购买" : escapeHtml(compactDecision ? offer.statName : offer.name)) + '</strong>' +
          '</div>' +
        '</div>' +
        '<span class="compare-line">' + escapeHtml(resultLine) + '</span>' +
        (!compactDecision && offer.mountText ? '<span class="component-install-promise"><b>实体位置</b>' + escapeHtml(offer.mountText) + '；' + escapeHtml(offer.visualPromise) + '</span>' : '') +
        (compactDecision ? '' : '<span class="card-desc">' + (offer.action === "replace" ? "互斥替换：原属性与品质进度不会保留" : "只与同名组件合成；不会和另一属性混合") + '</span>') +
        '<span class="cost">材料 ' + offer.cost + '</span>' +
        '<div class="marker-component-actions">' +
          '<button class="slot-button" type="button" data-marker-offer="' + escapeHtml(offer.id) + '"' + (offer.sold || !affordable ? " disabled" : "") + '>' + (offer.sold ? "已购买" : actionLabel) + '</button>' +
          '<button class="slot-button marker-lock-button" type="button" data-marker-lock="' + escapeHtml(offer.id) + '"' + (offer.sold ? " disabled" : "") + '>' + (offer.locked ? "已锁定" : "锁定") + '</button>' +
        '</div>' +
      '</div>';
    }).join("") : '<p class="panel-note">三个部位都已达到红色，本轮不再刷新组件。</p>');
    document.querySelectorAll("[data-marker-offer]").forEach(function (button) {
      button.onclick = function () { V2.dispatch({ type: "BUY_MARKER_COMPONENT", offerId: button.getAttribute("data-marker-offer") }); };
    });
    document.querySelectorAll("[data-marker-lock]").forEach(function (button) {
      button.onclick = function () { V2.dispatch({ type: "TOGGLE_MARKER_COMPONENT_LOCK", offerId: button.getAttribute("data-marker-lock") }); };
    });
    const refresh = el("componentRefreshButton");
    if (refresh) {
      refresh.disabled = vm.materials < vm.refreshCost || !vm.offers.length;
      refresh.textContent = "刷新 · 材料 " + vm.refreshCost + (vm.rerolls ? "（本轮第 " + (vm.rerolls + 1) + " 次）" : "");
    }
    const cont = el("componentContinueButton");
    if (cont) cont.textContent = vm.shopRound >= vm.shopCount ? "进入最终 Boss" : "进入下一关";
    const framework = V2.getState && fixedTestConfig(V2.getState()) && fixedTestConfig(V2.getState()).uiFramework;
    const itemSection = el("itemOfferSection");
    if (itemSection) itemSection.classList.toggle("hidden", !(framework && framework.itemShop && framework.itemShop.enabled));
  }

  function renderComponentStat() {
    const vm = V2.getViewModel("component_stat_select");
    const componentState = V2.getState && V2.getState();
    const fixedConfig = componentState && fixedTestConfig(componentState);
    const compactDecision = compactDecisionEnabled(componentState, fixedConfig);
    setText("componentStatTitle", compactDecision ? "强化" + vm.partName : vm.partName + "提升为" + vm.quality.name + " · 选择一次属性");
    setText("componentStatNote", compactDecision ? "选一项，立即生效" : "本次强化只作用于当前部位的基础参数；品质不会解锁模块等级。");
    setHtml("componentStatChoices", vm.choices.map(function (choice) {
      return '<button class="choice learning-card theme-card" type="button" data-marker-stat="' + escapeHtml(choice.id) + '">' +
        fixedComponentIconHtml(fixedConfig, choice.id, choice.name) +
        '<span class="tag route-tag">当前投入 ' + choice.current + '</span>' +
        '<strong>' + escapeHtml(choice.name) + '</strong>' +
        (compactDecision ? '' : '<span class="card-desc">选择后立即提高' + escapeHtml(choice.name) + '，并返回本次组件商店。</span>') +
      '</button>';
    }).join(""));
    document.querySelectorAll("[data-marker-stat]").forEach(function (button) {
      button.onclick = function () { V2.dispatch({ type: "SELECT_MARKER_COMPONENT_STAT", statId: button.getAttribute("data-marker-stat") }); };
    });
  }

  function renderSlots() {
    const vm = V2.getViewModel("slot_select");
    const b = vm.build;
    setText("slotPanelNote", "当前主形态：" + vm.theme.formName + " · " + (b.signatureProcess || vm.theme.signatureProcess || "装入后立即改变当前攻击规则"));
    setHtml("slotBuildSummary", '<strong class="slot-build-label">当前参数</strong><div class="slot-metric-row">' + b.params.map(function (p) {
        return '<div><span>' + escapeHtml(p.label) + '</span><strong>' + escapeHtml(p.value) + '</strong></div>';
      }).join("") + '</div>');
    const cards = vm.choices.map(function (choice) {
      if (!choice.unlocked) {
        return '<div class="slot-cell locked" style="--slot-accent:' + escapeHtml(choice.accent) + '">' +
          '<div class="slot-status-label">尚未开放</div>' +
          '<div class="slot-heading">' + atlasIconHtml("ui", "slot-" + choice.slotId, choice.name) + '<div class="slot-name">' + escapeHtml(choice.name) + '</div></div>' +
          '<div class="slot-lock-label">' + escapeHtml(choice.unlockLabel || ("转正期第 " + choice.unlock + " 步开放")) + '</div>' +
          '<div class="slot-desc">' + escapeHtml(choice.role) + '</div>' +
        '</div>';
      }
      const current = choice.current
        ? '<div class="slot-current-card"><span>当前</span><strong>' + escapeHtml(choice.current) + '</strong></div>'
        : '<div class="slot-current-card empty"><span>当前</span><strong>空槽</strong></div>';
      const buttons = choice.current
        ? '<div class="slot-button-row"><button class="slot-button" type="button" data-slot="' + escapeHtml(choice.slotId) + '" data-action="replace">替换</button><button class="slot-button augment-button" type="button" data-slot="' + escapeHtml(choice.slotId) + '" data-action="augment">追加强化</button></div>'
        : '<div class="slot-button-row single"><button class="slot-button" type="button" data-slot="' + escapeHtml(choice.slotId) + '" data-action="replace">装入这个分工</button></div>';
      const replaceText = String(choice.replaceGain || "").replace(/^放入后：/, "");
      const augmentText = String(choice.augmentGain || "").replace(/^追加后：/, "");
      return '<div class="slot-cell unlocked' + (choice.current ? " has-current" : "") + '" style="--slot-accent:' + escapeHtml(choice.accent) + '">' +
        '<div class="slot-status-label">已开放</div>' +
        '<div class="slot-heading">' + atlasIconHtml("ui", "slot-" + choice.slotId, choice.name) + '<div class="slot-name">' + escapeHtml(choice.name) + '</div></div>' +
        '<div class="slot-desc">' + escapeHtml(choice.role) + '</div>' +
        current +
        '<div class="slot-param-preview"><span>' + (choice.current ? "替换后" : "装入后") + '</span><strong>' + escapeHtml(replaceText) + '</strong></div>' +
        (choice.current ? '<div class="slot-param-preview augment-preview"><span>追加后</span><strong>' + escapeHtml(augmentText) + '</strong></div>' : '') +
        buttons +
      '</div>';
    }).join("");
    setHtml("slotChoices", cards);
    document.querySelectorAll("[data-slot]").forEach(function (button) {
      button.onclick = function () {
        V2.dispatch({ type: "SELECT_SLOT", slotId: button.getAttribute("data-slot"), action: button.getAttribute("data-action") });
      };
    });
  }

  function renderArmory() {
    const vm = V2.getViewModel("armory");
    setText("armoryReasonText", vm.reason);
    setText("armoryMaterialText", vm.materials);
    const refresh = el("refreshButton");
    if (refresh) {
      refresh.textContent = "刷新工坊 · 材料 " + vm.refreshCost;
      refresh.disabled = vm.materials < vm.refreshCost;
    }
    const b = vm.build;
    setHtml("armoryBuildStrip", themeBrief(vm.theme, "材料工坊", b.signatureProcess || vm.theme.signatureProcess || "强化当前攻击方式") +
      '<div class="armory-form-metrics">' + b.params.map(function (p) {
        return '<span><i>' + escapeHtml(p.label) + '</i><strong>' + escapeHtml(p.value) + '</strong></span>';
      }).join("") + '</div>');
    setHtml("weaponChoices", vm.offers.map(function (offer, index) {
      const affordable = vm.materials >= offer.cost;
      return '<button class="choice shop-card theme-card ' + (index === 0 ? "recommended-offer" : "") + '" type="button" data-offer="' + escapeHtml(offer.id) + '"' + (affordable ? "" : " disabled") + '>' +
        '<span class="tag route-tag">' + escapeHtml(offer.categoryLabel || (index === 0 ? "优先补强" : "可选强化")) + '</span>' +
        '<strong>' + escapeHtml(offer.title) + '</strong>' +
        '<span class="compare-line">' + escapeHtml(offer.impact) + '</span>' +
        '<span class="card-desc">' + escapeHtml(offer.reason) + '</span>' +
        '<span class="cost">材料 ' + offer.cost + '</span>' +
      '</button>';
    }).join(""));
    document.querySelectorAll("[data-offer]").forEach(function (button) {
      button.onclick = function () {
        V2.dispatch({ type: "BUY_OFFER", offerId: button.getAttribute("data-offer") });
      };
    });
  }

  function renderResult() {
    const vm = V2.getViewModel("result");
    setText("resultTitle", vm.title);
    setHtml("deathRecap", themeBrief(vm.theme, "本局主形态", "先看这把武器最后实际形成了什么打法。") +
      (vm.markerFixed
        ? '<p>完成 ' + vm.markerFixed.completedEncounters + '/17 关 · 商店 ' + vm.markerFixed.shopsVisited + '/6 · 击破 ' + vm.kills + ' · 峰值目标 ' + vm.markerFixed.peakEnemies + '</p>' +
          '<p>' + escapeHtml(vm.markerFixed.moduleLabels[0]) + ' Lv.' + vm.markerFixed.modules.copy + ' / ' + escapeHtml(vm.markerFixed.moduleLabels[1]) + ' Lv.' + vm.markerFixed.modules.archive + '</p>' +
          '<p>经验基础属性 ' + escapeHtml(vm.markerFixed.experienceSummary) + ' · 购买白色组件 ' + vm.markerFixed.componentsBought + ' 个</p>' +
          '<p>阶段材料 ' + vm.markerFixed.stageMaterialsEarned + '（收获追加 ' + vm.markerFixed.harvestingMaterialsEarned + '） / 拾取材料 ' + vm.markerFixed.dropMaterialsEarned + ' / 消耗 ' + vm.markerFixed.materialsSpent + '</p>' +
          '<p>' + escapeHtml(vm.markerFixed.fullscreenLabels[0]) + ' ' + vm.markerFixed.fullscreenCopyTriggers + ' 次 · ' + escapeHtml(vm.markerFixed.fullscreenLabels[1]) + ' ' + vm.markerFixed.fullscreenArchiveTriggers + ' 次' + (vm.markerFixed.weaponId === "thermos" ? ' · 聚焦击杀 ' + vm.markerFixed.focusKills + ' · 死亡热浪 ' + vm.markerFixed.heatwaveTriggers : vm.markerFixed.weaponId === "scissors" ? ' · 轻步 ' + vm.markerFixed.dashes + '（闪避 ' + vm.markerFixed.dashDodges + '）· 合刃命中 ' + vm.markerFixed.closedHits + ' · 张刃命中 ' + vm.markerFixed.openHits + ' · 处决 ' + vm.markerFixed.executions + ' · 安全区 ' + vm.markerFixed.shelterTriggers + ' 次 / 挡弹 ' + vm.markerFixed.blockedShots : vm.markerFixed.weaponId === "correction_fluid" ? ' · 错误 ' + vm.markerFixed.errorsApplied + ' 层 · 过载 ' + vm.markerFixed.overloads + ' · 污染区 ' + vm.markerFixed.errorAreas + ' · 融合 ' + vm.markerFixed.areaMerges + ' · 纠错击杀 ' + vm.markerFixed.finalKills : '') + '</p>' +
          '<div class="marker-component-slots">' + vm.markerFixed.parts.map(function (part) { return '<div class="marker-component-slot" style="--quality-color:' + escapeHtml(part.quality.color) + '">' + (part.activeStat ? fixedComponentIconHtml(fixedTestConfig(V2.getState()), part.activeStat, part.activeStatName + part.name) : "") + '<div class="marker-component-slot-copy"><strong>' + escapeHtml(part.name + " · " + part.quality.name) + '</strong><span>' + escapeHtml(part.allocationText) + '</span><small>' + escapeHtml(part.progress) + '</small></div></div>'; }).join("") + '</div>'
        : vm.phaseB
        ? '<p>击破 ' + vm.kills + ' · 峰值目标 ' + vm.phaseB.peakEnemies + ' · 模块 ' + escapeHtml(vm.phaseB.modules.join(" → ") || "无") + '</p>'
        : vm.phaseA
          ? '<p>击破 ' + vm.kills + ' · 峰值目标 ' + vm.phaseA.peakEnemies + ' · 问题波 ' + vm.phaseA.wavesSeen + '/4</p>'
          : '<p>等级 ' + vm.level + ' · 击破 ' + vm.kills + ' · 材料 ' + vm.materials + '</p>') +
      '<div class="v2-damage-list">' + vm.damage.map(function (row) {
        return '<div><span>' + escapeHtml(row.source) + '</span><b>' + row.damage + '</b></div>';
      }).join("") + '</div>' +
      '<p class="panel-note">' + escapeHtml(vm.note) + '</p>');
  }

  function renderPause() {
    const vm = V2.getViewModel("pause");
    const chips = [
      vm.badge ? "工牌：" + vm.badge : "",
      vm.secondaryBadge ? "第二部门：" + vm.secondaryBadge : "",
      vm.supportSkill ? "跨技能：" + vm.supportSkill : ""
    ].filter(Boolean);
    setHtml("pauseStats",
      '<div class="pause-meta">' + escapeHtml(vm.stageMeta) + '</div>' +
      '<section>' +
        '<h3>当前构筑</h3>' +
        '<div class="pause-routes">' +
          '<div class="pause-route" style="--route-color:' + escapeHtml(vm.theme.badgeColor || "#52ffe1") + ';--route-accent:#ffd15c">' +
            '<strong>' + escapeHtml(vm.weapon) + '</strong>' +
            '<span>' + escapeHtml(vm.formName) + '</span>' +
            '<i><em style="width:100%"></em></i>' +
          '</div>' +
          '<div class="pause-route" style="--route-color:#8d74ff;--route-accent:#52ffe1">' +
            '<strong>' + escapeHtml(vm.phaseMeta) + '</strong>' +
            '<span>' + escapeHtml(vm.formShort) + '</span>' +
            '<i><em style="width:72%"></em></i>' +
          '</div>' +
        '</div>' +
      '</section>' +
      '<section>' +
        '<h3>局内状态</h3>' +
        '<div class="pause-stats">' +
          '<span><b>血量</b>' + escapeHtml(vm.hp) + '</span>' +
          '<span><b>倒计时</b>' + escapeHtml(vm.time) + '</span>' +
          '<span><b>击破</b>' + escapeHtml(vm.kills) + '</span>' +
          '<span><b>剩余</b>' + escapeHtml(vm.remaining) + '</span>' +
          '<span><b>等级</b>' + escapeHtml(vm.level) + '</span>' +
          '<span><b>材料</b>' + escapeHtml(vm.materials) + '</span>' +
        '</div>' +
      '</section>' +
      '<section>' +
        '<h3>当前目标</h3>' +
        '<div class="pause-chips">' + chips.map(function (chip) {
          return '<span>' + escapeHtml(chip) + '</span>';
        }).join("") + '<span>' + escapeHtml(vm.objective) + '</span></div>' +
        '<p class="panel-note">' + escapeHtml(vm.stageNote) + '</p>' +
      '</section>'
    );
  }

  function renderDebug(state) {
    const panel = el("debugPanel");
    if (!panel) return;
    const enabled = !!(state.flags && state.flags.debug);
    panel.classList.toggle("hidden", !enabled);
    if (!enabled) return;
    const vm = V2.getViewModel("debug");
    const audio = V2.audio && V2.audio.getStatus ? V2.audio.getStatus() : null;
    setHtml("debugPanel", [
      '<b>mode</b> ' + escapeHtml(vm.mode),
      '<b>stage</b> ' + escapeHtml(vm.stage || "-"),
      '<b>warmup</b> ' + escapeHtml(Math.round((vm.warmupTime || 0) * 10) / 10),
      '<b>running</b> ' + escapeHtml(vm.running ? "yes" : "no"),
      '<b>raf</b> ' + escapeHtml(vm.raf ? "yes" : "no"),
      '<b>interval</b> ' + escapeHtml(vm.interval ? "yes" : "no"),
      '<b>updates</b> ' + escapeHtml(vm.updateCount),
      '<b>entities</b> ' + escapeHtml([vm.enemies, vm.projectiles, vm.zones, vm.particles].join("/")),
      audio ? '<b>audio</b> ' + escapeHtml([
        audio.available ? (audio.unlocked ? "unlocked" : "locked") : "unavailable",
        audio.muted ? "muted" : "on",
        audio.playedEvents + "/" + audio.auditEvents
      ].join("/")) : '',
      audio ? '<b>music</b> ' + escapeHtml([audio.musicScene, audio.musicBpm + "bpm", audio.musicMode].join("/")) : '',
      vm.lastError ? '<b>error</b> ' + escapeHtml(vm.lastError) : ''
    ].filter(Boolean).join('<span class="debug-sep">·</span>'));
  }

  function renderAudioControl() {
    const sound = el("soundButton");
    if (!sound || !V2.audio) return;
    const muted = V2.audio.isMuted();
    sound.textContent = muted ? "声音：关" : "声音：开";
    sound.setAttribute("aria-pressed", muted ? "true" : "false");
  }

  function render() {
    const state = V2.getState();
    if (V2.audio && V2.audio.syncMusic) V2.audio.syncMusic(state);
    applyShellState(state);
    renderMode(state);
    renderHud(state);
    if (state.mode === "weapon_select" || state.mode === "support_weapon_select") renderWeaponSelect();
    if (state.mode === "badge_select" || state.mode === "secondary_badge_select") renderBadgeSelect(state);
    if (state.mode === "level_up") renderUpgrade();
    if (state.mode === "module_select") renderModuleSelect();
    if (state.mode === "component_shop") renderComponentShop();
    if (state.mode === "component_stat_select") renderComponentStat();
    if (state.mode === "slot_select") renderSlots();
    if (state.mode === "armory") renderArmory();
    if (state.mode === "result") renderResult();
    if (state.mode === "paused") renderPause();
    renderAudioControl();
    renderDebug(state);
  }

  function bindStaticControls() {
    const start = el("startButton");
    if (start) start.onclick = function () { V2.dispatch({ type: "OPEN_WEAPON_SELECT" }); };
    const pause = el("pauseButton");
    if (pause) pause.onclick = function () { V2.dispatch({ type: "PAUSE" }); };
    const resume = el("resumeButton");
    if (resume) resume.onclick = function () { V2.dispatch({ type: "RESUME" }); };
    const restart = el("restartButton");
    if (restart) restart.onclick = function () { V2.dispatch({ type: "RESTART" }); };
    const restartPause = el("restartFromPause");
    if (restartPause) restartPause.onclick = function () { V2.dispatch({ type: "END_RUN" }); };
    const sound = el("soundButton");
    if (sound && V2.audio) sound.onclick = function () {
      const muted = V2.audio.toggleMuted();
      renderAudioControl();
      renderDebug(V2.getState());
      if (!muted) Promise.resolve(V2.audio.unlock()).then(function () { renderDebug(V2.getState()); });
    };
    const skipUpgrade = el("skipUpgradeButton");
    if (skipUpgrade) skipUpgrade.onclick = function () { V2.dispatch({ type: "SKIP_UPGRADE" }); };
    const refresh = el("refreshButton");
    if (refresh) refresh.onclick = function () { V2.dispatch({ type: "REFRESH_ARMORY" }); };
    const cont = el("continueButton");
    if (cont) cont.onclick = function () { V2.dispatch({ type: "CONTINUE_NEXT_STAGE" }); };
    const componentRefresh = el("componentRefreshButton");
    if (componentRefresh) componentRefresh.onclick = function () { V2.dispatch({ type: "REFRESH_MARKER_COMPONENTS" }); };
    const componentContinue = el("componentContinueButton");
    if (componentContinue) componentContinue.onclick = function () { V2.dispatch({ type: "CONTINUE_MARKER_TEST" }); };
    const toggle = el("buildToggle");
    if (toggle) toggle.onclick = function () {
      const panel = el("buildPanel");
      if (panel) panel.classList.toggle("collapsed");
    };
  }

  V2.ui = {
    render,
    bindStaticControls
  };
})();
