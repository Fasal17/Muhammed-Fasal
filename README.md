# Muhammed Fasal portfolio

A lightweight, GitHub Pages-compatible cybersecurity portfolio with a Git-backed content management system. It remains vanilla HTML, CSS, and JavaScript—there is no application server or database.

## URLs

- Portfolio: <https://fasal17.github.io/Muhammed-Fasal/>
- CMS: <https://fasal17.github.io/Muhammed-Fasal/admin/>

## Architecture

Public pages fetch structured JSON from `content/`. Sveltia CMS at `admin/` authenticates an authorized editor with GitHub and commits content/media directly to `Fasal17/Muhammed-Fasal` on `main`. GitHub Pages publishes those commits.

All current homepage sections—hero, About, experience, skills, project filters/case-study dialogs, research, certifications/certificate viewer, education, resume, contact, footer, and SEO metadata—are content driven. Existing visual styling, theme switcher, responsive layout, and quiz page are retained.

## Local verification

```powershell
node scripts/validate-content.js
python -m http.server 8000
```

Open `http://localhost:8000/`. The CMS GitHub write flow must be manually tested with an authorized GitHub account; never put a token in this repository.

## Documentation

- [CMS setup](docs/CMS-SETUP.md)
- [CMS guide](docs/CMS-GUIDE.md)
- [Content schema](docs/CONTENT-SCHEMA.md)
- [Media management](docs/MEDIA-MANAGEMENT.md)
- [Security](docs/SECURITY.md)
- [Deployment](docs/DEPLOYMENT.md)
