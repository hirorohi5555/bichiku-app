Add-Type -AssemblyName System.Drawing

# 192x192アイコン
$bmp192 = New-Object System.Drawing.Bitmap(192, 192)
$graphics192 = [System.Drawing.Graphics]::FromImage($bmp192)
$graphics192.Clear([System.Drawing.Color]::FromArgb(33, 150, 243))

$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$font192 = New-Object System.Drawing.Font('Arial', 60, [System.Drawing.FontStyle]::Bold)

$graphics192.DrawString('備', $font192, $brush, 60, 60)
$bmp192.Save("$PSScriptRoot\icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)

$graphics192.Dispose()
$bmp192.Dispose()
$font192.Dispose()

# 512x512アイコン
$bmp512 = New-Object System.Drawing.Bitmap(512, 512)
$graphics512 = [System.Drawing.Graphics]::FromImage($bmp512)
$graphics512.Clear([System.Drawing.Color]::FromArgb(33, 150, 243))

$font512 = New-Object System.Drawing.Font('Arial', 160, [System.Drawing.FontStyle]::Bold)

$graphics512.DrawString('備', $font512, $brush, 160, 160)
$bmp512.Save("$PSScriptRoot\icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)

$graphics512.Dispose()
$bmp512.Dispose()
$font512.Dispose()

$brush.Dispose()

Write-Host "Icons created successfully!" -ForegroundColor Green
