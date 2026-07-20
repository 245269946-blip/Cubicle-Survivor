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
})();
