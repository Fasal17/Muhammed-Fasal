# Deployment

The checkout has no `.github` workflow, so the implementation is prepared for GitHub Pages publishing from the `main` branch root. Confirm the source in **Repository Settings → Pages** before merging.

1. Commit and push this work to the configured publishing branch (`main` for the CMS configuration).
2. In GitHub Pages settings, use **Deploy from a branch**, branch `main`, folder `/(root)`; or retain an existing GitHub Actions source if one is added later.
3. Wait for the Pages deployment, then check:
   - `https://fasal17.github.io/Muhammed-Fasal/`
   - `https://fasal17.github.io/Muhammed-Fasal/admin/`
   - `https://fasal17.github.io/Muhammed-Fasal/content/site.json`
4. After uploading an asset, verify that it resolves under `/Muhammed-Fasal/assets/uploads/...`.

This is a GitHub Pages **project site**, not a domain-root site. Sveltia's `media_folder` values identify repository storage paths such as `/assets/uploads/projects`; its `public_folder` values are the published URLs and include `/Muhammed-Fasal/`, for example `/Muhammed-Fasal/assets/uploads/projects/example.webp`.

The frontend’s centralized asset resolver chooses `/Muhammed-Fasal/` in production and `/` locally. It accepts legacy repository paths, root-relative paths, and CMS-prefixed public paths without duplicating or losing the project prefix.

If a CMS save does not appear, inspect the commit on `main`, then the Pages deployment status. If the CMS cannot save, verify the PAT repository scope, Contents permission, expiration, and that `main` is not protected against direct pushes.
