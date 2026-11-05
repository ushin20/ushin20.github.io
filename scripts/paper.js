const paperContent = document.getElementById("paper-content");
const backLink = document.querySelector(".paper-back");
const paperContents = document.getElementById("paper-contents");
const paperToc = document.getElementById("paper-toc");
let cleanupToc = () => {};

function externalLink(label, url) {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener";
  link.append(label, " ");
  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";
  link.append(arrow);
  return link;
}

function appendParagraphs(container, text) {
  if (typeof text !== "string") return;
  text.trim().split(/\n\s*\n/).filter(Boolean).forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    container.append(p);
  });
}

function createSection(id, title) {
  const section = document.createElement("section");
  section.id = id;
  section.className = "paper-section";
  section.setAttribute("aria-labelledby", `${id}-title`);
  const heading = document.createElement("h2");
  heading.id = `${id}-title`;
  heading.textContent = title;
  section.append(heading);
  return section;
}

function setupContents(entries) {
  cleanupToc();
  const links = entries.map(({ element, label }) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${encodeURIComponent(element.id)}`;
    link.textContent = label;
    li.append(link);
    return { li, link };
  });
  paperToc.replaceChildren(...links.map(({ li }) => li));
  paperContents.hidden = false;

  const desktop = window.matchMedia("(min-width: 1100px)");
  const syncLayout = () => { paperContents.open = desktop.matches; };
  syncLayout();
  desktop.addEventListener("change", syncLayout);

  let frame = 0;
  function update() {
    frame = 0;
    let current = 0;
    entries.forEach(({ element }, index) => {
      if (element.getBoundingClientRect().top <= 128) current = index;
    });
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      current = entries.length - 1;
    }
    links.forEach(({ link }, index) => {
      if (index === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  function scheduleUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("hashchange", scheduleUpdate);
  update();
  cleanupToc = () => {
    cancelAnimationFrame(frame);
    desktop.removeEventListener("change", syncLayout);
    window.removeEventListener("scroll", scheduleUpdate);
    window.removeEventListener("resize", scheduleUpdate);
    window.removeEventListener("hashchange", scheduleUpdate);
  };
}

function renderPaper(item, isPreprint) {
  document.title = `${item.title} | Yooshin Kim`;
  document.querySelector('meta[name="description"]').content = `${item.title}. ${item.venue}, ${item.year}.`;
  backLink.href = `./index.html#${isPreprint ? "preprints" : "publications"}`;
  backLink.lastChild.textContent = isPreprint ? " Preprints" : " Publications";

  const article = document.createElement("article");
  article.className = "paper-detail";
  article.setAttribute("aria-labelledby", "paper-title");
  const header = document.createElement("header");
  header.id = "paper-overview";
  header.className = "paper-header";
  const title = document.createElement("h1");
  title.id = "paper-title";
  title.className = "paper-title";
  title.textContent = item.title;
  const venue = document.createElement("p");
  venue.className = "paper-venue";
  venue.textContent = item.venue.includes(item.year) ? item.venue : `${item.venue} · ${item.year}`;
  const authors = document.createElement("p");
  authors.className = "paper-authors";
  // Author formatting comes from the repository-owned CV data.
  authors.innerHTML = item.authors;
  header.append(title);
  if (item.language === "ko") {
    const note = document.createElement("p");
    note.className = "paper-title-note";
    if (item.original_title) {
      const originalTitle = document.createElement("span");
      originalTitle.lang = "ko";
      originalTitle.textContent = item.original_title;
      note.append(originalTitle, " ");
    } else {
      title.lang = "ko";
    }
    note.append("(in Korean)");
    header.append(note);
  }
  header.append(venue, authors);
  article.append(header);

  const entries = [{ element: header, label: "Overview" }];
  const prose = document.createElement("div");
  prose.className = "paper-prose";
  appendParagraphs(prose, item.body);
  if (typeof item.abstract === "string" && item.abstract.trim()) {
    const section = createSection("paper-abstract", "Abstract");
    appendParagraphs(section, item.abstract);
    prose.append(section);
    entries.push({ element: section, label: "Abstract" });
  }

  const usedIds = new Set();
  (Array.isArray(item.sections) ? item.sections : []).forEach((content, index) => {
    const hasText = typeof content?.text === "string" && content.text.trim();
    if (!content || !content.heading || !(hasText || content.figure?.src)) return;
    const slug = String(content.id || index + 1).replace(/[^\p{L}\p{N}_-]+/gu, "-");
    const baseId = `paper-section-${slug}`;
    let id = baseId;
    let suffix = 2;
    while (usedIds.has(id)) id = `${baseId}-${suffix++}`;
    usedIds.add(id);
    const section = createSection(id, content.heading);
    appendParagraphs(section, content.text);
    if (content.figure?.src) {
      const figure = document.createElement("figure");
      figure.className = "paper-figure";
      const image = document.createElement("img");
      image.src = content.figure.src;
      image.alt = content.figure.alt || "";
      image.loading = "lazy";
      image.decoding = "async";
      if (content.figure.width && content.figure.height) {
        image.width = content.figure.width;
        image.height = content.figure.height;
      }
      figure.append(image);
      if (content.figure.caption) {
        const caption = document.createElement("figcaption");
        caption.textContent = content.figure.caption;
        figure.append(caption);
      }
      section.append(figure);
    }
    prose.append(section);
    entries.push({ element: section, label: content.heading });
  });

  if (item.link || item.code) {
    const section = createSection("paper-links", "Links");
    const links = document.createElement("div");
    links.className = "paper-resources";
    if (item.link) links.append(externalLink(item.link_label || "View paper", item.link));
    if (item.code) links.append(externalLink("Code on GitHub", item.code));
    section.append(links);
    prose.append(section);
    entries.push({ element: section, label: "Links" });
  }
  if (prose.childElementCount) article.append(prose);
  paperContent.replaceChildren(article);
  setupContents(entries);

  // The article is loaded after navigation, so resolve direct section links once it exists.
  document.fonts.ready.then(() => {
    try {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target && article.contains(target)) target.scrollIntoView({ behavior: "instant" });
    } catch {
      // An invalid URL fragment should not prevent the paper from being read.
    }
  });
}

function renderError(title, message) {
  cleanupToc();
  paperContents.hidden = true;
  document.title = `${title} | Yooshin Kim`;
  const section = document.createElement("section");
  section.className = "paper-error";
  const heading = document.createElement("h1");
  heading.className = "paper-title";
  heading.textContent = title;
  const text = document.createElement("p");
  text.textContent = message;
  const link = document.createElement("a");
  link.className = "text-link";
  link.href = "./index.html#publications";
  link.textContent = "← Back to publications";
  section.append(heading, text, link);
  paperContent.replaceChildren(section);
}

async function initPaper() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    renderError("Publication not found", "Choose a paper from the publications list.");
    return;
  }
  try {
    const response = await fetch("./data/cv.json");
    if (!response.ok) throw new Error(`Failed to load publication: ${response.status}`);
    const data = await response.json();
    for (const section of data.publication_sections) {
      const item = section.items.find((paper) => paper.id === id);
      if (item) {
        renderPaper(item, false);
        return;
      }
    }
    const preprint = data.preprints.find((paper) => paper.id === id);
    if (preprint) {
      renderPaper(preprint, true);
      return;
    }
    renderError("Publication not found", "This publication may have moved. You can find all papers in the publications list.");
  } catch (error) {
    console.error(error);
    renderError("Publication unavailable", "The publication could not be loaded. Please refresh the page or return to the publications list.");
  }
}

initPaper();
