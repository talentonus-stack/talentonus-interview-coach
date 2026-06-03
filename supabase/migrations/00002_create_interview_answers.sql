-- Create table for interview answers
create table if not exists interview_answers (
  id uuid default gen_random_uuid() primary key,
  interview_id uuid references public.interviews(id) on delete cascade not null,
  question text not null,
  answer text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
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
