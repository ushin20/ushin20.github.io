[바로가기](https://ushin20.github.io/)

연구 소개, 학력, 연구 경력, 논문 및 수상 이력을 한 페이지에서 보여 주는 연구 포트폴리오입니다.

- `index.html`: About 원페이지. 논문과 수상 이력은 `data/cv.json`에서 불러옵니다.
- Publications 안에 International Publications, Domestic Publications, Preprints를 같은 단계의 하위 그룹으로 표시합니다. `data/cv.json`의 각 `publication_sections` 항목에 `scope: "international"` 또는 `scope: "domestic"`을 지정해 분류하며, 각 그룹 안에서 Journal과 Conference를 합쳐 정렬합니다. Preprints는 `preprints` 배열에서 불러옵니다.
- International은 항상 펼쳐 표시하고, Domestic과 Preprints는 기본 접힘 상태의 토글을 제공합니다. 제목에는 데이터에서 계산한 논문 수를 표시합니다. 토글 제목 전체를 클릭하거나 키보드로 조작할 수 있으며, 그룹 내부를 가리키는 앵커로 이동하면 해당 그룹을 펼칩니다.
- 각 논문 그룹과 Preprints는 `year` 내림차순, 같은 연도 안에서는 `month` 내림차순으로 정렬합니다. `month`에는 출판 월을 1~12의 숫자로 입력하며, 미확인은 `null`로 둡니다. 월이 없는 항목은 해당 연도 마지막에 표시하고, 같은 연·월끼리는 배열에 작성된 순서를 유지합니다.
- `paper.html?id=...`: 논문별 글 페이지. 왼쪽에는 돌아가기와 자동 목차, 가운데에는 논문 제목·베뉴·연도·저자와 본문을 표시합니다. 모바일 목차는 상단에서 펼칩니다. 목록은 `short_venue`의 약칭을 사용하고, 상세 글은 `venue`의 전체 발표처 이름을 표시합니다. `link_label`로 외부 링크 이름을 지정할 수 있습니다.
- 한글 논문은 공식 영문 제목을 우선하여 `title`, 한글 원제를 `original_title`, 본문 언어를 `language: "ko"`로 등록합니다. 목록에는 영문 제목을 표시하고 상세 페이지에는 한글 원제와 `(in Korean)`을 함께 표시합니다. 사용자 요청으로 직접 번역한 제목은 아래 출처 기록에서 공식 제목과 구분합니다.
- `lab.html`: 메인 페이지 하단의 Tool 링크로 연결되는 도구 목록. `data/labs.json`에서 관리합니다.
- `labs/`: Lotto Number Picker, Text Counter 등 개별 도구.
- `about.html`: 기존 주소로 방문하면 메인 페이지로 이동합니다.
- `scripts/footer.js`: 메인·논문 상세·도구 목록·개별 도구 페이지의 `[data-site-footer]`에 공통 푸터를 렌더링합니다. 이동 링크, 업데이트 날짜, 한국 현재 시각, 찰떡이 애니메이션을 이 파일에서 관리합니다. 링크와 이미지 주소는 스크립트 위치를 기준으로 계산해 하위 폴더에서도 같은 푸터를 사용합니다. 찰떡이는 `loading="lazy"`, `decoding="async"`로 불러옵니다. 사이트를 수정해 공개할 때 `lastUpdated`를 변경하며, 시계는 `Asia/Seoul` 기준으로 매분 자동 갱신됩니다.
- `styles/footer.css`: 공통 푸터의 배치와 반응형 스타일. 모든 페이지에서 `assets/chaldduck-rolling-double-blink.webp`를 원래 색상과 방향으로 표시하고, 마우스를 올리면 8배 확대합니다. 1024×1024 애니메이션 WebP는 원본 GIF에서 품질 90으로 변환했으며, 투명 배경과 프레임별 재생 시간을 유지하도록 저장했습니다. 앞을 보는 4초 동안 눈을 감았다 뜨고, 눈을 뜬 채 1.6초 유지한 뒤 다시 감았다 뜹니다. 이후 기존 동작대로 뒤로 굴렀다 돌아오며, 전체 8초 주기를 반복합니다. 새 페이지에는 이 스타일과 `scripts/footer.js`, `<footer class="site-footer" data-site-footer>`를 추가합니다.
- `styles/tools.css`: 도구 목록과 개별 도구의 공통 스타일. `styles/cv.css`와 함께 메인과 같은 본문 폭과 색상을 사용합니다.
- 사이트 전체의 영문·숫자는 [Inter](https://rsms.me/inter/) 가변 웹폰트, 한글은 기존 `fonts/ZEN-SERIF-TTF-Regular.ttf`를 사용합니다. `styles/site.css`의 공통 폰트와 한글 `unicode-range`로 적용하며, Zen Serif 원본은 변환하지 않습니다. 논문 제목의 Inter 굵기는 `460`이고, Inter 라이선스는 `fonts/Inter-LICENSE.txt`에 포함되어 있습니다.
- `articles/`: 기존 글 원문과 이미지 보관. Blog 화면과 자동 생성 기능은 제거했습니다.

논문 출판 월의 근거(2026-11-05 확인): 논문별 출처와 날짜 기준은 아래와 같습니다. KDPrint와 동형암호 논문은 사용자 요청에 따라 정식 권·호 발행일을 기준으로 연도와 월을 입력했습니다.

| 논문 | 정렬 기준 연·월 | 근거 |
| --- | --- | --- |
| DRAMA / KDD | 2026-08 | [ACM이 등록한 Crossref 기록](https://api.crossref.org/works/10.1145/3770855.3818125): 온라인 출판 2026-08-08, 인쇄 출판 2026-08-09 |
| Tracing the Origins / INTERSPEECH | 2026-09 | [ISCA가 등록한 Crossref 기록](https://api.crossref.org/works/10.21437/Interspeech.2026-2354): 온라인 출판 2026-09-27 |
| LCDTwin / RAAI | 2025-12 | [IEEE가 등록한 Crossref 기록](https://api.crossref.org/works/10.1109/RAAI67517.2025.11423321): 출판 2025-12-18. [IEEE Xplore](https://ieeexplore.ieee.org/document/11423321/)의 추가일 2026-03-12와 구분 |
| ICSDiag / IEEE Access | 2026-11 | 2026-11-05 사용자 지정. [Crossref](https://api.crossref.org/works/10.1109/ACCESS.2026.3749018)의 출판 날짜에는 2026년만 있어 월을 확인하지 못함 |
| KDPrint / Computers & Security | 2026-01 | [출판사](https://www.sciencedirect.com/science/article/abs/pii/S0167404825004146)의 정식 권·호 발행일: Volume 160, January 2026 |
| Privacy-Preserving Anomaly Detection / IEEE ESL | 2025-08 | [IEEE가 등록한 Crossref 기록](https://api.crossref.org/works/10.1109/LES.2025.3538013)의 정식 발행 월: 2025-08 |
| 토폴로지 기반 기능 패치 분해 / KIISE | 2026-06 | [학회 논문 페이지](https://jok.kiise.or.kr/digital-library/107651): Vol. 53, No. 6, Jun. 2026 |
| 다중 스케일 스펙트럼 원 코덱 식별 / KCC | 2025-07 | [DGIST 연구성과 기록](https://scholar.dgist.ac.kr/handle/20.500.11750/60097): 발행 2025-07-02 |
| 기능 패치 기반 경량 이상 탐지 / KCC | 2025-07 | [DGIST 연구성과 기록](https://scholar.dgist.ac.kr/handle/20.500.11750/60096): 발행 2025-07-02 |
| 산업제어시스템 AI IDS 연구 동향 / KIISC | 2023-12 | [DBpia 논문 페이지](https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11653410): 발행 2023.12 |

Preprints의 MARQ, ELStego, A Phased Zero Trust Migration Framework for Resilient Space Systems는 공개 출판 월을 확인하지 못해 `month: null`로 유지합니다.

한글 논문의 영문 제목 출처 및 번역 기준(2026-11-05 확인):

| 논문 ID | 제목 출처 |
| --- | --- |
| `topology-functional-patches-2026` | [Journal of KIISE의 영문 제목](https://jok.kiise.or.kr/digital-library/107651) |
| `spectral-codec-identification-2025` | [DGIST Scholar의 Alternative Title](https://scholar.dgist.ac.kr/handle/20.500.11750/60097) |
| `functional-patch-anomaly-detection-2025` | [DGIST Scholar의 Alternative Title](https://scholar.dgist.ac.kr/handle/20.500.11750/60096) |
| `ics-ai-ids-survey-2023` | 사용자 요청에 따라 [DGIST Scholar에 등록된 한글 원제](https://scholar.dgist.ac.kr/handle/20.500.11750/47701)를 직접 영어로 번역. 공식 영문 제목이 아니며, 한글 원제는 `original_title`에 보존 |

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
