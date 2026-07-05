// ================================================================
// src/v2/data/weapon-forms.js
// Single source for V2 weapon x badge combat forms.
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});
  const V2 = CS.V2 || (CS.V2 = {});

  const deptOrder = ["tech", "product", "ops", "marketing", "general"];

  function form(weaponId, dept, data) {
    return Object.assign({
      weaponId,
      badgeDept: dept,
      formId: weaponId + "_" + dept,
      displayName: "",
      combatVerb: "",
      visualStyle: "蓝色系办公武器特效",
      mechanicType: "",
      short: "",
      weakness: "",
      baseParams: {},
      scalingHooks: {},
      ultimateHook: null,
      bestMatch: false
    }, data);
  }

  function five(weaponId, rows) {
    const output = {};
    deptOrder.forEach(function (dept) {
      output[dept] = form(weaponId, dept, rows[dept]);
    });
    return output;
  }

  function basicParams(extra) {
    return Object.assign({ damage: 12, cooldown: 1.4, range: 320 }, extra || {});
  }

  V2.weaponBadgeForms = {
    marker: five("marker", {
      tech: {
        displayName: "多线程荧光笔",
        combatVerb: "主光束贯穿敌群，命中后分裂短支线。",
        visualStyle: "蓝白主激光 + 青色短支线",
        mechanicType: "line_split",
        short: "贯穿后分裂",
        weakness: "怪少时分裂收益低。",
        baseParams: basicParams({ damage: 24, cooldown: 1.42, range: 760, pierce: 5, splitCount: 2, splitDamage: 0.42, width: 8 }),
        scalingHooks: { offense: "分裂数量 +1", mechanic: "支线可二次分裂", cost: "分裂频率翻倍但短暂停火" },
        ultimateHook: { chance: 0.1, label: "全屏校验光束" },
        bestMatch: true
      },
      product: {
        displayName: "P0 标记笔",
        combatVerb: "首次命中高价值目标挂标记，再次命中引爆。",
        visualStyle: "深蓝激光 + 暖白光爆",
        mechanicType: "mark_detonate",
        short: "标记后光爆",
        weakness: "依赖集火，高密小怪清场较慢。",
        baseParams: basicParams({ damage: 26, cooldown: 1.48, range: 760, pierce: 4, markWindow: 3.2, explosionRadius: 58, explosionDamage: 34, width: 8 }),
        scalingHooks: { offense: "爆炸半径 +20%", mechanic: "标记窗口 +1 秒", cost: "爆炸范围翻倍但触发后停火" },
        ultimateHook: { chance: 0.12, label: "P0 扩大爆破" },
        bestMatch: true
      },
      ops: {
        displayName: "应急划线笔",
        combatVerb: "命中积攒应急盾，护盾破裂时反射短激光。",
        visualStyle: "蓝绿激光 + 护盾光刺",
        mechanicType: "shield_counter_line",
        short: "命中攒盾，破盾反刺",
        weakness: "主动输出偏弱。",
        baseParams: basicParams({ damage: 20, cooldown: 1.55, range: 720, pierce: 4, shieldPerHit: 1.4, counterDamage: 28, width: 8 }),
        scalingHooks: { survival: "护盾转化提高", mechanic: "反刺数量 +1", cost: "护盾反刺更强但护盾更薄" },
        ultimateHook: { chance: 0.1, label: "值守反刺阵" }
      },
      marketing: {
        displayName: "舆论扩散笔",
        combatVerb: "光束终点释放环形扩散波，打出线 + 面混合伤害。",
        visualStyle: "蓝紫激光 + 环形波纹",
        mechanicType: "line_to_wave",
        short: "终点扩散波",
        weakness: "单体伤害偏低。",
        baseParams: basicParams({ damage: 22, cooldown: 1.5, range: 700, pierce: 4, waveRadius: 96, waveDamage: 15, width: 8 }),
        scalingHooks: { offense: "波纹数 +1", mechanic: "波纹可回弹", cost: "波纹变大但中心伤害降低" },
        ultimateHook: { chance: 0.1, label: "全员扩散" },
        bestMatch: true
      },
      general: {
        displayName: "流程网格笔",
        combatVerb: "光束路径残留，多条残留线交叉生成定身网格。",
        visualStyle: "蓝金激光 + 审批网格",
        mechanicType: "line_grid_field",
        short: "残留交叉成网",
        weakness: "需要走位规划，即时清怪弱。",
        baseParams: basicParams({ damage: 19, cooldown: 1.58, range: 720, pierce: 4, trailDuration: 3.2, gridDamage: 11, width: 8 }),
        scalingHooks: { resource: "网格命中掉材料概率提高", mechanic: "残留时间 +1 秒", cost: "网格密度提高但主线伤害降低" },
        ultimateHook: { chance: 0.1, label: "流程封锁区" }
      }
    }),

    thermos: five("thermos", {
      tech: {
        displayName: "自动恒温机",
        combatVerb: "热量满后生成巡航热饮模块，自动喷出短蒸汽。",
        mechanicType: "patrol_summon_steam",
        short: "巡航模块",
        weakness: "模块路径不完全可控。",
        baseParams: basicParams({ damage: 12, cooldown: 1.2, heatRate: 18, steamRange: 220, summonDuration: 5 })
      },
      product: {
        displayName: "沸点爆发杯",
        combatVerb: "积热到沸点后释放高伤蒸汽柱，之后进入空窗。",
        visualStyle: "蓝白蒸汽柱 + 暖黄沸点芯",
        mechanicType: "charge_release_beam",
        short: "蓄热后爆发",
        weakness: "释放窗口很重要，空窗危险。",
        baseParams: basicParams({ damage: 18, cooldown: 1.0, heatRate: 24, releaseDamage: 72, releaseRange: 420, releaseWidth: 22 }),
        bestMatch: true
      },
      ops: {
        displayName: "暖流护体杯",
        combatVerb: "生成暖流护盾，破裂时释放环形热浪反击。",
        visualStyle: "蓝绿护盾 + 环形热浪",
        mechanicType: "shield_break_pulse",
        short: "护盾破裂反击",
        weakness: "主动清怪弱。",
        baseParams: basicParams({ damage: 11, cooldown: 1.2, shieldGain: 8, pulseDamage: 34, pulseRadius: 120 })
      },
      marketing: {
        displayName: "茶香广播杯",
        combatVerb: "周期释放环形茶香热波，死亡后触发低伤二次波。",
        mechanicType: "periodic_wave_spread",
        short: "周期热波传播",
        weakness: "传播依赖击杀。",
        baseParams: basicParams({ damage: 10, cooldown: 1.3, waveRadius: 125, spreadDamage: 8 })
      },
      general: {
        displayName: "茶水间据点",
        combatVerb: "放置固定茶水间，提供补给并减速敌人。",
        mechanicType: "deployable_safe_station",
        short: "固定补给区",
        weakness: "离开据点后收益下降。",
        baseParams: basicParams({ damage: 8, cooldown: 1.4, stationRadius: 130, slow: 0.35, heal: 1 })
      }
    }),

    sticky_note: five("sticky_note", {
      tech: {
        displayName: "智能待办贴",
        combatVerb: "贴纸变成会滑向敌人的小待办单位。",
        mechanicType: "seeking_trap_summon",
        short: "自动寻敌贴",
        weakness: "目标选择不可控。",
        baseParams: basicParams({ damage: 10, cooldown: 1.35, trapDuration: 5, seekSpeed: 130 })
      },
      product: {
        displayName: "功能开关贴",
        combatVerb: "贴纸可被二次触发，同屏贴纸同步引爆。",
        mechanicType: "manual_trap_detonate",
        short: "同步引爆",
        weakness: "未布好时爆发低。",
        baseParams: basicParams({ damage: 13, cooldown: 1.45, trapDuration: 7, explosionRadius: 70 })
      },
      ops: {
        displayName: "值班提醒贴",
        combatVerb: "贴纸铺成安全路线，玩家经过得护盾，敌人经过减速。",
        mechanicType: "route_buff_trap",
        short: "安全路线",
        weakness: "路线外收益低。",
        baseParams: basicParams({ damage: 8, cooldown: 1.25, trapDuration: 8, shieldGain: 3, slow: 0.35 })
      },
      marketing: {
        displayName: "病毒传播贴",
        combatVerb: "贴纸附着敌人，敌人死亡后传播给附近目标。",
        mechanicType: "sticky_debuff_spread",
        short: "死亡传播",
        weakness: "对单体弱。",
        baseParams: basicParams({ damage: 9, cooldown: 1.3, trapDuration: 6, spreadRadius: 120, spreadLimit: 3 })
      },
      general: {
        displayName: "公告板阵地即时贴",
        combatVerb: "多贴连线，三张围成公告板区域，区域内敌人受规则限制。",
        visualStyle: "蓝金贴纸连线区",
        mechanicType: "trap_link_control_zone",
        short: "贴纸连线阵地",
        weakness: "布阵门槛高。",
        baseParams: basicParams({ damage: 11, cooldown: 1.4, trapDuration: 9, linkRadius: 170, zoneDamage: 9 }),
        bestMatch: true
      }
    })
  };

  const compactProfiles = {
    coffee: {
      tech: ["自动续杯系统", "hit_count_summon", "高频命中召唤短时咖啡无人机。", true],
      product: ["三倍浓缩杯", "stack_detonate", "同一敌人叠满咖啡因后过载爆开。"],
      ops: ["热饮护胃杯", "orbit_consumable_shield", "命中积攒暖意，满值生成护盾球。"],
      marketing: ["香气传染杯", "debuff_spread_on_death", "带香气敌人死亡时传播。"],
      general: ["定时滤滴杯", "path_field_zone", "在玩家路径上周期留下滤滴安全区。"]
    },
    keyboard: {
      tech: ["宏键连打键盘", "combo_repeat", "每数次挥击自动追加副挥击。"],
      product: ["回车爆键键盘", "charge_next_attack", "挥击积槽，满槽后下一击重击。"],
      ops: ["值守盾反键盘", "shield_counter", "防守窗口内受到近身碰撞会格挡反击。", true],
      marketing: ["热词连播键盘", "hit_count_wave_amp", "命中越多敌人，下次挥击范围越大。"],
      general: ["快捷键封锁键盘", "mark_stun_followup", "挥击挂标记，后续挥击触发停顿。"]
    },
    stapler: {
      tech: ["电动连钉匣", "magazine_burst_reload", "弹匣打空后下一轮射速提升。"],
      product: ["爆钉装订机", "bind_damage_threshold_detonate", "主钉装订，累计伤害后爆开。"],
      ops: ["护栏钉线机", "barrier_slow_line", "钉幕落地形成减速护栏线。"],
      marketing: ["传单反弹钉", "projectile_bounce_scatter", "钉子命中后反弹并散出纸片。"],
      general: ["归档封条订书机", "anchor_link_lockline", "钉点连成封锁线，闭合成归档区。", true]
    },
    headphones: {
      tech: ["蓝牙音源组网", "temporary_aura_summon", "召唤短时蓝牙音源释放小声场。"],
      product: ["节拍重低音耳机", "timed_pulse_burst", "声场按节拍释放高冲击重低音。"],
      ops: ["主动降噪盾", "orbit_consumable_shield", "降噪球抵伤并减速敌人。"],
      marketing: ["广播接力耳机", "aura_rebroadcast", "声波命中敌人后延迟二次播放。", true],
      general: ["静音会议室耳机", "silence_zone_economy", "生成静音区并降低敌人攻击频率。"]
    },
    report: {
      tech: ["自动刷新报表", "orbit_consumable_regen", "报表页命中消耗，击杀或计时补页。"],
      product: ["KPI 审判报表", "target_window_damage_settle", "窗口内记录伤害并结算爆发。", true],
      ops: ["仪表盘护页", "orbit_attack_defense_shared", "报表页既攻击也抵伤。"],
      marketing: ["全员周报广播", "global_periodic_status", "周期全屏翻页挂状态。"],
      general: ["归档目录树", "node_link_rule_zone", "报表页落地成为连线节点。"]
    },
    shredder: {
      tech: ["自动裁纸阵列", "bouncing_slash_line", "切纸线在敌人间弹射后消失。"],
      product: ["提案粉碎程序", "single_target_channel_execute", "锁定高价值目标形成粉碎通道。"],
      ops: ["安全粉碎口", "directional_guard_counter", "正面防御通道受压反击。"],
      marketing: ["纸屑龙卷碎纸机", "kill_meter_vortex_summon", "积累纸屑值，满值召唤牵引龙卷。", true],
      general: ["机密销毁箱", "death_fragment_barrier_resource", "击杀生成碎片并连成封锁条。"]
    },
    calculator: {
      tech: ["递归公式机", "recursive_chain", "数字弹复制小数字继续跳点。"],
      product: ["利润爆点器", "value_target_profit_detonate", "高价值目标窗口结束后爆发。"],
      ops: ["收支平衡表", "mode_alternating_projectile", "数字弹在伤害和回血之间切换。"],
      marketing: ["投放预测盘", "prediction_path_chain", "预显示路径后释放数字弹。"],
      general: ["审计总账计算器", "ledger_death_settlement", "挂账敌人死亡时结算并转移。", true]
    }
  };

  Object.keys(compactProfiles).forEach(function (weaponId) {
    V2.weaponBadgeForms[weaponId] = {};
    Object.keys(compactProfiles[weaponId]).forEach(function (dept) {
      const row = compactProfiles[weaponId][dept];
      V2.weaponBadgeForms[weaponId][dept] = form(weaponId, dept, {
        displayName: row[0],
        mechanicType: row[1],
        combatVerb: row[2],
        short: row[2],
        weakness: "完整特效会在该武器垂直切片时展开；当前先走通框架。",
        baseParams: basicParams({ damage: 12, cooldown: 1.4, range: 340 }),
        bestMatch: !!row[3]
      });
    });
  });

  V2.getWeaponForm = function getWeaponForm(weaponId, dept) {
    const normalizedWeapon = CS.V2.compat && CS.V2.compat.normalizeWeaponId
      ? CS.V2.compat.normalizeWeaponId(weaponId)
      : weaponId;
    const normalizedDept = dept || "general";
    const forms = V2.weaponBadgeForms[normalizedWeapon] || V2.weaponBadgeForms.marker;
    return forms[normalizedDept] || forms.general || forms.product || forms.tech;
  };
})();
