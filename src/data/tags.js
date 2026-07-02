// ================================================================
// src/data/tags.js — 统一标签系统
// 命名空间: CS.tags, CS.tagList, CS.tagDeptBias
//
// 标签是卡牌、武器进化、协同任务之间的"共同语言"。
// 不替代部门主轴，作为辅助归类层。
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});

  // 统一标签枚举
  CS.tags = {
    // —— 核心机制标签（描述"这张卡/武器做什么"）——
    chain:      { id: "chain",      name: "链式",     emoji: "⚡", desc: "连锁/弹跳效果" },
    crit:       { id: "crit",       name: "暴击",     emoji: "💥", desc: "暴击相关" },
    execute:    { id: "execute",    name: "斩杀",     emoji: "🎯", desc: "低血量增伤" },
    burst:      { id: "burst",      name: "爆发",     emoji: "💣", desc: "短时高伤害窗口" },
    speed:      { id: "speed",      name: "攻速",     emoji: "⚡", desc: "攻击速度/频率" },
    cooldown:   { id: "cooldown",   name: "冷却",     emoji: "⏱️", desc: "冷却缩减/CD管理" },
    shield:     { id: "shield",     name: "护盾",     emoji: "🛡️", desc: "护盾/减伤" },
    regen:      { id: "regen",      name: "回复",     emoji: "💚", desc: "生命回复/续航" },
    reflect:    { id: "reflect",    name: "反伤",     emoji: "↩️", desc: "受击反馈/反伤" },
    summon:     { id: "summon",     name: "召唤",     emoji: "👥", desc: "召唤物/自动化单位" },
    spread:     { id: "spread",     name: "扩散",     emoji: "🌊", desc: "范围扩散/传染" },
    knockback:  { id: "knockback",  name: "击退",     emoji: "💨", desc: "击退/位移控制" },
    debuff:     { id: "debuff",     name: "异常",     emoji: "🦠", desc: "负面状态/持续伤害" },
    economy:    { id: "economy",    name: "经济",     emoji: "💰", desc: "金币/材料/资源经营" },
    xp:         { id: "xp",         name: "经验",     emoji: "📈", desc: "经验值/升级加速" },
    pierce:     { id: "pierce",     name: "贯穿",     emoji: "🔱", desc: "穿透/穿甲效果" },

    // —— 风格标签（描述"怎么玩"）——
    risk:       { id: "risk",       name: "风险",     emoji: "⚠️", desc: "高风险高回报" },
    ramp:       { id: "ramp",       name: "成长",     emoji: "📊", desc: "随时间/条件累积加强" },
    network:    { id: "network",    name: "联动",     emoji: "🔗", desc: "跨槽/跨武器协同触发" },

    // —— Build 角色标签（描述"在构筑中的定位"）——
    starter:     { id: "starter",    name: "启动件",   emoji: "🚀", desc: "定义流派方向的基础组件" },
    scaler:      { id: "scaler",     name: "成长件",   emoji: "📈", desc: "随对局推进逐渐变强" },
    transformer: { id: "transformer",name: "质变件",   emoji: "💫", desc: "改变战斗方式的关键组件" },
    support:     { id: "support",    name: "辅助件",   emoji: "🔧", desc: "提供通用增益或便利性" },
    risk:        { id: "risk",       name: "风险件",   emoji: "🎲", desc: "高回报附带可感知代价" },
  };

  // 快捷列表
  CS.tagList = Object.keys(CS.tags).filter(k => !CS.tags[k].desc.includes("在构筑中的定位"));

  // 标签 → 部门推荐映射（用于掉落/奖励偏置）
  CS.tagDeptBias = {
    chain:      ["tech"],
    crit:       ["product"],
    execute:    ["product"],
    burst:      ["product", "marketing"],
    speed:      ["tech"],
    cooldown:   ["general", "tech"],
    shield:     ["ops"],
    regen:      ["ops"],
    reflect:    ["ops"],
    summon:     ["general", "marketing"],
    spread:     ["marketing"],
    knockback:  ["marketing"],
    debuff:     ["marketing"],
    economy:    ["general"],
    xp:         ["general"],
    pierce:     ["product", "tech"],
    risk:       ["product", "general"],
    ramp:       ["tech", "ops"],
    network:    ["tech", "marketing"],
  };

})();
