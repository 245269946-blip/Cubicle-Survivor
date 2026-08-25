"""Build deterministic, runtime-ready cartoon office SFX for Demo V3.15."""

from __future__ import annotations

import math
import random
import struct
import wave
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "Cubicle-Survivor-demo" / "assets" / "cartoon-office-audio"
SAMPLE_RATE = 22050


SPECS = {
    "weapon-marker": (0.24, 930, "scratch"),
    "weapon-thermos": (0.34, 240, "steam"),
    "weapon-scissors": (0.25, 1180, "snip"),
    "weapon-correction": (0.32, 520, "spray"),
    "enemy-todo": (0.28, 310, "paper"),
    "enemy-email": (0.27, 760, "zip"),
    "enemy-meeting": (0.36, 180, "thud"),
    "enemy-ping": (0.31, 880, "ping"),
    "enemy-deadline": (0.38, 430, "alarm"),
    "enemy-scope": (0.33, 360, "stretch"),
    "enemy-approval": (0.34, 250, "stamp"),
    "enemy-client": (0.39, 610, "call"),
    "boss-lead": (0.48, 220, "boss_call"),
    "boss-director": (0.50, 165, "boss_stamp"),
    "boss-delivery": (0.47, 205, "boss_charge"),
    "boss-client": (0.52, 330, "boss_phone"),
    "boss-ceo": (0.55, 130, "boss_final"),
    "defeat-normal": (0.27, 460, "crumple"),
    "defeat-boss": (0.58, 145, "boss_defeat"),
    "encounter-complete": (0.54, 523, "complete"),
    "run-complete": (0.78, 392, "run_complete"),
}


def envelope(t: float, start: float, duration: float, attack: float = 0.015) -> float:
    local = t - start
    if local < 0 or local >= duration:
        return 0.0
    rise = min(1.0, local / max(attack, 0.001))
    fall = max(0.0, 1.0 - local / duration)
    return rise * fall * fall


def triangle(phase: float) -> float:
    return 2.0 / math.pi * math.asin(math.sin(phase))


def add_tone(samples: list[float], start: float, duration: float, f0: float, f1: float,
             amplitude: float, wave_shape: str = "triangle") -> None:
    start_index = int(start * SAMPLE_RATE)
    end_index = min(len(samples), int((start + duration) * SAMPLE_RATE))
    phase = 0.0
    for index in range(start_index, end_index):
        local = (index - start_index) / SAMPLE_RATE
        ratio = local / max(duration, 0.001)
        frequency = f0 + (f1 - f0) * ratio
        phase += math.tau * frequency / SAMPLE_RATE
        value = math.sin(phase) if wave_shape == "sine" else triangle(phase)
        samples[index] += value * amplitude * envelope(index / SAMPLE_RATE, start, duration)


def add_noise(samples: list[float], rng: random.Random, start: float, duration: float,
              amplitude: float, smooth: float = 0.72) -> None:
    start_index = int(start * SAMPLE_RATE)
    end_index = min(len(samples), int((start + duration) * SAMPLE_RATE))
    filtered = 0.0
    for index in range(start_index, end_index):
        filtered = filtered * smooth + (rng.random() * 2 - 1) * (1 - smooth)
        samples[index] += filtered * amplitude * envelope(index / SAMPLE_RATE, start, duration, 0.004)


def add_click(samples: list[float], start: float, frequency: float, amplitude: float = 0.34) -> None:
    add_tone(samples, start, 0.055, frequency, frequency * 0.58, amplitude, "triangle")


def render(name: str, duration: float, base: float, recipe: str) -> list[float]:
    samples = [0.0] * int(duration * SAMPLE_RATE)
    rng = random.Random(name)

    if recipe == "scratch":
        add_noise(samples, rng, 0.00, 0.18, 0.42, 0.83)
        add_tone(samples, 0.02, 0.17, base, base * 0.62, 0.24)
        add_click(samples, 0.15, base * 1.2, 0.28)
    elif recipe == "steam":
        add_noise(samples, rng, 0.02, 0.29, 0.38, 0.91)
        add_tone(samples, 0.00, 0.30, base * 0.65, base * 1.25, 0.28, "sine")
        add_click(samples, 0.25, base * 1.8, 0.18)
    elif recipe == "snip":
        for offset, pitch in ((0.01, base), (0.12, base * 1.12)):
            add_click(samples, offset, pitch, 0.38)
            add_noise(samples, rng, offset, 0.07, 0.20, 0.38)
    elif recipe == "spray":
        add_click(samples, 0.00, base * 0.8, 0.22)
        add_noise(samples, rng, 0.04, 0.24, 0.44, 0.86)
        add_tone(samples, 0.05, 0.23, base, base * 0.72, 0.18, "sine")
    elif recipe == "paper":
        add_noise(samples, rng, 0.00, 0.19, 0.35, 0.68)
        add_click(samples, 0.15, base, 0.38)
    elif recipe == "zip":
        add_tone(samples, 0.00, 0.18, base * 0.65, base * 1.5, 0.32)
        add_noise(samples, rng, 0.02, 0.13, 0.19, 0.72)
        add_click(samples, 0.17, base * 1.35, 0.22)
    elif recipe == "thud":
        add_tone(samples, 0.03, 0.28, base * 1.45, base * 0.55, 0.42, "sine")
        add_noise(samples, rng, 0.04, 0.20, 0.28, 0.91)
    elif recipe == "ping":
        add_tone(samples, 0.00, 0.13, base, base * 1.18, 0.30, "sine")
        add_tone(samples, 0.14, 0.14, base * 1.25, base * 1.42, 0.34, "sine")
    elif recipe == "alarm":
        for offset, pitch in ((0.00, base), (0.10, base * 1.18), (0.20, base * 1.38)):
            add_click(samples, offset, pitch, 0.27)
        add_tone(samples, 0.26, 0.10, base * 1.25, base * 0.65, 0.30)
    elif recipe == "stretch":
        add_tone(samples, 0.00, 0.24, base * 0.72, base * 1.52, 0.31)
        add_click(samples, 0.22, base * 1.62, 0.36)
    elif recipe == "stamp":
        add_tone(samples, 0.00, 0.14, base * 1.55, base, 0.22)
        add_click(samples, 0.15, base * 0.72, 0.48)
        add_noise(samples, rng, 0.14, 0.16, 0.31, 0.88)
    elif recipe == "call":
        for offset, ratio in ((0.00, 1.0), (0.11, 1.26), (0.22, 1.0)):
            add_tone(samples, offset, 0.105, base * ratio, base * ratio, 0.27, "sine")
    elif recipe.startswith("boss_"):
        add_tone(samples, 0.00, duration * 0.82, base * 1.4, base * 0.62, 0.38, "triangle")
        add_tone(samples, 0.03, duration * 0.72, base * 2.02, base * 1.02, 0.18, "sine")
        add_noise(samples, rng, duration * 0.18, duration * 0.56, 0.26, 0.88)
        add_click(samples, duration * 0.64, base * 1.3, 0.34)
        if recipe in {"boss_phone", "boss_final"}:
            add_tone(samples, 0.08, duration * 0.55, base * 2.5, base * 2.9, 0.15, "sine")
    elif recipe == "crumple":
        add_noise(samples, rng, 0.00, 0.22, 0.44, 0.76)
        add_tone(samples, 0.03, 0.20, base, base * 0.42, 0.25)
    elif recipe == "complete":
        for offset, ratio in ((0.00, 1.0), (0.13, 1.25), (0.26, 1.5)):
            add_tone(samples, offset, 0.25, base * ratio, base * ratio * 1.04, 0.25, "sine")
        add_click(samples, 0.36, base * 2.0, 0.20)
    elif recipe == "run_complete":
        for offset, ratio in ((0.00, 1.0), (0.14, 1.25), (0.28, 1.5), (0.42, 2.0)):
            add_tone(samples, offset, 0.31, base * ratio, base * ratio * 1.03, 0.24, "sine")
        add_noise(samples, rng, 0.44, 0.24, 0.15, 0.92)
    else:
        raise ValueError(recipe)

    peak = max(abs(value) for value in samples) or 1.0
    scale = min(1.0, 0.72 / peak)
    return [math.tanh(value * scale * 1.08) * 0.88 for value in samples]


def write_wav(path: Path, samples: list[float]) -> None:
    pcm = bytearray()
    for value in samples:
        pcm.extend(struct.pack("<h", round(max(-1.0, min(1.0, value)) * 32767)))
    with wave.open(str(path), "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(SAMPLE_RATE)
        output.writeframes(bytes(pcm))


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name, (duration, base, recipe) in SPECS.items():
        write_wav(OUTPUT / f"{name}-v1.wav", render(name, duration, base, recipe))
    print(f"built {len(SPECS)} formal cartoon audio assets in {OUTPUT}")


if __name__ == "__main__":
    main()
