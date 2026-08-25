"""Normalize generated formal Boss strips into 320px runtime atlases."""

from __future__ import annotations

import json
from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT / "Cubicle-Survivor-demo" / "output" / "cartoon-boss-actions-v1"
ASSET_ROOT = ROOT / "Cubicle-Survivor-demo" / "assets" / "cartoon-marker-slice"
CELL = 320
BASELINE_Y = 296
MAX_WIDTH = 302
MAX_HEIGHT = 286

SPECS = [
    {
        "sequence": "lead-actions",
        "source": "lead-boss-actions-alpha-v1.png",
        "output": "lead-boss-actions-v1.png",
        "frames": 4,
        "referenceHeight": 270,
        "frameOrder": ["patrol", "point", "hit", "defeat"],
    },
    {
        "sequence": "lead-walk",
        "source": "lead-boss-walk-alpha-v1.png",
        "output": "lead-boss-walk-v1.png",
        "frames": 4,
        "referenceHeight": 270,
        "frameOrder": ["contact-left", "pass-low", "contact-right", "airborne"],
    },
    {
        "sequence": "lead-lane",
        "source": "lead-boss-lane-alpha-v1.png",
        "output": "lead-boss-lane-v1.png",
        "frames": 5,
        "referenceHeight": 270,
        "frameOrder": ["open", "raise", "aim", "release", "recover"],
        "sourceSlices": [0, 330, 790, 1215, 1750, 2078],
    },
    {
        "sequence": "lead-burst",
        "source": "lead-boss-burst-alpha-v1.png",
        "output": "lead-boss-burst-v1.png",
        "frames": 5,
        "referenceHeight": 270,
        "frameOrder": ["brace", "flip", "raise", "safe-gap-release", "recover"],
    },
    {
        "sequence": "director-actions",
        "source": "director-boss-actions-alpha-v1.png",
        "output": "director-boss-actions-v1.png",
        "frames": 4,
        "referenceHeight": 270,
        "frameOrder": ["patrol", "command", "shield-hit", "defeat"],
    },
    {
        "sequence": "director-walk",
        "source": "director-boss-walk-alpha-v1.png",
        "output": "director-boss-walk-v1.png",
        "frames": 4,
        "referenceHeight": 270,
        "frameOrder": ["caster-left", "pass-low", "caster-right", "airborne"],
    },
    {
        "sequence": "director-lane",
        "source": "director-boss-lane-alpha-v1.png",
        "output": "director-boss-lane-v1.png",
        "frames": 5,
        "referenceHeight": 270,
        "frameOrder": ["brake", "align", "aim", "corridor-release", "recover"],
    },
    {
        "sequence": "director-burst",
        "source": "director-boss-burst-alpha-v1.png",
        "output": "director-boss-burst-v1.png",
        "frames": 5,
        "referenceHeight": 270,
        "frameOrder": ["close", "split", "orbit", "safe-gap-release", "recover"],
    },
    {
        "sequence": "delivery-actions",
        "source": "delivery-boss-actions-alpha-v1.png",
        "output": "delivery-boss-actions-v1.png",
        "frames": 4,
        "referenceHeight": 270,
        "frameOrder": ["loaded-idle", "seal-command", "dented-hit", "collapsed-defeat"],
    },
    {
        "sequence": "delivery-walk",
        "source": "delivery-boss-walk-alpha-v1.png",
        "output": "delivery-boss-walk-v1.png",
        "frames": 4,
        "referenceHeight": 270,
        "frameOrder": ["wheel-left", "pass-low", "wheel-right", "airborne"],
    },
    {
        "sequence": "delivery-charge",
        "source": "delivery-boss-charge-alpha-v1.png",
        "output": "delivery-boss-charge-v1.png",
        "frames": 5,
        "referenceHeight": 270,
        "frameOrder": ["brace", "seal", "launch", "impact-release", "brake-recover"],
    },
    {
        "sequence": "delivery-lane",
        "source": "delivery-boss-lane-alpha-v1.png",
        "output": "delivery-boss-lane-v1.png",
        "frames": 5,
        "referenceHeight": 270,
        "frameOrder": ["brake", "align", "aim", "corridor-release", "recover"],
    },
    {
        "sequence": "delivery-burst",
        "source": "delivery-boss-burst-alpha-v1.png",
        "output": "delivery-boss-burst-v1.png",
        "frames": 5,
        "referenceHeight": 270,
        "frameOrder": ["lock", "unseal", "orbit", "safe-gap-release", "recover"],
    },
    {
        "sequence": "client-actions",
        "source": "client-boss-actions-alpha-v1.png",
        "output": "client-boss-actions-v1.png",
        "frames": 4,
        "referenceHeight": 270,
        "frameOrder": ["terminal-idle", "call-command", "screen-hit", "slumped-defeat"],
    },
    {
        "sequence": "client-walk",
        "source": "client-boss-walk-alpha-v1.png",
        "output": "client-boss-walk-v1.png",
        "frames": 4,
        "referenceHeight": 270,
        "frameOrder": ["caster-left", "pass-low", "caster-right", "airborne"],
    },
    {
        "sequence": "client-call",
        "source": "client-boss-call-alpha-v1.png",
        "output": "client-boss-call-v1.png",
        "frames": 5,
        "referenceHeight": 270,
        "frameOrder": ["listen", "dial", "compress", "speech-release", "recover"],
    },
    {
        "sequence": "client-lane",
        "source": "client-boss-lane-alpha-v1.png",
        "output": "client-boss-lane-v1.png",
        "frames": 5,
        "referenceHeight": 270,
        "frameOrder": ["stabilize", "align", "stack", "corridor-release", "recover"],
    },
    {
        "sequence": "client-burst",
        "source": "client-boss-burst-alpha-v1.png",
        "output": "client-boss-burst-v1.png",
        "frames": 5,
        "referenceHeight": 270,
        "frameOrder": ["mute", "conference", "orbit", "safe-gap-release", "recover"],
    },
    {
        "sequence": "ceo-actions",
        "source": "ceo-boss-actions-alpha-v1.png",
        "output": "ceo-boss-actions-v1.png",
        "frames": 4,
        "referenceHeight": 270,
        "frameOrder": ["armored-idle", "final-command", "shield-hit", "collapsed-defeat"],
    },
    {
        "sequence": "ceo-walk",
        "source": "ceo-boss-walk-alpha-v1.png",
        "output": "ceo-boss-walk-v1.png",
        "frames": 4,
        "referenceHeight": 270,
        "frameOrder": ["caster-left", "pass-low", "caster-right", "airborne"],
    },
    {
        "sequence": "ceo-stamp",
        "source": "ceo-boss-stamp-alpha-v1.png",
        "output": "ceo-boss-stamp-v1.png",
        "frames": 5,
        "referenceHeight": 270,
        "frameOrder": ["scrutinize", "load", "compress", "sealed-memo-release", "recover"],
    },
    {
        "sequence": "ceo-charge",
        "source": "ceo-boss-charge-alpha-v1.png",
        "output": "ceo-boss-charge-v1.png",
        "frames": 5,
        "referenceHeight": 270,
        "frameOrder": ["brace", "drive-lever", "launch", "shield-impact", "brake-recover"],
    },
    {
        "sequence": "ceo-lane",
        "source": "ceo-boss-lane-alpha-v1.png",
        "output": "ceo-boss-lane-v1.png",
        "frames": 5,
        "referenceHeight": 270,
        "frameOrder": ["stabilize", "rulers-open", "align", "corridor-release", "recover"],
    },
    {
        "sequence": "ceo-burst",
        "source": "ceo-boss-burst-alpha-v1.png",
        "output": "ceo-boss-burst-v1.png",
        "frames": 5,
        "referenceHeight": 270,
        "frameOrder": ["shield-lock", "fan-open", "partial-orbit", "safe-gap-release", "recover"],
    },
]


def alpha_bounds(image: Image.Image) -> tuple[int, int, int, int]:
    bounds = image.getchannel("A").point(lambda value: 255 if value > 8 else 0).getbbox()
    if not bounds:
        raise RuntimeError("empty alpha frame")
    return bounds


def connected_components(image: Image.Image) -> list[dict[str, object]]:
    width, height = image.size
    alpha = image.getchannel("A")
    values = alpha.get_flattened_data() if hasattr(alpha, "get_flattened_data") else alpha.getdata()
    active = bytearray(1 if value > 8 else 0 for value in values)
    components: list[dict[str, object]] = []
    for start, value in enumerate(active):
        if not value:
            continue
        active[start] = 0
        queue = deque([start])
        pixels: list[int] = []
        sum_x = 0
        while queue:
            current = queue.pop()
            y, x = divmod(current, width)
            pixels.append(current)
            sum_x += x
            for neighbor in (
                current - 1 if x > 0 else -1,
                current + 1 if x + 1 < width else -1,
                current - width if y > 0 else -1,
                current + width if y + 1 < height else -1,
            ):
                if neighbor >= 0 and active[neighbor]:
                    active[neighbor] = 0
                    queue.append(neighbor)
        if len(pixels) >= 8:
            components.append({"pixels": pixels, "area": len(pixels), "centerX": sum_x / len(pixels)})
    return components


def split_poses(image: Image.Image, frame_count: int) -> list[Image.Image]:
    components = connected_components(image)
    if len(components) < frame_count:
        raise RuntimeError(f"source contains {len(components)} components, expected {frame_count}")
    anchors = sorted(
        sorted(components, key=lambda item: int(item["area"]), reverse=True)[:frame_count],
        key=lambda item: float(item["centerX"]),
    )
    groups: list[list[int]] = [[] for _ in range(frame_count)]
    for component in components:
        owner = min(
            range(frame_count),
            key=lambda index: abs(float(component["centerX"]) - float(anchors[index]["centerX"])),
        )
        groups[owner].extend(component["pixels"])
    source_pixels = image.load()
    poses: list[Image.Image] = []
    for indices in groups:
        pose = Image.new("RGBA", image.size, (0, 0, 0, 0))
        pixels = pose.load()
        for flat_index in indices:
            y, x = divmod(flat_index, image.width)
            pixels[x, y] = source_pixels[x, y]
        poses.append(pose.crop(alpha_bounds(pose)))
    return poses


def build(spec: dict[str, object]) -> dict[str, object]:
    source = Image.open(SOURCE_ROOT / str(spec["source"])).convert("RGBA")
    if spec.get("sourceSlices"):
        cuts = [int(value) for value in spec["sourceSlices"]]
        frames = [
            source.crop((cuts[index], 0, cuts[index + 1], source.height)).crop(
                alpha_bounds(source.crop((cuts[index], 0, cuts[index + 1], source.height)))
            )
            for index in range(len(cuts) - 1)
        ]
    else:
        frames = split_poses(source, int(spec["frames"]))
    scale = int(spec["referenceHeight"]) / frames[0].height
    scale *= min(
        1,
        MAX_WIDTH / max(frame.width * scale for frame in frames),
        MAX_HEIGHT / max(frame.height * scale for frame in frames),
    )
    atlas = Image.new("RGBA", (CELL * len(frames), CELL), (0, 0, 0, 0))
    runtime_bounds: list[list[int]] = []
    for index, frame in enumerate(frames):
        width = max(1, round(frame.width * scale))
        height = max(1, round(frame.height * scale))
        resized = frame.resize((width, height), Image.Resampling.LANCZOS)
        x = index * CELL + (CELL - width) // 2
        y = BASELINE_Y - height
        atlas.alpha_composite(resized, (x, y))
        runtime_bounds.append([x - index * CELL, y, x - index * CELL + width, y + height])
    atlas.save(ASSET_ROOT / str(spec["output"]), optimize=True)
    return {
        **spec,
        "sharedScale": round(scale, 6),
        "sourceSize": list(source.size),
        "runtimeBounds": runtime_bounds,
        "fourCornersTransparent": all(
            atlas.getpixel(point)[3] == 0
            for point in ((0, 0), (atlas.width - 1, 0), (0, atlas.height - 1), (atlas.width - 1, atlas.height - 1))
        ),
    }


def main() -> None:
    records = [build(spec) for spec in SPECS]
    contract = {
        "schemaVersion": 1,
        "layout": {"cell": CELL, "baselineY": BASELINE_Y},
        "assets": records,
    }
    (ASSET_ROOT / "cartoon-boss-animation-contract.json").write_text(
        json.dumps(contract, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(contract, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
