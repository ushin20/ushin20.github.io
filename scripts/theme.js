(() => {
  const root = document.documentElement;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const storageKey = "portfolio-theme";
  const localFile = location.protocol === "file:";
  const siteRoot = new URL("../", document.currentScript.src);

  function parsePreference(value) {
    const match = /^(light|dark):(\d+)$/.exec(value || "");
    return match ? { mode: match[1], selectedAt: Number(match[2]) } : null;
  }

  function readPreference() {
    let saved = null;
    try {
      saved = parsePreference(localStorage.getItem(storageKey));
    } catch {
      // The browser can make storage unavailable in local previews.
    }
    if (!localFile) return saved;

    const carried = parsePreference(new URLSearchParams(location.search).get("theme"));
    return carried && (!saved || carried.selectedAt > saved.selectedAt) ? carried : saved;
  }

  let preference = readPreference();

  function applyTheme() {
    const dark = preference ? preference.mode === "dark" : systemTheme.matches;
    root.dataset.theme = dark ? "dark" : "light";
    themeColor.content = dark ? "#17181a" : "#ffffff";
    document.querySelector("[data-theme-toggle]")?.setAttribute("aria-pressed", String(dark));
  }

  applyTheme();
  document.addEventListener("DOMContentLoaded", applyTheme);
  systemTheme.addEventListener("change", applyTheme);
  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    preference = readPreference();
    applyTheme();
  });
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    preference = readPreference() || preference;
    applyTheme();
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest?.("[data-theme-toggle]")) {
      preference = {
        mode: root.dataset.theme === "dark" ? "light" : "dark",
        selectedAt: Date.now(),
      };
      try {
        localStorage.setItem(storageKey, `${preference.mode}:${preference.selectedAt}`);
      } catch {
        // The selected mode still applies to the current page.
      }
      applyTheme();
      return;
    }

    // Directly opened HTML files may have a separate storage area per page.
    if (!localFile || !preference) return;
    const link = event.target.closest?.("a[href]");
    if (!link || link.hasAttribute("download")) return;
    const target = new URL(link.href);
    if (
      target.protocol !== "file:" ||
      !target.pathname.startsWith(siteRoot.pathname) ||
      !target.pathname.endsWith(".html") ||
      target.pathname === location.pathname
    ) {
      return;
    }
    target.searchParams.set("theme", `${preference.mode}:${preference.selectedAt}`);
    link.href = target.href;
  });
})();
