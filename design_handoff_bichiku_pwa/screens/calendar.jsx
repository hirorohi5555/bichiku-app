// Calendar / Export screen
function ScreenCalendar() {
  const D = window.STOCKPILE_DATA;
  // Group by month
  const byMonth = {};
  D.items.filter(i => i.exp).forEach(i => {
    const k = i.exp.slice(0, 7);
    (byMonth[k] = byMonth[k] || []).push(i);
  });
  const months = Object.keys(byMonth).sort().slice(0, 4);

  return (
    <div style={{ height: '100%', overflow: 'auto', background: C.bg, paddingBottom: 96 }}>
      <TopBar
        large
        title="カレンダー"
        sub="賞味期限をiPhoneカレンダーへ"
      />

      <div style={{ padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Export hero */}
        <div style={{
          background: 'linear-gradient(180deg, oklch(0.55 0.10 240 / 0.06) 0%, oklch(0.55 0.10 240 / 0.02) 100%)',
          border: '0.5px solid oklch(0.55 0.10 240 / 0.18)',
          borderRadius: 16, padding: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <Icon name="cal" size={22} color={C.accent}/>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>iCalendar (.ics) で書き出し</div>
              <div style={{ fontSize: 12, color: C.ink2, marginTop: 2 }}>標準カレンダー / リマインダーで開けます</div>
            </div>
          </div>
          <div style={{
            background: C.accent, color: '#fff',
            padding: '12px 16px', borderRadius: 12,
            fontSize: 14, fontWeight: 600, textAlign: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 12px oklch(0.55 0.10 240 / 0.3)',
          }}>
            <Icon name="download" size={16} color="#fff" stroke={2.2}/>
            すべて書き出し（{D.items.filter(i => i.exp).length}件）
          </div>
        </div>

        {/* Per-item list grouped by month */}
        <div>
          <div style={{ marginBottom: 8, paddingLeft: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.ink3, letterSpacing: '0.1em' }}>品目ごとに書き出す</div>
            <div style={{ fontSize: 11, color: C.ink3, marginTop: 4, lineHeight: 1.5, fontWeight: 400 }}>
              下の「.ics」ボタンで、その品目1件だけをカレンダーに追加できます。
            </div>
          </div>
          {months.map(mo => (
            <div key={mo} style={{ marginBottom: 14 }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, color: C.ink3, fontWeight: 600,
                padding: '4px 4px 8px', letterSpacing: '0.05em',
              }}>{mo.replace('-', '年') + '月'}</div>
              <Card padding={0}>
                {byMonth[mo].sort((a, b) => a.exp.localeCompare(b.exp)).slice(0, 4).map((it, idx, arr) => (
                  <div key={it.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 14px',
                    borderBottom: idx < arr.length - 1 ? '0.5px solid ' + C.line2 : 'none',
                  }}>
                    <div style={{
                      width: 38, textAlign: 'center',
                      paddingRight: 10, borderRight: '0.5px solid ' + C.line,
                    }}>
                      <div style={{ fontSize: 9, color: C.ink3, fontWeight: 600, letterSpacing: '0.1em' }}>{['日','月','火','水','木','金','土'][new Date(it.exp).getDay()]}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 600, color: STATUS_META[it.status].color, lineHeight: 1, marginTop: 2 }}>{parseInt(it.exp.slice(8, 10))}</div>
                    </div>
                    <CatChip cat={it.cat} size={28}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
                      <div style={{ fontSize: 11, color: C.ink3, marginTop: 1 }}>{it.qty}{it.unit}</div>
                    </div>
                    <div style={{
                      padding: '6px 10px', borderRadius: 8,
                      background: C.accentSoft, color: C.accent,
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
                    }}>
                      <Icon name="download" size={12} color={C.accent} stroke={2.2}/>
                      .ics
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="cal"/>
    </div>
  );
}
window.ScreenCalendar = ScreenCalendar;
