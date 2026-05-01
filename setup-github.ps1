# GitHub初期セットアップスクリプト
# 使い方: .\setup-github.ps1

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  GitHub Pages 初期セットアップ" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Gitがインストールされているか確認
try {
    $gitVersion = git --version
    Write-Host "✓ Git検出: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Gitがインストールされていません" -ForegroundColor Red
    Write-Host ""
    Write-Host "Gitをインストールしてください:" -ForegroundColor Yellow
    Write-Host "https://git-scm.com/download/win" -ForegroundColor White
    exit 1
}

Write-Host ""

# Gitリポジトリの確認
if (Test-Path ".git") {
    Write-Host "⚠ 既にGitリポジトリが初期化されています" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "既存のリポジトリを削除して再初期化しますか？ (y/N):" -ForegroundColor Yellow
    $confirm = Read-Host
    if ($confirm -ne "y") {
        Write-Host "セットアップをキャンセルしました" -ForegroundColor Yellow
        exit 0
    }
    Remove-Item -Recurse -Force .git
    Write-Host "✓ 既存のリポジトリを削除しました" -ForegroundColor Green
}

Write-Host ""
Write-Host "GitHubの情報を入力してください" -ForegroundColor Cyan
Write-Host "（GitHubでリポジトリを先に作成しておいてください）" -ForegroundColor Yellow
Write-Host ""

# GitHubユーザー名
Write-Host "GitHubユーザー名:" -ForegroundColor Yellow
$username = Read-Host
if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "✗ ユーザー名が入力されていません" -ForegroundColor Red
    exit 1
}

# リポジトリ名
Write-Host ""
Write-Host "リポジトリ名（例: bichiku-app）:" -ForegroundColor Yellow
$repoName = Read-Host
if ([string]::IsNullOrWhiteSpace($repoName)) {
    Write-Host "✗ リポジトリ名が入力されていません" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  セットアップ開始" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Git初期化
Write-Host "1/5 Gitリポジトリを初期化..." -ForegroundColor Green
git init

# .gitignoreを作成（不要なファイルを除外）
Write-Host "2/5 .gitignoreを作成..." -ForegroundColor Green
@"
# Windows
Thumbs.db
Desktop.ini

# macOS
.DS_Store

# 一時ファイル
*.tmp
*.log

# エディタ
.vscode/
.idea/

# その他
node_modules/
"@ | Out-File -FilePath ".gitignore" -Encoding utf8

# ファイルを追加
Write-Host "3/5 ファイルを追加..." -ForegroundColor Green
git add .

# コミット
Write-Host "4/5 初回コミット..." -ForegroundColor Green
git commit -m "Initial commit - 備蓄品管理PWA"

# リモートリポジトリを追加
Write-Host "5/5 リモートリポジトリを設定..." -ForegroundColor Green
$remoteUrl = "https://github.com/$username/$repoName.git"
git remote add origin $remoteUrl

# ブランチ名をmainに変更
git branch -M main

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  セットアップ完了！" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "次のステップ:" -ForegroundColor Yellow
Write-Host "1. GitHubにプッシュ:" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. GitHub Pagesを有効化:" -ForegroundColor White
Write-Host "   https://github.com/$username/$repoName/settings/pages" -ForegroundColor Cyan
Write-Host "   → Source: main / (root) を選択" -ForegroundColor White
Write-Host ""
Write-Host "3. 公開URL（数分後）:" -ForegroundColor White
Write-Host "   https://$username.github.io/$repoName/" -ForegroundColor Cyan
Write-Host ""
Write-Host "今すぐプッシュしますか？ (y/N):" -ForegroundColor Yellow
$pushNow = Read-Host

if ($pushNow -eq "y") {
    Write-Host ""
    Write-Host "GitHubにプッシュ中..." -ForegroundColor Green
    git push -u origin main

    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "  プッシュ完了！" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "GitHub Pages設定ページを開きます:" -ForegroundColor Yellow
    Write-Host "https://github.com/$username/$repoName/settings/pages" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "ブラウザで開きますか？ (y/N):" -ForegroundColor Yellow
    $openBrowser = Read-Host

    if ($openBrowser -eq "y") {
        Start-Process "https://github.com/$username/$repoName/settings/pages"
    }
} else {
    Write-Host ""
    Write-Host "後で以下のコマンドでプッシュしてください:" -ForegroundColor Yellow
    Write-Host "git push -u origin main" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "詳しい手順は DEPLOY.md を参照してください" -ForegroundColor Yellow
Write-Host ""
