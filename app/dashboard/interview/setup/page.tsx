import { startInterview } from '../actions'

export default async function InterviewSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const errorMessage = resolvedSearchParams.error

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Interview Setup
        </h1>
        <p className="text-gray-600 mt-2">
          Configure your practice interview by providing the details below.
        </p>
      </header>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{errorMessage}</span>
          <p className="mt-2 text-sm">Please ensure the Supabase migration has been executed successfully.</p>
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg p-6">
        <form action={startInterview}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobTitle">
              Job Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="jobTitle"
              name="jobTitle"
              type="text"
              placeholder="e.g. Frontend Developer"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="experienceLevel">
              Experience Level
            </label>
            <div className="relative">
              <select
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                id="experienceLevel"
                name="experienceLevel"
                defaultValue=""
                required
              >
                <option value="" disabled>Select experience level...</option>
                <option value="Fresher">Fresher</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="interviewType">
              Interview Type
            </label>
            <div className="relative">
              <select
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                id="interviewType"
                name="interviewType"
                defaultValue=""
                required
              >
                <option value="" disabled>Select interview type...</option>
                <option value="HR">HR</option>
                <option value="Technical">Technical</option>
                <option value="Managerial">Managerial</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out w-full sm:w-auto"
            >
              Start Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
