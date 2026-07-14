import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Props {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
      {/* Navigation header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="text-xl font-bold text-blue-600 tracking-tight">
                SkillSwap Hub
              </Link>
              <nav className="hidden md:flex space-x-1">
                <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-100">
                  Dashboard
                </Link>
                <Link to="/explore" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-100">
                  Explore
                </Link>
                <Link to="/requests" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-100">
                  Requests
                </Link>
                <Link to="/sessions" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-100">
                  Sessions
                </Link>
                <Link to="/chat" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-100">
                  Chat
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-gray-700">{user?.profile?.full_name || 'User'}</div>
                <div className="text-xs text-gray-500 font-mono">{user?.skillswap_id}</div>
              </div>
              <Link to="/profile" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-100">
                Profile
              </Link>
              <Link to="/settings" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-md hover:bg-gray-100">
                Settings
              </Link>
              <button onClick={handleLogout} className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  )
}
