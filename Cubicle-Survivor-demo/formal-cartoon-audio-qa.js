const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const assetDir = path.join(root, "assets", "cartoon-office-audio");
const report = JSON.parse(fs.readFileSync(path.join(root, "formal-cartoon-audio-runtime-report.json"), "utf8"));
const contract = JSON.parse(fs.readFileSync(path.join(assetDir, "cartoon-office-audio-contract.json"), "utf8"));

function check(condition, message) {
  if (!condition) throw new Error("Formal cartoon audio QA: " + message);
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function readWav(file) {
  const buffer = fs.readFileSync(file);
  check(buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WAVE", path.basename(file) + " is not RIFF/WAVE");
  let offset = 12;
  let format = null;
  let pcm = null;
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const start = offset + 8;
    if (id === "fmt ") {
      format = {
        code: buffer.readUInt16LE(start),
        channels: buffer.readUInt16LE(start + 2),
        sampleRate: buffer.readUInt32LE(start + 4),
        bits: buffer.readUInt16LE(start + 14)
      };
    }
    if (id === "data") pcm = buffer.subarray(start, start + size);
    offset = start + size + (size % 2);
  }
  check(format && pcm, path.basename(file) + " lost fmt or data chunk");
  let sumSquares = 0;
  let peak = 0;
  for (let index = 0; index < pcm.length; index += 2) {
    const value = pcm.readInt16LE(index) / 32768;
    peak = Math.max(peak, Math.abs(value));
    sumSquares += value * value;
  }
  const frames = pcm.length / 2 / format.channels;
  return {
    ...format,
    frames,
    duration: frames / format.sampleRate,
    peak,
    rms: Math.sqrt(sumSquares / Math.max(1, pcm.length / 2))
  };
}

check(report.schemaVersion === 1 && report.entry === "demo-v3-15.html", "report identity drifted");
check(report.status === "passed" && report.phase === "four-weapon-v3-15", "runtime report did not pass");
check(report.contract.combatProgressionEconomyChanged === false, "audio pass must remain presentation-only");
check(report.contract.cueCount === 21 && report.contract.sampleRate === 22050
  && report.contract.channels === 1 && report.contract.bitsPerSample === 16, "formal audio format contract drifted");

const cueIds = Object.keys(contract.cues || {});
check(cueIds.length === 21, "contract must retain exactly 21 semantic cues");
check(contract.enemyMapping.normal.length === 8 && contract.enemyMapping.boss.length === 5,
  "enemy identity matrix must retain eight normal enemies and five Bosses");
const hashes = new Set();
let minimumDuration = Infinity;
let maximumDuration = 0;
let minimumRms = Infinity;
let maximumPeak = 0;
cueIds.forEach((cueId) => {
  const cue = contract.cues[cueId];
  const file = path.join(assetDir, cue.file);
  check(fs.existsSync(file), cue.file + " is missing");
  const wav = readWav(file);
  check(wav.code === 1 && wav.channels === 1 && wav.sampleRate === 22050 && wav.bits === 16,
    cue.file + " must remain mono 16-bit PCM at 22050 Hz");
  check(wav.duration >= 0.2 && wav.duration <= 0.8, cue.file + " left the short gameplay-cue duration window");
  check(wav.peak >= 0.12 && wav.peak <= 0.82 && wav.rms >= 0.012 && wav.rms <= 0.38,
    cue.file + " is silent, clipped, or outside the authored mix window");
  hashes.add(sha256(file));
  minimumDuration = Math.min(minimumDuration, wav.duration);
  maximumDuration = Math.max(maximumDuration, wav.duration);
  minimumRms = Math.min(minimumRms, wav.rms);
  maximumPeak = Math.max(maximumPeak, wav.peak);
});
check(hashes.size === cueIds.length, "every formal cue must be a distinct rendered WAV");

check(report.browser.v315.gate === "true" && report.browser.v315.discoveredWavs === 21
  && report.browser.v315.decodedWavs === 21 && report.browser.v315.failedWavs === 0
  && report.browser.v315.runtimeErrors === 0 && report.browser.v315.consoleErrors === 0,
"browser evidence lost gate, discovery, decode, or zero-error status");
check(report.browser.v315.contextState === "suspended" && report.browser.v315.autoplayPolicyRespected,
  "automated browser must not bypass its autoplay policy");
check(report.browser.v314.gate === "" && report.browser.v314.auditEvents === 0
  && report.browser.v314.runtimeErrors === 0 && report.browser.v314.consoleErrors === 0,
"V3.14 isolation drifted");

const config = fs.readFileSync(path.join(root, "src/v2/demo-v2/four-weapon-fixed.js"), "utf8");
const state = fs.readFileSync(path.join(root, "src/v2/runtime/state.js"), "utf8");
const combat = fs.readFileSync(path.join(root, "src/v2/combat/systems.js"), "utf8");
const marker = fs.readFileSync(path.join(root, "src/v2/demo-v2/marker-fixed.js"), "utf8");
const audio = fs.readFileSync(path.join(root, "src/v2/audio/audio.js"), "utf8");
const render = fs.readFileSync(path.join(root, "src/v2/ui/render.js"), "utf8");
const main = fs.readFileSync(path.join(root, "main.js"), "utf8");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");

check((config.match(/formalCartoonAudioPass:\s*true/g) || []).length === 1
  && (state.match(/formalCartoonAudioPass/g) || []).length >= 2,
"V3.15-only audio gate or state propagation drifted");
check(render.includes("dataset.formalCartoonAudio"), "render layer lost its formal audio gate");
check(audio.includes("function prepareFormalAudio") && audio.includes("function handleFormalEvent")
  && audio.includes("?v=315-audio-1") && audio.includes("window.fetch")
  && audio.includes("decodeAudioData") && audio.includes("event.force"),
"preload, decode, cache, or semantic playback contract drifted");
check(combat.includes('traceFormalAudioEvent(state, "enemy_action"')
  && combat.includes('traceFormalAudioEvent(state, "enemy_defeat"')
  && marker.includes('kind: "encounter_complete"') && marker.includes('kind: "run_complete"'),
"enemy action, defeat, encounter, or final completion hook drifted");
check(main.includes('params.get("formalAudio")') && main.includes("playDebugFormalAudio"),
  "deterministic browser audio harness drifted");
check(index.includes("audio.js?v=9") && index.includes("marker-fixed.js?v=10")
  && index.includes("four-weapon-fixed.js?v=14") && index.includes("state.js?v=31")
  && index.includes("systems.js?v=95") && index.includes("render.js?v=47") && index.includes("main.js?v=94"),
"runtime cache versions drifted");

Object.entries(report.sourceHashes || {}).forEach(([name, expected]) => {
  const file = path.join(root, name);
  check(fs.existsSync(file) && sha256(file) === expected, "runtime evidence is stale for " + name);
});
check(Object.values(report.assertions || {}).every(Boolean), "one or more audio assertions did not pass");
check(Array.isArray(report.remainingBlockers) && report.remainingBlockers.length === 0,
  "cleared audio blockers drifted");

console.log(JSON.stringify({
  entry: report.entry,
  cueCount: cueIds.length,
  distinctWavs: hashes.size,
  durationRange: [Number(minimumDuration.toFixed(3)), Number(maximumDuration.toFixed(3))],
  minimumRms: Number(minimumRms.toFixed(4)),
  maximumPeak: Number(maximumPeak.toFixed(4)),
  browserDecoded: report.browser.v315.decodedWavs,
  status: report.status
}, null, 2));
