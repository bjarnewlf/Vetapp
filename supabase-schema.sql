-- VetApp Database Schema
-- Run this in the Supabase SQL Editor

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  phone text,
  photo_url text,
  is_premium boolean default false,
  created_at timestamptz default now()
);

-- Pets table
create table public.pets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  type text not null,
  breed text,
  birth_date date,
  photo_url text,
  microchip_code text,
  created_at timestamptz default now()
);

-- Reminders table
create table public.reminders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  pet_id uuid references public.pets on delete cascade,
  title text not null,
  date date not null,
  description text,
  recurrence text default 'Once',
  status text default 'upcoming',
  created_at timestamptz default now()
);

-- Vaccinations table
create table public.vaccinations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  pet_id uuid references public.pets on delete cascade not null,
  name text not null,
  given_date date not null,
  next_date date,
  recurrence_interval text,
  created_at timestamptz default now()
);

-- Treatments table
create table public.treatments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  pet_id uuid references public.pets on delete cascade not null,
  name text not null,
  date date not null,
  notes text,
  created_at timestamptz default now()
);

-- Vet contacts table
create table public.vet_contacts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  clinic text,
  phone text,
  email text,
  address text,
  created_at timestamptz default now()
);

-- Documents table (Pro feature)
create table public.documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  pet_id uuid references public.pets on delete cascade not null,
  name text not null,
  file_url text not null,
  file_type text,
  file_size integer,
  created_at timestamptz default now()
);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.reminders enable row level security;
alter table public.vaccinations enable row level security;
alter table public.treatments enable row level security;
alter table public.vet_contacts enable row level security;
alter table public.documents enable row level security;

-- RLS Policies: Users can only see/edit their own data
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view own pets" on public.pets for select using (auth.uid() = user_id);
create policy "Users can insert own pets" on public.pets for insert with check (auth.uid() = user_id);
create policy "Users can update own pets" on public.pets for update using (auth.uid() = user_id);
create policy "Users can delete own pets" on public.pets for delete using (auth.uid() = user_id);

create policy "Users can view own reminders" on public.reminders for select using (auth.uid() = user_id);
create policy "Users can insert own reminders" on public.reminders for insert with check (auth.uid() = user_id);
create policy "Users can update own reminders" on public.reminders for update using (auth.uid() = user_id);
create policy "Users can delete own reminders" on public.reminders for delete using (auth.uid() = user_id);

create policy "Users can view own vaccinations" on public.vaccinations for select using (auth.uid() = user_id);
create policy "Users can insert own vaccinations" on public.vaccinations for insert with check (auth.uid() = user_id);
create policy "Users can update own vaccinations" on public.vaccinations for update using (auth.uid() = user_id);
create policy "Users can delete own vaccinations" on public.vaccinations for delete using (auth.uid() = user_id);

create policy "Users can view own treatments" on public.treatments for select using (auth.uid() = user_id);
create policy "Users can insert own treatments" on public.treatments for insert with check (auth.uid() = user_id);
create policy "Users can update own treatments" on public.treatments for update using (auth.uid() = user_id);
create policy "Users can delete own treatments" on public.treatments for delete using (auth.uid() = user_id);

create policy "Users can view own documents" on public.documents for select using (auth.uid() = user_id);
create policy "Users can insert own documents" on public.documents for insert with check (auth.uid() = user_id);
create policy "Users can update own documents" on public.documents for update using (auth.uid() = user_id);
create policy "Users can delete own documents" on public.documents for delete using (auth.uid() = user_id);

create policy "Users can view own vet contacts" on public.vet_contacts for select using (auth.uid() = user_id);
create policy "Users can insert own vet contacts" on public.vet_contacts for insert with check (auth.uid() = user_id);
create policy "Users can update own vet contacts" on public.vet_contacts for update using (auth.uid() = user_id);
create policy "Users can delete own vet contacts" on public.vet_contacts for delete using (auth.uid() = user_id);

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
