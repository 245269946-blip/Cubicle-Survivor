# Cubicle Survivor Demo V1 Current Baseline

Last verified: 2026-07-13

This file is the first source to read before any project audit, plan, implementation, or playtest. Its purpose is to prevent the historical web prototype, early Demo V1 snapshots, and the active Demo V1 worktree from being confused again.

## Official naming

- **Demo V1**: the current product version. It means this active worktree and the `Cubicle-Survivor-demo/` runnable package.
- **Demo V1 early snapshot**: the earlier `Documents\Cubicle-Survivor-v2` clone at `91d32fb`.
- **Historical web prototype**: the old static `Documents\New project 2` export and archived legacy content.
- Avoid bare `V1` and `V2` in future user-facing work. Internal paths such as `src/v2/` may remain until a deliberate refactor, but they do not change the product name Demo V1.

## Authoritative development location

- Worktree: `C:\Users\Administrator\.qclaw\workspace\cubicle-foundation-test`
- Git branch: `codex/weapon-mechanics-contracts`
- Remote: `https://github.com/245269946-blip/Cubicle-Survivor.git`
- Latest committed baseline at verification time: `c7dd046` (`Make weapon build signatures visible`)
- Active runnable package: `Cubicle-Survivor-demo/`
- Run QA from the active package with `npm run qa`.

The working tree contains newer, intentional Demo V1 UI and combat-feedback work on top of `c7dd046`. The working tree is therefore newer than the last commit and must be preserved. Always inspect `git status --short --branch` before making changes.

## Version map

### Historical web prototype — do not use as the default

Path: `C:\Users\Administrator\Documents\New project 2`

Identity:

- Static `index.html` / `main.js` / `styles.css` export.
- Script marker includes `phase2-balance`.
- Old design paradigm: ten weapons, stat/item growth, four paired weapon routes, route tiers, permanent upgrades and endless mode.
- Useful only for historical comparison or explicitly requested maintenance of the historical prototype.

### Demo V1 early snapshot — reference only

Path: `C:\Users\Administrator\Documents\Cubicle-Survivor-v2`

Identity:

- Branch `codex/v2-weapon-vfx-playable`.
- Stops at commit `91d32fb` (`Add V2 weapon build playable slice`).
- Contains the first playable Demo V1 weapon slice but not the latest mechanic-contract and UI-feedback work.

### Active Demo V1 worktree — source of truth

Path: `C:\Users\Administrator\.qclaw\workspace\cubicle-foundation-test`

Identity:

- Branch `codex/weapon-mechanics-contracts`.
- Includes foundation stability, weapon mechanic contracts, visible Build signatures, and newer uncommitted UI/feedback work.
- The playable package is `Cubicle-Survivor-demo/`, not the V1 export.

## Active Demo V1 product structure

The Demo V1 progression spine is:

1. Select one initial weapon.
2. Select a badge/department form that changes how that same weapon fights.
3. Reinforce it through slots and supporting growth.
4. Complete promotion and strengthen the primary form.
5. Add a second department's lower-level form through cross-department progression.
6. Learn a support mechanic from another weapon without replacing the main weapon.
7. Validate the completed Build in the final review.

The five learning stages are:

1. Initial weapon comprehension.
2. Badge form definition.
3. Post-promotion primary-form reinforcement.
4. Second-department form overlay.
5. Cross-weapon learning as a supporting mechanic.

## Current vertical slice

The three priority weapons are:

- Marker: draw lines, pierce, split.
- Thermos: accumulate heat, reach boiling point, release.
- Sticky Note: place points, build a formation, connect an area.

Do not replace this trio with Coffee, Headset, Calculator, or another V1 paired-route recommendation unless the user explicitly changes the vertical-slice scope.

Weapon identity must remain stronger than department bonuses. Department forms extend each weapon's core verb; they do not turn it into a different weapon.

## Current optimization direction

The planned public distribution target is TapTap. Steam-specific packaging, Steamworks integration and Steam review work are not part of the current plan. The immediate focus is to make the three-weapon vertical slice legible and satisfying from the player's perspective:

- Combat changes must be visible within 10 seconds of a Build decision.
- Art assets and VFX must match the implemented attack range and weapon identity.
- Music and SFX must communicate weapon rhythm, state changes, promotion and collaboration.
- Build choices must be understandable in combat, not only in panels or text.
- New systems and additional weapons are out of scope until the three-weapon slice passes player-facing acceptance.
- Read `docs/DEMO_V1_TAPTAP_DIRECTION.md` before proposing release-engineering or platform-specific work.

## Combat display-space hard contract

The combat page must preserve the player and aiming field as the visual center. At the 1280x720 reference viewport:

- Persistent top HUD must end at or above screen y=95; persistent bottom HUD must begin at or below y=637.
- The uninterrupted combat field must retain at least 78% of the combat canvas height. The 2026-07-13 verified baseline is 542/678 px, or 79.9%.
- The stage title belongs inside the top-center objective strip. It must never create a second title row over the battlefield.
- The top-center objective strip is capped at 410x66 px, the bottom mechanic strip at 420x48 px, and the collapsed Build strip at 210x44 px at the reference viewport.
- Temporary prompts must be shallow, short-lived, and offset away from the player. New persistent status rows or center-screen panels are not allowed during active combat.
- Player visibility, enemy approach reading, and movement space take priority over decorative HUD framing and explanatory copy.

## Source-of-truth order

When information conflicts, use this order:

1. Explicit direction in the current user conversation.
2. Active Demo V1 working tree under `cubicle-foundation-test`, including uncommitted changes.
3. `docs/v2-core-review-principles.md` and `docs/v2-framework/`.
4. Git history on `codex/weapon-mechanics-contracts`.
5. Demo V1 early snapshot at `Documents\Cubicle-Survivor-v2`.
6. Historical archives and `New project 2` only for historical comparison.

## Mandatory startup checklist

Before work:

1. Confirm the current directory is the authoritative Demo V1 worktree.
2. Read this file and `docs/v2-core-review-principles.md`.
3. Read `docs/DEMO_V1_MECHANIC_AUDIT.md` before judging or changing any of the three priority weapons.
4. Run `git status --short --branch`.
5. Inspect `Cubicle-Survivor-demo/README.md` and `package.json`.
6. Preserve existing uncommitted changes.
7. State explicitly whether a requested change belongs to the historical web prototype, the Demo V1 early snapshot, or the active Demo V1 worktree.

Asset guardrail (verified 2026-07-10): never reactivate `Cubicle-Survivor-demo/assets/v2-ui/flat-*.png`. Those nine crops are fully opaque and contain baked checkerboard backgrounds. Read `assets/v2-ui/manifest.md`; the current CSS office-neon surfaces are the approved Demo V1 runtime UI until clean transparent replacements pass browser QA.

Weapon-VFX guardrail (verified 2026-07-13): files listed under “Legacy Crop Pass” in `Cubicle-Survivor-demo/assets/v2-weapon-vfx/manifest.md` are reference-only and must not be loaded at runtime. The approved entity-sprite whitelist is `thermos_drone_v2.png`, `thermos_station_v2.png`, and `sticky_note_v2.png`; attack lines, wavefronts, blast radii, station ranges, routes, links and polygons use the generated office VFX sprites under `assets/generated-vfx/sprites/`, with their position, rotation and scale driven by the same runtime objects used for combat judgment. Visible Canvas geometry primitives are forbidden in the active renderer.

Visual-event guardrail (verified 2026-07-13): `src/v2/data/form-signatures.js` is the only event-to-visual contract. Every registered source must expose family, phase, topology, cue, role, palette and a timeline built from anticipation/release/impact/residual/fade. Do not add an effect directly in the renderer without registering its event source, and do not let secondary or support visuals use primary intensity. Read `docs/DEMO_V1_VISUAL_EVENT_MAP.md` before changing weapon feedback or beginning audio-event mapping.

Visual safe-area guardrail (verified 2026-07-13): menu text must be measured against the inner content edge of the raster frame, not merely against the outer panel rectangle. The weapon chooser and armory title stacks were re-inset after browser measurement; their card trays and footers must not be moved upward to make room. Combat HUD dimensions remain governed by the separate combat display-space hard contract. `office-rogue-props.png` and production-source atlases are archived outside the runnable package and QA must reject their return. See `docs/DEMO_V1_VISUAL_SAFE_AREA_ADDENDUM.md`.

Office-icon guardrail (verified 2026-07-14): department and Build-slot duties use only `assets/generated-ui-v2/office-department-slot-icons-v2.png`. The retired `office-rogue-ui-icons.png` generic RPG/sci-fi atlas and keyed production intermediate are archived outside the runnable package. Preserve the atlas 5×2, 2:1 source ratio, keep slot descriptions result-led and fully visible, and do not reintroduce horizontal menu scrolling. These menu changes must not increase any combat HUD dimension or reduce the verified 542px uninterrupted combat field.

Audio-event guardrail (verified 2026-07-13): `src/v2/audio/audio.js` consumes the same 71 registered event sources and is the only weapon-SFX playback entry. Every source must retain family, role, voice, trigger stage, cooldown and mix metadata. Do not play weapon audio directly from combat functions, bypass browser unlock/mute handling, or let secondary/support roles use primary mix. Read `docs/DEMO_V1_AUDIO_EVENT_MAP.md` before replacing synth voices or adding audio assets.

Music-and-pacing guardrail (verified 2026-07-13): the audio module defines exactly ten phase scenes—normal and boss arrangements for each of the five learning phases—and all use the shared unlock/mute bus. Normal stages target 30–65 seconds and 20–80 kills. Boss completion must depend on the boss death flag rather than total kills; limited adds preserve multi-target Build expression, while per-hit caps prevent one burst from skipping the review. Read `docs/DEMO_V1_PACING_PASS.md` before changing stage duration, spawn pressure, boss health or burst resilience.

After work:

1. Run `npm run qa` inside `Cubicle-Survivor-demo/` when code changed.
2. Perform player-facing visual verification for combat or UI changes.
3. Update this file if the authoritative branch, path, runnable package, or product direction changed.
