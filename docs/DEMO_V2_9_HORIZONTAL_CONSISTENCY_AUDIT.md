# Demo V2.9 Horizontal Consistency Audit

Date: 2026-07-16

## Scope

Demo V2.9 is a horizontal correction pass over the four-weapon fixed suite. It does not add weapons, routes, components, items, permanent progression, departments, cards or encounters. Demo V2.8 remains runnable as the previous combat-tempo snapshot.

The goal is to turn the full conversation's feedback into shared rules, then apply those rules to Marker, Thermos, Scissors, Correction Fluid, all 17 encounters, XP, components, transitions and player-facing copy.

## Conversation issue inventory

### Build structure and pacing

- The original build cadence carried Hades-like heavy choices inside a continuous survivor arena, so planning advanced faster than the combat picture.
- Weapons, badges and cards all carried heavy conceptual weight; there was no light, frequent layer that visibly inflated the current tool.
- Early upgrades were too late or too subtle, and some runs reached two shops before the first module choice.
- Modules sometimes had no actual effect, unlocked behavior that already existed, or produced changes too weak to distinguish Copy from Forward/Archive.
- Module growth needed to create a new branch at Lv1, then visibly stack through Lv4, while components remained attribute-only.
- XP originally auto-assigned generic growth, preventing route-specific decisions; component acquisition and synthesis did not present a clear purchase/replace/upgrade path.

### Weapon identity

- Marker must own long-range paths: immediate parallel cutting versus persistent slowing ink. Marker lines must not knock enemies back.
- Thermos had drifted toward another forward beam. It must instead be short, wide, spatial, slowing and persistent, with shared-round overlap rules.
- Scissors must own the player's position: readable charge, gradual direction indicator, short fast movement rather than teleport, no dash while stationary, and a large outward cut whose origin remains attached to the character.
- Correction Fluid must own enemy state rather than generic poison: nearest-threat-first spray, three readable error stacks, field infection versus target cultivation, and Boss-compatible error generation.
- Visual assets and hit areas must describe the same judgment. Ink cannot look like a sharp laser, a shelter cannot obscure the player, and a held weapon cannot detach from its attack.

### Encounters, pressure and completion

- Normal encounters must finish when the timer expires or the fixed quota is cleared. They cannot become mandatory cleanup rooms.
- Boss encounters require Boss death plus timer expiry or add clearance. Boss death alone cannot skip the encounter, but adds cannot inherit Boss HP.
- Every encounter needs a fixed spawn cap; pressure should come from readable density and mixed roles, not a surprise health wall or waiting.
- The opening must preserve danger through modest health, but a 17-encounter run also needs recovery opportunities and an attrition floor.
- Stage 10, stage 4 weapon scaling, Boss HP, Correction Fluid opening speed/targeting, Error Spread size/damage and the frequency of healing all required specific corrections in V2.7/V2.8.
- Encounter preview text must name the roles that actually spawn. A preview that promises one threat and spawns another invalidates preparation.
- A mandatory Boss cannot become an accidental blind spot behind endless nearby adds.

### UI, copy and replay

- Weapon selection must show only the four playable choices; future slots stay reserved in code, not as dead cards.
- XP/module/component layouts, text, backgrounds and hit boxes must align and remain readable at the actual viewport.
- Component offers must state whether the action installs, upgrades or replaces an exclusive variant and how many identical copies reach the next quality.
- Collection needs a visible 10-second window, automatic final pickup and a clear preview of the next encounter.
- Production-facing pages must not contain internal test instructions, validation language or prototype notes.
- Restart after a run must return to all four weapon choices rather than silently locking the last weapon.
- Future weapons/items need extension points in the coordinator and data model, not visible empty UI.

### QA process

- Isolated mechanism tests were insufficient because a route could pass unit assertions while a player died, stalled or never reached the choice screen.
- Tests must cover real timers and public transitions, but a generic ranged kiting bot must not be used as the sole balance oracle for a pure melee weapon.

## First-principle rules

1. **A choice is valid only when it changes the next fight.** A module must add a combat-consumed branch; an attribute must mutate a combat/economy parameter; its result must be visible and useful to at least one route.
2. **A weapon is a resource loop, not a visual skin.** Marker edits paths, Thermos edits space, Scissors edits player position, and Correction Fluid edits enemy state. Shared stats may scale them, but must not replace those verbs.
3. **An encounter is a contract.** Preview, roster, spawn cap, HP curve, timer, quota and Boss condition must describe the same challenge. Difficulty comes from making decisions under pressure, not from hidden rules or waiting.
4. **Presentation is part of mechanics.** Art, animation, UI copy, bars and hit areas must expose the real state early enough for the player to act.
5. **QA separates concerns.** Real-damage opening probes check the survival window. Full real-timer progression soaks check spawn/target/kill/transition deadlocks without pretending one automated movement policy can judge every weapon's balance.

## V2.9 changes

### One authored encounter contract

- Each of the 17 encounters now owns an internal `enemyRoster` and a matching visible `enemyTypes` list.
- Queue, cluster, pursuit, review and fill spawning all consume that roster.
- Pre-fight preview and live encounter hint now use the same authored copy.
- Encounter challenge copy is weapon-neutral and describes enemy behavior, pressure and completion rather than prescribing Marker/Thermos/Scissors/Correction mechanics.
- All four weapons run against the same fixed encounter contract, including separate Boss/add HP and the asymmetric Boss completion rule.

### Cross-weapon growth consistency

- Universal XP now has the same actual per-point increments on all four weapons: +12 maximum HP, +0.8 HP regeneration, +1.5% lifesteal, and multiplicative +5% range.
- All 24 component variants are audited against combat-consumed parameters while both module branches are open. A component is rejected if it is mechanically dead.
- The existing install/identical-upgrade/opposite-variant-replace component path remains explicit and mutually exclusive.

### Recovery and objective acquisition

- Every collection window now closes with a 10% maximum-HP recovery floor after loose pickups are absorbed. Health packs, XP survival choices and regeneration remain valuable; random pack luck no longer decides all accumulated attrition.
- Marker aims its piercing line at an in-range mandatory Boss instead of allowing closer adds on the opposite side to hide the objective.
- Thermos points its short-wide fan at an in-range mandatory Boss before density scoring.
- Scissors gives an in-range Boss ownership of the melee attack direction; the wide cut still handles nearby adds.
- Correction Fluid retains the requested nearest-threat-first acquisition. Its spread route continues to generate real error fields from an overloaded Boss so the route does not lose its resource loop during Boss encounters.

### Thermos identity completion

- The base fixed Thermos fan now leaves a short-lived polygonal steam residue with low damage and 30% slow.
- Range controls the short-wide fan; duration now affects its residue even on a pure Heatwave route, so the duration component is never a dead purchase.
- Multiple Amount groups share same-round hit memory, preventing overlapping fans/residue from multiplying one judgment while preserving visible coverage.
- Base health is 74: still materially vulnerable at short range, but not dependent on an old high-HP safety buffer.

### Player-facing copy and versioning

- The current suite is labeled Demo V2.9 / Horizontal Consistency Fix.
- Current weapon stage, goals, result notes and encounter pages use player actions and outcomes, not internal test/validation language.
- `demo-v2-9.html` is the new recommended entry. V2.8 remains a runnable snapshot.

## Verification contract

`npm run qa` must pass all existing checks plus:

- equal universal-stat increments across Marker, Thermos, Scissors and Correction Fluid;
- all 24 component variants mutate parameters consumed by combat/economy;
- preview/roster/spawn consistency for all 17 encounters;
- all 68 weapon/encounter transitions reach their published pickup condition;
- four 12-second real-damage opening probes produce kills and leave the player alive;
- eight real-timer 17-encounter pure-route progression soaks (two routes × four weapons) complete all five module choices, six shops and the final Boss;
- explicit regressions for Marker/Thermos mandatory-Boss acquisition and persistent Thermos base residue.

The progression soak disables enemy outgoing damage only. Enemy counts, roles, health, movement, weapon targeting, damage output, timers, Boss kill requirements, pickups and every public growth choice remain active. It is a deadlock/progression test, not a substitute for human balance playtesting.

## Guardrails for later additions

- Do not add a fifth weapon or an item pool until all four current weapons retain distinct resource loops under the same encounter contract.
- New universal stats must define an equivalent real effect for every weapon or be weapon-scoped.
- New enemies must be added through the encounter roster and visible preview together.
- New components remain attribute-only unless the three-layer build model is intentionally revised; new attack branches belong to modules.
- Future weapon/item slots remain data-model extension points until playable content exists.
- Human playtesting remains the authority for feel, danger and visual satisfaction. Automated flow soaks are only a regression net.
