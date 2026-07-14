import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach the JWT auth token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const authService = {
  async register(email: string, password: string, fullName: string) {
    const response = await api.post('/auth/register', { email, password, full_name: fullName })
    return response.data
  },

  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
}

export const profileService = {
  async getMe() {
    const response = await api.get('/profile/me')
    return response.data
  },

  async getProfile(userId: string) {
    const response = await api.get(`/profile/${userId}`)
    return response.data
  },

  async updateProfile(profileData: {
    full_name?: string
    profile_image?: string
    bio?: string
    experience?: string
  }) {
    const response = await api.put('/profile/update', profileData)
    return response.data
  },
}

export const skillsService = {
  async getAvailable() {
    const response = await api.get('/skills')
    return response.data
  },

  async getUserSkills() {
    const response = await api.get('/skills/user')
    return response.data
  },

  async addUserSkill(skillId: string, skillType: 'Teaching' | 'Learning', skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert') {
    const response = await api.post('/skills/user', {
      skill_id: skillId,
      skill_type: skillType,
      skill_level: skillLevel,
    })
    return response.data
  },

  async removeUserSkill(userSkillId: string) {
    const response = await api.delete(`/skills/user/${userSkillId}`)
    return response.data
  },
}

export const searchService = {
  async searchBySkill(skillName: string) {
    const response = await api.get('/search/skill', { params: { skill_name: skillName } })
    return response.data
  },

  async searchById(skillswapId: string) {
    const response = await api.get('/search/id', { params: { skillswap_id: skillswapId } })
    return response.data
  },
}

export const connectionsService = {
  async sendRequest(receiverId: string, requestedSkill: string, message?: string) {
    const response = await api.post('/connections/request', {
      receiver_id: receiverId,
      requested_skill: requestedSkill,
      message,
    })
    return response.data
  },

  async getReceivedRequests() {
    const response = await api.get('/connections/requests/received')
    return response.data
  },

  async getSentRequests() {
    const response = await api.get('/connections/requests/sent')
    return response.data
  },

  async acceptRequest(requestId: string) {
    const response = await api.post(`/connections/request/${requestId}/accept`)
    return response.data
  },

  async rejectRequest(requestId: string) {
    const response = await api.post(`/connections/request/${requestId}/reject`)
    return response.data
  },

  async cancelRequest(requestId: string) {
    const response = await api.delete(`/connections/request/${requestId}/cancel`)
    return response.data
  },

  async getConnections() {
    const response = await api.get('/connections')
    return response.data
  },
}

export const notificationsService = {
  async getNotifications() {
    const response = await api.get('/notifications')
    return response.data
  },

  async markRead(notificationId: string) {
    const response = await api.put(`/notifications/${notificationId}/read`)
    return response.data
  },
}

export const privacyService = {
  async blockUser(blockedUserId: string, reason?: string) {
    const response = await api.post('/privacy/block', {
      blocked_user_id: blockedUserId,
      reason,
    })
    return response.data
  },

  async unblockUser(blockedUserId: string) {
    const response = await api.post('/privacy/unblock', null, {
      params: { blocked_user_id: blockedUserId }
    })
    return response.data
  },

  async restrictUser(restrictedUserId: string, reason?: string) {
    const response = await api.post('/privacy/restrict', {
      restricted_user_id: restrictedUserId,
      reason,
    })
    return response.data
  },

  async unrestrictUser(restrictedUserId: string) {
    const response = await api.post('/privacy/unrestrict', null, {
      params: { restricted_user_id: restrictedUserId }
    })
    return response.data
  },

  async getBlockedUsers() {
    const response = await api.get('/privacy/blocked')
    return response.data
  },

  async getRestrictedUsers() {
    const response = await api.get('/privacy/restricted')
    return response.data
  },
}

export const chatService = {
  async getConversations() {
    const response = await api.get('/chat/conversations')
    return response.data
  },

  async getOrCreateConversation(receiverId: string) {
    const response = await api.post('/chat/conversations', { receiver_id: receiverId })
    return response.data
  },

  async getMessages(conversationId: string) {
    const response = await api.get(`/chat/conversations/${conversationId}/messages`)
    return response.data
  },

  async sendMessage(conversationId: string, content: string) {
    const response = await api.post(`/chat/conversations/${conversationId}/messages`, { content })
    return response.data
  },

  async markAsRead(conversationId: string) {
    const response = await api.put(`/chat/conversations/${conversationId}/read`)
    return response.data
  },
}



