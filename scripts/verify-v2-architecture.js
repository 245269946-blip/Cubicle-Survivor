const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const activeFiles = [
  "index.html",
  "main.js",
  "src/data/departments.js",
  "src/data/weapons.js",
  "src/v2/data/weapon-forms.js",
  "src/v2/compat/legacy.js",
  "src/v2/runtime/state.js",
  "src/v2/progression/progression.js",
  "src/v2/combat/systems.js",
  "src/v2/ui/view-model.js",
  "src/v2/ui/render.js"
];

const badPatterns = [
  /\?{3,}/,
  /[\uE000-\uF8FF]/,
  /�|锟/,
  new RegExp([
    "\\u940f",
    "\\u95b8",
    "\\u9227",
    "\\u951b",
    "\\u93c9\\u613d\\u67a1",
    "\\u7b57\\?",
    "\\u5bb8\\u4f4d",
    "\\u93c8\\u613d\\u67a1",
    "\\u93c9\\ufe01",
    "\\u59dd\\ufe40",
    "\\u5bb8\\u30e7",
    "\\u59dd\\u30e5",
    "\\u7ee0\\?",
    "\\u6d93\\?"
  ].join("|"))
];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function fail(message) {
  console.error("FAIL:", message);
  process.exitCode = 1;
}

const index = read("index.html");
if (/versions\/v1|v1\.0|v2-pre-cleanup/.test(index)) {
  fail("active index loads archived version files");
}

const scripts = [...index.matchAll(/<script\s+src="([^"]+)"/g)].map((m) => m[1].split("?")[0]);
for (const expected of [
  "src/v2/data/weapon-forms.js",
  "src/v2/compat/legacy.js",
  "src/v2/runtime/state.js",
  "src/v2/progression/progression.js",
  "src/v2/combat/systems.js",
  "src/v2/ui/view-model.js",
  "src/v2/ui/render.js",
  "main.js"
]) {
  if (!scripts.includes(expected)) fail("missing active script: " + expected);
}

const main = read("main.js");
for (const name of ["renderUpgradeChoices", "renderShop", "openWeaponArmory", "startGameActual", "loop", "render"]) {
  const re = new RegExp("function\\s+" + name + "\\s*\\(", "g");
  const count = (main.match(re) || []).length;
  if (count > 0) fail("legacy core function should not exist in active main.js: " + name);
}

for (const file of activeFiles) {
  const text = read(file);
  for (const re of badPatterns) {
    if (re.test(text)) fail("mojibake pattern in active file " + file + ": " + re);
  }
}

const forms = read("src/v2/data/weapon-forms.js");
for (const key of ["line_split", "mark_detonate", "shield_counter_line", "line_to_wave", "line_grid_field"]) {
  if (!forms.includes(key)) fail("marker form missing: " + key);
}

if (!fs.existsSync(path.join(root, "versions/v2-pre-cleanup/main.js"))) {
  fail("pre-cleanup main.js archive missing");
}

if (!process.exitCode) console.log("V2 architecture checks passed");
