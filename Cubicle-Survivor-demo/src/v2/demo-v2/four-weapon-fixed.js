// ================================================================
// Demo V2.6 four-weapon playtest coordinator.
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
    version: "Demo V2.6",
    visualVersion: "赛博霓虹整合版",
    coordinator: true,
    weaponId: "",
    weaponName: "四武器",
    title: "四武器固定框架试玩",
    subtitle: "同一局制框架下选择路径、空间、位移或状态关系；暗色办公室承载四种不同强度的霓虹异化。",
    weaponCards,
    childPhaseByWeapon: {
      marker: "marker-fixed",
      thermos: "thermos-fixed",
      scissors: "scissors-fixed",
      correction_fluid: "correction-fluid-fixed"
    },
    uiFramework: {
      weaponSelection: { activeIds: weaponCards.map(function (item) { return item.id; }), cardCapacity: 8, registryLabel: "Demo V2.6 可玩武器" },
      itemShop: { enabled: false, mountId: "itemOfferSection", offerCapacity: 4, reserved: true }
    }
  };

  V2.demoV2.fourWeaponFixed = fourWeaponFixed;
  V2.demoV2.fixedTests["four-weapon-fixed"] = fourWeaponFixed;
})();
