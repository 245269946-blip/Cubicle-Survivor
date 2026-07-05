// ================================================================
// src/data/balance.js — 全局平衡参数
// 命名空间: CS.balance
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});

  CS.balance = {
    // ---- 伤害倍数安全帽 ----
    damageMultiplier: {
      softCap: 1.82,         // 超过后每点效率 ×0.5
      hardCap: 2.18,         // 绝对上限
      tailEfficiency: 0.35
    },

    // ---- 攻速安全帽 ----
    attackSpeed: {
      softCap: 62,           // 绝对上限值
      tailEfficiency: 0.35
    },

    // ---- 冷却缩减上限 ----
    cooldownReduction: {
      softCap: 0.50,         // 冷却最多减到原来的 50%
      hardCap: 0.35          // 绝对底限
    },

    // ---- 武器范围安全帽 ----
    weaponSize: {
      softCapFactor: 1.5,    // 范围超过基础 ×1.5 后衰减
    },

    // ---- 代价槽功率 ----
    costSlot: {
      powerMin: 1.50,        // 最小功率倍率（相对输出槽）
      powerMax: 2.00,        // 最大功率倍率
    },

    // ---- 传说卡 ----
    legendary: {
      limitPerRun: 1,        // 每局最多 1 张
      minStage: 7,           // 最早出现关卡
      stageChance: [         // 按阶段: 概率
        { stage: 0, chance: 0 },
        { stage: 7, chance: 0.05 },
        { stage: 9, chance: 0.10 },
        { stage: 11, chance: 0.15 }
      ]
    },

    // ---- 稀有度功率预算 ----
    rarityPower: {
      common: 1.00,
      rare: 1.40,
      legendary: 2.00     // 传说但作用范围受限，不做全局倍率
    },

    // ---- 部门里程碑 ----
    departmentMilestone: {
      tiers: [2, 3, 4],     // 同部门卡数阈值
      maxTier: 3,           // 超过 4 张不再有奖励
      bonusPerTier: [0.10, 0.15, 0.20],  // 每阶段额外加成（可调整）
      capWarning: "部门投资已满，可考虑跨部门协作"
    },

    // ---- 槽位预算 ----
    slotBudget: {
      offense: 1.00,
      survival: 0.90,
      resource: 0.85,
      mechanic: 1.10,
      cost: { min: 1.50, max: 2.00 }
    },

    // ---- 卡牌数量上限 ----
    cardsPerSlot: 1,          // 每槽最多 1 张卡
    maxCardCount: 5,          // 5 槽 = 5 张卡

    // ---- 游戏总时长（秒）----
    totalRunDuration: 1200,   // 20 分钟（可配置为 720/900/1200）
  };

})();
