// ================================================================
// 04_BUILD ARCHITECTURE 流派架构
// 流派定位·武器定义·路线系统·协同机制·Build关系
// File: 04_architecture.js | Load order: 4/7
// ================================================================

const weaponDefinitions = {
  coffee: {
    label: "咖啡",
    archetype: "直射爆发",
    classes: ["precise", "ranged"],
    color: "#f4c95d",
    level: 1,
    max: 7,
    description: "前3关主力，第4关起明显乏力。需尽早补第二把武器。",
  },
  keyboard: {
    label: "键盘",
    archetype: "近战打击",
    classes: ["barrage", "close"],
    color: "#6ea8ff",
    level: 0,
    max: 7,
    description: "抡起键盘横扫前方，高伤低频，带击退和键帽碎裂。",
  },
  headset: {
    label: "耳机",
    archetype: "防守领域",
    classes: ["support", "field"],
    color: "#42d7b8",
    level: 0,
    max: 7,
    description: "扩大安静领域，靠贴身范围持续压制。",
  },
  report: {
    label: "报表",
    archetype: "轨道控制",
    classes: ["field", "engineering"],
    color: "#ff8f70",
    level: 0,
    max: 7,
    description: "生成环绕报表，切割靠近的敌人。",
  },
  stapler: {
    label: "订书机",
    archetype: "扇形散射",
    classes: ["barrage", "ranged"],
    color: "#d7d0c2",
    level: 0,
    max: 7,
    description: "向敌人射出扇形订书钉弹幕，远程清怪主力。",
  },
  sticky: {
    label: "便签",
    archetype: "陷阱控场",
    classes: ["engineering", "support"],
    color: "#fff07a",
    level: 0,
    max: 7,
    description: "留下范围陷阱，适合绕圈风筝。",
  },
  marker: {
    label: "马克笔",
    archetype: "自瞄激光",
    classes: ["precise", "ranged"],
    color: "#b282ff",
    level: 0,
    max: 7,
    description: "自动瞄准低频贯穿激光，穿透递减但单体爆发极高。",
  },
  calculator: {
    label: "计算器",
    archetype: "连锁点杀",
    classes: ["engineering", "support"],
    color: "#9ee37d",
    level: 0,
    max: 7,
    description: "连锁跳电，针对分散敌人。",
  },
  shredder: {
    label: "碎纸机",
    archetype: "定向锥形",
    classes: ["close", "engineering"],
    color: "#a9b8c6",
    level: 0,
    max: 7,
    description: "向最近敌人持续喷射碎纸锥形，范围内敌人被绞碎。",
  },
  thermos: {
    label: "保温杯",
    archetype: "站桩治疗",
    classes: ["support", "field"],
    color: "#78e8c0",
    level: 0,
    max: 7,
    description: "停留泡茶蓄能，释放蒸汽治疗并减速压力源。",
  },
};

const buildOrder = ["coffee", "keyboard", "headset", "report", "stapler", "sticky", "marker", "calculator", "shredder", "thermos"];
const weaponClassLabels = {
  precise: "精准",
  ranged: "远程",
  barrage: "弹幕",
  field: "领域",
  engineering: "工程",
  support: "支援",
  close: "近距",
};
const weaponClassBonuses = {
  precise: [
    { count: 2, crit: 4 },
    { count: 3, crit: 9, damageMult: 0.04 },
    { count: 4, crit: 14, damageMult: 0.08 },
  ],
  ranged: [
    { count: 2, range: 18 },
    { count: 3, range: 40, pierce: 1 },
    { count: 4, range: 64, pierce: 1, attackSpeed: 5 },
  ],
  barrage: [
    { count: 2, attackSpeed: 6 },
    { count: 3, attackSpeed: 14, projectileMult: 1 },
    { count: 4, attackSpeed: 22, projectileMult: 1 },
  ],
  field: [
    { count: 2, fieldRadius: 12 },
    { count: 3, fieldRadius: 24, armor: 1 },
    { count: 4, fieldRadius: 38, armor: 2 },
  ],
  engineering: [
    { count: 2, engineering: 0.08 },
    { count: 3, engineering: 0.18, chain: 1 },
    { count: 4, engineering: 0.3, chain: 1 },
  ],
  support: [
    { count: 2, pickupRange: 16 },
    { count: 3, pickupRange: 34, luck: 6 },
    { count: 4, pickupRange: 52, luck: 16 },
  ],
  close: [
    { count: 1, armor: 1 },
    { count: 2, armor: 2, damageMult: 0.03 },
    { count: 3, armor: 3, damageMult: 0.05, attackSpeed: 5 },
  ],
};

const routeDefinitions = [
  {
    id: "precision",
    name: "精准贯穿",
    fantasy: "激光审稿流",
    color: "#b282ff",
    accent: "#52ffe1",
    weapons: ["coffee", "marker"],
    stats: ["crit", "range"],
    itemPattern: /暴击|射程|输出|爆发/,
    stages: ["未启动", "起手", "双武器", "聚焦", "终局"],
    unlockText: "咖啡 + 马克笔，暴击/射程把直线清屏推到极致。",
    evolveText: "终局：射线分叉并追加审稿光束。",
  },
  {
    id: "barrage",
    name: "键盘风暴",
    fantasy: "弹幕加班流",
    color: "#52ffe1",
    accent: "#c35cff",
    weapons: ["keyboard", "stapler"],
    stats: ["attackSpeed", "dodge"],
    itemPattern: /攻速|闪避|爆发/,
    stages: ["未启动", "起手", "双武器", "高速", "终局"],
    unlockText: "键盘 + 订书机，攻速/闪避把屏幕打成办公弹幕。",
    evolveText: "终局：弹幕追加侧翼散射和近距爆发。",
  },
  {
    id: "conductor",
    name: "工位雷网",
    fantasy: "陷阱连锁流",
    color: "#9ee37d",
    accent: "#ffd15c",
    weapons: ["sticky", "calculator"],
    stats: ["luck", "pickupRange"],
    itemPattern: /经济|拾取|恢复|控制|陷阱|布线/,
    stages: ["未启动", "起手", "双武器", "布网", "终局"],
    unlockText: "便签 + 计算器，幸运/拾取把资源和电流一起滚起来。",
    evolveText: "终局：陷阱会频繁触发连锁电流。",
  },
  {
    id: "perimeter",
    name: "会议结界",
    fantasy: "领域防守流",
    color: "#ffd15c",
    accent: "#6ea8ff",
    weapons: ["headset", "report"],
    stats: ["armor", "regen", "fortify"],
    itemPattern: /防御|生存|控制|站场|站桩|领域|恢复/,
    stages: ["未启动", "起手", "双武器", "站场", "终局"],
    unlockText: "耳机 + 报表，护甲/恢复把身边变成安全区。",
    evolveText: "终局：结界脉冲击退，报表轨道加层。",
  },
];

const stageBriefs = [
  "清理 Bug，建立第一套武器方向",
  "需求变更开始绕行，优先补机动或范围",
  "会议怪会减速，保持空间并留意领域压制",
  "Deadline 会冲刺，近距和闪避价值上升",
  "复盘压力混合来袭，开始检验输出和生存是否跟得上",
  "季度审判出现更多精英，准备爆发窗口",
  "紧急上线偏高速冲刺，远程/陷阱需要补控制",
  "跨组拉齐会被会议怪围住，领域或清场能力很关键",
  "财年封版材料紧张，别让商店刷新吞掉关键资源",
  "审计追问会拉长战线，陷阱和站场收益上升",
  "组织调整带来混合压力，注意替换低等级武器",
  "灰度事故偏高速冲击，保留一个能清近身的手段",
  "年度述职会检验续航，别只堆一波爆发",
  "终局评审 Boss 压力，必须靠完整体系撑住",
];
const statLabels = [
  { key: "maxHp", label: "生命" },
  { key: "armor", label: "护甲" },
  { key: "dodge", label: "闪避" },
  { key: "speed", label: "速度" },
  { key: "attackSpeed", label: "攻速" },
  { key: "damageMult", label: "伤害" },
  { key: "crit", label: "暴击" },
  { key: "range", label: "射程" },
  { key: "luck", label: "幸运" },
  { key: "pickupRange", label: "拾取" },
  { key: "regen", label: "恢复" },
  { key: "fortify", label: "站场" },
];

const statDropPool = [
  { key: "maxHp", label: "生命", amount: 3, apply: (g) => { g.player.maxHp += 3; g.player.hp += 3; } },
  { key: "armor", label: "护甲", amount: 1, apply: (g) => { g.player.armor += 1; } },
  { key: "dodge", label: "闪避", amount: 2, apply: (g) => { g.player.dodge = Math.min(60, g.player.dodge + 2); } },
  { key: "speed", label: "速度", amount: 5, apply: (g) => { g.player.speed += 5; } },
  { key: "attackSpeed", label: "攻速", amount: 3, apply: (g) => { addPlayerAttackSpeed(g, 3); } },
  { key: "damageMult", label: "伤害", amount: 3, apply: (g) => { addPlayerDamage(g, 0.03); } },
  { key: "crit", label: "暴击", amount: 2, apply: (g) => { g.player.crit = Math.min(75, g.player.crit + 2); } },
  { key: "range", label: "射程", amount: 8, apply: (g) => { g.player.range += 8; } },
  { key: "luck", label: "幸运", amount: 3, apply: (g) => { g.player.luck += 3; } },
  { key: "pickupRange", label: "拾取", amount: 8, apply: (g) => { g.player.pickupRange += 8; } },
  { key: "regen", label: "恢复", amount: 1, apply: (g) => { g.player.regen += 1; } },
  { key: "fortify", label: "站场", amount: 1, apply: (g) => { g.player.fortify += 1; } },
];

const policyCards = [
  {
    id: "agile",
    name: "敏捷开发",
    icon: "迭",
    desc: "迭代速度变快，但压力源也更快追上来。",
    buff: "全局冷却 -12%",
    risk: "敌人移速 +15%",
  },
  {
    id: "costcut",
    name: "降本增效",
    icon: "材",
    desc: "材料回收变多，但工坊供应链开始涨价。",
    buff: "材料收益 x1.5",
    risk: "刷新费用 +2",
  },
  {
    id: "flat",
    name: "扁平管理",
    icon: "扁",
    desc: "职业更早共鸣，但每层共鸣不再那么夸张。",
    buff: "共鸣门槛 -1",
    risk: "共鸣效果 -20%",
  },
  {
    id: "remote",
    name: "远程办公",
    icon: "远",
    desc: "资源更容易吸过来，但远距离火力打折。",
    buff: "拾取范围 +50%",
    risk: "200px 外伤害 -20%",
  },
  {
    id: "overtime",
    name: "996 福报",
    icon: "班",
    desc: "成长资源更肥，单关也更拖更挤。",
    buff: "经验 +35%，材料 +20%",
    risk: "关卡 +12s，精英 +25%",
  },
  {
    id: "involution",
    name: "内卷文化",
    icon: "卷",
    desc: "精英掉落更香，精英数量也直接翻倍。",
    buff: "精英掉落 x3",
    risk: "精英数量 x2",
  },
];

function isUpgradeAlignedWithBuild(upgrade) {
  const counts = getWeaponClassCounts();
  const tag = upgrade.tag || "";
  if ((counts.precise || counts.ranged) && /暴击|射程|输出|爆发|武器专属/.test(tag)) return true;
  if ((counts.barrage || counts.close) && /攻速|闪避|爆发|武器专属/.test(tag)) return true;
  if ((counts.engineering || counts.support) && /幸运|拾取|经济|工程|布线|翻译|支援|武器专属/.test(tag)) return true;
  if ((counts.field || counts.close) && /防御|恢复|站场|领域|生存|近距|武器专属/.test(tag)) return true;
  return false;
}
function maybeShowFusionHint(weaponId) {
  if (!weaponId || !ui.fusionNotice) return;
  const weapon = game.weapons[weaponId];
  if (!weapon || weapon.level < 5 || game.fusionHintsSeen.has(weaponId)) return;
  game.fusionHintsSeen.add(weaponId);
  const classText = (weapon.classes || []).map((className) => weaponClassLabels[className] || className).join(" / ");
  const message = `${weapon.label} 已接近最终形态。${classText} 相关武器、属性和道具会让它更容易发生特殊变化。`;
  game.fusionLog.push(message);
  showFusionNotice("终局改造", `${weapon.label} 已接近最终形态`, message);
}
function isItemAlignedWithBuild(entry) {
  const counts = getWeaponClassCounts();
  const tag = entry.tag || "";
  if ((counts.precise || counts.ranged) && /暴击|射程|输出|爆发/.test(tag)) return true;
  if ((counts.barrage || counts.close) && /攻速|闪避|爆发/.test(tag)) return true;
  if ((counts.engineering || counts.support) && /经济|拾取|恢复|控制|工程|布线|翻译|支援/.test(tag)) return true;
  if ((counts.precise || counts.barrage) && /酒|爆发|暴击|输出/.test(tag)) return true;
  if ((counts.field || counts.close) && /防御|生存|控制|站场|站桩|领域|恢复|近距/.test(tag)) return true;
  return false;
}
function isEntryAlignedWithBuild(entry) {
  const weaponId = getUpgradeWeaponId(entry.id);
  const topClass = getTopWeaponClass();
  if (weaponId && topClass) return (game.weapons[weaponId].classes || []).includes(topClass);
  if (entry.shopType === "item") return isItemAlignedWithBuild(entry);
  return false;
}
function getOwnedWeaponCount() {
  return buildOrder.filter((id) => game.weapons[id].level > 0).length;
}
function syncWeaponDerivedStats() {
  const p = game.player;
  const coffee = game.weapons.coffee.level;
  const keyboard = game.weapons.keyboard.level;
  const headset = game.weapons.headset.level;
  const report = game.weapons.report.level;
  const stapler = game.weapons.stapler.level;
  const sticky = game.weapons.sticky.level;
  const marker = game.weapons.marker.level;
  const calculator = game.weapons.calculator.level;
  const shredder = game.weapons.shredder.level;
  const thermos = game.weapons.thermos.level;

  p.coffeeCooldown = 0.62 * Math.pow(0.92, Math.max(0, coffee - 1));
  p.coffeePierce = 1 + Math.floor(coffee / 3);
  p.keyboardSwing = 1 + Math.max(0, keyboard - 1);
  p.keyboardKnockback = 0 + Math.floor(keyboard / 2);
  p.staplerPellets = 4 + Math.max(0, stapler - 1);
  p.staplerCooldown = 1.45 * Math.pow(0.94, Math.max(0, stapler - 1));
  p.stickyRadius = 54 + Math.max(0, sticky - 1) * 7;
  p.stickyCooldown = 2.2 * Math.pow(0.94, Math.max(0, sticky - 1));
  p.stickyLife = 4.2 + Math.max(0, sticky - 1) * 0.45;
  p.markerWidth = 10 + Math.max(0, marker - 1) * 2;
  p.markerCooldown = 2.8 * Math.pow(0.94, Math.max(0, marker - 1));
  p.calculatorCooldown = 1.75 * Math.pow(0.96, Math.max(0, calculator - 1));
  p.chainJumps = 2 + Math.max(0, calculator - 1);
  p.chainRange = 180 + Math.max(0, calculator - 1) * 20;
  p.auraRadius = 78 + Math.max(0, headset - 1) * 12;
  p.auraDamage = 8 + Math.max(0, headset - 1) * 2;
  p.auraPulse = Math.floor(headset / 2);
  p.orbitCount = 1 + Math.max(0, report - 1);
  p.orbitRadius = 86 + Math.floor(report / 2) * 6;
  p.orbitSpeed = 2.4 + Math.floor(report / 2) * 0.45;
  p.shredderConeAngle = 40 + (shredder >= 2 ? 14 : 0) + (shredder >= 4 ? 14 : 0) + (shredder >= 6 ? 14 : 0);
  p.shredderRange = 90 + (shredder >= 2 ? 22 : 0) + (shredder >= 4 ? 24 : 0) + (shredder >= 6 ? 24 : 0);
  p.shredderDps = 12 + Math.max(0, shredder - 1) * 5 + (shredder >= 4 ? 8 : 0) + (shredder >= 7 ? 10 : 0);
  p.thermosTeaMax = thermos >= 5 ? 200 : 100;
  p.thermosRadius = 70 + (thermos >= 4 ? 40 : 0);
  p.thermosChargeBonus = thermos >= 2 ? 0.18 : 0;
  p.thermosBurstHeal = thermos >= 7 ? 17 : 15;

  // --- weapon size soft-caps (prevents screen-filling AoE) ---
  p.auraRadius = softCapWeaponSize(p.auraRadius, 78);
  p.stickyRadius = softCapWeaponSize(p.stickyRadius, 54);
  p.shredderRange = softCapWeaponSize(p.shredderRange, 90);
  p.chainRange = softCapWeaponSize(p.chainRange, 180);
  p.thermosRadius = softCapWeaponSize(p.thermosRadius, 70);
  p.orbitRadius = softCapWeaponSize(p.orbitRadius, 86);
  p.markerWidth = softCapWeaponSize(p.markerWidth, 10);
}
function applyWeaponUpgradeModifiers() {
  const counts = game.weaponUpgradeCounts || {};
  const p = game.player;
  const n = (id) => counts[id] || 0;
  p.coffeeCooldown *= Math.pow(0.9, n("coffee")) * Math.pow(0.84, n("coffeeThermos"));
  p.coffeePierce += n("coffeePierce");
  p.keyboardSwing += n("keyboard") + n("keyboardMacro") * 2;
  p.keyboardKnockback += n("keyboardBounce");
  p.staplerPellets += n("stapler") + n("staplerMagazine") * 2;
  p.staplerCooldown *= Math.pow(0.88, n("staplerPunch")) * Math.pow(0.9, n("staplerMagazine"));
  p.stickyRadius += n("sticky") * 8 + n("stickyCopyPaste") * 10;
  p.stickyCooldown *= Math.pow(0.9, n("stickyStack")) * Math.pow(0.84, n("stickyCopyPaste"));
  p.stickyLife += n("stickyStack") * 0.8;
  p.markerWidth += n("marker") * 2 + n("markerWide") * 5;
  p.markerCooldown *= Math.pow(0.9, n("markerInk")) * Math.pow(0.86, n("markerWide"));
  p.chainJumps += n("calculator") + n("calculatorLedger");
  p.chainRange += n("calculatorTax") * 28 + n("calculatorLedger") * 42;
  p.auraRadius += n("headset") * 16;
  p.auraDamage += n("headset") * 2;
  p.auraPulse += n("headsetPulse") + n("headsetMetronome");
  p.orbitCount += n("report");
  p.orbitRadius += n("reportSpeed") * 8 + n("reportBinder") * 10;
  p.orbitSpeed += n("reportSpeed") * 0.75 + n("reportBinder") * 0.45;
  p.shredderConeAngle += n("shredder") * 6 + n("shredderMotor") * 8 + n("shredderAuto") * 6;
  p.shredderRange += n("shredder") * 10 + n("shredderMotor") * 14 + n("shredderFeed") * 8 + n("shredderAuto") * 6;
  p.shredderDps += n("shredderFeed") * 5;
  p.thermosChargeBonus += n("thermos") * 0.12 + n("thermosLiner") * 0.22;
  p.thermosTeaMax += n("thermosLiner") * 18 + n("thermosRefill") * 24;
  p.thermosRadius += n("thermosSteam") * 14;
  p.thermosBurstHeal += n("thermosRefill") * 2;
  p.thermosTea = Math.min(p.thermosTea, p.thermosTeaMax);

  // --- weapon size soft-caps (prevents screen-filling AoE) ---
  p.auraRadius = softCapWeaponSize(p.auraRadius, 78);
  p.stickyRadius = softCapWeaponSize(p.stickyRadius, 54);
  p.shredderRange = softCapWeaponSize(p.shredderRange, 90);
  p.chainRange = softCapWeaponSize(p.chainRange, 180);
  p.thermosRadius = softCapWeaponSize(p.thermosRadius, 70);
  p.orbitRadius = softCapWeaponSize(p.orbitRadius, 86);
  p.markerWidth = softCapWeaponSize(p.markerWidth, 10);
}
function hasWeaponEvolution(weaponId) {
  return Boolean(game?.evolvedWeapons?.has(weaponId));
}
function checkWeaponEvolutions() {
  if (!game) return;
  for (const route of routeDefinitions) {
    if (getRouteTier(route.id) < 4) continue;
    for (const weaponId of route.weapons) {
      const weapon = game.weapons[weaponId];
      if (!weapon || weapon.level < weapon.max || game.evolvedWeapons.has(weaponId)) continue;
      game.evolvedWeapons.add(weaponId);
      const message = getEvolutionText(weaponId, route);
      game.fusionLog.push(message);
      showFusionNotice("终极进化", `${weapon.label} 完成最终改造`, message);
      pulse(game.player.x, game.player.y, 150, route.color || "#52ffe1");
    }
  }
}
function getEvolutionText(weaponId, route) {
  const data = {
    coffee: "浓缩风暴咖啡：射线命中留下咖啡渍，短暂延迟后爆开并连带附近目标。",
    marker: "审稿激光笔：马克笔周期性改为宽幅审稿光束，并分裂两条侧向标记线。",
    keyboard: "键盘风暴：主弹幕后追加一圈快捷键碎片，近身包围时更容易清场。",
    stapler: "装订爆破器：订书机近距爆发附带回旋订针，贴脸怪会被二次撕开。",
    headset: "静音会议室：安静领域的脉冲变成大范围沉默爆震，短暂定住压力源。",
    report: "旋转报表塔：报表轨道加速并周期性切割附近目标，站场收益更明显。",
    sticky: "工位雷网：便签陷阱变成双重布置，结束时引爆残留需求。",
    calculator: "财务连锁器：计算器连锁会对首个目标追加复核爆点，适合点杀精英。",
  };
  const routeName = route?.name ? `${route.name}终局` : "终局";
  return `${routeName} · ${data[weaponId] || "该武器获得行为变化。"}`;
}
function showFusionNotice(meta, title, text) {
  if (!ui.fusionNotice) return;
  ui.fusionNoticeMeta.textContent = meta;
  ui.fusionNoticeTitle.textContent = title;
  ui.fusionNoticeText.textContent = text;
  ui.fusionNotice.classList.remove("hidden");
  window.clearTimeout(maybeShowFusionHint.timer);
  maybeShowFusionHint.timer = window.setTimeout(() => ui.fusionNotice.classList.add("hidden"), 6200);
}
function hasWeaponPair(a, b, minLevel = 2) {
  return game.weapons[a].level >= minLevel && game.weapons[b].level >= minLevel;
}
function getWeaponClassCounts() {
  const counts = {};
  for (const id of buildOrder) {
    const weapon = game.weapons[id];
    if (weapon.level <= 0) continue;
    for (const className of weapon.classes || []) {
      counts[className] = (counts[className] || 0) + 1;
    }
  }
  return counts;
}
function getRouteProgress(route) {
  if (!game) {
    return {
      ...route,
      ownedWeapons: 0,
      weaponLevels: 0,
      statScore: 0,
      itemHits: 0,
      score: 0,
      tier: 0,
      next: "探索中",
      complete: false,
    };
  }
  const ownedWeapons = route.weapons.filter((id) => game.weapons[id].level > 0).length;
  const weaponLevels = route.weapons.reduce((sum, id) => sum + game.weapons[id].level, 0);
  const statScore = route.stats.reduce((sum, key) => sum + getRouteStatUnit(key), 0);
  const itemHits = game.boughtItemTags.filter((tag) => route.itemPattern.test(tag)).length;
  let score = ownedWeapons * 22 + Math.min(36, weaponLevels * 4) + Math.min(28, statScore) + Math.min(14, itemHits * 7);
  const pairReady = ownedWeapons >= route.weapons.length && route.weapons.every((id) => game.weapons[id].level >= 2);
  const evolved = pairReady && route.weapons.every((id) => game.weapons[id].level >= 7) && statScore >= 16;
  let tier = 0;
  if (ownedWeapons > 0) tier = 1;
  if (pairReady) tier = 2;
  if (pairReady && (weaponLevels >= 8 || statScore >= 18)) tier = 3;
  if (evolved) tier = 4;
  if (evolved) score = 100;
  const missingWeapon = route.weapons.find((id) => game.weapons[id].level <= 0);
  const next = missingWeapon
    ? `${game.weapons[missingWeapon].label}`
    : !pairReady
      ? "双武器"
      : statScore < 16
        ? route.stats.map((key) => statDisplayName(key)).join("/")
        : "高阶共鸣";
  return {
    ...route,
    ownedWeapons,
    weaponLevels,
    statScore,
    itemHits,
    score: clamp(Math.round(score), 0, 100),
    tier,
    next,
    complete: tier >= 4,
  };
}
function getRouteProgressList() {
  return routeDefinitions.map(getRouteProgress).sort((a, b) => b.score - a.score);
}
function getDominantRoute() {
  return getRouteProgressList()[0] || getRouteProgress(routeDefinitions[0]);
}
function getDominantRouteId() {
  let best = null;
  let bestScore = 0;
  for (const route of routeDefinitions) {
    const wl = route.weapons.reduce((s, id) => s + game.weapons[id].level, 0);
    if (wl >= 4 && wl > bestScore) { bestScore = wl; best = route.id; }
  }
  return best;
}
function getRouteEffectiveness(routeId) {
  if (getRouteTier(routeId) < 2) return 0;
  const dominantId = getDominantRouteId();
  if (!dominantId) return 1.0;
  const pairedCount = routeDefinitions.filter(r => getRouteTier(r.id) >= 2).length;
  if (routeId === dominantId) {
    return pairedCount === 1 ? 1.25 : 1.0;
  }
  return 0.5;
}
function getRouteTier(routeId) {
  const route = routeDefinitions.find((entry) => entry.id === routeId);
  return route ? getRouteProgress(route).tier : 0;
}
function checkRouteTierUps() {
  if (!game) return;
  if (!game.routeTiers) game.routeTiers = {};
  for (const route of routeDefinitions) {
    const newTier = getRouteTier(route.id);
    const oldTier = game.routeTiers[route.id] || 0;
    if (newTier <= oldTier) continue;
    for (let tier = oldTier + 1; tier <= newTier; tier += 1) {
      game.routeTiers[route.id] = tier;
      if (tier === 1) continue;
      if (tier === 2) {
        game.materials += 3;
        showRouteTierNotice(route, tier, "路线启动：补给材料 +3。");
      } else if (tier === 3) {
        addPlayerDamage(game, 0.04);
        showRouteTierNotice(route, tier, "路线聚焦：全局伤害 +4%，中期特效已启用。");
      } else if (tier === 4) {
        const pool = route.weapons.filter((id) => game.weapons[id].level < game.weapons[id].max);
        if (pool.length) {
          const pick = pool[Math.floor(Math.random() * pool.length)];
          game.weapons[pick].level += 1;
          syncWeaponDerivedStats();
          applyWeaponUpgradeModifiers();
          showRouteTierNotice(route, tier, `路线终局：${game.weapons[pick].label} 免费 +1 级。`);
        } else {
          showRouteTierNotice(route, tier, "路线终局：武器已达上限，终局进化进入待触发状态。");
        }
        checkWeaponEvolutions();
      }
    }
  }
}
function showRouteTierNotice(route, tier, detail) {
  const tierName = route.stages?.[tier] || `Tier ${tier}`;
  const message = `${route.name} · ${tierName}。${detail}`;
  game.fusionLog.push(message);
  showFusionNotice(`${route.name}路线`, route.fantasy || route.name, message);
  pulse(game.player.x, game.player.y, tier >= 4 ? 170 : tier >= 3 ? 135 : 96, route.color || "#52ffe1");
  markBuildHint();
}
function getRouteStatUnit(key) {
  const value = getEffectiveStat(key);
  if (key === "crit") return value / 3;
  if (key === "range") return Math.max(0, value) / 10;
  if (key === "attackSpeed") return value / 4;
  if (key === "dodge") return value / 3;
  if (key === "luck") return value / 5;
  if (key === "pickupRange") return Math.max(0, value - 150) / 14;
  if (key === "armor") return value * 2.8;
  if (key === "regen") return value * 3.2;
  if (key === "fortify") return value * 2.6;
  return value / 5;
}
function statDisplayName(key) {
  const found = statLabels.find((stat) => stat.key === key);
  return found ? found.label : key;
}
function getBuildPressureHint() {
  if (game.waveTime < 12 || game.stage < 5) return "";
  const owned = getOwnedWeaponCount();
  const topCount = Math.max(0, ...Object.values(getWeaponClassCounts()));
  if (owned >= 4 && topCount < 3 && Math.floor(game.waveTime) % 17 < 4) {
    return "后半程会检验同标签武器和关键属性，分散购买会越来越吃力";
  }
  const maxWeaponLevel = Math.max(0, ...buildOrder.map((id) => game.weapons[id].level));
  if (game.stage >= 7 && maxWeaponLevel < 4 && Math.floor(game.waveTime) % 19 < 4) {
    return "高压关需要至少一把主武器持续升级，留意同类强化和弱点克制";
  }
  if ((game.weapons.headset.level > 0 || game.weapons.report.level > 0) && Math.floor(game.waveTime) % 23 < 4) {
    return "领域武器不用完全站死，短暂停留和被围时都会积累守场优势";
  }
  return "";
}
function getTopWeaponClass() {
  const entries = getSortedWeaponClasses();
  return entries.length && entries[0][1] >= 2 ? entries[0][0] : "";
}
function getSortedWeaponClasses() {
  return Object.entries(getWeaponClassCounts()).sort((a, b) => b[1] - a[1]);
}
function getDiscoveredSynergies() {
  try { return JSON.parse(localStorage.getItem("cb_hidden_synergies") || "[]"); } catch { return []; }
}
function discoverSynergy(synergyId) {
  const discovered = getDiscoveredSynergies();
  if (discovered.includes(synergyId)) return false;
  discovered.push(synergyId);
  localStorage.setItem("cb_hidden_synergies", JSON.stringify(discovered));
  return true;
}
function checkHiddenSynergies() {
  if (!game?.boughtItems) return;
  const ids = new Set(Array.from(game.boughtItems));
  for (const syn of hiddenSynergies) {
    if (syn.items.every(itemId => ids.has(itemId))) {
      if (!game.hiddenSynergyTriggers?.has(syn.id)) {
        game.hiddenSynergyTriggers = game.hiddenSynergyTriggers || new Set();
        game.hiddenSynergyTriggers.add(syn.id);
        const isNew = discoverSynergy(syn.id);
        showFusionNotice("隐藏协同", syn.name, syn.desc + (isNew ? "（新发现！）" : ""));
        if (syn.id === "fortifiedBunker") {
          game.player.armor += 3;
          game.anchorDmgReduction = (game.anchorDmgReduction || 0) + 0.1;
        }
        if (syn.id === "spicyCombo") {
          game.energyDrinkFixed = true;
          addPlayerDamage(game, 0.06);
        }
        if (syn.id === "wirelessFengShui") {
          game.player.pickupRange += 30;
          game.fengShuiHeal = true;
        }
      }
    }
  }
  // Paper storm: check on crit
  const paperStorm = hiddenSynergies.find(s => s.id === "paperStorm");
  if (paperStorm && paperStorm.items.every(itemId => ids.has(itemId))) {
    game.paperStormActive = true;
  }
  // Rubber stampede: check on dodge
  const rubberStampede = hiddenSynergies.find(s => s.id === "rubberStampede");
  if (rubberStampede && rubberStampede.items.every(itemId => ids.has(itemId))) {
    game.rubberStampedeActive = true;
  }
}