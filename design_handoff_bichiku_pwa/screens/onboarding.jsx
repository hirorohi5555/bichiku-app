// Onboarding / Add to Home Screen guide
function ScreenOnboarding() {
  return (
    <div style={{ height: '100%', overflow: 'auto', background: '#fff', paddingBottom: 32 }}>
      {/* skip pad for status bar */}
      <div style={{ height: 80 }}/>

      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Hero illustration — abstract grid of shelves */}
        <div style={{
          height: 200, position: 'relative',
          background: 'linear-gradient(180deg, oklch(0.55 0.10 240 / 0.05) 0%, transparent 100%)',
          borderRadius: 20, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="220" height="160" viewBox="0 0 220 160">
            {/* Shelf */}
            {[0, 1, 2].map(row => (
              <g key={row} transform={`translate(0, ${row * 50})`}>
                <line x1="10" y1="48" x2="210" y2="48" stroke={C.line} strokeWidth="1"/>
                {[0, 1, 2, 3, 4].map(col => {
                  const colors = [C.accent, '#D89C5A', '#5BA3C7', '#9C8FB8', '#C77B8E'];
                  const heights = [30, 24, 36, 28, 32];
                  const widths = [22, 26, 20, 28, 24];
                  const i = (row + col) % 5;
                  return (
                    <rect
                      key={col}
                      x={20 + col * 38}
                      y={48 - heights[i]}
                      width={widths[i]}
                      height={heights[i]}
                      rx="3"
                      fill={colors[i]}
                      opacity={0.85}
                    />
                  );
                })}
              </g>
            ))}
            {/* Plus highlight */}
            <circle cx="180" cy="40" r="14" fill={C.accent}/>
            <path d="M180 33v14M173 40h14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, letterSpacing: '-0.02em', lineHeight: 1.3 }}>家族の備蓄を、<br/>すぐに把握。</div>
          <div style={{ fontSize: 13, color: C.ink2, lineHeight: 1.7, maxWidth: 280, margin: '0 auto' }}>
            賞味期限の自動チェック・通知・カレンダー連携。<br/>緊急時もオフラインで動きます。
          </div>
        </div>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { icon: 'sparkle', title: '色で一目', desc: '緑・黄・赤のステータスバッジ' },
            { icon: 'bell',    title: '自動で通知', desc: '30日前 / 7日前 / 当日にお知らせ' },
            { icon: 'cal',     title: 'カレンダー連携', desc: '標準カレンダーアプリへ書き出し' },
            { icon: 'home',    title: 'ホーム画面に追加', desc: 'Safari共有メニューから追加' },
          ].map(f => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: C.accentSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon name={f.icon} size={18} color={C.accent}/>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{f.title}</div>
                <div style={{ fontSize: 12, color: C.ink2, marginTop: 2, lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <div style={{
            background: C.accent, color: '#fff',
            padding: '14px', borderRadius: 14,
            fontSize: 15, fontWeight: 600, textAlign: 'center',
            boxShadow: '0 4px 12px oklch(0.55 0.10 240 / 0.3)',
          }}>はじめる</div>
          <div style={{ fontSize: 12, color: C.ink3, textAlign: 'center', fontWeight: 500 }}>JSONから復元</div>
        </div>
      </div>
    </div>
  );
}
window.ScreenOnboarding = ScreenOnboarding;
