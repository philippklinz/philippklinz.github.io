/* Apply the optional appearance preference before the first paint. */
try {
  if (localStorage.getItem('pk-theme') === 'dark') document.documentElement.dataset.theme = 'dark';
} catch (_) { /* The default light appearance works with storage disabled. */ }
