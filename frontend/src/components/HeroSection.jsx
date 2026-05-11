/**
 * CogniMach — HeroSection.jsx
 * Background Paths (21st.dev inspired) + Sparkles merged into
 * a single dark-factory Industry 4.0 hero.
 */
import React, { useId, useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";

// ─────────────────────────────────────────────
// 1. BACKGROUND PATHS
// ─────────────────────────────────────────────
function FloatingPath({ d, delay = 0, duration = 20, color = "rgba(0,229,255,0.15)" }) {
  return (
    <motion.path
      d={d}
      stroke={color}
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: [0, 0.4, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

function BackgroundPaths() {
  // 30 procedural data-flow paths across the viewport
  const paths = [
    "M-380 -189C-380 -189 -312 216 152 343S 619 224 626 -25",
    "M-373 -180C-373 -180 -305 225 159 352S 626 233 633 -16",
    "M-366 -171C-366 -171 -298 234 166 361S 633 242 640 -7",
    "M-359 -162C-359 -162 -291 243 173 370S 640 251 647  2",
    "M-352 -153C-352 -153 -284 252 180 379S 647 260 654 11",
    "M-345 -144C-345 -144 -277 261 187 388S 654 269 661 20",
    "M-338 -135C-338 -135 -270 270 194 397S 661 278 668 29",
    "M-331 -126C-331 -126 -263 279 201 406S 668 287 675 38",
    "M-324 -117C-324 -117 -256 288 208 415S 675 296 682 47",
    "M-317 -108C-317 -108 -249 297 215 424S 682 305 689 56",
    "M-310 -99C-310 -99 -242 306 222 433S 689 314 696 65",
    "M-303 -90C-303 -90 -235 315 229 442S 696 323 703 74",
    "M-296 -81C-296 -81 -228 324 236 451S 703 332 710 83",
    "M-289 -72C-289 -72 -221 333 243 460S 710 341 717 92",
    "M-282 -63C-282 -63 -214 342 250 469S 717 350 724 101",
    "M-275 -54C-275 -54 -207 351 257 478S 724 359 731 110",
    "M-268 -45C-268 -45 -200 360 264 487S 731 368 738 119",
    "M-261 -36C-261 -36 -193 369 271 496S 738 377 745 128",
    "M-254 -27C-254 -27 -186 378 278 505S 745 386 752 137",
    "M-247 -18C-247 -18 -179 387 285 514S 752 395 759 146",
    "M-240 -9C-240 -9 -172 396 292 523S 759 404 766 155",
    "M-233  0C-233  0 -165 405 299 532S 766 413 773 164",
    "M-226  9C-226  9 -158 414 306 541S 773 422 780 173",
    "M-219 18C-219 18 -151 423 313 550S 780 431 787 182",
    "M-212 27C-212 27 -144 432 320 559S 787 440 794 191",
    "M-205 36C-205 36 -137 441 327 568S 794 449 801 200",
    "M-198 45C-198 45 -130 450 334 577S 801 458 808 209",
    "M-191 54C-191 54 -123 459 341 586S 808 467 815 218",
    "M-184 63C-184 63 -116 468 348 595S 815 476 822 227",
    "M-177 72C-177 72 -109 477 355 604S 822 485 829 236",
  ];

  const cyan  = "rgba(0,229,255,0.12)";
  const slate = "rgba(100,116,139,0.10)";
  const colors = [cyan, slate, cyan, slate, cyan];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <svg
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        {paths.map((d, i) => (
          <FloatingPath
            key={i}
            d={d}
            delay={i * 0.4}
            duration={18 + (i % 5) * 3}
            color={colors[i % colors.length]}
          />
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. SPARKLES
// ─────────────────────────────────────────────
const random = (min, max) => Math.random() * (max - min) + min;

function Sparkle({ x, y, size, color, delay }) {
  return (
    <motion.div
      style={{ position: "absolute", left: x, top: y, width: size, height: size, pointerEvents: "none" }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 180] }}
      transition={{ duration: random(0.8, 1.5), delay, repeat: Infinity, repeatDelay: random(1.5, 4) }}
    >
      {/* 4-point star */}
      <svg width={size} height={size} viewBox="0 0 68 68" fill="none">
        <path
          d="M34 0 L37 29 L68 34 L37 39 L34 68 L31 39 L0 34 L31 29 Z"
          fill={color}
        />
      </svg>
    </motion.div>
  );
}

function Sparkles({ children, colors = ["#00e5ff", "#34d399", "#a5f3fc"] }) {
  const [sparks, setSparks] = useState([]);
  const containerRef = useRef(null);

  const generateSparks = useCallback((n = 18) => {
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setSparks(
      Array.from({ length: n }, (_, i) => ({
        id: i,
        x: random(0, width),
        y: random(0, height),
        size: random(8, 20),
        color: colors[Math.floor(random(0, colors.length))],
        delay: random(0, 3),
      }))
    );
  }, [colors]);

  useEffect(() => {
    generateSparks();
    const ro = new ResizeObserver(() => generateSparks());
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [generateSparks]);

  return (
    <div ref={containerRef} style={{ position: "relative", display: "inline-block" }}>
      {sparks.map((s) => (
        <Sparkle key={s.id} {...s} />
      ))}
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// 3. HERO SECTION — assembled
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
      {/* ── Background Paths ── */}
      <BackgroundPaths />

      {/* ── Glowing orbs ── */}
      <div style={{
        position: "absolute", top: "20%", left: "15%",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(0,229,255,0.10) 0%, transparent 70%)",
        filter: "blur(90px)", borderRadius: "50%", pointerEvents: "none", zIndex: 1,
      }} />
      <div style={{
        position: "absolute", bottom: "20%", right: "10%",
        width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)",
        filter: "blur(80px)", borderRadius: "50%", pointerEvents: "none", zIndex: 1,
      }} />

      {/* ── Content ── */}
      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: "900px", margin: "0 auto",
        padding: "6rem 2rem",
        display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center",
        gap: "2rem",
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
            display: "inline-block", animation: "pulse-glow 2s infinite",
          }} />
          <span style={{ color: "#00e5ff", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Endüstri 4.0 · Gerçek Zamanlı AI
          </span>
        </motion.div>

        {/* Headline with Sparkles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Sparkles colors={["#00e5ff", "#34d399", "#a5f3fc", "#6ee7b7"]}>
            <h1 style={{
              fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              backgroundImage: "linear-gradient(to right, #ffffff, #cffafe, #94a3b8)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              margin: 0,
              padding: "0.2em 0.4em",
            }}>
              Otonom Karar<br />Destek Ağı
            </h1>
          </Sparkles>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            color: "#94a3b8",
            lineHeight: 1.75,
            maxWidth: "620px",
            margin: 0,
          }}
        >
          Endüstri 4.0 için <span style={{ color: "#00e5ff", fontWeight: 600 }}>karanlık fabrika vizyonunu</span> gerçeğe dönüştüren yapay zeka mimarisi.
          Çift motorlu AI ve Gemini LLM ile üretim hatlarınızda{" "}
          <span style={{ color: "#34d399", fontWeight: 600 }}>"Sıfır Duruş"</span> hedefine ulaşın.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}
        >
          {/* PRIMARY — Border-Beam glassmorphic */}
          <motion.button
            onClick={onLoginClick}
            whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(0,229,255,0.35)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "rgba(0,229,255,0.08)",
              color: "#ffffff",
              border: "1px solid rgba(0,229,255,0.5)",
              borderRadius: "12px",
              padding: "0.9rem 2.4rem",
              fontSize: "1rem", fontWeight: 700,
              cursor: "pointer",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              transition: "border-color 0.3s",
              boxShadow: "0 0 15px rgba(0,229,255,0.12), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            Sisteme Entegre Ol <ArrowRight size={18} />
          </motion.button>

          {/* SECONDARY — Ghost */}
          <motion.button
            onClick={onDemoClick}
            disabled={loading}
            whileHover={{ scale: 1.03, borderColor: "rgba(52,211,153,0.5)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.03)",
              color: "#94a3b8",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "0.9rem 2.2rem",
              fontSize: "1rem", fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            {loading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : "▶"}
            {loading ? "Bağlanıyor..." : "Canlı Demoyu İzle"}
          </motion.button>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          style={{
            display: "flex", gap: "3rem", marginTop: "1rem", flexWrap: "wrap", justifyContent: "center",
            borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "2rem",
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

      {/* Bottom fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "140px",
        background: "linear-gradient(to bottom, transparent, #030712)",
        zIndex: 5, pointerEvents: "none",
      }} />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
