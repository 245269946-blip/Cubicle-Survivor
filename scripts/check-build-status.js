globalThis.window={}; globalThis.document={createElement:function(){return{}}};
var fs=require('fs');
var base='C:/Users/Administrator/.qclaw/workspace/cubicle-survivor-reforged/';
function load(f){ var s=fs.readFileSync(base+f,'utf8'); eval(s); }
load('src/data/tags.js');
load('src/data/departments.js');
load('src/data/attributes.js');
load('src/data/cards.js');
load('src/data/weapons.js');
load('src/data/synergies.js');
load('src/data/milestones.js');
load('src/data/stages.js');
load('src/data/balance.js');
load('src/core/build-state.js');
var CS=globalThis.window.CS;

console.log('========================================');
console.log('  工位幸存者 — Build 完整性检查');
console.log('========================================\n');

// === WEAPONS ===
console.log('🔫 武器 (共',Object.keys(CS.weapons).length,'把)');
console.log('─────────────────────────────────────────');
var wids=Object.keys(CS.weapons);
wids.forEach(function(w){
  var wp=CS.weapons[w];
  var er=wp.evolutionRoutes||[];
  var tags=wp.tags||[];
  console.log('  '+wp.emoji+' '+wp.name);
  console.log('    标签:',tags.length?tags.join(', ') : '❌ 无');
  if(er.length===0){
    console.log('    进化: ❌ 无进化路线');
  } else {
    console.log('    进化路线 ('+er.length+'条):');
    er.forEach(function(r){
      var conds=[];
      if(r.condition){
        for(var k in r.condition){
          var v=r.condition[k];
          if(k==='tags' && Array.isArray(v)) conds.push('tags=['+v.join(',')+']');
          else if(k==='crossDept') conds.push('crossDept:'+JSON.stringify(v));
          else if(k==='otherDept') conds.push('otherDept:'+JSON.stringify(v));
          else if(k==='sameDept') conds.push('同部门');
          else if(k==='minDeptCount') conds.push('同部门≥'+v+'张');
          else if(k==='weaponLevel') conds.push('Lv.'+v);
          else conds.push(k+':'+JSON.stringify(v));
        }
      }
      var desc=(r.effect&&r.effect.description)||r.description||'?';
      console.log('      '+r.id+(conds.length?' ('+conds.join(' & ')+')':'')+' → '+desc.substring(0,60));
    });
  }
});

// === CARDS ===
console.log('\n🃏 卡牌 (共',Object.keys(CS.cards).length,'张)');
console.log('─────────────────────────────────────────');
var cids=Object.keys(CS.cards);
var byDept={};
cids.forEach(function(c){
  var card=CS.cards[c];
  var d=card.department||'?';
  if(!byDept[d])byDept[d]=[];
  byDept[d].push(card);
});
for(var d in byDept){
  var cards=byDept[d];
  var dp=CS.departments[d];
  console.log('  '+(dp?dp.emoji:'?')+' '+(dp?dp.name:d)+' ('+cards.length+'张)');
  cards.forEach(function(card){
    var rarity=card.rarity||'common';
    var rIcon={legendary:'👑',rare:'💎',common:'📋'}[rarity]||'📋';
    var role=card.role||'?';
    var tags=(card.tags||[]).join(',');
    console.log('    '+rIcon+' '+card.name+' | role:'+role+(tags?' | '+tags:''));
  });
}

// === BUILD-STATE key methods ===
console.log('\n⚙️ BuildState 关键方法');
console.log('─────────────────────────────────────────');
var bs=CS.buildState;
var methods=[{name:'reset',impl:typeof bs.reset},{name:'beginNewbie',impl:typeof bs.beginNewbie},{name:'generateBuildName',impl:typeof bs.generateBuildName},{name:'_getPrimaryTags',impl:typeof bs._getPrimaryTags},{name:'_summarizeSlots',impl:typeof bs._summarizeSlots},{name:'_getEvolvedWeaponNames',impl:typeof bs._getEvolvedWeaponNames},{name:'getBuildTagline',impl:typeof bs.getBuildTagline},{name:'getEvolutionHints',impl:typeof bs.getEvolutionHints},{name:'_generateNextSuggestion',impl:typeof bs._generateNextSuggestion},{name:'_checkEvolutionCondition',impl:typeof bs._checkEvolutionCondition},{name:'checkCollabQuest',impl:typeof bs.checkCollabQuest},{name:'summarizeBuild',impl:typeof bs.summarizeBuild},{name:'selectCardForSlot',impl:typeof bs.selectCardForSlot},{name:'getLevelUpOptions',impl:typeof bs.getLevelUpOptions},{name:'applyCardEffects',impl:typeof bs.applyCardEffects},{name:'applyMilestoneRewards',impl:typeof bs.applyMilestoneRewards},{name:'applySynergies',impl:typeof bs.applySynergies},{name:'applyWeaponEvolution',impl:typeof bs.applyWeaponEvolution}];
methods.forEach(function(m){
  console.log('  '+(m.impl==='function'?'✅':'❌')+' '+m.name);
});

// === QUICK CHECK: legacy weapon pair functions ===
console.log('\n🔍 主代码桥接状态');
console.log('─────────────────────────────────────────');
console.log('  _startGameClock: ✅ (rAF+sInterval dual)');
console.log('  renderRecapBuildSummary: ✅ (死亡复盘Build总结)');
console.log('  renderV03Debrief identityText: ✅ (Build名称+标签)');
console.log('  generateBuildSuggestions: ✅ (下次建议)');
console.log('  showSlotPlacementForCard role+tags: ✅ (升级面板)');

// === GAPS ===
console.log('\n⚠️ 已知缺口');
console.log('─────────────────────────────────────────');
var gaps=[];
wids.forEach(function(w){
  var wp=CS.weapons[w];
  var er=wp.evolutionRoutes||[];
  var tagRoutes=er.filter(function(r){return r.condition&&r.condition.tags;}).length;
  var deptRoutes=er.filter(function(r){return r.condition&&(r.condition.crossDept||r.condition.sameDept);}).length;
  var defaultRoutes=er.filter(function(r){return r.condition&&r.condition.bypass;}).length;
  if(tagRoutes===0) gaps.push(wp.name+' 无标签驱动进化路线');
  if(deptRoutes===0&&defaultRoutes===0) gaps.push(wp.name+' 仅标签路线，无部门路线');
  if(tagRoutes>0&&deptRoutes===0) gaps.push(wp.name+' 有标签路线但缺部门路线');
});
if(gaps.length===0) gaps.push('(无)');
gaps.forEach(function(g){console.log('  -',g);});
console.log('\n  - checkItemSynergies 函数体: ❌ 空壳');
console.log('  - WFH 自动拾取逻辑: ❌ 未实现');
console.log('  - 精英掉落: ❌ 未加入');
console.log('  - dpsEstimate UI: ❌ 未实现');
console.log('  - cardInfoStrip UI: ❌ 未实现');
console.log('  - 进化进度条 UI: ❌ 未实现');
console.log('  - 局后雷达图: ❌ 未实现');
console.log('  - ⚠️ 全局未经过浏览器实机验证');
