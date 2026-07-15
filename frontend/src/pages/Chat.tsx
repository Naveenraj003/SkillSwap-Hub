import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { chatService } from '../services/api'
import DashboardLayout from '../layouts/DashboardLayout'
import { Send, Check, CheckCheck } from 'lucide-react'

interface Skill {
  skill_id: string
  skill_name: string
}

interface Profile {
  full_name: string
  profile_image: string | null
  bio: string | null
}

interface UserSummary {
  user_id: string
  skillswap_id: string
  profile: Profile
}

interface Conversation {
  conversation_id: string
  user_one: string
  user_two: string
  created_at: string
  updated_at: string
  user1: UserSummary
  user2: UserSummary
  unread_count: number
  last_message: string | null
  last_message_at: string | null
}

interface Message {
  message_id: string
  conversation_id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: string
}

export default function Chat() {
  const [searchParams] = useSearchParams()
  const convIdFromQuery = searchParams.get('conv_id')
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  
  const [loadingConv, setLoadingConv] = useState(true)
  const [loadingMsg, setLoadingMsg] = useState(false)
  const [submittingMsg, setSubmittingMsg] = useState(false)
  const [error, setError] = useState('')

  const chatEndRef = useRef<HTMLDivElement>(null)

  const fetchConversations = async (silent = false) => {
    try {
      if (!silent) setLoadingConv(true)
      const data = await chatService.getConversations()
      setConversations(data)
      
      if (selectedConv) {
        const updated = data.find((c: Conversation) => c.conversation_id === selectedConv.conversation_id)
        if (updated) setSelectedConv(updated)
      }
      return data
    } catch (err) {
      console.error('Failed to load chats:', err)
      return []
    } finally {
      if (!silent) setLoadingConv(false)
    }
  }

  const fetchMessages = async (convId: string, silent = false) => {
    try {
      if (!silent) setLoadingMsg(true)
      const data = await chatService.getMessages(convId)
      setMessages(data)
    } catch (err) {
      console.error('Failed to load messages:', err)
    } finally {
      if (!silent) setLoadingMsg(false)
    }
  }

  const handleMarkRead = async (convId: string) => {
    try {
      await chatService.markAsRead(convId)
    } catch (err) {
      console.error('Failed to mark read:', err)
    }
  }

  const selectConversation = async (conv: Conversation) => {
    setSelectedConv(conv)
    setError('')
    await handleMarkRead(conv.conversation_id)
    await fetchMessages(conv.conversation_id)
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  useEffect(() => {
    const initChat = async () => {
      const data = await fetchConversations()
      if (convIdFromQuery) {
        const target = data.find((c: Conversation) => c.conversation_id === convIdFromQuery)
        if (target) {
          selectConversation(target)
        }
      }
    }
    initChat()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      fetchConversations(true)
      if (selectedConv) {
        fetchMessages(selectedConv.conversation_id, true)
      }
    }, 3000)
    return () => clearInterval(timer)
  }, [selectedConv])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedConv || !inputText.trim() || submittingMsg) return

    const messageText = inputText.trim()
    setInputText('')
    
    // Create optimistic message
    const tempMsgId = `temp-${Date.now()}`
    const tempMsg: Message = {
      message_id: tempMsgId,
      conversation_id: selectedConv.conversation_id,
      sender_id: user?.user_id || '',
      receiver_id: getRecipient(selectedConv).user_id,
      content: messageText,
      is_read: false,
      created_at: new Date().toISOString()
    }
    
    // Optimistic insert
    setMessages(prev => [...prev, tempMsg])
    
    setSubmittingMsg(true)
    setError('')
    try {
      const newMsg = await chatService.sendMessage(selectedConv.conversation_id, messageText)
      // Replace optimistic message with actual persisted message
      setMessages(prev => prev.map(m => m.message_id === tempMsgId ? newMsg : m))
      fetchConversations(true)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send message')
      // Remove optimistic message if sending fails
      setMessages(prev => prev.filter(m => m.message_id !== tempMsgId))
    } finally {
      setSubmittingMsg(false)
    }
  }

  const getRecipient = (conv: Conversation) => {
    return conv.user_one === user?.user_id ? conv.user2 : conv.user1
  }

  const getUnreadSentCount = () => {
    if (!selectedConv || !user) return 0
    return messages.filter(m => m.sender_id === user.user_id && !m.is_read).length
  }

  const unreadSentCount = getUnreadSentCount()
  const isLimitReached = unreadSentCount >= 3

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50/50">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="text-lg font-bold text-gray-800 text-left">My Chats</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {loadingConv && conversations.length === 0 ? (
              <p className="text-gray-500 py-6 text-sm">Loading chats...</p>
            ) : conversations.length === 0 ? (
              <p className="text-gray-500 py-6 px-4 text-xs italic">No conversations started yet. Connect with users to chat!</p>
            ) : (
              conversations.map(c => {
                const recipient = getRecipient(c)
                const isSelected = selectedConv?.conversation_id === c.conversation_id
                return (
                  <button
                    key={c.conversation_id}
                    onClick={() => selectConversation(c)}
                    className={`w-full p-4 flex gap-3 items-start transition text-left cursor-pointer ${
                      isSelected ? 'bg-blue-50/60' : 'bg-transparent hover:bg-gray-100/60'
                    }`}
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold overflow-hidden flex-shrink-0 border border-blue-200">
                      {recipient.profile.profile_image ? (
                        <img src={recipient.profile.profile_image} alt={recipient.profile.full_name} className="w-full h-full object-cover" />
                      ) : (
                        recipient.profile.full_name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-semibold text-gray-800 text-sm truncate">{recipient.profile.full_name}</span>
                        {c.last_message_at && (
                          <span className="text-[10px] text-gray-400">
                            {new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate pr-4">
                        {c.last_message || 'Start conversation...'}
                      </p>
                    </div>
                    {c.unread_count > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white flex-shrink-0">
                        {c.unread_count}
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConv ? (
            <>
              {/* Window Header */}
              {(() => {
                const recipient = getRecipient(selectedConv)
                return (
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold overflow-hidden border border-blue-200">
                        {recipient.profile.profile_image ? (
                          <img src={recipient.profile.profile_image} alt={recipient.profile.full_name} className="w-full h-full object-cover" />
                        ) : (
                          recipient.profile.full_name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm leading-snug">{recipient.profile.full_name}</h3>
                        <span className="font-mono text-[9px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded border border-gray-200">{recipient.skillswap_id}</span>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Messages list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
                {loadingMsg && messages.length === 0 ? (
                  <p className="text-gray-400 py-6 text-sm">Loading message logs...</p>
                ) : messages.length === 0 ? (
                  <p className="text-gray-400 text-xs italic py-6">Send a message to start conversation.</p>
                ) : (
                  messages.map(m => {
                    const isMe = m.sender_id === user?.user_id
                    return (
                      <div key={m.message_id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md px-3.5 py-2 rounded-lg text-sm text-left shadow-sm border ${
                          isMe
                            ? 'bg-blue-600 border-blue-700 text-white rounded-br-none'
                            : 'bg-white border-gray-200 text-gray-800 rounded-bl-none'
                        }`}>
                          <p className="leading-relaxed break-words">{m.content}</p>
                          <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-75">
                            <span>
                              {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && (
                              m.is_read ? (
                                <CheckCheck className="w-3 h-3 text-blue-200" />
                              ) : (
                                <Check className="w-3 h-3 text-blue-200" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Warning limit reached bar */}
              {isLimitReached && (
                <div className="px-4 py-2 bg-yellow-50 border-t border-b border-yellow-200 text-yellow-800 text-xs font-medium text-left">
                  ⚠️ Unread message limit reached. You can only send up to 3 unread messages before the recipient reads them.
                </div>
              )}

              {error && (
                <div className="px-4 py-2 bg-red-50 border-t border-b border-red-200 text-red-700 text-xs text-left">
                  {error}
                </div>
              )}

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white flex gap-3 items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isLimitReached || submittingMsg}
                  placeholder={
                    isLimitReached
                      ? 'Limit reached. Waiting for peer to read...'
                      : 'Type a message...'
                  }
                  className="flex-1 px-3.5 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={isLimitReached || !inputText.trim() || submittingMsg}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50/20 text-center">
              <p className="text-gray-500 font-medium">Select a conversation to start swapping skills!</p>
              <p className="text-xs text-gray-400 mt-1">Chat securely with active connections only.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
