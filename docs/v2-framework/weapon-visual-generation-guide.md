# V2 Weapon Visual Generation Guide

This guide is the reusable art contract for V2 weapon VFX. It turns weapon design into repeatable image-generation prompts and later sprite implementation rules.

## Core Goal

Players should understand the current build from combat motion first, UI text second.

Every weapon visual must communicate:

- weapon motif: what office tool is being weaponized
- attack topology: line, wave, trap, field, beam, summon, shield, chain
- phase maturity: intern, badge form, promoted mastery, cross-department mix, cross-weapon support
- stat growth: more, bigger, faster, longer, stronger, safer

Avoid making each department look like a totally unrelated magic school. Department variants should feel like the same weapon evolved through different work styles.

## Shared Style

- Pixel-art foundation with high-polish neon rendering.
- Readable at gameplay scale first; contact sheets can include larger preview panels.
- Neon cyber office palette, but avoid muddy dark effects.
- Primary VFX should have a clear animation process: anticipation, strike, impact, residual, fade.
- No UI text inside generated VFX sprites unless the asset is explicitly a UI mockup.
- No photorealism, no flat vector icon style, no old-school fantasy spell look.

## Phase Visual Rules

| Phase | Stages | Visual Job | Complexity Budget |
| --- | ---: | --- | --- |
| Intern weapon | 1-3 | Teach the base combat verb. | 1 clear effect, minimal secondary noise. |
| Badge form | 4-7 | Show how the department changes the weapon shape. | Main topology can change, color stays related. |
| Promoted mastery | 8-10 | Add a signature second trigger. | One extra burst, echo, overheat, board, or counter layer. |
| Cross-department | 11-13 | Keep main form dominant, add a small secondary department layer. | Secondary effect is smaller and lower-frequency. |
| Cross-weapon | 14-16 | Add support weapon essence. | Support VFX must be visibly subordinate. |

## Frame Animation Contract

Most VFX sprites should be prepared as contact sheets or sprite sheets with 4-6 frames:

1. Anticipation: glow, aiming line, heat buildup, sticky placement, shield charge.
2. Release: beam, steam burst, note placement, wave start, trap trigger.
3. Impact: hit spark, explosion core, shield break, slow ring, link snap.
4. Residual: trail, grid, mist, board zone, lingering line.
5. Fade: particles dissolve, opacity drops, outline collapses.

Large ult-like promoted mastery effects may use 6-8 frames, but gameplay implementation should still sample them into short readable windows.

## Stat-To-Visual Mapping

Use these variables consistently instead of inventing new art for every stat:

| Stat Change | Visual Change |
| --- | --- |
| Damage | Brighter impact core, stronger hit flash, sharper spark. |
| Count | More split beams, notes, modules, waves, or shield shards. |
| Range | Longer beam, wider cone, larger ring, bigger trap link radius. |
| Frequency | Shorter interval, faster pulse cadence, less idle darkness. |
| Duration | Residual trail or field fades more slowly. |
| Control | Enemy-foot lock markers, slow rings, rule-grid intersections. |
| Resource | Small pickup motes, suction streaks, material glints. |
| Risk/Cost | Brief orange-red warning rim, never replacing the weapon color identity. |

## UI Preview Rules

Weapon select:
- Show only the base weapon motif and attack verb.
- Use a simple looping preview.

Badge select:
- Show the current weapon under each department form.
- Each card needs one small visual hook, not a paragraph.

Slot select:
- Show before/after visual deltas for the current form.
- Example: split beams 2 -> 3, wave count 1 -> 2, grid duration +1s.

Armory:
- Show material purchases as upgrades to the current main form.
- Do not use generic legacy tags like engineering, precise, ranged, melee defense.

Combat HUD:
- Do not explain the build with long text.
- Let the active attack, support trigger, and current form chip do the work.

## Three-Weapon Vertical Slice

### Marker

Motif: long-range piercing laser line.

Base:
- thin blue-cyan piercing beam with short aiming shimmer
- small blue-white cut spark on hit
- 0.12s residual trail

Tech:
- main beam splits into short branch beams
- promoted mastery can trigger rare horizontal full-screen scan

Product:
- P0 mark ring on valuable target
- second hit detonates into blue-white blast with violet rim
- promoted mastery doubles blast radius

Ops:
- beam hits charge a shield scale around player
- shield break reflects short laser spikes

Marketing:
- beam endpoint releases circular wave rings
- promoted mastery adds an echo ring

Admin:
- beam path leaves residual line
- crossed residuals create rule-grid fields

### Thermos

Motif: heat charge into steam release.

Base:
- heat meter glow, cup mouth buildup, short steam burst

Tech:
- autonomous warm module patrols and emits mini steam jets

Product:
- boiling threshold, compressed flash, thick steam column
- promoted mastery adds over-boil second pulse

Ops:
- warm shield around player
- shield break releases heat-wave counter ring

Marketing:
- periodic tea-aroma wave
- deaths create smaller secondary wave

Admin:
- deployable pantry safe station
- steam boundary, supply center, slow field edge

### Sticky Note

Motif: place, connect, trigger, control space.

Base:
- note slaps onto floor, waits, then flashes on enemy contact

Tech:
- note slides toward enemies as a tiny seeking task unit

Product:
- notes synchronize and detonate via blue-white switch pulse

Ops:
- notes form a route; player gains shield, enemies slow

Marketing:
- note attaches to enemy and spreads on death through blue arcs

Admin:
- three notes link into a notice-board control zone
- promoted mastery expands link radius and stabilizes rule boundary

## Prompt Template

Use case: stylized-concept
Asset type: game VFX contact sheet / sprite sheet source
Primary request: <weapon + phase + forms>
Style/medium: polished pixel-art neon VFX, cyber office roguelite, readable gameplay sprite source
Composition/framing: transparent-intended VFX on dark neutral preview background, organized contact sheet, generous padding
Lighting/mood: bright cyan-blue neon, crisp impact cores, clean silhouettes
Color palette: shared blue laser/energy family, with subtle department accents only
Materials/textures: pixel glow, scanline shimmer, soft bloom, sharp hit sparks
Constraints: no text, no watermark, no photorealism, no fantasy rune language, no muddy low-contrast effects
Avoid: unrelated magic styles, flat simple icons, excessive decorative UI frames

