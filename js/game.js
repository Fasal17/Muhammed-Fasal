// Legacy shim: keep old path compatibility.
if (!window.__mfGameLoaded) {
  window.__mfGameLoaded = true;
  const s = document.createElement('script');
  s.src = 'assets/js/game.js';
  s.defer = true;
  document.head.appendChild(s);
}
