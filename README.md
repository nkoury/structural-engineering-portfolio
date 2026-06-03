# Noah Koury Structural Engineering Portfolio

This is a static, GitHub Pages-ready portfolio site for structural engineering case studies.
It is designed around your own assets: model views, GLB/GLTF files, redacted drawing excerpts,
FEA captures, calculation excerpts, site photos, and personal photos.

## Current Site Structure

- `index.html` is the landing page and selected-work collage.
- `projects/l-ranch.html` is the L Ranch case study page with an active GLB model viewer.
- `projects/high-mountain.html` is a ready-to-populate High Mountain case study page.
- `about.html` is the About Me page with LinkedIn and personal-photo slots.
- `css/styles.css` contains the full visual system and responsive layout.
- `js/projects.js` controls the project names, gallery tiles, page links, and model metadata.
- `js/main.js` renders the landing-page project ribbon and collage from project data.
- `js/project-page.js` renders optional SwiftXR embeds when a project has an embed URL.
- `docs/asset-intake.md` explains how to prepare public-safe project assets.
- `docs/swiftxr-workflow.md` explains the SwiftXR/U3D workflow.

## Asset Folders

Use `assets/project-assets/<project-slug>/` for files that are safe to publish on GitHub Pages.

```text
assets/
  about/
    noah-portrait.webp
    noah-field.webp
    noah-pursuit.webp
  project-assets/
    l-ranch/
      models/
      preview/
      drawings/
      analysis/
      calculations/
      manifest.json
    high-mountain/
      models/
      preview/
      drawings/
      analysis/
      calculations/
      manifest.json
```

The active L Ranch model is:

```text
assets/project-assets/l-ranch/models/trellis-gltf-colors.glb
```

## Publishing Rules

Before committing assets to GitHub, remove or obscure:

- Client, owner, architect, contractor, and exact site identifiers
- Professional stamps, seals, signatures, and license numbers
- Full drawing sets unless they are intentionally public
- Proprietary calculation pages or software model metadata
- Notes that reveal confidential business, budget, schedule, or claim information

Keep original U3D files and confidential source packages outside the public repo. Publish only
redacted PDFs, cropped drawing images, preview images, or hosted viewer links when they are safe.

## Updating Projects

For the landing gallery, edit `js/projects.js`.

For detailed project narratives, edit:

- `projects/l-ranch.html`
- `projects/high-mountain.html`

When adding a new project, copy an existing project page, create a matching folder under
`assets/project-assets/`, add its entry to `js/projects.js`, and add a manifest from
`assets/project-assets/project-template/manifest.json`.

## 3D Model Options

- Use `.glb` for the most stable single-file in-browser model display.
- Use `.gltf` plus `.bin` only when you intentionally want split source files.
- Use SwiftXR for hosted U3D or richer model presentations, then add the published iframe URL
  to the project's `swiftxr.embedUrl` value in `js/projects.js`.

## Deploying To GitHub Pages

1. Commit and push the site to the repository.
2. In GitHub, open Settings -> Pages.
3. Set the source to the main branch and root folder.
4. After the page is live, add your custom domain in the Pages settings.
