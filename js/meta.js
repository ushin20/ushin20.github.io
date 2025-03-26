const metaTags = [
  { name: "description", content: "Design home of ushin20" },
  { name: "author", content: "Yooshin Kim" },
  {
    name: "keywords",
    content: "ushin20, ushin, yooshin, yooshin kim, portfolio",
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
link.href =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css";
link.integrity =
  "sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==";
link.crossOrigin = "anonymous";
link.referrerPolicy = "no-referrer";

// Append the link tag to the document head
document.head.appendChild(link);

// add topbar
document.addEventListener("DOMContentLoaded", function () {
  const frameElement = document.querySelector(".frame");

  const topbarDiv = document.createElement("div");
  topbarDiv.className = "topbar";
  topbarDiv.innerHTML = `
      <a class="logo-container" href="/index.html">
          <img src="/assets/logo.png" alt="" />
      </a>
      <div class="pages-container">
          <a href="/pages/publication.html">Publications</a>,
          <a href="/pages/project.html">Projects</a>,
          <a href="/pages/about.html">About</a>,
          <a href="/pages/article.html">Article</a>
      </div>
      <div class="sites">
        <a href="/index.html" class="email">
            <i class="fa-solid fa-house"></i>
        </a>
        <a href="https://github.com/ushin20" class="email">
            <i class="fa-brands fa-git"></i>
        </a>
        <a href="https://ushin20-skin.tistory.com/" class="email">
            <i class="fa-solid fa-cube"></i>
        </a>

        <div class="conference-wrapper">
            <div class="conference-icon">
                <i class="fa-solid fa-landmark"></i>
            </div>
            <div class="conference-menu">
                <a href="https://www.ieee-security.org/TC/SP-Index.html" target="_blank">IEEE S&P</a>
                <a href="https://www.ndss-symposium.org/" target="_blank">NDSS</a>
                <a href="https://www.sigsac.org/ccs.html" target="_blank">ACM CCS</a>
                <hr/>
                <a href="https://www.usenix.org/conferences/byname/108" target="_blank">USENIX Sec</a>
                <a href="https://dblp.uni-trier.de/db/conf/eurosp/index.html" target="_blank">Euro S&P</a>
                <hr/>
                <a href="https://www.acsac.org/" target="_blank">ACSAC</a>
                <a href="https://petsymposium.org/" target="_blank">PoPETs</a>
                <a href="http://jianying.space/asiaccs/" target="_blank">Asia CCS</a>
                <hr/>
                <a href="https://conf.laas.fr/esorics/esorics.html" target="_blank">ESORICS</a>
                <hr/>
                <a href="https://www.ieee-ies.org/pubs/transactions-on-industrial-informatics" target="_blank">Industrial<br/>Informatics</a>
                
            </div>
        </div>
      </div>
  `;

  if (frameElement) {
    frameElement.prepend(topbarDiv);
  }

  // 클릭으로 메뉴 토글
  document.addEventListener("click", function (e) {
    const wrapper = e.target.closest(".conference-wrapper");
    const isMenu = e.target.closest(".conference-menu");

    // 모든 메뉴 닫기
    document.querySelectorAll(".conference-menu").forEach((menu) => {
      menu.style.display = "none";
    });

    // 클릭이 아이콘인 경우만 토글
    if (wrapper && !isMenu) {
      const menu = wrapper.querySelector(".conference-menu");
      if (menu) {
        menu.style.display = "block";
      }
    }
  });
});
