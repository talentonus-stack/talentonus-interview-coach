import { createClient } from '@/utils/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Talentonus Interview Coach Dashboard
        </h1>
      </header>

      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Profile Information</h2>
        <div className="space-y-3">
          <div>
            <span className="font-medium text-gray-600">Full Name: </span>
            <span className="text-gray-900">{user.user_metadata?.full_name || 'N/A'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Email: </span>
            <span className="text-gray-900">{user.email}</span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
         <p className="text-gray-600">
            You are securely logged in. Select <strong>Interview Practice</strong> from the menu to begin.
         </p>
      </div>
    </div>
  )
}
