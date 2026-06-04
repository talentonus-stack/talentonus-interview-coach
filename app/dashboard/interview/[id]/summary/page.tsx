import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import SummaryClient from './SummaryClient'

export default async function InterviewSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch interview
  const { data: interview, error: interviewError } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (interviewError || !interview || interview.user_id !== user.id) {
    redirect('/dashboard')
  }

  // Fetch all answers for detailed breakdown
  const { data: answers } = await supabase
    .from('interview_answers')
    .select('*')
    .eq('interview_id', resolvedParams.id)
    .order('created_at', { ascending: true })

  return (
    <SummaryClient interview={interview} answers={answers || []} />
  )
}
