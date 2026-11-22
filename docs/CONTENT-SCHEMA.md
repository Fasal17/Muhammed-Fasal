# Content schema

All public content is JSON under `content/`. These files are edited from the corresponding Sveltia CMS collection.

| File | Purpose |
| --- | --- |
| `site.json` | title, navigation, footer and brand |
| `profile.json` | hero, image, availability, tools and hero links |
| `about.json` | biography and visibility |
| `experience.json` | repeatable work history |
| `projects.json` | category filters, projects, links and case studies |
| `skills.json` | skill categories and methodology |
| `research.json` | research copy and platform links |
| `certifications.json` | credentials and certificate images |
| `education.json` | repeatable education entries |
| `resume.json` | public resume state and PDF path |
| `contact.json` | email, availability and social links |
| `seo.json` | document title, metadata and sharing image |

Repeatable items have an `id`, `sortOrder`, and `published` flag where public visibility is relevant. Project category IDs are defined once in `projects.json` and each project refers to one; keep IDs lowercase with hyphens. Use CMS validation for required text, field types, formats, and paths, then run `node scripts/validate-content.js` before merging code-authored changes.
