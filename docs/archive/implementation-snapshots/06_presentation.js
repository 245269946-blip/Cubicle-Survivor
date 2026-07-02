// ================================================================
// 06_PRESENTATION 表现反馈
// 动效·绘制·HUD·特效·演出·预警
// File: 06_presentation.js | Load order: 6/7
// ================================================================

function nearestEnemy() {
  let best = null;
  let bestDist = Infinity;
  for (const e of game.enemies) {
    const dist = Math.hypot(e.x - game.player.x, e.y - game.player.y);
    if (dist < bestDist) {
      best = e;
      bestDist = dist;
    }
  }
  return best;
}
function render() {
  if (!game) {
    drawMenuBackground();
    return;
  }

  const cam = game.camera;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFloor(cam);

  ctx.save();
  const shakeX = game.screenShake > 0 ? (Math.random() - 0.5) * game.screenShake * 2 : 0;
  const shakeY = game.screenShake > 0 ? (Math.random() - 0.5) * game.screenShake * 2 : 0;
  ctx.translate(-cam.x + shakeX, -cam.y + shakeY);
  drawPickups();
  drawDamageZones();
  drawAura();
  drawOrbiters();
  drawProjectiles();
  drawEnemies();
  drawParticles();
  drawPlayer();
  drawFloatingTexts();
  drawSwingTrails();
  ctx.restore();
  drawScreenFeedback();
}
function drawScreenFeedback() {
  const flash = game.damageFlash || 0;
  const lowHpRatio = game.player.hp / game.player.maxHp;
  if (flash > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(0.34, flash * 0.28);
    ctx.fillStyle = "#ff335f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
  if (lowHpRatio < 0.28) {
    const pulseAlpha = 0.18 + Math.sin(game.time * 8) * 0.05;
    const grd = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.28, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.72);
    grd.addColorStop(0, "rgba(255, 42, 96, 0)");
    grd.addColorStop(1, `rgba(255, 42, 96, ${pulseAlpha})`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}
function drawMenuBackground() {
  const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grd.addColorStop(0, "#261456");
  grd.addColorStop(0.42, "#112642");
  grd.addColorStop(0.74, "#34123f");
  grd.addColorStop(1, "#07121d");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawRoomGlow(0, 0);
  drawNeonSkyline(0, 0);
  drawStaticOffice(0, 0);
}
function drawFloor(cam) {
  ctx.fillStyle = "#13202a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const stageTint = getStageTint();
  ctx.fillStyle = stageTint.fill;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawProceduralFloor(cam, stageTint);
  drawRoomGlow(cam.x, cam.y);

  drawStaticOffice(cam.x, cam.y);
}
function drawProceduralFloor(cam, stageTint) {
  const tile = 34;
  const startX = -(cam.x % tile) - tile;
  const startY = -(cam.y % tile) - tile;
  for (let x = startX; x < canvas.width + tile; x += tile) {
    for (let y = startY; y < canvas.height + tile; y += tile) {
      const wx = Math.floor((cam.x + x) / tile);
      const wy = Math.floor((cam.y + y) / tile);
      const seed = hashCell(wx, wy);
      const shade = seed > 0.72 ? "rgba(255, 240, 189, 0.018)" : seed < 0.18 ? "rgba(3, 5, 12, 0.18)" : "rgba(255,255,255,0.006)";
      pixelRect(x + (seed > 0.5 ? 2 : 0), y + (seed < 0.42 ? 2 : 0), tile - 2, tile - 2, shade);
      if (seed > 0.78) pixelRect(x + 7, y + 9, 11, 3, "rgba(141, 116, 255, 0.1)");
      if (seed > 0.9) pixelRect(x + 12, y + 17, 3, 12, "rgba(82, 255, 225, 0.15)");
      if (seed < 0.13) pixelRect(x + 20, y + 23, 13, 3, "rgba(82, 255, 225, 0.12)");
      if (seed > 0.64 && seed < 0.7) pixelRect(x + 5, y + 30, 24, 2, "rgba(255, 209, 92, 0.055)");
      if (seed > 0.49 && seed < 0.53) {
        pixelRect(x + 4, y + 5, 4, 4, "rgba(255, 255, 255, 0.035)");
        pixelRect(x + 24, y + 18, 5, 5, "rgba(141, 116, 255, 0.05)");
      }
    }
  }

  const lane = 330;
  const laneStartX = -(cam.x % lane);
  const laneStartY = -(cam.y % lane);
  for (let x = laneStartX; x < canvas.width; x += lane) {
    pixelRect(x - 2, 0, 4, canvas.height, "rgba(82, 255, 225, 0.035)");
    pixelRect(x + 22, 0, 3, canvas.height, "rgba(141, 116, 255, 0.026)");
  }
  for (let y = laneStartY; y < canvas.height; y += lane) {
    pixelRect(0, y - 2, canvas.width, 4, "rgba(255, 209, 92, 0.035)");
    pixelRect(0, y + 22, canvas.width, 3, "rgba(110, 168, 255, 0.03)");
  }

  const stripe = 420;
  const stripeStartX = -(cam.x % stripe) - stripe;
  const stripeStartY = -(cam.y % stripe) - stripe;
  for (let x = stripeStartX; x < canvas.width + stripe; x += stripe) {
    for (let y = stripeStartY; y < canvas.height + stripe; y += stripe) {
      const seed = hashCell(Math.floor((cam.x + x) / stripe) + 41, Math.floor((cam.y + y) / stripe) + 23);
      if (seed < 0.46) continue;
      const sx = x + 90 + (seed * 70) % 80;
      const sy = y + 78 + (seed * 113) % 90;
      for (let i = 0; i < 5; i += 1) {
        pixelRect(sx + i * 18, sy + i * 10, 22, 5, i % 2 ? "rgba(82, 255, 225, 0.18)" : "rgba(141, 116, 255, 0.11)");
      }
      pixelRect(sx - 8, sy - 9, 128, 2, "rgba(255,255,255,0.035)");
      pixelRect(sx + 4, sy + 58, 88, 2, "rgba(255, 209, 92, 0.08)");
    }
  }

  const rug = 260;
  const rugStartX = -(cam.x % rug) - rug;
  const rugStartY = -(cam.y % rug) - rug;
  for (let x = rugStartX; x < canvas.width + rug; x += rug) {
    for (let y = rugStartY; y < canvas.height + rug; y += rug) {
      const wx = Math.floor((cam.x + x) / rug);
      const wy = Math.floor((cam.y + y) / rug);
      const seed = hashCell(wx + 13, wy - 9);
      if (seed > 0.72) {
        drawHandPaintedPatch(x + 58, y + 54, 124, 78, seed);
      }
    }
  }

  ctx.fillStyle = stageTint.grid;
  for (let i = 0; i < 44; i += 1) {
    const seed = hashCell(i, Math.floor(cam.x / 200) + Math.floor(cam.y / 200));
    const x = (seed * 1949) % canvas.width;
    const y = (hashCell(i + 17, Math.floor(cam.y / 160)) * 911) % canvas.height;
    const color = seed > 0.66 ? "rgba(141, 116, 255, 0.075)" : seed > 0.36 ? "rgba(82, 255, 225, 0.11)" : "rgba(255, 209, 92, 0.09)";
    pixelRect(x, y, 2 + seed * 16, seed > 0.5 ? 3 : 2, color);
  }
}
function getStageTint() {
  const danger = game && game.stage >= 7;
  const boss = game && game.stage >= game.maxStage;
  if (boss) return { fill: "rgba(255, 42, 96, 0.07)", grid: "rgba(255, 90, 122, 0.035)" };
  if (danger) return { fill: "rgba(255, 150, 58, 0.04)", grid: "rgba(255, 209, 92, 0.028)" };
  return { fill: "rgba(82, 255, 225, 0.018)", grid: "rgba(82, 255, 225, 0.022)" };
}
function drawRoomGlow(camX, camY) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const anchors = [
    { x: canvas.width * 0.22 - (camX * 0.02) % 140, y: canvas.height * 0.28, color: "rgba(82, 255, 225, 0.055)", r: 260 },
    { x: canvas.width * 0.74 + (camY * 0.015) % 120, y: canvas.height * 0.38, color: "rgba(141, 116, 255, 0.035)", r: 300 },
    { x: canvas.width * 0.5, y: canvas.height * 0.72, color: "rgba(255, 209, 92, 0.035)", r: 240 },
  ];
  for (const light of anchors) {
    const grad = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.r);
    grad.addColorStop(0, light.color);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(light.x, light.y, light.r, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}
function drawNeonSkyline(camX, camY) {
  ctx.save();
  ctx.globalAlpha = 0.42;
  const horizon = Math.round(canvas.height * 0.18);
  for (let i = 0; i < 18; i += 1) {
    const seed = hashCell(i, 91);
    const w = 34 + seed * 44;
    const h = 42 + hashCell(i, 92) * 96;
    const x = (i * 86 - (camX * 0.12)) % (canvas.width + 120) - 60;
    const y = horizon - h * 0.2 + hashCell(i, 93) * 16;
    pixelRect(x, y, w, h, "rgba(9, 10, 31, 0.74)");
    pixelRect(x + 4, y + 8, w - 8, 3, seed > 0.5 ? "rgba(82, 255, 225, 0.46)" : "rgba(82, 255, 225, 0.5)");
    for (let j = 0; j < 4; j += 1) {
      pixelRect(x + 8 + j * 10, y + 20 + (j % 2) * 11, 5, 5, "rgba(255, 209, 92, 0.42)");
    }
  }
  ctx.restore();
}
function drawHandPaintedPatch(x, y, w, h, seed) {
  const palette = seed > 0.86
    ? ["rgba(28, 35, 65, 0.62)", "rgba(141, 116, 255, 0.12)", "rgba(82, 255, 225, 0.12)"]
    : ["rgba(13, 86, 92, 0.48)", "rgba(82, 255, 225, 0.18)", "rgba(255, 209, 92, 0.11)"];
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(Math.round(x + 8), Math.round(y));
  ctx.lineTo(Math.round(x + w - 10), Math.round(y + 5));
  ctx.lineTo(Math.round(x + w), Math.round(y + h - 12));
  ctx.lineTo(Math.round(x + 12), Math.round(y + h));
  ctx.lineTo(Math.round(x), Math.round(y + 14));
  ctx.closePath();
  ctx.fillStyle = "rgba(5, 8, 17, 0.46)";
  ctx.fill();
  ctx.translate(0, -3);
  ctx.fillStyle = palette[0];
  ctx.fill();
  pixelRect(x + 12, y + 12, w - 24, 5, palette[1]);
  pixelRect(x + 18, y + h - 16, w * 0.54, 4, palette[2]);
  for (let i = 0; i < 5; i += 1) {
    pixelRect(x + 22 + i * 18, y + 25 + (i % 2) * 12, 8, 3, "rgba(255,255,255,0.055)");
  }
  ctx.restore();
}
function drawStaticOffice(camX, camY) {
  const cellW = 360;
  const cellH = 240;
  const startX = Math.max(0, Math.floor((camX - cellW) / cellW));
  const endX = Math.ceil((camX + canvas.width + cellW) / cellW);
  const startY = Math.max(0, Math.floor((camY - cellH) / cellH));
  const endY = Math.ceil((camY + canvas.height + cellH) / cellH);

  for (let gx = startX; gx <= endX; gx += 1) {
    for (let gy = startY; gy <= endY; gy += 1) {
      const seed = hashCell(gx, gy);
      if (seed < 0.24) continue;
      const x = gx * cellW + 34 + ((seed * 997) % 84);
      const y = gy * cellH + 28 + ((seed * 619) % 62);
      const w = 112 + ((seed * 211) % 96);
      const h = 58 + ((seed * 157) % 32);
      if (x > WORLD.w - w || y > WORLD.h - h) continue;

      const sx = x - camX;
      const sy = y - camY;
      if (sx + w < -40 || sx > canvas.width + 40 || sy + h < -40 || sy > canvas.height + 40) continue;
      const variant = Math.floor(seed * 1000) % 5;
      if (variant === 0) drawOfficeDesk(sx, sy, w, h, seed);
      else if (variant === 1) drawServerRack(sx, sy, w, h, seed);
      else if (variant === 2) drawCoffeeCorner(sx, sy, w, h, seed);
      else if (variant === 3) drawMeetingTable(sx, sy, w, h, seed);
      else drawCableMess(sx, sy, w, h, seed);
      if (seed > 0.58) drawDeskClutter(sx, sy, w, h, seed);
      if (seed > 0.68) drawNeonOfficeAccent(sx, sy, w, h, seed);
      if (seed > 0.82) drawTinyStickerSign(sx + w * 0.5, sy - 12, seed);
      if (seed > 0.74 && seed < 0.86) drawCulturePoster(sx + w - 18, sy + 8, seed);
    }
  }
}
function hashCell(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
function pixelRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}
function drawAtlasCell(index, cx, cy, w, h, options = {}) {
function drawPropCell(index, cx, cy, w, h, options = {}) {
function drawGridCell(atlas, ready, index, cx, cy, w, h, options = {}) {
function drawAtlasRect(index, x, y, w, h, options = {}) {
function drawOfficeDesk(x, y, w, h, seed) {
  if (drawPropCell(4, x + w / 2, y + h / 2 - 4, Math.max(122, w * 0.88), Math.max(84, h * 1.35), { alpha: 0.95, ground: "rgba(4,8,13,0.35)", glow: "rgba(141, 116, 255, 0.12)" })) return;
  if (drawAtlasRect(15, x - 18, y - 44, Math.max(132, w + 36), Math.max(112, h + 60), { alpha: 0.9 })) return;
  pixelRect(x - 3, y + 5, w + 8, h + 5, "rgba(20, 9, 32, 0.7)");
  pixelRect(x, y, w, h, "rgba(219, 177, 110, 0.2)");
  pixelRect(x + 8, y + h - 10, w - 16, 8, "rgba(0, 0, 0, 0.18)");
  pixelRect(x + 16, y + 14, 48, 34, "rgba(66, 215, 184, 0.22)");
  pixelRect(x + 22, y + 20, 36, 20, "rgba(13, 30, 35, 0.58)");
  pixelRect(x + 28, y + 43, 24, 4, "rgba(66, 215, 184, 0.24)");
  pixelRect(x + w - 58, y + 18, 34, 42, "rgba(244, 240, 232, 0.14)");
  pixelRect(x + w - 52, y + 26, 22, 3, "rgba(244, 201, 93, 0.28)");
  pixelRect(x + w - 52, y + 35, 17, 3, "rgba(244, 201, 93, 0.2)");
  if (seed > 0.72) pixelRect(x + w - 88, y + 21, 18, 16, "rgba(255, 107, 107, 0.22)");
}
function drawServerRack(x, y, w, h, seed) {
  if (drawPropCell(5, x + w / 2, y + h / 2, 88, 104, { alpha: 0.96, ground: "rgba(4,8,13,0.35)", glow: "rgba(82, 255, 225, 0.32)" })) return;
  pixelRect(x + 8, y + 4, w - 16, h + 18, "rgba(9, 13, 19, 0.32)");
  const rackW = Math.min(82, w - 28);
  pixelRect(x + 18, y - 8, rackW, h + 22, "rgba(85, 101, 119, 0.28)");
  pixelRect(x + 24, y - 2, rackW - 12, h + 10, "rgba(15, 22, 30, 0.74)");
  for (let i = 0; i < 5; i += 1) {
    const yy = y + 6 + i * 13;
    pixelRect(x + 30, yy, rackW - 24, 5, "rgba(110, 168, 255, 0.18)");
    pixelRect(x + rackW - 8, yy + 1, 4, 4, i % 2 === 0 ? "rgba(66, 215, 184, 0.54)" : "rgba(244, 201, 93, 0.48)");
  }
  pixelRect(x + rackW + 28, y + 18, Math.max(26, w - rackW - 54), 16, "rgba(255, 107, 107, 0.13)");
  if (seed > 0.75) pixelRect(x + rackW + 34, y + 23, 28, 5, "rgba(255, 107, 107, 0.24)");
}
function drawCoffeeCorner(x, y, w, h, seed) {
  if (drawPropCell(seed > 0.68 ? 8 : 6, x + w / 2, y + h / 2, 96, 96, { alpha: 0.96, ground: "rgba(4,8,13,0.3)", glow: "rgba(255, 209, 92, 0.24)" })) return;
  pixelRect(x + 4, y + 12, w - 8, h - 8, "rgba(93, 72, 49, 0.24)");
  pixelRect(x + 18, y, 44, 58, "rgba(44, 57, 62, 0.72)");
  pixelRect(x + 25, y + 8, 30, 18, "rgba(66, 215, 184, 0.22)");
  pixelRect(x + 31, y + 31, 18, 16, "rgba(244, 201, 93, 0.26)");
  pixelRect(x + 78, y + 17, 24, 31, "rgba(255, 240, 122, 0.2)");
  pixelRect(x + 83, y + 12, 14, 8, "rgba(244, 240, 232, 0.18)");
  if (seed > 0.66) pixelRect(x + w - 44, y + 20, 18, 24, "rgba(66, 215, 184, 0.18)");
}
function drawMeetingTable(x, y, w, h, seed) {
  if (drawPropCell(seed > 0.62 ? 3 : 2, x + w / 2, y + h / 2, Math.max(108, w * 0.9), 84, { alpha: 0.88, ground: "rgba(4,8,13,0.24)", glow: "rgba(141, 116, 255, 0.12)" })) return;
  pixelRect(x + 8, y + 8, w - 16, h - 4, "rgba(58, 78, 94, 0.24)");
  pixelRect(x + 18, y + 18, w - 36, h - 28, "rgba(177, 134, 74, 0.24)");
  pixelRect(x + 28, y + 25, 30, 16, "rgba(244, 240, 232, 0.13)");
  pixelRect(x + w - 63, y + 25, 34, 16, "rgba(244, 240, 232, 0.13)");
  pixelRect(x + w / 2 - 18, y + 21, 36, 24, "rgba(110, 168, 255, 0.16)");
  if (seed > 0.6) pixelRect(x + w / 2 - 10, y + 29, 20, 5, "rgba(110, 168, 255, 0.26)");
}
function drawCableMess(x, y, w, h, seed) {
  const propIndex = seed > 0.82 ? 15 : seed > 0.7 ? 10 : seed > 0.58 ? 13 : 11;
  if (drawPropCell(propIndex, x + w / 2, y + h / 2, 82, 82, { alpha: 0.94, ground: "rgba(4,8,13,0.25)", glow: "rgba(82, 255, 225, 0.2)" })) return;
  pixelRect(x + 12, y + h - 16, w - 24, 10, "rgba(0, 0, 0, 0.16)");
  ctx.strokeStyle = "rgba(66, 215, 184, 0.2)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(Math.round(x + 12), Math.round(y + 30));
  ctx.lineTo(Math.round(x + w * 0.34), Math.round(y + 56));
  ctx.lineTo(Math.round(x + w * 0.62), Math.round(y + 34));
  ctx.lineTo(Math.round(x + w - 18), Math.round(y + 58));
  ctx.stroke();
  pixelRect(x + 26, y + 18, 30, 22, "rgba(244, 201, 93, 0.18)");
  pixelRect(x + 32, y + 24, 18, 5, "rgba(244, 201, 93, 0.3)");
  pixelRect(x + w - 60, y + 26, 36, 28, "rgba(244, 240, 232, 0.1)");
  if (seed > 0.74) pixelRect(x + w - 54, y + 32, 24, 4, "rgba(255, 107, 107, 0.2)");
}
function drawNeonOfficeAccent(x, y, w, h, seed) {
  const color = seed > 0.9 ? "rgba(255, 90, 122, 0.32)" : seed > 0.84 ? "rgba(155, 108, 255, 0.28)" : "rgba(82, 255, 225, 0.28)";
  pixelRect(x - 8, y + h + 10, w * 0.72, 4, "rgba(13, 5, 24, 0.66)");
  pixelRect(x - 6, y + h + 10, w * 0.7, 3, color);
  pixelRect(x - 4, y + h + 15, w * 0.36, 3, "rgba(255, 209, 92, 0.2)");
  if (seed > 0.88) {
    pixelRect(x + w - 23, y - 25, 50, 23, "rgba(13, 5, 24, 0.82)");
    pixelRect(x + w - 19, y - 21, 42, 4, color);
    pixelRect(x + w - 19, y - 12, 28, 4, "rgba(255, 240, 189, 0.24)");
  }
}
function drawDeskClutter(x, y, w, h, seed) {
  const count = 2 + Math.floor(seed * 4);
  for (let i = 0; i < count; i += 1) {
    const s = hashCell(Math.floor(seed * 1000) + i, i + 19);
    const px = x + 16 + (s * Math.max(30, w - 46));
    const py = y + 10 + (hashCell(i + 7, seed * 37) * Math.max(24, h - 26));
    const type = Math.floor(s * 5);
    if (type === 0) {
      pixelRect(px - 7, py - 5, 18, 13, "rgba(20, 8, 29, 0.78)");
      pixelRect(px - 5, py - 3, 14, 8, "rgba(82, 255, 225, 0.32)");
      pixelRect(px - 2, py + 7, 8, 3, "rgba(255, 209, 92, 0.22)");
    } else if (type === 1) {
      pixelRect(px - 5, py - 7, 12, 16, "rgba(255, 240, 189, 0.22)");
      pixelRect(px - 3, py - 4, 8, 2, "rgba(141, 116, 255, 0.12)");
      pixelRect(px - 3, py + 2, 7, 2, "rgba(82, 255, 225, 0.2)");
    } else if (type === 2) {
      pixelRect(px - 7, py - 6, 14, 12, "rgba(255, 209, 92, 0.26)");
      pixelRect(px - 3, py - 2, 6, 3, "rgba(13, 5, 24, 0.55)");
    } else if (type === 3) {
      ctx.strokeStyle = "rgba(141, 116, 255, 0.11)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px - 11, py - 3);
      ctx.lineTo(px, py + 7);
      ctx.lineTo(px + 13, py - 2);
      ctx.stroke();
    } else {
      pixelRect(px - 8, py - 8, 16, 16, "rgba(82, 255, 225, 0.18)");
      pixelRect(px - 4, py - 4, 8, 8, "rgba(141, 116, 255, 0.1)");
    }
  }
}
function drawTinyStickerSign(x, y, seed) {
  const w = 54 + (seed * 23) % 22;
  const h = 20;
  pixelRect(x - w / 2 - 3, y - 3, w + 6, h + 6, "rgba(13, 5, 24, 0.78)");
  pixelRect(x - w / 2, y, w, h, seed > 0.9 ? "rgba(141, 116, 255, 0.14)" : "rgba(82, 255, 225, 0.22)");
  pixelRect(x - w / 2 + 5, y + 5, w - 10, 4, "rgba(255, 240, 189, 0.34)");
  pixelRect(x - w / 2 + 9, y + 13, w * 0.42, 3, "rgba(13, 5, 24, 0.46)");
}
function drawCulturePoster(x, y, seed) {
  const wine = seed > 0.8;
  const w = wine ? 62 : 72;
  const h = 34;
  pixelRect(x - w, y - 6, w + 7, h + 9, "rgba(5, 7, 15, 0.68)");
  pixelRect(x - w + 3, y - 3, w, h, wine ? "rgba(80, 25, 36, 0.56)" : "rgba(17, 70, 82, 0.52)");
  pixelRect(x - w + 9, y + 3, w - 18, 4, wine ? "rgba(255, 209, 92, 0.34)" : "rgba(82, 255, 225, 0.34)");
  pixelRect(x - w + 12, y + 13, w * 0.5, 3, "rgba(255, 240, 189, 0.24)");
  pixelRect(x - w + 12, y + 21, w * 0.36, 3, "rgba(255, 240, 189, 0.18)");
  ctx.save();
  ctx.font = "900 9px ui-sans-serif, system-ui";
  ctx.textBaseline = "top";
  ctx.fillStyle = wine ? "rgba(255, 209, 92, 0.74)" : "rgba(82, 255, 225, 0.74)";
  ctx.fillText(wine ? "WINE" : "LANG", Math.round(x - w + 38), Math.round(y + 18));
  ctx.restore();
}
function drawPixelWorker(x, y, time, player) {
  if (drawAtlasCell(0, x, y - 7, 60, 60, { flipX: player && player.facingX < -0.3, ground: "rgba(4, 8, 13, 0.62)", glow: "rgba(82, 255, 225, 0.34)", glowBlur: 10 })) return;
  const bob = Math.round(Math.sin(time * 8) * 1);
  const side = player && Math.abs(player.facingX) > 0.56;
  const back = player && player.facingY < -0.46 && !side;
  const dir = player && player.facingX < 0 ? -1 : 1;
  pixelRect(x - 16, y + 13 + bob, 32, 6, "rgba(7, 4, 18, 0.48)");
  pixelRect(x - 12, y + 13 + bob, 24, 5, "rgba(0,0,0,0.25)");
  pixelRect(x - 12, y - 24 + bob, 24, 43, "#12091d");
  pixelRect(x - 10, y - 21 + bob, 20, 9, "#f4d7b6");
  pixelRect(x - 13, y - 13 + bob, 26, 8, "#f4f0e8");
  pixelRect(x - 16, y - 5 + bob, 32, 20, "#4169a8");
  pixelRect(x - 16, y + 7 + bob, 32, 5, "#2d4b7f");
  pixelRect(x - 10, y + 15 + bob, 8, 11, "#253556");
  pixelRect(x + 2, y + 15 + bob, 8, 11, "#253556");
  pixelRect(x - 20, y - 2 + bob, 6, 16, "#f4d7b6");
  pixelRect(x + 14, y - 2 + bob, 6, 16, "#f4d7b6");
  pixelRect(x - 9, y - 10 + bob, 18, 11, "#c35cff");
  pixelRect(x - 7, y - 8 + bob, 14, 8, "#52ffe1");
  pixelRect(x - 3, y - 4 + bob, 6, 2, back ? "#42d7b8" : "#14282c");
  pixelRect(x - 9, y - 24 + bob, 18, 5, "#2b2522");
  if (side) {
    pixelRect(x + dir * 7 - (dir < 0 ? 4 : 0), y - 17 + bob, 4, 4, "#211b21");
    pixelRect(x + dir * 14 - (dir < 0 ? 18 : 0), y - 1 + bob, 9, 8, "#f4f0e8");
    pixelRect(x + dir * 18 - (dir < 0 ? 18 : 0), y + 3 + bob, 8, 3, "#42d7b8");
  } else if (!back) {
    pixelRect(x - 6, y - 17 + bob, 3, 3, "#211b21");
    pixelRect(x + 3, y - 17 + bob, 3, 3, "#211b21");
  } else {
    pixelRect(x - 8, y - 24 + bob, 16, 8, "#2b2522");
  }
  pixelRect(x + 6, y - 1 + bob, 5, 5, "#ffd15c");
  pixelRect(x - 17, y - 8 + bob, 4, 13, "#c35cff");
  pixelRect(x + 13, y - 8 + bob, 4, 13, "#52ffe1");
}
function drawPixelEnemy(e) {
  const flash = e.hitFlash > 0;
  const base = flash ? "#ffffff" : e.color;
  const dark = flash ? "#d9f6ff" : shadeColor(e.color, -34);
  const s = e.elite ? 1.45 : e.r > 18 ? 1.2 : 1;
  const x = e.x;
  const y = e.y;
  if (e.charging > 0 || e.type === "boss" || (e.type === "manager" && e.specialTimer < 1.1)) {
    const pulseSize = 8 + Math.sin(game.time * 14) * 4;
    ctx.save();
    ctx.strokeStyle = e.type === "boss" || e.type === "emergency" ? "rgba(255, 42, 96, 0.86)" : "rgba(255, 209, 92, 0.78)";
    ctx.lineWidth = e.type === "boss" ? 4 : 3;
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.arc(x, y, e.r + pulseSize + (e.type === "boss" ? 16 : 8), 0, TAU);
    ctx.stroke();
    ctx.restore();
  }
  if (e.type === "meeting" || e.type === "manager" || e.type === "boss") {
    ctx.fillStyle = "rgba(110, 168, 255, 0.07)";
    ctx.beginPath();
    ctx.arc(x, y, e.type === "boss" ? 210 : e.type === "manager" ? 142 : 118, 0, TAU);
    ctx.fill();
  }
  const atlasEnemy = { bug: 1, change: 2, meeting: 3, emergency: 3, deadline: 4 }[e.type];
  if (atlasEnemy !== undefined) {
    const drawSize = e.r * (e.type === "meeting" ? 4.1 : 3.8);
    if (drawAtlasCell(atlasEnemy, x, y - e.r * 0.2, drawSize * 0.94, drawSize * 0.94, { flash, ground: "rgba(4, 8, 13, 0.55)", glow: e.elite ? "rgba(255, 209, 92, 0.34)" : "rgba(82, 255, 225, 0.13)", glowBlur: e.elite ? 18 : 8 })) {
      drawOfficeEnemyDetail(e, x, y, s);
      return;
    }
  }
  pixelRect(x - 16 * s, y + 11 * s, 32 * s, 6 * s, "rgba(7, 4, 18, 0.5)");
  pixelRect(x - 20 * s, y - 18 * s, 40 * s, 39 * s, "#15071f");
  if (e.type === "deadline") {
    pixelRect(x - 10 * s, y - 18 * s, 20 * s, 8 * s, dark);
    pixelRect(x - 18 * s, y - 10 * s, 36 * s, 26 * s, base);
    pixelRect(x - 4 * s, y - 25 * s, 8 * s, 8 * s, "#ff6b6b");
    pixelRect(x - 11 * s, y + 1 * s, 22 * s, 5 * s, "#fff07a");
    pixelRect(x - 2 * s, y - 20 * s, 4 * s, 10 * s, "#fff07a");
    if (e.charging > 0) {
      ctx.strokeStyle = "#f4c95d";
      ctx.lineWidth = 3;
      ctx.strokeRect(Math.round(x - 23 * s), Math.round(y - 18 * s), Math.round(46 * s), Math.round(42 * s));
    }
  } else if (e.type === "meeting" || e.type === "emergency") {
    pixelRect(x - 18 * s, y - 15 * s, 36 * s, 10 * s, dark);
    pixelRect(x - 22 * s, y - 5 * s, 44 * s, 25 * s, base);
    pixelRect(x - 14 * s, y + 2 * s, 28 * s, 5 * s, "#d9ecff");
    pixelRect(x - 6 * s, y - 23 * s, 12 * s, 8 * s, "#f4f0e8");
    pixelRect(x - 2 * s, y - 21 * s, 4 * s, 4 * s, e.type === "emergency" ? "#ff2a60" : "#6ea8ff");
  } else if (e.type === "change") {
    pixelRect(x - 7 * s, y - 25 * s, 14 * s, 12 * s, "#f4f0e8");
    pixelRect(x - 4 * s, y - 20 * s, 8 * s, 2 * s, "#d99cff");
    pixelRect(x - 12 * s, y - 16 * s, 24 * s, 9 * s, dark);
    pixelRect(x - 17 * s, y - 7 * s, 34 * s, 20 * s, base);
    pixelRect(x - 21 * s, y + 1 * s, 8 * s, 8 * s, base);
    pixelRect(x + 13 * s, y - 8 * s, 8 * s, 8 * s, base);
  } else if (e.type === "alarm") {
    pixelRect(x - 18 * s, y - 12 * s, 36 * s, 27 * s, base);
    pixelRect(x - 8 * s, y - 26 * s, 16 * s, 12 * s, "#ffdf8a");
    pixelRect(x - 18 * s, y - 20 * s, 8 * s, 9 * s, dark);
    pixelRect(x + 10 * s, y - 20 * s, 8 * s, 9 * s, dark);
    pixelRect(x - 10 * s, y - 2 * s, 20 * s, 5 * s, "#100719");
  } else if (e.type === "intern") {
    pixelRect(x - 12 * s, y - 22 * s, 24 * s, 12 * s, "#fff1cf");
    pixelRect(x - 18 * s, y - 9 * s, 36 * s, 25 * s, base);
    pixelRect(x - 21 * s, y + 4 * s, 9 * s, 7 * s, "#6ea8ff");
    pixelRect(x + 12 * s, y - 10 * s, 9 * s, 7 * s, "#ffd15c");
  } else if (e.type === "audit") {
    pixelRect(x - 20 * s, y - 18 * s, 40 * s, 35 * s, "#e8f8ff");
    pixelRect(x - 16 * s, y - 13 * s, 32 * s, 27 * s, base);
    pixelRect(x - 11 * s, y - 7 * s, 22 * s, 3 * s, "#100719");
    pixelRect(x - 11 * s, y + 2 * s, 16 * s, 3 * s, "#100719");
  } else if (e.type === "manager" || e.type === "boss") {
    const scale = e.type === "boss" ? 1.25 : 1;
    pixelRect(x - 20 * s * scale, y - 28 * s * scale, 40 * s * scale, 16 * s * scale, "#211b21");
    pixelRect(x - 24 * s * scale, y - 12 * s * scale, 48 * s * scale, 36 * s * scale, base);
    pixelRect(x - 16 * s * scale, y - 2 * s * scale, 32 * s * scale, 5 * s * scale, "#fff1cf");
    pixelRect(x - 26 * s * scale, y + 9 * s * scale, 52 * s * scale, 7 * s * scale, "#100719");
  } else {
    pixelRect(x - 13 * s, y - 14 * s, 26 * s, 10 * s, dark);
    pixelRect(x - 17 * s, y - 4 * s, 34 * s, 22 * s, base);
    pixelRect(x - 10 * s, y - 11 * s, 20 * s, 22 * s, base);
    pixelRect(x - 22 * s, y + 4 * s, 6 * s, 5 * s, dark);
    pixelRect(x + 16 * s, y + 4 * s, 6 * s, 5 * s, dark);
    pixelRect(x - 13 * s, y - 19 * s, 4 * s, 7 * s, dark);
    pixelRect(x + 9 * s, y - 19 * s, 4 * s, 7 * s, dark);
  }
  pixelRect(x - 7 * s, y - 5 * s, 4 * s, 4 * s, "#211b21");
  pixelRect(x + 3 * s, y - 5 * s, 4 * s, 4 * s, "#211b21");
  if (e.r > 18) {
    pixelRect(x - 12 * s, y + 4 * s, 24 * s, 4 * s, "rgba(0,0,0,0.18)");
  }
}
function drawOfficeEnemyDetail(e, x, y, s) {
  if (e.type === "bug") {
    pixelRect(x - 14 * s, y - 22 * s, 28 * s, 7 * s, "rgba(16, 7, 25, 0.78)");
    pixelRect(x - 10 * s, y - 20 * s, 7 * s, 3 * s, "rgba(255, 90, 122, 0.82)");
    pixelRect(x + 2 * s, y - 20 * s, 7 * s, 3 * s, "rgba(255, 90, 122, 0.82)");
  } else if (e.type === "change") {
    pixelRect(x - 16 * s, y - 26 * s, 32 * s, 18 * s, "rgba(255, 241, 207, 0.82)");
    pixelRect(x - 11 * s, y - 21 * s, 20 * s, 3 * s, "rgba(141, 116, 255, 0.46)");
    pixelRect(x - 11 * s, y - 14 * s, 14 * s, 3 * s, "rgba(82, 255, 225, 0.5)");
  } else if (e.type === "meeting") {
    pixelRect(x - 24 * s, y - 31 * s, 48 * s, 18 * s, "rgba(16, 7, 25, 0.86)");
    pixelRect(x - 18 * s, y - 26 * s, 36 * s, 4 * s, "rgba(82, 255, 225, 0.55)");
    pixelRect(x - 10 * s, y - 19 * s, 20 * s, 3 * s, "rgba(255, 209, 92, 0.42)");
  } else if (e.type === "deadline") {
    const blink = Math.sin(game.time * 12 + e.id) > 0 ? "rgba(255, 42, 96, 0.95)" : "rgba(255, 209, 92, 0.75)";
    pixelRect(x - 6 * s, y - 33 * s, 12 * s, 10 * s, blink);
    pixelRect(x - 18 * s, y - 20 * s, 36 * s, 5 * s, "rgba(16, 7, 25, 0.82)");
  } else if (e.type === "alarm") {
    const blink = Math.sin(game.time * 14 + e.id) > 0 ? "rgba(255, 90, 122, 0.96)" : "rgba(82, 255, 225, 0.54)";
    pixelRect(x - 20 * s, y - 30 * s, 40 * s, 8 * s, blink);
    pixelRect(x - 12 * s, y - 18 * s, 24 * s, 4 * s, "rgba(16, 7, 25, 0.88)");
  } else if (e.type === "intern") {
    pixelRect(x - 18 * s, y - 30 * s, 36 * s, 14 * s, "rgba(255, 241, 207, 0.86)");
    pixelRect(x - 13 * s, y - 25 * s, 26 * s, 3 * s, "rgba(98, 223, 180, 0.75)");
    pixelRect(x - 13 * s, y - 19 * s, 16 * s, 3 * s, "rgba(255, 209, 92, 0.65)");
  } else if (e.type === "audit") {
    pixelRect(x - 20 * s, y - 32 * s, 40 * s, 17 * s, "rgba(232, 248, 255, 0.9)");
    pixelRect(x - 15 * s, y - 27 * s, 30 * s, 3 * s, "rgba(16, 7, 25, 0.72)");
    if (e.shield > 0.24) {
      ctx.strokeStyle = "rgba(167, 220, 212, 0.55)";
      ctx.lineWidth = 2;
      ctx.strokeRect(Math.round(x - 25 * s), Math.round(y - 25 * s), Math.round(50 * s), Math.round(48 * s));
    }
  } else if (e.type === "manager" || e.type === "boss") {
    const scale = e.type === "boss" ? 1.2 : 1;
    pixelRect(x - 28 * s * scale, y - 40 * s * scale, 56 * s * scale, 18 * s * scale, "rgba(16, 7, 25, 0.9)");
    pixelRect(x - 20 * s * scale, y - 35 * s * scale, 40 * s * scale, 4 * s * scale, "rgba(255, 209, 92, 0.75)");
    pixelRect(x - 14 * s * scale, y - 28 * s * scale, 28 * s * scale, 3 * s * scale, "rgba(82, 255, 225, 0.42)");
  }
}
function drawPixelProjectile(pr) {
  const x = pr.x;
  const y = pr.y;
  const angle = Math.atan2(pr.vy, pr.vx);
  const spriteIndex = projectileSpriteIndex(pr.color);
  if (spriteIndex !== null && drawAtlasCell(spriteIndex, x, y, pr.r * 8.5, pr.r * 8.5, { rotation: angle })) return;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(angle);
  pixelRect(-pr.r * 4, -1, pr.r * 3, 2, "rgba(255, 255, 255, 0.18)");
  pixelRect(-pr.r * 2, -pr.r, pr.r * 4, pr.r * 2, pr.color);
  pixelRect(pr.r, -Math.max(1, pr.r - 2), pr.r, Math.max(2, pr.r), "#fff2c7");
  ctx.restore();
}
function projectileSpriteIndex(color) {
  if (color === "#f4c95d" || color === "#f7dda0") return 8;
  if (color === "#6ea8ff") return 9;
  if (color === "#d7d0c2") return 10;
  return null;
}
function shadeColor(hex, amount) {
  const raw = hex.replace("#", "");
  const num = Number.parseInt(raw, 16);
  const r = clamp((num >> 16) + amount, 0, 255);
  const g = clamp(((num >> 8) & 255) + amount, 0, 255);
  const b = clamp((num & 255) + amount, 0, 255);
  return `rgb(${r}, ${g}, ${b})`;
}
function drawPlayer() {
  const p = game.player;
  drawThermosSteam();
  drawShredderBlades();
  const aura = 28 + Math.sin(game.time * 5.6) * 3;
  ctx.save();
  ctx.globalAlpha = 0.76;
  ctx.strokeStyle = getAnchorCharge() > 0.55 ? "#ffd15c" : "#52ffe1";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(p.x, p.y + 2, aura, 0, TAU);
  ctx.stroke();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = getAnchorCharge() > 0.55 ? "#ffd15c" : "#52ffe1";
  ctx.beginPath();
  ctx.arc(p.x, p.y + 2, aura + 4, 0, TAU);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = p.invuln > 0 ? 0.62 + Math.sin(game.time * 34) * 0.22 : 1;
  drawPixelWorker(p.x, p.y, game.time, p);
  ctx.restore();
  const dominantRoute = getDominantRoute();
  if (dominantRoute && dominantRoute.tier >= 2) {
    const alpha = dominantRoute.tier >= 4
      ? 0.22 + Math.sin(game.time * 3) * 0.06
      : dominantRoute.tier >= 3
        ? 0.14 + Math.sin(game.time * 2.5) * 0.04
        : 0.08;
    const radius = dominantRoute.tier >= 4 ? 46 : dominantRoute.tier >= 3 ? 34 : 22;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = dominantRoute.color || "#52ffe1";
    ctx.lineWidth = dominantRoute.tier >= 4 ? 3 : 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius + p.r, 0, TAU);
    ctx.stroke();
    if (dominantRoute.tier >= 4 && Math.random() < 0.3) {
      const angle = Math.random() * TAU;
      game.particles.push({
        x: p.x + Math.cos(angle) * (radius + p.r),
        y: p.y + Math.sin(angle) * (radius + p.r),
        vx: Math.cos(angle) * 8,
        vy: Math.sin(angle) * 8 - 4,
        r: 2,
        age: 0,
        life: 0.8,
        maxLife: 0.8,
        color: dominantRoute.accent || dominantRoute.color,
      });
    }
    ctx.restore();
  }
}
function drawSwingTrails() {
  if (!game) return;
  const p = game.player;

  // Draw keyboard swing model
  if (game.keyboardSwingVisual && game.keyboardSwingVisual.life > 0) {
    const kv = game.keyboardSwingVisual;
    kv.life -= 0.018;
    const alpha = kv.life / kv.maxLife;
    if (alpha > 0) {
      ctx.save();
      ctx.globalAlpha = alpha * 0.85;
      // Draw keyboard body at mid-swing position
      const midDist = kv.range * 0.6;
      const kx = kv.x + Math.cos(kv.angle) * midDist;
      const ky = kv.y + Math.sin(kv.angle) * midDist;
      ctx.translate(kx, ky);
      ctx.rotate(kv.angle - Math.PI / 2); // perpendicular to swing direction

      const kbodyClr = kv.heavy ? "#ff8c8c" : "#6ea8ff";
      const kkeyClr = kv.heavy ? "#ffcccb" : "#b8d4ff";
      // Keyboard body
      pixelRect(-16, -22, 32, 44, kbodyClr);
      // Key rows
      pixelRect(-14, -18, 28, 8, kkeyClr);
      pixelRect(-14, -5, 28, 8, kkeyClr);
      pixelRect(-14, 8, 28, 8, kkeyClr);
      // Spacebar
      pixelRect(-12, 19, 24, 5, "#ffd15c");
      // RGB LED strip at top
      pixelRect(-16, -24, 32, 3, kv.heavy ? "#ff4040" : "#52ffe1");
      ctx.restore();

      // Fill the hit zone (subtle)
      ctx.save();
      ctx.globalAlpha = alpha * 0.08;
      ctx.fillStyle = kv.heavy ? "#ff6b6b" : "#6ea8ff";
      ctx.beginPath();
      ctx.moveTo(kv.x, kv.y);
      ctx.arc(kv.x, kv.y, kv.range, kv.angle - kv.arc / 2, kv.angle + kv.arc / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  if (!game?.swingTrails?.length) return;
  for (let i = game.swingTrails.length - 1; i >= 0; i--) {
    const t = game.swingTrails[i];
    t.life -= 0.016;
    if (t.life <= 0) { game.swingTrails.splice(i, 1); continue; }
    const alpha = t.life / t.maxLife;
    ctx.save();
    if (t.isCharge) {
      // Deadline charge line - straight line from enemy position
      ctx.globalAlpha = alpha * 0.6;
      ctx.strokeStyle = "#ffb45c";
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.lineDashOffset = -game.time * 60;
      ctx.beginPath();
      ctx.moveTo(t.x, t.y);
      ctx.lineTo(t.x + Math.cos(t.angle) * t.range, t.y + Math.sin(t.angle) * t.range);
      ctx.stroke();
      ctx.setLineDash([]);
      // Arrow head
      const hx = t.x + Math.cos(t.angle) * t.range;
      const hy = t.y + Math.sin(t.angle) * t.range;
      ctx.fillStyle = "#ffb45c";
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(hx - Math.cos(t.angle - 0.8) * 14, hy - Math.sin(t.angle - 0.8) * 14);
      ctx.lineTo(hx - Math.cos(t.angle + 0.8) * 14, hy - Math.sin(t.angle + 0.8) * 14);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      continue;
    }
    ctx.globalAlpha = alpha * 0.5;
    // Draw swing arc
    ctx.strokeStyle = t.heavy ? "#ff6b6b" : "rgba(110, 168, 255, 0.8)";
    ctx.lineWidth = t.heavy ? 5 : 3;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.range, t.angle - t.arc / 2, t.angle + t.arc / 2);
    ctx.stroke();
    // RGB glow for heavy strikes
    if (t.heavy) {
      ctx.strokeStyle = "rgba(110, 168, 255, 0.6)";
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.strokeStyle = "rgba(82, 255, 225, 0.4)";
      ctx.lineWidth = 12;
      ctx.stroke();
    }
    ctx.restore();
  }
  // Clean up old trails
  game.swingTrails = game.swingTrails.filter(function(t) { return t.life > 0; });
}
function drawShredderBlades() {
  if (!game?.weapons?.shredder || game.weapons.shredder.level <= 0) return;
  const shredTarget = nearestEnemy();
  if (!shredTarget) return;
  const p = game.player;
  const level = game.weapons.shredder.level;
  const coneAngle = (p.shredderConeAngle * Math.PI) / 180;
  const coneRange = p.shredderRange;
  const baseAngle = Math.atan2(shredTarget.y - p.y, shredTarget.x - p.x);

  ctx.save();
  // Cone fill
  ctx.globalAlpha = 0.08 + level * 0.012;
  ctx.fillStyle = "#c5d4df";
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.arc(p.x, p.y, coneRange, baseAngle - coneAngle / 2, baseAngle + coneAngle / 2);
  ctx.closePath();
  ctx.fill();
  // Cone outline
  ctx.globalAlpha = 0.22 + level * 0.03;
  ctx.strokeStyle = "#a9b8c6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(p.x, p.y, coneRange, baseAngle - coneAngle / 2, baseAngle + coneAngle / 2);
  ctx.moveTo(p.x + Math.cos(baseAngle - coneAngle / 2) * coneRange, p.y + Math.sin(baseAngle - coneAngle / 2) * coneRange);
  ctx.lineTo(p.x, p.y);
  ctx.lineTo(p.x + Math.cos(baseAngle + coneAngle / 2) * coneRange, p.y + Math.sin(baseAngle + coneAngle / 2) * coneRange);
  ctx.stroke();
  // Cross-hatch shred marks inside the cone
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = "#f4f0e8";
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i += 1) {
    const d = coneRange * (0.35 + i * 0.2);
    ctx.beginPath();
    const a1 = baseAngle - coneAngle * 0.35;
    const a2 = baseAngle + coneAngle * 0.35;
    ctx.moveTo(p.x + Math.cos(a1) * d, p.y + Math.sin(a1) * d);
    ctx.lineTo(p.x + Math.cos(a2) * d, p.y + Math.sin(a2) * d);
    ctx.stroke();
  }
  // Center shred head glow
  ctx.globalAlpha = 0.3 + Math.sin(game.time * 5) * 0.1;
  ctx.fillStyle = "#e8f0f8";
  ctx.beginPath();
  ctx.arc(p.x, p.y, 14 + level * 2, 0, TAU);
  ctx.fill();
  ctx.restore();
}
function drawThermosSteam() {
  if (!game?.weapons?.thermos || game.weapons.thermos.level <= 0 || game.player.thermosTea < 50) return;
  const p = game.player;
  const radius = getThermosRadius();
  const heat = clamp((p.thermosTea - 50) / Math.max(50, p.thermosTeaMax - 50), 0, 1);
  ctx.save();
  ctx.globalAlpha = 0.08 + heat * 0.1;
  ctx.fillStyle = "#78e8c0";
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, TAU);
  ctx.fill();
  ctx.globalAlpha = 0.2 + heat * 0.16;
  ctx.strokeStyle = "#78e8c0";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 7]);
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius + Math.sin(game.time * 4) * 3, 0, TAU);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
function drawEnemies() {
  for (const e of game.enemies) {
    drawPixelEnemy(e);
    if (e.elite) {
      ctx.strokeStyle = "#f4c95d";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r + 6, 0, TAU);
      ctx.stroke();
    }
  }
}
function drawProjectiles() {
  for (const pr of game.projectiles) {
    drawPixelProjectile(pr);
  }
}
function drawPickups() {
  for (const pickup of game.pickups) {
    const bob = Math.sin(game.time * 7 + pickup.x * 0.01) * 2;
    if (pickup.kind === "item" && drawAtlasCell(getItemPickupAtlasIndex(pickup.item?.id), pickup.x, pickup.y + bob, 42, 42, { glow: "#52ffe1", glowBlur: 10 })) continue;
    if (pickup.kind === "heal" && drawAtlasCell(7, pickup.x, pickup.y + bob, 36, 36)) continue;
    if (pickup.kind === "material" && drawAtlasCell(5, pickup.x, pickup.y + bob, 32, 32)) continue;
    if (pickup.kind === "stat" && drawAtlasCell(13, pickup.x, pickup.y + bob, 34, 34)) continue;
    if (pickup.kind === "xp" && drawAtlasCell(6, pickup.x, pickup.y + bob, 28, 34)) continue;
    if (pickup.kind === "item") {
      pixelRect(pickup.x - 10, pickup.y - 10 + bob, 20, 20, "#151226");
      pixelRect(pickup.x - 7, pickup.y - 7 + bob, 14, 14, "#52ffe1");
      pixelRect(pickup.x - 4, pickup.y - 4 + bob, 8, 8, "#ffd15c");
    } else if (pickup.kind === "heal") {
      pixelRect(pickup.x - 8, pickup.y - 8 + bob, 16, 16, "#f4f0e8");
      pixelRect(pickup.x - 3, pickup.y - 6 + bob, 6, 12, "#ff6b6b");
      pixelRect(pickup.x - 6, pickup.y - 3 + bob, 12, 6, "#ff6b6b");
    } else if (pickup.kind === "material") {
      pixelRect(pickup.x - 7, pickup.y - 6 + bob, 14, 12, "#9f7425");
      pixelRect(pickup.x - 4, pickup.y - 9 + bob, 8, 18, "#f4c95d");
      pixelRect(pickup.x - 2, pickup.y - 5 + bob, 4, 10, "#fff1a6");
    } else if (pickup.kind === "stat") {
      pixelRect(pickup.x - 7, pickup.y - 7 + bob, 14, 14, "#f4c95d");
      pixelRect(pickup.x - 4, pickup.y - 4 + bob, 8, 8, "#7b5d1c");
      pixelRect(pickup.x - 2, pickup.y - 2 + bob, 4, 4, "#ffeaa2");
    } else {
      pixelRect(pickup.x - 4, pickup.y - 7 + bob, 8, 4, "#87ffe9");
      pixelRect(pickup.x - 7, pickup.y - 3 + bob, 14, 8, "#42d7b8");
      pixelRect(pickup.x - 4, pickup.y + 5 + bob, 8, 4, "#1c8f7c");
      pixelRect(pickup.x - 2, pickup.y - 1 + bob, 4, 3, "#e9fff9");
    }
  }
}
function getItemPickupAtlasIndex(id) {
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
  return map[id] ?? 9;
}
function drawDamageZones() {
  for (const zone of game.damageZones) {
    const alpha = Math.max(0.08, zone.life / zone.maxLife * 0.22);
    ctx.fillStyle = zone.source === "thermos" ? `rgba(120, 232, 192, ${alpha + 0.04})` : `rgba(255, 240, 122, ${alpha})`;
    ctx.beginPath();
    ctx.arc(zone.x, zone.y, zone.r, 0, TAU);
    ctx.fill();
    if (zone.source === "thermos") {
      ctx.save();
      ctx.globalAlpha = 0.32;
      ctx.strokeStyle = "#78e8c0";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(zone.x, zone.y, zone.r * 0.82, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      continue;
    }
    if (drawAtlasCell(11, zone.x, zone.y, Math.min(96, zone.r * 1.65), Math.min(96, zone.r * 1.65), { alpha: 0.9 })) continue;
    pixelRect(zone.x - 15, zone.y - 10, 30, 20, "#c7b744");
    pixelRect(zone.x - 11, zone.y - 6, 22, 12, "#fff07a");
    pixelRect(zone.x - 8, zone.y - 2, 16, 3, "#8f8432");
  }
}
function drawFloatingTexts() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 15px ui-sans-serif, system-ui, sans-serif";
  for (const item of game.floatingTexts) {
    const alpha = Math.max(0, item.life / item.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(0, 0, 0, 0.58)";
    ctx.fillText(item.text, Math.round(item.x + 1), Math.round(item.y + 1));
    ctx.fillStyle = item.color;
    ctx.fillText(item.text, Math.round(item.x), Math.round(item.y));
  }
  ctx.restore();
}
function drawAura() {
  const p = game.player;
  if (game.weapons.headset.level <= 0) return;
  const radius = getAuraRadius();
  const anchor = getAnchorCharge();
  const alpha = 0.08 + Math.sin(game.time * 5) * 0.015;
  ctx.fillStyle = `rgba(66, 215, 184, ${alpha})`;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "rgba(66, 215, 184, 0.24)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, TAU);
  ctx.stroke();
  if (hasWeaponPair("headset", "report", 2)) {
    ctx.strokeStyle = "rgba(244, 201, 93, 0.2)";
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius + 15, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (anchor > 0.12) {
    ctx.save();
    ctx.globalAlpha = 0.25 + anchor * 0.28;
    ctx.strokeStyle = anchor > 0.85 ? "rgba(255, 209, 92, 0.72)" : "rgba(82, 255, 225, 0.48)";
    ctx.lineWidth = 2 + anchor * 2;
    const pad = 28 + anchor * 18;
    ctx.strokeRect(Math.round(p.x - pad), Math.round(p.y - pad * 0.72), Math.round(pad * 2), Math.round(pad * 1.44));
    ctx.globalAlpha = 0.12 + anchor * 0.18;
    ctx.fillStyle = "rgba(255, 209, 92, 0.35)";
    ctx.fillRect(Math.round(p.x - pad + 7), Math.round(p.y + pad * 0.45), Math.round(pad * 2 - 14), 4);
    ctx.restore();
  }
}
function drawOrbiters() {
  if (game.weapons.report.level <= 0) return;
  for (const orb of getOrbiters()) {
    if (drawAtlasCell(14, orb.x, orb.y, 54, 54, { rotation: game.orbitAngle })) continue;
    ctx.save();
    ctx.translate(orb.x, orb.y);
    ctx.rotate(game.orbitAngle);
    pixelRect(-16, -12, 32, 24, "#b95845");
    pixelRect(-12, -8, 24, 16, "#ff8f70");
    pixelRect(-8, -4, 16, 3, "#ffe0d2");
    pixelRect(-8, 3, 12, 3, "#ffd0bd");
    ctx.restore();
  }
}
function drawParticles() {
  for (const part of game.particles) {
    const t = Math.max(0, part.life / part.maxLife);
    ctx.globalAlpha = part.kind === "beam" ? Math.min(0.86, t) : Math.min(0.62, t * 0.78);
    if (part.kind === "beam") {
      ctx.save();
      ctx.translate(part.x, part.y);
      ctx.rotate(part.angle);
      pixelRect(0, -part.width / 2, part.length, part.width, part.color);
      pixelRect(0, -1, part.length, 2, "#fff6ff");
      if (spriteAtlasReady) {
        drawAtlasCell(12, part.length + 16, 0, 54, 54, { rotation: 0, alpha: 0.9 });
      }
      ctx.restore();
    } else if (part.kind === "line") {
      ctx.strokeStyle = part.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(part.x, part.y);
      ctx.lineTo(part.x2, part.y2);
      ctx.stroke();
      const midX = (part.x + part.x2) / 2;
      const midY = (part.y + part.y2) / 2;
      const angle = Math.atan2(part.y2 - part.y, part.x2 - part.x);
      drawAtlasCell(13, midX, midY, 44, 44, { rotation: angle, alpha: 0.76 });
    } else {
      ctx.fillStyle = part.color;
      ctx.beginPath();
      ctx.arc(part.x, part.y, part.r * (1 + part.age * 2), 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}
function spark(x, y, color) {
  hitBurst(x, y, color, 3);
}
function floatingText(x, y, text, color) {
  game.floatingTexts.push({ x, y, text, color, life: 0.82, maxLife: 0.82 });
}
function pulse(x, y, radius, color) {
  for (let i = 0; i < 18; i += 1) {
    const angle = (i / 18) * TAU;
    game.particles.push({
      x: x + Math.cos(angle) * radius,
      y: y + Math.sin(angle) * radius,
      vx: Math.cos(angle) * 45,
      vy: Math.sin(angle) * 45,
      r: 3,
      age: 0,
      life: 0.5,
      maxLife: 0.5,
      color,
    });
  }
}
function hitBurst(x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * TAU;
    const speed = 40 + Math.random() * 130;
    const life = 0.24 + Math.random() * 0.34;
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 2 + Math.random() * 3,
      age: 0,
      life,
      maxLife: life,
      color,
    });
  }
}
function updateHud() {
  if (!game) return;
  const remaining = game.endless ? "∞" : game.enemies.length + game.enemiesToSpawn;
  const timeText = game.endless
    ? formatTime(game.overtimeTimer)
    : state === "recovery"
    ? `${Math.max(0, Math.ceil(game.recoveryTime))}s`
    : formatTime(Math.max(0, game.stageConfig.duration - game.waveTime));
  if (state === "recovery") {
    ui.time.textContent = timeText;
    ui.stage.textContent = `${game.stage} 回收中`;
  } else if (game.endless) {
    ui.time.textContent = timeText;
    ui.stage.textContent = `加班 ${game.overtimeLevel + 1}`;
  } else {
    ui.time.textContent = timeText;
    ui.stage.textContent = `${game.stage} ${game.stageConfig.name}`;
  }
  updateObjectiveHud(timeText, remaining);
  ui.level.textContent = game.level;
  ui.kills.textContent = game.kills;
  ui.remaining.textContent = remaining;
  ui.skillCount.textContent = game.upgradesTaken;
  ui.material.textContent = game.materials;
  ui.hp.textContent = `${Math.max(0, Math.ceil(game.player.hp))} / ${game.player.maxHp}`;
  ui.hpFill.style.width = `${Math.max(0, Math.min(100, (game.player.hp / game.player.maxHp) * 100))}%`;
  ui.xp.style.width = `${Math.min(100, (game.xp / game.xpNext) * 100)}%`;
  updateBuildHud();
  updateStatHud();
  updateItemHud();
  updateGuideOverlay();
}
function updateGuideOverlay() {
  if (!ui.guideOverlay || !game) return;
  const show = state === "playing" && game.stage === 1 && game.waveTime < STAGE_ONE_WARMUP_SECONDS;
  ui.guideOverlay.classList.toggle("hidden", !show);
  if (show) ui.guideOverlay.textContent = `热身 ${Math.ceil(STAGE_ONE_WARMUP_SECONDS - game.waveTime)}s · WASD 移动 · 自动攻击 · 第一次升级会优先给生存选项`;
}
function updateObjectiveHud(timeText, remaining) {
  ui.objectiveStageMeta.textContent = game.endless
    ? `加班强度 ${game.overtimeLevel + 1}`
    : state === "recovery" ? `第 ${game.stage} 关 · 资源回收` : `第 ${game.stage} 关`;
  ui.objectiveStageName.textContent = game.endless ? "持续加班" : state === "recovery" ? "资源回收" : game.stageConfig.name;
  ui.objectiveTime.textContent = game.endless ? `工坊 ${Math.max(0, Math.ceil(game.overtimeBreakTimer))}s` : timeText;
  ui.objectiveRemaining.textContent = remaining;
  ui.objectiveKills.textContent = game.endless ? `${game.stageKills}` : `${game.stageKills}/${game.stageConfig.totalEnemies}`;
  const alert = getObjectiveAlert(remaining);
  ui.objectiveAlert.textContent = alert.text;
  ui.objectiveAlert.classList.toggle("boss", alert.boss);
}
function getObjectiveAlert(remaining) {
  if (game.endless) return { text: `已撑 ${formatTime(game.overtimeTimer)}，下一次工间工坊还有 ${Math.max(0, Math.ceil(game.overtimeBreakTimer))} 秒`, boss: game.overtimeLevel >= 3 };
  if (state === "recovery") return { text: "战斗结束，尽快拾取遗留材料和经验", boss: false };
  if (game.stage >= game.maxStage) return { text: "Boss 评审压场，保留爆发和移动空间", boss: true };
  if (game.stage === 1 && game.waveTime < STAGE_ONE_WARMUP_SECONDS) {
    return { text: `热身期 ${Math.ceil(STAGE_ONE_WARMUP_SECONDS - game.waveTime)} 秒：先熟悉走位，第一波会延后`, boss: false };
  }
  if (game.waveTime < 7 && game.currentIncident) return { text: `${game.currentIncident.title}：${game.currentIncident.text}`, boss: game.currentIncident.id === "bossCheck" };
  const pressureHint = getBuildPressureHint();
  if (pressureHint) return { text: pressureHint, boss: false };
  if (game.stageConfig.eliteTotal > 0 && game.stageSpawned > game.stageConfig.totalEnemies * 0.35) {
    return { text: "精英即将入场，注意冲刺怪和会议减速", boss: true };
  }
  if (remaining <= Math.max(8, game.stageConfig.totalEnemies * 0.18)) return { text: "快清场了，追击剩余怪可拿更高奖励", boss: false };
  return { text: stageBriefs[Math.min(stageBriefs.length - 1, game.stage - 1)], boss: false };
}
function showStageBanner() {
  const isBoss = game.endless || game.stage >= game.maxStage || game.stageConfig.eliteTotal >= 3;
  ui.stageBannerMeta.textContent = game.endless ? "加班模式" : `第 ${game.stage} 关`;
  ui.stageBannerTitle.textContent = game.endless ? `持续加班 ${game.overtimeLevel + 1}` : game.stageConfig.name;
  const incident = game.currentIncident ? `随机事件：${game.currentIncident.title}，${game.currentIncident.text}` : "";
  const threat = getStageThreatText();
  ui.stageBannerText.innerHTML = `
    <span>${game.endless ? "压力源不会停止，每 120 秒争取进入一次工间工坊。" : stageBriefs[Math.min(stageBriefs.length - 1, game.stage - 1)]}</span>
    <em>${threat}</em>
    ${incident ? `<small>${incident}</small>` : ""}
  `;
  ui.stageBanner.classList.toggle("boss", isBoss);
  ui.stageBanner.classList.remove("hidden");
  window.clearTimeout(showStageBanner.timer);
  showStageBanner.timer = window.setTimeout(() => {
    ui.stageBanner.classList.add("hidden");
  }, isBoss ? 2600 : 1900);
}
function getStageThreatText() {
  if (game.endless) return `新威胁：紧急会议 + 精英压力，强度 ${game.overtimeLevel + 1}`;
  const entries = Object.entries(game.stageConfig.enemyMix || {}).filter(([, weight]) => weight > 0.06);
  const labels = {
    bug: "Bug 虫",
    change: "需求变更",
    meeting: "会议怪",
    emergency: "紧急会议",
    deadline: "Deadline 冲刺",
    intern: "实习生事故",
    alarm: "警报",
    audit: "审计",
    manager: "老板检查",
    boss: "终局总监",
  };
  const previous = game.stage > 1 ? getStageConfig(game.stage - 1).enemyMix : {};
  const newOnes = entries.filter(([type]) => !previous[type]).map(([type]) => labels[type] || type);
  if (game.stage >= 6 && !previous.emergency && !newOnes.includes("紧急会议")) newOnes.push("紧急会议");
  if (game.stage === 3 && !newOnes.includes("Bug 群")) newOnes.push("Bug 群");
  const major = entries.sort((a, b) => b[1] - a[1]).slice(0, 3).map(([type]) => labels[type] || type);
  return newOnes.length ? `新威胁：${newOnes.join(" + ")}` : `本关压力：${major.join(" + ")}`;
}
function showBossArrival() {
  ui.stageBannerMeta.textContent = "终局评审";
  ui.stageBannerTitle.textContent = "总监亲自下场";
  ui.stageBannerText.textContent = "会议室灯全亮了。报表、激光笔和计算器会更容易打穿他的节奏。";
  ui.stageBanner.classList.add("boss");
  ui.stageBanner.classList.remove("hidden");
  window.clearTimeout(showStageBanner.timer);
  showStageBanner.timer = window.setTimeout(() => {
    ui.stageBanner.classList.add("hidden");
  }, 3600);
}
function updateBuildHud() {
  let topWeapon = null;
  for (const id of buildOrder) {
    const weapon = game.weapons[id];
    if (!topWeapon || weapon.level > topWeapon.level) topWeapon = weapon;
  }

  const owned = getOwnedWeaponCount();
  const summary = getBuildSummary(topWeapon, owned);
  const routeSignature = getRouteProgressList().map((route) => `${route.id}:${route.tier}:${route.score}`).join(",");
  const signature = `${summary}:${buildOrder.map((id) => game.weapons[id].level).join(",")}:${routeSignature}`;
  if (signature === buildHudSignature) return;
  buildHudSignature = signature;
  renderBuildHud(game.weapons, summary);
  renderRouteMap(ui.routeMap, { compact: true });
}
function getBuildSummary(topWeapon, owned) {
  const synergies = [];
  if (hasWeaponPair("coffee", "marker", 2)) synergies.push("贯穿");
  if (hasWeaponPair("keyboard", "stapler", 2)) synergies.push("弹幕");
  if (hasWeaponPair("headset", "report", 2)) synergies.push("领域");
  if (hasWeaponPair("sticky", "calculator", 2)) synergies.push("连锁");
  if (synergies.length) return `${synergies.slice(0, 2).join(" + ")} · ${owned}/${game.weaponSlots}`;
  const classSummary = getDominantClassSummary();
  if (classSummary) return `${classSummary} · ${owned}/${game.weaponSlots}`;
  return topWeapon && topWeapon.level > 0 ? `${topWeapon.label} Lv.${topWeapon.level} · ${owned}/${game.weaponSlots}` : `武器槽 ${owned}/${game.weaponSlots}`;
}
function getDominantClassSummary() {
  const entries = getSortedWeaponClasses();
  if (!entries.length || entries[0][1] < 2) return "";
  const [className, count] = entries[0];
  return `${weaponClassLabels[className] || className} x${count}`;
}
function renderRouteMap(target, opts = {}) {
function renderBuildHud(weapons, summary) {
  ui.buildSummary.textContent = summary;
  const weaponRows = buildOrder.map((id) => {
      const weapon = weapons[id];
      const row = document.createElement("div");
      row.className = "build-row";
      row.innerHTML = `
        <span class="build-dot ${getWeaponIconClass(id)}"></span>
        <span>${weapon.label}</span>
        <strong>Lv.${weapon.level}</strong>
      `;
      return row;
    });
  const resonanceRows = game ? getClassResonanceRows().map((entry) => {
    const row = document.createElement("div");
    row.className = "build-row resonance-row";
    row.innerHTML = `
      <span class="build-dot resonance-dot"></span>
      <span>${entry.label} ×${entry.count}</span>
      <strong>${entry.text}</strong>
    `;
    return row;
  }) : [];
  ui.buildList.replaceChildren(...weaponRows, ...resonanceRows);
}
function getClassResonanceRows() {
  const counts = getWeaponClassCounts();
  const rows = Object.entries(counts)
    .filter(([className, count]) => {
      const first = (weaponClassBonuses[className] || [])[0] || { count: 2 };
      return count >= Math.min(2, getClassTierThreshold(first));
    })
    .sort((a, b) => b[1] - a[1])
    .map(([className, count]) => {
      const tiers = weaponClassBonuses[className] || [];
      let active = null;
      for (const tier of tiers) {
        if (count >= getClassTierThreshold(tier)) active = tier;
      }
      return {
        label: weaponClassLabels[className] || className,
        count,
        text: active ? formatClassBonus(active) : `差 ${Math.max(1, getClassTierThreshold(tiers[0] || { count: 2 }) - count)} 件`,
      };
    });
  const hybrid = getHybridBonus();
  if (hybrid.active) rows.unshift({ label: hybrid.label, count: Object.keys(counts).length, text: hybrid.text });
  return rows;
}
function formatClassBonus(tier) {
  const parts = [];
  const mult = game?.policyClassBonusMult || 1;
  const scaled = (value) => Math.round(value * mult);
  if (tier.crit) parts.push(`暴击 +${scaled(tier.crit)}%`);
  if (tier.damageMult) parts.push(`伤害 +${Math.round(tier.damageMult * 100 * mult)}%`);
  if (tier.range) parts.push(`射程 +${scaled(tier.range)}`);
  if (tier.attackSpeed) parts.push(`攻速 +${scaled(tier.attackSpeed)}%`);
  if (tier.projectileMult) parts.push(`弹量 +${Math.max(1, scaled(tier.projectileMult))}`);
  if (tier.fieldRadius) parts.push(`领域 +${scaled(tier.fieldRadius)}`);
  if (tier.armor) parts.push(`护甲 +${scaled(tier.armor)}`);
  if (tier.engineering) parts.push(`工程 +${Math.round(tier.engineering * 100 * mult)}%`);
  if (tier.chain) parts.push(`连锁 +${Math.max(1, scaled(tier.chain))}`);
  if (tier.pickupRange) parts.push(`拾取 +${scaled(tier.pickupRange)}`);
  if (tier.luck) parts.push(`幸运 +${scaled(tier.luck)}`);
  if (tier.pierce) parts.push(`贯穿 +${Math.max(1, scaled(tier.pierce))}`);
  return parts.slice(0, 2).join("，") || "共鸣中";
}
function getClassTierThreshold(tier) {
  return Math.max(1, tier.count + (game?.policyClassThresholdOffset || 0));
}
function updateStatHud() {
  const p = game.player;
  const values = {
    maxHp: Math.round(p.maxHp),
    armor: Math.round(p.armor + getClassBonus("armor")),
    dodge: `${Math.round(p.dodge)}%`,
    speed: Math.round(p.speed),
    attackSpeed: `${Math.round(getEffectiveStat("attackSpeed"))}%`,
    damageMult: `${Math.round(getDamageMult() * 100)}%`,
    crit: `${Math.round(p.crit + getClassBonus("crit"))}%`,
    range: Math.round(p.range + getClassBonus("range")),
    luck: Math.round(p.luck + getClassBonus("luck")),
    pickupRange: Math.round(p.pickupRange + getClassBonus("pickupRange")),
    regen: `${Math.round(p.regen)}/s`,
    fortify: Math.round(p.fortify),
  };
  const signature = statLabels.map(({ key }) => values[key]).join(",");
  if (signature === statHudSignature) return;
  statHudSignature = signature;
  renderStatHud(values);
}
function updateItemHud() {
  const names = game.boughtItemNames;
  const signature = names.join("|");
  if (signature === itemHudSignature) return;
  itemHudSignature = signature;
  renderItemHud(names);
}
function renderItemHud(names) {
  ui.itemSummary.textContent = game ? `${names.length}/${game.itemSlots}` : names.length;
  ui.itemList.replaceChildren(
    ...(names.length ? names.slice(-4).map((name) => {
      const pill = document.createElement("span");
      pill.className = "item-pill";
      pill.textContent = name;
      return pill;
    }) : [createEmptyItemPill()]),
  );
}
function createEmptyItemPill() {
  const pill = document.createElement("span");
  pill.className = "item-pill empty";
  pill.textContent = "暂无";
  return pill;
}
function renderStatHud(values) {
  ui.statList.replaceChildren(
    ...statLabels.map(({ key, label }) => {
      const row = document.createElement("div");
      row.className = "build-row stat-row";
      row.innerHTML = `
        <span class="build-dot stat-dot ${getStatIconClass(key)}"></span>
        <span>${label}</span>
        <strong>${values[key]}</strong>
      `;
      return row;
    }),
  );
}
function updatePointerTarget(event) {
  if (!game) return;
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width;
  const sy = canvas.height / rect.height;
  pointer.x = game.camera.x + (event.clientX - rect.left) * sx;
  pointer.y = game.camera.y + (event.clientY - rect.top) * sy;
}
function togglePause() {
  if (state === "paused") {
    resumeGame();
    return;
  }
  if (!["playing", "recovery", "armory", "upgrade"].includes(state)) return;
  pausedFromState = state;
  state = "paused";
  renderPauseSheet();
  ui.pausePanel.classList.remove("hidden");
}
function resumeGame() {
  if (state !== "paused") return;
  state = pausedFromState;
  ui.pausePanel.classList.add("hidden");
  lastTime = performance.now();
  if (state === "playing" || state === "recovery") requestAnimationFrame(loop);
}
function abandonRunToMenu() {
  state = "menu";
  pausedFromState = "playing";
  game = null;
  keys.clear();
  pointer.active = false;
  ui.pausePanel.classList.add("hidden");
  ui.weaponPanel.classList.add("hidden");
  ui.upgradePanel.classList.add("hidden");
  ui.resultPanel.classList.add("hidden");
  ui.perkPanel?.classList.add("hidden");
  ui.itemReplacePanel?.classList.add("hidden");
  ui.fusionNotice?.classList.add("hidden");
  ui.policyPanel?.classList.add("hidden");
  ui.startButton?.classList.remove("hidden");
  ui.endlessButton?.classList.add("hidden");
  ui.startPanel.classList.remove("hidden");
  updateStartActions();
  pendingPolicy = null;
  policySelectionOpen = false;
  buildHudSignature = "";
  statHudSignature = "";
  itemHudSignature = "";
  renderBuildHud(weaponDefinitions, "咖啡 Lv.1 · 1/6");
  renderItemHud([]);
  drawMenuBackground();
}
function renderPauseSheet() {
  const values = getPauseStatValues();
  const weapons = buildOrder.map((id) => {
    const weapon = game.weapons[id];
    if (weapon.level <= 0) return "";
    return `<span><b>${weapon.label}</b> Lv.${weapon.level}/${weapon.max}</span>`;
  }).filter(Boolean).join("");
  const statRows = statLabels.map(({ key, label }) => `<span><b>${label}</b>${values[key]}</span>`).join("");
  const resonance = getClassResonanceRows().map((entry) => `<span><b>${entry.label} ×${entry.count}</b>${entry.text}</span>`).join("");
  const fusionNotes = game.fusionLog.length
    ? game.fusionLog.slice(-5).map((note) => `<span>${note}</span>`).join("")
    : "<span>武器 Lv.5 后会出现终局改造线索</span>";
  const items = game.boughtItemNames.length
    ? game.boughtItemNames.slice(-8).map((name) => `<span>${name}</span>`).join("")
    : "<span>暂无道具</span>";
  const meta = game.endless
    ? `持续加班 ${formatTime(game.overtimeTimer)} · 强度 ${game.overtimeLevel + 1} · 等级 ${game.level} · 材料 ${game.materials}`
    : `第 ${game.stage} 关 ${game.stageConfig.name} · 等级 ${game.level} · 材料 ${game.materials} · 击破 ${game.stageKills}/${game.stageConfig.totalEnemies}`;
  ui.pauseStats.innerHTML = `
    <div class="pause-meta">${meta}</div>
    <section><h3>武器</h3><div class="pause-chips">${weapons || "<span>初始装备</span>"}</div></section>
    <section><h3>职业共鸣</h3><div class="pause-stats">${resonance || "<span><b>暂无</b>同职业武器达到 2 个后激活</span>"}</div></section>
    <section><h3>终局线索</h3><div class="pause-chips">${fusionNotes}</div></section>
    <section><h3>属性</h3><div class="pause-stats">${statRows}</div></section>
    <section><h3>道具</h3><div class="pause-chips">${items}</div></section>
  `;
}
function getPauseStatValues() {
  const p = game.player;
  return {
    maxHp: Math.round(p.maxHp),
    armor: Math.round(p.armor + getClassBonus("armor")),
    dodge: `${Math.round(p.dodge)}%`,
    speed: Math.round(p.speed),
    attackSpeed: `${Math.round(getEffectiveStat("attackSpeed"))}%`,
    damageMult: `${Math.round(getDamageMult() * 100)}%`,
    crit: `${Math.round(p.crit + getClassBonus("crit"))}%`,
    range: Math.round(p.range + getClassBonus("range")),
    luck: Math.round(p.luck + getClassBonus("luck")),
    pickupRange: Math.round(p.pickupRange + getClassBonus("pickupRange")),
    regen: `${Math.round(p.regen)}/s`,
    fortify: Math.round(p.fortify),
  };
}
function toggleBuildPanel() {
  const collapsed = ui.buildPanel.classList.toggle("collapsed");
  ui.buildToggle.textContent = collapsed ? "⚙" : "×";
  ui.buildToggle.classList.remove("attention");
}
function markBuildHint() {
  if (!ui.buildPanel || !ui.buildPanel.classList.contains("collapsed")) return;
  ui.buildToggle?.classList.add("attention");
}
function updateRouteVisuals(dt) {
  if (!ui.routeScanlines) return;
  const anyT4 = routeDefinitions.some(r => getRouteTier(r.id) >= 4);
  const anyT3 = routeDefinitions.some(r => getRouteTier(r.id) >= 3);
  if (anyT4) {
    ui.routeScanlines.classList.add("active");
    // T4: period screen pulse in dominant route color
    game._routePulseTimer = (game._routePulseTimer || 0) + dt;
    if (game._routePulseTimer > 2.5) {
      game._routePulseTimer = 0;
      const dominantId = getDominantRouteId();
      const route = dominantId ? routeDefinitions.find(r => r.id === dominantId) : routeDefinitions[0];
      if (route) {
        const color = route.color || "#52ffe1";
        game.screenShake = Math.max(game.screenShake || 0, 2.5);
        pulse(game.player.x, game.player.y, 200, color);
        if (route.id === "precision") {
          for (let i = 0; i < 8; i += 1) {
            const angle = (i / 8) * TAU + game.time * 0.4;
            spark(game.player.x + Math.cos(angle) * 140, game.player.y + Math.sin(angle) * 140, "#52ffe1");
          }
        }
      }
    }
  } else if (anyT3) {
    ui.routeScanlines.classList.add("active");
  } else {
    ui.routeScanlines.classList.remove("active");
  }
}
function updateLowHpVisuals() {
  if (!ui.lowHpVignette) return;
  const hpPct = game.player.hp / game.player.maxHp;
  if (hpPct < 0.3) {
    ui.lowHpVignette.classList.add("active");
  } else {
    ui.lowHpVignette.classList.remove("active");
  }
}
function decorateHudIcons() {
  const hudIconIndexes = [15, 15, 12, 5, 15, 12, 9];
  document.querySelectorAll(".top-left .stat").forEach((stat, index) => {
    const icon = document.createElement("span");
    icon.className = `stat-icon ${uiIconClass(hudIconIndexes[index] ?? 12)}`;
    stat.prepend(icon);
  });
  const hpIcon = document.createElement("span");
  hpIcon.className = `stat-icon ${uiIconClass(0)}`;
  document.querySelector(".hp-stat")?.prepend(hpIcon);
}