(() => {
  // Change this date when publishing a content or design update.
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

  document.querySelectorAll("[data-site-updated]").forEach((element) => {
    element.dateTime = lastUpdated;
    element.textContent = dateFormatter.format(new Date(`${lastUpdated}T00:00:00Z`));
  });

  const clocks = document.querySelectorAll("[data-korea-clock]");
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
  document.querySelectorAll(".footer-meta").forEach((element) => {
    element.hidden = false;
  });
  document.addEventListener("visibilitychange", updateClock);
  window.addEventListener("pageshow", updateClock);
})();
