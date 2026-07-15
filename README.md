# Noah Koury Structural Engineering Portfolio

This is a static, GitHub Pages-ready portfolio site for structural engineering case studies.
The repository root is now the simplified public-facing site without the Process tab or embedded
resume. The previous fuller version is preserved in `expanded-background-site/`.

## Current Site Structure

- `index.html` is the root landing page.
- `works.html` is the highlighted-works index with one card per project.
- `projects/*.html` are data-driven project case study pages.
- `about.html` is the About Me page.
- `contact.html` contains email and LinkedIn contact links.
- `content-editor.html` edits root-site copy and detail image uploads in `js/content.js`.
- `expanded-background-site/` is the backup version with Process and resume content.
- `assets/` stores shared model, drawing-detail, process, and resume assets.
- `js/projects.js` controls project ids, page links, model paths, and default detail slots.
- `js/content.js` contains editable text and uploaded detail images.
- `js/analytics-config.js` and `js/analytics.js` configure production-only Cloudflare Web
  Analytics.

## Detail Image Editing

Project pages start with drawing-detail placeholder slots. Open `content-editor.html`, find a
project's `Detail Assets`, and use the `Upload detail image` field to embed your chosen detail image
into `js/content.js`. Save or download the updated `content.js`, then commit it with the site.

## Publishing Rules

Before committing assets to GitHub, remove or obscure:

- Client, owner, architect, contractor, and exact site identifiers
- Professional stamps, seals, signatures, and license numbers
- Full drawing sets unless they are intentionally public
- Proprietary calculation pages or software model metadata
- Notes that reveal confidential business, budget, schedule, or claim information

Keep original U3D files and confidential source packages outside the public repo. Publish only
redacted PDFs, cropped drawing images, preview images, hosted viewer links, or content-editor detail
image uploads when they are safe.

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
