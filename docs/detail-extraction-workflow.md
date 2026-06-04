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

## Render Redacted Sheet Previews

The script uses `pdf2image`, which requires Poppler. Install Poppler locally, then run from the site root:

```powershell
python tools/extract-detail-assets.py --project waters --poppler-path "C:\path\to\poppler\Library\bin"
```

Run all configured projects:

```powershell
python tools/extract-detail-assets.py --poppler-path "C:\path\to\poppler\Library\bin"
```

## Redaction Rule

The first pass masks the common title block/address areas. After rendering, inspect every generated image
before committing. If a project uses a different title block, add project-specific `redactions` boxes in
`tools/detail-source-map.json`.

## Detail Icons

The first output is a redacted sheet preview. For individual icons, add `crops` to a target after visually
identifying the detail locations, or manually crop the generated sheet preview into separate `.webp` files
under `assets/project-assets/<project>/drawings/details/`.
