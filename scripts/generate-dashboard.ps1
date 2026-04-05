# Dev-Agentur Dashboard Generator v2
# Sammelt live Daten und generiert dashboard.html (statischer Export)

$ErrorActionPreference = "SilentlyContinue"

$projectRoot = "C:\Users\claas\claude-workspace\VetApp"
$globalAgentsDir = "C:\Users\claas\.claude\agents"
$projectAgentsDir = "$projectRoot\.claude\agents"
$vaultDir = "D:\Agency-Vault"
$outputFile = "$projectRoot\scripts\dashboard.html"

Set-Location $projectRoot

# --- Agents ---

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
                $agents += [PSCustomObject]@{ Name = $name; Description = $desc; Model = $model; Color = $color; Scope = $scope }
            }
        }
    }
    return $agents
}

$globalAgents = Get-Agents $globalAgentsDir "Global"
$projectAgents = Get-Agents $projectAgentsDir "Projekt"

$colorMap = @{
    "purple" = "#a855f6"; "green" = "#22c55e"; "orange" = "#f97316"
    "red" = "#ef4444"; "cyan" = "#06b6d4"; "yellow" = "#eab308"
    "blue" = "#3b82f6"; "pink" = "#ec4899"
}

$agentsHtml = ""
foreach ($a in ($projectAgents + $globalAgents)) {
    $dotColor = if ($colorMap[$a.Color]) { $colorMap[$a.Color] } else { "#888" }
    $scopeClass = if ($a.Scope -eq "Projekt") { "project" } else { "" }
    $shortDesc = $a.Description -replace ' --.*$', '' -replace [char]0x2014 + '.*$', ''
    if ($shortDesc.Length -gt 30) { $shortDesc = $shortDesc.Substring(0, 30) + "..." }
    $agentsHtml += @"
      <div class="agent">
        <div class="agent-dot" style="background: $dotColor;"></div>
        <span class="agent-name">$($a.Name)</span>
        <span class="agent-role">$shortDesc</span>
        <span class="agent-scope $scopeClass">$($a.Scope)</span>
        <span class="agent-model">$($a.Model)</span>
      </div>
"@
}

# --- Tasks ---
$tasksHtml = ""
$sofortCount = 0; $wocheCount = 0; $backlogCount = 0; $doneCount = 0
if (Test-Path "$projectRoot\tasks.md") {
    $tasksContent = Get-Content "$projectRoot\tasks.md" -Encoding UTF8
    $currentGroup = ""; $doneItems = @(); $groupOpen = $false

    foreach ($line in $tasksContent) {
        if ($line -match '^## (SOFORT|DIESE WOCHE|BACKLOG|ERLEDIGT)') {
            if ($groupOpen) { $tasksHtml += "      </div>`n" }
            $currentGroup = $Matches[1]
            if ($currentGroup -ne "ERLEDIGT") {
                $groupClass = switch ($currentGroup) { "SOFORT" { "sofort" } "DIESE WOCHE" { "woche" } "BACKLOG" { "backlog" } }
                $tasksHtml += "      <div class=`"task-group`"><h3 class=`"$groupClass`">$currentGroup</h3>`n"
                $groupOpen = $true
            } else { $groupOpen = $false }
        }
        elseif ($line -match '^\- \[ \] (.+)$' -and $currentGroup -ne "ERLEDIGT") {
            $taskText = $Matches[1] -replace '<', '&lt;' -replace '>', '&gt;'
            $tasksHtml += "        <div class=`"task`">$taskText</div>`n"
            switch ($currentGroup) { "SOFORT" { $sofortCount++ } "DIESE WOCHE" { $wocheCount++ } "BACKLOG" { $backlogCount++ } }
        }
        elseif ($line -match '^\- \[x\] (.+)$') {
            $doneCount++
            if ($doneItems.Count -lt 3) { $doneItems += ($Matches[1] -replace '<', '&lt;' -replace '>', '&gt;') }
        }
    }
    if ($groupOpen) { $tasksHtml += "      </div>`n" }
    if ($doneCount -gt 0) {
        $tasksHtml += "      <div class=`"task-group`"><h3 class=`"erledigt`">ERLEDIGT ($doneCount)</h3>`n"
        foreach ($d in $doneItems) { $tasksHtml += "        <div class=`"task done`">$d</div>`n" }
        if ($doneCount -gt 3) { $tasksHtml += "        <div class=`"task done`" style=`"color:#555`">...und $($doneCount - 3) weitere</div>`n" }
        $tasksHtml += "      </div>`n"
    }
}

# --- Git ---
$gitBranch = git branch --show-current 2>$null
$gitStatus = git status --short 2>$null
$gitLog = git log --oneline -8 2>$null
$modifiedCount = @($gitStatus | Where-Object { $_ -match '^ ?M' }).Count
$untrackedCount = @($gitStatus | Where-Object { $_ -match '^\?\?' }).Count
$changesText = ""
if ($modifiedCount -gt 0) { $changesText += "$modifiedCount geaendert" }
if ($untrackedCount -gt 0) { if ($changesText) { $changesText += " / " }; $changesText += "$untrackedCount untracked" }
if (-not $changesText) { $changesText = "Clean" }
$commitsHtml = ""
foreach ($line in $gitLog) {
    if ($line -match '^([a-f0-9]+)\s+(.+)$') {
        $hash = $Matches[1]; $msg = $Matches[2] -replace '<', '&lt;' -replace '>', '&gt;'
        $commitsHtml += "      <div class=`"commit`"><span class=`"commit-hash`">$hash</span><span class=`"commit-msg`">$msg</span></div>`n"
    }
}

# --- Handoff ---
$handoffHtml = ""
if (Test-Path "$projectRoot\handoff.md") {
    $handoffContent = Get-Content "$projectRoot\handoff.md" -Raw -Encoding UTF8
    $handoffAgent = ""; $handoffZeit = ""; $handoffSession = ""
    $handoffErledigt = @(); $handoffOffen = @()
    if ($handoffContent -match '(?m)\*\*Agent:\*\*\s*(.+)$') { $handoffAgent = $Matches[1].Trim() }
    if ($handoffContent -match '(?m)\*\*Zeitpunkt:\*\*\s*(.+)$') { $handoffZeit = $Matches[1].Trim() }
    if ($handoffContent -match '(?m)\*\*Session:\*\*\s*(.+)$') { $handoffSession = $Matches[1].Trim() }
    if (-not $handoffSession -and $handoffContent -match '(?m)\*\*Auftrag:\*\*\s*(.+)$') { $handoffSession = $Matches[1].Trim() }
    if ($handoffContent -match '(?s)### Erledigt\r?\n(.+?)(?=\r?\n### )') {
        foreach ($eLine in ($Matches[1] -split "`n")) {
            if ($eLine -match '^\- \*\*(.+?)\*\*') { $handoffErledigt += ($Matches[1] -replace '<', '&lt;' -replace '>', '&gt;') }
            elseif ($eLine -match '^\- (.+)$') { $item = $Matches[1] -replace '<', '&lt;' -replace '>', '&gt;'; if ($item.Length -gt 80) { $item = $item.Substring(0, 77) + "..." }; $handoffErledigt += $item }
        }
    }
    if ($handoffContent -match '(?s)### Offen / Nicht fertig\r?\n(.+?)(?=\r?\n### )') {
        foreach ($oLine in ($Matches[1] -split "`n")) {
            if ($oLine -match '^\- (.+)$') { $item = $Matches[1] -replace '<', '&lt;' -replace '>', '&gt;'; if ($item.Length -gt 80) { $item = $item.Substring(0, 77) + "..." }; $handoffOffen += $item }
        }
    }
    if ($handoffAgent) {
        $handoffHtml += "      <div class=`"handoff-header`"><span class=`"handoff-agent`">$handoffAgent</span><span class=`"handoff-zeit`">$handoffZeit</span></div>`n"
        if ($handoffSession) { $ss = $handoffSession -replace '<','&lt;' -replace '>','&gt;'; if ($ss.Length -gt 80) { $ss = $ss.Substring(0,77)+"..." }; $handoffHtml += "      <div class=`"handoff-session`">$ss</div>`n" }
        if ($handoffErledigt.Count -gt 0) {
            $handoffHtml += "      <div class=`"handoff-section`"><span class=`"handoff-label done`">Erledigt</span>`n"
            $max = [Math]::Min($handoffErledigt.Count, 5); for ($i=0;$i -lt $max;$i++) { $handoffHtml += "        <div class=`"handoff-item done`">$($handoffErledigt[$i])</div>`n" }
            if ($handoffErledigt.Count -gt 5) { $handoffHtml += "        <div class=`"handoff-item`" style=`"color:#555`">...und $($handoffErledigt.Count-5) weitere</div>`n" }
            $handoffHtml += "      </div>`n"
        }
        if ($handoffOffen.Count -gt 0) {
            $handoffHtml += "      <div class=`"handoff-section`"><span class=`"handoff-label offen`">Offen</span>`n"
            foreach ($o in $handoffOffen) { $handoffHtml += "        <div class=`"handoff-item offen`">$o</div>`n" }
            $handoffHtml += "      </div>`n"
        }
    } else { $handoffHtml = "      <div class=`"empty-state`">Kein aktiver Handoff</div>" }
} else { $handoffHtml = "      <div class=`"empty-state`">handoff.md nicht gefunden</div>" }

# --- QA-Findings ---
$qaHtml = ""
if (Test-Path "$projectRoot\qa-findings.md") {
    $qaContent = Get-Content "$projectRoot\qa-findings.md" -Raw -Encoding UTF8
    if ($qaContent -match 'Noch keine Findings') {
        $qaHtml = "      <div class=`"empty-state good`">Keine offenen Findings</div>"
    } else {
        $qaLines = $qaContent -split "`n" | Where-Object { $_ -match '^\|' -and $_ -notmatch '^\|[-\s|]+$' -and $_ -notmatch '^\| Schwere' -and $_ -notmatch '^\| ---' }
        if ($qaLines.Count -gt 0) {
            foreach ($ql in $qaLines) {
                $cols = ($ql -split '\|' | Where-Object { $_.Trim() }) | ForEach-Object { $_.Trim() }
                if ($cols.Count -ge 3) {
                    $severity = $cols[0] -replace '<','&lt;' -replace '>','&gt;'
                    $finding = $cols[1] -replace '<','&lt;' -replace '>','&gt;'
                    $decision = if ($cols.Count -ge 4) { $cols[3] -replace '<','&lt;' -replace '>','&gt;' } else { "" }
                    $sevClass = switch -Wildcard ($severity.ToLower()) { "*kritisch*" { "kritisch" } "*mittel*" { "mittel" } "*niedrig*" { "niedrig" } default { "" } }
                    if ($finding.Length -gt 60) { $finding = $finding.Substring(0,57)+"..." }
                    $qaHtml += "      <div class=`"qa-finding`"><span class=`"qa-severity $sevClass`">$severity</span><span class=`"qa-text`">$finding</span><span class=`"qa-decision`">$decision</span></div>`n"
                }
            }
        } else { $qaHtml = "      <div class=`"empty-state good`">Keine offenen Findings</div>" }
    }
} else { $qaHtml = "      <div class=`"empty-state`">qa-findings.md nicht gefunden</div>" }

# --- Vault Stats ---
$vaultNotesCount = 0; $vaultLinksCount = 0; $vaultHtml = ""
if (Test-Path $vaultDir) {
    $vaultFiles = Get-ChildItem "$vaultDir\*.md" -Recurse | Where-Object { $_.FullName -notmatch '_Templates' }
    $vaultNotesCount = $vaultFiles.Count
    foreach ($vf in $vaultFiles) { $vaultLinksCount += [regex]::Matches((Get-Content $vf.FullName -Raw), '\[\[.+?\]\]').Count }
    $vaultSubDirs = Get-ChildItem $vaultDir -Directory | Where-Object { $_.Name -ne '_Templates' -and $_.Name -ne '.obsidian' }
    $vaultFolders = @()
    foreach ($sd in $vaultSubDirs) { $c = @(Get-ChildItem "$($sd.FullName)\*.md").Count; if ($c -gt 0) { $vaultFolders += [PSCustomObject]@{ Name = $sd.Name; Count = $c } } }
    $vaultHtml += "      <div class=`"vault-stats`">`n"
    $vaultHtml += "        <div class=`"vault-stat`"><span class=`"vault-number`">$vaultNotesCount</span><span class=`"vault-label`">Notizen</span></div>`n"
    $vaultHtml += "        <div class=`"vault-stat`"><span class=`"vault-number`">$vaultLinksCount</span><span class=`"vault-label`">[[Links]]</span></div>`n"
    $vaultHtml += "        <div class=`"vault-stat`"><span class=`"vault-number`">$($vaultSubDirs.Count)</span><span class=`"vault-label`">Ordner</span></div>`n"
    $vaultHtml += "      </div>`n"
    $vaultHtml += "      <div class=`"vault-folders`">`n"
    $maxCount = ($vaultFolders | Measure-Object -Property Count -Maximum).Maximum
    foreach ($vf in ($vaultFolders | Sort-Object Count -Descending)) {
        $barWidth = [Math]::Min(100, [Math]::Round(($vf.Count / [Math]::Max(1, $maxCount)) * 100))
        $vaultHtml += "        <div class=`"vault-folder`"><span class=`"vault-folder-name`">$($vf.Name)</span><div class=`"vault-bar`"><div class=`"vault-bar-fill`" style=`"width:${barWidth}%`"></div></div><span class=`"vault-folder-count`">$($vf.Count)</span></div>`n"
    }
    $vaultHtml += "      </div>`n"
} else { $vaultHtml = "      <div class=`"empty-state`">Vault nicht gefunden</div>" }

# --- Learnings (neues Index-Format) ---
$learningsHtml = ""; $totalLearnings = 0
if (Test-Path "$projectRoot\learnings.md") {
    $learningsContent = Get-Content "$projectRoot\learnings.md" -Encoding UTF8
    $currentDate = ""; $learningItems = @()
    foreach ($line in $learningsContent) {
        if ($line -match '^## (\d{4}-\d{2}-\d{2})') { $currentDate = $Matches[1] }
        elseif ($line -match '^\- (.+)$' -and $currentDate) { $learningItems += [PSCustomObject]@{ Date = $currentDate; Text = $Matches[1].Trim() } }
    }
    $totalLearnings = $learningItems.Count
    $showCount = [Math]::Min(8, $learningItems.Count)
    for ($i=0;$i -lt $showCount;$i++) {
        $text = $learningItems[$i].Text -replace '<','&lt;' -replace '>','&gt;'
        if ($text.Length -gt 90) { $text = $text.Substring(0,87)+"..." }
        $learningsHtml += "      <div class=`"learning`"><span class=`"learning-date`">$($learningItems[$i].Date)</span><span class=`"learning-text`">$text</span></div>`n"
    }
    if ($learningItems.Count -gt 8) { $learningsHtml += "      <div class=`"learning`" style=`"color:#555`">...und $($learningItems.Count - 8) weitere</div>`n" }
}

# --- Automationen ---
$triggersHtml = ""; $anyTaskFound = $false
foreach ($tn in @("VetApp-Dokumentar-Morgens", "VetApp-Dokumentar-Abends")) {
    $taskInfo = schtasks /query /fo LIST /tn $tn 2>$null
    if ($LASTEXITCODE -eq 0 -and $taskInfo) {
        $anyTaskFound = $true; $nextRun = ""; $status = ""
        foreach ($il in $taskInfo) {
            if ($il -match 'chste Laufzeit:\s*(.+)$') { $nextRun = $Matches[1].Trim() }
            if ($il -match 'Next Run Time:\s*(.+)$') { $nextRun = $Matches[1].Trim() }
            if ($il -match 'Status:\s*(.+)$') { $status = $Matches[1].Trim() }
        }
        $dn = $tn -replace 'VetApp-', ''
        $triggersHtml += "      <div class=`"trigger`"><div><div class=`"trigger-name`">$dn</div><div class=`"trigger-time`">Naechster Lauf: $nextRun</div></div><span class=`"trigger-status`">$status</span></div>`n"
    }
}
if (-not $anyTaskFound) { $triggersHtml = "      <div class=`"empty-state`">Noch nicht eingerichtet (Backlog)</div>" }

# --- Zeitstempel ---
$timestamp = Get-Date -Format "dd.MM.yyyy 'um' HH:mm 'Uhr'"

# --- HTML generieren ---
# (Nutzt exakt dasselbe CSS/Layout wie dashboard-server.ps1 — bei Aenderungen beide synchron halten!)
$html = @"
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dev-Agentur Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0f0f1a; color: #e0e0e8; padding: 24px; line-height: 1.5; }
    h1 { font-size: 28px; color: #fff; margin-bottom: 4px; }
    .subtitle { color: #888; font-size: 14px; margin-bottom: 16px; }
    .kpi-row { display: flex; gap: 16px; margin-bottom: 20px; padding: 12px 16px; background: #1a1a2e; border: 1px solid #2a2a3e; border-radius: 12px; }
    .kpi { text-align: center; flex: 1; }
    .kpi-value { display: block; font-size: 24px; font-weight: 700; color: #fff; }
    .kpi-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; }
    .kpi-label.sofort { color: #f27474; } .kpi-label.woche { color: #f2c94c; } .kpi-label.backlog { color: #74b4f2; } .kpi-label.erledigt { color: #6fcf97; }
    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .grid-2 { grid-template-columns: 1fr 1fr; }
    .card { background: #1a1a2e; border: 1px solid #2a2a3e; border-radius: 12px; padding: 20px; transition: border-color 0.2s; }
    .card:hover { border-color: #4a4a6e; }
    .card h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 16px; }
    .card.span-2 { grid-column: span 2; }
    .agent { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #2a2a3e; }
    .agent:last-child { border-bottom: none; }
    .agent-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .agent-name { font-weight: 600; color: #fff; min-width: 100px; }
    .agent-role { color: #aaa; font-size: 13px; }
    .agent-model { margin-left: auto; font-size: 11px; padding: 2px 8px; border-radius: 4px; background: #2a2a3e; color: #aaa; }
    .agent-scope { font-size: 10px; padding: 2px 6px; border-radius: 4px; background: #1e3a2e; color: #6fcf97; }
    .agent-scope.project { background: #3a2e1e; color: #f2c94c; }
    .task-group { margin-bottom: 16px; } .task-group:last-child { margin-bottom: 0; }
    .task-group h3 { font-size: 12px; font-weight: 700; margin-bottom: 8px; padding: 2px 8px; border-radius: 4px; display: inline-block; }
    .task-group h3.sofort { background: #3e1a1a; color: #f27474; } .task-group h3.woche { background: #3e2e1a; color: #f2c94c; }
    .task-group h3.backlog { background: #1a2e3e; color: #74b4f2; } .task-group h3.erledigt { background: #1e3a2e; color: #6fcf97; }
    .task { font-size: 13px; padding: 4px 0; color: #ccc; }
    .task::before { content: ''; display: inline-block; width: 8px; height: 8px; border: 1.5px solid #555; border-radius: 2px; margin-right: 8px; vertical-align: middle; }
    .task.done { color: #666; text-decoration: line-through; } .task.done::before { background: #6fcf97; border-color: #6fcf97; }
    .handoff-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .handoff-agent { font-weight: 700; color: #fff; font-size: 16px; }
    .handoff-zeit { color: #888; font-size: 12px; }
    .handoff-session { color: #aaa; font-size: 13px; margin-bottom: 12px; font-style: italic; }
    .handoff-section { margin-bottom: 10px; }
    .handoff-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; padding: 1px 6px; border-radius: 3px; margin-bottom: 6px; }
    .handoff-label.done { background: #1e3a2e; color: #6fcf97; } .handoff-label.offen { background: #3e2e1a; color: #f2c94c; }
    .handoff-item { font-size: 13px; color: #ccc; padding: 2px 0; padding-left: 12px; }
    .handoff-item::before { content: '- '; color: #555; } .handoff-item.offen { color: #f2c94c; }
    .qa-finding { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #2a2a3e; }
    .qa-finding:last-child { border-bottom: none; }
    .qa-severity { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; flex-shrink: 0; min-width: 60px; text-align: center; }
    .qa-severity.kritisch { background: #3e1a1a; color: #f27474; } .qa-severity.mittel { background: #3e2e1a; color: #f2c94c; } .qa-severity.niedrig { background: #1a2e3e; color: #74b4f2; }
    .qa-text { color: #ccc; font-size: 13px; flex: 1; } .qa-decision { color: #888; font-size: 11px; flex-shrink: 0; }
    .commit { font-size: 13px; padding: 6px 0; border-bottom: 1px solid #2a2a3e; display: flex; gap: 10px; }
    .commit:last-child { border-bottom: none; }
    .commit-hash { font-family: 'Consolas', monospace; color: #7b68ee; font-size: 12px; flex-shrink: 0; }
    .commit-msg { color: #ccc; }
    .git-badge { display: inline-block; padding: 2px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-right: 8px; }
    .git-branch { background: #1e3a2e; color: #6fcf97; } .git-changes { background: #3e2e1a; color: #f2c94c; }
    .vault-stats { display: flex; gap: 16px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #2a2a3e; }
    .vault-stat { text-align: center; flex: 1; } .vault-number { display: block; font-size: 20px; font-weight: 700; color: #3b82f6; } .vault-label { font-size: 11px; color: #888; }
    .vault-folders { margin-bottom: 16px; }
    .vault-folder { display: flex; align-items: center; gap: 8px; padding: 3px 0; font-size: 12px; }
    .vault-folder-name { color: #aaa; min-width: 90px; }
    .vault-bar { flex: 1; height: 6px; background: #2a2a3e; border-radius: 3px; overflow: hidden; }
    .vault-bar-fill { height: 100%; background: #3b82f6; border-radius: 3px; } .vault-folder-count { color: #888; min-width: 20px; text-align: right; }
    .learning { display: flex; gap: 10px; padding: 5px 0; border-bottom: 1px solid #2a2a3e; font-size: 13px; }
    .learning:last-child { border-bottom: none; } .learning-date { color: #888; font-size: 11px; flex-shrink: 0; min-width: 72px; } .learning-text { color: #ccc; }
    .trigger { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #2a2a3e; }
    .trigger:last-child { border-bottom: none; } .trigger-name { font-weight: 600; color: #fff; } .trigger-time { color: #aaa; font-size: 13px; }
    .trigger-status { font-size: 11px; padding: 2px 8px; border-radius: 4px; background: #1e3a2e; color: #6fcf97; }
    .empty-state { color: #555; font-size: 13px; font-style: italic; padding: 8px 0; } .empty-state.good { color: #6fcf97; }
    .footer { text-align: center; color: #444; font-size: 12px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #2a2a3e; }
  </style>
</head>
<body>
  <h1>Dev-Agentur Dashboard</h1>
  <p class="subtitle">VetApp &mdash; generiert $timestamp</p>

  <div class="kpi-row">
    <div class="kpi"><span class="kpi-value">$($projectAgents.Count + $globalAgents.Count)</span><span class="kpi-label">Agents</span></div>
    <div class="kpi"><span class="kpi-value">$sofortCount</span><span class="kpi-label sofort">Sofort</span></div>
    <div class="kpi"><span class="kpi-value">$wocheCount</span><span class="kpi-label woche">Diese Woche</span></div>
    <div class="kpi"><span class="kpi-value">$backlogCount</span><span class="kpi-label backlog">Backlog</span></div>
    <div class="kpi"><span class="kpi-value">$doneCount</span><span class="kpi-label erledigt">Erledigt</span></div>
    <div class="kpi"><span class="kpi-value">$vaultNotesCount</span><span class="kpi-label">Vault-Notizen</span></div>
    <div class="kpi"><span class="kpi-value">$totalLearnings</span><span class="kpi-label">Learnings</span></div>
  </div>

  <div class="grid">
    <div class="card"><h2>Agenten</h2>
$agentsHtml
    </div>
    <div class="card span-2"><h2>Aufgaben</h2>
$tasksHtml
    </div>
  </div>

  <div class="grid grid-2">
    <div class="card"><h2>Letzte Uebergabe</h2>
$handoffHtml
    </div>
    <div class="card"><h2>QA-Findings</h2>
$qaHtml
    </div>
  </div>

  <div class="grid grid-2">
    <div class="card"><h2>Git</h2>
      <div style="margin-bottom: 12px;"><span class="git-badge git-branch">$gitBranch</span><span class="git-badge git-changes">$changesText</span></div>
$commitsHtml
    </div>
    <div class="card"><h2>Agency Vault</h2>
$vaultHtml
      <h2 style="margin-top: 16px;">Learnings ($totalLearnings)</h2>
$learningsHtml
    </div>
  </div>

  <div class="grid grid-2">
    <div class="card"><h2>Automationen</h2>
$triggersHtml
    </div>
    <div class="card" style="display:flex;align-items:center;justify-content:center;">
      <div style="text-align:center;color:#333;font-size:13px;">Platz fuer weitere Karten</div>
    </div>
  </div>

  <p class="footer">Dev-Agentur von Claas &mdash; $timestamp</p>
</body>
</html>
"@

$html | Out-File -FilePath $outputFile -Encoding UTF8
Write-Host "Dashboard v2 generiert: $outputFile"
