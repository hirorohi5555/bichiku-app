// Shared UI atoms for all 備蓄管理 screens.
// All component names are unique; styles objects are component-scoped (uiStyles).

const C = {
  ink: '#1A1D24',
  ink2: '#4A5060',
  ink3: '#8A8F9C',
  ink4: '#B8BCC4',
  line: '#E6E8EC',
  line2: '#F0F2F5',
  bg: '#F5F6F8',
  paper: '#FFFFFF',
  accent: 'oklch(0.55 0.10 240)',
  accentSoft: 'oklch(0.96 0.018 240)',
  ok: 'oklch(0.55 0.09 155)',
  okSoft: 'oklch(0.96 0.04 155)',
  warn: 'oklch(0.65 0.13 75)',
  warnSoft: 'oklch(0.96 0.06 80)',
  danger: 'oklch(0.55 0.16 25)',
  dangerSoft: 'oklch(0.96 0.045 25)',
};

const STATUS_META = {
  expired: { label: '期限切れ', color: C.danger, soft: C.dangerSoft, dot: C.danger },
  urgent:  { label: '期限間近', color: C.warn, soft: C.warnSoft, dot: C.warn },
  warn:    { label: '要確認',   color: C.warn, soft: C.warnSoft, dot: C.warn },
  ok:      { label: '余裕あり', color: C.ok, soft: C.okSoft, dot: C.ok },
  none:    { label: '期限なし', color: C.ink3, soft: '#F5F6F8', dot: C.ink3 },
};

const CAT_META = {
  '食品':   { color: '#D89C5A', glyph: 'food' },
  '飲料':   { color: '#5BA3C7', glyph: 'drink' },
  '日用品': { color: '#9C8FB8', glyph: 'home' },
  '医薬品': { color: '#C77B8E', glyph: 'med' },
};

// — small SVG icon set —
function Icon({ name, size = 18, color = 'currentColor', stroke = 1.6 }) {
  const p = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home:    <><path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2v-9z" {...p}/></>,
    list:    <><path d="M8 6h13M8 12h13M8 18h13" {...p}/><circle cx="4" cy="6" r="1" fill={color}/><circle cx="4" cy="12" r="1" fill={color}/><circle cx="4" cy="18" r="1" fill={color}/></>,
    plus:    <><path d="M12 5v14M5 12h14" {...p}/></>,
    bell:    <><path d="M6 8a6 6 0 0112 0c0 7 3 7 3 9H3c0-2 3-2 3-9z" {...p}/><path d="M10 21a2 2 0 004 0" {...p}/></>,
    cog:     <><circle cx="12" cy="12" r="3" {...p}/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" {...p}/></>,
    cal:     <><rect x="3" y="5" width="18" height="16" rx="2" {...p}/><path d="M3 10h18M8 3v4M16 3v4" {...p}/></>,
    chev:    <><path d="M9 6l6 6-6 6" {...p}/></>,
    chevDown:<><path d="M6 9l6 6 6-6" {...p}/></>,
    back:    <><path d="M15 6l-6 6 6 6" {...p}/></>,
    search:  <><circle cx="11" cy="11" r="7" {...p}/><path d="M20 20l-3.5-3.5" {...p}/></>,
    filter:  <><path d="M4 5h16l-6 8v6l-4-2v-4L4 5z" {...p}/></>,
    minus:   <><path d="M5 12h14" {...p}/></>,
    check:   <><path d="M5 12l5 5L20 7" {...p}/></>,
    x:       <><path d="M6 6l12 12M18 6L6 18" {...p}/></>,
    food:    <><path d="M12 3c-3 0-5 2-5 5v3h10V8c0-3-2-5-5-5z" {...p}/><path d="M5 11h14l-1 9a2 2 0 01-2 2H8a2 2 0 01-2-2l-1-9z" {...p}/></>,
    drink:   <><path d="M7 4h10l-1 16a2 2 0 01-2 2H10a2 2 0 01-2-2L7 4z" {...p}/><path d="M7.5 9h9" {...p}/></>,
    med:     <><rect x="3" y="9" width="18" height="6" rx="3" {...p}/><path d="M12 9v6" {...p}/></>,
    upload:  <><path d="M12 16V4M6 10l6-6 6 6" {...p}/><path d="M4 20h16" {...p}/></>,
    download:<><path d="M12 4v12M6 14l6 6 6-6" {...p}/><path d="M4 22h16" {...p}/></>,
    barcode: <><path d="M4 6v12M7 6v12M10 6v12M13 6v12M16 6v12M19 6v12" {...p}/></>,
    qr:      <><rect x="3" y="3" width="7" height="7" rx="1" {...p}/><rect x="14" y="3" width="7" height="7" rx="1" {...p}/><rect x="3" y="14" width="7" height="7" rx="1" {...p}/><path d="M14 14h3v3M21 14v3M14 18v3h3M18 21h3" {...p}/></>,
    mic:     <><rect x="9" y="3" width="6" height="12" rx="3" {...p}/><path d="M5 11a7 7 0 0014 0M12 18v3" {...p}/></>,
    camera:  <><path d="M3 8a2 2 0 012-2h2l2-2h6l2 2h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" {...p}/><circle cx="12" cy="13" r="4" {...p}/></>,
    clock:   <><circle cx="12" cy="12" r="9" {...p}/><path d="M12 7v5l3 2" {...p}/></>,
    edit:    <><path d="M4 20h4l11-11-4-4L4 16v4z" {...p}/></>,
    trash:   <><path d="M5 7h14M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M7 7l1 13a2 2 0 002 2h4a2 2 0 002-2l1-13" {...p}/></>,
    share:   <><circle cx="6" cy="12" r="2" {...p}/><circle cx="18" cy="6" r="2" {...p}/><circle cx="18" cy="18" r="2" {...p}/><path d="M8 11l8-4M8 13l8 4" {...p}/></>,
    sparkle: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" {...p}/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>{paths[name]}</svg>;
}

// — Status badge —
function StatusBadge({ status, size = 'sm' }) {
  const m = STATUS_META[status];
  const big = size === 'lg';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: big ? '4px 10px' : '2px 8px',
      borderRadius: 999,
      background: m.soft, color: m.color,
      fontSize: big ? 12 : 11, fontWeight: 600, letterSpacing: '0.02em',
      lineHeight: 1.4, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.dot }} />
      {m.label}
    </span>
  );
}

// — Days remaining pill —
function DaysPill({ days, status }) {
  if (days === null) return <span style={{ color: C.ink3, fontSize: 11 }}>期限なし</span>;
  const m = STATUS_META[status];
  const txt = days < 0 ? `${Math.abs(days)}日経過` : days === 0 ? '今日まで' : `あと${days}日`;
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      fontSize: 11, fontWeight: 600,
      color: m.color, letterSpacing: 0,
    }}>{txt}</span>
  );
}

// — Category chip with abstract glyph —
function CatChip({ cat, size = 28 }) {
  const meta = CAT_META[cat] || { color: C.ink3, glyph: 'home' };
  return (
    <span style={{
      width: size, height: size, borderRadius: 8,
      background: meta.color + '22',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon name={meta.glyph} size={size * 0.55} color={meta.color} stroke={1.8} />
    </span>
  );
}

// — Bottom tab bar —
function TabBar({ active = 'home' }) {
  const tabs = [
    { id: 'home',  label: 'ホーム',     icon: 'home' },
    { id: 'list',  label: '在庫',       icon: 'list' },
    { id: 'add',   label: '追加',       icon: 'plus' },
    { id: 'cal',   label: 'カレンダー', icon: 'cal' },
    { id: 'set',   label: '設定',       icon: 'cog' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
      paddingBottom: 28, paddingTop: 8,
      background: 'linear-gradient(to top, rgba(255,255,255,0.96) 70%, rgba(255,255,255,0))',
      borderTop: '0.5px solid ' + C.line,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0 6px' }}>
        {tabs.map(t => {
          const on = t.id === active;
          if (t.id === 'add') {
            return (
              <div key={t.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, width: 64 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 22,
                  background: C.accent, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px oklch(0.55 0.10 240 / 0.35)',
                  marginTop: -2,
                }}>
                  <Icon name="plus" size={22} color="#fff" stroke={2.4}/>
                </div>
                <div style={{ fontSize: 10, color: C.ink3, marginTop: 3, fontWeight: 500 }}>追加</div>
              </div>
            );
          }
          return (
            <div key={t.id} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: 64,
              padding: '4px 0',
            }}>
              <Icon name={t.icon} size={22} color={on ? C.accent : C.ink3} stroke={on ? 2 : 1.6}/>
              <div style={{
                fontSize: 10, color: on ? C.accent : C.ink3,
                fontWeight: on ? 600 : 500,
              }}>{t.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// — Top bar (in-screen, inside frame, below status bar) —
function TopBar({ title, left, right, sub, large = false }) {
  return (
    <div style={{
      padding: large ? '60px 20px 4px' : '64px 20px 10px',
      display: 'flex', flexDirection: 'column', gap: 4,
      background: '#fff', borderBottom: large ? 'none' : '0.5px solid ' + C.line,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {left}
          {!large && <div style={{ fontSize: 17, fontWeight: 600, color: C.ink, letterSpacing: '-0.01em' }}>{title}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{right}</div>
      </div>
      {large && (
        <>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.ink, letterSpacing: '-0.02em', marginTop: 4 }}>{title}</div>
          {sub && <div style={{ fontSize: 13, color: C.ink2, marginTop: 2 }}>{sub}</div>}
        </>
      )}
    </div>
  );
}

// — Card —
function Card({ children, padding = 16, style = {} }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14,
      border: '0.5px solid ' + C.line,
      padding,
      ...style,
    }}>{children}</div>
  );
}

// — Stat tile —
function StatTile({ value, label, color = C.ink, accent }) {
  return (
    <div style={{
      flex: 1, padding: '14px 12px', borderRadius: 12,
      background: accent || '#fff',
      border: '0.5px solid ' + C.line,
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 26, fontWeight: 600, color, letterSpacing: '-0.02em', lineHeight: 1,
      }}>{value}</div>
      <div style={{ fontSize: 11, color: C.ink2, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

// — Frame wrapper that adds the iPhone shell + label —
function Frame({ label, num, children, dark = false, time = '9:41' }) {
  return (
    <div className="frame-cell">
      <div className="frame-label">
        <span className="frame-num">{num}</span>
        <span>{label}</span>
      </div>
      <div className="frame-shrink">
        <IOSDevice width={390} height={844} dark={dark}>
          {children}
        </IOSDevice>
      </div>
    </div>
  );
}

// — Section divider in canvas —
function CanvasSection({ label, children }) {
  return (
    <>
      <div className="section-divider">{label}</div>
      {children}
    </>
  );
}

// expose
Object.assign(window, {
  C, STATUS_META, CAT_META, Icon, StatusBadge, DaysPill, CatChip,
  TabBar, TopBar, Card, StatTile, Frame, CanvasSection,
});
