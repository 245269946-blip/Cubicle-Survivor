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

  function weaponPreviewSprite(weaponId) {
    if (weaponId === "marker") return "marker_beam";
    if (weaponId === "thermos") return "thermos_steam";
    if (weaponId === "sticky_note") return "sticky_base";
    return "";
  }

  function formPreviewSprite(weaponId, mechanicType) {
    if (weaponId === "marker") {
      if (mechanicType === "line_split") return "marker_split";
      if (mechanicType === "mark_detonate") return "marker_blast";
      if (mechanicType === "shield_counter_line") return "marker_counter";
      if (mechanicType === "line_to_wave") return "marker_wave";
      if (mechanicType === "line_grid_field") return "marker_grid";
      return "marker_beam";
    }
    if (weaponId === "thermos") {
      if (mechanicType === "patrol_summon_steam") return "thermos_drone";
      if (mechanicType === "charge_release_beam") return "thermos_boil";
      if (mechanicType === "shield_break_pulse") return "thermos_shield_break";
      if (mechanicType === "periodic_wave_spread") return "thermos_tea_wave";
      if (mechanicType === "deployable_safe_station") return "thermos_station";
      return "thermos_steam";
    }
    if (weaponId === "sticky_note") {
      if (mechanicType === "seeking_trap_summon") return "sticky_seeking";
      if (mechanicType === "manual_trap_detonate") return "sticky_sync_blast";
      if (mechanicType === "route_buff_trap") return "sticky_route";
      if (mechanicType === "sticky_debuff_spread") return "sticky_spread";
      if (mechanicType === "trap_link_control_zone") return "sticky_notice_board";
      return "sticky_base";
    }
    return "";
  }

  function vfxPreviewHtml(spriteId, className) {
    if (!spriteId) return "";
    return '<img class="' + escapeHtml(className || "vfx-preview-img") + '" src="' + escapeHtml(vfxSpritePath(spriteId)) + '" alt="" aria-hidden="true" />';
  }

  function applyShellState(state) {
    const wrap = document.querySelector(".v2-game");
    if (!wrap || !V2.viewModel) return;
    const theme = V2.viewModel.pageTheme(state);
    wrap.dataset.weaponTheme = theme.id;
    wrap.dataset.pageMode = state.mode;
    wrap.dataset.stagePhase = theme.phase.id;
    wrap.style.setProperty("--active-badge-color", theme.badgeColor || "#00e5ff");
  }

  function themeBrief(theme, pageLabel, focusText) {
    const focus = theme.signatureFocus && theme.signatureFocus.length
      ? '<div class="v2-signature-tags">' + theme.signatureFocus.map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join("") + '</div>'
      : "";
    return '<div class="v2-page-identity theme-' + escapeHtml(theme.id) + '">' +
      '<div class="v2-theme-preview ' + previewClass(theme.topology) + '" aria-hidden="true"><i></i><i></i><i></i></div>' +
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

  function renderHud(state) {
    const vm = V2.getViewModel("hud");
    setText("objectiveStageMeta", vm.stageMeta);
    setText("objectiveStageName", vm.stageName);
    setText("objectiveTime", vm.time);
    setText("objectiveRemaining", vm.remaining);
    setText("objectiveKills", vm.kills);
    setText("objectiveAlert", vm.stageNote);
    setText("levelText", vm.level);
    setText("materialText", vm.materials);
    setText("formText", vm.formText);
    setText("hpText", vm.hp);
    const hpFill = el("hpFill");
    if (hpFill) hpFill.style.width = vm.hpPct + "%";
    const xpFill = el("xpFill");
    if (xpFill) xpFill.style.width = vm.xpPct + "%";
    setText("warmupTitle", state.stage ? state.stage.name + " 准备中" : "准备中");
    setText("warmupTimer", Math.ceil(vm.warmup) + "s");
    const warmupFill = el("warmupFill");
    if (warmupFill) warmupFill.style.width = Math.max(0, Math.min(100, (1 - vm.warmup / 3) * 100)) + "%";

    const b = vm.build;
    setText("buildSummary", b.formName);
    const extraBuildBits = [
      b.secondaryBadge ? '<span>第二部门：' + escapeHtml(b.secondaryBadge) + '</span>' : '',
      b.supportSkill ? '<span>跨技能：' + escapeHtml(b.supportSkill) + '</span>' : ''
    ].filter(Boolean).join('');
    setHtml("routeMap", '<div class="v2-form-chip theme-' + escapeHtml(b.theme.id) + '"><b>' + escapeHtml(b.weapon) + '</b><span>' + escapeHtml(b.theme.phase.weaponStageShort) + '</span><em>' + escapeHtml(b.formShort) + '</em>' + extraBuildBits + '</div>');
    setHtml("buildList", b.params.map(function (item) {
      return '<div><span>' + escapeHtml(item.label) + '</span><strong>' + escapeHtml(item.value) + '</strong></div>';
    }).join("") + b.slots.map(function (slot) {
      return '<div class="' + (slot.open ? "" : "dim") + '"><span>' + escapeHtml(slot.name) + '</span><strong>' + escapeHtml(slot.open ? slot.value : slot.unlockLabel) + '</strong></div>';
    }).join(""));
  }

  function renderWeaponSelect() {
    const state = V2.getState();
    const supportMode = state.mode === "support_weapon_select";
    const items = V2.getViewModel(supportMode ? "support_weapon_select" : "weapon_select");
    setText("weaponSelectEyebrow", supportMode ? "跨技能学习" : "选择初始武器");
    setText("weaponSelectTitle", supportMode ? "选择一个副武器本质技能" : "先决定你怎么清场");
    setText("weaponSelectNote", supportMode ? "副武器只保留核心技能作为辅助，不会替代当前主武器形态。" : "武器决定基础战斗动词。下一步选择工牌后，同一把武器会变成不同形态。");
    setHtml("weaponSelectGrid", items.map(function (w) {
      return '<button class="weapon-card theme-' + escapeHtml(w.themeId) + ' ' + previewClass(w.topology) + '" type="button" data-weapon="' + escapeHtml(w.id) + '">' +
        '<span class="weapon-icon">' + escapeHtml(w.emoji) + '</span>' +
        '<strong>' + escapeHtml(w.name) + '</strong>' +
        '<em>' + escapeHtml(w.motif) + '</em>' +
        vfxPreviewHtml(weaponPreviewSprite(w.id), "vfx-preview-img weapon-vfx-preview") +
        '<div class="v2-preview" aria-hidden="true"><i></i><i></i><i></i></div>' +
        '<p>' + escapeHtml(w.description) + '</p>' +
        '<small>' + escapeHtml(w.signatureLabel) + ' · ' + escapeHtml(w.signatureProcess) + '</small>' +
        signatureTags(w.signatureFocus) +
      '</button>';
    }).join(""));
    document.querySelectorAll("[data-weapon]").forEach(function (button) {
      button.onclick = function () {
        if (supportMode) V2.dispatch({ type: "SET_SUPPORT_WEAPON", weaponId: button.getAttribute("data-weapon") });
        else V2.dispatch({ type: "START_RUN", weaponId: button.getAttribute("data-weapon") });
      };
    });
  }

  function renderBadgeSelect(state) {
    const secondaryMode = state.mode === "secondary_badge_select";
    const forms = V2.getViewModel("badge_select").filter(function (form) {
      return !secondaryMode || form.dept !== state.badgeDept;
    });
    setText("badgePanelTitle", secondaryMode ? "选择第二部门的初级能力" : V2.compat.weaponName(state.selectedWeaponId) + "要被养成哪种形态？");
    setHtml("badgeGrid", forms.map(function (f) {
      return '<button class="badge-card ' + escapeHtml(f.dept) + ' theme-' + escapeHtml(f.theme.id) + (f.bestMatch ? " best" : "") + '" type="button" data-dept="' + escapeHtml(f.dept) + '" style="--dept-color:' + escapeHtml(f.color) + '">' +
        '<span class="badge-emoji">' + escapeHtml(f.deptEmoji) + '</span>' +
        '<strong class="badge-name">' + escapeHtml(f.formName) + '</strong>' +
        '<span class="badge-dept-desc">' + escapeHtml(f.deptName) + (f.bestMatch ? " · 代表方向" : "") + '</span>' +
        vfxPreviewHtml(formPreviewSprite(state.selectedWeaponId, f.mechanicType), "vfx-preview-img badge-vfx-preview") +
        '<div class="form-preview ' + previewClass(f.mechanicType) + '"><i></i><i></i><i></i></div>' +
        '<p class="badge-desc">' + escapeHtml(f.combatVerb) + '</p>' +
        '<small class="badge-signature">' + escapeHtml(f.signatureLabel) + ' · ' + escapeHtml(f.signatureProcess) + '</small>' +
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
    setHtml("upgradeContext", themeBrief(vm.theme, "经验成长", "只选一个通用成长，但它会直接作用在当前主形态上。"));
    setHtml("upgradeChoices", vm.choices.map(function (choice) {
      return '<button class="choice learning-card theme-card" type="button" data-upgrade="' + escapeHtml(choice.id) + '">' +
        '<span class="tag route-tag">' + escapeHtml(choice.formLine) + '</span>' +
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

  function renderSlots() {
    const vm = V2.getViewModel("slot_select");
    const b = vm.build;
    setHtml("slotBuildSummary", themeBrief(vm.theme, "卡槽分工", "当前主形态：" + (b.signatureProcess || vm.theme.signatureProcess || "看前后参数变化")) +
      '<div class="slot-metric-row">' + b.params.map(function (p) {
        return '<div><span>' + escapeHtml(p.label) + '</span><strong>' + escapeHtml(p.value) + '</strong></div>';
      }).join("") + '</div>');
    setHtml("slotChoices", vm.choices.map(function (choice) {
      const current = choice.current
        ? '<div class="slot-current-card"><span>当前</span><strong>' + escapeHtml(choice.current) + '</strong><em>覆盖会失去这条槽位强化</em></div>'
        : '<div class="slot-current-card empty"><span>当前</span><strong>空槽</strong><em>放入后立刻影响主形态</em></div>';
      return '<div class="slot-cell ' + (choice.unlocked ? "" : "locked-slot") + '" style="--slot-accent:' + escapeHtml(choice.accent) + '">' +
        '<div class="slot-name">' + escapeHtml(choice.name) + '</div>' +
        '<div class="slot-desc">' + escapeHtml(choice.role) + '</div>' +
        current +
        '<div class="slot-param-preview"><span>覆盖</span><strong>' + escapeHtml(choice.replaceGain) + '</strong></div>' +
        '<div class="slot-param-preview augment-preview"><span>追加</span><strong>' + escapeHtml(choice.augmentGain) + '</strong></div>' +
        (choice.unlocked
          ? '<div class="slot-button-row"><button class="slot-button" type="button" data-slot="' + escapeHtml(choice.slotId) + '" data-action="replace">放入/覆盖</button><button class="slot-button augment-button" type="button" data-slot="' + escapeHtml(choice.slotId) + '" data-action="augment">追加强化</button></div>'
          : '<div class="slot-occupy-warn">' + escapeHtml(choice.unlockLabel || ("转正期第 " + choice.unlock + " 步开放")) + '</div>') +
      '</div>';
    }).join(""));
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
    setHtml("armoryBuildStrip", themeBrief(vm.theme, "材料工坊", "围绕当前主形态补强：" + (b.signatureProcess || vm.theme.signatureProcess || "强化当前攻击方式")) +
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
    setHtml("deathRecap", themeBrief(vm.theme, "本局主形态", "复盘先看这把武器最后实际成了什么打法。") +
      '<p>等级 ' + vm.level + ' · 击破 ' + vm.kills + ' · 材料 ' + vm.materials + '</p>' +
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

  function renderDebug() {}

  function render() {
    const state = V2.getState();
    applyShellState(state);
    renderMode(state);
    renderHud(state);
    if (state.mode === "weapon_select" || state.mode === "support_weapon_select") renderWeaponSelect();
    if (state.mode === "badge_select" || state.mode === "secondary_badge_select") renderBadgeSelect(state);
    if (state.mode === "level_up") renderUpgrade();
    if (state.mode === "slot_select") renderSlots();
    if (state.mode === "armory") renderArmory();
    if (state.mode === "result") renderResult();
    if (state.mode === "paused") renderPause();
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
    const skipUpgrade = el("skipUpgradeButton");
    if (skipUpgrade) skipUpgrade.onclick = function () { V2.dispatch({ type: "SKIP_UPGRADE" }); };
    const refresh = el("refreshButton");
    if (refresh) refresh.onclick = function () { V2.dispatch({ type: "REFRESH_ARMORY" }); };
    const cont = el("continueButton");
    if (cont) cont.onclick = function () { V2.dispatch({ type: "CONTINUE_NEXT_STAGE" }); };
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
