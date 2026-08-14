(function () {
  "use strict";
  // Retired placeholder reference: marker-printer-rig-v1.svg. The runtime uses the generated V5 worn rig.

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const FIELD = { left: 18, right: W - 18, top: 88, bottom: H - 88 };
  const query = new URLSearchParams(location.search);
  const variant = ["A", "B", "C"].includes((query.get("variant") || "C").toUpperCase())
    ? (query.get("variant") || "C").toUpperCase()
    : "C";
  const timeScale = Math.max(1, Math.min(12, Number(query.get("timeScale") || 1)));
  const debugStage = String(query.get("debugStage") || "");
  const debugFacing = query.has("facing") ? Number(query.get("facing")) : null;
  const freezeFrame = query.get("freeze") === "1";
  const layoutDebug = query.get("layout") === "1";
  const autoQueue = String(query.get("auto") || "").split(",").filter(Boolean);

  const BUILD_LAYOUT = {
    bodySafetyRadius: 48,
    baseOrbit: 64,
    copyOrbit: [0, 68, 74, 80, 86],
    archiveOrbit: [0, 70, 76, 82, 88],
    weaponSize: 54,
    muzzleOffset: 25,
    dockBackDistance: 10,
    rigDistance: 15,
    rigSpread: 23,
    pureRigLateral: 21,
    dockPureWidth: 56,
    dockHybridWidth: 80,
    dockHeight: 48,
    cartridgePureWidth: 44,
    cartridgeHybridWidth: 40,
    cartridgeHeight: 58
  };

  const PHYSICAL_MOUNTS = {
    firingPen: { owner: "weapon", socket: "orbit", follows: "attack-aim" },
    printerDock: { owner: "player", socket: "back-printer-dock", follows: "player-facing" },
    archiveReservoir: { owner: "player", socket: "printer-dock-left", follows: "player-facing" },
    copyController: { owner: "player", socket: "printer-dock-right", follows: "player-facing" },
    tipComponent: { owner: "weapon", socket: "nib", follows: "weapon" },
    bodyComponent: { owner: "weapon", socket: "barrel", follows: "weapon" },
    amountComponent: { owner: "system", socket: "duplicate-emitter", follows: "weapon" },
    rangeTailComponent: { owner: "weapon", socket: "tail", follows: "weapon" },
    durationTailComponent: { owner: "player", socket: "reservoir", follows: "player-facing" }
  };

  const featureFlags = {
    embodiedGrowthPass: variant !== "A",
    workflowFusionPass: variant === "C"
  };

  const refs = {
    intro: document.getElementById("introPanel"),
    start: document.getElementById("startButton"),
    hud: document.getElementById("hud"),
    rail: document.getElementById("buildRail"),
    phase: document.getElementById("phaseLabel"),
    timer: document.getElementById("timerLabel"),
    kills: document.getElementById("killLabel"),
    healthFill: document.getElementById("healthFill"),
    health: document.getElementById("healthLabel"),
    copyLevel: document.getElementById("copyLevel"),
    archiveLevel: document.getElementById("archiveLevel"),
    copyPips: document.getElementById("copyPips"),
    archivePips: document.getElementById("archivePips"),
    body: document.getElementById("bodyReadout"),
    component: document.getElementById("componentReadout"),
    fusion: document.getElementById("fusionReadout"),
    decision: document.getElementById("decisionPanel"),
    decisionEyebrow: document.getElementById("decisionEyebrow"),
    decisionTitle: document.getElementById("decisionTitle"),
    decisionNote: document.getElementById("decisionNote"),
    choices: document.getElementById("decisionChoices"),
    callout: document.getElementById("growthCallout"),
    calloutEye: document.getElementById("growthEyebrow"),
    calloutTitle: document.getElementById("growthTitle"),
    calloutDetail: document.getElementById("growthDetail"),
    recap: document.getElementById("recapPanel"),
    evolution: document.getElementById("evolutionChain"),
    damage: document.getElementById("damageBreakdown"),
    buildName: document.getElementById("buildName"),
    buildSummary: document.getElementById("buildSummary"),
    unchosen: document.getElementById("unchosenRoutes"),
    replay: document.getElementById("replayButton")
  };

  const assetPaths = {
    bg: "assets/generated-backgrounds/office-arena-night.png",
    laser: "assets/generated-vfx/sprites/marker-line-office-v2.png",
    ink: "assets/generated-vfx/sprites/marker-ink-trail-office-v2.svg",
    impact: "assets/generated-vfx/sprites/marker-impact-office-v2.png",
    branch: "assets/generated-vfx/sprites/marker-branch-office-v2.png",
    wave: "assets/generated-vfx/sprites/marker-wave-office-v2.png",
    atlas: "assets/office-rogue-atlas.png",
    parts: "assets/generated-vfx/sprites/marker-growth-parts.svg",
    markerAttacks: "assets/generated-vfx/sprites/marker-attack-atlas-v2.png",
    markerPerson: "assets/generated-vfx/sprites/marker-person-directional-v4.png",
    markerRiggedPerson: "assets/generated-vfx/sprites/marker-person-printer-rig-directions-v5.png",
    markerWeapons: "assets/generated-vfx/sprites/marker-weapon-directions-v4.png"
  };
  const assets = {};
  let assetsReady = false;

  function loadAssets() {
    const jobs = Object.keys(assetPaths).map(function (key) {
      return new Promise(function (resolve) {
        const image = new Image();
        image.onload = function () { assets[key] = image; resolve(); };
        image.onerror = function () { resolve(); };
        image.src = assetPaths[key];
      });
    });
    Promise.all(jobs).then(function () {
      assetsReady = true;
      makeTintedAssets();
    });
  }

  function tintAsset(image, color) {
    if (!image || !image.width) return null;
    const out = document.createElement("canvas");
    out.width = image.width;
    out.height = image.height;
    const outCtx = out.getContext("2d");
    outCtx.drawImage(image, 0, 0);
    outCtx.globalCompositeOperation = "source-atop";
    outCtx.fillStyle = color;
    outCtx.fillRect(0, 0, out.width, out.height);
    outCtx.globalCompositeOperation = "source-over";
    return out;
  }

  function makeTintedAssets() {
    assets.laserCyan = tintAsset(assets.laser, "#68efff");
    assets.laserMagenta = tintAsset(assets.laser, "#ff65dc");
    assets.laserWhite = tintAsset(assets.laser, "#f7ffff");
    assets.impactWhite = tintAsset(assets.impact, "#f7ffff");
    assets.branchMagenta = tintAsset(assets.branch, "#ff65dc");
    assets.waveCopy = tintAsset(assets.wave, "#ffd75f");
    assets.waveArchive = tintAsset(assets.wave, "#68efff");
    assets.attackCells = sliceAtlas(assets.markerAttacks, 2, 2);
    assets.personCells = sliceAtlas(assets.markerPerson, 4, 2);
    assets.riggedPersonCells = sliceAlphaAtlas(assets.markerRiggedPerson, 4, 1);
    assets.riggedPersonVisuals = assets.riggedPersonCells.map(function (cell, facing) {
      return makeRiggedRouteVisuals(cell, facing);
    });
    assets.weaponCells = sliceAtlas(assets.markerWeapons, 4, 2);
    assets.weaponCopyCells = assets.weaponCells.map(function (cell) { return colorizeAsset(cell, "#ffd75f", 0.52); });
    assets.weaponArchiveCells = assets.weaponCells.map(function (cell) { return colorizeAsset(cell, "#68efff", 0.52); });
    assets.partCells = sliceAtlas(assets.parts, 6, 1);
  }

  function colorizeAsset(image, color, strength) {
    if (!image) return null;
    const out = document.createElement("canvas");
    out.width = image.width;
    out.height = image.height;
    const outCtx = out.getContext("2d");
    outCtx.drawImage(image, 0, 0);
    outCtx.globalCompositeOperation = "source-atop";
    outCtx.globalAlpha = strength == null ? 0.5 : strength;
    outCtx.fillStyle = color;
    outCtx.fillRect(0, 0, out.width, out.height);
    outCtx.globalAlpha = 1;
    outCtx.globalCompositeOperation = "source-over";
    return out;
  }

  function sliceAtlas(image, columns, rows) {
    if (!image || !image.width) return [];
    const width = Math.floor(image.width / columns);
    const height = Math.floor(image.height / rows);
    return Array.from({ length: columns * rows }, function (_, cell) {
      const out = document.createElement("canvas");
      out.width = width;
      out.height = height;
      const outCtx = out.getContext("2d");
      outCtx.drawImage(image, cell % columns * width, Math.floor(cell / columns) * height, width, height, 0, 0, width, height);
      return out;
    });
  }

  function alphaCrop(image, threshold) {
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
    const alphaFloor = threshold == null ? 10 : threshold;
    for (let y = 0; y < probe.height; y += 1) {
      for (let x = 0; x < probe.width; x += 1) {
        if (pixels[(y * probe.width + x) * 4 + 3] < alphaFloor) continue;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
    if (maxX < minX || maxY < minY) return probe;
    const out = document.createElement("canvas");
    out.width = maxX - minX + 1;
    out.height = maxY - minY + 1;
    out.getContext("2d").drawImage(probe, minX, minY, out.width, out.height, 0, 0, out.width, out.height);
    return out;
  }

  function sliceAlphaAtlas(image, columns, rows) {
    return sliceAtlas(image, columns, rows).map(function (cell) {
      return alphaCrop(cell, 10);
    }).filter(Boolean);
  }

  function routeRegionAllows(family, facing, x, width) {
    const ratio = x / Math.max(1, width);
    if (family === "archive") {
      if (facing === 3) return false;
      return ratio < (facing === 1 ? 0.62 : 0.46);
    }
    if (facing === 1) return false;
    return ratio > (facing === 3 ? 0.42 : 0.54);
  }

  function routePixelFamily(red, green, blue, x, width, facing) {
    const archive = routeRegionAllows("archive", facing, x, width)
      && green > 105 && blue > 120 && green > red * 1.28 && blue > red * 1.35;
    if (archive) return "archive";
    const copy = routeRegionAllows("copy", facing, x, width)
      && red > 145 && green > 88 && blue < green * 0.72 && red > blue * 1.65;
    return copy ? "copy" : null;
  }

  function makeRiggedRouteVisuals(image, facing) {
    if (!image) return null;
    const base = document.createElement("canvas");
    const copy = document.createElement("canvas");
    const archive = document.createElement("canvas");
    [base, copy, archive].forEach(function (canvas) {
      canvas.width = image.width;
      canvas.height = image.height;
    });
    const baseCtx = base.getContext("2d", { willReadFrequently: true });
    baseCtx.drawImage(image, 0, 0);
    const basePixels = baseCtx.getImageData(0, 0, base.width, base.height);
    const copyPixels = new ImageData(base.width, base.height);
    const archivePixels = new ImageData(base.width, base.height);
    for (let y = 0; y < base.height; y += 1) {
      for (let x = 0; x < base.width; x += 1) {
        const offset = (y * base.width + x) * 4;
        const alpha = basePixels.data[offset + 3];
        if (!alpha) continue;
        const family = routePixelFamily(
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

  function createState() {
    return {
      mode: "intro",
      elapsed: 0,
      lastAt: performance.now(),
      player: { x: W / 2, y: H / 2 + 20, radius: 20, speed: 236, hp: 72, maxHp: 72, hitCooldown: 0, angle: 0, facing: 0, moving: false, walkClock: 0 },
      input: { up: false, down: false, left: false, right: false },
      modules: { copy: 0, archive: 0 },
      moduleOrder: [],
      component: null,
      componentHistory: [],
      attackTimer: 0.25,
      attackRound: 0,
      spawnTimer: 0.1,
      spawnIndex: 0,
      enemies: [],
      lines: [],
      trails: [],
      retrievals: [],
      bursts: [],
      specialVfx: [],
      archiveFields: [],
      scheduled: [],
      kills: 0,
      nearDeaths: 0,
      choiceIndex: 0,
      milestoneIndex: 0,
      calloutTimer: 0,
      screenFlash: 0,
      growthPulse: 0,
      stats: { base: 0, copy: 0, archive: 0, retrieval: 0 },
      retrievalTriggers: 0,
      ultimateCooldown: 0,
      ultimateActivations: 0,
      evolution: ["普通马克笔"],
      clusterAngle: 0,
      ended: false
    };
  }

  let state = createState();
  const milestones = [
    { time: 25, type: "module" },
    { time: 60, type: "component" },
    { time: 100, type: "module" },
    { time: 140, type: "module" },
    { time: 155, type: "module" },
    { time: 180, type: "end" }
  ];

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function random(min, max) { return min + Math.random() * (max - min); }
  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  function setPips(node, level) {
    node.innerHTML = [0, 1, 2, 3].map(function (index) {
      return '<span class="' + (index < level ? "active" : "") + '"></span>';
    }).join("");
  }

  function phaseName() {
    if (state.elapsed < 25) return "普通马克笔 · 读取基础动词";
    if (state.elapsed < 60) return "第一次异化 · 验证路线";
    if (state.elapsed < 100) return "实体组件 · 改写攻击形态";
    if (state.elapsed < 140) return state.modules.copy && state.modules.archive ? "交叉流程 · 建立调阅" : "主路线 · 纵向膨胀";
    if (state.modules.copy >= 4) return "全页批注 · 终极展示";
    if (state.modules.archive >= 4) return "整页归档 · 终极展示";
    return state.modules.copy && state.modules.archive ? "调阅线网 · 高压展示" : "单路线极化 · 高压展示";
  }

  function updateHud() {
    const remaining = Math.max(0, 180 - state.elapsed);
    refs.timer.textContent = String(Math.floor(remaining / 60)).padStart(2, "0") + ":" + String(Math.ceil(remaining % 60)).padStart(2, "0");
    refs.phase.textContent = phaseName();
    refs.kills.textContent = String(state.kills);
    refs.health.textContent = Math.ceil(state.player.hp) + " / " + state.player.maxHp;
    refs.healthFill.style.width = clamp(state.player.hp / state.player.maxHp * 100, 0, 100) + "%";
    refs.copyLevel.textContent = "Lv." + state.modules.copy;
    refs.archiveLevel.textContent = "Lv." + state.modules.archive;
    setPips(refs.copyPips, state.modules.copy);
    setPips(refs.archivePips, state.modules.archive);
    refs.component.textContent = state.component ? state.component.name : "未装组件";
    refs.body.textContent = featureFlags.embodiedGrowthPass
      ? (state.modules.copy >= 4 ? "全页批注 · 马克笔人" : state.modules.archive >= 4 ? "整页归档 · 马克笔人" : state.modules.copy && state.modules.archive ? "交叉调阅 · 马克笔人" : state.modules.copy ? "复写喷射 · 马克笔人" : state.modules.archive ? "留档供墨 · 马克笔人" : "标准笔身")
      : "基线笔身（不显形）";
    const fused = state.modules.copy > 0 && state.modules.archive > 0 && featureFlags.workflowFusionPass;
    const pureUltimate = state.modules.copy >= 4 || state.modules.archive >= 4;
    refs.fusion.classList.toggle("active", fused || pureUltimate);
    refs.fusion.querySelector("small").textContent = pureUltimate ? "纯路线终极" : "交叉流程";
    refs.fusion.querySelector("b").textContent = state.modules.copy >= 4 ? "全页批注已上线" : state.modules.archive >= 4 ? "整页归档已上线" : fused ? "调阅已建立" : featureFlags.workflowFusionPass ? "调阅未建立" : "本对照不启用融合";
    refs.fusion.querySelector("span").textContent = pureUltimate ? "已发动 " + state.ultimateActivations + " 次 · 自动蓄能" : fused ? "本轮已回读 " + state.retrievalTriggers + " 条档案" : "黄线 × 青墨 → 洋红回读";
  }

  function showCallout(eyebrow, title, detail, tone) {
    refs.calloutEye.textContent = eyebrow;
    refs.calloutTitle.textContent = title;
    refs.calloutDetail.textContent = detail;
    refs.callout.style.borderLeftColor = tone || "#ffd75f";
    refs.calloutTitle.style.color = tone || "#ffd75f";
    refs.callout.classList.remove("hidden");
    refs.callout.style.animation = "none";
    void refs.callout.offsetWidth;
    refs.callout.style.animation = "calloutIn 1.9s ease both";
    state.calloutTimer = 1.9;
  }

  function moduleDefinition(id) {
    const level = state.modules[id] + 1;
    if (id === "copy") {
      const effects = [
        "基础黄线变成双线平行前射；打印坞装入第一阶复写墨盒。",
        "双线变成三线平行覆盖；复写墨盒的输出栅格与亮度同步提升。",
        "第一轮结束后重新瞄准，再完成一次平行三线复写；墨盒进入高亮运转。",
        "复写墨盒过载发光；普通攻击仍保持平行前射，并周期展开以当前瞄准方向为核心的宽幅批注，外围追加少量四散线束。"
      ];
      return {
        id: "copy", name: "复写", family: "即时动作", level, color: "#ffd75f", preview: "copy",
        effect: effects[level - 1], next: level === 4 ? "Lv.4 是纯路线专属终极技：正面宽幅聚焦 + 外围四散" : level === 3 ? "新增攻击轮次，不是继续加倍率" : "新增真实激光实体与独立命中"
      };
    }
    const effects = [
      "黄线划过后留下第一条青色墨迹；打印坞装入第一阶留档墨盒。",
      "墨迹变成双层平行留场；留档墨盒液位与亮度同步提升。",
      "每次攻击留下三层平行墨迹；墨盒进入高亮供墨状态。",
      "留档墨盒过载发光；周期发动整页归档，把周围战场覆盖成高压持续墨场。"
    ];
    return {
      id: "archive", name: "留档", family: "留场状态", level, color: "#68efff", preview: "archive",
      effect: effects[level - 1], next: level === 4 ? "Lv.4 是纯路线专属终极技：全场墨潮接管" : level === 3 ? "扩大留场实体数量，不是提高面板倍率" : "新增持续墨迹实体与减速伤害"
    };
  }

  function moduleCard(def) {
    const disabled = def.level > 4;
    const previewCount = def.preview === "copy" ? (def.level === 1 ? 2 : def.level >= 4 ? 4 : 3) : Math.min(4, def.level);
    const previewLines = Array.from({ length: previewCount }, function () { return "<i></i>"; }).join("");
    return '<button class="decision-card" data-choice="' + def.id + '" style="--card-color:' + def.color + '" ' + (disabled ? "disabled" : "") + '>' +
      '<small>' + def.family + ' · MODULE</small>' +
      '<h3>' + def.name + ' Lv.' + Math.min(4, def.level) + '</h3>' +
      '<span class="level-next">当前 Lv.' + state.modules[def.id] + ' → 选择后 Lv.' + Math.min(4, def.level) + '</span>' +
      '<div class="mini-preview ' + def.preview + ' count-' + previewCount + '">' + previewLines + '</div>' +
      '<p>' + (disabled ? "该路线已完成本实验的 Lv.4 终极形态。" : def.effect) + '</p>' +
      '<strong>' + def.next + '</strong>' +
      '<em>' + (def.id === "copy" ? "暖黄：当前动作 / 即时切割" : "冷青：过去状态 / 持续留场") + '</em>' +
      '</button>';
  }

  function openModuleChoice() {
    state.mode = "decision";
    refs.decisionEyebrow.textContent = state.choiceIndex === 0 ? "FIRST WORKFLOW MUTATION" : "WORKFLOW CONTINUES";
    refs.decisionTitle.textContent = state.choiceIndex === 0 ? "先让马克笔长出一种工作方式" : "继续极化，或让两条流程开始对话";
    refs.decisionNote.textContent = state.choiceIndex === 0
      ? "这次选择会同时改变攻击、武器实体和下一段敌群形状。"
      : "混合不是折中：黄线穿过旧墨迹时，会触发新的“调阅”结果。";
    refs.choices.className = "decision-choices two";
    refs.choices.innerHTML = moduleCard(moduleDefinition("copy")) + moduleCard(moduleDefinition("archive"));
    refs.decision.classList.remove("hidden");
    bindChoiceButtons("module");
    autoChooseSoon();
  }

  function componentDefinitions() {
    const first = state.moduleOrder[0] || "copy";
    if (first === "copy") {
      return [
        { id: "tip", name: "穿透笔头", color: "#ffd75f", stat: "穿透 +2", detail: "更多敌人共享同一次线段判定。", apply: { pierce: 2 } },
        { id: "body", name: "数量笔身", color: "#ff65dc", stat: "基础线 +1", detail: "每条基础线都继续生成复写线。", apply: { amount: 1 } },
        { id: "tail", name: "范围笔尾", color: "#68efff", stat: "长度 / 宽度 +18%", detail: "真实激光和并排间距同步长大。", apply: { range: 1.18 } }
      ];
    }
    return [
      { id: "tip", name: "增压笔头", color: "#ffd75f", stat: "全部伤害 +18%", detail: "黄线、青墨与调阅共享基础增压。", apply: { damage: 1.18 } },
      { id: "body", name: "加急笔身", color: "#ff65dc", stat: "攻击间隔 -20%", detail: "更快划线，也更快在战场上铺设档案。", apply: { speed: 0.8 } },
      { id: "tail", name: "长效笔尾", color: "#68efff", stat: "墨迹持续 +1.5s", detail: "旧状态留得更久，更容易与新黄线交叉。", apply: { duration: 1.5 } }
    ];
  }

  function componentMountDescription(component) {
    const rule = componentMountRule(component);
    if (rule === PHYSICAL_MOUNTS.tipComponent) return "已锁入每支实际发射笔的笔头";
    if (rule === PHYSICAL_MOUNTS.amountComponent) return "新增发射笔就是数量笔身的实体结果";
    if (rule === PHYSICAL_MOUNTS.bodyComponent) return "已扣入每支实际发射笔的笔身";
    if (rule === PHYSICAL_MOUNTS.durationTailComponent) return "已接入人物背负墨仓";
    return "已接到每支实际发射笔的尾部";
  }

  function componentCard(def) {
    return '<button class="decision-card" data-choice="' + def.id + '" style="--card-color:' + def.color + '">' +
      '<small>PHYSICAL COMPONENT · ' + def.id.toUpperCase() + '</small>' +
      '<h3>' + def.name + '</h3>' +
      '<span class="level-next">本实验提供 1 枚装配券 · 装上后立即生效</span>' +
      '<div class="mini-preview component"><i></i></div>' +
      '<p>' + def.detail + '</p>' +
      '<strong>' + def.stat + '</strong>' +
      '<em>组件只改属性，并按真实部位安装到发射笔或背负系统。</em>' +
      '</button>';
  }

  function openComponentChoice() {
    state.mode = "decision";
    refs.decisionEyebrow.textContent = "PHYSICAL COMPONENT INSTALLATION";
    refs.decisionTitle.textContent = "把一个属性选择，真的装到马克笔上";
    refs.decisionNote.textContent = "没有刷新与合成；本轮只验证“属性是否同时改变形态和武器归属感”。";
    refs.choices.className = "decision-choices";
    const defs = componentDefinitions();
    refs.choices.innerHTML = defs.map(componentCard).join("");
    refs.decision.classList.remove("hidden");
    bindChoiceButtons("component", defs);
    autoChooseSoon();
  }

  function bindChoiceButtons(kind, definitions) {
    refs.choices.querySelectorAll("[data-choice]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (kind === "module") chooseModule(button.dataset.choice);
        else chooseComponent((definitions || componentDefinitions()).find(function (item) { return item.id === button.dataset.choice; }));
      });
    });
  }

  function autoChooseSoon() {
    if (!autoQueue.length) return;
    window.setTimeout(function () {
      if (state.mode !== "decision") return;
      const wanted = autoQueue.shift();
      const button = refs.choices.querySelector('[data-choice="' + wanted + '"]:not(:disabled)') || refs.choices.querySelector("[data-choice]:not(:disabled)");
      if (button) button.click();
    }, 80);
  }

  function chooseModule(id) {
    if (!state.modules.hasOwnProperty(id) || state.modules[id] >= 4) return;
    state.modules[id] += 1;
    state.moduleOrder.push(id);
    state.choiceIndex += 1;
    refs.decision.classList.add("hidden");
    state.mode = "battle";
    state.growthPulse = 1.2;
    state.screenFlash = 0.22;
    const def = moduleDefinition(id);
    const selectedLevel = state.modules[id];
    const pureUltimateNow = selectedLevel === 4 && state.modules[id === "copy" ? "archive" : "copy"] === 0;
    state.evolution.push(pureUltimateNow ? (id === "copy" ? "复写 Lv.4 · 全页批注" : "留档 Lv.4 · 整页归档") : def.name + " Lv." + selectedLevel);
    const fusionNow = state.modules.copy > 0 && state.modules.archive > 0 && featureFlags.workflowFusionPass;
    showCallout(
      pureUltimateNow ? "PURE ROUTE ULTIMATE INSTALLED" : fusionNow ? "WORKFLOW FUSION ONLINE" : "WORKFLOW MUTATION INSTALLED",
      pureUltimateNow ? (id === "copy" ? "全页批注已接管喷射头" : "整页归档已接通墨仓") : fusionNow ? "调阅回路已接通" : def.name + " Lv." + selectedLevel + " 已装配",
      pureUltimateNow ? (id === "copy" ? "下一轮攻击会沿当前瞄准方向展开宽幅聚焦批注，并由外围线束补足全场；之后按独立周期再次发动。" : "下一轮攻击将铺开大范围持续墨场，之后按独立周期再次发动。") : fusionNow ? "暖黄当前动作穿过冷青历史墨迹时，将沿整条档案触发洋红回读。" : (id === "copy" ? "下一轮黄线会增加新的即时激光实体。" : "下一轮黄线会留下新的持续墨迹实体。"),
      pureUltimateNow ? (id === "copy" ? "#ffd75f" : "#68efff") : fusionNow ? "#ff65dc" : def.color
    );
    if (fusionNow && state.evolution[state.evolution.length - 2] !== "调阅回路") state.evolution.push("调阅回路");
    updateHud();
  }

  function chooseComponent(def) {
    if (!def) return;
    state.component = def;
    state.componentHistory.push(def.name);
    state.evolution.push(def.name);
    refs.decision.classList.add("hidden");
    state.mode = "battle";
    state.growthPulse = 1.25;
    state.screenFlash = 0.22;
    showCallout("PHYSICAL COMPONENT DOCKED", def.name + " · " + componentMountDescription(def), def.stat + "；战斗判定与实际安装位置同时更新。", def.color);
    updateHud();
  }

  function triggerMilestone() {
    if (state.milestoneIndex >= milestones.length) return;
    const milestone = milestones[state.milestoneIndex];
    if (state.elapsed + 0.0001 < milestone.time) return;
    state.milestoneIndex += 1;
    if (milestone.type === "module") openModuleChoice();
    else if (milestone.type === "component") openComponentChoice();
    else finishRun();
  }

  function attackStats() {
    const component = state.component && state.component.apply || {};
    return {
      damage: 11.5 * (component.damage || 1),
      cooldown: 0.7 * (component.speed || 1),
      range: 540 * (component.range || 1),
      width: 8 * (component.range || 1),
      pierce: 4 + (component.pierce || 0),
      amount: 1 + (component.amount || 0),
      trailDuration: 3.3 + (component.duration || 0),
      trailWidth: 38 * (component.range || 1)
    };
  }

  function nearestEnemy(x, y) {
    let nearest = null;
    let nearestDistance = Infinity;
    state.enemies.forEach(function (enemy) {
      if (enemy.dead) return;
      const d = Math.hypot(enemy.x - x, enemy.y - y);
      if (d < nearestDistance) { nearest = enemy; nearestDistance = d; }
    });
    return nearest;
  }

  function orbitPoint(angle, radius) {
    return {
      x: state.player.x + Math.cos(angle) * radius,
      y: state.player.y + Math.sin(angle) * radius
    };
  }

  function emitterNode(id, family, slotAngle, orbitRadius, aimAngle, size, attackScale) {
    const point = orbitPoint(slotAngle, orbitRadius);
    return {
      id,
      type: "emitter",
      family,
      x: point.x,
      y: point.y,
      aimAngle,
      orbitRadius,
      size: size || BUILD_LAYOUT.weaponSize,
      muzzleOffset: BUILD_LAYOUT.muzzleOffset,
      attackScale: attackScale == null ? 1 : attackScale,
      directionFrames: 8,
      zMode: "world-y"
    };
  }

  function formationOffsets(count, spread) {
    if (count <= 1) return [0];
    if (count === 2) return [-spread, spread];
    return [-spread, 0, spread];
  }

  function getAttackEmitters(baseAngle) {
    const stats = attackStats();
    const amountAngles = stats.amount === 1 ? [0] : [-0.08, 0.08];
    const emitters = [];
    const copyLevel = state.modules.copy;
    const archiveLevel = state.modules.archive;

    if (copyLevel > 0) {
      const count = copyLevel === 1 ? 2 : 3;
      const orbit = BUILD_LAYOUT.copyOrbit[copyLevel];
      formationOffsets(count, copyLevel === 1 ? 0.34 : 0.48).forEach(function (slotOffset, slotIndex) {
        amountAngles.forEach(function (amountOffset, amountIndex) {
          const aimAngle = baseAngle;
          emitters.push(emitterNode(
            "copy-" + slotIndex + "-" + amountIndex,
            "copy",
            baseAngle + slotOffset + amountOffset * 0.7,
            orbit + amountIndex * 12,
            aimAngle,
            BUILD_LAYOUT.weaponSize,
            slotOffset === 0 ? 1 : 0.64
          ));
        });
      });
    } else {
      amountAngles.forEach(function (amountOffset, amountIndex) {
        const aimAngle = baseAngle;
        emitters.push(emitterNode(
          "base-" + amountIndex,
          "base",
          aimAngle,
          BUILD_LAYOUT.baseOrbit + amountIndex * 12,
          aimAngle,
          BUILD_LAYOUT.weaponSize,
          1
        ));
      });
    }

    if (archiveLevel > 0) {
      const trailCount = Math.min(3, archiveLevel);
      const orbit = BUILD_LAYOUT.archiveOrbit[archiveLevel];
      formationOffsets(trailCount, trailCount === 2 ? 0.78 : 0.94).forEach(function (slotOffset, slotIndex) {
        amountAngles.forEach(function (amountOffset, amountIndex) {
          const aimAngle = baseAngle;
          emitters.push(emitterNode(
            "archive-" + slotIndex + "-" + amountIndex,
            "archive",
            baseAngle + slotOffset + amountOffset * 0.7,
            orbit + amountIndex * 12,
            aimAngle,
            BUILD_LAYOUT.weaponSize - 2,
            0.13
          ));
        });
      });
    }
    return emitters;
  }

  function muzzlePoint(emitter) {
    return {
      x: emitter.x + Math.cos(emitter.aimAngle) * emitter.muzzleOffset,
      y: emitter.y + Math.sin(emitter.aimAngle) * emitter.muzzleOffset
    };
  }

  function emitterAttackPath(emitter, outwardLength) {
    const muzzle = muzzlePoint(emitter);
    const forwardX = Math.cos(emitter.aimAngle);
    const forwardY = Math.sin(emitter.aimAngle);
    return {
      x1: muzzle.x,
      y1: muzzle.y,
      x2: muzzle.x + forwardX * outwardLength,
      y2: muzzle.y + forwardY * outwardLength,
      guardX1: state.player.x,
      guardY1: state.player.y,
      guardX2: muzzle.x,
      guardY2: muzzle.y,
      muzzleX: muzzle.x,
      muzzleY: muzzle.y,
      angle: emitter.aimAngle
    };
  }

  function playerFacingAngle() {
    return [Math.PI / 2, 0, -Math.PI / 2, Math.PI][state.player.facing] || 0;
  }

  function playerMountPoint(socket, distance, lateral) {
    const facing = playerFacingAngle();
    const backX = -Math.cos(facing);
    const backY = -Math.sin(facing);
    const rightX = -Math.sin(facing);
    const rightY = Math.cos(facing);
    return {
      x: state.player.x + backX * (distance || 24) + rightX * (lateral || 0),
      y: state.player.y + backY * (distance || 24) + rightY * (lateral || 0)
    };
  }

  function componentMountRule(component) {
    if (!component) return null;
    const apply = component.apply || {};
    if (component.id === "tip") return PHYSICAL_MOUNTS.tipComponent;
    if (component.id === "body" && apply.amount) return PHYSICAL_MOUNTS.amountComponent;
    if (component.id === "body") return PHYSICAL_MOUNTS.bodyComponent;
    if (component.id === "tail" && apply.duration) return PHYSICAL_MOUNTS.durationTailComponent;
    return PHYSICAL_MOUNTS.rangeTailComponent;
  }

  function buildVisualNodes(baseAngle) {
    const emitters = getAttackEmitters(baseAngle);
    const nodes = emitters.map(function (emitter) {
      return Object.assign({}, emitter, { renderRole: "weapon" });
    });
    const copyLevel = state.modules.copy;
    const archiveLevel = state.modules.archive;
    const hybrid = copyLevel > 0 && archiveLevel > 0;
    const integratedRig = assets.riggedPersonVisuals && assets.riggedPersonVisuals.length === 4;
    const pulseScale = state.growthPulse > 0 ? 1 + Math.sin((1.2 - state.growthPulse) * 12) * 0.08 * (state.growthPulse / 1.2) : 1;

    if (!integratedRig && featureFlags.embodiedGrowthPass && (copyLevel > 0 || archiveLevel > 0)) {
      const point = playerMountPoint(PHYSICAL_MOUNTS.printerDock.socket, BUILD_LAYOUT.dockBackDistance, 0);
      nodes.push({
        id: "printer-dock",
        type: "printer-dock",
        family: hybrid ? "hybrid" : copyLevel > 0 ? "copy" : "archive",
        mount: PHYSICAL_MOUNTS.printerDock,
        hybrid,
        x: point.x,
        y: point.y,
        width: (hybrid ? BUILD_LAYOUT.dockHybridWidth : BUILD_LAYOUT.dockPureWidth) * pulseScale,
        height: BUILD_LAYOUT.dockHeight * pulseScale,
        rotation: playerFacingAngle() - Math.PI / 2,
        zMode: "world-y"
      });
    }
    if (!integratedRig && featureFlags.embodiedGrowthPass && copyLevel > 0) {
      const point = playerMountPoint(
        PHYSICAL_MOUNTS.copyController.socket,
        BUILD_LAYOUT.rigDistance,
        hybrid ? BUILD_LAYOUT.rigSpread : BUILD_LAYOUT.pureRigLateral
      );
      nodes.push({
        id: "copy-controller",
        type: "controller",
        family: "copy",
        mount: PHYSICAL_MOUNTS.copyController,
        level: copyLevel,
        x: point.x,
        y: point.y,
        intensity: Math.min(1, 0.56 + copyLevel * 0.11),
        width: (hybrid ? BUILD_LAYOUT.cartridgeHybridWidth : BUILD_LAYOUT.cartridgePureWidth) * pulseScale,
        height: (BUILD_LAYOUT.cartridgeHeight + copyLevel * 1.5) * pulseScale,
        rotation: playerFacingAngle() - Math.PI / 2,
        zMode: "world-y"
      });
    }
    if (!integratedRig && featureFlags.embodiedGrowthPass && archiveLevel > 0) {
      const point = playerMountPoint(
        PHYSICAL_MOUNTS.archiveReservoir.socket,
        BUILD_LAYOUT.rigDistance,
        hybrid ? -BUILD_LAYOUT.rigSpread : BUILD_LAYOUT.pureRigLateral
      );
      nodes.push({
        id: "archive-controller",
        type: "controller",
        family: "archive",
        mount: PHYSICAL_MOUNTS.archiveReservoir,
        level: archiveLevel,
        x: point.x,
        y: point.y,
        intensity: Math.min(1, 0.56 + archiveLevel * 0.11),
        width: (hybrid ? BUILD_LAYOUT.cartridgeHybridWidth : BUILD_LAYOUT.cartridgePureWidth) * pulseScale,
        height: (BUILD_LAYOUT.cartridgeHeight + archiveLevel * 1.5) * pulseScale,
        rotation: playerFacingAngle() - Math.PI / 2,
        zMode: "world-y"
      });
    }
    const componentRule = componentMountRule(state.component);
    if (componentRule === PHYSICAL_MOUNTS.durationTailComponent && assets.partCells) {
      const point = playerMountPoint("archive-reservoir", BUILD_LAYOUT.rigDistance + 13, hybrid ? -BUILD_LAYOUT.rigSpread : 0);
      nodes.push({
        id: "component-" + state.component.id,
        type: "worn-component",
        family: "archive",
        mount: componentRule,
        component: state.component,
        x: point.x,
        y: point.y,
        size: 30,
        rotation: playerFacingAngle() - Math.PI / 2,
        zMode: "world-y"
      });
    }
    return nodes;
  }

  function pointLineDistance(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy || 1;
    const t = clamp(((px - x1) * dx + (py - y1) * dy) / lenSq, 0, 1);
    const x = x1 + dx * t;
    const y = y1 + dy * t;
    return { distance: Math.hypot(px - x, py - y), t, x, y };
  }

  function segmentIntersection(a, b) {
    const s1x = a.x2 - a.x1;
    const s1y = a.y2 - a.y1;
    const s2x = b.x2 - b.x1;
    const s2y = b.y2 - b.y1;
    const denom = (-s2x * s1y + s1x * s2y);
    if (Math.abs(denom) < 0.001) {
      const sharedStart = pointLineDistance(a.x1, a.y1, b.x1, b.y1, b.x2, b.y2);
      return sharedStart.distance <= 20 ? { x: a.x1, y: a.y1 } : null;
    }
    const s = (-s1y * (a.x1 - b.x1) + s1x * (a.y1 - b.y1)) / denom;
    const t = (s2x * (a.y1 - b.y1) - s2y * (a.x1 - b.x1)) / denom;
    if (s >= 0 && s <= 1 && t >= -0.001 && t <= 1) return { x: a.x1 + t * s1x, y: a.y1 + t * s1y };
    return null;
  }

  function dealDamage(enemy, amount, source) {
    if (!enemy || enemy.dead) return;
    enemy.hp -= amount;
    enemy.hitFlash = 0.11;
    state.stats[source] += amount;
      if (enemy.hp <= 0) {
        enemy.dead = true;
        enemy.deadLife = 0.22;
      state.kills += 1;
      state.bursts.push({ x: enemy.x, y: enemy.y, life: 0.36, maxLife: 0.36, color: source === "archive" ? "cyan" : source === "retrieval" ? "magenta" : "yellow" });
    }
  }

  function damageLaserPath(path, damage, source, pierce) {
    const hits = state.enemies.map(function (enemy) {
      const guard = pointLineDistance(enemy.x, enemy.y, path.guardX1, path.guardY1, path.guardX2, path.guardY2);
      const beam = pointLineDistance(enemy.x, enemy.y, path.x1, path.y1, path.x2, path.y2);
      const guardHit = guard.distance <= enemy.radius + path.width * 0.62;
      const beamHit = beam.distance <= enemy.radius + path.width * 0.62;
      return { enemy, hit: guardHit || beamHit, order: guardHit ? guard.t : 1 + beam.t };
    }).filter(function (item) {
      return !item.enemy.dead && item.hit;
    }).sort(function (a, b) { return a.order - b.order; }).slice(0, pierce);
    hits.forEach(function (item) { dealDamage(item.enemy, damage, source); });
  }

  function addLaser(emitter, source, damageScale, roundId) {
    const stats = attackStats();
    const path = emitterAttackPath(emitter, stats.range);
    const x1 = path.x1;
    const y1 = path.y1;
    const x2 = path.x2;
    const y2 = path.y2;
    const line = {
      x1, y1, x2, y2,
      guardX1: path.guardX1,
      guardY1: path.guardY1,
      guardX2: path.guardX2,
      guardY2: path.guardY2,
      width: stats.width,
      life: 0.34,
      maxLife: 0.34,
      source,
      roundId,
      emitterId: emitter.id
    };
    state.lines.push(line);
    damageLaserPath(line, stats.damage * damageScale, source, stats.pierce);
    return line;
  }

  function addArchiveTrail(emitter, roundId) {
    const stats = attackStats();
    const path = emitterAttackPath(emitter, stats.range * 0.92);
    state.trails.push({
      id: "trail-" + roundId + "-" + emitter.id,
      x1: path.x1,
      y1: path.y1,
      x2: path.x2,
      y2: path.y2,
      guardX1: path.guardX1,
      guardY1: path.guardY1,
      guardX2: path.guardX2,
      guardY2: path.guardY2,
      width: stats.trailWidth,
      life: stats.trailDuration,
      maxLife: stats.trailDuration,
      tick: 0,
      bornRound: roundId,
      retrievedRound: -1,
      emitterId: emitter.id
    });
  }

  function triggerRetrieval(lines, roundId) {
    if (!featureFlags.workflowFusionPass || !state.modules.copy || !state.modules.archive) return;
    let triggered = 0;
    state.trails.forEach(function (trail) {
      if (triggered >= 2 || trail.bornRound === roundId || trail.retrievedRound === roundId || trail.life < 0.12) return;
      let intersection = null;
      for (const line of lines) {
        intersection = segmentIntersection(line, trail);
        if (intersection) break;
      }
      if (!intersection) return;
      if (Math.hypot(intersection.x - state.player.x, intersection.y - state.player.y) < 60) {
        intersection = { x: lerp(trail.x1, trail.x2, 0.14), y: lerp(trail.y1, trail.y2, 0.14) };
      }
      trail.retrievedRound = roundId;
      state.retrievals.push({ trail, x: intersection.x, y: intersection.y, life: 0.78, maxLife: 0.78 });
      state.retrievalTriggers += 1;
      triggered += 1;
      state.enemies.forEach(function (enemy) {
        const result = pointLineDistance(enemy.x, enemy.y, trail.x1, trail.y1, trail.x2, trail.y2);
        if (result.distance <= enemy.radius + trail.width * 0.62) dealDamage(enemy, attackStats().damage * 0.42, "retrieval");
      });
      state.screenFlash = Math.max(state.screenFlash, 0.09);
    });
  }

  function announceUltimate(name, detail, color) {
    if (state.ultimateActivations !== 1) return;
    showCallout("PURE ROUTE ULTIMATE", name, detail, color);
  }

  function triggerCopyUltimate() {
    const roundId = ++state.attackRound + 0.25;
    const baseAngle = state.player.angle;
    const forwardX = Math.cos(baseAngle);
    const forwardY = Math.sin(baseAngle);
    const lateralX = -forwardY;
    const lateralY = forwardX;

    // Lv4 still reads as the current attack, only widened into a dense forward
    // proofreading front.  Most of the damage budget stays on the aimed middle
    // direction; the remaining beams are secondary spill, never an even radial burst.
    for (let index = -5; index <= 5; index++) {
      const lateral = index * 18;
      const aimAngle = baseAngle + index * 0.012;
      const emitter = {
        id: "copy-ultimate-core-" + (index + 5),
        type: "emitter",
        family: "copy",
        x: state.player.x + forwardX * 58 + lateralX * lateral,
        y: state.player.y + forwardY * 58 + lateralY * lateral,
        aimAngle,
        orbitRadius: 58,
        size: 44,
        muzzleOffset: BUILD_LAYOUT.muzzleOffset,
        attackScale: 0.64,
        directionFrames: 8,
        zMode: "world-y"
      };
      addLaser(emitter, "copy", 0.64, roundId);
    }

    [
      -Math.PI * 0.75,
      -Math.PI * 0.5,
      -Math.PI * 0.25,
      Math.PI * 0.25,
      Math.PI * 0.5,
      Math.PI * 0.75,
      Math.PI
    ].forEach(function (angleOffset, index) {
      const angle = baseAngle + angleOffset;
      const emitter = emitterNode("copy-ultimate-spill-" + index, "copy", angle, 92, angle, 40, 0.28);
      addLaser(emitter, "copy", 0.28, roundId);
    });
    state.ultimateCooldown = 4.6;
    state.ultimateActivations += 1;
    state.screenFlash = 0.3;
    announceUltimate("全页批注：聚焦校样面展开", "11 道主批注沿当前瞄准方向扩宽命中面，7 道外围线束补足侧后方；这是纯复写 Lv.4 的战场统治窗口。", "#ffd75f");
  }

  function triggerArchiveUltimate() {
    const stats = attackStats();
    const field = {
      x: state.player.x,
      y: state.player.y,
      radius: 450,
      life: 3.8,
      maxLife: 3.8,
      tick: 0
    };
    state.archiveFields.push(field);
    state.enemies.forEach(function (enemy) {
      if (!enemy.dead && Math.hypot(enemy.x - field.x, enemy.y - field.y) <= field.radius + enemy.radius) {
        enemy.slow = Math.min(enemy.slow, 0.48);
        dealDamage(enemy, stats.damage * 0.72, "archive");
      }
    });
    state.specialVfx.push({ type: "archiveUltimate", x: field.x, y: field.y, life: 1.2, maxLife: 1.2, rotation: state.elapsed * 0.12 });
    state.ultimateCooldown = 5.2;
    state.ultimateActivations += 1;
    state.screenFlash = 0.3;
    announceUltimate("整页归档：墨潮接管战场", "大范围墨场持续减速并多次结算；这是纯留档 Lv.4 的空间统治窗口。", "#68efff");
  }

  function fireAttack(secondRound) {
    const target = nearestEnemy(state.player.x, state.player.y);
    if (!target) return;
    const roundId = secondRound ? state.attackRound + 0.5 : ++state.attackRound;
    const baseAngle = Math.atan2(target.y - state.player.y, target.x - state.player.x);
    state.player.angle = baseAngle;
    const emitters = getAttackEmitters(baseAngle);
    const fired = [];
    emitters.forEach(function (emitter) {
      if (emitter.family === "archive") {
        if (!secondRound) addArchiveTrail(emitter, roundId);
        return;
      }
      const source = emitter.family === "copy" ? "copy" : "base";
      fired.push(addLaser(emitter, source, emitter.attackScale, roundId));
    });
    triggerRetrieval(fired, roundId);
    if (!secondRound && state.modules.copy >= 3) state.scheduled.push({ at: state.elapsed + 0.18, type: "second" });
    if (!secondRound && state.ultimateCooldown <= 0) {
      if (state.modules.copy >= 4 && state.modules.archive === 0) triggerCopyUltimate();
      else if (state.modules.archive >= 4 && state.modules.copy === 0) triggerArchiveUltimate();
    }
  }

  function spawnProfile() {
    const t = state.elapsed;
    if (t < 25) return { interval: 0.64, hp: 18, speed: 78, damage: 5, max: 26, pattern: "queue" };
    if (t < 60) return { interval: 0.48, hp: 22, speed: 87, damage: 6, max: 34, pattern: "queue" };
    if (t < 100) return { interval: 0.36, hp: 26, speed: 93, damage: 6, max: 44, pattern: "cluster" };
    if (t < 140) return { interval: 0.3, hp: 31, speed: 101, damage: 7, max: 54, pattern: "cross" };
    return { interval: 0.22, hp: 35, speed: 108, damage: 8, max: 70, pattern: "showcase" };
  }

  function spawnEnemy() {
    const profile = spawnProfile();
    if (state.enemies.filter(function (enemy) { return !enemy.dead; }).length >= profile.max) return;
    let angle;
    if (profile.pattern === "queue") {
      angle = (state.spawnIndex % 3 - 1) * 0.11 + (state.spawnIndex % 6 < 3 ? 0 : Math.PI);
    } else if (profile.pattern === "cluster") {
      if (state.spawnIndex % 7 === 0) state.clusterAngle = random(0, Math.PI * 2);
      angle = state.clusterAngle + random(-0.22, 0.22);
    } else if (profile.pattern === "cross") {
      angle = [0, Math.PI / 2, Math.PI, Math.PI * 1.5][state.spawnIndex % 4] + random(-0.18, 0.18);
    } else {
      angle = random(0, Math.PI * 2);
    }
    const radius = 650;
    const x = W / 2 + Math.cos(angle) * radius;
    const y = H / 2 + Math.sin(angle) * radius * 0.56;
    const role = state.elapsed > 115 && state.spawnIndex % 13 === 0 ? "anchor" : state.elapsed > 72 && state.spawnIndex % 9 === 0 ? "runner" : "todo";
    const scale = role === "anchor" ? 1.9 : role === "runner" ? 0.72 : 1;
    state.enemies.push({
      x, y,
      radius: role === "anchor" ? 28 : role === "runner" ? 14 : 19,
      hp: profile.hp * scale,
      maxHp: profile.hp * scale,
      speed: profile.speed * (role === "anchor" ? 0.55 : role === "runner" ? 1.48 : 1),
      damage: profile.damage * (role === "anchor" ? 1.35 : 1),
      role,
      dead: false,
      hitFlash: 0,
      slow: 1,
      age: 0,
      seed: state.spawnIndex++
    });
  }

  function updatePlayer(dt) {
    let dx = (state.input.right ? 1 : 0) - (state.input.left ? 1 : 0);
    let dy = (state.input.down ? 1 : 0) - (state.input.up ? 1 : 0);
    state.player.moving = Boolean(dx || dy);
    if (dx || dy) {
      const length = Math.hypot(dx, dy) || 1;
      dx /= length; dy /= length;
      state.player.x = clamp(state.player.x + dx * state.player.speed * dt, FIELD.left + 28, FIELD.right - 28);
      state.player.y = clamp(state.player.y + dy * state.player.speed * dt, FIELD.top + 28, FIELD.bottom - 28);
      state.player.walkClock += dt;
      if (Math.abs(dx) > Math.abs(dy)) state.player.facing = dx > 0 ? 1 : 3;
      else state.player.facing = dy > 0 ? 0 : 2;
    }
    state.player.hitCooldown = Math.max(0, state.player.hitCooldown - dt);
  }

  function updateEnemies(dt) {
    state.enemies.forEach(function (enemy) {
      if (enemy.dead) { enemy.deadLife -= dt; return; }
      enemy.age += dt;
      enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
      const dx = state.player.x - enemy.x;
      const dy = state.player.y - enemy.y;
      const length = Math.hypot(dx, dy) || 1;
      enemy.x += dx / length * enemy.speed * enemy.slow * dt;
      enemy.y += dy / length * enemy.speed * enemy.slow * dt;
      enemy.slow = lerp(enemy.slow, 1, Math.min(1, dt * 3.6));
      if (length < enemy.radius + state.player.radius && state.player.hitCooldown <= 0) {
        state.player.hp -= enemy.damage;
        state.player.hitCooldown = 0.42;
        state.screenFlash = 0.14;
      }
    });
    if (state.player.hp <= 0) {
      state.nearDeaths += 1;
      state.player.hp = Math.ceil(state.player.maxHp * 0.55);
      state.player.x = W / 2;
      state.player.y = H / 2 + 20;
      state.enemies.forEach(function (enemy) {
        const dx = enemy.x - state.player.x;
        const dy = enemy.y - state.player.y;
        const len = Math.hypot(dx, dy) || 1;
        if (len < 220) { enemy.x += dx / len * 180; enemy.y += dy / len * 180; }
      });
      showCallout("EXPERIMENT SAFETY RESET", "容错接管：继续观察成长", "本实验不让死亡截断 25s / 60s / 100s 的感知节点。", "#ff668f");
    }
    state.enemies = state.enemies.filter(function (enemy) { return !enemy.dead || enemy.deadLife > 0; });
  }

  function updateEffects(dt) {
    state.lines.forEach(function (line) { line.life -= dt; });
    state.lines = state.lines.filter(function (line) { return line.life > 0; });
    state.trails.forEach(function (trail) {
      trail.life -= dt;
      trail.tick -= dt;
      if (trail.tick <= 0) {
        trail.tick = 0.34;
        state.enemies.forEach(function (enemy) {
          if (enemy.dead) return;
          const result = pointLineDistance(enemy.x, enemy.y, trail.x1, trail.y1, trail.x2, trail.y2);
          const guard = pointLineDistance(enemy.x, enemy.y, trail.guardX1, trail.guardY1, trail.guardX2, trail.guardY2);
          if (Math.min(result.distance, guard.distance) <= enemy.radius + trail.width * 0.55) {
            enemy.slow = Math.min(enemy.slow, 0.7);
            dealDamage(enemy, attackStats().damage * 0.13, "archive");
          }
        });
      }
    });
    state.trails = state.trails.filter(function (trail) { return trail.life > 0; }).slice(-52);
    state.retrievals.forEach(function (item) { item.life -= dt; });
    state.retrievals = state.retrievals.filter(function (item) { return item.life > 0; });
    state.bursts.forEach(function (item) { item.life -= dt; });
    state.bursts = state.bursts.filter(function (item) { return item.life > 0; });
    state.specialVfx.forEach(function (item) { item.life -= dt; });
    state.specialVfx = state.specialVfx.filter(function (item) { return item.life > 0; }).slice(-20);
    state.archiveFields.forEach(function (field) {
      field.life -= dt;
      field.tick -= dt;
      if (field.tick <= 0) {
        field.tick = 0.32;
        state.enemies.forEach(function (enemy) {
          if (enemy.dead || Math.hypot(enemy.x - field.x, enemy.y - field.y) > field.radius + enemy.radius) return;
          enemy.slow = Math.min(enemy.slow, 0.48);
          dealDamage(enemy, attackStats().damage * 0.22, "archive");
        });
      }
    });
    state.archiveFields = state.archiveFields.filter(function (field) { return field.life > 0; }).slice(-2);
    state.ultimateCooldown = Math.max(0, state.ultimateCooldown - dt);
    state.growthPulse = Math.max(0, state.growthPulse - dt);
    state.screenFlash = Math.max(0, state.screenFlash - dt);
    state.calloutTimer = Math.max(0, state.calloutTimer - dt);
    if (state.calloutTimer <= 0) refs.callout.classList.add("hidden");
  }

  function update(dt) {
    if (state.mode !== "battle") return;
    state.elapsed += dt;
    updatePlayer(dt);
    updateEnemies(dt);
    updateEffects(dt);

    const profile = spawnProfile();
    state.spawnTimer -= dt;
    while (state.spawnTimer <= 0) {
      spawnEnemy();
      state.spawnTimer += profile.interval;
    }

    state.attackTimer -= dt;
    if (state.attackTimer <= 0) {
      fireAttack(false);
      state.attackTimer += attackStats().cooldown;
    }
    const due = state.scheduled.filter(function (item) { return item.at <= state.elapsed; });
    state.scheduled = state.scheduled.filter(function (item) { return item.at > state.elapsed; });
    due.forEach(function () { fireAttack(true); });
    triggerMilestone();
    updateHud();
  }

  function drawSprite(image, x, y, width, height, alpha, rotation, filter, blend) {
    if (!image) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation || 0);
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.globalCompositeOperation = blend || "source-over";
    if (filter) ctx.filter = filter;
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
    ctx.restore();
  }

  function drawLineSprite(image, line, alpha, widthScale, filter) {
    const dx = line.x2 - line.x1;
    const dy = line.y2 - line.y1;
    const length = Math.hypot(dx, dy) || 1;
    const angle = Math.atan2(dy, dx);
    const height = Math.max(36, line.width * (widthScale || 7));
    drawSprite(image, line.x1 + dx / 2, line.y1 + dy / 2, length + 28, height, alpha, angle, filter);
  }

  function drawBackground() {
    if (assets.bg) ctx.drawImage(assets.bg, 0, 0, W, H);
    else { ctx.fillStyle = "#071025"; ctx.fillRect(0, 0, W, H); }
    ctx.save();
    ctx.globalAlpha = 0.26;
    const gradient = ctx.createRadialGradient(state.player.x, state.player.y, 0, state.player.x, state.player.y, 390);
    gradient.addColorStop(0, "rgba(34,118,165,.36)");
    gradient.addColorStop(1, "rgba(2,5,16,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function drawTrails() {
    state.trails.forEach(function (trail) {
      const alpha = clamp(trail.life / Math.max(0.1, trail.maxLife), 0, 1);
      const line = trail;
      if (assets.ink) {
        drawLineSprite(assets.ink, line, alpha * 0.24, 4.6, "blur(9px) saturate(1.6)");
        drawLineSprite(assets.ink, line, alpha * 0.58, 3.3, "saturate(1.3)");
      } else {
        drawLineSprite(assets.laserCyan || assets.laser, line, alpha * 0.45, 8, "blur(5px)");
      }
    });
  }

  function drawLasers() {
    state.lines.forEach(function (line) {
      const alpha = clamp(line.life / line.maxLife, 0, 1);
      const image = state.modules.copy > 0 ? assets.laser : state.modules.archive > 0 ? assets.laserCyan || assets.laser : assets.laserWhite || assets.laser;
      drawLineSprite(image, line, Math.min(1, alpha + 0.12), 6.4, "contrast(1.28) saturate(1.3) drop-shadow(0 0 6px rgba(255,215,95,.54))");
    });
  }

  function drawRetrievals() {
    state.retrievals.forEach(function (item) {
      const progress = 1 - item.life / item.maxLife;
      const alpha = Math.sin(progress * Math.PI);
      const trail = item.trail;
      const head = clamp(progress * 1.22, 0, 1);
      const tail = clamp(head - 0.3, 0, 1);
      const pulseLine = {
        x1: lerp(trail.x1, trail.x2, tail),
        y1: lerp(trail.y1, trail.y2, tail),
        x2: lerp(trail.x1, trail.x2, head),
        y2: lerp(trail.y1, trail.y2, head),
        width: trail.width * 0.62
      };
      drawLineSprite(assets.laserMagenta || assets.laser, pulseLine, alpha * 0.5, 11, "blur(9px)");
      drawLineSprite(assets.laserMagenta || assets.laser, pulseLine, alpha * 0.96, 6.2, "contrast(1.3)");
      const x = pulseLine.x2;
      const y = pulseLine.y2;
      drawSprite(assets.branchMagenta || assets.branch, x, y, 76, 76, alpha, progress * 0.45, "drop-shadow(0 0 8px #ff65dc)");
      drawSprite(assets.impactWhite || assets.impact, item.x, item.y, 66 + progress * 28, 66 + progress * 28, alpha, progress * 0.3, "drop-shadow(0 0 8px #ffffff)");
    });
  }

  function atlasCell(col, row, x, y, size, alpha) {
    if (!assets.atlas) return;
    const cellW = assets.atlas.width / 4;
    const cellH = assets.atlas.height / 4;
    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.drawImage(assets.atlas, col * cellW, row * cellH, cellW, cellH, x - size / 2, y - size / 2, size, size);
    ctx.restore();
  }

  function drawEnemies() {
    state.enemies.forEach(function (enemy) {
      if (enemy.dead) return;
      const size = enemy.radius * 3.2;
      const col = enemy.role === "anchor" ? 2 : enemy.role === "runner" ? 1 : 0;
      const row = enemy.role === "anchor" ? 1 : 0;
      if (enemy.hitFlash > 0) drawSprite(assets.impactWhite || assets.impact, enemy.x, enemy.y, size + 24, size + 24, enemy.hitFlash / 0.11, 0, "drop-shadow(0 0 8px white)");
      atlasCell(col, row, enemy.x, enemy.y, size, 0.96);
      ctx.save();
      ctx.fillStyle = "rgba(3,7,16,.88)";
      ctx.fillRect(enemy.x - 28, enemy.y - enemy.radius - 14, 56, 6);
      ctx.fillStyle = enemy.role === "anchor" ? "#ff65dc" : "#68efff";
      ctx.fillRect(enemy.x - 27, enemy.y - enemy.radius - 13, 54 * clamp(enemy.hp / enemy.maxHp, 0, 1), 4);
      ctx.restore();
    });
  }

  function drawPart(cell, x, y, size, alpha) {
    if (!assets.parts) return;
    ctx.drawImage(assets.parts, cell * 128, 0, 128, 128, x - size / 2, y - size / 2, size, size);
  }

  function drawAtlasSprite(image, columns, rows, cell, x, y, width, height, alpha, rotation, blend, filter) {
    if (!image) return;
    const cached = image === assets.markerAttacks ? assets.attackCells
      : image === assets.markerPerson ? assets.personCells
      : image === assets.markerWeapons ? assets.weaponCells
      : null;
    const source = cached && cached[cell];
    const cellWidth = source ? source.width : image.width / columns;
    const cellHeight = source ? source.height : image.height / rows;
    const column = source ? 0 : cell % columns;
    const row = source ? 0 : Math.floor(cell / columns);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation || 0);
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.globalCompositeOperation = blend || "source-over";
    if (filter) ctx.filter = filter;
    ctx.drawImage(source || image, column * cellWidth, row * cellHeight, cellWidth, cellHeight, -width / 2, -height / 2, width, height);
    ctx.restore();
  }

  function drawSpecialVfx() {
    state.archiveFields.forEach(function (field) {
      const ratio = clamp(field.life / field.maxLife, 0, 1);
      const pulse = 0.12 + Math.sin(state.elapsed * 7) * 0.035;
      drawAtlasSprite(assets.markerAttacks, 2, 2, 3, field.x, field.y, field.radius * 2.12, field.radius * 2.12, pulse * Math.min(1, ratio * 2.5), state.elapsed * 0.045, "screen", "saturate(1.2)");
    });
    state.specialVfx.forEach(function (item) {
      const progress = 1 - item.life / item.maxLife;
      const alpha = Math.sin(progress * Math.PI);
      if (item.type === "archiveUltimate") {
        const size = 610 + progress * 260;
        drawAtlasSprite(assets.markerAttacks, 2, 2, 3, item.x, item.y, size, size, (1 - progress) * 0.72, item.rotation - progress * 0.12, "screen", "saturate(1.3)");
      }
    });
  }

  function weaponDirection(angle) {
    const turn = Math.PI * 2;
    const normalized = (angle % turn + turn) % turn;
    const cell = Math.round(normalized / (Math.PI / 4)) % 8;
    const baseAngle = cell * Math.PI / 4;
    let correction = angle - baseAngle;
    if (correction > Math.PI) correction -= turn;
    if (correction < -Math.PI) correction += turn;
    return { cell, correction };
  }

  function drawEmitterComponent(node) {
    if (!state.component || !assets.partCells) return;
    const rule = componentMountRule(state.component);
    if (!rule || rule.owner === "player") return;
    if (rule === PHYSICAL_MOUNTS.amountComponent && !node.id.endsWith("-1")) return;
    const cell = state.component.id === "tip" ? 3 : state.component.id === "body" ? 4 : 5;
    const forwardX = Math.cos(node.aimAngle);
    const forwardY = Math.sin(node.aimAngle);
    const socketOffset = rule.socket === "nib" ? 23 : rule.socket === "tail" ? -22 : rule.socket === "duplicate-emitter" ? -17 : 0;
    const x = node.x + forwardX * socketOffset;
    const y = node.y + forwardY * socketOffset;
    const size = rule.socket === "nib" ? 34 : rule.socket === "tail" ? 34 : 30;
    drawSprite(
      assets.partCells[cell],
      x,
      y,
      size,
      size,
      0.92,
      node.aimAngle + Math.PI,
      "drop-shadow(0 0 6px " + state.component.color + ")"
    );
  }

  function drawBuildNode(node) {
    if (node.type === "emitter") {
      const direction = weaponDirection(node.aimAngle);
      const cells = node.family === "copy"
        ? assets.weaponCopyCells
        : node.family === "archive"
        ? assets.weaponArchiveCells
        : assets.weaponCells;
      const glow = node.family === "copy"
        ? "rgba(255,215,95,.72)"
        : node.family === "archive"
        ? "rgba(104,239,255,.72)"
        : "rgba(255,255,255,.42)";
      if (cells && cells[direction.cell]) {
        drawSprite(cells[direction.cell], node.x, node.y, node.size, node.size, node.family === "archive" && state.modules.copy ? 0.9 : 0.98, direction.correction, "drop-shadow(0 0 9px " + glow + ")");
        drawEmitterComponent(node);
      }
      return;
    }
    if (node.type === "printer-dock" && assets.printerRigCells) {
      const cell = node.hybrid ? 9 : 8;
      drawSprite(
        assets.printerRigCells[cell],
        node.x,
        node.y,
        node.width,
        node.height,
        0.98,
        node.rotation || 0,
        "drop-shadow(0 3px 4px rgba(0,0,0,.56))"
      );
      return;
    }
    if (node.type === "controller" && assets.printerRigCells) {
      const cell = node.family === "copy" ? node.level - 1 : 4 + node.level - 1;
      const filter = node.family === "copy"
        ? "brightness(" + (0.84 + node.intensity * 0.42) + ") drop-shadow(0 0 " + (4 + node.level * 2) + "px rgba(255,215,95," + node.intensity + "))"
        : "brightness(" + (0.84 + node.intensity * 0.42) + ") drop-shadow(0 0 " + (4 + node.level * 2) + "px rgba(104,239,255," + node.intensity + "))";
      drawSprite(assets.printerRigCells[cell], node.x, node.y, node.width, node.height, 0.98, node.rotation || 0, filter);
      return;
    }
    if (node.type === "worn-component" && assets.partCells) {
      const cell = 5;
      const color = node.component.color || "#ffffff";
      drawSprite(assets.partCells[cell], node.x, node.y, node.size, node.size, 0.98, node.rotation || 0, "drop-shadow(0 0 9px " + color + ")");
    }
  }

  function drawRiggedRouteGlow(image, level, x, y, width, height, color, growthScale) {
    if (!image || level <= 0) return;
    const coreAlpha = [0, 0.54, 0.68, 0.82, 0.96][level] || 0.96;
    const bloomAlpha = [0, 0.12, 0.18, 0.25, 0.34][level] || 0.34;
    const bloomSize = 1.015 + level * 0.008 + (growthScale - 1) * 0.22;
    drawSprite(
      image,
      x,
      y,
      width * bloomSize,
      height * bloomSize,
      bloomAlpha,
      0,
      "blur(" + (2 + level * 0.9) + "px) brightness(1.8) saturate(1.45) drop-shadow(0 0 " + (3 + level * 2) + "px " + color + ")",
      "screen"
    );
    drawSprite(
      image,
      x,
      y,
      width,
      height,
      coreAlpha,
      0,
      "brightness(" + (1.04 + level * 0.11) + ") saturate(" + (1.08 + level * 0.08) + ") drop-shadow(0 0 " + (2 + level * 1.25) + "px " + color + ")",
      "screen"
    );
  }

  function drawRiggedPlayerBody() {
    const player = state.player;
    const visual = assets.riggedPersonVisuals && assets.riggedPersonVisuals[player.facing];
    if (!visual || !visual.base) return false;
    const walkFrame = player.moving ? Math.floor(player.walkClock * 8) % 2 : 0;
    const groundedBob = player.moving && walkFrame ? 1.25 : 0;
    const growthScale = state.growthPulse > 0
      ? 1 + Math.sin((1.2 - state.growthPulse) * 12) * 0.045 * (state.growthPulse / 1.2)
      : 1;
    const height = 108 * growthScale;
    const width = height * visual.base.width / Math.max(1, visual.base.height);
    const x = player.x;
    const y = player.y - 6 + groundedBob;
    drawSprite(visual.base, x, y, width, height, 1, 0, "drop-shadow(0 4px 3px rgba(0,0,0,.58))");
    drawRiggedRouteGlow(visual.copy, state.modules.copy, x, y, width, height, "#ffd75f", growthScale);
    drawRiggedRouteGlow(visual.archive, state.modules.archive, x, y, width, height, "#68efff", growthScale);
    return true;
  }

  function drawPlayerBody() {
    const player = state.player;
    if (featureFlags.embodiedGrowthPass && (state.modules.copy || state.modules.archive) && drawRiggedPlayerBody()) return;
    if (assets.markerPerson) {
      const walkFrame = player.moving ? Math.floor(player.walkClock * 8) % 2 : 0;
      const cell = walkFrame * 4 + player.facing;
      const groundedBob = player.moving ? (walkFrame ? 1.5 : 0) : 0;
      drawAtlasSprite(assets.markerPerson, 4, 2, cell, player.x, player.y - 5 + groundedBob, 94, 94, 1, 0, "source-over", "drop-shadow(0 3px 2px rgba(0,0,0,.42))");
    } else {
      atlasCell(0, 0, player.x, player.y + 5, 60, 1);
    }
  }

  function drawLayoutDebugger(nodes) {
    if (!layoutDebug) return;
    ctx.save();
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 7]);
    [BUILD_LAYOUT.bodySafetyRadius, BUILD_LAYOUT.baseOrbit, BUILD_LAYOUT.archiveOrbit[4], 104].forEach(function (radius, index) {
      ctx.strokeStyle = ["#ff668f", "#f4f5ee", "#68efff", "#ff65dc"][index];
      ctx.globalAlpha = index === 0 ? 0.8 : 0.42;
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    nodes.forEach(function (node) {
      ctx.fillStyle = node.family === "copy" ? "#ffd75f" : node.family === "archive" ? "#68efff" : node.family === "retrieval" ? "#ff65dc" : "#ffffff";
      ctx.globalAlpha = 0.9;
      ctx.fillRect(node.x - 3, node.y - 3, 6, 6);
      if (node.type === "emitter") {
        const muzzle = muzzlePoint(node);
        const path = emitterAttackPath(node, 82);
        ctx.strokeStyle = ctx.fillStyle;
        ctx.beginPath();
        ctx.moveTo(path.x1, path.y1);
        ctx.lineTo(path.x2, path.y2);
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(muzzle.x - 2, muzzle.y - 2, 4, 4);
      } else if (node.width && node.height) {
        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate(node.rotation || 0);
        ctx.strokeStyle = ctx.fillStyle;
        ctx.globalAlpha = 0.92;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(-node.width / 2, -node.height / 2, node.width, node.height);
        ctx.restore();
      }
    });
    ctx.restore();
  }

  function drawPlayer() {
    const player = state.player;
    const pulseScale = state.growthPulse > 0 ? 1 + Math.sin((1.2 - state.growthPulse) * 12) * 0.08 * (state.growthPulse / 1.2) : 1;
    if (state.modules.copy) drawSprite(assets.waveCopy || assets.wave, player.x, player.y, 94 * pulseScale, 94 * pulseScale, 0.09 + state.modules.copy * 0.018, state.elapsed * 0.08, "blur(1px) drop-shadow(0 0 6px #ffd75f)", "screen");
    if (state.modules.archive) drawSprite(assets.waveArchive || assets.wave, player.x, player.y, 100 * pulseScale, 100 * pulseScale, 0.09 + state.modules.archive * 0.018, -state.elapsed * 0.07, "blur(1px) drop-shadow(0 0 6px #68efff)", "screen");
    const nodes = buildVisualNodes(player.angle);
    const displayList = nodes.map(function (node) { return { y: node.y, kind: "node", node }; });
    displayList.push({ y: player.y, kind: "player" });
    displayList.sort(function (a, b) { return a.y - b.y; });
    displayList.forEach(function (item) {
      if (item.kind === "player") drawPlayerBody();
      else drawBuildNode(item.node);
    });
    drawLayoutDebugger(nodes);
  }

  function drawBursts() {
    state.bursts.forEach(function (burst) {
      const progress = 1 - burst.life / burst.maxLife;
      const image = burst.color === "magenta" ? assets.branchMagenta || assets.branch : burst.color === "cyan" ? assets.laserCyan || assets.impact : assets.impact;
      drawSprite(image, burst.x, burst.y, 48 + progress * 54, 48 + progress * 54, (1 - progress) * 0.86, progress * 0.4, burst.color === "cyan" ? "hue-rotate(135deg)" : "");
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    if (state.mode !== "intro" && state.mode !== "recap") {
      drawTrails();
      drawSpecialVfx();
      drawEnemies();
      drawLasers();
      drawRetrievals();
      drawBursts();
      drawPlayer();
      if (state.screenFlash > 0) {
        ctx.save();
        ctx.globalAlpha = Math.min(0.22, state.screenFlash);
        ctx.fillStyle = state.modules.copy && state.modules.archive ? "#ff65dc" : "#ffffff";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
    }
  }

  function finishRun() {
    if (state.ended) return;
    state.ended = true;
    state.mode = "recap";
    refs.hud.classList.add("hidden");
    refs.rail.classList.add("hidden");
    refs.decision.classList.add("hidden");
    refs.callout.classList.add("hidden");
    const evolution = state.evolution.filter(function (item, index, list) { return list.indexOf(item) === index; }).slice(0, 8);
    refs.evolution.innerHTML = evolution.map(function (name, index) {
      return '<div class="evolution-step"><small>0' + (index + 1) + ' · ' + (index === 0 ? "起点" : "战斗中生长") + '</small><b>' + name + '</b></div>';
    }).join("");
    const damageRows = [
      { id: "base", label: "基础白线", color: "#f4f5ee" },
      { id: "copy", label: "复写黄线", color: "#ff9f43" },
      { id: "archive", label: "留档青墨", color: "#68efff" },
      { id: "retrieval", label: "调阅回读", color: "#ff65dc" }
    ];
    const total = damageRows.reduce(function (sum, row) { return sum + state.stats[row.id]; }, 0) || 1;
    refs.damage.innerHTML = damageRows.map(function (row) {
      const ratio = state.stats[row.id] / total;
      return '<div class="damage-row" style="--row-color:' + row.color + '"><span>' + row.label + '</span><div class="damage-bar"><i style="width:' + Math.max(2, ratio * 100) + '%"></i></div><b>' + Math.round(ratio * 100) + '%</b></div>';
    }).join("");
    const hybrid = state.modules.copy > 0 && state.modules.archive > 0;
    const copyUltimate = state.modules.copy >= 4;
    const archiveUltimate = state.modules.archive >= 4;
    refs.buildName.textContent = copyUltimate ? "全页批注者" : archiveUltimate ? "整页归档者" : hybrid ? (featureFlags.workflowFusionPass ? "调阅线网" : "双流程并行") : state.modules.copy ? "多轮复写器" : "战场留档器";
    refs.buildSummary.textContent = copyUltimate
      ? "你放弃交叉流程，把四次机制选择全部压进即时动作；聚焦校样面会沿当前瞄准方向扩大命中范围，并用少量四散线束补足外围。"
      : archiveUltimate
      ? "你放弃即时复写，把四次机制选择全部压进历史状态；背负墨仓会周期接管大片战场。"
      : hybrid
      ? (featureFlags.workflowFusionPass ? "当前动作不再只是盖在历史状态上：黄线与青墨交叉后，会产生一条新的洋红回读结果。" : "两条路线同时存在，但本对照版本不提供非线性交互。")
      : state.modules.copy ? "你把所有选择压向即时线数与攻击轮次；下一局可以尝试让这些线去读取战场上的旧墨迹。" : "你把所有选择压向留场数量与持续覆盖；下一局可以尝试用复写线主动触发这些档案。";
    refs.unchosen.innerHTML = hybrid
      ? '<div class="unchosen-route"><b>纯复写 Lv.4 · 全页批注</b>失去调阅，但获得正面宽幅聚焦与外围四散清扫。</div><div class="unchosen-route"><b>纯留档 Lv.4 · 整页归档</b>失去调阅，但获得大范围持续墨场接管。</div>'
      : '<div class="unchosen-route"><b>让另一条路线加入</b>一旦暖黄当前动作穿过冷青历史状态，组合就不再只是两套伤害相加。</div>';
    refs.recap.classList.remove("hidden");
  }

  function startRun() {
    state = createState();
    state.mode = "battle";
    if (Number.isInteger(debugFacing) && debugFacing >= 0 && debugFacing <= 3) state.player.facing = debugFacing;
    if (debugStage === "copy" || debugStage === "copy1") {
      state.elapsed = 31;
      state.milestoneIndex = 1;
      state.choiceIndex = 1;
      state.modules.copy = 1;
      state.moduleOrder = ["copy"];
      state.evolution.push("复写 Lv.1");
    } else if (debugStage === "copy2" || debugStage === "copy3") {
      const level = Number(debugStage.slice(-1));
      state.elapsed = level === 2 ? 80 : 120;
      state.milestoneIndex = level + 1;
      state.choiceIndex = level;
      state.modules.copy = level;
      state.moduleOrder = Array(level).fill("copy");
      state.evolution.push("复写 Lv." + level);
    } else if (debugStage === "component") {
      state.elapsed = 61;
      state.milestoneIndex = 2;
      state.choiceIndex = 1;
      state.modules.copy = 1;
      state.moduleOrder = ["copy"];
      state.evolution.push("复写 Lv.1");
    } else if (debugStage === "archive" || debugStage === "archive2") {
      state.elapsed = 66;
      state.milestoneIndex = 2;
      state.choiceIndex = 1;
      state.modules.archive = 2;
      state.moduleOrder = ["archive", "archive"];
      state.component = { id: "tail", name: "长效笔尾", color: "#68efff", apply: { duration: 1.5 } };
      state.evolution.push("留档 Lv.2", "长效笔尾");
    } else if (debugStage === "archive1" || debugStage === "archive3") {
      const level = Number(debugStage.slice(-1));
      state.elapsed = level === 1 ? 31 : 120;
      state.milestoneIndex = level + 1;
      state.choiceIndex = level;
      state.modules.archive = level;
      state.moduleOrder = Array(level).fill("archive");
      state.evolution.push("留档 Lv." + level);
    } else if (debugStage === "hybrid") {
      state.elapsed = 121;
      state.milestoneIndex = 4;
      state.choiceIndex = 3;
      state.modules.copy = 2;
      state.modules.archive = 1;
      state.moduleOrder = ["copy", "archive", "copy"];
      state.component = { id: "body", name: "数量笔身", color: "#ff65dc", apply: { amount: 1 } };
      state.evolution.push("复写 Lv.1", "数量笔身", "留档 Lv.1", "调阅回路", "复写 Lv.2");
    } else if (debugStage === "copy4") {
      state.elapsed = 160;
      state.milestoneIndex = 5;
      state.choiceIndex = 4;
      state.modules.copy = 4;
      state.moduleOrder = ["copy", "copy", "copy", "copy"];
      state.component = { id: "tip", name: "穿透笔头", color: "#ffd75f", apply: { pierce: 2 } };
      state.evolution.push("复写 Lv.1", "穿透笔头", "复写 Lv.2", "复写 Lv.3", "复写 Lv.4 · 全页批注");
    } else if (debugStage === "archive4") {
      state.elapsed = 160;
      state.milestoneIndex = 5;
      state.choiceIndex = 4;
      state.modules.archive = 4;
      state.moduleOrder = ["archive", "archive", "archive", "archive"];
      state.component = { id: "tail", name: "长效笔尾", color: "#68efff", apply: { duration: 1.5 } };
      state.evolution.push("留档 Lv.1", "长效笔尾", "留档 Lv.2", "留档 Lv.3", "留档 Lv.4 · 整页归档");
    } else if (debugStage === "recap") {
      state.elapsed = 180;
      state.milestoneIndex = 6;
      state.choiceIndex = 3;
      state.modules.copy = 2;
      state.modules.archive = 1;
      state.moduleOrder = ["copy", "archive", "copy"];
      state.component = { id: "body", name: "数量笔身", color: "#ff65dc", apply: { amount: 1 } };
      state.kills = 186;
      state.stats = { base: 1820, copy: 2460, archive: 740, retrieval: 1160 };
      state.retrievalTriggers = 24;
      state.evolution.push("复写 Lv.1", "数量笔身", "留档 Lv.1", "调阅回路", "复写 Lv.2");
    }
    state.lastAt = performance.now();
    refs.intro.classList.add("hidden");
    refs.recap.classList.add("hidden");
    refs.hud.classList.remove("hidden");
    refs.rail.classList.remove("hidden");
    updateHud();
    showCallout("BASELINE READ", "先看懂普通马克笔", "自动瞄准最近目标；未异化时只有中性的白色直线切割。", "#f4f5ee");
    if (debugStage === "component") window.setTimeout(openComponentChoice, 0);
    if (debugStage === "recap") window.setTimeout(finishRun, 0);
  }

  function frame(now) {
    const rawDt = Math.min(0.05, Math.max(0, (now - state.lastAt) / 1000));
    state.lastAt = now;
    update(rawDt * timeScale);
    draw();
    if (!freezeFrame || state.mode === "intro") requestAnimationFrame(frame);
  }

  function keyChange(event, down) {
    const key = event.key.toLowerCase();
    if (["w", "arrowup"].includes(key)) state.input.up = down;
    if (["s", "arrowdown"].includes(key)) state.input.down = down;
    if (["a", "arrowleft"].includes(key)) state.input.left = down;
    if (["d", "arrowright"].includes(key)) state.input.right = down;
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) event.preventDefault();
  }

  window.addEventListener("keydown", function (event) { keyChange(event, true); });
  window.addEventListener("keyup", function (event) { keyChange(event, false); });
  refs.start.addEventListener("click", startRun);
  refs.replay.addEventListener("click", startRun);
  document.querySelectorAll("[data-variant]").forEach(function (button) {
    button.classList.toggle("active", button.dataset.variant === variant);
    button.addEventListener("click", function () {
      const params = new URLSearchParams(location.search);
      params.set("variant", button.dataset.variant);
      location.search = params.toString();
    });
  });

  loadAssets();
  if (query.get("skipIntro") === "1") startRun();
  requestAnimationFrame(frame);
})();
