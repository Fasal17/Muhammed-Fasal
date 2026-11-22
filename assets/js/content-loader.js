(() => {
  const files = ['site', 'profile', 'about', 'experience', 'projects', 'research', 'skills', 'certifications', 'education', 'resume', 'contact', 'seo'];
  const fallback = {
    site: { language: 'en', brandInitials: 'MF', navigation: [] }, profile: {}, about: {}, experience: { items: [] }, projects: { items: [], categories: [] }, research: {}, skills: { categories: [] }, certifications: { items: [] }, education: { items: [] }, resume: {}, contact: {}, seo: {}
  };

  async function load(name) {
    const url = window.PortfolioAssets.assetUrl(`content/${name}.json`);
    try {
      const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}v=${encodeURIComponent(document.documentElement.dataset.contentVersion || '1')}`, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error(`Portfolio content could not load: ${name}.json`, error);
      return fallback[name];
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const entries = await Promise.all(files.map(async (name) => [name, await load(name)]));
    const content = Object.fromEntries(entries);
    window.PortfolioContent = content;
    window.PortfolioRenderer.render(content);
    document.documentElement.classList.add('content-ready');
    document.dispatchEvent(new CustomEvent('portfolio:content-ready', { detail: content }));
  });
})();
