# V3.15 World Map and Display Semantics

Verified: 2026-08-28

This contract records the implementation lessons from the V3.15 map, Light Step, and Scissors range repair.

## World-space scene contract

- A 2600x1800 office scene is a world map, not a viewport stage plate.
- The base scene and navigation overlay use the same camera transform as players, enemies, pickups, and effects.
- Viewport-cover scaling and reduced camera parallax are forbidden because they make world entities appear to slide over the floor.
- A background is not considered a map until the active combat area includes readable, world-anchored navigation references.

## Display-count contract

- Combat judgment may use helper edges, rays, or samples that are not independent visible models.
- The Scissors fan keeps left/right judgment edges, but those edges coalesce into exactly one complete scissors visual.
- A range upgrade enlarges that one scissors model and its fan area. It must not create a second scissors model.
- Marker, Thermos, and Correction Fluid follow the same rule: range grows judgment-aligned geometry; only an explicit Amount or module mechanic may add parallel authored outputs.

## Ground-cue contract

- Light Step owns exactly one ground cue in the world layer, below combat effects and entities.
- The cue direction comes from the same facing/input state that drives Light Step.
- Sprite sheets with large transparent padding must be rendered from measured non-transparent frame bounds. Increasing the nominal cell size without cropping is not accepted as a visibility fix.

## Runtime-ready asset gate

- Generated artwork must be processed into the actual runtime format, loaded by the first-frame asset gate when essential, and visually checked at game scale.
- A generated concept image, an unprocessed chroma-key image, or an asset merely present in the repository is not runtime-ready.
- Browser evidence must prove asset readiness, zero runtime errors, correct world layering, and the intended model count.
