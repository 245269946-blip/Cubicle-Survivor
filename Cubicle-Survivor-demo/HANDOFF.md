# Handoff: Demo V3.15 Formal Release

The authoritative runnable package is this directory. Demo V3.15 is the public recommendation; Demo V3.14 remains an immutable compact-decision regression snapshot.

## Current state

- `demo-v3-14.html`: compact-decision regression snapshot.
- `demo-v3-15.html`: recommended entry; inherits V3.14 combat, 17 encounters, progression and economy, then enables only gated formal assets.
- Formal asset production is complete: 8 normal enemies, 5 Bosses, 5 office scenes, 3 pickups, compact combat HUD, four weapon-VFX atlases and 21 formal WAV cues.
- Formal audio covers four weapon families, every enemy/Boss action identity, normal/Boss defeat, encounter completion and final completion. It remains on the shared unlock, mute, cooldown, voice-budget and master-mix path.

## Non-negotiable boundaries

- Do not change combat, progression, drops, rewards or economy while tuning formal presentation.
- Choice and purchase surfaces stay concise: name, immediate result, and at most one future/relationship cue.
- Concept art, raw generated strips and files that merely exist in the repository are not production assets. Follow `../docs/visual-qa-checklist.md` and the runtime evidence contracts.
- Keep V3.14 gates off for all `formalCartoon*Pass` features.

## Verify

Run from this directory:

```bash
npm run qa
```

The audio-specific evidence is:

- `assets/cartoon-office-audio/cartoon-office-audio-contract.json`
- `formal-cartoon-audio-runtime-report.json`
- `formal-cartoon-audio-qa.js`
- `../scripts/build-formal-cartoon-audio.py`

## Next safe work

1. Use fresh player sessions to tune weapon loudness, enemy anticipation readability and late-run balance; these are polish checks, not a reason to reopen the formal asset gate without evidence.
2. Keep choice and purchase surfaces result-led and short; never shrink text to preserve explanatory prose.
3. Tune cue mix and cooldown before adding systems to solve an audio-balance problem.
4. Preserve the shared character identity, complete scissors silhouette, real enemy action frames and text-free completion feedback in every follow-up.

Authoritative status and full evidence index: `../docs/CURRENT_BASELINE.md` and `../docs/DEMO_V3_15_CARTOON_ASSET_PRODUCTION.md`.
