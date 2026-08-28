# Blog post guide

`mds` 폴더에 Markdown 파일 하나를 추가하면 블로그 목록과 본문에 자동으로 반영됩니다.

## 작성 규칙

1. 파일 이름을 글 날짜와 같은 `YYYY-MM-DD.md` 형식으로 만듭니다.
2. 아래 frontmatter를 파일 맨 위에 넣습니다.
3. 두 번째 `---` 아래부터 Markdown으로 본문을 씁니다.
4. 변경 사항을 GitHub에 push합니다. GitHub Actions가 `posts.json`을 날짜 내림차순으로 자동 갱신합니다.

```md
---
title: "글 제목"
author: "Yooshin Kim"
published: "Blog"
date: 2026-08-29
category: "research note"
---

# 첫 번째 제목

본문을 작성합니다.
```

`title`, `author`, `published`, `date`, `category`는 모두 필수입니다. `date`는 실제 날짜여야 하며 파일 이름의 날짜와 같아야 합니다. 규칙이 틀리면 자동 생성 작업이 오류를 표시하므로 잘못된 글이 목록에 조용히 등록되지 않습니다.

같은 날짜에 글이 여러 개라면 `2026-08-29-first-post.md`, `2026-08-29-second-post.md`처럼 날짜 뒤에 영문 소문자·숫자 slug를 붙일 수 있습니다. 이때 frontmatter의 `date`는 둘 다 `2026-08-29`로 작성합니다.

로컬에서 목록을 미리 갱신하려면 저장소 루트에서 다음 명령을 실행합니다.

```sh
node scripts/generate-posts.js
```
