# 角色消失 Bug 修复 — 2026-06-18 18:19

## 症状
- 战斗阶段：角色无法移动，镜头不跟随，看起来像角色消失
- 过关后 recovery 阶段：角色恢复可动
- HUD 正常运行（关卡/血量/等级实时更新）

## 根因
`updateGame()` 函数中，在添加 Perimeter 轨道加速逻辑和 systemUpdateTimer 时，**意外删除了 `updatePlayer(dt)` 调用**。

原代码（b52dcbb）：
```js
game.orbitAngle += game.player.orbitSpeed * dt;
updatePlayer(dt);  ← 被删除
updateWeapons(dt);
```

重构后（d5f1f28）：
```js
game.orbitAngle += game.player.orbitSpeed * dt * (auraBoost ? 1 + 1 * pEff : 1);
// ← updatePlayer(dt) 缺失！
// System update timer blocks attacking
if (game.systemUpdateTimer > 0) { ... }
```

## 为什么 recovery 阶段能动
`updateStageRecovery()` 保留了 `updatePlayer(dt)` 调用，所以闯关成功后角色位置恢复正常更新。

## 修复
在 orbit 加速逻辑和 systemUpdateTimer 块之间恢复 `updatePlayer(dt)` 调用。

## 同时移除的改动
- `beginStageRecovery` 中的 `showInterStageEvent()` 调用（暂剥离，等基础稳定后再加回）
- `updateStageRecovery` 中的 event panel 暂停逻辑（同上）
