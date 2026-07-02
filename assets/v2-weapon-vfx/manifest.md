# V2 Weapon VFX Contact Sheets

These images are source contact sheets for the first V2 vertical-slice weapons. They are not final sliced sprite sheets yet.

## Files

| File | Weapon | Purpose |
| --- | --- | --- |
| `marker-v2-vfx-contact-sheet.png` | Marker | Laser-line weapon family: base pierce, split, P0 blast, shield counter, wave, grid, promoted and cross-department overlays. |
| `thermos-v2-vfx-contact-sheet.png` | Thermos | Heat-charge weapon family: steam burst, patrol module, boiling release, warm shield, tea wave, pantry station, promoted and cross-department overlays. |
| `sticky-note-v2-vfx-contact-sheet.png` | Sticky Note | Trap-formation weapon family: floor note, seeking note, switch pulse, route shield, viral spread, notice-board zone, promoted and cross-department overlays. |

## Runtime Sprites

The `sprites/` directory contains the first runtime cut pass. These are transparent keyframe sprites used by `src/v2/combat/systems.js`.

Marker:

- `marker_beam.png`
- `marker_split.png`
- `marker_blast.png`
- `marker_mark.png`
- `marker_wave.png`
- `marker_grid.png`
- `marker_scan.png`
- `marker_counter.png`

Thermos:

- `thermos_charge.png`
- `thermos_steam.png`
- `thermos_drone.png`
- `thermos_boil.png`
- `thermos_shield.png`
- `thermos_shield_break.png`
- `thermos_tea_wave.png`
- `thermos_station.png`
- `thermos_safe_zone.png`

Sticky Note:

- `sticky_base.png`
- `sticky_seeking.png`
- `sticky_sync_blast.png`
- `sticky_route.png`
- `sticky_spread.png`
- `sticky_notice_board.png`
- `sticky_notice_mastery.png`
- `sticky_combo.png`

## Intended Slice Pass

For implementation, each final VFX should be cut into 4-6 frame loops:

1. anticipation
2. release
3. impact
4. residual
5. fade

Promoted mastery effects may use 6-8 frames when the timing needs an extra charge or second pulse.

## Gameplay Priority

When cutting these sheets into game sprites, prioritize:

- combat readability at the current character scale
- clear topology difference between department forms
- blue/cyan shared weapon-family identity
- small secondary-department overlays that do not overpower the main form
- support-weapon effects that read as auxiliary, not replacement attacks

## Linked Spec

See `docs/v2-framework/weapon-visual-generation-guide.md` for the reusable generation and implementation rules.
