from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import ImageDraw
from pdf2image import convert_from_path


def normalized_box(size: tuple[int, int], box: list[float]) -> tuple[int, int, int, int]:
    width, height = size
    x, y, w, h = box
    return (
        round(x * width),
        round(y * height),
        round((x + w) * width),
        round((y + h) * height),
    )


def redact(image, redactions: list[dict]) -> None:
    draw = ImageDraw.Draw(image)
    for redaction in redactions:
        draw.rectangle(normalized_box(image.size, redaction["box"]), fill="white")


def render_target(source_pdf: Path, target: dict, redactions: list[dict], dpi: int, poppler_path: str | None) -> None:
    images = convert_from_path(
        source_pdf,
        dpi=dpi,
        first_page=target["sourcePage"],
        last_page=target["sourcePage"],
        poppler_path=poppler_path,
    )
    if not images:
        raise RuntimeError(f"No rendered image returned for {source_pdf} page {target['sourcePage']}")

    image = images[0].convert("RGB")
    redact(image, target.get("redactions", redactions))

    output = Path(target["output"])
    output.parent.mkdir(parents=True, exist_ok=True)
    image.thumbnail((1800, 1800))
    image.save(output, "WEBP", quality=86)
    print(f"wrote {output}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Render address-redacted structural detail sheet previews.")
    parser.add_argument("--map", default="tools/detail-source-map.json", help="Detail source map JSON path.")
    parser.add_argument("--project", help="Optional project id to render.")
    parser.add_argument("--poppler-path", help="Optional Poppler bin folder containing pdftoppm.")
    parser.add_argument("--dpi", type=int, help="Override render DPI.")
    args = parser.parse_args()

    root = Path.cwd()
    config = json.loads((root / args.map).read_text(encoding="utf-8"))
    defaults = config.get("defaults", {})
    redactions = defaults.get("redactions", [])
    dpi = args.dpi or defaults.get("dpi", 180)

    for project in config["projects"]:
        if args.project and project["projectId"] != args.project:
            continue

        source_pdf = root / project["sourcePdf"]
        if not source_pdf.exists():
            print(f"missing source PDF: {source_pdf}")
            continue

        for target in project["targets"]:
            render_target(source_pdf, target, redactions, dpi, args.poppler_path)


if __name__ == "__main__":
    main()
