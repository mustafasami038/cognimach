import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, Zap, TrendingUp, BrainCircuit } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '5rem' }}>
      <div className="text-center mb-8">
        <Hexagon color="#00e5ff" size={80} style={{ margin: '0 auto', filter: 'drop-shadow(0 0 15px rgba(0, 229, 255, 0.5))' }} />
        <h1 className="hero-title mt-4">CogniMach</h1>
        <h3 style={{ color: '#94a3b8', fontWeight: 300, fontSize: '1.5rem', marginTop: '1rem' }}>
          Endüstriyel Makinelerin Dijital Zekası
        </h3>
      </div>

      <div className="flex justify-center mb-8">
        <div className="glass-panel highlight-cyan" style={{ maxWidth: '800px', textAlign: 'center', fontSize: '1.2rem', color: '#cbd5e1' }}>
          Üretim hatlarındaki karanlık noktaları aydınlatın. Kestirimci bakım mimarimiz ve yapay zeka asistanımızla <b>sıfır duruş</b> hedefine ulaşın.
        </div>
      </div>

      <div className="flex justify-center mb-8 mt-8">
        <button className="btn" style={{ fontSize: '1.25rem', padding: '1rem 3rem' }} onClick={() => navigate('/login')}>
          <Zap /> CogniMach Ağına Giriş Yap
        </button>
      </div>

      <div className="mb-8" style={{ marginTop: '5rem' }}>
        <h2 className="text-center" style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '2rem', marginBottom: '3rem' }}>Değer Önerilerimiz</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="glass-panel highlight-red">
            <div className="flex items-center gap-2 mb-4">
              <Zap color="#ef4444" size={28} />
              <h3 style={{ marginBottom: 0 }}>Şok Tespiti</h3>
            </div>
            <p>Random Forest algoritması ile milisaniyelik tork ve sıcaklık anomalilerini avlar. Hasar oluşmadan hattı durdurur.</p>
          </div>
          
          <div className="glass-panel highlight-orange">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp color="#f59e0b" size={28} />
              <h3 style={{ marginBottom: 0 }}>RUL Projeksiyonu</h3>
            </div>
            <p>Holt Zaman Serisi analizi ile takımların aşınma trendini okur, size kalan net vardiya ömrünü raporlar.</p>
          </div>

          <div className="glass-panel highlight-cyan">
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit color="#00e5ff" size={28} />
              <h3 style={{ marginBottom: 0 }}>Nöral Asistan</h3>
            </div>
            <p>Duruş anındaki canlı makine verilerini okuyan entegre LLM asistanı ile mühendis gibi sohbet edin.</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
        <h3 className="text-center" style={{ color: '#64748b', fontWeight: 400, marginBottom: '2rem' }}>Güvenilir Partner Ağı</h3>
        <div className="grid grid-cols-4 gap-4 text-center" style={{ color: '#94a3b8', fontWeight: 'bold' }}>
          <div>AGÜ TTO</div>
          <div>Kapadokya YZ Zirvesi</div>
          <div>KAYSO</div>
          <div>Akıllı Üretim Kons.</div>
        </div>
      </div>
    </div>
  );
}
