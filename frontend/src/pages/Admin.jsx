import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
  const [tenants, setTenants] = useState({});
  const [newTenant, setNewTenant] = useState({ tenant_id: '', sirket: '', sifre: '', rol: 'client', esik: 15 });
  const [msg, setMsg] = useState('');
  
  const [editTenantId, setEditTenantId] = useState(null);
  const [editConfig, setEditConfig] = useState({ tenant_id: '', sirket: '', sifre: '', rol: 'client', api_key: '', gnd_mail: '', gnd_sifre: '', alc_mail: '', esik: 15 });

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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/tenants/${editTenantId}`, editConfig);
      setMsg('Ayarlar başarıyla güncellendi!');
      setEditTenantId(null);
      fetchTenants();
    } catch (err) {
      setMsg(err.response?.data?.detail || 'Hata oluştu');
    }
  };

  const startEdit = (id) => {
    setEditTenantId(id);
    const t = tenants[id];
    setEditConfig({
      tenant_id: id,
      sirket: t.sirket || '',
      sifre: t.sifre || '',
      rol: t.rol || 'client',
      api_key: t.api_key || '',
      gnd_mail: t.gnd_mail || '',
      gnd_sifre: t.gnd_sifre || '',
      alc_mail: t.alc_mail || '',
      esik: t.esik || 15
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Emin misiniz?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/tenants/${id}`);
      if (editTenantId === id) setEditTenantId(null);
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
                    <th>Eşik</th>
                    <th>API Durumu</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(tenants).map(id => (
                    <tr key={id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '1rem 0', color: '#00e5ff' }}>{id}</td>
                      <td>{tenants[id].sirket}</td>
                      <td>{tenants[id].rol}</td>
                      <td>{tenants[id].esik} Vardiya</td>
                      <td>{tenants[id].api_key ? '✅ Aktif' : '❌ Pasif'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => startEdit(id)} style={{ background: 'transparent', color: '#f59e0b', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            Ayarlar
                          </button>
                          {id !== 'admin' && (
                            <button onClick={() => handleDelete(id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                              Sil
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          {msg && <div style={{ color: '#00e5ff', marginBottom: '1rem', padding: '10px', background: 'rgba(0, 229, 255, 0.1)', borderLeft: '3px solid #00e5ff', fontSize: '0.9rem' }}>{msg}</div>}

          {editTenantId ? (
            <div className="glass-panel highlight-cyan" style={{ borderTop: '3px solid #f59e0b' }}>
              <h3 style={{ color: '#f59e0b', marginBottom: '1rem' }}>⚙️ Düğüm Konfigürasyonu</h3>
              <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label className="input-label">Tenant ID</label>
                    <input type="text" className="input-field" value={editConfig.tenant_id} onChange={e => setEditConfig({...editConfig, tenant_id: e.target.value})} required />
                  </div>
                  <div>
                    <label className="input-label">Eşik (Vardiya)</label>
                    <input type="number" className="input-field" value={editConfig.esik} onChange={e => setEditConfig({...editConfig, esik: parseInt(e.target.value)})} required />
                  </div>
                </div>
                <div>
                  <label className="input-label">Kurum Adı</label>
                  <input type="text" className="input-field" value={editConfig.sirket} onChange={e => setEditConfig({...editConfig, sirket: e.target.value})} required />
                </div>
                <div>
                  <label className="input-label">Erişim Anahtarı</label>
                  <input type="password" className="input-field" value={editConfig.sifre} onChange={e => setEditConfig({...editConfig, sifre: e.target.value})} required />
                </div>
                
                <hr style={{ borderColor: '#1e293b', margin: '10px 0' }} />
                <h4 style={{ color: '#00e5ff', fontSize: '0.9rem' }}>🧠 Nöral & Otomasyon</h4>
                
                <div>
                  <label className="input-label">LLM API Key (Gemini)</label>
                  <input type="password" className="input-field" value={editConfig.api_key} onChange={e => setEditConfig({...editConfig, api_key: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label className="input-label">Gönderici Mail</label>
                    <input type="email" className="input-field" value={editConfig.gnd_mail} onChange={e => setEditConfig({...editConfig, gnd_mail: e.target.value})} />
                  </div>
                  <div>
                    <label className="input-label">SMTP Şifresi</label>
                    <input type="password" className="input-field" value={editConfig.gnd_sifre} onChange={e => setEditConfig({...editConfig, gnd_sifre: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="input-label">Alıcı Mail (Hedef)</label>
                  <input type="email" className="input-field" value={editConfig.alc_mail} onChange={e => setEditConfig({...editConfig, alc_mail: e.target.value})} />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="btn" style={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>Kaydet</button>
                  <button type="button" className="btn" onClick={() => setEditTenantId(null)} style={{ background: '#334155' }}>İptal</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="glass-panel highlight-cyan">
              <h3 style={{ color: '#e2e8f0', marginBottom: '1.5rem' }}>Ağa Yeni Şirket Ekle</h3>
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
          )}
        </div>
      </div>
    </div>
  );
}
