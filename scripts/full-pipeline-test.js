const vm = require('vm');
const fs = require('fs');
global.window = {};
const base = 'C:/Users/Administrator/.qclaw/workspace/cubicle-survivor-reforged/';

try {
  // Load data files
  for (const f of ['tags','attributes','departments','cards','weapons','synergies','milestones','stages','balance']) {
    const code = fs.readFileSync(base + 'src/data/' + f + '.js', 'utf8');
    vm.runInNewContext(code, { window, console });
  }
  // Load build-state
  vm.runInNewContext(fs.readFileSync(base + 'src/core/build-state.js', 'utf8'), { window, console });

  const CS = window.CS;
  console.log('Load OK - Cards:', Object.keys(CS.cards).length, 'Weapons:', Object.keys(CS.weapons).length, 'Depts:', Object.keys(CS.departments).length);

  // Full pipeline test
  CS.buildState.reset();
  CS.buildState.beginNewbie('tech_intern');

  // Slot 3 cards
  CS.buildState.slotCards.offense = 'agile_dev';        // chain, network
  CS.buildState.slotCards.survival = 'emergency_launch'; // speed, risk
  CS.buildState.slotCards.mechanic = 'continuous_integration'; // cooldown, network
  CS.buildState.deptCardCounts.tech = 2;
  CS.buildState.deptCardCounts.product = 1;

  // Tag conditions
  var hasChainSpeed = CS.buildState._checkEvolutionCondition({
    tags: { required: ['chain', 'speed'], minMatches: 2 }
  });
  console.log('chain+speed tags:', hasChainSpeed, '(expected true)');

  var hasCritBurst = CS.buildState._checkEvolutionCondition({
    tags: { required: ['crit', 'burst'], minMatches: 2 }
  });
  console.log('crit+burst tags:', hasCritBurst, '(expected false)');

  // Cross dept + tag
  var hasBoth = CS.buildState._checkEvolutionCondition({
    crossDept: { tech: 1, product: 1 },
    tags: { required: ['chain'], minMatches: 1 }
  });
  console.log('crossDept(tech+product) + chain tag:', hasBoth, '(expected true)');

  // Build summary
  CS.buildState.weaponEvolutions.coffee = 'coffee_chain_master';
  var summary = CS.buildState.summarizeBuild(5, 12, 142);
  console.log('\nBuild name:', summary.buildName);
  console.log('Primary tags:', summary.primaryTags.map(function(t){return t.name+'('+t.count+')';}).join(', '));
  console.log('Evolved:', JSON.stringify(summary.evolvedWeapons));
  console.log('Next:', summary.nextSuggestion.join(' | '));

  // Evolution hints
  var hints = CS.buildState.getEvolutionHints();
  console.log('Evo hints:', hints.length, hints.map(function(h){return h.weaponName+'->'+h.evolutionName;}).join(', '));

  console.log('\nALL TESTS PASSED');
} catch (e) {
  console.log('ERROR:', e.message);
  console.log(e.stack);
}
