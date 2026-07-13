# Demo V1 weapon VFX runtime manifest

> Last verified: 2026-07-13. This is a whitelist, not an asset inventory.

## Approved runtime sprites

| File | Runtime meaning |
| --- | --- |
| `sprites/thermos_drone_v2.png` | Tech Thermos patrol module body |
| `sprites/thermos_station_v2.png` | Admin Thermos station body |
| `sprites/sticky_note_v2.png` | Shared physical Sticky Note body |

All three files are 128×128 RGBA, contain one subject and have transparent
corners. They are entity bodies only. Ranges, lines, rings, links, impacts and
timing use the approved office sprites under `assets/generated-vfx/sprites/`;
the renderer derives position, rotation, authored aspect ratio and live scale
from the same runtime objects used by combat judgment. Visible Canvas geometry
primitives are forbidden in the active renderer.

## Removed from runnable package

The three contact sheets, 25 legacy first-pass crops and five generated/keyed
intermediates were removed on 2026-07-13. They had opaque corners, baked panels,
checkerboard contamination or multiple states in one crop. Their pre-cleanup
copies remain in:

`C:\Users\Administrator\Documents\DemoV1-backups\demo-v1-pre-visual-cleanup-20260713.tar.gz`

Do not restore them to CSS, HTML preload lists or JavaScript sprite registries.
See `docs/DEMO_V1_VISUAL_ASSET_AUDIT.md` for the runtime contract.
