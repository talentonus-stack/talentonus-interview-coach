import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

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

  // Fetch answers count
  const { count } = await supabase
    .from('interview_answers')
    .select('*', { count: 'exact', head: true })
    .eq('interview_id', resolvedParams.id)

  const answeredCount = count || 0
  const totalQuestions = interview.question_count || 10

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Interview Completed!
        </h1>
        <p className="text-gray-600">
          Great job. You have finished your practice session.
        </p>
      </header>

      <div className="bg-white shadow-sm rounded-lg p-8 mb-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Session Summary</h2>

        <div className="flex justify-center space-x-12">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 min-w-[150px]">
            <span className="block text-4xl font-bold text-blue-600 mb-2">{totalQuestions}</span>
            <span className="text-gray-600 font-medium">Total Questions</span>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 min-w-[150px]">
            <span className="block text-4xl font-bold text-green-600 mb-2">{answeredCount}</span>
            <span className="text-gray-600 font-medium">Answered</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Link
          href="/dashboard"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-150"
        >
          Return to Dashboard
        </Link>
        <Link
          href="/dashboard/interview/setup"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-150"
        >
          Start New Interview
        </Link>
      </div>
    </div>
  )
}
