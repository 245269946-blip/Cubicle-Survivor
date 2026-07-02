# 工位幸存者 v0.3 — 视觉设计规范

> 版本：v0.3-reforged | 2026-06-22
> 设计锚点：大厂工位质感 × 赛博霓虹
> 核心情绪：「下班前做完最后一件事」——微焦虑不绝望，战斗爽不轻浮

---

## 一、调色板

| 标识 | 色值 | 用途 |
|------|------|------|
| `bg-panel` | `#1a1a2e` | 所有弹窗/面板背景 |
| `bd-panel` | `#2a2a4a` | 面板描边、分隔线 |
| `txt-primary` | `#e8e8f0` | 标题、正文 |
| `txt-secondary` | `#8888aa` | 辅助说明 |
| `accent-cyan` | `#00e5ff` | 已激活效果、可操作元素 |
| `accent-orange` | `#ff6b4a` | 代价/互斥/HP 低 |
| `rarity-gold` | `#ffd700` | 稀有传说边框/光效 |
| `gradient-legendary` | `#ff6b4a → #ffd700 → #7b4aff` | 传说卡渐变色 |
| `dept-tech` | `#4a9eff` | 🔥 技术部 |
| `dept-product` | `#ff6b4a` | ⚡ 产品部 |
| `dept-ops` | `#4acf6a` | 🛡️ 运营部 |
| `dept-marketing` | `#cf6ae0` | 📢 市场部 |
| `dept-general` | `#e0c060` | 🏢 综合部 |
| `hp-green` | `#4acf6a` | HP 条 / Build 进度 |
| `hp-orange` | `#ff8c00` | 中危 |
| `hp-red` | `#f04040` | 低 HP / 致命警告 |

## 二、圆角与字体

| 元素 | 圆角 |
|------|------|
| 面板外层 | `8px` |
| 卡牌/按钮 | `6px` |
| 标签(tag) | `4px` |
| 槽位框 | `4px` |

**字体栈：** `"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif`

**动效：**
| 效果 | 参数 |
|------|------|
| 面板出现 | `fadeIn 0.2s` + `scale(0.96 → 1)` |
| 选择高亮 | `0.15s transition`，辉光 pulse |
| 槽位填充 | `0.3s cubic-bezier(0.34, 1.56, 0.64, 1)` |
| 稀有卡边框 | 金色微脉动 `1.5px solid`，`pulse 2s infinite` |
| 传说卡边框 | 虹彩扫光 `3s linear infinite`，内阴影白色 0.5px |

---

## 三、开局 — 身份工牌选择

### 触发
主菜单点「开始游戏」

### DOM 结构
```html
<div id="badgePanel" class="overlay hidden">
  <div class="panel badge-panel">
    <p class="eyebrow">选择工牌</p>
    <h2>今天是你的第一天</h2>
    <div class="badge-grid" id="badgeGrid"></div>
  </div>
</div>
```

### 卡片规格

| 属性 | 值 |
|------|-----|
| 卡片尺寸 | `180 × 220px` |
| 间距 | `16px gap`，4 列网格 |
| 背景 | `#1a1a2e` |
| 边框 | `1px solid #2a2a4a` |
| 圆角 | `8px` |
| 悬停 | 上移 `-4px`，边框变对应部门色，阴影 `0 8px 24px rgba(部门色, 0.2)` |

### 卡片内部布局（从上到下）

| 区域 | 高度 | 规格 |
|------|------|------|
| 部门 emoji | `64px` | 居中，`font-size: 48px`，上下 margin `16px` |
| 身份名 | `24px` | `font-size: 16px, font-weight: bold`，部门色 |
| 属性标签行 | `32px` | 两个 `60×24px` 标签，`font-size: 12px`，底 `rgba(部门色, 0.15)`，文字部门色 |
| 分割线 | `1px` | `#2a2a4a`，左右 `16px` margin |
| 描述 | `36px` | `font-size: 12px, color: #8888aa`，一行 |
| 推荐武器 | `24px` | 武器 emoji + 名，`font-size: 12px`，底 `rgba(部门色, 0.06)` |

### 状态
- 默认: `opacity: 0.92`
- 悬停: `opacity: 1`，边框变部门色
- 点击: 0.2s 边框 → 亮色 → 确认 → 卡片 fadeOut + 面板收起

### CSS 动画
```css
.badge-card {
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s, opacity 0.2s;
  animation: badgeSlideIn 0.3s ease-out both;
}
.badge-card:nth-child(1) { animation-delay: 0s; }
.badge-card:nth-child(2) { animation-delay: 0.05s; }
.badge-card:nth-child(3) { animation-delay: 0.10s; }
.badge-card:nth-child(4) { animation-delay: 0.15s; }

@keyframes badgeSlideIn {
  from { transform: translateX(-20px); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
```

### 四个预设

| id | 卡片 | emoji | 属性 | 推荐武器 |
|---|------|-------|------|----------|
| `tech_intern` | 🔥 技术实习生 | 🔥 | 专注 + 执行力 | 挂耳咖啡 |
| `product_worker` | ⚡ 产品打工人 | ⚡ | 执行力 + 表达力 | 马克笔 |
| `ops_veteran` | 🛡️ 运营老兵 | 🛡️ | 抗压 + 社交 | 降噪耳机 |
| `marketing_newbie` | 📢 市场新人 | 📢 | 表达力 + 社交 | 季度报表 |

---

## 四、五槽选卡界面

### 触发
每次升级（`openUpgrade` 重构为 `openCardSelection`）

### DOM 结构
```html
<div id="upgradePanel" class="overlay hidden">
  <div class="panel card-select-panel">
    <!-- 上半：卡牌信息条 -->
    <div class="card-info-strip">
      <div class="card-dept-bar"></div>          <!-- 4px 宽，部门色 -->
      <div class="card-info-body">
        <div class="card-name-row">
          <span class="card-rarity-tag">普通</span>
          <span class="card-dept-tag">🔥 技术</span>
          <strong class="card-title">敏捷开发</strong>
        </div>
        <p class="card-theme">链电 · 快速写、快速上线、快速迭代</p>
      </div>
    </div>

    <!-- 下半：五槽面板 -->
    <div class="slot-grid">
      <p class="slot-section-label">基础槽</p>
      <div class="slot-row basic-slots">
        <!-- 输出槽 / 生存槽 / 资源槽 -->
      </div>
      <p class="slot-section-label">进阶槽</p>
      <div class="slot-row advanced-slots">
        <!-- 机制槽 / 代价槽 -->
      </div>
    </div>

    <!-- 底部：DPS 预估 -->
    <div class="dps-estimate"></div>
  </div>
</div>
```

### 上半 — 卡牌信息条

| 属性 | 值 |
|------|-----|
| 总宽 | `640px` |
| 总高 | `56px` |
| 左边部门色条 | `4px × 56px`，部门色 |
| 卡名 | `font-size: 16px, font-weight: bold, #e8e8f0` |
| 稀有度 tag | `42×18px`, 稀有度对应色底 |
| 部门 tag | `42×18px`, 部门色底 |
| 主题描述 | `font-size: 12px, #8888aa`，一行 |

### 下半 — 五槽网格

| 项目 | 指标 |
|------|------|
| 基础槽单元格 | `~200px × 130px`，3 列均分 |
| 进阶槽单元格 | `~310px × 130px`，2 列均分 |
| 行间距 | `8px` |
| 列间距 | `8px` |

### 槽位单元格内部布局

```
┌─────────────────────────────┐
│ 🔥 输出槽         [推荐]   │  ← 槽位名 14px #e8e8f0，推荐标签仅推荐槽出现
│ 击中25%触发链电，跳2次     │
│ 伤害12，正常功率           │  ← 描述 11px #8888aa，2行
│ ┌─────────────────────┐    │
│ │   放入此槽          │    │  ← 按钮 110×28px，部门色底
│ └─────────────────────┘    │
│ ●●●○○                   │  ← 功率指示 5 段圆点，底部居中
└─────────────────────────────┘
```

### 槽位状态

| 状态 | 背景 | 边框 | 交互 |
|------|------|------|------|
| 空槽可选 | `#1a1a2e` | `1px #2a2a4a` | 悬停变 `#3a3a5a` |
| 推荐槽 | `rgba(部门色, 0.06)` | `1.5px dashed rgba(255,215,0,0.35)` | 右上角「推荐」徽章 10px |
| 已占槽 | `opacity: 0.55` | `1px #2a2a4a` | 显示灰条已有卡名 + 「⚠ 覆盖」 |
| 互斥警告 | `rgba(255,80,60,0.06)` | `1.5px dashed rgba(255,80,60,0.45)` | 底部红字互斥提示 |
| 已放置(确认后) | `rgba(部门色, 0.08)` | `1px solid 部门色` | 0.3s 填充动画 |

### 功率指示器

```
● ○ ○ ○ ○  = 功率 1 (低)
● ● ○ ○ ○  = 功率 2
● ● ● ○ ○  = 功率 3 (普通输出槽)
● ● ● ● ○  = 功率 4 (稀有机制槽)
● ● ● ● ●  = 功率 5 (传说 / 代价槽)
● ● ● ● ● ⚡ = 代价槽特供 (高功率 + 代价警告)
```

- 每个圆点 `10px` 直径
- 填充色: 部门色
- 空: `#3a3a5a`
- 间距: `4px`

### 代价槽特殊设计

| 区域 | 规格 |
|------|------|
| 整体底 | `rgba(255,80,60,0.06)` |
| 外框 | 双边框：内 `1px` 部门色 + 外 `1px #f04040` |
| 正面效果行 | 前缀 `⊕` 绿色标记 + 文字 |
| 代价行 | 前缀 `⊖` 红色标记 + 文字，底 `rgba(255,50,40,0.08)` |
| 功率指示 | 5 段全满 + ⚡ 标记 |

### DPS 估算栏

```
┌──────────────────────────────────────────┐
│ 预估影响                                 │
│ 输出 ████████ 🟢 高 (+18%)               │
│ 生存 ████     🟡 中 (+6%)                │
│ 成长 ██       🔴 低                      │
└──────────────────────────────────────────┘
```

- 位于面板底部，`640×36px`
- 每行 `18px` 高
- 条 `120px × 8px`，底 `#3a3a5a`，填充部门色
- 只显示三个维度：输出 / 生存 / 成长
- 数值为大致估算，不追求精确

---

## 五、协同面板（HUD 右侧常驻）

### 折叠态
- `36×36px` 方形按钮，`top: 16px, right: 16px`
- 显示：主部门 emoji + 小角标数字（部门卡数）
- 背景：`rgba(26,26,46,0.85)`，边框 `1px #2a2a4a`，圆角 `6px`
- 悬停：边框变部门色

### 展开态

```html
<div id="buildPanel" class="build-panel">
  <div class="build-head">
    <span class="build-dept-icon">🔥</span>
    <span class="build-dept-name">技术部</span>
    <span class="build-progress">3/4</span>
    <button class="build-close">✕</button>
  </div>

  <div class="build-section">
    <div class="build-section-title">里程碑</div>

    <div class="milestone-row completed">
      <span class="ms-check">✓</span>
      <span class="ms-name">基础协同</span>
      <span class="ms-progress">2/2</span>
    </div>
    <div class="milestone-row in-progress">
      <span class="ms-check">⬜</span>
      <span class="ms-name">机制强化</span>
      <span class="ms-progress">1/3</span>
    </div>
    <div class="milestone-row locked">
      <span class="ms-check">🔒</span>
      <span class="ms-name">终局套装</span>
      <span class="ms-progress">0/4</span>
    </div>

    <div class="milestone-cap-hint">部门投资已满，可考虑跨部门协作</div>
  </div>

  <div class="build-section">
    <div class="build-section-title">部门协同 (第6关起)</div>
    <div class="synergy-row active">
      <span class="syn-dot green"></span>
      <span class="syn-name">敏捷创新</span>
      <span class="syn-depts">🔥 × ⚡</span>
    </div>
    <div class="synergy-row unlockable">
      <span class="syn-dot orange"></span>
      <span class="syn-name">标准运营</span>
      <span class="syn-hint">差 1 张运营卡</span>
    </div>
    <div class="synergy-row locked">
      <span class="syn-dot gray"></span>
      <span class="syn-name">爆款策略</span>
    </div>
  </div>

  <div class="build-section">
    <div class="build-section-title">属性协同 (第8关起)</div>
    <div class="synergy-row active">
      <span class="syn-dot green"></span>
      <span class="syn-name">学以致用</span>
      <span class="syn-depts">💪 + 🎯</span>
    </div>
    <div class="synergy-row locked">
      <span class="syn-dot gray"></span>
      <span class="syn-name">兄弟同心</span>
    </div>
  </div>

  <div class="build-section">
    <div class="build-section-title">武器进化</div>
    <div class="evo-row">
      <span class="evo-weapon">☕ 咖啡</span>
      <span class="evo-arrow">→</span>
      <span class="evo-name">速溶咖啡</span>
    </div>
  </div>
</div>
```

### 规格明细

| 组件 | 规格 |
|------|------|
| 面板尺寸 | `224px` 宽，最大 `480px` 高 |
| 头部 | `40px` 高，部门色底 `rgba(部门色, 0.1)` |
| 里程碑行 | `28px` 高 |
| 协同行 | `24px` 高 |
| 已完成 ✓ | 绿色 `#4acf6a` 圆角方框 `16×16px` |
| 进行中 ⬜ | `#8888aa` 虚线方框 `16×16px` |
| 未解锁 🔒 | `#555` 半透明 |
| 已激活圆点 | `● 6px`，`#4acf6a`，`box-shadow 0 0 6px #4acf6a` |
| 可解锁圆点 | `● 6px`，`#ff8c00` |
| 锁定圆点 | `● 6px`，`#555` |
| 满投资提示 | `12px #e0c060`，底 `rgba(224,192,96,0.08)`，`1px solid #e0c060`，`border-radius: 4px` |

### 动画

| 时机 | 效果 |
|------|------|
| 打开 | `0.2s ease-out`，从右滑入 `translateX(20px → 0)` |
| 协同激活 | 该行 `0.5s` 绿色光晕闪烁 → fadeOut |
| 里程碑到达 | 数字 `0.3s` 弹性跳动 + 绿色光晕扩散 |
| 关闭 | `0.15s ease-in`，向右滑出 + fadeOut |

---

## 六、协作任务弹窗

### 触发
阶段切换时（`beginStageRecovery`/`completeStage`），满足条件或首次不满足

### DOM 结构
```html
<div id="collabPanel" class="overlay hidden">
  <div class="panel collab-panel">
    <div class="collab-dept-icons">
      <span class="collab-dept-icon">🔥</span>
      <span class="collab-link-glow"></span>      <!-- 光带连接 -->
      <span class="collab-dept-icon">📢</span>
    </div>
    <h3 class="collab-narrative"></h3>
    <p class="collab-requirement"></p>
    <p class="collab-reward"></p>
    <div class="collab-actions">
      <button class="collab-accept">接受合作</button>
      <button class="collab-decline">以后再说</button>
    </div>
  </div>
</div>
```

### 规格

| 属性 | 值 |
|------|-----|
| 弹窗尺寸 | `420 × 260px` |
| 遮罩 | `rgba(0,0,0,0.55)` |
| 底 | `#1a1a2e`，边 `1px #2a2a4a`，圆角 `8px` |
| 部门图标 | `48px` emoji，对角放置，间距 `120px` |
| 光带连线 | 两个 icon 之间 SVG 虚线，部门色，`width: 100px, stroke-width: 1.5px`，虚线 `4,4` |
| 叙事文本 | `font-size: 14px, #e8e8f0`，居中 |
| 条件说明 | `font-size: 12px, #8888aa` |
| 奖励说明 | `font-size: 13px, #ffd700` |
| 接受按钮 | `140×36px`，部门色底，`#e8e8f0` 字 |
| 拒绝按钮 | `140×36px`，`#2a2a4a` 底，`#8888aa` 字 |

### 「首次不满足」态
- 条件行显示「你当前不满足」橙色字
- 无按钮，一行灰色 `11px` 小字「未来满足条件时自动领取」
- 右上角 ✕ 关闭
- 3s 自动消失

### CSS
```css
.collab-panel {
  animation: collabIn 0.25s ease-out;
}
@keyframes collabIn {
  from { transform: scale(0.92); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
.collab-link-glow {
  width: 100px; height: 2px;
  background: linear-gradient(90deg, var(--dept1-color), var(--dept2-color));
  opacity: 0.6;
}
```

---

## 七、武器进化提示

### 战斗内表现（Canvas + DOM 多层）

| 层 | 效果 |
|----|------|
| hit-stop | `0.35s` 画面静止，`game.hitStop = 0.35` |
| 震屏 | `0.08s`，`game.screenShake = 4` |
| 武器 emoji 弹窗 | Canvas 绘制，`scale(0.3 → 1.15 → 1)` `0.6s` ease-out，尺寸 `64×64px` |
| 进化名文字 | 弹窗下方 `font-size: 20px, bold, 部门色`，fadeIn `0.15s`，停留 `2s`，fadeOut `0.4s` |
| 粒子爆发 | 武器坐标发射，`20` 个粒子，部门色 + 金色混合，半径 `60 → 280px`，`0.7s` |
| 叙事文字 | Canvas 浮动 `1.5s`，「你终于配了台正经咖啡机」`font-size: 13px, 部门色` |

### 升级面板中的预览（武器工坊 / 升级信息）

```css
.evolution-preview {
  font-size: 11px;
  color: #8888aa;
  margin-top: 4px;
  padding: 4px 8px;
  background: rgba(255,255,255,0.03);
  border-radius: 4px;
  border-left: 2px solid var(--dept-color);
}
.evolution-preview .condition-met {
  color: #4acf6a;
}
.evolution-preview .condition-unmet {
  color: #8888aa;
}
.evolution-preview .arrow {
  margin: 0 4px;
  color: #555;
}
```

---

## 八、复盘界面

### DOM 结构
```html
<div id="resultPanel" class="overlay hidden">
  <div class="panel result-panel">
    <!-- 主标题 -->
    <p class="eyebrow" id="resultEyebrow"></p>
    <h2 id="resultTitle"></h2>

    <!-- 运行数据 -->
    <div id="resultStats"></div>

    <!-- 第一层：事实数据 -->
    <div class="debrief-layer layer-facts">
      <div class="debrief-col">
        <h4>武器伤害占比</h4>
        <div class="damage-bars" id="damageBars"></div>
      </div>
      <div class="debrief-col">
        <h4>部门投资</h4>
        <div class="dept-pie" id="deptPie"></div>
        <h4>激活协同</h4>
        <div class="synergy-list" id="synergyList"></div>
      </div>
    </div>

    <!-- 第二层：身份识别 -->
    <div class="debrief-layer layer-identity">
      <p class="identity-text" id="identityText"></p>
    </div>

    <!-- 第三层：可选方向 -->
    <div class="debrief-layer layer-suggestions" id="suggestions">
    </div>

    <!-- 操作 -->
    <div class="result-actions">
      <div class="result-award" id="resultAward"></div>
      <button class="primary-button" id="restartButton">再来一局</button>
      <button class="secondary-button" id="menuButton">返回主菜单</button>
    </div>
  </div>
</div>
```

### 第一层 — 事实数据

| 组件 | 规格 |
|------|------|
| 布局 | 2 列，`45% / 45%`，gap `24px` |
| 武器伤害柱状图 | 每个武器一行 `24px`，条 `120×14px`，底 `#2a2a4a`，填充部门色，右侧显示百分比 |
| 部门投资饼图 | Canvas 绘制，`120×120px`，5 色分区，中心文字「共 5 张卡」 |
| 协同列表 | 每行 `22px`，✅/⬜ 前缀 |
| 进化路径 | `12px #8888aa`，武器名 → 进化名 |

### 第二层 — 身份识别

| 属性 | 值 |
|------|-----|
| 尺寸 | `640 × 52px` |
| 背景 | `rgba(部门色, 0.08)` |
| 边框 | `1px solid rgba(部门色, 0.2)` |
| 圆角 | `6px` |
| 文字 | `font-size: 17px, font-weight: bold, #e8e8f0`，居中 |
| 关键词高亮 | 部门名/属性名/卡名 用对应部门色 |

模板：
```
你是 [部门] 的 [属性A]·[属性B] 型，核心输出来自 [武器] + [关键卡牌]。
```

### 第三层 — 建议卡片

| 属性 | 值 |
|------|-----|
| 卡片尺寸 | `600 × 80px` |
| 底 | `#1a1a2e` |
| 边 | `1px #2a2a4a` |
| 圆角 | `6px` |
| 左边提示图标 | `💡` 或 `🔄`，`24px`，垂直居中 |
| 正文 | `font-size: 13px, #d0d0e0`，左对齐，`4px` 左侧 margin |

生成规则：
```
结构：你这局[做了什么] → [结果] → 下次可以尝试[变化] → [为什么]
   ✅ 「你这局堆了 3 张技术卡，部门里程碑只到基础协同。
       下次可以尝试补 1 张产品卡（截止日期 或 KPI 考核），
       触发跨部门「敏捷创新」协同，让链电和暴击互相触发。」
   ❌ 「你的 Build 很弱」
   ❌ 「你必须拿更多产品卡」
   ❌ 唯一正确答案体
```

---

## 九、阶段横幅

### 规格

| 属性 | 值 |
|------|-----|
| 尺寸 | `1280 × 72px`，全宽 |
| 位置 | 画面顶部滑入 |
| 持续时间 | 1.9s（终局 Boss 2.6s） |
| 阶段名 | `font-size: 12px, 部门色, letter-spacing: 2px` |
| 主标题 | `font-size: 20px, bold, #e8e8f0` |
| 副标题 | `font-size: 13px, #8888aa` |
| 背景 | `rgba(阶段对应色, 0.08)` |
| 边框底 | `2px solid rgba(阶段对应色, 0.25)` |

### 五阶段映射

| 阶段 | 主标题 | 副标题 | 色调 |
|------|--------|--------|------|
| 入职期 | 入职期 · 第一天 | 先活下来，再谈效率 | `rgba(74,158,255,0.08)` |
| 试用期 | 试用期 · 扛住 | Leader 开始给你派活了 | `rgba(255,107,74,0.08)` |
| 转正期 | 转正期 · 成型 | 你的 Build 应该成型了 | `rgba(207,106,224,0.08)` |
| 老员工 | 老员工 · 冲刺 | 最后一轮构筑冲刺 | `rgba(224,192,96,0.08)` |
| 终局 | 终局 · CEO 提问 | 验证你的完整 Build | `rgba(240,64,64,0.1)` |

---

## 十、HUD 新增元素

### 部门投资指示器

**位置：** 画面左下角，HP/XP 条下方

**规格：**
```
🔥 ████████░░ 3/4
⚡ ████░░░░░░ 1/4
```
- 每部门一行 `120×6px` 进度条
- 底 `#2a2a4a`
- 填充部门色
- 已满 `4/4` 时整个条变金色 `#ffd700` + 末尾 🔒 标记
- 本局未出现部门不显示

```css
.dept-indicator { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
.dept-indicator .dept-emoji { font-size: 11px; width: 16px; }
.dept-indicator .dept-bar { width: 80px; height: 5px; background: #2a2a4a; border-radius: 3px; overflow: hidden; }
.dept-indicator .dept-bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s ease; }
.dept-indicator .dept-count { font-size: 10px; color: #8888aa; min-width: 28px; }
```

### 卡牌槽位速览

**位置：** 画面底部中央

**规格：**
```
[输出:敏捷开发] [生存:备份恢复] [资源:---] [机制:---] [代价:---]
```
- 5 个标签，水平排列，gap `6px`
- 每个 `100×22px`
- 有卡：部门色底 `rgba(部门色, 0.15)`，边框 `1px rgba(部门色, 0.3)`，文字 `10px`
- 空：灰色虚线边框 `1px dashed #3a3a5a`，文字「空」`10px #555`

```css
.slot-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  transition: all 0.3s;
}
.slot-tag.filled { border-style: solid; }
.slot-tag.empty   { border: 1px dashed #3a3a5a; color: #555; }
```

### 协作任务待处理提示

- 画面顶部小横幅 `300×28px`，橙色底 `rgba(255,140,0,0.12)`
- 协作任务标题 + 「请查看」按钮
- 出现时从顶部滑入，10s 后自动消失

---

## 十一、CSS 类名速查

| 类名 | 用途 |
|------|------|
| `.badge-panel` | 身份工牌选择弹窗 |
| `.badge-grid` | 4 列工牌网格 |
| `.badge-card` | 单张工牌卡片 |
| `.card-select-panel` | 五槽选卡弹窗 |
| `.card-info-strip` | 卡牌信息条 |
| `.card-dept-bar` | 左边部门色 4px 竖条 |
| `.slot-grid` | 五槽网格容器 |
| `.slot-row` | 一行槽位 |
| `.slot-cell` | 单个槽位单元格 |
| `.slot-cell.recommended` | 推荐槽位 |
| `.slot-cell.occupied` | 已占槽位 |
| `.slot-cell.conflicting` | 互斥槽位 |
| `.slot-cell.cost-slot` | 代价槽 |
| `.power-indicator` | 功率指示器 5 段圆点 |
| `.power-dot` | 单个圆点 |
| `.dps-estimate` | DPS 预估栏 |
| `.build-panel` | 协同面板（展开态） |
| `.build-panel.collapsed` | 协同面板（折叠态） |
| `.build-head` | 协同面板头部 |
| `.build-section` | 协同面板分区 |
| `.milestone-row` | 里程碑行 |
| `.milestone-row.completed` | 已完成 |
| `.milestone-row.in-progress` | 进行中 |
| `.milestone-row.locked` | 未解锁 |
| `.milestone-cap-hint` | 满投资提示 |
| `.synergy-row` | 协同行 |
| `.synergy-row.active` | 已激活 |
| `.synergy-row.unlockable` | 可解锁（差 1 张） |
| `.synergy-row.locked` | 不可解锁（差 2+ 张） |
| `.collab-panel` | 协作任务弹窗 |
| `.collab-dept-icons` | 协作任务部门图标区 |
| `.collab-link-glow` | 光带连线 |
| `.debrief-layer` | 复盘分层 |
| `.layer-facts` | 事实数据层 |
| `.layer-identity` | 身份识别层 |
| `.layer-suggestions` | 建议层 |
| `.identity-text` | 身份识别文本 |
| `.evolution-preview` | 武器进化预览 |
| `.dept-indicator` | 部门投资进度条 |
| `.slot-tag` | 卡牌槽位速览标签 |

---

## 十二、响应式（移动端）

| 断点 | 调整 |
|------|------|
| `max-width: 768px` | 工牌卡片 `2 列`，`140×200px` |
| `max-width: 768px` | 五槽网格列改为单列垂直堆叠 |
| `max-width: 768px` | 协同面板宽度缩至 `180px` |
| `max-width: 768px` | 复盘 2 列改为单列 |
