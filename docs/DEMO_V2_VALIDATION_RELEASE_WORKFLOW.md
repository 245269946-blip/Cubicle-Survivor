# Demo V2 Validation and Release Workflow

This is the persistent release gate for the active Cubicle Survivor V2 package. Use it for every gameplay, balance, UI, asset or publishing change. Do not replace it with isolated mechanism tests or a developer-only smoke test.

## Authoritative surfaces

- Active source: `Cubicle-Survivor-demo/`
- Recommended playable entry: `Cubicle-Survivor-demo/demo-v3-13.html`
- Public site project: `Cubicle-Survivor-sites/`
- Hosted runtime copy: `Cubicle-Survivor-sites/public/play/`
- Current design/audit baseline: `docs/DEMO_V3_13_ALL_WEAPON_DESIRE_CHAINS.md`

The hosted runtime is generated from the active source by `node scripts/sync-demo-v2-site.mjs`. Never hand-edit `Cubicle-Survivor-sites/public/play/`.

## First-principle release questions

Before running tools, answer these five questions for every changed feature:

1. Does the player's next choice create a visible and combat-consumed result?
2. Does each affected weapon still own its distinct resource loop?
3. Do encounter preview, roster, HP, quantity and completion rules describe the same challenge?
4. Do art, animation, UI copy and hit areas expose the real mechanical state?
5. Is the evidence a balance test, a progression/deadlock test or a presentation test—and is it labeled honestly?

If any answer is unclear, the change is not ready for release.

## Automated gate

From the repository root, run:

```text
node scripts/sync-demo-v2-site.mjs
node scripts/verify-demo-v2-release.mjs
```

The first command replaces only the verified `Cubicle-Survivor-sites/public/play/` target with the active runtime. The second command runs the full gate:

1. Demo QA and all historical regression tests.
2. Four real-damage opening pressure probes.
3. All 24 component-variant combat-consumption checks.
4. All 17 authored encounter preview/roster/spawn contracts.
5. All 68 weapon/encounter completion transitions.
6. Eight real-timer 17-encounter pure-route progression soaks.
7. Hosted-runtime hash and V2.9 entry checks.
8. Production Sites build and rendered-wrapper test.
9. V3.13 playability guard: coherent cache tokens, world-centre spawn, immediate input/camera response, and render-layer isolation.

The eight progression soaks disable enemy outgoing damage only. Enemy count, role, movement, HP, targeting, player damage, timer, Boss kill condition, pickups and all public growth choices remain active. These soaks prove that the full route is reachable and cannot deadlock; they are not balance claims.

## Required player-facing browser matrix

After the automated gate, inspect the deployed candidate at both a normal desktop viewport and a 2048×1204 wide viewport and confirm:

- Landing and weapon selection show the current version and exactly four playable weapons. Future slots remain code-only.
- Enter through the real landing button and weapon card rather than a debug URL. The first combat frame must place the player at the world centre, show the player and enemies, accept WASD immediately, and move the camera with the player.
- Run the first encounter through its late combat and collection transition. A VFX failure must not hide the enemy/player layers, duplicate the background, stop input or stop subsequent frames.
- Each weapon reaches combat with the correct HP, HUD identity and actual core verb.
- Encounter preview names the enemies that spawn and contains no weapon-specific instruction or internal test language.
- Collection presents the 10-second pickup window, auto-collection explanation and next step.
- XP presents four readable universal-stat choices with correct values.
- Module selection shows two distinct branches, next level, immediate behavior and stacking direction.
- Component shop shows slot exclusivity, install/upgrade/replace action, same-variant synthesis and readable full text.
- Scissors shows charge, movement direction, attached outward cut and unobscured shelter.
- Thermos shows short-wide control coverage and persistent slowing steam rather than a second long beam.
- Correction Fluid shows readable error stacks, persistent spread fields and Boss-compatible route behavior.
- Restart returns to all four weapons.
- No browser console errors or warnings appear.
- Every changed runtime/CSS file uses a new cache token in `index.html`; a release must never combine a cached old combat script with a new coordinator or weapon config.

Record any failure as a product issue. Do not waive a browser failure because automated tests pass.

## Release sequence

1. Freeze scope and preserve unrelated user changes.
2. Sync the active runtime into the Sites project.
3. Run `node scripts/verify-demo-v2-release.mjs` until it passes.
4. Complete the browser matrix.
5. Update `docs/CURRENT_BASELINE.md`, the versioned audit document and the playable entry when the version changes.
6. Commit only the intended game, validation, site and documentation files.
7. Push the branch and open/update the GitHub pull request.
8. Deploy the exact validated commit through the existing Sites project.
9. Verify the public URL loads the current version and keep the deployed URL in the release handoff.

## Versioning rule

- A content or mechanics update increments the Demo V2 minor version and creates a new immutable entry page.
- A release-process-only correction does not create a gameplay version.
- Older entry pages remain runnable snapshots and must never be relabeled as the current version.
- The README may contain historical sections, but only one entry may be described as current/recommended.

## Failure policy

- Mechanism/unit failure: fix before any browser or deployment step.
- Opening pressure failure: treat as a survival/balance investigation; do not hide it with flow-test invulnerability.
- Progression soak failure: locate target acquisition, Boss completion, spawn or transition deadlock.
- Site sync failure: regenerate the hosted copy; never patch the copy directly.
- Build failure: fix the Sites source and rerun the complete release validator.
- Browser mismatch: fix presentation or copy and rerun automated QA plus the affected visual checks.
- Partial-canvas/background-duplication failure: inspect the first failing render layer, preserve player/enemy drawing through layer isolation, bump the complete runtime cache-token set, and rerun the real landing-to-first-encounter path.
- Deployment failure: keep the last successful public version live and do not claim the new version shipped.
