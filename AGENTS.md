# Cubicle Survivor Demo V1 Agent Instructions

## Mandatory startup

This worktree is the sole authoritative development baseline for Cubicle Survivor Demo V1.

Before inspecting, planning, testing, or editing the game, read these files in order:

1. `docs/CURRENT_BASELINE.md`
2. `docs/v2-core-review-principles.md`
3. `docs/INDEX.md`

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
- Current optimization priority is player-facing combat feel, matching art assets, music/SFX, and readable Build expression. Steam release engineering is intentionally deferred.

## Baseline maintenance

Whenever the authoritative branch, worktree, runnable package, or product direction changes, update `docs/CURRENT_BASELINE.md` in the same change.
