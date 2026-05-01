// 設定管理

class SettingsManager {
  constructor() {
    this.storage = storage; // StorageManagerのインスタンスを使用
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    this.loadSettings();
    this.attachEventListeners();
  }

  /**
   * 設定を読み込んでUIに反映
   */
  loadSettings() {
    const settings = this.storage.getSettings();

    // 通知設定
    const notificationEnabled = document.getElementById('settingNotificationEnabled');
    const warningDays = document.getElementById('settingWarningDays');
    const checkTime = document.getElementById('settingCheckTime');

    if (notificationEnabled) {
      notificationEnabled.checked = settings.notifications.enabled;
    }

    if (warningDays) {
      warningDays.value = settings.notifications.warningDays;
    }

    if (checkTime) {
      checkTime.value = settings.notifications.dailyCheckTime;
    }

    // 表示設定
    const defaultSort = document.getElementById('settingDefaultSort');
    const defaultFilter = document.getElementById('settingDefaultFilter');

    if (defaultSort) {
      defaultSort.value = settings.display.defaultSort;
    }

    if (defaultFilter) {
      defaultFilter.value = settings.display.defaultFilter;
    }
  }

  /**
   * イベントリスナーを設定
   */
  attachEventListeners() {
    // 通知設定
    const notificationEnabled = document.getElementById('settingNotificationEnabled');
    const warningDays = document.getElementById('settingWarningDays');
    const checkTime = document.getElementById('settingCheckTime');

    if (notificationEnabled) {
      notificationEnabled.addEventListener('change', () => this.saveNotificationSettings());
    }

    if (warningDays) {
      warningDays.addEventListener('change', () => this.saveNotificationSettings());
    }

    if (checkTime) {
      checkTime.addEventListener('change', () => this.saveNotificationSettings());
    }

    // 表示設定
    const defaultSort = document.getElementById('settingDefaultSort');
    const defaultFilter = document.getElementById('settingDefaultFilter');

    if (defaultSort) {
      defaultSort.addEventListener('change', () => this.saveDisplaySettings());
    }

    if (defaultFilter) {
      defaultFilter.addEventListener('change', () => this.saveDisplaySettings());
    }

    // データ管理ボタン
    const exportJsonBtn = document.getElementById('settingExportJson');
    const importJsonBtn = document.getElementById('settingImportJson');
    const clearDataBtn = document.getElementById('settingClearData');

    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', () => this.handleExportJson());
    }

    if (importJsonBtn) {
      importJsonBtn.addEventListener('click', () => this.handleImportJson());
    }

    if (clearDataBtn) {
      clearDataBtn.addEventListener('click', () => this.handleClearData());
    }

    // アプリ情報ボタン
    const helpBtn = document.getElementById('settingHelp');
    const feedbackBtn = document.getElementById('settingFeedback');

    if (helpBtn) {
      helpBtn.addEventListener('click', () => this.showHelp());
    }

    if (feedbackBtn) {
      feedbackBtn.addEventListener('click', () => this.sendFeedback());
    }
  }

  /**
   * 通知設定を保存
   */
  saveNotificationSettings() {
    const settings = this.storage.getSettings();

    const notificationEnabled = document.getElementById('settingNotificationEnabled');
    const warningDays = document.getElementById('settingWarningDays');
    const checkTime = document.getElementById('settingCheckTime');

    settings.notifications.enabled = notificationEnabled.checked;
    settings.notifications.warningDays = parseInt(warningDays.value);
    settings.notifications.dailyCheckTime = checkTime.value;

    this.storage.saveSettings(settings);
    showToast('通知設定を保存しました', 2000, 'success');

    // 通知権限をリクエスト（有効にした場合）
    if (notificationEnabled.checked && window.notificationManager) {
      window.notificationManager.requestPermission();
    }

    // アプリを再初期化（設定を反映）
    if (window.app) {
      window.app.init();
    }

    // ダッシュボードを更新
    if (window.dashboard) {
      window.dashboard.update();
    }
  }

  /**
   * 表示設定を保存
   */
  saveDisplaySettings() {
    const settings = this.storage.getSettings();

    const defaultSort = document.getElementById('settingDefaultSort');
    const defaultFilter = document.getElementById('settingDefaultFilter');

    settings.display.defaultSort = defaultSort.value;
    settings.display.defaultFilter = defaultFilter.value;

    this.storage.saveSettings(settings);
    showToast('表示設定を保存しました', 2000, 'success');

    // 在庫一覧を更新
    if (window.app) {
      const sortBy = document.getElementById('sortBy');
      const categoryFilter = document.getElementById('categoryFilter');

      if (sortBy) {
        sortBy.value = defaultSort.value;
      }

      if (categoryFilter) {
        categoryFilter.value = defaultFilter.value;
      }

      window.app.renderItems();
    }
  }

  /**
   * JSONエクスポート
   */
  handleExportJson() {
    const data = this.storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `stockmg-backup-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('データをエクスポートしました', 2000, 'success');
  }

  /**
   * JSONインポート
   */
  handleImportJson() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput) return;

    fileInput.click();

    // 既存のイベントリスナーを削除
    const newFileInput = fileInput.cloneNode(true);
    fileInput.parentNode.replaceChild(newFileInput, fileInput);

    // 新しいイベントリスナーを追加
    newFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = event.target.result;
          const success = this.storage.importData(jsonData);

          if (success) {
            showToast('データをインポートしました', 2000, 'success');

            // アプリを再初期化
            if (window.app) {
              window.app.init();
            }

            // ダッシュボードを更新
            if (window.dashboard) {
              window.dashboard.update();
            }

            // 設定を再読み込み
            this.loadSettings();
          } else {
            showToast('データのインポートに失敗しました', 3000, 'error');
          }
        } catch (error) {
          console.error('Import error:', error);
          showToast('無効なJSONファイルです', 3000, 'error');
        }
      };

      reader.readAsText(file);
      newFileInput.value = '';
    });
  }

  /**
   * 全データ削除
   */
  handleClearData() {
    if (!confirm('本当にすべてのデータを削除しますか？\nこの操作は取り消せません。')) {
      return;
    }

    if (!confirm('最終確認: すべての備蓄品データ、履歴、設定が削除されます。\n続行しますか？')) {
      return;
    }

    // すべてのデータを削除
    localStorage.removeItem('stockpile.items');
    localStorage.removeItem('stockpile.history');
    localStorage.removeItem('stockpile.settings');

    showToast('すべてのデータを削除しました', 2000, 'success');

    // アプリを再初期化
    setTimeout(() => {
      if (window.app) {
        window.app.init();
      }

      if (window.dashboard) {
        window.dashboard.update();
      }

      // 設定を再読み込み
      this.loadSettings();
    }, 500);
  }

  /**
   * 使い方を表示
   */
  showHelp() {
    const helpText = `
📱 StockMG - 使い方ガイド

【基本操作】
・備蓄品の追加: 下部の「追加」ボタンをタップ
・編集: アイテムカードの鉛筆アイコンをタップ
・削除: アイテムカードのゴミ箱アイコンをタップ
・数量調整: アイテムカードの±ボタンをタップ

【画面の説明】
・ホーム: 期限が近い品目を確認
・在庫: すべての備蓄品を一覧表示
・カレンダー: 賞味期限をカレンダーで確認
・設定: アプリの設定を変更

【通知機能】
設定で「通知を有効にする」をONにすると、
賞味期限が近づいたら自動で通知されます。

【データのバックアップ】
設定 → JSONエクスポート でデータを保存できます。
定期的にバックアップすることをおすすめします。
    `;

    alert(helpText.trim());
  }

  /**
   * フィードバック送信
   */
  sendFeedback() {
    const message = `
StockMGへのフィードバックをお願いします！

改善要望やバグ報告は、以下のGitHub Issuesページで受け付けています。

GitHub Issues:
https://github.com/hirorohi5555/bichiku-app/issues

または、アプリ内で気づいた点をメモしておいて、
後でご報告いただけると幸いです。
    `;

    if (confirm(message.trim() + '\n\nGitHub Issuesを開きますか？')) {
      window.open('https://github.com/hirorohi5555/bichiku-app/issues', '_blank');
    }
  }
}

// 設定マネージャーを初期化
let settingsManager;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    settingsManager = new SettingsManager();
  });
} else {
  settingsManager = new SettingsManager();
}
