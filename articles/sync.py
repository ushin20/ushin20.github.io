import json
import re
import os
from datetime import datetime

POSTS_DIR = "./articles/mds"
OUTPUT_JSON = "./articles/posts.json"

def extract_metadata(md_file):
    with open(md_file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # --- 구분자로 나누기
    parts = re.split(r"---[\r\n]+", content)
    if len(parts) < 3:
        return None  # 메타데이터가 없으면 무시
    
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
                # 모든 메타데이터를 포함
                metadata["filename"] = filename  # 파일명도 추가
                posts.append(metadata)

    # 날짜 기준 내림차순 정렬
    def parse_date(date_str):
        try:
            return datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            return datetime.min  # 날짜가 잘못되었으면 가장 오래된 것으로 처리

    posts.sort(key=lambda x: parse_date(x.get("date", "0000-00-00")), reverse=True)

    # JSON 파일로 저장
    with open(OUTPUT_JSON, "w", encoding="utf-8") as json_file:
        json.dump(posts, json_file, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    update_posts_json()
    print(f"✅ Updated {OUTPUT_JSON} with extracted metadata.")