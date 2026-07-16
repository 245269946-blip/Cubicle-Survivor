// ================================================================
// src/v2/audio/audio.js
// Demo V1 weapon-event SFX contract and lightweight Web Audio synth.
// Combat emits semantic sources; this module owns sound, throttling and mix.
// ================================================================
(function () {
  const CS = window.CS || (window.CS = {});
  const V2 = CS.V2 || (CS.V2 = {});

  const STORAGE_KEY = "cubicle_demo_v1_audio_muted";
  const ROLE_MIX = { primary: 1, secondary: 0.55, support: 0.36 };
  const STAGE_MIX = { anticipation: 0.62, release: 1, impact: 0.82, residual: 0.46, fade: 0.35 };
  const MAX_ACTIVE_VOICES = 12;
  const MAX_MUSIC_VOICES = 8;

  const MUSIC_SCENES = {
    "weapon_intro:normal": { phase: "weapon_intro", variant: "normal", label: "工位热身", bpm: 84, root: 48, wave: "triangle", pattern: [0, null, 7, null, 3, null, 10, null], pulse: 4 },
    "weapon_intro:boss": { phase: "weapon_intro", variant: "boss", label: "实习小考", bpm: 104, root: 45, wave: "sawtooth", pattern: [0, 0, 7, 3, 0, 10, 7, 3], pulse: 2 },
    "promotion:normal": { phase: "promotion", variant: "normal", label: "工牌定型", bpm: 92, root: 50, wave: "triangle", pattern: [0, null, 3, 7, null, 10, 7, null], pulse: 4 },
    "promotion:boss": { phase: "promotion", variant: "boss", label: "转正评审", bpm: 110, root: 47, wave: "square", pattern: [0, 3, 7, 10, 0, 7, 3, 10], pulse: 2 },
    "promoted_mastery:normal": { phase: "promoted_mastery", variant: "normal", label: "独当一面", bpm: 100, root: 53, wave: "sine", pattern: [0, 7, null, 3, 12, 10, null, 7], pulse: 4 },
    "promoted_mastery:boss": { phase: "promoted_mastery", variant: "boss", label: "独立交付", bpm: 116, root: 48, wave: "sawtooth", pattern: [0, 7, 3, 10, 12, 7, 10, 3], pulse: 2 },
    "cross_department:normal": { phase: "cross_department", variant: "normal", label: "协作磨合", bpm: 108, root: 55, wave: "triangle", pattern: [0, 4, 7, null, 11, 7, 4, null], pulse: 4 },
    "cross_department:boss": { phase: "cross_department", variant: "boss", label: "联合评审", bpm: 122, root: 50, wave: "square", pattern: [0, 4, 7, 11, 12, 7, 4, 11], pulse: 2 },
    "cross_weapon:normal": { phase: "cross_weapon", variant: "normal", label: "技能借调", bpm: 116, root: 57, wave: "triangle", pattern: [0, 7, 4, 11, 12, 7, 16, 11], pulse: 4 },
    "cross_weapon:boss": { phase: "cross_weapon", variant: "boss", label: "最终评审", bpm: 132, root: 52, wave: "sawtooth", pattern: [0, 7, 4, 11, 12, 16, 11, 7], pulse: 2 }
  };

  const SYNTH_PRESETS = {
    marker_stroke: { wave: "sawtooth", start: 980, end: 520, duration: 0.085, gain: 0.11, noise: 0.014, filter: 5200 },
    marker_scan: { wave: "sawtooth", start: 1320, end: 390, duration: 0.17, gain: 0.13, noise: 0.02, filter: 6000, dual: 1.5 },
    marker_mark: { wave: "sine", start: 690, end: 930, duration: 0.11, gain: 0.1, dual: 1.26 },
    marker_expire: { wave: "sine", start: 480, end: 150, duration: 0.16, gain: 0.075, noise: 0.012, filter: 2400 },
    impact_click: { wave: "square", start: 520, end: 210, duration: 0.055, gain: 0.085, noise: 0.028, filter: 3600 },
    shield_chime: { wave: "sine", start: 510, end: 840, duration: 0.13, gain: 0.095, dual: 1.5 },
    wave_sweep: { wave: "sine", start: 290, end: 120, duration: 0.2, gain: 0.085, noise: 0.035, filter: 1500 },
    field_hum: { wave: "sine", start: 185, end: 145, duration: 0.18, gain: 0.07, dual: 1.5 },
    heat_charge: { wave: "sine", start: 135, end: 330, duration: 0.17, gain: 0.09, noise: 0.024, filter: 1100 },
    steam_soft: { wave: "sine", start: 260, end: 180, duration: 0.09, gain: 0.07, noise: 0.065, filter: 2200 },
    steam_release: { wave: "triangle", start: 175, end: 78, duration: 0.24, gain: 0.12, noise: 0.1, filter: 1650, dual: 0.5 },
    module_chirp: { wave: "square", start: 430, end: 660, duration: 0.075, gain: 0.07, dual: 1.34 },
    station_drop: { wave: "triangle", start: 210, end: 105, duration: 0.17, gain: 0.095, noise: 0.045, filter: 1250 },
    paper_place: { wave: "square", start: 380, end: 250, duration: 0.06, gain: 0.075, noise: 0.08, filter: 2600 },
    paper_seek: { wave: "triangle", start: 330, end: 510, duration: 0.08, gain: 0.065, noise: 0.04, filter: 3200 },
    switch_pulse: { wave: "square", start: 440, end: 720, duration: 0.12, gain: 0.1, dual: 1.5 },
    route_tick: { wave: "square", start: 310, end: 420, duration: 0.05, gain: 0.055, noise: 0.025, filter: 2800 },
    transfer_chirp: { wave: "triangle", start: 720, end: 1080, duration: 0.095, gain: 0.08, dual: 1.26 },
    link_snap: { wave: "square", start: 700, end: 470, duration: 0.075, gain: 0.075, noise: 0.022, filter: 4200 },
    scissor_snip: { wave: "square", start: 1180, end: 430, duration: 0.075, gain: 0.09, noise: 0.018, filter: 5200 },
    scissor_thrust: { wave: "sawtooth", start: 760, end: 210, duration: 0.12, gain: 0.105, noise: 0.028, filter: 4200 },
    scissor_dash: { wave: "triangle", start: 420, end: 880, duration: 0.11, gain: 0.075, noise: 0.04, filter: 3600 },
    scissor_finish: { wave: "square", start: 310, end: 92, duration: 0.2, gain: 0.13, noise: 0.065, filter: 2800, dual: 1.5 },
    shelter_ping: { wave: "sine", start: 620, end: 1040, duration: 0.16, gain: 0.085, dual: 1.5 }
    ,correction_spray: { wave: "triangle", start: 840, end: 360, duration: 0.095, gain: 0.075, noise: 0.075, filter: 3900 }
    ,error_glitch: { wave: "square", start: 760, end: 1120, duration: 0.075, gain: 0.068, noise: 0.028, filter: 5200, dual: 1.47 }
    ,error_field: { wave: "sine", start: 205, end: 155, duration: 0.2, gain: 0.068, noise: 0.026, filter: 1800, dual: 1.5 }
    ,system_crash: { wave: "sawtooth", start: 520, end: 72, duration: 0.24, gain: 0.13, noise: 0.082, filter: 3000, dual: 0.5 }
    ,correction_execute: { wave: "square", start: 1180, end: 96, duration: 0.21, gain: 0.125, noise: 0.05, filter: 4300, dual: 1.5 }
  };

  const TOPOLOGY_AUDIO_RULES = {
    piercing_line: { voice: "marker_stroke", triggers: { beam: "release", hit: "impact" }, cooldown: 0.045, hitCooldown: 0.075 },
    branch_line: { voice: "marker_stroke", triggers: { beam: "release", hit: "impact" }, cooldown: 0.055, hitCooldown: 0.085 },
    counter_line: { voice: "marker_scan", triggers: { beam: "release", hit: "impact" }, cooldown: 0.08, hitCooldown: 0.1 },
    scan_line: { voice: "marker_scan", triggers: { beam: "release", hit: "impact" }, cooldown: 0.16, hitCooldown: 0.09 },
    support_line: { voice: "marker_stroke", triggers: { beam: "release", hit: "impact" }, cooldown: 0.18, hitCooldown: 0.14 },
    residual_line: { voice: "marker_stroke", triggers: { beam: "residual" }, cooldown: 0.16 },
    link_line: { voice: "link_snap", triggers: { beam: "release" }, cooldown: 0.11 },
    junction: { voice: "impact_click", triggers: { circle: "impact" }, cooldown: 0.09 },
    target_mark: { voice: "marker_mark", triggers: { circle: "impact" }, cooldown: 0.14 },
    control_mark: { voice: "marker_mark", triggers: { circle: "impact" }, cooldown: 0.14 },
    attached_mark: { voice: "paper_place", triggers: { circle: "impact" }, cooldown: 0.13 },
    radial_blast: { voice: "impact_click", triggers: { circle: "impact" }, cooldown: 0.1 },
    shield_arc: { voice: "shield_chime", triggers: { circle: "release" }, cooldown: 0.12 },
    traveling_ring: { voice: "wave_sweep", triggers: { zone: "release", hit: "impact" }, cooldown: 0.14, hitCooldown: 0.13 },
    aroma_ring: { voice: "wave_sweep", triggers: { zone: "release", hit: "impact" }, cooldown: 0.16, hitCooldown: 0.14 },
    support_ring: { voice: "wave_sweep", triggers: { zone: "release", hit: "impact" }, cooldown: 0.24, hitCooldown: 0.18 },
    control_field: { voice: "field_hum", triggers: { zone: "residual" }, cooldown: 0.3 },
    polygon_field: { voice: "field_hum", triggers: { zone: "residual" }, cooldown: 0.32 },
    deployable_field: { voice: "station_drop", triggers: { zone: "release" }, cooldown: 0.3 },
    heat_orb: { voice: "heat_charge", triggers: { circle: "anticipation" }, cooldown: 0.16 },
    steam_line: { voice: "steam_soft", triggers: { beam: "release", hit: "impact" }, cooldown: 0.085, hitCooldown: 0.12 },
    steam_fan: { voice: "steam_release", triggers: { beam: "release", hit: "impact" }, cooldown: 0.14, hitCooldown: 0.13 },
    steam_column: { voice: "steam_release", triggers: { beam: "release", hit: "impact" }, cooldown: 0.18, hitCooldown: 0.13 },
    target_barrage: { voice: "steam_release", triggers: { circle: "release", hit: "impact" }, cooldown: 0.18, hitCooldown: 0.14 },
    orbit_entity: { voice: "module_chirp", triggers: { circle: "release", zone: "residual" }, cooldown: 0.22 },
    placed_trap: { voice: "paper_place", triggers: { circle: "anticipation" }, cooldown: 0.09 },
    support_trap: { voice: "paper_place", triggers: { circle: "anticipation" }, cooldown: 0.2 },
    seeking_entity: { voice: "paper_seek", triggers: { circle: "release" }, cooldown: 0.11 },
    switch_pulse: { voice: "switch_pulse", triggers: { circle: "release" }, cooldown: 0.18 },
    trail_route: { voice: "route_tick", triggers: { zone: "residual" }, cooldown: 0.16 },
    transfer_chain: { voice: "transfer_chirp", triggers: { circle: "release" }, cooldown: 0.12 },
    melee_arc: { voice: "scissor_snip", triggers: { beam: "release", hit: "impact" }, cooldown: 0.055, hitCooldown: 0.07 },
    melee_thrust: { voice: "scissor_thrust", triggers: { beam: "release", hit: "impact" }, cooldown: 0.075, hitCooldown: 0.08 },
    dash_trail: { voice: "scissor_dash", triggers: { beam: "release" }, cooldown: 0.16 },
    execution_cut: { voice: "scissor_finish", triggers: { beam: "release", hit: "impact" }, cooldown: 0.13, hitCooldown: 0.11 },
    protective_field: { voice: "shelter_ping", triggers: { circle: "release" }, cooldown: 0.13 },
    correction_spray: { voice: "correction_spray", triggers: { beam: "release", hit: "impact" }, cooldown: 0.075, hitCooldown: 0.09 },
    error_mark: { voice: "error_glitch", triggers: { circle: "impact", state: "fade" }, cooldown: 0.11 },
    error_field: { voice: "error_field", triggers: { zone: "residual", circle: "release" }, cooldown: 0.24 },
    error_burst: { voice: "system_crash", triggers: { circle: "release", hit: "impact" }, cooldown: 0.16, hitCooldown: 0.12 },
    correction_execute: { voice: "correction_execute", triggers: { circle: "release", hit: "impact" }, cooldown: 0.18, hitCooldown: 0.13 }
  };

  const SOURCE_AUDIO_OVERRIDES = {
    marker_p0_expire: { voice: "marker_expire", triggers: { state: "fade" }, cooldown: 0.18 },
    sticky_seeking_bounce: { triggers: { zone: "release" } },
    secondary_sticky_seeking: { triggers: { zone: "release" } },
    secondary_marker_grid: { triggers: { zone: "residual" } }
  };

  const AUDIO_EVENTS = {};
  Object.keys(V2.weaponVisualEvents || {}).forEach(function (source) {
    const visual = V2.weaponVisualEvents[source];
    const base = TOPOLOGY_AUDIO_RULES[visual.topology];
    if (!base) throw new Error("Missing audio topology rule for " + source + " (" + visual.topology + ")");
    const override = SOURCE_AUDIO_OVERRIDES[source] || {};
    const roleMix = ROLE_MIX[visual.role] == null ? 1 : ROLE_MIX[visual.role];
    AUDIO_EVENTS[source] = {
      source,
      family: visual.family,
      role: visual.role,
      phase: visual.phase,
      topology: visual.topology,
      cue: visual.cue,
      voice: override.voice || base.voice,
      triggers: Object.assign({}, override.triggers || base.triggers),
      cooldown: override.cooldown == null ? base.cooldown : override.cooldown,
      hitCooldown: override.hitCooldown == null ? (base.hitCooldown || base.cooldown) : override.hitCooldown,
      priority: visual.priority,
      mix: roleMix,
      timeline: visual.timeline.slice()
    };
  });

  let context = null;
  let masterGain = null;
  let musicGain = null;
  let noiseBuffer = null;
  let unlocked = false;
  let activeVoices = 0;
  let activeMusicVoices = 0;
  let desiredMusicKey = "weapon_intro:normal";
  let activeMusicKey = null;
  let musicMode = "menu";
  let musicStep = 0;
  let musicNextAt = 0;
  let musicTimer = 0;
  let musicBeatCount = 0;
  const lastPlayed = {};
  const history = [];
  let muted = false;

  try {
    muted = window.localStorage && window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch (err) {
    muted = false;
  }

  function audioCtor() {
    return window.AudioContext || window.webkitAudioContext || null;
  }

  function nowSeconds() {
    if (context) return context.currentTime;
    if (window.performance && typeof window.performance.now === "function") return window.performance.now() / 1000;
    return Date.now() / 1000;
  }

  function ensureContext() {
    if (context) return true;
    const Ctor = audioCtor();
    if (!Ctor) return false;
    context = new Ctor();
    masterGain = context.createGain();
    masterGain.gain.value = muted ? 0 : 0.28;
    masterGain.connect(context.destination);
    musicGain = context.createGain();
    musicGain.gain.value = musicMode === "combat" ? 0.34 : musicMode === "paused" ? 0.08 : 0.16;
    musicGain.connect(masterGain);
    return true;
  }

  function buildNoiseBuffer() {
    if (!context || noiseBuffer) return noiseBuffer;
    const length = Math.max(1, Math.floor(context.sampleRate * 0.35));
    noiseBuffer = context.createBuffer(1, length, context.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let index = 0; index < length; index++) data[index] = Math.random() * 2 - 1;
    return noiseBuffer;
  }

  function voiceStarted(node) {
    activeVoices += 1;
    node.onended = function () { activeVoices = Math.max(0, activeVoices - 1); };
  }

  function playOscillator(preset, at, gainScale, pitchScale, ratio) {
    if (!context || !masterGain || activeVoices >= MAX_ACTIVE_VOICES) return false;
    const osc = context.createOscillator();
    const gain = context.createGain();
    const duration = preset.duration;
    const start = Math.max(30, preset.start * pitchScale * (ratio || 1));
    const end = Math.max(30, preset.end * pitchScale * (ratio || 1));
    osc.type = preset.wave || "sine";
    osc.frequency.setValueAtTime(start, at);
    osc.frequency.exponentialRampToValueAtTime(end, at + duration);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, preset.gain * gainScale), at + Math.min(0.018, duration * 0.22));
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    osc.connect(gain);
    gain.connect(masterGain);
    voiceStarted(osc);
    osc.start(at);
    osc.stop(at + duration + 0.015);
    return true;
  }

  function playNoise(preset, at, gainScale) {
    if (!preset.noise || !context || !masterGain || activeVoices >= MAX_ACTIVE_VOICES) return false;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buildNoiseBuffer();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(preset.filter || 2200, at);
    filter.Q.setValueAtTime(0.8, at);
    gain.gain.setValueAtTime(Math.max(0.0002, preset.noise * gainScale), at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + preset.duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    voiceStarted(source);
    source.start(at);
    source.stop(at + preset.duration + 0.01);
    return true;
  }

  function hashPitch(source, type) {
    const text = String(source || "") + ":" + String(type || "");
    let hash = 0;
    for (let index = 0; index < text.length; index++) hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
    return 0.96 + (hash % 9) * 0.01;
  }

  function playProfile(profile, stage, event) {
    const preset = SYNTH_PRESETS[profile.voice];
    if (!preset || !context || !masterGain) return false;
    const at = context.currentTime + 0.006;
    const stageMix = STAGE_MIX[stage] == null ? 0.8 : STAGE_MIX[stage];
    const eventMix = event.type === "hit" ? 0.58 : 1;
    const gainScale = profile.mix * stageMix * eventMix;
    const pitchScale = hashPitch(profile.source, event.type) * (stage === "impact" ? 1.06 : stage === "fade" ? 0.82 : 1);
    let played = playOscillator(preset, at, gainScale, pitchScale, 1);
    if (preset.dual) played = playOscillator(preset, at + 0.012, gainScale * 0.55, pitchScale, preset.dual) || played;
    played = playNoise(preset, at, gainScale) || played;
    return played;
  }

  function midiFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  function musicVoiceStarted(node) {
    activeMusicVoices += 1;
    node.onended = function () { activeMusicVoices = Math.max(0, activeMusicVoices - 1); };
  }

  function playMusicTone(scene, note, at, duration, gainScale, wave) {
    if (!context || !musicGain || activeMusicVoices >= MAX_MUSIC_VOICES) return false;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = wave || scene.wave || "triangle";
    osc.frequency.setValueAtTime(midiFrequency(note), at);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, 0.055 * gainScale), at + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    osc.connect(gain);
    gain.connect(musicGain);
    musicVoiceStarted(osc);
    osc.start(at);
    osc.stop(at + duration + 0.02);
    return true;
  }

  function playMusicTick(scene, at, strong) {
    if (!context || !musicGain || activeMusicVoices >= MAX_MUSIC_VOICES) return false;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buildNoiseBuffer();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(strong ? 920 : 1450, at);
    filter.Q.setValueAtTime(strong ? 1.1 : 1.8, at);
    gain.gain.setValueAtTime(strong ? 0.028 : 0.014, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + (strong ? 0.085 : 0.045));
    source.connect(filter);
    filter.connect(gain);
    gain.connect(musicGain);
    musicVoiceStarted(source);
    source.start(at);
    source.stop(at + 0.1);
    return true;
  }

  function scheduleMusicBeat() {
    if (!context || !unlocked || context.state !== "running" || muted) return;
    const scene = MUSIC_SCENES[desiredMusicKey];
    if (!scene) return;
    if (activeMusicKey !== desiredMusicKey) {
      activeMusicKey = desiredMusicKey;
      musicStep = 0;
      musicNextAt = context.currentTime + 0.04;
    }
    const stepDuration = 60 / scene.bpm / 2;
    if (!musicNextAt || musicNextAt < context.currentTime - stepDuration) musicNextAt = context.currentTime + 0.04;
    while (musicNextAt < context.currentTime + 0.22) {
      const patternNote = scene.pattern[musicStep % scene.pattern.length];
      const strong = musicStep % scene.pulse === 0;
      if (patternNote != null) playMusicTone(scene, scene.root + patternNote, musicNextAt, stepDuration * 0.78, scene.variant === "boss" ? 1 : 0.74);
      if (strong || scene.variant === "boss") playMusicTick(scene, musicNextAt, strong);
      if (musicStep % 8 === 0) playMusicTone(scene, scene.root - 12, musicNextAt, stepDuration * 3.2, 0.42, "sine");
      musicBeatCount += 1;
      musicStep += 1;
      musicNextAt += stepDuration;
    }
  }

  function startMusicScheduler() {
    if (musicTimer) return;
    musicTimer = window.setInterval(scheduleMusicBeat, 50);
    scheduleMusicBeat();
  }

  function musicKeyForState(state) {
    const stage = state && state.stage;
    const phase = stage && MUSIC_SCENES[(stage.phaseKey || "weapon_intro") + ":normal"] ? stage.phaseKey : "weapon_intro";
    return phase + ":" + (stage && stage.boss ? "boss" : "normal");
  }

  function syncMusic(state) {
    const nextKey = musicKeyForState(state);
    const nextMode = state && state.mode || "menu";
    if (desiredMusicKey !== nextKey) {
      desiredMusicKey = nextKey;
      activeMusicKey = null;
    }
    musicMode = nextMode;
    if (musicGain && context) {
      const level = nextMode === "combat" ? 0.34 : nextMode === "paused" ? 0.08 : 0.16;
      musicGain.gain.setTargetAtTime(level, context.currentTime, 0.08);
    }
    return MUSIC_SCENES[desiredMusicKey];
  }

  function recordAudit(state, item) {
    history.push(item);
    if (history.length > 180) history.splice(0, history.length - 180);
    if (!state || !state.stats) return;
    if (!state.stats.audioEvents) state.stats.audioEvents = [];
    state.stats.audioEvents.push(item);
    if (state.stats.audioEvents.length > 180) state.stats.audioEvents.splice(0, state.stats.audioEvents.length - 180);
  }

  function handleWeaponEvent(event, state) {
    const profile = AUDIO_EVENTS[event && event.source];
    if (!profile) return false;
    const stage = profile.triggers[event.type];
    if (!stage) return false;
    const now = nowSeconds();
    const cooldown = event.type === "hit" ? profile.hitCooldown : profile.cooldown;
    const key = profile.source + ":" + stage;
    let reason = "played";
    let played = false;
    if (lastPlayed[key] != null && now - lastPlayed[key] < cooldown) {
      reason = "cooldown";
    } else {
      lastPlayed[key] = now;
      if (muted) reason = "muted";
      else if (!audioCtor()) reason = "unavailable";
      else if (!unlocked || !context || context.state !== "running") reason = "locked";
      else if (activeVoices >= MAX_ACTIVE_VOICES) reason = "voice_budget";
      else {
        played = playProfile(profile, stage, event);
        if (!played) reason = "voice_budget";
      }
    }
    recordAudit(state, {
      source: profile.source,
      family: profile.family,
      role: profile.role,
      voice: profile.voice,
      stage,
      eventType: event.type,
      played,
      reason
    });
    return played;
  }

  function unlock() {
    if (!ensureContext()) return Promise.resolve(false);
    const resume = context.state === "suspended" && context.resume ? context.resume() : Promise.resolve();
    return Promise.resolve(resume).then(function () {
      unlocked = context.state === "running";
      if (unlocked) startMusicScheduler();
      return unlocked;
    }).catch(function () {
      unlocked = false;
      return false;
    });
  }

  function setMuted(value) {
    muted = !!value;
    try {
      if (window.localStorage) window.localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
    } catch (err) {}
    if (masterGain && context) masterGain.gain.setTargetAtTime(muted ? 0 : 0.28, context.currentTime, 0.015);
    return muted;
  }

  function toggleMuted() {
    return setMuted(!muted);
  }

  function getStatus() {
    return {
      available: !!audioCtor(),
      unlocked,
      muted,
      contextState: context ? context.state : "not-created",
      activeVoices,
      activeMusicVoices,
      mappedSources: Object.keys(AUDIO_EVENTS).length,
      auditEvents: history.length,
      playedEvents: history.filter(function (event) { return event.played; }).length,
      musicScene: desiredMusicKey,
      musicLabel: MUSIC_SCENES[desiredMusicKey] && MUSIC_SCENES[desiredMusicKey].label,
      musicVariant: MUSIC_SCENES[desiredMusicKey] && MUSIC_SCENES[desiredMusicKey].variant,
      musicBpm: MUSIC_SCENES[desiredMusicKey] && MUSIC_SCENES[desiredMusicKey].bpm,
      musicMode,
      musicBeatCount
    };
  }

  function installUnlockHandlers() {
    if (!document || !document.addEventListener) return;
    const attempt = function () { if (!unlocked && !muted) unlock(); };
    document.addEventListener("pointerdown", attempt, { passive: true });
    document.addEventListener("keydown", attempt, { passive: true });
  }

  V2.weaponAudioEvents = AUDIO_EVENTS;
  V2.musicScenes = MUSIC_SCENES;
  V2.getWeaponAudioEvent = function getWeaponAudioEvent(source) { return AUDIO_EVENTS[source] || null; };
  V2.audio = {
    unlock,
    handleWeaponEvent,
    setMuted,
    toggleMuted,
    syncMusic,
    getMusicScene: function (key) { return MUSIC_SCENES[key] || null; },
    isMuted: function () { return muted; },
    getStatus,
    getHistory: function () { return history.slice(); }
  };

  installUnlockHandlers();
})();
