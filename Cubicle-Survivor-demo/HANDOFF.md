# Handoff: Foundation Stability Pass

This branch is the continuation point for the foundation fix.

Remote branch:

```bash
git fetch origin codex/foundation-stability-source
git switch codex/foundation-stability-source
```

PR:

```text
https://github.com/245269946-blip/Cubicle-Survivor/pull/2
```

## What This Version Fixes

- UI choice panels no longer rebuild identical HTML every frame, which fixes card jitter and unstable clicks.
- Combat now has a larger world plus a camera that follows the player instead of locking movement inside a fixed viewport.
- Combat effects now share explicit primitives: `beam`, `circleEvent`, `zone`, and `projectile`.
- QA now checks the foundation contracts for UI caching, camera movement, world-bound spawns, and primitive exports.

## What This Version Does Not Claim

- Marker split laser is not finished as a real split-beam mechanic yet.
- Thermos and sticky-note final combat identities are not fully rewritten yet.
- This pass does not add pressure, employee identity, card pools, or more stage content.
- This pass does not replace the existing pixel/neon visual direction.

## How To Run

Open the local file directly:

```text
Cubicle-Survivor-demo/index.html
```

No build step is required for the current HTML demo.

## How To Verify

Use the bundled Node runtime if available, or any modern Node.js runtime:

```bash
node --check demo-qa.js
node --check src/v2/combat/systems.js
node --check src/v2/runtime/state.js
node --check src/v2/ui/render.js
node test-runner.js
node demo-qa.js
```

Expected result:

```text
ALL TESTS PASSED
DEMO QA PASSED
```

## Next Safe Work Order

1. Rebuild marker split laser as true multi-beam behavior using `CombatPrimitives.beam`.
2. Add QA that asserts split beams are separate beam events with distinct paths, not one larger damage area.
3. Rework thermos heat/release and sticky-note entity behavior against the same primitive contracts.
4. Only after the three weapon identities are mechanically reliable, continue adding stages or new visual polish.

## Important Local Note

The full zip package was kept local because `git push` over `github.com` was unstable in this environment. The uploaded PR branch contains the source and assets needed to continue development.
