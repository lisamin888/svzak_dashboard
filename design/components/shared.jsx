// Shared utilities for SVZAK dashboard variations.
// Mock data + tiny helpers used across all three variations.

const SVZAK_DATA = {
  oneThing: {
    status: '진행중',
    period: '2026.01 — 현재',
    title: '인스타그램 포트폴리오를 완성해 첫 번째 인바운드 클라이언트 문의를 받는 것',
    progress: { done: 2, total: 4, pct: 50 },
    tasks: [
      { id: 1, text: 'ONEkimbap 캡션 작성 & 게시', done: false },
      { id: 2, text: '웹사이트 마이그레이션 최종 확인', done: false },
      { id: 3, text: 'Etsy 키체인 홍보 게시물 1개', done: true },
      { id: 4, text: 'Claude Design으로 웹사이트 시안 탐색', done: true },
    ],
    completed: [
      { period: '2025.11 — 2025.12', text: '프리다이빙 키체인을 Etsy에 출시하는 것' },
      { period: '2025.10 — 2025.11', text: 'SVZAK 웹사이트를 Next.js + Vercel로 마이그레이션하는 것' },
    ],
  },
  routinePool: [
    { id: 'brand', label: '브랜딩', hue: 280 },
    { id: 'web', label: '웹사이트', hue: 220 },
    { id: 'portfolio', label: '포폴 콘텐츠', hue: 260 },
    { id: 'free', label: '프리다이빙', hue: 200 },
    { id: 'ai', label: 'AI 툴', hue: 40 },
    { id: 'bbeme', label: '뷩빼미', hue: 0 },
    { id: 'insta', label: '인스타 콘텐츠', hue: 160 },
    { id: 'invest', label: '투자 리뷰', hue: 350 },
    { id: 'review', label: '주간 회고', hue: 30 },
    { id: 'rest', label: '휴식', hue: 180 },
    { id: 'etsy', label: 'Etsy/뷩빼미', hue: 320 },
    { id: 'client', label: '클라이언트', hue: 140 },
  ],
  weekly: {
    월: ['brand', 'web'],
    화: ['portfolio', 'free'],
    수: ['ai', 'bbeme'],
    목: ['brand', 'free'],
    금: ['insta', 'invest'],
    토: ['free', 'etsy', 'review'],
    일: ['rest'],
  },
  planning: {
    range: '2026.04.21 — 2026.05.04',
    items: [
      { time: '09:00', text: 'ONEkimbap 케이스 스터디 캡션 작성 & 게시', done: false },
      { time: '11:00', text: '감탄9 브랜딩 케이스 스터디 초안 작성', done: false },
      { time: '--:--', text: '웹사이트 마이그레이션 최종 체크', done: false },
      { time: '--:--', text: '프리다이빙 주 2회 훈련 유지', done: false },
      { time: '--:--', text: 'Etsy 키체인 홍보 게시물 1개', done: false },
    ],
  },
  projects: [
    { name: '인스타 포트폴리오', meta: 'ONEkimbap → 감탄9 → Snaks 순서로 업로드 중', status: '진행', dot: '#a3e635' },
    { name: 'SVZAK 웹사이트', meta: 'Next.js + Vercel 마이그레이션 · 거의 완료', status: '진행', dot: '#a3e635' },
    { name: '프리다이빙 키체인', meta: '10m CWT 자수 키체인 · Etsy 출시 완료', status: '진행', dot: '#a3e635' },
    { name: '뷩빼미 (Buo Fami)', meta: '아트토이 + 디지털 내러티브 · 대기 중', status: '검토', dot: '#facc15' },
    { name: 'svzaklab.vercel.app', meta: 'PPT 견적 → 링크모듈 SaaS 피벗 검토 중', status: '검토', dot: '#facc15' },
    { name: 'AI 팀 앱 (Node.js)', meta: '6인 멀티페르소나 · 성능 이슈로 보류', status: '보류', dot: '#71717a' },
  ],
  decisions: [
    {
      date: '2026.04.27',
      title: 'Notion DB 구조 & 앱 연동 방향 확정',
      bullets: [
        '원씽 리스트 + 항목 풀 + 플래닝 + 결정 로그 DB 구성',
        'Claude → Notion MCP → Electron 앱 동기화 흐름 확정',
        '하루 블록은 Notion 동기화 읽기 전용으로',
      ],
    },
    {
      date: '2026.04.20',
      title: '인스타 포트폴리오 게시 전략 확정',
      bullets: [
        '캡션은 케이스 스터디 형식으로',
        '게시 순서: ONEkimbap → 감탄9 → Snaks → JD Solution → Metafor',
        '월 200만원 인바운드 수주를 2026 수익 목표로 설정',
      ],
    },
    {
      date: '2026.04.08',
      title: 'svzaklab 피벗 방향 검토',
      bullets: [
        'AI PPT 툴 범람으로 PPT 견적 모델 경쟁력 약화',
        '링크모듈 SaaS 전환 가능성 검토 — 의사결정 보류',
      ],
    },
  ],
  // Daily progress / condition
  today: {
    progressPct: 38,
    condition: 72, // 0–100
    streak: 12,
    focusBlocks: { done: 3, total: 6 },
  },
};

// Today + monthly calendar helper
function getCalendarMatrix(year = 2026, month = 4 /* 1-indexed */) {
  const first = new Date(year, month - 1, 1);
  const startWeekday = first.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];
  // Start on Monday
  const offset = (startWeekday + 6) % 7;
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const TABS = ['원씽', '루틴', '프로젝트', '플래닝'];

window.SVZAK_DATA = SVZAK_DATA;
window.getCalendarMatrix = getCalendarMatrix;
window.TABS = TABS;
