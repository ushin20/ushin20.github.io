import json
from datetime import datetime
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
POSTS_DIR = BASE_DIR / "mds"
OUTPUT_JSON = BASE_DIR / "posts.json"


def extract_metadata(md_path: Path):
    raw_text = md_path.read_text(encoding="utf-8")
    if not raw_text.startswith("---"):
        return None

    parts = raw_text.split("---", 2)
    if len(parts) < 3:
        return None

    meta_block = parts[1].strip()
    metadata = {}

    for line in meta_block.splitlines():
        separator = line.find(":")
        if separator == -1:
            continue

        key = line[:separator].strip().lower()
        value = line[separator + 1 :].strip().strip('"')
        metadata[key] = value

    if not metadata.get("title"):
        return None

    metadata["filename"] = md_path.name
    return metadata


def parse_date(date_value: str):
    try:
        return datetime.strptime(date_value, "%Y-%m-%d")
    except ValueError:
        return datetime.min


def update_posts_json():
    posts = []

    for md_path in POSTS_DIR.glob("*.md"):
        metadata = extract_metadata(md_path)
        if metadata:
            posts.append(metadata)

    posts.sort(key=lambda item: parse_date(item.get("date", "")), reverse=True)
    OUTPUT_JSON.write_text(json.dumps(posts, indent=2, ensure_ascii=False), encoding="utf-8")
    return len(posts)


if __name__ == "__main__":
    count = update_posts_json()
    print(
        f"Updated {OUTPUT_JSON.name} with {count} post entries. "
        "The article page now auto-discovers markdown files, so this file is only a fallback index."
    )
