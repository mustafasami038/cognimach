/**
 * CogniMach — HeroSection.jsx
 * Stable, crash-proof version with Background Paths + Sparkles
 */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";

// ─────────────────────────────────────────────
// 1. INDIVIDUAL ANIMATED PATH (one data-flow line)
// ─────────────────────────────────────────────
function FloatingPath({ d, delay, duration, color }) {
  return (
    <motion.path
      d={d}
      stroke={color}
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: [0, 0.35, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ─────────────────────────────────────────────
// 2. BACKGROUND PATHS LAYER
// ─────────────────────────────────────────────
const PATH_DATA = [
  "M-380 -189C-380 -189 -312 216 152 343S 619 224 626 -25",
  "M-360 -160C-360 -160 -290 245 172 372S 640 253 647  4",
  "M-340 -131C-340 -131 -268 274 194 401S 661 282 668 33",
  "M-320 -102C-320 -102 -246 303 216 430S 682 311 689 62",
  "M-300 -73C-300 -73 -224 332 238 459S 703 340 710 91",
  "M-280 -44C-280 -44 -202 361 260 488S 724 369 731 120",
  "M-260 -15C-260 -15 -180 390 282 517S 745 398 752 149",
  "M-240  14C-240  14 -158 419 304 546S 766 427 773 178",
  "M-220  43C-220  43 -136 448 326 575S 787 456 794 207",
  "M-200  72C-200  72 -114 477 348 604S 808 485 815 236",
  "M-180 101C-180 101 -92 506 370 633S 829 514 836 265",
  "M-160 130C-160 130 -70 535 392 662S 850 543 857 294",
];
const COLORS = [
  "rgba(0,229,255,0.14)",
  "rgba(100,116,139,0.10)",
  "rgba(0,229,255,0.10)",
  "rgba(52,211,153,0.08)",
];

function BackgroundPaths() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}
    >
      <svg
        viewBox="0 0 696 316"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%" }}
        fill="none"
      >
        {PATH_DATA.map((d, i) => (
          <FloatingPath
            key={i}
            d={d}
            delay={i * 0.6}
            duration={16 + (i % 4) * 4}
            color={COLORS[i % COLORS.length]}
          />
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// 3. SPARKLE PARTICLE
// ─────────────────────────────────────────────
const SPARKLE_COLORS = ["#00e5ff", "#34d399", "#a5f3fc", "#6ee7b7"];
const SPARKLE_CONFIG = [
  { x: "8%",  y: "20%", size: 14, colorIdx: 0, delay: 0.0 },
  { x: "18%", y: "55%", size: 10, colorIdx: 1, delay: 0.7 },
  { x: "28%", y: "15%", size: 16, colorIdx: 2, delay: 1.4 },
  { x: "45%", y: "10%", size: 12, colorIdx: 0, delay: 0.3 },
  { x: "55%", y: "75%", size: 10, colorIdx: 1, delay: 1.1 },
  { x: "65%", y: "25%", size: 18, colorIdx: 3, delay: 0.5 },
  { x: "75%", y: "60%", size: 12, colorIdx: 0, delay: 1.8 },
  { x: "88%", y: "35%", size: 14, colorIdx: 2, delay: 0.9 },
];

function Sparkle({ x, y, size, color, delay }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 90, 180] }}
      transition={{ duration: 1.2, delay, repeat: Infinity, repeatDelay: 2.5 + delay }}
      style={{
        position: "absolute",
        left: x, top: y,
        width: size, height: size,
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 68 68" fill="none">
        <path d="M34 0 L37 29 L68 34 L37 39 L34 68 L31 39 L0 34 L31 29 Z" fill={color} />
      </svg>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// 4. MAIN HERO SECTION
// ─────────────────────────────────────────────
export default function HeroSection({ onLoginClick, onDemoClick, loading }) {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#030712",
      }}
    >
      {/* Background Paths */}
      <BackgroundPaths />

      {/* Glow orbs */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "15%", left: "10%",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(0,229,255,0.10) 0%, transparent 70%)",
        filter: "blur(80px)", borderRadius: "50%", pointerEvents: "none", zIndex: 1,
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", bottom: "15%", right: "8%",
        width: "380px", height: "380px",
        background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)",
        filter: "blur(70px)", borderRadius: "50%", pointerEvents: "none", zIndex: 1,
      }} />

      {/* Sparkle particles */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
        {SPARKLE_CONFIG.map((s, i) => (
          <Sparkle key={i} {...s} color={SPARKLE_COLORS[s.colorIdx]} />
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{
        position: "relative", zIndex: 10,
        width: "100%", maxWidth: "860px",
        margin: "0 auto", padding: "6rem 2rem",
        display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center", gap: "1.8rem",
      }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "rgba(0,229,255,0.07)",
            border: "1px solid rgba(0,229,255,0.2)",
            borderRadius: "9999px", padding: "6px 18px",
          }}
        >
          <span style={{
            width: "7px", height: "7px", borderRadius: "50%",
            background: "#00e5ff", boxShadow: "0 0 8px #00e5ff",
            display: "inline-block",
          }} />
          <span style={{ color: "#00e5ff", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Endüstri 4.0 · Gerçek Zamanlı AI
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
            fontWeight: 900, lineHeight: 1.05,
            letterSpacing: "-2px", margin: 0,
            backgroundImage: "linear-gradient(to right, #ffffff, #cffafe, #94a3b8)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Otonom Karar<br />Destek Ağı
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
            color: "#94a3b8", lineHeight: 1.75,
            maxWidth: "620px", margin: 0,
          }}
        >
          Endüstri 4.0 için{" "}
          <span style={{ color: "#00e5ff", fontWeight: 600 }}>karanlık fabrika vizyonunu</span>{" "}
          gerçeğe dönüştüren yapay zeka mimarisi. Çift motorlu AI ile{" "}
          <span style={{ color: "#34d399", fontWeight: 600 }}>"Sıfır Duruş"</span>{" "}
          hedefine ulaşın.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}
        >
          {/* PRIMARY — glowing cyan border */}
          <motion.button
            onClick={onLoginClick}
            whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(0,229,255,0.4)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "rgba(0,229,255,0.08)",
              color: "#ffffff",
              border: "1px solid rgba(0,229,255,0.55)",
              borderRadius: "12px", padding: "0.85rem 2.2rem",
              fontSize: "1rem", fontWeight: 700, cursor: "pointer",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 16px rgba(0,229,255,0.12), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            Sisteme Entegre Ol <ArrowRight size={18} />
          </motion.button>

          {/* SECONDARY — ghost */}
          <motion.button
            onClick={onDemoClick}
            disabled={loading}
            whileHover={{ scale: 1.03, borderColor: "rgba(52,211,153,0.5)", color: "#34d399" }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.03)",
              color: "#94a3b8",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px", padding: "0.85rem 2.2rem",
              fontSize: "1rem", fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              backdropFilter: "blur(10px)",
            }}
          >
            {loading
              ? <Loader2 size={18} style={{ animation: "cogni-spin 1s linear infinite" }} />
              : "▶"}
            {loading ? "Bağlanıyor..." : "Canlı Demoyu İzle"}
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          style={{
            display: "flex", gap: "3rem", flexWrap: "wrap", justifyContent: "center",
            borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "2rem", marginTop: "0.5rem",
          }}
        >
          {[["%40", "Duruş Azalması"], ["15+", "Vardiya Öngörüsü"], ["0", "Veri Kaybı"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#00e5ff", lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade to page */}
      <div aria-hidden="true" style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "140px",
        background: "linear-gradient(to bottom, transparent, #030712)",
        zIndex: 5, pointerEvents: "none",
      }} />

      <style>{`
        @keyframes cogni-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
