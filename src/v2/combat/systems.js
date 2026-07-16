// ================================================================
// src/v2/combat/systems.js
// Canvas combat runtime. UI does not mutate combat state directly.
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});
  const V2 = CS.V2 || (CS.V2 = {});

  const W = 1280;
  const H = 720;
  const STEP = 1 / 60;
  let canvas = null;
  let ctx = null;
  let attackTimer = 0;
  let spawnTimer = 0;
  let pickupMagnetTimer = 0;
  const VFX_PATH = "assets/v2-weapon-vfx/sprites/";
  const VFX_SPRITES = {
    marker_beam: "marker_beam.png",
    marker_split: "marker_split.png",
    marker_blast: "marker_blast.png",
    marker_mark: "marker_mark.png",
    marker_wave: "marker_wave.png",
    marker_grid: "marker_grid.png",
    marker_scan: "marker_scan.png",
    marker_counter: "marker_counter.png",
    thermos_charge: "thermos_charge.png",
    thermos_steam: "thermos_steam.png",
    thermos_drone: "thermos_drone.png",
    thermos_boil: "thermos_boil.png",
    thermos_shield: "thermos_shield.png",
    thermos_shield_break: "thermos_shield_break.png",
    thermos_tea_wave: "thermos_tea_wave.png",
    thermos_station: "thermos_station.png",
    thermos_safe_zone: "thermos_safe_zone.png",
    sticky_base: "sticky_base.png",
    sticky_seeking: "sticky_seeking.png",
    sticky_sync_blast: "sticky_sync_blast.png",
    sticky_route: "sticky_route.png",
    sticky_spread: "sticky_spread.png",
    sticky_notice_board: "sticky_notice_board.png",
    sticky_notice_mastery: "sticky_notice_mastery.png",
    sticky_combo: "sticky_combo.png"
  };
  const vfxImages = {};

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function dist(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function nearestEnemy(state, range) {
    let best = null;
    let bestD = Infinity;
    for (const enemy of state.enemies) {
      const d = dist(state.player, enemy);
      if (d < bestD && (!range || d <= range)) {
        best = enemy;
        bestD = d;
      }
    }
    return best;
  }

  function addParticle(state, x, y, color, count) {
    const budget = state.stage.id >= 4 ? 90 : 140;
    if (state.particles.length > budget) return;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 40 + Math.random() * 180;
      state.particles.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 0.28 + Math.random() * 0.38,
        maxLife: 0.66,
        color,
        size: 2 + Math.random() * 4
      });
    }
  }

  function loadVfxImages() {
    Object.keys(VFX_SPRITES).forEach(function (id) {
      if (vfxImages[id]) return;
      const img = new Image();
      img.src = VFX_PATH + VFX_SPRITES[id];
      vfxImages[id] = img;
    });
  }

  function isSpriteReady(id) {
    const img = vfxImages[id];
    return !!(img && img.complete && img.naturalWidth > 0);
  }

  function drawSprite(ctx, id, x, y, width, height, alpha, rotation) {
    if (!isSpriteReady(id)) return false;
    const img = vfxImages[id];
    ctx.save();
    ctx.globalAlpha *= alpha == null ? 1 : alpha;
    ctx.translate(x, y);
    if (rotation) ctx.rotate(rotation);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();
    return true;
  }

  function drawLineSprite(ctx, id, x1, y1, x2, y2, width, alpha) {
    if (!isSpriteReady(id)) return false;
    const len = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const height = Math.max(34, (width || 6) * 9);
    return drawSprite(ctx, id, x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2, Math.max(90, len), height, alpha, angle);
  }

  function beamSpriteFor(kind) {
    if (kind === "steam") return "thermos_steam";
    if (kind === "grid") return "marker_grid";
    if (kind === "counter") return "marker_counter";
    if (kind === "support") return "marker_beam";
    if (kind === "scan") return "marker_scan";
    return "marker_beam";
  }

  function circleSpriteFor(kind) {
    if (kind === "blast") return "marker_blast";
    if (kind === "mark") return "marker_mark";
    if (kind === "wave") return "marker_wave";
    if (kind === "trap" || kind === "sticky_attach") return "sticky_base";
    if (kind === "sticky_spread") return "sticky_spread";
    if (kind === "station") return "thermos_station";
    if (kind === "shield") return "thermos_shield";
    if (kind === "steam_pulse") return "thermos_tea_wave";
    if (kind === "steam_drone") return "thermos_drone";
    if (kind === "support_trap") return "sticky_base";
    if (kind === "support_steam") return "thermos_tea_wave";
    return "";
  }

  function zoneSpriteFor(visual) {
    if (visual === "sticky_note") return "sticky_base";
    if (visual === "route_note") return "sticky_route";
    if (visual === "seeking_note") return "sticky_seeking";
    if (visual === "notice_board") return "sticky_notice_board";
    if (visual === "link_line") return "sticky_notice_mastery";
    if (visual === "secondary_sticky_blast") return "sticky_sync_blast";
    if (visual === "support_trap") return "sticky_base";
    if (visual === "steam_drone") return "thermos_drone";
    if (visual === "mini_boil") return "thermos_boil";
    if (visual === "shield_pulse") return "thermos_shield_break";
    if (visual === "tea_wave" || visual === "secondary_tea" || visual === "support_steam") return "thermos_tea_wave";
    if (visual === "safe_station") return "thermos_safe_zone";
    if (visual === "secondary_blast") return "marker_blast";
    if (visual === "secondary_wave") return "marker_wave";
    if (visual === "secondary_grid") return "marker_grid";
    return "";
  }

  function addBeamEvent(state, x1, y1, x2, y2, color, width, life, kind, sprite) {
    state.formEvents.push({ kind: kind || "beam", x1, y1, x2, y2, color, width, life, maxLife: life, sprite: sprite || beamSpriteFor(kind || "beam") });
  }

  function addCircleEvent(state, x, y, radius, color, life, kind, sprite) {
    state.formEvents.push({ kind: kind || "circle", x, y, radius, color, life, maxLife: life, sprite: sprite || circleSpriteFor(kind || "circle") });
  }

  function addTextEvent(state, x, y, text, color, life) {
    state.formEvents.push({ kind: "text", x, y, text, color: color || "#d8ffff", life: life || 0.6, maxLife: life || 0.6 });
  }

  function addDamageZone(state, zone) {
    state.damageZones.push(Object.assign({
      life: 0.35,
      maxLife: 0.35,
      damage: 10,
      tick: 0,
      tickEvery: 0.12,
      color: "#63f7ff",
      hits: {}
    }, zone));
  }

  function damageEnemy(state, enemy, amount, source, knockbackFrom) {
    if (!enemy || enemy.dead) return;
    enemy.hp -= amount;
    state.stats.damageDone[source] = (state.stats.damageDone[source] || 0) + amount;
    if (knockbackFrom) {
      const dx = enemy.x - knockbackFrom.x;
      const dy = enemy.y - knockbackFrom.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      enemy.x += dx / len * 12;
      enemy.y += dy / len * 12;
    }
    if (enemy.hp <= 0) {
      enemy.dead = true;
      state.kills += 1;
      state.stageKills += 1;
      if (enemy.stickyDebuff) {
        const spread = enemy.stickyDebuff;
        addCircleEvent(state, enemy.x, enemy.y, spread.radius || 120, "#8df7ff", 0.38, "sticky_spread");
        let spreadCount = 0;
        for (const other of state.enemies) {
          if (other.dead || other === enemy) continue;
          if (Math.hypot(other.x - enemy.x, other.y - enemy.y) > (spread.radius || 120) + other.r) continue;
          damageEnemy(state, other, spread.damage || amount * 0.55, "sticky_spread", enemy);
          if (spread.depth > 0 && spreadCount < (spread.limit || 2)) {
            other.stickyDebuff = {
              radius: spread.radius,
              damage: Math.max(3, (spread.damage || amount * 0.55) * 0.78),
              limit: Math.max(0, (spread.limit || 2) - 1),
              depth: spread.depth - 1
            };
          }
          spreadCount += 1;
        }
      }
      if (enemy.teaScent) {
        const radius = enemy.teaScent.radius || 96;
        addCircleEvent(state, enemy.x, enemy.y, radius, "#aaf4ff", 0.34, "steam_pulse");
        addDamageZone(state, { type: "circle", x: enemy.x, y: enemy.y, radius, damage: enemy.teaScent.damage || 6, life: 0.2, maxLife: 0.2, color: "#aaf4ff", visual: "tea_wave" });
      }
      const xpAmount = Math.round((enemy.xp || 4) * (1 + (state.activeFormParams.xpBonus || 0)));
      state.pickups.push({ type: "xp", x: enemy.x, y: enemy.y, amount: xpAmount, radius: 7, color: "#4a9eff" });
      if (Math.random() < 0.28 + (state.activeFormParams.materialBonus || 0)) {
        state.pickups.push({ type: "material", x: enemy.x + 8, y: enemy.y - 4, amount: 1, radius: 6, color: "#ffd700" });
      }
      addParticle(state, enemy.x, enemy.y, enemy.boss ? "#ff6b4a" : "#63f7ff", enemy.boss ? 18 : 6);
    }
  }

  function lineHitEnemies(state, x1, y1, x2, y2, width, damage, pierce, source) {
    const hits = [];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy || 1;
    for (const enemy of state.enemies) {
      if (enemy.dead) continue;
      const t = clamp(((enemy.x - x1) * dx + (enemy.y - y1) * dy) / len2, 0, 1);
      const px = x1 + dx * t;
      const py = y1 + dy * t;
      const d = Math.hypot(enemy.x - px, enemy.y - py);
      if (d <= width + enemy.r) {
        hits.push({ enemy, t });
      }
    }
    hits.sort(function (a, b) { return a.t - b.t; });
    const limited = hits.slice(0, Math.max(1, pierce || 1));
    limited.forEach(function (hit) {
      damageEnemy(state, hit.enemy, damage, source, { x: x1, y: y1 });
    });
    return limited;
  }

  function applyMarkerSecondary(state, hits, x1, y1, x2, y2) {
    const p = state.activeFormParams || {};
    if (!p.secondaryDept || !hits.length) return;
    const first = hits[0].enemy;
    if (p.crossSplit) {
      const base = Math.atan2(y2 - y1, x2 - x1);
      [-0.5, 0.5].forEach(function (off) {
        const tx = first.x + Math.cos(base + off) * 130;
        const ty = first.y + Math.sin(base + off) * 130;
        addBeamEvent(state, first.x, first.y, tx, ty, "#b7fbff", 3.5, 0.14, "beam");
        lineHitEnemies(state, first.x, first.y, tx, ty, 4, (p.damage || 20) * 0.28, 2, "secondary_split");
      });
    }
    if (p.crossExplode) {
      const radius = Math.max(42, (p.explosionRadius || 58) * 0.62);
      addCircleEvent(state, first.x, first.y, radius, "#aee8ff", 0.3, "blast");
      addDamageZone(state, { type: "circle", x: first.x, y: first.y, radius, damage: (p.damage || 20) * 0.45, life: 0.18, maxLife: 0.18, color: "#aee8ff", visual: "secondary_blast" });
    }
    if (p.crossShield) {
      p.shield = Math.min(70, (p.shield || 0) + hits.length * 1.2);
      if (p.shield >= 24) {
        p.shield -= 14;
        for (let i = 0; i < 4; i++) {
          const a = Math.PI * 2 * i / 4;
          const ex = state.player.x + Math.cos(a) * 180;
          const ey = state.player.y + Math.sin(a) * 180;
          addBeamEvent(state, state.player.x, state.player.y, ex, ey, "#84ffe7", 3, 0.16, "counter");
          lineHitEnemies(state, state.player.x, state.player.y, ex, ey, 4, (p.damage || 20) * 0.35, 4, "secondary_counter");
        }
      }
    }
    if (p.crossWave) {
      const radius = Math.max(58, (p.waveRadius || 96) * 0.68);
      addCircleEvent(state, x2, y2, radius, "#9cc8ff", 0.34, "wave");
      addDamageZone(state, { type: "circle", x: x2, y: y2, radius, damage: (p.damage || 20) * 0.28, life: 0.18, maxLife: 0.18, color: "#9cc8ff", visual: "secondary_wave" });
    }
    if (p.crossGrid) {
      addDamageZone(state, { type: "line", x1, y1, x2, y2, width: 6, damage: Math.max(5, (p.gridDamage || p.damage || 20) * 0.32), life: 1.2, maxLife: 1.2, color: "#d9e8a8", slow: 0.12, visual: "secondary_grid" });
    }
  }

  function fireMarker(state) {
    const p = state.activeFormParams;
    const form = state.activeForm || {};
    const target = nearestEnemy(state, p.range || 720);
    if (!target) return;
    const dx = target.x - state.player.x;
    const dy = target.y - state.player.y;
    const len = Math.hypot(dx, dy) || 1;
    const x1 = state.player.x;
    const y1 = state.player.y;
    const x2 = x1 + dx / len * (p.range || 720);
    const y2 = y1 + dy / len * (p.range || 720);
    const color = form.badgeDept === "product" ? "#82dfff" : form.badgeDept === "marketing" ? "#76b7ff" : form.badgeDept === "ops" ? "#62ffd6" : form.badgeDept === "general" ? "#bfe6ff" : "#5efcff";
    const width = Math.max(5, p.width || 8);
    const hits = lineHitEnemies(state, x1, y1, x2, y2, width, p.damage || 20, p.pierce || 4, form.formId || "marker");
    addBeamEvent(state, x1, y1, x2, y2, color, width, 0.18, "beam");
    state.stats.shots += 1;

    if (form.mechanicType === "line_split") {
      hits.forEach(function (hit, idx) {
        const base = Math.atan2(y2 - y1, x2 - x1);
        const branchCount = Math.max(2, p.splitCount || 2);
        addCircleEvent(state, hit.enemy.x, hit.enemy.y, 72 + branchCount * 8, "#9ffcff", 0.18, "split", "marker_split");
        for (let bi = 0; bi < branchCount; bi++) {
          const spread = branchCount === 1 ? 0 : (bi / (branchCount - 1) - 0.5) * 1.45;
          const off = spread + (idx % 2 ? 0.08 : -0.08);
          const angle = base + off + idx * 0.1;
          const sx2 = hit.enemy.x + Math.cos(angle) * (150 + branchCount * 10);
          const sy2 = hit.enemy.y + Math.sin(angle) * (150 + branchCount * 10);
          addBeamEvent(state, hit.enemy.x, hit.enemy.y, sx2, sy2, "#9ffcff", 4, 0.16, "beam");
          const splitHits = lineHitEnemies(state, hit.enemy.x, hit.enemy.y, sx2, sy2, 4, (p.damage || 20) * (p.splitDamage || 0.42), 2, "marker_split");
          if (p.secondarySplit) {
            splitHits.slice(0, 1).forEach(function (second) {
              const a2 = angle + (Math.random() > 0.5 ? 0.75 : -0.75);
              const tx = second.enemy.x + Math.cos(a2) * 105;
              const ty = second.enemy.y + Math.sin(a2) * 105;
              addBeamEvent(state, second.enemy.x, second.enemy.y, tx, ty, "#d8ffff", 2.5, 0.12, "beam");
              lineHitEnemies(state, second.enemy.x, second.enemy.y, tx, ty, 3, (p.damage || 20) * 0.22, 1, "marker_secondary_split");
            });
          }
        }
      });
      if (p.shieldPerHit && hits.length) state.activeFormParams.shield = (state.activeFormParams.shield || 0) + hits.length * p.shieldPerHit;
      if ((p.extraTrigger && Math.random() < 0.18) || (p.promotionFullscreenChance && Math.random() < p.promotionFullscreenChance)) {
        addBeamEvent(state, 0, state.player.y, W, state.player.y, "#c7f8ff", 7, 0.22, "beam");
        lineHitEnemies(state, 0, state.player.y, W, state.player.y, 7, (p.damage || 20) * 0.7, 99, "marker_fullscreen");
      }
    }

    if (form.mechanicType === "mark_detonate") {
      hits.forEach(function (hit) {
        if (hit.enemy.p0Marked) {
          const radius = (p.explosionRadius || 58) * (p.area || 1);
          addCircleEvent(state, hit.enemy.x, hit.enemy.y, radius, "#9edfff", 0.35, "blast", "marker_blast");
          addDamageZone(state, { type: "circle", x: hit.enemy.x, y: hit.enemy.y, radius, damage: p.explosionDamage || 34, life: 0.22, maxLife: 0.22, color: "#9edfff" });
          if (p.shieldOnDetonate) state.hp = Math.min(state.maxHp, state.hp + Math.round(p.shieldOnDetonate * 0.35));
          if (p.pauseAfterBlast) attackTimer += 0.22;
          hit.enemy.p0Marked = false;
        } else if (hit.enemy.boss || hit.enemy.maxHp >= 28 || Math.random() < 0.18) {
          hit.enemy.p0Marked = true;
          addCircleEvent(state, hit.enemy.x, hit.enemy.y, 28, "#ffd88a", 0.28, "mark", "marker_mark");
        }
      });
    }

    if (form.mechanicType === "line_to_wave") {
      const radius = (p.waveRadius || 96) * (p.area || 1);
      const waves = Math.max(1, p.waveCount || 1);
      for (let wi = 0; wi < waves; wi++) {
        const wr = radius + wi * 36;
        addCircleEvent(state, x2, y2, wr, "#91c9ff", 0.45 + wi * 0.08, "wave", "marker_wave");
        addDamageZone(state, { type: "circle", x: x2, y: y2, radius: wr, damage: (p.waveDamage || 15) * (1 - wi * 0.12), life: 0.18 + wi * 0.08, maxLife: 0.18 + wi * 0.08, color: "#91c9ff", slow: p.waveKnockback ? 0.2 : 0 });
      }
      if (p.waveReturn) {
        addCircleEvent(state, state.player.x, state.player.y, radius * 0.75, "#b7d8ff", 0.5, "wave", "marker_wave");
        addDamageZone(state, { type: "circle", x: state.player.x, y: state.player.y, radius: radius * 0.75, damage: (p.waveDamage || 15) * 0.75, life: 0.22, maxLife: 0.22, color: "#b7d8ff", slow: 0.2 });
      }
    }

    if (form.mechanicType === "shield_counter_line") {
      state.activeFormParams.shield = (state.activeFormParams.shield || 0) + hits.length * (p.shieldPerHit || 1.4);
      if ((state.activeFormParams.shield || 0) >= 18) {
        state.activeFormParams.shield = 0;
        const lines = Math.max(4, p.counterLines || 4);
        for (let i = 0; i < lines; i++) {
          const a = Math.PI * 2 * (i / lines) + Math.random() * 0.12;
          const ex = state.player.x + Math.cos(a) * 240;
          const ey = state.player.y + Math.sin(a) * 240;
          addBeamEvent(state, state.player.x, state.player.y, ex, ey, "#72ffe5", 4, 0.2, "counter");
          lineHitEnemies(state, state.player.x, state.player.y, ex, ey, 5, p.counterDamage || 28, 5, "marker_counter");
        }
      }
    }

    if (form.mechanicType === "line_grid_field") {
      addDamageZone(state, {
        type: "line",
        x1, y1, x2, y2,
        width: 10,
        damage: p.gridDamage || 11,
        life: p.trailDuration || 2.8,
        maxLife: p.trailDuration || 2.8,
        color: "#cfe8ff",
        slow: p.gridSlow || 0,
        visual: "secondary_grid"
      });
      if (p.gridEcho) {
        const ox = -(y2 - y1) * 0.08;
        const oy = (x2 - x1) * 0.08;
        addBeamEvent(state, x1 + ox, y1 + oy, x2 + ox, y2 + oy, "#e8d99a", 3, 0.24, "grid");
        addDamageZone(state, { type: "line", x1: x1 + ox, y1: y1 + oy, x2: x2 + ox, y2: y2 + oy, width: 8, damage: p.gridDamage || 11, life: p.trailDuration || 2.8, maxLife: p.trailDuration || 2.8, color: "#e8d99a", slow: p.gridSlow || 0 });
      }
    }
    applyMarkerSecondary(state, hits, x1, y1, x2, y2);
  }

  function applyThermosSecondary(state, target) {
    const p = state.activeFormParams || {};
    if (!p.secondaryDept) return;
    if (p.crossSteamDrone) {
      addDamageZone(state, {
        type: "circle",
        x: state.player.x,
        y: state.player.y,
        radius: 34,
        damage: Math.max(5, (p.damage || 12) * 0.45),
        life: 2.2,
        maxLife: 2.2,
        tickEvery: 0.28,
        color: "#a8fbff",
        visual: "steam_drone",
        orbitPlayer: true,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitRadius: 62,
        orbitSpeed: 2.4
      });
    }
    if (p.crossMiniBoil && target) {
      const radius = 54;
      addCircleEvent(state, target.x, target.y, radius, "#bdf5ff", 0.28, "steam_pulse", "thermos_boil");
      addDamageZone(state, { type: "circle", x: target.x, y: target.y, radius, damage: Math.max(8, (p.releaseDamage || p.damage || 16) * 0.22), life: 0.16, maxLife: 0.16, color: "#bdf5ff", visual: "mini_boil" });
    }
    if (p.crossWarmShield) {
      p.shield = Math.min(70, (p.shield || 0) + 5);
      addCircleEvent(state, state.player.x, state.player.y, 58, "#8fffe7", 0.24, "shield", "thermos_shield");
    }
    if (p.crossTeaWave) {
      const radius = 76;
      addCircleEvent(state, state.player.x, state.player.y, radius, "#9ddfff", 0.3, "steam_pulse", "thermos_tea_wave");
      addDamageZone(state, { type: "circle", x: state.player.x, y: state.player.y, radius, damage: Math.max(5, (p.damage || 12) * 0.32), life: 0.16, maxLife: 0.16, color: "#9ddfff", visual: "secondary_tea" });
    }
    if (p.crossSafeStation) {
      addDamageZone(state, { type: "circle", x: state.player.x, y: state.player.y, radius: 72, damage: Math.max(4, (p.damage || 10) * 0.25), life: 1.4, maxLife: 1.4, tickEvery: 0.36, color: "#cfefff", visual: "safe_station", slow: 0.18, heal: 0.6 });
    }
  }

  function fireThermos(state) {
    const p = state.activeFormParams;
    const form = state.activeForm || {};
    p.heat = (p.heat || 0) + (p.heatRate || 16);
    const target = nearestEnemy(state, p.releaseRange || p.steamRange || 280);
    if (!target && form.mechanicType !== "deployable_safe_station") return;
    applyThermosSecondary(state, target);

    if (form.mechanicType === "patrol_summon_steam") {
      if (p.heat >= 100) {
        p.heat = 0;
        const count = Math.max(1, p.summonCount || 1);
        for (let i = 0; i < count; i++) {
          addDamageZone(state, {
            type: "circle",
            x: state.player.x,
            y: state.player.y,
            radius: p.steamRadius || 42,
            damage: p.damage || 12,
            life: p.summonDuration || 5,
            maxLife: p.summonDuration || 5,
            tickEvery: 0.22,
            color: "#9ff8ff",
            visual: "steam_drone",
            orbitPlayer: true,
            orbitAngle: Math.PI * 2 * (i / count),
            orbitRadius: 78 + i * 18,
            orbitSpeed: (p.orbitSpeed || 2.2) * (i % 2 ? -1 : 1),
            slow: p.slow || 0
          });
        }
        addCircleEvent(state, state.player.x, state.player.y, 96, "#9ff8ff", 0.42, "steam_drone", "thermos_drone");
        addTextEvent(state, state.player.x, state.player.y - 42, "自动恒温模块上线", "#bdf5ff", 0.7);
      } else if (target) {
        const dx = target.x - state.player.x;
        const dy = target.y - state.player.y;
        const len = Math.hypot(dx, dy) || 1;
        const x2 = state.player.x + dx / len * (p.steamRange || 220);
        const y2 = state.player.y + dy / len * (p.steamRange || 220);
        addBeamEvent(state, state.player.x, state.player.y, x2, y2, "#86f7ff", 9, 0.16, "steam");
        lineHitEnemies(state, state.player.x, state.player.y, x2, y2, 11, Math.max(4, (p.damage || 12) * 0.55), 3, "thermos_steam");
      }
      return;
    }

    if (form.mechanicType === "charge_release_beam" && p.heat >= 100) {
      p.heat = 0;
      const dx = target.x - state.player.x;
      const dy = target.y - state.player.y;
      const len = Math.hypot(dx, dy) || 1;
      const x2 = state.player.x + dx / len * (p.releaseRange || 420);
      const y2 = state.player.y + dy / len * (p.releaseRange || 420);
      const width = p.releaseWidth || 20;
      addCircleEvent(state, state.player.x, state.player.y, 72, "#bdf5ff", 0.22, "steam_pulse", "thermos_charge");
      addBeamEvent(state, state.player.x, state.player.y, x2, y2, "#bdf5ff", width, 0.32, "steam", "thermos_boil");
      lineHitEnemies(state, state.player.x, state.player.y, x2, y2, width + 2, p.releaseDamage || 72, 8, "thermos_release");
      if (p.shieldAfterRelease) state.hp = Math.min(state.maxHp, state.hp + Math.round(p.shieldAfterRelease * 0.35));
      return;
    }

    if (form.mechanicType === "shield_break_pulse") {
      p.shieldCharge = (p.shieldCharge || 0) + (p.shieldGain || 8);
      const visibleRadius = 48 + Math.min(52, p.shieldCharge * 1.8);
      addCircleEvent(state, state.player.x, state.player.y, visibleRadius, "#8fffe7", 0.32, "shield", "thermos_shield");
      state.hp = Math.min(state.maxHp, state.hp + 0.8);
      if (p.shieldCharge >= (p.shieldThreshold || 30)) {
        p.shieldCharge = 0;
        const pulseCount = Math.max(1, p.pulseCount || 1);
        for (let i = 0; i < pulseCount; i++) {
          const radius = (p.pulseRadius || 120) + i * 38;
          addCircleEvent(state, state.player.x, state.player.y, radius, "#8fffe7", 0.46 + i * 0.08, "steam_pulse", "thermos_shield_break");
          addDamageZone(state, { type: "circle", x: state.player.x, y: state.player.y, radius, damage: (p.pulseDamage || 34) * (i ? 0.72 : 1), life: 0.24 + i * 0.08, maxLife: 0.24 + i * 0.08, color: "#8fffe7", visual: "shield_pulse", slow: p.slow || 0.2 });
        }
        addTextEvent(state, state.player.x, state.player.y - 48, "暖流破盾反击", "#8fffe7", 0.65);
      }
      return;
    }

    if (form.mechanicType === "periodic_wave_spread") {
      const waves = Math.max(1, p.waveCount || 1);
      for (let i = 0; i < waves; i++) {
        const radius = (p.waveRadius || 125) + i * 42;
        addCircleEvent(state, state.player.x, state.player.y, radius, "#9ddfff", 0.42 + i * 0.1, "steam_pulse", "thermos_tea_wave");
        addDamageZone(state, { type: "circle", x: state.player.x, y: state.player.y, radius, damage: (p.spreadDamage || p.damage || 8) * (1 - i * 0.12), life: 0.2 + i * 0.1, maxLife: 0.2 + i * 0.1, tickEvery: 0.12, color: "#9ddfff", visual: "tea_wave", debuff: "tea", teaRadius: p.teaRadius || 96, teaDamage: p.teaDamage || 6 });
      }
      return;
    }

    if (form.mechanicType === "deployable_safe_station") {
      const stationLimit = p.stationLimit || 1;
      const existing = state.damageZones.filter(function (z) { return z.visual === "safe_station"; });
      while (existing.length >= stationLimit) {
        const old = existing.shift();
        old.life = 0;
      }
      const angle = Math.random() * Math.PI * 2;
      const distance = existing.length ? 110 : 54;
      const sx = clamp(state.player.x + Math.cos(angle) * distance, 70, W - 70);
      const sy = clamp(state.player.y + Math.sin(angle) * distance, 70, H - 70);
      addCircleEvent(state, sx, sy, p.stationRadius || 130, "#bfeeff", 0.45, "station", "thermos_station");
      addDamageZone(state, {
        type: "circle",
        x: sx,
        y: sy,
        radius: p.stationRadius || 130,
        damage: p.stationPulseDamage || p.damage || 8,
        life: p.stationDuration || 7,
        maxLife: p.stationDuration || 7,
        tickEvery: 0.36,
        color: "#bfeeff",
        visual: "safe_station",
        slow: p.slow || 0.35,
        heal: p.heal || 1
      });
      return;
    }

    const radius = form.mechanicType === "deployable_safe_station" ? p.stationRadius || 130 : p.pulseRadius || 90;
    addCircleEvent(state, state.player.x, state.player.y, radius, "#82ffe8", 0.36, "steam_pulse");
    const pulseCount = form.mechanicType === "shield_break_pulse" ? Math.max(1, p.pulseCount || 1) : 1;
    for (let i = 0; i < pulseCount; i++) {
      addDamageZone(state, { type: "circle", x: state.player.x, y: state.player.y, radius: radius + i * 34, damage: i ? (p.pulseDamage || p.damage || 12) * 0.65 : (p.pulseDamage || p.damage || 12), life: 0.18 + i * 0.12, maxLife: 0.18 + i * 0.12, color: "#82ffe8", heal: p.heal || 0 });
    }
    if (form.mechanicType === "shield_break_pulse") state.hp = Math.min(state.maxHp, state.hp + 2 + (p.shieldGain ? 1 : 0));
  }

  function applyStickySecondary(state, x, y, target) {
    const p = state.activeFormParams || {};
    if (!p.secondaryDept) return;
    if (p.crossSeekingNote && target) {
      addDamageZone(state, { type: "circle", x: state.player.x, y: state.player.y, radius: 34, damage: Math.max(5, (p.damage || 10) * 0.55), life: 2.1, maxLife: 2.1, tickEvery: 0.32, color: "#9ffcff", stickyTrap: true, seek: true, seekSpeed: 150, visual: "seeking_note" });
    }
    if (p.crossManualBlast) {
      addCircleEvent(state, x, y, Math.max(42, (p.explosionRadius || 70) * 0.55), "#a9f1ff", 0.26, "blast", "sticky_sync_blast");
      addDamageZone(state, { type: "circle", x, y, radius: Math.max(42, (p.explosionRadius || 70) * 0.55), damage: Math.max(6, (p.damage || 10) * 0.7), life: 0.16, maxLife: 0.16, color: "#a9f1ff", visual: "secondary_sticky_blast" });
    }
    if (p.crossRouteShield) {
      state.activeFormParams.shield = Math.min(70, (state.activeFormParams.shield || 0) + 4);
      addCircleEvent(state, state.player.x, state.player.y, 54, "#8fffe7", 0.25, "shield", "sticky_route");
    }
    if (p.crossStickySpread && target) {
      target.stickyDebuff = { radius: Math.max(80, (p.spreadRadius || 120) * 0.7), damage: Math.max(5, (p.damage || 9) * 0.6), limit: 1, depth: 1 };
      addCircleEvent(state, target.x, target.y, 24, "#8df7ff", 0.24, "sticky_attach", "sticky_spread");
    }
    if (p.crossBoardLink) {
      addDamageZone(state, { type: "circle", x, y, radius: 88, damage: Math.max(5, (p.zoneDamage || p.damage || 9) * 0.55), life: 0.9, maxLife: 0.9, tickEvery: 0.28, color: "#e8db92", slow: 0.18, visual: "notice_board" });
    }
  }

  function fireSticky(state) {
    const p = state.activeFormParams;
    const form = state.activeForm || {};
    const angle = Math.random() * Math.PI * 2;
    const radius = 70 + Math.random() * 70;
    let x = clamp(state.player.x + Math.cos(angle) * radius, 55, W - 55);
    let y = clamp(state.player.y + Math.sin(angle) * radius, 55, H - 55);
    const target = nearestEnemy(state, 520);
    if (form.mechanicType === "seeking_trap_summon" && target) {
      x = clamp(state.player.x + Math.cos(angle) * 46, 55, W - 55);
      y = clamp(state.player.y + Math.sin(angle) * 46, 55, H - 55);
    }

    if (form.mechanicType === "sticky_debuff_spread") {
      if (!target) return;
      target.stickyDebuff = {
        radius: p.spreadRadius || 120,
        damage: p.spreadDamage || p.damage || 9,
        limit: p.spreadLimit || 3,
        depth: p.spreadDepth || 2
      };
      damageEnemy(state, target, p.damage || 9, "sticky_attach", state.player);
      addCircleEvent(state, target.x, target.y, 30, "#8df7ff", 0.34, "sticky_attach", "sticky_spread");
      addTextEvent(state, target.x, target.y - 26, "贴上", "#8df7ff", 0.45);
      applyStickySecondary(state, target.x, target.y, target);
      return;
    }

    if (form.mechanicType === "route_buff_trap") {
      const input = state.input || {};
      const ix = (input.right ? 1 : 0) - (input.left ? 1 : 0);
      const iy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
      const len = Math.hypot(ix, iy) || 1;
      x = clamp(state.player.x - ix / len * 42 + Math.cos(angle) * 18, 55, W - 55);
      y = clamp(state.player.y - iy / len * 42 + Math.sin(angle) * 18, 55, H - 55);
    }

    if (form.mechanicType === "manual_trap_detonate") {
      const oldTraps = state.damageZones.filter(function (z) { return z.stickyTrap; });
      if (oldTraps.length >= 2) {
        oldTraps.forEach(function (z) {
          const br = p.explosionRadius || 70;
          addCircleEvent(state, z.x, z.y, br, "#a9f1ff", 0.34, "blast", "sticky_sync_blast");
          addDamageZone(state, { type: "circle", x: z.x, y: z.y, radius: br, damage: (p.damage || 12) * 1.45, life: 0.18, maxLife: 0.18, color: "#a9f1ff", slow: p.blastKnockback ? 0.25 : 0, visual: "secondary_sticky_blast" });
          z.life = 0;
        });
        if (p.chainDetonate) {
          addCircleEvent(state, state.player.x, state.player.y, (p.explosionRadius || 70) * 1.2, "#d6fbff", 0.38, "blast", "sticky_sync_blast");
        }
      }
    }
    const trapRadius = p.trapRadius || (form.mechanicType === "trap_link_control_zone" ? 62 : 48);
    addCircleEvent(state, x, y, trapRadius, form.badgeDept === "general" ? "#e8db92" : "#86f7ff", 0.45, "trap", form.mechanicType === "route_buff_trap" ? "sticky_route" : form.mechanicType === "seeking_trap_summon" ? "sticky_seeking" : form.mechanicType === "trap_link_control_zone" ? "sticky_notice_board" : "sticky_base");
    addDamageZone(state, {
      type: "circle",
      x, y,
      radius: trapRadius,
      damage: p.damage || 10,
      life: p.trapDuration || 5,
      maxLife: p.trapDuration || 5,
      tickEvery: 0.4,
      color: form.badgeDept === "general" ? "#e8db92" : "#86f7ff",
      slow: p.slow || 0.25,
      heal: form.mechanicType === "route_buff_trap" ? (p.routeHeal || 0.7) : 0,
      playerShield: form.mechanicType === "route_buff_trap" ? (p.shieldGain || 3) : 0,
      stickyTrap: true,
      seek: form.mechanicType === "seeking_trap_summon",
      seekSpeed: p.seekSpeed || 120,
      zoneDamage: p.zoneDamage || 0,
      visual: form.mechanicType === "route_buff_trap" ? "route_note" : form.mechanicType === "seeking_trap_summon" ? "seeking_note" : "sticky_note",
      seekBounce: !!p.seekBounce
    });
    if (form.mechanicType === "trap_link_control_zone") {
      const zones = state.damageZones.filter(function (z) { return z.type === "circle" && z.color === "#e8db92"; }).slice(-3);
      if (zones.length >= 3) {
        for (let i = 0; i < zones.length; i++) {
          const a = zones[i];
          const b = zones[(i + 1) % zones.length];
          addBeamEvent(state, a.x, a.y, b.x, b.y, "#e8db92", 3, 0.45, "grid");
          addDamageZone(state, { type: "line", x1: a.x, y1: a.y, x2: b.x, y2: b.y, width: 7, damage: Math.max(4, (p.zoneDamage || 9) * 0.6), life: 1.1, maxLife: 1.1, color: "#e8db92", slow: p.slow || 0.25, visual: "link_line" });
        }
        const cx = zones.reduce((sum, z) => sum + z.x, 0) / zones.length;
        const cy = zones.reduce((sum, z) => sum + z.y, 0) / zones.length;
        addCircleEvent(state, cx, cy, p.linkRadius || 135, "#e8db92", 0.48, "trap", "sticky_notice_mastery");
        addDamageZone(state, { type: "circle", x: cx, y: cy, radius: p.linkRadius || 135, damage: p.zoneDamage || 9, life: 1.2, maxLife: 1.2, tickEvery: 0.3, color: "#e8db92", slow: p.slow || 0.3, visual: "notice_board" });
      }
    }
    applyStickySecondary(state, x, y, target);
  }

  function fireGeneric(state) {
    const p = state.activeFormParams;
    const target = nearestEnemy(state, p.range || 340);
    if (!target) return;
    state.projectiles.push({
      x: state.player.x,
      y: state.player.y,
      targetId: target.id,
      vx: 0,
      vy: 0,
      speed: 420,
      damage: p.damage || 12,
      radius: 6,
      life: 2,
      source: state.selectedWeaponId || "weapon",
      color: "#62f7ff"
    });
    state.stats.shots += 1;
  }

  function fireSupportSkill(state) {
    const skill = state.supportSkill;
    if (!skill || !skill.type) return;
    const target = nearestEnemy(state, 760);
    if (skill.type === "support_marker_line" && target) {
      const dx = target.x - state.player.x;
      const dy = target.y - state.player.y;
      const len = Math.hypot(dx, dy) || 1;
      const x2 = state.player.x + dx / len * 520;
      const y2 = state.player.y + dy / len * 520;
      addBeamEvent(state, state.player.x, state.player.y, x2, y2, "#c7f8ff", 4, 0.18, "support", "marker_beam");
      lineHitEnemies(state, state.player.x, state.player.y, x2, y2, 5, Math.max(10, (state.activeFormParams.damage || 12) * 0.42), 5, "support_marker");
      return;
    }
    if (skill.type === "support_thermos_pulse") {
      const radius = 128;
      addCircleEvent(state, state.player.x, state.player.y, radius, "#aaf4ff", 0.36, "support_steam", "thermos_tea_wave");
      addDamageZone(state, { type: "circle", x: state.player.x, y: state.player.y, radius, damage: Math.max(9, (state.activeFormParams.damage || 12) * 0.5), life: 0.22, maxLife: 0.22, color: "#aaf4ff", visual: "support_steam", slow: 0.18, heal: 0.8 });
      return;
    }
    if (skill.type === "support_sticky_trap") {
      const angle = Math.random() * Math.PI * 2;
      const x = clamp(state.player.x + Math.cos(angle) * 96, 60, W - 60);
      const y = clamp(state.player.y + Math.sin(angle) * 96, 60, H - 60);
      addCircleEvent(state, x, y, 74, "#8df7ff", 0.38, "support_trap", "sticky_base");
      addDamageZone(state, { type: "circle", x, y, radius: 74, damage: Math.max(8, (state.activeFormParams.damage || 12) * 0.46), life: 2.2, maxLife: 2.2, tickEvery: 0.34, color: "#8df7ff", visual: "support_trap", slow: 0.25 });
      return;
    }
    if (target) {
      state.projectiles.push({ x: state.player.x, y: state.player.y, targetId: target.id, speed: 380, damage: Math.max(8, (state.activeFormParams.damage || 12) * 0.35), radius: 5, life: 2, source: "support_weapon", color: "#bdf5ff" });
    }
  }

  function updateSupportSkill(state, dt) {
    const skill = state.supportSkill;
    if (!skill || state.mode !== "combat") return;
    skill.timer = Math.max(0, (skill.timer || 0) - dt);
    if (skill.timer > 0) return;
    fireSupportSkill(state);
    skill.timer = Math.max(1.2, skill.cooldown || 4);
  }

  function fireWeapon(state) {
    if (!state.selectedWeaponId) return;
    const id = state.selectedWeaponId;
    if (id === "marker") fireMarker(state);
    else if (id === "thermos") fireThermos(state);
    else if (id === "sticky_note") fireSticky(state);
    else fireGeneric(state);
  }

  function spawnEnemy(state) {
    const stage = state.stage;
    const side = Math.floor(Math.random() * 4);
    let x = side === 0 ? -30 : side === 1 ? W + 30 : Math.random() * W;
    let y = side === 2 ? -30 : side === 3 ? H + 30 : Math.random() * H;
    const boss = !!stage.boss && state.enemies.length === 0;
    const hp = boss ? stage.enemyHp : stage.enemyHp + Math.random() * state.stage.id * 4;
    state.enemies.push({
      id: "e" + Date.now() + "_" + Math.random().toString(16).slice(2),
      x,
      y,
      r: boss ? 28 : 13,
      hp,
      maxHp: hp,
      speed: boss ? stage.enemySpeed : stage.enemySpeed + Math.random() * 10,
      damage: boss ? 18 : 7,
      xp: boss ? 50 : 5,
      boss,
      dead: false,
      hitCooldown: 0,
      p0Marked: false
    });
  }

  function updateInput(state, dt) {
    const input = state.input;
    let x = 0;
    let y = 0;
    if (input.left) x -= 1;
    if (input.right) x += 1;
    if (input.up) y -= 1;
    if (input.down) y += 1;
    const len = Math.hypot(x, y) || 1;
    state.player.x = clamp(state.player.x + x / len * state.player.speed * dt, 26, W - 26);
    state.player.y = clamp(state.player.y + y / len * state.player.speed * dt, 26, H - 26);
    state.player.invuln = Math.max(0, state.player.invuln - dt);
  }

  function updateEnemies(state, dt) {
    const cap = state.stage.id >= 4 ? 95 : 75;
    for (const enemy of state.enemies) {
      if (enemy.dead) continue;
      const dx = state.player.x - enemy.x;
      const dy = state.player.y - enemy.y;
      const len = Math.hypot(dx, dy) || 1;
      enemy.x += dx / len * enemy.speed * dt;
      enemy.y += dy / len * enemy.speed * dt;
      enemy.hitCooldown = Math.max(0, enemy.hitCooldown - dt);
      if (Math.hypot(state.player.x - enemy.x, state.player.y - enemy.y) < state.player.radius + enemy.r && state.player.invuln <= 0) {
        let incoming = enemy.damage;
        const params = state.activeFormParams || {};
        if ((params.shield || 0) > 0) {
          const absorb = Math.min(params.shield, incoming);
          params.shield -= absorb;
          incoming -= absorb;
          addCircleEvent(state, state.player.x, state.player.y, 54, "#8fffe7", 0.24, "shield");
        }
        state.hp -= incoming;
        state.stats.damageTaken += incoming;
        state.player.invuln = 0.55;
        addParticle(state, state.player.x, state.player.y, "#ff6b4a", 8);
        if (state.hp <= 0) V2.dispatch({ type: "END_RUN" });
      }
    }
    state.enemies = state.enemies.filter(function (enemy) { return !enemy.dead; }).slice(-cap);
  }

  function updateProjectiles(state, dt) {
    for (const p of state.projectiles) {
      const target = state.enemies.find(function (enemy) { return enemy.id === p.targetId && !enemy.dead; }) || nearestEnemy(state, 999);
      if (!target) {
        p.life = 0;
        continue;
      }
      const dx = target.x - p.x;
      const dy = target.y - p.y;
      const len = Math.hypot(dx, dy) || 1;
      p.x += dx / len * p.speed * dt;
      p.y += dy / len * p.speed * dt;
      p.life -= dt;
      if (Math.hypot(p.x - target.x, p.y - target.y) < p.radius + target.r) {
        damageEnemy(state, target, p.damage, p.source, state.player);
        addParticle(state, p.x, p.y, p.color, 4);
        p.life = 0;
      }
    }
    state.projectiles = state.projectiles.filter(function (p) { return p.life > 0; });
  }

  function updateZones(state, dt) {
    for (const z of state.damageZones) {
      z.life -= dt;
      if (z.orbitPlayer) {
        z.orbitAngle = (z.orbitAngle || 0) + (z.orbitSpeed || 2) * dt;
        z.x = state.player.x + Math.cos(z.orbitAngle) * (z.orbitRadius || 80);
        z.y = state.player.y + Math.sin(z.orbitAngle) * (z.orbitRadius || 80);
      }
      if (z.seek) {
        const target = nearestEnemy(state, 999);
        if (target) {
          const dx = target.x - z.x;
          const dy = target.y - z.y;
          const len = Math.hypot(dx, dy) || 1;
          z.x += dx / len * (z.seekSpeed || 120) * dt;
          z.y += dy / len * (z.seekSpeed || 120) * dt;
        }
      }
      if (z.heal && Math.hypot(state.player.x - z.x, state.player.y - z.y) <= z.radius) {
        state.hp = Math.min(state.maxHp, state.hp + z.heal * dt);
        if (z.playerShield) {
          state.activeFormParams.shield = Math.min(60, (state.activeFormParams.shield || 0) + z.playerShield * dt);
        }
      }
      z.tick -= dt;
      if (z.tick > 0) continue;
      z.tick = z.tickEvery;
      if (z.type === "circle") {
        for (const enemy of state.enemies) {
          if (!enemy.dead && Math.hypot(enemy.x - z.x, enemy.y - z.y) <= z.radius + enemy.r) {
            if (z.debuff === "tea") {
              enemy.teaScent = { radius: z.teaRadius || 96, damage: z.teaDamage || 6 };
            }
            damageEnemy(state, enemy, z.damage, "zone", { x: z.x, y: z.y });
            if (z.slow) enemy.speed *= 1 - z.slow * 0.08;
            if (z.seekBounce && !z.bounced) {
              z.bounced = true;
              const next = state.enemies.find(function (candidate) {
                return !candidate.dead && candidate !== enemy && Math.hypot(candidate.x - enemy.x, candidate.y - enemy.y) < 180;
              });
              if (next) {
                addDamageZone(state, {
                  type: "circle",
                  x: enemy.x,
                  y: enemy.y,
                  radius: z.radius * 0.82,
                  damage: z.damage * 0.72,
                  life: 1.2,
                  maxLife: 1.2,
                  tickEvery: 0.28,
                  color: z.color,
                  slow: z.slow,
                  stickyTrap: true,
                  seek: true,
                  seekSpeed: z.seekSpeed,
                  visual: "seeking_note"
                });
              }
            }
          }
        }
      }
      if (z.type === "line") {
        lineHitEnemies(state, z.x1, z.y1, z.x2, z.y2, z.width || 8, z.damage, 99, "line_zone");
      }
    }
    state.damageZones = state.damageZones.filter(function (z) { return z.life > 0; });
  }

  function updatePickups(state, dt) {
    pickupMagnetTimer += dt;
    for (const p of state.pickups) {
      const d = Math.hypot(state.player.x - p.x, state.player.y - p.y);
      if (d < 150) {
        p.x += (state.player.x - p.x) * dt * 5;
        p.y += (state.player.y - p.y) * dt * 5;
      }
      if (d < state.player.radius + p.radius + 6) {
        p.dead = true;
        if (p.type === "xp") V2.dispatch({ type: "GAIN_XP", amount: p.amount });
        if (p.type === "material") {
          state.materials += p.amount;
          state.stats.materialsCollected += p.amount;
        }
      }
    }
    state.pickups = state.pickups.filter(function (p) { return !p.dead; });
  }

  function updateEffects(state, dt) {
    state.particles.forEach(function (p) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.life -= dt;
    });
    state.particles = state.particles.filter(function (p) { return p.life > 0; });
    state.formEvents.forEach(function (e) { e.life -= dt; });
    state.formEvents = state.formEvents.filter(function (e) { return e.life > 0; });
  }

  function update(dt) {
    const state = V2.getState();
    if (state.mode !== "combat") return;
    state.loop.updateCount += 1;
    state.totalTime += dt;
    if (state.warmupTime > 0) {
      state.warmupTime = Math.max(0, state.warmupTime - dt);
      updateInput(state, dt);
      return;
    }
    state.stageTime = Math.max(0, state.stageTime - dt);
    updateInput(state, dt);
    spawnTimer -= dt;
    if (spawnTimer <= 0 && state.enemies.length < (state.stage.boss ? 1 : 80)) {
      spawnEnemy(state);
      spawnTimer = state.stage.spawnEvery;
      if (state.stage.id >= 3 && !state.stage.boss && Math.random() < 0.25) spawnEnemy(state);
    }
    attackTimer -= dt;
    if (attackTimer <= 0) {
      fireWeapon(state);
      attackTimer = Math.max(0.25, state.activeFormParams.cooldown || 1.4);
    }
    updateSupportSkill(state, dt);
    updateProjectiles(state, dt);
    updateZones(state, dt);
    updateEnemies(state, dt);
    updatePickups(state, dt);
    updateEffects(state, dt);
    if (state.stageTime <= 0 || state.stageKills >= state.stage.targetKills) {
      V2.dispatch({ type: "COMPLETE_STAGE" });
    }
  }

  function drawBackground(ctx) {
    ctx.fillStyle = "#0b1521";
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.globalAlpha = 0.38;
    ctx.strokeStyle = "#234e5a";
    ctx.lineWidth = 1;
    for (let x = 40; x < W; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 38; y < H; y += 58) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = "#16333a";
    for (let i = 0; i < 80; i++) {
      const x = (i * 97) % W;
      const y = (i * 53) % H;
      ctx.fillRect(x, y, 18 + (i % 4) * 8, 3);
    }
    ctx.restore();
  }

  function drawPlayer(ctx, state) {
    const p = state.player;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#53ffe4";
    ctx.fillStyle = p.invuln > 0 ? "#ffe28a" : "#6fffe8";
    ctx.beginPath();
    ctx.arc(0, 0, p.radius + 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(-10, -14, 20, 26);
    ctx.fillStyle = "#f7d1a4";
    ctx.fillRect(-8, -24, 16, 14);
    ctx.fillStyle = "#202040";
    ctx.fillRect(-11, 10, 8, 14);
    ctx.fillRect(3, 10, 8, 14);
    ctx.restore();
  }

  function drawEnemies(ctx, state) {
    for (const e of state.enemies) {
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.shadowBlur = e.boss ? 24 : 8;
      ctx.shadowColor = e.boss ? "#ff6b4a" : "#ff4f6d";
      ctx.fillStyle = e.boss ? "#ff8a3d" : "#c82345";
      ctx.beginPath();
      ctx.arc(0, 0, e.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#240914";
      ctx.fillRect(-e.r * 0.6, -e.r * 0.25, e.r * 1.2, e.r * 0.35);
      if (e.p0Marked) {
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 3;
        ctx.strokeRect(-e.r - 4, -e.r - 4, e.r * 2 + 8, e.r * 2 + 8);
      }
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillRect(-e.r, -e.r - 9, e.r * 2, 3);
      ctx.fillStyle = "#4acf6a";
      ctx.fillRect(-e.r, -e.r - 9, e.r * 2 * clamp(e.hp / e.maxHp, 0, 1), 3);
      ctx.restore();
    }
  }

  function drawEffects(ctx, state) {
    for (const z of state.damageZones) {
      const a = clamp(z.life / z.maxLife, 0, 1);
      ctx.save();
      ctx.globalAlpha = Math.min(0.52, a * 0.42);
      ctx.strokeStyle = z.color;
      ctx.fillStyle = z.color;
      ctx.lineWidth = 2;
      if (z.type === "circle") {
        const zoneSprite = zoneSpriteFor(z.visual || "");
        if (zoneSprite) {
          const spriteAlpha = z.visual === "safe_station" || z.visual === "notice_board" ? 0.78 : 0.9;
          const visualSize = Math.max(42, Math.min(280, z.radius * 2.25));
          drawSprite(ctx, zoneSprite, z.x, z.y, visualSize, visualSize, spriteAlpha * Math.min(1, a + 0.22), ((z.x + z.y) % 31) * 0.01);
        }
        if (/note|board/.test(z.visual || "")) {
          const size = Math.max(22, Math.min(54, z.radius * 0.76));
          ctx.translate(z.x, z.y);
          ctx.rotate(((z.x + z.y) % 17 - 8) * 0.015);
          ctx.shadowBlur = 12;
          ctx.shadowColor = z.color;
          ctx.fillStyle = z.visual === "notice_board" ? "rgba(232,219,146,0.16)" : "rgba(134,247,255,0.16)";
          ctx.strokeStyle = z.color;
          ctx.lineWidth = 2;
          ctx.fillRect(-size / 2, -size / 2, size, size);
          ctx.strokeRect(-size / 2, -size / 2, size, size);
          ctx.globalAlpha *= 0.45;
          ctx.beginPath();
          ctx.arc(0, 0, z.radius, 0, Math.PI * 2);
          ctx.stroke();
        } else if (z.visual === "safe_station") {
          ctx.translate(z.x, z.y);
          ctx.shadowBlur = 16;
          ctx.shadowColor = z.color;
          ctx.strokeStyle = z.color;
          ctx.fillStyle = "rgba(191,238,255,0.08)";
          ctx.lineWidth = 3;
          ctx.strokeRect(-24, -18, 48, 36);
          ctx.fillRect(-24, -18, 48, 36);
          ctx.beginPath();
          ctx.arc(0, 0, z.radius, 0, Math.PI * 2);
          ctx.stroke();
        } else if (z.visual === "steam_drone") {
          ctx.translate(z.x, z.y);
          ctx.shadowBlur = 16;
          ctx.shadowColor = z.color;
          ctx.fillStyle = "rgba(157,248,255,0.28)";
          ctx.beginPath();
          ctx.arc(0, 0, 10 + 5 * Math.sin(a * Math.PI), 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = z.color;
          ctx.beginPath();
          ctx.arc(0, 0, z.radius, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha *= 0.24;
          ctx.fill();
        }
      } else if (z.type === "line") {
        const zoneSprite = zoneSpriteFor(z.visual || "");
        if (zoneSprite && drawLineSprite(ctx, zoneSprite, z.x1, z.y1, z.x2, z.y2, z.width || 8, Math.min(0.85, a + 0.12))) {
          ctx.globalAlpha *= 0.38;
        }
        ctx.lineWidth = z.width || 8;
        ctx.beginPath();
        ctx.moveTo(z.x1, z.y1);
        ctx.lineTo(z.x2, z.y2);
        ctx.stroke();
      }
      ctx.restore();
    }
    for (const e of state.formEvents) {
      const a = clamp(e.life / e.maxLife, 0, 1);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.shadowBlur = 22;
      ctx.shadowColor = e.color;
      ctx.strokeStyle = e.color;
      ctx.fillStyle = e.color;
      if (e.kind === "beam" || e.kind === "counter" || e.kind === "steam" || e.kind === "grid") {
        if (e.sprite && drawLineSprite(ctx, e.sprite, e.x1, e.y1, e.x2, e.y2, e.width || 5, Math.min(0.95, a + 0.08))) {
          ctx.globalAlpha *= 0.35;
        }
        ctx.lineCap = "round";
        ctx.lineWidth = (e.width || 5) + (e.kind === "steam" ? 18 : 10) * (1 - a);
        ctx.globalAlpha = a * (e.kind === "steam" ? 0.24 : 0.18);
        ctx.beginPath();
        ctx.moveTo(e.x1, e.y1);
        ctx.lineTo(e.x2, e.y2);
        ctx.stroke();
        ctx.globalAlpha = a;
        ctx.lineWidth = e.width || 5;
        ctx.beginPath();
        ctx.moveTo(e.x1, e.y1);
        ctx.lineTo(e.x2, e.y2);
        ctx.stroke();
      } else if (e.kind === "text") {
        ctx.shadowBlur = 10;
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(e.text, e.x, e.y - (1 - a) * 18);
      } else if (e.kind === "trap" || e.kind === "sticky_attach") {
        if (e.sprite) {
          const size = Math.max(42, e.radius * 1.45);
          drawSprite(ctx, e.sprite, e.x, e.y, size, size, Math.min(0.95, a + 0.08), (1 - a) * 0.18);
        }
        const r = e.radius * (1.05 - a * 0.05);
        ctx.translate(e.x, e.y);
        ctx.rotate((1 - a) * 0.4);
        ctx.lineWidth = 3;
        ctx.strokeRect(-r * 0.34, -r * 0.34, r * 0.68, r * 0.68);
        ctx.globalAlpha = a * 0.28;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
      } else if (e.kind === "station") {
        if (e.sprite) drawSprite(ctx, e.sprite, e.x, e.y, Math.max(140, e.radius * 2.1), Math.max(140, e.radius * 2.1), Math.min(0.86, a + 0.1), 0);
        const r = e.radius * (1.05 - a * 0.05);
        ctx.lineWidth = 4;
        ctx.strokeRect(e.x - 28, e.y - 22, 56, 44);
        ctx.beginPath();
        ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
        ctx.stroke();
      } else if (e.kind === "shield") {
        if (e.sprite) drawSprite(ctx, e.sprite, e.x, e.y, Math.max(90, e.radius * 2.1), Math.max(90, e.radius * 2.1), Math.min(0.86, a + 0.1), 0);
        const r = e.radius * (1.08 - a * 0.08);
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(e.x, e.y, r, -Math.PI * 0.15, Math.PI * 1.45);
        ctx.stroke();
      } else if (e.kind === "sticky_spread") {
        if (e.sprite) drawSprite(ctx, e.sprite, e.x, e.y, Math.max(90, e.radius * 1.9), Math.max(90, e.radius * 1.9), Math.min(0.85, a + 0.08), (1 - a) * 0.3);
        const r = e.radius * (1.18 - a * 0.18);
        ctx.lineWidth = 3;
        for (let i = 0; i < 6; i++) {
          const ang = Math.PI * 2 * i / 6 + (1 - a) * 0.8;
          ctx.beginPath();
          ctx.moveTo(e.x, e.y);
          ctx.lineTo(e.x + Math.cos(ang) * r, e.y + Math.sin(ang) * r);
          ctx.stroke();
        }
      } else {
        if (e.sprite) drawSprite(ctx, e.sprite, e.x, e.y, Math.max(54, e.radius * 2.3), Math.max(54, e.radius * 2.3), Math.min(0.9, a + 0.08), 0);
        const r = e.radius * (1.15 - a * 0.15);
        ctx.lineWidth = e.kind === "mark" ? 3 : 6;
        ctx.beginPath();
        ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
        ctx.stroke();
        if (e.kind === "blast") {
          ctx.globalAlpha = a * 0.22;
          ctx.fill();
        }
      }
      ctx.restore();
    }
    for (const p of state.projectiles) {
      ctx.save();
      ctx.shadowBlur = 16;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    for (const p of state.pickups) {
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    for (const p of state.particles) {
      ctx.save();
      ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      ctx.restore();
    }
  }

  function draw() {
    if (!ctx) return;
    const state = V2.getState();
    drawBackground(ctx);
    drawEffects(ctx, state);
    drawEnemies(ctx, state);
    drawPlayer(ctx, state);
  }

  function frame(now) {
    const state = V2.getState();
    if (!state.loop.running) return;
    if (!state.loop.lastFrameAt) state.loop.lastFrameAt = now;
    let dt = Math.min(0.1, (now - state.loop.lastFrameAt) / 1000);
    state.loop.lastFrameAt = now;
    state.loop.avgFrameMs = state.loop.avgFrameMs * 0.92 + dt * 1000 * 0.08;
    state.loop.accumulator += dt;
    let guard = 0;
    while (state.loop.accumulator >= STEP && guard < 5) {
      try {
        update(STEP);
      } catch (err) {
        V2.reportError(err);
      }
      state.loop.accumulator -= STEP;
      guard += 1;
    }
    state.loop.frameCount += 1;
    draw();
    if (V2.ui && state.loop.frameCount % 6 === 0) V2.ui.render();
    state.loop.raf = window.requestAnimationFrame(frame);
  }

  function fallbackTick() {
    const state = V2.getState();
    if (!state.loop.running) return;
    const now = performance.now ? performance.now() : Date.now();
    if (state.loop.lastFrameAt && now - state.loop.lastFrameAt < 80) return;
    if (!state.loop.fallbackLastAt) state.loop.fallbackLastAt = now;
    let dt = Math.min(0.08, (now - state.loop.fallbackLastAt) / 1000 || STEP);
    state.loop.fallbackLastAt = now;
    state.loop.avgFrameMs = state.loop.avgFrameMs * 0.9 + dt * 1000 * 0.1;
    let guard = 0;
    while (dt > 0 && guard < 5) {
      const step = Math.min(STEP, dt);
      try {
        update(step);
      } catch (err) {
        V2.reportError(err);
      }
      dt -= step;
      guard += 1;
    }
    draw();
    if (V2.ui) V2.ui.render();
  }

  function bindInput() {
    window.addEventListener("keydown", function (event) {
      const state = V2.getState();
      if (event.key === "w" || event.key === "W" || event.key === "ArrowUp") state.input.up = true;
      if (event.key === "s" || event.key === "S" || event.key === "ArrowDown") state.input.down = true;
      if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") state.input.left = true;
      if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") state.input.right = true;
      if (event.key === "b" || event.key === "B" || event.key === "Tab") {
        const panel = document.getElementById("buildPanel");
        if (panel) panel.classList.toggle("collapsed");
        event.preventDefault();
      }
      if (event.key === "Escape") V2.dispatch({ type: state.mode === "paused" ? "RESUME" : "PAUSE" });
    });
    window.addEventListener("keyup", function (event) {
      const state = V2.getState();
      if (event.key === "w" || event.key === "W" || event.key === "ArrowUp") state.input.up = false;
      if (event.key === "s" || event.key === "S" || event.key === "ArrowDown") state.input.down = false;
      if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") state.input.left = false;
      if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") state.input.right = false;
    });
  }

  function mount(targetCanvas) {
    canvas = targetCanvas;
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    loadVfxImages();
    bindInput();
  }

  function startLoop() {
    const state = V2.getState();
    if (state.loop.running) return;
    state.loop.running = true;
    state.loop.lastFrameAt = 0;
    state.loop.fallbackLastAt = 0;
    state.loop.raf = window.requestAnimationFrame(frame);
    state.loop.interval = window.setInterval(fallbackTick, 33);
  }

  function stopLoop() {
    const state = V2.getState();
    state.loop.running = false;
    if (state.loop.raf) window.cancelAnimationFrame(state.loop.raf);
    if (state.loop.interval) window.clearInterval(state.loop.interval);
    state.loop.interval = 0;
  }

  V2.combat = {
    mount,
    startLoop,
    stopLoop,
    update,
    draw,
    fireWeapon,
    spawnEnemy
  };
})();
