-- Migration: CHECK-Constraint fuer recurrence_interval in medical_events
-- Erlaubte Werte: NULL, 'Once', 'Weekly', 'Monthly', 'Yearly', 'Custom'

alter table public.medical_events
  add constraint medical_events_recurrence_interval_check
  check (recurrence_interval is null or recurrence_interval in ('Once', 'Weekly', 'Monthly', 'Yearly', 'Custom'));
