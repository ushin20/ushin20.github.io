const postTitle = document.getElementById("post-title");
const postCategory = document.getElementById("post-category");
const postDate = document.getElementById("post-date");
const postAuthor = document.getElementById("post-author");
const postPublished = document.getElementById("post-published");
const postContent = document.getElementById("post-content");

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

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function inlineMarkdown(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function isTableSeparator(line) {
  return /^\|?(?:\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(line.trim());
}

function parseTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => inlineMarkdown(cell.trim()));
}

function stripFrontmatter(content) {
  if (!content.startsWith("---")) {
    return content;
  }

  const end = content.indexOf("\n---", 3);
  if (end === -1) {
    return content;
  }

  return content.slice(end + 4).trim();
}

function renderMarkdown(content) {
  const body = stripFrontmatter(content).replace(/\r/g, "");
  const lines = body.split("\n");
  const html = [];
  let inParagraph = false;
  let inUl = false;
  let inOl = false;
  let inCodeBlock = false;
  let inMathBlock = false;
  let codeLines = [];
  let mathLines = [];

  function closeParagraph() {
    if (inParagraph) {
      html.push("</p>");
      inParagraph = false;
    }
  }

  function closeLists() {
    if (inUl) {
      html.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      html.push("</ol>");
      inOl = false;
    }
  }

  function flushCodeBlock() {
    if (inCodeBlock) {
      html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
      inCodeBlock = false;
      codeLines = [];
    }
  }

  function flushMathBlock() {
    if (inMathBlock) {
      html.push(`<div class="math-block">$$\n${mathLines.join("\n")}\n$$</div>`);
      inMathBlock = false;
      mathLines = [];
    }
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      closeParagraph();
      closeLists();
      flushMathBlock();
      if (inCodeBlock) {
        flushCodeBlock();
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (trimmed.startsWith("$$") && trimmed.endsWith("$$") && trimmed.length > 4) {
      closeParagraph();
      closeLists();
      flushCodeBlock();
      html.push(`<div class="math-block">${trimmed}</div>`);
      continue;
    }

    if (trimmed === "$$") {
      closeParagraph();
      closeLists();
      flushCodeBlock();
      if (inMathBlock) {
        flushMathBlock();
      } else {
        inMathBlock = true;
      }
      continue;
    }

    if (inMathBlock) {
      mathLines.push(line);
      continue;
    }

    if (!trimmed) {
      closeParagraph();
      closeLists();
      continue;
    }

    if (trimmed.startsWith("<")) {
      closeParagraph();
      closeLists();
      html.push(line);
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      closeParagraph();
      closeLists();
      flushMathBlock();
      const level = heading[1].length;
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    const ordered = trimmed.match(/^\d+\.\s+(.*)$/);
    if (ordered) {
      closeParagraph();
      if (inUl) {
        html.push("</ul>");
        inUl = false;
      }
      if (!inOl) {
        html.push("<ol>");
        inOl = true;
      }
      html.push(`<li>${inlineMarkdown(ordered[1])}</li>`);
      continue;
    }

    const unordered = trimmed.match(/^[-*]\s+(.*)$/);
    if (unordered) {
      closeParagraph();
      if (inOl) {
        html.push("</ol>");
        inOl = false;
      }
      if (!inUl) {
        html.push("<ul>");
        inUl = true;
      }
      html.push(`<li>${inlineMarkdown(unordered[1])}</li>`);
      continue;
    }

    if (trimmed.includes("|") && lines[index + 1] && isTableSeparator(lines[index + 1])) {
      closeParagraph();
      closeLists();
      flushMathBlock();

      const headers = parseTableRow(trimmed);
      const rows = [];
      index += 2;

      while (index < lines.length && lines[index].trim().includes("|")) {
        rows.push(parseTableRow(lines[index]));
        index += 1;
      }
      index -= 1;

      const thead = `<thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>`;
      const tbody = `<tbody>${rows
        .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
        .join("")}</tbody>`;
      html.push(`<div class="table-wrap"><table>${thead}${tbody}</table></div>`);
      continue;
    }

    closeLists();
    if (!inParagraph) {
      html.push("<p>");
      inParagraph = true;
      html.push(inlineMarkdown(trimmed));
    } else {
      html.push(`<br>${inlineMarkdown(trimmed)}`);
    }
  }

  flushCodeBlock();
  flushMathBlock();
  closeParagraph();
  closeLists();
  return html.join("\n");
}

function renderPost(metadata, markdown) {
  document.title = `${metadata.title} | Yooshin Kim`;
  postTitle.textContent = metadata.title;
  postCategory.textContent = metadata.category || "Research Note";
  postDate.textContent = formatDate(metadata.date);
  postAuthor.textContent = metadata.author || "Unknown author";
  postPublished.textContent = metadata.published || "Unpublished note";
  postContent.innerHTML = renderMarkdown(markdown);
  if (window.MathJax?.typesetPromise) {
    window.MathJax.typesetPromise([postContent]).catch((error) => console.error(error));
  }
}

function renderError(message) {
  postTitle.textContent = "Post unavailable";
  postCategory.textContent = "Error";
  postDate.textContent = "-";
  postAuthor.textContent = "-";
  postPublished.textContent = "-";
  postContent.innerHTML = `<p>${message}</p>`;
}

async function initPost() {
  const params = new URLSearchParams(window.location.search);
  const file = params.get("file");

  if (!file) {
    renderError("No post file was provided.");
    return;
  }

  try {
    const postsResponse = await fetch("./articles/posts.json");
    if (!postsResponse.ok) {
      throw new Error("Failed to load posts metadata.");
    }
    const posts = await postsResponse.json();
    const metadata = posts.find((post) => post.filename === file);
    if (!metadata) {
      throw new Error("Post metadata could not be found.");
    }

    const markdownResponse = await fetch(`./articles/mds/${encodeURIComponent(file)}`);
    if (!markdownResponse.ok) {
      throw new Error("Markdown file could not be loaded.");
    }
    const markdown = await markdownResponse.text();

    renderPost(metadata, markdown);
  } catch (error) {
    console.error(error);
    renderError(error.message);
  }
}

initPost();
