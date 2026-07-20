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
      sources: ["marker_main", "marker_test_base", "marker_test_copy", "marker_test_second_round", "marker_test_archive", "marker_test_fullscreen_copy", "marker_test_fullscreen_archive", "marker_test_defeat"]
    },
    line_split: {
      topology: "线性分裂",
      process: "主光束按距离贯穿；命中点锁定附近新目标，支线沿目标方向继续贯穿",
      visualCue: "蓝白主束串起命中点，青色支线只连接真实目标",
      focus: ["主束贯穿", "命中点锁敌", "支线贯穿", "二次锁敌"],
      sources: ["marker_main", "marker_split", "marker_split_origin", "marker_secondary_split", "marker_fullscreen", "marker_module_copy", "marker_module_archive", "marker_module_forward", "marker_module_expedite", "marker_module_merge", "marker_module_overdraft"]
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
      sources: ["thermos_charge", "thermos_warmup", "thermos_release", "thermos_module_archive", "thermos_module_expedite", "thermos_module_merge", "thermos_module_overdraft", "thermos_module_heatwave"]
    },
    thermos_fixed_fan: {
      topology: "近距蒸汽扇面",
      process: "基础喷汽只覆盖前方近距离扇面；冷凝沿扇面分段留场，聚焦喷汽锁定低血量目标并在击杀后产生一次不连锁热浪。",
      visualCue: "青白蒸汽形成宽钝扇面，冷凝区柔和铺开；金色聚焦汽流和橙色死亡热浪形成清晰的第二路线。",
      focus: ["近距转向", "前向扇面", "分段冷凝", "聚焦击杀", "死亡热浪"],
      sources: ["thermos_test_base", "thermos_test_condensation", "thermos_test_focus", "thermos_test_kill_heatwave", "thermos_test_fullscreen_condensation", "thermos_test_fullscreen_ignition", "thermos_test_defeat"]
    },
    scissors_fixed_melee: {
      topology: "贴身剪切时间线",
      process: "轻步先完成无伤害位移；整轮锁定一个方向，依次完成合刃窄线突刺与张刃短宽连剪。",
      visualCue: "红柄钢刃贴身闪过，青色轻步残影与白橙剪切弧分离；裁断和合剪终结拥有独立重击反馈。",
      focus: ["纯近战", "轻步进场", "锁向动作轮", "合刃突刺", "张刃连剪", "处决"],
      sources: ["scissors_test_base", "scissors_test_dash", "scissors_test_thrust", "scissors_test_sever", "scissors_test_open", "scissors_test_finale", "scissors_test_finale_boss_bonus", "scissors_test_execution", "scissors_test_shelter", "scissors_test_shelter_block", "scissors_test_defeat"]
    },
    correction_fluid_fixed: {
      topology: "错误状态循环",
      process: "喷射制造三层错误；过载死亡可污染战场，或被最终纠错集中清除并处决。",
      visualCue: "白色修正痕迹说明状态层数，青/品红故障扫描提示过载，橙红错误码只用于系统崩溃与处决。",
      focus: ["错误层数", "过载目标", "污染区域", "区域融合", "系统崩溃", "最终纠错"],
      sources: ["correction_test_lock", "correction_test_spray", "correction_test_error_apply", "correction_test_error_overload", "correction_test_error_expire", "correction_test_error_area", "correction_test_area_merge", "correction_test_system_crash", "correction_test_final", "correction_test_final_blast", "correction_test_defeat"]
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
      sources: ["sticky_notice_trap", "sticky_arm", "sticky_notice_pin", "sticky_notice_align", "sticky_link_line", "sticky_notice_zone", "sticky_notice_relay", "sticky_module_archive", "sticky_module_expedite", "sticky_module_merge", "sticky_module_overdraft", "secondary_sticky_link", "secondary_sticky_notice"]
    },
    boss_pressure: {
      topology: "Boss读招压力",
      process: "先显示真实危险方向与安全缺口，再释放可躲避的高威胁攻击",
      visualCue: "品红锁定走廊与琥珀弹幕预警严格对应随后出现的伤害轨迹",
      focus: ["预警", "走位", "锁定走廊", "安全缺口"],
      sources: ["boss_test_lane_warning", "boss_test_lane_release", "boss_test_burst_warning", "boss_test_safe_gap", "boss_test_burst_release"]
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
    marker_module_copy: "cast",
    marker_module_archive: "linger",
    marker_module_forward: "branch",
    marker_module_expedite: "cast",
    marker_module_merge: "detonate",
    marker_module_overdraft: "ultimate",
    marker_test_base: "cast",
    marker_test_copy: "cast",
    marker_test_second_round: "cast",
    marker_test_archive: "linger",
    marker_test_fullscreen_copy: "ultimate",
    marker_test_fullscreen_archive: "ultimate",
    marker_test_defeat: "detonate",
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
    thermos_module_archive: "linger",
    thermos_module_expedite: "cast",
    thermos_module_merge: "expand",
    thermos_module_overdraft: "expand",
    thermos_module_heatwave: "expand",
    thermos_test_base: "release",
    thermos_test_condensation: "linger",
    thermos_test_focus: "cast",
    thermos_test_kill_heatwave: "expand",
    thermos_test_fullscreen_condensation: "ultimate",
    thermos_test_fullscreen_ignition: "ultimate",
    thermos_test_defeat: "detonate",
    scissors_test_base: "cast",
    scissors_test_dash: "release",
    scissors_test_thrust: "cast",
    scissors_test_sever: "ultimate",
    scissors_test_open: "cast",
    scissors_test_finale: "detonate",
    scissors_test_finale_boss_bonus: "impact",
    scissors_test_execution: "detonate",
    scissors_test_shelter: "shield",
    scissors_test_shelter_block: "counter",
    scissors_test_defeat: "detonate",
    correction_test_lock: "mark",
    correction_test_spray: "cast",
    correction_test_error_apply: "mark",
    correction_test_error_overload: "mark",
    correction_test_error_expire: "expire",
    correction_test_error_area: "linger",
    correction_test_area_merge: "field",
    correction_test_system_crash: "ultimate",
    correction_test_final: "detonate",
    correction_test_final_blast: "detonate",
    correction_test_defeat: "detonate",
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
    sticky_notice_relay: "deploy",
    sticky_module_archive: "deploy",
    sticky_module_expedite: "control",
    sticky_module_merge: "detonate",
    sticky_module_overdraft: "detonate",
    secondary_sticky_link: "link",
    secondary_sticky_notice: "field",
    support_marker: "cast",
    support_thermos_wave: "expand",
    support_sticky_trap: "deploy",
    support_sticky_trigger: "detonate",
    boss_test_lane_warning: "charge",
    boss_test_lane_release: "release",
    boss_test_burst_warning: "charge",
    boss_test_safe_gap: "charge",
    boss_test_burst_release: "detonate"
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
    scissors: { core: "#f1f5f6", accent: "#ff7b5f", warning: "#ffe58f" },
    correction_fluid: { core: "#f4ffff", accent: "#61f5ff", warning: "#ff3f7d" },
    sticky_note: { core: "#8df7ff", accent: "#e8db92", warning: "#ffb067" },
    boss: { core: "#ff3f9f", accent: "#ffd36a", warning: "#ff5c57" }
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
    marker_module_copy: ["piercing_line", "parallel_copy"],
    marker_module_archive: ["residual_line", "archived_ink"],
    marker_module_forward: ["branch_line", "second_generation"],
    marker_module_expedite: ["scan_line", "rush_redraw"],
    marker_module_merge: ["radial_blast", "summary_burst"],
    marker_module_overdraft: ["scan_line", "overdraft_fan"],
    marker_test_base: ["piercing_line", "fixed_test_base"],
    marker_test_copy: ["piercing_line", "parallel_copy"],
    marker_test_second_round: ["scan_line", "reacquired_second_round"],
    marker_test_archive: ["residual_line", "persistent_ink"],
    marker_test_fullscreen_copy: ["scan_line", "fullscreen_copy"],
    marker_test_fullscreen_archive: ["residual_line", "fullscreen_archive"],
    marker_test_defeat: ["radial_blast", "path_confirmed"],

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
    thermos_module_archive: ["deployable_field", "condensation_archive"],
    thermos_module_expedite: ["steam_line", "rush_outlet"],
    thermos_module_merge: ["traveling_ring", "pressure_merge"],
    thermos_module_overdraft: ["traveling_ring", "reverse_overpressure"],
    thermos_module_heatwave: ["aroma_ring", "kill_forward"],
    thermos_test_base: ["steam_fan", "fixed_front_fan"],
    thermos_test_condensation: ["deployable_field", "segmented_condensation"],
    thermos_test_focus: ["steam_line", "low_health_focus"],
    thermos_test_kill_heatwave: ["traveling_ring", "single_kill_heatwave"],
    thermos_test_fullscreen_condensation: ["deployable_field", "fullscreen_condensation"],
    thermos_test_fullscreen_ignition: ["target_barrage", "key_target_ignition"],
    thermos_test_defeat: ["radial_blast", "pressure_confirmed"],

    scissors_test_base: ["melee_arc", "base_snip"],
    scissors_test_dash: ["dash_trail", "light_step"],
    scissors_test_thrust: ["melee_thrust", "closed_blade"],
    scissors_test_sever: ["melee_thrust", "sever_slow"],
    scissors_test_open: ["melee_arc", "open_blade_chain"],
    scissors_test_finale: ["execution_cut", "closing_finale"],
    scissors_test_finale_boss_bonus: ["execution_cut", "boss_conversion"],
    scissors_test_execution: ["execution_cut", "execute"],
    scissors_test_shelter: ["protective_field", "low_health_shelter"],
    scissors_test_shelter_block: ["protective_field", "projectile_block"],
    scissors_test_defeat: ["radial_blast", "cut_confirmed"],

    correction_test_lock: ["error_mark", "target_lock"],
    correction_test_spray: ["correction_spray", "white_jet"],
    correction_test_error_apply: ["error_mark", "stack_apply"],
    correction_test_error_overload: ["error_mark", "overload_glitch"],
    correction_test_error_expire: ["error_mark", "glitch_fade"],
    correction_test_error_area: ["error_field", "white_contamination"],
    correction_test_area_merge: ["error_field", "neon_merge"],
    correction_test_system_crash: ["error_burst", "system_crash"],
    correction_test_final: ["correction_execute", "final_overwrite"],
    correction_test_final_blast: ["error_burst", "death_error_blast"],
    correction_test_defeat: ["error_burst", "error_confirmed"],

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
    sticky_notice_relay: ["placed_trap", "relay_node"],
    sticky_module_archive: ["placed_trap", "archive_echo"],
    sticky_module_expedite: ["control_mark", "rush_annotation"],
    sticky_module_merge: ["radial_blast", "summary_pulse"],
    sticky_module_overdraft: ["radial_blast", "expiry_overdraft"],

    support_marker: ["support_line", "borrowed_marker"],
    support_thermos_wave: ["support_ring", "borrowed_thermos"],
    support_sticky_trap: ["support_trap", "borrowed_sticky"],
    support_sticky_trigger: ["radial_blast", "support_trigger"],

    boss_test_lane_warning: ["piercing_line", "locked_danger_lane"],
    boss_test_lane_release: ["piercing_line", "lane_release"],
    boss_test_burst_warning: ["target_mark", "radial_warning"],
    boss_test_safe_gap: ["residual_line", "safe_gap_edges"],
    boss_test_burst_release: ["radial_blast", "radial_release"]
  };

  function visualFamily(source) {
    if (/boss_test/.test(source)) return "boss";
    if (/correction/.test(source)) return "correction_fluid";
    if (/scissors/.test(source)) return "scissors";
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
