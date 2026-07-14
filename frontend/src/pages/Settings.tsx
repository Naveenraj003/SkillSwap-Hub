import React, { useState, useEffect } from 'react'
import { privacyService } from '../services/api'
import DashboardLayout from '../layouts/DashboardLayout'

interface UserSummary {
  user_id: string
  skillswap_id: string
  profile: {
    full_name: string
    profile_image: string | null
  }
}

export default function Settings() {
  const [blockedUsers, setBlockedUsers] = useState<UserSummary[]>([])
  const [restrictedUsers, setRestrictedUsers] = useState<UserSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchPrivacyData = async () => {
    try {
      setLoading(true)
      const [blockedData, restrictedData] = await Promise.all([
        privacyService.getBlockedUsers(),
        privacyService.getRestrictedUsers(),
      ])
      setBlockedUsers(blockedData)
      setRestrictedUsers(restrictedData)
    } catch (err: any) {
      setError('Failed to fetch privacy settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrivacyData()
  }, [])

  const handleUnblock = async (userId: string, name: string) => {
    setError('')
    setSuccess('')
    try {
      await privacyService.unblockUser(userId)
      setSuccess(`Successfully unblocked ${name}.`)
      setBlockedUsers(prev => prev.filter(u => u.user_id !== userId))
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to unblock user')
    }
  }

  const handleUnrestrict = async (userId: string, name: string) => {
    setError('')
    setSuccess('')
    try {
      await privacyService.unrestrictUser(userId)
      setSuccess(`Successfully removed restriction for ${name}.`)
      setRestrictedUsers(prev => prev.filter(u => u.user_id !== userId))
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to unrestrict user')
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-sm text-gray-500 mb-6">Manage your account safety options, blocked users, and privacy restriction guidelines.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md">
              {success}
            </div>
          )}

          {loading ? (
            <p className="text-gray-500 py-4">Loading safety settings...</p>
          ) : (
            <div className="space-y-8 text-left">
              {/* Blocked Users Section */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Blocked Users</h2>
                <p className="text-xs text-gray-500 mb-4">Users on this list cannot discover your profile, message you, or request connection links.</p>
                
                {blockedUsers.length === 0 ? (
                  <p className="text-sm text-gray-500 italic py-2">No blocked users.</p>
                ) : (
                  <div className="border border-gray-200 rounded-md divide-y divide-gray-150 bg-gray-50/20">
                    {blockedUsers.map(user => (
                      <div key={user.user_id} className="flex justify-between items-center p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm overflow-hidden border border-blue-200">
                            {user.profile.profile_image ? (
                              <img src={user.profile.profile_image} alt={user.profile.full_name} className="w-full h-full object-cover" />
                            ) : (
                              user.profile.full_name.charAt(0)
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800 text-sm">{user.profile.full_name}</span>
                            <span className="ml-2 font-mono text-[9px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border border-gray-200">{user.skillswap_id}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnblock(user.user_id, user.profile.full_name)}
                          className="px-2.5 py-1 text-xs border border-gray-300 hover:bg-gray-50 font-medium rounded transition cursor-pointer"
                        >
                          Unblock
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Restricted Users Section */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Restricted Users</h2>
                <p className="text-xs text-gray-500 mb-4">Users on this list have restricted communication access and limited dashboard feed visibility.</p>
                
                {restrictedUsers.length === 0 ? (
                  <p className="text-sm text-gray-500 italic py-2">No restricted users.</p>
                ) : (
                  <div className="border border-gray-200 rounded-md divide-y divide-gray-150 bg-gray-50/20">
                    {restrictedUsers.map(user => (
                      <div key={user.user_id} className="flex justify-between items-center p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm overflow-hidden border border-blue-200">
                            {user.profile.profile_image ? (
                              <img src={user.profile.profile_image} alt={user.profile.full_name} className="w-full h-full object-cover" />
                            ) : (
                              user.profile.full_name.charAt(0)
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800 text-sm">{user.profile.full_name}</span>
                            <span className="ml-2 font-mono text-[9px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border border-gray-200">{user.skillswap_id}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnrestrict(user.user_id, user.profile.full_name)}
                          className="px-2.5 py-1 text-xs border border-gray-300 hover:bg-gray-50 font-medium rounded transition cursor-pointer"
                        >
                          Remove Restriction
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
