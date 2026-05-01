// Home / Dashboard screen
function ScreenHome() {
  const D = window.STOCKPILE_DATA;
  const expiringSoon = D.items
    .filter(i => i.status === 'expired' || i.status === 'urgent' || i.status === 'warn')
    .sort((a, b) => (a.days ?? 9999) - (b.days ?? 9999));

  return (
    <div style={{ height: '100%', overflow: 'auto', background: C.bg, paddingBottom: 96 }}>
      <TopBar
        large
        title="備蓄管理"
        sub="2026年5月1日（金）"
        right={<div style={{ width: 36, height: 36, borderRadius: 18, background: '#fff', border: '0.5px solid ' + C.line, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Icon name="bell" size={18} color={C.ink2}/>
          <span style={{ position: 'absolute', top: 7, right: 8, width: 8, height: 8, borderRadius: 4, background: C.danger, border: '1.5px solid #fff' }}/>
        </div>}
      />

      <div style={{ padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Hero status */}
        <div style={{
          padding: '20px 18px',
          borderRadius: 16,
          background: 'linear-gradient(180deg, #fff 0%, #FAFBFD 100%)',
          border: '0.5px solid ' + C.line,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 56, fontWeight: 600, color: C.danger,
              lineHeight: 1, letterSpacing: '-0.04em',
            }}>{D.summary.expired + D.summary.urgent}</div>
            <div style={{ fontSize: 13, color: C.ink2, fontWeight: 500 }}>件 要対応</div>
          </div>
          <div style={{ fontSize: 12, color: C.ink2, marginTop: 6, lineHeight: 1.6 }}>
            期限切れ {D.summary.expired}件 ・ 7日以内 {D.summary.urgent}件 ・ 30日以内 {D.summary.warn}件
          </div>
          <div style={{
            display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', marginTop: 14,
            background: C.line2,
          }}>
            <div style={{ flex: D.summary.expired, background: C.danger }}/>
            <div style={{ flex: D.summary.urgent + D.summary.warn, background: C.warn }}/>
            <div style={{ flex: D.summary.ok, background: C.ok }}/>
            <div style={{ flex: D.summary.total - D.summary.expired - D.summary.urgent - D.summary.warn - D.summary.ok, background: C.ink4 }}/>
          </div>
        </div>

        {/* Quick stats by category */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.ink3, letterSpacing: '0.1em', marginBottom: 10 }}>カテゴリ別在庫</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {['食品', '飲料', '日用品', '医薬品'].map(cat => {
              const items = D.items.filter(i => i.cat === cat);
              const totalQty = items.reduce((s, i) => s + i.qty, 0);
              const meta = CAT_META[cat];
              const alerts = items.filter(i => i.status === 'expired' || i.status === 'urgent').length;
              return (
                <div key={cat} style={{
                  background: '#fff', border: '0.5px solid ' + C.line,
                  borderRadius: 12, padding: 12,
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <CatChip cat={cat} size={26}/>
                    {alerts > 0 && (
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: C.danger,
                        background: C.dangerSoft, padding: '2px 7px', borderRadius: 8,
                      }}>{alerts}件警告</span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginTop: 2 }}>{cat}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 600, color: C.ink, letterSpacing: '-0.02em' }}>{items.length}</span>
                    <span style={{ fontSize: 11, color: C.ink3 }}>品目 / {totalQty}個</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expiring soon */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.ink3, letterSpacing: '0.1em' }}>期限が近い品目</div>
            <div style={{ fontSize: 12, color: C.accent, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
              すべて見る<Icon name="chev" size={12} color={C.accent} stroke={2}/>
            </div>
          </div>
          <Card padding={0}>
            {expiringSoon.slice(0, 5).map((it, idx) => (
              <div key={it.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px',
                borderBottom: idx < 4 ? '0.5px solid ' + C.line2 : 'none',
              }}>
                <CatChip cat={it.cat} size={32}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
                  <div style={{ fontSize: 11, color: C.ink3, marginTop: 2, display: 'flex', gap: 8 }}>
                    <span>{it.qty}{it.unit}</span>
                    <span>·</span>
                    <span>{it.exp}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <DaysPill days={it.days} status={it.status}/>
                  <StatusBadge status={it.status}/>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { icon: 'plus', label: '備蓄品を追加', color: C.accent },
            { icon: 'cal',  label: 'カレンダー出力', color: C.ink2 },
          ].map((a, i) => (
            <div key={i} style={{
              padding: '14px 14px', borderRadius: 12,
              background: i === 0 ? C.accentSoft : '#fff',
              border: '0.5px solid ' + (i === 0 ? 'transparent' : C.line),
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Icon name={a.icon} size={18} color={a.color} stroke={2}/>
              <div style={{ fontSize: 13, fontWeight: 600, color: a.color }}>{a.label}</div>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="home"/>
    </div>
  );
}
window.ScreenHome = ScreenHome;
