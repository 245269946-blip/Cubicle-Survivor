const s=require('fs').readFileSync('C:/Users/Administrator/.qclaw/workspace/cubicle-survivor-reforged/src/data/weapons.js','utf8');
const m=s.match(/id: "(\w+)"/g);
m.forEach(x=>console.log(x));
