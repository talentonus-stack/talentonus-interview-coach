-- Add industry and department columns to the interviews table
alter table public.interviews
add column if not exists industry text,
add column if not exists department text;

-- Change the default question count from 5 to 10 based on new requirements
alter table public.interviews
alter column question_count set default 10;
