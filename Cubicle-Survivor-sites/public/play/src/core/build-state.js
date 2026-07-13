// ================================================================
// src/core/build-state.js — 构筑状态管理器
// 命名空间: CS.buildState
//
// 统一描述玩家当前 Build，所有系统读取此对象：
//   - 部门卡数、里程碑、协同激活
//   - 属性槽位与内容
//   - 武器进化判定
//   - 部门投资倍率
//   - 卡牌互斥校验
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});

  CS.buildState = {
    // ---- 生命周期 ----
    reset() {
      this.badgeDept = null;          // 玩家选的工牌部门
      this.runDeptPool = [];          // 本局出现的部门（工牌部门 + 随机 2 个）
      this.attributes = [];           // 激活的属性 id 列表（2 固件 + 1 自选 = 3）
      this.fixedAttributes = [];      // 系统随机的 2 个（不可改）
      this.weapons = [];              // 拥有的武器 id 列表
      this.slotCards = {};            // { offense: "agile_dev", survival: "backup_recovery", ... }
      this.slotAugments = {};         // { offense: ["code_refactor"] }，追加到槽位的副卡
      this.supportCards = [];         // 兼容旧存档字段，不作为新玩法入口
      this.ownedCardIds = [];         // 已获得的所有卡牌 id
      this.acquiredLegendary = false; // 本局是否已获取传说卡

      // 部门统计
      this.deptCardCounts = {};       // { tech: 3, ops: 1 }
      this.deptMilestones = {};       // { tech: [2, 3] }
      this.deptInvestmentBonus = {};  // { tech: 1.10, ops: 1.0 }

      // 协同
      this.activeDeptSynergies = [];
      this.activeAttrSynergies = [];
      this.discoveredSynergies = [];  // 已发现的（用于面板显示差什么）

      // 协作任务
      this.activeCollabQuest = null;
      this.completedCollabQuests = [];
      this.pendingCollabHint = null;  // 第一次不满足但需要显示提示

      // 武器进化
      this.evolutionCandidates = {};  // { coffee: "coffee_espresso" }，条件已满足但未必已应用
      this.weaponEvolutions = {};     // { coffee: "coffee_espresso" }，Lv.7 后已选定/已应用
      this.appliedWeaponEvolutions = {}; // { coffee: true }

      // 开关
      this.isAdvanced = false;
      this.freeSwapUsed = false;

      // 实时状态
      this.phase = "menu";
      this.level = 1;
      this.stage = 1;

      // 运行日志
      this.runLog = this._emptyLog();
    },

    _emptyLog() {
      return {
        startTime: 0,
        weaponDamages: {},
        weaponKills: {},
        cardsAcquired: [],
        synergiesTriggered: [],
        milestonesReached: [],
        collabCompleted: [],
        decisions: [],
        finalStage: 0,
        finalLevel: 0,
        deathCause: null
      };
    },

    // ---- 开局 ----

    /** 新手版开局 */
    beginNewbie(presetId) {
      const preset = CS.newbiePresets.find(p => p.id === presetId);
      if (!preset) return false;
      this.reset();
      this.isAdvanced = false;
      this.fixedAttributes = [...preset.attributes];
      this.attributes = [...preset.attributes];
      this.badgeDept = preset.department;
      this.weapons = [preset.weapon];
      this._rollDeptPool();
      this.phase = "playing";
      this.stage = 1;
      this.runLog.startTime = Date.now();
      this.runLog.decisions.push({
        type: "start", preset: presetId, badge: this.badgeDept,
        pool: this.runDeptPool, attrs: this.attributes, weapon: preset.weapon
      });
      return true;
    },

    /** 进阶版：入职测评 */
    rollAssessment() {
      this.isAdvanced = true;
      const allAttrs = Object.keys(CS.attributes);
      const shuffled = [...allAttrs].sort(() => Math.random() - 0.5);
      this.fixedAttributes = shuffled.slice(0, 2);
      this.attributes = [...this.fixedAttributes];
      this.phase = "assessment";
      return this.fixedAttributes;
    },

    /** 进阶版：自选第三个属性 */
    selectThirdAttribute(attrId) {
      if (!this.fixedAttributes.length) return false;
      const remaining = Object.keys(CS.attributes).filter(a => !this.fixedAttributes.includes(a));
      if (!remaining.includes(attrId)) return false;
      this.attributes = [...this.fixedAttributes, attrId];
      this.phase = "badge";
      return true;
    },

    /** 选择工牌部门 */
    selectBadge(deptId) {
      if (!CS.departments[deptId]) return false;
      this.badgeDept = deptId;
      this._rollDeptPool();
      this.phase = "weapon_select";
      return this.runDeptPool;
    },

    _rollDeptPool() {
      const others = Object.keys(CS.departments).filter(d => d !== this.badgeDept);
      const shuffled = [...others].sort(() => Math.random() - 0.5);
      this.runDeptPool = [this.badgeDept, ...shuffled.slice(0, 2)];
      for (const d of this.runDeptPool) {
        this.deptCardCounts[d] = 0;
      }
    },

    /** 获取武器候选（4 选 1）*/
    getWeaponCandidates() {
      const candidates = [];
      const dept = CS.departments[this.badgeDept];
      candidates.push(...(dept.representativeWeapons || []).slice(0, 2));
      for (const d of this.runDeptPool) {
        if (d === this.badgeDept) continue;
        const poolWeps = CS.departments[d].representativeWeapons || [];
        if (poolWeps.length > 0) {
          candidates.push(poolWeps[Math.floor(Math.random() * poolWeps.length)]);
        }
      }
      const allWeps = Object.keys(CS.weapons);
      while (candidates.length < 4) {
        const w = allWeps[Math.floor(Math.random() * allWeps.length)];
        if (!candidates.includes(w)) candidates.push(w);
      }
      return candidates.slice(0, 4);
    },

    /** 选武器 → 开打 */
    selectStartWeapon(weaponId) {
      if (!CS.weapons[weaponId]) return false;
      this.weapons = [weaponId];
      this.phase = "playing";
      this.stage = 1;
      this.runLog.startTime = Date.now();
      return true;
    },

    // ---- 升级与卡牌 ----

    /** 获得升级候选卡 */
    getLevelUpOptions() {
      const options = [];
      const choices = this._getChoiceCount();
      const rolledIds = new Set();
      const forcedIds = this._getOnboardingCardIds();
      for (const cardId of forcedIds) {
        if (options.length >= choices) break;
        if (rolledIds.has(cardId) || this.ownedCardIds.includes(cardId)) continue;
        const forced = CS.cards[cardId];
        if (!forced) continue;
        rolledIds.add(forced.id);
        options.push({ card: forced, preview: this._previewCard(forced), onboarding: true });
      }
      let fallbacks = 0;
      for (let i = options.length; i < choices; i++) {
        const card = this._rollCard(rolledIds);
        if (card) {
          rolledIds.add(card.id);
          const preview = this._previewCard(card);
          options.push({ card, preview });
        } else if (fallbacks < 1) {
          // 卡池枯竭：无视去重补一张当前最低稀有度
          const fb = this._rollCard(null);
          if (fb) { options.push({ card: fb, preview: this._previewCard(fb) }); fallbacks++; }
        }
      }
      return options;
    },

    _getOnboardingCardIds() {
      const lessonMap = {
        tech: ["agile_dev", "version_iter"],
        product: ["deadline", "emergency_launch"],
        ops: ["process_approval", "backup_recovery"],
        marketing: ["brand_impact", "channel_promotion"],
        general: ["morning_meeting", "standard_sop"]
      };
      const lesson = (CS.routeLessons && CS.routeLessons[this.badgeDept]) || null;
      const ids = lesson && lesson.openingCards ? lesson.openingCards : lessonMap[this.badgeDept];
      if (!ids || this.stage > 6) return [];
      const acquired = this.runLog && this.runLog.cardsAcquired ? this.runLog.cardsAcquired.length : this.ownedCardIds.length;
      if (acquired <= 0) return ids.slice(0, 1);
      if (acquired === 1) return ids.slice(1, 2);
      return [];
    },

    _getChoiceCount() {
      let base = CS.stages.levelUpBaseOptions;
      if (this.slotCards.offense === "morning_meeting" ||
          this.slotCards.survival === "morning_meeting" ||
          this.slotCards.resource === "morning_meeting" ||
          this.slotCards.mechanic === "morning_meeting") {
        base += 1;
      }
      if (this.slotCards.cost === "morning_meeting") {
        base += 2;
      }
      return Math.min(base, 5); // 上限 5
    },

    _rollCard(excludeIds) {
      const rarity = this._rollRarity();
      const deptId = this.runDeptPool[Math.floor(Math.random() * this.runDeptPool.length)];
      let candidates = Object.values(CS.cards).filter(c =>
        c.department === deptId && c.rarity === rarity && (!excludeIds || !excludeIds.has(c.id))
      );
      // 前置条件过滤
      candidates = candidates.filter(c => {
        if (c.rarity === "legendary" && this.acquiredLegendary) return false;
        return true;
      });
      if (candidates.length === 0) {
        candidates = Object.values(CS.cards).filter(c =>
          c.department === deptId && c.rarity === "common" && (!excludeIds || !excludeIds.has(c.id))
        );
      }
      if (candidates.length === 0) {
        // 枯竭兜底：不限部门
        candidates = Object.values(CS.cards).filter(c =>
          c.rarity === "common" && (!excludeIds || !excludeIds.has(c.id))
        );
      }
      if (candidates.length === 0) return null;
      return candidates[Math.floor(Math.random() * candidates.length)];
    },

    _rollRarity() {
      const s = this.stage;
      const r = Math.random();
      if (s <= 6) return "common";
      if (s <= 12) return r < 0.22 ? "rare" : "common";
      if (s <= 16) {
        if (r < 0.05 && !this.acquiredLegendary) return "legendary";
        if (r < 0.38) return "rare";
        return "common";
      }
      if (r < 0.15 && !this.acquiredLegendary) return "legendary";
      if (r < 0.60) return "rare";
      return "common";
    },

    _previewCard(card) {
      const p = { slotPreviews: {}, warnings: [] };
      for (const [slot, effect] of Object.entries(card.slotEffects)) {
        p.slotPreviews[slot] = {
          label: effect.label,
          desc: effect.description,
          type: effect.effectType,
          power: effect.powerBudget
        };
      }
      // 互斥警告
      if (card.rarity === "legendary" && this.acquiredLegendary) {
        p.warnings.push("本局已有传说卡");
      }
      // 检查卡牌 conflicts
      for (const [slot, effect] of Object.entries(card.slotEffects)) {
        if (effect.conflicts && effect.conflicts.length > 0) {
          for (const conflictId of effect.conflicts) {
            if (this.ownedCardIds.includes(conflictId)) {
              p.warnings.push(`与已有「${CS.cards[conflictId]?.name || conflictId}」互斥`);
            }
          }
        }
      }
      return p;
    },

    /** 选卡放入槽位 */
    selectCard(cardId, slotId, options) {
      options = options || {};
      const card = CS.cards[cardId];
      if (!card) return { ok: false, error: "未知卡牌" };
      if (this.ownedCardIds.includes(cardId)) return { ok: false, error: "该卡已获得" };
      if (typeof slotId === "string" && slotId.indexOf("augment:") === 0) {
        return this.addSlotAugment(cardId, slotId.split(":")[1]);
      }
      if (slotId === "support") return this.addSupportCard(cardId);
      if (!this.isSlotUnlocked(slotId)) return { ok: false, error: "槽位尚未开放" };
      const replacedCardId = this.slotCards[slotId] || null;
      if (replacedCardId && !options.allowReplace) return { ok: false, error: "槽位已被占用" };

      // 检查重复卡（同一张卡不能放在多个槽位）
      for (var sid in this.slotCards) {
        if (this.slotCards[sid] === cardId) return { ok: false, error: "该卡已在其他槽位" };
      }

      // 传说限制
      if (card.rarity === "legendary") {
        if (this.acquiredLegendary) return { ok: false, error: "本局已有传说卡" };
        const otherLegendary = Object.entries(this.slotCards).some(function(entry) {
          const sid = entry[0];
          const existingId = entry[1];
          return sid !== slotId && existingId && CS.cards[existingId]?.rarity === "legendary";
        });
        if (otherLegendary) return { ok: false, error: "本局已有传说卡" };
      }

      // 放置卡牌
      this.slotCards[slotId] = cardId;
      this._recalculateBuildDerivedState();

      // 记录
      this.runLog.cardsAcquired.push({ id: cardId, slot: slotId, dept: card.department, rarity: card.rarity, stage: this.stage, replaced: replacedCardId });
      this.runLog.decisions.push({ type: "levelup", stage: this.stage, card: cardId, slot: slotId, replaced: replacedCardId });

      return { ok: true, replacedCardId };
    },

    /** 追加到某个槽位：不替换主卡，但必须绑定五槽之一 */
    addSlotAugment(cardId, slotId) {
      const card = CS.cards[cardId];
      if (!card) return { ok: false, error: "未知卡牌" };
      if (this.ownedCardIds.includes(cardId)) return { ok: false, error: "该卡已获得" };
      if (!this.getAllSlotIds().includes(slotId)) return { ok: false, error: "未知槽位" };
      if (!this.isSlotUnlocked(slotId)) return { ok: false, error: "槽位尚未开放" };
      if (!this.slotCards[slotId]) return { ok: false, error: "该槽还没有主卡，无法强化" };
      if (card.rarity === "legendary" && this.acquiredLegendary) return { ok: false, error: "本局已有传说卡" };

      if (!this.slotAugments[slotId]) this.slotAugments[slotId] = [];
      this.slotAugments[slotId].push(cardId);
      this._recalculateBuildDerivedState();

      this.runLog.cardsAcquired.push({ id: cardId, slot: slotId, augment: true, dept: card.department, rarity: card.rarity, stage: this.stage, replaced: null });
      this.runLog.decisions.push({ type: "levelup", stage: this.stage, card: cardId, slot: slotId, augment: true, replaced: null });
      return { ok: true, augment: true, targetSlot: slotId, replacedCardId: null };
    },

    /** 获得卡牌但不占用五槽：用于后期继续扩展 Build */
    addSupportCard(cardId) {
      const card = CS.cards[cardId];
      if (!card) return { ok: false, error: "未知卡牌" };
      if (this.ownedCardIds.includes(cardId)) return { ok: false, error: "该卡已获得" };
      if (card.rarity === "legendary" && this.acquiredLegendary) return { ok: false, error: "本局已有传说卡" };

      this.supportCards.push(cardId);
      this._recalculateBuildDerivedState();

      this.runLog.cardsAcquired.push({ id: cardId, slot: "support", dept: card.department, rarity: card.rarity, stage: this.stage, replaced: null });
      this.runLog.decisions.push({ type: "levelup", stage: this.stage, card: cardId, slot: "support", replaced: null });
      return { ok: true, support: true, replacedCardId: null };
    },

    _recalculateBuildDerivedState() {
      const previousMilestones = this.deptMilestones || {};
      const previousDiscovered = this.discoveredSynergies || [];
      const previousAppliedEvos = this.appliedWeaponEvolutions || {};
      const previousSelectedEvos = this.weaponEvolutions || {};

      const acquiredIds = [];
      this.acquiredLegendary = false;
      this.deptCardCounts = {};
      for (const d of this.runDeptPool || []) this.deptCardCounts[d] = 0;

      for (const supportId of this.supportCards || []) {
        const support = CS.cards[supportId];
        if (!support) continue;
        if (!acquiredIds.includes(supportId)) acquiredIds.push(supportId);
        if (support.rarity === "legendary") this.acquiredLegendary = true;
        this.deptCardCounts[support.department] = (this.deptCardCounts[support.department] || 0) + 1;
      }

      for (const ids of Object.values(this.slotAugments || {})) {
        for (const augmentId of ids || []) {
          const augment = CS.cards[augmentId];
          if (!augment) continue;
          if (!acquiredIds.includes(augmentId)) acquiredIds.push(augmentId);
          if (augment.rarity === "legendary") this.acquiredLegendary = true;
          this.deptCardCounts[augment.department] = (this.deptCardCounts[augment.department] || 0) + 1;
        }
      }

      for (const slotId of this.getAllSlotIds()) {
        const placedId = this.slotCards[slotId];
        if (!placedId) continue;
        const placed = CS.cards[placedId];
        if (!placed) continue;
        if (!acquiredIds.includes(placedId)) acquiredIds.push(placedId);
        if (placed.rarity === "legendary") this.acquiredLegendary = true;
        this.deptCardCounts[placed.department] = (this.deptCardCounts[placed.department] || 0) + 1;
      }
      this.ownedCardIds = acquiredIds;

      this.deptMilestones = {};
      this.deptInvestmentBonus = {};
      for (const deptId of Object.keys(this.deptCardCounts)) {
        this._updateMilestones(deptId, { silent: true });
        const reached = this.deptMilestones[deptId] || [];
        const oldReached = previousMilestones[deptId] || [];
        for (const tier of reached) {
          if (!oldReached.includes(tier)) {
            const tierData = CS.milestoneTiers.find(t => t.cards === tier);
            this.runLog.milestonesReached.push({ dept: deptId, tier, name: tierData?.name || "" });
          }
        }
      }

      this.discoveredSynergies = previousDiscovered;
      this._updateSynergies();
      this._checkWeaponEvolutions();

      this.appliedWeaponEvolutions = {};
      this.weaponEvolutions = {};
      for (const wid of Object.keys(previousAppliedEvos)) {
        if (previousAppliedEvos[wid] && previousSelectedEvos[wid]) {
          this.appliedWeaponEvolutions[wid] = true;
          this.weaponEvolutions[wid] = previousSelectedEvos[wid];
        }
      }
    },

    // ---- 部门里程碑 ----

    _updateMilestones(deptId, options) {
      options = options || {};
      const count = this.deptCardCounts[deptId] || 0;
      if (!this.deptMilestones[deptId]) this.deptMilestones[deptId] = [];

      for (const tier of CS.milestoneTiers) {
        if (count >= tier.cards && !this.deptMilestones[deptId].includes(tier.cards)) {
          this.deptMilestones[deptId].push(tier.cards);
          if (!options.silent) this.runLog.milestonesReached.push({ dept: deptId, tier: tier.cards, name: tier.name });
        }
      }

      // 计算投资倍率
      const bonusTiers = [0.10, 0.15, 0.20];
      const reached = this.deptMilestones[deptId]?.length || 0;
      this.deptInvestmentBonus[deptId] = 1.0 + (reached > 0 ? bonusTiers[reached - 1] || 0.20 : 0);
    },

    // ---- 协同 ----

    _updateSynergies() {
      // 部门协同（第 4 章：跨部门协同期起）
      if (this.stage >= 13) {
        this.activeDeptSynergies = [];
        for (const syn of CS.departmentSynergies) {
          if (syn.requiredDepartments.every(d => (this.deptCardCounts[d] || 0) >= 1)) {
            this.activeDeptSynergies.push(syn.id);
            if (!this.discoveredSynergies.includes(syn.id)) {
              this.discoveredSynergies.push(syn.id);
              this.runLog.synergiesTriggered.push({ id: syn.id, type: "department", stage: this.stage });
            }
          }
        }
      }

      // 属性协同（第 5 章：跨技能学习期起）
      if (this.stage >= 17) {
        this.activeAttrSynergies = [];
        for (const syn of CS.attributeSynergies) {
          if (syn.requiredAttributes.every(a => this.attributes.includes(a))) {
            this.activeAttrSynergies.push(syn.id);
            if (!this.discoveredSynergies.includes(syn.id)) {
              this.discoveredSynergies.push(syn.id);
              this.runLog.synergiesTriggered.push({ id: syn.id, type: "attribute", stage: this.stage });
            }
          }
        }
      }
    },

    // ---- 武器进化 ----

    _checkWeaponEvolutions() {
      this.evolutionCandidates = {};
      for (const wid of this.weapons) {
        const weapon = CS.weapons[wid];
        if (!weapon?.evolutionRoutes) continue;
        // 按 priority 排序
        const sorted = [...weapon.evolutionRoutes].sort((a, b) => a.priority - b.priority);
        for (const route of sorted) {
          if (!route.condition) {
            this.evolutionCandidates[wid] = route.id;
            break;
          }
          if (this._checkEvolutionCondition(route.condition)) {
            this.evolutionCandidates[wid] = route.id;
            break;
          }
        }
      }
    },

    applyWeaponEvolution(weaponId) {
      const candidate = this.evolutionCandidates[weaponId];
      if (!candidate) return null;
      this.weaponEvolutions[weaponId] = candidate;
      this.appliedWeaponEvolutions[weaponId] = true;
      return candidate;
    },

    _checkEvolutionCondition(cond) {
      if (cond.crossDept) {
        if (!Object.entries(cond.crossDept).every(([dept, min]) => (this.deptCardCounts[dept] || 0) >= min)) return false;
      }
      if (cond.sameDept) {
        const dept = this.badgeDept;
        if ((this.deptCardCounts[dept] || 0) < cond.sameDept.minCards) return false;
      }
      if (cond.otherDept) {
        if ((this.deptCardCounts[cond.otherDept.dept] || 0) < cond.otherDept.minCards) return false;
      }
      // 标签条件：已装配卡牌标签需覆盖指定标签集
      if (cond.tags) {
        const equippedTags = new Set();
        for (const cardId of this.supportCards || []) {
          const card = CS.cards[cardId];
          if (card && card.tags) card.tags.forEach(function(t) { equippedTags.add(t); });
        }
        for (const ids of Object.values(this.slotAugments || {})) {
          for (const cardId of ids || []) {
            const card = CS.cards[cardId];
            if (card && card.tags) card.tags.forEach(function(t) { equippedTags.add(t); });
          }
        }
        for (const slotId of this.getAllSlotIds()) {
          const cardId = this.slotCards[slotId];
          if (!cardId) continue;
          const card = CS.cards[cardId];
          if (card && card.tags) {
            card.tags.forEach(function(t) { equippedTags.add(t); });
          }
        }
        const minMatches = cond.tags.minMatches || cond.tags.required.length;
        const matchCount = cond.tags.required.filter(function(t) { return equippedTags.has(t); }).length;
        if (matchCount < minMatches) return false;
      }
      // 至少满足了一种部门/标签条件
      return cond.crossDept || cond.sameDept || cond.otherDept || cond.tags ? true : false;
    },

    // ---- 协作任务 ----

    checkCollabQuest(stage) {
      if (this.activeCollabQuest) return null;
      for (const quest of CS.collabQuests) {
        if (quest.stageTrigger !== stage) continue;
        if (this.completedCollabQuests.includes(quest.id)) continue;
        if (Math.random() > quest.chance) continue;
        const satisfied = quest.requires.depts
          ? quest.requires.depts.every(function(d) { return (this.deptCardCounts[d] || 0) >= quest.requires.minEach; }.bind(this))
          : quest.requires.tags
            ? (function() {
                var equippedTags = new Set();
                for (var supportId of this.supportCards || []) {
                  var supportCard = CS.cards[supportId];
                  if (supportCard && supportCard.tags) supportCard.tags.forEach(function(t) { equippedTags.add(t); });
                }
                for (var ids of Object.values(this.slotAugments || {})) {
                  for (var augmentId of ids || []) {
                    var augmentCard = CS.cards[augmentId];
                    if (augmentCard && augmentCard.tags) augmentCard.tags.forEach(function(t) { equippedTags.add(t); });
                  }
                }
                for (var slotId of this.getAllSlotIds()) {
                  var cardId = this.slotCards[slotId];
                  if (!cardId) continue;
                  var card = CS.cards[cardId];
                  if (card && card.tags) card.tags.forEach(function(t) { equippedTags.add(t); });
                }
                var minM = quest.requires.minMatches || 1;
                var matchCount = quest.requires.tags.filter(function(t) { return equippedTags.has(t); }).length;
                return matchCount >= minM;
              }).call(this)
            : false;
        if (satisfied) {
          this.activeCollabQuest = quest;
          return { quest, satisfied: true };
        }
        if (quest.showHintOnFirstMiss) {
          this.pendingCollabHint = quest;
          return { quest, satisfied: false, hint: true };
        }
      }
      return null;
    },

    completeCollabQuest(accept) {
      if (!this.activeCollabQuest) return null;
      const q = this.activeCollabQuest;
      this.completedCollabQuests.push(q.id);
      this.runLog.collabCompleted.push(q.id);
      this.activeCollabQuest = null;
      return { quest: q, accepted: accept, reward: accept ? q.reward : null };
    },

    // ---- 换槽 ----

    swapCardSlot(fromSlot, toSlot) {
      if (!this.slotCards[fromSlot]) return { ok: false, error: "源槽位无卡" };
      if (this.slotCards[toSlot]) return { ok: false, error: "目标槽位已占" };
      this.slotCards[toSlot] = this.slotCards[fromSlot];
      this.slotCards[fromSlot] = null;
      this.freeSwapUsed = true;
      this._updateSynergies();
      return { ok: true };
    },

    // ---- 查询 ----

    getMilestoneStatus(deptId) {
      const count = this.deptCardCounts[deptId] || 0;
      const reached = this.deptMilestones[deptId] || [];
      const nextMilestone = CS.milestoneTiers.find(t => !reached.includes(t.cards));
      return {
        count,
        reached,
        nextTier: nextMilestone ? nextMilestone.cards - count : 0,
        nextDesc: nextMilestone?.desc || CS.milestoneCapMessage,
        investment: this.getDeptInvestmentBonus(deptId)
      };
    },

    getDeptInvestmentBonus(deptId) {
      return this.deptInvestmentBonus[deptId] || 1.0;
    },

    /** 获取当前 Build 的主要部门 */
    getPrimaryDept() {
      let maxCount = 0, primary = this.badgeDept;
      for (const [dept, count] of Object.entries(this.deptCardCounts)) {
        if (count > maxCount) { maxCount = count; primary = dept; }
      }
      return primary;
    },

    getWeaponSetBonuses() {
      const bonuses = {};
      const deptWeaponCounts = {};
      for (const wid of this.weapons) {
        const dept = CS.weapons[wid]?.department;
        if (dept) deptWeaponCounts[dept] = (deptWeaponCounts[dept] || 0) + 1;
      }
      for (const [dept, count] of Object.entries(deptWeaponCounts)) {
        if (count >= 2) {
          bonuses[dept] = CS.departments[dept]?.weaponSet?.[2]?.bonus || {};
        }
      }
      return bonuses;
    },

    /** 所有可能的槽位 id */
    getAllSlotIds() {
      return ["offense", "survival", "resource", "mechanic", "cost"];
    },

    getChapterIndex() {
      return Math.max(1, Math.min(5, Math.ceil((this.stage || 1) / 4)));
    },

    getUnlockedSlotIds() {
      const chapter = this.getChapterIndex();
      if (chapter <= 1) return ["offense"];
      if (chapter === 2) return ["offense", "survival"];
      if (chapter === 3) return ["offense", "survival", "resource", "mechanic"];
      return this.getAllSlotIds();
    },

    isSlotUnlocked(slotId) {
      return this.getUnlockedSlotIds().indexOf(slotId) >= 0;
    },

    /** 当前已占用的槽位数 */
    getFilledSlotCount() {
      return Object.values(this.slotCards).filter(Boolean).length;
    },

    /** 获取各槽位卡牌所属属性 */
    getSlotAttribute(slotId) {
      const idx = this.getAllSlotIds().indexOf(slotId);
      return idx >= 0 && idx < this.attributes.length ? this.attributes[idx] : null;
    },

    // ---- 槽位解锁 - New in v0.3a - New

    /** Lv.5: 解锁第 4 属性槽 */
    unlockSlot4() {
      // slotCards 从 3 个扩展到 4 个有效槽 (offense, survival, resource, mechanic)
      // mechanic 槽现在可用
      this.slotCards.mechanic = this.slotCards.mechanic || null;  // 确保槽位存在
    },

    /** Lv.10: 解锁第 5 属性槽 */
    unlockSlot5() {
      // slotCards 从 4 个扩展到 5 个有效槽 (offense, survival, resource, mechanic, cost)
      // cost 槽现在可用
      this.slotCards.cost = this.slotCards.cost || null;
    },

    // ---- Build 总结（Step 7：UI 增强）----

    /** 生成本局 Build 名称 */
    generateBuildName() {
      var dept = CS.departments[this.badgeDept];
      var deptName = dept ? dept.name : "未知部门";
      var deptEmoji = dept ? dept.emoji : "";

      // 找已进化的武器
      var evoName = null;
      for (var wid of this.weapons) {
        var evoId = this.weaponEvolutions[wid];
        if (!evoId) continue;
        var weapon = CS.weapons[wid];
        if (!weapon) continue;
        var route = weapon.evolutionRoutes.find(function(r) { return r.id === evoId; });
        if (route && route.priority < 99) {
          evoName = route.name;
          break;
        }
      }

      if (evoName) {
        return deptEmoji + " " + deptName + " · " + evoName;
      }

      // 无高级进化：显示主武器名
      var mainWpn = CS.weapons[this.weapons[0]];
      var wpnName = mainWpn ? mainWpn.name : "未知武器";
      return deptEmoji + " " + deptName + " · " + wpnName + "（未进化）";
    },

    /** 生成本局 Build 总结 */
    summarizeBuild(finalStage, finalLevel, killCount) {
      var summary = {
        buildName: this.generateBuildName(),
        badgeDept: this.badgeDept,
        deptName: CS.departments[this.badgeDept]?.name || "未知",
        primaryDept: this.getPrimaryDept(),
        // 主要标签统计
        primaryTags: this._getPrimaryTags(),
        // 槽位配置
        slotSummary: this._summarizeSlots(),
        // 武器进化
        weaponEvolutions: this.weaponEvolutions,
        evolutionCandidates: this.evolutionCandidates,
        appliedWeaponEvolutions: this.appliedWeaponEvolutions,
        evolvedWeapons: this._getEvolvedWeaponNames(),
        // 里程碑
        milestonesReached: this.deptMilestones,
        investmentBonuses: this.deptInvestmentBonus,
        // 协同
        activeDeptSynergies: this.activeDeptSynergies,
        activeAttrSynergies: this.activeAttrSynergies,
        // 协作任务
        completedCollabs: this.completedCollabQuests,
        // 属性
        attributes: this.attributes.map(function(a) { return CS.attributes[a]?.name || a; }),
        // 统计
        finalStage: finalStage,
        finalLevel: finalLevel,
        killCount: killCount,
        cardCount: this.ownedCardIds.length,
        // 下次可尝试方向
        nextSuggestion: this._generateNextSuggestion()
      };
      return summary;
    },

    _getPrimaryTags() {
      var tagCounts = {};
      for (var supportId of this.supportCards || []) {
        var supportCard = CS.cards[supportId];
        if (!supportCard || !supportCard.tags) continue;
        supportCard.tags.forEach(function(t) {
          if (["starter","scaler","transformer","support"].indexOf(t) >= 0) return;
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
      }
      for (var ids of Object.values(this.slotAugments || {})) {
        for (var augmentId of ids || []) {
          var augmentCard = CS.cards[augmentId];
          if (!augmentCard || !augmentCard.tags) continue;
          augmentCard.tags.forEach(function(t) {
            if (["starter","scaler","transformer","support"].indexOf(t) >= 0) return;
            tagCounts[t] = (tagCounts[t] || 0) + 1;
          });
        }
      }
      for (var slotId of this.getAllSlotIds()) {
        var cardId = this.slotCards[slotId];
        if (!cardId) continue;
        var card = CS.cards[cardId];
        if (!card || !card.tags) continue;
        card.tags.forEach(function(t) {
          // 只统计机制标签，排除 role 标签
          if (["starter","scaler","transformer","support"].indexOf(t) >= 0) return;
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
      }
      var sorted = Object.entries(tagCounts).sort(function(a, b) { return b[1] - a[1]; });
      return sorted.slice(0, 3).map(function(e) { return { tag: e[0], name: (CS.tags[e[0]]?.name || e[0]), count: e[1] }; });
    },

    _summarizeSlots() {
      var slots = {};
      for (var slotId of this.getAllSlotIds()) {
        var cardId = this.slotCards[slotId];
        if (!cardId) { slots[slotId] = null; continue; }
        var card = CS.cards[cardId];
        if (!card) { slots[slotId] = { cardId: cardId }; continue; }
        var attr = this.getSlotAttribute(slotId);
        slots[slotId] = {
          cardId: cardId,
          cardName: card.name,
          dept: card.department,
          rarity: card.rarity,
          role: card.role || "starter",
          tags: card.tags || [],
          slotLabel: card.slotEffects[slotId]?.label || "-",
          attrName: attr ? CS.attributes[attr]?.name : "-"
        };
      }
      return slots;
    },

    _getEvolvedWeaponNames() {
      var names = [];
      for (var wid of this.weapons) {
        var evoId = this.weaponEvolutions[wid];
        if (!evoId) continue;
        var weapon = CS.weapons[wid];
        if (!weapon) continue;
        var route = weapon.evolutionRoutes.find(function(r) { return r.id === evoId; });
        if (route) names.push({ weaponId: wid, weaponName: weapon.name, evolutionName: route.name, isDefault: route.priority >= 99 });
      }
      return names;
    },

    _generateNextSuggestion() {
      var suggestions = [];
      // 若只有 1 个部门大量卡牌：建议尝试另一个部门
      var deptCounts = this.deptCardCounts;
      var maxDept = this.getPrimaryDept();
      var otherDepts = Object.keys(deptCounts).filter(function(d) { return d !== maxDept && deptCounts[d] > 0; });

      if (otherDepts.length === 0) {
        suggestions.push("试试混合另一个部门触发协同：" + CS.departments[maxDept]?.name + " + ?");
      } else if (otherDepts.length === 1 && (deptCounts[otherDepts[0]] || 0) < 2) {
        suggestions.push("你已有" + (CS.departments[otherDepts[0]]?.name||otherDepts[0]) + "的一张卡——再来一张触发协同");
      }

      // 若未触发属性协同
      if (this.activeAttrSynergies.length === 0 && this.attributes.length >= 2) {
        suggestions.push("装配匹配属性槽的卡牌以触发属性协同");
      }

      // 若武器未进化
      var unevolved = this.weapons.filter(function(w) { return !this.weaponEvolutions[w] || this.weaponEvolutions[w].indexOf('_default') >= 0 || this.weaponEvolutions[w].indexOf('_instant') >= 0 || this.weaponEvolutions[w].indexOf('_membrane') >= 0 || this.weaponEvolutions[w].indexOf('_oil') >= 0; }.bind(this));
      if (unevolved.length > 0) {
        var wpnName = CS.weapons[unevolved[0]]?.name || unevolved[0];
        suggestions.push("试试让" + wpnName + "进化——需要更多同部门或特定标签卡牌");
      }

      return suggestions.length > 0 ? suggestions : ["尝试不同部门工牌，探索更多 Build 维度"];
    },

    /** 获取当前 Build 的一条短语描述 */
    getBuildTagline() {
      var primaryTags = this._getPrimaryTags();
      if (primaryTags.length === 0) return "还未成型";
      var tagNames = primaryTags.map(function(t) { return t.name; });
      return tagNames.slice(0, 2).join(" + ") + (primaryTags.length > 2 ? " …" : "");
    },

    /** 获取玩家当前可尝试的进化方向提示 */
    getEvolutionHints() {
      var hints = [];
      for (var wid of this.weapons) {
        var weapon = CS.weapons[wid];
        if (!weapon || !weapon.evolutionRoutes) continue;
        for (var route of weapon.evolutionRoutes) {
          if (route.priority >= 99) continue;  // 跳过默认进化
          if (this._checkEvolutionCondition(route.condition)) {
            hints.push({
              weaponId: wid,
              weaponName: weapon.name,
              evolutionName: route.name,
              evolutionDesc: route.description,
              status: "ready",
              narrative: route.narrativeText
            });
            break;  // 只显示最高优先级已满足的
          }
        }
      }
      return hints;
    },

    getAvailableSlotCount: function() {
      var count = 0;
      for (var slotId of this.getUnlockedSlotIds()) {
        if (!this.slotCards[slotId]) count++;
      }
      return count;
    },

    /** 获取可用（未占用且已解锁）的槽位列表 */
    getAvailableSlots() {
      var slots = [];
      var allSlots = this.getUnlockedSlotIds();
      for (var i = 0; i < allSlots.length; i++) {
        var slotId = allSlots[i];
        if (this.slotCards[slotId]) continue;  // skip occupied slots
        slots.push(slotId);
      }
      return slots;
    }
  };

})();
