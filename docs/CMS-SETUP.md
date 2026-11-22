# CMS setup

The CMS is available after deployment at `https://fasal17.github.io/Muhammed-Fasal/admin/`.

## Media path configuration

This repository is published as the GitHub Pages project site `/Muhammed-Fasal/`. In `admin/config.yml`, `media_folder` remains the repository storage location (for example `/assets/uploads/documents`), while `public_folder` is the URL written into content and must include the project prefix (for example `/Muhammed-Fasal/assets/uploads/documents`). Keep these roles distinct when adding a new media field.

1. Sign in to GitHub as an account with write access to `Fasal17/Muhammed-Fasal`.
2. Create a fine-grained personal access token restricted to **Only select repositories** → `Fasal17/Muhammed-Fasal`.
3. Grant **Contents: Read and write**. GitHub adds **Metadata: Read-only** automatically. Do not grant Pull requests because this CMS uses direct commits, not editorial workflow.
4. Open the CMS URL and select **Sign In with Token**. Create or paste the token only into its browser prompt.
5. Choose a deliberately short expiration and revoke the token from GitHub if the browser or device is no longer trusted.

No token belongs in the repository. Sveltia stores the token in the current browser's local storage for later GitHub API calls. On a shared computer, sign out/clear site storage and revoke the token when finished.

For a local preview, run this command from the repository root:

```powershell
python -m http.server 8000
```

Then browse to `http://localhost:8000/`. The live GitHub write flow can only be tested with your own authenticated browser session.
