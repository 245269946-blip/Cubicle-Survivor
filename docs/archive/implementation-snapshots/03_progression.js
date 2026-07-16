// ================================================================
// 03_PROGRESSION CURVE 成长曲线
// 每关期望强度·敌人压力·升级节奏·工坊节奏
// File: 03_progression.js | Load order: 3/7
// ================================================================



function rollOfficeIncident(stage) {
  const pool = [
    {
      id: "plusOne",
      title: "+1 来下命令了",
      text: "本关需求变多，但材料也更值钱。",
      apply: (g) => {
        g.stageConfig.totalEnemies += 6 + Math.floor(stage * 0.8);
        g.stageConfig.materialMult += 0.08;
      },
    },
    {
      id: "bossCheck",
      title: "老板来检查",
      text: "精英压力上升，清场奖励提高。",
      apply: (g) => {
        g.stageConfig.eliteTotal += stage >= 3 ? 1 : 0;
        g.elitesToSpawn = g.stageConfig.eliteTotal;
        g.stageConfig.clearBonusMult += 0.08;
      },
    },
    {
      id: "internOops",
      title: "实习生又闯祸了",
      text: "实习生事故怪增多，陷阱更好处理。",
      apply: (g) => {
        g.stageConfig.enemyMix.intern = (g.stageConfig.enemyMix.intern || 0) + 0.16;
        g.stageConfig.spawnInterval *= 0.96;
      },
    },
    {
      id: "languageDoc",
      title: "外语需求文档",
      text: "射程和幸运提升，审计和变更压力更高。",
      apply: (g) => {
        g.player.range += 10;
        g.player.luck += 4;
        g.stageConfig.enemyMix.audit = (g.stageConfig.enemyMix.audit || 0) + (stage >= 5 ? 0.1 : 0);
        g.stageConfig.enemyMix.change = (g.stageConfig.enemyMix.change || 0) + 0.06;
      },
    },
    {
      id: "afterWorkWine",
      title: "下班酒局邀约",
      text: "伤害和暴击提升，但容错更低。",
      apply: (g) => {
        addPlayerDamage(g, 0.04);
        g.player.crit = Math.min(75, g.player.crit + 2);
        g.player.maxHp = Math.max(60, g.player.maxHp - 3);
        g.player.hp = Math.min(g.player.hp, g.player.maxHp);
      },
    },
    {
      id: "serverCrash",
      title: "服务器宕机了",
      text: "部署全乱了——但混乱对你有好处。",
      apply: (g) => {
        g.stageConfig.totalEnemies = Math.round(g.stageConfig.totalEnemies * 1.12);
        g.stageConfig.spawnInterval *= 0.72;
        g.stageConfig.materialMult += 0.25;
        g.player.luck += 6;
        g.player.regen += 4;
        g.shopRefreshBonus = (g.shopRefreshBonus || 0) + 1;
      },
    },
  ];
  return pool[(stage * 7 + Math.floor(Math.random() * pool.length)) % pool.length];
}
function applyOfficeIncident() {
  if (!game.currentIncident) return;
  game.currentIncident.apply(game);
}

const weaponUpgradePool = [
  {
    id: "coffee",
    title: "加浓咖啡",
    tag: "武器 / 直射爆发",
    text: "咖啡射速提升，子弹伤害增加。",
    apply: (g) => {
      g.weapons.coffee.level += 1;
      g.player.coffeeCooldown *= 0.9;
    },
    available: (g) => g.weapons.coffee.level < g.weapons.coffee.max,
  },
  {
    id: "coffeePierce",
    title: "双倍浓缩",
    tag: "武器 / 直射爆发",
    text: "咖啡子弹获得额外穿透，适合点杀精英。",
    apply: (g) => {
      g.weapons.coffee.level += 1;
      g.player.coffeePierce += 1;
    },
    available: (g) => g.weapons.coffee.level >= 2 && g.weapons.coffee.level < g.weapons.coffee.max,
  },
  {
    id: "keyboard",
    title: "机械键轴",
    tag: "武器 / 近战打击",
    text: "键盘挥动范围扩大，伤害提升。",
    apply: (g) => {
      g.weapons.keyboard.level += 1;
      g.player.keyboardSwing += 1;
    },
    available: (g) => g.weapons.keyboard.level < g.weapons.keyboard.max,
  },
  {
    id: "keyboardBounce",
    title: "空格键重击",
    tag: "武器 / 近战打击",
    text: "每第3次挥动触发重击，范围伤害×2.5。",
    apply: (g) => {
      g.weapons.keyboard.level += 1;
      g.player.keyboardKnockback += 1;
    },
    available: (g) => g.weapons.keyboard.level >= 2 && g.weapons.keyboard.level < g.weapons.keyboard.max,
  },
  {
    id: "headset",
    title: "降噪耳机",
    tag: "武器 / 防守领域",
    text: "安静领域扩大，持续伤害提升。",
    apply: (g) => {
      g.weapons.headset.level += 1;
      g.player.auraRadius += 16;
      g.player.auraDamage += 2;
    },
    available: (g) => g.weapons.headset.level < g.weapons.headset.max,
  },
  {
    id: "headsetPulse",
    title: "白噪脉冲",
    tag: "武器 / 防守领域",
    text: "领域周期性击退附近敌人。",
    apply: (g) => {
      g.weapons.headset.level += 1;
      g.player.auraPulse += 1;
    },
    available: (g) => g.weapons.headset.level >= 2 && g.weapons.headset.level < g.weapons.headset.max,
  },
  {
    id: "report",
    title: "旋转报表",
    tag: "武器 / 轨道控制",
    text: "增加一份环绕报表，稳定切割近身目标。",
    apply: (g) => {
      g.weapons.report.level += 1;
      g.player.orbitCount += 1;
    },
    available: (g) => g.weapons.report.level < g.weapons.report.max,
  },
  {
    id: "reportSpeed",
    title: "季度复盘",
    tag: "武器 / 轨道控制",
    text: "报表旋转更快，轨道半径增加。",
    apply: (g) => {
      g.weapons.report.level += 1;
      g.player.orbitSpeed += 0.75;
      g.player.orbitRadius += 8;
    },
    available: (g) => g.weapons.report.level >= 2 && g.weapons.report.level < g.weapons.report.max,
  },
  {
    id: "stapler",
    title: "重型订书机",
    tag: "武器 / 扇形散射",
    text: "获得或强化订书机，射出扇形订书钉弹幕。",
    apply: (g) => {
      g.weapons.stapler.level += 1;
      g.player.staplerPellets += 1;
    },
    available: (g) => g.weapons.stapler.level < g.weapons.stapler.max,
  },
  {
    id: "staplerPunch",
    title: "加厚钉匣",
    tag: "武器 / 扇形散射",
    text: "订书钉弹片数增加，冷却缩短。",
    apply: (g) => {
      g.weapons.stapler.level += 1;
      g.player.staplerCooldown *= 0.88;
    },
    available: (g) => g.weapons.stapler.level >= 2 && g.weapons.stapler.level < g.weapons.stapler.max,
  },
  {
    id: "sticky",
    title: "黄色便签",
    tag: "武器 / 陷阱控场",
    text: "获得或强化便签陷阱，踩入范围的敌人持续受伤。",
    apply: (g) => {
      g.weapons.sticky.level += 1;
      g.player.stickyRadius += 8;
    },
    available: (g) => g.weapons.sticky.level < g.weapons.sticky.max,
  },
  {
    id: "stickyStack",
    title: "便签墙",
    tag: "武器 / 陷阱控场",
    text: "便签持续更久，布置速度更快。",
    apply: (g) => {
      g.weapons.sticky.level += 1;
      g.player.stickyCooldown *= 0.9;
      g.player.stickyLife += 0.8;
    },
    available: (g) => g.weapons.sticky.level >= 2 && g.weapons.sticky.level < g.weapons.sticky.max,
  },
  {
    id: "marker",
    title: "紫色马克笔",
    tag: "武器 / 贯穿射线",
    text: "获得或强化马克笔，周期性画出贯穿射线。",
    apply: (g) => {
      g.weapons.marker.level += 1;
      g.player.markerWidth += 2;
    },
    available: (g) => g.weapons.marker.level < g.weapons.marker.max,
  },
  {
    id: "markerInk",
    title: "补充墨水",
    tag: "武器 / 贯穿射线",
    text: "马克笔射线伤害提升，冷却缩短。",
    apply: (g) => {
      g.weapons.marker.level += 1;
      g.player.markerCooldown *= 0.9;
    },
    available: (g) => g.weapons.marker.level >= 2 && g.weapons.marker.level < g.weapons.marker.max,
  },
  {
    id: "calculator",
    title: "财务计算器",
    tag: "武器 / 连锁点杀",
    text: "获得或强化计算器，电流会在敌人之间跳跃。",
    apply: (g) => {
      g.weapons.calculator.level += 1;
      g.player.chainJumps += 1;
    },
    available: (g) => g.weapons.calculator.level < g.weapons.calculator.max,
  },
  {
    id: "calculatorTax",
    title: "自动报税",
    tag: "武器 / 连锁点杀",
    text: "计算器连锁距离和伤害提升。",
    apply: (g) => {
      g.weapons.calculator.level += 1;
      g.player.chainRange += 28;
    },
    available: (g) => g.weapons.calculator.level >= 2 && g.weapons.calculator.level < g.weapons.calculator.max,
  },
  {
    id: "shredder",
    title: "桌边碎纸机",
    tag: "武器 / 定向锥形",
    text: "获得或强化碎纸机，向敌人喷射碎纸锥形。",
    apply: (g) => {
      g.weapons.shredder.level += 1;
      g.player.shredderConeAngle += 6;
      g.player.shredderRange += 10;
    },
    available: (g) => g.weapons.shredder.level < g.weapons.shredder.max,
  },
  {
    id: "shredderMotor",
    title: "工业级电机",
    tag: "武器 / 定向锥形",
    text: "锥形角度扩大，有效距离增加。",
    apply: (g) => {
      g.weapons.shredder.level += 1;
      g.player.shredderConeAngle += 8;
      g.player.shredderRange += 14;
    },
    available: (g) => g.weapons.shredder.level >= 2 && g.weapons.shredder.level < g.weapons.shredder.max,
  },
  {
    id: "shredderFeed",
    title: "加宽进纸口",
    tag: "武器 / 定向锥形",
    text: "碎纸伤害大幅提升，敌人被绞碎后减速更明显。",
    apply: (g) => {
      g.weapons.shredder.level += 1;
      g.player.shredderDps += 5;
      g.player.shredderRange += 8;
    },
    available: (g) => g.weapons.shredder.level >= 2 && g.weapons.shredder.level < g.weapons.shredder.max,
  },
  {
    id: "shredderAuto",
    title: "机密销毁",
    tag: "武器 / 定向锥形",
    text: "锥形内击杀敌人触发纸屑爆炸，范围溅射伤害。",
    apply: (g) => {
      g.weapons.shredder.level += 1;
      g.player.shredderConeAngle += 6;
      g.player.shredderRange += 6;
    },
    available: (g) => g.weapons.shredder.level >= 4 && g.weapons.shredder.level < g.weapons.shredder.max,
  },
  {
    id: "thermos",
    title: "保温杯热茶",
    tag: "武器 / 站桩治疗",
    text: "获得或强化保温杯，停留蓄茶温，蒸汽治疗并减速敌人。",
    apply: (g) => {
      g.weapons.thermos.level += 1;
      g.player.thermosChargeBonus += 0.12;
    },
    available: (g) => g.weapons.thermos.level < g.weapons.thermos.max,
  },
  {
    id: "thermosLiner",
    title: "真空内胆",
    tag: "武器 / 站场续航",
    text: "保温杯蓄能更快，茶温上限提前提升。",
    apply: (g) => {
      g.weapons.thermos.level += 1;
      g.player.thermosChargeBonus += 0.22;
      g.player.thermosTeaMax += 18;
    },
    available: (g) => g.weapons.thermos.level >= 2 && g.weapons.thermos.level < g.weapons.thermos.max,
  },
  {
    id: "thermosSteam",
    title: "滚烫蒸汽",
    tag: "武器 / 领域控制",
    text: "蒸汽范围扩大，高茶温时造成持续伤害。",
    apply: (g) => {
      g.weapons.thermos.level += 1;
      g.player.thermosRadius += 14;
    },
    available: (g) => g.weapons.thermos.level >= 2 && g.weapons.thermos.level < g.weapons.thermos.max,
  },
  {
    id: "thermosRefill",
    title: "无限续杯",
    tag: "武器 / 支援爆发",
    text: "高茶温会留下茶渍区，满杯时释放一次全场茶爆。",
    apply: (g) => {
      g.weapons.thermos.level += 1;
      g.player.thermosTeaMax += 24;
      g.player.thermosBurstHeal += 2;
    },
    available: (g) => g.weapons.thermos.level >= 4 && g.weapons.thermos.level < g.weapons.thermos.max,
  },
  {
    id: "coffeeThermos",
    title: "保温杯续航",
    tag: "武器 / 直射频率",
    text: "咖啡冷却明显缩短，攻速收益更高。",
    apply: (g) => {
      g.weapons.coffee.level += 1;
      g.player.coffeeCooldown *= 0.84;
      addPlayerAttackSpeed(g, 4);
    },
    available: (g) => g.weapons.coffee.level >= 3 && g.weapons.coffee.level < g.weapons.coffee.max,
  },
  {
    id: "keyboardMacro",
    title: "宏录制",
    tag: "武器 / 近战强化",
    text: "键盘挥动范围和伤害大幅提升。",
    apply: (g) => {
      g.weapons.keyboard.level += 1;
      g.player.keyboardSwing += 2;
      addPlayerAttackSpeed(g, 3);
    },
    available: (g) => g.weapons.keyboard.level >= 3 && g.weapons.keyboard.level < g.weapons.keyboard.max,
  },
  {
    id: "headsetMetronome",
    title: "降噪节拍器",
    tag: "武器 / 领域频率",
    text: "安静领域脉冲更频繁，站场流更容易控住近身怪。",
    apply: (g) => {
      g.weapons.headset.level += 1;
      g.player.auraPulse += 1;
      g.player.fortify += 1;
    },
    available: (g) => g.weapons.headset.level >= 3 && g.weapons.headset.level < g.weapons.headset.max,
  },
  {
    id: "reportBinder",
    title: "装订报表",
    tag: "武器 / 轨道厚度",
    text: "报表轨道半径、速度和碰撞范围提升。",
    apply: (g) => {
      g.weapons.report.level += 1;
      g.player.orbitRadius += 10;
      g.player.orbitSpeed += 0.45;
    },
    available: (g) => g.weapons.report.level >= 3 && g.weapons.report.level < g.weapons.report.max,
  },
  {
    id: "staplerMagazine",
    title: "连发钉仓",
    tag: "武器 / 近距频率",
    text: "订书机冷却缩短，并增加钉弹数量。",
    apply: (g) => {
      g.weapons.stapler.level += 1;
      g.player.staplerPellets += 2;
      g.player.staplerCooldown *= 0.9;
    },
    available: (g) => g.weapons.stapler.level >= 3 && g.weapons.stapler.level < g.weapons.stapler.max,
  },
  {
    id: "stickyCopyPaste",
    title: "复制粘贴",
    tag: "武器 / 工程布场",
    text: "便签布置更快，范围更大。",
    apply: (g) => {
      g.weapons.sticky.level += 1;
      g.player.stickyCooldown *= 0.84;
      g.player.stickyRadius += 10;
    },
    available: (g) => g.weapons.sticky.level >= 3 && g.weapons.sticky.level < g.weapons.sticky.max,
  },
  {
    id: "markerWide",
    title: "荧光宽头",
    tag: "武器 / 贯穿范围",
    text: "马克笔射线更宽，释放更快。",
    apply: (g) => {
      g.weapons.marker.level += 1;
      g.player.markerWidth += 5;
      g.player.markerCooldown *= 0.86;
    },
    available: (g) => g.weapons.marker.level >= 3 && g.weapons.marker.level < g.weapons.marker.max,
  },
  {
    id: "calculatorLedger",
    title: "审计台账",
    tag: "武器 / 连锁距离",
    text: "计算器连锁距离、跳数和幸运收益提升。",
    apply: (g) => {
      g.weapons.calculator.level += 1;
      g.player.chainRange += 42;
      g.player.chainJumps += 1;
      g.player.luck += 4;
    },
    available: (g) => g.weapons.calculator.level >= 3 && g.weapons.calculator.level < g.weapons.calculator.max,
  },
];

const statUpgradePool = [
  {
    id: "sprint",
    title: "摸鱼步法",
    tag: "属性 / 机动",
    text: "移动速度提升，受伤后的无敌时间变长。",
    apply: (g) => {
      g.player.speed += 18;
      g.player.invulnBonus += 0.06;
    },
    available: (g) => g.player.speed < 360,
  },
  {
    id: "focus",
    title: "深度专注",
    tag: "属性 / 输出",
    text: "恢复专注上限，并小幅提升全部伤害。",
    apply: (g) => {
      g.player.maxHp += 10;
      g.player.hp = Math.min(g.player.maxHp, g.player.hp + 25);
      addPlayerDamage(g, 0.08);
      g.player.pickupRange += 8;
    },
    available: (g) => g.player.damageMult < DAMAGE_MULT_HARD_CAP,
  },
  {
    id: "attackSpeed",
    title: "快捷键肌肉记忆",
    tag: "属性 / 攻速",
    text: "攻速 +12%，小幅提升射程。",
    apply: (g) => {
      addPlayerAttackSpeed(g, 12);
      g.player.range += 8;
    },
    available: (g) => g.player.attackSpeed < ATTACK_SPEED_HARD_CAP,
  },
  {
    id: "crit",
    title: "灵光一现",
    tag: "属性 / 暴击",
    text: "暴击 +8%，伤害 +3%。",
    apply: (g) => {
      g.player.crit = Math.min(75, g.player.crit + 8);
      addPlayerDamage(g, 0.03);
    },
    available: (g) => g.player.crit < 75,
  },
  {
    id: "range",
    title: "超长数据线",
    tag: "属性 / 射程",
    text: "射程 +35，拾取 +12。",
    apply: (g) => {
      g.player.range += 35;
      g.player.pickupRange += 12;
    },
    available: (g) => g.player.range < 260,
  },
  {
    id: "padding",
    title: "人体工学椅",
    tag: "属性 / 防御",
    text: "生命上限和护甲提升，容错更高。",
    apply: (g) => {
      g.player.maxHp += 16;
      g.player.hp += 16;
      g.player.armor += 2;
    },
    available: (g) => g.player.maxHp < 220,
  },
  {
    id: "dodge",
    title: "老板视线死角",
    tag: "属性 / 闪避",
    text: "获得闪避率，最高 60%。",
    apply: (g) => {
      g.player.dodge = Math.min(60, g.player.dodge + 8);
      g.player.speed += 8;
    },
    available: (g) => g.player.dodge < 60,
  },
  {
    id: "luck",
    title: "玄学工牌",
    tag: "属性 / 幸运",
    text: "幸运提升，增加额外补给和属性芯片掉落。",
    apply: (g) => {
      g.player.luck += 12;
      g.player.pickupRange += 10;
    },
    available: (g) => g.player.luck < 120,
  },
  {
    id: "regen",
    title: "热水续杯",
    tag: "属性 / 恢复",
    text: "获得生命恢复，并小幅提升生命上限。",
    apply: (g) => {
      g.player.regen += 2;
      g.player.maxHp += 8;
      g.player.hp = Math.min(g.player.maxHp, g.player.hp + 18);
    },
    available: (g) => g.player.regen < 18,
  },
  {
    id: "magnet",
    title: "工位磁场",
    tag: "属性 / 经济",
    text: "扩大拾取范围，经验和补给更容易吃到。",
    apply: (g) => {
      g.player.pickupRange += 42;
      g.player.luck += 4;
    },
    available: (g) => g.player.pickupRange < 420,
  },
  {
    id: "overclock",
    title: "超频工位",
    tag: "属性 / 高速",
    text: "攻速 +22%，伤害 +5%，生命上限 -8。适合弹幕和连锁流。",
    apply: (g) => {
      addPlayerAttackSpeed(g, 22);
      addPlayerDamage(g, 0.05);
      g.player.maxHp = Math.max(55, g.player.maxHp - 8);
      g.player.hp = Math.min(g.player.hp, g.player.maxHp);
    },
    available: (g) => g.player.attackSpeed < ATTACK_SPEED_HARD_CAP && g.player.maxHp > 65,
  },
  {
    id: "glassBuild",
    title: "玻璃绩效",
    tag: "属性 / 爆发",
    text: "伤害 +18%，暴击 +6%，护甲 -2。适合精准贯穿。",
    apply: (g) => {
      addPlayerDamage(g, 0.18);
      g.player.crit = Math.min(75, g.player.crit + 6);
      g.player.armor = Math.max(-6, g.player.armor - 2);
    },
    available: (g) => g.player.damageMult < DAMAGE_MULT_HARD_CAP,
  },
  {
    id: "compound",
    title: "预算复利",
    tag: "属性 / 幸运",
    text: "幸运 +18，拾取 +16。幸运现在同时提升材料和额外掉落。",
    apply: (g) => {
      g.player.luck += 18;
      g.player.pickupRange += 16;
    },
    available: (g) => g.stage <= 7 && g.player.luck < 180,
  },
  {
    id: "evasive",
    title: "滑步摸鱼",
    tag: "属性 / 闪避",
    text: "闪避 +12%，速度 +14，护甲 -1。适合高机动绕圈。",
    apply: (g) => {
      g.player.dodge = Math.min(60, g.player.dodge + 12);
      g.player.speed += 14;
      g.player.armor = Math.max(-6, g.player.armor - 1);
    },
    available: (g) => g.player.dodge < 60,
  },
  {
    id: "fortifiedDesk",
    title: "固定工位",
    tag: "属性 / 站场",
    text: "站场 +3，护甲 +1。停住片刻后领域、轨道和减伤会逐步升温。",
    apply: (g) => {
      g.player.fortify += 3;
      g.player.armor += 1;
    },
    available: (g) => g.player.fortify < 32,
  },
  {
    id: "quietField",
    title: "安静防线",
    tag: "属性 / 领域",
    text: "站场 +2，恢复 +1，安静领域的周期脉冲更明显。",
    apply: (g) => {
      g.player.fortify += 2;
      g.player.regen += 1;
      g.player.armor += 1;
    },
    available: (g) => g.player.fortify < 36 || g.player.regen < 18,
  },
  {
    id: "trapManual",
    title: "工位布线手册",
    tag: "属性 / 工程",
    text: "幸运 +10，拾取 +18。工程职业会把这些转化为便签和计算器收益。",
    apply: (g) => {
      g.player.luck += 10;
      g.player.pickupRange += 18;
    },
    available: (g) => g.player.luck < 190 || g.player.pickupRange < 450,
  },
  {
    id: "shieldProtocol",
    title: "防火墙协议",
    tag: "属性 / 防御",
    text: "护甲 +3，站场 +1。站住时承伤进一步降低。",
    apply: (g) => {
      g.player.armor += 3;
      g.player.fortify += 1;
      g.player.maxHp += 8;
      g.player.hp = Math.min(g.player.maxHp, g.player.hp + 16);
    },
    available: (g) => g.player.armor < 28,
  },
  {
    id: "glossary",
    title: "黑话术语表",
    tag: "属性 / 射程 幸运",
    text: "射程 +24，幸运 +8。更容易看懂变更、审计和跨组需求。",
    apply: (g) => {
      g.player.range += 24;
      g.player.luck += 8;
    },
    available: (g) => g.stage <= 8 && (g.player.range < 330 || g.player.luck < 170),
  },
  {
    id: "afterWorkDrink",
    title: "下班小酒",
    tag: "属性 / 爆发",
    text: "伤害 +10%，暴击 +4%，闪避 -3%。短线爆发更猛。",
    apply: (g) => {
      addPlayerDamage(g, 0.1);
      g.player.crit = Math.min(75, g.player.crit + 4);
      g.player.dodge = Math.max(0, g.player.dodge - 3);
    },
    available: (g) => g.player.damageMult < DAMAGE_MULT_HARD_CAP || g.player.crit < 75,
  },
  {
    id: "bilingualMinutes",
    title: "双语会议纪要",
    tag: "属性 / 射程 幸运 后期",
    text: "射程 +34，幸运 +10，计算器连锁更远，马克笔更容易打到弱点。",
    apply: (g) => {
      g.player.range += 34;
      g.player.luck += 10;
      g.player.chainRange += 24;
    },
    available: (g) => g.stage >= 5 && (g.player.range < 380 || g.player.luck < 190),
  },
  {
    id: "wineTableReview",
    title: "酒局复盘",
    tag: "属性 / 爆发 后期",
    text: "伤害 +10%，暴击 +8%，生命 -8。后半程极端输出选择。",
    apply: (g) => {
      addPlayerDamage(g, 0.1);
      g.player.crit = Math.min(75, g.player.crit + 8);
      g.player.maxHp = Math.max(55, g.player.maxHp - 8);
      g.player.hp = Math.min(g.player.hp, g.player.maxHp);
    },
    available: (g) => g.stage >= 6 && (g.player.damageMult < DAMAGE_MULT_HARD_CAP || g.player.crit < 75),
  },
  {
    id: "laserCalibration",
    title: "激光笔校准",
    tag: "属性 / 武器专属",
    text: "马马克笔等级越高收益越高，射程和暴击提升。",
    apply: (g) => {
      g.player.range += 22 + g.weapons.marker.level * 5;
      g.player.crit = Math.min(75, g.player.crit + 4 + g.weapons.marker.level);
    },
    available: (g) => g.weapons.marker.level >= 2 && g.player.range < 360,
  },
  {
    id: "reportAuditTrail",
    title: "报表审计链",
    tag: "属性 / 武器专属",
    text: "报表和计算器会更克制审计、警报和老板类压力。",
    apply: (g) => {
      g.player.range += 12;
      g.player.luck += 8;
      g.player.orbitSpeed += 0.3;
      g.player.chainRange += 18;
    },
    available: (g) => g.stage >= 4 && (g.weapons.report.level > 0 || g.weapons.calculator.level > 0),
  },
  {
    id: "noiseCancelFort",
    title: "降噪堡垒",
    tag: "属性 / 武器专属 领域",
    text: "耳机等级越高，站场、防御和恢复收益越高。被围住时更容易稳住阵地。",
    apply: (g) => {
      const headset = Math.max(1, g.weapons.headset.level);
      g.player.fortify += 2 + headset;
      g.player.armor += 1 + Math.floor(headset / 3);
      g.player.regen += 1;
    },
    available: (g) => g.stage >= 3 && g.weapons.headset.level >= 2 && g.player.fortify < 48,
  },
  {
    id: "paperOrbitDrill",
    title: "报表环形演练",
    tag: "属性 / 武器专属 站场",
    text: "报表轨道更厚，站场越高越能挡住近身压力。",
    apply: (g) => {
      g.player.fortify += 3;
      g.player.orbitRadius += 8;
      g.player.orbitSpeed += 0.45;
      g.player.maxHp += 6;
      g.player.hp = Math.min(g.player.maxHp, g.player.hp + 12);
    },
    available: (g) => g.stage >= 4 && g.weapons.report.level >= 2 && g.player.fortify < 50,
  },
  {
    id: "deskMinePermit",
    title: "工位地雷许可",
    tag: "属性 / 武器专属 工程",
    text: "便签陷阱更大更久，适合把高速怪牵进工位雷区。",
    apply: (g) => {
      g.player.luck += 12;
      g.player.pickupRange += 28;
      g.player.stickyRadius += 10;
      g.player.stickyLife += 0.7;
    },
    available: (g) => g.stage >= 3 && g.weapons.sticky.level >= 2 && (g.player.luck < 210 || g.player.pickupRange < 480),
  },
  {
    id: "contractLanguage",
    title: "合同语言学",
    tag: "属性 / 射程 幸运 后期",
    text: "射程和幸运大幅提升，并强化激光笔、报表和审计克制。",
    apply: (g) => {
      g.player.range += 42;
      g.player.luck += 18;
      g.player.chainRange += 16;
    },
    available: (g) => g.stage >= 8 && (g.player.range < 430 || g.player.luck < 230),
  },
  {
    id: "socialDrinking",
    title: "酒桌破局",
    tag: "属性 / 爆发 后期",
    text: "伤害和暴击大幅提升，但护甲下降。适合用爆发压过后半程压力。",
    apply: (g) => {
      addPlayerDamage(g, 0.12);
      g.player.crit = Math.min(75, g.player.crit + 10);
      g.player.armor = Math.max(-8, g.player.armor - 2);
    },
    available: (g) => g.stage >= 8 && (g.player.damageMult < DAMAGE_MULT_HARD_CAP || g.player.crit < 75),
  },
  {
    id: "shredderMaintenance",
    title: "碎纸机维护",
    tag: "属性 / 武器专属 近距",
    text: "碎纸机锥形角度、范围和伤害提升，适合贴身绞碎。",
    apply: (g) => {
      g.player.shredderConeAngle += 10;
      g.player.shredderRange += 12;
      g.player.shredderDps += 4;
      g.player.armor += 1;
    },
    available: (g) => g.weapons.shredder.level >= 2 && (g.player.shredderRange < 200 || g.player.armor < 26),
  },
  {
    id: "teaRoomRoutine",
    title: "茶水间节奏",
    tag: "属性 / 武器专属 站场",
    text: "保温杯蓄茶更快，站场和恢复提高，适合慢慢把阵地热起来。",
    apply: (g) => {
      g.player.thermosChargeBonus += 0.28;
      g.player.thermosRadius += 10;
      g.player.fortify += 2;
      g.player.regen += 1;
    },
    available: (g) => g.weapons.thermos.level >= 2 && (g.player.fortify < 52 || g.player.regen < 20),
  },
  {
    id: "crisisManual",
    title: "危机处理手册",
    tag: "属性 / 防御 工程",
    text: "面对高速和精英压力时更稳：护甲、幸运和拾取提高。",
    apply: (g) => {
      g.player.armor += 2;
      g.player.luck += 12;
      g.player.pickupRange += 20;
    },
    available: (g) => g.stage >= 6 && (g.player.armor < 30 || g.player.luck < 230),
  },
];

const itemPool = [
  {
    id: "lunchbox",
    title: "加班便当",
    tag: "道具 / 生存",
    text: "生命 +18，恢复 +1。",
    apply: (g) => {
      g.player.maxHp += 18;
      g.player.hp = Math.min(g.player.maxHp, g.player.hp + 24);
      g.player.regen += 1;
    },
  },
  {
    id: "rubberSole",
    title: "静音鞋底",
    tag: "道具 / 闪避",
    text: "闪避 +6%，速度 +10。",
    apply: (g) => {
      g.player.dodge = Math.min(60, g.player.dodge + 6);
      g.player.speed += 10;
    },
  },
  {
    id: "luckyBadge",
    title: "幸运工牌贴",
    tag: "道具 / 经济",
    text: "幸运 +16。幸运会同时提升材料和额外掉落。",
    apply: (g) => {
      g.player.luck += 16;
    },
  },
  {
    id: "oldHardDrive",
    title: "旧硬盘",
    tag: "道具 / 输出",
    text: "伤害 +10%，速度 -8。",
    apply: (g) => {
      addPlayerDamage(g, 0.1);
      g.player.speed = Math.max(140, g.player.speed - 8);
    },
  },
  {
    id: "fileCabinet",
    title: "文件柜护板",
    tag: "道具 / 防御",
    text: "护甲 +4，闪避 -3%。",
    apply: (g) => {
      g.player.armor += 4;
      g.player.dodge = Math.max(0, g.player.dodge - 3);
    },
  },
  {
    id: "wirelessMouse",
    title: "无线鼠标",
    tag: "道具 / 拾取",
    text: "拾取 +55，幸运 +4。",
    apply: (g) => {
      g.player.pickupRange += 55;
      g.player.luck += 4;
    },
  },
  {
    id: "energyDrink",
    title: "能量饮料",
    tag: "道具 / 爆发",
    text: "伤害 +6%，速度 +14，生命 -6。",
    apply: (g) => {
      addPlayerDamage(g, 0.06);
      g.player.speed += 14;
      g.player.maxHp = Math.max(40, g.player.maxHp - 6);
      g.player.hp = Math.min(g.player.hp, g.player.maxHp);
    },
  },
  {
    id: "deskFan",
    title: "桌面小风扇",
    tag: "道具 / 控场",
    text: "护甲 +1，拾取 +25，恢复 +1。",
    apply: (g) => {
      g.player.armor += 1;
      g.player.pickupRange += 25;
      g.player.regen += 1;
    },
  },
  {
    id: "macroPad",
    title: "宏键小板",
    tag: "道具 / 攻速",
    text: "攻速 +18%，伤害 -4%。",
    apply: (g) => {
      addPlayerAttackSpeed(g, 18);
      g.player.damageMult = Math.max(0.45, g.player.damageMult - 0.04);
    },
  },
  {
    id: "redPen",
    title: "红笔批注",
    tag: "道具 / 暴击",
    text: "暴击 +12%，护甲 -1。",
    apply: (g) => {
      g.player.crit = Math.min(75, g.player.crit + 12);
      g.player.armor = Math.max(0, g.player.armor - 1);
    },
  },
  {
    id: "projector",
    title: "会议投影仪",
    tag: "道具 / 射程",
    text: "射程 +55，速度 -10。",
    apply: (g) => {
      g.player.range += 55;
      g.player.speed = Math.max(140, g.player.speed - 10);
    },
  },
  {
    id: "laserPointer",
    title: "激光翻页笔",
    tag: "道具 / 暴击 射程",
    text: "射程 +45，暴击 +10%，攻速 -6%。精准贯穿流收益更高。",
    apply: (g) => {
      g.player.range += 45;
      g.player.crit = Math.min(75, g.player.crit + 10);
      g.player.attackSpeed = Math.max(-45, g.player.attackSpeed - 6);
    },
  },
  {
    id: "standingDesk",
    title: "升降工位",
    tag: "道具 / 闪避 攻速",
    text: "攻速 +14%，闪避 +8%，护甲 -1。弹幕近距流更灵活。",
    apply: (g) => {
      addPlayerAttackSpeed(g, 14);
      g.player.dodge = Math.min(60, g.player.dodge + 8);
      g.player.armor = Math.max(-6, g.player.armor - 1);
    },
  },
  {
    id: "assetLedger",
    title: "资产台账",
    tag: "道具 / 经济 拾取",
    text: "幸运 +16，拾取 +45，速度 -8。工程支援流滚雪球更快。",
    apply: (g) => {
      g.player.luck += 16;
      g.player.pickupRange += 45;
      g.player.speed = Math.max(140, g.player.speed - 8);
    },
  },
  {
    id: "quietRoom",
    title: "静音会议室",
    tag: "道具 / 防御 恢复",
    text: "护甲 +3，恢复 +2，射程 -18。更适合贴身控场和稳住阵地。",
    apply: (g) => {
      g.player.armor += 3;
      g.player.regen += 2;
      g.player.range = Math.max(-40, g.player.range - 18);
    },
  },
  {
    id: "redlineContract",
    title: "红线承诺",
    tag: "道具 / 输出 爆发",
    text: "伤害 +16%，生命 -10。适合想清场拿高奖励的爆发打法。",
    apply: (g) => {
      addPlayerDamage(g, 0.16);
      g.player.maxHp = Math.max(50, g.player.maxHp - 10);
      g.player.hp = Math.min(g.player.hp, g.player.maxHp);
    },
  },
  {
    id: "insuranceClause",
    title: "兜底条款",
    tag: "道具 / 生存 控制",
    text: "生命 +24，护甲 +2，伤害 -6%。适合后期稳住阵地。",
    apply: (g) => {
      g.player.maxHp += 24;
      g.player.hp = Math.min(g.player.maxHp, g.player.hp + 24);
      g.player.armor += 2;
      g.player.damageMult = Math.max(0.55, g.player.damageMult - 0.06);
    },
  },
  {
    id: "ergonomicMat",
    title: "人体工学脚垫",
    tag: "道具 / 站场 防御",
    text: "站场 +4，护甲 +2。停住后更快搭起安全工位。",
    apply: (g) => {
      g.player.fortify += 4;
      g.player.armor += 2;
    },
  },
  {
    id: "whiteboardWall",
    title: "白板防线",
    tag: "道具 / 工程 领域",
    text: "站场 +2，幸运 +8，拾取提升。适合边守边布网。",
    apply: (g) => {
      g.player.fortify += 2;
      g.player.luck += 8;
      g.player.pickupRange += 24;
    },
  },
  {
    id: "deskLamp",
    title: "加班小台灯",
    tag: "道具 / 恢复 站场",
    text: "恢复 +2，站场 +2，护甲 +1。站住时更能守住阵地。",
    apply: (g) => {
      g.player.regen += 2;
      g.player.fortify += 2;
      g.player.armor += 1;
    },
  },
  {
    id: "cableNest",
    title: "线缆巢穴",
    tag: "道具 / 工程 控制",
    text: "幸运 +12，拾取 +28。便签和电流更容易滚起来。",
    apply: (g) => {
      g.player.pickupRange += 28;
      g.player.luck += 12;
    },
  },
  {
    id: "liquorCoffee",
    title: "咖啡利口酒",
    tag: "道具 / 酒 爆发",
    text: "伤害 +12%，暴击 +5%，攻速 +8%，护甲 -1。",
    apply: (g) => {
      addPlayerDamage(g, 0.12);
      g.player.crit = Math.min(75, g.player.crit + 5);
      addPlayerAttackSpeed(g, 8);
      g.player.armor = Math.max(-6, g.player.armor - 1);
    },
  },
  {
    id: "translationHeadset",
    title: "同传耳麦",
    tag: "道具 / 翻译 控制",
    text: "射程 +18，拾取 +20，幸运 +6。领域和连锁更容易读懂场面。",
    apply: (g) => {
      g.player.pickupRange += 20;
      g.player.range += 18;
      g.player.luck += 6;
    },
  },
  {
    id: "foreignContract",
    title: "外文合同",
    tag: "道具 / 翻译 经济",
    text: "射程 +24，幸运 +16。审计压力会更好处理。",
    apply: (g) => {
      g.player.range += 24;
      g.player.luck += 16;
    },
  },
  // Mythic items (P0-2) - at most 1 per game
  {
    id: "stockOptions",
    title: "全员持股",
    tag: "道具 / 神话",
    text: "所有武器等级+1（可突破上限至8级），暴击+25%。",
    rarity: "mythic",
    apply: (g) => {
      for (const key of Object.keys(g.weapons)) {
        if (g.weapons[key].level > 0) {
          g.weapons[key].level = Math.min(8, g.weapons[key].level + 1);
        }
      }
      g.player.crit = Math.min(90, g.player.crit + 25);
      g.boughtItemTags.push("mythic");
    },
    available: (g) => !g.boughtItemTags.includes("mythic") && g.stage >= 10,
  },
  {
    id: "noncompete",
    title: "竞业禁止",
    tag: "道具 / 神话",
    text: "牺牲一个武器槽位，所有剩余武器伤害×1.5。",
    rarity: "mythic",
    apply: (g) => {
      const filled = buildOrder.filter(function(k) { return g.weapons[k].level > 0; });
      if (filled.length > 1) {
        const sacrifice = filled.find(function(k) { return k !== "coffee" && g.weapons[k].level < 5; }) || filled[filled.length - 1];
        g.weapons[sacrifice].level = 0;
        g.weaponSlots -= 1;
      }
      for (const key of Object.keys(g.weapons)) {
        if (g.weapons[key].level > 0) {
          g.player.damageMult = Math.min(DAMAGE_MULT_HARD_CAP, g.player.damageMult * 1.5);
        }
      }
      g.boughtItemTags.push("mythic");
    },
    available: (g) => !g.boughtItemTags.includes("mythic") && g.stage >= 7,
  },
  {
    id: "wfh",
    title: "居家办公",
    tag: "道具 / 神话",
    text: "拾取范围×3，站桩时每秒自动拾取全屏掉落。",
    rarity: "mythic",
    apply: (g) => {
      g.player.pickupRange *= 3;
      g.wfhActive = true;
      g.boughtItemTags.push("mythic");
    },
    available: (g) => !g.boughtItemTags.includes("mythic") && (g.endless || g.stage >= 12),
  },
];

function createGame() {
  const stageConfig = getStageConfig(1);
  return {
    time: 0,
    waveTime: 0,
    stage: 1,
    maxStage: MAX_STAGE,
    stageConfig,
    currentIncident: null,
    stageKills: 0,
    stageSpawned: 0,
    enemiesToSpawn: stageConfig.totalEnemies,
    elitesToSpawn: stageConfig.eliteTotal,
    bossSpawned: false,
    lastClearReason: "",
    lastStageBonus: 0,
    recoveryTime: 0,
    pendingStageEnd: null,
    materials: 0,
    weaponSlots: 6,
    itemSlots: 6,
    rerollCount: 0,
    shopOffers: [],
    lockedShopOffers: [],
    currentUpgradeChoices: [],
    upgradeRerolls: 0,
    weaponUpgradeCounts: {},
    boughtItems: new Set(),
    boughtItemNames: [],
    boughtItemTags: [],
    boughtItemRecords: [],
    pendingItemChoice: null,
    itemReplaceReturnState: "playing",
    itemDropCooldown: 0,
    activePolicy: null,
    policyCooldownMult: 1,
    policyEnemySpeedMult: 1,
    policyMaterialMult: 1,
    policyXpMult: 1,
    policyRefreshAdd: 0,
    policyClassThresholdOffset: 0,
    policyClassBonusMult: 1,
    policyRemoteDamagePenalty: false,
    policyMagnetMult: 1,
    policyEliteDropMult: 1,
    endless: false,
    overtimeTimer: 0,
    overtimeLevel: 0,
    overtimeBreakTimer: 120,
    fusionHintsSeen: new Set(),
    fusionLog: [],
    routeTiers: {},
    evolutionHintsSeen: new Set(),
    evolvedWeapons: new Set(),
    perimeterPulseCooldown: 0,
    kills: 0,
    hitsTaken: 0,
    damageTaken: 0,
    damageBySource: {},
    lastDamageSource: "",
    damageFlash: 0,
    hitStop: 0,
    screenShake: 0,
    swingTrails: [],
    level: 1,
    upgradesTaken: 0,
    pendingLevelUps: 0,
    upgradeReturnState: "playing",
    xp: 0,
    xpNext: 26,
    spawnTimer: 0,
    eliteTimer: 24,
    projectiles: [],
    enemies: [],
    particles: [],
    floatingTexts: [],
    pickups: [],
    damageZones: [],
    delayedBlasts: [],
    orbitAngle: 0,
    camera: { x: 0, y: 0 },
    player: {
      x: WORLD.w / 2,
      y: WORLD.h / 2,
      r: 18,
      hp: 100,
      maxHp: 100,
      armor: 0,
      dodge: 0,
      speed: 245,
      attackSpeed: 0,
      damageMult: 1,
      crit: 0,
      range: 0,
      luck: 0,
      pickupRange: 150,
      regen: 0,
      regenTimer: 0,
      fortify: 0,
      anchorTime: 0,
      fieldTextTimer: 0,
      slow: 1,
      invuln: 0,
      invulnBonus: 0,
      facingX: 1,
      facingY: 0,
      vx: 0,
      vy: 0,
      coffeeTimer: 0,
      coffeeShotCount: 0,
      coffeeCooldown: 0.62,
      coffeePierce: 1,
      keyboardTimer: 0,
      keyboardSwing: 1,
      keyboardKnockback: 0,
      keyboardSwingCount: 0,
      staplerTimer: 0,
      staplerCooldown: 1.45,
      staplerPellets: 4,
      stickyTimer: 0,
      stickyCooldown: 2.2,
      stickyRadius: 54,
      stickyLife: 4.2,
      markerTimer: 0,
      markerShotCount: 0,
      markerCooldown: 2.8,
      markerWidth: 10,
      calculatorTimer: 0,
      calculatorCooldown: 1.75,
      chainJumps: 2,
      chainRange: 180,
      auraRadius: 78,
      auraDamage: 8,
      auraPulse: 0,
      auraPulseTimer: 0,
      orbitCount: 1,
      orbitRadius: 86,
      orbitSpeed: 2.4,
      shredderTimer: 0,
      shredderConeAngle: 40,
      shredderRange: 90,
      shredderDps: 0,
      shredderKills: 0,
      thermosTea: 0,
      thermosTeaMax: 100,
      thermosChargeBonus: 0,
      thermosRadius: 70,
      thermosPuddleTimer: 0,
      thermosTextTimer: 0,
      thermosBurstHeal: 15,
    },
    weapons: structuredClone(weaponDefinitions),
  };
}
function startGame() {
  const hasCleared = localStorage.getItem("cb_cleared") === "1";
  if (hasCleared && !pendingPolicy && !policySelectionOpen) {
    showPolicySelection();
    return;
  }
  startGameActual();
}
function startGameActual() {
  enemyId = 1;
  swarmId = 1;
  buildHudSignature = "";
  statHudSignature = "";
  itemHudSignature = "";
  game = createGame();
  applyPermanentUpgrades(game);
  applyPolicyToGame(game, pendingPolicy);
  pendingPolicy = null;
  policySelectionOpen = false;
  // Reset per-run subsidy/synergy/affix state
  game.subsidyUsed = false;
  game.darkAffixes = {};
  game.hiddenSynergyTriggers = new Set();
  game.paperStormActive = false;
  game.rubberStampedeActive = false;
  game.fengShuiHeal = false;
  game.energyDrinkFixed = false;
  game.tempArmor = 0;
  game.tempRegen = 0;
  game.sudsidyPenalty = 0;
  game.sudsidyHpPenalty = 0;
  game.sudsidySlotPenalty = false;
  game.sudsidyCdBoost = false;
  game.weaponCostDouble = false;
  game.weaponUpgradeCostPenalty = 0;
  game.xpPenalty = 0;
  game.upgradeChoiceBonus = 0;
  game.upgradeSlotPenalty = false;
  game.systemUpdateTimer = 0;
  game.shopRefreshBonus = 0;
  // Hidden reversal flags
  game._overtimeCovered = false;
  game._ndaSigned = false;
  game._updateComplete = false;
  game._deskCleaned = false;
  game._updatePowerTimer = 0;
  game._updatePowerActive = false;
  game.currentIncident = rollOfficeIncident(game.stage);
  applyOfficeIncident();
  state = "playing";
  ui.startPanel.classList.add("hidden");
  ui.resultPanel.classList.add("hidden");
  ui.perkPanel?.classList.add("hidden");
  ui.itemReplacePanel?.classList.add("hidden");
  ui.upgradePanel.classList.add("hidden");
  ui.eventPanel?.classList.add("hidden");
  if (ui.routeScanlines) ui.routeScanlines.classList.remove("active");
  if (ui.lowHpVignette) ui.lowHpVignette.classList.remove("active");
  if (ui.deathRecap) ui.deathRecap.classList.add("hidden");
  ui.weaponPanel.classList.add("hidden");
  ui.pausePanel.classList.add("hidden");
  ui.policyPanel?.classList.add("hidden");
  ui.startButton?.classList.remove("hidden");
  ui.endlessButton?.classList.add("hidden");
  showStageBanner();
  lastTime = performance.now();
  requestAnimationFrame(loop);
}
function updateStartActions() {
  const hasCleared = localStorage.getItem("cb_cleared") === "1";
  ui.startEndlessButton?.classList.toggle("hidden", !hasCleared);
}
function showPolicySelection() {
  policySelectionOpen = true;
  ui.resultPanel?.classList.add("hidden");
  ui.startPanel?.classList.remove("hidden");
  ui.policyPanel?.classList.remove("hidden");
  ui.startButton?.classList.add("hidden");
  renderPolicyChoices(shuffle([...policyCards]).slice(0, 3));
}
function renderPolicyChoices(cards) {
  if (!ui.policyChoices) return;
  ui.policyChoices.replaceChildren();
  for (const card of cards) {
    const button = document.createElement("button");
    button.className = "policy-card";
    button.type = "button";
    button.innerHTML = `
      <span class="policy-icon">${card.icon}</span>
      <strong>${card.name}</strong>
      <p>${card.desc}</p>
      <span class="policy-buff">${card.buff}</span>
      <span class="policy-risk">${card.risk}</span>
    `;
    button.addEventListener("click", () => {
      pendingPolicy = card;
      startGameActual();
    });
    ui.policyChoices.append(button);
  }
}
function skipPolicyAndStart() {
  pendingPolicy = null;
  startGameActual();
}
function applyPolicyToGame(g, policy) {
  if (!policy) return;
  g.activePolicy = policy;
  if (policy.id === "agile") {
    g.policyCooldownMult = 0.88;
    g.policyEnemySpeedMult = 1.15;
  } else if (policy.id === "costcut") {
    g.policyMaterialMult = 1.5;
    g.policyRefreshAdd = 2;
  } else if (policy.id === "flat") {
    g.policyClassThresholdOffset = -1;
    g.policyClassBonusMult = 0.8;
  } else if (policy.id === "remote") {
    g.player.pickupRange = Math.round(g.player.pickupRange * 1.5);
    g.policyMagnetMult = 2;
    g.policyRemoteDamagePenalty = true;
  } else if (policy.id === "overtime") {
    g.policyXpMult = 1.35;
    g.policyMaterialMult = 1.2;
  } else if (policy.id === "involution") {
    g.policyEliteDropMult = 3;
  }
  applyPolicyStageModifiers(g);
}
function applyPolicyStageModifiers(g) {
  if (!g?.activePolicy || !g.stageConfig) return;
  if (g.activePolicy.id === "overtime") {
    g.stageConfig.duration += 12;
    g.stageConfig.eliteTotal = Math.ceil(g.stageConfig.eliteTotal * 1.25);
  } else if (g.activePolicy.id === "involution") {
    g.stageConfig.eliteTotal = Math.max(1, g.stageConfig.eliteTotal * 2);
  }
  g.elitesToSpawn = g.stageConfig.eliteTotal;
}
function updateEndlessMode(dt) {
  game.overtimeTimer += dt;
  game.overtimeBreakTimer -= dt;
  const nextLevel = Math.floor(game.overtimeTimer / 60);
  if (nextLevel !== game.overtimeLevel) {
    game.overtimeLevel = nextLevel;
    game.stageConfig = getEndlessStageConfig(game.overtimeLevel);
    applyPolicyStageModifiers(game);
    floatingText(game.player.x, game.player.y - 58, `加班强度 +${game.overtimeLevel}`, "#ffd15c");
    showStageBanner();
  }
  if (game.overtimeBreakTimer <= 0 && state === "playing") {
    openEndlessBreak();
  }
}
function openEndlessBreak() {
  collectLooseMaterials();
  game.enemies = [];
  game.projectiles = [];
  game.damageZones = [];
  game.delayedBlasts = [];
  game.player.hp = Math.min(game.player.maxHp, game.player.hp + 10);
  game.lastClearReason = "break";
  game.lastStageBonus = 0;
  game.shopOffers = generateShopOffers(4, game.lockedShopOffers);
  game.lockedShopOffers = [];
  state = "armory";
  ui.armoryReason.textContent = `工间休息 · 已加班 ${formatTime(game.overtimeTimer)} · 下轮强度 ${game.overtimeLevel + 1}`;
  ui.weaponPanel.classList.remove("hidden");
  renderShop();
}
function resumeEndlessAfterBreak() {
  game.lockedShopOffers = game.shopOffers
    .filter((offer) => offer.locked && !offer.purchased)
    .map((offer) => ({ ...offer, locked: true, purchased: false }));
  game.shopOffers = [];
  game.waveTime = 0;
  game.stageKills = 0;
  game.stageSpawned = 0;
  game.enemiesToSpawn = Infinity;
  game.elitesToSpawn = Infinity;
  game.spawnTimer = 0;
  game.overtimeBreakTimer = 120;
  game.player.x = WORLD.w / 2;
  game.player.y = WORLD.h / 2;
  ui.weaponPanel.classList.add("hidden");
  state = "playing";
  lastTime = performance.now();
  requestAnimationFrame(loop);
}
function dropEnemyLoot(enemy) {
  game.pickups.push({ kind: "xp", x: enemy.x, y: enemy.y, r: 6, value: enemy.xp });
  const effectiveLuck = game.player.luck + getClassBonus("luck");
  let materialChance = enemy.elite ? 1 : Math.min(0.68, 0.4 + effectiveLuck * 0.00115);
  if (game.weapons.shredder.level >= 3 && enemy.lastHitSource === "shredder") {
    materialChance = Math.min(1, materialChance * 1.5);
  }
  if (Math.random() < materialChance) {
    const eliteMult = enemy.elite ? game.policyEliteDropMult : 1;
    const baseValue = Math.max(1, Math.round(enemy.materialValue * game.stageConfig.materialMult * getMaterialMult() * game.policyMaterialMult * eliteMult));
    // Hidden reversal: desk cleaned → elite drops extra
    let bonusValue = 0;
    if (enemy.elite && game._deskCleaned) {
      bonusValue = baseValue;
      floatingText(enemy.x, enemy.y - 20, "发奖金了？+" + bonusValue, "#ffd15c");
      game._deskCleaned = false;
    }
    game.pickups.push({
      kind: "material",
      x: enemy.x + (Math.random() - 0.5) * 24,
      y: enemy.y + (Math.random() - 0.5) * 24,
      r: 7,
      value: baseValue,
    });
    if (bonusValue > 0) {
      game.pickups.push({
        kind: "material",
        x: enemy.x + (Math.random() - 0.5) * 24 + 14,
        y: enemy.y + (Math.random() - 0.5) * 24 + 8,
        r: 7,
        value: bonusValue,
      });
    }
  }

  maybeDropPassiveItem(enemy, effectiveLuck);

  const luck = Math.max(0, effectiveLuck);
  const bonusChance = (enemy.elite ? 0.34 : 0.035) + luck * 0.0022;
  if (Math.random() > Math.min(0.72, bonusChance)) return;

  const spreadX = (Math.random() - 0.5) * 34;
  const spreadY = (Math.random() - 0.5) * 34;
  if (Math.random() < 0.42) {
    game.pickups.push({
      kind: "heal",
      x: enemy.x + spreadX,
      y: enemy.y + spreadY,
      r: 8,
      value: 12 + Math.floor(luck / 12),
    });
  } else {
    const stat = pickWeightedStatDrop();
    game.pickups.push({
      kind: "stat",
      stat,
      x: enemy.x + spreadX,
      y: enemy.y + spreadY,
      r: 8,
      value: stat.amount,
    });
  }
}
function maybeDropPassiveItem(enemy, effectiveLuck) {
  const isBoss = enemy.type === "boss";
  if (!enemy.elite && !isBoss) return;
  if (!isBoss && game.itemDropCooldown > 0) return;
  const latePenalty = game.stage >= 8 ? 0.08 : 0;
  const dropChance = isBoss ? 1 : Math.min(0.36, 0.18 + Math.max(0, effectiveLuck) * 0.0008 + game.stage * 0.006 - latePenalty);
  if (Math.random() > dropChance) return;
  const item = pickDropItem(isBoss || game.stage >= 10 ? "rare" : "common");
  if (!item) return;
  if (!isBoss) game.itemDropCooldown = game.stage >= 8 ? 30 : 22;
  game.pickups.push({
    kind: "item",
    item,
    x: enemy.x + (Math.random() - 0.5) * 42,
    y: enemy.y + (Math.random() - 0.5) * 42,
    r: 11,
    value: 1,
  });
}
function pickDropItem(minRarity = "common") {
  const available = itemPool.filter((item) => !game.boughtItems.has(item.id));
  if (!available.length) return null;
  const minWeight = itemRarityMeta[minRarity]?.weight || 1;
  const filtered = available.filter((item) => getRarityWeight(item) >= minWeight);
  const poolSource = filtered.length ? filtered : available;
  const weighted = [];
  for (const item of poolSource) {
    weighted.push(item);
    if (getItemRarity(item) === "common") weighted.push(item);
    if (getItemRarity(item) === "rare") weighted.push(item);
    if (isItemAlignedWithBuild(item)) weighted.push(item);
    if (game.stage >= 7 && /爆发|输出|防御|站场/.test(item.tag || "") && getRarityWeight(item) >= 2) weighted.push(item);
  }
  shuffle(weighted);
  return weighted[0];
}
function pickWeightedStatDrop() {
  const candidates = statDropPool.filter((stat) => {
    if (stat.key === "dodge") return game.player.dodge < 60;
    if (stat.key === "luck") return game.player.luck < 240;
    if (stat.key === "fortify") return game.player.fortify < 42;
    return true;
  });
  return candidates[Math.floor(Math.random() * candidates.length)];
}
function spawnEnemies(dt) {
  if (game.enemiesToSpawn <= 0) return;
  const config = game.stageConfig;
  if (game.enemies.length >= config.maxConcurrent) return;
  if (!game.endless && game.stage === 1 && game.waveTime < STAGE_ONE_WARMUP_SECONDS) {
    game.spawnTimer = Math.max(game.spawnTimer, 0.35);
    return;
  }

  game.spawnTimer -= dt;
  if (game.spawnTimer <= 0) {
    const capacity = Math.max(0, config.maxConcurrent - game.enemies.length);
    const count = Math.min(config.batchSize, capacity, game.enemiesToSpawn);
    for (let i = 0; i < count; i += 1) {
      const shouldElite = game.endless
        ? game.stageSpawned > 10 && Math.random() < Math.min(0.24, 0.07 + game.overtimeLevel * 0.012)
        : game.elitesToSpawn > 0 &&
          game.stageSpawned > config.totalEnemies * 0.35 &&
          (Math.random() < 0.18 || game.enemiesToSpawn <= game.elitesToSpawn + 2);
      const spawned = spawnEnemy(shouldElite) || 1;
      if (shouldElite && Number.isFinite(game.elitesToSpawn)) game.elitesToSpawn -= 1;
      if (Number.isFinite(game.enemiesToSpawn)) game.enemiesToSpawn -= Math.min(spawned, game.enemiesToSpawn);
      game.stageSpawned += spawned;
    }
    const urgency = 1 - game.waveTime / config.duration;
    game.spawnTimer = Math.max(0.16, (config.spawnInterval / config.survivalPressure) * (0.78 + urgency * 0.34));
  }
}
function spawnEnemy(elite) {
  const side = Math.floor(Math.random() * 4);
  const margin = 80;
  let x = game.player.x;
  let y = game.player.y;
  if (side === 0) {
    x = game.camera.x - margin;
    y = game.camera.y + Math.random() * canvas.height;
  } else if (side === 1) {
    x = game.camera.x + canvas.width + margin;
    y = game.camera.y + Math.random() * canvas.height;
  } else if (side === 2) {
    x = game.camera.x + Math.random() * canvas.width;
    y = game.camera.y - margin;
  } else {
    x = game.camera.x + Math.random() * canvas.width;
    y = game.camera.y + canvas.height + margin;
  }

  x = clamp(x, 20, WORLD.w - 20);
  y = clamp(y, 20, WORLD.h - 20);
  const config = game.stageConfig;
  const stagePower = game.endless ? 14 + game.overtimeLevel : game.stage - 1;
  let type = pickEnemyType(config.enemyMix);
  if (!elite && type === "meeting" && !game.endless && game.stage >= 6 && Math.random() < 0.25) type = "emergency";
  if (!elite && type === "meeting" && game.endless && Math.random() < 0.32) type = "emergency";
  if (!elite && type === "bug" && (game.stage >= 3 || game.endless) && Math.random() < 0.22) {
    return spawnBugSwarm(x, y, stagePower, config);
  }
  if (elite && game.stage >= game.maxStage && !game.bossSpawned) {
    type = "boss";
    game.bossSpawned = true;
    showBossArrival();
    pulse(x, y, 240, "#ff2a60");
    for (let i = 0; i < 28; i += 1) spark(x + (Math.random() - 0.5) * 80, y + (Math.random() - 0.5) * 70, i % 2 ? "#ffd15c" : "#ff5a7a");
  }
  let enemy = createEnemyByType(type, stagePower, config);
  enemy = {
    ...enemy,
    id: enemyId++,
    x,
    y,
    type,
    phase: Math.random() * TAU,
    chargeTimer: 1.2 + Math.random() * 2.2,
    charging: 0,
    slow: 1,
    specialTimer: 1.2 + Math.random() * 2.4,
    weakTextTimer: 0,
    shield: type === "audit" ? 0.3 : 0,
    elite,
  };

  if (elite) {
    const boss = enemy.type === "boss";
    // Hidden reversal: overtime covered → boss HP reduced
    if (boss && game._overtimeCovered) {
      enemy.hp *= 0.6;
      floatingText(enemy.x, enemy.y - 30, "同事帮你搞定了！", "#52ffe1");
      game._overtimeCovered = false;
    }
    enemy.r += boss ? 24 : 12;
    enemy.hp *= boss ? 2.35 : 3.45;
    enemy.speed *= boss ? 0.66 : 0.82;
    enemy.damage += boss ? 16 : 8;
    enemy.xp *= 5;
    enemy.materialValue *= 5;
    enemy.color = boss ? "#ff2a60" : "#ff6b6b";
  }

  game.enemies.push(enemy);
  return 1;
}
function spawnBugSwarm(x, y, stagePower, config) {
  const group = swarmId++;
  const baseAngle = Math.random() * TAU;
  for (let i = 0; i < 3; i += 1) {
    const angle = baseAngle + (i / 3) * TAU;
    const bug = createEnemyByType("bug", stagePower, config);
    game.enemies.push({
      ...bug,
      id: enemyId++,
      x: clamp(x + Math.cos(angle) * 40, 20, WORLD.w - 20),
      y: clamp(y + Math.sin(angle) * 40, 20, WORLD.h - 20),
      type: "bug",
      phase: Math.random() * TAU,
      chargeTimer: 0,
      charging: 0,
      slow: 1,
      specialTimer: 0,
      weakTextTimer: 0,
      shield: 0,
      elite: false,
      color: "#ff9e9e",
      hp: bug.hp * 0.72,
      speed: bug.speed * 1.08,
      damage: bug.damage * 0.78,
      xp: Math.max(2, Math.round(bug.xp * 0.78)),
      materialValue: bug.materialValue,
      swarmGroup: group,
      swarmIndex: i,
      swarmAngle: baseAngle,
    });
  }
  return 3;
}
function pickEnemyType(mix) {
  const total = Object.values(mix).reduce((sum, weight) => sum + weight, 0) || 1;
  const roll = Math.random() * total;
  let cursor = 0;
  for (const [type, weight] of Object.entries(mix)) {
    cursor += weight;
    if (roll <= cursor) return type;
  }
  return "bug";
}
function createEnemyByType(type, stagePower, config) {
  const base = {
    bug: {
      r: 14,
      hp: 18 + stagePower * 5,
      speed: 72 + stagePower * 2,
      damage: 8,
      xp: 4,
      materialValue: 1,
      color: "#f36f6f",
    },
    change: {
      r: 13,
      hp: 15 + stagePower * 4,
      speed: 118 + stagePower * 3,
      damage: 7,
      xp: 5,
      materialValue: 1,
      color: "#d99cff",
    },
    meeting: {
      r: 22,
      hp: 48 + stagePower * 10,
      speed: 46 + stagePower * 2,
      damage: 10,
      xp: 9,
      materialValue: 2,
      color: "#6ea8ff",
    },
    emergency: {
      r: 20,
      hp: 55 + stagePower * 11,
      speed: 62 + stagePower * 2.5,
      damage: 12,
      xp: 11,
      materialValue: 3,
      color: "#ff5a7a",
    },
    deadline: {
      r: 16,
      hp: 30 + stagePower * 8,
      speed: 72 + stagePower * 2,
      damage: 15,
      xp: 8,
      materialValue: 2,
      color: "#ffb45c",
    },
    intern: {
      r: 15,
      hp: 24 + stagePower * 6,
      speed: 102 + stagePower * 3,
      damage: 6,
      xp: 6,
      materialValue: 2,
      color: "#62dfb4",
    },
    alarm: {
      r: 18,
      hp: 34 + stagePower * 8,
      speed: 86 + stagePower * 2.4,
      damage: 9,
      xp: 8,
      materialValue: 2,
      color: "#ff5a7a",
    },
    audit: {
      r: 20,
      hp: 58 + stagePower * 12,
      speed: 52 + stagePower * 1.6,
      damage: 12,
      xp: 10,
      materialValue: 3,
      color: "#a7dcd4",
    },
    manager: {
      r: 21,
      hp: 70 + stagePower * 14,
      speed: 58 + stagePower * 1.8,
      damage: 14,
      xp: 12,
      materialValue: 3,
      color: "#ffd15c",
    },
    boss: {
      r: 42,
      hp: 420 + stagePower * 55,
      speed: 42 + stagePower * 0.8,
      damage: 22,
      xp: 80,
      materialValue: 18,
      color: "#ff4f6f",
    },
  }[type];

  return {
    ...base,
    hp: base.hp * config.healthMult,
    speed: base.speed * config.speedMult * (game.policyEnemySpeedMult || 1),
    damage: base.damage * config.damageMult,
  };
}
function gainXp(amount) {
  game.xp += amount * (game.policyXpMult || 1) * (1 - (game.xpPenalty || 0));
  while (game.xp >= game.xpNext) {
    game.xp -= game.xpNext;
    game.level += 1;
    game.xpNext = Math.floor(game.xpNext * 1.24 + 9);
    if (state === "recovery") {
      game.pendingLevelUps += 1;
    } else {
      openUpgrade("playing");
    }
    break;
  }
}
function completeStage(reason) {
  if (state !== "playing") return;
  beginStageRecovery(reason);
}
function beginStageRecovery(reason) {
  game.lastClearReason = reason;
  game.lastStageBonus =
    reason === "clear"
      ? Math.round((7 + game.stage * 3.4) * game.stageConfig.clearBonusMult)
      : 2 + game.stage;
  game.materials += game.lastStageBonus;
  game.recoveryTime = RECOVERY_SECONDS;
  if (reason === "clear") showInterStageEvent();
  game.pendingStageEnd = reason;
  game.enemies = [];
  game.projectiles = [];
  game.damageZones = [];
  // Apply subsidy cleanup
  if (game.sudsidyPenalty > 0) {
    const extra = Math.round((game.stageConfig.totalEnemies || 0) * game.sudsidyPenalty);
    game.stageConfig.totalEnemies += extra;
    floatingText(game.player.x, game.player.y - 30, `补贴代价：怪物 +${extra}`, "#ff8c42");
    game.sudsidyPenalty = 0;
  }
  if (game.sudsidyHpPenalty > 0) {
    game.player.hp = Math.max(1, game.player.hp - game.player.maxHp * game.sudsidyHpPenalty);
    floatingText(game.player.x, game.player.y - 40, `补贴代价：扣除生命`, "#ff8c42");
    game.sudsidyHpPenalty = 0;
  }
  if (game.sudsidySlotPenalty) {
    game.upgradeSlotPenalty = true;
    game.sudsidySlotPenalty = false;
  }
  if (game.weaponCostDouble) { game.weaponCostDouble = false; }
  // Temp buffs reset
  game.tempArmor = 0;
  game.tempRegen = 0;
  game.sudsidyCdBoost = false;
  // Dark affix per-stage effects (skip if spicy combo fixed energyDrink)
  if (game.darkAffixes && !game.energyDrinkFixed) {
    for (const itemId of Object.keys(game.darkAffixes)) {
      const affix = itemDarkAffixes[itemId];
      if (affix?.apply) affix.apply(game);
    }
  }
  floatingText(game.player.x, game.player.y - 54, `资源回收 ${RECOVERY_SECONDS}s`, "#f4c95d");
  // Weapon chest at checkpoints (stages 4, 8, 12)
  if ((game.stage === 4 || game.stage === 8 || game.stage === 12) && reason === "clear") {
    const chestItem = pickDropItem(game.stage >= 12 ? "legendary" : "epic");
    if (chestItem) {
      game.pickups.push({
        kind: "item",
        item: chestItem,
        x: game.player.x + (Math.random() - 0.5) * 60,
        y: game.player.y + (Math.random() - 0.5) * 60,
        r: 13,
        value: 1,
        isChest: true,
      });
      floatingText(game.player.x, game.player.y - 70, "武器宝箱！", "#ffd15c");
    }
  }
  state = "recovery";
  lastTime = performance.now();
}
function updateStageRecovery(dt) {
  game.time += dt;
  // Don't progress timer while event panel is open
  if (!ui.eventPanel?.classList.contains("hidden")) {
    updatePlayer(dt);
    return;
  }
  game.recoveryTime -= dt;
  updatePlayer(dt);
  updatePickups(dt);
  updateParticles(dt);
  updateFloatingTexts(dt);
  if (game.recoveryTime <= 0) finishStageRecovery();
}
function finishStageRecovery() {
  if (state !== "recovery") return;
  collectLooseMaterials();
  game.pickups = [];
  game.player.hp = Math.min(game.player.maxHp, game.player.hp + 10 + game.stage * 2);

  if (game.stage >= game.maxStage) {
    endGame(true);
    return;
  }

  if (game.pendingLevelUps > 0) {
    game.pendingLevelUps -= 1;
    openUpgrade("armory");
    return;
  }

  openWeaponArmory();
}
function collectLooseMaterials() {
  let recovered = 0;
  for (const pickup of game.pickups) {
    if (pickup.kind === "material") recovered += pickup.value;
  }
  if (recovered > 0) {
    game.materials += recovered;
    floatingText(game.player.x, game.player.y - 44, `回收材料+${recovered}`, "#f4c95d");
  }
}
function startNextStage() {
  if (game.endless) {
    resumeEndlessAfterBreak();
    return;
  }
  game.stage += 1;
  game.stageConfig = getStageConfig(game.stage);
  applyPolicyStageModifiers(game);
  game.currentIncident = rollOfficeIncident(game.stage);
  applyOfficeIncident();
  game.waveTime = 0;
  game.stageKills = 0;
  game.stageSpawned = 0;
  game.enemiesToSpawn = game.stageConfig.totalEnemies;
  game.elitesToSpawn = game.stageConfig.eliteTotal;
  game.bossSpawned = false;
  game.lastClearReason = "";
  game.lastStageBonus = 0;
  game.pendingLevelUps = 0;
  game.upgradeReturnState = "playing";
  game.lockedShopOffers = game.shopOffers
    .filter((offer) => offer.locked && !offer.purchased)
    .map((offer) => ({ ...offer, locked: true, purchased: false }));
  game.shopOffers = [];
  game.spawnTimer = 0;
  game.eliteTimer = Math.max(12, 24 - game.stage * 2);
  game.player.x = WORLD.w / 2;
  game.player.y = WORLD.h / 2;
  ui.weaponPanel.classList.add("hidden");
  showStageBanner();
  state = "playing";
  lastTime = performance.now();
  requestAnimationFrame(loop);
}
function calculateEmployeePoints(won, wasEndless, survived) {
  const stageScore = wasEndless ? Math.floor(survived / 14) : game.stage * 8;
  const clearBonus = won ? 70 : 0;
  const killScore = Math.floor(game.kills * 0.18);
  const growthScore = game.level * 2 + game.upgradesTaken * 3;
  return Math.max(8, Math.round(stageScore + clearBonus + killScore + growthScore));
}
function endGame(won) {
  const wasEndless = Boolean(game?.endless);
  const survived = wasEndless ? Math.floor(game.overtimeTimer) : 0;
  if (won) localStorage.setItem("cb_cleared", "1");
  if (wasEndless) recordEndlessBest(survived);
  const earnedPoints = calculateEmployeePoints(won, wasEndless, survived);
  const totalPoints = addEmployeePoints(earnedPoints);
  game.employeePointsEarned = earnedPoints;
  state = "result";
  ui.stageBanner?.classList.add("hidden");
  ui.resultEyebrow.textContent = wasEndless ? "加班结算" : won ? "通关" : "本轮结束";
  ui.resultTitle.textContent = wasEndless ? "这班终于下了" : won ? "你完成了全部关卡" : "血量归零";
  const runLine = wasEndless
    ? `持续加班 ${formatTime(survived)} · 等级 ${game.level} · 属性 ${game.upgradesTaken} · 材料 ${game.materials} · 击破 ${game.kills}`
    : `第 ${game.stage} 关 · 等级 ${game.level} · 属性 ${game.upgradesTaken} · 材料 ${game.materials} · 击破 ${game.kills}`;
  ui.resultStats.innerHTML = `
    <span>${runLine}</span>
    <div class="result-breakdown" aria-label="本局复盘">
      <span>主要伤害来源<b>${getTopDamageSource()}</b></span>
      <span>承受伤害<b>${Math.round(game.damageTaken)} / ${game.hitsTaken} 次</b></span>
      <span>最强武器<b>${getRunTopWeaponLabel()}</b></span>
    </div>
    <div class="result-award">+${earnedPoints} 工分 · 当前累计 ${totalPoints}</div>
  `;
  if (!won) renderDeathRecap(); else if (ui.deathRecap) ui.deathRecap.classList.add("hidden");
  ui.endlessButton?.classList.toggle("hidden", !won || wasEndless);
  ui.resultPanel.classList.remove("hidden");
  updateStartActions();
  renderBestOvertime();
}
function startEndlessMode() {
  if (!game || state === "menu") {
    startDirectEndlessMode();
    return;
  }
  game.endless = true;
  game.stage = MAX_STAGE + 1;
  game.maxStage = Infinity;
  game.stageConfig = getEndlessStageConfig(0);
  applyPolicyStageModifiers(game);
  game.currentIncident = {
    id: "endless",
    title: "继续加班",
    text: "压力源无限刷新，每 120 秒会出现一次工间工坊。",
    apply: () => {},
  };
  game.overtimeTimer = 0;
  game.overtimeLevel = 0;
  game.overtimeBreakTimer = 120;
  game.waveTime = 0;
  game.stageKills = 0;
  game.stageSpawned = 0;
  game.enemiesToSpawn = Infinity;
  game.elitesToSpawn = Infinity;
  game.bossSpawned = true;
  game.enemies = [];
  game.projectiles = [];
  game.damageZones = [];
  game.delayedBlasts = [];
  game.spawnTimer = 0;
  game.player.hp = Math.min(game.player.maxHp, Math.max(game.player.hp, Math.round(game.player.maxHp * 0.72)));
  ui.resultPanel.classList.add("hidden");
  ui.weaponPanel.classList.add("hidden");
  ui.endlessButton?.classList.add("hidden");
  showStageBanner();
  state = "playing";
  lastTime = performance.now();
  requestAnimationFrame(loop);
}
function startDirectEndlessMode() {
  if (localStorage.getItem("cb_cleared") !== "1") return;
  enemyId = 1;
  swarmId = 1;
  buildHudSignature = "";
  statHudSignature = "";
  itemHudSignature = "";
  game = createGame();
  applyPermanentUpgrades(game);
  pendingPolicy = null;
  policySelectionOpen = false;
  game.endless = true;
  game.stage = MAX_STAGE + 1;
  game.maxStage = Infinity;
  game.stageConfig = getEndlessStageConfig(0);
  game.currentIncident = {
    id: "endless",
    title: "直接加班",
    text: "从清空工位开始进入无尽压力测试。",
    apply: () => {},
  };
  game.overtimeTimer = 0;
  game.overtimeLevel = 0;
  game.overtimeBreakTimer = 120;
  game.waveTime = 0;
  game.stageKills = 0;
  game.stageSpawned = 0;
  game.enemiesToSpawn = Infinity;
  game.elitesToSpawn = Infinity;
  game.bossSpawned = true;
  state = "playing";
  ui.startPanel?.classList.add("hidden");
  ui.resultPanel?.classList.add("hidden");
  ui.perkPanel?.classList.add("hidden");
  ui.weaponPanel?.classList.add("hidden");
  ui.upgradePanel?.classList.add("hidden");
  ui.endlessButton?.classList.add("hidden");
  showStageBanner();
  lastTime = performance.now();
  requestAnimationFrame(loop);
}
function recordEndlessBest(seconds) {
  const best = Number.parseInt(localStorage.getItem("cb_endless_best") || "0", 10);
  if (seconds > best) localStorage.setItem("cb_endless_best", String(seconds));
}