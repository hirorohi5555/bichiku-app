# GitHub Pagesデプロイスクリプト
# 使い方: .\deploy.ps1

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  備蓄品管理PWA - GitHub Pagesデプロイ" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 現在のディレクトリ確認
$currentDir = Get-Location
Write-Host "現在のディレクトリ: $currentDir" -ForegroundColor Yellow
Write-Host ""

# Gitリポジトリの確認
if (-not (Test-Path ".git")) {
    Write-Host "エラー: Gitリポジトリが初期化されていません" -ForegroundColor Red
    Write-Host ""
    Write-Host "以下のコマンドを実行してください:" -ForegroundColor Yellow
    Write-Host "  git init" -ForegroundColor White
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m 'Initial commit'" -ForegroundColor White
    Write-Host "  git remote add origin https://github.com/ユーザー名/リポジトリ名.git" -ForegroundColor White
    Write-Host "  git branch -M main" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor White
    exit 1
}

# 変更をコミット
Write-Host "変更をステージング..." -ForegroundColor Green
git add .

Write-Host ""
Write-Host "コミットメッセージを入力してください（空欄でデフォルト）:" -ForegroundColor Yellow
$commitMessage = Read-Host "メッセージ"

if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}

Write-Host ""
Write-Host "コミット中..." -ForegroundColor Green
git commit -m $commitMessage

Write-Host ""
Write-Host "GitHubにプッシュ中..." -ForegroundColor Green
git push origin main

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  デプロイ完了！" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "数分後に以下のURLでアプリが公開されます:" -ForegroundColor Yellow
Write-Host "https://ユーザー名.github.io/リポジトリ名/" -ForegroundColor White
Write-Host ""
Write-Host "GitHub Pages設定ページ:" -ForegroundColor Yellow
Write-Host "https://github.com/ユーザー名/リポジトリ名/settings/pages" -ForegroundColor White
Write-Host ""
