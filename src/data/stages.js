// ================================================================
// src/data/stages.js - V4 五章主循环节奏表
// 命名空间: CS.stages
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});

  CS.stages = {
    phases: [
      {
        id: "weapon_trial",
        name: "武器试用期",
        index: 1,
        durationSeconds: 210,
        subStages: [1, 2, 3, 4],
        narrative: "先熟悉武器本身的攻击动词：它怎么打、打哪里、清怪靠什么。",
        enemyPressure: { hpMult: 0.95, dmgMult: 0.9, speedMult: 0.94, spawnRate: 0.92 },
        unlockRules: { levelUps: 1, rareChance: 0 },
        shopRules: { enabled: false },
        synergyUnlocks: ["weapon_base"],
        bossPhase: false,
        objective: "看懂初始武器的基础清怪方式"
      },
      {
        id: "badge_form",
        name: "工牌变体期",
        index: 2,
        durationSeconds: 220,
        subStages: [5, 6, 7, 8],
        narrative: "工牌开始改造武器。同一把武器会因为部门不同，变成不同打法。",
        enemyPressure: { hpMult: 1.18, dmgMult: 1.05, speedMult: 1.02, spawnRate: 1.08 },
        unlockRules: { levelUps: 3, rareChance: 0.15, shopAtEnd: true },
        shopRules: { enabled: true, slotCount: 3, rareChance: 0.22 },
        synergyUnlocks: ["badge_form"],
        bossPhase: false,
        objective: "确认主流派方向，开始用卡槽强化它"
      },
      {
        id: "promotion_form",
        name: "转正强化期",
        index: 3,
        durationSeconds: 230,
        subStages: [9, 10, 11, 12],
        narrative: "主流派进入转正形态。现在不是多拿东西，而是把核心攻击做厚。",
        enemyPressure: { hpMult: 1.46, dmgMult: 1.22, speedMult: 1.1, spawnRate: 1.22, eliteChance: 0.08 },
        unlockRules: { levelUps: 4, rareChance: 0.34, legendChance: 0.04 },
        shopRules: { enabled: true, slotCount: 4, rareChance: 0.34 },
        synergyUnlocks: ["promotion", "mechanic_slot"],
        bossPhase: false,
        objective: "让主形态产生可见的第二层变化"
      },
      {
        id: "cross_department",
        name: "跨部门协同期",
        index: 4,
        durationSeconds: 230,
        subStages: [13, 14, 15, 16],
        narrative: "跨部门协作开放。武器保留主形态，同时追加一个低阶第二形态。",
        enemyPressure: { hpMult: 1.82, dmgMult: 1.48, speedMult: 1.18, spawnRate: 1.36, eliteChance: 0.16 },
        unlockRules: { levelUps: 4, rareChance: 0.46, legendChance: 0.08 },
        shopRules: { enabled: true, slotCount: 5, rareChance: 0.42 },
        synergyUnlocks: ["cross_department", "cost_slot"],
        bossPhase: false,
        objective: "把两个部门形态组合成一个打法"
      },
      {
        id: "cross_skill",
        name: "跨技能学习期",
        index: 5,
        durationSeconds: 250,
        subStages: [17, 18, 19, 20],
        narrative: "跨技能学习开放。额外武器不再作为完整武器加入，而是保留本质技能辅助主形态。",
        enemyPressure: { hpMult: 2.25, dmgMult: 1.78, speedMult: 1.22, spawnRate: 1.48, eliteChance: 0.22 },
        unlockRules: { levelUps: 4, rareChance: 0.58, legendChance: 0.12 },
        shopRules: { enabled: true, slotCount: 5, rareChance: 0.50 },
        synergyUnlocks: ["cross_skill"],
        bossPhase: true,
        objective: "用完整 Build 通过终局验证"
      }
    ],

    subStageNarratives: {
      1: "先看武器怎么自动攻击，不急着理解全部系统。",
      2: "小怪变多，观察武器是直线、范围、弹幕还是站场。",
      3: "第一波压力测试：移动和武器基础清怪要配合起来。",
      4: "入职考核：验证你是否理解这把武器的基础动词。",
      5: "工牌接入，武器开始变形。现在观察攻击方式的差异。",
      6: "围怪增加，工牌变体应该能给你新的清怪手感。",
      7: "开始用卡槽给主形态加第一层强化。",
      8: "试用考核：验证工牌变体是否成立。",
      9: "转正训练开启，机制槽开放，主形态开始有第二层变化。",
      10: "怪群混合出现，单纯堆伤害会开始暴露短板。",
      11: "紧急上线，适合补主形态的频率、范围或生存。",
      12: "转正答辩：验证主流派是否真正成型。",
      13: "跨部门协作开放，开始选择第二部门形态。",
      14: "财年封版，材料变紧，选择要服务主流派。",
      15: "审计追问，控制和生存短板会被放大。",
      16: "协作考核：验证主形态 + 第二形态的组合。",
      17: "跨技能学习开放，辅助技能只服务主形态。",
      18: "灰度事故，敌人更快，辅助技能需要补缺口。",
      19: "年度述职，最终 Build 的输出、生存和资源都要交卷。",
      20: "终局评审：完整 Build 的最终验证。"
    },

    collabQuests: [
      {
        id: "collab_tech_marketing",
        stage: 13,
        chance: 0.60,
        narrative: "技术部想和市场部联合发布一个新功能",
        requires: { depts: ["tech", "marketing"], minEach: 1 },
        reward: { type: "free_card", desc: "免费获得 1 张随机卡牌" },
        hint: "跨部门章开始后，有 1 张技术卡 + 1 张市场卡会额外拿一张卡。",
        showHintOnMiss: true
      },
      {
        id: "collab_ops_general",
        stage: 14,
        chance: 0.45,
        narrative: "运营部向行政部借调一个人手",
        requires: { depts: ["ops", "general"], minEach: 1 },
        reward: { type: "shop_discount", desc: "商店本次半价", value: 0.50 },
        hint: "运营 + 行政会让下一次工坊更便宜。",
        showHintOnMiss: false
      },
      {
        id: "collab_product_tech",
        stage: 15,
        chance: 0.35,
        narrative: "产品部的 P0 故障需要技术部救火",
        requires: { depts: ["product", "tech"], minEach: 1 },
        reward: { type: "emergency_buff", desc: "全武器 CD 刷新 + 15s 伤害提升", duration: 15000, dmgBonus: 0.25 },
        hint: "产品 + 技术会触发一次紧急增益。",
        showHintOnMiss: false
      }
    ],

    // 每章 Boss 后才进入工坊。普通关尽量不断流。
    shopSchedule: [8, 12, 16],

    levelUpBaseOptions: 3
  };

})();
