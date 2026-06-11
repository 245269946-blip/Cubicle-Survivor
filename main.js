const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const ui = {
  time: document.querySelector("#timeText"),
  stage: document.querySelector("#stageText"),
  level: document.querySelector("#levelText"),
  kills: document.querySelector("#killsText"),
  remaining: document.querySelector("#remainingText"),
  skillCount: document.querySelector("#skillCountText"),
  material: document.querySelector("#materialText"),
  hp: document.querySelector("#hpText"),
  hpFill: document.querySelector("#hpFill"),
  xp: document.querySelector("#xpFill"),
  buildSummary: document.querySelector("#buildSummary"),
  buildPanel: document.querySelector("#buildPanel"),
  buildToggle: document.querySelector("#buildToggle"),
  buildList: document.querySelector("#buildList"),
  routeMap: document.querySelector("#routeMap"),
  statList: document.querySelector("#statList"),
  itemSummary: document.querySelector("#itemSummary"),
  itemList: document.querySelector("#itemList"),
  startPanel: document.querySelector("#startPanel"),
  upgradePanel: document.querySelector("#upgradePanel"),
  upgradeRerollButton: document.querySelector("#upgradeRerollButton"),
  upgradeRerollCount: document.querySelector("#upgradeRerollCount"),
  weaponPanel: document.querySelector("#weaponPanel"),
  resultPanel: document.querySelector("#resultPanel"),
  upgradeChoices: document.querySelector("#upgradeChoices"),
  weaponChoices: document.querySelector("#weaponChoices"),
  armoryBuildStrip: document.querySelector("#armoryBuildStrip"),
  armoryRouteMap: document.querySelector("#armoryRouteMap"),
  offerPreview: document.querySelector("#offerPreview"),
  armoryMaterial: document.querySelector("#armoryMaterialText"),
  armoryReason: document.querySelector("#armoryReasonText"),
  refreshButton: document.querySelector("#refreshButton"),
  refreshCost: document.querySelector("#refreshCostText"),
  resultEyebrow: document.querySelector("#resultEyebrow"),
  resultTitle: document.querySelector("#resultTitle"),
  resultStats: document.querySelector("#resultStats"),
  pausePanel: document.querySelector("#pausePanel"),
  pauseStats: document.querySelector("#pauseStats"),
  pauseButton: document.querySelector("#pauseButton"),
  resumeButton: document.querySelector("#resumeButton"),
  objectiveStageMeta: document.querySelector("#objectiveStageMeta"),
  objectiveStageName: document.querySelector("#objectiveStageName"),
  objectiveTime: document.querySelector("#objectiveTime"),
  objectiveRemaining: document.querySelector("#objectiveRemaining"),
  objectiveKills: document.querySelector("#objectiveKills"),
  objectiveAlert: document.querySelector("#objectiveAlert"),
  stageBanner: document.querySelector("#stageBanner"),
  stageBannerMeta: document.querySelector("#stageBannerMeta"),
  stageBannerTitle: document.querySelector("#stageBannerTitle"),
  stageBannerText: document.querySelector("#stageBannerText"),
  fusionNotice: document.querySelector("#fusionNotice"),
  fusionNoticeMeta: document.querySelector("#fusionNoticeMeta"),
  fusionNoticeTitle: document.querySelector("#fusionNoticeTitle"),
  fusionNoticeText: document.querySelector("#fusionNoticeText"),
  fusionNoticeClose: document.querySelector("#fusionNoticeClose"),
  guideOverlay: document.querySelector("#guideOverlay"),
  startButton: document.querySelector("#startButton"),
  restartButton: document.querySelector("#restartButton"),
  continueButton: document.querySelector("#continueButton"),
};

const TAU = Math.PI * 2;
const WORLD = { w: 4800, h: 3000 };
const WAVE_SECONDS = 50;
const RECOVERY_SECONDS = 10;
const MAX_STAGE = 14;
const SPRITE_ATLAS_SRC = "assets/office-rogue-atlas.png";
const PROPS_ATLAS_SRC = "assets/office-rogue-props.png";
const UI_ATLAS_SRC = "assets/office-rogue-ui-icons.png";
const SPRITE_GRID = 4;
const keys = new Set();
const pointer = { active: false, x: 0, y: 0 };

let game = null;
let lastTime = 0;
let state = "menu";
let pausedFromState = "playing";
let enemyId = 1;
let buildHudSignature = "";
let statHudSignature = "";
let itemHudSignature = "";

const spriteAtlas = new Image();
let spriteAtlasReady = false;
spriteAtlas.onload = () => {
  spriteAtlasReady = true;
};
spriteAtlas.src = SPRITE_ATLAS_SRC;

const propsAtlas = new Image();
let propsAtlasReady = false;
propsAtlas.onload = () => {
  propsAtlasReady = true;
};
propsAtlas.src = PROPS_ATLAS_SRC;

const weaponDefinitions = {
  coffee: {
    label: "咖啡",
    archetype: "直射爆发",
    classes: ["precise", "ranged"],
    color: "#f4c95d",
    level: 1,
    max: 7,
    description: "更高射速与穿透，专打高威胁目标。",
  },
  keyboard: {
    label: "键盘",
    archetype: "散射弹幕",
    classes: ["barrage", "ranged"],
    color: "#6ea8ff",
    level: 0,
    max: 7,
    description: "更多弹片与反弹，用密集火力清屏。",
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
    archetype: "近距爆发",
    classes: ["barrage", "close"],
    color: "#d7d0c2",
    level: 0,
    max: 7,
    description: "短距离扇形爆发，清近身怪很强。",
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
    archetype: "贯穿射线",
    classes: ["precise", "ranged"],
    color: "#b282ff",
    level: 0,
    max: 7,
    description: "低频贯穿射线，专打直线群怪。",
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
};

const buildOrder = ["coffee", "keyboard", "headset", "report", "stapler", "sticky", "marker", "calculator"];
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
    { count: 2, crit: 6 },
    { count: 3, crit: 12, damageMult: 0.06 },
    { count: 4, crit: 18, damageMult: 0.12 },
  ],
  ranged: [
    { count: 2, range: 24 },
    { count: 3, range: 52, pierce: 1 },
    { count: 4, range: 80, pierce: 1, attackSpeed: 8 },
  ],
  barrage: [
    { count: 2, attackSpeed: 8 },
    { count: 3, attackSpeed: 18, projectileMult: 1 },
    { count: 4, attackSpeed: 28, projectileMult: 2 },
  ],
  field: [
    { count: 2, fieldRadius: 18 },
    { count: 3, fieldRadius: 34, armor: 2 },
    { count: 4, fieldRadius: 50, armor: 4 },
  ],
  engineering: [
    { count: 2, engineering: 0.12 },
    { count: 3, engineering: 0.25, chain: 1 },
    { count: 4, engineering: 0.4, chain: 2 },
  ],
  support: [
    { count: 2, pickupRange: 22 },
    { count: 3, pickupRange: 45, luck: 8 },
    { count: 4, pickupRange: 70, luck: 24 },
  ],
  close: [
    { count: 1, armor: 1 },
    { count: 2, armor: 2, damageMult: 0.05 },
    { count: 3, armor: 3, damageMult: 0.08, attackSpeed: 8 },
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
  { key: "attackSpeed", label: "攻速", amount: 3, apply: (g) => { g.player.attackSpeed += 3; } },
  { key: "damageMult", label: "伤害", amount: 3, apply: (g) => { g.player.damageMult += 0.03; } },
  { key: "crit", label: "暴击", amount: 2, apply: (g) => { g.player.crit = Math.min(75, g.player.crit + 2); } },
  { key: "range", label: "射程", amount: 8, apply: (g) => { g.player.range += 8; } },
  { key: "luck", label: "幸运", amount: 3, apply: (g) => { g.player.luck += 3; } },
  { key: "pickupRange", label: "拾取", amount: 8, apply: (g) => { g.player.pickupRange += 8; } },
  { key: "regen", label: "恢复", amount: 1, apply: (g) => { g.player.regen += 1; } },
  { key: "fortify", label: "站场", amount: 1, apply: (g) => { g.player.fortify += 1; } },
];

function getStageConfig(stage) {
  const names = ["漏洞潮", "需求变更", "晨会围堵", "截止线", "复盘压力", "季度审判", "紧急上线", "跨组拉齐", "财年封版", "审计追问", "组织调整", "灰度事故", "年度述职", "终局评审"];
  const mixes = [
    { bug: 1 },
    { bug: 0.72, change: 0.28 },
    { bug: 0.52, change: 0.24, meeting: 0.24 },
    { bug: 0.42, change: 0.28, meeting: 0.18, deadline: 0.12 },
    { bug: 0.26, change: 0.24, meeting: 0.18, deadline: 0.18, intern: 0.14 },
    { bug: 0.2, change: 0.22, meeting: 0.2, deadline: 0.24, alarm: 0.14 },
    { bug: 0.18, change: 0.18, meeting: 0.16, deadline: 0.3, alarm: 0.18 },
    { bug: 0.13, change: 0.28, meeting: 0.24, deadline: 0.16, intern: 0.12, manager: 0.07 },
    { bug: 0.15, change: 0.2, meeting: 0.2, deadline: 0.26, audit: 0.12, alarm: 0.07 },
    { bug: 0.14, change: 0.22, meeting: 0.22, deadline: 0.22, audit: 0.12, manager: 0.08 },
    { bug: 0.1, change: 0.2, meeting: 0.28, deadline: 0.2, audit: 0.12, manager: 0.1 },
    { bug: 0.1, change: 0.3, meeting: 0.2, deadline: 0.2, intern: 0.12, manager: 0.08 },
    { bug: 0.18, change: 0.16, meeting: 0.16, deadline: 0.3, alarm: 0.1, audit: 0.1 },
    { bug: 0.12, change: 0.22, meeting: 0.22, deadline: 0.22, alarm: 0.08, audit: 0.08, manager: 0.06 },
  ];
  const pressureStage = stage === 3 || stage === 5 || stage === 8 || stage === 10;
  const burstStage = stage === 4 || stage === 7 || stage === 9;
  return {
    name: names[Math.min(names.length - 1, stage - 1)],
    duration: WAVE_SECONDS + Math.max(0, stage - 4) * 2,
    totalEnemies: 22 + stage * 10 + Math.max(0, stage - 6) * 7,
    maxConcurrent: Math.round((15 + stage * 3.7 + Math.max(0, stage - 6) * 2.2) * (pressureStage ? 1.12 : 1)),
    spawnInterval: Math.max(0.22, 0.86 - stage * 0.052 - Math.max(0, stage - 6) * 0.025),
    batchSize: Math.min(7, 1 + Math.floor(stage / 2) + (burstStage ? 1 : 0)),
    eliteTotal: Math.max(0, Math.floor((stage - 1) / 2) + (stage >= 7 ? 1 : 0) + (stage >= 10 ? 1 : 0)),
    healthMult: 1 + stage * 0.18 + Math.max(0, stage - 6) * 0.12,
    speedMult: 0.98 + stage * 0.045 + (burstStage ? 0.04 : 0),
    damageMult: (1 + stage * 0.105 + Math.max(0, stage - 6) * 0.04) * (pressureStage ? 1.08 : 1),
    materialMult: 0.68 + stage * 0.042,
    enemyMix: mixes[Math.min(mixes.length - 1, stage - 1)],
    clearBonusMult: burstStage || stage === 10 ? 1.32 : 1,
    survivalPressure: pressureStage ? 1.16 : burstStage ? 1.08 : 1,
  };
}

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
        g.player.damageMult += 0.04;
        g.player.crit = Math.min(75, g.player.crit + 2);
        g.player.maxHp = Math.max(60, g.player.maxHp - 3);
        g.player.hp = Math.min(g.player.hp, g.player.maxHp);
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
    tag: "武器 / 散射弹幕",
    text: "键盘弹片数量增加，散射角更宽。",
    apply: (g) => {
      g.weapons.keyboard.level += 1;
      g.player.keyboardShots += 1;
    },
    available: (g) => g.weapons.keyboard.level < g.weapons.keyboard.max,
  },
  {
    id: "keyboardBounce",
    title: "连击输入",
    tag: "武器 / 散射弹幕",
    text: "键盘弹片更持久，命中后继续弹跳。",
    apply: (g) => {
      g.weapons.keyboard.level += 1;
      g.player.keyboardLife += 0.22;
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
    tag: "武器 / 近距爆发",
    text: "获得或强化订书机，发射近距离扇形钉弹。",
    apply: (g) => {
      g.weapons.stapler.level += 1;
      g.player.staplerPellets += 1;
    },
    available: (g) => g.weapons.stapler.level < g.weapons.stapler.max,
  },
  {
    id: "staplerPunch",
    title: "加厚钉匣",
    tag: "武器 / 近距爆发",
    text: "订书机伤害提升，冷却缩短。",
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
    id: "coffeeThermos",
    title: "保温杯续航",
    tag: "武器 / 直射频率",
    text: "咖啡冷却明显缩短，攻速收益更高。",
    apply: (g) => {
      g.weapons.coffee.level += 1;
      g.player.coffeeCooldown *= 0.84;
      g.player.attackSpeed += 4;
    },
    available: (g) => g.weapons.coffee.level >= 3 && g.weapons.coffee.level < g.weapons.coffee.max,
  },
  {
    id: "keyboardMacro",
    title: "宏录制",
    tag: "武器 / 弹幕数量",
    text: "键盘额外弹片增加，弹幕覆盖更稳定。",
    apply: (g) => {
      g.weapons.keyboard.level += 1;
      g.player.keyboardShots += 2;
      g.player.attackSpeed += 3;
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
      g.player.damageMult += 0.08;
      g.player.pickupRange += 8;
    },
    available: (g) => g.player.damageMult < 1.8,
  },
  {
    id: "attackSpeed",
    title: "快捷键肌肉记忆",
    tag: "属性 / 攻速",
    text: "攻速 +12%，小幅提升射程。",
    apply: (g) => {
      g.player.attackSpeed += 12;
      g.player.range += 8;
    },
    available: (g) => g.player.attackSpeed < 120,
  },
  {
    id: "crit",
    title: "灵光一现",
    tag: "属性 / 暴击",
    text: "暴击 +8%，伤害 +3%。",
    apply: (g) => {
      g.player.crit = Math.min(75, g.player.crit + 8);
      g.player.damageMult += 0.03;
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
      g.player.attackSpeed += 22;
      g.player.damageMult += 0.05;
      g.player.maxHp = Math.max(55, g.player.maxHp - 8);
      g.player.hp = Math.min(g.player.hp, g.player.maxHp);
    },
    available: (g) => g.player.attackSpeed < 150 && g.player.maxHp > 65,
  },
  {
    id: "glassBuild",
    title: "玻璃绩效",
    tag: "属性 / 爆发",
    text: "伤害 +18%，暴击 +6%，护甲 -2。适合精准贯穿。",
    apply: (g) => {
      g.player.damageMult += 0.18;
      g.player.crit = Math.min(75, g.player.crit + 6);
      g.player.armor = Math.max(-6, g.player.armor - 2);
    },
    available: (g) => g.player.damageMult < 2.2,
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
      g.player.damageMult += 0.1;
      g.player.crit = Math.min(75, g.player.crit + 4);
      g.player.dodge = Math.max(0, g.player.dodge - 3);
    },
    available: (g) => g.player.damageMult < 2.4 || g.player.crit < 75,
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
      g.player.damageMult += 0.1;
      g.player.crit = Math.min(75, g.player.crit + 8);
      g.player.maxHp = Math.max(55, g.player.maxHp - 8);
      g.player.hp = Math.min(g.player.hp, g.player.maxHp);
    },
    available: (g) => g.stage >= 6 && (g.player.damageMult < 2.6 || g.player.crit < 75),
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
      g.player.damageMult += 0.12;
      g.player.crit = Math.min(75, g.player.crit + 10);
      g.player.armor = Math.max(-8, g.player.armor - 2);
    },
    available: (g) => g.stage >= 8 && (g.player.damageMult < 2.8 || g.player.crit < 75),
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
      g.player.damageMult += 0.1;
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
      g.player.damageMult += 0.06;
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
      g.player.attackSpeed += 18;
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
      g.player.attackSpeed += 14;
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
      g.player.damageMult += 0.16;
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
      g.player.damageMult += 0.12;
      g.player.crit = Math.min(75, g.player.crit + 5);
      g.player.attackSpeed += 8;
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
    rerollCount: 0,
    shopOffers: [],
    lockedShopOffers: [],
    currentUpgradeChoices: [],
    upgradeRerolls: 0,
    weaponUpgradeCounts: {},
    boughtItems: new Set(),
    boughtItemNames: [],
    boughtItemTags: [],
    fusionHintsSeen: new Set(),
    fusionLog: [],
    evolutionHintsSeen: new Set(),
    evolvedWeapons: new Set(),
    kills: 0,
    level: 1,
    upgradesTaken: 0,
    pendingLevelUps: 0,
    upgradeReturnState: "playing",
    xp: 0,
    xpNext: 18,
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
      coffeeTimer: 0,
      coffeeShotCount: 0,
      coffeeCooldown: 0.62,
      coffeePierce: 1,
      keyboardTimer: 0,
      keyboardShots: 3,
      keyboardLife: 0.85,
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
    },
    weapons: structuredClone(weaponDefinitions),
  };
}

function startGame() {
  enemyId = 1;
  buildHudSignature = "";
  statHudSignature = "";
  itemHudSignature = "";
  game = createGame();
  game.currentIncident = rollOfficeIncident(game.stage);
  applyOfficeIncident();
  state = "playing";
  ui.startPanel.classList.add("hidden");
  ui.resultPanel.classList.add("hidden");
  ui.upgradePanel.classList.add("hidden");
  ui.weaponPanel.classList.add("hidden");
  ui.pausePanel.classList.add("hidden");
  showStageBanner();
  lastTime = performance.now();
  requestAnimationFrame(loop);
}

function loop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000 || 0);
  lastTime = now;

  if (state === "playing") {
    updateGame(dt);
  } else if (state === "recovery") {
    updateStageRecovery(dt);
  }

  render();
  updateHud();

  if (state === "playing" || state === "recovery") {
    requestAnimationFrame(loop);
  }
}

function updateGame(dt) {
  game.time += dt;
  game.waveTime += dt;
  game.orbitAngle += game.player.orbitSpeed * dt;

  updatePlayer(dt);
  updateWeapons(dt);
  updateEnemies(dt);
  updateDamageZones(dt);
  updateDelayedBlasts(dt);
  updateProjectiles(dt);
  updatePickups(dt);
  updateParticles(dt);
  updateFloatingTexts(dt);
  spawnEnemies(dt);

  if (game.player.hp <= 0) endGame(false);
  if (game.enemiesToSpawn <= 0 && game.enemies.length === 0) completeStage("clear");
  else if (game.waveTime >= game.stageConfig.duration) completeStage("survive");
}

function updatePlayer(dt) {
  const p = game.player;
  let dx = 0;
  let dy = 0;
  if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
  if (keys.has("arrowright") || keys.has("d")) dx += 1;
  if (keys.has("arrowup") || keys.has("w")) dy -= 1;
  if (keys.has("arrowdown") || keys.has("s")) dy += 1;

  if (dx === 0 && dy === 0 && pointer.active) {
    dx = pointer.x - p.x;
    dy = pointer.y - p.y;
    if (Math.hypot(dx, dy) < 10) {
      dx = 0;
      dy = 0;
    }
  }

  const standingStill = dx === 0 && dy === 0;
  const fieldKit = game.weapons.headset.level > 0 || game.weapons.report.level > 0 || p.fortify > 0;
  const anchorMax = getAnchorMaxTime();
  if (standingStill) {
    p.anchorTime = Math.min(anchorMax, p.anchorTime + dt * (1 + getEffectiveStat("fortify") * 0.025));
  } else if (fieldKit) {
    const fieldLevel = game.weapons.headset.level + game.weapons.report.level;
    const nearbyPressure = game.enemies.filter((e) => Math.hypot(e.x - p.x, e.y - p.y) < 170).length;
    const decay = Math.max(0.12, 0.46 - getEffectiveStat("fortify") * 0.012 - fieldLevel * 0.012);
    const carryFloor = Math.min(anchorMax * 0.72, 0.42 + getEffectiveStat("fortify") * 0.045 + fieldLevel * 0.05);
    p.anchorTime = Math.max(carryFloor, p.anchorTime - dt * decay);
    if (nearbyPressure >= 5) p.anchorTime = Math.min(anchorMax, p.anchorTime + dt * Math.min(0.42, nearbyPressure * 0.028));
  } else {
    p.anchorTime = Math.max(0, p.anchorTime - dt * 1.4);
  }

  const len = Math.hypot(dx, dy) || 1;
  if (dx !== 0 || dy !== 0) {
    p.facingX = dx / len;
    p.facingY = dy / len;
  }
  const moveSpeed = p.speed * p.slow;
  p.x = clamp(p.x + (dx / len) * moveSpeed * dt, p.r, WORLD.w - p.r);
  p.y = clamp(p.y + (dy / len) * moveSpeed * dt, p.r, WORLD.h - p.r);
  p.slow = 1;
  p.invuln = Math.max(0, p.invuln - dt);
  if (p.regen > 0 && p.hp < p.maxHp) {
    p.regenTimer += dt;
    if (p.regenTimer >= 1) {
      p.hp = Math.min(p.maxHp, p.hp + p.regen);
      p.regenTimer = 0;
    }
  }

  game.camera.x = clamp(p.x - canvas.width / 2, 0, WORLD.w - canvas.width);
  game.camera.y = clamp(p.y - canvas.height / 2, 0, WORLD.h - canvas.height);
}

function updateWeapons(dt) {
  const p = game.player;
  const target = nearestEnemy();
  const precision = hasWeaponPair("coffee", "marker", 2);
  const barrage = hasWeaponPair("keyboard", "stapler", 2);
  const conductor = hasWeaponPair("sticky", "calculator", 2);
  const perimeter = hasWeaponPair("headset", "report", 2);
  const precisionTier = getRouteTier("precision");
  const barrageTier = getRouteTier("barrage");
  const conductorTier = getRouteTier("conductor");
  const perimeterTier = getRouteTier("perimeter");

  p.coffeeTimer -= dt;
  if (game.weapons.coffee.level > 0 && p.coffeeTimer <= 0 && target) {
    const level = game.weapons.coffee.level;
    const angle = Math.atan2(target.y - p.y, target.x - p.x);
    p.coffeeShotCount += 1;
    const bigShot = level >= 5 && p.coffeeShotCount % 5 === 0;
    const damage = hitDamage((14 + level * 4.2) * getWeaponStatScale("precise") * (precision ? 1.12 : 1) * (bigShot ? 1.75 : 1));
    fireAt(target, bigShot ? 620 : 520, damage, bigShot ? "#fff07a" : "#f4c95d", p.coffeePierce + getClassBonus("pierce") + (precision ? 1 : 0) + (bigShot ? 2 : 0), bigShot ? 7 : 4, 1.15 + rangeBonus(0.004), "coffee");
    if (level >= 3) {
      game.delayedBlasts.push({
        x: target.x,
        y: target.y,
        r: 44 + level * 3,
        delay: hasWeaponEvolution("coffee") ? 1.2 : 0.18,
        damage: damage * (hasWeaponEvolution("coffee") ? 2 : 0.55),
        source: "coffee",
        color: "#f4c95d",
        text: hasWeaponEvolution("coffee") ? "咖啡渍" : "溅射",
      });
    }
    if (level >= 7 && Math.random() < clamp(getEffectiveStat("crit"), 10, 75) / 140) {
      chainLightning(target, 1 + (hasWeaponEvolution("coffee") ? 1 : 0), 210 + rangeBonus(0.35), damage * 0.55, "coffee");
    }
    if (precision) {
      fireBeam(angle, 420 + rangeBonus(0.9), 3 + Math.floor(level / 2), hitDamage(5 + game.weapons.marker.level * 2.2), "#b282ff", "marker");
    }
    if (precisionTier >= 4) {
      fireBeam(angle - 0.18, 520 + rangeBonus(1.0), 3 + Math.floor(level / 2), hitDamage(7 + level * 2.4), "#52ffe1", "marker");
      fireBeam(angle + 0.18, 520 + rangeBonus(1.0), 3 + Math.floor(level / 2), hitDamage(7 + level * 2.4), "#c35cff", "marker");
    }
    if (level >= 4) {
      fireAt({ x: target.x + 26, y: target.y - 18 }, 500, hitDamage(9 + level * 2.2), "#f7dda0", 1, 3, 1.05 + rangeBonus(0.003), "coffee");
      fireAt({ x: target.x - 26, y: target.y + 18 }, 500, hitDamage(9 + level * 2.2), "#f7dda0", 1, 3, 1.05 + rangeBonus(0.003), "coffee");
    }
    p.coffeeTimer = weaponCooldown(p.coffeeCooldown * (precision ? 0.88 : 1), "coffee");
  }

  p.keyboardTimer -= dt;
  if (game.weapons.keyboard.level > 0 && p.keyboardTimer <= 0 && target) {
    const level = game.weapons.keyboard.level;
    const shots = p.keyboardShots + Math.floor(level / 3) + Math.floor(getEffectiveStat("attackSpeed") / 65) + getClassBonus("projectileMult") + (barrage ? 2 : 0) + (barrageTier >= 4 ? 2 : 0);
    const baseAngle = Math.atan2(target.y - p.y, target.x - p.x);
    const spread = 0.18 + shots * 0.05;
    for (let i = 0; i < shots; i += 1) {
      const t = shots === 1 ? 0.5 : i / (shots - 1);
      const angle = baseAngle + (t - 0.5) * spread * 2;
      spawnProjectile({
        x: p.x,
        y: p.y,
        vx: Math.cos(angle) * 420,
        vy: Math.sin(angle) * 420,
        r: 4,
        life: p.keyboardLife + rangeBonus(0.002),
        damage: hitDamage((7 + level * 2.1) * getWeaponStatScale("barrage")),
        color: barrageTier >= 4 && i % 2 ? "#c35cff" : "#6ea8ff",
        pierce: 1 + getClassBonus("pierce") + (barrage ? 1 : 0),
        source: "keyboard",
      });
    }
    if (barrageTier >= 4) {
      for (let i = 0; i < 4; i += 1) {
        const angle = baseAngle + (i - 1.5) * 0.42;
        spawnProjectile({
          x: p.x,
          y: p.y,
          vx: Math.cos(angle) * 360,
          vy: Math.sin(angle) * 360,
          r: 3,
          life: 0.55,
          damage: hitDamage(5 + level * 1.6),
          color: "#52ffe1",
          pierce: 1,
          source: "keyboard",
        });
      }
    }
    if (level >= 5 || hasWeaponEvolution("keyboard")) {
      const ringCount = hasWeaponEvolution("keyboard") ? 10 : 6;
      for (let i = 0; i < ringCount; i += 1) {
        const angle = baseAngle + (i / ringCount) * TAU;
        spawnProjectile({
          x: p.x,
          y: p.y,
          vx: Math.cos(angle) * 315,
          vy: Math.sin(angle) * 315,
          r: 3,
          life: 0.42 + rangeBonus(0.001),
          damage: hitDamage(4 + level * 1.65),
          color: hasWeaponEvolution("keyboard") ? "#52ffe1" : "#6ea8ff",
          pierce: level >= 7 ? 2 : 1,
          source: "keyboard",
        });
      }
    }
    p.keyboardTimer = weaponCooldown(Math.max(0.42, 1.18 - level * 0.07 - (barrage ? 0.08 : 0)), "keyboard");
  }

  p.staplerTimer -= dt;
  if (game.weapons.stapler.level > 0 && p.staplerTimer <= 0 && target) {
    const level = game.weapons.stapler.level;
    const shots = p.staplerPellets + Math.floor(level / 2) + Math.floor(getEffectiveStat("dodge") / 18) + getClassBonus("projectileMult") + (barrage ? 2 : 0);
    const baseAngle = Math.atan2(target.y - p.y, target.x - p.x);
    for (let i = 0; i < shots; i += 1) {
      const t = shots === 1 ? 0.5 : i / (shots - 1);
      const angle = baseAngle + (t - 0.5) * 0.95;
      spawnProjectile({
        x: p.x + Math.cos(angle) * 12,
        y: p.y + Math.sin(angle) * 12,
        vx: Math.cos(angle) * 560,
        vy: Math.sin(angle) * 560,
        r: 4,
        life: 0.28 + rangeBonus(0.0008),
        damage: hitDamage((13 + level * 4.6) * getWeaponStatScale("barrage") * (barrage ? 1.08 : 1)),
        color: "#d7d0c2",
        pierce: 1,
        source: "stapler",
      });
    }
    if (level >= 5 || hasWeaponEvolution("stapler")) {
      const blastRadius = hasWeaponEvolution("stapler") ? 96 : 64;
      for (const e of game.enemies) {
        if (Math.hypot(e.x - p.x, e.y - p.y) < blastRadius + e.r) {
          applyEnemyDamage(e, hitDamage((10 + level * 3.2) * getWeaponStatScale("barrage")), "stapler");
          e.slow = Math.min(e.slow || 1, 0.72);
        }
      }
      pulse(p.x, p.y, blastRadius, "#d7d0c2");
    }
    p.staplerTimer = weaponCooldown(Math.max(0.5, p.staplerCooldown - level * 0.04 - (barrage ? 0.08 : 0)), "stapler");
  }

  p.stickyTimer -= dt;
  if (game.weapons.sticky.level > 0 && p.stickyTimer <= 0) {
    const level = game.weapons.sticky.level;
    const trapCount = level >= 7 || hasWeaponEvolution("sticky") ? 2 : 1;
    for (let i = 0; i < trapCount; i += 1) {
      const angle = i === 0 ? 0 : game.time * 2.1;
      const offset = i === 0 ? 0 : 46;
      game.damageZones.push({
        x: p.x + Math.cos(angle) * offset,
        y: p.y + Math.sin(angle) * offset,
        r: p.stickyRadius + level * 4 + Math.floor(getEffectiveStat("pickupRange") / 28) + getTrapRadiusBonus(),
        life: p.stickyLife + getEngineeringUtility() * 0.08,
        maxLife: p.stickyLife + getEngineeringUtility() * 0.08,
        damage: continuousDamage((7 + level * 2.8) * getWeaponStatScale("engineering") * (1 + getClassBonus("engineering"))),
        source: "sticky",
        tick: 0,
        chainTick: conductor ? (conductorTier >= 4 ? 0.08 : 0.14) : Infinity,
        textTick: 0,
        explodeOnEnd: level >= 5,
        color: conductorTier >= 4 ? "#52ffe1" : "#fff07a",
      });
    }
    p.stickyTimer = weaponCooldown(Math.max(0.8, p.stickyCooldown - level * 0.05), "sticky");
  }

  p.markerTimer -= dt;
  if (game.weapons.marker.level > 0 && p.markerTimer <= 0 && target) {
    const level = game.weapons.marker.level;
    const angle = Math.atan2(target.y - p.y, target.x - p.x);
    p.markerShotCount += 1;
    const grandBeam = level >= 5 && (p.markerShotCount % 4 === 0 || hasWeaponEvolution("marker"));
    fireBeam(angle, 700 + rangeBonus(1.25) + (grandBeam ? 180 : 0), p.markerWidth + level + Math.floor(getEffectiveStat("crit") / 18) + (precision ? 3 : 0) + (grandBeam ? 12 : 0), hitDamage((24 + level * 7.6) * getWeaponStatScale("precise") * (precision ? 1.12 : 1) * (grandBeam ? 1.45 : 1)), grandBeam ? "#52ffe1" : "#b282ff", "marker");
    if (level >= 7) {
      fireBeam(angle + 0.5, 560 + rangeBonus(0.8), Math.max(6, p.markerWidth * 0.55), hitDamage(12 + level * 3.4), "#b282ff", "marker");
      fireBeam(angle - 0.5, 560 + rangeBonus(0.8), Math.max(6, p.markerWidth * 0.55), hitDamage(12 + level * 3.4), "#b282ff", "marker");
    }
    p.markerTimer = weaponCooldown(Math.max(0.94, p.markerCooldown - level * 0.1 - (precision ? 0.16 : 0)), "marker");
  }

  p.calculatorTimer -= dt;
  if (game.weapons.calculator.level > 0 && p.calculatorTimer <= 0 && target) {
    const level = game.weapons.calculator.level;
    const jumps = p.chainJumps + Math.floor(level / 2) + Math.floor(getEffectiveStat("luck") / 42) + getClassBonus("chain") + (conductor ? 1 : 0) + (conductorTier >= 4 ? 2 : 0) + (hasWeaponEvolution("calculator") ? 2 : 0);
    const chainDamage = hitDamage((17 + level * 5.6) * getWeaponStatScale("engineering") * (1 + getClassBonus("engineering")) * (conductor ? 1.1 : 1) * (conductorTier >= 4 ? 1.12 : 1));
    chainLightning(target, jumps, p.chainRange + rangeBonus(0.8) + (conductor ? 36 : 0) + (conductorTier >= 4 ? 54 : 0), chainDamage, "calculator");
    if (level >= 5 || hasWeaponEvolution("calculator")) {
      game.delayedBlasts.push({
        x: target.x,
        y: target.y,
        r: hasWeaponEvolution("calculator") ? 88 : 56,
        delay: 0.28,
        damage: chainDamage * (hasWeaponEvolution("calculator") ? 1.2 : 0.7),
        source: "calculator",
        color: "#52ffe1",
        text: "复核",
      });
    }
    p.calculatorTimer = weaponCooldown(Math.max(0.88, p.calculatorCooldown - level * 0.07), "calculator");
  }

  const auraLevel = game.weapons.headset.level;
  if (auraLevel > 0) {
    const auraRadius = getAuraRadius();
    let auraHits = 0;
    const auraDps = continuousDamage(p.auraDamage * getWeaponStatScale("field") * (perimeter ? 1.14 : 1) * (perimeterTier >= 4 ? 1.12 : 1) * (hasWeaponEvolution("headset") ? 1.18 : 1));
    for (const e of game.enemies) {
      const dist = Math.hypot(e.x - p.x, e.y - p.y);
      if (dist < auraRadius + e.r) {
        applyEnemyDamage(e, auraDps * dt, "headset", false);
        e.slow = perimeterTier >= 4 ? 0.54 : perimeter ? 0.66 : 0.72;
        e.hitFlash = Math.max(e.hitFlash || 0, 0.03);
        auraHits += 1;
      }
    }
    p.fieldTextTimer -= dt;
    if (auraHits > 0 && p.fieldTextTimer <= 0) {
      floatingText(p.x, p.y - auraRadius * 0.35, `领域 ${Math.round(auraDps)}/s`, "#52ffe1");
      p.fieldTextTimer = 0.72;
    }
    p.auraPulseTimer -= dt;
    if ((p.auraPulse > 0 || auraLevel >= 5 || hasWeaponEvolution("headset")) && p.auraPulseTimer <= 0) {
      const pulsePower = p.auraPulse + (auraLevel >= 5 ? 1 : 0) + (hasWeaponEvolution("headset") ? 2 : 0);
      for (const e of game.enemies) {
        const dx = e.x - p.x;
        const dy = e.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < auraRadius + 40) {
          e.x += (dx / dist) * (26 + pulsePower * 8 + (perimeter ? 10 : 0) + (perimeterTier >= 4 ? 18 : 0));
          e.y += (dy / dist) * (26 + pulsePower * 8 + (perimeter ? 10 : 0) + (perimeterTier >= 4 ? 18 : 0));
          e.slow = Math.min(e.slow || 1, hasWeaponEvolution("headset") ? 0.36 : 0.58);
          applyEnemyDamage(e, continuousDamage((8 + pulsePower * 4) * getWeaponStatScale("field") * (perimeter ? 1.18 : 1) * (perimeterTier >= 4 ? 1.18 : 1)), "headset");
        }
      }
      pulse(p.x, p.y, auraRadius + 28, "#42d7b8");
      p.auraPulseTimer = weaponCooldown(Math.max(0.82, 2.6 - pulsePower * 0.22), "headset");
    }
  }

  const orbitLevel = game.weapons.report.level;
  if (orbitLevel > 0) {
    const orbiters = getOrbiters();
    for (const orb of orbiters) {
      for (const e of game.enemies) {
        if (Math.hypot(e.x - orb.x, e.y - orb.y) < e.r + orb.r) {
          applyEnemyDamage(e, continuousDamage((17 + orbitLevel * 4.6) * getWeaponStatScale("field") * (perimeter ? 1.18 : 1)) * dt, "report", false);
          if (orbitLevel >= 5 || hasWeaponEvolution("report")) e.slow = Math.min(e.slow || 1, hasWeaponEvolution("report") ? 0.54 : 0.7);
          e.hitFlash = 0.08;
        }
      }
    }
    if (hasWeaponEvolution("report") && Math.floor(game.time * 2.2) !== Math.floor((game.time - dt) * 2.2)) {
      for (const e of game.enemies) {
        if (Math.hypot(e.x - p.x, e.y - p.y) < p.orbitRadius + 90 + e.r) {
          applyEnemyDamage(e, continuousDamage(9 + orbitLevel * 2.6), "report");
        }
      }
      pulse(p.x, p.y, p.orbitRadius + 90, "#ffd15c");
    }
  }
}

function updateEnemies(dt) {
  const p = game.player;
  for (const e of game.enemies) {
    const dx = p.x - e.x;
    const dy = p.y - e.y;
    const dist = Math.hypot(dx, dy) || 1;
    e.phase += dt;
    let speed = e.speed * (e.slow || 1);
    let moveX = dx / dist;
    let moveY = dy / dist;

    if (e.type === "change") {
      const wobble = Math.sin(e.phase * 5.6 + e.id) * 0.55;
      moveX = dx / dist + (-dy / dist) * wobble;
      moveY = dy / dist + (dx / dist) * wobble;
      const len = Math.hypot(moveX, moveY) || 1;
      moveX /= len;
      moveY /= len;
    }

    if (e.type === "intern") {
      const wobble = Math.sin(e.phase * 8.4 + e.id) * 0.95;
      moveX = dx / dist + (-dy / dist) * wobble;
      moveY = dy / dist + (dx / dist) * wobble;
      const len = Math.hypot(moveX, moveY) || 1;
      moveX /= len;
      moveY /= len;
      if (dist < 120) speed *= 1.28;
    }

    if (e.type === "deadline") {
      e.chargeTimer -= dt;
      if (e.chargeTimer <= 0) {
        e.charging = 0.72;
        e.chargeX = dx / dist;
        e.chargeY = dy / dist;
        e.chargeTimer = 3.1 + Math.random() * 1.2;
      }
      if (e.charging > 0) {
        speed *= 2.35;
        moveX = e.chargeX || moveX;
        moveY = e.chargeY || moveY;
        e.charging -= dt;
      }
    }

    if (e.type === "alarm") {
      e.specialTimer -= dt;
      if (e.specialTimer <= 0) {
        for (const other of game.enemies) {
          if (other.id !== e.id && Math.hypot(other.x - e.x, other.y - e.y) < 210) {
            other.slow = Math.max(other.slow || 1, 1.28);
            other.hitFlash = Math.max(other.hitFlash || 0, 0.08);
          }
        }
        floatingText(e.x, e.y - 28, "警报", "#ff5a7a");
        pulse(e.x, e.y, 120, "#ff5a7a");
        e.specialTimer = 3.4 + Math.random() * 1.4;
      }
    }

    if (e.type === "audit") {
      e.shield = 0.22 + Math.sin(e.phase * 2.2) * 0.12;
      if (dist < 150) p.slow = Math.min(p.slow, 0.86);
    }

    if (e.type === "manager" || e.type === "boss") {
      if (dist < (e.type === "boss" ? 210 : 142)) {
        p.slow = Math.min(p.slow, e.type === "boss" ? 0.76 : 0.82);
      }
      e.specialTimer -= dt;
      if (e.specialTimer <= 0) {
        const radius = e.type === "boss" ? 170 : 108;
        if (dist < radius && p.invuln <= 0) takeDamage(e.damage * (e.type === "boss" ? 0.42 : 0.28));
        pulse(e.x, e.y, radius, e.type === "boss" ? "#ff2a60" : "#ffd15c");
        e.specialTimer = e.type === "boss" ? 2.8 : 4.2;
      }
    }

    if (e.type === "meeting" && dist < 118) {
      p.slow = Math.min(p.slow, 0.74);
      if (dist < 86 && p.invuln <= 0) takeDamage(e.damage * 0.45);
    }

    e.x += moveX * speed * dt;
    e.y += moveY * speed * dt;
    e.slow = 1;
    e.hitFlash = Math.max(0, (e.hitFlash || 0) - dt);

    if (dist < p.r + e.r && p.invuln <= 0) {
      takeDamage(e.damage);
    }
  }

  for (let i = game.enemies.length - 1; i >= 0; i -= 1) {
    const e = game.enemies[i];
    if (e.hp <= 0) {
      game.enemies.splice(i, 1);
      game.kills += 1;
      game.stageKills += 1;
      dropEnemyLoot(e);
      hitBurst(e.x, e.y, e.color, e.elite ? 18 : 8);
    }
  }
}

function takeDamage(rawDamage) {
  const p = game.player;
  const dodgeChance = clamp(p.dodge, 0, 60) / 100;
  if (Math.random() < dodgeChance) {
    p.invuln = 0.38 + p.invulnBonus;
    floatingText(p.x, p.y - 30, "闪避", "#8fffe7");
    pulse(p.x, p.y, 42, "#42d7b8");
    return;
  }

  const reduction = 100 / (100 + Math.max(0, p.armor + getClassBonus("armor")) * 7);
  const anchorReduction = 1 - getAnchorDamageReduction();
  const damage = Math.max(1, Math.round(rawDamage * reduction));
  const finalDamage = Math.max(1, Math.round(damage * anchorReduction));
  p.hp -= finalDamage;
  if (p.fortify > 0 || game.weapons.headset.level > 0 || game.weapons.report.level > 0) {
    p.anchorTime = Math.min(getAnchorMaxTime(), p.anchorTime + 0.48 + getEffectiveStat("fortify") * 0.014);
  }
  p.invuln = 0.64 + p.invulnBonus;
  hitBurst(p.x, p.y, "#ff6b6b", 10);
  floatingText(p.x, p.y - 30, `-${finalDamage}`, getAnchorCharge() > 0.65 ? "#ffd15c" : "#ff8585");
}

function applyEnemyDamage(enemy, amount, source = "generic", showWeakText = true) {
  let multiplier = 1;
  if (enemy.type === "deadline" && (source === "marker" || source === "coffee")) multiplier *= 1.35;
  if (enemy.type === "alarm" && source === "report") multiplier *= 1.55;
  if (enemy.type === "intern" && source === "sticky") multiplier *= 1.45;
  if (enemy.type === "audit" && (source === "calculator" || source === "report")) multiplier *= 1.38;
  if (enemy.type === "manager" && (source === "calculator" || source === "coffee")) multiplier *= 1.25;
  if (enemy.type === "boss" && (source === "marker" || source === "report" || source === "calculator")) multiplier *= 1.18;

  const shield = enemy.shield ? 1 - clamp(enemy.shield, 0, 0.45) : 1;
  const damage = amount * multiplier * shield;
  enemy.hp -= damage;
  if (multiplier > 1.05 && showWeakText) {
    enemy.weakTextTimer = (enemy.weakTextTimer || 0) - 0.2;
    if (enemy.weakTextTimer <= 0) {
      floatingText(enemy.x, enemy.y - enemy.r - 10, "弱点", "#ffd15c");
      enemy.weakTextTimer = 0.7;
    }
  }
}

function dropEnemyLoot(enemy) {
  game.pickups.push({ kind: "xp", x: enemy.x, y: enemy.y, r: 6, value: enemy.xp });
  const effectiveLuck = game.player.luck + getClassBonus("luck");
  const materialChance = enemy.elite ? 1 : Math.min(0.68, 0.4 + effectiveLuck * 0.00115);
  if (Math.random() < materialChance) {
    game.pickups.push({
      kind: "material",
      x: enemy.x + (Math.random() - 0.5) * 24,
      y: enemy.y + (Math.random() - 0.5) * 24,
      r: 7,
      value: Math.max(1, Math.round(enemy.materialValue * game.stageConfig.materialMult * getMaterialMult())),
    });
  }

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

function updateDamageZones(dt) {
  for (const zone of game.damageZones) {
    zone.life -= dt;
    zone.tick -= dt;
    zone.chainTick -= dt;
    zone.textTick -= dt;
    if (zone.tick <= 0) {
      let chainSeed = null;
      let hitCount = 0;
      for (const e of game.enemies) {
        const dist = Math.hypot(e.x - zone.x, e.y - zone.y);
        if (dist < e.r + zone.r) {
          applyEnemyDamage(e, zone.damage * 0.32, zone.source || "sticky", false);
          e.slow = Math.min(e.slow || 1, 0.78);
          e.hitFlash = 0.06;
          hitCount += 1;
          if (!chainSeed) chainSeed = e;
        }
      }
      if (hitCount > 0 && zone.textTick <= 0) {
        floatingText(zone.x, zone.y - Math.min(72, zone.r * 0.55), `陷阱 ${Math.round(zone.damage)}`, zone.color || "#fff07a");
        zone.textTick = 0.62;
      }
      if (chainSeed && zone.chainTick <= 0 && game.weapons.calculator.level > 0) {
        chainLightning(
          chainSeed,
          1 + Math.floor(game.weapons.calculator.level / 3) + Math.floor(getEngineeringUtility() / 18),
          game.player.chainRange * 0.78 + rangeBonus(0.45) + getEngineeringUtility() * 1.4,
          continuousDamage(8 + game.weapons.calculator.level * 2.4),
          "calculator",
        );
        zone.chainTick = 0.68;
      }
      zone.tick = 0.22;
    }
  }
  for (const zone of game.damageZones) {
    if (zone.life <= 0 && zone.explodeOnEnd) {
      game.delayedBlasts.push({
        x: zone.x,
        y: zone.y,
        r: zone.r * 0.78,
        delay: 0,
        damage: zone.damage * 2.2,
        source: zone.source || "sticky",
        color: zone.color || "#fff07a",
        text: "便签爆",
      });
      zone.explodeOnEnd = false;
    }
  }
  game.damageZones = game.damageZones.filter((zone) => zone.life > 0);
}

function updateDelayedBlasts(dt) {
  for (const blast of game.delayedBlasts) {
    blast.delay -= dt;
    if (blast.delay > 0) continue;
    for (const e of game.enemies) {
      if (Math.hypot(e.x - blast.x, e.y - blast.y) < e.r + blast.r) {
        applyEnemyDamage(e, blast.damage, blast.source || "generic");
        e.hitFlash = Math.max(e.hitFlash || 0, 0.12);
      }
    }
    floatingText(blast.x, blast.y - blast.r * 0.35, blast.text || "爆裂", blast.color || "#ffd15c");
    pulse(blast.x, blast.y, blast.r, blast.color || "#ffd15c");
    blast.done = true;
  }
  game.delayedBlasts = game.delayedBlasts.filter((blast) => !blast.done);
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

function updateProjectiles(dt) {
  for (const pr of game.projectiles) {
    pr.x += pr.vx * dt;
    pr.y += pr.vy * dt;
    pr.life -= dt;
    if (pr.x < 0 || pr.x > WORLD.w) {
      pr.vx *= -1;
      pr.pierce -= 0.5;
    }
    if (pr.y < 0 || pr.y > WORLD.h) {
      pr.vy *= -1;
      pr.pierce -= 0.5;
    }

    for (const e of game.enemies) {
      if (pr.pierce <= 0) break;
      if (pr.hitIds.has(e.id)) continue;
      if (Math.hypot(e.x - pr.x, e.y - pr.y) < e.r + pr.r) {
        pr.hitIds.add(e.id);
        applyEnemyDamage(e, pr.damage, pr.source || "projectile");
        e.hitFlash = 0.08;
        pr.pierce -= 1;
        spark(pr.x, pr.y, pr.color);
      }
    }
  }
  game.projectiles = game.projectiles.filter((pr) => pr.life > 0 && pr.pierce > 0);
}

function updatePickups(dt) {
  const p = game.player;
  for (const pickup of game.pickups) {
    const dx = p.x - pickup.x;
    const dy = p.y - pickup.y;
    const dist = Math.hypot(dx, dy) || 1;
    const pickupRange = p.pickupRange + getClassBonus("pickupRange");
    if (dist < pickupRange) {
      const pull = 360 * dt * (1 - dist / (pickupRange + 20));
      pickup.x += (dx / dist) * pull;
      pickup.y += (dy / dist) * pull;
    }
    if (dist < p.r + pickup.r + 5) {
      collectPickup(pickup);
      pickup.collected = true;
    }
  }
  game.pickups = game.pickups.filter((pickup) => !pickup.collected);
}

function collectPickup(pickup) {
  if (pickup.kind === "heal") {
    const before = game.player.hp;
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + pickup.value);
    const healed = Math.round(game.player.hp - before);
    if (healed > 0) floatingText(game.player.x, game.player.y - 34, `+${healed}`, "#8fffa8");
    return;
  }

  if (pickup.kind === "material") {
    game.materials += pickup.value;
    floatingText(game.player.x, game.player.y - 34, `材料+${pickup.value}`, "#f4c95d");
    return;
  }

  if (pickup.kind === "stat") {
    pickup.stat.apply(game);
    floatingText(game.player.x, game.player.y - 34, `${pickup.stat.label}+${pickup.stat.amount}`, "#f4c95d");
    return;
  }

  gainXp(pickup.value);
}

function updateParticles(dt) {
  for (const part of game.particles) {
    part.x += part.vx * dt;
    part.y += part.vy * dt;
    part.life -= dt;
    part.age += dt;
  }
  game.particles = game.particles.filter((part) => part.life > 0);
}

function updateFloatingTexts(dt) {
  for (const text of game.floatingTexts) {
    text.y -= 34 * dt;
    text.life -= dt;
  }
  game.floatingTexts = game.floatingTexts.filter((text) => text.life > 0);
}

function spawnEnemies(dt) {
  if (game.enemiesToSpawn <= 0) return;
  const config = game.stageConfig;
  if (game.enemies.length >= config.maxConcurrent) return;

  game.spawnTimer -= dt;
  if (game.spawnTimer <= 0) {
    const capacity = Math.max(0, config.maxConcurrent - game.enemies.length);
    const count = Math.min(config.batchSize, capacity, game.enemiesToSpawn);
    for (let i = 0; i < count; i += 1) {
      const shouldElite =
        game.elitesToSpawn > 0 &&
        game.stageSpawned > config.totalEnemies * 0.35 &&
        (Math.random() < 0.18 || game.enemiesToSpawn <= game.elitesToSpawn + 2);
      spawnEnemy(shouldElite);
      if (shouldElite) game.elitesToSpawn -= 1;
      game.enemiesToSpawn -= 1;
      game.stageSpawned += 1;
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
  const stagePower = game.stage - 1;
  let type = pickEnemyType(config.enemyMix);
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
    enemy.r += boss ? 24 : 12;
    enemy.hp *= boss ? 2.6 : 4.2;
    enemy.speed *= boss ? 0.7 : 0.78;
    enemy.damage += boss ? 18 : 10;
    enemy.xp *= 5;
    enemy.materialValue *= 5;
    enemy.color = boss ? "#ff2a60" : "#ff6b6b";
  }

  game.enemies.push(enemy);
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
    speed: base.speed * config.speedMult,
    damage: base.damage * config.damageMult,
  };
}

function gainXp(amount) {
  game.xp += amount;
  while (game.xp >= game.xpNext) {
    game.xp -= game.xpNext;
    game.level += 1;
    game.xpNext = Math.floor(game.xpNext * 1.22 + 7);
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
  game.pendingStageEnd = reason;
  game.enemies = [];
  game.projectiles = [];
  game.damageZones = [];
  floatingText(game.player.x, game.player.y - 54, `资源回收 ${RECOVERY_SECONDS}s`, "#f4c95d");
  state = "recovery";
  lastTime = performance.now();
}

function updateStageRecovery(dt) {
  game.time += dt;
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

function openUpgrade(returnState = "playing") {
  state = "upgrade";
  game.upgradeReturnState = returnState;
  game.upgradeRerolls = 1;
  game.currentUpgradeChoices = pickUpgrades(4);
  renderUpgradeChoices();
  ui.upgradePanel.classList.remove("hidden");
  ui.upgradeRerollButton?.classList.toggle("hidden", false);
}

function renderUpgradeChoices() {
  ui.upgradeChoices.replaceChildren();
  for (const choice of game.currentUpgradeChoices) {
    const button = document.createElement("button");
    button.className = "choice";
    button.innerHTML = `
      <div class="card-head">
        <span class="offer-icon ${getEntryIconClass(choice)}"></span>
        <span class="tag">${choice.tag}</span>
      </div>
      <strong>${choice.title}</strong>
      <span>${choice.text}</span>
    `;
    button.addEventListener("click", () => chooseUpgrade(choice));
    ui.upgradeChoices.append(button);
  }
  if (ui.upgradeRerollCount) ui.upgradeRerollCount.textContent = game.upgradeRerolls;
  if (ui.upgradeRerollButton) ui.upgradeRerollButton.disabled = game.upgradeRerolls <= 0;
}

function chooseUpgrade(choice) {
  choice.apply(game);
  game.upgradesTaken += 1;
  checkWeaponEvolutions();
  ui.upgradePanel.classList.add("hidden");
  game.currentUpgradeChoices = [];
  game.upgradeRerolls = 0;
  markBuildHint();
  if (game.upgradeReturnState === "armory") {
    if (game.pendingLevelUps > 0) {
      game.pendingLevelUps -= 1;
      openUpgrade("armory");
    } else {
      openWeaponArmory();
    }
  } else {
    state = "playing";
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }
}

function rerollUpgradeChoices() {
  if (state !== "upgrade" || game.upgradeRerolls <= 0) return;
  game.upgradeRerolls -= 1;
  game.currentUpgradeChoices = pickUpgrades(4);
  renderUpgradeChoices();
}

function pickUpgrades(count) {
  const available = statUpgradePool.filter((upgrade) => upgrade.available(game));
  const choices = [];
  const aligned = available.filter(isUpgradeAlignedWithBuild);
  if (aligned.length) {
    shuffle(aligned);
    choices.push(aligned[0]);
  }
  const weighted = [];
  for (const upgrade of available) {
    if (choices.includes(upgrade)) continue;
    weighted.push(upgrade);
    if (isUpgradeAlignedWithBuild(upgrade)) weighted.push(upgrade, upgrade);
  }
  shuffle(weighted);
  for (const upgrade of weighted) {
    if (choices.length >= count) break;
    if (!choices.includes(upgrade)) choices.push(upgrade);
  }
  return choices;
}

function isUpgradeAlignedWithBuild(upgrade) {
  const counts = getWeaponClassCounts();
  const tag = upgrade.tag || "";
  if ((counts.precise || counts.ranged) && /暴击|射程|输出|爆发|武器专属/.test(tag)) return true;
  if ((counts.barrage || counts.close) && /攻速|闪避|爆发|武器专属/.test(tag)) return true;
  if ((counts.engineering || counts.support) && /幸运|拾取|经济|工程|布线|翻译|武器专属/.test(tag)) return true;
  if ((counts.field || counts.close) && /防御|恢复|站场|领域|生存|武器专属/.test(tag)) return true;
  return false;
}

function openWeaponArmory() {
  state = "armory";
  if (game.shopOffers.length === 0) {
    game.shopOffers = generateShopOffers(4, game.lockedShopOffers);
    game.lockedShopOffers = [];
  }
  renderShop();
  ui.armoryReason.textContent =
    `${game.lastClearReason === "clear" ? "清场过关" : "撑过时间"} · 击破 ${game.stageKills}/${game.stageConfig.totalEnemies} · 奖励 ${game.lastStageBonus}`;
  ui.weaponPanel.classList.remove("hidden");
  updateHud();
}

function renderShop() {
  ui.armoryMaterial.textContent = game.materials;
  ui.refreshCost.textContent = getRefreshCost();
  ui.weaponChoices.replaceChildren();
  renderArmoryBuildStrip();
  renderOfferPreview(null);
  for (let i = 0; i < game.shopOffers.length; i += 1) {
    const offer = game.shopOffers[i];
    const card = document.createElement("div");
    card.className = `choice shop-card ${offer.purchased ? "disabled-choice" : ""} ${offer.locked ? "locked-card" : ""}`;
    card.tabIndex = offer.purchased ? -1 : 0;

    const head = document.createElement("div");
    head.className = "card-head";

    const icon = document.createElement("span");
    icon.className = `offer-icon ${getEntryIconClass(offer.entry)}`;

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = formatEntryTag(offer.entry);
    head.append(icon, tag);

    const title = document.createElement("strong");
    title.textContent = offer.entry.title;

    const text = document.createElement("span");
    text.textContent = offer.entry.text;

    const compare = document.createElement("span");
    compare.className = "compare-line";
    compare.textContent = getOfferComparisonText(offer.entry);

    const cost = document.createElement("span");
    cost.className = "cost";
    cost.textContent = offer.purchased ? "已购买" : `材料 ${offer.cost}${offer.locked ? " · 保留到下次工坊" : ""}`;

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const buy = document.createElement("button");
    buy.className = "mini-button";
    buy.textContent = offer.purchased ? "已购" : "购买";
    buy.disabled = !canBuyShopOffer(offer);
    buy.addEventListener("click", () => buyShopOffer(i));

    const lock = document.createElement("button");
    lock.className = `mini-button ${offer.locked ? "locked" : ""}`;
    lock.textContent = offer.locked ? "保留" : "锁定";
    lock.disabled = offer.purchased;
    lock.addEventListener("click", () => toggleOfferLock(i));

    actions.append(buy, lock);
    card.addEventListener("mouseenter", () => renderOfferPreview(offer.entry));
    card.addEventListener("focusin", () => renderOfferPreview(offer.entry));
    card.addEventListener("mouseleave", () => renderOfferPreview(null));
    card.addEventListener("focusout", () => renderOfferPreview(null));
    card.append(head, title, text, compare, cost, actions);
    ui.weaponChoices.append(card);
  }

  const refreshCost = getRefreshCost();
  ui.refreshButton.disabled = game.materials < refreshCost;
  ui.material.textContent = game.materials;
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

function renderArmoryBuildStrip() {
  if (!ui.armoryBuildStrip) return;
  const counts = getWeaponClassCounts();
  const activeClasses = Object.entries(counts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([className, count]) => {
      const nextTier = (weaponClassBonuses[className] || []).find((tier) => tier.count > count);
      const nextText = nextTier ? ` · 差 ${nextTier.count - count} 件进阶` : "";
      return `<b>${weaponClassLabels[className] || className} x${count}</b>${nextText}`;
    });
  const chips = buildOrder.map((id) => {
    const weapon = game.weapons[id];
    const classes = (weapon.classes || []).map((className) => weaponClassLabels[className] || className).join("/");
    const stateClass = weapon.level > 0 ? "owned" : "empty";
    const sellButton = weapon.level > 0 && getOwnedWeaponCount() > 1
      ? `<button class="sell-weapon" type="button" data-sell-weapon="${id}">拆解 +${getWeaponSellValue(id)}</button>`
      : "";
    return `
      <div class="armory-weapon-chip ${stateClass}">
        <span class="offer-icon small ${getWeaponIconClass(id)}"></span>
        <span><strong>${weapon.label}</strong><em>Lv.${weapon.level}/${weapon.max} · ${classes}</em>${sellButton}</span>
      </div>
    `;
  }).join("");
  const classText = activeClasses.length ? activeClasses.slice(0, 4).join("　") : `武器槽 ${getOwnedWeaponCount()}/${game.weaponSlots}`;
  ui.armoryBuildStrip.innerHTML = `
    <div class="armory-class-line">${classText}</div>
    <div class="armory-weapon-grid">${chips}</div>
  `;
  ui.armoryBuildStrip.querySelectorAll("[data-sell-weapon]").forEach((button) => {
    button.addEventListener("click", () => sellWeapon(button.dataset.sellWeapon));
  });
  renderRouteMap(ui.armoryRouteMap, { compact: false });
}

function renderOfferPreview(entry) {
  if (!ui.offerPreview) return;
  if (!entry) {
    ui.offerPreview.classList.add("hidden");
    ui.offerPreview.classList.remove("active");
    ui.offerPreview.innerHTML = "";
    return;
  }
  ui.offerPreview.classList.remove("hidden");
  ui.offerPreview.classList.add("active");
  const weaponId = getUpgradeWeaponId(entry.id);
  if (!weaponId) {
    ui.offerPreview.innerHTML = `
      <strong>${entry.title} · ${getEntryRouteHint(entry)}</strong>
      <span>${entry.tag || "属性道具"} · ${entry.text}</span>
      <em>${getItemBuildHint(entry)}</em>
    `;
    return;
  }
  const weapon = game.weapons[weaponId];
  const classes = (weapon.classes || []).map((className) => weaponClassLabels[className] || className).join(" / ");
  ui.offerPreview.innerHTML = `
    <strong>${getEntryRouteHint(entry)} · ${weapon.label} Lv.${weapon.level}/${weapon.max} -> Lv.${Math.min(weapon.max, weapon.level + 1)}</strong>
    <span>${classes} · ${entry.text}</span>
    <em>${getWeaponEffectSummary(weaponId)}</em>
  `;
}

function getOfferComparisonText(entry) {
  const weaponId = getUpgradeWeaponId(entry.id);
  const routeHint = getEntryRouteHint(entry);
  if (!weaponId) return `${routeHint} · ${getItemBuildHint(entry)}`;
  const weapon = game.weapons[weaponId];
  if (weapon.level <= 0) {
    if (getOwnedWeaponCount() >= game.weaponSlots) return `武器槽已满 · 可先拆解已有武器`;
    return `${routeHint} · 新武器槽 ${getOwnedWeaponCount() + 1}/${game.weaponSlots} · ${weapon.archetype}`;
  }
  return `${routeHint} · 当前 Lv.${weapon.level}/${weapon.max} · ${getWeaponEffectSummary(weaponId)}`;
}

function getEntryRouteHint(entry) {
  const weaponId = getUpgradeWeaponId(entry.id);
  if (weaponId) {
    const routes = {
      coffee: "精准贯穿路线",
      marker: "精准贯穿路线",
      keyboard: "键盘风暴路线",
      stapler: "键盘风暴路线",
      headset: "会议结界路线",
      report: "会议结界路线",
      sticky: "工位雷网路线",
      calculator: "工位雷网路线",
    };
    const recommendation = {
      marker: "适合远程穿透和暴击",
      keyboard: "适合高攻速弹幕",
      headset: "适合防守站场",
      sticky: "适合陷阱控场",
    };
    const suffix = game.stage === 1 && game.weapons[weaponId].level <= 0 && recommendation[weaponId]
      ? ` · ${recommendation[weaponId]}`
      : "";
    return `${routes[weaponId] || game.weapons[weaponId].archetype}${suffix}`;
  }
  return (entry.tag || "道具").replace("道具 / ", "").replace("属性 / ", "");
}

function getWeaponEffectSummary(weaponId) {
  const weapon = game.weapons[weaponId];
  const precise = getWeaponStatScale("precise");
  const barrage = getWeaponStatScale("barrage");
  const engineering = getWeaponStatScale("engineering");
  const field = getWeaponStatScale("field");
  const data = {
    coffee: `高频穿透射线，射程/暴击收益 ${Math.round(precise * 100)}%`,
    marker: `周期穿透直线，精准体系收益 ${Math.round(precise * 100)}%`,
    keyboard: `弹幕数量随等级成长，攻速/闪避收益 ${Math.round(barrage * 100)}%`,
    stapler: `近距扇形爆发，弹幕体系收益 ${Math.round(barrage * 100)}%`,
    headset: `环形领域控场，护甲/恢复收益 ${Math.round(field * 100)}%`,
    report: `持续领域压制，生存体系收益 ${Math.round(field * 100)}%`,
    sticky: `陷阱留场，幸运/拾取收益 ${Math.round(engineering * 100)}%`,
    calculator: `连锁点杀，工程体系收益 ${Math.round(engineering * 100)}%`,
  };
  return weapon.level <= 0 ? `${weapon.archetype}，买入后解锁该武器。` : data[weaponId];
}

function getItemBuildHint(entry) {
  const tag = entry.tag || "";
  if (/暴击|输出|射程/.test(tag)) return "偏精准/远程，适合马克笔和咖啡射线。";
  if (/攻速|闪避|爆发/.test(tag)) return "偏弹幕/近距，适合键盘和订书机。";
  if (/经济|拾取|恢复|工程|布线|翻译/.test(tag)) return "偏工程/支援，适合计算器、便签和长线发育。";
  if (/酒|爆发/.test(tag)) return "偏高风险爆发，适合咖啡、订书机和想快速清场的打法。";
  if (/防御|生存|控制|站场|站桩|领域/.test(tag)) return "偏领域/生存，适合耳机和报告领域。";
  return "通用补强，但会挤压武器升级节奏。";
}

function generateShopOffers(count, existing = []) {
  if (game.stage === 1 && getOwnedWeaponCount() === 1 && existing.length === 0) {
    return ["marker", "keyboard", "headset", "sticky"]
      .map((id) => weaponUpgradePool.find((entry) => entry.id === id))
      .filter(Boolean)
      .map((entry) => {
        const shopEntry = { ...entry, shopType: "weapon" };
        return {
          entry: shopEntry,
          cost: Math.max(10, getShopOfferCost(shopEntry) - 6),
          locked: false,
          purchased: false,
        };
      })
      .slice(0, count);
  }
  const offers = [...existing];
  while (offers.length < count) {
    const weaponCount = offers.filter((offer) => offer.entry.shopType === "weapon").length;
    const entry = pickShopEntry(offers, weaponCount < 2 ? "weapon" : "mixed");
    if (!entry) break;
    offers.push({
      entry,
      cost: getShopOfferCost(entry),
      locked: false,
      purchased: false,
    });
  }
  return offers;
}

function pickShopEntry(existingOffers, preference = "mixed") {
  const existingIds = new Set(existingOffers.map((offer) => offer.entry.id));
  const available = weaponUpgradePool.filter((upgrade) => isWeaponShopUpgradeAvailable(upgrade));
  const itemAvailable = itemPool.filter((item) => !game.boughtItems.has(item.id));
  const weaponPool = available.map((entry) => ({ ...entry, shopType: "weapon" })).filter((entry) => !existingIds.has(entry.id));
  const itemShopPool = itemAvailable.map((entry) => ({ ...entry, shopType: "item" })).filter((entry) => !existingIds.has(entry.id));
  const focusedWeapons = weightedWeaponShopPool(weaponPool);
  const pool = preference === "weapon" && focusedWeapons.length > 0
    ? focusedWeapons
    : [
      ...focusedWeapons,
      ...itemShopPool,
      ...itemShopPool.filter((entry) => isItemAlignedWithBuild(entry)),
    ];
  if (pool.length === 0) return null;
  shuffle(pool);
  return pool[0];
}

function weightedWeaponShopPool(weaponPool) {
  const ownedWeapons = buildOrder.filter((id) => game.weapons[id].level > 0);
  const ownedClasses = new Set(ownedWeapons.flatMap((id) => game.weapons[id].classes || []));
  const topClass = getTopWeaponClass();
  const weighted = [];
  for (const entry of weaponPool) {
    const weaponId = getUpgradeWeaponId(entry.id);
    const classes = weaponId ? game.weapons[weaponId].classes || [] : [];
    weighted.push(entry);
    if (weaponId && game.weapons[weaponId].level > 0) weighted.push(entry, entry);
    if (classes.some((className) => ownedClasses.has(className))) weighted.push(entry, entry);
    if (topClass && classes.includes(topClass)) weighted.push(entry, entry);
  }
  return weighted;
}

function isItemAlignedWithBuild(entry) {
  const counts = getWeaponClassCounts();
  const tag = entry.tag || "";
  if ((counts.precise || counts.ranged) && /暴击|射程|输出|爆发/.test(tag)) return true;
  if ((counts.barrage || counts.close) && /攻速|闪避|爆发/.test(tag)) return true;
  if ((counts.engineering || counts.support) && /经济|拾取|恢复|控制|工程|布线|翻译/.test(tag)) return true;
  if ((counts.precise || counts.barrage) && /酒|爆发|暴击|输出/.test(tag)) return true;
  if ((counts.field || counts.close) && /防御|生存|控制|站场|站桩|领域|恢复/.test(tag)) return true;
  return false;
}

function isEntryAlignedWithBuild(entry) {
  const weaponId = getUpgradeWeaponId(entry.id);
  const topClass = getTopWeaponClass();
  if (weaponId && topClass) return (game.weapons[weaponId].classes || []).includes(topClass);
  if (entry.shopType === "item") return isItemAlignedWithBuild(entry);
  return false;
}

function isWeaponShopUpgradeAvailable(upgrade) {
  if (!upgrade.available(game)) return false;
  const weaponId = getUpgradeWeaponId(upgrade.id);
  if (!weaponId) return true;
  if (game.weapons[weaponId].level > 0) return true;
  return true;
}

function getOwnedWeaponCount() {
  return buildOrder.filter((id) => game.weapons[id].level > 0).length;
}

function getShopOfferCost(entry) {
  const aligned = isEntryAlignedWithBuild(entry);
  if (entry.shopType === "item") return Math.max(16, 18 + game.stage * 6 + game.boughtItems.size * 3 - (aligned ? 4 : 0));
  const weaponId = getUpgradeWeaponId(entry.id);
  const level = weaponId ? game.weapons[weaponId].level : 0;
  return Math.max(14, 16 + level * 10 + game.stage * 5 - (aligned ? 4 : 0));
}

function buyShopOffer(index) {
  const offer = game.shopOffers[index];
  if (!offer || !canBuyShopOffer(offer)) return;
  game.materials -= offer.cost;
  offer.entry.apply(game);
  if (offer.entry.shopType === "weapon") {
    game.weaponUpgradeCounts[offer.entry.id] = (game.weaponUpgradeCounts[offer.entry.id] || 0) + 1;
    syncWeaponDerivedStats();
    applyWeaponUpgradeModifiers();
    maybeShowFusionHint(getUpgradeWeaponId(offer.entry.id));
    checkWeaponEvolutions();
    markBuildHint();
  }
  offer.purchased = true;
  offer.locked = false;
  if (offer.entry.shopType === "item") {
    game.boughtItems.add(offer.entry.id);
    game.boughtItemNames.push(offer.entry.title);
    game.boughtItemTags.push(offer.entry.tag || "");
    checkWeaponEvolutions();
  }
  updateBuildHud();
  updateStatHud();
  updateItemHud();
  renderShop();
}

function canBuyShopOffer(offer) {
  if (!offer || offer.purchased || game.materials < offer.cost) return false;
  if (offer.entry.shopType !== "weapon") return true;
  const weaponId = getUpgradeWeaponId(offer.entry.id);
  if (!weaponId) return true;
  if (game.weapons[weaponId].level > 0) return true;
  return getOwnedWeaponCount() < game.weaponSlots;
}

function toggleOfferLock(index) {
  const offer = game.shopOffers[index];
  if (!offer || offer.purchased) return;
  offer.locked = !offer.locked;
  renderShop();
}

function sellWeapon(weaponId) {
  const weapon = game.weapons[weaponId];
  if (!weapon || weapon.level <= 0 || getOwnedWeaponCount() <= 1) return;
  game.materials += getWeaponSellValue(weaponId);
  weapon.level = 0;
  syncWeaponDerivedStats();
  if (game.weaponUpgradeCounts) {
    for (const id of Object.keys(game.weaponUpgradeCounts)) {
      if (getUpgradeWeaponId(id) === weaponId) delete game.weaponUpgradeCounts[id];
    }
  }
  applyWeaponUpgradeModifiers();
  game.shopOffers = game.shopOffers.filter((offer) => getUpgradeWeaponId(offer.entry.id) !== weaponId || offer.locked);
  updateHud();
  renderShop();
}

function getWeaponSellValue(weaponId) {
  const weapon = game.weapons[weaponId];
  if (!weapon) return 0;
  return Math.max(8, Math.round(8 + weapon.level * 7 + game.stage * 2));
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

  p.coffeeCooldown = 0.62 * Math.pow(0.92, Math.max(0, coffee - 1));
  p.coffeePierce = 1 + Math.floor(coffee / 3);
  p.keyboardShots = 3 + Math.max(0, keyboard - 1);
  p.keyboardLife = 0.85 + Math.floor(keyboard / 2) * 0.12;
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
}

function applyWeaponUpgradeModifiers() {
  const counts = game.weaponUpgradeCounts || {};
  const p = game.player;
  const n = (id) => counts[id] || 0;
  p.coffeeCooldown *= Math.pow(0.9, n("coffee")) * Math.pow(0.84, n("coffeeThermos"));
  p.coffeePierce += n("coffeePierce");
  p.keyboardShots += n("keyboard") + n("keyboardMacro") * 2;
  p.keyboardLife += n("keyboardBounce") * 0.22;
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
}

function rerollShop() {
  if (state !== "armory") return;
  const cost = getRefreshCost();
  if (game.materials < cost) return;
  game.materials -= cost;
  game.rerollCount += 1;
  const locked = game.shopOffers.filter((offer) => offer.locked && !offer.purchased);
  game.shopOffers = generateShopOffers(4, locked);
  renderShop();
}

function getRefreshCost() {
  return 7 + game.rerollCount * 4;
}

function getUpgradeWeaponId(id) {
  if (id.startsWith("coffee")) return "coffee";
  if (id.startsWith("keyboard")) return "keyboard";
  if (id.startsWith("headset")) return "headset";
  if (id.startsWith("report")) return "report";
  if (id.startsWith("stapler")) return "stapler";
  if (id.startsWith("sticky")) return "sticky";
  if (id.startsWith("marker")) return "marker";
  if (id.startsWith("calculator")) return "calculator";
  return null;
}

function gridIconClass(base, index) {
  return `${base} icon-c${index % SPRITE_GRID} icon-r${Math.floor(index / SPRITE_GRID)}`;
}

function uiIconClass(index) {
  return gridIconClass("ui-icon", index);
}

function assetIconClass(index) {
  return gridIconClass("asset-icon", index);
}

function getEntryIconClass(entry) {
  const weaponId = getUpgradeWeaponId(entry.id);
  if (weaponId) return getWeaponIconClass(weaponId);
  if (entry.shopType === "item") return getItemIconClass(entry.id);
  return getStatIconClass(entry.id);
}

function getWeaponIconClass(id) {
  const map = {
    coffee: 8,
    keyboard: 9,
    headset: 15,
    report: 14,
    stapler: 10,
    sticky: 11,
    marker: 12,
    calculator: 13,
  };
  return map[id] !== undefined ? assetIconClass(map[id]) : uiIconClass(12);
}

function getStatIconClass(idOrKey) {
  const normalized = {
    sprint: "speed",
    focus: "damageMult",
    attackSpeed: "attackSpeed",
    crit: "crit",
    range: "range",
    padding: "armor",
    dodge: "dodge",
    luck: "luck",
    regen: "regen",
    magnet: "pickupRange",
    overclock: "attackSpeed",
    glassBuild: "damageMult",
    compound: "luck",
    evasive: "dodge",
    fortifiedDesk: "fortify",
    quietField: "fortify",
    trapManual: "luck",
    shieldProtocol: "armor",
    glossary: "range",
    afterWorkDrink: "damageMult",
    bilingualMinutes: "range",
    wineTableReview: "crit",
    laserCalibration: "range",
    reportAuditTrail: "luck",
    noiseCancelFort: "fortify",
    paperOrbitDrill: "fortify",
    deskMinePermit: "pickupRange",
    contractLanguage: "range",
    socialDrinking: "crit",
  }[idOrKey] || idOrKey;
  const map = {
    maxHp: 0,
    armor: 1,
    dodge: 2,
    speed: 3,
    attackSpeed: 4,
    damageMult: 5,
    crit: 6,
    range: 7,
    luck: 8,
    pickupRange: 10,
    regen: 11,
    fortify: 1,
  };
  return uiIconClass(map[normalized] ?? 12);
}

function getItemIconClass(id) {
  const map = {
    lunchbox: 0,
    rubberSole: 3,
    luckyBadge: 8,
    oldHardDrive: 5,
    fileCabinet: 1,
    wirelessMouse: 4,
    energyDrink: 11,
    deskFan: 7,
    macroPad: 12,
    redPen: 6,
    projector: 7,
    laserPointer: 6,
    standingDesk: 3,
    assetLedger: 9,
    quietRoom: 1,
    redlineContract: 5,
    insuranceClause: 0,
    ergonomicMat: 1,
    whiteboardWall: 7,
    deskLamp: 11,
    cableNest: 10,
    liquorCoffee: 11,
    translationHeadset: 12,
    foreignContract: 9,
  };
  return uiIconClass(map[id] ?? 9);
}

function startNextStage() {
  game.stage += 1;
  game.stageConfig = getStageConfig(game.stage);
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

function nearestEnemy() {
  let best = null;
  let bestDist = Infinity;
  for (const e of game.enemies) {
    const dist = Math.hypot(e.x - game.player.x, e.y - game.player.y);
    if (dist < bestDist) {
      best = e;
      bestDist = dist;
    }
  }
  return best;
}

function cooldown(base) {
  return Math.max(0.18, base * (100 / (100 + Math.max(-60, game.player.attackSpeed + getClassBonus("attackSpeed")))));
}

function weaponCooldown(base, weaponId) {
  const attackSpeed = Math.max(-60, getEffectiveStat("attackSpeed"));
  const coefficients = {
    coffee: 0.78,
    keyboard: 1.1,
    stapler: 0.92,
    sticky: 0.42,
    marker: 1.25,
    calculator: 0.58,
    headset: 1.35,
    report: 0.7,
  };
  const coefficient = coefficients[weaponId] ?? 1;
  const floor = weaponId === "marker" ? 0.42 : weaponId === "coffee" ? 0.16 : 0.22;
  return Math.max(floor, base * (100 / (100 + attackSpeed * coefficient)));
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
  const evolved = pairReady && route.weapons.every((id) => game.weapons[id].level >= 4) && statScore >= 16;
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

function getRouteTier(routeId) {
  const route = routeDefinitions.find((entry) => entry.id === routeId);
  return route ? getRouteProgress(route).tier : 0;
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

function getClassBonus(key) {
  if (!game) return 0;
  const counts = getWeaponClassCounts();
  let total = 0;
  for (const [className, count] of Object.entries(counts)) {
    const tiers = weaponClassBonuses[className] || [];
    let active = null;
    for (const tier of tiers) {
      if (count >= tier.count) active = tier;
    }
    if (active && active[key]) total += active[key];
  }
  return total;
}

function getAuraRadius() {
  const anchor = getAnchorCharge();
  return game.player.auraRadius
    + getClassBonus("fieldRadius")
    + (hasWeaponPair("headset", "report", 2) ? 24 : 0)
    + Math.round(anchor * (18 + getEffectiveStat("fortify") * 1.8));
}

function getTrapRadiusBonus() {
  return Math.round(
    clamp(getEffectiveStat("luck"), 0, 240) * 0.32
    + Math.max(0, getEffectiveStat("pickupRange") - 150) * 0.08
    + getClassBonus("engineering") * 42
    + getAnchorCharge() * getEffectiveStat("fortify"),
  );
}

function getEngineeringUtility() {
  return clamp(getEffectiveStat("luck"), 0, 260) * 0.18
    + Math.max(0, getEffectiveStat("pickupRange") - 150) * 0.07
    + getClassBonus("engineering") * 38;
}

function getAnchorCharge() {
  if (!game) return 0;
  return clamp(game.player.anchorTime / getAnchorMaxTime(), 0, 1);
}

function getAnchorMaxTime() {
  return Math.max(1.35, 2.8 - getEffectiveStat("fortify") * 0.035);
}

function getAnchorDamageReduction() {
  const fortify = Math.max(0, getEffectiveStat("fortify"));
  return clamp(getAnchorCharge() * (0.1 + fortify * 0.011), 0, 0.42);
}

function rangeBonus(scale = 1) {
  return Math.max(-80, game.player.range + getClassBonus("range")) * scale;
}

function hitDamage(base) {
  const p = game.player;
  const crit = Math.random() < clamp(p.crit + getClassBonus("crit"), 0, 75) / 100;
  return base * getDamageMult() * (crit ? 1.85 : 1);
}

function continuousDamage(base) {
  const p = game.player;
  return base * getDamageMult() * (1 + clamp(p.crit + getClassBonus("crit"), 0, 75) * 0.006);
}

function getDamageMult() {
  return game.player.damageMult + getClassBonus("damageMult") + getBuildFocusDamageBonus();
}

function getBuildFocusDamageBonus() {
  const owned = getOwnedWeaponCount();
  if (owned < 3) return 0;
  const topCount = Math.max(0, ...Object.values(getWeaponClassCounts()));
  const late = game.stage >= 8;
  if (topCount >= 4) return late ? 0.2 : 0.14;
  if (topCount >= 3) return late ? 0.11 : 0.08;
  return 0;
}

function getMaterialMult() {
  return 1 + clamp(getEffectiveStat("luck"), 0, 260) * 0.0026;
}

function getEffectiveStat(key) {
  const p = game.player;
  const values = {
    attackSpeed: p.attackSpeed + getClassBonus("attackSpeed"),
    crit: p.crit + getClassBonus("crit"),
    range: p.range + getClassBonus("range"),
    dodge: p.dodge,
    armor: p.armor + getClassBonus("armor"),
    luck: p.luck + getClassBonus("luck"),
    pickupRange: p.pickupRange + getClassBonus("pickupRange"),
    regen: p.regen,
    fortify: p.fortify,
  };
  return values[key] || 0;
}

function getWeaponStatScale(kind) {
  if (kind === "precise") {
    return 1
      + clamp(getEffectiveStat("crit"), 0, 90) * 0.0025
      + Math.max(0, getEffectiveStat("range")) * 0.00115;
  }
  if (kind === "barrage") {
    return 1 + clamp(getEffectiveStat("attackSpeed"), 0, 180) * 0.0015 + clamp(getEffectiveStat("dodge"), 0, 60) * 0.002;
  }
  if (kind === "engineering") {
    return 1
      + clamp(getEffectiveStat("luck"), 0, 180) * 0.0018
      + Math.max(0, getEffectiveStat("pickupRange") - 150) * 0.0008
      + getClassBonus("engineering") * 0.55;
  }
  if (kind === "field") {
    return 1
      + Math.max(0, getEffectiveStat("armor")) * 0.018
      + Math.max(0, getEffectiveStat("regen")) * 0.024
      + Math.max(0, getEffectiveStat("fortify")) * 0.017
      + getAnchorCharge() * 0.34;
  }
  return 1;
}

function fireAt(target, speed, damage, color, pierce, radius, life = 1.25, source = "projectile") {
  const p = game.player;
  const angle = Math.atan2(target.y - p.y, target.x - p.x);
  spawnProjectile({
    x: p.x,
    y: p.y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: radius,
    life,
    damage,
    color,
    pierce,
    source,
  });
}

function spawnProjectile(projectile) {
  projectile.hitIds = new Set();
  game.projectiles.push(projectile);
}

function fireBeam(angle, length, width, damage, color, source = "beam") {
  const p = game.player;
  const ax = Math.cos(angle);
  const ay = Math.sin(angle);
  for (const e of game.enemies) {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const along = dx * ax + dy * ay;
    if (along < 0 || along > length) continue;
    const perp = Math.abs(dx * ay - dy * ax);
    if (perp < width + e.r) {
      applyEnemyDamage(e, damage, source);
      e.hitFlash = 0.08;
    }
  }
  game.particles.push({
    kind: "beam",
    x: p.x,
    y: p.y,
    angle,
    length,
    width,
    vx: 0,
    vy: 0,
    r: 1,
    age: 0,
    life: 0.14,
    maxLife: 0.14,
    color,
  });
}

function chainLightning(start, jumps, range, damage, source = "calculator") {
  let current = start;
  const hit = new Set();
  for (let i = 0; i < jumps && current; i += 1) {
    hit.add(current.id);
    applyEnemyDamage(current, damage * Math.pow(0.82, i), source);
    current.hitFlash = 0.1;
    spark(current.x, current.y, "#9ee37d");

    let next = null;
    let best = Infinity;
    for (const e of game.enemies) {
      if (hit.has(e.id)) continue;
      const dist = Math.hypot(e.x - current.x, e.y - current.y);
      if (dist < range && dist < best) {
        best = dist;
        next = e;
      }
    }
    if (next) {
      game.particles.push({
        kind: "line",
        x: current.x,
        y: current.y,
        x2: next.x,
        y2: next.y,
        vx: 0,
        vy: 0,
        r: 1,
        age: 0,
        life: 0.16,
        maxLife: 0.16,
        color: "#9ee37d",
      });
    }
    current = next;
  }
}

function getOrbiters() {
  const p = game.player;
  const list = [];
  const perimeter = hasWeaponPair("headset", "report", 2);
  const perimeterTier = getRouteTier("perimeter");
  const anchorCount = getAnchorCharge() > 0.86 ? Math.floor(getEffectiveStat("fortify") / 7) : 0;
  const count = p.orbitCount + (perimeter ? 1 : 0) + (perimeterTier >= 4 ? 2 : 0) + Math.min(3, anchorCount);
  const radius = p.orbitRadius + (perimeter ? 14 : 0) + (perimeterTier >= 4 ? 10 : 0) + getAnchorCharge() * 12;
  for (let i = 0; i < count; i += 1) {
    const angle = game.orbitAngle + (i / count) * TAU;
    list.push({
      x: p.x + Math.cos(angle) * radius,
      y: p.y + Math.sin(angle) * radius,
      r: perimeter ? 19 : 17,
    });
  }
  return list;
}

function endGame(won) {
  state = "result";
  ui.resultEyebrow.textContent = won ? "通关" : "本轮结束";
  ui.resultTitle.textContent = won ? "你完成了全部关卡" : "血量归零";
  ui.resultStats.textContent = `关卡 ${game.stage} / 等级 ${game.level} / 属性 ${game.upgradesTaken} / 材料 ${game.materials} / 击破 ${game.kills}`;
  ui.resultPanel.classList.remove("hidden");
}

function render() {
  if (!game) {
    drawMenuBackground();
    return;
  }

  const cam = game.camera;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFloor(cam);

  ctx.save();
  ctx.translate(-cam.x, -cam.y);
  drawPickups();
  drawDamageZones();
  drawAura();
  drawOrbiters();
  drawProjectiles();
  drawEnemies();
  drawParticles();
  drawPlayer();
  drawFloatingTexts();
  ctx.restore();
}

function drawMenuBackground() {
  const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grd.addColorStop(0, "#261456");
  grd.addColorStop(0.42, "#112642");
  grd.addColorStop(0.74, "#34123f");
  grd.addColorStop(1, "#07121d");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawRoomGlow(0, 0);
  drawNeonSkyline(0, 0);
  drawStaticOffice(0, 0);
}

function drawFloor(cam) {
  ctx.fillStyle = "#13202a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const stageTint = getStageTint();
  ctx.fillStyle = stageTint.fill;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawProceduralFloor(cam, stageTint);
  drawRoomGlow(cam.x, cam.y);

  drawStaticOffice(cam.x, cam.y);
}

function drawProceduralFloor(cam, stageTint) {
  const tile = 34;
  const startX = -(cam.x % tile) - tile;
  const startY = -(cam.y % tile) - tile;
  for (let x = startX; x < canvas.width + tile; x += tile) {
    for (let y = startY; y < canvas.height + tile; y += tile) {
      const wx = Math.floor((cam.x + x) / tile);
      const wy = Math.floor((cam.y + y) / tile);
      const seed = hashCell(wx, wy);
      const shade = seed > 0.72 ? "rgba(255, 240, 189, 0.018)" : seed < 0.18 ? "rgba(3, 5, 12, 0.18)" : "rgba(255,255,255,0.006)";
      pixelRect(x + (seed > 0.5 ? 2 : 0), y + (seed < 0.42 ? 2 : 0), tile - 2, tile - 2, shade);
      if (seed > 0.78) pixelRect(x + 7, y + 9, 11, 3, "rgba(141, 116, 255, 0.1)");
      if (seed > 0.9) pixelRect(x + 12, y + 17, 3, 12, "rgba(82, 255, 225, 0.15)");
      if (seed < 0.13) pixelRect(x + 20, y + 23, 13, 3, "rgba(82, 255, 225, 0.12)");
      if (seed > 0.64 && seed < 0.7) pixelRect(x + 5, y + 30, 24, 2, "rgba(255, 209, 92, 0.055)");
      if (seed > 0.49 && seed < 0.53) {
        pixelRect(x + 4, y + 5, 4, 4, "rgba(255, 255, 255, 0.035)");
        pixelRect(x + 24, y + 18, 5, 5, "rgba(141, 116, 255, 0.05)");
      }
    }
  }

  const lane = 330;
  const laneStartX = -(cam.x % lane);
  const laneStartY = -(cam.y % lane);
  for (let x = laneStartX; x < canvas.width; x += lane) {
    pixelRect(x - 2, 0, 4, canvas.height, "rgba(82, 255, 225, 0.035)");
    pixelRect(x + 22, 0, 3, canvas.height, "rgba(141, 116, 255, 0.026)");
  }
  for (let y = laneStartY; y < canvas.height; y += lane) {
    pixelRect(0, y - 2, canvas.width, 4, "rgba(255, 209, 92, 0.035)");
    pixelRect(0, y + 22, canvas.width, 3, "rgba(110, 168, 255, 0.03)");
  }

  const stripe = 420;
  const stripeStartX = -(cam.x % stripe) - stripe;
  const stripeStartY = -(cam.y % stripe) - stripe;
  for (let x = stripeStartX; x < canvas.width + stripe; x += stripe) {
    for (let y = stripeStartY; y < canvas.height + stripe; y += stripe) {
      const seed = hashCell(Math.floor((cam.x + x) / stripe) + 41, Math.floor((cam.y + y) / stripe) + 23);
      if (seed < 0.46) continue;
      const sx = x + 90 + (seed * 70) % 80;
      const sy = y + 78 + (seed * 113) % 90;
      for (let i = 0; i < 5; i += 1) {
        pixelRect(sx + i * 18, sy + i * 10, 22, 5, i % 2 ? "rgba(82, 255, 225, 0.18)" : "rgba(141, 116, 255, 0.11)");
      }
      pixelRect(sx - 8, sy - 9, 128, 2, "rgba(255,255,255,0.035)");
      pixelRect(sx + 4, sy + 58, 88, 2, "rgba(255, 209, 92, 0.08)");
    }
  }

  const rug = 260;
  const rugStartX = -(cam.x % rug) - rug;
  const rugStartY = -(cam.y % rug) - rug;
  for (let x = rugStartX; x < canvas.width + rug; x += rug) {
    for (let y = rugStartY; y < canvas.height + rug; y += rug) {
      const wx = Math.floor((cam.x + x) / rug);
      const wy = Math.floor((cam.y + y) / rug);
      const seed = hashCell(wx + 13, wy - 9);
      if (seed > 0.72) {
        drawHandPaintedPatch(x + 58, y + 54, 124, 78, seed);
      }
    }
  }

  ctx.fillStyle = stageTint.grid;
  for (let i = 0; i < 44; i += 1) {
    const seed = hashCell(i, Math.floor(cam.x / 200) + Math.floor(cam.y / 200));
    const x = (seed * 1949) % canvas.width;
    const y = (hashCell(i + 17, Math.floor(cam.y / 160)) * 911) % canvas.height;
    const color = seed > 0.66 ? "rgba(141, 116, 255, 0.075)" : seed > 0.36 ? "rgba(82, 255, 225, 0.11)" : "rgba(255, 209, 92, 0.09)";
    pixelRect(x, y, 2 + seed * 16, seed > 0.5 ? 3 : 2, color);
  }
}

function getStageTint() {
  const danger = game && game.stage >= 7;
  const boss = game && game.stage >= game.maxStage;
  if (boss) return { fill: "rgba(255, 42, 96, 0.07)", grid: "rgba(255, 90, 122, 0.035)" };
  if (danger) return { fill: "rgba(255, 150, 58, 0.04)", grid: "rgba(255, 209, 92, 0.028)" };
  return { fill: "rgba(82, 255, 225, 0.018)", grid: "rgba(82, 255, 225, 0.022)" };
}

function drawRoomGlow(camX, camY) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const anchors = [
    { x: canvas.width * 0.22 - (camX * 0.02) % 140, y: canvas.height * 0.28, color: "rgba(82, 255, 225, 0.055)", r: 260 },
    { x: canvas.width * 0.74 + (camY * 0.015) % 120, y: canvas.height * 0.38, color: "rgba(141, 116, 255, 0.035)", r: 300 },
    { x: canvas.width * 0.5, y: canvas.height * 0.72, color: "rgba(255, 209, 92, 0.035)", r: 240 },
  ];
  for (const light of anchors) {
    const grad = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.r);
    grad.addColorStop(0, light.color);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(light.x, light.y, light.r, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawNeonSkyline(camX, camY) {
  ctx.save();
  ctx.globalAlpha = 0.42;
  const horizon = Math.round(canvas.height * 0.18);
  for (let i = 0; i < 18; i += 1) {
    const seed = hashCell(i, 91);
    const w = 34 + seed * 44;
    const h = 42 + hashCell(i, 92) * 96;
    const x = (i * 86 - (camX * 0.12)) % (canvas.width + 120) - 60;
    const y = horizon - h * 0.2 + hashCell(i, 93) * 16;
    pixelRect(x, y, w, h, "rgba(9, 10, 31, 0.74)");
    pixelRect(x + 4, y + 8, w - 8, 3, seed > 0.5 ? "rgba(82, 255, 225, 0.46)" : "rgba(82, 255, 225, 0.5)");
    for (let j = 0; j < 4; j += 1) {
      pixelRect(x + 8 + j * 10, y + 20 + (j % 2) * 11, 5, 5, "rgba(255, 209, 92, 0.42)");
    }
  }
  ctx.restore();
}

function drawHandPaintedPatch(x, y, w, h, seed) {
  const palette = seed > 0.86
    ? ["rgba(28, 35, 65, 0.62)", "rgba(141, 116, 255, 0.12)", "rgba(82, 255, 225, 0.12)"]
    : ["rgba(13, 86, 92, 0.48)", "rgba(82, 255, 225, 0.18)", "rgba(255, 209, 92, 0.11)"];
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(Math.round(x + 8), Math.round(y));
  ctx.lineTo(Math.round(x + w - 10), Math.round(y + 5));
  ctx.lineTo(Math.round(x + w), Math.round(y + h - 12));
  ctx.lineTo(Math.round(x + 12), Math.round(y + h));
  ctx.lineTo(Math.round(x), Math.round(y + 14));
  ctx.closePath();
  ctx.fillStyle = "rgba(5, 8, 17, 0.46)";
  ctx.fill();
  ctx.translate(0, -3);
  ctx.fillStyle = palette[0];
  ctx.fill();
  pixelRect(x + 12, y + 12, w - 24, 5, palette[1]);
  pixelRect(x + 18, y + h - 16, w * 0.54, 4, palette[2]);
  for (let i = 0; i < 5; i += 1) {
    pixelRect(x + 22 + i * 18, y + 25 + (i % 2) * 12, 8, 3, "rgba(255,255,255,0.055)");
  }
  ctx.restore();
}

function drawStaticOffice(camX, camY) {
  const cellW = 360;
  const cellH = 240;
  const startX = Math.max(0, Math.floor((camX - cellW) / cellW));
  const endX = Math.ceil((camX + canvas.width + cellW) / cellW);
  const startY = Math.max(0, Math.floor((camY - cellH) / cellH));
  const endY = Math.ceil((camY + canvas.height + cellH) / cellH);

  for (let gx = startX; gx <= endX; gx += 1) {
    for (let gy = startY; gy <= endY; gy += 1) {
      const seed = hashCell(gx, gy);
      if (seed < 0.24) continue;
      const x = gx * cellW + 34 + ((seed * 997) % 84);
      const y = gy * cellH + 28 + ((seed * 619) % 62);
      const w = 112 + ((seed * 211) % 96);
      const h = 58 + ((seed * 157) % 32);
      if (x > WORLD.w - w || y > WORLD.h - h) continue;

      const sx = x - camX;
      const sy = y - camY;
      if (sx + w < -40 || sx > canvas.width + 40 || sy + h < -40 || sy > canvas.height + 40) continue;
      const variant = Math.floor(seed * 1000) % 5;
      if (variant === 0) drawOfficeDesk(sx, sy, w, h, seed);
      else if (variant === 1) drawServerRack(sx, sy, w, h, seed);
      else if (variant === 2) drawCoffeeCorner(sx, sy, w, h, seed);
      else if (variant === 3) drawMeetingTable(sx, sy, w, h, seed);
      else drawCableMess(sx, sy, w, h, seed);
      if (seed > 0.58) drawDeskClutter(sx, sy, w, h, seed);
      if (seed > 0.68) drawNeonOfficeAccent(sx, sy, w, h, seed);
      if (seed > 0.82) drawTinyStickerSign(sx + w * 0.5, sy - 12, seed);
      if (seed > 0.74 && seed < 0.86) drawCulturePoster(sx + w - 18, sy + 8, seed);
    }
  }
}

function hashCell(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function pixelRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawAtlasCell(index, cx, cy, w, h, options = {}) {
  return drawGridCell(spriteAtlas, spriteAtlasReady, index, cx, cy, w, h, options);
}

function drawPropCell(index, cx, cy, w, h, options = {}) {
  return drawGridCell(propsAtlas, propsAtlasReady, index, cx, cy, w, h, options);
}

function drawGridCell(atlas, ready, index, cx, cy, w, h, options = {}) {
  if (!ready || !atlas.naturalWidth || !atlas.naturalHeight) return false;
  const cellW = atlas.naturalWidth / SPRITE_GRID;
  const cellH = atlas.naturalHeight / SPRITE_GRID;
  const inset = options.inset ?? Math.max(8, Math.floor(Math.min(cellW, cellH) * 0.035));
  const sx = (index % SPRITE_GRID) * cellW + inset;
  const sy = Math.floor(index / SPRITE_GRID) * cellH + inset;
  const sw = cellW - inset * 2;
  const sh = cellH - inset * 2;
  ctx.save();
  ctx.translate(Math.round(cx), Math.round(cy));
  if (options.alpha !== undefined) ctx.globalAlpha *= options.alpha;
  if (options.rotation) ctx.rotate(options.rotation);
  if (options.flipX) ctx.scale(-1, 1);
  if (options.ground) {
    ctx.fillStyle = options.ground;
    ctx.beginPath();
    ctx.ellipse(0, h * 0.28, w * 0.34, h * 0.14, 0, 0, TAU);
    ctx.fill();
  }
  if (options.glow) {
    ctx.shadowColor = options.glow;
    ctx.shadowBlur = options.glowBlur || 14;
  }
  ctx.drawImage(atlas, sx, sy, sw, sh, -w / 2, -h / 2, w, h);
  ctx.shadowBlur = 0;
  if (options.flash) {
    ctx.globalAlpha = 0.36;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(w, h) * 0.38, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
  return true;
}

function drawAtlasRect(index, x, y, w, h, options = {}) {
  return drawAtlasCell(index, x + w / 2, y + h / 2, w, h, options);
}

function drawOfficeDesk(x, y, w, h, seed) {
  if (drawPropCell(4, x + w / 2, y + h / 2 - 4, Math.max(122, w * 0.88), Math.max(84, h * 1.35), { alpha: 0.95, ground: "rgba(4,8,13,0.35)", glow: "rgba(141, 116, 255, 0.12)" })) return;
  if (drawAtlasRect(15, x - 18, y - 44, Math.max(132, w + 36), Math.max(112, h + 60), { alpha: 0.9 })) return;
  pixelRect(x - 3, y + 5, w + 8, h + 5, "rgba(20, 9, 32, 0.7)");
  pixelRect(x, y, w, h, "rgba(219, 177, 110, 0.2)");
  pixelRect(x + 8, y + h - 10, w - 16, 8, "rgba(0, 0, 0, 0.18)");
  pixelRect(x + 16, y + 14, 48, 34, "rgba(66, 215, 184, 0.22)");
  pixelRect(x + 22, y + 20, 36, 20, "rgba(13, 30, 35, 0.58)");
  pixelRect(x + 28, y + 43, 24, 4, "rgba(66, 215, 184, 0.24)");
  pixelRect(x + w - 58, y + 18, 34, 42, "rgba(244, 240, 232, 0.14)");
  pixelRect(x + w - 52, y + 26, 22, 3, "rgba(244, 201, 93, 0.28)");
  pixelRect(x + w - 52, y + 35, 17, 3, "rgba(244, 201, 93, 0.2)");
  if (seed > 0.72) pixelRect(x + w - 88, y + 21, 18, 16, "rgba(255, 107, 107, 0.22)");
}

function drawServerRack(x, y, w, h, seed) {
  if (drawPropCell(5, x + w / 2, y + h / 2, 88, 104, { alpha: 0.96, ground: "rgba(4,8,13,0.35)", glow: "rgba(82, 255, 225, 0.32)" })) return;
  pixelRect(x + 8, y + 4, w - 16, h + 18, "rgba(9, 13, 19, 0.32)");
  const rackW = Math.min(82, w - 28);
  pixelRect(x + 18, y - 8, rackW, h + 22, "rgba(85, 101, 119, 0.28)");
  pixelRect(x + 24, y - 2, rackW - 12, h + 10, "rgba(15, 22, 30, 0.74)");
  for (let i = 0; i < 5; i += 1) {
    const yy = y + 6 + i * 13;
    pixelRect(x + 30, yy, rackW - 24, 5, "rgba(110, 168, 255, 0.18)");
    pixelRect(x + rackW - 8, yy + 1, 4, 4, i % 2 === 0 ? "rgba(66, 215, 184, 0.54)" : "rgba(244, 201, 93, 0.48)");
  }
  pixelRect(x + rackW + 28, y + 18, Math.max(26, w - rackW - 54), 16, "rgba(255, 107, 107, 0.13)");
  if (seed > 0.75) pixelRect(x + rackW + 34, y + 23, 28, 5, "rgba(255, 107, 107, 0.24)");
}

function drawCoffeeCorner(x, y, w, h, seed) {
  if (drawPropCell(seed > 0.68 ? 8 : 6, x + w / 2, y + h / 2, 96, 96, { alpha: 0.96, ground: "rgba(4,8,13,0.3)", glow: "rgba(255, 209, 92, 0.24)" })) return;
  pixelRect(x + 4, y + 12, w - 8, h - 8, "rgba(93, 72, 49, 0.24)");
  pixelRect(x + 18, y, 44, 58, "rgba(44, 57, 62, 0.72)");
  pixelRect(x + 25, y + 8, 30, 18, "rgba(66, 215, 184, 0.22)");
  pixelRect(x + 31, y + 31, 18, 16, "rgba(244, 201, 93, 0.26)");
  pixelRect(x + 78, y + 17, 24, 31, "rgba(255, 240, 122, 0.2)");
  pixelRect(x + 83, y + 12, 14, 8, "rgba(244, 240, 232, 0.18)");
  if (seed > 0.66) pixelRect(x + w - 44, y + 20, 18, 24, "rgba(66, 215, 184, 0.18)");
}

function drawMeetingTable(x, y, w, h, seed) {
  if (drawPropCell(seed > 0.62 ? 3 : 2, x + w / 2, y + h / 2, Math.max(108, w * 0.9), 84, { alpha: 0.88, ground: "rgba(4,8,13,0.24)", glow: "rgba(141, 116, 255, 0.12)" })) return;
  pixelRect(x + 8, y + 8, w - 16, h - 4, "rgba(58, 78, 94, 0.24)");
  pixelRect(x + 18, y + 18, w - 36, h - 28, "rgba(177, 134, 74, 0.24)");
  pixelRect(x + 28, y + 25, 30, 16, "rgba(244, 240, 232, 0.13)");
  pixelRect(x + w - 63, y + 25, 34, 16, "rgba(244, 240, 232, 0.13)");
  pixelRect(x + w / 2 - 18, y + 21, 36, 24, "rgba(110, 168, 255, 0.16)");
  if (seed > 0.6) pixelRect(x + w / 2 - 10, y + 29, 20, 5, "rgba(110, 168, 255, 0.26)");
}

function drawCableMess(x, y, w, h, seed) {
  const propIndex = seed > 0.82 ? 15 : seed > 0.7 ? 10 : seed > 0.58 ? 13 : 11;
  if (drawPropCell(propIndex, x + w / 2, y + h / 2, 82, 82, { alpha: 0.94, ground: "rgba(4,8,13,0.25)", glow: "rgba(82, 255, 225, 0.2)" })) return;
  pixelRect(x + 12, y + h - 16, w - 24, 10, "rgba(0, 0, 0, 0.16)");
  ctx.strokeStyle = "rgba(66, 215, 184, 0.2)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(Math.round(x + 12), Math.round(y + 30));
  ctx.lineTo(Math.round(x + w * 0.34), Math.round(y + 56));
  ctx.lineTo(Math.round(x + w * 0.62), Math.round(y + 34));
  ctx.lineTo(Math.round(x + w - 18), Math.round(y + 58));
  ctx.stroke();
  pixelRect(x + 26, y + 18, 30, 22, "rgba(244, 201, 93, 0.18)");
  pixelRect(x + 32, y + 24, 18, 5, "rgba(244, 201, 93, 0.3)");
  pixelRect(x + w - 60, y + 26, 36, 28, "rgba(244, 240, 232, 0.1)");
  if (seed > 0.74) pixelRect(x + w - 54, y + 32, 24, 4, "rgba(255, 107, 107, 0.2)");
}

function drawNeonOfficeAccent(x, y, w, h, seed) {
  const color = seed > 0.9 ? "rgba(255, 90, 122, 0.32)" : seed > 0.84 ? "rgba(155, 108, 255, 0.28)" : "rgba(82, 255, 225, 0.28)";
  pixelRect(x - 8, y + h + 10, w * 0.72, 4, "rgba(13, 5, 24, 0.66)");
  pixelRect(x - 6, y + h + 10, w * 0.7, 3, color);
  pixelRect(x - 4, y + h + 15, w * 0.36, 3, "rgba(255, 209, 92, 0.2)");
  if (seed > 0.88) {
    pixelRect(x + w - 23, y - 25, 50, 23, "rgba(13, 5, 24, 0.82)");
    pixelRect(x + w - 19, y - 21, 42, 4, color);
    pixelRect(x + w - 19, y - 12, 28, 4, "rgba(255, 240, 189, 0.24)");
  }
}

function drawDeskClutter(x, y, w, h, seed) {
  const count = 2 + Math.floor(seed * 4);
  for (let i = 0; i < count; i += 1) {
    const s = hashCell(Math.floor(seed * 1000) + i, i + 19);
    const px = x + 16 + (s * Math.max(30, w - 46));
    const py = y + 10 + (hashCell(i + 7, seed * 37) * Math.max(24, h - 26));
    const type = Math.floor(s * 5);
    if (type === 0) {
      pixelRect(px - 7, py - 5, 18, 13, "rgba(20, 8, 29, 0.78)");
      pixelRect(px - 5, py - 3, 14, 8, "rgba(82, 255, 225, 0.32)");
      pixelRect(px - 2, py + 7, 8, 3, "rgba(255, 209, 92, 0.22)");
    } else if (type === 1) {
      pixelRect(px - 5, py - 7, 12, 16, "rgba(255, 240, 189, 0.22)");
      pixelRect(px - 3, py - 4, 8, 2, "rgba(141, 116, 255, 0.12)");
      pixelRect(px - 3, py + 2, 7, 2, "rgba(82, 255, 225, 0.2)");
    } else if (type === 2) {
      pixelRect(px - 7, py - 6, 14, 12, "rgba(255, 209, 92, 0.26)");
      pixelRect(px - 3, py - 2, 6, 3, "rgba(13, 5, 24, 0.55)");
    } else if (type === 3) {
      ctx.strokeStyle = "rgba(141, 116, 255, 0.11)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px - 11, py - 3);
      ctx.lineTo(px, py + 7);
      ctx.lineTo(px + 13, py - 2);
      ctx.stroke();
    } else {
      pixelRect(px - 8, py - 8, 16, 16, "rgba(82, 255, 225, 0.18)");
      pixelRect(px - 4, py - 4, 8, 8, "rgba(141, 116, 255, 0.1)");
    }
  }
}

function drawTinyStickerSign(x, y, seed) {
  const w = 54 + (seed * 23) % 22;
  const h = 20;
  pixelRect(x - w / 2 - 3, y - 3, w + 6, h + 6, "rgba(13, 5, 24, 0.78)");
  pixelRect(x - w / 2, y, w, h, seed > 0.9 ? "rgba(141, 116, 255, 0.14)" : "rgba(82, 255, 225, 0.22)");
  pixelRect(x - w / 2 + 5, y + 5, w - 10, 4, "rgba(255, 240, 189, 0.34)");
  pixelRect(x - w / 2 + 9, y + 13, w * 0.42, 3, "rgba(13, 5, 24, 0.46)");
}

function drawCulturePoster(x, y, seed) {
  const wine = seed > 0.8;
  const w = wine ? 62 : 72;
  const h = 34;
  pixelRect(x - w, y - 6, w + 7, h + 9, "rgba(5, 7, 15, 0.68)");
  pixelRect(x - w + 3, y - 3, w, h, wine ? "rgba(80, 25, 36, 0.56)" : "rgba(17, 70, 82, 0.52)");
  pixelRect(x - w + 9, y + 3, w - 18, 4, wine ? "rgba(255, 209, 92, 0.34)" : "rgba(82, 255, 225, 0.34)");
  pixelRect(x - w + 12, y + 13, w * 0.5, 3, "rgba(255, 240, 189, 0.24)");
  pixelRect(x - w + 12, y + 21, w * 0.36, 3, "rgba(255, 240, 189, 0.18)");
  ctx.save();
  ctx.font = "900 9px ui-sans-serif, system-ui";
  ctx.textBaseline = "top";
  ctx.fillStyle = wine ? "rgba(255, 209, 92, 0.74)" : "rgba(82, 255, 225, 0.74)";
  ctx.fillText(wine ? "WINE" : "LANG", Math.round(x - w + 38), Math.round(y + 18));
  ctx.restore();
}

function drawPixelWorker(x, y, time, player) {
  if (drawAtlasCell(0, x, y - 7, 60, 60, { flipX: player && player.facingX < -0.3, ground: "rgba(4, 8, 13, 0.62)", glow: "rgba(82, 255, 225, 0.34)", glowBlur: 10 })) return;
  const bob = Math.round(Math.sin(time * 8) * 1);
  const side = player && Math.abs(player.facingX) > 0.56;
  const back = player && player.facingY < -0.46 && !side;
  const dir = player && player.facingX < 0 ? -1 : 1;
  pixelRect(x - 16, y + 13 + bob, 32, 6, "rgba(7, 4, 18, 0.48)");
  pixelRect(x - 12, y + 13 + bob, 24, 5, "rgba(0,0,0,0.25)");
  pixelRect(x - 12, y - 24 + bob, 24, 43, "#12091d");
  pixelRect(x - 10, y - 21 + bob, 20, 9, "#f4d7b6");
  pixelRect(x - 13, y - 13 + bob, 26, 8, "#f4f0e8");
  pixelRect(x - 16, y - 5 + bob, 32, 20, "#4169a8");
  pixelRect(x - 16, y + 7 + bob, 32, 5, "#2d4b7f");
  pixelRect(x - 10, y + 15 + bob, 8, 11, "#253556");
  pixelRect(x + 2, y + 15 + bob, 8, 11, "#253556");
  pixelRect(x - 20, y - 2 + bob, 6, 16, "#f4d7b6");
  pixelRect(x + 14, y - 2 + bob, 6, 16, "#f4d7b6");
  pixelRect(x - 9, y - 10 + bob, 18, 11, "#c35cff");
  pixelRect(x - 7, y - 8 + bob, 14, 8, "#52ffe1");
  pixelRect(x - 3, y - 4 + bob, 6, 2, back ? "#42d7b8" : "#14282c");
  pixelRect(x - 9, y - 24 + bob, 18, 5, "#2b2522");
  if (side) {
    pixelRect(x + dir * 7 - (dir < 0 ? 4 : 0), y - 17 + bob, 4, 4, "#211b21");
    pixelRect(x + dir * 14 - (dir < 0 ? 18 : 0), y - 1 + bob, 9, 8, "#f4f0e8");
    pixelRect(x + dir * 18 - (dir < 0 ? 18 : 0), y + 3 + bob, 8, 3, "#42d7b8");
  } else if (!back) {
    pixelRect(x - 6, y - 17 + bob, 3, 3, "#211b21");
    pixelRect(x + 3, y - 17 + bob, 3, 3, "#211b21");
  } else {
    pixelRect(x - 8, y - 24 + bob, 16, 8, "#2b2522");
  }
  pixelRect(x + 6, y - 1 + bob, 5, 5, "#ffd15c");
  pixelRect(x - 17, y - 8 + bob, 4, 13, "#c35cff");
  pixelRect(x + 13, y - 8 + bob, 4, 13, "#52ffe1");
}

function drawPixelEnemy(e) {
  const flash = e.hitFlash > 0;
  const base = flash ? "#ffffff" : e.color;
  const dark = flash ? "#d9f6ff" : shadeColor(e.color, -34);
  const s = e.elite ? 1.45 : e.r > 18 ? 1.2 : 1;
  const x = e.x;
  const y = e.y;
  if (e.charging > 0 || e.type === "boss" || (e.type === "manager" && e.specialTimer < 1.1)) {
    const pulseSize = 8 + Math.sin(game.time * 14) * 4;
    ctx.save();
    ctx.strokeStyle = e.type === "boss" ? "rgba(255, 42, 96, 0.86)" : "rgba(255, 209, 92, 0.78)";
    ctx.lineWidth = e.type === "boss" ? 4 : 3;
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.arc(x, y, e.r + pulseSize + (e.type === "boss" ? 16 : 8), 0, TAU);
    ctx.stroke();
    ctx.restore();
  }
  if (e.type === "meeting" || e.type === "manager" || e.type === "boss") {
    ctx.fillStyle = "rgba(110, 168, 255, 0.07)";
    ctx.beginPath();
    ctx.arc(x, y, e.type === "boss" ? 210 : e.type === "manager" ? 142 : 118, 0, TAU);
    ctx.fill();
  }
  const atlasEnemy = { bug: 1, change: 2, meeting: 3, deadline: 4 }[e.type];
  if (atlasEnemy !== undefined) {
    const drawSize = e.r * (e.type === "meeting" ? 4.1 : 3.8);
    if (drawAtlasCell(atlasEnemy, x, y - e.r * 0.2, drawSize * 0.94, drawSize * 0.94, { flash, ground: "rgba(4, 8, 13, 0.55)", glow: e.elite ? "rgba(255, 209, 92, 0.34)" : "rgba(82, 255, 225, 0.13)", glowBlur: e.elite ? 18 : 8 })) {
      drawOfficeEnemyDetail(e, x, y, s);
      return;
    }
  }
  pixelRect(x - 16 * s, y + 11 * s, 32 * s, 6 * s, "rgba(7, 4, 18, 0.5)");
  pixelRect(x - 20 * s, y - 18 * s, 40 * s, 39 * s, "#15071f");
  if (e.type === "deadline") {
    pixelRect(x - 10 * s, y - 18 * s, 20 * s, 8 * s, dark);
    pixelRect(x - 18 * s, y - 10 * s, 36 * s, 26 * s, base);
    pixelRect(x - 4 * s, y - 25 * s, 8 * s, 8 * s, "#ff6b6b");
    pixelRect(x - 11 * s, y + 1 * s, 22 * s, 5 * s, "#fff07a");
    pixelRect(x - 2 * s, y - 20 * s, 4 * s, 10 * s, "#fff07a");
    if (e.charging > 0) {
      ctx.strokeStyle = "#f4c95d";
      ctx.lineWidth = 3;
      ctx.strokeRect(Math.round(x - 23 * s), Math.round(y - 18 * s), Math.round(46 * s), Math.round(42 * s));
    }
  } else if (e.type === "meeting") {
    pixelRect(x - 18 * s, y - 15 * s, 36 * s, 10 * s, dark);
    pixelRect(x - 22 * s, y - 5 * s, 44 * s, 25 * s, base);
    pixelRect(x - 14 * s, y + 2 * s, 28 * s, 5 * s, "#d9ecff");
    pixelRect(x - 6 * s, y - 23 * s, 12 * s, 8 * s, "#f4f0e8");
    pixelRect(x - 2 * s, y - 21 * s, 4 * s, 4 * s, "#6ea8ff");
  } else if (e.type === "change") {
    pixelRect(x - 7 * s, y - 25 * s, 14 * s, 12 * s, "#f4f0e8");
    pixelRect(x - 4 * s, y - 20 * s, 8 * s, 2 * s, "#d99cff");
    pixelRect(x - 12 * s, y - 16 * s, 24 * s, 9 * s, dark);
    pixelRect(x - 17 * s, y - 7 * s, 34 * s, 20 * s, base);
    pixelRect(x - 21 * s, y + 1 * s, 8 * s, 8 * s, base);
    pixelRect(x + 13 * s, y - 8 * s, 8 * s, 8 * s, base);
  } else if (e.type === "alarm") {
    pixelRect(x - 18 * s, y - 12 * s, 36 * s, 27 * s, base);
    pixelRect(x - 8 * s, y - 26 * s, 16 * s, 12 * s, "#ffdf8a");
    pixelRect(x - 18 * s, y - 20 * s, 8 * s, 9 * s, dark);
    pixelRect(x + 10 * s, y - 20 * s, 8 * s, 9 * s, dark);
    pixelRect(x - 10 * s, y - 2 * s, 20 * s, 5 * s, "#100719");
  } else if (e.type === "intern") {
    pixelRect(x - 12 * s, y - 22 * s, 24 * s, 12 * s, "#fff1cf");
    pixelRect(x - 18 * s, y - 9 * s, 36 * s, 25 * s, base);
    pixelRect(x - 21 * s, y + 4 * s, 9 * s, 7 * s, "#6ea8ff");
    pixelRect(x + 12 * s, y - 10 * s, 9 * s, 7 * s, "#ffd15c");
  } else if (e.type === "audit") {
    pixelRect(x - 20 * s, y - 18 * s, 40 * s, 35 * s, "#e8f8ff");
    pixelRect(x - 16 * s, y - 13 * s, 32 * s, 27 * s, base);
    pixelRect(x - 11 * s, y - 7 * s, 22 * s, 3 * s, "#100719");
    pixelRect(x - 11 * s, y + 2 * s, 16 * s, 3 * s, "#100719");
  } else if (e.type === "manager" || e.type === "boss") {
    const scale = e.type === "boss" ? 1.25 : 1;
    pixelRect(x - 20 * s * scale, y - 28 * s * scale, 40 * s * scale, 16 * s * scale, "#211b21");
    pixelRect(x - 24 * s * scale, y - 12 * s * scale, 48 * s * scale, 36 * s * scale, base);
    pixelRect(x - 16 * s * scale, y - 2 * s * scale, 32 * s * scale, 5 * s * scale, "#fff1cf");
    pixelRect(x - 26 * s * scale, y + 9 * s * scale, 52 * s * scale, 7 * s * scale, "#100719");
  } else {
    pixelRect(x - 13 * s, y - 14 * s, 26 * s, 10 * s, dark);
    pixelRect(x - 17 * s, y - 4 * s, 34 * s, 22 * s, base);
    pixelRect(x - 10 * s, y - 11 * s, 20 * s, 22 * s, base);
    pixelRect(x - 22 * s, y + 4 * s, 6 * s, 5 * s, dark);
    pixelRect(x + 16 * s, y + 4 * s, 6 * s, 5 * s, dark);
    pixelRect(x - 13 * s, y - 19 * s, 4 * s, 7 * s, dark);
    pixelRect(x + 9 * s, y - 19 * s, 4 * s, 7 * s, dark);
  }
  pixelRect(x - 7 * s, y - 5 * s, 4 * s, 4 * s, "#211b21");
  pixelRect(x + 3 * s, y - 5 * s, 4 * s, 4 * s, "#211b21");
  if (e.r > 18) {
    pixelRect(x - 12 * s, y + 4 * s, 24 * s, 4 * s, "rgba(0,0,0,0.18)");
  }
}

function drawOfficeEnemyDetail(e, x, y, s) {
  if (e.type === "bug") {
    pixelRect(x - 14 * s, y - 22 * s, 28 * s, 7 * s, "rgba(16, 7, 25, 0.78)");
    pixelRect(x - 10 * s, y - 20 * s, 7 * s, 3 * s, "rgba(255, 90, 122, 0.82)");
    pixelRect(x + 2 * s, y - 20 * s, 7 * s, 3 * s, "rgba(255, 90, 122, 0.82)");
  } else if (e.type === "change") {
    pixelRect(x - 16 * s, y - 26 * s, 32 * s, 18 * s, "rgba(255, 241, 207, 0.82)");
    pixelRect(x - 11 * s, y - 21 * s, 20 * s, 3 * s, "rgba(141, 116, 255, 0.46)");
    pixelRect(x - 11 * s, y - 14 * s, 14 * s, 3 * s, "rgba(82, 255, 225, 0.5)");
  } else if (e.type === "meeting") {
    pixelRect(x - 24 * s, y - 31 * s, 48 * s, 18 * s, "rgba(16, 7, 25, 0.86)");
    pixelRect(x - 18 * s, y - 26 * s, 36 * s, 4 * s, "rgba(82, 255, 225, 0.55)");
    pixelRect(x - 10 * s, y - 19 * s, 20 * s, 3 * s, "rgba(255, 209, 92, 0.42)");
  } else if (e.type === "deadline") {
    const blink = Math.sin(game.time * 12 + e.id) > 0 ? "rgba(255, 42, 96, 0.95)" : "rgba(255, 209, 92, 0.75)";
    pixelRect(x - 6 * s, y - 33 * s, 12 * s, 10 * s, blink);
    pixelRect(x - 18 * s, y - 20 * s, 36 * s, 5 * s, "rgba(16, 7, 25, 0.82)");
  } else if (e.type === "alarm") {
    const blink = Math.sin(game.time * 14 + e.id) > 0 ? "rgba(255, 90, 122, 0.96)" : "rgba(82, 255, 225, 0.54)";
    pixelRect(x - 20 * s, y - 30 * s, 40 * s, 8 * s, blink);
    pixelRect(x - 12 * s, y - 18 * s, 24 * s, 4 * s, "rgba(16, 7, 25, 0.88)");
  } else if (e.type === "intern") {
    pixelRect(x - 18 * s, y - 30 * s, 36 * s, 14 * s, "rgba(255, 241, 207, 0.86)");
    pixelRect(x - 13 * s, y - 25 * s, 26 * s, 3 * s, "rgba(98, 223, 180, 0.75)");
    pixelRect(x - 13 * s, y - 19 * s, 16 * s, 3 * s, "rgba(255, 209, 92, 0.65)");
  } else if (e.type === "audit") {
    pixelRect(x - 20 * s, y - 32 * s, 40 * s, 17 * s, "rgba(232, 248, 255, 0.9)");
    pixelRect(x - 15 * s, y - 27 * s, 30 * s, 3 * s, "rgba(16, 7, 25, 0.72)");
    if (e.shield > 0.24) {
      ctx.strokeStyle = "rgba(167, 220, 212, 0.55)";
      ctx.lineWidth = 2;
      ctx.strokeRect(Math.round(x - 25 * s), Math.round(y - 25 * s), Math.round(50 * s), Math.round(48 * s));
    }
  } else if (e.type === "manager" || e.type === "boss") {
    const scale = e.type === "boss" ? 1.2 : 1;
    pixelRect(x - 28 * s * scale, y - 40 * s * scale, 56 * s * scale, 18 * s * scale, "rgba(16, 7, 25, 0.9)");
    pixelRect(x - 20 * s * scale, y - 35 * s * scale, 40 * s * scale, 4 * s * scale, "rgba(255, 209, 92, 0.75)");
    pixelRect(x - 14 * s * scale, y - 28 * s * scale, 28 * s * scale, 3 * s * scale, "rgba(82, 255, 225, 0.42)");
  }
}

function drawPixelProjectile(pr) {
  const x = pr.x;
  const y = pr.y;
  const angle = Math.atan2(pr.vy, pr.vx);
  const spriteIndex = projectileSpriteIndex(pr.color);
  if (spriteIndex !== null && drawAtlasCell(spriteIndex, x, y, pr.r * 8.5, pr.r * 8.5, { rotation: angle })) return;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(angle);
  pixelRect(-pr.r * 4, -1, pr.r * 3, 2, "rgba(255, 255, 255, 0.18)");
  pixelRect(-pr.r * 2, -pr.r, pr.r * 4, pr.r * 2, pr.color);
  pixelRect(pr.r, -Math.max(1, pr.r - 2), pr.r, Math.max(2, pr.r), "#fff2c7");
  ctx.restore();
}

function projectileSpriteIndex(color) {
  if (color === "#f4c95d" || color === "#f7dda0") return 8;
  if (color === "#6ea8ff") return 9;
  if (color === "#d7d0c2") return 10;
  return null;
}

function shadeColor(hex, amount) {
  const raw = hex.replace("#", "");
  const num = Number.parseInt(raw, 16);
  const r = clamp((num >> 16) + amount, 0, 255);
  const g = clamp(((num >> 8) & 255) + amount, 0, 255);
  const b = clamp((num & 255) + amount, 0, 255);
  return `rgb(${r}, ${g}, ${b})`;
}

function drawPlayer() {
  const p = game.player;
  const aura = 28 + Math.sin(game.time * 5.6) * 3;
  ctx.save();
  ctx.globalAlpha = 0.76;
  ctx.strokeStyle = getAnchorCharge() > 0.55 ? "#ffd15c" : "#52ffe1";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(p.x, p.y + 2, aura, 0, TAU);
  ctx.stroke();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = getAnchorCharge() > 0.55 ? "#ffd15c" : "#52ffe1";
  ctx.beginPath();
  ctx.arc(p.x, p.y + 2, aura + 4, 0, TAU);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = p.invuln > 0 ? 0.62 + Math.sin(game.time * 34) * 0.22 : 1;
  drawPixelWorker(p.x, p.y, game.time, p);
  ctx.restore();
}

function drawEnemies() {
  for (const e of game.enemies) {
    drawPixelEnemy(e);
    if (e.elite) {
      ctx.strokeStyle = "#f4c95d";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r + 6, 0, TAU);
      ctx.stroke();
    }
  }
}

function drawProjectiles() {
  for (const pr of game.projectiles) {
    drawPixelProjectile(pr);
  }
}

function drawPickups() {
  for (const pickup of game.pickups) {
    const bob = Math.sin(game.time * 7 + pickup.x * 0.01) * 2;
    if (pickup.kind === "heal" && drawAtlasCell(7, pickup.x, pickup.y + bob, 36, 36)) continue;
    if (pickup.kind === "material" && drawAtlasCell(5, pickup.x, pickup.y + bob, 32, 32)) continue;
    if (pickup.kind === "stat" && drawAtlasCell(13, pickup.x, pickup.y + bob, 34, 34)) continue;
    if (pickup.kind === "xp" && drawAtlasCell(6, pickup.x, pickup.y + bob, 28, 34)) continue;
    if (pickup.kind === "heal") {
      pixelRect(pickup.x - 8, pickup.y - 8 + bob, 16, 16, "#f4f0e8");
      pixelRect(pickup.x - 3, pickup.y - 6 + bob, 6, 12, "#ff6b6b");
      pixelRect(pickup.x - 6, pickup.y - 3 + bob, 12, 6, "#ff6b6b");
    } else if (pickup.kind === "material") {
      pixelRect(pickup.x - 7, pickup.y - 6 + bob, 14, 12, "#9f7425");
      pixelRect(pickup.x - 4, pickup.y - 9 + bob, 8, 18, "#f4c95d");
      pixelRect(pickup.x - 2, pickup.y - 5 + bob, 4, 10, "#fff1a6");
    } else if (pickup.kind === "stat") {
      pixelRect(pickup.x - 7, pickup.y - 7 + bob, 14, 14, "#f4c95d");
      pixelRect(pickup.x - 4, pickup.y - 4 + bob, 8, 8, "#7b5d1c");
      pixelRect(pickup.x - 2, pickup.y - 2 + bob, 4, 4, "#ffeaa2");
    } else {
      pixelRect(pickup.x - 4, pickup.y - 7 + bob, 8, 4, "#87ffe9");
      pixelRect(pickup.x - 7, pickup.y - 3 + bob, 14, 8, "#42d7b8");
      pixelRect(pickup.x - 4, pickup.y + 5 + bob, 8, 4, "#1c8f7c");
      pixelRect(pickup.x - 2, pickup.y - 1 + bob, 4, 3, "#e9fff9");
    }
  }
}

function drawDamageZones() {
  for (const zone of game.damageZones) {
    const alpha = Math.max(0.08, zone.life / zone.maxLife * 0.22);
    ctx.fillStyle = `rgba(255, 240, 122, ${alpha})`;
    ctx.beginPath();
    ctx.arc(zone.x, zone.y, zone.r, 0, TAU);
    ctx.fill();
    if (drawAtlasCell(11, zone.x, zone.y, Math.min(96, zone.r * 1.65), Math.min(96, zone.r * 1.65), { alpha: 0.9 })) continue;
    pixelRect(zone.x - 15, zone.y - 10, 30, 20, "#c7b744");
    pixelRect(zone.x - 11, zone.y - 6, 22, 12, "#fff07a");
    pixelRect(zone.x - 8, zone.y - 2, 16, 3, "#8f8432");
  }
}

function drawFloatingTexts() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 15px ui-sans-serif, system-ui, sans-serif";
  for (const item of game.floatingTexts) {
    const alpha = Math.max(0, item.life / item.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(0, 0, 0, 0.58)";
    ctx.fillText(item.text, Math.round(item.x + 1), Math.round(item.y + 1));
    ctx.fillStyle = item.color;
    ctx.fillText(item.text, Math.round(item.x), Math.round(item.y));
  }
  ctx.restore();
}

function drawAura() {
  const p = game.player;
  if (game.weapons.headset.level <= 0) return;
  const radius = getAuraRadius();
  const anchor = getAnchorCharge();
  const alpha = 0.08 + Math.sin(game.time * 5) * 0.015;
  ctx.fillStyle = `rgba(66, 215, 184, ${alpha})`;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "rgba(66, 215, 184, 0.24)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, TAU);
  ctx.stroke();
  if (hasWeaponPair("headset", "report", 2)) {
    ctx.strokeStyle = "rgba(244, 201, 93, 0.2)";
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius + 15, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (anchor > 0.12) {
    ctx.save();
    ctx.globalAlpha = 0.25 + anchor * 0.28;
    ctx.strokeStyle = anchor > 0.85 ? "rgba(255, 209, 92, 0.72)" : "rgba(82, 255, 225, 0.48)";
    ctx.lineWidth = 2 + anchor * 2;
    const pad = 28 + anchor * 18;
    ctx.strokeRect(Math.round(p.x - pad), Math.round(p.y - pad * 0.72), Math.round(pad * 2), Math.round(pad * 1.44));
    ctx.globalAlpha = 0.12 + anchor * 0.18;
    ctx.fillStyle = "rgba(255, 209, 92, 0.35)";
    ctx.fillRect(Math.round(p.x - pad + 7), Math.round(p.y + pad * 0.45), Math.round(pad * 2 - 14), 4);
    ctx.restore();
  }
}

function drawOrbiters() {
  if (game.weapons.report.level <= 0) return;
  for (const orb of getOrbiters()) {
    if (drawAtlasCell(14, orb.x, orb.y, 54, 54, { rotation: game.orbitAngle })) continue;
    ctx.save();
    ctx.translate(orb.x, orb.y);
    ctx.rotate(game.orbitAngle);
    pixelRect(-16, -12, 32, 24, "#b95845");
    pixelRect(-12, -8, 24, 16, "#ff8f70");
    pixelRect(-8, -4, 16, 3, "#ffe0d2");
    pixelRect(-8, 3, 12, 3, "#ffd0bd");
    ctx.restore();
  }
}

function drawParticles() {
  for (const part of game.particles) {
    const t = Math.max(0, part.life / part.maxLife);
    ctx.globalAlpha = part.kind === "beam" ? Math.min(0.86, t) : Math.min(0.62, t * 0.78);
    if (part.kind === "beam") {
      ctx.save();
      ctx.translate(part.x, part.y);
      ctx.rotate(part.angle);
      pixelRect(0, -part.width / 2, part.length, part.width, part.color);
      pixelRect(0, -1, part.length, 2, "#fff6ff");
      if (spriteAtlasReady) {
        drawAtlasCell(12, part.length + 16, 0, 54, 54, { rotation: 0, alpha: 0.9 });
      }
      ctx.restore();
    } else if (part.kind === "line") {
      ctx.strokeStyle = part.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(part.x, part.y);
      ctx.lineTo(part.x2, part.y2);
      ctx.stroke();
      const midX = (part.x + part.x2) / 2;
      const midY = (part.y + part.y2) / 2;
      const angle = Math.atan2(part.y2 - part.y, part.x2 - part.x);
      drawAtlasCell(13, midX, midY, 44, 44, { rotation: angle, alpha: 0.76 });
    } else {
      ctx.fillStyle = part.color;
      ctx.beginPath();
      ctx.arc(part.x, part.y, part.r * (1 + part.age * 2), 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

function spark(x, y, color) {
  hitBurst(x, y, color, 3);
}

function floatingText(x, y, text, color) {
  game.floatingTexts.push({ x, y, text, color, life: 0.82, maxLife: 0.82 });
}

function pulse(x, y, radius, color) {
  for (let i = 0; i < 18; i += 1) {
    const angle = (i / 18) * TAU;
    game.particles.push({
      x: x + Math.cos(angle) * radius,
      y: y + Math.sin(angle) * radius,
      vx: Math.cos(angle) * 45,
      vy: Math.sin(angle) * 45,
      r: 3,
      age: 0,
      life: 0.5,
      maxLife: 0.5,
      color,
    });
  }
}

function hitBurst(x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * TAU;
    const speed = 40 + Math.random() * 130;
    const life = 0.24 + Math.random() * 0.34;
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 2 + Math.random() * 3,
      age: 0,
      life,
      maxLife: life,
      color,
    });
  }
}

function updateHud() {
  if (!game) return;
  const remaining = game.enemies.length + game.enemiesToSpawn;
  const timeText = state === "recovery"
    ? `${Math.max(0, Math.ceil(game.recoveryTime))}s`
    : formatTime(Math.max(0, game.stageConfig.duration - game.waveTime));
  if (state === "recovery") {
    ui.time.textContent = timeText;
    ui.stage.textContent = `${game.stage} 回收中`;
  } else {
    ui.time.textContent = timeText;
    ui.stage.textContent = `${game.stage} ${game.stageConfig.name}`;
  }
  updateObjectiveHud(timeText, remaining);
  ui.level.textContent = game.level;
  ui.kills.textContent = game.kills;
  ui.remaining.textContent = remaining;
  ui.skillCount.textContent = game.upgradesTaken;
  ui.material.textContent = game.materials;
  ui.hp.textContent = `${Math.max(0, Math.ceil(game.player.hp))} / ${game.player.maxHp}`;
  ui.hpFill.style.width = `${Math.max(0, Math.min(100, (game.player.hp / game.player.maxHp) * 100))}%`;
  ui.xp.style.width = `${Math.min(100, (game.xp / game.xpNext) * 100)}%`;
  updateBuildHud();
  updateStatHud();
  updateItemHud();
  updateGuideOverlay();
}

function updateGuideOverlay() {
  if (!ui.guideOverlay || !game) return;
  const show = state === "playing" && game.stage === 1 && game.waveTime < 10;
  ui.guideOverlay.classList.toggle("hidden", !show);
}

function updateObjectiveHud(timeText, remaining) {
  ui.objectiveStageMeta.textContent = state === "recovery" ? `第 ${game.stage} 关 · 资源回收` : `第 ${game.stage} 关`;
  ui.objectiveStageName.textContent = state === "recovery" ? "资源回收" : game.stageConfig.name;
  ui.objectiveTime.textContent = timeText;
  ui.objectiveRemaining.textContent = remaining;
  ui.objectiveKills.textContent = `${game.stageKills}/${game.stageConfig.totalEnemies}`;
  const alert = getObjectiveAlert(remaining);
  ui.objectiveAlert.textContent = alert.text;
  ui.objectiveAlert.classList.toggle("boss", alert.boss);
}

function getObjectiveAlert(remaining) {
  if (state === "recovery") return { text: "战斗结束，尽快拾取遗留材料和经验", boss: false };
  if (game.stage >= game.maxStage) return { text: "Boss 评审压场，保留爆发和移动空间", boss: true };
  if (game.waveTime < 7 && game.currentIncident) return { text: `${game.currentIncident.title}：${game.currentIncident.text}`, boss: game.currentIncident.id === "bossCheck" };
  const pressureHint = getBuildPressureHint();
  if (pressureHint) return { text: pressureHint, boss: false };
  if (game.stageConfig.eliteTotal > 0 && game.stageSpawned > game.stageConfig.totalEnemies * 0.35) {
    return { text: "精英即将入场，注意冲刺怪和会议减速", boss: true };
  }
  if (remaining <= Math.max(8, game.stageConfig.totalEnemies * 0.18)) return { text: "快清场了，追击剩余怪可拿更高奖励", boss: false };
  return { text: stageBriefs[Math.min(stageBriefs.length - 1, game.stage - 1)], boss: false };
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

function showStageBanner() {
  const isBoss = game.stage >= game.maxStage || game.stageConfig.eliteTotal >= 3;
  ui.stageBannerMeta.textContent = `第 ${game.stage} 关`;
  ui.stageBannerTitle.textContent = game.stageConfig.name;
  const incident = game.currentIncident ? `随机事件：${game.currentIncident.title}，${game.currentIncident.text}` : "";
  const threat = getStageThreatText();
  ui.stageBannerText.innerHTML = `
    <span>${stageBriefs[Math.min(stageBriefs.length - 1, game.stage - 1)]}</span>
    <em>${threat}</em>
    ${incident ? `<small>${incident}</small>` : ""}
  `;
  ui.stageBanner.classList.toggle("boss", isBoss);
  ui.stageBanner.classList.remove("hidden");
  window.clearTimeout(showStageBanner.timer);
  showStageBanner.timer = window.setTimeout(() => {
    ui.stageBanner.classList.add("hidden");
  }, isBoss ? 2600 : 1900);
}

function getStageThreatText() {
  const entries = Object.entries(game.stageConfig.enemyMix || {}).filter(([, weight]) => weight > 0.06);
  const labels = {
    bug: "Bug 虫",
    change: "需求变更",
    meeting: "会议怪",
    deadline: "Deadline 冲刺",
    intern: "实习生事故",
    alarm: "警报",
    audit: "审计",
    manager: "老板检查",
    boss: "终局总监",
  };
  const previous = game.stage > 1 ? getStageConfig(game.stage - 1).enemyMix : {};
  const newOnes = entries.filter(([type]) => !previous[type]).map(([type]) => labels[type] || type);
  const major = entries.sort((a, b) => b[1] - a[1]).slice(0, 3).map(([type]) => labels[type] || type);
  return newOnes.length ? `新威胁：${newOnes.join(" + ")}` : `本关压力：${major.join(" + ")}`;
}

function showBossArrival() {
  ui.stageBannerMeta.textContent = "终局评审";
  ui.stageBannerTitle.textContent = "总监亲自下场";
  ui.stageBannerText.textContent = "会议室灯全亮了。报表、激光笔和计算器会更容易打穿他的节奏。";
  ui.stageBanner.classList.add("boss");
  ui.stageBanner.classList.remove("hidden");
  window.clearTimeout(showStageBanner.timer);
  showStageBanner.timer = window.setTimeout(() => {
    ui.stageBanner.classList.add("hidden");
  }, 3600);
}

function updateBuildHud() {
  let topWeapon = null;
  for (const id of buildOrder) {
    const weapon = game.weapons[id];
    if (!topWeapon || weapon.level > topWeapon.level) topWeapon = weapon;
  }

  const owned = getOwnedWeaponCount();
  const summary = getBuildSummary(topWeapon, owned);
  const routeSignature = getRouteProgressList().map((route) => `${route.id}:${route.tier}:${route.score}`).join(",");
  const signature = `${summary}:${buildOrder.map((id) => game.weapons[id].level).join(",")}:${routeSignature}`;
  if (signature === buildHudSignature) return;
  buildHudSignature = signature;
  renderBuildHud(game.weapons, summary);
  renderRouteMap(ui.routeMap, { compact: true });
}

function getBuildSummary(topWeapon, owned) {
  const synergies = [];
  if (hasWeaponPair("coffee", "marker", 2)) synergies.push("贯穿");
  if (hasWeaponPair("keyboard", "stapler", 2)) synergies.push("弹幕");
  if (hasWeaponPair("headset", "report", 2)) synergies.push("领域");
  if (hasWeaponPair("sticky", "calculator", 2)) synergies.push("连锁");
  if (synergies.length) return `${synergies.slice(0, 2).join(" + ")} · ${owned}/${game.weaponSlots}`;
  const classSummary = getDominantClassSummary();
  if (classSummary) return `${classSummary} · ${owned}/${game.weaponSlots}`;
  return topWeapon && topWeapon.level > 0 ? `${topWeapon.label} Lv.${topWeapon.level} · ${owned}/${game.weaponSlots}` : `武器槽 ${owned}/${game.weaponSlots}`;
}

function getDominantClassSummary() {
  const entries = getSortedWeaponClasses();
  if (!entries.length || entries[0][1] < 2) return "";
  const [className, count] = entries[0];
  return `${weaponClassLabels[className] || className} x${count}`;
}

function getTopWeaponClass() {
  const entries = getSortedWeaponClasses();
  return entries.length && entries[0][1] >= 2 ? entries[0][0] : "";
}

function getSortedWeaponClasses() {
  return Object.entries(getWeaponClassCounts()).sort((a, b) => b[1] - a[1]);
}

function formatEntryTag(entry) {
  const weaponId = getUpgradeWeaponId(entry.id);
  if (!weaponId) return entry.tag;
  const labels = (game.weapons[weaponId].classes || []).map((className) => weaponClassLabels[className] || className);
  return labels.length ? `${entry.tag} · ${labels.join("/")}` : entry.tag;
}

function renderRouteMap(target) {
  if (!target || !game) return;
  target.innerHTML = "";
  target.classList.add("hidden");
}

function renderBuildHud(weapons, summary) {
  ui.buildSummary.textContent = summary;
  const weaponRows = buildOrder.map((id) => {
      const weapon = weapons[id];
      const row = document.createElement("div");
      row.className = "build-row";
      row.innerHTML = `
        <span class="build-dot ${getWeaponIconClass(id)}"></span>
        <span>${weapon.label}</span>
        <strong>Lv.${weapon.level}</strong>
      `;
      return row;
    });
  const resonanceRows = game ? getClassResonanceRows().map((entry) => {
    const row = document.createElement("div");
    row.className = "build-row resonance-row";
    row.innerHTML = `
      <span class="build-dot resonance-dot"></span>
      <span>${entry.label} ×${entry.count}</span>
      <strong>${entry.text}</strong>
    `;
    return row;
  }) : [];
  ui.buildList.replaceChildren(...weaponRows, ...resonanceRows);
}

function getClassResonanceRows() {
  const counts = getWeaponClassCounts();
  return Object.entries(counts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([className, count]) => {
      const tiers = weaponClassBonuses[className] || [];
      let active = null;
      for (const tier of tiers) {
        if (count >= tier.count) active = tier;
      }
      return {
        label: weaponClassLabels[className] || className,
        count,
        text: active ? formatClassBonus(active) : "待共鸣",
      };
    });
}

function formatClassBonus(tier) {
  const parts = [];
  if (tier.crit) parts.push(`暴击 +${tier.crit}%`);
  if (tier.damageMult) parts.push(`伤害 +${Math.round(tier.damageMult * 100)}%`);
  if (tier.range) parts.push(`射程 +${tier.range}`);
  if (tier.attackSpeed) parts.push(`攻速 +${tier.attackSpeed}%`);
  if (tier.projectileMult) parts.push(`弹量 +${tier.projectileMult}`);
  if (tier.fieldRadius) parts.push(`领域 +${tier.fieldRadius}`);
  if (tier.armor) parts.push(`护甲 +${tier.armor}`);
  if (tier.engineering) parts.push(`工程 +${Math.round(tier.engineering * 100)}%`);
  if (tier.chain) parts.push(`连锁 +${tier.chain}`);
  if (tier.pickupRange) parts.push(`拾取 +${tier.pickupRange}`);
  if (tier.luck) parts.push(`幸运 +${tier.luck}`);
  if (tier.pierce) parts.push(`贯穿 +${tier.pierce}`);
  return parts.slice(0, 2).join("，") || "共鸣中";
}

function updateStatHud() {
  const p = game.player;
  const values = {
    maxHp: Math.round(p.maxHp),
    armor: Math.round(p.armor + getClassBonus("armor")),
    dodge: `${Math.round(p.dodge)}%`,
    speed: Math.round(p.speed),
    attackSpeed: `${Math.round(p.attackSpeed + getClassBonus("attackSpeed"))}%`,
    damageMult: `${Math.round(getDamageMult() * 100)}%`,
    crit: `${Math.round(p.crit + getClassBonus("crit"))}%`,
    range: Math.round(p.range + getClassBonus("range")),
    luck: Math.round(p.luck + getClassBonus("luck")),
    pickupRange: Math.round(p.pickupRange + getClassBonus("pickupRange")),
    regen: `${Math.round(p.regen)}/s`,
    fortify: Math.round(p.fortify),
  };
  const signature = statLabels.map(({ key }) => values[key]).join(",");
  if (signature === statHudSignature) return;
  statHudSignature = signature;
  renderStatHud(values);
}

function updateItemHud() {
  const names = game.boughtItemNames;
  const signature = names.join("|");
  if (signature === itemHudSignature) return;
  itemHudSignature = signature;
  renderItemHud(names);
}

function renderItemHud(names) {
  ui.itemSummary.textContent = names.length;
  ui.itemList.replaceChildren(
    ...(names.length ? names.slice(-4).map((name) => {
      const pill = document.createElement("span");
      pill.className = "item-pill";
      pill.textContent = name;
      return pill;
    }) : [createEmptyItemPill()]),
  );
}

function createEmptyItemPill() {
  const pill = document.createElement("span");
  pill.className = "item-pill empty";
  pill.textContent = "暂无";
  return pill;
}

function renderStatHud(values) {
  ui.statList.replaceChildren(
    ...statLabels.map(({ key, label }) => {
      const row = document.createElement("div");
      row.className = "build-row stat-row";
      row.innerHTML = `
        <span class="build-dot stat-dot ${getStatIconClass(key)}"></span>
        <span>${label}</span>
        <strong>${values[key]}</strong>
      `;
      return row;
    }),
  );
}

function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "escape") {
    togglePause();
    return;
  }
  if (event.key.toLowerCase() === "b" || event.key.toLowerCase() === "tab") {
    if (game && state !== "menu") {
      event.preventDefault();
      toggleBuildPanel();
      return;
    }
  }
  keys.add(event.key.toLowerCase());
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

canvas.addEventListener("pointerdown", (event) => {
  pointer.active = true;
  updatePointerTarget(event);
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if (pointer.active) updatePointerTarget(event);
});

canvas.addEventListener("pointerup", (event) => {
  pointer.active = false;
  canvas.releasePointerCapture(event.pointerId);
});

canvas.addEventListener("pointercancel", () => {
  pointer.active = false;
});

function updatePointerTarget(event) {
  if (!game) return;
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width;
  const sy = canvas.height / rect.height;
  pointer.x = game.camera.x + (event.clientX - rect.left) * sx;
  pointer.y = game.camera.y + (event.clientY - rect.top) * sy;
}

function togglePause() {
  if (state === "paused") {
    resumeGame();
    return;
  }
  if (!["playing", "recovery", "armory", "upgrade"].includes(state)) return;
  pausedFromState = state;
  state = "paused";
  renderPauseSheet();
  ui.pausePanel.classList.remove("hidden");
}

function resumeGame() {
  if (state !== "paused") return;
  state = pausedFromState;
  ui.pausePanel.classList.add("hidden");
  lastTime = performance.now();
  if (state === "playing" || state === "recovery") requestAnimationFrame(loop);
}

function renderPauseSheet() {
  const values = getPauseStatValues();
  const weapons = buildOrder.map((id) => {
    const weapon = game.weapons[id];
    if (weapon.level <= 0) return "";
    return `<span><b>${weapon.label}</b> Lv.${weapon.level}/${weapon.max}</span>`;
  }).filter(Boolean).join("");
  const statRows = statLabels.map(({ key, label }) => `<span><b>${label}</b>${values[key]}</span>`).join("");
  const resonance = getClassResonanceRows().map((entry) => `<span><b>${entry.label} ×${entry.count}</b>${entry.text}</span>`).join("");
  const fusionNotes = game.fusionLog.length
    ? game.fusionLog.slice(-5).map((note) => `<span>${note}</span>`).join("")
    : "<span>武器 Lv.5 后会出现终局改造线索</span>";
  const items = game.boughtItemNames.length
    ? game.boughtItemNames.slice(-8).map((name) => `<span>${name}</span>`).join("")
    : "<span>暂无道具</span>";
  ui.pauseStats.innerHTML = `
    <div class="pause-meta">第 ${game.stage} 关 ${game.stageConfig.name} · 等级 ${game.level} · 材料 ${game.materials} · 击破 ${game.stageKills}/${game.stageConfig.totalEnemies}</div>
    <section><h3>武器</h3><div class="pause-chips">${weapons || "<span>初始装备</span>"}</div></section>
    <section><h3>职业共鸣</h3><div class="pause-stats">${resonance || "<span><b>暂无</b>同职业武器达到 2 个后激活</span>"}</div></section>
    <section><h3>终局线索</h3><div class="pause-chips">${fusionNotes}</div></section>
    <section><h3>属性</h3><div class="pause-stats">${statRows}</div></section>
    <section><h3>道具</h3><div class="pause-chips">${items}</div></section>
  `;
}

function getPauseStatValues() {
  const p = game.player;
  return {
    maxHp: Math.round(p.maxHp),
    armor: Math.round(p.armor + getClassBonus("armor")),
    dodge: `${Math.round(p.dodge)}%`,
    speed: Math.round(p.speed),
    attackSpeed: `${Math.round(p.attackSpeed + getClassBonus("attackSpeed"))}%`,
    damageMult: `${Math.round(getDamageMult() * 100)}%`,
    crit: `${Math.round(p.crit + getClassBonus("crit"))}%`,
    range: Math.round(p.range + getClassBonus("range")),
    luck: Math.round(p.luck + getClassBonus("luck")),
    pickupRange: Math.round(p.pickupRange + getClassBonus("pickupRange")),
    regen: `${Math.round(p.regen)}/s`,
    fortify: Math.round(p.fortify),
  };
}

function toggleBuildPanel() {
  const collapsed = ui.buildPanel.classList.toggle("collapsed");
  ui.buildToggle.textContent = collapsed ? "⚙" : "×";
  ui.buildToggle.classList.remove("attention");
}

function markBuildHint() {
  if (!ui.buildPanel || !ui.buildPanel.classList.contains("collapsed")) return;
  ui.buildToggle?.classList.add("attention");
}

ui.startButton.addEventListener("click", startGame);
ui.restartButton.addEventListener("click", startGame);
ui.continueButton.addEventListener("click", startNextStage);
ui.upgradeRerollButton?.addEventListener("click", rerollUpgradeChoices);
ui.refreshButton.addEventListener("click", rerollShop);
ui.pauseButton.addEventListener("click", togglePause);
ui.resumeButton.addEventListener("click", resumeGame);
ui.buildToggle.addEventListener("click", toggleBuildPanel);
ui.fusionNoticeClose?.addEventListener("click", () => ui.fusionNotice?.classList.add("hidden"));

decorateHudIcons();

renderBuildHud(weaponDefinitions, "咖啡 Lv.1 · 1/6");
renderStatHud({
  maxHp: 100,
  armor: 0,
  dodge: "0%",
  speed: 245,
  attackSpeed: "0%",
  damageMult: "100%",
  crit: "0%",
  range: 0,
  luck: 0,
  pickupRange: 150,
  regen: "0/s",
  fortify: 0,
});
renderItemHud([]);
drawMenuBackground();

function decorateHudIcons() {
  const hudIconIndexes = [15, 15, 12, 5, 15, 12, 9];
  document.querySelectorAll(".top-left .stat").forEach((stat, index) => {
    const icon = document.createElement("span");
    icon.className = `stat-icon ${uiIconClass(hudIconIndexes[index] ?? 12)}`;
    stat.prepend(icon);
  });
  const hpIcon = document.createElement("span");
  hpIcon.className = `stat-icon ${uiIconClass(0)}`;
  document.querySelector(".hp-stat")?.prepend(hpIcon);
}

