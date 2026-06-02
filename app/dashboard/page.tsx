import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/login/actions'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Talentonus</h2>
        </div>
        <nav className="flex-1 px-4 py-2 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-200">
            Dashboard
          </Link>
          <button className="block w-full text-left px-4 py-2 text-gray-600 rounded hover:bg-gray-100">
            Profile
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <form action={logout}>
            <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded transition-colors duration-200">
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
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
                You are securely logged in. Dashboard features will be added here soon.
             </p>
          </div>
        </div>
      </main>
    </div>
  )
}
