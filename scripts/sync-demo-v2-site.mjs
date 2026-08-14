import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const sourceRoot = path.resolve(repoRoot, "Cubicle-Survivor-demo");
const targetRoot = path.resolve(repoRoot, "Cubicle-Survivor-sites", "public", "play");
const checkOnly = process.argv.includes("--check");
const runtimeEntries = [
  "index.html",
  "demo-v2-9.html",
  "demo-v3-0.html",
  "demo-v3-1.html",
  "demo-v3-2.html",
  "demo-v3-3.html",
  "demo-v3-4.html",
  "demo-v3-5.html",
  "demo-v3-6.html",
  "demo-v3-7.html",
  "demo-v3-8.html",
  "demo-v3-9.html",
  "demo-v3-10.html",
  "demo-v3-11.html",
  "demo-v3-12.html",
  "demo-v3-13.html",
  "demo-v3-14.html",
  "main.js",
  "styles.css",
  "generated-skin.css",
  "assets",
  "src",
];

function assertSafePaths() {
  const expectedTarget = path.join(repoRoot, "Cubicle-Survivor-sites", "public", "play");
  if (targetRoot !== expectedTarget || !targetRoot.startsWith(repoRoot + path.sep)) {
    throw new Error(`Unsafe site sync target: ${targetRoot}`);
  }
  if (!sourceRoot.startsWith(repoRoot + path.sep) || sourceRoot === targetRoot) {
    throw new Error(`Unsafe site sync source: ${sourceRoot}`);
  }
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function sha256(filePath) {
  const contents = await readFile(filePath);
  return createHash("sha256").update(contents).digest("hex");
}

async function verifyRequiredFiles() {
  const required = [
    "index.html",
    "demo-v2-9.html",
    "demo-v3-0.html",
    "demo-v3-1.html",
    "demo-v3-2.html",
    "demo-v3-3.html",
    "demo-v3-4.html",
    "demo-v3-5.html",
    "demo-v3-6.html",
    "demo-v3-7.html",
    "demo-v3-8.html",
    "demo-v3-9.html",
    "demo-v3-10.html",
    "demo-v3-11.html",
    "demo-v3-12.html",
    "demo-v3-13.html",
    "demo-v3-14.html",
    "main.js",
    "styles.css",
    "generated-skin.css",
    "src/v2/demo-v2/four-weapon-fixed.js",
    "src/v2/demo-v2/marker-fixed.js",
    "src/v2/demo-v2/thermos-fixed.js",
    "src/v2/demo-v2/scissors-fixed.js",
    "src/v2/demo-v2/correction-fluid-fixed.js",
  ];
  for (const relativePath of required) {
    const sourcePath = path.join(sourceRoot, relativePath);
    const targetPath = path.join(targetRoot, relativePath);
    if (!(await exists(sourcePath)) || !(await exists(targetPath))) {
      throw new Error(`Missing release file: ${relativePath}`);
    }
    if ((await sha256(sourcePath)) !== (await sha256(targetPath))) {
      throw new Error(`Hosted runtime drifted from the active demo: ${relativePath}`);
    }
  }
  const entry = await readFile(path.join(targetRoot, "demo-v3-14.html"), "utf8");
  const suite = await readFile(path.join(targetRoot, "src/v2/demo-v2/four-weapon-fixed.js"), "utf8");
  if (!entry.includes("Demo V3.14") || !entry.includes('params.set("demoV2", "four-weapon-v3-14")')) {
    throw new Error("Hosted entry does not route to the Demo V3.14 compact-decision suite");
  }
  if (!suite.includes('version: "Demo V3.14"') || !suite.includes('decisionCompressionPass: true') || !suite.includes('version: "Demo V3.13"') || !suite.includes('allWeaponDesireLoopPass: true') || !suite.includes('markerDesireLoopPass: true') || !suite.includes('combatTrianglePass: true') || !suite.includes('neonBloomPass: true') || !suite.includes('bossPatternPass: true') || !suite.includes('sustainedPressurePass: true') || !suite.includes('bossPressurePass: true') || !suite.includes('attributeImpactPass: true') || !suite.includes('weaponEmbodimentPass: true') || !suite.includes('thermosEmbodimentPass: true') || !suite.includes('thermosBackPressurePass: true') || !suite.includes('scissorsEmbodimentPass: true') || !suite.includes('correctionEmbodimentPass: true') || !suite.includes('combatScaleOrbitPass: true') || !suite.includes('openingComfortPass: true') || !suite.includes('weaponParityPass: true')) {
    throw new Error("Hosted coordinator is not the validated Demo V3.14 compact-decision build");
  }
}

assertSafePaths();
if (!checkOnly) {
  // This is the only recursive replacement operation in the release path. The
  // resolved absolute target is asserted above before anything is removed.
  await rm(targetRoot, { recursive: true, force: true });
  await mkdir(targetRoot, { recursive: true });
  for (const entry of runtimeEntries) {
    await cp(path.join(sourceRoot, entry), path.join(targetRoot, entry), { recursive: true });
  }
  await writeFile(
    path.join(targetRoot, "release-manifest.json"),
    JSON.stringify(
      {
        version: "Demo V3.14",
        entry: "/play/demo-v3-14.html",
        source: "Cubicle-Survivor-demo",
        validation: "docs/DEMO_V2_VALIDATION_RELEASE_WORKFLOW.md + docs/DEMO_V3_14_DECISION_DENSITY_PASS.md",
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );
}

await verifyRequiredFiles();
console.log(checkOnly ? "SITE SYNC CHECK PASSED" : "SITE RUNTIME SYNCED");
