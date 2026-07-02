const s=require('fs').readFileSync('C:/Users/Administrator/.qclaw/workspace/cubicle-survivor-reforged/src/data/cards.js','utf8');
const ids = ['agile_dev','product_launch','fullstack_ops','global_launch','org_restructure','code_refactor','viral_marketing','deadline'];
ids.forEach(id=>{
  const i=s.indexOf('CS.cards.'+id+' = makeCard(');
  if(i===-1){console.log(id+': NOT FOUND');return;}
  let d=0,j=i; for(;j<s.length;j++){if(s[j]==='(')d++;else if(s[j]===')'){d--;if(d===0)break;}}
  const close=s.slice(j-80,j+1).replace(/\n/g,' ');
  const m=close.match(/, "(.+)", \[(.+)\]/);
  console.log(id+': role='+(m?m[1]:'?')+' tags=['+(m?m[2]:'?')+']');
});
console.log('---');
console.log('makeCard sig OK:', s.includes('slotEffects, role, tags)'));
console.log('return OK:', s.includes('role: role || "starter", tags: tags || []'));
