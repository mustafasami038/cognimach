import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, Wrench, AlertTriangle, MessageSquare, FileUp } from 'lucide-react';

export default function Dashboard() {
  const tenantId = localStorage.getItem('tenant_id');
  const companyName = localStorage.getItem('company_name');
  
  const [status, setStatus] = useState('no_data'); // no_data, bekliyor, calisiyor, bakim_gerekiyor, arizali
  const [telemetry, setTelemetry] = useState(null);
  const [history, setHistory] = useState([]);
  const [rulGosterim, setRulGosterim] = useState('Veri Bekleniyor...');
  const [alertMsg, setAlertMsg] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  useEffect(() => {
    let interval;
    if (status === 'calisiyor') {
      interval = setInterval(() => {
        fetchNext();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const checkStatus = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/telemetry/status/${tenantId}`);
      setStatus(res.data.status);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post(`http://localhost:8000/telemetry/upload/${tenantId}`, formData);
      setStatus('bekliyor');
      setAlertMsg('');
    } catch (err) {
      alert("Yükleme başarısız");
    }
  };

  const startSystem = async () => {
    await axios.post(`http://localhost:8000/telemetry/action/${tenantId}?action=start`);
    setStatus('calisiyor');
    setAlertMsg('');
  };

  const fixSystem = async () => {
    await axios.post(`http://localhost:8000/telemetry/action/${tenantId}?action=fix`);
    setStatus('calisiyor');
    setAlertMsg('');
  };

  const fetchNext = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/telemetry/next/${tenantId}`);
      if (res.data.end_of_data) {
        setStatus('bekliyor');
        return;
      }
      
      setTelemetry(res.data.telemetry);
      setRulGosterim(res.data.rul_gosterim);
      
      const newHistory = res.data.history['Tool wear [min]'].map((val, idx) => ({ time: idx, wear: val }));
      setHistory(newHistory);

      if (res.data.status !== 'calisiyor') {
        setStatus(res.data.status);
        setAlertMsg(res.data.alert);
      }
    } catch (err) {
      console.error(err);
      setStatus('bekliyor');
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const newMsg = { role: 'user', content: chatInput };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');
    setIsAiLoading(true);
    
    try {
      const res = await axios.post(`http://localhost:8000/ai/chat/${tenantId}`, { prompt: chatInput });
      setChatMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Hata: ' + (err.response?.data?.detail || err.message) }]);
    }
    setIsAiLoading(false);
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1400px' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 style={{ color: '#00e5ff', marginBottom: '0.5rem' }}>💠 {companyName} Merkezi Paneli</h1>
          <p>CogniMach Otonom Karar Destek Ağı</p>
        </div>
        
        {status === 'no_data' ? (
          <div>
            <input type="file" id="csv-upload" accept=".csv" style={{ display: 'none' }} onChange={handleUpload} />
            <label htmlFor="csv-upload" className="btn" style={{ cursor: 'pointer' }}>
              <FileUp size={18} /> Telemetri Yükle
            </label>
          </div>
        ) : status === 'bekliyor' ? (
          <button className="btn" onClick={startSystem}><Play size={18} /> Sistemi Aktifleştir</button>
        ) : status === 'bakim_gerekiyor' ? (
          <button className="btn btn-secondary" onClick={fixSystem} style={{ background: '#f59e0b', color: '#000', borderColor: '#f59e0b' }}><Wrench size={18}/> Planlı Bakımı Onayla</button>
        ) : status === 'arizali' ? (
          <button className="btn btn-danger" onClick={fixSystem}><AlertTriangle size={18}/> Hasarı Onar ve Başlat</button>
        ) : (
          <div style={{ color: '#00e5ff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#00e5ff', display: 'inline-block', animation: 'pulse-glow 2s infinite' }}></span>
            Sistem Aktif (İzleniyor)
          </div>
        )}
      </div>

      {alertMsg && (
        <div className={`glass-panel mb-6 ${status === 'arizali' ? 'highlight-red' : 'highlight-orange'}`} style={{ backgroundColor: status === 'arizali' ? 'rgba(153, 27, 27, 0.2)' : 'rgba(245, 158, 11, 0.2)' }}>
          <h3 style={{ color: status === 'arizali' ? '#ef4444' : '#f59e0b', marginBottom: 0 }}>{alertMsg}</h3>
        </div>
      )}

      {telemetry && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="glass-panel highlight-cyan">
            <div className="input-label">🌡️ Hava Sıc.</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{telemetry['Air temperature [K]'].toFixed(1)} K</div>
          </div>
          <div className="glass-panel highlight-cyan">
            <div className="input-label">🔥 Süreç Sıc.</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{telemetry['Process temperature [K]'].toFixed(1)} K</div>
          </div>
          <div className="glass-panel highlight-cyan">
            <div className="input-label">⚙️ RPM</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{telemetry['Rotational speed [rpm]']}</div>
          </div>
          <div className="glass-panel highlight-cyan">
            <div className="input-label">🛠️ Aşınma / RUL</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{telemetry['Tool wear [min]']} Dk</div>
            <div style={{ color: status !== 'calisiyor' ? '#ef4444' : '#00e5ff', fontSize: '0.9rem', marginTop: '0.2rem' }}>Trend: {rulGosterim}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="glass-panel col-span-2" style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#e2e8f0' }}>📈 Degradasyon Eğrisi</h3>
          {history.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#e2e8f0' }} />
                <Line type="monotone" dataKey="wear" stroke="#00e5ff" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center" style={{ height: '100%', color: '#64748b' }}>Veri Bekleniyor...</div>
          )}
        </div>

        <div className="glass-panel flex-col flex" style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MessageSquare size={20} /> Cogni Asistan</h3>
          
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chatMessages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', backgroundColor: m.role === 'user' ? '#0f172a' : 'rgba(0, 229, 255, 0.1)', padding: '0.75rem', borderRadius: '8px', maxWidth: '90%', border: m.role === 'user' ? '1px solid #1e293b' : '1px solid rgba(0, 229, 255, 0.2)' }}>
                <span style={{ fontSize: '0.8rem', color: m.role === 'user' ? '#94a3b8' : '#00e5ff', display: 'block', marginBottom: '0.2rem' }}>{m.role === 'user' ? 'Sen' : 'Cogni'}</span>
                <div style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{m.content}</div>
              </div>
            ))}
            {isAiLoading && (
              <div style={{ alignSelf: 'flex-start', color: '#94a3b8', fontSize: '0.9rem' }}>Cogni düşünüyor...</div>
            )}
          </div>
          
          <form onSubmit={handleChat} className="flex gap-2">
            <input 
              type="text" 
              className="input-field" 
              style={{ marginBottom: 0 }} 
              placeholder="Asistana sor..." 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)}
              disabled={status === 'calisiyor' || isAiLoading}
            />
            <button type="submit" className="btn" style={{ padding: '0 1rem' }} disabled={status === 'calisiyor' || isAiLoading}>Gönder</button>
          </form>
          {status === 'calisiyor' && <div style={{ fontSize: '0.8rem', color: '#f59e0b', marginTop: '0.5rem', textAlign: 'center' }}>Makine stabilken Cogni izleme modundadır.</div>}
        </div>
      </div>
    </div>
  );
}
