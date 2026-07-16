// 快速语法 + 集成测试
const fs = require('fs');
const vm = require('vm');

// 模拟浏览器环境
global.window = {};
const files = [
  'src/data/tags.js',
  'src/data/attributes.js',
  'src/data/departments.js',
  'src/data/cards.js',
  'src/data/weapons.js',
  'src/data/synergies.js',
  'src/data/milestones.js',
  'src/data/stages.js',
  'src/data/balance.js',
  'src/core/build-state.js',
];

const base = 'C:/Users/Administrator/.qclaw/workspace/cubicle-survivor-reforged/';
let errors = [];
for (const f of files) {
  try {
    const code = fs.readFileSync(base + f, 'utf8');
    vm.runInNewContext(code, { window, console });
    console.log('OK: ' + f);
  } catch (e) {
    errors.push(f + ': ' + e.message);
    console.log('FAIL: ' + f + ' - ' + e.message);
  }
}

if (errors.length === 0) {
  // 测试 Build 名称生成
  const CS = window.CS;
  CS.buildState.reset();
  CS.buildState.beginNewbie('tech_intern');
  CS.buildState.slotCards.offense = 'agile_dev';
  CS.buildState.slotCards.mechanic = 'version_iter';
  CS.buildState.deptCardCounts.tech = 2;
  CS.buildState.deptMilestones.tech = [2];
  CS.buildState.weaponEvolutions.coffee = 'coffee_chain_master';

  const name = CS.buildState.generateBuildName();
  const tagline = CS.buildState.getBuildTagline();
  const summary = CS.buildState.summarizeBuild(5, 12, 142);

  console.log('\n=== Build 测试 ===');
  console.log('名称:', name);
  console.log('标签:', tagline);
  console.log('主标签:', JSON.stringify(summary.primaryTags));
  console.log('下次建议:', summary.nextSuggestion);
  console.log('进化提示:', JSON.stringify(CS.buildState.getEvolutionHints()));

  // 测试标签条件检查
  const tagCheck = CS.buildState._checkEvolutionCondition({
    tags: { required: ['chain', 'speed'], minMatches: 2 }
  });
  console.log('标签条件(chain+speed):', tagCheck);

  const tagCheckFail = CS.buildState._checkEvolutionCondition({
    tags: { required: ['crit', 'burst'], minMatches: 2 }
  });
  console.log('标签条件(crit+burst):', tagCheckFail, '(应false)');

  console.log('\n✅ ALL TESTS PASSED');
} else {
  console.log('\n❌ ERRORS:', errors.length);
}
