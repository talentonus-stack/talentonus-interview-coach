'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { analyzeInterview } from './utils/analyzer'
import { generateInterviewQuestions } from './utils/questionGenerator'
import { generateDynamicFollowUp, InterviewContext } from './utils/dynamicQuestionGenerator'

export async function confirmExtractedData(formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const interviewId = formData.get('interviewId') as string
  const extractedData = {
    name: (formData.get('name') as string)?.split('\n').filter(Boolean) || [],
    job_titles: (formData.get('job_titles') as string)?.split('\n').filter(Boolean) || [],
    technologies: (formData.get('technologies') as string)?.split('\n').filter(Boolean) || [],
    skills: (formData.get('skills') as string)?.split('\n').filter(Boolean) || [],
    education: (formData.get('education') as string)?.split('\n').filter(Boolean) || [],
    experience: (formData.get('experience') as string)?.split('\n').filter(Boolean) || [],
    projects: (formData.get('projects') as string)?.split('\n').filter(Boolean) || [],
    certifications: (formData.get('certifications') as string)?.split('\n').filter(Boolean) || [],
  }

  // Fetch existing interview data to regenerate questions with the *updated* extracted data
  const { data: interview } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', interviewId)
    .single()

  if (interview) {
    const updatedQuestions = generateInterviewQuestions({
      industry: interview.industry,
      department: interview.department,
      skills: interview.skills,
      jobTitle: interview.job_title,
      interviewType: interview.interview_type,
      questionCount: interview.question_count,
      candidateType: interview.candidate_type,
      extractedData: extractedData
    })

    const { error } = await supabase
      .from('interviews')
      .update({
        extracted_data: extractedData,
        generated_questions: updatedQuestions
      })
      .eq('id', interviewId)

    if (error) {
      console.error('Failed to update extracted data and questions:', error)
    }
  }

  redirect(`/dashboard/interview/session/${interviewId}`)
}

export async function submitConversationalAnswer(interviewId: string, question: string, answer: string) {
  const supabase = await createClient()

  // 1. Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // 2. Fetch the interview context
  const { data: interview, error: interviewError } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', interviewId)
    .single()

  if (interviewError || !interview) {
    return { error: 'Interview not found.' }
  }

  // 3. Save the answer
  if (question && answer) {
    const { error: insertError } = await supabase
      .from('interview_answers')
      .insert([{
        interview_id: interviewId,
        question: question,
        answer: answer,
      }])

    if (insertError) {
      console.error('Failed to save answer:', insertError)
      return { error: insertError.message || 'An unknown error occurred while saving your answer.' }
    }
  }

  // 4. Fetch all answers to determine state
  const { data: answers, error: fetchAnswersError } = await supabase
    .from('interview_answers')
    .select('question, answer')
    .eq('interview_id', interviewId)
    .order('created_at', { ascending: true })

  if (fetchAnswersError) {
    return { error: 'Failed to fetch conversation history.' }
  }

  const currentQuestionCount = answers ? answers.length : 0

  // 5. Check if interview is complete
  if (currentQuestionCount >= interview.question_count) {
    // Return a flag indicating the UI should call completeInterview
    return { isComplete: true }
  }

  // 6. Generate the next dynamic question
  const context: InterviewContext = {
    industry: interview.industry,
    department: interview.department,
    skills: interview.skills || [],
    jobTitle: interview.job_title,
    interviewType: interview.interview_type,
    questionCount: interview.question_count,
    candidateType: interview.candidate_type,
    extractedData: interview.extracted_data
  }

  const nextQuestion = generateDynamicFollowUp(context, answers || [], currentQuestionCount)

  // We optionally could update `generated_questions` array here in the DB to keep a running log,
  // but since we derive the conversation from `interview_answers`, we just return it to the client.

  return { nextQuestion }
}

export async function completeInterview(interviewId: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  try {
    // 1. Fetch interview and all answers
    const { data: interview, error: fetchInterviewError } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', interviewId)
      .single()

    if (fetchInterviewError) throw new Error(`Fetch interview error: ${fetchInterviewError.message}`)

    const { data: answers, error: fetchAnswersError } = await supabase
      .from('interview_answers')
      .select('*')
      .eq('interview_id', interviewId)

    if (fetchAnswersError) throw new Error(`Fetch answers error: ${fetchAnswersError.message}`)

    if (interview && answers && answers.length > 0) {
      // 2. Run analysis
      const qaPairs = answers.map(a => ({ question: a.question, answer: a.answer }))
      const analysis = analyzeInterview(interview.job_title, interview.skills || [], qaPairs)

      // 3. Update each answer with specific feedback
      for (const answerRecord of answers) {
        const fb = analysis.answersAnalysis[answerRecord.question]
        if (fb) {
          const { error: updateAnswerError } = await supabase
            .from('interview_answers')
            .update({
              ai_feedback: fb.feedback,
              recommended_answer: fb.recommendedAnswer,
              recruiter_feedback: fb.recruiterFeedback,
              score: fb.score
            })
            .eq('id', answerRecord.id)

          if (updateAnswerError) throw new Error(`Update answer error: ${updateAnswerError.message}`)
        }
      }

      // 4. Update the main interview record with summary metrics
      const { error: updateInterviewError } = await supabase
        .from('interviews')
        .update({
          status: 'completed',
          overall_score: analysis.overallScore,
          performance_grade: analysis.grade,
          strengths: analysis.strengths,
          improvement_areas: analysis.improvementAreas,
          recommended_learning: analysis.recommendedLearning
        })
        .eq('id', interviewId)

      if (updateInterviewError) throw new Error(`Update interview error: ${updateInterviewError.message}`)
    } else {
      // Fallback if no answers found
      await supabase
        .from('interviews')
        .update({ status: 'completed' })
        .eq('id', interviewId)
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to complete interview:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while analyzing the interview.'
    return { error: errorMessage }
  }
}
