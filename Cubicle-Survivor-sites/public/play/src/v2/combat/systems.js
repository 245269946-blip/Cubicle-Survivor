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
  const RUNTIME_SPRITES = {
    office_atlas: "assets/office-rogue-atlas.png",
    office_arena_night: "assets/generated-backgrounds/office-arena-night.png",
    combat_health_track_office: "assets/generated-ui-v2/combat-health-track-office.png",
    combat_health_fill_office: "assets/generated-ui-v2/combat-health-fill-office.png",
    marker_beam_art: "assets/generated-vfx/sprites/marker-line-office-v2.png",
    marker_branch_art: "assets/generated-vfx/sprites/marker-branch-office-v2.png",
    marker_impact_art: "assets/generated-vfx/sprites/marker-impact-office-v2.png",
    marker_grid_art: "assets/generated-vfx/sprites/marker-grid-field-office-v2.png",
    marker_ink_art: "assets/generated-vfx/sprites/marker-ink-trail-office-v2.svg",
    marker_wave_art: "assets/generated-vfx/sprites/marker-wave-office-v2.png",
    thermos_steam_art: "assets/generated-vfx/sprites/thermos-steam-line-office-v2.png",
    thermos_charge_art: "assets/generated-vfx/sprites/thermos-charge-gauge-office-v2.png",
    thermos_release_art: "assets/generated-vfx/sprites/thermos-release-office-v2.png",
    thermos_wave_art: "assets/generated-vfx/sprites/thermos-wave-office-v2.png",
    thermos_body_v24: "assets/generated-vfx/sprites/thermos-body-v24.png",
    thermos_fan_v24: "assets/generated-vfx/sprites/thermos-fan-v24-sheet.png",
    thermos_condensation_v24: "assets/generated-vfx/sprites/thermos-condensation-v24-sheet.png",
    thermos_focus_v24: "assets/generated-vfx/sprites/thermos-focus-v24-sheet.png",
    thermos_heatwave_v24: "assets/generated-vfx/sprites/thermos-heatwave-v24-sheet.png",
    sticky_trap_art: "assets/v2-weapon-vfx/sprites/sticky_note_v2.png",
    sticky_seek_art: "assets/generated-vfx/sprites/sticky-seek-office-v2.png",
    sticky_burst_art: "assets/generated-vfx/sprites/sticky-burst-office-v2.png",
    sticky_control_art: "assets/generated-vfx/sprites/sticky-control-office-v2.png",
    sticky_link_line_art: "assets/generated-vfx/sprites/sticky-link-line-office-v2.png",
    scissors_v23: "assets/generated-vfx/sprites/scissors-v23.png",
    scissors_dash_v24: "assets/generated-vfx/sprites/scissors-dash-v24-sheet.png",
    scissors_slash_v24: "assets/generated-vfx/sprites/scissors-slash-v24-sheet.png",
    scissors_thrust_v24: "assets/generated-vfx/sprites/scissors-thrust-v24-sheet.png",
    scissors_shelter_v24: "assets/generated-vfx/sprites/scissors-shelter-v24-sheet.png",
    scissors_strike_v27: "assets/generated-vfx/sprites/scissors-strike-v27-sheet.png",
    scissors_shelter_v27: "assets/generated-vfx/sprites/scissors-shelter-v27-sheet.png",
    scissors_dash_direction_v27: "assets/generated-vfx/sprites/scissors-dash-direction-v27-sheet.png",
    scissors_person_pivot_rig_v39: "assets/generated-vfx/sprites/scissors-person-pivot-rig-directions-v39.png",
    scissors_complete_directions_v39: "assets/generated-vfx/sprites/scissors-complete-directions-v39.png",
    scissors_cut_routes_v39: "assets/generated-vfx/sprites/scissors-cut-routes-v39.png",
    correction_fluid_body_v25: "assets/generated-vfx/sprites/correction-fluid-body-v25.png",
    correction_fluid_spray_v25: "assets/generated-vfx/sprites/correction-fluid-spray-v25-sheet.png",
    correction_fluid_error_v25: "assets/generated-vfx/sprites/correction-fluid-error-v25-sheet.png",
    correction_fluid_area_v25: "assets/generated-vfx/sprites/correction-fluid-area-v25-sheet.png",
    correction_fluid_crash_v25: "assets/generated-vfx/sprites/correction-fluid-crash-v25-sheet.png",
    correction_fluid_glitch_v25: "assets/generated-vfx/sprites/correction-fluid-glitch-v25-sheet.png",
    correction_fluid_final_v25: "assets/generated-vfx/sprites/correction-fluid-final-v25-sheet.png",
    correction_person_reservoir_v39: "assets/generated-vfx/sprites/correction-person-reservoir-directions-v39.png",
    correction_nozzle_directions_v39: "assets/generated-vfx/sprites/correction-nozzle-directions-v39.png",
    correction_route_mutations_v39: "assets/generated-vfx/sprites/correction-route-mutations-v39.png",
    correction_spray_error_v39: "assets/generated-vfx/sprites/correction-spray-error-v39.png",
    marker_person_printer_rig_v5: "assets/generated-vfx/sprites/marker-person-printer-rig-directions-v5.png",
    marker_weapon_directions_v4: "assets/generated-vfx/sprites/marker-weapon-directions-v4.png",
    marker_growth_parts: "assets/generated-vfx/sprites/marker-growth-parts.svg",
    thermos_person_pressure_rig_v1: "assets/generated-vfx/sprites/thermos-person-pressure-rig-directions-v1.png",
    thermos_weapon_directions_v1: "assets/generated-vfx/sprites/thermos-weapon-directions-v1.png",
    thermos_route_packs_v2: "assets/generated-vfx/sprites/thermos-route-packs-directions-v2.png",
    thermos_backpressure_half_ring_v38: "assets/generated-vfx/sprites/thermos-backpressure-half-ring-v38-sheet.png",
    status_shield_art: "assets/generated-vfx/sprites/status-shield-office-v2.png",
    status_root_art: "assets/generated-vfx/sprites/status-root-office-v2.png",
    status_mark_art: "assets/generated-vfx/sprites/status-mark-office-v2.png",
    enemy_projectile_art: "assets/generated-vfx/sprites/enemy-projectile-office-v2.png",
    thermos_drone_v2: "assets/v2-weapon-vfx/sprites/thermos_drone_v2.png",
    thermos_station_v2: "assets/v2-weapon-vfx/sprites/thermos_station_v2.png",
    sticky_note_v2: "assets/v2-weapon-vfx/sprites/sticky_note_v2.png"
  };
  const FORM_RESOURCE_SOURCES = {
    line_split: ["marker_split", "marker_secondary_split", "marker_fullscreen"],
    mark_detonate: ["marker_p0_blast"],
    shield_counter_line: ["marker_counter"],
    line_to_wave: ["marker_wave", "marker_wave_return"],
    line_grid_field: ["marker_grid_line", "marker_grid_field"],
    patrol_summon_steam: ["thermos_drone_steam"],
    charge_release_beam: ["thermos_release"],
    shield_break_pulse: ["thermos_shield_break"],
    periodic_wave_spread: ["thermos_tea_echo"],
    deployable_safe_station: ["thermos_station"],
    seeking_trap_summon: ["sticky_seeking_hit", "sticky_seeking_bounce"],
    manual_trap_detonate: ["sticky_sync_blast"],
    route_buff_trap: ["sticky_route"],
    sticky_debuff_spread: ["sticky_spread"],
    trap_link_control_zone: ["sticky_link_line", "sticky_notice_zone"]
  };
  const runtimeImages = {};
  const markerEmbodimentAssets = {
    riggedPersonVisuals: [],
    weaponCells: [],
    partCells: []
  };
  const thermosEmbodimentAssets = {
    riggedPersonVisuals: [],
    weaponCells: [],
    routeCells: [],
    backPressureCells: []
  };
  const scissorsEmbodimentAssets = {
    personCells: [],
    weaponCells: []
  };
  const correctionEmbodimentAssets = {
    personCells: [],
    nozzleCells: [],
    routeCells: []
  };
  const ENEMY_ATLAS_CELLS = {
    todo: [2, 0],
    email: [1, 0],
    meeting: [3, 0],
    ping: [1, 3],
    deadline: [0, 1],
    scope: [3, 2],
    approval: [1, 1],
    client: [2, 1],
    lead: [3, 0],
    director: [1, 1],
    delivery: [0, 1],
    ceo: [2, 0]
  };
  const ENEMY_DEFS = {
    todo: { name: "待办便签", behavior: "chase", hp: 1, speed: 1, damage: 7, radius: 13, xp: 5, color: "#c82345", accent: "#ff6b8a" },
    email: { name: "未读邮件", behavior: "zigzag", hp: 0.72, speed: 1.28, damage: 6, radius: 11, xp: 5, color: "#cf3fcf", accent: "#ff8aff" },
    meeting: { name: "临时会议", behavior: "tank", hp: 1.45, speed: 0.74, damage: 9, radius: 17, xp: 7, color: "#a83250", accent: "#ffc26b" },
    ping: { name: "群消息轰炸", behavior: "shooter", hp: 0.82, speed: 0.78, damage: 6.5, radius: 12, xp: 6, color: "#a943d6", accent: "#d78cff", shootEvery: 2.35, projectileSpeed: 240 },
    deadline: { name: "截止日期", behavior: "charger", hp: 1.04, speed: 1.08, damage: 12, radius: 13, xp: 7, color: "#e44b3f", accent: "#ffd36a", chargeEvery: 2.6, chargeSpeed: 265 },
    scope: { name: "需求变更", behavior: "splitter", hp: 1.18, speed: 0.84, damage: 8, radius: 15, xp: 7, color: "#3d9bd6", accent: "#91e6ff", splitType: "todo" },
    approval: { name: "审批流", behavior: "shield", hp: 1.38, speed: 0.7, damage: 10, radius: 16, xp: 8, color: "#6d6f8f", accent: "#d9e6ff", armor: 0.28 },
    client: { name: "客户追问", behavior: "shooter", hp: 1.02, speed: 0.92, damage: 10, radius: 14, xp: 8, color: "#d65a8d", accent: "#ffb0d0", shootEvery: 2.05, projectileSpeed: 275 }
  };
  const BOSS_DEFS = {
    lead: { name: "实习导师", behavior: "boss", color: "#ff8a3d", accent: "#ffd36a", shootEvery: 2.8 },
    director: { name: "部门总监", behavior: "boss_shield", color: "#ff6b4a", accent: "#d9e6ff", armor: 0.26, shootEvery: 2.7 },
    delivery: { name: "独立交付", behavior: "boss_charger", color: "#ff763d", accent: "#ffe28a", chargeEvery: 3.1, chargeSpeed: 255 },
    client: { name: "大客户追问", behavior: "boss_shooter", color: "#e05a98", accent: "#ffc2df", shootEvery: 1.75, projectileSpeed: 285 },
    ceo: { name: "老板最终确认", behavior: "boss_final", color: "#ff5d3d", accent: "#ffe28a", armor: 0.18, shootEvery: 1.8, chargeEvery: 4.2, chargeSpeed: 250 }
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function worldWidth(state) {
    return state.world && state.world.width ? state.world.width : W;
  }

  function worldHeight(state) {
    return state.world && state.world.height ? state.world.height : H;
  }

  function updateCamera(state) {
    if (!state.camera) state.camera = { x: 0, y: 0, width: W, height: H };
    state.camera.width = W;
    state.camera.height = H;
    state.camera.x = clamp(state.player.x - W / 2, 0, Math.max(0, worldWidth(state) - W));
    state.camera.y = clamp(state.player.y - H / 2, 0, Math.max(0, worldHeight(state) - H));
  }

  function dist(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function nearestEnemy(state, range) {
    if (state.stage && state.stage.boss) {
      const boss = state.enemies.find(function (enemy) {
        return enemy.boss && !enemy.dead && (!range || dist(state.player, enemy) <= range);
      });
      if (boss) return boss;
    }
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
    Object.keys(RUNTIME_SPRITES).forEach(function (id) {
      if (runtimeImages[id]) return;
      const img = new Image();
      img.onload = function () {
        if (id === "marker_person_printer_rig_v5" || id === "marker_weapon_directions_v4" || id === "marker_growth_parts") {
          prepareMarkerEmbodimentAssets();
        }
        if (id === "thermos_person_pressure_rig_v1" || id === "thermos_weapon_directions_v1" || id === "thermos_route_packs_v2" || id === "thermos_backpressure_half_ring_v38") {
          prepareThermosEmbodimentAssets();
        }
        if (id === "scissors_person_pivot_rig_v39" || id === "scissors_complete_directions_v39") {
          prepareScissorsEmbodimentAssets();
        }
        if (id === "correction_person_reservoir_v39" || id === "correction_nozzle_directions_v39" || id === "correction_route_mutations_v39") {
          prepareCorrectionEmbodimentAssets();
        }
        const state = V2.getState();
        if (state && state.loop && !state.loop.running) draw();
      };
      img.src = RUNTIME_SPRITES[id];
      runtimeImages[id] = img;
    });
  }

  function alphaCropCanvas(image, threshold) {
    if (!image || !image.width) return null;
    const probe = document.createElement("canvas");
    probe.width = image.width;
    probe.height = image.height;
    const probeCtx = probe.getContext("2d", { willReadFrequently: true });
    probeCtx.drawImage(image, 0, 0);
    const pixels = probeCtx.getImageData(0, 0, probe.width, probe.height).data;
    let minX = probe.width;
    let minY = probe.height;
    let maxX = -1;
    let maxY = -1;
    const floor = threshold == null ? 10 : threshold;
    for (let y = 0; y < probe.height; y += 1) {
      for (let x = 0; x < probe.width; x += 1) {
        if (pixels[(y * probe.width + x) * 4 + 3] < floor) continue;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
    if (maxX < minX || maxY < minY) return null;
    const out = document.createElement("canvas");
    out.width = maxX - minX + 1;
    out.height = maxY - minY + 1;
    out.getContext("2d").drawImage(probe, minX, minY, out.width, out.height, 0, 0, out.width, out.height);
    return out;
  }

  function sliceAlphaAtlas(image, columns, rows) {
    if (!image || !image.naturalWidth) return [];
    const sourceWidth = Math.floor(image.naturalWidth / columns);
    const sourceHeight = Math.floor(image.naturalHeight / rows);
    const cells = [];
    for (let index = 0; index < columns * rows; index++) {
      const cell = document.createElement("canvas");
      cell.width = sourceWidth;
      cell.height = sourceHeight;
      cell.getContext("2d").drawImage(
        image,
        index % columns * sourceWidth,
        Math.floor(index / columns) * sourceHeight,
        sourceWidth,
        sourceHeight,
        0,
        0,
        sourceWidth,
        sourceHeight
      );
      const cropped = alphaCropCanvas(cell, 10);
      if (cropped) cells.push(cropped);
    }
    return cells;
  }

  function markerRouteRegionAllows(family, facing, x, width) {
    const ratio = x / Math.max(1, width);
    if (family === "archive") {
      if (facing === 3) return false;
      return ratio < (facing === 1 ? 0.62 : 0.46);
    }
    if (facing === 1) return false;
    return ratio > (facing === 3 ? 0.42 : 0.54);
  }

  function markerRoutePixelFamily(red, green, blue, x, width, facing) {
    const archive = markerRouteRegionAllows("archive", facing, x, width)
      && green > 105 && blue > 120 && green > red * 1.28 && blue > red * 1.35;
    if (archive) return "archive";
    const copy = markerRouteRegionAllows("copy", facing, x, width)
      && red > 145 && green > 88 && blue < green * 0.72 && red > blue * 1.65;
    return copy ? "copy" : null;
  }

  function makeMarkerRiggedRouteVisuals(image, facing) {
    if (!image) return null;
    const base = document.createElement("canvas");
    const copy = document.createElement("canvas");
    const archive = document.createElement("canvas");
    [base, copy, archive].forEach(function (surface) {
      surface.width = image.width;
      surface.height = image.height;
    });
    const baseCtx = base.getContext("2d", { willReadFrequently: true });
    baseCtx.drawImage(image, 0, 0);
    const basePixels = baseCtx.getImageData(0, 0, base.width, base.height);
    const copyPixels = copy.getContext("2d").createImageData(base.width, base.height);
    const archivePixels = archive.getContext("2d").createImageData(base.width, base.height);
    for (let y = 0; y < base.height; y += 1) {
      for (let x = 0; x < base.width; x += 1) {
        const offset = (y * base.width + x) * 4;
        const alpha = basePixels.data[offset + 3];
        if (!alpha) continue;
        const family = markerRoutePixelFamily(
          basePixels.data[offset],
          basePixels.data[offset + 1],
          basePixels.data[offset + 2],
          x,
          base.width,
          facing
        );
        if (!family) continue;
        const target = family === "copy" ? copyPixels.data : archivePixels.data;
        target[offset] = basePixels.data[offset];
        target[offset + 1] = basePixels.data[offset + 1];
        target[offset + 2] = basePixels.data[offset + 2];
        target[offset + 3] = alpha;
        basePixels.data[offset] = Math.round(basePixels.data[offset] * 0.34);
        basePixels.data[offset + 1] = Math.round(basePixels.data[offset + 1] * 0.34);
        basePixels.data[offset + 2] = Math.round(basePixels.data[offset + 2] * 0.34);
      }
    }
    baseCtx.putImageData(basePixels, 0, 0);
    copy.getContext("2d").putImageData(copyPixels, 0, 0);
    archive.getContext("2d").putImageData(archivePixels, 0, 0);
    return { base, copy, archive };
  }

  function prepareMarkerEmbodimentAssets() {
    const rig = runtimeImages.marker_person_printer_rig_v5;
    const weapons = runtimeImages.marker_weapon_directions_v4;
    const parts = runtimeImages.marker_growth_parts;
    if (rig && rig.complete && rig.naturalWidth > 0 && !markerEmbodimentAssets.riggedPersonVisuals.length) {
      markerEmbodimentAssets.riggedPersonVisuals = sliceAlphaAtlas(rig, 4, 1).map(function (cell, facing) {
        return makeMarkerRiggedRouteVisuals(cell, facing);
      });
    }
    if (weapons && weapons.complete && weapons.naturalWidth > 0 && !markerEmbodimentAssets.weaponCells.length) {
      markerEmbodimentAssets.weaponCells = sliceAlphaAtlas(weapons, 4, 2);
    }
    if (parts && parts.complete && parts.naturalWidth > 0 && !markerEmbodimentAssets.partCells.length) {
      markerEmbodimentAssets.partCells = sliceAlphaAtlas(parts, 6, 1);
    }
  }

  function thermosRoutePixelFamily(red, green, blue, x, width) {
    const ratio = x / Math.max(1, width);
    const condensation = ratio < 0.49 && green > 105 && blue > 118
      && green > red * 1.24 && blue > red * 1.32;
    if (condensation) return "condensation";
    const heatwave = ratio > 0.51 && red > 140 && green > 72 && blue < green * 0.72
      && red > blue * 1.72;
    return heatwave ? "heatwave" : null;
  }

  function makeThermosRiggedRouteVisuals(image) {
    if (!image) return null;
    const base = document.createElement("canvas");
    const condensation = document.createElement("canvas");
    const heatwave = document.createElement("canvas");
    [base, condensation, heatwave].forEach(function (surface) {
      surface.width = image.width;
      surface.height = image.height;
    });
    const baseCtx = base.getContext("2d", { willReadFrequently: true });
    baseCtx.drawImage(image, 0, 0);
    const basePixels = baseCtx.getImageData(0, 0, base.width, base.height);
    const condensationPixels = condensation.getContext("2d").createImageData(base.width, base.height);
    const heatwavePixels = heatwave.getContext("2d").createImageData(base.width, base.height);
    for (let y = 0; y < base.height; y += 1) {
      for (let x = 0; x < base.width; x += 1) {
        const offset = (y * base.width + x) * 4;
        const alpha = basePixels.data[offset + 3];
        if (!alpha) continue;
        const family = thermosRoutePixelFamily(
          basePixels.data[offset],
          basePixels.data[offset + 1],
          basePixels.data[offset + 2],
          x,
          base.width
        );
        if (!family) continue;
        const target = family === "condensation" ? condensationPixels.data : heatwavePixels.data;
        target[offset] = basePixels.data[offset];
        target[offset + 1] = basePixels.data[offset + 1];
        target[offset + 2] = basePixels.data[offset + 2];
        target[offset + 3] = alpha;
        basePixels.data[offset] = Math.round(basePixels.data[offset] * 0.32);
        basePixels.data[offset + 1] = Math.round(basePixels.data[offset + 1] * 0.32);
        basePixels.data[offset + 2] = Math.round(basePixels.data[offset + 2] * 0.32);
      }
    }
    baseCtx.putImageData(basePixels, 0, 0);
    condensation.getContext("2d").putImageData(condensationPixels, 0, 0);
    heatwave.getContext("2d").putImageData(heatwavePixels, 0, 0);
    return { base, condensation, heatwave };
  }

  function prepareThermosEmbodimentAssets() {
    const rig = runtimeImages.thermos_person_pressure_rig_v1;
    const weapons = runtimeImages.thermos_weapon_directions_v1;
    const routeAddons = runtimeImages.thermos_route_packs_v2;
    const backPressure = runtimeImages.thermos_backpressure_half_ring_v38;
    if (rig && rig.complete && rig.naturalWidth > 0 && !thermosEmbodimentAssets.riggedPersonVisuals.length) {
      thermosEmbodimentAssets.riggedPersonVisuals = sliceAlphaAtlas(rig, 4, 1).map(function (cell) {
        return makeThermosRiggedRouteVisuals(cell);
      });
    }
    if (weapons && weapons.complete && weapons.naturalWidth > 0 && !thermosEmbodimentAssets.weaponCells.length) {
      thermosEmbodimentAssets.weaponCells = sliceAlphaAtlas(weapons, 4, 2);
    }
    if (routeAddons && routeAddons.complete && routeAddons.naturalWidth > 0 && !thermosEmbodimentAssets.routeCells.length) {
      thermosEmbodimentAssets.routeCells = sliceAlphaAtlas(routeAddons, 4, 2);
    }
    if (backPressure && backPressure.complete && backPressure.naturalWidth > 0 && !thermosEmbodimentAssets.backPressureCells.length) {
      thermosEmbodimentAssets.backPressureCells = sliceAlphaAtlas(backPressure, 4, 2);
    }
  }

  function prepareScissorsEmbodimentAssets() {
    const person = runtimeImages.scissors_person_pivot_rig_v39;
    const weapon = runtimeImages.scissors_complete_directions_v39;
    if (person && person.complete && person.naturalWidth > 0 && !scissorsEmbodimentAssets.personCells.length) {
      scissorsEmbodimentAssets.personCells = sliceAlphaAtlas(person, 4, 1);
    }
    if (weapon && weapon.complete && weapon.naturalWidth > 0 && !scissorsEmbodimentAssets.weaponCells.length) {
      scissorsEmbodimentAssets.weaponCells = sliceAlphaAtlas(weapon, 4, 2);
    }
  }

  function prepareCorrectionEmbodimentAssets() {
    const person = runtimeImages.correction_person_reservoir_v39;
    const nozzle = runtimeImages.correction_nozzle_directions_v39;
    const routes = runtimeImages.correction_route_mutations_v39;
    if (person && person.complete && person.naturalWidth > 0 && !correctionEmbodimentAssets.personCells.length) {
      correctionEmbodimentAssets.personCells = sliceAlphaAtlas(person, 4, 1);
    }
    if (nozzle && nozzle.complete && nozzle.naturalWidth > 0 && !correctionEmbodimentAssets.nozzleCells.length) {
      correctionEmbodimentAssets.nozzleCells = sliceAlphaAtlas(nozzle, 4, 2);
    }
    if (routes && routes.complete && routes.naturalWidth > 0 && !correctionEmbodimentAssets.routeCells.length) {
      correctionEmbodimentAssets.routeCells = sliceAlphaAtlas(routes, 4, 2);
    }
  }

  function isSpriteReady(id) {
    const img = runtimeImages[id];
    return !!(img && img.complete && img.naturalWidth > 0);
  }

  function drawSprite(ctx, id, x, y, width, height, alpha, rotation) {
    if (!isSpriteReady(id)) return false;
    const img = runtimeImages[id];
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

  function generatedEffectSprite(profile, source, kind, visual) {
    const key = [source || "", kind || "", visual || "", profile && profile.family || "", profile && profile.topology || ""].join(" ");
    if (/shield/.test(key)) return "status_shield_art";
    if (/root/.test(key)) return "status_root_art";
    if (/target_mark|control_mark|p0_mark|priority_pin|marked/.test(key)) return "status_mark_art";
    if (/sticky|trap|note|notice|route/.test(key)) {
      if (/notice_node|notice_trap|placed_trap/.test(key)) return "sticky_trap_art";
      if (/link|polygon|field|notice/.test(key)) return "sticky_control_art";
      if (/seek|trail/.test(key)) return "sticky_seek_art";
      if (/blast|spread|detonate|impact/.test(key)) return "sticky_burst_art";
      return "sticky_trap_art";
    }
    if (/thermos|steam|tea|heat|boil|station/.test(key)) {
      if (/wave|ring|echo/.test(key)) return "thermos_wave_art";
      if (/charge|heat/.test(key)) return "thermos_charge_art";
      if (/release|blast|boil|detonate/.test(key)) return "thermos_release_art";
      return "thermos_steam_art";
    }
    if (/wave|ring/.test(key)) return "marker_wave_art";
    if (/grid|residual/.test(key)) return "marker_grid_art";
    if (/branch|split|secondary/.test(key)) return "marker_branch_art";
    if (/impact|blast|detonate|hit/.test(key)) return "marker_impact_art";
    return "marker_beam_art";
  }

  function drawGeneratedLine(ctx, sprite, x1, y1, x2, y2, width, alpha) {
    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const isStickyString = sprite === "sticky_link_line_art";
    const spriteWidth = isStickyString ? Math.max(28, length + 6) : Math.max(72, length + 24);
    const spriteHeight = isStickyString ? Math.max(10, (width || 6) * 1.8) : Math.max(44, (width || 6) * 8);
    return drawSprite(ctx, sprite, x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2, spriteWidth, spriteHeight, alpha, angle);
  }

  function generatedLineSprite(profile, fallback) {
    if (profile && profile.family === "marker") return "marker_beam_art";
    if (profile && profile.family === "thermos") return "thermos_steam_art";
    if (profile && profile.family === "sticky_note") return "sticky_link_line_art";
    return fallback;
  }

  function drawGeneratedStatusSprite(ctx, sprite, x, y, radius, alpha) {
    if (sprite === "status_shield_art") {
      const size = clamp((radius || 44) * 1.08, 82, 112);
      drawSprite(ctx, sprite, x, y, size, size, Math.min(0.76, alpha), 0);
      return true;
    }
    if (sprite === "status_mark_art") {
      const size = clamp((radius || 40) * 0.92, 58, 84);
      drawSprite(ctx, sprite, x, y - 2, size, size, Math.min(0.82, alpha), 0);
      return true;
    }
    if (sprite === "status_root_art") {
      const width = clamp((radius || 40) * 1.04, 60, 94);
      drawSprite(ctx, sprite, x, y + width * 0.18, width, width * 0.441, Math.min(0.82, alpha), 0);
      return true;
    }
    return false;
  }

  function drawGeneratedMechanicSprite(ctx, sprite, source, kind, visual, x, y, radius, alpha, progress) {
    if (sprite === "marker_branch_art") {
      const size = clamp((radius || 36) * 4.6, 180, 240);
      drawSprite(ctx, sprite, x, y, size, size, Math.min(0.84, alpha), 0);
      return true;
    }
    if (sprite === "marker_wave_art") {
      const size = clamp((radius || 24) * 2.66, 56, 520);
      drawSprite(ctx, sprite, x, y, size, size, Math.min(0.74, alpha), (progress || 0) * 0.04);
      return true;
    }
    if (sprite === "thermos_wave_art") {
      const size = clamp((radius || 28) * 2.4, 72, 500);
      drawSprite(ctx, sprite, x, y, size, size, Math.min(0.66, alpha), (progress || 0) * 0.03);
      return true;
    }
    if (sprite === "marker_grid_art") {
      const size = clamp((radius || 48) * 2.35, 220, 260);
      drawSprite(ctx, sprite, x, y, size, size, Math.min(0.9, alpha), 0);
      return true;
    }
    if (sprite === "sticky_trap_art" || sprite === "sticky_note_v2") {
      const size = clamp((radius || 26) * 1.15, 34, 48);
      drawSprite(ctx, sprite, x, y, size, size, Math.min(0.92, alpha), 0);
      return true;
    }
    if (sprite === "sticky_burst_art") {
      const size = clamp((radius || 38) * 2.15, 72, 220);
      drawSprite(ctx, sprite, x, y, size, size, Math.min(0.78, alpha), (progress || 0) * 0.06);
      return true;
    }
    if (sprite === "sticky_seek_art") {
      const width = clamp((radius || 24) * 2.05, 42, 58);
      drawSprite(ctx, sprite, x, y, width, width * 0.487, Math.min(0.92, alpha), 0);
      return true;
    }
    if (sprite === "thermos_charge_art") {
      const size = clamp((radius || 48) * 1.06, 84, 112);
      drawSprite(ctx, sprite, x, y, size, size, Math.min(0.76, alpha), 0);
      return true;
    }
    if (sprite !== "thermos_release_art") return false;
    const key = [source || "", kind || "", visual || ""].join(" ");
    const compact = /secondary|mini|impact|hit/.test(key);
    const size = compact
      ? clamp((radius || 40) * 1.02, 54, 82)
      : clamp((radius || 48) * 1.18, 72, 120);
    drawSprite(ctx, sprite, x, y, size, size, Math.min(0.84, alpha), (progress || 0) * 0.04);
    return true;
  }

  function drawCanvasSprite(ctx, image, x, y, width, height, alpha, rotation, filter, composite) {
    if (!image || !image.width) return false;
    ctx.save();
    ctx.globalAlpha *= alpha == null ? 1 : alpha;
    ctx.globalCompositeOperation = composite || "source-over";
    ctx.filter = filter || "none";
    ctx.translate(x, y);
    if (rotation) ctx.rotate(rotation);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
    ctx.restore();
    return true;
  }

  function markerDirectionFrame(angle) {
    const normalized = (angle + Math.PI * 2) % (Math.PI * 2);
    return Math.round(normalized / (Math.PI / 4)) % 8;
  }

  function markerBodyFacingFromVector(x, y) {
    if (Math.abs(x) > Math.abs(y)) return x > 0 ? 1 : 3;
    return y < 0 ? 2 : 0;
  }

  function embodiedCombatLayout(state) {
    const compact = !!(state.demoV2 && state.demoV2.combatScaleOrbitPass);
    if (!compact) {
      return {
        compact: false,
        bodyHeight: 112,
        bodyY: -7,
        markerOrbit: 40,
        markerWeaponHeight: 38,
        markerBaseSpacing: 9,
        markerCopySpacingOne: 18,
        markerCopySpacingTwo: 22,
        markerAttachmentScale: 1,
        thermosOrbit: 39,
        thermosWeaponHeight: 48,
        thermosSpacingScale: 1,
        thermosRouteScale: 1,
        scissorsOrbit: 31,
        scissorsWeaponHeight: 64,
        scissorsWeaponGrowth: 2.4,
        correctionOrbit: 28,
        correctionWeaponHeight: 29,
        correctionActiveWeaponHeight: 32,
        correctionLaneSpacing: 9,
        correctionRouteScale: 1
      };
    }
    return {
      compact: true,
      bodyHeight: 78,
      bodyY: -4,
      markerOrbit: 54,
      markerWeaponHeight: 22,
      markerBaseSpacing: 7,
      markerCopySpacingOne: 14,
      markerCopySpacingTwo: 18,
      markerAttachmentScale: 0.74,
      thermosOrbit: 47,
      thermosWeaponHeight: 32,
      thermosSpacingScale: 0.72,
      thermosRouteScale: 0.74,
      scissorsOrbit: 49,
      scissorsWeaponHeight: 48,
      scissorsWeaponGrowth: 1.4,
      correctionOrbit: 51,
      correctionWeaponHeight: 18,
      correctionActiveWeaponHeight: 21,
      correctionLaneSpacing: 7,
      correctionRouteScale: 0.74
    };
  }

  function markerEmbodimentVisualState(state) {
    const test = markerFixedRuntime(state);
    const p = state.activeFormParams || {};
    const copyLevel = test && test.modules ? test.modules.copy || 0 : p.markerFixedCopyLevel || 0;
    const archiveLevel = test && test.modules ? test.modules.archive || 0 : p.markerFixedArchiveLevel || 0;
    const baseAmount = Math.max(1, p.amount || 1);
    const copyLines = copyLevel >= 2 ? 2 : copyLevel === 1 ? 1 : 0;
    const parts = test && test.parts ? test.parts : {};
    const componentState = function (id) {
      const part = parts[id] || {};
      return {
        copies: part.copies || 0,
        activeStat: part.activeStat || ""
      };
    };
    return {
      enabled: !!(state.demoV2 && state.demoV2.weaponEmbodimentPass && test),
      facing: test && test.bodyFacing != null ? test.bodyFacing : 0,
      aimAngle: test && Number.isFinite(test.weaponVisualAngle) ? test.weaponVisualAngle : 0,
      copyLevel,
      archiveLevel,
      baseAmount,
      copyLines,
      penCount: Math.min(6, baseAmount * (1 + copyLines)),
      layout: embodiedCombatLayout(state),
      components: {
        tip: componentState("tip"),
        body: componentState("body"),
        tail: componentState("tail")
      }
    };
  }

  function drawMarkerRouteGlow(ctx, image, level, x, y, width, height, color) {
    if (!image || level <= 0) return;
    const coreAlpha = [0, 0.56, 0.7, 0.84, 0.98][level] || 0.98;
    const bloomAlpha = [0, 0.13, 0.19, 0.27, 0.36][level] || 0.36;
    const bloomScale = 1.018 + level * 0.01;
    drawCanvasSprite(
      ctx,
      image,
      x,
      y,
      width * bloomScale,
      height * bloomScale,
      bloomAlpha,
      0,
      "blur(" + (2 + level * 0.9) + "px) brightness(1.85) saturate(1.5) drop-shadow(0 0 " + (4 + level * 2) + "px " + color + ")",
      "screen"
    );
    drawCanvasSprite(
      ctx,
      image,
      x,
      y,
      width,
      height,
      coreAlpha,
      0,
      "brightness(" + (1.06 + level * 0.11) + ") saturate(" + (1.1 + level * 0.08) + ") drop-shadow(0 0 " + (3 + level * 1.3) + "px " + color + ")",
      "screen"
    );
  }

  function markerPenNodes(visual) {
    const nodes = [];
    const forwardX = Math.cos(visual.aimAngle);
    const forwardY = Math.sin(visual.aimAngle);
    const lateralX = -forwardY;
    const lateralY = forwardX;
    const layout = visual.layout;
    const orbit = layout.markerOrbit;
    const baseSpacing = layout.markerBaseSpacing;
    const baseOffsets = visual.baseAmount <= 1 ? [0] : [-baseSpacing, baseSpacing];
    baseOffsets.forEach(function (offset, index) {
      nodes.push({
        family: "base",
        x: forwardX * orbit + lateralX * offset,
        y: forwardY * orbit + lateralY * offset,
        index,
        weaponHeight: layout.markerWeaponHeight
      });
    });
    const copyOffsets = visual.copyLines === 1 ? [layout.markerCopySpacingOne]
      : visual.copyLines >= 2 ? [-layout.markerCopySpacingTwo, layout.markerCopySpacingTwo] : [];
    copyOffsets.forEach(function (offset, laneIndex) {
      baseOffsets.forEach(function (baseOffset, amountIndex) {
        nodes.push({
          family: "copy",
          x: forwardX * orbit + lateralX * (offset + baseOffset * 0.55),
          y: forwardY * orbit + lateralY * (offset + baseOffset * 0.55),
          index: laneIndex * 2 + amountIndex,
          weaponHeight: layout.markerWeaponHeight
        });
      });
    });
    return nodes.slice(0, 6);
  }

  function drawMarkerPen(ctx, cell, node, copyLevel) {
    if (!cell) return;
    const height = node.weaponHeight || 38;
    const width = height * cell.width / Math.max(1, cell.height);
    const copy = node.family === "copy";
    const glow = copy ? "#ffd75f" : "#f5ffff";
    const alpha = copy ? 0.88 + Math.min(0.1, copyLevel * 0.025) : 0.98;
    drawCanvasSprite(
      ctx,
      cell,
      node.x,
      node.y,
      width,
      height,
      alpha,
      0,
      "brightness(" + (copy ? 1.08 + copyLevel * 0.04 : 1.04) + ") drop-shadow(0 0 " + (copy ? 5 + copyLevel : 4) + "px " + glow + ")",
      "source-over"
    );
  }

  function markerComponentQuality(copies) {
    if (copies >= 8) return 4;
    if (copies >= 4) return 3;
    if (copies >= 2) return 2;
    return copies >= 1 ? 1 : 0;
  }

  function drawMarkerAttachedComponent(ctx, cell, x, y, width, height, angle, copies, color) {
    if (!cell || copies <= 0) return;
    const quality = markerComponentQuality(copies);
    drawCanvasSprite(
      ctx,
      cell,
      x,
      y,
      width * (1 + quality * 0.035),
      height * (1 + quality * 0.035),
      0.84 + quality * 0.035,
      angle,
      "brightness(" + (0.96 + quality * 0.1) + ") saturate(" + (1 + quality * 0.08) + ") drop-shadow(0 0 " + (2 + quality * 1.35) + "px " + color + ")",
      "source-over"
    );
  }

  function drawMarkerPenComponents(ctx, visual, node) {
    const cells = markerEmbodimentAssets.partCells;
    if (!cells || cells.length < 6) return;
    const forwardX = Math.cos(visual.aimAngle);
    const forwardY = Math.sin(visual.aimAngle);
    const tip = visual.components.tip;
    const body = visual.components.body;
    const tail = visual.components.tail;
    const scale = visual.layout.markerAttachmentScale;
    if (tip.copies > 0) {
      drawMarkerAttachedComponent(ctx, cells[3], node.x + forwardX * 19 * scale, node.y + forwardY * 19 * scale, 25 * scale, 21 * scale, visual.aimAngle, tip.copies, "#ffd75f");
    }
    if (body.copies > 0 && node.family === "base") {
      drawMarkerAttachedComponent(ctx, cells[4], node.x, node.y, 27 * scale, 22 * scale, visual.aimAngle, body.copies, "#ff65dc");
    }
    if (tail.copies > 0 && tail.activeStat !== "duration") {
      drawMarkerAttachedComponent(ctx, cells[5], node.x - forwardX * 19 * scale, node.y - forwardY * 19 * scale, 28 * scale, 20 * scale, visual.aimAngle, tail.copies, "#68efff");
    }
  }

  function markerBodyBasis(facing) {
    const angle = [Math.PI / 2, 0, -Math.PI / 2, Math.PI][facing] || 0;
    return {
      forwardX: Math.cos(angle),
      forwardY: Math.sin(angle),
      rightX: -Math.sin(angle),
      rightY: Math.cos(angle)
    };
  }

  function drawMarkerWornComponents(ctx, visual) {
    const tail = visual.components.tail;
    const cells = markerEmbodimentAssets.partCells;
    if (!cells || cells.length < 6 || tail.copies <= 0 || tail.activeStat !== "duration") return;
    const basis = markerBodyBasis(visual.facing);
    const scale = visual.layout.markerAttachmentScale;
    const x = -basis.forwardX * 12 * scale - basis.rightX * 27 * scale;
    const y = visual.layout.bodyY - basis.forwardY * 12 * scale - basis.rightY * 27 * scale;
    const rotation = Math.atan2(basis.forwardY, basis.forwardX);
    drawMarkerAttachedComponent(ctx, cells[2], x, y, 31 * scale, 31 * scale, rotation, tail.copies, "#68efff");
  }

  function drawMarkerEmbodiedPlayer(ctx, state) {
    const visual = markerEmbodimentVisualState(state);
    if (!visual.enabled) return false;
    prepareMarkerEmbodimentAssets();
    const rig = markerEmbodimentAssets.riggedPersonVisuals[visual.facing];
    const pen = markerEmbodimentAssets.weaponCells[markerDirectionFrame(visual.aimAngle)];
    if (!rig || !rig.base || !pen) return false;
    const height = visual.layout.bodyHeight;
    const width = height * rig.base.width / Math.max(1, rig.base.height);
    const bodyY = visual.layout.bodyY;
    const penNodes = markerPenNodes(visual);
    penNodes.filter(function (node) { return node.y < bodyY; }).forEach(function (node) {
      drawMarkerPen(ctx, pen, node, visual.copyLevel);
      drawMarkerPenComponents(ctx, visual, node);
    });
    drawCanvasSprite(ctx, rig.base, 0, bodyY, width, height, 1, 0, "drop-shadow(0 5px 4px rgba(0,0,0,.62))", "source-over");
    drawMarkerRouteGlow(ctx, rig.copy, visual.copyLevel, 0, bodyY, width, height, "#ffd75f");
    drawMarkerRouteGlow(ctx, rig.archive, visual.archiveLevel, 0, bodyY, width, height, "#68efff");
    drawMarkerWornComponents(ctx, visual);
    penNodes.filter(function (node) { return node.y >= bodyY; }).forEach(function (node) {
      drawMarkerPen(ctx, pen, node, visual.copyLevel);
      drawMarkerPenComponents(ctx, visual, node);
    });
    return true;
  }

  function thermosEmbodimentVisualState(state) {
    const config = fixedTestConfig(state);
    const test = config && config.weaponId === "thermos" ? fixedTestRuntime(state) : null;
    const p = state.activeFormParams || {};
    const parts = test && test.parts ? test.parts : {};
    const componentState = function (id) {
      const part = parts[id] || {};
      return {
        copies: part.copies || 0,
        activeStat: part.activeStat || ""
      };
    };
    return {
      enabled: !!(state.demoV2 && state.demoV2.thermosEmbodimentPass && test),
      facing: test && test.bodyFacing != null ? test.bodyFacing : 0,
      aimAngle: test && Number.isFinite(test.facingAngle) ? test.facingAngle : 0,
      condensationLevel: test && test.modules ? test.modules.copy || 0 : p.thermosFixedCondensationLevel || 0,
      heatwaveLevel: test && test.modules ? test.modules.archive || 0 : p.thermosFixedHeatwaveLevel || 0,
      condensationRecoil: test ? test.condensationRecoil || 0 : 0,
      heatwaveRecoil: test ? test.heatwaveRecoil || 0 : 0,
      cupCount: Math.min(4, Math.max(1, p.amount || 1)),
      layout: embodiedCombatLayout(state),
      components: {
        lid: componentState("tip"),
        body: componentState("body"),
        base: componentState("tail")
      }
    };
  }

  function thermosWeaponVisual(angle) {
    const frame = markerDirectionFrame(angle);
    if (frame === 0) return { cell: thermosEmbodimentAssets.weaponCells[0], mirrorX: true };
    return { cell: thermosEmbodimentAssets.weaponCells[frame], mirrorX: false };
  }

  function thermosCupNodes(visual) {
    const forwardX = Math.cos(visual.aimAngle);
    const forwardY = Math.sin(visual.aimAngle);
    const lateralX = -forwardY;
    const lateralY = forwardX;
    const spacingScale = visual.layout.thermosSpacingScale;
    const offsets = (visual.cupCount === 1 ? [0]
      : visual.cupCount === 2 ? [-12, 12]
        : visual.cupCount === 3 ? [-18, 0, 18] : [-24, -8, 8, 24]).map(function (value) {
      return value * spacingScale;
    });
    return offsets.map(function (offset, index) {
      return {
        x: forwardX * visual.layout.thermosOrbit + lateralX * offset,
        y: forwardY * visual.layout.thermosOrbit + lateralY * offset,
        index
      };
    });
  }

  function drawThermosCup(ctx, visual, node) {
    const weapon = thermosWeaponVisual(visual.aimAngle);
    if (!weapon.cell) return;
    const bodyQuality = markerComponentQuality(visual.components.body.copies);
    const lidQuality = markerComponentQuality(visual.components.lid.copies);
    const baseQuality = markerComponentQuality(visual.components.base.copies);
    const quality = Math.max(bodyQuality, lidQuality, baseQuality);
    const height = visual.layout.thermosWeaponHeight + quality * (visual.layout.compact ? 0.8 : 1.4);
    const width = height * weapon.cell.width / Math.max(1, weapon.cell.height);
    ctx.save();
    ctx.translate(node.x, node.y);
    if (weapon.mirrorX) ctx.scale(-1, 1);
    drawCanvasSprite(
      ctx,
      weapon.cell,
      0,
      0,
      width,
      height,
      0.96,
      0,
      "brightness(" + (1.02 + quality * 0.055) + ") saturate(" + (1.03 + quality * 0.05) + ") drop-shadow(0 0 " + (3 + quality) + "px rgba(174,247,255,.86))",
      "source-over"
    );
    ctx.restore();
  }

  function thermosRoutePackNodes(visual, family) {
    const level = family === "condensation" ? visual.condensationLevel : visual.heatwaveLevel;
    if (level <= 0) return [];
    const basis = markerBodyBasis(visual.facing);
    const side = family === "condensation" ? 1 : -1;
    const recoil = family === "condensation" ? visual.condensationRecoil : visual.heatwaveRecoil;
    const recoilProgress = recoil > 0 ? clamp(1 - recoil / 0.32, 0, 1) : 1;
    const recoilKick = recoil > 0 ? Math.sin(recoilProgress * Math.PI) * (2.2 + level * 0.7) : 0;
    const exhaustX = -basis.forwardX * 0.82 + basis.rightX * side * 0.58;
    const exhaustY = -basis.forwardY * 0.82 + basis.rightY * side * 0.58;
    const count = Math.min(3, level);
    const rowOffset = family === "condensation" ? 0 : 4;
    const cell = thermosEmbodimentAssets.routeCells[rowOffset + visual.facing];
    if (!cell) return [];
    const scale = visual.layout.thermosRouteScale;
    const nodes = [];
    for (let index = 0; index < count; index++) {
      const sideDistance = (38 + index * 8) * scale;
      const rearDistance = (4 + index * 3) * scale;
      nodes.push({
        family,
        level,
        cell,
        x: basis.rightX * side * sideDistance - basis.forwardX * rearDistance + basis.forwardX * recoilKick,
        y: visual.layout.bodyY - 1 + basis.rightY * side * sideDistance - basis.forwardY * rearDistance + basis.forwardY * recoilKick,
        width: (35 - index * 2) * scale,
        height: (41 - index * 2) * scale,
        recoil,
        exhaustX,
        exhaustY,
        index
      });
    }
    return nodes;
  }

  function drawThermosRoutePack(ctx, node) {
    const color = node.family === "condensation" ? "#66efff" : "#ffb343";
    const coreAlpha = [0, 0.76, 0.84, 0.92, 1][node.level] || 1;
    const bloomAlpha = [0, 0.12, 0.18, 0.26, 0.35][node.level] || 0.35;
    const terminalScale = node.level >= 4 && node.index === 2 ? 1.16 : 1;
    drawCanvasSprite(
      ctx,
      node.cell,
      node.x,
      node.y,
      node.width * terminalScale * 1.08,
      node.height * terminalScale * 1.08,
      bloomAlpha,
      0,
      "blur(" + (1.4 + node.level * 0.55) + "px) brightness(1.8) saturate(1.45) drop-shadow(0 0 " + (4 + node.level * 1.8) + "px " + color + ")",
      "screen"
    );
    drawCanvasSprite(
      ctx,
      node.cell,
      node.x,
      node.y,
      node.width * terminalScale,
      node.height * terminalScale,
      coreAlpha,
      0,
      "brightness(" + (1.02 + node.level * 0.08) + ") saturate(" + (1.04 + node.level * 0.07) + ") drop-shadow(0 0 " + (2 + node.level) + "px " + color + ")",
      "source-over"
    );
  }

  function drawThermosRoutePacks(ctx, visual, foreground) {
    ["condensation", "heatwave"].forEach(function (family) {
      thermosRoutePackNodes(visual, family).forEach(function (node) {
        if ((node.y >= visual.layout.bodyY) !== foreground) return;
        drawThermosRoutePack(ctx, node);
      });
    });
  }

  function drawThermosEmbodiedPlayer(ctx, state) {
    const visual = thermosEmbodimentVisualState(state);
    if (!visual.enabled) return false;
    prepareThermosEmbodimentAssets();
    const rig = thermosEmbodimentAssets.riggedPersonVisuals[visual.facing];
    if (!rig || !rig.base || !thermosWeaponVisual(visual.aimAngle).cell) return false;
    const height = visual.layout.bodyHeight;
    const width = height * rig.base.width / Math.max(1, rig.base.height);
    const bodyY = visual.layout.bodyY;
    const cupNodes = thermosCupNodes(visual);
    state.formEvents.filter(function (event) {
      return event.kind === "thermos_backpressure";
    }).forEach(function (event) {
      const duration = event.duration || event.maxLife || 0.3;
      const activeLife = Math.min(duration, event.life == null ? duration : event.life);
      const alpha = event.debugHold ? 1 : clamp(activeLife / duration, 0, 1);
      const progress = event.debugHold ? (event.debugProgress == null ? 0.7 : event.debugProgress) : 1 - alpha;
      drawThermosBackPressureEvent(ctx, Object.assign({}, event, {
        x: 0,
        y: bodyY,
        compact: visual.layout.compact
      }), alpha, progress);
    });
    cupNodes.filter(function (node) { return node.y < bodyY; }).forEach(function (node) {
      drawThermosCup(ctx, visual, node);
    });
    drawThermosRoutePacks(ctx, visual, false);
    drawCanvasSprite(ctx, rig.base, 0, bodyY, width, height, 1, 0, "drop-shadow(0 5px 4px rgba(0,0,0,.62))", "source-over");
    drawMarkerRouteGlow(ctx, rig.condensation, visual.condensationLevel, 0, bodyY, width, height, "#66efff");
    drawMarkerRouteGlow(ctx, rig.heatwave, visual.heatwaveLevel, 0, bodyY, width, height, "#ffb343");
    drawThermosRoutePacks(ctx, visual, true);
    cupNodes.filter(function (node) { return node.y >= bodyY; }).forEach(function (node) {
      drawThermosCup(ctx, visual, node);
    });
    return true;
  }

  function scissorsEmbodimentVisualState(state) {
    const test = scissorsFixedRuntime(state);
    const p = state.activeFormParams || {};
    return {
      enabled: !!(state.demoV2 && state.demoV2.scissorsEmbodimentPass && test),
      facing: test && test.bodyFacing != null ? test.bodyFacing : 0,
      aimAngle: test && Number.isFinite(test.weaponVisualAngle) ? test.weaponVisualAngle
        : test && Number.isFinite(test.facingAngle) ? test.facingAngle : 0,
      closedLevel: test && test.modules ? test.modules.copy || 0 : p.scissorsClosedLevel || 0,
      openLevel: test && test.modules ? test.modules.archive || 0 : p.scissorsOpenLevel || 0,
      attacking: !!(test && test.weaponVisualTime > 0),
      layout: embodiedCombatLayout(state)
    };
  }

  function drawScissorsComplete(ctx, visual, nodeX, nodeY) {
    const cell = scissorsEmbodimentAssets.weaponCells[markerDirectionFrame(visual.aimAngle)];
    if (!cell) return;
    const level = Math.max(visual.closedLevel, visual.openLevel);
    const glow = visual.openLevel > visual.closedLevel ? "#ff56df" : visual.closedLevel > 0 ? "#66efff" : "#e8f6ff";
    const height = visual.layout.scissorsWeaponHeight + level * visual.layout.scissorsWeaponGrowth;
    const width = height * cell.width / Math.max(1, cell.height);
    drawCanvasSprite(ctx, cell, nodeX, nodeY, width * 1.06, height * 1.06,
      0.16 + level * 0.035, 0,
      "blur(" + (1.5 + level * 0.45) + "px) brightness(1.8) saturate(1.5) drop-shadow(0 0 " + (5 + level * 2) + "px " + glow + ")",
      "screen");
    drawCanvasSprite(ctx, cell, nodeX, nodeY, width, height, 0.98, 0,
      "brightness(" + (1.02 + level * 0.06) + ") saturate(" + (1.04 + level * 0.08) + ") drop-shadow(0 0 " + (3 + level) + "px " + glow + ")",
      "source-over");
  }

  function drawScissorsEmbodiedPlayer(ctx, state) {
    const visual = scissorsEmbodimentVisualState(state);
    if (!visual.enabled) return false;
    prepareScissorsEmbodimentAssets();
    const person = scissorsEmbodimentAssets.personCells[visual.facing];
    if (!person || scissorsEmbodimentAssets.weaponCells.length < 8) return false;
    const bodyY = visual.layout.bodyY;
    const bodyHeight = visual.layout.bodyHeight;
    const bodyWidth = bodyHeight * person.width / Math.max(1, person.height);
    const orbit = visual.layout.scissorsOrbit;
    const nodeX = Math.cos(visual.aimAngle) * orbit;
    const nodeY = Math.sin(visual.aimAngle) * orbit;
    if (!visual.attacking && nodeY < bodyY) drawScissorsComplete(ctx, visual, nodeX, nodeY);
    const routeLevel = Math.max(visual.closedLevel, visual.openLevel);
    const bodyFilter = routeLevel > 0
      ? "brightness(" + (1.02 + routeLevel * 0.035) + ") saturate(" + (1.04 + routeLevel * 0.05) + ") drop-shadow(0 0 " + (3 + routeLevel) + "px " + (visual.openLevel >= visual.closedLevel ? "#ff56df" : "#66efff") + ")"
      : "drop-shadow(0 5px 4px rgba(0,0,0,.62))";
    drawCanvasSprite(ctx, person, 0, bodyY, bodyWidth, bodyHeight, 1, 0, bodyFilter, "source-over");
    if (!visual.attacking && nodeY >= bodyY) drawScissorsComplete(ctx, visual, nodeX, nodeY);
    return true;
  }

  function correctionEmbodimentVisualState(state) {
    const test = correctionFluidRuntime(state);
    const p = state.activeFormParams || {};
    return {
      enabled: !!(state.demoV2 && state.demoV2.correctionEmbodimentPass && test),
      facing: test && test.bodyFacing != null ? test.bodyFacing : 0,
      aimAngle: test && Number.isFinite(test.facingAngle) ? test.facingAngle : 0,
      sprayAngles: test && test.weaponVisualTime > 0 && Array.isArray(test.weaponVisualAngles) && test.weaponVisualAngles.length
        ? test.weaponVisualAngles : null,
      squeeze: test ? clamp((test.weaponVisualTime || 0) / 0.26, 0, 1) : 0,
      spreadLevel: test && test.modules ? test.modules.copy || 0 : p.correctionSpreadLevel || 0,
      fatalLevel: test && test.modules ? test.modules.archive || 0 : p.correctionFatalLevel || 0,
      layout: embodiedCombatLayout(state)
    };
  }

  function drawCorrectionRouteMutation(ctx, visual, family, foreground) {
    const level = family === "spread" ? visual.spreadLevel : visual.fatalLevel;
    if (level <= 0) return;
    const basis = markerBodyBasis(visual.facing);
    const side = family === "spread" ? -1 : 1;
    const rowOffset = family === "spread" ? 0 : 4;
    const cell = correctionEmbodimentAssets.routeCells[rowOffset + visual.facing];
    if (!cell) return;
    const scale = visual.layout.correctionRouteScale;
    const x = basis.rightX * side * (28 + level * 1.1) * scale - basis.forwardX * 5 * scale;
    const y = visual.layout.bodyY - 1 + basis.rightY * side * (28 + level * 1.1) * scale - basis.forwardY * 5 * scale;
    if ((y >= visual.layout.bodyY) !== foreground) return;
    const color = family === "spread" ? "#ff49d0" : "#62efff";
    const height = (28 + level * 2.5) * scale;
    const width = height * cell.width / Math.max(1, cell.height);
    drawCanvasSprite(ctx, cell, x, y, width * 1.08, height * 1.08,
      0.12 + level * 0.055, 0,
      "blur(" + (1.4 + level * 0.5) + "px) brightness(1.9) saturate(1.5) drop-shadow(0 0 " + (5 + level * 2) + "px " + color + ")",
      "screen");
    drawCanvasSprite(ctx, cell, x, y, width, height, 0.78 + level * 0.05, 0,
      "brightness(" + (1.02 + level * 0.075) + ") saturate(" + (1.05 + level * 0.08) + ") drop-shadow(0 0 " + (3 + level) + "px " + color + ")",
      "source-over");
  }

  function drawCorrectionNozzle(ctx, visual, angle, index, count, active) {
    const cell = correctionEmbodimentAssets.nozzleCells[markerDirectionFrame(angle)];
    if (!cell) return;
    const lateralX = -Math.sin(angle);
    const lateralY = Math.cos(angle);
    const offset = (index - (count - 1) * 0.5) * visual.layout.correctionLaneSpacing;
    const orbit = visual.layout.correctionOrbit;
    const x = Math.cos(angle) * orbit + lateralX * offset;
    const y = Math.sin(angle) * orbit + lateralY * offset;
    const height = active ? visual.layout.correctionActiveWeaponHeight : visual.layout.correctionWeaponHeight;
    const width = height * cell.width / Math.max(1, cell.height);
    drawCanvasSprite(ctx, cell, x, y, width * 1.06, height * 1.06, active ? 0.26 : 0.14, 0,
      "blur(1.8px) brightness(1.85) saturate(1.4) drop-shadow(0 0 8px #7df8ff)", "screen");
    drawCanvasSprite(ctx, cell, x, y, width, height, 0.98, 0,
      "brightness(1.08) saturate(1.08) drop-shadow(0 0 4px #ff5bd5)", "source-over");
  }

  function drawCorrectionEmbodiedPlayer(ctx, state) {
    const visual = correctionEmbodimentVisualState(state);
    if (!visual.enabled) return false;
    prepareCorrectionEmbodimentAssets();
    const person = correctionEmbodimentAssets.personCells[visual.facing];
    if (!person || correctionEmbodimentAssets.nozzleCells.length < 8) return false;
    const bodyY = visual.layout.bodyY;
    const bodyHeight = visual.layout.bodyHeight;
    const squeezeKick = Math.sin((1 - visual.squeeze) * Math.PI) * visual.squeeze;
    const bodyWidth = bodyHeight * person.width / Math.max(1, person.height);
    const angles = visual.sprayAngles || [visual.aimAngle];
    const backAngles = angles.filter(function (angle) { return Math.sin(angle) < -0.1; });
    const frontAngles = angles.filter(function (angle) { return Math.sin(angle) >= -0.1; });
    backAngles.forEach(function (angle, index) { drawCorrectionNozzle(ctx, visual, angle, index, backAngles.length, !!visual.sprayAngles); });
    drawCorrectionRouteMutation(ctx, visual, "spread", false);
    drawCorrectionRouteMutation(ctx, visual, "fatal", false);
    drawCanvasSprite(ctx, person, 0, bodyY + squeezeKick * 2.2,
      bodyWidth * (1 + squeezeKick * 0.045), bodyHeight * (1 - squeezeKick * 0.025), 1, 0,
      "brightness(" + (1.02 + squeezeKick * 0.14) + ") saturate(" + (1.04 + squeezeKick * 0.16) + ") drop-shadow(0 0 " + (4 + squeezeKick * 8) + "px rgba(116,244,255,.82))",
      "source-over");
    drawCorrectionRouteMutation(ctx, visual, "spread", true);
    drawCorrectionRouteMutation(ctx, visual, "fatal", true);
    frontAngles.forEach(function (angle, index) { drawCorrectionNozzle(ctx, visual, angle, index, frontAngles.length, !!visual.sprayAngles); });
    return true;
  }

  function thermosBackPressureEmitter(state, visual, family, level) {
    const basis = markerBodyBasis(visual.facing);
    const side = family === "condensation" ? 1 : family === "heatwave" ? -1 : 0;
    const x = state.player.x;
    const y = state.player.y - 7;
    let dx = -basis.forwardX;
    let dy = -basis.forwardY;
    if (side) {
      dx = -basis.forwardX * 0.82 + basis.rightX * side * 0.58;
      dy = -basis.forwardY * 0.82 + basis.rightY * side * 0.58;
      const length = Math.hypot(dx, dy) || 1;
      dx /= length;
      dy /= length;
    }
    return { x, y, dx, dy, family, level };
  }

  function triggerThermosBackPressure(state, test) {
    if (!state.demoV2 || !state.demoV2.thermosBackPressurePass || !test) return;
    const visual = thermosEmbodimentVisualState(state);
    const emitters = [];
    if (visual.condensationLevel > 0) {
      emitters.push(thermosBackPressureEmitter(state, visual, "condensation", visual.condensationLevel));
      test.condensationRecoil = 0.32;
    }
    if (visual.heatwaveLevel > 0) {
      emitters.push(thermosBackPressureEmitter(state, visual, "heatwave", visual.heatwaveLevel));
      test.heatwaveRecoil = 0.32;
    }
    if (!emitters.length) emitters.push(thermosBackPressureEmitter(state, visual, "neutral", 0));
    emitters.forEach(function (emitter, index) {
      const duration = 0.3 + emitter.level * 0.025;
      state.formEvents.push({
        kind: "thermos_backpressure",
        primitive: "thermos_backpressure",
        source: "thermos_backpressure_" + emitter.family,
        x: emitter.x,
        y: emitter.y,
        dx: emitter.dx,
        dy: emitter.dy,
        family: emitter.family,
        level: emitter.level,
        seed: (state.stats.shots || 0) * 17 + index * 31 + visual.facing * 7,
        life: duration,
        duration,
        maxLife: duration,
        age: 0
      });
    });
  }

  function drawThermosBackPressureEvent(ctx, event, alpha, progress) {
    prepareThermosEmbodimentAssets();
    const level = event.level || 0;
    const family = event.family || "neutral";
    const rowOffset = family === "heatwave" ? 4 : 0;
    const frame = clamp(Math.floor(clamp(progress, 0, 0.999) * 4), 0, 3);
    const cell = thermosEmbodimentAssets.backPressureCells[rowOffset + frame];
    if (!cell) return;
    const direction = Math.atan2(event.dy || 0, event.dx || 1);
    // The player plus both wearable packs span roughly 100 px. Keep the arc
    // just outside that silhouette so it reads as a body-hugging pressure
    // buffer instead of disappearing underneath the hardware.
    const size = 118 + level * 9;
    const renderedSize = event.compact ? 84 + level * 6 : size;
    const filter = family === "neutral"
      ? "grayscale(1) brightness(1.2) drop-shadow(0 0 5px rgba(230,252,255,.82))"
      : family === "condensation"
        ? "brightness(" + (1.02 + level * 0.08) + ") saturate(1.18) drop-shadow(0 0 " + (5 + level * 1.6) + "px rgba(96,235,255,.9))"
        : "brightness(" + (1.02 + level * 0.08) + ") saturate(1.2) drop-shadow(0 0 " + (5 + level * 1.6) + "px rgba(255,166,55,.92))";
    drawCanvasSprite(
      ctx,
      cell,
      event.x,
      event.y,
      renderedSize,
      renderedSize,
      Math.min(0.96, alpha * (0.78 + level * 0.045)),
      direction,
      filter,
      "screen"
    );
  }

  function drawSpriteFrame(ctx, id, frame, x, y, width, height, alpha, rotation) {
    if (!isSpriteReady(id)) return false;
    const img = runtimeImages[id];
    const index = clamp(Math.floor(frame || 0), 0, 3);
    const sourceWidth = Math.floor(img.naturalWidth / 2);
    const sourceHeight = Math.floor(img.naturalHeight / 2);
    const sourceX = index % 2 * sourceWidth;
    const sourceY = Math.floor(index / 2) * sourceHeight;
    ctx.save();
    ctx.globalAlpha *= alpha == null ? 1 : alpha;
    ctx.translate(x, y);
    if (rotation) ctx.rotate(rotation);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, -width / 2, -height / 2, width, height);
    ctx.restore();
    return true;
  }

  function drawGridSpriteFrame(ctx, id, columns, rows, frame, x, y, width, height, alpha, rotation, filter, composite) {
    if (!isSpriteReady(id)) return false;
    const img = runtimeImages[id];
    const maxFrame = Math.max(0, columns * rows - 1);
    const index = clamp(Math.floor(frame || 0), 0, maxFrame);
    const sourceWidth = Math.floor(img.naturalWidth / columns);
    const sourceHeight = Math.floor(img.naturalHeight / rows);
    const sourceX = index % columns * sourceWidth;
    const sourceY = Math.floor(index / columns) * sourceHeight;
    ctx.save();
    ctx.globalAlpha *= alpha == null ? 1 : alpha;
    ctx.globalCompositeOperation = composite || "source-over";
    ctx.filter = filter || "none";
    ctx.translate(x, y);
    if (rotation) ctx.rotate(rotation);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, -width / 2, -height / 2, width, height);
    ctx.restore();
    return true;
  }

  function v24Frame(progress) {
    return clamp(Math.floor(clamp(progress || 0, 0, 0.999) * 4), 0, 3);
  }

  function drawSuiteNeonLine(ctx, state, item, alpha, progress) {
    const source = item.source || "";
    if (!state.demoV2 || !state.demoV2.cyberNeonSuite || !/_test_/.test(source) || item.x1 == null || item.x2 == null) return;
    if (state.demoV2.combatExperiencePass) {
      const bloom = !!state.demoV2.neonBloomPass;
      const profile = item.visualProfile || eventVisual(source);
      const family = profile.family || (/thermos/.test(source) ? "thermos" : /scissors/.test(source) ? "scissors" : /correction/.test(source) ? "correction" : "marker");
      const palette = profile.palette || {};
      const isCorrection = family === "correction" || family === "correction_fluid";
      const fixedMarkerLaser = /^marker_test_(base|copy|second_round|retrieval)$/.test(source);
      const color = source === "marker_test_retrieval" ? "#ff65dc"
        : fixedMarkerLaser ? (source === "marker_test_copy" ? "#ffb84f" : "#ffe77d")
        : palette.core || (isCorrection ? "#ff4fd8" : family === "scissors" ? "#ffd36b" : "#55f7ff");
      const size = clamp((item.width || 8) * (family === "scissors" ? 5.2 : 3.8), 38, isCorrection ? 82 : 68);
      const sprite = family === "thermos" ? "thermos_release_art"
        : family === "scissors" ? "scissors_slash_v24"
          : isCorrection ? "correction_fluid_glitch_v25" : "marker_impact_art";
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = (bloom ? 32 : 18) + (profile.intensity || 1) * (bloom ? 11 : 7);
      if (bloom) {
        ctx.globalCompositeOperation = "lighter";
        drawGeneratedLine(ctx, generatedLineSprite(profile), item.x1, item.y1, item.x2, item.y2,
          Math.max(10, (item.width || 8) * 2.15), Math.min(0.28, (alpha || 0.5) * 0.3));
      }
      if (family === "scissors" || isCorrection) {
        if (bloom) drawSpriteFrame(ctx, sprite, v24Frame(progress), item.x2, item.y2, size * 1.34, size * 1.34, Math.min(0.28, (alpha || 0.5) * 0.3), Math.atan2(item.y2 - item.y1, item.x2 - item.x1));
        drawSpriteFrame(ctx, sprite, v24Frame(progress), item.x2, item.y2, size, size, Math.min(0.86, (alpha || 0.5) * 0.78), Math.atan2(item.y2 - item.y1, item.x2 - item.x1));
      } else {
        if (bloom) drawSprite(ctx, sprite, item.x2, item.y2, size * 1.34, size * 1.34, Math.min(0.24, (alpha || 0.5) * 0.26), progress * 0.08);
        drawSprite(ctx, sprite, item.x2, item.y2, size, size, Math.min(0.72, (alpha || 0.5) * 0.68), progress * 0.08);
      }
      ctx.restore();
      return;
    }
    const size = clamp((item.width || 8) * 3.2, 28, /correction/.test(source) ? 72 : 52);
    drawSpriteFrame(ctx, "correction_fluid_glitch_v25", v24Frame(progress), item.x2, item.y2, size, size, Math.min(/correction/.test(source) ? 0.58 : 0.22, (alpha || 0.5) * 0.5), 0);
  }

  function drawSuiteNeonArea(ctx, state, item, alpha, progress, radius) {
    const source = item.source || "";
    if (!state.demoV2 || !state.demoV2.cyberNeonSuite || !/_test_/.test(source) || item.x == null) return;
    const r = Math.max(16, radius || item.radius || 40);
    if (state.demoV2.combatExperiencePass) {
      const bloom = !!state.demoV2.neonBloomPass;
      const profile = item.visualProfile || eventVisual(source);
      const family = profile.family || (/thermos/.test(source) ? "thermos" : /scissors/.test(source) ? "scissors" : /correction/.test(source) ? "correction" : "marker");
      const palette = profile.palette || {};
      const isCorrection = family === "correction" || family === "correction_fluid";
      const color = palette.core || (isCorrection ? "#ff4fd8" : family === "scissors" ? "#ffd36b" : "#55f7ff");
      const sprite = family === "thermos" ? "thermos_release_art"
        : family === "scissors" ? "scissors_slash_v24"
          : isCorrection ? "correction_fluid_glitch_v25" : "marker_impact_art";
      const scale = isCorrection ? 1.86 : family === "scissors" ? 1.62 : 1.48;
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = (bloom ? 36 : 20) + (profile.intensity || 1) * (bloom ? 12 : 8);
      if (bloom) ctx.globalCompositeOperation = "lighter";
      if (family === "scissors" || isCorrection) {
        if (bloom) drawSpriteFrame(ctx, sprite, v24Frame(progress), item.x, item.y, r * scale * 1.28, r * scale * 1.28, Math.min(0.25, (alpha || 0.5) * 0.27), 0);
        drawSpriteFrame(ctx, sprite, v24Frame(progress), item.x, item.y, r * scale, r * scale, Math.min(0.78, (alpha || 0.5) * 0.72), 0);
      } else {
        if (bloom) drawSprite(ctx, sprite, item.x, item.y, r * scale * 1.28, r * scale * 1.28, Math.min(0.22, (alpha || 0.5) * 0.24), progress * 0.06);
        drawSprite(ctx, sprite, item.x, item.y, r * scale, r * scale, Math.min(0.68, (alpha || 0.5) * 0.66), progress * 0.06);
      }
      ctx.restore();
      return;
    }
    const scale = /correction/.test(source) ? 1.72 : 1.36;
    drawSpriteFrame(ctx, "correction_fluid_glitch_v25", v24Frame(progress), item.x, item.y, r * scale, r * scale, Math.min(/correction/.test(source) ? 0.46 : 0.16, (alpha || 0.5) * 0.45), 0);
  }

  function drawV24LinearEvent(ctx, event, alpha, progress, state) {
    const source = event.source || "";
    const meta = event.meta || {};
    const dx = event.x2 - event.x1;
    const dy = event.y2 - event.y1;
    const length = Math.hypot(dx, dy) || 1;
    const angle = Math.atan2(dy, dx);
    if (source === "correction_test_spray") {
      if (state && state.demoV2 && state.demoV2.correctionEmbodimentPass) {
        const frame = v24Frame(progress);
        drawGridSpriteFrame(ctx, "correction_spray_error_v39", 4, 2, frame,
          event.x1 + dx * 0.5, event.y1 + dy * 0.5,
          length * 1.18, Math.max(58, (event.width || 18) * 3.5),
          Math.min(1, alpha + 0.14), angle,
          "brightness(1.08) saturate(1.1) drop-shadow(0 0 8px rgba(103,247,255,.86))", "source-over");
        return true;
      }
      drawSpriteFrame(ctx, "correction_fluid_spray_v25", v24Frame(progress), event.x1 + dx * 0.5, event.y1 + dy * 0.5, length * 1.16, Math.max(52, (event.width || 18) * 3.2), Math.min(1, alpha + 0.14), angle);
      return true;
    }
    if (source === "thermos_test_base") {
      if (Math.abs(meta.fanOffset || 0) > 0.001) return true;
      const fanWidth = meta.fanWidth || Math.max(150, (event.width || 10) * 18);
      const visibleOffset = Math.min(length * 0.28, meta.visualOriginDistance || 0);
      const visibleX1 = event.x1 + dx / length * visibleOffset;
      const visibleY1 = event.y1 + dy / length * visibleOffset;
      const visibleLength = Math.max(20, length - visibleOffset);
      drawSpriteFrame(ctx, "thermos_fan_v24", v24Frame(progress), visibleX1 + dx / length * visibleLength * 0.5, visibleY1 + dy / length * visibleLength * 0.5, visibleLength * 1.18, fanWidth * 1.08, Math.min(0.96, alpha + 0.12), angle);
      return true;
    }
    if (source === "thermos_test_focus") {
      const visibleOffset = Math.min(length * 0.34, meta.visualOriginDistance || 0);
      const visibleX1 = event.x1 + dx / length * visibleOffset;
      const visibleY1 = event.y1 + dy / length * visibleOffset;
      const visibleLength = Math.max(20, length - visibleOffset);
      drawSpriteFrame(ctx, "thermos_focus_v24", v24Frame(progress), visibleX1 + dx / length * visibleLength * 0.5, visibleY1 + dy / length * visibleLength * 0.5, visibleLength * 1.16, Math.max(64, (event.width || 10) * 7.2), Math.min(1, alpha + 0.14), angle);
      return true;
    }
    if (source === "scissors_test_dash") {
      drawSpriteFrame(ctx, "scissors_dash_v24", v24Frame(progress), event.x1 + dx * 0.5, event.y1 + dy * 0.5, length * 1.18, Math.max(70, (event.width || 18) * 4.4), Math.min(0.9, alpha + 0.06), angle);
      return true;
    }
    if (source === "scissors_test_thrust" || source === "scissors_test_sever") {
      if (state && state.demoV2 && state.demoV2.scissorsEmbodimentPass) {
        const frame = source === "scissors_test_sever" ? 3 : v24Frame(progress);
        const height = source === "scissors_test_sever" ? Math.max(118, (event.width || 52) * 2.4) : Math.max(76, (event.width || 26) * 2.8);
        drawGridSpriteFrame(ctx, "scissors_cut_routes_v39", 4, 2, frame,
          event.x1 + dx * 0.51, event.y1 + dy * 0.51,
          length * (source === "scissors_test_sever" ? 1.48 : 1.3), height,
          Math.min(1, alpha + 0.16), angle,
          "brightness(1.1) saturate(1.12) drop-shadow(0 0 10px rgba(102,239,255,.9))", "source-over");
        return true;
      }
      const frame = source === "scissors_test_sever" ? Math.min(3, 1 + v24Frame(progress)) : v24Frame(progress);
      const height = source === "scissors_test_sever" ? Math.max(92, (event.width || 52) * 2.2) : Math.max(58, (event.width || 26) * 2.35);
      drawSpriteFrame(ctx, "scissors_thrust_v24", frame, event.x1 + dx * 0.5, event.y1 + dy * 0.5, length * 1.28, height * 1.12, Math.min(1, alpha + 0.16), angle);
      if (source === "scissors_test_sever") {
        drawSpriteFrame(ctx, "scissors_slash_v24", 3, event.x2, event.y2, Math.max(132, height * 1.55), Math.max(132, height * 1.55), Math.min(0.92, alpha + 0.08), angle);
      }
      // Closed Blade is the ordinary scissors physically driving the thrust,
      // not a detached effect plus a second weapon beside the player.
      drawSprite(ctx, "scissors_v23",
        event.x2 - Math.cos(angle) * (source === "scissors_test_sever" ? 20 : 14),
        event.y2 - Math.sin(angle) * (source === "scissors_test_sever" ? 20 : 14),
        source === "scissors_test_sever" ? 88 : 72,
        source === "scissors_test_sever" ? 88 : 72,
        Math.min(1, alpha + 0.14), angle + Math.PI * 0.25);
      return true;
    }
    if (source === "scissors_test_base") {
      if (meta.edge && meta.edge !== "left") return true;
      const lockedAngle = meta.lockedAngle == null ? angle : meta.lockedAngle;
      const range = meta.fanRange || length;
      const halfAngle = meta.fanHalfAngle || 0.45;
      const frame = v24Frame(progress);
      const width = range * 1.3;
      const height = Math.max(94, Math.sin(halfAngle) * range * 2.24);
      if (state && state.demoV2 && state.demoV2.scissorsEmbodimentPass) {
        drawGridSpriteFrame(ctx, "scissors_cut_routes_v39", 4, 2, 4 + v24Frame(progress),
          event.x1 + Math.cos(lockedAngle) * range * 0.48,
          event.y1 + Math.sin(lockedAngle) * range * 0.48,
          width * 1.12, Math.max(width * 0.88, height), Math.min(1, alpha + 0.14), lockedAngle,
          "brightness(1.08) saturate(1.16) drop-shadow(0 0 11px rgba(255,86,223,.9))", "source-over");
        return true;
      }
      drawSpriteFrame(ctx, "scissors_slash_v24", frame, event.x1 + Math.cos(lockedAngle) * range * 0.52, event.y1 + Math.sin(lockedAngle) * range * 0.52, width, Math.max(width * 0.84, height), Math.min(1, alpha + 0.14), lockedAngle);
      return true;
    }
    if (source === "scissors_test_open" || source === "scissors_test_finale") {
      if (meta.edge && meta.edge !== "left") return true;
      const lockedAngle = meta.lockedAngle == null ? angle : meta.lockedAngle;
      const range = meta.fanRange || length;
      const heavy = source === "scissors_test_finale";
      const frame = heavy ? 3 : Math.min(2, v24Frame(progress));
      const visualSize = range * (heavy ? 1.82 : 1.62);
      const anchorDistance = Math.min(range * 0.54, visualSize * 0.38);
      if (state && state.demoV2 && state.demoV2.scissorsEmbodimentPass) {
        drawGridSpriteFrame(ctx, "scissors_cut_routes_v39", 4, 2, 4 + frame,
          event.x1 + Math.cos(lockedAngle) * anchorDistance,
          event.y1 + Math.sin(lockedAngle) * anchorDistance,
          visualSize * (heavy ? 1.12 : 1), visualSize * (heavy ? 1.12 : 1),
          Math.min(1, alpha + 0.12), lockedAngle,
          "brightness(1.1) saturate(1.22) drop-shadow(0 0 14px rgba(255,72,218,.92))", "source-over");
        return true;
      }
      // Open Blade owns a complete pair of scissors, not two detached blade
      // arcs. Keep the handles around the player and rotate the blades outward
      // along the same locked angle used by the real fan judgment.
      drawSpriteFrame(ctx, "scissors_strike_v27", frame,
        event.x1 + Math.cos(lockedAngle) * anchorDistance,
        event.y1 + Math.sin(lockedAngle) * anchorDistance,
        visualSize, visualSize, Math.min(1, alpha + 0.12), lockedAngle + Math.PI * 0.25);
      return true;
    }
    return false;
  }

  function drawV24AreaEvent(ctx, item, alpha, progress, radius, state) {
    const source = item.source || "";
    if (source === "correction_test_error_area" || source === "correction_test_area_merge") {
      const frame = source === "correction_test_area_merge" ? 3 : clamp((item.mergeCount || 1) - 1, 0, 3);
      drawSpriteFrame(ctx, "correction_fluid_area_v25", frame, item.x, item.y, radius * 2.35, radius * 2.05, Math.min(0.86, alpha + 0.08), (item.areaRotation || 0));
      if (source === "correction_test_area_merge" || item.mergedArea) {
        drawSpriteFrame(ctx, "correction_fluid_glitch_v25", v24Frame(progress), item.x, item.y, radius * 1.72, radius * 1.72, Math.min(0.66, alpha), 0);
      }
      return true;
    }
    if (source === "correction_test_system_crash") {
      drawSpriteFrame(ctx, "correction_fluid_crash_v25", v24Frame(progress), item.x, item.y, radius * 2.22, radius * 2.22, Math.min(1, alpha + 0.12), 0);
      return true;
    }
    if (source === "correction_test_final" || source === "correction_test_final_blast") {
      drawSpriteFrame(ctx, "correction_fluid_final_v25", v24Frame(progress), item.x, item.y, radius * 2.25, radius * 2.25, Math.min(1, alpha + 0.14), 0);
      return true;
    }
    if (source === "correction_test_error_apply" || source === "correction_test_error_overload") {
      const frame = source === "correction_test_error_overload" ? 3 : clamp((item.errorStacks || 1) - 1, 0, 2);
      drawSpriteFrame(ctx, "correction_fluid_glitch_v25", frame, item.x, item.y, radius * 2.05, radius * 2.05, Math.min(0.94, alpha + 0.12), 0);
      return true;
    }
    if (source === "thermos_test_condensation" || source === "thermos_test_fullscreen_condensation") {
      if (item.primitive === "circle_event") return true;
      drawSpriteFrame(ctx, "thermos_condensation_v24", v24Frame(progress), item.x, item.y, radius * 2.18, radius * 2.18, Math.min(0.78, alpha + 0.08), 0);
      return true;
    }
    if (source === "thermos_test_kill_heatwave" || source === "thermos_test_fullscreen_ignition") {
      const silhouettePass = !!(state && state.demoV2 && state.demoV2.skillSilhouettePass);
      const bloom = !!(state && state.demoV2 && state.demoV2.neonBloomPass);
      const ringSize = Math.max(silhouettePass ? 104 : 66, radius * (silhouettePass ? 2.68 : 2.08));
      if (bloom) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.shadowColor = "#ff9d45";
        ctx.shadowBlur = 42;
        drawSpriteFrame(ctx, "thermos_heatwave_v24", v24Frame(progress), item.x, item.y, ringSize * 1.22, ringSize * 1.22, Math.min(0.34, alpha * 0.34 + 0.08), progress * 0.08);
        ctx.restore();
      }
      drawSpriteFrame(ctx, "thermos_heatwave_v24", v24Frame(progress), item.x, item.y, ringSize, ringSize, Math.min(1, alpha + 0.16), progress * 0.08);
      if (silhouettePass) {
        // Kill Heatwave owns a hot core, a fast amber front and a pale outer
        // pressure echo. Condensation remains a soft cyan field, so the two
        // routes no longer read as differently coloured circles.
        drawSprite(ctx, "thermos_release_art", item.x, item.y,
          Math.max(58, radius * (0.78 + progress * 0.28)),
          Math.max(58, radius * (0.78 + progress * 0.28)),
          Math.min(0.98, alpha + 0.18), progress * 0.22);
        drawSprite(ctx, "thermos_wave_art", item.x, item.y,
          ringSize * 1.16, ringSize * 1.16,
          Math.min(0.78, alpha * 0.76 + 0.12), -progress * 0.16);
      }
      return true;
    }
    if (source === "scissors_test_shelter") return true;
    if (source === "scissors_test_shelter_block") {
      drawSpriteFrame(ctx, "scissors_shelter_v27", 2, item.x, item.y, 64, 64, Math.min(1, alpha + 0.16), 0);
      return true;
    }
    return false;
  }

  function beamSpriteFor(kind) {
    return "";
  }

  function circleSpriteFor(kind) {
    if (kind === "trap" || kind === "sticky_attach" || kind === "sticky_spread" || kind === "support_trap") return "sticky_note_v2";
    if (kind === "station") return "thermos_station_v2";
    if (kind === "steam_drone") return "thermos_drone_v2";
    return "";
  }

  function zoneSpriteFor(visual) {
    if (visual === "sticky_note" || visual === "route_note" || visual === "seeking_note" || visual === "notice_node" || visual === "support_trap") return "sticky_note_v2";
    if (visual === "notice_board" || visual === "notice_polygon" || visual === "sticky_link_line" || visual === "link_line") return "";
    if (visual === "sticky_trigger_blast" || visual === "sticky_sync_blast" || visual === "secondary_sticky_blast") return "";
    if (visual === "thermos_drone_module") return "thermos_drone_v2";
    if (visual === "safe_station" || visual === "thermos_station_field") return "thermos_station_v2";
    return "";
  }

  function formResourceSourceMatches(state, source) {
    const type = state.activeForm && state.activeForm.mechanicType;
    const sources = FORM_RESOURCE_SOURCES[type] || [];
    return sources.indexOf(source) >= 0;
  }

  function eventPhase(source) {
    return V2.getWeaponEventPhase ? V2.getWeaponEventPhase(source || "") : "impact";
  }

  function eventVisual(source) {
    return V2.getWeaponVisualEvent ? V2.getWeaponVisualEvent(source || "") : {
      family: "marker",
      phase: eventPhase(source),
      topology: "impact_burst",
      cue: "impact",
      role: "primary",
      priority: 3,
      intensity: 1,
      timeline: ["impact", "fade"],
      palette: { core: "#9ffcff", accent: "#d8ffff", warning: "#ffb067" }
    };
  }

  function eventSignature(source) {
    const forms = V2.weaponFormSignatures || {};
    const keys = Object.keys(forms);
    for (let i = 0; i < keys.length; i++) {
      const sig = forms[keys[i]];
      if (sig.sources && sig.sources.indexOf(source) >= 0) return sig;
    }
    return null;
  }

  function eventProgress(item) {
    return 1 - clamp(item.life / item.maxLife, 0, 1);
  }

  function ringCurrentRadius(item) {
    const activeAge = Math.max(0, (item.age || 0) - (item.delay || 0));
    const progress = clamp(activeAge / Math.max(0.01, item.duration || item.maxLife || 0.4), 0, 1);
    const travel = item.reverse ? 1 - progress : progress;
    return (item.startRadius || 0) + ((item.radius || 0) - (item.startRadius || 0)) * travel;
  }

  const CombatPrimitives = {
    beam(data) {
      return Object.assign({
        primitive: "beam",
        kind: "beam",
        source: "beam",
        color: "#63f7ff",
        width: 5,
        life: 0.18,
        maxLife: data && data.life ? data.life : 0.18
      }, data || {}, { maxLife: data && data.life ? data.life : 0.18 });
    },
    circleEvent(data) {
      return Object.assign({
        primitive: "circle_event",
        kind: "circle",
        source: "circle",
        color: "#63f7ff",
        radius: 48,
        life: 0.28,
        maxLife: data && data.life ? data.life : 0.28
      }, data || {}, { maxLife: data && data.life ? data.life : 0.28 });
    },
    zone(data) {
      return Object.assign({
        primitive: "zone",
        source: "zone",
        type: "circle",
        life: 0.35,
        maxLife: data && data.life ? data.life : 0.35,
        damage: 10,
        tick: 0,
        tickEvery: 0.12,
        color: "#63f7ff",
        hits: {}
      }, data || {}, { maxLife: data && data.life ? data.life : 0.35 });
    },
    projectile(data) {
      return Object.assign({
        primitive: "projectile",
        source: "projectile",
        speed: 360,
        damage: 10,
        radius: 5,
        life: 2,
        color: "#62f7ff"
      }, data || {});
    }
  };

  function traceWeaponEvent(state, type, data) {
    if (!state.stats.weaponEvents) state.stats.weaponEvents = [];
    const payload = Object.assign({
      type,
      stageId: state.stage && state.stage.id,
      formId: state.activeForm && state.activeForm.formId
    }, data || {});
    const visual = eventVisual(payload.source || type);
    payload.vfxPhase = payload.vfxPhase || visual.phase;
    payload.visualFamily = visual.family;
    payload.visualTopology = visual.topology;
    payload.visualCue = visual.cue;
    payload.visualRole = visual.role;
    payload.visualTimeline = visual.timeline.slice();
    state.stats.weaponEvents.push(payload);
    if (V2.audio && V2.audio.handleWeaponEvent) V2.audio.handleWeaponEvent(payload, state);
    if (state.stats.weaponEvents.length > 240) {
      state.stats.weaponEvents.splice(0, state.stats.weaponEvents.length - 240);
    }
  }

  function addBeamEvent(state, x1, y1, x2, y2, color, width, life, kind, sprite, source, meta) {
    const eventSource = source || kind || "beam";
    const visualProfile = eventVisual(eventSource);
    const delay = meta && meta.delay ? meta.delay : 0;
    const event = CombatPrimitives.beam({
      kind: kind || "beam",
      source: eventSource,
      x1, y1, x2, y2,
      color,
      width,
      life: life + delay,
      duration: life,
      delay,
      age: 0,
      sprite: sprite === false ? "" : (sprite || beamSpriteFor(kind || "beam")),
      vfxPhase: eventPhase(eventSource),
      visualProfile,
      signature: eventSignature(eventSource),
      meta: meta || null
    });
    state.formEvents.push(event);
    traceWeaponEvent(state, "beam", Object.assign({ source: event.source, x1, y1, x2, y2, width, sprite: event.sprite, vfxPhase: event.vfxPhase }, meta || {}));
  }

  function addCircleEvent(state, x, y, radius, color, life, kind, sprite, source, meta) {
    const eventSource = source || kind || "circle";
    const visualProfile = eventVisual(eventSource);
    const delay = meta && meta.delay ? meta.delay : 0;
    const event = CombatPrimitives.circleEvent({
      kind: kind || "circle",
      source: eventSource,
      x, y,
      radius,
      color,
      life: life + delay,
      duration: life,
      delay,
      age: 0,
      sprite: sprite === false ? "" : (sprite || circleSpriteFor(kind || "circle")),
      vfxPhase: eventPhase(eventSource),
      visualProfile,
      signature: eventSignature(eventSource),
      meta: meta || null
    });
    state.formEvents.push(event);
    traceWeaponEvent(state, "circle", Object.assign({ source: event.source, x, y, radius, sprite: event.sprite, vfxPhase: event.vfxPhase }, meta || {}));
  }

  function addTextEvent(state, x, y, text, color, life) {
    state.formEvents.push({ kind: "text", x, y, text, color: color || "#d8ffff", life: life || 0.6, maxLife: life || 0.6 });
  }

  function addDamageZone(state, zone) {
    const z = CombatPrimitives.zone(zone);
    z.vfxPhase = z.vfxPhase || eventPhase(z.source || z.visual || z.type);
    z.visualProfile = z.visualProfile || eventVisual(z.source || z.visual || z.type);
    z.signature = z.signature || eventSignature(z.source || z.visual || z.type);
    state.damageZones.push(z);
    traceWeaponEvent(state, "zone", {
      source: z.source || z.visual || z.type,
      x: z.x,
      y: z.y,
      x1: z.x1,
      y1: z.y1,
      x2: z.x2,
      y2: z.y2,
      radius: z.radius,
      width: z.width,
      visual: z.visual,
      vfxPhase: z.vfxPhase
    });
  }

  function damageEnemy(state, enemy, amount, source, knockbackFrom) {
    if (!enemy || enemy.dead) return;
    const markerTest = fixedTestRuntime(state);
    const markerParams = state.activeFormParams || {};
    if (markerTest && markerParams.markerFixedCritChance > 0 && Math.random() < markerParams.markerFixedCritChance) {
      amount *= 2;
      addTextEvent(state, enemy.x, enemy.y - enemy.r - 8, "暴击", "#ffd86b", 0.42);
    }
    if (enemy.armor) {
      amount *= 1 - Math.min(0.6, enemy.armor);
      addCircleEvent(state, enemy.x, enemy.y, enemy.r + 10, enemy.accent || "#d9e6ff", 0.16, "shield");
    }
    if (enemy.boss && enemy.bossHitCap) {
      amount = Math.min(amount, enemy.maxHp * enemy.bossHitCap);
    }
    enemy.hp -= amount;
    const impactVisual = eventVisual(source || "impact");
    enemy.hitFlash = Math.max(enemy.hitFlash || 0, enemy.boss ? 0.16 : 0.12);
    enemy.hitFamily = impactVisual.family;
    enemy.hitSeverity = clamp(amount / Math.max(1, enemy.maxHp || amount), 0.08, 0.42);
    state.stats.damageDone[source] = (state.stats.damageDone[source] || 0) + amount;
    if (markerTest && markerParams.markerFixedLifeStealChance > 0 && markerTest.lifeStealCooldown <= 0
      && state.hp < state.maxHp && Math.random() < markerParams.markerFixedLifeStealChance) {
      state.hp = Math.min(state.maxHp, state.hp + 1);
      markerTest.lifeStealCooldown = 0.1;
      addTextEvent(state, state.player.x, state.player.y - 28, "+1", "#8fffb2", 0.36);
    }
    traceWeaponEvent(state, "hit", { source, enemyId: enemy.id, amount, x: enemy.x, y: enemy.y, hpAfter: enemy.hp, vfxPhase: eventPhase(source) });
    if (knockbackFrom) {
      const dx = enemy.x - knockbackFrom.x;
      const dy = enemy.y - knockbackFrom.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const knockbackPower = knockbackFrom.power == null ? 12 : knockbackFrom.power;
      enemy.x += dx / len * knockbackPower;
      enemy.y += dy / len * knockbackPower;
    }
    if (enemy.hp <= 0) {
      enemy.dead = true;
      handleCorrectionEnemyDeath(state, enemy, source);
      if (enemy.boss) state.stageBossDefeated = true;
      state.kills += 1;
      state.stageKills += 1;
      if (state.demoV2 && state.demoV2.combatExperiencePass && state.formEvents.length < 140) {
        const family = impactVisual.family;
        const defeatSource = family === "thermos" ? "thermos_test_defeat"
          : family === "scissors" ? "scissors_test_defeat"
            : family === "correction_fluid" ? "correction_test_defeat" : "marker_test_defeat";
        const defeatColor = family === "thermos" ? "#ffb45e"
          : family === "scissors" ? "#ff5f72"
            : family === "correction_fluid" ? "#ff3fbd" : "#67f7ff";
        addCircleEvent(state, enemy.x, enemy.y, enemy.r + (enemy.boss ? 44 : 18), defeatColor,
          enemy.boss ? 0.46 : 0.22, "blast", false, defeatSource, { enemyId: enemy.id, boss: !!enemy.boss });
      }
      if (enemy.stickyDebuff) {
        const spread = enemy.stickyDebuff;
        addCircleEvent(state, enemy.x, enemy.y, spread.radius || 120, "#8df7ff", 0.38, "sticky_spread");
        let spreadCount = 0;
        const spreadLimit = spread.limit == null ? 2 : spread.limit;
        for (const other of state.enemies) {
          if (other.dead || other === enemy) continue;
          if (Math.hypot(other.x - enemy.x, other.y - enemy.y) > (spread.radius || 120) + other.r) continue;
          if (spreadCount >= spreadLimit) break;
          if (spread.depth > 0) {
            other.stickyDebuff = {
              radius: spread.radius,
              damage: Math.max(3, (spread.damage || amount * 0.55) * 0.78),
              limit: Math.max(0, spreadLimit - 1),
              depth: spread.depth - 1,
              slow: spread.slow || 0
            };
          }
          damageEnemy(state, other, spread.damage || amount * 0.55, "sticky_spread", enemy);
          if (spread.slow) other.speed *= Math.max(0.45, 1 - spread.slow);
          spreadCount += 1;
        }
      }
      if (enemy.teaScent) {
        const radius = enemy.teaScent.radius || 96;
        addThermosWavefront(state, {
          source: "thermos_tea_echo",
          x: enemy.x,
          y: enemy.y,
          radius,
          damage: enemy.teaScent.damage || 6,
          duration: 0.42,
          thickness: 24,
          color: "#aaf4ff",
          visual: "thermos_tea_echo"
        });
      }
      if (state.activeFormParams && state.activeFormParams.demoV2ForwardHeatwave > 0 &&
          String(source || "").indexOf("thermos") === 0 && source !== "thermos_module_heatwave") {
        const heatwaveCount = state.activeFormParams.demoV2ForwardHeatwave;
        for (let pulseIndex = 0; pulseIndex < heatwaveCount; pulseIndex++) {
          addThermosWavefront(state, {
            source: "thermos_module_heatwave",
            x: enemy.x,
            y: enemy.y,
            radius: 62 + heatwaveCount * 12 + pulseIndex * 28,
            damage: 5 + heatwaveCount * 2.2,
            delay: pulseIndex * 0.12,
            duration: 0.4,
            thickness: 22,
            color: "#c8f7ff",
            slow: 0.18,
            visual: "thermos_tea_echo",
            pulseIndex
          });
        }
      }
      if (enemy.splitType && !enemy.fragment && state.enemies.length < 90) {
        spawnChildEnemy(state, enemy, enemy.splitType, -1);
        spawnChildEnemy(state, enemy, enemy.splitType, 1);
      }
      if (fixedTestConfig(state)) {
        const xpAmount = Math.max(1, Math.round((enemy.xp || 4) * (enemy.markerFixedElite ? 1.8 : 1)));
        state.pickups.push({ type: "xp", x: enemy.x, y: enemy.y, amount: xpAmount, radius: 7, color: "#4a9eff" });
        const luck = (state.activeFormParams && state.activeFormParams.markerFixedLuck) || 0;
        const materialDropChance = 0.018 * (1 + luck / 100);
        const materialAmount = enemy.markerFixedBoss
          ? Math.max(1, enemy.markerFixedBossMaterial || 1)
          : enemy.markerFixedElite ? 2 : Math.random() < materialDropChance ? 1 : 0;
        if (materialAmount > 0) {
          state.pickups.push({ type: "material", x: enemy.x + 8, y: enemy.y - 4, amount: materialAmount, radius: enemy.markerFixedBoss ? 9 : 6, color: "#ffd700", markerFixedDrop: true });
        }
        const healDropChance = enemy.boss || enemy.markerFixedBoss ? 1 : enemy.markerFixedElite ? 0.16 : 0.045;
        if (Math.random() < healDropChance) {
          const healAmount = Math.max(6, Math.round(state.maxHp * (enemy.boss || enemy.markerFixedBoss ? 0.24 : 0.14)));
          state.pickups.push({ type: "heal", x: enemy.x - 8, y: enemy.y + 5, amount: healAmount, radius: 8, color: "#ff6c82", fixedHealDrop: true });
        }
      } else if (!(state.stage && (state.stage.demoV2Phase === "phase-a" || state.stage.demoV2Phase === "phase-b"))) {
        const sourceMatchesResource = formResourceSourceMatches(state, source);
        const xpBonus = sourceMatchesResource ? (state.activeFormParams.xpBonus || 0) : 0;
        const materialBonus = sourceMatchesResource ? (state.activeFormParams.materialBonus || 0) : 0;
        const xpAmount = Math.round((enemy.xp || 4) * (1 + xpBonus));
        state.pickups.push({ type: "xp", x: enemy.x, y: enemy.y, amount: xpAmount, radius: 7, color: "#4a9eff" });
        if (Math.random() < 0.28 + materialBonus) {
          state.pickups.push({ type: "material", x: enemy.x + 8, y: enemy.y - 4, amount: 1, radius: 6, color: "#ffd700" });
        }
      }
      addParticle(state, enemy.x, enemy.y, enemy.boss ? "#ff6b4a" : "#63f7ff", enemy.boss ? 18 : 6);
    }
  }

  function lineHitEnemies(state, x1, y1, x2, y2, width, damage, pierce, source, options) {
    const hits = [];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy || 1;
    for (const enemy of state.enemies) {
      if (enemy.dead) continue;
      if (options && options.excludeEnemies && options.excludeEnemies.has(enemy)) continue;
      const t = clamp(((enemy.x - x1) * dx + (enemy.y - y1) * dy) / len2, 0, 1);
      const px = x1 + dx * t;
      const py = y1 + dy * t;
      const d = Math.hypot(enemy.x - px, enemy.y - py);
      if (d <= width + enemy.r) {
        hits.push({ enemy, t, x: enemy.x, y: enemy.y });
      }
    }
    hits.sort(function (a, b) { return a.t - b.t; });
    const limited = hits.slice(0, Math.max(1, pierce || 1));
    limited.forEach(function (hit) {
      damageEnemy(state, hit.enemy, damage, source, options && options.noKnockback ? null : { x: x1, y: y1 });
    });
    return limited;
  }

  function nearestBranchTarget(state, origin, excludedEnemies, claimedEnemies, range) {
    let best = null;
    let bestDistance = Infinity;
    for (const enemy of state.enemies) {
      if (enemy.dead || enemy === origin) continue;
      if (excludedEnemies && excludedEnemies.has(enemy)) continue;
      if (claimedEnemies && claimedEnemies.has(enemy)) continue;
      const distance = Math.hypot(enemy.x - origin.x, enemy.y - origin.y);
      if (distance > range || distance >= bestDistance) continue;
      best = enemy;
      bestDistance = distance;
    }
    return best;
  }

  function nearestEnemyFromPoint(state, point, range) {
    let best = null;
    let bestDistance = Infinity;
    for (const enemy of state.enemies) {
      if (enemy.dead) continue;
      const distance = Math.hypot(enemy.x - point.x, enemy.y - point.y);
      if (distance < bestDistance && (!range || distance <= range)) {
        best = enemy;
        bestDistance = distance;
      }
    }
    return best;
  }

  function lineEndpointThroughTarget(origin, target, range) {
    const dx = target.x - origin.x;
    const dy = target.y - origin.y;
    const len = Math.hypot(dx, dy) || 1;
    return {
      x: origin.x + dx / len * range,
      y: origin.y + dy / len * range
    };
  }

  function segmentIntersection(a, b) {
    const adx = a.x2 - a.x1;
    const ady = a.y2 - a.y1;
    const bdx = b.x2 - b.x1;
    const bdy = b.y2 - b.y1;
    const denominator = adx * bdy - ady * bdx;
    if (Math.abs(denominator) < 0.0001) return null;
    const ox = b.x1 - a.x1;
    const oy = b.y1 - a.y1;
    const ta = (ox * bdy - oy * bdx) / denominator;
    const tb = (ox * ady - oy * adx) / denominator;
    if (ta < 0.08 || ta > 0.92 || tb < 0.08 || tb > 0.92) return null;
    return { x: a.x1 + adx * ta, y: a.y1 + ady * ta };
  }

  function pointToSegmentDistance(point, line) {
    const dx = line.x2 - line.x1;
    const dy = line.y2 - line.y1;
    const lengthSq = dx * dx + dy * dy || 1;
    const t = clamp(((point.x - line.x1) * dx + (point.y - line.y1) * dy) / lengthSq, 0, 1);
    const x = line.x1 + dx * t;
    const y = line.y1 + dy * t;
    return { distance: Math.hypot(point.x - x, point.y - y), x, y };
  }

  function markerLinesTouch(a, b, padding) {
    const crossing = segmentIntersection(a, b);
    if (crossing) return crossing;
    const samples = [
      { x: a.x1, y: a.y1 },
      { x: a.x2, y: a.y2 },
      { x: (a.x1 + a.x2) * 0.5, y: (a.y1 + a.y2) * 0.5 }
    ];
    let nearest = null;
    samples.forEach(function (point) {
      const candidate = pointToSegmentDistance(point, b);
      if (!nearest || candidate.distance < nearest.distance) nearest = candidate;
    });
    return nearest && nearest.distance <= padding ? { x: nearest.x, y: nearest.y } : null;
  }

  function triggerMarkerCounter(state) {
    const p = state.activeFormParams || {};
    const primaryCounter = !!(state.activeForm && state.activeForm.mechanicType === "shield_counter_line");
    if (!primaryCounter && !p.crossShield) return;
    const maxLines = Math.max(1, primaryCounter ? (p.counterLines || 4) : (p.secondaryCounterLines || 3));
    const counterSource = primaryCounter ? "marker_counter" : "secondary_counter";
    const breakSource = primaryCounter ? "marker_shield_break" : "secondary_shield_break";
    const targets = state.enemies
      .filter(function (enemy) { return !enemy.dead && Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y) <= 380; })
      .sort(function (a, b) {
        return Math.hypot(a.x - state.player.x, a.y - state.player.y) - Math.hypot(b.x - state.player.x, b.y - state.player.y);
      })
      .slice(0, maxLines);
    addCircleEvent(state, state.player.x, state.player.y, 66, "#72ffe5", 0.28, "shield", false, breakSource, {
      targetCount: targets.length
    });
    targets.forEach(function (target, index) {
      const endpoint = lineEndpointThroughTarget(state.player, target, Math.min(280, Math.max(90, Math.hypot(target.x - state.player.x, target.y - state.player.y) + 28)));
      const counterDamage = primaryCounter ? (p.counterDamage || 28) : Math.max(7, (p.damage || 20) * 0.35);
      const counterHits = lineHitEnemies(state, state.player.x, state.player.y, endpoint.x, endpoint.y, 5, counterDamage, 2, counterSource);
      addBeamEvent(state, state.player.x, state.player.y, endpoint.x, endpoint.y, "#72ffe5", 4, 0.22, "counter", false, counterSource, {
        counterIndex: index,
        targetEnemyId: target.id,
        hitEnemyIds: counterHits.map(function (hit) { return hit.enemy.id; })
      });
    });
    traceWeaponEvent(state, "state", {
      source: breakSource,
      shieldAfter: p.shield || 0,
      counterCount: targets.length,
      vfxPhase: eventPhase(breakSource)
    });
  }

  function addMarkerGridField(state, point, p) {
    const duplicate = state.damageZones.some(function (zone) {
      return zone.source === "marker_grid_field" && Math.hypot(zone.x - point.x, zone.y - point.y) < 46;
    });
    if (duplicate) return false;
    const radius = p.gridRadius || 72;
    const duration = p.gridFieldDuration || Math.min(3.4, p.trailDuration || 2.8);
    addCircleEvent(state, point.x, point.y, radius, "#e8d99a", 0.34, "grid", false, "marker_grid_field", {
      intersectionX: point.x,
      intersectionY: point.y
    });
    addDamageZone(state, {
      type: "circle",
      source: "marker_grid_field",
      x: point.x,
      y: point.y,
      radius,
      damage: Math.max(5, p.gridDamage || 11),
      life: duration,
      maxLife: duration,
      tickEvery: 0.34,
      color: "#e8d99a",
      slow: Math.max(0.32, p.gridSlow || 0),
      root: p.gridRoot || 0.16,
      visual: "marker_grid_field"
    });
    return true;
  }

  function drawAtlasCell(ctx, id, column, row, x, y, width, height, alpha, rotation) {
    if (!isSpriteReady(id)) return false;
    const img = runtimeImages[id];
    const cellWidth = img.naturalWidth / 4;
    const cellHeight = img.naturalHeight / 4;
    const inset = 3;
    ctx.save();
    ctx.globalAlpha *= alpha == null ? 1 : alpha;
    ctx.imageSmoothingEnabled = false;
    ctx.translate(x, y);
    if (rotation) ctx.rotate(rotation);
    ctx.drawImage(
      img,
      column * cellWidth + inset,
      row * cellHeight + inset,
      cellWidth - inset * 2,
      cellHeight - inset * 2,
      -width / 2,
      -height / 2,
      width,
      height
    );
    ctx.restore();
    return true;
  }

  function drawCombatProgress(ctx, x, y, width, height, ratio) {
    if (!isSpriteReady("combat_health_track_office") || !isSpriteReady("combat_health_fill_office")) return false;
    const amount = clamp(ratio, 0, 1);
    drawSprite(ctx, "combat_health_track_office", x, y, width, height, 1, 0);
    if (amount <= 0) return true;
    const img = runtimeImages.combat_health_fill_office;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      img,
      0,
      0,
      img.naturalWidth * amount,
      img.naturalHeight,
      x - width / 2,
      y - height / 2,
      width * amount,
      height
    );
    ctx.restore();
    return true;
  }

  function addThermosWavefront(state, data) {
    const delay = data.delay || 0;
    const duration = Math.max(0.3, data.duration || 0.52);
    addDamageZone(state, {
      type: "ring",
      source: data.source,
      x: data.x,
      y: data.y,
      startRadius: data.startRadius || 10,
      radius: data.radius,
      thickness: data.thickness || 30,
      duration,
      delay,
      life: duration + delay,
      maxLife: duration + delay,
      damage: data.damage,
      color: data.color || "#9ddfff",
      slow: data.slow || 0,
      debuff: data.debuff,
      teaRadius: data.teaRadius,
      teaDamage: data.teaDamage,
      noKnockback: !!data.noKnockback,
      visual: data.visual || "thermos_wavefront",
      pulseIndex: data.pulseIndex || 0
    });
  }

  function addThermosSteamFan(state, target, options) {
    const data = options || {};
    const dx = target.x - state.player.x;
    const dy = target.y - state.player.y;
    const len = Math.hypot(dx, dy) || 1;
    const baseUx = dx / len;
    const baseUy = dy / len;
    const angleOffset = data.angleOffset || 0;
    const ux = baseUx * Math.cos(angleOffset) - baseUy * Math.sin(angleOffset);
    const uy = baseUx * Math.sin(angleOffset) + baseUy * Math.cos(angleOffset);
    const nx = -uy;
    const ny = ux;
    const range = data.range || 240;
    const halfWidth = (data.width || 200) / 2;
    const originDistance = 14;
    const originHalfWidth = Math.min(28, halfWidth * 0.28);
    const originX = state.player.x + ux * originDistance;
    const originY = state.player.y + uy * originDistance;
    const farX = state.player.x + ux * range;
    const farY = state.player.y + uy * range;
    const points = [
      { x: originX + nx * originHalfWidth, y: originY + ny * originHalfWidth },
      { x: farX + nx * halfWidth, y: farY + ny * halfWidth },
      { x: farX - nx * halfWidth, y: farY - ny * halfWidth },
      { x: originX - nx * originHalfWidth, y: originY - ny * originHalfWidth }
    ];
    const source = data.source || "thermos_warmup";
    const color = data.color || "#86f7ff";
    const rayOffsets = [-1, -0.5, 0, 0.5, 1];
    rayOffsets.forEach(function (offset) {
      const rayScale = 0.9 - Math.abs(offset) * 0.08;
      addBeamEvent(
        state,
        originX,
        originY,
        state.player.x + ux * range * rayScale + nx * halfWidth * offset,
        state.player.y + uy * range * rayScale + ny * halfWidth * offset,
        color,
        data.rayWidth || 7,
        data.eventLife || 0.2,
        "steam",
        false,
        source,
        { steamFan: true, fanOffset: offset, fanWidth: halfWidth * 2, fanRange: range }
      );
    });
    addDamageZone(state, {
      type: "polygon",
      source,
      points,
      x: (originX + farX) / 2,
      y: (originY + farY) / 2,
      radius: Math.max(halfWidth, range * 0.5),
      damage: data.damage,
      life: data.duration,
      maxLife: data.duration,
      tickEvery: data.tickEvery,
      color,
      slow: data.slow,
      visual: data.visual || "thermos_steam_fan"
    });
  }

  function addThermosSteamFans(state, target, options) {
    const count = Math.max(1, state.activeFormParams.demoV2FanCount || 1);
    const spread = count > 1 ? Math.min(0.58, 0.2 + count * 0.08) : 0;
    for (let index = 0; index < count; index++) {
      const t = count === 1 ? 0 : index / (count - 1) - 0.5;
      addThermosSteamFan(state, target, Object.assign({}, options, {
        angleOffset: t * spread,
        damage: options.damage / Math.max(1, 0.75 + count * 0.25)
      }));
    }
  }

  function addThermosModuleBranches(state, target, isRelease) {
    const p = state.activeFormParams || {};
    if (!target) return;
    if (p.demoV2ThermosArchive > 0) {
      const archiveRadius = 42 + p.demoV2ThermosArchive * 16;
      const archiveLife = 1.1 + p.demoV2ThermosArchive * 0.75;
      addCircleEvent(state, target.x, target.y, archiveRadius, "#d7f8ff", 0.38, "steam_pulse", false, "thermos_module_archive", {
        level: p.demoV2ThermosArchive,
        duration: archiveLife
      });
      addDamageZone(state, {
        type: "circle", source: "thermos_module_archive", x: target.x, y: target.y,
        radius: archiveRadius, damage: 2.5 + p.demoV2ThermosArchive * 2.2,
        life: archiveLife, maxLife: archiveLife, tickEvery: 0.34,
        color: "#d7f8ff", slow: 0.32, visual: "thermos_station_field"
      });
    }
    if (p.demoV2ThermosExpedite > 0 && p.demoV2ThermosExpediteEvery > 0 && state.stats.shots % p.demoV2ThermosExpediteEvery === 0) {
      const angle = (state.stats.shots / p.demoV2ThermosExpediteEvery) % 2 ? 0.18 : -0.18;
      addThermosSteamFan(state, target, {
        source: "thermos_module_expedite",
        angleOffset: angle,
        range: Math.max(160, (isRelease ? p.releaseRange : p.steamRange) * 0.88),
        width: Math.max(120, (isRelease ? p.releaseWidth : p.steamWidth) * (0.58 + p.demoV2ThermosExpedite * 0.06)),
        damage: (isRelease ? p.releaseTickDamage : p.steamTickDamage) * (0.48 + p.demoV2ThermosExpedite * 0.08),
        duration: 0.72 + p.demoV2ThermosExpedite * 0.18,
        tickEvery: isRelease ? p.releaseTickEvery : p.steamTickEvery,
        slow: isRelease ? p.releaseSlow : p.steamSlow,
        rayWidth: isRelease ? 9 : 6,
        eventLife: 0.28,
        color: "#a8ffff",
        visual: "thermos_steam_fan"
      });
    }
    if (!isRelease) return;
    if (p.demoV2ThermosMerge > 0) {
      for (let pulseIndex = 0; pulseIndex < p.demoV2ThermosMerge; pulseIndex++) {
        addThermosWavefront(state, {
          source: "thermos_module_merge", x: target.x, y: target.y,
          radius: 64 + pulseIndex * 34 + p.demoV2ThermosMerge * 10,
          damage: 7 + p.demoV2ThermosMerge * 3,
          delay: pulseIndex * 0.13, duration: 0.46, thickness: 28,
          color: "#d8ffff", slow: 0.24, visual: "thermos_wavefront", pulseIndex
        });
      }
    }
    if (p.demoV2ThermosOverdraft > 0) {
      for (let pulseIndex = 0; pulseIndex < p.demoV2ThermosOverdraft; pulseIndex++) {
        addThermosWavefront(state, {
          source: "thermos_module_overdraft", x: state.player.x, y: state.player.y,
          radius: 96 + pulseIndex * 42,
          damage: 8 + p.demoV2ThermosOverdraft * 4,
          delay: pulseIndex * 0.15, duration: 0.5, thickness: 30,
          color: "#ffd2a1", slow: 0.28, visual: "thermos_wavefront", pulseIndex
        });
      }
    }
  }

  function triggerThermosShieldBreak(state) {
    const p = state.activeFormParams || {};
    const primary = !!(state.activeForm && state.activeForm.mechanicType === "shield_break_pulse");
    if (!primary && !p.crossWarmShield) return;
    const pulseCount = Math.max(1, primary ? (p.pulseCount || 1) : 1);
    const baseRadius = primary ? (p.pulseRadius || 120) : 78;
    const baseDamage = primary ? (p.pulseDamage || 34) : Math.max(6, (p.damage || 12) * 0.36);
    const source = primary ? "thermos_shield_break" : "secondary_thermos_shield_break";
    for (let index = 0; index < pulseCount; index++) {
      addThermosWavefront(state, {
        source,
        x: state.player.x,
        y: state.player.y,
        radius: baseRadius + index * 38,
        damage: baseDamage * (index ? 0.72 : 1),
        delay: index * 0.14,
        duration: 0.48,
        thickness: 30,
        color: "#8fffe7",
        slow: p.slow || 0.2,
        visual: "thermos_shield_wave",
        pulseIndex: index
      });
    }
    addCircleEvent(state, state.player.x, state.player.y, 62, "#8fffe7", 0.28, "shield", false, source, { pulseCount });
    addTextEvent(state, state.player.x, state.player.y - 48, "暖流护盾破裂", "#8fffe7", 0.65);
  }

  function applyMarkerSecondary(state, hits, x1, y1, x2, y2) {
    const p = state.activeFormParams || {};
    if (!p.secondaryDept || !hits.length) return;
    const first = hits[0].enemy;
    if (p.crossSplit) {
      const mainHitEnemies = new Set(hits.map(function (hit) { return hit.enemy; }));
      const claimed = new Set();
      const originHit = hits[0];
      const origin = { x: originHit.x, y: originHit.y, id: originHit.enemy.id };
      for (let index = 0; index < 2; index++) {
        const target = nearestBranchTarget(state, origin, mainHitEnemies, claimed, 170);
        if (!target) break;
        const endpoint = lineEndpointThroughTarget(origin, target, 170);
        const exclusions = new Set(mainHitEnemies);
        claimed.forEach(function (enemy) { exclusions.add(enemy); });
        const branchHits = lineHitEnemies(state, origin.x, origin.y, endpoint.x, endpoint.y, 4, (p.damage || 20) * 0.28, 2, "secondary_split", { excludeEnemies: exclusions });
        branchHits.forEach(function (hit) { claimed.add(hit.enemy); });
        addBeamEvent(state, origin.x, origin.y, endpoint.x, endpoint.y, "#b7fbff", 3.5, 0.16, "beam", false, "secondary_split", {
          targetEnemyId: target.id,
          hitEnemyIds: branchHits.map(function (hit) { return hit.enemy.id; })
        });
      }
    }
    if (p.crossExplode) {
      const radius = Math.max(42, (p.explosionRadius || 58) * 0.62);
      addCircleEvent(state, hits[0].x, hits[0].y, radius, "#aee8ff", 0.3, "blast", false, "secondary_marker_blast");
      addDamageZone(state, { type: "circle", source: "secondary_marker_blast", x: hits[0].x, y: hits[0].y, radius, damage: (p.damage || 20) * 0.45, life: 0.16, maxLife: 0.16, hitOnce: true, color: "#aee8ff", visual: "marker_p0_blast" });
    }
    if (p.crossShield) {
      p.secondaryShieldMax = p.secondaryShieldMax || 24;
      p.shield = Math.min(p.secondaryShieldMax, (p.shield || 0) + hits.length * 1.2);
      addCircleEvent(state, state.player.x, state.player.y, 44 + p.shield / p.secondaryShieldMax * 14, "#84ffe7", 0.18, "shield", false, "secondary_shield_charge", {
        shield: p.shield,
        shieldMax: p.secondaryShieldMax
      });
    }
    if (p.crossWave) {
      const radius = Math.max(58, (p.waveRadius || 96) * 0.68);
      const origin = hits[hits.length - 1];
      addDamageZone(state, { type: "ring", source: "secondary_marker_wave", x: origin.x, y: origin.y, startRadius: 8, radius, thickness: 22, duration: 0.38, life: 0.38, maxLife: 0.38, damage: (p.damage || 20) * 0.28, color: "#9cc8ff", visual: "marker_wavefront" });
    }
    if (p.crossGrid) {
      addDamageZone(state, { type: "line", source: "secondary_marker_grid", x1, y1, x2, y2, width: 6, damage: Math.max(5, (p.gridDamage || p.damage || 20) * 0.32), life: 1.2, maxLife: 1.2, color: "#d9e8a8", slow: 0.12, visual: "marker_grid_line" });
    }
  }

  function addMarkerArchiveLine(state, p, x1, y1, x2, y2, width, copyIndex) {
    if (!(p.demoV2TrailDuration > 0)) return;
    const duration = p.demoV2TrailDuration;
    const trailWidth = p.demoV2TrailWidth || Math.max(16, width * 1.7);
    addBeamEvent(state, x1, y1, x2, y2, "#d7ffff", Math.max(5, trailWidth * 0.42), 0.42, "grid", false, "marker_module_archive", {
      archived: true,
      copyIndex: copyIndex || 0,
      duration
    });
    addDamageZone(state, {
      type: "line", source: "marker_module_archive", x1, y1, x2, y2,
      width: trailWidth, damage: p.demoV2TrailDamage || 10,
      life: duration, maxLife: duration, tickEvery: 0.26,
      color: "#d7ffff", slow: 0.16, root: 0.06, visual: "marker_grid_line"
    });
  }

  function addMarkerModuleLine(state, p, source, angle, damageScale, lineIndex) {
    const range = p.range || 720;
    const x1 = state.player.x;
    const y1 = state.player.y;
    const x2 = x1 + Math.cos(angle) * range;
    const y2 = y1 + Math.sin(angle) * range;
    const width = Math.max(5, (p.width || 8) * 0.82);
    const hits = lineHitEnemies(state, x1, y1, x2, y2, width, (p.damage || 20) * damageScale, p.pierce || 4, source);
    addBeamEvent(state, x1, y1, x2, y2, source === "marker_module_overdraft" ? "#ffcf8c" : "#a8ffff", width, 0.24, "beam", false, source, {
      lineIndex: lineIndex || 0,
      hitEnemyIds: hits.map(function (hit) { return hit.enemy.id; }),
      actualHitCount: hits.length
    });
    return hits;
  }

  function fixedTestConfig(state) {
    return V2.getDemoV2FixedTestConfig ? V2.getDemoV2FixedTestConfig(state) : null;
  }

  function fixedTestRuntime(state) {
    const config = fixedTestConfig(state);
    return config && state.demoV2 ? state.demoV2[config.runtimeKey] : null;
  }

  function markerFixedRuntime(state) {
    return state.demoV2 && state.demoV2.phase === "marker-fixed" ? state.demoV2.marker : null;
  }

  function correctionFluidRuntime(state) {
    return state.demoV2 && state.demoV2.phase === "correction-fluid-fixed" ? state.demoV2.correctionFluid : null;
  }

  function correctionElapsed(state) {
    const config = fixedTestConfig(state);
    return config && config.totalElapsed ? config.totalElapsed(state) : state.totalTime || 0;
  }

  function applyCorrectionError(state, enemy, amount, source) {
    const test = correctionFluidRuntime(state);
    const p = state.activeFormParams || {};
    if (!test || !enemy || enemy.dead) return 0;
    const before = enemy.correctionErrorStacks || 0;
    const after = Math.min(3, before + Math.max(1, amount || 1));
    enemy.correctionErrorStacks = after;
    enemy.correctionErrorTime = p.correctionErrorDuration || 4.8;
    if (after > before) {
      test.totalErrorsApplied += after - before;
      if (after === 3 && before < 3) test.totalOverloads += 1;
      const overload = after >= 3;
      addCircleEvent(state, enemy.x, enemy.y, enemy.r + (overload ? 25 : 16), overload ? "#ff3f7d" : "#67f7ff", overload ? 0.38 : 0.24, "mark", false, overload ? "correction_test_error_overload" : "correction_test_error_apply", {
        errorStacks: after,
        triggerSource: source || "correction_test_spray"
      });
    }
    return after;
  }

  function correctionDamageEnemy(state, enemy, amount, source) {
    if (!enemy || enemy.dead) return;
    const p = state.activeFormParams || {};
    const stacks = enemy.correctionErrorStacks || 0;
    const scale = stacks >= 2 ? (p.correctionVulnerability || 1.28) : 1;
    damageEnemy(state, enemy, amount * scale, source || "correction_test_spray");
  }

  function createCorrectionArea(state, x, y, options) {
    const test = correctionFluidRuntime(state);
    const p = state.activeFormParams || {};
    if (!test || (p.correctionSpreadLevel || 0) < 1) return null;
    const baseRadius = (p.correctionAreaRadius || 72) * ((options && options.small) ? 0.68 : 1);
    const duration = (p.correctionAreaDuration || 3.5) * ((options && options.small) ? 0.55 : 1);
    if (p.correctionAreaMerge && !(options && options.small)) {
      const nearby = state.damageZones.find(function (zone) {
        return zone.correctionArea && zone.life > 0 && Math.hypot(zone.x - x, zone.y - y) <= zone.radius + baseRadius * 0.72;
      });
      if (nearby) {
        const oldRadius = nearby.radius;
        nearby.x = (nearby.x + x) * 0.5;
        nearby.y = (nearby.y + y) * 0.5;
        nearby.radius = Math.min((p.correctionAreaRadius || 72) * 1.55, Math.sqrt(oldRadius * oldRadius + baseRadius * baseRadius) * 1.02);
        nearby.life = Math.max(nearby.life, duration);
        nearby.maxLife = Math.max(nearby.maxLife || 0, nearby.life);
        nearby.source = "correction_test_area_merge";
        nearby.mergedArea = true;
        nearby.mergeCount = Math.min(4, (nearby.mergeCount || 1) + 1);
        nearby.errorApplied = {};
        test.totalAreaMerges += 1;
        test.largestErrorArea = Math.max(test.largestErrorArea || 0, nearby.radius);
        addCircleEvent(state, nearby.x, nearby.y, nearby.radius, "#ff42c7", 0.48, "field", false, "correction_test_area_merge", { mergeCount: nearby.mergeCount });
        return nearby;
      }
    }
    const zone = {
      type: "circle",
      source: "correction_test_error_area",
      x, y,
      radius: baseRadius,
      damage: (p.correctionAreaDamage || 1.2) * ((options && options.small) ? 0.55 : 1),
      life: duration,
      maxLife: duration,
      tickEvery: p.correctionAreaTick || 0.7,
      color: "#eafcff",
      noKnockback: true,
      visual: "correction_error_field",
      correctionArea: true,
      correctionAreaId: test.nextAreaId++,
      errorApplied: {},
      mergedArea: false,
      mergeCount: 1,
      areaRotation: (test.nextAreaId % 5 - 2) * 0.08,
      smallCorrectionArea: !!(options && options.small)
    };
    addDamageZone(state, zone);
    addCircleEvent(state, x, y, baseRadius * 0.9, "#eefeff", 0.34, "field", false, "correction_test_error_area", {
      infectionPulse: true,
      areaId: zone.correctionAreaId
    });
    test.totalAreasCreated += 1;
    test.largestErrorArea = Math.max(test.largestErrorArea || 0, baseRadius);
    return zone;
  }

  function triggerCorrectionFinalBlast(state, enemy) {
    const test = correctionFluidRuntime(state);
    const p = state.activeFormParams || {};
    if (!test || !enemy) return;
    const radius = p.correctionFinalBlastRadius || 72;
    addCircleEvent(state, enemy.x, enemy.y, radius, "#67f7ff", 0.42, "blast", false, "correction_test_final_blast", { finalKill: true });
    state.enemies.slice().forEach(function (other) {
      if (other.dead || other === enemy || Math.hypot(other.x - enemy.x, other.y - enemy.y) > radius + other.r) return;
      applyCorrectionError(state, other, 1, "correction_test_final_blast");
      correctionDamageEnemy(state, other, p.correctionFinalBlastDamage || 7, "correction_test_final_blast");
    });
  }

  function handleCorrectionEnemyDeath(state, enemy, source) {
    const test = correctionFluidRuntime(state);
    const p = state.activeFormParams || {};
    if (!test || !enemy) return;
    const stacks = enemy.correctionErrorStacks || 0;
    if (source !== "correction_test_rollback" && stacks >= 3) triggerCorrectionCascadingRollback(state, test, p, enemy);
    if (source !== "correction_test_system_crash" && stacks >= 3 && (p.correctionSpreadLevel || 0) >= 1) createCorrectionArea(state, enemy.x, enemy.y);
    if (source === "correction_test_final") {
      test.totalFinalKills += 1;
      triggerCorrectionFinalBlast(state, enemy);
    }
  }

  function triggerCorrectionCascadingRollback(state, test, p, triggerEnemy) {
    if (!p.correctionCascadingRollback || !test) return false;
    const elapsed = correctionElapsed(state);
    if (elapsed < (test.rollbackReadyAt || 0)) return false;
    const areas = state.damageZones.filter(function (zone) {
      return zone.correctionArea && zone.life > 0;
    }).slice(0, 5);
    if (!areas.length) return false;
    let hitCount = 0;
    areas.forEach(function (area, index) {
      addCircleEvent(state, area.x, area.y, area.radius * 1.02, index % 2 ? "#ff65dc" : "#75f8ff", 0.44, "detonate", false, "correction_test_rollback", {
        areaId: area.correctionAreaId,
        triggerEnemyId: triggerEnemy && triggerEnemy.id,
        rollbackIndex: index
      });
      state.enemies.slice().forEach(function (enemy) {
        if (enemy.dead || Math.hypot(enemy.x - area.x, enemy.y - area.y) > area.radius + enemy.r) return;
        applyCorrectionError(state, enemy, 1, "correction_test_rollback");
        correctionDamageEnemy(state, enemy, p.correctionRollbackDamage || 2, "correction_test_rollback");
        hitCount += 1;
      });
      area.life = Math.min(area.maxLife || area.life, area.life + 0.28);
    });
    addTextEvent(state, triggerEnemy.x, triggerEnemy.y - triggerEnemy.r - 22, "级联回滚", "#ff8fe7", 0.62);
    test.rollbackReadyAt = elapsed + (p.correctionRollbackCooldown || 0.82);
    test.totalRollbacks += 1;
    test.totalRollbackHits += hitCount;
    return true;
  }

  function triggerCorrectionSystemCrash(state, test, p, elapsed) {
    if (!p.correctionCrashEnabled || elapsed < (test.crashReadyAt || 0)) return false;
    const areas = state.damageZones.filter(function (zone) { return zone.correctionArea && zone.life > 0; });
    if (areas.length < (p.correctionCrashAreaThreshold || 3)) return false;
    const affected = new Set();
    areas.forEach(function (area) {
      addCircleEvent(state, area.x, area.y, area.radius * 1.08, "#ff3f7d", 0.62, "blast", false, "correction_test_system_crash", { areaId: area.correctionAreaId, mergeCount: area.mergeCount || 1 });
      state.enemies.forEach(function (enemy) {
        if (!enemy.dead && Math.hypot(enemy.x - area.x, enemy.y - area.y) <= area.radius + enemy.r) affected.add(enemy);
      });
      area.life = 0;
    });
    affected.forEach(function (enemy) {
      const stacks = enemy.correctionErrorStacks || 0;
      correctionDamageEnemy(state, enemy, (p.correctionCrashDamage || 20) * (1 + stacks * 0.34), "correction_test_system_crash");
    });
    test.crashReadyAt = elapsed + (p.correctionCrashCooldown || 5.4);
    test.totalSystemCrashes += 1;
    return true;
  }

  function triggerFinalCorrection(state, test, p, elapsed) {
    if (!p.correctionFinalEnabled || elapsed < (test.finalReadyAt || 0)) return false;
    const candidates = state.enemies.filter(function (enemy) { return !enemy.dead && (enemy.correctionErrorStacks || 0) > 0; });
    if (!candidates.length) return false;
    candidates.sort(function (a, b) {
      return (b.correctionErrorStacks || 0) - (a.correctionErrorStacks || 0) || b.maxHp - a.maxHp || a.hp - b.hp;
    });
    const target = candidates[0];
    const stacks = target.correctionErrorStacks || 0;
    target.correctionErrorStacks = 0;
    target.correctionErrorTime = 0;
    const damage = (p.correctionFinalDamage || 16) + target.maxHp * (p.correctionFinalPercentPerStack || 0.025) * stacks;
    addCircleEvent(state, target.x, target.y, target.r + 46, "#79f7ff", 0.6, "detonate", false, "correction_test_final", { errorStacks: stacks, targetId: target.id });
    correctionDamageEnemy(state, target, damage, "correction_test_final");
    test.finalReadyAt = elapsed + (p.correctionFinalCooldown || 3.8);
    test.totalFinalCorrections += 1;
    return true;
  }

  function fireCorrectionFluidFixedTest(state) {
    const test = correctionFluidRuntime(state);
    const p = state.activeFormParams || {};
    if (!test) return;
    const elapsed = correctionElapsed(state);
    triggerCorrectionSystemCrash(state, test, p, elapsed);
    const candidates = state.enemies.filter(function (enemy) {
      return !enemy.dead && Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y) <= (p.range || 360) + enemy.r;
    });
    const distanceToPlayer = function (enemy) { return Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y); };
    candidates.sort(function (a, b) { return distanceToPlayer(a) - distanceToPlayer(b); });
    const targets = [];
    if (candidates.length) targets.push(candidates.shift());
    candidates.sort(function (a, b) {
      const distanceBand = Math.floor(distanceToPlayer(a) / 90) - Math.floor(distanceToPlayer(b) / 90);
      return distanceBand || a.hp - b.hp || (b.correctionErrorStacks || 0) - (a.correctionErrorStacks || 0) || distanceToPlayer(a) - distanceToPlayer(b);
    });
    targets.push.apply(targets, candidates.slice(0, Math.max(0, (p.correctionTargetCount || 1) - 1)));
    if (targets.length) {
      test.weaponVisualAngles = targets.map(function (target) {
        return Math.atan2(target.y - state.player.y, target.x - state.player.x);
      });
      test.facingAngle = test.weaponVisualAngles[0];
      test.weaponVisualTime = 0.26;
    }
    targets.forEach(function (target, index) {
      const angle = Math.atan2(target.y - state.player.y, target.x - state.player.x);
      const x1 = state.player.x + Math.cos(angle) * 20;
      const y1 = state.player.y + Math.sin(angle) * 20;
      addCircleEvent(state, target.x, target.y, target.r + 14 + index * 3,
        index ? "#ff5bd5" : "#79f7ff", 0.18, "mark", false, "correction_test_lock", {
          targetId: target.id,
          targetIndex: index,
          errorStacks: target.correctionErrorStacks || 0
        });
      applyCorrectionError(state, target, 1, "correction_test_spray");
      correctionDamageEnemy(state, target, (p.damage || 7) * (index ? 0.86 : 1), "correction_test_spray");
      // A spread build cannot rely on killing the Boss to create its core
      // battlefield object. An overloaded Boss periodically leaks one real
      // error area, keeping the route alive without turning it into poison DPS.
      if (target.boss && (target.correctionErrorStacks || 0) >= 3 && (p.correctionSpreadLevel || 0) >= 1
        && elapsed >= (test.bossAreaLeakReadyAt || 0)) {
        createCorrectionArea(state, target.x, target.y, { bossLeak: true });
        test.bossAreaLeakReadyAt = elapsed + 3.2;
        addTextEvent(state, target.x, target.y - target.r - 18, "错误泄漏", "#ff72d8", 0.52);
      }
      addBeamEvent(state, x1, y1, target.x, target.y, index % 2 ? "#ff5bd5" : "#dfffff", p.width || 24, 0.27, "steam", false, "correction_test_spray", { targetId: target.id, targetIndex: index, errorStacks: target.correctionErrorStacks || 0 });
      if (index === 0 && p.correctionOpeningOverspray) {
        const oversprayRadius = p.correctionOpeningOversprayRadius || 68;
        const oversprayTarget = state.enemies.filter(function (enemy) {
          return !enemy.dead && enemy !== target && targets.indexOf(enemy) < 0
            && Math.hypot(enemy.x - target.x, enemy.y - target.y) <= oversprayRadius + enemy.r;
        }).sort(function (a, b) {
          return Math.hypot(a.x - target.x, a.y - target.y) - Math.hypot(b.x - target.x, b.y - target.y);
        })[0];
        if (oversprayTarget) {
          applyCorrectionError(state, oversprayTarget, 1, "correction_test_spray");
          correctionDamageEnemy(state, oversprayTarget, (p.damage || 7) * (p.correctionOpeningOversprayDamageScale || 0.52), "correction_test_spray");
          addCircleEvent(state, target.x, target.y, oversprayRadius, "#ff5bd5", 0.16, "mark", false, "correction_test_spray", {
            targetId: target.id,
            oversprayTargetId: oversprayTarget.id,
            overspray: true
          });
          addBeamEvent(state, target.x, target.y, oversprayTarget.x, oversprayTarget.y, "#ff8de5", Math.max(9, (p.width || 24) * 0.54), 0.2, "steam", false, "correction_test_spray", {
            targetId: oversprayTarget.id,
            oversprayFromId: target.id,
            overspray: true
          });
        }
      }
    });
    if (targets.length) state.stats.shots += 1;
    triggerFinalCorrection(state, test, p, elapsed);
  }

  function markerFixedLine(state, p, angle, offset, source, damageScale, baseIndex, laneIndex) {
    const range = p.range || 720;
    const nx = -Math.sin(angle);
    const ny = Math.cos(angle);
    const x1 = state.player.x + nx * offset;
    const y1 = state.player.y + ny * offset;
    const x2 = x1 + Math.cos(angle) * range;
    const y2 = y1 + Math.sin(angle) * range;
    const width = Math.max(5, p.width || 8);
    const hits = lineHitEnemies(
      state, x1, y1, x2, y2, width,
      (p.damage || 18) * damageScale,
      p.pierce || 4,
      source,
      { noKnockback: true }
    );
    addBeamEvent(state, x1, y1, x2, y2, source === "marker_test_copy" ? "#79efff" : "#d8ffff", width, 0.2, "beam", false, source, {
      baseIndex, laneIndex,
      hitEnemyIds: hits.map(function (hit) { return hit.enemy.id; }),
      actualHitCount: hits.length,
      pierceLimit: p.pierce || 4
    });
    return { x1, y1, x2, y2, angle, width };
  }

  function addMarkerFixedArchive(state, p, line, baseIndex) {
    const trailCount = p.markerFixedArchiveTrails || 0;
    if (!trailCount) return;
    const coverageScale = p.markerFixedCoverageScale || 1;
    const coverageSpread = 1 + Math.max(0, coverageScale - 1) * 0.55;
    const spacing = Math.max(28, (p.width || 8) * 3.4) * coverageSpread;
    const offsets = trailCount === 1 ? [0] : trailCount === 2 ? [-spacing * 0.55, spacing * 0.55] : [-spacing, 0, spacing];
    const nx = -Math.sin(line.angle);
    const ny = Math.cos(line.angle);
    offsets.forEach(function (offset, trailIndex) {
      const x1 = line.x1 + nx * offset;
      const y1 = line.y1 + ny * offset;
      const x2 = line.x2 + nx * offset;
      const y2 = line.y2 + ny * offset;
      const duration = p.markerFixedTrailDuration || 2;
      addDamageZone(state, {
        type: "line", source: "marker_test_archive", x1, y1, x2, y2,
        width: Math.max(32, line.width * 3.6) * (1 + Math.max(0, coverageScale - 1) * 0.35),
        damage: (p.markerFixedTrailDamage || 5) * ([1, 0.75, 0.58, 0.44, 0.38][p.markerFixedArchiveLevel || 0] || 0.38),
        life: duration, maxLife: duration, tickEvery: 0.44,
        color: "#77b9d8", slow: 0.24, visual: "marker_grid_line",
        inkTrail: true, inkSeed: baseIndex * 7 + trailIndex * 13, noKnockback: true,
        markerAttackSerial: markerFixedRuntime(state) ? markerFixedRuntime(state).attackSerial : 0,
        retrievalReadyAt: 0
      });
    });
  }

  function triggerMarkerFixedRetrieval(state, p, test, copyLine) {
    if (!p.markerFixedRetrieval || !test || !copyLine) return;
    const now = state.totalTime || 0;
    const maxPerAttack = Math.max(1, p.markerFixedRetrievalMaxPerAttack || 2);
    if (test.retrievalAttackSerial !== test.attackSerial) {
      test.retrievalAttackSerial = test.attackSerial;
      test.retrievalTriggersThisAttack = 0;
    }
    if ((test.retrievalTriggersThisAttack || 0) >= maxPerAttack) return;
    let triggered = 0;
    const oldArchives = state.damageZones.filter(function (zone) {
      return zone.inkTrail
        && zone.source === "marker_test_archive"
        && zone.life > 0
        && (zone.markerAttackSerial || 0) < test.attackSerial
        && now >= (zone.retrievalReadyAt || 0);
    });
    for (const zone of oldArchives) {
      if ((test.retrievalTriggersThisAttack || 0) + triggered >= maxPerAttack) break;
      const contact = markerLinesTouch(copyLine, zone, Math.max(26, copyLine.width * 0.5 + zone.width * 0.5 + 8));
      if (!contact) continue;
      const hits = lineHitEnemies(
        state,
        zone.x1, zone.y1, zone.x2, zone.y2,
        Math.max(12, zone.width * 0.52),
        p.markerFixedRetrievalDamage || 3,
        999,
        "marker_test_retrieval",
        { noKnockback: true }
      );
      addBeamEvent(
        state,
        zone.x1, zone.y1, zone.x2, zone.y2,
        "#ff65dc",
        Math.max(9, zone.width * 0.34),
        0.34,
        "grid",
        false,
        "marker_test_retrieval",
        {
          archiveSerial: zone.markerAttackSerial,
          attackSerial: test.attackSerial,
          contactX: contact.x,
          contactY: contact.y,
          hitEnemyIds: hits.map(function (hit) { return hit.enemy.id; }),
          actualHitCount: hits.length
        }
      );
      addCircleEvent(state, contact.x, contact.y, Math.max(22, zone.width * 0.7), "#ff65dc", 0.3, "mark", false, "marker_test_retrieval", {
        archiveSerial: zone.markerAttackSerial,
        attackSerial: test.attackSerial
      });
      addTextEvent(state, contact.x, contact.y - 18, "调阅", "#ff8fe7", 0.55);
      zone.life = Math.min(zone.maxLife * 1.3, zone.life + (p.markerFixedRetrievalExtend || 0.4));
      zone.retrievalReadyAt = now + 0.78;
      test.retrievalTriggers = (test.retrievalTriggers || 0) + 1;
      test.retrievalHits = (test.retrievalHits || 0) + hits.length;
      triggered += 1;
    }
    test.retrievalTriggersThisAttack = (test.retrievalTriggersThisAttack || 0) + triggered;
  }

  function triggerMarkerFixedFullscreenCopy(state, p, test, elapsed) {
    if (!p.markerFixedFullscreenCopy || elapsed < (test.fullscreenCopyReadyAt || 0)) return;
    const mastery = !!p.markerFixedPureCopyMastery;
    if (Math.random() >= (mastery ? 0.23 : (p.markerFixedFullscreenChance || 0.15))) return;
    const camera = state.camera || { x: 0, y: 0, width: W, height: H };
    const lines = [
      [camera.x - 24, camera.y + camera.height * 0.22, camera.x + camera.width + 24, camera.y + camera.height * 0.22],
      [camera.x - 24, camera.y + camera.height * 0.5, camera.x + camera.width + 24, camera.y + camera.height * 0.5],
      [camera.x - 24, camera.y + camera.height * 0.78, camera.x + camera.width + 24, camera.y + camera.height * 0.78],
      [camera.x + camera.width * 0.08, camera.y - 24, camera.x + camera.width * 0.92, camera.y + camera.height + 24],
      [camera.x + camera.width * 0.92, camera.y - 24, camera.x + camera.width * 0.08, camera.y + camera.height + 24]
    ];
    lines.forEach(function (line, lineIndex) {
      const lineWidth = Math.max(8, (p.width || 8) * (mastery ? 1.65 : 1.25));
      const hits = lineHitEnemies(state, line[0], line[1], line[2], line[3], lineWidth, (p.damage || 18) * (mastery ? 0.64 : 0.46), p.pierce || 4, "marker_test_fullscreen_copy", { noKnockback: true });
      addBeamEvent(state, line[0], line[1], line[2], line[3], "#e9ffff", lineWidth, 0.42, "beam", false, "marker_test_fullscreen_copy", {
        lineIndex,
        hitEnemyIds: hits.map(function (hit) { return hit.enemy.id; }),
        actualHitCount: hits.length
      });
    });
    test.fullscreenCopyReadyAt = elapsed + (mastery ? 3.5 : (p.markerFixedFullscreenCooldown || 4.5));
    test.fullscreenCopyTriggers += 1;
  }

  function triggerMarkerFixedFullscreenArchive(state, p, test, elapsed) {
    if (!p.markerFixedFullscreenArchive || elapsed < (test.fullscreenArchiveReadyAt || 0)) return;
    const mastery = !!p.markerFixedPureArchiveMastery;
    if (Math.random() >= (mastery ? 0.23 : (p.markerFixedFullscreenChance || 0.15))) return;
    const camera = state.camera || { x: 0, y: 0, width: W, height: H };
    const duration = Math.max(1.25, (p.markerFixedTrailDuration || 2) * (mastery ? 1.02 : 0.72));
    const bands = 5;
    const rangeScale = clamp((p.range || 720) / 720, 1, 1.6);
    for (let index = 0; index < bands; index++) {
      const y = camera.y + camera.height * (index + 0.5) / bands;
      addBeamEvent(state, camera.x - 24, y, camera.x + camera.width + 24, y, "#6eaee7", camera.height / bands * 0.68, Math.min(0.75, duration), "grid", false, "marker_test_fullscreen_archive", { bandIndex: index, duration });
      addDamageZone(state, {
        type: "line", source: "marker_test_fullscreen_archive",
        x1: camera.x - 24, y1: y, x2: camera.x + camera.width + 24, y2: y,
        width: camera.height / bands * 0.56 * rangeScale,
        damage: (p.markerFixedTrailDamage || 5) * (mastery ? 0.66 : 0.48),
        life: duration, maxLife: duration, tickEvery: 0.42,
        color: "#6eaee7", slow: 0.26, visual: "marker_grid_line", inkTrail: true, inkSeed: index * 11, noKnockback: true
      });
    }
    test.fullscreenArchiveReadyAt = elapsed + (mastery ? 3.5 : (p.markerFixedFullscreenCooldown || 4.5));
    test.fullscreenArchiveTriggers += 1;
  }

  function fireMarkerFixedTest(state, delayedRound) {
    const p = state.activeFormParams || {};
    const test = markerFixedRuntime(state);
    if (!test) return;
    const range = p.range || 720;
    // A Boss is the mandatory objective of its encounter. When it is already
    // inside the line's real acquisition range, aim the piercing attack at it;
    // the line can still cut through adds on the same path. This prevents a
    // nearby stream of disposable enemies from making the objective invisible.
    const target = state.enemies.find(function (enemy) {
      return !enemy.dead && enemy.boss
        && Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y) <= range + enemy.r;
    }) || nearestEnemy(state, range);
    if (!target) return;
    test.attackSerial = (test.attackSerial || 0) + 1;
    const baseAngle = Math.atan2(target.y - state.player.y, target.x - state.player.x);
    test.weaponVisualAngle = baseAngle;
    test.weaponVisualTime = 0.38;
    const baseAmount = Math.max(1, p.amount || 1);
    const angleStep = 0.075;
    const coverageScale = p.markerFixedCoverageScale || 1;
    const copySpacing = Math.max(22, (p.width || 8) * 3.4) * (1 + Math.max(0, coverageScale - 1) * 0.55);
    const copyLevel = p.markerFixedCopyLevel || 0;
    const baseScale = p.markerFixedBaseLineScale || (copyLevel >= 4 ? 0.78 : copyLevel >= 3 ? 0.86 : 1);
    const copyScale = p.markerFixedCopyLineScale || (copyLevel >= 4 ? 0.44 : copyLevel >= 3 ? 0.5 : 0.58);
    const roundScale = delayedRound ? (p.markerFixedSecondRoundScale || 0.62) : 1;
    for (let baseIndex = 0; baseIndex < baseAmount; baseIndex++) {
      const angle = baseAngle + (baseIndex - (baseAmount - 1) / 2) * angleStep;
      const baseLine = markerFixedLine(state, p, angle, 0, delayedRound ? "marker_test_second_round" : "marker_test_base", baseScale * roundScale, baseIndex, 0);
      addMarkerFixedArchive(state, p, baseLine, baseIndex);
      const parallel = p.markerFixedParallelLines || 0;
      if (parallel === 1) {
        const copyLine = markerFixedLine(state, p, angle, copySpacing, "marker_test_copy", copyScale * roundScale, baseIndex, 1);
        triggerMarkerFixedRetrieval(state, p, test, copyLine);
      }
      if (parallel >= 2) {
        const positiveCopy = markerFixedLine(state, p, angle, copySpacing, "marker_test_copy", copyScale * roundScale, baseIndex, 1);
        const negativeCopy = markerFixedLine(state, p, angle, -copySpacing, "marker_test_copy", copyScale * roundScale, baseIndex, 2);
        triggerMarkerFixedRetrieval(state, p, test, positiveCopy);
        triggerMarkerFixedRetrieval(state, p, test, negativeCopy);
      }
    }
    if (delayedRound) return;
    state.stats.shots += 1;
    const elapsed = V2.demoV2 && V2.demoV2.markerFixed && V2.demoV2.markerFixed.totalElapsed
      ? V2.demoV2.markerFixed.totalElapsed(state)
      : Math.max(0, 720 - state.stageTime);
    triggerMarkerFixedFullscreenCopy(state, p, test, elapsed);
    triggerMarkerFixedFullscreenArchive(state, p, test, elapsed);
    if (p.markerFixedSecondRound) test.pendingRounds.push({ due: elapsed + 0.22 });
  }

  function updateMarkerFixedPendingRounds(state) {
    const test = markerFixedRuntime(state);
    if (!test || !test.pendingRounds.length) return;
    const elapsed = V2.demoV2 && V2.demoV2.markerFixed && V2.demoV2.markerFixed.totalElapsed
      ? V2.demoV2.markerFixed.totalElapsed(state)
      : Math.max(0, 720 - state.stageTime);
    const ready = test.pendingRounds.filter(function (round) { return round.due <= elapsed; });
    test.pendingRounds = test.pendingRounds.filter(function (round) { return round.due > elapsed; });
    ready.forEach(function () { fireMarkerFixedTest(state, true); });
  }

  function scissorsFixedRuntime(state) {
    return state.demoV2 && state.demoV2.phase === "scissors-fixed" ? state.demoV2.scissors : null;
  }

  function angleDistance(a, b) {
    return Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
  }

  function recordScissorsTargets(test, hits) {
    if (!test) return;
    (hits || []).forEach(function (hit) {
      const enemy = hit.enemy || hit;
      if (enemy && test.roundTargetIds.indexOf(enemy.id) < 0) test.roundTargetIds.push(enemy.id);
    });
  }

  function scissorsLine(state, p, angle, range, width, damage, source) {
    const x1 = state.player.x + Math.cos(angle) * 16;
    const y1 = state.player.y + Math.sin(angle) * 16;
    const x2 = state.player.x + Math.cos(angle) * range;
    const y2 = state.player.y + Math.sin(angle) * range;
    const hits = lineHitEnemies(state, x1, y1, x2, y2, width, damage, 99, source, { noKnockback: true });
    addBeamEvent(state, x1, y1, x2, y2, source === "scissors_test_sever" ? "#ff6d62" : "#e9f3f5", width, source === "scissors_test_sever" ? 0.42 : 0.3, "beam", false, source, {
      lockedAngle: angle,
      hitEnemyIds: hits.map(function (hit) { return hit.enemy.id; }),
      actualHitCount: hits.length
    });
    recordScissorsTargets(scissorsFixedRuntime(state), hits);
    if (p.scissorsCrossCut && (source === "scissors_test_thrust" || source === "scissors_test_sever")) {
      const test = scissorsFixedRuntime(state);
      hits.forEach(function (hit) {
        const enemy = hit.enemy;
        if (!enemy || enemy.dead || (enemy.scissorsCutSeamTime || 0) <= 0) return;
        enemy.scissorsCutSeamTime = 0;
        const radius = enemy.r + 34;
        const diagonal = Math.PI / 4;
        [diagonal, -diagonal].forEach(function (offset, index) {
          const cutAngle = angle + offset;
          addBeamEvent(
            state,
            enemy.x - Math.cos(cutAngle) * radius,
            enemy.y - Math.sin(cutAngle) * radius,
            enemy.x + Math.cos(cutAngle) * radius,
            enemy.y + Math.sin(cutAngle) * radius,
            index ? "#77f7ff" : "#ff66db",
            12,
            0.36,
            "beam",
            false,
            "scissors_test_crosscut",
            { targetEnemyId: enemy.id, lockedAngle: angle, crossIndex: index }
          );
        });
        damageEnemy(state, enemy, p.scissorsCrossCutDamage || 4, "scissors_test_crosscut");
        test.totalCrossCuts += 1;
        test.totalCrossCutHits += 1;
        addTextEvent(state, enemy.x, enemy.y - enemy.r - 20, "交叉裁切", "#ff8fe7", 0.52);
      });
    }
    return hits;
  }

  function scissorsFan(state, p, angle, range, halfAngle, damage, source, cutIndex) {
    const test = scissorsFixedRuntime(state);
    const hits = [];
    state.enemies.forEach(function (enemy) {
      if (enemy.dead) return;
      const dx = enemy.x - state.player.x;
      const dy = enemy.y - state.player.y;
      const distance = Math.hypot(dx, dy);
      if (distance > range + enemy.r) return;
      if (angleDistance(Math.atan2(dy, dx), angle) > halfAngle) return;
      damageEnemy(state, enemy, damage, source);
      hits.push({ enemy });
      if (source === "scissors_test_open") {
        test.openHitsByEnemy[enemy.id] = (test.openHitsByEnemy[enemy.id] || 0) + 1;
        test.totalOpenHits += 1;
        if (p.scissorsCrossCut && !enemy.dead) {
          enemy.scissorsCutSeamTime = p.scissorsCrossCutMarkDuration || 1.7;
          addCircleEvent(state, enemy.x, enemy.y, enemy.r + 18, "#b86cff", 0.24, "mark", false, "scissors_test_cut_seam", {
            targetEnemyId: enemy.id,
            cutIndex
          });
        }
      }
    });
    const left = angle - halfAngle;
    const right = angle + halfAngle;
    const cutDuration = source === "scissors_test_finale" ? 0.42 : 0.3;
    addBeamEvent(state, state.player.x, state.player.y, state.player.x + Math.cos(left) * range, state.player.y + Math.sin(left) * range, "#ffb255", 7, cutDuration, "beam", false, source, { cutIndex, lockedAngle: angle, fanRange: range, fanHalfAngle: halfAngle, edge: "left", actualHitCount: hits.length });
    addBeamEvent(state, state.player.x, state.player.y, state.player.x + Math.cos(right) * range, state.player.y + Math.sin(right) * range, "#fff0bd", 7, cutDuration, "beam", false, source, { cutIndex, lockedAngle: angle, fanRange: range, fanHalfAngle: halfAngle, edge: "right", actualHitCount: hits.length });
    recordScissorsTargets(test, hits);
    return hits;
  }

  function executeScissorsAction(state, action) {
    const p = state.activeFormParams || {};
    const test = scissorsFixedRuntime(state);
    if (!test) return;
    test.weaponVisualAngle = action.angle;
    test.weaponVisualTime = action.kind === "finale" || action.kind === "sever" ? 0.42 : 0.3;
    test.weaponVisualKind = action.kind;
    if (action.kind === "base") {
      scissorsFan(state, p, action.angle, p.scissorsBaseRange || 138, p.scissorsBaseHalfAngle || 0.44, p.damage || 28, "scissors_test_base", 0);
      return;
    }
    if (action.kind === "thrust") {
      const hits = scissorsLine(state, p, action.angle, p.scissorsThrustRange || 150, p.scissorsThrustWidth || 26, p.scissorsThrustDamage || p.damage, "scissors_test_thrust");
      test.totalClosedHits += hits.length;
      return;
    }
    if (action.kind === "sever") {
      const hits = scissorsLine(state, p, action.angle, p.scissorsSeverRange || 215, p.scissorsSeverWidth || 52, p.scissorsSeverDamage || p.damage * 1.8, "scissors_test_sever");
      hits.forEach(function (hit) {
        const enemy = hit.enemy;
        const slowScale = enemy.boss ? 0.22 : enemy.markerFixedElite ? 0.55 : 1;
        enemy.scissorsSlowTime = Math.max(enemy.scissorsSlowTime || 0, (p.scissorsSeverSlowDuration || 1.75) * slowScale);
        enemy.scissorsSlow = (p.scissorsSeverSlow || 0.35) * slowScale;
      });
      test.totalSevers += 1;
      return;
    }
    if (action.kind === "open") {
      const swing = action.index % 2 === 0 ? -0.045 : 0.045;
      scissorsFan(state, p, action.angle + swing, p.scissorsFanRange || 112, p.scissorsFanHalfAngle || 0.55, p.scissorsFanDamage || p.damage * 0.5, "scissors_test_open", action.index);
      return;
    }
    if (action.kind === "finale") {
      const hits = scissorsFan(state, p, action.angle, (p.scissorsFanRange || 112) * (p.scissorsFinaleRangeScale || 1.08), (p.scissorsFanHalfAngle || 0.55) * (p.scissorsFinaleAngleScale || 1.12), p.scissorsFinaleDamage || p.damage * 1.35, "scissors_test_finale", 99);
      hits.forEach(function (hit) {
        const enemy = hit.enemy;
        if (!enemy || enemy.dead) return;
        const priorHits = Math.min(6, test.openHitsByEnemy[enemy.id] || 0);
        const normalThreshold = Math.min(0.17, (p.scissorsExecuteBase || 0.05) + priorHits * (p.scissorsExecutePerHit || 0.02));
        const threshold = enemy.boss ? 0.05 : enemy.markerFixedElite ? Math.min(0.11, normalThreshold) : normalThreshold;
        if (enemy.boss && normalThreshold > threshold) {
          damageEnemy(state, enemy, (p.scissorsFinaleDamage || p.damage) * (normalThreshold - threshold) * 2.5, "scissors_test_finale_boss_bonus");
        }
        if (!enemy.dead && enemy.hp / enemy.maxHp <= threshold) {
          const crit = p.markerFixedCritChance;
          const cap = enemy.bossHitCap;
          p.markerFixedCritChance = 0;
          enemy.bossHitCap = 0;
          damageEnemy(state, enemy, enemy.hp + 1, "scissors_test_execution");
          enemy.bossHitCap = cap;
          p.markerFixedCritChance = crit;
          test.totalExecutions += 1;
          addTextEvent(state, enemy.x, enemy.y - 22, "裁决", "#ff6767", 0.55);
        }
      });
      test.totalFinales += 1;
    }
  }

  function finishScissorsRound(state) {
    const test = scissorsFixedRuntime(state);
    const config = fixedTestConfig(state);
    if (!test || !test.activeRound) return;
    test.activeRound = false;
    if (config && config.onRoundComplete) config.onRoundComplete(state, test.roundTargetIds.length);
  }

  function updateScissorsFixedActions(state, dt) {
    const test = scissorsFixedRuntime(state);
    if (!test || !test.pendingActions.length) return;
    test.pendingActions.forEach(function (action) { action.due -= dt; });
    const ready = test.pendingActions.filter(function (action) { return action.due <= 0; });
    test.pendingActions = test.pendingActions.filter(function (action) { return action.due > 0; });
    ready.sort(function (a, b) { return a.order - b.order; }).forEach(function (action) { executeScissorsAction(state, action); });
    if (!test.pendingActions.length) finishScissorsRound(state);
  }

  function triggerScissorsDash(state, test, p, target, angle) {
    if (!test.dashReady) return angle;
    let dx = 0;
    let dy = 0;
    if (state.input.left) dx -= 1;
    if (state.input.right) dx += 1;
    if (state.input.up) dy -= 1;
    if (state.input.down) dy += 1;
    // Light Step is a movement tool, not an auto-aim teleport. If the player
    // is standing still the charge is preserved and the regular attack fires.
    if (!dx && !dy) return angle;
    const len = Math.hypot(dx, dy) || 1;
    const dashAngle = Math.atan2(dy, dx);
    const x1 = state.player.x;
    const y1 = state.player.y;
    const distance = p.scissorsDashDistance || 82;
    const duration = p.scissorsDashDuration || 0.18;
    test.dashMotionTime = duration;
    test.dashMotionDuration = duration;
    test.dashMotionVx = dx / len * distance / duration;
    test.dashMotionVy = dy / len * distance / duration;
    test.dashActionDelay = duration;
    state.player.invuln = Math.max(state.player.invuln || 0, p.scissorsDashWindow || 0.24);
    test.dashWindow = p.scissorsDashWindow || 0.24;
    test.dashCharge = 0;
    test.dashReady = false;
    test.dashAvoidedIds = {};
    test.totalDashes += 1;
    addBeamEvent(state, x1, y1, x1 + dx / len * distance, y1 + dy / len * distance, "#8ff6ee", 18, duration + 0.1, "beam", false, "scissors_test_dash", { dashAngle, noDamage: true });
    return dashAngle;
  }

  function fireScissorsFixedTest(state) {
    const p = state.activeFormParams || {};
    const test = scissorsFixedRuntime(state);
    if (!test || test.activeRound) return;
    const activeRanges = [p.scissorsBaseRange || 138];
    if ((p.scissorsThrustCount || 0) > 0) activeRanges.push(p.scissorsThrustRange || 150);
    if ((p.scissorsCutCount || 0) > 0) activeRanges.push(p.scissorsFanRange || 112);
    if (p.scissorsSever) activeRanges.push(p.scissorsSeverRange || 215);
    if (p.scissorsFinale) activeRanges.push((p.scissorsFanRange || 112) * 1.08);
    // A charged moving dash may acquire a farther target because it closes
    // the distance first. Ordinary rounds must not begin outside the real
    // blade reach; those invisible whiffs were the main perceived weakness.
    const engageRange = p.scissorsRealRangeAcquisition
      ? (test.dashReady && (state.input.left || state.input.right || state.input.up || state.input.down)
        ? Math.max(330, Math.max.apply(Math, activeRanges) + 34)
        : Math.max.apply(Math, activeRanges) + 18)
      : Math.max(330, p.range || 0);
    const target = state.enemies.filter(function (enemy) {
      return !enemy.dead && Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y) <= engageRange + enemy.r;
    }).sort(function (a, b) {
      // Scissors still has to enter melee range, but once a Boss is reachable
      // it owns the attack direction. Wide cuts keep add-clear intact while
      // the required objective receives deliberate pressure.
      if (!!a.boss !== !!b.boss) return a.boss ? -1 : 1;
      return Math.hypot(a.x - state.player.x, a.y - state.player.y) - Math.hypot(b.x - state.player.x, b.y - state.player.y);
    })[0];
    if (!target) return;
    let angle = Math.atan2(target.y - state.player.y, target.x - state.player.x);
    test.dashActionDelay = 0;
    angle = triggerScissorsDash(state, test, p, target, angle);
    test.facingAngle = angle;
    test.roundAngle = angle;
    test.roundSerial += 1;
    test.roundTargetIds = [];
    test.openHitsByEnemy = {};
    test.activeRound = true;
    const scale = p.scissorsActionScale || 1;
    const actions = [];
    let order = 0;
    const push = function (kind, due, index) { actions.push({ kind, due: (test.dashActionDelay || 0) + due * scale, index: index || 0, angle, order: order++ }); };
    const thrusts = p.scissorsThrustCount || 0;
    const cuts = p.scissorsCutCount || 0;
    if (!thrusts && !cuts) push("base", 0.06, 0);
    for (let i = 0; i < thrusts; i++) push("thrust", 0.06 + i * 0.11, i);
    const thrustEnd = thrusts ? 0.06 + (thrusts - 1) * 0.11 : 0;
    if (p.scissorsSever) push("sever", thrustEnd + 0.14, 0);
    const openStart = thrusts ? thrustEnd + 0.16 : 0.06;
    for (let i = 0; i < cuts; i++) push("open", openStart + i * 0.085, i);
    if (p.scissorsFinale) push("finale", openStart + Math.max(0, cuts - 1) * 0.085 + 0.14, 0);
    test.pendingActions = actions;
    state.stats.shots += 1;
  }

  function fireMarker(state) {
    const p = state.activeFormParams;
    if (p && p.markerFixedTest) {
      fireMarkerFixedTest(state, false);
      return;
    }
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
    const mainHitIds = hits.map(function (hit) { return hit.enemy.id; });
    const markerVisualEnd = form.mechanicType === "line_to_wave" && hits.length
      ? { x: hits[hits.length - 1].x, y: hits[hits.length - 1].y }
      : { x: x2, y: y2 };
    addBeamEvent(state, x1, y1, markerVisualEnd.x, markerVisualEnd.y, color, width, 0.18, "beam", false, "marker_main", {
      hitEnemyIds: mainHitIds,
      actualHitCount: hits.length,
      pierceLimit: p.pierce || 4
    });
    addMarkerArchiveLine(state, p, x1, y1, markerVisualEnd.x, markerVisualEnd.y, width, 0);

    const parallelLines = Math.max(0, p.demoV2ParallelLines || 0);
    if (parallelLines > 0) {
      const nx = -dy / len;
      const ny = dx / len;
      const spacing = p.demoV2ParallelSpacing || 34;
      for (let copyIndex = 0; copyIndex < parallelLines; copyIndex++) {
        const band = Math.floor(copyIndex / 2) + 1;
        const side = copyIndex % 2 ? -1 : 1;
        const offset = spacing * band * side;
        const copyX1 = x1 + nx * offset;
        const copyY1 = y1 + ny * offset;
        const copyX2 = x2 + nx * offset;
        const copyY2 = y2 + ny * offset;
        const copyHits = lineHitEnemies(
          state, copyX1, copyY1, copyX2, copyY2,
          Math.max(6, width * 0.9),
          (p.damage || 20) * (p.demoV2ParallelDamageScale || 0.86),
          p.pierce || 4,
          "marker_module_copy"
        );
        addBeamEvent(state, copyX1, copyY1, copyX2, copyY2, "#7feeff", Math.max(5, width * 0.86), 0.22, "beam", false, "marker_module_copy", {
          copyIndex: copyIndex + 1,
          hitEnemyIds: copyHits.map(function (hit) { return hit.enemy.id; }),
          actualHitCount: copyHits.length,
          pierceLimit: p.pierce || 4
        });
        if (p.secondarySplit && copyHits.length) {
          const copyOriginHit = copyHits[copyHits.length - 1];
          const copyOrigin = { x: copyOriginHit.x, y: copyOriginHit.y, id: copyOriginHit.enemy.id };
          const excludedCopyTargets = new Set(hits.map(function (hit) { return hit.enemy; }));
          copyHits.forEach(function (hit) { excludedCopyTargets.add(hit.enemy); });
          const copyRelayTarget = nearestBranchTarget(state, copyOrigin, excludedCopyTargets, new Set(), p.secondarySplitRange || 205);
          if (copyRelayTarget) {
            const copyRelayEnd = lineEndpointThroughTarget(copyOrigin, copyRelayTarget, p.secondarySplitRange || 205);
            const copyRelayHits = lineHitEnemies(
              state, copyOrigin.x, copyOrigin.y, copyRelayEnd.x, copyRelayEnd.y,
              Math.max(3.5, width * 0.46),
              (p.damage || 20) * (p.secondarySplitDamage || 0.34),
              Math.max(1, p.secondarySplitPierce || 1),
              "marker_module_forward",
              { excludeEnemies: excludedCopyTargets }
            );
            addBeamEvent(state, copyOrigin.x, copyOrigin.y, copyRelayEnd.x, copyRelayEnd.y, "#fff2a8", Math.max(3.5, width * 0.46), 0.24, "beam", false, "marker_module_forward", {
              generation: "copy-relay",
              copyIndex: copyIndex + 1,
              originEnemyId: copyOrigin.id,
              targetEnemyId: copyRelayTarget.id,
              hitEnemyIds: copyRelayHits.map(function (hit) { return hit.enemy.id; }),
              actualHitCount: copyRelayHits.length
            });
          }
        }
        addMarkerArchiveLine(state, p, copyX1, copyY1, copyX2, copyY2, width, copyIndex + 1);
      }
    }
    state.stats.shots += 1;
    const shotAngle = Math.atan2(dy, dx);
    if (p.demoV2MarkerExpedite > 0 && p.demoV2MarkerExpediteEvery > 0 && state.stats.shots % p.demoV2MarkerExpediteEvery === 0) {
      const expediteScale = 0.42 + p.demoV2MarkerExpedite * 0.12;
      addMarkerModuleLine(state, p, "marker_module_expedite", shotAngle, expediteScale, 0);
    }
    if (p.demoV2MarkerMerge > 0 && hits.length >= 2) {
      const mergeOrigin = hits[hits.length - 1];
      const mergeRadius = 42 + p.demoV2MarkerMerge * 18;
      addCircleEvent(state, mergeOrigin.x, mergeOrigin.y, mergeRadius, "#d8ffff", 0.32, "blast", false, "marker_module_merge", {
        mergedHits: hits.length,
        level: p.demoV2MarkerMerge
      });
      addDamageZone(state, {
        type: "circle", source: "marker_module_merge", x: mergeOrigin.x, y: mergeOrigin.y,
        radius: mergeRadius, damage: 7 + p.demoV2MarkerMerge * 5,
        life: 0.16, maxLife: 0.16, hitOnce: true,
        color: "#d8ffff", slow: 0.12, visual: "marker_p0_blast"
      });
    }
    if (p.demoV2MarkerOverdraft > 0 && p.demoV2OverdraftEvery > 0 && state.stats.shots % p.demoV2OverdraftEvery === 0) {
      const overdraftLines = Math.max(2, p.demoV2MarkerOverdraftLines || 2);
      const spread = Math.min(1.05, 0.42 + overdraftLines * 0.12);
      for (let lineIndex = 0; lineIndex < overdraftLines; lineIndex++) {
        const t = overdraftLines === 1 ? 0 : lineIndex / (overdraftLines - 1) - 0.5;
        addMarkerModuleLine(state, p, "marker_module_overdraft", shotAngle + t * spread, 0.42 + p.demoV2MarkerOverdraft * 0.07, lineIndex);
      }
    }

    if (form.mechanicType === "line_split" || p.demoV2BaseBranch) {
      const branchCount = Math.max(1, p.splitCount || 2);
      const branchRange = Math.max(120, p.splitRange || 230);
      const branchPierce = Math.max(1, p.splitPierce || 2);
      const mainHitEnemies = new Set(hits.map(function (hit) { return hit.enemy; }));
      const claimedBranchEnemies = new Set();
      hits.forEach(function (hit, mainHitIndex) {
        const branchOrigin = { x: hit.x, y: hit.y, id: hit.enemy.id };
        let createdBranches = 0;
        for (let branchIndex = 0; branchIndex < branchCount; branchIndex++) {
          const branchTarget = nearestBranchTarget(state, branchOrigin, mainHitEnemies, claimedBranchEnemies, branchRange);
          if (!branchTarget) break;
          const branchEnd = lineEndpointThroughTarget(branchOrigin, branchTarget, branchRange);
          const branchExclusions = new Set(mainHitEnemies);
          branchExclusions.add(hit.enemy);
          claimedBranchEnemies.forEach(function (enemy) { branchExclusions.add(enemy); });
          const branchHits = lineHitEnemies(
            state,
            branchOrigin.x,
            branchOrigin.y,
            branchEnd.x,
            branchEnd.y,
            Math.max(4, width * 0.58),
            (p.damage || 20) * (p.splitDamage || 0.42),
            branchPierce,
            "marker_split",
            { excludeEnemies: branchExclusions }
          );
          branchHits.forEach(function (branchHit) { claimedBranchEnemies.add(branchHit.enemy); });
          addBeamEvent(state, branchOrigin.x, branchOrigin.y, branchEnd.x, branchEnd.y, "#9ffcff", Math.max(3, width * 0.58), 0.2, "beam", false, "marker_split", {
            generation: 1,
            mainHitIndex,
            branchIndex,
            originEnemyId: hit.enemy.id,
            targetEnemyId: branchTarget.id,
            hitEnemyIds: branchHits.map(function (branchHit) { return branchHit.enemy.id; }),
            actualHitCount: branchHits.length,
            pierceLimit: branchPierce
          });
          createdBranches += 1;

          if (p.secondarySplit && branchHits.length) {
            const secondOriginHit = branchHits[branchHits.length - 1];
            const secondOrigin = { x: secondOriginHit.x, y: secondOriginHit.y, id: secondOriginHit.enemy.id };
            const secondaryRange = Math.max(90, p.secondarySplitRange || branchRange * 0.62);
            const secondaryCount = Math.max(1, p.secondarySplitCount || 1);
            for (let secondaryIndex = 0; secondaryIndex < secondaryCount; secondaryIndex++) {
              const secondaryTarget = nearestBranchTarget(state, secondOrigin, mainHitEnemies, claimedBranchEnemies, secondaryRange);
              if (!secondaryTarget) break;
              const secondaryEnd = lineEndpointThroughTarget(secondOrigin, secondaryTarget, secondaryRange);
              const secondaryExclusions = new Set(mainHitEnemies);
              claimedBranchEnemies.forEach(function (enemy) { secondaryExclusions.add(enemy); });
              secondaryExclusions.delete(secondaryTarget);
              secondaryExclusions.add(secondOriginHit.enemy);
              const secondaryWidth = Math.max(3.5, width * 0.46);
              const secondaryPierce = Math.max(1, p.secondarySplitPierce || 1);
              const secondHits = lineHitEnemies(state, secondOrigin.x, secondOrigin.y, secondaryEnd.x, secondaryEnd.y, secondaryWidth, (p.damage || 20) * (p.secondarySplitDamage || 0.34), secondaryPierce, "marker_module_forward", { excludeEnemies: secondaryExclusions });
              secondHits.forEach(function (secondHit) { claimedBranchEnemies.add(secondHit.enemy); });
              addBeamEvent(state, secondOrigin.x, secondOrigin.y, secondaryEnd.x, secondaryEnd.y, "#fff2a8", secondaryWidth, 0.24, "beam", false, "marker_module_forward", {
                generation: 2,
                secondaryIndex,
                originEnemyId: secondOrigin.id,
                targetEnemyId: secondaryTarget.id,
                hitEnemyIds: secondHits.map(function (secondHit) { return secondHit.enemy.id; }),
                actualHitCount: secondHits.length,
                pierceLimit: secondaryPierce
              });
            }
          }
        }
        if (createdBranches) {
          addCircleEvent(state, branchOrigin.x, branchOrigin.y, 22 + createdBranches * 5, "#9ffcff", 0.16, "split", false, "marker_split_origin", {
            originEnemyId: hit.enemy.id,
            createdBranches
          });
        }
        if (hit.enemy.boss && createdBranches < branchCount) {
          const converged = Math.min(2, branchCount - createdBranches);
          for (let convergeIndex = 0; convergeIndex < converged; convergeIndex++) {
            const angle = Math.PI * 2 * (convergeIndex / Math.max(1, converged)) - Math.PI / 2;
            const foldRadius = 34 + convergeIndex * 5;
            const foldX = hit.x + Math.cos(angle) * foldRadius;
            const foldY = hit.y + Math.sin(angle) * foldRadius;
            addBeamEvent(state, foldX, foldY, hit.x, hit.y, "#d8ffff", Math.max(2.5, width * 0.42), 0.14, "beam", false, "marker_split", {
              generation: "converge",
              originEnemyId: hit.enemy.id,
              targetEnemyId: hit.enemy.id,
              actualHitCount: 1,
              converged: true
            });
            damageEnemy(state, hit.enemy, (p.damage || 20) * (p.splitDamage || 0.42) * (p.bossConvergeScale || 0.18), "marker_split");
          }
          addCircleEvent(state, hit.x, hit.y, 24 + converged * 4, "#d8ffff", 0.18, "split", false, "marker_split_origin", {
            originEnemyId: hit.enemy.id,
            convergedBranches: converged
          });
        }
      });
      if (p.shieldPerHit && hits.length) state.activeFormParams.shield = (state.activeFormParams.shield || 0) + hits.length * p.shieldPerHit;
      const fullscreenEvery = p.promotionFullscreenEvery || 0;
      const fullscreenDue = fullscreenEvery > 0 && state.stats.shots % fullscreenEvery === 0;
      if (fullscreenDue || (p.promotionFullscreenChance && Math.random() < p.promotionFullscreenChance)) {
        const camera = state.camera || { x: 0, width: W };
        addBeamEvent(state, camera.x, state.player.y, camera.x + camera.width, state.player.y, "#c7f8ff", 7, 0.22, "beam", false, "marker_fullscreen");
        lineHitEnemies(state, camera.x, state.player.y, camera.x + camera.width, state.player.y, 7, (p.damage || 20) * 0.7, 99, "marker_fullscreen");
      }
    }

    if (form.mechanicType === "mark_detonate") {
      hits.forEach(function (hit) {
        if (hit.enemy.p0Marked && hit.enemy.p0MarkTime > 0) {
          const radius = (p.explosionRadius || 58) * (p.area || 1);
          const blastX = hit.x;
          const blastY = hit.y;
          addCircleEvent(state, blastX, blastY, radius, "#9edfff", 0.35, "blast", false, "marker_p0_blast", {
            targetEnemyId: hit.enemy.id,
            markTimeRemaining: hit.enemy.p0MarkTime
          });
          addDamageZone(state, { type: "circle", source: "marker_p0_blast", x: blastX, y: blastY, radius, damage: p.explosionDamage || 34, life: 0.16, maxLife: 0.16, hitOnce: true, color: "#9edfff", visual: "marker_p0_blast" });
          if (p.shieldOnDetonate) state.hp = Math.min(state.maxHp, state.hp + Math.round(p.shieldOnDetonate * 0.35));
          if (p.pauseAfterBlast) attackTimer += 0.22;
          hit.enemy.p0Marked = false;
          hit.enemy.p0MarkTime = 0;
          if (p.splashRefreshMark) {
            state.enemies.forEach(function (enemy) {
              if (!enemy.dead && enemy.p0Marked && Math.hypot(enemy.x - blastX, enemy.y - blastY) <= radius + enemy.r) {
                enemy.p0MarkTime = enemy.p0MarkMax || p.markWindow || 3.2;
              }
            });
          }
          if (p.p0Chain) {
            const chainTarget = state.enemies
              .filter(function (enemy) { return !enemy.dead && !enemy.p0Marked && enemy !== hit.enemy && Math.hypot(enemy.x - blastX, enemy.y - blastY) <= radius * 1.5; })
              .sort(function (a, b) { return Math.hypot(a.x - blastX, a.y - blastY) - Math.hypot(b.x - blastX, b.y - blastY); })[0];
            if (chainTarget) {
              chainTarget.p0Marked = true;
              chainTarget.p0MarkMax = p.markWindow || 3.2;
              chainTarget.p0MarkTime = chainTarget.p0MarkMax;
              addCircleEvent(state, chainTarget.x, chainTarget.y, 28, "#ffd88a", 0.3, "mark", false, "marker_p0_chain", {
                targetEnemyId: chainTarget.id,
                markWindow: chainTarget.p0MarkMax
              });
            }
          }
        } else if (hit.enemy.boss || hit.enemy.maxHp >= (p.priorityHp || 28)) {
          hit.enemy.p0Marked = true;
          hit.enemy.p0MarkMax = p.markWindow || 3.2;
          hit.enemy.p0MarkTime = hit.enemy.p0MarkMax;
          addCircleEvent(state, hit.x, hit.y, 28, "#ffd88a", 0.28, "mark", false, "marker_p0_mark", {
            targetEnemyId: hit.enemy.id,
            markWindow: hit.enemy.p0MarkMax
          });
        }
      });
    }

    if (form.mechanicType === "line_to_wave") {
      const radius = (p.waveRadius || 96) * (p.area || 1);
      const waves = Math.max(1, p.waveCount || 1);
      const waveDuration = Math.max(0.28, p.waveDuration || 0.48);
      const waveThickness = Math.max(18, p.waveThickness || 28);
      const waveOrigin = hits.length ? hits[hits.length - 1] : target;
      for (let wi = 0; wi < waves; wi++) {
        const delay = wi * 0.16;
        addDamageZone(state, {
          type: "ring",
          source: "marker_wave",
          x: waveOrigin.x,
          y: waveOrigin.y,
          startRadius: 10,
          radius,
          thickness: waveThickness,
          duration: waveDuration,
          delay,
          life: waveDuration + delay,
          maxLife: waveDuration + delay,
          damage: (p.waveDamage || 15) * (1 - wi * 0.1),
          color: wi % 2 ? "#b6dcff" : "#91c9ff",
          knockback: p.waveKnockback ? 30 : 12,
          visual: "marker_wavefront",
          pulseIndex: wi
        });
      }
      if (p.waveReturn) {
        const returnDelay = waves * 0.16 + waveDuration;
        addDamageZone(state, {
          type: "ring",
          source: "marker_wave_return",
          x: waveOrigin.x,
          y: waveOrigin.y,
          startRadius: 10,
          radius,
          thickness: waveThickness,
          duration: waveDuration,
          delay: returnDelay,
          reverse: true,
          life: waveDuration + returnDelay,
          maxLife: waveDuration + returnDelay,
          damage: (p.waveDamage || 15) * 0.75,
          color: "#d5e7ff",
          knockback: p.waveKnockback ? 34 : 16,
          visual: "marker_wavefront_return"
        });
      }
    }

    if (form.mechanicType === "shield_counter_line") {
      const shieldMax = Math.max(8, p.markerShieldMax || 18);
      state.activeFormParams.shield = Math.min(shieldMax, (state.activeFormParams.shield || 0) + hits.length * (p.shieldPerHit || 1.4));
      state.activeFormParams.markerShieldMax = shieldMax;
      addCircleEvent(state, state.player.x, state.player.y, 48 + state.activeFormParams.shield / shieldMax * 18, "#72ffe5", 0.2, "shield", false, "marker_shield_charge", {
        shield: state.activeFormParams.shield,
        shieldMax
      });
    }

    if (form.mechanicType === "line_grid_field") {
      const previousLines = state.damageZones.filter(function (zone) {
        return zone.source === "marker_grid_line" && zone.life > 0;
      });
      const primaryGridLine = {
        type: "line",
        x1, y1, x2, y2,
        width: 10,
        damage: p.gridDamage || 11,
        life: p.trailDuration || 2.8,
        maxLife: p.trailDuration || 2.8,
        color: "#cfe8ff",
        slow: p.gridSlow || 0,
        source: "marker_grid_line",
        visual: "marker_grid_line"
      };
      addDamageZone(state, primaryGridLine);
      previousLines.forEach(function (line) {
        const point = segmentIntersection(primaryGridLine, line);
        if (point) addMarkerGridField(state, point, p);
      });
      if (p.gridEcho) {
        const midX = x1 + (x2 - x1) * 0.58;
        const midY = y1 + (y2 - y1) * 0.58;
        const beamLength = Math.hypot(x2 - x1, y2 - y1) || 1;
        const nx = -(y2 - y1) / beamLength;
        const ny = (x2 - x1) / beamLength;
        const half = Math.min(180, Math.max(105, beamLength * 0.24));
        const echoLine = {
          type: "line",
          source: "marker_grid_line",
          x1: midX - nx * half,
          y1: midY - ny * half,
          x2: midX + nx * half,
          y2: midY + ny * half,
          width: 8,
          damage: p.gridDamage || 11,
          life: p.trailDuration || 2.8,
          maxLife: p.trailDuration || 2.8,
          color: "#e8d99a",
          slow: p.gridSlow || 0,
          visual: "marker_grid_line"
        };
        addBeamEvent(state, echoLine.x1, echoLine.y1, echoLine.x2, echoLine.y2, "#e8d99a", 3, 0.24, "grid", false, "marker_grid_line", {
          gridEcho: true
        });
        addDamageZone(state, echoLine);
        addMarkerGridField(state, { x: midX, y: midY }, p);
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
        radius: 13,
        damage: 0,
        life: 2.2,
        maxLife: 2.2,
        tickEvery: 999,
        color: "#a8fbff",
        visual: "thermos_drone_module",
        source: "thermos_drone",
        droneModule: true,
        moduleId: "secondary-thermos-module-" + state.stats.shots,
        droneDamage: Math.max(5, (p.damage || 12) * 0.45),
        dronePierce: 1,
        droneShootEvery: 0.8,
        steamRange: 190,
        orbitPlayer: true,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitRadius: 62,
        orbitSpeed: 2.4
      });
    }
    if (p.crossMiniBoil && target) {
      const radius = 54;
      addCircleEvent(state, target.x, target.y, radius, "#bdf5ff", 0.28, "steam_pulse", false, "secondary_thermos_boil");
      addDamageZone(state, { type: "circle", source: "secondary_thermos_boil", x: target.x, y: target.y, radius, damage: Math.max(8, (p.releaseDamage || p.damage || 16) * 0.22), life: 0.16, maxLife: 0.16, hitOnce: true, color: "#bdf5ff", visual: "thermos_mini_boil" });
    }
    if (p.crossWarmShield) {
      p.secondaryWarmShieldMax = p.secondaryWarmShieldMax || 20;
      p.shield = Math.min(p.secondaryWarmShieldMax, (p.shield || 0) + 5);
      addCircleEvent(state, state.player.x, state.player.y, 48 + p.shield / p.secondaryWarmShieldMax * 12, "#8fffe7", 0.24, "shield", false, "secondary_thermos_shield_charge", { shield: p.shield, shieldMax: p.secondaryWarmShieldMax });
    }
    if (p.crossTeaWave) {
      addThermosWavefront(state, { source: "secondary_thermos_tea_wave", x: state.player.x, y: state.player.y, radius: 76, damage: Math.max(5, (p.damage || 12) * 0.32), duration: 0.38, thickness: 22, color: "#9ddfff", visual: "thermos_wavefront" });
    }
    if (p.crossSafeStation) {
      addDamageZone(state, { type: "circle", source: "secondary_thermos_station", x: state.player.x, y: state.player.y, radius: 72, damage: Math.max(4, (p.damage || 10) * 0.25), life: 1.4, maxLife: 1.4, tickEvery: 0.36, color: "#cfefff", visual: "thermos_station_field", slow: 0.18, heal: 0.6 });
    }
  }

  function thermosFixedDirection(state, range) {
    const nearby = state.enemies.filter(function (enemy) {
      return !enemy.dead && Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y) <= range * 1.2;
    });
    if (!nearby.length) return null;
    // The fan normally values a dense group, but a Boss inside its working
    // distance must not become an accidental blind spot behind its own adds.
    // Aiming at the Boss still lets the wide fan catch that surrounding pack.
    const nearbyBoss = nearby.filter(function (enemy) { return enemy.boss; }).sort(function (a, b) {
      return Math.hypot(a.x - state.player.x, a.y - state.player.y) - Math.hypot(b.x - state.player.x, b.y - state.player.y);
    })[0];
    if (nearbyBoss) return Math.atan2(nearbyBoss.y - state.player.y, nearbyBoss.x - state.player.x);
    let best = nearby[0];
    let bestScore = -Infinity;
    nearby.forEach(function (candidate) {
      let neighbours = 0;
      nearby.forEach(function (other) {
        if (Math.hypot(other.x - candidate.x, other.y - candidate.y) <= 105) neighbours += 1;
      });
      const distance = Math.hypot(candidate.x - state.player.x, candidate.y - state.player.y);
      const score = neighbours * 1000 - distance;
      if (score > bestScore) {
        bestScore = score;
        best = candidate;
      }
    });
    return Math.atan2(best.y - state.player.y, best.x - state.player.x);
  }

  function thermosFixedAngleDistance(a, b) {
    return Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
  }

  function thermosFixedTargetInFan(state, angle, range, halfAngle) {
    return state.enemies.filter(function (enemy) {
      if (enemy.dead) return false;
      const dx = enemy.x - state.player.x;
      const dy = enemy.y - state.player.y;
      const distance = Math.hypot(dx, dy);
      return distance <= range + enemy.r && thermosFixedAngleDistance(Math.atan2(dy, dx), angle) <= halfAngle;
    }).sort(function (a, b) {
      if (a.hp !== b.hp) return a.hp - b.hp;
      return Math.hypot(a.x - state.player.x, a.y - state.player.y) - Math.hypot(b.x - state.player.x, b.y - state.player.y);
    })[0] || null;
  }

  function thermosFixedFanPoints(state, angle, range, width) {
    const ux = Math.cos(angle);
    const uy = Math.sin(angle);
    const nx = -uy;
    const ny = ux;
    const originDistance = 15;
    const originHalfWidth = Math.min(30, width * 0.14);
    const halfWidth = width / 2;
    const originX = state.player.x + ux * originDistance;
    const originY = state.player.y + uy * originDistance;
    const farX = state.player.x + ux * range;
    const farY = state.player.y + uy * range;
    return {
      originX, originY, farX, farY, ux, uy, nx, ny, angle, range, width,
      points: [
        { x: originX + nx * originHalfWidth, y: originY + ny * originHalfWidth },
        { x: farX + nx * halfWidth, y: farY + ny * halfWidth },
        { x: farX - nx * halfWidth, y: farY - ny * halfWidth },
        { x: originX - nx * originHalfWidth, y: originY - ny * originHalfWidth }
      ]
    };
  }

  function drawThermosFixedFan(state, fan, width, source, groupIndex) {
    [-0.92, -0.46, 0, 0.46, 0.92].forEach(function (offset) {
      addBeamEvent(
        state,
        fan.originX,
        fan.originY,
        fan.farX + fan.nx * width * 0.5 * offset,
        fan.farY + fan.ny * width * 0.5 * offset,
        source === "thermos_test_focus" ? "#ffe0a1" : "#b8f6ff",
        source === "thermos_test_focus" ? 8 : 10,
        source === "thermos_test_focus" ? 0.2 : 0.26,
        "steam",
        false,
        source,
        {
          thermosFixedFan: true,
          groupIndex,
          fanOffset: offset,
          fanAngle: fan.angle,
          fanRange: fan.range,
          fanWidth: width,
          visualOriginDistance: state.demoV2 && state.demoV2.thermosEmbodimentPass ? 24 : 0
        }
      );
    });
  }

  function addThermosFixedCondensation(state, p, angle, groupIndex) {
    const count = p.thermosFixedCondensationZones || 0;
    if (!count) return;
    for (let zoneIndex = 0; zoneIndex < count; zoneIndex++) {
      const distance = (p.range || 225) * (zoneIndex + 1) / (count + 0.35);
      const radius = Math.max(38, (p.width || 205) * (0.2 + zoneIndex * 0.012));
      const x = state.player.x + Math.cos(angle) * distance;
      const y = state.player.y + Math.sin(angle) * distance;
      const duration = p.thermosFixedCondensationDuration || 1.65;
      addCircleEvent(state, x, y, radius, "#b9e8ef", Math.min(0.72, duration), "steam_pulse", false, "thermos_test_condensation", { groupIndex, zoneIndex, duration });
      addDamageZone(state, {
        type: "circle", source: "thermos_test_condensation", x, y, radius,
        damage: p.thermosFixedCondensationDamage || 1.6,
        life: duration, maxLife: duration, tickEvery: 0.38,
        color: "#b9e8ef", visual: "thermos_station_field", noKnockback: true,
        condensationZone: true, groupIndex, zoneIndex
      });
    }
  }

  function addThermosFixedHeatwave(state, p, x, y, test) {
    const silhouettePass = !!(state.demoV2 && state.demoV2.skillSilhouettePass);
    const radius = Math.max(silhouettePass ? 96 : 68, (p.range || 225) * (silhouettePass ? 0.46 : 0.38));
    addThermosWavefront(state, {
      source: "thermos_test_kill_heatwave", x, y, radius,
      damage: p.thermosFixedHeatwaveDamage || 7,
      duration: silhouettePass ? 0.58 : 0.44,
      thickness: silhouettePass ? 42 : 30,
      color: "#ffd06f", visual: "thermos_wavefront",
      noKnockback: true
    });
    if (silhouettePass) addTextEvent(state, x, y - 30, "热浪转发", "#ffd06f", 0.62);
    test.stageHeatwaveTriggers += 1;
    test.totalHeatwaveTriggers += 1;
    triggerThermosFixedThermalExchange(state, p, x, y, radius, test);
  }

  function triggerThermosFixedThermalExchange(state, p, x, y, waveRadius, test) {
    if (!p.thermosFixedThermalExchange || !test) return false;
    const now = state.totalTime || 0;
    let triggered = 0;
    let hitCount = 0;
    state.damageZones.filter(function (zone) {
      return zone.condensationZone && zone.life > 0
        && Math.hypot(zone.x - x, zone.y - y) <= waveRadius + zone.radius;
    }).forEach(function (zone) {
      if (triggered >= 2 || now < (zone.thermalExchangeReadyAt || 0)) return;
      zone.thermalExchangeReadyAt = now + (p.thermosFixedThermalExchangeCooldown || 0.7);
      zone.life = Math.max(0.18, zone.life - 0.32);
      addCircleEvent(state, zone.x, zone.y, zone.radius * 1.08, triggered % 2 ? "#ff72dc" : "#eafcff", 0.48, "detonate", false, "thermos_test_thermal_exchange", {
        condensationGroup: zone.groupIndex,
        condensationIndex: zone.zoneIndex,
        heatwaveX: x,
        heatwaveY: y
      });
      state.enemies.slice().forEach(function (enemy) {
        if (enemy.dead || Math.hypot(enemy.x - zone.x, enemy.y - zone.y) > zone.radius + enemy.r) return;
        damageEnemy(state, enemy, p.thermosFixedThermalExchangeDamage || 3, "thermos_test_thermal_exchange");
        enemy.thermosFixedSlowTime = Math.max(enemy.thermosFixedSlowTime || 0, 0.9);
        enemy.thermosFixedSlow = Math.max(enemy.thermosFixedSlow || 0, 0.32);
        hitCount += 1;
      });
      addTextEvent(state, zone.x, zone.y - zone.radius * 0.45, "热交换", "#f2c4ff", 0.56);
      triggered += 1;
    });
    if (!triggered) return false;
    test.totalThermalExchanges += triggered;
    test.totalThermalExchangeHits += hitCount;
    return true;
  }

  function performThermosFixedFocus(state, pending) {
    const p = state.activeFormParams || {};
    const test = fixedTestRuntime(state);
    if (!test) return;
    const target = thermosFixedTargetInFan(state, pending.angle, p.range || 225, 0.5);
    if (!target) return;
    const wasAlive = !target.dead;
    addBeamEvent(state, state.player.x, state.player.y, target.x, target.y, "#ffe0a1", 10, 0.22, "steam", false, "thermos_test_focus", {
      targetEnemyId: target.id,
      focusIndex: pending.focusIndex,
      visualOriginDistance: state.demoV2 && state.demoV2.thermosEmbodimentPass ? 39 : 0
    });
    damageEnemy(state, target, p.thermosFixedFocusDamage || (p.damage || 14) * 1.55, "thermos_test_focus", null);
    if (wasAlive && target.dead) {
      test.stageFocusKills += 1;
      test.totalFocusKills += 1;
      addThermosFixedHeatwave(state, p, target.x, target.y, test);
    }
  }

  function triggerThermosFixedFullscreenCondensation(state, p, test, elapsed) {
    if (!p.thermosFixedFullscreenCondensation || elapsed < (test.fullscreenCondensationReadyAt || 0)) return;
    if (Math.random() >= (p.thermosFixedFullscreenCondensationChance || p.thermosFixedFullscreenChance || 0.15)) return;
    const camera = state.camera || { x: 0, y: 0, width: W, height: H };
    const x = camera.x + camera.width / 2;
    const y = camera.y + camera.height / 2;
    const radius = Math.hypot(camera.width, camera.height) * 0.58;
    const duration = Math.max(1.1, (p.thermosFixedCondensationDuration || 1.65) * 0.72);
    addCircleEvent(state, x, y, radius, "#b9e8ef", 0.82, "steam_pulse", false, "thermos_test_fullscreen_condensation", { fullscreen: true, duration });
    addDamageZone(state, { type: "circle", source: "thermos_test_fullscreen_condensation", x, y, radius, damage: (p.thermosFixedCondensationDamage || 1.6) * 0.76, life: duration, maxLife: duration, tickEvery: 0.38, color: "#b9e8ef", visual: "thermos_station_field", noKnockback: true, fullscreen: true });
    test.fullscreenCondensationReadyAt = elapsed + (p.thermosFixedFullscreenCooldown || 4.8);
    test.fullscreenCondensationTriggers += 1;
  }

  function triggerThermosFixedFullscreenIgnition(state, p, test, elapsed) {
    if (!p.thermosFixedFullscreenIgnition || elapsed < (test.fullscreenIgnitionReadyAt || 0)) return;
    if (Math.random() >= (p.thermosFixedFullscreenIgnitionChance || p.thermosFixedFullscreenChance || 0.15)) return;
    const targets = state.enemies.filter(function (enemy) { return !enemy.dead; }).sort(function (a, b) {
      const priorityA = a.boss ? 3 : a.markerFixedElite || a.behavior === "tank" || a.behavior === "shield" ? 2 : 1;
      const priorityB = b.boss ? 3 : b.markerFixedElite || b.behavior === "tank" || b.behavior === "shield" ? 2 : 1;
      return priorityB - priorityA || a.hp - b.hp;
    }).slice(0, 6);
    targets.forEach(function (target, index) {
      const wasAlive = !target.dead;
      addCircleEvent(state, target.x, target.y, target.r + 24, "#ffbe73", 0.3 + index * 0.03, "steam_pulse", false, "thermos_test_fullscreen_ignition", { targetEnemyId: target.id, ignitionIndex: index });
      damageEnemy(state, target, (p.thermosFixedFocusDamage || (p.damage || 14) * 1.55) * 0.9, "thermos_test_fullscreen_ignition", null);
      if (wasAlive && target.dead) {
        test.stageFocusKills += 1;
        test.totalFocusKills += 1;
        addThermosFixedHeatwave(state, p, target.x, target.y, test);
      }
    });
    test.fullscreenIgnitionReadyAt = elapsed + (p.thermosFixedFullscreenCooldown || 4.8);
    test.fullscreenIgnitionTriggers += 1;
  }

  function fireThermosFixedTest(state) {
    const p = state.activeFormParams || {};
    const test = fixedTestRuntime(state);
    const mainAngle = thermosFixedDirection(state, p.range || 225);
    if (!test || mainAngle == null) return;
    test.facingAngle = mainAngle;
    state.stats.shots += 1;
    triggerThermosBackPressure(state, test);
    const count = Math.max(1, p.amount || 1);
    const spread = count > 1 ? Math.min(0.68, 0.18 + count * 0.1) : 0;
    const hitThisRound = new Set();
    const sharedSteamHits = {};
    for (let groupIndex = 0; groupIndex < count; groupIndex++) {
      const t = count === 1 ? 0 : groupIndex / (count - 1) - 0.5;
      const angle = mainAngle + t * spread;
      const fan = thermosFixedFanPoints(state, angle, p.range || 225, p.width || 205);
      drawThermosFixedFan(state, fan, p.width || 205, "thermos_test_base", groupIndex);
      const steamDuration = p.thermosFixedBaseSteamDuration || 0.68;
      addDamageZone(state, {
        type: "polygon", source: "thermos_test_base", points: fan.points,
        x: (fan.originX + fan.farX) / 2, y: (fan.originY + fan.farY) / 2,
        radius: Math.max((p.width || 205) / 2, (p.range || 225) * 0.5),
        damage: p.thermosFixedBaseSteamDamage || 1.4,
        life: steamDuration, maxLife: steamDuration, tickEvery: 0.28,
        color: "#aeefff", slow: p.thermosFixedBaseSteamSlow || 0.3,
        visual: "thermos_steam_fan", noKnockback: true,
        thermosFixedSharedHits: sharedSteamHits, groupIndex
      });
      state.enemies.forEach(function (enemy) {
        if (enemy.dead || hitThisRound.has(enemy) || !pointInPolygon(enemy.x, enemy.y, fan.points)) return;
        hitThisRound.add(enemy);
        const resistance = enemy.boss ? 0.22 : enemy.behavior === "tank" || enemy.behavior === "shield" ? 0.45 : 1;
        damageEnemy(state, enemy, p.damage || 14, "thermos_test_base", { x: state.player.x, y: state.player.y, power: (p.thermosFixedKnockback || 15) * resistance });
      });
      addThermosFixedCondensation(state, p, angle, groupIndex);
    }
    const now = (V2.demoV2 && V2.demoV2.thermosFixed && V2.demoV2.thermosFixed.totalElapsed) ? V2.demoV2.thermosFixed.totalElapsed(state) : state.totalTime;
    for (let focusIndex = 0; focusIndex < (p.thermosFixedFocusHits || 0); focusIndex++) {
      test.pendingFocusHits.push({ due: now + 0.08 + focusIndex * 0.13, angle: mainAngle, focusIndex });
    }
    triggerThermosFixedFullscreenCondensation(state, p, test, now);
    triggerThermosFixedFullscreenIgnition(state, p, test, now);
  }

  function updateThermosFixedPendingFocus(state) {
    const test = fixedTestRuntime(state);
    if (!test || !test.pendingFocusHits || !test.pendingFocusHits.length) return;
    const now = V2.demoV2.thermosFixed.totalElapsed(state);
    const ready = test.pendingFocusHits.filter(function (pending) { return pending.due <= now; });
    test.pendingFocusHits = test.pendingFocusHits.filter(function (pending) { return pending.due > now; });
    ready.forEach(function (pending) { performThermosFixedFocus(state, pending); });
  }

  function fireThermos(state) {
    const p = state.activeFormParams;
    const form = state.activeForm || {};
    if (p.thermosFixedTest) {
      fireThermosFixedTest(state);
      return;
    }
    if ((p.releaseLockout || 0) > 0) return;
    const target = nearestEnemy(state, p.demoV2SteamFan ? (p.steamRange || 240) : (p.releaseRange || p.steamRange || 280));
    if (!target && form.mechanicType !== "deployable_safe_station") return;
    state.stats.shots += 1;
    applyThermosSecondary(state, target);

    if (form.mechanicType === "heat_meter_steam") {
      const heatMax = p.heatMax || 100;
      p.heat = Math.min(heatMax, (p.heat || 0) + (p.heatRate || 16));
      const dx = target.x - state.player.x;
      const dy = target.y - state.player.y;
      const len = Math.hypot(dx, dy) || 1;
      if (p.heat >= heatMax) {
        p.heat = 0;
        p.releaseLockout = p.releaseLockoutDuration || 0.65;
        if (p.demoV2SteamFan) {
          addCircleEvent(state, state.player.x, state.player.y, 72, "#bdf5ff", 0.24, "steam_pulse", false, "thermos_charge", { heatMax });
          addThermosSteamFans(state, target, {
            source: "thermos_release",
            range: p.releaseRange || 310,
            width: p.releaseWidth || 310,
            damage: p.releaseTickDamage || 12,
            duration: p.releaseDuration || 1.4,
            tickEvery: p.releaseTickEvery || 0.25,
            slow: p.releaseSlow || 0.8,
            rayWidth: 11,
            eventLife: 0.32,
            color: "#bdf5ff",
            visual: "thermos_release_fan"
          });
          return;
        }
        const x2 = state.player.x + dx / len * (p.releaseRange || 430);
        const y2 = state.player.y + dy / len * (p.releaseRange || 430);
        const width = p.releaseWidth || 16;
        addCircleEvent(state, state.player.x, state.player.y, 62, "#bdf5ff", 0.22, "steam_pulse", false, "thermos_charge", { heatMax });
        addBeamEvent(state, state.player.x, state.player.y, x2, y2, "#bdf5ff", width, 0.28, "steam", false, "thermos_release", { lockout: p.releaseLockout });
        lineHitEnemies(state, state.player.x, state.player.y, x2, y2, width + 2, p.releaseDamage || 58, 6, "thermos_intern_release");
      } else {
        if (p.demoV2SteamFan) {
          addThermosSteamFans(state, target, {
            source: "thermos_warmup",
            range: p.steamRange || 240,
            width: p.steamWidth || 200,
            damage: p.steamTickDamage || 4.2,
            duration: p.steamDuration || 1.05,
            tickEvery: p.steamTickEvery || 0.28,
            slow: p.steamSlow || 0.65,
            rayWidth: 7,
            eventLife: 0.2,
            color: "#86f7ff",
            visual: "thermos_steam_fan"
          });
          return;
        }
        const x2 = state.player.x + dx / len * (p.steamRange || p.range || 300);
        const y2 = state.player.y + dy / len * (p.steamRange || p.range || 300);
        addBeamEvent(state, state.player.x, state.player.y, x2, y2, "#86f7ff", 8, 0.14, "steam", false, "thermos_warmup", { heat: p.heat, heatMax });
        lineHitEnemies(state, state.player.x, state.player.y, x2, y2, 10, Math.max(6, (p.damage || 18) * 0.55), 2, "thermos_intern_steam");
      }
      return;
    }

    if (form.mechanicType === "patrol_summon_steam") {
      p.heat = Math.min(100, (p.heat || 0) + (p.heatRate || 18));
      if (p.heat >= 100) {
        p.heat = 0;
        const count = Math.max(1, p.summonCount || 1);
        for (let i = 0; i < count; i++) {
          addDamageZone(state, {
            type: "circle",
            x: state.player.x,
            y: state.player.y,
            radius: 15,
            damage: 0,
            life: p.summonDuration || 5,
            maxLife: p.summonDuration || 5,
            tickEvery: 999,
            color: "#9ff8ff",
            visual: "thermos_drone_module",
            source: "thermos_drone",
            droneModule: true,
            moduleId: "thermos-module-" + i + "-" + state.stats.shots,
            droneDamage: p.damage || 12,
            dronePierce: p.dronePierce || 2,
            droneShootEvery: p.droneShootEvery || 0.72,
            droneTimer: i * 0.18,
            steamRange: p.steamRange || 220,
            steamRadius: p.steamRadius || 42,
            orbitPlayer: true,
            orbitAngle: Math.PI * 2 * (i / count),
            orbitRadius: 78 + i * 18,
            orbitSpeed: (p.orbitSpeed || 2.2) * (i % 2 ? -1 : 1),
            slow: p.slow || 0
          });
        }
        addCircleEvent(state, state.player.x, state.player.y, 68, "#9ff8ff", 0.28, "steam_drone", false, "thermos_drone_summon", { moduleCount: count });
        addTextEvent(state, state.player.x, state.player.y - 42, "自动恒温模块上线", "#bdf5ff", 0.7);
      } else if (target) {
        const dx = target.x - state.player.x;
        const dy = target.y - state.player.y;
        const len = Math.hypot(dx, dy) || 1;
        const x2 = state.player.x + dx / len * (p.steamRange || 220);
        const y2 = state.player.y + dy / len * (p.steamRange || 220);
        addBeamEvent(state, state.player.x, state.player.y, x2, y2, "#86f7ff", 9, 0.16, "steam", false, "thermos_warmup", { heat: p.heat, heatMax: 100 });
        lineHitEnemies(state, state.player.x, state.player.y, x2, y2, 11, Math.max(4, (p.damage || 12) * 0.55), 3, "thermos_steam");
      }
      return;
    }

    if (form.mechanicType === "charge_release_beam") {
      const heatMax = p.heatMax || 100;
      p.heat = Math.min(heatMax, (p.heat || 0) + (p.heatRate || 24));
      const dx = target.x - state.player.x;
      const dy = target.y - state.player.y;
      const len = Math.hypot(dx, dy) || 1;
      if (p.heat >= heatMax) {
        const releaseScale = p.overheatBank ? 1 + Math.max(0, heatMax - 100) / 200 : 1;
        p.heat = 0;
        p.releaseLockout = p.releaseLockoutDuration || (p.risk ? 1.55 : 1.05);
        if (p.demoV2SteamFan) {
          addCircleEvent(state, state.player.x, state.player.y, 72, "#bdf5ff", 0.24, "steam_pulse", false, "thermos_charge", { heatMax, releaseScale });
          addThermosSteamFans(state, target, {
            source: "thermos_release", range: p.releaseRange || 315, width: p.releaseWidth || 320,
            damage: (p.releaseTickDamage || 12.5) * releaseScale, duration: p.releaseDuration || 1.35,
            tickEvery: p.releaseTickEvery || 0.24, slow: p.releaseSlow || 0.8,
            rayWidth: 11, eventLife: 0.32, color: "#bdf5ff", visual: "thermos_release_fan"
          });
          addThermosModuleBranches(state, target, true);
          return;
        }
        const x2 = state.player.x + dx / len * (p.releaseRange || 420);
        const y2 = state.player.y + dy / len * (p.releaseRange || 420);
        const width = p.releaseWidth || 20;
        addCircleEvent(state, state.player.x, state.player.y, 72, "#bdf5ff", 0.22, "steam_pulse", false, "thermos_charge", { heatMax, releaseScale });
        addBeamEvent(state, state.player.x, state.player.y, x2, y2, "#bdf5ff", width, 0.32, "steam", false, "thermos_release", { heatMax, releaseScale, lockout: p.releaseLockout });
        lineHitEnemies(state, state.player.x, state.player.y, x2, y2, width + 2, (p.releaseDamage || 68) * releaseScale, 6, "thermos_release");
        if (p.shieldAfterRelease) {
          p.releaseShieldMax = Math.max(p.releaseShieldMax || 0, p.shieldAfterRelease);
          p.shield = Math.min(p.releaseShieldMax, (p.shield || 0) + p.shieldAfterRelease);
          addCircleEvent(state, state.player.x, state.player.y, 58, "#8fffe7", 0.28, "shield", false, "thermos_release_shield", { shield: p.shield, shieldMax: p.releaseShieldMax });
        }
      } else {
        const chargeRatio = Math.max(0.15, Math.min(1, p.heat / heatMax));
        if (p.demoV2SteamFan) {
          addCircleEvent(state, state.player.x, state.player.y, 38 + chargeRatio * 34, "#86f7ff", 0.18, "steam_pulse", false, "thermos_charge", { heat: p.heat, heatMax, chargeRatio });
          addThermosSteamFans(state, target, {
            source: "thermos_warmup", range: p.steamRange || 235, width: p.steamWidth || 210,
            damage: p.steamTickDamage || 4.5, duration: p.steamDuration || 0.95,
            tickEvery: p.steamTickEvery || 0.27, slow: p.steamSlow || 0.66,
            rayWidth: 7, eventLife: 0.2, color: "#86f7ff", visual: "thermos_steam_fan"
          });
          addThermosModuleBranches(state, target, false);
          return;
        }
        const x2 = state.player.x + dx / len * (p.steamRange || 220);
        const y2 = state.player.y + dy / len * (p.steamRange || 220);
        const width = 7 + chargeRatio * 5;
        addCircleEvent(state, state.player.x, state.player.y, 38 + chargeRatio * 34, "#86f7ff", 0.18, "steam_pulse", false, "thermos_charge", { heat: p.heat, heatMax, chargeRatio });
        addBeamEvent(state, state.player.x, state.player.y, x2, y2, "#86f7ff", width, 0.16, "steam", false, "thermos_warmup", { heat: p.heat, heatMax, chargeRatio });
        lineHitEnemies(state, state.player.x, state.player.y, x2, y2, width + 1, Math.max(5, (p.damage || 14) * 0.48), 3, "thermos_warmup");
      }
      return;
    }

    if (form.mechanicType === "shield_break_pulse") {
      const dx = target.x - state.player.x;
      const dy = target.y - state.player.y;
      const len = Math.hypot(dx, dy) || 1;
      const x2 = state.player.x + dx / len * (p.steamRange || 220);
      const y2 = state.player.y + dy / len * (p.steamRange || 220);
      const steamHits = lineHitEnemies(state, state.player.x, state.player.y, x2, y2, 10, Math.max(4, (p.damage || 11) * 0.5), 3, "thermos_shield_steam");
      addBeamEvent(state, state.player.x, state.player.y, x2, y2, "#8fffe7", 8, 0.16, "steam", false, "thermos_shield_steam", { hitEnemyIds: steamHits.map(function (hit) { return hit.enemy.id; }) });
      const shieldMax = p.shieldThreshold || 30;
      p.thermosShieldMax = shieldMax;
      p.shield = Math.min(shieldMax, (p.shield || 0) + Math.max(1, steamHits.length) * (p.shieldGain || 8));
      addCircleEvent(state, state.player.x, state.player.y, 48 + p.shield / shieldMax * 22, "#8fffe7", 0.28, "shield", false, "thermos_shield_charge", { shield: p.shield, shieldMax });
      return;
    }

    if (form.mechanicType === "periodic_wave_spread") {
      const waves = Math.max(1, p.waveCount || 1);
      for (let i = 0; i < waves; i++) {
        addThermosWavefront(state, { source: "thermos_tea_wave", x: state.player.x, y: state.player.y, radius: p.waveRadius || 125, damage: (p.spreadDamage || p.damage || 8) * (1 - i * 0.1), delay: i * 0.16, duration: 0.52, thickness: 30, color: i % 2 ? "#c5f5ff" : "#9ddfff", slow: p.slow || 0, debuff: "tea", teaRadius: p.teaRadius || 96, teaDamage: p.teaDamage || 6, visual: "thermos_wavefront", pulseIndex: i });
      }
      return;
    }

    if (form.mechanicType === "deployable_safe_station") {
      p.heat = Math.min(100, (p.heat || 0) + (p.heatRate || 20));
      if (p.heat < 100) {
        addCircleEvent(state, state.player.x, state.player.y, 34 + p.heat * 0.2, "#bfeeff", 0.2, "steam_pulse", false, "thermos_station_charge", { heat: p.heat, heatMax: 100 });
        if (target) {
          const endpoint = lineEndpointThroughTarget(state.player, target, Math.min(210, Math.hypot(target.x - state.player.x, target.y - state.player.y) + 20));
          addBeamEvent(state, state.player.x, state.player.y, endpoint.x, endpoint.y, "#bfeeff", 7, 0.14, "steam", false, "thermos_warmup", { heat: p.heat, heatMax: 100 });
          lineHitEnemies(state, state.player.x, state.player.y, endpoint.x, endpoint.y, 8, Math.max(3, (p.damage || 8) * 0.45), 2, "thermos_station_warmup");
        }
        return;
      }
      p.heat = 0;
      const stationLimit = p.stationLimit || 1;
      const existing = state.damageZones.filter(function (z) { return z.source === "thermos_station" && z.life > 0; });
      while (existing.length >= stationLimit) {
        const old = existing.shift();
        old.life = 0;
      }
      const sx = clamp(state.player.x, 70, worldWidth(state) - 70);
      const sy = clamp(state.player.y, 70, worldHeight(state) - 70);
      addCircleEvent(state, sx, sy, p.stationRadius || 130, "#bfeeff", 0.45, "station", false, "thermos_station", { stationIndex: existing.length });
      addDamageZone(state, {
        type: "circle",
        source: "thermos_station",
        x: sx,
        y: sy,
        radius: p.stationRadius || 130,
        damage: p.stationPulseDamage || p.damage || 8,
        life: p.stationDuration || 7,
        maxLife: p.stationDuration || 7,
        tickEvery: 0.36,
        color: "#bfeeff",
        visual: "thermos_station_field",
        slow: p.slow || 0.35,
        heal: p.heal || 1
      });
      return;
    }
  }

  function applyStickySecondary(state, x, y, target) {
    const p = state.activeFormParams || {};
    if (!p.secondaryDept) return;
    if (p.crossSeekingNote && target) {
      addDamageZone(state, {
        type: "circle", source: "secondary_sticky_seeking", x: state.player.x, y: state.player.y, radius: 20,
        damage: 0, triggerDamage: Math.max(5, (p.damage || 10) * 0.55), triggerRadius: 42,
        life: 2.1, maxLife: 2.1, tickEvery: 999, color: "#9ffcff", stickyTrap: true,
        seekingSticky: true, armed: true, armDelay: 0, seekSpeed: 150, bounceRemaining: 0,
        trapId: "secondary_seek_" + Date.now(), visual: "seeking_note"
      });
    }
    if (p.crossManualBlast) {
      addCircleEvent(state, x, y, Math.max(42, (p.explosionRadius || 70) * 0.55), "#a9f1ff", 0.26, "blast", false, "secondary_sticky_blast");
      addDamageZone(state, { type: "circle", source: "secondary_sticky_blast", x, y, radius: Math.max(42, (p.explosionRadius || 70) * 0.55), damage: Math.max(6, (p.damage || 10) * 0.7), life: 0.16, maxLife: 0.16, hitOnce: true, color: "#a9f1ff", visual: "secondary_sticky_blast" });
    }
    if (p.crossRouteShield) {
      addDamageZone(state, {
        type: "circle", source: "secondary_sticky_route", x: state.player.x, y: state.player.y, radius: 32,
        damage: Math.max(2, (p.damage || 8) * 0.3), life: 1.8, maxLife: 1.8, tickEvery: 0.5,
        color: "#8fffe7", slow: 0.18, stickyTrap: true, routeSticky: true, armed: true,
        routeClaimed: false, shieldGain: 4, routeHeal: 0, trapId: "secondary_route_" + Date.now(), visual: "route_note"
      });
    }
    if (p.crossStickySpread && target) {
      target.stickyDebuff = { radius: Math.max(80, (p.spreadRadius || 120) * 0.7), damage: Math.max(5, (p.damage || 9) * 0.6), limit: 1, depth: 1, slow: Math.max(0, (p.slow || 0) * 0.6) };
      addCircleEvent(state, target.x, target.y, 24, "#8df7ff", 0.24, "sticky_attach", false, "secondary_sticky_spread", { targetEnemyId: target.id });
    }
    if (p.crossBoardLink) {
      const radius = 58;
      const points = [0, 1, 2].map(function (index) {
        const angle = -Math.PI / 2 + index * Math.PI * 2 / 3;
        return { x: x + Math.cos(angle) * radius, y: y + Math.sin(angle) * radius };
      });
      for (let index = 0; index < points.length; index++) {
        const a = points[index];
        const b = points[(index + 1) % points.length];
        addBeamEvent(state, a.x, a.y, b.x, b.y, "#e8db92", 2, 0.45, "grid", false, "secondary_sticky_link", { polygonEdge: index });
      }
      addDamageZone(state, { type: "polygon", source: "secondary_sticky_notice", points, x, y, radius, damage: Math.max(5, (p.zoneDamage || p.damage || 9) * 0.55), life: 1.1, maxLife: 1.1, tickEvery: 0.32, color: "#e8db92", slow: 0.18, root: 0.08, visual: "notice_polygon" });
    }
  }

  function fireSticky(state) {
    const p = state.activeFormParams;
    const form = state.activeForm || {};
    const mechanic = form.mechanicType || "ground_trap";
    const target = nearestEnemy(state, mechanic === "trap_link_control_zone" ? 900 : 520);
    const targetAngle = target ? Math.atan2(target.y - state.player.y, target.x - state.player.x) : Math.random() * Math.PI * 2;
    const trapId = "sticky_" + Date.now() + "_" + Math.random().toString(16).slice(2);
    let x = clamp(state.player.x + Math.cos(targetAngle) * 76, 55, worldWidth(state) - 55);
    let y = clamp(state.player.y + Math.sin(targetAngle) * 76, 55, worldHeight(state) - 55);

    if (mechanic === "sticky_debuff_spread") {
      if (!target) return;
      state.stats.shots += 1;
      target.stickyDebuff = {
        radius: p.spreadRadius || 120,
        damage: p.spreadDamage || p.damage || 9,
        limit: p.spreadLimit || 3,
        depth: p.spreadDepth == null ? 2 : p.spreadDepth,
        slow: p.slow || 0
      };
      if (p.slow) target.speed *= Math.max(0.45, 1 - p.slow);
      damageEnemy(state, target, p.damage || 9, "sticky_attach", state.player);
      addCircleEvent(state, target.x, target.y, 30, "#8df7ff", 0.34, "sticky_attach", false, "sticky_spread_attach", { targetEnemyId: target.id });
      addTextEvent(state, target.x, target.y - 26, "贴上", "#8df7ff", 0.45);
      applyStickySecondary(state, target.x, target.y, target);
      return;
    }

    if (mechanic === "manual_trap_detonate" && state.input && state.input.trigger) {
      state.input.trigger = false;
      if (detonateManualStickyTraps(state) > 0) {
        state.stats.shots += 1;
        return;
      }
    }

    if (mechanic === "route_buff_trap") {
      const input = state.input || {};
      const ix = (input.right ? 1 : 0) - (input.left ? 1 : 0);
      const iy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
      const routeAngle = Math.hypot(ix, iy) > 0 ? Math.atan2(iy, ix) : targetAngle;
      x = clamp(state.player.x - Math.cos(routeAngle) * 44, 55, worldWidth(state) - 55);
      y = clamp(state.player.y - Math.sin(routeAngle) * 44, 55, worldHeight(state) - 55);
    }

    if (mechanic === "trap_link_control_zone") {
      const placement = p.noticePlacementIndex || 0;
      if (placement === 0 || p.noticeAnchorX == null || p.noticeAnchorY == null) {
        p.noticeAnchorX = target ? target.x : state.player.x + Math.cos(targetAngle) * 110;
        p.noticeAnchorY = target ? target.y : state.player.y + Math.sin(targetAngle) * 110;
        p.noticeAnchorAngle = targetAngle;
      }
      const nodeRadius = Math.min(66, (p.linkRadius || 170) * 0.38);
      if (placement === 2 && target) {
        p.noticeAnchorX = target.x;
        p.noticeAnchorY = target.y;
        p.noticeAnchorAngle = targetAngle;
        const pendingNodes = state.damageZones.filter(function (zone) {
          return zone.noticeNode && !zone.linked && zone.life > 0;
        }).slice(-2);
        pendingNodes.forEach(function (node, index) {
          const snapAngle = p.noticeAnchorAngle + index * Math.PI * 2 / 3;
          node.x = clamp(p.noticeAnchorX + Math.cos(snapAngle) * nodeRadius, 55, worldWidth(state) - 55);
          node.y = clamp(p.noticeAnchorY + Math.sin(snapAngle) * nodeRadius, 55, worldHeight(state) - 55);
          addBeamEvent(state, node.x, node.y, target.x, target.y, "#e8db92", 2, 0.18, "grid", false, "sticky_notice_align", { trapId: node.trapId });
        });
      }
      const nodeAngle = (p.noticeAnchorAngle || 0) + placement * Math.PI * 2 / 3;
      x = clamp(p.noticeAnchorX + Math.cos(nodeAngle) * nodeRadius, 55, worldWidth(state) - 55);
      y = clamp(p.noticeAnchorY + Math.sin(nodeAngle) * nodeRadius, 55, worldHeight(state) - 55);
      p.noticePlacementIndex = (placement + 1) % 3;
      if (p.noticePlacementIndex === 0) {
        p.noticeAnchorX = null;
        p.noticeAnchorY = null;
      }
    }

    const trapRadius = p.trapRadius || (mechanic === "trap_link_control_zone" ? 30 : mechanic === "route_buff_trap" ? 38 : 26);
    const stickySource = mechanic === "trap_link_control_zone" ? "sticky_notice_trap"
      : mechanic === "route_buff_trap" ? "sticky_route"
        : mechanic === "seeking_trap_summon" ? "sticky_seeking"
          : mechanic === "manual_trap_detonate" ? "sticky_manual_trap"
            : "sticky_base";
    const visualKind = mechanic === "route_buff_trap" ? "route_note"
      : mechanic === "seeking_trap_summon" ? "seeking_note"
        : mechanic === "trap_link_control_zone" ? "notice_node"
          : "sticky_note";
    addCircleEvent(state, x, y, trapRadius, mechanic === "trap_link_control_zone" ? "#e8db92" : "#86f7ff", 0.45, "trap", false, stickySource, { trapId, mechanic });
    addDamageZone(state, {
      type: "circle",
      x,
      y,
      radius: trapRadius,
      damage: mechanic === "route_buff_trap" ? (p.damage || 8) : 0,
      life: p.trapDuration || 5,
      maxLife: p.trapDuration || 5,
      tickEvery: mechanic === "route_buff_trap" ? 0.5 : 999,
      color: mechanic === "trap_link_control_zone" ? "#e8db92" : "#86f7ff",
      slow: p.slow || 0.25,
      stickyTrap: true,
      trapId,
      armed: false,
      armDelay: p.armDelay == null ? (mechanic === "seeking_trap_summon" ? 0.18 : 0.3) : p.armDelay,
      groundSticky: mechanic === "ground_trap",
      seekingSticky: mechanic === "seeking_trap_summon",
      manualSticky: mechanic === "manual_trap_detonate",
      routeSticky: mechanic === "route_buff_trap",
      noticeNode: mechanic === "trap_link_control_zone",
      triggerDamage: mechanic === "ground_trap" ? (p.damage || 10) * 2.25 : (p.damage || 10),
      triggerRadius: p.triggerRadius || Math.max(48, trapRadius * 1.8),
      routeHeal: p.routeHeal || 0,
      shieldGain: p.shieldGain || 3,
      seekSpeed: p.seekSpeed || 120,
      zoneDamage: p.zoneDamage || 0,
      source: stickySource,
      visual: visualKind,
      bounceRemaining: p.seekBounce ? 1 : 0
    });
    if (mechanic === "trap_link_control_zone" && target) {
      const pinDamage = Math.max(8, (p.zoneDamage || p.damage || 9) * 1.1);
      damageEnemy(state, target, pinDamage, "sticky_notice_pin", { x, y });
      target.rooted = Math.max(target.rooted || 0, 1);
      addCircleEvent(state, target.x, target.y, target.r + 12, "#e8db92", 0.2, "mark", false, "sticky_notice_pin", { trapId, targetEnemyId: target.id });
    }
    state.stats.shots += 1;
    if (p.demoV2StickyExpedite > 0 && p.demoV2StickyExpediteEvery > 0 && state.stats.shots % p.demoV2StickyExpediteEvery === 0 && target) {
      const expediteRadius = 32 + p.demoV2StickyExpedite * 9;
      addCircleEvent(state, target.x, target.y, expediteRadius, "#fff0a8", 0.3, "sticky_attach", false, "sticky_module_expedite", {
        level: p.demoV2StickyExpedite,
        targetEnemyId: target.id
      });
      addDamageZone(state, {
        type: "circle", source: "sticky_module_expedite", x: target.x, y: target.y,
        radius: expediteRadius, damage: 5 + p.demoV2StickyExpedite * 3,
        life: 0.16, maxLife: 0.16, hitOnce: true,
        color: "#fff0a8", slow: 0.18, root: 0.12 + p.demoV2StickyExpedite * 0.05,
        visual: "sticky_trigger_blast"
      });
    }
    applyStickySecondary(state, x, y, target);
    if (p.demoV2StickyCopies > 0 && !p.demoV2StickyCopyGuard) {
      p.demoV2StickyCopyGuard = true;
      for (let copyIndex = 0; copyIndex < p.demoV2StickyCopies; copyIndex++) fireSticky(state);
      p.demoV2StickyCopyGuard = false;
    }
  }

  function fireGeneric(state) {
    const p = state.activeFormParams;
    const target = nearestEnemy(state, p.range || 340);
    if (!target) return;
      state.projectiles.push(CombatPrimitives.projectile({
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
      }));
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
      addBeamEvent(state, state.player.x, state.player.y, x2, y2, "#c7f8ff", 4, 0.18, "support", "marker_beam", "support_marker");
      lineHitEnemies(state, state.player.x, state.player.y, x2, y2, 5, Math.max(10, (state.activeFormParams.damage || 12) * 0.42), 5, "support_marker");
      return;
    }
    if (skill.type === "support_thermos_pulse") {
      const radius = 128;
      addThermosWavefront(state, {
        source: "support_thermos_wave",
        x: state.player.x,
        y: state.player.y,
        radius,
        damage: Math.max(9, (state.activeFormParams.damage || 12) * 0.5),
        duration: 0.52,
        thickness: 28,
        color: "#aaf4ff",
        slow: 0.18,
        visual: "thermos_wavefront"
      });
      return;
    }
    if (skill.type === "support_sticky_trap") {
      const angle = target ? Math.atan2(target.y - state.player.y, target.x - state.player.x) : Math.random() * Math.PI * 2;
      const x = clamp(state.player.x + Math.cos(angle) * 96, 60, worldWidth(state) - 60);
      const y = clamp(state.player.y + Math.sin(angle) * 96, 60, worldHeight(state) - 60);
      const trapId = "support_sticky_" + Date.now() + "_" + Math.random().toString(16).slice(2);
      addCircleEvent(state, x, y, 28, "#8df7ff", 0.32, "support_trap", false, "support_sticky_trap", { trapId });
      addDamageZone(state, {
        type: "circle",
        source: "support_sticky_trap",
        x,
        y,
        radius: 28,
        damage: 0,
        life: 4.2,
        maxLife: 4.2,
        tickEvery: 999,
        color: "#8df7ff",
        visual: "sticky_note",
        stickyTrap: true,
        groundSticky: true,
        armed: false,
        armDelay: 0.32,
        trapId,
        triggerSource: "support_sticky_trigger",
        triggerDamage: Math.max(8, (state.activeFormParams.damage || 12) * 0.55),
        triggerRadius: 64,
        slow: 0.25
      });
      return;
    }
    if (target) {
      state.projectiles.push(CombatPrimitives.projectile({ x: state.player.x, y: state.player.y, targetId: target.id, speed: 380, damage: Math.max(8, (state.activeFormParams.damage || 12) * 0.35), radius: 5, life: 2, source: "support_weapon", color: "#bdf5ff" }));
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
    else if (id === "scissors") fireScissorsFixedTest(state);
    else if (id === "correction_fluid") fireCorrectionFluidFixedTest(state);
    else fireGeneric(state);
  }

  function recordEnemySpawn(state, typeId) {
    if (!state.stats.enemyTypesSpawned) state.stats.enemyTypesSpawned = {};
    state.stats.enemyTypesSpawned[typeId] = (state.stats.enemyTypesSpawned[typeId] || 0) + 1;
  }

  function pickEnemyType(stage) {
    const mix = stage.enemyMix && stage.enemyMix.length ? stage.enemyMix : [{ type: "todo", weight: 1 }];
    const total = mix.reduce(function (sum, item) { return sum + Math.max(0, item.weight || 1); }, 0) || 1;
    let roll = Math.random() * total;
    for (const item of mix) {
      roll -= Math.max(0, item.weight || 1);
      if (roll <= 0) return item.type || "todo";
    }
    return mix[mix.length - 1].type || "todo";
  }

  function makeEnemy(state, typeId, x, y, options) {
    const stage = state.stage;
    const boss = !!(options && options.boss);
    const fragment = !!(options && options.fragment);
    const def = boss ? (BOSS_DEFS[stage.bossType] || BOSS_DEFS.lead) : (ENEMY_DEFS[typeId] || ENEMY_DEFS.todo);
    const normalEnemyHp = stage.normalEnemyHp == null ? stage.enemyHp : stage.normalEnemyHp;
    const hp = boss
      ? stage.enemyHp
      : Math.max(6, normalEnemyHp * (def.hp || 1) + Math.random() * stage.id * 3);
    const speed = boss
      ? stage.enemySpeed * (def.speed || 1)
      : stage.enemySpeed * (def.speed || 1) + Math.random() * 8;
    const sustainedPressure = !!(state.demoV2 && state.demoV2.sustainedPressurePass);
    const bossPressure = boss && !!(state.demoV2 && state.demoV2.bossPressurePass);
    const openingActionScale = stage.enemyActionRateScale || 1;
    const openingProjectileScale = stage.enemyProjectileSpeedScale || 1;
    const actionRateScale = (bossPressure ? 0.7 : sustainedPressure ? 0.74 : 1) * openingActionScale;
    const projectileSpeedScale = (bossPressure ? 1.18 : sustainedPressure ? 1.2 : 1) * openingProjectileScale;
    const damagePressureScale = bossPressure ? 1.14 : 1;
    const encounterDamageScale = stage.enemyDamageScale || 1;
    return {
      id: "e" + Date.now() + "_" + Math.random().toString(16).slice(2),
      typeId: boss ? (stage.bossType || "boss") : typeId,
      name: def.name,
      behavior: def.behavior || "chase",
      x,
      y,
      r: boss ? 30 : Math.max(9, (def.radius || 13) * (fragment ? 0.72 : 1)),
      hp: fragment ? hp * 0.34 : hp,
      maxHp: fragment ? hp * 0.34 : hp,
      speed: fragment ? speed * 1.18 : speed,
      damage: (boss ? 18 + stage.id * 0.45 : def.damage || 7) * (fixedTestConfig(state) ? 1.12 : 1) * damagePressureScale * encounterDamageScale,
      xp: boss ? 50 : Math.max(3, Math.round((def.xp || 5) * (fragment ? 0.45 : 1))),
      boss,
      fragment,
      dead: false,
      hitCooldown: 0,
      p0Marked: false,
      phase: Math.random() * Math.PI * 2,
      age: 0,
      color: def.color || "#c82345",
      accent: def.accent || "#ff6b8a",
      armor: def.armor || 0,
      bossHitCap: boss ? (stage.bossHitCap || 0) : 0,
      shootEvery: (def.shootEvery || (bossPressure ? 2.25 : 0)) * actionRateScale,
      projectileSpeed: (def.projectileSpeed || 245) * projectileSpeedScale,
      shootCooldown: (def.shootEvery || (bossPressure ? 2.25 : 2.4)) * actionRateScale * (0.42 + Math.random() * 0.48),
      chargeEvery: (def.chargeEvery || 0) * actionRateScale,
      chargeSpeed: (def.chargeSpeed || 240) * (bossPressure ? 1.12 : sustainedPressure ? 1.16 : 1),
      chargeCooldown: (def.chargeEvery || 2.8) * actionRateScale * (0.42 + Math.random() * 0.5),
      chargeTime: 0,
      chargeVx: 0,
      chargeVy: 0,
      splitType: def.splitType || "",
      bossPatternCooldown: boss ? (bossPressure ? 0.82 : 1.25) : 0,
      bossPatternKind: "",
      bossPatternTimer: 0,
      bossPatternAngle: 0,
      bossPatternIndex: 0
    };
  }

  function markerFixedQuotaAllowsSpawn(state) {
    const config = fixedTestConfig(state);
    if (!config) return true;
    const encounter = config && config.currentEncounter ? config.currentEncounter(state) : null;
    const test = fixedTestRuntime(state);
    return !!(encounter && test && test.encounterSpawned < encounter.spawnTotal);
  }

  function recordMarkerFixedQuotaSpawn(state, enemy) {
    if (!fixedTestConfig(state) || !enemy || enemy.boss) return;
    const test = fixedTestRuntime(state);
    if (!test) return;
    test.encounterSpawned += 1;
    enemy.markerFixedEncounterEnemy = true;
  }

  function spawnChildEnemy(state, parent, typeId, side) {
    if (!markerFixedQuotaAllowsSpawn(state)) return null;
    const angle = Math.atan2(parent.y - state.player.y, parent.x - state.player.x) + side * 0.85;
    const child = makeEnemy(state, typeId || "todo", clamp(parent.x + Math.cos(angle) * 18, 35, worldWidth(state) - 35), clamp(parent.y + Math.sin(angle) * 18, 35, worldHeight(state) - 35), { fragment: true });
    child.speed *= 1.15;
    state.enemies.push(child);
    recordMarkerFixedQuotaSpawn(state, child);
    recordEnemySpawn(state, child.typeId + "_fragment");
    return child;
  }

  function spawnEnemy(state) {
    const stage = state.stage;
    updateCamera(state);
    const camera = state.camera || { x: 0, y: 0, width: W, height: H };
    const side = Math.floor(Math.random() * 4);
    const margin = 48;
    let x = side === 0 ? camera.x - margin : side === 1 ? camera.x + camera.width + margin : camera.x + Math.random() * camera.width;
    let y = side === 2 ? camera.y - margin : side === 3 ? camera.y + camera.height + margin : camera.y + Math.random() * camera.height;
    x = clamp(x, -margin, worldWidth(state) + margin);
    y = clamp(y, -margin, worldHeight(state) + margin);
    const boss = !!stage.boss && !state.stageBossSpawned;
    const typeId = boss ? (stage.bossType || "lead") : pickEnemyType(stage);
    const enemy = makeEnemy(state, typeId, x, y, { boss });
    if (boss) state.stageBossSpawned = true;
    state.enemies.push(enemy);
    recordEnemySpawn(state, enemy.typeId);
  }

  function addDemoV2Enemy(state, typeId, x, y) {
    const phase = state.stage && state.stage.demoV2Phase;
    const fixedConfig = fixedTestConfig(state);
    const config = fixedConfig || (V2.demoV2 && (phase === "phase-b" ? V2.demoV2.phaseB : V2.demoV2.phaseA));
    const markerEncounter = fixedConfig && config && config.currentEncounter ? config.currentEncounter(state) : null;
    const enemyCap = markerEncounter ? markerEncounter.cap : config && config.enemyCap;
    if (enemyCap && state.enemies.length >= enemyCap) return null;
    if (fixedConfig && !markerFixedQuotaAllowsSpawn(state)) return null;
    const margin = 44;
    const enemy = makeEnemy(
      state,
      typeId,
      clamp(x, -margin, worldWidth(state) + margin),
      clamp(y, -margin, worldHeight(state) + margin),
      { boss: false }
    );
    if (fixedConfig) {
      const test = fixedTestRuntime(state);
      if (typeId === "meeting" || typeId === "approval" || typeId === "client") {
        test.eliteCandidateSerial += 1;
        if (test.eliteCandidateSerial % 5 === 0) {
          enemy.markerFixedElite = true;
          enemy.name = "精英 · " + enemy.name;
          enemy.hp *= 1.85;
          enemy.maxHp = enemy.hp;
          enemy.r *= 1.16;
          enemy.xp = Math.round(enemy.xp * 2.4);
          enemy.accent = "#ffe28a";
        }
      }
    }
    state.enemies.push(enemy);
    recordMarkerFixedQuotaSpawn(state, enemy);
    recordEnemySpawn(state, enemy.typeId);
    return enemy;
  }

  function spawnMarkerFixedBoss(state, config) {
    if (!state.stage || !state.stage.boss || state.stageBossSpawned) return null;
    const encounter = config && config.currentEncounter ? config.currentEncounter(state) : null;
    updateCamera(state);
    const camera = state.camera || { x: 0, y: 0, width: W, height: H };
    const x = clamp(camera.x + camera.width * 0.78, 80, worldWidth(state) - 80);
    const y = clamp(camera.y + camera.height * 0.32, 80, worldHeight(state) - 80);
    const boss = makeEnemy(state, state.stage.bossType || "lead", x, y, { boss: true });
    boss.markerFixedBoss = true;
    boss.markerFixedBossMaterial = encounter && encounter.bossMaterial || 1;
    boss.xp = Math.max(50, Math.round((encounter && encounter.phase || 1) * 24));
    state.stageBossSpawned = true;
    state.enemies.push(boss);
    recordEnemySpawn(state, boss.typeId);
    addTextEvent(state, boss.x, boss.y - boss.r - 16, boss.name, boss.accent || "#ffe28a", 1.1);
    return boss;
  }

  function demoV2EdgePoint(state, side, offset, depth) {
    updateCamera(state);
    const camera = state.camera || { x: 0, y: 0, width: W, height: H };
    const margin = 46 + (depth || 0);
    if (side === 0) return { x: camera.x - margin, y: state.player.y + offset };
    if (side === 1) return { x: camera.x + camera.width + margin, y: state.player.y + offset };
    if (side === 2) return { x: state.player.x + offset, y: camera.y - margin };
    return { x: state.player.x + offset, y: camera.y + camera.height + margin };
  }

  function demoV2PerimeterPoint(state, angle, depth, tangentOffset) {
    updateCamera(state);
    const camera = state.camera || { x: 0, y: 0, width: W, height: H };
    const vx = Math.cos(angle);
    const vy = Math.sin(angle);
    const margin = 52 + Math.max(0, depth || 0);
    const horizontalDistance = Math.abs(vx) < 0.001 ? Infinity : (camera.width / 2 + margin) / Math.abs(vx);
    const verticalDistance = Math.abs(vy) < 0.001 ? Infinity : (camera.height / 2 + margin) / Math.abs(vy);
    const radius = Math.min(horizontalDistance, verticalDistance);
    const tangent = tangentOffset || 0;
    return {
      x: clamp(state.player.x + vx * radius - vy * tangent, -margin, worldWidth(state) + margin),
      y: clamp(state.player.y + vy * radius + vx * tangent, -margin, worldHeight(state) + margin),
      angle
    };
  }

  function spawnDemoV2QueueWave(state, wave, serial) {
    if (state.demoV2 && state.demoV2.randomizedPerimeterSpawns) {
      const baseAngle = Math.random() * Math.PI * 2;
      for (let i = 0; i < wave.batchSize; i++) {
        const laneOffset = (i - (wave.batchSize - 1) / 2) * 11;
        const point = demoV2PerimeterPoint(state, baseAngle + (Math.random() - 0.5) * 0.12, i * 13, laneOffset);
        addDemoV2Enemy(state, demoV2WaveEnemyType(wave, i, serial, i % 3 === 1 ? "email" : "todo"), point.x, point.y);
      }
      return;
    }
    const side = serial % 4;
    for (let i = 0; i < wave.batchSize; i++) {
      const point = demoV2EdgePoint(state, side, (i % 2 ? 1 : -1) * Math.floor(i / 2) * 7, i * 34);
      addDemoV2Enemy(state, demoV2WaveEnemyType(wave, i, serial, i % 3 === 1 ? "email" : "todo"), point.x, point.y);
    }
  }

  function demoV2WaveEnemyType(wave, index, serial, fallback) {
    const roster = wave && wave.enemyRoster;
    if (!Array.isArray(roster) || !roster.length) return fallback || "todo";
    return roster[(index + serial) % roster.length] || fallback || "todo";
  }

  function spawnDemoV2ClusterWave(state, wave, serial) {
    if (state.demoV2 && state.demoV2.randomizedPerimeterSpawns) {
      const center = demoV2PerimeterPoint(state, Math.random() * Math.PI * 2, 10 + Math.random() * 34, 0);
      for (let i = 0; i < wave.batchSize; i++) {
        const angle = Math.PI * 2 * i / wave.batchSize + Math.random() * 0.24;
        const radius = 18 + Math.random() * 30;
        addDemoV2Enemy(state, demoV2WaveEnemyType(wave, i, serial, i === wave.batchSize - 1 ? "meeting" : "todo"), center.x + Math.cos(angle) * radius, center.y + Math.sin(angle) * radius);
      }
      return;
    }
    const side = (serial + 1) % 4;
    const center = demoV2EdgePoint(state, side, ((serial % 3) - 1) * 90, 8);
    for (let i = 0; i < wave.batchSize; i++) {
      const angle = Math.PI * 2 * i / wave.batchSize;
      const radius = 18 + (i % 3) * 12;
      addDemoV2Enemy(state, demoV2WaveEnemyType(wave, i, serial, i === wave.batchSize - 1 ? "meeting" : "todo"), center.x + Math.cos(angle) * radius, center.y + Math.sin(angle) * radius);
    }
  }

  function spawnDemoV2PursuitWave(state, wave, serial) {
    const randomizedPerimeter = state.demoV2 && state.demoV2.randomizedPerimeterSpawns;
    const rotation = randomizedPerimeter ? Math.random() * Math.PI * 2 : serial * 0.37;
    for (let i = 0; i < wave.batchSize; i++) {
      const angle = Math.PI * 2 * i / wave.batchSize + rotation + (randomizedPerimeter ? (Math.random() - 0.5) * 0.38 : 0);
      const typeId = demoV2WaveEnemyType(wave, i, serial, i % 4 === 0 ? "deadline" : i % 3 === 0 ? "email" : "todo");
      const point = randomizedPerimeter
        ? demoV2PerimeterPoint(state, angle, Math.random() * 70, (Math.random() - 0.5) * 34)
        : { x: state.player.x + Math.cos(angle) * (430 + (i % 2) * 48), y: state.player.y + Math.sin(angle) * (430 + (i % 2) * 48) };
      addDemoV2Enemy(state, typeId, point.x, point.y);
    }
  }

  function spawnDemoV2ReviewWave(state, wave, serial) {
    const types = ["todo", "todo", "email", "meeting", "ping", "deadline", "scope", "approval", "client"];
    const randomizedPerimeter = state.demoV2 && state.demoV2.randomizedPerimeterSpawns;
    const rotation = randomizedPerimeter ? Math.random() * Math.PI * 2 : serial * 0.29;
    for (let i = 0; i < wave.batchSize; i++) {
      const angle = Math.PI * 2 * i / wave.batchSize + rotation + (randomizedPerimeter ? (Math.random() - 0.5) * 0.44 : 0);
      const point = randomizedPerimeter
        ? demoV2PerimeterPoint(state, angle, Math.random() * 92, (Math.random() - 0.5) * 42)
        : { x: state.player.x + Math.cos(angle) * (410 + (i % 3) * 42), y: state.player.y + Math.sin(angle) * (410 + (i % 3) * 42) };
      addDemoV2Enemy(state, demoV2WaveEnemyType(wave, i, serial, types[(i + serial) % types.length]), point.x, point.y);
    }
  }

  function spawnDemoV2Wave(state, wave) {
    const runtime = state.demoV2 || (state.demoV2 = {});
    const serial = runtime.waveSerial || 0;
    const pattern = wave.pattern || wave.id;
    if (pattern === "queue") spawnDemoV2QueueWave(state, wave, serial);
    else if (pattern === "cluster") spawnDemoV2ClusterWave(state, wave, serial);
    else if (pattern === "pursuit") spawnDemoV2PursuitWave(state, wave, serial);
    else spawnDemoV2ReviewWave(state, wave, serial);
    runtime.waveSerial = serial + 1;
    if (!state.stats.demoV2WaveCounts) state.stats.demoV2WaveCounts = {};
    state.stats.demoV2WaveCounts[wave.id] = (state.stats.demoV2WaveCounts[wave.id] || 0) + 1;
  }

  function demoV2ReleasedQuota(state, encounter, test) {
    if (!encounter || !test || !state.demoV2 || !state.demoV2.sustainedPressurePass) {
      return encounter ? encounter.spawnTotal : Infinity;
    }
    const elapsed = Math.max(0, encounter.duration - state.stageTime);
    const releaseWindow = Math.max(1, encounter.duration * (encounter.pressureSpawnWindowRatio || 0.88));
    const initialQuota = Math.min(encounter.spawnTotal, Math.max(
      Math.ceil(encounter.batchSize * 1.25),
      Math.ceil(encounter.floor * 0.48),
      Math.ceil(encounter.spawnTotal * 0.14)
    ));
    const progress = clamp(elapsed / releaseWindow, 0, 1);
    return Math.min(encounter.spawnTotal, Math.ceil(initialQuota + (encounter.spawnTotal - initialQuota) * progress));
  }

  function updateDemoV2Director(state, dt) {
    const phase = state.stage && state.stage.demoV2Phase;
    const fixedConfig = fixedTestConfig(state);
    const config = fixedConfig || (V2.demoV2 && (phase === "phase-b" ? V2.demoV2.phaseB : V2.demoV2.phaseA));
    if (!config) return;
    const runtime = state.demoV2 || (state.demoV2 = {});
    runtime.elapsed = fixedConfig && config.totalElapsed
      ? config.totalElapsed(state)
      : Math.max(0, config.duration - state.stageTime);
    const fixedRuntime = fixedTestRuntime(state);
    const markerWaveIndex = fixedConfig && fixedRuntime ? fixedRuntime.currentEncounterIndex : -1;
    const waveIndex = markerWaveIndex >= 0 ? markerWaveIndex : Math.max(0, config.waves.findIndex(function (wave) {
      return runtime.elapsed >= wave.start && runtime.elapsed < wave.end;
    }));
    let wave = config.waves[waveIndex] || config.waves[config.waves.length - 1];

    if (runtime.waveIndex !== waveIndex) {
      runtime.waveIndex = waveIndex;
      runtime.waveId = wave.id;
      runtime.waveTimer = 0;
      runtime.floorTimer = 0;
      if (runtime.wavesSeen.indexOf(wave.id) < 0) runtime.wavesSeen.push(wave.id);
      state.stage.name = (fixedConfig ? fixedConfig.weaponName + " · " : phase === "phase-b" ? "阶段 B · " : "阶段 A · ") + wave.label;
      state.stage.threatHint = wave.hint;
      addTextEvent(state, state.player.x, state.player.y - 72, wave.label, "#bdf5ff", 0.85);
    }

    const markerEncounter = fixedConfig && config.currentEncounter ? config.currentEncounter(state) : null;
    const markerTest = fixedRuntime;
    if (markerEncounter) {
      // The encounter is authoritative for fixed-suite density. V3.1 can now
      // tune one real roster without mutating the preserved config snapshots.
      wave = Object.assign({}, wave, {
        batchSize: markerEncounter.batchSize,
        cadence: markerEncounter.cadence,
        enemyRoster: markerEncounter.enemyRoster || wave.enemyRoster
      });
    }
    const releasedQuota = markerEncounter && markerTest ? demoV2ReleasedQuota(state, markerEncounter, markerTest) : Infinity;
    if (markerTest && markerEncounter) markerTest.releasedQuota = releasedQuota;
    const quotaRemaining = markerEncounter && markerTest ? Math.max(0, releasedQuota - markerTest.encounterSpawned) : Infinity;
    const enemyCap = markerEncounter ? markerEncounter.cap : config.enemyCap;
    const enemyFloor = markerEncounter ? markerEncounter.floor : config.enemyFloor;
    if (fixedConfig && markerEncounter && markerEncounter.boss) spawnMarkerFixedBoss(state, config);

    runtime.waveTimer = (runtime.waveTimer || 0) - dt;
    if (runtime.waveTimer <= 0 && state.enemies.length < enemyCap && quotaRemaining > 0) {
      const quotaWave = markerEncounter ? Object.assign({}, wave, { batchSize: Math.min(wave.batchSize, quotaRemaining) }) : wave;
      spawnDemoV2Wave(state, quotaWave);
      runtime.waveTimer = wave.cadence;
    }

    runtime.floorTimer = (runtime.floorTimer || 0) - dt;
    const encounterLocalElapsed = markerEncounter ? Math.max(0, markerEncounter.duration - state.stageTime) : runtime.elapsed;
    const remainingAfterWave = markerEncounter && markerTest ? Math.max(0, releasedQuota - markerTest.encounterSpawned) : Infinity;
    if (encounterLocalElapsed >= 2 && state.enemies.length < enemyFloor && runtime.floorTimer <= 0 && remainingAfterWave > 0) {
      const fillWave = { id: "cluster", batchSize: Math.min(state.demoV2.sustainedPressurePass ? 4 : 6, enemyFloor - state.enemies.length, remainingAfterWave), enemyRoster: wave.enemyRoster };
      spawnDemoV2ClusterWave(state, fillWave, runtime.waveSerial || 0);
      runtime.floorTimer = state.demoV2.sustainedPressurePass ? 0.62 : 1.1;
    }

    runtime.peakEnemies = Math.max(runtime.peakEnemies || 0, state.enemies.length);
    state.stats.peakEnemies = Math.max(state.stats.peakEnemies || 0, state.enemies.length);
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
    const scissors = scissorsFixedRuntime(state);
    if (scissors && (x || y)) {
      scissors.facingAngle = Math.atan2(y, x);
      scissors.bodyFacing = markerBodyFacingFromVector(x, y);
    }
    const marker = markerFixedRuntime(state);
    if (marker && (x || y)) marker.bodyFacing = markerBodyFacingFromVector(x, y);
    const thermos = fixedTestConfig(state) && fixedTestConfig(state).weaponId === "thermos" ? fixedTestRuntime(state) : null;
    if (thermos && (x || y)) thermos.bodyFacing = markerBodyFacingFromVector(x, y);
    const correction = correctionFluidRuntime(state);
    if (correction && (x || y)) correction.bodyFacing = markerBodyFacingFromVector(x, y);
    if (scissors && scissors.dashMotionTime > 0) {
      const motionStep = Math.min(dt, scissors.dashMotionTime);
      state.player.x = clamp(state.player.x + (scissors.dashMotionVx || 0) * motionStep, 26, worldWidth(state) - 26);
      state.player.y = clamp(state.player.y + (scissors.dashMotionVy || 0) * motionStep, 26, worldHeight(state) - 26);
      scissors.dashMotionTime = Math.max(0, scissors.dashMotionTime - motionStep);
    } else {
      state.player.x = clamp(state.player.x + x / len * state.player.speed * dt, 26, worldWidth(state) - 26);
      state.player.y = clamp(state.player.y + y / len * state.player.speed * dt, 26, worldHeight(state) - 26);
    }
    updateCamera(state);
    state.player.invuln = Math.max(0, state.player.invuln - dt);
  }

  function damagePlayer(state, amount, color) {
    let incoming = amount;
    const params = state.activeFormParams || {};
    if (params.markerFixedDodgeChance > 0 && Math.random() < params.markerFixedDodgeChance) {
      state.player.invuln = 0.18;
      addTextEvent(state, state.player.x, state.player.y - 30, "闪避", "#9fe7ff", 0.42);
      return;
    }
    if (params.markerFixedArmor > 0) incoming *= 15 / (15 + params.markerFixedArmor);
    const shieldBefore = params.shield || 0;
    if ((params.shield || 0) > 0) {
      const absorb = Math.min(params.shield, incoming);
      params.shield -= absorb;
      incoming -= absorb;
      addCircleEvent(state, state.player.x, state.player.y, 54, "#8fffe7", 0.24, "shield");
    }
    if (shieldBefore > 0 && (params.shield || 0) <= 0 && ((state.activeForm && state.activeForm.mechanicType === "shield_counter_line") || params.crossShield)) {
      triggerMarkerCounter(state);
    }
    if (shieldBefore > 0 && (params.shield || 0) <= 0 && ((state.activeForm && state.activeForm.mechanicType === "shield_break_pulse") || params.crossWarmShield)) {
      triggerThermosShieldBreak(state);
    }
    if (incoming <= 0) return;
    state.hp -= incoming;
    state.stats.damageTaken += incoming;
    state.player.invuln = 0.55;
    addParticle(state, state.player.x, state.player.y, color || "#ff6b4a", 8);
    const config = fixedTestConfig(state);
    if (config && config.onPlayerDamaged && config.onPlayerDamaged(state)) {
      addCircleEvent(state, state.player.x, state.player.y, params.scissorsShelterRadius || 108, "#7deaff", 0.48, "shield", false, "scissors_test_shelter");
      addTextEvent(state, state.player.x, state.player.y - 36, "临时安全区", "#b8f7ff", 0.65);
    }
    if (state.hp <= 0) V2.dispatch({ type: "END_RUN" });
  }

  function fireEnemyShot(state, enemy, dx, dy, len) {
    const speed = enemy.projectileSpeed || (enemy.boss ? 285 : 245);
      state.projectiles.push(CombatPrimitives.projectile({
        hostile: true,
      x: enemy.x,
      y: enemy.y,
      vx: dx / len * speed,
      vy: dy / len * speed,
      // V3.0 raises only telegraphed projectile pressure. Basic contact chip
      // remains unchanged so early melee keeps a learnable survival window.
      damage: enemy.damage * (enemy.boss ? 0.76 : 0.68),
      radius: enemy.boss ? 7 : 5,
      life: enemy.boss ? 3.6 : 2.8,
      source: "enemy_" + (enemy.typeId || "shot"),
        color: enemy.accent || "#ff8aff",
        originX: enemy.x,
        originY: enemy.y
      }));
    state.stats.enemyShots = (state.stats.enemyShots || 0) + 1;
    addCircleEvent(state, enemy.x, enemy.y, enemy.r + 12, enemy.accent || "#ff8aff", 0.18, "mark");
  }

  function bossPatternSequence(enemy) {
    if (enemy.typeId === "director") return ["burst", "lane"];
    if (enemy.typeId === "delivery") return ["lane", "lane", "burst"];
    if (enemy.typeId === "client") return ["burst", "lane", "burst"];
    if (enemy.typeId === "ceo") return ["lane", "burst"];
    return ["lane", "burst"];
  }

  function bossPatternPhase(state) {
    const config = fixedTestConfig(state);
    const encounter = config && config.currentEncounter ? config.currentEncounter(state) : null;
    return encounter && encounter.phase || Math.max(1, Math.ceil((state.stage && state.stage.id || 1) / 3));
  }

  function recordBossPattern(state, enemy, kind, step) {
    if (!state.stats.bossPatterns) state.stats.bossPatterns = [];
    state.stats.bossPatterns.push({
      bossId: enemy.id,
      bossType: enemy.typeId,
      stageId: state.stage && state.stage.id,
      kind,
      step,
      time: state.totalTime
    });
    if (state.stats.bossPatterns.length > 80) state.stats.bossPatterns.shift();
  }

  function beginBossPattern(state, enemy) {
    const sequence = bossPatternSequence(enemy);
    const kind = sequence[(enemy.bossPatternIndex || 0) % sequence.length];
    const dx = state.player.x - enemy.x;
    const dy = state.player.y - enemy.y;
    const angle = Math.atan2(dy, dx);
    const warningTime = kind === "lane" ? 0.86 : 0.96;
    enemy.bossPatternKind = kind;
    enemy.bossPatternTimer = warningTime;
    enemy.bossPatternAngle = angle;
    enemy.bossPatternIndex = (enemy.bossPatternIndex || 0) + 1;
    recordBossPattern(state, enemy, kind, "warning");

    if (kind === "lane") {
      const distance = 1120;
      addBeamEvent(state, enemy.x, enemy.y,
        enemy.x + Math.cos(angle) * distance,
        enemy.y + Math.sin(angle) * distance,
        "#ff3f9f", 76, warningTime, "beam", false, "boss_test_lane_warning", { telegraph: true });
      addTextEvent(state, enemy.x, enemy.y - enemy.r - 20, "点名追责", "#ff8ac8", warningTime);
      return kind;
    }

    const safeHalfAngle = 0.42;
    const safeDistance = 510;
    addCircleEvent(state, enemy.x, enemy.y, 176, "#ffd36a", warningTime, "mark", false, "boss_test_burst_warning", { telegraph: true, safeAngle: angle });
    [-1, 1].forEach(function (side) {
      const edgeAngle = angle + side * safeHalfAngle;
      addBeamEvent(state, enemy.x, enemy.y,
        enemy.x + Math.cos(edgeAngle) * safeDistance,
        enemy.y + Math.sin(edgeAngle) * safeDistance,
        "#ffd36a", 5, warningTime, "grid", false, "boss_test_safe_gap", { telegraph: true, safeEdge: side });
    });
    addTextEvent(state, enemy.x, enemy.y - enemy.r - 20, "弹幕复核 · 缺口避让", "#ffe28a", warningTime);
    return kind;
  }

  function releaseBossPattern(state, enemy) {
    const kind = enemy.bossPatternKind;
    const angle = enemy.bossPatternAngle || 0;
    const phase = bossPatternPhase(state);
    const lowHealth = enemy.maxHp > 0 && enemy.hp / enemy.maxHp <= 0.5;
    const pressure = !!(state.demoV2 && state.demoV2.bossPressurePass);
    if (kind === "lane") {
      const speed = (390 + phase * 9) * (pressure ? 1.14 : 1);
      const damage = enemy.damage * (lowHealth ? 1.02 : 0.9);
      const px = -Math.sin(angle);
      const py = Math.cos(angle);
      const offsets = pressure ? [-54, -36, -18, 0, 18, 36, 54] : [-42, -21, 0, 21, 42];
      offsets.forEach(function (offset) {
        state.projectiles.push(CombatPrimitives.projectile({
          hostile: true,
          x: enemy.x + px * offset,
          y: enemy.y + py * offset,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          damage,
          radius: 9,
          life: 3.2,
          source: "boss_test_priority_lane",
          color: "#ff3f9f",
          originX: enemy.x,
          originY: enemy.y
        }));
      });
      addBeamEvent(state, enemy.x, enemy.y,
        enemy.x + Math.cos(angle) * 1120,
        enemy.y + Math.sin(angle) * 1120,
        "#fff2fb", 22, 0.22, "beam", false, "boss_test_lane_release", { damagingVolley: true });
    } else if (kind === "burst") {
      const count = 14 + phase * 2 + (lowHealth ? 2 : 0) + (pressure ? 4 : 0);
      const safeHalfAngle = 0.42;
      const speed = (205 + phase * 11) * (pressure ? 1.14 : 1);
      const damage = enemy.damage * (lowHealth ? 0.72 : 0.62);
      for (let i = 0; i < count; i++) {
        const shotAngle = Math.PI * 2 * i / count + enemy.phase * 0.25;
        const gapDelta = Math.atan2(Math.sin(shotAngle - angle), Math.cos(shotAngle - angle));
        if (Math.abs(gapDelta) < safeHalfAngle) continue;
        state.projectiles.push(CombatPrimitives.projectile({
          hostile: true,
          x: enemy.x + Math.cos(shotAngle) * (enemy.r + 8),
          y: enemy.y + Math.sin(shotAngle) * (enemy.r + 8),
          vx: Math.cos(shotAngle) * speed,
          vy: Math.sin(shotAngle) * speed,
          damage,
          radius: 7,
          life: 4.2,
          source: "boss_test_audit_burst",
          color: "#ffd36a",
          originX: enemy.x,
          originY: enemy.y
        }));
      }
      addCircleEvent(state, enemy.x, enemy.y, 188, "#ff5c57", 0.28, "blast", false, "boss_test_burst_release", { safeAngle: angle });
    }
    recordBossPattern(state, enemy, kind, "release");
    enemy.bossPatternKind = "";
    enemy.bossPatternTimer = 0;
    const cadence = pressure ? Math.max(1.72, 3.65 - phase * 0.27) : Math.max(2.55, 4.85 - phase * 0.34);
    enemy.bossPatternCooldown = cadence * (lowHealth ? 0.76 : 1) * (0.9 + Math.random() * 0.2);
  }

  function updateBossPatternIntent(state, enemy, dt) {
    if (!state.demoV2 || !state.demoV2.bossPatternPass || !enemy.boss) return false;
    if (enemy.bossPatternKind) {
      enemy.bossPatternTimer = Math.max(0, (enemy.bossPatternTimer || 0) - dt);
      if (enemy.bossPatternTimer <= 0) releaseBossPattern(state, enemy);
      return true;
    }
    enemy.bossPatternCooldown = Math.max(0, (enemy.bossPatternCooldown || 0) - dt);
    if (enemy.bossPatternCooldown <= 0 && enemy.chargeTime <= 0) {
      beginBossPattern(state, enemy);
      return true;
    }
    // The old V3.4 path returned true for the entire cooldown and therefore
    // silenced every ordinary Boss shot/charge between special patterns.
    return false;
  }

  function updateEnemyIntent(state, enemy, dt, dx, dy, len) {
    const pressure = !!(state.demoV2 && state.demoV2.bossPressurePass);
    const ranged = enemy.behavior === "shooter" || enemy.behavior === "boss_shooter" || enemy.behavior === "boss_shield" || enemy.behavior === "boss_final" || (pressure && enemy.behavior === "boss");
    if (ranged) {
      enemy.shootCooldown = Math.max(0, enemy.shootCooldown - dt);
      if (enemy.shootCooldown <= 0 && len < (enemy.boss ? 760 : 620)) {
        fireEnemyShot(state, enemy, dx, dy, len);
        enemy.shootCooldown = Math.max(pressure && enemy.boss ? 0.52 : 0.8, (enemy.shootEvery || 2.2) * (0.82 + Math.random() * 0.32));
      }
    }
    const charger = enemy.behavior === "charger" || enemy.behavior === "boss_charger" || enemy.behavior === "boss_final";
    if (charger && enemy.chargeTime <= 0) {
      enemy.chargeCooldown = Math.max(0, enemy.chargeCooldown - dt);
      if (enemy.chargeCooldown <= 0 && len < (enemy.boss ? 720 : 520)) {
        enemy.chargeTime = enemy.boss ? 0.62 : 0.48;
        enemy.chargeVx = dx / len;
        enemy.chargeVy = dy / len;
        enemy.chargeCooldown = Math.max(pressure && enemy.boss ? 0.88 : 1.25, (enemy.chargeEvery || 2.7) * (0.82 + Math.random() * 0.42));
        addTextEvent(state, enemy.x, enemy.y - enemy.r - 8, enemy.boss ? "冲刺评审" : "DDL", enemy.accent || "#ffd36a", 0.42);
      }
    }
  }

  function updateEnemies(state, dt) {
    const demoPhase = state.stage && state.stage.demoV2Phase;
    const fixedConfig = fixedTestConfig(state);
    const demoConfig = fixedConfig || (V2.demoV2 && (demoPhase === "phase-b" ? V2.demoV2.phaseB : demoPhase === "phase-a" ? V2.demoV2.phaseA : null));
    const markerEncounter = fixedConfig && demoConfig && demoConfig.currentEncounter ? demoConfig.currentEncounter(state) : null;
    const cap = markerEncounter ? markerEncounter.cap : demoConfig ? demoConfig.enemyCap : state.stage.id >= 4 ? 95 : 75;
    for (const enemy of state.enemies) {
      if (enemy.dead) continue;
      enemy.age = (enemy.age || 0) + dt;
      enemy.hitFlash = Math.max(0, (enemy.hitFlash || 0) - dt);
      if (enemy.p0Marked) {
        enemy.p0MarkTime = Math.max(0, (enemy.p0MarkTime || 0) - dt);
        if (enemy.p0MarkTime <= 0) {
          enemy.p0Marked = false;
          traceWeaponEvent(state, "state", { source: "marker_p0_expire", enemyId: enemy.id, vfxPhase: eventPhase("marker_p0_expire") });
        }
      }
      enemy.rooted = Math.max(0, (enemy.rooted || 0) - dt);
      if (enemy.correctionErrorStacks) {
        enemy.correctionErrorTime = Math.max(0, (enemy.correctionErrorTime || 0) - dt);
        if (enemy.correctionErrorTime <= 0) {
          enemy.correctionErrorStacks = 0;
          traceWeaponEvent(state, "state", { source: "correction_test_error_expire", enemyId: enemy.id, vfxPhase: eventPhase("correction_test_error_expire") });
        }
      }
      const dx = state.player.x - enemy.x;
      const dy = state.player.y - enemy.y;
      const len = Math.hypot(dx, dy) || 1;
      const bossPatternOwnsIntent = updateBossPatternIntent(state, enemy, dt);
      if (enemy.rooted <= 0 && !bossPatternOwnsIntent) updateEnemyIntent(state, enemy, dt, dx, dy, len);
      let mx = dx / len;
      let my = dy / len;
      let moveSpeed = enemy.speed;
      // Keep the Boss origin fixed while a V3.4 warning is visible so the
      // displayed corridor/gap and the eventual projectile origin agree.
      if (enemy.boss && enemy.bossPatternKind) moveSpeed = 0;
      if ((enemy.correctionErrorStacks || 0) >= 1) moveSpeed *= state.activeFormParams.correctionSlowMultiplier || 0.82;
      enemy.scissorsSlowTime = Math.max(0, (enemy.scissorsSlowTime || 0) - dt);
      if (enemy.scissorsSlowTime > 0) moveSpeed *= Math.max(0.2, 1 - (enemy.scissorsSlow || 0));
      enemy.scissorsCutSeamTime = Math.max(0, (enemy.scissorsCutSeamTime || 0) - dt);
      if (!enemy.bossPatternKind && enemy.chargeTime > 0) {
        enemy.chargeTime = Math.max(0, enemy.chargeTime - dt);
        mx = enemy.chargeVx || mx;
        my = enemy.chargeVy || my;
        moveSpeed = enemy.chargeSpeed || enemy.speed * 2.8;
      } else if (enemy.behavior === "zigzag") {
        const wobble = Math.sin(enemy.age * 4.2 + enemy.phase) * 0.58;
        const px = -dy / len;
        const py = dx / len;
        mx = dx / len * 0.86 + px * wobble;
        my = dy / len * 0.86 + py * wobble;
      } else if (enemy.behavior === "shooter" || enemy.behavior === "boss_shooter" || enemy.behavior === "boss_shield") {
        // A short-range build must be able to contest a ranged Boss. Bosses
        // hold a dangerous mid-range orbit instead of permanently kiting just
        // outside Thermos coverage; V3.5 moves that orbit slightly closer.
        const desired = enemy.boss ? (state.demoV2 && state.demoV2.bossPressurePass ? 185 : 205) : 250;
        const strafe = Math.sin(enemy.age * 2.2 + enemy.phase) * 0.5;
        const px = -dy / len;
        const py = dx / len;
        const distanceMove = len < desired ? -0.82 : len > desired + 110 ? 0.56 : 0.08;
        mx = dx / len * distanceMove + px * strafe;
        my = dy / len * distanceMove + py * strafe;
        moveSpeed *= enemy.boss ? 0.92 : 0.82;
      } else if (enemy.behavior === "tank" || enemy.behavior === "shield") {
        moveSpeed *= 0.86;
      }
      const mLen = Math.hypot(mx, my) || 1;
      if (enemy.rooted <= 0) {
        enemy.x = clamp(enemy.x + mx / mLen * moveSpeed * dt, -44, worldWidth(state) + 44);
        enemy.y = clamp(enemy.y + my / mLen * moveSpeed * dt, -44, worldHeight(state) + 44);
      }
      enemy.hitCooldown = Math.max(0, enemy.hitCooldown - dt);
      if (Math.hypot(state.player.x - enemy.x, state.player.y - enemy.y) < state.player.radius + enemy.r) {
        if (state.player.invuln <= 0) {
          damagePlayer(state, enemy.damage, enemy.accent || "#ff6b4a");
        } else {
          const scissors = scissorsFixedRuntime(state);
          if (scissors && scissors.dashWindow > 0 && !scissors.dashAvoidedIds[enemy.id]) {
            scissors.dashAvoidedIds[enemy.id] = true;
            scissors.totalDashDodges += 1;
          }
        }
      }
    }
    state.enemies = state.enemies.filter(function (enemy) { return !enemy.dead; }).slice(-cap);
  }

  function updateProjectiles(state, dt) {
    for (const p of state.projectiles) {
      if (p.hostile) {
        p.x += (p.vx || 0) * dt;
        p.y += (p.vy || 0) * dt;
        p.life -= dt;
        const config = fixedTestConfig(state);
        if (config && config.blocksHostileProjectile && config.blocksHostileProjectile(state, p)) {
          addCircleEvent(state, p.x, p.y, 18, "#9ff7ff", 0.22, "shield", false, "scissors_test_shelter_block");
          p.life = 0;
        } else if (Math.hypot(p.x - state.player.x, p.y - state.player.y) < p.radius + state.player.radius) {
          if (state.player.invuln <= 0) {
            damagePlayer(state, p.damage || 6, p.color || "#ff6b4a");
            p.life = 0;
          } else {
            const scissors = scissorsFixedRuntime(state);
            const dodgeKey = p.source + ":" + Math.round((p.originX || 0) * 10) + ":" + Math.round((p.originY || 0) * 10);
            if (scissors && scissors.dashWindow > 0 && !scissors.dashAvoidedIds[dodgeKey]) {
              scissors.dashAvoidedIds[dodgeKey] = true;
              scissors.totalDashDodges += 1;
              p.life = 0;
            }
          }
        }
        if (p.x < -80 || p.x > worldWidth(state) + 80 || p.y < -80 || p.y > worldHeight(state) + 80) p.life = 0;
        continue;
      }
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

  function spawnStickyArchiveEchoes(state, zone) {
    const p = state.activeFormParams || {};
    if (zone && p.demoV2StickyArchive > 0) {
      const echoCount = p.demoV2StickyArchive;
      for (let echoIndex = 0; echoIndex < echoCount; echoIndex++) {
        const angle = -Math.PI / 2 + echoIndex * Math.PI * 2 / echoCount;
        const distance = 34 + p.demoV2StickyArchive * 12;
        const x = clamp(zone.x + Math.cos(angle) * distance, 55, worldWidth(state) - 55);
        const y = clamp(zone.y + Math.sin(angle) * distance, 55, worldHeight(state) - 55);
        const life = 1.4 + p.demoV2StickyArchive * 0.65;
        const trapId = "sticky_archive_" + Date.now() + "_" + echoIndex + "_" + Math.random().toString(16).slice(2);
        addCircleEvent(state, x, y, Math.max(22, (p.trapRadius || 30) * 0.82), "#d7f8ff", 0.4, "trap", false, "sticky_module_archive", {
          trapId,
          echoIndex,
          level: p.demoV2StickyArchive
        });
        addDamageZone(state, {
          type: "circle", source: "sticky_module_archive", x, y,
          radius: Math.max(22, (p.trapRadius || 30) * 0.82), damage: 0,
          life, maxLife: life, tickEvery: 999,
          color: "#d7f8ff", slow: p.slow || 0.3, stickyTrap: true,
          trapId, armed: true, armDelay: 0, noticeNode: true, linked: false,
          archiveEcho: true, zoneDamage: p.zoneDamage || 0, visual: "notice_node"
        });
      }
    }
  }

  function spawnStickyExpiryBranches(state, zone) {
    const p = state.activeFormParams || {};
    if (!zone || zone.demoV2ExpiryHandled || zone.triggered || !zone.noticeNode) return;
    zone.demoV2ExpiryHandled = true;
    if (!zone.archiveEcho && !zone.archiveSaved) spawnStickyArchiveEchoes(state, zone);
    if (p.demoV2StickyOverdraft > 0 && !zone.archiveEcho) {
      const radius = 48 + p.demoV2StickyOverdraft * 20;
      addCircleEvent(state, zone.x, zone.y, radius, "#ffc48d", 0.38, "blast", false, "sticky_module_overdraft", {
        level: p.demoV2StickyOverdraft,
        trapId: zone.trapId
      });
      addDamageZone(state, {
        type: "circle", source: "sticky_module_overdraft", x: zone.x, y: zone.y,
        radius, damage: 8 + p.demoV2StickyOverdraft * 5,
        life: 0.16, maxLife: 0.16, hitOnce: true,
        color: "#ffc48d", slow: 0.22, root: 0.1, visual: "sticky_trigger_blast"
      });
    }
  }

  function updateZones(state, dt) {
    for (const z of state.damageZones) {
      z.life -= dt;
      z.age = (z.age || 0) + dt;
      if (z.life <= 0) spawnStickyExpiryBranches(state, z);
      if (z.stickyTrap && !z.armed && z.age >= (z.armDelay || 0)) {
        z.armed = true;
        traceWeaponEvent(state, "state", { source: "sticky_arm", trapId: z.trapId, mechanic: z.source, vfxPhase: eventPhase("sticky_arm") });
        addCircleEvent(state, z.x, z.y, Math.max(20, z.radius + 8), z.color, 0.2, "mark", false, "sticky_arm", { trapId: z.trapId });
      }
      if (z.groundSticky) {
        if (z.armed) {
          const stepped = nearestEnemyFromPoint(state, z, z.triggerRadius || z.radius + 22);
          if (stepped) triggerSingleStickyTrap(state, z, z.triggerSource || "sticky_base_trigger", z.triggerDamage || 10, z.triggerRadius || 52, z.slow || 0);
        }
        continue;
      }
      if (z.seekingSticky) {
        if (!z.armed) continue;
        const seekTarget = nearestEnemyFromPoint(state, z, 999);
        if (seekTarget) {
          const dx = seekTarget.x - z.x;
          const dy = seekTarget.y - z.y;
          const len = Math.hypot(dx, dy) || 1;
          z.x += dx / len * (z.seekSpeed || 120) * dt;
          z.y += dy / len * (z.seekSpeed || 120) * dt;
          if (Math.hypot(seekTarget.x - z.x, seekTarget.y - z.y) <= seekTarget.r + z.radius) {
            const impactX = z.x;
            const impactY = z.y;
            triggerSingleStickyTrap(state, z, "sticky_seeking_hit", z.triggerDamage || 10, z.triggerRadius || 48, z.slow || 0);
            if (z.bounceRemaining > 0) {
              const bouncedTarget = state.enemies.find(function (enemy) {
                return !enemy.dead && enemy !== seekTarget && Math.hypot(enemy.x - impactX, enemy.y - impactY) <= 220;
              });
              if (bouncedTarget) {
                addDamageZone(state, {
                  type: "circle",
                  source: "sticky_seeking_bounce",
                  x: impactX,
                  y: impactY,
                  radius: Math.max(18, z.radius * 0.86),
                  damage: 0,
                  triggerDamage: Math.max(3, (z.triggerDamage || 10) * 0.72),
                  triggerRadius: Math.max(38, (z.triggerRadius || 48) * 0.86),
                  life: 2.2,
                  maxLife: 2.2,
                  tickEvery: 999,
                  color: z.color,
                  slow: z.slow,
                  stickyTrap: true,
                  seekingSticky: true,
                  armed: true,
                  armDelay: 0,
                  trapId: z.trapId + "_bounce",
                  seekSpeed: z.seekSpeed,
                  bounceRemaining: z.bounceRemaining - 1,
                  visual: "seeking_note"
                });
              }
            }
          }
        }
        continue;
      }
      if (z.manualSticky) continue;
      if (z.noticeNode) {
        if (z.armed && !z.linked) tryBuildNoticeZone(state, state.activeFormParams || {});
        continue;
      }
      if (z.routeSticky) {
        if (!z.armed) continue;
        if (!z.routeClaimed && Math.hypot(state.player.x - z.x, state.player.y - z.y) <= z.radius + state.player.radius) {
          z.routeClaimed = true;
          const params = state.activeFormParams || {};
          params.shield = Math.min(70, (params.shield || 0) + (z.shieldGain || 3));
          if (z.routeHeal) state.hp = Math.min(state.maxHp, state.hp + z.routeHeal);
          addCircleEvent(state, state.player.x, state.player.y, 54, "#8fffe7", 0.25, "shield", false, "sticky_route_claim", { trapId: z.trapId, shieldGain: z.shieldGain || 3 });
        }
      }
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
      if (z.droneModule) {
        z.droneTimer = Math.max(0, (z.droneTimer || 0) - dt);
        if (z.droneTimer <= 0) {
          const droneTarget = nearestEnemyFromPoint(state, z, z.steamRange || 230);
          if (droneTarget) {
            const endpoint = lineEndpointThroughTarget(z, droneTarget, Math.min(z.steamRange || 230, Math.hypot(droneTarget.x - z.x, droneTarget.y - z.y) + 26));
            const steamWidth = Math.max(8, (z.steamRadius || 42) * 0.24);
            const droneHits = lineHitEnemies(state, z.x, z.y, endpoint.x, endpoint.y, steamWidth, z.droneDamage || 10, z.dronePierce || 2, "thermos_drone_steam");
            addBeamEvent(state, z.x, z.y, endpoint.x, endpoint.y, "#9ff8ff", steamWidth - 1, 0.18, "steam", false, "thermos_drone_steam", {
              moduleId: z.moduleId,
              targetEnemyId: droneTarget.id,
              hitEnemyIds: droneHits.map(function (hit) { return hit.enemy.id; })
            });
          }
          z.droneTimer = z.droneShootEvery || 0.72;
        }
        continue;
      }
      if (z.heal && Math.hypot(state.player.x - z.x, state.player.y - z.y) <= z.radius) {
        state.hp = Math.min(state.maxHp, state.hp + z.heal * dt);
        if (z.playerShield) {
          state.activeFormParams.shield = Math.min(60, (state.activeFormParams.shield || 0) + z.playerShield * dt);
        }
      }
      if (z.delay && z.age < z.delay) continue;
      if (z.type === "ring") {
        const currentRadius = ringCurrentRadius(z);
        const halfThickness = Math.max(6, (z.thickness || 24) / 2);
        for (const enemy of state.enemies) {
          if (enemy.dead || z.hits[enemy.id]) continue;
          const distance = Math.hypot(enemy.x - z.x, enemy.y - z.y);
          if (Math.abs(distance - currentRadius) > halfThickness + enemy.r) continue;
          z.hits[enemy.id] = true;
          if (z.debuff === "tea") {
            enemy.teaScent = { radius: z.teaRadius || 96, damage: z.teaDamage || 6 };
          }
          damageEnemy(state, enemy, z.damage, z.source || "ring_zone", z.noKnockback ? null : { x: z.x, y: z.y, power: z.knockback == null ? 12 : z.knockback });
          if (z.slow) enemy.speed *= 1 - z.slow * 0.08;
        }
        continue;
      }
      z.tick -= dt;
      if (z.tick > 0) continue;
      z.tick = z.tickEvery;
      if (z.type === "circle") {
        for (const enemy of state.enemies) {
          if (!enemy.dead && Math.hypot(enemy.x - z.x, enemy.y - z.y) <= z.radius + enemy.r) {
            if (z.hitOnce && z.hits[enemy.id]) continue;
            if (z.correctionArea) {
              const mayRepeatError = (state.activeFormParams.correctionSpreadLevel || 0) >= 3;
              if (mayRepeatError || !z.errorApplied[enemy.id]) {
                applyCorrectionError(state, enemy, 1, z.source || "correction_test_error_area");
                z.errorApplied[enemy.id] = true;
              }
              correctionDamageEnemy(state, enemy, z.damage, z.source || "correction_test_error_area");
              continue;
            }
            if (z.debuff === "tea") {
              enemy.teaScent = { radius: z.teaRadius || 96, damage: z.teaDamage || 6 };
            }
            damageEnemy(state, enemy, z.damage, z.source || "zone", z.noKnockback ? null : { x: z.x, y: z.y, power: z.knockback == null ? 12 : z.knockback });
            if (z.hitOnce) z.hits[enemy.id] = true;
            if (z.slow) enemy.speed *= 1 - z.slow * 0.08;
            if (z.root) enemy.rooted = Math.max(enemy.rooted || 0, z.root);
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
        const lineZoneHits = lineHitEnemies(state, z.x1, z.y1, z.x2, z.y2, z.width || 8, z.damage, 99, z.source || "line_zone", { noKnockback: !!z.noKnockback });
        if (z.slow || z.root) {
          lineZoneHits.forEach(function (hit) {
            if (z.slow) hit.enemy.speed *= 1 - z.slow * 0.08;
            if (z.root) hit.enemy.rooted = Math.max(hit.enemy.rooted || 0, z.root);
          });
        }
      }
      if (z.type === "polygon" && z.points && z.points.length >= 3) {
        for (const enemy of state.enemies) {
          if (enemy.dead || !pointInPolygon(enemy.x, enemy.y, z.points)) continue;
          if (z.thermosFixedSharedHits) {
            const lastHitAt = z.thermosFixedSharedHits[enemy.id];
            if (lastHitAt != null && state.totalTime - lastHitAt < (z.tickEvery || 0.28) * 0.6) continue;
            z.thermosFixedSharedHits[enemy.id] = state.totalTime;
          }
          damageEnemy(state, enemy, z.damage, z.source || "polygon_zone", z.noKnockback ? null : { x: z.x, y: z.y });
          if (z.slow) enemy.speed *= 1 - z.slow * 0.08;
          if (z.root) enemy.rooted = Math.max(enemy.rooted || 0, z.root);
        }
      }
    }
    state.damageZones = state.damageZones.filter(function (z) { return z.life > 0; });
    const correction = correctionFluidRuntime(state);
    if (correction) {
      const areas = state.damageZones.filter(function (zone) { return zone.correctionArea && zone.life > 0; });
      correction.activeErrorAreas = areas.length;
      correction.largestErrorArea = areas.reduce(function (max, zone) { return Math.max(max, zone.radius || 0); }, 0);
    }
  }

  function updatePickups(state, dt) {
    pickupMagnetTimer += dt;
    const markerTest = fixedTestRuntime(state);
    const magnetRadius = markerTest && markerTest.collecting ? 520 : 150;
    const magnetSpeed = markerTest && markerTest.collecting ? 8.5 : 5;
    for (const p of state.pickups) {
      const d = Math.hypot(state.player.x - p.x, state.player.y - p.y);
      if (d < magnetRadius) {
        p.x += (state.player.x - p.x) * dt * magnetSpeed;
        p.y += (state.player.y - p.y) * dt * magnetSpeed;
      }
      if (d < state.player.radius + p.radius + 6) {
        p.dead = true;
        if (p.type === "xp") V2.dispatch({ type: "GAIN_XP", amount: p.amount });
        if (p.type === "material") {
          state.materials += p.amount;
          state.stats.materialsCollected += p.amount;
          const fixedRuntime = fixedTestRuntime(state);
          if (p.markerFixedDrop && fixedRuntime) {
            fixedRuntime.dropMaterialsEarned += p.amount;
            fixedRuntime.materialsSinceLastShop += p.amount;
          }
        }
        if (p.type === "heal") {
          const before = state.hp;
          state.hp = Math.min(state.maxHp, state.hp + (p.amount || 0));
          if (state.hp > before) addTextEvent(state, state.player.x, state.player.y - 30, "+" + Math.round(state.hp - before), "#8fffb2", 0.46);
        }
      }
    }
    state.pickups = state.pickups.filter(function (p) { return !p.dead; });
  }

  function updateEffects(state, dt) {
    const marker = markerFixedRuntime(state);
    if (marker) marker.weaponVisualTime = Math.max(0, (marker.weaponVisualTime || 0) - dt);
    const thermos = fixedTestRuntime(state);
    if (thermos && fixedTestConfig(state) && fixedTestConfig(state).weaponId === "thermos") {
      thermos.condensationRecoil = Math.max(0, (thermos.condensationRecoil || 0) - dt);
      thermos.heatwaveRecoil = Math.max(0, (thermos.heatwaveRecoil || 0) - dt);
    }
    const correction = correctionFluidRuntime(state);
    if (correction) correction.weaponVisualTime = Math.max(0, (correction.weaponVisualTime || 0) - dt);
    if (state.demoV2 && state.demoV2.growthFeedback && state.warmupTime <= 0) {
      state.demoV2.growthFeedback.time = Math.max(0, (state.demoV2.growthFeedback.time || 0) - dt);
      if (state.demoV2.growthFeedback.time <= 0) state.demoV2.growthFeedback = null;
    }
    state.particles.forEach(function (p) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.life -= dt;
    });
    state.particles = state.particles.filter(function (p) { return p.life > 0; });
    state.formEvents.forEach(function (e) {
      e.life -= dt;
      e.age = (e.age || 0) + dt;
    });
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
      const markerTest = fixedTestRuntime(state);
      if (markerTest && markerTest.collecting) {
        updatePickups(state, dt);
        updateEffects(state, dt);
        const config = fixedTestConfig(state);
        if (config) config.tick(state, dt);
        if (state.warmupTime <= 0 && config) config.finishCollection(state);
      }
      return;
    }
    state.stageTime = Math.max(0, state.stageTime - dt);
    updateInput(state, dt);
    if (state.activeFormParams) {
      state.activeFormParams.releaseLockout = Math.max(0, (state.activeFormParams.releaseLockout || 0) - dt);
    }
    if (state.stage && (state.stage.demoV2Phase === "phase-a" || state.stage.demoV2Phase === "phase-b" || fixedTestConfig(state))) {
      updateDemoV2Director(state, dt);
      if (state.stage.demoV2Phase === "phase-b" && V2.demoV2 && V2.demoV2.phaseB) V2.demoV2.phaseB.tick(state);
      if (fixedTestConfig(state)) fixedTestConfig(state).tick(state, dt);
    } else {
      spawnTimer -= dt;
      if (spawnTimer <= 0 && state.enemies.length < (state.stage.boss ? 5 : 80)) {
        spawnEnemy(state);
        spawnTimer = state.stage.boss && state.stageBossSpawned ? (state.stage.bossAddEvery || 4.2) : state.stage.spawnEvery;
        if (state.stage.id >= 3 && !state.stage.boss && Math.random() < 0.25) spawnEnemy(state);
      }
    }
    attackTimer -= dt;
    if (state.stage && state.stage.demoV2Phase === "marker-fixed") updateMarkerFixedPendingRounds(state);
    if (state.stage && state.stage.demoV2Phase === "thermos-fixed") updateThermosFixedPendingFocus(state);
    if (state.stage && state.stage.demoV2Phase === "scissors-fixed") updateScissorsFixedActions(state, dt);
    if (attackTimer <= 0) {
      fireWeapon(state);
      let nextAttackDelay = state.activeFormParams.cooldown || 1.4;
      if (state.activeForm && state.activeForm.mechanicType === "deployable_safe_station" && state.activeFormParams.risk) {
        const insideStation = state.damageZones.some(function (zone) {
          return zone.source === "thermos_station" && zone.life > 0 && Math.hypot(state.player.x - zone.x, state.player.y - zone.y) <= zone.radius;
        });
        if (!insideStation) nextAttackDelay *= 1.25;
      }
      attackTimer = Math.max(state.demoV2 && state.demoV2.combatTrianglePass ? 0.12 : state.demoV2 && state.demoV2.combatDensityPass ? 0.16 : 0.25, nextAttackDelay, state.activeFormParams.releaseLockout || 0);
      if (state.activeFormParams.demoV2OverdraftEvery > 0 && state.stats.shots > 0 && state.stats.shots % state.activeFormParams.demoV2OverdraftEvery === 0) {
        attackTimer += state.activeFormParams.demoV2OverdraftPause || 0;
      }
    }
    updateSupportSkill(state, dt);
    updateProjectiles(state, dt);
    updateZones(state, dt);
    updateEnemies(state, dt);
    updatePickups(state, dt);
    updateEffects(state, dt);
    const markerFixed = !!fixedTestConfig(state);
    const markerTest = markerFixed ? fixedTestRuntime(state) : null;
    const fixedConfig = fixedTestConfig(state);
    const markerEncounter = markerFixed && fixedConfig && fixedConfig.currentEncounter
      ? fixedConfig.currentEncounter(state) : null;
    const markerAddsAlive = markerFixed ? state.enemies.filter(function (enemy) { return !enemy.dead && !enemy.boss; }).length : 0;
    const markerQuotaCleared = markerEncounter && markerTest && markerTest.encounterSpawned >= markerEncounter.spawnTotal && markerAddsAlive <= 0;
    const markerCleared = markerFixed && markerEncounter
      ? (markerEncounter.boss ? state.stageBossDefeated && (state.stageTime <= 0 || markerQuotaCleared) : (state.stageTime <= 0 || markerQuotaCleared))
      : false;
    const targetCleared = state.stage.boss ? state.stageBossDefeated : state.stageKills >= state.stage.targetKills;
    const timerCleared = state.stageTime <= 0 && !state.stage.boss;
    if (state.mode === "combat" && (markerFixed ? markerCleared : (timerCleared || targetCleared))) {
      V2.dispatch({ type: "COMPLETE_STAGE" });
    }
  }

  function drawBackground(ctx, state) {
    const camera = state.camera || { x: 0, y: 0 };
    ctx.clearRect(0, 0, W, H);
    if (!isSpriteReady("office_arena_night")) return;
    const img = runtimeImages.office_arena_night;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, -camera.x, -camera.y, worldWidth(state), worldHeight(state));
    ctx.restore();
  }

  function drawPlayer(ctx, state) {
    const p = state.player;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.globalAlpha = p.invuln > 0 && Math.floor(p.invuln * 18) % 2 ? 0.54 : 1;
    const markerEmbodied = drawMarkerEmbodiedPlayer(ctx, state);
    const thermosEmbodied = markerEmbodied ? false : drawThermosEmbodiedPlayer(ctx, state);
    const scissorsEmbodied = markerEmbodied || thermosEmbodied ? false : drawScissorsEmbodiedPlayer(ctx, state);
    const correctionEmbodied = markerEmbodied || thermosEmbodied || scissorsEmbodied ? false : drawCorrectionEmbodiedPlayer(ctx, state);
    if (!markerEmbodied && !thermosEmbodied && !scissorsEmbodied && !correctionEmbodied) {
      drawAtlasCell(ctx, "office_atlas", 0, 0, 0, -5, 70, 70, 1, 0);
    }
    const thermos = state.demoV2 && state.demoV2.phase === "thermos-fixed" ? fixedTestRuntime(state) : null;
    if (thermos && !thermosEmbodied) {
      drawSprite(ctx, "thermos_body_v24", 28, -3, 50, 50, 0.96, 0);
    }
    const scissors = scissorsFixedRuntime(state);
    if (scissors) {
      const angle = scissors.weaponVisualTime > 0 ? scissors.weaponVisualAngle : scissors.facingAngle || 0;
      const orbit = 31;
      const pulse = scissors.weaponVisualTime > 0 ? 1.12 : 1;
      const openLevel = scissors.modules && (scissors.modules.archive || 0);
      const openStrikeActive = openLevel > 0 && scissors.weaponVisualTime > 0
        && (scissors.weaponVisualKind === "open" || scissors.weaponVisualKind === "finale");
      const closedStrikeActive = scissors.weaponVisualTime > 0
        && (scissors.weaponVisualKind === "thrust" || scissors.weaponVisualKind === "sever");
      if (!scissorsEmbodied) {
        if (openLevel > 0) {
          if (!openStrikeActive && !closedStrikeActive) {
            const openOrbit = 38;
            drawSpriteFrame(ctx, "scissors_strike_v27", 0,
              Math.cos(angle) * openOrbit, Math.sin(angle) * openOrbit,
              92 * pulse, 92 * pulse, 0.98, angle + Math.PI * 0.25);
          }
        } else {
          if (!closedStrikeActive) drawSprite(ctx, "scissors_v23", Math.cos(angle) * orbit, Math.sin(angle) * orbit, 64 * pulse, 64 * pulse, 0.98, angle + Math.PI * 0.25);
        }
      }
      const charge = clamp(scissors.dashReady ? 1 : scissors.dashCharge || 0, 0, 1);
      drawCombatProgress(ctx, 0, 39, 82, 11, charge);
      const moving = state.input.left || state.input.right || state.input.up || state.input.down;
      const directionFrame = clamp(Math.floor(charge * 4), 0, 3);
      // Project the dash intent onto the floor ahead of the held weapon. The
      // shorter glyph starts beyond the weapon orbit, avoiding the old visual
      // overlap while preserving a readable movement direction.
      const directionDistance = 94 + charge * 18;
      drawSpriteFrame(ctx, "scissors_dash_direction_v27", directionFrame,
        Math.cos(scissors.facingAngle || 0) * directionDistance,
        Math.sin(scissors.facingAngle || 0) * directionDistance,
        62 + charge * 24, 36 + charge * 8,
        moving ? 0.72 + charge * 0.26 : 0.42 + charge * 0.2,
        scissors.facingAngle || 0);
      if (scissors.shelterActive) {
        const radius = state.activeFormParams.scissorsShelterRadius || 108;
        const duration = state.activeFormParams.scissorsShelterDuration || 3.2;
        const remaining = Math.max(0, scissors.shelterTime || 0);
        const elapsed = duration - remaining;
        const shelterFrame = elapsed < 0.24 ? 0 : remaining < 0.42 ? 3 : Math.floor(elapsed * 7) % 2 ? 1 : 2;
        drawSpriteFrame(ctx, "scissors_shelter_v27", shelterFrame, 0, 0, radius * 2.18, radius * 2.18, 0.76, elapsed * 0.08);
      }
    }
    const shield = state.activeFormParams && state.activeFormParams.shield || 0;
    if (shield > 0) {
      const shieldMax = state.activeFormParams.markerShieldMax || state.activeFormParams.thermosShieldMax || state.activeFormParams.releaseShieldMax || state.activeFormParams.secondaryWarmShieldMax || Math.max(18, shield);
      const ratio = clamp(shield / shieldMax, 0, 1);
      drawSprite(ctx, "status_shield_art", 0, -2, 84 + ratio * 12, 84 + ratio * 12, 0.72 + ratio * 0.22, 0);
    }
    ctx.restore();
  }

  function drawEnemies(ctx, state) {
    for (const e of state.enemies) {
      ctx.save();
      ctx.translate(e.x, e.y);
      const cell = ENEMY_ATLAS_CELLS[e.typeId] || ENEMY_ATLAS_CELLS.todo;
      const bodySize = e.boss ? 96 : Math.max(48, e.r * 3.6);
      const hitRatio = clamp((e.hitFlash || 0) / (e.boss ? 0.16 : 0.12), 0, 1);
      const hitColor = e.hitFamily === "thermos" ? "#ffb45e"
        : e.hitFamily === "scissors" ? "#ff5f72"
          : e.hitFamily === "correction_fluid" ? "#ff3fbd" : "#67f7ff";
      ctx.save();
      if (hitRatio > 0) {
        ctx.shadowColor = hitColor;
        ctx.shadowBlur = 10 + hitRatio * 18;
      }
      drawAtlasCell(ctx, "office_atlas", cell[0], cell[1], 0, 0,
        bodySize * (1 + hitRatio * 0.08), bodySize * (1 - hitRatio * 0.06),
        e.fragment ? 0.86 : 1, hitRatio * 0.035);
      ctx.restore();
      const ranged = e.behavior === "shooter" || e.behavior === "boss_shooter" || e.behavior === "boss_shield" || e.behavior === "boss_final";
      if (ranged && e.shootCooldown > 0 && e.shootCooldown < 0.42) {
        const warning = 1 - clamp(e.shootCooldown / 0.42, 0, 1);
        drawSpriteFrame(ctx, "correction_fluid_glitch_v25", Math.min(3, Math.floor(warning * 4)),
          0, 0, bodySize + 22 + warning * 18, bodySize + 22 + warning * 18,
          0.26 + warning * 0.52, e.age * 0.35);
        drawSprite(ctx, "enemy_projectile_art", 0, -bodySize * 0.62,
          36 + warning * 18, 13 + warning * 6, 0.48 + warning * 0.48, -Math.PI / 2);
      }
      if (e.chargeTime > 0) {
        drawSprite(ctx, "thermos_charge_art", 0, 0, bodySize + 26, bodySize + 26, 0.72, e.age * 0.9);
      }
      if (e.armor) {
        drawSprite(ctx, "status_shield_art", 0, 0, bodySize + 24, bodySize + 24, 0.68, 0);
      }
      if (e.markerFixedElite) {
        drawSprite(ctx, "status_mark_art", 0, -4, bodySize + 28, bodySize + 28, 0.82, 0);
      }
      if (e.p0Marked) {
        const markRatio = clamp((e.p0MarkTime || 0) / Math.max(0.01, e.p0MarkMax || 1), 0, 1);
        drawSprite(ctx, "status_mark_art", 0, -2, bodySize + 18, bodySize + 18, 0.55 + markRatio * 0.4, 0);
      }
      if (e.correctionErrorStacks) {
        const errorFrame = clamp((e.correctionErrorStacks || 1) - 1, 0, 3);
        const stackPulse = e.correctionErrorStacks >= 3 ? 1 + Math.sin((e.age || 0) * 9) * 0.06 : 1;
        if (state.demoV2 && state.demoV2.correctionEmbodimentPass) {
          const v39Frame = 4 + Math.min(3, errorFrame + (e.correctionErrorStacks >= 3 ? 1 : 0));
          const size = (bodySize + 26 + e.correctionErrorStacks * 7) * stackPulse;
          drawGridSpriteFrame(ctx, "correction_spray_error_v39", 4, 2, v39Frame, 0, -2,
            size * 1.08, size, 0.88 + e.correctionErrorStacks * 0.035, 0,
            "brightness(1.1) saturate(1.12) drop-shadow(0 0 " + (5 + e.correctionErrorStacks * 2) + "px rgba(104,246,255,.88))",
            "source-over");
        } else {
          drawSpriteFrame(ctx, "correction_fluid_error_v25", errorFrame, 0, -2,
            (bodySize + 24 + e.correctionErrorStacks * 5) * stackPulse,
            (bodySize + 24 + e.correctionErrorStacks * 5) * stackPulse,
            0.82 + e.correctionErrorStacks * 0.055, 0);
          if (e.correctionErrorStacks === 2) {
            drawSpriteFrame(ctx, "correction_fluid_glitch_v25", 1, 0, -2, bodySize + 31, bodySize + 31, 0.4, 0);
          }
          if (e.correctionErrorStacks >= 3) {
            drawSpriteFrame(ctx, "correction_fluid_glitch_v25", 3, 0, -2, bodySize + 38, bodySize + 38, 0.76 + Math.sin((e.age || 0) * 9) * 0.08, 0);
          }
        }
      }
      if (e.rooted > 0) {
        const rootWidth = bodySize + 18;
        drawSprite(ctx, "status_root_art", 0, bodySize * 0.34, rootWidth, rootWidth * 0.441, 0.86, 0);
      }
      drawCombatProgress(ctx, 0, -bodySize / 2 - 12, e.boss ? 104 : 70, e.boss ? 17 : 12, e.hp / e.maxHp);
      ctx.restore();
    }
  }

  function pointInPolygon(x, y, points) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const xi = points[i].x;
      const yi = points[i].y;
      const xj = points[j].x;
      const yj = points[j].y;
      const intersects = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / ((yj - yi) || 0.0001) + xi);
      if (intersects) inside = !inside;
    }
    return inside;
  }

  function triggerSingleStickyTrap(state, trap, source, damage, radius, slow) {
    if (!trap || trap.triggered || trap.life <= 0) return false;
    trap.triggered = true;
    trap.life = 0;
    addCircleEvent(state, trap.x, trap.y, radius, "#86f7ff", 0.3, "blast", false, source, { trapId: trap.trapId });
    addDamageZone(state, {
      type: "circle",
      source,
      x: trap.x,
      y: trap.y,
      radius,
      damage,
      life: 0.16,
      maxLife: 0.16,
      hitOnce: true,
      color: "#86f7ff",
      slow: slow || 0,
      visual: "sticky_trigger_blast"
    });
    return true;
  }

  function detonateManualStickyTraps(state) {
    const p = state.activeFormParams || {};
    const traps = state.damageZones.filter(function (zone) {
      return zone.manualSticky && zone.armed && !zone.triggered && zone.life > 0;
    });
    if (!traps.length) return 0;
    const center = traps.reduce(function (sum, trap) {
      sum.x += trap.x;
      sum.y += trap.y;
      return sum;
    }, { x: 0, y: 0 });
    center.x /= traps.length;
    center.y /= traps.length;
    addCircleEvent(state, center.x, center.y, Math.min(72, 42 + traps.length * 8), "#e8db92", 0.24, "switch_pulse", false, "sticky_manual_trigger", {
      trapCount: traps.length,
      chained: !!p.chainDetonate
    });
    traps.forEach(function (trap, index) {
      const delay = p.chainDetonate ? index * 0.14 : 0;
      const radius = p.explosionRadius || 70;
      trap.triggered = true;
      trap.life = 0;
      addCircleEvent(state, trap.x, trap.y, radius, "#a9f1ff", 0.34, "blast", false, "sticky_sync_blast", {
        trapId: trap.trapId,
        delay,
        chainIndex: index
      });
      addDamageZone(state, {
        type: "circle",
        source: "sticky_sync_blast",
        x: trap.x,
        y: trap.y,
        radius,
        damage: (p.damage || 12) * 1.45,
        delay,
        life: 0.16 + delay,
        maxLife: 0.16 + delay,
        hitOnce: true,
        color: index % 2 ? "#d6fbff" : "#a9f1ff",
        knockback: p.blastKnockback ? 38 : 12,
        visual: "sticky_sync_blast"
      });
    });
    traceWeaponEvent(state, "state", { source: "sticky_manual_trigger", trapCount: traps.length, chained: !!p.chainDetonate, vfxPhase: eventPhase("sticky_manual_trigger") });
    return traps.length;
  }

  function tryBuildNoticeZone(state, p) {
    const nodes = state.damageZones.filter(function (zone) {
      return zone.noticeNode && zone.armed && !zone.linked && zone.life > 0;
    }).slice(-3);
    if (nodes.length < 3) return false;
    const linkRadius = p.linkRadius || 170;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) > linkRadius) return false;
      }
    }
    const points = nodes.map(function (node) { return { x: node.x, y: node.y }; });
    const twiceArea = Math.abs(
      points[0].x * (points[1].y - points[2].y) +
      points[1].x * (points[2].y - points[0].y) +
      points[2].x * (points[0].y - points[1].y)
    );
    if (twiceArea < 1200) return false;
    nodes.forEach(function (node) { node.linked = true; });
    const duration = Math.max(1.8, Math.min.apply(null, nodes.map(function (node) { return node.life; })));
    for (let index = 0; index < points.length; index++) {
      const a = points[index];
      const b = points[(index + 1) % points.length];
      addBeamEvent(state, a.x, a.y, b.x, b.y, "#e8db92", 3, Math.min(0.6, duration), "grid", false, "sticky_link_line", { polygonEdge: index });
      addDamageZone(state, { type: "line", source: "sticky_link_line", x1: a.x, y1: a.y, x2: b.x, y2: b.y, width: 7, damage: Math.max(3, (p.zoneDamage || 9) * 0.45), life: duration, maxLife: duration, tickEvery: 0.42, color: "#e8db92", slow: p.slow || 0.25, visual: "sticky_link_line" });
    }
    const cx = points.reduce(function (sum, point) { return sum + point.x; }, 0) / points.length;
    const cy = points.reduce(function (sum, point) { return sum + point.y; }, 0) / points.length;
    if (p.demoV2StickyArchive > 0 && nodes.every(function (node) { return !node.archiveEcho; })) {
      nodes.forEach(function (node) { node.archiveSaved = true; });
      spawnStickyArchiveEchoes(state, { x: cx, y: cy, trapId: "sticky_board_archive" });
    }
    addCircleEvent(state, cx, cy, 42, "#e8db92", 0.42, "trap", false, "sticky_notice_zone", { polygonArea: twiceArea / 2 });
    addDamageZone(state, {
      type: "polygon",
      source: "sticky_notice_zone",
      points,
      x: cx,
      y: cy,
      radius: Math.max.apply(null, points.map(function (point) { return Math.hypot(point.x - cx, point.y - cy); })),
      damage: p.zoneDamage || 9,
      life: duration,
      maxLife: duration,
      tickEvery: 0.32,
      color: "#e8db92",
      slow: p.slow || 0.3,
      root: p.noticeRoot || 0.75,
      visual: "notice_polygon"
    });
    if (p.demoV2StickyMerge > 0) {
      for (let pulseIndex = 0; pulseIndex < p.demoV2StickyMerge; pulseIndex++) {
        const pulseRadius = 44 + p.demoV2StickyMerge * 10 + pulseIndex * 22;
        const delay = pulseIndex * 0.13;
        addCircleEvent(state, cx, cy, pulseRadius, "#fff7c4", 0.36 + delay, "blast", false, "sticky_module_merge", {
          pulseIndex,
          level: p.demoV2StickyMerge,
          delay
        });
        addDamageZone(state, {
          type: "circle", source: "sticky_module_merge", x: cx, y: cy,
          radius: pulseRadius, damage: 6 + p.demoV2StickyMerge * 3,
          delay, life: 0.16 + delay, maxLife: 0.16 + delay, hitOnce: true,
          color: "#fff7c4", slow: 0.2, root: 0.12, visual: "sticky_trigger_blast"
        });
      }
    }
    if (p.demoV2StickyForward > 0) {
      const relayAngle = Math.atan2(cy - state.player.y, cx - state.player.x);
      const relayCount = p.demoV2StickyForward;
      for (let relayIndex = 0; relayIndex < relayCount; relayIndex++) {
        const relayOffset = relayCount === 1 ? 0 : (relayIndex / (relayCount - 1) - 0.5) * 0.72;
        const angle = relayAngle + relayOffset;
        const relayDistance = Math.min(142, 84 + relayIndex * 22);
        const relayX = clamp(cx + Math.cos(angle) * relayDistance, 55, worldWidth(state) - 55);
        const relayY = clamp(cy + Math.sin(angle) * relayDistance, 55, worldHeight(state) - 55);
        const relayId = "sticky_relay_" + Date.now() + "_" + relayIndex + "_" + Math.random().toString(16).slice(2);
        addCircleEvent(state, relayX, relayY, p.trapRadius || 30, "#fff0a8", 0.45, "trap", false, "sticky_notice_relay", { trapId: relayId, relayIndex });
        addDamageZone(state, {
          type: "circle", source: "sticky_notice_relay", x: relayX, y: relayY,
          radius: p.trapRadius || 30, damage: 0, life: Math.max(2.4, duration * 0.75), maxLife: Math.max(2.4, duration * 0.75),
          tickEvery: 999, color: "#fff0a8", slow: p.slow || 0.3, stickyTrap: true,
          trapId: relayId, armed: true, armDelay: 0, noticeNode: true, linked: false,
          zoneDamage: p.zoneDamage || 0, visual: "notice_node"
        });
      }
    }
    return true;
  }

  function drawGeneratedEffects(ctx, state) {
    for (const z of state.damageZones) {
      if (z.delay && (z.age || 0) < z.delay) continue;
      if (z.source === "thermos_test_kill_heatwave") continue;
      const alpha = clamp(z.life / Math.max(0.01, z.maxLife || z.life || 1), 0, 1);
      const progress = eventProgress(z);
      const profile = z.visualProfile || eventVisual(z.source || z.visual || z.type);
      const sprite = generatedEffectSprite(profile, z.source, z.type, z.visual);
      if (z.visual === "notice_node") {
        drawSprite(ctx, "sticky_note_v2", z.x, z.y, 32, 32, Math.min(0.96, alpha + 0.12), 0);
        continue;
      }
      if (z.type === "line") {
        if (z.inkTrail) {
          const dx = z.x2 - z.x1;
          const dy = z.y2 - z.y1;
          const length = Math.hypot(dx, dy) || 1;
          const width = z.width || 24;
          // Archive owns a soft, low-frequency cyan band on the world layer.
          // Do not run it through the high-intensity laser bloom grammar.
          drawSprite(ctx, "marker_ink_art",
            z.x1 + dx / 2, z.y1 + dy / 2,
            Math.max(96, length + 44), Math.max(48, width * 1.65),
            Math.min(0.56, alpha * 0.48 + 0.08), Math.atan2(dy, dx));
          continue;
        }
        drawSuiteNeonLine(ctx, state, z, alpha, progress);
        drawGeneratedLine(ctx, generatedLineSprite(profile, sprite), z.x1, z.y1, z.x2, z.y2, z.width || 8, Math.min(0.94, alpha + 0.12));
        continue;
      }
      // Sticky control polygons are already represented by their real node-to-node
      // string segments. A second filled polygon sprite would obscure occupants and
      // visually disagree with irregular node placement.
      if (z.type === "polygon" && profile.family === "sticky_note") continue;
      const radius = Math.max(24, z.radius || 44);
      const mechanicRadius = z.type === "ring" ? Math.max(8, ringCurrentRadius(z)) : radius;
      drawSuiteNeonArea(ctx, state, z, alpha, progress, mechanicRadius);
      if (drawV24AreaEvent(ctx, z, Math.min(0.9, alpha + 0.1), progress, mechanicRadius, state)) continue;
      if (drawGeneratedStatusSprite(ctx, sprite, z.x, z.y, radius, Math.min(0.9, alpha + 0.1))) continue;
      if (drawGeneratedMechanicSprite(ctx, sprite, z.source, z.type, z.visual, z.x, z.y, mechanicRadius, Math.min(0.9, alpha + 0.1), progress)) continue;
      const size = Math.min(520, radius * (z.type === "polygon" ? 2.2 : 1.55 + progress * 0.8));
      drawSprite(ctx, sprite, z.x, z.y, size, size, Math.min(0.9, alpha + 0.1), (z.reverse ? -1 : 1) * progress * 0.12);
      const bodySprite = zoneSpriteFor(z.visual || "");
      if (bodySprite) {
        const bodySize = /station/.test(z.visual || "") ? 68 : /drone/.test(z.visual || "") ? 52 : 46;
        drawSprite(ctx, bodySprite, z.x, z.y, bodySize, bodySize, Math.min(0.98, alpha + 0.2), 0);
      }
    }

    for (const event of state.formEvents) {
      if (!event.debugHold && event.delay && (event.age || 0) < event.delay) continue;
      const duration = event.duration || event.maxLife || 0.3;
      const activeLife = Math.min(duration, event.life == null ? duration : event.life);
      const alpha = event.debugHold ? 1 : clamp(activeLife / duration, 0, 1);
      const progress = event.debugHold ? (event.debugProgress == null ? 0.7 : event.debugProgress) : 1 - alpha;
      const profile = event.visualProfile || eventVisual(event.source || event.kind);
      const sprite = generatedEffectSprite(profile, event.source, event.kind, event.visual);
      if (event.kind === "text") {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = event.color || "#ffffff";
        if (state.demoV2 && state.demoV2.neonBloomPass) {
          ctx.shadowColor = event.color || "#ffffff";
          ctx.shadowBlur = 10;
        }
        ctx.fillText(event.text, event.x, event.y - progress * 18);
        ctx.restore();
        continue;
      }
      if (event.kind === "thermos_backpressure") {
        continue;
      }
      if (event.primitive === "beam" || event.kind === "beam" || event.kind === "counter" || event.kind === "steam" || event.kind === "grid") {
        drawSuiteNeonLine(ctx, state, event, alpha, progress);
        if (drawV24LinearEvent(ctx, event, alpha, progress, state)) continue;
        drawGeneratedLine(ctx, generatedLineSprite(profile, sprite), event.x1, event.y1, event.x2, event.y2, event.width || 6, Math.min(0.98, alpha + 0.08));
        const impactSize = profile.family === "thermos"
          ? Math.min(92, Math.max(48, (event.width || 6) * 4.5))
          : profile.family === "marker"
            ? clamp((event.width || 6) * 9, 58, 76)
            : Math.min(96, Math.max(44, (event.width || 6) * 6));
        drawSprite(ctx, profile.family === "thermos" ? "thermos_release_art" : profile.family === "sticky_note" ? "sticky_burst_art" : "marker_impact_art", event.x2, event.y2, impactSize, impactSize, alpha, progress * 0.14);
        continue;
      }
      const radius = Math.max(26, event.radius || 44);
      drawSuiteNeonArea(ctx, state, event, alpha, progress, radius);
      if (drawV24AreaEvent(ctx, event, Math.min(0.94, alpha + 0.1), progress, radius, state)) continue;
      if (drawGeneratedStatusSprite(ctx, sprite, event.x, event.y, radius, Math.min(0.94, alpha + 0.1))) continue;
      if (drawGeneratedMechanicSprite(ctx, sprite, event.source, event.kind, event.visual, event.x, event.y, radius, Math.min(0.94, alpha + 0.1), progress)) continue;
      const size = Math.min(440, radius * (1.25 + progress * 1.2));
      drawSprite(ctx, sprite, event.x, event.y, size, size, Math.min(0.94, alpha + 0.1), progress * 0.16);
      if (event.sprite) {
        const bodySize = event.kind === "station" ? 68 : event.kind === "trap" || event.kind === "sticky_attach" ? 46 : Math.max(44, radius * 0.9);
        drawSprite(ctx, event.sprite, event.x, event.y, bodySize, bodySize, Math.min(0.98, alpha + 0.16), 0);
      }
    }

    // A death heatwave is the reward for a successful focus kill. Keep the
    // single real ring event above the originating steam fan so the conversion
    // stays legible; condensation and other persistent fields remain below it.
    for (const z of state.damageZones) {
      if (z.source !== "thermos_test_kill_heatwave" || (z.delay && (z.age || 0) < z.delay)) continue;
      const alpha = clamp(z.life / Math.max(0.01, z.maxLife || z.life || 1), 0, 1);
      const progress = eventProgress(z);
      const radius = Math.max(8, ringCurrentRadius(z));
      drawV24AreaEvent(ctx, z, Math.min(0.94, alpha + 0.1), progress, radius, state);
    }

    for (const projectile of state.projectiles) {
      const angle = Math.atan2(projectile.vy || 0, projectile.vx || 1);
      const sprite = projectile.hostile
        ? "enemy_projectile_art"
        : /thermos|steam|tea/.test(projectile.source || "") ? "thermos_steam_art"
          : /sticky|note/.test(projectile.source || "") ? "sticky_seek_art" : "marker_impact_art";
      const width = projectile.hostile ? clamp(projectile.radius * 7, 42, 50) : Math.max(28, projectile.radius * 5);
      const height = projectile.hostile ? width * 0.35 : sprite === "sticky_seek_art" ? width * 0.487 : width * 0.72;
      drawSprite(ctx, sprite, projectile.x, projectile.y, width, height, 0.96, angle);
    }

    for (const pickup of state.pickups) {
      if (pickup.type === "material") drawAtlasCell(ctx, "office_atlas", 1, 1, pickup.x, pickup.y, 28, 28, 1, 0);
      else if (pickup.type === "heal") drawAtlasCell(ctx, "office_atlas", 3, 1, pickup.x, pickup.y, 32, 32, 1, 0);
      else drawAtlasCell(ctx, "office_atlas", 2, 1, pickup.x, pickup.y, 26, 26, 1, 0);
    }

    for (const particle of state.particles) {
      const alpha = clamp(particle.life / particle.maxLife, 0, 1);
      const size = Math.max(10, particle.size * 4);
      drawSprite(ctx, "marker_impact_art", particle.x, particle.y, size, size, alpha * 0.72, particle.life * 0.8);
    }
  }

  function normalizeCanvasContext(targetCtx) {
    // A failed sprite/VFX draw can exit after an inner save(), leaving a
    // translated or filtered context on the stack. Pop generously: restore()
    // is a no-op once the stack is empty.
    for (let index = 0; index < 24; index++) targetCtx.restore();
    targetCtx.setTransform(1, 0, 0, 1, 0, 0);
    targetCtx.globalAlpha = 1;
    targetCtx.globalCompositeOperation = "source-over";
    targetCtx.filter = "none";
    targetCtx.shadowBlur = 0;
    targetCtx.shadowColor = "transparent";
    targetCtx.imageSmoothingEnabled = false;
  }

  function reportDrawLayerError(state, layerName, err) {
    const message = err && err.message ? err.message : String(err);
    state.loop.drawLayerErrors = state.loop.drawLayerErrors || {};
    const key = layerName + ":" + message;
    if (state.loop.drawLayerErrors[key]) return;
    state.loop.drawLayerErrors[key] = true;
    V2.reportError(new Error("Combat render layer " + layerName + " failed: " + message));
  }

  function drawFallbackPlayer(targetCtx, state) {
    drawAtlasCell(
      targetCtx,
      "office_atlas",
      0,
      0,
      state.player.x,
      state.player.y - 5,
      70,
      70,
      1,
      0
    );
    drawCombatProgress(
      targetCtx,
      state.player.x,
      state.player.y + 36,
      82,
      11,
      state.hp / Math.max(1, state.maxHp)
    );
  }

  function drawIsolatedLayers(targetCtx, state, layers, onError) {
    const errors = [];
    layers.forEach(function (layer) {
      normalizeCanvasContext(targetCtx);
      if (layer.world) targetCtx.translate(-state.camera.x, -state.camera.y);
      try {
        layer.draw();
      } catch (err) {
        errors.push({ layer: layer.name, error: err });
        (onError || reportDrawLayerError)(state, layer.name, err);
        if (layer.fallback) {
          normalizeCanvasContext(targetCtx);
          if (layer.world) targetCtx.translate(-state.camera.x, -state.camera.y);
          try {
            layer.fallback();
          } catch (fallbackErr) {
            errors.push({ layer: layer.name + "_fallback", error: fallbackErr });
            (onError || reportDrawLayerError)(state, layer.name + "_fallback", fallbackErr);
          }
        }
      }
    });
    normalizeCanvasContext(targetCtx);
    return errors;
  }

  function draw() {
    if (!ctx) return;
    const state = V2.getState();
    updateCamera(state);
    drawIsolatedLayers(ctx, state, [
      { name: "background", world: false, draw: function () { drawBackground(ctx, state); } },
      { name: "effects", world: true, draw: function () { drawGeneratedEffects(ctx, state); } },
      { name: "enemies", world: true, draw: function () { drawEnemies(ctx, state); } },
      {
        name: "player",
        world: true,
        draw: function () { drawPlayer(ctx, state); },
        fallback: function () { drawFallbackPlayer(ctx, state); }
      }
    ]);
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
    try {
      draw();
      if (V2.ui && state.loop.frameCount % 6 === 0) V2.ui.render();
    } catch (err) {
      V2.reportError(err);
    } finally {
      if (state.loop.running) state.loop.raf = window.requestAnimationFrame(frame);
    }
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
    try {
      draw();
      if (V2.ui) V2.ui.render();
    } catch (err) {
      V2.reportError(err);
    }
  }

  function bindInput() {
    window.addEventListener("keydown", function (event) {
      const state = V2.getState();
      if (event.key === "w" || event.key === "W" || event.key === "ArrowUp") state.input.up = true;
      if (event.key === "s" || event.key === "S" || event.key === "ArrowDown") state.input.down = true;
      if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") state.input.left = true;
      if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") state.input.right = true;
      if (event.code === "Space" && !event.repeat) {
        state.input.trigger = true;
        event.preventDefault();
      }
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

  function startLoop(options) {
    const state = V2.getState();
    if (options && options.force) {
      if (state.loop.raf) window.cancelAnimationFrame(state.loop.raf);
      if (state.loop.interval) window.clearInterval(state.loop.interval);
      state.loop.running = false;
      state.loop.raf = 0;
      state.loop.interval = 0;
      attackTimer = 0;
      spawnTimer = 0;
      pickupMagnetTimer = 0;
    }
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
    state.loop.raf = 0;
    state.loop.interval = 0;
  }

  function runMechanicLab(kind) {
    const state = V2.getState();
    stopLoop();
    state.mode = "combat";
    state.warmupTime = 0;
    state.stageTime = 999;
    state.stage.targetKills = 999;
    state.stage.spawnEvery = 999;
    state.stageKills = 0;
    state.player.x = 400;
    state.player.y = 360;
    state.enemies = [];
    state.projectiles = [];
    state.damageZones = [];
    state.formEvents = [];
    state.particles = [];
    state.pickups = [];
    state.stats.weaponEvents = [];
    state.stats.audioEvents = [];
    state.stats.damageDone = {};
    attackTimer = 999;
    spawnTimer = 999;

    function addLabEnemy(id, x, y) {
      const enemy = makeEnemy(state, "todo", x, y, {});
      Object.assign(enemy, {
        id,
        name: "机制靶",
        hp: 260,
        maxHp: 260,
        speed: 0,
        damage: 0,
        xp: 0,
        shootEvery: 0,
        chargeEvery: 0,
        splitType: ""
      });
      state.enemies.push(enemy);
      return enemy;
    }

    const labMechanics = {
      split: "line_split",
      p0: "mark_detonate",
      counter: "shield_counter_line",
      wave: "line_to_wave",
      grid: "line_grid_field",
      thermos_drone: "patrol_summon_steam",
      thermos_release: "charge_release_beam",
      thermos_shield: "shield_break_pulse",
      thermos_tea: "periodic_wave_spread",
      thermos_station: "deployable_safe_station",
      sticky_seek: "seeking_trap_summon",
      sticky_manual: "manual_trap_detonate",
      sticky_route: "route_buff_trap",
      sticky_spread: "sticky_debuff_spread",
      sticky_notice: "trap_link_control_zone"
    };
    if (labMechanics[kind]) state.activeForm.mechanicType = labMechanics[kind];

    if (kind === "split") {
      addLabEnemy("main-a", 620, 360);
      addLabEnemy("main-b", 820, 360);
      addLabEnemy("branch-up-a", 700, 300);
      addLabEnemy("branch-up-b", 780, 240);
      addLabEnemy("branch-down-a", 700, 420);
      addLabEnemy("branch-down-b", 780, 480);
      if (state.activeFormParams.promotionFullscreenEvery) {
        state.stats.shots = state.activeFormParams.promotionFullscreenEvery - 1;
      }
    } else if (kind === "wave") {
      addLabEnemy("wave-origin", 620, 360);
      addLabEnemy("wave-front-up", 620, 440);
      addLabEnemy("wave-front-down", 620, 280);
      addLabEnemy("wave-front-forward", 700, 360);
    } else if (kind === "p0") {
      addLabEnemy("p0-primary", 610, 360).maxHp = 520;
      state.enemies[0].hp = 520;
      addLabEnemy("p0-chain", 660, 405).maxHp = 360;
      state.enemies[1].hp = 360;
    } else if (kind === "counter") {
      addLabEnemy("counter-a", 560, 330);
      addLabEnemy("counter-b", 610, 390);
      addLabEnemy("counter-c", 500, 450);
      addLabEnemy("counter-d", 470, 285);
      addLabEnemy("counter-e", 665, 300);
      addLabEnemy("counter-f", 675, 440);
      addLabEnemy("counter-g", 535, 500);
    } else if (kind === "grid") {
      addLabEnemy("grid-horizontal", 680, 360);
    } else if (kind === "thermos_drone") {
      // Keep at least one target inside the tech form's 220px acquisition
      // range; heat and module deployment still obey the real targeting rule.
      addLabEnemy("drone-target-a", 570, 330);
      addLabEnemy("drone-target-b", 590, 410);
      state.activeFormParams.heat = 90;
      state.activeFormParams.heatRate = 20;
      state.activeFormParams.summonCount = state.activeFormParams.summonCount || 1;
    } else if (kind === "thermos_release") {
      addLabEnemy("release-a", 590, 340);
      addLabEnemy("release-b", 690, 330);
      addLabEnemy("release-c", 780, 320);
      state.activeFormParams.heat = Math.max(0, (state.activeFormParams.heatMax || 100) - (state.activeFormParams.heatRate || 24));
      state.activeFormParams.releaseWidth = Math.max(22, state.activeFormParams.releaseWidth || 0);
    } else if (kind === "thermos_shield") {
      addLabEnemy("shield-a", 560, 350);
      addLabEnemy("shield-b", 640, 345);
    } else if (kind === "thermos_tea") {
      addLabEnemy("tea-near", 475, 360);
      addLabEnemy("tea-mid", 520, 405);
      addLabEnemy("tea-edge", 545, 315);
    } else if (kind === "thermos_station") {
      addLabEnemy("station-a", 520, 360);
      addLabEnemy("station-b", 500, 420);
      state.activeFormParams.heat = 90;
    } else if (kind === "thermos_backpressure") {
      // Isolated attachment-scale review: the real fixed-test runtime and
      // module levels drive the two half-rings, but no forward attack obscures
      // their relationship to the worn pressure packs.
    } else if (kind === "thermos_fixed" || kind === "thermos_fixed_heatwave") {
      const focus = addLabEnemy("thermos-fixed-focus", 525, 360);
      if (kind === "thermos_fixed_heatwave") {
        // Keep the visual lab deterministic as the base-hit budget changes:
        // one real focused hit must still earn one real death heatwave.
        focus.hp = Math.max(1, (state.activeFormParams.damage || 20) * 1.25);
        focus.maxHp = focus.hp;
      }
      addLabEnemy("thermos-fixed-upper", 560, 315);
      addLabEnemy("thermos-fixed-lower", 585, 405);
      addLabEnemy("thermos-fixed-edge", 620, 350);
    } else if (kind === "sticky_seek") {
      addLabEnemy("seek-a", 570, 350);
      addLabEnemy("seek-b", 650, 420);
    } else if (kind === "sticky_manual") {
      addLabEnemy("manual-a", 600, 330);
      addLabEnemy("manual-b", 620, 420);
    } else if (kind === "sticky_route") {
      addLabEnemy("route-a", 520, 320);
      addLabEnemy("route-b", 560, 420);
      state.input.right = true;
    } else if (kind === "sticky_spread") {
      addLabEnemy("spread-origin", 560, 360).hp = 7;
      addLabEnemy("spread-a", 615, 330);
      addLabEnemy("spread-b", 625, 390);
      addLabEnemy("spread-c", 690, 360);
      state.activeFormParams.spreadDepth = 2;
    } else if (kind === "sticky_notice") {
      addLabEnemy("notice-center", 600, 360).hp = 600;
      state.enemies[0].maxHp = 600;
      addLabEnemy("notice-inside", 600, 380);
    } else if (kind === "scissors_fixed" || kind === "scissors_fixed_dash") {
      addLabEnemy("scissors-fixed-center", 510, 360);
      addLabEnemy("scissors-fixed-upper", 535, 320);
      addLabEnemy("scissors-fixed-lower", 540, 405);
      const scissorsTest = scissorsFixedRuntime(state);
      if (kind === "scissors_fixed_dash" && scissorsTest) scissorsTest.dashReady = true;
    } else if (kind === "scissors_fixed_shelter") {
      const scissorsTest = scissorsFixedRuntime(state);
      if (scissorsTest) {
        scissorsTest.shelterActive = true;
        scissorsTest.shelterTime = Math.max(0.4, (state.activeFormParams.scissorsShelterDuration || 3.2) - 0.5);
      }
      addCircleEvent(state, state.player.x + (state.activeFormParams.scissorsShelterRadius || 108), state.player.y, 18, "#9ff7ff", 0.22, "shield", false, "scissors_test_shelter_block");
    } else if (kind === "correction_fixed_boss") {
      const boss = makeEnemy(state, "lead", 560, 360, { boss: true });
      Object.assign(boss, { id: "correction-fixed-boss", name: "错误审查 Boss", speed: 0, damage: 0, correctionErrorStacks: 2, correctionErrorTime: 5 });
      state.enemies.push(boss);
      addLabEnemy("correction-fixed-add-a", 610, 310);
      addLabEnemy("correction-fixed-add-b", 625, 410);
    } else if (kind === "scale") {
      addLabEnemy("scale-normal-a", 560, 330);
      addLabEnemy("scale-normal-b", 630, 405);
      const boss = makeEnemy(state, "lead", 760, 350, { boss: true });
      Object.assign(boss, { id: "scale-boss", name: "比例靶 Boss", speed: 0, damage: 0 });
      state.enemies.push(boss);
      state.pickups.push({ type: "xp", x: 540, y: 430, amount: 4, radius: 7 });
      state.pickups.push({ type: "material", x: 580, y: 448, amount: 1, radius: 6 });
    } else if (kind === "status_scale") {
      const marked = addLabEnemy("status-marked", 570, 330);
      Object.assign(marked, { p0Marked: true, p0MarkTime: 3, p0MarkMax: 3 });
      const rooted = addLabEnemy("status-rooted", 665, 405);
      rooted.rooted = 1;
      const armoredBoss = makeEnemy(state, "lead", 770, 350, { boss: true });
      Object.assign(armoredBoss, { id: "status-armored-boss", name: "Status Boss", speed: 0, damage: 0, armor: 1 });
      state.enemies.push(armoredBoss);
      state.activeFormParams.shield = Math.max(18, state.activeFormParams.shield || 0);
      state.activeFormParams.markerShieldMax = Math.max(18, state.activeFormParams.markerShieldMax || 0);
    } else if (kind === "enemy_projectile") {
      // Static threat calibration: exact runtime projectile dimensions and
      // rotations, without combat effects hiding the hostile silhouette.
      state.player.x = 420;
      state.player.y = 360;
      state.projectiles = [
        { x: 690, y: 300, vx: -250, vy: 0, radius: 6, life: 4, maxLife: 4, hostile: true, source: "qa_enemy_mail" },
        { x: 760, y: 370, vx: -220, vy: -140, radius: 7, life: 4, maxLife: 4, hostile: true, source: "qa_enemy_mail" },
        { x: 680, y: 445, vx: -210, vy: 150, radius: 6, life: 4, maxLife: 4, hostile: true, source: "qa_enemy_mail" }
      ];
    }

    // Lab scripts call real weapon/damage/update functions, but arrange the
    // inputs so each contract freezes at its most legible state.
    if (kind === "scale" || kind === "status_scale" || kind === "enemy_projectile") {
      // Static visual calibration scene: no weapon effect obscures silhouettes.
    } else if (kind === "p0") {
      fireMarker(state);
      fireMarker(state);
    } else if (kind === "counter") {
      fireMarker(state);
      damagePlayer(state, (state.activeFormParams.shield || 0) + 1, "#ff8a7a");
    } else if (kind === "grid") {
      fireMarker(state);
      state.enemies[0].dead = true;
      state.player.x = 560;
      state.player.y = 210;
      addLabEnemy("grid-vertical", 560, 550);
      fireMarker(state);
    } else if (kind === "thermos_drone") {
      fireThermos(state);
      // Advance the real zone updater far enough to separate the orbiting
      // modules and let each module acquire/fire at a target before freezing.
      for (let i = 0; i < 3; i++) updateZones(state, 0.18);
    } else if (kind === "thermos_release") {
      fireThermos(state);
    } else if (kind === "thermos_shield") {
      fireThermos(state);
      damagePlayer(state, (state.activeFormParams.shield || 0) + 1, "#ff8a7a");
      updateZones(state, 0.24);
    } else if (kind === "thermos_tea") {
      fireThermos(state);
      updateZones(state, 0.28);
    } else if (kind === "thermos_station") {
      fireThermos(state);
      updateZones(state, 0.18);
      if ((state.activeFormParams.stationLimit || 1) > 1) {
        state.player.x += 210;
        state.activeFormParams.heat = 90;
        fireThermos(state);
        updateZones(state, 0.18);
      }
    } else if (kind === "thermos_backpressure") {
      triggerThermosBackPressure(state, fixedTestRuntime(state));
    } else if (kind === "thermos_fixed" || kind === "thermos_fixed_heatwave") {
      if (kind === "thermos_fixed_heatwave") state.activeFormParams.thermosFixedFullscreenChance = 0;
      fireThermos(state);
      if (kind === "thermos_fixed_heatwave" && (state.activeFormParams.thermosFixedFocusHits || 0) > 0) {
        performThermosFixedFocus(state, { angle: 0, focusIndex: 0 });
      }
    } else if (kind === "sticky_seek") {
      fireSticky(state);
      updateZones(state, 0.2);
      updateZones(state, 0.46);
    } else if (kind === "sticky_manual") {
      [330, 400, 470].forEach(function (x) {
        state.player.x = x;
        fireSticky(state);
      });
      updateZones(state, 0.34);
      state.input.trigger = true;
      fireSticky(state);
      state.player.x = 400;
    } else if (kind === "sticky_route") {
      [470, 540, 610].forEach(function (x) {
        state.player.x = x;
        fireSticky(state);
      });
      updateZones(state, 0.34);
      const route = state.damageZones.find(function (zone) { return zone.routeSticky; });
      if (route) {
        state.player.x = route.x;
        state.player.y = route.y;
        updateZones(state, 0.08);
      }
      state.input.right = false;
    } else if (kind === "sticky_spread") {
      fireSticky(state);
    } else if (kind === "sticky_notice") {
      fireSticky(state);
      fireSticky(state);
      fireSticky(state);
      updateZones(state, 0.34);
    } else if (kind === "scissors_fixed" || kind === "scissors_fixed_dash") {
      fireScissorsFixedTest(state);
      for (let actionStep = 0; actionStep < 12; actionStep++) updateScissorsFixedActions(state, 0.18);
    } else if (kind === "scissors_fixed_shelter") {
      // The persistent field is read from the same fixed-test runtime state;
      // the boundary impact above uses the real shelter-block event source.
    } else if (kind === "correction_fixed_boss") {
      fireCorrectionFluidFixedTest(state);
      updateZones(state, 0.02);
    } else if (kind && kind.indexOf("thermos_") === 0) {
      fireThermos(state);
    } else if (kind && kind.indexOf("sticky_") === 0) {
      fireSticky(state);
    } else {
      fireMarker(state);
    }
    if (state.supportSkill && state.supportSkill.type) {
      fireSupportSkill(state);
      if (state.supportSkill.type === "support_thermos_pulse") updateZones(state, 0.28);
      if (state.supportSkill.type === "support_sticky_trap") {
        updateZones(state, 0.34);
        updateZones(state, 0.02);
      }
    }
    if (V2.audio && V2.audio.syncMusic) V2.audio.syncMusic(state);
    if (document.body) {
      document.body.dataset.mechanicLabKind = kind || "";
      document.body.dataset.mechanicLabWeapon = state.selectedWeaponId || "";
      document.body.dataset.mechanicLabType = state.activeForm && state.activeForm.mechanicType || "";
      document.body.dataset.mechanicLabShots = String(state.stats.shots || 0);
      document.body.dataset.mechanicLabZones = String(state.damageZones.length);
      document.body.dataset.mechanicLabEvents = String(state.formEvents.length);
      document.body.dataset.mechanicLabSources = Array.from(new Set(state.stats.weaponEvents.map(function (event) { return event.source; }))).sort().join(",");
      document.body.dataset.mechanicLabVisuals = Array.from(new Set(state.stats.weaponEvents.map(function (event) {
        return [event.source, event.visualFamily, event.visualTopology, event.visualRole, event.visualCue].join(":");
      }))).sort().join(",");
      document.body.dataset.mechanicLabAudio = Array.from(new Set((state.stats.audioEvents || []).map(function (event) {
        return [event.source, event.voice, event.role, event.stage].join(":");
      }))).sort().join(",");
      document.body.dataset.mechanicLabAudioStatus = JSON.stringify(V2.audio && V2.audio.getStatus ? V2.audio.getStatus() : null);
      document.body.dataset.mechanicLabParams = JSON.stringify({
        splitCount: state.activeFormParams.splitCount,
        secondarySplit: !!state.activeFormParams.secondarySplit,
        fullscreenEvery: state.activeFormParams.promotionFullscreenEvery || 0,
        explosionRadius: state.activeFormParams.explosionRadius,
        counterLines: state.activeFormParams.counterLines,
        waveCount: state.activeFormParams.waveCount,
        waveReturn: !!state.activeFormParams.waveReturn,
        gridEcho: !!state.activeFormParams.gridEcho,
        gridDamage: state.activeFormParams.gridDamage,
        trailDuration: state.activeFormParams.trailDuration,
        summonCount: state.activeFormParams.summonCount,
        summonDuration: state.activeFormParams.summonDuration,
        orbitSpeed: state.activeFormParams.orbitSpeed,
        releaseWidth: state.activeFormParams.releaseWidth,
        releaseDamage: state.activeFormParams.releaseDamage,
        heatMax: state.activeFormParams.heatMax,
        pulseCount: state.activeFormParams.pulseCount,
        pulseDamage: state.activeFormParams.pulseDamage,
        shieldThreshold: state.activeFormParams.shieldThreshold,
        teaRadius: state.activeFormParams.teaRadius,
        teaDamage: state.activeFormParams.teaDamage,
        stationLimit: state.activeFormParams.stationLimit,
        stationDuration: state.activeFormParams.stationDuration,
        seekBounce: !!state.activeFormParams.seekBounce,
        seekSpeed: state.activeFormParams.seekSpeed,
        chainDetonate: !!state.activeFormParams.chainDetonate,
        trapDuration: state.activeFormParams.trapDuration,
        shieldGain: state.activeFormParams.shieldGain,
        spreadLimit: state.activeFormParams.spreadLimit,
        spreadRadius: state.activeFormParams.spreadRadius,
        linkRadius: state.activeFormParams.linkRadius,
        zoneDamage: state.activeFormParams.zoneDamage
      });
    }
    if (kind === "sticky_notice") {
      // The lab freezes time. Remove expired placement flashes so the settled
      // three-node topology is judged without transient rings stacking forever.
      // Keep secondary and support events so visual hierarchy can still be audited.
      state.formEvents = state.formEvents.filter(function (event) {
        return event.source && (event.source.indexOf("secondary_") === 0 || event.source.indexOf("support_") === 0);
      });
    }
    state.formEvents.forEach(function (event) {
      event.life = Math.max(event.life, 3.5);
      event.maxLife = event.life;
      if (kind === "sticky_manual" && event.source === "sticky_sync_blast") {
        const chainIndex = event.meta && event.meta.chainIndex || 0;
        event.debugProgress = Math.max(0.22, 0.9 - chainIndex * 0.28);
      }
      event.debugHold = true;
    });
    if (kind === "thermos_fixed" || kind === "thermos_fixed_heatwave") {
      state.damageZones.forEach(function (zone) {
        zone.age = Math.max(zone.age || 0, (zone.duration || zone.maxLife || 0.5) * 0.55);
        zone.life = Math.max(0.08, (zone.maxLife || zone.duration || 0.5) * 0.45);
      });
    }
    if (kind === "wave") {
      state.damageZones.filter(function (zone) { return zone.type === "ring"; }).forEach(function (zone, index) {
        zone.duration = 3.2;
        zone.delay = index * 0.28;
        zone.age = 1.55;
        zone.life = 2.2 + zone.delay;
        zone.maxLife = 3.2 + zone.delay;
      });
    }
    updateCamera(state);
    draw();
    return state.stats.weaponEvents;
  }

  V2.combat = {
    mount,
    startLoop,
    stopLoop,
    update,
    draw,
    fireWeapon,
    damagePlayer,
    spawnEnemy,
    updateCamera,
    runMechanicLab,
    primitives: CombatPrimitives,
    qa: {
      resourceSources: FORM_RESOURCE_SOURCES,
      resourceSourceMatches: formResourceSourceMatches,
      damageEnemy,
      updateZones,
      updateThermosFixedPendingFocus,
      updateScissorsFixedActions,
      updateInput,
      updateEnemies,
      drawIsolatedLayers,
      beginBossPattern,
      releaseBossPattern,
      updateBossPatternIntent,
      updateEnemyIntent,
      demoV2ReleasedQuota,
      updateDemoV2Director,
      demoV2PerimeterPoint,
      spawnDemoV2Wave,
      markerEmbodimentVisualState,
      thermosEmbodimentVisualState,
      scissorsEmbodimentVisualState,
      correctionEmbodimentVisualState,
      triggerThermosBackPressure,
      triggerThermosFixedThermalExchange,
      triggerCorrectionCascadingRollback,
      scissorsLine,
      fireMarkerFixedTest,
      fireScissorsFixedTest,
      fireSupportSkill
    }
  };
})();
