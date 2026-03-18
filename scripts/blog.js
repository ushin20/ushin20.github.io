const archiveList = document.getElementById("archive-list");
const footnotePostCount = document.getElementById("footnote-post-count");
const footnoteTopicCount = document.getElementById("footnote-topic-count");
const footnoteLatestDate = document.getElementById("footnote-latest-date");

const CATEGORY_LABELS = {
  "anomaly detection": "anomaly detection",
  "time-series forecasting": "forecasting",
  "cssd, certificate": "certificate",
};

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

function normalizeCategory(category) {
  const normalized = category.trim().toLowerCase();
  return CATEGORY_LABELS[normalized] || category.trim();
}

function titleCase(text) {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildArchiveItem(post) {
  const href = `./post.html?file=${encodeURIComponent(post.filename)}`;
  const item = document.createElement("article");
  item.className = "archive-item";

  const meta = document.createElement("div");
  meta.className = "archive-meta";
  meta.innerHTML = `<span>${formatDate(post.date)}</span><span>${titleCase(normalizeCategory(post.category))}</span>`;

  const copy = document.createElement("div");
  copy.className = "archive-copy";

  const title = document.createElement("h3");
  const titleLink = document.createElement("a");
  titleLink.href = href;
  titleLink.textContent = post.title;
  title.append(titleLink);

  const description = document.createElement("p");
  description.textContent = post.published ? post.published : `Note by ${post.author}`;

  const overlayLink = document.createElement("a");
  overlayLink.className = "archive-link";
  overlayLink.href = href;
  overlayLink.setAttribute("aria-label", `Read ${post.title}`);

  copy.append(title, description);
  item.append(meta, copy, overlayLink);
  return item;
}

function renderBlog(posts) {
  const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const uniqueCategories = new Set(sortedPosts.map((post) => normalizeCategory(post.category)));
  const latestPost = sortedPosts[0];

  archiveList.replaceChildren(...sortedPosts.map(buildArchiveItem));
  footnotePostCount.textContent = String(sortedPosts.length);
  footnoteTopicCount.textContent = String(uniqueCategories.size);
  footnoteLatestDate.textContent = formatDate(latestPost.date);
}

function renderError() {
  archiveList.innerHTML = `
    <article class="archive-item">
      <div class="archive-meta">
        <span>Unavailable</span>
        <span>Archive</span>
      </div>
      <div class="archive-copy">
        <h3>Posts could not be loaded.</h3>
        <p>Please check whether <code>articles/posts.json</code> is available from this page.</p>
      </div>
    </article>
  `;

  footnotePostCount.textContent = "-";
  footnoteTopicCount.textContent = "-";
  footnoteLatestDate.textContent = "unavailable";
}

async function initBlog() {
  try {
    const response = await fetch("./articles/posts.json");
    if (!response.ok) {
      throw new Error(`Failed to load posts: ${response.status}`);
    }

    const posts = await response.json();
    renderBlog(posts);
  } catch (error) {
    console.error(error);
    renderError();
  }
}

initBlog();
