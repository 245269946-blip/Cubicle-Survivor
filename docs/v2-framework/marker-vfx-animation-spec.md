# Marker Laser VFX Animation Spec

This sheet defines the V4 marker weapon form effects as frame animations, not static decals.

Runtime atlas: `assets/marker-laser-vfx-spritesheet.png`

Grid: 8 columns x 6 rows.

Rows:

1. `split`: piercing beam impact and split branches.
2. `blast`: product laser explosion, from ignition point to outward bloom and fade.
3. `rain`: operations falling laser, from ground warning circle to vertical strike.
4. `wave`: marketing ring wave, from inner pulse to expanding circular laser front.
5. `grid`: administrative laser grid, from first rule lines to crosshatch lock.
6. `shield`: operations counter-spike shield, from shield ring to spike burst and decay.

Combat readability rules:

- The base marker remains a long piercing beam. The animation frames should accent the impact and form identity, not hide the straight-line aiming fantasy.
- Early marker effects stay small enough to match player scale and single-lane hit width.
- Promotion effects may increase radius, line count, or persistence, but must still read as blue laser variants.
- Product form grows through explosion radius and bloom density.
- Tech form grows through split beam count and secondary impact sparks.
- Operations form grows through falling laser count and shield spike intensity.
- Marketing form grows through wave count and ring radius.
- Administrative form grows through grid density and linger time.
