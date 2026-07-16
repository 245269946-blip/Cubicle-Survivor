from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "generated-ui" / "demo-v1-ui-atlas.png"
OUTPUT = ROOT / "assets" / "generated-ui" / "slices"

NAMES = [
    "frame-weapon", "frame-badge", "frame-slot", "frame-shop",
    "button-primary", "button-secondary", "hud-objective", "banner-stage",
    "meter-health", "meter-xp", "meter-heat", "meter-shield",
    "panel-pause", "panel-result", "frame-tooltip", "chip-roadmap",
]


def main() -> None:
    image = Image.open(SOURCE).convert("RGBA")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    width, height = image.size
    for index, name in enumerate(NAMES):
        column = index % 4
        row = index // 4
        left = round(column * width / 4)
        top = round(row * height / 4)
        right = round((column + 1) * width / 4)
        bottom = round((row + 1) * height / 4)
        cell = image.crop((left, top, right, bottom))
        alpha_box = cell.getchannel("A").getbbox()
        if not alpha_box:
            raise RuntimeError(f"{name}: empty alpha coverage")
        sprite = cell.crop(alpha_box)
        padded = Image.new("RGBA", (sprite.width + 12, sprite.height + 12))
        padded.alpha_composite(sprite, (6, 6))
        corners = [
            padded.getpixel((0, 0))[3],
            padded.getpixel((padded.width - 1, 0))[3],
            padded.getpixel((0, padded.height - 1))[3],
            padded.getpixel((padded.width - 1, padded.height - 1))[3],
        ]
        if any(corners):
            raise RuntimeError(f"{name}: corner transparency failed: {corners}")
        padded.save(OUTPUT / f"{name}.png", optimize=True)
        print(f"{name}: {padded.width}x{padded.height}")


if __name__ == "__main__":
    main()
