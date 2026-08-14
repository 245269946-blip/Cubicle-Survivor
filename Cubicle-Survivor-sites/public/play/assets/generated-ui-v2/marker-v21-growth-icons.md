# Demo V2.1 Marker growth icons

These two atlases belong only to `Demo V2.1 · 马克笔固定测试`.
They are read-aid assets for existing decisions; they do not add combat rules.

## Runtime files

- `marker-v21-build-icons.png`: 4 x 2 atlas for Copy, Archive, and the six mutually exclusive component variants.
- `marker-v21-experience-icons.png`: 4 x 3 atlas for the twelve simplified experience stats.

Both files use transparency and are consumed as CSS sprites by `styles.css`.

## Build atlas order

Row 1: Copy, Archive, Damage Tip, Pierce Tip.

Row 2: Attack Speed Body, Amount Body, Range Tail, Duration Tail.

## Experience atlas order

Row 1: Max HP, HP Regen, Life Steal, Damage.

Row 2: Attack Speed, Critical Chance, Range, Armor.

Row 3: Dodge, Move Speed, Luck, Harvesting.

## Generation provenance

Generated on 2026-07-16 with the built-in image generation tool. Style reference:
`office-department-slot-icons-v2.png`. The experience atlas also used the finalized build atlas as a palette reference.

The source prompts requested isolated, text-free office-object icons in the existing chunky painted pixel-art language, arranged in exact row-major grids on flat `#00ff00`. The build prompt specified the two module metaphors and all six Marker-part variants. The experience prompt specified all twelve stat metaphors. Chroma was removed with `remove_chroma_key.py` using a sampled corner key, soft matte, spill cleanup, and one-pixel edge contraction.

Original generated files remain in the local Codex generated-image cache; only the transparent runtime atlases are versioned here.
