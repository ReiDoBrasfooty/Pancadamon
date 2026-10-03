# Servidor local para testar o jogo.
#   http://localhost:8765/    -> jogo normal (single-player)
#   http://localhost:8765/mp  -> jogo com o simulador de multiplayer (abra em duas abas)
# Uso: powershell -ExecutionPolicy Bypass -File dev/serve.ps1
# A porta vem da variável PORT (o Claude Code escolhe uma livre); sem ela, usa 8765.
$root = Split-Path $PSScriptRoot -Parent
$port = if ($env:PORT) { $env:PORT } else { '8765' }
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Output "Servindo em http://localhost:$port/ (multiplayer simulado em /mp)"
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $html = [System.IO.File]::ReadAllText((Join-Path $root 'index.html'), [System.Text.Encoding]::UTF8)
  if ($ctx.Request.Url.AbsolutePath -eq '/mp') {
    $mock = '<script>' + [System.IO.File]::ReadAllText((Join-Path $PSScriptRoot 'mock-room.js'), [System.Text.Encoding]::UTF8) + '</script>'
    $html = $html.Replace('<body>', '<body>' + $mock)
  }
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($html)
  $ctx.Response.ContentType = 'text/html; charset=utf-8'
  $ctx.Response.ContentLength64 = $bytes.Length
  $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $ctx.Response.Close()
}
