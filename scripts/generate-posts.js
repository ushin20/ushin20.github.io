const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const markdownDir = path.join(repoRoot, "articles", "mds");
const outputPath = path.join(repoRoot, "articles", "posts.json");
const requiredFields = ["title", "author", "published", "date", "category"];
const filenamePattern =
  /^(\d{4}-\d{2}-\d{2})(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?\.md$/;

function parseFrontmatter(content, filename) {
  const lines = content.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") {
    throw new Error(`Missing frontmatter start in ${filename}`);
  }

  const metadata = {};
  let index = 1;

  while (index < lines.length && lines[index].trim() !== "---") {
    const line = lines[index];
    const separatorIndex = line.indexOf(":");

    if (separatorIndex !== -1) {
      const key = line.slice(0, separatorIndex).trim().toLowerCase();
      const rawValue = line.slice(separatorIndex + 1).trim();
      metadata[key] = rawValue.replace(/^"(.*)"$/, "$1");
    }

    index += 1;
  }

  if (lines[index]?.trim() !== "---") {
    throw new Error(`Missing frontmatter end in ${filename}`);
  }

  return metadata;
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function validateMetadata(metadata, filename) {
  const filenameMatch = filename.match(filenamePattern);
  if (!filenameMatch) {
    throw new Error(
      `Invalid filename ${filename}: use YYYY-MM-DD.md or YYYY-MM-DD-short-slug.md`,
    );
  }

  const missingFields = requiredFields.filter(
    (field) => !metadata[field]?.trim(),
  );
  if (missingFields.length > 0) {
    throw new Error(
      `Missing required frontmatter in ${filename}: ${missingFields.join(", ")}`,
    );
  }

  if (!isValidDate(metadata.date)) {
    throw new Error(
      `Invalid date in ${filename}: use a real date in YYYY-MM-DD format`,
    );
  }

  if (metadata.date !== filenameMatch[1]) {
    throw new Error(
      `Date mismatch in ${filename}: frontmatter date must be ${filenameMatch[1]}`,
    );
  }
}

function readPosts() {
  const markdownFiles = fs
    .readdirSync(markdownDir)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .reverse();

  return markdownFiles
    .map((filename) => {
      const filePath = path.join(markdownDir, filename);
      const content = fs.readFileSync(filePath, "utf8");
      const metadata = parseFrontmatter(content, filename);
      validateMetadata(metadata, filename);

      return {
        title: metadata.title,
        author: metadata.author,
        published: metadata.published,
        date: metadata.date,
        category: metadata.category,
        filename,
      };
    })
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || b.filename.localeCompare(a.filename),
    );
}

function main() {
  const posts = readPosts();
  const output = `${JSON.stringify(posts, null, 2)}\n`.replace(/\n/g, os.EOL);

  if (fs.existsSync(outputPath) && fs.readFileSync(outputPath, "utf8") === output) {
    console.log(`Already up to date: ${posts.length} posts in ${outputPath}`);
    return;
  }

  fs.writeFileSync(outputPath, output, "utf8");
  console.log(`Generated ${posts.length} posts in ${outputPath}`);
}

main();
