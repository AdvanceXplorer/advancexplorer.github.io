(function () {
  const root = document.documentElement;
  const button = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');

  if (saved === 'dark' || saved === 'light') {
    root.setAttribute('data-theme', saved);
  }

  function label() {
    if (!button) return;
    button.textContent = root.getAttribute('data-theme') === 'dark' ? 'Light' : 'Dark';
  }

  label();

  if (button) {
    button.addEventListener('click', function () {
      document.body.classList.add('theme-transition');
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      label();
      window.setTimeout(function () {
        document.body.classList.remove('theme-transition');
      }, 280);
    });
  }
})();
