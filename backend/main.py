from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Dict, Optional, Any, List
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from statsmodels.tsa.holtwinters import Holt
import google.generativeai as genai
import smtplib
from email.mime.text import MIMEText
import datetime
import io
import warnings

warnings.filterwarnings("ignore")

app = FastAPI(title="CogniMach API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory Database
users_db = {
    "admin": {
        "sifre": "agu2026", "rol": "admin", "sirket": "CogniMach HQ (Super Admin)",
        "api_key": "", "gnd_mail": "", "gnd_sifre": "", "alc_mail": "", "esik": 15
    },
    "demo": {
        "sifre": "1234", "rol": "client", "sirket": "Örnek Fabrika A.Ş. (Demo)",
        "api_key": "", "gnd_mail": "", "gnd_sifre": "", "alc_mail": "", "esik": 15
    }
}

# In-memory storage for uploaded data and models per tenant
tenant_data = {}
# format: tenant_data[tenant_id] = {"df": pd.DataFrame, "rf_model": RandomForestClassifier, "current_row": 35, "logs": []}

class LoginRequest(BaseModel):
    tenant_id: str
    password: str

class TenantConfig(BaseModel):
    tenant_id: str
    sifre: str
    rol: str
    sirket: str
    api_key: str = ""
    gnd_mail: str = ""
    gnd_sifre: str = ""
    alc_mail: str = ""
    esik: int = 15

@app.post("/login")
def login(req: LoginRequest):
    user = users_db.get(req.tenant_id)
    if user and user["sifre"] == req.password:
        return {"success": True, "tenant_id": req.tenant_id, "user": user}
    raise HTTPException(status_code=401, detail="Yetkisiz Erişim! Geçersiz Tenant ID veya Anahtar.")

@app.get("/admin/tenants")
def get_tenants():
    return users_db

@app.post("/admin/tenants")
def add_tenant(config: TenantConfig):
    if config.tenant_id in users_db:
        raise HTTPException(status_code=400, detail="Bu Tenant ID zaten ağda mevcut!")
    users_db[config.tenant_id] = config.dict()
    return {"success": True, "message": f"{config.sirket} ağa eklendi!"}

@app.put("/admin/tenants/{old_tenant_id}")
def update_tenant(old_tenant_id: str, config: TenantConfig):
    if old_tenant_id not in users_db:
        raise HTTPException(status_code=404, detail="Tenant bulunamadı!")
    
    if old_tenant_id != config.tenant_id:
        users_db.pop(old_tenant_id)
        
    users_db[config.tenant_id] = config.dict()
    return {"success": True, "message": "Konfigürasyon başarıyla güncellendi!"}

@app.delete("/admin/tenants/{tenant_id}")
def delete_tenant(tenant_id: str):
    if tenant_id == "admin":
        raise HTTPException(status_code=400, detail="Ana (HQ) Düğüm silinemez!")
    if tenant_id in users_db:
        del users_db[tenant_id]
        return {"success": True}
    raise HTTPException(status_code=404, detail="Tenant bulunamadı!")

def egit_rf_model(df):
    rf = RandomForestClassifier(n_estimators=50, random_state=42)
    ozellikler = ['Air temperature [K]', 'Process temperature [K]', 'Rotational speed [rpm]', 'Torque [Nm]', 'Tool wear [min]']
    # If missing columns, we can't train
    if not all(col in df.columns for col in ozellikler + ['Machine failure']):
        return None
    rf.fit(df[ozellikler], df['Machine failure'])
    return rf

@app.post("/telemetry/upload/{tenant_id}")
async def upload_telemetry(tenant_id: str, file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    
    rf_model = egit_rf_model(df)
    if not rf_model:
        raise HTTPException(status_code=400, detail="CSV dosyasında gerekli sütunlar bulunamadı.")
        
    tenant_data[tenant_id] = {
        "df": df,
        "rf_model": rf_model,
        "current_row": 35,
        "logs": [],
        "status": "bekliyor" # bekliyor, calisiyor, bakim_gerekiyor, arizali
    }
    return {"success": True, "message": "Telemetri verisi yüklendi ve model eğitildi.", "total_rows": len(df)}

@app.get("/telemetry/status/{tenant_id}")
def get_status(tenant_id: str):
    if tenant_id not in tenant_data:
        return {"status": "no_data"}
    return {"status": tenant_data[tenant_id]["status"], "current_row": tenant_data[tenant_id]["current_row"]}

@app.post("/telemetry/action/{tenant_id}")
def telemetry_action(tenant_id: str, action: str):
    if tenant_id not in tenant_data:
        raise HTTPException(status_code=404, detail="Veri bulunamadı.")
    
    data = tenant_data[tenant_id]
    if action == "start":
        data["status"] = "calisiyor"
    elif action == "fix":
        data["status"] = "calisiyor"
        # Find next safe row
        df = data["df"]
        for j in range(data["current_row"] + 1, len(df)):
            if df.iloc[j]['Tool wear [min]'] < 15:
                data["current_row"] = j
                break
        else:
            data["current_row"] = data["current_row"] + 1
            
    return {"success": True, "status": data["status"]}

def otomatik_mail_gonder(tetikleyen_ai, olay_tipi, anlik_veri, rul_gosterim, user_cfg):
    gnd_mail = user_cfg.get("gnd_mail")
    gnd_sifre = user_cfg.get("gnd_sifre")
    alc_mail = user_cfg.get("alc_mail")
    sirket_adi = user_cfg.get("sirket")
    
    if not gnd_mail or not gnd_sifre or not alc_mail:
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
        msg['From'] = gnd_mail
        msg['To'] = alc_mail
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
            smtp_server.login(gnd_mail, gnd_sifre)
            smtp_server.sendmail(gnd_mail, [alc_mail], msg.as_string())
        return "✅ Otonom iş emri başarıyla iletildi."
    except Exception as e:
        return f"❌ İletişim Hatası: {str(e)}"

@app.get("/telemetry/next/{tenant_id}")
def get_next_telemetry(tenant_id: str):
    if tenant_id not in tenant_data:
        raise HTTPException(status_code=404, detail="Veri bulunamadı.")
    
    data = tenant_data[tenant_id]
    df = data["df"]
    rf_model = data["rf_model"]
    i = data["current_row"]
    
    if i >= len(df):
        return {"end_of_data": True}
        
    user_cfg = users_db.get(tenant_id, {})
    esik = user_cfg.get("esik", 15)
    
    anlik_veri = df.iloc[i].to_dict()
    gecmis_veri = df.iloc[max(0, i-30):i+1]
    
    ozellikler = ['Air temperature [K]', 'Process temperature [K]', 'Rotational speed [rpm]', 'Torque [Nm]', 'Tool wear [min]']
    anlik_features = df.iloc[i:i+1][ozellikler]
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
        except:
            pass

    response = {
        "index": i,
        "telemetry": anlik_veri,
        "history": gecmis_veri[['Tool wear [min]']].reset_index(drop=True).to_dict(orient="list"),
        "rul_sayisal": rul_sayisal,
        "rul_gosterim": rul_gosterim,
        "rf_tahmin": int(rf_tahmin),
        "status": data["status"]
    }
    
    # Event triggers
    if int(rf_tahmin) == 1 or anlik_veri['Machine failure'] == 1:
        olay = '🚨 Anomali Şoku'
        tetikleyen = 'Random Forest Nöral Ağı'
        su_an = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = {'Tarih/Saat': su_an, 'Vardiya Dk.': i, 'Tetikleyen AI': tetikleyen, 'Olay Tipi': olay, 'Hava Sıc.': anlik_veri['Air temperature [K]'], 'Hız': anlik_veri['Rotational speed [rpm]'], 'Aşınma': anlik_veri['Tool wear [min]']}
        data["logs"].append(log_entry)
        mail_status = otomatik_mail_gonder(tetikleyen, olay, anlik_veri, "Sıfırlandı", user_cfg)
        data["status"] = "arizali"
        response["status"] = "arizali"
        response["mail_status"] = mail_status
        response["alert"] = "🚨 COGNIMACH KIRMIZI ALARM: Sistem Güvenlik Nedeniyle Kilitlendi!"
    elif 0 < rul_sayisal <= esik:
        olay = '⚠️ Kritik Degradasyon (Yaşlanma)'
        tetikleyen = 'Holt Projeksiyonu'
        su_an = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = {'Tarih/Saat': su_an, 'Vardiya Dk.': i, 'Tetikleyen AI': tetikleyen, 'Olay Tipi': olay, 'Hava Sıc.': anlik_veri['Air temperature [K]'], 'Hız': anlik_veri['Rotational speed [rpm]'], 'Aşınma': anlik_veri['Tool wear [min]']}
        data["logs"].append(log_entry)
        mail_status = otomatik_mail_gonder(tetikleyen, olay, anlik_veri, rul_gosterim, user_cfg)
        data["status"] = "bakim_gerekiyor"
        response["status"] = "bakim_gerekiyor"
        response["mail_status"] = mail_status
        response["alert"] = "⚠️ COGNIMACH SARI ALARM: Proaktif Müdahale Gerekiyor!"
    else:
        # If normal, advance row
        data["current_row"] += 1

    return response

@app.get("/telemetry/logs/{tenant_id}")
def get_logs(tenant_id: str):
    if tenant_id not in tenant_data:
        return []
    return tenant_data[tenant_id]["logs"]

class ChatRequest(BaseModel):
    prompt: str
    context_data: Optional[Dict] = None

@app.post("/ai/report/{tenant_id}")
def generate_report(tenant_id: str):
    user_cfg = users_db.get(tenant_id, {})
    api_key = user_cfg.get("api_key")
    sirket_adi = user_cfg.get("sirket")
    
    if not api_key:
        raise HTTPException(status_code=400, detail="HQ bağlantısı kurulamadı. LLM API Anahtarı eksik.")
        
    status = tenant_data.get(tenant_id, {}).get("status", "calisiyor")
    if status == 'calisiyor':
        raise HTTPException(status_code=400, detail="Sistem şu an stabil.")
        
    try:
        genai.configure(api_key=api_key)
        secilen_model = 'gemini-1.5-flash' # Using newer flash model 
        llm_model = genai.GenerativeModel(secilen_model)
        senaryo = "SARI ALARM (Degradasyon)" if status == 'bakim_gerekiyor' else "KIRMIZI ALARM (Donanım Şoku)"
        prompt = f"Şirket: {sirket_adi}. DURUM: {senaryo}. Fabrika yönetimine profesyonel, teknik kök neden ve otonom aksiyon raporu yaz."
        response = llm_model.generate_content(prompt)
        return {"report": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/chat/{tenant_id}")
def ai_chat(tenant_id: str, req: ChatRequest):
    user_cfg = users_db.get(tenant_id, {})
    api_key = user_cfg.get("api_key")
    sirket_adi = user_cfg.get("sirket")
    
    if not api_key:
        raise HTTPException(status_code=400, detail="Ağ bağlantısı eksik, yöneticiye başvurun.")
        
    try:
        genai.configure(api_key=api_key)
        secilen_model = 'gemini-1.5-flash'
        model = genai.GenerativeModel(secilen_model)
        canli_context = f"Sistem: CogniMach. Şirket: {sirket_adi}. Soru: {req.prompt}."
        response = model.generate_content(canli_context)
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
