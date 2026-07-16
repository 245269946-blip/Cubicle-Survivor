// ================================================================
// src/v2/progression/progression.js
// XP, slots and armory all serve the active weapon form.
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});
  const V2 = CS.V2 || (CS.V2 = {});

  const SLOT_DEFS = {
    offense: { name: "输出槽", unlock: 1, accent: "#ff6b4a", role: "提高当前形态的清怪速度、数量、爆炸或命中触发。" },
    survival: { name: "生存槽", unlock: 2, accent: "#4acf6a", role: "把当前形态的一部分命中转成护盾、回血、减速或推开。" },
    resource: { name: "资源槽", unlock: 2, accent: "#ffd700", role: "让当前形态带来更多经验、材料或吸附收益。" },
    mechanic: { name: "机制槽", unlock: 3, accent: "#4a9eff", role: "改变当前形态规则，例如二次分裂、回弹、留场、连线。" },
    cost: { name: "代价槽", unlock: 4, accent: "#f04040", role: "大幅强化当前形态，同时加入停火、空窗或承伤风险。" }
  };

  const slotCards = [
    { id: "form_output", slot: "offense", name: "主轴增压" },
    { id: "form_survival", slot: "survival", name: "容错回路" },
    { id: "form_resource", slot: "resource", name: "资源回收" },
    { id: "form_mechanic", slot: "mechanic", name: "规则改写" },
    { id: "form_cost", slot: "cost", name: "高压模式" }
  ];

  const UPGRADE_POOL = [
    {
      id: "damage",
      title: "主形态伤害 +12%",
      effect: "当前攻击更容易清掉第一排敌人。",
      apply(state) { state.activeFormParams.damage = Math.round((state.activeFormParams.damage || 10) * 1.12); }
    },
    {
      id: "cooldown",
      title: "触发间隔 -8%",
      effect: "同样时间内更频繁看到当前形态特效。",
      apply(state) { state.activeFormParams.cooldown = Math.max(0.35, (state.activeFormParams.cooldown || 1.4) * 0.92); }
    },
    {
      id: "range",
      title: "作用距离 +10%",
      effect: "更早命中目标，拉怪路线更舒服。",
      apply(state) { state.activeFormParams.range = Math.round((state.activeFormParams.range || 320) * 1.1); }
    },
    {
      id: "area",
      title: "范围效果 +15%",
      effect: "波纹、爆点、陷阱、护盾反击覆盖更大。",
      apply(state) {
        const p = state.activeFormParams;
        p.area = (p.area || 1) * 1.15;
        p.waveRadius = Math.round((p.waveRadius || 80) * 1.15);
        p.explosionRadius = Math.round((p.explosionRadius || 55) * 1.15);
        p.trapRadius = Math.round((p.trapRadius || 48) * 1.15);
        p.pulseRadius = Math.round((p.pulseRadius || 90) * 1.15);
      }
    },
    {
      id: "speed",
      title: "移动速度 +8%",
      effect: "更容易把敌人带进当前武器喜欢的形状。",
      apply(state) { state.player.speed = Math.round(state.player.speed * 1.08); }
    },
    {
      id: "maxhp",
      title: "最大血量 +12",
      effect: "容错提高，但不改变当前形态节奏。",
      apply(state) { state.maxHp += 12; state.hp = Math.min(state.maxHp, state.hp + 12); }
    }
  ];

  const SLOT_RULES = {
    line_split: {
      offense: { text: "分裂支线 +1，下一波会更像激光群。", apply: p => { p.splitCount = (p.splitCount || 1) + 1; p.damage = Math.round((p.damage || 10) * 1.08); } },
      survival: { text: "分裂命中给少量护盾，贴脸时多一点容错。", apply: p => { p.shieldPerHit = (p.shieldPerHit || 0) + 0.8; } },
      resource: { text: "分裂命中有概率掉材料，怪越成线越赚。", apply: p => { p.materialBonus = (p.materialBonus || 0) + 0.14; } },
      mechanic: { text: "支线可再次分裂一次，但二次分裂伤害递减。", apply: p => { p.secondarySplit = true; p.extraTrigger = (p.extraTrigger || 0) + 1; } },
      cost: { text: "分裂数量 +2，但每轮光束后短暂停火。", apply: p => { p.splitCount = (p.splitCount || 1) + 2; p.cooldown = (p.cooldown || 1.4) * 1.08; p.risk = (p.risk || 0) + 1; } }
    },
    mark_detonate: {
      offense: { text: "P0 光爆半径 +25%，更容易带走周围小怪。", apply: p => { p.explosionRadius = Math.round((p.explosionRadius || 58) * 1.25); p.explosionDamage = Math.round((p.explosionDamage || 30) * 1.12); } },
      survival: { text: "引爆 P0 后获得短护盾，集火精英时更稳。", apply: p => { p.shieldOnDetonate = (p.shieldOnDetonate || 0) + 10; } },
      resource: { text: "P0 引爆击杀额外掉材料。", apply: p => { p.materialBonus = (p.materialBonus || 0) + 0.18; } },
      mechanic: { text: "P0 标记窗口 +1 秒，并可被溅射伤害续上。", apply: p => { p.markWindow = (p.markWindow || 3) + 1; p.splashRefreshMark = true; } },
      cost: { text: "P0 光爆范围翻倍，但引爆后主武器短暂停顿。", apply: p => { p.explosionRadius = Math.round((p.explosionRadius || 58) * 2); p.pauseAfterBlast = true; p.risk = (p.risk || 0) + 1; } }
    },
    shield_counter_line: {
      offense: { text: "破盾反射短激光 +1，反击清场更明显。", apply: p => { p.counterLines = (p.counterLines || 4) + 1; p.counterDamage = Math.round((p.counterDamage || 24) * 1.12); } },
      survival: { text: "光束命中转护盾提高，反刺触发更稳定。", apply: p => { p.shieldPerHit = (p.shieldPerHit || 1) + 1.2; } },
      resource: { text: "护盾反刺击杀时额外掉材料。", apply: p => { p.counterMaterialBonus = (p.counterMaterialBonus || 0) + 0.2; } },
      mechanic: { text: "破盾反刺从四向变为六向。", apply: p => { p.counterLines = Math.max(p.counterLines || 4, 6); } },
      cost: { text: "护盾更薄，但反刺伤害大幅提高。", apply: p => { p.shieldPerHit = Math.max(0.5, (p.shieldPerHit || 1.4) * 0.7); p.counterDamage = Math.round((p.counterDamage || 24) * 1.8); p.risk = (p.risk || 0) + 1; } }
    },
    line_to_wave: {
      offense: { text: "终点波纹 +1 圈，线尾会扩散两次。", apply: p => { p.waveCount = (p.waveCount || 1) + 1; } },
      survival: { text: "波纹附带轻推开，帮你拉开距离。", apply: p => { p.waveKnockback = (p.waveKnockback || 0) + 1; } },
      resource: { text: "波纹击杀额外给经验。", apply: p => { p.xpBonus = (p.xpBonus || 0) + 0.16; } },
      mechanic: { text: "波纹到达边缘后回弹一次。", apply: p => { p.waveReturn = true; } },
      cost: { text: "波纹更大更痛，但主光束伤害降低。", apply: p => { p.waveRadius = Math.round((p.waveRadius || 96) * 1.45); p.waveDamage = Math.round((p.waveDamage || 15) * 1.45); p.damage = Math.round((p.damage || 20) * 0.86); } }
    },
    line_grid_field: {
      offense: { text: "残留线伤害提高，网格区持续切割。", apply: p => { p.gridDamage = Math.round((p.gridDamage || 10) * 1.35); } },
      survival: { text: "敌人穿过残留线会减速，给你更多走位空间。", apply: p => { p.gridSlow = 0.35; } },
      resource: { text: "网格命中掉材料概率提高。", apply: p => { p.materialBonus = (p.materialBonus || 0) + 0.2; } },
      mechanic: { text: "残留线持续 +1.5 秒，更容易交叉成区。", apply: p => { p.trailDuration = (p.trailDuration || 3) + 1.5; } },
      cost: { text: "网格密度提高，但主光束伤害降低。", apply: p => { p.gridEcho = true; p.gridDamage = Math.round((p.gridDamage || 10) * 1.6); p.damage = Math.round((p.damage || 20) * 0.82); } }
    },
    charge_release_beam: {
      offense: { text: "沸点蒸汽柱更粗，释放时能扫到更多敌人。", apply: p => { p.releaseWidth = (p.releaseWidth || 20) + 10; p.releaseDamage = Math.round((p.releaseDamage || 70) * 1.12); } },
      survival: { text: "释放沸点后获得余温护盾。", apply: p => { p.shieldAfterRelease = (p.shieldAfterRelease || 0) + 14; } },
      resource: { text: "沸点击杀额外掉材料。", apply: p => { p.materialBonus = (p.materialBonus || 0) + 0.16; } },
      mechanic: { text: "热量上限提高，过热可蓄一次更强释放。", apply: p => { p.overheatBank = true; p.heatMax = 120; } },
      cost: { text: "沸点伤害翻倍，但释放后空窗更长。", apply: p => { p.releaseDamage = Math.round((p.releaseDamage || 70) * 2); p.cooldown = (p.cooldown || 1) * 1.25; p.risk = (p.risk || 0) + 1; } }
    },
    shield_break_pulse: {
      offense: { text: "破盾热浪伤害提高，反击更像一圈爆发。", apply: p => { p.pulseDamage = Math.round((p.pulseDamage || 30) * 1.35); } },
      survival: { text: "暖流护盾更厚，破盾前更能扛。", apply: p => { p.shieldGain = (p.shieldGain || 8) + 8; } },
      resource: { text: "热浪击杀掉材料概率提高。", apply: p => { p.materialBonus = (p.materialBonus || 0) + 0.14; } },
      mechanic: { text: "护盾破裂会连续释放两圈热浪。", apply: p => { p.pulseCount = (p.pulseCount || 1) + 1; } },
      cost: { text: "护盾更容易破，但破裂热浪大幅提高。", apply: p => { p.shieldGain = Math.max(3, (p.shieldGain || 8) - 4); p.pulseDamage = Math.round((p.pulseDamage || 30) * 1.8); } }
    },
    deployable_safe_station: {
      offense: { text: "茶水间区域会周期喷蒸汽。", apply: p => { p.stationPulseDamage = Math.round((p.stationPulseDamage || 8) + 8); } },
      survival: { text: "茶水间补给更强，站在附近缓慢回血。", apply: p => { p.heal = (p.heal || 1) + 1; } },
      resource: { text: "茶水间区域内击杀额外掉材料。", apply: p => { p.materialBonus = (p.materialBonus || 0) + 0.22; } },
      mechanic: { text: "场上可同时保留两个茶水间。", apply: p => { p.stationLimit = (p.stationLimit || 1) + 1; } },
      cost: { text: "据点范围变大，但离开据点时主武器变慢。", apply: p => { p.stationRadius = Math.round((p.stationRadius || 130) * 1.45); p.risk = (p.risk || 0) + 1; } }
    },
    trap_link_control_zone: {
      offense: { text: "公告板区域持续伤害提高。", apply: p => { p.zoneDamage = Math.round((p.zoneDamage || 9) * 1.35); } },
      survival: { text: "敌人进公告板区域会明显减速。", apply: p => { p.slow = Math.max(p.slow || 0, 0.45); } },
      resource: { text: "公告板区域内击杀额外掉材料。", apply: p => { p.materialBonus = (p.materialBonus || 0) + 0.2; } },
      mechanic: { text: "贴纸连线距离放宽，更容易围成阵地。", apply: p => { p.linkRadius = Math.round((p.linkRadius || 170) * 1.25); } },
      cost: { text: "贴纸持续时间缩短，但成区后伤害翻倍。", apply: p => { p.trapDuration = Math.max(4, (p.trapDuration || 9) - 2); p.zoneDamage = Math.round((p.zoneDamage || 9) * 2); } }
    },
    manual_trap_detonate: {
      offense: { text: "同步引爆范围 +25%。", apply: p => { p.explosionRadius = Math.round((p.explosionRadius || 70) * 1.25); } },
      survival: { text: "引爆会短暂推开近身敌人。", apply: p => { p.blastKnockback = 1; } },
      resource: { text: "贴纸爆炸击杀额外给材料。", apply: p => { p.materialBonus = (p.materialBonus || 0) + 0.15; } },
      mechanic: { text: "贴纸会按节奏自动连锁引爆。", apply: p => { p.chainDetonate = true; } },
      cost: { text: "爆炸伤害大幅提高，但贴纸持续时间缩短。", apply: p => { p.damage = Math.round((p.damage || 10) * 1.8); p.trapDuration = Math.max(3, (p.trapDuration || 7) - 2); } }
    },
    seeking_trap_summon: {
      offense: { text: "智能贴纸寻敌速度和伤害提高。", apply: p => { p.seekSpeed = Math.round((p.seekSpeed || 130) * 1.25); p.damage = Math.round((p.damage || 10) * 1.15); } },
      survival: { text: "智能贴纸命中后减速敌人。", apply: p => { p.slow = Math.max(p.slow || 0, 0.35); } },
      resource: { text: "智能贴纸命中有概率带回材料。", apply: p => { p.materialBonus = (p.materialBonus || 0) + 0.14; } },
      mechanic: { text: "智能贴纸命中后会弹向第二个敌人。", apply: p => { p.seekBounce = true; } },
      cost: { text: "贴纸移动更快更痛，但存在时间缩短。", apply: p => { p.seekSpeed = Math.round((p.seekSpeed || 130) * 1.55); p.damage = Math.round((p.damage || 10) * 1.35); p.trapDuration = Math.max(3, (p.trapDuration || 5) - 1.5); } }
    }
  };

  Object.assign(SLOT_RULES, {
    patrol_summon_steam: {
      offense: { text: "巡航模块喷汽伤害提高，绕身清怪更明显。", apply: p => { p.damage = Math.round((p.damage || 12) * 1.28); p.steamRadius = (p.steamRadius || 42) + 8; } },
      survival: { text: "巡航模块附带减速，贴脸怪更难追上你。", apply: p => { p.slow = Math.max(p.slow || 0, 0.28); } },
      resource: { text: "巡航模块命中后材料收益提高。", apply: p => { p.materialBonus = (p.materialBonus || 0) + 0.14; } },
      mechanic: { text: "额外生成 1 个巡航模块，保温杯开始像自动续航装置。", apply: p => { p.summonCount = (p.summonCount || 1) + 1; } },
      cost: { text: "模块持续更久、伤害更高，但蓄热间隔变慢。", apply: p => { p.summonDuration = (p.summonDuration || 5) + 2; p.damage = Math.round((p.damage || 12) * 1.35); p.cooldown = (p.cooldown || 1.2) * 1.12; } }
    },
    periodic_wave_spread: {
      offense: { text: "茶香热波半径和伤害提高，环形清场更稳定。", apply: p => { p.waveRadius = Math.round((p.waveRadius || 125) * 1.18); p.spreadDamage = Math.round((p.spreadDamage || 8) * 1.25); } },
      survival: { text: "热波附带轻微减速，给你拉开站位空间。", apply: p => { p.slow = Math.max(p.slow || 0, 0.24); } },
      resource: { text: "被茶香二次波击杀时材料收益提高。", apply: p => { p.materialBonus = (p.materialBonus || 0) + 0.14; } },
      mechanic: { text: "热波多释放 1 圈，死亡传播更容易接上。", apply: p => { p.waveCount = (p.waveCount || 1) + 1; p.teaRadius = (p.teaRadius || 96) + 18; } },
      cost: { text: "传播波更大更痛，但主波触发间隔略变慢。", apply: p => { p.waveRadius = Math.round((p.waveRadius || 125) * 1.35); p.teaDamage = Math.round((p.teaDamage || 6) * 1.7); p.cooldown = (p.cooldown || 1.3) * 1.12; } }
    },
    route_buff_trap: {
      offense: { text: "安全路线也会烫伤敌人，逃跑路线开始有输出。", apply: p => { p.damage = Math.round((p.damage || 8) * 1.35); } },
      survival: { text: "经过值班贴获得更多护盾，路线收益更清楚。", apply: p => { p.shieldGain = (p.shieldGain || 3) + 3; p.routeHeal = (p.routeHeal || 0.7) + 0.5; } },
      resource: { text: "沿安全路线击杀更容易掉材料。", apply: p => { p.materialBonus = (p.materialBonus || 0) + 0.16; } },
      mechanic: { text: "贴纸持续更久，能铺出更完整的撤退路线。", apply: p => { p.trapDuration = (p.trapDuration || 8) + 2; } },
      cost: { text: "路线护盾翻倍，但贴纸伤害下降。", apply: p => { p.shieldGain = (p.shieldGain || 3) * 2; p.damage = Math.max(3, Math.round((p.damage || 8) * 0.75)); } }
    },
    sticky_debuff_spread: {
      offense: { text: "贴纸附着伤害提高，传播前也能补刀。", apply: p => { p.damage = Math.round((p.damage || 9) * 1.3); p.spreadDamage = Math.round((p.spreadDamage || 9) * 1.18); } },
      survival: { text: "传播目标会减速，怪群扩散后更容易被风筝。", apply: p => { p.slow = Math.max(p.slow || 0, 0.3); } },
      resource: { text: "传播击杀掉材料概率提高。", apply: p => { p.materialBonus = (p.materialBonus || 0) + 0.18; } },
      mechanic: { text: "传播上限 +1，贴纸死亡链更容易连起来。", apply: p => { p.spreadLimit = (p.spreadLimit || 3) + 1; p.spreadRadius = (p.spreadRadius || 120) + 18; } },
      cost: { text: "传播半径大幅提高，但附着初伤降低。", apply: p => { p.spreadRadius = Math.round((p.spreadRadius || 120) * 1.45); p.damage = Math.max(4, Math.round((p.damage || 9) * 0.82)); } }
    }
  });

  function getSlotProgress(state) {
    if (!state.badgeDept) return 0;
    let progress = 0;
    if (state.stage && state.stage.phaseKey === "promotion") progress = state.stage.phaseStep || 1;
    else if (state.flags && state.flags.promoted) progress = 4;
    return progress;
  }

  function getOpenSlots(state) {
    const progress = getSlotProgress(state);
    return Object.keys(SLOT_DEFS).filter(slotId => progress >= SLOT_DEFS[slotId].unlock);
  }

  function getSlotUnlockLabel(slotId) {
    const def = SLOT_DEFS[slotId];
    return def ? "转正期第 " + def.unlock + " 步开放" : "后续阶段开放";
  }

  function getSlotRule(state, slotId) {
    const type = state.activeForm ? state.activeForm.mechanicType : "";
    const table = SLOT_RULES[type] || SLOT_RULES[state.activeForm && state.activeForm.formId] || null;
    return table && table[slotId] ? table[slotId] : null;
  }

  function makeUpgradeChoices(state) {
    const formType = state.activeForm ? state.activeForm.mechanicType : "";
    let weighted = UPGRADE_POOL.slice();
    if (/line|beam|pierce/.test(formType)) weighted = [UPGRADE_POOL[0], UPGRADE_POOL[1], UPGRADE_POOL[2], UPGRADE_POOL[4]];
    if (/wave|trap|zone|shield/.test(formType)) weighted = [UPGRADE_POOL[3], UPGRADE_POOL[0], UPGRADE_POOL[4], UPGRADE_POOL[5]];
    if (/charge|detonate|window/.test(formType)) weighted = [UPGRADE_POOL[0], UPGRADE_POOL[3], UPGRADE_POOL[2], UPGRADE_POOL[5]];
    const offset = (state.level - 1) % weighted.length;
    return weighted.slice(offset).concat(weighted.slice(0, offset)).slice(0, 3).map(item => ({
      id: item.id,
      title: item.title,
      effect: item.effect,
      formLine: state.activeForm ? state.activeForm.displayName + " · " + state.activeForm.short : "当前主形态"
    }));
  }

  function applyUpgrade(state, upgradeId) {
    const chosen = UPGRADE_POOL.find(item => item.id === upgradeId) || UPGRADE_POOL[0];
    chosen.apply(state);
    state.upgrades.push({ id: chosen.id, title: chosen.title, level: state.level });
  }

  function previewSlotEffect(state, slotId, action) {
    const rule = getSlotRule(state, slotId);
    const prefix = action === "augment" ? "追加后：" : "放入后：";
    if (rule) return prefix + rule.text;
    const fallback = {
      offense: "主形态伤害和触发次数提高。",
      survival: "获得护盾、减速或推开容错。",
      resource: "击杀和命中奖励更多经验/材料。",
      mechanic: "形态规则多一次关键触发。",
      cost: "高倍率强化，同时承担停火或掉血风险。"
    };
    return prefix + fallback[slotId];
  }

  function makeSlotChoices(state) {
    const open = getOpenSlots(state);
    return Object.keys(SLOT_DEFS).map(slotId => {
      const def = SLOT_DEFS[slotId];
      const card = slotCards.find(item => item.slot === slotId);
      return {
        slotId,
        cardId: card.id,
        name: def.name,
        role: def.role,
        accent: def.accent,
        unlocked: open.indexOf(slotId) >= 0,
        unlock: def.unlock,
        unlockLabel: getSlotUnlockLabel(slotId),
        current: state.slotAssignments[slotId] || null,
        replaceGain: previewSlotEffect(state, slotId, "replace"),
        augmentGain: previewSlotEffect(state, slotId, "augment"),
        cardName: card.name,
        cardPreview: previewSlotEffect(state, slotId, "replace")
      };
    });
  }

  function applySlotChoice(state, slotId, action, cardId) {
    const choice = makeSlotChoices(state).find(item => item.slotId === slotId);
    if (!choice || !choice.unlocked) return false;
    const cardName = choice.cardName || cardId || "形态强化";
    if (action === "augment" && state.slotAssignments[slotId]) {
      if (!state.slotAugments[slotId]) state.slotAugments[slotId] = [];
      state.slotAugments[slotId].push(cardName);
    } else {
      state.slotAssignments[slotId] = cardName;
    }
    if (CS.buildState) {
      CS.buildState.slotCards[slotId] = cardId || choice.cardId;
      const dept = state.badgeDept || "general";
      CS.buildState.deptCardCounts[dept] = (CS.buildState.deptCardCounts[dept] || 0) + 1;
    }
    applySlotParams(state, slotId, action);
    return true;
  }

  function applySlotParams(state, slotId, action) {
    const p = state.activeFormParams;
    const before = JSON.parse(JSON.stringify(p));
    const rule = getSlotRule(state, slotId);
    if (rule && typeof rule.apply === "function") {
      rule.apply(p, state);
    } else if (slotId === "offense") {
      p.damage = Math.round((p.damage || 10) * 1.18);
      p.amount = (p.amount || 1) + 1;
    } else if (slotId === "survival") {
      p.shield = (p.shield || 0) + 10;
      p.slow = Math.max(p.slow || 0, 0.25);
    } else if (slotId === "resource") {
      p.xpBonus = (p.xpBonus || 0) + 0.12;
      p.materialBonus = (p.materialBonus || 0) + 0.1;
    } else if (slotId === "mechanic") {
      p.extraTrigger = (p.extraTrigger || 0) + 1;
      p.trailDuration = (p.trailDuration || 0) + 1.2;
    } else if (slotId === "cost") {
      p.damage = Math.round((p.damage || 10) * 1.38);
      p.risk = (p.risk || 0) + 1;
    }
    if (action === "augment") {
      Object.keys(p).forEach(key => {
        if (typeof p[key] === "number" && typeof before[key] === "number") {
          p[key] = before[key] + (p[key] - before[key]) * 0.55;
          if (key !== "cooldown" && key !== "slow" && key.indexOf("Bonus") < 0) p[key] = Math.round(p[key]);
        }
      });
    }
  }

  const PROMOTION_RULES = {
    line_split: {
      title: "转正强化：全屏校验光束",
      text: "分裂激光成型后，偶尔扫出一条全屏校验线。",
      apply(p) {
        p.splitCount = (p.splitCount || 2) + 1;
        p.secondarySplit = true;
        p.promotionFullscreenChance = Math.max(p.promotionFullscreenChance || 0, 0.1);
      }
    },
    mark_detonate: {
      title: "转正强化：P0 扩大爆破",
      text: "P0 引爆半径扩大，并更适合处理精英目标周围的小怪。",
      apply(p) {
        p.explosionRadius = Math.round((p.explosionRadius || 58) * 1.45);
        p.explosionDamage = Math.round((p.explosionDamage || 34) * 1.25);
      }
    },
    shield_counter_line: {
      title: "转正强化：值守反刺阵",
      text: "护盾转反刺速度提高，破盾时射出更多短激光。",
      apply(p) {
        p.shieldPerHit = (p.shieldPerHit || 1.4) + 0.8;
        p.counterLines = Math.max(p.counterLines || 4, 6);
      }
    },
    line_to_wave: {
      title: "转正强化：二段扩散波",
      text: "光束终点多扩一圈，开始形成线加面的清怪节奏。",
      apply(p) {
        p.waveCount = (p.waveCount || 1) + 1;
        p.waveReturn = true;
      }
    },
    line_grid_field: {
      title: "转正强化：审批交叉网",
      text: "残留线更久，并额外生成一条交叉网格线。",
      apply(p) {
        p.trailDuration = (p.trailDuration || 3.2) + 1;
        p.gridEcho = true;
      }
    },
    patrol_summon_steam: {
      title: "转正强化：双模块恒温",
      text: "自动恒温机多一个巡航喷汽模块，自动化感更明显。",
      apply(p) {
        p.summonCount = (p.summonCount || 1) + 1;
        p.summonDuration = (p.summonDuration || 5) + 1.5;
      }
    },
    charge_release_beam: {
      title: "转正强化：沸点过载",
      text: "沸点释放更宽更痛，形成真正的蓄力爆发窗口。",
      apply(p) {
        p.releaseDamage = Math.round((p.releaseDamage || 72) * 1.35);
        p.releaseWidth = (p.releaseWidth || 22) + 8;
        p.heatMax = 120;
        p.overheatBank = true;
      }
    },
    shield_break_pulse: {
      title: "转正强化：双层暖流",
      text: "护盾破裂时连续释放两圈热浪，稳定清开贴脸压力。",
      apply(p) {
        p.pulseCount = (p.pulseCount || 1) + 1;
        p.shieldThreshold = Math.max(20, (p.shieldThreshold || 30) - 6);
      }
    },
    periodic_wave_spread: {
      title: "转正强化：茶香接力",
      text: "热波多一圈，死亡后的二次波更容易接上传播。",
      apply(p) {
        p.waveCount = (p.waveCount || 1) + 1;
        p.teaRadius = (p.teaRadius || 96) + 24;
        p.teaDamage = Math.round((p.teaDamage || 6) * 1.35);
      }
    },
    deployable_safe_station: {
      title: "转正强化：双据点茶水间",
      text: "场上可同时保留两个茶水间，站场路线更清楚。",
      apply(p) {
        p.stationLimit = (p.stationLimit || 1) + 1;
        p.stationDuration = (p.stationDuration || 7) + 2;
      }
    },
    seeking_trap_summon: {
      title: "转正强化：待办队列",
      text: "智能待办贴命中后会弹向下一个目标。",
      apply(p) {
        p.seekBounce = true;
        p.seekSpeed = Math.round((p.seekSpeed || 130) * 1.18);
      }
    },
    manual_trap_detonate: {
      title: "转正强化：节奏连爆",
      text: "同步引爆后带出更清楚的连锁爆破节奏。",
      apply(p) {
        p.chainDetonate = true;
        p.explosionRadius = (p.explosionRadius || 70) + 16;
      }
    },
    route_buff_trap: {
      title: "转正强化：完整值班路线",
      text: "安全路线持续更久，经过时护盾收益更明显。",
      apply(p) {
        p.trapDuration = (p.trapDuration || 8) + 2;
        p.shieldGain = (p.shieldGain || 3) + 4;
      }
    },
    sticky_debuff_spread: {
      title: "转正强化：传播链延长",
      text: "死亡传播多跳一次，市场贴纸能看见更长的接力链。",
      apply(p) {
        p.spreadLimit = (p.spreadLimit || 3) + 1;
        p.spreadRadius = (p.spreadRadius || 120) + 24;
      }
    },
    trap_link_control_zone: {
      title: "转正强化：公告板阵地",
      text: "贴纸连线距离放宽，公告板区伤害更稳定。",
      apply(p) {
        p.linkRadius = Math.round((p.linkRadius || 170) * 1.18);
        p.zoneDamage = Math.round((p.zoneDamage || 9) * 1.25);
      }
    }
  };

  function applyPromotion(state) {
    const type = state.activeForm ? state.activeForm.mechanicType : "";
    const rule = PROMOTION_RULES[type];
    if (!rule) return false;
    rule.apply(state.activeFormParams, state);
    state.flags.promoted = true;
    state.activeFormParams.promoted = true;
    state.promotionLog.push({
      stage: state.stage.id,
      mechanicType: type,
      title: rule.title,
      text: rule.text
    });
    state.lastRewardReason = rule.title + "：" + rule.text;
    return true;
  }

  const MASTERY_RULES = {
    line_split: {
      title: "主轴精修：分裂过载",
      text: "分裂数量和支线伤害继续提高，但仍保留攻速、范围、代价槽的成长空间。",
      apply(p) { p.splitCount = (p.splitCount || 2) + 1; p.splitDamage = (p.splitDamage || 0.42) + 0.08; p.masteryPulse = "split_overclock"; }
    },
    mark_detonate: {
      title: "主轴精修：连环 P0",
      text: "P0 光爆范围提高，并允许爆炸把标记压力传给附近目标。",
      apply(p) { p.explosionRadius = Math.round((p.explosionRadius || 58) * 1.2); p.p0Chain = true; }
    },
    shield_counter_line: {
      title: "主轴精修：反刺矩阵",
      text: "护盾反刺更容易触发，破盾时额外射出一组短激光。",
      apply(p) { p.shieldPerHit = (p.shieldPerHit || 1.4) + 0.6; p.counterLines = Math.max(p.counterLines || 4, 7); }
    },
    line_to_wave: {
      title: "主轴精修：回声扩散",
      text: "线尾波纹多一段回声，清散怪更稳定。",
      apply(p) { p.waveCount = (p.waveCount || 1) + 1; p.waveEcho = true; }
    },
    line_grid_field: {
      title: "主轴精修：审批留痕",
      text: "流程网格留场更久，交叉区伤害提高。",
      apply(p) { p.trailDuration = (p.trailDuration || 3) + 1.2; p.gridDamage = Math.round((p.gridDamage || 11) * 1.25); }
    },
    patrol_summon_steam: {
      title: "主轴精修：自动续航",
      text: "巡航模块续航更久，并更稳定地围绕角色喷汽。",
      apply(p) { p.summonDuration = (p.summonDuration || 5) + 2; p.orbitSpeed = (p.orbitSpeed || 2.2) + 0.35; }
    },
    charge_release_beam: {
      title: "主轴精修：沸点窗口",
      text: "蓄热更快，沸点释放更宽，但仍需要找准直线窗口。",
      apply(p) { p.heatRate = Math.round((p.heatRate || 24) * 1.18); p.releaseWidth = (p.releaseWidth || 22) + 8; }
    },
    shield_break_pulse: {
      title: "主轴精修：二段暖流",
      text: "护盾破裂会多放一圈热浪，容错和清场都更清楚。",
      apply(p) { p.pulseCount = (p.pulseCount || 1) + 1; p.pulseDamage = Math.round((p.pulseDamage || 34) * 1.18); }
    },
    periodic_wave_spread: {
      title: "主轴精修：茶香接力",
      text: "死亡二次波半径与伤害提高，传播链更容易看见。",
      apply(p) { p.teaRadius = (p.teaRadius || 96) + 26; p.teaDamage = Math.round((p.teaDamage || 6) * 1.45); }
    },
    deployable_safe_station: {
      title: "主轴精修：双据点轮换",
      text: "茶水间据点持续更久，站场路线更稳定。",
      apply(p) { p.stationDuration = (p.stationDuration || 7) + 2; p.stationLimit = Math.max(p.stationLimit || 1, 2); }
    },
    seeking_trap_summon: {
      title: "主轴精修：待办队列",
      text: "智能待办贴命中后会寻找下一个目标。",
      apply(p) { p.seekBounce = true; p.seekSpeed = Math.round((p.seekSpeed || 130) * 1.18); }
    },
    manual_trap_detonate: {
      title: "主轴精修：同步连爆",
      text: "功能开关贴开始形成连续爆破节奏。",
      apply(p) { p.chainDetonate = true; p.explosionRadius = (p.explosionRadius || 70) + 14; }
    },
    route_buff_trap: {
      title: "主轴精修：值班路线",
      text: "安全路线护盾更明显，撤退路线更像可规划资源。",
      apply(p) { p.shieldGain = (p.shieldGain || 3) + 4; p.trapDuration = (p.trapDuration || 8) + 1.5; }
    },
    sticky_debuff_spread: {
      title: "主轴精修：传播续写",
      text: "病毒贴纸多传播一次，怪群密集时会形成更长接力。",
      apply(p) { p.spreadLimit = (p.spreadLimit || 3) + 1; p.spreadRadius = (p.spreadRadius || 120) + 18; }
    },
    trap_link_control_zone: {
      title: "主轴精修：公告板阵地",
      text: "贴纸连线距离放宽，公告板区域伤害提高。",
      apply(p) { p.linkRadius = Math.round((p.linkRadius || 170) * 1.16); p.zoneDamage = Math.round((p.zoneDamage || 9) * 1.25); }
    }
  };

  function applyMastery(state) {
    const type = state.activeForm ? state.activeForm.mechanicType : "";
    const rule = MASTERY_RULES[type];
    if (!rule) return false;
    rule.apply(state.activeFormParams, state);
    state.flags.mastered = true;
    state.activeFormParams.mastered = true;
    state.phaseRewardLog.push({
      stage: state.stage.id,
      phase: "promoted_mastery",
      title: rule.title,
      text: rule.text
    });
    state.lastRewardReason = rule.title + "：" + rule.text + " 现在可以选择第二部门能力。";
    return true;
  }

  const SECONDARY_DEPT_LABEL = {
    tech: "技术副形态",
    product: "产品副形态",
    ops: "运营副形态",
    marketing: "市场副形态",
    general: "行政副形态"
  };

  function applyCrossDepartment(state, dept) {
    const p = state.activeFormParams || {};
    p.secondaryDept = dept;
    p.secondaryDeptName = V2.compat.deptName(dept);
    if (state.selectedWeaponId === "marker") {
      if (dept === "tech") p.crossSplit = true;
      if (dept === "product") p.crossExplode = true;
      if (dept === "ops") p.crossShield = true;
      if (dept === "marketing") p.crossWave = true;
      if (dept === "general") p.crossGrid = true;
    } else if (state.selectedWeaponId === "thermos") {
      if (dept === "tech") p.crossSteamDrone = true;
      if (dept === "product") p.crossMiniBoil = true;
      if (dept === "ops") p.crossWarmShield = true;
      if (dept === "marketing") p.crossTeaWave = true;
      if (dept === "general") p.crossSafeStation = true;
    } else if (state.selectedWeaponId === "sticky_note") {
      if (dept === "tech") p.crossSeekingNote = true;
      if (dept === "product") p.crossManualBlast = true;
      if (dept === "ops") p.crossRouteShield = true;
      if (dept === "marketing") p.crossStickySpread = true;
      if (dept === "general") p.crossBoardLink = true;
    }
    state.flags.crossDepartment = true;
    state.phaseRewardLog.push({
      stage: state.stage.id,
      phase: "cross_department",
      title: SECONDARY_DEPT_LABEL[dept] || "第二部门能力",
      text: "主武器保留当前主工牌形态，并叠加" + V2.compat.deptName(dept) + "的初级能力。"
    });
    state.lastRewardReason = "第二部门已接入：" + (SECONDARY_DEPT_LABEL[dept] || V2.compat.deptName(dept)) + "。";
    return true;
  }

  const SUPPORT_SKILLS = {
    marker: { type: "support_marker_line", label: "辅助马克笔：短贯穿线", cooldown: 3.4 },
    thermos: { type: "support_thermos_pulse", label: "辅助保温杯：小热浪", cooldown: 4.2 },
    sticky_note: { type: "support_sticky_trap", label: "辅助即时贴：延迟贴纸", cooldown: 3.8 }
  };

  function applyCrossWeapon(state, weaponId) {
    const skill = SUPPORT_SKILLS[weaponId] || { type: "support_projectile", label: "辅助技能：" + V2.compat.weaponName(weaponId), cooldown: 4.5 };
    state.supportSkill = Object.assign({ timer: 0 }, skill, { weaponId });
    state.flags.crossWeapon = true;
    state.phaseRewardLog.push({
      stage: state.stage.id,
      phase: "cross_weapon",
      title: skill.label,
      text: "副武器只保留本质技能作为辅助，主输出仍来自当前主武器形态。"
    });
    state.lastRewardReason = "跨技能学习完成：" + skill.label + "。";
    return true;
  }

  function offer(id, title, cost, impact, reason, apply) {
    return { id, title, cost, impact, reason, apply };
  }

  function formSpecificOffers(state) {
    const p = state.activeFormParams || {};
    const type = state.activeForm ? state.activeForm.mechanicType : "";
    const baseCost = 7 + state.stage.id;
    const common = [
      offer("shop_damage", "升级主形态伤害", baseCost + 2, "伤害 " + Math.round(p.damage || 0) + " → " + Math.round((p.damage || 10) * 1.16), "直接提高当前打法的清怪速度。", s => { s.activeFormParams.damage = Math.round((s.activeFormParams.damage || 10) * 1.16); }),
      offer("shop_cooldown", "缩短触发间隔", baseCost + 4, "间隔 " + (p.cooldown || 1.4).toFixed(2) + "s → " + Math.max(0.35, (p.cooldown || 1.4) * 0.9).toFixed(2) + "s", "更频繁地看到当前形态特效。", s => { s.activeFormParams.cooldown = Math.max(0.35, (s.activeFormParams.cooldown || 1.4) * 0.9); }),
      offer("shop_recover", "补一层容错", baseCost + 3, "回复 18 血，并给主形态少量护盾参数", "让下一关有空间继续观察 Build 反馈。", s => { s.hp = Math.min(s.maxHp, s.hp + 18); s.activeFormParams.shield = (s.activeFormParams.shield || 0) + 6; })
    ];
    const special = {
      patrol_summon_steam: [
        offer("shop_steam_module", "增加巡航热饮模块", baseCost + 3, "巡航模块 +1", "让保温杯的自动化母题真正出现第二个喷汽点。", s => { s.activeFormParams.summonCount = (s.activeFormParams.summonCount || 1) + 1; }),
        offer("shop_steam_duration", "延长模块续航", baseCost + 2, "持续时间 +2s", "模块留场更久，玩家能围绕它走位。", s => { s.activeFormParams.summonDuration = (s.activeFormParams.summonDuration || 5) + 2; })
      ],
      shield_break_pulse: [
        offer("shop_warm_shield", "加厚暖流护盾", baseCost + 2, "护盾积累 +6", "更快看到破盾热浪反击，而不是只靠文字理解。", s => { s.activeFormParams.shieldGain = (s.activeFormParams.shieldGain || 8) + 6; }),
        offer("shop_warm_pulse", "扩大破盾热浪", baseCost + 3, "热浪半径 +28", "反刺护盾破裂时能扫开更多贴脸怪。", s => { s.activeFormParams.pulseRadius = (s.activeFormParams.pulseRadius || 120) + 28; })
      ],
      periodic_wave_spread: [
        offer("shop_tea_wave", "多一圈茶香热波", baseCost + 3, "热波 +1 圈", "让市场保温杯更像一圈圈扩散的广播。", s => { s.activeFormParams.waveCount = (s.activeFormParams.waveCount || 1) + 1; }),
        offer("shop_tea_spread", "增强死亡二次波", baseCost + 2, "二次波伤害 +40%", "击杀后的小波纹会更容易接力。", s => { s.activeFormParams.teaDamage = Math.round((s.activeFormParams.teaDamage || 6) * 1.4); })
      ],
      deployable_safe_station: [
        offer("shop_station_limit", "多放一个茶水间据点", baseCost + 4, "据点上限 +1", "行政保温杯开始形成可选择的站场区域。", s => { s.activeFormParams.stationLimit = (s.activeFormParams.stationLimit || 1) + 1; }),
        offer("shop_station_heal", "增强据点补给", baseCost + 2, "补给 +1", "站在茶水间附近会明显更稳。", s => { s.activeFormParams.heal = (s.activeFormParams.heal || 1) + 1; })
      ],
      route_buff_trap: [
        offer("shop_route_shield", "强化值班安全路线", baseCost + 2, "经过护盾 +3", "让玩家沿着贴纸撤退时能明显多撑一口气。", s => { s.activeFormParams.shieldGain = (s.activeFormParams.shieldGain || 3) + 3; }),
        offer("shop_route_duration", "延长路线贴纸", baseCost + 2, "持续时间 +2s", "路线更容易连成一段，而不是刚放就消失。", s => { s.activeFormParams.trapDuration = (s.activeFormParams.trapDuration || 8) + 2; })
      ],
      sticky_debuff_spread: [
        offer("shop_sticky_spread", "扩大传播半径", baseCost + 2, "传播半径 +24", "让市场即时贴的死亡接力更容易被看见。", s => { s.activeFormParams.spreadRadius = (s.activeFormParams.spreadRadius || 120) + 24; }),
        offer("shop_sticky_limit", "增加传播次数", baseCost + 3, "传播上限 +1", "怪群密集时更容易出现连锁贴纸。", s => { s.activeFormParams.spreadLimit = (s.activeFormParams.spreadLimit || 3) + 1; })
      ],
      manual_trap_detonate: [
        offer("shop_manual_blast", "扩大同步引爆", baseCost + 2, "爆炸半径 +18", "让产品即时贴的二次触发更有爆点。", s => { s.activeFormParams.explosionRadius = (s.activeFormParams.explosionRadius || 70) + 18; }),
        offer("shop_manual_chain", "开启节奏连爆", baseCost + 4, "贴纸可连锁引爆", "布好贴纸后会出现更清楚的爆破节奏。", s => { s.activeFormParams.chainDetonate = true; })
      ],
      seeking_trap_summon: [
        offer("shop_seek_speed", "加快待办贴追踪", baseCost + 2, "寻敌速度 +25%", "智能贴纸不再像原地陷阱，会主动追上怪。", s => { s.activeFormParams.seekSpeed = Math.round((s.activeFormParams.seekSpeed || 130) * 1.25); }),
        offer("shop_seek_bounce", "命中后跳向下个目标", baseCost + 4, "命中弹跳 +1", "技术即时贴开始像自动待办队列。", s => { s.activeFormParams.seekBounce = true; })
      ],
      line_split: [
        offer("shop_split_count", "增加分裂支线", baseCost + 3, "分裂支线 +1", "让多线程荧光笔更像激光群。", s => { s.activeFormParams.splitCount = (s.activeFormParams.splitCount || 1) + 1; }),
        offer("shop_split_damage", "强化支线伤害", baseCost + 2, "支线伤害比例提高", "分裂不再只是刮痧。", s => { s.activeFormParams.splitDamage = (s.activeFormParams.splitDamage || 0.42) + 0.12; })
      ],
      mark_detonate: [
        offer("shop_p0_radius", "扩大 P0 光爆", baseCost + 2, "爆炸半径 +18", "让集火目标顺便清掉周围敌人。", s => { s.activeFormParams.explosionRadius = (s.activeFormParams.explosionRadius || 58) + 18; }),
        offer("shop_p0_window", "延长标记窗口", baseCost + 1, "标记窗口 +0.8s", "更容易完成二次命中。", s => { s.activeFormParams.markWindow = (s.activeFormParams.markWindow || 3) + 0.8; })
      ],
      line_to_wave: [
        offer("shop_wave_count", "多一圈扩散波", baseCost + 3, "波纹数 +1", "线尾扩散更明显。", s => { s.activeFormParams.waveCount = (s.activeFormParams.waveCount || 1) + 1; }),
        offer("shop_wave_radius", "扩大扩散半径", baseCost + 2, "波纹半径 +22", "更适合处理散开的敌群。", s => { s.activeFormParams.waveRadius = (s.activeFormParams.waveRadius || 96) + 22; })
      ],
      charge_release_beam: [
        offer("shop_heat_rate", "加快蓄热", baseCost + 2, "蓄热速度 +20%", "更快进入沸点释放。", s => { s.activeFormParams.heatRate = Math.round((s.activeFormParams.heatRate || 20) * 1.2); }),
        offer("shop_release_width", "加宽蒸汽柱", baseCost + 3, "蒸汽柱宽度 +10", "释放时更容易扫中一排敌人。", s => { s.activeFormParams.releaseWidth = (s.activeFormParams.releaseWidth || 20) + 10; })
      ],
      trap_link_control_zone: [
        offer("shop_link_radius", "放宽贴纸连线", baseCost + 2, "连线距离 +20%", "更容易围出公告板阵地。", s => { s.activeFormParams.linkRadius = Math.round((s.activeFormParams.linkRadius || 170) * 1.2); }),
        offer("shop_zone_damage", "提高阵地区域伤害", baseCost + 2, "区域伤害 +30%", "让公告板阵地真的能清怪。", s => { s.activeFormParams.zoneDamage = Math.round((s.activeFormParams.zoneDamage || 9) * 1.3); })
      ]
    };
    return (special[type] || []).concat(common);
  }

  function makeShopOffers(state, rerolled) {
    let offers = formSpecificOffers(state);
    if (rerolled) offers = offers.slice().reverse();
    return offers.slice(0, 3);
  }

  function buyOffer(state, offerId) {
    const offer = (state.shopOffers || []).find(item => item.id === offerId);
    if (!offer || state.materials < offer.cost) return false;
    state.materials -= offer.cost;
    offer.apply(state);
    state.supportItems.push({ id: offer.id, name: offer.title, stage: state.stage.id });
    state.shopOffers = makeShopOffers(state, false);
    return true;
  }

  V2.progression = {
    SLOT_DEFS,
    getSlotProgress,
    getOpenSlots,
    getSlotUnlockLabel,
    makeUpgradeChoices,
    applyUpgrade,
    makeSlotChoices,
    applySlotChoice,
    applyPromotion,
    applyMastery,
    applyCrossDepartment,
    applyCrossWeapon,
    makeShopOffers,
    buyOffer,
    previewSlotEffect
  };
})();
