# Demo V1 generated UI manifest

> Authoritative runtime decision for `Cubicle-Survivor-demo`, verified 2026-07-14.

Current visible menu shells and combat status surfaces use the approved office raster set. CSS is restricted to layout, sizing, positioning and text flow; it must not provide gradients, animated geometry, shadows or pseudo-element decoration.

## Runtime groups

- `assets/generated-ui-v2/`: native-ratio office menu shells, dossier card frame and compact combat health bars.
- `assets/generated-vfx/sprites/status-*-office-v2.png`: open-center office status effects that preserve character silhouettes.
- `assets/generated-vfx/sprites/sticky-control-office-v2.png` and `sticky-link-line-office-v2.png`: office notice-board control feedback.
- `assets/generated-ui-v2/office-department-slot-icons-v2.png`: transparent 5×2 office-native atlas for five departments and five Build-slot duties. The atlas keeps its 2:1 source ratio and is never stretched to a square sheet.
- `generated-skin.css`: final mapping layer loaded after `styles.css`.

## Production sources

- Built-in image generation sources and keyed intermediates are retained under `tmp/imagegen/` only while an asset is being validated.
- Final runtime files live under `assets/generated-ui-v2/` and `assets/generated-vfx/sprites/`.

The retired `assets/generated-ui/` atlas/slice pass is no longer a runtime or QA dependency. It was visually superseded and must not be restored over the current office shells.

## Acceptance rules

1. Runtime PNG files must have transparent corners where transparency is expected.
2. Every CSS URL and every combat sprite path must resolve inside the package.
3. `generated-skin.css` must load after legacy layout CSS and contain no gradient or keyframe animation.
4. Browser acceptance is performed at 1280×720 for weapon select, badge, upgrade, slot, armory, support selection, pause, result and combat.
5. Any visible point/line/rectangle/ring animation is a failed build and requires tracing the active render path before further art iteration.
6. Full-screen menu overlays use a 15px horizontal gutter; the widest 1180px shell must keep `scrollWidth === clientWidth === 1210px` at the reference viewport. Horizontal menu scrolling is a failed build.

Pre-cleanup backup:

`C:\Users\Administrator\Documents\DemoV1-backups\demo-v1-pre-visual-cleanup-20260713.tar.gz`

Retired source-art backup:

`C:\Users\Administrator\Documents\DemoV1-backups\demo-v1-retired-source-art-20260713.tar.gz`

SHA256: `ECD9B33FFE9EF17B7111C0F86DDB901340106D33C594A93937899A0A4EB1B547`

`office-rogue-props.png` is intentionally absent from the runnable package: it was preloaded but never drawn. Production atlases, keyed intermediates and style boards must likewise remain outside the runtime package after final sprites are accepted.

Office icon refresh backup:

`C:\Users\Administrator\Documents\DemoV1-backups\demo-v1-office-icon-refresh-20260714.tar.gz`

SHA256: `680868192DD5369DB32EF06F9843627DF8D457F33BD73A0A72489E77AEEC22F6`

The archive contains the retired generic RPG/sci-fi icon atlas and the chroma-keyed generation intermediate. Neither file may return to the runnable package. Department cards use the atlas top row; output, survival, resource, mechanism and cost slots use the bottom row.
