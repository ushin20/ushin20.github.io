const labList = document.getElementById("lab-list");
const labProjectCount = document.getElementById("lab-project-count");

function buildLabItem(project, index) {
  const article = document.createElement("article");
  article.className = "lab-item";

  const meta = document.createElement("div");
  meta.className = "lab-item-meta";

  const category = document.createElement("span");
  category.textContent = String(index + 1).padStart(2, "0");
  category.setAttribute("aria-hidden", "true");

  meta.append(category);

  const copy = document.createElement("div");
  copy.className = "lab-item-copy";

  const title = document.createElement("h3");
  title.textContent = project.title;

  const summary = document.createElement("p");
  summary.textContent = project.summary;

  copy.append(title, summary);

  const cta = document.createElement("div");
  cta.className = "lab-item-cta";
  cta.textContent = "↗";
  cta.setAttribute("aria-hidden", "true");

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
  if (window.location.protocol !== "file:") {
    try {
      const response = await fetch("./data/labs.json");
      if (!response.ok) {
        throw new Error(`Failed to load labs: ${response.status}`);
      }

      renderLabs(await response.json());
      return;
    } catch (error) {
      console.error(error);
    }
  }
  labProjectCount.textContent = String(labList.querySelectorAll("a").length);
}

initLab();
