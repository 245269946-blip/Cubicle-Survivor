# 第 5 步：战斗日志与统计 — 用数据替代感觉

**日期：2026-06-22**
**前提：前 4 步完成。第 5 步是"以后怎么调"的基础设施。**

---

## 5.0 目标

> **每次对局结束后，能从数据里回答：**
> - "这个 Build 到底强不强？"
> - "那个协同触发了几次？"
> - "玩家为什么死了——是 DPS 不够还是走位出问题？"
> - "第 N 关的通过率是多少？"

---

## 5.1 需跟踪的指标

### 5.1.1 对局级指标（每次游戏记录一条）

```
{
  runId: "2026-06-22-001",
  timestamp: "2026-06-22T12:30:00",
  buildProfile: {
    primaryDepartment: "技术",
    secondaryDepartment: "产品",
    activeSlots: ["天赋", "技能", "努力"],
    weapons: ["coffee", "calculator", "keyboard"],
    weaponCount: 3
  },
  startWeapon: "coffee",
  badgeDepartment: "技术",
  
  outcome: {
    result: "death",           // "death" | "clear" | "endless_quit"
    deathStage: 11,
    deathCause: "audit",       // enemy type
    deathDamageType: "melee",  // "melee" | "ranged" | "contact"
    stagesCleared: 10,
    endlessWaves: 0
  },
  
  stats: {
    totalKills: 847,
    totalDamage: 56340,
    totalDamageReceived: 892,
    totalHealing: 1240,
    totalMaterials: 312,
    totalXp: 4280,
    levels: 18,
    playTime: 623              // seconds
  },
  
  cards: [
    { id: "agile_dev", department: "技术", slot: "天赋", rarity: "common", acquiredAt: "stage2_lv3" },
    { id: "version_iter", department: "技术", slot: "技能", rarity: "common", acquiredAt: "stage3_lv6" },
    // ...
  ],
  
  synergiesTriggered: [
    { id: "talent_skill", count: 12 },
    { id: "tech_product", count: 45 },
  ],
  
  bossFights: [
    { stage: 5, boss: "emergency", duration: 18, weaponDamages: { coffee: 2340, calculator: 1890 } },
    { stage: 10, boss: "audit", duration: 34, weaponDamages: { ... } },
  ],
  
  weaponStats: [
    { weapon: "coffee", level: 7, damage: 28450, kills: 423, crits: 128 },
    { weapon: "calculator", level: 5, damage: 15670, kills: 310, chains: 840 },
    // ...
  ],
  
  decisions: [
    { stage: 0, type: "start", choice: "coffee", options: ["coffee","keyboard","stapler"] },
    { stage: 1, type: "levelup_lv2", choice: "agile_dev_talent", options: ["agile_dev_talent","sop_defense","backup_move"] },
    // ...
  ],
  
  upgradesChosen: [
    { weapon: "coffee", upgradeId: "coffeePierce", count: 2 },
    { weapon: "coffee", upgradeId: "coffeeSpeed", count: 1 },
    // ...
  ]
}
```

### 5.1.2 聚合级指标（跨对局统计）

```
{
  totalRuns: 120,
  totalClears: 18,
  clearRate: 0.15,
  
  // 各 Build 通关率
  buildClearRates: {
    "tech_talent+skill+effort": { runs: 22, clears: 5, rate: 0.23 },
    "prod_talent+effort+network": { runs: 15, clears: 2, rate: 0.13 },
    // ...
  },
  
  // 各关通过率
  stagePassRates: {
    1: 0.98, 2: 0.94, 3: 0.87, 4: 0.76, 5: 0.62, 
    6: 0.45, 7: 0.31, 8: 0.22, 9: 0.15, 10: 0.10,
    11: 0.06, 12: 0.03, 13: 0.02, 14: 0.01
  },
  
  // 最常见的死亡关卡
  topDeathStages: [
    { stage: 5, count: 28 },
    { stage: 6, count: 22 },
    { stage: 8, count: 16 },
  ],
  
  // 最常被选的卡牌（选率/胜率）
  cardStats: {
    "agile_dev": { pickRate: 0.68, winRateWhenPicked: 0.42 },
    "deadline": { pickRate: 0.55, winRateWhenPicked: 0.38 },
    // ...
  },
  
  // 各武器 DPS 均值
  weaponPerformance: {
    "keyboard": { avgDps: 85, avgLevel: 5.2, pickRate: 0.45 },
    "coffee": { avgDps: 72, avgLevel: 6.1, pickRate: 0.62 },
    // ...
  }
}
```

---

## 5.2 实现方案

### 5.2.1 数据结构

```js
game.runLog = {
  startTime: Date.now(),
  weaponDamages: {},         // { coffee: 0, keyboard: 0, ... }
  weaponKills: {},           // { coffee: 0, keyboard: 0, ... }
  weaponCrits: {},
  weaponChains: {},          // 链电跳跃次数
  cardAcquired: [],          // [{ cardId, slot, department, rarity, atStage, atLevel }]
  synergiesTriggered: {},    // { "tech_product": 45 }
  decisions: [],             // [{ type, choice, options, atStage }]
  bossFights: [],            // [{ stage, boss, damageDealt, duration, weaponDamages }]
  deathRecap: null,          // 死亡时填充
  materialsEarned: 0,
  materialsSpent: 0,
  upgradesChosen: [],        // [{ weapon, upgradeId, stage }]
};
```

### 5.2.2 注入点

| 事件 | 注入什么 |
|------|---------|
| 武器造成伤害 | `runLog.weaponDamages[source] += damage` |
| 武器击杀敌人 | `runLog.weaponKills[source]++` |
| 暴击发生 | `runLog.weaponCrits[source]++` |
| 链电跳跃 | `runLog.weaponChains[source] += jumps` |
| 获取卡牌 | `runLog.cardAcquired.push(...)` |
| 协同触发 | `runLog.synergiesTriggered[id]++` |
| 升级选择 | `runLog.decisions.push({ type: "levelup", ... })` |
| Boss 战开始/结束 | `runLog.bossFights.push(...)` |
| 玩家死亡 | `runLog.deathRecap = buildDeathRecap()` |
| 对局结束 | 写入 localStorage |

### 5.2.3 存储

```js
// 单局日志（保留最近 20 局）
const HISTORY_KEY = "cb_run_history";
const MAX_HISTORY = 20;

function saveRunLog(log) {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  history.unshift(log);
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// 聚合统计（滚动更新）
const STATS_KEY = "cb_aggregate_stats";
function updateAggregateStats(log) {
  const stats = JSON.parse(localStorage.getItem(STATS_KEY) || "{}");
  // 增量更新各项指标...
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}
```

---

## 5.3 死亡复盘增强

现有 `renderDeathRecap` 已经不错。增强方向：

### 当前有的（保留）
- 死因（敌人类型）
- 伤害类型
- 最近受击记录
- 提示（getDeathHints）

### 要加的
```
死亡复盘面板新增：

1. 本局伤害分布饼图（文字版）
   咖啡    ████████████████████  48%
   计算器  ████████████          28%
   键盘    ██████                15%
   协同    ████                  9%

2. 每关时间/击杀对比
   第 5 关：用时 38s，击杀 124 ← 正常
   第 6 关：用时 52s，击杀 89  ← 耗时上升
   第 7 关：用时 65s，击杀 62  ← DPS 不足预警 → 第 7 关死
   
3. Build 评分（自动生成）
   "你的部门投资：技术 Lv.3 — 深度投入，链电效果 +16%"
   "未触发协同：敏捷创新 — 你缺一张产品卡"
   "浪费的槽位：人脉槽只有 1 张卡，效果仅 70%"

4. "下次试试"建议（基于 Build 分析）
   "试试把'截止日期'从天赋槽移到努力槽——半血以下伤害从 +40% 变 +80%"
   "你的运营堡垒打了 8 关，DPS 偏低。下次试试加一把产品武器触发'快速上线'协同"
```

---

## 5.4 实时 HUD 信息

游戏中可看到的基础统计（不等到复盘）：

```
当前已有：
  - 时间 / 关卡 / 等级 / 击杀数 / 材料数 / 血量 / 经验

新增（在 HUD 上加一个可折叠的统计面板，按 Tab 键切换）：

  武器伤害排行（最近 10 秒）
  1. 咖啡      1,240
  2. 计算器    980
  3. 键盘      420
  4. 耳机      180 (光环)

  活跃协同
  ✅ 敏捷创新（暴击→链电）触发 45 次
  ✅ 学以致用（天赋+技能）加成 1.10×
  
  卡牌流派
  技术 🔥 Lv.3 (+16%)
  产品 ⚡ Lv.2 (+8%)
  
  本关进度
  Boss 剩余 HP ████████░░ 78%
```

（这个统计面板不做太复杂，保持纯文字，不破坏幸存者类的沉浸感。）

---

## 5.5 后续平衡怎么用这些数据

| 问题 | 看哪个数据 |
|------|-----------|
| 某个 Build 太强 | buildClearRates > 30% → 该 Build 中哪张卡超标 |
| 某个 Build 太弱 | buildClearRates < 5% → 哪个短板导致死亡 |
| 第 N 关是"鬼门关" | stagePassRates 骤降 → 该关的考试是否过难 |
| 某张卡没人选 | pickRate < 15% → 效果太弱 or 描述不清 |
| 某张卡选了必赢 | winRateWhenPicked > 50% → 数值超标 |
| 某个协同从不触发 | 触发次数 0 → 前置条件太苛刻 |

**第 5 步完成。五步全部覆盖。**

---

## 5.6 五步完成度总览

| 步骤 | 文档 | 状态 |
|------|------|------|
| ① 冻结核心公式 | `step1-core-rules-v2.md` | ✅ 全部公式锁死，healthMult 简化 |
| ② 能力预算表 | `step2-ability-budget.md` | ✅ 槽位功率系数 + 部门缩放 + 禁止组合 |
| ③ Build 长短板 | `step3-build-profiles.md` | ✅ 10 种 Build 完整剖面 + 长短板 + "不能获得" |
| ④ 关卡考试逻辑 | `step4-stage-exams.md` | ✅ 14 关每关考什么 + 敌人功能职责 |
| ⑤ 战斗日志统计 | `step5-combat-log.md` (本文档) | ✅ 跟踪指标 + 存储方案 + 复盘增强 |
