(function () {
  var STORAGE_KEY = 'theme';
  var root = document.documentElement;

  function updateButton(theme) {
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    buttons.forEach(function (button) {
      var icon = button.querySelector('.theme-icon');
      var label = button.querySelector('.theme-label');

      if (theme === 'dark') {
        if (icon) icon.textContent = '☀';
        if (label) label.textContent = 'Light';
        button.setAttribute('aria-label', 'Switch to light theme');
        button.setAttribute('title', 'Switch to light theme');
      } else {
        if (icon) icon.textContent = '☾';
        if (label) label.textContent = 'Dark';
        button.setAttribute('aria-label', 'Switch to dark theme');
        button.setAttribute('title', 'Switch to dark theme');
      }
    });
  }

  function setTheme(theme, animate) {
    if (animate) {
      root.classList.add('theme-changing');
      window.setTimeout(function () {
        root.classList.remove('theme-changing');
      }, 850);
    }

    window.requestAnimationFrame(function () {
      root.setAttribute('data-theme', theme);
      localStorage.setItem(STORAGE_KEY, theme);
      updateButton(theme);
    });
  }

  var savedTheme = localStorage.getItem(STORAGE_KEY);
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  root.setAttribute('data-theme', initialTheme);

  document.addEventListener('DOMContentLoaded', function () {
    updateButton(initialTheme);

    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        var current = root.getAttribute('data-theme') || 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        setTheme(next, true);
      });
    });
  });
})();
