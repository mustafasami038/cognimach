import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, Wrench, AlertTriangle, MessageSquare, FileUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const tenantId = localStorage.getItem('tenant_id');
  const companyName = localStorage.getItem('company_name');
  
  const [status, setStatus] = useState('no_data'); // no_data, bekliyor, calisiyor, bakim_gerekiyor, arizali
  const [telemetry, setTelemetry] = useState(null);
  const [history, setHistory] = useState([]);
  const [rulGosterim, setRulGosterim] = useState('Veri Bekleniyor...');
  const [rulSayisal, setRulSayisal] = useState(20.0);
  const [alertMsg, setAlertMsg] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Gantt Chart Live Schedule State
  const [schedule, setSchedule] = useState({
    scenario: 1,
    savedHours: 3.5,
    blocks: [
      { id: 'sip401', label: 'Sipariş #401', duration: 40, color: '#2563eb', text: 'white', desc: '12s' },
      { id: 'bakim', label: '⚙️ BAKIM', duration: 20, color: '#10b981', text: '#0f172a', desc: '4s' },
      { id: 'sip402', label: 'Sipariş #402', duration: 40, color: '#1e3a8a', text: 'white', desc: '18s' }
    ],
    ticks: ['Şimdi', '+12s', '+16s', '+34s'],
    message: 'Bakım işlemi #401 ile #402 arasına (duruş maliyetinin en düşük olduğu aralık) konumlandırıldı.'
  });

  // Gantt Chart Live Update Logic (Fetching from Backend)
  useEffect(() => {
    let isSubscribed = true;
    const fetchSchedule = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/schedule/${tenantId}?current_rul=${rulSayisal}`);
        if (isSubscribed && res.data.success) {
          setSchedule(res.data);
        }
      } catch (err) {
        console.error("Schedule fetch error", err);
      }
    };
    
    fetchSchedule();
    const interval = setInterval(fetchSchedule, 5000);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [tenantId, rulSayisal]);

  // Yeni Eklenen Stateler
  const [activeTab, setActiveTab] = useState('canli');
  const [toastMsg, setToastMsg] = useState('');
  const [logs, setLogs] = useState([]);
  const [rootCauseReport, setRootCauseReport] = useState('');
  const [isReportLoading, setIsReportLoading] = useState(false);

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

  useEffect(() => {
    if (activeTab === 'loglar') {
      fetchLogs();
    }
  }, [activeTab]);

  const checkStatus = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/telemetry/status/${tenantId}`);
      setStatus(res.data.status);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/telemetry/logs/${tenantId}`);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const generateRootCause = async () => {
    setIsReportLoading(true);
    setRootCauseReport('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/ai/report/${tenantId}`);
      setRootCauseReport(res.data.report);
    } catch (err) {
      setRootCauseReport('Hata: ' + (err.response?.data?.detail || err.message));
    }
    setIsReportLoading(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/telemetry/upload/${tenantId}`, formData);
      setStatus('bekliyor');
      setAlertMsg('');
    } catch (err) {
      alert("Yükleme başarısız");
    }
  };

  const startSystem = async () => {
    await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/telemetry/action/${tenantId}?action=start`);
    setStatus('calisiyor');
    setAlertMsg('');
  };

  const fixSystem = async () => {
    await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/telemetry/action/${tenantId}?action=fix`);
    setStatus('calisiyor');
    setAlertMsg('');
    fetchLogs(); // Logları yenile
  };

  const fetchNext = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/telemetry/next/${tenantId}`);
      if (res.data.end_of_data) {
        setStatus('bekliyor');
        return;
      }
      
      setTelemetry(res.data.telemetry);
      setRulGosterim(res.data.rul_gosterim);
      if (res.data.rul_sayisal !== undefined) {
        setRulSayisal(res.data.rul_sayisal);
      }
      
      const newHistory = res.data.history['Tool wear [min]'].map((val, idx) => ({ time: idx, wear: val }));
      setHistory(newHistory);

      if (res.data.status !== 'calisiyor') {
        setStatus(res.data.status);
        setAlertMsg(res.data.alert);
        
        // Mail Gönderim Bildirimi
        if (res.data.mail_status) {
          if (res.data.mail_status.includes('başarıyla')) {
            setToastMsg('✉️ Otonom iş emri (Mail) başarıyla iletildi!');
            setTimeout(() => setToastMsg(''), 5000);
          } else if (res.data.mail_status.includes('❌') || res.data.mail_status.includes('eksik')) {
            setToastMsg(res.data.mail_status); // Mail hatasını ekranda göster
            setTimeout(() => setToastMsg(''), 7000);
          }
        }

        // WhatsApp Gönderim Bildirimi
        if (res.data.wp_status) {
          if (res.data.wp_status.includes('başarıyla')) {
            setToastMsg('📱 WhatsApp Bildirimi Başarıyla Gönderildi!');
            setTimeout(() => setToastMsg(''), 5000);
          } else if (res.data.wp_status.includes('❌')) {
            setToastMsg(res.data.wp_status);
            setTimeout(() => setToastMsg(''), 7000);
          }
        }
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
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/ai/chat/${tenantId}`, { prompt: chatInput });
      setChatMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Hata: ' + (err.response?.data?.detail || err.message) }]);
    }
    setIsAiLoading(false);
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1400px' }}>
      
      {/* BAŞARILI MAİL TOAST BİLDİRİMİ */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#0f172a', borderLeft: '4px solid #10b981', color: '#10b981', padding: '15px 20px', borderRadius: '4px', zIndex: 9999, boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)', animation: 'fade-in 0.3s ease-out' }}>
          {toastMsg}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/logo.jpg" alt="Logo" style={{ width: '60px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 229, 255, 0.2)' }} />
          <div>
            <h1 style={{ color: '#00e5ff', marginBottom: '0.2rem', fontSize: '1.5rem' }}>{companyName} Merkezi Paneli</h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>CogniMach Otonom Karar Destek Ağı</p>
          </div>
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
        
        {/* SOL: SEKMELER VE İÇERİK */}
        <div className="col-span-2 flex flex-col gap-4">
          <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
            <button onClick={() => setActiveTab('canli')} style={{ color: activeTab === 'canli' ? '#00e5ff' : '#94a3b8', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderBottom: activeTab === 'canli' ? '2px solid #00e5ff' : 'none', paddingBottom: '5px' }}>📊 Canlı İzleme</button>
            <button onClick={() => setActiveTab('loglar')} style={{ color: activeTab === 'loglar' ? '#00e5ff' : '#94a3b8', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderBottom: activeTab === 'loglar' ? '2px solid #00e5ff' : 'none', paddingBottom: '5px' }}>📜 Hata Logları</button>
            <button onClick={() => setActiveTab('analiz')} style={{ color: activeTab === 'analiz' ? '#00e5ff' : '#94a3b8', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderBottom: activeTab === 'analiz' ? '2px solid #00e5ff' : 'none', paddingBottom: '5px' }}>🧠 Kök Neden Analizi</button>
          </div>

          {activeTab === 'canli' && (
            <div className="glass-panel" style={{ height: '400px' }}>
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
          )}

          {activeTab === 'loglar' && (
            <div className="glass-panel" style={{ height: '400px', overflowY: 'auto' }}>
              <h3 style={{ marginBottom: '1rem', color: '#e2e8f0' }}>📜 Geçmiş Arıza ve Uyarı Kayıtları</h3>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                    <th style={{ padding: '0.5rem 0' }}>Zaman</th>
                    <th>Vardiya Dk.</th>
                    <th>Yapay Zeka (Tetik)</th>
                    <th>Olay</th>
                    <th>Hava Sıc.</th>
                    <th>RPM</th>
                    <th>Aşınma</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length > 0 ? logs.map((log, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '0.5rem 0', color: '#94a3b8' }}>{log['Tarih/Saat']}</td>
                      <td>{log['Vardiya Dk.']}</td>
                      <td style={{ color: '#00e5ff' }}>{log['Tetikleyen AI']}</td>
                      <td style={{ color: log['Olay Tipi'].includes('Şoku') ? '#ef4444' : '#f59e0b' }}>{log['Olay Tipi']}</td>
                      <td>{log['Hava Sıc.'].toFixed(1)}</td>
                      <td>{log['Hız']}</td>
                      <td>{log['Aşınma']}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7" style={{ textAlign: 'center', paddingTop: '2rem', color: '#64748b' }}>Henüz kayıtlı log bulunmamaktadır.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'analiz' && (
            <div className="glass-panel" style={{ height: '400px', overflowY: 'auto' }}>
              <h3 style={{ marginBottom: '1rem', color: '#e2e8f0' }}>🧠 Nöral Kök Neden Çözümlemesi</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>Bu sistem Gemini yapay zekası ile anlık anomali üzerinden profesyonel fabrika bakım raporu oluşturur.</p>
              <button onClick={generateRootCause} className="btn mb-4" disabled={status === 'calisiyor' || isReportLoading} style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
                {isReportLoading ? 'Bilişsel Motor Devrede...' : 'Nöral Raporu Başlat'}
              </button>
              
              {rootCauseReport && (
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '4px', borderLeft: '3px solid #8b5cf6', whiteSpace: 'pre-wrap', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {rootCauseReport}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SAĞ: COGNI ASİSTAN */}
        <div className="glass-panel flex-col flex" style={{ height: '445px' }}>
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

      {/* V2.0 MODULES ROW — framer-motion stagger */}
      <motion.div
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '1.5rem', width: '100%' }}
      >

        {/* WIDGET 1: Titreşim Zarf Spektrumu */}
        <motion.div
          className="glass-panel"
          variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } } }}
          whileHover={{ y: -5, boxShadow: '0 20px 40px -15px rgba(0,229,255,0.1)' }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#e2e8f0', margin: 0, fontSize: '1rem', fontWeight: 700 }}>
              📊 Titreşim Zarf Spektrumu (Live)
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '9999px', padding: '3px 10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', animation: 'pulse-glow 2s infinite' }}></span>
              <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>Sensör Aktif</span>
            </div>
          </div>

          {/* Equalizer Chart */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '4px', height: '140px', width: '100%', borderBottom: '1px solid #1e293b', borderLeft: '1px solid #1e293b', padding: '0 8px 0 8px' }}>
            {[20, 45, 30, 60, 35, 50, 25].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: 'rgba(34,211,238,0.5)', borderRadius: '3px 3px 0 0' }}></div>
            ))}
            {/* ANOMALY BAR — 165Hz */}
            <div style={{ flex: 1, height: '95%', backgroundColor: '#ef4444', borderRadius: '3px 3px 0 0', boxShadow: '0 0 12px rgba(239,68,68,0.8)', position: 'relative', animation: 'pulse-glow 1.5s infinite' }}>
              <span style={{ position: 'absolute', top: '-26px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', color: '#f87171', fontFamily: 'monospace', whiteSpace: 'nowrap', backgroundColor: '#020617', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.4)' }}>
                ⚠️ 165 Hz (İç Bilezik)
              </span>
            </div>
            {[55, 40, 65, 30, 48, 22, 38].map((h, i) => (
              <div key={i+8} style={{ flex: 1, height: `${h}%`, backgroundColor: 'rgba(34,211,238,0.5)', borderRadius: '3px 3px 0 0' }}></div>
            ))}
            <span style={{ position: 'absolute', bottom: '-20px', left: 0, fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>0 Hz</span>
            <span style={{ position: 'absolute', bottom: '-20px', right: 0, fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>500 Hz</span>
          </div>
        </motion.div>

        {/* WIDGET 2: Üretim ve Bakım Çizelgesi */}
        <motion.div
          className="glass-panel"
          variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } } }}
          whileHover={{ y: -5, boxShadow: '0 20px 40px -15px rgba(0,229,255,0.1)' }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#e2e8f0', margin: 0, fontSize: '1rem', fontWeight: 700 }}>
              ⏱️ Üretim ve Bakım Çizelgesi
            </h3>
            <div style={{ backgroundColor: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: '9999px', padding: '3px 10px' }}>
              <span style={{ color: '#22d3ee', fontSize: '0.75rem', fontWeight: 600 }}>Optimal Slot Bulundu</span>
            </div>
          </div>

          {/* Gantt Bar */}
          <div style={{ display: 'flex', width: '100%', height: '48px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1e293b', marginTop: '0.5rem' }}>
            {schedule.blocks.map((block, idx) => (
              <motion.div
                layout
                key={block.id + idx}
                style={{
                  width: `${block.percentage}%`,
                  backgroundColor: block.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRight: idx !== schedule.blocks.length - 1 ? '1px solid #1e293b' : 'none',
                  animation: block.id === 'bakim' && schedule.scenario !== 2 ? 'pulse-glow 2s infinite' : 'none'
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              >
                <span style={{ color: block.text, fontSize: block.id === 'bakim' ? '0.7rem' : '0.75rem', fontWeight: block.id === 'bakim' ? 900 : 700 }}>
                  {block.label} {block.id !== 'bakim' && `(${block.desc})`}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Tick labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontFamily: 'monospace', padding: '0 2px' }}>
            {schedule.ticks.map((tick, i) => <span key={i}>{tick}</span>)}
          </div>

          {/* Alert box */}
          <div style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem' }}>💡</span>
            <p style={{ margin: 0, color: '#10b981', fontSize: '0.85rem', lineHeight: 1.5 }}>
              <strong style={{ color: '#34d399' }}>Kurtarılan Kurulum Süresi: {schedule.savedHours} Saat.</strong><br />
              <span style={{ color: '#6ee7b7', fontSize: '0.78rem' }}>{schedule.message}</span>
            </p>
          </div>
        </motion.div>

      </motion.div>

    </div>
  );
}
