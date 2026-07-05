// ================================================================
// src/data/synergies.js — 协同数据定义
// 命名空间: CS.synergies
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});

  // ---- 部门协同（4 种，第 6 关起）----
  CS.departmentSynergies = [
    {
      id: "dept_tech_product",
      name: "敏捷创新",
      type: "department",
      requiredDepartments: ["tech", "product"],
      unlockStage: 6,
      description: "暴击 30% 触发链电 / 链电 30% 附加暴击",
      effectType: "mechanic_cross",
      params: { critChainChance: 0.30, chainCritChance: 0.30 },
      uiHint: "技术 + 产品 = 链电暴击"
    },
    {
      id: "dept_product_marketing",
      name: "爆款策略",
      type: "department",
      requiredDepartments: ["product", "marketing"],
      unlockStage: 6,
      description: "暴击击退敌人并留下伤害路径",
      effectType: "mechanic_cross",
      params: { critKnockback: 40, trailDuration: 3000, trailDmgRatio: 0.30 },
      uiHint: "产品 + 市场 = 暴击击退 + 路径伤害"
    },
    {
      id: "dept_ops_marketing",
      name: "标准运营",
      type: "department",
      requiredDepartments: ["ops", "marketing"],
      unlockStage: 6,
      description: "站立时范围伤害覆盖全屏 ×0.6",
      effectType: "mechanic_cross",
      params: { standStillFullScreen: true, dmgRatio: 0.60 },
      uiHint: "运营 + 市场 = 站桩全屏"
    },
    {
      id: "dept_marketing_general",
      name: "全面投放",
      type: "department",
      requiredDepartments: ["marketing", "general"],
      unlockStage: 6,
      description: "拾取范围扩大 + 材料自动吸附",
      effectType: "mechanic_cross",
      params: { pickupRangeMult: 2.0, autoCollect: true },
      uiHint: "市场 + 综合 = 自动拾取"
    }
  ];

  // ---- 属性协同（4 种，第 8 关起）----
  CS.attributeSynergies = [
    {
      id: "attr_execution_focus",
      name: "学以致用",
      type: "attribute",
      requiredAttributes: ["execution", "focus"],
      unlockStage: 8,
      description: "执行力槽效果 + 专注槽卡数 ×5%（上限 +20%）",
      effectType: "stat_scale",
      params: { sourceSlot: "execution", scaleBySlot: "focus", perCard: 0.05, max: 0.20 },
      uiHint: "执行力 + 专注 = 精准放大"
    },
    {
      id: "attr_resilience_social",
      name: "兄弟同心",
      type: "attribute",
      requiredAttributes: ["resilience", "social"],
      unlockStage: 8,
      description: "抗压槽负面效果由社交槽分担 30%",
      effectType: "penalty_share",
      params: { fromSlot: "resilience", toSlot: "social", shareRatio: 0.30 },
      uiHint: "抗压 + 社交 = 共同承担"
    },
    {
      id: "attr_slacking_focus",
      name: "厚积薄发",
      type: "attribute",
      requiredAttributes: ["slacking", "focus"],
      unlockStage: 8,
      description: "摸鱼槽蓄力满 100 → 专注槽下次暴击 ×2",
      effectType: "charge_crit",
      params: { sourceSlot: "slacking", targetSlot: "focus", chargePerSec: 5, threshold: 100, critMult: 2.0 },
      uiHint: "摸鱼 + 专注 = 蓄力暴击"
    },
    {
      id: "attr_expression_execution",
      name: "孤注一掷",
      type: "attribute",
      requiredAttributes: ["expression", "execution"],
      unlockStage: 8,
      description: "表达力代价 ×1.3 → 执行力正面 ×1.5",
      effectType: "risk_reward",
      params: { costSlot: "expression", benefitSlot: "execution", costMult: 1.30, benefitMult: 1.50 },
      uiHint: "表达力 + 执行力 = 高风险高回报"
    }
  ];

})();
