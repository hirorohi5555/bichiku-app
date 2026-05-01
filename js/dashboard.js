// ダッシュボード（ホーム画面）の描画

class Dashboard {
  constructor(app) {
    this.app = app;
    this.init();
  }

  init() {
    this.renderCurrentDate();
    this.renderNotificationBell();
    this.renderQuickActionIcons();
    this.update();
  }

  /**
   * 現在日付を表示
   */
  renderCurrentDate() {
    const dateEl = document.getElementById('currentDate');
    if (!dateEl) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][now.getDay()];

    dateEl.textContent = `${year}年${month}月${day}日（${dayOfWeek}）`;
  }

  /**
   * 通知ベルアイコンを描画
   */
  renderNotificationBell() {
    const iconEl = document.getElementById('iconBell');
    if (iconEl) {
      iconEl.innerHTML = createIcon('bell', { size: 18, color: 'var(--ink-2)' });
    }
  }

  /**
   * クイックアクションアイコンを描画
   */
  renderQuickActionIcons() {
    const iconAdd = document.getElementById('iconQuickAdd');
    if (iconAdd) {
      iconAdd.innerHTML = createIcon('plus', { size: 24, color: 'var(--accent)', stroke: 2 });
    }

    const iconCal = document.getElementById('iconQuickCal');
    if (iconCal) {
      iconCal.innerHTML = createIcon('cal', { size: 24, color: 'var(--ink-2)' });
    }
  }

  /**
   * ダッシュボード全体を更新
   */
  update() {
    const items = storage.getAllItems();
    const settings = storage.getSettings();
    const warningDays = settings.warningThresholdDays || 30;

    this.renderHeroStatus(items, warningDays);
    this.renderCategoryGrid(items, warningDays);
    this.renderExpiringList(items, warningDays);
    this.updateNotificationBadge(items, warningDays);
  }

  /**
   * ヒーローステータスカードを描画
   */
  renderHeroStatus(items, warningDays) {
    // 統計計算
    const stats = this.calculateStats(items, warningDays);

    // 要対応件数（期限切れ + 7日以内）
    const urgent = stats.expired + stats.sevenDays;
    const heroValue = document.getElementById('heroValue');
    if (heroValue) {
      heroValue.textContent = urgent;
    }

    // 内訳テキスト
    const breakdown = document.getElementById('heroBreakdown');
    if (breakdown) {
      breakdown.textContent = `期限切れ ${stats.expired}件 ・ 7日以内 ${stats.sevenDays}件 ・ 30日以内 ${stats.thirtyDays}件`;
    }

    // スタックバー
    const barEl = document.getElementById('heroBar');
    if (barEl) {
      const total = items.length || 1;
      const expiredRatio = (stats.expired / total) * 100;
      const warnRatio = ((stats.sevenDays + stats.thirtyDays) / total) * 100;
      const okRatio = (stats.ok / total) * 100;
      const noneRatio = 100 - expiredRatio - warnRatio - okRatio;

      barEl.innerHTML = `
        ${stats.expired > 0 ? `<div class="hero-status__bar-segment" style="width: ${expiredRatio}%; background: var(--danger);"></div>` : ''}
        ${(stats.sevenDays + stats.thirtyDays) > 0 ? `<div class="hero-status__bar-segment" style="width: ${warnRatio}%; background: var(--warn);"></div>` : ''}
        ${stats.ok > 0 ? `<div class="hero-status__bar-segment" style="width: ${okRatio}%; background: var(--ok);"></div>` : ''}
        ${noneRatio > 0 ? `<div class="hero-status__bar-segment" style="width: ${noneRatio}%; background: var(--ink-4);"></div>` : ''}
      `;
    }
  }

  /**
   * 統計を計算
   */
  calculateStats(items, warningDays) {
    let expired = 0;
    let sevenDays = 0;
    let thirtyDays = 0;
    let ok = 0;

    items.forEach(item => {
      const exp = item.exp || item.expiryDate;
      if (!exp) return;

      const days = getDaysUntilExpiry(exp);
      if (days < 0) {
        expired++;
      } else if (days <= 7) {
        sevenDays++;
      } else if (days <= warningDays) {
        thirtyDays++;
      } else {
        ok++;
      }
    });

    return { expired, sevenDays, thirtyDays, ok };
  }

  /**
   * カテゴリ別在庫グリッドを描画
   */
  renderCategoryGrid(items, warningDays) {
    const gridEl = document.getElementById('categoryGrid');
    if (!gridEl) return;

    const categories = ['食品', '飲料', '日用品', '医薬品'];
    const tilesHTML = categories.map(cat => {
      const catItems = items.filter(item => {
        const itemCat = item.cat || item.category || '食品';
        return itemCat === cat;
      });

      const totalQty = catItems.reduce((sum, item) => {
        const qty = item.qty !== undefined ? item.qty : item.quantity || 0;
        return sum + qty;
      }, 0);

      const alerts = catItems.filter(item => {
        const exp = item.exp || item.expiryDate;
        if (!exp) return false;
        const days = getDaysUntilExpiry(exp);
        return days < 0 || days <= 7;
      }).length;

      return `
        <div class="category-tile">
          <div class="category-tile__header">
            ${createCatChip(cat, 26)}
            ${alerts > 0 ? `<span class="category-tile__alert">${alerts}件警告</span>` : ''}
          </div>
          <div class="category-tile__name">${cat}</div>
          <div class="category-tile__stats">
            <span class="category-tile__count">${catItems.length}</span>
            <span class="category-tile__detail">品目 / ${totalQty}個</span>
          </div>
        </div>
      `;
    }).join('');

    gridEl.innerHTML = tilesHTML;
  }

  /**
   * 期限が近い品目リストを描画
   */
  renderExpiringList(items, warningDays) {
    const listEl = document.getElementById('expiringList');
    if (!listEl) return;

    // 期限が近い順にソート（期限切れ、7日以内、30日以内）
    const expiringItems = items
      .filter(item => {
        const exp = item.exp || item.expiryDate;
        if (!exp) return false;
        const days = getDaysUntilExpiry(exp);
        return days < 0 || days <= warningDays;
      })
      .sort((a, b) => {
        const expA = a.exp || a.expiryDate;
        const expB = b.exp || b.expiryDate;
        return getDaysUntilExpiry(expA) - getDaysUntilExpiry(expB);
      })
      .slice(0, 5); // 上位5件

    if (expiringItems.length === 0) {
      listEl.innerHTML = '<p style="text-align:center; color:var(--ink-3); padding:var(--space-10);">期限が近い品目はありません</p>';
      return;
    }

    const itemsHTML = expiringItems.map(item => {
      const exp = item.exp || item.expiryDate;
      const qty = item.qty !== undefined ? item.qty : item.quantity || 0;
      const cat = item.cat || item.category || '食品';
      const days = getDaysUntilExpiry(exp);
      const status = getExpiryStatus(exp, warningDays);

      return `
        <div class="expiring-item" data-id="${item.id}">
          ${createCatChip(cat, 36)}
          <div class="expiring-item__info">
            <div class="expiring-item__name">${this.escapeHtml(item.name)}</div>
            <div class="expiring-item__meta">${qty}${item.unit || '個'} · ${getCategoryName(cat)}</div>
          </div>
          <div class="expiring-item__status">
            ${createDaysPill(days, status)}
            ${createStatusBadge(status, 'sm')}
          </div>
        </div>
      `;
    }).join('');

    listEl.innerHTML = itemsHTML;
  }

  /**
   * 通知バッジを更新
   */
  updateNotificationBadge(items, warningDays) {
    const badgeEl = document.getElementById('notificationBadge');
    if (!badgeEl) return;

    const alerts = items.filter(item => {
      const exp = item.exp || item.expiryDate;
      if (!exp) return false;
      const days = getDaysUntilExpiry(exp);
      return days < 0 || days <= 7;
    }).length;

    if (alerts > 0) {
      badgeEl.classList.add('is-visible');
    } else {
      badgeEl.classList.remove('is-visible');
    }
  }

  /**
   * HTMLエスケープ
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// グローバル変数
let dashboard;
