-- Add generated_questions column to interviews table to store dynamically created questions
alter table public.interviews
add column if not exists generated_questions text[] default '{}';

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
