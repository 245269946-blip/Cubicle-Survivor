# Cubicle Survivor Demo V1 Agent Instructions

## Mandatory startup

This worktree is the sole authoritative development baseline for Cubicle Survivor Demo V1.

Before inspecting, planning, testing, or editing the game, read these files in order:

1. `docs/CURRENT_BASELINE.md`
2. `docs/v2-core-review-principles.md`
3. `docs/INDEX.md`

For any fixed-suite planning or implementation, also read `docs/DEMO_V2_PRODUCTION_BRIEF.md` before acting. `Cubicle-Survivor-demo/` remains the only editable game source; Demo V3.15 is the current recommended four-weapon entry and older entries are regression snapshots.

Then run `git status --short --branch` and preserve every existing working-tree change.

The active runnable Demo V1 game is `Cubicle-Survivor-demo/`. Do not treat the root compatibility entry files or a legacy export as the active demo without checking `docs/CURRENT_BASELINE.md` first.

## Version boundary

- `C:\Users\Administrator\Documents\New project 2` is the historical web prototype. Never call it Demo V1.
- `C:\Users\Administrator\Documents\Cubicle-Survivor-v2` is an early Demo V1 snapshot that stops at the `codex/v2-weapon-vfx-playable` baseline.
- This worktree, currently on `codex/demo-v2-6-four-weapon-neon`, including its intentional working-tree changes, is the current source of truth.
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
- Purchase and choice pages are decision surfaces, not manuals: default to name + immediate result + at most one future/relationship cue.
- If a card needs more than two short result-led lines to explain itself, remove, defer, or express the rest in combat; do not shrink the font to preserve prose.
- Before changing any player-visible weapon, component or combat VFX, read `docs/WEAPON_VISUAL_DESIGN_STANDARD.md`. Every visible part must declare a physical owner, mount, follow rule and state source; every attack effect must share its origin and geometry with combat judgment.
- A generated image is not a game-ready asset merely because it has transparency or is referenced by runtime code. Before calling it ready, it must pass the asset-entry gate in `docs/visual-qa-checklist.md`: declared runtime role and target size, camera/direction fit, tight alpha bounds, aspect-preserving draw, target-scale composite, and motion/judgment alignment. Label concept art `reference-only` and incomplete cutouts `prototype-cutout`; never report either as production-ready.
- If image generation is unavailable, quota-limited, or fails the requested visual standard, mark the formal asset batch blocked/incomplete. Do not replace it with line-art SVG, Canvas geometry, concept art, or another placeholder and still call the result formal or `runtime-ready`.
- Character motion may not be faked with whole-sprite bobbing. A runtime-ready directional character needs the shared identity, common anchors and at least `idle / step-a / step-b` for every supported direction; weapon states must reuse the shared body and aligned back/front rig layers instead of regenerating a different whole character.
- Image-generated animation strips are source material, not sprite atlases. Copy the source into the project, remove the key to real alpha, split poses by actual alpha-connected bounds when limbs or props cross nominal cells, normalize scale/baseline/anchors, then pass fixed-frame and live-play browser checks before marking the derived atlas `runtime-ready`.
- Audio is not `runtime-ready` merely because a file exists or a procedural preview sounds plausible. Require a committed playable format, semantic event hook, cooldown/mix budget, browser unlock-policy compliance, decode evidence and version-gate isolation before marking a formal cue complete.
- Current optimization priority is player-facing combat feel, matching art assets, music/SFX, and readable Build expression. Steam release engineering is intentionally deferred.

## Demo V2 production lock

- Demo V2 keeps only Marker, Thermos and Sticky Note as main weapons.
- Its first complete target is six badge forms and six repeatable office-module families; do not restore the full 15-form pool or add a fourth weapon during the vertical slice.
- Office modules replace generic XP/card-slot growth in the Demo V2 runtime. Do not stack the old five-slot, per-stage armory and second-department systems underneath the new module layer.
- Enemy density and wave geometry are part of the Build contract. Implement the 60-second weapon/enemy gate and 3-minute Build-dialogue gate before the complete 8–10 minute run.
- Keep the current Demo V1 runnable and reusable. Do not rename, delete or overwrite it merely because Demo V2 planning has started.

## Baseline maintenance

Whenever the authoritative branch, worktree, runnable package, or product direction changes, update `docs/CURRENT_BASELINE.md` in the same change.
