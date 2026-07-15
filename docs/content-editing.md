# Content Editing Workflow

The portfolio text is editable through `content-editor.html`. The editable copy lives in:

```text
js/content.js
```

## Edit Text Without Coding

1. Open `content-editor.html` in a browser.
2. Change the fields you want to update.
3. Paste a fine-grained GitHub token in the `GitHub token` field.
4. Click `Publish content to GitHub`.
5. Wait for the GitHub Pages deployment to finish, then refresh the live site.

Create the token in GitHub as a fine-grained personal access token for this repository only, with
`Contents: Read and write` permission. The token is browser-visible while you use the editor, so do
not hard-code it into the site or use a broad account token.

The `Save content.js`, `Download content.js`, and `Copy` buttons are still available as backup
options if you want a local copy or if GitHub publishing is temporarily unavailable.

## What The Editor Controls

- Landing page name, eyebrow, and tab labels
- Highlighted Works intro text
- About Me page copy and LinkedIn URL
- About Me image uploads
- Contact page email and LinkedIn text
- Project titles, types, summaries, systems, scopes, project-section labels, primary media text,
  status text, and model labels

## What Still Requires File Changes

The editor is for copy and About Me image uploads. Project model changes still require placing files
in the right folders and updating asset paths in `js/projects.js`.
