'use client'

import Link from 'next/link'

interface InterviewData {
  id: string
  job_title: string
  interview_type: string
  overall_score?: number
  performance_grade?: string
  strengths?: string[]
  improvement_areas?: string[]
  recommended_learning?: string[]
}

interface AnswerData {
  id: string
  question: string
  answer: string
  score: number
  ai_feedback?: string
  recommended_answer?: string
  recruiter_feedback?: string
}

export default function SummaryClient({
  interview,
  answers,
}: {
  interview: InterviewData
  answers: AnswerData[]
}) {
  const handlePrint = () => {
    window.print()
  }

  const getGradeColor = (grade: string) => {
    switch(grade) {
      case 'A+': return 'text-green-600 bg-green-100'
      case 'A': return 'text-green-500 bg-green-50'
      case 'B+': return 'text-blue-600 bg-blue-100'
      case 'B': return 'text-blue-500 bg-blue-50'
      default: return 'text-orange-600 bg-orange-100'
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Non-printable header actions */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <Link
          href="/dashboard"
          className="text-gray-600 hover:text-gray-900 font-medium flex items-center"
        >
          &larr; Back to Dashboard
        </Link>
        <button
          onClick={handlePrint}
          className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-lg transition duration-150 shadow-sm"
        >
          Download PDF Report
        </button>
      </div>

      <div className="bg-white shadow-md rounded-xl p-8 print:shadow-none print:p-0">

        {/* Header / Score Section */}
        <header className="border-b border-gray-200 pb-8 mb-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Interview Analysis Report
            </h1>
            <p className="text-gray-600 text-lg">
              {interview.job_title} • {interview.interview_type}
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex space-x-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Overall Score</span>
              <span className="text-4xl font-bold text-gray-900">{interview.overall_score || 0}<span className="text-xl text-gray-400">/100</span></span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Grade</span>
              <span className={`text-4xl font-bold px-4 py-1 rounded-lg ${getGradeColor(interview.performance_grade || 'C')}`}>
                {interview.performance_grade || 'N/A'}
              </span>
            </div>
          </div>
        </header>

        {/* AI High-Level Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-green-50 rounded-xl p-6 border border-green-100">
            <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Key Strengths
            </h3>
            <ul className="space-y-2">
              {interview.strengths?.map((strength: string, i: number) => (
                <li key={i} className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-green-900">{strength}</span>
                </li>
              )) || <li className="text-green-700 text-sm italic">Not enough data.</li>}
            </ul>
          </div>

          <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
            <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              Areas for Improvement
            </h3>
            <ul className="space-y-2">
              {interview.improvement_areas?.map((area: string, i: number) => (
                <li key={i} className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span className="text-orange-900">{area}</span>
                </li>
              )) || <li className="text-orange-700 text-sm italic">Not enough data.</li>}
            </ul>
          </div>
        </div>

        {/* Personalized Recommendations */}
        {interview.recommended_learning && interview.recommended_learning.length > 0 && (
          <div className="mb-12 bg-blue-50 rounded-xl p-6 border border-blue-100 print:break-inside-avoid">
            <h3 className="text-lg font-bold text-blue-800 mb-3">Recommended Focus Areas</h3>
            <p className="text-blue-900 mb-4">Based on your performance, spending time reviewing these concepts will significantly boost your next interview.</p>
            <div className="flex flex-wrap gap-2">
              {interview.recommended_learning.map((rec: string, i: number) => (
                <span key={i} className="bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200 shadow-sm">
                  {rec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Q&A Breakdown */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">Detailed Question Breakdown</h2>

          <div className="space-y-8">
            {answers.map((ans, index) => (
              <div key={ans.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 print:break-inside-avoid">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 max-w-2xl">
                    <span className="text-gray-400 mr-2">Q{index + 1}.</span>
                    {ans.question}
                  </h3>
                  <div className="bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                    <span className="text-sm font-semibold text-gray-600">Score: <span className={ans.score >= 80 ? 'text-green-600' : ans.score >= 60 ? 'text-blue-600' : 'text-orange-600'}>{ans.score || 0}/100</span></span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Answer</h4>
                  <p className="text-gray-800 whitespace-pre-wrap bg-white p-4 rounded border border-gray-100">
                    {ans.answer}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h4 className="text-sm font-semibold text-indigo-800 uppercase tracking-wider mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      AI Feedback
                    </h4>
                    <p className="text-indigo-900 text-sm">{ans.ai_feedback || "No feedback generated."}</p>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <h4 className="text-sm font-semibold text-emerald-800 uppercase tracking-wider mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Recommended Approach
                    </h4>
                    <p className="text-emerald-900 text-sm">{ans.recommended_answer || "No recommendation available."}</p>
                  </div>
                </div>

                {ans.recruiter_feedback && (
                  <div className="mt-4 bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <h4 className="text-sm font-semibold text-purple-800 uppercase tracking-wider mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      Recruiter Note
                    </h4>
                    <p className="text-purple-900 text-sm">{ans.recruiter_feedback}</p>
                  </div>
                )}

              </div>
            ))}

            {answers.length === 0 && (
              <p className="text-gray-500 italic text-center py-8">No answers were recorded for this session.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
