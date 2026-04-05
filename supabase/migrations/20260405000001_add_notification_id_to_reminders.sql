-- Migration: notification_id Spalte zur reminders-Tabelle hinzufuegen
-- Erstellt: 2026-04-05
-- Behoert zu: F-11 Push Notifications
--
-- Hintergrund:
--   Expo Notifications vergibt beim Planen einer Push-Benachrichtigung eine
--   lokale Notification-ID. Diese ID wird benoetigt um die Benachrichtigung
--   spaeter stornieren zu koennen (z.B. wenn eine Erinnerung abgehakt oder
--   geloescht wird). Der MedicalContext liest und schreibt notification_id
--   bereits (row.notification_id, insert/update), die Spalte fehlte bisher
--   in der Produktions-Datenbank.
--
-- Ausfuehren:
--   Option A (Supabase CLI):
--     npx supabase db push
--
--   Option B (Supabase Dashboard SQL Editor):
--     Inhalt dieser Datei kopieren und im SQL Editor ausfuehren.
--     Dashboard: https://supabase.com/dashboard → Projekt → SQL Editor
--
-- Idempotent: IF NOT EXISTS Guard verhindert Fehler bei Mehrfach-Ausfuehrung.

ALTER TABLE public.reminders
  ADD COLUMN IF NOT EXISTS notification_id TEXT;

COMMENT ON COLUMN public.reminders.notification_id IS
  'Expo Push Notification ID — wird beim Planen gesetzt, beim Abschluss/Loeschung zum Stornieren verwendet.';
