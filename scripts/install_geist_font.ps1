# Installiert Geist als Desktop-Schrift pro Benutzer (ohne Admin-Rechte)
Add-Type -AssemblyName System.Drawing

$src = "C:\Users\erikv\Documents\GitHub\Portfolio Website Erik EvgLab\src\app\og-assets"
$files = @("Geist-Regular.ttf", "Geist-Bold.ttf")

$fontDir = Join-Path $env:LOCALAPPDATA "Microsoft\Windows\Fonts"
New-Item -ItemType Directory -Force -Path $fontDir | Out-Null
$regKey = "HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts"

$sig = @"
[DllImport("gdi32.dll")] public static extern int AddFontResource(string lpFileName);
[DllImport("user32.dll")] public static extern int SendMessage(int hWnd, int Msg, int wParam, int lParam);
"@
$win = Add-Type -MemberDefinition $sig -Name FontInstaller -Namespace Win32 -PassThru

foreach ($f in $files) {
    $srcPath = Join-Path $src $f
    $dest = Join-Path $fontDir $f
    Copy-Item -Path $srcPath -Destination $dest -Force

    $pfc = New-Object System.Drawing.Text.PrivateFontCollection
    $pfc.AddFontFile($srcPath)
    $fam = $pfc.Families[0].Name
    $pfc.Dispose()

    if ($f -like "*Bold*") { $title = "$fam Bold (TrueType)" } else { $title = "$fam (TrueType)" }

    New-ItemProperty -Path $regKey -Name $title -Value $dest -PropertyType String -Force | Out-Null
    [void]$win::AddFontResource($dest)
    Write-Output "Installed: $f  ->  '$title'  (family: '$fam')"
}

# WM_FONTCHANGE an alle Fenster senden, damit Apps die Schrift sofort sehen
[void]$win::SendMessage(0xffff, 0x001D, 0, 0)
Write-Output "DONE"
