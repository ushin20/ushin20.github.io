const metaTags = [
  {
    name: "description",
    content:
      "Yooshin Kim is an industrial AI security researcher at DGIST focusing on ICS anomaly detection, passive authentication, privacy-preserving monitoring, and contextual digital twins.",
  },
  { name: "author", content: "Yooshin Kim" },
  {
    name: "keywords",
    content:
      "Yooshin Kim, industrial AI security, ICS security, anomaly detection, passive authentication, digital twin, DGIST",
  },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
  { name: "theme-color", content: "#f3f1ea" },
];

metaTags.forEach((tag) => {
  const meta = document.createElement("meta");
  Object.entries(tag).forEach(([key, value]) => {
    meta.setAttribute(key, value);
  });
  document.head.appendChild(meta);
});

const navItems = [
  { href: "/pages/publication.html", label: "Publications" },
  { href: "/pages/project.html", label: "Projects" },
  { href: "/pages/about.html", label: "About" },
  { href: "/pages/article.html", label: "Writing" },
];

const externalItems = [
  { href: "mailto:yooshin0303@dgist.ac.kr", label: "Email" },
  {
    href: "https://scholar.google.com/citations?user=jgpnm14AAAAJ&hl=ko",
    label: "Scholar",
    external: true,
  },
  { href: "https://github.com/ushin20", label: "GitHub", external: true },
];

function isActivePath(href, pathname) {
  if (href === "/index.html") {
    return pathname === "/" || pathname === "/index.html";
  }
  return pathname === href;
}

document.addEventListener("DOMContentLoaded", () => {
  const frameElement = document.querySelector(".frame");
  if (!frameElement) {
    return;
  }

  const currentPath = window.location.pathname;
  const topbar = document.createElement("header");
  topbar.className = "topbar";

  const navHtml = navItems
    .map(
      (item) =>
        `<a href="${item.href}" class="${isActivePath(item.href, currentPath) ? "active" : ""}">${item.label}</a>`
    )
    .join("");

  const externalHtml = externalItems
    .map((item) => {
      const attrs = item.external ? ' target="_blank" rel="noopener"' : "";
      return `<a href="${item.href}"${attrs}>${item.label}</a>`;
    })
    .join("");

  topbar.innerHTML = `
    <a class="brand" href="/index.html" aria-label="Yooshin Kim home">
      <span class="brand-mark">YK</span>
      <span class="brand-copy">
        <strong>Yooshin Kim</strong>
        <span>Industrial AI Security</span>
      </span>
    </a>

    <button class="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false">
      Menu
    </button>

    <div class="topbar-nav">
      <nav class="pages-container" aria-label="Primary">${navHtml}</nav>
      <div class="sites" aria-label="External links">${externalHtml}</div>
    </div>
  `;

  frameElement.prepend(topbar);

  const menuBtn = topbar.querySelector(".menu-toggle");

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const isOpen = topbar.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
      if (!topbar.contains(event.target)) {
        topbar.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        topbar.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }
});
