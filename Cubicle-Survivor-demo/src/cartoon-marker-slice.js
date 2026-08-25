(function () {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const TOTAL = 30;
  const ASSET_ROOT = "assets/cartoon-marker-slice/";
  const PLAYER_BODY_HEIGHT = 132;
  const PLAYER_ATLAS_CELL_WIDTH = 420;
  const PLAYER_ATLAS_CELL_HEIGHT = 620;
  const PLAYER_ATLAS_VISIBLE_HEIGHT = 560;
  const PLAYER_ATLAS_BASELINE = 590;
  const PLAYER_ATLAS_DRAW_HEIGHT = PLAYER_BODY_HEIGHT * PLAYER_ATLAS_CELL_HEIGHT / PLAYER_ATLAS_VISIBLE_HEIGHT;
  const PLAYER_FOOT_OFFSET_Y = 44;
  const MARKER_WEAPON_WIDTH = 78;
  const MARKER_WEAPON_PIVOT_X = 34;
  const MARKER_WEAPON_PIVOT_Y = -8;
  const MARKER_MUZZLE_DISTANCE = MARKER_WEAPON_WIDTH - MARKER_WEAPON_PIVOT_X;
  const debugEnemyPose = new URLSearchParams(window.location.search).get("enemyPose");
  const debugPlayerPose = new URLSearchParams(window.location.search).get("playerPose");
  const debugEnemyFacing = new URLSearchParams(window.location.search).get("enemyFacing") === "left" ? -1 : 1;
  const debugSlamProbe = new URLSearchParams(window.location.search).get("slamProbe") === "1";

  const ui = {
    start: document.getElementById("startPanel"),
    upgrade: document.getElementById("upgradePanel"),
    complete: document.getElementById("completePanel"),
    startButton: document.getElementById("startButton"),
    upgradeButton: document.getElementById("upgradeButton"),
    restartButton: document.getElementById("restartButton"),
    remaining: document.getElementById("remaining"),
    progressFill: document.getElementById("progressFill"),
    progressState: document.getElementById("progressState"),
    health: document.getElementById("health"),
    buildName: document.getElementById("buildName"),
    buildChip: document.getElementById("buildChip"),
    controls: document.getElementById("controls")
  };

  const images = {};
  const assetList = {
    office: "office-arena-v1.webp",
    playerBody: "../cartoon-character-system/neutral-worker-walk-v1.png",
    markerRigBack: "../cartoon-character-system/marker-rig-back-v1.png",
    markerRigFront: "../cartoon-character-system/marker-rig-front-v1.png",
    markerWeapon: "marker-weapon-v2.png",
    backlog: "backlog-enemy-actions-v2.png",
    backlogWalk: "backlog-enemy-walk-v3.png",
    backlogSlam: "backlog-enemy-slam-v3.png",
    emailActions: "urgent-email-enemy-actions-v2.png",
    emailRun: "urgent-email-run-v3.png",
    emailDash: "urgent-email-dash-v3.png"
  };
  const playerDirectionRows = { down: 0, right: 1, up: 2, left: 3 };
  const enemyActionAtlas = {
    cell: 320,
    baseline: 296,
    frames: { move: 0, attack: 1, hit: 2, defeat: 3 },
    backlog: { referenceHeight: 260, runtimeHeight: 100 },
    backlogWalk: { referenceHeight: 260, runtimeHeight: 100, frames: 4 },
    backlogSlam: { referenceHeight: 260, runtimeHeight: 100, frames: 5 },
    email: { referenceHeight: 247, runtimeHeight: 88 },
    emailRun: { referenceHeight: 262, runtimeHeight: 88, frames: 4 },
    emailDash: { referenceHeight: 170, runtimeHeight: 88, frames: 5 }
  };

  let state;
  let lastTime = 0;
  let animationId = 0;
  let audio = null;
  const keys = new Set();
  let pointer = null;

  function loadAssets() {
    return Promise.all(Object.keys(assetList).map(function (key) {
      return new Promise(function (resolve, reject) {
        const img = new Image();
        img.onload = function () { images[key] = img; resolve(); };
        img.onerror = reject;
        img.src = ASSET_ROOT + assetList[key];
      });
    }));
  }

  function makeState() {
    return {
      phase: "idle",
      time: 0,
      spawnTimer: .4,
      spawned: 0,
      killed: 0,
      upgraded: false,
      upgradeShown: false,
      completeAt: 0,
      shake: 0,
      flash: 0,
      player: { x: W * .5, y: H * .54, r: 27, hp: 100, speed: 228, attack: .3, recoil: 0, hit: 0, face: 1, aimAngle: 0, bodyDirection: "down", moving: false },
      enemies: [],
      attacks: [],
      particles: [],
      papers: []
    };
  }

  function reset() {
    state = makeState();
    ui.start.hidden = false;
    ui.upgrade.hidden = true;
    ui.complete.hidden = true;
    ui.progressState.textContent = "待处理";
    ui.remaining.textContent = TOTAL;
    ui.progressFill.style.width = "0%";
    ui.health.textContent = "100";
    ui.buildName.textContent = "单线贯穿";
    ui.buildChip.classList.remove("upgraded");
    ui.controls.textContent = "WASD 移动 · 自动画线";
  }

  function applyDebugEnemyPose() {
    const backlogSequenceMatch = /^backlog-(walk|slam)-([0-4])$/.exec(debugEnemyPose || "");
    if (backlogSequenceMatch) {
      const sequence = backlogSequenceMatch[1];
      const frame = Number(backlogSequenceMatch[2]);
      if ((sequence === "walk" && frame > 3) || (sequence === "slam" && frame > 4)) return;
      state.phase = "debug-enemy";
      state.time = .17;
      state.player.x = 280;
      state.player.y = H * .56;
      state.enemies = [{
        id: 1, type: "backlog", x: W * .58, y: H * .56, vx: 48 * debugEnemyFacing, vy: 0,
        r: 31, hp: 38, maxHp: 38, speed: 45, hit: 0, squash: 0,
        dashIn: 99, dashTime: 0, telegraph: 0, slamTime: 0, slamCooldown: 99, slamHit: false,
        dead: false, deathTime: 0, debugSequence: sequence, debugFrame: frame
      }];
      ui.start.hidden = true;
      ui.upgrade.hidden = true;
      ui.complete.hidden = true;
      document.body.dataset.debugEnemyPose = debugEnemyPose;
      return;
    }
    const sequenceMatch = /^email-(run|dash)-([0-4])$/.exec(debugEnemyPose || "");
    if (sequenceMatch) {
      const sequence = sequenceMatch[1];
      const frame = Number(sequenceMatch[2]);
      if ((sequence === "run" && frame > 3) || (sequence === "dash" && frame > 4)) return;
      state.phase = "debug-enemy";
      state.time = .17;
      state.player.x = 280;
      state.player.y = H * .56;
      state.enemies = [{
        id: 1, type: "email", x: W * .58, y: H * .56, vx: 60 * debugEnemyFacing, vy: 0,
        r: 25, hp: 23, maxHp: 23, speed: 78, hit: 0, squash: 0,
        dashIn: 99, dashTime: 0, telegraph: 0, slamTime: 0, slamCooldown: 99, slamHit: false, dead: false, deathTime: 0,
        debugSequence: sequence, debugFrame: frame
      }];
      ui.start.hidden = true;
      ui.upgrade.hidden = true;
      ui.complete.hidden = true;
      document.body.dataset.debugEnemyPose = debugEnemyPose;
      return;
    }
    const match = /^(backlog|email)-(move|attack|hit|defeat)$/.exec(debugEnemyPose || "");
    if (!match) return;
    const type = match[1];
    const pose = match[2];
    state.phase = "debug-enemy";
    state.time = .17;
    state.player.x = 280;
    state.player.y = H * .56;
    state.enemies = [{
      id: 1,
      type: type,
      x: W * .58,
      y: H * .56,
      vx: pose === "move" ? 60 * debugEnemyFacing : 0,
      vy: 0,
      r: type === "email" ? 25 : 31,
      hp: pose === "defeat" ? 0 : 20,
      maxHp: type === "email" ? 23 : 38,
      speed: type === "email" ? 78 : 45,
      hit: pose === "hit" ? 1 : 0,
      squash: pose === "hit" ? .45 : 0,
      dashIn: 99,
      dashTime: 0,
      telegraph: pose === "attack" ? .72 : 0,
      slamTime: 0,
      slamCooldown: 99,
      slamHit: false,
      debugActionFrame: enemyActionAtlas.frames[pose],
      dead: pose === "defeat",
      deathTime: pose === "defeat" ? .22 : 0
    }];
    ui.start.hidden = true;
    ui.upgrade.hidden = true;
    ui.complete.hidden = true;
    ui.progressState.textContent = "动作检查";
    document.body.dataset.debugEnemyPose = debugEnemyPose;
  }

  function applyDebugPlayerPose() {
    const match = /^(down|right|up|left)-(idle|a|b)$/.exec(debugPlayerPose || "");
    if (!match) return;
    state.phase = "debug-player";
    state.time = match[2] === "a" ? .01 : match[2] === "b" ? .12 : 0;
    state.player.bodyDirection = match[1];
    state.player.moving = match[2] !== "idle";
    state.enemies = [];
    ui.start.hidden = true;
    ui.upgrade.hidden = true;
    ui.complete.hidden = true;
    document.body.dataset.debugPlayerPose = debugPlayerPose;
  }

  function applyDebugSlamProbe() {
    if (!debugSlamProbe || debugEnemyPose || debugPlayerPose) return;
    state.phase = "playing";
    state.spawned = TOTAL;
    state.killed = TOTAL - 1;
    state.upgradeShown = true;
    state.spawnTimer = 99;
    state.player.attack = 99;
    state.enemies = [{
      id: TOTAL, type: "backlog", x: state.player.x + 80, y: state.player.y, vx: 0, vy: 0,
      r: 31, hp: 999, maxHp: 999, speed: 45, hit: 0, squash: 0,
      dashIn: 99, dashTime: 0, telegraph: 0, slamTime: 0, slamCooldown: 0, slamHit: false,
      dead: false, deathTime: 0
    }];
    ui.start.hidden = true;
    ui.upgrade.hidden = true;
    ui.complete.hidden = true;
    ui.remaining.textContent = "1";
    ui.progressFill.style.width = ((TOTAL - 1) / TOTAL * 100) + "%";
    ui.progressState.textContent = "砸击判定检查";
    document.body.dataset.debugSlamProbe = "1";
  }

  function start() {
    ensureAudio();
    state = makeState();
    state.phase = "playing";
    ui.start.hidden = true;
    ui.complete.hidden = true;
    ui.progressState.textContent = "处理中";
    ui.controls.textContent = "邮件会冲刺 · 保持移动";
    tone(280, .06, "triangle", .035);
  }

  function ensureAudio() {
    if (!audio) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audio = new AudioContext();
    }
    if (audio && audio.state === "suspended") audio.resume();
  }

  function tone(freq, duration, type, gain, delay) {
    if (!audio) return;
    const startAt = audio.currentTime + (delay || 0);
    const osc = audio.createOscillator();
    const amp = audio.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, startAt);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * .72), startAt + duration);
    amp.gain.setValueAtTime(gain || .03, startAt);
    amp.gain.exponentialRampToValueAtTime(.0001, startAt + duration);
    osc.connect(amp).connect(audio.destination);
    osc.start(startAt);
    osc.stop(startAt + duration);
  }

  function spawnEnemy() {
    if (state.spawned >= TOTAL) return;
    const email = state.spawned > 4 && (state.spawned % 4 === 2 || state.spawned % 7 === 0);
    const side = Math.floor(Math.random() * 4);
    const margin = 70;
    let x, y;
    if (side === 0) { x = margin + Math.random() * (W - margin * 2); y = 112; }
    if (side === 1) { x = W - 72; y = 135 + Math.random() * (H - 250); }
    if (side === 2) { x = margin + Math.random() * (W - margin * 2); y = H - 90; }
    if (side === 3) { x = 72; y = 135 + Math.random() * (H - 250); }
    state.enemies.push({
      id: state.spawned + 1,
      type: email ? "email" : "backlog",
      x: x, y: y,
      vx: 0, vy: 0,
      r: email ? 25 : 31,
      hp: email ? 23 : 38,
      maxHp: email ? 23 : 38,
      speed: email ? 78 : 45,
      hit: 0,
      squash: 0,
      dashIn: email ? 1.5 + Math.random() * 1.6 : 99,
      dashTime: 0,
      telegraph: 0,
      slamTime: 0,
      slamCooldown: email ? 99 : .25 + Math.random() * .3,
      slamHit: false,
      dead: false,
      deathTime: 0
    });
    state.spawned += 1;
  }

  function update(dt) {
    if (!state) return;
    state.flash = Math.max(0, state.flash - dt * 3);
    state.shake = Math.max(0, state.shake - dt * 25);
    updateParticles(dt);
    if (state.phase !== "debug-enemy") updateEnemyDefeats(dt);
    if (state.phase !== "playing") return;
    state.time += dt;
    updatePlayer(dt);
    updateEnemies(dt);
    updateAttacks(dt);

    if (!state.upgradeShown && state.killed >= 11) showUpgrade();

    state.spawnTimer -= dt;
    if (state.spawned < TOTAL && state.spawnTimer <= 0) {
      spawnEnemy();
      state.spawnTimer = Math.max(.58, 1.02 - state.spawned * .011);
    }

    if (state.spawned === TOTAL && state.killed === TOTAL && !state.enemies.length) completeRun();
  }

  function updatePlayer(dt) {
    const p = state.player;
    let dx = 0, dy = 0;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) dx -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) dx += 1;
    if (keys.has("KeyW") || keys.has("ArrowUp")) dy -= 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) dy += 1;
    if (pointer) {
      const pdx = pointer.x - p.x;
      const pdy = pointer.y - p.y;
      if (Math.hypot(pdx, pdy) > 16) { dx += pdx; dy += pdy; }
    }
    const len = Math.hypot(dx, dy) || 1;
    p.moving = Boolean(dx || dy);
    if (dx || dy) {
      if (Math.abs(dx) > Math.abs(dy)) p.bodyDirection = dx < 0 ? "left" : "right";
      else p.bodyDirection = dy < 0 ? "up" : "down";
      p.x += dx / len * p.speed * dt;
      p.y += dy / len * p.speed * dt;
    }
    p.x = Math.max(95, Math.min(W - 95, p.x));
    p.y = Math.max(125, Math.min(H - 82, p.y));
    p.attack -= dt;
    p.recoil = Math.max(0, p.recoil - dt * 7);
    p.hit = Math.max(0, p.hit - dt * 4);
    if (p.attack <= 0 && state.enemies.length) fireMarker();
  }

  function nearestEnemy() {
    const p = state.player;
    let best = null;
    let bestD = Infinity;
    state.enemies.forEach(function (e) {
      const d = (e.x - p.x) ** 2 + (e.y - p.y) ** 2;
      if (!e.dead && d < bestD) { best = e; bestD = d; }
    });
    return best;
  }

  function fireMarker() {
    const p = state.player;
    const target = nearestEnemy();
    if (!target) return;
    const angle = Math.atan2(target.y - p.y, target.x - p.x);
    p.face = Math.cos(angle) >= 0 ? 1 : -1;
    p.aimAngle = angle;
    p.recoil = 1;
    p.attack = state.upgraded ? .57 : .68;
    const offsets = state.upgraded ? [-13, 13] : [0];
    offsets.forEach(function (offset, index) {
      const nx = -Math.sin(angle);
      const ny = Math.cos(angle);
      const x1 = p.x + Math.cos(angle) * MARKER_MUZZLE_DISTANCE + nx * offset;
      const y1 = p.y + MARKER_WEAPON_PIVOT_Y + Math.sin(angle) * MARKER_MUZZLE_DISTANCE + ny * offset;
      const length = 570;
      const x2 = x1 + Math.cos(angle) * length;
      const y2 = y1 + Math.sin(angle) * length;
      state.attacks.push({ x1, y1, x2, y2, life: .19, max: .19, color: index ? "#38bdc1" : "#f4ca4c" });
      hitLine(x1, y1, x2, y2, state.upgraded ? 21 : 25);
    });
    tone(state.upgraded ? 560 : 500, .07, "square", .018);
  }

  function hitLine(x1, y1, x2, y2, damage) {
    const vx = x2 - x1;
    const vy = y2 - y1;
    const len2 = vx * vx + vy * vy;
    state.enemies.forEach(function (e) {
      if (e.dead) return;
      const t = Math.max(0, Math.min(1, ((e.x - x1) * vx + (e.y - y1) * vy) / len2));
      const px = x1 + vx * t;
      const py = y1 + vy * t;
      const dist = Math.hypot(e.x - px, e.y - py);
      if (dist < e.r + 8) {
        e.hp -= damage;
        e.hit = 1;
        e.squash = 1;
        e.vx += vx / Math.sqrt(len2) * 85;
        e.vy += vy / Math.sqrt(len2) * 85;
        burst(e.x, e.y, e.type === "email" ? "#e65b67" : "#f4ca4c", 5);
        tone(180, .045, "triangle", .014);
        if (e.hp <= 0) killEnemy(e);
      }
    });
  }

  function killEnemy(e) {
    if (e.dead) return;
    e.dead = true;
    e.deathTime = .34;
    state.killed += 1;
    state.shake = Math.max(state.shake, 4);
    burst(e.x, e.y, e.type === "email" ? "#e65b67" : "#38bdc1", 12);
    state.papers.push({ x: e.x, y: e.y, tx: 96, ty: 356, t: 0, delay: Math.random() * .12 });
    tone(120, .09, "sawtooth", .025);
    updateHud();
  }

  function updateEnemies(dt) {
    const p = state.player;
    state.enemies.forEach(function (e) {
      if (e.dead) return;
      e.hit = Math.max(0, e.hit - dt * 5);
      e.squash = Math.max(0, e.squash - dt * 6);
      let speed = e.speed;
      const dx = p.x - e.x;
      const dy = p.y - e.y;
      const len = Math.hypot(dx, dy) || 1;
      if (e.type === "email") {
        e.dashIn -= dt;
        if (e.dashIn <= .42 && e.dashIn > 0) e.telegraph = 1 - e.dashIn / .42;
        if (e.dashIn <= 0 && e.dashTime <= 0) {
          e.dashTime = .48;
          e.dashIn = 2.2 + Math.random() * 1.2;
          e.telegraph = 0;
        }
        if (e.dashTime > 0) { e.dashTime -= dt; speed = 175; }
      } else {
        e.slamCooldown = Math.max(0, e.slamCooldown - dt);
        const slamRange = p.r + e.r + 32;
        if (e.slamTime > 0) {
          e.slamTime = Math.max(0, e.slamTime - dt);
          speed = 6;
          const slamProgress = 1 - e.slamTime / .68;
          if (!e.slamHit && slamProgress >= .62) {
            e.slamHit = true;
            if (Math.hypot(dx, dy) < slamRange && p.hit <= 0) {
              p.hp = Math.max(1, p.hp - 7);
              p.hit = .85;
              state.shake = 7;
              burst(p.x, p.y, "#f4ca4c", 7);
              ui.health.textContent = Math.ceil(p.hp);
              tone(75, .13, "sawtooth", .04);
            }
          }
          if (e.slamTime <= 0) e.slamCooldown = .48;
        } else if (Math.hypot(dx, dy) < slamRange && e.slamCooldown <= 0) {
          e.slamTime = .68;
          e.slamHit = false;
          speed = 6;
        }
      }
      e.vx += dx / len * speed * dt * 4;
      e.vy += dy / len * speed * dt * 4;
      const damping = Math.pow(.035, dt);
      e.vx *= damping;
      e.vy *= damping;
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      const touch = Math.hypot(p.x - e.x, p.y - e.y);
      if (e.type === "email" && touch < p.r + e.r - 6 && p.hit <= 0) {
        p.hp = Math.max(1, p.hp - 12);
        p.hit = .85;
        state.shake = 7;
        ui.health.textContent = Math.ceil(p.hp);
        tone(75, .13, "sawtooth", .04);
      }
    });
  }

  function updateEnemyDefeats(dt) {
    state.enemies.forEach(function (e) {
      if (e.dead) e.deathTime = Math.max(0, e.deathTime - dt);
    });
    state.enemies = state.enemies.filter(function (e) { return !e.dead || e.deathTime > 0; });
  }

  function updateAttacks(dt) {
    state.attacks.forEach(function (a) { a.life -= dt; });
    state.attacks = state.attacks.filter(function (a) { return a.life > 0; });
  }

  function burst(x, y, color, count) {
    for (let i = 0; i < count; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const s = 45 + Math.random() * 120;
      state.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: .35 + Math.random() * .35, max: .7, color, size: 3 + Math.random() * 6 });
    }
  }

  function updateParticles(dt) {
    state.particles.forEach(function (p) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.pow(.08, dt);
      p.vy *= Math.pow(.08, dt);
    });
    state.particles = state.particles.filter(function (p) { return p.life > 0; });
    state.papers.forEach(function (p) {
      p.delay -= dt;
      if (p.delay > 0) return;
      p.t = Math.min(1, p.t + dt * 2.2);
      const ease = 1 - (1 - p.t) ** 3;
      p.x += (p.tx - p.x) * ease * dt * 5;
      p.y += (p.ty - p.y) * ease * dt * 5;
    });
    state.papers = state.papers.filter(function (p) { return p.t < 1; });
  }

  function showUpgrade() {
    state.upgradeShown = true;
    state.phase = "upgrade";
    ui.upgrade.hidden = false;
    ui.progressState.textContent = "发现新方法";
    tone(420, .12, "triangle", .028);
    tone(660, .16, "triangle", .022, .08);
  }

  function applyUpgrade() {
    state.upgraded = true;
    state.phase = "playing";
    state.player.attack = .08;
    ui.upgrade.hidden = true;
    ui.buildName.textContent = "复写 · 双线贯穿";
    ui.buildChip.classList.add("upgraded");
    ui.progressState.textContent = "双线处理中";
    ui.controls.textContent = "复写已生效 · 每次多画一条";
    tone(520, .12, "square", .025);
    tone(780, .16, "triangle", .02, .07);
  }

  function completeRun() {
    if (state.phase === "complete") return;
    state.phase = "complete";
    state.completeAt = state.time;
    state.attacks = [];
    state.particles = [];
    state.papers = [];
    state.flash = 1;
    state.shake = 12;
    ui.progressState.textContent = "已归档";
    ui.controls.textContent = "这件事做完了";
    tone(95, .18, "sawtooth", .04);
    tone(220, .18, "triangle", .035, .16);
    tone(440, .3, "sine", .03, .28);
    setTimeout(function () { ui.complete.hidden = false; }, 700);
  }

  function updateHud() {
    const remain = TOTAL - state.killed;
    ui.remaining.textContent = remain;
    ui.progressFill.style.width = (state.killed / TOTAL * 100).toFixed(1) + "%";
  }

  function draw() {
    if (!state || !images.office) return;
    ctx.save();
    const sx = state.shake ? (Math.random() - .5) * state.shake : 0;
    const sy = state.shake ? (Math.random() - .5) * state.shake : 0;
    ctx.translate(sx, sy);
    ctx.drawImage(images.office, 0, 0, W, H);
    ctx.fillStyle = "rgba(255,250,240,.05)";
    ctx.fillRect(0, 0, W, H);
    drawTaskPile();
    drawPapers();
    drawEnemies();
    drawPlayer();
    drawAttacks();
    drawParticles();
    if (state.phase === "upgrade") {
      ctx.fillStyle = "rgba(23,38,59,.34)";
      ctx.fillRect(0, 0, W, H);
    }
    if (state.flash > 0) {
      ctx.fillStyle = "rgba(255,255,255," + (.35 * state.flash) + ")";
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }

  function drawTaskPile() {
    const x = 64;
    const y = 395;
    const remaining = TOTAL - state.killed;
    if (remaining === 0) {
      ctx.save();
      ctx.translate(x, y - 8);
      ctx.fillStyle = "rgba(23,38,59,.18)";
      ctx.beginPath(); ctx.ellipse(34, 42, 48, 13, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f4ca4c";
      ctx.strokeStyle = "#17263b";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-2, 3); ctx.lineTo(24, 3); ctx.lineTo(32, 13); ctx.lineTo(72, 13);
      ctx.lineTo(72, 43); ctx.lineTo(-2, 43); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fffaf0";
      ctx.fillRect(11, 16, 49, 18);
      ctx.strokeRect(11, 16, 49, 18);
      ctx.fillStyle = "#38bdc1";
      ctx.font = "1000 17px Microsoft YaHei";
      ctx.textAlign = "center";
      ctx.fillText("✓", 35, 31);
      ctx.fillStyle = "#17263b";
      ctx.font = "900 13px Microsoft YaHei";
      ctx.fillText("归档", 35, 62);
      ctx.restore();
      return;
    }
    const layers = Math.max(1, Math.ceil(remaining / 4));
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(23,38,59,.18)";
    ctx.beginPath(); ctx.ellipse(34, 31, 46, 13, 0, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < layers; i += 1) {
      const yy = 12 - i * 5;
      ctx.fillStyle = i % 2 ? "#fffaf0" : "#f0e7d8";
      ctx.strokeStyle = "#17263b";
      ctx.lineWidth = 2.5;
      ctx.fillRect(2 + (i % 2) * 4, yy, 66, 30);
      ctx.strokeRect(2 + (i % 2) * 4, yy, 66, 30);
    }
    ctx.fillStyle = "#e65b67";
    ctx.fillRect(50, -layers * 5 + 2, 16, 27);
    ctx.fillStyle = "#17263b";
    ctx.font = "900 13px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillText("积压", 35, 58);
    ctx.restore();
  }

  function drawPapers() {
    state.papers.forEach(function (p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.t * Math.PI * 4);
      ctx.fillStyle = "#fffaf0";
      ctx.strokeStyle = "#17263b";
      ctx.lineWidth = 2;
      ctx.fillRect(-9, -7, 18, 14);
      ctx.strokeRect(-9, -7, 18, 14);
      ctx.restore();
    });
  }

  function enemyActionFrame(e) {
    if (e.dead) return enemyActionAtlas.frames.defeat;
    if (e.hit > 0) return enemyActionAtlas.frames.hit;
    const attackDistance = state.player.r + e.r + (e.type === "email" ? 44 : 30);
    const preparingContact = Math.hypot(state.player.x - e.x, state.player.y - e.y) < attackDistance;
    if (e.telegraph > 0 || preparingContact) return enemyActionAtlas.frames.attack;
    return enemyActionAtlas.frames.move;
  }

  function enemyVisual(e) {
    if (e.type !== "email") {
      if (Number.isInteger(e.debugActionFrame)) {
        return { image: images.backlog, frame: e.debugActionFrame, config: enemyActionAtlas.backlog, sequence: "actions" };
      }
      if (e.debugSequence === "walk") {
        return { image: images.backlogWalk, frame: e.debugFrame, config: enemyActionAtlas.backlogWalk, sequence: "walk" };
      }
      if (e.debugSequence === "slam") {
        return { image: images.backlogSlam, frame: e.debugFrame, config: enemyActionAtlas.backlogSlam, sequence: "slam" };
      }
      if (e.dead || e.hit > 0) {
        return { image: images.backlog, frame: enemyActionFrame(e), config: enemyActionAtlas.backlog, sequence: "actions" };
      }
      if (e.slamTime > 0) {
        const progress = Math.max(0, Math.min(.999, 1 - e.slamTime / .68));
        return {
          image: images.backlogSlam,
          frame: Math.min(4, Math.floor(progress * 5)),
          config: enemyActionAtlas.backlogSlam,
          sequence: "slam"
        };
      }
      return {
        image: images.backlogWalk,
        frame: Math.floor(state.time / .115 + e.id * .61) % enemyActionAtlas.backlogWalk.frames,
        config: enemyActionAtlas.backlogWalk,
        sequence: "walk"
      };
    }
    if (e.debugSequence === "run") {
      return { image: images.emailRun, frame: e.debugFrame, config: enemyActionAtlas.emailRun, sequence: "run" };
    }
    if (e.debugSequence === "dash") {
      return { image: images.emailDash, frame: e.debugFrame, config: enemyActionAtlas.emailDash, sequence: "dash" };
    }
    if (Number.isInteger(e.debugActionFrame)) {
      return { image: images.emailActions, frame: e.debugActionFrame, config: enemyActionAtlas.email, sequence: "actions" };
    }
    if (e.dead || e.hit > 0) {
      return { image: images.emailActions, frame: enemyActionFrame(e), config: enemyActionAtlas.email, sequence: "actions" };
    }
    if (e.telegraph > 0) {
      return {
        image: images.emailDash,
        frame: e.telegraph < .5 ? 0 : 1,
        config: enemyActionAtlas.emailDash,
        sequence: "dash"
      };
    }
    if (e.dashTime > 0) {
      const progress = Math.max(0, Math.min(.999, 1 - e.dashTime / .48));
      return {
        image: images.emailDash,
        frame: 2 + Math.min(2, Math.floor(progress * 3)),
        config: enemyActionAtlas.emailDash,
        sequence: "dash"
      };
    }
    const attackDistance = state.player.r + e.r + 44;
    if (Math.hypot(state.player.x - e.x, state.player.y - e.y) < attackDistance) {
      return { image: images.emailActions, frame: enemyActionAtlas.frames.attack, config: enemyActionAtlas.email, sequence: "actions" };
    }
    return {
      image: images.emailRun,
      frame: Math.floor(state.time / .09 + e.id * .73) % enemyActionAtlas.emailRun.frames,
      config: enemyActionAtlas.emailRun,
      sequence: "run"
    };
  }

  function drawEnemies() {
    state.enemies.forEach(function (e) {
      const visual = enemyVisual(e);
      const img = visual.image;
      const config = visual.config;
      const frameIndex = visual.frame;
      const base = config.runtimeHeight;
      const drawSize = base * enemyActionAtlas.cell / config.referenceHeight;
      const stride = e.dead ? 0 : Math.sin(state.time * (e.type === "email" ? 12 : 8) + e.id * 1.73);
      const moving = Math.hypot(e.vx, e.vy) > 8;
      const facing = e.dead || Math.abs(e.vx) < 3 ? 1 : (e.vx < 0 ? -1 : 1);
      const dashStretch = e.dashTime > 0 && visual.sequence !== "dash" ? .12 : 0;
      const sx = 1 + e.squash * .08 + dashStretch;
      const sy = 1 - e.squash * .1 - dashStretch * .45;
      const footY = base * .38;
      ctx.save();
      ctx.translate(e.x, e.y + (moving && visual.sequence === "actions" ? Math.abs(stride) * -2.4 : 0));
      if (e.telegraph > 0) {
        ctx.strokeStyle = "rgba(230,91,103," + (.35 + e.telegraph * .55) + ")";
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(0, 0, e.r + 9 + e.telegraph * 7, 0, Math.PI * 2); ctx.stroke();
      }
      if (e.type === "backlog" && e.slamTime > 0) {
        const slamProgress = Math.max(0, Math.min(1, 1 - e.slamTime / .68));
        ctx.strokeStyle = "rgba(244,202,76," + (.28 + slamProgress * .55) + ")";
        ctx.lineWidth = slamProgress >= .62 ? 6 : 3;
        ctx.beginPath();
        ctx.ellipse(0, 17, e.r + 12 + slamProgress * 8, 15 + slamProgress * 5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.rotate(moving && visual.sequence === "actions" && frameIndex === enemyActionAtlas.frames.move ? stride * .025 : 0);
      ctx.scale(facing * sx, sy);
      ctx.globalAlpha = e.dead ? Math.min(1, e.deathTime / .12) : (e.hit > 0 ? .78 : 1);
      ctx.drawImage(
        img,
        frameIndex * enemyActionAtlas.cell, 0, enemyActionAtlas.cell, enemyActionAtlas.cell,
        -drawSize / 2, footY - drawSize * enemyActionAtlas.baseline / enemyActionAtlas.cell,
        drawSize, drawSize
      );
      ctx.restore();
      const hp = Math.max(0, e.hp / e.maxHp);
      if (!e.dead && hp < 1) {
        ctx.fillStyle = "rgba(23,38,59,.2)"; ctx.fillRect(e.x - 25, e.y + 31, 50, 6);
        ctx.fillStyle = e.type === "email" ? "#e65b67" : "#38bdc1"; ctx.fillRect(e.x - 25, e.y + 31, 50 * hp, 6);
      }
    });
  }

  function drawPlayer() {
    const p = state.player;
    const recoil = p.recoil * 7;
    const drawX = p.x - Math.cos(p.aimAngle) * recoil;
    const drawY = p.y - Math.sin(p.aimAngle) * recoil;
    const weaponHeight = MARKER_WEAPON_WIDTH * images.markerWeapon.height / images.markerWeapon.width;
    const hitAlpha = p.hit > 0 ? .55 + Math.sin(p.hit * 35) * .25 : 1;
    const row = playerDirectionRows[p.bodyDirection] || 0;
    const phase = p.moving ? 1 + (Math.floor(state.time / .115) % 2) : 0;

    if (Math.sin(p.aimAngle) < -.15) drawMarkerWeapon(p, drawX, drawY, weaponHeight, hitAlpha);

    drawPlayerAtlasLayer(images.markerRigBack, row, phase, drawX, drawY, hitAlpha);
    drawPlayerAtlasLayer(images.playerBody, row, phase, drawX, drawY, hitAlpha);
    drawPlayerAtlasLayer(images.markerRigFront, row, phase, drawX, drawY, hitAlpha);

    if (Math.sin(p.aimAngle) >= -.15) drawMarkerWeapon(p, drawX, drawY, weaponHeight, hitAlpha);
  }

  function drawPlayerAtlasLayer(image, row, phase, drawX, drawY, alpha) {
    const width = PLAYER_ATLAS_DRAW_HEIGHT * PLAYER_ATLAS_CELL_WIDTH / PLAYER_ATLAS_CELL_HEIGHT;
    const top = drawY + PLAYER_FOOT_OFFSET_Y - PLAYER_ATLAS_DRAW_HEIGHT * PLAYER_ATLAS_BASELINE / PLAYER_ATLAS_CELL_HEIGHT;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(
      image,
      phase * PLAYER_ATLAS_CELL_WIDTH, row * PLAYER_ATLAS_CELL_HEIGHT,
      PLAYER_ATLAS_CELL_WIDTH, PLAYER_ATLAS_CELL_HEIGHT,
      drawX - width / 2, top,
      width, PLAYER_ATLAS_DRAW_HEIGHT
    );
    ctx.restore();
  }

  function drawMarkerWeapon(p, drawX, drawY, weaponHeight, hitAlpha) {
    ctx.save();
    ctx.translate(drawX, drawY + MARKER_WEAPON_PIVOT_Y);
    ctx.rotate(p.aimAngle);
    ctx.globalAlpha = hitAlpha;
    ctx.drawImage(
      images.markerWeapon,
      -MARKER_WEAPON_PIVOT_X, -weaponHeight / 2,
      MARKER_WEAPON_WIDTH, weaponHeight
    );
    ctx.restore();
  }

  function drawAttacks() {
    state.attacks.forEach(function (a) {
      const alpha = Math.max(0, a.life / a.max);
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = alpha * .22;
      ctx.strokeStyle = a.color;
      ctx.lineWidth = 22;
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(a.x1, a.y1); ctx.lineTo(a.x2, a.y2); ctx.stroke();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "#17263b";
      ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(a.x1, a.y1); ctx.lineTo(a.x2, a.y2); ctx.stroke();
      ctx.strokeStyle = a.color;
      ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(a.x1, a.y1); ctx.lineTo(a.x2, a.y2); ctx.stroke();
      ctx.strokeStyle = "#fffaf0";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(a.x1, a.y1); ctx.lineTo(a.x2, a.y2); ctx.stroke();
      ctx.restore();
    });
  }

  function drawParticles() {
    state.particles.forEach(function (p) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    });
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    const dt = Math.min(.033, Math.max(0, (now - lastTime) / 1000 || 0));
    lastTime = now;
    update(dt);
    draw();
    animationId = requestAnimationFrame(frame);
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * W / rect.width, y: (event.clientY - rect.top) * H / rect.height };
  }

  window.addEventListener("keydown", function (event) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(event.code)) event.preventDefault();
    const inputDirection = {
      KeyA: "left", ArrowLeft: "left",
      KeyD: "right", ArrowRight: "right",
      KeyW: "up", ArrowUp: "up",
      KeyS: "down", ArrowDown: "down"
    }[event.code];
    if (state && inputDirection) state.player.bodyDirection = inputDirection;
    keys.add(event.code);
  });
  window.addEventListener("keyup", function (event) { keys.delete(event.code); });
  window.addEventListener("blur", function () { keys.clear(); pointer = null; });
  canvas.addEventListener("pointerdown", function (event) { pointer = canvasPoint(event); canvas.setPointerCapture(event.pointerId); });
  canvas.addEventListener("pointermove", function (event) { if (pointer) pointer = canvasPoint(event); });
  canvas.addEventListener("pointerup", function () { pointer = null; });
  canvas.addEventListener("pointercancel", function () { pointer = null; });

  ui.startButton.addEventListener("click", start);
  ui.upgradeButton.addEventListener("click", applyUpgrade);
  ui.restartButton.addEventListener("click", start);

  window.CartoonMarkerSlice = {
    start: start,
    applyUpgrade: applyUpgrade,
    getState: function () {
      return state ? {
        phase: state.phase,
        killed: state.killed,
        spawned: state.spawned,
        upgraded: state.upgraded,
        remaining: TOTAL - state.killed,
        playerHp: state.player.hp,
        bodyDirection: state.player.bodyDirection,
        moving: state.player.moving
      } : null;
    },
    forceUpgrade: showUpgrade,
    forceComplete: function () {
      state.spawned = TOTAL;
      state.killed = TOTAL;
      state.enemies = [];
      updateHud();
      completeRun();
    }
  };

  loadAssets().then(function () {
    reset();
    applyDebugEnemyPose();
    applyDebugPlayerPose();
    applyDebugSlamProbe();
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(frame);
  }).catch(function () {
    ui.start.querySelector("p").textContent = "素材加载失败，请刷新页面。";
    ui.startButton.disabled = true;
  });
}());
