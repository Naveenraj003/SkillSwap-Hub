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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/sessions" element={<Sessions />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
