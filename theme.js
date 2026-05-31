(function () {
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    var button = document.querySelector('[data-theme-toggle]');
    if (button) button.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }

  var saved = localStorage.getItem('theme') || 'light';
  setTheme(saved);

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.querySelector('[data-theme-toggle]');
    if (!button) return;
    button.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  });
})();
