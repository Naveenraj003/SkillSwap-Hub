import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.profile?.full_name}!</h1>
        <p className="text-gray-600">
          Your unique SkillSwap ID is <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{user?.skillswap_id}</span>. 
          Use this ID to share your profile with others directly!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick links */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h2>
          <div className="space-y-2">
            <a href="/explore" className="block text-blue-600 hover:underline">Explore Skills & Members</a>
            <a href="/profile" className="block text-blue-600 hover:underline">Update My Profile</a>
            <a href="/requests" className="block text-blue-600 hover:underline">View Connection Requests</a>
          </div>
        </div>

        {/* Profile status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">My Account Status</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status:</span>
              <span className="font-semibold text-green-600">{user?.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Member Since:</span>
              <span className="font-semibold text-gray-700">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Tip of the day */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Skill Exchange Tip</h2>
          <p className="text-sm text-gray-600 italic leading-relaxed">
            "The best way to learn is by teaching. Add the skills you are advanced at to your teaching list, and find peers willing to swap their knowledge with you!"
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
