// Legacy shim: keep old path compatibility.
if (!window.__mfMainLoaded) {
  window.__mfMainLoaded = true;
  const s = document.createElement('script');
  s.src = 'assets/js/main.js';
  s.defer = true;
  document.head.appendChild(s);
}
