// ============================================================
// state.js v2 — 游戏状态管理器（修订版）
// 目录: reforged/
// 匹配 data.js v2 的模板系统和简化框架
// ============================================================

class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.phase = "menu";

    // ---- 属性槽 ----
    this.attributeSlots = [];  // 本局激活的属性 id（开局 2 固件 + 1 自选）
    this.fixedAttributes = []; // 系统随机的 2 个固件属性（不可改）
    this.slotCards = {};       // { output: "agile_dev", survival: null, ... }
    this.isAdvanced = false;   // 新手版/进阶版

    // ---- 部门 ----
    this.badgeDept = null;
    this.runDeptPool = [];

    // ---- 武器 ----
    this.startWeapon = null;
    this.weapons = [];

    // ---- 卡牌 ----
    this.ownedCards = [];
    this.acquiredLegendary = false;

    // ---- 进度 ----
    this.currentStage = 0;
    this.stagesCleared = 0;
    this.level = 1;
    this.xp = 0;
    this.materials = 0;
    this.workPoints = 42;
    this.runTime = 0;

    // ---- 部门投资 ----
    this.deptCardCounts = {};  // { tech: 3, ops: 1 }
    this.deptMilestones = {};  // { tech: [2, 3] } — 已解锁的里程碑

    // ---- 协同 ----
    this.activeSynergies = [];
    this.discoveredSynergies = [];

    // ---- 协作任务 ----
    this.activeCollabQuest = null;
    this.completedCollabQuests = [];

    // ---- 商店/工坊 ----
    this.shopVisits = 0;

    // ---- 换槽 ----
    this.freeSwapUsed = false;

    // ---- 统计 ----
    this.runLog = {
      startTime: 0,
      weaponDamages: {},
      weaponKills: {},
      cardAcquired: [],
      synergiesTriggered: [],
      decisions: [],
      collabQuestsCompleted: [],
      finalStage: 0,
      finalLevel: 0,
      deathCause: null
    };
  }

  // ================================================================
  // 开局阶段
  // ================================================================

  /** 新手版：一步开局 */
  startNewbie(presetId) {
    const preset = NEWBIE_PRESETS.find(p => p.id === presetId);
    if (!preset) return false;

    this.isAdvanced = false;
    this.fixedAttributes = preset.attributes;
    this.attributeSlots = [...preset.attributes];
    this.badgeDept = preset.dept;
    this.startWeapon = preset.weapon;
    this.weapons = [preset.weapon];

    // 随机补 2 个部门
    this._rollDeptPool();
    this._beginRun();
    return true;
  }

  /** 进阶版：三步开局 — 第一步：入职测评 */
  rollAssessment() {
    this.isAdvanced = true;
    const allAttrs = ["execution", "focus", "resilience", "slacking", "expressiveness", "social"];
    const shuffled = [...allAttrs];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    this.fixedAttributes = shuffled.slice(0, 2);
    this.phase = "assessment";
    return this.fixedAttributes;
  }

  /** 进阶版：第二步 — 自选第三个属性 */
  selectThirdAttribute(attrId) {
    if (!this.fixedAttributes || this.fixedAttributes.length !== 2) return false;
    const remaining = Object.keys(ATTRIBUTE_SLOTS).filter(
      a => !this.fixedAttributes.includes(a)
    );
    if (!remaining.includes(attrId)) return false;
    this.attributeSlots = [...this.fixedAttributes, attrId];
    this.phase = "badge";
    return true;
  }

  /** 进阶版：选择工牌部门 */
  selectBadge(deptId) {
    if (!DEPARTMENTS[deptId]) return false;
    this.badgeDept = deptId;
    this._rollDeptPool();
    this.phase = "weapon";
    return this.runDeptPool;
  }

  _rollDeptPool() {
    const others = Object.keys(DEPARTMENTS).filter(d => d !== this.badgeDept);
    const shuffled = [...others];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    this.runDeptPool = [this.badgeDept, ...shuffled.slice(0, 2)];
  }

  /** 获取起始武器候选（4 选 1） */
  getWeaponCandidates() {
    const candidates = [];
    const badgeWeapons = DEPARTMENTS[this.badgeDept].weapons.slice(0, 2);
    candidates.push(...badgeWeapons);

    const otherDeptIds = this.runDeptPool.filter(d => d !== this.badgeDept);
    for (const deptId of otherDeptIds) {
      const deptWeapons = DEPARTMENTS[deptId].weapons;
      const pick = deptWeapons[Math.floor(Math.random() * deptWeapons.length)];
      if (!candidates.includes(pick)) candidates.push(pick);
    }
    // 不够 4 个时用随机补
    const allWeapons = Object.keys(WEAPON_INFO);
    while (candidates.length < 4) {
      const w = allWeapons[Math.floor(Math.random() * allWeapons.length)];
      if (!candidates.includes(w)) candidates.push(w);
    }
    return candidates.slice(0, 4);
  }

  /** 选择起始武器 → 开始游戏 */
  selectStartWeapon(weaponId) {
    if (!WEAPON_INFO[weaponId]) return false;
    this.startWeapon = weaponId;
    this.weapons = [weaponId];
    this._beginRun();
    return true;
  }

  _beginRun() {
    this.currentStage = 1;
    this.phase = "playing";
    this.runLog.startTime = Date.now();
    this.runLog.decisions.push({
      type: "start",
      badge: this.badgeDept,
      pool: this.runDeptPool,
      attrs: this.attributeSlots,
      weapon: this.startWeapon
    });

    // 初始化部门卡计数
    for (const deptId of this.runDeptPool) {
      this.deptCardCounts[deptId] = 0;
    }
  }

  // ================================================================
  // 阶段推进
  // ================================================================

  /** 进入下一阶段 */
  advanceStage() {
    this.stagesCleared = this.currentStage;
    this.currentStage++;
    this.phase = "playing";

    // 检查协作任务触发
    this._maybeTriggerCollabQuest();

    // 检查商店
    if ([3, 6, 9].includes(this.currentStage)) {
      this.shopVisits++;
      this.phase = "shop";
      return { event: "shop", visit: this.shopVisits };
    }

    return { event: null };
  }

  _maybeTriggerCollabQuest() {
    // 已经有一个进行中的不重复
    if (this.activeCollabQuest) return;

    for (const quest of COLLAB_QUESTS) {
      if (quest.stage === this.currentStage && Math.random() < quest.chance) {
        // 检查是否已完成过
        if (this.completedCollabQuests.includes(quest.id)) continue;
        // 检查玩家是否满足要求
        const req = quest.requires;
        const satisfied = req.depts.every(d => (this.deptCardCounts[d] || 0) >= req.minEach);
        if (satisfied) {
          this.activeCollabQuest = quest;
          this.phase = "collab_quest";
          return quest;
        }
      }
    }
    return null;
  }

  /** 完成协作任务 */
  completeCollabQuest(accept = true) {
    if (!this.activeCollabQuest) return null;
    const quest = this.activeCollabQuest;
    this.completedCollabQuests.push(quest.id);
    this.runLog.collabQuestsCompleted.push(quest.id);

    if (accept) {
      this._applyQuestReward(quest);
    }
    this.activeCollabQuest = null;
    this.phase = "playing";
    return quest;
  }

  _applyQuestReward(quest) {
    switch (quest.reward.type) {
      case "free_card":
        this._addFreeCard();
        break;
      case "shop_discount":
        this._shopDiscount = quest.reward.value;
        break;
      case "emergency_buff":
        this._emergencyBuff = {
          dmgBonus: quest.reward.dmgBonus,
          expiresAt: Date.now() + quest.reward.duration
        };
        break;
    }
  }

  _addFreeCard() {
    const deptId = this.runDeptPool[Math.floor(Math.random() * this.runDeptPool.length)];
    const candidates = Object.values(CARDS).filter(
      c => c.department === deptId && c.rarity !== "legendary"
    );
    if (candidates.length > 0) {
      const card = candidates[Math.floor(Math.random() * candidates.length)];
      this.ownedCards.push(card.id);
      this.deptCardCounts[card.department] = (this.deptCardCounts[card.department] || 0) + 1;
    }
  }

  // ================================================================
  // 升级与卡牌
  // ================================================================

  levelUp() {
    this.level++;
    this.phase = "levelup";
    return { level: this.level };
  }

  getLevelUpOptions() {
    const options = [];
    const baseOptions = 3;
    const extraChoices = this._hasCard("morning_meeting") ? 1 : 0;
    const maxOptions = baseOptions + extraChoices;

    // 生成卡牌选项
    for (let i = 0; i < maxOptions; i++) {
      const card = this._rollCard();
      if (card) {
        // 为每张候选卡生成 5 个槽位的预览
        const preview = this._generateCardPreview(card);
        options.push({ type: "card", card, preview });
      }
    }

    return options.slice(0, maxOptions);
  }

  _generateCardPreview(card) {
    const preview = {};
    for (const [slotId, effect] of Object.entries(card.effects)) {
      preview[slotId] = {
        desc: effect.desc,
        type: effect.type,
        // 简单 DPS 估算（后续可让 main.js 填精确值）
        estimatedChange: null
      };
    }

    // 检查互斥
    preview.exclusions = [];
    if (card.exclusions) {
      for (const exc of card.exclusions) {
        if (exc.slots) {
          for (const s of exc.slots) {
            if (this.slotCards[s]) {
              preview.exclusions.push(`⚠ ${s}槽已有卡（${CARDS[this.slotCards[s]]?.name}）`);
            }
          }
        }
        if (exc.cardIds) {
          for (const cid of exc.cardIds) {
            if (this.ownedCards.includes(cid)) {
              preview.exclusions.push(`⚠ 与已有"${CARDS[cid]?.name}"互斥`);
            }
          }
        }
      }
    }

    // 传说卡限制
    if (card.legendary && this.acquiredLegendary) {
      preview.exclusions.push("⚠ 本局已有传说卡");
    }

    return preview;
  }

  _rollCard() {
    const rarity = this._rollRarity();
    const deptId = this.runDeptPool[Math.floor(Math.random() * this.runDeptPool.length)];

    let candidates = Object.values(CARDS).filter(c =>
      c.department === deptId && c.rarity === rarity
    );

    // 检查前置条件
    candidates = candidates.filter(c => {
      if (!c.prerequisite) return true;
      if (c.prerequisite.sameDeptCards) {
        return (this.deptCardCounts[deptId] || 0) >= c.prerequisite.sameDeptCards;
      }
      return true;
    });

    if (candidates.length === 0) {
      // 回退到该部门普通卡
      candidates = Object.values(CARDS).filter(c =>
        c.department === deptId && c.rarity === "common"
      );
    }

    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  _rollRarity() {
    const stage = this.currentStage;
    const roll = Math.random();

    if (stage <= 2) return "common";
    if (stage <= 5) return roll < 0.20 ? "rare" : "common";
    if (stage <= 8) {
      if (roll < 0.05) return "legendary";
      if (roll < 0.40) return "rare";
      return "common";
    }
    if (roll < 0.15) return "legendary";
    if (roll < 0.60) return "rare";
    return "common";
  }

  _hasCard(cardId) {
    return this.ownedCards.includes(cardId);
  }

  /** 选择卡牌并放入槽位 */
  selectCard(cardId, slotId) {
    const card = CARDS[cardId];
    if (!card) return false;

    // 传说卡检查
    if (card.legendary) {
      if (this.acquiredLegendary) return false;
      const sameDeptCount = this.deptCardCounts[card.department] || 0;
      if (sameDeptCount < (card.prerequisite?.sameDeptCards || 3)) return false;
      this.acquiredLegendary = true;
    }

    // 前置条件
    if (card.prerequisite?.sameDeptCards) {
      if ((this.deptCardCounts[card.department] || 0) < card.prerequisite.sameDeptCards) return false;
    }

    // 槽位互斥
    if (card.exclusions) {
      for (const exc of card.exclusions) {
        if (exc.slots?.includes(slotId)) return false;
        if (exc.cardIds?.includes(this.slotCards[slotId])) return false;
      }
    }

    // 槽位放卡
    this.slotCards[slotId] = cardId;
    if (!this.ownedCards.includes(cardId)) {
      this.ownedCards.push(cardId);
    }

    // 更新部门卡计数
    this.deptCardCounts[card.department] = (this.deptCardCounts[card.department] || 0) + 1;

    // 检查部门里程碑
    this._updateDeptMilestones(card.department);

    // 更新协同
    this._updateSynergies();

    // 记录
    this.runLog.cardAcquired.push({
      cardId, slot: slotId, dept: card.department, rarity: card.rarity,
      stage: this.currentStage, level: this.level
    });
    this.runLog.decisions.push({
      type: "levelup", stage: this.currentStage, level: this.level, card: cardId, slot: slotId
    });

    return true;
  }

  _updateDeptMilestones(deptId) {
    const count = this.deptCardCounts[deptId] || 0;
    if (!this.deptMilestones[deptId]) this.deptMilestones[deptId] = [];

    for (const [threshold, milestone] of Object.entries(DEPARTMENT_MILESTONES)) {
      const t = parseInt(threshold);
      if (count >= t && !this.deptMilestones[deptId].includes(t)) {
        this.deptMilestones[deptId].push(t);
        this.runLog.synergiesTriggered.push({
          type: "milestone",
          dept: deptId,
          threshold: t,
          desc: milestone.desc
        });
      }
    }
  }

  _updateSynergies() {
    const newSynergies = [];

    // 部门协同（第 6 关起）
    if (this.currentStage >= 6) {
      for (const [id, synergy] of Object.entries(SYNERGIES)) {
        if (synergy.type !== "department") continue;
        if (synergy.depts.every(d => (this.deptCardCounts[d] || 0) >= 1)) {
          newSynergies.push(id);
        }
      }
    }

    // 属性协同（第 8 关起）
    if (this.currentStage >= 8) {
      for (const [id, synergy] of Object.entries(SYNERGIES)) {
        if (synergy.type !== "attribute") continue;
        if (synergy.slots.every(s => this.slotCards[s])) {
          newSynergies.push(id);
        }
      }
    }

    // 记录新发现的
    for (const id of newSynergies) {
      if (!this.discoveredSynergies.includes(id)) {
        this.discoveredSynergies.push(id);
      }
    }

    this.activeSynergies = newSynergies;
  }

  // ================================================================
  // 武器
  // ================================================================

  addWeapon(weaponId) {
    if (this.weapons.includes(weaponId)) return false;
    if (this.weapons.length >= 6) return false;
    this.weapons.push(weaponId);
    return true;
  }

  getWorkshopCandidates() {
    const poolDeptWeapons = new Set();
    for (const deptId of this.runDeptPool) {
      for (const w of DEPARTMENTS[deptId].weapons) {
        if (!this.weapons.includes(w)) poolDeptWeapons.add(w);
      }
    }
    const all = [...poolDeptWeapons];
    const shuffled = [...all];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, Math.min(3, shuffled.length));
  }

  /** 检查武器 Lv.7 进化方向 */
  getWeaponEvolution(weaponId) {
    const evolutions = WEAPON_EVOLUTIONS[weaponId];
    if (!evolutions) return null;

    for (const evo of evolutions.conditions) {
      if (evo.requires === null) continue; // 跳过默认

      if (evo.requires.sameDeptCards) {
        if ((this.deptCardCounts[evo.requires.dept] || 0) >= evo.requires.sameDeptCards) {
          return evo;
        }
      }

      if (evo.requires.crossDeptCards) {
        const satisfied = Object.entries(evo.requires.crossDeptCards).every(
          ([dept, min]) => (this.deptCardCounts[dept] || 0) >= min
        );
        if (satisfied) return evo;
      }
    }

    // 默认进化
    return evolutions.conditions.find(e => e.requires === null);
  }

  // ================================================================
  // 换槽
  // ================================================================

  swapCardSlot(fromSlot, toSlot) {
    if (this.freeSwapUsed && this.workPoints < 2) return false;
    if (!this.slotCards[fromSlot]) return false;
    if (this.slotCards[toSlot]) return false;

    // 检查目标槽互斥
    const card = CARDS[this.slotCards[fromSlot]];
    if (card.exclusions) {
      for (const exc of card.exclusions) {
        if (exc.slots?.includes(toSlot)) return false;
      }
    }

    this.slotCards[toSlot] = this.slotCards[fromSlot];
    this.slotCards[fromSlot] = null;
    this.freeSwapUsed = true;
    if (!this.freeSwapUsed) this.workPoints -= 2;

    // 重新评估协同
    this._updateSynergies();
    return true;
  }

  // ================================================================
  // 辅助函数
  // ================================================================

  /** 获取部门投资倍率 */
  getDeptInvestmentBonus(deptId) {
    const milestones = this.deptMilestones[deptId] || [];
    let bonus = 0;
    for (const m of milestones) {
      bonus += (DEPARTMENT_MILESTONES[m]?.valueBonus || 0);
    }
    return 1 + bonus; // 1.0 → 1.1 → 1.25 → 1.45
  }

  /** 检查武器套装是否激活 */
  getWeaponSetBonus() {
    const deptWeaponCounts = {};
    for (const wid of this.weapons) {
      const dept = WEAPON_INFO[wid]?.dept;
      if (dept) deptWeaponCounts[dept] = (deptWeaponCounts[dept] || 0) + 1;
    }

    const bonuses = {};
    for (const [deptId, count] of Object.entries(deptWeaponCounts)) {
      if (count >= 2 && DEPARTMENTS[deptId]?.weaponSets?.[2]) {
        bonuses[deptId] = DEPARTMENTS[deptId].weaponSets[2].bonus;
      }
    }
    return bonuses;
  }

  // ================================================================
  // 终局
  // ================================================================

  endGame(result, cause) {
    this.phase = result;
    this.runLog.deathCause = cause;
    this.runLog.finalStage = this.currentStage;
    this.runLog.finalLevel = this.level;
    return this._buildReport();
  }

  _buildReport() {
    // 部门投资总结
    const deptSummary = {};
    for (const [deptId, count] of Object.entries(this.deptCardCounts)) {
      deptSummary[deptId] = {
        count,
        milestones: this.deptMilestones[deptId] || [],
        investment: this.getDeptInvestmentBonus(deptId)
      };
    }

    // 身份识别
    const primaryDept = Object.entries(deptSummary).sort((a, b) => b[1].count - a[1].count)[0];
    const primaryDeptId = primaryDept?.[0];
    const primaryDeptCount = primaryDept?.[1].count || 0;

    let identityTone = "one_dept";
    let identityDepts = [];
    for (const [deptId, info] of Object.entries(deptSummary)) {
      if (info.count > 0) identityDepts.push(deptId);
    }
    if (identityDepts.length >= 3) identityTone = "multi";
    else if (identityDepts.length === 2) identityTone = "cross";

    const identityLabels = {
      one_dept: "技术专家",
      cross: "跨界精英",
      multi: "全能选手"
    };

    // 进度称号
    let progressTitle = "新人磨合期";
    if (this.currentStage >= 14) progressTitle = "年度最佳员工";
    else if (this.currentStage >= 10) progressTitle = "资深老员工";
    else if (this.currentStage >= 6) progressTitle = "转正成功";
    else if (this.currentStage >= 3) progressTitle = "转正边缘";

    return {
      badgeDept: this.badgeDept,
      pool: this.runDeptPool,
      attrs: this.attributeSlots,
      weapons: this.weapons,
      ownedCards: this.ownedCards,
      slotCards: this.slotCards,
      stagesCleared: this.stagesCleared,
      level: this.level,
      time: Date.now() - this.runLog.startTime,
      deptSummary,
      activeSynergies: this.activeSynergies,
      discoveredSynergies: this.discoveredSynergies,
      collabQuestsCompleted: this.completedCollabQuests,
      identity: {
        dept: primaryDeptId,
        cards: primaryDeptCount,
        tone: identityTone,
        label: identityLabels[identityTone],
        attributes: this.attributeSlots.map(a => ATTRIBUTE_SLOTS[a].name)
      },
      title: progressTitle,
      runLog: this.runLog
    };
  }

  // ================================================================
  // 快速测试构造
  // ================================================================

  static quickSetup(badgeDept = "tech", weaponId = "coffee") {
    const state = new GameState();
    state.isAdvanced = false;
    state.attributeSlots = ["execution", "focus"];
    state.fixedAttributes = ["execution", "focus"];
    state.badgeDept = badgeDept;
    const others = Object.keys(DEPARTMENTS).filter(d => d !== badgeDept);
    state.runDeptPool = [badgeDept, ...others.slice(0, 2)];
    state.startWeapon = weaponId;
    state.weapons = [weaponId];
    state.currentStage = 1;
    state.phase = "playing";
    state.runLog.startTime = Date.now();
    for (const deptId of state.runDeptPool) state.deptCardCounts[deptId] = 0;
    return state;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GameState };
}
