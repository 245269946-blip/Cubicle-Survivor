# 工位幸存者 — 核心规则审计报告

**日期：2026-06-22**
**目标：冻结三件事 — 核心公式 · Build长短板 · 成长曲线**

---

## 一、伤害公式（当前实际运行代码）

### 1.1 直击伤害（hitDamage）
```
hitDamage(base) = base × getDamageMult() × (暴击 ? 1.85 : 1)
暴击率 = clamp(player.crit + getClassBonus("crit"), 0, 75) / 100
暴击倍率固定 1.85x，无其他增幅源
```

### 1.2 持续伤害（continuousDamage）
```
continuousDamage(base) = base × getDamageMult() × (1 + clamp(crit, 0, 75) × 0.006)
→ 75%暴击时 = base × getDamageMult() × 1.45
→ 比直击的 1.85x 低，但无随机性（领域/陷阱/碎纸机用此公式）
```

### 1.3 getDamageMult（三级合成）
```
rawDamageMult = player.damageMult          ← 从升级+道具累积
              + getClassBonus("damageMult") ← 精准/近战类加成
              + getBuildFocusDamageBonus()  ← 专注流派奖励
              + hybridBonus.damageMult      ← 全能工位奖励(0.04)

getDamageMult() = softCap(rawDamageMult, 1.82, 2.18, 0.35)
```
**含义：**
- 伤害倍率 ≤ 1.82 时全额生效
- 超过 1.82 后每点只算 0.35
- 绝对上限 2.18

### 1.4 敌人伤害减免（两层）
```
getEnemyLateDamageResistance(enemy):
  s = max(0, stage-2)
  base = 1 / (1 + s×0.07 + max(0,stage-7)×0.05 + max(0,stage-11)×0.05)
  eliteMult = 精英 ? 0.88 : 1

applyEnemyDamage(enemy, amount, source):
  弱点克制: max 1.55x（alarm→report）
  远程惩罚: 距离>200 且 policyRemoteDamagePenalty → ×0.8
  护盾: (1 - clamp(shield, 0, 0.45))
  更新爆发: _updatePowerTimer > 0 → ×1.3
```

---

## 二、攻速与冷却公式

### 2.1 攻速（addPlayerAttackSpeed）
```
rawAttackSpeed = player.attackSpeed + getClassBonus("attackSpeed")
effectiveAS = softCap(rawAttackSpeed, 62, 92, 0.34)

addPlayerAttackSpeed(amount):
  scaled = current ≥ 62 ? amount × 0.42 : amount
  clamped to max 92
```

### 2.2 冷却（cooldown / weaponCooldown）
```
cooldown(base) = max(0.18, base × 100 / (100 + max(-60, effectiveAS)))
→ 0攻速: base × 1.0
→ 62攻速: base × 100/162 = base × 0.617
→ 92攻速: base × 100/192 = base × 0.521

每个武器有独立系数（coffee 0.78, marker 1.25, thermos 0.35 等）
weaponCooldown = cooldown(base × coefficient) × hybridCooldownMult(0.92)
floor: marker=0.42, coffee=0.16, 其他=0.22
```

---

## 三、暴击公式
```
暴击率 = clamp(player.crit + getClassBonus("crit"), 0, 75)%
暴击倍率 = 1.85（固定）
持续伤害暴击 = crit × 0.006 每%（75%时额外×1.45）

获取途径：
- 精准类加成: 2件+4%, 3件+9%, 4件+14%
- 升级选项（从词条池抽取）
- 道具（外文合同等）
```

---

## 四、经验曲线
```
初始 xpNext = 26
每次升级: xpNext = floor(xpNext × 1.24 + 9)

各级所需总经验（前10级）:
Lv.1→2: 26
Lv.2→3: 41
Lv.3→4: 60
Lv.4→5: 83
Lv.5→6: 112
Lv.6→7: 148
Lv.7→8: 192
Lv.8→9: 247
Lv.9→10: 315
Lv.10→11: 400

公式: 每级增长 ~24%，曲线偏陡（第20级约需2400）
```

---

## 五、敌人血量成长（createEnemyByType）

### 5.1 基础血量 × stagePower
| 敌人 | 基础HP | HP公式 | 速度 | 伤害 | XP | 材料 |
|------|--------|--------|------|------|----|------|
| bug | 14r | 18 + stagePower×5 | 72+st×2 | 8 | 4 | 1 |
| change | 13r | 15 + stagePower×4 | 118+st×3 | 7 | 5 | 1 |
| meeting | 22r | 48 + stagePower×10 | 46+st×2 | 10 | 9 | 2 |
| emergency | 20r | 55 + stagePower×11 | 62+st×2.5 | 12 | 11 | 3 |
| deadline | 16r | 30 + stagePower×8 | 72+st×2 | 15 | 8 | 2 |
| intern | 15r | 24 + stagePower×6 | 102+st×3 | 6 | 6 | 2 |
| alarm | 18r | 34 + stagePower×8 | 86+st×2.4 | 9 | 8 | 2 |
| audit | 20r | 58 + stagePower×12 | 52+st×1.6 | 12 | 10 | 3 |
| manager | 21r | 70 + stagePower×14 | 58+st×1.8 | 14 | 12 | 3 |
| boss | 42r | 420 + stagePower×55 | 42+st×0.8 | 22 | 80 | 18 |

### 5.2 关卡缩放（healthMult）
```
healthMult = 1 + stage×0.14 + (stage-1)²×0.028 + max(0,stage-6)×0.09
           + max(0,stage-8)²×0.024 + (stage≥8 ? stage×0.025 : 0)

Stage 1:  1.14x   (bug HP ≈ 26)
Stage 5:  2.39x   (bug HP ≈ 60)
Stage 8:  4.43x   (bug HP ≈ 170)
Stage 10: 6.12x   (bug HP ≈ 270)
Stage 14: 9.52x   (bug HP ≈ 600)
```
**问题**：多项式项过多，难以直观调整。

---

## 六、每关材料产出

### 6.1 单个敌人掉落
```
材料掉落率 = min(0.68, 0.4 + luck×0.00115)
材料数量 = max(1, round(enemy.materialValue × stageConfig.materialMult × getMaterialMult() × policyMult × eliteMult))

getMaterialMult() = 1 + clamp(luck, 0, 260) × 0.0026  (max 1.676x at 260 luck)

stageConfig.materialMult:
  Stage 1: 0.807
  Stage 5: 1.10
  Stage 10: 1.41
  Stage 14: 1.67
```

### 6.2 每关期望材料（估算）
```
Stage 1: ~35 enemies × 0.45 rate × 1 value × 0.807 × 1.0 = ~13
Stage 5: ~70 enemies × 0.50 rate × 1.5 avg × 1.10 × 1.05 = ~61
Stage 10: ~120 enemies × 0.55 rate × 2 avg × 1.41 × 1.15 = ~214
Stage 14: ~165 enemies × 0.60 rate × 2.5 avg × 1.67 × 1.3 = ~537
```
**注**：此为粗略估算，实际变数很大（精英掉落、隐藏协同、政策影响）。

---

## 七、武器升级倍率

### 7.1 基础属性增长（syncWeaponDerivedStats）
| 武器 | 核心属性 | Lv.1→Lv.7 增长 | 总增幅 |
|------|---------|---------------|--------|
| 咖啡 | 冷却 | 0.62→0.38(-39%) | 1.63x 射速 |
| 键盘 | 挥动数 | 1→7 | 7x |
| 订书机 | 弹丸数 | 4→10 | 2.5x |
| 便签 | 半径 | 54→96(+42) | 1.78x |
| 马克笔 | 宽度 | 10→22(+12) | 2.2x |
| 计算器 | 跳跃 | 2→8 | 4x |
| 耳机 | 半径 | 78→150(+72) | 1.92x |
| 报表 | 数量 | 1→7 | 7x |
| 碎纸机 | 射程 | 90→160(+70) | 1.78x |
| 保温杯 | 茶量上限 | 100→200 | 2x |

### 7.2 升级词条加成（applyWeaponUpgradeModifiers）
每个武器有 5-7 个独立 upgradeId（如 coffeePierce, keyboardMacro），
每次升级 4 选 1（含武器特定词条 + 通用词条）。
部分词条可叠 3-5 次。

### 7.3 武器大小软上限（softCapWeaponSize）
```
WSIZE_SOFT_FACTOR = 1.5   (1.5×base = 全增长)
WSIZE_HARD_FACTOR = 2.5   (绝对上限)
WSIZE_TAIL = 0.30         (软上限后增长率)

应用对象: auraRadius, stickyRadius, shredderRange, chainRange,
          thermosRadius, orbitRadius, markerWidth
```

---

## 八、终局/永久改造
（当前代码中未见 permanentUpgradeDefinitions 的具体内容，但有框架函数）
- 5 个永久升级维度（localStorage 持久化）
- 需用工分购买

---

## 九、Build 长短板现状

### 9.1 4 条路线定义（routeDefinitions）
| 路线 | 武器 | 幻想 | 色系 |
|------|------|------|------|
| 精准贯穿 | 咖啡+马克笔 | 激光审稿流 | 紫/青 |
| 键盘风暴 | 键盘+订书机 | 狂敲键盘流 | 蓝/银 |
| 工位雷网 | 便签+计算器 | 电子围栏流 | 黄/绿 |
| 会议结界 | 耳机+报表 | 静音驱逐流 | 青/橙 |

### 9.2 7 个职业加成（weaponClassBonuses）
| 职业 | 2件 | 3件 | 4件 |
|------|-----|-----|-----|
| precise | crit+4 | crit+9, dmg+4% | crit+14, dmg+8% |
| ranged | range+18 | range+40, pierce+1 | range+64, pierce+1, AS+5 |
| barrage | AS+6 | AS+14, proj+1 | AS+22, proj+1 |
| field | radius+12 | radius+24, armor+1 | radius+38, armor+2 |
| engineering | eng+8% | eng+18%, chain+1 | eng+30%, chain+1 |
| support | pickup+16 | pickup+34, luck+6 | pickup+52, luck+16 |
| close | armor+1(1件) | armor+2, dmg+3% | armor+3, dmg+5%, AS+5 |

### 9.3 Build 专注奖励
```
getBuildFocusDamageBonus():
  3件同职业 → +8% (stage≥8→+11%)
  4件同职业 → +14% (stage≥8→+20%)
```

### 9.4 隐藏协同（6 个已实现）
（如 paperStorm 暴击触发纸片风暴、rubberStampede 刷新陷阱等）

### 9.5 ⚠️ 当前缺失
- **长短板文档**：没有"每个 Build 不能获得什么能力"的约束
- **禁止能力清单**：没有"哪些能力不能同时出现"的规则
- **成型时间点**：没有写清每个 Build 的成型窗口

---

## 十、敌人职责现状

### 10.1 当前敌人种类
| 敌人 | 职责 | 威胁类型 |
|------|------|---------|
| bug | 基础杂兵 | 包围 |
| change | 快速骚扰 | 数量+速度 |
| meeting | 中型坦克 | 血量 |
| emergency | 高威胁精英 | 血量+伤害 |
| deadline | 远程狙击 | 伤害 |
| intern | 速攻骚扰 | 速度 |
| alarm | 高伤速攻 | 速度+伤害 |
| audit | 重甲坦克 | 极厚血量 |
| manager | Boss级 | 超高血量+伤害 |
| boss | 关卡Boss | 终极威胁 |

### 10.2 弱点克制表（applyEnemyDamage）
| 敌人 | 弱点武器 | 倍率 |
|------|---------|------|
| deadline | marker/coffee | 1.35x |
| alarm | report | 1.55x |
| intern | sticky | 1.45x |
| audit | calculator/report | 1.38x |
| manager | calculator/coffee | 1.25x |
| boss | marker/report/calculator | 1.18x |
| emergency | marker/sticky | 1.22x |
| swarm | headset/report/shredder/sticky | 1.16x |

### 10.3 ⚠️ 当前缺失
- 没有"第N关考什么"的考试逻辑
- 敌人职责停留在"血量+速度"二维，没有功能职责
- 包围行为存在但未按阶段调度

---

## 十一、需要冻结的数值清单

以下数值一旦冻结，所有后续内容（流派、关卡、美术、文案）都在此框架内生长：

### 应锁定
| 项目 | 当前值 | 建议 |
|------|--------|------|
| DAMAGE_MULT_SOFT_CAP | 1.82 | 锁 |
| DAMAGE_MULT_HARD_CAP | 2.18 | 锁 |
| softCap tail | 0.35 | 锁 |
| ATTACK_SPEED_SOFT_CAP | 62 | 锁 |
| ATTACK_SPEED_HARD_CAP | 92 | 锁 |
| AS add tail | 0.42 | 锁 |
| AS softCap tail | 0.34 | 锁 |
| WSIZE_SOFT_FACTOR | 1.5 | 锁 |
| WSIZE_HARD_FACTOR | 2.5 | 锁 |
| WSIZE_TAIL | 0.30 | 锁 |
| 暴击上限 | 75% | 锁 |
| 暴击倍率 | 1.85x | 锁 |
| 冷却最低 | 0.18s | 锁 |
| 冷却公式 | 100/(100+AS) | 锁 |
| XP公式 | ×1.24+9 | 锁 |
| 起始XP | 26 | 锁 |

### 需讨论
| 项目 | 当前值 | 讨论点 |
|------|--------|--------|
| healthMult 多项式 | 4项叠加 | 是否简化为2项？ |
| 材料公式 | luck×0.00115+0.4 | 上限0.68是否合理？ |
| getMaterialMult | 1 + luck×0.0026 | 260满运=1.676x |
| 敌人HP基础值 | 见上表 | 各阶段speed/HP/speed权重？ |

---

## 十二、下一步：能力预算表 → Build长短板 → 关卡考试

此文档为第一步「冻结核心规则」的数据基础。确认后进入：
1. **能力预算表**（可叠/不可叠/硬上限/负面代价）
2. **Build长短板补充**（写清楚每个Build不能获得什么）
3. **敌人考试逻辑重排**
