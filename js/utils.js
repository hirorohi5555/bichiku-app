// ユーティリティ関数群

/**
 * ユニークIDを生成
 * @returns {string} UUID v4形式の文字列
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 現在日付を取得（ISO形式）
 * @returns {string} YYYY-MM-DD形式の文字列
 */
function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * 日付を日本語形式に変換
 * @param {string} dateString - YYYY-MM-DD形式の日付文字列
 * @returns {string} YYYY年MM月DD日形式の文字列
 */
function formatDateJP(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 賞味期限までの残り日数を計算
 * @param {string} expiryDate - YYYY-MM-DD形式の賞味期限
 * @returns {number} 残り日数（マイナスは期限切れ）
 */
function getDaysUntilExpiry(expiryDate) {
  if (!expiryDate) return Infinity;
  const today = new Date(getCurrentDate() + 'T00:00:00');
  const expiry = new Date(expiryDate + 'T00:00:00');
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * 賞味期限のステータスを判定
 * @param {string} expiryDate - YYYY-MM-DD形式の賞味期限
 * @param {number} warningDays - 警告日数（デフォルト30日）
 * @returns {string} 'expired' | 'warning' | 'safe'
 */
function getExpiryStatus(expiryDate, warningDays = 30) {
  const daysLeft = getDaysUntilExpiry(expiryDate);
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= warningDays) return 'warning';
  return 'safe';
}

/**
 * トースト通知を表示
 * @param {string} message - 表示するメッセージ
 * @param {number} duration - 表示時間（ミリ秒）
 * @param {string} type - トーストタイプ（success, error, info）
 */
function showToast(message, duration = 3000, type = 'info') {
  // 既存のトーストを削除
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  // トースト要素を作成
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // アニメーション用にすぐに表示
  setTimeout(() => {
    toast.classList.add('toast--show');
  }, 10);

  // 指定時間後に非表示
  setTimeout(() => {
    toast.classList.remove('toast--show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

/**
 * 配列をソート
 * @param {Array} array - ソート対象の配列
 * @param {string} key - ソートキー
 * @param {string} order - 'asc' | 'desc'
 * @returns {Array} ソート済み配列
 */
function sortArray(array, key, order = 'asc') {
  return [...array].sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];

    // 日付の場合は特別処理
    if (key === 'expiryDate') {
      aVal = getDaysUntilExpiry(aVal);
      bVal = getDaysUntilExpiry(bVal);
    }

    // 文字列の場合は小文字で比較
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * カテゴリでフィルタリング
 * @param {Array} array - フィルタ対象の配列
 * @param {string} category - カテゴリ（'all'の場合は全て）
 * @returns {Array} フィルタ済み配列
 */
function filterByCategory(array, category) {
  if (category === 'all') return array;
  return array.filter(item => item.category === category);
}

/**
 * ファイルをダウンロード
 * @param {string} content - ファイル内容
 * @param {string} filename - ファイル名
 * @param {string} mimeType - MIMEタイプ
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * カテゴリの日本語名を取得
 * @param {string} category - カテゴリID
 * @returns {string} カテゴリの日本語名
 */
function getCategoryName(category) {
  const categories = {
    water: '飲料水',
    food: '食品',
    medical: '医薬品',
    hygiene: '衛生用品',
    battery: '電池・燃料',
    other: 'その他'
  };
  return categories[category] || category;
}

/**
 * デバウンス処理
 * @param {Function} func - 実行する関数
 * @param {number} wait - 待機時間（ミリ秒）
 * @returns {Function} デバウンス済み関数
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
