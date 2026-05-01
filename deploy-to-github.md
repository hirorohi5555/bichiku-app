# GitHub Pagesにデプロイする方法

## 1. Gitリポジトリを初期化

```bash
git init
git add .
git commit -m "Initial commit: 備蓄品管理システムMVP"
```

## 2. GitHubにリポジトリを作成

1. https://github.com/new にアクセス
2. リポジトリ名を入力（例: stock-management-app）
3. Publicで作成
4. ローカルリポジトリと接続:

```bash
git remote add origin https://github.com/YOUR_USERNAME/stock-management-app.git
git branch -M main
git push -u origin main
```

## 3. GitHub Pagesを有効化

1. GitHubのリポジトリページで Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: "main" / "/ (root)" を選択
4. Save

## 4. 数分後にアクセス

https://YOUR_USERNAME.github.io/stock-management-app/

## メリット

- 恒久的なURL
- 無料
- HTTPSが自動で有効
- 更新も簡単（git pushするだけ）

## デメリット

- 公開リポジトリになる（個人情報は登録しないこと）
- 初回デプロイに数分かかる
