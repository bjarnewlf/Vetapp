# Dev-Agentur Dashboard Generator
# Sammelt live Daten und generiert dashboard.html

$ErrorActionPreference = "SilentlyContinue"

$projectRoot = "C:\Users\claas\claude-workspace\VetApp"
$globalAgentsDir = "C:\Users\claas\.claude\agents"
$projectAgentsDir = "$projectRoot\.claude\agents"
$outputFile = "$projectRoot\scripts\dashboard.html"

Set-Location $projectRoot

# --- Daten sammeln ---

# Agents auslesen (aus Frontmatter)
function Get-Agents($dir, $scope) {
    $agents = @()
    if (Test-Path $dir) {
        foreach ($file in Get-ChildItem "$dir\*.md") {
            $content = Get-Content $file -Raw
            $name = ""; $desc = ""; $model = ""; $color = ""
            if ($content -match '(?m)^name:\s*(.+)$') { $name = $Matches[1].Trim() }
            if ($content -match '(?m)^description:\s*(.+)$') { $desc = $Matches[1].Trim() }
            if ($content -match '(?m)^model:\s*(.+)$') { $model = $Matches[1].Trim() }
            if ($content -match '(?m)^color:\s*(.+)$') { $color = $Matches[1].Trim() }
            if ($name) {
                $agents += [PSCustomObject]@{
                    Name = $name
                    Description = $desc
                    Model = $model
                    Color = $color
                    Scope = $scope
                }
            }
        }
    }
    return $agents
}

$globalAgents = Get-Agents $globalAgentsDir "Global"
$projectAgents = Get-Agents $projectAgentsDir "Projekt"

# Farben-Mapping
$colorMap = @{
    "purple" = "#a855f6"
    "green" = "#22c55e"
    "orange" = "#f97316"
    "red" = "#ef4444"
    "cyan" = "#06b6d4"
    "yellow" = "#eab308"
    "blue" = "#3b82f6"
    "pink" = "#ec4899"
}

# Agents HTML generieren
function Get-AgentHtml($agent) {
    $dotColor = if ($colorMap[$agent.Color]) { $colorMap[$agent.Color] } else { "#888" }
    $scopeClass = if ($agent.Scope -eq "Projekt") { "project" } else { "" }
    # Kurzbeschreibung aus Description extrahieren (erster Teil vor dem Bindestrich)
    $shortDesc = $agent.Description -replace ' —.*$', '' -replace ' --.*$', ''
    if ($shortDesc.Length -gt 30) { $shortDesc = $shortDesc.Substring(0, 30) + "..." }
    return @"
      <div class="agent">
        <div class="agent-dot" style="background: $dotColor;"></div>
        <span class="agent-name">$($agent.Name)</span>
        <span class="agent-role">$shortDesc</span>
        <span class="agent-scope $scopeClass">$($agent.Scope)</span>
        <span class="agent-model">$($agent.Model)</span>
      </div>
"@
}

$agentsHtml = ""
foreach ($a in $projectAgents) { $agentsHtml += Get-AgentHtml $a }
foreach ($a in $globalAgents) { $agentsHtml += Get-AgentHtml $a }

# Tasks auslesen
$tasksHtml = ""
if (Test-Path "$projectRoot\tasks.md") {
    $tasksContent = Get-Content "$projectRoot\tasks.md" -Encoding UTF8
    $currentGroup = ""
    $doneCount = 0
    $doneItems = @()

    foreach ($line in $tasksContent) {
        if ($line -match '^## (SOFORT|DIESE WOCHE|BACKLOG|ERLEDIGT)') {
            $currentGroup = $Matches[1]
            if ($currentGroup -ne "ERLEDIGT") {
                $groupClass = switch ($currentGroup) {
                    "SOFORT" { "sofort" }
                    "DIESE WOCHE" { "woche" }
                    "BACKLOG" { "backlog" }
                }
                $tasksHtml += "      <div class=`"task-group`"><h3 class=`"$groupClass`">$currentGroup</h3>`n"
            }
        }
        elseif ($line -match '^\- \[ \] (.+)$' -and $currentGroup -ne "ERLEDIGT") {
            $taskText = $Matches[1] -replace '<', '&lt;' -replace '>', '&gt;'
            $tasksHtml += "        <div class=`"task`">$taskText</div>`n"
        }
        elseif ($line -match '^\- \[ \] (.+)$' -and $currentGroup -eq "ERLEDIGT") {
            $doneCount++
        }
        elseif ($line -match '^\- \[x\] (.+)$') {
            $doneCount++
            if ($doneItems.Count -lt 3) {
                $doneItems += ($Matches[1] -replace '<', '&lt;' -replace '>', '&gt;')
            }
        }
        elseif ($line -match '^## ' -and $currentGroup -and $currentGroup -ne "ERLEDIGT") {
            $tasksHtml += "      </div>`n"
        }
    }
    # Close last open group if not ERLEDIGT
    if ($currentGroup -and $currentGroup -ne "ERLEDIGT") {
        $tasksHtml += "      </div>`n"
    }
    # Erledigt section
    if ($doneCount -gt 0) {
        $tasksHtml += "      <div class=`"task-group`"><h3 class=`"erledigt`">ERLEDIGT ($doneCount)</h3>`n"
        foreach ($d in $doneItems) {
            $tasksHtml += "        <div class=`"task done`">$d</div>`n"
        }
        if ($doneCount -gt 3) {
            $remaining = $doneCount - 3
            $tasksHtml += "        <div class=`"task done`" style=`"color:#555`">...und $remaining weitere</div>`n"
        }
        $tasksHtml += "      </div>`n"
    }
}

# Git Daten
$gitBranch = git branch --show-current 2>$null
$gitStatus = git status --short 2>$null
$gitLog = git log --oneline -8 2>$null

$modifiedCount = ($gitStatus | Where-Object { $_ -match '^ ?M' }).Count
$untrackedCount = ($gitStatus | Where-Object { $_ -match '^\?\?' }).Count

$changesText = ""
if ($modifiedCount -gt 0) { $changesText += "$modifiedCount geaendert" }
if ($untrackedCount -gt 0) {
    if ($changesText) { $changesText += " / " }
    $changesText += "$untrackedCount untracked"
}
if (-not $changesText) { $changesText = "Clean" }

$commitsHtml = ""
foreach ($line in $gitLog) {
    if ($line -match '^([a-f0-9]+)\s+(.+)$') {
        $hash = $Matches[1]
        $msg = $Matches[2] -replace '<', '&lt;' -replace '>', '&gt;'
        $commitsHtml += @"
      <div class="commit">
        <span class="commit-hash">$hash</span>
        <span class="commit-msg">$msg</span>
      </div>
"@
    }
}

# Scheduled Tasks
$triggersHtml = ""
$taskNames = @("VetApp-Dokumentar-Morgens", "VetApp-Dokumentar-Abends")
foreach ($tn in $taskNames) {
    $taskInfo = schtasks /query /fo LIST /tn $tn 2>$null
    $nextRun = ""; $status = ""
    foreach ($infoLine in $taskInfo) {
        if ($infoLine -match 'N.chste Laufzeit:\s*(.+)$') { $nextRun = $Matches[1].Trim() }
        if ($infoLine -match 'Next Run Time:\s*(.+)$') { $nextRun = $Matches[1].Trim() }
        if ($infoLine -match 'Status:\s*(.+)$') { $status = $Matches[1].Trim() }
    }
    $displayName = $tn -replace 'VetApp-', ''
    $triggersHtml += @"
      <div class="trigger">
        <div>
          <div class="trigger-name">$displayName</div>
          <div class="trigger-time">Naechster Lauf: $nextRun</div>
        </div>
        <span class="trigger-status">$status</span>
      </div>
"@
}

# Learnings
$learningsHtml = ""
if (Test-Path "$projectRoot\learnings.md") {
    $learningsContent = Get-Content "$projectRoot\learnings.md" -Encoding UTF8 -Raw
    $learningBlocks = [regex]::Matches($learningsContent, '### (\d{4}-\d{2}-\d{2}) . (.+)\n(.+)')
    $count = 0
    foreach ($block in $learningBlocks) {
        if ($count -ge 4) { break }
        $date = $block.Groups[1].Value
        $title = $block.Groups[2].Value -replace '<', '&lt;' -replace '>', '&gt;'
        $text = $block.Groups[3].Value.Trim() -replace '<', '&lt;' -replace '>', '&gt;'
        if ($text.Length -gt 120) { $text = $text.Substring(0, 117) + "..." }
        $learningsHtml += @"
      <div class="learning">
        <div class="learning-date">$date</div>
        <div class="learning-title">$title</div>
        <div class="learning-text">$text</div>
      </div>
"@
        $count++
    }
}

# Zeitstempel
$timestamp = Get-Date -Format "dd.MM.yyyy 'um' HH:mm 'Uhr'"

# --- HTML generieren ---
$html = @"
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dev-Agentur Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #0f0f1a;
      color: #e0e0e8;
      padding: 24px;
      line-height: 1.5;
    }
    h1 { font-size: 28px; color: #fff; margin-bottom: 4px; }
    .subtitle { color: #888; font-size: 14px; margin-bottom: 32px; }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    .grid-2 { grid-template-columns: 1fr 1fr; }
    .card {
      background: #1a1a2e;
      border: 1px solid #2a2a3e;
      border-radius: 12px;
      padding: 20px;
      transition: border-color 0.2s;
    }
    .card:hover { border-color: #4a4a6e; }
    .card h2 {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #888;
      margin-bottom: 16px;
    }
    .card.span-2 { grid-column: span 2; }
    .agent {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid #2a2a3e;
    }
    .agent:last-child { border-bottom: none; }
    .agent-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .agent-name { font-weight: 600; color: #fff; min-width: 100px; }
    .agent-role { color: #aaa; font-size: 13px; }
    .agent-model {
      margin-left: auto;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      background: #2a2a3e;
      color: #aaa;
    }
    .agent-scope {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      background: #1e3a2e;
      color: #6fcf97;
    }
    .agent-scope.project { background: #3a2e1e; color: #f2c94c; }
    .task-group { margin-bottom: 16px; }
    .task-group:last-child { margin-bottom: 0; }
    .task-group h3 {
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 8px;
      padding: 2px 8px;
      border-radius: 4px;
      display: inline-block;
    }
    .task-group h3.sofort { background: #3e1a1a; color: #f27474; }
    .task-group h3.woche { background: #3e2e1a; color: #f2c94c; }
    .task-group h3.backlog { background: #1a2e3e; color: #74b4f2; }
    .task-group h3.erledigt { background: #1e3a2e; color: #6fcf97; }
    .task { font-size: 13px; padding: 4px 0; color: #ccc; }
    .task::before {
      content: '';
      display: inline-block;
      width: 8px; height: 8px;
      border: 1.5px solid #555;
      border-radius: 2px;
      margin-right: 8px;
      vertical-align: middle;
    }
    .task.done { color: #666; text-decoration: line-through; }
    .task.done::before { background: #6fcf97; border-color: #6fcf97; }
    .commit {
      font-size: 13px;
      padding: 6px 0;
      border-bottom: 1px solid #2a2a3e;
      display: flex;
      gap: 10px;
    }
    .commit:last-child { border-bottom: none; }
    .commit-hash {
      font-family: 'Consolas', 'Fira Code', monospace;
      color: #7b68ee;
      font-size: 12px;
      flex-shrink: 0;
    }
    .commit-msg { color: #ccc; }
    .git-badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 8px;
    }
    .git-branch { background: #1e3a2e; color: #6fcf97; }
    .git-changes { background: #3e2e1a; color: #f2c94c; }
    .trigger {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #2a2a3e;
    }
    .trigger:last-child { border-bottom: none; }
    .trigger-name { font-weight: 600; color: #fff; }
    .trigger-time { color: #aaa; font-size: 13px; }
    .trigger-status {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      background: #1e3a2e;
      color: #6fcf97;
    }
    .learning {
      padding: 10px 0;
      border-bottom: 1px solid #2a2a3e;
    }
    .learning:last-child { border-bottom: none; }
    .learning-title { font-weight: 600; color: #fff; font-size: 14px; }
    .learning-date { color: #888; font-size: 12px; }
    .learning-text { color: #aaa; font-size: 13px; margin-top: 4px; }
    .footer {
      text-align: center;
      color: #444;
      font-size: 12px;
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #2a2a3e;
    }
  </style>
</head>
<body>

  <h1>Dev-Agentur Dashboard</h1>
  <p class="subtitle">VetApp — generiert $timestamp</p>

  <div class="grid">
    <div class="card">
      <h2>Agenten</h2>
$agentsHtml
    </div>

    <div class="card span-2">
      <h2>Aufgaben</h2>
$tasksHtml
    </div>
  </div>

  <div class="grid grid-2">
    <div class="card">
      <h2>Git</h2>
      <div style="margin-bottom: 12px;">
        <span class="git-badge git-branch">$gitBranch</span>
        <span class="git-badge git-changes">$changesText</span>
      </div>
$commitsHtml
    </div>

    <div class="card">
      <h2>Automationen</h2>
$triggersHtml

      <h2 style="margin-top: 24px;">Learnings</h2>
$learningsHtml
    </div>
  </div>

  <p class="footer">Dev-Agentur von Claas — $timestamp</p>

</body>
</html>
"@

$html | Out-File -FilePath $outputFile -Encoding UTF8
Write-Host "Dashboard generiert: $outputFile"
