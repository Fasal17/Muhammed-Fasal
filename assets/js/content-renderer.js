(() => {
  const { assetUrl, safeUrl, isExternal } = window.PortfolioAssets;
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  };
  const sorted = (items) => [...(items || [])].filter((item) => item.published !== false).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const appendLink = (parent, label, url, className, options = {}) => {
    const href = safeUrl(url, { allowHash: options.allowHash });
    if (!href) return null;
    const link = el('a', className, label);
    link.href = href;
    if (options.external || isExternal(href)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    if (options.download) link.download = options.download;
    parent.append(link);
    return link;
  };
  const sectionHeader = (data) => {
    const heading = el('div', 'section-heading');
    const left = el('div');
    left.append(el('p', 'section-index', data.sectionIndex), el('h2', '', data.heading));
    heading.append(left);
    if (data.description) heading.append(el('p', '', data.description));
    return heading;
  };
  const setSectionVisibility = (target, data) => {
    const section = target?.closest('section');
    if (section) section.hidden = data?.published === false;
    return data?.published !== false;
  };
  const syncHiddenSectionLinks = () => {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      const target = document.querySelector(link.getAttribute('href'));
      link.hidden = Boolean(target?.hidden);
    });
  };

  function renderHeader(site) {
    document.documentElement.lang = site.language || 'en';
    const brand = document.querySelector('.brand');
    if (brand) { brand.textContent = site.brandInitials || 'MF'; brand.setAttribute('aria-label', `${site.copyrightName || 'Home'}, home`); }
    const nav = document.querySelector('.nav-links');
    if (!nav) return;
    nav.replaceChildren();
    (site.navigation || []).filter((item) => item.published !== false).forEach((item) => appendLink(nav, item.label, `#${item.target}`, '', { allowHash: true }));
  }

  function renderHero(profile) {
    const target = document.querySelector('#hero-content');
    if (!target) return;
    target.replaceChildren();
    const eyebrow = el('p', 'eyebrow', `${profile.professionalHeadline || 'Portfolio'} · ${profile.location || ''}`.replace(/ · $/, ''));
    const heading = el('h1'); heading.append(document.createTextNode(`${profile.heroTitlePrefix || profile.fullName || ''} `), el('span', '', profile.heroTitleAccent || ''));
    const role = el('p', 'hero-role');
    const parts = String(profile.heroSubtitle || profile.designation || '').split('|').map((item) => item.trim()).filter(Boolean);
    role.append(document.createTextNode(parts.shift() || ''));
    if (parts.length) { role.append(el('i'), document.createTextNode(` ${parts.join(' · ')}`)); }
    const actions = el('div', 'hero-actions');
    appendLink(actions, 'View projects ', '#projects', 'button', { allowHash: true });
    appendLink(actions, 'View resume', '#resume', 'button button-outline', { allowHash: true });
    const social = el('div', 'social-links'); social.setAttribute('aria-label', 'Professional profiles');
    (profile.socialLinks || []).filter((item) => item.published !== false).forEach((item) => { const link = appendLink(social, item.label, item.url, '', { external: true }); if (link) link.append(document.createTextNode(' '), el('span', '', '↗')); });
    target.append(eyebrow, heading, role, el('p', 'hero-summary', profile.shortDescription), actions, social);
    const image = document.querySelector('#hero-image');
    if (image && profile.profileImage) { image.src = assetUrl(profile.profileImage); image.alt = profile.profileImageAlt || profile.fullName || ''; }
    const caption = document.querySelector('#hero-caption'); if (caption) caption.replaceChildren(el('span'), document.createTextNode(` ${profile.availability || ''}`));
    const tools = document.querySelector('#tool-strip'); if (tools) { tools.replaceChildren(); (profile.tools || []).forEach((tool) => tools.append(el('span', '', tool))); }
  }

  function renderAbout(data) {
    const target = document.querySelector('#about-content'); if (!target || !setSectionVisibility(target, data)) return;
    target.replaceChildren(); const title = el('div'); title.append(el('p', 'section-index', data.sectionIndex), el('h2', '', data.heading));
    const prose = el('div', 'prose'); (data.paragraphs || []).forEach((p) => prose.append(el('p', '', p))); appendLink(prose, data.contactLinkText || 'Let’s connect', '#contact', 'text-link', { allowHash: true });
    target.append(title, prose);
  }

  function renderExperience(data) {
    const target = document.querySelector('#experience-content'); if (!target || !setSectionVisibility(target, data)) return; target.replaceChildren(sectionHeader(data));
    const timeline = el('div', 'timeline'); sorted(data.items).forEach((item) => {
      const article = el('article', 'timeline-item');
      const dates = `${item.startDate || ''} — ${item.current ? 'Present' : item.endDate || ''}`.replace(/^ — | — $/g, '');
      if (dates) article.append(el('div', 'timeline-date', dates));
      const body = el('div'); const company = el('p', 'item-label', item.company);
      if (item.companyLogo) { const companyLine = el('div', 'company-line'); const logo = el('img', 'experience-logo'); logo.src = assetUrl(item.companyLogo); logo.alt = `${item.company} logo`; logo.loading = 'lazy'; logo.addEventListener('error', () => logo.remove()); companyLine.append(logo, company); body.append(companyLine); } else body.append(company);
      body.append(el('h3', '', item.jobTitle));
      const metadata = [item.employmentType, item.location].filter((value) => String(value || '').trim());
      if (metadata.length) body.append(el('p', 'experience-meta', metadata.join(' · ')));
      if (item.description) body.append(el('p', '', item.description));
      const responsibilities = (item.responsibilities || []).filter((value) => String(value || '').trim());
      if (responsibilities.length) { const list = el('ul'); responsibilities.forEach((responsibility) => list.append(el('li', '', responsibility))); body.append(list); }
      const technologies = (item.technologies || []).filter((value) => String(value || '').trim());
      if (technologies.length) { const tags = el('div', 'tags experience-technologies'); technologies.forEach((technology) => tags.append(el('span', '', technology))); body.append(tags); }
      article.append(body); timeline.append(article);
    }); target.append(timeline);
  }

  function renderSkills(data) {
    const target = document.querySelector('#skills-content'); if (!target || !setSectionVisibility(target, data)) return; target.replaceChildren(sectionHeader(data));
    const grid = el('div', 'skills-grid'); sorted(data.categories).forEach((category) => { const card = el('article', 'skill-card'); card.append(el('h3', '', category.name)); const list = el('ul'); (category.items || []).forEach((item) => list.append(el('li', '', item))); card.append(list); grid.append(card); });
    const method = el('div', 'method'); method.append(el('p', 'method-label', data.methodologyLabel || 'Methodology')); const steps = el('ol'); (data.methodology || []).forEach((step) => steps.append(el('li', '', step))); method.append(steps); target.append(grid, method);
  }

  function renderProjects(data) {
    const target = document.querySelector('#projects-content'); if (!target || !setSectionVisibility(target, data)) return; target.replaceChildren(sectionHeader(data));
    const filters = el('div', 'filters'); filters.setAttribute('role', 'group'); filters.setAttribute('aria-label', 'Filter projects'); const all = el('button', 'filter active', 'All'); all.type = 'button'; all.dataset.filter = 'all'; filters.append(all); (data.categories || []).forEach((category) => { const button = el('button', 'filter', category.label); button.type = 'button'; button.dataset.filter = category.id; filters.append(button); });
    const grid = el('div', 'project-grid'); sorted(data.items).forEach((item) => { const card = el('article', `project-card${item.featured ? ' featured' : ''}`); card.dataset.category = item.category; if (item.image) { const image = el('img', 'project-image'); image.src = assetUrl(item.image); image.alt = item.imageAlt || `${item.title} project preview`; image.loading = 'lazy'; image.addEventListener('error', () => image.remove()); card.append(image); } card.append(el('p', 'card-kicker', item.categoryLabel || item.category), el('h3', '', item.title), el('p', '', item.shortDescription)); const tags = el('div', 'tags'); (item.technologies || []).forEach((tag) => tags.append(el('span', '', tag))); card.append(tags); const footer = el('div', 'card-footer'); const hasDialog = (item.caseStudy && Object.values(item.caseStudy).some(Boolean)) || item.additionalImages?.length; if (hasDialog) { const button = el('button', 'text-link case-study', item.id === 'quiz' ? 'Details ' : 'View case study '); button.type = 'button'; button.dataset.projectId = item.id; button.append(el('span', '', '→')); footer.append(button); } if (item.githubUrl) { const link = appendLink(footer, 'GitHub ↗', item.githubUrl, 'text-link', { external: true }); if (link) link.textContent = 'GitHub ↗'; } if (item.liveUrl) { const link = appendLink(footer, item.id === 'quiz' ? 'Launch quiz ' : 'Live demo ↗', item.liveUrl, 'text-link'); if (link && item.id === 'quiz') link.append(el('span', '', '→')); } card.append(footer); grid.append(card); }); target.append(filters, grid); window.PortfolioContent.projects = data.items || [];
  }

  function renderResearch(data) {
    const target = document.querySelector('#research-content'); if (!target || !setSectionVisibility(target, data)) return; target.replaceChildren(); const heading = el('div'); heading.append(el('p', 'section-index', data.sectionIndex), el('h2', '', data.heading)); const prose = el('div', 'prose'); (data.paragraphs || []).forEach((p) => prose.append(el('p', '', p))); (data.platformLinks || []).filter((link) => link.published !== false).forEach((link) => { const a = appendLink(prose, `${link.label} ↗`, link.url, 'button button-outline', { external: true }); if (a) a.textContent = `${link.label} ↗`; }); const articles = (data.articles || []).filter((article) => typeof article === 'string' || article.published !== false); if (articles.length) { const list = el('ul', 'research-articles'); articles.forEach((article, index) => { const dataItem = typeof article === 'string' ? { url: article } : article; const item = el('li'); appendLink(item, `${dataItem.title || dataItem.label || `Research article ${index + 1}`} ↗`, dataItem.url, '', { external: true }); if (item.childNodes.length) list.append(item); }); if (list.childNodes.length) prose.append(list); } target.append(heading, prose);
  }

  function renderCertifications(data) {
    const target = document.querySelector('#certifications-content'); if (!target || !setSectionVisibility(target, data)) return; target.replaceChildren(sectionHeader(data)); const grid = el('div', 'cert-grid'); sorted(data.items).forEach((item) => { const card = el('article', 'cert-card'); const button = el('button', 'cert-card-main certificate'); button.type = 'button'; button.dataset.certificate = assetUrl(item.image); button.dataset.title = item.name; const image = el('img'); image.src = assetUrl(item.image); image.alt = `${item.name} certificate`; image.loading = 'lazy'; image.addEventListener('error', () => image.remove()); button.append(image, el('span', '', item.issuingOrganization), el('strong', '', item.name), el('small', '', item.issueDate ? `Issued ${item.issueDate}` : 'View certificate')); card.append(button); if (item.credentialUrl) { const credential = appendLink(card, 'View credential ↗', item.credentialUrl, 'cert-credential', { external: true }); if (credential) credential.textContent = 'View credential ↗'; } grid.append(card); }); target.append(grid);
  }

  function renderEducation(data) { const target = document.querySelector('#education-content'); if (!target || !setSectionVisibility(target, data)) return; target.replaceChildren(); const title = el('div'); title.append(el('p', 'section-index', data.sectionIndex), el('h2', '', data.heading)); target.append(title); const entries = el('div', 'education-list'); sorted(data.items).forEach((item) => { const card = el('article', 'education-card'); const dates = `${item.startDate || ''} — ${item.endDate || ''}`.replace(/^ — | — $/g, ''); if (dates) card.append(el('p', 'item-label', dates)); card.append(el('h3', '', item.qualification)); const institution = el('p', '', item.institution); if (item.institutionLogo) { const line = el('div', 'company-line'); const logo = el('img', 'experience-logo education-logo'); logo.src = assetUrl(item.institutionLogo); logo.alt = `${item.institution} logo`; logo.loading = 'lazy'; logo.addEventListener('error', () => logo.remove()); line.append(logo, institution); card.append(line); } else card.append(institution); if (item.fieldOfStudy) card.append(el('p', 'education-field', `Field of study: ${item.fieldOfStudy}`)); if (item.description) card.append(el('p', '', item.description)); entries.append(card); }); target.append(entries); }

  function renderResume(data) { const target = document.querySelector('#resume-content'); if (!target || !setSectionVisibility(target, data)) return; target.replaceChildren(); const left = el('div'); left.append(el('p', 'section-index', data.sectionIndex), el('h2', '', data.title), el('p', '', data.description)); const actions = el('div', 'resume-actions'); const path = safeUrl(data.pdfPath); if (path && /\.pdf(?:$|[?#])/i.test(path)) { const view = appendLink(actions, `${data.viewButtonText || 'View resume'} ↗`, path, 'button', { external: true }); if (view) view.textContent = `${data.viewButtonText || 'View resume'} ↗`; appendLink(actions, data.downloadButtonText || 'Download resume', path, 'button button-outline', { download: data.downloadFilename || 'resume.pdf' }); } else { const notice = el('p', 'resume-unavailable', 'A downloadable resume will be available here once uploaded.'); actions.append(notice); } target.append(left, actions); }

  function renderContact(data) { const target = document.querySelector('#contact-content'); if (!target || !setSectionVisibility(target, data)) return; target.replaceChildren(el('p', 'section-index', data.sectionIndex), el('h2', '', data.heading), el('p', '', data.description)); const email = safeUrl(`mailto:${data.email || ''}`); if (email) { const link = el('a', 'contact-email', data.email); link.href = email; link.append(document.createTextNode(' '), el('span', '', '↗')); target.append(link); } const links = el('div', 'contact-links'); (data.socialLinks || []).filter((link) => link.published !== false).forEach((item) => appendLink(links, item.label, item.url, '', { external: true })); target.append(links); }

  function renderFooter(site) { const footer = document.querySelector('#footer-content'); if (!footer) return; footer.replaceChildren(); const copy = el('span'); copy.append(document.createTextNode(`© ${new Date().getFullYear()} ${site.copyrightName || ''}`)); footer.append(copy); appendLink(footer, site.footerText || 'Back to top', '#home', '', { allowHash: true }); }

  function applySeo(data) { if (!data) return; if (data.siteTitle) document.title = data.siteTitle; const description = document.querySelector('meta[name="description"]'); if (description && data.metaDescription) description.content = data.metaDescription; const canonical = document.querySelector('link[rel="canonical"]'); if (canonical && data.canonicalUrl) canonical.href = data.canonicalUrl; ['og:title', 'og:description', 'og:image'].forEach((property) => { const meta = document.querySelector(`meta[property="${property}"]`); if (!meta) return; const value = property === 'og:title' ? data.socialTitle : property === 'og:description' ? data.socialDescription : assetUrl(data.openGraphImage); if (value) meta.content = value; }); }

  function render(data) { window.PortfolioContent = window.PortfolioContent || {}; renderHeader(data.site); renderHero(data.profile); renderAbout(data.about); renderExperience(data.experience); renderSkills(data.skills); renderProjects(data.projects); renderResearch(data.research); renderCertifications(data.certifications); renderEducation(data.education); renderResume(data.resume); renderContact(data.contact); renderFooter(data.site); syncHiddenSectionLinks(); applySeo(data.seo); }
  window.PortfolioRenderer = { render };
})();
