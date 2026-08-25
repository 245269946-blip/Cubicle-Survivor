#!/usr/bin/env python3
"""Build deterministic wearable-layer atlases for the shared cartoon worker.

The generated PNGs share the 420x620 cell, 3-phase column and 4-direction row
contract declared by the neutral worker atlas.  They intentionally contain no
body pixels so every weapon can reuse one authoritative character skeleton.
"""

from pathlib import Path
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "Cubicle-Survivor-demo" / "assets" / "cartoon-character-system"
CELL_W = 420
CELL_H = 620
SCALE = 4
DIRECTIONS = ("down", "right", "up", "left")
PHASES = ("idle", "step-a", "step-b")

INK = "#172235"
INK_SOFT = "#26364b"
PANEL = "#f5f2e9"
PANEL_SHADE = "#cfd6db"
CYAN = "#12ccea"
CYAN_DARK = "#087f9b"
YELLOW = "#ffd528"
YELLOW_DARK = "#b77d00"
ORANGE = "#ff9d24"
ORANGE_DARK = "#b84c12"
PINK = "#ff58c8"
PINK_DARK = "#9d247d"
WHITE_FLUID = "#f4ffffdf"


def box(values):
    return tuple(round(value * SCALE) for value in values)


def point(values):
    return tuple(round(value * SCALE) for value in values)


def rounded(draw, values, radius, fill, outline=INK, width=5):
    draw.rounded_rectangle(
        box(values),
        radius=round(radius * SCALE),
        fill=fill,
        outline=outline,
        width=round(width * SCALE),
    )


def ellipse(draw, values, fill, outline=INK, width=5):
    draw.ellipse(box(values), fill=fill, outline=outline, width=round(width * SCALE))


def line(draw, values, fill=INK, width=8, joint="curve"):
    draw.line([point(value) for value in values], fill=fill, width=round(width * SCALE), joint=joint)


def polygon(draw, values, fill, outline=INK, width=5):
    pts = [point(value) for value in values]
    draw.polygon(pts, fill=fill)
    draw.line(pts + [pts[0]], fill=outline, width=round(width * SCALE), joint="curve")


def new_frame():
    return Image.new("RGBA", (CELL_W * SCALE, CELL_H * SCALE), (0, 0, 0, 0))


def draw_canister(draw, x, y, color, dark, height=92, width=36):
    rounded(draw, (x, y, x + width, y + height), 12, INK_SOFT, INK, 5)
    rounded(draw, (x + 6, y + 14, x + width - 6, y + height - 12), 7, color, dark, 3)
    rounded(draw, (x + 10, y + 20, x + 15, y + height - 20), 3, "#ffffff88", None, 0)
    ellipse(draw, (x + 6, y - 5, x + width - 6, y + 15), INK_SOFT, INK, 4)
    ellipse(draw, (x + 11, y, x + width - 11, y + 10), "#718095", None, 0)


def draw_pressure_tank(draw, x, y, color, dark, height=126, width=48):
    rounded(draw, (x, y, x + width, y + height), 17, INK_SOFT, INK, 6)
    rounded(draw, (x + 7, y + 18, x + width - 7, y + height - 16), 12, color, dark, 4)
    rounded(draw, (x + 13, y + 25, x + 20, y + height - 28), 4, "#ffffff70", None, 0)
    rounded(draw, (x + 10, y - 8, x + width - 10, y + 20), 7, PANEL_SHADE, INK, 5)


def draw_gauge(draw, cx, cy, accent):
    ellipse(draw, (cx - 17, cy - 17, cx + 17, cy + 17), PANEL, INK, 5)
    ellipse(draw, (cx - 10, cy - 10, cx + 10, cy + 10), "#e8edf0", None, 0)
    line(draw, ((cx, cy), (cx + 7, cy - 6)), accent, 3)
    ellipse(draw, (cx - 3, cy - 3, cx + 3, cy + 3), accent, None, 0)


def draw_marker_back(direction, phase_index):
    image = new_frame()
    draw = ImageDraw.Draw(image, "RGBA")
    dx = (0, -2, 2)[phase_index]
    dy = (0, 2, 1)[phase_index]

    if direction == "down":
        rounded(draw, (103 + dx, 226 + dy, 142 + dx, 355 + dy), 15, INK_SOFT, INK, 5)
        rounded(draw, (278 + dx, 226 + dy, 317 + dx, 355 + dy), 15, INK_SOFT, INK, 5)
        draw_canister(draw, 101 + dx, 274 + dy, YELLOW, YELLOW_DARK, 82, 31)
        draw_canister(draw, 288 + dx, 274 + dy, CYAN, CYAN_DARK, 82, 31)
        line(draw, ((129 + dx, 338 + dy), (148 + dx, 369 + dy)), INK, 7)
        line(draw, ((291 + dx, 338 + dy), (272 + dx, 369 + dy)), INK, 7)
    elif direction == "up":
        rounded(draw, (120 + dx, 218 + dy, 300 + dx, 391 + dy), 26, INK_SOFT, INK, 6)
    elif direction == "left":
        rounded(draw, (231 + dx, 218 + dy, 343 + dx, 395 + dy), 23, PANEL_SHADE, INK, 6)
        polygon(draw, ((244 + dx, 217 + dy), (310 + dx, 202 + dy), (345 + dx, 234 + dy), (335 + dx, 274 + dy), (242 + dx, 276 + dy)), PANEL, INK, 5)
        rounded(draw, (247 + dx, 271 + dy, 342 + dx, 382 + dy), 13, INK_SOFT, INK, 5)
        draw_canister(draw, 303 + dx, 281 + dy, CYAN, CYAN_DARK, 99, 35)
        draw_canister(draw, 343 + dx, 281 + dy, YELLOW, YELLOW_DARK, 99, 35)
        line(draw, ((250 + dx, 262 + dy), (272 + dx, 249 + dy), (297 + dx, 247 + dy)), CYAN_DARK, 5)
    else:
        raise ValueError(direction)

    return image


def draw_marker_front(direction, phase_index):
    image = new_frame()
    draw = ImageDraw.Draw(image, "RGBA")
    dx = (0, -2, 2)[phase_index]
    dy = (0, 2, 1)[phase_index]

    if direction == "down":
        line(draw, ((148 + dx, 225 + dy), (156 + dx, 282 + dy), (163 + dx, 343 + dy)), INK, 14)
        line(draw, ((272 + dx, 225 + dy), (264 + dx, 282 + dy), (257 + dx, 343 + dy)), INK, 14)
        rounded(draw, (145 + dx, 252 + dy, 164 + dx, 283 + dy), 5, CYAN, CYAN_DARK, 3)
        rounded(draw, (256 + dx, 252 + dy, 275 + dx, 283 + dy), 5, CYAN, CYAN_DARK, 3)
        line(draw, ((158 + dx, 340 + dy), (181 + dx, 364 + dy)), INK_SOFT, 7)
        line(draw, ((262 + dx, 340 + dy), (239 + dx, 364 + dy)), INK_SOFT, 7)
    elif direction == "up":
        rounded(draw, (128 + dx, 220 + dy, 292 + dx, 387 + dy), 24, PANEL_SHADE, INK, 6)
        rounded(draw, (139 + dx, 235 + dy, 281 + dx, 305 + dy), 15, PANEL, INK, 5)
        rounded(draw, (155 + dx, 197 + dy, 265 + dx, 251 + dy), 4, "#fffdf7", INK, 5)
        rounded(draw, (165 + dx, 248 + dy, 255 + dx, 266 + dy), 4, CYAN, INK, 4)
        rounded(draw, (145 + dx, 304 + dy, 275 + dx, 378 + dy), 12, INK_SOFT, INK, 5)
        for yy in (318, 334, 350):
            line(draw, ((156 + dx, yy + dy), (203 + dx, yy + dy)), "#4b5c72", 5)
        draw_canister(draw, 205 + dx, 298 + dy, YELLOW, YELLOW_DARK, 91, 35)
        draw_canister(draw, 244 + dx, 298 + dy, CYAN, CYAN_DARK, 91, 35)
    elif direction == "left":
        line(draw, ((230 + dx, 231 + dy), (211 + dx, 268 + dy), (215 + dx, 328 + dy)), INK, 14)
        rounded(draw, (209 + dx, 253 + dy, 228 + dx, 283 + dy), 5, CYAN, CYAN_DARK, 3)
        line(draw, ((213 + dx, 325 + dy), (232 + dx, 356 + dy)), INK_SOFT, 7)
    else:
        raise ValueError(direction)

    return image


def draw_thermos_back(direction, phase_index):
    image = new_frame()
    draw = ImageDraw.Draw(image, "RGBA")
    dx = (0, -2, 2)[phase_index]
    dy = (0, 2, 1)[phase_index]
    if direction == "down":
        rounded(draw, (108 + dx, 225 + dy, 312 + dx, 395 + dy), 28, INK_SOFT, INK, 6)
        draw_pressure_tank(draw, 86 + dx, 252 + dy, CYAN, CYAN_DARK, 125, 49)
        draw_pressure_tank(draw, 285 + dx, 252 + dy, ORANGE, ORANGE_DARK, 125, 49)
        line(draw, ((108 + dx, 360 + dy), (132 + dx, 385 + dy)), "#6f7e91", 8)
        line(draw, ((312 + dx, 360 + dy), (288 + dx, 385 + dy)), "#6f7e91", 8)
    elif direction == "up":
        rounded(draw, (108 + dx, 220 + dy, 312 + dx, 397 + dy), 28, INK_SOFT, INK, 6)
        draw_pressure_tank(draw, 92 + dx, 245 + dy, CYAN, CYAN_DARK, 136, 52)
        draw_pressure_tank(draw, 276 + dx, 245 + dy, ORANGE, ORANGE_DARK, 136, 52)
    elif direction == "left":
        rounded(draw, (232 + dx, 222 + dy, 367 + dx, 400 + dy), 25, INK_SOFT, INK, 6)
        draw_pressure_tank(draw, 255 + dx, 246 + dy, CYAN, CYAN_DARK, 137, 50)
        draw_pressure_tank(draw, 310 + dx, 246 + dy, ORANGE, ORANGE_DARK, 137, 50)
        line(draw, ((272 + dx, 380 + dy), (248 + dx, 402 + dy), (231 + dx, 391 + dy)), "#6f7e91", 9)
    else:
        raise ValueError(direction)
    return image


def draw_thermos_front(direction, phase_index):
    image = new_frame()
    draw = ImageDraw.Draw(image, "RGBA")
    dx = (0, -2, 2)[phase_index]
    dy = (0, 2, 1)[phase_index]
    if direction == "down":
        line(draw, ((146 + dx, 225 + dy), (157 + dx, 292 + dy), (164 + dx, 347 + dy)), INK, 14)
        line(draw, ((274 + dx, 225 + dy), (263 + dx, 292 + dy), (256 + dx, 347 + dy)), INK, 14)
        rounded(draw, (145 + dx, 258 + dy, 165 + dx, 286 + dy), 5, ORANGE, ORANGE_DARK, 3)
        rounded(draw, (255 + dx, 258 + dy, 275 + dx, 286 + dy), 5, CYAN, CYAN_DARK, 3)
        draw_gauge(draw, 126 + dx, 326 + dy, CYAN_DARK)
        draw_gauge(draw, 294 + dx, 326 + dy, ORANGE_DARK)
    elif direction == "up":
        rounded(draw, (132 + dx, 232 + dy, 288 + dx, 388 + dy), 23, INK_SOFT, INK, 6)
        rounded(draw, (151 + dx, 249 + dy, 269 + dx, 360 + dy), 18, "#303d51", INK, 5)
        draw_gauge(draw, 210 + dx, 286 + dy, ORANGE_DARK)
        rounded(draw, (188 + dx, 319 + dy, 232 + dx, 347 + dy), 7, PANEL_SHADE, INK, 4)
        line(draw, ((210 + dx, 347 + dy), (210 + dx, 375 + dy)), "#6f7e91", 8)
    elif direction == "left":
        line(draw, ((230 + dx, 230 + dy), (211 + dx, 280 + dy), (215 + dx, 337 + dy)), INK, 14)
        rounded(draw, (208 + dx, 258 + dy, 229 + dx, 288 + dy), 5, ORANGE, ORANGE_DARK, 3)
        draw_gauge(draw, 235 + dx, 337 + dy, CYAN_DARK)
    else:
        raise ValueError(direction)
    return image


def scissors_targets(direction, phase_index):
    if direction in ("down", "up"):
        return (
            ((170, 476), (250, 476)),
            ((178, 505), (248, 447)),
            ((172, 447), (242, 505)),
        )[phase_index]
    return (
        ((184, 482), (238, 482)),
        ((155, 500), (270, 462)),
        ((164, 455), (275, 507)),
    )[phase_index]


def draw_scissors_back(direction, phase_index):
    image = new_frame()
    draw = ImageDraw.Draw(image, "RGBA")
    dx = (0, -2, 2)[phase_index]
    dy = (0, 2, 1)[phase_index]
    left_target, right_target = scissors_targets(direction, phase_index)
    if direction in ("down", "up"):
        line(draw, ((175 + dx, 372 + dy), (left_target[0] + dx, left_target[1] + dy)), PINK_DARK, 10)
        line(draw, ((245 + dx, 372 + dy), (right_target[0] + dx, right_target[1] + dy)), CYAN_DARK, 10)
    elif direction == "left":
        line(draw, ((215 + dx, 370 + dy), (left_target[0] + dx, left_target[1] + dy)), PINK_DARK, 10)
        line(draw, ((225 + dx, 370 + dy), (right_target[0] + dx, right_target[1] + dy)), CYAN_DARK, 10)
    else:
        raise ValueError(direction)
    return image


def draw_scissors_front(direction, phase_index):
    image = new_frame()
    draw = ImageDraw.Draw(image, "RGBA")
    dx = (0, -2, 2)[phase_index]
    dy = (0, 2, 1)[phase_index]
    left_target, right_target = scissors_targets(direction, phase_index)
    if direction in ("down", "up"):
        rounded(draw, (142 + dx, 350 + dy, 278 + dx, 381 + dy), 12, INK_SOFT, INK, 5)
        ellipse(draw, (187 + dx, 344 + dy, 233 + dx, 390 + dy), PANEL_SHADE, INK, 6)
        ellipse(draw, (198 + dx, 355 + dy, 222 + dx, 379 + dy), CYAN, PINK_DARK, 4)
        for target, color, dark in ((left_target, PINK, PINK_DARK), (right_target, CYAN, CYAN_DARK)):
            ellipse(draw, (target[0] - 10 + dx, target[1] - 10 + dy, target[0] + 10 + dx, target[1] + 10 + dy), color, dark, 4)
            rounded(draw, (target[0] - 16 + dx, target[1] + 9 + dy, target[0] + 16 + dx, target[1] + 22 + dy), 5, INK_SOFT, INK, 3)
    elif direction == "left":
        rounded(draw, (171 + dx, 351 + dy, 245 + dx, 382 + dy), 12, INK_SOFT, INK, 5)
        ellipse(draw, (194 + dx, 344 + dy, 238 + dx, 388 + dy), PANEL_SHADE, INK, 6)
        ellipse(draw, (204 + dx, 354 + dy, 228 + dx, 378 + dy), PINK, CYAN_DARK, 4)
        for target, color, dark in ((left_target, PINK, PINK_DARK), (right_target, CYAN, CYAN_DARK)):
            ellipse(draw, (target[0] - 9 + dx, target[1] - 9 + dy, target[0] + 9 + dx, target[1] + 9 + dy), color, dark, 4)
    else:
        raise ValueError(direction)
    return image


def draw_correction_back(direction, phase_index):
    image = new_frame()
    draw = ImageDraw.Draw(image, "RGBA")
    dx = (0, -2, 2)[phase_index]
    dy = (0, 2, 1)[phase_index]
    if direction == "down":
        rounded(draw, (102 + dx, 300 + dy, 166 + dx, 411 + dy), 27, WHITE_FLUID, CYAN_DARK, 5)
        rounded(draw, (254 + dx, 300 + dy, 318 + dx, 411 + dy), 27, WHITE_FLUID, PINK_DARK, 5)
        line(draw, ((120 + dx, 303 + dy), (128 + dx, 253 + dy), (148 + dx, 233 + dy)), CYAN, 7)
        line(draw, ((300 + dx, 303 + dy), (292 + dx, 253 + dy), (272 + dx, 233 + dy)), PINK, 7)
    elif direction == "up":
        rounded(draw, (137 + dx, 300 + dy, 283 + dx, 399 + dy), 31, "#d8eef099", INK_SOFT, 5)
    elif direction == "left":
        rounded(draw, (241 + dx, 289 + dy, 351 + dx, 408 + dy), 36, WHITE_FLUID, INK, 6)
        line(draw, ((257 + dx, 348 + dy), (284 + dx, 325 + dy), (312 + dx, 354 + dy), (336 + dx, 329 + dy)), CYAN, 7)
        line(draw, ((265 + dx, 365 + dy), (293 + dx, 345 + dy), (321 + dx, 372 + dy)), PINK, 7)
    else:
        raise ValueError(direction)
    return image


def draw_correction_front(direction, phase_index):
    image = new_frame()
    draw = ImageDraw.Draw(image, "RGBA")
    dx = (0, -2, 2)[phase_index]
    dy = (0, 2, 1)[phase_index]
    if direction == "down":
        rounded(draw, (94 + dx, 320 + dy, 137 + dx, 401 + dy), 18, WHITE_FLUID, CYAN_DARK, 5)
        rounded(draw, (283 + dx, 320 + dy, 326 + dx, 401 + dy), 18, WHITE_FLUID, PINK_DARK, 5)
        line(draw, ((146 + dx, 232 + dy), (129 + dx, 269 + dy), (120 + dx, 323 + dy)), CYAN, 8)
        line(draw, ((274 + dx, 232 + dy), (291 + dx, 269 + dy), (300 + dx, 323 + dy)), PINK, 8)
        rounded(draw, (132 + dx, 216 + dy, 158 + dx, 241 + dy), 7, ORANGE, ORANGE_DARK, 4)
        rounded(draw, (262 + dx, 216 + dy, 288 + dx, 241 + dy), 7, ORANGE, ORANGE_DARK, 4)
        rounded(draw, (100 + dx, 361 + dy, 137 + dx, 389 + dy), 8, INK_SOFT, INK, 4)
        rounded(draw, (283 + dx, 361 + dy, 320 + dx, 389 + dy), 8, INK_SOFT, INK, 4)
    elif direction == "up":
        rounded(draw, (128 + dx, 292 + dy, 292 + dx, 402 + dy), 34, WHITE_FLUID, INK, 6)
        line(draw, ((148 + dx, 334 + dy), (186 + dx, 361 + dy), (210 + dx, 337 + dy), (235 + dx, 362 + dy), (273 + dx, 333 + dy)), PINK, 8)
        line(draw, ((148 + dx, 350 + dy), (183 + dx, 327 + dy), (210 + dx, 352 + dy), (238 + dx, 328 + dy), (273 + dx, 350 + dy)), CYAN, 7)
        rounded(draw, (129 + dx, 276 + dy, 157 + dx, 305 + dy), 7, ORANGE, ORANGE_DARK, 4)
        rounded(draw, (263 + dx, 276 + dy, 291 + dx, 305 + dy), 7, ORANGE, ORANGE_DARK, 4)
        line(draw, ((143 + dx, 293 + dy), (151 + dx, 333 + dy)), CYAN, 7)
        line(draw, ((277 + dx, 293 + dy), (269 + dx, 333 + dy)), PINK, 7)
    elif direction == "left":
        line(draw, ((229 + dx, 230 + dy), (252 + dx, 265 + dy), (266 + dx, 316 + dy)), PINK, 8)
        rounded(draw, (221 + dx, 215 + dy, 249 + dx, 242 + dy), 7, ORANGE, ORANGE_DARK, 4)
        rounded(draw, (236 + dx, 352 + dy, 276 + dx, 383 + dy), 8, INK_SOFT, INK, 4)
    else:
        raise ValueError(direction)
    return image


def mirror(image):
    return image.transpose(Image.Transpose.FLIP_LEFT_RIGHT)


RENDERERS = {
    "marker": {"back": draw_marker_back, "front": draw_marker_front},
    "thermos": {"back": draw_thermos_back, "front": draw_thermos_front},
    "scissors": {"back": draw_scissors_back, "front": draw_scissors_front},
    "correction": {"back": draw_correction_back, "front": draw_correction_front},
}


def build_layer(weapon, part):
    atlas = Image.new("RGBA", (CELL_W * len(PHASES), CELL_H * len(DIRECTIONS)), (0, 0, 0, 0))
    renderer = RENDERERS[weapon][part]
    left_frames = [renderer("left", index) for index in range(len(PHASES))]
    left_frames = [frame.resize((CELL_W, CELL_H), Image.Resampling.LANCZOS) for frame in left_frames]
    for row, direction in enumerate(DIRECTIONS):
        if direction == "right":
            frames = [mirror(frame) for frame in left_frames]
        elif direction == "left":
            frames = left_frames
        else:
            frames = [renderer(direction, index) for index in range(len(PHASES))]
            frames = [frame.resize((CELL_W, CELL_H), Image.Resampling.LANCZOS) for frame in frames]
        for column, frame in enumerate(frames):
            atlas.alpha_composite(frame, (column * CELL_W, row * CELL_H))
    return atlas


def main():
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    for weapon in RENDERERS:
        for part in ("back", "front"):
            atlas = build_layer(weapon, part)
            output = ASSET_DIR / f"{weapon}-rig-{part}-v1.png"
            atlas.save(output, optimize=True)
            print(f"Wrote {output} {atlas.size} {atlas.mode}")


if __name__ == "__main__":
    main()
