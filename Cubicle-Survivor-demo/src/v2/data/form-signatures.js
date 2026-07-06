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
      process: "主光束贯穿，命中后分裂短支线",
      visualCue: "蓝白主束加青色支线群",
      focus: ["主束", "支线", "二跳"],
      sources: ["marker_main", "marker_split", "marker_secondary_split", "marker_fullscreen"]
    },
    mark_detonate: {
      topology: "标记引爆",
      process: "先挂 P0 标记，再次命中光爆",
      visualCue: "深蓝锁定框到蓝白爆点",
      focus: ["标记", "二次命中", "爆半径"],
      sources: ["marker_main", "marker_p0_mark", "marker_p0_blast"]
    },
    shield_counter_line: {
      topology: "护盾反刺",
      process: "命中攒盾，破盾反射短激光",
      visualCue: "蓝绿护盾弧裂成反刺光线",
      focus: ["攒盾", "破盾", "反刺"],
      sources: ["marker_main", "marker_counter", "secondary_counter"]
    },
    line_to_wave: {
      topology: "线尾波纹",
      process: "光束到终点，环形波纹向外扩散",
      visualCue: "蓝紫终点环一圈圈展开",
      focus: ["线伤", "波纹", "扩散"],
      sources: ["marker_main", "marker_wave"]
    },
    line_grid_field: {
      topology: "残线网格",
      process: "光束路径留场，交叉成控制网格",
      visualCue: "蓝金残留线交成短暂审批格",
      focus: ["残线", "交叉", "定身区"],
      sources: ["marker_main", "marker_grid_line"]
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
      process: "蓄热召唤巡航模块，模块继续喷汽",
      visualCue: "蓝色热饮模块绕场喷短蒸汽",
      focus: ["召唤", "巡航", "续杯"],
      sources: ["thermos_drone_summon", "thermos_drone", "thermos_warmup"]
    },
    charge_release_beam: {
      topology: "蓄力释放",
      process: "弱蒸汽蓄热，沸点窗口喷出强蒸汽柱",
      visualCue: "蓝白蒸汽柱从细到粗爆开",
      focus: ["蓄力", "沸点", "空窗"],
      sources: ["thermos_warmup", "thermos_release"]
    },
    shield_break_pulse: {
      topology: "破盾热浪",
      process: "暖流护盾承压，破裂时环形反击",
      visualCue: "护盾裂纹爆成蓝绿热浪",
      focus: ["护盾", "承压", "热浪"],
      sources: ["thermos_shield_break"]
    },
    periodic_wave_spread: {
      topology: "周期热波",
      process: "周期放出茶香热波，击杀后低伤接力",
      visualCue: "淡蓝热波一圈圈扫过怪群",
      focus: ["周期", "扩散", "接力"],
      sources: ["thermos_tea_wave"]
    },
    deployable_safe_station: {
      topology: "据点领域",
      process: "部署茶水间，据点内补给并减速",
      visualCue: "固定蓝色据点展开安全圈",
      focus: ["部署", "站场", "减速"],
      sources: ["thermos_station"]
    },
    ground_trap: {
      topology: "落点陷阱",
      process: "贴纸落地，敌人踩中触发",
      visualCue: "蓝色便签落点闪烁",
      focus: ["落点", "踩踏", "减速"],
      sources: ["sticky_base"]
    },
    seeking_trap_summon: {
      topology: "寻敌贴纸",
      process: "贴纸落地后滑向敌人",
      visualCue: "小蓝贴纸带尾光主动追击",
      focus: ["寻敌", "滑行", "撞击"],
      sources: ["sticky_seeking"]
    },
    manual_trap_detonate: {
      topology: "同步爆破",
      process: "先布贴纸，再把同屏贴纸同步引爆",
      visualCue: "多张贴纸同时亮起后爆开",
      focus: ["布阵", "同步", "引爆"],
      sources: ["sticky_manual_trap", "sticky_sync_blast"]
    },
    route_buff_trap: {
      topology: "路线护盾",
      process: "沿玩家路径铺贴纸，经过获得护盾",
      visualCue: "蓝绿贴纸连成撤退路线",
      focus: ["路线", "护盾", "减速"],
      sources: ["sticky_route"]
    },
    sticky_debuff_spread: {
      topology: "死亡传播",
      process: "贴纸附着敌人，死亡后传播",
      visualCue: "贴纸粘住目标，击杀后放射转移",
      focus: ["附着", "击杀", "传播"],
      sources: ["sticky_spread_attach", "sticky_spread"]
    },
    trap_link_control_zone: {
      topology: "公告板阵地",
      process: "多张贴纸连线，三点围成控制区",
      visualCue: "蓝金贴纸拉线围成规则区",
      focus: ["连线", "围区", "控制"],
      sources: ["sticky_notice_trap", "sticky_link_line", "sticky_notice_zone"]
    }
  };

  const SOURCE_PHASES = {
    marker_main: "cast",
    marker_split: "branch",
    marker_secondary_split: "branch",
    marker_fullscreen: "ultimate",
    marker_p0_mark: "mark",
    marker_p0_blast: "detonate",
    marker_counter: "counter",
    secondary_counter: "counter",
    marker_wave: "expand",
    marker_grid_line: "linger",
    thermos_warmup: "charge",
    thermos_release: "release",
    thermos_drone_summon: "summon",
    thermos_drone: "summon",
    thermos_shield_break: "counter",
    thermos_tea_wave: "expand",
    thermos_station: "deploy",
    sticky_base: "deploy",
    sticky_manual_trap: "deploy",
    sticky_seeking: "seek",
    sticky_sync_blast: "detonate",
    sticky_route: "route",
    sticky_spread_attach: "attach",
    sticky_spread: "spread",
    sticky_notice_trap: "deploy",
    sticky_link_line: "link",
    sticky_notice_zone: "field"
  };

  V2.weaponFormSignatures = SIGNATURES;
  V2.weaponEventPhases = SOURCE_PHASES;

  V2.getWeaponFormSignature = function getWeaponFormSignature(formOrType) {
    const type = typeof formOrType === "string" ? formOrType : formOrType && formOrType.mechanicType;
    return SIGNATURES[type] || SIGNATURES.line_pierce;
  };

  V2.getWeaponEventPhase = function getWeaponEventPhase(source) {
    return SOURCE_PHASES[source] || "impact";
  };
})();
