// カレンダービュー管理

class CalendarView {
  constructor() {
    this.storage = storage;
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    this.attachEventListeners();
  }

  /**
   * イベントリスナーを設定
   */
  attachEventListeners() {
    // カレンダー出力ボタン
    const exportBtn = document.getElementById('calendarExportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportToCalendar());
    }
  }

  /**
   * カレンダービューを更新
   */
  update() {
    const items = this.storage.getAllItems();
    const settings = this.storage.getSettings();
    const warningDays = settings.notifications.warningDays;

    // 賞味期限があるアイテムのみフィルタ
    const itemsWithExpiry = items.filter(item => {
      const exp = item.exp || item.expiryDate;
      return exp && exp !== '';
    });

    if (itemsWithExpiry.length === 0) {
      this.showEmpty();
      return;
    }

    // 期限別にグループ化
    const grouped = this.groupByExpiry(itemsWithExpiry);

    // 各セクションを描画
    this.renderSection('expired', grouped.expired, '期限切れ');
    this.renderSection('thisWeek', grouped.thisWeek, '今週');
    this.renderSection('thisMonth', grouped.thisMonth, '今月');
    this.renderSection('later', grouped.later, 'それ以降');

    // 空状態を非表示
    const emptyEl = document.getElementById('calendarEmpty');
    if (emptyEl) {
      emptyEl.style.display = 'none';
    }
  }

  /**
   * アイテムを期限別にグループ化
   * @param {Array} items - アイテム配列
   * @returns {Object} グループ化されたアイテム
   */
  groupByExpiry(items) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekLater = new Date(today);
    weekLater.setDate(weekLater.getDate() + 7);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const grouped = {
      expired: [],
      thisWeek: [],
      thisMonth: [],
      later: []
    };

    items.forEach(item => {
      const exp = item.exp || item.expiryDate;
      if (!exp) return;

      const expiryDate = new Date(exp + 'T00:00:00');

      if (expiryDate < today) {
        grouped.expired.push(item);
      } else if (expiryDate < weekLater) {
        grouped.thisWeek.push(item);
      } else if (expiryDate <= monthEnd) {
        grouped.thisMonth.push(item);
      } else {
        grouped.later.push(item);
      }
    });

    // 各グループを日付順にソート
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => {
        const expA = a.exp || a.expiryDate;
        const expB = b.exp || b.expiryDate;
        return expA.localeCompare(expB);
      });
    });

    return grouped;
  }

  /**
   * セクションを描画
   * @param {string} sectionId - セクションID
   * @param {Array} items - アイテム配列
   * @param {string} title - セクションタイトル
   */
  renderSection(sectionId, items, title) {
    const sectionEl = document.getElementById(`calendar${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`);
    const itemsEl = document.getElementById(`${sectionId}Items`);
    const countEl = document.getElementById(`${sectionId}Count`);

    if (!sectionEl || !itemsEl || !countEl) return;

    if (items.length === 0) {
      sectionEl.style.display = 'none';
      return;
    }

    sectionEl.style.display = 'block';
    countEl.textContent = `${items.length}件`;

    // アイテムをグループ化（日付ごと）
    const itemsByDate = this.groupByDate(items);

    // HTML生成
    const html = Object.keys(itemsByDate).map(dateStr => {
      const dateItems = itemsByDate[dateStr];
      return dateItems.map(item => this.createCalendarItemHTML(item, dateStr)).join('');
    }).join('');

    itemsEl.innerHTML = html;
  }

  /**
   * アイテムを日付でグループ化
   * @param {Array} items - アイテム配列
   * @returns {Object} 日付ごとのアイテム
   */
  groupByDate(items) {
    const grouped = {};

    items.forEach(item => {
      const exp = item.exp || item.expiryDate;
      if (!exp) return;

      if (!grouped[exp]) {
        grouped[exp] = [];
      }
      grouped[exp].push(item);
    });

    return grouped;
  }

  /**
   * カレンダーアイテムHTMLを生成
   * @param {Object} item - アイテム
   * @param {string} dateStr - 日付文字列 (YYYY-MM-DD)
   * @returns {string} HTML
   */
  createCalendarItemHTML(item, dateStr) {
    const exp = item.exp || item.expiryDate;
    const qty = item.qty !== undefined ? item.qty : item.quantity;
    const cat = item.cat || item.category || '食品';

    // 日付情報
    const date = new Date(dateStr + 'T00:00:00');
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];

    // ステータス
    const settings = this.storage.getSettings();
    const status = getExpiryStatus(exp, settings.notifications.warningDays);
    const daysLeft = getDaysUntilExpiry(exp);

    return `
      <div class="calendar-item">
        <div class="calendar-item__date">
          <span class="calendar-item__date-month">${month}月</span>
          <span class="calendar-item__date-day">${day}</span>
          <span class="calendar-item__date-weekday">(${weekday})</span>
        </div>
        <div class="calendar-item__content">
          <h3 class="calendar-item__name">${this.escapeHtml(item.name)}</h3>
          <div class="calendar-item__meta">
            ${createCatChip(cat, 28)}
            <span>${qty}${item.unit || '個'}</span>
          </div>
        </div>
        <div class="calendar-item__status">
          ${createDaysPill(daysLeft, status)}
          ${createStatusBadge(status, 'sm')}
        </div>
      </div>
    `;
  }

  /**
   * 空状態を表示
   */
  showEmpty() {
    // 全セクションを非表示
    ['expired', 'thisWeek', 'thisMonth', 'later'].forEach(id => {
      const sectionEl = document.getElementById(`calendar${id.charAt(0).toUpperCase() + id.slice(1)}`);
      if (sectionEl) {
        sectionEl.style.display = 'none';
      }
    });

    // 空状態を表示
    const emptyEl = document.getElementById('calendarEmpty');
    if (emptyEl) {
      emptyEl.style.display = 'block';
    }
  }

  /**
   * カレンダーにエクスポート
   */
  exportToCalendar() {
    if (!window.calendarManager) {
      showToast('カレンダー機能が利用できません', 3000, 'error');
      return;
    }

    const items = this.storage.getAllItems();

    // 賞味期限があるアイテムのみフィルタ
    const itemsWithExpiry = items.filter(item => {
      const exp = item.exp || item.expiryDate;
      return exp && exp !== '';
    });

    if (itemsWithExpiry.length === 0) {
      showToast('カレンダーに出力するアイテムがありません', 3000, 'info');
      return;
    }

    try {
      window.calendarManager.exportToCalendar(itemsWithExpiry);
      showToast(`${itemsWithExpiry.length}件をカレンダーに出力しました`, 3000, 'success');
    } catch (error) {
      console.error('Calendar export error:', error);
      showToast('カレンダー出力に失敗しました', 3000, 'error');
    }
  }

  /**
   * HTMLエスケープ
   * @param {string} str - エスケープする文字列
   * @returns {string} エスケープされた文字列
   */
  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

// カレンダービューを初期化
let calendarView;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    calendarView = new CalendarView();
  });
} else {
  calendarView = new CalendarView();
}
