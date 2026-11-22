/* Run with: node scripts/validate-content.js */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const contentDir = path.join(root, 'content');
const files = ['site', 'profile', 'about', 'experience', 'projects', 'research', 'skills', 'certifications', 'education', 'resume', 'contact', 'seo'];
const errors = [];
const read = (name) => {
  try { return JSON.parse(fs.readFileSync(path.join(contentDir, `${name}.json`), 'utf8')); }
  catch (error) { errors.push(`${name}.json: invalid JSON (${error.message})`); return {}; }
};
const required = (value, label) => { if (value === undefined || value === null || value === '') errors.push(`${label} is required`); };
const boolean = (value, label) => { if (value !== undefined && typeof value !== 'boolean') errors.push(`${label} must be true or false`); };
const ids = (items, label) => { const seen = new Set(); (items || []).forEach((item, index) => { required(item.id, `${label}[${index}].id`); if (seen.has(item.id)) errors.push(`${label}: duplicate id '${item.id}'`); seen.add(item.id); }); };
const validUrl = (value, label, optional = true) => { if (!value && optional) return; try { const parsed = new URL(value, 'https://example.test/'); if (!['http:', 'https:'].includes(parsed.protocol) && !/^(?:\.?\.?\/|\/)?[A-Za-z0-9._/-]+$/.test(value)) errors.push(`${label}: unsafe URL`); } catch { errors.push(`${label}: invalid URL`); } };
const repositoryRelative = (value) => String(value || '').trim().replace(/\\/g, '/').replace(/^\/?Muhammed-Fasal\//, '').replace(/^\/+/, '');
const asset = (value, label, optional = true) => { if (!value && optional) return; if (/^(?:https?:)?\/\/|^data:/i.test(value)) return; const relative = repositoryRelative(value); if (!relative || relative.split('/').includes('..') || !fs.existsSync(path.join(root, relative))) errors.push(`${label}: missing asset '${value}'`); };
[
  ['assets/images/hero.jpg', 'assets/images/hero.jpg'],
  ['/assets/images/hero.jpg', 'assets/images/hero.jpg'],
  ['/Muhammed-Fasal/assets/images/hero.jpg', 'assets/images/hero.jpg'],
].forEach(([storedPath, expectedPath]) => {
  const normalized = repositoryRelative(storedPath);
  if (normalized !== expectedPath || !fs.existsSync(path.join(root, normalized))) errors.push(`asset path normalization failed for '${storedPath}'`);
});

const data = Object.fromEntries(files.map((name) => [name, read(name)]));
required(data.site.title, 'site.title'); required(data.profile.fullName, 'profile.fullName'); required(data.contact.email, 'contact.email');
if (data.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email)) errors.push('contact.email: invalid email');
asset(data.profile.profileImage, 'profile.profileImage'); asset(data.seo.openGraphImage, 'seo.openGraphImage');
ids(data.experience.items, 'experience.items'); ids(data.projects.items, 'projects.items'); ids(data.skills.categories, 'skills.categories'); ids(data.certifications.items, 'certifications.items'); ids(data.education.items, 'education.items');
['about', 'experience', 'projects', 'skills', 'research', 'certifications', 'education', 'resume', 'contact'].forEach((section) => boolean(data[section].published, `${section}.published`));
['site', 'profile', 'contact'].forEach((section) => (data[section].socialLinks || data[section].navigation || []).forEach((item, index) => boolean(item.published, `${section}.${section === 'site' ? 'navigation' : 'socialLinks'}[${index}].published`)));
const categories = new Set((data.projects.categories || []).map((item) => item.id));
(data.projects.items || []).forEach((item, index) => { required(item.title, `projects.items[${index}].title`); if (!categories.has(item.category)) errors.push(`projects.items[${index}]: unknown category '${item.category}'`); boolean(item.published, `projects.items[${index}].published`); ['githubUrl', 'liveUrl', 'documentationUrl'].forEach((key) => validUrl(item[key], `projects.items[${index}].${key}`)); asset(item.image, `projects.items[${index}].image`); (item.additionalImages || []).forEach((image, imageIndex) => asset(image, `projects.items[${index}].additionalImages[${imageIndex}]`)); });
(data.experience.items || []).forEach((item, index) => { boolean(item.published, `experience.items[${index}].published`); asset(item.companyLogo, `experience.items[${index}].companyLogo`); });
(data.skills.categories || []).forEach((item, index) => boolean(item.published, `skills.categories[${index}].published`));
(data.certifications.items || []).forEach((item, index) => { required(item.name, `certifications.items[${index}].name`); required(item.issuingOrganization, `certifications.items[${index}].issuingOrganization`); boolean(item.published, `certifications.items[${index}].published`); asset(item.image, `certifications.items[${index}].image`); validUrl(item.credentialUrl, `certifications.items[${index}].credentialUrl`); });
(data.education.items || []).forEach((item, index) => { boolean(item.published, `education.items[${index}].published`); asset(item.institutionLogo, `education.items[${index}].institutionLogo`); });
if (data.resume.pdfPath) { if (!/\.pdf$/i.test(data.resume.pdfPath)) errors.push('resume.pdfPath must end in .pdf'); asset(data.resume.pdfPath, 'resume.pdfPath'); }
['profile', 'contact'].forEach((section) => (data[section].socialLinks || []).forEach((link, index) => validUrl(link.url, `${section}.socialLinks[${index}].url`, false)));
(data.research.platformLinks || []).forEach((link, index) => { validUrl(link.url, `research.platformLinks[${index}].url`, false); boolean(link.published, `research.platformLinks[${index}].published`); });
(data.research.articles || []).forEach((article, index) => { const entry = typeof article === 'string' ? { url: article } : article; validUrl(entry.url, `research.articles[${index}].url`, false); boolean(entry.published, `research.articles[${index}].published`); });
const repoText = fs.readFileSync(path.join(root, 'index.html'), 'utf8') + fs.readFileSync(path.join(root, 'admin', 'config.yml'), 'utf8');
if (/drive\.google\.com/i.test(repoText)) errors.push('Google Drive reference remains in CMS entrypoints');
if (/ghp_[A-Za-z0-9]|github_pat_/i.test(repoText)) errors.push('Potential GitHub token in CMS entrypoints');
if (errors.length) { console.error(`Content validation failed (${errors.length} issue(s)):\n- ${errors.join('\n- ')}`); process.exit(1); }
console.log(`Content validation passed: ${files.length} JSON files, ${data.projects.items.length} projects, ${data.certifications.items.length} certifications.`);
