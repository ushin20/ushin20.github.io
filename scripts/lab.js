const labList = document.getElementById("lab-list");
const labProjectCount = document.getElementById("lab-project-count");

function toTitleCase(text) {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildTag(text) {
  const tag = document.createElement("span");
  tag.textContent = text;
  return tag;
}

function buildLabItem(project) {
  const article = document.createElement("article");
  article.className = "lab-item";

  const meta = document.createElement("div");
  meta.className = "lab-item-meta";

  const category = document.createElement("span");
  category.textContent = toTitleCase(project.category || "Tool");

  const status = document.createElement("span");
  status.className = "lab-status";
  status.textContent = project.status || "In progress";

  meta.append(category, status);

  const copy = document.createElement("div");
  copy.className = "lab-item-copy";

  const title = document.createElement("h3");
  title.textContent = project.title;

  const summary = document.createElement("p");
  summary.textContent = project.summary;

  const tags = document.createElement("div");
  tags.className = "lab-tags";
  (project.tags || []).forEach((tag) => tags.append(buildTag(tag)));

  copy.append(title, summary, tags);

  const cta = document.createElement("div");
  cta.className = "lab-item-cta";
  cta.textContent = "Open Tool";

  const link = document.createElement("a");
  link.className = "lab-item-link";
  link.href = project.path;
  link.setAttribute("aria-label", `Open ${project.title}`);

  article.append(meta, copy, cta, link);
  return article;
}

function renderEmptyState(message) {
  const panel = document.createElement("div");
  panel.className = "lab-empty";
  panel.innerHTML = `<p>${message}</p>`;
  labList.replaceChildren(panel);
  labProjectCount.textContent = "0";
}

function renderLabs(projects) {
  if (!Array.isArray(projects) || projects.length === 0) {
    renderEmptyState("No tools are available yet.");
    return;
  }

  labList.replaceChildren(...projects.map(buildLabItem));
  labProjectCount.textContent = String(projects.length);
}

async function initLab() {
  try {
    const response = await fetch("./data/labs.json");
    if (!response.ok) {
      throw new Error(`Failed to load labs: ${response.status}`);
    }

    const projects = await response.json();
    renderLabs(projects);
  } catch (error) {
    console.error(error);
    renderEmptyState("Tools could not be loaded. Please check whether data/labs.json is available.");
  }
}

initLab();
