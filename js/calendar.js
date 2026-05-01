// カレンダー連携機能

class CalendarManager {
  /**
   * iCalendar形式の日付をフォーマット
   * @param {string} dateString - YYYY-MM-DD形式の日付
   * @returns {string} YYYYMMDDフォーマット
   */
  formatICSDate(dateString) {
    return dateString.replace(/-/g, '');
  }

  /**
   * iCalendar形式のタイムスタンプを生成
   * @returns {string} YYYYMMDDTHHMMSSZフォーマット
   */
  getICSTimestamp() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  }

  /**
   * リマインダー日付を計算（7日前）
   * @param {string} dateString - YYYY-MM-DD形式の日付
   * @returns {string} YYYYMMDDフォーマット
   */
  getReminderDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    date.setDate(date.getDate() - 7);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  /**
   * iCalendar形式の文字列をエスケープ
   * @param {string} text - エスケープする文字列
   * @returns {string} エスケープ済み文字列
   */
  escapeICSText(text) {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  }

  /**
   * アイテムからiCalendarイベントを生成
   * @param {Object} item - 備蓄品アイテム
   * @returns {string} iCalendarイベント文字列
   */
  generateEvent(item) {
    const uid = `${item.id}@stock-management-app`;
    const timestamp = this.getICSTimestamp();
    const eventDate = this.formatICSDate(item.expiryDate);
    const reminderDate = this.getReminderDate(item.expiryDate);
    const summary = this.escapeICSText(`【備蓄品】${item.name} 賞味期限`);
    const description = this.escapeICSText(
      `品名: ${item.name}\n` +
      `カテゴリ: ${getCategoryName(item.category)}\n` +
      `数量: ${item.quantity}${item.unit || '個'}\n` +
      `賞味期限: ${formatDateJP(item.expiryDate)}\n` +
      (item.location ? `保管場所: ${item.location}\n` : '') +
      (item.notes ? `メモ: ${item.notes}` : '')
    );

    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${timestamp}`,
      `DTSTART;VALUE=DATE:${eventDate}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${summary}`,
      `TRIGGER;VALUE=DATE-TIME:${reminderDate}T090000`,
      'END:VALARM',
      'END:VEVENT'
    ].join('\r\n');
  }

  /**
   * iCalendar形式のファイルを生成
   * @param {Array} items - 備蓄品アイテム配列
   * @returns {string} iCalendar形式の文字列
   */
  generateICS(items) {
    const events = items
      .filter(item => item.expiryDate)
      .map(item => this.generateEvent(item))
      .join('\r\n');

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Stock Management App//JP',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:備蓄品賞味期限',
      'X-WR-TIMEZONE:Asia/Tokyo',
      'X-WR-CALDESC:家庭用備蓄品の賞味期限カレンダー',
      events,
      'END:VCALENDAR'
    ].join('\r\n');
  }

  /**
   * カレンダーにエクスポート
   * @param {Array} items - 備蓄品アイテム配列
   */
  exportToCalendar(items) {
    if (!items || items.length === 0) {
      showToast('エクスポートするアイテムがありません', 3000, 'error');
      return;
    }

    const itemsWithExpiry = items.filter(item => item.expiryDate);
    if (itemsWithExpiry.length === 0) {
      showToast('賞味期限が設定されたアイテムがありません', 3000, 'error');
      return;
    }

    const icsContent = this.generateICS(itemsWithExpiry);
    const filename = `備蓄品賞味期限_${getCurrentDate()}.ics`;

    downloadFile(icsContent, filename, 'text/calendar;charset=utf-8');
    showToast(`${itemsWithExpiry.length}件のアイテムをエクスポートしました`, 3000, 'success');
  }

  /**
   * 単一アイテムをエクスポート
   * @param {Object} item - 備蓄品アイテム
   */
  exportSingleItem(item) {
    if (!item.expiryDate) {
      showToast('賞味期限が設定されていません', 3000, 'error');
      return;
    }

    const icsContent = this.generateICS([item]);
    const filename = `${item.name}_賞味期限_${getCurrentDate()}.ics`;

    downloadFile(icsContent, filename, 'text/calendar;charset=utf-8');
    showToast('カレンダーファイルを作成しました', 3000, 'success');
  }
}

// グローバルインスタンスを作成
const calendarManager = new CalendarManager();
