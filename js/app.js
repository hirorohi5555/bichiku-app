// メインアプリケーションロジック

class StockApp {
  constructor() {
    this.currentEditId = null;
    this.currentQuantityId = null;
    this.currentFilter = 'all';
    this.currentSort = 'expiryDate';
    this.init();
  }

  /**
   * アプリ初期化
   */
  init() {
    this.cacheDOMElements();
    this.attachEventListeners();
    this.loadSettings();
    this.renderItems();
    this.updateStats();

    // ダッシュボードを初期化
    if (typeof Dashboard !== 'undefined') {
      window.dashboard = new Dashboard(this);
    }

    // 通知機能を初期化
    notificationManager.init();
  }

  /**
   * DOM要素をキャッシュ
   */
  cacheDOMElements() {
    // メニュー
    this.menuBtn = document.getElementById('menuBtn');
    this.sideMenu = document.getElementById('sideMenu');
    this.menuOverlay = document.getElementById('menuOverlay');
    this.menuCloseBtn = document.getElementById('menuCloseBtn');

    // 統計
    this.totalCount = document.getElementById('totalCount');
    this.warningCount = document.getElementById('warningCount');
    this.expiredCount = document.getElementById('expiredCount');

    // フィルタ・ソート
    this.categoryFilter = document.getElementById('categoryFilter');
    this.sortBy = document.getElementById('sortBy');

    // アイテムリスト
    this.itemList = document.getElementById('itemList');
    this.emptyState = document.getElementById('emptyState');

    // FAB
    this.addBtn = document.getElementById('addBtn');

    // アイテムモーダル
    this.itemModal = document.getElementById('itemModal');
    this.modalTitle = document.getElementById('modalTitle');
    this.itemForm = document.getElementById('itemForm');
    this.modalCloseBtn = document.getElementById('modalCloseBtn');
    this.formCancelBtn = document.getElementById('formCancelBtn');

    // フォーム要素
    this.itemName = document.getElementById('itemName');
    this.itemQuantity = document.getElementById('itemQuantity');
    this.itemUnit = document.getElementById('itemUnit');
    this.itemCategory = document.getElementById('itemCategory');
    this.itemExpiryDate = document.getElementById('itemExpiryDate');
    this.itemLocation = document.getElementById('itemLocation');
    this.itemNotes = document.getElementById('itemNotes');

    // 数量モーダル
    this.quantityModal = document.getElementById('quantityModal');
    this.quantityModalCloseBtn = document.getElementById('quantityModalCloseBtn');
    this.quantityItemName = document.getElementById('quantityItemName');
    this.currentQuantity = document.getElementById('currentQuantity');
    this.currentUnit = document.getElementById('currentUnit');
    this.decreaseBtn = document.getElementById('decreaseBtn');
    this.decrease5Btn = document.getElementById('decrease5Btn');
    this.increase5Btn = document.getElementById('increase5Btn');
    this.increaseBtn = document.getElementById('increaseBtn');
    this.quantityCloseBtn = document.getElementById('quantityCloseBtn');

    // 通知モーダル
    this.notificationModal = document.getElementById('notificationModal');
    this.notificationModalCloseBtn = document.getElementById('notificationModalCloseBtn');
    this.notificationEnabled = document.getElementById('notificationEnabled');
    this.warningDays = document.getElementById('warningDays');
    this.dailyCheckTime = document.getElementById('dailyCheckTime');
    this.testNotificationBtn = document.getElementById('testNotificationBtn');
    this.saveNotificationBtn = document.getElementById('saveNotificationBtn');

    // サイドメニューボタン
    this.exportJsonBtn = document.getElementById('exportJsonBtn');
    this.importJsonBtn = document.getElementById('importJsonBtn');
    this.exportCalendarBtn = document.getElementById('exportCalendarBtn');
    this.notificationSettingsBtn = document.getElementById('notificationSettingsBtn');
    this.aboutBtn = document.getElementById('aboutBtn');

    // ファイル入力
    this.fileInput = document.getElementById('fileInput');
  }

  /**
   * イベントリスナーを設定
   */
  attachEventListeners() {
    // メニュー
    this.menuBtn.addEventListener('click', () => this.openMenu());
    this.menuOverlay.addEventListener('click', () => this.closeMenu());
    this.menuCloseBtn.addEventListener('click', () => this.closeMenu());

    // フィルタ・ソート
    this.categoryFilter.addEventListener('change', (e) => {
      this.currentFilter = e.target.value;
      this.renderItems();
    });

    this.sortBy.addEventListener('change', (e) => {
      this.currentSort = e.target.value;
      this.renderItems();
    });

    // FAB
    this.addBtn.addEventListener('click', () => this.openAddModal());

    // アイテムモーダル
    this.modalCloseBtn.addEventListener('click', () => this.closeItemModal());
    this.formCancelBtn.addEventListener('click', () => this.closeItemModal());
    this.itemForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

    // 数量モーダル
    this.quantityModalCloseBtn.addEventListener('click', () => this.closeQuantityModal());
    this.quantityCloseBtn.addEventListener('click', () => this.closeQuantityModal());
    this.decreaseBtn.addEventListener('click', () => this.adjustQuantity(-1));
    this.decrease5Btn.addEventListener('click', () => this.adjustQuantity(-5));
    this.increase5Btn.addEventListener('click', () => this.adjustQuantity(5));
    this.increaseBtn.addEventListener('click', () => this.adjustQuantity(1));

    // 通知モーダル
    this.notificationModalCloseBtn.addEventListener('click', () => this.closeNotificationModal());
    this.testNotificationBtn.addEventListener('click', () => this.handleTestNotification());
    this.saveNotificationBtn.addEventListener('click', () => this.handleSaveNotification());

    // サイドメニュー
    this.exportJsonBtn.addEventListener('click', () => this.handleExportJson());
    this.importJsonBtn.addEventListener('click', () => this.handleImportJson());
    this.exportCalendarBtn.addEventListener('click', () => this.handleExportCalendar());
    this.notificationSettingsBtn.addEventListener('click', () => this.openNotificationModal());
    this.aboutBtn.addEventListener('click', () => this.handleAbout());

    // ファイル入力
    this.fileInput.addEventListener('change', (e) => this.handleFileSelected(e));

    // モーダルオーバーレイクリック
    document.querySelectorAll('.modal__overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeItemModal();
          this.closeQuantityModal();
          this.closeNotificationModal();
        }
      });
    });

    // クイックアクション
    const quickAddBtn = document.getElementById('quickAddBtn');
    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', () => this.openAddModal());
    }

    const quickCalendarBtn = document.getElementById('quickCalendarBtn');
    if (quickCalendarBtn) {
      quickCalendarBtn.addEventListener('click', () => this.handleExportCalendar());
    }

    // 通知ベルボタン
    const notificationBellBtn = document.getElementById('notificationBellBtn');
    if (notificationBellBtn) {
      notificationBellBtn.addEventListener('click', () => this.openNotificationModal());
    }
  }

  /**
   * 設定を読み込む
   */
  loadSettings() {
    const settings = storage.getSettings();
    this.currentFilter = settings.display.defaultFilter;
    this.currentSort = settings.display.defaultSort;
    this.categoryFilter.value = this.currentFilter;
    this.sortBy.value = this.currentSort;
  }

  /**
   * アイテムを描画
   */
  renderItems() {
    let items = storage.getAllItems();
    const settings = storage.getSettings();

    // フィルタリング
    items = filterByCategory(items, this.currentFilter);

    // ソート
    items = sortArray(items, this.currentSort, 'asc');

    // 空の状態チェック
    if (items.length === 0) {
      this.emptyState.style.display = 'block';
      this.itemList.querySelectorAll('.item-card').forEach(card => card.remove());
      return;
    }

    this.emptyState.style.display = 'none';

    // アイテムカードを生成
    const cardsHTML = items.map(item => this.createItemCard(item, settings.notifications.warningDays)).join('');
    this.itemList.innerHTML = cardsHTML + this.emptyState.outerHTML;

    // カードのイベントリスナーを設定
    this.attachCardEventListeners();

    // 統計を更新
    this.updateStats();
  }

  /**
   * アイテムカードのHTMLを生成（新デザイン対応）
   */
  createItemCard(item, warningDays) {
    // 新旧データ構造の両対応
    const exp = item.exp || item.expiryDate;
    const qty = item.qty !== undefined ? item.qty : item.quantity;
    const cat = item.cat || item.category || '食品';

    const status = getExpiryStatus(exp, warningDays);
    const daysLeft = getDaysUntilExpiry(exp);

    // ステータス別の色
    const statusColors = {
      expired: 'var(--danger)',
      urgent: 'var(--warn)',
      warn: 'var(--warn)',
      ok: 'var(--ok)',
      none: 'var(--ink-3)'
    };
    const borderColor = statusColors[status] || 'var(--line)';

    return `
      <div class="item-card" data-id="${item.id}" style="border-left: 3px solid ${borderColor};">
        <div class="item-card__header">
          ${createCatChip(cat, 36)}
          <div class="item-card__info">
            <h3 class="item-card__name">${this.escapeHtml(item.name)}</h3>
            <div class="item-card__meta">
              <span class="item-card__qty">${qty}${item.unit || '個'}</span>
              <span class="item-card__cat-name">${getCategoryName(cat)}</span>
              ${exp ? `<span class="item-card__exp-date">${formatDateJP(exp)}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="item-card__footer">
          <div class="item-card__status">
            ${createDaysPill(daysLeft, status)}
            ${createStatusBadge(status, 'sm')}
          </div>
          <div class="item-card__actions">
            <button class="btn btn--icon item-card__quantity-btn" data-id="${item.id}" aria-label="数量調整" title="数量調整">
              <span style="font-size: 18px;">±</span>
            </button>
            <button class="btn btn--icon item-card__edit-btn" data-id="${item.id}" aria-label="編集" title="編集">
              ${createIcon('edit', { size: 18, stroke: 1.6 })}
            </button>
            <button class="btn btn--icon btn--danger item-card__delete-btn" data-id="${item.id}" aria-label="削除" title="削除">
              ${createIcon('trash', { size: 18, stroke: 1.6 })}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * カードのイベントリスナーを設定
   */
  attachCardEventListeners() {
    // 数量調整ボタン
    document.querySelectorAll('.item-card__quantity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.openQuantityModal(id);
      });
    });

    // 編集ボタン
    document.querySelectorAll('.item-card__edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.openEditModal(id);
      });
    });

    // 削除ボタン
    document.querySelectorAll('.item-card__delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.handleDelete(id);
      });
    });
  }

  /**
   * 統計を更新
   */
  updateStats() {
    const items = storage.getAllItems();
    const settings = storage.getSettings();
    const warningDays = settings.warningThresholdDays || settings.notifications?.warningDays || 30;

    let expired = 0;
    let warning = 0;

    items.forEach(item => {
      const exp = item.exp || item.expiryDate;
      const status = getExpiryStatus(exp, warningDays);
      if (status === 'expired') expired++;
      else if (status === 'warning' || status === 'warn') warning++;
    });

    // 旧統計パネル（在庫一覧画面用）
    if (this.totalCount) this.totalCount.textContent = items.length;
    if (this.warningCount) this.warningCount.textContent = warning;
    if (this.expiredCount) this.expiredCount.textContent = expired;

    // ダッシュボードも更新
    if (window.dashboard) {
      window.dashboard.update();
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

  /**
   * メニューを開く
   */
  openMenu() {
    this.sideMenu.classList.add('is-open');
  }

  /**
   * メニューを閉じる
   */
  closeMenu() {
    this.sideMenu.classList.remove('is-open');
  }

  /**
   * 追加モーダルを開く
   */
  openAddModal() {
    this.currentEditId = null;
    this.modalTitle.textContent = '備蓄品を追加';
    this.itemForm.reset();
    this.itemModal.classList.add('is-open');
  }

  /**
   * 編集モーダルを開く
   */
  openEditModal(id) {
    const item = storage.getItemById(id);
    if (!item) return;

    this.currentEditId = id;
    this.modalTitle.textContent = '備蓄品を編集';

    // フォームに値を設定（新旧両対応）
    this.itemName.value = item.name || '';
    this.itemQuantity.value = item.qty !== undefined ? item.qty : (item.quantity || 0);
    this.itemUnit.value = item.unit || '個';
    this.itemCategory.value = item.cat || item.category || '食品';
    this.itemExpiryDate.value = item.exp || item.expiryDate || '';
    this.itemLocation.value = item.loc || item.location || '';
    this.itemNotes.value = item.note || item.notes || '';

    this.itemModal.classList.add('is-open');
  }

  /**
   * アイテムモーダルを閉じる
   */
  closeItemModal() {
    this.itemModal.classList.remove('is-open');
    this.currentEditId = null;
  }

  /**
   * フォーム送信処理
   */
  handleFormSubmit(e) {
    e.preventDefault();

    const itemData = {
      name: this.itemName.value.trim(),
      quantity: parseFloat(this.itemQuantity.value),
      unit: this.itemUnit.value.trim() || '個',
      category: this.itemCategory.value,
      expiryDate: this.itemExpiryDate.value || null,
      location: this.itemLocation.value.trim(),
      notes: this.itemNotes.value.trim()
    };

    // バリデーション
    if (!itemData.name || !itemData.category) {
      showToast('必須項目を入力してください', 3000, 'error');
      return;
    }

    if (itemData.quantity < 0) {
      showToast('数量は0以上で入力してください', 3000, 'error');
      return;
    }

    // 追加または更新
    let success;
    if (this.currentEditId) {
      success = storage.updateItem(this.currentEditId, itemData);
      if (success) {
        showToast('備蓄品を更新しました', 3000, 'success');
      }
    } else {
      success = storage.addItem(itemData);
      if (success) {
        showToast('備蓄品を追加しました', 3000, 'success');
      }
    }

    if (success) {
      this.closeItemModal();
      this.renderItems();
    }
  }

  /**
   * 削除処理
   */
  handleDelete(id) {
    const item = storage.getItemById(id);
    if (!item) return;

    if (confirm(`「${item.name}」を削除しますか？`)) {
      const success = storage.deleteItem(id);
      if (success) {
        showToast('備蓄品を削除しました', 3000, 'success');
        this.renderItems();
      }
    }
  }

  /**
   * 数量調整モーダルを開く
   */
  openQuantityModal(id) {
    const item = storage.getItemById(id);
    if (!item) return;

    this.currentQuantityId = id;
    this.quantityItemName.textContent = item.name;
    this.currentQuantity.textContent = item.qty !== undefined ? item.qty : (item.quantity || 0);
    this.currentUnit.textContent = item.unit || '個';

    this.quantityModal.classList.add('is-open');
  }

  /**
   * 数量調整モーダルを閉じる
   */
  closeQuantityModal() {
    this.quantityModal.classList.remove('is-open');
    this.currentQuantityId = null;
  }

  /**
   * 数量調整
   */
  adjustQuantity(delta) {
    if (!this.currentQuantityId) return;

    const success = storage.adjustQuantity(this.currentQuantityId, delta);
    if (success) {
      const item = storage.getItemById(this.currentQuantityId);
      this.currentQuantity.textContent = item.quantity;
      this.renderItems();
    }
  }

  /**
   * 通知モーダルを開く
   */
  openNotificationModal() {
    const settings = storage.getSettings();

    this.notificationEnabled.checked = settings.notifications.enabled;
    this.warningDays.value = settings.notifications.warningDays;
    this.dailyCheckTime.value = settings.notifications.dailyCheckTime;

    this.closeMenu();
    this.notificationModal.classList.add('is-open');
  }

  /**
   * 通知モーダルを閉じる
   */
  closeNotificationModal() {
    this.notificationModal.classList.remove('is-open');
  }

  /**
   * テスト通知
   */
  handleTestNotification() {
    notificationManager.sendTestNotification();
  }

  /**
   * 通知設定を保存
   */
  async handleSaveNotification() {
    const enabled = this.notificationEnabled.checked;

    // 通知を有効にする場合は許可を確認
    if (enabled && Notification.permission !== 'granted') {
      const permission = await notificationManager.requestPermission();
      if (permission !== 'granted') {
        this.notificationEnabled.checked = false;
        return;
      }
    }

    const settings = storage.getSettings();
    settings.notifications.enabled = enabled;
    settings.notifications.warningDays = parseInt(this.warningDays.value);
    settings.notifications.dailyCheckTime = this.dailyCheckTime.value;

    const success = storage.saveSettings(settings);
    if (success) {
      showToast('通知設定を保存しました', 3000, 'success');

      // 通知機能を再初期化
      notificationManager.stop();
      if (enabled) {
        notificationManager.init();
      }

      this.closeNotificationModal();
      this.renderItems(); // 警告日数が変更された場合に再描画
    }
  }

  /**
   * JSONエクスポート
   */
  handleExportJson() {
    const jsonData = storage.exportData();
    const filename = `備蓄品データ_${getCurrentDate()}.json`;
    downloadFile(jsonData, filename, 'application/json');
    showToast('データをエクスポートしました', 3000, 'success');
    this.closeMenu();
  }

  /**
   * JSONインポート
   */
  handleImportJson() {
    this.fileInput.click();
    this.closeMenu();
  }

  /**
   * ファイル選択時
   */
  handleFileSelected(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = storage.importData(event.target.result);
      if (result.success) {
        showToast(result.message, 3000, 'success');
        this.renderItems();
      } else {
        showToast(result.message, 3000, 'error');
      }
    };
    reader.onerror = () => {
      showToast('ファイルの読み込みに失敗しました', 3000, 'error');
    };
    reader.readAsText(file);

    // ファイル入力をリセット
    e.target.value = '';
  }

  /**
   * カレンダーエクスポート
   */
  handleExportCalendar() {
    const items = storage.getAllItems();
    calendarManager.exportToCalendar(items);
    this.closeMenu();
  }

  /**
   * アプリについて
   */
  handleAbout() {
    alert(
      '備蓄品管理システム v1.0\n\n' +
      '家庭用備蓄品の在庫を管理するPWAアプリです。\n\n' +
      '機能:\n' +
      '- 備蓄品の登録・編集・削除\n' +
      '- 賞味期限の管理と警告\n' +
      '- カテゴリ別フィルタリング\n' +
      '- データのエクスポート/インポート\n' +
      '- カレンダー連携\n' +
      '- プッシュ通知'
    );
    this.closeMenu();
  }
}

// アプリ起動
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new StockApp();
});
