import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Zap, MessageSquare, Mail, ArrowRight, Activity, TrendingUp, ShieldAlert, Loader2 } from 'lucide-react';

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
    <div className="animate-fade-in">
      {/* SECTION 1: HERO */}
      <section style={{ padding: '8rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="hero-grid">
            
            {/* Left Column (Vitrin) */}
            <div className="hero-left items-start-force text-left-force">
              <h1 className="hero-title gradient-text text-left-force" style={{ fontSize: '4.5rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
                Endüstrinin <br /> Nöral Ağı: <br /> CogniMach
              </h1>
              <p className="text-left-force" style={{ fontSize: '1.3rem', maxWidth: '550px', marginBottom: '2.5rem', color: '#94a3b8' }}>
                Üretim hatlarınızı karanlıktan kurtarın. Çift motorlu yapay zeka ve entegre LLM asistanı ile 
                <span style={{ color: '#00e5ff', fontWeight: 600 }}> "Sıfır Duruş"</span> hedefine ulaşın.
              </p>
              
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/login')} className="btn" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                  Sisteme Entegre Ol <ArrowRight size={20} />
                </button>
                <button 
                  onClick={handleDemoLogin} 
                  className="btn btn-secondary" 
                  style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Canlı Demoyu İzle'}
                </button>
              </div>
            </div>

            {/* Right Column (Makine Dairesi - Nöral Hub Görseli) */}
            <div className="hero-right" style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="bg-slate-900/60 backdrop-blur-3xl border border-slate-700/50 rounded-2xl p-8 shadow-[0_0_80px_rgba(0,229,255,0.15)] w-full max-w-xl relative overflow-hidden flex flex-col min-h-[450px]">
                {/* Header Dots */}
                <div className="flex gap-2 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/40"></div>
                </div>
                
                {/* Background Code Pulse */}
                <div className="font-mono text-[10px] opacity-20 select-none pointer-events-none flex flex-col gap-2">
                  <div className="text-cyan-400">{'>>'} INITIALIZING NEURAL_CORE_V4</div>
                  <div className="text-slate-400 pl-4">import tensorflow as tf</div>
                  <div className="text-slate-400 pl-4">from cognimach.ai import RandomForest, HoltWinter</div>
                  <div className="text-slate-400 pl-4">def process_telemetry(stream):</div>
                  <div className="text-slate-400 pl-8">prediction = model.predict(stream.data)</div>
                  <div className="text-slate-400 pl-8">if prediction.anomaly_score {'>'} 0.85:</div>
                  <div className="text-red-400 pl-12">trigger_alert("CRITICAL_BEARING_FAILURE")</div>
                  <div className="text-slate-400 pl-8">else:</div>
                  <div className="text-green-400 pl-12">optimize_throughput(stream)</div>
                  <div className="text-slate-400 pl-4">{'>>'} DATA_INGESTION_ACTIVE: 1550 RPM</div>
                </div>

                {/* Central Animated Visual */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Glowing Orbs */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-[60px] animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px]"></div>
                    
                    {/* Neural Pulse Graphic */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="p-6 bg-slate-950/80 border border-cyan-500/30 rounded-full shadow-[0_0_30px_rgba(0,229,255,0.2)]">
                        <Activity size={60} color="#00e5ff" className="glow-element" style={{ animation: 'pulse-glow 2s infinite' }} />
                      </div>
                      <div className="mt-4 px-4 py-1 bg-cyan-500/20 rounded-full border border-cyan-500/30">
                        <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">Live Neural Hub</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Data Stream (Floating Nodes) */}
                <div className="absolute bottom-8 right-8 flex flex-col items-end gap-2">
                   <div className="text-[10px] text-cyan-400 font-mono opacity-60">INGRESS: 42.8 KB/S</div>
                   <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400" style={{ width: '65%', animation: 'slide-line 2s infinite linear' }}></div>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Arka Plan Efekti */}
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(0, 229, 255, 0.05) 0%, transparent 70%)', zIndex: 1 }}></div>
      </section>

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
