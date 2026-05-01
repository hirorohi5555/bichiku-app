// Data export / import screen
function ScreenData() {
  const D = window.STOCKPILE_DATA;
  return (
    <div style={{ height: '100%', overflow: 'auto', background: C.bg, paddingBottom: 96 }}>
      <TopBar
        large
        title="データ管理"
        sub="バックアップ・引き継ぎ・共有"
      />

      <div style={{ padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Storage summary */}
        <div style={{
          background: '#fff', borderRadius: 14,
          border: '0.5px solid ' + C.line,
          padding: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: C.ink3, fontWeight: 500 }}>localStorage 使用状況</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: '-0.02em', marginTop: 2 }}>14.3 <span style={{ fontSize: 13, color: C.ink3, fontWeight: 500 }}>KB</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: C.ink3 }}>登録品目</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: '-0.02em', marginTop: 2 }}>{D.summary.total}</div>
            </div>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: C.line2, overflow: 'hidden' }}>
            <div style={{ width: '3%', height: '100%', background: C.accent }}/>
          </div>
        </div>

        {/* Export */}
        <div>
          <SectionHead>エクスポート</SectionHead>
          <div style={{
            background: '#fff', borderRadius: 12, border: '0.5px solid ' + C.line,
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 8,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="download" size={18} color={C.accent}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>JSONで書き出し</div>
              <div style={{ fontSize: 11, color: C.ink3, marginTop: 1 }}>stockpile-2026-05-01.json</div>
            </div>
            <Icon name="chev" size={16} color={C.ink3}/>
          </div>
          <div style={{
            background: '#fff', borderRadius: 12, border: '0.5px solid ' + C.line,
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="cal" size={18} color={C.accent}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>iCalendar (.ics)</div>
              <div style={{ fontSize: 11, color: C.ink3, marginTop: 1 }}>賞味期限をリマインダーに</div>
            </div>
            <Icon name="chev" size={16} color={C.ink3}/>
          </div>
        </div>

        {/* Import */}
        <div>
          <SectionHead>インポート</SectionHead>
          <div style={{
            background: '#fff', borderRadius: 12, border: '0.5px dashed ' + C.line,
            padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: C.line2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="upload" size={20} color={C.ink2}/>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>JSONファイルから復元</div>
            <div style={{ fontSize: 11, color: C.ink3, textAlign: 'center', maxWidth: 220, lineHeight: 1.5 }}>機種変更時や別端末との共有に使用できます</div>
          </div>
        </div>

        {/* Code preview */}
        <div>
          <SectionHead>プレビュー</SectionHead>
          <div style={{
            background: '#1A1D24', color: '#A8B0BD',
            borderRadius: 12, padding: 14,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, lineHeight: 1.6,
            overflow: 'hidden',
          }}>
            <div><span style={{ color: '#7A86A0' }}>{'{'}</span></div>
            <div style={{ paddingLeft: 12 }}><span style={{ color: '#92C5F8' }}>"version"</span>: <span style={{ color: '#A5D6A7' }}>"1.0"</span>,</div>
            <div style={{ paddingLeft: 12 }}><span style={{ color: '#92C5F8' }}>"exportedAt"</span>: <span style={{ color: '#A5D6A7' }}>"2026-05-01T09:00:00"</span>,</div>
            <div style={{ paddingLeft: 12 }}><span style={{ color: '#92C5F8' }}>"items"</span>: [</div>
            <div style={{ paddingLeft: 24 }}>{'{ '}<span style={{ color: '#92C5F8' }}>"name"</span>: <span style={{ color: '#A5D6A7' }}>"保存水 2L"</span>, <span style={{ color: '#92C5F8' }}>"qty"</span>: <span style={{ color: '#F8B88B' }}>18</span> {'}, ...'}</div>
            <div style={{ paddingLeft: 12 }}>]</div>
            <div><span style={{ color: '#7A86A0' }}>{'}'}</span></div>
          </div>
        </div>
      </div>

      <TabBar active="set"/>
    </div>
  );
}
window.ScreenData = ScreenData;
