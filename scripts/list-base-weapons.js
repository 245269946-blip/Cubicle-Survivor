const s=require('fs').readFileSync('C:/Users/Administrator/.qclaw/workspace/cubicle-survivor-reforged/src/data/weapons.js','utf8');
const ids=[];
let m;
const re=/CS\.weapons\.(\w+) = \{/g;
while((m=re.exec(s))!=null) ids.push(m[1]);
console.log(ids.join(', '));
console.log('Count:', ids.length);
