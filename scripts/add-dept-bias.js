const fs = require('fs');
const path = 'C:/Users/Administrator/.qclaw/workspace/cubicle-survivor-reforged/src/data/departments.js';
let src = fs.readFileSync(path, 'utf8');

// Add tagBias to each department after mechanicKeywords
const deptBiases = {
  tech:       'tagBias: { primary: ["chain","speed","cooldown"], secondary: ["network","ramp"] },',
  product:    'tagBias: { primary: ["crit","burst","execute"], secondary: ["pierce","risk"] },',
  ops:        'tagBias: { primary: ["shield","regen","reflect"], secondary: ["debuff","ramp"] },',
  marketing:  'tagBias: { primary: ["spread","knockback","debuff"], secondary: ["network","summon"] },',
  general:    'tagBias: { primary: ["economy","xp","cooldown"], secondary: ["summon","risk"] },',
};

for (const [dept, biasLine] of Object.entries(deptBiases)) {
  // Find the dept block and insert tagBias after mechanicKeywords line
  const marker = '      mechanicKeywords:';
  const blockStart = dept + ': {';
  const idx = src.indexOf(blockStart);
  if (idx === -1) { console.log('NOT FOUND: ' + dept); continue; }
  // Find the mechanicKeywords line within this block
  const sub = src.slice(idx);
  const kwIdx = sub.indexOf('mechanicKeywords:');
  if (kwIdx === -1) { console.log('NO KW: ' + dept); continue; }
  const kwLineEnd = sub.indexOf('\n', kwIdx);
  const insertPos = idx + kwLineEnd + 1;
  src = src.slice(0, insertPos) + '      ' + biasLine + '\n' + src.slice(insertPos);
  console.log('OK: ' + dept);
}

fs.writeFileSync(path, src, 'utf8');
console.log('DONE: departments.js updated with tagBias');
