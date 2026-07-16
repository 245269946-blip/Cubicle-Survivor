// ================================================================
// 05_CONTENT IMPLEMENTATION 内容实现
// 武器逻辑·敌人AI·道具系统·关卡事件·Boss
// File: 05_content.js | Load order: 5/7
// ================================================================


const itemRarityMeta = {
  common: { label: "普通", recycle: 4, weight: 1 },
  rare: { label: "稀有", recycle: 7, weight: 2 },
  epic: { label: "史诗", recycle: 12, weight: 4 },
  legendary: { label: "传说", recycle: 18, weight: 7 },
  mythic: { label: "神话", recycle: 30, weight: 38 },
};

const itemRarityById = {
  lunchbox: "common",
  rubberSole: "common",
  luckyBadge: "common",
  oldHardDrive: "rare",
  fileCabinet: "common",
  wirelessMouse: "common",
  energyDrink: "rare",
  deskFan: "common",
  macroPad: "rare",
  redPen: "rare",
  projector: "rare",
  laserPointer: "epic",
  standingDesk: "epic",
  assetLedger: "rare",
  quietRoom: "rare",
  redlineContract: "epic",
  insuranceClause: "epic",
  ergonomicMat: "rare",
  whiteboardWall: "epic",
  deskLamp: "rare",
  cableNest: "rare",
  liquorCoffee: "legendary",
  translationHeadset: "epic",
  foreignContract: "legendary",
};

for (const item of itemPool) {
  item.rarity = itemRarityById[item.id] || "common";
}

const permanentUpgrades = [
  {
    id: "maxHp",
    title: "入职体检",
    text: "每级开局生命上限 +8。",
    costs: [75, 150, 300, 520],
    apply: (g, level) => {
      g.player.maxHp += level * 8;
      g.player.hp += level * 8;
    },
  },
  {
    id: "speed",
    title: "通勤路线",
    text: "每级开局移动速度 +6。",
    costs: [75, 180, 360],
    apply: (g, level) => {
      g.player.speed += level * 6;
    },
  },
  {
    id: "materials",
    title: "办公抽屉",
    text: "每级开局材料 +3。",
    costs: [90, 200, 420],
    apply: (g, level) => {
      g.materials += level * 3;
    },
  },
  {
    id: "luck",
    title: "玄学工牌夹",
    text: "每级开局幸运 +5。",
    costs: [110, 250, 520],
    apply: (g, level) => {
      g.player.luck += level * 5;
    },
  },
  {
    id: "refresh",
    title: "供应商熟人",
    text: "每级工坊刷新费用 -1。",
    costs: [220, 460],
    apply: () => {},
  },
];










function loop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000 || 0);
  lastTime = now;

  if (state === "playing") {
    updateGame(dt);
  } else if (state === "recovery") {
    updateStageRecovery(dt);
  }

  render();
  updateHud();

  if (state === "playing" || state === "recovery") {
    requestAnimationFrame(loop);
  }
}

function updateGame(dt) {
  // Hit-stop: freeze game but still process UI
  if (game.hitStop > 0) {
    game.hitStop -= dt;
    game.screenShake = Math.max(0, game.screenShake - dt * 45);
    if (game.hitStop > 0) return; // freeze everything
    dt = -game.hitStop; // leftover time after hit-stop
    game.hitStop = 0;
  }
  game.screenShake = Math.max(0, game.screenShake - dt * 45);
  game.time += dt;
  game.waveTime += dt;
  game.damageFlash = Math.max(0, (game.damageFlash || 0) - dt * 1.9);
  game.itemDropCooldown = Math.max(0, (game.itemDropCooldown || 0) - dt);
  // Perimeter T1: doubled orbit speed when enemies in headset aura (scaled)
  const pEff = getRouteEffectiveness("perimeter");
  const auraBoost = pEff > 0 && game.enemies.some(en => Math.hypot(en.x - game.player.x, en.y - game.player.y) < getAuraRadius() + 30 + en.r);
  game.orbitAngle += game.player.orbitSpeed * dt * (auraBoost ? 1 + 1 * pEff : 1);
  updatePlayer(dt);

  // System update timer blocks attacking
  if (game.systemUpdateTimer > 0) {
    game.systemUpdateTimer -= dt;
    if (game.systemUpdateTimer <= 0) {
      game.systemUpdateTimer = 0;
      floatingText(game.player.x, game.player.y - 50, "系统更新完成！", "#52ffe1");
      // Hidden reversal: system update grants a burst of power
      if (game._updateComplete === false) {
        game._updateComplete = true;
        game._updatePowerTimer = 10;
        floatingText(game.player.x, game.player.y - 80, "性能提升！伤害+30%", "#ffd15c");
      }
    }
  }
  // Hidden: post-update power surge
  if (game._updatePowerTimer > 0) {
    game._updatePowerTimer -= dt;
    if (game._updatePowerTimer <= 0) { game._updatePowerTimer = 0; game._updatePowerActive = false; }
  }
  const skipWeapons = game.systemUpdateTimer > 0;

  if (!skipWeapons) updateWeapons(dt);
  else {
    // System updating: only passive effects (auras, orbits) continue
    updatePassiveEffects(dt);
  }
  updateEnemies(dt);
  updateDamageZones(dt);
  updateDelayedBlasts(dt);
  updateProjectiles(dt);
  updatePickups(dt);
  updateParticles(dt);
  updateFloatingTexts(dt);
  spawnEnemies(dt);
  if (game.endless) updateEndlessMode(dt);

  if (game.player.hp <= 0) {
    endGame(false);
    return;
  }
  updateRouteVisuals(dt);
  updateLowHpVisuals();
  if (!game.endless) {
    if (game.enemiesToSpawn <= 0 && game.enemies.length === 0) completeStage("clear");
    else if (game.waveTime >= game.stageConfig.duration) completeStage("survive");
  }
}




function updatePlayer(dt) {
  const p = game.player;
  let dx = 0;
  let dy = 0;
  if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
  if (keys.has("arrowright") || keys.has("d")) dx += 1;
  if (keys.has("arrowup") || keys.has("w")) dy -= 1;
  if (keys.has("arrowdown") || keys.has("s")) dy += 1;

  if (dx === 0 && dy === 0 && pointer.active) {
    dx = pointer.x - p.x;
    dy = pointer.y - p.y;
    if (Math.hypot(dx, dy) < 10) {
      dx = 0;
      dy = 0;
    }
  }

  const standingStill = dx === 0 && dy === 0;
  const fieldKit = game.weapons.headset.level > 0 || game.weapons.report.level > 0 || p.fortify > 0;
  const anchorMax = getAnchorMaxTime();
  if (standingStill) {
    p.anchorTime = Math.min(anchorMax, p.anchorTime + dt * (1 + getEffectiveStat("fortify") * 0.025));
  } else if (fieldKit) {
    const fieldLevel = game.weapons.headset.level + game.weapons.report.level;
    const nearbyPressure = game.enemies.filter((e) => Math.hypot(e.x - p.x, e.y - p.y) < 170).length;
    const decay = Math.max(0.12, 0.46 - getEffectiveStat("fortify") * 0.012 - fieldLevel * 0.012);
    const carryFloor = Math.min(anchorMax * 0.72, 0.42 + getEffectiveStat("fortify") * 0.045 + fieldLevel * 0.05);
    p.anchorTime = Math.max(carryFloor, p.anchorTime - dt * decay);
    if (nearbyPressure >= 5) p.anchorTime = Math.min(anchorMax, p.anchorTime + dt * Math.min(0.42, nearbyPressure * 0.028));
  } else {
    p.anchorTime = Math.max(0, p.anchorTime - dt * 1.4);
  }

  const len = Math.hypot(dx, dy) || 1;
  if (dx !== 0 || dy !== 0) {
    p.facingX = dx / len;
    p.facingY = dy / len;
  }
  const moveSpeed = p.speed * p.slow;
  p.vx = dx === 0 && dy === 0 ? 0 : (dx / len) * moveSpeed;
  p.vy = dx === 0 && dy === 0 ? 0 : (dy / len) * moveSpeed;
  p.x = clamp(p.x + (dx / len) * moveSpeed * dt, p.r, WORLD.w - p.r);
  p.y = clamp(p.y + (dy / len) * moveSpeed * dt, p.r, WORLD.h - p.r);
  p.slow = 1;
  p.invuln = Math.max(0, p.invuln - dt);
  if (p.regen > 0 && p.hp < p.maxHp) {
    p.regenTimer += dt;
    if (p.regenTimer >= 1) {
      p.hp = Math.min(p.maxHp, p.hp + p.regen);
      p.regenTimer = 0;
    }
  }

  game.camera.x = clamp(p.x - canvas.width / 2, 0, WORLD.w - canvas.width);
  game.camera.y = clamp(p.y - canvas.height / 2, 0, WORLD.h - canvas.height);
}

// Passive-only effects when system update blocks active weapons
function updatePassiveEffects(dt) {
  // Orbit angle still advances
  game.orbitAngle += game.player.orbitSpeed * dt;
  // Headset aura still pulses
  const headset = game.weapons.headset;
  if (headset && headset.level > 0) {
    headset.pulseTimer = (headset.pulseTimer || 0) + dt;
    if (headset.pulseTimer >= headset.pulseCycle && game.enemies.length > 0) {
      headset.pulseTimer = 0;
      const centerX = game.player.x;
      const centerY = game.player.y;
      for (const e of game.enemies) {
        const dist = Math.hypot(e.x - centerX, e.y - centerY);
        if (dist < getAuraRadius()) {
          applyEnemyDamage(e, continuousDamage(8 * getWeaponStatScale("field")), "headset");
        }
      }
    }
  }
  // Sticky traps still tick but don't deal damage
  // Damage zones still persist
}

function updateWeapons(dt) {
  const p = game.player;
  const target = nearestEnemy();
  const precision = hasWeaponPair("coffee", "marker", 2);
  const barrage = hasWeaponPair("keyboard", "stapler", 2);
  const conductor = hasWeaponPair("sticky", "calculator", 2);
  const perimeter = hasWeaponPair("headset", "report", 2);
  const precisionTier = getRouteTier("precision");
  const barrageTier = getRouteTier("barrage");
  const conductorTier = getRouteTier("conductor");
  const perimeterTier = getRouteTier("perimeter");
  // Route dominance effectiveness (0=no pair, 0.5=sub, 1.0=dom, 1.25=sole)
  const precisionEff = getRouteEffectiveness("precision");
  const barrageEff = getRouteEffectiveness("barrage");
  const conductorEff = getRouteEffectiveness("conductor");
  const perimeterEff = getRouteEffectiveness("perimeter");
  game.routeEff = { precision: precisionEff, barrage: barrageEff, conductor: conductorEff, perimeter: perimeterEff };

  updateShredder(dt);
  updateThermos(dt);

  // Precision route: mark decay (only if paired + effectiveness > 0)
  if (precisionEff > 0) {
    for (const e of game.enemies) {
      if (e.precisionMark > 0) e.precisionMark = Math.max(0, e.precisionMark - dt);
    }
  }
  // Barrage: decay keyboard knockback tags (gated by effectiveness)
  if (barrageEff > 0 && barrageTier >= 4) {
    for (const e of game.enemies) {
      if (e.kbTag > 0) e.kbTag = Math.max(0, e.kbTag - dt);
    }
  }
  // Barrage route: surround bonus
  const surroundCount = barrage ? game.enemies.filter(en => Math.hypot(en.x - p.x, en.y - p.y) < 140).length : 0;
  const isSurrounded = surroundCount >= 5 && barrage;

  p.coffeeTimer -= dt;
  if (game.weapons.coffee.level > 0 && p.coffeeTimer <= 0 && target) {
    const level = game.weapons.coffee.level;
    const angle = Math.atan2(target.y - p.y, target.x - p.x);
    p.coffeeShotCount += 1;
    const bigShot = level >= 5 && p.coffeeShotCount % 5 === 0;
    // Precision: distance-based damage (scaled by effectiveness)
    const distBonus = precisionEff > 0 && precisionTier >= 3
      ? 1 + Math.min(0.3, Math.floor(Math.hypot(target.x - p.x, target.y - p.y) / 100) * 0.06) * precisionEff : 1;
    const coffeeLatePenalty = game.stage <= 3 ? 1 : game.stage <= 6 ? 0.7 : 0.45;
    const damage = hitDamage((14 + level * 4.2) * getWeaponStatScale("precise") * (precision ? 1.12 : 1) * (bigShot ? 1.75 : 1) * coffeeLatePenalty * distBonus);
    if (precisionEff > 0) {
      target.precisionMark = 1.5 * precisionEff;
    }
    fireAt(target, bigShot ? 620 : 520, damage, bigShot ? "#fff07a" : "#f4c95d", p.coffeePierce + getClassBonus("pierce") + (precision ? 1 : 0) + (bigShot ? 2 : 0), bigShot ? 7 : 4, 1.15 + rangeBonus(0.004), "coffee");
    if (level >= 3) {
      game.delayedBlasts.push({
        x: target.x,
        y: target.y,
        r: 44 + level * 3,
        delay: hasWeaponEvolution("coffee") ? 1.2 : 0.18,
        damage: damage * (hasWeaponEvolution("coffee") ? 2 : 0.55),
        source: "coffee",
        color: "#f4c95d",
        text: hasWeaponEvolution("coffee") ? "咖啡渍" : "溅射",
      });
    }
    if (level >= 7 && Math.random() < clamp(getEffectiveStat("crit"), 10, 75) / 140) {
      chainLightning(target, 1 + (hasWeaponEvolution("coffee") ? 1 : 0), 210 + rangeBonus(0.35), damage * 0.55, "coffee");
    }
    if (precisionTier >= 3 && level >= 3 && Math.random() < clamp(getEffectiveStat("crit"), 10, 75) / 200) {
      game.damageZones.push({
        x: target.x,
        y: target.y,
        r: 52 + level * 4,
        life: 0.48,
        maxLife: 0.48,
        damage: damage * 0.34,
        source: "coffee",
        tick: 0.24,
        chainTick: Infinity,
        textTick: 0,
        residual: true,
        color: "#b282ff",
      });
      floatingText(target.x, target.y - 18, "校准", "#b282ff");
    }
    if (precision) {
      fireBeam(angle, 420 + rangeBonus(0.9), 3 + Math.floor(level / 2), hitDamage(5 + game.weapons.marker.level * 2.2), "#b282ff", "marker");
      // Precision resonance synergy: extra beam on crit
      if (game.precisionResonanceActive && Math.random() < 0.35) {
        fireBeam(angle + 0.3, 280 + rangeBonus(0.6), 2 + Math.floor(level / 3), hitDamage(4 + level * 1.8), "#c35cff", "marker");
      }
    }
    if (precisionTier >= 4) {
      fireBeam(angle - 0.18, 520 + rangeBonus(1.0), 3 + Math.floor(level / 2), hitDamage(7 + level * 2.4), "#52ffe1", "marker");
      fireBeam(angle + 0.18, 520 + rangeBonus(1.0), 3 + Math.floor(level / 2), hitDamage(7 + level * 2.4), "#c35cff", "marker");
    }
    if (level >= 4) {
      fireAt({ x: target.x + 26, y: target.y - 18 }, 500, hitDamage(9 + level * 2.2), "#f7dda0", 1, 3, 1.05 + rangeBonus(0.003), "coffee");
      fireAt({ x: target.x - 26, y: target.y + 18 }, 500, hitDamage(9 + level * 2.2), "#f7dda0", 1, 3, 1.05 + rangeBonus(0.003), "coffee");
    }
    p.coffeeTimer = weaponCooldown(p.coffeeCooldown * (precision ? 0.88 : 1), "coffee");
  }

  p.keyboardTimer -= dt;
  if (game.weapons.keyboard.level > 0 && p.keyboardTimer <= 0 && target) {
    const level = game.weapons.keyboard.level;
    p.keyboardSwingCount += 1;
    const evolved = hasWeaponEvolution("keyboard");
    const heavyStrike = (level >= 5 || evolved) && p.keyboardSwingCount % 3 === 0;
    const swingArc = Math.PI * (heavyStrike ? 1.15 : 0.89);
    const swingRange = 90 + p.keyboardSwing * 14 + (heavyStrike ? 50 : 0) + (evolved ? 20 : 0);
    const baseAngle = Math.atan2(target.y - p.y, target.x - p.x);
    const kbForce = 50 + p.keyboardKnockback * 18 + (heavyStrike ? 50 : 0);

    let hitCount = 0;
    for (const e of game.enemies) {
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      let angleDiff = angle - baseAngle;
      while (angleDiff > Math.PI) angleDiff -= TAU;
      while (angleDiff < -Math.PI) angleDiff += TAU;
      if (dist < e.r + swingRange && Math.abs(angleDiff) < swingArc / 2) {
        const swingDamage = hitDamage((35 + level * 8.5) * (heavyStrike ? 2.5 : 1) * (barrage ? 1.12 : 1) * (barrageTier >= 4 ? 1.15 : 1) * (evolved ? 1.2 : 1));
        applyEnemyDamage(e, swingDamage, "keyboard");
        e.x += Math.cos(baseAngle) * kbForce;
        e.y += Math.sin(baseAngle) * kbForce;
        e.slow = Math.min(e.slow || 1, evolved ? 0.45 : 0.65);
        if (barrageEff > 0) e.kbTag = 0.5 * barrageEff; // Barrage T4: knockback mark
        if (level >= 4) {
          e.keycapMark = (e.keycapMark || 0) + 2;
        }
        hitCount += 1;
      }
    }

    // Hit-stop + screen shake
    if (hitCount > 0) {
      game.hitStop = heavyStrike ? 0.08 : 0.05;
      game.screenShake = heavyStrike ? 6 : 3;
      // Keycap particles
      for (let i = 0; i < hitCount * 3; i += 1) {
        const a = baseAngle + (Math.random() - 0.5) * swingArc;
        const d = Math.random() * swingRange;
        game.particles.push({
          x: p.x + Math.cos(a) * d,
          y: p.y + Math.sin(a) * d,
          vx: Math.cos(a) * (80 + Math.random() * 120),
          vy: Math.sin(a) * (80 + Math.random() * 120) - 30,
          r: 2 + Math.random() * 3,
          age: 0,
          life: 0.4 + Math.random() * 0.3,
          maxLife: 0.7,
          color: ["#ff6b6b", "#4ecdc4", "#ffe66d", "#a29bfe"][Math.floor(Math.random() * 4)],
        });
      }
    }

    // Keyboard visual model during swing
    game.keyboardSwingVisual = {
      x: p.x, y: p.y,
      angle: baseAngle,
      arc: swingArc,
      range: swingRange,
      life: 0.28,
      maxLife: 0.28,
      heavy: heavyStrike,
    };

    // Swing arc visual trail
    game.swingTrails.push({
      x: p.x, y: p.y,
      angle: baseAngle,
      arc: swingArc,
      range: swingRange,
      life: 0.28,
      maxLife: 0.28,
      heavy: heavyStrike,
    });

    // Barrage T1: keyboard swing hits → stapler fires instantly (gated by effectiveness)
    if (hitCount > 0 && barrageEff > 0 && game.weapons.stapler.level > 0) {
      p.staplerTimer = 0;
    }
    p.keyboardTimer = weaponCooldown(Math.max(0.58, 1.5 - level * 0.15 - (barrage ? 0.12 : 0) - (barrageTier >= 4 ? 0.1 * barrageEff : 0) - (isSurrounded && barrageEff > 0 ? 0.08 : 0)), "keyboard");
  }

  p.staplerTimer -= dt;
  if (game.weapons.stapler.level > 0 && p.staplerTimer <= 0 && target) {
    const level = game.weapons.stapler.level;
    const shots = p.staplerPellets + Math.floor(level / 2) + Math.floor(getEffectiveStat("dodge") / 18) + getClassBonus("projectileMult") + (barrage ? 2 : 0);
    const baseAngle = Math.atan2(target.y - p.y, target.x - p.x);
    for (let i = 0; i < shots; i += 1) {
      const t = shots === 1 ? 0.5 : i / (shots - 1);
      const angle = baseAngle + (t - 0.5) * 0.95;
      spawnProjectile({
        x: p.x + Math.cos(angle) * 12,
        y: p.y + Math.sin(angle) * 12,
        vx: Math.cos(angle) * 560,
        vy: Math.sin(angle) * 560,
        r: 4,
        life: 0.28 + rangeBonus(0.0008),
        damage: hitDamage((13 + level * 4.6) * getWeaponStatScale("barrage") * (barrage ? 1.08 : 1)),
        color: "#d7d0c2",
        pierce: 1,
        source: "stapler",
      });
    }
    if (level >= 5 || hasWeaponEvolution("stapler")) {
      const blastRadius = hasWeaponEvolution("stapler") ? 96 : 64;
      for (const e of game.enemies) {
        if (Math.hypot(e.x - p.x, e.y - p.y) < blastRadius + e.r) {
          applyEnemyDamage(e, hitDamage((10 + level * 3.2) * getWeaponStatScale("barrage")), "stapler");
          e.slow = Math.min(e.slow || 1, 0.72);
        }
      }
      pulse(p.x, p.y, blastRadius, "#d7d0c2");
    }
    p.staplerTimer = weaponCooldown(Math.max(0.5, p.staplerCooldown - level * 0.04 - (barrage ? 0.08 : 0)), "stapler");
  }

  p.stickyTimer -= dt;
  if (game.weapons.sticky.level > 0 && p.stickyTimer <= 0) {
    const level = game.weapons.sticky.level;
    const trapCount = level >= 7 || hasWeaponEvolution("sticky") ? 2 : 1;
    for (let i = 0; i < trapCount; i += 1) {
      const angle = i === 0 ? 0 : game.time * 2.1;
      const offset = i === 0 ? 0 : 46;
      game.damageZones.push({
        x: p.x + Math.cos(angle) * offset,
        y: p.y + Math.sin(angle) * offset,
        r: p.stickyRadius + level * 4 + Math.floor(getEffectiveStat("pickupRange") / 28) + getTrapRadiusBonus(),
        life: p.stickyLife + getEngineeringUtility() * 0.08,
        maxLife: p.stickyLife + getEngineeringUtility() * 0.08,
        damage: continuousDamage((7 + level * 2.8) * getWeaponStatScale("engineering") * (1 + getClassBonus("engineering"))),
        source: "sticky",
        tick: 0,
        chainTick: conductor ? (conductorTier >= 4 ? 0.08 : 0.14) : Infinity,
        textTick: 0,
        explodeOnEnd: level >= 5,
        color: conductorTier >= 4 ? "#52ffe1" : "#fff07a",
      });
    }
    p.stickyTimer = weaponCooldown(Math.max(0.8, p.stickyCooldown - level * 0.05), "sticky");
  }

  p.markerTimer -= dt;
  if (game.weapons.marker.level > 0 && p.markerTimer <= 0 && target) {
    const level = game.weapons.marker.level;
    const angle = Math.atan2(target.y - p.y, target.x - p.x);
    p.markerShotCount += 1;
    const grandBeam = level >= 5 && (p.markerShotCount % 4 === 0 || hasWeaponEvolution("marker"));
    fireBeam(angle, 700 + rangeBonus(1.25) + (grandBeam ? 180 : 0), p.markerWidth + level + Math.floor(getEffectiveStat("crit") / 18) + (precision ? 3 : 0) + (grandBeam ? 12 : 0), hitDamage((24 + level * 7.6) * getWeaponStatScale("precise") * (precision ? 1.12 : 1) * (grandBeam ? 1.45 : 1)), grandBeam ? "#52ffe1" : "#b282ff", "marker");
    if (level >= 7) {
      fireBeam(angle + 0.5, 560 + rangeBonus(0.8), Math.max(6, p.markerWidth * 0.55), hitDamage(12 + level * 3.4), "#b282ff", "marker");
      fireBeam(angle - 0.5, 560 + rangeBonus(0.8), Math.max(6, p.markerWidth * 0.55), hitDamage(12 + level * 3.4), "#b282ff", "marker");
    }
    p.markerTimer = weaponCooldown(Math.max(0.94, p.markerCooldown - level * 0.1 - (precision ? 0.16 : 0)), "marker");
  }

  p.calculatorTimer -= dt;
  if (game.weapons.calculator.level > 0 && p.calculatorTimer <= 0 && target) {
    const level = game.weapons.calculator.level;
    const jumps = p.chainJumps + Math.floor(level / 2) + Math.floor(getEffectiveStat("luck") / 42) + getClassBonus("chain") + (conductor ? 1 : 0) + (conductorTier >= 4 ? 2 : 0) + (hasWeaponEvolution("calculator") ? 2 : 0);
    const chainDamage = hitDamage((17 + level * 5.6) * getWeaponStatScale("engineering") * (1 + getClassBonus("engineering")) * (conductor ? 1.1 : 1) * (conductorTier >= 4 ? 1.12 : 1));
    chainLightning(target, jumps, p.chainRange + rangeBonus(0.8) + (conductor ? 36 : 0) + (conductorTier >= 4 ? 54 : 0), chainDamage, "calculator");
    if (level >= 5 || hasWeaponEvolution("calculator")) {
      game.delayedBlasts.push({
        x: target.x,
        y: target.y,
        r: hasWeaponEvolution("calculator") ? 88 : 56,
        delay: 0.28,
        damage: chainDamage * (hasWeaponEvolution("calculator") ? 1.2 : 0.7),
        source: "calculator",
        color: "#52ffe1",
        text: "复核",
      });
    }
    p.calculatorTimer = weaponCooldown(Math.max(0.88, p.calculatorCooldown - level * 0.07), "calculator");
  }

  const auraLevel = game.weapons.headset.level;
  if (auraLevel > 0) {
    const auraRadius = getAuraRadius();
    let auraHits = 0;
    const auraDps = continuousDamage(p.auraDamage * getWeaponStatScale("field") * (perimeter ? 1 + 0.14 * perimeterEff : 1) * (perimeterTier >= 4 ? 1 + 0.12 * perimeterEff : 1) * (hasWeaponEvolution("headset") ? 1.18 : 1));
    for (const e of game.enemies) {
      const dist = Math.hypot(e.x - p.x, e.y - p.y);
      if (dist < auraRadius + e.r) {
        applyEnemyDamage(e, auraDps * dt, "headset", false);
        // Night watch synergy: armor-based true damage
        if (game.nightWatchActive && p.armor > 0) {
          applyEnemyDamage(e, p.armor * 0.05 * dt, "headset", false);
        }
        e.slow = perimeterTier >= 4 ? 0.54 : perimeter ? 0.66 : 0.72;
        e.hitFlash = Math.max(e.hitFlash || 0, 0.03);
        auraHits += 1;
      }
    }
    p.fieldTextTimer -= dt;
    if (auraHits > 0 && p.fieldTextTimer <= 0) {
      floatingText(p.x, p.y - auraRadius * 0.35, `领域 ${Math.round(auraDps)}/s`, "#52ffe1");
      p.fieldTextTimer = 0.72;
    }
    p.auraPulseTimer -= dt;
    if ((p.auraPulse > 0 || auraLevel >= 5 || hasWeaponEvolution("headset")) && p.auraPulseTimer <= 0) {
      const pulsePower = p.auraPulse + (auraLevel >= 5 ? 1 : 0) + (hasWeaponEvolution("headset") ? 2 : 0);
      for (const e of game.enemies) {
        const dx = e.x - p.x;
        const dy = e.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < auraRadius + 40) {
          e.x += (dx / dist) * ((26 + pulsePower * 8 + (perimeter ? 10 * perimeterEff : 0) + (perimeterTier >= 4 ? 18 * perimeterEff : 0)));
          e.y += (dy / dist) * ((26 + pulsePower * 8 + (perimeter ? 10 * perimeterEff : 0) + (perimeterTier >= 4 ? 18 * perimeterEff : 0)));
          e.slow = Math.min(e.slow || 1, hasWeaponEvolution("headset") ? 0.36 : 0.58);
          applyEnemyDamage(e, continuousDamage((8 + pulsePower * 4) * getWeaponStatScale("field") * (perimeter ? 1 + 0.18 * perimeterEff : 1) * (perimeterTier >= 4 ? 1 + 0.18 * perimeterEff : 1)), "headset");
        }
      }
      pulse(p.x, p.y, auraRadius + 28, "#42d7b8");
      p.auraPulseTimer = weaponCooldown(Math.max(0.82, 2.6 - pulsePower * 0.22), "headset");
    }
  }

  const orbitLevel = game.weapons.report.level;
  if (orbitLevel > 0) {
    const orbiters = getOrbiters();
    for (const orb of orbiters) {
      for (const e of game.enemies) {
        if (Math.hypot(e.x - orb.x, e.y - orb.y) < e.r + orb.r) {
          applyEnemyDamage(e, continuousDamage((17 + orbitLevel * 4.6) * getWeaponStatScale("field") * (perimeter ? 1 + 0.18 * perimeterEff : 1)) * dt, "report", false);
          if (orbitLevel >= 5 || hasWeaponEvolution("report")) e.slow = Math.min(e.slow || 1, hasWeaponEvolution("report") ? 0.54 : 0.7);
          e.hitFlash = 0.08;
        }
      }
    }
    if (hasWeaponEvolution("report") && Math.floor(game.time * 2.2) !== Math.floor((game.time - dt) * 2.2)) {
      for (const e of game.enemies) {
        if (Math.hypot(e.x - p.x, e.y - p.y) < p.orbitRadius + 90 + e.r) {
          applyEnemyDamage(e, continuousDamage(9 + orbitLevel * 2.6), "report");
        }
      }
      pulse(p.x, p.y, p.orbitRadius + 90, "#ffd15c");
    }
  }

  if (perimeterEff > 0 && perimeterTier >= 3 && getAnchorCharge() >= 1) {
    game.perimeterPulseCooldown = Math.max(0, (game.perimeterPulseCooldown || 0) - dt);
    if (game.perimeterPulseCooldown <= 0) {
      const isAnnualReport = perimeterTier >= 4;
      const baseRadius = isAnnualReport ? 320 : 122;
      const pulseRadius = baseRadius + Math.min(60, getEffectiveStat("fortify") * 2.5);
      const pulseForce = (isAnnualReport ? 120 : 58) * perimeterEff;
      const pulseSlow = isAnnualReport ? 0.28 : 0.5;
      for (const e of game.enemies) {
        const dx = e.x - p.x;
        const dy = e.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < pulseRadius + e.r) {
          e.x += (dx / dist) * pulseForce;
          e.y += (dy / dist) * pulseForce;
          e.slow = Math.min(e.slow || 1, pulseSlow);
          applyEnemyDamage(e, continuousDamage(((isAnnualReport ? 18 : 4) + getEffectiveStat("fortify") * (isAnnualReport ? 1.1 : 0.55)) * perimeterEff), "headset");
          if (isAnnualReport) e.hitFlash = 0.25;
        }
      }
      pulse(p.x, p.y, pulseRadius, "#ffd15c");
      floatingText(p.x, p.y - 42, isAnnualReport ? "年度汇报！" : "结界脉冲", "#ffd15c");
      game.perimeterPulseCooldown = isAnnualReport ? 12 : 8;
    }
  } else {
    game.perimeterPulseCooldown = Math.max(0, (game.perimeterPulseCooldown || 0) - dt);
  }
}

function updateShredder(dt) {
  const weapon = game.weapons.shredder;
  if (!weapon || weapon.level <= 0) return;
  const p = game.player;
  const level = weapon.level;
  if (!target) return;

  const coneAngle = (p.shredderConeAngle * Math.PI) / 180;
  const coneRange = p.shredderRange;
  const coneDps = hitDamage(p.shredderDps + level * 3);
  const baseAngle = Math.atan2(target.y - p.y, target.x - p.x);

  let killCount = 0;
  for (const e of game.enemies) {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const dist = Math.hypot(dx, dy);
    if (dist > e.r + coneRange) continue;
    let angleDiff = Math.atan2(dy, dx) - baseAngle;
    while (angleDiff > Math.PI) angleDiff -= TAU;
    while (angleDiff < -Math.PI) angleDiff += TAU;
    if (Math.abs(angleDiff) > coneAngle / 2) continue;

    const before = e.hp;
    applyEnemyDamage(e, coneDps * dt, "shredder", false);
    e.slow = Math.min(e.slow || 1, level >= 5 ? 0.62 : 0.72);
    e.hitFlash = Math.max(e.hitFlash || 0, 0.04);

    // Paper confetti particles
    if (Math.random() < 0.35) {
      game.particles.push({
        x: e.x + (Math.random() - 0.5) * 16,
        y: e.y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 80,
        vy: (Math.random() - 0.5) * 80 - 20,
        r: 1 + Math.random() * 2,
        age: 0, life: 0.4 + Math.random() * 0.3, maxLife: 0.7,
        color: "#f4f0e8",
      });
    }
    if (before > 0 && e.hp <= 0) killCount += 1;
  }

  // Kill burst at level 4+
  if (killCount > 0 && level >= 4) {
    p.shredderKills += killCount;
    const hasAuto = level >= 6;
    while (p.shredderKills >= (hasAuto ? 3 : 6)) {
      p.shredderKills -= (hasAuto ? 3 : 6);
      const ba = Math.random() * TAU;
      const bd = Math.random() * 30;
      game.damageZones.push({
        x: p.x + Math.cos(ba) * bd,
        y: p.y + Math.sin(ba) * bd,
        r: 28 + level * 4,
        life: 0.35,
        maxLife: 0.35,
        damage: coneDps * 0.6,
        source: "shredder",
        tick: 0.18,
        chainTick: Infinity,
        textTick: 0,
        residual: true,
        color: "#a9b8c6",
      });
      // Confetti burst
      for (let j = 0; j < 8; j += 1) {
        const ca = Math.random() * TAU;
        game.particles.push({
          x: p.x + Math.cos(ba) * bd,
          y: p.y + Math.sin(ba) * bd,
          vx: Math.cos(ca) * (60 + Math.random() * 80),
          vy: Math.sin(ca) * (60 + Math.random() * 80) - 30,
          r: 1.5 + Math.random() * 2.5,
          age: 0, life: 0.5 + Math.random() * 0.4, maxLife: 0.9,
          color: ["#f4f0e8", "#c5d4df", "#d0d8e0"][Math.floor(Math.random() * 3)],
        });
      }
    }
    if (killCount >= 4) floatingText(p.x, p.y - 30, "绞碎 " + killCount, "#a9b8c6");
  }

  // Cone spray particles
  if (Math.random() < 0.6) {
    const sa = baseAngle + (Math.random() - 0.5) * coneAngle;
    const sd = Math.random() * coneRange;
    game.particles.push({
      x: p.x + Math.cos(sa) * sd,
      y: p.y + Math.sin(sa) * sd,
      vx: Math.cos(sa) * (40 + Math.random() * 60),
      vy: Math.sin(sa) * (40 + Math.random() * 60) - 10,
      r: 1 + Math.random() * 1.5,
      age: 0, life: 0.4 + Math.random() * 0.3, maxLife: 0.7,
      color: "#f4f0e8",
    });
  }
}

function updateThermos(dt) {
  const weapon = game.weapons.thermos;
  if (!weapon || weapon.level <= 0) return;
  const p = game.player;
  const level = weapon.level;
  p.thermosTeaMax = getThermosTeaMax();
  p.thermosTea = Math.min(p.thermosTea, p.thermosTeaMax);
  const speed = Math.hypot(p.vx || 0, p.vy || 0);
  const chargeMult = 1 + p.thermosChargeBonus + (level >= 2 ? 0.4 : 0) + (level >= 5 ? 0.25 : 0);
  if (speed < 30) {
    p.thermosTea = Math.min(p.thermosTeaMax, p.thermosTea + 28 * chargeMult * dt);
  } else if (speed < 120) {
    p.thermosTea = Math.min(p.thermosTeaMax, p.thermosTea + 12 * chargeMult * dt);
  } else {
    p.thermosTea = Math.max(0, p.thermosTea - 4 * dt);
  }

  p.thermosTextTimer = Math.max(0, p.thermosTextTimer - dt);
  p.thermosPuddleTimer = Math.max(0, p.thermosPuddleTimer - dt);
  if (p.thermosTea < 50) return;

  const hot = p.thermosTea >= 75;
  const radius = getThermosRadius();
  const healRate = level >= 3 && hot ? 4 : 2;
  p.hp = Math.min(p.maxHp, p.hp + healRate * dt);
  let hitCount = 0;
  for (const e of game.enemies) {
    if (Math.hypot(e.x - p.x, e.y - p.y) < e.r + radius) {
      e.slow = Math.min(e.slow || 1, hot ? 0.68 : 0.82);
      e.hitFlash = Math.max(e.hitFlash || 0, 0.025);
      if (level >= 3 && hot) {
        applyEnemyDamage(e, continuousDamage(4 + level * 0.8) * dt, "thermos", false);
        hitCount += 1;
      }
    }
  }
  if (hitCount > 0 && p.thermosTextTimer <= 0) {
    floatingText(p.x, p.y - radius * 0.45, `热茶 ${Math.round(p.thermosTea)}`, "#78e8c0");
    p.thermosTextTimer = 0.8;
  }
  if (Math.random() < 0.46) {
    game.particles.push({
      x: p.x + (Math.random() - 0.5) * radius * 0.72,
      y: p.y + (Math.random() - 0.5) * radius * 0.45,
      vx: (Math.random() - 0.5) * 22,
      vy: -22 - Math.random() * 18,
      r: 2 + Math.random() * 2,
      age: 0,
      life: 0.7,
      maxLife: 0.7,
      color: "rgba(120, 232, 192, 0.46)",
    });
  }
  if (level >= 6 && p.thermosTea >= 160 && p.thermosPuddleTimer <= 0) {
    game.damageZones.push({
      x: p.x + (Math.random() - 0.5) * 44,
      y: p.y + (Math.random() - 0.5) * 44,
      r: 42 + getClassBonus("fieldRadius") * 0.25,
      life: 2,
      maxLife: 2,
      damage: continuousDamage(8 + level * 1.2),
      source: "thermos",
      tick: 0.18,
      chainTick: Infinity,
      textTick: 0,
      color: "#78e8c0",
    });
    p.thermosTea = Math.max(0, p.thermosTea - 28);
    p.thermosPuddleTimer = 2.4;
  }
  if (level >= 7 && p.thermosTea >= p.thermosTeaMax) {
    p.hp = Math.min(p.maxHp, p.hp + p.thermosBurstHeal);
    for (const e of game.enemies) {
      e.slow = Math.min(e.slow || 1, 0.56);
      applyEnemyDamage(e, continuousDamage(18), "thermos", false);
    }
    pulse(p.x, p.y, Math.max(190, radius * 1.75), "#78e8c0");
    floatingText(p.x, p.y - 54, "茶爆", "#78e8c0");
    p.thermosTea = 0;
  }
}

function updateEnemies(dt) {
  const p = game.player;
  for (const e of game.enemies) {
    const dx = p.x - e.x;
    const dy = p.y - e.y;
    const dist = Math.hypot(dx, dy) || 1;
    e.phase += dt;
    let speed = e.speed * (e.slow || 1);
    const campPressure = game.stage >= 5 ? clamp(((p.anchorTime || 0) - 1.8) / 3, 0, 1) * (0.08 + game.stage * 0.008) : 0;
    if (campPressure > 0 && dist > 150) speed *= 1 + campPressure;
    let moveX = dx / dist;
    let moveY = dy / dist;

    // Bug surround: check if nearby friends should form swarm
    if (e.type === "bug" && dist < 250 && !e.swarmGroup && Math.random() < 0.0025) {
      const nearbyBugs = game.enemies.filter(function(o) {
        return o.type === "bug" && o.id !== e.id && !o.swarmGroup && Math.hypot(o.x - e.x, o.y - e.y) < 160;
      });
      if (nearbyBugs.length >= 2) {
        const allBugs = [e, ...nearbyBugs];
        const startAngle = Math.atan2(dy, dx) + Math.random();
        allBugs.forEach(function(b, i) {
          b.swarmGroup = e.id;
          b.swarmIndex = i;
          b.swarmAngle = startAngle;
        });
      }
    }

    if (e.swarmGroup !== undefined) {
      e.swarmAngle = (e.swarmAngle || 0) + 0.8 * dt;
      const offsetAngle = e.swarmAngle + (e.swarmIndex / 3) * TAU;
      const targetX = p.x + Math.cos(offsetAngle) * 58;
      const targetY = p.y + Math.sin(offsetAngle) * 58;
      const sx = targetX - e.x;
      const sy = targetY - e.y;
      const slen = Math.hypot(sx, sy) || 1;
      moveX = sx / slen;
      moveY = sy / slen;
      speed *= 1.04;
    }

    // Deadline charge warning indicator
    if (e.type === "deadline" && e.charging > 0.3 && e.charging - dt <= 0.3) {
      // Show charge line
      const lineLen = Math.min(280, dist) + 60;
      game.swingTrails.push({
        x: e.x, y: e.y,
        angle: Math.atan2(e.chargeY || 0, e.chargeX || 0),
        arc: 0.08,
        range: lineLen,
        life: 0.3,
        maxLife: 0.3,
        heavy: true,
        isCharge: true,
      });
      floatingText(e.x, e.y - 26, "!", "#ffb45c");
    }

    if (e.type === "emergency") {
      updateEmergencyMeeting(e, dt, p, dx, dy, dist);
      e.slow = 1;
      e.hitFlash = Math.max(0, (e.hitFlash || 0) - dt);
      if (Math.hypot(p.x - e.x, p.y - e.y) < p.r + e.r && p.invuln <= 0) {
        takeDamage(e.damage * (e.charging > 0 ? 1.05 : 0.72), enemyDamageLabel(e));
      }
      continue;
    }

    if (e.type === "change") {
      const wobble = Math.sin(e.phase * 5.6 + e.id) * 0.55;
      moveX = dx / dist + (-dy / dist) * wobble;
      moveY = dy / dist + (dx / dist) * wobble;
      const len = Math.hypot(moveX, moveY) || 1;
      moveX /= len;
      moveY /= len;
    }

    if (e.type === "intern") {
      const wobble = Math.sin(e.phase * 8.4 + e.id) * 0.95;
      moveX = dx / dist + (-dy / dist) * wobble;
      moveY = dy / dist + (dx / dist) * wobble;
      const len = Math.hypot(moveX, moveY) || 1;
      moveX /= len;
      moveY /= len;
      if (dist < 120) speed *= 1.28;
    }

    if (e.type === "deadline") {
      e.chargeTimer -= dt;
      if (e.chargeTimer <= 0) {
        e.charging = 0.72;
        e.chargeX = dx / dist;
        e.chargeY = dy / dist;
        e.chargeTimer = 3.1 + Math.random() * 1.2;
      }
      if (e.charging > 0) {
        speed *= 2.35;
        moveX = e.chargeX || moveX;
        moveY = e.chargeY || moveY;
        e.charging -= dt;
      }
    }

    if (e.type === "alarm") {
      e.specialTimer -= dt;
      if (e.specialTimer <= 0) {
        for (const other of game.enemies) {
          if (other.id !== e.id && Math.hypot(other.x - e.x, other.y - e.y) < 210) {
            other.slow = Math.max(other.slow || 1, 1.28);
            other.hitFlash = Math.max(other.hitFlash || 0, 0.08);
          }
        }
        floatingText(e.x, e.y - 28, "警报", "#ff5a7a");
        pulse(e.x, e.y, 120, "#ff5a7a");
        e.specialTimer = 3.4 + Math.random() * 1.4;
      }
    }

    if (e.type === "audit") {
      e.shield = 0.22 + Math.sin(e.phase * 2.2) * 0.12;
      if (dist < 150) p.slow = Math.min(p.slow, 0.86);
    }

    if (e.type === "manager" || e.type === "boss") {
      if (dist < (e.type === "boss" ? 210 : 142)) {
        p.slow = Math.min(p.slow, e.type === "boss" ? 0.76 : 0.82);
      }
      e.specialTimer -= dt;
      if (e.specialTimer <= 0) {
        const radius = e.type === "boss" ? 170 : 108;
        if (dist < radius && p.invuln <= 0) takeDamage(e.damage * (e.type === "boss" ? 0.42 : 0.28), enemyDamageLabel(e));
        // Manager buffs nearby enemies with speed boost
        if (e.type === "manager") {
          let buffed = 0;
          for (const other of game.enemies) {
            if (other.id !== e.id && Math.hypot(other.x - e.x, other.y - e.y) < radius + 40) {
              other.slow = Math.max(other.slow || 1, 1.35);
              other.hitFlash = Math.max(other.hitFlash || 0, 0.1);
              buffed += 1;
            }
          }
          if (buffed > 0) floatingText(e.x, e.y - 38, "加速 " + buffed, "#ffd15c");
        }
        pulse(e.x, e.y, radius, e.type === "boss" ? "#ff2a60" : "#ffd15c");
        e.specialTimer = e.type === "boss" ? 2.8 : 4.2;
      }
    }

    if (e.type === "meeting" && dist < 118) {
      p.slow = Math.min(p.slow, 0.74);
      if (dist < 86 && p.invuln <= 0) takeDamage(e.damage * 0.45, enemyDamageLabel(e));
      // Summon minions: when close to player, spawn smaller bugs
      e.spawnTimer = (e.spawnTimer || 2) - dt;
      if (e.spawnTimer <= 0 && game.enemies.length < game.stageConfig.maxConcurrent + 3) {
        e.spawnTimer = 4.5 - game.stage * 0.15;
        for (let j = 0; j < 2; j += 1) {
          const sa = Math.random() * TAU;
          const minion = createEnemyByType("bug", Math.max(1, game.stage - 1), game.stageConfig);
          minion.x = e.x + Math.cos(sa) * (e.r + 30);
          minion.y = e.y + Math.sin(sa) * (e.r + 30);
          minion.id = enemyId++;
          minion.r -= 3;
          minion.hp *= 0.55;
          minion.xp = Math.ceil(minion.xp * 0.4);
          minion.materialValue = 0;
          minion.color = "#b282ff";
          game.enemies.push(minion);
        }
        floatingText(e.x, e.y - 32, "+1", "#6ea8ff");
      }
    }

    e.x += moveX * speed * dt;
    e.y += moveY * speed * dt;
    e.slow = 1;
    e.hitFlash = Math.max(0, (e.hitFlash || 0) - dt);

    if (dist < p.r + e.r && p.invuln <= 0) {
      takeDamage(e.damage, enemyDamageLabel(e));
    }
  }

  for (let i = game.enemies.length - 1; i >= 0; i -= 1) {
    const e = game.enemies[i];
    if (e.hp <= 0) {
      // Precision T4: marker kills marked enemy → refract beam (dominant only)
      if (e.lastHitSource === "marker" && e.precisionMark > 0 && getRouteTier("precision") >= 4 && (game.routeEff?.precision || 0) > 0
          && game.weapons.marker.level > 0 && game.weapons.coffee.level >= 2) {
        let nearest = null; let best = Infinity;
        for (const t of game.enemies) {
          if (t === e) continue;
          const td = Math.hypot(t.x - e.x, t.y - e.y);
          if (td < best) { best = td; nearest = t; }
        }
        if (nearest && best < 500) {
          const ra = Math.atan2(nearest.y - e.y, nearest.x - e.x);
          const eff = game.routeEff.precision;
          fireBeam(ra, 500 + rangeBonus(0.6), game.weapons.marker.level + 4,
            hitDamage(((18 + game.weapons.marker.level * 5) * getWeaponStatScale("precise")) * eff),
            "#52ffe1", "marker");
          floatingText(e.x, e.y - 12, eff >= 1.25 ? "折射·强" : "折射", "#52ffe1");
        }
      }
      // Conductor T3: enemy dies on sticky trap → free chain (gated by effectiveness)
      if (getRouteTier("conductor") >= 3 && (game.routeEff?.conductor || 0) > 0 && game.weapons.calculator.level > 0) {
        for (const zone of game.damageZones) {
          if (zone.source === "sticky" && zone.life > 0 && Math.hypot(e.x - zone.x, e.y - zone.y) < zone.r + e.r) {
            chainLightning(e, 2 + Math.floor(game.weapons.calculator.level / 2),
              game.player.chainRange * 0.7 + rangeBonus(0.35),
              hitDamage(8 + game.weapons.calculator.level * 3.2), "calculator");
            break;
          }
        }
      }
      game.enemies.splice(i, 1);
      game.kills += 1;
      game.stageKills += 1;
      dropEnemyLoot(e);
      hitBurst(e.x, e.y, e.color, e.elite ? 18 : 8);
      // Office death particles
      for (let j = 0; j < (e.elite ? 8 : 4); j += 1) {
        game.particles.push({
          x: e.x,
          y: e.y,
          vx: (Math.random() - 0.5) * 160,
          vy: (Math.random() - 0.5) * 160 - 40,
          r: 2 + Math.random() * 2,
          age: 0,
          life: 0.4 + Math.random() * 0.4,
          maxLife: 0.8,
          color: ["#f4f0e8", "#c5d4df", "#f36f6f", "#ffd15c"][Math.floor(Math.random() * 4)],
        });
      }
    }
  }
}

function updateEmergencyMeeting(e, dt, p, dx, dy, dist) {
  e.specialTimer -= dt;
  if (!e.chargeDir || e.specialTimer <= 0) {
    const len = dist || 1;
    e.chargeDir = { x: dx / len, y: dy / len };
    e.charging = 1.35;
    e.specialTimer = 2.35 + Math.random() * 0.9;
    floatingText(e.x, e.y - e.r - 12, "紧急会议", "#ff5a7a");
  }
  if (e.charging > 0) {
    const speed = e.speed * 1.85 * (e.slow || 1);
    e.x += e.chargeDir.x * speed * dt;
    e.y += e.chargeDir.y * speed * dt;
    e.charging -= dt;
    if (e.x < 20 || e.x > WORLD.w - 20) {
      e.chargeDir.x *= -1;
      e.x = clamp(e.x, 20, WORLD.w - 20);
      pulse(e.x, e.y, 34, "#ff5a7a");
    }
    if (e.y < 20 || e.y > WORLD.h - 20) {
      e.chargeDir.y *= -1;
      e.y = clamp(e.y, 20, WORLD.h - 20);
      pulse(e.x, e.y, 34, "#ff5a7a");
    }
    if (Math.random() < 0.36) spark(e.x, e.y, "#ff5a7a");
  } else {
    e.x += (dx / (dist || 1)) * e.speed * 0.36 * dt;
    e.y += (dy / (dist || 1)) * e.speed * 0.36 * dt;
    if (e.specialTimer <= 0.46) {
      e.charging = 0.01;
    }
  }
}

function enemyDamageLabel(enemy) {
  const labels = {
    bug: "Bug 贴脸",
    change: "需求变更",
    meeting: "会议减速",
    deadline: "Deadline 冲刺",
    intern: "实习生绕行",
    alarm: "警报增援",
    audit: "审计压迫",
    manager: "经理光环",
    boss: "终局评审",
    emergency: "紧急会议",
  };
  if (enemy?.elite) return `精英${labels[enemy.type] || "压力源"}`;
  return labels[enemy?.type] || "压力源";
}

function takeDamage(rawDamage, source = "压力源") {
  const p = game.player;
  const ramp = game.stage <= 1 ? 0.72 : game.stage === 2 ? 0.84 : game.stage === 3 ? 0.92 : 1;
  const dodgeChance = clamp(p.dodge, 0, 60) / 100;
  // Barrage T3: surrounded bonus (scaled by effectiveness)
  const barrageEff = game.routeEff?.barrage || 0;
  const surroundCount = barrageEff > 0 && hasWeaponPair("keyboard", "stapler", 2) && getRouteTier("barrage") >= 3
    ? game.enemies.filter(en => Math.hypot(en.x - p.x, en.y - p.y) < 140).length : 0;
  const effectiveDodge = surroundCount >= 5 ? Math.min(0.65, dodgeChance + 0.15 * barrageEff) : dodgeChance;
  if (Math.random() < effectiveDodge) {
    p.invuln = 0.38 + p.invulnBonus;
    floatingText(p.x, p.y - 30, "闪避", "#8fffe7");
    pulse(p.x, p.y, 42, "#42d7b8");
    // Rubber stampede: dodge triggers damage to nearest enemy
    if (game.rubberStampedeActive && game.enemies.length > 0) {
      let nearest = null; let best = Infinity;
      for (const e of game.enemies) {
        const d = Math.hypot(e.x - p.x, e.y - p.y);
        if (d < best) { best = d; nearest = e; }
      }
      if (nearest && best < 250) {
        applyEnemyDamage(nearest, hitDamage(80), "synergy");
        floatingText(nearest.x, nearest.y - 10, "盖章!", "#ff8c42");
      }
    }
    return;
  }

  const reduction = 100 / (100 + Math.max(0, p.armor + getClassBonus("armor")) * 5.5);
  const anchorReduction = 1 - getAnchorDamageReduction();
  const damage = Math.max(1, Math.round(rawDamage * ramp * reduction));
  const finalDamage = Math.max(1, Math.round(damage * anchorReduction));
  p.hp -= finalDamage;
  game.hitsTaken += 1;
  game.damageTaken += finalDamage;
  game.lastDamageSource = source;
  game.damageBySource[source] = (game.damageBySource[source] || 0) + finalDamage;
  game.damageFlash = Math.min(1, game.damageFlash + 0.42);
  if (p.fortify > 0 || game.weapons.headset.level > 0 || game.weapons.report.level > 0) {
    p.anchorTime = Math.min(getAnchorMaxTime(), p.anchorTime + 0.48 + getEffectiveStat("fortify") * 0.014);
  }
  p.invuln = 0.64 + p.invulnBonus;
  hitBurst(p.x, p.y, "#ff6b6b", 10);
  floatingText(p.x, p.y - 30, `-${finalDamage}`, getAnchorCharge() > 0.65 ? "#ffd15c" : "#ff8585");
}

function applyEnemyDamage(enemy, amount, source = "generic", showWeakText = true) {
  let multiplier = 1;
  if (enemy.type === "deadline" && (source === "marker" || source === "coffee")) multiplier *= 1.35;
  if (enemy.type === "alarm" && source === "report") multiplier *= 1.55;
  if (enemy.type === "intern" && source === "sticky") multiplier *= 1.45;
  if (enemy.type === "audit" && (source === "calculator" || source === "report")) multiplier *= 1.38;
  if (enemy.type === "manager" && (source === "calculator" || source === "coffee")) multiplier *= 1.25;
  if (enemy.type === "boss" && (source === "marker" || source === "report" || source === "calculator")) multiplier *= 1.18;
  if (enemy.type === "emergency" && (source === "marker" || source === "sticky")) multiplier *= 1.22;
  if (enemy.swarmGroup !== undefined && (source === "headset" || source === "report" || source === "shredder" || source === "sticky")) multiplier *= 1.16;
  multiplier *= getEnemyLateDamageResistance(enemy, source);
  if (game.policyRemoteDamagePenalty && Math.hypot(enemy.x - game.player.x, enemy.y - game.player.y) > 200) multiplier *= 0.8;

  // Hidden reversal: post-update power surge
  if (game._updatePowerTimer > 0) multiplier *= 1.3;

  const shield = enemy.shield ? 1 - clamp(enemy.shield, 0, 0.45) : 1;
  const damage = amount * multiplier * shield;
  enemy.lastHitSource = source;
  enemy.hp -= damage;
  if (multiplier > 1.05 && showWeakText) {
    enemy.weakTextTimer = (enemy.weakTextTimer || 0) - 0.2;
    if (enemy.weakTextTimer <= 0) {
      floatingText(enemy.x, enemy.y - enemy.r - 10, "弱点", "#ffd15c");
      enemy.weakTextTimer = 0.7;
    }
  }
}

function getEnemyLateDamageResistance(enemy, source) {
  if (!game || !enemy) return 1;
  // Continuous DR scaling: enemies get progressively tougher
  const s = Math.max(0, game.stage - 2);
  const base = 1 / (1 + s * 0.07 + Math.max(0, game.stage - 7) * 0.05 + Math.max(0, game.stage - 11) * 0.05);
  const eliteMult = enemy.elite ? 0.88 : 1;
  return base * eliteMult;
}




function updateDamageZones(dt) {
  for (const zone of game.damageZones) {
    zone.life -= dt;
    zone.tick -= dt;
    zone.chainTick -= dt;
    zone.textTick -= dt;
    if (zone.tick <= 0) {
      let chainSeed = null;
      let hitCount = 0;
      for (const e of game.enemies) {
        const dist = Math.hypot(e.x - zone.x, e.y - zone.y);
        if (dist < e.r + zone.r) {
          applyEnemyDamage(e, zone.damage * 0.32, zone.source || "sticky", false);
          e.slow = Math.min(e.slow || 1, 0.78);
          e.hitFlash = 0.06;
          hitCount += 1;
          if (!chainSeed) chainSeed = e;
        }
      }
      if (hitCount > 0 && zone.textTick <= 0) {
        floatingText(zone.x, zone.y - Math.min(72, zone.r * 0.55), `陷阱 ${Math.round(zone.damage)}`, zone.color || "#fff07a");
        zone.textTick = 0.62;
      }
      if (chainSeed && zone.chainTick <= 0 && game.weapons.calculator.level > 0) {
        chainLightning(
          chainSeed,
          1 + Math.floor(game.weapons.calculator.level / 3) + Math.floor(getEngineeringUtility() / 18),
          game.player.chainRange * 0.78 + rangeBonus(0.45) + getEngineeringUtility() * 1.4,
          continuousDamage(8 + game.weapons.calculator.level * 2.4),
          "calculator",
        );
        zone.chainTick = 0.68;
      }
      zone.tick = 0.22;
    }
  }
  for (const zone of game.damageZones) {
    if (zone.life <= 0 && zone.source === "sticky" && getRouteTier("conductor") >= 3 && !zone.residual) {
      game.damageZones.push({
        x: zone.x,
        y: zone.y,
        r: zone.r * 0.62,
        life: 1.8,
        maxLife: 1.8,
        damage: zone.damage * 0.2,
        source: "sticky",
        tick: 0.38,
        chainTick: Infinity,
        textTick: 0,
        residual: true,
        color: "#52ffe1",
      });
      floatingText(zone.x, zone.y - 10, "残留", "#52ffe1");
    }
    if (zone.life <= 0 && zone.explodeOnEnd) {
      game.delayedBlasts.push({
        x: zone.x,
        y: zone.y,
        r: zone.r * 0.78,
        delay: 0,
        damage: zone.damage * 2.2,
        source: zone.source || "sticky",
        color: zone.color || "#fff07a",
        text: "便签爆",
      });
      zone.explodeOnEnd = false;
    }
  }
  game.damageZones = game.damageZones.filter((zone) => zone.life > 0);
}

function updateDelayedBlasts(dt) {
  for (const blast of game.delayedBlasts) {
    blast.delay -= dt;
    if (blast.delay > 0) continue;
    for (const e of game.enemies) {
      if (Math.hypot(e.x - blast.x, e.y - blast.y) < e.r + blast.r) {
        applyEnemyDamage(e, blast.damage, blast.source || "generic");
        e.hitFlash = Math.max(e.hitFlash || 0, 0.12);
      }
    }
    floatingText(blast.x, blast.y - blast.r * 0.35, blast.text || "爆裂", blast.color || "#ffd15c");
    pulse(blast.x, blast.y, blast.r, blast.color || "#ffd15c");
    blast.done = true;
  }
  game.delayedBlasts = game.delayedBlasts.filter((blast) => !blast.done);
}


function updateProjectiles(dt) {
  for (const pr of game.projectiles) {
    pr.x += pr.vx * dt;
    pr.y += pr.vy * dt;
    pr.life -= dt;
    if (pr.x < 0 || pr.x > WORLD.w) {
      pr.vx *= -1;
      pr.pierce -= 0.5;
    }
    if (pr.y < 0 || pr.y > WORLD.h) {
      pr.vy *= -1;
      pr.pierce -= 0.5;
    }

    for (const e of game.enemies) {
      if (pr.pierce <= 0) break;
      if (pr.hitIds.has(e.id)) continue;
      if (Math.hypot(e.x - pr.x, e.y - pr.y) < e.r + pr.r) {
        pr.hitIds.add(e.id);
        const barrageBonus = (pr.source === "stapler" && e.kbTag > 0 && getRouteTier("barrage") >= 4) ? 1 + 0.35 * (game.routeEff?.barrage || 0) : 1;
        applyEnemyDamage(e, pr.damage * barrageBonus, pr.source || "projectile");
        e.hitFlash = 0.08;
        if (pr.source === "keyboard" && getRouteTier("barrage") >= 3 && Math.random() < 0.16) {
          const fragAngle = Math.atan2(pr.vy, pr.vx);
          for (let f = -1; f <= 1; f += 2) {
            spawnProjectile({
              x: pr.x,
              y: pr.y,
              vx: Math.cos(fragAngle + f * 0.46) * 285,
              vy: Math.sin(fragAngle + f * 0.46) * 285,
              r: 2.5,
              life: 0.36,
              damage: pr.damage * 0.42,
              color: "#c35cff",
              pierce: 1,
              source: "keyboardShard",
            });
          }
        }
        pr.pierce -= 1;
        spark(pr.x, pr.y, pr.color);
      }
    }
  }
  game.projectiles = game.projectiles.filter((pr) => pr.life > 0 && pr.pierce > 0);
}

function updatePickups(dt) {
  const p = game.player;
  // WFH: auto-collect all pickups when standing still
  if (game.wfhActive && (Math.abs(p.vx || 0) + Math.abs(p.vy || 0)) < 5) {
    for (const pickup of game.pickups) {
      collectPickup(pickup);
      pickup.collected = true;
    }
  }
  for (const pickup of game.pickups) {
    const dx = p.x - pickup.x;
    const dy = p.y - pickup.y;
    const dist = Math.hypot(dx, dy) || 1;
    const pickupRange = p.pickupRange + getClassBonus("pickupRange");
    if (dist < pickupRange) {
      const pull = 360 * (game.policyMagnetMult || 1) * dt * (1 - dist / (pickupRange + 20));
      pickup.x += (dx / dist) * pull;
      pickup.y += (dy / dist) * pull;
    }
    if (dist < p.r + pickup.r + 5) {
      collectPickup(pickup);
      pickup.collected = true;
    }
  }
  game.pickups = game.pickups.filter((pickup) => !pickup.collected);
}

function collectPickup(pickup) {
  if (pickup.kind === "heal") {
    const before = game.player.hp;
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + pickup.value);
    const healed = Math.round(game.player.hp - before);
    if (healed > 0) floatingText(game.player.x, game.player.y - 34, `+${healed}`, "#8fffa8");
    return;
  }

  if (pickup.kind === "material") {
    game.materials += pickup.value;
    floatingText(game.player.x, game.player.y - 34, `材料+${pickup.value}`, "#f4c95d");
    // Fengshui heal: wireless fengshui synergy
    if (game.fengShuiHeal && Math.random() < 0.2) {
      game.player.hp = Math.min(game.player.maxHp, game.player.hp + 2);
    }
    return;
  }

  if (pickup.kind === "stat") {
    pickup.stat.apply(game);
    floatingText(game.player.x, game.player.y - 34, `${pickup.stat.label}+${pickup.stat.amount}`, "#f4c95d");
    return;
  }

  if (pickup.kind === "item") {
    addPassiveItem(pickup.item, "drop");
    return;
  }

  gainXp(pickup.value);
}

function updateParticles(dt) {
  for (const part of game.particles) {
    part.x += part.vx * dt;
    part.y += part.vy * dt;
    part.life -= dt;
    part.age += dt;
  }
  game.particles = game.particles.filter((part) => part.life > 0);
}

function updateFloatingTexts(dt) {
  for (const text of game.floatingTexts) {
    text.y -= 34 * dt;
    text.life -= dt;
  }
  game.floatingTexts = game.floatingTexts.filter((text) => text.life > 0);
}












function openUpgrade(returnState = "playing") {
  state = "upgrade";
  ui.stageBanner?.classList.add("hidden");
  game.upgradeReturnState = returnState;
  game.upgradeRerolls = 1;
  game.currentUpgradeChoices = pickUpgrades(Math.min(4, game.upgradeSlotPenalty ? 3 : (4 + (game.upgradeChoiceBonus || 0))));
  game.upgradeSlotPenalty = false;
  game.upgradeChoiceBonus = 0;
  renderUpgradeChoices();
  ui.upgradePanel.classList.remove("hidden");
  ui.upgradeRerollButton?.classList.toggle("hidden", false);
}

function renderUpgradeChoices() {
  ui.upgradeChoices.replaceChildren();
  const dominantId = getDominantRouteId();
  for (const choice of game.currentUpgradeChoices) {
    const routeHint = getUpgradeRouteHint(choice);
    const isSubsidy = choice.subsidy === true;
    const button = document.createElement("button");
    button.className = `choice ${isSubsidy ? 'subsidy-choice' : ''}`;
    button.innerHTML = `
      <div class="card-head">
        <span class="offer-icon ${getEntryIconClass(choice)}"></span>
        ${isSubsidy ? '<span class="subsidy-badge">急招补贴</span>' : ''}
        <span class="tag">${choice.tag}</span>
        ${routeHint ? `<span class="tag route-tag">${routeHint}</span>` : ''}
      </div>
      <strong class="card-title">${choice.title}</strong>
      <span class="card-desc">${choice.text}</span>
      ${choice.risk ? `<span class="dark-affix">⚠ ${choice.risk}</span>` : ''}
    `;
    button.addEventListener("click", () => chooseUpgrade(choice));
    ui.upgradeChoices.append(button);
  }
  if (ui.upgradeRerollCount) ui.upgradeRerollCount.textContent = game.upgradeRerolls;
  if (ui.upgradeRerollButton) ui.upgradeRerollButton.disabled = game.upgradeRerolls <= 0;
}

function chooseUpgrade(choice) {
  choice.apply(game);
  if (choice.subsidy) game.subsidyUsed = true;
  game.upgradesTaken += 1;
  checkWeaponEvolutions();
  checkRouteTierUps();
  ui.upgradePanel.classList.add("hidden");
  game.currentUpgradeChoices = [];
  game.upgradeRerolls = 0;
  markBuildHint();
  if (game.upgradeReturnState === "armory") {
    if (game.pendingLevelUps > 0) {
      game.pendingLevelUps -= 1;
      openUpgrade("armory");
    } else {
      openWeaponArmory();
    }
  } else {
    state = "playing";
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }
}

function rerollUpgradeChoices() {
  if (state !== "upgrade" || game.upgradeRerolls <= 0) return;
  game.upgradeRerolls -= 1;
  game.currentUpgradeChoices = pickUpgrades(4);
  renderUpgradeChoices();
}

function pickUpgrades(count) {
  const available = statUpgradePool.filter((upgrade) => upgrade.available(game));
  const choices = [];
  if (game.stage === 1 && game.upgradesTaken === 0) {
    const starterSurvival = ["padding", "regen", "dodge", "sprint"]
      .map((id) => available.find((upgrade) => upgrade.id === id))
      .filter(Boolean);
    shuffle(starterSurvival);
    if (starterSurvival[0]) choices.push(starterSurvival[0]);
  }
  const aligned = available.filter(isUpgradeAlignedWithBuild);
  if (aligned.length) {
    shuffle(aligned);
    if (!choices.includes(aligned[0])) choices.push(aligned[0]);
  }
  const weighted = [];
  for (const upgrade of available) {
    if (choices.includes(upgrade)) continue;
    weighted.push(upgrade);
    if (isUpgradeAlignedWithBuild(upgrade)) weighted.push(upgrade, upgrade);
  }
  shuffle(weighted);
  for (const upgrade of weighted) {
    if (choices.length >= count) break;
    if (!choices.includes(upgrade)) choices.push(upgrade);
  }
  // Low-HP subsidy: may inject a boosted option
  const subsidy = getSubsidyOption();
  if (subsidy && choices.length >= count) {
    // Replace the least aligned choice
    let worstIdx = 0;
    let worstScore = Infinity;
    for (let i = 0; i < choices.length; i += 1) {
      const score = isUpgradeAlignedWithBuild(choices[i]) ? 10 : 0;
      if (score < worstScore) { worstScore = score; worstIdx = i; }
    }
    choices[worstIdx] = subsidy;
  }
  return choices;
}


function openWeaponArmory() {
  ui.stageBanner?.classList.add("hidden");
  state = "armory";
  if (game.shopOffers.length === 0) {
    game.shopOffers = generateShopOffers(getShopOfferCount(), game.lockedShopOffers);
    game.lockedShopOffers = [];
  }
  renderShop();
  ui.armoryReason.textContent =
    `${game.lastClearReason === "clear" ? "清场过关" : "撑过时间"} · 击破 ${game.stageKills}/${game.stageConfig.totalEnemies} · 奖励 ${game.lastStageBonus}`;
  ui.weaponPanel.classList.remove("hidden");
  updateHud();
}

function renderShop() {
  ui.armoryMaterial.textContent = game.materials;
  ui.refreshCost.textContent = getRefreshCost();
  ui.weaponChoices.replaceChildren();
  renderArmoryBuildStrip();
  renderOfferPreview(null);
  for (let i = 0; i < game.shopOffers.length; i += 1) {
    const offer = game.shopOffers[i];
    const card = document.createElement("div");
    card.className = `choice shop-card ${offer.entry.shopType === "item" ? getRarityClass(offer.entry) : ""} ${offer.purchased ? "disabled-choice" : ""} ${offer.locked ? "locked-card" : ""}`;
    card.tabIndex = offer.purchased ? -1 : 0;

    const head = document.createElement("div");
    head.className = "card-head";

    const icon = document.createElement("span");
    icon.className = `offer-icon ${getEntryIconClass(offer.entry)}`;

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = formatEntryTag(offer.entry);
    head.append(icon, tag);

    const title = document.createElement("strong");
    title.className = "card-title";
    title.textContent = offer.entry.title;

    const text = document.createElement("span");
    text.className = "card-desc";
    text.textContent = offer.entry.text;

    const compare = document.createElement("span");
    compare.className = "compare-line";
    compare.textContent = getOfferComparisonText(offer.entry);

    const cost = document.createElement("span");
    cost.className = "cost";
    cost.textContent = offer.purchased ? "已购买" : `材料 ${offer.cost}${offer.locked ? " · 保留到下次工坊" : ""}`;

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const buy = document.createElement("button");
    buy.className = "mini-button";
    buy.textContent = offer.purchased ? "已购" : "购买";
    buy.disabled = !canBuyShopOffer(offer);
    buy.addEventListener("click", () => buyShopOffer(i));

    const lock = document.createElement("button");
    lock.className = `mini-button ${offer.locked ? "locked" : ""}`;
    lock.textContent = offer.locked ? "保留" : "锁定";
    lock.disabled = offer.purchased;
    lock.addEventListener("click", () => toggleOfferLock(i));

    actions.append(buy, lock);
    card.addEventListener("mouseenter", () => renderOfferPreview(offer.entry));
    card.addEventListener("focusin", () => renderOfferPreview(offer.entry));
    card.addEventListener("mouseleave", () => renderOfferPreview(null));
    card.addEventListener("focusout", () => renderOfferPreview(null));
    card.append(head, title, text, compare, cost, actions);
    ui.weaponChoices.append(card);
  }

  const refreshCost = getRefreshCost();
  ui.refreshButton.disabled = game.materials < refreshCost;
  ui.material.textContent = game.materials;
}


function renderArmoryBuildStrip() {
  if (!ui.armoryBuildStrip) return;
  const counts = getWeaponClassCounts();
  const activeClasses = Object.entries(counts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([className, count]) => {
      const nextTier = (weaponClassBonuses[className] || []).find((tier) => getClassTierThreshold(tier) > count);
      const nextText = nextTier ? ` · 差 ${getClassTierThreshold(nextTier) - count} 件进阶` : "";
      return `<span class="armory-class-chip"><b>${weaponClassLabels[className] || className} x${count}</b>${nextText}</span>`;
    });
  const chips = buildOrder.filter((id) => game.weapons[id].level > 0).map((id) => {
    const weapon = game.weapons[id];
    const classes = (weapon.classes || []).map((className) => weaponClassLabels[className] || className).join("/");
    return `
      <div class="armory-weapon-chip owned" title="${weapon.label} Lv.${weapon.level}/${weapon.max} · ${classes}">
        <span class="offer-icon small ${getWeaponIconClass(id)}"></span>
        <span><strong>${weapon.label}</strong><em>Lv.${weapon.level}/${weapon.max}</em></span>
      </div>
    `;
  }).join("");
  const classText = activeClasses.length ? activeClasses.slice(0, 3).join("") : `<span class="armory-class-chip">武器槽 ${getOwnedWeaponCount()}/${game.weaponSlots}</span>`;
  ui.armoryBuildStrip.innerHTML = `
    <div class="armory-class-line">${classText}</div>
    <div class="armory-weapon-grid">${chips || `<span class="armory-empty">暂无武器</span>`}</div>
  `;
  renderRouteMap(ui.armoryRouteMap, { compact: false });
}

function renderOfferPreview(entry) {
  if (!ui.offerPreview) return;
  if (!entry) {
    ui.offerPreview.classList.add("hidden");
    ui.offerPreview.classList.remove("active");
    ui.offerPreview.innerHTML = "";
    return;
  }
  ui.offerPreview.classList.remove("hidden");
  ui.offerPreview.classList.add("active");
  const weaponId = getUpgradeWeaponId(entry.id);
  if (!weaponId) {
    ui.offerPreview.innerHTML = `
      <strong>${entry.title} · ${getEntryRouteHint(entry)}</strong>
      <span>${entry.tag || "属性道具"} · ${entry.text}</span>
      <em>${getItemBuildHint(entry)}</em>
    `;
    return;
  }
  const weapon = game.weapons[weaponId];
  const classes = (weapon.classes || []).map((className) => weaponClassLabels[className] || className).join(" / ");
  ui.offerPreview.innerHTML = `
    <strong>${getEntryRouteHint(entry)} · ${weapon.label} Lv.${weapon.level}/${weapon.max} -> Lv.${Math.min(weapon.max, weapon.level + 1)}</strong>
    <span>${classes} · ${entry.text}</span>
    <em>${getWeaponEffectSummary(weaponId)}</em>
  `;
}

function getOfferComparisonText(entry) {
  const weaponId = getUpgradeWeaponId(entry.id);
  const routeHint = getEntryRouteHint(entry);
  if (!weaponId) return `${routeHint} · ${getItemBuildHint(entry)}`;
  const weapon = game.weapons[weaponId];
  if (weapon.level <= 0) {
    if (getOwnedWeaponCount() >= game.weaponSlots) return `武器槽已满 · 可先拆解已有武器`;
    return `${routeHint} · 新武器槽 ${getOwnedWeaponCount() + 1}/${game.weaponSlots} · ${weapon.archetype}`;
  }
  return `${routeHint} · 当前 Lv.${weapon.level}/${weapon.max} · ${getWeaponEffectSummary(weaponId)}`;
}

function getEntryRouteHint(entry) {
  const weaponId = getUpgradeWeaponId(entry.id);
  if (weaponId) {
    const routes = {
      coffee: "精准贯穿路线",
      marker: "精准贯穿路线",
      keyboard: "键盘风暴路线",
      stapler: "键盘风暴路线",
      headset: "会议结界路线",
      report: "会议结界路线",
      sticky: "工位雷网路线",
      calculator: "工位雷网路线",
      shredder: "近距工程插件",
      thermos: "站场支援插件",
    };
    const routeId = {coffee:"precision",marker:"precision",keyboard:"barrage",stapler:"barrage",headset:"perimeter",report:"perimeter",sticky:"conductor",calculator:"conductor"}[weaponId];
    const dominantId = getDominantRouteId();
    const eff = getRouteEffectiveness(routeId);
    const isDominant = routeId && routeId === dominantId;
    const effBadge = routeId && eff > 0 ? (eff >= 1.25 ? '【主路线 125%】' : isDominant ? '【主路线】' : '【副路线 50%】') : '';
    const recommendation = {
      marker: "适合远程穿透和暴击",
      keyboard: "适合高攻速弹幕",
      headset: "适合防守站场",
      sticky: "适合陷阱控场",
      shredder: "适合近身防御和材料回收",
      thermos: "适合站场续航和减速控场",
    };
    const suffix = game.stage === 1 && game.weapons[weaponId].level <= 0 && recommendation[weaponId]
      ? ` · ${recommendation[weaponId]}`
      : "";
    return `${effBadge}${routes[weaponId] || game.weapons[weaponId].archetype}${suffix}`;
  }
  return (entry.tag || "道具").replace("道具 / ", "").replace("属性 / ", "");
}

function getUpgradeRouteHint(choice) {
  if (!game || !choice) return "";
  const dominantId = getDominantRouteId();
  const dominantRoute = dominantId ? routeDefinitions.find(r => r.id === dominantId) : null;
  // Check if this upgrade boosts stats that align with the dominant route
  if (dominantRoute && choice.apply) {
    // Heuristic: check the stat key mentioned in the upgrade
    const text = (choice.text || "").toLowerCase();
    const routeStats = dominantRoute.stats || [];
    const statNames = { crit: "暴击", range: "射程", attackSpeed: "攻速", dodge: "闪避", luck: "幸运", pickupRange: "拾取", armor: "护甲", regen: "恢复", fortify: "站场" };
    for (const stat of routeStats) {
      if (text.includes(statNames[stat] || stat)) {
        return `${dominantRoute.name}`;
      }
    }
    // If upgrade applies to defensive stats and route is perimeter
    if (dominantId === "perimeter" && /护甲|恢复|站场|防御/.test(text)) return dominantRoute.name;
    if (dominantId === "barrage" && /闪避|攻速|暴击/.test(text)) return dominantRoute.name;
    if (dominantId === "precision" && /暴击|射程|输出|伤害/.test(text)) return dominantRoute.name;
    if (dominantId === "conductor" && /幸运|拾取|经济/.test(text)) return dominantRoute.name;
  }
  return "";
}

function getWeaponEffectSummary(weaponId) {
  const weapon = game.weapons[weaponId];
  const precise = getWeaponStatScale("precise");
  const barrage = getWeaponStatScale("barrage");
  const engineering = getWeaponStatScale("engineering");
  const field = getWeaponStatScale("field");
  const data = {
    coffee: `高频穿透射线，射程/暴击收益 ${Math.round(precise * 100)}%`,
    marker: `周期穿透直线，精准体系收益 ${Math.round(precise * 100)}%`,
    keyboard: `弹幕数量随等级成长，攻速/闪避收益 ${Math.round(barrage * 100)}%`,
    stapler: `近距扇形爆发，弹幕体系收益 ${Math.round(barrage * 100)}%`,
    headset: `环形领域控场，护甲/恢复收益 ${Math.round(field * 100)}%`,
    report: `持续领域压制，生存体系收益 ${Math.round(field * 100)}%`,
    sticky: `陷阱留场，幸运/拾取收益 ${Math.round(engineering * 100)}%`,
    calculator: `连锁点杀，工程体系收益 ${Math.round(engineering * 100)}%`,
    shredder: `近距旋转清场，工程/站场收益 ${Math.round(engineering * 100)}%`,
    thermos: `茶温蒸汽治疗，领域/站场收益 ${Math.round(field * 100)}%`,
  };
  return weapon.level <= 0 ? `${weapon.archetype}，买入后解锁该武器。` : data[weaponId];
}

function getItemBuildHint(entry) {
  const tag = entry.tag || "";
  if (/暴击|输出|射程/.test(tag)) return "偏精准/远程，适合马克笔和咖啡射线。";
  if (/攻速|闪避|爆发/.test(tag)) return "偏弹幕/近距，适合键盘和订书机。";
  if (/经济|拾取|恢复|工程|布线|翻译/.test(tag)) return "偏工程/支援，适合计算器、便签和长线发育。";
  if (/酒|爆发/.test(tag)) return "偏高风险爆发，适合咖啡、订书机和想快速清场的打法。";
  if (/防御|生存|控制|站场|站桩|领域/.test(tag)) return "偏领域/生存，适合耳机和报告领域。";
  return "通用补强，但会挤压武器升级节奏。";
}

function checkItemSynergies(item) {
  if (!game || !game.boughtItems) return;
  const ids = new Set(Array.from(game.boughtItems).concat([item.id]));

  // Synergy: 红笔批注 + 激光翻页笔 → 精准共鸣
  if (ids.has("redPen") && ids.has("laserPointer") && !game.synergyTriggers?.has("precisionResonance")) {
    game.synergyTriggers = game.synergyTriggers || new Set();
    game.synergyTriggers.add("precisionResonance");
    game.precisionResonanceActive = true;
    showFusionNotice("协同", "精准共鸣", "暴击时附带25%射程的额外激光");
    floatingText(game.player.x, game.player.y - 60, "✦ 精准共鸣", "#b282ff");
  }

  // Synergy: 降噪堡垒 + 桌面小风扇 → 守夜人
  if (ids.has("noiseFort") && ids.has("deskFan") && !game.synergyTriggers?.has("nightWatch")) {
    game.synergyTriggers = game.synergyTriggers || new Set();
    game.synergyTriggers.add("nightWatch");
    game.nightWatchActive = true;
    showFusionNotice("协同", "守夜人", "领域内敌人每秒受到护甲值5%真实伤害");
    floatingText(game.player.x, game.player.y - 60, "✦ 守夜人", "#42d7b8");
  }

  // Synergy: 便当 + 保温杯 → 下午茶
  if (ids.has("lunchbox") && ids.has("thermosUpgrade") && !game.synergyTriggers?.has("afternoonTea")) {
    game.synergyTriggers = game.synergyTriggers || new Set();
    game.synergyTriggers.add("afternoonTea");
    game.player.regen += 2;
    game.player.maxHp += 15;
    showFusionNotice("协同", "下午茶", "恢复+2，最大生命+15");
    floatingText(game.player.x, game.player.y - 60, "✦ 下午茶", "#78e8c0");
  }
}

function getItemRarity(item) {
  return item?.rarity || "common";
}

function getItemRarityLabel(item) {
  return itemRarityMeta[getItemRarity(item)]?.label || "普通";
}

function getItemRecycleValue(item) {
  return itemRarityMeta[getItemRarity(item)]?.recycle || 4;
}

function shouldPromptItemReplace(item) {
  return ["epic", "legendary"].includes(getItemRarity(item));
}

function getRarityClass(item) {
  return `rarity-${getItemRarity(item)}`;
}

function getRarityWeight(item) {
  return itemRarityMeta[getItemRarity(item)]?.weight || 1;
}

function generateShopOffers(count, existing = []) {
  if (game.stage === 1 && getOwnedWeaponCount() === 1 && existing.length === 0) {
    return shuffle(["marker", "keyboard", "headset", "sticky", "shredder", "thermos"])
      .map((id) => weaponUpgradePool.find((entry) => entry.id === id))
      .filter(Boolean)
      .map((entry) => {
        const shopEntry = { ...entry, shopType: "weapon" };
        return {
          entry: shopEntry,
          cost: Math.max(10, getShopOfferCost(shopEntry) - 6),
          locked: false,
          purchased: false,
        };
      })
      .slice(0, count);
  }
  const offers = [...existing];
  while (offers.length < count) {
    const weaponCount = offers.filter((offer) => offer.entry.shopType === "weapon").length;
    const entry = pickShopEntry(offers, weaponCount < 2 ? "weapon" : "mixed");
    if (!entry) break;
    offers.push({
      entry,
      cost: getShopOfferCost(entry),
      locked: false,
      purchased: false,
    });
  }
  return offers;
}

function pickShopEntry(existingOffers, preference = "mixed") {
  const existingIds = new Set(existingOffers.map((offer) => offer.entry.id));
  const available = weaponUpgradePool.filter((upgrade) => isWeaponShopUpgradeAvailable(upgrade));
  const itemAvailable = itemPool.filter((item) => !game.boughtItems.has(item.id));
  const weaponPool = available.map((entry) => ({ ...entry, shopType: "weapon" })).filter((entry) => !existingIds.has(entry.id));
  const itemShopPool = itemAvailable.map((entry) => ({ ...entry, shopType: "item" })).filter((entry) => !existingIds.has(entry.id));
  const focusedWeapons = weightedWeaponShopPool(weaponPool);
  const pool = preference === "weapon" && focusedWeapons.length > 0
    ? focusedWeapons
    : [
      ...focusedWeapons,
      ...itemShopPool,
      ...itemShopPool.filter((entry) => isItemAlignedWithBuild(entry)),
    ];
  if (pool.length === 0) return null;
  shuffle(pool);
  return pool[0];
}

function weightedWeaponShopPool(weaponPool) {
  const ownedWeapons = buildOrder.filter((id) => game.weapons[id].level > 0);
  const ownedClasses = new Set(ownedWeapons.flatMap((id) => game.weapons[id].classes || []));
  const topClass = getTopWeaponClass();
  const weighted = [];
  for (const entry of weaponPool) {
    const weaponId = getUpgradeWeaponId(entry.id);
    const classes = weaponId ? game.weapons[weaponId].classes || [] : [];
    weighted.push(entry);
    if (weaponId && game.weapons[weaponId].level > 0) weighted.push(entry, entry);
    if (classes.some((className) => ownedClasses.has(className))) weighted.push(entry, entry);
    if (topClass && classes.includes(topClass)) weighted.push(entry, entry);
  }
  return weighted;
}



function isWeaponShopUpgradeAvailable(upgrade) {
  if (!upgrade.available(game)) return false;
  const weaponId = getUpgradeWeaponId(upgrade.id);
  if (!weaponId) return true;
  if (game.weapons[weaponId].level > 0) return true;
  return true;
}



function buyShopOffer(index) {
  const offer = game.shopOffers[index];
  if (!offer || !canBuyShopOffer(offer)) return;
  game.materials -= offer.cost;
  if (offer.entry.shopType === "item") {
    addPassiveItem(offer.entry, "shop");
  } else {
    offer.entry.apply(game);
    game.weaponUpgradeCounts[offer.entry.id] = (game.weaponUpgradeCounts[offer.entry.id] || 0) + 1;
    // Hidden reversal: NDA → overtime pay refund
    if (game._ndaSigned && game.weaponCostDouble) {
      const refund = 4;
      game.materials += refund;
      floatingText(game.player.x, game.player.y - 70, "加班费到账了！+" + refund, "#ffd15c");
      game._ndaSigned = false;
    }
    syncWeaponDerivedStats();
    applyWeaponUpgradeModifiers();
    maybeShowFusionHint(getUpgradeWeaponId(offer.entry.id));
    checkWeaponEvolutions();
    checkRouteTierUps();
    markBuildHint();
  }
  offer.purchased = true;
  offer.locked = false;
  updateBuildHud();
  updateStatHud();
  updateItemHud();
  renderShop();
}

function snapshotPlayerNumbers() {
  const values = {};
  if (!game?.player) return values;
  for (const [key, value] of Object.entries(game.player)) {
    if (Number.isFinite(value)) values[key] = value;
  }
  return values;
}

function diffPlayerNumbers(before, after) {
  const delta = {};
  for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
    const change = (after[key] ?? 0) - (before[key] ?? 0);
    if (Math.abs(change) > 0.0001) delta[key] = change;
  }
  return delta;
}

function removePassiveItem(index) {
  const record = game?.boughtItemRecords?.[index];
  if (!record) return false;
  for (const [key, change] of Object.entries(record.delta || {})) {
    if (Number.isFinite(game.player[key])) game.player[key] -= change;
  }
  game.player.maxHp = Math.max(1, game.player.maxHp);
  game.player.hp = clamp(game.player.hp, 1, game.player.maxHp);
  game.boughtItems.delete(record.id);
  game.boughtItemNames.splice(index, 1);
  game.boughtItemTags.splice(index, 1);
  game.boughtItemRecords.splice(index, 1);
  return true;
}

function resumeAfterItemReplace() {
  if (!game) return;
  state = game.itemReplaceReturnState || "playing";
  game.pendingItemChoice = null;
  ui.itemReplacePanel?.classList.add("hidden");
  ui.fusionNotice?.classList.add("hidden");
  updateBuildHud();
  updateStatHud();
  updateItemHud();
  lastTime = performance.now();
  if (state === "playing" || state === "recovery") requestAnimationFrame(loop);
}

function openItemReplace(item) {
  if (!item || !game) return;
  game.pendingItemChoice = item;
  game.itemReplaceReturnState = state === "recovery" ? "recovery" : "playing";
  state = "itemReplace";
  ui.stageBanner?.classList.add("hidden");
  ui.fusionNotice?.classList.add("hidden");
  ui.itemReplacePanel?.classList.remove("hidden");
  renderItemReplacePanel();
}

function renderItemReplacePanel() {
  if (!game?.pendingItemChoice || !ui.itemReplacePanel) return;
  const item = game.pendingItemChoice;
  if (ui.itemConvertButton) ui.itemConvertButton.textContent = `回收为材料 +${getItemRecycleValue(item)}`;
  if (ui.itemReplaceCount) ui.itemReplaceCount.textContent = `${game.boughtItemNames.length}/${game.itemSlots}`;
  if (ui.itemReplaceNew) {
    ui.itemReplaceNew.replaceChildren();
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = `${getItemRarityLabel(item)} · ${item.tag || "道具"}`;
    const title = document.createElement("strong");
    title.textContent = item.title;
    const text = document.createElement("p");
    text.textContent = item.text;
    ui.itemReplaceNew.append(tag, title, text);
  }
  if (ui.itemReplaceList) {
    ui.itemReplaceList.replaceChildren(...game.boughtItemRecords.map((record, index) => {
      const card = document.createElement("div");
      card.className = `replace-item-card ${record.rarity ? `rarity-${record.rarity}` : ""}`;
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = `${itemRarityMeta[record.rarity]?.label || "普通"} · ${record.tag || "道具"}`;
      const title = document.createElement("strong");
      title.textContent = record.title;
      const text = document.createElement("p");
      text.textContent = record.text || "";
      const button = document.createElement("button");
      button.className = "mini-button";
      button.type = "button";
      button.textContent = "替换";
      button.addEventListener("click", () => replacePassiveItem(index));
      card.append(tag, title, text, button);
      return card;
    }));
  }
}

function replacePassiveItem(index) {
  const item = game?.pendingItemChoice;
  if (!item || !removePassiveItem(index)) return;
  addPassiveItem(item, "replace");
  floatingText(game.player.x, game.player.y - 46, `替换为 ${item.title}`, "#52ffe1");
  resumeAfterItemReplace();
}

function convertPendingItemToMaterial() {
  if (!game?.pendingItemChoice) return;
  const refund = getItemRecycleValue(game.pendingItemChoice);
  game.materials += refund;
  floatingText(game.player.x, game.player.y - 42, `道具回收 材料+${refund}`, "#ffd15c");
  resumeAfterItemReplace();
}

function keepCurrentPassiveItems() {
  if (!game?.pendingItemChoice) return;
  floatingText(game.player.x, game.player.y - 42, "保留现有道具", "#ffd15c");
  resumeAfterItemReplace();
}

function addPassiveItem(item, source = "shop") {
  if (!item || game.boughtItems.has(item.id)) return false;
  if (game.boughtItems.size >= game.itemSlots) {
    if (source === "drop" && shouldPromptItemReplace(item)) {
      openItemReplace(item);
    } else if (source === "drop") {
      const refund = getItemRecycleValue(item);
      game.materials += refund;
      floatingText(game.player.x, game.player.y - 42, `${getItemRarityLabel(item)}道具回收 材料+${refund}`, "#ffd15c");
    }
    else floatingText(game.player.x, game.player.y - 42, "道具槽满", "#ffd15c");
    return false;
  }
  const before = snapshotPlayerNumbers();
  item.apply(game);
  const delta = diffPlayerNumbers(before, snapshotPlayerNumbers());
  game.boughtItems.add(item.id);
  game.boughtItemNames.push(item.title);
  game.boughtItemTags.push(item.tag || "");
  game.boughtItemRecords.push({
    id: item.id,
    title: item.title,
    tag: item.tag || "",
    rarity: getItemRarity(item),
    text: item.text,
    delta,
  });
  if (source !== "replace") floatingText(game.player.x, game.player.y - 46, `获得 ${item.title}`, "#52ffe1");
  if (source !== "replace") showFusionNotice("新道具", item.title, item.text);
  checkItemSynergies(item);
  applyDarkAffix(item.id, game);
  checkHiddenSynergies();
  checkWeaponEvolutions();
  checkRouteTierUps();
  updateBuildHud();
  updateStatHud();
  updateItemHud();
  return true;
}

function canBuyShopOffer(offer) {
  if (!offer || offer.purchased || game.materials < offer.cost) return false;
  if (offer.entry.shopType === "item") return game.boughtItems.size < game.itemSlots;
  if (offer.entry.shopType !== "weapon") return true;
  const weaponId = getUpgradeWeaponId(offer.entry.id);
  if (!weaponId) return true;
  if (game.weapons[weaponId].level > 0) return true;
  return getOwnedWeaponCount() < game.weaponSlots;
}

function toggleOfferLock(index) {
  const offer = game.shopOffers[index];
  if (!offer || offer.purchased) return;
  offer.locked = !offer.locked;
  renderShop();
}

function sellWeapon(weaponId) {
  const weapon = game.weapons[weaponId];
  if (!weapon || weapon.level <= 0 || getOwnedWeaponCount() <= 1) return;
  game.materials += getWeaponSellValue(weaponId);
  weapon.level = 0;
  syncWeaponDerivedStats();
  if (game.weaponUpgradeCounts) {
    for (const id of Object.keys(game.weaponUpgradeCounts)) {
      if (getUpgradeWeaponId(id) === weaponId) delete game.weaponUpgradeCounts[id];
    }
  }
  applyWeaponUpgradeModifiers();
  game.shopOffers = game.shopOffers.filter((offer) => getUpgradeWeaponId(offer.entry.id) !== weaponId || offer.locked);
  updateHud();
  renderShop();
}




function rerollShop() {
  if (state !== "armory") return;
  const cost = getRefreshCost();
  if (game.materials < cost) return;
  game.materials -= cost;
  game.rerollCount += 1;
  const locked = game.shopOffers.filter((offer) => offer.locked && !offer.purchased);
  game.shopOffers = generateShopOffers(getShopOfferCount(), locked);
  renderShop();
}



function getUpgradeWeaponId(id) {
  if (id.startsWith("coffee")) return "coffee";
  if (id.startsWith("keyboard")) return "keyboard";
  if (id.startsWith("headset")) return "headset";
  if (id.startsWith("report")) return "report";
  if (id.startsWith("stapler")) return "stapler";
  if (id.startsWith("sticky")) return "sticky";
  if (id.startsWith("marker")) return "marker";
  if (id.startsWith("calculator")) return "calculator";
  if (id.startsWith("shredder")) return "shredder";
  if (id.startsWith("thermos")) return "thermos";
  return null;
}

function gridIconClass(base, index) {
  return `${base} icon-c${index % SPRITE_GRID} icon-r${Math.floor(index / SPRITE_GRID)}`;
}

function uiIconClass(index) {
  return gridIconClass("ui-icon", index);
}

function assetIconClass(index) {
  return gridIconClass("asset-icon", index);
}

function getEntryIconClass(entry) {
  const weaponId = getUpgradeWeaponId(entry.id);
  if (weaponId) return getWeaponIconClass(weaponId);
  if (entry.shopType === "item") return getItemIconClass(entry.id);
  return getStatIconClass(entry.id);
}

function getWeaponIconClass(id) {
  const map = {
    coffee: 8,
    keyboard: 9,
    headset: 15,
    report: 14,
    stapler: 10,
    sticky: 11,
    marker: 12,
    calculator: 13,
    shredder: 14,
    thermos: 11,
  };
  return map[id] !== undefined ? assetIconClass(map[id]) : uiIconClass(12);
}

function getStatIconClass(idOrKey) {
  const normalized = {
    sprint: "speed",
    focus: "damageMult",
    attackSpeed: "attackSpeed",
    crit: "crit",
    range: "range",
    padding: "armor",
    dodge: "dodge",
    luck: "luck",
    regen: "regen",
    magnet: "pickupRange",
    overclock: "attackSpeed",
    glassBuild: "damageMult",
    compound: "luck",
    evasive: "dodge",
    fortifiedDesk: "fortify",
    quietField: "fortify",
    trapManual: "luck",
    shieldProtocol: "armor",
    glossary: "range",
    afterWorkDrink: "damageMult",
    bilingualMinutes: "range",
    wineTableReview: "crit",
    laserCalibration: "range",
    reportAuditTrail: "luck",
    noiseCancelFort: "fortify",
    paperOrbitDrill: "fortify",
    deskMinePermit: "pickupRange",
    contractLanguage: "range",
    socialDrinking: "crit",
    shredderMaintenance: "armor",
    teaRoomRoutine: "fortify",
    crisisManual: "armor",
  }[idOrKey] || idOrKey;
  const map = {
    maxHp: 0,
    armor: 1,
    dodge: 2,
    speed: 3,
    attackSpeed: 4,
    damageMult: 5,
    crit: 6,
    range: 7,
    luck: 8,
    pickupRange: 10,
    regen: 11,
    fortify: 1,
  };
  return uiIconClass(map[normalized] ?? 12);
}

function getItemIconClass(id) {
  const map = {
    lunchbox: 0,
    rubberSole: 3,
    luckyBadge: 8,
    oldHardDrive: 5,
    fileCabinet: 1,
    wirelessMouse: 4,
    energyDrink: 11,
    deskFan: 7,
    macroPad: 12,
    redPen: 6,
    projector: 7,
    laserPointer: 6,
    standingDesk: 3,
    assetLedger: 9,
    quietRoom: 1,
    redlineContract: 5,
    insuranceClause: 0,
    ergonomicMat: 1,
    whiteboardWall: 7,
    deskLamp: 11,
    cableNest: 10,
    liquorCoffee: 11,
    translationHeadset: 12,
    foreignContract: 9,
  };
  return uiIconClass(map[id] ?? 9);
}















// Returns which route has the highest total weapon levels

// 0 = no pair, 0.5 = subordinate, 1.0 = dominant among multiple, 1.25 = sole route





























function fireAt(target, speed, damage, color, pierce, radius, life = 1.25, source = "projectile") {
  const p = game.player;
  const angle = Math.atan2(target.y - p.y, target.x - p.x);
  spawnProjectile({
    x: p.x,
    y: p.y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: radius,
    life,
    damage,
    color,
    pierce,
    source,
  });
}

function spawnProjectile(projectile) {
  projectile.hitIds = new Set();
  game.projectiles.push(projectile);
}

function fireBeam(angle, length, width, damage, color, source = "beam") {
  const p = game.player;
  const ax = Math.cos(angle);
  const ay = Math.sin(angle);
  for (const e of game.enemies) {
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const along = dx * ax + dy * ay;
    if (along < 0 || along > length) continue;
    const perp = Math.abs(dx * ay - dy * ax);
    if (perp < width + e.r) {
      const markerBonus = (source === "marker" && e.precisionMark > 0 && (game.routeEff?.precision || 0) > 0)
        ? 1 + 0.3 * (game.routeEff?.precision || 0) : 1;
      const dist = Math.hypot(e.x - p.x, e.y - p.y);
      const distEff = getRouteTier("precision") >= 3 ? Math.min(0.3, Math.floor(dist / 100) * 0.06) * (game.routeEff?.precision || 0) : 0;
      applyEnemyDamage(e, damage * markerBonus * (1 + distEff), source);
      e.hitFlash = 0.08;
    }
  }
  game.particles.push({
    kind: "beam",
    x: p.x,
    y: p.y,
    angle,
    length,
    width,
    vx: 0,
    vy: 0,
    r: 1,
    age: 0,
    life: 0.14,
    maxLife: 0.14,
    color,
  });
}

function chainLightning(start, jumps, range, damage, source = "calculator") {
  let current = start;
  const hit = new Set();
  const conductor = hasWeaponPair("sticky", "calculator", 2);
  const conductorTier = getRouteTier("conductor");
  const conductorEff = game.routeEff?.conductor || 0;
  let conductorSlowBounced = false;
  let extraJumps = 0;
  for (let i = 0; i < jumps + extraJumps && current; i += 1) {
    hit.add(current.id);
    // Conductor T1: first slowed enemy hit grants +2 extra chain jumps (gated)
    if (conductorEff > 0 && !conductorSlowBounced && (current.slow < 1)) {
      extraJumps += 2;
      conductorSlowBounced = true;
    }
    applyEnemyDamage(current, damage * Math.pow(0.82, i), source);
    current.hitFlash = 0.1;
    spark(current.x, current.y, "#9ee37d");

    let next = null;
    let best = Infinity;
    for (const e of game.enemies) {
      if (hit.has(e.id)) continue;
      const dist = Math.hypot(e.x - current.x, e.y - current.y);
      if (dist < range && dist < best) {
        best = dist;
        next = e;
      }
    }
    if (next) {
      // Conductor T4: chain passing through sticky trap → detonate + refresh (gated)
      if (conductorEff > 0 && conductorTier >= 4) {
        for (const zone of game.damageZones) {
          if (zone.source === "sticky" && zone.life > 0) {
            const zdx = zone.x - current.x; const zdy = zone.y - current.y;
            const ndx = next.x - current.x; const ndy = next.y - current.y;
            const dot = zdx * ndx + zdy * ndy;
            const segLenSq = ndx * ndx + ndy * ndy;
            const t = clamp(dot / segLenSq, 0, 1);
            const px = current.x + t * ndx;
            const py = current.y + t * ndy;
            if (Math.hypot(px - zone.x, py - zone.y) < zone.r + 20) {
              zone.explodeOnEnd = true;
              zone.life = Math.max(zone.life, 0.15);
              zone.damage *= 1.5;
              zone.chainTick = 0;
              floatingText(zone.x, zone.y - 8, "过载", "#52ffe1");
            }
          }
        }
      }
      game.particles.push({
        kind: "line",
        x: current.x,
        y: current.y,
        x2: next.x,
        y2: next.y,
        vx: 0,
        vy: 0,
        r: 1,
        age: 0,
        life: 0.16,
        maxLife: 0.16,
        color: "#9ee37d",
      });
    }
    current = next;
  }
}

function getOrbiters() {
  const p = game.player;
  const list = [];
  const perimeter = hasWeaponPair("headset", "report", 2);
  const perimeterTier = getRouteTier("perimeter");
  const anchorCount = getAnchorCharge() > 0.86 ? Math.floor(getEffectiveStat("fortify") / 7) : 0;
  // Perimeter T3: anchored => extra orbit ring (gated by effectiveness)
  const anchorRing = (perimeterTier >= 3 && getAnchorCharge() > 0.65 && (game.routeEff?.perimeter || 0) > 0) ? 1 : 0;
  const count = p.orbitCount + (perimeter ? 1 : 0) + (perimeterTier >= 4 ? 2 : 0) + Math.min(3, anchorCount) + anchorRing;
  const radius = p.orbitRadius + (perimeter ? 14 : 0) + (perimeterTier >= 4 ? 10 : 0) + getAnchorCharge() * 12;
  for (let i = 0; i < count; i += 1) {
    const angle = game.orbitAngle + (i / count) * TAU;
    list.push({
      x: p.x + Math.cos(angle) * radius,
      y: p.y + Math.sin(angle) * radius,
      r: perimeter ? 19 : 17,
    });
  }
  return list;
}








function openPerkShop() {
  ui.resultPanel?.classList.add("hidden");
  ui.startPanel?.classList.add("hidden");
  ui.perkPanel?.classList.remove("hidden");
  renderPerkShop();
}

function closePerkShop() {
  ui.perkPanel?.classList.add("hidden");
  if (state === "result") ui.resultPanel?.classList.remove("hidden");
  else {
    ui.startPanel?.classList.remove("hidden");
    updateStartActions();
  }
}

function renderPerkShop() {
  if (!ui.perkList || !ui.perkPoints) return;
  const points = getEmployeePoints();
  const levels = getPermanentUpgradeLevels();
  ui.perkPoints.textContent = points;
  ui.perkList.replaceChildren(...permanentUpgrades.map((upgrade) => {
    const level = levels[upgrade.id] || 0;
    const max = upgrade.costs.length;
    const nextCost = upgrade.costs[level] || 0;
    const card = document.createElement("div");
    card.className = "perk-card";
    const title = document.createElement("strong");
    title.textContent = upgrade.title;
    const levelText = document.createElement("small");
    levelText.textContent = `Lv.${level}/${max}`;
    const desc = document.createElement("span");
    desc.textContent = upgrade.text;
    const button = document.createElement("button");
    button.className = "mini-button";
    button.type = "button";
    button.textContent = level >= max ? "已满" : `${nextCost} 工分`;
    button.disabled = level >= max || points < nextCost;
    button.addEventListener("click", () => buyPermanentUpgrade(upgrade.id));
    card.append(title, levelText, desc, button);
    return card;
  }));
}

function buyPermanentUpgrade(id) {
  const upgrade = permanentUpgrades.find((entry) => entry.id === id);
  if (!upgrade) return;
  const levels = getPermanentUpgradeLevels();
  const level = levels[id] || 0;
  const cost = upgrade.costs[level];
  if (!cost || getEmployeePoints() < cost) return;
  setEmployeePoints(getEmployeePoints() - cost);
  levels[id] = level + 1;
  setPermanentUpgradeLevels(levels);
  renderPerkShop();
}

























  return drawGridCell(spriteAtlas, spriteAtlasReady, index, cx, cy, w, h, options);
}

  return drawGridCell(propsAtlas, propsAtlasReady, index, cx, cy, w, h, options);
}

  if (!ready || !atlas.naturalWidth || !atlas.naturalHeight) return false;
  const cellW = atlas.naturalWidth / SPRITE_GRID;
  const cellH = atlas.naturalHeight / SPRITE_GRID;
  const inset = options.inset ?? Math.max(8, Math.floor(Math.min(cellW, cellH) * 0.035));
  const sx = (index % SPRITE_GRID) * cellW + inset;
  const sy = Math.floor(index / SPRITE_GRID) * cellH + inset;
  const sw = cellW - inset * 2;
  const sh = cellH - inset * 2;
  ctx.save();
  ctx.translate(Math.round(cx), Math.round(cy));
  if (options.alpha !== undefined) ctx.globalAlpha *= options.alpha;
  if (options.rotation) ctx.rotate(options.rotation);
  if (options.flipX) ctx.scale(-1, 1);
  if (options.ground) {
    ctx.fillStyle = options.ground;
    ctx.beginPath();
    ctx.ellipse(0, h * 0.28, w * 0.34, h * 0.14, 0, 0, TAU);
    ctx.fill();
  }
  if (options.glow) {
    ctx.shadowColor = options.glow;
    ctx.shadowBlur = options.glowBlur || 14;
  }
  ctx.drawImage(atlas, sx, sy, sw, sh, -w / 2, -h / 2, w, h);
  ctx.shadowBlur = 0;
  if (options.flash) {
    ctx.globalAlpha = 0.36;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(w, h) * 0.38, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
  return true;
}

  return drawAtlasCell(index, x + w / 2, y + h / 2, w, h, options);
}














































function formatEntryTag(entry) {
  const weaponId = getUpgradeWeaponId(entry.id);
  if (!weaponId) return `${getItemRarityLabel(entry)} · ${entry.tag}`;
  const labels = (game.weapons[weaponId].classes || []).map((className) => weaponClassLabels[className] || className);
  return labels.length ? `${entry.tag} · ${labels.join("/")}` : entry.tag;
}

  if (!target || !game) return;
  target.innerHTML = "";
  const dominantId = getDominantRouteId();
  let hasContent = false;
  for (const route of routeDefinitions) {
    const progress = getRouteProgress(route);
    if (progress.tier < 1) continue;
    hasContent = true;
    const isDominant = route.id === dominantId;
    const eff = getRouteEffectiveness(route.id);
    const effLabel = eff >= 1.25 ? "【主路线 125%】" : eff >= 1.0 ? "【主路线 100%】" : "【副路线 50%】";
    const weaponTags = route.weapons.map(id => {
      const w = game.weapons[id];
      return `<span class="armory-class-chip ${w.level >= 2 ? '' : 'dim'}">${w.label} Lv.${w.level}</span>`;
    }).join(" ");
    const tierStars = Array.from({length: 4}, (_, i) =>
      `<span class="route-star ${i < progress.tier ? 'filled' : ''}">${i < progress.tier ? '◆' : '◇'}</span>`
    ).join("");
    const nextHint = progress.tier < 4
      ? `<em>→ ${progress.tier < 2 ? '购入另一武器' : progress.tier < 3 ? '提高武器等级' : '两武器Lv.7解锁终局'}</em>`
      : '<em>✓ 终局已激活</em>';
    const card = document.createElement("div");
    card.className = `route-card ${isDominant ? 'dominant-route' : ''}`;
    card.style.borderLeftColor = route.color;
    card.innerHTML = `
      <div class="route-head">
        <strong style="color:${route.color}">${route.name}</strong>
        <span class="route-eff-badge">${effLabel}</span>
      </div>
      <div class="route-meter">
        <span class="route-stage">${tierStars}</span>
        <em>${progress.tier >= 4 ? '终局已激活' : progress.tier >= 2 ? '需Lv.7解锁T4终局' : '购入另一武器解锁路线'}</em>
      </div>
      <div class="route-weapons-show">${weaponTags}</div>
    `;
    target.appendChild(card);
  }
  if (hasContent) {
    target.classList.remove("hidden");
  } else {
    target.classList.add("hidden");
  }
}














window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "escape") {
    togglePause();
    return;
  }
  if (event.key.toLowerCase() === "b" || event.key.toLowerCase() === "tab") {
    if (game && state !== "menu") {
      event.preventDefault();
      toggleBuildPanel();
      return;
    }
  }
  keys.add(event.key.toLowerCase());
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

canvas.addEventListener("pointerdown", (event) => {
  pointer.active = true;
  updatePointerTarget(event);
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if (pointer.active) updatePointerTarget(event);
});

canvas.addEventListener("pointerup", (event) => {
  pointer.active = false;
  canvas.releasePointerCapture(event.pointerId);
});

canvas.addEventListener("pointercancel", () => {
  pointer.active = false;
});









/* ── 路线视觉阶段效果 ── */


/* ── 加班补贴：低血量翻盘选项 ── */
function getSubsidyOption() {
  const hpPct = game.player.hp / game.player.maxHp;
  if (hpPct > 0.3 || game.subsidyUsed) return null;
  if (Math.random() > 0.55) return null; // Not guaranteed
  const options = [
    { title: "急招·加班补贴", tag: "补贴 / 生存", text: "立即恢复 40% 生命，伤害 +8%。下关怪物 +20%。", risk: "风险：下关怪物数量 +20%", apply(g) { g.player.hp = Math.min(g.player.maxHp, g.player.hp + g.player.maxHp * 0.4); addPlayerDamage(g, 0.08); g.sudsidyPenalty = (g.sudsidyPenalty || 0) + 0.2; } },
    { title: "急招·双倍工资", tag: "补贴 / 经济", text: "获得 8 材料，下次商店额外刷新。本关经验 -15%。", risk: "风险：本关经验获取 -15%", apply(g) { g.materials += 8; g.shopRefreshBonus = (g.shopRefreshBonus || 0) + 1; g.xpPenalty = (g.xpPenalty || 0) + 0.15; } },
    { title: "急招·护身符", tag: "补贴 / 防御", text: "护甲 +6，恢复 +4，持续到本关结束。下关属性升级选项 -1。", risk: "风险：下关升级选项 -1", apply(g) { g.tempArmor = (g.tempArmor || 0) + 6; g.tempRegen = (g.tempRegen || 0) + 4; g.sudsidySlotPenalty = true; } },
    { title: "急招·死线冲刺", tag: "补贴 / 爆发", text: "伤害 +25%，全武器冷却 -20%，持续本关。结束后生命 -15%。", risk: "风险：效果结束后生命 -15%", apply(g) { addPlayerDamage(g, 0.25); g.sudsidyCdBoost = true; g.sudsidyHpPenalty = (g.sudsidyHpPenalty || 0) + 0.15; } },
  ];
  const idx = Math.floor(Math.random() * options.length);
  return { ...options[idx], id: `sudsidy_${idx}`, subsidy: true };
}

/* ── 黑暗词条系统 ── */
const itemDarkAffixes = {
  energyDrink: { text: "隐藏：每关结束时失去 1 点最大生命", apply(g) { if (g.stage > 1) g.player.maxHp = Math.max(40, g.player.maxHp - 1); if (g.player.hp > g.player.maxHp) g.player.hp = g.player.maxHp; } },
  oldHardDrive: { text: "隐藏：武器升级费用 +1 材料", apply(g) { g.weaponUpgradeCostPenalty = (g.weaponUpgradeCostPenalty || 0) + 1; } },
  fileCabinet: { text: "隐藏：移动速度 -6（静立站点时不受影响）", apply(g) { g.player.speed = Math.max(140, g.player.speed - 6); } },
  coffeeMachine: { text: "隐藏：咖啡伤害 +8%，其他武器伤害 -5%", apply(g) { addPlayerDamage(g, -0.05); } },
};

function applyDarkAffix(itemId, g) {
  const affix = itemDarkAffixes[itemId];
  if (affix?.apply) {
    affix.apply(g);
    if (!g.darkAffixes) g.darkAffixes = {};
    g.darkAffixes[itemId] = true;
  }
}

function getItemDarkAffixText(itemId) {
  const affix = itemDarkAffixes[itemId];
  return affix ? affix.text : "";
}

/* ── 隐藏协同：不在图鉴显示，玩家撞见才解锁 ── */
const hiddenSynergies = [
  {
    id: "paperStorm",
    name: "纸张风暴",
    trigger: ["energyDrink", "stapler"],
    items: ["energyDrink", "luckyBadge"],
    desc: "碎片 × 幸运：暴击时召唤 3 张纸剑射向随机敌人",
    onCrit(g, e) {
      if (Math.random() < 0.35) {
        for (let i = 0; i < 3; i += 1) {
          const target = game.enemies[Math.floor(Math.random() * game.enemies.length)];
          if (target) {
            game.projectiles.push({
              x: g.player.x, y: g.player.y - 30, vx: (target.x - g.player.x) * 0.15, vy: (target.y - g.player.y) * 0.15,
              r: 3, damage: hitDamage(14 * getWeaponStatScale("precise")), pierce: 2, color: "#fff", source: "synergy", life: 0.8
            });
          }
        }
      }
    },
  },
  {
    id: "recyclingChain",
    name: "循环回收链",
    items: ["wirelessMouse", "deskFan"],
    desc: "鼠标 × 风扇：拾取材料时有 30% 概率额外获得 1 材料",
  },
  {
    id: "fortifiedBunker",
    name: "防御工事",
    items: ["fileCabinet", "lunchbox"],
    desc: "文件柜 × 便当：护甲 +3，站桩时额外减伤 10%",
  },
  {
    id: "rubberStampede",
    name: "盖章冲锋",
    items: ["rubberSole", "oldHardDrive"],
    desc: "鞋底 × 硬盘：闪避成功后对最近敌人造成 80 伤害",
  },
  {
    id: "spicyCombo",
    name: "麻辣组合",
    items: ["energyDrink", "oldHardDrive"],
    desc: "饮料 × 硬盘：能量饮料不再扣血，伤害再 +6%",
  },
  {
    id: "wirelessFengShui",
    name: "无线风水",
    items: ["wirelessMouse", "fileCabinet"],
    desc: "鼠标 × 文件柜：拾取范围 +30，拾取材料时 20% 恢复 2 生命",
  },
];




/* ── 关卡间随机事件 ── */
const interStageEvents = [
  { title: "回复紧急邮件", icon: "📧", desc: "总监发来紧急邮件，现在回复？", risk: "失去 15% 当前生命", accept(g) { g.player.hp = Math.max(1, g.player.hp - g.player.maxHp * 0.15); g.materials += 8; g.shopRefreshBonus = (g.shopRefreshBonus || 0) + 1; } },
  { title: "续杯咖啡", icon: "☕", desc: "免费续杯第四杯咖啡——可能手抖。", risk: "本关移速 -15%", accept(g) { g.upgradeChoiceBonus = (g.upgradeChoiceBonus || 0) + 1; g.player.speed = Math.round(g.player.speed * 0.85); } },
  { title: "替同事顶班", icon: "📋", desc: "同事请假，他的活归你了。", risk: "下关怪物 +25%", accept(g) { g.stageConfig.totalEnemies = Math.round(g.stageConfig.totalEnemies * 1.25); g.stageConfig.materialMult += 0.35; g._overtimeCovered = true; } },
  { title: "签署保密协议", icon: "🔒", desc: "HR 让你签一份很长的协议。", risk: "本关武器升级费用翻倍", accept(g) { g.weaponCostDouble = true; g.materials += 5; g._ndaSigned = true; } },
  { title: "清理工位", icon: "🧹", desc: "行政部来检查工位卫生——清理还是藏起来？", risk: "失去 2 材料", accept(g) { g.materials = Math.max(0, g.materials - 2); g.player.regen += 3; addPlayerDamage(g, 0.06); g._deskCleaned = true; } },
  { title: "内部培训", icon: "📖", desc: "强制参加培训——可能学到东西，也可能浪费时间。", risk: "50% 概率没有任何效果", accept(g) { if (Math.random() < 0.5) { g.player.luck += 10; addPlayerDamage(g, 0.08); } } },
  { title: "系统更新", icon: "💻", desc: "IT 强制推送系统更新，重启中...", risk: "下关前 15 秒无法攻击", accept(g) { g.systemUpdateTimer = 15; g.materials += 6; g.player.armor += 3; g._updateComplete = false; } },
  { title: "年度体检", icon: "🏥", desc: "公司年度体检——可能发现点什么。", risk: "最大生命 -5", accept(g) { if (Math.random() < 0.6) { g.player.maxHp += 15; g.player.hp = Math.min(g.player.maxHp, g.player.hp + 20); g.player.regen += 2; } else { g.player.maxHp = Math.max(50, g.player.maxHp - 5); } } },
];

function showInterStageEvent() {
  if (!ui.eventPanel || game.stage <= 1 || Math.random() > 0.6) return; // ~40% chance after stage 1
  const event = interStageEvents[Math.floor(Math.random() * interStageEvents.length)];
  ui.eventTitle.textContent = event.title;
  ui.eventChoices.innerHTML = `
    <button class="event-choice" id="eventAcceptBtn">
      <span class="event-icon">${event.icon}</span>
      <span class="event-body">
        <strong>${event.title}</strong>
        <span class="event-desc">${event.desc}</span>
        <span class="event-risk">⚠ ${event.risk}</span>
      </span>
    </button>
  `;
  ui.eventSkipButton.onclick = () => { ui.eventPanel.classList.add("hidden"); };
  document.getElementById("eventAcceptBtn").onclick = () => {
    event.accept(game);
    ui.eventPanel.classList.add("hidden");
    floatingText(game.player.x, game.player.y - 40, event.title, "#ffd15c");
  };
  ui.eventPanel.classList.remove("hidden");
}

ui.startButton.addEventListener("click", startGame);
ui.restartButton.addEventListener("click", startGame);
ui.perkShopButton?.addEventListener("click", openPerkShop);
ui.perkCloseButton?.addEventListener("click", closePerkShop);
ui.startPerkButton?.addEventListener("click", openPerkShop);
ui.startEndlessButton?.addEventListener("click", startEndlessMode);
ui.itemConvertButton?.addEventListener("click", convertPendingItemToMaterial);
ui.itemKeepButton?.addEventListener("click", keepCurrentPassiveItems);
ui.endlessButton?.addEventListener("click", startEndlessMode);
ui.policySkip?.addEventListener("click", skipPolicyAndStart);
ui.continueButton.addEventListener("click", startNextStage);
ui.upgradeRerollButton?.addEventListener("click", rerollUpgradeChoices);
ui.refreshButton.addEventListener("click", rerollShop);
ui.pauseButton.addEventListener("click", togglePause);
ui.resumeButton.addEventListener("click", resumeGame);
ui.restartFromPause?.addEventListener("click", abandonRunToMenu);
ui.buildToggle.addEventListener("click", toggleBuildPanel);
ui.fusionNoticeClose?.addEventListener("click", () => ui.fusionNotice?.classList.add("hidden"));

decorateHudIcons();
updateStartActions();

renderBuildHud(weaponDefinitions, "咖啡 Lv.1 · 1/6");
renderStatHud({
  maxHp: 100,
  armor: 0,
  dodge: "0%",
  speed: 245,
  attackSpeed: "0%",
  damageMult: "100%",
  crit: "0%",
  range: 0,
  luck: 0,
  pickupRange: 150,
  regen: "0/s",
  fortify: 0,
});
renderItemHud([]);
renderBestOvertime();
drawMenuBackground();



