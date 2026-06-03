-- This migration ensures that all required columns for the enhanced interview setup exist.
-- It is safe to run multiple times.

alter table public.interviews
add column if not exists industry text,
add column if not exists department text,
add column if not exists skills text[] default '{}',
add column if not exists difficulty_level text default 'Medium',
add column if not exists question_count integer default 10,
add column if not exists duration_minutes integer default 30,
add column if not exists resume_url text;

-- Update the default value for question_count in case it was previously set to 5
alter table public.interviews alter column question_count set default 10;

-- Refresh the schema cache so postgREST picks up the new columns immediately
NOTIFY pgrst, 'reload schema';
