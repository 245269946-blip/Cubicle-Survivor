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
      const demoV2Phase = requestedDemoV2Phase === "phase-a" || requestedDemoV2Phase === "phase-b" || requestedDemoV2Phase === "marker-fixed" || requestedDemoV2Phase === "thermos-fixed" || requestedDemoV2Phase === "scissors-fixed" || requestedDemoV2Phase === "correction-fluid-fixed" || requestedDemoV2Phase === "four-weapon-fixed" || requestedDemoV2Phase === "four-weapon-v3" || requestedDemoV2Phase === "four-weapon-v3-1" || requestedDemoV2Phase === "four-weapon-v3-2" || requestedDemoV2Phase === "four-weapon-v3-3" || requestedDemoV2Phase === "four-weapon-v3-4" || requestedDemoV2Phase === "four-weapon-v3-5" || requestedDemoV2Phase === "four-weapon-v3-6" || requestedDemoV2Phase === "four-weapon-v3-7" || requestedDemoV2Phase === "four-weapon-v3-8" || requestedDemoV2Phase === "four-weapon-v3-9" || requestedDemoV2Phase === "four-weapon-v3-10" || requestedDemoV2Phase === "four-weapon-v3-11" || requestedDemoV2Phase === "four-weapon-v3-12" || requestedDemoV2Phase === "four-weapon-v3-13" || requestedDemoV2Phase === "four-weapon-v3-14" ? requestedDemoV2Phase : "";
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
      if (demoV2Phase === "four-weapon-v3-3") {
        document.title = "工位幸存者 Demo V3.3 · 修正液前期循环强化版";
        const stamp = document.querySelector(".title-stamp");
        const shell = document.querySelector(".game-wrap");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (stamp) stamp.textContent = "Demo V3.3 · 修正液前期循环强化版";
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V3.3 修正液前期循环强化版");
        if (subtitle) subtitle.textContent = "延续 V3.2 的高频敌群与霓虹反馈，修正液主喷涂命中后会向一个近邻目标溅写，让错误循环从第一阶段就能转动。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "主喷涂仍是单锁定";
          guideCards[0].querySelector("span:last-child").textContent = "优先处理最近威胁，保留修正液围绕目标培养错误的核心操作。";
          guideCards[1].querySelector("strong").textContent = "液体近邻溅写";
          guideCards[1].querySelector("span:last-child").textContent = "命中后向附近一个敌人追加弱伤害和1层错误，缓解第一阶段单点周转困难。";
          guideCards[2].querySelector("strong").textContent = "多目标路线不被替代";
          guideCards[2].querySelector("span:last-child").textContent = "致命纠错 Lv1 仍提供两个独立主目标；选中后基础溅写关闭，升级差异清晰。";
          guideCards[3].querySelector("strong").textContent = "其余三武器保持 V3.2";
          guideCards[3].querySelector("span:last-child").textContent = "怪群密度、低伤高频预算和双层霓虹表现不做额外漂移。";
        }
        if (startButton) startButton.textContent = "进入修正液循环强化实战";
      }
      if (demoV2Phase === "four-weapon-v3-4") {
        document.title = "工位幸存者 Demo V3.4 · Boss机制与环形战场版";
        const stamp = document.querySelector(".title-stamp");
        const shell = document.querySelector(".game-wrap");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (stamp) stamp.textContent = "Demo V3.4 · Boss机制与环形战场版";
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V3.4 Boss机制与环形战场版");
        if (subtitle) subtitle.textContent = "从战场中心进入一局，怪群沿完整环形边界随机到场；Boss会先给出真实危险轨迹，再释放锁定走廊或带安全缺口的弹幕。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "战场中心出生";
          guideCards[0].querySelector("span:last-child").textContent = "开局拥有四向一致的观察与移动空间，不再从地图左上角被迫单向推进。";
          guideCards[1].querySelector("strong").textContent = "完整环形来敌";
          guideCards[1].querySelector("span:last-child").textContent = "每批怪物从随机角度进入；队列和集群仍保留阵型，但不会固定挤在四个出口。";
          guideCards[2].querySelector("strong").textContent = "Boss先读招再受伤";
          guideCards[2].querySelector("span:last-child").textContent = "品红走廊需要横向躲避，琥珀弹幕必须寻找预先标出的安全缺口。";
          guideCards[3].querySelector("strong").textContent = "Build暂不扩容";
          guideCards[3].querySelector("span:last-child").textContent = "四把武器、模块与组件沿用 V3.3，本轮只验证空间公平性与Boss战斗内容。";
        }
        if (startButton) startButton.textContent = "进入 Demo V3.4 实战";
      }
      if (demoV2Phase === "four-weapon-v3-5") {
        document.title = "工位幸存者 Demo V3.5 · 持续压力与属性兑现版";
        const stamp = document.querySelector(".title-stamp");
        const shell = document.querySelector(".game-wrap");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (stamp) stamp.textContent = "Demo V3.5 · 持续压力与属性兑现版";
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V3.5 持续压力与属性兑现版");
        if (subtitle) subtitle.textContent = "怪群在整关持续压入，快速敌人、射手和冲刺单位更快形成接敌压力；Boss在专属招式之间仍会继续进攻。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "整关持续放量";
          guideCards[0].querySelector("span:last-child").textContent = "固定配额按战斗进度逐步释放，不再开场十秒全部聚成一团。";
          guideCards[1].querySelector("strong").textContent = "更快接敌与行为压力";
          guideCards[1].querySelector("span:last-child").textContent = "近战靠近更快，远程弹体和冲刺频率同步提高，站桩会持续承受威胁。";
          guideCards[2].querySelector("strong").textContent = "Boss连续进攻";
          guideCards[2].querySelector("span:last-child").textContent = "Boss提高生命和专属招式频率，并在招式冷却期间恢复射击或冲刺。";
          guideCards[3].querySelector("strong").textContent = "属性改变攻击形态";
          guideCards[3].querySelector("span:last-child").textContent = "范围会更明显地扩大线宽、并行间距、扇面、近战覆盖和错误区域。";
        }
        if (startButton) startButton.textContent = "进入 Demo V3.5 高压实战";
      }
      if (demoV2Phase === "four-weapon-v3-6") {
        document.title = "工位幸存者 Demo V3.6 · 马克笔人武器实体化版";
        const stamp = document.querySelector(".title-stamp");
        const shell = document.querySelector(".game-wrap");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (stamp) stamp.textContent = "Demo V3.6 · 马克笔人武器实体化版";
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V3.6 马克笔人武器实体化版");
        if (subtitle) subtitle.textContent = "沿用 V3.5 的完整数值与压力曲线，把马克笔实验中的穿戴、瞄准和模块光感正式接入四武器试玩。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "笔跟随真实攻击";
          guideCards[0].querySelector("span:last-child").textContent = "马克笔只跟随当前目标方向，笔尖位置与真正发出的激光保持一致。";
          guideCards[1].querySelector("strong").textContent = "墨盒跟随身体";
          guideCards[1].querySelector("span:last-child").textContent = "复写和留档墨盒固定在背部支架，不会跟着攻击方向脱离穿戴关系。";
          guideCards[2].querySelector("strong").textContent = "等级进入光感";
          guideCards[2].querySelector("span:last-child").textContent = "复写用暖黄、留档用冷青，模块等级越高，墨盒核心和外围辉光越明确。";
          guideCards[3].querySelector("strong").textContent = "V3.5 数值原样继承";
          guideCards[3].querySelector("span:last-child").textContent = "怪物、Boss、组件、模块与成长数值不改，本版只验证武器实体成长是否看得见。";
        }
        if (startButton) startButton.textContent = "进入 Demo V3.6 实战";
      }
      if (demoV2Phase === "four-weapon-v3-7") {
        document.title = "工位幸存者 Demo V3.7 · 保温杯压力工位异化版";
        const stamp = document.querySelector(".title-stamp");
        const shell = document.querySelector(".game-wrap");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (stamp) stamp.textContent = "Demo V3.7 · 保温杯压力工位异化版";
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V3.7 保温杯压力工位异化版");
        if (subtitle) subtitle.textContent = "沿用 V3.6 的全部数值和马克笔实体化，把保温杯、冷凝仓、热浪储压仓与真实蒸汽出口接入同一套穿戴因果链。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "杯口跟随真实攻击";
          guideCards[0].querySelector("span:last-child").textContent = "保温杯靠近角色，只有杯盖喷口朝向当前敌群；蒸汽从真实喷口向外展开。";
          guideCards[1].querySelector("strong").textContent = "压力架跟随身体";
          guideCards[1].querySelector("span:last-child").textContent = "冷凝仓和热浪储压仓共用背部支架，不随自动瞄准旋转，也不会悬空漂移。";
          guideCards[2].querySelector("strong").textContent = "路线长成实体";
          guideCards[2].querySelector("span:last-child").textContent = "冷凝用冷青液窗与线圈，热浪用琥珀压力表与泄压口；等级提升会增加真实外挂模块。";
          guideCards[3].querySelector("strong").textContent = "V3.6 数值原样继承";
          guideCards[3].querySelector("span:last-child").textContent = "怪物、Boss、组件、模块和伤害数值不改，本版只验证保温杯成长是否真正看得见。";
        }
        if (startButton) startButton.textContent = "进入 Demo V3.7 实战";
      }
      if (demoV2Phase === "four-weapon-v3-8") {
        document.title = "工位幸存者 Demo V3.8 · 保温杯双路泄压反馈版";
        const stamp = document.querySelector(".title-stamp");
        const shell = document.querySelector(".game-wrap");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (stamp) stamp.textContent = "Demo V3.8 · 保温杯双路泄压反馈版";
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V3.8 保温杯双路泄压反馈版");
        if (subtitle) subtitle.textContent = "沿用 V3.7 的全部数值和穿戴结构，让背部压力装置在每轮真实攻击时产生路线明确的泄压与后坐反馈。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "每轮攻击同步泄压";
          guideCards[0].querySelector("span:last-child").textContent = "杯口喷出主攻击时，背部压力装置同步工作，不再只是静态挂件。";
          guideCards[1].querySelector("strong").textContent = "冷凝形成冰霜半环";
          guideCards[1].querySelector("span:last-child").textContent = "冷凝侧形成贴身冷青冰霜半环，等级越高，环体越厚、冰晶越密。";
          guideCards[2].querySelector("strong").textContent = "热浪形成蒸汽半环";
          guideCards[2].querySelector("span:last-child").textContent = "热浪侧形成贴身琥珀蒸汽半环，两条路线同时存在时仍能直接区分。";
          guideCards[3].querySelector("strong").textContent = "V3.7 数值原样继承";
          guideCards[3].querySelector("span:last-child").textContent = "本版只新增泄压动画、装置后坐和等级化光效，不改变武器、怪物或经济数值。";
        }
        if (startButton) startButton.textContent = "进入 Demo V3.8 实战";
      }
      if (demoV2Phase === "four-weapon-v3-9") {
        document.title = "工位幸存者 Demo V3.9 · 剪刀与修正液异化显形版";
        const stamp = document.querySelector(".title-stamp");
        const shell = document.querySelector(".game-wrap");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (stamp) stamp.textContent = "Demo V3.9 · 剪刀与修正液异化显形版";
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V3.9 剪刀与修正液异化显形版");
        if (subtitle) subtitle.textContent = "沿用 V3.8 的全部数值与关卡，把完整剪刀的真实开合，以及修正液从身体储液囊到白色错误痕迹的因果链落入实战。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "同一把完整剪刀";
          guideCards[0].querySelector("span:last-child").textContent = "双环、铰链与双刃共同开合；攻击时待机武器退场，不再出现第二把剪刀或无来源刀光。";
          guideCards[1].querySelector("strong").textContent = "梦幻霓虹裁切";
          guideCards[1].querySelector("span:last-child").textContent = "合刃用冷青聚焦，张刃用青与品红完成宽幅连剪，终局仍由真实刃口产生。";
          guideCards[2].querySelector("strong").textContent = "修正液因果链";
          guideCards[2].querySelector("span:last-child").textContent = "身体储液囊挤压、软管脉冲、喷头喷出白色介质，敌人再依层数出现白色覆盖与故障过载。";
          guideCards[3].querySelector("strong").textContent = "统一角色比例";
          guideCards[3].querySelector("span:last-child").textContent = "四把武器共用同一头身比、战斗高度与办公角色身份；异化只改变贴身装置和武器。";
        }
        if (startButton) startButton.textContent = "进入 Demo V3.9 实战";
      }
      if (demoV2Phase === "four-weapon-v3-10") {
        document.title = "工位幸存者 Demo V3.10 · 战场比例与外围武器修正版";
        const stamp = document.querySelector(".title-stamp");
        const shell = document.querySelector(".game-wrap");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (stamp) stamp.textContent = "Demo V3.10 · 战场比例与外围武器修正版";
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V3.10 战场比例与外围武器修正版");
        if (subtitle) subtitle.textContent = "人物恢复接近旧版的战场占比；穿戴件留在身体挂点，真正瞄准的武器按素材长度环绕在外围，不再压住角色。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "回到旧版战场比例";
          guideCards[0].querySelector("span:last-child").textContent = "人物可见高度回到约 55—59px，与普通怪物和地图空间重新建立合理尺度。";
          guideCards[1].querySelector("strong").textContent = "武器内缘退出人物主体";
          guideCards[1].querySelector("span:last-child").textContent = "不是只移动中心点，而是按马克笔、剪刀和喷头的真实长轴计算外围半径。";
          guideCards[2].querySelector("strong").textContent = "穿戴与瞄准重新分层";
          guideCards[2].querySelector("span:last-child").textContent = "背包、墨仓和压力件仍贴身安装；只有笔、杯、剪刀和喷头围绕人物追随攻击方向。";
          guideCards[3].querySelector("strong").textContent = "V3.9 数值原样继承";
          guideCards[3].querySelector("span:last-child").textContent = "伤害、攻速、怪物、关卡、模块与组件不变，本版只修正比例、外围轨道和遮挡关系。";
        }
        if (startButton) startButton.textContent = "进入 Demo V3.10 实战";
      }
      if (demoV2Phase === "four-weapon-v3-11") {
        document.title = "工位幸存者 Demo V3.11 · 前期容错与四武器平衡版";
        const stamp = document.querySelector(".title-stamp");
        const shell = document.querySelector(".game-wrap");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (stamp) stamp.textContent = "Demo V3.11 · 前期容错与四武器平衡版";
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V3.11 前期容错与四武器平衡版");
        if (subtitle) subtitle.textContent = "前两关保留足够的割草目标，但降低接近速度、碰撞伤害和耐久；剪刀减少空挥，修正液更快建立错误循环。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "第一关用于理解武器";
          guideCards[0].querySelector("span:last-child").textContent = "敌人仍然成群出现，但接近更慢、伤害更低，保证玩家能活着看到第一次模块选择。";
          guideCards[1].querySelector("strong").textContent = "第二关逐步恢复压力";
          guideCards[1].querySelector("span:last-child").textContent = "数量与团块感继续上升，但不会突然跳成高耐久围堵。第三关起恢复正式难度。";
          guideCards[2].querySelector("strong").textContent = "剪刀与修正液补足机制损耗";
          guideCards[2].querySelector("span:last-child").textContent = "剪刀只在真实刃口可达时开剪；修正液提高喷涂频率、溅写和错误过载收益。";
          guideCards[3].querySelector("strong").textContent = "强势武器轻量回收";
          guideCards[3].querySelector("span:last-child").textContent = "马克笔和保温杯只小幅降低开火预算，不削掉路径贯穿与近距控场的核心优势。";
        }
        if (startButton) startButton.textContent = "进入 Demo V3.11 实战";
      }
      if (demoV2Phase === "four-weapon-v3-12") {
        document.title = "工位幸存者 Demo V3.12 · 马克笔欲望链实验版";
        const stamp = document.querySelector(".title-stamp");
        const shell = document.querySelector(".game-wrap");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (stamp) stamp.textContent = "Demo V3.12 · 马克笔欲望链实验版";
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V3.12 马克笔欲望链实验版");
        if (subtitle) subtitle.textContent = "继承 V3.11 战斗与难度；本轮只验证马克笔能否用模块承诺、实体安装、调阅协同和纯路线专精持续制造下一步期待。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "选择同时展示现在和未来";
          guideCards[0].querySelector("span:last-child").textContent = "模块卡先说明下一场立刻增加什么，再预告 Lv4 会异化成什么，不靠隐藏倍率制造期待。";
          guideCards[1].querySelector("strong").textContent = "组件真实安装";
          guideCards[1].querySelector("span:last-child").textContent = "笔头、笔身与笔尾品质成长继续对应真实发射笔或背负供墨结构，购买后战斗轮廓立即改变。";
          guideCards[2].querySelector("strong").textContent = "混合路线建立调阅";
          guideCards[2].querySelector("span:last-child").textContent = "复写线穿过旧墨迹时沿档案回读，洋红调阅反馈把两次选择连接成新的攻击事件。";
          guideCards[3].querySelector("strong").textContent = "纯 Lv4 可以保持专精";
          guideCards[3].querySelector("span:last-child").textContent = "第五次选择不再强制混合；可以接入另一模块，也可以锁定纯路线，让终局技能保持更强统治感。";
        }
        if (startButton) startButton.textContent = "进入 Demo V3.12 实战";
      }
      if (demoV2Phase === "four-weapon-v3-13") {
        document.title = "工位幸存者 Demo V3.13 · 四武器欲望链扩展版";
        const stamp = document.querySelector(".title-stamp");
        const shell = document.querySelector(".game-wrap");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (stamp) stamp.textContent = "Demo V3.13 · 四武器欲望链扩展版";
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V3.13 四武器欲望链扩展版");
        if (subtitle) subtitle.textContent = "继承 V3.12 数值与关卡；四把武器都拥有可预期模块承诺、实体组件安装、混合因果与纯 Lv4 终局专精。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "保温杯 · 热交换";
          guideCards[0].querySelector("span:last-child").textContent = "击杀热浪触碰冷凝区时产生白紫温差冲击，让空间经营与点杀转化成为一条因果链。";
          guideCards[1].querySelector("strong").textContent = "剪刀 · 交叉裁切";
          guideCards[1].querySelector("span:last-child").textContent = "张刃先留下裁缝，合刃再以紫青 X 形重剪兑现，两个动作不再只是同时播放。";
          guideCards[2].querySelector("strong").textContent = "修正液 · 级联回滚";
          guideCards[2].querySelector("span:last-child").textContent = "过载目标死亡会让既有污染区同步闪回，把单体培养反向连接到整张污染网络。";
          guideCards[3].querySelector("strong").textContent = "纯终局仍有统治力";
          guideCards[3].querySelector("span:last-child").textContent = "第五次选择可保持纯路线，强化既有 Lv4；组件则明确安装到真实杯体、剪刀或供液装置。";
        }
        if (startButton) startButton.textContent = "进入 Demo V3.13 实战";
      }
      if (demoV2Phase === "four-weapon-v3-14") {
        document.title = "工位幸存者 Demo V3.14 · 轻量决策版";
        const stamp = document.querySelector(".title-stamp");
        const shell = document.querySelector(".game-wrap");
        const subtitle = document.querySelector(".title-hero .subtitle");
        const guideCards = document.querySelectorAll(".quick-guide .guide-card");
        const startButton = document.getElementById("startButton");
        if (stamp) stamp.textContent = "Demo V3.14 · 轻量决策版";
        if (shell) shell.setAttribute("aria-label", "工位幸存者 Demo V3.14 轻量决策版");
        if (subtitle) subtitle.textContent = "继承 V3.13 全部战斗与成长；选择页只回答这次该怎么选。";
        if (guideCards.length >= 4) {
          guideCards[0].querySelector("strong").textContent = "武器 · 看打法";
          guideCards[0].querySelector("span:last-child").textContent = "线、空间、近战、状态，选一个想玩的。";
          guideCards[1].querySelector("strong").textContent = "模块 · 看本次变化";
          guideCards[1].querySelector("span:last-child").textContent = "卡片只保留立刻效果和一条成长预告。";
          guideCards[2].querySelector("strong").textContent = "组件 · 看结果";
          guideCards[2].querySelector("span:last-child").textContent = "安装、升级或替换，一眼看清。";
          guideCards[3].querySelector("strong").textContent = "选完就打";
          guideCards[3].querySelector("span:last-child").textContent = "机制用战斗反馈解释，不靠长文案。";
        }
        if (startButton) startButton.textContent = "进入 Demo V3.14 实战";
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
