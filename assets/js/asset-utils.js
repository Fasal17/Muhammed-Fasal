(() => {
  const repoBase = '/Muhammed-Fasal/';
  const isExternal = (value) => /^(https?:|mailto:|tel:)/i.test(String(value || ''));

  function basePath() {
    const path = window.location.pathname || '/';
    return path === repoBase.slice(0, -1) || path.startsWith(repoBase) ? repoBase : '/';
  }

  function repositoryRelative(value) {
    let path = String(value || '').trim().replace(/\\/g, '/');
    if (path.startsWith(repoBase)) path = path.slice(repoBase.length);
    else if (path.startsWith('/Muhammed-Fasal/')) path = path.slice('/Muhammed-Fasal/'.length);
    path = path.replace(/^\/+/, '');
    while (path.startsWith('./') || path.startsWith('../')) path = path.replace(/^(?:\.\.\/|\.\/)/, '');
    return path;
  }

  function assetUrl(value) {
    if (!value) return '';
    const path = String(value).trim();
    if (!path || isExternal(path) || path.startsWith('data:')) return path;
    const relative = repositoryRelative(path);
    return relative ? `${basePath()}${relative}` : basePath();
  }

  function safeUrl(value, { allowHash = false } = {}) {
    const url = String(value || '').trim();
    if (!url) return '';
    if (allowHash && url.startsWith('#')) return url;
    if (isExternal(url)) return url;
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../') || url.startsWith('assets/') || url.startsWith('Muhammed-Fasal/')) return assetUrl(url);
    try {
      const parsed = new URL(url, window.location.href);
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol) ? parsed.href : '';
    } catch { return ''; }
  }

  window.PortfolioAssets = { assetUrl, safeUrl, isExternal, basePath, repositoryRelative };
})();
