document.addEventListener("DOMContentLoaded", async () => {
  const featuredContainer = document.getElementById("featured-post");
  const listContainer = document.getElementById("article-list");
  const summaryContainer = document.getElementById("article-summary");

  if (!featuredContainer || !listContainer || !summaryContainer || !window.ContentUtils) {
    return;
  }

  function renderTags(categoryValue) {
    return window.ContentUtils
      .splitCategories(categoryValue)
      .map((tag) => `<span class="article-tag">${window.ContentUtils.escapeHtml(tag)}</span>`)
      .join("");
  }

  function renderCard(item, featured = false) {
    const categoryHtml = renderTags(item.category);
    const published = item.published
      ? `<p class="article-published">${window.ContentUtils.escapeHtml(item.published)}</p>`
      : "";

    return `
      <article class="surface-card article-card ${featured ? "featured" : ""}">
        <p class="article-date">${window.ContentUtils.escapeHtml(item.date || "Undated")}</p>
        <h3><a href="${item.href}">${window.ContentUtils.escapeHtml(item.title)}</a></h3>
        <p class="article-author">${window.ContentUtils.escapeHtml(item.author || "Yooshin Kim")}</p>
        ${published}
        <div class="article-meta">${categoryHtml}</div>
      </article>
    `;
  }

  try {
    const items = await window.ContentUtils.loadMarkdownCollection({
      path: "articles/mds",
      fallbackUrl: "/articles/posts.json",
    });

    if (!items.length) {
      throw new Error("No articles discovered.");
    }

    const [featured, ...rest] = items;
    featuredContainer.innerHTML = renderCard(featured, true);
    listContainer.innerHTML = rest.length
      ? rest.map((item) => renderCard(item)).join("")
      : `<article class="surface-card article-empty"><p>No additional notes yet.</p></article>`;

    summaryContainer.innerHTML = `
      <p class="overview-label">Archive</p>
      <h2>${items.length} indexed note${items.length > 1 ? "s" : ""}</h2>
      <p>The list is built automatically from markdown files in <code>/articles/mds</code>, so new posts appear without a manual sync step.</p>
    `;
  } catch (error) {
    console.error("Failed to build article archive:", error);
    featuredContainer.innerHTML = `
      <article class="surface-card article-empty">
        <h3>Archive unavailable</h3>
        <p>The article list could not be generated right now.</p>
      </article>
    `;
    listContainer.innerHTML = "";
    summaryContainer.innerHTML = `
      <p class="overview-label">Archive</p>
      <h2>Automatic indexing failed</h2>
      <p>The site could not load article metadata from GitHub or the fallback index.</p>
    `;
  }
});
