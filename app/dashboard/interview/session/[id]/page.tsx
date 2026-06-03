import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function InterviewSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const resolvedParams = await params

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
    console.error('Failed to fetch interview:', error)
    redirect('/dashboard')
  }

  // Ensure user owns this interview
  if (interview.user_id !== user.id) {
    redirect('/dashboard')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Interview Session
        </h1>
        <p className="text-gray-600 mt-2">
          Your interview environment is ready.
        </p>
      </header>

      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Interview Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="block text-sm font-medium text-gray-500">Job Title</span>
            <span className="block mt-1 text-lg text-gray-900">{interview.job_title}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Experience Level</span>
            <span className="block mt-1 text-lg text-gray-900">{interview.experience_level}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Interview Type</span>
            <span className="block mt-1 text-lg text-gray-900">{interview.interview_type}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Status</span>
            <span className="inline-flex mt-1 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
              {interview.status}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to begin?</h3>
        <p className="text-gray-600 mb-6">
          Ensure you are in a quiet environment and ready to answer the questions.
        </p>
        <Link
          href={`/dashboard/interview/${resolvedParams.id}/chat`}
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        >
          Begin Interview
        </Link>
      </div>
    </div>
  )
}
