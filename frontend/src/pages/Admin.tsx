import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { adminService } from '../services/api'
import DashboardLayout from '../layouts/DashboardLayout'
import { Shield, Search, AlertTriangle } from 'lucide-react'

interface UserRecord {
  user_id: string
  email: string
  skillswap_id: string
  status: string
  is_admin: boolean
  profile?: {
    full_name: string
  }
}

interface ReportRecord {
  report_id: string
  reporter_id: string
  reported_user_id: string
  reason: string
  description: string
  status: string
  created_at: string
  reporter: {
    skillswap_id: string
    profile: {
      full_name: string
    }
  }
  reported_user: {
    skillswap_id: string
    profile: {
      full_name: string
    }
  }
}

interface AuditRecord {
  action_id: string
  admin_id: string
  action_type: string
  target_id: string | null
  details: string
  created_at: string
  admin: {
    profile: {
      full_name: string
    }
  }
}

export default function Admin() {
  const { user } = useAuth()
  
  const [activeTab, setActiveTab] = useState<'users' | 'reports' | 'audit'>('users')
  const [users, setUsers] = useState<UserRecord[]>([])
  const [reports, setReports] = useState<ReportRecord[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([])
  
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Suspend Dialog
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null)
  const [suspendReason, setSuspendReason] = useState('')
  const [submittingSuspend, setSubmittingSuspend] = useState(false)

  const fetchUsersList = async (search = '') => {
    try {
      setLoading(true)
      const data = await adminService.listUsers(search)
      setUsers(data)
    } catch (err) {
      setError('Failed to fetch users list')
    } finally {
      setLoading(false)
    }
  }

  const fetchReportsList = async () => {
    try {
      setLoading(true)
      const data = await adminService.getReports()
      setReports(data)
    } catch (err) {
      setError('Failed to fetch complaints list')
    } finally {
      setLoading(false)
    }
  }

  const fetchAuditLogsList = async () => {
    try {
      setLoading(true)
      const data = await adminService.getAuditLogs()
      setAuditLogs(data)
    } catch (err) {
      setError('Failed to fetch action audit logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.is_admin) {
      if (activeTab === 'users') fetchUsersList(searchQuery)
      else if (activeTab === 'reports') fetchReportsList()
      else if (activeTab === 'audit') fetchAuditLogsList()
    }
  }, [activeTab, user])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsersList(searchQuery)
  }

  const triggerSuspend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    setError('')
    setSuccess('')
    setSubmittingSuspend(true)
    try {
      await adminService.suspendUser(selectedUser.user_id, suspendReason)
      setSuccess(`Suspended user ${selectedUser.email} successfully.`)
      setSelectedUser(null)
      setSuspendReason('')
      fetchUsersList(searchQuery)
    } catch (err) {
      setError('Failed to suspend user')
    } finally {
      setSubmittingSuspend(false)
    }
  }

  const handleActivate = async (userId: string) => {
    setError('')
    setSuccess('')
    try {
      await adminService.activateUser(userId)
      setSuccess('Re-activated user account successfully.')
      fetchUsersList(searchQuery)
    } catch (err) {
      setError('Failed to activate user')
    }
  }

  const handleUpdateReportStatus = async (reportId: string, statusStr: string) => {
    setError('')
    setSuccess('')
    try {
      await adminService.updateReportStatus(reportId, statusStr)
      setSuccess(`Report marked as ${statusStr}.`)
      fetchReportsList()
    } catch (err) {
      setError('Failed to update report status')
    }
  }

  if (!user?.is_admin) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto bg-white border border-red-200 rounded-lg p-6 text-center shadow-sm space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-sm text-gray-500">You do not have administrative privileges to access this console panel.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
            <Shield className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
          </div>

          {/* Admin Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Users Directory
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'reports' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Complaints & Reports ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'audit' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Action Logs
            </button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md">{success}</div>}

          {/* USERS DIRECTORY */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user emails, SkillSwap IDs..."
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </form>

              {loading && users.length === 0 ? (
                <p className="text-gray-500 py-4 text-sm">Loading users...</p>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                        <th className="p-3">User Info</th>
                        <th className="p-3">SkillSwap ID</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150">
                      {users.map(u => (
                        <tr key={u.user_id} className="hover:bg-gray-50/50">
                          <td className="p-3 font-semibold text-gray-800">{u.profile?.full_name || 'N/A'}</td>
                          <td className="p-3 font-mono text-xs">{u.skillswap_id}</td>
                          <td className="p-3 text-gray-600">{u.email}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${
                              u.status === 'Active'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {u.status === 'Active' ? (
                              <button
                                onClick={() => setSelectedUser(u)}
                                className="px-2.5 py-1 text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivate(u.user_id)}
                                className="px-2.5 py-1 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white rounded transition cursor-pointer"
                              >
                                Activate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* REPORTS COMPLAINTS FEED */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              {loading && reports.length === 0 ? (
                <p className="text-gray-500 py-4 text-sm">Loading complaints...</p>
              ) : reports.length === 0 ? (
                <p className="text-sm text-gray-500 italic py-6 text-left">No user complaints logged.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {reports.map(rep => (
                    <div key={rep.report_id} className="border border-gray-200 rounded-lg p-5 bg-gray-50/30 flex flex-col gap-3 text-left">
                      <div className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                        <span className="font-bold text-gray-800 text-base">Reason: {rep.reason}</span>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${
                          rep.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          rep.status === 'Reviewed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-green-50 text-green-700 border-green-200'
                        }`}>{rep.status}</span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <p className="leading-relaxed bg-white p-3 rounded border border-gray-200 text-gray-700">{rep.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                          <div>
                            <span className="text-gray-400 block font-semibold uppercase">Reporter</span>
                            <span className="text-gray-800 font-medium">{rep.reporter?.profile?.full_name || 'Deleted User'} ({rep.reporter?.skillswap_id})</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-semibold uppercase">Reported User</span>
                            <span className="text-gray-800 font-medium">{rep.reported_user?.profile?.full_name || 'Deleted User'} ({rep.reported_user?.skillswap_id})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                        <button
                          onClick={() => handleUpdateReportStatus(rep.report_id, 'Reviewed')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition cursor-pointer"
                        >
                          Mark Reviewed
                        </button>
                        <button
                          onClick={() => handleUpdateReportStatus(rep.report_id, 'Resolved')}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded transition cursor-pointer"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AUDIT LOG TIMELINE */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              {loading && auditLogs.length === 0 ? (
                <p className="text-gray-500 py-4 text-sm">Loading logs...</p>
              ) : auditLogs.length === 0 ? (
                <p className="text-sm text-gray-500 italic py-6 text-left">No audit actions recorded.</p>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                        <th className="p-3">Admin</th>
                        <th className="p-3">Action Type</th>
                        <th className="p-3">Details</th>
                        <th className="p-3">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150">
                      {auditLogs.map(log => (
                        <tr key={log.action_id} className="hover:bg-gray-50/50">
                          <td className="p-3 font-semibold text-gray-800">{log.admin?.profile?.full_name}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-gray-100 text-gray-700 border border-gray-200 rounded">
                              {log.action_type}
                            </span>
                          </td>
                          <td className="p-3 text-gray-600 text-xs">{log.details}</td>
                          <td className="p-3 text-gray-400 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SUSPEND DIALOG MODAL */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full p-6 shadow-xl space-y-4 text-left">
              <h3 className="font-bold text-gray-900 text-lg">Suspend Account</h3>
              <p className="text-xs text-gray-500">Provide the reason for suspending the user account {selectedUser.email}. This action is logged.</p>
              
              <form onSubmit={triggerSuspend} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Reason *</label>
                  <textarea
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    required
                    placeholder="e.g. Repeated harassment, inappropriate chat logs..."
                    rows={3}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    disabled={submittingSuspend}
                    className="px-3.5 py-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingSuspend}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition cursor-pointer"
                  >
                    Confirm Suspend
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
