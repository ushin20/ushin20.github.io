import json
import re
import os
from datetime import datetime

POSTS_DIR = "./archive/posts"
OUTPUT_JSON = "./archive/posts.json"

def extract_metadata(md_file):
    with open(md_file, "r", encoding="utf-8") as f:
        content = f.read()
    
    parts = re.split(r"---[\r\n]+", content)
    if len(parts) < 3:
        return None
    
    meta_block = parts[1].strip()
    meta_lines = meta_block.split("\n")
    metadata = {}
    
    for line in meta_lines:
        match = re.match(r"(.*?):\s*\"?(.*?)\"?$", line)
        if match:
            key, value = match.groups()
            metadata[key.lower()] = value.strip()
    
    return metadata

def update_posts_json():
    posts = []
    
    for filename in os.listdir(POSTS_DIR):
        if filename.endswith(".md"):
            md_file_path = os.path.join(POSTS_DIR, filename)
            metadata = extract_metadata(md_file_path)
            if metadata:
                post_entry = {
                    "title": filename,
                    "date": metadata.get("date", "unknown"),
                    "category": metadata.get("category", "uncategorized")
                }
                posts.append(post_entry)
    
    posts.sort(key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d") if x["date"] != "0000-00-00" else datetime.min, reverse=True)

    with open(OUTPUT_JSON, "w", encoding="utf-8") as json_file:
        json.dump(posts, json_file, indent=2)

if __name__ == "__main__":
    update_posts_json()
    print(f"Updated {OUTPUT_JSON} with extracted metadata.")
