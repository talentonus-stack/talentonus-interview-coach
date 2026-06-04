'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

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

  const { error } = await supabase
    .from('interviews')
    .update({ status: 'completed' })
    .eq('id', interviewId)

  if (error) {
    console.error('Failed to update interview status:', error)
    // Silently fail the update but still redirect to summary
  }

  redirect(`/dashboard/interview/${interviewId}/summary`)
}
