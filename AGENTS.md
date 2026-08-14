# Cubicle Survivor Demo V1 Agent Instructions

## Mandatory startup

This worktree is the sole authoritative development baseline for Cubicle Survivor Demo V1.

Before inspecting, planning, testing, or editing the game, read these files in order:

1. `docs/CURRENT_BASELINE.md`
2. `docs/v2-core-review-principles.md`
3. `docs/INDEX.md`

For any Demo V2 planning or implementation, also read `docs/DEMO_V2_PRODUCTION_BRIEF.md` before acting. Demo V2 is the approved next production target, but the existing `Cubicle-Survivor-demo/` package remains the current runnable Demo V1 until the replacement gate is explicitly passed.

Then run `git status --short --branch` and preserve every existing working-tree change.

The active runnable Demo V1 game is `Cubicle-Survivor-demo/`. Do not treat the root compatibility entry files or a legacy export as the active demo without checking `docs/CURRENT_BASELINE.md` first.

## Version boundary

- `C:\Users\Administrator\Documents\New project 2` is the historical web prototype. Never call it Demo V1.
- `C:\Users\Administrator\Documents\Cubicle-Survivor-v2` is an early Demo V1 snapshot that stops at the `codex/v2-weapon-vfx-playable` baseline.
- This worktree, on `codex/weapon-mechanics-contracts`, including its uncommitted working-tree changes, is the current source of truth.
- `versions/v1.0-legacy/`, `v1.0.1/`, and `docs/v1-legacy/` are historical-reference-only unless the user explicitly asks to maintain the historical web prototype.
- Never copy the historical prototype's four paired weapon routes, old item/stat progression, or Phase 2 Balance runtime over Demo V1 systems.

Official terminology for all future work:

- `Demo V1` means this active worktree and its `Cubicle-Survivor-demo/` runnable package.
- `Demo V1 early snapshot` means the earlier `Documents\Cubicle-Survivor-v2` clone.
- `Historical web prototype` means `Documents\New project 2` and archived legacy content.
- Do not use bare `V1` or `V2` in user-facing plans or reports when it could confuse the product version with the architecture generation.

## Product rules

- The active core loop is: initial weapon -> badge/department form -> slot reinforcement -> promotion reinforcement -> second-department form -> cross-weapon learning.
- The Demo V1 vertical-slice weapons are Marker, Thermos, and Sticky Note.
- Weapon identity is primary; departments modify a weapon's core combat verb instead of replacing it.
- Every important Build decision must become visible in combat within the next 10 seconds.
- UI text cannot substitute for missing combat feedback.
- Before changing any player-visible weapon, component or combat VFX, read `docs/WEAPON_VISUAL_DESIGN_STANDARD.md`. Every visible part must declare a physical owner, mount, follow rule and state source; every attack effect must share its origin and geometry with combat judgment.
- Current optimization priority is player-facing combat feel, matching art assets, music/SFX, and readable Build expression. Steam release engineering is intentionally deferred.

## Demo V2 production lock

- Demo V2 keeps only Marker, Thermos and Sticky Note as main weapons.
- Its first complete target is six badge forms and six repeatable office-module families; do not restore the full 15-form pool or add a fourth weapon during the vertical slice.
- Office modules replace generic XP/card-slot growth in the Demo V2 runtime. Do not stack the old five-slot, per-stage armory and second-department systems underneath the new module layer.
- Enemy density and wave geometry are part of the Build contract. Implement the 60-second weapon/enemy gate and 3-minute Build-dialogue gate before the complete 8–10 minute run.
- Keep the current Demo V1 runnable and reusable. Do not rename, delete or overwrite it merely because Demo V2 planning has started.

## Baseline maintenance

Whenever the authoritative branch, worktree, runnable package, or product direction changes, update `docs/CURRENT_BASELINE.md` in the same change.
