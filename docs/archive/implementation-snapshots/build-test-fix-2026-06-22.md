# Build 自动化测试修复全流程 — 2026-06-22

## 问题
`_testAllBuilds` 函数在浏览器和 Node.js 沙箱中均报错 undefined/not a function，10 个 Build 测试无法运行。

## 根因链（逐层修复）

### 1. 孤儿语法错误 (main.js L8311)
- 原因：第二份 F8 按键处理代码不在任何 `if` 块内，裸挂在文件主体中
- 修复：删除重复代码块（L8297-8311）
- 影响：main.js 加载到此处就崩溃，_testAllBuilds 从未被注册

### 2. 缺失函数 `skipPolicyAndStart`
- 原因：旧代码 `03_progression.js` 未被 index.html 加载
- 修复：在 main.js 中添加最小桩实现

### 3. 武器 ID 三层不匹配 🔴（核心根因）
```
weaponDefinitions（旧）: coffee, keyboard, headset, report, stapler, sticky, marker, calculator, shredder, thermos
buildOrder（新）:       coffee, keyboard, headphones, report, stapler, sticky_note, marker, shredder, thermos
CS.weapons（新）:       coffee, keyboard, marker, stapler, headphones, thermos, report, shredder, sticky_note
```
- **问题 3a**：`_testBuild` 用 `structuredClone(weaponDefinitions)` 初始化 `game.weapons`，但 Build 定义使用新 ID → `Cannot set properties of undefined (setting 'owned')`
  - 修复：`_testBuild` 改用 `structuredClone(CS.weapons)`

- **问题 3b**：`weaponDefinitions` 键名 `headset`/`sticky` vs `buildOrder` 用 `headphones`/`sticky_note` → `renderBuildHud()` 遍历时 `undefined.label`
  - 修复：更新 `weaponDefinitions` 键名 + 添加向后兼容别名

- **问题 3c**：`routeDefinitions` 使用旧 ID → `getRouteProgress` 读取 `undefined.level`
  - 修复：conductor 路线 `["sticky","calculator"]` → `["sticky_note","shredder"]`；perimeter 路线 `["headset","report"]` → `["headphones","report"]`

### 4. Node.js 沙箱环境缺失
- 补充 `structuredClone`、`replaceChildren`、`CS` 全局变量

## 测试结果

### Node.js 离线测试 ✅
```
=== 10 Builds Tested ===
1. ✅ 纯技栈      14/14 | tech:2,product:1,ops:2       | tech[2];ops[2]
2. ✅ 产品冲刺    14/14 | product:2,tech:1,ops:1       | product[2]
3. ✅ 运营堡垒    14/14 | ops:2,general:1,tech:2       | ops[2];tech[2]
4. ✅ 市场辐射    14/14 | marketing:2,general:2        | marketing[2];general[2]
5. ✅ 综合管理    14/14 | general:2,tech:2             | tech[2];general[2]
6. ✅ 敏捷创新    14/14 | tech:2,product:2,ops:1       | tech[2];product[2]
7. ✅ 稳定交付    14/14 | tech:2,product:1,ops:1       | tech[2]
8. ✅ 快速上线    14/14 | product:1,ops:2,tech:2       | tech[2];ops[2]
9. ✅ 天选之子    14/14 | tech:2,general:1,marketing:2 | marketing[2];tech[2]
10. ✅ 兄弟同心   14/14 | ops:2,marketing:2            | marketing[2];ops[2]
通关: 10/10
```

### 浏览器实测 ✅
- 浏览器端页面正常加载，🧪 按钮可用
- 10/10 Build 控制台确认全部 14/14 通关
- 截图：screenshot-1782131555722.png

## 修改文件
- `main.js`：weaponDefinitions 键名更新 + 向后兼容别名、routeDefinitions ID 更新、skipPolicyAndStart 桩函数、删除孤儿代码块
- `index.html`：cache-bust `main.js?v=4`
- `test-runner.js`：Node.js 沙箱增强（structuredClone、replaceChildren、CS 全局变量）
