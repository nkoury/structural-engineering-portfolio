from __future__ import annotations

import argparse
import json
from pathlib import Path

import fitz
from PIL import Image, ImageDraw


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


def render_page(source_pdf: Path, source_page: int, dpi: int) -> Image.Image:
    with fitz.open(source_pdf) as document:
        page_index = source_page - 1
        if page_index < 0 or page_index >= len(document):
            raise ValueError(f"{source_pdf} does not contain page {source_page}")

        page = document.load_page(page_index)
        matrix = fitz.Matrix(dpi / 72, dpi / 72)
        pixmap = page.get_pixmap(matrix=matrix, alpha=False)
        return Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)


def derived_crop_path(sheet_output: Path, index: int) -> Path:
    stem = sheet_output.stem
    return sheet_output.with_name(f"{stem}-detail-{index:02d}.webp")


def render_target(
    source_pdf: Path,
    target: dict,
    redactions: list[dict],
    crop_boxes: list[list[float]],
    dpi: int,
    write_sheet_preview: bool,
    write_crops: bool,
) -> None:
    image = render_page(source_pdf, target["sourcePage"], dpi)
    redact(image, target.get("redactions", redactions))

    output = Path(target["output"])
    output.parent.mkdir(parents=True, exist_ok=True)

    if write_sheet_preview:
        preview = image.copy()
        preview.thumbnail((1800, 1800))
        preview.save(output, "WEBP", quality=86)
        print(f"wrote {output}")

    if write_crops:
        for index, box in enumerate(target.get("cropBoxes", crop_boxes), start=1):
            crop = image.crop(normalized_box(image.size, box))
            crop.thumbnail((980, 980))
            crop_output = derived_crop_path(output, index)
            crop.save(crop_output, "WEBP", quality=88)
            print(f"wrote {crop_output}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Render address-redacted structural detail sheet previews.")
    parser.add_argument("--map", default="tools/detail-source-map.json", help="Detail source map JSON path.")
    parser.add_argument("--project", help="Optional project id to render.")
    parser.add_argument("--dpi", type=int, help="Override render DPI.")
    parser.add_argument("--sheet-previews", action="store_true", help="Also write redacted full-sheet previews.")
    parser.add_argument("--no-crops", action="store_true", help="Do not write individual detail crops.")
    args = parser.parse_args()

    root = Path.cwd()
    config = json.loads((root / args.map).read_text(encoding="utf-8"))
    defaults = config.get("defaults", {})
    redactions = defaults.get("redactions", [])
    crop_boxes = defaults.get(
        "cropBoxes",
        [
            [0.03, 0.08, 0.3, 0.34],
            [0.34, 0.08, 0.3, 0.34],
            [0.03, 0.44, 0.3, 0.34],
            [0.34, 0.44, 0.3, 0.34],
        ],
    )
    dpi = args.dpi or defaults.get("dpi", 180)

    for project in config["projects"]:
        if args.project and project["projectId"] != args.project:
            continue

        source_pdf = root / project["sourcePdf"]
        if not source_pdf.exists():
            print(f"missing source PDF: {source_pdf}")
            continue

        for target in project["targets"]:
            render_target(
                source_pdf=source_pdf,
                target=target,
                redactions=redactions,
                crop_boxes=crop_boxes,
                dpi=dpi,
                write_sheet_preview=args.sheet_previews,
                write_crops=not args.no_crops,
            )


if __name__ == "__main__":
    main()
