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

      <HeroSection
        onLoginClick={() => navigate('/login')}
        onDemoClick={handleDemoLogin}
        loading={loading}
      />

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
