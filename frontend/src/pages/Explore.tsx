import React, { useState } from 'react'
import { searchService } from '../services/api'
import DashboardLayout from '../layouts/DashboardLayout'

interface SearchResult {
  user_id: string
  skillswap_id: string
  full_name: string
  profile_image: string | null
  bio: string | null
  skill_name: string
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
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition ${
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
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition ${
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
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md shadow-sm transition"
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
                        <div className="flex-1 space-y-1">
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
                        <button
                          disabled
                          className="sm:self-center px-4 py-2 bg-gray-100 border border-gray-300 text-gray-500 text-sm font-medium rounded-md cursor-not-allowed"
                          title="Connect feature is locked until connection milestone is implemented"
                        >
                          Connect
                        </button>
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
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
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
      </div>
    </DashboardLayout>
  )
}
