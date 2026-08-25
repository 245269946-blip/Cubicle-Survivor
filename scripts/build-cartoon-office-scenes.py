from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageFilter, ImageStat


ROOT = Path(__file__).resolve().parents[1]
PACKAGE = ROOT / "Cubicle-Survivor-demo"
SOURCE_DIR = PACKAGE / "output" / "cartoon-office-scenes-v1"
ASSET_DIR = PACKAGE / "assets" / "cartoon-office-scenes"
WORLD_SIZE = (2600, 1800)
TARGET_ASPECT = WORLD_SIZE[0] / WORLD_SIZE[1]

SCENES = (
    (1, "morning", "office-phase-1-morning-source.png"),
    (2, "midday", "office-phase-2-midday-source.png"),
    (3, "afternoon", "office-phase-3-afternoon-source.png"),
    (4, "evening", "office-phase-4-evening-source.png"),
    (5, "night", "office-phase-5-night-source.png"),
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def center_crop_to_aspect(image: Image.Image, aspect: float) -> Image.Image:
    width, height = image.size
    current = width / height
    if abs(current - aspect) < 1e-9:
        return image
    if current > aspect:
        crop_width = round(height * aspect)
        left = (width - crop_width) // 2
        return image.crop((left, 0, left + crop_width, height))
    crop_height = round(width / aspect)
    top = (height - crop_height) // 2
    return image.crop((0, top, width, top + crop_height))


def center_metrics(image: Image.Image) -> dict[str, float]:
    width, height = image.size
    center = image.crop((round(width * 0.18), round(height * 0.18), round(width * 0.82), round(height * 0.82)))
    gray = center.convert("L")
    edges = gray.filter(ImageFilter.FIND_EDGES)
    gray_stat = ImageStat.Stat(gray)
    edge_stat = ImageStat.Stat(edges)
    return {
        "meanLuma": round(gray_stat.mean[0], 3),
        "lumaStdDev": round(gray_stat.stddev[0], 3),
        "edgeMean": round(edge_stat.mean[0], 3),
    }


def main() -> None:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    records = []
    for phase, key, source_name in SCENES:
        source_path = SOURCE_DIR / source_name
        if not source_path.exists():
            raise FileNotFoundError(source_path)
        with Image.open(source_path) as opened:
            image = opened.convert("RGB")
        if abs(image.width / image.height - TARGET_ASPECT) > 0.01:
            raise ValueError(f"{source_name}: source aspect is not close to 13:9")
        cropped = center_crop_to_aspect(image, TARGET_ASPECT)
        final = cropped.resize(WORLD_SIZE, Image.Resampling.LANCZOS)
        output_name = f"office-phase-{phase}-{key}-v1.webp"
        output_path = ASSET_DIR / output_name
        final.save(output_path, "WEBP", quality=90, method=6)
        metrics = center_metrics(final)
        if metrics["edgeMean"] > 8.0 or metrics["lumaStdDev"] > 32.0:
            raise ValueError(f"{output_name}: central combat field is too visually busy: {metrics}")
        if not 82 <= metrics["meanLuma"] <= 236:
            raise ValueError(f"{output_name}: central combat field is outside the readable luminance range: {metrics}")
        records.append({
            "phase": phase,
            "key": key,
            "source": str(source_path.relative_to(PACKAGE)).replace("\\", "/"),
            "sourceSize": [image.width, image.height],
            "sourceSha256": sha256(source_path),
            "asset": str(output_path.relative_to(PACKAGE)).replace("\\", "/"),
            "assetSize": list(WORLD_SIZE),
            "assetSha256": sha256(output_path),
            "centerMetrics": metrics,
        })

    completion_source = SOURCE_DIR / "completion-check-source.png"
    if not completion_source.exists():
        raise FileNotFoundError(completion_source)
    with Image.open(completion_source) as opened:
        completion = opened.convert("RGBA")
    alpha_bbox = completion.getchannel("A").getbbox()
    if not alpha_bbox:
        raise ValueError("completion-check-source.png has no visible alpha content")
    completion = completion.crop(alpha_bbox)
    completion.thumbnail((224, 224), Image.Resampling.LANCZOS)
    completion_final = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    completion_final.alpha_composite(completion, ((256 - completion.width) // 2, (256 - completion.height) // 2))
    completion_output = ASSET_DIR / "completion-check-v1.png"
    completion_final.save(completion_output, "PNG", optimize=True)
    corner_alpha = [completion_final.getpixel(point)[3] for point in ((0, 0), (255, 0), (0, 255), (255, 255))]
    if any(corner_alpha):
        raise ValueError("completion-check-v1.png must keep transparent corners")

    contract = {
        "version": 1,
        "runtimeGate": "Demo V3.15 formalCartoonScenePass",
        "worldSize": list(WORLD_SIZE),
        "worldAspect": "13:9",
        "cameraSize": [1280, 720],
        "centralCombatField": {
            "normalizedBounds": [0.18, 0.18, 0.82, 0.82],
            "requirements": [
                "continuous walkable floor",
                "no authored characters, enemies, weapons, pickups, projectiles, labels or UI",
                "no high-contrast focal prop",
                "edgeMean <= 8.0",
                "lumaStdDev <= 32.0",
                "82 <= meanLuma <= 236",
            ],
        },
        "phaseMapping": {
            "1": "morning onboarding",
            "2": "midday badge definition",
            "3": "late-afternoon independent delivery",
            "4": "blue-hour cross-department collaboration",
            "5": "late-night final review",
        },
        "completionFeedback": {
            "source": str(completion_source.relative_to(PACKAGE)).replace("\\", "/"),
            "sourceSha256": sha256(completion_source),
            "asset": str(completion_output.relative_to(PACKAGE)).replace("\\", "/"),
            "assetSize": [256, 256],
            "assetSha256": sha256(completion_output),
            "durationSeconds": 0.82,
            "intent": "confirm the encounter has been settled without adding text or changing combat rules",
        },
        "scenes": records,
    }
    contract_path = ASSET_DIR / "cartoon-office-scene-contract.json"
    contract_path.write_text(json.dumps(contract, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(contract, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
