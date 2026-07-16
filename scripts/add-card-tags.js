const fs = require('fs');
const path = 'C:/Users/Administrator/.qclaw/workspace/cubicle-survivor-reforged/src/data/cards.js';
let src = fs.readFileSync(path, 'utf8');
let changeCount = 0;

// 1. Update makeCard function signature
const oldSig = 'function makeCard(id, name, department, rarity, theme, desc, slotEffects) {';
const newSig = 'function makeCard(id, name, department, rarity, theme, desc, slotEffects, role, tags) {';
if (src.includes(oldSig)) {
  src = src.replace(oldSig, newSig);
  changeCount++;
  console.log('OK: makeCard signature');
} else {
  console.log('SKIP: makeCard signature already updated');
}

const oldRet = "return { id, name, department, rarity, theme, description: desc, slotEffects };";
const newRet = 'return { id, name, department, rarity, theme, description: desc, slotEffects, role: role || "starter", tags: tags || [] };';
if (src.includes(oldRet)) {
  src = src.replace(oldRet, newRet);
  changeCount++;
  console.log('OK: makeCard return');
}

// 2. Card metadata
const cardMeta = {
  agile_dev:               ['starter',['chain','network']],
  version_iter:            ['scaler',['ramp']],
  code_refactor:           ['transformer',['pierce','risk']],
  continuous_integration:  ['scaler',['cooldown','network']],
  tech_breakthrough:       ['transformer',['chain','burst','network']],
  emergency_launch:        ['starter',['speed','risk']],
  rapid_iteration:         ['starter',['crit','network']],
  deadline:                ['transformer',['execute','burst']],
  kpi_review:              ['scaler',['burst','ramp']],
  product_launch:          ['transformer',['crit','burst','network']],
  process_approval:        ['starter',['shield','network']],
  backup_recovery:         ['starter',['regen']],
  compliance_check:        ['support',['debuff','regen']],
  disclaimer:              ['transformer',['shield','risk']],
  fullstack_ops:           ['transformer',['shield','burst','regen']],
  brand_impact:            ['starter',['knockback','network']],
  channel_promotion:       ['scaler',['economy','xp']],
  viral_marketing:         ['transformer',['spread','debuff','network']],
  hit_strategy:            ['scaler',['burst','ramp']],
  global_launch:           ['transformer',['spread','burst','network']],
  morning_meeting:         ['support',['xp','economy']],
  standard_sop:            ['support',['cooldown','network']],
  record_archive:          ['scaler',['xp','economy','ramp']],
  auto_office:             ['transformer',['summon','cooldown']],
  org_restructure:         ['transformer',['network','economy']],
};

for (const [id, [role, tags]] of Object.entries(cardMeta)) {
  const prefix = 'CS.cards.' + id + ' = makeCard(';
  const idx = src.indexOf(prefix);
  if (idx === -1) { console.log('NOT FOUND: ' + id); continue; }

  // Find closing paren of makeCard(...) call
  let depth = 0;
  let closeIdx = -1;
  for (let i = idx; i < src.length; i++) {
    if (src[i] === '(') depth++;
    else if (src[i] === ')') { depth--; if (depth === 0) { closeIdx = i; break; } }
  }
  if (closeIdx === -1) { console.log('UNBALANCED: ' + id); continue; }

  const tagsStr = JSON.stringify(tags);
  const insert = ', "' + role + '", ' + tagsStr;
  src = src.slice(0, closeIdx) + insert + src.slice(closeIdx);
  changeCount++;
  console.log('OK: ' + id + ' role=' + role + ' tags=[' + tags.join(',') + ']');
}

fs.writeFileSync(path, src, 'utf8');
console.log('\nDONE: ' + changeCount + ' changes written to cards.js');
