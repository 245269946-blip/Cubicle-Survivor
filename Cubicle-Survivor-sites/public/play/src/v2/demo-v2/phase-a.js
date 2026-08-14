// ================================================================
// Demo V2 Phase A contract.
// This file defines the isolated 60-second weapon x encounter test.
// The current Demo V1 flow remains the default runtime.
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});
  const V2 = CS.V2 || (CS.V2 = {});

  const waves = [
    {
      id: "queue",
      label: "队列波",
      start: 0,
      end: 15,
      cadence: 2.35,
      batchSize: 7,
      hint: "邮件和待办排队进入，检验贯穿、对齐和多出口。"
    },
    {
      id: "cluster",
      label: "团块波",
      start: 15,
      end: 30,
      cadence: 2.5,
      batchSize: 8,
      hint: "密集工作同时压入，检验沸点释放和区域结算。"
    },
    {
      id: "pursuit",
      label: "追逐波",
      start: 30,
      end: 45,
      cadence: 2.55,
      batchSize: 7,
      hint: "冲刺与追踪从多方向接近，检验空窗和移动布阵。"
    },
    {
      id: "review",
      label: "混合评审波",
      start: 45,
      end: 60.1,
      cadence: 2.7,
      batchSize: 8,
      hint: "杂兵、远程、锚点和拆分目标同时出现。"
    }
  ];

  const weaponOverrides = {
    marker: {
      damage: 19,
      cooldown: 0.9,
      range: 780,
      pierce: 6,
      width: 10,
      splitCount: 1,
      splitRange: 190,
      splitPierce: 1,
      splitDamage: 0.38,
      demoV2BaseBranch: true
    },
    thermos: {
      damage: 18,
      cooldown: 0.9,
      heatMax: 100,
      heatRate: 25,
      steamRange: 240,
      steamWidth: 200,
      steamDuration: 1.05,
      steamTickEvery: 0.28,
      steamTickDamage: 4.2,
      steamSlow: 0.65,
      releaseDamage: 62,
      releaseRange: 310,
      releaseWidth: 310,
      releaseDuration: 1.4,
      releaseTickEvery: 0.25,
      releaseTickDamage: 12,
      releaseSlow: 0.8,
      releaseLockoutDuration: 0.85,
      demoV2SteamFan: true
    },
    sticky_note: {
      damage: 12,
      cooldown: 0.92,
      range: 420,
      trapDuration: 8,
      trapRadius: 30,
      triggerRadius: 64,
      slow: 0.3
    }
  };

  V2.demoV2 = Object.assign(V2.demoV2 || {}, {
    phaseA: {
      id: "phase-a",
      title: "60 秒武器 × 敌群暴力测试",
      duration: 60,
      enemyFloor: 12,
      normalEnemyTarget: 24,
      enemyCap: 60,
      stage: {
        id: 1,
        phaseKey: "weapon_intro",
        phaseStep: 1,
        phase: "Demo V2 阶段 A",
        name: "武器 × 敌群暴力测试",
        duration: 60,
        targetKills: 9999,
        spawnEvery: 99,
        enemyHp: 14,
        enemySpeed: 70,
        material: 0,
        enemyMix: [{ type: "todo", weight: 1 }],
        note: "四种波次轮流出题；本轮没有工牌、模块和工坊。",
        threatHint: waves[0].hint,
        demoV2Phase: "phase-a"
      },
      waves,
      weaponOverrides
    }
  });
})();
