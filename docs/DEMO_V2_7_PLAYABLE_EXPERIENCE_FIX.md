# Demo V2.7 Four-Weapon Playable Experience Fix

Verified: 2026-07-16

## Scope

Demo V2.7 is a repair and player-readability pass for the existing four-weapon fixed framework. It does not add another weapon, item system, route, or permanent progression layer. The recommended entry is `Cubicle-Survivor-demo/demo-v2-7.html`; Demo V2.6 remains available as the previous snapshot.

## Root cause fixed

Boss encounter configuration previously reused `stage.enemyHp` for every normal add. As a result, ordinary adds in Boss stages inherited Boss-scale health (hundreds to thousands of HP), could become effectively unkillable, and could prevent the stage from reaching the next module decision.

Every stage now owns a separate `normalEnemyHp`. Non-Boss enemies always read that value, while the Boss alone reads Boss HP. Regression coverage rejects any Boss encounter whose add HP is not lower than Boss HP.

## Locked stage path

- 17 encounters and 6 component shops remain unchanged.
- Module choices occur after encounters 1, 3, 6, 9, and 12.
- Each module branch remains capped at Lv4. The fifth choice may be spent on the other branch.
- A normal encounter completes when its timer expires or its fixed enemy quota is cleared.
- A Boss encounter completes only after the Boss dies and either its timer expires or its fixed add quota is cleared.
- Every encounter still enters the 10-second resource pickup flow before the next decision or fight.

## Early-game balance

- Starting health is reduced to restore movement pressure: Marker 70, Thermos 66, Scissors 58, Correction Fluid 64.
- Thermos starts at 15 damage and a 1.05-second attack interval.
- Correction Fluid starts at 8 damage and a 0.72-second attack interval; its primary target is strictly the nearest enemy, with low-health/error-stack priority applied only to additional targets inside a distance band.
- Enemy health bars are enlarged for both normal and Boss enemies.

## Scissors contract

- Light-Step is movement, not teleportation: 82 px over 0.18 seconds.
- Standing still never consumes the dash charge.
- A charge bar and progressive facing indicator use the same charge/facing runtime state.
- Slash, thrust, fan, sever, and shelter ranges are larger but remain melee-capped.
- Strike frames visibly show the cut/thrust action.
- The shelter uses a center-empty animated perimeter, so it does not cover the player.
- V2.7 runtime assets are `scissors-strike-v27-sheet.png`, `scissors-shelter-v27-sheet.png`, and `scissors-dash-direction-v27-sheet.png`.

## UI and copy contract

- The live weapon selection shows only the four playable weapons. Future weapon/item capacity remains in configuration only.
- Attribute cards align with the unsegmented four-column panel background.
- Component-shop text must wrap completely and its panel background must remain present.
- Experience descriptions are universal stat descriptions, not weapon-specific advice.
- Public V2.7 screens use playable-version language; internal test instructions and placeholder capacity are not exposed.

## Regression gates

Automated QA must cover:

1. The 17-encounter / 6-shop / 5-module schedule.
2. Boss and add HP separation.
3. Timer-or-quota completion for normal encounters.
4. Boss-death-plus-timer-or-add-quota completion for Boss encounters.
5. The first module page appearing after encounter 1 and before the first component shop.
6. Scissors standing-still charge preservation and progressive dash distance.
7. Correction Fluid nearest-target priority.
8. Universal experience wording and V2.7 suite routing.

Browser QA at 1280×720 must additionally inspect the four-weapon chooser, attribute page, component shop, first module page, and a live Scissors encounter.
