import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");

function run(command, args, cwd) {
  const useWindowsNpmWrapper = process.platform === "win32" && command === "npm";
  const executable = useWindowsNpmWrapper ? process.env.ComSpec || "cmd.exe" : command;
  const finalArgs = useWindowsNpmWrapper ? ["/d", "/s", "/c", "npm", ...args] : args;
  const result = spawnSync(executable, finalArgs, {
    cwd,
    encoding: "utf8",
    stdio: "inherit",
    shell: false,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }
}

run("npm", ["run", "qa"], path.join(repoRoot, "Cubicle-Survivor-demo"));
run("node", [path.join(repoRoot, "scripts", "sync-demo-v2-site.mjs"), "--check"], repoRoot);
run("npm", ["test"], path.join(repoRoot, "Cubicle-Survivor-sites"));

console.log("DEMO V2 RELEASE VALIDATION PASSED");
