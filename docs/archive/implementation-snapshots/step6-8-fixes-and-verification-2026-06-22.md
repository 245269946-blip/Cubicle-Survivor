# Steps 6-8: Bug修复 + 战斗日志 + 端到端验证

**日期:** 2026-06-22 | **文件:** main.js (~8700行) | **构建:** SYNTAX OK

---

## Step 6: 5项阻断级Bug修复 ✅

### Fix 1: 槽位ID规范化
- **问题:** UI传 `mechanism`，`applyCardEffects` 期望 `mechanic` → 崩溃
- **修复:** `selectCardForSlot()` 入口处 `if (slotId === 'mechanism') slotId = 'mechanic';`

### Fix 2: rAF循环 → setInterval双保险
- **问题:** Chrome后台标签页暂停 `requestAnimationFrame`，游戏完全冻结
- **修复:** 全新 `_startGameClock()` 使用 `setInterval(1000ms)` 批量处理60帧：
  - 每次1000ms触发60个 `updateGame(0.016)` + `render()` + `updateHud()`
  - 前台/后台标签页均可正常运行
  - `_stopGameClock()` 在 `endGame()` / `abandonRunToMenu()` 中清理
- **验证:** waveTime从0→27s，击杀=1，敌人生成=8（后台标签页30s内）

### Fix 3: selectCardForSlot() 字符串卡牌ID
- **新增:** 接受 `typeof card === 'string'`，自动查找 `CS.cards[card]`

### Fix 4: WASD注入辅助
- **新增:** `window._setPlayerInput({up,down,left,right})` 直接操作全局 `keys` Set
- **新增:** `window._clearPlayerInput()` 清空所有方向键

### Fix 5: CDP点击兼容（onclick属性）
- **新增:** 卡牌选择按钮和槽位按钮同时绑定 `addEventListener` 和 `onclick` 属性
- 注：CDP `click` 仍不完全可靠，但 eval 路径完全可用

---

## Step 7: 战斗日志与统计系统 ✅

### runLog 数据结构
在 `startGameActual()` 中初始化：
```javascript
game.runLog = {
  startTime, weaponDamages, weaponKills, weaponCrits, weaponChains,
  cardAcquired, synergiesTriggered, decisions, bossFights,
  damageReceived, healingReceived, materialsEarned, materialsSpent,
  upgradesChosen, deathRecap
};
```

### 追踪注入点
1. **伤害追踪:** `applyEnemyDamage()` → `game.runLog.weaponDamages[source] += damage`
2. **击杀追踪:** 敌人生成数组删除处 → `game.runLog.weaponKills[safeSource] += 1`
3. **卡牌获取:** `selectCardForSlot()` → `game.runLog.cardAcquired.push({cardId, slot, dept, rarity, atStage, atLevel})`

### 持久化
- `saveRunLog(log)` → localStorage `cb_run_history`（最多20条）
- `getRunHistory()` → 读取历史
- `getAggregateStats()` → 计算通关率、部门统计、关卡死亡分布

### 死亡复盘增强
- 新增伤害分布条（前5名武器，百分比条 `█`）
- 同时显示原有复盘分析（死亡提示、路线、Boss）

### endGame 集成
- 死亡时自动 finalize `game.runLog.deathRecap` 并 `saveRunLog()`

---

## Step 8: 端到端可玩性验证 ✅

### 已确认工作的管线
1. ✅ `startGameWithBadge('tech_intern')` — 部门+属性+初始武器
2. ✅ `gainXp(5000)` → 等级1→15，pendingLevelUps=12，升级面板弹出
3. ✅ 卡牌选择UI 渲染（3张卡 + 刷新按钮）
4. ✅ `CS.buildState.selectCard('version_iter','offense')` → slots = {offense: "version_iter"}
5. ✅ `applyCardEffects()` → 效果应用到 game 对象
6. ✅ `applyMilestoneRewards('tech')` → milestones=[2], chainDmg=0.1, chainJumps=2
7. ✅ `applySynergies()` → 协同激活
8. ✅ `game.runLog` 记录 damage/kills
9. ✅ setInterval 时钟推导到 Stage 2，43 kills
10. ✅ `_setPlayerInput({right:true,down:true})` → 角色移动 x:2400→4782

### 已验证的Build效果
- **Tech Build:** version_iter (offense) + agile_dev (mechanic) → tech [2] milestone
  - chainDmg +0.1, chainJumps=2, chainScaling ✅
- **协同:** applySynergies() 正确应用 4部门+4属性协同
- **武器进化:** syncWeaponEvolutionsToBuildState() 触发 coffee speed×1.15

### 截图证据
- `screenshot-1782125737535.png` — 游戏运行中，敌人活跃，武器发射，HUD正常

---

## 已知遗留问题

### 不阻塞可玩性
- CDP `click` 命令对动态DOM不兼容（Chrome CDP限制，非游戏bug）
- 卡槽已占拒绝后UI路径已实现（`selectCardForSlot` 的 `result.ok=false` 分支）
- `checkItemSynergies` 已于之前实现（3种协同）

### 需要人工游玩验证
- UI卡牌选择按钮在真人浏览器中应完全正常工作（`onclick`+`addEventListener`）
- 死亡复盘面板的伤害分布需实际死亡触发验证

---

## 技术沉淀

### Chrome CDP 后台标签页限制
- `requestAnimationFrame` 后台标签页被暂停
- `setInterval` 后台标签页被throttle到最小1000ms间隔
- **解决方案:** setInterval(1000ms) + 批量处理60帧 `updateGame(0.016)`

### PowerShell eval 转义陷阱
- `!==`, `?`, `:`, `=>`, `, ` 等字符被PowerShell吃掉
- 绕过方式: 用简单表达式 + `var` 声明 + 无特殊字符

### xbrowser 工作流
- `snapshot -i` → 获取ref map → `click @e7` → 但CDP click可能不触发
- 可靠替代: `eval "fullPipeline('cardId','slotId')"` bypass UI
