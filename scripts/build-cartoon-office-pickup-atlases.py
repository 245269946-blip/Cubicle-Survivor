"""Build runtime-ready four-frame office pickup atlases.

ImageGen sources deliberately remain outside the runtime asset folder. The alpha
sources are split by connected artwork, scaled with one identity-preserving scale,
and aligned to a shared gameplay baseline before entering the runnable package.
"""

from __future__ import annotations

import hashlib
import json
from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PACKAGE_ROOT = ROOT / "Cubicle-Survivor-demo"
SOURCE_ROOT = PACKAGE_ROOT / "output" / "cartoon-office-pickups-v1"
ASSET_ROOT = PACKAGE_ROOT / "assets" / "cartoon-office-pickups"

CELL_WIDTH = 320
CELL_HEIGHT = 320
FRAME_COUNT = 4
BASELINE_Y = 286
TARGET_REFERENCE_HEIGHT = 228
MAX_CONTENT_WIDTH = 284
MAX_CONTENT_HEIGHT = 270
FRAME_ORDER = ["rest", "lift", "glint", "settle"]

SPECS = [
    {
        "type": "xp",
        "source": "xp-pickup-alpha-v1.png",
        "output": "xp-pickup-idle-v1.png",
        "runtimeHeight": 34,
        "identity": "cyan training memo with faceted star badge",
    },
    {
        "type": "material",
        "source": "material-pickup-alpha-v1.png",
        "output": "material-pickup-idle-v1.png",
        "runtimeHeight": 36,
        "identity": "amber supply envelope with paperclip and cog seal",
    },
    {
        "type": "heal",
        "source": "heal-pickup-alpha-v1.png",
        "output": "heal-pickup-idle-v1.png",
        "runtimeHeight": 38,
        "identity": "coral first-aid tea pouch with heart bandage",
    },
]


def file_sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def alpha_bounds(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A")
    bounds = alpha.point(lambda value: 255 if value > 8 else 0).getbbox()
    if not bounds:
        raise RuntimeError("empty alpha frame")
    return bounds


def split_connected_poses(image: Image.Image) -> list[Image.Image]:
    """Extract four poses and attach loose glints/tags to the nearest pose."""
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
            neighbors: list[int] = []
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
        raise RuntimeError("pickup source does not contain four connected poses")
    anchors = sorted(
        sorted(components, key=lambda item: int(item["area"]), reverse=True)[:FRAME_COUNT],
        key=lambda item: float(item["centerX"]),
    )
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
        poses.append(pose.crop(alpha_bounds(pose)))
    return poses


def visible_green_pixels(image: Image.Image) -> int:
    count = 0
    values = image.get_flattened_data() if hasattr(image, "get_flattened_data") else image.getdata()
    for red, green, blue, alpha in values:
        if alpha > 8 and green > 110 and green > red * 1.28 and green > blue * 1.28:
            count += 1
    return count


def clear_chroma_residue(image: Image.Image) -> None:
    """Remove the last resampling-sized flecks of unmistakable key green."""
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, alpha = pixels[x, y]
            if alpha > 0 and green > 110 and green > red * 1.28 and green > blue * 1.28:
                pixels[x, y] = (0, 0, 0, 0)


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
    alpha_coverage: list[float] = []
    for index, frame in enumerate(frames):
        width = max(1, round(frame.width * shared_scale))
        height = max(1, round(frame.height * shared_scale))
        resized = frame.resize((width, height), Image.Resampling.LANCZOS)
        x = index * CELL_WIDTH + (CELL_WIDTH - width) // 2
        y = BASELINE_Y - height
        atlas.alpha_composite(resized, (x, y))
        runtime_bounds.append([x - index * CELL_WIDTH, y, x - index * CELL_WIDTH + width, y + height])
        alpha = resized.getchannel("A")
        alpha_values = alpha.get_flattened_data() if hasattr(alpha, "get_flattened_data") else alpha.getdata()
        alpha_coverage.append(round(sum(1 for value in alpha_values if value > 8) / (CELL_WIDTH * CELL_HEIGHT), 6))

    output_path = ASSET_ROOT / str(spec["output"])
    output_path.parent.mkdir(parents=True, exist_ok=True)
    clear_chroma_residue(atlas)
    atlas.save(output_path, optimize=True)
    corners = [
        atlas.getpixel((0, 0))[3],
        atlas.getpixel((atlas.width - 1, 0))[3],
        atlas.getpixel((0, atlas.height - 1))[3],
        atlas.getpixel((atlas.width - 1, atlas.height - 1))[3],
    ]
    green_pixels = visible_green_pixels(atlas)
    if green_pixels:
        raise RuntimeError(f"{spec['type']} atlas retains {green_pixels} visible green pixels")

    return {
        "type": spec["type"],
        "identity": spec["identity"],
        "file": spec["output"],
        "source": spec["source"],
        "sourceSha256": file_sha256(source_path),
        "assetSha256": file_sha256(output_path),
        "runtimeHeight": spec["runtimeHeight"],
        "referenceHeight": TARGET_REFERENCE_HEIGHT,
        "sharedScale": round(shared_scale, 6),
        "sourceSize": [image.width, image.height],
        "sourceBounds": source_bounds,
        "runtimeBounds": runtime_bounds,
        "frameAlphaCoverage": alpha_coverage,
        "fourCornersTransparent": all(value == 0 for value in corners),
        "visibleGreenPixels": green_pixels,
    }


def main() -> None:
    records = [build_atlas(spec) for spec in SPECS]
    contract = {
        "schemaVersion": 1,
        "family": "formal-cartoon-office-pickups-v1",
        "layout": {
            "columns": FRAME_COUNT,
            "rows": 1,
            "cellWidth": CELL_WIDTH,
            "cellHeight": CELL_HEIGHT,
            "width": CELL_WIDTH * FRAME_COUNT,
            "height": CELL_HEIGHT,
            "baselineY": BASELINE_Y,
            "referenceHeight": TARGET_REFERENCE_HEIGHT,
            "frameOrder": FRAME_ORDER,
        },
        "assets": records,
    }
    contract_path = ASSET_ROOT / "cartoon-office-pickup-contract.json"
    contract_path.write_text(json.dumps(contract, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(contract, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
