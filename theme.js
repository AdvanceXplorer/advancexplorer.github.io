
(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") root.dataset.theme = stored;
  const btn = document.querySelector("#themeToggle");
  function label() {
    if (btn) btn.textContent = root.dataset.theme === "dark" ? "Light" : "Dark";
  }
  label();
  if (btn) {
    btn.addEventListener("click", function () {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", root.dataset.theme);
      label();
    });
  }
})();
