"""Normalize generated enemy action strips into runtime sprite atlases.

The ImageGen outputs are production sources, not runtime assets. This builder removes
their layout padding, preserves one shared scale per enemy, and aligns every pose to
one gameplay baseline before the files enter the runnable package.
"""

from __future__ import annotations

import json
from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT / "output" / "cartoon-enemy-actions-v2"
ASSET_ROOT = ROOT / "Cubicle-Survivor-demo" / "assets" / "cartoon-marker-slice"

CELL_WIDTH = 320
CELL_HEIGHT = 320
FRAME_COUNT = 4
BASELINE_Y = 296
TARGET_REFERENCE_HEIGHT = 260
MAX_CONTENT_WIDTH = 296
MAX_CONTENT_HEIGHT = 284
FRAME_ORDER = ["move", "attack", "hit", "defeat"]

SPECS = [
    {
        "enemy": "backlog",
        "source": "backlog-enemy-actions-v2-alpha.png",
        "output": "backlog-enemy-actions-v2.png",
        "runtimeHeight": 100,
    },
    {
        "enemy": "email",
        "source": "urgent-email-enemy-actions-v2-alpha.png",
        "output": "urgent-email-enemy-actions-v2.png",
        "runtimeHeight": 88,
    },
    {
        "enemy": "meeting",
        "source": "meeting-enemy-actions-v3-alpha.png",
        "output": "meeting-enemy-actions-v3.png",
        "runtimeHeight": 112,
    },
    {
        "enemy": "ping",
        "source": "ping-enemy-actions-v3-alpha.png",
        "output": "ping-enemy-actions-v3.png",
        "runtimeHeight": 84,
    },
    {
        "enemy": "deadline",
        "source": "deadline-enemy-actions-v3-alpha.png",
        "output": "deadline-enemy-actions-v3.png",
        "runtimeHeight": 90,
    },
    {
        "enemy": "scope",
        "source": "scope-enemy-actions-v3-alpha.png",
        "output": "scope-enemy-actions-v3.png",
        "runtimeHeight": 94,
    },
    {
        "enemy": "approval",
        "source": "approval-enemy-actions-v3-alpha.png",
        "output": "approval-enemy-actions-v3.png",
        "runtimeHeight": 100,
    },
    {
        "enemy": "client",
        "source": "client-enemy-actions-v3-alpha.png",
        "output": "client-enemy-actions-v3.png",
        "runtimeHeight": 92,
    },
]


def alpha_bounds(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A")
    bounds = alpha.point(lambda value: 255 if value > 8 else 0).getbbox()
    if not bounds:
        raise RuntimeError("empty alpha frame")
    return bounds


def split_connected_poses(image: Image.Image) -> list[Image.Image]:
    """Split four poses by connected artwork, not by assumed equal-width cells.

    Image models often place a hand or shoe across a nominal cell boundary. A hard
    25/50/75% crop silently amputates those parts, so the four largest connected
    silhouettes establish the pose identities and smaller accents join the nearest
    silhouette by horizontal center.
    """
    width, height = image.size
    alpha = image.getchannel("A")
    alpha_values = alpha.get_flattened_data() if hasattr(alpha, "get_flattened_data") else alpha.getdata()
    active = bytearray(1 if value > 8 else 0 for value in alpha_values)
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
            neighbors = []
            if x > 0:
                neighbors.append(current - 1)
            if x + 1 < width:
                neighbors.append(current + 1)
            if y > 0:
                neighbors.append(current - width)
            if y + 1 < height:
                neighbors.append(current + width)
            for neighbor in neighbors:
                if active[neighbor]:
                    active[neighbor] = 0
                    queue.append(neighbor)
        if len(pixels) >= 8:
            components.append({"pixels": pixels, "area": len(pixels), "centerX": sum_x / len(pixels)})

    if len(components) < FRAME_COUNT:
        raise RuntimeError("action source does not contain four connected poses")
    anchors = sorted(sorted(components, key=lambda item: int(item["area"]), reverse=True)[:FRAME_COUNT],
                     key=lambda item: float(item["centerX"]))
    groups: list[list[int]] = [[] for _ in range(FRAME_COUNT)]
    for component in components:
        center_x = float(component["centerX"])
        owner = min(range(FRAME_COUNT), key=lambda index: abs(center_x - float(anchors[index]["centerX"])))
        groups[owner].extend(component["pixels"])

    source_pixels = image.load()
    poses: list[Image.Image] = []
    for indices in groups:
        pose = Image.new("RGBA", image.size, (0, 0, 0, 0))
        pose_pixels = pose.load()
        for flat_index in indices:
            y, x = divmod(flat_index, width)
            pose_pixels[x, y] = source_pixels[x, y]
        bounds = alpha_bounds(pose)
        poses.append(pose.crop(bounds))
    return poses


def build_atlas(spec: dict[str, object]) -> dict[str, object]:
    source_path = SOURCE_ROOT / str(spec["source"])
    image = Image.open(source_path).convert("RGBA")
    frames = split_connected_poses(image)
    source_bounds = [list(alpha_bounds(frame)) for frame in frames]

    shared_scale = TARGET_REFERENCE_HEIGHT / frames[0].height
    max_scaled_width = max(frame.width * shared_scale for frame in frames)
    max_scaled_height = max(frame.height * shared_scale for frame in frames)
    shared_scale *= min(1, MAX_CONTENT_WIDTH / max_scaled_width, MAX_CONTENT_HEIGHT / max_scaled_height)

    atlas = Image.new("RGBA", (CELL_WIDTH * FRAME_COUNT, CELL_HEIGHT), (0, 0, 0, 0))
    runtime_bounds: list[list[int]] = []
    for index, frame in enumerate(frames):
        width = max(1, round(frame.width * shared_scale))
        height = max(1, round(frame.height * shared_scale))
        resized = frame.resize((width, height), Image.Resampling.LANCZOS)
        x = index * CELL_WIDTH + (CELL_WIDTH - width) // 2
        y = BASELINE_Y - height
        atlas.alpha_composite(resized, (x, y))
        runtime_bounds.append([x - index * CELL_WIDTH, y, x - index * CELL_WIDTH + width, y + height])

    output_path = ASSET_ROOT / str(spec["output"])
    output_path.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(output_path, optimize=True)

    corners = [atlas.getpixel((0, 0))[3], atlas.getpixel((atlas.width - 1, 0))[3],
               atlas.getpixel((0, atlas.height - 1))[3], atlas.getpixel((atlas.width - 1, atlas.height - 1))[3]]
    return {
        "enemy": spec["enemy"],
        "file": spec["output"],
        "source": spec["source"],
        "runtimeHeight": spec["runtimeHeight"],
        "sharedScale": round(shared_scale, 6),
        "sourceWidth": image.width,
        "sourceHeight": image.height,
        "sourceBounds": source_bounds,
        "runtimeBounds": runtime_bounds,
        "fourCornersTransparent": all(value == 0 for value in corners),
    }


def main() -> None:
    records = [build_atlas(spec) for spec in SPECS]
    contract = {
        "schemaVersion": 1,
        "layout": {
            "columns": FRAME_COUNT,
            "rows": 1,
            "cellWidth": CELL_WIDTH,
            "cellHeight": CELL_HEIGHT,
            "width": CELL_WIDTH * FRAME_COUNT,
            "height": CELL_HEIGHT,
            "baselineY": BASELINE_Y,
            "frameOrder": FRAME_ORDER,
        },
        "assets": records,
    }
    contract_path = ASSET_ROOT / "enemy-action-atlas-contract.json"
    contract_path.write_text(json.dumps(contract, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(contract, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
