// ================================================================
// main.js - V2 bootstrap only.
// The pre-cleanup monolith is archived at versions/v2-pre-cleanup/main.js.
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});
  const V2 = CS.V2 || (CS.V2 = {});

  function exposePublicApi() {
    window.GameV2 = {
      startRun: V2.startRun,
      dispatch: V2.dispatch,
      getState: V2.getState,
      getViewModel: V2.getViewModel
    };

    window.__cubicleDebug = function __cubicleDebug() {
      const state = V2.getState ? V2.getState() : {};
      return {
        mode: state.mode,
        stage: state.stage && state.stage.id,
        phase: state.phaseMeta && state.phaseMeta.label,
        weaponStage: state.phaseMeta && state.phaseMeta.weaponStage,
        stageTime: state.stageTime,
        warmupTime: state.warmupTime,
        selectedWeaponId: state.selectedWeaponId,
        badgeDept: state.badgeDept,
        activeForm: state.activeForm && state.activeForm.displayName,
        loop: state.loop,
        entities: {
          enemies: state.enemies ? state.enemies.length : 0,
          projectiles: state.projectiles ? state.projectiles.length : 0,
          damageZones: state.damageZones ? state.damageZones.length : 0,
          particles: state.particles ? state.particles.length : 0,
          pickups: state.pickups ? state.pickups.length : 0
        },
        errors: window._errors || []
      };
    };

    window._testAllBuilds = function _testAllBuilds() {
      const weapons = ["marker", "thermos", "sticky_note"];
      const depts = ["tech", "product", "ops", "marketing", "general"];
      const results = [];
      weapons.forEach(function (weaponId) {
        depts.forEach(function (dept) {
          V2.startRun({ weaponId });
          V2.dispatch({ type: "SET_BADGE", dept });
          V2.dispatch({ type: "SELECT_UPGRADE", upgradeId: "damage" });
          const state = V2.getState();
          state.stage.id = 4;
          state.stage.phaseKey = "promotion";
          state.stage.phaseStep = 1;
          state.slotChoices = V2.progression.makeSlotChoices(state);
          V2.dispatch({ type: "SELECT_SLOT", slotId: "offense", action: "replace" });
          const form = state.activeForm || {};
          results.push({
            name: (CS.weapons[weaponId] && CS.weapons[weaponId].name) + " × " + V2.compat.deptName(dept),
            weaponId,
            dept,
            form: form.displayName,
            mechanicType: form.mechanicType,
            slots: Object.keys(state.slotAssignments || {}).length,
            clearedAll: !!(form.displayName && form.mechanicType && state.activeFormParams.damage > 0),
            maxStage: 5
          });
        });
      });
      V2.dispatch({ type: "RESTART" });
      return results;
    };
  }

  function init() {
    try {
      exposePublicApi();
      V2.dispatch({ type: "INIT", debug: false });
      if (V2.ui) V2.ui.bindStaticControls();
      const canvas = document.getElementById("game");
      if (V2.combat) {
        V2.combat.mount(canvas);
        V2.combat.startLoop();
      }
      if (V2.store && V2.ui) V2.store.subscribe(V2.ui.render);
      if (V2.ui) V2.ui.render();
    } catch (err) {
      if (V2.reportError) V2.reportError(err);
      else throw err;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
