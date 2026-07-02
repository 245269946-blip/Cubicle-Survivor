const src = require('fs').readFileSync('C:/Users/Administrator/.qclaw/workspace/cubicle-survivor-reforged/src/data/cards.js','utf8');
const cardDefs = src.match(/CS\.cards\.\w+ = makeCard\(/g);
const roleFields = src.match(/role: "(\w+)"/g);
const tagArrays = src.match(/tags: \[/g);
console.log('Card definitions:', cardDefs ? cardDefs.length : 0);
console.log('role fields:', roleFields ? roleFields.length : 0);
console.log('tags arrays:', tagArrays ? tagArrays.length : 0);
// Show a sample
const sampleIdx = src.indexOf('CS.cards.agile_dev');
if (sampleIdx >= 0) {
  const snippet = src.slice(sampleIdx, sampleIdx + 250);
  console.log('\n--- Sample (agile_dev) ---');
  console.log(snippet);
}
