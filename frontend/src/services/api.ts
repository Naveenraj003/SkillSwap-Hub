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

