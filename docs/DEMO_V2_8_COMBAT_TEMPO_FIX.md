# Demo V2.8 Combat Tempo Fix

Status: implemented and verified on 2026-07-16.

Entry: `Cubicle-Survivor-demo/demo-v2-8.html`

Demo V2.8 is a focused player-experience correction for the existing four-weapon fixed framework. It does not add a weapon, route, component slot, random item pool, permanent progression system, or new production phase. Demo V2.7 remains runnable as the previous snapshot.

## Locked goals

1. Stage 10 must no longer permit a full encounter with zero kills for a viable starter build.
2. Boss fights must resolve faster without removing movement, add management, or per-hit burst caps.
3. Error Spread must keep producing its core battlefield object during Boss encounters.
4. Scissors must read as one weapon attached to the player, with its blades and slash facing outward.
5. Recovery and restart behavior must support repeated real playtests.

## Combat tempo

- Marker base damage: 18 to 21.
- Thermos base damage: 15 to 18.
- Scissors base damage: 24 to 28.
- Correction Fluid base damage: 8 to 11; base cooldown: 0.72 to 0.62 seconds.
- Fixed-suite enemy outgoing damage is multiplied by 1.12.
- Stage 10 normal base HP is 30. Later normal HP uses 42, 48, 58 and 72 instead of the V2.7 cliff.
- Boss HP uses 520, 720, 980, 1750, 2250 and 3400 across the six Boss encounters. Boss adds remain on their own lower curve.

The intention is faster exchanges on both sides: player hits matter sooner, enemies remain dangerous when they reach or shoot the player, and neither side gains impact through inflated health bars.

## Scissors

- The held `scissors-v23` body orbits at the player boundary and follows the real attack angle.
- Base, Open-Blade and finale attacks use the existing slash-only `scissors-slash-v24` frames. The V2.7 full-scissor strike sheet is no longer rendered as a second weapon body.
- The base cut, thrust, fan and sever ranges are increased while retaining melee caps.
- Passive Light-Step charge time is 7.2 seconds. Completed rounds grant 0.13 base charge; multi-target bonus is capped at 0.06.
- The dash remains an 82 px, 0.18-second movement and still requires movement input.

## Correction Fluid

- Error-area radius begins at roughly 90 px on Spread Lv1 and grows by small linear steps through Lv4.
- Component range scaling is softened and total route radius is capped at 140 px.
- Area damage is auxiliary: 12% of weapon damage at Lv1 and 16% from Lv2 onward, with slower late-route ticks.
- Lv3 merges cap at 1.55 times the current route radius instead of 2.15 times.
- An overloaded Boss leaks one real error area every 3.2 seconds while Spread is active. This preserves the route loop without requiring the Boss to die and without turning the area into the main damage source.

## Recovery and replay

- Normal fixed-suite enemies have a 4.5% healing-pack chance.
- Elites have a 16% chance.
- Bosses guarantee one healing pack.
- The existing first-aid atlas cell is reused; no new art family or visible Canvas geometry is introduced.
- Restarting a coordinated four-weapon run returns to the Demo V2.8 coordinator. Opening weapon selection again must show Marker, Thermos, Scissors and Correction Fluid.

## Verification gates

- `npm run qa` must pass.
- A Stage-10 regression must prove starter Correction Fluid can kill the upper-bound heavy-enemy HP sample within eight attacks.
- A Boss overload regression must create a live Correction error area.
- Area-radius regression must remain monotonic and avoid the old Lv3 spike.
- Scissors source regression must render slash-only frames for cut attacks.
- Boss healing and auto-collection must restore HP.
- Restart regression must resolve to a four-card coordinator.
- Browser verification at 1280 x 720 must show a player-anchored outward Scissors cut, a live Boss error area, and four weapons after result-screen restart.
