import React, { useState, useEffect } from 'react'
import { sessionsService, connectionsService, skillsService, meetingsService } from '../services/api'
import DashboardLayout from '../layouts/DashboardLayout'
import { Calendar, Clock, Video, Plus } from 'lucide-react'

interface UserSummary {
  user_id: string
  skillswap_id: string
  profile: {
    full_name: string
    profile_image: string | null
  }
}

interface Skill {
  skill_id: string
  skill_name: string
}

interface SessionRecord {
  session_id: string
  requester_id: string
  receiver_id: string
  skill_id: string
  topic: string
  description: string | null
  proposed_date: string
  proposed_time: string
  duration: number
  status: string
  meeting_url: string | null
  created_at: string
  requester: UserSummary
  receiver: UserSummary
  skill: Skill
}

export default function Sessions() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'requests' | 'history'>('upcoming')
  const [activeSessions, setActiveSessions] = useState<SessionRecord[]>([])
  const [receivedRequests, setReceivedRequests] = useState<SessionRecord[]>([])
  const [sentRequests, setSentRequests] = useState<SessionRecord[]>([])
  const [historySessions, setHistorySessions] = useState<SessionRecord[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Propose Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [connections, setConnections] = useState<UserSummary[]>([])
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  
  const [formReceiverId, setFormReceiverId] = useState('')
  const [formSkillId, setFormSkillId] = useState('')
  const [formTopic, setFormTopic] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formDate, setFormDate] = useState('')
  const [formTime, setFormTime] = useState('')
  const [formDuration, setFormDuration] = useState(60)
  const [formSubmitting, setFormSubmitting] = useState(false)

  // Details Modal State
  const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [activeData, receivedData, sentData, historyData] = await Promise.all([
        sessionsService.getActive(),
        sessionsService.getReceivedRequests(),
        sessionsService.getSentRequests(),
        sessionsService.getHistory(),
      ])
      setActiveSessions(activeData)
      setReceivedRequests(receivedData)
      setSentRequests(sentData)
      setHistorySessions(historyData)
    } catch (err: any) {
      setError('Failed to fetch sessions listings')
    } finally {
      setLoading(false)
    }
  }

  const fetchFormDetails = async () => {
    try {
      const [connectionsData, skillsData] = await Promise.all([
        connectionsService.getConnections(),
        skillsService.getAvailable(),
      ])
      setConnections(connectionsData)
      setAvailableSkills(skillsData)
      if (connectionsData.length > 0) setFormReceiverId(connectionsData[0].user_id)
      if (skillsData.length > 0) setFormSkillId(skillsData[0].skill_id)
    } catch (err) {
      console.error('Failed to load connections or skills lists:', err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenProposeModal = async () => {
    await fetchFormDetails()
    setIsModalOpen(true)
  }

  const handleProposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!formReceiverId || !formSkillId || !formTopic.trim() || !formDate || !formTime) {
      setError('Please fill in all required fields')
      return
    }

    setFormSubmitting(true)
    try {
      await sessionsService.proposeSession({
        receiver_id: formReceiverId,
        skill_id: formSkillId,
        topic: formTopic.trim(),
        description: formDesc.trim() || undefined,
        proposed_date: formDate,
        proposed_time: formTime,
        duration: Number(formDuration),
      })
      setSuccess('Session proposal sent successfully!')
      setIsModalOpen(false)
      setFormTopic('')
      setFormDesc('')
      setFormDate('')
      setFormTime('')
      fetchData()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to propose session')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleAccept = async (sessionId: string) => {
    setError('')
    setSuccess('')
    try {
      await sessionsService.acceptSession(sessionId)
      setSuccess('Session proposal accepted!')
      fetchData()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to accept session')
    }
  }

  const handleReject = async (sessionId: string) => {
    setError('')
    setSuccess('')
    try {
      await sessionsService.rejectSession(sessionId)
      setSuccess('Session proposal declined.')
      fetchData()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to reject session')
    }
  }

  const handleCancel = async (sessionId: string) => {
    setError('')
    setSuccess('')
    try {
      await sessionsService.cancelSession(sessionId)
      setSuccess('Session cancelled successfully.')
      fetchData()
      setSelectedSession(null)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to cancel session')
    }
  }

  const handleComplete = async (sessionId: string) => {
    setError('')
    setSuccess('')
    try {
      await sessionsService.completeSession(sessionId)
      setSuccess('Session marked as completed!')
      fetchData()
      setSelectedSession(null)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to complete session')
    }
  }

  const getStatusBadge = (statusStr: string) => {
    switch (statusStr) {
      case 'Requested':
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-yellow-50 text-yellow-700 rounded border border-yellow-200">Requested</span>
      case 'Accepted':
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded border border-blue-200">Accepted</span>
      case 'Scheduled':
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 rounded border border-green-200">Scheduled</span>
      case 'Completed':
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded border border-gray-200">Completed</span>
      case 'Rejected':
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-700 rounded border border-red-200">Declined</span>
      case 'Cancelled':
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-red-50/60 text-red-800 rounded border border-red-200/60">Cancelled</span>
      default:
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 rounded border border-gray-200">{statusStr}</span>
    }
  }

  const isSessionTimeReached = (proposedDate: string, proposedTime: string) => {
    try {
      const [year, month, day] = proposedDate.split('-').map(Number)
      const [hour, minute] = proposedTime.split(':').map(Number)
      const scheduledDate = new Date(year, month - 1, day, hour, minute)
      const now = new Date()
      return now >= scheduledDate
    } catch (e) {
      return false
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">SkillSwap Sessions</h1>
            <button
              onClick={handleOpenProposeModal}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md text-sm transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Book Session
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming ({activeSessions.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'requests'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Invites ({receivedRequests.length + sentRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              History ({historySessions.length})
            </button>
          </div>

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
            <p className="text-gray-500 py-6">Loading sessions...</p>
          ) : (
            <div className="space-y-4">
              {/* UPCOMING TAB */}
              {activeTab === 'upcoming' && (
                <>
                  {activeSessions.length === 0 ? (
                    <p className="text-sm text-gray-500 italic py-6">No upcoming sessions scheduled.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {activeSessions.map(sess => (
                        <div
                          key={sess.session_id}
                          onClick={() => setSelectedSession(sess)}
                          className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50/40 transition cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left"
                        >
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-baseline gap-2">
                              <span className="font-bold text-gray-800 text-lg">{sess.topic}</span>
                              {getStatusBadge(sess.status)}
                            </div>
                            <p className="text-xs font-semibold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100 w-max">
                              Skill: {sess.skill.skill_name}
                            </p>
                            <div className="flex gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {sess.proposed_date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {sess.proposed_time} ({sess.duration} mins)
                              </span>
                            </div>
                          </div>

                          {sess.status === 'Scheduled' || sess.status === 'Accepted' ? (
                            isSessionTimeReached(sess.proposed_date, sess.proposed_time) ? (
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation()
                                  try {
                                    const clientTime = new Date().toISOString()
                                    const meetingData = await meetingsService.joinMeeting(sess.session_id, clientTime)
                                    window.open(meetingData.meeting_url, '_blank')
                                  } catch (err: any) {
                                    alert(err.response?.data?.detail || 'Failed to join meeting room')
                                  }
                                }}
                                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-md transition shadow-sm cursor-pointer"
                              >
                                <Video className="w-4 h-4" />
                                Join Meeting
                              </button>
                            ) : (
                              <button
                                disabled
                                onClick={(e) => e.stopPropagation()}
                                className="px-3 py-2 bg-gray-100 border border-gray-200 text-gray-500 text-xs font-semibold rounded-md cursor-not-allowed"
                                title="Meeting available at scheduled time"
                              >
                                Meeting available at scheduled time.
                              </button>
                            )
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* REQUESTS TAB */}
              {activeTab === 'requests' && (
                <div className="space-y-6">
                  {/* Received requests */}
                  <div>
                    <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-3 text-left">Received Proposals</h3>
                    {receivedRequests.length === 0 ? (
                      <p className="text-xs text-gray-500 italic py-2 text-left">No received session proposals.</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {receivedRequests.map(sess => (
                          <div key={sess.session_id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                            <div className="space-y-1">
                              <span className="font-bold text-gray-800 block text-base">{sess.topic}</span>
                              <p className="text-xs text-gray-500">
                                Proposer: <span className="font-semibold text-gray-700">{sess.requester.profile.full_name}</span>
                              </p>
                              <p className="text-xs text-gray-600">
                                Skill: <span className="font-semibold text-blue-600">{sess.skill.skill_name}</span>
                              </p>
                              <div className="flex gap-4 text-[10px] text-gray-500 pt-1">
                                <span>Date: {sess.proposed_date}</span>
                                <span>Time: {sess.proposed_time} ({sess.duration}m)</span>
                              </div>
                            </div>

                            <div className="flex gap-2 self-end sm:self-center">
                              <button
                                onClick={() => handleAccept(sess.session_id)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition cursor-pointer"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleReject(sess.session_id)}
                                className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded transition cursor-pointer"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sent requests */}
                  <div className="pt-4">
                    <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-3 text-left">Sent Proposals</h3>
                    {sentRequests.length === 0 ? (
                      <p className="text-xs text-gray-500 italic py-2 text-left">No sent session proposals pending.</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {sentRequests.map(sess => (
                          <div key={sess.session_id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                            <div className="space-y-1">
                              <span className="font-bold text-gray-800 block text-base">{sess.topic}</span>
                              <p className="text-xs text-gray-500">
                                Target Partner: <span className="font-semibold text-gray-700">{sess.receiver.profile.full_name}</span>
                              </p>
                              <p className="text-xs text-gray-600">
                                Skill: <span className="font-semibold text-blue-600">{sess.skill.skill_name}</span>
                              </p>
                              <div className="flex gap-4 text-[10px] text-gray-500 pt-1">
                                <span>Date: {sess.proposed_date}</span>
                                <span>Time: {sess.proposed_time} ({sess.duration}m)</span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleCancel(sess.session_id)}
                              className="px-3 py-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded self-end sm:self-center transition cursor-pointer"
                            >
                              Cancel Request
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* HISTORY TAB */}
              {activeTab === 'history' && (
                <>
                  {historySessions.length === 0 ? (
                    <p className="text-sm text-gray-500 italic py-6">No session history records.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {historySessions.map(sess => (
                        <div
                          key={sess.session_id}
                          className="border border-gray-200 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left"
                        >
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-baseline gap-2">
                              <span className="font-bold text-gray-700 text-lg">{sess.topic}</span>
                              {getStatusBadge(sess.status)}
                            </div>
                            <p className="text-xs text-gray-500">
                              Skill: <span className="font-semibold">{sess.skill.skill_name}</span>
                            </p>
                            <div className="flex gap-4 text-xs text-gray-400">
                              <span>Date: {sess.proposed_date}</span>
                              <span>Duration: {sess.duration} mins</span>
                            </div>
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

        {/* BOOK SESSION MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-gray-200 rounded-lg max-w-lg w-full p-6 shadow-xl space-y-4 text-left">
              <h3 className="font-bold text-gray-900 text-lg">Propose Swap Session</h3>

              {connections.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500 italic">You must have active connections to schedule swap sessions.</p>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-4 px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProposeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Select Connection *</label>
                    <select
                      value={formReceiverId}
                      onChange={(e) => setFormReceiverId(e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white text-sm"
                    >
                      {connections.map(c => (
                        <option key={c.user_id} value={c.user_id}>
                          {c.profile.full_name} ({c.skillswap_id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Skill Topic *</label>
                    <select
                      value={formSkillId}
                      onChange={(e) => setFormSkillId(e.target.value)}
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
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Session Topic Title *</label>
                    <input
                      type="text"
                      value={formTopic}
                      onChange={(e) => setFormTopic(e.target.value)}
                      placeholder="e.g. Intro to SQLAlchemy, CSS flexbox review..."
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm bg-white"
                      maxLength={255}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                    <textarea
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Detail what you'd like to discuss or accomplish..."
                      rows={3}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Date *</label>
                      <input
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Time *</label>
                      <input
                        type="time"
                        value={formTime}
                        onChange={(e) => setFormTime(e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Duration (mins) *</label>
                      <select
                        value={formDuration}
                        onChange={(e) => setFormDuration(Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white"
                      >
                        <option value={30}>30 mins</option>
                        <option value={60}>60 mins</option>
                        <option value={90}>90 mins</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      disabled={formSubmitting}
                      className="px-4 py-1.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold transition cursor-pointer"
                    >
                      {formSubmitting ? 'Sending...' : 'Send Proposal'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* DETAILS OVERLAY MODAL */}
        {selectedSession && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full p-6 shadow-xl space-y-4 text-left">
              <div className="flex justify-between items-baseline border-b border-gray-150 pb-2">
                <h3 className="font-bold text-gray-900 text-lg">{selectedSession.topic}</h3>
                {getStatusBadge(selectedSession.status)}
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <p className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 w-max">
                  Skill Topic: {selectedSession.skill.skill_name}
                </p>
                
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase">Description</h4>
                  <p className="mt-1 leading-relaxed text-gray-700 bg-gray-50 p-2.5 rounded border border-gray-200">
                    {selectedSession.description || 'No description provided.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-xs text-gray-500 block font-semibold uppercase">Schedule Details</span>
                    <span className="block mt-0.5 font-medium text-gray-800">{selectedSession.proposed_date} @ {selectedSession.proposed_time}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block font-semibold uppercase">Duration</span>
                    <span className="block mt-0.5 font-medium text-gray-800">{selectedSession.duration} minutes</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1 border-t border-gray-100 pt-3">
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold uppercase">Requester</span>
                    <span className="block mt-0.5 text-gray-700 font-semibold">{selectedSession.requester.profile.full_name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold uppercase">Recipient</span>
                    <span className="block mt-0.5 text-gray-700 font-semibold">{selectedSession.receiver.profile.full_name}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-150 pt-4">
                {selectedSession.status === 'Accepted' && (
                  <button
                    onClick={() => handleComplete(selectedSession.session_id)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition cursor-pointer"
                  >
                    Complete Session
                  </button>
                )}
                {['Requested', 'Accepted', 'Scheduled'].includes(selectedSession.status) && (
                  <button
                    onClick={() => handleCancel(selectedSession.session_id)}
                    className="px-3.5 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded transition cursor-pointer"
                  >
                    Cancel Session
                  </button>
                )}
                <button
                  onClick={() => setSelectedSession(null)}
                  className="px-3.5 py-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
