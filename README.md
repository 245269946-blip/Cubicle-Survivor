# Cubicle Survivor Reforged

当前根目录是 **v2.0 active prototype**，用于继续开发和试玩。

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

## 当前判断

v1.0 和 v2.0 是两个不同设计范式：

- v1.0：武器和道具驱动的割草肉鸽。
- v2.0：同一武器被工牌身份改造成不同战斗形态，再通过卡槽和阶段升级深化。

后续新增机制默认服务 v2.0 主线，除非明确在 `versions/v1.0-legacy/` 中维护旧版。
