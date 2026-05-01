Add-Type -AssemblyName System.Drawing

# 192x192
$bmp192 = New-Object System.Drawing.Bitmap(192, 192)
$g192 = [System.Drawing.Graphics]::FromImage($bmp192)
$g192.Clear([System.Drawing.Color]::FromArgb(33, 150, 243))

$white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$blue = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 118, 210))

$g192.FillRectangle($white, 46, 56, 100, 80)
$g192.FillRectangle($blue, 56, 66, 80, 20)

$bmp192.Save("$PSScriptRoot\icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g192.Dispose()
$bmp192.Dispose()

# 512x512
$bmp512 = New-Object System.Drawing.Bitmap(512, 512)
$g512 = [System.Drawing.Graphics]::FromImage($bmp512)
$g512.Clear([System.Drawing.Color]::FromArgb(33, 150, 243))

$g512.FillRectangle($white, 156, 176, 200, 160)
$g512.FillRectangle($blue, 176, 196, 160, 40)

$bmp512.Save("$PSScriptRoot\icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g512.Dispose()
$bmp512.Dispose()

$white.Dispose()
$blue.Dispose()

Write-Host "Icons created successfully!" -ForegroundColor Green
