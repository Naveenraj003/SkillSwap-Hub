import React, { useState, useEffect } from 'react'
import { skillsService } from '../../services/api'

interface Skill {
  skill_id: string
  skill_name: string
  verified: boolean
}

interface UserSkill {
  user_skill_id: string
  user_id: string
  skill_id: string
  skill_type: 'Teaching' | 'Learning'
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  skill: Skill
}

export default function SkillManager() {
  const [userSkills, setUserSkills] = useState<UserSkill[]>([])
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form states
  const [selectedSkillId, setSelectedSkillId] = useState('')
  const [skillType, setSkillType] = useState<'Teaching' | 'Learning'>('Teaching')
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate')
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [userSkillsData, availableSkillsData] = await Promise.all([
        skillsService.getUserSkills(),
        skillsService.getAvailable(),
      ])
      setUserSkills(userSkillsData)
      setAvailableSkills(availableSkillsData)
      if (availableSkillsData.length > 0) {
        setSelectedSkillId(availableSkillsData[0].skill_id)
      }
    } catch (err: any) {
      setError('Failed to load skills data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!selectedSkillId) {
      setError('Please select a skill')
      return
    }

    setSubmitting(true)
    try {
      await skillsService.addUserSkill(selectedSkillId, skillType, skillLevel)
      setSuccess('Skill added successfully!')
      const updated = await skillsService.getUserSkills()
      setUserSkills(updated)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add skill')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemoveSkill = async (userSkillId: string) => {
    setError('')
    setSuccess('')
    try {
      await skillsService.removeUserSkill(userSkillId)
      setSuccess('Skill removed successfully')
      setUserSkills(userSkills.filter(s => s.user_skill_id !== userSkillId))
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to remove skill')
    }
  }

  const teachingSkills = userSkills.filter(s => s.skill_type === 'Teaching')
  const learningSkills = userSkills.filter(s => s.skill_type === 'Learning')

  if (loading) {
    return <div className="text-gray-500 text-sm mt-4">Loading skills manager...</div>
  }

  return (
    <div className="space-y-6">
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Skills Exchange</h2>
        
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

        {/* Add skill form */}
        <form onSubmit={handleAddSkill} className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Add a Skill</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Select Skill</label>
              <select
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                disabled={submitting}
                className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white text-sm"
              >
                {availableSkills.map(s => (
                  <option key={s.skill_id} value={s.skill_id}>
                    {s.skill_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select
                value={skillType}
                onChange={(e) => setSkillType(e.target.value as any)}
                disabled={submitting}
                className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white text-sm"
              >
                <option value="Teaching">I Teach</option>
                <option value="Learning">I Learn</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Level</label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value as any)}
                disabled={submitting}
                className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white text-sm"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting || availableSkills.length === 0}
              className="py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-sm transition shadow-sm"
            >
              {submitting ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        </form>

        {/* Skill lists columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teaching list */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-3">Skills I Can Teach</h3>
            {teachingSkills.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No teaching skills added yet.</p>
            ) : (
              <div className="space-y-2">
                {teachingSkills.map(s => (
                  <div key={s.user_skill_id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    <div>
                      <span className="font-semibold text-gray-800">{s.skill.skill_name}</span>
                      <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">
                        {s.skill_level}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveSkill(s.user_skill_id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Learning list */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-3">Skills I Want to Learn</h3>
            {learningSkills.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No learning skills added yet.</p>
            ) : (
              <div className="space-y-2">
                {learningSkills.map(s => (
                  <div key={s.user_skill_id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    <div>
                      <span className="font-semibold text-gray-800">{s.skill.skill_name}</span>
                      <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-200">
                        {s.skill_level}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveSkill(s.user_skill_id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
