const publicationSections = document.getElementById("publication-sections");
const preprintList = document.getElementById("preprint-list");
const awardsList = document.getElementById("awards-list");
const reducedTitleMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const titleHoverAvailable = window.matchMedia("(hover: hover)");
const multilineTitles = window.matchMedia("(max-width: 600px)");

function enableTitleScroll(link, title, text) {
  let animation;

  function update() {
    animation?.cancel();
    link.classList.remove("is-scrolling");

    const active = (titleHoverAvailable.matches && link.matches(":hover")) || link.matches(":focus-visible");
    if (!active || reducedTitleMotion.matches || multilineTitles.matches) return;

    const distance = Math.ceil(text.scrollWidth - title.clientWidth);
    if (distance <= 1) return;

    link.classList.add("is-scrolling");
    animation = text.animate([
      { transform: "translateX(0)" },
      { transform: `translateX(-${distance}px)` },
    ], {
      duration: Math.max(2000, distance / 32 * 1000),
      delay: 350,
      easing: "linear",
      fill: "both",
    });
  }

  link.addEventListener("pointerenter", update);
  link.addEventListener("pointerleave", update);
  link.addEventListener("focus", update);
  link.addEventListener("blur", update);
  reducedTitleMotion.addEventListener("change", update);
  titleHoverAvailable.addEventListener("change", update);
  multilineTitles.addEventListener("change", update);
  // Remeasure on responsive layout changes and after fonts finish loading.
  const observer = new ResizeObserver(update);
  observer.observe(title);
  document.fonts.ready.then(update);
}

function createPublicationItem(item, titleLevel) {
  const article = document.createElement("article");
  article.className = "publication-item";
  const link = document.createElement("a");
  link.className = "publication-link";
  link.href = `./paper.html?id=${encodeURIComponent(item.id)}`;
  const copy = document.createElement("div");
  copy.className = "publication-copy";
  const title = document.createElement(`h${titleLevel}`);
  title.className = "publication-title";
  const titleText = document.createElement("span");
  titleText.className = "publication-title-text";
  titleText.textContent = item.title;
  if (item.language === "ko" && !item.original_title) titleText.lang = "ko";
  title.append(titleText);
  const venue = document.createElement("p");
  venue.className = "publication-venue";
  venue.textContent = item.short_venue || item.venue;
  venue.title = item.venue;
  copy.append(title, venue);
  link.append(copy);
  article.append(link);
  enableTitleScroll(link, title, titleText);
  return article;
}

function renderPublications(container, items, titleLevel = 3) {
  const sortedItems = [...items].sort((a, b) =>
    Number(b.year) - Number(a.year) || (b.month ?? 0) - (a.month ?? 0)
  );
  const groups = [];
  for (const item of sortedItems) {
    let group = groups.at(-1);
    if (!group || group.year !== item.year) {
      group = { year: item.year, papers: [] };
      groups.push(group);
    }
    group.papers.push(item);
  }
  container.replaceChildren(...groups.map(({ year, papers }, index) => {
    const group = document.createElement("section");
    group.className = "publication-group";
    const heading = document.createElement("p");
    heading.className = "publication-year";
    heading.id = `${container.id}-${year}-${index}`;
    heading.textContent = year;
    group.setAttribute("aria-labelledby", heading.id);
    const list = document.createElement("div");
    list.className = "publication-list";
    list.append(...papers.map((item) => createPublicationItem(item, titleLevel)));
    group.append(heading, list);
    return group;
  }));
}

function renderPublicationCategories(sections) {
  const categories = [
    { scope: "international", title: "International Publications" },
    { scope: "domestic", title: "Domestic Publications" },
  ];
  publicationSections.replaceChildren(...categories.map(({ scope, title }) => {
    const items = sections.filter((section) => section.scope === scope).flatMap((section) => section.items);
    const collapsible = scope === "domestic";
    const category = document.createElement(collapsible ? "details" : "section");
    category.className = "publication-category";
    const heading = document.createElement("h3");
    heading.className = "publication-category-title";
    heading.id = `publications-${scope}-title`;
    heading.textContent = title;
    const count = document.createElement("span");
    count.className = "publication-count";
    count.textContent = `· ${items.length}`;
    heading.append(count);
    category.setAttribute("aria-labelledby", heading.id);
    if (collapsible) {
      const toggle = document.createElement("summary");
      toggle.className = "publication-category-toggle";
      toggle.append(heading);
      category.append(toggle);
    } else {
      category.append(heading);
    }
    const list = document.createElement("div");
    list.id = `publications-${scope}`;
    renderPublications(list, items, 4);
    category.append(list);
    return category;
  }));
}

function revealPublicationTarget() {
  const target = document.getElementById(window.location.hash.slice(1));
  const category = target?.closest("details.publication-category");
  if (!category) return;
  category.open = true;
  target.scrollIntoView({ behavior: "instant", block: "start" });
}

function createAwardItem(item) {
  const li = document.createElement("li");
  const year = document.createElement("span");
  year.className = "award-year";
  year.textContent = item.year;
  const copy = document.createElement("div");
  const title = document.createElement("strong");
  title.className = "award-title";
  title.textContent = item.title;
  const venue = document.createElement("p");
  venue.textContent = item.venue;
  copy.append(title, venue);
  li.append(year, copy);
  return li;
}

async function initCv() {
  try {
    const response = await fetch("./data/cv.json");
    if (!response.ok) throw new Error(`Failed to load CV data: ${response.status}`);
    const data = await response.json();
    renderPublicationCategories(data.publication_sections);
    renderPublications(preprintList, data.preprints, 4);
    document.getElementById("preprint-count").textContent = `· ${data.preprints.length}`;
    awardsList.replaceChildren(...data.awards.map(createAwardItem));
    revealPublicationTarget();
  } catch (error) {
    console.error(error);
    const fallback = document.createElement("p");
    fallback.className = "loading-note";
    fallback.append("Records could not be loaded. Please refresh or ");
    const link = document.createElement("a");
    link.href = "./assets/Yooshin_Kim_CV.pdf";
    link.textContent = "read the full CV";
    fallback.append(link, ".");
    publicationSections.replaceChildren(fallback.cloneNode(true));
    preprintList.replaceChildren(fallback);
    const awardFallback = document.createElement("li");
    awardFallback.textContent = "Awards data unavailable.";
    awardsList.replaceChildren(awardFallback);
  }
}

window.addEventListener("hashchange", revealPublicationTarget);
initCv();
