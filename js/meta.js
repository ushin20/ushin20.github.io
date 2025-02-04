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
