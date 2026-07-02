# 2026-06-22 17:52 - 两 Build 战斗对比测试

## 目标
实机验证技术链电 vs 产品暴击两种 Build 的战斗效果差异

## 阻塞问题与修复
1. **shredder `target` undefined bug**: `updateShredder(dt)` 引用 `target` 但调用处未传递 → 改为 `updateShredder(dt, target)`, 函数签名同步修改
2. **rAF 后台挂起**: 浏览器后台标签页不触发 requestAnimationFrame → 改用 `loop(now + f*16)` 手动推进帧
3. **开局流程不完整**: 直接调 `startGameActual()` 失败(bs.attributes not iterable) → 完整调用链: `beginNewbie('tech_intern')` → `selectStartWeapon('coffee')` → `startGameActual()`
4. **18秒 warmup 阻断出怪**: Stage 1 `STAGE_ONE_WARMUP_SECONDS = 18` → `game.waveTime = 20` 跳过

## 测试结果
| 维度 | 技术链电 | 产品暴击 |
|------|---------|---------|
| 工牌 | tech_intern | product_worker |
| 主武器 | 咖啡 Lv.5 | 马克笔 Lv.5 |
| 卡牌 | agile_dev + continuous_integration + code_refactor | emergency_launch + rapid_iteration + deadline |
| 战斗 | 21 kills / 59 spawned | 15 kills / 40 spawned |
| 特殊效果 | chainTrigger 25%/jumps 2/dmg 12 | critDmg +0.12 |

## 截图
- 技术链电: 38 enemies visible, chain lightning sparks
- 产品暴击: 25 enemies visible, marker piercing beams

## 结论
两 Build 在战斗中表现不同，链电和暴击数值已注入到游戏效果管线。但视觉效果差异不够明显（需更多粒子/颜色区分）。碎纸机 `target` bug 已修复。
