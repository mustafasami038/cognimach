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
      <section style={{ padding: '6rem 2rem', position: 'relative', overflow: 'hidden', minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '4rem', 
            width: '100%',
            flexWrap: 'wrap' 
          }}>
            
            {/* Left Column (Vitrin) */}
            <div style={{ 
              flex: '1 1 500px', 
              textAlign: 'left', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start' 
            }}>
              <h1 className="hero-title gradient-text" style={{ 
                textAlign: 'left', 
                fontSize: 'clamp(3rem, 8vw, 4.8rem)', 
                lineHeight: '1.1', 
                marginBottom: '2rem',
                fontWeight: 800
              }}>
                Endüstrinin <br /> Nöral Ağı: <br /> CogniMach
              </h1>
              <p style={{ 
                fontSize: '1.4rem', 
                maxWidth: '550px', 
                marginBottom: '3rem', 
                color: '#94a3b8',
                lineHeight: '1.6',
                textAlign: 'left'
              }}>
                Üretim hatlarınızı karanlıktan kurtarın. Çift motorlu yapay zeka ve entegre LLM asistanı ile 
                <span style={{ color: '#00e5ff', fontWeight: 600 }}> "Sıfır Duruş"</span> hedefine ulaşın.
              </p>
              
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                <button onClick={() => navigate('/login')} className="btn" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
                  Sisteme Entegre Ol <ArrowRight size={22} style={{ marginLeft: '8px' }} />
                </button>
                <button 
                  onClick={handleDemoLogin} 
                  className="btn btn-secondary" 
                  style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" size={22} /> : 'Canlı Demoyu İzle'}
                </button>
              </div>
            </div>

            {/* Right Column (Makine Dairesi - Animasyon) */}
            <div style={{ 
              flex: '1 1 400px', 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.4)', 
                backdropFilter: 'blur(30px)', 
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(0, 229, 255, 0.25)', 
                borderRadius: '2.5rem', 
                padding: '2rem', 
                width: '100%', 
                maxWidth: '580px', 
                height: '520px', 
                position: 'relative', 
                overflow: 'hidden', 
                boxShadow: '0 0 100px rgba(0, 229, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                
                {/* SVG Neural Animation */}
                <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 15px rgba(0, 229, 255, 0.3))' }}>
                  <defs>
                    <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Lines with Pulses */}
                  {[
                    { x: 80, y: 100 }, { x: 320, y: 120 },
                    { x: 100, y: 300 }, { x: 300, y: 320 },
                    { x: 200, y: 50 }, { x: 200, y: 350 }
                  ].map((pos, i) => (
                    <g key={i}>
                      <line x1="200" y1="200" x2={pos.x} y2={pos.y} stroke="#00e5ff" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.15" />
                      <circle r="4" fill="#00e5ff">
                        <animateMotion path={`M 200 200 L ${pos.x} ${pos.y}`} dur={`${2 + i}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0;1;0" dur={`${2 + i}s`} repeatCount="indefinite" />
                      </circle>
                      <circle cx={pos.x} cy={pos.y} r="8" fill="#0f172a" stroke="#00e5ff" strokeWidth="1.5" />
                      <circle cx={pos.x} cy={pos.y} r="3" fill="#00e5ff">
                        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                      </circle>
                    </g>
                  ))}

                  {/* Central Hub */}
                  <circle cx="200" cy="200" r="50" fill="url(#hubGlow)">
                    <animate attributeName="r" values="45;55;45" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="200" cy="200" r="18" fill="#00e5ff" style={{ filter: 'blur(1px)' }} />
                  
                  {/* Floating Particles */}
                  {[...Array(15)].map((_, i) => (
                    <circle key={i} r="1.5" fill="#00e5ff" opacity="0.3">
                      <animate attributeName="cx" values={`${Math.random()*400};${Math.random()*400}`} dur={`${10+Math.random()*10}s`} repeatCount="indefinite" />
                      <animate attributeName="cy" values={`${Math.random()*400};${Math.random()*400}`} dur={`${10+Math.random()*10}s`} repeatCount="indefinite" />
                    </circle>
                  ))}
                </svg>

                {/* Minimalist Visual Indicators */}
                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
                  <span style={{ fontSize: '10px', color: 'rgba(0, 229, 255, 0.5)', letterSpacing: '2px', fontWeight: 'bold' }}>SYSTEM_LIVE</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 1.5: SISTEM 2.0 */}
      <section className="w-full py-16 px-4 lg:px-12 flex flex-col gap-10" style={{ background: 'rgba(15, 23, 42, 0.3)' }}>
        <div className="container" style={{ margin: '0 auto' }}>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-2 border-b border-slate-800 pb-4">
            Sistem 2.0: Entegre Çizelgeleme & Frekans Analizi
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Card 1: Smart Scheduling */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-2">⏱️ Akıllı Üretim ve Bakım Çizelgelemesi</h3>
              <p className="text-slate-400 mb-6">
                Müşteri sipariş teslimatlarını ve makine kurulum sürelerini hesaba katarak, üretimi durdurmadan en optimal bakım penceresini otonom olarak hesaplar.
              </p>
              {/* Mock UI: Horizontal Timeline */}
              <div className="flex items-center gap-2 overflow-hidden text-sm font-semibold rounded-lg mt-4">
                <div className="bg-slate-800 text-slate-300 px-4 py-3 flex-1 text-center border-r border-slate-700 whitespace-nowrap">
                  [Sipariş A]
                </div>
                <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-4 py-3 flex-[1.5] text-center shadow-[0_0_15px_rgba(16,185,129,0.2)] whitespace-nowrap">
                  🟢 OPTİMAL BAKIM (RUL: 45)
                </div>
                <div className="bg-slate-800 text-slate-300 px-4 py-3 flex-1 text-center border-l border-slate-700 whitespace-nowrap">
                  [Sipariş B]
                </div>
              </div>
            </div>

            {/* Card 2: Vibration Spectrum */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-2">📊 Gerçek Zamanlı Zarf Spektrumu</h3>
              <p className="text-slate-400 mb-6">
                Makine gürültüsünü filtreleyerek, rulman arızalarının karakteristik frekanslarını (Envelope Spectrum) tespit eder.
              </p>
              {/* Mock UI: CSS-only Equalizer */}
              <div className="flex items-end justify-between h-16 px-4 gap-1 mt-4">
                {[
                  {h: 30, d: 0.7}, {h: 45, d: 1.2}, {h: 20, d: 0.9}, {h: 80, d: 0.6}, {h: 50, d: 1.1},
                  {h: 40, d: 0.8}, {h: 90, d: 0.5}, {h: 60, d: 1.0}, {h: 30, d: 1.3}, {h: 25, d: 0.8},
                  {h: 75, d: 0.6}, {h: 45, d: 1.2}, {h: 35, d: 0.9}, {h: 55, d: 1.1}, {h: 65, d: 0.7}
                ].map((bar, i) => (
                  <div 
                    key={i}
                    className="w-2 bg-cyan-400 rounded-t-sm animate-pulse"
                    style={{ 
                      height: `${bar.h}%`,
                      animationDuration: `${bar.d}s`,
                      boxShadow: '0 0 10px rgba(34,211,238,0.5)'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
