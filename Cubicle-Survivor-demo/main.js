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
        demoV2Phase: state.demoV2 && state.demoV2.phase || "",
        demoV2Wave: state.demoV2 && state.demoV2.waveId || "",
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
        audio: V2.audio && V2.audio.getStatus ? V2.audio.getStatus() : null,
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
      const params = new URLSearchParams(window.location.search || "");
      const debugEnabled = params.get("debug") === "1";
      const debugQuiet = params.get("quiet") === "1";
      const debugLab = params.get("lab");
      const debugScreen = params.get("screen");
      const debugLayer = params.get("layer") || "base";
      const requestedDemoV2Phase = params.get("demoV2");
      const demoV2Phase = requestedDemoV2Phase === "phase-a" || requestedDemoV2Phase === "phase-b" || requestedDemoV2Phase === "marker-fixed" || requestedDemoV2Phase === "thermos-fixed" || requestedDemoV2Phase === "scissors-fixed" || requestedDemoV2Phase === "correction-fluid-fixed" || requestedDemoV2Phase === "four-weapon-fixed" || requestedDemoV2Phase === "four-weapon-v3" || requestedDemoV2Phase === "four-weapon-v3-1" || requestedDemoV2Phase === "four-weapon-v3-2" ? requestedDemoV2Phase : "";
      V2.dispatch({ type: "INIT", debug: debugEnabled, demoV2Phase });
      if (demoV2Phase === "phase-a") {
        document.title = "工位幸存者 Demo V2 · 阶段 A";
        const shell = document.querySelector(".game-wrap");
        const stamp = document.querySelector(".title-stamp");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V2 阶段 A");
        if (stamp) stamp.textContent = "Demo V2 · 阶段 A";
        if (subtitle) subtitle.textContent = "先验证武器和敌群是否好玩；本轮没有工牌、模块、卡槽和工坊。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "三把基础武器";
          guideCards[0].querySelector("span:last-child").textContent = "马克笔贯穿分叉、保温杯蓄热释放、即时贴落点触发。";
          guideCards[1].querySelector("strong").textContent = "四类问题波";
          guideCards[1].querySelector("span:last-child").textContent = "队列、团块、追逐和混合评审依次出现。";
          guideCards[2].querySelector("strong").textContent = "60 秒单关";
          guideCards[2].querySelector("span:last-child").textContent = "只判断武器母题，不用成长系统掩盖问题。";
          guideCards[3].querySelector("strong").textContent = "阶段门禁";
          guideCards[3].querySelector("span:last-child").textContent = "阶段 A 未通过前，不开放工牌和办公模块。";
        }
        if (startButton) startButton.textContent = "进入 60 秒测试";
      }
      if (demoV2Phase === "phase-b") {
        document.title = "工位幸存者 Demo V2 · 阶段 B";
        const shell = document.querySelector(".game-wrap");
        const stamp = document.querySelector(".title-stamp");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V2 阶段 B");
        if (stamp) stamp.textContent = "Demo V2 · 阶段 B";
        if (subtitle) subtitle.textContent = "一把武器、一个代表工牌、三次轻模块选择；验证重母题能否快速膨胀。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "30 秒读懂武器";
          guideCards[0].querySelector("span:last-child").textContent = "开局保留阶段 A 基础形态，不用成长掩盖母题。";
          guideCards[1].querySelector("strong").textContent = "唯一代表工牌";
          guideCards[1].querySelector("span:last-child").textContent = "马克笔研发、保温杯产品、即时贴行政自动定型。";
          guideCards[2].querySelector("strong").textContent = "六类办公模块";
          guideCards[2].querySelector("span:last-child").textContent = "复写、留档、转发、加急、合并、透支，单次只读一个效果。";
          guideCards[3].querySelector("strong").textContent = "3 分钟门禁";
          guideCards[3].querySelector("span:last-child").textContent = "最终必须能说清两个模块为什么互相有用。";
        }
        if (startButton) startButton.textContent = "进入 3 分钟测试";
      }
      if (demoV2Phase === "marker-fixed") {
        document.title = "工位幸存者 Demo V2.1 · 马克笔固定测试";
        const shell = document.querySelector(".game-wrap");
        const stamp = document.querySelector(".title-stamp");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V2.1 马克笔固定测试");
        if (stamp) stamp.textContent = "Demo V2.1 · 马克笔固定测试";
        if (subtitle) subtitle.textContent = "只验证马克笔：经验稳定成长，模块改变机制，材料组件制造取舍。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "一把马克笔";
          guideCards[0].querySelector("span:last-child").textContent = "远程直线激光贯穿，不开放其他武器和工牌。";
          guideCards[1].querySelector("strong").textContent = "经验属性商店";
          guideCards[1].querySelector("span:last-child").textContent = "靠近拾取经验，关后用升级点选择伤害、生命、移速或拾取。";
          guideCards[2].querySelector("strong").textContent = "四次模块选择";
          guideCards[2].querySelector("span:last-child").textContent = "前四阶段 Boss 后选择复写或留档，选择后先打一关。";
          guideCards[3].querySelector("strong").textContent = "材料组件商店";
          guideCards[3].querySelector("span:last-child").textContent = "17 关中开放 6 次四格商店，集中合成红色组件。";
        }
        if (startButton) startButton.textContent = "进入马克笔三线成长测试";
      }
      if (demoV2Phase === "thermos-fixed") {
        document.title = "工位幸存者 Demo V2.2 · 保温杯固定测试 · 视觉 V2.4";
        const shell = document.querySelector(".game-wrap");
        const stamp = document.querySelector(".title-stamp");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V2.2 保温杯固定测试");
        if (stamp) stamp.textContent = "Demo V2.2 · 保温杯固定测试 · 视觉 V2.4";
        if (subtitle) subtitle.textContent = "只验证保温杯：共享近距扇面、冷凝铺场，以及把聚焦击杀转成死亡热浪。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "近距正面扇面";
          guideCards[0].querySelector("span:last-child").textContent = "所有喷射组共享冷却，只覆盖玩家正面的有限角度。";
          guideCards[1].querySelector("strong").textContent = "冷凝区域路线";
          guideCards[1].querySelector("span:last-child").textContent = "沿喷射路径增加持续区域数量，依靠范围与持续时间铺场。";
          guideCards[2].querySelector("strong").textContent = "击杀热浪路线";
          guideCards[2].querySelector("span:last-child").textContent = "聚焦低生命目标，真实击杀后释放一次不连锁热浪。";
          guideCards[3].querySelector("strong").textContent = "同一固定框架";
          guideCards[3].querySelector("span:last-child").textContent = "17 关、4 次模块与 6 次组件商店和 V2.1 保持可比较。";
        }
        if (startButton) startButton.textContent = "进入保温杯双路线测试";
      }
      if (demoV2Phase === "scissors-fixed") {
        document.title = "工位幸存者 Demo V2.3 · 剪刀固定测试 · 视觉 V2.4";
        const shell = document.querySelector(".game-wrap");
        const stamp = document.querySelector(".title-stamp");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V2.3 剪刀固定测试");
        if (stamp) stamp.textContent = "Demo V2.3 · 剪刀固定测试 · 视觉 V2.4";
        if (subtitle) subtitle.textContent = "只验证剪刀：贴身近战时间线、轻步进场、合刃/张刃路线，以及低血临时安全区。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "纯近战动作轮";
          guideCards[0].querySelector("span:last-child").textContent = "每轮锁定一个方向，先完成合刃，再完成张刃；动作结束前不会开启下一轮。";
          guideCards[1].querySelector("strong").textContent = "轻步闪身";
          guideCards[1].querySelector("span:last-child").textContent = "时间与完整攻击轮充能；满后在下次攻击前自动穿入敌群，本身不造成伤害。";
          guideCards[2].querySelector("strong").textContent = "合刃与张刃";
          guideCards[2].querySelector("span:last-child").textContent = "窄线突刺可进化为减速裁断；短宽连剪可进化为按命中层数处决。";
          guideCards[3].querySelector("strong").textContent = "固定低血安全区";
          guideCards[3].querySelector("span:last-child").textContent = "30% 生命以下短暂挡住外部射弹；近战接触与区域内攻击依旧危险。";
        }
        if (startButton) startButton.textContent = "进入剪刀双路线测试";
      }
      if (demoV2Phase === "correction-fluid-fixed") {
        document.title = "工位幸存者 Demo V2.5 · 修正液固定测试";
        const shell = document.querySelector(".game-wrap");
        const stamp = document.querySelector(".title-stamp");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V2.5 修正液固定测试");
        if (stamp) stamp.textContent = "Demo V2.5 · 修正液错误系统";
        if (subtitle) subtitle.textContent = "白色修正介质制造错误；青与品红故障霓虹提示污染扩散和最终纠错。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "三层错误状态";
          guideCards[0].querySelector("span:last-child").textContent = "减速、修正液易伤、错误过载逐层显形；基础喷射不是主要输出。";
          guideCards[1].querySelector("strong").textContent = "错误扩散";
          guideCards[1].querySelector("span:last-child").textContent = "过载目标死亡后留下污染区，后期融合并触发系统崩溃。";
          guideCards[2].querySelector("strong").textContent = "致命纠错";
          guideCards[2].querySelector("span:last-child").textContent = "同时培养多个错误目标，最终锁定最高错误目标执行纠错。";
          guideCards[3].querySelector("strong").textContent = "潮流故障视觉";
          guideCards[3].querySelector("span:last-child").textContent = "办公物件只保留在武器本体；战斗层使用白漆、扫描线和赛博霓虹错误码。";
        }
        if (startButton) startButton.textContent = "进入修正液错误系统测试";
      }
      if (demoV2Phase === "four-weapon-fixed") {
        document.title = "工位幸存者 Demo V2.7 · 四武器可玩版";
        const shell = document.querySelector(".game-wrap");
        const stamp = document.querySelector(".title-stamp");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V2.7 四武器可玩版");
        if (stamp) stamp.textContent = "Demo V2.7 · 四武器可玩版";
        if (subtitle) subtitle.textContent = "暗色办公室只是底板：四种办公工具在持续压力中异化成路径、空间、位移和错误状态超能力。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "四种战斗关系";
          guideCards[0].querySelector("span:last-child").textContent = "马克笔改路径，保温杯改空间，剪刀改自身位置，修正液改敌人状态。";
          guideCards[1].querySelector("strong").textContent = "同一成长框架";
          guideCards[1].querySelector("span:last-child").textContent = "每把武器都使用 5 阶段 17 关、5 次模块选择和 6 次组件商店。";
          guideCards[2].querySelector("strong").textContent = "武器保持独立母题";
          guideCards[2].querySelector("span:last-child").textContent = "每把武器保留材质母题，只在攻击、状态和终局节点出现赛博高光。";
          guideCards[3].querySelector("strong").textContent = "错误系统故障感";
          guideCards[3].querySelector("span:last-child").textContent = "白色修正介质承载可读性，青/品红错误码承载污染、过载与纠错爆发。";
        }
        if (startButton) startButton.textContent = "选择一把异化办公武器";
      }
      if (demoV2Phase === "four-weapon-fixed") {
        document.title = "工位幸存者 Demo V2.9 · 四武器一致性修正版";
        const stamp = document.querySelector(".title-stamp");
        const shell = document.querySelector(".game-wrap");
        if (stamp) stamp.textContent = "Demo V2.9 · 四武器一致性修正版";
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V2.9 四武器一致性修正版");
      }
      if (demoV2Phase === "four-weapon-v3") {
        document.title = "工位幸存者 Demo V3.0 · 霓虹战斗感知版";
        const stamp = document.querySelector(".title-stamp");
        const shell = document.querySelector(".game-wrap");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (stamp) stamp.textContent = "Demo V3.0 · 霓虹战斗感知版";
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V3.0 霓虹战斗感知版");
        if (subtitle) subtitle.textContent = "先看懂攻击如何改变敌人和战场，再把办公工具推向失控；本轮只强化已有战斗因果与反馈。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "四种可见因果";
          guideCards[0].querySelector("span:last-child").textContent = "马克笔改路径，保温杯改空间，剪刀改位置，修正液改敌人状态。";
          guideCards[1].querySelector("strong").textContent = "命中与击杀确认";
          guideCards[1].querySelector("span:last-child").textContent = "敌人受击会形变，危险攻击先预告，击杀按武器家族留下不同确认。";
          guideCards[2].querySelector("strong").textContent = "成长立即生效";
          guideCards[2].querySelector("span:last-child").textContent = "属性、模块和组件完成后，回到战斗会短暂说明下一轮攻击发生了什么变化。";
          guideCards[3].querySelector("strong").textContent = "都市霓虹信息层";
          guideCards[3].querySelector("span:last-child").textContent = "青色表示路径与信息，品红表示错误与危险，金色表示成长和结算确认。";
        }
        if (startButton) startButton.textContent = "进入四武器霓虹实战";
      }
      if (demoV2Phase === "four-weapon-v3-1") {
        document.title = "工位幸存者 Demo V3.1 · 高频割草与技能轮廓版";
        const stamp = document.querySelector(".title-stamp");
        const shell = document.querySelector(".game-wrap");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (stamp) stamp.textContent = "Demo V3.1 · 高频割草与技能轮廓版";
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V3.1 高频割草与技能轮廓版");
        if (subtitle) subtitle.textContent = "把同一份输出拆成更多次攻击，让密集敌群持续承接穿透、铺场、连剪与状态传播。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "小数字，高频率";
          guideCards[0].querySelector("span:last-child").textContent = "单次伤害降低，攻击间隔缩短；成长会表现为更多攻击事件，而不是一击清空。";
          guideCards[1].querySelector("strong").textContent = "敌群持续补位";
          guideCards[1].querySelector("span:last-child").textContent = "普通关提高敌群地板、批次和配额，让穿透、区域和传播始终有目标可吃。";
          guideCards[2].querySelector("strong").textContent = "技能轮廓分离";
          guideCards[2].querySelector("span:last-child").textContent = "热浪是金色爆心与外扩压力环，冷凝保持青色留场；每条路线拥有不同运动方式。";
          guideCards[3].querySelector("strong").textContent = "风险仍然存在";
          guideCards[3].querySelector("span:last-child").textContent = "Boss 关只温和增加杂兵；剪刀指向落在武器前方地面，不遮挡持械动作。";
        }
        if (startButton) startButton.textContent = "进入高频霓虹割草实战";
      }
      if (demoV2Phase === "four-weapon-v3-2") {
        document.title = "工位幸存者 Demo V3.2 · 深层割草预算与霓虹增幅版";
        const stamp = document.querySelector(".title-stamp");
        const shell = document.querySelector(".game-wrap");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (stamp) stamp.textContent = "Demo V3.2 · 深层割草预算与霓虹增幅版";
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V3.2 深层割草预算与霓虹增幅版");
        if (subtitle) subtitle.textContent = "继续压低单击、缩短攻击空窗并抬高有效敌群，让路径、空间、位移与状态机制持续发生；霓虹辉光只附着于真实判定。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "三角预算联动";
          guideCards[0].querySelector("span:last-child").textContent = "单击更小、攻击更快、目标更多；三项同时调整，避免秒怪空屏和拥挤刮痧。";
          guideCards[1].querySelector("strong").textContent = "有效敌群地板";
          guideCards[1].querySelector("span:last-child").textContent = "普通关维持更高同时在场数和补位批次，Boss关只做受控增量。";
          guideCards[2].querySelector("strong").textContent = "双层霓虹辉光";
          guideCards[2].querySelector("span:last-child").textContent = "攻击拥有低透明外辉光和高对比核心，残影跟随真实轨迹、区域和冲击波。";
          guideCards[3].querySelector("strong").textContent = "危险信息优先";
          guideCards[3].querySelector("span:last-child").textContent = "霓虹不会扩大命中判定，也不会覆盖敌人血条、Boss轮廓和危险预警。";
        }
        if (startButton) startButton.textContent = "进入深层霓虹割草实战";
      }
      if (document.body) document.body.dataset.debugQuiet = debugQuiet ? "1" : "0";
      if (debugEnabled) {
        const debugWeapon = params.get("weapon");
        const debugDept = params.get("dept");
        if (debugScreen === "weapon_select") V2.getState().mode = "weapon_select";
        if (["marker", "thermos", "sticky_note", "scissors", "correction_fluid"].indexOf(debugWeapon) >= 0) {
          V2.startRun({ weaponId: debugWeapon });
          if (["tech", "product", "ops", "marketing", "general"].indexOf(debugDept) >= 0) {
            V2.dispatch({ type: "SET_BADGE", dept: debugDept });
          }
          const debugState = V2.getState();
          debugState.warmupTime = 0;
          if (demoV2Phase === "phase-b" && debugScreen !== "module" && params.get("modules") && V2.demoV2 && V2.demoV2.phaseB) {
            V2.demoV2.phaseB.applyIdentity(debugState);
            String(params.get("modules") || "").split(",").filter(Boolean).forEach(function (moduleId) {
              if (V2.demoV2.phaseB.modules[moduleId]) V2.demoV2.phaseB.applyModule(debugState, moduleId);
            });
          }
          if (demoV2Phase === "marker-fixed" && V2.demoV2 && V2.demoV2.markerFixed) {
            String(params.get("modules") || "").split(",").filter(Boolean).forEach(function (moduleId) {
              if (V2.demoV2.markerFixed.modules[moduleId]) V2.demoV2.markerFixed.applyModule(debugState, moduleId, true);
            });
            if (debugScreen === "module") {
              V2.demoV2.markerFixed.startEncounter(debugState, 2);
              V2.demoV2.markerFixed.completeEncounter(debugState, true);
            }
            if (debugScreen === "collection") {
              const encounter = V2.demoV2.markerFixed.currentEncounter(debugState);
              debugState.pickups = [
                { type: "xp", amount: 24, x: debugState.player.x + 180, y: debugState.player.y + 60, radius: 7, color: "#4a9eff" },
                { type: "material", amount: 2, x: debugState.player.x - 160, y: debugState.player.y - 40, radius: 7, color: "#ffd700", markerFixedDrop: true }
              ];
              debugState.demoV2.marker.encounterSpawned = encounter.spawnTotal;
              debugState.stageKills = debugState.stage.targetKills;
              V2.demoV2.markerFixed.completeEncounter(debugState);
            }
            if (debugScreen === "upgrade") {
              debugState.demoV2.marker.pendingExperiencePoints = 2;
              debugState.upgradeChoices = V2.demoV2.markerFixed.makeExperienceChoices(debugState);
              debugState.mode = "level_up";
            }
            if (debugScreen === "component_shop" || debugScreen === "component_stat") {
              const requestedShop = debugScreen === "component_stat" ? 1 : Math.max(1, Math.min(6, Number(params.get("markerShop") || 1)));
              const targetShopEncounter = V2.demoV2.markerFixed.shopEncounters[requestedShop - 1];
              let debugGuard = 0;
              while (debugState.demoV2.marker.currentEncounterIndex + 1 <= targetShopEncounter && debugGuard < 20) {
                V2.demoV2.markerFixed.completeEncounter(debugState, true);
                if (debugState.mode === "module_select") {
                  V2.demoV2.markerFixed.applyModule(debugState, "copy");
                }
                if (debugState.mode === "component_shop") {
                  if (debugState.demoV2.marker.currentShopEncounter === targetShopEncounter) break;
                  V2.demoV2.markerFixed.closeShop(debugState);
                }
                debugGuard += 1;
              }
              if (debugScreen === "component_stat") {
                const offer = { id: "debug-component", partId: "body", statId: "attackSpeed", cost: 7, sold: false, locked: false };
                debugState.demoV2.marker.offers = [offer];
                debugState.materials = Math.max(20, debugState.materials);
                V2.demoV2.markerFixed.buyComponent(debugState, offer.id);
              }
            }
          }
          if (demoV2Phase && demoV2Phase !== "phase-a" && demoV2Phase !== "phase-b" && demoV2Phase !== "marker-fixed" && V2.getDemoV2FixedTestConfig) {
            const config = V2.getDemoV2FixedTestConfig(debugState);
            const test = config && debugState.demoV2[config.runtimeKey];
            if (!config || !test) throw new Error("Missing fixed-test debug config: " + demoV2Phase);
            String(params.get("modules") || "").split(",").filter(Boolean).forEach(function (moduleId) {
              if (config.modules[moduleId]) config.applyModule(debugState, moduleId, true);
            });
            if (debugScreen === "module") {
              config.startEncounter(debugState, 2);
              config.completeEncounter(debugState, true);
            }
            if (debugScreen === "collection") {
              const encounter = config.currentEncounter(debugState);
              debugState.pickups = [
                { type: "xp", amount: 24, x: debugState.player.x + 180, y: debugState.player.y + 60, radius: 7, color: "#4a9eff" },
                { type: "material", amount: 2, x: debugState.player.x - 160, y: debugState.player.y - 40, radius: 7, color: "#ffd700", markerFixedDrop: true }
              ];
              test.encounterSpawned = encounter.spawnTotal;
              debugState.stageKills = debugState.stage.targetKills;
              config.completeEncounter(debugState);
            }
            if (debugScreen === "upgrade") {
              test.pendingExperiencePoints = 2;
              debugState.upgradeChoices = config.makeExperienceChoices(debugState);
              debugState.mode = "level_up";
            }
            if (debugScreen === "component_shop") {
              test.currentEncounterIndex = 1;
              config.completeEncounter(debugState, true);
            }
          }
          if (V2.progression) {
            if (debugScreen === "weapon_select") debugState.mode = "weapon_select";
            if (debugLayer === "promotion" || debugLayer === "mastery") {
              debugState.stage = JSON.parse(JSON.stringify(V2.store.stageBlueprints[6]));
              V2.progression.applyPromotion(debugState);
            }
            if (debugLayer === "mastery") {
              debugState.stage = JSON.parse(JSON.stringify(V2.store.stageBlueprints[9]));
              V2.progression.applyMastery(debugState);
            }
            const debugSlot = params.get("slot");
            if (["offense", "survival", "resource", "mechanic", "cost"].indexOf(debugSlot) >= 0) {
              debugState.stage = { id: 6, phaseKey: "promotion", phaseStep: 4 };
              V2.progression.applySlotChoice(debugState, debugSlot, "replace");
            }
            const debugSecondary = params.get("secondary");
            if (["tech", "product", "ops", "marketing", "general"].indexOf(debugSecondary) >= 0 && debugSecondary !== debugDept) {
              V2.progression.applyCrossDepartment(debugState, debugSecondary);
            }
            const debugSupport = params.get("support");
            if (["marker", "thermos", "sticky_note"].indexOf(debugSupport) >= 0 && debugSupport !== debugWeapon) {
              V2.progression.applyCrossWeapon(debugState, debugSupport);
            }
            if (debugScreen === "slot" && debugState.badgeDept) {
              const requestedStep = Math.max(1, Math.min(4, Number(params.get("slotStep")) || 1));
              debugState.stage = { id: 3 + requestedStep, phaseKey: "promotion", phaseStep: requestedStep };
              if (params.get("slotFilled") === "1") {
                const filledNames = {
                  offense: "主轴增压",
                  survival: "容错回路",
                  resource: "资源回收",
                  mechanic: "规则改写",
                  cost: "高压模式"
                };
                Object.keys(filledNames).forEach(function (slotId) {
                  const def = V2.progression.SLOT_DEFS[slotId];
                  if (def && requestedStep >= def.unlock) debugState.slotAssignments[slotId] = filledNames[slotId];
                });
              }
              debugState.slotChoices = V2.progression.makeSlotChoices(debugState);
              debugState.flags.slotUnlocked = true;
              debugState.mode = "slot_select";
            }
            if (debugScreen === "badge") debugState.mode = "badge_select";
            if (debugScreen === "upgrade" && !V2.getDemoV2FixedTestConfig(demoV2Phase)) {
              debugState.upgradeChoices = V2.progression.makeUpgradeChoices(debugState);
              debugState.previousMode = "combat";
              debugState.mode = "level_up";
            }
            if (debugScreen === "module" && demoV2Phase === "phase-b" && V2.demoV2 && V2.demoV2.phaseB) {
              V2.demoV2.phaseB.applyIdentity(debugState);
              const debugModules = String(params.get("modules") || "").split(",").filter(Boolean);
              debugModules.forEach(function (moduleId) {
                if (V2.demoV2.phaseB.modules[moduleId]) V2.demoV2.phaseB.applyModule(debugState, moduleId);
              });
              debugState.demoV2.moduleChoices = V2.demoV2.phaseB.makeChoices(debugState);
              debugState.previousMode = "combat";
              debugState.mode = "module_select";
            }
            if (debugScreen === "armory") {
              debugState.materials = Math.max(60, debugState.materials || 0);
              debugState.shopOffers = V2.progression.makeShopOffers(debugState);
              debugState.mode = "armory";
            }
            if (debugScreen === "secondary_badge") debugState.mode = "secondary_badge_select";
            if (debugScreen === "support_weapon") debugState.mode = "support_weapon_select";
            if (debugScreen === "combat") {
              debugState.mode = "combat";
              debugState.warmupTime = params.get("warmup") === "1" ? 2.4 : 0;
              if (V2.getDemoV2FixedTestConfig(demoV2Phase)) {
                debugState.stageTime = Number(debugState.stage && debugState.stage.duration) || 0;
                debugState.stageKills = 0;
              } else {
                debugState.stageTime = Math.max(45, Number(debugState.stage && debugState.stage.duration) || 0);
                debugState.stageKills = Math.min(6, Math.max(0, (debugState.stage && debugState.stage.targetKills || 1) - 1));
              }
            }
            if (debugScreen === "result") {
              debugState.flags.won = true;
              if (params.get("resultFilled") === "1") {
                debugState.level = 12;
                debugState.kills = 186;
                debugState.materials = 74;
                debugState.stats.damageDone = {
                  marker_tech: 18240,
                  marker_split: 8420,
                  marker_secondary_split: 3180,
                  support_thermos: 1760,
                  line_zone: 920
                };
                if (demoV2Phase === "phase-a") {
                  debugState.level = 1;
                  debugState.materials = 0;
                  debugState.demoV2.wavesSeen = ["queue", "cluster", "pursuit", "review"];
                  debugState.demoV2.peakEnemies = 58;
                  debugState.stats.peakEnemies = 58;
                }
              }
              debugState.mode = "result";
            }
            if (debugScreen === "pause") {
              debugState.previousMode = "combat";
              debugState.mode = "paused";
            }
          }
          if (debugScreen && V2.combat && V2.combat.stopLoop) V2.combat.stopLoop();
          if (document.body) document.body.dataset.debugLayer = debugLayer;
        }
      }
      if (V2.ui) V2.ui.bindStaticControls();
      const canvas = document.getElementById("game");
      if (V2.combat) {
        V2.combat.mount(canvas);
        if (debugEnabled && debugLab && V2.combat.runMechanicLab) V2.combat.runMechanicLab(debugLab);
        else if (debugEnabled && debugScreen) V2.combat.draw();
        else V2.combat.startLoop();
      }
      if (V2.store && V2.ui) V2.store.subscribe(V2.ui.render);
      if (V2.ui) V2.ui.render();
      if (debugEnabled && debugLab && V2.combat) V2.combat.draw();
      if (debugEnabled && (debugScreen || debugLab) && V2.combat) {
        const redrawStaticDebugFrame = function () {
          V2.combat.draw();
          if (V2.ui) V2.ui.render();
        };
        window.addEventListener("load", redrawStaticDebugFrame, { once: true });
        window.setTimeout(redrawStaticDebugFrame, 180);
        window.setTimeout(redrawStaticDebugFrame, 720);
      }
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
