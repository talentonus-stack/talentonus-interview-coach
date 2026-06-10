import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { uploadResume, deleteResume } from './actions'
import { analyzeParsedResume } from './resumeParser'

export default async function ResumeManagementPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const { data: resumeRecord } = await supabase
    .from('candidate_resumes')
    .select('*')
    .eq('user_id', user.id)
    .single()

  let analysis = null
  if (resumeRecord?.parsed_data) {
    analysis = analyzeParsedResume(resumeRecord.parsed_data)
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Resume Management
        </h1>
        <p className="text-gray-600 mt-2">
          Upload your latest resume to automatically generate personalized interviews and view your resume score.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Upload / Status Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Current Resume</h2>

            {resumeRecord ? (
              <div>
                <div className="flex items-center space-x-3 text-green-600 mb-4 bg-green-50 p-3 rounded">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span className="font-medium">Active Resume Found</span>
                </div>
                <p className="text-sm text-gray-500 mb-6 break-all">
                  File: {resumeRecord.resume_url.split('/').pop()}
                </p>
                <div className="space-y-3">
                  <form action={deleteResume}>
                    <button type="submit" className="w-full text-red-600 bg-red-50 hover:bg-red-100 font-bold py-2 px-4 rounded transition">
                      Delete Resume
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-3 text-orange-600 mb-4 bg-orange-50 p-3 rounded">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  <span className="font-medium">No Resume Uploaded</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{resumeRecord ? 'Replace Resume' : 'Upload Resume'}</h2>
            <form action={uploadResume} className="space-y-4">
              <input
                type="file"
                name="resume"
                accept=".pdf,.docx"
                required
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
                Upload & Parse
              </button>
            </form>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="lg:col-span-2">
          {resumeRecord && analysis ? (
            <div className="space-y-6">
              <div className="bg-white shadow-sm rounded-lg p-8 border border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Resume Completeness</h3>
                  <p className="text-gray-500">Auto-detected as: <span className="font-semibold text-blue-600">{analysis.candidate_type}</span></p>
                </div>
                <div className="text-center">
                  <span className={`text-5xl font-bold ${analysis.score >= 80 ? 'text-green-600' : analysis.score >= 60 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {analysis.score}
                  </span>
                  <span className="text-xl text-gray-400">/100</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                  <h4 className="text-green-800 font-bold mb-3 flex items-center">
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {analysis.strengths.map((item, i) => (
                      <li key={i} className="flex items-start text-sm text-green-900">
                        <span className="mr-2">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
                  <h4 className="text-orange-800 font-bold mb-3 flex items-center">
                    Missing Information
                  </h4>
                  <ul className="space-y-2">
                    {analysis.missing_information.map((item, i) => (
                      <li key={i} className="flex items-start text-sm text-orange-900">
                        <span className="mr-2">✗</span> {item}
                      </li>
                    ))}
                    {analysis.missing_skills.map((item, i) => (
                      <li key={i} className="flex items-start text-sm text-orange-900">
                        <span className="mr-2">✗</span> Missing Skill: {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4">Extracted Profile Data</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">Full Name</span>
                    <span className="font-medium">{resumeRecord.parsed_data.personal_information?.full_name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Current Designation</span>
                    <span className="font-medium">{resumeRecord.parsed_data.professional_information?.current_designation || 'N/A'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 block mb-1">Top Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {resumeRecord.parsed_data.skills?.technical?.map((s: string) => (
                        <span key={s} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg p-12 border border-gray-200 text-center h-full flex flex-col items-center justify-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <h3 className="text-lg font-medium text-gray-900">No Resume Analysis Available</h3>
              <p className="text-gray-500 mt-2">Upload a resume to unlock AI parsing, candidate type detection, and completeness scoring.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
