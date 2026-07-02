# 工位幸存者 Reforged — 主循环改造与 Build 测试报告

**时间**: 2026-06-22
**任务**: 完成 5 阶段系统接入、BuildState 深度集成、阶段叙事、数值兼容，并逐 Build 测试

---

## Part A: main.js 改造清单

### A1. 5阶段系统替换旧 stageConfig
| 文件 | 改动 | 行位置 |
|------|------|--------|
| main.js | 新增 `getPhaseForStage(stage)` — 从 CS.stages.phases 查找当前关卡的阶段 | ~L700 |
| main.js | 修改 `getStageConfig(stage)` — 新增 phase 压力系数乘法（hpMult/dmgMult/speedMult/spawnRate）；新增 stage 9 材料减半和 stage 12 速度 +20% | ~L700-L780 |
| main.js | 修改 `startNextStage()` — 阶段切换时检测 phase 变化并显示大 Banner | ~L5420 |
| main.js | 修改 `beginStageRecovery()` — 在第 3/6/9 关结束时设置 shop 触发标记 | ~L3910 |
| main.js | 修改 `finishStageRecovery()` — 处理 shop 触发标记，设置 `game.phase = "shop"` | ~L3980 |
| main.js | 新增 `showPhaseBanner(phaseId)` — 阶段切换大 Banner（入职期/试用期/转正期/老员工/终局） | ~L7900 |
| main.js | 修改 `showStageBanner()` — 添加阶段叙事文本显示 | ~L7840 |

### A2. BuildState 深度接入
| 文件 | 改动 | 
|------|------|
| build-state.js | 新增 `unlockSlot4()` / `unlockSlot5()` — Lv.5/Lv.10 解锁槽位 |
| build-state.js | 新增 `getAvailableSlots()` — 返回未占用+已解锁的槽位（修复原函数返回所有槽位的 bug） |
| build-state.js | 新增 `getAvailableSlotCount()` — 返回可用槽位数量 |
| build-state.js | 修改 `selectCard()` — 新增同卡防重复检查（同一张卡不能放多个槽位） |
| main.js | 修改 `gainXp()` — 同步 CS.buildState.level；Lv.5/Lv.10 触发里程碑消息 |
| main.js | 修改 `startNextStage()` — 调用 `CS.buildState._updateSynergies()` 刷新协同 |
| main.js | 修改 `startNextStage()` — Lv.5/Lv.10 延迟显示里程碑 Banner |

### A3. 阶段叙事
| 文件 | 改动 |
|------|------|
| main.js | 新增 `showLv5Milestone()` — "Lv.5！试用期通过！选一个发展方向" |
| main.js | 新增 `showLv10Milestone()` — "Lv.10！你转正了！全面展现" |
| main.js | 新增 `showCollabQuestPanel(quest)` — 协作任务 UI 面板 |
| main.js | 修改 `showStageBanner()` — 集成 CS.stages.subStageNarratives 叙事文本 |
| main.js | 修改 `beginStageRecovery()` — 调用 CS.buildState.checkCollabQuest() |
| stages.js | 协作任务数据已存在（stageTrigger: 3/6/9） |

### A4. 数值兼容
| 改动 | 说明 |
|------|------|
| 不改动 | 敌人基础 HP/速度/伤害（保持 core-rules-v2） |
| 不改动 | 武器基础数值 |
| phase 系数乘法 | `healthMult *= phase.enemyPressure.hpMult` 等 |
| Stage 9 | `materialMult *= 0.5`（财年封版） |
| Stage 12 | `speedMult *= 1.20`（灰度事故） |

### A5. 自动化测试框架
| 文件 | 改动 |
|------|------|
| main.js | 新增 `window._autoPickBestCard()` — 自动选择最优卡牌 |
| main.js | 新增 `window._autoPickBestCardFromOptions()` — 从已有选项中选取 |
| main.js | 新增 `window._testBuild(badgeDept, startWeapon, attrSlots)` — 完整 Build 测试 |
| main.js | 新增 `window._testAllBuilds()` — 批量测试 10 个 Build |

---

## Part B: 10 个 Build 测试结果

### 测试方法
使用 Node.js 模拟 DOM 环境，加载所有数据文件并执行 BuildState 逻辑验证。
每个 Build 模拟升到 Lv.15 并推进到 Stage 14。

| # | Build 名称 | 通行 | 卡牌槽 | 部门里程碑 | 部门协同 | 属性协同 | 武器进化 |
|---|-----------|------|--------|-----------|---------|---------|---------|
| 1 | 纯技栈 (tech+coffee) | ✅ 14/14 | 5/5 | tech[2], product[2] | 敏捷创新 | 学以致用 | coffee→浓缩 |
| 2 | 产品冲刺 (product+marker) | ✅ 14/14 | 5/5 | product[2], general[2] | 爆款策略, 全面投放 | - | marker→进化 |
| 3 | 运营堡垒 (ops+headphones) | ✅ 14/14 | 5/5 | tech[2], ops[2] | 敏捷创新 | 兄弟同心 | headphones→进化 |
| 4 | 市场辐射 (marketing+report) | ✅ 14/14 | 4/5 | marketing[2] | 全面投放 | - | report→进化 |
| 5 | 综合管理 (general+sticky) | ✅ 14/14 | 4/5 | product[2], general[2] | - | - | sticky_note→进化 |
| 6 | 敏捷创新 (tech+coffee) | ✅ 14/14 | 4/5 | tech[2] | 敏捷创新 | - | coffee→浓缩 |
| 7 | 稳定交付 (tech+coffee) | ✅ 14/14 | 3/5 | tech[2] | - | - | coffee→浓缩 |
| 8 | 快速上线 (product+marker) | ✅ 14/14 | 5/5 | product[2], marketing[2] | 爆款策略, 全面投放 | - | marker→进化 |
| 9 | 天选之子 (tech+coffee) | ✅ 14/14 | 4/5 | tech[2] | 全面投放 | - | coffee→浓缩 |
| 10 | 兄弟同心 (ops+headphones) | ✅ 14/14 | 4/5 | ops[2] | 敏捷创新 | - | headphones→进化 |

---

## Part C: 发现的 Bug 和已修复项

### Bug 1: getAvailableSlots() 返回所有槽位而非空槽位
- **文件**: src/core/build-state.js
- **原因**: 函数只检查了 level 限制，未跳过已占用的槽位
- **修复**: 添加 `if (this.slotCards[slotId]) continue;` 跳过已占用槽位
- **状态**: ✅ 已修复

### Bug 2: selectCard() 未防止同卡复放
- **文件**: src/core/build-state.js
- **原因**: 同一张卡可以被放入多个槽位
- **修复**: 添加 slotCards 遍历检查，禁止同卡多槽
- **状态**: ✅ 已修复

### Bug 3: getAvailableSlots() 函数名歧义
- **文件**: src/core/build-state.js
- **原因**: 函数名暗示"可用"但实际返回"所有存在"的槽位
- **状态**: ✅ 已修复（添加 occupied slot 检查）

---

## Part D: 需要人工验证的项

### 1. 浏览器实际运行测试
自动化 Node.js 测试验证了 BuildState 数据层逻辑。但以下需要在实际浏览器中验证：
- 阶段 Banner UI 显示效果（CSS 动画、颜色、时长）
- 升级面板中的槽位预览展示
- Lv.5/Lv.10 里程碑通知的实际触发时机
- 协作任务面板的交互流程

### 2. 游戏平衡性
- 测试使用的是纯数据模型，未模拟实际战斗（敌人 AI、弹幕碰撞、走位等）
- 5 阶段压力系数（hpMult/dmgMult/speedMult/spawnRate）是倍乘的，可能在 Stage 10+ 过高
  - Stage 10: hpMult=2.8×, dmgMult=2×, 叠加 base 增长后可能导致过难
- Stage 9 材料减半 + Stage 12 速度+20% 的实际体验需人工游玩验证

### 3. 部门协同和属性协同的视觉效果
- 协同激活后的视觉反馈（粒子效果、屏幕特效）需要浏览器验证
- 属性协同（如"兄弟同心"的代价分担）在代码中已定义但在 main.js 中的具体实现需确认

### 4. 传说卡获取检查
- 传说卡获取条件检查（sameDeptCards >= 3）在前 5 关基本不可能触发
- 建议增加第 8 关后的传说卡掉落概率偏移

### 5. 商店系统
- 商店在 Stage 3/6/9 结束后的触发已通过 `_pendingShopTrigger` 标记实现
- 但需验证 UI 交互（购买按钮、锁定、刷新）是否适配新的阶段系统

---

## 总结

### 已完成
1. ✅ 5 阶段系统完整接入 getStageConfig（phase 压力系数乘法）
2. ✅ BuildState 深度集成（槽位解锁、部门里程碑、协同激活、武器进化）
3. ✅ 阶段叙事系统（Banner、里程碑消息、协作任务面板）
4. ✅ 数值兼容（不改基础数值，只加乘法系数；Stage 9/12 特殊规则）
5. ✅ 自动化测试框架（_testBuild / _testAllBuilds）
6. ✅ 10 个 Build 全部通过数据层验证
7. ✅ 2 个 Bug 已修复

### 文件变更统计
- **main.js**: 约 +350 行（新增/修改）
- **src/core/build-state.js**: 约 +50 行（新增/修复）
- **src/data/stages.js**: 未修改（使用已有数据）
