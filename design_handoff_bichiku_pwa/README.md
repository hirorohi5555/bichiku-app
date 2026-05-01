# Handoff: 家庭用備蓄品 在庫管理 PWA（備蓄管理）

## Overview
iPhoneのホーム画面に追加して使う、家庭用備蓄品の在庫管理 PWA（Progressive Web App）。3〜4人家族の防災備蓄を主な想定ユーザーとし、賞味期限の自動チェック・通知・カレンダー連携・JSONバックアップを核機能とする。緊急時でもオフラインで動作することを前提に設計。

## About the Design Files
このバンドルに含まれる HTML / JSX ファイルは **デザインリファレンス** であり、本番コードとしてそのまま使うものではありません。タスクは、ここで示された画面レイアウトと振る舞いを **対象コードベースの既存環境**（React / Vue / SwiftUI / ネイティブなど）でその設計パターンに従って再現すること。コードベースが未着手の場合は、プロジェクト要件（PWA対応、localStorage、Service Worker、Web Notification API）を踏まえて適切なスタックを選定し、そのうえで本デザインを実装すること。

要件定義書（プロジェクト概要）には3フェーズ構成が示されています：
- **フェーズ1（MVP）**：基本登録・一覧・期限警告・使用補充記録・JSONエクスポート/インポート・PWA対応・通知・.icsエクスポート
- **フェーズ2**：入力簡易化（バーコード・テンプレート・クイック日付・カテゴリ自動推測）
- **フェーズ3**：音声入力・OCR・統計レポート・買い物リスト

本ハンドオフのデザインは主にフェーズ1の主要画面を網羅し、フェーズ2の入力支援エントリポイントもUI上に用意されています。

## Fidelity
**High-fidelity (hifi)**。最終的な配色・タイポグラフィ・スペーシング・ステータス階層が決定済み。開発者はコードベースの既存ライブラリ・パターンを使ってこのUIをピクセル単位で再現してください。色値・フォントサイズ・余白・角丸はすべて下記「Design Tokens」セクションの値を採用してください。

## Screens / Views

iPhone 14 Pro 相当（390×844pt）を基準とした8画面構成。下タブナビゲーション（ホーム / 在庫 / 追加 / カレンダー / 設定）でコア4画面にアクセス。「追加」ボタンは中央に円形フローティング、ブランドアクセント色で強調。

### 01. ホーム / ダッシュボード（`screens/home.jsx`）
**目的**：起動直後に「いま要対応な備蓄」を一目で把握。

**レイアウト**：縦スクロール、上から
1. **ラージタイトルヘッダ**：「備蓄管理」（28px / 700）+ サブテキスト「2026年5月1日（金）」（13px / 500 / ink-2）+ 右側に通知ベルアイコン（赤バッジ付き）
2. **ヒーローステータスカード**（border-radius 16px、白〜薄グレーの縦グラデ、0.5px 罫線）：
   - 巨大数値（56px JetBrains Mono / 600 / danger色）= 期限切れ件数 + 7日以内件数
   - 「件 要対応」ラベル
   - 内訳テキスト「期限切れ X件 ・ 7日以内 X件 ・ 30日以内 X件」（12px / ink-2）
   - 4色スタックバー（高さ6px、border-radius 3px）：danger / warn / ok / 未分類の比率を表示
3. **カテゴリ別在庫**（2x2グリッド）：食品・飲料・日用品・医薬品 各カテゴリで品目数・総個数・警告件数を表示。各タイルにCatChip（カテゴリ別の色付きアイコン）
4. **期限が近い品目**：上位5件、Cardコンテナ（白、border-radius 14px）、左にCatChip、右にDaysPill + StatusBadge
5. **クイックアクション**（2列）：「備蓄品を追加」（accent-soft 背景）/「カレンダー出力」（白）

### 02. 在庫一覧（`screens/inventory.jsx`）
**目的**：全備蓄品をフィルタ・ソートして閲覧。

**レイアウト**：
1. ラージタイトル「在庫一覧」+ サブ「N品目 · 期限が近い順」+ 右に検索・フィルタアイコン
2. **カテゴリチップ行**：横スクロール、選択中は ink 黒背景・白文字、非選択は line-2 背景・ink-2文字（角丸 16px、padding 6px 14px）
3. **ソートバー**：「N件 表示中」「賞味期限順 ⌄」（11-12px）
4. **アイテムカードリスト**（縦並び、gap 8px）：
   - 各カードは白背景・border-radius 12px・**左ボーダー3px**でステータス色を表示
   - 構成：CatChip(36px) + 品名(14px / 600) + メタ情報行（数量・カテゴリ・期限日）+ 右側にDaysPill + StatusBadge

### 03. 備蓄品の追加（`screens/add.jsx`）
**目的**：新規アイテムを登録。

**レイアウト**（モーダル風、TopBarに「キャンセル」「保存」配置）：
1. **入力支援ショートカット行**（フェーズ2準備）：「バーコード」「期限OCR」「音声」を破線ボーダーカードで横3分割
2. **基本情報フォーム**（白カード、行区切り 0.5px）：品名 / カテゴリ / 保管場所 / メモ。各行は左ラベル78px固定、フォーカス中フィールドにキャレット表示
3. **数量セクション**：大きな数字（32px Mono / 600）+ 単位 + 円形 ± ボタン（-：danger-soft、+：accent primary）
4. **賞味期限セクション**：日付表示（18px Mono）+ クイック日付チップ（3ヶ月後/6ヶ月後/1年後/3年後）。選択中はaccent-soft背景
5. **リマインダー**：「期限が近づいたら通知」「カレンダーに追加」のトグル行

### 04. 詳細 / 使用・補充（`screens/detail.jsx`）
**目的**：単一アイテムの状態確認、数量増減、履歴閲覧。

**レイアウト**：
1. **ヒーローカード**：CatChip(56px) + 品名(19px / 700) + カテゴリ・場所(12px) + ステータスバッジ(lg)。下段に3つのStatTile（数量 / 残り日数 / 期限日）
2. **使用 / 補充カード**：見出し + 中央寄せの大きな数量（36px Mono）を 円形 -/+ ボタンで挟む構成
3. **カレンダー追加バナー**：accent-soft 背景、カレンダーアイコン + 「カレンダーに追加」+ シェブロン
4. **履歴リスト**：使用（赤−）/ 補充（緑+）/ 登録（青+）を色付き円アイコンで区別、右端にデルタ値（Mono / 600）

### 05. カレンダー連携（`screens/calendar.jsx`）
**目的**：賞味期限を iPhone 標準カレンダー / リマインダーへ書き出し。

**レイアウト**：
1. **エクスポートヒーロー**：accent系の薄グラデーション背景カード、カレンダーアイコン + 説明 + 大きな「すべて書き出し（N件）」ボタン（accent primary、ダウンロードアイコン付き）
2. **品目ごとに書き出すセクション**：補足「下の『.ics』ボタンで、その品目1件だけをカレンダーに追加できます」
3. **月別グルーピング**：YYYY年MM月見出し + 各月のCard
   - 各行：日付ボックス（曜日 + 日。日の数字はステータス色で表示）+ CatChip + 品名 + 数量 + 「.ics」ラベル付きボタン

### 06. 通知設定（`screens/notifications.jsx`）
**目的**：プッシュ通知の権限・タイミング・時刻を制御。

**レイアウト**：
1. **権限ステータスカード**：チェックアイコン + 「通知が有効です」+ 補足「Web Notification API · Service Worker 稼働中」
2. **通知トグル群**：プッシュ通知 / バナーで表示 / サウンド
3. **通知タイミング**：60日前 / 30日前 / 7日前 / 当日（各サブテキスト付き）
4. **通知時刻**：時計アイコン + 「毎日の通知時刻」+ 「09:00」（18px Mono / accent）
5. **プレビュー**：iOS バナー風（白半透明 + backdrop-filter blur(20px)、0.5px ボーダー）、左にアイコンタイル、右に「備蓄管理」「賞味期限が近い品目があります」「経口補水液が…」

### 07. データ管理（`screens/data.jsx`）
**目的**：JSONバックアップ・.icsエクスポート・JSONインポート。

**レイアウト**：
1. **ストレージサマリ**：localStorage 使用量（22px Mono）+ 登録品目数 + 細い使用率バー
2. **エクスポート**：JSON書き出し / .ics の2行リスト（accent-softアイコンタイル + タイトル + ファイル名サブ + シェブロン）
3. **インポート**：破線ボーダー大カード（44px円アイコン + タイトル + 補足）
4. **プレビュー**：黒背景のJSONコードプレビュー（10px Mono、シンタックスハイライト風カラー）

### 08. オンボーディング（`screens/onboarding.jsx`）
**目的**：初回起動時の機能紹介とホーム画面追加への誘導。

**レイアウト**：
1. **ヒーローイラスト**：SVGの抽象的な棚（3段の棚に色付き矩形が並ぶ）+ accentの+ アイコン
2. **見出し**：「家族の備蓄を、すぐに把握。」（26px / 700 / 中央寄せ、2行）
3. **特長リスト**（4項目）：色で一目 / 自動で通知 / カレンダー連携 / ホーム画面に追加
4. **CTA**：「はじめる」（accent primary、ボックスシャドウ付き）+ サブリンク「JSONから復元」

## Interactions & Behavior

### ナビゲーション
- 下タブの 4 アイテム（ホーム / 在庫 / カレンダー / 設定）+ 中央 FAB（追加）
- 詳細 / 追加 / 通知設定はモーダルプッシュ遷移（左に「戻る」または「キャンセル」）
- カードタップでアイテム詳細へ遷移

### ステータス計算ロジック
今日と賞味期限の差分日数で判定：
```
days < 0          → expired (赤)
0 ≤ days ≤ 7      → urgent  (黄/橙、強調)
7 < days ≤ 30     → warn    (黄)
days > 30         → ok      (緑)
exp === null      → none    (灰、「期限なし」表示)
```
警告閾値（30日）はユーザー設定可能にする想定。

### 数量増減
- 詳細画面の +/- ボタン押下で `qty` を 1 単位で増減
- 履歴に `{ date, action: '使用'|'補充', delta, by? }` を追加
- `qty` が 0 になっても削除はせず、ユーザー確認後に削除

### 通知
- Service Worker でバックグラウンド定期実行（Periodic Background Sync または `setInterval`）
- ユーザー設定の通知時刻（デフォルト 9:00）に対象品目を集計し、`Notification` API でローカル通知
- タイミング閾値は複数オン可（60日前 / 30日前 / 7日前 / 当日）

### .ics エクスポート
- 一括：全アイテムを単一 `.ics` ファイルとして生成（VEVENT を品目ごと、DTSTART は賞味期限日、SUMMARY は「[備蓄] 品名」、DESCRIPTION に数量・カテゴリ・場所、VALARM で 7 日前リマインダー）
- 個別：各アイテムの `.ics` ボタンタップで単一 VEVENT のファイルをダウンロード/共有

### JSON エクスポート / インポート
- エクスポート：`{ version: '1.0', exportedAt: ISO8601, items: [...] }` を `.json` でダウンロード
- インポート：ファイル選択 → バリデーション → 確認ダイアログ（マージ or 上書き）→ localStorage 反映

### アニメーション
- ボタンタップ：`active:scale(0.97)` + `transition: transform 100ms`
- カード遷移：iOS標準のpush/pop（slide）
- 数量増減：数字に短い flip / fade（150ms）

## State Management

### Items（メインデータ）
```ts
type Item = {
  id: string;            // ULID 推奨
  name: string;
  cat: '食品' | '飲料' | '日用品' | '医薬品' | string;  // ユーザー追加可
  qty: number;
  unit: string;          // '本' | '袋' | '個' など自由記述
  exp: string | null;    // YYYY-MM-DD
  note?: string;         // 保管場所・メモ
  createdAt: string;
  updatedAt: string;
};

type HistoryEntry = {
  itemId: string;
  date: string;          // YYYY-MM-DD
  action: '登録' | '使用' | '補充' | '削除';
  delta: number;         // 数量変化（負=使用、正=補充）
  by?: string;           // 任意ラベル（夕食・購入 等）
};

type Settings = {
  notifications: {
    enabled: boolean;
    timings: { d60: boolean; d30: boolean; d7: boolean; d0: boolean };
    time: string;        // 'HH:mm'
    banner: boolean;
    sound: boolean;
  };
  warningThresholdDays: number;  // デフォルト 30
};
```

### 永続化
すべて `localStorage` に JSON 文字列で保存：
- `stockpile.items`
- `stockpile.history`
- `stockpile.settings`

書き込みは debounce 200ms 推奨。

## Design Tokens

### Colors
```css
--ink:       #1A1D24;   /* primary text */
--ink-2:     #4A5060;   /* secondary text */
--ink-3:     #8A8F9C;   /* tertiary / placeholder */
--ink-4:     #B8BCC4;   /* disabled / unset */
--line:      #E6E8EC;   /* card borders */
--line-2:    #F0F2F5;   /* row dividers */
--bg:        #F5F6F8;   /* screen background */
--paper:     #FFFFFF;   /* card background */

/* Brand accent — 低彩度ブルー */
--accent:      oklch(0.55 0.10 240);
--accent-soft: oklch(0.96 0.018 240);

/* Status — カラーバッジ用 */
--ok:          oklch(0.55 0.09 155);   /* 緑 余裕あり */
--ok-soft:     oklch(0.96 0.04 155);
--warn:        oklch(0.65 0.13 75);    /* 黄/橙 期限間近 */
--warn-soft:   oklch(0.96 0.06 80);
--danger:      oklch(0.55 0.16 25);    /* 赤 期限切れ */
--danger-soft: oklch(0.96 0.045 25);

/* Category accents */
--cat-food:    #D89C5A;
--cat-drink:   #5BA3C7;
--cat-home:    #9C8FB8;
--cat-med:     #C77B8E;
```

### Typography
- **本文**：`'Noto Sans JP', -apple-system, system-ui, sans-serif`、weight 300/400/500/600/700
- **数字（残日数・数量・日付）**：`'JetBrains Mono', ui-monospace, monospace`、weight 400/500/600
- スケール：10 / 11 / 12 / 13 / 14 / 15 / 17 / 18 / 19 / 20 / 22 / 26 / 28 / 32 / 36 / 56
- letter-spacing：見出しは `-0.01em ~ -0.04em`、ラベル系（11pxアイキャッチ）は `0.1em` で大文字風の間延び

### Spacing
4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 20 / 24 / 28 / 32 px。画面端の左右パディングは 20px、カード内パディングは 14〜18px。

### Border Radius
- 円アイコンタイル：8〜10
- カード：12〜14
- ヒーローカード：16
- 円形ボタン・ピル：22 / 9999

### Shadows
- カード境界：`border: 0.5px solid var(--line)`（影なし、罫線のみ）
- アクセントボタン：`0 4px 12px oklch(0.55 0.10 240 / 0.3)`
- 円形 + ボタン：`0 2px 6px oklch(0.55 0.10 240 / 0.3)`
- 通知バナー：`0 4px 12px rgba(0,0,0,0.06)` + `backdrop-filter: blur(20px)`

### Touch Targets
最低 44x44px を厳守（円形 ± ボタンは 36px だが周囲のカードpaddingでヒット領域を確保）。

## Assets
- アイコンは `ui.jsx` 内の `Icon` コンポーネントに 24×24 viewBox の SVG として全て内包（home / list / plus / bell / cog / cal / chev / search / filter / minus / check / x / food / drink / med / upload / download / barcode / qr / mic / camera / clock / edit / trash / share / sparkle）
- 画像アセットは未使用（オンボーディングのイラストもインライン SVG）
- フォントは Google Fonts 経由で読み込み：Noto Sans JP / JetBrains Mono

## Files
このフォルダに含まれるリファレンスファイル：

- `index.html` — 8画面を並べた canvas エントリポイント
- `data.js` — サンプルデータ（3〜4人家族の備蓄想定、賞味期限を計算）
- `ui.jsx` — 共通プリミティブ（C / STATUS_META / CAT_META / Icon / StatusBadge / DaysPill / CatChip / TabBar / TopBar / Card / StatTile / Frame）
- `ios-frame.jsx` — iPhone デバイスフレーム（参考用、本実装では不要）
- `app.jsx` — 8画面のレンダリングルーター
- `screens/home.jsx` — ホーム / ダッシュボード
- `screens/inventory.jsx` — 在庫一覧
- `screens/add.jsx` — 追加フォーム（FormRow / CircleBtn / ToggleRow / SectionHead 含む）
- `screens/detail.jsx` — 詳細 + 使用補充 + 履歴
- `screens/calendar.jsx` — カレンダー / .ics エクスポート
- `screens/notifications.jsx` — 通知設定
- `screens/data.jsx` — JSON バックアップ
- `screens/onboarding.jsx` — オンボーディング

## 実装上の推奨事項

1. **PWA対応**：
   - `manifest.json` に `display: 'standalone'`、theme-color、各サイズアイコン（192/512）、`start_url: '/'`
   - Service Worker でアプリシェル + APIレスポンス（不要だが念のため）をキャッシュ
   - `apple-touch-icon` メタタグでホーム画面追加時のアイコンを指定

2. **オフラインファースト**：データはすべて localStorage、ネットワーク不要で全機能が動く設計

3. **iOS Safari の制約**：
   - Web Push は iOS 16.4+ で「ホーム画面追加済み PWA のみ」サポート。未対応端末用にローカル通知（Notification API）でフォールバック
   - `viewport-fit=cover` + safe-area-inset 対応必須

4. **アクセシビリティ**：
   - フォントサイズの拡大対応（Tweaks想定の通常/大きめ切り替え）
   - 色だけに依存しないステータス表現（バッジテキスト併記済み）
   - 全インタラクティブ要素に aria-label
