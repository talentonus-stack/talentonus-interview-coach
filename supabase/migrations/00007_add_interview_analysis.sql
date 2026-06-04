-- Add analysis columns to interviews table
alter table public.interviews
add column if not exists overall_score integer,
add column if not exists performance_grade text,
add column if not exists strengths text[] default '{}',
add column if not exists improvement_areas text[] default '{}',
add column if not exists recommended_learning text[] default '{}';

-- Add feedback columns to interview_answers table
alter table public.interview_answers
add column if not exists ai_feedback text,
add column if not exists recommended_answer text,
add column if not exists score integer;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
