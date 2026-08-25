# 马克笔卡通完成感 P0 切片

状态：独立可玩体验验证，不替换 Demo V3.14，不改四武器、17 关、模块、组件或经济基线。

入口：`Cubicle-Survivor-demo/cartoon-marker-slice.html`

## 本轮只验证什么

1. 统一的 2D 职场卡通角色、敌人、场景和文件式 UI 是否比当前混合视觉更有吸引力。
2. 自动攻击是否能通过角色后坐、粗轮廓攻击线、敌人形变和纸张碎片读成“角色在做动作”。
3. “清空 30 份积压”是否能由场内积压堆、剩余数量和纸张飞回归档点共同表达。
4. “复写｜多画一条”是否能在返回战斗后的第一次攻击中直接兑现为双线。
5. 最后一名敌人处理后，压力停止、残留清空、归档夹闭合和“已归档”印章是否形成完整句号。

## 明确不做

- 不照搬清洁、破坏或恢复房间。
- 不把卡通视觉直接迁移到 V3.14。
- 不增加第二个升级选项、商店、模块、组件或新任务类型。
- 不用该切片判断四武器数值平衡。

## 体验流程

`目标亮相 → 单线自动贯穿 → 处理 11 份积压 → 复写升级 → 双线快速兑现 → 清空 30 份 → 已归档`

目标总时长为 45—60 秒；浏览器自动化可能因为虚拟时间推进而更快，真实体验以正常刷新率下试玩为准。

## 视觉资产

位置：`Cubicle-Survivor-demo/assets/cartoon-marker-slice/`

- `office-arena-v1.webp`：`runtime-ready`；1672×941 与 1280×720 同为 16:9，镜头和绘制比例匹配。
- `marker-worker-v1.png`：`reference-only`；旧版单角度整合立绘，固定枪口与任意方向自动瞄准不一致，已退出运行时。
- `marker-worker-body-v2.png`：`reference-only`；已完成身体/武器拆分验证，但被四方向 v3 身体集取代。
- `marker-worker-down-v3.png`、`marker-worker-up-v3.png`、`marker-worker-left-v3.png`、`marker-worker-right-v3.png`：`prototype-cutout`；旧单帧方向参考，已退出运行时，不再承担角色走路或身份门禁。
- `../cartoon-character-system/neutral-worker-walk-v1.png`：`runtime-ready`；P0 与主线共用的 3 列 × 4 行人物骨架，四方向均有 `idle / step-a / step-b`，以 132px 可见高度和 0.115 秒步频播放。
- `../cartoon-character-system/marker-rig-back-v1.png`、`marker-rig-front-v1.png`：`runtime-ready`；逐格对齐共享人物的马克笔后/前穿戴层，运行时按背层 → 身体 → 前层合成，瞄准马克笔仍保持独立。
- `marker-weapon-v2.png`：`runtime-ready`；真透明并紧裁切，78×19px 下可读，由真实 `aimAngle` 连续旋转，枪口、攻击起点和判定方向同源。
- `backlog-enemy-v1.png`、`urgent-email-enemy-v1.png`：`reference-only`；保留原始单姿态身份参考，已退出运行时。
- `backlog-enemy-actions-v2.png`：`runtime-ready`；移动跨步、接触攻击蓄力、受击后仰、归档成捆四个真实轮廓，100px 目标高度与 296px 图集脚底线已对齐。
- `backlog-enemy-walk-v3.png`：`runtime-ready`；四帧沉重走路，左右压脚、纸堆重心与红色夹子均真实变化，正常移动按 0.115 秒节奏循环。
- `backlog-enemy-slam-v3.png`：`runtime-ready`；五帧积压砸击，覆盖蓄力、压缩、起跳、落地和回收；只有落地帧进入判定时才造成 7 点接触伤害。
- `urgent-email-enemy-actions-v2.png`：`runtime-ready`；奔跑、冲刺预备、受击踉跄、拍扁退场四个真实轮廓，88px 目标高度与同一脚底线已对齐。
- `urgent-email-run-v3.png`：`runtime-ready`；四帧交替跑步，统一 320px 单格与 296px 脚底线，正常移动按 0.09 秒节奏循环。
- `urgent-email-dash-v3.png`：`runtime-ready`；五帧冲刺序列，覆盖预备、压缩、发力、伸展和回收；预警期使用前两帧，0.48 秒冲刺使用后三帧。

资产使用内置 ImageGen 生成；透明源经过官方 chroma-key 清理流程转为 RGBA PNG，并在接入前完成连通域拆分、统一缩放、alpha、目标尺寸与脚底锚点检查。运行时只引用项目内副本，不依赖生成目录。怪物动作源图没有按画面四等分直接裁切，因为生图中的拳头、鞋和纸角越过了名义格线；`scripts/build-cartoon-enemy-action-atlases.py` 按透明像素连通域识别真实姿态后再生成 4×1 正式图集，避免把概念排版误当可切片资产。

本次审查的正式分类记录在 `Cubicle-Survivor-demo/assets/cartoon-marker-slice/asset-manifest.json`。权威共享人物系统已在 Demo V3.14 通过 640 项角色矩阵；本切片额外通过 12 项玩家方向/步态、4 项积压走路、5 项积压砸击、4 项邮件跑步、5 项邮件冲刺和 2 项左右朝向检查，32 项新动画画面指纹全部不同，原有 8 项敌人动作回归也继续通过。真实开局已完成第一次升级并继续战斗到剩余 9 份积压，控制台无错误；独立砸击判定探针确认蓄力期生命保持 100，落地后才降为 93。退场帧计时独立于升级弹窗暂停，避免尸体永久残留在选择页背后。

积压与邮件动画的生成源、透明中间图与正式图集均已保存到项目；`scripts/build-office-chibi-animation-atlases.py` 按透明连通域识别姿态，统一尺度、脚底线和格子，再输出 `office-chibi-animation-contract.json`。浏览器证据与关键文件 SHA-256 记录在 `Cubicle-Survivor-demo/office-chibi-animation-runtime-report.json`，避免把“看起来像帧动画的概念横条”误报为可直接使用的游戏图集。

## 手感起点

- 单线攻击间隔：约 0.68 秒。
- 复写后攻击间隔：约 0.57 秒，每次两条平行线。
- 攻击反馈：三层粗线、角色短后坐、敌人压扁/击退、纸张色块爆散。
- 邮件冲刺：约 0.42 秒红色预警环，随后短距离加速。
- 完成反馈：清空攻击与粒子残留，积压堆变成封闭归档夹，再显示“已归档”。

## 验收口径

- 首屏只回答任务、操作和主武器，不出现并行系统说明。
- 升级页只有“复写”“多画一条”和一个动作示意。
- 升级后 Build 标签与真实攻击同时变成双线。
- 完成页出现时，战场上没有残留攻击线或未完成敌人。
- 1280×720 与窄屏下主要按钮、目标、生命和进度均可见。
- `npm run qa` 包含 `cartoon-marker-slice-qa.js` 的静态合同检查。
