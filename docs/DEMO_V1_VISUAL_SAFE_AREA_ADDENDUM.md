# Demo V1 视觉安全区与源图清洗补充

Verified: 2026-07-13. This document applies only to the active `Cubicle-Survivor-demo/` package.

## 标题安全区

- 旧蓝色箱体截图不是当前 Demo V1 运行界面；当前武器选择页与材料工坊使用办公室文件柜/工位式原生比例框体。
- 在 1280×720 实测后，材料工坊标题组从原先约 13px 左留白、4px 顶留白调整为约 19px 左留白与 11px 顶留白；材料角标右留白从约 10px 提高到约 16px。
- 武器选择页标题组向内容区内收并压缩三层文字高度，标题、眉题和说明不再贴住顶框与底框。卡片区与页脚坐标保持不变。
- 菜单标题调整不改变战斗 HUD：连续战斗可视高度仍为 542/678px（79.9%），关卡标题仍只存在于顶部目标条内部。

## 源图清洗

- `assets/office-rogue-props.png` 此前被预加载但从未实际绘制。它已经从运行映射与可运行包移除，防止以后再次把“已加载”误判成“已落地”。
- 两张 VFX 生产图集、色键中间图以及像素风格板属于生产过程资料，不再留在可运行包中。
- 以上四个文件已归档到 `C:\Users\Administrator\Documents\DemoV1-backups\demo-v1-retired-source-art-20260713.tar.gz`。
- 归档 SHA256：`ECD9B33FFE9EF17B7111C0F86DDB901340106D33C594A93937899A0A4EB1B547`。
- `demo-qa.js` 会阻止这些生产资料或未落地图集重新进入运行包。
