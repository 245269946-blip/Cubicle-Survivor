const s=require('fs').readFileSync('C:/Users/Administrator/.qclaw/workspace/cubicle-survivor-reforged/src/data/weapons.js','utf8');
const weapons = [
  {id:'coffee',dept:'tech'},
  {id:'keyboard',dept:'tech'},
  {id:'marker',dept:'product'},
  {id:'stapler',dept:'product'},
  {id:'headphones',dept:'ops'},
  {id:'thermos',dept:'ops'},
  {id:'report',dept:'marketing'},
  {id:'shredder',dept:'marketing'},
  {id:'sticky_note',dept:'general'},
];
weapons.forEach(w=>{
  const idx=s.indexOf(w.id+': {');
  const block=s.slice(idx,idx+300);
  const hasTags=block.includes('tags: [');
  const hasTagDesc=block.includes('tagDescription:');
  console.log(w.id+': tags='+hasTags+' tagDesc='+hasTagDesc);
});
