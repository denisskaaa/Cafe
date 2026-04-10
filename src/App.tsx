import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/common/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Staff from './pages/Staff'
import Stock from './pages/Stock'
import CRM from './pages/CRM'
import Analytics from './pages/Analytics'
import MenuManagement from './pages/MenuManagement'
import Settings from './pages/Settings'

function App() {
  const { token } = useAuthStore()

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute isAuthenticated={!!token} />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/menu" element={<MenuManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App