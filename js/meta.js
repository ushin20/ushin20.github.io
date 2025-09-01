const metaTags = [
  { name: "description", content: "Design home of ushin20" },
  { name: "author", content: "Yooshin Kim" },
  {
    name: "keywords",
    content: "ushin20, ushin, yooshin, yooshin kim, portfolio, dgist",
  },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
];

metaTags.forEach((tag) => {
  const meta = document.createElement("meta");
  Object.keys(tag).forEach((key) => {
    meta.setAttribute(key, tag[key]);
  });
  document.head.appendChild(meta);
});

// Add Font Awesome link tag
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css";
link.integrity = "sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==";
link.crossOrigin = "anonymous";
link.referrerPolicy = "no-referrer";

// Append the link tag to the document head
document.head.appendChild(link);

// add topbar
// add topbar
document.addEventListener("DOMContentLoaded", function () {
  const frameElement = document.querySelector(".frame");

  const topbarDiv = document.createElement("div");
  topbarDiv.className = "topbar";
  topbarDiv.innerHTML = `
      <a class="logo-container" href="/index.html" aria-label="Home">
        <img src="/assets/logo.png" alt="Site logo" />
      </a>

      <!-- 모바일 전용 토글 버튼 -->
      <button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <i class="fa-solid fa-bars"></i>
      </button>

      <!-- 네비게이션 그룹: 모바일에서 통째로 토글 -->
      <div class="topbar-nav" id="topbarNav">
        <div class="pages-container" role="navigation" aria-label="Primary">
          <a href="/pages/publication.html">Publications</a> 
          <a href="/pages/project.html">Projects</a> 
          <a href="/pages/about.html">About</a> 
          <a href="/pages/article.html">Article</a>
        </div>

        <div class="sites" aria-label="External links">
          <a href="/index.html" class="email" aria-label="Home">
            <i class="fa-solid fa-house"></i>
          </a>
          <a href="https://github.com/ushin20" class="email" target="_blank" rel="noopener" aria-label="GitHub">
            <i class="fa-brands fa-git"></i>
          </a>
          <a href="https://ushin20-skin.tistory.com/" class="email" target="_blank" rel="noopener" aria-label="Tistory">
            <i class="fa-solid fa-cube"></i>
          </a>

          <div class="conference-wrapper">
            <div class="conference-icon" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false" aria-label="Open conference list">
              <i class="fa-solid fa-landmark"></i>
            </div>
            <div class="conference-menu" role="menu" aria-label="Conferences">
              <a href="https://www.ieee-security.org/TC/SP-Index.html" target="_blank">IEEE S&P</a>
              <a href="https://www.ndss-symposium.org/" target="_blank">NDSS</a>
              <a href="https://www.sigsac.org/ccs.html" target="_blank">ACM CCS</a>
              <a href="https://www.usenix.org/conferences/byname/108" target="_blank">USENIX Sec</a>
              <a href="https://dblp.uni-trier.de/db/conf/eurosp/index.html" target="_blank">Euro S&P</a>
              <a href="https://www.acsac.org/" target="_blank">ACSAC</a>
              <a href="https://petsymposium.org/" target="_blank">PoPETs</a>
              <a href="http://jianying.space/asiaccs/" target="_blank">Asia CCS</a>
              <a href="https://conf.laas.fr/esorics/esorics.html" target="_blank">ESORICS</a>
              <a href="https://www.ieee-ies.org/pubs/transactions-on-industrial-informatics" target="_blank">Industrial<br/>Informatics</a>
              <a href="https://www.kdd.org/" target="_blank">KDD</a>
              <a href="https://aaai.org/" target="_blank">AAAI</a>
              <a href="https://iclr.cc/" target="_blank">ICLR</a>
              <a href="https://neurips.cc/" target="_blank">NIPS</a>
            </div>
          </div>
        </div>
      </div>
  `;

  if (frameElement) frameElement.prepend(topbarDiv);

  // 컨퍼런스 메뉴: 기존 로직 유지(바깥 클릭 시 닫힘)
  document.addEventListener("click", function (e) {
    const wrapper = e.target.closest(".conference-wrapper");
    const isMenu = e.target.closest(".conference-menu");

    document.querySelectorAll(".conference-menu").forEach((menu) => {
      menu.style.display = "none";
    });

    if (wrapper && !isMenu) {
      const menu = wrapper.querySelector(".conference-menu");
      if (menu) {
        menu.style.display = "block";
      }
    }
  });

  // 모바일 메뉴 토글
  const menuBtn = topbarDiv.querySelector(".menu-toggle");
  const topbarNav = topbarDiv.querySelector(".topbar-nav");

  if (menuBtn && topbarNav) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = topbarDiv.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    // 패널 바깥 클릭 시 닫기
    document.addEventListener("click", (e) => {
      if (!topbarDiv.contains(e.target)) {
        topbarDiv.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });

    // ESC로 닫기(접근성)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        topbarDiv.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }
});
