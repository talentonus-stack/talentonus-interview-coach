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
  const candidateType = formData.get('candidateType') as string || 'Experienced'
  const experienceLevel = formData.get('experienceLevel') as string
  const interviewType = formData.get('interviewType') as string
  const difficultyLevel = formData.get('difficultyLevel') as string || 'Medium'
  const questionCount = parseInt(formData.get('questionCount') as string || '10', 10)
  const durationMinutes = parseInt(formData.get('durationMinutes') as string || '30', 10)

  // Parse skills
  const skillsStr = formData.get('skills') as string
  const skills = skillsStr ? JSON.parse(skillsStr) : []

  let extractedData = null
  let finalCandidateType = candidateType
  let finalResumeUrl = null

  // Check if user has a parsed resume saved in candidate_resumes
  const { data: resumeRecord } = await supabase
    .from('candidate_resumes')
    .select('parsed_data, candidate_type, resume_url')
    .eq('user_id', user.id)
    .single()

  if (resumeRecord && resumeRecord.parsed_data) {
    extractedData = {
      name: [resumeRecord.parsed_data.personal_information?.full_name],
      technologies: resumeRecord.parsed_data.skills?.technical || [],
      job_titles: [resumeRecord.parsed_data.professional_information?.current_designation],
      education: resumeRecord.parsed_data.education?.map((e: { degree: string }) => e.degree) || [],
      skills: [
        ...(resumeRecord.parsed_data.skills?.technical || []),
        ...(resumeRecord.parsed_data.skills?.functional || []),
        ...(resumeRecord.parsed_data.skills?.soft || [])
      ],
      certifications: resumeRecord.parsed_data.certifications || [],
      projects: resumeRecord.parsed_data.projects?.map((p: { name: string }) => p.name) || [],
      experience: resumeRecord.parsed_data.professional_information?.previous_companies || []
    }

    // Auto-detect fresher/experienced from the saved resume if available
    finalCandidateType = resumeRecord.candidate_type || candidateType
    finalResumeUrl = resumeRecord.resume_url
  }

  // Generate dynamic questions
  const generatedQuestions = generateInterviewQuestions({
    industry,
    department,
    skills,
    jobTitle,
    interviewType,
    questionCount,
    candidateType: finalCandidateType,
    extractedData: extractedData || undefined
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
        candidate_type: finalCandidateType,
        experience_level: experienceLevel,
        interview_type: interviewType,
        difficulty_level: difficultyLevel,
        question_count: questionCount,
        duration_minutes: durationMinutes,
        skills: skills,
        resume_url: finalResumeUrl,
        extracted_data: extractedData,
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

  // If we extracted data from a resume, route to confirmation page first
  if (extractedData) {
    redirect(`/dashboard/interview/${data.id}/confirm`)
  }

  // Redirect directly to the interview session page if no resume
  redirect(`/dashboard/interview/session/${data.id}`)
}
