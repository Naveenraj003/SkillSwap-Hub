import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { connectionsService, chatService } from '../services/api'
import DashboardLayout from '../layouts/DashboardLayout'

interface Skill {
  skill_id: string
  skill_name: string
}

interface Profile {
  full_name: string
  profile_image: string | null
  bio: string | null
  experience: string | null
}

interface UserSummary {
  user_id: string
  skillswap_id: string
  profile: Profile
}

interface ConnectionRequest {
  request_id: string
  sender_id: string
  receiver_id: string
  message: string | null
  status: string
  created_at: string
  sender: UserSummary
  receiver: UserSummary
  skill: Skill
}

export default function Requests() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'connections'>('received')
  const [receivedRequests, setReceivedRequests] = useState<ConnectionRequest[]>([])
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([])
  const [connections, setConnections] = useState<UserSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleStartChat = async (recipientId: string) => {
    setError('')
    setSuccessMessage('')
    try {
      const conv = await chatService.getOrCreateConversation(recipientId)
      navigate(`/chat?conv_id=${conv.conversation_id}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to open chat')
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [receivedData, sentData, connectionsData] = await Promise.all([
        connectionsService.getReceivedRequests(),
        connectionsService.getSentRequests(),
        connectionsService.getConnections(),
      ])
      setReceivedRequests(receivedData)
      setSentRequests(sentData)
      setConnections(connectionsData)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load connections data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAccept = async (requestId: string) => {
    setError('')
    setSuccessMessage('')
    try {
      await connectionsService.acceptRequest(requestId)
      setSuccessMessage('Connection request accepted!')
      fetchData()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to accept connection request')
    }
  }

  const handleReject = async (requestId: string) => {
    setError('')
    setSuccessMessage('')
    try {
      await connectionsService.rejectRequest(requestId)
      setSuccessMessage('Connection request declined.')
      fetchData()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to decline request')
    }
  }

  const handleCancel = async (requestId: string) => {
    setError('')
    setSuccessMessage('')
    try {
      await connectionsService.cancelRequest(requestId)
      setSuccessMessage('Connection request cancelled.')
      fetchData()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to cancel request')
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Connections & Requests</h1>

          {/* Tab buttons */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('received')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'received'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Received ({receivedRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'sent'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sent ({sentRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('connections')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'connections'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Connections ({connections.length})
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md">
              {successMessage}
            </div>
          )}

          {loading ? (
            <p className="text-gray-500 py-6">Loading relationships...</p>
          ) : (
            <div className="space-y-4">
              {/* RECEIVED TAB */}
              {activeTab === 'received' && (
                <>
                  {receivedRequests.length === 0 ? (
                    <p className="text-sm text-gray-500 italic py-6">No incoming connection requests.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {receivedRequests.map(req => (
                        <div key={req.request_id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                          <div className="flex gap-3 items-start">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg overflow-hidden border border-blue-200">
                              {req.sender.profile.profile_image ? (
                                <img src={req.sender.profile.profile_image} alt={req.sender.profile.full_name} className="w-full h-full object-cover" />
                              ) : (
                                req.sender.profile.full_name.charAt(0)
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800">{req.sender.profile.full_name}</span>
                                <span className="font-mono text-[10px] text-gray-500 bg-gray-150 px-1.5 py-0.5 rounded border border-gray-200">{req.sender.skillswap_id}</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                Wants to connect for: <span className="font-semibold text-blue-600">{req.skill.skill_name}</span>
                              </p>
                              {req.message && (
                                <p className="text-xs text-gray-600 bg-white border border-gray-200 rounded p-2 mt-2 max-w-lg italic">
                                  "{req.message}"
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 self-end sm:self-center">
                            <button
                              onClick={() => handleAccept(req.request_id)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition cursor-pointer"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(req.request_id)}
                              className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded transition cursor-pointer"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* SENT TAB */}
              {activeTab === 'sent' && (
                <>
                  {sentRequests.length === 0 ? (
                    <p className="text-sm text-gray-500 italic py-6">No outgoing connection requests pending.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {sentRequests.map(req => (
                        <div key={req.request_id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                          <div className="flex gap-3 items-start">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg overflow-hidden border border-blue-200">
                              {req.receiver.profile.profile_image ? (
                                <img src={req.receiver.profile.profile_image} alt={req.receiver.profile.full_name} className="w-full h-full object-cover" />
                              ) : (
                                req.receiver.profile.full_name.charAt(0)
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800">{req.receiver.profile.full_name}</span>
                                <span className="font-mono text-[10px] text-gray-500 bg-gray-150 px-1.5 py-0.5 rounded border border-gray-200">{req.receiver.skillswap_id}</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                Skill requested: <span className="font-semibold text-blue-600">{req.skill.skill_name}</span>
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleCancel(req.request_id)}
                            className="px-3 py-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded self-end sm:self-center transition cursor-pointer"
                          >
                            Cancel Request
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* CONNECTIONS TAB */}
              {activeTab === 'connections' && (
                <>
                  {connections.length === 0 ? (
                    <p className="text-sm text-gray-500 italic py-6">You have no active connections yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {connections.map(conn => (
                        <div key={conn.user_id} className="border border-gray-200 rounded-lg p-5 bg-white flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center text-left">
                          <div className="flex gap-4 items-start">
                            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl overflow-hidden flex-shrink-0 border border-blue-200">
                              {conn.profile.profile_image ? (
                                <img src={conn.profile.profile_image} alt={conn.profile.full_name} className="w-full h-full object-cover" />
                              ) : (
                                conn.profile.full_name.charAt(0)
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800 text-base">{conn.profile.full_name}</span>
                                <span className="font-mono text-[10px] text-gray-500 bg-gray-150 px-2 py-0.5 rounded border border-gray-200">{conn.skillswap_id}</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {conn.profile.bio || 'No bio provided.'}
                              </p>
                            </div>
                          </div>

                          <div className="flex sm:flex-col gap-2 self-end sm:self-center">
                            <button
                              onClick={() => handleStartChat(conn.user_id)}
                              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition cursor-pointer"
                            >
                              Message
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
