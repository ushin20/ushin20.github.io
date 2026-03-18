const publicationSections = document.getElementById("publication-sections");
const preprintList = document.getElementById("preprint-list");
const awardsList = document.getElementById("awards-list");

function sortByYearDescending(items) {
  return [...items].sort((a, b) => Number(b.year) - Number(a.year));
}

function createPublicationItem(item, displayedYear) {
  const article = document.createElement("article");
  article.className = "publication-item";

  const year = document.createElement("div");
  year.className = "publication-year";
  year.textContent = displayedYear;

  const copy = document.createElement("div");
  copy.className = "publication-copy";

  const title = document.createElement("h2");
  if (item.link) {
    const anchor = document.createElement("a");
    anchor.href = item.link;
    anchor.target = "_blank";
    anchor.rel = "noopener";
    anchor.textContent = item.title;
    title.append(anchor);
  } else {
    title.textContent = item.title;
  }

  const authors = document.createElement("p");
  authors.className = "publication-authors";
  authors.innerHTML = item.authors;

  const venue = document.createElement("p");
  venue.textContent = item.venue;

  copy.append(title, authors, venue);
  article.append(year, copy);
  return article;
}

function createAwardItem(item) {
  const li = document.createElement("li");
  li.textContent = `${item.title}, ${item.venue}, ${item.year}`;
  return li;
}

function createPublicationSection(section) {
  const wrapper = document.createElement("section");
  wrapper.className = "publication-group";

  const heading = document.createElement("h3");
  heading.className = "publication-group-title";
  heading.textContent = section.title;

  const list = document.createElement("div");
  list.className = "publication-list";
  const sortedItems = sortByYearDescending(section.items);
  let previousYear = null;
  const renderedItems = sortedItems.map((item) => {
    const displayedYear = item.year === previousYear ? "" : item.year;
    previousYear = item.year;
    return createPublicationItem(item, displayedYear);
  });
  list.replaceChildren(...renderedItems);

  wrapper.append(heading, list);
  return wrapper;
}

function renderCvData(data) {
  publicationSections.replaceChildren(...data.publication_sections.map(createPublicationSection));
  const sortedPreprints = sortByYearDescending(data.preprints);
  let previousYear = null;
  const renderedPreprints = sortedPreprints.map((item) => {
    const displayedYear = item.year === previousYear ? "" : item.year;
    previousYear = item.year;
    return createPublicationItem(item, displayedYear);
  });
  preprintList.replaceChildren(...renderedPreprints);
  awardsList.replaceChildren(...data.awards.map(createAwardItem));
}

function renderCvError() {
  const fallback = document.createElement("article");
  fallback.className = "publication-item";
  fallback.innerHTML = `
    <div class="publication-year">-</div>
    <div class="publication-copy">
      <h2>CV records could not be loaded.</h2>
      <p class="publication-authors">Please check whether <code>data/cv.json</code> is available.</p>
      <p>Unavailable</p>
    </div>
  `;

  publicationSections.replaceChildren(fallback.cloneNode(true));
  preprintList.replaceChildren(fallback);

  const awardFallback = document.createElement("li");
  awardFallback.textContent = "Awards data unavailable";
  awardsList.replaceChildren(awardFallback);
}

async function initCv() {
  try {
    const response = await fetch("./data/cv.json");
    if (!response.ok) {
      throw new Error(`Failed to load CV data: ${response.status}`);
    }

    const data = await response.json();
    renderCvData(data);
  } catch (error) {
    console.error(error);
    renderCvError();
  }
}

initCv();
