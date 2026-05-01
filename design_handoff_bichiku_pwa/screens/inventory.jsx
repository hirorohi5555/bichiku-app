// Inventory list screen
function ScreenInventory() {
  const D = window.STOCKPILE_DATA;
  const items = [...D.items].sort((a, b) => (a.days ?? 99999) - (b.days ?? 99999));
  const cats = D.categories;

  return (
    <div style={{ height: '100%', overflow: 'auto', background: C.bg, paddingBottom: 96 }}>
      <TopBar
        large
        title="在庫一覧"
        sub={`${D.items.length}品目 · 期限が近い順`}
        right={<>
          <div style={{ width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="search" size={20} color={C.ink2}/></div>
          <div style={{ width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="filter" size={20} color={C.ink2}/></div>
        </>}
      />

      {/* Filter chips */}
      <div style={{
        display: 'flex', gap: 8, padding: '8px 20px 12px',
        background: '#fff', borderBottom: '0.5px solid ' + C.line,
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {cats.map((cat, i) => {
          const on = i === 0;
          return (
            <div key={cat} style={{
              padding: '6px 14px', borderRadius: 16,
              background: on ? C.ink : C.line2,
              color: on ? '#fff' : C.ink2,
              fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
            }}>{cat}</div>
          );
        })}
      </div>

      {/* Sort row */}
      <div style={{
        padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 11, color: C.ink3, fontWeight: 500,
      }}>
        <span>{D.items.length}件 表示中</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.ink2, fontWeight: 600 }}>
          賞味期限順 <Icon name="chevDown" size={12} color={C.ink2} stroke={2}/>
        </span>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.slice(0, 12).map(it => {
          const m = STATUS_META[it.status];
          return (
            <div key={it.id} style={{
              background: '#fff', borderRadius: 12,
              border: '0.5px solid ' + C.line,
              padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
              borderLeft: `3px solid ${m.dot}`,
            }}>
              <CatChip cat={it.cat} size={36}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: C.ink3 }}>
                  <span style={{ color: C.ink2, fontWeight: 600 }}>{it.qty}<span style={{ fontWeight: 400, color: C.ink3 }}>{it.unit}</span></span>
                  <span>·</span>
                  <span>{it.cat}</span>
                  {it.exp && <><span>·</span><span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{it.exp}</span></>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <DaysPill days={it.days} status={it.status}/>
                <StatusBadge status={it.status}/>
              </div>
            </div>
          );
        })}
      </div>

      <TabBar active="list"/>
    </div>
  );
}
window.ScreenInventory = ScreenInventory;
