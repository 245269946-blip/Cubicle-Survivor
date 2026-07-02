// ============================================================
// data.js v2 — 工位幸存者 v0.3 修订版（模板系统）
// 目录: reforged/
// 核心变化：
//   1. 25 张卡 × 3+1 模板（不做 125 独立效果）
//   2. 6 属性（重命名）+ 部门主轴
//   3. 部门投资改阶段里程碑（2-3-4）
//   4. 8 种协同 + 面板可见
//   5. 新增协作任务数据
//   6. 武器进化由 Build 决定
// ============================================================

// ============================================================
// 第一部分: 部门定义（主轴）
// ============================================================

const DEPARTMENTS = {
  tech: {
    id: "tech",
    name: "技术部",
    emoji: "🔥",
    oneLiner: "高频、链式、自动化",
    battleStyle: "弹幕→连锁→清屏",
    color: "#4a9eff",
    weapons: ["coffee", "keyboard", "sticky_note"],
    weaponSets: {
      2: { desc: "链电伤害 +15%", bonus: { chainDmg: 1.15 } }
    }
  },
  product: {
    id: "product",
    name: "产品部",
    emoji: "⚡",
    oneLiner: "爆发、斩杀、窗口",
    battleStyle: "暴击→爆发→秒杀",
    color: "#ff6b4a",
    weapons: ["marker", "stapler", "keyboard"],
    weaponSets: {
      2: { desc: "暴击伤害 +20%", bonus: { critDmg: 1.20 } }
    }
  },
  ops: {
    id: "ops",
    name: "运营部",
    emoji: "🛡️",
    oneLiner: "生存、续航、阵地",
    battleStyle: "护盾→回复→持久",
    color: "#4acf6a",
    weapons: ["headphones", "thermos", "shredder"],
    weaponSets: {
      2: { desc: "护甲 +2，回复 +10%", bonus: { armor: 2, regen: 1.10 } }
    }
  },
  marketing: {
    id: "marketing",
    name: "市场部",
    emoji: "📢",
    oneLiner: "扩散、传播、范围",
    battleStyle: "AoE→感染→控制",
    color: "#cf6ae0",
    weapons: ["report", "shredder", "thermos"],
    weaponSets: {
      2: { desc: "范围 +15%，击退 +20%", bonus: { range: 1.15, knockback: 1.20 } }
    }
  },
  admin: {
    id: "admin",
    name: "综合部",
    emoji: "🏢",
    oneLiner: "资源、效率、泛用",
    battleStyle: "经济→冷却→灵活",
    color: "#e0c060",
    weapons: ["sticky_note", "stapler", "coffee"],
    weaponSets: {
      2: { desc: "经验 +15%，冷却 -10%", bonus: { xp: 1.15, cd: 0.90 } }
    }
  }
};

// ============================================================
// 第二部分: 属性定义（副轴，6 个 → MVP）
// ============================================================

const ATTRIBUTE_SLOTS = {
  execution: {
    id: "execution",
    name: "执行力",
    emoji: "💪",
    direction: "直接伤害",
    desc: "硬怼，不绕弯子。攻击/伤害效果被放大。",
    powerMultiplier: 1.15,       // 伤害类效果 +15%
    bestFor: ["tech", "product"],
    flavor: "干了再说"
  },
  focus: {
    id: "focus",
    name: "专注",
    emoji: "🎯",
    direction: "暴击/单体",
    desc: "精准打击。暴击和单体效果增强。",
    powerMultiplier: 1.10,       // 暴击类效果 +10%
    bestFor: ["product", "tech"],
    flavor: "一次只做一件事"
  },
  resilience: {
    id: "resilience",
    name: "抗压",
    emoji: "🛡️",
    direction: "生存/续航",
    desc: "扛得住。防御和回复效果增强。",
    powerMultiplier: 1.10,       // 防御类效果 +10%
    bestFor: ["ops", "admin"],
    flavor: "天塌了也能撑住"
  },
  slacking: {
    id: "slacking",
    name: "摸鱼",
    emoji: "🐟",
    direction: "闪避/资源",
    desc: "省力但高效。移速/拾取/经验类效果增强。",
    powerMultiplier: 1.05,       // 资源类效果 +5%（累积增长空间大）
    bestFor: ["admin", "ops"],
    flavor: "不是偷懒，是优化工作流"
  },
  expressiveness: {
    id: "expressiveness",
    name: "表达力",
    emoji: "📣",
    direction: "范围/扩散",
    desc: "铺开来打。范围/传播/击退效果增强。",
    powerMultiplier: 1.10,       // 范围类效果 +10%
    bestFor: ["marketing", "tech"],
    flavor: "让世界知道你在做什么"
  },
  social: {
    id: "social",
    name: "社交",
    emoji: "🤝",
    direction: "召唤/协同",
    desc: "大家一起上。联动和协同效果增强。",
    powerMultiplier: 1.00,       // 起步低，满槽时最高 +45%
    growthPerCard: 0.15,         // 同槽每多 1 张卡 +15%
    maxBonus: 0.45,
    bestFor: ["admin", "marketing"],
    flavor: "你的人脉就是你的武器"
  }
};

// ============================================================
// 第三部分: 槽位模板定义
// 5 个槽位 → 3 个通用模板 + 1 个部门专属 + 1 个代价
// ============================================================

const SLOT_TEMPLATES = {
  output: {
    id: "output",
    name: "输出槽",
    emoji: "⚔️",
    desc: "转化为伤害/攻击效果",
    flavor: "产出结果",
    powerBaseline: 1.00
  },
  survival: {
    id: "survival",
    name: "生存槽",
    emoji: "🛡️",
    desc: "转化为防御/回复效果",
    flavor: "保住自己",
    powerBaseline: 0.90
  },
  resource: {
    id: "resource",
    name: "资源槽",
    emoji: "💎",
    desc: "转化为经验/冷却/经济",
    flavor: "积累资本",
    powerBaseline: 0.85
  },
  mechanism: {
    id: "mechanism",
    name: "机制槽",
    emoji: "⚙️",
    desc: "改变触发方式/连锁逻辑（不同部门不同效果）",
    flavor: "改变游戏规则",
    powerBaseline: 1.10,
    deptSpecific: true
  },
  gamble: {
    id: "gamble",
    name: "代价槽",
    emoji: "⚠️",
    desc: "效果为输出槽的 1.5-2×，附带明确代价",
    flavor: "高风险高回报",
    powerBaseline: 1.70,
    hasCost: true
  }
};

// ============================================================
// 第四部分: 卡牌定义 — 模板化
// 每张卡 = 主题 + 部门 + 稀有度
// effects 只有 templateHooks: { output, survival, resource, mechanism, gamble }
// ============================================================

// 模板生成辅助函数
function cardEffect(output, survival, resource, mechanism, gamble) {
  return { output, survival, resource, mechanism, gamble };
}

const CARDS = {};

// ----- 技术部 🔥 5 张 -----

CARDS.agile_dev = {
  id: "agile_dev",
  name: "敏捷开发",
  department: "tech",
  rarity: "common",
  tagline: "快速写、快速上线、快速迭代。",
  effects: cardEffect(
    // output
    { desc: "击中 25% 触发链电，跳 2 次，伤害 12", type: "chain_lightning", triggerChance: 0.25, jumps: 2, chainDamage: 12 },
    // survival
    { desc: "链电每次跳转回血 2 HP", type: "chain_lifesteal", healPerJump: 2 },
    // resource
    { desc: "链电击杀额外 +3 经验", type: "chain_xp", bonusXp: 3 },
    // mechanism (技术专属：改触发方式)
    { desc: "链电跳转次数 = 2 + 技术卡总数", type: "chain_scaling", baseJumps: 2, bonusPerTechCard: 1 },
    // gamble
    { desc: "链电伤害 ×3，跳转 ×2，每秒扣 1% 当前 HP", type: "chain_gamble", dmgMult: 3.0, jumpMult: 2, hpCostPct: 0.01 }
  ),
  exclusions: [{ slots: ["gamble"] }, { slots: ["mechanism", "gamble"], reason: "同一个槽不能放两张卡" }]
};

CARDS.version_iter = {
  id: "version_iter",
  name: "版本迭代",
  department: "tech",
  rarity: "common",
  tagline: "每个版本都比上一个更强。",
  effects: cardEffect(
    { desc: "每 20s 永久 +3% 伤害，上限 5 层", type: "stacking_dmg", interval: 20000, perStack: 0.03, maxStacks: 5 },
    { desc: "满层时 +5 护甲", type: "stacking_armor", maxStacks: 5, armorAtCap: 5 },
    { desc: "满层时一次性 +8 经验", type: "stacking_xp", xpAtCap: 8 },
    { desc: "层数上限 +1（可达 6 层）", type: "stacking_extend", extraStacks: 1 },
    { desc: "间隔 20s→12s，每层扣 2 HP", type: "stacking_gamble", interval: 12000, perStack: 0.03, maxStacks: 5, hpCost: 2 }
  ),
  exclusions: []
};

CARDS.code_refactor = {
  id: "code_refactor",
  name: "代码重构",
  department: "tech",
  rarity: "rare",
  tagline: "把烂代码重写一遍。可能更优雅，可能直接崩。",
  prerequisite: { sameDeptCards: 1 },
  effects: cardEffect(
    { desc: "主武伤害统一为'重构'标签，忽略弱点抗性", type: "dmg_type_override", override: "refactored", ignoreResist: true },
    { desc: "被忽略的抗性伤害转为回血 3/次", type: "refactor_heal", healPerIgnore: 3 },
    { desc: "重构击杀额外掉落材料（+10%）", type: "refactor_drop", bonus: 0.10 },
    { desc: "重构标签共享给同槽其他武器", type: "refactor_share", shareToSlot: true },
    { desc: "重构伤害 +35%，3% 概率自伤 5", type: "refactor_gamble", dmgBonus: 0.35, selfDmgChance: 0.03, selfDmg: 5 }
  ),
  exclusions: [{ cardIds: ["agile_dev"], slots: ["gamble"], reason: "链电 + 重构双重自伤不可控" }]
};

CARDS.continuous_integration = {
  id: "continuous_integration",
  name: "持续集成",
  department: "tech",
  rarity: "rare",
  tagline: "每次提交自动跑测试。自动化，零失误。",
  prerequisite: { sameDeptCards: 1 },
  effects: cardEffect(
    { desc: "每 5 击杀所有武器 CD -0.5s", type: "cd_on_kill", kills: 5, reduction: 0.5 },
    { desc: "CD 缩减触发时回血 5", type: "cd_heal", healOnTrigger: 5 },
    { desc: "CD 缩减触发时 +3 经验", type: "cd_xp", xpOnTrigger: 3 },
    { desc: "CD 缩减翻倍（1s/5杀）", type: "cd_double", kills: 5, reduction: 1.0 },
    { desc: "CD 缩减 1s/5杀，触发时扣 3 HP", type: "cd_gamble", kills: 5, reduction: 1.0, hpCost: 3 }
  ),
  exclusions: []
};

CARDS.tech_breakthrough = {
  id: "tech_breakthrough",
  name: "技术突破",
  department: "tech",
  rarity: "legendary",
  tagline: "你把整个技术栈推倒重来了。结果是革命性的。",
  prerequisite: { sameDeptCards: 3 },
  legendary: true,
  effects: cardEffect(
    { desc: "链电改为同时击中 5 个最近敌人，伤害 ×3", type: "chain_simul", targets: 5, dmgMult: 3.0 },
    { desc: "链电每击杀回复 5 HP", type: "chain_vamp", healPerKill: 5 },
    { desc: "全武器 CD -30%", type: "global_cd", reduction: 0.30 },
    { desc: "激活全屏链电风暴：持续 5s，每 0.5s 造成伤害", type: "chain_storm", duration: 5000, interval: 500 },
    { desc: "4% 概率全屏同时链电一次", type: "chain_global", chance: 0.04 }
  ),
  exclusions: [{ anyLegendary: true, reason: "本局限 1 张传说" }]
};

// ----- 产品部 ⚡ 5 张 -----

CARDS.emergency_launch = {
  id: "emergency_launch",
  name: "紧急上线",
  department: "product",
  rarity: "common",
  tagline: "管他有没有 Bug，先上了再说。",
  effects: cardEffect(
    { desc: "攻速 +35%", type: "attack_speed", value: 35 },
    { desc: "攻速触发时回血 1", type: "as_heal", healPerTick: 1 },
    { desc: "攻速触发时材料掉落 +3%", type: "as_drop", dropBonus: 0.03 },
    { desc: "攻速加成每 10s 累计 +5%（上限按技术卡×2）", type: "as_ramp", rampPer10s: 5, maxFromTech: "×2" },
    { desc: "攻速 +55%，每 10 次攻击需 0.5s Bug修复停顿", type: "as_gamble", value: 55, attacksPerBug: 10, bugDuration: 500 }
  ),
  exclusions: []
};

CARDS.rapid_iteration = {
  id: "rapid_iteration",
  name: "快速迭代",
  department: "product",
  rarity: "common",
  tagline: "今天的版本比昨天好一点点。",
  effects: cardEffect(
    { desc: "暴击率 +8%", type: "crit_rate", value: 8 },
    { desc: "暴击回血 3 HP", type: "crit_heal", healOnCrit: 3 },
    { desc: "暴击击杀额外 +4 经验", type: "crit_xp", bonusXp: 4 },
    { desc: "暴击时触发人脉联动：人脉槽武器 3s 内 +15% 暴击率", type: "crit_network", buffDuration: 3000, buffValue: 15 },
    { desc: "暴击率 +13%，非暴击伤害 -15%", type: "crit_gamble", value: 13, nonCritPenalty: 0.15 }
  ),
  exclusions: []
};

CARDS.deadline = {
  id: "deadline",
  name: "截止日期",
  department: "product",
  rarity: "rare",
  tagline: "明天必须上线。今晚通宵。",
  prerequisite: { sameDeptCards: 1 },
  effects: cardEffect(
    { desc: "对 <50% HP 敌人伤害 +40%", type: "execute", threshold: 0.50, dmgBonus: 0.40 },
    { desc: "斩杀回复 5% 最大 HP", type: "execute_heal", healPct: 0.05 },
    { desc: "斩杀额外 +2 材料", type: "execute_mats", bonusMats: 2 },
    { desc: "低血目标被标记，所有武器对其伤害 +15%", type: "execute_mark", sharedBonus: 0.15 },
    { desc: "对 <50% HP 伤害 +80%，击杀扣 1% 当前 HP", type: "execute_gamble", threshold: 0.50, dmgBonus: 0.80, hpCost: 0.01 }
  ),
  exclusions: [{ slots: ["gamble"], cardIds: ["emergency_launch"], reason: "攻速+扣血→快速自杀" }]
};

CARDS.kpi_review = {
  id: "kpi_review",
  name: "KPI 考核",
  department: "product",
  rarity: "rare",
  tagline: "这个季度的 KPI 达标了吗？",
  prerequisite: { sameDeptCards: 1 },
  effects: cardEffect(
    { desc: "每 8 击杀 +10% 伤害 8s，可叠 3 层", type: "kill_streak", kills: 8, perStack: 0.10, duration: 8000, maxStacks: 3 },
    { desc: "连杀层数满时回血 8", type: "streak_heal", healAtCap: 8 },
    { desc: "每层连杀 +2 经验/击杀", type: "streak_xp", xpPerStackPerKill: 2 },
    { desc: "连杀层上限 +2（可达 5 层）", type: "streak_extend", extraStacks: 2 },
    { desc: "触发 8杀→5杀，每层受伤害 +10%", type: "streak_gamble", kills: 5, perStack: 0.10, maxStacks: 3, dmgTakenPerStack: 0.10 }
  ),
  exclusions: []
};

CARDS.product_launch = {
  id: "product_launch",
  name: "产品发布",
  department: "product",
  rarity: "legendary",
  tagline: "V1.0 正式上线！全公司瞩目。",
  prerequisite: { sameDeptCards: 3 },
  legendary: true,
  effects: cardEffect(
    { desc: "暴击产生 80px 爆炸，伤害 = 暴击的 80%，1.5s CD", type: "crit_explosion", radius: 80, ratio: 0.80, cd: 1500 },
    { desc: "爆炸回血 15% 最大 HP", type: "explosion_heal", healPct: 0.15 },
    { desc: "爆炸击杀 +10 经验", type: "explosion_xp", bonusXp: 10 },
    { desc: "爆炸半径 + 卡牌总数 ×8px", type: "explosion_scaling", baseRadius: 80, radiusPerCard: 8 },
    { desc: "爆炸无冷却，每次扣 3% HP", type: "explosion_gamble", radius: 80, ratio: 0.80, noCd: true, hpCost: 0.03 }
  ),
  exclusions: [{ anyLegendary: true }]
};

// ----- 运营部 🛡️ 5 张 -----

CARDS.process_approval = {
  id: "process_approval",
  name: "流程审批",
  department: "ops",
  rarity: "common",
  tagline: "按流程来，不会出错。",
  effects: cardEffect(
    { desc: "护甲 +2，伤害减免 +8%", type: "armor", value: 2, reduction: 0.08 },
    { desc: "护甲衰减时回血 4", type: "armor_heal", healOnDeplete: 4 },
    { desc: "护甲满值时材料掉落 +5%", type: "armor_drop", dropBonus: 0.05 },
    { desc: "护甲共享给同槽武器（60px 光环，30% 效果）", type: "armor_share", radius: 60, ratio: 0.30 },
    { desc: "护甲 +4，减免 +15%，受击 -1 护甲（30s 恢复）", type: "armor_gamble", value: 4, reduction: 0.15, lossPerHit: 1, recovery: 30000 }
  ),
  exclusions: []
};

CARDS.backup_recovery = {
  id: "backup_recovery",
  name: "备份恢复",
  department: "ops",
  rarity: "common",
  tagline: "数据丢了不怕，我们有备份。",
  effects: cardEffect(
    { desc: "每 30s 自动回复 15% 最大 HP", type: "regen", interval: 30000, healPct: 0.15 },
    { desc: "回复量 +10%", type: "regen_boost", bonus: 0.10 },
    { desc: "回复触发时 +5 材料", type: "regen_mats", bonusMats: 5 },
    { desc: "回复范围 80px（治疗同槽友军）", type: "regen_aura", radius: 80 },
    { desc: "每 20s 回复 22%，期间受伤害 +20%", type: "regen_gamble", interval: 20000, healPct: 0.22, dmgPenalty: 0.20 }
  ),
  exclusions: [{ cardIds: ["disclaimer"], slots: ["output", "survival"], reason: "回复 + 伤害延迟 = 无限容错" }]
};

CARDS.compliance_check = {
  id: "compliance_check",
  name: "合规审查",
  department: "ops",
  rarity: "rare",
  tagline: "法务部检查过了，没问题。",
  prerequisite: { sameDeptCards: 1 },
  effects: cardEffect(
    { desc: "每 25s 清除负面 + 3s 伤害 +15%", type: "cleanse", interval: 25000, buffDuration: 3000, dmgBonus: 0.15 },
    { desc: "清除时回血 10", type: "cleanse_heal", heal: 10 },
    { desc: "清除时 +5 材料", type: "cleanse_mats", bonusMats: 5 },
    { desc: "清除后 4s 免伤", type: "cleanse_invuln", duration: 4000 },
    { desc: "伤害增益翻倍（+30%），清除后护甲归零 3s", type: "cleanse_gamble", dmgBonus: 0.30, armorZero: 3000 }
  ),
  exclusions: []
};

CARDS.disclaimer = {
  id: "disclaimer",
  name: "免责声明",
  department: "ops",
  rarity: "rare",
  tagline: "这个责任不在我们部门。",
  prerequisite: { sameDeptCards: 1 },
  effects: cardEffect(
    { desc: "受击伤害进入审批队列，3s 后扣除，满 HP 时消失", type: "dmg_delay", delay: 3000, cancelOnFullHp: true },
    { desc: "待审批期间回血速率 +50%", type: "delay_heal", healBoost: 0.50 },
    { desc: "每审批完一批伤害 +3 经验", type: "delay_xp", xpPerBatch: 3 },
    { desc: "队列伤害 30% 转移至人脉槽承担", type: "delay_share", sharePct: 0.30 },
    { desc: "审批延迟 1.5s，队列清空时扣 5% 最大 HP", type: "delay_gamble", delay: 1500, emptyPenalty: 0.05 }
  ),
  exclusions: [{ cardIds: ["backup_recovery"], reason: "延迟 + 回复 = 无限容错" }]
};

CARDS.fullstack_ops = {
  id: "fullstack_ops",
  name: "全栈运营",
  department: "ops",
  rarity: "legendary",
  tagline: "从前端到后端，一个人全包了。",
  prerequisite: { sameDeptCards: 3 },
  legendary: true,
  effects: cardEffect(
    { desc: "<50% HP 获无敌 2s + 回复 30%（60s CD）", type: "emergency", threshold: 0.50, invuln: 2000, heal: 0.30, cd: 60000 },
    { desc: "无敌结束时额外回复 20%", type: "emergency_heal", bonusHeal: 0.20 },
    { desc: "无敌触发时全武器 CD 刷新", type: "emergency_refresh" },
    { desc: "无敌触发时引爆人脉槽所有卡牌效果 ×2（3s）", type: "emergency_network", buffDuration: 3000, multiplier: 2.0 },
    { desc: "过载：攻速 ×3 移速 ×2，3s 后 HP=1", type: "emergency_overload", duration: 3000, asMult: 3.0, msMult: 2.0, hpToOne: true }
  ),
  exclusions: [{ anyLegendary: true }, { cardIds: ["disclaimer"], reason: "双保险无敌" }]
};

// ----- 市场部 📢 5 张 -----

CARDS.brand_impact = {
  id: "brand_impact",
  name: "品牌影响",
  department: "marketing",
  rarity: "common",
  tagline: "品牌效应，挡都挡不住。",
  effects: cardEffect(
    { desc: "身边 120px 敌人每 0.8s 推开 20px + 伤害 8", type: "aura_knockback", radius: 120, interval: 800, knockback: 20, damage: 8 },
    { desc: "推开敌人时回血 3", type: "aura_heal", healPerTick: 3 },
    { desc: "推开击杀额外 +2 材料", type: "aura_mats", bonusMats: 2 },
    { desc: "被推开敌人触发人脉槽武器弱攻击（60% 伤害）", type: "aura_network", synergyDmg: 0.60 },
    { desc: "击退 40px 伤翻倍，每 0.8s 扣 2 HP", type: "aura_gamble", knockback: 40, damage: 16, hpCost: 2 }
  ),
  exclusions: []
};

CARDS.channel_promotion = {
  id: "channel_promotion",
  name: "渠道推广",
  department: "marketing",
  rarity: "common",
  tagline: "多铺渠道，自然有流量。",
  effects: cardEffect(
    { desc: "拾取范围 +40%，材料掉落 +8%", type: "pickup", rangeBonus: 0.40, dropRate: 0.08 },
    { desc: "拾取材料时回血 2", type: "pickup_heal", healPerPickup: 2 },
    { desc: "拾取经验值 +15%", type: "pickup_xp", xpBonus: 0.15 },
    { desc: "拾取效果同步至人脉槽", type: "pickup_share", syncToSlot: true },
    { desc: "拾取 +80%，5% 材料被渠道扣点", type: "pickup_gamble", rangeBonus: 0.80, lossChance: 0.05 }
  ),
  exclusions: []
};

CARDS.viral_marketing = {
  id: "viral_marketing",
  name: "病毒营销",
  department: "marketing",
  rarity: "rare",
  tagline: "一条朋友圈，全公司都在转。",
  prerequisite: { sameDeptCards: 1 },
  effects: cardEffect(
    { desc: "击中获病毒标记 4s，秒扩散 1 敌人/80px，标记受伤害 +12%", type: "viral", duration: 4000, spread: 1, radius: 80, dmgAmp: 0.12 },
    { desc: "病毒标记到期时回血 3/个", type: "viral_heal", healPerExpire: 3 },
    { desc: "病毒扩散击杀 +3 经验", type: "viral_xp", bonusXp: 3 },
    { desc: "扩散敌人 50% 概率触发人脉槽攻击", type: "viral_network", triggerChance: 0.50 },
    { desc: "扩散速度 ×2（2 个/秒），标记到期时受扩散总数 ×1 伤害", type: "viral_gamble", spread: 2, selfDmgPerExpire: 1 }
  ),
  exclusions: [{ slots: ["gamble"], reason: "大扩散量扣血不可控" }]
};

CARDS.hit_strategy = {
  id: "hit_strategy",
  name: "爆款策略",
  department: "marketing",
  rarity: "rare",
  tagline: "不鸣则已，一鸣惊人。",
  prerequisite: { sameDeptCards: 1 },
  effects: cardEffect(
    { desc: "每 15 击杀全武器伤害 ×2，2s", type: "hit_event", kills: 15, dmgMult: 2.0, duration: 2000 },
    { desc: "爆款期间回血速率 ×3", type: "hit_heal", healMult: 3.0 },
    { desc: "爆款期间经验 ×2", type: "hit_xp", xpMult: 2.0 },
    { desc: "爆款触发时人脉槽也进入爆款", type: "hit_share", syncToSlot: true },
    { desc: "击杀 12 触发，伤害 ×3，持续 1.2s", type: "hit_gamble", kills: 12, dmgMult: 3.0, duration: 1200 }
  ),
  exclusions: []
};

CARDS.global_launch = {
  id: "global_launch",
  name: "全域投放",
  department: "marketing",
  rarity: "legendary",
  tagline: "不在工位——在全域。",
  prerequisite: { sameDeptCards: 3 },
  legendary: true,
  effects: cardEffect(
    { desc: "所有武器范围覆盖全屏，伤害 ×0.7", type: "global_range", fullScreen: true, dmgMult: 0.70 },
    { desc: "全屏攻击每 5 击杀回 10 HP", type: "global_heal", killsPerHeal: 5, heal: 10 },
    { desc: "全屏攻击击杀经验 ×1.5", type: "global_xp", xpMult: 1.5 },
    { desc: "全屏攻击同步人脉槽武器", type: "global_share", syncToSlot: true },
    { desc: "全屏 ×1.2 伤，击杀扣 1% HP", type: "global_gamble", dmgMult: 1.20, hpCost: 0.01 }
  ),
  exclusions: [{ anyLegendary: true }, { cardIds: ["brand_impact"], reason: "全屏 + 击退 = 零交互" }]
};

// ----- 综合部 🏢 5 张 -----

CARDS.morning_meeting = {
  id: "morning_meeting",
  name: "晨会",
  department: "admin",
  rarity: "common",
  tagline: "每天早上站 15 分钟——今天的活都清楚了。",
  effects: cardEffect(
    { desc: "升级选项 +1（4 选 1）", type: "extra_choice", bonus: 1 },
    { desc: "每次升级回血 5", type: "choice_heal", heal: 5 },
    { desc: "每次升级额外 +5 经验", type: "choice_xp", bonusXp: 5 },
    { desc: "多出的选项优先出现人脉槽卡牌部门", type: "choice_network", prioritize: true },
    { desc: "选项 +2，本关移速 -8%（会议室坐久了）", type: "choice_gamble", bonus: 2, msPenalty: -0.08 }
  ),
  exclusions: []
};

CARDS.standard_sop = {
  id: "standard_sop",
  name: "SOP 标准化",
  department: "admin",
  rarity: "common",
  tagline: "标准化流程——效率提升。",
  effects: cardEffect(
    { desc: "所有冷却/触发间隔 -15%", type: "cooldown", reduction: 0.15 },
    { desc: "冷却完成时回血 3", type: "cd_heal", healOnReady: 3 },
    { desc: "冷却完成时 +2 材料", type: "cd_mats", matsOnReady: 2 },
    { desc: "冷却缩减同步人脉槽卡牌", type: "cd_share", syncToSlot: true },
    { desc: "冷却 -25%，触发后 8% 概率冻结 1s", type: "cd_gamble", reduction: 0.25, freezeChance: 0.08, freezeDuration: 1000 }
  ),
  exclusions: [{ slots: ["gamble"], reason: "冻结 1s 关键时刻致命" }]
};

CARDS.record_archive = {
  id: "record_archive",
  name: "留痕存档",
  department: "admin",
  rarity: "rare",
  tagline: "所有事情都有记录。找起来也快。",
  prerequisite: { sameDeptCards: 1 },
  effects: cardEffect(
    { desc: "经验 +25%，材料 +15%", type: "resource", xpBonus: 0.25, matBonus: 0.15 },
    { desc: "存档时回血（每级 5 HP）", type: "archive_heal", healPerLevel: 5 },
    { desc: "存档经验共享给同槽其他效果", type: "archive_share_xp", ratio: 0.50 },
    { desc: "经验+材料共享给同槽卡牌 30%", type: "archive_network", shareRatio: 0.30 },
    { desc: "经验 +50%、材料 +30%，每升级消耗 5 材料", type: "archive_gamble", xpBonus: 0.50, matBonus: 0.30, matCost: 5 }
  ),
  exclusions: []
};

CARDS.auto_office = {
  id: "auto_office",
  name: "自动办公",
  department: "admin",
  rarity: "rare",
  tagline: "AI 代劳——你看着就行。",
  prerequisite: { sameDeptCards: 1 },
  effects: cardEffect(
    { desc: "每 12s 自动释放最高等级武器 Lv.1 攻击（60% 伤害）", type: "auto_attack", interval: 12000, ratio: 0.60, weaponLevel: 1 },
    { desc: "自动攻击回血 3/次", type: "auto_heal", heal: 3 },
    { desc: "自动攻击击杀 +5 经验", type: "auto_xp", bonusXp: 5 },
    { desc: "自动释放同时触发人脉槽协同攻击", type: "auto_network", syncToSlot: true },
    { desc: "伤害 100%，间隔 8s，每次扣 3 HP", type: "auto_gamble", interval: 8000, ratio: 1.0, hpCost: 3 }
  ),
  exclusions: []
};

CARDS.org_restructure = {
  id: "org_restructure",
  name: "组织架构调整",
  department: "admin",
  rarity: "legendary",
  tagline: "HR 发通告了——部门重组。重新配置一切。",
  prerequisite: { sameDeptCards: 3 },
  legendary: true,
  effects: cardEffect(
    { desc: "本局已有卡牌可免费重新分配任意槽位（一次性）", type: "mass_reassign", oneTime: true },
    { desc: "重分配时全回复", type: "reassign_full_heal" },
    { desc: "重分配后所有经验奖励翻倍 60s", type: "reassign_xp_boost", duration: 60000, mult: 2.0 },
    { desc: "重分配保留所有人脉联动关系", type: "reassign_network", preserveLinks: true },
    { desc: "重分配 ×1.3 效果，每张卡扣 3% 最大 HP", type: "reassign_gamble", effectMult: 1.30, hpCost: 0.03 }
  ),
  exclusions: [{ anyLegendary: true }]
};

// ============================================================
// 第五部分: 协同（8 种 MVP）
// ============================================================

const SYNERGIES = {

  // --- 部门协同（4 种）---
  dept_tech_product: {
    id: "dept_tech_product",
    name: "敏捷创新",
    type: "department",
    depts: ["tech", "product"],
    desc: "暴击 30% 触发链电，链电 30% 附加暴击",
    triggerStage: 6,
    effect: { critChainChance: 0.30, chainCritChance: 0.30 }
  },
  dept_product_marketing: {
    id: "dept_product_marketing",
    name: "爆款策略",
    type: "department",
    depts: ["product", "marketing"],
    desc: "暴击击退 40px，路径留 3s 伤害区域（暴击伤害 ×30%）",
    triggerStage: 6,
    effect: { critKnockback: 40, trailDuration: 3000, trailDmgRatio: 0.30 }
  },
  dept_ops_marketing: {
    id: "dept_ops_marketing",
    name: "标准运营",
    type: "department",
    depts: ["ops", "marketing"],
    desc: "站立时所有范围伤害覆盖全屏 ×0.6",
    triggerStage: 6,
    effect: { standStillFullScreen: true, ratio: 0.60 }
  },
  dept_marketing_admin: {
    id: "dept_marketing_admin",
    name: "全面投放",
    type: "department",
    depts: ["marketing", "admin"],
    desc: "拾取范围 ×2，所有掉落材料自动吸附",
    triggerStage: 6,
    effect: { pickupRangeMult: 2.0, autoCollect: true }
  },

  // --- 属性协同（4 种）---
  attr_execution_focus: {
    id: "attr_execution_focus",
    name: "学以致用",
    type: "attribute",
    slots: ["execution", "focus"],
    desc: "执行力槽效果 + 专注槽卡数 ×5%（上限 +20%）",
    triggerStage: 8,
    effect: { executionSlotBoost: "focusCardCount * 0.05", maxBonus: 0.20 }
  },
  attr_resilience_social: {
    id: "attr_resilience_social",
    name: "兄弟同心",
    type: "attribute",
    slots: ["resilience", "social"],
    desc: "抗压槽负面效果由社交槽分担 30%",
    triggerStage: 8,
    effect: { penaltyShared: 0.30 }
  },
  attr_slacking_focus: {
    id: "attr_slacking_focus",
    name: "厚积薄发",
    type: "attribute",
    slots: ["slacking", "focus"],
    desc: "摸鱼槽蓄力满 100 → 专注槽下次暴击 ×2",
    triggerStage: 8,
    effect: { chargePerSec: 5, threshold: 100, nextCritMult: 2.0 }
  },
  attr_expressiveness_execution: {
    id: "attr_expressiveness_execution",
    name: "孤注一掷",
    type: "attribute",
    slots: ["expressiveness", "execution"],
    desc: "表达力代价 ×1.3 → 执行力正面 ×1.5",
    triggerStage: 8,
    effect: { costMult: 1.30, benefitMult: 1.50 }
  }
};

// ============================================================
// 第六部分: 部门投资阶段里程碑
// ============================================================

const DEPARTMENT_MILESTONES = {
  2: { desc: "部门基础协同激活", valueBonus: 0.10 },      // 2 张同部门 → +10%
  3: { desc: "部门机制强化", valueBonus: 0.15 },           // 3 张 → +15%
  4: { desc: "部门终局套装", valueBonus: 0.20 }            // 4 张 → +20%（上限，5+ 不叠）
};

// ============================================================
// 第七部分: 协作任务
// ============================================================

const COLLAB_QUESTS = [
  {
    id: "collab_tech_marketing",
    stage: 3,
    chance: 0.60,
    narrative: "技术部想和市场部联合发布一个新功能",
    requires: { depts: ["tech", "marketing"], minEach: 1 },
    reward: { type: "free_card", desc: "免费获得 1 张随机卡牌" },
    hint: "如果你有 1 张技术卡 + 1 张市场卡，白嫖一张卡"
  },
  {
    id: "collab_ops_admin",
    stage: 6,
    chance: 0.40,
    narrative: "运营部向综合部借调一个人手——双十一要到了",
    requires: { depts: ["ops", "admin"], minEach: 1 },
    reward: { type: "shop_discount", desc: "商店本次半价", value: 0.50 },
    hint: "如果你有 1 张运营卡 + 1 张综合卡，商店半价"
  },
  {
    id: "collab_product_tech",
    stage: 9,
    chance: 0.30,
    narrative: "产品部的 P0 故障需要技术部救火——全组等你们",
    requires: { depts: ["product", "tech"], minEach: 1 },
    reward: { type: "emergency_buff", desc: "全武器 CD 刷新 + 15s 增益（伤害 +25%）", duration: 15000, dmgBonus: 0.25 },
    hint: "如果你有 1 张产品卡 + 1 张技术卡，紧急增益"
  }
];

// ============================================================
// 第八部分: 武器数据
// ============================================================

const WEAPON_INFO = {
  coffee:      { name: "挂耳咖啡", emoji: "☕", dept: "tech", desc: "弹幕射击，自动瞄准最近敌人" },
  keyboard:    { name: "键盘", emoji: "⌨️", dept: "tech", desc: "近战挥击，方向控制" },
  marker:      { name: "马克笔", emoji: "🖊️", dept: "product", desc: "蓄力贯穿，鼠标瞄准" },
  stapler:     { name: "订书机", emoji: "📎", dept: "product", desc: "扇形弹幕，方向覆盖" },
  headphones:  { name: "降噪耳机", emoji: "🎧", dept: "ops", desc: "轨道报表，站桩生成" },
  thermos:     { name: "保温杯", emoji: "🫖", dept: "ops", desc: "蒸汽爆发，蓄茶治疗" },
  report:      { name: "季度报表", emoji: "📊", dept: "marketing", desc: "轨道环绕，碎片伤害" },
  shredder:    { name: "碎纸机", emoji: "🗑️", dept: "marketing", desc: "锥形绞碎，定向持续" },
  sticky_note: { name: "即时贴", emoji: "🟨", dept: "admin", desc: "陷阱放置，区域伤害" }
};

// ============================================================
// 第九部分: 武器 Lv.7 进化表（由 Build 条件决定）
// ============================================================

const WEAPON_EVOLUTIONS = {
  coffee: {
    conditions: [
      { name: "意式浓缩", desc: "弹幕数 +50%，弹速 ×1.5", narrative: "你终于配了台正经咖啡机",
        requires: { sameDeptCards: 2, dept: "tech" }, effect: { projectileMult: 1.5, speedMult: 1.5 } },
      { name: "保温壶", desc: "弹幕变轨道环绕，击中回血 3", narrative: "续杯自由——运营的终极特权",
        requires: { sameDeptCards: 2, dept: "ops" }, effect: { orbitMode: true, healPerHit: 3 } },
      { name: "Deadline 特饮", desc: "弹幕击中标记 Debuff，标记叠加暴击", narrative: "通宵三天的结晶",
        requires: { crossDeptCards: { tech: 1, product: 1 } }, effect: { markOnHit: true, markCritBonus: 1.5 } },
      { name: "速溶咖啡", desc: "弹幕 +20%，弹速 +15%", narrative: "凑合喝吧",
        requires: null, effect: { projectileMult: 1.2, speedMult: 1.15 } }
    ]
  },
  keyboard: {
    conditions: [
      { name: "机械风暴", desc: "挥击范围 +60%，攻速 +20%", narrative: "换了机械键盘——手感不一样了",
        requires: { sameDeptCards: 2, dept: "tech" }, effect: { rangeMult: 1.6, asMult: 1.2 } },
      { name: "高压电容", desc: "近战暴击触发静电 AoE（120px/50% 伤害）", narrative: "电容老化漏电了——但你发现这挺好用的",
        requires: { sameDeptCards: 2, dept: "product" }, effect: { critStatic: { radius: 120, dmgRatio: 0.50 } } },
      { name: "静音模式", desc: "挥击无声但击中减速敌人 50% / 2s", narrative: "你终于买了一把静音键盘——同事们很感激",
        requires: { crossDeptCards: { tech: 1, ops: 1 } }, effect: { slowOnHit: { amount: 0.50, duration: 2000 } } },
      { name: "薄膜键盘", desc: "攻速 +10%，范围 +15%", narrative: "凑合用吧",
        requires: null, effect: { asMult: 1.1, rangeMult: 1.15 } }
    ]
  },
  marker: {
    conditions: [
      { name: "永不褪色", desc: "贯穿残留减速带 3s，接触伤害 20/s", narrative: "你终于找到了一支永不褪色的马克笔",
        requires: { sameDeptCards: 2, dept: "product" }, effect: { trail: { duration: 3000, dps: 20 } } },
      { name: "复印笔", desc: "蓄力满自动复制一发贯穿（60% 伤害）", narrative: "复印店老板教你的一招",
        requires: { sameDeptCards: 2, dept: "admin" }, effect: { cloneOnFull: { dmgRatio: 0.60 } } },
      { name: "荧光笔", desc: "贯穿击中敌人高亮 5s，全武器对高亮敌人暴击 +15%", narrative: "在文具店无意发现的——荧光色版本",
        requires: { crossDeptCards: { product: 1, marketing: 1 } }, effect: { highlight: { duration: 5000, critBonus: 15 } } },
      { name: "油性笔", desc: "伤害 +20%，贯穿宽度 +30%", narrative: "公司发的标配——能写字就行",
        requires: null, effect: { dmgMult: 1.2, widthMult: 1.3 } }
    ]
  }
};

// ============================================================
// 第十部分: 关卡叙事（14 关内文，挂在 5 阶段上）
// ============================================================

const STAGE_NARRATIVES = {
  // 入职期
  1: "第一天上班，工位上全是 Bug。先解决它们——或者它们解决你。",
  2: "产品经理说'就改一个小需求'。改了三十个。",
  // 试用期
  3: "下午三点，你同时收到五个会议邀请。他们开始包围你的工位。",
  4: "还有七天 Deadline。你开始每天喝四杯咖啡。",
  5: "Leader 要看你这个月的复盘。数据好不好看，决定你的转正。",
  // 转正期
  6: "Q2 绩效考核开始了。你的 OKR 达标了吗？",
  7: "周五晚上十点，P0 故障。全组紧急上线。",
  8: "隔壁部门的 PM 又来'拉齐'了——不给他们看代码是不行了。",
  9: "年底封版，预算已经花完了。剩的每一行代码都要省着写。",
  // 老员工
  10: "审计的人来了。把你过去一年的代码全部翻出来逐行检查。",
  11: "HR 发通告了：部门重组。你的 Leader 换了一个你不认识的人。",
  12: "灰度发布出了一次大事故。用户投诉涌进来，秒级响应。",
  13: "明天是年终述职。你今天必须把 PPT 做完。",
  // 终局
  14: "CEO 推门走进会议室。他看着你的 PPT，问了一个问题……"
};

// ============================================================
// 第十一部分: 开局预设（新手版）
// ============================================================

const NEWBIE_PRESETS = [
  {
    id: "tech_intern",
    label: "🔥 技术实习生",
    dept: "tech",
    attributes: ["focus", "execution"],
    weapon: "coffee",
    oneLiner: "弹幕扫射，链电清屏"
  },
  {
    id: "product_worker",
    label: "⚡ 产品打工人",
    dept: "product",
    attributes: ["execution", "expressiveness"],
    weapon: "marker",
    oneLiner: "蓄力贯穿，暴击秒杀"
  },
  {
    id: "ops_veteran",
    label: "🛡️ 运营老兵",
    dept: "ops",
    attributes: ["resilience", "social"],
    weapon: "headphones",
    oneLiner: "阵地防守，稳扎稳打"
  },
  {
    id: "marketing_newbie",
    label: "📢 市场新人",
    dept: "marketing",
    attributes: ["expressiveness", "social"],
    weapon: "report",
    oneLiner: "轨道环绕，范围感染"
  }
];

// ============================================================
// 第十二部分: 永久升级商店
// ============================================================

const PERMANENT_UPGRADES = {
  vitality:    { id: "vitality", name: "强身健体", desc: "+5% 最大 HP/级", maxLevel: 5, costs: [2,4,6,8,10], perLevel: { maxHp: 0.05 } },
  output:      { id: "output", name: "精益求精", desc: "+2% 伤害/级", maxLevel: 5, costs: [2,4,6,8,10], perLevel: { dmg: 0.02 } },
  armor:       { id: "armor", name: "铁甲护体", desc: "+1 护甲/级", maxLevel: 5, costs: [1,2,3,4,5], perLevel: { armor: 1 } },
  precision:   { id: "precision", name: "火眼金睛", desc: "+2% 暴击率/级", maxLevel: 5, costs: [2,3,4,5,6], perLevel: { critRate: 0.02 } },
  agility:     { id: "agility", name: "健步如飞", desc: "+3% 移速/级", maxLevel: 5, costs: [2,3,4,5,6], perLevel: { moveSpeed: 0.03 } }
};

// ============================================================
// 导出
// ============================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DEPARTMENTS, ATTRIBUTE_SLOTS, SLOT_TEMPLATES, CARDS,
    SYNERGIES, DEPARTMENT_MILESTONES, COLLAB_QUESTS,
    WEAPON_INFO, WEAPON_EVOLUTIONS, STAGE_NARRATIVES,
    NEWBIE_PRESETS, PERMANENT_UPGRADES
  };
}
