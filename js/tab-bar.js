// タブバーナビゲーション

class TabBar {
  constructor() {
    this.currentTab = 'home';
    this.init();
  }

  init() {
    this.renderIcons();
    this.attachEventListeners();
    this.setActiveTab('home');
  }

  /**
   * タブバーアイコンを描画
   */
  renderIcons() {
    // ホームアイコン
    const iconHome = document.getElementById('iconHome');
    if (iconHome) {
      iconHome.innerHTML = createIcon('home', { size: 22, stroke: 1.6 });
    }

    // 在庫アイコン
    const iconList = document.getElementById('iconList');
    if (iconList) {
      iconList.innerHTML = createIcon('list', { size: 22, stroke: 1.6 });
    }

    // 追加アイコン（FAB）
    const iconPlus = document.getElementById('iconPlus');
    if (iconPlus) {
      iconPlus.innerHTML = createIcon('plus', { size: 22, color: 'white', stroke: 2.4 });
    }

    // カレンダーアイコン
    const iconCal = document.getElementById('iconCal');
    if (iconCal) {
      iconCal.innerHTML = createIcon('cal', { size: 22, stroke: 1.6 });
    }

    // 設定アイコン
    const iconCog = document.getElementById('iconCog');
    if (iconCog) {
      iconCog.innerHTML = createIcon('cog', { size: 22, stroke: 1.6 });
    }
  }

  /**
   * イベントリスナーを設定
   */
  attachEventListeners() {
    const tabItems = document.querySelectorAll('.tab-bar__item[data-tab]');
    tabItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.setActiveTab(tab);
      });
    });
  }

  /**
   * アクティブタブを設定
   * @param {string} tabId - タブID (home/list/cal/set)
   */
  setActiveTab(tabId) {
    this.currentTab = tabId;

    // 全てのタブから active 属性を削除
    const tabItems = document.querySelectorAll('.tab-bar__item[data-tab]');
    tabItems.forEach(item => {
      item.removeAttribute('data-active');
    });

    // 選択されたタブに active 属性を追加
    const activeTab = document.querySelector(`.tab-bar__item[data-tab="${tabId}"]`);
    if (activeTab) {
      activeTab.setAttribute('data-active', 'true');

      // アイコンの太さを更新
      const icon = activeTab.querySelector('.tab-bar__icon');
      if (icon) {
        this.updateIconStroke(icon, tabId, true);
      }
    }

    // 他のタブのアイコンも更新
    tabItems.forEach(item => {
      if (item.dataset.tab !== tabId) {
        const icon = item.querySelector('.tab-bar__icon');
        if (icon) {
          this.updateIconStroke(icon, item.dataset.tab, false);
        }
      }
    });

    // 画面切り替え
    this.switchScreen(tabId);
  }

  /**
   * 画面を切り替え
   * @param {string} tabId - タブID
   */
  switchScreen(tabId) {
    const screens = {
      home: document.getElementById('screenHome'),
      list: document.getElementById('screenList'),
      cal: null, // 未実装
      set: null  // 未実装
    };

    // 全ての画面を非表示
    Object.values(screens).forEach(screen => {
      if (screen) screen.style.display = 'none';
    });

    // 選択された画面を表示
    const targetScreen = screens[tabId];
    if (targetScreen) {
      targetScreen.style.display = 'block';

      // ホーム画面の場合はダッシュボードを更新
      if (tabId === 'home' && window.dashboard) {
        window.dashboard.update();
      }

      // 在庫一覧画面の場合はリストを更新
      if (tabId === 'list' && window.app) {
        window.app.renderItems();
      }
    } else {
      // 未実装の画面
      showToast(`${tabId}画面は準備中です`, 2000, 'info');
    }
  }

  /**
   * アイコンのストローク幅を更新
   * @param {HTMLElement} iconElement - アイコン要素
   * @param {string} iconName - アイコン名
   * @param {boolean} active - アクティブ状態
   */
  updateIconStroke(iconElement, iconName, active) {
    const iconNames = {
      home: 'home',
      list: 'list',
      cal: 'cal',
      set: 'cog',
    };

    const name = iconNames[iconName];
    if (!name) return;

    const stroke = active ? 2 : 1.6;
    iconElement.innerHTML = createIcon(name, { size: 22, stroke });
  }
}

// タブバーを初期化
let tabBar;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    tabBar = new TabBar();
  });
} else {
  tabBar = new TabBar();
}
