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

function createPublicationItem(item) {
  const article = document.createElement("article");
  article.className = "publication-item";
  const link = document.createElement("a");
  link.className = "publication-link";
  link.href = `./paper.html?id=${encodeURIComponent(item.id)}`;
  const copy = document.createElement("div");
  copy.className = "publication-copy";
  const title = document.createElement("h4");
  const titleText = document.createElement("span");
  titleText.className = "publication-title-text";
  titleText.textContent = item.title;
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

function renderPublications(container, items) {
  const groups = new Map();
  [...items].sort((a, b) => Number(b.year) - Number(a.year)).forEach((item) => {
    if (!groups.has(item.year)) groups.set(item.year, []);
    groups.get(item.year).push(item);
  });
  container.replaceChildren(...Array.from(groups, ([year, papers]) => {
    const group = document.createElement("section");
    group.className = "publication-group";
    const heading = document.createElement("h3");
    heading.className = "publication-year";
    heading.id = `${container.id}-${year}`;
    heading.textContent = year;
    group.setAttribute("aria-labelledby", heading.id);
    const list = document.createElement("div");
    list.className = "publication-list";
    list.append(...papers.map(createPublicationItem));
    group.append(heading, list);
    return group;
  }));
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
    renderPublications(publicationSections, data.publication_sections.flatMap((section) => section.items));
    renderPublications(preprintList, data.preprints);
    awardsList.replaceChildren(...data.awards.map(createAwardItem));
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

initCv();
