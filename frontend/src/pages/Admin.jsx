import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
  const [tenants, setTenants] = useState({});
  const [newTenant, setNewTenant] = useState({ tenant_id: '', sirket: '', sifre: '', rol: 'client', esik: 15 });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/admin/tenants');
      setTenants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/admin/tenants', newTenant);
      setMsg(res.data.message);
      fetchTenants();
      setNewTenant({ tenant_id: '', sirket: '', sifre: '', rol: 'client', esik: 15 });
    } catch (err) {
      setMsg(err.response?.data?.detail || 'Hata oluştu');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Emin misiniz?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/tenants/${id}`);
      fetchTenants();
    } catch (err) {
      alert(err.response?.data?.detail);
    }
  };

  return (
    <div className="container animate-fade-in">
      <h1 style={{ color: '#00e5ff', marginBottom: '2rem' }}>💠 CogniMach Kontrol Paneli</h1>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="glass-panel">
            <h3 style={{ color: '#e2e8f0', marginBottom: '1.5rem' }}>Aktif Düğümler (Kayıtlı Fabrikalar)</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                    <th style={{ padding: '1rem 0' }}>Tenant ID</th>
                    <th>Şirket Adı</th>
                    <th>Yetki</th>
                    <th>RUL Threshold</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(tenants).map(id => (
                    <tr key={id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '1rem 0', color: '#00e5ff' }}>{id}</td>
                      <td>{tenants[id].sirket}</td>
                      <td>{tenants[id].rol}</td>
                      <td>{tenants[id].esik}</td>
                      <td>
                        {id !== 'admin' && (
                          <button onClick={() => handleDelete(id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            Sil
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="glass-panel highlight-cyan">
            <h3 style={{ color: '#e2e8f0', marginBottom: '1.5rem' }}>Ağa Yeni Şirket Ekle</h3>
            {msg && <div style={{ color: '#00e5ff', marginBottom: '1rem', fontSize: '0.9rem' }}>{msg}</div>}
            
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <div>
                <label className="input-label">Tenant ID</label>
                <input type="text" className="input-field" value={newTenant.tenant_id} onChange={e => setNewTenant({...newTenant, tenant_id: e.target.value})} required />
              </div>
              <div>
                <label className="input-label">Kurum Adı</label>
                <input type="text" className="input-field" value={newTenant.sirket} onChange={e => setNewTenant({...newTenant, sirket: e.target.value})} required />
              </div>
              <div>
                <label className="input-label">Erişim Anahtarı</label>
                <input type="password" className="input-field" value={newTenant.sifre} onChange={e => setNewTenant({...newTenant, sifre: e.target.value})} required />
              </div>
              <div>
                <label className="input-label">Yetki Seviyesi</label>
                <select className="input-field" value={newTenant.rol} onChange={e => setNewTenant({...newTenant, rol: e.target.value})}>
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn mt-2">Kaydı Tamamla</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
