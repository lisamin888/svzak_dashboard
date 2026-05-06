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

#### 항목 풀 (Color-coded box cloud)
12개 루틴 카테고리. 각 박스(태그):
- padding 6px 11px
- border 1.5px solid (태그 색상과 동일), border-radius 4px
- background: 태그 색상 (채움)
- text color: **항상 #FFFFFF** (라이트/다크 변경 없음), weight 700, 11px
- 좌측 6×6 동근라미 dot (rgba(255,255,255,0.7))
- **클릭 시 색상 피커 모달 열림** (아래 "분류 색상 시스템" 섹션 참조)

#### 주간 루틴 (Weekly grid)
- 7 columns, gap 4px
- 각 컬럼:
  - 요일 헤더: 모노 10px, today면 `hi` + 1px hi 하단 보더, 아니면 sub + 1px hair 하단 보더
  - 그 아래 해당 요일 항목들을 **세로로 쌓음**, gap 4px
  - 각 항목도 **태그 박스** (항목 풀과 동일한 색상 규칙): padding 5px 7px, border 1.5px solid (태그 색상), background (태그 색상), text white, weight 700, 10px, 좌측 5×5 동근 dot, word-break keep-all
  - 클릭 시 색상 피커 열림 (동일 동작)

#### 플래닝 (Plan list)
- 헤더 행: 좌(`2026.04.21 — 2026.05.04`, 모노 10px sub) — 우(`● 현재`, hi 700)
- 각 항목 (10px 0 padding, 1px hair 하단):
  - col 1 (54px): 시간 (`09:00`/`--:--`), 모노 11px weight 700, `--:--`이면 sub, 아니면 hi
  - col 2 (1fr): 텍스트 12.5px weight 500 ink
  - col 3 (18px): 14×14 동그라미 체크박스 (1px hair)

#### 이번 달 (Mini calendar — 활동량 dot + 인라인 펼침 + 플래닝 점프)
- 요일 헤더 7 col 그리드: M/T/W/T/F/S/S (모노 9px sub)
- 날짜 셀 7 col: aspect-ratio 1/1, 모노 10px
- **오늘(27)**: 배경 `hi`, 글자 `hiInk`, weight 900, border-radius 4px
- **활동량 dot**: 날짜별 완료 태스크 수에 비례해 셀 하단에 1~3개의 3×3 dot 표시 + 셀 배경에 옅은 음영(`rgba(ink, intensity*0.10)` light, `0.18` dark). 강도 = `Math.min(1, done/5)`
- **날짜 클릭** → 캘린더 바로 아래 인라인 패널 펼침 (panel 배경, 1px hair 보더, 4px radius):
  - 헤더: 날짜(모노 9px sub) + "N건 완료 · 컨디션 N" (16px weight 900) + × 닫기 버튼
  - 메트릭 줄: 모노 10px sub, `완료 N · 포커스 N · 컨디션 N`
  - 항목 리스트: 각 줄에 `✓` + 텍스트(line-through, done 색), 1px hair 구분선
  - 하단 버튼: "플래닝 탭에서 보기 →" (background `c.ink`, color `c.bg`, 모노 10px weight 700, full-width)
  - 기록이 없는 날짜는 "이 날짜에는 기록된 활동이 없어요." 표시
- **플래닝 점프**: 버튼 클릭 시 `tab='플래닝'`으로 전환 + 해당 날짜에 가장 가까운 결정 로그로 smooth scrollIntoView + 2.2초간 hi 색 라인 하이라이트 (border-left 3px hi + faint bg)

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

## 분류 색상 시스템 (중요)

항목 풀, 주간 루틴 등 모든 **태그 박스**는 동일한 색상 규칙을 따릅니다.

### 고정 프리셋 팔레트 (8개)
```ts
const COLOR_PRESETS = [
  '#E747A7', // 핑크
  '#4A61F2', // 블루
  '#00CA83', // 그린
  '#CB4456', // 레드
  '#E88000', // 오렌지
  '#009FCC', // 시안
  '#FFB922', // 옐로
  '#6846D9', // 보라
];
```

### 사용자 설정 + 영속화
- 각 태그(`routinePool[i]`)는 `color: string` (hex 또는 hsl) 필드를 가짐
- 사용자가 태그 박스를 클릭하면 색상 피커 모달 열림:
  - **PRESETS** 그리드 (8 columns): 클릭 시 즉시 적용 + 모달 닫힘
  - **CUSTOM HUE** 슬라이더 (0–360, 무지개 그라디언트 트랙 배경) → 하단 "이 색상으로 적용" 버튼으로 적용. 커스텀 색상은 `hsl(${hue}, 72%, 55%)` 포맷으로 저장
- 색상은 `localStorage` 키 `svzak.tagColors.v2`에 `{[tagId]: color}` 형태로 영속화 — 앱 재시작 후에도 유지
- 색 변경은 **모든 노출 위치에 즉시 동기** (항목 풀 + 주간 루틴 동시 변경)
- 텍스트는 색에 관계없이 **항상 #FFFFFF**, dot은 `rgba(255,255,255,0.7)` 고정

### Hex → Hue 변환 헬퍼
프리셋 hex를 슬라이더에 매핑해 종합 표시용. 구현: `hexToHue(hex)` — RGB→HSL hue 세그먼트 추출.

## Mock Data Source

`components/shared.jsx`의 `SVZAK_DATA` 객체. 실 앱에서는 Notion API + 로컬 store로 대체:
- `oneThing` — 현재 원씽 + 핵심 태스크 + 과거 완료
- `routinePool` — 12개 카테고리 (`id`, `label`, **`color`** hex)
- `weekly` — 요일별 카테고리 id 배열
- `planning` — 현재 주차 항목 + 시간
- `projects` — 6개 프로젝트
- `decisions` — 의사결정 로그 (날짜 문자열 `YYYY.MM.DD` 계산용)
- `today` — `progressPct`, `condition`, `streak`, `focusBlocks`
- **`daily`** — `{ 'YYYY-MM-DD': { done, focus, condition, items: string[] } }` — 미니 캘린더 활동량 dot + 인라인 펼침용

## State Management

탭 / 모드 / 프레임 width·height만 클라 상태. 데이터는 Notion DB → MCP → 로컬 캐시 흐름으로 별도 상태 관리(zustand/jotai 권장).

```ts
type Tab = '원씽' | '루틴' | '프로젝트' | '플래닝';
type Mode = 'light' | 'dark';

// 캘린더 → 플래닝 점프용 가벼운 세션 상태:
const [jumpDate, setJumpDate] = useState<string | null>(null); // 'YYYY-MM-DD'
// 캘린더에서 setJumpDate(dateStr) + setTab('플래닝')
// Planning 탭에서 useEffect로 하이라이트 적용 후 onJumpDone()
```

### Tag color state
```ts
type TagId = string;
type TagColor = string; // hex or 'hsl(H, 72%, 55%)'
const [colors, setColors] = useState<Record<TagId, TagColor>>(loadFromLocalStorage);
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

- 카테고리별 색상이 **적극적으로 사용됨** — 항목 풀 / 주간 루틴 모두 박스 채움 + 흰 텍스트. 액센트 색(`hi` 주황)은 **오늘 강조 + 수치 하이라이트**에만 제한적으로 사용.
- 한글이 주력이라 letter-spacing은 한글에서 보기 위해 `-0.012em` 기본값. 영문 라벨(JetBrains Mono)은 별도로 양수 spacing.
- 색상 대비는 접근성 관점에서 검토 필요: 8개 프리셋 모두 흰색 텍스트 공계 관점에서 WCAG AA(4.5:1) 이상을 확보하도록 선정되었으나, 사용자 커스텀 hue 설정 시 절대 안전은 보장 X (예: 노란/하늘색 근처). 필요 시 lightness 고정 55% 기준을 50%로 낮춰 대응 가능.
