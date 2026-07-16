// ================================================================
// Demo V2 Phase B contract.
// Three representative badge identities + six lightweight modules.
// No Demo V1 armory, slots, materials, or secondary departments.
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});
  const V2 = CS.V2 || (CS.V2 = {});

  const waves = [
    { id: "queue", label: "队列波", start: 0, end: 45, cadence: 2.55, batchSize: 7, hint: "先读懂基础武器，再观察工牌如何改写同一批队列目标。" },
    { id: "cluster", label: "团块波", start: 45, end: 90, cadence: 2.7, batchSize: 8, hint: "第一次模块立即作用；看画面是否出现肉眼可见的膨胀。" },
    { id: "pursuit", label: "追逐波", start: 90, end: 135, cadence: 2.75, batchSize: 8, hint: "第二个模块补出组合关系，同时保留武器的走位要求。" },
    { id: "review", label: "混合评审波", start: 135, end: 180.1, cadence: 2.85, batchSize: 9, hint: "第三次轻选择后进入失控验证：强，但不能抹平武器差异。" }
  ];

  const modules = {
    copy: {
      id: "copy", name: "复写", family: "数量", partner: "forward",
      intent: "增加同步出口，让同一次工作被并行处理。",
      weapon: {
        marker: "解锁完整平行主线；每级再增加 1 条，不产生原生分叉。",
        thermos: "解锁独立偏转蒸汽出口；每级再增加 1 个出口。",
        sticky_note: "解锁同步落点；每级每轮再多布置 1 个节点。"
      }
    },
    archive: {
      id: "archive", name: "留档", family: "留场", partner: "merge",
      intent: "让一次攻击在场上留下更久的工作痕迹。",
      weapon: {
        marker: "解锁宽幅伤害墨迹；每级让墨迹更宽、更久、伤害更高。",
        thermos: "解锁扇面末端冷凝区；每级扩大区域并延长持续时间。",
        sticky_note: "节点过期后生成归档影印节点；每级延长影印并提高数量。"
      }
    },
    forward: {
      id: "forward", name: "转发", family: "接力", partner: "copy",
      intent: "让一次结算继续寻找下一批目标。",
      weapon: {
        marker: "解锁二代接力线；每级让每个入口多转发 1 个新目标。",
        thermos: "击破目标后解锁转发热浪；每级追加 1 圈传播波。",
        sticky_note: "公告板闭合后解锁接力节点；每级多补发 1 个。"
      }
    },
    expedite: {
      id: "expedite", name: "加急", family: "频率", partner: "overdraft",
      intent: "缩短流程间隔，让核心循环更快重启。",
      weapon: {
        marker: "解锁周期性加急重划；每级让重划触发更频繁、更强。",
        thermos: "解锁加急补喷扇面；每级缩短触发间隔并增强补喷。",
        sticky_note: "解锁自动加急批注；每级更频繁钉住附近目标。"
      }
    },
    merge: {
      id: "merge", name: "合并", family: "规模", partner: "archive",
      intent: "把多个工作结果汇成更大的结算面。",
      weapon: {
        marker: "贯穿多人后解锁汇总爆点；每级扩大爆点并提高结算。",
        thermos: "沸点释放时解锁前端高压汇流；每级追加 1 次汇流脉冲。",
        sticky_note: "公告板闭合时解锁中心汇总脉冲；每级追加 1 次脉冲。"
      }
    },
    overdraft: {
      id: "overdraft", name: "透支", family: "风险", partner: "expedite",
      intent: "换取一轮夸张爆发，但制造可感知的停工空窗。",
      weapon: {
        marker: "周期解锁多向透支划线；每级增加爆发线，但停笔更久。",
        thermos: "沸点时解锁反向过压热浪；每级多 1 圈，但空窗更长。",
        sticky_note: "节点过期时解锁透支爆破；每级扩大爆破，但节点寿命更短。"
      }
    }
  };

  const representative = { marker: "tech", thermos: "product", sticky_note: "general" };
  const comboEffects = {
    "copy+forward": {
      marker: "平行复写线的命中点也成为转发入口，新增短接力线。",
      thermos: "多出口扇面制造更多击破点，每个击破点继续传播热浪。",
      sticky_note: "同步节点更快闭合公告板，闭合后再补发接力节点。"
    },
    "archive+merge": {
      marker: "墨迹同时变宽、变久，形成真正可站场的伤害走廊。",
      thermos: "更宽的蒸汽区域停留更久，近身控制带明显扩张。",
      sticky_note: "更大的公告板保留更久，阵地控制从点变成片。"
    },
    "expedite+overdraft": {
      marker: "更快连续划线换取周期性停笔，爆发和空窗交替出现。",
      thermos: "更快到达沸点，但强化释放后必须承受更长冷却。",
      sticky_note: "节点高速铺开并强化结算，但会更快过期，必须持续布阵。"
    }
  };
  const identityOverrides = {
    marker: { damage: 22, cooldown: 1.05, range: 760, pierce: 6, width: 9, splitCount: 1, splitRange: 230, splitPierce: 2, splitDamage: 0.48 },
    thermos: { damage: 18, cooldown: 0.95, heatRate: 25, heatMax: 100, steamRange: 235, steamWidth: 210, steamDuration: 0.95, steamTickEvery: 0.27, steamTickDamage: 4.5, steamSlow: 0.66, releaseRange: 315, releaseWidth: 320, releaseDuration: 1.35, releaseTickEvery: 0.24, releaseTickDamage: 12.5, releaseSlow: 0.8, releaseLockoutDuration: 1.0, demoV2SteamFan: true },
    sticky_note: { damage: 12, cooldown: 1.02, trapDuration: 9, trapRadius: 30, triggerRadius: 64, linkRadius: 175, zoneDamage: 10, slow: 0.34 }
  };

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  function moduleLevel(state, id) {
    return state.demoV2 && state.demoV2.modules ? (state.demoV2.modules[id] || 0) : 0;
  }

  function comboEffect(state, id, partner) {
    const key = [id, partner].sort().join("+");
    const row = comboEffects[key];
    return row ? row[state.selectedWeaponId] : "";
  }

  function rebuildParams(state) {
    const weaponId = state.selectedWeaponId;
    const form = V2.getWeaponForm(weaponId, representative[weaponId]);
    const p = Object.assign({ damage: 12, cooldown: 1.4, range: 320, pierce: 0, area: 1, amount: 1, shield: 0 }, clone(form.baseParams || {}), clone(identityOverrides[weaponId] || {}));
    const copy = moduleLevel(state, "copy");
    const archive = moduleLevel(state, "archive");
    const forward = moduleLevel(state, "forward");
    const expedite = moduleLevel(state, "expedite");
    const merge = moduleLevel(state, "merge");
    const overdraft = moduleLevel(state, "overdraft");

    p.cooldown = Math.max(0.45, p.cooldown * Math.pow(0.84, expedite));
    p.demoV2Overdraft = overdraft;
    p.demoV2OverdraftEvery = overdraft ? Math.max(3, 5 - overdraft) : 0;
    p.demoV2OverdraftPause = overdraft ? 0.48 + overdraft * 0.16 : 0;

    if (weaponId === "marker") {
      p.demoV2ParallelLines = copy;
      p.demoV2ParallelSpacing = 34;
      p.demoV2ParallelDamageScale = 0.82 + copy * 0.06;
      p.secondarySplit = forward > 0;
      p.secondarySplitRange = 175 + forward * 30;
      p.secondarySplitDamage = 0.34 + forward * 0.08;
      p.secondarySplitPierce = 1 + Math.floor(forward / 2);
      p.secondarySplitCount = forward;
      p.demoV2TrailDuration = archive ? 1.6 + archive * 0.8 : 0;
      p.demoV2TrailDamage = archive ? 7.5 + archive * 3 : 0;
      p.width += merge * 3;
      p.pierce += merge;
      p.splitDamage += merge * 0.08 + overdraft * 0.1;
      p.demoV2TrailWidth = p.demoV2TrailDuration ? Math.max(16, p.width * (1.7 + merge * 0.15)) : 0;
      p.demoV2MarkerExpedite = expedite;
      p.demoV2MarkerExpediteEvery = expedite ? Math.max(2, 5 - expedite) : 0;
      p.demoV2MarkerMerge = merge;
      p.demoV2MarkerOverdraft = overdraft;
      p.demoV2MarkerOverdraftLines = overdraft ? overdraft + 1 : 0;
    } else if (weaponId === "thermos") {
      p.demoV2FanCount = 1 + copy;
      p.demoV2ForwardHeatwave = forward;
      p.steamDuration += archive * 0.5;
      p.releaseDuration += archive * 0.65;
      p.heatRate += expedite * 6;
      p.steamWidth += merge * 55;
      p.releaseWidth += merge * 70 + overdraft * 45;
      p.steamTickDamage += merge * 1.6;
      p.releaseTickDamage += merge * 3 + overdraft * 5;
      p.releaseLockoutDuration += overdraft * 0.42;
      p.demoV2ThermosArchive = archive;
      p.demoV2ThermosExpedite = expedite;
      p.demoV2ThermosExpediteEvery = expedite ? Math.max(2, 5 - expedite) : 0;
      p.demoV2ThermosMerge = merge;
      p.demoV2ThermosOverdraft = overdraft;
    } else if (weaponId === "sticky_note") {
      p.demoV2StickyCopies = copy;
      p.demoV2StickyForward = forward;
      p.trapDuration += archive * 2.4;
      p.linkRadius += merge * 38;
      p.zoneDamage += merge * 3.5 + overdraft * 4;
      p.trapRadius += merge * 5;
      p.armDelay = Math.max(0.08, 0.3 - expedite * 0.07);
      if (overdraft) p.trapDuration *= Math.max(0.48, 0.78 - overdraft * 0.1);
      p.demoV2StickyArchive = archive;
      p.demoV2StickyExpedite = expedite;
      p.demoV2StickyExpediteEvery = expedite ? Math.max(2, 5 - expedite) : 0;
      p.demoV2StickyMerge = merge;
      p.demoV2StickyOverdraft = overdraft;
    }
    state.activeFormParams = p;
  }

  function applyIdentity(state) {
    const dept = representative[state.selectedWeaponId];
    const form = V2.getWeaponForm(state.selectedWeaponId, dept);
    state.badgeDept = dept;
    state.flags.badgeSeen = true;
    state.activeForm = clone(form);
    state.activeForm.displayName = "阶段 B · " + form.displayName;
    state.activeForm.short = "代表工牌已定型 · " + form.short;
    rebuildParams(state);
    state.demoV2.identityApplied = true;
    state.demoV2.identityAt = state.demoV2.elapsed;
    state.stage.note = V2.compat.deptName(dept) + "工牌已定型：" + form.combatVerb;
  }

  function makeChoices(state) {
    const round = state.demoV2.choiceIndex || 0;
    let ids;
    if (round === 0) ids = ["copy", "archive", "expedite"];
    else if (round === 1) ids = ["forward", "merge", "overdraft"];
    else {
      const first = state.demoV2.moduleOrder[0] || "copy";
      const partner = modules[first].partner;
      ids = [partner, first, first === "copy" ? "merge" : "forward"];
      ids = ids.filter(function (id, index) { return ids.indexOf(id) === index; });
      ["copy", "archive", "forward", "expedite", "merge", "overdraft"].some(function (id) {
        if (ids.length >= 3) return true;
        if (ids.indexOf(id) < 0) ids.push(id);
        return false;
      });
    }
    return ids.map(function (id) {
      const def = modules[id];
      const partnerOwned = moduleLevel(state, def.partner) > 0;
      return {
        id: def.id,
        name: def.name,
        family: def.family,
        level: moduleLevel(state, id),
        effect: def.weapon[state.selectedWeaponId],
        intent: def.intent,
        combo: partnerOwned ? def.name + " × " + modules[def.partner].name + "：" + comboEffect(state, id, def.partner) : ""
      };
    });
  }

  function openModuleChoice(state) {
    state.previousMode = "combat";
    state.mode = "module_select";
    state.demoV2.moduleChoices = makeChoices(state);
  }

  function applyModule(state, id) {
    const def = modules[id];
    if (!def || !state.demoV2 || !state.demoV2.identityApplied) return;
    const current = moduleLevel(state, id);
    if (current >= 3) return;
    state.demoV2.modules[id] = current + 1;
    state.demoV2.moduleOrder.push(id);
    state.demoV2.choiceIndex += 1;
    state.demoV2.lastModule = id;
    state.demoV2.lastCombo = moduleLevel(state, def.partner) > 0 ? [id, def.partner] : [];
    rebuildParams(state);
    state.mode = "combat";
    state.previousMode = "combat";
    const combo = state.demoV2.lastCombo.length ? comboEffect(state, id, def.partner) : "";
    state.stage.note = def.name + "已接入：" + def.weapon[state.selectedWeaponId] + (combo ? " · 组合：" + combo : "");
  }

  function tick(state) {
    const runtime = state.demoV2;
    if (!runtime || runtime.phase !== "phase-b") return;
    runtime.elapsed = Math.max(0, 180 - state.stageTime);
    if (!runtime.identityApplied && runtime.elapsed >= 30) applyIdentity(state);
    const nextTime = [55, 100, 145][runtime.choiceIndex || 0];
    if (runtime.identityApplied && nextTime != null && runtime.elapsed >= nextTime && state.mode === "combat") openModuleChoice(state);
  }

  V2.demoV2 = Object.assign(V2.demoV2 || {}, {
    phaseB: {
      id: "phase-b",
      title: "3 分钟身份 × 模块膨胀测试",
      duration: 180,
      enemyFloor: 14,
      normalEnemyTarget: 28,
      enemyCap: 68,
      stage: {
        id: 1, phaseKey: "promotion", phaseStep: 1, phase: "Demo V2 阶段 B", name: "身份与模块压力测试",
        duration: 180, targetKills: 9999, spawnEvery: 99, enemyHp: 16, enemySpeed: 72, material: 0,
        enemyMix: [{ type: "todo", weight: 1 }], note: "30 秒自动定型代表工牌；55/100/145 秒各做一次轻模块选择。",
        threatHint: waves[0].hint, demoV2Phase: "phase-b"
      },
      waves,
      modules,
      comboEffects,
      representative,
      identityOverrides,
      applyIdentity,
      applyModule,
      makeChoices,
      tick,
      rebuildParams
    }
  });
})();
