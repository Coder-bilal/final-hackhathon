import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import FamilyMemberDetail from './pages/FamilyMemberDetail'

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  // Null, empty, string "undefined" or literal null should all be rejected
  if (!token || token === '' || token === 'undefined' || token === null) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/family/:id" element={<RequireAuth><FamilyMemberDetail /></RequireAuth>} />
      </Routes>
    </div>
  )
}

export default App
