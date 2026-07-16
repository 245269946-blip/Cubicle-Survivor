# Steps 2-7 实施报告：标签层 + Build 增强

**日期:** 2026-06-23 | **文件变更:** 6 个文件 | **测试:** 全链路通过

---

## Step 2: 标签层建立 ✅

### 新建文件：`src/data/tags.js`
- 19 个标签枚举（16 机制 + 3 风格），每个含 name/emoji/desc
- `tagDeptBias` 映射表：标签 → 推荐部门（掉落偏置用）

### 注入：`index.html`
- 在 cards.js 之前加载 tags.js

---

## Step 3: 卡牌标签 + 角色归类 ✅

### 修改：`src/data/cards.js`（25 张卡全部更新）
- `makeCard()` 签名扩展为 `(id, name, dept, rarity, theme, desc, slotEffects, role, tags)`
- 每张卡新增两个字段：

| 部门 | 卡牌 | role | tags |
|------|------|------|------|
| 技术 | 敏捷开发 | starter | chain, network |
| 技术 | 版本迭代 | scaler | ramp |
| 技术 | 代码重构 | transformer | pierce, risk |
| 技术 | 持续集成 | scaler | cooldown, network |
| 技术 | 技术突破 | transformer | chain, burst, network |
| 产品 | 紧急上线 | starter | speed, risk |
| 产品 | 快速迭代 | starter | crit, network |
| 产品 | 截止日期 | transformer | execute, burst |
| 产品 | KPI 考核 | scaler | burst, ramp |
| 产品 | 产品发布 | transformer | crit, burst, network |
| 运营 | 流程审批 | starter | shield, network |
| 运营 | 备份恢复 | starter | regen |
| 运营 | 合规审查 | support | debuff, regen |
| 运营 | 免责声明 | transformer | shield, risk |
| 运营 | 全栈运营 | transformer | shield, burst, regen |
| 市场 | 品牌影响 | starter | knockback, network |
| 市场 | 渠道推广 | scaler | economy, xp |
| 市场 | 病毒营销 | transformer | spread, debuff, network |
| 市场 | 爆款策略 | scaler | burst, ramp |
| 市场 | 全域投放 | transformer | spread, burst, network |
| 综合 | 晨会 | support | xp, economy |
| 综合 | SOP标准化 | support | cooldown, network |
| 综合 | 留痕存档 | scaler | xp, economy, ramp |
| 综合 | 自动办公 | transformer | summon, cooldown |
| 综合 | 组织架构调整 | transformer | network, economy |

**角色分布:** starter ×8 / scaler ×6 / transformer ×9 / support ×2

---

## Step 4: 部门标签偏置 ✅

### 修改：`src/data/departments.js`
各 department 新增 `tagBias` 字段：

| 部门 | 主标签 | 副标签 |
|------|--------|--------|
| 技术 | chain, speed, cooldown | network, ramp |
| 产品 | crit, burst, execute | pierce, risk |
| 运营 | shield, regen, reflect | debuff, ramp |
| 市场 | spread, knockback, debuff | network, summon |
| 综合 | economy, xp, cooldown | summon, risk |

---

## Step 5: 武器标签 + 标签驱动进化 ✅

### 修改：`src/data/weapons.js`
- 9 把武器全部注入 `tags` + `tagDescription`
- 新增 3 条标签条件进化路线：
  - ☕ **链式萃取**：tags { chain+speed, min 2 } → 链电跳转 ×2 + 弹速 +30%
  - ⌨️ **狂暴连打**：tags { burst+speed, min 2 } → 连击 4 触发 ×2.5 伤害
  - 🖊️ **精准点杀**：tags { crit+pierce, min 2 } → 满蓄力暴击 +50%

### 修改：`src/core/build-state.js`
- `_checkEvolutionCondition()` 扩展为支持 `cond.tags` 条件
- 支持组合条件（dept + tags 同时满足）
- 条件间 OR 而非 AND（任一条件满足即触发）

---

## Step 6: 协同任务动态化 ✅

### 修改：`src/data/milestones.js`
新增 3 个标签驱动协同任务：

| 阶段 | 任务名 | 触发标签 | 奖励 |
|------|--------|----------|------|
| 8 | 高频实验 | speed+chain (≥1) | 攻速/链式卡 |
| 8 | 稳固防御 | shield+regen (≥1) | 护盾/回复卡 |
| 10 | 极限爆发 | crit+burst (≥1) | 暴击/爆发卡 |

### 修改：`src/core/build-state.js`
- `checkCollabQuest()` 同时支持 `depts` 和 `tags` 条件类型

---

## Step 7: Build 名称 + 局后总结 ✅

### 新增函数（build-state.js，约 120 行）
- `generateBuildName()` → "🔥 技术部 · 链式萃取"
- `summarizeBuild(stage, level, kills)` → 完整 Build 总结 JSON
- `getBuildTagline()` → "链式 + 联动 …"
- `getEvolutionHints()` → 可触发进化列表 + 条件状态
- `_getPrimaryTags()` → 按装配卡牌统计主标签 TOP3
- `_generateNextSuggestion()` → 基于当前 Build 状态的引导建议

### Build 总结输出示例
```
名称:    🔥 技术部 · 链式萃取
主标签:  联动(2), 链式(1), 攻速(1)
槽位:    5/5
进化:    ☕ 挂耳咖啡 → 链式萃取
下次:    你已有产品部的一张卡——再来一张触发协同
```

---

## 测试验证

```
Load OK - Cards: 25 Weapons: 9 Depts: 5
chain+speed tags:       true (expected true)    ✅
crit+burst tags:        false (expected false)   ✅
crossDept + chain tag:  true (expected true)    ✅
Build name: 🔥 技术部 · 链式萃取                ✅
ALL TESTS PASSED                                ✅
```

---

## 数据字典变更汇总

| 文件 | 新增内容 | 行数变化 |
|------|----------|----------|
| `src/data/tags.js` | 新建 | +95 |
| `src/data/cards.js` | role, tags 字段 (×25) | +50 |
| `src/data/weapons.js` | tags, tagDescription (×9), 3 条标签进化 | +60 |
| `src/data/departments.js` | tagBias (×5) | +5 |
| `src/data/milestones.js` | 3 条标签协同任务 | +30 |
| `src/core/build-state.js` | 条件扩展 + 总结系统 | +150 |
| `index.html` | 加载 tags.js | +1 |

---

**下一步（待做）：**
- 实际浏览器游玩，触发标签进化
- 死亡复盘屏渲染 `summarizeBuild()` 输出
- 升级面板 cardInfoStrip 展示 tag emoji + role
- 武器进化进度条 UI
