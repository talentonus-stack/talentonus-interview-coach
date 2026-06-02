-- Create table for interviews
create table if not exists interviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  job_title text not null,
  experience_level text not null,
  interview_type text not null,
  status text default 'setup' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for interviews
alter table interviews enable row level security;

create policy "Users can view their own interviews." on interviews
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own interviews." on interviews
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own interviews." on interviews
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
