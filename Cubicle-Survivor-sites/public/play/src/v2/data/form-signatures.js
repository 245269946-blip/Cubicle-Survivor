// ================================================================
// src/v2/data/form-signatures.js
// One compact contract that connects combat form data, UI previews,
// VFX event sources, and QA coverage.
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});
  const V2 = CS.V2 || (CS.V2 = {});

  const SIGNATURES = {
    line_pierce: {
      topology: "直线贯穿",
      process: "拉直线穿队列",
      visualCue: "细长蓝光束贯穿多个敌人",
      focus: ["贯穿", "走位", "队列"],
      sources: ["marker_main"]
    },
    line_split: {
      topology: "线性分裂",
      process: "主光束按距离贯穿；命中点锁定附近新目标，支线沿目标方向继续贯穿",
      visualCue: "蓝白主束串起命中点，青色支线只连接真实目标",
      focus: ["主束贯穿", "命中点锁敌", "支线贯穿", "二次锁敌"],
      sources: ["marker_main", "marker_split", "marker_split_origin", "marker_secondary_split", "marker_fullscreen"]
    },
    mark_detonate: {
      topology: "标记引爆",
      process: "高价值目标获得限时 P0，窗口内再次命中才会光爆",
      visualCue: "金色倒计时锁定框缩短，二次命中转为蓝白爆点",
      focus: ["高价值目标", "限时标记", "二次命中", "连环转移"],
      sources: ["marker_main", "marker_p0_mark", "marker_p0_blast", "marker_p0_chain", "marker_p0_expire"]
    },
    shield_counter_line: {
      topology: "护盾反刺",
      process: "命中积攒真实护盾，敌方伤害把护盾打空后锁定附近敌人反刺",
      visualCue: "蓝绿护盾弧随命中增长，承伤清空后裂成锁敌短线",
      focus: ["命中攒盾", "承伤", "真实破盾", "锁敌反刺"],
      sources: ["marker_main", "marker_shield_charge", "marker_shield_break", "marker_counter", "secondary_counter"]
    },
    line_to_wave: {
      topology: "线尾波纹",
      process: "光束在最后命中点收束，伤害波前随后从该点向外传播",
      visualCue: "蓝紫主束落点后，细环与真实伤害波前同步向外扫过",
      focus: ["线伤", "最后命中点", "传播波前", "回扫"],
      sources: ["marker_main", "marker_wave", "marker_wave_return"]
    },
    line_grid_field: {
      topology: "残线网格",
      process: "光束路径留场，只有真实线段相交才在交点生成控制区",
      visualCue: "蓝金残留线在几何交点展开短暂审批格",
      focus: ["残线", "真实交点", "定身区", "垂直补线"],
      sources: ["marker_main", "marker_grid_line", "marker_grid_field"]
    },
    heat_meter_steam: {
      topology: "蓄热蒸汽",
      process: "弱蒸汽预热，热量满后释放",
      visualCue: "小蒸汽束逐步变亮",
      focus: ["预热", "蓄热", "释放"],
      sources: ["thermos_warmup", "thermos_release"]
    },
    patrol_summon_steam: {
      topology: "自动续杯",
      process: "短蒸汽蓄热，满热召唤巡航模块；模块主动锁敌喷出贯穿短汽",
      visualCue: "小型热饮模块绕身移动，并从模块位置连到真实目标",
      focus: ["蓄热", "召唤", "巡航", "模块喷汽"],
      sources: ["thermos_drone_summon", "thermos_drone", "thermos_drone_steam", "thermos_warmup"]
    },
    charge_release_beam: {
      topology: "蓄力释放",
      process: "弱蒸汽蓄热，过热提高释放倍率；沸点喷出强蒸汽柱后进入空窗",
      visualCue: "蓝白蒸汽柱从细到粗爆开",
      focus: ["蓄力", "沸点", "空窗"],
      sources: ["thermos_charge", "thermos_warmup", "thermos_release"]
    },
    shield_break_pulse: {
      topology: "破盾热浪",
      process: "蒸汽命中充盾，敌方伤害把真实护盾打空后传播反击热浪",
      visualCue: "蓝绿护盾弧随命中增长，承伤清空后向外扫出波前",
      focus: ["命中充盾", "承伤", "真实破盾", "传播热浪"],
      sources: ["thermos_shield_steam", "thermos_shield_charge", "thermos_shield_break"]
    },
    periodic_wave_spread: {
      topology: "周期热波",
      process: "周期传播茶香波，波前挂状态；带状态敌人死亡后从死亡点传播回声",
      visualCue: "淡蓝波前先扫过怪群，死亡点随后出现小一号回声波",
      focus: ["主波传播", "挂状态", "死亡点", "回声接力"],
      sources: ["thermos_tea_wave", "thermos_tea_echo"]
    },
    deployable_safe_station: {
      topology: "据点领域",
      process: "弱蒸汽蓄热到满值后在玩家当前位置部署茶水间，据点内补给并减速",
      visualCue: "固定蓝色据点展开安全圈",
      focus: ["部署", "站场", "减速"],
      sources: ["thermos_station_charge", "thermos_station_warmup", "thermos_station"]
    },
    ground_trap: {
      topology: "落点陷阱",
      process: "贴纸落地，敌人踩中触发",
      visualCue: "蓝色便签落点闪烁",
      focus: ["落点", "踩踏", "减速"],
      sources: ["sticky_base", "sticky_arm", "sticky_base_trigger"]
    },
    seeking_trap_summon: {
      topology: "寻敌贴纸",
      process: "贴纸落地后滑向敌人",
      visualCue: "小蓝贴纸带尾光主动追击",
      focus: ["寻敌", "滑行", "撞击"],
      sources: ["sticky_seeking", "sticky_arm", "sticky_seeking_hit", "sticky_seeking_bounce", "secondary_sticky_seeking"]
    },
    manual_trap_detonate: {
      topology: "同步爆破",
      process: "先布贴纸，再把同屏贴纸同步引爆",
      visualCue: "多张贴纸同时亮起后爆开",
      focus: ["布阵", "同步", "引爆"],
      sources: ["sticky_manual_trap", "sticky_arm", "sticky_manual_trigger", "sticky_sync_blast", "secondary_sticky_blast"]
    },
    route_buff_trap: {
      topology: "路线护盾",
      process: "沿玩家路径铺贴纸，经过获得护盾",
      visualCue: "蓝绿贴纸连成撤退路线",
      focus: ["路线", "护盾", "减速"],
      sources: ["sticky_route", "sticky_arm", "sticky_route_claim", "secondary_sticky_route"]
    },
    sticky_debuff_spread: {
      topology: "死亡传播",
      process: "贴纸附着敌人，死亡后传播",
      visualCue: "贴纸粘住目标，击杀后放射转移",
      focus: ["附着", "击杀", "传播"],
      sources: ["sticky_spread_attach", "sticky_spread", "secondary_sticky_spread"]
    },
    trap_link_control_zone: {
      topology: "公告板阵地",
      process: "多张贴纸连线，三点围成控制区",
      visualCue: "蓝金贴纸拉线围成规则区",
      focus: ["连线", "围区", "控制"],
      sources: ["sticky_notice_trap", "sticky_arm", "sticky_notice_pin", "sticky_notice_align", "sticky_link_line", "sticky_notice_zone", "secondary_sticky_link", "secondary_sticky_notice"]
    }
  };

  const SOURCE_PHASES = {
    marker_main: "cast",
    marker_split: "branch",
    marker_split_origin: "branch",
    marker_secondary_split: "branch",
    marker_fullscreen: "ultimate",
    marker_p0_mark: "mark",
    marker_p0_blast: "detonate",
    marker_p0_chain: "mark",
    marker_p0_expire: "expire",
    marker_shield_charge: "charge",
    marker_shield_break: "counter",
    marker_counter: "counter",
    secondary_counter: "counter",
    secondary_split: "branch",
    secondary_marker_blast: "detonate",
    secondary_shield_charge: "charge",
    secondary_shield_break: "counter",
    secondary_marker_wave: "expand",
    secondary_marker_grid: "linger",
    marker_wave: "expand",
    marker_wave_return: "expand",
    marker_grid_line: "linger",
    marker_grid_field: "field",
    thermos_warmup: "charge",
    thermos_charge: "charge",
    thermos_release: "release",
    thermos_release_shield: "shield",
    thermos_drone_summon: "summon",
    thermos_drone: "summon",
    thermos_drone_steam: "cast",
    thermos_shield_steam: "cast",
    thermos_shield_charge: "charge",
    thermos_shield_break: "counter",
    thermos_tea_wave: "expand",
    thermos_tea_echo: "expand",
    thermos_station_charge: "charge",
    thermos_station_warmup: "charge",
    thermos_station: "deploy",
    secondary_thermos_boil: "detonate",
    secondary_thermos_shield_charge: "charge",
    secondary_thermos_shield_break: "counter",
    secondary_thermos_tea_wave: "expand",
    secondary_thermos_station: "deploy",
    sticky_base: "deploy",
    sticky_arm: "arm",
    sticky_base_trigger: "detonate",
    sticky_manual_trap: "deploy",
    sticky_manual_trigger: "detonate",
    sticky_seeking: "seek",
    sticky_seeking_hit: "detonate",
    sticky_seeking_bounce: "seek",
    secondary_sticky_seeking: "seek",
    sticky_sync_blast: "detonate",
    secondary_sticky_blast: "detonate",
    sticky_route: "route",
    sticky_route_claim: "shield",
    secondary_sticky_route: "route",
    sticky_spread_attach: "attach",
    sticky_spread: "spread",
    secondary_sticky_spread: "attach",
    sticky_notice_trap: "deploy",
    sticky_notice_pin: "control",
    sticky_notice_align: "link",
    sticky_link_line: "link",
    sticky_notice_zone: "field",
    secondary_sticky_link: "link",
    secondary_sticky_notice: "field",
    support_marker: "cast",
    support_thermos_wave: "expand",
    support_sticky_trap: "deploy",
    support_sticky_trigger: "detonate"
  };

  const PHASE_TIMELINES = {
    cast: ["anticipation", "release", "impact", "fade"],
    branch: ["release", "impact", "fade"],
    ultimate: ["anticipation", "release", "impact", "residual", "fade"],
    mark: ["impact", "residual", "fade"],
    detonate: ["anticipation", "release", "impact", "fade"],
    expire: ["fade"],
    charge: ["anticipation", "residual"],
    counter: ["anticipation", "release", "impact", "fade"],
    expand: ["anticipation", "release", "impact", "residual", "fade"],
    linger: ["release", "residual", "fade"],
    field: ["release", "residual", "fade"],
    release: ["anticipation", "release", "impact", "fade"],
    shield: ["release", "residual", "fade"],
    summon: ["anticipation", "release", "residual", "fade"],
    deploy: ["anticipation", "release", "residual", "fade"],
    arm: ["anticipation", "release", "residual"],
    seek: ["release", "residual", "impact", "fade"],
    route: ["release", "residual", "fade"],
    attach: ["impact", "residual", "fade"],
    spread: ["anticipation", "release", "impact", "fade"],
    control: ["impact", "residual", "fade"],
    link: ["release", "residual", "fade"],
    impact: ["impact", "fade"]
  };

  const FAMILY_PALETTES = {
    marker: { core: "#9ffcff", accent: "#d8ffff", warning: "#ffb067" },
    thermos: { core: "#bdf5ff", accent: "#8fffe7", warning: "#ffb067" },
    sticky_note: { core: "#8df7ff", accent: "#e8db92", warning: "#ffb067" }
  };

  const SOURCE_VISUAL_RULES = {
    marker_main: ["piercing_line", "draw_through"],
    marker_split: ["branch_line", "split_lock"],
    marker_split_origin: ["junction", "split_origin"],
    marker_secondary_split: ["branch_line", "second_lock"],
    marker_fullscreen: ["scan_line", "screen_sweep"],
    marker_p0_mark: ["target_mark", "countdown"],
    marker_p0_blast: ["radial_blast", "second_hit"],
    marker_p0_chain: ["target_mark", "transfer"],
    marker_p0_expire: ["target_mark", "expire"],
    marker_shield_charge: ["shield_arc", "charge_ring"],
    marker_shield_break: ["shield_arc", "shatter"],
    marker_counter: ["counter_line", "retaliation"],
    marker_wave: ["traveling_ring", "outbound"],
    marker_wave_return: ["traveling_ring", "inbound"],
    marker_grid_line: ["residual_line", "rule_line"],
    marker_grid_field: ["control_field", "intersection"],
    secondary_split: ["branch_line", "secondary_split"],
    secondary_marker_blast: ["radial_blast", "secondary_blast"],
    secondary_shield_charge: ["shield_arc", "secondary_charge"],
    secondary_shield_break: ["shield_arc", "secondary_break"],
    secondary_counter: ["counter_line", "secondary_counter"],
    secondary_marker_wave: ["traveling_ring", "secondary_wave"],
    secondary_marker_grid: ["residual_line", "secondary_grid"],

    thermos_warmup: ["steam_line", "heat_buildup"],
    thermos_charge: ["heat_orb", "boil_meter"],
    thermos_release: ["steam_column", "boil_release"],
    thermos_release_shield: ["shield_arc", "warm_residue"],
    thermos_drone_summon: ["orbit_entity", "module_deploy"],
    thermos_drone: ["orbit_entity", "patrol"],
    thermos_drone_steam: ["steam_line", "module_jet"],
    thermos_shield_steam: ["steam_line", "shield_feed"],
    thermos_shield_charge: ["shield_arc", "charge_ring"],
    thermos_shield_break: ["traveling_ring", "shield_break"],
    thermos_tea_wave: ["aroma_ring", "outbound"],
    thermos_tea_echo: ["aroma_ring", "death_echo"],
    thermos_station_charge: ["heat_orb", "station_charge"],
    thermos_station_warmup: ["steam_line", "station_warmup"],
    thermos_station: ["deployable_field", "station_deploy"],
    secondary_thermos_boil: ["radial_blast", "secondary_boil"],
    secondary_thermos_shield_charge: ["shield_arc", "secondary_charge"],
    secondary_thermos_shield_break: ["traveling_ring", "secondary_break"],
    secondary_thermos_tea_wave: ["aroma_ring", "secondary_wave"],
    secondary_thermos_station: ["deployable_field", "secondary_station"],

    sticky_base: ["placed_trap", "placement"],
    sticky_arm: ["placed_trap", "armed_tick"],
    sticky_base_trigger: ["radial_blast", "contact_trigger"],
    sticky_manual_trap: ["placed_trap", "manual_placement"],
    sticky_manual_trigger: ["switch_pulse", "sync_signal"],
    sticky_seeking: ["seeking_entity", "seek"],
    sticky_seeking_hit: ["radial_blast", "contact_hit"],
    sticky_seeking_bounce: ["seeking_entity", "bounce"],
    secondary_sticky_seeking: ["seeking_entity", "secondary_seek"],
    sticky_sync_blast: ["radial_blast", "staggered_chain"],
    secondary_sticky_blast: ["radial_blast", "secondary_blast"],
    sticky_route: ["trail_route", "route"],
    sticky_route_claim: ["shield_arc", "route_claim"],
    secondary_sticky_route: ["trail_route", "secondary_route"],
    sticky_spread_attach: ["attached_mark", "attach"],
    sticky_spread: ["transfer_chain", "death_transfer"],
    secondary_sticky_spread: ["attached_mark", "secondary_attach"],
    sticky_notice_trap: ["placed_trap", "notice_node"],
    sticky_notice_pin: ["control_mark", "priority_pin"],
    sticky_notice_align: ["link_line", "calibration"],
    sticky_link_line: ["link_line", "closed_edge"],
    sticky_notice_zone: ["polygon_field", "closed_zone"],
    secondary_sticky_link: ["link_line", "secondary_link"],
    secondary_sticky_notice: ["polygon_field", "secondary_zone"],

    support_marker: ["support_line", "borrowed_marker"],
    support_thermos_wave: ["support_ring", "borrowed_thermos"],
    support_sticky_trap: ["support_trap", "borrowed_sticky"],
    support_sticky_trigger: ["radial_blast", "support_trigger"]
  };

  function visualFamily(source) {
    if (/thermos/.test(source)) return "thermos";
    if (/sticky/.test(source)) return "sticky_note";
    return "marker";
  }

  function visualRole(source) {
    if (source.indexOf("support_") === 0) return "support";
    if (source.indexOf("secondary_") === 0) return "secondary";
    return "primary";
  }

  const VISUAL_EVENTS = {};
  Object.keys(SOURCE_PHASES).forEach(function (source) {
    const phase = SOURCE_PHASES[source];
    const rule = SOURCE_VISUAL_RULES[source] || ["impact_burst", phase];
    const family = visualFamily(source);
    const role = visualRole(source);
    VISUAL_EVENTS[source] = {
      source,
      family,
      phase,
      topology: rule[0],
      cue: rule[1],
      role,
      priority: role === "primary" ? 3 : role === "secondary" ? 2 : 1,
      intensity: role === "primary" ? 1 : role === "secondary" ? 0.72 : 0.58,
      timeline: (PHASE_TIMELINES[phase] || PHASE_TIMELINES.impact).slice(),
      palette: FAMILY_PALETTES[family]
    };
  });

  V2.weaponFormSignatures = SIGNATURES;
  V2.weaponEventPhases = SOURCE_PHASES;
  V2.weaponVisualEvents = VISUAL_EVENTS;
  V2.weaponVisualTimelines = PHASE_TIMELINES;

  V2.getWeaponFormSignature = function getWeaponFormSignature(formOrType) {
    const type = typeof formOrType === "string" ? formOrType : formOrType && formOrType.mechanicType;
    return SIGNATURES[type] || SIGNATURES.line_pierce;
  };

  V2.getWeaponEventPhase = function getWeaponEventPhase(source) {
    return SOURCE_PHASES[source] || "impact";
  };

  V2.getWeaponVisualEvent = function getWeaponVisualEvent(source) {
    if (VISUAL_EVENTS[source]) return VISUAL_EVENTS[source];
    const family = visualFamily(source || "");
    return {
      source: source || "unknown",
      family,
      phase: "impact",
      topology: "impact_burst",
      cue: "impact",
      role: "primary",
      priority: 3,
      intensity: 1,
      timeline: PHASE_TIMELINES.impact.slice(),
      palette: FAMILY_PALETTES[family]
    };
  };
})();
