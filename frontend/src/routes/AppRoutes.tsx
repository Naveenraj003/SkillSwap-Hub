import { Routes, Route } from 'react-router-dom'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Explore from '../pages/Explore'
import Profile from '../pages/Profile'
import Requests from '../pages/Requests'
import Sessions from '../pages/Sessions'
import Chat from '../pages/Chat'
import Settings from '../pages/Settings'
import NotFound from '../pages/NotFound'
import { ProtectedRoute } from '../components/common/ProtectedRoute'
import { PublicRoute } from '../components/common/PublicRoute'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      
      {/* Protected pages */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
      <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
