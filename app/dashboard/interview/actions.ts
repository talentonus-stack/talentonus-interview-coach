'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function startInterview(formData: FormData) {
  const supabase = await createClient()

  // Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Parse form data
  const jobTitle = formData.get('jobTitle') as string
  const experienceLevel = formData.get('experienceLevel') as string
  const interviewType = formData.get('interviewType') as string

  // Insert into Supabase 'interviews' table
  const { data, error } = await supabase
    .from('interviews')
    .insert([
      {
        user_id: user.id,
        job_title: jobTitle,
        experience_level: experienceLevel,
        interview_type: interviewType,
        status: 'setup',
      },
    ])
    .select()
    .single()

  if (error || !data) {
    console.error('Failed to create interview:', error)
    const errorMessage = error?.message || 'An unexpected error occurred while creating the interview.'
    redirect(`/dashboard/interview/setup?error=${encodeURIComponent(errorMessage)}`)
  }

  // Redirect to the interview session page
  redirect(`/dashboard/interview/session/${data.id}`)
}
