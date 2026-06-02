# Structural Engineering Portfolio Starter

This is a static, GitHub Pages-ready website starter for a structural engineering portfolio.
Open `index.html` locally or push the folder to a GitHub repository and publish it with GitHub Pages.

The site is intentionally asset-first. It does not rely on AI-generated project imagery; add your own
model views, plan crops, PDF references, FEA captures, and calculation excerpts under `assets/project-assets/`.

## Site Architecture

- `index.html` contains the page structure and project modal.
- `css/styles.css` contains the visual system and responsive layout.
- `js/projects.js` contains editable project data.
- `js/main.js` renders filters, project cards, modal tabs, and the animated model placeholder.
- `assets/project-assets/` is reserved for your real project visuals.

## What To Send For The First Real Project

Start with one project and collect:

- Project name or a public-safe alias
- Project type, year, region, and your role
- 1 hero visual: model screenshot, rendering, site photo, or drawing collage
- 2 to 4 process visuals: plan crop, detail crop, FEA capture, model view, calc excerpt
- A short technical story: challenge, constraints, method, decision, outcome
- Redaction rules: client names, locations, stamps, addresses, sheet numbers, and sensitive notes

## Recommended Asset Formats

Browsers do not natively display U3D-in-PDF content like Bluebeam. This architecture can store and link U3D/PDF resources, but for in-page viewing use:

- Model stills: `.webp`, `.jpg`, or `.png`
- Interactive 3D models: `.glb` or `.gltf`
- Short model rotations: `.mp4` or `.webm`
- Plan/calculation previews: cropped `.webp` or `.png`
- Reference/download files: redacted `.pdf` or U3D-containing PDFs only when you intentionally want them public

## Updating Projects

Edit `js/projects.js`. Each project supports:

- `title`
- `type`
- `year`
- `summary`
- `tags`
- `tabs`
- `bullets`

The current cards are asset slots. Replace them one at a time as real assets are prepared.

## Deploying To GitHub Pages

1. Create a new GitHub repository.
2. Copy this folder into the repository root.
3. Commit and push.
4. In GitHub, go to Settings -> Pages.
5. Set the source to the main branch and root folder.
6. Add a custom domain after the page is live.

For a larger second version, consider Astro or Vite with reusable components and a proper GLB model viewer.
