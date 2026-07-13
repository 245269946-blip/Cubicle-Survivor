// ================================================================
// src/v2/compat/legacy.js
// Compatibility shell. Old data is mapped here instead of leaking into UI.
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});
  const V2 = CS.V2 || (CS.V2 = {});

  const weaponAliases = {
    sticky: "sticky_note",
    headset: "headphones"
  };

  const slotNames = {
    offense: "输出槽",
    survival: "生存槽",
    resource: "资源槽",
    mechanic: "机制槽",
    cost: "代价槽"
  };

  const slotUnlockStage = {
    offense: 2,
    survival: 3,
    resource: 4,
    mechanic: 6,
    cost: 9
  };

  V2.compat = {
    weaponAliases,
    slotNames,
    slotUnlockStage,
    normalizeWeaponId(id) {
      return weaponAliases[id] || id || "marker";
    },
    normalizeDeptId(id) {
      if (id === "admin") return "general";
      return id || "general";
    },
    deptColor(id) {
      const dept = CS.departments && CS.departments[this.normalizeDeptId(id)];
      return dept ? dept.color : "#00e5ff";
    },
    deptName(id) {
      const dept = CS.departments && CS.departments[this.normalizeDeptId(id)];
      return dept ? dept.name : "未定部门";
    },
    deptEmoji(id) {
      const dept = CS.departments && CS.departments[this.normalizeDeptId(id)];
      return dept ? dept.emoji : "ID";
    },
    weaponName(id) {
      const weapon = CS.weapons && CS.weapons[this.normalizeWeaponId(id)];
      return weapon ? weapon.name : "未知武器";
    },
    cleanVisibleText(text) {
      const s = String(text || "");
      const bad = [
        "\\?{3,}",
        "\\u940f",
        "\\u95b8",
        "\\u9227",
        "\\u951b",
        "\\u93c8\\u613d\\u67a1",
        "\\u93c9\\ufe01",
        "\\u59dd\\ufe40",
        "\\u5bb8\\u30e7"
      ];
      const mojibake = new RegExp("(" + bad.join("|") + ")");
      if (mojibake.test(s)) return "";
      return s;
    }
  };
})();
