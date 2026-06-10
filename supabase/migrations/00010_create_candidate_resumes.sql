-- Create table for candidate_resumes
create table if not exists candidate_resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  resume_url text not null,
  parsed_data jsonb,
  resume_score integer default 0,
  candidate_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for candidate_resumes
alter table candidate_resumes enable row level security;

create policy "Users can view their own resume." on candidate_resumes
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own resume." on candidate_resumes
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own resume." on candidate_resumes
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own resume." on candidate_resumes
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
