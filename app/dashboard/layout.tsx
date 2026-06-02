import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/login/actions'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
          <Link href="/dashboard/interview/setup" className="block px-4 py-2 text-gray-600 rounded hover:bg-gray-100">
            Interview Practice
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
        {children}
      </main>
    </div>
  )
}
