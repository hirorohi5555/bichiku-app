// Sample data — 3〜4人家族の防災備蓄想定。 Today: 2026-05-01.
window.STOCKPILE_DATA = (function () {
  const today = new Date('2026-05-01');
  const d = (offsetDays) => {
    const x = new Date(today);
    x.setDate(x.getDate() + offsetDays);
    return x.toISOString().slice(0, 10);
  };

  const items = [
    // 食品
    { id: 'i01', name: '無洗米 5kg', cat: '食品', qty: 4, unit: '袋', exp: d(420), note: '玄関収納' },
    { id: 'i02', name: 'カップ麺（醤油）', cat: '食品', qty: 12, unit: '個', exp: d(95), note: 'パントリー上段' },
    { id: 'i03', name: 'レトルトカレー', cat: '食品', qty: 8, unit: '袋', exp: d(28), note: 'パントリー' },
    { id: 'i04', name: '缶詰（さば味噌煮）', cat: '食品', qty: 6, unit: '缶', exp: d(720), note: '床下収納' },
    { id: 'i05', name: 'パスタ 1.6mm', cat: '食品', qty: 3, unit: '袋', exp: d(180), note: 'キッチン' },
    { id: 'i06', name: 'アルファ米（白米）', cat: '食品', qty: 10, unit: '袋', exp: d(1200), note: '防災リュック' },
    { id: 'i07', name: 'ビスコ保存缶', cat: '食品', qty: 2, unit: '缶', exp: d(-12), note: '防災リュック' },

    // 飲料
    { id: 'i08', name: '保存水 2L', cat: '飲料', qty: 18, unit: '本', exp: d(580), note: '玄関収納' },
    { id: 'i09', name: '保存水 500ml', cat: '飲料', qty: 24, unit: '本', exp: d(14), note: '防災リュック' },
    { id: 'i10', name: '野菜ジュース', cat: '飲料', qty: 12, unit: '本', exp: d(62), note: 'パントリー' },
    { id: 'i11', name: '経口補水液', cat: '飲料', qty: 6, unit: '本', exp: d(7), note: '救急箱横' },

    // 日用品
    { id: 'i12', name: 'トイレットペーパー', cat: '日用品', qty: 24, unit: 'ロール', exp: null, note: '洗面所上' },
    { id: 'i13', name: 'ティッシュ 5箱', cat: '日用品', qty: 3, unit: 'パック', exp: null, note: 'リビング' },
    { id: 'i14', name: '簡易トイレ', cat: '日用品', qty: 50, unit: '回分', exp: d(2400), note: '防災リュック' },
    { id: 'i15', name: 'カセットボンベ', cat: '日用品', qty: 9, unit: '本', exp: d(2100), note: 'キッチン下' },
    { id: 'i16', name: 'ウェットティッシュ', cat: '日用品', qty: 6, unit: 'パック', exp: d(45), note: '玄関' },
    { id: 'i17', name: 'モバイルバッテリー', cat: '日用品', qty: 2, unit: '個', exp: null, note: '防災リュック' },

    // 医薬品
    { id: 'i18', name: '解熱鎮痛薬', cat: '医薬品', qty: 1, unit: '箱', exp: d(310), note: '救急箱' },
    { id: 'i19', name: '絆創膏', cat: '医薬品', qty: 2, unit: '箱', exp: d(90), note: '救急箱' },
    { id: 'i20', name: '消毒液', cat: '医薬品', qty: 2, unit: '本', exp: d(-3), note: '救急箱' },
    { id: 'i21', name: 'マスク', cat: '医薬品', qty: 60, unit: '枚', exp: null, note: '玄関' },
  ];

  // Compute days remaining
  const annotated = items.map(i => {
    if (!i.exp) return { ...i, days: null, status: 'none' };
    const days = Math.round((new Date(i.exp) - today) / 86400000);
    let status = 'ok';
    if (days < 0) status = 'expired';
    else if (days <= 7) status = 'urgent';
    else if (days <= 30) status = 'warn';
    return { ...i, days, status };
  });

  return {
    today,
    todayLabel: '2026年5月1日（金）',
    items: annotated,
    categories: ['すべて', '食品', '飲料', '日用品', '医薬品'],
    summary: {
      total: annotated.length,
      expired: annotated.filter(i => i.status === 'expired').length,
      urgent: annotated.filter(i => i.status === 'urgent').length,
      warn: annotated.filter(i => i.status === 'warn').length,
      ok: annotated.filter(i => i.status === 'ok').length,
    },
  };
})();
