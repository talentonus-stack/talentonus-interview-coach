import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { confirmExtractedData } from '../../chat-actions'

export default async function ConfirmExtractionPage({
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

  const { data: interview, error: interviewError } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (interviewError || !interview || interview.user_id !== user.id) {
    redirect('/dashboard')
  }

  const extracted = interview.extracted_data || {}

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Confirm Extracted Resume Data
        </h1>
        <p className="text-gray-600 mt-2">
          We analyzed your resume to build a highly personalized interview. Please verify the details below.
        </p>
      </header>

      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <form action={confirmExtractedData}>
          <input type="hidden" name="interviewId" value={interview.id} />

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                <textarea
                  name="name"
                  defaultValue={(extracted.name || []).join('\n')}
                  className="w-full border rounded-lg p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  rows={1}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Extracted Job Titles</label>
                <textarea
                  name="job_titles"
                  defaultValue={(extracted.job_titles || []).join('\n')}
                  className="w-full border rounded-lg p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Technologies</label>
                <textarea
                  name="technologies"
                  defaultValue={(extracted.technologies || []).join('\n')}
                  className="w-full border rounded-lg p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Skills</label>
                <textarea
                  name="skills"
                  defaultValue={(extracted.skills || []).join('\n')}
                  className="w-full border rounded-lg p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Education</label>
              <textarea
                name="education"
                defaultValue={(extracted.education || []).join('\n')}
                className="w-full border rounded-lg p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Experience</label>
              <textarea
                name="experience"
                defaultValue={(extracted.experience || []).join('\n')}
                className="w-full border rounded-lg p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Projects</label>
              <textarea
                name="projects"
                defaultValue={(extracted.projects || []).join('\n')}
                className="w-full border rounded-lg p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Certifications</label>
              <textarea
                name="certifications"
                defaultValue={(extracted.certifications || []).join('\n')}
                className="w-full border rounded-lg p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Link
              href={`/dashboard/interview/session/${interview.id}`}
              className="py-3 px-6 rounded-lg font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
            >
              Skip & Continue
            </Link>
            <button
              type="submit"
              className="py-3 px-6 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              Save & Proceed to Session
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
