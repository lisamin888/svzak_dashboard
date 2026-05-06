// Variation B — Zen Mono
// 여백, 호흡감, 헤어라인. 굵은 표제는 Satoshi Black + 큰 사이즈.
// 그리드 없음, 큼직한 빈 공간으로 위계 표현.

const VarB = (() => {
  const { useState } = React;
  const D = window.SVZAK_DATA;

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
    const wide = width >= 620;
    const setT = (v) => { setTab(v); if (onTabChange) onTabChange(v); };
    return (
      <div style={{
        width: '100%', height: '100%',
        background: c.bg, color: c.ink,
        fontFamily: 'var(--font-sans)',
        display: 'flex', flexDirection: 'column',
        letterSpacing: '-0.012em',
        overflow: 'hidden',
      }}>
        <Header c={c} />
        <Tabs c={c} tab={tab} setTab={setT} />
        <div style={{ flex: 1, overflow: 'auto', padding: '0 28px 24px', minHeight: 0 }}>
          {tab === '원씽' && <OneThing c={c} wide={wide} />}
          {tab === '루틴' && <Routine c={c} wide={wide} />}
          {tab === '프로젝트' && <Projects c={c} wide={wide} />}
          {tab === '플래닝' && <Planning c={c} wide={wide} />}
        </div>
        <Footer c={c} />
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
  function Routine({ c, wide }) {
    if (!wide) {
      return (
        <div style={{ paddingTop: 22 }}>
          <Hero c={c} />
          <SectionLabel c={c}>오늘의 컨디션</SectionLabel>
          <ConditionRow c={c} />
          <SectionLabel c={c}>항목 풀</SectionLabel>
          <Pool c={c} />
          <SectionLabel c={c}>주간 루틴</SectionLabel>
          <Weekly c={c} />
          <SectionLabel c={c}>플래닝</SectionLabel>
          <PlanList c={c} />
          <SectionLabel c={c}>이번 달</SectionLabel>
          <MiniCal c={c} />
        </div>
      );
    }
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', columnGap: 36, paddingTop: 22 }}>
        <div>
          <Hero c={c} />
          <SectionLabel c={c}>오늘의 컨디션</SectionLabel>
          <ConditionRow c={c} />
          <SectionLabel c={c}>항목 풀</SectionLabel>
          <Pool c={c} />
          <SectionLabel c={c}>이번 달</SectionLabel>
          <MiniCal c={c} />
        </div>
        <div>
          <SectionLabel c={c}>주간 루틴</SectionLabel>
          <Weekly c={c} />
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

  function SectionLabel({ c, children }) {
    return (
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em',
        color: c.sub, marginTop: 24, marginBottom: 10,
        textTransform: 'uppercase',
      }}>{children}</div>
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

  function Pool({ c }) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 8px' }}>
        {D.routinePool.map((it) => (
          <span key={it.id} style={{
            padding: '4px 10px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 500,
            fontSize: 11,
            color: c.ink,
            border: `1px solid ${c.hair}`,
            borderRadius: 999,
          }}>{it.label}</span>
        ))}
      </div>
    );
  }

  function Weekly({ c }) {
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {days.map((d, i) => {
            const today = i === 0;
            return (
              <div key={d} style={{
                display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'stretch',
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: today ? 900 : 500,
                  color: today ? c.hi : c.sub, textAlign: 'center',
                  padding: '4px 0',
                  borderBottom: today ? `1px solid ${c.hi}` : `1px solid ${c.hair}`,
                  marginBottom: 2,
                }}>{d}</div>
                {(D.weekly[d] || []).map((id) => {
                  const item = D.routinePool.find(p => p.id === id);
                  return (
                    <div key={id} style={{
                      fontSize: 10,
                      fontWeight: 500,
                      padding: '4px 5px',
                      color: c.ink,
                      borderLeft: `2px solid ${c.ink}`,
                      lineHeight: 1.2,
                      whiteSpace: 'normal',
                      wordBreak: 'keep-all',
                    }}>{item?.label}</div>
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

  function MiniCal({ c }) {
    const cells = window.getCalendarMatrix(2026, 4);
    const today = 27;
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 9, color: c.sub, marginBottom: 4 }}>
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {cells.map((d, i) => (
            <div key={i} style={{
              aspectRatio: '1 / 1',
              fontFamily: 'var(--font-mono)', fontSize: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: d === today ? c.hi : 'transparent',
              color: d === today ? c.hiInk : (d ? c.ink : 'transparent'),
              fontWeight: d === today ? 900 : 500,
              borderRadius: d === today ? 4 : 0,
            }}>{d || '·'}</div>
          ))}
        </div>
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

  function Planning({ c, wide }) {
    const cols = wide ? 2 : 1;
    return (
      <div style={{ paddingTop: 22, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, columnGap: 36, rowGap: 0 }}>
        {D.decisions.map((d, i) => (
          <div key={i} style={{ marginBottom: 24, breakInside: 'avoid' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: c.sub, marginBottom: 4 }}>{d.date}</div>
            <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 8, letterSpacing: '-0.015em' }}>{d.title}</div>
            {d.bullets.map((b, j) => (
              <div key={j} style={{ fontSize: 12, color: c.sub, padding: '3px 0 3px 14px', position: 'relative', lineHeight: 1.55 }}>
                <span style={{ position: 'absolute', left: 0 }}>—</span>{b}
              </div>
            ))}
          </div>
        ))}
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
