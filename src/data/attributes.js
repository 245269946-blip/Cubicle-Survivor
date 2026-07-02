// ================================================================
// src/data/attributes.js — 属性数据定义
// 命名空间: CS.attributes, CS.attributeSlots
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});

  CS.attributes = {
    execution: {
      id: "execution",
      name: "执行力",
      emoji: "💪",
      description: "直接伤害，硬怼不绕弯子",
      modifierType: "damage_direct",
      recommendedDepartments: ["tech", "product"],
      powerMultiplier: 1.15  // 伤害类效果放大
    },
    focus: {
      id: "focus",
      name: "专注",
      emoji: "🎯",
      description: "暴击 / 单体 / 精准打击",
      modifierType: "crit_single_target",
      recommendedDepartments: ["product", "tech"],
      powerMultiplier: 1.10
    },
    resilience: {
      id: "resilience",
      name: "抗压",
      emoji: "🛡️",
      description: "生存 / 续航 / 扛得住",
      modifierType: "survival_sustain",
      recommendedDepartments: ["ops", "general"],
      powerMultiplier: 1.10
    },
    slacking: {
      id: "slacking",
      name: "摸鱼",
      emoji: "🐟",
      description: "闪避 / 资源 / 省力但高效",
      modifierType: "dodge_economy",
      recommendedDepartments: ["general", "ops"],
      powerMultiplier: 1.05,
      growthPerCard: 0.15,
      maxGrowthBonus: 0.45
    },
    expression: {
      id: "expression",
      name: "表达力",
      emoji: "📣",
      description: "范围 / 扩散 / 铺开来打",
      modifierType: "range_spread",
      recommendedDepartments: ["marketing", "tech"],
      powerMultiplier: 1.10
    },
    social: {
      id: "social",
      name: "社交",
      emoji: "🤝",
      description: "召唤 / 协同 / 大家一起上",
      modifierType: "summon_synergy",
      recommendedDepartments: ["general", "marketing"],
      powerMultiplier: 1.00,
      growthPerCard: 0.15,
      maxGrowthBonus: 0.45
    }
  };

})();
