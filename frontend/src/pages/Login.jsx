import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, User } from 'lucide-react';

export default function Login() {
  const [tenantId, setTenantId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/login', {
        tenant_id: tenantId,
        password: password
      });
      
      if (res.data.success) {
        localStorage.setItem('tenant_id', res.data.tenant_id);
        localStorage.setItem('user_role', res.data.user.rol);
        localStorage.setItem('company_name', res.data.user.sirket);
        
        if (res.data.user.rol === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Giriş başarısız.');
    }
  };

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: '80vh' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '3rem 2rem' }}>
        <div className="text-center mb-6">
          <h1 style={{ color: '#00e5ff', fontSize: '2rem' }}>Kimlik Doğrulama</h1>
          <p>CogniMach SCADA sistemine erişmek için şifrenizi giriniz.</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="input-label">Tenant ID (Şirket Kodu)</label>
            <div style={{ position: 'relative' }}>
              <User size={20} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input 
                type="text" 
                className="input-field" 
                style={{ paddingLeft: '40px', marginBottom: 0 }}
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="input-label">Erişim Anahtarı</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} color="#94a3b8" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input 
                type="password" 
                className="input-field" 
                style={{ paddingLeft: '40px', marginBottom: 0 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn mt-4" style={{ width: '100%' }}>
            Sisteme Bağlan
          </button>
        </form>

        <div className="text-center mt-6">
          <button className="btn-secondary" style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer' }} onClick={() => navigate('/')}>
            ⬅️ Ağa Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
}
