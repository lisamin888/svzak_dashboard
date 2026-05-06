# SVZAK Dashboard — 설치 가이드

## Claude Code에서 실행하기

### 1단계 — 폴더 이동
```bash
cd svzak-dashboard
```

### 2단계 — 의존성 설치
```bash
npm install
```

### 3단계 — 개발 모드로 바로 실행 (테스트)
```bash
npm start
```
→ 바탕화면에 플로팅 창이 뜨면 성공!

---

## 앱 빌드 (배포 파일 생성)

### Windows (.exe)
```bash
npm run build:win
```
→ `dist/SVZAK Dashboard Setup.exe` 생성

### Mac (.dmg)
```bash
npm run build:mac
```
→ `dist/SVZAK Dashboard.dmg` 생성

### Windows + Mac 동시
```bash
npm run build:all
```

---

## 아이콘 추가 (선택)
- `assets/icon.ico` — Windows용 (256x256)
- `assets/icon.icns` — Mac용

아이콘 없어도 기본 Electron 아이콘으로 빌드 됩니다.
아이콘 변환: https://convertio.co/png-ico/

---

## 기능 요약

| 탭 | 기능 |
|---|---|
| 원씽 | 나의 원씽 수정 가능 · 이번 주 체크리스트 |
| 루틴 | 요일별 루틴 · 하루 시간 블록 |
| 프로젝트 | 진행 중인 프로젝트 현황 |
| 오늘 | 오늘 할 일 (매일 초기화) |

- 항상 위 (Always on Top)
- 투명도 슬라이더
- 위치 자동 저장 (재시작해도 같은 위치)
- 데이터 로컬 저장 (electron-store)
