# CMS guide

Open the deployed dashboard at `https://fasal17.github.io/Muhammed-Fasal/admin/`, authenticate as described in [CMS setup](CMS-SETUP.md), select a collection, edit it, and save. A save commits the JSON and any uploaded media to `main`; GitHub Pages then republishes the site.

- **Profile** changes the hero name, summary, image, availability, tool strip, and hero social links.
- **About Me**, **Experience**, **Skills**, **Education**, and **Research and Write-ups** manage their matching public sections. Repeatable records can be reordered with the built-in list controls; `sortOrder` controls public ordering.
- **Projects** includes the shared filter categories and complete card/case-study data. Add a category before assigning it to a project. Set **Show project** off to hide rather than delete.
- **Certifications** lets you replace certificate images and hide old records. Clicking a public card opens its larger image.
- **Resume Manager** accepts a PDF. Leave it empty to keep the graceful “currently being updated” public state. When set, View opens the PDF and Download uses the configured filename.
- **Contact Details** edits the email and social links. **SEO Settings** controls the title, description, sharing image, and canonical URL.

Use the public site preview after each deployment. The CMS does not create a fake login or server-side private dashboard: GitHub repository permissions control writes.
