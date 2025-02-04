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

// check topbar, if page-container is collapsed, hidden <p>Ushin20...</p>
document.addEventListener("DOMContentLoaded", checkTopbar);
window.addEventListener("resize", checkTopbar);

function isMultiline(container) {
  const children = Array.from(container.children); // 내부 요소 목록 가져오기
  if (children.length < 2) return false; // 2개 이상 요소가 있어야 줄바꿈 감지 가능

  // 첫 번째 요소의 offsetTop과 마지막 요소의 offsetTop을 비교
  return children[0].offsetTop !== children[children.length - 1].offsetTop;
}

function checkTopbar() {
  const container = document.querySelector(".pages-container");
  const topbarText = document.querySelector(".topbar p");

  if (!container || !topbarText) return;

  if (isMultiline(container)) {
    topbarText.style.display = "none"; // 숨김
  } else {
    topbarText.style.display = "block"; // 표시
  }
}
