@echo off
cd /d C:\Users\claas\claude-workspace\VetApp
claude -p --agent dokumentar --permission-mode auto "Dokumentiere den aktuellen Entwicklungsfortschritt. Pruefe Git-History seit dem letzten Changelog und erstelle/aktualisiere die Dokumentation."
