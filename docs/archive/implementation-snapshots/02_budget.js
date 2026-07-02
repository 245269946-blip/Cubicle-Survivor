// ================================================================
// 02_POWER BUDGET 强度预算
// 武器预算·升级词条预算·Build总预算·终局改造预算
// File: 02_budget.js | Load order: 2/7
// ================================================================

function getStageConfig(stage) {
  const names = ["漏洞潮", "需求变更", "晨会围堵", "截止线", "复盘压力", "季度审判", "紧急上线", "跨组拉齐", "财年封版", "审计追问", "组织调整", "灰度事故", "年度述职", "终局评审"];
  const mixes = [
    { bug: 1 },
    { bug: 0.72, change: 0.28 },
    { bug: 0.52, change: 0.24, meeting: 0.24 },
    { bug: 0.42, change: 0.28, meeting: 0.18, deadline: 0.12 },
    { bug: 0.26, change: 0.24, meeting: 0.18, deadline: 0.18, intern: 0.14 },
    { bug: 0.2, change: 0.22, meeting: 0.2, deadline: 0.24, alarm: 0.14 },
    { bug: 0.18, change: 0.18, meeting: 0.16, deadline: 0.3, alarm: 0.18 },
    { bug: 0.13, change: 0.28, meeting: 0.24, deadline: 0.16, intern: 0.12, manager: 0.07 },
    { bug: 0.15, change: 0.2, meeting: 0.2, deadline: 0.26, audit: 0.12, alarm: 0.07 },
    { bug: 0.14, change: 0.22, meeting: 0.22, deadline: 0.22, audit: 0.12, manager: 0.08 },
    { bug: 0.1, change: 0.2, meeting: 0.28, deadline: 0.2, audit: 0.12, manager: 0.1 },
    { bug: 0.1, change: 0.3, meeting: 0.2, deadline: 0.2, intern: 0.12, manager: 0.08 },
    { bug: 0.18, change: 0.16, meeting: 0.16, deadline: 0.3, alarm: 0.1, audit: 0.1 },
    { bug: 0.12, change: 0.22, meeting: 0.22, deadline: 0.22, alarm: 0.08, audit: 0.08, manager: 0.06 },
  ];
  const pressureStage = stage === 3 || stage === 5 || stage === 8 || stage === 10;
  const burstStage = stage === 4 || stage === 7 || stage === 9;
  const midStage = Math.max(0, stage - 6);
  const lateStage = Math.max(0, stage - 10);
  const scalingStage = Math.max(0, stage - 1);
  const latePressure = Math.max(0, stage - 8);
  return {
    name: names[Math.min(names.length - 1, stage - 1)],
    duration: WAVE_SECONDS + Math.max(0, stage - 4) * 2 + lateStage,
    totalEnemies: Math.round((24 + stage * 9.2 + midStage * 5.5 + lateStage * 6 - (stage <= 3 ? 4 + stage * 2 : 0)) * (stage === 1 ? 0.82 : 1)),
    maxConcurrent: Math.round((16 + stage * 4.2 + midStage * 2.5 + lateStage * 3) * (pressureStage ? 1.15 : 1) * (stage === 1 ? 0.7 : 1)),
    spawnInterval: Math.max(0.16, 0.88 - stage * 0.044 - midStage * 0.022 - lateStage * 0.014) * (stage === 1 ? 1.3 : 1),
    batchSize: stage === 1 ? 1 : Math.min(6, 1 + Math.floor(stage / 2) + (burstStage ? 1 : 0)),
    eliteTotal: Math.max(0, Math.floor((stage - 1) / 2) + (stage >= 8 ? 1 : 0) + (stage >= 12 ? 1 : 0)),
    healthMult: 1 + stage * 0.14 + scalingStage * scalingStage * 0.028 + midStage * 0.09 + latePressure * latePressure * 0.024 + (stage >= 8 ? stage * 0.025 : 0),
    speedMult: 0.98 + stage * 0.052 + midStage * 0.022 + lateStage * 0.04 + (burstStage ? 0.05 : 0) + (stage >= 6 ? 0.02 : 0),
    damageMult: (1 + stage * 0.085 + midStage * 0.075 + latePressure * 0.055) * (pressureStage ? 1.09 : 1),
    materialMult: 0.76 + stage * 0.047 + lateStage * 0.018,
    enemyMix: mixes[Math.min(mixes.length - 1, stage - 1)],
    clearBonusMult: burstStage || stage === 10 ? 1.22 : 1,
    survivalPressure: pressureStage ? 1.1 : burstStage ? 1.05 : 1,
  };
}
function getEndlessStageConfig(level) {
  const mix = level < 2
    ? { bug: 0.2, change: 0.2, meeting: 0.2, deadline: 0.22, alarm: 0.1, audit: 0.08 }
    : level < 5
      ? { bug: 0.16, change: 0.18, meeting: 0.22, deadline: 0.24, alarm: 0.1, audit: 0.06, manager: 0.04 }
      : { bug: 0.12, change: 0.2, meeting: 0.24, deadline: 0.22, alarm: 0.08, audit: 0.08, manager: 0.06 };
  return {
    name: `持续加班 ${level + 1}`,
    duration: Infinity,
    totalEnemies: Infinity,
    maxConcurrent: Math.round(44 + level * 3.2),
    spawnInterval: Math.max(0.18, 0.42 - level * 0.012),
    batchSize: Math.min(8, 5 + Math.floor(level / 3)),
    eliteTotal: Infinity,
    healthMult: 4.85 + level * 0.22 + level * level * 0.008,
    speedMult: 1.38 + level * 0.045,
    damageMult: 2.18 + level * 0.075,
    materialMult: 1.38 + level * 0.035,
    enemyMix: mix,
    clearBonusMult: 0,
    survivalPressure: 1.18 + level * 0.035,
  };
}
function getShopOfferCost(entry) {
  const aligned = isEntryAlignedWithBuild(entry);
  if (entry.shopType === "item") return Math.max(16, Math.round(18 + game.stage * 5.2 + game.boughtItems.size * 3.2 - (aligned ? 4 : 0)));
  const weaponId = getUpgradeWeaponId(entry.id);
  const level = weaponId ? game.weapons[weaponId].level : 0;
  const owned = weaponId && game.weapons[weaponId].level > 0;
  const firstBuyDiscount = owned ? 0 : 4;
  const penalty = (game.weaponUpgradeCostPenalty || 0) + (game.weaponCostDouble ? 1 : 0);
  return Math.max(14, Math.round((16 + level * 11 + game.stage * 4.6 - firstBuyDiscount - (aligned ? 5 : 0)) * (penalty ? penalty : 1)));
}
function getWeaponSellValue(weaponId) {
  const weapon = game.weapons[weaponId];
  if (!weapon) return 0;
  return Math.max(8, Math.round(8 + weapon.level * 7 + game.stage * 2));
}
function getShopOfferCount() {
  return 4;
}
function getRefreshCost() {
  return Math.max(2, 7 + game.rerollCount * 4 + (game.policyRefreshAdd || 0) - (game.permanentRefreshDiscount || 0));
}
function getClassBonus(key) {
  if (!game) return 0;
  const counts = getWeaponClassCounts();
  let total = 0;
  for (const [className, count] of Object.entries(counts)) {
    const tiers = weaponClassBonuses[className] || [];
    let active = null;
    for (const tier of tiers) {
      const threshold = Math.max(1, tier.count + (game.policyClassThresholdOffset || 0));
      if (count >= threshold) active = tier;
    }
    if (active && active[key]) total += active[key] * (game.policyClassBonusMult || 1);
  }
  return total;
}
function getAuraRadius() {
  const anchor = getAnchorCharge();
  return game.player.auraRadius
    + getClassBonus("fieldRadius")
    + (hasWeaponPair("headset", "report", 2) ? 24 : 0)
    + Math.round(anchor * (18 + getEffectiveStat("fortify") * 1.8));
}
function getThermosTeaMax() {
  return Math.max(game.weapons.thermos.level >= 5 ? 200 : 100, game.player.thermosTeaMax);
}
function getThermosRadius() {
  return game.player.thermosRadius
    + getClassBonus("fieldRadius") * 0.5
    + Math.max(0, getEffectiveStat("fortify") * 1.5)
    + Math.max(0, (game.player.thermosTea - 50) * 0.12);
}
function getTrapRadiusBonus() {
  return Math.round(
    clamp(getEffectiveStat("luck"), 0, 240) * 0.32
    + Math.max(0, getEffectiveStat("pickupRange") - 150) * 0.08
    + getClassBonus("engineering") * 42
    + getAnchorCharge() * getEffectiveStat("fortify"),
  );
}
function getEngineeringUtility() {
  return clamp(getEffectiveStat("luck"), 0, 260) * 0.18
    + Math.max(0, getEffectiveStat("pickupRange") - 150) * 0.07
    + getClassBonus("engineering") * 38;
}
function getAnchorCharge() {
  if (!game) return 0;
  return clamp(game.player.anchorTime / getAnchorMaxTime(), 0, 1);
}
function getAnchorMaxTime() {
  return Math.max(1.35, 2.8 - getEffectiveStat("fortify") * 0.035);
}
function getEmployeePoints() {
  return Number.parseInt(localStorage.getItem(EMPLOYEE_POINTS_KEY) || "0", 10) || 0;
}
function setEmployeePoints(points) {
  localStorage.setItem(EMPLOYEE_POINTS_KEY, String(Math.max(0, Math.floor(points))));
}
function addEmployeePoints(amount) {
  const total = getEmployeePoints() + amount;
  setEmployeePoints(total);
  return total;
}
function getPermanentUpgradeLevels() {
  try {
    return JSON.parse(localStorage.getItem(EMPLOYEE_UPGRADES_KEY) || "{}") || {};
  } catch {
    return {};
  }
}
function setPermanentUpgradeLevels(levels) {
  localStorage.setItem(EMPLOYEE_UPGRADES_KEY, JSON.stringify(levels));
}
function getPermanentUpgradeLevel(id) {
  return getPermanentUpgradeLevels()[id] || 0;
}
function applyPermanentUpgrades(targetGame) {
  const levels = getPermanentUpgradeLevels();
  for (const upgrade of permanentUpgrades) {
    const level = levels[upgrade.id] || 0;
    if (level > 0) upgrade.apply(targetGame, level);
  }
  targetGame.permanentRefreshDiscount = Math.min(2, levels.refresh || 0);
  targetGame.player.hp = Math.min(targetGame.player.maxHp, targetGame.player.hp);
}