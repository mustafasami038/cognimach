import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Zap, MessageSquare, Mail, ArrowRight, Activity, TrendingUp, ShieldAlert, Loader2 } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
          <div style={{ display: 'flex', flexDirection: 'column', lg: { flexDirection: 'row' }, alignItems: 'center', gap: '4rem' }} className="lg:flex-row flex flex-col items-center gap-16">
            <div style={{ flex: 1, textAlign: 'left' }} className="hero-text-container">
              <h1 className="hero-title gradient-text" style={{ textAlign: 'left', fontSize: '4.5rem' }}>
                Endüstrinin Nöral Ağı: CogniMach
              </h1>
              <p style={{ fontSize: '1.4rem', maxWidth: '600px', margin: '1.5rem 0', color: '#94a3b8' }}>
                Üretim hatlarınızı karanlıktan kurtarın. Çift motorlu yapay zeka ve entegre LLM asistanı ile 
                <span style={{ color: '#00e5ff', fontWeight: 600 }}> "Sıfır Duruş"</span> hedefine ulaşın.
              </p>
              
              <div className="flex gap-6 mt-8">
                <button onClick={() => navigate('/login')} className="btn" style={{ padding: '1rem 2rem', fontSize: '1.05rem' }}>
                  Sisteme Entegre Ol <ArrowRight size={20} />
                </button>
                <button 
                  onClick={handleDemoLogin} 
                  className="btn btn-secondary" 
                  style={{ padding: '1rem 2rem', fontSize: '1.05rem' }}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Canlı Demoyu İzle'}
                </button>
              </div>
            </div>

            {/* HERO ILLUSTRATION - 3D GLASSMOPRHIC DASHBOARD */}
            <div className="hero-3d-container relative hidden lg:block" style={{ flex: 1 }}>
              <div className="hero-illustration relative w-[550px] h-[400px]">
                {/* Base Glass Layer */}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xl border border-cyan-400/30 rounded-2xl shadow-2xl overflow-hidden" style={{ transform: 'translateZ(0px)' }}>
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
                    </div>
                    <div className="h-1.5 w-24 bg-white/10 rounded-full"></div>
                  </div>
                  
                  <div className="p-6 flex flex-col gap-6">
                    {/* Abstract Chart Area */}
                    <div className="h-32 w-full bg-cyan-500/5 rounded-xl border border-cyan-500/10 relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 w-full h-full p-4 flex items-end gap-1">
                        {[40, 70, 45, 90, 65, 80, 55, 75, 40, 60].map((h, i) => (
                          <div key={i} className="flex-1 bg-cyan-400/30 rounded-t-sm" style={{ height: `${h}%`, transition: 'height 1s ease' }}></div>
                        ))}
                      </div>
                      <div className="absolute inset-0 glow-element bg-cyan-500/5"></div>
                      <div className="absolute top-2 left-4 text-[10px] text-cyan-400 font-mono">LIVE_STREAM_DATA</div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 rounded-xl bg-blue-500/5 border border-blue-500/10 p-4 flex flex-col justify-between">
                        <div className="h-1 w-8 bg-blue-400/30 rounded-full"></div>
                        <div className="h-3 w-16 bg-white/10 rounded-full"></div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full"></div>
                      </div>
                      <div className="h-24 rounded-xl bg-cyan-500/5 border border-cyan-500/10 p-4 flex flex-col justify-between">
                        <div className="h-1 w-8 bg-cyan-400/30 rounded-full"></div>
                        <div className="h-3 w-20 bg-white/10 rounded-full"></div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating "Neural" Nodes & Effects */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] glow-element"></div>
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] glow-element"></div>

                {/* Floating Widget 1 */}
                <div className="absolute top-10 -right-10 p-4 bg-slate-900/60 backdrop-blur-xl border border-cyan-400/40 rounded-xl shadow-xl flex items-center gap-4" style={{ transform: 'translateZ(80px)' }}>
                  <div className="p-2 bg-cyan-400/20 rounded-lg">
                    <Activity color="#00e5ff" size={24} className="glow-element" />
                  </div>
                  <div>
                    <div className="text-[10px] text-cyan-400 font-mono">NODE_ACTIVE</div>
                    <div className="text-xs font-bold text-white">99.8% UPTIME</div>
                  </div>
                </div>

                {/* Floating Widget 2 */}
                <div className="absolute -bottom-4 right-10 p-4 bg-slate-900/60 backdrop-blur-xl border border-blue-400/40 rounded-xl shadow-xl flex items-center gap-4" style={{ transform: 'translateZ(120px)' }}>
                  <div className="p-2 bg-blue-400/20 rounded-lg">
                    <Zap color="#3b82f6" size={24} className="glow-element" />
                  </div>
                  <div>
                    <div className="text-[10px] text-blue-400 font-mono">PREDICTION_ENGINE</div>
                    <div className="text-xs font-bold text-white">READY_FOR_OEE</div>
                  </div>
                </div>

                {/* Decorative Connection Line */}
                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" style={{ transform: 'translateZ(-20px)' }}>
                  <path d="M 500 50 Q 600 200 500 350" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="1" fill="none" />
                  <circle cx="500" cy="50" r="3" fill="#00e5ff" className="glow-element" />
                  <circle cx="500" cy="350" r="3" fill="#3b82f6" className="glow-element" />
                </svg>
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
