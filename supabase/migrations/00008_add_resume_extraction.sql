-- Add candidate_type and extracted_data columns to interviews table
alter table public.interviews
add column if not exists candidate_type text default 'Experienced',
add column if not exists extracted_data jsonb;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
