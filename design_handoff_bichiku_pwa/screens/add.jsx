// Add new item form
function ScreenAdd() {
  return (
    <div style={{ height: '100%', overflow: 'auto', background: C.bg, paddingBottom: 32 }}>
      <TopBar
        title="備蓄品を追加"
        left={<div style={{ fontSize: 15, color: C.accent, fontWeight: 500 }}>キャンセル</div>}
        right={<div style={{ fontSize: 15, color: C.accent, fontWeight: 600 }}>保存</div>}
      />

      <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* 入力支援ショートカット (Phase 2 hint) */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { icon: 'barcode', label: 'バーコード' },
            { icon: 'camera',  label: '期限OCR' },
            { icon: 'mic',     label: '音声' },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, padding: '10px 8px', borderRadius: 10,
              background: '#fff', border: '0.5px dashed ' + C.line,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <Icon name={s.icon} size={18} color={C.accent}/>
              <span style={{ fontSize: 10, color: C.ink2, fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid ' + C.line, overflow: 'hidden' }}>
          <FormRow label="品名" value="保存水 2L" focused/>
          <FormRow label="カテゴリ" value="飲料" trailing={<Icon name="chev" size={14} color={C.ink3}/>}/>
          <FormRow label="保管場所" value="玄関収納" placeholder/>
          <FormRow label="メモ" value="" placeholder="（任意）" last/>
        </div>

        {/* Quantity */}
        <div>
          <SectionHead>数量</SectionHead>
          <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid ' + C.line, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 600, color: C.ink }}>6</span>
              <span style={{ fontSize: 13, color: C.ink2 }}>本</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <CircleBtn icon="minus"/>
              <CircleBtn icon="plus" primary/>
            </div>
          </div>
        </div>

        {/* Expiry */}
        <div>
          <SectionHead>賞味期限</SectionHead>
          <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid ' + C.line, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 500, color: C.ink, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="cal" size={18} color={C.accent}/>
              2027 / 12 / 02
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['3ヶ月後', '6ヶ月後', '1年後', '3年後'].map((q, i) => (
                <div key={q} style={{
                  padding: '6px 12px', borderRadius: 14,
                  background: i === 2 ? C.accentSoft : C.line2,
                  color: i === 2 ? C.accent : C.ink2,
                  fontSize: 11, fontWeight: 600,
                  border: i === 2 ? '0.5px solid oklch(0.55 0.10 240 / 0.3)' : '0.5px solid transparent',
                }}>{q}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Reminder toggle */}
        <div>
          <SectionHead>リマインダー</SectionHead>
          <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid ' + C.line, overflow: 'hidden' }}>
            <ToggleRow label="期限が近づいたら通知" on/>
            <ToggleRow label="カレンダーに追加" on last/>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHead({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: C.ink3, letterSpacing: '0.1em', marginBottom: 8, paddingLeft: 4 }}>{children}</div>;
}

function FormRow({ label, value, focused, placeholder, trailing, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '14px 16px',
      borderBottom: last ? 'none' : '0.5px solid ' + C.line2,
      gap: 12,
    }}>
      <div style={{ width: 78, fontSize: 13, color: C.ink2, fontWeight: 500 }}>{label}</div>
      <div style={{ flex: 1, fontSize: 14, color: value && !placeholder ? C.ink : C.ink4 }}>
        {value || placeholder}
        {focused && <span style={{ display: 'inline-block', width: 1.5, height: 16, background: C.accent, marginLeft: 1, verticalAlign: 'middle' }}/>}
      </div>
      {trailing}
    </div>
  );
}

function CircleBtn({ icon, primary }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 18,
      background: primary ? C.accent : '#fff',
      border: primary ? 'none' : '0.5px solid ' + C.line,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: primary ? '0 2px 6px oklch(0.55 0.10 240 / 0.3)' : 'none',
    }}>
      <Icon name={icon} size={18} color={primary ? '#fff' : C.ink2} stroke={2.2}/>
    </div>
  );
}

function ToggleRow({ label, on, last, sub }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: last ? 'none' : '0.5px solid ' + C.line2,
    }}>
      <div>
        <div style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: C.ink3, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{
        width: 44, height: 26, borderRadius: 13, padding: 2,
        background: on ? C.ok : '#D8DBE0',
        display: 'flex', alignItems: 'center',
        justifyContent: on ? 'flex-end' : 'flex-start',
        boxSizing: 'border-box',
      }}>
        <div style={{ width: 22, height: 22, borderRadius: 11, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}/>
      </div>
    </div>
  );
}

window.ScreenAdd = ScreenAdd;
window.ToggleRow = ToggleRow;
window.SectionHead = SectionHead;
