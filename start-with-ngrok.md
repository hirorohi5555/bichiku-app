# ngrokを使ってiPhoneでテストする方法

## 1. ngrokのセットアップ

1. https://ngrok.com/download からngrokをダウンロード
2. アカウント登録（無料）
3. Authtokenを取得してセットアップ:
   ```
   ngrok config add-authtoken YOUR_AUTHTOKEN
   ```

## 2. サーバーを起動

このディレクトリで以下を実行:
```powershell
powershell -ExecutionPolicy Bypass -File start-server.ps1
```

## 3. ngrokでトンネルを作成

別のターミナルで以下を実行:
```
ngrok http 8000
```

## 4. 表示されるHTTPS URLをiPhoneで開く

ngrokが表示するURL（例: https://xxxx-xx-xx-xx-xx.ngrok-free.app）を
iPhoneのSafariで開く

## 5. PWA機能のテスト

- ホーム画面に追加: 共有ボタン → "ホーム画面に追加"
- オフライン動作: 機内モードでもアプリが動作するか確認
- 通知機能: 通知許可をOKにしてテスト通知

## 注意事項

- ngrokの無料プランでは、セッションは最大8時間
- URLは毎回変わります（有料プランで固定URL可能）
- テスト後は必ずngrokを停止してください
