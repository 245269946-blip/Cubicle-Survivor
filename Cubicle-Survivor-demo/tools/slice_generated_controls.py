from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "generated-ui" / "demo-v1-ui-controls-atlas.png"
OUTPUT = ROOT / "assets" / "generated-ui" / "controls"

NAMES = [
    "button-primary-wide", "button-secondary-wide", "button-danger-wide", "button-disabled-wide",
    "chip-stat", "pill-material", "chip-category", "chip-status",
    "strip-form", "strip-objective", "strip-phase", "strip-build",
    "placard-shop", "placard-upgrade", "placard-slot", "placard-pause",
]


def main() -> None:
    image = Image.open(SOURCE).convert("RGBA")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    width, height = image.size
    # The generated atlas is a visual 4x4 grid, but its rows are intentionally
    # different heights (buttons, chips, strips, placards). Use the empty
    # chroma gaps rather than equal-height quarters so neighboring art never
    # leaks into a slice.
    row_bounds = [(0, 365), (365, 635), (635, 870), (870, height)]
    for index, name in enumerate(NAMES):
        column = index % 4
        row = index // 4
        top, bottom = row_bounds[row]
        cell = image.crop((
            round(column * width / 4),
            top,
            round((column + 1) * width / 4),
            bottom,
        ))
        alpha_box = cell.getchannel("A").getbbox()
        if not alpha_box:
            raise RuntimeError(f"{name}: empty alpha coverage")
        sprite = cell.crop(alpha_box)
        padded = Image.new("RGBA", (sprite.width + 12, sprite.height + 12))
        padded.alpha_composite(sprite, (6, 6))
        corners = (
            padded.getpixel((0, 0))[3],
            padded.getpixel((padded.width - 1, 0))[3],
            padded.getpixel((0, padded.height - 1))[3],
            padded.getpixel((padded.width - 1, padded.height - 1))[3],
        )
        if any(corners):
            raise RuntimeError(f"{name}: corner transparency failed: {corners}")
        target = OUTPUT / f"{name}.png"
        padded.save(target, optimize=True)
        print(f"{name}: {padded.width}x{padded.height}")


if __name__ == "__main__":
    main()
