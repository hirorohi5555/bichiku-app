# 簡易HTTPサーバー起動スクリプト
$port = 8000
$url = "http://localhost:$port"

Write-Host "Starting HTTP server on port $port..." -ForegroundColor Green
Write-Host "URL: $url" -ForegroundColor Cyan
Write-Host ""

# MIMEタイプを返す関数
function Get-MimeType {
    param([string]$FileName)

    $FileName = $FileName.ToLower()

    if ($FileName.EndsWith('.html') -or $FileName.EndsWith('.htm')) { return 'text/html; charset=utf-8' }
    if ($FileName.EndsWith('.css')) { return 'text/css; charset=utf-8' }
    if ($FileName.EndsWith('.js')) { return 'application/javascript; charset=utf-8' }
    if ($FileName.EndsWith('.json')) { return 'application/json; charset=utf-8' }
    if ($FileName.EndsWith('.png')) { return 'image/png' }
    if ($FileName.EndsWith('.jpg') -or $FileName.EndsWith('.jpeg')) { return 'image/jpeg' }
    if ($FileName.EndsWith('.svg')) { return 'image/svg+xml; charset=utf-8' }
    if ($FileName.EndsWith('.ico')) { return 'image/x-icon' }

    return 'application/octet-stream'
}

# .NET HttpListenerを使用
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("$url/")
$listener.Start()

Write-Host "Server is running!" -ForegroundColor Green
Start-Sleep -Milliseconds 500
Start-Process $url
Write-Host ""

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath
        if ($path -eq "/") { $path = "/index.html" }

        $filePath = Join-Path $PSScriptRoot $path.TrimStart('/')

        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $fileName = Split-Path $filePath -Leaf
            $mimeType = Get-MimeType $fileName

            $response.ContentType = $mimeType
            $response.ContentLength64 = $content.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($content, 0, $content.Length)
            $response.OutputStream.Close()

            Write-Host "$path - $mimeType" -ForegroundColor Green
        } else {
            $response.StatusCode = 404
            $response.Close()
            Write-Host "$path - 404 Not Found" -ForegroundColor Red
        }
    }
} finally {
    $listener.Stop()
}
