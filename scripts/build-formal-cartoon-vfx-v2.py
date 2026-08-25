from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DEMO = ROOT / "Cubicle-Survivor-demo"
SOURCE_DIR = DEMO / "output" / "cartoon-office-vfx-v2"
ASSET_DIR = DEMO / "assets" / "cartoon-office-vfx"
FAMILIES = ("marker", "thermos", "scissors", "correction")
VERSIONS = {"marker": 2, "thermos": 2, "scissors": 3, "correction": 2}

COLS = 4
ROWS = 2
CELL = 256
INNER = 232


def alpha_bbox(image: Image.Image):
    alpha = image.getchannel("A")
    return alpha.getbbox()


def normalize_cell(source: Image.Image) -> Image.Image:
    bbox = alpha_bbox(source)
    if not bbox:
        raise ValueError("empty generated VFX cell")
    left, top, right, bottom = bbox
    margin = 4
    left = max(0, left - margin)
    top = max(0, top - margin)
    right = min(source.width, right + margin)
    bottom = min(source.height, bottom + margin)
    content = source.crop((left, top, right, bottom))
    scale = min(INNER / content.width, INNER / content.height)
    size = (
        max(1, round(content.width * scale)),
        max(1, round(content.height * scale)),
    )
    content = content.resize(size, Image.Resampling.LANCZOS)
    cell = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
    cell.alpha_composite(content, ((CELL - size[0]) // 2, (CELL - size[1]) // 2))
    return cell


def build_family(family: str) -> Path:
    version = VERSIONS[family]
    source_path = SOURCE_DIR / f"{family}-vfx-alpha-v{version}.png"
    output_path = ASSET_DIR / f"{family}-vfx-v{version}.png"
    source = Image.open(source_path).convert("RGBA")
    source_cell_width = source.width // COLS
    source_cell_height = source.height // ROWS
    atlas = Image.new("RGBA", (COLS * CELL, ROWS * CELL), (0, 0, 0, 0))
    for row in range(ROWS):
        for column in range(COLS):
            crop = source.crop((
                column * source_cell_width,
                row * source_cell_height,
                (column + 1) * source_cell_width,
                (row + 1) * source_cell_height,
            ))
            atlas.alpha_composite(normalize_cell(crop), (column * CELL, row * CELL))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(output_path, optimize=True)
    return output_path


if __name__ == "__main__":
    for item in FAMILIES:
        print(build_family(item))
