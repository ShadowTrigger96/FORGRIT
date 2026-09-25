(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-button');
  function setTheme(theme) {
    root.dataset.theme = theme;
    themeButton.setAttribute('aria-label', theme === 'dark' ? 'Világos megjelenés bekapcsolása' : 'Sötét megjelenés bekapcsolása');
  }
  try { setTheme(localStorage.getItem('fg-theme') === 'light' ? 'light' : 'dark'); } catch { setTheme('dark'); }
  themeButton.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(theme);
    try { localStorage.setItem('fg-theme', theme); } catch { /* Storage may be unavailable. */ }
  });

  const tablist = document.querySelector('.gallery-tabs');
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  function activate(tab, focus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activate(tabs[next], true); }
    });
  });
  activate(tabs[0]);
  tablist.hidden = false;

  const dialog = document.querySelector('.image-dialog');
  const enlarged = dialog.querySelector('img');
  const caption = document.getElementById('image-caption');
  let opener;
  if (typeof dialog.showModal === 'function') {
    document.querySelectorAll('.zoom-link').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        opener = link;
        enlarged.src = link.href;
        enlarged.alt = link.querySelector('img').alt;
        caption.textContent = link.dataset.caption;
        dialog.showModal();
        document.body.style.overflow = 'hidden';
      });
    });
    dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { document.body.style.overflow = ''; opener?.focus({ preventScroll: true }); });
  }
})();
