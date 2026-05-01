// Service Worker - キャッシュとオフライン対応

const CACHE_NAME = 'stock-management-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/app.js',
  './js/utils.js',
  './js/storage.js',
  './js/icons.js',
  './js/dashboard.js',
  './js/tab-bar.js',
  './js/calendar.js',
  './js/notification.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

/**
 * インストール時の処理
 * 必要なファイルをキャッシュに保存
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('[Service Worker] Installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

/**
 * アクティベート時の処理
 * 古いキャッシュを削除
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activated successfully');
        return self.clients.claim();
      })
  );
});

/**
 * フェッチ時の処理
 * キャッシュファースト戦略
 */
self.addEventListener('fetch', (event) => {
  // HTTPまたはHTTPSリクエストのみ処理
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // キャッシュがあればそれを返す
        if (cachedResponse) {
          return cachedResponse;
        }

        // キャッシュになければネットワークから取得
        return fetch(event.request)
          .then((response) => {
            // 有効なレスポンスでない場合はそのまま返す
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // レスポンスをクローンしてキャッシュに保存
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch failed:', error);

            // オフライン時のフォールバック
            // HTMLページの場合はindex.htmlを返す
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('./index.html');
            }
          });
      })
  );
});

/**
 * プッシュ通知受信時の処理
 */
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');

  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: event.data.text() };
    }
  }

  const title = data.title || '備蓄品管理システム';
  const options = {
    body: data.body || '新しい通知があります',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    vibrate: [200, 100, 200],
    data: data.url || './',
    tag: data.tag || 'notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

/**
 * 通知クリック時の処理
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // 既に開いているウィンドウがあればフォーカス
        for (let client of clientList) {
          if (client.url === event.notification.data && 'focus' in client) {
            return client.focus();
          }
        }

        // なければ新しいウィンドウを開く
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data || './');
        }
      })
  );
});

/**
 * メッセージ受信時の処理
 * メインスレッドからのメッセージを処理
 */
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

/**
 * バックグラウンド同期
 * 注: iOSではサポートされていない
 */
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Sync event:', event.tag);

    if (event.tag === 'sync-data') {
      event.waitUntil(
        // 同期処理をここに実装
        Promise.resolve()
      );
    }
  });
}

console.log('[Service Worker] Loaded');
