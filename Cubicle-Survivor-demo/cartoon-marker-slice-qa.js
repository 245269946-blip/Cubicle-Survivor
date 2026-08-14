const fs = require("fs");
const path = require("path");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "cartoon-marker-slice.html"), "utf8");
const css = fs.readFileSync(path.join(root, "cartoon-marker-slice.css"), "utf8");
const js = fs.readFileSync(path.join(root, "src", "cartoon-marker-slice.js"), "utf8");

function check(condition, message) {
  if (!condition) throw new Error("Cartoon marker slice QA: " + message);
}

[
  "game", "startPanel", "upgradePanel", "completePanel", "startButton",
  "upgradeButton", "restartButton", "remaining", "progressFill", "buildName"
].forEach((id) => check(html.includes(`id="${id}"`), `missing #${id}`));

check(html.includes("清空 30 份积压"), "task must stay concrete and short");
check(html.includes("复写"), "upgrade name missing");
check(html.includes("多画一条"), "immediate upgrade result missing");
check(html.includes("已归档"), "completion result missing");
check(!html.includes("组件") && !html.includes("工坊") && !html.includes("协同"), "P0 entry leaked parallel systems");
check(css.includes("@media (max-width: 760px)"), "narrow-screen treatment missing");

check(/const TOTAL = 30;/.test(js), "task quota drifted from 30");
check(js.includes("state.killed >= 11"), "upgrade timing gate missing");
check(js.includes("state.upgraded ? [-13, 13] : [0]"), "double-line payoff missing");
check(js.includes("state.attacks = []"), "completion does not clear attack residue");
check(js.includes("remaining === 0"), "zero-state archive prop missing");
check(js.includes("window.CartoonMarkerSlice"), "test/debug contract missing");

const assets = [
  "office-arena-v1.webp",
  "marker-worker-v1.png",
  "backlog-enemy-v1.png",
  "urgent-email-enemy-v1.png"
];
assets.forEach((name) => {
  const file = path.join(root, "assets", "cartoon-marker-slice", name);
  check(fs.existsSync(file), `missing asset ${name}`);
  check(fs.statSync(file).size > 10000, `asset ${name} is unexpectedly small`);
});

console.log(JSON.stringify({
  entry: "cartoon-marker-slice.html",
  quota: 30,
  upgrade: "复写｜多画一条",
  assets: assets.length,
  status: "passed"
}, null, 2));
