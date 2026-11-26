(() => {
  const footer = document.querySelector("[data-site-footer]");
  if (!footer) return;

  const siteRoot = new URL("../", document.currentScript.src);
  const homeUrl = new URL("index.html", siteRoot).href;
  const toolsUrl = new URL("lab.html", siteRoot).href;
  const chaltteokUrl = new URL("assets/chaldduck-rolling-double-blink.webp", siteRoot).href;
  const isHome = document.body.classList.contains("about-body");
  const isToolIndex = document.body.classList.contains("lab-body");

  footer.innerHTML = `
    <div class="footer-main">
      <a href="${homeUrl}">© Yooshin Kim</a>
      <div class="footer-links">
        <button class="footer-theme-toggle" type="button" aria-pressed="false" data-theme-toggle>
          Dark mode <span class="footer-theme-indicator" aria-hidden="true"></span>
        </button>
        ${isHome ? '<a href="#about">Back to top <span aria-hidden="true">↑</span></a>' : ""}
        ${isToolIndex
          ? `<a href="${homeUrl}">About <span aria-hidden="true">→</span></a>`
          : `<a class="footer-tool-link" href="${toolsUrl}">Tool <span aria-hidden="true">→</span></a>`}
      </div>
    </div>
    <div class="footer-meta" hidden>
      <p>Updated <time data-site-updated></time></p>
      <p class="footer-location">
        <span><time data-korea-clock></time> in South Korea</span>
        <span class="footer-chaltteok-zoom">
          <img class="footer-chaltteok" src="${chaltteokUrl}" width="36" height="29" loading="lazy" decoding="async" alt="" aria-hidden="true" />
        </span>
      </p>
    </div>
  `;

  // The Pages workflow replaces this fallback date in the deployed copy.
  const lastUpdated = "2026-10-18";
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const clockFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  footer.querySelectorAll("[data-site-updated]").forEach((element) => {
    element.dateTime = lastUpdated;
    element.textContent = dateFormatter.format(new Date(`${lastUpdated}T00:00:00Z`));
  });

  const clocks = footer.querySelectorAll("[data-korea-clock]");
  let timer;

  function updateClock() {
    clearTimeout(timer);
    const now = new Date();
    clocks.forEach((element) => {
      element.dateTime = now.toISOString();
      element.textContent = clockFormatter.format(now);
    });
    if (!document.hidden && clocks.length) {
      timer = setTimeout(updateClock, 60000 - (Date.now() % 60000));
    }
  }

  updateClock();
  footer.querySelectorAll(".footer-meta").forEach((element) => {
    element.hidden = false;
  });
  document.addEventListener("visibilitychange", updateClock);
  window.addEventListener("pageshow", updateClock);
})();
