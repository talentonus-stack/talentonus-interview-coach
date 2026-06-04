'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { analyzeInterview } from './utils/analyzer'

export async function saveAnswer(interviewId: string, question: string, answer: string) {
  const supabase = await createClient()

  // Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // Insert answer into Supabase
  const { error } = await supabase
    .from('interview_answers')
    .insert([
      {
        interview_id: interviewId,
        question: question,
        answer: answer,
      },
    ])

  if (error) {
    console.error('Failed to save answer:', error)
    // Return the exact Supabase error message to help the frontend display it
    return { error: error.message || 'An unknown error occurred while saving your answer.' }
  }

  return { success: true }
}

export async function completeInterview(interviewId: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // 1. Fetch interview and all answers
  const { data: interview } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', interviewId)
    .single()

  const { data: answers } = await supabase
    .from('interview_answers')
    .select('*')
    .eq('interview_id', interviewId)

  if (interview && answers && answers.length > 0) {
    // 2. Run analysis
    const qaPairs = answers.map(a => ({ question: a.question, answer: a.answer }))
    const analysis = analyzeInterview(interview.job_title, interview.skills || [], qaPairs)

    // 3. Update each answer with specific feedback
    for (const answerRecord of answers) {
      const fb = analysis.answersAnalysis[answerRecord.question]
      if (fb) {
        await supabase
          .from('interview_answers')
          .update({
            ai_feedback: fb.feedback,
            recommended_answer: fb.recommendedAnswer,
            score: fb.score
          })
          .eq('id', answerRecord.id)
      }
    }

    // 4. Update the main interview record with summary metrics
    await supabase
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
  } else {
    // Fallback if no answers found
    await supabase
      .from('interviews')
      .update({ status: 'completed' })
      .eq('id', interviewId)
  }

  redirect(`/dashboard/interview/${interviewId}/summary`)
}
