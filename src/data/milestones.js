// ================================================================
// src/data/milestones.js — 部门里程碑 + 协作任务数据
// 命名空间: CS.milestones, CS.collabQuests
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});

  // 部门投资里程碑（2/3/4 张卡）
  CS.milestoneTiers = [
    { cards: 2, name: "基础协同", desc: "部门基础协同激活" },
    { cards: 3, name: "机制强化", desc: "部门核心机制强化" },
    { cards: 4, name: "终局套装", desc: "部门终局效果解锁" }
  ];

  // 满投资提示
  CS.milestoneCapMessage = "部门投资已满，可考虑跨部门协作";

  // 协作任务
  CS.collabQuests = [
    {
      id: "collab_tech_marketing",
      stageTrigger: 13,
      chance: 0.60,
      narrative: "技术部想和市场部联合发布一个新功能",
      requires: { depts: ["tech", "marketing"], minEach: 1 },
      reward: { type: "free_card", desc: "获得 1 张随机卡牌" },
      hint: "跨部门合作：技术 + 市场可获一张免费卡",
      showHintOnFirstMiss: true
    },
    {
      id: "collab_ops_general",
      stageTrigger: 14,
      chance: 0.40,
      narrative: "运营部向行政部借调人手——年底冲刺人力不够",
      requires: { depts: ["ops", "general"], minEach: 1 },
      reward: { type: "shop_discount", desc: "商店本次半价", value: 0.50 },
      hint: "跨部门合作：运营 + 行政 = 商店半价",
      showHintOnFirstMiss: false
    },
    {
      id: "collab_product_tech",
      stageTrigger: 15,
      chance: 0.30,
      narrative: "产品部的 P0 故障需要技术部救火——全组等你们",
      requires: { depts: ["product", "tech"], minEach: 1 },
      reward: { type: "emergency_buff", desc: "全武器 CD 刷新 + 15s 增益（伤害 +25%）", duration: 15000, dmgBonus: 0.25 },
      hint: "跨部门合作：产品 + 技术 = 紧急增益",
      showHintOnFirstMiss: false
    },
    {
      id: "collab_speed_chain",
      stageTrigger: 14,
      chance: 0.50,
      narrative: "你的攻速 Build 已经初具规模——试试触发极限连击",
      requires: { tags: ["speed", "chain"], minMatches: 1 },
      reward: { type: "tag_card", desc: "获得 1 张攻速/链式相关卡牌", tags: ["speed", "chain"] },
      hint: "标签协同：装配更多攻速/链式标签卡牌可解锁高级进化",
      showHintOnFirstMiss: true
    },
    {
      id: "collab_crit_burst",
      stageTrigger: 18,
      chance: 0.45,
      narrative: "你的暴击率正在攀升——要不要试试极限爆发？",
      requires: { tags: ["crit", "burst"], minMatches: 1 },
      reward: { type: "tag_card", desc: "获得 1 张暴击/爆发相关卡牌", tags: ["crit", "burst"] },
      hint: "标签协同：装配更多暴击/爆发标签卡牌可解锁高级进化",
      showHintOnFirstMiss: true
    },
    {
      id: "collab_shield_regen",
      stageTrigger: 14,
      chance: 0.50,
      narrative: "你的防御体系已经稳固——要不要试试反伤流？",
      requires: { tags: ["shield", "regen"], minMatches: 1 },
      reward: { type: "tag_card", desc: "获得 1 张护盾/回复相关卡牌", tags: ["shield", "regen"] },
      hint: "标签协同：装配更多护盾/回复标签卡牌可解锁高级进化",
      showHintOnFirstMiss: true
    }
  ];

})();
