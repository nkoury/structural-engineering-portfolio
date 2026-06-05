# Detail Extraction Workflow

Full PDF drawing sets stay in ignored `drawings/source-private/` folders. Public project pages should use
redacted sheet previews or cropped detail images under `drawings/details/`.

## Current Targets

The target sheet/page map is in `tools/detail-source-map.json`.

Examples:

- L Ranch: `S-400`, `S-401`
- Coach Rd: `S-4.0`, `S-4.1`
- HHR Ranch: `S4.00`, `S4.01`
- Mountain Laurel: `S-400`, `S-403`
- Waters: `S-400`, `S-401`, `S-402`
- Hastings Mesa: `S4.00`

## Render Redacted Detail Crops

The script uses PyMuPDF to render the private PDFs directly, apply the configured redaction boxes, and
write cropped `.webp` detail tiles under each project's `drawings/details/` folder.

```powershell
python tools/extract-detail-assets.py --project waters
```

Run all configured projects:

```powershell
python tools/extract-detail-assets.py
```

To also write redacted full-sheet previews, add:

```powershell
python tools/extract-detail-assets.py --sheet-previews
```

## Redaction Rule

The first pass masks the common title block/address areas. After rendering, inspect every generated image
before committing. If a project uses a different title block, add project-specific `redactions` boxes in
`tools/detail-source-map.json`.

## Detail Icons

Default crop regions are stored in `tools/detail-source-map.json` as `cropBoxes`. If a sheet layout is
different, add target-specific `cropBoxes` after visually identifying the detail locations. Inspect every
generated crop before committing it, then wire the selected images into `detailAssets` in `js/projects.js`.
