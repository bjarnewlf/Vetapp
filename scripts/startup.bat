@echo off
echo === Dev-Agentur Startup ===

:: Dashboard-Server im Hintergrund starten
start /min "DevAgentur-Dashboard" powershell -ExecutionPolicy Bypass -WindowStyle Minimized -File "C:\Users\claas\claude-workspace\VetApp\scripts\dashboard-server.ps1"

:: Kurz warten bis Server bereit ist
timeout /t 2 /nobreak >nul

:: Browser oeffnen
start "" "http://localhost:3333"

echo Fertig. Dashboard laeuft auf http://localhost:3333
