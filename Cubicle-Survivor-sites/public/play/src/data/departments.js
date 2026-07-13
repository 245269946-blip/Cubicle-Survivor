// ================================================================
// src/data/departments.js - V2 department data
// Namespace: CS.departments
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});

  CS.departments = {
    tech: {
      id: "tech",
      name: "技术部",
      emoji: "⚙",
      description: "分裂 / 自动化 / 高频触发",
      combatIdentity: "把一次攻击变成多次触发。",
      representativeWeapons: ["marker", "coffee", "keyboard"],
      mechanicKeywords: ["split", "automation", "repeat"],
      tagBias: { primary: ["chain", "speed", "cooldown"], secondary: ["network", "ramp"] },
      color: "#4a9eff",
      milestones: {
        2: { desc: "基础自动化", effect: { cooldown: 0.92 } },
        3: { desc: "机制复用", effect: { repeatChance: 0.08 } },
        4: { desc: "多线程爆发", effect: { extraTrigger: true } }
      },
      weaponSet: { 2: { desc: "触发频率 +10%", bonus: { speed: 1.1 } } }
    },
    product: {
      id: "product",
      name: "产品部",
      emoji: "◆",
      description: "标记 / 爆发 / 高价值目标",
      combatIdentity: "把目标打进窗口，再一次性结算。",
      representativeWeapons: ["marker", "thermos", "report"],
      mechanicKeywords: ["mark", "burst", "window"],
      tagBias: { primary: ["crit", "burst", "execute"], secondary: ["pierce", "risk"] },
      color: "#ff6b4a",
      milestones: {
        2: { desc: "爆发窗口", effect: { burst: 1.12 } },
        3: { desc: "高价值追击", effect: { markBonus: 0.15 } },
        4: { desc: "窗口结算", effect: { execute: true } }
      },
      weaponSet: { 2: { desc: "爆发伤害 +12%", bonus: { burst: 1.12 } } }
    },
    ops: {
      id: "ops",
      name: "运营部",
      emoji: "▣",
      description: "护盾 / 反击 / 稳定容错",
      combatIdentity: "把承压变成反击机会。",
      representativeWeapons: ["keyboard", "coffee", "thermos"],
      mechanicKeywords: ["shield", "counter", "sustain"],
      tagBias: { primary: ["shield", "regen", "reflect"], secondary: ["debuff", "ramp"] },
      color: "#4acf6a",
      milestones: {
        2: { desc: "值守护盾", effect: { shield: 8 } },
        3: { desc: "受击反制", effect: { counter: true } },
        4: { desc: "稳定站场", effect: { sustain: 1.2 } }
      },
      weaponSet: { 2: { desc: "护盾效率 +15%", bonus: { shield: 1.15 } } }
    },
    marketing: {
      id: "marketing",
      name: "市场部",
      emoji: "◎",
      description: "扩散 / 波纹 / 传播",
      combatIdentity: "把单点影响扩散到一片敌人。",
      representativeWeapons: ["marker", "headphones", "shredder"],
      mechanicKeywords: ["wave", "spread", "broadcast"],
      tagBias: { primary: ["spread", "knockback", "debuff"], secondary: ["network", "summon"] },
      color: "#cf6ae0",
      milestones: {
        2: { desc: "范围扩散", effect: { area: 1.12 } },
        3: { desc: "二次传播", effect: { spread: 1 } },
        4: { desc: "全场声量", effect: { globalPulse: true } }
      },
      weaponSet: { 2: { desc: "范围 +12%", bonus: { area: 1.12 } } }
    },
    general: {
      id: "general",
      name: "行政部",
      emoji: "▦",
      description: "规则 / 控制 / 资源",
      combatIdentity: "把战场划成可利用的规则区域。",
      representativeWeapons: ["sticky_note", "stapler", "calculator", "marker"],
      mechanicKeywords: ["grid", "rule", "economy"],
      tagBias: { primary: ["economy", "xp", "cooldown"], secondary: ["summon", "risk"] },
      color: "#e0c060",
      milestones: {
        2: { desc: "流程规则", effect: { xp: 1.08 } },
        3: { desc: "区域管控", effect: { control: 1.15 } },
        4: { desc: "资源归档", effect: { materialBonus: 0.12 } }
      },
      weaponSet: { 2: { desc: "经验与材料 +8%", bonus: { xp: 1.08, materials: 1.08 } } }
    }
  };

  CS.newbiePresets = [
    {
      id: "tech_intern",
      label: "技术实习生",
      department: "tech",
      attributes: ["focus", "execution"],
      weapon: "coffee",
      oneLiner: "高频命中，越打越自动化。"
    },
    {
      id: "product_worker",
      label: "产品打工人",
      department: "product",
      attributes: ["execution", "expression"],
      weapon: "marker",
      oneLiner: "长线贯穿，抓窗口爆发。"
    },
    {
      id: "ops_veteran",
      label: "运营值守",
      department: "ops",
      attributes: ["resilience", "social"],
      weapon: "keyboard",
      oneLiner: "贴脸压力下反击站稳。"
    },
    {
      id: "marketing_newbie",
      label: "市场新人",
      department: "marketing",
      attributes: ["expression", "social"],
      weapon: "headphones",
      oneLiner: "让一次声量在敌群中接力。"
    },
    {
      id: "admin_clerk",
      label: "行政助理",
      department: "general",
      attributes: ["focus", "resilience"],
      weapon: "sticky_note",
      oneLiner: "提前布阵，把敌人带进规则区。"
    }
  ];
})();
