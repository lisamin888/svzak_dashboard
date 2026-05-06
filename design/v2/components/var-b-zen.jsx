// Variation B — Zen Mono
// 여백, 호흡감, 헤어라인. 굵은 표제는 Satoshi Black + 큰 사이즈.
// 그리드 없음, 큼직한 빈 공간으로 위계 표현.

const VarB = (() => {
  const { useState, useEffect, useMemo, useRef } = React;
  const D = window.SVZAK_DATA;

  // ───────── 분류 색상 시스템 ─────────
  // 고정 팔레트 8개 + hue 자유 조절 슬라이더. 단일 hex 값을 localStorage에 저장.
  const COLOR_PRESETS = [
    '#E747A7', '#4A61F2', '#00CA83', '#CB4456',
    '#E88000', '#009FCC', '#FFB922', '#6846D9',
  ];
  const STORAGE_KEY = 'svzak.tagColors.v2';

  // hex → oklch hue/chroma/lightness 대략 추정 (팔레트 톤 유지용)
  function hexToHue(hex) {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0,2),16)/255;
    const g = parseInt(h.slice(2,4),16)/255;
    const b = parseInt(h.slice(4,6),16)/255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    let hue = 0;
    const d = max - min;
    if (d !== 0) {
      switch (max) {
        case r: hue = ((g - b) / d) % 6; break;
        case g: hue = (b - r) / d + 2; break;
        case b: hue = (r - g) / d + 4; break;
      }
      hue = Math.round(hue * 60);
      if (hue < 0) hue += 360;
    }
    return hue;
  }

  function loadColors() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    const init = {};
    D.routinePool.forEach((p) => { init[p.id] = p.color; });
    return init;
  }
  function saveColors(h) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(h)); } catch (e) {}
  }

  // 키 채워진 팔레트 톤으로 박스 색상 생성 — 항상 흰색 텍스트
  function tagColors(hex, mode) {
    if (!hex) hex = '#6846D9';
    if (hex.startsWith('hsl')) {
      // hue 슬라이더에서 온 hsl 문자열
      const m = hex.match(/hsl\((\d+)/);
      const hue = m ? parseInt(m[1], 10) : 0;
      const baseLight = mode === 'dark' ? 52 : 55;
      const borderLight = mode === 'dark' ? 65 : 42;
      return {
        bg: `hsl(${hue}, 72%, ${baseLight}%)`,
        border: `hsl(${hue}, 78%, ${borderLight}%)`,
        ink: '#ffffff',
        dot: `hsl(${hue}, 90%, 88%)`,
      };
    }
    return {
      bg: hex,
      border: hex,
      ink: '#ffffff',
      dot: 'rgba(255,255,255,0.7)',
    };
  }

  const palette = {
    light: {
      bg: '#fafaf7',
      ink: '#111110',
      sub: '#8a8a82',
      faint: '#d8d6cf',
      hair: 'rgba(0,0,0,0.08)',
      panel: '#ffffff',
      hi: '#ff5722',  // 차분한 오렌지 액센트
      hiInk: '#ffffff',
      done: '#b6b6ad',
    },
    dark: {
      bg: '#0a0a09',
      ink: '#ededeb',
      sub: '#7a7a72',
      faint: '#1c1c18',
      hair: 'rgba(255,255,255,0.08)',
      panel: '#121210',
      hi: '#ff7043',
      hiInk: '#0a0a09',
      done: '#3a3a35',
    },
  };

  function App({ mode = 'light', activeTab = '루틴', width = 720, onTabChange }) {
    const c = palette[mode];
    const [tab, setTab] = useState(activeTab);
    const [colors, setColors] = useState(loadColors);
    const [pickerFor, setPickerFor] = useState(null); // tag id
    // 플래닝 점프 — 캘린더에서 날짜 선택하면 플래닝 탭으로 이동 + 해당 날짜 하이라이트
    const [jumpDate, setJumpDate] = useState(null);
    const wide = width >= 620;
    const setT = (v) => { setTab(v); if (onTabChange) onTabChange(v); };

    useEffect(() => { if (activeTab !== tab) setTab(activeTab); }, [activeTab]);

    const setColor = (id, color) => {
      const next = { ...colors, [id]: color };
      setColors(next); saveColors(next);
    };
    const tagFor = (id) => {
      const item = D.routinePool.find(p => p.id === id);
      const color = colors[id] ?? item?.color ?? '#6846D9';
      return { item, color, ...tagColors(color, mode) };
    };
    const jumpToPlanning = (dateStr) => {
      setJumpDate(dateStr);
      setT('플래닝');
    };

    return (
      <div style={{
        width: '100%', height: '100%',
        background: c.bg, color: c.ink,
        fontFamily: 'var(--font-sans)',
        display: 'flex', flexDirection: 'column',
        letterSpacing: '-0.012em',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <Header c={c} />
        <Tabs c={c} tab={tab} setTab={setT} />
        <div style={{ flex: 1, overflow: 'auto', padding: '0 28px 24px', minHeight: 0 }}>
          {tab === '원씽' && <OneThing c={c} wide={wide} />}
          {tab === '루틴' && <Routine c={c} mode={mode} wide={wide} tagFor={tagFor} onPick={setPickerFor} onJump={jumpToPlanning} />}
          {tab === '프로젝트' && <Projects c={c} wide={wide} />}
          {tab === '플래닝' && <Planning c={c} wide={wide} jumpDate={jumpDate} onJumpDone={() => setJumpDate(null)} />}
        </div>
        <Footer c={c} />
        {pickerFor && (
          <ColorPicker
            c={c} mode={mode}
            tag={D.routinePool.find(p => p.id === pickerFor)}
            currentColor={colors[pickerFor]}
            onPick={(col) => { setColor(pickerFor, col); }}
            onClose={() => setPickerFor(null)}
          />
        )}
      </div>
    );
  }

  // ───────── 색상 피커 (태그 박스 클릭 시 표시) ─────────
  // 8개 고정 팔레트 + hue 슬라이더 — 둘 다 텍스트 흰색 유지
  function ColorPicker({ c, mode, tag, currentColor, onPick, onClose }) {
    if (!tag) return null;
    const presetActive = COLOR_PRESETS.includes(currentColor);
    const initialHue = presetActive ? hexToHue(currentColor) : (currentColor && currentColor.startsWith('hsl') ? parseInt(currentColor.match(/hsl\((\d+)/)?.[1] || '0', 10) : hexToHue(currentColor || '#6846D9'));
    const [sliderHue, setSliderHue] = useState(initialHue);
    const customColor = `hsl(${sliderHue}, 72%, 55%)`;
    return (
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: mode === 'dark' ? 'rgba(0,0,0,0.55)' : 'rgba(20,20,18,0.32)',
          backdropFilter: 'blur(2px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50,
        }}
      >
        <div onClick={(e) => e.stopPropagation()} style={{
          background: c.panel, color: c.ink,
          padding: '18px 20px', borderRadius: 8,
          border: `1px solid ${c.hair}`,
          boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
          minWidth: 280, maxWidth: 340,
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', color: c.sub, textTransform: 'uppercase', marginBottom: 6 }}>
            분류 색상 · {tag.label}
          </div>
          <div style={{ fontSize: 12, color: c.sub, marginBottom: 14, lineHeight: 1.5 }}>
            태그별 색상은 항목 풀, 주간 루틴 등 모든 위치에 동일하게 적용되며 다음 접속시에도 유지됩니다.
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: c.sub, letterSpacing: '0.14em', marginBottom: 6 }}>PRESETS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 5, marginBottom: 14 }}>
            {COLOR_PRESETS.map((col) => {
              const active = currentColor === col;
              return (
                <button key={col} onClick={() => { onPick(col); onClose(); }} title={col} style={{
                  aspectRatio: '1 / 1', border: active ? `2px solid ${c.ink}` : `1px solid ${c.hair}`,
                  background: col, borderRadius: 6, padding: 0, cursor: 'pointer',
                  boxShadow: active ? `0 0 0 2px ${c.bg}, 0 0 0 3px ${c.ink}` : 'none',
                }} />
              );
            })}
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: c.sub, letterSpacing: '0.14em', marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
            <span>CUSTOM HUE</span>
            <span>{sliderHue}°</span>
          </div>
          <div style={{
            height: 12, borderRadius: 999,
            background: 'linear-gradient(to right, hsl(0,72%,55%), hsl(60,72%,55%), hsl(120,72%,55%), hsl(180,72%,55%), hsl(240,72%,55%), hsl(300,72%,55%), hsl(360,72%,55%))',
            marginBottom: 6, position: 'relative',
          }}>
            <input
              type="range" min={0} max={360} step={1}
              value={sliderHue}
              onChange={(e) => setSliderHue(parseInt(e.target.value, 10))}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                opacity: 0, cursor: 'pointer', margin: 0,
              }}
            />
            <div style={{
              position: 'absolute', top: -3, left: `calc(${(sliderHue/360)*100}% - 9px)`,
              width: 18, height: 18, borderRadius: 999,
              background: customColor, border: '2px solid white',
              boxShadow: '0 1px 4px rgba(0,0,0,0.3)', pointerEvents: 'none',
            }} />
          </div>
          <button onClick={() => { onPick(customColor); onClose(); }} style={{
            width: '100%', marginTop: 10, marginBottom: 14,
            background: customColor, color: '#fff',
            border: 'none', padding: '8px 10px',
            fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
            cursor: 'pointer', borderRadius: 4,
          }}>이 색상으로 적용</button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {(() => { const cs = tagColors(currentColor, mode); return (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 11px',
                  background: cs.bg, color: cs.ink,
                  border: `1.5px solid ${cs.border}`, borderRadius: 4,
                  fontSize: 11, fontWeight: 700,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: cs.dot }} />
                  {tag.label}
                </span>
              ); })()}
            </div>
            <button onClick={onClose} style={{
              background: 'transparent', border: `1px solid ${c.hair}`,
              color: c.ink, padding: '4px 12px', borderRadius: 4,
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', cursor: 'pointer',
            }}>닫기</button>
          </div>
        </div>
      </div>
    );
  }

  function Header({ c }) {
    return (
      <div style={{ padding: '14px 28px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 900, fontSize: 12, letterSpacing: '0.22em' }}>S V Z A K</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--font-mono)', fontSize: 9, color: c.sub, letterSpacing: '0.1em' }}>
          <span>OPACITY ●</span>
          <span style={{ width: 14, height: 14, borderRadius: 999, border: `1px solid ${c.hair}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>−</span>
          <span style={{ width: 14, height: 14, borderRadius: 999, border: `1px solid ${c.hair}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>×</span>
        </div>
      </div>
    );
  }

  function Tabs({ c, tab, setTab }) {
    return (
      <div style={{ padding: '4px 28px 0', display: 'flex', gap: 22, borderBottom: `1px solid ${c.hair}` }}>
        {window.TABS.map((t) => {
          const active = t === tab;
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              background: 'transparent', border: 'none', padding: '10px 0',
              fontFamily: 'var(--font-sans)',
              fontWeight: active ? 900 : 500,
              fontSize: 12,
              color: active ? c.ink : c.sub,
              cursor: 'pointer',
              borderBottom: active ? `1.5px solid ${c.ink}` : '1.5px solid transparent',
              marginBottom: -1,
              letterSpacing: '0.02em',
              transition: 'color 0.15s',
            }}>{t}</button>
          );
        })}
      </div>
    );
  }

  // ───────── 루틴 — responsive ─────────
  function Routine({ c, mode, wide, tagFor, onPick, onJump }) {
    if (!wide) {
      return (
        <div style={{ paddingTop: 22 }}>
          <Hero c={c} />
          <SectionLabel c={c}>오늘의 컨디션</SectionLabel>
          <ConditionRow c={c} />
          <SectionLabel c={c} hint="클릭해서 색상 변경">항목 풀</SectionLabel>
          <Pool c={c} tagFor={tagFor} onPick={onPick} />
          <SectionLabel c={c}>주간 루틴</SectionLabel>
          <Weekly c={c} tagFor={tagFor} onPick={onPick} />
          <SectionLabel c={c}>플래닝</SectionLabel>
          <PlanList c={c} />
          <SectionLabel c={c} hint="날짜 클릭">이번 달</SectionLabel>
          <MiniCal c={c} mode={mode} onJump={onJump} />
        </div>
      );
    }
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', columnGap: 36, paddingTop: 22 }}>
        <div>
          <Hero c={c} />
          <SectionLabel c={c}>오늘의 컨디션</SectionLabel>
          <ConditionRow c={c} />
          <SectionLabel c={c} hint="클릭해서 색상 변경">항목 풀</SectionLabel>
          <Pool c={c} tagFor={tagFor} onPick={onPick} />
          <SectionLabel c={c} hint="날짜 클릭">이번 달</SectionLabel>
          <MiniCal c={c} mode={mode} onJump={onJump} />
        </div>
        <div>
          <SectionLabel c={c}>주간 루틴</SectionLabel>
          <Weekly c={c} tagFor={tagFor} onPick={onPick} />
          <SectionLabel c={c}>플래닝</SectionLabel>
          <PlanList c={c} />
        </div>
      </div>
    );
  }

  function Hero({ c }) {
    const t = D.today;
    return (
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: c.sub, letterSpacing: '0.16em', marginBottom: 6 }}>
          MON · 2026.04.27 · WK 18
        </div>
        <div style={{ fontWeight: 900, fontSize: 28, lineHeight: 1.1, letterSpacing: '-0.025em' }}>
          오늘 <span style={{ color: c.hi }}>{t.progressPct}%</span>,
        </div>
        <div style={{ fontWeight: 900, fontSize: 28, lineHeight: 1.1, letterSpacing: '-0.025em', marginTop: 2 }}>
          연속 {t.streak}일.
        </div>
      </div>
    );
  }

  function SectionLabel({ c, children, hint }) {
    return (
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em',
        color: c.sub, marginTop: 24, marginBottom: 10,
        textTransform: 'uppercase',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        gap: 8,
      }}>
        <span>{children}</span>
        {hint ? <span style={{ fontSize: 8, opacity: 0.7, letterSpacing: '0.1em' }}>{hint}</span> : null}
      </div>
    );
  }

  function ConditionRow({ c }) {
    const t = D.today;
    const Bar = ({ label, val, max = 100 }) => (
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10, marginBottom: 4 }}>
          <span style={{ color: c.sub }}>{label}</span>
          <span style={{ fontWeight: 700 }}>{val}{typeof max === 'number' ? `/${max}` : ''}</span>
        </div>
        <div style={{ height: 1, background: c.faint, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, width: `${(val / max) * 100}%`, height: 1, background: c.ink }} />
          <div style={{ position: 'absolute', left: `${(val / max) * 100}%`, top: -2, width: 5, height: 5, borderRadius: 999, background: c.hi, transform: 'translateX(-50%)' }} />
        </div>
      </div>
    );
    return (
      <div>
        <Bar label="진행률" val={t.progressPct} />
        <Bar label="컨디션" val={t.condition} />
        <Bar label="포커스 블록" val={t.focusBlocks.done} max={t.focusBlocks.total} />
      </div>
    );
  }

  function Pool({ c, tagFor, onPick }) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {D.routinePool.map((it) => {
          const t = tagFor(it.id);
          return (
            <button
              key={it.id}
              onClick={() => onPick(it.id)}
              title="클릭해서 색상 변경"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 11px',
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                fontSize: 11,
                color: t.ink,
                background: t.bg,
                border: `1.5px solid ${t.border}`,
                borderRadius: 4,
                cursor: 'pointer',
                lineHeight: 1.2,
                transition: 'transform 0.1s',
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ width: 6, height: 6, borderRadius: 999, background: t.dot }} />
              {it.label}
            </button>
          );
        })}
      </div>
    );
  }

  function Weekly({ c, tagFor, onPick }) {
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {days.map((d, i) => {
            const today = i === 0;
            return (
              <div key={d} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'stretch' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: today ? 900 : 500,
                  color: today ? c.hi : c.sub, textAlign: 'center',
                  padding: '4px 0',
                  borderBottom: today ? `1px solid ${c.hi}` : `1px solid ${c.hair}`,
                  marginBottom: 2,
                }}>{d}</div>
                {(D.weekly[d] || []).map((id) => {
                  const t = tagFor(id);
                  if (!t.item) return null;
                  return (
                    <button key={id} onClick={() => onPick(id)} title="클릭해서 색상 변경" style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      fontFamily: 'var(--font-sans)',
                      fontSize: 10, fontWeight: 700,
                      padding: '5px 7px',
                      color: t.ink,
                      background: t.bg,
                      border: `1.5px solid ${t.border}`,
                      borderRadius: 3,
                      lineHeight: 1.15,
                      whiteSpace: 'normal',
                      wordBreak: 'keep-all',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: 999, background: t.dot, flex: 'none' }} />
                      <span>{t.item.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function PlanList({ c }) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10, color: c.sub, marginBottom: 10 }}>
          <span>{D.planning.range}</span>
          <span style={{ color: c.hi, fontWeight: 700 }}>● 현재</span>
        </div>
        {D.planning.items.map((it, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '54px 1fr 18px',
            padding: '10px 0',
            borderBottom: `1px solid ${c.hair}`,
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: 11,
              color: it.time === '--:--' ? c.sub : c.hi,
            }}>{it.time}</div>
            <div style={{ fontSize: 12.5, fontWeight: 500 }}>{it.text}</div>
            <div style={{ width: 14, height: 14, borderRadius: 999, border: `1px solid ${c.hair}` }} />
          </div>
        ))}
      </div>
    );
  }

  // ───────── 미니 캘린더 (4+1: 활동량 dot + 인라인 펼침 + 플래닝 점프) ─────────
  function MiniCal({ c, mode, onJump }) {
    const year = 2026, month = 4;
    const cells = window.getCalendarMatrix(year, month);
    const today = 27;
    const [openDay, setOpenDay] = useState(null);
    const dateStr = (d) => `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const daily = D.daily || {};

    const dotIntensity = (d) => {
      const ent = daily[dateStr(d)];
      if (!ent) return 0;
      // 0..5 done → 0..1 intensity
      return Math.min(1, ent.done / 5);
    };

    const openEntry = openDay != null ? daily[dateStr(openDay)] : null;

    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 9, color: c.sub, marginBottom: 4 }}>
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={i} style={{ aspectRatio: '1 / 1' }} />;
            const isToday = d === today;
            const isOpen = d === openDay;
            const intensity = dotIntensity(d);
            const hasActivity = intensity > 0;
            // background tint for activity (light/dark aware)
            const tintAlpha = intensity * (mode === 'dark' ? 0.18 : 0.10);
            const tint = mode === 'dark'
              ? `rgba(237,237,235,${tintAlpha})`
              : `rgba(17,17,16,${tintAlpha})`;
            return (
              <button
                key={i}
                onClick={() => setOpenDay(isOpen ? null : d)}
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isToday ? c.hi : (isOpen ? c.faint : (hasActivity ? tint : 'transparent')),
                  color: isToday ? c.hiInk : c.ink,
                  fontWeight: isToday ? 900 : (hasActivity ? 700 : 400),
                  borderRadius: 4,
                  border: isOpen && !isToday ? `1px solid ${c.ink}` : '1px solid transparent',
                  padding: 0, cursor: 'pointer',
                }}
              >
                <span>{d}</span>
                {hasActivity && !isToday && (
                  <span style={{
                    position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', gap: 2,
                  }}>
                    {Array.from({ length: Math.min(3, Math.ceil(intensity * 3)) }).map((_, k) => (
                      <span key={k} style={{
                        width: 3, height: 3, borderRadius: 999,
                        background: c.ink, opacity: 0.45 + intensity * 0.35,
                      }} />
                    ))}
                  </span>
                )}
                {isToday && (
                  <span style={{
                    position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)',
                    width: 3, height: 3, borderRadius: 999, background: c.hiInk, opacity: 0.8,
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* 인라인 펼침 패널 */}
        {openDay != null && (
          <div style={{
            marginTop: 10,
            padding: '12px 12px 10px',
            background: c.panel,
            border: `1px solid ${c.hair}`,
            borderRadius: 6,
            animation: 'svzakFade 0.18s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', color: c.sub }}>
                  {year}.{String(month).padStart(2,'0')}.{String(openDay).padStart(2,'0')}
                </div>
                <div style={{ fontWeight: 900, fontSize: 16, marginTop: 2, letterSpacing: '-0.015em' }}>
                  {openEntry ? `${openEntry.done}건 완료 · 컨디션 ${openEntry.condition}` : '기록 없음'}
                </div>
              </div>
              <button onClick={() => setOpenDay(null)} style={{
                background: 'transparent', border: 'none', color: c.sub,
                fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer', padding: 4,
              }}>×</button>
            </div>
            {openEntry ? (
              <div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 10, fontFamily: 'var(--font-mono)', fontSize: 10, color: c.sub }}>
                  <span>완료 {openEntry.done}</span>
                  <span>·</span>
                  <span>포커스 {openEntry.focus}</span>
                  <span>·</span>
                  <span>컨디션 {openEntry.condition}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {openEntry.items.map((it, k) => (
                    <div key={k} style={{ fontSize: 12, color: c.ink, padding: '4px 0', borderBottom: k < openEntry.items.length - 1 ? `1px solid ${c.hair}` : 'none', display: 'flex', gap: 8 }}>
                      <span style={{ color: c.done, fontFamily: 'var(--font-mono)', fontSize: 10, paddingTop: 2 }}>✓</span>
                      <span style={{ flex: 1, lineHeight: 1.4, textDecoration: 'line-through', color: c.done }}>{it}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => onJump(dateStr(openDay))}
                  style={{
                    marginTop: 10, width: '100%',
                    background: c.ink, color: c.bg,
                    border: 'none', padding: '8px 10px',
                    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
                    fontWeight: 700, cursor: 'pointer', borderRadius: 4,
                  }}
                >플래닝 탭에서 보기 →</button>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: c.sub, padding: '6px 0 2px' }}>
                이 날짜에는 기록된 활동이 없어요.
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ───────── 원씽 — responsive ─────────
  function OneThing({ c, wide }) {
    const ot = D.oneThing;
    const main = (
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: c.sub, marginBottom: 6 }}>
          ● {ot.status} · {ot.period}
        </div>
        <div style={{ fontWeight: 900, fontSize: 24, lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: 22 }}>
          {ot.title}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10, marginBottom: 6 }}>
          <span style={{ color: c.sub }}>핵심 태스크</span>
          <span style={{ fontWeight: 700 }}>{ot.progress.done}/{ot.progress.total} · {ot.progress.pct}%</span>
        </div>
        <div style={{ height: 1, background: c.faint, marginBottom: 16, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, width: `${ot.progress.pct}%`, height: 1, background: c.hi }} />
        </div>
        {ot.tasks.map((t) => (
          <div key={t.id} style={{ padding: '10px 0', borderBottom: `1px solid ${c.hair}`, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 500, fontSize: 13, color: t.done ? c.done : c.ink, textDecoration: t.done ? 'line-through' : 'none' }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, border: `1px solid ${t.done ? c.done : c.ink}`, background: t.done ? c.done : 'transparent' }} />
            {t.text}
          </div>
        ))}
        <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: 10, color: c.sub, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, border: `1px dashed ${c.hair}` }} />
          + 태스크 추가
        </div>
      </div>
    );
    const side = (
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', color: c.sub, marginBottom: 10, textTransform: 'uppercase' }}>완료</div>
        {ot.completed.map((it, i) => (
          <div key={i} style={{ padding: '12px 0', borderBottom: `1px solid ${c.hair}`, color: c.done }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: c.sub, marginBottom: 4 }}>{it.period}</div>
            <div style={{ fontSize: 12, lineHeight: 1.5, textDecoration: 'line-through' }}>{it.text}</div>
          </div>
        ))}
        <div style={{ padding: '14px 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: c.sub, border: `1px dashed ${c.hair}`, borderRadius: 6, marginTop: 10 }}>
          + 새 원씽 (Notion 연동 후 활성화)
        </div>
      </div>
    );
    if (!wide) return <div style={{ paddingTop: 22 }}>{main}<div style={{ marginTop: 26 }}>{side}</div></div>;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', columnGap: 36, paddingTop: 22 }}>
        {main}
        {side}
      </div>
    );
  }

  function Projects({ c, wide }) {
    const cols = wide ? 2 : 1;
    return (
      <div style={{ paddingTop: 22, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, columnGap: 36 }}>
        {D.projects.map((p, i) => (
          <div key={i} style={{
            padding: '14px 0',
            borderBottom: `1px solid ${c.hair}`,
            display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: 12, alignItems: 'center',
          }}>
            <div style={{ width: 6, height: 6, background: p.dot, borderRadius: 999 }} />
            <div>
              <div style={{ fontWeight: 900, fontSize: 14, letterSpacing: '-0.015em' }}>{p.name}</div>
              <div style={{ fontSize: 11.5, color: c.sub, marginTop: 2 }}>{p.meta}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: c.sub, letterSpacing: '0.1em' }}>{p.status.toUpperCase()}</div>
          </div>
        ))}
      </div>
    );
  }

  function Planning({ c, wide, jumpDate, onJumpDone }) {
    const cols = wide ? 2 : 1;
    const refs = useRef({});
    const [highlight, setHighlight] = useState(null);

    // 캘린더에서 점프해 온 날짜로 스크롤 + 하이라이트
    useEffect(() => {
      if (!jumpDate) return;
      const d = jumpDate.replace(/-/g, '.');
      // 가장 가까운 결정 로그 찾기 (해당 날짜 ≤ d)
      const target = D.decisions.find(x => x.date <= d) || D.decisions[0];
      const key = target.date;
      const node = refs.current[key];
      if (node && node.scrollIntoView) {
        node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setHighlight(key);
      const t1 = setTimeout(() => setHighlight(null), 2200);
      const t2 = setTimeout(() => onJumpDone && onJumpDone(), 200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [jumpDate]);

    const matchKey = jumpDate ? jumpDate.replace(/-/g, '.') : null;

    return (
      <div style={{ paddingTop: 22 }}>
        {jumpDate && (
          <div style={{
            marginBottom: 14, padding: '8px 12px',
            background: c.faint, color: c.ink,
            border: `1px solid ${c.hair}`, borderRadius: 4,
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>● {matchKey} 근처 결정 로그</span>
            <span style={{ color: c.sub }}>캘린더에서 점프</span>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, columnGap: 36 }}>
          {D.decisions.map((d, i) => {
            const isHi = highlight === d.date;
            return (
              <div
                key={i}
                ref={(el) => { refs.current[d.date] = el; }}
                style={{
                  marginBottom: 16, breakInside: 'avoid',
                  padding: '12px 14px',
                  background: isHi ? c.faint : 'transparent',
                  border: isHi ? `1px solid ${c.hi}` : `1px solid transparent`,
                  borderLeft: isHi ? `3px solid ${c.hi}` : `1px solid transparent`,
                  borderRadius: 4,
                  transition: 'background 0.4s, border-color 0.4s',
                  marginLeft: -14, marginRight: -14,
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: c.sub, marginBottom: 4 }}>{d.date}</div>
                <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 8, letterSpacing: '-0.015em' }}>{d.title}</div>
                {d.bullets.map((b, j) => (
                  <div key={j} style={{ fontSize: 12, color: c.sub, padding: '3px 0 3px 14px', position: 'relative', lineHeight: 1.55 }}>
                    <span style={{ position: 'absolute', left: 0 }}>—</span>{b}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function Footer({ c }) {
    return (
      <div style={{
        padding: '8px 28px',
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'var(--font-mono)', fontSize: 9, color: c.sub, letterSpacing: '0.06em',
        borderTop: `1px solid ${c.hair}`,
      }}>
        <span>2026.04.27 월</span>
        <span>● Notion 동기화</span>
      </div>
    );
  }

  return { App };
})();

window.VarB = VarB;
