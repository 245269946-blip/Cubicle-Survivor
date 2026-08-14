(function () {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const TOTAL = 30;
  const ASSET_ROOT = "assets/cartoon-marker-slice/";

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
    player: "marker-worker-v1.png",
    backlog: "backlog-enemy-v1.png",
    email: "urgent-email-enemy-v1.png"
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
      player: { x: W * .5, y: H * .54, r: 27, hp: 100, speed: 228, attack: .3, recoil: 0, hit: 0, face: 1 },
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
      dead: false
    });
    state.spawned += 1;
  }

  function update(dt) {
    if (!state) return;
    state.flash = Math.max(0, state.flash - dt * 3);
    state.shake = Math.max(0, state.shake - dt * 25);
    updateParticles(dt);
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
    if (dx || dy) {
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
    p.recoil = 1;
    p.attack = state.upgraded ? .57 : .68;
    const offsets = state.upgraded ? [-13, 13] : [0];
    offsets.forEach(function (offset, index) {
      const nx = -Math.sin(angle);
      const ny = Math.cos(angle);
      const x1 = p.x + Math.cos(angle) * 31 + nx * offset;
      const y1 = p.y + Math.sin(angle) * 31 + ny * offset;
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
      if (e.type === "email") {
        e.dashIn -= dt;
        if (e.dashIn <= .42 && e.dashIn > 0) e.telegraph = 1 - e.dashIn / .42;
        if (e.dashIn <= 0 && e.dashTime <= 0) {
          e.dashTime = .48;
          e.dashIn = 2.2 + Math.random() * 1.2;
          e.telegraph = 0;
        }
        if (e.dashTime > 0) { e.dashTime -= dt; speed = 175; }
      }
      const dx = p.x - e.x;
      const dy = p.y - e.y;
      const len = Math.hypot(dx, dy) || 1;
      e.vx += dx / len * speed * dt * 4;
      e.vy += dy / len * speed * dt * 4;
      const damping = Math.pow(.035, dt);
      e.vx *= damping;
      e.vy *= damping;
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      const touch = Math.hypot(p.x - e.x, p.y - e.y);
      if (touch < p.r + e.r - 6 && p.hit <= 0) {
        p.hp = Math.max(1, p.hp - (e.type === "email" ? 12 : 7));
        p.hit = .85;
        state.shake = 7;
        ui.health.textContent = Math.ceil(p.hp);
        tone(75, .13, "sawtooth", .04);
      }
    });
    state.enemies = state.enemies.filter(function (e) { return !e.dead; });
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

  function drawEnemies() {
    state.enemies.forEach(function (e) {
      const img = e.type === "email" ? images.email : images.backlog;
      const base = e.type === "email" ? 88 : 100;
      const sx = 1 + e.squash * .22;
      const sy = 1 - e.squash * .28;
      ctx.save();
      ctx.translate(e.x, e.y);
      if (e.telegraph > 0) {
        ctx.strokeStyle = "rgba(230,91,103," + (.35 + e.telegraph * .55) + ")";
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(0, 0, e.r + 9 + e.telegraph * 7, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.scale(sx, sy);
      ctx.globalAlpha = e.hit > 0 ? .72 : 1;
      ctx.drawImage(img, -base / 2, -base * .62, base, base);
      ctx.restore();
      const hp = Math.max(0, e.hp / e.maxHp);
      if (hp < 1) {
        ctx.fillStyle = "rgba(23,38,59,.2)"; ctx.fillRect(e.x - 25, e.y + 31, 50, 6);
        ctx.fillStyle = e.type === "email" ? "#e65b67" : "#38bdc1"; ctx.fillRect(e.x - 25, e.y + 31, 50 * hp, 6);
      }
    });
  }

  function drawPlayer() {
    const p = state.player;
    const bob = state.phase === "playing" ? Math.sin(state.time * 8) * 2 : 0;
    const recoil = p.recoil * 7;
    const size = 138;
    ctx.save();
    ctx.translate(p.x - p.face * recoil, p.y + bob);
    if (p.face < 0) ctx.scale(-1, 1);
    if (p.hit > 0) ctx.globalAlpha = .55 + Math.sin(p.hit * 35) * .25;
    ctx.drawImage(images.player, -size * .46, -size * .67, size, size * 1.07);
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
        playerHp: state.player.hp
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
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(frame);
  }).catch(function () {
    ui.start.querySelector("p").textContent = "素材加载失败，请刷新页面。";
    ui.startButton.disabled = true;
  });
}());
