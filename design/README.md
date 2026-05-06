# Handoff: SVZAK Floating Dashboard — Zen Mono Redesign

## Overview

SVZAK는 1인 디자이너/개발자(즉, 본인)의 데일리 작업을 위한 **PC 플로팅 대시보드 앱**(Electron 기반).
사용자의 하루 루틴 / 진행 중인 원씽(One Thing) / 프로젝트 / 의사결정 로그를 한 윈도우 안에서 보여줍니다.

이 핸드오프는 기존 Electron 앱의 디자인을 **"브루털리스트 + 젠/모노크롬"** 톤으로 리디자인한 결과물(Variation B — Zen Mono)을 실제 앱에 옮기기 위한 패키지입니다.

## About the Design Files

이 번들에 들어있는 HTML/JSX 파일들은 **디자인 레퍼런스**입니다 — 의도된 룩과 동작을 보여주는 React + Babel 프로토타입이에요.
**그대로 복사해서 출시하지 마세요.** 작업의 핵심은 이 디자인을 **기존 Electron 앱의 환경**(렌더러 측에서 사용 중인 React/Vue/Svelte 등 + 빌드 시스템)에 맞춰 **컴포넌트 단위로 재구현**하는 것입니다. 만약 아직 환경이 정립되지 않았다면 React + Vite + TypeScript + 모듈 CSS 또는 Tailwind 조합을 권장합니다.

## Fidelity

**High-fidelity (hifi)**. 색상 / 타이포그래피 / 간격 / 인터랙션 모두 최종에 가깝게 정의되어 있어요. 픽셀 단위로 추종해주세요.
폰트와 액센트 색상은 디자인 시스템에 토큰으로 등록 후 사용 권장.

## Frame & Responsive Behavior

| 항목 | 값 |
|---|---|
| Min width | 360px (1-column 레이아웃) |
| Wide threshold | **620px** 이상 → 2-column 레이아웃 |
| Max width | 1100px 까지 자연스럽게 늘어남 |
| Min height | 480px |
| Max height | 900+ |
| Window chrome | frameless (Electron `frame: false`), border-radius 12px, custom title bar |
| Resize | 모서리 드래그(`resize: both`) + 외부 슬라이더 모두 지원 |

레이아웃은 가로폭 620px을 기준으로 1-col / 2-col 사이를 자동 전환. 트랜지션은 width 0.22s cubic-bezier(.2,.7,.3,1).

## Design Tokens

### Colors

```ts
// Light mode
const light = {
  bg:    '#fafaf7',           // 화면 베이스 — 약간 따뜻한 오프-화이트
  ink:   '#111110',           // 본문 텍스트
  sub:   '#8a8a82',           // 보조 텍스트, 메타
  faint: '#d8d6cf',           // 채워진 배경(태그, 진행률 트랙)
  hair:  'rgba(0,0,0,0.08)',  // 1px 헤어라인
  panel: '#ffffff',           // 카드/패널 위로 올라오는 면
  hi:    '#ff5722',           // 액센트 — 차분한 주황
  hiInk: '#ffffff',           // hi 위 텍스트
  done:  '#b6b6ad',           // 완료 처리(스트라이크 + 흐림)
};

// Dark mode
const dark = {
  bg:    '#0a0a09',
  ink:   '#ededeb',
  sub:   '#7a7a72',
  faint: '#1c1c18',
  hair:  'rgba(255,255,255,0.08)',
  panel: '#121210',
  hi:    '#ff7043',
  hiInk: '#0a0a09',
  done:  '#3a3a35',
};
```

### Typography

| 역할 | 패밀리 | weight | size | letter-spacing |
|---|---|---|---|---|
| Body / UI | Satoshi (영문) + Pretendard Variable (한글) | 500 | 12–13px | -0.012em |
| Headline (Hero) | Satoshi 900 + Pretendard 900 | 900 | 28px | -0.025em |
| Section title | Satoshi 900 + Pretendard 900 | 900 | 15–22px | -0.015em |
| Mono label / 숫자 / 시간 | JetBrains Mono | 400/700 | 9–11px | 0.06–0.18em (대문자 라벨일수록 큼) |
| Logo `S V Z A K` | Satoshi 900 | 900 | 12px | 0.22em |

폰트 로딩:
- Satoshi: `https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap`
- Pretendard: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css`
- JetBrains Mono: Google Fonts, weights 400/500/700

### Spacing / Radii / Lines

- 본문 가로 패딩: 28px (헤더·콘텐츠 동일)
- 섹션 사이 간격: 24px (`SectionLabel` 위)
- 카드/항목 안쪽 패딩: 10–14px
- 헤어라인: `1px solid hair` — 모든 분할선
- 진행률 바 두께: **1px** (얇게, 점이 위에 떠 있는 패턴)
- Border-radius: 4px(키), 6px(카드), 12px(윈도우 외곽), 999px(태그/배지)
- Shadow: 윈도우 외곽 `0 16px 50px rgba(0,0,0,0.18)` 만 사용. 내부는 그림자 X.

### Motion

- 색/탭 트랜지션: `color 0.15s`, `background 0.12s`
- 윈도우 리사이즈 트랜지션: `width 0.22s cubic-bezier(.2,.7,.3,1)`
- 호버: 색만 미세하게(0.12–0.15s). 변형 / 그림자 X.

## Screens / Tabs

윈도우 chrome는 4개 탭을 가진 단일 뷰. 탭 전환은 클라이언트 사이드 라우팅(상태 변수). URL 변경 X.

### 0. Window Chrome

- **Header** (padding: 14px 28px 10px)
  - 좌: `S V Z A K` (letter-spacing 0.22em, weight 900, 12px)
  - 우: `OPACITY ●` (모노 9px sub) + 14px 동그란 minimize/close 버튼 (HTML/CSS 구현)
  - 헤더 아래 1px hair 분할선 X (탭 영역에서 처음 등장)

- **Tabs** (padding: 4px 28px 0, gap: 22px)
  - 4개: 원씽 / 루틴 / 프로젝트 / 플래닝
  - 비활성: weight 500, color sub
  - 활성: weight 900, color ink, 1.5px solid ink underline (margin-bottom: -1px)
  - 탭 행 하단에 1px hair 분할선

- **Footer** (padding: 8px 28px, top: 1px hair)
  - 좌: `2026.04.27 월` (모노 9px sub)
  - 우: `● Notion 동기화` (live status)

### 1. 루틴 (focal — 가장 중요한 탭)

```
WIDE (≥620px):
┌─────────────────────────┬─────────────────────────┐
│ Hero (오늘 N%, 연속 N일) │ SECTION: 주간 루틴      │
│ ─────────────────────── │ Weekly grid (7 columns) │
│ SECTION: 오늘의 컨디션  │ ─────────────────────── │
│ Bar: 진행률 / 컨디션 /  │ SECTION: 플래닝         │
│      포커스 블록        │ Plan list (시간 정렬)   │
│ ─────────────────────── │                         │
│ SECTION: 항목 풀        │                         │
│ Pill cloud (12 routines)│                         │
│ ─────────────────────── │                         │
│ SECTION: 이번 달        │                         │
│ Mini calendar (7 col)   │                         │
└─────────────────────────┴─────────────────────────┘

NARROW (<620px): 위 모든 섹션을 단일 컬럼으로 차례대로
```

#### Hero
- 라벨: `MON · 2026.04.27 · WK 18` (모노 9px sub, letter-spacing 0.16em)
- 헤드라인 2줄, 28px / line-height 1.1 / weight 900:
  - `오늘 [38%],` — 38% 부분만 `hi` 색상
  - `연속 12일.`

#### 오늘의 컨디션 (3 bars)
각 막대:
- 라벨 행: 좌(label, 모노 10px sub) — 우(`{val}/{max}`, 모노 10px weight 700)
- 1px faint 트랙
- 막대: 1px ink 진행분
- 진행분 끝 위에 5×5px **hi 색 동그란 점** (top: -2px, transform: translateX(-50%))

3개 막대: `진행률 38/100`, `컨디션 72/100`, `포커스 블록 3/6`

#### 항목 풀 (Pill cloud)
12개 루틴 카테고리. 각 알약:
- padding 4px 10px
- border 1px hair, border-radius 999px
- weight 500, 11px
- 색은 ink (단색 — 원본의 다채로운 색은 의도적으로 제거)

#### 주간 루틴 (Weekly grid)
- 7 columns, gap 6px
- 각 컬럼:
  - 요일 헤더: 모노 10px, today면 `hi` + 1px hi 하단 보더, 아니면 sub + 1px hair 하단 보더, 아래 2px 마진
  - 그 아래 해당 요일 항목들을 **세로로 쌓음**, gap 4px
  - 각 항목: 4px 5px 패딩, 좌측 2px solid ink 보더, 10px weight 500, word-break keep-all

#### 플래닝 (Plan list)
- 헤더 행: 좌(`2026.04.21 — 2026.05.04`, 모노 10px sub) — 우(`● 현재`, hi 700)
- 각 항목 (10px 0 padding, 1px hair 하단):
  - col 1 (54px): 시간 (`09:00`/`--:--`), 모노 11px weight 700, `--:--`이면 sub, 아니면 hi
  - col 2 (1fr): 텍스트 12.5px weight 500 ink
  - col 3 (18px): 14×14 동그라미 체크박스 (1px hair)

#### 이번 달 (Mini calendar)
- 요일 헤더 7 col 그리드: M/T/W/T/F/S/S (모노 9px sub)
- 날짜 셀 7 col: aspect-ratio 1/1, 모노 10px, 빈 셀은 `·`
- **오늘(27)**: 배경 `hi`, 글자 `hiInk`, weight 900, border-radius 4px

### 2. 원씽 (One Thing)

```
WIDE: 좌(메인) 1.4fr | 우(완료 히스토리) 1fr, columnGap 36px
NARROW: 메인 → 26px gap → 완료 (세로)
```

**메인:**
- 메타: `● 진행중 · 2026.01 — 현재` (모노 10px sub)
- 타이틀: 24px weight 900, line-height 1.25 (2-3줄 wrap)
- 진행률 행: `핵심 태스크` (sub) — `2/4 · 50%` (700)
- 1px faint 트랙 + hi 진행분
- 태스크 목록 (10px 0 padding, 1px hair 하단):
  - 14×14 체크박스: 1px solid ink (체크되면 ink fill + 라인-스루)
  - 텍스트 13px weight 500, 완료면 `done` 색 + line-through

**완료 (사이드):**
- 라벨 `완료` (모노 9px sub uppercase)
- 각 항목: 12px 0 padding, 1px hair 하단
  - 기간 (모노 10px sub) + 텍스트 12px line-through done

하단 점선 박스: `+ 새 원씽 (Notion 연동 후 활성화)` (모노 11px sub)

### 3. 프로젝트

```
WIDE: 2 columns, columnGap 36px
NARROW: 1 column
```

각 프로젝트 행 (14px 0 padding, 1px hair 하단):
- col 1 (8px): 6×6 동그란 dot — 색은 데이터별 (`#a3e635` 진행, `#facc15` 검토, `#71717a` 보류)
- col 2 (1fr): 이름 14px weight 900 + 메타 11.5px sub
- col 3 (auto): 상태 라벨 (`진행`/`검토`/`보류`) — 모노 9px sub uppercase, letter-spacing 0.1em

### 4. 플래닝 (의사결정 로그)

```
WIDE: 2 columns
NARROW: 1 column
```

각 결정 (margin-bottom 24px):
- 날짜 (모노 10px sub)
- 타이틀 15px weight 900
- 불릿 (3px 0 padding, 14px 좌측, line-height 1.55):
  - `—` 좌측 absolute 정렬
  - 12px sub

## Mock Data Source

`components/shared.jsx`의 `SVZAK_DATA` 객체. 실 앱에서는 Notion API + 로컬 store로 대체:
- `oneThing` — 현재 원씽 + 핵심 태스크 + 과거 완료
- `routinePool` — 12개 카테고리 (id, label, hue)
- `weekly` — 요일별 카테고리 id 배열
- `planning` — 현재 주차 항목 + 시간
- `projects` — 6개 프로젝트
- `decisions` — 의사결정 로그
- `today` — `progressPct`, `condition`, `streak`, `focusBlocks`

## State Management

탭 / 모드 / 프레임 width·height만 클라 상태. 데이터는 Notion DB → MCP → 로컬 캐시 흐름으로 별도 상태 관리(zustand/jotai 권장).

```ts
type Tab = '원씽' | '루틴' | '프로젝트' | '플래닝';
type Mode = 'light' | 'dark';
```

## Electron 통합 메모

- 윈도우: `frame: false`, `transparent: true`, `resizable: true`, `minWidth: 360`, `minHeight: 480`
- 헤더 영역에 `-webkit-app-region: drag` 적용, 토글/버튼은 `no-drag`
- 우상단 OPACITY 슬라이더는 `win.setOpacity(value)` 와 연동
- `−` / `×` 버튼은 IPC로 minimize / close

## Files in this bundle

- `SVZAK Dashboard.html` — 통합 프로토타입 (resize handle + 슬라이더 + 라이트/다크 토글 포함)
- `components/var-b-zen.jsx` — 모든 화면의 React 컴포넌트 (Variation B — Zen Mono)
- `components/shared.jsx` — 목 데이터 + 캘린더 헬퍼
- `styles/fonts.css` — Satoshi / Pretendard / JetBrains Mono import + CSS 변수

## Implementation Order Suggestion

1. 디자인 토큰부터 (`tokens.ts` / Tailwind config) — 색·폰트·radius·hair 라인
2. Window chrome (헤더 + 탭 + 푸터) — 프레임리스 윈도우와 IPC 연결
3. **루틴 탭** (가장 자주 보는 탭) — Hero, Bars, Pool, Weekly, Plan list, MiniCal
4. 나머지 탭 3개 (원씽 → 프로젝트 → 플래닝)
5. 라이트/다크 모드 토글 + 시스템 테마 따라가기
6. Notion 연동 (읽기 전용으로 시작)
7. 인터랙션: 체크박스 토글, 태스크 추가, 항목 풀 편집

## Notes

- 원본 디자인의 형광 그린·다채로운 카테고리 색은 **의도적으로 제거**했어요 — 도구다움과 정보 위주 톤을 유지하기 위해 액센트 1색(`hi` 주황)으로 통일.
- 만약 카테고리별 색이 정보 가독성에 필수면, 점(dot)이나 좌측 보더에만 색을 한정하는 방식으로 다시 도입 가능.
- 한글이 주력이라 letter-spacing은 한글에서 보기 위해 `-0.012em` 기본값. 영문 라벨(JetBrains Mono)은 별도로 양수 spacing.
