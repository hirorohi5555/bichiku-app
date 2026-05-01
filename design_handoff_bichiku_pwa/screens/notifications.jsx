// Notification settings screen
function ScreenNotifications() {
  return (
    <div style={{ height: '100%', overflow: 'auto', background: C.bg, paddingBottom: 32 }}>
      <TopBar
        title="通知設定"
        left={<Icon name="back" size={22} color={C.accent} stroke={2}/>}
      />

      <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Permission status */}
        <div style={{
          background: '#fff', borderRadius: 12,
          border: '0.5px solid ' + C.line,
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 18,
            background: C.okSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="check" size={18} color={C.ok} stroke={2.4}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>通知が有効です</div>
            <div style={{ fontSize: 11, color: C.ink3, marginTop: 1 }}>Web Notification API · Service Worker 稼働中</div>
          </div>
        </div>

        {/* Master toggle */}
        <div>
          <SectionHead>通知</SectionHead>
          <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid ' + C.line, overflow: 'hidden' }}>
            <ToggleRow label="プッシュ通知" sub="Service Workerで定期チェック" on/>
            <ToggleRow label="バナーで表示" on/>
            <ToggleRow label="サウンド" on={false} last/>
          </div>
        </div>

        {/* Timing */}
        <div>
          <SectionHead>通知タイミング</SectionHead>
          <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid ' + C.line, overflow: 'hidden' }}>
            <ToggleRow label="60日前" on={false}/>
            <ToggleRow label="30日前" sub="期限の1ヶ月前" on/>
            <ToggleRow label="7日前" sub="期限の1週間前" on/>
            <ToggleRow label="当日" sub="期限の朝に通知" on last/>
          </div>
        </div>

        {/* Quiet hours */}
        <div>
          <SectionHead>通知時刻</SectionHead>
          <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid ' + C.line, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="clock" size={18} color={C.ink2}/>
              <div style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>毎日の通知時刻</div>
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 18, fontWeight: 600, color: C.accent, letterSpacing: '-0.01em',
            }}>09:00</div>
          </div>
        </div>

        {/* Sample preview */}
        <div>
          <SectionHead>プレビュー</SectionHead>
          <div style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: 16, padding: '12px 14px',
            border: '0.5px solid rgba(0,0,0,0.06)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 9,
              background: C.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon name="bell" size={18} color="#fff" stroke={2}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.ink, letterSpacing: '0.02em' }}>備蓄管理</div>
                <div style={{ fontSize: 10, color: C.ink3 }}>9:00</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginTop: 2 }}>賞味期限が近い品目があります</div>
              <div style={{ fontSize: 12, color: C.ink2, marginTop: 1, lineHeight: 1.4 }}>「経口補水液」が7日以内に期限切れになります（残り 6日）。</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.ScreenNotifications = ScreenNotifications;
