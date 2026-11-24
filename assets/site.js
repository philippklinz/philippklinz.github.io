(() => {
  'use strict';
  const root = document.documentElement;
  const theme = document.querySelector('#theme');
  if (theme) {
    theme.hidden = false;
    theme.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
    theme.addEventListener('click', () => {
      const dark = root.dataset.theme !== 'dark';
      root.dataset.theme = dark ? 'dark' : 'light';
      theme.setAttribute('aria-pressed', String(dark));
      try { localStorage.setItem('pk-theme', dark ? 'dark' : 'light'); } catch (_) {}
    });
  }
  const menu = document.querySelector('.languages');
  if (!menu) return;
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', event => {
    if (!menu.contains(event.target)) menu.open = false;
  });
  const updateLanguageLinks = () => {
    document.querySelectorAll('.language-link').forEach(link => {
      const destination = new URL(link.href);
      destination.search = location.search;
      destination.hash = location.hash;
      link.href = destination.href;
    });
  };
  updateLanguageLinks();
  window.addEventListener('hashchange', updateLanguageLinks);
  window.addEventListener('popstate', updateLanguageLinks);
})();
