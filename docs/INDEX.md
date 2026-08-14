# 文档索引

## 当前推荐四武器体验：Demo V3.14

- 入口：`../Cubicle-Survivor-demo/demo-v3-14.html`。
- 范围：完整继承 Demo V3.13 的战斗、数值、17 关与成长，只压缩武器、经验、模块和组件决策页的信息密度。
- 版本说明：`DEMO_V3_14_DECISION_DENSITY_PASS.md`。
- Demo V3.13 及更早入口继续作为回归快照保留；版本边界以 `CURRENT_BASELINE.md` 为准。

## Demo V3.8 回归说明

- 入口：`../Cubicle-Survivor-demo/demo-v3-8.html`。
- 范围：完整继承 Demo V3.7 的数值和穿戴结构，让冷凝与热浪压力装置在每轮真实攻击时分别形成贴身冰霜/高温蒸汽半环并产生短促后坐。
- 马克笔说明：`DEMO_V3_6_MARKER_EMBODIMENT_PASS.md`。
- 保温杯说明：`DEMO_V3_7_THERMOS_PRESSURE_RIG_PASS.md`。
- 泄压反馈说明：`DEMO_V3_8_THERMOS_BACK_PRESSURE_PASS.md`。
- Demo V3.7 及更早入口继续作为回归快照保留；版本边界以 `CURRENT_BASELINE.md` 为准。

## 当前独立机制实验：马克笔三分钟欲望闭环

- 入口：`../Cubicle-Survivor-demo/marker-desire-loop.html`；继续作为独立实验保留，不与正式 Demo 版本混用数值。
- 实验说明：`MARKER_DESIRE_LOOP_EXPERIMENT.md`。
- 全武器复用规范：`WEAPON_VISUAL_DESIGN_STANDARD.md`，统一约束可见部件所有权、穿戴挂点、朝向、判定因果、霓虹状态语法与视觉验收。

## 下一目标：Demo V2

- `DEMO_V2_PRODUCTION_BRIEF.md`：Demo V2 的目标、三武器/六形态/六模块冻结范围、敌人生态、8–10 分钟节奏、制作门禁和明确不做事项。
- `DEMO_V2_MARKER_FIXED_TEST.md`：Demo V2.1 马克笔固定测试的 17 关配额、10 秒收集期、Boss 双条件、经验属性商店、组件经济与阶段 4 数值限制。
- `DEMO_V2_CORRECTION_FLUID_FIXED_TEST.md`：Demo V2.5 修正液的三层错误、错误扩散、致命纠错、组件与赛博故障视觉边界。
- `DEMO_V2_6_FOUR_WEAPON_NEON_TEST.md`：Demo V2.6 四武器统一入口、机制隔离规则与疯狂办公室霓虹视觉合同。

当前推荐公开试玩是 Demo V3.14 四武器固定套件；完整 Demo V1、Demo V2.6 和四个单武器入口继续作为机制与流程回归入口保留。

## 当前可运行主线：Demo V1

进入 `v2-framework/`。

重点文件：

- `CURRENT_BASELINE.md`（任何工作开始前先读）
- `DEMO_V1_MECHANIC_AUDIT.md`（三武器 15 形态与增强层唯一审计表）
- `DEMO_V1_VISUAL_EVENT_MAP.md`（71 个武器事件源到视觉时间线、拓扑与主次层级的映射）
- `DEMO_V1_VISUAL_ASSET_AUDIT.md`（底层视觉资产白名单、清洗记录与浏览器验收规则）
- `WEAPON_VISUAL_DESIGN_STANDARD.md`（跨版本武器实体所有权、安装关系、坐标跟随、攻击判定与成长轮廓硬规范）
- `DEMO_V1_AUDIO_EVENT_MAP.md`（71 个武器事件源到音色、阶段、限流与主次混音的映射）
- `DEMO_V1_PACING_PASS.md`（16 关时长、刷怪、Boss 韧性与三条实战路径数据）
- `DEMO_V1_TAPTAP_DIRECTION.md`（TapTap 目标、当前体验优先级与下一轮玩家验收标准）
- `v2-core-review-principles.md`
- `v2-framework/merged-build-framework.md`
- `v2-framework/step1-core-rules-v2.md`
- `v2-framework/step2-ability-budget.md`
- `v2-framework/step3-build-profiles.md`
- `v2-framework/step4-stage-exams.md`
- `v2-framework/step5-combat-log.md`
- `v2-framework/visual-design-spec-v03.md`
- `v2-framework/reforged-prototype/INDEX.md`

## 旧框架：v1.0

进入 `v1-legacy/`。

这些文档用于理解旧版“武器 + 道具 + 属性成长”的设计，不作为 v2.0 默认实现依据。

## 历史归档

进入 `archive/`。

这里存放会话记录、调试报告、拆分代码快照和废弃参考。保留用于追溯，不作为当前主线入口。
