import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import { Hexagon, LogOut } from 'lucide-react';

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('tenant_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('company_name');
    navigate('/');
  };

  const isAuthPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <>
      {!isAuthPage && (
        <nav className="nav-bar">
          <div className="flex items-center gap-2" style={{cursor: 'pointer'}} onClick={() => navigate('/')}>
            <Hexagon color="#00e5ff" size={28} />
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e2e8f0' }}>CogniMach</span>
          </div>
          <div>
            <button className="btn btn-secondary" onClick={handleLogout}>
              <LogOut size={18} /> Çıkış Yap
            </button>
          </div>
        </nav>
      )}
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
