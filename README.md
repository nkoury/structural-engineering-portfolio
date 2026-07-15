# Noah Koury Structural Engineering Portfolio

This is a static, GitHub Pages-ready portfolio site for structural engineering case studies.
The repository root is the public-facing site. Historical alternate versions were removed after
creating the `backup/pre-bloat-cleanup-20260715` rollback branch.

## Current Site Structure

- `index.html` is the root landing page.
- `works.html` is the highlighted-works index with one card per project.
- `projects/*.html` are data-driven project case study pages.
- `about.html` is the About Me page.
- `contact.html` contains email and LinkedIn contact links.
- `content-editor.html` edits site copy and About Me image uploads in `js/content.js`, then can
  publish that file directly to GitHub.
- `assets/` stores shared model and brand assets.
- `js/projects.js` controls project ids, page links, model paths, and SwiftXR embed URLs.
- `js/content.js` contains editable text, per-project project-section copy, and uploaded About Me
  images.
- `js/analytics-config.js` and `js/analytics.js` configure production-only Cloudflare Web
  Analytics.

## Direct Content Publishing

The content editor can now publish `js/content.js` directly to GitHub:

1. Open `content-editor.html`.
2. Edit the text or upload safe public images.
3. Paste a fine-grained GitHub token in the `GitHub token` field.
4. Click `Publish content to GitHub`.
5. Wait for GitHub Pages to deploy, then open `https://noahkoury.com`.

Use a fine-grained GitHub personal access token scoped only to this repository with `Contents:
Read and write` permission. The token is stored only in browser session storage so it does not need
to be pasted again during the same browser session. Do not commit the token, paste it into
`js/content.js`, or replace it with a GitHub account password or unrelated API key.

The public pages load editable content through `js/content-bootstrap.js`, which adds a fresh cache
key to `js/content.js`. That keeps normal page scripts cacheable while making content-editor
publishes visible after the GitHub Pages deployment finishes. GitHub Pages is still a static host, so
updates are direct but not truly instant; they usually appear after the Pages deployment completes.

The old `Save content.js`, `Download content.js`, and `Copy` buttons remain available as backups if
the GitHub API publish fails or if you want to keep a local copy before publishing.

## Publishing Rules

Before committing assets to GitHub, remove or obscure:

- Client, owner, architect, contractor, and exact site identifiers
- Professional stamps, seals, signatures, and license numbers
- Full drawing sets unless they are intentionally public
- Proprietary calculation pages or software model metadata
- Notes that reveal confidential business, budget, schedule, or claim information

Keep original U3D files and confidential source packages outside the public repo. Publish only
redacted PDFs, cropped drawing images, preview images, hosted viewer links, or model assets when
they are safe.

## Deploying To GitHub Pages

1. Commit and push the site to the repository.
2. In GitHub, open Settings -> Pages.
3. Set the source to the main branch and root folder.
4. After the page is live, add your custom domain in the Pages settings.

## Cloudflare Web Analytics

Analytics is configured in `js/analytics-config.js` and loaded by `js/analytics.js`. Update the
`siteToken` value with the token from Cloudflare Dashboard -> Analytics & Logs -> Web Analytics.
That token is intended to be public in browser source; do not replace it with a Cloudflare account
API key or any other secret.

The analytics loader only inserts the Cloudflare beacon on:

- `noahkoury.com`
- `www.noahkoury.com`

This avoids counting development traffic from `localhost`, `127.0.0.1`, `file://` previews,
GitHub preview URLs, or other non-production hosts.

To verify analytics after deploying, open the live production site, then open browser developer
tools. In the Network tab, reload the page and look for a request to
`https://static.cloudflareinsights.com/beacon.min.js`. You can also inspect the page source and
confirm that `js/analytics.js` is included near the closing `</body>` tag.

To temporarily disable analytics, either remove the production hostnames from
`allowedHostnames` or set `siteToken` to an empty string in `js/analytics-config.js`. Prefer this
over editing every HTML file, because all pages share the same analytics module.

The shared analytics API is available as `window.PortfolioAnalytics.trackEvent(name, properties)`.
At the moment it records provider-neutral events in memory only; no Cloudflare-specific custom-event
call is made unless a compatible browser API is intentionally added later.
