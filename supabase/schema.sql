-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Create table for interviews
create table interviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  job_title text not null,
  experience_level text not null,
  interview_type text not null,
  status text default 'setup' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  industry text,
  department text,
  skills text[] default '{}',
  difficulty_level text default 'Medium',
  question_count integer default 10,
  duration_minutes integer default 30,
  resume_url text,
  generated_questions text[] default '{}',
  overall_score integer,
  performance_grade text,
  strengths text[] default '{}',
  improvement_areas text[] default '{}',
  recommended_learning text[] default '{}',
  candidate_type text default 'Experienced',
  extracted_data jsonb
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

-- Create table for interview answers
create table interview_answers (
  id uuid default gen_random_uuid() primary key,
  interview_id uuid references public.interviews(id) on delete cascade not null,
  question text not null,
  answer text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ai_feedback text,
  recommended_answer text,
  score integer
);

-- Set up RLS for interview_answers
alter table interview_answers enable row level security;

-- Users can view answers if they own the parent interview
create policy "Users can view their own interview answers" on interview_answers
  for select
  to authenticated
  using (
    exists (
      select 1 from public.interviews
      where interviews.id = interview_answers.interview_id
      and interviews.user_id = auth.uid()
    )
  );

-- Users can insert answers if they own the parent interview
create policy "Users can insert their own interview answers" on interview_answers
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.interviews
      where interviews.id = interview_id
      and interviews.user_id = auth.uid()
    )
  );

-- Users can update answers if they own the parent interview
create policy "Users can update their own interview answers" on interview_answers
  for update
  to authenticated
  using (
    exists (
      select 1 from public.interviews
      where interviews.id = interview_answers.interview_id
      and interviews.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.interviews
      where interviews.id = interview_id
      and interviews.user_id = auth.uid()
    )
  );
