(function attachContentUtils() {
  const repoConfig = {
    owner: "ushin20",
    repo: "ushin20.github.io",
    branch: "main",
  };

  function parseFrontMatter(rawText) {
    const normalized = rawText.replace(/\r\n/g, "\n");
    if (!normalized.startsWith("---\n")) {
      return { metadata: {}, content: rawText.trim() };
    }

    const parts = normalized.split("\n---\n");
    if (parts.length < 2) {
      return { metadata: {}, content: rawText.trim() };
    }

    const metaBlock = parts[0].replace(/^---\n/, "");
    const content = parts.slice(1).join("\n---\n").trim();
    const metadata = {};

    metaBlock.split("\n").forEach((line) => {
      const separator = line.indexOf(":");
      if (separator === -1) {
        return;
      }

      const key = line.slice(0, separator).trim().toLowerCase();
      const value = line
        .slice(separator + 1)
        .trim()
        .replace(/^"(.*)"$/, "$1");

      metadata[key] = value;
    });

    return { metadata, content };
  }

  function normalizeMetadata(metadata = {}) {
    return {
      title: metadata.title || "",
      author: metadata.author || "",
      published: metadata.published || "",
      date: metadata.date || "",
      category: metadata.category || "",
    };
  }

  function splitCategories(value = "") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function parseDateValue(dateString) {
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? new Date(0) : date;
  }

  function sortByDateDesc(items) {
    return [...items].sort((left, right) => parseDateValue(right.date) - parseDateValue(left.date));
  }

  async function fetchDirectoryListing(path) {
    const apiUrl = `https://api.github.com/repos/${repoConfig.owner}/${repoConfig.repo}/contents/${path}?ref=${repoConfig.branch}`;
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API request failed for ${path}: ${response.status}`);
    }

    return response.json();
  }

  async function loadMarkdownCollection({ path, fallbackUrl }) {
    try {
      const directoryEntries = await fetchDirectoryListing(path);
      const markdownEntries = directoryEntries.filter((entry) => entry.type === "file" && entry.name.endsWith(".md"));

      const collection = await Promise.all(
        markdownEntries.map(async (entry) => {
          const response = await fetch(entry.download_url);
          if (!response.ok) {
            throw new Error(`Cannot fetch markdown file: ${entry.name}`);
          }

          const text = await response.text();
          const parsed = parseFrontMatter(text);

          return {
            ...normalizeMetadata(parsed.metadata),
            body: parsed.content,
            filename: entry.name,
            href: `/articles/bone.html?md=${encodeURIComponent(entry.name)}`,
          };
        })
      );

      const filtered = collection.filter((item) => item.title);
      if (filtered.length) {
        return sortByDateDesc(filtered);
      }
      throw new Error(`No markdown metadata discovered in ${path}`);
    } catch (error) {
      if (!fallbackUrl) {
        throw error;
      }

      const fallbackResponse = await fetch(fallbackUrl);
      if (!fallbackResponse.ok) {
        throw error;
      }

      const fallbackItems = await fallbackResponse.json();
      return sortByDateDesc(
        fallbackItems.map((item) => ({
          ...normalizeMetadata(item),
          filename: item.filename,
          href: `/articles/bone.html?md=${encodeURIComponent(item.filename)}`,
        }))
      );
    }
  }

  function escapeHtml(value = "") {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  window.ContentUtils = {
    repoConfig,
    parseFrontMatter,
    normalizeMetadata,
    splitCategories,
    sortByDateDesc,
    loadMarkdownCollection,
    escapeHtml,
  };
})();
