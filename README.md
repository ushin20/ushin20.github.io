[바로가기](https://ushin20.github.io/)

연구 소개, 학력, 연구 경력, 논문 및 수상 이력을 한 페이지에서 보여 주는 연구 포트폴리오입니다.

- `index.html`: About 원페이지. 논문과 수상 이력은 `data/cv.json`에서 불러옵니다.
- `paper.html?id=...`: 논문별 글 페이지. 왼쪽에는 돌아가기와 자동 목차, 가운데에는 논문 제목·베뉴·연도·저자와 본문을 표시합니다. 모바일 목차는 상단에서 펼칩니다. 목록은 `short_venue`의 약칭을 사용하고, 상세 글은 `venue`의 전체 발표처 이름을 표시합니다. `link_label`로 외부 링크 이름을 지정할 수 있습니다.
- `lab.html`: 메인 페이지 하단의 Tool 링크로 연결되는 도구 목록. `data/labs.json`에서 관리합니다.
- `labs/`: Lotto Number Picker, Text Counter 등 개별 도구.
- `about.html`: 기존 주소로 방문하면 메인 페이지로 이동합니다.
- `scripts/footer.js`: 메인·논문 상세·도구 페이지 하단의 업데이트 날짜와 한국 현재 시각. 사이트를 수정해 공개할 때 `lastUpdated`를 변경합니다. 시계는 `Asia/Seoul` 기준으로 매분 자동 갱신됩니다.
- `styles/tools.css`: 도구 목록과 개별 도구의 공통 스타일. `styles/cv.css`와 함께 메인과 같은 본문 폭·색상·하단 정보를 사용합니다. 하단 찰떡이는 `assets/chaltteok_bunny_hop_transparent.gif`를 CSS로 무채색 처리하고 좌우 반전해 표시합니다.
- 사이트 전체의 영문·숫자는 [Inter](https://rsms.me/inter/) 가변 웹폰트, 한글은 기존 `fonts/ZEN-SERIF-TTF-Regular.ttf`를 사용합니다. `styles/site.css`의 공통 폰트와 한글 `unicode-range`로 적용하며, Zen Serif 원본은 변환하지 않습니다. 논문 제목의 Inter 굵기는 `460`이고, Inter 라이선스는 `fonts/Inter-LICENSE.txt`에 포함되어 있습니다.
- `articles/`: 기존 글 원문과 이미지 보관. Blog 화면과 자동 생성 기능은 제거했습니다.

로컬 미리보기는 저장소 루트에서 `python -m http.server 8000`을 실행한 뒤 `http://localhost:8000/`에 접속합니다.

논문 본문은 `data/cv.json`의 해당 논문에 선택적으로 추가합니다. `body`는 도입 문단, `abstract`는 초록, `sections`는 소제목이 있는 본문입니다. 문단 사이에는 `\n\n`을 넣습니다. 내용이 있는 섹션만 표시하고 목차를 생성하므로, 아직 작성하지 않은 논문은 기존 정보와 링크만 보여 줍니다.

```json
{
  "body": "도입 문단입니다.\n\n두 번째 문단입니다.",
  "abstract": "초록입니다.",
  "sections": [
    {
      "id": "method",
      "heading": "Method",
      "text": "연구 방법을 설명하는 문단입니다.",
      "figure": {
        "src": "./assets/paper-figure.png",
        "alt": "그림의 내용을 설명하는 대체 텍스트",
        "caption": "그림 설명",
        "width": 1200,
        "height": 720
      }
    }
  ]
}
```

`figure`는 생략할 수 있습니다. 섹션의 `id`를 지정하면 `paper.html?id=논문ID#paper-section-method`처럼 해당 소제목에 바로 연결할 수 있습니다. 글 스타일은 `styles/paper.css`에서 관리합니다.
