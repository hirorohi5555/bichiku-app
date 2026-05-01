// localStorage管理クラス

class StorageManager {
  constructor() {
    this.ITEMS_KEY = 'stockpile.items';
    this.HISTORY_KEY = 'stockpile.history';
    this.SETTINGS_KEY = 'stockpile.settings';

    // 旧キーからの移行
    this.OLD_ITEMS_KEY = 'stockItems';
    this.OLD_SETTINGS_KEY = 'appSettings';

    this.initializeStorage();
  }

  /**
   * ストレージ初期化
   */
  initializeStorage() {
    // 旧データからの移行
    this.migrateOldData();

    // データがない場合は初期化
    if (!localStorage.getItem(this.ITEMS_KEY)) {
      this.saveItems([]);
    }
    if (!localStorage.getItem(this.HISTORY_KEY)) {
      this.saveHistory([]);
    }
    if (!localStorage.getItem(this.SETTINGS_KEY)) {
      this.saveSettings(this.getDefaultSettings());
    }
  }

  /**
   * 旧データを新形式に移行
   */
  migrateOldData() {
    // 旧アイテムデータの移行
    const oldItems = localStorage.getItem(this.OLD_ITEMS_KEY);
    if (oldItems && !localStorage.getItem(this.ITEMS_KEY)) {
      try {
        const items = JSON.parse(oldItems);
        // データ構造を変換
        const migratedItems = items.map(item => this.migrateItemFormat(item));
        localStorage.setItem(this.ITEMS_KEY, JSON.stringify(migratedItems));
        console.log('アイテムデータを移行しました');
      } catch (e) {
        console.error('アイテム移行エラー:', e);
      }
    }

    // 旧設定データの移行
    const oldSettings = localStorage.getItem(this.OLD_SETTINGS_KEY);
    if (oldSettings && !localStorage.getItem(this.SETTINGS_KEY)) {
      try {
        const settings = JSON.parse(oldSettings);
        const migratedSettings = this.migrateSettingsFormat(settings);
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(migratedSettings));
        console.log('設定データを移行しました');
      } catch (e) {
        console.error('設定移行エラー:', e);
      }
    }
  }

  /**
   * アイテムデータを新形式に変換
   */
  migrateItemFormat(oldItem) {
    return {
      id: oldItem.id,
      name: oldItem.name,
      cat: this.migrateCategoryName(oldItem.category),
      qty: oldItem.quantity || 0,
      unit: oldItem.unit || '個',
      exp: oldItem.expiryDate || null,
      note: [oldItem.location, oldItem.notes].filter(Boolean).join(' - ') || undefined,
      createdAt: oldItem.registeredDate || getCurrentDate(),
      updatedAt: oldItem.lastUpdated || getCurrentDate()
    };
  }

  /**
   * カテゴリ名を英語から日本語に変換
   */
  migrateCategoryName(oldCategory) {
    const categoryMap = {
      water: '飲料',
      food: '食品',
      medical: '医薬品',
      hygiene: '日用品',
      battery: '日用品',
      other: 'その他'
    };
    return categoryMap[oldCategory] || oldCategory;
  }

  /**
   * 設定データを新形式に変換
   */
  migrateSettingsFormat(oldSettings) {
    return {
      notifications: {
        enabled: oldSettings.notifications?.enabled || false,
        timings: {
          d60: true,
          d30: true,
          d7: true,
          d0: true
        },
        time: oldSettings.notifications?.dailyCheckTime || '09:00',
        banner: true,
        sound: true
      },
      warningThresholdDays: oldSettings.notifications?.warningDays || 30,
      display: oldSettings.display || {
        defaultSort: 'expiryDate',
        defaultFilter: 'all'
      }
    };
  }

  /**
   * デフォルト設定を取得
   * @returns {Object} デフォルト設定
   */
  getDefaultSettings() {
    return {
      notifications: {
        enabled: false,
        timings: {
          d60: true,
          d30: true,
          d7: true,
          d0: true
        },
        time: '09:00',
        banner: true,
        sound: true
      },
      warningThresholdDays: 30,
      display: {
        defaultSort: 'exp',
        defaultFilter: 'all'
      }
    };
  }

  /**
   * 全アイテムを取得
   * @returns {Array} アイテム配列
   */
  getAllItems() {
    try {
      const data = localStorage.getItem(this.ITEMS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('アイテム取得エラー:', error);
      return [];
    }
  }

  /**
   * アイテムを保存
   * @param {Array} items - アイテム配列
   * @returns {boolean} 成功/失敗
   */
  saveItems(items) {
    try {
      localStorage.setItem(this.ITEMS_KEY, JSON.stringify(items));
      return true;
    } catch (error) {
      console.error('アイテム保存エラー:', error);
      if (error.name === 'QuotaExceededError') {
        showToast('ストレージ容量が不足しています', 3000, 'error');
      }
      return false;
    }
  }

  /**
   * アイテムを追加
   * @param {Object} item - 追加するアイテム（新形式: cat, qty, exp, note等）
   * @returns {Object|null} 追加されたアイテムまたはnull
   */
  addItem(item) {
    try {
      const items = this.getAllItems();
      const newItem = {
        id: generateUUID(),
        name: item.name,
        cat: item.cat || item.category || '食品',
        qty: item.qty || item.quantity || 0,
        unit: item.unit || '個',
        exp: item.exp || item.expiryDate || null,
        note: item.note || [item.location, item.notes].filter(Boolean).join(' - ') || undefined,
        createdAt: getCurrentDate(),
        updatedAt: getCurrentDate()
      };
      items.push(newItem);
      const success = this.saveItems(items);

      // 履歴に登録
      if (success) {
        this.addHistory({
          itemId: newItem.id,
          date: getCurrentDate(),
          action: '登録',
          delta: newItem.qty
        });
      }

      return success ? newItem : null;
    } catch (error) {
      console.error('アイテム追加エラー:', error);
      return null;
    }
  }

  /**
   * アイテムを更新
   * @param {string} id - アイテムID
   * @param {Object} updates - 更新内容
   * @returns {boolean} 成功/失敗
   */
  updateItem(id, updates) {
    try {
      const items = this.getAllItems();
      const index = items.findIndex(item => item.id === id);
      if (index === -1) {
        console.error('アイテムが見つかりません:', id);
        return false;
      }
      items[index] = {
        ...items[index],
        ...updates,
        updatedAt: getCurrentDate()
      };
      return this.saveItems(items);
    } catch (error) {
      console.error('アイテム更新エラー:', error);
      return false;
    }
  }

  /**
   * アイテムを削除
   * @param {string} id - アイテムID
   * @returns {boolean} 成功/失敗
   */
  deleteItem(id) {
    try {
      const items = this.getAllItems();
      const filtered = items.filter(item => item.id !== id);
      if (filtered.length === items.length) {
        console.error('削除対象が見つかりません:', id);
        return false;
      }
      return this.saveItems(filtered);
    } catch (error) {
      console.error('アイテム削除エラー:', error);
      return false;
    }
  }

  /**
   * IDでアイテムを検索
   * @param {string} id - アイテムID
   * @returns {Object|null} 見つかったアイテムまたはnull
   */
  getItemById(id) {
    const items = this.getAllItems();
    return items.find(item => item.id === id) || null;
  }

  /**
   * 設定を取得
   * @returns {Object} 設定オブジェクト
   */
  getSettings() {
    try {
      const data = localStorage.getItem(this.SETTINGS_KEY);
      return data ? JSON.parse(data) : this.getDefaultSettings();
    } catch (error) {
      console.error('設定取得エラー:', error);
      return this.getDefaultSettings();
    }
  }

  /**
   * 設定を保存
   * @param {Object} settings - 設定オブジェクト
   * @returns {boolean} 成功/失敗
   */
  saveSettings(settings) {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('設定保存エラー:', error);
      return false;
    }
  }

  /**
   * データをJSON形式でエクスポート
   * @returns {string} JSON文字列
   */
  exportData() {
    const data = {
      items: this.getAllItems(),
      settings: this.getSettings(),
      exportDate: getCurrentDate(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * JSONデータをインポート
   * @param {string} jsonString - JSON文字列
   * @returns {Object} 成功/失敗と詳細
   */
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);

      // データ検証
      if (!data.items || !Array.isArray(data.items)) {
        throw new Error('無効なデータ形式です');
      }

      // アイテムのバリデーション
      const validItems = data.items.filter(item => {
        return item.name &&
               item.category &&
               typeof item.quantity === 'number' &&
               item.quantity >= 0;
      });

      if (validItems.length === 0) {
        throw new Error('有効なアイテムが見つかりません');
      }

      // 確認メッセージ
      const confirmed = confirm(
        `${validItems.length}件のアイテムをインポートします。\n既存のデータは上書きされますが、よろしいですか？`
      );

      if (!confirmed) {
        return { success: false, message: 'キャンセルされました' };
      }

      // インポート実行
      const itemsSaved = this.saveItems(validItems);

      // 設定もインポート（存在する場合）
      if (data.settings) {
        this.saveSettings({ ...this.getDefaultSettings(), ...data.settings });
      }

      return {
        success: itemsSaved,
        message: `${validItems.length}件のアイテムをインポートしました`,
        imported: validItems.length,
        skipped: data.items.length - validItems.length
      };
    } catch (error) {
      console.error('インポートエラー:', error);
      return {
        success: false,
        message: `インポート失敗: ${error.message}`
      };
    }
  }

  /**
   * 数量を調整
   * @param {string} id - アイテムID
   * @param {number} delta - 増減値（正=増加、負=減少）
   * @param {string} actionLabel - アクション名（'使用' | '補充'）
   * @returns {boolean} 成功/失敗
   */
  adjustQuantity(id, delta, actionLabel = null) {
    const item = this.getItemById(id);
    if (!item) return false;

    const oldQty = item.qty || item.quantity || 0;
    const newQuantity = Math.max(0, oldQty + delta);
    const success = this.updateItem(id, { qty: newQuantity });

    // 履歴に記録
    if (success && delta !== 0) {
      const action = delta > 0 ? '補充' : '使用';
      this.addHistory({
        itemId: id,
        date: getCurrentDate(),
        action: actionLabel || action,
        delta: delta
      });
    }

    return success;
  }

  /**
   * 履歴を取得
   * @returns {Array} 履歴配列
   */
  getHistory() {
    try {
      const data = localStorage.getItem(this.HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('履歴取得エラー:', error);
      return [];
    }
  }

  /**
   * 履歴を保存
   * @param {Array} history - 履歴配列
   * @returns {boolean} 成功/失敗
   */
  saveHistory(history) {
    try {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
      return true;
    } catch (error) {
      console.error('履歴保存エラー:', error);
      return false;
    }
  }

  /**
   * 履歴エントリを追加
   * @param {Object} entry - 履歴エントリ { itemId, date, action, delta, by? }
   * @returns {boolean} 成功/失敗
   */
  addHistory(entry) {
    try {
      const history = this.getHistory();
      history.push(entry);
      // 最新1000件のみ保持
      if (history.length > 1000) {
        history.splice(0, history.length - 1000);
      }
      return this.saveHistory(history);
    } catch (error) {
      console.error('履歴追加エラー:', error);
      return false;
    }
  }

  /**
   * アイテムの履歴を取得
   * @param {string} itemId - アイテムID
   * @returns {Array} 該当アイテムの履歴
   */
  getItemHistory(itemId) {
    const history = this.getHistory();
    return history.filter(entry => entry.itemId === itemId)
                  .sort((a, b) => b.date.localeCompare(a.date)); // 新しい順
  }

  /**
   * 全データをクリア（デバッグ用）
   */
  clearAll() {
    if (confirm('全てのデータを削除しますか？この操作は取り消せません。')) {
      localStorage.removeItem(this.ITEMS_KEY);
      localStorage.removeItem(this.HISTORY_KEY);
      localStorage.removeItem(this.SETTINGS_KEY);
      // 旧データも削除
      localStorage.removeItem(this.OLD_ITEMS_KEY);
      localStorage.removeItem(this.OLD_SETTINGS_KEY);
      this.initializeStorage();
      return true;
    }
    return false;
  }
}

// グローバルインスタンスを作成
const storage = new StorageManager();
