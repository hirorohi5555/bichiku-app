# 🚀 GitHub Pagesデプロイ手順

## 📋 必要なもの

- GitHubアカウント（無料）
- Git（Windowsの場合、Git Bashまたは PowerShell）

---

## 🎯 簡易デプロイ手順（初回）

### 1. GitHubでリポジトリ作成

1. https://github.com にアクセス
2. 右上の「+」→「New repository」
3. 設定:
   - Repository name: `bichiku-app`（任意）
   - Public（公開）を選択
   - **READMEは追加しない**
4. 「Create repository」

### 2. ローカルでGit設定

PowerShellで以下を実行:

```powershell
# プロジェクトフォルダに移動
cd "C:\Users\hiroa\OneDrive\デスクトップ\test-project"

# Git初期化
git init

# ファイル追加
git add .

# コミット
git commit -m "Initial commit - 備蓄品管理PWA"

# リモート追加（★ユーザー名を変更★）
git remote add origin https://github.com/あなたのユーザー名/bichiku-app.git

# ブランチ名をmainに変更
git branch -M main

# プッシュ
git push -u origin main
```

### 3. GitHub Pagesを有効化

1. GitHubのリポジトリページを開く
2. 「Settings」タブ
3. 左メニュー「Pages」
4. Source:
   - Branch: `main`
   - Folder: `/ (root)`
5. 「Save」

**完了！** 数分後に公開されます。

---

## 🔄 更新時のデプロイ手順

コードを修正した後、以下を実行:

### 方法1: スクリプト使用（簡単）

```powershell
.\deploy.ps1
```

### 方法2: 手動

```powershell
git add .
git commit -m "Update: 機能追加"
git push origin main
```

---

## 🌐 公開URL

デプロイ後、以下のURLでアクセス可能:

```
https://あなたのユーザー名.github.io/bichiku-app/
```

例:
```
https://tanaka-taro.github.io/bichiku-app/
```

---

## 📱 iPhoneでの使用方法

### 1. iPhoneでSafariを開く

上記のURLにアクセス

### 2. ホーム画面に追加

1. 下部の「共有」ボタン（□↑）をタップ
2. 「ホーム画面に追加」を選択
3. 「追加」をタップ

### 3. アプリとして使用

ホーム画面のアイコンをタップして起動！

---

## 🛠️ トラブルシューティング

### ページが表示されない

1. GitHub Pages設定を確認
   - Settings → Pages
   - 「Your site is published at...」と表示されているか確認

2. 数分待つ
   - 初回デプロイは5-10分かかることがある

3. キャッシュをクリア
   - iPhone Safari: 設定 → Safari → 履歴とWebサイトデータを消去

### Service Workerエラー

- HTTPSでアクセスしているか確認
- DevTools (F12) → Console でエラー確認

### アイコンが表示されない

- manifest.jsonのパスを確認
- icons/icon-192.png, icon-512.png が存在するか確認

---

## 🔐 プライベートリポジトリにしたい場合

GitHub Pagesは**Publicリポジトリでのみ無料**です。

プライベートにする場合:
- GitHub Pro（有料）が必要
- または、Netlifyなど他のサービスを使用

---

## 📚 参考リンク

- GitHub Pages公式: https://pages.github.com/
- PWAインストール: https://developer.mozilla.org/ja/docs/Web/Progressive_web_apps/Installing

---

## ✅ チェックリスト

デプロイ前:
- [ ] GitHubアカウント作成済み
- [ ] リポジトリ作成済み
- [ ] ローカルでgit init実行済み
- [ ] git pushでファイルアップロード済み
- [ ] GitHub Pages有効化済み

デプロイ後:
- [ ] URLにアクセスしてアプリが表示される
- [ ] iPhoneでアクセスできる
- [ ] ホーム画面に追加できる
- [ ] オフラインで動作する
- [ ] Service Workerが登録されている（DevTools確認）

---

## 💡 ヒント

### カスタムドメイン使用

独自ドメイン（例: app.example.com）を使いたい場合:
1. ドメイン取得
2. GitHub Pages設定でCustom domainを設定
3. DNS設定

### 更新を即座に反映

GitHub Pagesは5-10分かかることがあります。
即座に反映したい場合は**Netlify**がおすすめ。

### アクセス解析

Google Analyticsなどを追加可能:
- index.htmlに解析タグを追加
