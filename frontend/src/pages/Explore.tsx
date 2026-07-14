import React, { useState } from 'react'
import { searchService, connectionsService, privacyService } from '../services/api'
import DashboardLayout from '../layouts/DashboardLayout'

interface SearchResult {
  user_id: string
  skillswap_id: string
  full_name: string
  profile_image: string | null
  bio: string | null
  skill_name: string
  skill_id: string
  skill_level: string
}

interface ExactProfile {
  user_id: string
  skillswap_id: string
  status: string
  profile?: {
    full_name: string
    profile_image: string | null
    bio: string | null
    experience: string | null
  }
}

export default function Explore() {
  const [searchType, setSearchType] = useState<'skill' | 'id'>('skill')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [skillResults, setSkillResults] = useState<SearchResult[]>([])
  const [exactUser, setExactUser] = useState<ExactProfile | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Connection Dialog State
  const [selectedUserForConnect, setSelectedUserForConnect] = useState<SearchResult | null>(null)
  const [connectMessage, setConnectMessage] = useState('')
  const [connectSubmitting, setConnectSubmitting] = useState(false)
  const [connectSuccess, setConnectSuccess] = useState('')
  const [connectError, setConnectError] = useState('')

  // Privacy Dialog State
  const [userToBlock, setUserToBlock] = useState<{ id: string; name: string } | null>(null)
  const [userToRestrict, setUserToRestrict] = useState<{ id: string; name: string } | null>(null)
  const [privacySuccess, setPrivacySuccess] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setExactUser(null)
    setSkillResults([])
    
    if (!query.trim()) {
      setError('Please enter a search query')
      return
    }

    setLoading(true)
    setHasSearched(true)
    
    try {
      if (searchType === 'skill') {
        const data = await searchService.searchBySkill(query)
        setSkillResults(data)
      } else {
        const data = await searchService.searchById(query)
        setExactUser(data)
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        // Safe to leave empty results for 404 search lookups
      } else {
        setError(err.response?.data?.detail || 'An error occurred during search')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSendConnectRequest = async () => {
    if (!selectedUserForConnect) return
    
    setConnectSubmitting(true)
    setConnectError('')
    setConnectSuccess('')
    
    try {
      await connectionsService.sendRequest(
        selectedUserForConnect.user_id,
        selectedUserForConnect.skill_id,
        connectMessage
      )
      setConnectSuccess('Connection request sent!')
      setTimeout(() => {
        setSelectedUserForConnect(null)
        setConnectMessage('')
        setConnectSuccess('')
      }, 1500)
    } catch (err: any) {
      setConnectError(err.response?.data?.detail || 'Failed to send request')
    } finally {
      setConnectSubmitting(false)
    }
  }

  const handleBlockUser = async () => {
    if (!userToBlock) return
    try {
      await privacyService.blockUser(userToBlock.id)
      setPrivacySuccess(`Successfully blocked ${userToBlock.name}.`)
      // Remove user from results
      setSkillResults(prev => prev.filter(r => r.user_id !== userToBlock.id))
      if (exactUser && exactUser.user_id === userToBlock.id) {
        setExactUser(null)
      }
      setTimeout(() => {
        setUserToBlock(null)
        setPrivacySuccess('')
      }, 1500)
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to block user')
      setUserToBlock(null)
    }
  }

  const handleRestrictUser = async () => {
    if (!userToRestrict) return
    try {
      await privacyService.restrictUser(userToRestrict.id)
      setPrivacySuccess(`Successfully restricted ${userToRestrict.name}.`)
      setTimeout(() => {
        setUserToRestrict(null)
        setPrivacySuccess('')
      }, 1500)
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to restrict user')
      setUserToRestrict(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search Configuration */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Discover Peers</h1>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => {
                setSearchType('skill')
                setQuery('')
                setHasSearched(false)
                setSkillResults([])
                setExactUser(null)
                setError('')
              }}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
                searchType === 'skill'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Search by Skill Name
            </button>
            <button
              onClick={() => {
                setSearchType('id')
                setQuery('')
                setHasSearched(false)
                setSkillResults([])
                setExactUser(null)
                setError('')
              }}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
                searchType === 'id'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Search by SkillSwap ID
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                searchType === 'skill'
                  ? 'Enter skill name (e.g. Python, React...)'
                  : 'Enter unique ID (e.g. SSH-123456...)'
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md shadow-sm transition cursor-pointer"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-gray-500">Searching matching profiles...</p>
          </div>
        )}

        {/* Search Results Display */}
        {!loading && hasSearched && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Search Results</h2>

            {/* Skill search result cards */}
            {searchType === 'skill' && (
              <>
                {skillResults.length === 0 ? (
                  <div className="p-12 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-gray-500">No peers found teaching this skill.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {skillResults.map(r => (
                      <div key={r.user_id} className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col sm:flex-row gap-4 items-start shadow-sm">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl overflow-hidden flex-shrink-0 border border-blue-200">
                          {r.profile_image ? (
                            <img src={r.profile_image} alt={r.full_name} className="w-full h-full object-cover" />
                          ) : (
                            r.full_name.charAt(0)
                          )}
                        </div>
                        <div className="flex-1 space-y-1 text-left">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <h3 className="font-bold text-gray-800 text-lg">{r.full_name}</h3>
                            <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{r.skillswap_id}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium text-gray-700">Teaches:</span>
                            <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-100 text-xs">
                              {r.skill_name} ({r.skill_level})
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 leading-relaxed pt-1">
                            {r.bio || 'No bio provided.'}
                          </p>
                        </div>
                        
                        <div className="flex sm:flex-col gap-2 sm:self-center">
                          <button
                            onClick={() => setSelectedUserForConnect(r)}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md shadow-sm transition cursor-pointer"
                          >
                            Connect
                          </button>
                          <button
                            onClick={() => setUserToRestrict({ id: r.user_id, name: r.full_name })}
                            className="px-3 py-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs rounded transition cursor-pointer"
                          >
                            Restrict
                          </button>
                          <button
                            onClick={() => setUserToBlock({ id: r.user_id, name: r.full_name })}
                            className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs rounded transition cursor-pointer"
                          >
                            Block
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ID search result card */}
            {searchType === 'id' && (
              <>
                {!exactUser ? (
                  <div className="p-12 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-gray-500">No profile found matching this SkillSwap ID.</p>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4 text-left">
                    <div className="flex gap-4 items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl overflow-hidden border border-blue-200">
                          {exactUser.profile?.profile_image ? (
                            <img src={exactUser.profile.profile_image} alt={exactUser.profile.full_name} className="w-full h-full object-cover" />
                          ) : (
                            exactUser.profile?.full_name?.charAt(0) || 'U'
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-xl">{exactUser.profile?.full_name}</h3>
                          <p className="font-mono text-sm text-gray-500">{exactUser.skillswap_id}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setUserToRestrict({ id: exactUser.user_id, name: exactUser.profile?.full_name || 'User' })}
                          className="px-3 py-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs rounded transition cursor-pointer"
                        >
                          Restrict
                        </button>
                        <button
                          onClick={() => setUserToBlock({ id: exactUser.user_id, name: exactUser.profile?.full_name || 'User' })}
                          className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs rounded transition cursor-pointer"
                        >
                          Block
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-gray-150 pt-4">
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase">About</h4>
                        <p className="text-sm text-gray-600 leading-relaxed mt-1">
                          {exactUser.profile?.bio || 'No bio provided.'}
                        </p>
                      </div>

                      {exactUser.profile?.experience && (
                        <div className="pt-2">
                          <h4 className="text-xs font-bold text-gray-500 uppercase">Experience</h4>
                          <p className="text-sm text-gray-600 leading-relaxed mt-1">
                            {exactUser.profile.experience}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* CONNECTION MODAL */}
        {selectedUserForConnect && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full p-6 shadow-xl space-y-4 text-left">
              <h3 className="font-bold text-gray-900 text-lg">Connect with {selectedUserForConnect.full_name}</h3>
              <p className="text-sm text-gray-600">
                You are sending a connection request to learn <span className="font-semibold text-blue-600">{selectedUserForConnect.skill_name}</span>.
              </p>
              
              {connectError && (
                <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded">
                  {connectError}
                </div>
              )}
              
              {connectSuccess && (
                <div className="p-3 text-xs bg-green-50 border border-green-200 text-green-700 rounded">
                  {connectSuccess}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Invitation Message (Optional)</label>
                <textarea
                  value={connectMessage}
                  onChange={(e) => setConnectMessage(e.target.value)}
                  disabled={connectSubmitting || !!connectSuccess}
                  placeholder="Introduce yourself or write a short note about why you want to connect..."
                  rows={3}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUserForConnect(null)
                    setConnectMessage('')
                    setConnectError('')
                    setConnectSuccess('')
                  }}
                  disabled={connectSubmitting}
                  className="px-4 py-1.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendConnectRequest}
                  disabled={connectSubmitting || !!connectSuccess}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold transition cursor-pointer"
                >
                  {connectSubmitting ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BLOCK DIALOG */}
        {userToBlock && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-gray-200 rounded-lg max-w-sm w-full p-6 shadow-xl space-y-4 text-left">
              <h3 className="font-bold text-gray-900 text-lg">Block {userToBlock.name}?</h3>
              
              {privacySuccess ? (
                <div className="p-3 text-xs bg-green-50 border border-green-200 text-green-700 rounded">
                  {privacySuccess}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  This user will no longer be able to message you, request connections, or discover your profile. Any active connections between you will be deleted.
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setUserToBlock(null)}
                  disabled={!!privacySuccess}
                  className="px-4 py-1.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockUser}
                  disabled={!!privacySuccess}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-semibold transition cursor-pointer"
                >
                  Confirm Block
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RESTRICT DIALOG */}
        {userToRestrict && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-gray-200 rounded-lg max-w-sm w-full p-6 shadow-xl space-y-4 text-left">
              <h3 className="font-bold text-gray-900 text-lg">Restrict {userToRestrict.name}?</h3>
              
              {privacySuccess ? (
                <div className="p-3 text-xs bg-green-50 border border-green-200 text-green-700 rounded">
                  {privacySuccess}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Restricting this user limits their visibility on your posts and limits interaction guidelines as defined in SRS.
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setUserToRestrict(null)}
                  disabled={!!privacySuccess}
                  className="px-4 py-1.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestrictUser}
                  disabled={!!privacySuccess}
                  className="px-4 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-semibold transition cursor-pointer"
                >
                  Confirm Restrict
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
