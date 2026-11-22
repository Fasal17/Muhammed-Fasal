# Security

This is a static Git-backed CMS. The public `/admin/` HTML page is intentionally reachable, but it grants no repository access on its own. A user must authenticate with GitHub and have write permission to commit.

- Never commit a PAT, credential, or private document.
- Use a fine-grained PAT restricted to this single repository with Contents read/write only. Metadata read-only is automatic.
- Sveltia saves a token in browser local storage. Do not authenticate on a shared/public device; clear browser site data and revoke the token after use if there is any doubt.
- Use short token expirations. Revoke a token from GitHub immediately when a device is lost or access changes.
- All uploaded assets, including resumes, are public GitHub repository and GitHub Pages content. Do not upload confidential documents.
- The frontend only assigns content with `textContent`, validates URL schemes, and uses `noopener noreferrer` for new external tabs. `javascript:` links are rejected.

The validation script checks for accidental token patterns in CMS entrypoints; it is not a substitute for GitHub secret scanning and careful review.
