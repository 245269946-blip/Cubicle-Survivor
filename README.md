# Cubicle Survivor Demo V1

当前工作树是 **Demo V1 唯一开发基线**。真正可运行与验收的版本位于 `Cubicle-Survivor-demo/`。

当前推荐试玩入口：`Cubicle-Survivor-demo/demo-v3-14.html`（轻量决策版）。

产品命名统一使用 `Demo V1`。内部 `src/v2/` 与 `docs/v2-framework/` 是架构代号，不代表另一个对外版本。

## 版本分区

- `versions/v1.0-legacy/`  
  旧线上版归档。核心是“武器升级 + 道具/被动 + 属性成长”的旧框架。

- 根目录 `index.html` / `main.js` / `styles.css` / `src/`  
  当前 v2.0 试玩版。核心是“初始武器 -> 工牌形态 -> 卡槽强化 -> 转正强化 -> 跨部门第二形态 -> 跨技能辅助技能”。

- `docs/v1-legacy/`  
  旧版设计、旧 Build 生态、旧决策结构和早期视觉参考。

- `docs/v2-framework/`  
  当前新版主框架设计与中间数据/流程稿。

- `docs/archive/`  
  历史过程记录、调试报告、拆分代码快照和废弃参考。

## 本地运行

```bash
python -m http.server 5174
```

然后打开 `http://127.0.0.1:5174/`。

独立 Demo V2 验证入口：

- `demo-v2.html`：阶段 A 三武器基础测试。
- `demo-v2-b.html`：阶段 B Build 对话测试。
- `demo-v2-marker.html`：Demo V2.1 马克笔固定类型测试。
- `demo-v2-thermos.html`：Demo V2.2 保温杯固定类型测试。

武器级内容大更新使用新的 Demo 小版本号并保留旧入口，避免把不同机制候选混成同一版本。

## 当前判断

v1.0 和 v2.0 是两个不同设计范式：

- v1.0：武器和道具驱动的割草肉鸽。
- v2.0：同一武器被工牌身份改造成不同战斗形态，再通过卡槽和阶段升级深化。

后续新增机制默认服务 v2.0 主线，除非明确在 `versions/v1.0-legacy/` 中维护旧版。
