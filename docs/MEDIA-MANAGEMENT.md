# Media management

Media is committed into this repository, so every upload is public after GitHub Pages deploys it.

| Content | Repository folder | Accepted format |
| --- | --- | --- |
| General/SEO images | `assets/uploads/images/` | JPG, JPEG, PNG, WEBP |
| Profile image | `assets/uploads/profile/` | JPG, JPEG, PNG, WEBP |
| Project images | `assets/uploads/projects/` | JPG, JPEG, PNG, WEBP |
| Certificates | `assets/uploads/certifications/` | JPG, JPEG, PNG, WEBP |
| Education media | `assets/uploads/education/` | JPG, JPEG, PNG, WEBP |
| Resume | `assets/uploads/documents/` | PDF |

The CMS restricts image/PDF MIME choices and its documented global upload-size check is set to 10 MB, so the resume can be uploaded. Keep standard images and certificates at or below 5 MB as an editorial rule; optimize ordinary photos to WEBP when readability permits. Sveltia detects duplicate uploaded file hashes and reuses the existing asset.

## Repository storage versus published URLs

`media_folder` is the repository storage location Sveltia writes to, such as `/assets/uploads/projects`. It remains relative to this repository's root so uploaded files are committed under `assets/uploads/`.

`public_folder` is the URL stored in content after upload. This site is a GitHub Pages **project site**, so every CMS public URL includes the repository prefix: `/Muhammed-Fasal/assets/uploads/...`. For example, a project image stored at `assets/uploads/projects/example.webp` is published as `/Muhammed-Fasal/assets/uploads/projects/example.webp`.

The frontend normalizes both these CMS URLs and older paths such as `assets/images/hero1.jpg` when it runs locally or under GitHub Pages.

Use clear lowercase, hyphenated filenames. Replace a selected image/PDF in its field rather than manually editing a path. Existing legacy files in `assets/images/` and `assets/images/certs/` remain usable.
