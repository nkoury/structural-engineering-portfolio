# Noah Koury Structural Engineering Portfolio

This is a static, GitHub Pages-ready portfolio site for structural engineering case studies.
It is designed around your own assets: model views, GLB/GLTF files, redacted drawing excerpts,
FEA captures, calculation excerpts, site photos, and personal photos.

## Current Site Structure

- `index.html` is the navigation-only landing page.
- `works.html` is the compact highlighted-works index with one card per project.
- `process.html` is the shared sketch, calculation, and detail-development gallery.
- `contact.html` includes contact links and the embedded resume PDF.
- `content-editor.html` is a no-code editor for page and project text.
- `projects/l-ranch.html` is the L Ranch case study page with an active GLB model viewer.
- `projects/*.html` are data-driven project case study pages.
- `about.html` is the About Me page with LinkedIn and personal-photo slots.
- `css/styles.css` contains the full visual system and responsive layout.
- `js/content.js` contains editable page and project copy.
- `js/projects.js` controls project ids, page links, model paths, and asset metadata.
- `js/main.js` renders the highlighted-works cards and process gallery from project data.
- `js/project-page.js` renders project pages, model switching, detail cards, and optional SwiftXR embeds.
- `docs/asset-intake.md` explains how to prepare public-safe project assets.
- `docs/content-editing.md` explains how to update text without coding.
- `docs/swiftxr-workflow.md` explains the SwiftXR/U3D workflow.
- `docs/detail-extraction-workflow.md` explains the redacted PDF/detail extraction workflow.

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
        details/
        source-private/
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

New project folders are normalized to URL-safe slugs, such as `coach-rd/`, `hhr-ranch/`,
`mountain-laurel/`, and `waters/`.

## Publishing Rules

Before committing assets to GitHub, remove or obscure:

- Client, owner, architect, contractor, and exact site identifiers
- Professional stamps, seals, signatures, and license numbers
- Full drawing sets unless they are intentionally public
- Proprietary calculation pages or software model metadata
- Notes that reveal confidential business, budget, schedule, or claim information

Keep original U3D files and confidential source packages outside the public repo. Publish only
redacted PDFs, cropped drawing images, preview images, or hosted viewer links when they are safe.

Raw Revit files, Revit backup folders, U3D files, and full source PDFs in `source-private/` are ignored
by Git. Use `drawings/details/` for public redacted sheet previews and detail icons.

## Updating Projects

For text changes, open `content-editor.html` and save or download the updated `js/content.js`.

For asset, model, and path changes, edit `js/projects.js`.

For detailed project narratives, edit:

- `projects/l-ranch.html`
- `projects/high-mountain.html`

When adding a new project, copy an existing project page, create a matching folder under
`assets/project-assets/`, add its entry to `js/projects.js`, and add a manifest from
`assets/project-assets/project-template/manifest.json`.

Most project pages now use the same data-driven shell. For a normal new project, copy one of the
minimal `projects/*.html` files, change its `data-project-page` value, and add its data entry in
`js/projects.js`.

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
