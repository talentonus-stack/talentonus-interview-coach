import { startInterview } from '../actions'
import SetupForm from './SetupForm'

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
        <SetupForm action={startInterview} />
      </div>
    </div>
  )
}
