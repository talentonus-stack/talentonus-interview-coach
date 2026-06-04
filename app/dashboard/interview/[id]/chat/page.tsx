import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ChatClient from './ChatClient'

export default async function InterviewChatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()

  // Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch interview details
  const { data: interview, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !interview) {
    redirect('/dashboard')
  }

  // Ensure user owns this interview
  if (interview.user_id !== user.id) {
    redirect('/dashboard')
  }

  // Use the dynamically generated questions stored in the database
  const questions: string[] = interview.generated_questions || [
    "Could you tell me a bit about yourself?",
    "Why are you interested in this role?"
  ]

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Interview Session: {interview.job_title}
        </h1>
        <p className="text-gray-600 mt-2">
          {interview.interview_type} • {interview.experience_level}
        </p>
      </header>

      <main className="flex-1">
        <ChatClient interviewId={interview.id} questions={questions} />
      </main>
    </div>
  )
}
