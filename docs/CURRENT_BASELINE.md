# Cubicle Survivor Demo V1 Current Baseline

Last verified: 2026-07-20

This file is the first source to read before any project audit, plan, implementation, or playtest. Its purpose is to prevent the historical web prototype, early Demo V1 snapshots, and the active Demo V1 worktree from being confused again.

## Official naming

- **Demo V1**: the current product version. It means this active worktree and the `Cubicle-Survivor-demo/` runnable package.
- **Demo V2**: the approved production target documented in `docs/DEMO_V2_PRODUCTION_BRIEF.md`. Phase A/B and Demo V2.1—V2.5 keep separate regression entries; Demo V2.6 adds one four-weapon fixed-framework comparison entry, and Demo V2.7 is its player-experience repair pass. None has replaced the active Demo V1 package.
- **Demo V1 early snapshot**: the earlier `Documents\Cubicle-Survivor-v2` clone at `91d32fb`.
- **Historical web prototype**: the old static `Documents\New project 2` export and archived legacy content.
- Avoid bare `V1` and `V2` in future user-facing work. Internal paths such as `src/v2/` may remain until a deliberate refactor, but they do not change the product name Demo V1.

Until a deliberate runtime cutover is completed, always distinguish **current full Demo V1** from the **isolated Demo V2 validation entry**. Do not relabel the existing 16-stage package merely because the Demo V2 production brief or Phase A entry exists.

## Approved next product direction: Demo V2

The user approved a scoped Demo V2 experience rebuild on 2026-07-14. Its authoritative production brief is `docs/DEMO_V2_PRODUCTION_BRIEF.md`.

The direction is locked to:

- the same three main weapons: Marker, Thermos and Sticky Note;
- two badge forms per weapon, implemented behind explicit gates rather than restoring all 15 forms at once;
- six repeatable office-module families replacing generic XP/card-slot growth in the Demo V2 runtime;
- an 8–10 minute continuous escalation structure with an early badge, a mid-run promotion, one late cross-weapon support choice and a protected domination window;
- an encounter director built from fodder, queues, clusters, pursuers, anchors, ranged pressure, splitters and shield checks;
- three production gates: a 60-second weapon/enemy test, a 3-minute Build-dialogue test and only then the complete six-form run.

This planning change does not authorize deleting or overwriting the current Demo V1 runtime. Reuse the current combat, visual-event and audio-event contracts where they serve the new brief, and keep Demo V1 runnable until Demo V2 passes its replacement gate.

Implementation status on 2026-07-14:

- Phase A is implemented behind `demo-v2.html` as a 60-second three-weapon test.
- It contains four encounter grammars: queue, cluster, pursuit and mixed review.
- Marker and Sticky Note passed the Phase A feel gate. Thermos now uses a short, wide slowing damage-over-time steam fan instead of a Marker-like piercing beam.
- Phase B is implemented behind `demo-v2-b.html` as a three-minute Build-dialogue test.
- Phase B is locked to Marker × Tech, Thermos × Product and Sticky Note × General; identity applies at 30 seconds and module choices occur at 55, 100 and 145 seconds.
- Its six module families are Copy, Archive, Forward, Expedite, Merge and Overdraft. They mutate each weapon through its own motif and can form Copy × Forward, Archive × Merge, or Expedite × Overdraft relationships.
- Phase B now enforces a module-branch gate across all 18 weapon-module mappings: Lv1 must create an independently traceable combat branch, while Lv3 must visibly increase its count, generation, coverage or trigger frequency. Thermos and Sticky Note no longer pass by changing only cooldown, range or duration.
- Demo V1 slots, armory, materials, secondary departments and support weapons remain deliberately absent from the Phase B runtime.
- Phase C remains gated by the production brief; Phase B being runnable is not a replacement-gate pass and still requires player feel validation.
- A separate Marker-only fixed-type experiment is approved in `docs/DEMO_V2_MARKER_FIXED_TEST.md`. It tests four Copy/Archive choices against a three-slot white-to-red component shop and must remain isolated from Phase A, Phase B, the full Demo V1 and the other two weapons.
- Demo V2.5 adds the isolated Correction Fluid error-state test documented in `docs/DEMO_V2_CORRECTION_FLUID_FIXED_TEST.md`.
- Demo V2.6 adds `demo-v2-6.html`, a unified selection entry for Marker, Thermos, Scissors and Correction Fluid. It routes each choice to the existing isolated fixed configuration and adds only shared version identity plus event-driven cyber-neon highlights.
- Demo V2.7 adds `demo-v2-7.html` as the current recommended four-weapon playable entry. It repairs the real stage path, advances the first module choice to encounter 1, separates Boss health from normal-add health, and completes the Scissors dash/readability and fixed-suite UI pass documented in `docs/DEMO_V2_7_PLAYABLE_EXPERIENCE_FIX.md`.
- Demo V2.8 and Demo V2.9 remain preserved regression snapshots for combat tempo and horizontal consistency.
- Demo V3.0 adds `demo-v3-0.html` as the current recommended four-weapon experience entry. It is a scoped combat-perception pass over Demo V2.9: no new item or enemy system, but complete hit/lock/defeat feedback, readable Correction Fluid states, short growth confirmations, Scissors risk correction, and a Japanese neon-city information layer across all player-visible screens. See `docs/DEMO_V3_0_COMBAT_PERCEPTION_PASS.md`.
- Demo V3.1 adds `demo-v3-1.html` as the current recommended four-weapon entry. It redistributes weapon output into smaller, faster events; raises fixed-encounter enemy floors, batches and quotas; projects the Scissors dash intent beyond the held weapon; and separates Thermos Kill Heatwave from Condensation through a hot core, expanding amber front and pressure echo. See `docs/DEMO_V3_1_COMBAT_DENSITY_PASS.md`.
- Demo V3.2 adds `demo-v3-2.html` as the current recommended four-weapon entry. It deepens the same three-part combat budget—smaller strikes, shorter attack gaps and a higher effective-target floor—while adding low-opacity outer bloom plus a sharp inner core to real weapon events. V3.1 remains preserved. See `docs/DEMO_V3_2_COMBAT_TRIANGLE_NEON_PASS.md`.
- Demo V3.3 adds `demo-v3-3.html` as the current recommended four-weapon entry. It preserves V3.2 and only repairs Correction Fluid's opening: slightly stronger/faster primary spray plus one weak nearby overspray until Fatal Correction supplies true independent multi-target locks. See `docs/DEMO_V3_3_CORRECTION_OPENING_PASS.md`.
- Demo V3.4 adds `demo-v3-4.html` as the current recommended four-weapon entry. It preserves V3.3 weapon growth while moving the run start to the world centre, randomizing wave entry across the full view perimeter, and adding telegraphed Boss lane and safe-gap barrage attacks. See `docs/DEMO_V3_4_ENCOUNTER_SPACE_PASS.md`.
- Demo V3.5 adds `demo-v3-5.html` as the current recommended four-weapon entry. It distributes each fixed enemy quota across the full encounter, accelerates enemy approach and active attacks, restores ordinary Boss intent between special patterns, raises Boss durability and cadence, and makes component attributes visibly enlarge real attack shapes. It also separates Marker laser/ink color hierarchy and attaches the ordinary Scissors model to the leading edge of Closed-Blade attacks. See `docs/DEMO_V3_5_SUSTAINED_PRESSURE_PASS.md`.

## Authoritative development location

- Worktree: `C:\Users\Administrator\.qclaw\workspace\cubicle-foundation-test`
- Git branch: `codex/demo-v2-6-four-weapon-neon`
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
- New systems and additional weapons remain out of scope for the default Demo V1 and the 8—10 minute full Demo V2 mainline. The explicitly approved Scissors, Correction Fluid and Demo V2.6 fixed-framework entries are controlled comparison exceptions, not an automatic mainline expansion.
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
2. `docs/DEMO_V2_PRODUCTION_BRIEF.md` for any Demo V2 planning or implementation decision.
3. Active Demo V1 working tree under `cubicle-foundation-test`, including uncommitted changes, as the reusable runnable baseline.
4. `docs/v2-core-review-principles.md` and `docs/v2-framework/` where they do not conflict with the Demo V2 brief.
5. Git history on `codex/weapon-mechanics-contracts`.
6. Demo V1 early snapshot at `Documents\Cubicle-Survivor-v2`.
7. Historical archives and `New project 2` only for historical comparison.

## Mandatory startup checklist

Before work:

1. Confirm the current directory is the authoritative Demo V1 worktree.
2. Read this file and `docs/v2-core-review-principles.md`.
3. Read `docs/DEMO_V2_PRODUCTION_BRIEF.md` before any Demo V2 planning or implementation.
4. Read `docs/DEMO_V1_MECHANIC_AUDIT.md` before judging or changing any of the three priority weapons.
5. Run `git status --short --branch`.
6. Inspect `Cubicle-Survivor-demo/README.md` and `package.json`.
7. Preserve existing uncommitted changes.
8. State explicitly whether a requested change belongs to the historical web prototype, the Demo V1 early snapshot, the current runnable Demo V1, or the planned Demo V2.

Asset guardrail (verified 2026-07-10): never reactivate `Cubicle-Survivor-demo/assets/v2-ui/flat-*.png`. Those nine crops are fully opaque and contain baked checkerboard backgrounds. Read `assets/v2-ui/manifest.md`; the current CSS office-neon surfaces are the approved Demo V1 runtime UI until clean transparent replacements pass browser QA.

Weapon-VFX guardrail (verified 2026-07-13): files listed under “Legacy Crop Pass” in `Cubicle-Survivor-demo/assets/v2-weapon-vfx/manifest.md` are reference-only and must not be loaded at runtime. The approved entity-sprite whitelist is `thermos_drone_v2.png`, `thermos_station_v2.png`, and `sticky_note_v2.png`; attack lines, wavefronts, blast radii, station ranges, routes, links and polygons use the generated office VFX sprites under `assets/generated-vfx/sprites/`, with their position, rotation and scale driven by the same runtime objects used for combat judgment. Visible Canvas geometry primitives are forbidden in the active renderer.

Visual-event guardrail (verified 2026-07-16): `src/v2/data/form-signatures.js` is the only event-to-visual contract. Every registered source must expose family, phase, topology, cue, role, palette and a timeline built from anticipation/release/impact/residual/fade. Do not add an effect directly in the renderer without registering its event source, and do not let secondary or support visuals use primary intensity. Read `docs/DEMO_V1_VISUAL_EVENT_MAP.md` before changing weapon feedback or beginning audio-event mapping.

Visual safe-area guardrail (verified 2026-07-13): menu text must be measured against the inner content edge of the raster frame, not merely against the outer panel rectangle. The weapon chooser and armory title stacks were re-inset after browser measurement; their card trays and footers must not be moved upward to make room. Combat HUD dimensions remain governed by the separate combat display-space hard contract. `office-rogue-props.png` and production-source atlases are archived outside the runnable package and QA must reject their return. See `docs/DEMO_V1_VISUAL_SAFE_AREA_ADDENDUM.md`.

Office-icon guardrail (verified 2026-07-14): department and Build-slot duties use only `assets/generated-ui-v2/office-department-slot-icons-v2.png`. The retired `office-rogue-ui-icons.png` generic RPG/sci-fi atlas and keyed production intermediate are archived outside the runnable package. Preserve the atlas 5×2, 2:1 source ratio, keep slot descriptions result-led and fully visible, and do not reintroduce horizontal menu scrolling. These menu changes must not increase any combat HUD dimension or reduce the verified 542px uninterrupted combat field.

Audio-event guardrail (verified 2026-07-16): `src/v2/audio/audio.js` consumes the same registered visual-event source set and is the only weapon-SFX playback entry. Every source must retain family, role, voice, trigger stage, cooldown and mix metadata. Do not play weapon audio directly from combat functions, bypass browser unlock/mute handling, or let secondary/support roles use primary mix. Read `docs/DEMO_V1_AUDIO_EVENT_MAP.md` before replacing synth voices or adding audio assets.

Demo V2.1 Marker guardrail (verified 2026-07-16): `Cubicle-Survivor-demo/demo-v2-marker.html` is the isolated five-phase, 17-encounter Demo V2.1 candidate for the Marker only. Every encounter has a fixed normal-enemy spawn cap and ends in a 10-second pickup window; normal encounters finish on timer expiry or quota clearance, while Boss encounters require Boss death plus either timer expiry or add clearance. Marker starts at 120 HP, its instant lines do not knock enemies back, and Archive is a wider low-damage slowing ink band. XP queues player-assigned universal stat points after the pickup window. Component slots now sell their two concrete stat variants directly: variants are mutually exclusive per slot, identical purchases alone progress 1/2/4/8 quality, and buying the opposite variant replaces and resets that slot. Read `docs/DEMO_V2_MARKER_FIXED_TEST.md` before changing this route; do not spread its economy or 17-encounter structure to Phase A, Phase B, the full Demo V1 or the other two weapons.

Demo V2.2 Thermos guardrail (verified 2026-07-16): `Cubicle-Survivor-demo/demo-v2-thermos.html` is a separate Thermos-only fixed test that deliberately reuses the Demo V2.1 17-encounter progression and component economy. Its base attack is a short, wide, forward-only steam fan; Amount adds shared-cooldown forward spray groups, and overlapping groups cannot repeat the base hit or fixed knockback on one enemy in the same round. Condensation creates 1–3 sequential no-knockback persistent zones and a temporary fullscreen Lv4. Kill Heatwave creates 1–3 retargeting focused hits; only a real focus kill emits one non-chaining heatwave, while its Lv4 ignites key targets instead of dealing generic fullscreen AOE. Read `docs/DEMO_V2_THERMOS_FIXED_TEST.md` before changing this route. This controlled reuse does not authorize the same structure for Sticky Note or the complete Demo V2 runtime.

Demo V2.3 Scissors guardrail (verified 2026-07-16): `Cubicle-Survivor-demo/demo-v2-scissors.html` is a separate Scissors-only fixed test and an explicit fourth-weapon exception requested by the user. It reuses the fixed 17-encounter economy only to test the first pure melee weapon: a non-overlapping attack timeline, predictable no-damage Light-Step dash, Closed-Blade thrust and Open-Blade combo routes (player-facing names 合刃/张刃), hit-count execution, melee-capped range, Dodge/Move Speed components, and one fixed low-HP projectile shelter item. Read `docs/DEMO_V2_SCISSORS_FIXED_TEST.md` before changing it. Scissors is not added to Phase A, Phase B, Demo V1, the full Demo V2 runtime or cross-weapon pools, and the shelter does not authorize a random item shop.

Demo V2.4 combat-visual guardrail (verified 2026-07-16): `docs/DEMO_V2_4_COMBAT_VISUAL_PASS.md` is a visual-only pass for the isolated Demo V2.2 Thermos and Demo V2.3 Scissors entries. New `v24` sprite strips must derive frame, position, rotation and scale from the existing event objects used by combat judgment. Do not change weapon balance, add event sources, overwrite the old assets, expand Scissors into other runtimes, or draw visible Canvas geometry.

Demo V2.5 Correction Fluid guardrail (verified 2026-07-16): `Cubicle-Survivor-demo/demo-v2-correction-fluid.html` is an isolated fourth-relation test. Error stacks are capped at three; the second-stack vulnerability applies only to correction-fluid-family damage; Error Spread owns infection fields and System Crash; Fatal Correction owns multi-target cultivation and Final Correction. Components remain attribute-only and mutually exclusive. Read `docs/DEMO_V2_CORRECTION_FLUID_FIXED_TEST.md` before changing it.

Demo V2.6 four-weapon neon guardrail (verified 2026-07-16): `Cubicle-Survivor-demo/demo-v2-6.html` owns only unified weapon selection, suite identity and low-intensity event-driven neon accents. Every choice must still route into its isolated fixed configuration. The dark office is a background substrate, not a requirement that every attack look like normal desk stationery. Shared neon uses transparent sprites driven by real `*_test_*` events; no fake hit areas, visible Canvas geometry, global recolor or mechanism merge is allowed. Read `docs/DEMO_V2_6_FOUR_WEAPON_NEON_TEST.md` before changing the suite.

Demo V2.7 playable-experience guardrail (verified 2026-07-16): `Cubicle-Survivor-demo/demo-v2-7.html` is the recommended four-weapon entry. The fixed 17-encounter schedule has five module decisions after encounters 1, 3, 6, 9 and 12; each route still caps at Lv4, so the fifth decision may invest in the other route. Normal encounters finish on timer expiry or quota clearance. Boss encounters require Boss death plus timer expiry or add clearance, and normal adds must use `normalEnemyHp` rather than inheriting Boss HP. Scissors Light-Step is an 82 px, 0.18-second movement that only triggers while the player is moving; its charge bar and facing indicator must remain synchronized and its shelter must not cover the character. Read `docs/DEMO_V2_7_PLAYABLE_EXPERIENCE_FIX.md` before changing this entry.

Music-and-pacing guardrail (verified 2026-07-13): the audio module defines exactly ten phase scenes—normal and boss arrangements for each of the five learning phases—and all use the shared unlock/mute bus. Normal stages target 30–65 seconds and 20–80 kills. Boss completion must depend on the boss death flag rather than total kills; limited adds preserve multi-target Build expression, while per-hit caps prevent one burst from skipping the review. Read `docs/DEMO_V1_PACING_PASS.md` before changing stage duration, spawn pressure, boss health or burst resilience.

After work:

1. Run `npm run qa` inside `Cubicle-Survivor-demo/` when code changed.
2. Perform player-facing visual verification for combat or UI changes.
3. Update this file if the authoritative branch, path, runnable package, or product direction changed.

Demo V2.8 combat-tempo guardrail (verified 2026-07-16): `Cubicle-Survivor-demo/demo-v2-8.html` supersedes Demo V2.7 as the recommended four-weapon entry; Demo V2.7 remains the previous playable snapshot. Stage 10 normal HP is 30 and must pass a starter-Correction-Fluid nonzero-kill regression. Fixed-suite weapon damage rises while enemy outgoing damage rises modestly, but late normal HP and Boss HP are reduced so impact comes from faster exchanges rather than longer health bars. Error Spread begins near a 90 px radius, grows in small linear steps, has lower auxiliary damage, caps merged radius at 1.55 times its route radius, and overloaded Bosses periodically leak a real error area. Scissors attacks use the held `scissors-v23` body plus `scissors-slash-v24` arcs, with a 7.2-second passive Light-Step charge and modest per-round charge. Fixed-suite Bosses guarantee healing packs, normal and elite enemies have smaller healing chances, and `RESTART` returns a four-weapon run to the coordinator. Read `docs/DEMO_V2_8_COMBAT_TEMPO_FIX.md` before changing this entry.

Demo V2.9 horizontal-consistency guardrail (verified 2026-07-16): `Cubicle-Survivor-demo/demo-v2-9.html` supersedes Demo V2.8 as the recommended four-weapon entry; Demo V2.8 remains the previous combat-tempo snapshot. Each encounter owns one roster consumed by preview, live hint and every spawn grammar. Universal XP increments are equivalent across all four weapons, and every component variant must mutate a combat-consumed parameter. Collection closes with a 10% max-HP recovery floor. Marker, Thermos and Scissors cannot let an in-range mandatory Boss become invisible behind adds; Correction Fluid preserves nearest-threat-first acquisition and its overloaded-Boss field leak. The base Thermos fan is short/wide and leaves low-damage slowing polygonal steam residue with shared-round overlap judgment. QA must retain real-damage opening probes, all 68 weapon/encounter transitions, and eight real-timer pure-route progression soaks; the latter disable only enemy outgoing damage and are not balance claims. Read `docs/DEMO_V2_9_HORIZONTAL_CONSISTENCY_AUDIT.md` before changing this entry.

Demo V2 release guardrail (verified 2026-07-16): every public release must follow `docs/DEMO_V2_VALIDATION_RELEASE_WORKFLOW.md`. `Cubicle-Survivor-demo/` is the only editable game source; `Cubicle-Survivor-sites/public/play/` is a generated hosting copy produced by `node scripts/sync-demo-v2-site.mjs` and must never be patched directly. `node scripts/verify-demo-v2-release.mjs` is the automated release gate and must pass before GitHub publication or Sites deployment. Automated progression soaks do not replace the required player-facing browser matrix.
