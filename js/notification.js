// 通知機能管理

class NotificationManager {
  constructor() {
    this.permission = 'default';
    this.checkInterval = null;
    this.lastCheckDate = null;
  }

  /**
   * 通知がサポートされているか確認
   * @returns {boolean} サポート状況
   */
  isSupported() {
    return 'Notification' in window;
  }

  /**
   * 通知許可をリクエスト
   * @returns {Promise<string>} 許可状態
   */
  async requestPermission() {
    if (!this.isSupported()) {
      showToast('このブラウザは通知をサポートしていません', 3000, 'error');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;

      if (permission === 'granted') {
        showToast('通知を許可しました', 3000, 'success');
      } else if (permission === 'denied') {
        showToast('通知が拒否されました', 3000, 'error');
      }

      return permission;
    } catch (error) {
      console.error('通知許可エラー:', error);
      return 'denied';
    }
  }

  /**
   * 通知を送信
   * @param {string} title - 通知タイトル
   * @param {Object} options - 通知オプション
   */
  sendNotification(title, options = {}) {
    if (!this.isSupported()) {
      console.warn('通知はサポートされていません');
      return;
    }

    if (Notification.permission !== 'granted') {
      console.warn('通知が許可されていません');
      return;
    }

    const defaultOptions = {
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'stock-expiry',
      renotify: false
    };

    try {
      const notification = new Notification(title, {
        ...defaultOptions,
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('通知送信エラー:', error);
    }
  }

  /**
   * 期限をチェックして通知
   * @param {Array} items - 備蓄品アイテム配列
   * @param {number} warningDays - 警告日数
   * @returns {number} 通知件数
   */
  checkAndNotify(items, warningDays = 30) {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return 0;
    }

    const today = getCurrentDate();

    // 1日1回のみチェック
    if (this.lastCheckDate === today) {
      return 0;
    }

    let notificationCount = 0;
    const expiredItems = [];
    const warningItems = [];

    items.forEach(item => {
      if (!item.expiryDate) return;

      const daysLeft = getDaysUntilExpiry(item.expiryDate);
      const status = getExpiryStatus(item.expiryDate, warningDays);

      if (status === 'expired') {
        expiredItems.push(item);
      } else if (status === 'warning') {
        // 特定の日数でのみ通知（30日前、7日前、当日）
        if (daysLeft === 30 || daysLeft === 7 || daysLeft === 0) {
          warningItems.push({ ...item, daysLeft });
        }
      }
    });

    // 期限切れアイテムの通知
    if (expiredItems.length > 0) {
      const itemNames = expiredItems.slice(0, 3).map(item => item.name).join('、');
      const suffix = expiredItems.length > 3 ? ` 他${expiredItems.length - 3}件` : '';

      this.sendNotification('備蓄品の賞味期限切れ', {
        body: `${itemNames}${suffix}の賞味期限が切れています`,
        tag: 'expired',
        requireInteraction: true
      });
      notificationCount++;
    }

    // 期限間近アイテムの通知
    warningItems.forEach(item => {
      const daysText = item.daysLeft === 0 ? '本日' :
                       item.daysLeft === 1 ? '明日' :
                       `${item.daysLeft}日後`;

      this.sendNotification('備蓄品の賞味期限が近づいています', {
        body: `${item.name}の賞味期限が${daysText}です`,
        tag: `warning-${item.id}`
      });
      notificationCount++;
    });

    this.lastCheckDate = today;
    return notificationCount;
  }

  /**
   * 定期チェックを開始
   * @param {string} time - チェック時刻（HH:MM形式）
   */
  scheduleDailyCheck(time = '09:00') {
    // 既存のインターバルをクリア
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // 次のチェック時刻を計算
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const nextCheck = new Date();
    nextCheck.setHours(hours, minutes, 0, 0);

    // 既に過ぎていたら明日に設定
    if (nextCheck <= now) {
      nextCheck.setDate(nextCheck.getDate() + 1);
    }

    const timeUntilCheck = nextCheck - now;

    // 初回チェックをスケジュール
    setTimeout(() => {
      this.performDailyCheck();

      // 以降は24時間ごとにチェック
      this.checkInterval = setInterval(() => {
        this.performDailyCheck();
      }, 24 * 60 * 60 * 1000);
    }, timeUntilCheck);

    console.log('定期チェック設定:', nextCheck.toLocaleString('ja-JP'));
  }

  /**
   * 日次チェックを実行
   */
  performDailyCheck() {
    const settings = storage.getSettings();
    if (!settings.notifications.enabled) {
      return;
    }

    const items = storage.getAllItems();
    const count = this.checkAndNotify(items, settings.notifications.warningDays);

    if (count > 0) {
      console.log(`${count}件の通知を送信しました`);
    }
  }

  /**
   * 通知機能を初期化
   */
  init() {
    if (!this.isSupported()) {
      console.warn('通知機能はサポートされていません');
      return;
    }

    this.permission = Notification.permission;

    // 設定を読み込んで定期チェック開始
    const settings = storage.getSettings();
    if (settings.notifications.enabled && this.permission === 'granted') {
      this.scheduleDailyCheck(settings.notifications.dailyCheckTime);
    }

    // アプリ起動時にもチェック
    if (settings.notifications.enabled && this.permission === 'granted') {
      // 少し遅延させてチェック
      setTimeout(() => {
        const items = storage.getAllItems();
        this.checkAndNotify(items, settings.notifications.warningDays);
      }, 1000);
    }
  }

  /**
   * 通知機能を停止
   */
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.lastCheckDate = null;
  }

  /**
   * テスト通知を送信
   */
  sendTestNotification() {
    if (!this.isSupported()) {
      showToast('通知はサポートされていません', 3000, 'error');
      return;
    }

    if (Notification.permission !== 'granted') {
      showToast('通知が許可されていません', 3000, 'error');
      return;
    }

    this.sendNotification('備蓄品管理システム', {
      body: 'テスト通知です。通知機能が正常に動作しています。',
      tag: 'test'
    });

    showToast('テスト通知を送信しました', 3000, 'success');
  }
}

// グローバルインスタンスを作成
const notificationManager = new NotificationManager();
