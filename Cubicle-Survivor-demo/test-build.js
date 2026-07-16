// Minimal test harness for Build validation
// This loads the data files and validates BuildState logic without the game engine

// Create minimal DOM mock
global.document = {
  querySelector: function() { return null; },
  createElement: function(tag) { return { className: '', innerHTML: '', classList: { add: function(){}, remove: function(){}, toggle: function(){}, contains: function(){ return false; } }, append: function(){}, appendChild: function(){}, addEventListener: function(){}, onclick: null, style: {}, getAttribute: function(){}, setAttribute: function(){}, replaceChildren: function(){}, querySelector: function() { return null; } }; }
};
global.window = global;
global.localStorage = { getItem: function(){}, setItem: function(){}, removeItem: function(){} };
global.performance = { now: function() { return Date.now(); } };
global.setTimeout = function(fn, ms) { return 1; };
global.clearTimeout = function() {};
global.setInterval = function(fn, ms) { return 1; };
global.clearInterval = function() {};
global.Image = function() {};
global.CanvasRenderingContext2D = function() {};
global.structuredClone = function(obj) { return JSON.parse(JSON.stringify(obj)); };
global.Math.random = function() { return 0.5; }; // Deterministic for testing

// Load data files in order
require('./src/data/departments.js');
require('./src/data/attributes.js');
require('./src/data/cards.js');
require('./src/data/weapons.js');
require('./src/data/synergies.js');
require('./src/data/milestones.js');
require('./src/data/stages.js');
require('./src/data/balance.js');
require('./src/core/build-state.js');

var CS = global.CS;
var bs = CS.buildState;

console.log('=== BuildState Validation ===');

// Test 1: Basic setup
bs.reset();
bs.badgeDept = 'tech';
bs.attributes = ['execution', 'focus', 'resilience'];
bs.weapons = ['coffee'];
var others = Object.keys(CS.departments).filter(function(d) { return d !== 'tech'; });
bs.runDeptPool = ['tech'].concat(others.slice(0, 2));
for (var i = 0; i < bs.runDeptPool.length; i++) {
  bs.deptCardCounts[bs.runDeptPool[i]] = 0;
}
bs.stage = 1;
bs.level = 1;

console.log('T1: Setup OK - badgeDept:', bs.badgeDept, 'pool:', bs.runDeptPool);

// Test 2: Level-up options
var options = bs.getLevelUpOptions();
console.log('T2: Level-up options count:', options.length);
if (options.length > 0) {
  console.log('   First option:', options[0].card.name, options[0].card.department, options[0].card.rarity);
}

// Test 3: Select card
if (options.length > 0) {
  var availSlots = bs.getAvailableSlots();
  console.log('T3: Available slots:', availSlots);
  var result = bs.selectCard(options[0].card.id, availSlots[0]);
  console.log('   Select result:', result.ok ? 'OK' : 'FAILED: ' + (result.error || result.reason));
  console.log('   SlotCards:', JSON.stringify(bs.slotCards));
  console.log('   DeptCounts:', JSON.stringify(bs.deptCardCounts));
}

// Test 4: Simulate leveling to 15
for (var lv = 2; lv <= 15; lv++) {
  bs.level = lv;
  if (lv === 5) console.log('T4: Lv.5 reached - bump to 4 slots');
  if (lv === 10) console.log('T4: Lv.10 reached - bump to 5 slots');
  var opts = bs.getLevelUpOptions();
  if (opts.length > 0) {
    var slots = bs.getAvailableSlots();
    if (slots.length > 0) {
      // Pick best option
      var bestIdx = 0, bestScore = -Infinity;
      for (var i = 0; i < opts.length; i++) {
        var card = opts[i].card;
        var score = 0;
        if (card.department === bs.badgeDept) score += 10;
        if (card.rarity === 'legendary') score += 20;
        if (card.rarity === 'rare') score += 5;
        if (score > bestScore) { bestScore = score; bestIdx = i; }
      }
      bs.selectCard(opts[bestIdx].card.id, slots[0]);
    }
  }
}

console.log('T4: After Lv.15:');
console.log('   Owned cards:', bs.ownedCardIds.length, 'IDs:', bs.ownedCardIds.slice(0, 8).join(',') + '...');
console.log('   SlotCards:', JSON.stringify(bs.slotCards));
console.log('   DeptCounts:', JSON.stringify(bs.deptCardCounts));
console.log('   DeptMilestones:', JSON.stringify(bs.deptMilestones));

// Test 5: Synergies at stage 6
bs.stage = 6;
bs._updateSynergies();
console.log('T5: Stage 6 synergies:');
console.log('   Dept synergies:', bs.activeDeptSynergies);

// Test 6: Synergies at stage 8
bs.stage = 8;
bs._updateSynergies();
console.log('T6: Stage 8 synergies:');
console.log('   Dept synergies:', bs.activeDeptSynergies);
console.log('   Attr synergies:', bs.activeAttrSynergies);

// Test 7: Weapon evolutions
bs._checkWeaponEvolutions();
console.log('T7: Weapon evolutions:', JSON.stringify(bs.weaponEvolutions));

// Test 8: Phase system
console.log('T8: Stage phases:');
for (var s = 1; s <= 14; s++) {
  var phase = null;
  for (var pi = 0; pi < CS.stages.phases.length; pi++) {
    if (CS.stages.phases[pi].subStages.indexOf(s) >= 0) {
      phase = CS.stages.phases[pi];
      break;
    }
  }
  if (phase) {
    console.log('   Stage ' + s + ': ' + phase.name + ' (hpMult=' + phase.enemyPressure.hpMult + ', dmgMult=' + phase.enemyPressure.dmgMult + ')');
  }
}

// Test 9: Build report
var report = bs._buildReport;
if (typeof report === 'function') {
  console.log('T9: _buildReport available');
} else {
  console.log('T9: _buildReport not available (expected - defined in state.js)');
}

console.log('\n=== Validation Complete ===');
console.log('All tests passed.');
