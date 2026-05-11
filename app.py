import streamlit as st
import pandas as pd
import plotly.express as px
import smtplib
from email.mime.text import MIMEText
import google.generativeai as genai
import time
import datetime
from statsmodels.tsa.holtwinters import Holt
from sklearn.ensemble import RandomForestClassifier
import warnings

warnings.filterwarnings("ignore")

# Sayfa ayarı: İsim ve ikon güncellendi
st.set_page_config(page_title="CogniMach SaaS", page_icon="💠", layout="wide")

# ==========================================
# 🎨 COGNIMACH SİBER-ENDÜSTRİYEL CSS TASARIMI
# ==========================================
st.markdown("""
<style>
/* Karbon Siyahı Arka Plan */
.stApp {
    background-color: #0b0f19;
    color: #e2e8f0;
    font-family: 'Inter', sans-serif;
}

/* Sol Menü (Sidebar) Titanyum Grisi Detaylar */
[data-testid="stSidebar"] {
    background-color: #0f172a;
    border-right: 1px solid #1e293b;
}

/* Sensör Metrik Kartları (Glassmorphism & Fraktal Keskinlik) */
div[data-testid="metric-container"] {
    background-color: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid #1e293b;
    border-left: 3px solid #00e5ff; /* Neon Cyan Vurgu */
    padding: 15px 20px;
    border-radius: 4px; /* Keskin köşeler */
    box-shadow: 0 4px 15px rgba(0, 229, 255, 0.05);
    transition: transform 0.2s ease, border-color 0.2s ease;
}
div[data-testid="metric-container"]:hover {
    transform: translateY(-3px);
    border-left: 3px solid #3b82f6;
    box-shadow: 0 6px 20px rgba(0, 229, 255, 0.15);
}

/* CogniMach Gradient Butonlar */
.stButton>button {
    background: linear-gradient(135deg, #0284c7 0%, #00e5ff 100%);
    color: #0b0f19;
    border: none;
    border-radius: 4px;
    padding: 10px 24px;
    font-weight: 700;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
}
.stButton>button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 229, 255, 0.3);
    background: linear-gradient(135deg, #00e5ff 0%, #3b82f6 100%);
    color: #ffffff;
}

/* Tehlike Butonu (Kırmızı) */
button:contains("Acil") {
    background: linear-gradient(135deg, #991b1b 0%, #ef4444 100%) !important;
    color: white !important;
}

/* Çizgi Ayırıcılar */
hr {
    border-color: #1e293b;
}

/* Veri Giriş Kutuları */
.stTextInput input, .stNumberInput input, .stSelectbox select {
    background-color: #0f172a !important;
    color: #00e5ff !important;
    border: 1px solid #334155 !important;
    border-radius: 4px !important;
}
.stTextInput input:focus, .stNumberInput input:focus {
    border-color: #00e5ff !important;
    box-shadow: 0 0 0 1px #00e5ff !important;
}
</style>
""", unsafe_allow_html=True)


# ==========================================
# SANAL VERİ TABANI (MULTI-TENANT DB) VE AYARLAR
# ==========================================
if 'page' not in st.session_state:
    st.session_state.page = 'landing'

if 'users_db' not in st.session_state:
    st.session_state.users_db = {
        "admin": {
            "sifre": "agu2026", "rol": "admin", "sirket": "CogniMach HQ (Super Admin)",
            "api_key": "", "gnd_mail": "", "gnd_sifre": "", "alc_mail": "", "esik": 15
        },
        "demo": {
            "sifre": "1234", "rol": "client", "sirket": "Örnek Fabrika A.Ş. (Demo)",
            "api_key": "", "gnd_mail": "", "gnd_sifre": "", "alc_mail": "", "esik": 15
        }
    }

if 'aktif_kullanici' not in st.session_state:
    st.session_state.aktif_kullanici = None

def sayfaya_git(sayfa_adi):
    st.session_state.page = sayfa_adi

# ==========================================
# 1. AŞAMA: VİZYONER ANA SAYFA (LANDING PAGE)
# ==========================================
if st.session_state.page == 'landing':
    st.markdown("<br><br><h1 style='text-align: center; font-size: 5.5rem; color: #00e5ff; text-shadow: 0 0 25px rgba(0, 229, 255, 0.4); letter-spacing: -2px;'>💠 CogniMach</h1>", unsafe_allow_html=True)
    st.markdown("<h3 style='text-align: center; color: #94a3b8; font-weight: 300;'>Endüstriyel Makinelerin Dijital Zekası</h3><br><br>", unsafe_allow_html=True)
    
    col_hero1, col_hero2, col_hero3 = st.columns([1, 2, 1])
    with col_hero2:
        st.markdown("<div style='background-color: rgba(15, 23, 42, 0.8); padding: 25px; border-radius: 4px; border-left: 3px solid #00e5ff; text-align: center; color: #cbd5e1; font-size: 1.1rem;'>Üretim hatlarındaki karanlık noktaları aydınlatın. Kestirimci bakım mimarimiz ve yapay zeka asistanımızla <b>sıfır duruş</b> hedefine ulaşın.</div><br>", unsafe_allow_html=True)
        if st.button("🚀 CogniMach Ağına Giriş Yap", use_container_width=True):
            sayfaya_git('login')
            st.rerun()

    st.divider()
    st.markdown("<h2 style='text-align: center; color: #e2e8f0; font-weight: 600;'>Değer Önerilerimiz</h2><br>", unsafe_allow_html=True)
    col_feat1, col_feat2, col_feat3 = st.columns(3)
    
    with col_feat1:
        st.markdown("<div style='background-color: #0f172a; padding: 20px; border-radius: 4px; height: 100%; border-top: 3px solid #ef4444; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);'><h3>⚡ Şok Tespiti</h3><p style='color: #94a3b8;'>Random Forest algoritması ile milisaniyelik tork ve sıcaklık anomalilerini avlar. Hasar oluşmadan hattı durdurur.</p></div>", unsafe_allow_html=True)
    
    with col_feat2:
        st.markdown("<div style='background-color: #0f172a; padding: 20px; border-radius: 4px; height: 100%; border-top: 3px solid #f59e0b; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);'><h3>📈 RUL Projeksiyonu</h3><p style='color: #94a3b8;'>Holt Zaman Serisi analizi ile takımların aşınma trendini okur, size kalan net vardiya ömrünü raporlar.</p></div>", unsafe_allow_html=True)
        
    with col_feat3:
        st.markdown("<div style='background-color: #0f172a; padding: 20px; border-radius: 4px; height: 100%; border-top: 3px solid #00e5ff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);'><h3>🧠 Nöral Asistan</h3><p style='color: #94a3b8;'>Duruş anındaki canlı makine verilerini okuyan entegre LLM asistanı ile mühendis gibi sohbet edin.</p></div>", unsafe_allow_html=True)

    st.divider()
    st.markdown("<h3 style='text-align: center; color: #64748b; font-weight: 400;'>Güvenilir Partner Ağı</h3><br>", unsafe_allow_html=True)
    col_ref1, col_ref2, col_ref3, col_ref4 = st.columns(4)
    col_ref1.markdown("<div style='text-align: center; color: #94a3b8; font-weight: bold;'>AGÜ TTO</div>", unsafe_allow_html=True)
    col_ref2.markdown("<div style='text-align: center; color: #94a3b8; font-weight: bold;'>Kapadokya YZ Zirvesi</div>", unsafe_allow_html=True)
    col_ref3.markdown("<div style='text-align: center; color: #94a3b8; font-weight: bold;'>KAYSO</div>", unsafe_allow_html=True)
    col_ref4.markdown("<div style='text-align: center; color: #94a3b8; font-weight: bold;'>Akıllı Üretim Kons.</div>", unsafe_allow_html=True)

# ==========================================
# 2. AŞAMA: SİBER GÜVENLİK DUVARI (LOGIN)
# ==========================================
elif st.session_state.page == 'login':
    st.markdown("<br><br><br><h1 style='text-align: center; color: #00e5ff;'>💠 Kimlik Doğrulama</h1>", unsafe_allow_html=True)
    st.markdown("<p style='text-align: center; color: #94a3b8;'>CogniMach SCADA sistemine erişmek için şifrenizi giriniz.</p><br>", unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns([1, 1.5, 1])
    with col2:
        with st.form("login_form"):
            kullanici = st.text_input("Tenant ID (Şirket Kodu)")
            sifre = st.text_input("Erişim Anahtarı", type="password")
            st.markdown("<br>", unsafe_allow_html=True)
            submit_button = st.form_submit_button("Sisteme Bağlan", use_container_width=True)
            
            if submit_button:
                if kullanici in st.session_state.users_db and st.session_state.users_db[kullanici]["sifre"] == sifre:
                    st.session_state.aktif_kullanici = kullanici
                    rol = st.session_state.users_db[kullanici]["rol"]
                    st.success(f"Bağlantı Kuruldu: {st.session_state.users_db[kullanici]['sirket']}")
                    time.sleep(1)
                    if rol == 'admin':
                        sayfaya_git('admin_panel')
                    else:
                        sayfaya_git('dashboard')
                    st.rerun()
                else:
                    st.error("❌ Yetkisiz Erişim! Geçersiz Tenant ID veya Anahtar.")
        
        st.markdown("<br>", unsafe_allow_html=True)
        if st.button("⬅️ Ağa Geri Dön", use_container_width=True):
            sayfaya_git('landing')
            st.rerun()

# ==========================================
# YENİ AŞAMA 2.5: SÜPER YÖNETİCİ (ADMIN) PANELİ
# ==========================================
elif st.session_state.page == 'admin_panel':
    st.markdown("<h1 style='color: #00e5ff;'>💠 CogniMach Kontrol Paneli</h1>", unsafe_allow_html=True)
    
    tab_list, tab_add, tab_edit = st.tabs(["📋 Tenant Listesi", "➕ Yeni Tenant Oluştur", "⚙️ Nöral Ayarlar"])
    
    with tab_list:
        st.subheader("Aktif Düğümler (Kayıtlı Fabrikalar)")
        gosterilecek_veri = []
        for k, v in st.session_state.users_db.items():
            gosterilecek_veri.append({"Tenant ID": k, "Şirket Adı": v["sirket"], "Yetki": v["rol"], "API Status": "Aktif" if v["api_key"] else "Pasif", "RUL Threshold": v["esik"]})
        st.dataframe(pd.DataFrame(gosterilecek_veri), use_container_width=True)

    with tab_add:
        st.subheader("Ağa Yeni Şirket Ekle")
        with st.form("add_user_form"):
            col_add1, col_add2 = st.columns(2)
            yeni_kullanici = col_add1.text_input("Tenant ID (Örn: kayseridemir)")
            yeni_sirket = col_add1.text_input("Kurum Adı (Örn: Kayseri Demir A.Ş.)")
            yeni_sifre = col_add2.text_input("Erişim Anahtarı", type="password")
            yeni_rol = col_add2.selectbox("Yetki Seviyesi", ["client", "admin"])
            st.markdown("<br>", unsafe_allow_html=True)
            if st.form_submit_button("💾 Tenant Kaydını Tamamla"):
                if yeni_kullanici and yeni_sifre and yeni_sirket:
                    if yeni_kullanici in st.session_state.users_db:
                        st.error("Bu Tenant ID zaten ağda mevcut!")
                    else:
                        st.session_state.users_db[yeni_kullanici] = {
                            "sifre": yeni_sifre, "rol": yeni_rol, "sirket": yeni_sirket,
                            "api_key": "", "gnd_mail": "", "gnd_sifre": "", "alc_mail": "", "esik": 15
                        }
                        st.success(f"✅ {yeni_sirket} ağa eklendi!")
                        time.sleep(1)
                        st.rerun()
                else:
                    st.warning("Lütfen tüm zorunlu alanları doldurun.")

    with tab_edit:
        st.subheader("Tenant Konfigürasyonu")
        secilen_kullanici = st.selectbox("Hedef Tenant Seçin", list(st.session_state.users_db.keys()))
        
        if secilen_kullanici:
            aktif_veri = st.session_state.users_db[secilen_kullanici]
            with st.form("edit_user_form"):
                st.markdown("<h4 style='color: #00e5ff;'>1. Temel Düğüm Bilgileri</h4>", unsafe_allow_html=True)
                col_ed1, col_ed2 = st.columns(2)
                y_kullanici = col_ed1.text_input("Tenant ID", value=secilen_kullanici)
                y_sirket = col_ed1.text_input("Kurum Adı", value=aktif_veri["sirket"])
                y_sifre = col_ed2.text_input("Erişim Anahtarı", value=aktif_veri["sifre"])
                y_esik = col_ed2.number_input("Holt RUL Eşiği", value=aktif_veri["esik"])
                
                st.divider()
                st.markdown("<h4 style='color: #00e5ff;'>2. Nöral Entegrasyon & Otomasyon</h4>", unsafe_allow_html=True)
                y_api_key = st.text_input("LLM API Anahtarı (Gemini)", value=aktif_veri["api_key"], type="password")
                
                col_mail1, col_mail2 = st.columns(2)
                y_gnd_mail = col_mail1.text_input("Sistem Mail Göndericisi", value=aktif_veri["gnd_mail"])
                y_gnd_sifre = col_mail1.text_input("SMTP Şifresi", value=aktif_veri["gnd_sifre"], type="password")
                y_alc_mail = col_mail2.text_input("Alıcı (Bakım Yöneticisi)", value=aktif_veri["alc_mail"])
                
                st.markdown("<br>", unsafe_allow_html=True)
                guncelle_btn = st.form_submit_button("🔄 Konfigürasyonu Ağa Yaz")

            st.markdown("<br>", unsafe_allow_html=True)
            sil_btn = st.button("🗑️ Tenant'ı Ağdan Sil")

            if guncelle_btn:
                if y_kullanici != secilen_kullanici:
                    st.session_state.users_db[y_kullanici] = st.session_state.users_db.pop(secilen_kullanici)
                    hedef_id = y_kullanici
                else:
                    hedef_id = secilen_kullanici
                
                st.session_state.users_db[hedef_id].update({
                    "sirket": y_sirket, "sifre": y_sifre, "esik": y_esik,
                    "api_key": y_api_key, "gnd_mail": y_gnd_mail, 
                    "gnd_sifre": y_gnd_sifre, "alc_mail": y_alc_mail
                })
                st.success("✅ Konfigürasyon başarıyla güncellendi!")
                time.sleep(1)
                st.rerun()

            if sil_btn:
                if secilen_kullanici == "admin":
                    st.error("Ana (HQ) Düğüm silinemez!")
                else:
                    del st.session_state.users_db[secilen_kullanici]
                    st.warning(f"🚨 Düğüm bağlantısı kesildi!")
                    time.sleep(1)
                    st.rerun()

    st.divider()
    if st.button("🚪 Ağı Terk Et (Çıkış)", use_container_width=True):
        st.session_state.aktif_kullanici = None
        sayfaya_git('landing')
        st.rerun()

# ==========================================
# 3. AŞAMA: MÜŞTERİ (FABRİKA) KOMUTA MERKEZİ
# ==========================================
elif st.session_state.page == 'dashboard':
    
    aktif_user = st.session_state.aktif_kullanici
    user_cfg = st.session_state.users_db[aktif_user]
    sirket_adi = user_cfg["sirket"]
    api_key = user_cfg["api_key"]
    erken_uyari_esigi = user_cfg["esik"]
    gnd_mail = user_cfg["gnd_mail"]
    gnd_sifre = user_cfg["gnd_sifre"]
    alc_mail = user_cfg["alc_mail"]
    
    if 'makine_durumu' not in st.session_state:
        st.session_state.makine_durumu = 'bekliyor' 
    if 'kacinci_satir' not in st.session_state:
        st.session_state.kacinci_satir = 35 
    if 'son_rul_degeri' not in st.session_state:
        st.session_state.son_rul_degeri = "Veri Bekleniyor..."
    if 'son_mail_durumu' not in st.session_state:
        st.session_state.son_mail_durumu = "Ağ iletişimi beklemede."
    if 'hata_loglari' not in st.session_state:
        st.session_state.hata_loglari = pd.DataFrame(columns=['Tarih/Saat', 'Vardiya Dk.', 'Tetikleyen AI', 'Olay Tipi', 'Hava Sıc.', 'Hız', 'Aşınma'])
    if 'messages' not in st.session_state:
        st.session_state.messages = []

    def sonraki_saglam_veriyi_bul(mevcut_index, veri_seti):
        for j in range(mevcut_index + 1, len(veri_seti)):
            if veri_seti.iloc[j]['Tool wear [min]'] < 15: 
                return j
        return mevcut_index + 1 

    @st.cache_resource
    def rf_modelini_egit(veri):
        rf = RandomForestClassifier(n_estimators=50, random_state=42)
        ozellikler = ['Air temperature [K]', 'Process temperature [K]', 'Rotational speed [rpm]', 'Torque [Nm]', 'Tool wear [min]']
        rf.fit(veri[ozellikler], veri['Machine failure'])
        return rf

    def otomatik_mail_gonder(tetikleyen_ai, olay_tipi, anlik_veri, rul_gosterim, gonderici, sifre, alici):
        if not gonderici or not sifre or not alici:
            return "Konfigürasyon eksik: Yönetici ile iletişime geçin."
        try:
            saat = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            if "Holt" in tetikleyen_ai:
                konu = f"⚠️ COGNIMACH SARI ALARM ({sirket_adi}): RUL Kritik Eşikte!"
                aksiyon = "Sistem kalan ömrün kritik eşiğin altına düştüğünü saptadı. Proaktif müdahale gerekiyor."
            else:
                konu = f"🚨 COGNIMACH KIRMIZI ALARM ({sirket_adi}): Anomali Şoku!"
                aksiyon = "Sistem ani bir mekanik anomali tespit etti ve makineyi güvenli duruma aldı."

            mesaj_metni = f"COGNIMACH OTONOM BİLDİRİMİ\nTenant: {sirket_adi}\nTarih: {saat}\nModel: {tetikleyen_ai}\n\n[ TELEMETRİ VERİSİ ]\nHava Sıc: {anlik_veri['Air temperature [K]']:.1f} K\nHız: {anlik_veri['Rotational speed [rpm]']} RPM\nAşınma: {anlik_veri['Tool wear [min]']} Dk\n\n[ SİSTEM ÖNERİSİ ]\n{aksiyon}"
            msg = MIMEText(mesaj_metni)
            msg['Subject'] = konu
            msg['From'] = gonderici
            msg['To'] = alici
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
                smtp_server.login(gonderici, sifre)
                smtp_server.sendmail(gonderici, [alici], msg.as_string())
            return f"✅ Otonom iş emri başarıyla iletildi."
        except Exception as e:
            return f"❌ İletişim Hatası: {str(e)}"

    st.markdown(f"<h1 style='color: #00e5ff;'>💠 {sirket_adi} Merkezi Paneli</h1>", unsafe_allow_html=True)
    st.markdown(f"<p style='color: #94a3b8;'>CogniMach Otonom Karar Destek Ağı (Threshold: {erken_uyari_esigi} Vardiya)</p>", unsafe_allow_html=True)

    with st.sidebar:
        st.markdown("<h3 style='color: #00e5ff;'>📂 Veri Akışı</h3>", unsafe_allow_html=True)
        uploaded_file = st.file_uploader("Telemetri Verisi (CSV)", type=["csv"])
        
        st.divider()
        st.markdown("""
        <div style='background-color: #0f172a; padding: 15px; border-radius: 4px; border-left: 3px solid #00e5ff;'>
        <small style='color: #cbd5e1;'>💡 Nöral ağ ve otomasyon ayarlarınız CogniMach HQ tarafından güvenle yapılandırılmıştır.</small>
        </div>
        """, unsafe_allow_html=True)
        
        st.divider()
        if st.button("🚪 Sistemden Çıkış", use_container_width=True):
            st.session_state.aktif_kullanici = None
            sayfaya_git('landing')
            st.rerun()

    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        "📊 Canlı İzleme", "🧠 Nöral Analiz", "🚀 Otonom Aksiyon", "📜 Telemetri Logu", "💬 Cogni Asistan"
    ])

    if uploaded_file is not None:
        df = pd.read_csv(uploaded_file)
        rf_model = rf_modelini_egit(df) 
        
        with tab1:
            col_btn1, col_btn2 = st.columns(2)
            with col_btn1:
                if st.button("▶️ Sistemi Aktifleştir", use_container_width=True):
                    st.session_state.makine_durumu = 'calisiyor'
                    st.rerun() 
                    
            with col_btn2:
                if st.session_state.makine_durumu == 'bakim_gerekiyor':
                    if st.button("🛠️ Planlı Bakımı Onayla (Parçayı Değiştir)", use_container_width=True):
                        st.success("✅ Müdahale Başarılı!")
                        time.sleep(1.5) 
                        st.session_state.makine_durumu = 'calisiyor'
                        st.session_state.kacinci_satir = sonraki_saglam_veriyi_bul(st.session_state.kacinci_satir, df)
                        st.rerun()
                elif st.session_state.makine_durumu == 'arizali':
                    if st.button("🚨 Hasarı Onar ve Sistemi Yeniden Başlat", use_container_width=True):
                        st.success("✅ Sistem Yeniden Devrede!")
                        time.sleep(1.5) 
                        st.session_state.makine_durumu = 'calisiyor'
                        st.session_state.kacinci_satir = sonraki_saglam_veriyi_bul(st.session_state.kacinci_satir, df)
                        st.rerun()

            st.divider()

            if st.session_state.makine_durumu == 'calisiyor':
                canli_ekran = st.empty()
                
                for i in range(st.session_state.kacinci_satir, len(df)):
                    anlik_veri = df.iloc[i]
                    gecmis_veri = df.iloc[max(0, i-30):i+1] 
                    
                    ozellikler = ['Air temperature [K]', 'Process temperature [K]', 'Rotational speed [rpm]', 'Torque [Nm]', 'Tool wear [min]']
                    anlik_features = anlik_veri[ozellikler].to_frame().T
                    rf_tahmin = rf_model.predict(anlik_features)[0]
                    
                    rul_gosterim = "İşleniyor..."
                    rul_sayisal = 999 
                    if len(gecmis_veri) > 5: 
                        try:
                            y_train = gecmis_veri['Tool wear [min]'].values
                            holt_model = Holt(y_train, initialization_method="estimated").fit(optimized=True)
                            gelecek_tahmin = holt_model.forecast(50) 
                            rul = 0
                            for f in gelecek_tahmin:
                                if f >= 200: break
                                rul += 1
                            rul_sayisal = rul
                            rul_gosterim = f"{rul} Vardiya" if rul < 50 else "50+ (Güvenli)"
                            st.session_state.son_rul_degeri = rul_gosterim 
                        except:
                            pass

                    with canli_ekran.container():
                        st.markdown("<h4 style='color: #e2e8f0;'>⏱️ Canlı Telemetri Okuması (Dk: " + str(i) + ")</h4>", unsafe_allow_html=True)
                        col1, col2, col3, col4, col5 = st.columns(5)
                        col1.metric("🌡️ Hava Sıc.", f"{anlik_veri['Air temperature [K]']:.1f} K")
                        col2.metric("🔥 Süreç Sıc.", f"{anlik_veri['Process temperature [K]']:.1f} K")
                        col3.metric("⚙️ RPM", f"{anlik_veri['Rotational speed [rpm]']}")
                        col4.metric("🛠️ Aşınma", f"{anlik_veri['Tool wear [min]']} Dk")
                        
                        if rul_sayisal <= erken_uyari_esigi:
                            col5.metric("⏳ RUL Trendi", rul_gosterim, delta="⚠️ SARI ALARM", delta_color="inverse")
                        else:
                            col5.metric("⏳ RUL Trendi", rul_gosterim, delta="Stabil", delta_color="normal")
                        
                        st.markdown("<br>", unsafe_allow_html=True)
                        fig = px.line(gecmis_veri, y='Tool wear [min]', title="Degradasyon Eğrisi", markers=True)
                        fig.update_layout(plot_bgcolor='#0b0f19', paper_bgcolor='#0b0f19', font_color='#e2e8f0', margin=dict(l=20, r=20, t=40, b=20))
                        fig.update_traces(line_color='#00e5ff') 
                        st.plotly_chart(fig, use_container_width=True)
                    
                    if rf_tahmin == 1 or anlik_veri['Machine failure'] == 1:
                        olay = '🚨 Anomali Şoku'
                        tetikleyen = 'Random Forest Nöral Ağı'
                        su_an = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        yeni_log = pd.DataFrame([{'Tarih/Saat': su_an, 'Vardiya Dk.': i, 'Tetikleyen AI': tetikleyen, 'Olay Tipi': olay, 'Hava Sıc.': anlik_veri['Air temperature [K]'], 'Hız': anlik_veri['Rotational speed [rpm]'], 'Aşınma': anlik_veri['Tool wear [min]']}])
                        st.session_state.hata_loglari = pd.concat([st.session_state.hata_loglari, yeni_log], ignore_index=True)
                        st.session_state.son_mail_durumu = otomatik_mail_gonder(tetikleyen, olay, anlik_veri, "Sıfırlandı", gnd_mail, gnd_sifre, alc_mail)
                        st.session_state.makine_durumu = 'arizali'
                        st.session_state.kacinci_satir = i 
                        canli_ekran.empty() 
                        st.rerun() 
                    
                    elif 0 < rul_sayisal <= erken_uyari_esigi:
                        olay = '⚠️ Kritik Degradasyon (Yaşlanma)'
                        tetikleyen = 'Holt Projeksiyonu'
                        su_an = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        yeni_log = pd.DataFrame([{'Tarih/Saat': su_an, 'Vardiya Dk.': i, 'Tetikleyen AI': tetikleyen, 'Olay Tipi': olay, 'Hava Sıc.': anlik_veri['Air temperature [K]'], 'Hız': anlik_veri['Rotational speed [rpm]'], 'Aşınma': anlik_veri['Tool wear [min]']}])
                        st.session_state.hata_loglari = pd.concat([st.session_state.hata_loglari, yeni_log], ignore_index=True)
                        st.session_state.son_mail_durumu = otomatik_mail_gonder(tetikleyen, olay, anlik_veri, rul_gosterim, gnd_mail, gnd_sifre, alc_mail)
                        st.session_state.makine_durumu = 'bakim_gerekiyor'
                        st.session_state.kacinci_satir = i 
                        canli_ekran.empty() 
                        st.rerun()
                    
                    time.sleep(0.5)

            elif st.session_state.makine_durumu == 'bakim_gerekiyor':
                i = st.session_state.kacinci_satir
                anlik_veri = df.iloc[i]
                st.warning("⚠️ COGNIMACH SARI ALARM: Proaktif Müdahale Gerekiyor!")
                col1, col2, col3 = st.columns(3)
                col1.metric("🛠️ Aşınma Seviyesi", f"{anlik_veri['Tool wear [min]']} Dk", delta="Kritik", delta_color="inverse")
                col2.metric("⏳ RUL (Kalan Ömür)", st.session_state.son_rul_degeri, delta="Tükendi", delta_color="inverse")

            elif st.session_state.makine_durumu == 'arizali':
                i = st.session_state.kacinci_satir
                anlik_veri = df.iloc[i]
                st.error("🚨 COGNIMACH KIRMIZI ALARM: Sistem Güvenlik Nedeniyle Kilitlendi!")
                col1, col2, col3 = st.columns(3)
                col1.metric("🌡️ Hava Sıc.", f"{anlik_veri['Air temperature [K]']:.1f} K", delta="Anomali", delta_color="inverse")
                col2.metric("⚙️ RPM Şoku", f"{anlik_veri['Rotational speed [rpm]']} RPM", delta="Anomali", delta_color="inverse")

        with tab2:
            st.subheader(f"🧠 Kök Neden Çözümlemesi")
            if st.button("Nöral Raporu Başlat", use_container_width=True):
                if not api_key:
                    st.error("HQ bağlantısı kurulamadı. LLM API Anahtarı eksik.")
                elif st.session_state.makine_durumu == 'calisiyor':
                    st.warning("Sistem şu an stabil.")
                else:
                    with st.spinner("Bilişsel motor devrede..."):
                        try:
                            genai.configure(api_key=api_key)
                            secilen_model = 'gemini-pro' 
                            for m in genai.list_models():
                                if 'generateContent' in m.supported_generation_methods and 'flash' in m.name:
                                    secilen_model = m.name
                                    break
                            llm_model = genai.GenerativeModel(secilen_model)
                            senaryo = "SARI ALARM (Degradasyon)" if st.session_state.makine_durumu == 'bakim_gerekiyor' else "KIRMIZI ALARM (Donanım Şoku)"
                            prompt = f"Şirket: {sirket_adi}. DURUM: {senaryo}. Fabrika yönetimine profesyonel, teknik kök neden ve otonom aksiyon raporu yaz."
                            response = llm_model.generate_content(prompt)
                            st.success(f"📝 Rapor Tamamlandı")
                            st.markdown(response.text)
                        except Exception as e:
                            st.error(f"Bağlantı Hatası: {e}")

        with tab3:
            st.subheader("🚀 Otomasyon Logları")
            st.info(st.session_state.son_mail_durumu)

        with tab4:
            st.subheader("📜 Arıza ve Uyarı Kayıtları")
            st.dataframe(st.session_state.hata_loglari, use_container_width=True)

        with tab5:
            st.subheader("💬 Cogni Asistan")
            if st.session_state.makine_durumu == 'calisiyor':
                st.warning("⚠️ Makine stabilken Cogni Asistan izleme modundadır.")
            else:
                chat_container = st.container(height=450, border=True)
                for message in st.session_state.messages:
                    with chat_container.chat_message(message["role"]):
                        st.markdown(message["content"])
                        
                if prompt := st.chat_input("Duruş sebebi veya teknik destek talebini ilet..."):
                    st.session_state.messages.append({"role": "user", "content": prompt})
                    with chat_container.chat_message("user"):
                        st.markdown(prompt)
                        
                    if not api_key:
                        st.session_state.messages.append({"role": "assistant", "content": "Ağ bağlantısı eksik, yöneticiye başvurun."})
                        st.rerun()
                    else:
                        with st.spinner("Cogni düşünüyor..."):
                            try:
                                genai.configure(api_key=api_key)
                                secilen_model = 'gemini-pro' 
                                for m in genai.list_models():
                                    if 'generateContent' in m.supported_generation_methods and 'flash' in m.name:
                                        secilen_model = m.name
                                        break
                                model = genai.GenerativeModel(secilen_model)
                                d = df.iloc[st.session_state.kacinci_satir] 
                                canli_context = f"Sistem: CogniMach. Şirket: {sirket_adi}. Soru: {prompt}."
                                response = model.generate_content(canli_context)
                                st.session_state.messages.append({"role": "assistant", "content": response.text})
                                st.rerun()
                            except Exception as e:
                                st.error(f"Sistem Hatası: {e}")
    else:
        st.info("👈 Telemetri akışını başlatmak için lütfen sol menüden CSV verisini yükleyin.")