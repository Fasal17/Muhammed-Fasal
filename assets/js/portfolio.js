(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let initialized = false;

  function safeContentDialog(project) {
    const dialog = $('#project-dialog');
    if (!dialog || !project) return;
    $('#dialog-title', dialog).textContent = project.title || '';
    $('#dialog-category', dialog).textContent = project.categoryLabel || project.category || '';
    const body = $('#dialog-content', dialog); body.replaceChildren();
    const study = project.caseStudy || {};
    const add = (tag, text, className) => { if (!text) return; const node = document.createElement(tag); if (className) node.className = className; node.textContent = text; body.append(node); };
    add('p', study.environment, 'dialog-environment');
    [['Objective', study.objective], ['Approach', study.approach], ['Implementation', study.implementation], ['Outcome', study.outcome], ['Lessons learned', study.lessonsLearned]].forEach(([heading, text]) => { if (text) { add('h3', heading); add('p', text); } });
    if (study.features?.length) { add('h3', 'Capabilities'); const list = document.createElement('ul'); study.features.forEach((feature) => { const item = document.createElement('li'); item.textContent = feature; list.append(item); }); body.append(list); }
    if (project.additionalImages?.length) {
      add('h3', 'Additional images');
      const gallery = document.createElement('div'); gallery.className = 'dialog-gallery';
      project.additionalImages.forEach((path, index) => {
        const image = document.createElement('img');
        image.src = window.PortfolioAssets.assetUrl(path);
        image.alt = `${project.title || 'Project'} image ${index + 1}`;
        image.loading = 'lazy';
        image.addEventListener('error', () => image.remove());
        gallery.append(image);
      });
      if (gallery.childNodes.length) body.append(gallery);
    }
    if (!body.childNodes.length) add('p', project.fullDescription || project.shortDescription);
    dialog.showModal(); $('.dialog-close', dialog)?.focus();
  }

  function initInteractions() {
    if (initialized) return; initialized = true;
    const menuButton = $('.menu-toggle'); const menu = $('#site-menu'); const themeButton = $('.theme-toggle'); const progress = $('.scroll-progress span'); const header = $('.site-header'); const backToTop = $('.back-to-top');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const closeMenu = () => { menu?.classList.remove('open'); menuButton?.setAttribute('aria-expanded', 'false'); };
    menuButton?.addEventListener('click', () => { const open = menu.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
    menu?.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
    themeButton?.addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; localStorage.setItem('mf-theme', next); themeButton.setAttribute('aria-label', `Switch to ${next === 'dark' ? 'light' : 'dark'} theme`); });
    themeButton?.setAttribute('aria-label', `Switch to ${document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'} theme`);

    const updateScrollUI = () => { const max = document.documentElement.scrollHeight - window.innerHeight; if (progress) progress.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`; header?.classList.toggle('scrolled', window.scrollY > 60); backToTop?.classList.toggle('visible', window.scrollY > 600); };
    window.addEventListener('scroll', updateScrollUI, { passive: true }); updateScrollUI();
    const navLinks = $$('.nav-links a'); const sections = $$('main section[id]');
    if ('IntersectionObserver' in window) { const navObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)); }), { rootMargin: '-28% 0px -62% 0px', threshold: 0 }); sections.forEach((section) => navObserver.observe(section)); }

    document.addEventListener('click', (event) => {
      const filter = event.target.closest('.filter');
      if (filter) { $$('.filter').forEach((button) => button.classList.toggle('active', button === filter)); const category = filter.dataset.filter; $$('.project-card').forEach((card) => card.classList.toggle('hidden', category !== 'all' && card.dataset.category !== category)); return; }
      const caseButton = event.target.closest('.case-study');
      if (caseButton) { const project = (window.PortfolioContent?.projects || []).find((item) => item.id === caseButton.dataset.projectId); safeContentDialog(project); return; }
      const certificate = event.target.closest('.certificate');
      if (certificate) { const dialog = $('#certificate-dialog'); $('#certificate-title', dialog).textContent = certificate.dataset.title || ''; const image = $('#certificate-image', dialog); image.src = certificate.dataset.certificate || ''; image.alt = `${certificate.dataset.title || 'Certificate'} certificate`; dialog.showModal(); $('.dialog-close', dialog)?.focus(); }
    });
    $$('.dialog').forEach((dialog) => { $('.dialog-close', dialog)?.addEventListener('click', () => dialog.close()); dialog.addEventListener('click', (event) => { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); }); });
    $('#certificate-dialog')?.addEventListener('close', () => $('#certificate-image')?.removeAttribute('src'));
    if (!reduceMotion && 'IntersectionObserver' in window) { document.documentElement.classList.add('motion-ready'); const targets = $$('.section-heading, .two-column > *, .research-grid > *, .resume-panel > *, .timeline-item, .skill-card, .project-card, .cert-card, .education-card, .contact .container'); targets.forEach((node, index) => { node.classList.add('reveal'); if (node.matches('.timeline-item') && index % 2 === 0) node.classList.add('reveal-left'); if (node.matches('.skill-card')) node.classList.add('reveal-scale'); }); const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.12 }); targets.forEach((node) => observer.observe(node)); }
  }

  document.addEventListener('portfolio:content-ready', initInteractions, { once: true });
})();
