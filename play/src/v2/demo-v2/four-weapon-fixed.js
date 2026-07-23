// ================================================================
// Demo V2.9 four-weapon playable coordinator.
// It only owns selection/version identity. Each selected weapon continues
// to run through its isolated fixed-test configuration.
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});
  const V2 = CS.V2 || (CS.V2 = {});
  if (!V2.demoV2 || !V2.demoV2.fixedTests) return;

  function card(id, fallback) {
    const config = Object.keys(V2.demoV2.fixedTests).map(function (key) { return V2.demoV2.fixedTests[key]; }).find(function (item) { return item.weaponId === id && !item.coordinator; });
    const registered = CS.weapons && CS.weapons[id];
    return Object.assign({}, registered || {}, fallback, config && config.weaponCard || {}, { id, implemented: true });
  }

  const weaponCards = [
    card("marker", {
      name: "马克笔", emoji: "／", motif: "贯穿 / 复写 / 留档",
      description: "远程拉线并改变攻击路径；复写增加即时切割，留档把路径变成持续墨迹。",
      topology: "line_pierce", tagDescription: "远程路径武器"
    }),
    card("thermos", {
      name: "保温杯", emoji: "▥", motif: "近距扇面 / 冷凝 / 热浪",
      description: "靠近敌群喷出横向宽扇面；冷凝控制空间，聚焦击杀把单体优势转成热浪。",
      topology: "thermos_fixed_fan", tagDescription: "近距空间武器"
    }),
    card("scissors", {
      name: "剪刀", emoji: "✂", motif: "轻步 / 合刃 / 张刃",
      description: "高机动纯近战；轻步进场后锁向完成突刺与连剪动作轮。",
      topology: "scissors_fixed_melee", tagDescription: "贴身位移武器"
    }),
    card("correction_fluid", {
      name: "修正液", emoji: "▰", motif: "错误 / 污染 / 纠错",
      description: "制造并利用三层错误状态；让过载目标污染战场，或集中执行最终纠错。",
      topology: "correction_fluid_fixed", tagDescription: "中距状态武器"
    })
  ];

  const fourWeaponFixed = {
    id: "four-weapon-fixed",
    version: "Demo V2.9",
    visualVersion: "全局一致性修正版",
    coordinator: true,
    weaponId: "",
    weaponName: "四武器",
    title: "四武器可玩版",
    subtitle: "同一局制框架下选择路径、空间、位移或状态关系；暗色办公室承载四种不同强度的霓虹异化。",
    weaponCards,
    childPhaseByWeapon: {
      marker: "marker-fixed",
      thermos: "thermos-fixed",
      scissors: "scissors-fixed",
      correction_fluid: "correction-fluid-fixed"
    },
    uiFramework: {
      weaponSelection: { activeIds: weaponCards.map(function (item) { return item.id; }), cardCapacity: 8, registryLabel: "Demo V2.9 可玩武器" },
      itemShop: { enabled: false, mountId: "itemOfferSection", offerCapacity: 4, reserved: true }
    }
  };

  fourWeaponFixed.uiFramework.weaponSelection.registryLabel = "Demo V2.9 可玩武器";

  V2.demoV2.fourWeaponFixed = fourWeaponFixed;
  V2.demoV2.fixedTests["four-weapon-fixed"] = fourWeaponFixed;

  // Demo V3.0 is a presentation-and-feedback pass over the proven V2.9
  // framework. It deliberately reuses the same four isolated weapon configs,
  // encounters, shops and module rules; only the coordinator opts into the
  // stronger player-facing combat grammar and neon-city surface treatment.
  const fourWeaponV3 = {
    id: "four-weapon-v3",
    version: "Demo V3.0",
    visualVersion: "霓虹战斗感知版",
    coordinator: true,
    combatExperiencePass: true,
    neonCityTheme: true,
    weaponId: "",
    weaponName: "四武器",
    title: "霓虹战斗感知版",
    subtitle: "在同一套17关成长框架中，用路径、空间、位移与错误状态建立四种一眼可辨的战斗因果链。",
    weaponCards,
    childPhaseByWeapon: Object.assign({}, fourWeaponFixed.childPhaseByWeapon),
    uiFramework: {
      weaponSelection: {
        activeIds: weaponCards.map(function (item) { return item.id; }),
        cardCapacity: 8,
        registryLabel: "Demo V3.0 可玩武器"
      },
      itemShop: { enabled: false, mountId: "itemOfferSection", offerCapacity: 4, reserved: true }
    }
  };

  V2.demoV2.fourWeaponV3 = fourWeaponV3;
  V2.demoV2.fixedTests["four-weapon-v3"] = fourWeaponV3;

  // Demo V3.1 keeps every V3.0 system and route, but redistributes the same
  // combat budget into smaller, faster hits and denser enemy batches. The
  // extra flag also enables route-specific silhouette polish without leaking
  // those balance or rendering changes into the preserved V2/V3.0 snapshots.
  const fourWeaponV31 = Object.assign({}, fourWeaponV3, {
    id: "four-weapon-v3-1",
    version: "Demo V3.1",
    visualVersion: "高频割草与技能轮廓版",
    title: "高频割草与技能轮廓版",
    subtitle: "降低单次数字、提高攻击频率与敌群供给，让路径、空间、位移与错误状态持续拥有可收割的目标。",
    combatDensityPass: true,
    skillSilhouettePass: true,
    childPhaseByWeapon: Object.assign({}, fourWeaponV3.childPhaseByWeapon),
    uiFramework: {
      weaponSelection: {
        activeIds: weaponCards.map(function (item) { return item.id; }),
        cardCapacity: 8,
        registryLabel: "Demo V3.1 可玩武器"
      },
      itemShop: { enabled: false, mountId: "itemOfferSection", offerCapacity: 4, reserved: true }
    }
  });

  V2.demoV2.fourWeaponV31 = fourWeaponV31;
  V2.demoV2.fixedTests["four-weapon-v3-1"] = fourWeaponV31;

  // Demo V3.2 deepens the combat triangle rather than adding a fourth balance
  // axis: each strike is smaller, strikes happen more often, and the encounter
  // director keeps a larger pool of valid targets on screen. Neon bloom is a
  // separate presentation flag so V3.1 remains a stable regression snapshot.
  const fourWeaponV32 = Object.assign({}, fourWeaponV31, {
    id: "four-weapon-v3-2",
    version: "Demo V3.2",
    visualVersion: "深层割草预算与霓虹增幅版",
    title: "深层割草预算与霓虹增幅版",
    subtitle: "继续压低单击、缩短攻击空窗并维持有效敌群，让每次机制成长都有足够目标承接，同时强化真实技能事件的霓虹辉光。",
    combatTrianglePass: true,
    neonBloomPass: true,
    childPhaseByWeapon: Object.assign({}, fourWeaponV31.childPhaseByWeapon),
    uiFramework: {
      weaponSelection: {
        activeIds: weaponCards.map(function (item) { return item.id; }),
        cardCapacity: 8,
        registryLabel: "Demo V3.2 可玩武器"
      },
      itemShop: { enabled: false, mountId: "itemOfferSection", offerCapacity: 4, reserved: true }
    }
  });

  V2.demoV2.fourWeaponV32 = fourWeaponV32;
  V2.demoV2.fixedTests["four-weapon-v3-2"] = fourWeaponV32;

  // Demo V3.3 keeps the V3.2 combat triangle intact and repairs only the
  // Correction Fluid opening. Its primary spray remains a single lock, but
  // the liquid may overspray one nearby enemy until Fatal Correction provides
  // true independent multi-target cultivation.
  const fourWeaponV33 = Object.assign({}, fourWeaponV32, {
    id: "four-weapon-v3-3",
    version: "Demo V3.3",
    visualVersion: "修正液前期循环强化版",
    title: "修正液前期循环强化版",
    subtitle: "保留单目标主喷涂与三层错误母题，通过近邻溅写让修正液在第一阶段就能周转敌群；致命纠错仍独占真正的多目标锁定。",
    correctionOpeningPass: true,
    childPhaseByWeapon: Object.assign({}, fourWeaponV32.childPhaseByWeapon),
    uiFramework: {
      weaponSelection: {
        activeIds: weaponCards.map(function (item) { return item.id; }),
        cardCapacity: 8,
        registryLabel: "Demo V3.3 可玩武器"
      },
      itemShop: { enabled: false, mountId: "itemOfferSection", offerCapacity: 4, reserved: true }
    }
  });

  V2.demoV2.fourWeaponV33 = fourWeaponV33;
  V2.demoV2.fixedTests["four-weapon-v3-3"] = fourWeaponV33;

  // Demo V3.4 keeps the four weapon builds and their V3.3 balance intact.
  // This pass changes encounter space only: runs begin at the world centre,
  // enemy waves enter from a randomized perimeter, and Bosses gain readable
  // avoidable attack patterns instead of relying on health alone.
  const fourWeaponV34 = Object.assign({}, fourWeaponV33, {
    id: "four-weapon-v3-4",
    version: "Demo V3.4",
    visualVersion: "Boss机制与环形战场版",
    title: "Boss机制与环形战场版",
    subtitle: "出生点回到战场中心，怪群从完整环形边界随机进入；Boss用锁定走廊与缺口弹幕迫使玩家读招和移动，而不是只靠厚血量拖延。",
    centeredRunStart: true,
    randomizedPerimeterSpawns: true,
    bossPatternPass: true,
    childPhaseByWeapon: Object.assign({}, fourWeaponV33.childPhaseByWeapon),
    uiFramework: {
      weaponSelection: {
        activeIds: weaponCards.map(function (item) { return item.id; }),
        cardCapacity: 8,
        registryLabel: "Demo V3.4 可玩武器"
      },
      itemShop: { enabled: false, mountId: "itemOfferSection", offerCapacity: 4, reserved: true }
    }
  });

  V2.demoV2.fourWeaponV34 = fourWeaponV34;
  V2.demoV2.fixedTests["four-weapon-v3-4"] = fourWeaponV34;

  // Demo V3.5 turns the V3.4 encounter-space repair into sustained pressure.
  // It keeps the same four weapons and Boss telegraphs, but paces enemy quota
  // across the whole encounter, restores Boss attacks between pattern windows,
  // and makes component-driven attack-shape growth easier to read.
  const fourWeaponV35 = Object.assign({}, fourWeaponV34, {
    id: "four-weapon-v3-5",
    version: "Demo V3.5",
    visualVersion: "持续压力与属性兑现版",
    title: "持续压力与属性兑现版",
    subtitle: "怪群不再集中于开场耗尽配额，而会持续压入战场；Boss在专属招式之间继续射击或冲刺，范围等属性会同步扩大真实攻击形态。",
    sustainedPressurePass: true,
    bossPressurePass: true,
    attributeImpactPass: true,
    childPhaseByWeapon: Object.assign({}, fourWeaponV34.childPhaseByWeapon),
    uiFramework: {
      weaponSelection: {
        activeIds: weaponCards.map(function (item) { return item.id; }),
        cardCapacity: 8,
        registryLabel: "Demo V3.5 可玩武器"
      },
      itemShop: { enabled: false, mountId: "itemOfferSection", offerCapacity: 4, reserved: true }
    }
  });

  V2.demoV2.fourWeaponV35 = fourWeaponV35;
  V2.demoV2.fixedTests["four-weapon-v3-5"] = fourWeaponV35;

  // Demo V3.6 preserves the complete V3.5 balance and encounter package.
  // This pass packages the Marker desire-loop visual contract into the fixed
  // four-weapon suite: body-facing printer cartridges stay readable on the
  // wearer, while the physical pen follows the real attack aim and amount.
  const fourWeaponV36 = Object.assign({}, fourWeaponV35, {
    id: "four-weapon-v3-6",
    version: "Demo V3.6",
    visualVersion: "马克笔人武器实体化版",
    title: "马克笔人武器实体化版",
    subtitle: "完整继承 V3.5 数值、敌群与构筑；马克笔、复写墨盒和留档墨盒进入实机穿戴层，攻击方向、组件数量和模块亮度都由真实战斗状态驱动。",
    weaponEmbodimentPass: true,
    childPhaseByWeapon: Object.assign({}, fourWeaponV35.childPhaseByWeapon),
    uiFramework: {
      weaponSelection: {
        activeIds: weaponCards.map(function (item) { return item.id; }),
        cardCapacity: 8,
        registryLabel: "Demo V3.6 可玩武器"
      },
      itemShop: { enabled: false, mountId: "itemOfferSection", offerCapacity: 4, reserved: true }
    }
  });

  V2.demoV2.fourWeaponV36 = fourWeaponV36;
  V2.demoV2.fixedTests["four-weapon-v3-6"] = fourWeaponV36;

  // Demo V3.7 preserves every V3.6 combat and Marker-embodiment rule while
  // extending the same physical-ownership contract to Thermos. The worn
  // pressure rack follows body facing; only the real cup/nozzle follows aim.
  const fourWeaponV37 = Object.assign({}, fourWeaponV36, {
    id: "four-weapon-v3-7",
    version: "Demo V3.7",
    visualVersion: "保温杯压力工位异化版",
    title: "保温杯压力工位异化版",
    subtitle: "完整继承 V3.6 数值、敌群与马克笔实体化；保温杯改为随身茶水压力架，冷凝仓和热浪储压仓固定穿戴，杯口只跟随真实攻击方向。",
    thermosEmbodimentPass: true,
    childPhaseByWeapon: Object.assign({}, fourWeaponV36.childPhaseByWeapon),
    uiFramework: {
      weaponSelection: {
        activeIds: weaponCards.map(function (item) { return item.id; }),
        cardCapacity: 8,
        registryLabel: "Demo V3.7 可玩武器"
      },
      itemShop: { enabled: false, mountId: "itemOfferSection", offerCapacity: 4, reserved: true }
    }
  });

  V2.demoV2.fourWeaponV37 = fourWeaponV37;
  V2.demoV2.fixedTests["four-weapon-v3-7"] = fourWeaponV37;

  // Demo V3.8 keeps the complete V3.7 combat snapshot and makes the worn
  // Thermos pressure system react on every real attack. Condensation vents
  // frost gas, Kill-Heatwave vents hot steam, and the physical route packs
  // absorb the release with a short body-facing recoil.
  const fourWeaponV38 = Object.assign({}, fourWeaponV37, {
    id: "four-weapon-v3-8",
    version: "Demo V3.8",
    visualVersion: "保温杯双路泄压反馈版",
    title: "保温杯双路泄压反馈版",
    subtitle: "完整继承 V3.7 数值、敌群与穿戴结构；每轮攻击同步驱动背部压力装置，冷凝侧释放冰雾霜粒，热浪侧释放高温蒸汽与火星，并以短促后坐缓冲强化异化感。",
    thermosBackPressurePass: true,
    childPhaseByWeapon: Object.assign({}, fourWeaponV37.childPhaseByWeapon),
    uiFramework: {
      weaponSelection: {
        activeIds: weaponCards.map(function (item) { return item.id; }),
        cardCapacity: 8,
        registryLabel: "Demo V3.8 可玩武器"
      },
      itemShop: { enabled: false, mountId: "itemOfferSection", offerCapacity: 4, reserved: true }
    }
  });

  V2.demoV2.fourWeaponV38 = fourWeaponV38;
  V2.demoV2.fixedTests["four-weapon-v3-8"] = fourWeaponV38;

  // Demo V3.9 preserves the complete V3.8 combat snapshot and extends the
  // physical-ownership contract to Scissors and Correction Fluid. One full
  // pair of scissors owns every cut; the correction reservoir visibly
  // squeezes through attached nozzles before white error marks appear.
  const fourWeaponV39 = Object.assign({}, fourWeaponV38, {
    id: "four-weapon-v3-9",
    version: "Demo V3.9",
    visualVersion: "剪刀与修正液异化显形版",
    title: "剪刀与修正液异化显形版",
    subtitle: "完整继承 V3.8 数值、敌群与关卡；剪刀以完整双环、铰链和双刃直接完成突刺与梦幻连剪，修正液以身体储液囊、软管喷头和白色错误痕迹建立可见因果链。",
    scissorsEmbodimentPass: true,
    correctionEmbodimentPass: true,
    childPhaseByWeapon: Object.assign({}, fourWeaponV38.childPhaseByWeapon),
    uiFramework: {
      weaponSelection: {
        activeIds: weaponCards.map(function (item) { return item.id; }),
        cardCapacity: 8,
        registryLabel: "Demo V3.9 可玩武器"
      },
      itemShop: { enabled: false, mountId: "itemOfferSection", offerCapacity: 4, reserved: true }
    }
  });

  V2.demoV2.fourWeaponV39 = fourWeaponV39;
  V2.demoV2.fixedTests["four-weapon-v3-9"] = fourWeaponV39;
})();
