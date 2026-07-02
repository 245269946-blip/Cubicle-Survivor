const fs = require('fs');
const path = 'C:/Users/Administrator/.qclaw/workspace/cubicle-survivor-reforged/src/data/weapons.js';
let src = fs.readFileSync(path, 'utf8');
let changes = 0;

const weapons = [
  { id: 'coffee',      tags: ['speed','chain'],        dept: 'tech' },
  { id: 'keyboard',    tags: ['knockback','burst','speed'], dept: 'tech' },
  { id: 'marker',      tags: ['pierce','crit'],        dept: 'product' },
  { id: 'stapler',     tags: ['burst','speed'],        dept: 'product' },
  { id: 'headphones',  tags: ['shield','regen','spread'], dept: 'ops' },
  { id: 'thermos',     tags: ['regen','shield'],       dept: 'ops' },
  { id: 'report',      tags: ['spread','summon'],      dept: 'marketing' },
  { id: 'shredder',    tags: ['spread','debuff'],      dept: 'marketing' },
  { id: 'sticky_note', tags: ['summon','debuff','cooldown'], dept: 'general' },
];

for (const w of weapons) {
  // Find "department: "<dept>",\n"
  const marker = 'department: "' + w.dept + '",\n';
  const idx = src.indexOf(marker);
  if (idx === -1) { console.log('NOT FOUND: ' + w.id); continue; }
  const lineEnd = idx + marker.length;
  const tagsStr = JSON.stringify(w.tags);
  const insert = '      tags: ' + tagsStr + ',\n';
  src = src.slice(0, lineEnd) + insert + src.slice(lineEnd);
  changes++;
  console.log('OK: ' + w.id + ' tags=[' + w.tags.join(',') + ']');
}

fs.writeFileSync(path, src, 'utf8');
console.log('DONE: ' + changes + ' weapons updated');
