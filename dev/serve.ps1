# Servidor local para testar o jogo.
#   http://localhost:8765/    -> jogo normal (single-player)
#   http://localhost:8765/mp  -> jogo com o simulador de multiplayer (abra em duas abas)
#   http://localhost:8765/verify -> partidas descartáveis para verificar as novidades
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
  if ($ctx.Request.Url.AbsolutePath -eq '/mp' -or $ctx.Request.Url.AbsolutePath -eq '/verify') {
    $mock = '<script>' + [System.IO.File]::ReadAllText((Join-Path $PSScriptRoot 'mock-room.js'), [System.Text.Encoding]::UTF8) + '</script>'
    $html = $html.Replace('<body>', '<body>' + $mock)
  }
  if ($ctx.Request.Url.AbsolutePath -eq '/verify') {
    # Partidas descartáveis: isola os saves e deixa a simulação sob controle dos botões.
    $prefix = '<script>const testStore=new Map();Object.defineProperty(window,"localStorage",{value:{getItem:k=>testStore.get(k)||null,setItem:(k,v)=>testStore.set(k,String(v)),removeItem:k=>testStore.delete(k)}});window.requestAnimationFrame=()=>0;</script>'
    $html = $html.Replace($mock, $mock + $prefix)
    $verify = '<script>' + [IO.File]::ReadAllText((Join-Path $root 'dev/verify-features.js'), [Text.Encoding]::UTF8) + '</script>'
    $html = $html.Replace('</body>', $verify + '</body>')
  }
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($html)
  $ctx.Response.ContentType = 'text/html; charset=utf-8'
  $ctx.Response.ContentLength64 = $bytes.Length
  $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $ctx.Response.Close()
}
