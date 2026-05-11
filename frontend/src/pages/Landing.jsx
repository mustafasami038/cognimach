import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Zap, MessageSquare, Mail, ArrowRight, Activity, TrendingUp, ShieldAlert, Loader2 } from 'lucide-react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [visibleLogs, setVisibleLogs] = useState(0);

  const terminalLogs = [
    { text: "> [SYS] Establishing secure connection to CNC_Node_01... [OK]", color: "text-slate-300" },
    { text: "> [STREAM] Ingesting live telemetry: 1550 RPM | Temp: 308K", color: "text-cyan-400" },
    { text: "> [AI_ENGINE] Random Forest anomaly detection: NORMAL", color: "text-emerald-400" },
    { text: "> [PREDICTION] Holt Time-Series active. RUL: 45 Shifts", color: "text-emerald-400" },
    { text: "> [LLM_GEMINI] Root cause analysis module: STANDBY", color: "text-blue-400" }
  ];

  useEffect(() => {
    if (visibleLogs < terminalLogs.length) {
      const timer = setTimeout(() => {
        setVisibleLogs(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setVisibleLogs(0);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visibleLogs, terminalLogs.length]);

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/login', {
        tenant_id: 'demo',
        password: '1234'
      });
      
      if (res.data.success) {
        localStorage.setItem('tenant_id', res.data.tenant_id);
        localStorage.setItem('user_role', res.data.user.rol);
        localStorage.setItem('company_name', res.data.user.sirket);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Demo giriş hatası:", err);
      alert("Demo şu an hazır değil, lütfen daha sonra tekrar deneyin.");
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in" style={{ background: '#030712' }}>
      {/* ========== HERO SECTION ========== */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#030712' }}>

        {/* --- 1. ANIMATED CYBER GRID BACKGROUND --- */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          {/* Static SVG grid */}
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
            <defs>
              <pattern id="cybergrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00e5ff" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cybergrid)" />
          </svg>
          {/* Slow-drifting glow overlay */}
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: '-20%',
              background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(0,229,255,0.06) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* --- 2. GLOWING ORB behind text --- */}
        <div style={{
          position: 'absolute', top: '25%', left: '15%',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        {/* --- 3. HERO CONTENT --- */}
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '6rem 2rem', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '4rem', flexWrap: 'wrap' }}>

          {/* LEFT: Text + Buttons */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ flex: '1 1 520px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,229,255,0.07)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '9999px', padding: '6px 16px', marginBottom: '2rem' }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00e5ff', boxShadow: '0 0 8px #00e5ff', display: 'inline-block', animation: 'pulse-glow 2s infinite' }}></span>
              <span style={{ color: '#00e5ff', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Endüstri 4.0 — Gerçek Zamanlı AI</span>
            </motion.div>

            {/* Headline */}
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: '1.5rem', letterSpacing: '-2px' }}>
              <span style={{
                display: 'block',
                backgroundImage: 'linear-gradient(to bottom, #ffffff 30%, #475569 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}>
                Otonom Karar
              </span>
              <span style={{
                display: 'block',
                backgroundImage: 'linear-gradient(to right, #00e5ff, #6366f1)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}>
                Destek Ağı
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: 1.7, maxWidth: '540px', marginBottom: '2.5rem' }}
            >
              Üretim hatlarınızı karanlıktan kurtarın. Çift motorlu yapay zeka ve entegre LLM asistanı ile{' '}
              <span style={{ color: '#00e5ff', fontWeight: 600 }}>“Sıfır Duruş”</span> hedefine ulaşın.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
            >
              {/* PRIMARY: Border-Beam Button */}
              <div style={{ position: 'relative', borderRadius: '10px', padding: '2px', background: 'linear-gradient(135deg, #00e5ff, #6366f1, #00e5ff)', backgroundSize: '200% 200%', animation: 'beam-spin 3s linear infinite' }}>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    position: 'relative', display: 'flex', alignItems: 'center', gap: '8px',
                    background: '#030712', color: '#ffffff',
                    border: 'none', borderRadius: '8px',
                    padding: '0.9rem 2.2rem', fontSize: '1rem', fontWeight: 700,
                    cursor: 'pointer', zIndex: 1,
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#0f172a'}
                  onMouseLeave={e => e.currentTarget.style.background = '#030712'}
                >
                  Sisteme Entegre Ol <ArrowRight size={18} />
                </button>
              </div>

              {/* SECONDARY: Ghost Button */}
              <button
                onClick={handleDemoLogin}
                disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', padding: '0.9rem 2.2rem',
                  fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,229,255,0.4)'; e.currentTarget.style.color = '#00e5ff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#cbd5e1'; }}
              >
                {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : '▶'}
                {loading ? 'Bağlanıyor...' : 'Canlı Demoyu İzle'}
              </button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}
            >
              {[['%40', 'Duruş Azalması'], ['15+', 'Vardiya Öngörüsü'], ['0', 'Veri Kaybı']].map(([val, label]) => (
                <div key={label} style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#00e5ff', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', letterSpacing: '0.5px' }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT: Neural SVG Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
            style={{ flex: '1 1 420px', display: 'flex', justifyContent: 'center' }}
          >
            <div style={{
              position: 'relative',
              backgroundColor: 'rgba(15,23,42,0.5)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(0,229,255,0.2)',
              borderRadius: '2rem',
              padding: '2rem',
              width: '100%', maxWidth: '560px', height: '500px',
              boxShadow: '0 0 80px rgba(0,229,255,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {/* Corner accents */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', borderTop: '2px solid #00e5ff', borderLeft: '2px solid #00e5ff', borderRadius: '1.5rem 0 0 0', opacity: 0.6 }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '40px', borderBottom: '2px solid #00e5ff', borderRight: '2px solid #00e5ff', borderRadius: '0 0 1.5rem 0', opacity: 0.6 }} />

              <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 15px rgba(0,229,255,0.3))' }}>
                <defs>
                  <radialGradient id="hubGlow2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {[{ x:80,y:100 },{ x:320,y:120 },{ x:100,y:300 },{ x:300,y:320 },{ x:200,y:50 },{ x:200,y:350 }].map((pos,i) => (
                  <g key={i}>
                    <line x1="200" y1="200" x2={pos.x} y2={pos.y} stroke="#00e5ff" strokeWidth="1" strokeDasharray="4,4" opacity="0.2" />
                    <circle r="4" fill="#00e5ff">
                      <animateMotion path={`M 200 200 L ${pos.x} ${pos.y}`} dur={`${2+i}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0;1;0" dur={`${2+i}s`} repeatCount="indefinite" />
                    </circle>
                    <circle cx={pos.x} cy={pos.y} r="8" fill="#0f172a" stroke="#00e5ff" strokeWidth="1.5" />
                    <circle cx={pos.x} cy={pos.y} r="3" fill="#00e5ff">
                      <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </g>
                ))}
                <circle cx="200" cy="200" r="50" fill="url(#hubGlow2)">
                  <animate attributeName="r" values="45;58;45" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="200" cy="200" r="18" fill="#00e5ff" style={{ filter: 'blur(1px)' }} />
                {[...Array(12)].map((_,i) => (
                  <circle key={i} r="1.5" fill="#00e5ff" opacity="0.25">
                    <animate attributeName="cx" values={`${Math.random()*400};${Math.random()*400}`} dur={`${10+Math.random()*10}s`} repeatCount="indefinite" />
                    <animate attributeName="cy" values={`${Math.random()*400};${Math.random()*400}`} dur={`${10+Math.random()*10}s`} repeatCount="indefinite" />
                  </circle>
                ))}
              </svg>

              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
                <span style={{ fontSize: '10px', color: 'rgba(0,229,255,0.6)', letterSpacing: '2px', fontWeight: 700 }}>SYSTEM_LIVE</span>
              </div>

              {/* Floating metric pills */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(0,229,255,0.3)', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', color: '#00e5ff', fontFamily: 'monospace', fontWeight: 600 }}
              >
                RUL: 47 Vardiya ✓
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                style={{ position: 'absolute', bottom: '4rem', right: '1.5rem', background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', color: '#10b981', fontFamily: 'monospace', fontWeight: 600 }}
              >
                AI: NORMAL ●
              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* Bottom gradient fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to bottom, transparent, #030712)', zIndex: 5, pointerEvents: 'none' }} />
      </section>

      {/* beam-spin keyframe injected inline */}
      <style>{`
        @keyframes beam-spin {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>


      {/* SECTION 2: MARQUEE */}
      <div style={{ padding: '3rem 0', background: 'rgba(2, 6, 23, 0.5)' }}>
        <h3 className="text-center" style={{ fontSize: '0.9rem', color: '#94a3b8', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '2.5rem', fontWeight: 600 }}>
          Bizi Tercih Edenler
        </h3>
        <div className="marquee-container">
          <div className="marquee-content" style={{ display: 'flex', alignItems: 'center' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="marquee-item">
                <img 
                  src="/partner_logo.png" 
                  alt="Partner Logo" 
                  style={{ height: '80px', width: 'auto', margin: '0 50px', objectFit: 'contain' }} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: PROBLEM VS SOLUTION */}
      <section style={{ padding: '6rem 2rem', background: 'rgba(15, 23, 42, 0.2)' }}>
        <div className="container">
          <div className="grid grid-cols-2 gap-12">
            <div className="glass-panel" style={{ borderColor: 'rgba(239, 68, 68, 0.2)', padding: '3rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: '#ef4444', marginBottom: '1.5rem' }}><ShieldAlert size={48} /></div>
              <h2 style={{ fontSize: '2rem' }}>Eski Nesil: Reaktif Bakım</h2>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                <li style={{ color: '#94a3b8' }}>❌ Makine bozulur, üretim aniden durur.</li>
                <li style={{ color: '#94a3b8' }}>❌ Yedek parça maliyetleri tavan yapar.</li>
                <li style={{ color: '#94a3b8' }}>❌ Fabrikada panik havası başlar.</li>
              </ul>
            </div>
            
            <div className="glass-panel glow-border" style={{ padding: '3rem', border: '1px solid rgba(0, 229, 255, 0.4)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: '#00e5ff', marginBottom: '1.5rem' }}><ShieldCheck size={48} /></div>
              <h2 style={{ fontSize: '2rem' }}>Yeni Nesil: CogniMach Preskriptif Bakım</h2>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                <li style={{ color: '#e2e8f0' }}>✅ Saniyeler içinde anomali tespiti.</li>
                <li style={{ color: '#e2e8f0' }}>✅ Yapay zeka ile otomatik kök neden analizi.</li>
                <li style={{ color: '#e2e8f0' }}>✅ Otonom iş emirleri ile sıfır duruş.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: BENTO GRID */}
      <section style={{ padding: '6rem 2rem' }}>
        <div className="container">
          <div className="text-center mb-12">
            <h2 style={{ fontSize: '3rem' }}>Geleceğin Teknolojisi</h2>
            <p>Endüstri 4.0'ın ötesinde, tam otonom bir mimari.</p>
          </div>
          
          <div className="bento-grid">
            <div className="glass-panel bento-1 flex-col" style={{ justifyContent: 'center', padding: '2.5rem' }}>
              <Zap color="#00e5ff" size={32} />
              <h3 style={{ marginTop: '1.5rem', fontSize: '1.5rem' }}>Hibrit Kök Neden Analizi</h3>
              <p>Random Forest algoritmalarımız milisaniyelik tork sapmalarını yakalar ve hatayı oluşmadan bilir.</p>
            </div>
            
            <div className="glass-panel bento-2 flex-col" style={{ justifyContent: 'center', padding: '2.5rem' }}>
              <TrendingUp color="#3b82f6" size={32} />
              <h3 style={{ marginTop: '1.5rem', fontSize: '1.5rem' }}>Geleceği Gören Mimari</h3>
              <p>Holt Zaman Serisi projeksiyonu ile makinelerinizin Kalan Faydalı Ömrünü (RUL) vardiya hassasiyetinde tahmin ediyoruz.</p>
            </div>
            
            <div className="glass-panel bento-3 flex-col" style={{ justifyContent: 'center', padding: '2rem' }}>
              <MessageSquare color="#a855f7" size={32} />
              <h3 style={{ marginTop: '1.2rem' }}>Sanal Bakım Asistanı</h3>
              <p style={{ fontSize: '0.9rem' }}>Gemini LLM tabanlı chatbotumuz, sensör verilerini insan dilinde analiz ederek raporlar sunar.</p>
            </div>
            
            <div className="glass-panel bento-4 flex-col" style={{ justifyContent: 'center', padding: '2rem' }}>
              <Mail color="#f59e0b" size={32} />
              <h3 style={{ marginTop: '1.2rem' }}>Karanlık Fabrika Otomasyonu</h3>
              <p style={{ fontSize: '0.9rem' }}>Herhangi bir anomali anında sistem otomatik olarak mail ve WhatsApp üzerinden iş emri oluşturur.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: ROI METRICS */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(to right, transparent, rgba(0, 229, 255, 0.05), transparent)' }}>
        <div className="container grid grid-cols-3 gap-8 text-center">
          <div>
            <h2 style={{ fontSize: '4rem', color: '#00e5ff', textShadow: '0 0 20px rgba(0, 225, 255, 0.4)' }}>%40</h2>
            <p style={{ fontWeight: 600 }}>Planlanmamış Duruşlarda Azalma</p>
          </div>
          <div>
            <h2 style={{ fontSize: '4rem', color: '#00e5ff', textShadow: '0 0 20px rgba(0, 225, 255, 0.4)' }}>15+</h2>
            <p style={{ fontWeight: 600 }}>Erken Uyarı Vardiya Kapasitesi</p>
          </div>
          <div>
            <h2 style={{ fontSize: '4rem', color: '#00e5ff', textShadow: '0 0 20px rgba(0, 225, 255, 0.4)' }}>0</h2>
            <p style={{ fontWeight: 600 }}>Veri Kaybı (Edge Computing)</p>
          </div>
        </div>
      </section>

      {/* SECTION 6: FINAL CTA & FOOTER */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <div className="container glass-panel" style={{ padding: '4rem', background: 'radial-gradient(circle at center, rgba(0, 229, 255, 0.1) 0%, transparent 70%)' }}>
          <h2 style={{ fontSize: '2.5rem' }}>Fabrikanızı Endüstri 4.0 ile tanıştırmaya hazır mısınız?</h2>
          <p style={{ marginBottom: '2rem' }}>Otonom bakım devrimine bugün katılın.</p>
          <button onClick={() => navigate('/login')} className="btn" style={{ padding: '1rem 3rem' }}>Hemen Başla</button>
        </div>
        
        <footer style={{ marginTop: '6rem', borderTop: '1px solid #1e293b', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1rem' }}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '40px', borderRadius: '4px' }} />
            <span style={{ fontWeight: 700, letterSpacing: '1px' }}>COGNIMACH</span>
          </div>
          <p style={{ fontSize: '0.8rem' }}>&copy; 2026 CogniMach Neural Systems. Tüm hakları saklıdır.</p>
        </footer>
      </section>
    </div>
  );
}
