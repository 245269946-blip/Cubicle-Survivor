// ================================================================
// src/data/cards.js — 卡牌数据定义（25 张卡 × 5 槽模板）
// 命名空间: CS.cards
//
// 槽位: offense / survival / resource / mechanic / cost
// 每张卡 = 1 个主题 × 5 种功能位置变体
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});

  // 快捷构造器
  function makeCard(id, name, department, rarity, theme, desc, slotEffects, role, tags) {
    return { id, name, department, rarity, theme, description: desc, slotEffects, role: role || "starter", tags: tags || [] };
  }

  function slot(label, desc, powerBudget, effectType, params, conflicts, cost) {
    return { label, description: desc, powerBudget, effectType, params: params || {}, conflicts: conflicts || [], cost: cost || null };
  }

  CS.cards = {};

  // =====================================================================
  // 🔥 技术部（5 张）
  // =====================================================================

  // --- 普通 ---
  CS.cards.agile_dev = makeCard(
    "agile_dev", "敏捷开发", "tech", "common", "链电",
    "快速写、快速上线、快速迭代。击中敌人时有概率触发链电。",
    {
      offense: slot("输出", "击中 25% 触发链电，跳 2 次，伤害 12",
        1.00, "chain_lightning", { chainTriggerChance: 0.25, chainJumps: 2, chainDamage: 12 }),
      survival: slot("生存", "链电每次跳转回血 2 HP",
        0.90, "chain_lifesteal", { healPerJump: 2 }),
      resource: slot("资源", "链电击杀额外 +3 经验",
        0.85, "chain_xp", { bonusXp: 3 }),
      mechanic: slot("机制", "链电跳转次数 = 2 + 同槽部门卡总数",
        1.10, "chain_scaling", { baseJumps: 2, bonusPerDeptCard: 1 }),
      cost: slot("代价", "链电伤害 ×3，跳转 ×2，每秒扣 1% 当前 HP",
        1.70, "chain_gamble", { chainDmgMult: 3.0, chainJumpMult: 2, hpCostPct: 0.01 },
        [{ type: "dmg_taken", desc: "每秒扣 1% 当前 HP" }])
    }
  , "starter", ["chain","network"]);

  CS.cards.version_iter = makeCard(
    "version_iter", "版本迭代", "tech", "common", "累积",
    "每个版本都比上一个更强。随时间积累永久伤害加成。",
    {
      offense: slot("输出", "每 20s 永久 +3% 伤害，上限 5 层",
        1.00, "stacking_dmg", { interval: 20000, perStack: 0.03, maxStacks: 5 }),
      survival: slot("生存", "满层时 +5 护甲",
        0.90, "stacking_armor", { maxStacks: 5, armorAtCap: 5 }),
      resource: slot("资源", "满层时一次性 +8 经验",
        0.85, "stacking_xp", { xpAtCap: 8 }),
      mechanic: slot("机制", "层数上限 +1（6 层）",
        1.10, "stacking_extend", { extraStacks: 1 }),
      cost: slot("代价", "间隔 12s，每层扣 2 HP",
        1.60, "stacking_gamble", { interval: 12000, perStack: 0.03, maxStacks: 5, hpCost: 2 },
        [{ type: "hp_cost", desc: "每层扣 2 HP" }])
    }
  , "scaler", ["ramp"]);

  // --- 稀有 ---
  CS.cards.code_refactor = makeCard(
    "code_refactor", "代码重构", "tech", "rare", "穿透",
    "把烂代码重写一遍。可能更优雅，可能直接崩。",
    {
      offense: slot("输出", "主武伤害统一为「重构」标签，忽略弱点抗性",
        1.40, "dmg_type_override", { override: "refactored", ignoreResist: true }),
      survival: slot("生存", "被忽略的抗性伤害转为回血 3/次",
        1.20, "refactor_heal", { healPerIgnore: 3 }),
      resource: slot("资源", "重构击杀额外掉落材料 +10%",
        1.15, "refactor_drop", { bonus: 0.10 }),
      mechanic: slot("机制", "重构标签共享给同槽其他武器",
        1.40, "refactor_share", { shareToSlot: true }),
      cost: slot("代价", "重构伤害 +35%，3% 概率自伤 5",
        1.80, "refactor_gamble", { dmgBonus: 0.35, selfDmgChance: 0.03, selfDmg: 5 },
        [{ type: "self_dmg", desc: "3% 概率自伤 5" }],
        ["agile_dev"])  // 互斥：链电自伤 + 重构自伤 = 不可控
    }
  , "transformer", ["pierce","risk"]);

  CS.cards.continuous_integration = makeCard(
    "continuous_integration", "持续集成", "tech", "rare", "冷却",
    "每次提交自动跑测试。自动化，零失误。",
    {
      offense: slot("输出", "每 5 击杀所有武器 CD -0.5s",
        1.40, "cd_on_kill", { kills: 5, reduction: 0.5 }),
      survival: slot("生存", "CD 缩减触发时回血 5",
        1.20, "cd_heal", { healOnTrigger: 5 }),
      resource: slot("资源", "CD 缩减触发时 +3 经验",
        1.15, "cd_xp", { xpOnTrigger: 3 }),
      mechanic: slot("机制", "CD 缩减翻倍（1s/5杀）",
        1.40, "cd_double", { kills: 5, reduction: 1.0 }),
      cost: slot("代价", "CD 缩减 1s/5杀，触发时扣 3 HP",
        1.70, "cd_gamble", { kills: 5, reduction: 1.0, hpCost: 3 },
        [{ type: "hp_cost", desc: "每次触发扣 3 HP" }])
    }
  , "scaler", ["cooldown","network"]);

  // --- 传说 ---
  CS.cards.tech_breakthrough = makeCard(
    "tech_breakthrough", "技术突破", "tech", "legendary", "革新",
    "你把整个技术栈推倒重来。结果是革命性的。",
    {
      offense: slot("输出", "链电改为同时击中 5 个最近敌人，伤害 ×3",
        2.00, "chain_simul", { targets: 5, chainDmgMult: 3.0 }),
      survival: slot("生存", "链电每击杀回复 5 HP",
        1.80, "chain_vamp", { healPerKill: 5 }),
      resource: slot("资源", "全武器 CD -30%",
        1.80, "global_cd", { reduction: 0.30 }),
      mechanic: slot("机制", "激活链电风暴：持续 5s，每 0.5s 造成伤害",
        2.00, "chain_storm", { duration: 5000, interval: 500 }),
      cost: slot("代价", "4% 概率全屏同时链电一次",
        1.90, "chain_global", { chance: 0.04 },
        [{ type: "rng", desc: "仅 4% 概率触发" }])
    }
  , "transformer", ["chain","burst","network"]);

  // =====================================================================
  // ⚡ 产品部（5 张）
  // =====================================================================

  CS.cards.emergency_launch = makeCard(
    "emergency_launch", "紧急上线", "product", "common", "攻速",
    "管他有没有 Bug，先上了再说。攻速飙升。",
    {
      offense: slot("输出", "攻速 +35%",
        1.00, "attack_speed", { value: 35 }),
      survival: slot("生存", "攻速触发时回血 1",
        0.90, "as_heal", { healPerTick: 1 }),
      resource: slot("资源", "攻速触发时材料掉落 +3%",
        0.85, "as_drop", { dropBonus: 0.03 }),
      mechanic: slot("机制", "攻速加成每 10s 累积 +5%（受技术卡数量加成）",
        1.10, "as_ramp", { rampPer10s: 5, maxFromTech: "×2" }),
      cost: slot("代价", "攻速 +55%，每 10 次攻击需 0.5s Bug修复",
        1.60, "as_gamble", { value: 55, attacksPerBug: 10, bugDuration: 500 },
        [{ type: "stun", desc: "每 10 击短暂停顿" }])
    }
  , "starter", ["speed","risk"]);

  CS.cards.rapid_iteration = makeCard(
    "rapid_iteration", "快速迭代", "product", "common", "暴击",
    "今天的版本比昨天好一点点。暴击率提高。",
    {
      offense: slot("输出", "暴击率 +8%",
        1.00, "crit_rate", { value: 8 }),
      survival: slot("生存", "暴击回血 3 HP",
        0.90, "crit_heal", { healOnCrit: 3 }),
      resource: slot("资源", "暴击击杀额外 +4 经验",
        0.85, "crit_xp", { bonusXp: 4 }),
      mechanic: slot("机制", "暴击触发人脉联动",
        1.10, "crit_network", { synergyBuffDuration: 3000, synergyBuff: 15 }),
      cost: slot("代价", "暴击率 +13%，非暴击伤害 -15%",
        1.60, "crit_gamble", { value: 13, nonCritPenalty: 0.15 },
        [{ type: "penalty", desc: "非暴击减 15% 伤害" }])
    }
  , "starter", ["crit","network"]);

  CS.cards.deadline = makeCard(
    "deadline", "截止日期", "product", "rare", "斩杀",
    "明天必须上线。今晚通宵。对残血敌人造成更高伤害。",
    {
      offense: slot("输出", "对 <50% HP 敌人伤害 +40%",
        1.40, "execute", { threshold: 0.50, dmgBonus: 0.40 }),
      survival: slot("生存", "斩杀回复 5% 最大 HP",
        1.20, "execute_heal", { healPct: 0.05 }),
      resource: slot("资源", "斩杀额外 +2 材料",
        1.15, "execute_mats", { bonusMats: 2 }),
      mechanic: slot("机制", "低血目标被标记，所有武器对其伤害 +15%",
        1.40, "execute_mark", { sharedBonus: 0.15 }),
      cost: slot("代价", "对 <50% HP 伤害 +80%，击杀扣 1% 当前 HP",
        1.80, "execute_gamble", { threshold: 0.50, dmgBonus: 0.80, hpCost: 0.01 },
        [{ type: "hp_cost", desc: "斩杀扣血" }],
        ["emergency_launch"])  // 互斥：攻速+扣血=快速自杀
    }
  , "transformer", ["execute","burst"]);

  CS.cards.kpi_review = makeCard(
    "kpi_review", "KPI 考核", "product", "rare", "连杀",
    "这个季度的 KPI 达标了吗？击杀越多越强。",
    {
      offense: slot("输出", "每 8 击杀 +10% 伤害 8s，可叠 3 层",
        1.40, "kill_streak", { kills: 8, perStack: 0.10, duration: 8000, maxStacks: 3 }),
      survival: slot("生存", "连杀层数满时回血 8",
        1.20, "streak_heal", { healAtCap: 8 }),
      resource: slot("资源", "每层连杀 +2 经验/击杀",
        1.15, "streak_xp", { xpPerStackPerKill: 2 }),
      mechanic: slot("机制", "连杀层上限 +2（5 层）",
        1.40, "streak_extend", { extraStacks: 2 }),
      cost: slot("代价", "5 杀触发，每层受伤害 +10%",
        1.80, "streak_gamble", { kills: 5, perStack: 0.10, maxStacks: 3, dmgTakenPerStack: 0.10 },
        [{ type: "dmg_taken", desc: "每层多受 10% 伤害" }])
    }
  , "scaler", ["burst","ramp"]);

  CS.cards.product_launch = makeCard(
    "product_launch", "产品发布", "product", "legendary", "爆炸",
    "V1.0 正式上线！全公司瞩目。",
    {
      offense: slot("输出", "暴击产生 80px 爆炸，伤害 = 暴击的 80%，1.5s CD",
        2.00, "crit_explosion", { radius: 80, ratio: 0.80, cd: 1500 }),
      survival: slot("生存", "爆炸回血 15% 最大 HP",
        1.80, "explosion_heal", { healPct: 0.15 }),
      resource: slot("资源", "爆炸击杀 +10 经验",
        1.80, "explosion_xp", { xpBonus: 10 }),
      mechanic: slot("机制", "爆炸半径 + 卡牌总数 ×8px",
        2.00, "explosion_scaling", { baseRadius: 80, radiusPerCard: 8 }),
      cost: slot("代价", "爆炸无冷却，每次扣 3% HP",
        1.90, "explosion_gamble", { radius: 80, ratio: 0.80, noCd: true, hpCost: 0.03 },
        [{ type: "hp_cost", desc: "每次爆炸扣 3% HP" }])
    }
  , "transformer", ["crit","burst","network"]);

  // =====================================================================
  // 🛡️ 运营部（5 张）
  // =====================================================================

  CS.cards.process_approval = makeCard(
    "process_approval", "流程审批", "ops", "common", "护甲",
    "按流程来，不会出错。获得护甲和减伤。",
    {
      offense: slot("输出", "护甲 +2，伤害减免 +8%",
        1.00, "armor", { value: 2, reduction: 0.08 }),
      survival: slot("生存", "护甲衰减时回血 4",
        0.90, "armor_heal", { healOnDeplete: 4 }),
      resource: slot("资源", "护甲满值时材料掉落 +5%",
        0.85, "armor_drop", { dropBonus: 0.05 }),
      mechanic: slot("机制", "护甲共享给同槽武器（60px 光环，30% 效果）",
        1.10, "armor_share", { radius: 60, ratio: 0.30 }),
      cost: slot("代价", "护甲 +4，减免 +15%，受击 -1 护甲（30s 恢复）",
        1.70, "armor_gamble", { value: 4, reduction: 0.15, lossPerHit: 1, recovery: 30000 },
        [{ type: "conditional", desc: "受击减护甲" }])
    }
  , "starter", ["shield","network"]);

  CS.cards.backup_recovery = makeCard(
    "backup_recovery", "备份恢复", "ops", "common", "回复",
    "数据丢了不怕，我们有备份。周期自动回复生命。",
    {
      offense: slot("输出", "每 30s 自动回复 15% 最大 HP",
        1.00, "regen", { interval: 30000, healPct: 0.15 }),
      survival: slot("生存", "回复量额外 +10%",
        0.90, "regen_boost", { bonus: 0.10 }),
      resource: slot("资源", "回复触发时 +5 材料",
        0.85, "regen_mats", { bonusMats: 5 }),
      mechanic: slot("机制", "回复范围 80px（治疗同槽友军）",
        1.10, "regen_aura", { radius: 80 }),
      cost: slot("代价", "每 20s 回复 22%，期间受伤害 +20%",
        1.60, "regen_gamble", { interval: 20000, healPct: 0.22, dmgPenalty: 0.20 },
        [{ type: "dmg_taken", desc: "回复期间多受 20% 伤害" }],
        ["disclaimer"])  // 互斥：延迟伤害+自动回复=无限容错
    }
  , "starter", ["regen"]);

  CS.cards.compliance_check = makeCard(
    "compliance_check", "合规审查", "ops", "rare", "净化",
    "法务部检查过了，没问题。周期清除负面效果。",
    {
      offense: slot("输出", "每 25s 清除负面 + 3s 伤害 +15%",
        1.40, "cleanse", { interval: 25000, buffDuration: 3000, dmgBonus: 0.15 }),
      survival: slot("生存", "清除时回血 10",
        1.20, "cleanse_heal", { heal: 10 }),
      resource: slot("资源", "清除时 +5 材料",
        1.15, "cleanse_mats", { bonusMats: 5 }),
      mechanic: slot("机制", "清除后 4s 免伤",
        1.40, "cleanse_invuln", { duration: 4000 }),
      cost: slot("代价", "增益翻倍（+30%），清除后护甲归零 3s",
        1.70, "cleanse_gamble", { dmgBonus: 0.30, armorZero: 3000 },
        [{ type: "vulnerable", desc: "清除后 3s 无护甲" }])
    }
  , "support", ["debuff","regen"]);

  CS.cards.disclaimer = makeCard(
    "disclaimer", "免责声明", "ops", "rare", "延迟",
    "这个责任不在我们部门。伤害延迟扣除，给回复争取时间。",
    {
      offense: slot("输出", "受击伤害进入审批队列，3s 后扣除，满 HP 时消失",
        1.40, "dmg_delay", { delay: 3000, cancelOnFullHp: true }),
      survival: slot("生存", "待审批期间回血速率 +50%",
        1.20, "delay_heal", { healBoost: 0.50 }),
      resource: slot("资源", "每审批完一批伤害 +3 经验",
        1.15, "delay_xp", { xpPerBatch: 3 }),
      mechanic: slot("机制", "队列伤害 30% 转移至同槽分担",
        1.40, "delay_share", { sharePct: 0.30, toSlot: "any" }),
      cost: slot("代价", "审批延迟 1.5s，队列清空时扣 5% 最大 HP",
        1.80, "delay_gamble", { delay: 1500, clearPenalty: 0.05 },
        [{ type: "burst_hp_cost", desc: "队列清空扣 5% 最大 HP" }],
        ["backup_recovery", "fullstack_ops"])  // 互斥：延迟+回复=无限容错 / 双保险
    }
  , "transformer", ["shield","risk"]);

  CS.cards.fullstack_ops = makeCard(
    "fullstack_ops", "全栈运营", "ops", "legendary", "救命",
    "从前端到后端，一个人全包了。濒死时获得无敌和爆发。",
    {
      offense: slot("输出", "<50% HP 获无敌 2s + 回复 30%（60s CD）",
        2.00, "emergency", { threshold: 0.50, invuln: 2000, heal: 0.30, cd: 60000 }),
      survival: slot("生存", "无敌结束时额外回复 20%",
        1.80, "emergency_heal", { bonusHeal: 0.20 }),
      resource: slot("资源", "无敌触发时全武器 CD 刷新",
        1.80, "emergency_refresh", {}),
      mechanic: slot("机制", "无敌爆炸引爆同槽所有效果 ×2（3s）",
        2.00, "emergency_network", { buffDuration: 3000, multiplier: 2.0 }),
      cost: slot("代价", "过载模式：攻速 ×3 移速 ×2，3s 后 HP=1",
        1.90, "emergency_overload", { duration: 3000, asMult: 3.0, msMult: 2.0, hpToOne: true },
        [{ type: "fatal_risk", desc: "过载后 HP=1" }],
        ["disclaimer"])  // 互斥：延迟伤害保护 + 无敌 = 双保险
    }
  , "transformer", ["shield","burst","regen"]);

  // =====================================================================
  // 📢 市场部（5 张）
  // =====================================================================

  CS.cards.brand_impact = makeCard(
    "brand_impact", "品牌影响", "marketing", "common", "气场",
    "品牌效应，挡都挡不住。身边敌人被持续推开。",
    {
      offense: slot("输出", "身边 120px 每 0.8s 推开 20px + 伤害 8",
        1.00, "aura_knockback", { radius: 120, interval: 800, knockback: 20, damage: 8 }),
      survival: slot("生存", "推开敌人时回血 3",
        0.90, "aura_heal", { healPerTick: 3 }),
      resource: slot("资源", "推开击杀额外 +2 材料",
        0.85, "aura_mats", { bonusMats: 2 }),
      mechanic: slot("机制", "被推开敌人触发同槽武器弱攻击（60% 伤害）",
        1.10, "aura_network", { synergyDmg: 0.60 }),
      cost: slot("代价", "击退 40px 伤翻倍，每 0.8s 扣 2 HP",
        1.70, "aura_gamble", { knockback: 40, damage: 16, hpCost: 2 },
        [{ type: "hp_cost", desc: "每 0.8s 扣 2 HP" }],
        ["global_launch"])  // 互斥：全屏+击退=零交互
    }
  , "starter", ["knockback","network"]);

  CS.cards.channel_promotion = makeCard(
    "channel_promotion", "渠道推广", "marketing", "common", "拾取",
    "多铺渠道，自然有流量。拾取范围扩大。",
    {
      offense: slot("输出", "拾取范围 +40%，材料掉落 +8%",
        1.00, "pickup", { rangeBonus: 0.40, dropRate: 0.08 }),
      survival: slot("生存", "拾取材料时回血 2",
        0.90, "pickup_heal", { healPerPickup: 2 }),
      resource: slot("资源", "拾取经验值 +15%",
        0.85, "pickup_xp", { xpBonus: 0.15 }),
      mechanic: slot("机制", "拾取效果同步至同槽",
        1.10, "pickup_share", { syncToSlot: true }),
      cost: slot("代价", "拾取 +80%，5% 材料被渠道扣点",
        1.60, "pickup_gamble", { rangeBonus: 0.80, lossChance: 0.05 },
        [{ type: "material_loss", desc: "5% 概率扣材料" }])
    }
  , "scaler", ["economy","xp"]);

  CS.cards.viral_marketing = makeCard(
    "viral_marketing", "病毒营销", "marketing", "rare", "感染",
    "一条朋友圈，全公司都在转。击中附加病毒，自动扩散。",
    {
      offense: slot("输出", "击中获得病毒标记 4s，每 1s 扩散 1 人/80px，标记受伤害 +12%",
        1.40, "viral_spread", { duration: 4000, spreadRate: 1, radius: 80, dmgAmp: 0.12 }),
      survival: slot("生存", "病毒标记到期时回血 3/个",
        1.20, "viral_heal", { healPerExpire: 3 }),
      resource: slot("资源", "病毒扩散击杀 +3 经验",
        1.15, "viral_xp", { bonusXp: 3 }),
      mechanic: slot("机制", "扩散敌人 50% 概率触发同槽攻击",
        1.40, "viral_network", { triggerChance: 0.50 }),
      cost: slot("代价", "扩散速度 ×2，标记到期受扩散数 ×1 伤害",
        1.80, "viral_gamble", { spreadRate: 2, selfDmgPerExpire: 1 },
        [{ type: "self_dmg", desc: "到期时扣伤害" }])
    }
  , "transformer", ["spread","debuff","network"]);

  CS.cards.hit_strategy = makeCard(
    "hit_strategy", "爆款策略", "marketing", "rare", "爆发",
    "不鸣则已，一鸣惊人。累积击杀后爆发。",
    {
      offense: slot("输出", "每 15 击杀全武器伤害 ×2，2s",
        1.40, "hit_event", { kills: 15, dmgMult: 2.0, duration: 2000 }),
      survival: slot("生存", "爆款期间回血速率 ×3",
        1.20, "hit_heal", { healMult: 3.0 }),
      resource: slot("资源", "爆款期间经验 ×2",
        1.15, "hit_xp", { xpMult: 2.0 }),
      mechanic: slot("机制", "爆款触发时同槽也进入爆款",
        1.40, "hit_share", { syncToSlot: true }),
      cost: slot("代价", "12 击杀触发，伤害 ×3，持续 1.2s",
        1.70, "hit_gamble", { kills: 12, dmgMult: 3.0, duration: 1200 },
        [{ type: "shorter", desc: "持续时间缩短" }])
    }
  , "scaler", ["burst","ramp"]);

  CS.cards.global_launch = makeCard(
    "global_launch", "全域投放", "marketing", "legendary", "全屏",
    "不在工位——在全域。所有武器全屏攻击。",
    {
      offense: slot("输出", "所有武器范围覆盖全屏，伤害 ×0.7",
        2.00, "global_range", { fullScreen: true, dmgMult: 0.70 }),
      survival: slot("生存", "全屏攻击每 5 击杀回 10 HP",
        1.80, "global_heal", { killsPerHeal: 5, heal: 10 }),
      resource: slot("资源", "全屏攻击击杀经验 ×1.5",
        1.80, "global_xp", { xpMult: 1.5 }),
      mechanic: slot("机制", "全屏攻击同步同槽武器",
        2.00, "global_share", { syncToSlot: true }),
      cost: slot("代价", "全屏 ×1.2 伤，击杀扣 1% HP",
        1.90, "global_gamble", { dmgMult: 1.20, hpCost: 0.01 },
        [{ type: "hp_cost", desc: "每次击杀扣 1% HP" }],
        ["brand_impact"])  // 互斥：全屏+击退=零交互
    }
  , "transformer", ["spread","burst","network"]);

  // =====================================================================
  // 🏢 综合部（5 张）
  // =====================================================================

  CS.cards.morning_meeting = makeCard(
    "morning_meeting", "晨会", "general", "common", "选项",
    "每天早上站 15 分钟——今天的活都清楚了。更多升级选项。",
    {
      offense: slot("输出", "升级选项 +1（4 选 1）",
        1.00, "extra_choice", { bonus: 1 }),
      survival: slot("生存", "每次升级回血 5",
        0.90, "choice_heal", { heal: 5 }),
      resource: slot("资源", "每次升级额外 +5 经验",
        0.85, "choice_xp", { bonusXp: 5 }),
      mechanic: slot("机制", "多出选项优先出现同槽部门卡牌",
        1.10, "choice_network", { prioritize: true }),
      cost: slot("代价", "选项 +2，本关移速 -8%",
        1.60, "choice_gamble", { bonus: 2, msPenalty: -0.08 },
        [{ type: "slow", desc: "移速降低 8%" }])
    }
  , "support", ["xp","economy"]);

  CS.cards.standard_sop = makeCard(
    "standard_sop", "SOP 标准化", "general", "common", "冷却",
    "标准化流程——效率提升。所有冷却/触发间隔缩短。",
    {
      offense: slot("输出", "所有冷却/触发间隔 -15%",
        1.00, "cooldown", { reduction: 0.15 }),
      survival: slot("生存", "冷却完成时回血 3",
        0.90, "cd_heal", { healOnReady: 3 }),
      resource: slot("资源", "冷却完成时 +2 材料",
        0.85, "cd_mats", { matsOnReady: 2 }),
      mechanic: slot("机制", "冷却缩减同步同槽卡牌",
        1.10, "cd_share", { syncToSlot: true }),
      cost: slot("代价", "冷却 -25%，8% 概率冻结 1s",
        1.60, "cd_gamble", { reduction: 0.25, freezeChance: 0.08, freezeDuration: 1000 },
        [{ type: "freeze", desc: "8% 概率冻结 1s" }])
    }
  , "support", ["cooldown","network"]);

  CS.cards.record_archive = makeCard(
    "record_archive", "留痕存档", "general", "rare", "经验",
    "所有事情都有记录。找起来也快。大幅提升经验和材料获取。",
    {
      offense: slot("输出", "经验 +25%，材料 +15%",
        1.40, "resource_boost", { xpBonus: 0.25, matBonus: 0.15 }),
      survival: slot("生存", "升级时回血 5",
        1.20, "archive_heal", { healPerLevel: 5 }),
      resource: slot("资源", "存档经验共享给同槽其他效果 50%",
        1.15, "archive_share_xp", { ratio: 0.50 }),
      mechanic: slot("机制", "经验+材料共享给同槽 30%",
        1.40, "archive_network", { shareRatio: 0.30 }),
      cost: slot("代价", "经验 +50%、材料 +30%，每升级消耗 5 材料",
        1.80, "archive_gamble", { xpBonus: 0.50, matBonus: 0.30, matCost: 5 },
        [{ type: "material_cost", desc: "每升级消耗 5 材料" }])
    }
  , "scaler", ["xp","economy","ramp"]);

  CS.cards.auto_office = makeCard(
    "auto_office", "自动办公", "general", "rare", "自动化",
    "AI 代劳——你看着就行。周期自动释放武器攻击。",
    {
      offense: slot("输出", "每 12s 自动释放最高等级武器 Lv.1 攻击（60% 伤害）",
        1.40, "auto_attack", { interval: 12000, ratio: 0.60, weaponLevel: 1 }),
      survival: slot("生存", "自动攻击回血 3/次",
        1.20, "auto_heal", { heal: 3 }),
      resource: slot("资源", "自动攻击击杀 +5 经验",
        1.15, "auto_xp", { bonusXp: 5 }),
      mechanic: slot("机制", "自动释放同槽也触发协同攻击",
        1.40, "auto_network", { syncToSlot: true }),
      cost: slot("代价", "伤害 100%，间隔 8s，每次扣 3 HP",
        1.70, "auto_gamble", { interval: 8000, ratio: 1.0, hpCost: 3 },
        [{ type: "hp_cost", desc: "每次扣 3 HP" }])
    }
  , "transformer", ["summon","cooldown"]);

  CS.cards.org_restructure = makeCard(
    "org_restructure", "组织架构调整", "general", "legendary", "重置",
    "HR 发通告了——部门重组。免费重新分配所有卡牌槽位。",
    {
      offense: slot("输出", "本局已有卡牌可免费重新分配所有槽位（一次性）",
        2.00, "mass_reassign", { oneTime: true }),
      survival: slot("生存", "重分配时全回复",
        1.80, "reassign_full_heal", {}),
      resource: slot("资源", "重分配后所有经验奖励翻倍 60s",
        1.80, "reassign_xp_boost", { duration: 60000, mult: 2.0 }),
      mechanic: slot("机制", "重分配保留所有人脉联动关系",
        2.00, "reassign_network", { preserveLinks: true }),
      cost: slot("代价", "重分配效果 ×1.3，每张卡扣 3% 最大 HP",
        1.90, "reassign_gamble", { effectMult: 1.30, hpCostPerCard: 0.03 },
        [{ type: "hp_cost", desc: "每张重置卡扣 3% HP" }])
    }
  , "transformer", ["network","economy"]);

})();
