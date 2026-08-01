(() => {
  const storageKey = "ushin20-theme";
  const root = document.documentElement;

  function getStoredTheme() {
    try {
      const theme = localStorage.getItem(storageKey);
      return theme === "dark" || theme === "light" ? theme : null;
    } catch (error) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      return;
    }
  }

  function getCurrentTheme() {
    return root.dataset.theme === "dark" ? "dark" : "light";
  }

  function ensureSiteThemeToggle() {
    if (document.body.classList.contains("home-body") || document.querySelector(".site-theme-toggle")) {
      return;
    }

    const nav = document.querySelector(".site-nav");
    if (!nav) {
      return;
    }

    const toggle = document.createElement("button");
    toggle.className = "site-theme-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-pressed", "false");
    toggle.setAttribute("data-theme-toggle", "");

    const icon = document.createElement("span");
    icon.className = "site-theme-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("data-theme-icon", "");

    toggle.append(icon);
    nav.append(toggle);
  }

  function setToggleState(theme) {
    const isDark = theme === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      toggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";

      const icon = toggle.querySelector("i");
      if (icon) {
        icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
      }

      const siteIcon = toggle.querySelector("[data-theme-icon]");
      if (siteIcon) {
        siteIcon.textContent = isDark ? "☀" : "☾";
      }
    });
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    setToggleState(theme);
  }

  ensureSiteThemeToggle();
  applyTheme(root.dataset.theme === "dark" ? "dark" : getStoredTheme() || "light");

  document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      setStoredTheme(nextTheme);
    });
  });
})();
