document.addEventListener("DOMContentLoaded", () => {
  const researchContainer = document.getElementById("research-projects");
  const personalContainer = document.getElementById("personal-projects");

  if (!researchContainer || !personalContainer) {
    return;
  }

  const projects = [
    {
      category: "research",
      title: "Contextual Digital Twin for ICS Diagnosis",
      period: "2025 - 2026",
      kind: "Research track",
      summary:
        "Exploring contextual digital twins that connect system states, actuator-sensor relationships, and anomaly diagnosis in industrial control systems.",
      tags: ["ICS", "Digital Twin", "Diagnosis"],
      link: "/pages/publication.html#lcdtwin",
      cta: "View publication",
      tone: "#0f5f6b",
    },
    {
      category: "research",
      title: "Passive Authentication for Industrial Operators",
      period: "2024 - 2025",
      kind: "Journal work",
      summary:
        "Developing low-friction authentication based on keystroke dynamics so operators can be verified without extra interaction cost.",
      tags: ["Authentication", "Behavioral Signals", "Human Factors"],
      link: "/pages/publication.html#kdprint",
      cta: "View publication",
      tone: "#19486a",
    },
    {
      category: "research",
      title: "Privacy-Preserving ICS Monitoring",
      period: "2024 - 2025",
      kind: "Journal work",
      summary:
        "Studying anomaly detection under homomorphic encryption so monitoring remains useful even when data confidentiality is a hard constraint.",
      tags: ["Privacy", "Homomorphic Encryption", "Critical Infrastructure"],
      link: "/pages/publication.html#ppad",
      cta: "View publication",
      tone: "#315b4c",
    },
    {
      category: "research",
      title: "Drift-Aware Industrial Anomaly Detection",
      period: "2025 - 2026",
      kind: "In progress",
      summary:
        "Current work on memory-augmented spatio-temporal models that stay sensitive to industrial drift and evolving system behavior.",
      tags: ["Time Series", "Graph Models", "Industrial AI"],
      link: "/pages/publication.html#drama",
      cta: "View manuscript",
      tone: "#5a4b30",
    },
    {
      category: "personal",
      title: "OpenReview Rebuttal Renderer",
      period: "Oct 2025",
      kind: "Web utility",
      summary: "A lightweight renderer that helps structure and word-count rebuttal drafts written in markdown and TeX.",
      tags: ["Markdown", "TeX", "Workflow"],
      link: "/projects/project_bone.html?md=openreview.md",
      cta: "Open project",
      tone: "#754d2f",
    },
    {
      category: "personal",
      title: "Home Loan Calculator",
      period: "Apr 2025",
      kind: "Web utility",
      summary: "A small calculator for comparing rent and purchase costs with a fast, purpose-built interface.",
      tags: ["Calculator", "Finance", "Web Tool"],
      link: "/projects/project_bone.html?md=homeloarn.md",
      cta: "Open project",
      tone: "#52626c",
    },
    {
      category: "personal",
      title: "Markdown to PDF Converter",
      period: "Jan 2025",
      kind: "Web utility",
      summary: "A simple converter that turns markdown notes into HTML and PDF without a heavy local workflow.",
      tags: ["Markdown", "PDF", "Productivity"],
      link: "/projects/project_bone.html?md=md-to-pdf.md",
      cta: "Open project",
      tone: "#3b556e",
    },
    {
      category: "personal",
      title: "Linebreak Remover",
      period: "Feb 2025",
      kind: "Text tool",
      summary: "A small utility for cleaning copied text and flattening awkward line breaks before reuse.",
      tags: ["Text Processing", "Utility", "Web Tool"],
      link: "/projects/project_bone.html?md=linebreakRemover.md",
      cta: "Open project",
      tone: "#505a41",
    },
    {
      category: "personal",
      title: "YouTube to MP3 Converter",
      period: "Mar 2025",
      kind: "Scripted workflow",
      summary: "A pragmatic local workflow for downloading playlist audio and converting it to MP3 with Python and ffmpeg.",
      tags: ["Python", "Automation", "Media"],
      link: "/projects/project_bone.html?md=utube-to-mp3.md",
      cta: "Open project",
      tone: "#6b3a39",
    },
    {
      category: "personal",
      title: "CTAL Website Design",
      period: "Feb 2023",
      kind: "Design and implementation",
      summary: "Website design and implementation work for the Computational Theory and Application Laboratory at DGIST.",
      tags: ["Frontend", "Design", "Lab Infrastructure"],
      link: "/projects/project_bone.html?md=ctal-web-design.md",
      cta: "Open project",
      tone: "#234d5d",
    },
    {
      category: "personal",
      title: "uTube Tistory Skin",
      period: "Jun 2022",
      kind: "Theme work",
      summary: "A YouTube-inspired Tistory theme focused on responsive layouts, navigation aids, and a clean reading flow.",
      tags: ["Theme", "CSS", "Blog UX"],
      link: "/projects/project_bone.html?md=tistory-skin.md",
      cta: "Open project",
      tone: "#7a5a27",
    },
  ];

  function buildTagRow(tags) {
    return tags.map((tag) => `<span class="project-tag">${tag}</span>`).join("");
  }

  function buildCard(project) {
    const card = document.createElement("article");
    card.className = "surface-card project-card";
    card.style.setProperty("--project-accent", project.tone);

    card.innerHTML = `
      <div class="project-top">
        <p class="project-kind">${project.kind}</p>
        <span class="project-period">${project.period}</span>
      </div>
      <h3>${project.title}</h3>
      <p class="project-summary">${project.summary}</p>
      <div class="project-tags">${buildTagRow(project.tags)}</div>
      <a class="text-link" href="${project.link}">${project.cta}</a>
    `;

    return card;
  }

  projects.forEach((project) => {
    const target = project.category === "research" ? researchContainer : personalContainer;
    target.appendChild(buildCard(project));
  });
});
