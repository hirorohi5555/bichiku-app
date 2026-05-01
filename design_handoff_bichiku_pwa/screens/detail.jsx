// Item detail screen
function ScreenDetail() {
  const D = window.STOCKPILE_DATA;
  const it = D.items.find(x => x.id === 'i03'); // レトルトカレー (warn)
  const m = STATUS_META[it.status];
  const history = [
    { date: '2026-04-28', action: '使用', delta: -2, by: '夕食' },
    { date: '2026-03-15', action: '補充', delta: +4, by: '購入' },
    { date: '2026-02-02', action: '使用', delta: -1, by: '昼食' },
    { date: '2025-12-20', action: '登録', delta: +6, by: '初期登録' },
  ];

  return (
    <div style={{ height: '100%', overflow: 'auto', background: C.bg, paddingBottom: 32 }}>
      <TopBar
        title="詳細"
        left={<Icon name="back" size={22} color={C.accent} stroke={2}/>}
        right={<>
          <Icon name="edit" size={20} color={C.ink2}/>
          <Icon name="share" size={20} color={C.ink2}/>
        </>}
      />

      <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Hero */}
        <div style={{
          background: '#fff', borderRadius: 16,
          border: '0.5px solid ' + C.line,
          padding: 18, display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <CatChip cat={it.cat} size={56}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 19, fontWeight: 700, color: C.ink, letterSpacing: '-0.01em' }}>{it.name}</div>
              <div style={{ fontSize: 12, color: C.ink3, marginTop: 4 }}>{it.cat} · {it.note}</div>
            </div>
            <StatusBadge status={it.status} size="lg"/>
          </div>

          <div style={{
            display: 'flex', gap: 10, paddingTop: 14,
            borderTop: '0.5px solid ' + C.line2,
          }}>
            <StatTile value={it.qty} label={`数量（${it.unit}）`} accent="#fff"/>
            <StatTile value={it.days} label="残り日数" color={m.color}/>
            <StatTile value={it.exp.slice(5)} label="期限日" />
          </div>
        </div>

        {/* Quantity controls */}
        <Card padding={0}>
          <div style={{ padding: '14px 16px 10px', fontSize: 11, fontWeight: 600, color: C.ink3, letterSpacing: '0.1em' }}>使用 / 補充</div>
          <div style={{ padding: '4px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 22,
                background: C.dangerSoft, color: C.danger,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="minus" size={22} color={C.danger} stroke={2.4}/>
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 36, fontWeight: 600, color: C.ink, lineHeight: 1, minWidth: 48, textAlign: 'center', letterSpacing: '-0.02em',
              }}>{it.qty}</div>
              <div style={{
                width: 44, height: 44, borderRadius: 22,
                background: C.okSoft, color: C.ok,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="plus" size={22} color={C.ok} stroke={2.4}/>
              </div>
            </div>
            <div style={{ fontSize: 11, color: C.ink3 }}>{it.unit}</div>
          </div>
        </Card>

        {/* Calendar action */}
        <div style={{
          background: C.accentSoft, borderRadius: 12, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="cal" size={20} color={C.accent}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>カレンダーに追加</div>
            <div style={{ fontSize: 11, color: C.ink2, marginTop: 1 }}>5/29 にリマインダーを設定</div>
          </div>
          <Icon name="chev" size={16} color={C.accent}/>
        </div>

        {/* History */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.ink3, letterSpacing: '0.1em' }}>履歴</div>
            <div style={{ fontSize: 11, color: C.ink3 }}>{history.length}件</div>
          </div>
          <Card padding={0}>
            {history.map((h, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px',
                borderBottom: idx < history.length - 1 ? '0.5px solid ' + C.line2 : 'none',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 14,
                  background: h.delta > 0 ? C.okSoft : (h.action === '登録' ? C.accentSoft : C.dangerSoft),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon
                    name={h.delta > 0 ? 'plus' : 'minus'}
                    size={14}
                    color={h.delta > 0 ? C.ok : (h.action === '登録' ? C.accent : C.danger)}
                    stroke={2.4}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>{h.action}<span style={{ color: C.ink3, fontWeight: 400, marginLeft: 6 }}>{h.by}</span></div>
                  <div style={{ fontSize: 11, color: C.ink3, marginTop: 1, fontFamily: "'JetBrains Mono', monospace" }}>{h.date}</div>
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14, fontWeight: 600,
                  color: h.delta > 0 ? C.ok : C.danger,
                }}>{h.delta > 0 ? '+' : ''}{h.delta}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
window.ScreenDetail = ScreenDetail;
