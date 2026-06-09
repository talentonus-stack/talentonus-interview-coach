-- Add recruiter_feedback column to interview_answers table
alter table public.interview_answers
add column if not exists recruiter_feedback text;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
