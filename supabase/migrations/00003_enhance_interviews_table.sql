-- Add new columns to the interviews table
alter table public.interviews
add column if not exists skills text[] default '{}',
add column if not exists difficulty_level text default 'Medium',
add column if not exists question_count integer default 5,
add column if not exists duration_minutes integer default 30,
add column if not exists resume_url text;

-- Create the storage bucket for resumes if it doesn't exist
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

-- Enable RLS on storage.objects
alter table storage.objects enable row level security;

-- Policy to allow authenticated users to upload their own resumes
create policy "Users can upload their own resumes"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow authenticated users to read their own resumes
create policy "Users can read their own resumes"
on storage.objects for select
to authenticated
using (
  bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text
);
