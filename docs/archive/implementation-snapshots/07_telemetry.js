// ================================================================
// 07_TELEMETRY & TUNING 测试调参
// 死亡复盘·伤害统计·Build胜率·反馈收集
// File: 07_telemetry.js | Load order: 7/7
// ================================================================

function getTopDamageSource() {
  const entries = Object.entries(game.damageBySource || {});
  if (!entries.length) return "未被击中";
  entries.sort((a, b) => b[1] - a[1]);
  const [source, amount] = entries[0];
  return `${source} ${Math.round(amount)}`;
}
function getRunTopWeaponLabel() {
  const owned = buildOrder
    .map((id) => game.weapons[id])
    .filter((weapon) => weapon && weapon.level > 0)
    .sort((a, b) => b.level - a.level);
  if (!owned.length) return "尚未成型";
  return `${owned[0].label} Lv.${owned[0].level}`;
}
function renderDeathRecap() {
  if (!ui.deathRecap) return;
  const hints = getDeathHints();
  const bossEntry = getNearestBossKillInfo();
  const topSource = getTopDamageSource();
  const topDmg = Math.round(getTopDamageAmount());
  const dominantId = getDominantRouteId();
  const dominantRoute = dominantId ? routeDefinitions.find(r => r.id === dominantId) : null;
  let bossLine = "";
  if (bossEntry) {
    const bossPct = Math.round((1 - bossEntry.hp / bossEntry.maxHp) * 100);
    bossLine = `
      <div class="recap-boss-bar"><div class="recap-boss-fill" style="width:${Math.min(100, bossPct)}%"></div></div>
      <span>Boss <b>${bossEntry.name}</b> 剩余血量 <b>${Math.round(bossEntry.hp / bossEntry.maxHp * 100)}%</b>（已造成 ${bossPct}% 伤害）</span>
    `;
  }
  const routeLine = dominantRoute
    ? `<span>主路线 <b>${dominantRoute.name} · ${dominantRoute.stages[getRouteTier(dominantRoute.id)] || '未成型'}</b></span>`
    : "";
  const hintLines = hints.map(h => `<li>${h}</li>`).join("");
  ui.deathRecap.innerHTML = `
    <div class="recap-head">⚡ 就差一点——复盘分析</div>
    <span>第 <b>${game.stage}</b> 关倒下 · 等级 <b>${game.level}</b> · 主力输出 <b>${topSource}</b>（${topDmg} 伤害）</span>
    ${routeLine}
    ${bossLine}
    <div class="recap-hint">
      <div style="margin-bottom:4px;color:#52ffe1">💡 下次试试：</div>
      <ul style="margin:0;padding-left:18px">${hintLines}</ul>
    </div>
  `;
  ui.deathRecap.classList.remove("hidden");
}
function getNearestBossKillInfo() {
  if (!game?.enemies) return null;
  let best = null;
  for (const e of game.enemies) {
    if (e.type === "manager" || e.type === "deadline") {
      if (!best || e.maxHp > best.maxHp) best = { name: e.label || e.type, hp: e.hp, maxHp: e.maxHp };
    }
  }
  return best;
}
function getDeathHints() {
  const hints = [];
  const stage = game.stage || 1;
  const dmgBySource = game.damageBySource || {};
  const dmgTaken = game.damageTaken || 0;
  const hitsTaken = game.hitsTaken || 0;
  const avgHit = hitsTaken > 0 ? dmgTaken / hitsTaken : 0;
  const armor = getEffectiveStat("armor");
  const dodge = getEffectiveStat("dodge");
  const regen = getEffectiveStat("regen");
  
  if (avgHit > 20) hints.push("怪物单次伤害很高，堆护甲或闪避能显著延长存活时间。");
  if (armor < 4) hints.push("你的护甲太低，会议结界路线的降噪耳机能大幅减伤。");
  if (dodge < 8 && hitsTaken > 15) hints.push("闪避不足，键盘风暴路线的订书机提升闪避，被包围还能额外加闪。");
  if (regen < 3) hints.push("恢复太低，保温杯或桌面小风扇能让你快速回血。");
  if (stage >= 8 && !dmgBySource["marker"] && !dmgBySource["coffee"]) hints.push("中后期需要穿透清场能力，试试精准贯穿路线（咖啡+马克笔）。");
  if (stage >= 6 && !dmgBySource["headset"] && !dmgBySource["report"]) hints.push("中后期怪物密度高，会议结界（耳机+报表）的轨道护体很救命。");
  if (game.boughtItems && game.boughtItems.size < 3) hints.push("道具太少了——在武器店买道具能获得关键被动加成。");
  if (!hints.length) hints.push("多试几条武器路线，不同流派应对不同关卡。");
  // Shuffle and take max 3
  for (let i = hints.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [hints[i], hints[j]] = [hints[j], hints[i]]; }
  return hints.slice(0, 3);
}
function getTopDamageAmount() {
  const entries = Object.entries(game.damageBySource || {});
  if (!entries.length) return 0;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][1];
}
function renderBestOvertime() {
  if (!ui.bestOvertimeText) return;
  const best = Number.parseInt(localStorage.getItem("cb_endless_best") || "0", 10);
  ui.bestOvertimeText.classList.toggle("hidden", best <= 0);
  if (best > 0) ui.bestOvertimeText.textContent = `最长加班：${formatTime(best)}`;
}