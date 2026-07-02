// 鈺斺晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晽
// 鈺? CUBICLE SURVIVOR REFORGED 鈥?宸ヤ綅骞稿瓨鑰?閲嶆瀯鐗?                     鈺?// 鈺?                                                                    鈺?// 鈺? 7-Layer Architecture (code sections below marked with 鈺愨晲鈺?banners): 鈺?// 鈺? 01 鏍稿績瑙勫垯 | 02 寮哄害棰勭畻 | 03 鎴愰暱鏇茬嚎 | 04 娴佹淳鏋舵瀯             鈺?// 鈺? 05 鍐呭瀹炵幇 | 06 琛ㄧ幇鍙嶉 | 07 娴嬭瘯璋冨弬                           鈺?// 鈺?                                                                    鈺?// 鈺? Key files: main.js (game logic) + styles.css + index.html          鈺?// 鈺氣晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨暆


// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
//  LAYER 01+02: CORE RULES & POWER BUDGET
//  甯搁噺路涓婇檺路鍏紡路棰勭畻杈圭晫路鎺夎惤瑙勫垯
// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
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
  weaponSelectPanel: document.querySelector("#weaponSelectPanel"),
  weaponSelectGrid: document.querySelector("#weaponSelectGrid"),
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
  perkPanel: document.querySelector("#perkPanel"),
  perkList: document.querySelector("#perkList"),
  perkPoints: document.querySelector("#perkPointsText"),
  perkShopButton: document.querySelector("#perkShopButton"),
  perkCloseButton: document.querySelector("#perkCloseButton"),
  startPerkButton: document.querySelector("#startPerkButton"),
  startEndlessButton: document.querySelector("#startEndlessButton"),
  itemReplacePanel: document.querySelector("#itemReplacePanel"),
  itemReplaceNew: document.querySelector("#itemReplaceNew"),
  itemReplaceList: document.querySelector("#itemReplaceList"),
  itemReplaceCount: document.querySelector("#itemReplaceCount"),
  itemConvertButton: document.querySelector("#itemConvertButton"),
  itemKeepButton: document.querySelector("#itemKeepButton"),
  pausePanel: document.querySelector("#pausePanel"),
  pauseStats: document.querySelector("#pauseStats"),
  pauseButton: document.querySelector("#pauseButton"),
  resumeButton: document.querySelector("#resumeButton"),
  restartFromPause: document.querySelector("#restartFromPause"),
  objectiveHud: document.querySelector(".objective-hud"),
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
  warmupOverlay: document.querySelector("#warmupOverlay"),
  warmupEmoji: document.querySelector("#warmupEmoji"),
  warmupTitle: document.querySelector("#warmupTitle"),
  warmupFill: document.querySelector("#warmupFill"),
  warmupTimer: document.querySelector("#warmupTimer"),
  warmupHint: document.querySelector("#warmupHint"),
  policyPanel: document.querySelector("#policyPanel"),
  policyChoices: document.querySelector("#policyChoices"),
  policySkip: document.querySelector("#policySkip"),
  bestOvertimeText: document.querySelector("#bestOvertimeText"),
  startButton: document.querySelector("#startButton"),
  restartButton: document.querySelector("#restartButton"),
  endlessButton: document.querySelector("#endlessButton"),
  continueButton: document.querySelector("#continueButton"),
  // Death recap & event UI
  deathRecap: document.querySelector("#deathRecap"),
  eventPanel: document.querySelector("#eventPanel"),
  eventTitle: document.querySelector("#eventTitle"),
  eventChoices: document.querySelector("#eventChoices"),
  eventSkipButton: document.querySelector("#eventSkipButton"),
  routeScanlines: document.querySelector("#routeScanlines"),
  lowHpVignette: document.querySelector("#lowHpVignette"),
  // v0.3 鏂癠I
  badgePanel: document.querySelector("#badgePanel"),
  badgeGrid: document.querySelector("#badgeGrid"),
  collabPanel: document.querySelector("#collabPanel"),
  collabDeptIcons: document.querySelector("#collabDeptIcons"),
  collabNarrative: document.querySelector("#collabNarrative"),
  collabRequirement: document.querySelector("#collabRequirement"),
  collabReward: document.querySelector("#collabReward"),
  collabActions: document.querySelector("#collabActions"),
  collabAccept: document.querySelector("#collabAccept"),
  collabDecline: document.querySelector("#collabDecline"),
  identityLayer: document.querySelector("#identityLayer"),
  identityText: document.querySelector("#identityText"),
  radarLayer: document.querySelector("#radarLayer"),
  radarChart: document.querySelector("#radarChart"),
  suggestionsLayer: document.querySelector("#suggestionsLayer"),
  suggestionList: document.querySelector("#suggestionList"),
};

const TAU = Math.PI * 2;
const WORLD = { w: 4800, h: 3000 };
const WAVE_SECONDS = 42;
const RECOVERY_SECONDS = 8;
const MAX_STAGE = 20;
const STAGE_ONE_WARMUP_SECONDS = 0;
const EMPLOYEE_POINTS_KEY = "cb_employee_points";
const EMPLOYEE_UPGRADES_KEY = "cb_employee_upgrades";
const DAMAGE_MULT_SOFT_CAP = 1.82;
const DAMAGE_MULT_HARD_CAP = 2.18;
const ATTACK_SPEED_SOFT_CAP = 62;
const ATTACK_SPEED_HARD_CAP = 92;
// Weapon-specific size/radius caps to prevent screen-filling AoE
const WSIZE_SOFT_FACTOR = 1.5;   // up to 1.5x base: full growth
const WSIZE_HARD_FACTOR = 2.5;   // absolute max 2.5x base
const WSIZE_TAIL = 0.30;         // growth rate beyond soft cap
const SPRITE_ATLAS_SRC = "assets/office-rogue-atlas.png";
const PROPS_ATLAS_SRC = "assets/office-rogue-props.png";
const UI_ATLAS_SRC = "assets/office-rogue-ui-icons.png";
const MARKER_VFX_ATLAS_SRC = "assets/marker-laser-vfx-spritesheet.png";
const MARKER_VFX_COLS = 8;
const MARKER_VFX_ROWS = 6;
const MARKER_VFX_ROW = {
  base: 0,
  split: 0,
  blast: 1,
  explosion: 1,
  rain: 2,
  strike: 2,
  wave: 3,
  ring: 3,
  grid: 4,
  shield: 5,
};
const SELECTION_PREVIEW_ROWS = 8;
const SELECTION_PREVIEW_ROW = {
  marker: 0,
  base: 0,
  split: 0,
  coffee: 1,
  chain: 1,
  heal: 1,
  keyboard: 2,
  scatter: 2,
  offense: 3,
  blast: 3,
  survival: 4,
  shield: 4,
  resource: 5,
  mechanic: 6,
  grid: 6,
  cost: 7,
  rain: 4,
  wave: 0,
};
const SPRITE_GRID = 4;
const keys = new Set();
const pointer = { active: false, x: 0, y: 0 };

let game = null;
let lastTime = 0;
let state = "menu";
let loopLastFrameAt = 0;
let loopKickQueued = false;
window.__cubicleDebug = function() {
  return {
    state,
    hasGame: !!game,
    stage: game?.stage || 0,
    waveTime: game?.waveTime || 0,
    time: game?.time || 0,
    enemies: game?.enemies?.length || 0,
    particles: game?.particles?.length || 0,
    markerVfx: game?.markerVfxEvents?.length || 0,
    loopLastFrameAgo: loopLastFrameAt ? Math.round(performance.now() - loopLastFrameAt) : null,
    loopKickQueued,
    activeWeapon: typeof getActiveWeaponId === "function" ? getActiveWeaponId() : "",
    activeForm: typeof getActiveWeaponForm === "function" ? getActiveWeaponForm()?.formId : "",
    errors: window._errors || [],
  };
};
function syncDebugStateNode() {
  let node = document.querySelector("#debugState");
  if (!node) {
    node = document.createElement("pre");
    node.id = "debugState";
    node.hidden = true;
    document.body.append(node);
  }
  node.textContent = JSON.stringify(window.__cubicleDebug());
}
let pausedFromState = "playing";
let enemyId = 1;
let swarmId = 1;
let buildHudSignature = "";
let statHudSignature = "";
let itemHudSignature = "";
let syncHudSignature = "";
let pendingPolicy = null;
let policySelectionOpen = false;

const SLOT_META = {
  offense: { icon: "火", name: "输出槽", plain: "输出", intent: "把这张卡变成清怪伤害", tradeoff: "最快看见清场变化" },
  survival: { icon: "盾", name: "生存槽", plain: "生存", intent: "把这张卡变成回血/护盾/容错", tradeoff: "少一点伤害，换更稳的续航" },
  resource: { icon: "材", name: "资源槽", plain: "资源", intent: "把这张卡变成经验/材料成长", tradeoff: "前期伤害慢一点，后面升级更快" },
  mechanic: { icon: "机", name: "机制槽", plain: "机制", intent: "强化这张卡的核心规则", tradeoff: "适合已经确定主形态时放大上限" },
  cost: { icon: "险", name: "代价槽", plain: "代价", intent: "用风险换更高倍率", tradeoff: "清怪更猛，但会带来扣血/停顿等代价" }
};

const routeLessons = {
  tech: {
    title: "技术部：连锁清场",
    coreMechanic: "连锁、分裂、冷却",
    openingCards: ["agile_dev", "version_iter"],
    firstCardId: "agile_dev",
    recommendedSlot: "offense",
    recommendedWeapons: ["coffee", "keyboard", "marker"],
    oneLineGoal: "用高频触发和分裂效果快速清小怪，靠走位把直线伤害拉满。",
    feedback: "敏捷开发放入输出槽：当前武器的触发频率和清怪能力会立刻提升。"
  },
  product: {
    title: "产品部：爆点击杀",
    coreMechanic: "爆炸、暴击、斩杀",
    openingCards: ["deadline", "emergency_launch"],
    firstCardId: "deadline",
    recommendedSlot: "offense",
    recommendedWeapons: ["marker", "coffee", "stapler"],
    oneLineGoal: "把单点伤害转成爆炸收益，先打穿精英，再用溅射清周围。",
    feedback: "Deadline 放入输出槽：单体命中会更容易变成爆点。"
  },
  ops: {
    title: "运营部：站场续航",
    coreMechanic: "护盾、回血、控场",
    openingCards: ["process_approval", "backup_recovery"],
    firstCardId: "process_approval",
    recommendedSlot: "survival",
    recommendedWeapons: ["headset", "thermos", "report"],
    oneLineGoal: "把攻击转成护盾和回血，稳住位置后让持续伤害磨掉怪群。",
    feedback: "流程审批放入生存槽：命中收益会转成更高容错。"
  },
  marketing: {
    title: "市场部：扩散覆盖",
    coreMechanic: "范围、吸附、扩散",
    openingCards: ["brand_impact", "channel_promotion"],
    firstCardId: "brand_impact",
    recommendedSlot: "offense",
    recommendedWeapons: ["report", "sticky", "calculator"],
    oneLineGoal: "把攻击变成更大的覆盖面积，适合处理一圈一圈压上来的敌人。",
    feedback: "品牌影响放入输出槽：范围和覆盖会明显扩大。"
  },
  general: {
    title: "行政部：规则控场",
    coreMechanic: "网格、资源、稳定控制",
    openingCards: ["morning_meeting", "standard_sop"],
    firstCardId: "standard_sop",
    recommendedSlot: "resource",
    recommendedWeapons: ["coffee", "thermos", "calculator"],
    oneLineGoal: "用规章网格限制怪物路线，同时把控场收益转成材料和升级节奏。",
    feedback: "SOP 放入资源槽：控场命中会更容易产出材料和经验。"
  }
};
window.CS.routeLessons = routeLessons;

const EFFECT_VOCAB = [
  { id: "chain", layer: "trigger", word: "连锁", picture: "命中后跳到旁边几个敌人", match: ["chain", "lightning", "network", "连锁", "跳电", "电流"] },
  { id: "pierce", layer: "carrier", word: "贯穿", picture: "一条线打穿一串敌人", match: ["pierce", "beam", "laser", "refactor", "marker", "贯穿", "光束", "激光"] },
  { id: "explode", layer: "payload", word: "爆炸", picture: "命中后炸开，溅到附近敌人", match: ["explode", "explosion", "burst", "blast", "aoe", "爆炸", "爆点", "范围"] },
  { id: "orbit", layer: "carrier", word: "环绕", picture: "围着你转，靠近就受伤", match: ["orbit", "aura", "field", "report", "headset", "环绕", "领域", "轨道"] },
  { id: "trap", layer: "carrier", word: "陷阱", picture: "放在地上，踩到触发", match: ["trap", "sticky", "zone", "便签", "陷阱", "地面", "残留"] },
  { id: "split", layer: "modifier", word: "分裂", picture: "一束攻击裂成几条支线", match: ["split", "fork", "clone", "分裂", "支线", "复制"] },
  { id: "scatter", layer: "carrier", word: "散射", picture: "朝多个方向打出弹幕", match: ["scatter", "barrage", "pellet", "shredder", "stapler", "keyboard", "弹幕", "散射", "碎片", "键帽"] },
  { id: "pull", layer: "utility", word: "吸附", picture: "把经验和材料吸过来", match: ["pickup", "vacuum", "pull", "magnet", "吸附", "拾取", "磁吸"] },
  { id: "slow", layer: "control", word: "减速", picture: "让敌人变慢，更容易拉开距离", match: ["slow", "freeze", "silent", "减速", "冻结", "静音"] },
  { id: "push", layer: "control", word: "击退", picture: "把贴脸敌人推开", match: ["knockback", "push", "击退", "推开", "弹开"] },
  { id: "heal", layer: "survival", word: "回血", picture: "周期恢复生命", match: ["heal", "regen", "lifesteal", "vamp", "回血", "恢复", "吸血", "续航"] },
  { id: "shield", layer: "survival", word: "护盾", picture: "先抵消一部分伤害", match: ["shield", "armor", "fortify", "护盾", "护甲", "站场"] },
  { id: "execute", layer: "payload", word: "斩杀", picture: "低血敌人更容易被收掉", match: ["execute", "deadline", "斩杀", "截止", "低血"] },
  { id: "crit", layer: "payload", word: "暴击", picture: "偶尔打出更高伤害", match: ["crit", "critical", "暴击"] },
  { id: "dot", layer: "payload", word: "持续伤害", picture: "命中后继续掉血", match: ["dot", "burn", "bleed", "poison", "viral", "dps", "灼烧", "流血", "中毒", "持续"] },
  { id: "refresh", layer: "modifier", word: "加速", picture: "冷却更短，攻击更密", match: ["cooldown", "cd_", "refresh", "speed", "attack_speed", "冷却", "攻速", "刷新", "加速"] },
  { id: "copy", layer: "modifier", word: "复制", picture: "额外复制一次攻击或效果", match: ["copy", "double", "share", "simul", "复制", "双倍", "共享"] },
  { id: "grow", layer: "modifier", word: "成长", picture: "越打越强，后面更猛", match: ["stack", "ramp", "growth", "level", "xp", "累积", "成长", "经验"] },
  { id: "sacrifice", layer: "cost", word: "代价", picture: "用风险换更高收益", match: ["gamble", "cost", "risk", "hp_cost", "self", "代价", "风险", "扣血"] }
];

const EFFECT_INFO_BY_ID = Object.fromEntries(EFFECT_VOCAB.map(info => [info.id, info]));

const WEAPON_EFFECT_PROFILES = {
  coffee: ["chain", "pierce", "refresh"],
  keyboard: ["scatter", "push", "explode"],
  marker: ["pierce", "crit"],
  stapler: ["scatter", "explode"],
  sticky_note: ["trap", "slow", "explode"],
  sticky: ["trap", "slow", "explode"],
  calculator: ["chain", "copy"],
  headphones: ["orbit", "slow", "shield"],
  headset: ["orbit", "slow", "shield"],
  report: ["orbit", "explode"],
  shredder: ["scatter", "dot"],
  thermos: ["heal", "shield", "slow"]
};

const START_WEAPON_CHOICES = ["marker", "thermos", "sticky_note", "coffee", "keyboard", "stapler", "headphones", "report", "shredder", "calculator"];

const weaponBadgeForms = {
  marker: {
    tech: {
      formId: "marker_tech_split",
      displayName: "多线程荧光笔",
      combatVerb: "主光束贯穿敌群，命中后分裂短支线",
      mechanicType: "line_split",
      triggerText: "主光束命中第 N 个敌人后生成支线",
      riskText: "支线伤害低；怪少时分裂收益不足",
      motifExtreme: "画线分裂",
      visualStyle: "split",
      bestMatch: true,
      baseParams: { cooldown: 0.9, damage: 0.9, width: 0.86, splitCount: 1, splitDamage: 0.42, splitRange: 220, resplitChance: 0.08, fullScreenLaserChance: 0.1, fullScreenLaserDamage: 0.62 },
      scalingHooks: ["分裂数量", "发射频率", "再次分裂概率"],
      ultimateHook: "10% 概率追加一次全屏扫线"
    },
    product: {
      formId: "marker_product_p0",
      displayName: "P0 标记笔",
      combatVerb: "给高血/精英挂 P0 标记，短窗口内再次命中触发光爆",
      mechanicType: "mark_detonate",
      triggerText: "首次命中高价值目标挂标记；窗口内再次命中引爆",
      riskText: "依赖集火；清小怪不如技术/市场",
      visualStyle: "blast",
      bestMatch: false,
      baseParams: { cooldown: 0.98, damage: 1.04, width: 0.9, markWindow: 2.4, blastRadius: 48, blastDamage: 0.9, promotedRadiusMult: 2.0, promotedDamageMult: 1.12 },
      scalingHooks: ["标记窗口", "爆炸半径", "单体伤害"],
      ultimateHook: "P0 光爆范围扩大一倍"
    },
    ops: {
      formId: "marker_ops_counter",
      displayName: "应急划线笔",
      combatVerb: "命中积攒应急盾，护盾破裂时反射短激光",
      mechanicType: "shield_counter_line",
      triggerText: "光束命中累计护盾值；护盾破裂触发反射",
      riskText: "主动输出偏弱；护盾未破时爆发感不足",
      visualStyle: "shield",
      bestMatch: false,
      baseParams: { cooldown: 1.08, damage: 0.76, width: 0.78, shieldOnHit: 1.4, counterDamage: 0.62, counterRange: 260, promotedSpikeCount: 3 },
      scalingHooks: ["护盾积累", "反射短激光", "减伤窗口"],
      ultimateHook: "护盾破裂追加光刺反伤"
    },
    marketing: {
      formId: "marker_marketing_wave",
      displayName: "舆论扩散笔",
      combatVerb: "光束终点释放环形扩散波，造成线 + 面混合伤害",
      mechanicType: "line_to_wave",
      triggerText: "光束到达终点或命中上限后释放波纹",
      riskText: "单体伤害偏低；波纹需要衰减上限",
      visualStyle: "wave",
      bestMatch: "strong",
      baseParams: { cooldown: 1.02, damage: 0.82, width: 0.76, waveCount: 1, waveDamage: 0.46, wavePush: 54, promotedEcho: 1, promotedDot: 0.18 },
      scalingHooks: ["波纹数量", "扩散速度", "推开与持续伤害"],
      ultimateHook: "扩散后回弹一圈"
    },
    general: {
      formId: "marker_admin_grid",
      displayName: "流程网格笔",
      combatVerb: "光束路径残留，多条残留线交叉生成定身网格",
      mechanicType: "line_grid_field",
      triggerText: "残留线交叉或重叠时生成网格",
      riskText: "需要走位和角度规划；即时清怪弱",
      visualStyle: "grid",
      bestMatch: false,
      baseParams: { cooldown: 1.06, damage: 0.76, width: 0.82, gridLines: 2, gridDamage: 0.44, gridSlow: 0.42, materialChance: 0.03, promotedZoneLife: 1.8, promotedZoneRadius: 72 },
      scalingHooks: ["网格密度", "留场时间", "材料和控制收益"],
      ultimateHook: "审批格留场并产材料"
    }
  },
  coffee: {
    tech: {
      formId: "coffee_tech_refill_system",
      displayName: "自动续杯系统",
      combatVerb: "高频命中召唤短时咖啡无人机，无人机继续发射咖啡弹",
      mechanicType: "hit_count_summon",
      triggerText: "咖啡弹累计命中达到阈值",
      riskText: "无人机有数量和时长上限；前期启动慢",
      motifExtreme: "续杯自动化",
      visualStyle: "chain",
      bestMatch: true,
      baseParams: { cooldown: 0.84, damage: 0.88, refillHits: 5, droneCount: 1, droneLife: 5.2, droneCooldown: 0.68 },
      scalingHooks: ["续杯阈值", "无人机数量", "无人机时长"],
      ultimateHook: "无人机命中会延长续杯时间"
    },
    product: {
      formId: "coffee_product_triple_espresso",
      displayName: "三倍浓缩杯",
      combatVerb: "同一敌人叠满咖啡因后过载，再次命中爆开",
      mechanicType: "stack_detonate",
      triggerText: "同目标咖啡因层数满后，再次命中触发",
      riskText: "换目标频繁时效率低；清杂不稳定",
      visualStyle: "blast",
      bestMatch: false,
      baseParams: { cooldown: 1.02, damage: 1.12, caffeineMax: 3, blastRadius: 52, blastDamage: 0.86 },
      scalingHooks: ["咖啡因层数", "过载伤害", "爆炸半径"],
      ultimateHook: "过载目标会溅射一层咖啡因"
    },
    ops: {
      formId: "coffee_ops_warm_stomach",
      displayName: "热饮护胃杯",
      combatVerb: "命中积攒暖意，满值生成环绕护盾球",
      mechanicType: "orbit_consumable_shield",
      triggerText: "命中积攒暖意条，满值生成护盾球",
      riskText: "回血和护盾有内置冷却，不能无限堆",
      visualStyle: "shield",
      bestMatch: false,
      baseParams: { cooldown: 0.98, damage: 0.8, warmthOnHit: 1, warmthMax: 8, shieldBall: 4 },
      scalingHooks: ["暖意积累", "护盾球数量", "护盾值"],
      ultimateHook: "护盾球破裂时喷一圈热咖啡"
    },
    marketing: {
      formId: "coffee_marketing_aroma_spread",
      displayName: "香气传染杯",
      combatVerb: "咖啡弹给敌人挂香气，死亡后传播给附近目标",
      mechanicType: "debuff_spread_on_death",
      triggerText: "带香气敌人死亡时传播",
      riskText: "对 Boss 和单体弱；传播需要击杀启动",
      visualStyle: "wave",
      bestMatch: false,
      baseParams: { cooldown: 0.96, damage: 0.86, aromaRadius: 120, spreadCount: 2, aromaDot: 0.18 },
      scalingHooks: ["传播数量", "传播范围", "香气持续伤害"],
      ultimateHook: "传播目标死亡可再传一次"
    },
    general: {
      formId: "coffee_admin_timed_drip",
      displayName: "定时滴滤",
      combatVerb: "在玩家路径上周期留下滤滴安全区",
      mechanicType: "path_field_zone",
      triggerText: "每隔 X 秒在玩家当前位置生成区域",
      riskText: "区域固定，离开后收益下降",
      visualStyle: "grid",
      bestMatch: false,
      baseParams: { cooldown: 1.04, damage: 0.8, dripInterval: 4, dripRadius: 82, resourceChance: 0.02 },
      scalingHooks: ["留场时间", "安全区半径", "材料收益"],
      ultimateHook: "咖啡圈会吸附经验"
    }
  },
  keyboard: {
    tech: {
      formId: "keyboard_tech_macro_repeat",
      displayName: "宏键连打键盘",
      combatVerb: "每数次挥击自动追加副挥击",
      mechanicType: "combo_repeat",
      triggerText: "第 N 次挥击触发自动副挥击",
      riskText: "副挥击范围和伤害低；需要持续贴近",
      visualStyle: "chain",
      bestMatch: false,
      baseParams: { cooldown: 0.88, damage: 0.9, repeatEvery: 3, repeatDamage: 0.48 },
      scalingHooks: ["连打间隔", "副挥击伤害", "副挥击范围"],
      ultimateHook: "宏键副挥击可连续触发一次"
    },
    product: {
      formId: "keyboard_product_enter_burst",
      displayName: "回车爆键键盘",
      combatVerb: "挥击积攒回车槽，满槽后下一击重击",
      mechanicType: "charge_next_attack",
      triggerText: "挥击命中积槽，满槽强化下一击",
      riskText: "空挥或摸不到怪时启动慢",
      visualStyle: "blast",
      bestMatch: false,
      baseParams: { cooldown: 1.08, damage: 1.08, heavyEvery: 3, blastRadius: 82, knockback: 94 },
      scalingHooks: ["重击频次", "击退", "爆炸伤害"],
      ultimateHook: "爆键连打"
    },
    ops: {
      formId: "keyboard_ops_guard_counter",
      displayName: "值守盾反键盘",
      combatVerb: "短防守姿态内不主动攻击，敌人贴脸触发格挡反击",
      mechanicType: "shield_counter",
      triggerText: "防守窗口内受到近身碰撞",
      riskText: "防守窗口外较弱；远程敌人压制明显",
      motifExtreme: "近身盾反输入",
      visualStyle: "shield",
      bestMatch: true,
      baseParams: { cooldown: 1.02, damage: 0.84, guardWindow: 0.34, counterRadius: 118, counterDamage: 1.18, pushBonus: 0.18 },
      scalingHooks: ["盾反窗口", "反击范围", "格挡伤害"],
      ultimateHook: "完美盾反会刷新一次挥击"
    },
    marketing: {
      formId: "keyboard_marketing_hotword_wave",
      displayName: "热词连播键盘",
      combatVerb: "命中越多敌人，下次挥击范围越大并放文字波",
      mechanicType: "hit_count_wave_amp",
      triggerText: "单次挥击命中数达到阈值",
      riskText: "怪少时弱；范围增长有上限",
      visualStyle: "wave",
      bestMatch: false,
      baseParams: { cooldown: 0.98, damage: 0.82, waveCount: 1, wavePush: 62 },
      scalingHooks: ["波数", "推开距离", "扇面宽度"],
      ultimateHook: "文字波会回弹一次"
    },
    general: {
      formId: "keyboard_admin_shortcut_lock",
      displayName: "快捷键封锁键盘",
      combatVerb: "给敌人挂快捷键标记，下次挥击使标记敌人短暂停顿",
      mechanicType: "mark_stun_followup",
      triggerText: "挥击命中挂标记；后续挥击触发停顿",
      riskText: "控制依赖二次命中；Boss 抗性高",
      visualStyle: "grid",
      bestMatch: false,
      baseParams: { cooldown: 0.98, damage: 0.82, rootEvery: 4, cdRefund: 0.12 },
      scalingHooks: ["定身频次", "冷却返还", "网格留场"],
      ultimateHook: "审批快捷键"
    }
  },
  stapler: {
    tech: {
      formId: "stapler_tech_magazine",
      displayName: "电动连钉匣",
      combatVerb: "连续射完一排钉后换弹，换弹后下一轮射速提升",
      mechanicType: "magazine_burst_reload",
      triggerText: "弹匣打空进入换弹，换弹结束触发增速",
      riskText: "换弹空窗明显；被包围时危险",
      visualStyle: "chain",
      bestMatch: false,
      baseParams: { cooldown: 0.82, damage: 0.82, pierce: 1, arcChance: 0.22 },
      scalingHooks: ["射速", "穿透", "电弧触发"],
      ultimateHook: "连钉会自动追击残血"
    },
    product: {
      formId: "stapler_product_bind_blast",
      displayName: "爆钉装订机",
      combatVerb: "主钉把目标装订，期间受足伤害后爆开",
      mechanicType: "bind_damage_threshold_detonate",
      triggerText: "主钉命中挂装订；累计伤害达阈值引爆",
      riskText: "需要后续输出配合；单独拿弱",
      visualStyle: "blast",
      bestMatch: false,
      baseParams: { cooldown: 0.94, damage: 1.08, pelletBonus: 2, burstRadius: 46 },
      scalingHooks: ["钉幕数量", "爆点伤害", "扇面密度"],
      ultimateHook: "每轮第一枚钉子变成大爆钉"
    },
    ops: {
      formId: "stapler_ops_barrier_line",
      displayName: "护栏钉线机",
      combatVerb: "钉子落地形成护栏线，穿过敌人减速，玩家在后方减伤",
      mechanicType: "barrier_slow_line",
      triggerText: "钉幕落地生成短时护栏线",
      riskText: "护栏不应完全阻挡 Boss；输出偏低",
      visualStyle: "shield",
      bestMatch: false,
      baseParams: { cooldown: 1.05, damage: 0.84, slow: 0.24, shieldOnHit: 0.8 },
      scalingHooks: ["护盾量", "减速", "覆盖角度"],
      ultimateHook: "护栏成型时反弹一次冲刺怪"
    },
    marketing: {
      formId: "stapler_marketing_bounce_scatter",
      displayName: "传单反弹钉",
      combatVerb: "钉子命中后反弹一次，并在反弹点散出纸片",
      mechanicType: "projectile_bounce_scatter",
      triggerText: "钉子命中敌人或墙体触发反弹",
      riskText: "依赖场景和敌群角度；空旷地图收益低",
      visualStyle: "scatter",
      bestMatch: false,
      baseParams: { cooldown: 0.98, damage: 0.9, sideShots: 2, spreadBonus: 0.28 },
      scalingHooks: ["侧向弹片", "扩散角度", "二段命中"],
      ultimateHook: "传单会在边缘折返"
    },
    general: {
      formId: "stapler_admin_archive_seal",
      displayName: "归档封条订书机",
      combatVerb: "钉点连成封锁线，敌人穿过短定身，多线闭合成归档区",
      mechanicType: "anchor_link_lockline",
      triggerText: "钉点之间距离满足条件自动连线",
      riskText: "需要布点；即时爆发较弱",
      motifExtreme: "装订封锁线",
      visualStyle: "grid",
      bestMatch: true,
      baseParams: { cooldown: 1.02, damage: 0.86, bindChance: 0.28, bindDuration: 0.55 },
      scalingHooks: ["定身概率", "定身时间", "材料掉落"],
      ultimateHook: "被钉住的敌人死亡时掉材料概率提高"
    }
  },
  headphones: {
    tech: {
      formId: "headphones_tech_bluetooth_network",
      displayName: "蓝牙音源组网",
      combatVerb: "召唤短时蓝牙音源，小音源释放小声场",
      mechanicType: "temporary_aura_summon",
      triggerText: "周期召唤音源，或命中数达到阈值",
      riskText: "音源持续时间有限；位置不可完全控制",
      visualStyle: "chain",
      bestMatch: false,
      baseParams: { cooldown: 0.96, damage: 0.82, droneCount: 2, droneRange: 180 },
      scalingHooks: ["游标数量", "追踪速度", "领域半径"],
      ultimateHook: "游标命中会连线导电"
    },
    product: {
      formId: "headphones_product_bass_pulse",
      displayName: "节拍重低音",
      combatVerb: "声场按节拍积攒，周期释放高冲击重低音",
      mechanicType: "timed_pulse_burst",
      triggerText: "每 X 秒进入重拍并释放强脉冲",
      riskText: "脉冲间隔有空窗；错过怪群收益低",
      visualStyle: "blast",
      bestMatch: false,
      baseParams: { cooldown: 1.08, damage: 1.05, pulseEvery: 3, pulseRadius: 130 },
      scalingHooks: ["重拍频次", "爆发半径", "击退"],
      ultimateHook: "重拍会标记精英"
    },
    ops: {
      formId: "headphones_ops_noise_shield",
      displayName: "主动降噪盾",
      combatVerb: "降噪球环绕角色，敌人碰到后消失并抵伤减速",
      mechanicType: "orbit_consumable_shield",
      triggerText: "周期生成降噪球；碰撞消耗",
      riskText: "球被消耗后输出和防御都下降",
      visualStyle: "shield",
      bestMatch: false,
      baseParams: { cooldown: 1.0, damage: 0.92, auraRadius: 1.12, shieldHealRatio: 0.3 },
      scalingHooks: ["领域半径", "减速", "护盾转回复"],
      ultimateHook: "护盾吸收会转为治疗"
    },
    marketing: {
      formId: "headphones_marketing_rebroadcast",
      displayName: "广播接力耳机",
      combatVerb: "声波命中敌人后，在敌人身上延迟二次播放小声波",
      mechanicType: "aura_rebroadcast",
      triggerText: "声波命中敌人后延迟触发二次声波",
      riskText: "需要敌群密度；单体 Boss 弱",
      motifExtreme: "声波接力传播",
      visualStyle: "wave",
      bestMatch: true,
      baseParams: { cooldown: 0.98, damage: 0.86, waveCount: 1, slow: 0.24 },
      scalingHooks: ["声浪圈数", "推开", "持续伤害"],
      ultimateHook: "声浪会在屏幕边缘反弹"
    },
    general: {
      formId: "headphones_admin_silent_room",
      displayName: "静音会议室",
      combatVerb: "生成静音区，降低敌人攻击频率，区域内击杀产少量资源",
      mechanicType: "silence_zone_economy",
      triggerText: "周期生成区域，敌人进入后生效",
      riskText: "区域固定；强控制需 Boss 抗性",
      visualStyle: "grid",
      bestMatch: false,
      baseParams: { cooldown: 1.05, damage: 0.78, slow: 0.34, resourceChance: 0.02 },
      scalingHooks: ["静音区范围", "减速", "材料吸附"],
      ultimateHook: "静音区会短暂冻结冲刺怪"
    }
  },
  thermos: {
    tech: {
      formId: "thermos_tech_auto",
      displayName: "自动恒温机",
      combatVerb: "生成巡航热饮模块，自动喷出短蒸汽",
      mechanicType: "patrol_summon_steam",
      triggerText: "热量达到阈值后生成巡航模块",
      riskText: "模块路径不完全可控；伤害分散",
      visualStyle: "chain",
      bestMatch: false,
      baseParams: { cooldown: 0.96, damage: 0.92, autoCharge: 1, overflowArc: 0.28 },
      scalingHooks: ["自动蓄能", "蒸汽电弧", "溢出伤害"],
      ultimateHook: "满蓄能时额外喷一圈电雾"
    },
    product: {
      formId: "thermos_product_boiling",
      displayName: "沸点爆发杯",
      combatVerb: "积热到沸点后释放高伤蒸汽柱，之后进入空窗",
      mechanicType: "charge_release_beam",
      triggerText: "热量满后进入沸点窗口并释放蒸汽柱",
      riskText: "蓄力和释放时机要求高；释放后有空窗",
      motifExtreme: "蓄热沸点释放",
      visualStyle: "blast",
      bestMatch: true,
      baseParams: { cooldown: 1.08, damage: 1.18, steamColumnRange: 390, steamColumnWidth: 22, ventLockout: 1.35, healMult: 0.72 },
      scalingHooks: ["蓄热速度", "蒸汽柱伤害", "空窗压缩"],
      ultimateHook: "沸点释放后留下短时热区"
    },
    ops: {
      formId: "thermos_ops_warm_shield",
      displayName: "暖流护体杯",
      combatVerb: "生成暖流护盾，破裂时释放环形热浪反击",
      mechanicType: "shield_break_pulse",
      triggerText: "护盾承伤到破裂时触发反击",
      riskText: "主动清怪弱；依赖受击触发",
      visualStyle: "shield",
      bestMatch: false,
      baseParams: { cooldown: 1.0, damage: 0.8, healMult: 1.35, overhealShield: 0.3 },
      scalingHooks: ["回复量", "过量护盾", "热场半径"],
      ultimateHook: "过量治疗转护盾"
    },
    marketing: {
      formId: "thermos_marketing_tea_wave",
      displayName: "茶香广播杯",
      combatVerb: "周期释放环形茶香热波，死亡后触发低伤二次波",
      mechanicType: "periodic_wave_spread",
      triggerText: "每 X 秒释放波；带状态敌人死亡传播",
      riskText: "波伤低；传播依赖击杀",
      visualStyle: "wave",
      bestMatch: false,
      baseParams: { cooldown: 0.98, damage: 0.86, waveCount: 1, slow: 0.26 },
      scalingHooks: ["香气波数", "减速", "持续伤害"],
      ultimateHook: "香气波会二次扩散"
    },
    general: {
      formId: "thermos_admin_station",
      displayName: "茶水间据点",
      combatVerb: "放置固定茶水间，提供补给并减速敌人",
      mechanicType: "deployable_safe_station",
      triggerText: "热量满或冷却结束后部署据点",
      riskText: "据点固定，离开后失效；数量受限",
      visualStyle: "grid",
      bestMatch: false,
      baseParams: { cooldown: 1.05, damage: 0.78, stationRadius: 90, resourceChance: 0.03 },
      scalingHooks: ["补给圈范围", "留场时间", "材料收益"],
      ultimateHook: "补给圈会吸附经验"
    }
  },
  report: {
    tech: {
      formId: "report_tech_auto_refresh",
      displayName: "自动刷新报表",
      combatVerb: "一圈可消耗报表页命中后消失，击杀或冷却后补页",
      mechanicType: "orbit_consumable_regen",
      triggerText: "页命中敌人消耗，击杀或计时补页",
      riskText: "页数少时输出下降；维护压力高",
      visualStyle: "chain",
      bestMatch: false,
      baseParams: { cooldown: 0.94, damage: 0.86, homingSheets: 1, speedMult: 1.3 },
      scalingHooks: ["补页频率", "轨道速度", "消耗页伤害"],
      ultimateHook: "刷新时额外生成一张副页"
    },
    product: {
      formId: "report_product_kpi_judgement",
      displayName: "KPI 审判报表",
      combatVerb: "锁定高价值目标挂 KPI，窗口内记录伤害并结算爆发",
      mechanicType: "target_window_damage_settle",
      triggerText: "周期锁定精英或高血目标，窗口结束结算",
      riskText: "对小怪清场弱；要求集火目标",
      motifExtreme: "KPI 窗口审判",
      visualStyle: "blast",
      bestMatch: true,
      baseParams: { cooldown: 1.04, damage: 1.05, window: 3.2, settleMult: 0.62, spikeEvery: 4 },
      scalingHooks: ["审判窗口", "结算倍率", "目标锁定频次"],
      ultimateHook: "KPI 结算会穿透附近目标"
    },
    ops: {
      formId: "report_ops_dashboard_pages",
      displayName: "仪表盘护页",
      combatVerb: "报表页既是刀片也是护盾，抵伤会消耗页数",
      mechanicType: "orbit_attack_defense_shared",
      triggerText: "敌人近身碰撞消耗报表页抵伤",
      riskText: "页数被打空后攻防双降",
      visualStyle: "shield",
      bestMatch: false,
      baseParams: { cooldown: 1.0, damage: 0.82, orbitRadius: 1.12, shieldOnTick: 0.35 },
      scalingHooks: ["轨道半径", "护盾", "减速"],
      ultimateHook: "护环满层时释放脉冲"
    },
    marketing: {
      formId: "report_marketing_global_read",
      displayName: "全员周报",
      combatVerb: "周期全屏翻页，低伤挂已读，死亡小范围传播",
      mechanicType: "global_periodic_status",
      triggerText: "每 X 秒全屏翻页挂状态",
      riskText: "低单体伤害；全屏效果需严格控强度",
      visualStyle: "wave",
      bestMatch: false,
      baseParams: { cooldown: 0.96, damage: 0.82, sheetMult: 2, minionSheets: 1 },
      scalingHooks: ["报表数量", "小报表", "轨道速度"],
      ultimateHook: "主报表会召唤迷你报表"
    },
    general: {
      formId: "report_admin_archive_tree",
      displayName: "归档目录树",
      combatVerb: "报表页落地成为归档节点，节点连线形成目录区",
      mechanicType: "node_link_rule_zone",
      triggerText: "页消失或落地生成节点，节点间自动连线",
      riskText: "需要场地布局；节点上限限制强度",
      visualStyle: "grid",
      bestMatch: false,
      baseParams: { cooldown: 1.06, damage: 0.78, trailLife: 1.4, resourceChance: 0.02 },
      scalingHooks: ["归档线长度", "留场", "材料收益"],
      ultimateHook: "归档线连成网格"
    }
  },
  shredder: {
    tech: {
      formId: "shredder_tech_auto_slash",
      displayName: "自动裁纸阵列",
      combatVerb: "场上生成短切纸线，在敌人间弹射后消失",
      mechanicType: "bouncing_slash_line",
      triggerText: "周期生成切纸线，命中后弹射",
      riskText: "不再保护正面；敌人少时收益低",
      visualStyle: "chain",
      bestMatch: false,
      baseParams: { cooldown: 0.92, damage: 0.9, pierce: 1, chainChance: 0.2 },
      scalingHooks: ["切割线数", "射程", "跳电"],
      ultimateHook: "切割线会分叉"
    },
    product: {
      formId: "shredder_product_execute_channel",
      displayName: "提案粉碎程序",
      combatVerb: "锁定高价值目标形成粉碎通道，叠层满后爆裂",
      mechanicType: "single_target_channel_execute",
      triggerText: "持续命中同目标叠粉碎层",
      riskText: "被杂兵干扰时难以持续锁定",
      visualStyle: "blast",
      bestMatch: false,
      baseParams: { cooldown: 1.03, damage: 1.1, burstShards: 4, coneAngle: 0.9 },
      scalingHooks: ["碎片数量", "爆发伤害", "锥角"],
      ultimateHook: "碎片命中会二次爆开"
    },
    ops: {
      formId: "shredder_ops_guard_counter",
      displayName: "安全粉碎口",
      combatVerb: "玩家正面形成防御通道，正面敌人被削弱，受击喷纸反击",
      mechanicType: "directional_guard_counter",
      triggerText: "正面受到压力或碰撞时触发反击纸片",
      riskText: "背后脆弱；方向判断要求高",
      visualStyle: "shield",
      bestMatch: false,
      baseParams: { cooldown: 1.02, damage: 0.82, shieldOnTick: 0.45, slow: 0.22 },
      scalingHooks: ["护盾", "减速", "持续时间"],
      ultimateHook: "护盾满时喷出反刺纸屑"
    },
    marketing: {
      formId: "shredder_marketing_vortex",
      displayName: "纸屑龙卷碎纸机",
      combatVerb: "粉碎积累纸屑值，满值生成移动龙卷牵引小怪",
      mechanicType: "kill_meter_vortex_summon",
      triggerText: "持续命中或击杀积纸屑值，满值召唤龙卷",
      riskText: "启动慢；Boss 牵引抗性高",
      motifExtreme: "粉碎纸屑龙卷",
      visualStyle: "wave",
      bestMatch: true,
      baseParams: { cooldown: 0.96, damage: 0.92, vortexMeter: 18, vortexRadius: 96, vortexLife: 3.8, pull: 72 },
      scalingHooks: ["纸屑值", "龙卷半径", "牵引强度"],
      ultimateHook: "龙卷结束时爆成一圈纸刃"
    },
    general: {
      formId: "shredder_admin_fragment_barrier",
      displayName: "机密销毁箱",
      combatVerb: "击杀生成机密碎片，碎片连成封锁条或拾取变资源",
      mechanicType: "death_fragment_barrier_resource",
      triggerText: "碎纸机击杀敌人生成碎片",
      riskText: "依赖击杀；碎片数量需上限",
      visualStyle: "grid",
      bestMatch: false,
      baseParams: { cooldown: 1.05, damage: 0.82, bindChance: 0.24, resourceChance: 0.03 },
      scalingHooks: ["封存时间", "材料收益", "路径宽度"],
      ultimateHook: "封存敌人死亡会引发小范围销毁"
    }
  },
  sticky_note: {
    tech: {
      formId: "sticky_tech_todo",
      displayName: "智能待办贴",
      combatVerb: "贴纸变成会滑向敌人的小待办单位",
      mechanicType: "seeking_trap_summon",
      triggerText: "贴纸生成后自动寻敌",
      riskText: "自动化降低伤害；目标选择不可控",
      visualStyle: "chain",
      bestMatch: false,
      baseParams: { cooldown: 0.92, damage: 0.86, homingTrap: 1, chainTrap: 0.24 },
      scalingHooks: ["追踪速度", "连锁概率", "陷阱数量"],
      ultimateHook: "陷阱会自动复制"
    },
    product: {
      formId: "sticky_product_switch",
      displayName: "功能开关",
      combatVerb: "贴纸可被二次触发，同屏贴纸同步引爆",
      mechanicType: "manual_trap_detonate",
      triggerText: "玩家经过、攻击或按键触发引爆",
      riskText: "需要提前布阵；未布好时爆发低",
      visualStyle: "blast",
      bestMatch: false,
      baseParams: { cooldown: 1.0, damage: 1.08, blastRadius: 78, triggerChance: 1 },
      scalingHooks: ["爆炸半径", "爆炸伤害", "触发速度"],
      ultimateHook: "爆炸会标记后续目标"
    },
    ops: {
      formId: "sticky_ops_route",
      displayName: "值班提醒",
      combatVerb: "贴纸铺成安全路线，玩家经过得护盾，敌人经过减速",
      mechanicType: "route_buff_trap",
      triggerText: "玩家路径周期生成贴纸；双方经过触发不同效果",
      riskText: "路线外收益低；伤害不足",
      visualStyle: "shield",
      bestMatch: false,
      baseParams: { cooldown: 1.04, damage: 0.78, slow: 0.35, healPulse: 1.1 },
      scalingHooks: ["减速", "回血", "区域时间"],
      ultimateHook: "提醒区会补护盾"
    },
    marketing: {
      formId: "sticky_marketing_viral",
      displayName: "病毒贴纸",
      combatVerb: "贴纸贴在敌人身上，敌人死亡后传播给附近目标",
      mechanicType: "sticky_debuff_spread",
      triggerText: "贴纸命中敌人并附着，死亡触发传播",
      riskText: "对单体弱；传播次数必须有限",
      visualStyle: "wave",
      bestMatch: false,
      baseParams: { cooldown: 0.98, damage: 0.86, spreadTraps: 2, spreadRadius: 120 },
      scalingHooks: ["扩散数量", "扩散范围", "持续伤害"],
      ultimateHook: "小便签也能继续扩散"
    },
    general: {
      formId: "sticky_admin_board",
      displayName: "公告板阵地",
      combatVerb: "多贴连线，三张围成公告板区域，区域内敌人受规则限制",
      mechanicType: "trap_link_control_zone",
      triggerText: "三张贴纸距离满足条件自动围成区域",
      riskText: "布阵门槛高；区域数量需限制",
      motifExtreme: "贴纸公告板阵地",
      visualStyle: "grid",
      bestMatch: true,
      baseParams: { cooldown: 1.0, damage: 0.84, gridTraps: 3, resourceChance: 0.03 },
      scalingHooks: ["网格密度", "留场", "材料收益"],
      ultimateHook: "公告板会周期性释放波动"
    }
  },
  calculator: {
    tech: {
      formId: "calculator_tech_recursive_formula",
      displayName: "递归公式机",
      combatVerb: "数字弹命中后复制小数字，小数字继续跳点一次",
      mechanicType: "recursive_chain",
      triggerText: "命中后概率或计数生成递归小数字",
      riskText: "递归深度需上限；单体弱",
      visualStyle: "chain",
      bestMatch: false,
      baseParams: { cooldown: 0.9, damage: 0.92, chainBonus: 2, rangeBonus: 40 },
      scalingHooks: ["跳点次数", "跳点范围", "再次计算"],
      ultimateHook: "连锁会回到主目标"
    },
    product: {
      formId: "calculator_product_profit_point",
      displayName: "利润爆点",
      combatVerb: "标记高血/精英为利润点，窗口结束按伤害结算爆发",
      mechanicType: "value_target_profit_detonate",
      triggerText: "周期选择高价值目标，窗口结束结算",
      riskText: "和报表 KPI 相似，但更强调利润点爆发",
      visualStyle: "blast",
      bestMatch: false,
      baseParams: { cooldown: 1.02, damage: 1.06, blastRadius: 62, lastHitMult: 1.4 },
      scalingHooks: ["末端爆炸", "单体伤害", "暴击"],
      ultimateHook: "末端爆炸范围翻倍"
    },
    ops: {
      formId: "calculator_ops_balance_sheet",
      displayName: "收支平衡",
      combatVerb: "数字弹在红字伤害和绿字回血之间切换",
      mechanicType: "mode_alternating_projectile",
      triggerText: "每次跳点切换伤害和回血模式",
      riskText: "输出节奏不稳定；回血需上限",
      visualStyle: "shield",
      bestMatch: false,
      baseParams: { cooldown: 1.0, damage: 0.82, shieldOnJump: 0.45, slow: 0.18 },
      scalingHooks: ["护盾", "跳点数", "减速"],
      ultimateHook: "护盾满时返还一次跳点"
    },
    marketing: {
      formId: "calculator_marketing_prediction_path",
      displayName: "投放预测",
      combatVerb: "发射前生成预测路径，数字沿路径穿过并扩展到下一轮",
      mechanicType: "prediction_path_chain",
      triggerText: "预显示路径后释放数字弹，命中后扩展路径",
      riskText: "需要预判拉怪；路径空放时弱",
      visualStyle: "wave",
      bestMatch: "strong",
      baseParams: { cooldown: 0.98, damage: 0.88, spreadRange: 1.25, forecastJumps: 1 },
      scalingHooks: ["扩散范围", "远端跳点", "持续伤害"],
      ultimateHook: "预测命中会标记下一跳"
    },
    general: {
      formId: "calculator_admin_audit_ledger",
      displayName: "审计总账计算器",
      combatVerb: "给敌人挂账，死亡时结算并转移账目，产资源或审计区",
      mechanicType: "ledger_death_settlement",
      triggerText: "数字弹命中挂账；挂账敌人死亡触发结算",
      riskText: "依赖击杀启动；账目转移需防无限循环",
      motifExtreme: "审计账目结算",
      visualStyle: "grid",
      bestMatch: true,
      baseParams: { cooldown: 1.04, damage: 0.82, auditGrid: 1, resourceChance: 0.03 },
      scalingHooks: ["审计格", "材料收益", "控制时间"],
      ultimateHook: "审计格会结算一次范围伤害"
    }
  }
};

let pendingStartWeapon = "marker";

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

const markerVfxAtlas = new Image();
let markerVfxAtlasReady = false;
markerVfxAtlas.onload = () => {
  markerVfxAtlasReady = true;
};
markerVfxAtlas.src = MARKER_VFX_ATLAS_SRC;


// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
//  LAYER 04: BUILD ARCHITECTURE 鈥?娴佹淳鏋舵瀯
//  姝﹀櫒瀹氫箟路璺嚎绯荤粺路鑱屼笟鍗忓悓路Build鍏崇郴
// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
const weaponDefinitions = {
  coffee: {
    label: "挂耳咖啡",
    emoji: "☕",
    archetype: "高频射击",
    classes: ["precise", "ranged"],
    color: "#f4c95d",
    level: 1,
    max: 7,
    description: "高频命中与续杯自动化。",
  },
  keyboard: {
    label: "机械键盘",
    emoji: "⌨️",
    archetype: "近战击退",
    classes: ["barrage", "close"],
    color: "#6ea8ff",
    level: 0,
    max: 7,
    description: "近身挥击、击退与盾反输入。",
  },
  headphones: {
    label: "降噪耳机",
    emoji: "🎧",
    archetype: "防守领域",
    classes: ["support", "field"],
    color: "#42d7b8",
    level: 0,
    max: 7,
    description: "持续声场与声波接力传播。",
  },
  report: {
    label: "季度报表",
    emoji: "📊",
    archetype: "轨道切割",
    classes: ["field", "engineering"],
    color: "#ff8f70",
    level: 0,
    max: 7,
    description: "环绕切割，并用 KPI 窗口结算伤害。",
  },
  stapler: {
    label: "订书机",
    emoji: "📎",
    archetype: "扇形散射",
    classes: ["barrage", "ranged"],
    color: "#d7d0c2",
    level: 0,
    max: 7,
    description: "扇形钉幕、布点和装订封锁线。",
  },
  sticky_note: {
    label: "即时贴",
    emoji: "🟨",
    archetype: "陷阱控场",
    classes: ["engineering", "support"],
    color: "#fff07a",
    level: 0,
    max: 7,
    description: "地面布阵，让敌人走进贴纸规则。",
  },
  marker: {
    label: "马克笔",
    emoji: "🖊️",
    archetype: "贯穿激光",
    classes: ["precise", "ranged"],
    color: "#b282ff",
    level: 0,
    max: 7,
    description: "长射程贯穿光线，靠走位排线清怪。",
  },
  calculator: {
    label: "财务计算器",
    emoji: "🧮",
    archetype: "连锁点射",
    classes: ["engineering", "support"],
    color: "#9ee37d",
    level: 0,
    max: 7,
    description: "数字跳点、挂账、死亡结算和账目转移。",
  },
  shredder: {
    label: "碎纸机",
    emoji: "🗑️",
    archetype: "定向锥形",
    classes: ["close", "engineering"],
    color: "#a9b8c6",
    level: 0,
    max: 7,
    description: "锥形粉碎并积累纸屑值召唤龙卷。",
  },
  thermos: {
    label: "保温杯",
    emoji: "🫖",
    archetype: "站场治疗",
    classes: ["support", "field"],
    color: "#78e8c0",
    level: 0,
    max: 7,
    description: "积热、找窗口、释放沸点蒸汽。",
  },
};
// 鍚戝悗鍏煎鍒悕：堟棫 combat 浠ｇ爜浣跨敤鏃?ID：?weaponDefinitions.headset = weaponDefinitions.headphones;
weaponDefinitions.headset = weaponDefinitions.headphones;
weaponDefinitions.sticky = weaponDefinitions.sticky_note;

function normalizeWeaponStateForCombat(weapons) {
  if (!weapons || typeof weapons !== "object") return weapons;
  for (const [id, def] of Object.entries(weaponDefinitions)) {
    if (!weapons[id]) weapons[id] = structuredClone(def);
  }
  if (weapons.headphones) weapons.headset = weapons.headphones;
  if (weapons.sticky_note) weapons.sticky = weapons.sticky_note;
  return weapons;
}

function canonicalWeaponId(weaponId) {
  if (weaponId === "headset") return "headphones";
  if (weaponId === "sticky") return "sticky_note";
  return weaponId;
}

function legacyWeaponId(weaponId) {
  if (weaponId === "headphones") return "headset";
  if (weaponId === "sticky_note") return "sticky";
  return weaponId;
}

const buildOrder = ["coffee", "keyboard", "headphones", "report", "stapler", "sticky_note", "marker", "shredder", "thermos", "calculator"];
const weaponClassLabels = {
  precise: "绌块€?",
  ranged: "鐩村皠",
  barrage: "鏁ｅ皠",
  field: "鐜粫",
  engineering: "闄烽槺",
  support: "鍥炲",
  close: "璐磋韩",
};
Object.assign(weaponClassLabels, {
  precise: "精准",
  ranged: "远程",
  barrage: "弹幕",
  field: "领域",
  engineering: "机关",
  support: "支援",
  close: "近身",
});

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

function getClassTierThreshold(tier) {
  return Math.max(1, Number(tier?.count || tier?.threshold || 2));
}

const routeDefinitions = [
  {
    id: "precision",
    name: "绮惧噯璐┛",
    fantasy: "婵€鍏夊绋挎祦",
    color: "#b282ff",
    accent: "#52ffe1",
    weapons: ["coffee", "marker"],
    stats: ["crit", "range"],
    itemPattern: /鏆村嚮|灏勭▼|杈撳嚭|鐖嗗彂/,
    stages: ["鏈惎鍔?", "璧锋墜", "鍙屾鍣?", "鑱氱劍", "缁堝眬"],
    unlockText: "鍜栧暋 + 椹厠绗旓紝鏆村嚮/灏勭▼鎶婄洿绾挎竻灞忔帹鍒版瀬鑷淬€?",
    evolveText: "缁堝眬：氬皠绾垮垎鍙夊苟杩藉姞瀹＄鍏夋潫銆?",
  },
  {
    id: "barrage",
    name: "閿洏椋庢毚",
    fantasy: "寮瑰箷鍔犵彮娴?",
    color: "#52ffe1",
    accent: "#c35cff",
    weapons: ["keyboard", "stapler"],
    stats: ["attackSpeed", "dodge"],
    itemPattern: /鏀婚€焲闂伩|鐖嗗彂/,
    stages: ["鏈惎鍔?", "璧锋墜", "鍙屾鍣?", "楂橀€?", "缁堝眬"],
    unlockText: "閿洏 + 璁功鏈猴紝鏀婚€?闂伩鎶婂睆骞曟墦鎴愬姙鍏脊骞曘€?",
    evolveText: "缁堝眬：氬脊骞曡拷鍔犱晶缈兼暎灏勫拰杩戣窛鐖嗗彂銆?",
  },
  {
    id: "conductor",
    name: "宸ヤ綅闆风綉",
    fantasy: "闄烽槺杩為攣娴?",
    color: "#9ee37d",
    accent: "#ffd15c",
    weapons: ["sticky_note", "shredder"],
    stats: ["luck", "pickupRange"],
    itemPattern: /缁忔祹|鎷惧彇|鎭㈠|鎺у埗|闄烽槺|甯冪嚎/,
    stages: ["鏈惎鍔?", "璧锋墜", "鍙屾鍣?", "甯冪綉", "缁堝眬"],
    unlockText: "渚跨 + 纰庣焊鏈猴紝骞歌繍/鎷惧彇鎶婇櫡闃卞拰閿ュ舰鐏姏婊氳捣鏉ャ€?",
    evolveText: "缁堝眬：氶櫡闃变細棰戠箒瑙﹀彂杩為攣鐢垫祦銆?",
  },
  {
    id: "perimeter",
    name: "浼氳缁撶晫",
    fantasy: "棰嗗煙闃插畧娴?",
    color: "#ffd15c",
    accent: "#6ea8ff",
    weapons: ["headphones", "report"],
    stats: ["armor", "regen", "fortify"],
    itemPattern: /闃插尽|鐢熷瓨|鎺у埗|绔欏満|绔欐々|棰嗗煙|鎭㈠/,
    stages: ["鏈惎鍔?", "璧锋墜", "鍙屾鍣?", "绔欏満", "缁堝眬"],
    unlockText: "鑰虫満 + 鎶ヨ〃：屾姢鐢?鎭㈠鎶婅韩杈瑰彉鎴愬畨鍏ㄥ尯銆?",
    evolveText: "缁堝眬：氱粨鐣岃剦鍐插嚮閫€：屾姤琛ㄨ建閬撳姞灞傘€?",
  },
];

const stageBriefs = [
  "清理 Bug，建立第一套武器效果",
  "需求变更开始绕行，观察推开、减速或范围效果",
  "会议怪会减速，保持空间并留意领域压制",
  "Deadline 会冲刺，近身和闪避价值上升",
  "复盘压力混合出现，检查输出和生存是否跟得上",
  "季度审判出现更多精英，准备爆发窗口",
  "紧急上线偏高速冲刺，留意远程、陷阱或控制效果",
  "跨组拉齐会被会议怪围住，领域或清场能力很关键",
  "财年封版材料紧张，别让商店刷新吞掉关键资源",
  "审计追问会拉长战线，陷阱和站场收益上升",
  "组织调整带来混合压力，注意替换低等级武器",
  "灰度事故偏高速冲击，保留一个能清近身的手段",
  "年度述职会检验续航，别只堆一波爆发",
  "终局评审 Boss 压力，必须靠完整体系撑住",
];
routeDefinitions.splice(0, routeDefinitions.length,
  {
    id: "precision",
    name: "精准贯穿",
    fantasy: "直线激光流",
    color: "#7bdcff",
    accent: "#52ffe1",
    weapons: ["coffee", "marker"],
    stats: ["crit", "range"],
    itemPattern: /精准|贯穿|激光|远程|暴击|射程|marker|coffee/,
    stages: ["未启动", "起手", "双武器", "聚焦", "终局"],
    unlockText: "咖啡和马克笔会把远程直线伤害推高，适合走位拉直线清怪。",
    evolveText: "终局：激光更宽、更快，并追加全屏切线。",
  },
  {
    id: "barrage",
    name: "近身弹幕",
    fantasy: "高速扫射流",
    color: "#52ffe1",
    accent: "#c35cff",
    weapons: ["keyboard", "stapler"],
    stats: ["attackSpeed", "dodge"],
    itemPattern: /弹幕|攻速|近身|击退|键盘|订书机|keyboard|stapler/,
    stages: ["未启动", "起手", "双武器", "高速", "终局"],
    unlockText: "键盘和订书机会把近身区域打成弹幕屏障，适合贴边切怪。",
    evolveText: "终局：弹幕追加侧翼散射和近距爆发。",
  },
  {
    id: "conductor",
    name: "机关连锁",
    fantasy: "陷阱滚雪球",
    color: "#9ee37d",
    accent: "#ffd15c",
    weapons: ["sticky_note", "shredder"],
    stats: ["luck", "pickupRange"],
    itemPattern: /机关|陷阱|连锁|材料|吸附|便签|碎纸机|sticky|shredder/,
    stages: ["未启动", "起手", "双武器", "布网", "终局"],
    unlockText: "便签和碎纸机会让陷阱、掉落、连锁互相滚起来。",
    evolveText: "终局：陷阱会更频繁触发连锁电流。",
  },
  {
    id: "perimeter",
    name: "领域护体",
    fantasy: "站场安全区",
    color: "#ffd15c",
    accent: "#6ea8ff",
    weapons: ["headphones", "report"],
    stats: ["armor", "regen", "fortify"],
    itemPattern: /领域|站场|护盾|回血|减速|耳机|报表|headphones|report/,
    stages: ["未启动", "起手", "双武器", "站场", "终局"],
    unlockText: "耳机和报表会把身边变成安全区，适合稳住阵地再清场。",
    evolveText: "终局：领域脉冲击退，报表轨道叠层。",
  },
);

stageBriefs.splice(0, stageBriefs.length,
  "清理第一批 Bug，先确认武器的基础攻击方式。",
  "敌人开始绕行，观察推开、减速或范围效果。",
  "会议怪会压缩空间，留意领域、护盾和走位。",
  "Deadline 会高速冲线，近身防御和闪避开始有价值。",
  "小 Boss 检查你的输出与生存是否跟得上。",
  "精英更多，准备让主武器进入稳定形态。",
  "高速压力上升，保留一个清近身或控场手段。",
  "怪群会围住你，范围清场或领域护体很关键。",
  "材料压力上升，工坊选择要服务主武器形态。",
  "审计追问会拉长战线，陷阱和站场收益上升。",
  "混合压力出现，别让低等级副武器拖慢主线。",
  "高速度冲线更多，检查是否有近身清理手段。",
  "最终前的完整 Build 检查，输出和容错都要能打。",
  "终局 Boss 会同时考验清怪、站位和爆发。"
);

const statLabelsLegacy = [
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

const statLabels = [
  { key: "hp", label: "生命" },
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

statLabelsLegacy.splice(0, statLabelsLegacy.length,
  { key: "maxHp", label: "生命" },
  { key: "armor", label: "护甲" },
  { key: "dodge", label: "闪避" },
  { key: "speed", label: "速度" },
  { key: "attackSpeed", label: "攻速" },
  { key: "damageMult", label: "伤害" },
  { key: "crit", label: "暴击" },
  { key: "range", label: "射程" },
  { key: "luck", label: "幸运" },
  { key: "pickupRange", label: "吸附" },
  { key: "regen", label: "回血" },
  { key: "fortify", label: "站场" },
);

statLabels.splice(0, statLabels.length,
  { key: "hp", label: "生命" },
  { key: "armor", label: "护甲" },
  { key: "dodge", label: "闪避" },
  { key: "speed", label: "速度" },
  { key: "attackSpeed", label: "攻速" },
  { key: "damageMult", label: "伤害" },
  { key: "crit", label: "暴击" },
  { key: "range", label: "射程" },
  { key: "luck", label: "幸运" },
  { key: "pickupRange", label: "吸附" },
  { key: "regen", label: "回血" },
  { key: "fortify", label: "站场" },
);

const statDropPool = [
  { key: "maxHp", label: "鐢熷懡", amount: 3, apply: (g) => { g.player.maxHp += 3; g.player.hp += 3; } },
  { key: "armor", label: "鎶ょ敳", amount: 1, apply: (g) => { g.player.armor += 1; } },
  { key: "dodge", label: "闂伩", amount: 2, apply: (g) => { g.player.dodge = Math.min(60, g.player.dodge + 2); } },
  { key: "speed", label: "閫熷害", amount: 5, apply: (g) => { g.player.speed += 5; } },
  { key: "attackSpeed", label: "鏀婚€?", amount: 3, apply: (g) => { addPlayerAttackSpeed(g, 3); } },
  { key: "damageMult", label: "浼ゅ", amount: 3, apply: (g) => { addPlayerDamage(g, 0.03); } },
  { key: "crit", label: "鏆村嚮", amount: 2, apply: (g) => { g.player.crit = Math.min(75, g.player.crit + 2); } },
  { key: "range", label: "灏勭▼", amount: 8, apply: (g) => { g.player.range += 8; } },
  { key: "luck", label: "骞歌繍", amount: 3, apply: (g) => { g.player.luck += 3; } },
  { key: "pickupRange", label: "鎷惧彇", amount: 8, apply: (g) => { g.player.pickupRange += 8; } },
  { key: "regen", label: "鎭㈠", amount: 1, apply: (g) => { g.player.regen += 1; } },
  { key: "fortify", label: "绔欏満", amount: 1, apply: (g) => { g.player.fortify += 1; } },
];

const cleanStatDropLabels = {
  maxHp: "生命",
  armor: "护甲",
  dodge: "闪避",
  speed: "速度",
  attackSpeed: "攻速",
  damageMult: "伤害",
  crit: "暴击",
  range: "射程",
  luck: "幸运",
  pickupRange: "吸附",
  regen: "回血",
  fortify: "站场",
};
statDropPool.forEach((entry) => {
  if (entry && cleanStatDropLabels[entry.key]) entry.label = cleanStatDropLabels[entry.key];
});

const policyCards = [
  {
    id: "agile",
    name: "鏁忔嵎寮€鍙?",
    icon: "杩?",
    desc: "杩唬閫熷害鍙樺揩：屼絾鍘嬪姏婧愪篃鏇村揩杩戒笂鏉ャ€?",
    buff: "鍏ㄥ眬鍐峰嵈 -12%",
    risk: "鏁屼汉绉婚€?+15%",
  },
  {
    id: "costcut",
    name: "闄嶆湰澧炴晥",
    icon: "鏉?",
    desc: "鏉愭枡鍥炴敹鍙樺：屼絾宸ュ潑渚涘簲閾惧紑濮嬫定浠枫€?",
    buff: "鏉愭枡鏀剁泭 x1.5",
    risk: "鍒锋柊璐圭敤 +2",
  },
  {
    id: "flat",
    name: "鎵佸钩绠＄悊",
    icon: "鎵?",
    desc: "鑱屼笟鏇存棭鍏遍福：屼絾姣忓眰鍏遍福涓嶅啀閭ｄ箞澶稿紶銆?",
    buff: "鍏遍福闂ㄦ -1",
    risk: "鍏遍福鏁堟灉 -20%",
  },
  {
    id: "remote",
    name: "杩滅▼鍔炲叕",
    icon: "杩?",
    desc: "璧勬簮鏇村鏄撳惛杩囨潵：屼絾杩滆窛绂荤伀鍔涙墦鎶樸€?",
    buff: "鎷惧彇鑼冨洿 +50%",
    risk: "200px 澶栦激瀹?-20%",
  },
  {
    id: "overtime",
    name: "996 绂忔姤",
    icon: "鐝?",
    desc: "鎴愰暱璧勬簮鏇磋偉：屽崟鍏充篃鏇存嫋鏇存尋銆?",
    buff: "缁忛獙 +35%：屾潗鏂?+20%",
    risk: "鍏冲崱 +12s：岀簿鑻?+25%",
  },
  {
    id: "involution",
    name: "鍐呭嵎鏂囧寲",
    icon: "鍗?",
    desc: "绮捐嫳鎺夎惤鏇撮：岀簿鑻辨暟閲忎篃鐩存帴缈诲€嶃€?",
    buff: "绮捐嫳鎺夎惤 x3",
    risk: "绮捐嫳鏁伴噺 x2",
  },
];
policyCards.splice(0, policyCards.length,
  {
    id: "agile",
    name: "敏捷开发",
    icon: "迭",
    desc: "武器节奏更快，但怪物也会更快贴近。",
    buff: "全局冷却 -12%",
    risk: "敌人移速 +15%",
  },
  {
    id: "costcut",
    name: "降本增效",
    icon: "材",
    desc: "材料回收更多，但商店刷新会更贵。",
    buff: "材料收益 x1.5",
    risk: "刷新费用 +2",
  },
  {
    id: "flat",
    name: "扁平管理",
    icon: "扁",
    desc: "武器共鸣更早启动，但每层共鸣变弱。",
    buff: "共鸣门槛 -1",
    risk: "共鸣效果 -20%",
  },
  {
    id: "remote",
    name: "远程办公",
    icon: "远",
    desc: "资源更容易吸过来，但远距离输出打折。",
    buff: "拾取范围 +50%",
    risk: "远距伤害 -20%",
  },
  {
    id: "overtime",
    name: "996 福利",
    icon: "班",
    desc: "经验和材料更多，但关卡会更长更挤。",
    buff: "经验 +35% / 材料 +20%",
    risk: "关卡 +12s / 精英 +25%",
  },
  {
    id: "involution",
    name: "内卷文化",
    icon: "卷",
    desc: "精英掉落更好，但精英数量翻倍。",
    buff: "精英掉落 x3",
    risk: "精英数量 x2",
  },
);

// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
//  LAYER 03: PROGRESSION CURVE 鈥?鎴愰暱鏇茬嚎
//  鍏冲崱閰嶇疆路浜嬩欢路娓告垙鍒涘缓路寮€灞€閫昏緫
// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲

// v0.3 phase lookup
function getPhaseForStage(stage) {
  if (!CS.stages || !CS.stages.phases) return null;
  for (var i = 0; i < CS.stages.phases.length; i++) {
    var phase = CS.stages.phases[i];
    if (phase.subStages.indexOf(stage) >= 0) return phase;
  }
  return null;
}

function getRunChapter(stage = game?.stage || 1) {
  return Math.max(1, Math.min(5, Math.ceil(stage / 4)));
}

function getChapterLocalStage(stage = game?.stage || 1) {
  return ((Math.max(1, stage) - 1) % 4) + 1;
}

function isChapterBossStage(stage = game?.stage || 1) {
  return getChapterLocalStage(stage) === 4;
}

function getStageConfig(stage) {
  const names = [
    "武器试运行", "漏洞潮", "需求小改", "入职考核",
    "工牌接入", "晨会围堵", "需求变更", "试用考核",
    "转正训练", "复盘压力", "紧急上线", "转正答辩",
    "跨组拉齐", "财年封版", "审计追问", "协作考核",
    "跨技能学习", "灰度事故", "年度述职", "终局评审"
  ];
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
  const chapter = getRunChapter(stage);
  const chapterStep = getChapterLocalStage(stage);
  const bossStage = isChapterBossStage(stage);
  const pressureStage = chapterStep === 3;
  const burstStage = chapterStep === 2 || bossStage;
  const midStage = Math.max(0, chapter - 2);
  const lateStage = Math.max(0, chapter - 4);
  const scalingStage = Math.max(0, stage - 1);
  const latePressure = Math.max(0, chapter - 3);

  var healthMult = 0.92 + chapter * 0.30 + chapterStep * 0.045 + scalingStage * 0.018 + midStage * 0.08 + (bossStage ? 0.28 : 0);
  var speedMult = 0.94 + chapter * 0.035 + chapterStep * 0.015 + lateStage * 0.035 + (burstStage ? 0.035 : 0);
  var damageMult = (0.92 + chapter * 0.11 + chapterStep * 0.025 + latePressure * 0.08) * (pressureStage || bossStage ? 1.08 : 1);
  var spawnInterval = Math.max(0.2, 0.74 - chapter * 0.055 - chapterStep * 0.018 - lateStage * 0.025) * (stage === 1 ? 1.35 : 1);
  var materialMult = 0.74 + chapter * 0.12 + lateStage * 0.04 + (bossStage ? 0.18 : 0);
  const earlyClearMult = chapter === 1 ? (stage === 1 ? 0.72 : stage === 2 ? 0.82 : 0.9) : 1;
  const earlyEnemyEase = chapter === 1 ? (stage === 1 ? 0.82 : stage === 2 ? 0.9 : 0.96) : 1;
  const earlySpeedEase = chapter === 1 ? (stage === 1 ? 0.9 : stage === 2 ? 0.94 : 0.98) : 1;

  var phase = getPhaseForStage(stage);
  var phasePressure = null;
  if (phase) {
    phasePressure = phase.enemyPressure;
    healthMult *= phasePressure.hpMult;
    speedMult *= phasePressure.speedMult;
    damageMult *= phasePressure.dmgMult;
    spawnInterval /= phasePressure.spawnRate;
  }

  // v0.3: 鐗规畩鍏冲崱鏈哄埗
  if (stage === 14) {
    materialMult *= 0.5;
  }
  if (stage === 18) {
    speedMult *= 1.20; // 瀹¤杩介棶：氭晫浜洪€熷害 +20%
  }
  healthMult *= earlyEnemyEase;
  damageMult *= earlyEnemyEase;
  speedMult *= earlySpeedEase;
  if (stage >= 13 && stage <= 18) {
    spawnInterval *= 1.08;
    healthMult *= 0.94;
    speedMult *= 0.95;
  }
  const midRunPerfEase = stage >= 13 && stage <= 18 ? 0.88 : 1;
  const batchLimit = stage >= 13 && stage <= 18 ? 4 : 6;

  return {
    name: names[Math.min(names.length - 1, stage - 1)],
    duration: WAVE_SECONDS + (bossStage ? 16 : 0) + (stage >= MAX_STAGE ? 12 : 0),
    totalEnemies: Math.round((20 + stage * 3.8 + chapter * 8 + chapterStep * 3 + (bossStage ? 16 : 0) - (chapter === 1 ? 8 - chapterStep : 0)) * earlyClearMult),
    maxConcurrent: Math.round((12 + chapter * 6 + chapterStep * 2.2 + (bossStage ? 10 : 0)) * (pressureStage ? 1.08 : 1) * (stage === 1 ? 0.66 : 1) * midRunPerfEase),
    spawnInterval: spawnInterval,
    batchSize: stage === 1 ? 1 : Math.min(batchLimit, 1 + Math.floor(chapter / 2) + (burstStage ? 1 : 0)),
    eliteTotal: Math.max(0, (bossStage ? chapter : Math.floor((stage - 1) / 5)) + (stage >= 16 ? 1 : 0)),
    healthMult: healthMult,
    speedMult: speedMult,
    damageMult: damageMult,
    materialMult: materialMult,
    enemyMix: mixes[Math.min(mixes.length - 1, stage - 1)],
    clearBonusMult: bossStage ? 1.35 : burstStage ? 1.16 : 1,
    survivalPressure: bossStage ? 1.14 : pressureStage ? 1.08 : burstStage ? 1.04 : 1,
    phaseId: phase ? phase.id : null,
    phaseName: phase ? phase.name : null,
    phasePressure: phasePressure,
    phaseIndex: phase ? phase.index : 0,
  };
}

function getEndlessStageConfig(level) {
  const mix = level < 2
    ? { bug: 0.2, change: 0.2, meeting: 0.2, deadline: 0.22, alarm: 0.1, audit: 0.08 }
    : level < 5
      ? { bug: 0.16, change: 0.18, meeting: 0.22, deadline: 0.24, alarm: 0.1, audit: 0.06, manager: 0.04 }
      : { bug: 0.12, change: 0.2, meeting: 0.24, deadline: 0.22, alarm: 0.08, audit: 0.08, manager: 0.06 };
  return {
    name: `鎸佺画鍔犵彮 ${level + 1}`,
    duration: Infinity,
    totalEnemies: Infinity,
    maxConcurrent: Math.round(44 + level * 3.2),
    spawnInterval: Math.max(0.18, 0.42 - level * 0.012),
    batchSize: Math.min(8, 5 + Math.floor(level / 3)),
    eliteTotal: Infinity,
    healthMult: 4.85 + level * 0.22 + level * level * 0.008,
    speedMult: 1.38 + level * 0.045,
    damageMult: 2.18 + level * 0.075,
    materialMult: 1.38 + level * 0.035,
    enemyMix: mix,
    clearBonusMult: 0,
    survivalPressure: 1.18 + level * 0.035,
  };
}

function rollOfficeIncident(stage) {
  const pool = [
    {
      id: "plusOne",
      title: "+1 鏉ヤ笅鍛戒护浜?",
      text: "鏈叧闇€姹傚彉澶氾紝浣嗘潗鏂欎篃鏇村€奸挶銆?",
      apply: (g) => {
        g.stageConfig.totalEnemies += 6 + Math.floor(stage * 0.8);
        g.stageConfig.materialMult += 0.08;
      },
    },
    {
      id: "bossCheck",
      title: "鑰佹澘鏉ユ鏌?",
      text: "绮捐嫳鍘嬪姏涓婂崌：屾竻鍦哄鍔辨彁楂樸€?",
      apply: (g) => {
        g.stageConfig.eliteTotal += stage >= 3 ? 1 : 0;
        g.elitesToSpawn = g.stageConfig.eliteTotal;
        g.stageConfig.clearBonusMult += 0.08;
      },
    },
    {
      id: "internOops",
      title: "瀹炰範鐢熷張闂ジ浜?",
      text: "瀹炰範鐢熶簨鏁呮€澶氾紝闄烽槺鏇村ソ澶勭悊銆?",
      apply: (g) => {
        g.stageConfig.enemyMix.intern = (g.stageConfig.enemyMix.intern || 0) + 0.16;
        g.stageConfig.spawnInterval *= 0.96;
      },
    },
    {
      id: "languageDoc",
      title: "澶栬闇€姹傛枃妗?",
      text: "灏勭▼鍜屽垢杩愭彁鍗囷紝瀹¤鍜屽彉鏇村帇鍔涙洿楂樸€?",
      apply: (g) => {
        g.player.range += 10;
        g.player.luck += 4;
        g.stageConfig.enemyMix.audit = (g.stageConfig.enemyMix.audit || 0) + (stage >= 5 ? 0.1 : 0);
        g.stageConfig.enemyMix.change = (g.stageConfig.enemyMix.change || 0) + 0.06;
      },
    },
    {
      id: "afterWorkWine",
      title: "涓嬬彮閰掑眬閭€绾?",
      text: "浼ゅ鍜屾毚鍑绘彁鍗囷紝浣嗗閿欐洿浣庛€?",
      apply: (g) => {
        addPlayerDamage(g, 0.04);
        g.player.crit = Math.min(75, g.player.crit + 2);
        g.player.maxHp = Math.max(60, g.player.maxHp - 3);
        g.player.hp = Math.min(g.player.hp, g.player.maxHp);
      },
    },
    {
      id: "serverCrash",
      title: "鏈嶅姟鍣ㄥ畷鏈轰簡",
      text: "閮ㄧ讲鍏ㄤ贡浜嗏€斺€斾絾娣蜂贡瀵逛綘鏈夊ソ澶勩€?",
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
  const cleanCopy = {
    plusOne: { title: "+1 来下命令了", text: "本关需求变多，但材料也更值钱。" },
    bossCheck: { title: "老板来检查", text: "精英压力上升，清场奖励提高。" },
    internOops: { title: "实习生又闯祸了", text: "小怪变多，陷阱和范围清理更好处理。" },
    languageDoc: { title: "外语需求文档", text: "射程和幸运提升，但审计和变更压力更高。" },
    afterWorkWine: { title: "下班酒局邀请", text: "伤害和暴击提升，但生命上限下降。" },
    serverCrash: { title: "服务器宕机了", text: "部署全乱了，但混乱也带来更多材料。" },
  };
  pool.forEach((event) => Object.assign(event, cleanCopy[event.id] || {}));
  return pool[(stage * 7 + Math.floor(Math.random() * pool.length)) % pool.length];
}

function applyOfficeIncident() {
  if (!game.currentIncident) return;
  game.currentIncident.apply(game);
}

const weaponUpgradePool = [
  {
    id: "coffee",
    title: "鍔犳祿鍜栧暋",
    tag: "姝﹀櫒 / 鐩村皠鐖嗗彂",
    text: "鍜栧暋灏勯€熸彁鍗囷紝瀛愬脊浼ゅ澧炲姞銆?",
    apply: (g) => {
      g.weapons.coffee.level += 1;
      g.player.coffeeCooldown *= 0.9;
    },
    available: (g) => g.weapons.coffee.level < g.weapons.coffee.max,
  },
  {
    id: "coffeePierce",
    title: "鍙屽€嶆祿缂?",
    tag: "姝﹀櫒 / 鐩村皠鐖嗗彂",
    text: "鍜栧暋瀛愬脊鑾峰緱棰濆绌块€忥紝閫傚悎鐐规潃绮捐嫳銆?",
    apply: (g) => {
      g.weapons.coffee.level += 1;
      g.player.coffeePierce += 1;
    },
    available: (g) => g.weapons.coffee.level >= 2 && g.weapons.coffee.level < g.weapons.coffee.max,
  },
  {
    id: "keyboard",
    title: "鏈烘閿酱",
    tag: "姝﹀櫒 / 杩戞垬鎵撳嚮",
    text: "閿洏鎸ュ姩鑼冨洿鎵╁ぇ：屼激瀹虫彁鍗囥€?",
    apply: (g) => {
      g.weapons.keyboard.level += 1;
      g.player.keyboardSwing += 1;
    },
    available: (g) => g.weapons.keyboard.level < g.weapons.keyboard.max,
  },
  {
    id: "keyboardBounce",
    title: "绌烘牸閿噸鍑?",
    tag: "姝﹀櫒 / 杩戞垬鎵撳嚮",
    text: "姣忕3娆℃尌鍔ㄨЕ鍙戦噸鍑伙紝鑼冨洿浼ゅ脳2.5銆?",
    apply: (g) => {
      g.weapons.keyboard.level += 1;
      g.player.keyboardKnockback += 1;
    },
    available: (g) => g.weapons.keyboard.level >= 2 && g.weapons.keyboard.level < g.weapons.keyboard.max,
  },
  {
    id: "headset",
    title: "闄嶅櫔鑰虫満",
    tag: "姝﹀櫒 / 闃插畧棰嗗煙",
    text: "瀹夐潤棰嗗煙鎵╁ぇ：屾寔缁激瀹虫彁鍗囥€?",
    apply: (g) => {
      g.weapons.headset.level += 1;
      g.player.auraRadius += 16;
      g.player.auraDamage += 2;
    },
    available: (g) => g.weapons.headset.level < g.weapons.headset.max,
  },
  {
    id: "headsetPulse",
    title: "鐧藉櫔鑴夊啿",
    tag: "姝﹀櫒 / 闃插畧棰嗗煙",
    text: "棰嗗煙鍛ㄦ湡鎬у嚮閫€闄勮繎鏁屼汉銆?",
    apply: (g) => {
      g.weapons.headset.level += 1;
      g.player.auraPulse += 1;
    },
    available: (g) => g.weapons.headset.level >= 2 && g.weapons.headset.level < g.weapons.headset.max,
  },
  {
    id: "report",
    title: "鏃嬭浆鎶ヨ〃",
    tag: "姝﹀櫒 / 杞ㄩ亾鎺у埗",
    text: "澧炲姞涓€浠界幆缁曟姤琛紝绋冲畾鍒囧壊杩戣韩鐩爣銆?",
    apply: (g) => {
      g.weapons.report.level += 1;
      g.player.orbitCount += 1;
    },
    available: (g) => g.weapons.report.level < g.weapons.report.max,
  },
  {
    id: "reportSpeed",
    title: "瀛ｅ害澶嶇洏",
    tag: "姝﹀櫒 / 杞ㄩ亾鎺у埗",
    text: "鎶ヨ〃鏃嬭浆鏇村揩：岃建閬撳崐寰勫鍔犮€?",
    apply: (g) => {
      g.weapons.report.level += 1;
      g.player.orbitSpeed += 0.75;
      g.player.orbitRadius += 8;
    },
    available: (g) => g.weapons.report.level >= 2 && g.weapons.report.level < g.weapons.report.max,
  },
  {
    id: "stapler",
    title: "閲嶅瀷璁功鏈?",
    tag: "姝﹀櫒 / 鎵囧舰鏁ｅ皠",
    text: "鑾峰緱鎴栧己鍖栬涔︽満：屽皠鍑烘墖褰㈣涔﹂拤寮瑰箷銆?",
    apply: (g) => {
      g.weapons.stapler.level += 1;
      g.player.staplerPellets += 1;
    },
    available: (g) => g.weapons.stapler.level < g.weapons.stapler.max,
  },
  {
    id: "staplerPunch",
    title: "鍔犲帤閽夊專",
    tag: "姝﹀櫒 / 鎵囧舰鏁ｅ皠",
    text: "璁功閽夊脊鐗囨暟澧炲姞：屽喎鍗寸缉鐭€?",
    apply: (g) => {
      g.weapons.stapler.level += 1;
      g.player.staplerCooldown *= 0.88;
    },
    available: (g) => g.weapons.stapler.level >= 2 && g.weapons.stapler.level < g.weapons.stapler.max,
  },
  {
    id: "sticky",
    title: "榛勮壊渚跨",
    tag: "姝﹀櫒 / 闄烽槺鎺у満",
    text: "鑾峰緱鎴栧己鍖栦究绛鹃櫡闃憋紝韪╁叆鑼冨洿鐨勬晫浜烘寔缁彈浼ゃ€?",
    apply: (g) => {
      g.weapons.sticky.level += 1;
      g.player.stickyRadius += 8;
    },
    available: (g) => g.weapons.sticky.level < g.weapons.sticky.max,
  },
  {
    id: "stickyStack",
    title: "渚跨澧?",
    tag: "姝﹀櫒 / 闄烽槺鎺у満",
    text: "渚跨鎸佺画鏇翠箙：屽竷缃€熷害鏇村揩銆?",
    apply: (g) => {
      g.weapons.sticky.level += 1;
      g.player.stickyCooldown *= 0.9;
      g.player.stickyLife += 0.8;
    },
    available: (g) => g.weapons.sticky.level >= 2 && g.weapons.sticky.level < g.weapons.sticky.max,
  },
  {
    id: "marker",
    title: "绱壊椹厠绗?",
    tag: "姝﹀櫒 / 璐┛灏勭嚎",
    text: "鑾峰緱鎴栧己鍖栭┈鍏嬬瑪：屽懆鏈熸€х敾鍑鸿疮绌垮皠绾裤€?",
    apply: (g) => {
      g.weapons.marker.level += 1;
      g.player.markerWidth += 1;
    },
    available: (g) => g.weapons.marker.level < g.weapons.marker.max,
  },
  {
    id: "markerInk",
    title: "琛ュ厖澧ㄦ按",
    tag: "姝﹀櫒 / 璐┛灏勭嚎",
    text: "椹厠绗斿皠绾夸激瀹虫彁鍗囷紝鍐峰嵈缂╃煭銆?",
    apply: (g) => {
      g.weapons.marker.level += 1;
      g.player.markerCooldown *= 0.9;
    },
    available: (g) => g.weapons.marker.level >= 2 && g.weapons.marker.level < g.weapons.marker.max,
  },
  {
    id: "calculator",
    title: "璐㈠姟璁＄畻鍣?",
    tag: "姝﹀櫒 / 杩為攣鐐规潃",
    text: "鑾峰緱鎴栧己鍖栬绠楀櫒：岀數娴佷細鍦ㄦ晫浜轰箣闂磋烦璺冦€?",
    apply: (g) => {
      g.weapons.calculator.level += 1;
      g.player.chainJumps += 1;
    },
    available: (g) => g.weapons.calculator.level < g.weapons.calculator.max,
  },
  {
    id: "calculatorTax",
    title: "鑷姩鎶ョ◣",
    tag: "姝﹀櫒 / 杩為攣鐐规潃",
    text: "璁＄畻鍣ㄨ繛閿佽窛绂诲拰浼ゅ鎻愬崌銆?",
    apply: (g) => {
      g.weapons.calculator.level += 1;
      g.player.chainRange += 28;
    },
    available: (g) => g.weapons.calculator.level >= 2 && g.weapons.calculator.level < g.weapons.calculator.max,
  },
  {
    id: "shredder",
    title: "妗岃竟纰庣焊鏈?",
    tag: "姝﹀櫒 / 瀹氬悜閿ュ舰",
    text: "鑾峰緱鎴栧己鍖栫绾告満：屽悜鏁屼汉鍠峰皠纰庣焊閿ュ舰銆?",
    apply: (g) => {
      g.weapons.shredder.level += 1;
      g.player.shredderConeAngle += 6;
      g.player.shredderRange += 10;
    },
    available: (g) => g.weapons.shredder.level < g.weapons.shredder.max,
  },
  {
    id: "shredderMotor",
    title: "宸ヤ笟绾х數鏈?",
    tag: "姝﹀櫒 / 瀹氬悜閿ュ舰",
    text: "閿ュ舰瑙掑害鎵╁ぇ：屾湁鏁堣窛绂诲鍔犮€?",
    apply: (g) => {
      g.weapons.shredder.level += 1;
      g.player.shredderConeAngle += 8;
      g.player.shredderRange += 14;
    },
    available: (g) => g.weapons.shredder.level >= 2 && g.weapons.shredder.level < g.weapons.shredder.max,
  },
  {
    id: "shredderFeed",
    title: "鍔犲杩涚焊鍙?",
    tag: "姝﹀櫒 / 瀹氬悜閿ュ舰",
    text: "纰庣焊浼ゅ澶у箙鎻愬崌：屾晫浜鸿缁炵鍚庡噺閫熸洿鏄庢樉銆?",
    apply: (g) => {
      g.weapons.shredder.level += 1;
      g.player.shredderDps += 5;
      g.player.shredderRange += 8;
    },
    available: (g) => g.weapons.shredder.level >= 2 && g.weapons.shredder.level < g.weapons.shredder.max,
  },
  {
    id: "shredderAuto",
    title: "鏈哄瘑閿€姣?",
    tag: "姝﹀櫒 / 瀹氬悜閿ュ舰",
    text: "閿ュ舰鍐呭嚮鏉€鏁屼汉瑙﹀彂绾稿睉鐖嗙偢：岃寖鍥存簠灏勪激瀹炽€?",
    apply: (g) => {
      g.weapons.shredder.level += 1;
      g.player.shredderConeAngle += 6;
      g.player.shredderRange += 6;
    },
    available: (g) => g.weapons.shredder.level >= 4 && g.weapons.shredder.level < g.weapons.shredder.max,
  },
  {
    id: "thermos",
    title: "淇濇俯鏉儹鑼?",
    tag: "姝﹀櫒 / 绔欐々娌荤枟",
    text: "鑾峰緱鎴栧己鍖栦繚娓╂澂：屽仠鐣欒搫鑼舵俯：岃捀姹芥不鐤楀苟鍑忛€熸晫浜恒€?",
    apply: (g) => {
      g.weapons.thermos.level += 1;
      g.player.thermosChargeBonus += 0.12;
    },
    available: (g) => g.weapons.thermos.level < g.weapons.thermos.max,
  },
  {
    id: "thermosLiner",
    title: "鐪熺┖鍐呰儐",
    tag: "姝﹀櫒 / 绔欏満缁埅",
    text: "淇濇俯鏉搫鑳芥洿蹇紝鑼舵俯涓婇檺鎻愬墠鎻愬崌銆?",
    apply: (g) => {
      g.weapons.thermos.level += 1;
      g.player.thermosChargeBonus += 0.22;
      g.player.thermosTeaMax += 18;
    },
    available: (g) => g.weapons.thermos.level >= 2 && g.weapons.thermos.level < g.weapons.thermos.max,
  },
  {
    id: "thermosSteam",
    title: "婊氱儷钂告苯",
    tag: "姝﹀櫒 / 棰嗗煙鎺у埗",
    text: "钂告苯鑼冨洿鎵╁ぇ：岄珮鑼舵俯鏃堕€犳垚鎸佺画浼ゅ銆?",
    apply: (g) => {
      g.weapons.thermos.level += 1;
      g.player.thermosRadius += 14;
    },
    available: (g) => g.weapons.thermos.level >= 2 && g.weapons.thermos.level < g.weapons.thermos.max,
  },
  {
    id: "thermosRefill",
    title: "鏃犻檺缁澂",
    tag: "姝﹀櫒 / 鏀彺鐖嗗彂",
    text: "楂樿尪娓╀細鐣欎笅鑼舵笉鍖猴紝婊℃澂鏃堕噴鏀句竴娆″叏鍦鸿尪鐖嗐€?",
    apply: (g) => {
      g.weapons.thermos.level += 1;
      g.player.thermosTeaMax += 24;
      g.player.thermosBurstHeal += 2;
    },
    available: (g) => g.weapons.thermos.level >= 4 && g.weapons.thermos.level < g.weapons.thermos.max,
  },
  {
    id: "coffeeThermos",
    title: "淇濇俯鏉画鑸?",
    tag: "姝﹀櫒 / 鐩村皠棰戠巼",
    text: "鍜栧暋鍐峰嵈鏄庢樉缂╃煭：屾敾閫熸敹鐩婃洿楂樸€?",
    apply: (g) => {
      g.weapons.coffee.level += 1;
      g.player.coffeeCooldown *= 0.84;
      addPlayerAttackSpeed(g, 4);
    },
    available: (g) => g.weapons.coffee.level >= 3 && g.weapons.coffee.level < g.weapons.coffee.max,
  },
  {
    id: "keyboardMacro",
    title: "瀹忓綍鍒?",
    tag: "姝﹀櫒 / 杩戞垬寮哄寲",
    text: "閿洏鎸ュ姩鑼冨洿鍜屼激瀹冲ぇ骞呮彁鍗囥€?",
    apply: (g) => {
      g.weapons.keyboard.level += 1;
      g.player.keyboardSwing += 2;
      addPlayerAttackSpeed(g, 3);
    },
    available: (g) => g.weapons.keyboard.level >= 3 && g.weapons.keyboard.level < g.weapons.keyboard.max,
  },
  {
    id: "headsetMetronome",
    title: "闄嶅櫔鑺傛媿鍣?",
    tag: "姝﹀櫒 / 棰嗗煙棰戠巼",
    text: "瀹夐潤棰嗗煙鑴夊啿鏇撮绻侊紝绔欏満娴佹洿瀹规槗鎺т綇杩戣韩鎬€?",
    apply: (g) => {
      g.weapons.headset.level += 1;
      g.player.auraPulse += 1;
      g.player.fortify += 1;
    },
    available: (g) => g.weapons.headset.level >= 3 && g.weapons.headset.level < g.weapons.headset.max,
  },
  {
    id: "reportBinder",
    title: "瑁呰鎶ヨ〃",
    tag: "姝﹀櫒 / 杞ㄩ亾鍘氬害",
    text: "鎶ヨ〃杞ㄩ亾鍗婂緞銆侀€熷害鍜岀鎾炶寖鍥存彁鍗囥€?",
    apply: (g) => {
      g.weapons.report.level += 1;
      g.player.orbitRadius += 10;
      g.player.orbitSpeed += 0.45;
    },
    available: (g) => g.weapons.report.level >= 3 && g.weapons.report.level < g.weapons.report.max,
  },
  {
    id: "staplerMagazine",
    title: "杩炲彂閽変粨",
    tag: "姝﹀櫒 / 杩戣窛棰戠巼",
    text: "璁功鏈哄喎鍗寸缉鐭紝骞跺鍔犻拤寮规暟閲忋€?",
    apply: (g) => {
      g.weapons.stapler.level += 1;
      g.player.staplerPellets += 2;
      g.player.staplerCooldown *= 0.9;
    },
    available: (g) => g.weapons.stapler.level >= 3 && g.weapons.stapler.level < g.weapons.stapler.max,
  },
  {
    id: "stickyCopyPaste",
    title: "澶嶅埗绮樿创",
    tag: "姝﹀櫒 / 闄烽槺 澶嶅埗",
    text: "渚跨甯冪疆鏇村揩：岃寖鍥存洿澶с€?",
    apply: (g) => {
      g.weapons.sticky.level += 1;
      g.player.stickyCooldown *= 0.84;
      g.player.stickyRadius += 10;
    },
    available: (g) => g.weapons.sticky.level >= 3 && g.weapons.sticky.level < g.weapons.sticky.max,
  },
  {
    id: "markerWide",
    title: "鑽у厜瀹藉ご",
    tag: "姝﹀櫒 / 璐┛鑼冨洿",
    text: "椹厠绗斿皠绾挎洿瀹斤紝閲婃斁鏇村揩銆?",
    apply: (g) => {
      g.weapons.marker.level += 1;
      g.player.markerWidth += 2.4;
      g.player.markerCooldown *= 0.86;
    },
    available: (g) => g.weapons.marker.level >= 3 && g.weapons.marker.level < g.weapons.marker.max,
  },
  {
    id: "calculatorLedger",
    title: "瀹¤鍙拌处",
    tag: "姝﹀櫒 / 杩為攣璺濈",
    text: "璁＄畻鍣ㄨ繛閿佽窛绂汇€佽烦鏁板拰骞歌繍鏀剁泭鎻愬崌銆?",
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
    title: "鎽搁奔姝ユ硶",
    tag: "灞炴€?/ 鏈哄姩",
    text: "绉诲姩閫熷害鎻愬崌：屽彈浼ゅ悗鐨勬棤鏁屾椂闂村彉闀裤€?",
    apply: (g) => {
      g.player.speed += 18;
      g.player.invulnBonus += 0.06;
    },
    available: (g) => g.player.speed < 360,
  },
  {
    id: "focus",
    title: "娣卞害涓撴敞",
    tag: "灞炴€?/ 杈撳嚭",
    text: "鎭㈠涓撴敞涓婇檺：屽苟灏忓箙鎻愬崌鍏ㄩ儴浼ゅ銆?",
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
    title: "蹇嵎閿倢鑲夎蹇?",
    tag: "灞炴€?/ 鏀婚€?",
    text: "鏀婚€?+12%：屽皬骞呮彁鍗囧皠绋嬨€?",
    apply: (g) => {
      addPlayerAttackSpeed(g, 12);
      g.player.range += 8;
    },
    available: (g) => g.player.attackSpeed < ATTACK_SPEED_HARD_CAP,
  },
  {
    id: "crit",
    title: "鐏靛厜涓€鐜?",
    tag: "灞炴€?/ 鏆村嚮",
    text: "鏆村嚮 +8%：屼激瀹?+3%銆?",
    apply: (g) => {
      g.player.crit = Math.min(75, g.player.crit + 8);
      addPlayerDamage(g, 0.03);
    },
    available: (g) => g.player.crit < 75,
  },
  {
    id: "range",
    title: "瓒呴暱鏁版嵁绾?",
    tag: "灞炴€?/ 灏勭▼",
    text: "灏勭▼ +35：屾嬀鍙?+12銆?",
    apply: (g) => {
      g.player.range += 35;
      g.player.pickupRange += 12;
    },
    available: (g) => g.player.range < 260,
  },
  {
    id: "padding",
    title: "浜轰綋宸ュ妞?",
    tag: "灞炴€?/ 闃插尽",
    text: "鐢熷懡涓婇檺鍜屾姢鐢叉彁鍗囷紝瀹归敊鏇撮珮銆?",
    apply: (g) => {
      g.player.maxHp += 16;
      g.player.hp += 16;
      g.player.armor += 2;
    },
    available: (g) => g.player.maxHp < 220,
  },
  {
    id: "dodge",
    title: "鑰佹澘瑙嗙嚎姝昏",
    tag: "灞炴€?/ 闂伩",
    text: "鑾峰緱闂伩鐜囷紝鏈€楂?60%銆?",
    apply: (g) => {
      g.player.dodge = Math.min(60, g.player.dodge + 8);
      g.player.speed += 8;
    },
    available: (g) => g.player.dodge < 60,
  },
  {
    id: "luck",
    title: "鐜勫宸ョ墝",
    tag: "灞炴€?/ 骞歌繍",
    text: "骞歌繍鎻愬崌：屽鍔犻澶栬ˉ缁欏拰灞炴€ц姱鐗囨帀钀姐€?",
    apply: (g) => {
      g.player.luck += 12;
      g.player.pickupRange += 10;
    },
    available: (g) => g.player.luck < 120,
  },
  {
    id: "regen",
    title: "鐑按缁澂",
    tag: "灞炴€?/ 鎭㈠",
    text: "鑾峰緱鐢熷懡鎭㈠：屽苟灏忓箙鎻愬崌鐢熷懡涓婇檺銆?",
    apply: (g) => {
      g.player.regen += 2;
      g.player.maxHp += 8;
      g.player.hp = Math.min(g.player.maxHp, g.player.hp + 18);
    },
    available: (g) => g.player.regen < 18,
  },
  {
    id: "magnet",
    title: "宸ヤ綅纾佸満",
    tag: "灞炴€?/ 缁忔祹",
    text: "鎵╁ぇ鎷惧彇鑼冨洿：岀粡楠屽拰琛ョ粰鏇村鏄撳悆鍒般€?",
    apply: (g) => {
      g.player.pickupRange += 42;
      g.player.luck += 4;
    },
    available: (g) => g.player.pickupRange < 420,
  },
  {
    id: "overclock",
    title: "瓒呴宸ヤ綅",
    tag: "灞炴€?/ 楂橀€?",
    text: "鏀婚€?+22%：屼激瀹?+5%：岀敓鍛戒笂闄?-8銆傞€傚悎寮瑰箷鍜岃繛閿佹祦銆?",
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
    title: "鐜荤拑缁╂晥",
    tag: "灞炴€?/ 鐖嗗彂",
    text: "浼ゅ +18%：屾毚鍑?+6%：屾姢鐢?-2銆傞€傚悎绮惧噯璐┛銆?",
    apply: (g) => {
      addPlayerDamage(g, 0.18);
      g.player.crit = Math.min(75, g.player.crit + 6);
      g.player.armor = Math.max(-6, g.player.armor - 2);
    },
    available: (g) => g.player.damageMult < DAMAGE_MULT_HARD_CAP,
  },
  {
    id: "compound",
    title: "棰勭畻澶嶅埄",
    tag: "灞炴€?/ 骞歌繍",
    text: "骞歌繍 +18：屾嬀鍙?+16銆傚垢杩愮幇鍦ㄥ悓鏃舵彁鍗囨潗鏂欏拰棰濆鎺夎惤銆?",
    apply: (g) => {
      g.player.luck += 18;
      g.player.pickupRange += 16;
    },
    available: (g) => g.stage <= 7 && g.player.luck < 180,
  },
  {
    id: "evasive",
    title: "婊戞鎽搁奔",
    tag: "灞炴€?/ 闂伩",
    text: "闂伩 +12%：岄€熷害 +14：屾姢鐢?-1銆傞€傚悎楂樻満鍔ㄧ粫鍦堛€?",
    apply: (g) => {
      g.player.dodge = Math.min(60, g.player.dodge + 12);
      g.player.speed += 14;
      g.player.armor = Math.max(-6, g.player.armor - 1);
    },
    available: (g) => g.player.dodge < 60,
  },
  {
    id: "fortifiedDesk",
    title: "鍥哄畾宸ヤ綅",
    tag: "灞炴€?/ 绔欏満",
    text: "绔欏満 +3：屾姢鐢?+1銆傚仠浣忕墖鍒诲悗棰嗗煙銆佽建閬撳拰鍑忎激浼氶€愭鍗囨俯銆?",
    apply: (g) => {
      g.player.fortify += 3;
      g.player.armor += 1;
    },
    available: (g) => g.player.fortify < 32,
  },
  {
    id: "quietField",
    title: "瀹夐潤闃茬嚎",
    tag: "灞炴€?/ 棰嗗煙",
    text: "绔欏満 +2：屾仮澶?+1：屽畨闈欓鍩熺殑鍛ㄦ湡鑴夊啿鏇存槑鏄俱€?",
    apply: (g) => {
      g.player.fortify += 2;
      g.player.regen += 1;
      g.player.armor += 1;
    },
    available: (g) => g.player.fortify < 36 || g.player.regen < 18,
  },
  {
    id: "trapManual",
    title: "宸ヤ綅甯冪嚎鎵嬪唽",
    tag: "灞炴€?/ 闄烽槺 澶嶅埗",
    text: "骞歌繍 +10：屾嬀鍙?+18銆傞櫡闃卞拰杩為攣鏁堟灉鏇村鏄撴粴璧锋潵銆?",
    apply: (g) => {
      g.player.luck += 10;
      g.player.pickupRange += 18;
    },
    available: (g) => g.player.luck < 190 || g.player.pickupRange < 450,
  },
  {
    id: "shieldProtocol",
    title: "闃茬伀澧欏崗璁?",
    tag: "灞炴€?/ 闃插尽",
    text: "鎶ょ敳 +3：岀珯鍦?+1銆傜珯浣忔椂鎵夸激杩涗竴姝ラ檷浣庛€?",
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
    title: "榛戣瘽鏈琛?",
    tag: "灞炴€?/ 灏勭▼ 骞歌繍",
    text: "灏勭▼ +24：屽垢杩?+8銆傛洿瀹规槗鐪嬫噦鍙樻洿銆佸璁″拰璺ㄧ粍闇€姹傘€?",
    apply: (g) => {
      g.player.range += 24;
      g.player.luck += 8;
    },
    available: (g) => g.stage <= 8 && (g.player.range < 330 || g.player.luck < 170),
  },
  {
    id: "afterWorkDrink",
    title: "涓嬬彮灏忛厭",
    tag: "灞炴€?/ 鐖嗗彂",
    text: "浼ゅ +10%：屾毚鍑?+4%：岄棯閬?-3%銆傜煭绾跨垎鍙戞洿鐚涖€?",
    apply: (g) => {
      addPlayerDamage(g, 0.1);
      g.player.crit = Math.min(75, g.player.crit + 4);
      g.player.dodge = Math.max(0, g.player.dodge - 3);
    },
    available: (g) => g.player.damageMult < DAMAGE_MULT_HARD_CAP || g.player.crit < 75,
  },
  {
    id: "bilingualMinutes",
    title: "鍙岃浼氳绾",
    tag: "灞炴€?/ 灏勭▼ 骞歌繍 鍚庢湡",
    text: "灏勭▼ +34：屽垢杩?+10：岃绠楀櫒杩為攣鏇磋繙：岄┈鍏嬬瑪鏇村鏄撴墦鍒板急鐐广€?",
    apply: (g) => {
      g.player.range += 34;
      g.player.luck += 10;
      g.player.chainRange += 24;
    },
    available: (g) => g.stage >= 5 && (g.player.range < 380 || g.player.luck < 190),
  },
  {
    id: "wineTableReview",
    title: "閰掑眬澶嶇洏",
    tag: "灞炴€?/ 鐖嗗彂 鍚庢湡",
    text: "浼ゅ +10%：屾毚鍑?+8%：岀敓鍛?-8銆傚悗鍗婄▼鏋佺杈撳嚭閫夋嫨銆?",
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
    title: "婵€鍏夌瑪鏍″噯",
    tag: "灞炴€?/ 姝﹀櫒涓撳睘",
    text: "椹┈鍏嬬瑪绛夌骇瓒婇珮鏀剁泭瓒婇珮：屽皠绋嬪拰鏆村嚮鎻愬崌銆?",
    apply: (g) => {
      g.player.range += 22 + g.weapons.marker.level * 5;
      g.player.crit = Math.min(75, g.player.crit + 4 + g.weapons.marker.level);
    },
    available: (g) => g.weapons.marker.level >= 2 && g.player.range < 360,
  },
  {
    id: "reportAuditTrail",
    title: "鎶ヨ〃瀹¤閾?",
    tag: "灞炴€?/ 姝﹀櫒涓撳睘",
    text: "鎶ヨ〃鍜岃绠楀櫒浼氭洿鍏嬪埗瀹¤銆佽鎶ュ拰鑰佹澘绫诲帇鍔涖€?",
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
    title: "闄嶅櫔鍫″瀿",
    tag: "灞炴€?/ 姝﹀櫒涓撳睘 棰嗗煙",
    text: "鑰虫満绛夌骇瓒婇珮：岀珯鍦恒€侀槻寰″拰鎭㈠鏀剁泭瓒婇珮銆傝鍥翠綇鏃舵洿瀹规槗绋充綇闃靛湴銆?",
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
    title: "鎶ヨ〃鐜舰婕旂粌",
    tag: "灞炴€?/ 姝﹀櫒涓撳睘 绔欏満",
    text: "鎶ヨ〃杞ㄩ亾鏇村帤：岀珯鍦鸿秺楂樿秺鑳芥尅浣忚繎韬帇鍔涖€?",
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
    title: "宸ヤ綅鍦伴浄璁稿彲",
    tag: "灞炴€?/ 姝﹀櫒涓撳睘 闄烽槺",
    text: "渚跨闄烽槺鏇村ぇ鏇翠箙：岄€傚悎鎶婇珮閫熸€壍杩涘伐浣嶉浄鍖恒€?",
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
    title: "鍚堝悓璇█瀛?",
    tag: "灞炴€?/ 灏勭▼ 骞歌繍 鍚庢湡",
    text: "灏勭▼鍜屽垢杩愬ぇ骞呮彁鍗囷紝骞跺己鍖栨縺鍏夌瑪銆佹姤琛ㄥ拰瀹¤鍏嬪埗銆?",
    apply: (g) => {
      g.player.range += 42;
      g.player.luck += 18;
      g.player.chainRange += 16;
    },
    available: (g) => g.stage >= 8 && (g.player.range < 430 || g.player.luck < 230),
  },
  {
    id: "socialDrinking",
    title: "閰掓鐮村眬",
    tag: "灞炴€?/ 鐖嗗彂 鍚庢湡",
    text: "浼ゅ鍜屾毚鍑诲ぇ骞呮彁鍗囷紝浣嗘姢鐢蹭笅闄嶃€傞€傚悎鐢ㄧ垎鍙戝帇杩囧悗鍗婄▼鍘嬪姏銆?",
    apply: (g) => {
      addPlayerDamage(g, 0.12);
      g.player.crit = Math.min(75, g.player.crit + 10);
      g.player.armor = Math.max(-8, g.player.armor - 2);
    },
    available: (g) => g.stage >= 8 && (g.player.damageMult < DAMAGE_MULT_HARD_CAP || g.player.crit < 75),
  },
  {
    id: "shredderMaintenance",
    title: "纰庣焊鏈虹淮鎶?",
    tag: "灞炴€?/ 姝﹀櫒涓撳睘 杩戣窛",
    text: "纰庣焊鏈洪敟褰㈣搴︺€佽寖鍥村拰浼ゅ鎻愬崌：岄€傚悎璐磋韩缁炵銆?",
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
    title: "鑼舵按闂磋妭濂?",
    tag: "灞炴€?/ 姝﹀櫒涓撳睘 绔欏満",
    text: "淇濇俯鏉搫鑼舵洿蹇紝绔欏満鍜屾仮澶嶆彁楂橈紝閫傚悎鎱㈡參鎶婇樀鍦扮儹璧锋潵銆?",
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
    title: "鍗辨満澶勭悊鎵嬪唽",
    tag: "灞炴€?/ 鎶ょ浘 鎷惧彇",
    text: "闈㈠楂橀€熷拰绮捐嫳鍘嬪姏鏃舵洿绋筹細鎶ょ敳銆佸垢杩愬拰鎷惧彇鎻愰珮銆?",
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
    title: "鍔犵彮渚垮綋",
    tag: "閬撳叿 / 鐢熷瓨",
    text: "鐢熷懡 +18：屾仮澶?+1銆?",
    apply: (g) => {
      g.player.maxHp += 18;
      g.player.hp = Math.min(g.player.maxHp, g.player.hp + 24);
      g.player.regen += 1;
    },
  },
  {
    id: "rubberSole",
    title: "闈欓煶闉嬪簳",
    tag: "閬撳叿 / 闂伩",
    text: "闂伩 +6%：岄€熷害 +10銆?",
    apply: (g) => {
      g.player.dodge = Math.min(60, g.player.dodge + 6);
      g.player.speed += 10;
    },
  },
  {
    id: "luckyBadge",
    title: "骞歌繍宸ョ墝璐?",
    tag: "閬撳叿 / 缁忔祹",
    text: "骞歌繍 +16銆傚垢杩愪細鍚屾椂鎻愬崌鏉愭枡鍜岄澶栨帀钀姐€?",
    apply: (g) => {
      g.player.luck += 16;
    },
  },
  {
    id: "oldHardDrive",
    title: "鏃х‖鐩?",
    tag: "閬撳叿 / 杈撳嚭",
    text: "浼ゅ +10%：岄€熷害 -8銆?",
    apply: (g) => {
      addPlayerDamage(g, 0.1);
      g.player.speed = Math.max(140, g.player.speed - 8);
    },
  },
  {
    id: "fileCabinet",
    title: "鏂囦欢鏌滄姢鏉?",
    tag: "閬撳叿 / 闃插尽",
    text: "鎶ょ敳 +4：岄棯閬?-3%銆?",
    apply: (g) => {
      g.player.armor += 4;
      g.player.dodge = Math.max(0, g.player.dodge - 3);
    },
  },
  {
    id: "wirelessMouse",
    title: "鏃犵嚎榧犳爣",
    tag: "閬撳叿 / 鎷惧彇",
    text: "鎷惧彇 +55：屽垢杩?+4銆?",
    apply: (g) => {
      g.player.pickupRange += 55;
      g.player.luck += 4;
    },
  },
  {
    id: "energyDrink",
    title: "鑳介噺楗枡",
    tag: "閬撳叿 / 鐖嗗彂",
    text: "浼ゅ +6%：岄€熷害 +14：岀敓鍛?-6銆?",
    apply: (g) => {
      addPlayerDamage(g, 0.06);
      g.player.speed += 14;
      g.player.maxHp = Math.max(40, g.player.maxHp - 6);
      g.player.hp = Math.min(g.player.hp, g.player.maxHp);
    },
  },
  {
    id: "deskFan",
    title: "妗岄潰灏忛鎵?",
    tag: "閬撳叿 / 鎺у満",
    text: "鎶ょ敳 +1：屾嬀鍙?+25：屾仮澶?+1銆?",
    apply: (g) => {
      g.player.armor += 1;
      g.player.pickupRange += 25;
      g.player.regen += 1;
    },
  },
  {
    id: "macroPad",
    title: "瀹忛敭灏忔澘",
    tag: "閬撳叿 / 鏀婚€?",
    text: "鏀婚€?+18%：屼激瀹?-4%銆?",
    apply: (g) => {
      addPlayerAttackSpeed(g, 18);
      g.player.damageMult = Math.max(0.45, g.player.damageMult - 0.04);
    },
  },
  {
    id: "redPen",
    title: "绾㈢瑪鎵规敞",
    tag: "閬撳叿 / 鏆村嚮",
    text: "鏆村嚮 +12%：屾姢鐢?-1銆?",
    apply: (g) => {
      g.player.crit = Math.min(75, g.player.crit + 12);
      g.player.armor = Math.max(0, g.player.armor - 1);
    },
  },
  {
    id: "projector",
    title: "浼氳鎶曞奖浠?",
    tag: "閬撳叿 / 灏勭▼",
    text: "灏勭▼ +55：岄€熷害 -10銆?",
    apply: (g) => {
      g.player.range += 55;
      g.player.speed = Math.max(140, g.player.speed - 10);
    },
  },
  {
    id: "laserPointer",
    title: "婵€鍏夌炕椤电瑪",
    tag: "閬撳叿 / 鏆村嚮 灏勭▼",
    text: "灏勭▼ +45：屾毚鍑?+10%：屾敾閫?-6%銆傜簿鍑嗚疮绌挎祦鏀剁泭鏇撮珮銆?",
    apply: (g) => {
      g.player.range += 45;
      g.player.crit = Math.min(75, g.player.crit + 10);
      g.player.attackSpeed = Math.max(-45, g.player.attackSpeed - 6);
    },
  },
  {
    id: "standingDesk",
    title: "鍗囬檷宸ヤ綅",
    tag: "閬撳叿 / 闂伩 鏀婚€?",
    text: "鏀婚€?+14%：岄棯閬?+8%：屾姢鐢?-1銆傚脊骞曡繎璺濇祦鏇寸伒娲汇€?",
    apply: (g) => {
      addPlayerAttackSpeed(g, 14);
      g.player.dodge = Math.min(60, g.player.dodge + 8);
      g.player.armor = Math.max(-6, g.player.armor - 1);
    },
  },
  {
    id: "assetLedger",
    title: "璧勪骇鍙拌处",
    tag: "閬撳叿 / 缁忔祹 鎷惧彇",
    text: "骞歌繍 +16：屾嬀鍙?+45：岄€熷害 -8銆傛潗鏂欏拰缁忛獙鍚稿緱鏇寸ǔ：屽悗缁垚闀挎洿蹇€?",
    apply: (g) => {
      g.player.luck += 16;
      g.player.pickupRange += 45;
      g.player.speed = Math.max(140, g.player.speed - 8);
    },
  },
  {
    id: "quietRoom",
    title: "闈欓煶浼氳瀹?",
    tag: "閬撳叿 / 闃插尽 鎭㈠",
    text: "鎶ょ敳 +3：屾仮澶?+2：屽皠绋?-18銆傛洿閫傚悎璐磋韩鎺у満鍜岀ǔ浣忛樀鍦般€?",
    apply: (g) => {
      g.player.armor += 3;
      g.player.regen += 2;
      g.player.range = Math.max(-40, g.player.range - 18);
    },
  },
  {
    id: "redlineContract",
    title: "绾㈢嚎鎵胯",
    tag: "閬撳叿 / 杈撳嚭 鐖嗗彂",
    text: "浼ゅ +16%：岀敓鍛?-10銆傞€傚悎鎯虫竻鍦烘嬁楂樺鍔辩殑鐖嗗彂鎵撴硶銆?",
    apply: (g) => {
      addPlayerDamage(g, 0.16);
      g.player.maxHp = Math.max(50, g.player.maxHp - 10);
      g.player.hp = Math.min(g.player.hp, g.player.maxHp);
    },
  },
  {
    id: "insuranceClause",
    title: "鍏滃簳鏉℃",
    tag: "閬撳叿 / 鐢熷瓨 鎺у埗",
    text: "鐢熷懡 +24：屾姢鐢?+2：屼激瀹?-6%銆傞€傚悎鍚庢湡绋充綇闃靛湴銆?",
    apply: (g) => {
      g.player.maxHp += 24;
      g.player.hp = Math.min(g.player.maxHp, g.player.hp + 24);
      g.player.armor += 2;
      g.player.damageMult = Math.max(0.55, g.player.damageMult - 0.06);
    },
  },
  {
    id: "ergonomicMat",
    title: "浜轰綋宸ュ鑴氬灚",
    tag: "閬撳叿 / 绔欏満 闃插尽",
    text: "绔欏満 +4：屾姢鐢?+2銆傚仠浣忓悗鏇村揩鎼捣瀹夊叏宸ヤ綅銆?",
    apply: (g) => {
      g.player.fortify += 4;
      g.player.armor += 2;
    },
  },
  {
    id: "whiteboardWall",
    title: "鐧芥澘闃茬嚎",
    tag: "閬撳叿 / 闄烽槺 鐜粫",
    text: "绔欏満 +2：屽垢杩?+8：屾嬀鍙栨彁鍗囥€傞€傚悎杈瑰畧杈瑰竷缃戙€?",
    apply: (g) => {
      g.player.fortify += 2;
      g.player.luck += 8;
      g.player.pickupRange += 24;
    },
  },
  {
    id: "deskLamp",
    title: "鍔犵彮灏忓彴鐏?",
    tag: "閬撳叿 / 鎭㈠ 绔欏満",
    text: "鎭㈠ +2：岀珯鍦?+2：屾姢鐢?+1銆傜珯浣忔椂鏇磋兘瀹堜綇闃靛湴銆?",
    apply: (g) => {
      g.player.regen += 2;
      g.player.fortify += 2;
      g.player.armor += 1;
    },
  },
  {
    id: "cableNest",
    title: "绾跨紗宸㈢┐",
    tag: "閬撳叿 / 杩為攣 鍑忛€?",
    text: "骞歌繍 +12：屾嬀鍙?+28銆備究绛惧拰鐢垫祦鏇村鏄撴粴璧锋潵銆?",
    apply: (g) => {
      g.player.pickupRange += 28;
      g.player.luck += 12;
    },
  },
  {
    id: "liquorCoffee",
    title: "鍜栧暋鍒╁彛閰?",
    tag: "閬撳叿 / 閰?鐖嗗彂",
    text: "浼ゅ +12%：屾毚鍑?+5%：屾敾閫?+8%：屾姢鐢?-1銆?",
    apply: (g) => {
      addPlayerDamage(g, 0.12);
      g.player.crit = Math.min(75, g.player.crit + 5);
      addPlayerAttackSpeed(g, 8);
      g.player.armor = Math.max(-6, g.player.armor - 1);
    },
  },
  {
    id: "translationHeadset",
    title: "鍚屼紶鑰抽害",
    tag: "閬撳叿 / 缈昏瘧 鎺у埗",
    text: "灏勭▼ +18：屾嬀鍙?+20：屽垢杩?+6銆傞鍩熷拰杩為攣鏇村鏄撹鎳傚満闈€?",
    apply: (g) => {
      g.player.pickupRange += 20;
      g.player.range += 18;
      g.player.luck += 6;
    },
  },
  {
    id: "foreignContract",
    title: "澶栨枃鍚堝悓",
    tag: "閬撳叿 / 缈昏瘧 缁忔祹",
    text: "灏勭▼ +24：屽垢杩?+16銆傚璁″帇鍔涗細鏇村ソ澶勭悊銆?",
    apply: (g) => {
      g.player.range += 24;
      g.player.luck += 16;
    },
  },
  // Mythic items (P0-2) - at most 1 per game
  {
    id: "stockOptions",
    title: "鍏ㄥ憳鎸佽偂",
    tag: "閬撳叿 / 绁炶瘽",
    text: "鎵€鏈夋鍣ㄧ瓑绾?1：堝彲绐佺牬涓婇檺鑷?绾э級：屾毚鍑?25%銆?",
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
    available: (g) => !g.boughtItemTags.includes("mythic") && g.stage >= 8,
  },
  {
    id: "noncompete",
    title: "绔炰笟绂佹",
    tag: "閬撳叿 / 绁炶瘽",
    text: "鐗虹壊涓€涓鍣ㄦЫ浣嶏紝鎵€鏈夊墿浣欐鍣ㄤ激瀹趁?.5銆?",
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
    title: "灞呭鍔炲叕",
    tag: "閬撳叿 / 绁炶瘽",
    text: "鎷惧彇鑼冨洿脳3：岀珯妗╂椂姣忕鑷姩鎷惧彇鍏ㄥ睆鎺夎惤銆?",
    rarity: "mythic",
    apply: (g) => {
      g.player.pickupRange *= 3;
      g.wfhActive = true;
      g.boughtItemTags.push("mythic");
    },
    available: (g) => !g.boughtItemTags.includes("mythic") && (g.endless || g.stage >= 9),
  },
];

const itemRarityMeta = {
  common: { label: "鏅€?", recycle: 4, weight: 1 },
  rare: { label: "绋€鏈?", recycle: 7, weight: 2 },
  epic: { label: "鍙茶瘲", recycle: 12, weight: 4 },
  legendary: { label: "浼犺", recycle: 18, weight: 7 },
  mythic: { label: "绁炶瘽", recycle: 30, weight: 38 },
};

const itemRarityById = {
  lunchbox: "common",
  rubberSole: "common",
  luckyBadge: "common",
  oldHardDrive: "rare",
  fileCabinet: "common",
  wirelessMouse: "common",
  energyDrink: "rare",
  deskFan: "common",
  macroPad: "rare",
  redPen: "rare",
  projector: "rare",
  laserPointer: "epic",
  standingDesk: "epic",
  assetLedger: "rare",
  quietRoom: "rare",
  redlineContract: "epic",
  insuranceClause: "epic",
  ergonomicMat: "rare",
  whiteboardWall: "epic",
  deskLamp: "rare",
  cableNest: "rare",
  liquorCoffee: "legendary",
  translationHeadset: "epic",
  foreignContract: "legendary",
};

for (const item of itemPool) {
  item.rarity = itemRarityById[item.id] || "common";
}

const weaponUpgradeCopy = {
  coffee: ["挂耳咖啡", "武器 / 高频命中", "提升咖啡弹频率和基础伤害。"],
  coffeePierce: ["双倍滤泡", "武器 / 跳点穿透", "咖啡弹额外穿透，适合把敌人拉成队列。"],
  coffeeThermos: ["自动续杯加压", "武器 / 高频续杯", "咖啡冷却明显缩短，续杯系统更快启动。"],
  keyboard: ["机械键盘", "武器 / 近身击退", "获得或强化键盘挥击，扩大近身解围范围。"],
  keyboardBounce: ["回车重击", "武器 / 近身爆发", "每几次挥击触发一次重击，范围和击退更强。"],
  keyboardMacro: ["宏键连打", "武器 / 连打强化", "键盘挥击范围和副挥击频率提升。"],
  headset: ["降噪耳机", "武器 / 声场领域", "扩大声场范围，让绕圈站位更有收益。"],
  headsetPulse: ["白噪脉冲", "武器 / 声波脉冲", "声场周期击退附近敌人，补足近身压力。"],
  headsetMetronome: ["降噪节拍器", "武器 / 领域频率", "声场脉冲更频繁，站场控制更稳定。"],
  report: ["季度报表", "武器 / 轨道切割", "增加环绕报表页，贴边绕圈时更容易刮到敌人。"],
  reportSpeed: ["季度复盘", "武器 / 轨道加速", "报表旋转更快，轨道半径增加。"],
  reportBinder: ["装订报表", "武器 / 轨道厚度", "报表轨道半径、速度和碰撞范围提升。"],
  stapler: ["订书机", "武器 / 扇形钉幕", "获得或强化订书机，向前射出扇形钉幕。"],
  staplerPunch: ["加厚钉匣", "武器 / 钉幕频率", "钉幕弹片增加，冷却缩短。"],
  staplerMagazine: ["连发钉匣", "武器 / 连发封锁", "订书机冷却缩短，并增加钉幕数量。"],
  sticky: ["即时贴", "武器 / 地面布阵", "获得或强化即时贴，在地面留下减速陷阱。"],
  stickyStack: ["贴纸堆叠", "武器 / 留场强化", "贴纸持续更久，布置速度更快。"],
  stickyCopyPaste: ["复制粘贴", "武器 / 布阵扩张", "贴纸布置更快，陷阱范围更大。"],
  marker: ["马克笔", "武器 / 贯穿光线", "获得或强化马克笔，周期性画出长射程贯穿光线。"],
  markerInk: ["补充墨水", "武器 / 光线频率", "马克笔光线伤害提升，冷却缩短。"],
  markerWide: ["荧光宽头", "武器 / 光线宽度", "马克笔光线更宽，释放更快。"],
  calculator: ["财务计算器", "武器 / 数字跳点", "获得或强化计算器，数字弹会在敌人之间跳点。"],
  calculatorTax: ["自动报税", "武器 / 跳点距离", "计算器跳点距离和伤害提升。"],
  calculatorLedger: ["审计台账", "武器 / 账目结算", "计算器跳点、账目结算和材料收益提升。"],
  shredder: ["碎纸机", "武器 / 锥形粉碎", "获得或强化碎纸机，向前喷出锥形粉碎区域。"],
  shredderMotor: ["工业级电机", "武器 / 锥形扩张", "碎纸机锥形角度扩大，有效距离增加。"],
  shredderFeed: ["加宽进纸口", "武器 / 粉碎压制", "碎纸机伤害、范围和减速效果提升。"],
  shredderAuto: ["机密销毁", "武器 / 纸屑爆发", "锥形内击杀敌人会触发纸屑爆炸。"],
  thermos: ["保温杯", "武器 / 蓄热蒸汽", "获得或强化保温杯，积热后释放蒸汽。"],
  thermosLiner: ["真空内胆", "武器 / 蓄热速度", "保温杯蓄热更快，热量上限提高。"],
  thermosSteam: ["滚烫蒸汽", "武器 / 蒸汽范围", "蒸汽范围扩大，高热量时造成持续伤害。"],
  thermosRefill: ["无限续杯", "武器 / 沸点爆发", "高茶温会留下热区，满杯时释放场地爆发。"],
};

const statUpgradeCopy = {
  sprint: ["疾跑工牌", "属性 / 走位", "移速 +18；受击后的无敌时间略微变长。"],
  focus: ["专注加班", "属性 / 通用输出", "最大生命提高，并小幅提升所有伤害。"],
  attackSpeed: ["手速热身", "属性 / 频率", "攻击频率 +12%；射程小幅提升。"],
  crit: ["灵光一闪", "属性 / 暴击", "暴击率 +8%；伤害小幅提升。"],
  range: ["超长数据线", "属性 / 射程", "射程 +35；拾取范围 +12。"],
  padding: ["人体工学椅", "属性 / 生存", "最大生命和护甲提高，容错更高。"],
  dodge: ["视线死角", "属性 / 闪避", "闪避率提高，并获得少量移速。"],
  luck: ["幸运工牌", "属性 / 掉落", "幸运提高，材料和额外掉落更稳定。"],
  regen: ["热水续杯", "属性 / 回复", "获得生命回复，并提高少量最大生命。"],
  magnet: ["桌面磁场", "属性 / 拾取", "扩大拾取范围，经验和材料更容易吃到。"],
  overclock: ["超频工位", "属性 / 高风险频率", "攻击频率和伤害提高，但最大生命下降。"],
  glassBuild: ["玻璃大炮", "属性 / 高风险输出", "伤害和暴击提高，但护甲下降。"],
  compound: ["预算复利", "属性 / 资源", "幸运和拾取提高，让材料与经验副线更顺。"],
  fortify: ["站稳脚跟", "属性 / 站场", "站场和护甲提高，停住片刻后更能扛压。"],
  quietField: ["安静防线", "属性 / 领域", "站场与回复提高，适合领域和轨道打法。"],
  trapManual: ["布阵手册", "属性 / 陷阱", "幸运和拾取提高，陷阱与连锁更容易滚起来。"],
  shieldProtocol: ["防火墙协议", "属性 / 防御", "护甲、站场和最大生命提高。"],
  glossary: ["术语表", "属性 / 射程资源", "射程和幸运提高，更容易处理远程与审计压力。"],
  afterWorkDrink: ["下班小酌", "属性 / 爆发", "伤害和暴击提高，但闪避下降。"],
  bilingualMinutes: ["双语会议纪要", "属性 / 后期射程", "射程、幸运与计算器跳点距离提高。"],
  wineTableReview: ["酒局复盘", "属性 / 后期爆发", "伤害和暴击大幅提高，但最大生命下降。"],
  laserCalibration: ["激光校准", "属性 / 马克笔专属", "马克笔等级越高，射程和暴击收益越高。"],
  reportAuditTrail: ["报表审计链", "属性 / 报表计算器", "强化报表和计算器对审计、警报、经理压力的处理。"],
  noiseCancelFort: ["降噪堡垒", "属性 / 耳机领域", "耳机等级越高，站场、防御和恢复收益越高。"],
  paperOrbitDrill: ["报表环形演练", "属性 / 报表站场", "报表轨道更厚，站场越高越能挡住近身压力。"],
  deskMinePermit: ["工位布线许可", "属性 / 即时贴", "即时贴范围更大更久，适合牵引高速怪进贴纸区。"],
  contractLanguage: ["合同语言学", "属性 / 后期射程", "大幅提升射程和幸运，并强化马克笔、报表、计算器的克制面。"],
  socialDrinking: ["酒桌破局", "属性 / 后期爆发", "伤害和暴击大幅提高，但护甲下降。"],
  shredderMaintenance: ["碎纸机维护", "属性 / 碎纸机专属", "碎纸机锥形角度、范围和伤害提升。"],
  teaRoomRoutine: ["茶水间节奏", "属性 / 保温杯专属", "保温杯蓄热更快，站场与恢复提高。"],
  crisisManual: ["危机处理手册", "属性 / 稳定", "面对高速和精英压力时更稳：护甲、幸运和拾取提高。"],
};

const itemCopy = {
  lunchbox: ["加班便当", "道具 / 生存", "生命 +18；回复 +1。"],
  rubberSole: ["静音鞋底", "道具 / 闪避", "闪避 +6%；速度 +10。"],
  luckyBadge: ["幸运工牌夹", "道具 / 经济", "幸运 +16，材料掉落更稳定。"],
  oldHardDrive: ["旧硬盘", "道具 / 输出", "伤害 +10%；速度 -8。"],
  fileCabinet: ["文件柜护板", "道具 / 防御", "护甲 +4；闪避 -3%。"],
  wirelessMouse: ["无线鼠标", "道具 / 拾取", "拾取 +55；幸运 +4。"],
  energyDrink: ["能量饮料", "道具 / 爆发", "伤害和速度提高，但最大生命下降。"],
  deskFan: ["桌面小风扇", "道具 / 控场", "护甲、拾取与回复提高。"],
  macroPad: ["宏键小板", "道具 / 频率", "攻击频率提高，但伤害略降。"],
  redPen: ["红笔批注", "道具 / 暴击", "暴击提高，但护甲下降。"],
  projector: ["会议投影仪", "道具 / 射程", "射程大幅提高，但速度下降。"],
  laserPointer: ["激光翻页笔", "道具 / 暴击射程", "射程和暴击提高，适合贯穿线性武器。"],
  standingDesk: ["升降工位", "道具 / 机动", "攻速和闪避提高，但护甲下降。"],
  assetLedger: ["资产台账", "道具 / 资源", "幸运和拾取提高，但速度下降。"],
  quietRoom: ["静音会议室", "道具 / 生存", "护甲和回复提高，但射程下降。"],
  redlineContract: ["红线承诺", "道具 / 高风险输出", "伤害大幅提高，但最大生命下降。"],
  insuranceClause: ["兜底条款", "道具 / 生存控制", "生命和护甲提高，但伤害下降。"],
  ergonomicMat: ["人体工学脚垫", "道具 / 站场", "站场和护甲提高。"],
  whiteboardWall: ["白板防线", "道具 / 布阵", "站场、幸运和拾取提高。"],
  deskLamp: ["加班小台灯", "道具 / 回复站场", "回复、站场和护甲提高。"],
  cableNest: ["线缆巢穴", "道具 / 连锁减速", "拾取和幸运提高。"],
  liquorCoffee: ["咖啡利口酒", "道具 / 爆发", "伤害、暴击和攻速提高，但护甲下降。"],
  translationHeadset: ["同传耳机", "道具 / 控场", "拾取、射程和幸运提高。"],
  foreignContract: ["外文合同", "道具 / 经济", "射程和幸运提高。"],
  stockOptions: ["全员持股", "道具 / 神话", "所有已拥有武器等级 +1，并大幅提高暴击。"],
  noncompete: ["竞业禁止", "道具 / 神话", "牺牲一个武器槽，剩余武器伤害大幅提高。"],
  wfh: ["居家办公", "道具 / 神话", "拾取范围大幅提高，站场时自动吸取掉落。"],
};

function applyCopyPatch(pool, copy) {
  for (const entry of pool || []) {
    const patch = copy[entry.id];
    if (!patch) continue;
    entry.title = patch[0];
    entry.tag = patch[1];
    entry.text = patch[2];
  }
}

applyCopyPatch(weaponUpgradePool, weaponUpgradeCopy);
applyCopyPatch(statUpgradePool, statUpgradeCopy);
applyCopyPatch(itemPool, itemCopy);

// Visible copy guard: previous data may contain mojibake from older migration patches.
// Keep the balance/effects intact and overwrite only player-facing text.
const cleanWeaponUpgradeCopy = {
  coffee: ["挂耳咖啡", "武器 / 追踪续杯", "获得或强化挂耳咖啡：自动追踪最近敌人，适合补稳定命中。"],
  coffeePierce: ["续杯滤包", "武器 / 咖啡补强", "咖啡弹命中更频繁，当前工牌形态会获得对应强化。"],
  coffeeThermos: ["保温滤杯", "武器 / 咖啡生存", "咖啡路线补一点恢复与续航，适合压力较高时购买。"],
  keyboard: ["机械键盘", "武器 / 近身击退", "获得或强化键盘：近身扇形挥击，击退贴脸敌人。"],
  keyboardBounce: ["回车键帽", "武器 / 键盘爆发", "键盘挥击获得更强节奏，命中后更容易打出追加效果。"],
  keyboardMacro: ["宏键脚本", "武器 / 键盘连打", "键盘获得更高频率和连击成长。"],
  headset: ["降噪耳机", "武器 / 声场领域", "获得或强化降噪耳机：角色周围形成声场，适合绕圈站场。"],
  headsetPulse: ["低音脉冲", "武器 / 耳机爆发", "声场周期释放更明显的脉冲，清贴脸怪更稳。"],
  headsetMetronome: ["节拍器", "武器 / 耳机节奏", "声场频率更稳定，适合接力传播路线。"],
  report: ["季度报表", "武器 / 环绕切割", "获得或强化季度报表：报表页环绕角色，贴边切割敌人。"],
  reportSpeed: ["自动刷新报表", "武器 / 报表补页", "报表页刷新更快，维持环绕输出。"],
  reportBinder: ["KPI 审判夹", "武器 / 报表结算", "强化高价值目标窗口结算，适合打精英和 Boss。"],
  stapler: ["订书机", "武器 / 扇面装订", "获得或强化订书机：向前方射出钉幕，封住怪群入口。"],
  staplerPunch: ["加压钉匣", "武器 / 订书机爆钉", "钉幕更密，命中后的装订/封锁收益更高。"],
  staplerMagazine: ["电动钉匣", "武器 / 订书机连射", "弹匣式爆发更明显，但需要留意空窗。"],
  sticky: ["即时贴", "武器 / 贴纸布阵", "获得或强化即时贴：在地面放置贴纸陷阱，适合提前布阵。"],
  stickyStack: ["便签叠层", "武器 / 贴纸数量", "增加贴纸密度，让区域控制更容易成形。"],
  stickyCopyPaste: ["复制粘贴贴", "武器 / 贴纸连线", "贴纸更容易形成连线与公告板区域。"],
  marker: ["马克笔", "武器 / 贯穿激光", "获得或强化马克笔：长射程贯穿光线，拉直线清怪。"],
  markerInk: ["荧光墨水", "武器 / 马克笔频率", "马克笔发射更快，当前工牌形态触发更频繁。"],
  markerWide: ["加粗笔头", "武器 / 马克笔范围", "光束更宽或后续效果更大，容错更高。"],
  calculator: ["财务计算器", "武器 / 跳点结算", "获得或强化计算器：数字弹在敌人间跳点结算。"],
  calculatorTax: ["税率公式", "武器 / 计算器跳点", "跳点次数和结算收益提高。"],
  calculatorAudit: ["审计底稿", "武器 / 计算器挂账", "强化挂账、结算和资源收益。"],
  shredder: ["碎纸机", "武器 / 锥形粉碎", "获得或强化碎纸机：前方锥形持续粉碎，需要朝向怪群。"],
  shredderCone: ["宽口粉碎槽", "武器 / 碎纸机范围", "粉碎锥形更宽，正面压制更稳。"],
  shredderVortex: ["纸屑龙卷", "武器 / 碎纸机终局", "更快积攒纸屑，召唤牵引小怪的龙卷。"],
  thermos: ["保温杯", "武器 / 蓄热蒸汽", "获得或强化保温杯：积热后释放蒸汽，节奏慢但爆发强。"],
  thermosSteam: ["蒸汽阀门", "武器 / 保温杯释放", "蒸汽释放更大更痛，蓄热路线更清楚。"],
  thermosBurst: ["沸点阀门", "武器 / 保温杯爆发", "强化沸点窗口，释放高伤蒸汽柱。"],
};

const cleanStatUpgradeCopy = {
  sprint: ["摸鱼步法", "属性 / 机动", "移动速度 +18，受击后的无敌时间更长。"],
  focus: ["专注执行", "属性 / 输出生存", "生命、伤害和拾取范围小幅提升。"],
  attackSpeed: ["机械键节奏", "属性 / 攻速", "攻速 +12%，射程 +8。"],
  crit: ["红笔批注", "属性 / 暴击", "暴击 +8%，伤害 +3%。"],
  range: ["长线视野", "属性 / 射程", "射程 +35，拾取范围 +12。"],
  padding: ["人体工学椅", "属性 / 生存", "最大生命 +16，护甲 +2。"],
  dodge: ["灵活走位", "属性 / 闪避", "闪避 +8%，移动速度 +8。"],
  luck: ["玄学工牌", "属性 / 资源", "幸运 +12，掉落更稳定。"],
  regen: ["自动回血", "属性 / 回复", "回血 +2，最大生命 +8，并立即恢复。"],
  magnet: ["磁吸桌面", "属性 / 拾取", "拾取范围 +42，幸运 +4。"],
  overclock: ["临时超频", "属性 / 高风险频率", "攻速 +22%，伤害 +5%，最大生命 -8。"],
  glassBuild: ["玻璃大炮", "属性 / 高风险输出", "伤害 +18%，暴击 +6%，护甲 -2。"],
  compound: ["复合收益", "属性 / 资源", "幸运 +18，拾取范围 +16。"],
  evasive: ["滑步规避", "属性 / 闪避", "闪避 +12%，速度 +14，护甲 -1。"],
  fortifiedDesk: ["加固工位", "属性 / 站场", "站场 +3，护甲 +1。"],
  quietField: ["安静防线", "属性 / 领域", "站场 +2，回血 +1，护甲 +1。"],
  trapManual: ["布阵手册", "属性 / 陷阱资源", "幸运 +10，拾取范围 +18。"],
  shieldProtocol: ["防火墙协议", "属性 / 防御", "护甲 +3，站场 +1，最大生命 +8。"],
  glossary: ["术语表", "属性 / 射程资源", "射程 +24，幸运 +8。"],
  afterWorkDrink: ["下班小酌", "属性 / 爆发", "伤害 +10%，暴击 +4%，闪避 -3%。"],
  bilingualMinutes: ["双语会议纪要", "属性 / 后期射程", "射程 +34，幸运 +10，跳点距离提升。"],
  wineTableReview: ["酒局复盘", "属性 / 后期爆发", "伤害 +10%，暴击 +8%，最大生命 -8。"],
  laserCalibration: ["激光校准", "属性 / 马克笔专属", "马克笔等级越高，射程和暴击收益越高。"],
  reportAuditTrail: ["报表审计链", "属性 / 报表计算器", "强化报表和计算器对高压目标的处理。"],
  noiseCancelFort: ["降噪堡垒", "属性 / 耳机领域", "耳机等级越高，站场、防御和恢复收益越高。"],
  paperOrbitDrill: ["报表环形演练", "属性 / 报表站场", "报表轨道更厚，站场越高越能挡住近身压力。"],
  deskMinePermit: ["工位布线许可", "属性 / 即时贴", "即时贴范围更大更久。"],
  contractLanguage: ["合同语言学", "属性 / 后期射程", "射程和幸运大幅提升。"],
  socialDrinking: ["酒桌破局", "属性 / 后期爆发", "伤害和暴击大幅提高，但护甲下降。"],
  shredderMaintenance: ["碎纸机维护", "属性 / 碎纸机专属", "碎纸机锥形角度、范围和伤害提升。"],
  teaRoomRoutine: ["茶水间节奏", "属性 / 保温杯专属", "保温杯蓄热更快，站场与恢复提高。"],
  crisisManual: ["危机处理手册", "属性 / 稳定", "高速和精英压力下更稳，护甲、幸运和拾取提高。"],
};

const cleanItemCopy = {
  lunchbox: ["便利店便当", "道具 / 生存", "立即回血并提高最大生命，给成型前多一点容错。"],
  redPen: ["红笔批注", "道具 / 输出", "提高暴击和伤害，适合高频命中或窗口爆发。"],
  laserPointer: ["激光翻页笔", "道具 / 马克笔", "强化射程和精准收益，让光线类武器更容易打满。"],
  ergonomicChair: ["人体工学椅", "道具 / 生存", "提高护甲和生命，降低贴脸怪的惩罚。"],
  deskFan: ["桌面小风扇", "道具 / 机动", "提高移动速度和击退抗压，适合拉怪走位。"],
  noiseFort: ["降噪堡垒", "道具 / 站场", "强化领域、防御和恢复路线。"],
  thermosUpgrade: ["保温杯内胆", "道具 / 保温杯", "蓄热更快，蒸汽释放更稳定。"],
  stickyPrinter: ["便签打印机", "道具 / 即时贴", "贴纸数量和持续时间提高，布阵更容易成型。"],
  snackDrawer: ["零食抽屉", "道具 / 资源生存", "材料与生命都更稳，适合前中期补底盘。"],
  cloudDrive: ["云盘备份", "道具 / 保险", "受到致命伤时保留一线机会，并恢复少量生命。"],
  stockOptions: ["全员持股", "道具 / 神话", "所有已拥有武器等级 +1，并大幅提高暴击。"],
  noncompete: ["竞业禁止", "道具 / 神话", "减少一个武器槽，剩余武器伤害大幅提高。"],
  wfh: ["居家办公", "道具 / 神话", "拾取范围大幅提高，站场时自动吸取掉落。"],
};

applyCopyPatch(weaponUpgradePool, cleanWeaponUpgradeCopy);
applyCopyPatch(statUpgradePool, cleanStatUpgradeCopy);
applyCopyPatch(itemPool, cleanItemCopy);

const permanentUpgrades = [
  {
    id: "maxHp",
    title: "鍏ヨ亴浣撴",
    text: "姣忕骇寮€灞€鐢熷懡涓婇檺 +8銆?",
    costs: [75, 150, 300, 520],
    apply: (g, level) => {
      g.player.maxHp += level * 8;
      g.player.hp += level * 8;
    },
  },
  {
    id: "speed",
    title: "閫氬嫟璺嚎",
    text: "姣忕骇寮€灞€绉诲姩閫熷害 +6銆?",
    costs: [75, 180, 360],
    apply: (g, level) => {
      g.player.speed += level * 6;
    },
  },
  {
    id: "materials",
    title: "鍔炲叕鎶藉眽",
    text: "姣忕骇寮€灞€鏉愭枡 +3銆?",
    costs: [90, 200, 420],
    apply: (g, level) => {
      g.materials += level * 3;
    },
  },
  {
    id: "luck",
    title: "鐜勫宸ョ墝澶?",
    text: "姣忕骇寮€灞€骞歌繍 +5銆?",
    costs: [110, 250, 520],
    apply: (g, level) => {
      g.player.luck += level * 5;
    },
  },
  {
    id: "refresh",
    title: "渚涘簲鍟嗙啛浜?",
    text: "姣忕骇宸ュ潑鍒锋柊璐圭敤 -1銆?",
    costs: [220, 460],
    apply: () => {},
  },
];
const permanentUpgradeCopy = {
  maxHp: ["入职体检", "每级开局生命上限 +8。"],
  speed: ["通勤路线", "每级开局移动速度 +6。"],
  materials: ["办公抽屉", "每级开局材料 +3。"],
  luck: ["玄学工牌套", "每级开局幸运 +5。"],
  refresh: ["供应商熟人", "每级工坊刷新费用 -1。"],
};
permanentUpgrades.forEach((upgrade) => {
  const patch = permanentUpgradeCopy[upgrade.id];
  if (!patch) return;
  upgrade.title = patch[0];
  upgrade.text = patch[1];
});

function createGame() {

// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
//  LAYER 03 (cont): 娓告垙鐢熷懡鍛ㄦ湡
//  鍒涘缓路寮€濮嬄风瓥鐣ラ€夋嫨路姘镐箙鍗囩骇
// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
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
    weaponSlots: 1,
    itemSlots: 6,
    rerollCount: 0,
    shopOffers: [],
    lockedShopOffers: [],
    armoryContext: null,
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
    stageCardChoices: 0,
    stageWeaponPurchases: 0,
    catchupCardStages: new Set(),
    upgradeReturnState: "playing",
    xp: 0,
    xpNext: 26,
    spawnTimer: 0,
    eliteTimer: 24,
    projectiles: [],
    enemies: [],
    particles: [],
    coffeeDrones: [],
    staplerAnchors: [],
    markerVfxEvents: [],
    floatingTexts: [],
    combatCues: [],
    combatCueCooldowns: {},
    queuedBuildFeedback: [],
    activeBuildFeedback: null,
    materialGoalNotices: new Set(),
    xpTrainingStacks: 0,
    totalLevelUps: 0,
    markerCrossDept: null,
    markerAuxWeapon: null,
    markerAuxTimer: 0,
    markerCrossDeptUnlocked: false,
    markerCrossSkillUnlocked: false,
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
      markerWidth: 4,
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

// v0.3: 寮€灞€鈫掕韩浠藉伐鐗岄€夋嫨
function startGame() {
  CS.buildState.reset();
  ui.resultPanel?.classList.add("hidden");
  ui.perkPanel?.classList.add("hidden");
  ui.startPanel?.classList.remove("hidden");
  ui.weaponSelectPanel?.classList.remove("hidden");
  ui.badgePanel?.classList.add("hidden");
  ui.startButton?.classList.add("hidden");
  ui.policyPanel?.classList.add("hidden");
  renderStartWeaponSelection();
}

function renderStartWeaponSelection() {
  if (!ui.weaponSelectGrid) {
    ui.badgePanel?.classList.remove("hidden");
    renderBadgeSelection();
    return;
  }
  ui.weaponSelectGrid.replaceChildren();
  for (const weaponId of START_WEAPON_CHOICES) {
    const weapon = CS.weapons?.[weaponId] || weaponDefinitions?.[weaponId];
    if (!weapon) continue;
    const baseForm = {
      formId: `${weaponId}_intern_base`,
      displayName: "基础形态",
      combatVerb: "",
      visualStyle: "base",
      bestMatch: false,
      baseParams: { cooldown: 1, damage: 1, width: 1 },
    };
    const baseLine = weapon.formTopology && weapon.motif
      ? `${weapon.motif}：${weapon.description || weapon.tagDescription || "先体验基础攻击方式"}`
      : (weapon.description || weapon.tagDescription || "自动攻击武器");
    const card = document.createElement("button");
    card.className = `weapon-start-card ${weaponId}`;
    card.type = "button";
    card.innerHTML = `
      <span class="weapon-start-emoji">${weapon.emoji || "⚙"}</span>
      <strong>${escHtml(weapon.name || weapon.label || weaponId)}</strong>
      <span>${escHtml(baseLine)}</span>
      ${getFormPreviewMarkup(baseForm, weaponId)}
      <em>基础形态：先体验这把武器的攻击方式</em>
    `;
    card.addEventListener("click", () => {
      pendingStartWeapon = weaponId;
      startGameWithWeaponOnly(weaponId);
    });
    ui.weaponSelectGrid.append(card);
  }
}

function renderBadgeSelection() {
  if (!ui.badgeGrid) return;
  showOnboardingHint("badge_intro", "工牌会改造武器", "同一把武器换工牌，会变成不同攻击形态；之后的卡槽会强化这个形态。");
  ui.badgeGrid.replaceChildren();
  for (const deptId of ["tech", "product", "ops", "marketing", "general"]) {
    const dept = CS.departments[deptId];
    const form = getWeaponBadgeForm(pendingStartWeapon, deptId);
    if (!dept || !form) continue;
    const card = document.createElement("button");
    card.className = `badge-card ${deptId} form-${form.visualStyle || "base"} ${getFormMatchClass(form)}`;
    card.type = "button";
    card.innerHTML = `
      <span class="badge-emoji">${dept.emoji}</span>
      <span class="badge-name">${dept.name}</span>
      <span class="badge-dept-desc">${escHtml(form.displayName)}</span>
      ${getFormPreviewMarkup(form, pendingStartWeapon)}
      <div class="badge-attr-row">
        <span class="badge-attr-tag">${getFormMatchLabel(form)}</span>
        <span class="badge-attr-tag">${CS.weapons[pendingStartWeapon]?.emoji || ""} ${CS.weapons[pendingStartWeapon]?.name || pendingStartWeapon}</span>
      </div>
      <div class="badge-divider"></div>
      <span class="badge-desc">${escHtml(form.combatVerb)}</span>
      <span class="badge-weapon">${escHtml((form.scalingHooks || []).slice(0, 3).join(" / "))}</span>
      <span class="badge-weapon badge-promotion">${escHtml(getFormPromotionLine(form, pendingStartWeapon))}</span>
    `;
    card.addEventListener("click", () => {
      if (game && state === "badge_select") applyBadgeDuringRun(deptId);
      else startGameWithWeaponAndBadge(pendingStartWeapon, deptId);
    });
    ui.badgeGrid.append(card);
  }
}

function escHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getDeptDisplayName(deptId) {
  return CS.departments[deptId]?.name || deptId || "未选部门";
}

function getRouteLesson(deptId) {
  return routeLessons[deptId || CS.buildState?.badgeDept] || routeLessons.tech;
}

function uniqueEffectInfos(infos, limit = 4) {
  const seen = new Set();
  const out = [];
  for (const info of infos || []) {
    if (!info || seen.has(info.id || info.word)) continue;
    seen.add(info.id || info.word);
    out.push(info);
    if (out.length >= limit) break;
  }
  return out;
}

function getEffectInfosFromText(text, limit = 3) {
  const hay = String(text || "").toLowerCase();
  if (!hay) return [];
  const matches = [];
  for (const info of EFFECT_VOCAB) {
    if (info.match.some(token => hay.includes(String(token).toLowerCase()))) {
      matches.push(info);
    }
  }
  return uniqueEffectInfos(matches, limit);
}

function getCardEffectSearchText(card, slotId) {
  if (!card) return "";
  const effects = slotId && card.slotEffects?.[slotId]
    ? [card.slotEffects[slotId]]
    : [card.slotEffects?.offense].filter(Boolean);
  const effectText = effects.map(effect => [
    effect.label,
    effect.description,
    effect.effectType,
    Object.keys(effect.params || {}).join(" ")
  ].join(" ")).join(" ");
  return [
    card.id,
    card.name,
    card.theme,
    card.description,
    (card.tags || []).join(" "),
    effectText
  ].join(" ");
}

function getCardEffectInfos(card, slotId, limit = 3) {
  const infos = getEffectInfosFromText(getCardEffectSearchText(card, slotId), limit);
  if (infos.length) return infos;
  const label = getCardMechanicLabel(card);
  return [{ id: `custom_${label}`, word: label || "机制", picture: "放进不同槽位，会变成不同战斗功能" }];
}

function getPrimaryEffectInfoForCard(card, slotId) {
  if (slotId) return getCardEffectInfos(card, slotId, 1)[0];
  const theme = String(card?.theme || "").toLowerCase();
  const exactTheme = EFFECT_VOCAB.find(info =>
    info.word === card?.theme || info.match.some(token => String(token).toLowerCase() === theme)
  );
  if (exactTheme) return exactTheme;
  for (const tag of card?.tags || []) {
    const tagInfo = EFFECT_INFO_BY_ID[tag] || EFFECT_VOCAB.find(info =>
      info.match.some(token => String(token).toLowerCase() === String(tag).toLowerCase())
    );
    if (tagInfo) return tagInfo;
  }
  const themeInfos = getEffectInfosFromText([card?.theme, card?.description].join(" "), 1);
  return themeInfos[0] || getCardEffectInfos(card, null, 1)[0];
}

function getCardEffectLine(card) {
  const info = getPrimaryEffectInfoForCard(card);
  return `${info?.word || getCardMechanicLabel(card)} · ${info?.picture || "\u653e\u8fdb\u4e0d\u540c\u69fd\u4f4d\uff0c\u4f1a\u53d8\u6210\u4e0d\u540c\u6218\u6597\u529f\u80fd"}`;
}
function getSlotVariantLine(card) {
  const word = getPrimaryEffectInfoForCard(card)?.word || "当前效果";
  return `同一张${word}卡：可改成伤害 / 续航 / 成长 / 规则 / 高风险爆发`;
}
function getSlotOutcomeLabel(card, slotId) {
  const effect = card?.slotEffects?.[slotId];
  const text = [effect?.effectType, effect?.description, Object.keys(effect?.params || {}).join(" ")].join(" ").toLowerCase();
  if (/heal|regen|lifesteal|vamp|armor|shield/.test(text)) return "\u7eed\u822a";
  if (/xp|drop|mat|pickup|luck|resource/.test(text)) return "\u6210\u957f";
  if (/double|extend|scal|share|storm|global|simul/.test(text)) return "\u89c4\u5219\u53d8\u5316";
  if (/gamble|cost|risk|hp|self/.test(text) || slotId === "cost") return "\u9ad8\u98ce\u9669";
  if (/slow|knockback|push|control/.test(text)) return "\u63a7\u573a";
  return "\u4f24\u5bb3";
}
function getActiveWeaponLevel(weaponId = getActiveWeaponId()) {
  const id = canonicalWeaponId(weaponId);
  return Math.max(1, game?.weapons?.[id]?.level || CS.buildState?.weaponLevels?.[id] || 1);
}

function getPreviewFormParamsForCard(card, slotId, action = "replace") {
  const weaponId = getActiveWeaponId();
  const level = getActiveWeaponLevel(weaponId);
  const form = getActiveWeaponForm(weaponId);
  const base = Object.assign({ cooldown: 1, damage: 1, width: 1 }, form.baseParams || {});
  const currentMod = Object.assign(createEmptyFormMod(), getFormModifierSummary(weaponId));
  const current = getFormParamsFromModifier(weaponId, level, currentMod, form, base);
  const realSlot = String(slotId || "").replace("augment:", "");
  const augmentIndex = (CS.buildState?.slotAugments?.[realSlot] || []).length;
  const power = action === "augment" ? 0.62 + augmentIndex * 0.08 : 1;
  const delta = getFormModifierDeltaForCard(card, realSlot, power);
  const existingId = action === "replace" ? CS.buildState?.slotCards?.[realSlot] : null;
  const existingCard = existingId ? CS.cards[existingId] : null;
  const removeOld = existingCard ? invertFormMod(getFormModifierDeltaForCard(existingCard, realSlot, 1)) : createEmptyFormMod();
  const nextMod = addFormMods(currentMod, removeOld, delta);
  const next = getFormParamsFromModifier(weaponId, level, nextMod, form, base);
  return { weaponId, level, form, current, next, action };
}

function calcMarkerPreviewMetrics(params, level, form) {
  const p = game?.player || {};
  const promoted = typeof isMarkerPromoted === "function" ? isMarkerPromoted(level) : false;
  const width = Math.max(3, ((p.markerWidth || 4) + Math.max(0, level - 1) * 0.42 + Math.floor(getEffectiveStat("crit") / 34)) * (params.width || 1));
  const mechanic = form?.mechanicType || form?.formId;
  const metrics = {
    damage: Math.round((params.damage || 1) * 100),
    cooldown: Math.round((params.cooldown || 1) * 100),
    width: Math.round(width * 10) / 10,
  };
  if (mechanic === "line_split" || form?.formId === "marker_tech_split") {
    metrics.split = Math.min(7, (params.splitCount || 1) + params.countBonus + Math.floor(level / 4));
    metrics.splitRange = Math.round((params.splitRange || 220) + rangeBonus(0.25));
  } else if (mechanic === "mark_detonate" || form?.formId === "marker_product_blast" || form?.formId === "marker_product_p0") {
    metrics.blastChance = Math.round(Math.min(0.9, 0.62 + params.chanceBonus) * 100);
    metrics.blastRadius = Math.round(((params.blastRadius || 38) + level * 2 + params.radiusBonus * 24) * (promoted ? (params.promotedRadiusMult || 2) : 1));
  } else if (mechanic === "shield_counter_line" || form?.formId === "marker_ops_rain" || form?.formId === "marker_ops_counter") {
    metrics.strikes = Math.min(10, 1 + params.countBonus + Math.floor(level / 4) + (promoted ? (params.promotedSpikeCount || 3) : 0));
    metrics.shield = Math.round(((params.shieldOnHit || 1.2) + params.shieldBonus * 0.25) * 10) / 10;
  } else if (mechanic === "line_to_wave" || form?.formId === "marker_marketing_wave") {
    metrics.waves = Math.min(6, (params.waveCount || 1) + params.countBonus + Math.floor(level / 4));
    metrics.waveRadius = Math.round(58 + level * 2 + params.radiusBonus * 7);
  } else if (mechanic === "line_grid_field" || form?.formId === "marker_admin_grid") {
    metrics.gridLines = Math.max(2, (params.gridLines || 2) + params.countBonus + Math.floor(level / 4));
    metrics.gridSpread = Math.round(64 + Math.min(58, level * 6 + params.radiusBonus * 22));
  }
  return metrics;
}

const FORM_METRIC_RULES = {
  hit_count_summon: [
    ["续杯阈值", p => Math.max(2, Math.round((p.refillHits || 5) - p.countBonus))],
    ["无人机数量", p => Math.max(1, Math.round((p.droneCount || 1) + p.countBonus))],
    ["持续时间", p => `${Math.round(((p.droneLife || 5) + p.durationBonus * 4) * 10) / 10}s`],
  ],
  stack_detonate: [
    ["叠层上限", p => Math.max(2, Math.round((p.caffeineMax || 3) - Math.min(1, p.mechanicBonus)))],
    ["爆炸范围", p => Math.round((p.blastRadius || 50) + p.radiusBonus * 36)],
    ["爆炸伤害", p => `${Math.round(((p.blastDamage || 0.8) + p.damage * 0.12) * 100)}%`],
  ],
  orbit_consumable_shield: [
    ["护盾球", p => Math.max(1, Math.round((p.shieldBall || 3) + p.countBonus))],
    ["护盾量", p => Math.round(((p.shieldOnJump || p.shieldBall || 3) + p.shieldBonus * 6) * 10) / 10],
    ["触发频率", p => `${Math.round((1 / Math.max(0.5, p.cooldown || 1)) * 100)}%`],
  ],
  debuff_spread_on_death: [
    ["传播数量", p => Math.max(1, Math.round((p.spreadCount || 2) + p.countBonus))],
    ["传播范围", p => Math.round((p.aromaRadius || 110) + p.radiusBonus * 48)],
    ["持续伤害", p => `${Math.round(((p.aromaDot || 0.16) + p.damage * 0.04) * 100)}%`],
  ],
  path_field_zone: [
    ["安全区半径", p => Math.round((p.dripRadius || p.stationRadius || 80) + p.radiusBonus * 44)],
    ["留场时间", p => `${Math.round((3 + p.durationBonus * 4) * 10) / 10}s`],
    ["资源概率", p => `${Math.round(((p.resourceChance || 0.02) + p.resourceBonus * 0.08) * 100)}%`],
  ],
  combo_repeat: [
    ["连打间隔", p => `${Math.max(2, Math.round((p.repeatEvery || 3) - p.mechanicBonus))}击`],
    ["副挥击伤害", p => `${Math.round(((p.repeatDamage || 0.48) + p.damage * 0.08) * 100)}%`],
    ["副挥击范围", p => Math.round(86 + p.radiusBonus * 38)],
  ],
  charge_next_attack: [
    ["重击间隔", p => `${Math.max(2, Math.round((p.heavyEvery || 3) - p.mechanicBonus))}击`],
    ["爆键范围", p => Math.round((p.blastRadius || 78) + p.radiusBonus * 42)],
    ["击退距离", p => Math.round((p.knockback || 80) + p.shieldBonus * 30)],
  ],
  shield_counter: [
    ["盾反窗口", p => `${Math.round(((p.guardWindow || 0.3) + p.durationBonus * 0.2) * 100) / 100}s`],
    ["反击范围", p => Math.round((p.counterRadius || 110) + p.radiusBonus * 42)],
    ["反击伤害", p => `${Math.round(((p.counterDamage || 1) + p.damage * 0.15) * 100)}%`],
  ],
  hit_count_wave_amp: [
    ["文字波数", p => Math.max(1, Math.round((p.waveCount || 1) + p.countBonus))],
    ["推开距离", p => Math.round((p.wavePush || 54) + p.radiusBonus * 28)],
    ["波纹伤害", p => `${Math.round((0.5 + p.damage * 0.12) * 100)}%`],
  ],
  mark_stun_followup: [
    ["定身间隔", p => `${Math.max(2, Math.round((p.rootEvery || 4) - p.mechanicBonus))}击`],
    ["冷却返还", p => `${Math.round(((p.cdRefund || 0.1) + p.cooldown * 0.05) * 100)}%`],
    ["停顿时间", p => `${Math.round((0.38 + p.durationBonus * 0.35) * 100) / 100}s`],
  ],
  magazine_burst_reload: [
    ["弹匣节奏", p => `${Math.max(3, Math.round(5 - p.cooldown))}发`],
    ["穿透", p => Math.max(1, Math.round((p.pierce || 1) + p.countBonus))],
    ["换弹增速", p => `${Math.round((18 + p.cooldown * 80))}%`],
  ],
  bind_damage_threshold_detonate: [
    ["爆钉范围", p => Math.round((p.burstRadius || 46) + p.radiusBonus * 40)],
    ["钉幕数量", p => Math.max(1, Math.round((p.pelletBonus || 2) + p.countBonus))],
    ["引爆伤害", p => `${Math.round((0.8 + p.damage * 0.16) * 100)}%`],
  ],
  barrier_slow_line: [
    ["护栏减速", p => `${Math.round(((p.slow || 0.22) + p.durationBonus * 0.1) * 100)}%`],
    ["护盾收益", p => Math.round(((p.shieldOnHit || 0.8) + p.shieldBonus * 2) * 10) / 10],
    ["护栏长度", p => Math.round(150 + p.radiusBonus * 70)],
  ],
  projectile_bounce_scatter: [
    ["反弹弹片", p => Math.max(1, Math.round((p.sideShots || 2) + p.countBonus))],
    ["散射角度", p => `${Math.round(((p.spreadBonus || 0.24) + p.radiusBonus * 0.08) * 100)}%`],
    ["二段伤害", p => `${Math.round((0.48 + p.damage * 0.1) * 100)}%`],
  ],
  anchor_link_lockline: [
    ["定身概率", p => `${Math.round(((p.bindChance || 0.24) + p.chanceBonus) * 100)}%`],
    ["定身时间", p => `${Math.round(((p.bindDuration || 0.5) + p.durationBonus * 0.3) * 100) / 100}s`],
    ["封锁线数", p => Math.max(2, Math.round(2 + p.countBonus))],
  ],
  temporary_aura_summon: [
    ["音源数量", p => Math.max(1, Math.round((p.droneCount || 2) + p.countBonus))],
    ["声场范围", p => Math.round((p.droneRange || 170) + p.radiusBonus * 45)],
    ["音源伤害", p => `${Math.round((0.42 + p.damage * 0.1) * 100)}%`],
  ],
  timed_pulse_burst: [
    ["重拍间隔", p => `${Math.max(1.4, Math.round(((p.pulseEvery || 3) - p.cooldown) * 10) / 10)}s`],
    ["脉冲半径", p => Math.round((p.pulseRadius || 120) + p.radiusBonus * 52)],
    ["冲击伤害", p => `${Math.round((0.9 + p.damage * 0.16) * 100)}%`],
  ],
  aura_rebroadcast: [
    ["接力圈数", p => Math.max(1, Math.round((p.waveCount || 1) + p.countBonus))],
    ["减速", p => `${Math.round(((p.slow || 0.2) + p.durationBonus * 0.08) * 100)}%`],
    ["二播范围", p => Math.round(72 + p.radiusBonus * 42)],
  ],
  silence_zone_economy: [
    ["静音范围", p => Math.round(90 + p.radiusBonus * 48)],
    ["减速", p => `${Math.round(((p.slow || 0.3) + p.durationBonus * 0.08) * 100)}%`],
    ["资源概率", p => `${Math.round(((p.resourceChance || 0.02) + p.resourceBonus * 0.08) * 100)}%`],
  ],
  patrol_summon_steam: [
    ["巡航模块", p => Math.max(1, Math.round(1 + p.countBonus))],
    ["喷汽频率", p => `${Math.round((1 / Math.max(0.5, p.cooldown || 1)) * 100)}%`],
    ["电雾伤害", p => `${Math.round((0.55 + p.damage * 0.12) * 100)}%`],
  ],
  charge_release_beam: [
    ["蒸汽柱宽", p => Math.round((p.steamColumnWidth || 22) + p.radiusBonus * 18)],
    ["蒸汽柱射程", p => Math.round((p.steamColumnRange || 360) + p.radiusBonus * 90)],
    ["空窗", p => `${Math.max(0.4, Math.round(((p.ventLockout || 1.3) - p.cooldown * 0.3) * 10) / 10)}s`],
  ],
  shield_break_pulse: [
    ["暖流护盾", p => `${Math.round(((p.overhealShield || 0.3) + p.shieldBonus * 0.12) * 100)}%`],
    ["热浪半径", p => Math.round(92 + p.radiusBonus * 48)],
    ["回复效率", p => `${Math.round(((p.healMult || 1) + p.shieldBonus * 0.1) * 100)}%`],
  ],
  periodic_wave_spread: [
    ["热波圈数", p => Math.max(1, Math.round((p.waveCount || 1) + p.countBonus))],
    ["减速", p => `${Math.round(((p.slow || 0.22) + p.durationBonus * 0.08) * 100)}%`],
    ["扩散范围", p => Math.round(110 + p.radiusBonus * 52)],
  ],
  deployable_safe_station: [
    ["据点半径", p => Math.round((p.stationRadius || 88) + p.radiusBonus * 45)],
    ["补给效率", p => `${Math.round((1 + p.shieldBonus * 0.2) * 100)}%`],
    ["资源概率", p => `${Math.round(((p.resourceChance || 0.02) + p.resourceBonus * 0.08) * 100)}%`],
  ],
  orbit_consumable_regen: [
    ["报表页数", p => Math.max(1, Math.round(3 + p.countBonus))],
    ["补页速度", p => `${Math.round((1 / Math.max(0.5, p.cooldown || 1)) * 100)}%`],
    ["轨道速度", p => `${Math.round(((p.speedMult || 1) + p.cooldown * 0.1) * 100)}%`],
  ],
  target_window_damage_settle: [
    ["审判窗口", p => `${Math.round(((p.window || 3) + p.durationBonus) * 10) / 10}s`],
    ["结算倍率", p => `${Math.round(((p.settleMult || 0.6) + p.damage * 0.08) * 100)}%`],
    ["锁定频率", p => `${Math.round((1 / Math.max(0.5, p.cooldown || 1)) * 100)}%`],
  ],
  orbit_attack_defense_shared: [
    ["护页强度", p => Math.round(((p.shieldOnTick || 0.3) + p.shieldBonus * 1.8) * 10) / 10],
    ["轨道半径", p => `${Math.round(((p.orbitRadius || 1) + p.radiusBonus * 0.08) * 100)}%`],
    ["攻防页数", p => Math.max(2, Math.round(3 + p.countBonus))],
  ],
  global_periodic_status: [
    ["翻页频率", p => `${Math.round((1 / Math.max(0.5, p.cooldown || 1)) * 100)}%`],
    ["小报表", p => Math.max(1, Math.round((p.minionSheets || 1) + p.countBonus))],
    ["全屏伤害", p => `${Math.round((0.22 + p.damage * 0.06) * 100)}%`],
  ],
  node_link_rule_zone: [
    ["归档留场", p => `${Math.round(((p.trailLife || 1.4) + p.durationBonus * 2) * 10) / 10}s`],
    ["连线范围", p => Math.round(120 + p.radiusBonus * 64)],
    ["资源概率", p => `${Math.round(((p.resourceChance || 0.02) + p.resourceBonus * 0.08) * 100)}%`],
  ],
  bouncing_slash_line: [
    ["切割线数", p => Math.max(1, Math.round(1 + p.countBonus))],
    ["弹射概率", p => `${Math.round(((p.chainChance || 0.2) + p.chanceBonus) * 100)}%`],
    ["穿透", p => Math.max(1, Math.round((p.pierce || 1) + p.countBonus))],
  ],
  single_target_channel_execute: [
    ["粉碎层数", p => Math.max(3, Math.round(4 - p.mechanicBonus))],
    ["碎片数量", p => Math.max(2, Math.round((p.burstShards || 4) + p.countBonus))],
    ["锥角", p => `${Math.round(((p.coneAngle || 0.9) + p.radiusBonus * 0.1) * 100)}%`],
  ],
  directional_guard_counter: [
    ["正面减速", p => `${Math.round(((p.slow || 0.2) + p.durationBonus * 0.08) * 100)}%`],
    ["护盾滴答", p => Math.round(((p.shieldOnTick || 0.4) + p.shieldBonus * 1.6) * 10) / 10],
    ["反纸片", p => Math.max(2, Math.round(3 + p.countBonus))],
  ],
  kill_meter_vortex_summon: [
    ["纸屑阈值", p => Math.max(8, Math.round((p.vortexMeter || 18) - p.mechanicBonus * 4))],
    ["龙卷半径", p => Math.round((p.vortexRadius || 92) + p.radiusBonus * 56)],
    ["牵引强度", p => Math.round((p.pull || 68) + p.radiusBonus * 40)],
  ],
  death_fragment_barrier_resource: [
    ["碎片收益", p => `${Math.round(((p.resourceChance || 0.03) + p.resourceBonus * 0.1) * 100)}%`],
    ["封存概率", p => `${Math.round(((p.bindChance || 0.2) + p.chanceBonus) * 100)}%`],
    ["封锁宽度", p => Math.round(72 + p.radiusBonus * 40)],
  ],
  seeking_trap_summon: [
    ["待办数量", p => Math.max(1, Math.round((p.homingTrap || 1) + p.countBonus))],
    ["连锁概率", p => `${Math.round(((p.chainTrap || 0.2) + p.chanceBonus) * 100)}%`],
    ["追踪范围", p => Math.round(140 + p.radiusBonus * 48)],
  ],
  manual_trap_detonate: [
    ["爆炸半径", p => Math.round((p.blastRadius || 76) + p.radiusBonus * 46)],
    ["同步引爆", p => Math.max(1, Math.round(2 + p.countBonus))],
    ["触发速度", p => `${Math.round((1 / Math.max(0.5, p.cooldown || 1)) * 100)}%`],
  ],
  route_buff_trap: [
    ["路线减速", p => `${Math.round(((p.slow || 0.32) + p.durationBonus * 0.08) * 100)}%`],
    ["护盾补给", p => Math.round(((p.healPulse || 1) + p.shieldBonus * 2) * 10) / 10],
    ["贴纸时间", p => `${Math.round((3 + p.durationBonus * 3) * 10) / 10}s`],
  ],
  sticky_debuff_spread: [
    ["传播贴纸", p => Math.max(1, Math.round((p.spreadTraps || 2) + p.countBonus))],
    ["传播范围", p => Math.round((p.spreadRadius || 115) + p.radiusBonus * 48)],
    ["持续伤害", p => `${Math.round((0.22 + p.damage * 0.06) * 100)}%`],
  ],
  trap_link_control_zone: [
    ["围板贴数", p => Math.max(3, Math.round((p.gridTraps || 3) + p.countBonus))],
    ["规则留场", p => `${Math.round((3 + p.durationBonus * 3) * 10) / 10}s`],
    ["资源概率", p => `${Math.round(((p.resourceChance || 0.03) + p.resourceBonus * 0.1) * 100)}%`],
  ],
  recursive_chain: [
    ["递归跳点", p => Math.max(1, Math.round((p.chainBonus || 2) + p.countBonus))],
    ["跳点范围", p => Math.round((p.rangeBonus || 40) + 160 + p.radiusBonus * 54)],
    ["复制概率", p => `${Math.round((0.2 + p.chanceBonus) * 100)}%`],
  ],
  value_target_profit_detonate: [
    ["利润爆点", p => Math.round((p.blastRadius || 60) + p.radiusBonus * 42)],
    ["结算倍率", p => `${Math.round(((p.lastHitMult || 1.3) + p.damage * 0.1) * 100)}%`],
    ["标记窗口", p => `${Math.round((2.4 + p.durationBonus) * 10) / 10}s`],
  ],
  mode_alternating_projectile: [
    ["跳点护盾", p => Math.round(((p.shieldOnJump || 0.4) + p.shieldBonus * 1.8) * 10) / 10],
    ["跳点减速", p => `${Math.round(((p.slow || 0.16) + p.durationBonus * 0.08) * 100)}%`],
    ["连锁次数", p => Math.max(2, Math.round(3 + p.countBonus))],
  ],
  prediction_path_chain: [
    ["预测跳点", p => Math.max(1, Math.round((p.forecastJumps || 1) + p.countBonus))],
    ["扩展路径", p => `${Math.round(((p.spreadRange || 1.2) + p.radiusBonus * 0.08) * 100)}%`],
    ["远端伤害", p => `${Math.round((0.42 + p.damage * 0.08) * 100)}%`],
  ],
  ledger_death_settlement: [
    ["审计格", p => Math.max(1, Math.round((p.auditGrid || 1) + p.countBonus))],
    ["资源结算", p => `${Math.round(((p.resourceChance || 0.03) + p.resourceBonus * 0.1) * 100)}%`],
    ["账目转移", p => Math.max(1, Math.round(1 + p.mechanicBonus))],
  ],
};

function calcGenericFormPreviewMetrics(params, form) {
  const rules = FORM_METRIC_RULES[form?.mechanicType || form?.formId] || [];
  return rules.map(([label, getter]) => ({ label, value: getter(params) }));
}

function getFormPreviewRows(card, slotId, action = "replace", limit = 3) {
  const preview = getPreviewFormParamsForCard(card, slotId, action);
  if (preview.weaponId !== "marker") {
    const beforeMetrics = calcGenericFormPreviewMetrics(preview.current, preview.form);
    const afterMetrics = calcGenericFormPreviewMetrics(preview.next, preview.form);
    const rows = [];
    for (let i = 0; i < Math.min(beforeMetrics.length, afterMetrics.length); i += 1) {
      rows.push({ label: beforeMetrics[i].label, before: beforeMetrics[i].value, after: afterMetrics[i].value });
    }
    rows.push({ label: "伤害倍率", before: `${Math.round(preview.current.damage * 100)}%`, after: `${Math.round(preview.next.damage * 100)}%` });
    rows.push({ label: "触发频率", before: `${Math.round((1 / Math.max(0.5, preview.current.cooldown || 1)) * 100)}%`, after: `${Math.round((1 / Math.max(0.5, preview.next.cooldown || 1)) * 100)}%` });
    return rows.filter(row => String(row.before) !== String(row.after)).slice(0, limit);
  }
  const before = calcMarkerPreviewMetrics(preview.current, preview.level, preview.form);
  const after = calcMarkerPreviewMetrics(preview.next, preview.level, preview.form);
  const rows = [];
  const mechanic = preview.form?.mechanicType || preview.form?.formId;
  if (mechanic === "line_split" || preview.form?.formId === "marker_tech_split") {
    rows.push({ label: "\u5206\u88c2\u7ebf\u6570", before: before.split, after: after.split });
    rows.push({ label: "\u652f\u7ebf\u5c04\u7a0b", before: before.splitRange, after: after.splitRange });
  } else if (mechanic === "mark_detonate" || preview.form?.formId === "marker_product_blast" || preview.form?.formId === "marker_product_p0") {
    rows.push({ label: "P0引爆率", before: `${before.blastChance}%`, after: `${after.blastChance}%` });
    rows.push({ label: "\u5149\u7206\u8303\u56f4", before: before.blastRadius, after: after.blastRadius });
  } else if (mechanic === "shield_counter_line" || preview.form?.formId === "marker_ops_rain" || preview.form?.formId === "marker_ops_counter") {
    rows.push({ label: "\u53cd\u5c04\u5149\u523a", before: before.strikes, after: after.strikes });
    rows.push({ label: "\u62a4\u76fe\u6536\u76ca", before: before.shield, after: after.shield });
  } else if (mechanic === "line_to_wave" || preview.form?.formId === "marker_marketing_wave") {
    rows.push({ label: "\u6ce2\u7eb9\u5708\u6570", before: before.waves, after: after.waves });
    rows.push({ label: "\u6269\u6563\u534a\u5f84", before: before.waveRadius, after: after.waveRadius });
  } else if (mechanic === "line_grid_field" || preview.form?.formId === "marker_admin_grid") {
    rows.push({ label: "\u7f51\u683c\u7ebf\u6570", before: before.gridLines, after: after.gridLines });
    rows.push({ label: "\u7f51\u683c\u8303\u56f4", before: before.gridSpread, after: after.gridSpread });
  }
  rows.push({ label: "\u6fc0\u5149\u5bbd\u5ea6", before: before.width, after: after.width });
  rows.push({ label: "\u4f24\u5bb3\u500d\u7387", before: `${before.damage}%`, after: `${after.damage}%` });
  return rows.filter(row => String(row.before) !== String(row.after)).slice(0, limit);
}
function renderFormParamPreview(card, slotId, action = "replace") {
  const rows = getFormPreviewRows(card, slotId, action, 3);
  if (!rows.length) return '<div class="slot-param-preview muted">' + "\u5f62\u6001\u53d8\u5316\u8f83\u5c0f" + '</div>';
  return `<div class="slot-param-preview">${rows.map(row => `
    <span><em>${row.label}</em><b>${row.before}</b><i>-></i><strong>${row.after}</strong></span>
  `).join("")}</div>`;
}
function renderSlotDecisionPreview(card, slotId, action = "replace", label = "") {
  const rows = getFormPreviewRows(card, slotId, action, 3);
  const labelHtml = label ? `<label>${label}</label>` : "";
  if (!rows.length) {
    return `<div class="slot-param-preview ${action === "augment" ? "augment-preview" : ""} muted">${labelHtml}<span>\u5f62\u6001\u53d8\u5316\u8f83\u5c0f</span></div>`;
  }
  return `<div class="slot-param-preview ${action === "augment" ? "augment-preview" : ""}">
    ${labelHtml}
    ${rows.map(row => `<span><em>${row.label}</em><b>${row.before}</b><i>-></i><strong>${row.after}</strong></span>`).join("")}
  </div>`;
}
function getFormDeltaSummaryText(card, slotId, action = "replace") {
  const rows = getFormPreviewRows(card, slotId, action, 2);
  if (!rows.length) {
    const effectInfo = getPrimaryEffectInfoForCard(card, slotId);
    return action === "augment" ? `${effectInfo.word}"\u7ee7\u7eed\u5f3a\u5316"` : effectInfo.word;
  }
  return rows.map(row => `${row.label} ${row.before}->${row.after}`).join(" / ");
}
function getEffectInfosForWeaponId(weaponId, limit = 3) {
  const canonical = typeof canonicalWeaponId === "function" ? canonicalWeaponId(weaponId) : weaponId;
  const ids = WEAPON_EFFECT_PROFILES[canonical] || WEAPON_EFFECT_PROFILES[weaponId] || [];
  const profileInfos = ids.map(id => EFFECT_INFO_BY_ID[id]).filter(Boolean);
  if (profileInfos.length) return uniqueEffectInfos(profileInfos, limit);
  const weapon = CS.weapons?.[canonical] || CS.weapons?.[weaponId] || weaponDefinitions?.[canonical] || weaponDefinitions?.[weaponId];
  return getEffectInfosFromText([
    weaponId,
    weapon?.name,
    weapon?.label,
    weapon?.description,
    weapon?.tagDescription,
    (weapon?.tags || weapon?.classes || []).join(" ")
  ].join(" "), limit);
}

function getWeaponEffectWordsText(weaponId, limit = 2) {
  return getEffectInfosForWeaponId(weaponId, limit).map(info => info.word).join(" / ");
}

function getWeaponBadgeForm(weaponId, deptId) {
  const canonical = canonicalWeaponId(weaponId || pendingStartWeapon || CS.buildState?.weapons?.[0] || "marker");
  const dept = deptId || CS.buildState?.badgeDept || "product";
  if (typeof game !== "undefined" && game && game.badgeChosen === false && !deptId) {
    const baseVerb = canonical === "marker"
      ? "长射程贯穿激光；先用走位把敌人拉成一线"
      : canonical === "keyboard"
        ? "近战挥击击退；先用走位控制贴脸压力"
        : "基础自动射击；先观察武器手感";
    return {
      formId: `${canonical}_intern_base`,
      displayName: "基础形态",
      combatVerb: baseVerb,
      visualStyle: "base",
      bestMatch: false,
      baseParams: { cooldown: 1, damage: 1, width: 1 },
      scalingHooks: ["伤害", "冷却", "射程"],
      ultimateHook: "选择工牌后解锁部门形态"
    };
  }
  const forms = weaponBadgeForms[canonical] || weaponBadgeForms[weaponId];
  if (forms?.[dept]) return forms[dept];
  return {
    formId: `${canonical}_${dept}_base`,
    displayName: `${getDeptDisplayName(dept) || "基础"}形态`,
    combatVerb: "当前武器暂无专属变体；卡槽仍会强化基础属性",
    visualStyle: "base",
    bestMatch: false,
    baseParams: { cooldown: 1, damage: 1, width: 1 },
    scalingHooks: ["伤害", "冷却", "射程"],
    ultimateHook: "后续形态升级"
  };
}

function getFormMatchLabel(form) {
  if (form?.bestMatch === true) return "代表形态";
  if (form?.bestMatch === "strong") return "强变体";
  return "可玩变体";
}

function getFormMatchClass(form) {
  if (form?.bestMatch === true) return "best";
  if (form?.bestMatch === "strong") return "strong";
  return "normal";
}

function getFormPromotionLine(form, weaponId = getActiveWeaponId()) {
  if (!form?.ultimateHook) return "";
  const promoted = weaponId === "marker" && typeof game !== "undefined" && game ? isMarkerPromoted(game.weapons?.marker?.level || 0) : false;
  return (promoted ? "已转正" : "转正后") + "：" + form.ultimateHook;
}

function isMarkerPromoted(level = game?.weapons?.marker?.level || 0) {
  return level >= 7 || game?.routeTier >= 3 || game?.markerPromoted === true;
}

function getFormPromotionLine(form, weaponId = getActiveWeaponId()) {
  if (!form?.ultimateHook) return "";
  const promoted = weaponId === "marker" && typeof game !== "undefined" && game ? isMarkerPromoted(game.weapons?.marker?.level || 0) : false;
  return `${promoted ? "已转正" : "转正后"}：${form.ultimateHook}`;
}

function getSpritePreviewY(row, totalRows) {
  if (totalRows <= 1) return "0%";
  return `${Math.round((clamp(row || 0, 0, totalRows - 1) / (totalRows - 1)) * 10000) / 100}%`;
}

function getFormPreviewMarkup(form, weaponId = getActiveWeaponId()) {
  const canonical = canonicalWeaponId(weaponId || pendingStartWeapon || "marker");
  const style = form?.visualStyle || (canonical === "keyboard" ? "scatter" : canonical === "coffee" ? "chain" : "base");
  const isMarker = canonical === "marker" || String(form?.formId || "").startsWith("marker_");
  const atlasClass = isMarker ? "vfx-marker" : "vfx-selection";
  const totalRows = isMarker ? MARKER_VFX_ROWS : SELECTION_PREVIEW_ROWS;
  const row = isMarker
    ? (MARKER_VFX_ROW[style] ?? MARKER_VFX_ROW.base)
    : (SELECTION_PREVIEW_ROW[canonical] ?? SELECTION_PREVIEW_ROW[style] ?? SELECTION_PREVIEW_ROW.base);
  const y = getSpritePreviewY(row, totalRows);
  return `<span class="form-preview ${atlasClass} ${escHtml(style)}" style="--preview-y:${y}"></span>`;
}

function getSlotPreviewMarkup(slotId) {
  const row = SELECTION_PREVIEW_ROW[slotId] ?? SELECTION_PREVIEW_ROW.mechanic;
  const y = getSpritePreviewY(row, SELECTION_PREVIEW_ROWS);
  return `<span class="form-preview slot-vfx-preview vfx-selection ${escHtml(slotId)}" style="--preview-y:${y}"></span>`;
}

function getActiveWeaponId() {
  return canonicalWeaponId(CS.buildState?.weapons?.[0] || pendingStartWeapon || "marker");
}

function getActiveWeaponForm(weaponId = getActiveWeaponId()) {
  return getWeaponBadgeForm(weaponId, CS.buildState?.badgeDept);
}

function createEmptyFormMod() {
  return { damage: 0, cooldown: 0, count: 0, chance: 0, radius: 0, duration: 0, shield: 0, resource: 0, mechanic: 0, cost: 0 };
}

function addFormMods(...mods) {
  const out = createEmptyFormMod();
  for (const mod of mods) {
    if (!mod) continue;
    for (const key of Object.keys(out)) out[key] += Number(mod[key] || 0);
  }
  return out;
}

function invertFormMod(mod) {
  const out = createEmptyFormMod();
  for (const key of Object.keys(out)) out[key] = -Number(mod?.[key] || 0);
  return out;
}

function getCardFormPower(card, slotId) {
  const rarityPower = { common: 1, rare: 1.18, epic: 1.36, legendary: 1.65, mythic: 1.85 };
  const effectPower = Number(card?.slotEffects?.[slotId]?.powerBudget || card?.powerBudget || 1);
  return Math.max(0.75, Math.min(2.25, effectPower)) * (rarityPower[card?.rarity] || 1);
}

function getSlotFormVector(slotId) {
  const map = {
    offense: { damage: 0.15, count: 0.42, chance: 0.035 },
    survival: { shield: 0.18, duration: 0.08, radius: 0.08, damage: 0.03 },
    resource: { resource: 0.2, radius: 0.06, cooldown: 0.035 },
    mechanic: { mechanic: 0.24, count: 0.28, duration: 0.12, chance: 0.055 },
    cost: { damage: 0.23, chance: 0.08, radius: 0.12, cooldown: 0.04, cost: 0.2 },
  };
  return map[slotId] || map.offense;
}

function getFormModifierDeltaForCard(card, slotId, power = 1) {
  const out = createEmptyFormMod();
  if (!card || !slotId) return out;
  const vector = getSlotFormVector(slotId);
  const formPower = getCardFormPower(card, slotId) * power;
  for (const [key, value] of Object.entries(vector)) out[key] += value * formPower;
  const text = getCardEffectSearchText(card, slotId).toLowerCase();
  if (/chain|split|分裂|连锁|跳|line|beam/.test(text)) {
    out.count += 0.16 * formPower;
    out.chance += 0.018 * formPower;
  }
  if (/blast|explode|爆|crit|burst/.test(text)) {
    out.damage += 0.06 * formPower;
    out.radius += 0.06 * formPower;
  }
  if (/slow|zone|field|trap|grid|控制|陷阱|留场/.test(text)) {
    out.duration += 0.08 * formPower;
    out.radius += 0.04 * formPower;
  }
  if (/heal|regen|shield|护盾|回复|armor/.test(text)) {
    out.shield += 0.12 * formPower;
  }
  if (/xp|drop|material|luck|resource|材料|经验|拾取/.test(text)) {
    out.resource += 0.12 * formPower;
  }
  return out;
}

function computeFormModifierFromBuildState(weaponId = getActiveWeaponId()) {
  const mod = createEmptyFormMod();
  const bs = CS.buildState;
  if (!bs) return mod;
  for (const [slotId, cardId] of Object.entries(bs.slotCards || {})) {
    addFormModsInto(mod, getFormModifierDeltaForCard(CS.cards?.[cardId], slotId, 1));
  }
  for (const [slotId, ids] of Object.entries(bs.slotAugments || {})) {
    let index = 0;
    for (const cardId of ids || []) {
      const power = 0.62 + index * 0.08;
      addFormModsInto(mod, getFormModifierDeltaForCard(CS.cards?.[cardId], slotId, power));
      index += 1;
    }
  }
  return mod;
}

function addFormModsInto(target, delta) {
  if (!target || !delta) return target;
  for (const key of Object.keys(createEmptyFormMod())) target[key] = Number(target[key] || 0) + Number(delta[key] || 0);
  return target;
}

function getFormModifierSummary(weaponId = getActiveWeaponId()) {
  const canonical = canonicalWeaponId(weaponId);
  const computed = computeFormModifierFromBuildState(canonical);
  if (typeof game !== "undefined" && game) {
    game.formModifiers = game.formModifiers || {};
    game.formModifiers[canonical] = computed;
  }
  return computed;
}

function getActiveFormParams(weaponId, level = 1) {
  const form = getActiveWeaponForm(weaponId);
  const base = Object.assign({ cooldown: 1, damage: 1, width: 1 }, form.baseParams || {});
  const mod = getFormModifierSummary(weaponId);
  return getFormParamsFromModifier(weaponId, level, mod, form, base);
}

function getFormParamsFromModifier(weaponId, level = 1, mod = {}, form = getActiveWeaponForm(weaponId), base = null) {
  base = base || Object.assign({ cooldown: 1, damage: 1, width: 1 }, form.baseParams || {});
  return Object.assign({}, base, {
    cooldown: Math.max(0.5, (base.cooldown || 1) * (1 - Math.min(0.35, (mod.cooldown || 0) + level * 0.01))),
    damage: (base.damage || 1) * (1 + (mod.damage || 0) + (form.bestMatch === true ? 0.08 : 0) + level * 0.015),
    width: (base.width || 1) * (1 + Math.min(0.5, (mod.radius || 0) * 0.35)),
    countBonus: Math.floor(mod.count || 0),
    chanceBonus: mod.chance || 0,
    radiusBonus: mod.radius || 0,
    durationBonus: mod.duration || 0,
    shieldBonus: mod.shield || 0,
    resourceBonus: mod.resource || 0,
    mechanicBonus: mod.mechanic || 0,
    costPower: mod.cost || 0
  });
}

function getOfferEffectInfos(entry, limit = 3) {
  const weaponId = getUpgradeWeaponId(entry?.id);
  if (weaponId) return getEffectInfosForWeaponId(weaponId, limit);
  return getEffectInfosFromText([entry?.id, entry?.title, entry?.text, entry?.tag, getItemBuildHint(entry || {})].join(" "), limit);
}

function getOwnedBuildEffectInfos(limit = 5) {
  const infos = [];
  const bs = CS.buildState;
  for (const [slotId, cardId] of Object.entries(bs?.slotCards || {})) {
    if (cardId) infos.push(...getCardEffectInfos(CS.cards[cardId], slotId, 2));
  }
  for (const [slotId, ids] of Object.entries(bs?.slotAugments || {})) {
    for (const cardId of ids || []) infos.push(...getCardEffectInfos(CS.cards[cardId], slotId, 2));
  }
  for (const cardId of bs?.supportCards || []) {
    infos.push(...getCardEffectInfos(CS.cards[cardId], null, 2));
  }
  if (!infos.length) {
    for (const cardId of bs?.ownedCardIds || []) infos.push(...getCardEffectInfos(CS.cards[cardId], null, 2));
  }
  if (game?.weapons) {
    for (const [weaponId, weapon] of Object.entries(game.weapons)) {
      if (weapon && (weapon.owned || weapon.level > 0)) infos.push(...getEffectInfosForWeaponId(weaponId, 2));
    }
  }
  return uniqueEffectInfos(infos, limit);
}

function getEffectOverlapInfos(a, b) {
  const bIds = new Set((b || []).map(info => info.id));
  return uniqueEffectInfos((a || []).filter(info => bIds.has(info.id)), 3);
}

function getCardMechanicLabel(card) {
  if (!card) return "机制";
  if (card.theme) return card.theme;
  if (card.tags && card.tags.length) {
    const tag = CS.tags && CS.tags[card.tags[0]];
    return tag ? tag.name : card.tags[0];
  }
  return "机制";
}

function getRecommendedSlotForCard(card) {
  if (!card || !card.slotEffects) return "offense";
  const lesson = getRouteLesson(card.department);
  if (lesson && lesson.openingCards && lesson.openingCards.includes(card.id)) return lesson.recommendedSlot;
  const ids = (CS.buildState?.getUnlockedSlotIds ? CS.buildState.getUnlockedSlotIds() : ["offense", "survival", "resource", "mechanic"]).filter(id => id !== "cost");
  let best = ids[0];
  let bestPower = -Infinity;
  for (const id of ids) {
    const power = card.slotEffects[id]?.powerBudget || 0;
    if (power > bestPower) {
      best = id;
      bestPower = power;
    }
  }
  return best;
}

function isBuildSlotUnlocked(slotId) {
  return CS.buildState?.isSlotUnlocked ? CS.buildState.isSlotUnlocked(slotId) : true;
}

function getSlotUnlockText(slotId) {
  const chapterText = {
    offense: "\u7b2c 1 \u9636\u6bb5\u5f00\u653e\uff1a\u628a\u4e3b\u6b66\u5668\u53d8\u6210\u66f4\u76f4\u63a5\u7684\u6e05\u602a\u4f24\u5bb3\u3002",
    survival: "\u7b2c 2 \u9636\u6bb5\u5f00\u653e\uff1a\u628a\u4e3b\u6b66\u5668\u7684\u4e00\u90e8\u5206\u6536\u76ca\u8f6c\u6210\u62a4\u76fe\u3001\u56de\u8840\u6216\u63a7\u573a\u3002",
    resource: "\u7b2c 2 \u9636\u6bb5\u5f00\u653e\uff1a\u628a\u4e3b\u6b66\u5668\u6536\u76ca\u8f6c\u6210\u7ecf\u9a8c\u3001\u6750\u6599\u6216\u5438\u9644\u3002",
    mechanic: "\u7b2c 3 \u9636\u6bb5\u5f00\u653e\uff1a\u6539\u53d8\u4e3b\u6b66\u5668\u5f62\u6001\u89c4\u5219\uff0c\u4f8b\u5982\u4e8c\u6b21\u5206\u88c2\u3001\u56de\u5f39\u3001\u7559\u573a\u3002",
    cost: "\u7b2c 4 \u9636\u6bb5\u5f00\u653e\uff1a\u7528\u6263\u8840\u3001\u505c\u706b\u6216\u98ce\u9669\u6362\u66f4\u9ad8\u500d\u7387\u3002"
  };
  return chapterText[slotId] || "\u540e\u7eed\u9636\u6bb5\u5f00\u653e";
}
function getSlotReason(card, slotId) {
  const word = getPrimaryEffectInfoForCard(card)?.word || getCardMechanicLabel(card);
  const actions = {
    offense: "\u8f6c\u6210\u66f4\u76f4\u63a5\u7684\u6e05\u602a\u4f24\u5bb3",
    survival: "\u8f6c\u6210\u62a4\u76fe\u3001\u56de\u8840\u6216\u63a8\u5f00\u654c\u4eba",
    resource: "\u8f6c\u6210\u7ecf\u9a8c\u3001\u6750\u6599\u6216\u5438\u9644\u6536\u76ca",
    mechanic: "\u6539\u5199\u4e3b\u6b66\u5668\u5f62\u6001\u89c4\u5219",
    cost: "\u7528\u98ce\u9669\u6362\u66f4\u5f3a\u7206\u53d1"
  };
  return word + '：' + (actions[slotId] || SLOT_META[slotId]?.tradeoff || getSlotOutcomeLabel(card, slotId));
}
function getDeptProgressText(card) {
  const bs = CS.buildState;
  const dept = card?.department || bs.badgeDept;
  const current = bs.deptCardCounts[dept] || 0;
  const projected = bs.ownedCardIds.includes(card?.id) ? current : current + 1;
  const nextTier = (CS.milestoneTiers || []).find(t => t.cards > current);
  const nextText = nextTier ? `距${nextTier.name}还差 ${Math.max(0, nextTier.cards - projected)} 张` : "部门核心已在线";
  return `${getDeptDisplayName(dept)} ${projected}/4 / ${nextText}`;
}

function getWeaponRouteGapText() {
  const activeWeapon = getActiveWeaponId();
  const form = getActiveWeaponForm(activeWeapon);
  if (form) {
    const hasGame = typeof game !== "undefined" && game;
    const promotion = hasGame && game.badgeChosen ? getFormPromotionLine(form, activeWeapon) : "";
    const crossForm = hasGame && game.markerCrossDept ? getWeaponBadgeForm("marker", game.markerCrossDept) : null;
    const cross = crossForm ? " / 第二形态：" + crossForm.displayName : "";
    const aux = hasGame && game.markerAuxWeapon ? " / 辅助技能：" + getMarkerAuxSkillLabel(game.markerAuxWeapon) : "";
    return (CS.weapons?.[activeWeapon]?.name || activeWeapon) + " / " + form.displayName + " / " + form.combatVerb + (promotion ? " / " + promotion : "") + cross + aux;
  }
  const lesson = getRouteLesson(CS.buildState?.badgeDept);
  return lesson?.oneLineGoal || "先选择工牌形态，再用卡槽强化主武器。";
}

function getBuildCompassState(context, card, slotId) {
  const bs = CS.buildState;
  const lesson = getRouteLesson(bs.badgeDept || card?.department);
  const filledSlots = Object.entries(bs.slotCards || {}).filter(([, cid]) => cid).map(([sid, cid]) => (SLOT_META[sid]?.plain || sid) + ":" + (CS.cards[cid]?.name || cid));
  return {
    context,
    identityDept: getDeptDisplayName(bs.badgeDept),
    lessonTitle: lesson.title,
    deptCounts: Object.assign({}, bs.deptCardCounts || {}),
    activeCardMechanics: bs.ownedCardIds.flatMap(id => getCardEffectInfos(CS.cards[id]).map(info => info.word)).filter(Boolean),
    slotAssignments: filledSlots,
    weaponRouteProgress: getWeaponRouteGapText(),
    nextRecommendedAction: getNextRecommendedAction(card, slotId),
    activeSteps: getCompassActiveSteps(context)
  };
}

function getCompassActiveSteps(context) {
  if (context === "upgrade") return ["dept", "card"];
  if (context === "slot") return ["slot"];
  if (context === "armory") return ["weapon"];
  if (context === "combat") return ["feedback"];
  return ["identity"];
}

function getNextRecommendedAction(card, slotId) {
  if (card && slotId) return card.name + " -> " + (SLOT_META[slotId]?.plain || slotId) + ": " + getSlotReason(card, slotId);
  if (card) return getCardEffectLine(card);
  return getWeaponRouteGapText();
}

function renderBuildCompass(context, card, slotId) {
  const state = getBuildCompassState(context, card, slotId);
  const title = escHtml(state.lessonTitle || 'Build');
  const current = escHtml(state.nextRecommendedAction || state.weaponRouteProgress || '');
  return '<div class="build-compass ' + context + '"><div class="build-compass-head"><span>Build</span><strong>' + title + '</strong></div><div class="build-compass-current">' + current + '</div></div>';
}

function showBuildFeedback(title, text) {
  let toast = document.querySelector("#buildFeedbackToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "buildFeedbackToast";
    toast.className = "build-feedback-toast hidden";
    document.querySelector(".game-wrap")?.append(toast);
  }
  toast.innerHTML = "<strong>" + escHtml(title) + "</strong><span>" + escHtml(text) + "</span>";
  toast.classList.remove("hidden");
  window.clearTimeout(showBuildFeedback.timer);
  showBuildFeedback.timer = window.setTimeout(() => toast.classList.add("hidden"), 1800);
}

function showOnboardingHint(id, title, text) {
  const key = `hint:${id}`;
  if (localStorage.getItem(key) === "1") return;
  localStorage.setItem(key, "1");
  showBuildFeedback(title, text);
}

function startOnboardingTrial(card, slotId) {
  if (!game || game.endless || game.stage > 2) return;
  const effectInfo = getPrimaryEffectInfoForCard(card);
  const slotName = SLOT_META[slotId]?.plain || "槽位";
  game._onboardingTrial = {
    timer: 18,
    total: 18,
    effectId: effectInfo?.id || "effect",
    effectWord: effectInfo?.word || getCardMechanicLabel(card),
    slotName,
  };
}

function isOnboardingTrialActive() {
  return !!(game && game._onboardingTrial && game._onboardingTrial.timer > 0 && !game.endless && game.stage <= 2);
}

function getDefaultAttributesForDept(deptId) {
  const map = {
    tech: ["focus", "execution"],
    product: ["execution", "expression"],
    ops: ["resilience", "social"],
    marketing: ["expression", "social"],
    general: ["focus", "resilience"]
  };
  return (map[deptId] || map.tech).filter(id => CS.attributes?.[id]);
}

function startGameWithWeaponAndBadge(weaponId, deptId) {
  const startWeapon = canonicalWeaponId(weaponId || pendingStartWeapon || "marker");
  if (!CS.weapons?.[startWeapon] || !CS.departments?.[deptId]) return;
  CS.buildState.reset();
  CS.buildState.fixedAttributes = getDefaultAttributesForDept(deptId);
  CS.buildState.attributes = [...CS.buildState.fixedAttributes];
  CS.buildState.selectBadge(deptId);
  CS.buildState.selectStartWeapon(startWeapon);
  pendingStartWeapon = startWeapon;
  ui.weaponSelectPanel?.classList.add("hidden");
  ui.badgePanel?.classList.add("hidden");
  startGameActual();
}

function startGameWithWeaponOnly(weaponId) {
  const startWeapon = canonicalWeaponId(weaponId || pendingStartWeapon || "marker");
  if (!CS.weapons?.[startWeapon]) return;
  CS.buildState.reset();
  CS.buildState.weapons = [startWeapon];
  CS.buildState.runDeptPool = ["general"];
  CS.buildState.phase = "playing";
  CS.buildState.stage = 1;
  CS.buildState.runLog.startTime = Date.now();
  CS.buildState.runLog.decisions.push({ type: "start_weapon", weapon: startWeapon });
  pendingStartWeapon = startWeapon;
  ui.weaponSelectPanel?.classList.add("hidden");
  ui.badgePanel?.classList.add("hidden");
  startGameActual();
  game.badgeChosen = false;
  game.activeWeaponForm = getActiveWeaponForm(startWeapon);
}

function openBadgeSelectionDuringRun() {
  if (!game) return;
  state = "badge_select";
  ui.stageBanner?.classList.add("hidden");
  ui.weaponSelectPanel?.classList.add("hidden");
  ui.badgePanel?.classList.remove("hidden");
  ui.startPanel?.classList.remove("hidden");
  ui.startButton?.classList.add("hidden");
  renderBadgeSelection();
  updateHud();
}

function applyBadgeDuringRun(deptId) {
  if (!game || !CS.departments?.[deptId]) return;
  const activeWeaponId = getActiveWeaponId();
  CS.buildState?.selectBadge?.(deptId);
  if (CS.buildState) {
    CS.buildState.weapons = [activeWeaponId];
    if (!CS.buildState.fixedAttributes?.length) {
      const defaults = getDefaultAttributesForDept(deptId);
      CS.buildState.fixedAttributes = defaults.slice();
      CS.buildState.attributes = defaults.slice();
    }
  }
  game.badgeChosen = true;
  game.activeWeaponForm = getActiveWeaponForm(activeWeaponId);
  ui.badgePanel?.classList.add("hidden");
  ui.startPanel?.classList.add("hidden");
  ui.startButton?.classList.add("hidden");
  showBuildFeedback(
    "工牌形态已接入",
    `${getDeptDisplayName(deptId)}让${CS.weapons?.[activeWeaponId]?.name || "主武器"}变成 ${game.activeWeaponForm?.displayName || "新形态"}`
  );
  updateBuildHud();
  updateStatHud();
  updateItemHud();
  if (game.pendingLevelUps > 0) {
    game.pendingLevelUps -= 1;
    openUpgrade("armory");
  } else {
    openWeaponArmory();
  }
}
// v0.3a Step 7: Build summary in death recap
function renderRecapBuildSummary() {
  try {
    var bs = CS.buildState;
    var buildName = bs.generateBuildName();
    var primaryTags = bs._getPrimaryTags();
    var slotSummary = bs._summarizeSlots();
    var evolvedWpns = bs._getEvolvedWeaponNames();

    var tagPills = '';
    for (var i = 0; i < primaryTags.length; i++) {
      var t = primaryTags[i];
      var tagEmoji = (CS.tags[t.tag] && CS.tags[t.tag].emoji) || '';
      tagPills += '<span class="hi-tag-pill" style="font-size:11px;margin:2px 3px">' + tagEmoji + t.name + '(' + t.count + ')</span>';
    }

    var slotHtml = '';
    var slotIds = bs.getAllSlotIds();
    for (var j = 0; j < slotIds.length; j++) {
      var s = slotSummary[slotIds[j]];
      if (!s) continue;
      var attrName = s.attrName || '-';
      slotHtml += '<div style="display:inline-block;margin:2px 6px;font-size:12px">' +
        '<span style="color:#888">' + attrName + '</span> ' +
        '<span style="color:#ffd15c">' + s.cardName + '</span>' +
        '</div>';
    }

    var evoHtml = '';
    if (evolvedWpns.length > 0) {
      evoHtml = '<div style="margin-top:4px"><span style="color:#52ffe1;font-size:12px">杩涘寲：?/span>';
      for (var k = 0; k < evolvedWpns.length; k++) {
        var ev = evolvedWpns[k];
        evoHtml += '<span style="font-size:12px;color:#ffd15c">' + ev.weaponName + ' -> ' + ev.evolutionName + '</span> ';
      }
      evoHtml += '</div>';
    }

    return '<div style="margin:8px 0;padding:8px 12px;background:rgba(255,209,92,0.06);border:1px solid rgba(255,209,92,0.15);border-radius:6px">' +
      '<div style="font-size:18px;font-weight:800;color:#ffd15c;margin-bottom:4px">' + buildName + '</div>' +
      (tagPills ? '<div style="margin-bottom:4px">' + tagPills + '</div>' : '') +
      (slotHtml ? '<div style="margin-bottom:2px">' + slotHtml + '</div>' : '') +
      evoHtml +
      '</div>';
  } catch (e) {
    return '';
  }
}

function renderDeathRecap() {
  if (!ui.deathRecap) return;
  const hints = getDeathHints();
  const bossEntry = getNearestBossKillInfo();
  const topSource = getTopDamageSource();
  const topDmg = Math.round(getTopDamageAmount());
  const activeWeaponId = getActiveWeaponId();
  const form = getActiveWeaponForm(activeWeaponId);
  let bossLine = "";
  if (bossEntry) {
    const bossPct = Math.round((1 - bossEntry.hp / bossEntry.maxHp) * 100);
    bossLine = '<div class="recap-boss-bar"><div class="recap-boss-fill" style="width:' + Math.min(100, bossPct) + '%"></div></div>' +
      '<span>Boss ' + bossEntry.name + ': ' + bossPct + '% damage dealt</span>';
  }
  let dmgDistHtml = '';
  if (game.runLog?.weaponDamages) {
    const dmgEntries = Object.entries(game.runLog.weaponDamages).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const totalDmg = dmgEntries.reduce((s, [, v]) => s + v, 0) || 1;
    dmgDistHtml = '<div class="recap-dmg-dist"><div style="margin-bottom:4px;color:#f4c95d">伤害分布</div>';
    for (const [name, dmg] of dmgEntries) {
      const pct = Math.round(dmg / totalDmg * 100);
      const bar = '#'.repeat(Math.max(1, Math.round(pct / 8)));
      dmgDistHtml += '<div style="margin:2px 0"><span style="display:inline-block;width:80px">' + name + '</span><span style="color:#ffd15c">' + bar + '</span> ' + pct + '%</div>';
    }
    dmgDistHtml += '</div>';
  }
  const hintLines = hints.slice(0, 3).map((h) => '<li>' + h + '</li>').join('');
  ui.deathRecap.innerHTML =
    '<div class="recap-block">' +
      '<div class="recap-title">Build Recap</div>' +
      '<p>Main form: <b>' + (form?.displayName || 'Base Form') + '</b></p>' +
      '<p>Top damage: <b>' + topSource + '</b> / ' + topDmg + '</p>' +
      bossLine +
      dmgDistHtml +
      '<ul>' + hintLines + '</ul>' +
    '</div>';
}
function getNearestBossKillInfo() {
  if (!game?.enemies) return null;
  let best = null;
  for (const e of game.enemies) {
    if (e.type === "manager" || e.type === "deadline") {
      if (!best || e.maxHp > best.maxHp) best = { name: e.label || e.type, hp: e.hp, maxHp: e.maxHp };
    }
  }
  return best;
}

function getDeathHints() {
  const hints = [];
  const stage = game.stage || 1;
  const dmgBySource = game.damageBySource || {};
  const dmgTaken = game.damageTaken || 0;
  const hitsTaken = game.hitsTaken || 0;
  const avgHit = hitsTaken > 0 ? dmgTaken / hitsTaken : 0;
  const armor = getEffectiveStat("armor");
  const dodge = getEffectiveStat("dodge");
  const regen = getEffectiveStat("regen");
  const activeWeaponId = getActiveWeaponId();
  const form = getActiveWeaponForm(activeWeaponId);

  if (avgHit > 20) hints.push("单次受击很重：下局可以补护甲、闪避或减速，让你有时间调整站位。");
  if (armor < 4 && stage >= 3) hints.push("护甲偏低：生存槽或工坊防御道具会明显提高容错。");
  if (dodge < 8 && hitsTaken > 15) hints.push("被围住次数较多：近身清怪、推开或移动速度会更有价值。");
  if (regen < 3 && dmgTaken > 80) hints.push("回复不足：补回血或护盾能让你撑过长波次。");
  if (activeWeaponId === "marker" && form?.mechanicType === "mark_detonate" && !dmgBySource.marker_blast) hints.push("P0 标记需要二次命中高价值目标：绕着精英拉直线，别只扫小怪边缘。");
  if (activeWeaponId === "marker" && form?.mechanicType === "line_split") hints.push("分裂激光吃直线站位：边退边让主线穿过第一只怪，会更容易切开后排。");
  if (stage >= 6 && game.boughtItems && game.boughtItems.size < 2) hints.push("道具偏少：材料副线可以补充护盾、吸附或主武器数值，不只是买新武器。");
  if (!hints.length) hints.push("这局 Build 已经有形态雏形，下次可以围绕主武器继续补输出、生存或资源槽。没有唯一答案。");
  return hints;
}

function getTopDamageAmount() {
  const entries = Object.entries(game.damageBySource || {});
  if (!entries.length) return 0;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][1];
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
    title: "缁х画鍔犵彮",
    text: "鍘嬪姏婧愭棤闄愬埛鏂帮紝姣?120 绉掍細鍑虹幇涓€娆″伐闂村伐鍧娿€?",
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
  // _gameClock handles looping
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
    title: "鐩存帴鍔犵彮",
    text: "浠庢竻绌哄伐浣嶅紑濮嬭繘鍏ユ棤灏藉帇鍔涙祴璇曘€?",
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
  // _gameClock handles looping
}

function recordEndlessBest(seconds) {
  const best = Number.parseInt(localStorage.getItem("cb_endless_best") || "0", 10);
  if (seconds > best) localStorage.setItem("cb_endless_best", String(seconds));
}

function renderBestOvertime() {
  if (!ui.bestOvertimeText) return;
  const best = Number.parseInt(localStorage.getItem("cb_endless_best") || "0", 10);
  ui.bestOvertimeText.classList.toggle("hidden", best <= 0);
  if (best > 0) ui.bestOvertimeText.textContent = `鏈€闀垮姞鐝細${formatTime(best)}`;
}

function startGameActualLegacy() {
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

function loop(now) {
  loopKickQueued = false;
  loopLastFrameAt = performance.now();

// ════════════════════════════════════════════════════════════
//  LAYER 05: CONTENT — 核心游戏循环
//  主循环·玩家移动·武器更新·敌人AI·弹幕·掉落
// ════════════════════════════════════════════════════════════
  const rawDt = Math.min(0.75, (now - lastTime) / 1000 || 0);
  lastTime = now;

  let remainingDt = rawDt;
  let simSteps = 0;
  while (remainingDt > 0 && simSteps < 24 && (state === "playing" || state === "recovery")) {
    const dt = Math.min(0.033, remainingDt);
    if (state === "playing") {
      updateGame(dt);
    } else if (state === "recovery") {
      updateStageRecovery(dt);
    }
    remainingDt -= dt;
    simSteps += 1;
  }

  render();
  updateHud();
  syncDebugStateNode();

  if (state === "playing" || state === "recovery") {
    requestAnimationFrame(loop);
  }
}

function ensureGameLoop(reason = "watchdog") {
  if (!game || !(state === "playing" || state === "recovery")) return;
  if (loopKickQueued) return;
  loopKickQueued = true;
  const run = () => loop(performance.now());
  if (reason === "stalled" && gameLoopSetTimeout) gameLoopSetTimeout(run, 0);
  else requestAnimationFrame(loop);
}

const gameLoopSetInterval =
  (typeof window !== "undefined" && typeof window.setInterval === "function")
    ? window.setInterval.bind(window)
    : (typeof setInterval === "function" ? setInterval : null);
const gameLoopSetTimeout =
  (typeof window !== "undefined" && typeof window.setTimeout === "function")
    ? window.setTimeout.bind(window)
    : (typeof setTimeout === "function" ? setTimeout : null);
if (gameLoopSetInterval) {
  gameLoopSetInterval(() => {
    syncDebugStateNode();
    if (!game || !(state === "playing" || state === "recovery")) return;
    if (!loopLastFrameAt || performance.now() - loopLastFrameAt > 700) {
      ensureGameLoop("stalled");
    }
  }, 500);
}

function updateGame(dt) {
  // Hit-stop: freeze game but still process UI
  if (game.hitStop > 0) {
    game.hitStop -= dt;
    game.screenShake = Math.max(0, game.screenShake - dt * 45);
    if (game.hitStop > 0) return; // freeze everything
    dt = -game.hitStop; // leftover time after hit-stop
    game.hitStop = 0;
  }
  game.screenShake = Math.max(0, game.screenShake - dt * 45);
  game.time += dt;
  game.waveTime += dt;
  game.damageFlash = Math.max(0, (game.damageFlash || 0) - dt * 1.9);
  game.itemDropCooldown = Math.max(0, (game.itemDropCooldown || 0) - dt);
  // Perimeter T1: doubled orbit speed when enemies in headset aura (scaled)
  const pEff = getRouteEffectiveness("perimeter");
  const auraBoost = pEff > 0 && game.enemies.some(en => Math.hypot(en.x - game.player.x, en.y - game.player.y) < getAuraRadius() + 30 + en.r);
  game.orbitAngle += game.player.orbitSpeed * dt * (auraBoost ? 1 + 1 * pEff : 1);
  updatePlayer(dt);

  // System update timer blocks attacking
  if (game.systemUpdateTimer > 0) {
    game.systemUpdateTimer -= dt;
    if (game.systemUpdateTimer <= 0) {
      game.systemUpdateTimer = 0;
      floatingText(game.player.x, game.player.y - 50, "系统更新完成！", "#52ffe1");
      // Hidden reversal: system update grants a burst of power
      if (game._updateComplete === false) {
        game._updateComplete = true;
        game._updatePowerTimer = 10;
        floatingText(game.player.x, game.player.y - 80, "性能提升！伤害+30%", "#ffd15c");
      }
    }
  }
  // Hidden: post-update power surge
  if (game._updatePowerTimer > 0) {
    game._updatePowerTimer -= dt;
    if (game._updatePowerTimer <= 0) { game._updatePowerTimer = 0; game._updatePowerActive = false; }
  }
  const skipWeapons = game.systemUpdateTimer > 0;

  if (!skipWeapons) updateWeapons(dt);
  else {
    // System updating: only passive effects (auras, orbits) continue
    updatePassiveEffects(dt);
  }
  updateEnemies(dt);
  updateDamageZones(dt);
  updateDelayedBlasts(dt);
  updateProjectiles(dt);
  updatePickups(dt);
  updateParticles(dt);
  updateFloatingTexts(dt);
  spawnEnemies(dt);
  if (game.endless) updateEndlessMode(dt);

  if (game.player.hp <= 0) {
    endGame(false);
    return;
  }
  updateRouteVisuals(dt);
  updateLowHpVisuals();
  if (!game.endless) {
    if (game.enemiesToSpawn <= 0 && game.enemies.length === 0) completeStage("clear");
    else if (game.waveTime >= game.stageConfig.duration) completeStage("survive");
  }
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
  p.vx = dx === 0 && dy === 0 ? 0 : (dx / len) * moveSpeed;
  p.vy = dx === 0 && dy === 0 ? 0 : (dy / len) * moveSpeed;
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

// Passive-only effects when system update blocks active weapons
function updatePassiveEffects(dt) {
  // Orbit angle still advances
  game.orbitAngle += game.player.orbitSpeed * dt;
  // Headset aura still pulses
  const headset = game.weapons.headset;
  if (headset && headset.level > 0) {
    headset.pulseTimer = (headset.pulseTimer || 0) + dt;
    if (headset.pulseTimer >= headset.pulseCycle && game.enemies.length > 0) {
      headset.pulseTimer = 0;
      const centerX = game.player.x;
      const centerY = game.player.y;
      for (const e of game.enemies) {
        const dist = Math.hypot(e.x - centerX, e.y - centerY);
        if (dist < getAuraRadius()) {
          applyEnemyDamage(e, continuousDamage(8 * getWeaponStatScale("field")), "headset");
        }
      }
    }
  }
  // Sticky traps still tick but don't deal damage
  // Damage zones still persist
}

function getWeaponFormContext(weaponId, level = 1) {
  const form = getActiveWeaponForm(weaponId);
  const params = getActiveFormParams(weaponId, level);
  const mechanic = form?.mechanicType || form?.formId || "";
  return { form, params, mechanic };
}

function findNearestEnemyFrom(x, y, maxRange = Infinity, excludeId = null) {
  let bestEnemy = null;
  let best = maxRange;
  for (const e of game.enemies) {
    if (excludeId !== null && e.id === excludeId) continue;
    const d = Math.hypot(e.x - x, e.y - y);
    if (d < best) {
      best = d;
      bestEnemy = e;
    }
  }
  return bestEnemy;
}

function spawnCoffeeDrone(level, params = {}) {
  game.coffeeDrones = game.coffeeDrones || [];
  const cap = Math.min(4, 1 + Math.floor(level / 4) + Math.floor(params.countBonus || 0));
  if (game.coffeeDrones.length >= cap) {
    const oldest = game.coffeeDrones.reduce((a, b) => a.life < b.life ? a : b);
    oldest.life = Math.max(oldest.life, (params.droneLife || 5.2) * 0.65);
    return;
  }
  const angle = game.time * 2.4 + game.coffeeDrones.length * TAU / Math.max(1, cap);
  game.coffeeDrones.push({
    angle,
    distance: 44 + game.coffeeDrones.length * 8,
    life: (params.droneLife || 5.2) + Math.min(2.2, (params.durationBonus || 0) * 0.5),
    maxLife: (params.droneLife || 5.2) + Math.min(2.2, (params.durationBonus || 0) * 0.5),
    timer: 0.05 + game.coffeeDrones.length * 0.12,
  });
  floatingText(game.player.x, game.player.y - 48, "续杯无人机", "#f4c95d");
  pulse(game.player.x, game.player.y, 58, "#f4c95d");
}

function updateCoffeeDrones(dt) {
  if (!game.coffeeDrones?.length) return;
  const level = game.weapons.coffee?.level || 1;
  const { params } = getWeaponFormContext("coffee", level);
  for (const drone of game.coffeeDrones) {
    drone.life -= dt;
    drone.angle += dt * (1.7 + level * 0.05);
    drone.x = game.player.x + Math.cos(drone.angle) * drone.distance;
    drone.y = game.player.y + Math.sin(drone.angle) * drone.distance * 0.72;
    drone.timer -= dt;
    if (drone.timer <= 0) {
      const target = findNearestEnemyFrom(drone.x, drone.y, 520);
      if (target) {
        const a = Math.atan2(target.y - drone.y, target.x - drone.x);
        spawnProjectile({
          x: drone.x,
          y: drone.y,
          vx: Math.cos(a) * 500,
          vy: Math.sin(a) * 500,
          r: 3.5,
          life: 0.9,
          damage: hitDamage((7 + level * 2.6) * (params.damage || 1)),
          color: "#f4c95d",
          pierce: 1,
          source: "coffee",
          coffeeDrone: true,
        });
      }
      drone.timer = Math.max(0.32, (params.droneCooldown || 0.68) * (params.cooldown || 1));
    }
  }
  game.coffeeDrones = game.coffeeDrones.filter((drone) => drone.life > 0);
}

function triggerKeyboardGuardCounter(source = "guard") {
  const p = game.player;
  const level = game.weapons.keyboard?.level || 1;
  const { params } = getWeaponFormContext("keyboard", level);
  const radius = (params.counterRadius || 118) + level * 5 + Math.min(36, (params.radiusBonus || 0) * 14);
  const damage = hitDamage((28 + level * 7.6) * (params.counterDamage || 1) * (params.damage || 1));
  let hits = 0;
  for (const e of game.enemies) {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const dist = Math.hypot(dx, dy) || 1;
    if (dist > radius + e.r) continue;
    applyEnemyDamage(e, damage, "keyboard");
    e.x += (dx / dist) * (54 + level * 4);
    e.y += (dy / dist) * (54 + level * 4);
    e.slow = Math.min(e.slow || 1, 0.52);
    e.hitFlash = 0.18;
    hits += 1;
  }
  game.keyboardGuardVisual = { x: p.x, y: p.y, radius, life: 0.28, maxLife: 0.28 };
  game.hitStop = Math.max(game.hitStop || 0, hits ? 0.07 : 0.035);
  game.screenShake = Math.max(game.screenShake || 0, hits ? 5 : 2);
  pulse(p.x, p.y, radius, "#6ea8ff");
  floatingText(p.x, p.y - 46, source === "perfect" ? "完美盾反" : "盾反", "#8ec8ff");
  if (source === "perfect") game.player.keyboardTimer = Math.min(game.player.keyboardTimer || 0, 0.12);
}

function addStaplerAnchor(x, y, level, params = {}) {
  game.staplerAnchors = game.staplerAnchors || [];
  const cap = 7 + Math.floor(level / 3) + Math.floor(params.countBonus || 0);
  game.staplerAnchors.push({
    x,
    y,
    life: 5 + Math.min(3, (params.durationBonus || 0) * 0.8),
    maxLife: 5 + Math.min(3, (params.durationBonus || 0) * 0.8),
    r: 7,
  });
  while (game.staplerAnchors.length > cap) game.staplerAnchors.shift();
}

function updateStaplerAnchors(dt) {
  if (!game.staplerAnchors?.length) return;
  const level = game.weapons.stapler?.level || 1;
  const { params } = getWeaponFormContext("stapler", level);
  for (const anchor of game.staplerAnchors) anchor.life -= dt;
  game.staplerAnchors = game.staplerAnchors.filter((anchor) => anchor.life > 0);
  if (game.staplerAnchors.length < 2) return;
  const damage = continuousDamage((5 + level * 1.25) * (params.damage || 1));
  for (let i = 0; i < game.staplerAnchors.length; i += 1) {
    for (let j = i + 1; j < game.staplerAnchors.length; j += 1) {
      const a = game.staplerAnchors[i];
      const b = game.staplerAnchors[j];
      const lineLen = Math.hypot(a.x - b.x, a.y - b.y);
      if (lineLen > 245 || lineLen < 36) continue;
      for (const e of game.enemies) {
        const d = distanceToSegment(e.x, e.y, a.x, a.y, b.x, b.y);
        if (d > e.r + 10) continue;
        applyEnemyDamage(e, damage * dt, "stapler", false);
        e.slow = Math.min(e.slow || 1, 0.38);
        e.hitFlash = Math.max(e.hitFlash || 0, 0.045);
      }
    }
  }
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy || 1;
  const t = clamp(((px - ax) * dx + (py - ay) * dy) / len2, 0, 1);
  const x = ax + dx * t;
  const y = ay + dy * t;
  return Math.hypot(px - x, py - y);
}

function handleProjectileFormHit(pr, enemy) {
  if (pr.source === "coffee") {
    const level = game.weapons.coffee?.level || 1;
    const { mechanic, params } = getWeaponFormContext("coffee", level);
    if (mechanic === "hit_count_summon" && !pr.coffeeDrone) {
      game.player.coffeeRefillHits = (game.player.coffeeRefillHits || 0) + 1;
      const threshold = Math.max(3, Math.round((params.refillHits || 5) - Math.min(2, params.mechanic || 0)));
      if (game.player.coffeeRefillHits >= threshold) {
        game.player.coffeeRefillHits = 0;
        spawnCoffeeDrone(level, params);
      }
    } else if (mechanic === "stack_detonate") {
      enemy.caffeine = (enemy.caffeine || 0) + 1;
      if (enemy.caffeine >= (params.caffeineMax || 3)) {
        enemy.caffeine = 0;
        game.delayedBlasts.push({ x: enemy.x, y: enemy.y, r: (params.blastRadius || 52) + (params.radiusBonus || 0) * 12, delay: 0, damage: pr.damage * (params.blastDamage || 0.86), source: "coffee", color: "#f4c95d", text: "浓缩过载" });
      }
    } else if (mechanic === "orbit_consumable_shield") {
      game.player.markerEmergencyShield = Math.min(34, (game.player.markerEmergencyShield || 0) + 0.35 + (params.shieldBonus || 0) * 0.15);
    } else if (mechanic === "debuff_spread_on_death") {
      enemy.coffeeAroma = Math.max(enemy.coffeeAroma || 0, 3.6);
      enemy.coffeeAromaSourceDamage = Math.max(enemy.coffeeAromaSourceDamage || 0, pr.damage * 0.44);
    }
  }
  if (pr.source === "stapler") {
    const level = game.weapons.stapler?.level || 1;
    const { mechanic, params } = getWeaponFormContext("stapler", level);
    if (mechanic === "anchor_link_lockline") {
      addStaplerAnchor(pr.x, pr.y, level, params);
    } else if (mechanic === "bind_damage_threshold_detonate") {
      enemy.staplerBindUntil = game.time + 3.2;
      enemy.staplerBindDamage = enemy.staplerBindDamage || 0;
      enemy.staplerBindThreshold = Math.max(44, enemy.hp * 0.18);
      floatingText(enemy.x, enemy.y - enemy.r - 8, "装订", "#d7d0c2");
    } else if (mechanic === "projectile_bounce_scatter" && !pr._scatterDone) {
      pr._scatterDone = true;
      const base = Math.atan2(pr.vy, pr.vx);
      for (let i = -1; i <= 1; i += 1) {
        spawnProjectile({
          x: pr.x,
          y: pr.y,
          vx: Math.cos(base + i * 0.42) * 380,
          vy: Math.sin(base + i * 0.42) * 380,
          r: 2.8,
          life: 0.42,
          damage: pr.damage * 0.34,
          color: "#d7d0c2",
          pierce: 1,
          source: "stapler",
        });
      }
    }
  }
  if (pr.source === "calculator") {
    const level = game.weapons.calculator?.level || 1;
    const { mechanic, params } = getWeaponFormContext("calculator", level);
    if (mechanic === "ledger_death_settlement") {
      enemy.auditLedger = Math.max(enemy.auditLedger || 0, 3.8);
      enemy.auditLedgerDamage = (enemy.auditLedgerDamage || 0) + pr.damage * 0.36;
      enemy.auditLedgerValue = Math.min(5, (enemy.auditLedgerValue || 0) + 1 + Math.floor(params.resource || 0));
    }
  }
}

function handleFormDamageApplied(enemy, damage, source) {
  if (enemy.reportKpiUntil && enemy.reportKpiUntil > game.time) {
    enemy.reportKpiDamage = (enemy.reportKpiDamage || 0) + damage;
  }
  if (enemy.profitPointUntil && enemy.profitPointUntil > game.time) {
    enemy.profitPointDamage = (enemy.profitPointDamage || 0) + damage;
  }
  if (enemy.staplerBindUntil && enemy.staplerBindUntil > game.time) {
    enemy.staplerBindDamage = (enemy.staplerBindDamage || 0) + damage;
    if (enemy.staplerBindDamage >= (enemy.staplerBindThreshold || 80)) {
      enemy.staplerBindUntil = 0;
      enemy.staplerBindDamage = 0;
      game.delayedBlasts.push({ x: enemy.x, y: enemy.y, r: 68, delay: 0, damage: hitDamage(36), source: "stapler", color: "#d7d0c2", text: "装订爆" });
    }
  }
}

function handleWeaponFormEnemyDeath(enemy) {
  if (enemy.coffeeAroma > 0) {
    let spread = 0;
    for (const target of game.enemies) {
      if (target === enemy || spread >= 2) continue;
      if (Math.hypot(target.x - enemy.x, target.y - enemy.y) > 130 + target.r) continue;
      target.coffeeAroma = Math.max(target.coffeeAroma || 0, 2.8);
      applyEnemyDamage(target, enemy.coffeeAromaSourceDamage || 8, "coffee", false);
      spread += 1;
    }
    if (spread) pulse(enemy.x, enemy.y, 120, "#f4c95d");
  }
  if (enemy.auditLedger > 0) {
    const value = Math.max(1, Math.round(enemy.auditLedgerValue || 1));
    game.pickups.push({ kind: "material", x: enemy.x, y: enemy.y, r: 7, value });
    game.damageZones.push({
      x: enemy.x,
      y: enemy.y,
      r: 54,
      life: 1.2,
      maxLife: 1.2,
      damage: continuousDamage((enemy.auditLedgerDamage || 8) * 0.5),
      source: "calculator",
      tick: 0.24,
      chainTick: Infinity,
      textTick: 0,
      color: "#52ffe1",
    });
    const transfer = findNearestEnemyFrom(enemy.x, enemy.y, 220, enemy.id);
    if (transfer) {
      transfer.auditLedger = Math.max(transfer.auditLedger || 0, 2.6);
      transfer.auditLedgerDamage = (transfer.auditLedgerDamage || 0) + (enemy.auditLedgerDamage || 8) * 0.42;
      transfer.auditLedgerValue = Math.min(5, (transfer.auditLedgerValue || 0) + 1);
      floatingText(transfer.x, transfer.y - transfer.r - 8, "转账", "#52ffe1");
    }
    floatingText(enemy.x, enemy.y - 12, "审计结算", "#52ffe1");
  }
  if (enemy.reportRead > 0) {
    let spread = 0;
    for (const target of game.enemies) {
      if (target === enemy || spread >= 2) continue;
      if (Math.hypot(target.x - enemy.x, target.y - enemy.y) > 120 + target.r) continue;
      target.reportRead = Math.max(target.reportRead || 0, 2.4);
      applyEnemyDamage(target, continuousDamage(8), "report", false);
      spread += 1;
    }
    if (spread) pulse(enemy.x, enemy.y, 110, "#ffd15c");
  }
  if (enemy.lastHitSource === "shredder") {
    const level = game.weapons.shredder?.level || 0;
    const { mechanic, params } = getWeaponFormContext("shredder", level);
    if (mechanic === "death_fragment_barrier_resource") {
      game.pickups.push({ kind: "material", x: enemy.x + 8, y: enemy.y - 4, r: 7, value: 1 + Math.floor(params.resource || 0) });
      game.damageZones.push({
        x: enemy.x,
        y: enemy.y,
        r: 42,
        life: 1.4,
        maxLife: 1.4,
        damage: continuousDamage(4 + level),
        source: "shredder_fragment",
        tick: 0.22,
        chainTick: Infinity,
        textTick: 0,
        slow: 0.42,
        color: "#c5d4ff",
      });
    }
  }
}

function updateEnemyTimedFormStates(dt) {
  for (const e of game.enemies) {
    if (e.coffeeAroma > 0) {
      e.coffeeAroma -= dt;
      if (Math.floor(e.coffeeAroma * 5) !== Math.floor((e.coffeeAroma + dt) * 5)) {
        applyEnemyDamage(e, continuousDamage(2.2) * dt, "coffee", false);
      }
    }
    if (e.headphoneRebroadcast > 0) {
      e.headphoneRebroadcast -= dt;
      if (e.headphoneRebroadcast <= 0) {
        const level = game.weapons.headset?.level || game.weapons.headphones?.level || 1;
        const { params } = getWeaponFormContext("headphones", level);
        const radius = 78 + Math.min(42, (params.radiusBonus || 0) * 14);
        const damage = continuousDamage((10 + level * 2.1) * (params.damage || 1));
        game.damageZones.push({
          x: e.x,
          y: e.y,
          r: radius,
          life: 0.52,
          maxLife: 0.52,
          damage,
          source: "headset",
          tick: 0.12,
          chainTick: Infinity,
          textTick: 0,
          push: 20,
          color: "#8ec8ff",
          rebroadcast: true,
        });
        pulse(e.x, e.y, radius, "#8ec8ff");
        floatingText(e.x, e.y - e.r - 10, "接力声波", "#8ec8ff");
      }
    }
    if (e.reportKpiUntil && e.reportKpiUntil <= game.time) {
      const damage = Math.max(10, (e.reportKpiDamage || 0) * 0.62);
      applyEnemyDamage(e, hitDamage(damage), "report");
      game.delayedBlasts.push({ x: e.x, y: e.y, r: 78, delay: 0, damage: hitDamage(damage * 0.22), source: "report", color: "#ffd15c", text: "KPI结算" });
      e.reportKpiUntil = 0;
      e.reportKpiDamage = 0;
    }
    if (e.profitPointUntil && e.profitPointUntil <= game.time) {
      const damage = Math.max(8, (e.profitPointDamage || 0) * 0.5);
      applyEnemyDamage(e, hitDamage(damage), "calculator");
      game.delayedBlasts.push({ x: e.x, y: e.y, r: 64, delay: 0, damage: hitDamage(damage * 0.18), source: "calculator", color: "#ffd15c", text: "利润结算" });
      e.profitPointUntil = 0;
      e.profitPointDamage = 0;
    }
  }
}

function updateReportKpi(dt) {
  const level = game.weapons.report?.level || 0;
  if (level <= 0) return;
  const { mechanic, params } = getWeaponFormContext("report", level);
  if (mechanic !== "target_window_damage_settle") return;
  game.reportKpiTimer = Math.max(0, (game.reportKpiTimer || 0) - dt);
  const active = game.enemies.some((e) => e.reportKpiUntil && e.reportKpiUntil > game.time);
  if (active || game.reportKpiTimer > 0) return;
  let target = null;
  let bestScore = -Infinity;
  for (const e of game.enemies) {
    const score = e.hp + (e.elite ? 180 : 0) + (e.type === "boss" ? 500 : 0);
    if (score > bestScore) {
      bestScore = score;
      target = e;
    }
  }
  if (!target) return;
  target.reportKpiUntil = game.time + (params.window || 3.2) + Math.min(1.2, (params.durationBonus || 0) * 0.25);
  target.reportKpiDamage = 0;
  floatingText(target.x, target.y - target.r - 18, "KPI窗口", "#ffd15c");
  pulse(target.x, target.y, target.r + 36, "#ffd15c");
  game.reportKpiTimer = Math.max(4.2, 7.4 * (params.cooldown || 1));
}

function updateWeaponFormSystems(dt) {
  updateHeadphoneFormSystems(dt);
  updateReportFormSystems(dt);
  updateCalculatorFormSystems(dt);
}

function addFormShield(amount, cap = 42, label = "护盾") {
  if (!amount || amount <= 0) return;
  const p = game.player;
  p.formShield = Math.min(cap, (p.formShield || 0) + amount);
  if (!p._formShieldCue || game.time - p._formShieldCue > 1.2) {
    p._formShieldCue = game.time;
    floatingText(p.x, p.y - 52, `${label}+${Math.round(amount)}`, "#8ec8ff");
    pulse(p.x, p.y, 48, "#8ec8ff");
  }
}

function updateHeadphoneFormSystems(dt) {
  const level = game.weapons.headset?.level || game.weapons.headphones?.level || 0;
  if (level <= 0) return;
  const { mechanic, params } = getWeaponFormContext("headphones", level);
  const p = game.player;
  if (mechanic === "temporary_aura_summon") {
    game.headphoneSourceTimer = Math.max(0, (game.headphoneSourceTimer || 0) - dt);
    if (game.headphoneSourceTimer <= 0) {
      const target = findNearestEnemyFrom(p.x, p.y, 520);
      if (target) {
        const life = 2.4 + Math.min(1.2, (params.durationBonus || 0) * 0.25);
        game.damageZones.push({
          x: target.x,
          y: target.y,
          r: 72 + Math.min(26, (params.radiusBonus || 0) * 9),
          life,
          maxLife: life,
          damage: continuousDamage((7 + level * 1.5) * (params.damage || 1)),
          source: "headset",
          tick: 0.18,
          chainTick: Infinity,
          textTick: 0,
          slow: 0.68,
          color: "#52ffe1",
        });
        floatingText(target.x, target.y - 40, "蓝牙音源", "#52ffe1");
      }
      game.headphoneSourceTimer = Math.max(2.4, 4.8 * (params.cooldown || 1));
    }
  } else if (mechanic === "timed_pulse_burst") {
    game.headphoneBassTimer = Math.max(0, (game.headphoneBassTimer || 0) - dt);
    if (game.headphoneBassTimer <= 0) {
      const radius = getAuraRadius() + 44 + Math.min(34, (params.radiusBonus || 0) * 10);
      for (const e of game.enemies) {
        const dx = e.x - p.x;
        const dy = e.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist > radius + e.r) continue;
        applyEnemyDamage(e, hitDamage((16 + level * 4.2) * (params.damage || 1)), "headset");
        e.x += (dx / dist) * 48;
        e.y += (dy / dist) * 48;
        e.slow = Math.min(e.slow || 1, 0.52);
      }
      floatingText(p.x, p.y - radius * 0.32, "重低音", "#8ec8ff");
      pulse(p.x, p.y, radius, "#8ec8ff");
      game.headphoneBassTimer = Math.max(2.2, 4.2 * (params.cooldown || 1));
    }
  } else if (mechanic === "silence_zone_economy") {
    game.silenceRoomTimer = Math.max(0, (game.silenceRoomTimer || 0) - dt);
    if (game.silenceRoomTimer <= 0) {
      const life = 3.2 + Math.min(1.4, (params.durationBonus || 0) * 0.3);
      game.damageZones.push({
        x: p.x,
        y: p.y,
        r: 96 + Math.min(36, (params.radiusBonus || 0) * 10),
        life,
        maxLife: life,
        damage: continuousDamage((4 + level * 0.8) * (params.damage || 1)),
        source: "headset",
        tick: 0.24,
        chainTick: Infinity,
        textTick: 0,
        slow: 0.46,
        color: "#65f1ff",
      });
      floatingText(p.x, p.y - 58, "静音区", "#65f1ff");
      game.silenceRoomTimer = 5.6;
    }
  }
}

function updateReportFormSystems(dt) {
  const level = game.weapons.report?.level || 0;
  if (level <= 0) return;
  const { mechanic, params } = getWeaponFormContext("report", level);
  const p = game.player;
  if (mechanic === "global_periodic_status") {
    game.globalReportTimer = Math.max(0, (game.globalReportTimer || 0) - dt);
    if (game.globalReportTimer <= 0) {
      for (const e of game.enemies) {
        applyEnemyDamage(e, continuousDamage((5 + level * 1.1) * (params.damage || 1)), "report", false);
        e.reportRead = Math.max(e.reportRead || 0, 3.2);
        e.slow = Math.min(e.slow || 1, 0.72);
      }
      floatingText(p.x, p.y - 92, "全员周报", "#ffd15c");
      pulse(p.x, p.y, 360, "#ffd15c");
      game.globalReportTimer = Math.max(4.8, 7.2 * (params.cooldown || 1));
    }
  } else if (mechanic === "node_link_rule_zone") {
    game.reportNodeTimer = Math.max(0, (game.reportNodeTimer || 0) - dt);
    if (game.reportNodeTimer <= 0) {
      const orb = getOrbiters()[0] || p;
      game.damageZones.push({
        x: orb.x,
        y: orb.y,
        r: 48 + Math.min(24, (params.radiusBonus || 0) * 8),
        life: 3.8,
        maxLife: 3.8,
        damage: continuousDamage((5 + level * 1.1) * (params.damage || 1)),
        source: "report_archive",
        tick: 0.22,
        chainTick: Infinity,
        textTick: 0,
        slow: 0.44,
        color: "#ffd15c",
      });
      floatingText(orb.x, orb.y - 28, "归档节点", "#ffd15c");
      game.reportNodeTimer = 2.8;
    }
  }
}

function updateCalculatorFormSystems(dt) {
  const level = game.weapons.calculator?.level || 0;
  if (level <= 0) return;
  const { mechanic, params } = getWeaponFormContext("calculator", level);
  if (mechanic !== "value_target_profit_detonate") return;
  game.calculatorProfitTimer = Math.max(0, (game.calculatorProfitTimer || 0) - dt);
  if (game.calculatorProfitTimer > 0 || game.enemies.some((e) => e.profitPointUntil && e.profitPointUntil > game.time)) return;
  let target = null;
  let best = -Infinity;
  for (const e of game.enemies) {
    const score = e.hp + (e.elite ? 150 : 0) + (e.type === "boss" ? 450 : 0);
    if (score > best) { best = score; target = e; }
  }
  if (!target) return;
  target.profitPointUntil = game.time + 2.8 + Math.min(1.0, (params.durationBonus || 0) * 0.2);
  target.profitPointDamage = 0;
  floatingText(target.x, target.y - target.r - 18, "利润点", "#ffd15c");
  pulse(target.x, target.y, target.r + 30, "#ffd15c");
  game.calculatorProfitTimer = 6.8 * (params.cooldown || 1);
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
  // Route dominance effectiveness (0=no pair, 0.5=sub, 1.0=dom, 1.25=sole)
  const precisionEff = getRouteEffectiveness("precision");
  const barrageEff = getRouteEffectiveness("barrage");
  const conductorEff = getRouteEffectiveness("conductor");
  const perimeterEff = getRouteEffectiveness("perimeter");
  game.routeEff = { precision: precisionEff, barrage: barrageEff, conductor: conductorEff, perimeter: perimeterEff };

  updateCoffeeDrones(dt);
  updateStaplerAnchors(dt);
  updateEnemyTimedFormStates(dt);
  updateReportKpi(dt);
  updateWeaponFormSystems(dt);
  updateShredder(dt);
  updateThermos(dt);

  // Precision route: mark decay (only if paired + effectiveness > 0)
  if (precisionEff > 0) {
    for (const e of game.enemies) {
      if (e.precisionMark > 0) e.precisionMark = Math.max(0, e.precisionMark - dt);
    }
  }
  // Barrage: decay keyboard knockback tags (gated by effectiveness)
  if (barrageEff > 0 && barrageTier >= 4) {
    for (const e of game.enemies) {
      if (e.kbTag > 0) e.kbTag = Math.max(0, e.kbTag - dt);
    }
  }
  // Barrage route: surround bonus
  const surroundCount = barrage ? game.enemies.filter(en => Math.hypot(en.x - p.x, en.y - p.y) < 140).length : 0;
  const isSurrounded = surroundCount >= 5 && barrage;

  p.coffeeTimer -= dt;
  if (game.weapons.coffee.level > 0 && p.coffeeTimer <= 0 && target) {
    const level = game.weapons.coffee.level;
    const coffeeContext = getWeaponFormContext("coffee", level);
    const coffeeParams = coffeeContext.params;
    const angle = Math.atan2(target.y - p.y, target.x - p.x);
    p.coffeeShotCount += 1;
    const bigShot = level >= 5 && p.coffeeShotCount % 5 === 0;
    // Precision: distance-based damage (scaled by effectiveness)
    const distBonus = precisionEff > 0 && precisionTier >= 3
      ? 1 + Math.min(0.3, Math.floor(Math.hypot(target.x - p.x, target.y - p.y) / 100) * 0.06) * precisionEff : 1;
    const coffeeLatePenalty = game.stage <= 3 ? 1 : game.stage <= 6 ? 0.7 : 0.45;
    const damage = hitDamage((14 + level * 4.2) * getWeaponStatScale("precise") * (precision ? 1.12 : 1) * (bigShot ? 1.75 : 1) * coffeeLatePenalty * distBonus * (coffeeParams.damage || 1));
    if (precisionEff > 0) {
      target.precisionMark = 1.5 * precisionEff;
    }
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
    if (precisionTier >= 3 && level >= 3 && Math.random() < clamp(getEffectiveStat("crit"), 10, 75) / 200) {
      game.damageZones.push({
        x: target.x,
        y: target.y,
        r: 52 + level * 4,
        life: 0.48,
        maxLife: 0.48,
        damage: damage * 0.34,
        source: "coffee",
        tick: 0.24,
        chainTick: Infinity,
        textTick: 0,
        residual: true,
        color: "#b282ff",
      });
      floatingText(target.x, target.y - 18, "校准", "#b282ff");
    }
    if (precision) {
      fireBeam(angle, 420 + rangeBonus(0.9), 3 + Math.floor(level / 2), hitDamage(5 + game.weapons.marker.level * 2.2), "#b282ff", "marker");
      // Precision resonance synergy: extra beam on crit
      if (game.precisionResonanceActive && Math.random() < 0.35) {
        fireBeam(angle + 0.3, 280 + rangeBonus(0.6), 2 + Math.floor(level / 3), hitDamage(4 + level * 1.8), "#c35cff", "marker");
      }
    }
    if (precisionTier >= 4) {
      fireBeam(angle - 0.18, 520 + rangeBonus(1.0), 3 + Math.floor(level / 2), hitDamage(7 + level * 2.4), "#52ffe1", "marker");
      fireBeam(angle + 0.18, 520 + rangeBonus(1.0), 3 + Math.floor(level / 2), hitDamage(7 + level * 2.4), "#c35cff", "marker");
    }
    if (level >= 4) {
      fireAt({ x: target.x + 26, y: target.y - 18 }, 500, hitDamage(9 + level * 2.2), "#f7dda0", 1, 3, 1.05 + rangeBonus(0.003), "coffee");
      fireAt({ x: target.x - 26, y: target.y + 18 }, 500, hitDamage(9 + level * 2.2), "#f7dda0", 1, 3, 1.05 + rangeBonus(0.003), "coffee");
    }
    p.coffeeTimer = weaponCooldown(p.coffeeCooldown * (precision ? 0.88 : 1) * (coffeeParams.cooldown || 1), "coffee");
  }

  p.keyboardGuardWindow = Math.max(0, (p.keyboardGuardWindow || 0) - dt);
  p.keyboardTimer -= dt;
  if (game.weapons.keyboard.level > 0 && p.keyboardTimer <= 0 && target) {
    const level = game.weapons.keyboard.level;
    const keyboardContext = getWeaponFormContext("keyboard", level);
    const keyboardParams = keyboardContext.params;
    if (keyboardContext.mechanic === "shield_counter") {
      const close = game.enemies.some((e) => Math.hypot(e.x - p.x, e.y - p.y) < (keyboardParams.counterRadius || 118) + e.r);
      p.keyboardGuardWindow = (keyboardParams.guardWindow || 0.34) + Math.min(0.18, (keyboardParams.durationBonus || 0) * 0.04);
      game.keyboardGuardVisual = { x: p.x, y: p.y, radius: (keyboardParams.counterRadius || 118), life: p.keyboardGuardWindow, maxLife: p.keyboardGuardWindow };
      if (close) triggerKeyboardGuardCounter("guard");
      p.keyboardTimer = weaponCooldown(Math.max(0.58, (1.18 - level * 0.05) * (keyboardParams.cooldown || 1)), "keyboard");
      return;
    }
    p.keyboardSwingCount += 1;
    const evolved = hasWeaponEvolution("keyboard");
    const enterBurst = keyboardContext.mechanic === "charge_next_attack" && p.keyboardEnterReady;
    const heavyStrike = enterBurst || ((level >= 5 || evolved) && p.keyboardSwingCount % 3 === 0);
    const swingArc = Math.PI * (heavyStrike ? 1.15 : 0.89);
    const swingRange = 90 + p.keyboardSwing * 14 + (heavyStrike ? 50 : 0) + (evolved ? 20 : 0);
    const baseAngle = Math.atan2(target.y - p.y, target.x - p.x);
    const kbForce = 50 + p.keyboardKnockback * 18 + (heavyStrike ? 50 : 0);

    let hitCount = 0;
    for (const e of game.enemies) {
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      let angleDiff = angle - baseAngle;
      while (angleDiff > Math.PI) angleDiff -= TAU;
      while (angleDiff < -Math.PI) angleDiff += TAU;
      if (dist < e.r + swingRange && Math.abs(angleDiff) < swingArc / 2) {
        const swingDamage = hitDamage((35 + level * 8.5) * (heavyStrike ? 2.5 : 1) * (barrage ? 1.12 : 1) * (barrageTier >= 4 ? 1.15 : 1) * (evolved ? 1.2 : 1));
        applyEnemyDamage(e, swingDamage, "keyboard");
        e.x += Math.cos(baseAngle) * kbForce;
        e.y += Math.sin(baseAngle) * kbForce;
        e.slow = Math.min(e.slow || 1, evolved ? 0.45 : 0.65);
        if (barrageEff > 0) e.kbTag = 0.5 * barrageEff; // Barrage T4: knockback mark
        if (level >= 4) {
          e.keycapMark = (e.keycapMark || 0) + 2;
        }
        if (keyboardContext.mechanic === "mark_stun_followup") {
          if (e.shortcutMark > 0) {
            e.shortcutMark = 0;
            e.slow = Math.min(e.slow || 1, 0.12);
            applyEnemyDamage(e, swingDamage * 0.32, "keyboard");
            floatingText(e.x, e.y - e.r - 8, "快捷键", "#65f1ff");
          } else {
            e.shortcutMark = 3.2;
          }
        }
        hitCount += 1;
      }
    }

    if (keyboardContext.mechanic === "charge_next_attack") {
      if (enterBurst) {
        p.keyboardEnterReady = false;
        p.keyboardEnterCharge = 0;
        floatingText(p.x, p.y - 48, "回车重击", "#ffd15c");
      } else if (hitCount > 0) {
        p.keyboardEnterCharge = (p.keyboardEnterCharge || 0) + hitCount;
        if (p.keyboardEnterCharge >= 4) {
          p.keyboardEnterReady = true;
          floatingText(p.x, p.y - 48, "回车就绪", "#ffd15c");
        }
      }
    }
    if (keyboardContext.mechanic === "combo_repeat" && hitCount > 0 && p.keyboardSwingCount % Math.max(2, Math.round(keyboardParams.repeatEvery || 3)) === 0) {
      for (const e of game.enemies) {
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.r + swingRange * 0.72) {
          applyEnemyDamage(e, hitDamage((15 + level * 4.2) * (keyboardParams.repeatDamage || 0.48)), "keyboard");
          e.hitFlash = 0.16;
        }
      }
      game.swingTrails.push({ x: p.x, y: p.y, angle: baseAngle + 0.28, arc: swingArc * 0.7, range: swingRange * 0.72, life: 0.22, maxLife: 0.22, heavy: false });
      floatingText(p.x, p.y - 48, "宏键连打", "#8ec8ff");
    }
    if (keyboardContext.mechanic === "hit_count_wave_amp" && hitCount >= 2) {
      const waveX = p.x + Math.cos(baseAngle) * swingRange * 0.55;
      const waveY = p.y + Math.sin(baseAngle) * swingRange * 0.55;
      game.damageZones.push({
        x: waveX,
        y: waveY,
        r: 76 + hitCount * 8,
        life: 0.56,
        maxLife: 0.56,
        damage: continuousDamage(7 + level * 1.6),
        source: "keyboard_wave",
        tick: 0.14,
        chainTick: Infinity,
        textTick: 0,
        push: 34 + hitCount * 3,
        color: "#8ec8ff",
      });
      floatingText(waveX, waveY - 26, "热词波", "#8ec8ff");
    }

    // Hit-stop + screen shake
    if (hitCount > 0) {
      game.hitStop = heavyStrike ? 0.08 : 0.05;
      game.screenShake = heavyStrike ? 6 : 3;
      // Keycap particles
      for (let i = 0; i < hitCount * 3; i += 1) {
        const a = baseAngle + (Math.random() - 0.5) * swingArc;
        const d = Math.random() * swingRange;
        game.particles.push({
          x: p.x + Math.cos(a) * d,
          y: p.y + Math.sin(a) * d,
          vx: Math.cos(a) * (80 + Math.random() * 120),
          vy: Math.sin(a) * (80 + Math.random() * 120) - 30,
          r: 2 + Math.random() * 3,
          age: 0,
          life: 0.4 + Math.random() * 0.3,
          maxLife: 0.7,
          color: ["#ff6b6b", "#4ecdc4", "#ffe66d", "#a29bfe"][Math.floor(Math.random() * 4)],
        });
      }
    }

    // Keyboard visual model during swing
    game.keyboardSwingVisual = {
      x: p.x, y: p.y,
      angle: baseAngle,
      arc: swingArc,
      range: swingRange,
      life: 0.28,
      maxLife: 0.28,
      heavy: heavyStrike,
    };

    // Swing arc visual trail
    game.swingTrails.push({
      x: p.x, y: p.y,
      angle: baseAngle,
      arc: swingArc,
      range: swingRange,
      life: 0.28,
      maxLife: 0.28,
      heavy: heavyStrike,
    });

    // Barrage T1: keyboard swing hits → stapler fires instantly (gated by effectiveness)
    if (hitCount > 0 && barrageEff > 0 && game.weapons.stapler.level > 0) {
      p.staplerTimer = 0;
    }
    p.keyboardTimer = weaponCooldown(Math.max(0.58, 1.5 - level * 0.15 - (barrage ? 0.12 : 0) - (barrageTier >= 4 ? 0.1 * barrageEff : 0) - (isSurrounded && barrageEff > 0 ? 0.08 : 0)), "keyboard");
  }

  p.staplerTimer -= dt;
  if (game.weapons.stapler.level > 0 && p.staplerTimer <= 0 && target) {
    const level = game.weapons.stapler.level;
    const staplerContext = getWeaponFormContext("stapler", level);
    const staplerParams = staplerContext.params;
    const magazineBoost = staplerContext.mechanic === "magazine_burst_reload" && p.staplerReloadBoost > 0;
    const shots = p.staplerPellets + Math.floor(level / 2) + Math.floor(getEffectiveStat("dodge") / 18) + getClassBonus("projectileMult") + (barrage ? 2 : 0) + Math.floor(staplerParams.countBonus || staplerParams.pelletBonus || 0) + (magazineBoost ? 2 : 0);
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
        damage: hitDamage((13 + level * 4.6) * getWeaponStatScale("barrage") * (barrage ? 1.08 : 1) * (staplerParams.damage || 1)),
        color: "#d7d0c2",
        pierce: 1,
        source: "stapler",
      });
    }
    if (staplerContext.mechanic === "magazine_burst_reload") {
      p.staplerMagazineCount = (p.staplerMagazineCount || 0) + 1;
      if (magazineBoost) p.staplerReloadBoost = 0;
      if (p.staplerMagazineCount >= 3) {
        p.staplerMagazineCount = 0;
        p.staplerReloadBoost = 1;
        floatingText(p.x, p.y - 46, "换弹完成", "#d7d0c2");
      }
    }
    if (staplerContext.mechanic === "barrier_slow_line") {
      const bx = p.x + Math.cos(baseAngle) * 120;
      const by = p.y + Math.sin(baseAngle) * 120;
      game.damageZones.push({
        x: bx,
        y: by,
        r: 54,
        life: 1.8,
        maxLife: 1.8,
        damage: continuousDamage(5 + level * 0.9),
        source: "stapler_barrier",
        tick: 0.2,
        chainTick: Infinity,
        textTick: 0,
        slow: 0.38,
        color: "#d7d0c2",
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
    p.staplerTimer = weaponCooldown(Math.max(0.5, p.staplerCooldown - level * 0.04 - (barrage ? 0.08 : 0)) * (staplerParams.cooldown || 1) * (magazineBoost ? 0.72 : 1), "stapler");
  }

  p.stickyTimer -= dt;
  if (game.weapons.sticky.level > 0 && p.stickyTimer <= 0) {
    const level = game.weapons.sticky.level;
    const isMainSticky = getActiveWeaponId() === "sticky_note";
    const stickyForm = isMainSticky ? getActiveWeaponForm("sticky_note") : null;
    const stickyParams = isMainSticky ? getActiveFormParams("sticky_note", level) : { cooldown: 1, damage: 1, radiusBonus: 0, durationBonus: 0, countBonus: 0 };
    const stickyMechanic = stickyForm?.mechanicType || stickyForm?.formId || "";
    const trapCount = Math.min(5, (level >= 7 || hasWeaponEvolution("sticky") ? 2 : 1) + Math.floor(stickyParams.countBonus || 0) + (stickyMechanic === "trap_link_control_zone" ? 1 : 0));
    for (let i = 0; i < trapCount; i += 1) {
      const angle = i === 0 ? 0 : game.time * 2.1 + i * TAU / Math.max(1, trapCount);
      const offset = i === 0 ? 0 : (stickyMechanic === "trap_link_control_zone" ? 72 : 46);
      game.damageZones.push({
        x: p.x + Math.cos(angle) * offset,
        y: p.y + Math.sin(angle) * offset,
        r: (p.stickyRadius + level * 4 + Math.floor(getEffectiveStat("pickupRange") / 28) + getTrapRadiusBonus()) * (1 + Math.min(0.45, (stickyParams.radiusBonus || 0) * 0.18)),
        life: (p.stickyLife + getEngineeringUtility() * 0.08) * (1 + Math.min(0.55, stickyParams.durationBonus || 0)),
        maxLife: (p.stickyLife + getEngineeringUtility() * 0.08) * (1 + Math.min(0.55, stickyParams.durationBonus || 0)),
        damage: continuousDamage((7 + level * 2.8) * getWeaponStatScale("engineering") * (1 + getClassBonus("engineering")) * (stickyParams.damage || 1)),
        source: "sticky",
        tick: 0,
        chainTick: conductor ? (conductorTier >= 4 ? 0.08 : 0.14) : Infinity,
        textTick: 0,
        explodeOnEnd: level >= 5 || stickyMechanic === "manual_trap_detonate",
        color: stickyMechanic === "trap_link_control_zone" ? "#65f1ff" : stickyMechanic === "seeking_trap_summon" ? "#52ffe1" : stickyMechanic === "route_buff_trap" ? "#6affd7" : conductorTier >= 4 ? "#52ffe1" : "#fff07a",
        stickyMechanic,
        seekSpeed: stickyMechanic === "seeking_trap_summon" ? 34 + level * 4 : 0,
        manualTrigger: stickyMechanic === "manual_trap_detonate",
        routeHeal: stickyMechanic === "route_buff_trap" ? 0.45 + (stickyParams.shieldBonus || 0) * 0.2 : 0,
        spreadTraps: stickyMechanic === "sticky_debuff_spread" ? Math.min(4, stickyParams.spreadTraps || 2) : 0,
        linkControl: stickyMechanic === "trap_link_control_zone",
      });
    }
    p.stickyTimer = weaponCooldown(Math.max(0.62, (p.stickyCooldown - level * 0.05) * (stickyParams.cooldown || 1)), "sticky");
  }

  p.markerTimer -= dt;
  if (game.weapons.marker.level > 0 && p.markerTimer <= 0 && target) {
    const level = game.weapons.marker.level;
    const form = getActiveWeaponForm("marker");
    const params = getActiveFormParams("marker", level);
    const angle = Math.atan2(target.y - p.y, target.x - p.x);
    p.markerShotCount += 1;
    const grandBeam = level >= 5 && (p.markerShotCount % 4 === 0 || hasWeaponEvolution("marker"));
    const baseLength = 720 + rangeBonus(1.25) + (grandBeam ? 180 : 0);
    const beamWidth = Math.max(4, (p.markerWidth + level * 0.68 + Math.floor(getEffectiveStat("crit") / 22) + (precision ? 2 : 0) + (grandBeam ? 7 : 0)) * (params.width || 1));
    const beamDamage = hitDamage((22 + level * 7.2) * getWeaponStatScale("precise") * (precision ? 1.1 : 1) * (grandBeam ? 1.32 : 1) * (params.damage || 1));
    const palette = getMarkerBeamPalette(form?.visualStyle || "base");
    fireBeam(angle, baseLength, beamWidth, beamDamage, palette.color, "marker", {
      form,
      params,
      style: form?.visualStyle || "base",
      intensity: grandBeam ? 1.28 : 0.95,
      vfxLife: grandBeam ? 0.24 : 0.18,
    });
    if (level >= 7) {
      fireBeam(angle + 0.5, 560 + rangeBonus(0.8), Math.max(5, beamWidth * 0.45), hitDamage((10 + level * 3.1) * (params.damage || 1)), palette.color, "marker", { form, params, style: form?.visualStyle || "base", skipForm: true, vfxLife: 0.16 });
      fireBeam(angle - 0.5, 560 + rangeBonus(0.8), Math.max(5, beamWidth * 0.45), hitDamage((10 + level * 3.1) * (params.damage || 1)), palette.color, "marker", { form, params, style: form?.visualStyle || "base", skipForm: true, vfxLife: 0.16 });
    }
    p.markerTimer = weaponCooldown(Math.max(0.7, (p.markerCooldown - level * 0.08 - (precision ? 0.12 : 0)) * (params.cooldown || 1)), "marker");
  }

  p.calculatorTimer -= dt;
  if (game.weapons.calculator.level > 0 && p.calculatorTimer <= 0 && target) {
    const level = game.weapons.calculator.level;
    const calculatorContext = getWeaponFormContext("calculator", level);
    const calculatorParams = calculatorContext.params;
    const jumps = p.chainJumps + Math.floor(level / 2) + Math.floor(getEffectiveStat("luck") / 42) + getClassBonus("chain") + (conductor ? 1 : 0) + (conductorTier >= 4 ? 2 : 0) + (hasWeaponEvolution("calculator") ? 2 : 0) + Math.floor(calculatorParams.countBonus || 0) + Math.floor(calculatorParams.chainBonus || 0);
    const chainDamage = hitDamage((17 + level * 5.6) * getWeaponStatScale("engineering") * (1 + getClassBonus("engineering")) * (conductor ? 1.1 : 1) * (conductorTier >= 4 ? 1.12 : 1) * (calculatorParams.damage || 1));
    if (calculatorContext.mechanic === "prediction_path_chain") {
      game.particles.push({ kind: "line", x: p.x, y: p.y, x2: target.x, y2: target.y, vx: 0, vy: 0, r: 1, age: 0, life: 0.22, maxLife: 0.22, color: "#52ffe1" });
      floatingText((p.x + target.x) / 2, (p.y + target.y) / 2 - 16, "预测路径", "#52ffe1");
    }
    chainLightning(target, jumps, p.chainRange + rangeBonus(0.8) + (conductor ? 36 : 0) + (conductorTier >= 4 ? 54 : 0) + (calculatorParams.rangeBonus || 0) + (calculatorContext.mechanic === "prediction_path_chain" ? 120 : 0), chainDamage, "calculator");
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
    p.calculatorTimer = weaponCooldown(Math.max(0.88, p.calculatorCooldown - level * 0.07) * (calculatorParams.cooldown || 1), "calculator");
  }

  const auraLevel = game.weapons.headset.level;
  if (auraLevel > 0) {
    const headsetContext = getWeaponFormContext("headphones", auraLevel);
    const auraRadius = getAuraRadius();
    let auraHits = 0;
    const auraDps = continuousDamage(p.auraDamage * getWeaponStatScale("field") * (perimeter ? 1 + 0.14 * perimeterEff : 1) * (perimeterTier >= 4 ? 1 + 0.12 * perimeterEff : 1) * (hasWeaponEvolution("headset") ? 1.18 : 1));
    for (const e of game.enemies) {
      const dist = Math.hypot(e.x - p.x, e.y - p.y);
      if (dist < auraRadius + e.r) {
        applyEnemyDamage(e, auraDps * dt, "headset", false);
        if (headsetContext.mechanic === "aura_rebroadcast" && !(e.headphoneRebroadcast > 0) && Math.random() < dt * 0.48) {
          e.headphoneRebroadcast = 0.55 + Math.random() * 0.28;
        }
        // Night watch synergy: armor-based true damage
        if (game.nightWatchActive && p.armor > 0) {
          applyEnemyDamage(e, p.armor * 0.05 * dt, "headset", false);
        }
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
          e.x += (dx / dist) * ((26 + pulsePower * 8 + (perimeter ? 10 * perimeterEff : 0) + (perimeterTier >= 4 ? 18 * perimeterEff : 0)));
          e.y += (dy / dist) * ((26 + pulsePower * 8 + (perimeter ? 10 * perimeterEff : 0) + (perimeterTier >= 4 ? 18 * perimeterEff : 0)));
          e.slow = Math.min(e.slow || 1, hasWeaponEvolution("headset") ? 0.36 : 0.58);
          applyEnemyDamage(e, continuousDamage((8 + pulsePower * 4) * getWeaponStatScale("field") * (perimeter ? 1 + 0.18 * perimeterEff : 1) * (perimeterTier >= 4 ? 1 + 0.18 * perimeterEff : 1)), "headset");
        }
      }
      pulse(p.x, p.y, auraRadius + 28, "#42d7b8");
      p.auraPulseTimer = weaponCooldown(Math.max(0.82, 2.6 - pulsePower * 0.22), "headset");
    }
  }

  const orbitLevel = game.weapons.report.level;
  if (orbitLevel > 0) {
    const reportContext = getWeaponFormContext("report", orbitLevel);
    const orbiters = getOrbiters();
    for (const orb of orbiters) {
      for (const e of game.enemies) {
        if (Math.hypot(e.x - orb.x, e.y - orb.y) < e.r + orb.r) {
          applyEnemyDamage(e, continuousDamage((17 + orbitLevel * 4.6) * getWeaponStatScale("field") * (perimeter ? 1 + 0.18 * perimeterEff : 1)) * dt, "report", false);
          if (reportContext.mechanic === "orbit_attack_defense_shared") {
            addFormShield(0.12 + orbitLevel * 0.012, 34, "护页");
          } else if (reportContext.mechanic === "orbit_consumable_regen" && Math.random() < dt * 0.5) {
            applyEnemyDamage(e, continuousDamage(6 + orbitLevel), "report", false);
            floatingText(e.x, e.y - e.r - 8, "刷新", "#ffd15c");
          }
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

  if (perimeterEff > 0 && perimeterTier >= 3 && getAnchorCharge() >= 1) {
    game.perimeterPulseCooldown = Math.max(0, (game.perimeterPulseCooldown || 0) - dt);
    if (game.perimeterPulseCooldown <= 0) {
      const isAnnualReport = perimeterTier >= 4;
      const baseRadius = isAnnualReport ? 320 : 122;
      const pulseRadius = baseRadius + Math.min(60, getEffectiveStat("fortify") * 2.5);
      const pulseForce = (isAnnualReport ? 120 : 58) * perimeterEff;
      const pulseSlow = isAnnualReport ? 0.28 : 0.5;
      for (const e of game.enemies) {
        const dx = e.x - p.x;
        const dy = e.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < pulseRadius + e.r) {
          e.x += (dx / dist) * pulseForce;
          e.y += (dy / dist) * pulseForce;
          e.slow = Math.min(e.slow || 1, pulseSlow);
          applyEnemyDamage(e, continuousDamage(((isAnnualReport ? 18 : 4) + getEffectiveStat("fortify") * (isAnnualReport ? 1.1 : 0.55)) * perimeterEff), "headset");
          if (isAnnualReport) e.hitFlash = 0.25;
        }
      }
      pulse(p.x, p.y, pulseRadius, "#ffd15c");
      floatingText(p.x, p.y - 42, isAnnualReport ? "年度汇报！" : "结界脉冲", "#ffd15c");
      game.perimeterPulseCooldown = isAnnualReport ? 12 : 8;
    }
  } else {
    game.perimeterPulseCooldown = Math.max(0, (game.perimeterPulseCooldown || 0) - dt);
  }
}

function updateShredder(dt) {
  const weapon = game.weapons.shredder;
  if (!weapon || weapon.level <= 0) return;
  const p = game.player;
  const level = weapon.level;
  const target = nearestEnemy();
  if (!target) return;
  const shredderContext = getWeaponFormContext("shredder", level);
  const shredderParams = shredderContext.params;
  const shredderMechanic = shredderContext.mechanic;

  const coneAngle = (p.shredderConeAngle * Math.PI) / 180;
  const coneRange = p.shredderRange;
  const coneDps = hitDamage((p.shredderDps + level * 3) * (shredderParams.damage || 1));
  const baseAngle = Math.atan2(target.y - p.y, target.x - p.x);

  let killCount = 0;
  for (const e of game.enemies) {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const dist = Math.hypot(dx, dy);
    if (dist > e.r + coneRange) continue;
    let angleDiff = Math.atan2(dy, dx) - baseAngle;
    while (angleDiff > Math.PI) angleDiff -= TAU;
    while (angleDiff < -Math.PI) angleDiff += TAU;
    if (Math.abs(angleDiff) > coneAngle / 2) continue;

    const before = e.hp;
    applyEnemyDamage(e, coneDps * dt, "shredder", false);
    e.slow = Math.min(e.slow || 1, level >= 5 ? 0.62 : 0.72);
    e.hitFlash = Math.max(e.hitFlash || 0, 0.04);

    // Paper confetti particles
    if (Math.random() < 0.35) {
      game.particles.push({
        x: e.x + (Math.random() - 0.5) * 16,
        y: e.y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 80,
        vy: (Math.random() - 0.5) * 80 - 20,
        r: 1 + Math.random() * 2,
        age: 0, life: 0.4 + Math.random() * 0.3, maxLife: 0.7,
        color: "#f4f0e8",
      });
    }
    if (before > 0 && e.hp <= 0) killCount += 1;
  }

  if (shredderMechanic === "kill_meter_vortex_summon") {
    p.shredderVortexMeter = (p.shredderVortexMeter || 0) + killCount * 4 + Math.min(0.08, dt) * 2.2;
    const threshold = Math.max(8, (shredderParams.vortexMeter || 18) - Math.min(5, shredderParams.mechanic || 0));
    if (p.shredderVortexMeter >= threshold) {
      p.shredderVortexMeter = 0;
      const sx = target.x;
      const sy = target.y;
      const life = (shredderParams.vortexLife || 3.8) + Math.min(1.4, (shredderParams.durationBonus || 0) * 0.25);
      game.damageZones.push({
        x: sx,
        y: sy,
        r: (shredderParams.vortexRadius || 96) + Math.min(32, (shredderParams.radiusBonus || 0) * 10),
        life,
        maxLife: life,
        damage: continuousDamage((11 + level * 2.2) * (shredderParams.damage || 1)),
        source: "shredder_vortex",
        tick: 0.12,
        chainTick: Infinity,
        textTick: 0,
        vortexPull: (shredderParams.pull || 72) + Math.min(45, (shredderParams.mechanic || 0) * 9),
        color: "#c5d4ff",
      });
      floatingText(sx, sy - 48, "纸屑龙卷", "#c5d4ff");
      pulse(sx, sy, 120, "#c5d4ff");
    }
  } else if (shredderMechanic === "bouncing_slash_line") {
    p.shredderSlashTimer = Math.max(0, (p.shredderSlashTimer || 0) - dt);
    if (p.shredderSlashTimer <= 0 && game.enemies.length >= 2) {
      const a = target;
      const b = findNearestEnemyFrom(a.x, a.y, 360, a.id);
      if (b) {
        game.particles.push({ kind: "line", x: a.x, y: a.y, x2: b.x, y2: b.y, vx: 0, vy: 0, r: 1, age: 0, life: 0.18, maxLife: 0.18, color: "#c5d4ff" });
        applyEnemyDamage(a, hitDamage(10 + level * 2.4), "shredder");
        applyEnemyDamage(b, hitDamage(8 + level * 2.0), "shredder");
        floatingText((a.x + b.x) / 2, (a.y + b.y) / 2 - 16, "裁纸线", "#c5d4ff");
      }
      p.shredderSlashTimer = 1.3;
    }
  } else if (shredderMechanic === "single_target_channel_execute") {
    if (target) {
      target.shredderExecute = (target.shredderExecute || 0) + dt;
      if (target.shredderExecute >= 1.4) {
        target.shredderExecute = 0;
        game.delayedBlasts.push({ x: target.x, y: target.y, r: 70, delay: 0, damage: hitDamage(34 + level * 5.2), source: "shredder", color: "#c5d4ff", text: "粉碎执行" });
      }
    }
  } else if (shredderMechanic === "directional_guard_counter" && killCount > 0) {
    addFormShield(1.2 + killCount * 0.6, 38, "粉碎口");
  }

  // Kill burst at level 4+
  if (killCount > 0 && level >= 4) {
    p.shredderKills += killCount;
    const hasAuto = level >= 6;
    while (p.shredderKills >= (hasAuto ? 3 : 6)) {
      p.shredderKills -= (hasAuto ? 3 : 6);
      const ba = Math.random() * TAU;
      const bd = Math.random() * 30;
      game.damageZones.push({
        x: p.x + Math.cos(ba) * bd,
        y: p.y + Math.sin(ba) * bd,
        r: 28 + level * 4,
        life: 0.35,
        maxLife: 0.35,
        damage: coneDps * 0.6,
        source: "shredder",
        tick: 0.18,
        chainTick: Infinity,
        textTick: 0,
        residual: true,
        color: "#a9b8c6",
      });
      // Confetti burst
      for (let j = 0; j < 8; j += 1) {
        const ca = Math.random() * TAU;
        game.particles.push({
          x: p.x + Math.cos(ba) * bd,
          y: p.y + Math.sin(ba) * bd,
          vx: Math.cos(ca) * (60 + Math.random() * 80),
          vy: Math.sin(ca) * (60 + Math.random() * 80) - 30,
          r: 1.5 + Math.random() * 2.5,
          age: 0, life: 0.5 + Math.random() * 0.4, maxLife: 0.9,
          color: ["#f4f0e8", "#c5d4df", "#d0d8e0"][Math.floor(Math.random() * 3)],
        });
      }
    }
    if (killCount >= 4) floatingText(p.x, p.y - 30, "绞碎 " + killCount, "#a9b8c6");
  }

  // Cone spray particles
  if (Math.random() < 0.6) {
    const sa = baseAngle + (Math.random() - 0.5) * coneAngle;
    const sd = Math.random() * coneRange;
    game.particles.push({
      x: p.x + Math.cos(sa) * sd,
      y: p.y + Math.sin(sa) * sd,
      vx: Math.cos(sa) * (40 + Math.random() * 60),
      vy: Math.sin(sa) * (40 + Math.random() * 60) - 10,
      r: 1 + Math.random() * 1.5,
      age: 0, life: 0.4 + Math.random() * 0.3, maxLife: 0.7,
      color: "#f4f0e8",
    });
  }
}

function updateThermos(dt) {
  const weapon = game.weapons.thermos;
  if (!weapon || weapon.level <= 0) return;
  const p = game.player;
  const level = weapon.level;
  const isMainThermos = getActiveWeaponId() === "thermos";
  const form = isMainThermos ? getActiveWeaponForm("thermos") : null;
  const params = isMainThermos ? getActiveFormParams("thermos", level) : { cooldown: 1, damage: 1, radiusBonus: 0, durationBonus: 0, shieldBonus: 0 };
  const mechanic = form?.mechanicType || form?.formId || "";
  p.thermosVentLockout = Math.max(0, (p.thermosVentLockout || 0) - dt);
  if (p.thermosVentLockout > 0 && mechanic === "charge_release_beam") return;
  p.thermosTeaMax = getThermosTeaMax();
  p.thermosTea = Math.min(p.thermosTea, p.thermosTeaMax);
  const speed = Math.hypot(p.vx || 0, p.vy || 0);
  const chargeMult = 1 + p.thermosChargeBonus + (level >= 2 ? 0.4 : 0) + (level >= 5 ? 0.25 : 0) + Math.min(0.5, params.cooldown ? (1 - params.cooldown) : 0);
  if (speed < 30) {
    p.thermosTea = Math.min(p.thermosTeaMax, p.thermosTea + 28 * chargeMult * dt);
  } else if (speed < 120) {
    p.thermosTea = Math.min(p.thermosTeaMax, p.thermosTea + 12 * chargeMult * dt);
  } else {
    p.thermosTea = Math.max(0, p.thermosTea - 4 * dt);
  }

  p.thermosTextTimer = Math.max(0, p.thermosTextTimer - dt);
  p.thermosPuddleTimer = Math.max(0, p.thermosPuddleTimer - dt);
  if (p.thermosTea < 50) return;

  const hot = p.thermosTea >= 75;
  const radius = getThermosRadius() * (1 + Math.min(0.45, (params.radiusBonus || 0) * 0.16));
  const healRate = (level >= 3 && hot ? 4 : 2) * (params.healMult || 1);
  p.hp = Math.min(p.maxHp, p.hp + healRate * dt);
  const thermosTarget = nearestEnemy();
  if (mechanic === "charge_release_beam" && p.thermosTea >= p.thermosTeaMax && thermosTarget) {
    const angle = Math.atan2(thermosTarget.y - p.y, thermosTarget.x - p.x);
    const beamWidth = (params.steamColumnWidth || 22) + level * 1.4 + (params.radiusBonus || 0) * 8;
    const beamRange = (params.steamColumnRange || 390) + rangeBonus(0.55);
    fireBeam(angle, beamRange, beamWidth, hitDamage((26 + level * 8.5) * (params.damage || 1)), "#78e8c0", "thermos");
    const endX = p.x + Math.cos(angle) * beamRange;
    const endY = p.y + Math.sin(angle) * beamRange;
    game.damageZones.push({
      x: endX,
      y: endY,
      r: 58 + (params.radiusBonus || 0) * 18,
      life: 1 + (params.durationBonus || 0) * 0.35,
      maxLife: 1 + (params.durationBonus || 0) * 0.35,
      damage: continuousDamage(9 + level * 1.6),
      source: "thermos",
      tick: 0.16,
      chainTick: Infinity,
      textTick: 0,
      color: "#78e8c0",
    });
    pulse(endX, endY, 78, "#78e8c0");
    floatingText(p.x, p.y - 56, "沸点释放", "#78e8c0");
    p.thermosTea = 0;
    p.thermosVentLockout = Math.max(0.65, params.ventLockout || 1.35);
    return;
  }
  if (mechanic === "patrol_summon_steam" && p.thermosTea >= p.thermosTeaMax * 0.78 && thermosTarget) {
    const angle = Math.atan2(thermosTarget.y - p.y, thermosTarget.x - p.x);
    for (let i = -1; i <= 1; i += 1) {
      fireBeam(angle + i * 0.28, 220 + rangeBonus(0.3), 9 + level, hitDamage((9 + level * 2.4) * (params.damage || 1)), "#78e8c0", "thermos");
    }
    floatingText(p.x, p.y - 52, "恒温喷汽", "#78e8c0");
    p.thermosTea = Math.max(30, p.thermosTea - 58);
  } else if (mechanic === "periodic_wave_spread" && p.thermosTea >= 72) {
    p.thermosTeaWaveTimer = Math.max(0, (p.thermosTeaWaveTimer || 0) - dt);
    if (p.thermosTeaWaveTimer <= 0) {
      game.damageZones.push({
        x: p.x,
        y: p.y,
        r: 92 + Math.min(38, (params.radiusBonus || 0) * 10),
        life: 0.62,
        maxLife: 0.62,
        damage: continuousDamage((9 + level * 1.8) * (params.damage || 1)),
        source: "thermos",
        tick: 0.12,
        chainTick: Infinity,
        textTick: 0,
        push: 22,
        slow: 0.64,
        color: "#78e8c0",
      });
      floatingText(p.x, p.y - 64, "茶香热波", "#78e8c0");
      p.thermosTeaWaveTimer = 2.4;
      p.thermosTea = Math.max(45, p.thermosTea - 18);
    }
  } else if (mechanic === "deployable_safe_station" && p.thermosTea >= p.thermosTeaMax * 0.9) {
    p.thermosStationTimer = Math.max(0, (p.thermosStationTimer || 0) - dt);
    if (p.thermosStationTimer <= 0) {
      const life = 4.6 + Math.min(1.8, (params.durationBonus || 0) * 0.32);
      game.damageZones.push({
        x: p.x,
        y: p.y,
        r: params.stationRadius || 90,
        life,
        maxLife: life,
        damage: continuousDamage((4 + level * 0.8) * (params.damage || 1)),
        source: "thermos",
        tick: 0.24,
        chainTick: Infinity,
        textTick: 0,
        slow: 0.48,
        color: "#78e8c0",
      });
      floatingText(p.x, p.y - 60, "茶水间据点", "#78e8c0");
      p.thermosTea = Math.max(35, p.thermosTea - 70);
      p.thermosStationTimer = 6.5;
    }
  } else if (mechanic === "shield_break_pulse" && p.thermosTea >= 62) {
    addFormShield((params.shieldBonus || 0.4) + level * 0.08, 46, "暖流盾");
  }
  let hitCount = 0;
  for (const e of game.enemies) {
    if (Math.hypot(e.x - p.x, e.y - p.y) < e.r + radius) {
      e.slow = Math.min(e.slow || 1, hot ? 0.68 : 0.82);
      e.hitFlash = Math.max(e.hitFlash || 0, 0.025);
      if (level >= 3 && hot) {
        applyEnemyDamage(e, continuousDamage(4 + level * 0.8) * dt, "thermos", false);
        hitCount += 1;
      }
    }
  }
  if (hitCount > 0 && p.thermosTextTimer <= 0) {
    floatingText(p.x, p.y - radius * 0.45, `热茶 ${Math.round(p.thermosTea)}`, "#78e8c0");
    p.thermosTextTimer = 0.8;
  }
  if (Math.random() < 0.46) {
    game.particles.push({
      x: p.x + (Math.random() - 0.5) * radius * 0.72,
      y: p.y + (Math.random() - 0.5) * radius * 0.45,
      vx: (Math.random() - 0.5) * 22,
      vy: -22 - Math.random() * 18,
      r: 2 + Math.random() * 2,
      age: 0,
      life: 0.7,
      maxLife: 0.7,
      color: "rgba(120, 232, 192, 0.46)",
    });
  }
  if (level >= 6 && p.thermosTea >= 160 && p.thermosPuddleTimer <= 0) {
    game.damageZones.push({
      x: p.x + (Math.random() - 0.5) * 44,
      y: p.y + (Math.random() - 0.5) * 44,
      r: 42 + getClassBonus("fieldRadius") * 0.25,
      life: 2 + (params.durationBonus || 0) * 0.4,
      maxLife: 2 + (params.durationBonus || 0) * 0.4,
      damage: continuousDamage((8 + level * 1.2) * (params.damage || 1)),
      source: "thermos",
      tick: 0.18,
      chainTick: Infinity,
      textTick: 0,
      color: "#78e8c0",
    });
    p.thermosTea = Math.max(0, p.thermosTea - 28);
    p.thermosPuddleTimer = 2.4;
  }
  if (level >= 7 && p.thermosTea >= p.thermosTeaMax) {
    p.hp = Math.min(p.maxHp, p.hp + p.thermosBurstHeal);
    for (const e of game.enemies) {
      e.slow = Math.min(e.slow || 1, 0.56);
      applyEnemyDamage(e, continuousDamage(18), "thermos", false);
    }
    pulse(p.x, p.y, Math.max(190, radius * 1.75), "#78e8c0");
    floatingText(p.x, p.y - 54, "茶爆", "#78e8c0");
    p.thermosTea = 0;
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
    const campPressure = game.stage >= 5 ? clamp(((p.anchorTime || 0) - 1.8) / 3, 0, 1) * (0.08 + game.stage * 0.008) : 0;
    if (campPressure > 0 && dist > 150) speed *= 1 + campPressure;
    let moveX = dx / dist;
    let moveY = dy / dist;

    // Bug surround: check if nearby friends should form swarm
    if (e.type === "bug" && dist < 250 && !e.swarmGroup && Math.random() < 0.0025) {
      const nearbyBugs = game.enemies.filter(function(o) {
        return o.type === "bug" && o.id !== e.id && !o.swarmGroup && Math.hypot(o.x - e.x, o.y - e.y) < 160;
      });
      if (nearbyBugs.length >= 2) {
        const allBugs = [e, ...nearbyBugs];
        const startAngle = Math.atan2(dy, dx) + Math.random();
        allBugs.forEach(function(b, i) {
          b.swarmGroup = e.id;
          b.swarmIndex = i;
          b.swarmAngle = startAngle;
        });
      }
    }

    if (e.swarmGroup !== undefined) {
      e.swarmAngle = (e.swarmAngle || 0) + 0.8 * dt;
      const offsetAngle = e.swarmAngle + (e.swarmIndex / 3) * TAU;
      const targetX = p.x + Math.cos(offsetAngle) * 58;
      const targetY = p.y + Math.sin(offsetAngle) * 58;
      const sx = targetX - e.x;
      const sy = targetY - e.y;
      const slen = Math.hypot(sx, sy) || 1;
      moveX = sx / slen;
      moveY = sy / slen;
      speed *= 1.04;
    }

    // Deadline charge warning indicator
    if (e.type === "deadline" && e.charging > 0.3 && e.charging - dt <= 0.3) {
      // Show charge line
      const lineLen = Math.min(280, dist) + 60;
      game.swingTrails.push({
        x: e.x, y: e.y,
        angle: Math.atan2(e.chargeY || 0, e.chargeX || 0),
        arc: 0.08,
        range: lineLen,
        life: 0.3,
        maxLife: 0.3,
        heavy: true,
        isCharge: true,
      });
      floatingText(e.x, e.y - 26, "!", "#ffb45c");
    }

    if (e.type === "emergency") {
      updateEmergencyMeeting(e, dt, p, dx, dy, dist);
      e.slow = 1;
      e.hitFlash = Math.max(0, (e.hitFlash || 0) - dt);
      if (Math.hypot(p.x - e.x, p.y - e.y) < p.r + e.r && p.invuln <= 0) {
        takeDamage(e.damage * (e.charging > 0 ? 1.05 : 0.72), enemyDamageLabel(e));
      }
      continue;
    }

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
        if (dist < radius && p.invuln <= 0) takeDamage(e.damage * (e.type === "boss" ? 0.42 : 0.28), enemyDamageLabel(e));
        // Manager buffs nearby enemies with speed boost
        if (e.type === "manager") {
          let buffed = 0;
          for (const other of game.enemies) {
            if (other.id !== e.id && Math.hypot(other.x - e.x, other.y - e.y) < radius + 40) {
              other.slow = Math.max(other.slow || 1, 1.35);
              other.hitFlash = Math.max(other.hitFlash || 0, 0.1);
              buffed += 1;
            }
          }
          if (buffed > 0) floatingText(e.x, e.y - 38, "加速 " + buffed, "#ffd15c");
        }
        pulse(e.x, e.y, radius, e.type === "boss" ? "#ff2a60" : "#ffd15c");
        e.specialTimer = e.type === "boss" ? 2.8 : 4.2;
      }
    }

    if (e.type === "meeting" && dist < 118) {
      p.slow = Math.min(p.slow, 0.74);
      if (dist < 86 && p.invuln <= 0) takeDamage(e.damage * 0.45, enemyDamageLabel(e));
      // Summon minions: when close to player, spawn smaller bugs
      e.spawnTimer = (e.spawnTimer || 2) - dt;
      if (e.spawnTimer <= 0 && game.enemies.length < game.stageConfig.maxConcurrent + 3) {
        e.spawnTimer = 4.5 - game.stage * 0.15;
        for (let j = 0; j < 2; j += 1) {
          const sa = Math.random() * TAU;
          const minion = createEnemyByType("bug", Math.max(1, game.stage - 1), game.stageConfig);
          minion.x = e.x + Math.cos(sa) * (e.r + 30);
          minion.y = e.y + Math.sin(sa) * (e.r + 30);
          minion.id = enemyId++;
          minion.r -= 3;
          minion.hp *= 0.55;
          minion.xp = Math.ceil(minion.xp * 0.4);
          minion.materialValue = 0;
          minion.color = "#b282ff";
          game.enemies.push(minion);
        }
        floatingText(e.x, e.y - 32, "+1", "#6ea8ff");
      }
    }

    e.x += moveX * speed * dt;
    e.y += moveY * speed * dt;
    e.slow = 1;
    e.hitFlash = Math.max(0, (e.hitFlash || 0) - dt);

    if (dist < p.r + e.r && p.invuln <= 0) {
      takeDamage(e.damage, enemyDamageLabel(e));
    }
  }

  for (let i = game.enemies.length - 1; i >= 0; i -= 1) {
    const e = game.enemies[i];
    if (e.hp <= 0) {
      // Precision T4: marker kills marked enemy → refract beam (dominant only)
      if (e.lastHitSource === "marker" && e.precisionMark > 0 && getRouteTier("precision") >= 4 && (game.routeEff?.precision || 0) > 0
          && game.weapons.marker.level > 0 && game.weapons.coffee.level >= 2) {
        let nearest = null; let best = Infinity;
        for (const t of game.enemies) {
          if (t === e) continue;
          const td = Math.hypot(t.x - e.x, t.y - e.y);
          if (td < best) { best = td; nearest = t; }
        }
        if (nearest && best < 500) {
          const ra = Math.atan2(nearest.y - e.y, nearest.x - e.x);
          const eff = game.routeEff.precision;
          fireBeam(ra, 500 + rangeBonus(0.6), game.weapons.marker.level + 4,
            hitDamage(((18 + game.weapons.marker.level * 5) * getWeaponStatScale("precise")) * eff),
            "#52ffe1", "marker");
          floatingText(e.x, e.y - 12, eff >= 1.25 ? "折射·强" : "折射", "#52ffe1");
        }
      }
      // Conductor T3: enemy dies on sticky trap → free chain (gated by effectiveness)
      if (getRouteTier("conductor") >= 3 && (game.routeEff?.conductor || 0) > 0 && game.weapons.calculator.level > 0) {
        for (const zone of game.damageZones) {
          if (zone.source === "sticky" && zone.life > 0 && Math.hypot(e.x - zone.x, e.y - zone.y) < zone.r + e.r) {
            chainLightning(e, 2 + Math.floor(game.weapons.calculator.level / 2),
              game.player.chainRange * 0.7 + rangeBonus(0.35),
              hitDamage(8 + game.weapons.calculator.level * 3.2), "calculator");
            break;
          }
        }
      }
      handleWeaponFormEnemyDeath(e);
      game.enemies.splice(i, 1);
      game.kills += 1;
      game.stageKills += 1;
      dropEnemyLoot(e);
      hitBurst(e.x, e.y, e.color, e.elite ? 18 : 8);
      // Office death particles
      for (let j = 0; j < (e.elite ? 8 : 4); j += 1) {
        game.particles.push({
          x: e.x,
          y: e.y,
          vx: (Math.random() - 0.5) * 160,
          vy: (Math.random() - 0.5) * 160 - 40,
          r: 2 + Math.random() * 2,
          age: 0,
          life: 0.4 + Math.random() * 0.4,
          maxLife: 0.8,
          color: ["#f4f0e8", "#c5d4df", "#f36f6f", "#ffd15c"][Math.floor(Math.random() * 4)],
        });
      }
    }
  }
}

function updateEmergencyMeeting(e, dt, p, dx, dy, dist) {
  e.specialTimer -= dt;
  if (!e.chargeDir || e.specialTimer <= 0) {
    const len = dist || 1;
    e.chargeDir = { x: dx / len, y: dy / len };
    e.charging = 1.35;
    e.specialTimer = 2.35 + Math.random() * 0.9;
    floatingText(e.x, e.y - e.r - 12, "紧急会议", "#ff5a7a");
  }
  if (e.charging > 0) {
    const speed = e.speed * 1.85 * (e.slow || 1);
    e.x += e.chargeDir.x * speed * dt;
    e.y += e.chargeDir.y * speed * dt;
    e.charging -= dt;
    if (e.x < 20 || e.x > WORLD.w - 20) {
      e.chargeDir.x *= -1;
      e.x = clamp(e.x, 20, WORLD.w - 20);
      pulse(e.x, e.y, 34, "#ff5a7a");
    }
    if (e.y < 20 || e.y > WORLD.h - 20) {
      e.chargeDir.y *= -1;
      e.y = clamp(e.y, 20, WORLD.h - 20);
      pulse(e.x, e.y, 34, "#ff5a7a");
    }
    if (Math.random() < 0.36) spark(e.x, e.y, "#ff5a7a");
  } else {
    e.x += (dx / (dist || 1)) * e.speed * 0.36 * dt;
    e.y += (dy / (dist || 1)) * e.speed * 0.36 * dt;
    if (e.specialTimer <= 0.46) {
      e.charging = 0.01;
    }
  }
}

function enemyDamageLabel(enemy) {
  const labels = {
    bug: "Bug 贴脸",
    change: "需求变更",
    meeting: "会议减速",
    deadline: "Deadline 冲刺",
    intern: "实习生绕行",
    alarm: "警报增援",
    audit: "审计压迫",
    manager: "经理光环",
    boss: "终局评审",
    emergency: "紧急会议",
  };
  if (enemy?.elite) return `精英${labels[enemy.type] || "压力源"}`;
  return labels[enemy?.type] || "压力源";
}

function takeDamage(rawDamage, source = "压力源") {
  const p = game.player;
  const ramp = game.stage <= 1 ? 0.72 : game.stage === 2 ? 0.84 : game.stage === 3 ? 0.92 : 1;
  const dodgeChance = clamp(p.dodge, 0, 60) / 100;
  // Barrage T3: surrounded bonus (scaled by effectiveness)
  const barrageEff = game.routeEff?.barrage || 0;
  const surroundCount = barrageEff > 0 && hasWeaponPair("keyboard", "stapler", 2) && getRouteTier("barrage") >= 3
    ? game.enemies.filter(en => Math.hypot(en.x - p.x, en.y - p.y) < 140).length : 0;
  const effectiveDodge = surroundCount >= 5 ? Math.min(0.65, dodgeChance + 0.15 * barrageEff) : dodgeChance;
  if (Math.random() < effectiveDodge) {
    p.invuln = 0.38 + p.invulnBonus;
    floatingText(p.x, p.y - 30, "闪避", "#8fffe7");
    pulse(p.x, p.y, 42, "#42d7b8");
    // Rubber stampede: dodge triggers damage to nearest enemy
    if (game.rubberStampedeActive && game.enemies.length > 0) {
      let nearest = null; let best = Infinity;
      for (const e of game.enemies) {
        const d = Math.hypot(e.x - p.x, e.y - p.y);
        if (d < best) { best = d; nearest = e; }
      }
      if (nearest && best < 250) {
        applyEnemyDamage(nearest, hitDamage(80), "synergy");
        floatingText(nearest.x, nearest.y - 10, "盖章!", "#ff8c42");
      }
    }
    return;
  }

  if ((p.keyboardGuardWindow || 0) > 0) {
    const { mechanic } = getWeaponFormContext("keyboard", game.weapons.keyboard?.level || 1);
    if (mechanic === "shield_counter") {
      p.keyboardGuardWindow = 0;
      triggerKeyboardGuardCounter("perfect");
      p.invuln = Math.max(p.invuln || 0, 0.28);
      return;
    }
  }

  const reduction = 100 / (100 + Math.max(0, p.armor + getClassBonus("armor")) * 5.5);
  const anchorReduction = 1 - getAnchorDamageReduction();
  const damage = Math.max(1, Math.round(rawDamage * ramp * reduction));
  let finalDamage = Math.max(1, Math.round(damage * anchorReduction));
  if ((p.formShield || 0) > 0) {
    const absorbed = Math.min(finalDamage, p.formShield);
    p.formShield -= absorbed;
    finalDamage -= absorbed;
    floatingText(p.x, p.y - 48, `形态盾 -${Math.round(absorbed)}`, "#8ec8ff");
    pulse(p.x, p.y, 54, "#8ec8ff");
    if (finalDamage <= 0) {
      p.invuln = Math.max(p.invuln || 0, 0.18);
      return;
    }
  }
  if ((p.markerEmergencyShield || 0) > 0) {
    const absorbed = Math.min(finalDamage, p.markerEmergencyShield);
    p.markerEmergencyShield -= absorbed;
    finalDamage -= absorbed;
    floatingText(p.x, p.y - 44, `应急盾 -${Math.round(absorbed)}`, "#6affd7");
    addMarkerVfxEvent("shield", { x: p.x, y: p.y, radius: 48 + Math.min(34, p.markerEmergencyShield || 0), style: "shield", life: 0.32 });
    if (p.markerEmergencyShield <= 0) {
      p._markerShieldReadyCue = false;
      const form = getActiveWeaponForm("marker");
      const params = getActiveFormParams("marker", game.weapons.marker?.level || 1);
      if ((form?.mechanicType || form?.formId) === "shield_counter_line") releaseMarkerShieldCounter(params, game.weapons.marker?.level || 1, "break");
    }
    if (finalDamage <= 0) {
      p.invuln = Math.max(p.invuln || 0, 0.22);
      return;
    }
  }
  p.hp -= finalDamage;
  game.hitsTaken += 1;
  game.damageTaken += finalDamage;
  game.lastDamageSource = source;
  game.damageBySource[source] = (game.damageBySource[source] || 0) + finalDamage;
  game.damageFlash = Math.min(1, game.damageFlash + 0.42);
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
  if (enemy.type === "emergency" && (source === "marker" || source === "sticky")) multiplier *= 1.22;
  if (enemy.swarmGroup !== undefined && (source === "headset" || source === "report" || source === "shredder" || source === "sticky")) multiplier *= 1.16;
  multiplier *= getEnemyLateDamageResistance(enemy, source);
  if (game.policyRemoteDamagePenalty && Math.hypot(enemy.x - game.player.x, enemy.y - game.player.y) > 200) multiplier *= 0.8;

  // Hidden reversal: post-update power surge
  if (game._updatePowerTimer > 0) multiplier *= 1.3;

  const shield = enemy.shield ? 1 - clamp(enemy.shield, 0, 0.45) : 1;
  const damage = amount * multiplier * shield;
  enemy.lastHitSource = source;
  enemy.hp -= damage;
  handleFormDamageApplied(enemy, damage, source);
  if (multiplier > 1.05 && showWeakText) {
    enemy.weakTextTimer = (enemy.weakTextTimer || 0) - 0.2;
    if (enemy.weakTextTimer <= 0) {
      floatingText(enemy.x, enemy.y - enemy.r - 10, "弱点", "#ffd15c");
      enemy.weakTextTimer = 0.7;
    }
  }
}

function getEnemyLateDamageResistance(enemy, source) {
  if (!game || !enemy) return 1;
  // Continuous DR scaling: enemies get progressively tougher
  const s = Math.max(0, game.stage - 2);
  const base = 1 / (1 + s * 0.07 + Math.max(0, game.stage - 7) * 0.05 + Math.max(0, game.stage - 11) * 0.05);
  const eliteMult = enemy.elite ? 0.88 : 1;
  return base * eliteMult;
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

function updateDamageZones(dt) {
  for (const zone of game.damageZones) {
    if (zone.seekSpeed > 0 && game.enemies.length) {
      let target = null;
      let best = Infinity;
      for (const e of game.enemies) {
        const d = Math.hypot(e.x - zone.x, e.y - zone.y);
        if (d < best) { best = d; target = e; }
      }
      if (target) {
        const dx = target.x - zone.x;
        const dy = target.y - zone.y;
        const d = Math.hypot(dx, dy) || 1;
        zone.x += (dx / d) * zone.seekSpeed * dt;
        zone.y += (dy / d) * zone.seekSpeed * dt;
      }
    }
    if (zone.manualTrigger && Math.hypot(game.player.x - zone.x, game.player.y - zone.y) < zone.r * 0.8) {
      zone.life = Math.min(zone.life, 0.02);
      zone.explodeOnEnd = true;
    }
    if (zone.routeHeal && Math.hypot(game.player.x - zone.x, game.player.y - zone.y) < zone.r) {
      game.player.hp = Math.min(game.player.maxHp, game.player.hp + zone.routeHeal * dt);
    }
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
          const zoneSlow = zone.slow || (zone.source === "marker_grid" ? 0.46 : zone.source === "marker_wave" ? 0.7 : 0.78);
          e.slow = Math.min(e.slow || 1, zoneSlow);
          if (zone.push && dist > 1) {
            e.x += ((e.x - zone.x) / dist) * zone.push * 0.05;
            e.y += ((e.y - zone.y) / dist) * zone.push * 0.05;
          }
          if (zone.vortexPull && dist > 1 && e.type !== "boss") {
            e.x -= ((e.x - zone.x) / dist) * zone.vortexPull * 0.055;
            e.y -= ((e.y - zone.y) / dist) * zone.vortexPull * 0.055;
          }
          e.hitFlash = 0.06;
          hitCount += 1;
          if (!chainSeed) chainSeed = e;
        }
      }
      if (hitCount > 0 && zone.textTick <= 0) {
        const zoneLabel = zone.source === "marker_wave" ? "波纹" : zone.source === "marker_grid" ? "网格" : zone.source === "shredder_vortex" ? "龙卷" : zone.source === "headset" && zone.rebroadcast ? "接力" : "陷阱";
        floatingText(zone.x, zone.y - Math.min(72, zone.r * 0.55), `${zoneLabel} ${Math.round(zone.damage)}`, zone.color || "#fff07a");
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
    if (zone.life <= 0 && zone.source === "sticky" && getRouteTier("conductor") >= 3 && !zone.residual) {
      game.damageZones.push({
        x: zone.x,
        y: zone.y,
        r: zone.r * 0.62,
        life: 1.8,
        maxLife: 1.8,
        damage: zone.damage * 0.2,
        source: "sticky",
        tick: 0.38,
        chainTick: Infinity,
        textTick: 0,
        residual: true,
        color: "#52ffe1",
      });
      floatingText(zone.x, zone.y - 10, "残留", "#52ffe1");
    }
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
    if (zone.life <= 0 && zone.spreadTraps > 0 && !zone._spreadDone) {
      zone._spreadDone = true;
      for (let i = 0; i < zone.spreadTraps; i += 1) {
        const a = Math.random() * TAU;
        const d = 52 + Math.random() * 72;
        game.damageZones.push({
          x: zone.x + Math.cos(a) * d,
          y: zone.y + Math.sin(a) * d,
          r: zone.r * 0.58,
          life: 1.5,
          maxLife: 1.5,
          damage: zone.damage * 0.32,
          source: "sticky",
          tick: 0.22,
          chainTick: Infinity,
          textTick: 0,
          residual: true,
          color: "#8ec8ff",
          stickyMechanic: "sticky_debuff_spread",
        });
      }
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
        const barrageBonus = (pr.source === "stapler" && e.kbTag > 0 && getRouteTier("barrage") >= 4) ? 1 + 0.35 * (game.routeEff?.barrage || 0) : 1;
        applyEnemyDamage(e, pr.damage * barrageBonus, pr.source || "projectile");
        handleProjectileFormHit(pr, e);
        e.hitFlash = 0.08;
        if (pr.source === "keyboard" && getRouteTier("barrage") >= 3 && Math.random() < 0.16) {
          const fragAngle = Math.atan2(pr.vy, pr.vx);
          for (let f = -1; f <= 1; f += 2) {
            spawnProjectile({
              x: pr.x,
              y: pr.y,
              vx: Math.cos(fragAngle + f * 0.46) * 285,
              vy: Math.sin(fragAngle + f * 0.46) * 285,
              r: 2.5,
              life: 0.36,
              damage: pr.damage * 0.42,
              color: "#c35cff",
              pierce: 1,
              source: "keyboardShard",
            });
          }
        }
        pr.pierce -= 1;
        spark(pr.x, pr.y, pr.color);
      }
    }
  }
  game.projectiles = game.projectiles.filter((pr) => pr.life > 0 && pr.pierce > 0);
}

function updatePickups(dt) {
  const p = game.player;
  // WFH: auto-collect all pickups when standing still
  if (game.wfhActive && (Math.abs(p.vx || 0) + Math.abs(p.vy || 0)) < 5) {
    for (const pickup of game.pickups) {
      collectPickup(pickup);
      pickup.collected = true;
    }
  }
  for (const pickup of game.pickups) {
    const dx = p.x - pickup.x;
    const dy = p.y - pickup.y;
    const dist = Math.hypot(dx, dy) || 1;
    const pickupRange = p.pickupRange + getClassBonus("pickupRange");
    if (dist < pickupRange) {
      const pull = 360 * (game.policyMagnetMult || 1) * dt * (1 - dist / (pickupRange + 20));
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
    // Fengshui heal: wireless fengshui synergy
    if (game.fengShuiHeal && Math.random() < 0.2) {
      game.player.hp = Math.min(game.player.maxHp, game.player.hp + 2);
    }
    return;
  }

  if (pickup.kind === "stat") {
    pickup.stat.apply(game);
    floatingText(game.player.x, game.player.y - 34, `${pickup.stat.label}+${pickup.stat.amount}`, "#f4c95d");
    return;
  }

  if (pickup.kind === "item") {
    addPassiveItem(pickup.item, "drop");
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
  if (game.markerVfxEvents?.length) {
    for (const event of game.markerVfxEvents) {
      event.life -= dt;
      event.age = (event.age || 0) + dt;
    }
    game.markerVfxEvents = game.markerVfxEvents.filter((event) => event.life > 0);
  }
  if (game.keyboardGuardVisual) {
    game.keyboardGuardVisual.life -= dt;
    if (game.keyboardGuardVisual.life <= 0) game.keyboardGuardVisual = null;
  }
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

  if (!game.badgeChosen && !CS.buildState?.badgeDept) {
    openBadgeSelectionDuringRun();
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
  ui.stageBanner?.classList.add("hidden");
  game.upgradeReturnState = returnState;
  game.upgradeRerolls = 1;
  game.currentUpgradeChoices = pickUpgrades(Math.min(4, game.upgradeSlotPenalty ? 3 : (4 + (game.upgradeChoiceBonus || 0))));
  game.upgradeSlotPenalty = false;
  game.upgradeChoiceBonus = 0;
  renderUpgradeChoices();
  ui.upgradePanel.classList.remove("hidden");
  ui.upgradeRerollButton?.classList.toggle("hidden", false);
}

function renderUpgradeChoices() {
  ui.upgradeChoices.replaceChildren();
  const dominantId = getDominantRouteId();
  for (const choice of game.currentUpgradeChoices) {
    const routeHint = getUpgradeRouteHint(choice);
    const isSubsidy = choice.subsidy === true;
    const button = document.createElement("button");
    button.className = `choice ${isSubsidy ? 'subsidy-choice' : ''}`;
    button.innerHTML = `
      <div class="card-head">
        <span class="offer-icon ${getEntryIconClass(choice)}"></span>
        ${isSubsidy ? '<span class="subsidy-badge">急招补贴</span>' : ''}
        <span class="tag">${choice.tag}</span>
        ${routeHint ? `<span class="tag route-tag">${routeHint}</span>` : ''}
      </div>
      <strong class="card-title">${choice.title}</strong>
      <span class="card-desc">${choice.text}</span>
      ${choice.risk ? `<span class="dark-affix">⚠ ${choice.risk}</span>` : ''}
    `;
    button.addEventListener("click", () => chooseUpgrade(choice));
    ui.upgradeChoices.append(button);
  }
  if (ui.upgradeRerollCount) ui.upgradeRerollCount.textContent = game.upgradeRerolls;
  if (ui.upgradeRerollButton) ui.upgradeRerollButton.disabled = game.upgradeRerolls <= 0;
}

function renderUpgradeChoices() {
  ui.upgradeChoices.replaceChildren();
  for (const choice of game.currentUpgradeChoices) {
    const routeHint = getUpgradeRouteHint(choice);
    const isSubsidy = choice.subsidy === true;
    const button = document.createElement("button");
    button.className = `choice ${isSubsidy ? "subsidy-choice" : ""}`;
    button.innerHTML = `
      <div class="card-head">
        <span class="offer-icon ${getEntryIconClass(choice)}"></span>
        ${isSubsidy ? '<span class="subsidy-badge">急招补贴</span>' : ""}
        <span class="tag">${escHtml(choice.tag || "属性")}</span>
        ${routeHint ? `<span class="tag route-tag">${escHtml(routeHint)}</span>` : ""}
      </div>
      <strong class="card-title">${escHtml(choice.title || "属性提升")}</strong>
      <span class="card-desc">${escHtml(choice.text || "提升当前生存或输出能力。")}</span>
      ${choice.risk ? `<span class="dark-affix">⚠ ${escHtml(choice.risk)}</span>` : ""}
    `;
    button.addEventListener("click", () => chooseUpgrade(choice));
    ui.upgradeChoices.append(button);
  }
  if (ui.upgradeRerollCount) ui.upgradeRerollCount.textContent = game.upgradeRerolls;
  if (ui.upgradeRerollButton) ui.upgradeRerollButton.disabled = game.upgradeRerolls <= 0;
}

function chooseUpgrade(choice) {
  choice.apply(game);
  if (choice.subsidy) game.subsidyUsed = true;
  game.upgradesTaken += 1;
  checkWeaponEvolutions();
  checkRouteTierUps();
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
  if (game.stage === 1 && game.upgradesTaken === 0) {
    const starterSurvival = ["padding", "regen", "dodge", "sprint"]
      .map((id) => available.find((upgrade) => upgrade.id === id))
      .filter(Boolean);
    shuffle(starterSurvival);
    if (starterSurvival[0]) choices.push(starterSurvival[0]);
  }
  const aligned = available.filter(isUpgradeAlignedWithBuild);
  if (aligned.length) {
    shuffle(aligned);
    if (!choices.includes(aligned[0])) choices.push(aligned[0]);
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
  // Low-HP subsidy: may inject a boosted option
  const subsidy = getSubsidyOption();
  if (subsidy && choices.length >= count) {
    // Replace the least aligned choice
    let worstIdx = 0;
    let worstScore = Infinity;
    for (let i = 0; i < choices.length; i += 1) {
      const score = isUpgradeAlignedWithBuild(choices[i]) ? 10 : 0;
      if (score < worstScore) { worstScore = score; worstIdx = i; }
    }
    choices[worstIdx] = subsidy;
  }
  return choices;
}

function isUpgradeAlignedWithBuild(upgrade) {
  const counts = getWeaponClassCounts();
  const tag = upgrade.tag || "";
  if ((counts.precise || counts.ranged) && /暴击|射程|输出|爆发|武器专属/.test(tag)) return true;
  if ((counts.barrage || counts.close) && /攻速|闪避|爆发|武器专属/.test(tag)) return true;
  if ((counts.engineering || counts.support) && /幸运|拾取|经济|工程|布线|翻译|支援|武器专属/.test(tag)) return true;
  if ((counts.field || counts.close) && /防御|恢复|站场|领域|生存|近距|武器专属/.test(tag)) return true;
  return false;
}

function isUpgradeAlignedWithBuild(upgrade) {
  const haystack = `${upgrade.title || ""} ${upgrade.tag || ""} ${upgrade.text || ""}`;
  const form = getActiveWeaponForm(getActiveWeaponId());
  const mechanic = form?.mechanicType || form?.formId || "";
  if (/马克笔|激光|光束|分裂|爆炸|网格|波纹|射程|暴击|攻速|伤害|输出|频率/.test(haystack)) return true;
  if (/咖啡|续杯|追踪|弹幕|命中|跳点|连锁|报表|订书机|碎纸机|保温杯|即时贴|计算器|耳机/.test(haystack)) return true;
  if (/护甲|回血|恢复|护盾|减伤|闪避|站场|生存|防御|领域/.test(haystack)) {
    return game.stage >= 2 || /shield|aura|field|guard|heat|trap|zone|orbit/.test(mechanic);
  }
  if (/材料|经验|拾取|幸运|掉落|刷新|资源/.test(haystack)) {
    return game.stage <= 5 || /trap|ledger|spread|resource|zone/.test(mechanic);
  }
  return false;
}

function openWeaponArmory() {
  ui.stageBanner?.classList.add("hidden");
  state = "armory";
  if (game.shopOffers.length === 0) {
    game.shopOffers = generateShopOffers(getShopOfferCount(), game.lockedShopOffers);
    game.lockedShopOffers = [];
  }
  renderShop();
  ui.armoryReason.textContent =
    `${game.lastClearReason === "clear" ? "清场过关" : "撑过时间"} · 击破 ${game.stageKills}/${game.stageConfig.totalEnemies} · 奖励 ${game.lastStageBonus}`;
  ui.weaponPanel.classList.remove("hidden");
  updateHud();
}

function openWeaponArmory() {
  ui.stageBanner?.classList.add("hidden");
  state = "armory";
  if (game.shopOffers.length === 0) {
    game.shopOffers = generateShopOffers(getShopOfferCount(), game.lockedShopOffers);
    game.lockedShopOffers = [];
  }
  renderShop();
  if (ui.armoryReason) {
    ui.armoryReason.textContent = `${game.lastClearReason === "clear" ? "清场过关" : "撑到结束"} · 击破 ${game.stageKills}/${game.stageConfig.totalEnemies} · 奖励 ${game.lastStageBonus}`;
  }
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
    card.className = `choice shop-card ${offer.entry.shopType === "item" ? getRarityClass(offer.entry) : ""} ${offer.purchased ? "disabled-choice" : ""} ${offer.locked ? "locked-card" : ""}`;
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
    title.className = "card-title";
    title.textContent = offer.entry.title;

    const text = document.createElement("span");
    text.className = "card-desc";
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

function renderShop() {
  ui.armoryMaterial.textContent = game.materials;
  ui.refreshCost.textContent = getRefreshCost();
  ui.weaponChoices.replaceChildren();
  renderArmoryBuildStrip();
  renderOfferPreview(null);
  for (let i = 0; i < game.shopOffers.length; i += 1) {
    const offer = game.shopOffers[i];
    const card = document.createElement("div");
    card.className = `choice shop-card ${offer.entry.shopType === "item" ? getRarityClass(offer.entry) : ""} ${offer.purchased ? "disabled-choice" : ""} ${offer.locked ? "locked-card" : ""}`;
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
    title.className = "card-title";
    title.textContent = offer.entry.title;

    const text = document.createElement("span");
    text.className = "card-desc";
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
  const activeId = getActiveWeaponId();
  const activeWeapon = game.weapons[activeId] || game.weapons[legacyWeaponId(activeId)];
  const activeForm = getActiveWeaponForm(activeId);
  const formParams = getActiveFormParams(activeId, activeWeapon?.level || 1);
  const activeMetrics = calcGenericFormPreviewMetrics(formParams, activeForm).slice(0, 3);
  const chips = buildOrder.filter((id) => game.weapons[id].level > 0).map((id) => {
    const weapon = game.weapons[id];
    const form = id === activeId ? activeForm : getWeaponBadgeForm(id, CS.buildState?.badgeDept);
    return `
      <div class="armory-weapon-chip owned ${id === activeId ? "primary" : ""}" title="${weapon.label} Lv.${weapon.level}/${weapon.max}">
        <span class="offer-icon small ${getWeaponIconClass(id)}"></span>
        <span><strong>${weapon.label}</strong><em>${id === activeId ? "主武器" : "副武器"} · Lv.${weapon.level}/${weapon.max}</em></span>
        <small>${escHtml(form?.displayName || weapon.archetype || "")}</small>
      </div>
    `;
  }).join("");
  ui.armoryBuildStrip.innerHTML = `
    <div class="armory-primary-form">
      <span class="offer-icon ${getWeaponIconClass(activeId)}"></span>
      <div>
        <b>${escHtml(activeWeapon?.label || CS.weapons?.[activeId]?.name || "主武器")} · ${escHtml(activeForm?.displayName || "基础形态")}</b>
        <em>${escHtml(activeForm?.combatVerb || "优先强化当前主武器形态。")}</em>
      </div>
      <div class="armory-form-metrics">
        ${activeMetrics.map(row => `<span><i>${escHtml(row.label)}</i><strong>${escHtml(String(row.value))}</strong></span>`).join("")}
      </div>
    </div>
    <div class="armory-weapon-grid">${chips || `<span class="armory-empty">暂无武器</span>`}</div>
  `;
  if (ui.armoryRouteMap) ui.armoryRouteMap.innerHTML = "";
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
  const canonical = canonicalWeaponId(weaponId);
  const weapon = game.weapons[canonical] || game.weapons[weaponId];
  const form = getWeaponBadgeForm(canonical, CS.buildState?.badgeDept);
  const before = getActiveFormParams(canonical, Math.max(1, weapon.level || 1));
  const after = getActiveFormParams(canonical, Math.max(1, Math.min(weapon.max, (weapon.level || 0) + 1)));
  const metric = calcGenericFormPreviewMetrics(after, form)[0] || calcGenericFormPreviewMetrics(before, form)[0];
  ui.offerPreview.innerHTML = `
    <strong>${getEntryRouteHint(entry)} · ${weapon.label} Lv.${weapon.level}/${weapon.max} -> Lv.${Math.min(weapon.max, weapon.level + 1)}</strong>
    <span>${escHtml(form?.combatVerb || entry.text || "强化当前攻击方式")}</span>
    ${metric ? `<span>${escHtml(metric.label)}：${escHtml(String(metric.value))}</span>` : ""}
    <em>${getWeaponEffectSummary(canonical)}</em>
  `;
}

function getOfferComparisonText(entry) {
  const weaponId = getUpgradeWeaponId(entry.id);
  const routeHint = getEntryRouteHint(entry);
  if (!weaponId) return `${routeHint} · ${getItemBuildHint(entry)}`;
  const canonical = canonicalWeaponId(weaponId);
  const weapon = game.weapons[canonical] || game.weapons[weaponId];
  if (weapon.level <= 0) {
    if (getOwnedWeaponCount() >= game.weaponSlots) return `武器槽已满 · 可先拆解已有武器`;
    return `${routeHint} · 新武器槽 ${getOwnedWeaponCount() + 1}/${game.weaponSlots} · ${weapon.archetype}`;
  }
  return `${routeHint} · 当前 Lv.${weapon.level}/${weapon.max} · ${getWeaponEffectSummary(weaponId)}`;
}

function getEntryRouteHint(entry) {
  const weaponId = getUpgradeWeaponId(entry.id);
  if (weaponId) {
    const canonical = canonicalWeaponId(weaponId);
    const activeId = getActiveWeaponId();
    const weapon = game.weapons[canonical] || game.weapons[weaponId];
    const form = getWeaponBadgeForm(canonical, CS.buildState?.badgeDept);
    if (canonical === activeId) return `主武器升级 · ${form?.displayName || weapon.archetype}`;
    if (weapon?.level > 0) return `副武器补强 · ${form?.displayName || weapon.archetype}`;
    if (getOwnedWeaponCount() < game.weaponSlots) return `新增副武器 · ${form?.displayName || weapon?.archetype || "新打法"}`;
    return `武器槽已满 · 需要取舍`;
  }
  return (entry.tag || "道具").replace("道具 / ", "").replace("属性 / ", "");
}

function getUpgradeRouteHint(choice) {
  if (!game || !choice) return "";
  const form = getActiveWeaponForm(getActiveWeaponId());
  const haystack = `${choice.title || ""} ${choice.tag || ""} ${choice.text || ""}`;
  if (/伤害|输出|暴击|射程|攻速|频率|分裂|爆炸|光束|弹幕|蒸汽|陷阱|连线|跳点/.test(haystack)) {
    return `${form?.displayName || "主武器形态"}补强`;
  }
  if (/护甲|恢复|回血|护盾|减伤|闪避|站场|生存|格挡/.test(haystack)) return "补容错";
  if (/材料|经验|拾取|幸运|掉落|刷新|资源/.test(haystack)) return "补资源";
  return "通用成长";
}

function getWeaponEffectSummary(weaponId) {
  const canonical = canonicalWeaponId(weaponId);
  const weapon = game.weapons[canonical] || game.weapons[weaponId];
  const form = getWeaponBadgeForm(canonical, CS.buildState?.badgeDept);
  const level = weapon?.level || 0;
  if (!weapon || level <= 0) return `${form?.displayName || "新武器"}：买入后获得一套新的辅助攻击方式。`;
  const params = getActiveFormParams(canonical, level);
  const metric = calcGenericFormPreviewMetrics(params, form)[0];
  if (canonical === getActiveWeaponId()) {
    return `${form.displayName} · ${metric ? `${metric.label} ${metric.value}` : form.combatVerb}`;
  }
  return `${weapon.label} · ${form.displayName}，作为副武器补足当前打法。`;
}

function getLegacyWeaponEffectSummary(weaponId) {
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
    shredder: `近距旋转清场，工程/站场收益 ${Math.round(engineering * 100)}%`,
    thermos: `茶温蒸汽治疗，领域/站场收益 ${Math.round(field * 100)}%`,
  };
  return weapon.level <= 0 ? `${weapon.archetype}，买入后解锁该武器。` : data[weaponId];
}

function getItemBuildHint(entry) {
  const tag = entry.tag || "";
  const form = getActiveWeaponForm();
  if (/暴击|输出|射程|频率/.test(tag)) return `提高 ${form?.displayName || "主形态"} 的命中质量或触发频率。`;
  if (/攻速|闪避|爆发|机动/.test(tag)) return "让你更容易拉位置、等窗口、打爆发。";
  if (/经济|拾取|掉落|资源/.test(tag)) return "服务经验/材料副线，让后续主武器升级更快。";
  if (/防御|生存|控制|站场|回复/.test(tag)) return "补主形态的容错，避免成型前被贴脸压死。";
  return "通用补强；购买它会占用本次材料预算。";
}

function renderArmoryBuildStrip() {
  if (!ui.armoryBuildStrip) return;
  const activeId = getActiveWeaponId();
  const activeWeapon = game.weapons[activeId] || game.weapons[legacyWeaponId(activeId)];
  const activeForm = getActiveWeaponForm(activeId);
  const formParams = getActiveFormParams(activeId, activeWeapon?.level || 1);
  const activeMetrics = calcGenericFormPreviewMetrics(formParams, activeForm).slice(0, 3);
  const chips = buildOrder.filter((id) => game.weapons[id].level > 0).map((id) => {
    const weapon = game.weapons[id];
    const form = id === activeId ? activeForm : getWeaponBadgeForm(id, CS.buildState?.badgeDept);
    return `
      <div class="armory-weapon-chip owned ${id === activeId ? "primary" : ""}" title="${escHtml(weapon.label)} Lv.${weapon.level}/${weapon.max}">
        <span class="offer-icon small ${getWeaponIconClass(id)}"></span>
        <span><strong>${escHtml(weapon.label)}</strong><em>${id === activeId ? "主武器" : "副武器"} · Lv.${weapon.level}/${weapon.max}</em></span>
        <small>${escHtml(form?.displayName || weapon.archetype || "基础形态")}</small>
      </div>
    `;
  }).join("");
  ui.armoryBuildStrip.innerHTML = `
    <div class="armory-primary-form">
      <span class="offer-icon ${getWeaponIconClass(activeId)}"></span>
      <div>
        <b>${escHtml(activeWeapon?.label || CS.weapons?.[activeId]?.name || "主武器")} · ${escHtml(activeForm?.displayName || "基础形态")}</b>
        <em>${escHtml(activeForm?.combatVerb || "优先强化当前主武器形态。")}</em>
      </div>
      <div class="armory-form-metrics">
        ${activeMetrics.map(row => `<span><i>${escHtml(row.label)}</i><strong>${escHtml(String(row.value))}</strong></span>`).join("")}
      </div>
    </div>
    <div class="armory-weapon-grid">${chips || `<span class="armory-empty">暂无武器</span>`}</div>
  `;
  if (ui.armoryRouteMap) ui.armoryRouteMap.innerHTML = "";
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
      <strong>${escHtml(entry.title)} · ${escHtml(getEntryRouteHint(entry))}</strong>
      <span>${escHtml(entry.tag || "属性道具")} · ${escHtml(entry.text || "")}</span>
      <em>${escHtml(getItemBuildHint(entry))}</em>
    `;
    return;
  }
  const canonical = canonicalWeaponId(weaponId);
  const weapon = game.weapons[canonical] || game.weapons[weaponId];
  const form = getWeaponBadgeForm(canonical, CS.buildState?.badgeDept);
  const before = getActiveFormParams(canonical, Math.max(1, weapon.level || 1));
  const after = getActiveFormParams(canonical, Math.max(1, Math.min(weapon.max, (weapon.level || 0) + 1)));
  const metric = calcGenericFormPreviewMetrics(after, form)[0] || calcGenericFormPreviewMetrics(before, form)[0];
  ui.offerPreview.innerHTML = `
    <strong>${escHtml(getEntryRouteHint(entry))} · ${escHtml(weapon.label)} Lv.${weapon.level}/${weapon.max} → Lv.${Math.min(weapon.max, weapon.level + 1)}</strong>
    <span>${escHtml(form?.combatVerb || entry.text || "强化当前攻击方式")}</span>
    ${metric ? `<span>${escHtml(metric.label)}：${escHtml(String(metric.value))}</span>` : ""}
    <em>${escHtml(getWeaponEffectSummary(canonical))}</em>
  `;
}

function getOfferComparisonText(entry) {
  const weaponId = getUpgradeWeaponId(entry.id);
  const routeHint = getEntryRouteHint(entry);
  if (!weaponId) return `${routeHint} · ${getItemBuildHint(entry)}`;
  const canonical = canonicalWeaponId(weaponId);
  const weapon = game.weapons[canonical] || game.weapons[weaponId];
  if (weapon.level <= 0) {
    if (getOwnedWeaponCount() >= game.weaponSlots) return "武器槽已满 · 先强化已有武器";
    return `${routeHint} · 新副武器 ${getOwnedWeaponCount() + 1}/${game.weaponSlots} · ${weapon.archetype || "辅助打法"}`;
  }
  return `${routeHint} · 当前 Lv.${weapon.level}/${weapon.max} · ${getWeaponEffectSummary(weaponId)}`;
}

function getEntryRouteHint(entry) {
  const weaponId = getUpgradeWeaponId(entry.id);
  if (weaponId) {
    const canonical = canonicalWeaponId(weaponId);
    const activeId = getActiveWeaponId();
    const weapon = game.weapons[canonical] || game.weapons[weaponId];
    const form = getWeaponBadgeForm(canonical, CS.buildState?.badgeDept);
    if (canonical === activeId) return `主武器升级 · ${form?.displayName || weapon.archetype || "基础形态"}`;
    if (weapon?.level > 0) return `副武器补强 · ${form?.displayName || weapon.archetype || "基础形态"}`;
    if (getOwnedWeaponCount() < game.weaponSlots) return `新增副武器 · ${form?.displayName || weapon?.archetype || "新打法"}`;
    return "武器槽已满 · 改买属性或道具";
  }
  return (entry.tag || "道具").replace("道具 / ", "").replace("属性 / ", "");
}

function getUpgradeRouteHint(choice) {
  if (!game || !choice) return "";
  const form = getActiveWeaponForm(getActiveWeaponId());
  const haystack = `${choice.title || ""} ${choice.tag || ""} ${choice.text || ""}`;
  if (/伤害|输出|暴击|射程|攻速|频率|分裂|爆炸|光束|弹幕|蒸汽|陷阱|连线|跳点/.test(haystack)) {
    return `${form?.displayName || "主武器形态"}补强`;
  }
  if (/护甲|恢复|回血|护盾|减伤|闪避|站场|生存|格挡/.test(haystack)) return "补容错";
  if (/材料|经验|拾取|幸运|掉落|刷新|资源/.test(haystack)) return "补资源";
  return "通用成长";
}

function getWeaponEffectSummary(weaponId) {
  const canonical = canonicalWeaponId(weaponId);
  const weapon = game.weapons[canonical] || game.weapons[weaponId];
  const form = getWeaponBadgeForm(canonical, CS.buildState?.badgeDept);
  const level = weapon?.level || 0;
  if (!weapon || level <= 0) return `${form?.displayName || "新武器"}：买入后获得一套辅助攻击方式。`;
  const params = getActiveFormParams(canonical, level);
  const metric = calcGenericFormPreviewMetrics(params, form)[0];
  if (canonical === getActiveWeaponId()) return `${form.displayName} · ${metric ? `${metric.label} ${metric.value}` : form.combatVerb}`;
  return `${weapon.label} · ${form.displayName}，作为副武器补足当前打法。`;
}

function getItemBuildHint(entry) {
  const tag = entry.tag || "";
  const form = getActiveWeaponForm(getActiveWeaponId());
  if (/暴击|输出|射程|频率|伤害|马克笔/.test(tag)) return `提高 ${form?.displayName || "主形态"} 的命中质量或触发频率。`;
  if (/攻速|闪避|爆发|机动/.test(tag)) return "让你更容易拉位置、等窗口、打爆发。";
  if (/经济|拾取|掉落|资源|材料/.test(tag)) return "服务经验/材料副线，让后续主武器升级更快。";
  if (/防御|生存|控制|站场|回复|护盾/.test(tag)) return "补主形态的容错，避免成型前被贴脸压死。";
  return "通用补强，会占用本次材料预算。";
}

function checkItemSynergies(item) {
  if (!game || !game.boughtItems) return;
  const ids = new Set(Array.from(game.boughtItems).concat([item.id]));

  // Synergy: 红笔批注 + 激光翻页笔 → 精准共鸣
  if (ids.has("redPen") && ids.has("laserPointer") && !game.synergyTriggers?.has("precisionResonance")) {
    game.synergyTriggers = game.synergyTriggers || new Set();
    game.synergyTriggers.add("precisionResonance");
    game.precisionResonanceActive = true;
    showFusionNotice("协同", "精准共鸣", "暴击时附带25%射程的额外激光");
    floatingText(game.player.x, game.player.y - 60, "✦ 精准共鸣", "#b282ff");
  }

  // Synergy: 降噪堡垒 + 桌面小风扇 → 守夜人
  if (ids.has("noiseFort") && ids.has("deskFan") && !game.synergyTriggers?.has("nightWatch")) {
    game.synergyTriggers = game.synergyTriggers || new Set();
    game.synergyTriggers.add("nightWatch");
    game.nightWatchActive = true;
    showFusionNotice("协同", "守夜人", "领域内敌人每秒受到护甲值5%真实伤害");
    floatingText(game.player.x, game.player.y - 60, "✦ 守夜人", "#42d7b8");
  }

  // Synergy: 便当 + 保温杯 → 下午茶
  if (ids.has("lunchbox") && ids.has("thermosUpgrade") && !game.synergyTriggers?.has("afternoonTea")) {
    game.synergyTriggers = game.synergyTriggers || new Set();
    game.synergyTriggers.add("afternoonTea");
    game.player.regen += 2;
    game.player.maxHp += 15;
    showFusionNotice("协同", "下午茶", "恢复+2，最大生命+15");
    floatingText(game.player.x, game.player.y - 60, "✦ 下午茶", "#78e8c0");
  }
}

function getItemRarity(item) {
  return item?.rarity || "common";
}

function getItemRarityLabel(item) {
  return itemRarityMeta[getItemRarity(item)]?.label || "普通";
}

function getItemRecycleValue(item) {
  return itemRarityMeta[getItemRarity(item)]?.recycle || 4;
}

function shouldPromptItemReplace(item) {
  return ["epic", "legendary"].includes(getItemRarity(item));
}

function getRarityClass(item) {
  return `rarity-${getItemRarity(item)}`;
}

function getRarityWeight(item) {
  return itemRarityMeta[getItemRarity(item)]?.weight || 1;
}

function generateShopOffers(count, existing = []) {
  if (game.stage === 1 && getOwnedWeaponCount() === 1 && existing.length === 0) {
    return shuffle(["marker", "keyboard", "headset", "sticky", "shredder", "thermos"])
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
  if (entry.shopType === "item") return Math.max(16, Math.round(18 + game.stage * 5.2 + game.boughtItems.size * 3.2 - (aligned ? 4 : 0)));
  const weaponId = getUpgradeWeaponId(entry.id);
  const level = weaponId ? game.weapons[weaponId].level : 0;
  const owned = weaponId && game.weapons[weaponId].level > 0;
  const firstBuyDiscount = owned ? 0 : 4;
  const penalty = (game.weaponUpgradeCostPenalty || 0) + (game.weaponCostDouble ? 1 : 0);
  return Math.max(14, Math.round((16 + level * 11 + game.stage * 4.6 - firstBuyDiscount - (aligned ? 5 : 0)) * (penalty ? penalty : 1)));
}

function buyShopOffer(index) {
  const offer = game.shopOffers[index];
  if (!offer || !canBuyShopOffer(offer)) return;
  game.materials -= offer.cost;
  if (offer.entry.shopType === "item") {
    addPassiveItem(offer.entry, "shop");
  } else {
    offer.entry.apply(game);
    game.weaponUpgradeCounts[offer.entry.id] = (game.weaponUpgradeCounts[offer.entry.id] || 0) + 1;
    // Hidden reversal: NDA → overtime pay refund
    if (game._ndaSigned && game.weaponCostDouble) {
      const refund = 4;
      game.materials += refund;
      floatingText(game.player.x, game.player.y - 70, "加班费到账了！+" + refund, "#ffd15c");
      game._ndaSigned = false;
    }
    syncWeaponDerivedStats();
    applyWeaponUpgradeModifiers();
    maybeShowFusionHint(getUpgradeWeaponId(offer.entry.id));
    checkWeaponEvolutions();
    checkRouteTierUps();
    markBuildHint();
  }
  offer.purchased = true;
  offer.locked = false;
  updateBuildHud();
  updateStatHud();
  updateItemHud();
  renderShop();
}

function snapshotPlayerNumbers() {
  const values = {};
  if (!game?.player) return values;
  for (const [key, value] of Object.entries(game.player)) {
    if (Number.isFinite(value)) values[key] = value;
  }
  return values;
}

function diffPlayerNumbers(before, after) {
  const delta = {};
  for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
    const change = (after[key] ?? 0) - (before[key] ?? 0);
    if (Math.abs(change) > 0.0001) delta[key] = change;
  }
  return delta;
}

function removePassiveItem(index) {
  const record = game?.boughtItemRecords?.[index];
  if (!record) return false;
  for (const [key, change] of Object.entries(record.delta || {})) {
    if (Number.isFinite(game.player[key])) game.player[key] -= change;
  }
  game.player.maxHp = Math.max(1, game.player.maxHp);
  game.player.hp = clamp(game.player.hp, 1, game.player.maxHp);
  game.boughtItems.delete(record.id);
  game.boughtItemNames.splice(index, 1);
  game.boughtItemTags.splice(index, 1);
  game.boughtItemRecords.splice(index, 1);
  return true;
}

function resumeAfterItemReplace() {
  if (!game) return;
  state = game.itemReplaceReturnState || "playing";
  game.pendingItemChoice = null;
  ui.itemReplacePanel?.classList.add("hidden");
  ui.fusionNotice?.classList.add("hidden");
  updateBuildHud();
  updateStatHud();
  updateItemHud();
  lastTime = performance.now();
  if (state === "playing" || state === "recovery") requestAnimationFrame(loop);
}

function openItemReplace(item) {
  if (!item || !game) return;
  game.pendingItemChoice = item;
  game.itemReplaceReturnState = state === "recovery" ? "recovery" : "playing";
  state = "itemReplace";
  ui.stageBanner?.classList.add("hidden");
  ui.fusionNotice?.classList.add("hidden");
  ui.itemReplacePanel?.classList.remove("hidden");
  renderItemReplacePanel();
}

function renderItemReplacePanel() {
  if (!game?.pendingItemChoice || !ui.itemReplacePanel) return;
  const item = game.pendingItemChoice;
  if (ui.itemConvertButton) ui.itemConvertButton.textContent = `回收为材料 +${getItemRecycleValue(item)}`;
  if (ui.itemReplaceCount) ui.itemReplaceCount.textContent = `${game.boughtItemNames.length}/${game.itemSlots}`;
  if (ui.itemReplaceNew) {
    ui.itemReplaceNew.replaceChildren();
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = `${getItemRarityLabel(item)} · ${item.tag || "道具"}`;
    const title = document.createElement("strong");
    title.textContent = item.title;
    const text = document.createElement("p");
    text.textContent = item.text;
    ui.itemReplaceNew.append(tag, title, text);
  }
  if (ui.itemReplaceList) {
    ui.itemReplaceList.replaceChildren(...game.boughtItemRecords.map((record, index) => {
      const card = document.createElement("div");
      card.className = `replace-item-card ${record.rarity ? `rarity-${record.rarity}` : ""}`;
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = `${itemRarityMeta[record.rarity]?.label || "普通"} · ${record.tag || "道具"}`;
      const title = document.createElement("strong");
      title.textContent = record.title;
      const text = document.createElement("p");
      text.textContent = record.text || "";
      const button = document.createElement("button");
      button.className = "mini-button";
      button.type = "button";
      button.textContent = "替换";
      button.addEventListener("click", () => replacePassiveItem(index));
      card.append(tag, title, text, button);
      return card;
    }));
  }
}

function replacePassiveItem(index) {
  const item = game?.pendingItemChoice;
  if (!item || !removePassiveItem(index)) return;
  addPassiveItem(item, "replace");
  floatingText(game.player.x, game.player.y - 46, `替换为 ${item.title}`, "#52ffe1");
  resumeAfterItemReplace();
}

function convertPendingItemToMaterial() {
  if (!game?.pendingItemChoice) return;
  const refund = getItemRecycleValue(game.pendingItemChoice);
  game.materials += refund;
  floatingText(game.player.x, game.player.y - 42, `道具回收 材料+${refund}`, "#ffd15c");
  resumeAfterItemReplace();
}

function keepCurrentPassiveItems() {
  if (!game?.pendingItemChoice) return;
  floatingText(game.player.x, game.player.y - 42, "保留现有道具", "#ffd15c");
  resumeAfterItemReplace();
}

function addPassiveItem(item, source = "shop") {
  if (!item || game.boughtItems.has(item.id)) return false;
  if (game.boughtItems.size >= game.itemSlots) {
    if (source === "drop" && shouldPromptItemReplace(item)) {
      openItemReplace(item);
    } else if (source === "drop") {
      const refund = getItemRecycleValue(item);
      game.materials += refund;
      floatingText(game.player.x, game.player.y - 42, `${getItemRarityLabel(item)}道具回收 材料+${refund}`, "#ffd15c");
    }
    else floatingText(game.player.x, game.player.y - 42, "道具槽满", "#ffd15c");
    return false;
  }
  const before = snapshotPlayerNumbers();
  item.apply(game);
  const delta = diffPlayerNumbers(before, snapshotPlayerNumbers());
  game.boughtItems.add(item.id);
  game.boughtItemNames.push(item.title);
  game.boughtItemTags.push(item.tag || "");
  game.boughtItemRecords.push({
    id: item.id,
    title: item.title,
    tag: item.tag || "",
    rarity: getItemRarity(item),
    text: item.text,
    delta,
  });
  if (source !== "replace") floatingText(game.player.x, game.player.y - 46, `获得 ${item.title}`, "#52ffe1");
  if (source !== "replace") showFusionNotice("新道具", item.title, item.text);
  checkItemSynergies(item);
  applyDarkAffix(item.id, game);
  checkHiddenSynergies();
  checkWeaponEvolutions();
  checkRouteTierUps();
  updateBuildHud();
  updateStatHud();
  updateItemHud();
  return true;
}

function canBuyShopOffer(offer) {
  if (!offer || offer.purchased || game.materials < offer.cost) return false;
  if (offer.entry.shopType === "item") return game.boughtItems.size < game.itemSlots;
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

function rerollShop() {
  if (state !== "armory") return;
  const cost = getRefreshCost();
  if (game.materials < cost) return;
  game.materials -= cost;
  game.rerollCount += 1;
  const locked = game.shopOffers.filter((offer) => offer.locked && !offer.purchased);
  game.shopOffers = generateShopOffers(getShopOfferCount(), locked);
  renderShop();
}

function getShopOfferCount() {
  return 4;
}

function getRefreshCost() {
  return Math.max(2, 7 + game.rerollCount * 4 + (game.policyRefreshAdd || 0) - (game.permanentRefreshDiscount || 0));
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
  if (id.startsWith("shredder")) return "shredder";
  if (id.startsWith("thermos")) return "thermos";
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
    shredder: 14,
    thermos: 11,
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
    shredderMaintenance: "armor",
    teaRoomRoutine: "fortify",
    crisisManual: "armor",
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
  return Math.max(0.18, base * (100 / (100 + Math.max(-60, getEffectiveStat("attackSpeed")))));
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
    shredder: 0.62,
    thermos: 0.35,
  };
  const coefficient = coefficients[weaponId] ?? 1;
  const floor = weaponId === "marker" ? 0.42 : weaponId === "coffee" ? 0.16 : 0.22;
  const hybrid = getHybridBonus();
  const hybridMult = hybrid.active ? hybrid.cooldownMult : 1;
  // Barrage T3: surrounded => faster cooldowns (scaled by effectiveness)
  const barrageEff = game.routeEff?.barrage || 0;
  const barrageSurroundMult = (barrageEff > 0 && hasWeaponPair("keyboard", "stapler", 2) && getRouteTier("barrage") >= 3
    && game.enemies.filter(en => Math.hypot(en.x - game.player.x, en.y - game.player.y) < 140).length >= 5)
    ? Math.max(0.55, 1 - 0.25 * barrageEff) : 1;
  return Math.max(floor, base * (100 / (100 + attackSpeed * coefficient)) * hybridMult * (game.policyCooldownMult || 1) * barrageSurroundMult * (game.sudsidyCdBoost ? 0.8 : 1));
}

function getHybridBonus() {
  if (!game) return { active: false };
  const counts = getWeaponClassCounts();
  const owned = getOwnedWeaponCount();
  const classCount = Object.keys(counts).length;
  const anyRouteActive = routeDefinitions.some((route) => getRouteTier(route.id) >= 2);
  if (owned < 3 || classCount < 3 || anyRouteActive) return { active: false };
  return {
    active: true,
    cooldownMult: 0.92,
    label: classCount >= 5 ? "全能工位+" : "全能工位",
    text: classCount >= 5 ? "冷却 -8%，伤害 +4%" : "冷却 -8%",
    damageMult: classCount >= 5 ? 0.04 : 0,
  };
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

// Returns which route has the highest total weapon levels
function getDominantRouteId() {
  let best = null;
  let bestScore = 0;
  for (const route of routeDefinitions) {
    const wl = route.weapons.reduce((s, id) => s + game.weapons[id].level, 0);
    if (wl >= 4 && wl > bestScore) { bestScore = wl; best = route.id; }
  }
  return best;
}

// 0 = no pair, 0.5 = subordinate, 1.0 = dominant among multiple, 1.25 = sole route
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

function getClassBonus(key) {
  if (!game) return 0;
  const counts = getWeaponClassCounts();
  let total = 0;
  for (const [className, count] of Object.entries(counts)) {
    const tiers = weaponClassBonuses[className] || [];
    let active = null;
    for (const tier of tiers) {
      const threshold = Math.max(1, tier.count + (game.policyClassThresholdOffset || 0));
      if (count >= threshold) active = tier;
    }
    if (active && active[key]) total += active[key] * (game.policyClassBonusMult || 1);
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

function getThermosTeaMax() {
  return Math.max(game.weapons.thermos.level >= 5 ? 200 : 100, game.player.thermosTeaMax);
}

function getThermosRadius() {
  return game.player.thermosRadius
    + getClassBonus("fieldRadius") * 0.5
    + Math.max(0, getEffectiveStat("fortify") * 1.5)
    + Math.max(0, (game.player.thermosTea - 50) * 0.12);
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

function softCap(value, softCap, hardCap, tail = 0.35) {
  if (value <= softCap) return value;
  const extra = value - softCap;
  return Math.min(hardCap, softCap + extra * tail);
}

function softCapWeaponSize(actual, base) {
  if (typeof base !== "number" || base <= 0) return actual;
  return Math.round(softCap(actual, base * WSIZE_SOFT_FACTOR, base * WSIZE_HARD_FACTOR, WSIZE_TAIL));
}

function addPlayerDamage(g, amount) {
  const current = g.player.damageMult;
  const scaled = current >= DAMAGE_MULT_SOFT_CAP ? amount * 0.45 : amount;
  g.player.damageMult = Math.min(DAMAGE_MULT_HARD_CAP, current + scaled);
}

function addPlayerAttackSpeed(g, amount) {
  const current = g.player.attackSpeed;
  const scaled = current >= ATTACK_SPEED_SOFT_CAP ? amount * 0.42 : amount;
  g.player.attackSpeed = Math.min(ATTACK_SPEED_HARD_CAP, current + scaled);
}

function getRawDamageMult() {
  const hybrid = getHybridBonus();
  return game.player.damageMult + getClassBonus("damageMult") + getBuildFocusDamageBonus() + (hybrid.active ? hybrid.damageMult : 0);
}

function getRawAttackSpeed() {
  return game.player.attackSpeed + getClassBonus("attackSpeed");
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
  if (crit && game.paperStormActive) {
    const ps = hiddenSynergies.find(s => s.id === "paperStorm");
    if (ps?.onCrit) ps.onCrit(game);
  }
  return base * getDamageMult() * (crit ? 1.85 : 1);
}

function continuousDamage(base) {
  const p = game.player;
  return base * getDamageMult() * (1 + clamp(p.crit + getClassBonus("crit"), 0, 75) * 0.006);
}

function getDamageMult() {
  return softCap(getRawDamageMult(), DAMAGE_MULT_SOFT_CAP, DAMAGE_MULT_HARD_CAP, 0.35);
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
    attackSpeed: softCap(getRawAttackSpeed(), ATTACK_SPEED_SOFT_CAP, ATTACK_SPEED_HARD_CAP, 0.34),
    crit: p.crit + getClassBonus("crit"),
    range: p.range + getClassBonus("range"),
    dodge: p.dodge,
    armor: p.armor + getClassBonus("armor") + (game.tempArmor || 0),
    luck: p.luck + getClassBonus("luck"),
    pickupRange: p.pickupRange + getClassBonus("pickupRange"),
    regen: p.regen + (game.tempRegen || 0),
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

function getMarkerBeamPalette(style = "base") {
  const palettes = {
    split: { glowColor: "#4efcff", color: "#58dfff", coreColor: "#f2ffff", accentColor: "#b4fff8" },
    blast: { glowColor: "#66d8ff", color: "#41b8ff", coreColor: "#fff7d6", accentColor: "#ffd76a" },
    shield: { glowColor: "#6affd7", color: "#34e8be", coreColor: "#e7fff8", accentColor: "#9cfbff" },
    wave: { glowColor: "#8ec8ff", color: "#6b8cff", coreColor: "#eff7ff", accentColor: "#b78cff" },
    grid: { glowColor: "#65f1ff", color: "#33b8ff", coreColor: "#ffffff", accentColor: "#d7c76a" },
    base: { glowColor: "#52ffe1", color: "#52d8ff", coreColor: "#f2ffff", accentColor: "#85f7ff" },
  };
  return palettes[style] || palettes.base;
}

function addMarkerVfxEvent(kind, options = {}) {
  if (!game) return;
  game.markerVfxEvents = game.markerVfxEvents || [];
  const style = options.style || "base";
  const palette = Object.assign(getMarkerBeamPalette(style), options.palette || {});
  const life = options.life ?? (kind === "beam" ? 0.18 : 0.46);
  game.markerVfxEvents.push(Object.assign({
    kind,
    style,
    life,
    maxLife: life,
    age: 0,
    width: options.width || 6,
    radius: options.radius || 72,
    glowColor: palette.glowColor,
    color: palette.color,
    coreColor: palette.coreColor,
    accentColor: palette.accentColor,
  }, options, palette));
  const cap = game.stage >= 7 && game.stage <= 10 ? 90 : 130;
  if (game.markerVfxEvents.length > cap) game.markerVfxEvents.splice(0, game.markerVfxEvents.length - cap);
}

function isHighValueEnemy(enemy) {
  if (!enemy) return false;
  return !!enemy.elite || enemy.type === "manager" || enemy.type === "deadline" || enemy.type === "boss" || enemy.maxHp >= 85 || enemy.hp / Math.max(1, enemy.maxHp) > 0.6;
}

function releaseMarkerShieldCounter(params, level, reason = "break") {
  const p = game?.player;
  if (!p || !game?.enemies?.length) return;
  const count = Math.min(7, 2 + Math.floor(level / 3) + Math.floor(params.countBonus || 0) + (isMarkerPromoted(level) ? (params.promotedSpikeCount || 3) : 0));
  const range = (params.counterRange || 260) + rangeBonus(0.25);
  const damage = hitDamage((12 + level * 3.4) * (params.counterDamage || 0.62) * (params.damage || 1));
  for (let i = 0; i < count; i += 1) {
    const a = (i / count) * TAU + game.time * 0.7;
    fireBeam(a, range, Math.max(4, (p.markerWidth || 4) * 0.55), damage, "#6affd7", "marker", {
      origin: { x: p.x, y: p.y },
      skipForm: true,
      style: "shield",
      vfxLife: 0.22,
    });
  }
  addMarkerVfxEvent("shield", { x: p.x, y: p.y, radius: 56 + count * 5, style: "shield", life: 0.55 });
  addCombatCue("marker-shield-counter", reason === "break" ? "应急盾反刺" : "应急盾成型", p.x, p.y - 42, "#6affd7", { cooldown: 0.7, pulseRadius: 58 });
}

function applyMarkerFormAfterHit(enemy, angle, length, width, damage, form, params, options = {}) {
  if (!enemy || options.skipForm) return;
  const mechanic = form?.mechanicType || form?.formId;
  const p = game.player;
  const level = game.weapons.marker?.level || 1;
  if (mechanic === "line_split") {
    const splitEvery = Math.max(1, 2 - Math.floor((params.mechanicBonus || 0) / 2));
    if ((enemy._markerSplitSerial || 0) % splitEvery === 0) {
      const splitCount = Math.min(7, (params.splitCount || 1) + Math.floor(params.countBonus || 0) + Math.floor(level / 4));
      const range = (params.splitRange || 220) + rangeBonus(0.25);
      for (let i = 0; i < splitCount; i += 1) {
        const side = i % 2 === 0 ? 1 : -1;
        const spread = 0.44 + Math.floor(i / 2) * 0.18;
        fireBeam(angle + side * spread, range, Math.max(3, width * 0.38), damage * (params.splitDamage || 0.42), "#58dfff", "marker", {
          origin: { x: enemy.x, y: enemy.y },
          skipForm: true,
          style: "split",
          vfxLife: 0.16,
        });
      }
      addCombatCue("marker-split", "分裂光线", enemy.x, enemy.y - 22, "#58dfff", { cooldown: 0.38 });
    }
    enemy._markerSplitSerial = (enemy._markerSplitSerial || 0) + 1;
    if (isMarkerPromoted(level) && Math.random() < (params.fullScreenLaserChance || 0.1) + (params.chanceBonus || 0) * 0.12) {
      const sweepY = enemy.y + (Math.random() - 0.5) * 100;
      fireBeam(0, canvas.width + 120, Math.max(7, width * 0.9), damage * (params.fullScreenLaserDamage || 0.62), "#4efcff", "marker", {
        origin: { x: -60, y: sweepY },
        skipForm: true,
        style: "split",
        vfxLife: 0.24,
      });
      addCombatCue("marker-full-sweep", "全屏扫线", canvas.width * 0.5, sweepY - 24, "#4efcff", { cooldown: 1.1, shake: 1 });
    }
  } else if (mechanic === "mark_detonate") {
    if (!isHighValueEnemy(enemy)) return;
    const now = game.time || 0;
    const windowTime = (params.markWindow || 2.4) + (params.durationBonus || 0) * 0.35;
    if (enemy.markerP0Until && enemy.markerP0Until > now) {
      const promoted = isMarkerPromoted(level);
      const radius = ((params.blastRadius || 48) + (params.radiusBonus || 0) * 22 + level * 1.8) * (promoted ? (params.promotedRadiusMult || 2) : 1);
      const blastDamage = damage * ((params.blastDamage || 0.9) + (promoted ? (params.promotedDamageMult || 1.12) - 1 : 0));
      game.delayedBlasts.push({ x: enemy.x, y: enemy.y, r: radius, delay: 0, damage: blastDamage, source: "marker_blast", color: "#66d8ff", text: "P0光爆" });
      addMarkerVfxEvent("blast", { x: enemy.x, y: enemy.y, radius, style: "blast", life: 0.52 });
      enemy.markerP0Until = 0;
      addCombatCue("marker-p0-detonate", "P0光爆", enemy.x, enemy.y - 28, "#ffd76a", { cooldown: 0.45, shake: 1 });
    } else {
      enemy.markerP0Until = now + windowTime;
      addMarkerVfxEvent("blast", { x: enemy.x, y: enemy.y, radius: 24, style: "blast", life: 0.28 });
      addCombatCue("marker-p0-mark", "P0标记", enemy.x, enemy.y - 22, "#66d8ff", { cooldown: 0.65 });
    }
  } else if (mechanic === "shield_counter_line") {
    const gain = (params.shieldOnHit || 1.4) + (params.shieldBonus || 0) * 0.35;
    p.markerEmergencyShield = Math.min(38 + level * 3, (p.markerEmergencyShield || 0) + gain);
    if (p.markerEmergencyShield >= 18 + level * 1.5 && !p._markerShieldReadyCue) {
      p._markerShieldReadyCue = true;
      addMarkerVfxEvent("shield", { x: p.x, y: p.y, radius: 42 + p.markerEmergencyShield, style: "shield", life: 0.42 });
      addCombatCue("marker-shield-ready", "应急盾成型", p.x, p.y - 40, "#6affd7", { cooldown: 1.2 });
    }
  }
}

function applyMarkerFormAfterBeam(hits, angle, length, width, damage, form, params, options = {}) {
  if (options.skipForm) return;
  const mechanic = form?.mechanicType || form?.formId;
  const p = game.player;
  const level = game.weapons.marker?.level || 1;
  const endX = (options.origin?.x ?? p.x) + Math.cos(angle) * length;
  const endY = (options.origin?.y ?? p.y) + Math.sin(angle) * length;
  if (mechanic === "line_to_wave") {
    const waveCount = Math.min(6, (params.waveCount || 1) + Math.floor(params.countBonus || 0) + Math.floor(level / 4) + (isMarkerPromoted(level) ? (params.promotedEcho || 0) : 0));
    for (let i = 0; i < waveCount; i += 1) {
      const radius = 70 + level * 4 + (params.radiusBonus || 0) * 22 + i * 34;
      game.damageZones.push({
        x: endX,
        y: endY,
        r: radius,
        life: 0.42 + i * 0.08,
        maxLife: 0.42 + i * 0.08,
        damage: continuousDamage((7 + level * 1.8) * (params.waveDamage || 0.46) * (params.damage || 1)),
        source: "marker_wave",
        tick: 0.12,
        chainTick: Infinity,
        textTick: 0,
        color: "#8ec8ff",
        push: (params.wavePush || 54) + i * 8,
      });
      addMarkerVfxEvent("ring", { x: endX, y: endY, radius, startRadius: Math.max(18, width * 3), style: "wave", band: 12 + i * 2, life: 0.52 + i * 0.08 });
    }
    addCombatCue("marker-wave", "线转波纹", endX, endY - 26, "#8ec8ff", { cooldown: 0.65 });
  } else if (mechanic === "line_grid_field") {
    const spread = 74 + Math.min(90, level * 6 + (params.radiusBonus || 0) * 28);
    const lines = Math.max(2, (params.gridLines || 2) + Math.floor(params.countBonus || 0) + Math.floor(level / 4));
    const cx = (p.x + endX) * 0.5;
    const cy = (p.y + endY) * 0.5;
    game.damageZones.push({
      x: cx,
      y: cy,
      r: spread,
      life: 1.15 + (params.durationBonus || 0) * 0.38,
      maxLife: 1.15 + (params.durationBonus || 0) * 0.38,
      damage: continuousDamage((5 + level * 1.4) * (params.gridDamage || 0.44) * (params.damage || 1)),
      source: "marker_grid",
      tick: 0.18,
      chainTick: Infinity,
      textTick: 0,
      color: "#65f1ff",
      slow: params.gridSlow || 0.42,
      gridLines: lines,
    });
    addMarkerVfxEvent("grid", { x: cx, y: cy, spread, lines, width: Math.max(3, width * 0.55), style: "grid", life: 0.78 });
    addCombatCue("marker-grid", "流程网格", cx, cy - 26, "#65f1ff", { cooldown: 0.85 });
  }
}

function fireBeam(angle, length, width, damage, color, source = "beam", options = {}) {
  const p = game.player;
  const origin = options.origin || p;
  const ax = Math.cos(angle);
  const ay = Math.sin(angle);
  const hits = [];
  const markerForm = source === "marker" ? (options.form || getActiveWeaponForm("marker")) : null;
  const markerParams = source === "marker" ? (options.params || getActiveFormParams("marker", game.weapons.marker?.level || 1)) : null;
  const style = options.style || markerForm?.visualStyle || "base";
  for (const e of game.enemies) {
    const dx = e.x - origin.x;
    const dy = e.y - origin.y;
    const along = dx * ax + dy * ay;
    if (along < 0 || along > length) continue;
    const perp = Math.abs(dx * ay - dy * ax);
    if (perp < width + e.r) {
      const markerBonus = (source === "marker" && e.precisionMark > 0 && (game.routeEff?.precision || 0) > 0)
        ? 1 + 0.3 * (game.routeEff?.precision || 0) : 1;
      const dist = Math.hypot(e.x - origin.x, e.y - origin.y);
      const distEff = getRouteTier("precision") >= 3 ? Math.min(0.3, Math.floor(dist / 100) * 0.06) * (game.routeEff?.precision || 0) : 0;
      applyEnemyDamage(e, damage * markerBonus * (1 + distEff), source);
      e.hitFlash = 0.08;
      hits.push(e);
      if (source === "marker") applyMarkerFormAfterHit(e, angle, length, width, damage, markerForm, markerParams, options);
    }
  }
  if (source === "marker") {
    addMarkerVfxEvent("beam", {
      x: origin.x,
      y: origin.y,
      angle,
      length,
      width,
      style,
      intensity: options.intensity || (hits.length >= 4 ? 1.18 : 0.9),
      life: options.vfxLife || 0.18,
    });
    applyMarkerFormAfterBeam(hits, angle, length, width, damage, markerForm, markerParams, options);
  }
  game.particles.push({
    kind: "beam",
    x: origin.x,
    y: origin.y,
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
  const calculatorContext = source === "calculator" ? getWeaponFormContext("calculator", game.weapons.calculator?.level || 1) : null;
  const conductor = hasWeaponPair("sticky", "calculator", 2);
  const conductorTier = getRouteTier("conductor");
  const conductorEff = game.routeEff?.conductor || 0;
  let conductorSlowBounced = false;
  let extraJumps = 0;
  for (let i = 0; i < jumps + extraJumps && current; i += 1) {
    hit.add(current.id);
    // Conductor T1: first slowed enemy hit grants +2 extra chain jumps (gated)
    if (conductorEff > 0 && !conductorSlowBounced && (current.slow < 1)) {
      extraJumps += 2;
      conductorSlowBounced = true;
    }
    applyEnemyDamage(current, damage * Math.pow(0.82, i), source);
    if (calculatorContext?.mechanic === "ledger_death_settlement") {
      current.auditLedger = Math.max(current.auditLedger || 0, 3.8);
      current.auditLedgerDamage = (current.auditLedgerDamage || 0) + damage * Math.pow(0.82, i) * 0.28;
      current.auditLedgerValue = Math.min(5, (current.auditLedgerValue || 0) + 1);
    } else if (calculatorContext?.mechanic === "recursive_chain" && i === 0) {
      extraJumps += 1 + Math.floor((calculatorContext.params?.mechanic || 0) / 2);
    } else if (calculatorContext?.mechanic === "mode_alternating_projectile") {
      if (i % 2 === 1) {
        const heal = Math.min(3.5, 0.6 + damage * 0.025);
        game.player.hp = Math.min(game.player.maxHp, game.player.hp + heal);
        addFormShield(0.35 + heal * 0.25, 30, "平衡");
      }
    }
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
      // Conductor T4: chain passing through sticky trap → detonate + refresh (gated)
      if (conductorEff > 0 && conductorTier >= 4) {
        for (const zone of game.damageZones) {
          if (zone.source === "sticky" && zone.life > 0) {
            const zdx = zone.x - current.x; const zdy = zone.y - current.y;
            const ndx = next.x - current.x; const ndy = next.y - current.y;
            const dot = zdx * ndx + zdy * ndy;
            const segLenSq = ndx * ndx + ndy * ndy;
            const t = clamp(dot / segLenSq, 0, 1);
            const px = current.x + t * ndx;
            const py = current.y + t * ndy;
            if (Math.hypot(px - zone.x, py - zone.y) < zone.r + 20) {
              zone.explodeOnEnd = true;
              zone.life = Math.max(zone.life, 0.15);
              zone.damage *= 1.5;
              zone.chainTick = 0;
              floatingText(zone.x, zone.y - 8, "过载", "#52ffe1");
            }
          }
        }
      }
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
  // Perimeter T3: anchored => extra orbit ring (gated by effectiveness)
  const anchorRing = (perimeterTier >= 3 && getAnchorCharge() > 0.65 && (game.routeEff?.perimeter || 0) > 0) ? 1 : 0;
  const count = p.orbitCount + (perimeter ? 1 : 0) + (perimeterTier >= 4 ? 2 : 0) + Math.min(3, anchorCount) + anchorRing;
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

function getEmployeePoints() {
  return Number.parseInt(localStorage.getItem(EMPLOYEE_POINTS_KEY) || "0", 10) || 0;
}

function setEmployeePoints(points) {
  localStorage.setItem(EMPLOYEE_POINTS_KEY, String(Math.max(0, Math.floor(points))));
}

function addEmployeePoints(amount) {
  const total = getEmployeePoints() + amount;
  setEmployeePoints(total);
  return total;
}

function getPermanentUpgradeLevels() {
  try {
    return JSON.parse(localStorage.getItem(EMPLOYEE_UPGRADES_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

function setPermanentUpgradeLevels(levels) {
  localStorage.setItem(EMPLOYEE_UPGRADES_KEY, JSON.stringify(levels));
}

function getPermanentUpgradeLevel(id) {
  return getPermanentUpgradeLevels()[id] || 0;
}

function applyPermanentUpgrades(targetGame) {
  const levels = getPermanentUpgradeLevels();
  for (const upgrade of permanentUpgrades) {
    const level = levels[upgrade.id] || 0;
    if (level > 0) upgrade.apply(targetGame, level);
  }
  targetGame.permanentRefreshDiscount = Math.min(2, levels.refresh || 0);
  targetGame.player.hp = Math.min(targetGame.player.maxHp, targetGame.player.hp);
}

function openPerkShop() {
  ui.resultPanel?.classList.add("hidden");
  ui.startPanel?.classList.add("hidden");
  ui.perkPanel?.classList.remove("hidden");
  renderPerkShop();
}

function closePerkShop() {
  ui.perkPanel?.classList.add("hidden");
  if (state === "result") ui.resultPanel?.classList.remove("hidden");
  else {
    ui.startPanel?.classList.remove("hidden");
    updateStartActions();
  }
}

function renderPerkShop() {
  if (!ui.perkList || !ui.perkPoints) return;
  const points = getEmployeePoints();
  const levels = getPermanentUpgradeLevels();
  ui.perkPoints.textContent = points;
  ui.perkList.replaceChildren(...permanentUpgrades.map((upgrade) => {
    const level = levels[upgrade.id] || 0;
    const max = upgrade.costs.length;
    const nextCost = upgrade.costs[level] || 0;
    const card = document.createElement("div");
    card.className = "perk-card";
    const title = document.createElement("strong");
    title.textContent = upgrade.title;
    const levelText = document.createElement("small");
    levelText.textContent = `Lv.${level}/${max}`;
    const desc = document.createElement("span");
    desc.textContent = upgrade.text;
    const button = document.createElement("button");
    button.className = "mini-button";
    button.type = "button";
    button.textContent = level >= max ? "已满" : `${nextCost} 工分`;
    button.disabled = level >= max || points < nextCost;
    button.addEventListener("click", () => buyPermanentUpgrade(upgrade.id));
    card.append(title, levelText, desc, button);
    return card;
  }));
}

function buyPermanentUpgrade(id) {
  const upgrade = permanentUpgrades.find((entry) => entry.id === id);
  if (!upgrade) return;
  const levels = getPermanentUpgradeLevels();
  const level = levels[id] || 0;
  const cost = upgrade.costs[level];
  if (!cost || getEmployeePoints() < cost) return;
  setEmployeePoints(getEmployeePoints() - cost);
  levels[id] = level + 1;
  setPermanentUpgradeLevels(levels);
  renderPerkShop();
}

function getTopDamageSource() {
  const entries = Object.entries(game.damageBySource || {});
  if (!entries.length) return "未被击中";
  entries.sort((a, b) => b[1] - a[1]);
  const [source, amount] = entries[0];
  return `${source} ${Math.round(amount)}`;
}

function getRunTopWeaponLabel() {
  const owned = buildOrder
    .map((id) => game.weapons[id])
    .filter((weapon) => weapon && weapon.level > 0)
    .sort((a, b) => b.level - a.level);
  if (!owned.length) return "尚未成型";
  return `${owned[0].label} Lv.${owned[0].level}`;
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


// ════════════════════════════════════════════════════════════
//  LAYER 07: TELEMETRY — 死亡复盘 & 统计
//  死亡分析·伤害来源·工分计算
// ════════════════════════════════════════════════════════════
function renderDeathRecap() {
  if (!ui.deathRecap) return;
  const hints = getDeathHints();
  const bossEntry = getNearestBossKillInfo();
  const topSource = getTopDamageSource();
  const topDmg = Math.round(getTopDamageAmount());
  const dominantId = getDominantRouteId();
  const dominantRoute = dominantId ? routeDefinitions.find(r => r.id === dominantId) : null;
  let bossLine = "";
  if (bossEntry) {
    const bossPct = Math.round((1 - bossEntry.hp / bossEntry.maxHp) * 100);
    bossLine = `
      <div class="recap-boss-bar"><div class="recap-boss-fill" style="width:${Math.min(100, bossPct)}%"></div></div>
      <span>Boss <b>${bossEntry.name}</b> 剩余血量 <b>${Math.round(bossEntry.hp / bossEntry.maxHp * 100)}%</b>（已造成 ${bossPct}% 伤害）</span>
    `;
  }
  const routeLine = dominantRoute
    ? `<span>主路线 <b>${dominantRoute.name} · ${dominantRoute.stages[getRouteTier(dominantRoute.id)] || '未成型'}</b></span>`
    : "";
  const hintLines = hints.map(h => `<li>${h}</li>`).join("");
  ui.deathRecap.innerHTML = `
    <div class="recap-head">⚡ 就差一点——复盘分析</div>
    <span>第 <b>${game.stage}</b> 关倒下 · 等级 <b>${game.level}</b> · 主力输出 <b>${topSource}</b>（${topDmg} 伤害）</span>
    ${routeLine}
    ${bossLine}
    <div class="recap-hint">
      <div style="margin-bottom:4px;color:#52ffe1">💡 下次试试：</div>
      <ul style="margin:0;padding-left:18px">${hintLines}</ul>
    </div>
  `;
  ui.deathRecap.classList.remove("hidden");
}

function getNearestBossKillInfo() {
  if (!game?.enemies) return null;
  let best = null;
  for (const e of game.enemies) {
    if (e.type === "manager" || e.type === "deadline") {
      if (!best || e.maxHp > best.maxHp) best = { name: e.label || e.type, hp: e.hp, maxHp: e.maxHp };
    }
  }
  return best;
}

function getDeathHints() {
  const hints = [];
  const stage = game.stage || 1;
  const dmgBySource = game.damageBySource || {};
  const dmgTaken = game.damageTaken || 0;
  const hitsTaken = game.hitsTaken || 0;
  const avgHit = hitsTaken > 0 ? dmgTaken / hitsTaken : 0;
  const armor = getEffectiveStat("armor");
  const dodge = getEffectiveStat("dodge");
  const regen = getEffectiveStat("regen");

  if (avgHit > 20) hints.push("怪物单次伤害很高，堆护甲或闪避能显著延长存活时间。");
  if (armor < 4) hints.push("你的护甲太低，会议结界路线的降噪耳机能大幅减伤。");
  if (dodge < 8 && hitsTaken > 15) hints.push("闪避不足，键盘风暴路线的订书机提升闪避，被包围还能额外加闪。");
  if (regen < 3) hints.push("恢复太低，保温杯或桌面小风扇能让你快速回血。");
  if (stage >= 8 && !dmgBySource["marker"] && !dmgBySource["coffee"]) hints.push("中后期需要穿透清场能力，试试精准贯穿路线（咖啡+马克笔）。");
  if (stage >= 6 && !dmgBySource["headset"] && !dmgBySource["report"]) hints.push("中后期怪物密度高，会议结界（耳机+报表）的轨道护体很救命。");
  if (game.boughtItems && game.boughtItems.size < 3) hints.push("道具太少了——在武器店买道具能获得关键被动加成。");
  if (!hints.length) hints.push("多试几条武器路线，不同流派应对不同关卡。");
  // Shuffle and take max 3
  for (let i = hints.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [hints[i], hints[j]] = [hints[j], hints[i]]; }
  return hints.slice(0, 3);
}

function getTopDamageAmount() {
  const entries = Object.entries(game.damageBySource || {});
  if (!entries.length) return 0;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][1];
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

function renderBestOvertime() {
  if (!ui.bestOvertimeText) return;
  const best = Number.parseInt(localStorage.getItem("cb_endless_best") || "0", 10);
  ui.bestOvertimeText.classList.toggle("hidden", best <= 0);
  if (best > 0) ui.bestOvertimeText.textContent = `最长加班：${formatTime(best)}`;
}



// Runtime layer restored from the stable baseline; V2 start flow calls this through startGameActual().
function startGameActual() {
  const selectedWeapon = canonicalWeaponId(CS.buildState?.weapons?.[0] || pendingStartWeapon || "marker");
  startGameActualLegacy();
  normalizeWeaponStateForCombat(game.weapons);
  for (const [id, weapon] of Object.entries(game.weapons || {})) {
    if (!weapon || !("level" in weapon)) continue;
    weapon.level = canonicalWeaponId(id) === selectedWeapon ? Math.max(1, weapon.level || 1) : 0;
  }
  if (selectedWeapon === "headphones" && game.weapons.headset) game.weapons.headset.level = 1;
  if (selectedWeapon === "sticky_note" && game.weapons.sticky) game.weapons.sticky.level = 1;
  game.activeWeaponForm = getActiveWeaponForm(selectedWeapon);
  game.badgeChosen = Boolean(CS.buildState?.badgeDept);
  updateBuildHud();
  updateStatHud();
  updateItemHud();
}

function render() {

// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
//  LAYER 06: PRESENTATION 鈥?琛ㄧ幇涓庣粯鍒?//  娓叉煋路HUD路鐗规晥路婕斿嚭路UI闈㈡澘
// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
  if (!game) {
    drawMenuBackground();
    return;
  }

  const cam = game.camera;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFloor(cam);

  ctx.save();
  const shakeX = game.screenShake > 0 ? (Math.random() - 0.5) * game.screenShake * 2 : 0;
  const shakeY = game.screenShake > 0 ? (Math.random() - 0.5) * game.screenShake * 2 : 0;
  ctx.translate(-cam.x + shakeX, -cam.y + shakeY);
  drawPickups();
  drawDamageZones();
  drawAura();
  drawOrbiters();
  drawWeaponFormVfx();
  drawProjectiles();
  drawEnemies();
  drawMarkerVfxEvents();
  drawParticles();
  drawCombatCues();
  drawPlayer();
  drawFloatingTexts();
  drawSwingTrails();
  ctx.restore();
  drawScreenFeedback();
}

function drawScreenFeedback() {
  const flash = game.damageFlash || 0;
  const lowHpRatio = game.player.hp / game.player.maxHp;
  if (flash > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(0.34, flash * 0.28);
    ctx.fillStyle = "#ff335f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
  if (lowHpRatio < 0.28) {
    const pulseAlpha = 0.18 + Math.sin(game.time * 8) * 0.05;
    const grd = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.28, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.72);
    grd.addColorStop(0, "rgba(255, 42, 96, 0)");
    grd.addColorStop(1, `rgba(255, 42, 96, ${pulseAlpha})`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
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
    ctx.strokeStyle = e.type === "boss" || e.type === "emergency" ? "rgba(255, 42, 96, 0.86)" : "rgba(255, 209, 92, 0.78)";
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
  const atlasEnemy = { bug: 1, change: 2, meeting: 3, emergency: 3, deadline: 4 }[e.type];
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
  } else if (e.type === "meeting" || e.type === "emergency") {
    pixelRect(x - 18 * s, y - 15 * s, 36 * s, 10 * s, dark);
    pixelRect(x - 22 * s, y - 5 * s, 44 * s, 25 * s, base);
    pixelRect(x - 14 * s, y + 2 * s, 28 * s, 5 * s, "#d9ecff");
    pixelRect(x - 6 * s, y - 23 * s, 12 * s, 8 * s, "#f4f0e8");
    pixelRect(x - 2 * s, y - 21 * s, 4 * s, 4 * s, e.type === "emergency" ? "#ff2a60" : "#6ea8ff");
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
  drawThermosSteam();
  drawShredderBlades();
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
  if ((p.formShield || 0) > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.28 + Math.min(0.28, p.formShield / 80);
    ctx.strokeStyle = "#8ec8ff";
    ctx.shadowColor = "#8ec8ff";
    ctx.shadowBlur = 14;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r + 18 + Math.sin(game.time * 7) * 2, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }
  ctx.save();
  ctx.globalAlpha = p.invuln > 0 ? 0.62 + Math.sin(game.time * 34) * 0.22 : 1;
  drawPixelWorker(p.x, p.y, game.time, p);
  ctx.restore();
  const dominantRoute = getDominantRoute();
  if (dominantRoute && dominantRoute.tier >= 2) {
    const alpha = dominantRoute.tier >= 4
      ? 0.22 + Math.sin(game.time * 3) * 0.06
      : dominantRoute.tier >= 3
        ? 0.14 + Math.sin(game.time * 2.5) * 0.04
        : 0.08;
    const radius = dominantRoute.tier >= 4 ? 46 : dominantRoute.tier >= 3 ? 34 : 22;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = dominantRoute.color || "#52ffe1";
    ctx.lineWidth = dominantRoute.tier >= 4 ? 3 : 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius + p.r, 0, TAU);
    ctx.stroke();
    if (dominantRoute.tier >= 4 && Math.random() < 0.3) {
      const angle = Math.random() * TAU;
      game.particles.push({
        x: p.x + Math.cos(angle) * (radius + p.r),
        y: p.y + Math.sin(angle) * (radius + p.r),
        vx: Math.cos(angle) * 8,
        vy: Math.sin(angle) * 8 - 4,
        r: 2,
        age: 0,
        life: 0.8,
        maxLife: 0.8,
        color: dominantRoute.accent || dominantRoute.color,
      });
    }
    ctx.restore();
  }
}

function drawSwingTrails() {
  if (!game) return;
  const p = game.player;

  // Draw keyboard swing model
  if (game.keyboardSwingVisual && game.keyboardSwingVisual.life > 0) {
    const kv = game.keyboardSwingVisual;
    kv.life -= 0.018;
    const alpha = kv.life / kv.maxLife;
    if (alpha > 0) {
      ctx.save();
      ctx.globalAlpha = alpha * 0.85;
      // Draw keyboard body at mid-swing position
      const midDist = kv.range * 0.6;
      const kx = kv.x + Math.cos(kv.angle) * midDist;
      const ky = kv.y + Math.sin(kv.angle) * midDist;
      ctx.translate(kx, ky);
      ctx.rotate(kv.angle - Math.PI / 2); // perpendicular to swing direction

      const kbodyClr = kv.heavy ? "#ff8c8c" : "#6ea8ff";
      const kkeyClr = kv.heavy ? "#ffcccb" : "#b8d4ff";
      // Keyboard body
      pixelRect(-16, -22, 32, 44, kbodyClr);
      // Key rows
      pixelRect(-14, -18, 28, 8, kkeyClr);
      pixelRect(-14, -5, 28, 8, kkeyClr);
      pixelRect(-14, 8, 28, 8, kkeyClr);
      // Spacebar
      pixelRect(-12, 19, 24, 5, "#ffd15c");
      // RGB LED strip at top
      pixelRect(-16, -24, 32, 3, kv.heavy ? "#ff4040" : "#52ffe1");
      ctx.restore();

      // Fill the hit zone (subtle)
      ctx.save();
      ctx.globalAlpha = alpha * 0.08;
      ctx.fillStyle = kv.heavy ? "#ff6b6b" : "#6ea8ff";
      ctx.beginPath();
      ctx.moveTo(kv.x, kv.y);
      ctx.arc(kv.x, kv.y, kv.range, kv.angle - kv.arc / 2, kv.angle + kv.arc / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  if (!game?.swingTrails?.length) return;
  for (let i = game.swingTrails.length - 1; i >= 0; i--) {
    const t = game.swingTrails[i];
    t.life -= 0.016;
    if (t.life <= 0) { game.swingTrails.splice(i, 1); continue; }
    const alpha = t.life / t.maxLife;
    ctx.save();
    if (t.isCharge) {
      // Deadline charge line - straight line from enemy position
      ctx.globalAlpha = alpha * 0.6;
      ctx.strokeStyle = "#ffb45c";
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.lineDashOffset = -game.time * 60;
      ctx.beginPath();
      ctx.moveTo(t.x, t.y);
      ctx.lineTo(t.x + Math.cos(t.angle) * t.range, t.y + Math.sin(t.angle) * t.range);
      ctx.stroke();
      ctx.setLineDash([]);
      // Arrow head
      const hx = t.x + Math.cos(t.angle) * t.range;
      const hy = t.y + Math.sin(t.angle) * t.range;
      ctx.fillStyle = "#ffb45c";
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(hx - Math.cos(t.angle - 0.8) * 14, hy - Math.sin(t.angle - 0.8) * 14);
      ctx.lineTo(hx - Math.cos(t.angle + 0.8) * 14, hy - Math.sin(t.angle + 0.8) * 14);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      continue;
    }
    ctx.globalAlpha = alpha * 0.5;
    // Draw swing arc
    ctx.strokeStyle = t.heavy ? "#ff6b6b" : "rgba(110, 168, 255, 0.8)";
    ctx.lineWidth = t.heavy ? 5 : 3;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.range, t.angle - t.arc / 2, t.angle + t.arc / 2);
    ctx.stroke();
    // RGB glow for heavy strikes
    if (t.heavy) {
      ctx.strokeStyle = "rgba(110, 168, 255, 0.6)";
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.strokeStyle = "rgba(82, 255, 225, 0.4)";
      ctx.lineWidth = 12;
      ctx.stroke();
    }
    ctx.restore();
  }
  // Clean up old trails
  game.swingTrails = game.swingTrails.filter(function(t) { return t.life > 0; });
}

function drawShredderBlades() {
  if (!game?.weapons?.shredder || game.weapons.shredder.level <= 0) return;
  const shredTarget = nearestEnemy();
  if (!shredTarget) return;
  const p = game.player;
  const level = game.weapons.shredder.level;
  const coneAngle = (p.shredderConeAngle * Math.PI) / 180;
  const coneRange = p.shredderRange;
  const baseAngle = Math.atan2(shredTarget.y - p.y, shredTarget.x - p.x);

  ctx.save();
  // Cone fill
  ctx.globalAlpha = 0.08 + level * 0.012;
  ctx.fillStyle = "#c5d4df";
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.arc(p.x, p.y, coneRange, baseAngle - coneAngle / 2, baseAngle + coneAngle / 2);
  ctx.closePath();
  ctx.fill();
  // Cone outline
  ctx.globalAlpha = 0.22 + level * 0.03;
  ctx.strokeStyle = "#a9b8c6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(p.x, p.y, coneRange, baseAngle - coneAngle / 2, baseAngle + coneAngle / 2);
  ctx.moveTo(p.x + Math.cos(baseAngle - coneAngle / 2) * coneRange, p.y + Math.sin(baseAngle - coneAngle / 2) * coneRange);
  ctx.lineTo(p.x, p.y);
  ctx.lineTo(p.x + Math.cos(baseAngle + coneAngle / 2) * coneRange, p.y + Math.sin(baseAngle + coneAngle / 2) * coneRange);
  ctx.stroke();
  // Cross-hatch shred marks inside the cone
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = "#f4f0e8";
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i += 1) {
    const d = coneRange * (0.35 + i * 0.2);
    ctx.beginPath();
    const a1 = baseAngle - coneAngle * 0.35;
    const a2 = baseAngle + coneAngle * 0.35;
    ctx.moveTo(p.x + Math.cos(a1) * d, p.y + Math.sin(a1) * d);
    ctx.lineTo(p.x + Math.cos(a2) * d, p.y + Math.sin(a2) * d);
    ctx.stroke();
  }
  // Center shred head glow
  ctx.globalAlpha = 0.3 + Math.sin(game.time * 5) * 0.1;
  ctx.fillStyle = "#e8f0f8";
  ctx.beginPath();
  ctx.arc(p.x, p.y, 14 + level * 2, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawThermosSteam() {
  if (!game?.weapons?.thermos || game.weapons.thermos.level <= 0 || game.player.thermosTea < 50) return;
  const p = game.player;
  const radius = getThermosRadius();
  const heat = clamp((p.thermosTea - 50) / Math.max(50, p.thermosTeaMax - 50), 0, 1);
  ctx.save();
  ctx.globalAlpha = 0.08 + heat * 0.1;
  ctx.fillStyle = "#78e8c0";
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, TAU);
  ctx.fill();
  ctx.globalAlpha = 0.2 + heat * 0.16;
  ctx.strokeStyle = "#78e8c0";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 7]);
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius + Math.sin(game.time * 4) * 3, 0, TAU);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawEnemies() {
  for (const e of game.enemies) {
    drawPixelEnemy(e);
    if (e.markerP0Until && e.markerP0Until > game.time) {
      const left = clamp((e.markerP0Until - game.time) / 2.4, 0, 1);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.55 + Math.sin(game.time * 18) * 0.18;
      ctx.strokeStyle = "#66d8ff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r + 9, -Math.PI / 2, -Math.PI / 2 + TAU * left);
      ctx.stroke();
      ctx.fillStyle = "#ffd76a";
      ctx.font = "900 11px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("P0", e.x, e.y - e.r - 14);
      ctx.restore();
    }
    if (e.reportKpiUntil && e.reportKpiUntil > game.time) {
      const left = clamp((e.reportKpiUntil - game.time) / 3.2, 0, 1);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.52 + Math.sin(game.time * 12) * 0.12;
      ctx.strokeStyle = "#ffd15c";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 5]);
      ctx.beginPath();
      ctx.rect(e.x - e.r - 10, e.y - e.r - 10, (e.r + 10) * 2, (e.r + 10) * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#ffd15c";
      ctx.font = "900 10px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`KPI ${Math.round(left * 100)}%`, e.x, e.y - e.r - 18);
      ctx.restore();
    }
    if (e.auditLedger > 0) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.42 + Math.sin(game.time * 10) * 0.1;
      ctx.strokeStyle = "#52ffe1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r + 7, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = "#52ffe1";
      ctx.font = "900 10px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("账", e.x, e.y - e.r - 12);
      ctx.restore();
    }
    if (e.profitPointUntil && e.profitPointUntil > game.time) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.48 + Math.sin(game.time * 11) * 0.12;
      ctx.strokeStyle = "#ffd15c";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r + 11, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = "#ffd15c";
      ctx.font = "900 10px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("利", e.x, e.y - e.r - 12);
      ctx.restore();
    }
    if (e.staplerBindUntil && e.staplerBindUntil > game.time) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.46;
      ctx.strokeStyle = "#d7d0c2";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r + 6, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
    if (e.shortcutMark > 0 || e.coffeeAroma > 0) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.36;
      ctx.strokeStyle = e.shortcutMark > 0 ? "#65f1ff" : "#f4c95d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r + 4, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }
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

function drawWeaponFormVfx() {
  if (game.staplerAnchors?.length) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = "#d7d0c2";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#f4f0e8";
    ctx.shadowBlur = 14;
    for (let i = 0; i < game.staplerAnchors.length; i += 1) {
      const a = game.staplerAnchors[i];
      ctx.globalAlpha = Math.max(0.18, a.life / a.maxLife * 0.7);
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r + 2, 0, TAU);
      ctx.stroke();
      for (let j = i + 1; j < game.staplerAnchors.length; j += 1) {
        const b = game.staplerAnchors[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > 245 || d < 36) continue;
        ctx.globalAlpha = Math.min(0.62, Math.min(a.life / a.maxLife, b.life / b.maxLife) * 0.72);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  if (game.coffeeDrones?.length) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const drone of game.coffeeDrones) {
      const x = drone.x ?? game.player.x;
      const y = drone.y ?? game.player.y;
      const t = Math.max(0.18, drone.life / drone.maxLife);
      ctx.globalAlpha = Math.min(0.85, t);
      ctx.shadowColor = "#f4c95d";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#f4c95d";
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = "#fff1a6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 11 + Math.sin(game.time * 8 + drone.angle) * 2, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
  }
  if (game.keyboardGuardVisual) {
    const v = game.keyboardGuardVisual;
    const t = Math.max(0, v.life / v.maxLife);
    const r = v.radius * (0.82 + (1 - t) * 0.22);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = Math.min(0.78, t * 1.2);
    ctx.strokeStyle = "#8ec8ff";
    ctx.shadowColor = "#6ea8ff";
    ctx.shadowBlur = 22;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(game.player.x, game.player.y, r, 0, TAU);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 8]);
    ctx.beginPath();
    ctx.arc(game.player.x, game.player.y, r * 0.72, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
}

function drawPickups() {
  for (const pickup of game.pickups) {
    const bob = Math.sin(game.time * 7 + pickup.x * 0.01) * 2;
    if (pickup.kind === "item" && drawAtlasCell(getItemPickupAtlasIndex(pickup.item?.id), pickup.x, pickup.y + bob, 42, 42, { glow: "#52ffe1", glowBlur: 10 })) continue;
    if (pickup.kind === "heal" && drawAtlasCell(7, pickup.x, pickup.y + bob, 36, 36)) continue;
    if (pickup.kind === "material" && drawAtlasCell(5, pickup.x, pickup.y + bob, 32, 32)) continue;
    if (pickup.kind === "stat" && drawAtlasCell(13, pickup.x, pickup.y + bob, 34, 34)) continue;
    if (pickup.kind === "xp" && drawAtlasCell(6, pickup.x, pickup.y + bob, 28, 34)) continue;
    if (pickup.kind === "item") {
      pixelRect(pickup.x - 10, pickup.y - 10 + bob, 20, 20, "#151226");
      pixelRect(pickup.x - 7, pickup.y - 7 + bob, 14, 14, "#52ffe1");
      pixelRect(pickup.x - 4, pickup.y - 4 + bob, 8, 8, "#ffd15c");
    } else if (pickup.kind === "heal") {
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

function getItemPickupAtlasIndex(id) {
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
  return map[id] ?? 9;
}

function drawDamageZones() {
  const linkedSticky = game.damageZones.filter((zone) => zone.linkControl && zone.life > 0);
  if (linkedSticky.length >= 2) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.42;
    ctx.strokeStyle = "#65f1ff";
    ctx.lineWidth = 3;
    for (let i = 0; i < linkedSticky.length; i += 1) {
      for (let j = i + 1; j < linkedSticky.length; j += 1) {
        const a = linkedSticky[i];
        const b = linkedSticky[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > 210) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  for (const zone of game.damageZones) {
    const alpha = Math.max(0.08, zone.life / zone.maxLife * 0.22);
    ctx.fillStyle = zone.source === "thermos" ? `rgba(120, 232, 192, ${alpha + 0.04})`
      : zone.source === "marker_wave" ? `rgba(112, 160, 255, ${alpha + 0.03})`
      : zone.source === "marker_grid" ? `rgba(82, 255, 225, ${alpha + 0.02})`
      : zone.source === "shredder_vortex" ? `rgba(190, 220, 255, ${alpha + 0.08})`
      : zone.linkControl ? `rgba(82, 255, 225, ${alpha + 0.03})`
      : `rgba(255, 240, 122, ${alpha})`;
    ctx.beginPath();
    ctx.arc(zone.x, zone.y, zone.r, 0, TAU);
    ctx.fill();
    if (zone.source === "marker_wave" || zone.source === "marker_grid") continue;
    if (zone.source === "shredder_vortex") {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = Math.min(0.62, zone.life / zone.maxLife + 0.1);
      ctx.strokeStyle = "#c5d4ff";
      ctx.shadowColor = "#a9b8ff";
      ctx.shadowBlur = 18;
      ctx.lineWidth = 3;
      for (let i = 0; i < 4; i += 1) {
        const r = zone.r * (0.34 + i * 0.18);
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, r, game.time * 3 + i, game.time * 3 + i + Math.PI * 1.35);
        ctx.stroke();
      }
      ctx.restore();
      continue;
    }
    if (zone.source === "thermos") {
      ctx.save();
      ctx.globalAlpha = 0.32;
      ctx.strokeStyle = "#78e8c0";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(zone.x, zone.y, zone.r * 0.82, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      continue;
    }
    if (drawAtlasCell(11, zone.x, zone.y, Math.min(96, zone.r * 1.65), Math.min(96, zone.r * 1.65), { alpha: 0.9 })) continue;
    pixelRect(zone.x - 15, zone.y - 10, 30, 20, "#c7b744");
    pixelRect(zone.x - 11, zone.y - 6, 22, 12, "#fff07a");
    pixelRect(zone.x - 8, zone.y - 2, 16, 3, "#8f8432");
  }
}

function getMarkerVfxRow(style = "base", kind = "") {
  if (kind && MARKER_VFX_ROW[kind] !== undefined) return MARKER_VFX_ROW[kind];
  return MARKER_VFX_ROW[style] ?? MARKER_VFX_ROW.base;
}

function getMarkerVfxProgress(event) {
  return clamp(1 - event.life / Math.max(0.001, event.maxLife || 0.001), 0, 0.999);
}

function getMarkerVfxFrame(event, offset = 0) {
  return clamp(Math.floor(getMarkerVfxProgress(event) * MARKER_VFX_COLS) + offset, 0, MARKER_VFX_COLS - 1);
}

function drawMarkerVfxFrame(row, frame, x, y, w, h, options = {}) {
  if (!markerVfxAtlasReady || !markerVfxAtlas.naturalWidth || !markerVfxAtlas.naturalHeight) return false;
  const safeRow = clamp(Math.floor(row || 0), 0, MARKER_VFX_ROWS - 1);
  const safeFrame = clamp(Math.floor(frame || 0), 0, MARKER_VFX_COLS - 1);
  const cellW = markerVfxAtlas.naturalWidth / MARKER_VFX_COLS;
  const cellH = markerVfxAtlas.naturalHeight / MARKER_VFX_ROWS;
  const sx = safeFrame * cellW;
  const sy = safeRow * cellH;
  ctx.save();
  ctx.translate(x, y);
  if (options.rotation) ctx.rotate(options.rotation);
  if (options.scaleX || options.scaleY) ctx.scale(options.scaleX || 1, options.scaleY || 1);
  if (options.alpha !== undefined) ctx.globalAlpha *= options.alpha;
  if (options.glow) {
    ctx.shadowColor = options.glow;
    ctx.shadowBlur = options.glowBlur || 18;
  }
  ctx.drawImage(markerVfxAtlas, sx, sy, cellW, cellH, -w / 2, -h / 2, w, h);
  ctx.restore();
  return true;
}

function drawMarkerVfxCell(index, x, y, w, h, options = {}) {
  const row = Math.floor(index / MARKER_VFX_COLS);
  const frame = index % MARKER_VFX_COLS;
  return drawMarkerVfxFrame(row, frame, x, y, w, h, options);
}

function drawMarkerVfxEvents() {
  if (!game.markerVfxEvents?.length) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const event of game.markerVfxEvents) {
    const t = clamp(event.life / event.maxLife, 0, 1);
    const pop = Math.sin((1 - t) * Math.PI);
    if (event.kind === "beam") drawMarkerBeamVfx(event, t, pop);
    else if (event.kind === "strike") drawMarkerStrikeVfx(event, t, pop);
    else if (event.kind === "blast") drawMarkerBlastVfx(event, t, pop);
    else if (event.kind === "ring") drawMarkerRingVfx(event, t, pop);
    else if (event.kind === "grid") drawMarkerGridVfx(event, t, pop);
    else if (event.kind === "shield") drawMarkerShieldVfx(event, t, pop);
  }
  ctx.restore();
}

function drawMarkerBeamVfx(event, t, pop) {
  ctx.save();
  ctx.translate(event.x, event.y);
  ctx.rotate(event.angle);
  const width = Math.max(3, event.width || 6);
  const length = event.length || 280;
  const power = clamp(event.intensity || 1, 0.45, 1.8);
  ctx.globalAlpha = Math.min(1, t * 1.25);
  ctx.shadowColor = event.glowColor;
  ctx.shadowBlur = 10 + width * 1.1 + power * 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = event.glowColor;
  ctx.lineWidth = width * (2.15 + pop * 0.65) * power;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(length, 0);
  ctx.stroke();
  ctx.shadowBlur = 7 + width * 0.8;
  ctx.strokeStyle = event.color;
  ctx.lineWidth = width * (1.1 + pop * 0.3) * power;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(length, 0);
  ctx.stroke();
  ctx.shadowBlur = 8;
  ctx.strokeStyle = event.coreColor;
  ctx.lineWidth = Math.max(1.4, width * 0.32);
  ctx.beginPath();
  ctx.moveTo(4, 0);
  ctx.lineTo(length, 0);
  ctx.stroke();
  ctx.globalAlpha *= 0.66;
  ctx.strokeStyle = event.accentColor;
  ctx.lineWidth = Math.max(0.8, width * 0.16);
  const tick = Math.max(38, length / 8);
  for (let x = 18; x < length; x += tick) {
    ctx.beginPath();
    ctx.moveTo(x, -width * 1.3);
    ctx.lineTo(x + tick * 0.35, width * 1.1);
    ctx.stroke();
  }
  ctx.restore();
  const tipX = event.x + Math.cos(event.angle) * length;
  const tipY = event.y + Math.sin(event.angle) * length;
  const row = getMarkerVfxRow(event.style, event.style === "blast" ? "blast" : "split");
  const frame = getMarkerVfxFrame(event);
  const tipSize = clamp(18 + width * 4.2 + power * 12, 30, power > 1.15 ? 118 : 78);
  drawMarkerVfxFrame(row, frame, tipX, tipY, tipSize, tipSize, { alpha: 0.28 * t * power, rotation: event.angle, glow: event.glowColor });
}

function drawMarkerStrikeVfx(event, t, pop) {
  const height = event.bottom - event.top;
  const w = Math.max(5, event.width * (2.15 + pop * 0.55));
  const stampSize = clamp(54 + event.width * 7, 72, 132);
  const frame = getMarkerVfxFrame(event);
  drawMarkerVfxFrame(getMarkerVfxRow(event.style, "strike"), frame, event.x, event.bottom - 42, stampSize, stampSize * 1.18, { alpha: 0.42 * t, glow: event.glowColor, glowBlur: 16 });
  ctx.save();
  ctx.globalAlpha = t;
  ctx.shadowColor = event.glowColor;
  ctx.shadowBlur = 18;
  ctx.strokeStyle = event.glowColor;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(event.x, event.top);
  ctx.lineTo(event.x, event.bottom);
  ctx.stroke();
  ctx.shadowBlur = 18;
  ctx.strokeStyle = event.color;
  ctx.lineWidth = Math.max(3, w * 0.42);
  ctx.stroke();
  ctx.shadowBlur = 8;
  ctx.strokeStyle = event.coreColor;
  ctx.lineWidth = Math.max(1.4, w * 0.16);
  ctx.stroke();
  ctx.globalAlpha = 0.42 * t;
  ctx.strokeStyle = event.accentColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(event.x, event.bottom - 20, event.groundRadius, event.groundRadius * 0.26, 0, 0, TAU);
  ctx.stroke();
  ctx.restore();
}

function drawMarkerBlastVfx(event, t, pop) {
  const progress = getMarkerVfxProgress(event);
  const expand = 1 - Math.pow(1 - progress, 3);
  const r = event.radius * (0.32 + expand * 0.82);
  const big = event.radius > 90;
  const frame = getMarkerVfxFrame(event);
  drawMarkerVfxFrame(getMarkerVfxRow(event.style, "blast"), frame, event.x, event.y, r * 2.25, r * 2.25, { alpha: Math.min(0.95, t * 1.2), glow: event.glowColor, glowBlur: big ? 34 : 22 });
  ctx.save();
  ctx.globalAlpha = 0.52 * t * (0.55 + pop * 0.55);
  ctx.shadowColor = event.glowColor;
  ctx.shadowBlur = 30;
  const grd = ctx.createRadialGradient(event.x, event.y, 0, event.x, event.y, r);
  grd.addColorStop(0, event.coreColor);
  grd.addColorStop(0.28, event.accentColor);
  grd.addColorStop(0.62, event.color);
  grd.addColorStop(1, "rgba(40, 120, 255, 0)");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(event.x, event.y, r, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawMarkerRingVfx(event, t, pop) {
  const progress = getMarkerVfxProgress(event);
  const ease = 1 - Math.pow(1 - progress, 3);
  const start = event.startRadius || event.radius * 0.45;
  const end = event.radius + (event.growth || 0) * 0.22;
  const r = start + (end - start) * ease;
  const frame = getMarkerVfxFrame(event);
  drawMarkerVfxFrame(getMarkerVfxRow(event.style, "wave"), frame, event.x, event.y, r * 2.35, r * 2.35, { alpha: 0.38 * t, glow: event.glowColor, glowBlur: 28 });
  ctx.save();
  ctx.globalAlpha = Math.min(0.88, t * 1.15);
  ctx.shadowColor = event.glowColor;
  ctx.shadowBlur = 22;
  ctx.lineCap = "round";
  for (let i = 0; i < 3; i += 1) {
    ctx.strokeStyle = i === 0 ? event.glowColor : i === 1 ? event.color : event.coreColor;
    ctx.lineWidth = Math.max(2, (event.band || 14) * (i === 0 ? 0.9 : i === 1 ? 0.42 : 0.16));
    ctx.beginPath();
    ctx.arc(event.x, event.y, r + i * 7, 0, TAU);
    ctx.stroke();
  }
  ctx.restore();
}

function drawMarkerGridVfx(event, t, pop) {
  const spread = event.spread || 120;
  const lines = Math.max(2, event.lines || 2);
  const progress = getMarkerVfxProgress(event);
  const frame = getMarkerVfxFrame(event);
  drawMarkerVfxFrame(getMarkerVfxRow(event.style, "grid"), frame, event.x, event.y, spread * 2.25, spread * 1.55, { alpha: 0.34 * t, glow: event.glowColor, glowBlur: 26 });
  ctx.save();
  ctx.globalAlpha = Math.min(0.95, t * 1.2);
  ctx.shadowColor = event.glowColor;
  ctx.shadowBlur = 22;
  ctx.lineCap = "round";
  const visibleVertical = Math.max(1, Math.ceil(lines * clamp(progress * 1.5, 0, 1)));
  for (let i = 0; i < visibleVertical; i += 1) {
    const k = lines === 1 ? 0.5 : i / (lines - 1);
    const x = event.x + (k - 0.5) * spread * 2;
    ctx.strokeStyle = event.glowColor;
    ctx.lineWidth = Math.max(6, event.width * 2.5);
    ctx.beginPath();
    ctx.moveTo(x, event.y - spread * 0.64);
    ctx.lineTo(x, event.y + spread * 0.64);
    ctx.stroke();
    ctx.strokeStyle = event.coreColor;
    ctx.lineWidth = Math.max(2, event.width * 0.42);
    ctx.stroke();
  }
  const horizontalLines = Math.max(2, Math.ceil(lines / 2));
  const visibleHorizontal = Math.max(1, Math.ceil(horizontalLines * clamp((progress - 0.12) * 1.65, 0, 1)));
  for (let i = 0; i < visibleHorizontal; i += 1) {
    const y = event.y + (i / Math.max(1, horizontalLines - 1) - 0.5) * spread * 1.05;
    ctx.strokeStyle = event.accentColor;
    ctx.lineWidth = Math.max(5, event.width * 1.8);
    ctx.beginPath();
    ctx.moveTo(event.x - spread, y);
    ctx.lineTo(event.x + spread, y);
    ctx.stroke();
    ctx.strokeStyle = event.coreColor;
    ctx.lineWidth = Math.max(2, event.width * 0.36);
    ctx.stroke();
  }
  ctx.restore();
}

function drawMarkerShieldVfx(event, t, pop) {
  const progress = getMarkerVfxProgress(event);
  const spikePhase = Math.sin(progress * Math.PI);
  const r = event.radius * (0.72 + (1 - Math.pow(1 - progress, 2)) * 0.34 + spikePhase * 0.1);
  const frame = getMarkerVfxFrame(event);
  drawMarkerVfxFrame(getMarkerVfxRow(event.style, "shield"), frame, event.x, event.y, r * 2.45, r * 2.45, { alpha: 0.48 * t, glow: event.glowColor, glowBlur: 26 });
  ctx.save();
  ctx.globalAlpha = t * (0.52 + spikePhase * 0.48);
  ctx.shadowColor = event.glowColor;
  ctx.shadowBlur = 24;
  ctx.strokeStyle = event.color;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(event.x, event.y, r, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = event.coreColor;
  ctx.lineWidth = 2;
  for (let i = 0; i < 16; i += 1) {
    const a = (i / 16) * TAU + event.age * 3;
    ctx.beginPath();
    ctx.moveTo(event.x + Math.cos(a) * r * (0.82 + spikePhase * 0.04), event.y + Math.sin(a) * r * (0.82 + spikePhase * 0.04));
    ctx.lineTo(event.x + Math.cos(a) * r * (1.02 + spikePhase * 0.34), event.y + Math.sin(a) * r * (1.02 + spikePhase * 0.34));
    ctx.stroke();
  }
  ctx.restore();
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

function drawCombatCues() {
  if (!game.combatCues?.length) return;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 18px 'PingFang SC', 'Microsoft YaHei', ui-sans-serif, system-ui, sans-serif";
  for (const cue of game.combatCues) {
    const t = Math.max(0, cue.life / cue.maxLife);
    const rise = (1 - t) * 28;
    const scale = 1 + Math.sin((1 - t) * Math.PI) * 0.18;
    const x = Math.round(cue.x);
    const y = Math.round(cue.y - rise);
    const w = Math.max(62, ctx.measureText(cue.text).width + 22);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.globalAlpha = Math.min(1, t * 1.15);
    ctx.fillStyle = "rgba(5, 9, 16, 0.72)";
    roundRect(-w / 2, -15, w, 30, 5);
    ctx.fill();
    ctx.strokeStyle = cue.color;
    ctx.lineWidth = 2;
    roundRect(-w / 2, -15, w, 30, 5);
    ctx.stroke();
    ctx.shadowColor = cue.color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = cue.color;
    ctx.fillText(cue.text, 0, 1);
    ctx.restore();
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
    if (part.source === "marker" && (part.kind === "beam" || part.kind === "line")) continue;
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

function addCombatCue(key, text, x, y, color, opts = {}) {
  if (!game || !text) return;
  if (!game.combatCueCooldowns) game.combatCueCooldowns = {};
  if (game.combatCueCooldowns[key] > 0) return;
  const cooldown = opts.cooldown ?? 0.45;
  game.combatCueCooldowns[key] = cooldown;
  if (!game.combatCues) game.combatCues = [];
  const cue = {
    key,
    text,
    x,
    y,
    color,
    life: opts.life ?? 0.95,
    maxLife: opts.life ?? 0.95,
  };
  game.combatCues.push(cue);
  if (game.combatCues.length > 8) game.combatCues.splice(0, game.combatCues.length - 8);
  if (opts.pulseRadius) pulse(x, y, opts.pulseRadius, color);
  if (opts.shake) game.screenShake = Math.max(game.screenShake || 0, opts.shake);
  game._combatFeedHadItems = true;
  updateCombatEffectFeed();
}

function updateCombatEffectFeed() {
  if (typeof document === "undefined") return;
  let feed = document.querySelector("#combatEffectFeed");
  if (!game || state !== "playing" || !game.combatCues?.length) {
    if (feed) feed.classList.add("hidden");
    return;
  }
  if (!feed) {
    feed = document.createElement("div");
    feed.id = "combatEffectFeed";
    feed.className = "combat-effect-feed hidden";
    document.querySelector(".game-wrap")?.append(feed);
  }
  const recent = game.combatCues.slice(-3).reverse();
  feed.innerHTML = recent.map(cue => `<span style="--cue:${cue.color}">${escHtml(cue.text)}</span>`).join("");
  feed.classList.remove("hidden");
  game._combatFeedHadItems = true;
}

function getParticleBudgetScale() {
  if (!game) return 1;
  const highPressure = game.stage >= 7 && game.stage <= 10;
  const count = game.particles?.length || 0;
  if (count > 220) return 0.25;
  if (count > 160 || highPressure) return 0.55;
  return 1;
}

function addParticle(particle) {
  if (!game?.particles) return;
  const hardCap = game.stage >= 7 && game.stage <= 10 ? 240 : 320;
  if (game.particles.length >= hardCap && Math.random() < 0.65) return;
  game.particles.push(particle);
}

function pulse(x, y, radius, color) {
  const count = Math.max(6, Math.round(18 * getParticleBudgetScale()));
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * TAU;
    addParticle({
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
  const capped = Math.max(1, Math.round(count * getParticleBudgetScale()));
  for (let i = 0; i < capped; i += 1) {
    const angle = Math.random() * TAU;
    const speed = 40 + Math.random() * 130;
    const life = 0.24 + Math.random() * 0.34;
    addParticle({
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
  const remaining = game.endless ? "?" : game.enemies.length + game.enemiesToSpawn;
  const timeText = game.endless
    ? formatTime(game.overtimeTimer)
    : state === "recovery"
    ? `${Math.max(0, Math.ceil(game.recoveryTime))}s`
    : formatTime(Math.max(0, game.stageConfig.duration - game.waveTime));
  if (state === "recovery") {
    ui.time.textContent = timeText;
    ui.stage.textContent = "Stage " + game.stage + " / recovery";
  } else if (game.endless) {
    ui.time.textContent = timeText;
    ui.stage.textContent = `鍔犵彮 ${game.overtimeLevel + 1}`;
  } else {
    ui.time.textContent = timeText;
    ui.stage.textContent = "Stage " + game.stage + " / " + game.stageConfig.name;
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
  updateWarmupOverlay();
  updateV03Hud();
}

function updateGuideOverlay() {
  if (!ui.guideOverlay || !game) return;
  const show = state === "playing" && game.stage === 1 && game.waveTime < STAGE_ONE_WARMUP_SECONDS;
  ui.guideOverlay.classList.toggle("hidden", !show);
  if (show) ui.guideOverlay.textContent = "热身 " + Math.max(0, Math.ceil(STAGE_ONE_WARMUP_SECONDS - game.waveTime)) + "s / WASD 移动 / 自动攻击";
}

function updateWarmupOverlay() {
  if (!ui.warmupOverlay) return;
  const inWarmup = state === "playing" && game && game.stage === 1 && game.waveTime < STAGE_ONE_WARMUP_SECONDS;
  // 第一关热身只保留右下角 guideOverlay。大遮罩会挡住角色，玩家会误以为不能操作。
  ui.warmupOverlay.classList.add("hidden");
  if (!inWarmup) return;
  const remaining = Math.max(0, STAGE_ONE_WARMUP_SECONDS - game.waveTime);
  const pct = Math.min(100, (1 - remaining / STAGE_ONE_WARMUP_SECONDS) * 100);
  ui.warmupFill.style.width = pct + "%";
  ui.warmupTimer.textContent = Math.ceil(remaining) + "s";
  if (remaining > 12) {
    ui.warmupEmoji.textContent = "ID";
    ui.warmupTitle.textContent = "入职准备中";
    ui.warmupHint.textContent = "WASD 移动 / 熟悉走位";
  } else if (remaining > 6) {
    ui.warmupEmoji.textContent = "AUTO";
    ui.warmupTitle.textContent = "武器自动攻击";
    ui.warmupHint.textContent = getActiveWeaponCombatHint("warmup");
  } else {
    ui.warmupEmoji.textContent = "GO";
    ui.warmupTitle.textContent = "第一波即将进入";
    ui.warmupHint.textContent = getActiveWeaponCombatHint("go");
  }
}

function updateObjectiveHud(timeText, remaining) {
  ui.objectiveHud?.classList.toggle("banner-active", ui.stageBanner && !ui.stageBanner.classList.contains("hidden"));
  ui.objectiveStageMeta.textContent = game.endless
    ? "\u52a0\u73ed " + (game.overtimeLevel + 1)
    : state === "recovery" ? "\u7b2c " + game.stage + " \u5173 / \u7ed3\u7b97" : "\u7b2c " + game.stage + " \u5173";
  ui.objectiveStageName.textContent = game.endless ? "\u52a0\u73ed" : state === "recovery" ? "\u7ed3\u7b97" : game.stageConfig.name;
  ui.objectiveTime.textContent = game.endless ? "\u4f11\u606f " + Math.max(0, Math.ceil(game.overtimeBreakTimer)) + "s" : timeText;
  ui.objectiveRemaining.textContent = remaining;
  ui.objectiveKills.textContent = game.endless ? String(game.stageKills) : game.stageKills + "/" + game.stageConfig.totalEnemies;
  const alert = getObjectiveAlert(remaining);
  ui.objectiveAlert.textContent = alert.text;
  ui.objectiveAlert.classList.toggle("boss", alert.boss);
}

function getObjectiveAlert(remaining) {
  if (game.endless) return { text: "\u52a0\u73ed\u538b\u529b\uff1a\u6491\u5230\u4e0b\u4e00\u6b21\u4f11\u606f " + Math.max(0, Math.ceil(game.overtimeBreakTimer)) + "s", boss: game.overtimeLevel >= 3 };
  if (state === "recovery") return { text: "\u7ed3\u7b97\u4e2d\uff1a\u5148\u6361\u6750\u6599\uff0c\u518d\u8fdb\u5165\u4e0b\u4e00\u6b65\u3002", boss: false };
  if (game.stage >= game.maxStage) return { text: "Boss \u5173\uff1a\u7559\u51fa\u8d70\u4f4d\u7a7a\u95f4\uff0c\u5148\u6e05\u53ec\u5524\u7269\u3002", boss: true };
  if (game.stage === 1 && game.waveTime < STAGE_ONE_WARMUP_SECONDS) return { text: "\u70ed\u8eab\uff1a\u5148\u79fb\u52a8\u548c\u62c9\u76f4\u7ebf\uff0c\u7b2c\u4e00\u6ce2\u7a0d\u540e\u5f00\u59cb\u3002", boss: false };
  if (isOnboardingTrialActive()) return { text: "\u89c2\u5bdf\u65b0\u69fd\u4f4d\u5982\u4f55\u6539\u53d8\u653b\u51fb\u3002", boss: false };
  if (remaining <= 5) return { text: "\u5feb\u6e05\u5b8c\u4e86\u3002", boss: false };
  return { text: getActiveWeaponCombatHint("objective"), boss: false };
}

function getActiveWeaponCombatHint(mode = "objective") {
  const id = getActiveWeaponId();
  const hints = {
    marker: { warmup: "先移动，把敌人拉成直线", go: "贯穿光线需要排线清怪", objective: "拉开距离，让光线穿过一排敌人。" },
    thermos: { warmup: "移动别太急，观察热量节奏", go: "等热量成型，再找窗口释放", objective: "围绕热量窗口走位，攒满后打爆发。" },
    sticky_note: { warmup: "提前铺贴纸，别等怪贴脸", go: "把敌人引进贴纸区域", objective: "绕着贴纸区走，让敌人踩进陷阱。" },
    coffee: { warmup: "保持移动，让自动弹持续命中", go: "高频命中会更快启动续杯", objective: "边走边保持命中频率，先清近处小怪。" },
    keyboard: { warmup: "贴脸前留出反打空间", go: "用击退处理第一波包围", objective: "靠近挥击后立刻拉开，用击退解围。" },
    stapler: { warmup: "面向怪群入口，封住正面", go: "扇形钉幕适合堵住一侧", objective: "调整朝向，让钉幕覆盖怪群入口。" },
    headphones: { warmup: "绕圈让敌人进入声场", go: "声场吃站位，不要直线硬跑", objective: "贴边绕圈，把敌人拖进声场持续受伤。" },
    report: { warmup: "贴边绕圈，用报表轨道刮怪", go: "别让轨道空转，贴近后撤", objective: "控制距离，让旋转报表持续切到敌人。" },
    shredder: { warmup: "面对怪群，别让敌人绕背", go: "锥形粉碎需要朝向管理", objective: "保持正面对准怪群，用锥形区域持续粉碎。" },
    calculator: { warmup: "把敌人拉成能跳点的间距", go: "数字弹适合分散但相邻的敌群", objective: "保持敌人有间距，让数字弹连续跳点。" },
  };
  return hints[id]?.[mode] || "观察武器攻击节奏，围绕它的命中方式走位。";
}

function getBuildPressureHint() {
  if (game.waveTime < 12 || game.stage < 5) return "";
  const owned = getOwnedWeaponCount();
  const topCount = Math.max(0, ...Object.values(getWeaponClassCounts()));
  if (owned >= 4 && topCount < 3 && Math.floor(game.waveTime) % 17 < 4) return "\u6b66\u5668\u592a\u5206\u6563\uff1a\u4e0b\u4e00\u6b21\u5de5\u574a\u4f18\u5148\u5f3a\u5316\u4e3b\u6b66\u5668\u5f62\u6001\u3002";
  const maxWeaponLevel = Math.max(0, ...buildOrder.map((id) => game.weapons?.[id]?.level || 0));
  if (game.stage >= 7 && maxWeaponLevel < 4 && Math.floor(game.waveTime) % 19 < 4) return "\u4e3b\u6b66\u5668\u7b49\u7ea7\u504f\u4f4e\uff1a\u6750\u6599\u4f18\u5148\u82b1\u5728\u5f53\u524d\u4e3b\u5f62\u6001\u3002";
  if (((game.weapons.headset?.level || 0) > 0 || (game.weapons.report?.level || 0) > 0) && Math.floor(game.waveTime) % 23 < 4) return "\u6709\u7ad9\u573a\u6280\u80fd\uff1a\u7ed5\u7740\u5b89\u5168\u533a\u57df\u6253\uff0c\u4e0d\u8981\u76f4\u7ebf\u786c\u5403\u3002";
  return "";
}

function getStageThreatText() {
  if (!game) return "";
  if (game.currentIncident?.title) return game.currentIncident.title;
  const stage = game.stage || 1;
  const form = getActiveWeaponForm(window.CS?.buildState?.weapons?.[0] || pendingStartWeapon || "marker");
  const formName = form?.displayName || "\u4e3b\u6b66\u5668\u5f62\u6001";
  if (stage <= 1) return "\u70ed\u8eab\uff1a\u7528\u8d70\u4f4d\u628a\u602a\u62c9\u6210\u76f4\u7ebf\uff0c\u8ba9\u8d2f\u7a7f\u6fc0\u5149\u6253\u6ee1\u3002";
  if (stage <= 3) return "\u89c2\u5bdf\u6b66\u5668\u57fa\u7840\u52a8\u8bcd\uff1a\u5b83\u662f\u76f4\u7ebf\u3001\u8303\u56f4\u3001\u8fd8\u662f\u5f39\u5e55\u3002";
  if (stage <= 8) return "\u5de5\u724c\u5f62\u6001\u751f\u6548\uff1a\u73b0\u5728\u770b " + formName + " \u600e\u4e48\u6539\u53d8\u6e05\u602a\u624b\u611f\u3002";
  if (stage <= 12) return "\u8f6c\u6b63\u5f3a\u5316\uff1a\u4f18\u5148\u628a\u4e3b\u5f62\u6001\u7684\u6570\u91cf\u3001\u8303\u56f4\u6216\u9891\u7387\u505a\u539a\u3002";
  if (stage <= 16) return "\u8de8\u90e8\u95e8\u534f\u4f5c\uff1a\u7b2c\u4e8c\u5f62\u6001\u53ea\u662f\u8865\u77ed\u677f\uff0c\u4e0d\u8981\u62a2\u4e3b\u6b66\u5668\u8282\u594f\u3002";
  return "\u8de8\u6280\u80fd\u5b66\u4e60\uff1a\u526f\u6280\u80fd\u670d\u52a1\u4e3b\u5f62\u6001\uff0c\u7528\u6765\u8865\u751f\u5b58\u6216\u6e05\u573a\u7f3a\u53e3\u3002";
}

function showStageBanner() {
  const isBoss = game.endless || game.stage >= game.maxStage || game.stageConfig.eliteTotal >= 3;
  ui.stageBannerMeta.textContent = game.endless ? "\u52a0\u73ed" : "\u7b2c " + game.stage + " \u5173 / " + (game.stageConfig.phaseName || "");
  ui.stageBannerTitle.textContent = game.endless ? "\u52a0\u73ed " + (game.overtimeLevel + 1) : game.stageConfig.name;
  const incident = game.currentIncident ? game.currentIncident.title : "";
  const threat = getStageThreatText();
  const stageBriefs = [
    "\u7ec3\u4e60\u8d70\u4f4d\uff0c\u628a\u654c\u4eba\u62c9\u6210\u76f4\u7ebf\u3002",
    "\u770b\u6e05\u5de5\u724c\u5f62\u6001\u7684\u7b2c\u4e00\u79cd\u653b\u51fb\u53cd\u9988\u3002",
    "\u7528\u5361\u69fd\u5f3a\u5316\u4e3b\u6b66\u5668\u5f62\u6001\u3002",
    "\u5f00\u59cb\u5904\u7406\u7cbe\u82f1\u548c\u602a\u7fa4\u538b\u529b\u3002",
    "\u9a8c\u8bc1\u5f53\u524d Build \u80fd\u4e0d\u80fd\u7a33\u5b9a\u6e05\u573a\u3002"
  ];
  const brief = game.endless ? "\u6491\u4f4f\u538b\u529b\uff0c\u7b49\u4e0b\u4e00\u6b21\u4f11\u606f\u3002" : (stageBriefs[Math.min(stageBriefs.length - 1, game.stage - 1)] || "\u6e05\u602a\u5e76\u4fdd\u6301\u7a7a\u95f4\u3002");
  ui.stageBannerText.textContent = incident ? incident + " / " + threat : threat || brief;
  ui.stageBanner.classList.toggle("boss", isBoss);
  ui.stageBanner.classList.remove("hidden");
  window.clearTimeout(showStageBanner.timer);
  showStageBanner.timer = window.setTimeout(() => ui.stageBanner.classList.add("hidden"), isBoss ? 2600 : 1900);
}

function showPhaseBanner(phaseId) {
  const phaseConfig = {
    onboarding: { meta: "\u5165\u804c\u671f", title: "\u6b66\u5668\u8bd5\u8fd0\u884c", text: "\u5148\u719f\u6089\u57fa\u7840\u6b66\u5668\u3002\u4e0b\u4e00\u6b65\u5de5\u724c\u4f1a\u628a\u5b83\u6539\u9020\u6210\u4e0d\u540c\u653b\u51fb\u5f62\u6001\u3002", cls: "" },
    probation: { meta: "\u8bd5\u7528\u671f", title: "\u5de5\u724c\u5f62\u6001\u4e0a\u7ebf", text: "\u4ece\u73b0\u5728\u5f00\u59cb\uff0c\u5361\u69fd\u56f4\u7ed5\u5f53\u524d\u6b66\u5668\u5f62\u6001\u505a\u5f3a\u5316\u3002", cls: "" },
    regularization: { meta: "\u8f6c\u6b63\u671f", title: "\u4e3b\u5f62\u6001\u5347\u7ea7", text: "\u4e3b\u6d41\u6d3e\u8fdb\u5165\u5f3a\u5316\u7248\uff0c\u89c2\u5bdf\u6218\u6597\u753b\u9762\u91cc\u7684\u53d8\u5316\u3002", cls: "boss" },
    senior: { meta: "\u8001\u5458\u5de5", title: "\u534f\u4f5c\u89e3\u9501", text: "\u8de8\u90e8\u95e8\u548c\u8f85\u52a9\u6280\u80fd\u4f1a\u8865\u8db3\u4e3b\u5f62\u6001\u77ed\u677f\u3002", cls: "boss" },
    boss: { meta: "\u7ec8\u5c40\u8bc4\u5ba1", title: "\u5b8c\u6574 Build \u9a8c\u8bc1", text: "\u628a\u4e3b\u5f62\u6001\u3001\u5361\u69fd\u548c\u526f\u7ebf\u8d44\u6e90\u90fd\u7528\u8d77\u6765\u3002", cls: "boss" }
  };
  const cfg = phaseConfig[phaseId] || { meta: "\u65b0\u9636\u6bb5", title: "\u9636\u6bb5\u5207\u6362", text: "\u538b\u529b\u5347\u7ea7\u3002", cls: "" };
  ui.stageBannerMeta.textContent = cfg.meta;
  ui.stageBannerTitle.textContent = cfg.title;
  ui.stageBannerText.textContent = cfg.text;
  ui.stageBanner.className = "stage-banner " + cfg.cls;
  ui.stageBanner.classList.remove("hidden");
  window.clearTimeout(showStageBanner.timer);
  showStageBanner.timer = window.setTimeout(function() {
    ui.stageBanner.classList.add("hidden");
  }, cfg.cls === "boss" ? 3600 : 2600);
}

function showLv5Milestone() {
  if (!ui.fusionNotice) return;
  ui.fusionNoticeMeta.textContent = "Lv.5";
  ui.fusionNoticeTitle.textContent = "\u673a\u5236\u69fd\u5f00\u653e";
  ui.fusionNoticeText.textContent = "\u7b2c 4 \u4e2a\u69fd\u4f4d\u5df2\u5f00\u653e\u3002\u5b83\u4f1a\u6539\u53d8\u5f53\u524d\u6b66\u5668\u5f62\u6001\u89c4\u5219\uff0c\u4e0d\u53ea\u662f\u52a0\u6570\u503c\u3002";
  ui.fusionNotice.classList.remove("hidden");
  window.clearTimeout(maybeShowFusionHint.timer);
  maybeShowFusionHint.timer = window.setTimeout(function() {
    ui.fusionNotice.classList.add("hidden");
  }, 3600);
  if (CS.buildState && CS.buildState.unlockSlot4) CS.buildState.unlockSlot4();
}

function showLv10Milestone() {
  if (!ui.fusionNotice) return;
  ui.fusionNoticeMeta.textContent = "Lv.10";
  ui.fusionNoticeTitle.textContent = "\u4ee3\u4ef7\u69fd\u5f00\u653e";
  ui.fusionNoticeText.textContent = "\u7b2c 5 \u4e2a\u69fd\u4f4d\u5df2\u5f00\u653e\u3002\u9ad8\u98ce\u9669\u5f3a\u5316\u4f1a\u5927\u5e45\u6539\u9020\u4e3b\u5f62\u6001\u3002";
  ui.fusionNotice.classList.remove("hidden");
  window.clearTimeout(maybeShowFusionHint.timer);
  maybeShowFusionHint.timer = window.setTimeout(function() {
    ui.fusionNotice.classList.add("hidden");
  }, 3600);
  if (CS.buildState && CS.buildState.unlockSlot5) CS.buildState.unlockSlot5();
}

function showCollabQuestPanel(quest) {
  if (!ui.collabPanel || !quest) return;
  ui.collabNarrative.textContent = quest.narrative || "\u8de8\u90e8\u95e8\u4efb\u52a1\u51fa\u73b0\u3002";
  const deptText = (quest.requires?.depts || []).map(function(d) {
    return CS.departments && CS.departments[d] ? CS.departments[d].emoji + " " + CS.departments[d].name : d;
  }).join(" + ");
  ui.collabRequirement.textContent = "\u9700\u6c42\uff1a" + deptText + " x" + (quest.requires?.minEach || 1);
  ui.collabReward.textContent = "Reward: " + (quest.reward && quest.reward.desc || "none");
  ui.collabPanel.classList.remove("hidden");
  if (ui.collabAccept) {
    ui.collabAccept.onclick = function() {
      if (CS.buildState && CS.buildState.completeCollabQuest) {
        var result = CS.buildState.completeCollabQuest(true);
        if (result) floatingText(game.player.x, game.player.y - 30, "Collab complete: " + result.reward.desc, "#52ffe1");
      }
      ui.collabPanel.classList.add("hidden");
    };
  }
  if (ui.collabDecline) {
    ui.collabDecline.onclick = function() {
      if (CS.buildState && CS.buildState.completeCollabQuest) CS.buildState.completeCollabQuest(false);
      ui.collabPanel.classList.add("hidden");
    };
  }
}

function updateBuildHud() {
  const activeId = getActiveWeaponId();
  const topWeapon = game.weapons[activeId] || game.weapons.marker;
  const owned = getOwnedWeaponCount();
  const summary = getBuildSummary(topWeapon, owned);
  const routeSignature = getRouteProgressList().map((route) => `${route.id}:${route.tier}:${route.score}`).join(",");
  const form = getActiveWeaponForm(activeId);
  const slotSig = Object.entries(CS.buildState?.slotCards || {}).map(([k,v]) => `${k}:${v || ""}`).join(",");
  const signature = `${summary}:${form?.formId || ""}:${slotSig}:${buildOrder.map((id) => game.weapons?.[id]?.level || 0).join(",")}:${routeSignature}`;
  if (signature === buildHudSignature) return;
  buildHudSignature = signature;
  renderBuildHud(game.weapons, summary);
  renderRouteMap(ui.routeMap, { compact: true });
  renderEvolutionProgress();
}

function renderEvolutionProgress() {
  if (!ui.evoProgressList) return;
  var rows = [];
  var ownedCount = 0;
  var totalReady = 0;
  for (var i = 0; i < buildOrder.length; i++) {
    var wid = buildOrder[i];
    var weapon = game.weapons[wid];
    if (!weapon || weapon.level <= 0) continue;
    if (weapon.level >= 7) { ownedCount++; continue; }
    ownedCount++;
    var routes = CS.weapons[wid] && CS.weapons[wid].evolutionRoutes;
    if (!routes || !routes.length) continue;
    // Find best non-default evolution (priority < 99)
    var best = null;
    for (var j = 0; j < routes.length; j++) {
      var r = routes[j];
      if (r.priority >= 99) continue;
      if (!CS.buildState._checkEvolutionCondition(r.condition)) continue;
      best = r;
      break; // First matching = highest priority
    }
    if (!best) {
      // Show default evolution as fallback
      for (var k = 0; k < routes.length; k++) {
        if (routes[k].priority >= 99) { best = routes[k]; break; }
      }
    }
    if (!best) continue;
    // Calculate progress: weapon level / 7
    var pct = Math.min(100, Math.round((weapon.level / 7) * 100));
    var cls = pct >= 100 ? 'done' : pct >= 70 ? 'near' : pct >= 40 ? 'half' : 'far';
    var ready = weapon.level >= 7;
    if (ready) totalReady++;
    rows.push({
      emoji: weapon.emoji || '',
      name: weapon.label || wid,
      evoName: best.name,
      pct: pct,
      cls: cls,
      ready: ready,
      level: weapon.level
    });
  }
  ui.evoSummary.textContent = totalReady + '/' + ownedCount;
  ui.evoProgressList.replaceChildren();
  for (var r = 0; r < rows.length; r++) {
    var row = rows[r];
    var div = document.createElement('div');
    div.className = 'evo-progress-row';
    div.innerHTML = [
      '<span class="evo-progress-weapon">' + row.emoji + ' ' + row.name + '</span>',
      '<span class="evo-progress-name">→ ' + row.evoName + '</span>',
      '<div class="evo-progress-bar-wrap"><div class="evo-progress-fill ' + row.cls + '" style="width:' + row.pct + '%"></div></div>',
      '<span class="evo-progress-pct' + (row.ready ? ' ready' : '') + '">' + (row.ready ? '✓ Lv.7' : 'Lv.' + row.level) + '</span>'
    ].join('');
    ui.evoProgressList.append(div);
  }
}

function getBuildSummary(topWeapon, owned) {
  const activeId = getActiveWeaponId();
  const activeWeapon = game?.weapons?.[activeId] || topWeapon;
  const form = getActiveWeaponForm(activeId);
  const level = activeWeapon?.level || 1;
  return activeWeapon && activeWeapon.level > 0
    ? `${activeWeapon.label || activeWeapon.name || activeId} Lv.${level} · ${form?.displayName || "基础形态"}`
    : `主武器 ${owned}/${game.weaponSlots}`;
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

function getEntryWeaponForm(entry) {
  const weaponId = getUpgradeWeaponId(entry?.id);
  const activeId = getActiveWeaponId();
  const canonical = canonicalWeaponId(weaponId || activeId);
  return getWeaponBadgeForm(canonical, CS.buildState?.badgeDept);
}

function formatEntryTag(entry) {
  const weaponId = getUpgradeWeaponId(entry.id);
  if (!weaponId) return `${getItemRarityLabel(entry)} / ${entry.tag || "\u9053\u5177"}`;
  const form = getEntryWeaponForm(entry);
  const hooks = (form?.scalingHooks || []).slice(0, 2).join("/");
  return form ? `${form.displayName}${hooks ? " / " + hooks : ""}` : (entry.tag || "\u6b66\u5668\u5f3a\u5316");
}

function renderRouteMap(target, opts = {}) {
  if (!target || !game) return;
  target.innerHTML = "";
  const activeId = getActiveWeaponId();
  const weapon = game.weapons[activeId] || game.weapons[legacyWeaponId(activeId)];
  const form = getActiveWeaponForm(activeId);
  if (!weapon || !form) {
    target.classList.add("hidden");
    return;
  }
  const params = getActiveFormParams(activeId, weapon.level || 1);
  const metrics = calcGenericFormPreviewMetrics(params, form).slice(0, opts.compact ? 3 : 5);
  const slots = ["offense", "survival", "resource", "mechanic", "cost"].map((slotId) => {
    const cardId = CS.buildState?.slotCards?.[slotId];
    const augments = CS.buildState?.slotAugments?.[slotId] || [];
    const unlocked = isBuildSlotUnlocked(slotId);
    const label = SLOT_META[slotId]?.plain || slotId;
    const card = cardId ? CS.cards?.[cardId] : null;
    const text = card ? card.name : (unlocked ? "空" : "未开放");
    const cls = card ? "filled" : unlocked ? "empty" : "locked";
    const stack = augments.length ? ` +${augments.length}` : "";
    return `<span class="form-slot-pill ${cls}"><b>${escHtml(label)}</b>${escHtml(text)}${stack}</span>`;
  }).join("");
  target.innerHTML = `
    <div class="route-card form-route-card dominant-route">
      <div class="route-head">
        <strong>${escHtml(form.displayName)}</strong>
        <span class="route-eff-badge">${escHtml(form.mechanicType || "form")}</span>
      </div>
      <p class="form-route-verb">${escHtml(form.combatVerb || "当前主武器形态")}</p>
      <div class="form-route-metrics">
        ${metrics.map(row => `<span><i>${escHtml(row.label)}</i><b>${escHtml(String(row.value))}</b></span>`).join("")}
      </div>
      <div class="form-slot-line">${slots}</div>
    </div>
  `;
  target.classList.remove("hidden");
}

function renderBuildHud(weapons, summary) {
  ui.buildSummary.textContent = summary;
  const activeId = window.CS?.buildState?.weapons?.[0] || pendingStartWeapon || "marker";
  const weaponRows = buildOrder
    .filter((id) => id === activeId || (weapons[id]?.level || 0) > 0)
    .map((id) => {
      const weapon = weapons[id];
      if (!weapon) return null;
      const row = document.createElement("div");
      row.className = "build-row";
      row.innerHTML = `
        <span class="build-dot ${getWeaponIconClass(id)}"></span>
        <span>${weapon.label}</span>
        <strong>Lv.${weapon.level}</strong>
      `;
      return row;
    }).filter(Boolean);
  const resonanceRows = (typeof game !== "undefined" && game) ? getClassResonanceRows().map((entry) => {
    const row = document.createElement("div");
    row.className = "build-row resonance-row";
    row.innerHTML = `
      <span class="build-dot resonance-dot"></span>
      <span>${entry.label} x${entry.count}</span>
      <strong>${entry.text}</strong>
    `;
    return row;
  }) : [];
  ui.buildList.replaceChildren(...weaponRows, ...resonanceRows);
}

function getClassResonanceRows() {
  const counts = getWeaponClassCounts();
  const rows = Object.entries(counts)
    .filter(([className, count]) => {
      const first = (weaponClassBonuses[className] || [])[0] || { count: 2 };
      return count >= Math.min(2, getClassTierThreshold(first));
    })
    .sort((a, b) => b[1] - a[1])
    .map(([className, count]) => {
      const tiers = weaponClassBonuses[className] || [];
      let active = null;
      for (const tier of tiers) {
        if (count >= getClassTierThreshold(tier)) active = tier;
      }
      return {
        label: weaponClassLabels[className] || className,
        count,
        text: active ? formatClassBonus(active) : "need more",
      };
    });
  const hybrid = getHybridBonus();
  if (hybrid.active) rows.unshift({ label: hybrid.label, count: Object.keys(counts).length, text: hybrid.text });
  return rows;
}

function updateStatHud() {
  const p = game.player;
  const values = {
    hp: Math.max(0, Math.ceil(p.hp)) + "/" + p.maxHp,
    armor: Math.round(p.armor),
    dodge: Math.round(p.dodge) + "%",
    speed: Math.round(p.speed),
    attackSpeed: Math.round(getEffectiveStat("attackSpeed")) + "%",
    damageMult: Math.round(getDamageMult() * 100) + "%",
    crit: Math.round(p.crit + getClassBonus("crit")) + "%",
    range: Math.round(p.range + getClassBonus("range")),
    luck: Math.round(p.luck + getClassBonus("luck")),
    pickupRange: Math.round(p.pickupRange + getClassBonus("pickupRange")),
    regen: Math.round(p.regen) + "/s",
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
  const maxItems = (typeof game !== "undefined" && game && Number.isFinite(game.itemSlots)) ? game.itemSlots : 6;
  ui.itemSummary.textContent = (typeof game !== "undefined" && game) ? `${names.length}/${maxItems}` : names.length;
  ui.itemList.replaceChildren(
    ...(names.length ? names.slice(-4).map((name) => {
      const pill = document.createElement("span");
      pill.className = "item-pill";
      pill.textContent = name;
      return pill;
    }) : [createEmptyItemPill()]),
  );
}

function createEmptyItemPillLegacy() {
  const pill = document.createElement("span");
  pill.className = "item-pill empty";
  pill.textContent = "鏆傛棤";
  return pill;
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
  return items;
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
  // 璋冭瘯: 鎸?` 璺戝叏 Build 鑷姩鍖栨祴璇?(涓嶅彈娴忚鍣ㄥ揩鎹烽敭骞叉壈)
  if ((event.key === "`" || event.key === "F8") && game) {
    event.preventDefault();
    game.paused = true;
    try {
      const res = window._testAllBuilds();
      let msg = '=== ' + res.length + ' Builds Tested ===\n';
      for (let i = 0; i < res.length; i++) {
        const x = res[i];
        const clearedIcon = x.clearedAll ? '[OK]' : '[FAIL]';
        const runMaxStage = x.maxStage || MAX_STAGE;
        const clearedText = x.clearedAll ? (runMaxStage + '/' + runMaxStage) : ('died stage ' + x.deathStage);
        msg += (i + 1) + '. ' + clearedIcon + ' ' + x.name + ' ' + clearedText + ' | slots:' + x.slots + '/5 | dept:' + x.deptSyns + ' | attr:' + x.attrSyns + ' | milestones:' + x.milestones + '\n';
      }
      console.log(msg);
      // DOM杈撳嚭
      var panel = document.getElementById('test-results-panel');
      if (!panel) {
        panel = document.createElement('div');
        panel.id = 'test-results-panel';
        panel.style.cssText = 'position:fixed;top:10px;left:10px;right:10px;bottom:10px;background:rgba(0,0,0,0.95);color:#0f0;z-index:99999;overflow-y:auto;padding:20px;font:14px monospace;white-space:pre-wrap;border:2px solid #0f0;border-radius:8px;';
        document.body.appendChild(panel);
        panel.onclick = function() { panel.remove(); };
      }
      panel.textContent = msg + '\n(click to close)';
    } catch(e) {
      console.error('Test error:', e);
      alert('Test error: ' + e.message);
    }
    return;
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
  ensureGameLoop("resume");
}

function abandonRunToMenu() {
  _stopGameClock();
  state = "menu";
  pausedFromState = "playing";
  game = null;
  keys.clear();
  pointer.active = false;
  ui.pausePanel.classList.add("hidden");
  ui.weaponPanel.classList.add("hidden");
  ui.upgradePanel.classList.add("hidden");
  ui.resultPanel.classList.add("hidden");
  ui.perkPanel?.classList.add("hidden");
  ui.itemReplacePanel?.classList.add("hidden");
  ui.fusionNotice?.classList.add("hidden");
  ui.policyPanel?.classList.add("hidden");
  ui.startButton?.classList.remove("hidden");
  ui.endlessButton?.classList.add("hidden");
  ui.startPanel.classList.remove("hidden");
  updateStartActions();
  pendingPolicy = null;
  policySelectionOpen = false;
  buildHudSignature = "";
  statHudSignature = "";
  itemHudSignature = "";
  renderBuildHud(weaponDefinitions, "挂耳咖啡 Lv.1 / 1/6");
  renderItemHud([]);
  drawMenuBackground();
}

function renderPauseSheet() {
  const values = getPauseStatValues();
  const activeId = getActiveWeaponId();
  const activeWeapon = game.weapons[activeId] || game.weapons[legacyWeaponId(activeId)];
  const activeForm = getActiveWeaponForm(activeId);
  const params = getActiveFormParams(activeId, activeWeapon?.level || 1);
  const metrics = calcGenericFormPreviewMetrics(params, activeForm).slice(0, 4)
    .map((row) => `<span><b>${escHtml(row.label)}</b>${escHtml(String(row.value))}</span>`).join("");
  const weapons = buildOrder.map((id) => {
    const weapon = game.weapons[id];
    if (weapon.level <= 0) return "";
    const form = id === activeId ? activeForm : getWeaponBadgeForm(id, CS.buildState?.badgeDept);
    return `<span><b>${escHtml(weapon.label)}</b>Lv.${weapon.level}/${weapon.max} · ${escHtml(form?.displayName || "基础形态")}</span>`;
  }).filter(Boolean).join("");
  const statRows = statLabels.map(({ key, label }) => `<span><b>${label}</b>${values[key]}</span>`).join("");
  const slotRows = ["offense", "survival", "resource", "mechanic", "cost"].map((slotId) => {
    const cardId = CS.buildState?.slotCards?.[slotId];
    const label = SLOT_META[slotId]?.plain || slotId;
    const card = cardId ? CS.cards?.[cardId] : null;
    const text = card ? card.name : (isBuildSlotUnlocked(slotId) ? "空" : "未开放");
    return `<span><b>${escHtml(label)}</b>${escHtml(text)}</span>`;
  }).join("");
  const fusionNotes = game.fusionLog.length
    ? game.fusionLog.slice(-5).map((note) => `<span>${note}</span>`).join("")
    : "<span>主武器 Lv.5 后会出现更明确的强化节点。</span>";
  const items = game.boughtItemNames.length
    ? game.boughtItemNames.slice(-8).map((name) => `<span>${name}</span>`).join("")
    : "<span>暂无道具</span>";
  const meta = game.endless
    ? `持续加班 ${formatTime(game.overtimeTimer)} · 强度 ${game.overtimeLevel + 1} · 等级 ${game.level} · 材料 ${game.materials}`
    : `第 ${game.stage} 关 ${game.stageConfig.name} · 等级 ${game.level} · 材料 ${game.materials} · 击破 ${game.stageKills}/${game.stageConfig.totalEnemies}`;
  ui.pauseStats.innerHTML = `
    <div class="pause-meta">${meta}</div>
    <section><h3>主武器形态</h3><div class="pause-chips"><span><b>${escHtml(activeForm?.displayName || "基础形态")}</b>${escHtml(activeForm?.combatVerb || "")}</span></div></section>
    <section><h3>形态参数</h3><div class="pause-stats">${metrics || "<span><b>暂无</b>继续升级主武器</span>"}</div></section>
    <section><h3>卡槽强化</h3><div class="pause-stats">${slotRows}</div></section>
    <section><h3>武器</h3><div class="pause-chips">${weapons || "<span>初始装备</span>"}</div></section>
    <section><h3>强化节点</h3><div class="pause-chips">${fusionNotes}</div></section>
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
    attackSpeed: `${Math.round(getEffectiveStat("attackSpeed"))}%`,
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
  ui.buildToggle.textContent = collapsed ? "B" : "×";
  ui.buildToggle.title = collapsed ? "查看 Build 面板" : "收起 Build 面板";
  ui.buildToggle.classList.remove("attention");
}

function markBuildHint() {
  if (!ui.buildPanel || !ui.buildPanel.classList.contains("collapsed")) return;
  ui.buildToggle?.classList.add("attention");
}

/* 鈹€鈹€ 璺嚎瑙嗚闃舵鏁堟灉 鈹€鈹€ */
function updateRouteVisuals(dt) {
  if (!ui.routeScanlines) return;
  const anyT4 = routeDefinitions.some(r => getRouteTier(r.id) >= 4);
  const anyT3 = routeDefinitions.some(r => getRouteTier(r.id) >= 3);
  if (anyT4) {
    ui.routeScanlines.classList.add("active");
    // T4: period screen pulse in dominant route color
    game._routePulseTimer = (game._routePulseTimer || 0) + dt;
    if (game._routePulseTimer > 2.5) {
      game._routePulseTimer = 0;
      const dominantId = getDominantRouteId();
      const route = dominantId ? routeDefinitions.find(r => r.id === dominantId) : routeDefinitions[0];
      if (route) {
        const color = route.color || "#52ffe1";
        game.screenShake = Math.max(game.screenShake || 0, 2.5);
        pulse(game.player.x, game.player.y, 200, color);
        if (route.id === "precision") {
          for (let i = 0; i < 8; i += 1) {
            const angle = (i / 8) * TAU + game.time * 0.4;
            spark(game.player.x + Math.cos(angle) * 140, game.player.y + Math.sin(angle) * 140, "#52ffe1");
          }
        }
      }
    }
  } else if (anyT3) {
    ui.routeScanlines.classList.add("active");
  } else {
    ui.routeScanlines.classList.remove("active");
  }
}

function updateLowHpVisuals() {
  if (!ui.lowHpVignette) return;
  const hpPct = game.player.hp / game.player.maxHp;
  if (hpPct < 0.3) {
    ui.lowHpVignette.classList.add("active");
  } else {
    ui.lowHpVignette.classList.remove("active");
  }
}

/* 鈹€鈹€ 鍔犵彮琛ヨ创：氫綆琛€閲忕炕鐩橀€夐」 鈹€鈹€ */
function getSubsidyOption() {
  const hpPct = game.player.hp / game.player.maxHp;
  if (hpPct > 0.3 || game.subsidyUsed) return null;
  if (Math.random() > 0.55) return null; // Not guaranteed
  const options = [
    { title: "急招 · 加班补贴", tag: "补贴 / 生存", text: "立即恢复 40% 生命，伤害 +8%。下关怪物 +20%。", risk: "风险：下关怪物数量 +20%", apply(g) { g.player.hp = Math.min(g.player.maxHp, g.player.hp + g.player.maxHp * 0.4); addPlayerDamage(g, 0.08); g.sudsidyPenalty = (g.sudsidyPenalty || 0) + 0.2; } },
    { title: "急招 · 双倍工资", tag: "补贴 / 经济", text: "获得 8 材料，下次商店额外刷新。本关经验 -15%。", risk: "风险：本关经验获取 -15%", apply(g) { g.materials += 8; g.shopRefreshBonus = (g.shopRefreshBonus || 0) + 1; g.xpPenalty = (g.xpPenalty || 0) + 0.15; } },
    { title: "急招 · 护身符", tag: "补贴 / 防御", text: "护甲 +6，回血 +4，持续到本关结束。下关升级选项 -1。", risk: "风险：下关升级选项 -1", apply(g) { g.tempArmor = (g.tempArmor || 0) + 6; g.tempRegen = (g.tempRegen || 0) + 4; g.sudsidySlotPenalty = true; } },
    { title: "急招 · 死线冲刺", tag: "补贴 / 爆发", text: "伤害 +25%，全武器冷却 -20%，持续本关。结束后生命 -15%。", risk: "风险：效果结束后生命 -15%", apply(g) { addPlayerDamage(g, 0.25); g.sudsidyCdBoost = true; g.sudsidyHpPenalty = (g.sudsidyHpPenalty || 0) + 0.15; } },
  ];
  const idx = Math.floor(Math.random() * options.length);
  return { ...options[idx], id: `sudsidy_${idx}`, subsidy: true };
}

/* 鈹€鈹€ 榛戞殫璇嶆潯绯荤粺 鈹€鈹€ */
const itemDarkAffixes = {
  energyDrink: { text: "闅愯棌：氭瘡鍏崇粨鏉熸椂澶卞幓 1 鐐规渶澶х敓鍛?", apply(g) { if (g.stage > 1) g.player.maxHp = Math.max(40, g.player.maxHp - 1); if (g.player.hp > g.player.maxHp) g.player.hp = g.player.maxHp; } },
  oldHardDrive: { text: "闅愯棌：氭鍣ㄥ崌绾ц垂鐢?+1 鏉愭枡", apply(g) { g.weaponUpgradeCostPenalty = (g.weaponUpgradeCostPenalty || 0) + 1; } },
  fileCabinet: { text: "闅愯棌：氱Щ鍔ㄩ€熷害 -6：堥潤绔嬬珯鐐规椂涓嶅彈褰卞搷：?", apply(g) { g.player.speed = Math.max(140, g.player.speed - 6); } },
  coffeeMachine: { text: "闅愯棌：氬挅鍟′激瀹?+8%：屽叾浠栨鍣ㄤ激瀹?-5%", apply(g) { addPlayerDamage(g, -0.05); } },
};
Object.assign(itemDarkAffixes.energyDrink, { text: "隐藏：每关结束时失去 1 点最大生命。" });
Object.assign(itemDarkAffixes.oldHardDrive, { text: "隐藏：武器升级费用 +1 材料。" });
Object.assign(itemDarkAffixes.fileCabinet, { text: "隐藏：移动速度 -6，静止站场时不受影响。" });
Object.assign(itemDarkAffixes.coffeeMachine, { text: "隐藏：咖啡伤害 +8%，其他武器伤害 -5%。" });

function applyDarkAffix(itemId, g) {
  const affix = itemDarkAffixes[itemId];
  if (affix?.apply) {
    affix.apply(g);
    if (!g.darkAffixes) g.darkAffixes = {};
    g.darkAffixes[itemId] = true;
  }
}

function getItemDarkAffixText(itemId) {
  const affix = itemDarkAffixes[itemId];
  return affix ? affix.text : "";
}

/* 鈹€鈹€ 闅愯棌鍗忓悓：氫笉鍦ㄥ浘閴存樉绀猴紝鐜╁鎾炶鎵嶈В閿?鈹€鈹€ */
const hiddenSynergies = [
  {
    id: "paperStorm",
    name: "绾稿紶椋庢毚",
    trigger: ["energyDrink", "stapler"],
    items: ["energyDrink", "luckyBadge"],
    desc: "纰庣墖 脳 骞歌繍：氭毚鍑绘椂鍙敜 3 寮犵焊鍓戝皠鍚戦殢鏈烘晫浜?",
    onCrit(g, e) {
      if (Math.random() < 0.35) {
        for (let i = 0; i < 3; i += 1) {
          const target = game.enemies[Math.floor(Math.random() * game.enemies.length)];
          if (target) {
            game.projectiles.push({
              x: g.player.x, y: g.player.y - 30, vx: (target.x - g.player.x) * 0.15, vy: (target.y - g.player.y) * 0.15,
              r: 3, damage: hitDamage(14 * getWeaponStatScale("precise")), pierce: 2, color: "#fff", source: "synergy", life: 0.8
            });
          }
        }
      }
    },
  },
  {
    id: "recyclingChain",
    name: "寰幆鍥炴敹閾?",
    items: ["wirelessMouse", "deskFan"],
    desc: "榧犳爣 脳 椋庢墖：氭嬀鍙栨潗鏂欐椂鏈?30% 姒傜巼棰濆鑾峰緱 1 鏉愭枡",
  },
  {
    id: "fortifiedBunker",
    name: "闃插尽宸ヤ簨",
    items: ["fileCabinet", "lunchbox"],
    desc: "鏂囦欢鏌?脳 渚垮綋：氭姢鐢?+3：岀珯妗╂椂棰濆鍑忎激 10%",
  },
  {
    id: "rubberStampede",
    name: "鐩栫珷鍐查攱",
    items: ["rubberSole", "oldHardDrive"],
    desc: "闉嬪簳 脳 纭洏：氶棯閬挎垚鍔熷悗瀵规渶杩戞晫浜洪€犳垚 80 浼ゅ",
  },
  {
    id: "spicyCombo",
    name: "楹昏荆缁勫悎",
    items: ["energyDrink", "oldHardDrive"],
    desc: "楗枡 脳 纭洏：氳兘閲忛ギ鏂欎笉鍐嶆墸琛€：屼激瀹冲啀 +6%",
  },
  {
    id: "wirelessFengShui",
    name: "鏃犵嚎椋庢按",
    items: ["wirelessMouse", "fileCabinet"],
    desc: "榧犳爣 脳 鏂囦欢鏌滐細鎷惧彇鑼冨洿 +30：屾嬀鍙栨潗鏂欐椂 20% 鎭㈠ 2 鐢熷懡",
  },
];
[
  ["paperStorm", "纸张风暴", "碎片 x 幸运：暴击时向随机敌人追加纸片飞射。"],
  ["recyclingChain", "循环回收链", "鼠标 x 风扇：拾取材料时有概率额外获得 1 材料。"],
  ["fortifiedBunker", "防御工事", "文件柜 x 便当：护甲提升，站场时额外减伤。"],
  ["rubberStampede", "盖章冲锋", "鞋底 x 硬盘：闪避成功后反击最近敌人。"],
  ["spicyCombo", "麻辣组合", "饮料 x 硬盘：能量饮料不再扣血，并额外提升伤害。"],
  ["wirelessFengShui", "无线风水", "鼠标 x 文件柜：吸附范围提升，拾取材料时小幅回血。"],
].forEach(([id, name, desc]) => {
  const synergy = hiddenSynergies.find((item) => item.id === id);
  if (synergy) Object.assign(synergy, { name, desc });
});

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
        showFusionNotice("隐藏协同", syn.name, syn.desc + (isNew ? "（新发现）" : ""));
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

/* 鈹€鈹€ 鍏冲崱闂撮殢鏈轰簨浠?鈹€鈹€ */
const interStageEvents = [
  { title: "鍥炲绱ф€ラ偖浠?", icon: "馃摟", desc: "鎬荤洃鍙戞潵绱ф€ラ偖浠讹紝鐜板湪鍥炲：?", risk: "澶卞幓 15% 褰撳墠鐢熷懡", accept(g) { g.player.hp = Math.max(1, g.player.hp - g.player.maxHp * 0.15); g.materials += 8; g.shopRefreshBonus = (g.shopRefreshBonus || 0) + 1; } },
  { title: "缁澂鍜栧暋", icon: "鈽?", desc: "鍏嶈垂缁澂绗洓鏉挅鍟♀€斺€斿彲鑳芥墜鎶栥€?", risk: "鏈叧绉婚€?-15%", accept(g) { g.upgradeChoiceBonus = (g.upgradeChoiceBonus || 0) + 1; g.player.speed = Math.round(g.player.speed * 0.85); } },
  { title: "鏇垮悓浜嬮《鐝?", icon: "馃搵", desc: "鍚屼簨璇峰亣：屼粬鐨勬椿褰掍綘浜嗐€?", risk: "涓嬪叧鎬墿 +25%", accept(g) { g.stageConfig.totalEnemies = Math.round(g.stageConfig.totalEnemies * 1.25); g.stageConfig.materialMult += 0.35; g._overtimeCovered = true; } },
  { title: "绛剧讲淇濆瘑鍗忚", icon: "馃敀", desc: "HR 璁╀綘绛句竴浠藉緢闀跨殑鍗忚銆?", risk: "鏈叧姝﹀櫒鍗囩骇璐圭敤缈诲€?", accept(g) { g.weaponCostDouble = true; g.materials += 5; g._ndaSigned = true; } },
  { title: "娓呯悊宸ヤ綅", icon: "馃Ч", desc: "琛屾斂閮ㄦ潵妫€鏌ュ伐浣嶅崼鐢熲€斺€旀竻鐞嗚繕鏄棌璧锋潵：?", risk: "澶卞幓 2 鏉愭枡", accept(g) { g.materials = Math.max(0, g.materials - 2); g.player.regen += 3; addPlayerDamage(g, 0.06); g._deskCleaned = true; } },
  { title: "鍐呴儴鍩硅", icon: "馃摉", desc: "寮哄埗鍙傚姞鍩硅鈥斺€斿彲鑳藉鍒颁笢瑗匡紝涔熷彲鑳芥氮璐规椂闂淬€?", risk: "50% 姒傜巼娌℃湁浠讳綍鏁堟灉", accept(g) { if (Math.random() < 0.5) { g.player.luck += 10; addPlayerDamage(g, 0.08); } } },
  { title: "绯荤粺鏇存柊", icon: "馃捇", desc: "IT 寮哄埗鎺ㄩ€佺郴缁熸洿鏂帮紝閲嶅惎涓?..", risk: "涓嬪叧鍓?15 绉掓棤娉曟敾鍑?", accept(g) { g.systemUpdateTimer = 15; g.materials += 6; g.player.armor += 3; g._updateComplete = false; } },
  { title: "骞村害浣撴", icon: "馃彞", desc: "鍏徃骞村害浣撴鈥斺€斿彲鑳藉彂鐜扮偣浠€涔堛€?", risk: "鏈€澶х敓鍛?-5", accept(g) { if (Math.random() < 0.6) { g.player.maxHp += 15; g.player.hp = Math.min(g.player.maxHp, g.player.hp + 20); g.player.regen += 2; } else { g.player.maxHp = Math.max(50, g.player.maxHp - 5); } } },
];
const interStageEventLogic = interStageEvents.map((event) => event.accept);
interStageEvents.splice(0, interStageEvents.length,
  { title: "回复紧急邮件", icon: "Mail", desc: "总监发来紧急邮件，现在回复可以换取材料。", risk: "失去 15% 当前生命", accept: interStageEventLogic[0] },
  { title: "续杯咖啡", icon: "Coffee", desc: "免费续杯第四杯咖啡，能多拿一个升级选项。", risk: "本关移速 -15%", accept: interStageEventLogic[1] },
  { title: "替同事顶班", icon: "Shift", desc: "同事请假，他的活归你了。", risk: "下关怪物 +25%", accept: interStageEventLogic[2] },
  { title: "签署保密协议", icon: "NDA", desc: "HR 让你签一份很长的协议，换一点材料。", risk: "本关武器升级费用翻倍", accept: interStageEventLogic[3] },
  { title: "清理工位", icon: "Desk", desc: "行政部来检查工位卫生，清理后状态更稳。", risk: "失去 2 材料", accept: interStageEventLogic[4] },
  { title: "内部培训", icon: "Train", desc: "参加培训，可能学到东西，也可能浪费时间。", risk: "50% 概率没有效果", accept: interStageEventLogic[5] },
  { title: "系统更新", icon: "Patch", desc: "IT 强制推送系统更新，重启期间会停火。", risk: "下关前 15 秒无法攻击", accept: interStageEventLogic[6] },
  { title: "年度体检", icon: "Check", desc: "公司年度体检，可能发现身体状态变化。", risk: "可能最大生命 -5", accept: interStageEventLogic[7] },
);

function showInterStageEvent() {
  if (!ui.eventPanel || game.stage <= 1 || Math.random() > 0.6) return; // ~40% chance after stage 1
  const event = interStageEvents[Math.floor(Math.random() * interStageEvents.length)];
  ui.eventTitle.textContent = event.title;
  ui.eventChoices.innerHTML = `
    <button class="event-choice" id="eventAcceptBtn">
      <span class="event-icon">${event.icon}</span>
      <span class="event-body">
        <strong>${event.title}</strong>
        <span class="event-desc">${event.desc}</span>
        <span class="event-risk">⚠ ${event.risk}</span>
      </span>
    </button>
  `;
  ui.eventSkipButton.onclick = () => { ui.eventPanel.classList.add("hidden"); };
  document.getElementById("eventAcceptBtn").onclick = () => {
    event.accept(game);
    ui.eventPanel.classList.add("hidden");
    floatingText(game.player.x, game.player.y - 40, event.title, "#ffd15c");
  };
  ui.eventPanel.classList.remove("hidden");
}

ui.startButton.addEventListener("click", startGame);
ui.restartButton.addEventListener("click", startGame);
ui.perkShopButton?.addEventListener("click", openPerkShop);
ui.perkCloseButton?.addEventListener("click", closePerkShop);
ui.startPerkButton?.addEventListener("click", openPerkShop);
ui.startEndlessButton?.addEventListener("click", startEndlessMode);
ui.itemConvertButton?.addEventListener("click", convertPendingItemToMaterial);
ui.itemKeepButton?.addEventListener("click", keepCurrentPassiveItems);
ui.endlessButton?.addEventListener("click", startEndlessMode);
function skipPolicyAndStart() { pendingPolicy = null; startGameActual(); }
ui.policySkip?.addEventListener("click", skipPolicyAndStart);
ui.continueButton.addEventListener("click", startNextStage);
ui.upgradeRerollButton?.addEventListener("click", rerollUpgradeChoices);
ui.refreshButton.addEventListener("click", rerollShop);
ui.pauseButton.addEventListener("click", togglePause);
ui.resumeButton.addEventListener("click", resumeGame);
ui.restartFromPause?.addEventListener("click", abandonRunToMenu);
ui.buildToggle.addEventListener("click", toggleBuildPanel);
ui.fusionNoticeClose?.addEventListener("click", () => ui.fusionNotice?.classList.add("hidden"));

decorateHudIcons();
updateStartActions();

renderBuildHud(weaponDefinitions, "挂耳咖啡 Lv.1 / 1/6");
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
renderBestOvertime();
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


// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
//  LAYER v0.3 REFORGED 鈥?鍗忓悓闈㈡澘 / 鍗忎綔浠诲姟 / 澶嶇洏绯荤粺
//  鏂板 Build 鏋勭瓚杈呭姪绯荤粺
// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲

// ---- 鍗忓悓闈㈡澘 ----

function initSynergyToggle() {
  if (ui.buildToggle) {
    ui.buildToggle.style.display = "none";  // 闅愯棌鏃?Build 鎸夐挳
  }
  if (ui.buildPanel) {
    ui.buildPanel.className = "synergy-panel collapsed";
    // Repurpose existing buildToggle as synergy toggle
    if (!ui.synToggle && ui.buildToggle) {
      ui.synToggle = ui.buildToggle;
    }
  }
  // Create synergy panel toggle if not exists
  let toggle = document.querySelector("#synergyToggle");
  if (!toggle) {
    toggle = document.createElement("button");
    toggle.id = "synergyToggle";
    toggle.type = "button";
    toggle.className = "synergy-toggle";
    toggle.title = "查看 Build 面板";
    toggle.innerHTML = '<span class="sg-count" id="sgDeptCount">0</span>';
    toggle.addEventListener("click", toggleSynergyPanel);
    document.querySelector(".game-wrap")?.append(toggle);
  }
  ui.synToggle = toggle;
  updateSynergyToggleBadge();
}

function toggleSynergyPanel() {
  synergyPanelOpen = !synergyPanelOpen;
  if (!ui.buildPanel) return;
  ui.buildPanel.className = synergyPanelOpen ? "synergy-panel" : "synergy-panel collapsed";
  if (synergyPanelOpen) updateSynergyPanel();
}

function updateSynergyToggleBadge() {
  const bs = CS.buildState;
  const cnt = bs.getFilledSlotCount();
  const el = document.querySelector("#sgDeptCount");
  if (el) el.textContent = cnt;
  if (ui.synToggle) {
    const dept = CS.departments[bs.badgeDept];
    if (dept) {
      ui.synToggle.style.borderColor = dept.color;
      ui.synToggle.style.boxShadow = `0 0 10px ${dept.color}33`;
    }
  }
}

function updateSynergyPanel() {
  if (!ui.buildPanel || !synergyPanelOpen) return;
  const bs = CS.buildState;
  const dept = CS.departments[bs.badgeDept] || CS.departments.tech;
  const ms = bs.getMilestoneStatus(bs.badgeDept);
  let html =
    '<div class="synergy-panel-head">' +
      '<span class="sp-dept-icon">' + dept.emoji + '</span>' +
      '<span class="sp-dept-name">' + dept.name + '</span>' +
      '<span class="sp-progress">' + ms.count + '/4</span>' +
      '<button class="sp-close" onclick="toggleSynergyPanel()">x</button>' +
    '</div>';

  html += '<div class="sp-section"><div class="sp-section-title">Dept Progress</div>';
  for (const tier of CS.milestoneTiers) {
    const reached = ms.reached.includes(tier.cards);
    const inProgress = !reached && tier.cards === (CS.milestoneTiers.find(t => !ms.reached.includes(t.cards))?.cards || 99);
    const mark = reached ? 'OK' : inProgress ? '..' : '--';
    html += '<div class="ms-row"><span class="ms-check ' + (reached ? 'done' : inProgress ? 'progress' : 'locked') + '">' + mark + '</span>' +
      '<span class="ms-name' + (!reached && !inProgress ? ' dim' : '') + '">' + tier.name + '</span>' +
      '<span class="ms-count">' + Math.min(ms.count, tier.cards) + '/' + tier.cards + '</span></div>';
  }
  if (ms.count >= 4) html += '<div class="ms-cap-hint">Dept full. Cross-dept choices can add a second form.</div>';
  html += '</div>';

  const activeDeptSyns = (CS.departmentSynergies || []).filter((syn) => bs.activeDeptSynergies.includes(syn.id));
  if (activeDeptSyns.length) {
    html += '<div class="sp-section"><div class="sp-section-title">Active Synergy</div>';
    for (const syn of activeDeptSyns) {
      const deptEmojis = syn.requiredDepartments.map(d => CS.departments[d]?.emoji || '?').join(' x ');
      html += '<div class="syn-row"><span class="syn-dot active"></span><span class="syn-name">' + syn.name + '</span><span class="syn-depts">' + deptEmojis + '</span></div>';
    }
    html += '</div>';
  }

  html += '<div class="sp-section"><div class="sp-section-title">Weapon Forms</div>';
  let evoCount = 0;
  for (const wid of bs.weapons) {
    if (!bs.weaponEvolutions[wid]) continue;
    evoCount += 1;
    const weapon = CS.weapons[wid];
    const route = weapon.evolutionRoutes?.find(r => r.id === bs.weaponEvolutions[wid]);
    html += '<div class="evo-row"><span class="evo-wep">' + (weapon?.emoji || '') + ' ' + (weapon?.name || wid) + '</span><span class="evo-arrow">-></span><span class="evo-name">' + (route?.name || "\u5df2\u8fdb\u5316") + '</span></div>';
  }
  if (!evoCount) html += '<div class="syn-row"><span class="syn-name dim">No evolution yet</span></div>';
  html += '</div>';

  ui.buildPanel.innerHTML = html;
}

// ---- 鍗忎綔浠诲姟寮圭獥 ----
function showCollabPanel(result) {
  if (!ui.collabPanel || !result?.quest) return;
  const quest = result.quest;
  const depts = quest.requires.depts.map(d => CS.departments[d]);
  if (ui.collabDeptIcons) {
    ui.collabDeptIcons.innerHTML =
      '<span class="collab-dept-icon">' + (depts[0]?.emoji || '?') + '</span>' +
      '<span class="collab-link-glow" style="background:linear-gradient(90deg,' + (depts[0]?.color || '#888') + ',' + (depts[1]?.color || '#888') + ')"></span>' +
      '<span class="collab-dept-icon">' + (depts[1]?.emoji || '?') + '</span>';
  }
  if (ui.collabNarrative) ui.collabNarrative.textContent = quest.narrative || "Cross-dept task";
  if (ui.collabRequirement) {
    const req = quest.requires.depts.map(d => (CS.departments[d]?.name || d) + " card").join(" + ");
    ui.collabRequirement.textContent = "\u9700\u6c42\uff1a" + req + (result.satisfied ? "" : "\uff08\u672a\u6ee1\u8db3\uff09");
    ui.collabRequirement.className = "collab-req " + (result.satisfied ? "satisfied" : "unsatisfied");
  }
  if (ui.collabReward) ui.collabReward.textContent = result.satisfied ? "Reward: " + quest.reward.desc : "Will trigger again when ready.";
  if (ui.collabActions) ui.collabActions.style.display = result.satisfied ? "flex" : "none";
  if (result.satisfied) {
    if (ui.collabAccept) ui.collabAccept.onclick = () => { acceptCollabQuest(true); };
    if (ui.collabDecline) ui.collabDecline.onclick = () => { acceptCollabQuest(false); };
  } else if (result.hint) {
    setTimeout(() => { ui.collabPanel.classList.add("hidden"); }, 3000);
  }
  ui.collabPanel.classList.remove("hidden");
}

function acceptCollabQuest(accepted) {
  const result = CS.buildState.completeCollabQuest(accepted);
  ui.collabPanel.classList.add('hidden');
  if (accepted && result.reward) {
    switch (result.reward.type) {
      case "free_card":
        // Force next upgrade to have a card option ready
        game.pendingLevelUps += 1;
        floatingText(game.player.x, game.player.y - 88, "协作达成", "#ffd700");
        break;
      case "shop_discount":
        game._shopDiscount = (game._shopDiscount || 0) + (result.reward.value || 0.50);
        floatingText(game.player.x, game.player.y - 88, "商店半价", "#ffd700");
        break;
      case "emergency_buff":
        game.player.damageMult = Math.min(DAMAGE_MULT_HARD_CAP, game.player.damageMult + (result.reward.dmgBonus || 0.25));
        floatingText(game.player.x, game.player.y - 88, "紧急增益", "#ffd700");
        break;
    }
  }
  updateSynergyPanel();
}

// ---- 鏇存柊 checkWeaponEvolutions 浣跨敤 BuildState ----
// (鍘熷 checkWeaponEvolutions 淇濈暀浣嗘敼涓鸿皟鐢?BuildState)
// 鍘熷鍑芥暟鍦ㄤ笅鏂硅鏇挎崲銆?
// ---- 閮ㄩ棬鎶曡祫 HUD 鎸囩ず鍣?----
function updateDeptIndicators() {
  if (!game || state === "menu") return;
  let container = document.querySelector("#deptIndicators");
  if (!container) {
    container = document.createElement("div");
    container.id = "deptIndicators";
    container.className = "dept-indicators";
    document.querySelector(".game-wrap")?.append(container);
  }
  const bs = CS.buildState;
  const filled = bs.getFilledSlotCount();
  const augmentCount = Object.values(bs.slotAugments || {}).reduce((sum, ids) => sum + (ids?.length || 0), 0);
  const supportCount = (bs.supportCards || []).length;
  const sig = filled + "|" + augmentCount + "|" + supportCount + "|" + Object.entries(bs.deptCardCounts).map(([k,v]) => `${k}:${v}`).join(",") + "|" + Object.entries(bs.slotCards).map(([k,v]) => `${k}:${v || ''}`).join(",");
  if (sig === syncHudSignature) return;
  syncHudSignature = sig;

  container.replaceChildren();
  const mainDeptCount = bs.deptCardCounts[bs.badgeDept] || 0;
  const activeSlots = Object.entries(bs.slotCards)
    .filter(([, cid]) => cid)
    .map(([sid]) => SLOT_META[sid]?.plain || sid)
    .slice(0, 3)
    .join(" / ");
  const activeWeapon = getActiveWeaponId();
  const weapon = CS.weapons?.[activeWeapon] || game?.weapons?.[activeWeapon] || {};
  const form = getActiveWeaponForm(activeWeapon);
  const formText = `${weapon.name || weapon.label || activeWeapon} · ${form?.displayName || "基础形态"}`;
  const slotText = activeSlots ? `${activeSlots}槽` : "未装槽";
  const mini = document.createElement("div");
  mini.className = "build-compass-mini";
  mini.innerHTML = `
    <strong>主武器形态</strong>
    <span>${escHtml(formText)} / ${slotText}${augmentCount ? ` / 追加 ${augmentCount}` : ""}</span>
  `;
  container.append(mini);
  for (const deptId of bs.runDeptPool) {
    const count = bs.deptCardCounts[deptId] || 0;
    const dept = CS.departments[deptId];
    const pill = document.createElement("span");
    pill.className = `slot-tag-pill ${count > 0 ? 'filled' : 'empty'}`;
    if (count > 0) {
      pill.style.background = `rgba(${hexToRgb(dept.color)},0.15)`;
      pill.style.border = `1px solid rgba(${hexToRgb(dept.color)},0.35)`;
      pill.style.color = dept.color;
      pill.textContent = `${dept.emoji} ${dept.name.substring(0,2)} ${count}/${CS.milestoneTiers.length + 1}`;
    } else {
      pill.textContent = `${dept.emoji}`;
    }
    container.append(pill);
  }
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1],16)},${parseInt(result[2],16)},${parseInt(result[3],16)}` : '136,136,170';
}

// ---- v0.3 澶嶇洏：氫笁灞傞€掕繘 ----
function renderV03Debrief() {
  const bs = CS.buildState;
  const dept = CS.departments[bs.getPrimaryDept()] || CS.departments[bs.badgeDept] || { emoji: "ID", name: "未定工牌" };

  // Layer 1: Identity
  if (ui.identityLayer && ui.identityText) {
    const attrNames = bs.attributes.map(a => {
      const attr = CS.attributes[a];
      return attr ? `<span class="hi-attr">${attr.name}</span>` : a;
    }).join('路');

    const topWeapon = game.weapons ? Object.keys(game.weapons).find(w => game.weapons[w]?.owned) : bs.weapons[0];
    const wp = CS.weapons[topWeapon];
    const weaponName = wp ? `${wp.emoji} ${wp.name}` : '武器';

    const topCards = bs.ownedCardIds.slice(Math.max(0, bs.ownedCardIds.length - 2));
    const cardNames = topCards.map(cid => {
      const c = CS.cards[cid];
      return c ? `<span class="hi-card">${c.name}</span>` : '';
    }).filter(Boolean).join(' + ');

    // v0.3a Step 7: Build name + tags
    const buildName = bs.generateBuildName();
    const primaryTags = bs._getPrimaryTags();
    const tagHtml = primaryTags.length > 0
      ? primaryTags.map(function(t) {
          var tag = CS.tags[t.tag];
          var emoji = tag ? tag.emoji : '';
          return '<span class="hi-tag-pill">' + emoji + t.name + '</span>';
        }).join(' ')
      : '';

    ui.identityText.innerHTML = `
      <div class="hi-build-name">${buildName}</div>
      ${tagHtml ? '<div class="hi-tags">' + tagHtml + '</div>' : ''}
      <div class="hi-desc">浣犳槸 <span class="hi-dept">${dept.emoji} ${dept.name}</span> 鐨?${attrNames} 鍨嬶紝
      鏍稿績杈撳嚭鏉ヨ嚜 <span class="hi-weapon">${weaponName}</span>${cardNames ? ' + ' + cardNames : ''}銆?/div>
    `;
    ui.identityLayer.classList.remove('hidden');
  }

  // Layer 2: Suggestions
  if (ui.suggestionsLayer && ui.suggestionList) {
    ui.suggestionList.replaceChildren();
    const suggestions = generateV03Suggestions();
    for (const s of suggestions) {
      const card = document.createElement("div");
      card.className = "suggestion-card";
      card.innerHTML = `<span class="sg-icon">${s.icon || 'Tip'}</span><p>${s.text}</p>`;
      ui.suggestionList.append(card);
    }
    ui.suggestionsLayer.classList.remove('hidden');
  }

  // Layer 3: Radar chart
  renderBuildRadar();
}

function renderBuildRadar() {
  if (!ui.radarLayer || !ui.radarChart) return;
  var g = game;
  if (!g || !g.weapons) { ui.radarLayer.classList.add('hidden'); return; }

  var dims = { offense: 0, survival: 0, economy: 0, mobility: 0, control: 0, growth: 0 };
  var p = g.player;
  var bs = CS.buildState;

  dims.offense = Math.min(100, Math.round(Math.max(0, (p.damageMult - 1) * 60) + Math.max(0, p.attackSpeed * 25) + Math.max(0, p.critChance * 40) + (p.rangeBonus || 0) * 2));
  dims.survival = Math.min(100, Math.round(Math.max(0, (p.maxHp / 300) * 30) + Math.max(0, p.armor * 50) + Math.max(0, p.regen * 12) + Math.max(0, (p.dodgeChance || 0) * 100)));
  dims.economy = Math.min(100, Math.round(Math.max(0, (g.materials || 0) / 5) + Math.max(0, (p.xpMult || 0) * 30) + Math.max(0, (p.pickupRange - 60) * 0.5)));
  dims.mobility = Math.min(100, Math.round(Math.max(0, ((p.speed || 200) - 200) * 1.2) + Math.max(0, (p.dodgeChance || 0) * 80)));

  var chainWeapons = 0;
  for (var wid in g.weapons) {
    var wdef = CS.weapons[wid];
    if (g.weapons[wid].owned && wdef && wdef.tags && wdef.tags.indexOf('knockback') >= 0) chainWeapons++;
  }
  dims.control = Math.min(100, Math.round(Math.max(0, p.knockback * 20) + chainWeapons * 15 + (g._milestoneChainDmg ? 30 : 0) + (g.nightWatchActive ? 20 : 0)));

  var ownedWeapons = 0;
  for (var w2 in g.weapons) { if (g.weapons[w2].owned) ownedWeapons++; }
  dims.growth = Math.min(100, Math.round(ownedWeapons * 12 + Math.max(0, (p.xpMult || 0) * 25) + (bs.ownedCardIds ? bs.ownedCardIds.length * 8 : 0)));

  var colors = { offense: '#ff6b4a', survival: '#4acf6a', economy: '#ffd15c', mobility: '#4a9eff', control: '#b282ff', growth: '#52ffe1' };
  var labels = { offense: "\u8f93\u51fa", survival: "\u751f\u5b58", economy: "\u8d44\u6e90", mobility: "\u79fb\u52a8", control: "\u63a7\u5236", growth: "\u6210\u957f" };
  var emojis = { offense: 'DMG', survival: 'HP', economy: 'MAT', mobility: 'SPD', control: 'CTRL', growth: 'XP' };

  ui.radarChart.replaceChildren();
  var keys = ['offense', 'survival', 'economy', 'mobility', 'control', 'growth'];
  for (var k = 0; k < keys.length; k++) {
    var key = keys[k];
    var val = dims[key];
    var div = document.createElement('div');
    div.className = 'radar-row';
    div.innerHTML = '<span class="radar-label">' + emojis[key] + ' ' + labels[key] + '</span>' +
      '<div class="radar-bar"><div class="radar-fill" style="width:' + val + '%;background:' + colors[key] + '"></div></div>' +
      '<span class="radar-val">' + val + '</span>';
    ui.radarChart.append(div);
  }
  ui.radarLayer.classList.remove('hidden');
}

function generateV03Suggestions() {
  const suggestions = [];
  const activeWeaponId = getActiveWeaponId();
  const form = getActiveWeaponForm(activeWeaponId);
  const topDmg = Math.round(getTopDamageAmount());
  suggestions.push({
    icon: "DMG",
    text: "\u8fd9\u5c40\u6700\u6e05\u695a\u7684\u53cd\u9988\u6765\u81ea\uff1a" + (form?.displayName || "\u5f53\u524d\u5f62\u6001") + "\u3002\u4e0b\u5c40\u53ef\u4ee5\u89c2\u5bdf\u5b83\u66f4\u64c5\u957f\u6e05\u5c0f\u602a\u3001\u6253\u7cbe\u82f1\uff0c\u8fd8\u662f\u5236\u9020\u5b89\u5168\u7a7a\u95f4\u3002"
  });
  if (topDmg > 0) {
    suggestions.push({ icon: "STAT", text: "\u6700\u9ad8\u4f24\u5bb3\u6765\u6e90\u7ea6 " + topDmg + "\u3002\u5982\u679c\u5b83\u6765\u81ea\u4e3b\u6b66\u5668\uff0c\u4f18\u5148\u5f3a\u5316\u5bf9\u5e94\u5f62\u6001\u53c2\u6570\uff1b\u5982\u679c\u6765\u81ea\u526f\u7ebf\uff0c\u8bf4\u660e\u8f85\u52a9\u6280\u80fd\u5df2\u7ecf\u503c\u5f97\u7ee7\u7eed\u6295\u8d44\u3002" });
  }
  return suggestions.slice(0, 3);
}

function updateV03Hud() {
  if (!game || state !== "playing") return;
  updateDeptIndicators();
  updateSynergyToggleBadge();
}

function rebuildCardEffectsFromBuildState() {
  if (!game || !window.CS?.buildState) return;
  game.formModifiers = game.formModifiers || {};
  const activeWeapon = getActiveWeaponId();
  game.formModifiers[activeWeapon] = getFormModifierSummary(activeWeapon);
  updateBuildHud();
  updateStatHud();
  updateItemHud();
}

function applyMilestoneRewards() {
  if (!game || !window.CS?.buildState) return;
  const dept = CS.buildState.getPrimaryDept?.() || CS.buildState.badgeDept;
  const count = CS.buildState.deptCardCounts?.[dept] || 0;
  if (count >= 2) game.player.damageMult = Math.min(DAMAGE_MULT_HARD_CAP, game.player.damageMult + 0.005);
}

// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
//  v0.3a: 鑷姩鍖栨祴璇曟鏋?(window._testBuild)
//  鐢ㄤ簬閫?Build 娴嬭瘯：岄獙璇?10 涓?Build 鍦ㄥ綋鍓嶅叧鍗¤妭濂忎腑鐨勮〃鐜?// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲

/** 鑷姩鍖栭€夋嫨鏈€浼樺崱鐗屾斁鍏ユЫ浣?*/
window._autoPickBestCard = function() {
  if (!CS.buildState || !game) return;
  var options = CS.buildState.getLevelUpOptions();
  if (!options || !options.length) return;
  window._autoPickBestCardFromOptions(options);
};

/** 浠庡凡鏈夐€夐」涓€夋嫨鏈€浼樺崱鐗屽苟搴旂敤 */
window._autoPickBestCardFromOptions = function(options) {
  if (!options || !options.length) return;

  var availSlots = CS.buildState.getAvailableSlots();
  var augmentSlots = [];
  if (!availSlots.length && CS.buildState.getUnlockedSlotIds) {
    augmentSlots = CS.buildState.getUnlockedSlotIds().filter(function(slotId) { return !!CS.buildState.slotCards[slotId]; });
    if (!augmentSlots.length) return;
  } else if (!availSlots.length) return;

  // 绠€鍗曠瓥鐣ワ細鎸夐儴闂ㄤ紭鍏堢骇閫夋嫨：堜紭鍏堥€?badgeDept 鐨勫崱：?  var bestIdx = 0;
  var bestScore = -Infinity;
  for (var i = 0; i < options.length; i++) {
    var card = options[i].card;
    var score = 0;
    if (card.department === CS.buildState.badgeDept) score += 10;
    if (card.rarity === "legendary") score += 20;
    if (card.rarity === "rare") score += 5;
    var offEffect = card.slotEffects && card.slotEffects.offense;
    if (offEffect) score += offEffect.powerBudget * 3;
    if (score > bestScore) { bestScore = score; bestIdx = i; }
  }

  var chosen = options[bestIdx];
  var card = chosen.card;
  var bestSlot = availSlots[0] || ("augment:" + augmentSlots[0]);

  var result = CS.buildState.selectCard(card.id, bestSlot);
  if (result.ok) {
    rebuildCardEffectsFromBuildState();
    applyMilestoneRewards(card.department);
    if (game.runLog) {
      game.runLog.cardAcquired = game.runLog.cardAcquired || [];
      game.runLog.cardAcquired.push({ cardId: card.id, slot: bestSlot, department: card.department, rarity: card.rarity, atStage: game.stage, atLevel: game.level });
      game.runLog.upgradesChosen = game.runLog.upgradesChosen || [];
      game.runLog.upgradesChosen.push(card.id);
    }
    game.upgradesTaken += 1;
    if (typeof checkWeaponEvolutions === 'function') checkWeaponEvolutions();
    if (typeof syncWeaponEvolutionsToBuildState === 'function') syncWeaponEvolutionsToBuildState();
  }
};

/** 瀹屾暣鐨?Build 娴嬭瘯：堢函鏁版嵁鍒嗘瀽：屼笉瀹為檯杩愯甯у惊鐜級 */
window._testBuild = function(badgeDept, startWeapon, attrSlots) {
  // 1. 蹇€熷紑灞€
  CS.buildState.reset();
  CS.buildState.badgeDept = badgeDept;
  CS.buildState.attributes = attrSlots || ["execution", "focus"];
  CS.buildState.fixedAttributes = CS.buildState.attributes.slice(0, 2);
  CS.buildState.weapons = [startWeapon];
  CS.buildState.isAdvanced = false;

  var others = Object.keys(CS.departments).filter(function(d) { return d !== badgeDept; });
  var shuffled = others.sort(function() { return Math.random() - 0.5; });
  CS.buildState.runDeptPool = [badgeDept].concat(shuffled.slice(0, 2));
  for (var di = 0; di < CS.buildState.runDeptPool.length; di++) {
    CS.buildState.deptCardCounts[CS.buildState.runDeptPool[di]] = 0;
  }
  CS.buildState.phase = "playing";
  CS.buildState.stage = 1;
  CS.buildState.level = 1;
  CS.buildState.runLog = CS.buildState._emptyLog ? CS.buildState._emptyLog() : { startTime: Date.now(), cardsAcquired: [], synergiesTriggered: [], milestonesReached: [] };

  // 2. 鍒涘缓娓告垙
  enemyId = 1;
  game = createGame();
  game.weapons = normalizeWeaponStateForCombat(structuredClone(CS.weapons));
  game.weapons[startWeapon].owned = true;
  game.weapons[startWeapon].level = 1;
  game.runLog = { weaponDamages: {}, weaponKills: {}, cardsAcquired: [], synergiesTriggered: {}, milestonesReached: [], upgradesChosen: [] };
  game._lv5MilestoneShown = false;
  game._lv10MilestoneShown = false;

  var cleared = 0;
  var deathStage = 0;
  var maxStage = game.maxStage || MAX_STAGE;
  for (var stage = 1; stage <= maxStage; stage++) {
    game.stage = stage;
    game.stageConfig = getStageConfig(stage);
    CS.buildState.stage = stage;
    game.waveTime = 0;
    game.stageKills = 0;
    game.stageSpawned = 0;
    game.enemiesToSpawn = game.stageConfig.totalEnemies;
    game.elitesToSpawn = game.stageConfig.eliteTotal;
    game.enemies = [];
    game.projectiles = [];
    game.pickups = [];
    game.spawnTimer = 0;

    for (var lv = game.level; lv < 15; lv++) {
      game.level = lv + 1;
      CS.buildState.level = game.level;

      if (game.level === 5) { game._lv5MilestoneShown = true; }
      if (game.level === 10) { game._lv10MilestoneShown = true; }

      // 鐢熸垚閫夐」骞惰嚜鍔ㄩ€夋渶浼樺崱
      var options = CS.buildState.getLevelUpOptions();
      if (options && options.length > 0) {
        window._autoPickBestCardFromOptions(options);
      }
    }

    var simTime = 0;
    var stageDuration = game.stageConfig.duration;
    while (simTime < stageDuration) {
      simTime += 0.016;
      game.waveTime = simTime;
      game.spawnTimer -= 0.016;
      if (game.spawnTimer <= 0 && game.stageSpawned < game.stageConfig.totalEnemies) {
        game.spawnTimer = game.stageConfig.spawnInterval;
        game.stageSpawned += 1;
      }
    }
    game.waveTime = stageDuration + 1;

    // 瀛樻椿鍒ゅ畾：堝熀浜?player stats 鍜岄樁娈靛帇鍔涳級
    var st = CS.buildState;
    var cfg = game.stageConfig;
    var playerHp = game.player.hp;
    var playerMaxHp = game.player.maxHp;
    var playerArmor = game.player.armor;
    var playerDodge = game.player.dodge;
    var playerRegen = game.player.regen;
    var playerDmg = game.player.damageMult;
    var playerSpd = game.player.speed;
    var playerAtkSpd = game.player.attackSpeed;
    var totalPressure = cfg.damageMult * cfg.speedMult * cfg.survivalPressure;

    var survivalScore = (playerHp * 0.4 + playerMaxHp * 0.3 + playerArmor * 8 + playerDodge * 1.5 + playerRegen * 12 + playerSpd * 0.15) / Math.max(0.5, totalPressure);
    var dpsScore = (playerDmg * 80 + playerAtkSpd * 1.5 + game.player.crit * 0.8) / Math.max(0.3, cfg.healthMult);

    if (survivalScore < 3.5 || dpsScore < 2.0) {
      deathStage = stage;
      break;
    }
    cleared = stage;

    game.stageKills = Math.round(cfg.totalEnemies * 0.7);
    game.kills += game.stageKills;

    // 鏇存柊鍗忓悓
    CS.buildState._updateSynergies();
  }

  // 4. 鐢熸垚娴嬭瘯鎶ュ憡
  var deptSummary = {};
  for (var dKey in CS.buildState.deptCardCounts) {
    if (CS.buildState.deptCardCounts[dKey] > 0) {
      deptSummary[dKey] = {
        count: CS.buildState.deptCardCounts[dKey],
        milestones: CS.buildState.deptMilestones[dKey] || []
      };
    }
  }

  var filledSlots = Object.values(CS.buildState.slotCards || {}).filter(Boolean).length;
  var deptSynCount = (CS.buildState.activeDeptSynergies || []).length;
  var attrSynCount = (CS.buildState.activeAttrSynergies || []).length;
  var milestoneCount = Object.values(CS.buildState.deptMilestones || {}).reduce(function(sum, entries) {
    return sum + (Array.isArray(entries) ? entries.length : 0);
  }, 0);

  var report = {
    name: badgeDept + " + " + startWeapon,
    dept: badgeDept,
    weapon: startWeapon,
    attrs: attrSlots,
    cleared: cleared,
    deathStage: deathStage,
    maxStage: maxStage,
    clearedAll: cleared >= maxStage,
    slots: filledSlots,
    deptSyns: deptSynCount,
    attrSyns: attrSynCount,
    milestones: milestoneCount,
    cardsOwned: CS.buildState.ownedCardIds,
    slotCards: CS.buildState.slotCards,
    deptSummary: deptSummary,
    deptCardCounts: CS.buildState.deptCardCounts,
    deptMilestones: CS.buildState.deptMilestones,
    activeDeptSynergies: CS.buildState.activeDeptSynergies,
    activeAttrSynergies: CS.buildState.activeAttrSynergies,
    weaponEvolutions: CS.buildState.weaponEvolutions,
    playerStats: {
      hp: game.player.hp, maxHp: game.player.maxHp, armor: game.player.armor,
      dodge: game.player.dodge, speed: game.player.speed, damageMult: game.player.damageMult,
      crit: game.player.crit, attackSpeed: game.player.attackSpeed, regen: game.player.regen,
      luck: game.player.luck, fortify: game.player.fortify
    },
    milestonesReached: CS.buildState.runLog.milestonesReached || [],
    synergiesTriggered: CS.buildState.runLog.synergiesTriggered || [],
    upgradesChosen: game.runLog.upgradesChosen || []
  };

  return report;
};

/** 鎵归噺娴嬭瘯 10 涓?Build */
window._testAllBuilds = function() {
  var builds = [
    { name: "1. 技术咖啡续杯", dept: "tech", weapon: "coffee", attrs: ["execution", "focus", "resilience"] },
    { name: "2. 产品马克笔爆点", dept: "product", weapon: "marker", attrs: ["execution", "slacking"] },
    { name: "3. 运营耳机护体", dept: "ops", weapon: "headphones", attrs: ["resilience", "social"] },
    { name: "4. 市场报表扩散", dept: "marketing", weapon: "report", attrs: ["social", "focus"] },
    { name: "5. 行政即时贴布阵", dept: "general", weapon: "sticky_note", attrs: ["focus", "expression"] },
    { name: "6. 技术连锁验证", dept: "tech", weapon: "coffee", attrs: ["execution", "slacking"] },
    { name: "7. 技术稳态交付", dept: "tech", weapon: "coffee", attrs: ["execution", "resilience"] },
    { name: "8. 产品快速上线", dept: "product", weapon: "marker", attrs: ["execution", "resilience"] },
    { name: "9. 技术表达混合", dept: "tech", weapon: "coffee", attrs: ["expression", "slacking"] },
    { name: "10. 运营协作稳场", dept: "ops", weapon: "headphones", attrs: ["slacking", "social"] }
  ];

  var results = [];
  for (var i = 0; i < builds.length; i++) {
    var b = builds[i];
    var r = window._testBuild(b.dept, b.weapon, b.attrs);
    r.name = b.name;
    results.push(r);
  }

  // 鎵撳嵃姹囨€昏〃
  console.log("\n========== BUILD TEST SUMMARY ==========");
  for (var j = 0; j < results.length; j++) {
    var r = results[j];
    var clearedIcon = r.clearedAll ? "[OK]" : "[FAIL]";
    var runMaxStage = r.maxStage || MAX_STAGE;
    var clearedText = r.clearedAll ? (runMaxStage + "/" + runMaxStage) : ("died stage " + r.deathStage);
    var deptCards = [];
    for (var dk in r.deptCardCounts) {
      if (r.deptCardCounts[dk] > 0) deptCards.push(dk + ":" + r.deptCardCounts[dk]);
    }
    var milestones = [];
    for (var dm in r.deptMilestones) {
      if (r.deptMilestones[dm] && r.deptMilestones[dm].length > 0) {
        milestones.push(dm + "[" + r.deptMilestones[dm].join(",") + "]");
      }
    }
    console.log(r.name + ": " + clearedIcon + " " + clearedText + " | deptCards:" + deptCards.join(",") + " | milestones:" + (milestones.join(";") || "none") + " | synergy:" + ((r.activeDeptSynergies || []).concat(r.activeAttrSynergies || []).join(",") || "none"));
  }
  console.log("========== END SUMMARY ==========");
  return results;
};

// 杈撳嚭：歸indow._testAllBuilds() 杩愯鎵€鏈?10 涓?Build 娴嬭瘯
console.log("[test] Run window._testAllBuilds() for batch build tests.");
