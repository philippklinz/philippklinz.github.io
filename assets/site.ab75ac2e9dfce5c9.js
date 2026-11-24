(() => {
  'use strict';
  // Deter simple address harvesters while retaining a readable no-JS fallback.
  document.querySelectorAll('[data-email]').forEach(element => {
    const address = atob(element.dataset.email);
    const link = document.createElement('a');
    link.href = `mailto:${address}`;
    link.textContent = address;
    element.replaceChildren(link);
  });
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
      const version = destination.searchParams.get('v');
      destination.search = location.search;
      // Preserve the target build, even when the current URL has an older v.
      if (version) destination.searchParams.set('v', version);
      destination.hash = location.hash;
      link.href = destination.href;
    });
  };
  const hero = document.querySelector('.hero');
  const tablist = hero?.querySelector('.hero-tabs');
  const tabs = tablist ? [...tablist.querySelectorAll('[data-slide]')] : [];
  const panels = hero ? [...hero.querySelectorAll('.hero-panel')] : [];
  const slideIds = tabs.map(tab => tab.dataset.slide);
  let activeSlide = 'profile';
  function slideFromURL() {
    const url = new URL(location.href);
    const anchor = url.hash.slice(1);
    if (slideIds.includes(anchor)) return anchor;
    const requested = url.searchParams.get('slide');
    return slideIds.includes(requested) ? requested : 'profile';
  }
  function selectSlide(id, writeURL = false) {
    activeSlide = slideIds.includes(id) ? id : 'profile';
    panels.forEach(panel => {
      const active = panel.id === activeSlide;
      panel.classList.toggle('is-active', active);
      panel.setAttribute('aria-hidden', String(!active));
      panel.inert = !active;
    });
    tabs.forEach(tab => {
      const active = tab.dataset.slide === activeSlide;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    if (writeURL) {
      const url = new URL(location.href);
      if (activeSlide === 'profile') url.searchParams.delete('slide');
      else url.searchParams.set('slide', activeSlide);
      url.hash = activeSlide;
      try { history.replaceState(null, '', url); } catch (_) {}
    }
    updateLanguageLinks();
  }
  if (tabs.length === 3 && panels.length === 3) {
    tablist.setAttribute('role', 'tablist');
    tabs.forEach(tab => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', tab.dataset.slide);
      tab.addEventListener('click', event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        selectSlide(tab.dataset.slide, true);
      });
      tab.addEventListener('keydown', event => {
        if (event.key === ' ') {
          event.preventDefault();
          selectSlide(tab.dataset.slide, true);
          return;
        }
        let index = tabs.indexOf(tab);
        if (event.key === 'ArrowRight') index = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') index = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') index = 0;
        else if (event.key === 'End') index = tabs.length - 1;
        else return;
        event.preventDefault();
        selectSlide(tabs[index].dataset.slide, true);
        tabs[index].focus();
      });
    });
    panels.forEach(panel => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `tab-${panel.id}`);
      panel.tabIndex = 0;
    });
    selectSlide(slideFromURL());
    hero.classList.add('is-enhanced');
    const restoreSlide = () => selectSlide(slideFromURL());
    window.addEventListener('hashchange', restoreSlide);
    window.addEventListener('popstate', restoreSlide);
  }
  updateLanguageLinks();
  window.addEventListener('hashchange', updateLanguageLinks);
  window.addEventListener('popstate', updateLanguageLinks);
})();
