"""Build normalized low-frame animation atlases for the cartoon P0 slice.

Image generation outputs are source strips, not runtime assets. This builder
finds the real connected poses, keeps a shared scale inside each sequence, and
aligns every frame to the same gameplay baseline before publishing it.
"""

from __future__ import annotations

import json
from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT / "output" / "office-chibi-animation-p0-v1"
ASSET_ROOT = ROOT / "Cubicle-Survivor-demo" / "assets" / "cartoon-marker-slice"

CELL = 320
BASELINE_Y = 296
MAX_CONTENT_WIDTH = 302
MAX_CONTENT_HEIGHT = 286
TARGET_REFERENCE_HEIGHT = 262

SPECS = [
    {
        "sequence": "backlog-walk",
        "source": "backlog-walk-alpha-v3.png",
        "output": "backlog-enemy-walk-v3.png",
        "frames": 4,
        "targetReferenceHeight": 260,
        "frameOrder": ["contact-left", "pass-low", "contact-right", "pass-high"],
    },
    {
        "sequence": "backlog-slam",
        "source": "backlog-slam-alpha-v3.png",
        "output": "backlog-enemy-slam-v3.png",
        "frames": 5,
        "targetReferenceHeight": 260,
        "frameOrder": ["anticipate", "compress", "launch", "impact", "recover"],
    },
    {
        "sequence": "email-run",
        "source": "urgent-email-run-alpha-v3.png",
        "output": "urgent-email-run-v3.png",
        "frames": 4,
        "targetReferenceHeight": 262,
        "frameOrder": ["contact-left", "pass-low", "contact-right", "pass-high"],
    },
    {
        "sequence": "email-dash",
        "source": "urgent-email-dash-alpha-v3.png",
        "output": "urgent-email-dash-v3.png",
        "frames": 5,
        "targetReferenceHeight": 262,
        "frameOrder": ["anticipate", "compress", "launch", "extend", "recover"],
    },
    {
        "sequence": "meeting-walk",
        "source": "meeting-walk-alpha-v3.png",
        "output": "meeting-enemy-walk-v3.png",
        "frames": 4,
        "targetReferenceHeight": 260,
        "frameOrder": ["chair-left", "pass-low", "chair-right", "pass-high"],
    },
    {
        "sequence": "meeting-slam",
        "source": "meeting-slam-alpha-v3.png",
        "output": "meeting-enemy-slam-v3.png",
        "frames": 5,
        "targetReferenceHeight": 260,
        "frameOrder": ["brace", "compress", "open", "impact", "recover"],
    },
    {
        "sequence": "ping-float",
        "source": "ping-float-alpha-v3.png",
        "output": "ping-enemy-float-v3.png",
        "frames": 4,
        "targetReferenceHeight": 262,
        "frameOrder": ["hover-left", "dip", "hover-right", "rise"],
    },
    {
        "sequence": "ping-send",
        "source": "ping-send-alpha-v3.png",
        "output": "ping-enemy-send-v3.png",
        "frames": 5,
        "targetReferenceHeight": 262,
        "frameOrder": ["gather", "compress", "charge", "release", "recover"],
    },
    {
        "sequence": "deadline-run",
        "source": "deadline-run-alpha-v3.png",
        "output": "deadline-enemy-run-v3.png",
        "frames": 4,
        "targetReferenceHeight": 262,
        "frameOrder": ["contact-left", "pass-low", "contact-right", "airborne"],
    },
    {
        "sequence": "deadline-charge",
        "source": "deadline-charge-alpha-v3.png",
        "output": "deadline-enemy-charge-v3.png",
        "frames": 5,
        "targetReferenceHeight": 262,
        "frameOrder": ["ring", "compress", "launch", "dash", "brake"],
    },
    {
        "sequence": "scope-run",
        "source": "scope-run-alpha-v3.png",
        "output": "scope-enemy-run-v3.png",
        "frames": 4,
        "targetReferenceHeight": 262,
        "frameOrder": ["contact-left", "pass-low", "contact-right", "airborne"],
    },
    {
        "sequence": "scope-split",
        "source": "scope-split-alpha-v3.png",
        "output": "scope-enemy-split-v3.png",
        "frames": 5,
        "targetReferenceHeight": 262,
        "frameOrder": ["swell", "compress", "tear-open", "release", "recover"],
    },
    {
        "sequence": "approval-walk",
        "source": "approval-walk-alpha-v3.png",
        "output": "approval-enemy-walk-v3.png",
        "frames": 4,
        "targetReferenceHeight": 262,
        "frameOrder": ["shield-contact", "pass-low", "opposite-contact", "pass-high"],
    },
    {
        "sequence": "approval-guard",
        "source": "approval-guard-alpha-v3.png",
        "output": "approval-enemy-guard-v3.png",
        "frames": 5,
        "targetReferenceHeight": 262,
        "frameOrder": ["raise", "brace", "impact", "break", "vulnerable-recover"],
    },
    {
        "sequence": "client-run",
        "source": "client-run-alpha-v3.png",
        "output": "client-enemy-run-v3.png",
        "frames": 4,
        "targetReferenceHeight": 262,
        "frameOrder": ["contact-left", "pass-low", "contact-right", "airborne"],
    },
    {
        "sequence": "client-call",
        "source": "client-call-alpha-v3.png",
        "output": "client-enemy-call-v3.png",
        "frames": 5,
        "targetReferenceHeight": 262,
        "frameOrder": ["dial", "listen-compress", "bubble-swell", "double-release", "recover"],
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


def split_connected_poses(image: Image.Image, frame_count: int) -> list[Image.Image]:
    """Assign artwork by pose center instead of assuming equal-width source cells."""
    components = connected_components(image)
    if len(components) < frame_count:
        raise RuntimeError(f"source contains {len(components)} components, expected {frame_count} poses")
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

    width, height = image.size
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


def build_atlas(spec: dict[str, object]) -> dict[str, object]:
    source_path = SOURCE_ROOT / str(spec["source"])
    source = Image.open(source_path).convert("RGBA")
    frame_count = int(spec["frames"])
    frames = split_connected_poses(source, frame_count)

    target_reference_height = int(spec.get("targetReferenceHeight", TARGET_REFERENCE_HEIGHT))
    scale = target_reference_height / frames[0].height
    scale *= min(
        1,
        MAX_CONTENT_WIDTH / max(frame.width * scale for frame in frames),
        MAX_CONTENT_HEIGHT / max(frame.height * scale for frame in frames),
    )
    atlas = Image.new("RGBA", (CELL * frame_count, CELL), (0, 0, 0, 0))
    runtime_bounds: list[list[int]] = []
    for index, frame in enumerate(frames):
        width = max(1, round(frame.width * scale))
        height = max(1, round(frame.height * scale))
        resized = frame.resize((width, height), Image.Resampling.LANCZOS)
        x = index * CELL + (CELL - width) // 2
        y = BASELINE_Y - height
        atlas.alpha_composite(resized, (x, y))
        runtime_bounds.append([x - index * CELL, y, x - index * CELL + width, y + height])

    output_path = ASSET_ROOT / str(spec["output"])
    output_path.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(output_path, optimize=True)
    return {
        "sequence": spec["sequence"],
        "file": spec["output"],
        "source": spec["source"],
        "frames": frame_count,
        "frameOrder": spec["frameOrder"],
        "sourceSize": [source.width, source.height],
        "sharedScale": round(scale, 6),
        "runtimeBounds": runtime_bounds,
        "fourCornersTransparent": all(
            atlas.getpixel(point)[3] == 0
            for point in ((0, 0), (atlas.width - 1, 0), (0, atlas.height - 1), (atlas.width - 1, atlas.height - 1))
        ),
    }


def main() -> None:
    records = [build_atlas(spec) for spec in SPECS]
    contract = {
        "schemaVersion": 1,
        "cellWidth": CELL,
        "cellHeight": CELL,
        "baselineY": BASELINE_Y,
        "assets": records,
    }
    contract_path = ASSET_ROOT / "office-chibi-animation-contract.json"
    contract_path.write_text(json.dumps(contract, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(contract, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
