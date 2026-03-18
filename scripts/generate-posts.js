const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const markdownDir = path.join(repoRoot, "articles", "mds");
const outputPath = path.join(repoRoot, "articles", "posts.json");

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

function readPosts() {
  const markdownFiles = fs
    .readdirSync(markdownDir)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .reverse();

  return markdownFiles.map((filename) => {
    const filePath = path.join(markdownDir, filename);
    const content = fs.readFileSync(filePath, "utf8");
    const metadata = parseFrontmatter(content, filename);

    return {
      title: metadata.title || "",
      author: metadata.author || "",
      published: metadata.published || "",
      date: metadata.date || filename.replace(/\.md$/i, ""),
      category: metadata.category || "",
      filename,
    };
  });
}

function main() {
  const posts = readPosts();
  fs.writeFileSync(outputPath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
  console.log(`Generated ${posts.length} posts in ${outputPath}`);
}

main();
