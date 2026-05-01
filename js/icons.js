// SVGアイコンセット
// デザインハンドオフ ui.jsx のIconコンポーネントを参考に実装

/**
 * SVGアイコンを生成
 * @param {string} name - アイコン名
 * @param {object} options - オプション { size, color, stroke, className }
 * @returns {string} SVG HTML文字列
 */
function createIcon(name, options = {}) {
  const {
    size = 18,
    color = 'currentColor',
    stroke = 1.6,
    className = ''
  } = options;

  const pathAttrs = `fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"`;

  const paths = {
    home: `<path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2v-9z" ${pathAttrs}/>`,

    list: `<path d="M8 6h13M8 12h13M8 18h13" ${pathAttrs}/><circle cx="4" cy="6" r="1" fill="${color}"/><circle cx="4" cy="12" r="1" fill="${color}"/><circle cx="4" cy="18" r="1" fill="${color}"/>`,

    plus: `<path d="M12 5v14M5 12h14" ${pathAttrs}/>`,

    bell: `<path d="M6 8a6 6 0 0112 0c0 7 3 7 3 9H3c0-2 3-2 3-9z" ${pathAttrs}/><path d="M10 21a2 2 0 004 0" ${pathAttrs}/>`,

    cog: `<circle cx="12" cy="12" r="3" ${pathAttrs}/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" ${pathAttrs}/>`,

    cal: `<rect x="3" y="5" width="18" height="16" rx="2" ${pathAttrs}/><path d="M3 10h18M8 3v4M16 3v4" ${pathAttrs}/>`,

    chev: `<path d="M9 6l6 6-6 6" ${pathAttrs}/>`,

    chevDown: `<path d="M6 9l6 6 6-6" ${pathAttrs}/>`,

    back: `<path d="M15 6l-6 6 6 6" ${pathAttrs}/>`,

    search: `<circle cx="11" cy="11" r="7" ${pathAttrs}/><path d="M20 20l-3.5-3.5" ${pathAttrs}/>`,

    filter: `<path d="M4 5h16l-6 8v6l-4-2v-4L4 5z" ${pathAttrs}/>`,

    minus: `<path d="M5 12h14" ${pathAttrs}/>`,

    check: `<path d="M5 12l5 5L20 7" ${pathAttrs}/>`,

    x: `<path d="M6 6l12 12M18 6L6 18" ${pathAttrs}/>`,

    food: `<path d="M12 3c-3 0-5 2-5 5v3h10V8c0-3-2-5-5-5z" ${pathAttrs}/><path d="M5 11h14l-1 9a2 2 0 01-2 2H8a2 2 0 01-2-2l-1-9z" ${pathAttrs}/>`,

    drink: `<path d="M7 4h10l-1 16a2 2 0 01-2 2H10a2 2 0 01-2-2L7 4z" ${pathAttrs}/><path d="M7.5 9h9" ${pathAttrs}/>`,

    med: `<rect x="3" y="9" width="18" height="6" rx="3" ${pathAttrs}/><path d="M12 9v6" ${pathAttrs}/>`,

    upload: `<path d="M12 16V4M6 10l6-6 6 6" ${pathAttrs}/><path d="M4 20h16" ${pathAttrs}/>`,

    download: `<path d="M12 4v12M6 14l6 6 6-6" ${pathAttrs}/><path d="M4 22h16" ${pathAttrs}/>`,

    barcode: `<path d="M4 6v12M7 6v12M10 6v12M13 6v12M16 6v12M19 6v12" ${pathAttrs}/>`,

    qr: `<rect x="3" y="3" width="7" height="7" rx="1" ${pathAttrs}/><rect x="14" y="3" width="7" height="7" rx="1" ${pathAttrs}/><rect x="3" y="14" width="7" height="7" rx="1" ${pathAttrs}/><path d="M14 14h3v3M21 14v3M14 18v3h3M18 21h3" ${pathAttrs}/>`,

    mic: `<rect x="9" y="3" width="6" height="12" rx="3" ${pathAttrs}/><path d="M5 11a7 7 0 0014 0M12 18v3" ${pathAttrs}/>`,

    camera: `<path d="M3 8a2 2 0 012-2h2l2-2h6l2 2h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" ${pathAttrs}/><circle cx="12" cy="13" r="4" ${pathAttrs}/>`,

    clock: `<circle cx="12" cy="12" r="9" ${pathAttrs}/><path d="M12 7v5l3 2" ${pathAttrs}/>`,

    edit: `<path d="M4 20h4l11-11-4-4L4 16v4z" ${pathAttrs}/>`,

    trash: `<path d="M5 7h14M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M7 7l1 13a2 2 0 002 2h4a2 2 0 002-2l1-13" ${pathAttrs}/>`,

    share: `<circle cx="6" cy="12" r="2" ${pathAttrs}/><circle cx="18" cy="6" r="2" ${pathAttrs}/><circle cx="18" cy="18" r="2" ${pathAttrs}/><path d="M8 11l8-4M8 13l8 4" ${pathAttrs}/>`,

    sparkle: `<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" ${pathAttrs}/>`,
  };

  if (!paths[name]) {
    console.warn(`Icon "${name}" not found`);
    return '';
  }

  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" class="${className}" style="display:block">${paths[name]}</svg>`;
}

/**
 * カテゴリ別のアイコン名を取得
 * @param {string} category - カテゴリID
 * @returns {string} アイコン名
 */
function getCategoryIcon(category) {
  const iconMap = {
    water: 'drink',
    food: 'food',
    medical: 'med',
    hygiene: 'home',
    battery: 'home',
    other: 'home',
    // 日本語カテゴリ名
    '飲料': 'drink',
    '食品': 'food',
    '医薬品': 'med',
    '日用品': 'home',
  };
  return iconMap[category] || 'home';
}

/**
 * カテゴリチップを生成
 * @param {string} category - カテゴリID
 * @param {number} size - サイズ（デフォルト28px）
 * @returns {string} カテゴリチップHTML
 */
function createCatChip(category, size = 28) {
  const colors = {
    water: '#5BA3C7',
    food: '#D89C5A',
    medical: '#C77B8E',
    hygiene: '#9C8FB8',
    battery: '#9C8FB8',
    other: '#8A8F9C',
    // 日本語カテゴリ名
    '飲料': '#5BA3C7',
    '食品': '#D89C5A',
    '医薬品': '#C77B8E',
    '日用品': '#9C8FB8',
  };

  const color = colors[category] || '#8A8F9C';
  const iconName = getCategoryIcon(category);
  const iconSize = Math.floor(size * 0.55);

  return `
    <span class="cat-chip" style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 8px;
      background: ${color}22;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    ">
      ${createIcon(iconName, { size: iconSize, color, stroke: 1.8 })}
    </span>
  `;
}

/**
 * ステータスバッジを生成
 * @param {string} status - ステータス (expired/urgent/warn/ok/none)
 * @param {string} size - サイズ (sm/lg)
 * @returns {string} ステータスバッジHTML
 */
function createStatusBadge(status, size = 'sm') {
  const statusMeta = {
    expired: { label: '期限切れ', color: 'var(--danger)', soft: 'var(--danger-soft)', dot: 'var(--danger)' },
    urgent:  { label: '期限間近', color: 'var(--warn)', soft: 'var(--warn-soft)', dot: 'var(--warn)' },
    warn:    { label: '要確認',   color: 'var(--warn)', soft: 'var(--warn-soft)', dot: 'var(--warn)' },
    ok:      { label: '余裕あり', color: 'var(--ok)', soft: 'var(--ok-soft)', dot: 'var(--ok)' },
    none:    { label: '期限なし', color: 'var(--ink-3)', soft: '#F5F6F8', dot: 'var(--ink-3)' },
  };

  const meta = statusMeta[status] || statusMeta.none;
  const big = size === 'lg';

  return `
    <span class="status-badge" style="
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: ${big ? '4px 10px' : '2px 8px'};
      border-radius: 999px;
      background: ${meta.soft};
      color: ${meta.color};
      font-size: ${big ? '12px' : '11px'};
      font-weight: 600;
      letter-spacing: 0.02em;
      line-height: 1.4;
      white-space: nowrap;
    ">
      <span style="
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${meta.dot};
      "></span>
      ${meta.label}
    </span>
  `;
}

/**
 * 残り日数ピルを生成
 * @param {number|null} days - 残り日数
 * @param {string} status - ステータス
 * @returns {string} 日数ピルHTML
 */
function createDaysPill(days, status) {
  if (days === null) {
    return `<span style="color: var(--ink-3); font-size: 11px;">期限なし</span>`;
  }

  const statusColors = {
    expired: 'var(--danger)',
    urgent: 'var(--warn)',
    warn: 'var(--warn)',
    ok: 'var(--ok)',
    none: 'var(--ink-3)',
  };

  const color = statusColors[status] || 'var(--ink-3)';
  const text = days < 0 ? `${Math.abs(days)}日経過` :
               days === 0 ? '今日まで' :
               `あと${days}日`;

  return `
    <span style="
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 600;
      color: ${color};
      letter-spacing: 0;
    ">${text}</span>
  `;
}
