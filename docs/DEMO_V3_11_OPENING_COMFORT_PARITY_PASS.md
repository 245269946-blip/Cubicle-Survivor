# Demo V3.11 — Opening Comfort and Four-Weapon Parity Pass

## Goal

Demo V3.11 addresses two connected player-experience failures without changing the 17-encounter structure, module routes, component economy, enemy roster, or the V3.10 visual ownership rules:

1. Encounters 1 and 2 should teach movement and weapon identity before demanding mastery.
2. Marker and Thermos should no longer make Scissors and Correction Fluid feel like incorrect starting choices.

The pass keeps enough enemies on screen for grass-cut readability. It reduces early contact pressure instead of turning the opening into an empty arena.

## Opening pressure budget

Only encounters 1 and 2 receive the comfort modifier. Encounter 3 onward preserves the V3.10 pressure curve.

### Encounter 1

- Enemy quota: 82% of the V3.10 value.
- Active floor: 74%.
- Batch size: 75%.
- Enemy health: 80%.
- Enemy speed: 84%.
- Contact damage: 68%.
- Hostile actions and projectiles are slower and easier to read.
- Spawn distribution remains sustained across the encounter.

### Encounter 2

- Enemy quota: 88% of the V3.10 value.
- Active floor: 82%.
- Batch size: 80%.
- Enemy health: 88%.
- Enemy speed: 90%.
- Contact damage: 78%.
- The transition to the normal pressure curve begins here.

This is a temporary onboarding envelope, not a global difficulty reduction.

## Weapon parity changes

### Marker

- Base damage: 8.5 → 8.0.
- Base cooldown: 0.46s → 0.48s.

Marker keeps its long-line coverage and later Copy/Archive growth. Only its automatic opening lead is trimmed.

### Thermos

- Base damage: 7.2 → 6.75.
- Base cooldown: 0.46s → 0.49s.

Thermos keeps its short-wide control fan and area-control identity. Only its early simultaneous safety and throughput advantage is reduced.

### Scissors

- Base damage: 10.5 → 11.8.
- Base reach: 138 → 172.
- Base half-angle: 0.44 → 0.56.
- Dash charge time: 7.2s → 6.8s.
- Innate melee dodge margin: +10 percentage points.
- Ordinary attacks now acquire targets only inside the real active blade reach. A charged moving dash may still acquire a farther target.

The key repair is not the damage increase. It is eliminating invisible whiffs and paying for unavoidable melee exposure with readable reach and evasive margin.

### Correction Fluid

- Base damage: 5.8 → 6.4.
- Base cooldown: 0.27s → 0.245s.
- Opening overspray radius: 68 → 78.
- Opening overspray damage scale: 0.52 → 0.62.
- Two-stack vulnerability: 1.28 → 1.32.

Correction Fluid reaches its error-state loop sooner while remaining a state weapon rather than becoming a generic area-damage weapon.

## Automated evidence

Matched-seed, real-damage, moving 12-second probes:

| Weapon | V3.10 | V3.11 |
|---|---:|---:|
| Marker | 19 kills / 70 HP | 18 kills / 70 HP |
| Thermos | 26 kills / 74 HP | 18 kills / 74 HP |
| Scissors | 17 kills / 11 HP | 24 kills / 58 HP |
| Correction Fluid | 16 kills / 64 HP | 21 kills / 64 HP |

Four additional full-run progression soaks complete all 17 encounters, shops and module choices in V3.11.

## Acceptance boundaries

- All four weapons must survive the matched opening probe.
- Marker and Thermos must still clear at least 14 enemies in the probe.
- Scissors must improve both kills and survival margin over V3.10.
- Correction Fluid must improve opening kills over V3.10.
- Encounters 1 and 2 must remain visibly populated.
- Encounter 3 onward must not inherit the comfort multipliers.
- No module, component, enemy type, item, or visual system is added in this pass.

