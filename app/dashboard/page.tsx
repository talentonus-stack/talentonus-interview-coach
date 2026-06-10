import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch Analytics Data
  const { data: interviews } = await supabase
    .from('interviews')
    .select('overall_score, skills')
    .eq('user_id', user.id)
    .eq('status', 'completed')

  const { data: resume } = await supabase
    .from('candidate_resumes')
    .select('resume_score')
    .eq('user_id', user.id)
    .single()

  const totalInterviews = interviews?.length || 0
  const scores = interviews?.map(i => i.overall_score || 0) || []
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const bestScore = scores.length > 0 ? Math.max(...scores) : 0

  const allSkills = new Set<string>()
  interviews?.forEach(i => {
    (i.skills || []).forEach((s: string) => allSkills.add(s))
  })
  const totalSkillsTested = allSkills.size

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.user_metadata?.full_name || 'Candidate'}!
        </h1>
        <p className="text-gray-600 mt-2">Here is your overall interview performance overview.</p>
      </header>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Interviews</span>
          <span className="text-4xl font-bold text-blue-600">{totalInterviews}</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Average Score</span>
          <span className="text-4xl font-bold text-indigo-600">{averageScore}<span className="text-xl text-gray-400">/100</span></span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Best Score</span>
          <span className="text-4xl font-bold text-green-600">{bestScore}<span className="text-xl text-gray-400">/100</span></span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills Tested</span>
          <span className="text-4xl font-bold text-purple-600">{totalSkillsTested}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resume Score Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Resume Score</h2>
              <p className="text-gray-500 text-sm mb-6">AI evaluation of your uploaded resume completeness.</p>

              <div className="flex justify-center mb-6">
                {resume ? (
                  <div className="text-center">
                    <span className={`text-6xl font-bold ${resume.resume_score >= 80 ? 'text-green-600' : resume.resume_score >= 60 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {resume.resume_score}
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-4xl font-bold text-gray-300">N/A</span>
                  </div>
                )}
              </div>
            </div>

            <Link href="/dashboard/resume" className="w-full text-center block py-2 px-4 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 font-medium transition">
              {resume ? 'Manage Resume' : 'Upload Resume Now'}
            </Link>
          </div>
        </div>

        {/* Latest Performance Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Latest Performance</h2>
              <Link href="/dashboard/history" className="text-blue-600 text-sm font-medium hover:underline">View All</Link>
            </div>

            {totalInterviews > 0 ? (
              <p className="text-gray-600">Your recent interviews show strong performance. Continue practicing to maintain your Average Score of {averageScore}/100.</p>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven&apos;t completed any interviews yet.</p>
                <Link href="/dashboard/interview/setup" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition inline-block">
                  Start First Interview
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
