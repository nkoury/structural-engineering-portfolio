# Project Asset Drop Zone

Place public-safe project visuals and web-ready model files here.

Recommended folder structure for each project:

```text
project-assets/
  project-slug/
    manifest.json
    preview/
      hero.webp
      model-still.webp
      site.webp
    models/
      model.glb
      source-u3d/
    drawings/
      details/
      plan-crop.webp
      detail-crop.webp
      public-summary.pdf
      source-private/
    analysis/
      load-path.webp
      fea-contour.webp
    calculations/
      calc-excerpt.webp
```

Use `project-template/manifest.json` as the starting point for each new project folder.

## Current Projects

- `l-ranch/`: active case study with a GLB model viewer.
- `high-mountain/`: ready-to-populate case study folder.

## Public-Safety Checklist

Before publishing, remove or obscure:

- Client, owner, architect, contractor, and exact location names
- Engineer stamps, signatures, seals, and license numbers
- Sheet numbers or title blocks that identify a confidential project
- Full drawing sets unless intentionally public
- Proprietary calculation pages or software model metadata
- Sensitive scope, cost, schedule, claim, or business notes

Original U3D files should stay private unless you intentionally want them in the public repository.

Full drawing PDFs with addresses belong in `drawings/source-private/`, which is ignored by Git.
Use `drawings/details/` for redacted sheet previews and individual cropped detail icons.
