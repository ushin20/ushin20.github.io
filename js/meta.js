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
  // .frame 요소를 찾기
  const frameElement = document.querySelector(".frame");

  // 새로운 .topbar 요소 생성
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
      </div>
  `;

  // .frame 요소가 존재하면, 맨 앞에 .topbar 추가
  if (frameElement) {
    frameElement.prepend(topbarDiv);
  }
});
