// App entry — render all 8 screens onto the canvas grid.

const SCREENS = [
  { id: 'home',  num: '01', label: 'ホーム / ダッシュボード', section: 'コア体験', Comp: () => <ScreenHome/> },
  { id: 'list',  num: '02', label: '在庫一覧',                 section: 'コア体験', Comp: () => <ScreenInventory/> },
  { id: 'add',   num: '03', label: '備蓄品の追加',             section: 'コア体験', Comp: () => <ScreenAdd/> },
  { id: 'det',   num: '04', label: '詳細 / 使用・補充',        section: 'コア体験', Comp: () => <ScreenDetail/> },

  { id: 'cal',   num: '05', label: 'カレンダー連携',           section: '通知・連携', Comp: () => <ScreenCalendar/> },
  { id: 'noti',  num: '06', label: '通知設定',                 section: '通知・連携', Comp: () => <ScreenNotifications/> },

  { id: 'data',  num: '07', label: 'データ管理',               section: 'データ・導入', Comp: () => <ScreenData/> },
  { id: 'onb',   num: '08', label: 'オンボーディング',         section: 'データ・導入', Comp: () => <ScreenOnboarding/> },
];

function App() {
  const sections = [];
  let last = null;
  SCREENS.forEach(s => {
    if (s.section !== last) { sections.push({ label: s.section, items: [] }); last = s.section; }
    sections[sections.length - 1].items.push(s);
  });

  return (
    <>
      {sections.map(sec => (
        <React.Fragment key={sec.label}>
          <div className="section-divider" data-screen-label={sec.label}>{sec.label}</div>
          {sec.items.map(s => (
            <Frame key={s.id} num={s.num} label={s.label}>
              <s.Comp/>
            </Frame>
          ))}
        </React.Fragment>
      ))}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('grid'));
root.render(<App/>);
