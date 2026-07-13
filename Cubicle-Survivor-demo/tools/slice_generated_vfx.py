from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "generated-vfx" / "demo-v1-combat-vfx-atlas.png"
OUTPUT = ROOT / "assets" / "generated-vfx" / "sprites"

NAMES = [
    "marker-beam", "marker-branch", "marker-impact", "marker-grid",
    "thermos-steam", "thermos-charge", "thermos-release", "thermos-wave",
    "sticky-trap", "sticky-seek", "sticky-burst", "sticky-control",
    "status-shield", "status-root", "status-mark", "enemy-projectile",
]


def main() -> None:
    image = Image.open(SOURCE).convert("RGBA")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    width, height = image.size
    for index, name in enumerate(NAMES):
        column = index % 4
        row = index // 4
        cell = image.crop((
            round(column * width / 4),
            round(row * height / 4),
            round((column + 1) * width / 4),
            round((row + 1) * height / 4),
        ))
        box = cell.getchannel("A").getbbox()
        if not box:
            raise RuntimeError(f"{name}: empty alpha coverage")
        sprite = cell.crop(box)
        padded = Image.new("RGBA", (sprite.width + 16, sprite.height + 16))
        padded.alpha_composite(sprite, (8, 8))
        if any([
            padded.getpixel((0, 0))[3],
            padded.getpixel((padded.width - 1, 0))[3],
            padded.getpixel((0, padded.height - 1))[3],
            padded.getpixel((padded.width - 1, padded.height - 1))[3],
        ]):
            raise RuntimeError(f"{name}: transparent corner validation failed")
        padded.save(OUTPUT / f"{name}.png", optimize=True)
        print(f"{name}: {padded.width}x{padded.height}")


if __name__ == "__main__":
    main()
