// ================================================================
// src/data/weapons.js - V2 weapon master data
// Namespace: CS.weapons
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});

  function route(id, name, description, condition, effect, visualHint, narrativeText, priority) {
    return {
      id,
      name,
      description,
      condition: condition || null,
      priority: priority || 99,
      effect: effect || {},
      visualHint: visualHint || null,
      narrativeText: narrativeText || ""
    };
  }

  function weapon(data) {
    return Object.assign({
      tags: [],
      evolutionRoutes: [],
      baseStats: {},
      department: "general"
    }, data);
  }

  CS.weapons = {
    marker: weapon({
      id: "marker",
      name: "马克笔",
      emoji: "🖊",
      department: "product",
      tags: ["line", "pierce", "focus"],
      tagDescription: "贯穿 / 拉线 / 聚焦",
      baseStats: { damage: 24, cooldown: 1.45, range: 760, pierce: 4, width: 8 },
      description: "长射程贯穿光线。核心玩法是走位拉直线，让敌人排成一列被穿透。",
      motif: "画线分裂",
      formTopology: "line_pierce",
      evolutionRoutes: [
        route("marker_tech_split", "多线程荧光笔", "主光束命中后分裂短支线。", { sameDept: { dept: "tech", minCards: 2 } }, { splitCount: 1 }, "laser_split", "把一条线养成多线程光束。", 1),
        route("marker_product_p0", "P0 标记笔", "高价值目标被二次命中后触发光爆。", { sameDept: { dept: "product", minCards: 2 } }, { markDetonate: true }, "p0_blast", "先标 P0，再让它炸。", 2),
        route("marker_ops_counter", "应急划线笔", "命中积攒护盾，护盾破裂时反射短激光。", { sameDept: { dept: "ops", minCards: 2 } }, { shieldCounterLine: true }, "shield_line", "把承压变成反射线。", 3),
        route("marker_marketing_wave", "舆论扩散笔", "光束终点释放环形扩散波。", { sameDept: { dept: "marketing", minCards: 2 } }, { terminalWave: true }, "laser_wave", "线性伤害扩散成一圈声量。", 4),
        route("marker_admin_grid", "流程网格笔", "光束残留交叉形成定身网格。", { sameDept: { dept: "general", minCards: 2 } }, { gridField: true }, "laser_grid", "把画线变成流程网。", 5)
      ]
    }),
    coffee: weapon({
      id: "coffee",
      name: "挂耳咖啡",
      emoji: "☕",
      department: "tech",
      tags: ["homing", "speed", "summon"],
      tagDescription: "追踪 / 高频 / 续杯",
      baseStats: { damage: 10, cooldown: 1.05, range: 430, projectiles: 1 },
      description: "自动锁定最近敌人发射咖啡弹。核心玩法是高频命中与续杯自动化。",
      motif: "续杯自动化",
      formTopology: "homing_projectile",
      evolutionRoutes: [
        route("coffee_tech_refill_system", "自动续杯系统", "累计命中召唤咖啡无人机。", { sameDept: { dept: "tech", minCards: 2 } }, { refillDrones: true }, "coffee_drone", "命中越频繁，续杯越自动。", 1),
        route("coffee_product_triple_espresso", "三倍浓缩杯", "同目标叠满咖啡因后过载爆开。", { sameDept: { dept: "product", minCards: 2 } }, { stackDetonate: true }, "espresso_blast", "把单体压力压到过载。", 2),
        route("coffee_ops_warm_stomach", "热饮护胃杯", "命中积攒暖意并生成护盾球。", { sameDept: { dept: "ops", minCards: 2 } }, { warmShield: true }, "warm_orbit", "续杯也能保命。", 3)
      ]
    }),
    keyboard: weapon({
      id: "keyboard",
      name: "键盘",
      emoji: "⌨",
      department: "ops",
      tags: ["melee", "counter", "knockback"],
      tagDescription: "近身 / 盾反 / 击退",
      baseStats: { damage: 18, cooldown: 1.45, range: 130, arc: 95 },
      description: "近身扇形挥击并击退敌人。核心玩法是贴脸压力下的输入反击。",
      motif: "近身盾反输入",
      formTopology: "melee_arc_knockback",
      evolutionRoutes: [
        route("keyboard_ops_guard_counter", "值守盾反键盘", "防守窗口内受到近身碰撞会格挡反击。", { sameDept: { dept: "ops", minCards: 2 } }, { shieldCounter: true }, "guard_counter", "把键盘养成近身盾反输入。", 1),
        route("keyboard_product_enter_burst", "回车爆键键盘", "挥击积槽，满槽后下一击重击。", { sameDept: { dept: "product", minCards: 2 } }, { chargeNextAttack: true }, "enter_burst", "按下回车，重击爆开。", 2),
        route("keyboard_tech_macro_repeat", "宏键连打键盘", "每数次挥击追加副挥击。", { sameDept: { dept: "tech", minCards: 2 } }, { comboRepeat: true }, "macro_repeat", "把输入变成宏。", 3),
        route("keyboard_admin_shortcut_lock", "快捷键封锁键盘", "标记敌人后续挥击触发短暂停顿。", { sameDept: { dept: "general", minCards: 2 } }, { shortcutStun: true }, "shortcut_lock", "快捷键变成封锁规则。", 4)
      ]
    }),
    stapler: weapon({
      id: "stapler",
      name: "订书机",
      emoji: "▱",
      department: "general",
      tags: ["spread", "bind", "control"],
      tagDescription: "扇面 / 装订 / 封锁",
      baseStats: { damage: 12, cooldown: 1.6, range: 310, projectiles: 5, spread: 35 },
      description: "向前方射出扇形钉幕。核心玩法是布点、连线、封锁入口。",
      motif: "装订封锁线",
      formTopology: "frontal_spread_projectile",
      evolutionRoutes: [
        route("stapler_admin_archive_seal", "归档封条订书机", "钉点自动连成封锁线。", { sameDept: { dept: "general", minCards: 2 } }, { anchorLockline: true }, "lockline", "把订书钉养成封锁线。", 1)
      ]
    }),
    headphones: weapon({
      id: "headphones",
      name: "降噪耳机",
      emoji: "◉",
      department: "marketing",
      tags: ["aura", "wave", "spread"],
      tagDescription: "声场 / 接力 / 传播",
      baseStats: { damage: 8, cooldown: 2.4, range: 120, auraRadius: 118 },
      description: "玩家身边生成持续声场。核心玩法是让声波在敌群中接力播放。",
      motif: "声波接力传播",
      formTopology: "aura_damage",
      evolutionRoutes: [
        route("headphones_marketing_rebroadcast", "广播接力耳机", "声波命中敌人后延迟二次播放小声波。", { sameDept: { dept: "marketing", minCards: 2 } }, { rebroadcast: true }, "rebroadcast", "把声场养成广播接力。", 1)
      ]
    }),
    thermos: weapon({
      id: "thermos",
      name: "保温杯",
      emoji: "◒",
      department: "product",
      tags: ["charge", "burst", "heat"],
      tagDescription: "蓄热 / 沸点 / 释放",
      baseStats: { damage: 16, cooldown: 1.05, range: 260, heatMax: 100 },
      description: "积攒热量并释放蒸汽。核心玩法是蓄热、找窗口、打爆发。",
      motif: "蓄热沸点释放",
      formTopology: "heat_meter_steam",
      evolutionRoutes: [
        route("thermos_product_boiling", "沸点爆发杯", "满热量释放高伤蒸汽柱，之后进入空窗。", { sameDept: { dept: "product", minCards: 2 } }, { chargeReleaseBeam: true }, "steam_beam", "把保温杯养成一次沸点释放。", 1),
        route("thermos_ops_warm_shield", "暖流护体杯", "暖流护盾破裂时释放环形热浪。", { sameDept: { dept: "ops", minCards: 2 } }, { shieldBreakPulse: true }, "warm_shield", "把热量留给容错。", 2)
      ]
    }),
    report: weapon({
      id: "report",
      name: "季度报表",
      emoji: "▤",
      department: "product",
      tags: ["orbit", "window", "settle"],
      tagDescription: "环绕 / 审判 / 结算",
      baseStats: { damage: 7, cooldown: 2.0, range: 165, orbitSpeed: 1.5, sheets: 4 },
      description: "报表页围绕角色旋转切割。核心玩法是锁定窗口并结算伤害。",
      motif: "KPI 窗口审判",
      formTopology: "orbit_blade",
      evolutionRoutes: [
        route("report_product_kpi_judgement", "KPI 审判报表", "锁定高价值目标，窗口内记录伤害并结算。", { sameDept: { dept: "product", minCards: 2 } }, { kpiWindow: true }, "kpi_window", "把报表养成 KPI 审判。", 1)
      ]
    }),
    shredder: weapon({
      id: "shredder",
      name: "碎纸机",
      emoji: "▧",
      department: "marketing",
      tags: ["cone", "vortex", "shred"],
      tagDescription: "锥形 / 纸屑 / 龙卷",
      baseStats: { damage: 14, cooldown: 2.3, range: 240, coneAngle: 45 },
      description: "前方持续锥形粉碎。核心玩法是积累纸屑并召唤牵引龙卷。",
      motif: "粉碎纸屑龙卷",
      formTopology: "frontal_cone_channel",
      evolutionRoutes: [
        route("shredder_marketing_vortex", "纸屑龙卷碎纸机", "持续命中或击杀积纸屑值，满值召唤龙卷。", { sameDept: { dept: "marketing", minCards: 2 } }, { vortexSummon: true }, "paper_vortex", "把粉碎养成纸屑龙卷。", 1)
      ]
    }),
    sticky_note: weapon({
      id: "sticky_note",
      name: "即时贴",
      emoji: "▰",
      department: "general",
      tags: ["trap", "field", "control"],
      tagDescription: "陷阱 / 布阵 / 连线",
      baseStats: { damage: 11, cooldown: 1.35, range: 360, trapDuration: 8, maxTraps: 3 },
      description: "地面放置贴纸陷阱。核心玩法是提前布阵，让敌人走进规则里。",
      motif: "贴纸公告板阵地",
      formTopology: "ground_trap",
      evolutionRoutes: [
        route("sticky_admin_board", "公告板阵地即时贴", "三张贴纸围成公告板区域，区域内敌人受规则限制。", { sameDept: { dept: "general", minCards: 2 } }, { linkControlZone: true }, "trap_board", "把贴纸养成公告板阵地。", 1),
        route("sticky_product_switch", "功能开关贴", "同屏贴纸可被同步引爆。", { sameDept: { dept: "product", minCards: 2 } }, { manualDetonate: true }, "trap_detonate", "提前布置，然后一次开关。", 2),
        route("sticky_tech_todo", "智能待办贴", "贴纸会滑向敌人。", { sameDept: { dept: "tech", minCards: 2 } }, { seekingTrap: true }, "seeking_trap", "把待办事项自动派发。", 3)
      ]
    }),
    calculator: weapon({
      id: "calculator",
      name: "财务计算器",
      emoji: "▥",
      department: "general",
      tags: ["chain", "ledger", "economy"],
      tagDescription: "跳点 / 挂账 / 结算",
      baseStats: { damage: 17, cooldown: 1.35, range: 340, jumps: 3 },
      description: "发射数字弹并在敌人间跳点。核心玩法是挂账、死亡结算和账目转移。",
      motif: "审计账目结算",
      formTopology: "chain_bounce_projectile",
      evolutionRoutes: [
        route("calculator_admin_audit_ledger", "审计总账计算器", "数字弹命中挂账，死亡时结算并转移账目。", { sameDept: { dept: "general", minCards: 2 } }, { auditLedger: true }, "audit_ledger", "把跳点养成审计账目结算。", 1)
      ]
    })
  };

  Object.defineProperty(CS.weapons, "sticky", { value: CS.weapons.sticky_note, enumerable: false });
  Object.defineProperty(CS.weapons, "headset", { value: CS.weapons.headphones, enumerable: false });
})();
