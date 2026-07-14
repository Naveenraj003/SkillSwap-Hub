import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { profileService } from '../services/api'
import DashboardLayout from '../layouts/DashboardLayout'

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const [fullName, setFullName] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [bio, setBio] = useState('')
  const [experience, setExperience] = useState('')
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user?.profile) {
      setFullName(user.profile.full_name || '')
      setProfileImage(user.profile.profile_image || '')
      setBio(user.profile.bio || '')
      setExperience(user.profile.experience || '')
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!fullName.trim()) {
      setError('Full Name is required')
      return
    }
    setSubmitting(true)
    try {
      await profileService.updateProfile({
        full_name: fullName,
        profile_image: profileImage || undefined,
        bio: bio || undefined,
        experience: experience || undefined,
      })
      await refreshUser()
      setSuccess('Profile updated successfully!')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile Details</h1>
          <p className="text-gray-500 mb-6 font-mono text-sm">
            Unique ID: {user?.skillswap_id} | Email: {user?.email}
          </p>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
              <input
                type="text"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                disabled={submitting}
                placeholder="https://example.com/image.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About Me (Bio)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={submitting}
                rows={4}
                placeholder="Tell others about yourself, what you like to learn or teach, etc..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience & Background</label>
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                disabled={submitting}
                rows={4}
                placeholder="Your professional background, certifications, achievements, etc..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md shadow-sm transition"
            >
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
