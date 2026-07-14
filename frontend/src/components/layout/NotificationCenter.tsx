import React, { useState, useEffect, useRef } from 'react'
import { notificationsService } from '../../services/api'
import { Bell } from 'lucide-react'

interface Notification {
  notification_id: string
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = async () => {
    try {
      const data = await notificationsService.getNotifications()
      setNotifications(data)
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await notificationsService.markRead(id)
      setNotifications(prev =>
        prev.map(n => (n.notification_id === id ? { ...n, is_read: true } : n))
      )
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition focus:outline-none cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-150 flex justify-between items-center bg-gray-50">
            <span className="font-bold text-gray-800 text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs text-blue-600 font-semibold">{unreadCount} unread</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 italic">
                No notifications yet.
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.notification_id}
                  className={`p-4 text-left transition flex gap-3 items-start ${
                    n.is_read ? 'bg-white' : 'bg-blue-50/20 hover:bg-blue-50/40'
                  }`}
                >
                  <div className="flex-1 space-y-1">
                    <p className={`text-sm ${n.is_read ? 'text-gray-800' : 'font-semibold text-gray-900'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-gray-400 block pt-1">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {!n.is_read && (
                    <button
                      onClick={(e) => handleMarkAsRead(n.notification_id, e)}
                      className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-100/60 hover:bg-blue-100 px-1.5 py-0.5 rounded flex-shrink-0 cursor-pointer"
                    >
                      Read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
