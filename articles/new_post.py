import argparse
from datetime import date
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
POSTS_DIR = BASE_DIR / "mds"


TEMPLATE = """---
title: "{title}"
author: "Yooshin Kim"
published: "Note"
date: {post_date}
category: {category}
---

# {title}

## Summary

Write the short context for this note.

## Key points

- Point 1
- Point 2
- Point 3
"""


def slugify(value: str):
    keep = [char.lower() if char.isalnum() else "-" for char in value.strip()]
    slug = "".join(keep)
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug.strip("-") or "untitled-note"


def main():
    parser = argparse.ArgumentParser(description="Create a new markdown note for the article archive.")
    parser.add_argument("title", help="Title of the new note")
    parser.add_argument("--category", default="research note", help="Comma-separated category string")
    parser.add_argument("--date", dest="post_date", default=date.today().isoformat(), help="Post date in YYYY-MM-DD")
    parser.add_argument("--filename", help="Optional custom filename")
    args = parser.parse_args()

    filename = args.filename or f"{args.post_date}-{slugify(args.title)}.md"
    output_path = POSTS_DIR / filename
    POSTS_DIR.mkdir(parents=True, exist_ok=True)

    if output_path.exists():
        raise SystemExit(f"{output_path.name} already exists.")

    output_path.write_text(
        TEMPLATE.format(title=args.title, post_date=args.post_date, category=args.category),
        encoding="utf-8",
    )
    print(f"Created {output_path}")


if __name__ == "__main__":
    main()
