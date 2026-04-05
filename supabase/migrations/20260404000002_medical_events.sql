-- Migration: MedicalEvent-Tabelle (vereinheitlichtes Gesundheits-Datenmodell)
-- Loest vaccinations + treatments in einem einheitlichen Modell ab.
-- Alte Tabellen bleiben erhalten (kein DROP).

-- Tabelle erstellen
create table public.medical_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  pet_id uuid references public.pets on delete cascade not null,
  type text not null check (type in ('vaccination', 'deworming', 'checkup', 'custom')),
  name text not null,
  date date not null,
  next_date date,
  notes text,
  recurrence_interval text,
  created_at timestamptz default now()
);

-- RLS aktivieren
alter table public.medical_events enable row level security;

-- Policies (analog zu vaccinations/treatments)
create policy "Users can view own medical events"
  on public.medical_events for select
  using (auth.uid() = user_id);

create policy "Users can insert own medical events"
  on public.medical_events for insert
  with check (auth.uid() = user_id);

create policy "Users can update own medical events"
  on public.medical_events for update
  using (auth.uid() = user_id);

create policy "Users can delete own medical events"
  on public.medical_events for delete
  using (auth.uid() = user_id);

-- Daten-Migration: Impfungen -> medical_events (type='vaccination')
insert into public.medical_events (user_id, pet_id, type, name, date, next_date, notes, recurrence_interval, created_at)
select
  user_id,
  pet_id,
  'vaccination',
  name,
  given_date,
  next_date,
  null,
  recurrence_interval,
  created_at
from public.vaccinations;

-- Daten-Migration: Behandlungen -> medical_events (type='checkup')
insert into public.medical_events (user_id, pet_id, type, name, date, next_date, notes, recurrence_interval, created_at)
select
  user_id,
  pet_id,
  'checkup',
  name,
  date,
  null,
  notes,
  null,
  created_at
from public.treatments;
