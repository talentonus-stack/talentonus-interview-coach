'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { generateInterviewQuestions } from './utils/questionGenerator'

export async function startInterview(formData: FormData) {
  const supabase = await createClient()

  // Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Parse form data
  const industry = formData.get('industry') as string
  const department = formData.get('department') as string
  const jobTitle = formData.get('jobTitle') as string
  const experienceLevel = formData.get('experienceLevel') as string
  const interviewType = formData.get('interviewType') as string
  const difficultyLevel = formData.get('difficultyLevel') as string || 'Medium'
  const questionCount = parseInt(formData.get('questionCount') as string || '10', 10)
  const durationMinutes = parseInt(formData.get('durationMinutes') as string || '30', 10)

  // Parse skills
  const skillsStr = formData.get('skills') as string
  const skills = skillsStr ? JSON.parse(skillsStr) : []

  // Handle optional resume upload
  let resumeUrl = null
  const resumeFile = formData.get('resume') as File

  if (resumeFile && resumeFile.size > 0) {
    const fileExt = resumeFile.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, resumeFile)

    if (uploadError) {
      console.error('Failed to upload resume:', uploadError)
      redirect(`/dashboard/interview/setup?error=${encodeURIComponent('Failed to upload resume.')}`)
    }

    resumeUrl = filePath
  }

  // Generate dynamic questions
  const generatedQuestions = generateInterviewQuestions({
    industry,
    department,
    skills,
    jobTitle,
    interviewType,
    questionCount
  })

  // Insert into Supabase 'interviews' table
  const { data, error } = await supabase
    .from('interviews')
    .insert([
      {
        user_id: user.id,
        industry: industry,
        department: department,
        job_title: jobTitle,
        experience_level: experienceLevel,
        interview_type: interviewType,
        difficulty_level: difficultyLevel,
        question_count: questionCount,
        duration_minutes: durationMinutes,
        skills: skills,
        resume_url: resumeUrl,
        generated_questions: generatedQuestions,
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
