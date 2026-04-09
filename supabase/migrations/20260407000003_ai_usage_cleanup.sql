-- SA-06: Index fuer ai_usage Cleanup-Queries
-- Die ai_usage Tabelle waechst unbegrenzt. Dieser Index beschleunigt
-- periodische Cleanup-Queries (DELETE WHERE created_at < ...).
create index if not exists idx_ai_usage_created_at on public.ai_usage(created_at);

-- Cleanup-Query (manuell oder per pg_cron ausfuehren):
-- DELETE FROM public.ai_usage WHERE created_at < now() - interval '90 days';
