# Build Pipeline 实机调试 — 2026-06-22 18:20-18:45

## 目标
在浏览器中运行 v0.3 Build 系统，验证卡牌选择→槽位放置→桥接函数→战斗效果的完整管线。

## 发现的关键 Bug

### 🔴 BUG 1: 槽位 ID 命名不一致 (mechanic vs mechanism)
- **症状**: `applyCardEffects` 崩溃 `Cannot read properties of undefined (reading 'effectType')`
- **根因**: UI 和直觉用 `mechanism`，但 `getAllSlotIds()` 和 `slotEffects` 用 `mechanic`
- **修复**: 统一为 `mechanic` 或添加 alias 映射
- **影响**: `selectCardForSlot(card, 'mechanism')` → `card.slotEffects['mechanism']` → undefined → crash

### 🔴 BUG 2: rAF 游戏循环在自动化 Chrome 中死亡
- **症状**: `requestAnimationFrame(loop)` 注册后不执行，`waveTime=0` 持续
- **根因**: Chrome 自动化场景下后台标签页 rAF 被限速/暂停
- **临时方案**: `for(var i=0;i<N;i++) updateGame(0.016)` 批量推帧
- **建议**: 在 `loop()` 中加入 `setInterval` fallback

### 🔴 BUG 3: 卡牌选择 UI 按钮不响应
- **症状**: snapshot `@ref` 点击 + CSS `.card-option` 选择器均无法选中卡牌
- **症状**: 槽位 `放入此槽` 按钮点击不生效
- **根因**: DOM 按钮事件处理链路有问题，可能在 `openUpgrade()` 或 `renderCardChoices()` 中
- **临时方案**: `CS.buildState.selectCard()` + 手动调用桥接函数完全 bypass UI

### 🟡 BUG 4: WASD 键盘输入无法通过 eval 模拟
- **症状**: 玩家卡在原点 (2400,1500)，无法移动/杀敌
- **根因**: `KeyboardEvent` dispatch 不修改游戏内 `keys` Set；`add` 到 Set 后 rAF 又不在跑
- **临时方案**: 在 `keys` Set 中添加方向键 + 手动 `updateGame`

### 🟡 BUG 5: `selectCardForSlot` 对 card 对象参数要求严格
- **症状**: `selectCardForSlot('agile_dev', 'mechanic')` → `card.id` undefined
- **根因**: 函数期望 `card` 是完整对象 `{id, department, slotEffects, ...}`，非字符串
- **修复**: 确保调用端传入 `CS.cards[cardId]`

## 验证通过的链路

### ✅ Build State 核心
- `CS.buildState.selectCard(id, slotId)` → 更新 `slotCards`、`deptCardCounts`、`deptMilestones`
- `CS.buildState.getAllSlotIds()` → `["offense","survival","resource","mechanic","cost"]`
- 预设系统: `CS.newbiePresets` 4 个（tech_intern, product_worker, ops_veteran, marketing_newbie）

### ✅ 桥接函数 (正确参数)
- `applyCardEffects(CS.cards.agile_dev, 'mechanic')` → `game.player.chainJumps += 2` ✅
- `applyMilestoneRewards('tech')` → `game._milestoneChainDmg = 0.1` ✅
- `applySynergies()` → 正确设置 `_critChainChance` 等字段 ✅
- `checkMilestonesAndSynergies()` → 仅应用协同，不触发里程碑奖励（需 `applyMilestoneRewards` 独立调用）

### ✅ 战斗系统
- `updateGame(dt)` 手动批量推帧工作正常
- 蛋糕 (coffee) 弹幕 + 链电可见
- Stage 切换 (`startNextStage()`) 正常
- XP 系统 (`gainXp`) 正常触发升级

## 技巧积累

### PowerShell 转义绕过
使用 base64 编码传参：
```powershell
$code = Get-Content "script.js" -Raw -Encoding UTF8
$b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($code))
$evalJS = "(function(){ var s=atob('$b64'); var fn=new Function(s); return fn(); })()"
```
注意: `Function` 构造函数的结果需要 `return` 才能被 eval 捕获

### rAF fallback 思路
```javascript
let _rAFid = requestAnimationFrame(loop);
let _interval = setInterval(() => {
  if (performance.now() - _lastRAF > 200) { /* rAF died */ }
}, 500);
```

### 生产级帧推
每次 1000-3000 帧 (`updateGame(0.016)`) 足够覆盖一个完整 stage + warmup

## 当前游戏状态
- Stage: 2
- Kills: 41
- Build: 3 张 tech 卡（agile_dev/mechanic, version_iter/offense, code_refactor/survival）
- Milestones: [2, 3, 4]
- Chain Dmg bonus: +0.7
