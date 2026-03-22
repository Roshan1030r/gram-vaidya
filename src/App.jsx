import { useState, useEffect, useRef, useCallback } from 'react'

/* ── Fonts & Global Styles ── */
const injectStyles = () => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap'
  document.head.appendChild(link)

  const style = document.createElement('style')
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #07090f; color: #e4e8f0; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #1a3a2a; border-radius: 2px; }
    input, textarea, button { font-family: 'Plus Jakarta Sans', sans-serif; }
    button { cursor: pointer; }
    img { max-width: 100%; }

    @keyframes floatUp { 0% { transform: translateY(0) scale(0.8); opacity: 0; } 20% { opacity: 0.6; } 80% { opacity: 0.3; } 100% { transform: translateY(-100vh) scale(1.2); opacity: 0; } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0%,100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
    @keyframes heartbeat { 0%,100% { transform: scale(1); } 14% { transform: scale(1.2); } 28% { transform: scale(1); } 42% { transform: scale(1.1); } }
    @keyframes breatheIn { 0% { transform: scale(0.8); opacity: 0.4; } 100% { transform: scale(1.3); opacity: 1; } }
    @keyframes breatheOut { 0% { transform: scale(1.3); opacity: 1; } 100% { transform: scale(0.8); opacity: 0.4; } }
    @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    @keyframes blobMorph { 0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; } 50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; } }
    @keyframes glowGreen { 0%,100% { box-shadow: 0 0 15px rgba(29,158,117,0.3); } 50% { box-shadow: 0 0 35px rgba(29,158,117,0.6), 0 0 60px rgba(29,158,117,0.2); } }
    @keyframes glowPurple { 0%,100% { box-shadow: 0 0 15px rgba(139,92,246,0.3); } 50% { box-shadow: 0 0 35px rgba(139,92,246,0.6), 0 0 60px rgba(139,92,246,0.2); } }
    @keyframes typing { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-8px); } }
    @keyframes scanLine { 0% { top: 0; } 100% { top: 100%; } }
    @keyframes waveform { 0%,100% { height: 4px; } 50% { height: 20px; } }
    @keyframes ripple { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
    @keyframes drawECG { from { stroke-dashoffset: 600; } to { stroke-dashoffset: 0; } }
    @keyframes progressFill { from { width: 0; } to { width: var(--target-width); } }
    @keyframes countUp { from { opacity: 0; } to { opacity: 1; } }

    .fade-in { animation: fadeIn 0.5s ease forwards; }
    .fade-in-scale { animation: fadeInScale 0.4s ease forwards; }
    .slide-left { animation: slideInLeft 0.6s ease forwards; }
    .slide-right { animation: slideInRight 0.6s ease forwards; }
    .slide-up { animation: slideInUp 0.5s ease forwards; }
    .d1{animation-delay:0.1s;opacity:0} .d2{animation-delay:0.2s;opacity:0} .d3{animation-delay:0.3s;opacity:0}
    .d4{animation-delay:0.4s;opacity:0} .d5{animation-delay:0.5s;opacity:0} .d6{animation-delay:0.6s;opacity:0}
    .d7{animation-delay:0.7s;opacity:0} .d8{animation-delay:0.8s;opacity:0}

    .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 0.5px solid rgba(255,255,255,0.07); }
    .glass-g { background: rgba(29,158,117,0.06); backdrop-filter: blur(20px); border: 0.5px solid rgba(29,158,117,0.18); }
    .glass-p { background: rgba(139,92,246,0.06); backdrop-filter: blur(20px); border: 0.5px solid rgba(139,92,246,0.18); }
    .glass-b { background: rgba(59,130,246,0.06); backdrop-filter: blur(20px); border: 0.5px solid rgba(59,130,246,0.18); }

    .btn-g { background: linear-gradient(135deg, #1D9E75 0%, #0d7a5c 100%); color: white; border: none; border-radius: 12px; padding: 12px 22px; font-size: 13px; font-weight: 600; letter-spacing: 0.3px; transition: all 0.25s; }
    .btn-g:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(29,158,117,0.4); }
    .btn-g:active { transform: translateY(0); }
    .btn-g:disabled { opacity: 0.45; pointer-events: none; }
    .btn-p { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; border: none; border-radius: 12px; padding: 12px 22px; font-size: 13px; font-weight: 600; transition: all 0.25s; }
    .btn-p:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(139,92,246,0.4); }
    .btn-p:disabled { opacity: 0.45; pointer-events: none; }
    .btn-b { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; border: none; border-radius: 12px; padding: 12px 22px; font-size: 13px; font-weight: 600; transition: all 0.25s; }
    .btn-b:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(59,130,246,0.4); }
    .btn-outline { background: transparent; border: 0.5px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.6); border-radius: 12px; padding: 11px 20px; font-size: 13px; font-weight: 500; transition: all 0.2s; }
    .btn-outline:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.25); color: white; }

    .input-f { width: 100%; background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 13px 16px; font-size: 13px; color: #e4e8f0; outline: none; transition: all 0.25s; }
    .input-f:focus { border-color: rgba(29,158,117,0.5); background: rgba(29,158,117,0.05); box-shadow: 0 0 0 3px rgba(29,158,117,0.1); }
    .input-f::placeholder { color: rgba(255,255,255,0.25); }
    .input-fp:focus { border-color: rgba(139,92,246,0.5); background: rgba(139,92,246,0.05); box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
    .input-fb:focus { border-color: rgba(59,130,246,0.5); background: rgba(59,130,246,0.05); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }

    .msg-ai { background: rgba(255,255,255,0.05); border: 0.5px solid rgba(255,255,255,0.08); border-radius: 16px 16px 16px 4px; padding: 12px 16px; font-size: 13px; line-height: 1.75; max-width: 88%; align-self: flex-start; color: #c8d8c8; }
    .msg-g { background: linear-gradient(135deg, rgba(29,158,117,0.25), rgba(29,158,117,0.12)); border: 0.5px solid rgba(29,158,117,0.28); border-radius: 16px 16px 4px 16px; padding: 12px 16px; font-size: 13px; line-height: 1.75; max-width: 88%; align-self: flex-end; color: #e4e8f0; }
    .msg-p { background: linear-gradient(135deg, rgba(139,92,246,0.25), rgba(139,92,246,0.12)); border: 0.5px solid rgba(139,92,246,0.28); border-radius: 16px 16px 4px 16px; padding: 12px 16px; font-size: 13px; line-height: 1.75; max-width: 88%; align-self: flex-end; color: #e4e8f0; }

    .tab-pill { padding: 7px 14px; font-size: 12px; border-radius: 20px; border: 0.5px solid transparent; cursor: pointer; transition: all 0.2s; background: transparent; color: rgba(255,255,255,0.35); font-weight: 500; white-space: nowrap; }
    .tab-pill:hover { color: rgba(255,255,255,0.65); }
    .tab-g { background: rgba(29,158,117,0.15); border-color: rgba(29,158,117,0.35); color: #6ee7b7 !important; }
    .tab-p { background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.35); color: #c4b5fd !important; }
    .tab-b { background: rgba(59,130,246,0.15); border-color: rgba(59,130,246,0.35); color: #93c5fd !important; }

    .chip { background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 6px 12px; font-size: 11px; cursor: pointer; transition: all 0.18s; color: rgba(255,255,255,0.5); }
    .chip:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); }
    .chip-g-sel { background: rgba(29,158,117,0.18); border-color: rgba(29,158,117,0.45); color: #6ee7b7; }
    .chip-p-sel { background: rgba(139,92,246,0.18); border-color: rgba(139,92,246,0.45); color: #c4b5fd; }

    .card-hover { transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1); }
    .card-hover:hover { transform: translateY(-5px); }

    .scan-line { position: absolute; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, rgba(29,158,117,0.8), transparent); animation: scanLine 2s linear infinite; }

    .waveform-bar { width: 3px; background: rgba(29,158,117,0.7); border-radius: 2px; display: inline-block; margin: 0 1px; animation: waveform 0.6s ease-in-out infinite; }

    .mic-recording { animation: glowGreen 1s ease infinite; }

    .page-overlay { position: fixed; inset: 0; z-index: 200; background: #07090f; overflow-y: auto; animation: fadeInScale 0.35s ease; }
    .modal-overlay { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .modal-bg { position: absolute; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); }
    .modal-box { position: relative; z-index: 1; width: 100%; border-radius: 28px; display: flex; flex-direction: column; max-height: 92vh; overflow: hidden; animation: fadeInScale 0.3s ease; }

    .progress-bar-inner { height: 100%; border-radius: 4px; animation: progressFill 1s ease forwards; }
    .star { color: #fbbf24; font-size: 13px; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; letter-spacing: 0.5px; }
    .badge-g { background: rgba(29,158,117,0.15); color: #6ee7b7; border: 0.5px solid rgba(29,158,117,0.3); }
    .badge-p { background: rgba(139,92,246,0.15); color: #c4b5fd; border: 0.5px solid rgba(139,92,246,0.3); }
    .badge-r { background: rgba(239,68,68,0.15); color: #fca5a5; border: 0.5px solid rgba(239,68,68,0.3); }
    .badge-y { background: rgba(251,191,36,0.15); color: #fcd34d; border: 0.5px solid rgba(251,191,36,0.3); }

    .sidebar { position: fixed; left: 0; top: 0; bottom: 0; width: 220px; z-index: 40; border-right: 0.5px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; padding: 24px 16px; transition: transform 0.3s ease; }
    .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 12px; cursor: pointer; transition: all 0.2s; color: rgba(255,255,255,0.4); font-size: 13px; font-weight: 500; margin-bottom: 4px; border: 0.5px solid transparent; }
    .sidebar-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.75); }
    .sidebar-item.active-g { background: rgba(29,158,117,0.12); border-color: rgba(29,158,117,0.2); color: #6ee7b7; }
    .sidebar-item.active-p { background: rgba(139,92,246,0.12); border-color: rgba(139,92,246,0.2); color: #c4b5fd; }

    .health-ring { transition: stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1); }

    @media (max-width: 768px) { .sidebar { transform: translateX(-100%); } .main-content { margin-left: 0 !important; } }
    @media (max-width: 600px) { .dash-grid { flex-direction: column !important; } }
  `
  document.head.appendChild(style)
}
injectStyles()

/* ── Constants ── */
const LANGS = { en: 'English', hi: 'हिन्दी', kn: 'ಕನ್ನಡ', ta: 'தமிழ்', te: 'తెలుగు', mr: 'मराठी', bn: 'বাংলা', gu: 'ગુજરાતી' }
const LANG_CODES = { en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN', ta: 'ta-IN', te: 'te-IN', mr: 'mr-IN', bn: 'bn-IN', gu: 'gu-IN' }

/* ── Helpers ── */
async function callAI(system, userMsg, imageB64 = null) {
  const content = imageB64
    ? [{ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageB64 } }, { type: 'text', text: userMsg }]
    : userMsg
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 600, system, messages: [{ role: 'user', content }] })
  })
  const d = await res.json()
  return d.content.map(c => c.type === 'text' ? c.text : '').join('')
}

function fileToB64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = e => res(e.target.result.split(',')[1])
    r.onerror = rej
    r.readAsDataURL(file)
  })
}

/* ── UI Atoms ── */
function Loader({ color = 'g' }) {
  const c = color === 'g' ? '#6ee7b7' : color === 'p' ? '#c4b5fd' : '#93c5fd'
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '4px 0' }}>
      {[0,1,2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, display: 'inline-block', animation: `typing 1s ease infinite ${i * 0.2}s` }} />)}
    </div>
  )
}

function Spinner({ size = 18, color = 'white' }) {
  return <div style={{ width: size, height: size, border: `2px solid rgba(255,255,255,0.2)`, borderTopColor: color, borderRadius: '50%', animation: 'rotate 0.7s linear infinite', flexShrink: 0 }} />
}

function BgBlobs({ g = true, p = true }) {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {g && <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 550, height: 550, background: 'radial-gradient(circle, rgba(29,158,117,0.07) 0%, transparent 65%)', borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%', animation: 'blobMorph 10s ease infinite' }} />}
      {p && <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: 650, height: 650, background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)', borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%', animation: 'blobMorph 13s ease infinite reverse' }} />}
    </div>
  )
}

function Particles({ n = 15 }) {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} style={{ position: 'absolute', bottom: -10, left: `${Math.random() * 100}%`, width: Math.random() * 5 + 2, height: Math.random() * 5 + 2, borderRadius: '50%', background: i % 2 === 0 ? `rgba(29,158,117,${Math.random() * 0.3 + 0.1})` : `rgba(139,92,246,${Math.random() * 0.25 + 0.08})`, animation: `floatUp ${Math.random() * 12 + 15}s ${Math.random() * 10}s linear infinite` }} />
      ))}
    </div>
  )
}

/* ── Voice Hook ── */
function useVoice(lang, onResult) {
  const [recording, setRecording] = useState(false)
  const recRef = useRef(null)

  const toggle = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input not supported. Use Chrome browser.'); return
    }
    if (recRef.current) { recRef.current.stop(); recRef.current = null; setRecording(false); return }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const r = new SR()
    r.lang = LANG_CODES[lang] || 'en-IN'
    r.continuous = false; r.interimResults = false
    r.onstart = () => setRecording(true)
    r.onresult = e => { onResult(e.results[0][0].transcript); r.stop() }
    r.onend = () => { setRecording(false); recRef.current = null }
    r.onerror = () => { setRecording(false); recRef.current = null }
    recRef.current = r; r.start()
  }, [lang, onResult])

  return { recording, toggle }
}

/* ── MicButton ── */
function MicButton({ recording, onToggle, color = 'g' }) {
  const bg = recording ? (color === 'g' ? 'rgba(29,158,117,0.3)' : 'rgba(139,92,246,0.3)') : 'rgba(255,255,255,0.06)'
  const bc = recording ? (color === 'g' ? 'rgba(29,158,117,0.7)' : 'rgba(139,92,246,0.7)') : 'rgba(255,255,255,0.1)'
  return (
    <button onClick={onToggle} className={recording ? 'mic-recording' : ''} style={{ width: 42, height: 42, borderRadius: '50%', background: bg, border: `0.5px solid ${bc}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s', fontSize: 16 }}>
      {recording ? (
        <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 18 }}>
          {[0,1,2,3,4].map(i => <span key={i} className="waveform-bar" style={{ animationDelay: `${i * 0.1}s`, height: `${[8,16,12,20,10][i]}px` }} />)}
        </div>
      ) : '🎤'}
    </button>
  )
}

/* ══════════════════════════════════
   IMAGE MEDICINE RECOGNITION PAGE
══════════════════════════════════ */
function MedicineScanner({ onBack }) {
  const [image, setImage] = useState(null)
  const [b64, setB64] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('medicine')
  const fileRef = useRef()

  const modes = [
    { id: 'medicine', label: '💊 Medicine', desc: 'Identify pills, tablets, strips, bottles' },
    { id: 'wound', label: '🩹 Wound / Skin', desc: 'Rash, wound, burn, skin condition' },
    { id: 'prescription', label: '📋 Prescription', desc: 'Read & explain doctor prescription' },
    { id: 'food', label: '🥗 Food Safety', desc: 'Is this safe to eat? Nutrition info' },
  ]

  async function handleFile(file) {
    const url = URL.createObjectURL(file)
    setImage(url); setResult(null)
    setB64(await fileToB64(file))
  }

  async function analyze() {
    if (!b64) return
    setLoading(true); setResult(null)
    const prompts = {
      medicine: 'You are an expert pharmacist. Analyze this medicine image. Identify: 1) Medicine name & composition, 2) What it is used for, 3) Common dosage, 4) Important warnings & side effects, 5) Whether prescription is required, 6) Indian brand names. Format clearly with sections.',
      wound: 'You are a medical expert. Analyze this wound/skin image. Identify: 1) Type of condition (wound, rash, burn, etc.), 2) Severity assessment (mild/moderate/severe), 3) Immediate first aid steps, 4) Signs of infection to watch for, 5) When to see a doctor urgently. Be practical for rural India context.',
      prescription: 'You are a pharmacist helping rural Indians understand prescriptions. Read this prescription image and explain: 1) Each medicine listed and what it treats, 2) How to take each medicine (dosage, timing), 3) Duration of treatment, 4) Any warnings or precautions. Use very simple language.',
      food: 'You are a nutritionist. Analyze this food image and provide: 1) What food items are visible, 2) Approximate nutritional value, 3) Health benefits, 4) Any safety concerns, 5) Suitability for common conditions like diabetes, BP, pregnancy. Keep it practical.',
    }
    try {
      const r = await callAI(prompts[mode], 'Please analyze this image carefully and provide detailed information.', b64)
      setResult(r)
    } catch { setResult('Could not analyze image. Please check your internet connection and try again.') }
    setLoading(false)
  }

  return (
    <div className="page-overlay" style={{ background: '#07090f' }}>
      <BgBlobs g p={false} />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 20px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="fade-in" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <button onClick={onBack} className="btn-outline" style={{ padding: '9px 16px', fontSize: 12 }}>← Back</button>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 300, color: '#e4e8f0' }}>AI Image Scanner</h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Identify medicines, wounds, prescriptions & food</p>
          </div>
        </div>

        {/* Mode selector */}
        <div className="fade-in d1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {modes.map(m => (
            <div key={m.id} onClick={() => setMode(m.id)} style={{ padding: '12px 14px', borderRadius: 14, background: mode === m.id ? 'rgba(29,158,117,0.1)' : 'rgba(255,255,255,0.03)', border: `0.5px solid ${mode === m.id ? 'rgba(29,158,117,0.4)' : 'rgba(255,255,255,0.07)'}`, cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: mode === m.id ? '#6ee7b7' : '#c8d8c8', marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{m.desc}</div>
            </div>
          ))}
        </div>

        {/* Upload zone */}
        <div className="fade-in d2" onClick={() => fileRef.current.click()} style={{ border: `1.5px dashed ${image ? 'rgba(29,158,117,0.5)' : 'rgba(255,255,255,0.12)'}`, borderRadius: 20, padding: image ? 12 : 40, textAlign: 'center', cursor: 'pointer', background: image ? 'transparent' : 'rgba(255,255,255,0.02)', transition: 'all 0.3s', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
          {loading && <div className="scan-line" />}
          {image ? (
            <img src={image} alt="Uploaded" style={{ width: '100%', maxHeight: 280, objectFit: 'contain', borderRadius: 12 }} />
          ) : (
            <>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📷</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Tap to upload photo or take a picture</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Medicine strip, tablet, bottle, skin condition, prescription...</div>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
        </div>

        {image && (
          <div className="fade-in" style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button className="btn-g" onClick={analyze} disabled={loading} style={{ flex: 1 }}>
              {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner />Analyzing with AI...</span> : `🔍 Analyze ${modes.find(m2 => m2.id === mode)?.label}`}
            </button>
            <button className="btn-outline" onClick={() => { setImage(null); setB64(null); setResult(null) }} style={{ padding: '11px 16px' }}>Clear</button>
          </div>
        )}

        {result && (
          <div className="fade-in glass-g" style={{ borderRadius: 18, padding: '20px 22px' }}>
            <div style={{ fontSize: 12, color: 'rgba(110,231,183,0.6)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6ee7b7', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              AI Analysis Result
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.8, color: '#c8d8c8', whiteSpace: 'pre-wrap' }}>{result}</div>
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(251,191,36,0.08)', border: '0.5px solid rgba(251,191,36,0.2)', borderRadius: 10, fontSize: 11, color: 'rgba(253,211,77,0.7)' }}>
              ⚠️ This is AI guidance only. Always consult a qualified doctor before taking any medicine.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════
   VOICE TRANSLATOR PAGE
══════════════════════════════════ */
function VoiceTranslator({ onBack }) {
  const [fromLang, setFromLang] = useState('en')
  const [toLang, setToLang] = useState('hi')
  const [inputText, setInputText] = useState('')
  const [translated, setTranslated] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const { recording, toggle } = useVoice(fromLang, t => setInputText(prev => prev + ' ' + t))

  async function translate() {
    if (!inputText.trim()) return
    setLoading(true); setTranslated('')
    try {
      const r = await callAI(
        `You are a medical translator. Translate the following text from ${LANGS[fromLang]} to ${LANGS[toLang]}. Focus on medical accuracy. Return ONLY the translated text, nothing else.`,
        inputText.trim()
      )
      setTranslated(r)
      setHistory(h => [{ from: inputText, to: r, fromL: fromLang, toL: toLang }, ...h.slice(0, 9)])
    } catch { setTranslated('Translation failed. Check internet.') }
    setLoading(false)
  }

  function speak(text, lang) {
    if (!('speechSynthesis' in window)) { alert('Text-to-speech not supported in this browser.'); return }
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = LANG_CODES[lang] || 'en-IN'
    u.rate = 0.85
    window.speechSynthesis.speak(u)
  }

  function swapLangs() {
    setFromLang(toLang); setToLang(fromLang)
    setInputText(translated); setTranslated(inputText)
  }

  return (
    <div className="page-overlay">
      <BgBlobs g p />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 20px', position: 'relative', zIndex: 1 }}>
        <div className="fade-in" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <button onClick={onBack} className="btn-outline" style={{ padding: '9px 16px', fontSize: 12 }}>← Back</button>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 300 }}>Voice Translator</h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Speak or type — translate between 8 Indian languages</p>
          </div>
        </div>

        {/* Language picker */}
        <div className="fade-in d1 glass" style={{ borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>From</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {Object.entries(LANGS).map(([k, v]) => (
                  <button key={k} onClick={() => setFromLang(k)} className={`tab-pill${fromLang === k ? ' tab-g' : ''}`} style={{ fontSize: 11 }}>{v}</button>
                ))}
              </div>
            </div>
            <button onClick={swapLangs} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(29,158,117,0.15)', border: '0.5px solid rgba(29,158,117,0.3)', color: '#6ee7b7', fontSize: 16, flexShrink: 0 }}>⇄</button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>To</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {Object.entries(LANGS).map(([k, v]) => (
                  <button key={k} onClick={() => setToLang(k)} className={`tab-pill${toLang === k ? ' tab-p' : ''}`} style={{ fontSize: 11 }}>{v}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="fade-in d2 glass-g" style={{ borderRadius: 18, padding: 18, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: 'rgba(110,231,183,0.6)' }}>{LANGS[fromLang]}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <MicButton recording={recording} onToggle={toggle} color="g" />
              {inputText && <button onClick={() => speak(inputText, fromLang)} style={{ padding: '6px 12px', background: 'rgba(29,158,117,0.15)', border: '0.5px solid rgba(29,158,117,0.3)', borderRadius: 20, color: '#6ee7b7', fontSize: 12 }}>🔊 Play</button>}
            </div>
          </div>
          <textarea className="input-f" value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Type or speak in any language..." rows={4} style={{ resize: 'none' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {['I have fever', 'Stomach pain', 'My child is sick', 'I need medicine', 'Blood pressure'].map(q => (
              <button key={q} className="chip" onClick={() => setInputText(q)} style={{ fontSize: 11 }}>{q}</button>
            ))}
          </div>
        </div>

        <button className="btn-g fade-in d3" onClick={translate} disabled={loading || !inputText.trim()} style={{ width: '100%', marginBottom: 12 }}>
          {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner />Translating...</span> : `Translate to ${LANGS[toLang]} →`}
        </button>

        {/* Output */}
        {translated && (
          <div className="fade-in glass-p" style={{ borderRadius: 18, padding: 18, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'rgba(196,181,253,0.6)' }}>{LANGS[toLang]}</span>
              <button onClick={() => speak(translated, toLang)} style={{ padding: '6px 12px', background: 'rgba(139,92,246,0.15)', border: '0.5px solid rgba(139,92,246,0.3)', borderRadius: 20, color: '#c4b5fd', fontSize: 12 }}>🔊 Play</button>
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.75, color: '#e4e8f0' }}>{translated}</div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="fade-in">
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>Recent translations</div>
            {history.map((h, i) => (
              <div key={i} className="glass" style={{ borderRadius: 12, padding: '10px 14px', marginBottom: 7, cursor: 'pointer' }} onClick={() => { setInputText(h.from); setTranslated(h.to); setFromLang(h.fromL); setToLang(h.toL) }}>
                <div style={{ fontSize: 12, color: '#c8d8c8', marginBottom: 4 }}>{h.from}</div>
                <div style={{ fontSize: 12, color: 'rgba(196,181,253,0.7)' }}>→ {h.to}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════
   HEALTH TRACKER PAGE
══════════════════════════════════ */
function HealthTracker({ onBack }) {
  const [vitals, setVitals] = useState({ bp_sys: '', bp_dia: '', pulse: '', temp: '', sugar: '', weight: '', spo2: '' })
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem('gv_vitals') || '[]'))
  const [aiInsight, setAiInsight] = useState('')
  const [loading, setLoading] = useState(false)

  function saveVitals() {
    const entry = { ...vitals, date: new Date().toLocaleDateString('en-IN'), time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }
    const updated = [entry, ...saved.slice(0, 19)]
    setSaved(updated)
    localStorage.setItem('gv_vitals', JSON.stringify(updated))
    setVitals({ bp_sys: '', bp_dia: '', pulse: '', temp: '', sugar: '', weight: '', spo2: '' })
    alert('Vitals saved!')
  }

  async function getInsight() {
    const last = saved[0]
    if (!last) return
    setLoading(true); setAiInsight('')
    try {
      const r = await callAI('You are a village health advisor. Given these vitals, provide: 1) Quick assessment of each reading (normal/concerning), 2) What the readings suggest, 3) Lifestyle tips, 4) When to see a doctor. Be simple and practical for rural India.', `Vitals: BP ${last.bp_sys}/${last.bp_dia} mmHg, Pulse ${last.pulse} bpm, Temp ${last.temp}°F, Sugar ${last.sugar} mg/dL, SpO2 ${last.spo2}%, Weight ${last.weight} kg`)
      setAiInsight(r)
    } catch { setAiInsight('Could not get AI insight.') }
    setLoading(false)
  }

  const fields = [
    { k: 'bp_sys', l: 'BP Systolic', unit: 'mmHg', normal: '90-120' },
    { k: 'bp_dia', l: 'BP Diastolic', unit: 'mmHg', normal: '60-80' },
    { k: 'pulse', l: 'Pulse Rate', unit: 'bpm', normal: '60-100' },
    { k: 'temp', l: 'Temperature', unit: '°F', normal: '97-99' },
    { k: 'sugar', l: 'Blood Sugar', unit: 'mg/dL', normal: '70-140' },
    { k: 'spo2', l: 'SpO2', unit: '%', normal: '95-100' },
    { k: 'weight', l: 'Weight', unit: 'kg', normal: '' },
  ]

  return (
    <div className="page-overlay">
      <BgBlobs g p={false} />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px', position: 'relative', zIndex: 1 }}>
        <div className="fade-in" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <button onClick={onBack} className="btn-outline" style={{ padding: '9px 16px', fontSize: 12 }}>← Back</button>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 300 }}>Health Tracker</h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Track vitals and get AI-powered health insights</p>
          </div>
        </div>

        {/* Vitals input grid */}
        <div className="fade-in d1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {fields.map(f => (
            <div key={f.k} className="glass" style={{ borderRadius: 14, padding: '13px 15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{f.l}</span>
                {f.normal && <span style={{ fontSize: 10, color: 'rgba(110,231,183,0.5)' }}>Normal: {f.normal}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input className="input-f" type="number" value={vitals[f.k]} onChange={e => setVitals(v => ({ ...v, [f.k]: e.target.value }))} placeholder="--" style={{ flex: 1, padding: '8px 10px', fontSize: 16, fontWeight: 500 }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>{f.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-g fade-in d2" onClick={saveVitals} style={{ width: '100%', marginBottom: 10 }}>💾 Save Today's Vitals</button>

        {/* History */}
        {saved.length > 0 && (
          <div className="fade-in d3">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Vitals history</span>
              <button className="btn-g" onClick={getInsight} disabled={loading} style={{ padding: '8px 16px', fontSize: 12 }}>
                {loading ? <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Spinner size={14} />Analyzing...</span> : '🤖 AI Insight'}
              </button>
            </div>
            {aiInsight && (
              <div className="fade-in glass-g" style={{ borderRadius: 16, padding: '16px 18px', marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: 'rgba(110,231,183,0.6)', marginBottom: 8 }}>AI Health Insight</div>
                <div style={{ fontSize: 13, lineHeight: 1.75, color: '#c8d8c8' }}>{aiInsight}</div>
              </div>
            )}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
                    {['Date', 'BP', 'Pulse', 'Temp', 'Sugar', 'SpO2'].map(h => (
                      <th key={h} style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {saved.slice(0, 10).map((e, i) => (
                    <tr key={i} style={{ borderBottom: '0.5px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '9px 10px', color: 'rgba(255,255,255,0.5)' }}>{e.date}</td>
                      <td style={{ padding: '9px 10px', color: '#c8d8c8' }}>{e.bp_sys}/{e.bp_dia}</td>
                      <td style={{ padding: '9px 10px', color: '#c8d8c8' }}>{e.pulse}</td>
                      <td style={{ padding: '9px 10px', color: '#c8d8c8' }}>{e.temp}</td>
                      <td style={{ padding: '9px 10px', color: '#c8d8c8' }}>{e.sugar}</td>
                      <td style={{ padding: '9px 10px', color: '#c8d8c8' }}>{e.spo2}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════
   VILLAGE DOCTOR FULL APP
══════════════════════════════════ */
function VillageDoctor({ onBack }) {
  const [page, setPage] = useState('chat')
  const [lang, setLang] = useState('en')
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Namaste! I am Dr. Gram Vaidya 🌿 Your AI village doctor available 24/7. Describe your symptoms, show me a medicine photo, or ask anything about your health. I speak all Indian languages!' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selSyms, setSelSyms] = useState([])
  const [symResult, setSymResult] = useState('')
  const [subPage, setSubPage] = useState(null)
  const chatEnd = useRef(null)
  const { recording, toggle } = useVoice(lang, t => setInput(p => p + ' ' + t))

  const pages = [
    { id: 'chat', icon: '💬', label: 'AI Doctor' },
    { id: 'symptoms', icon: '🔍', label: 'Symptoms' },
    { id: 'medicines', icon: '💊', label: 'Medicines' },
    { id: 'scanner', icon: '📷', label: 'Scan Image' },
    { id: 'tracker', icon: '📊', label: 'Vitals' },
    { id: 'translator', icon: '🌐', label: 'Translate' },
    { id: 'firstaid', icon: '🩹', label: 'First Aid' },
    { id: 'sos', icon: '🆘', label: 'Emergency' },
  ]

  const SYMPTOMS = ['Fever', 'Headache', 'Cough', 'Body pain', 'Vomiting', 'Diarrhea', 'Chest pain', 'Breathlessness', 'Rash/Itching', 'Stomach pain', 'Weakness', 'Dizziness', 'Swelling', 'Sore throat', 'Eye pain', 'Ear pain', 'Back pain', 'Joint pain', 'Nausea', 'Loss of appetite']

  async function send(msg) {
    const text = msg || input.trim()
    if (!text || loading) return
    setMessages(m => [...m, { role: 'user', text }])
    setInput('')
    setLoading(true)
    setMessages(m => [...m, { role: 'ai', loading: true }])
    const langNote = lang !== 'en' ? `Respond in ${LANGS[lang]}.` : ''
    try {
      const r = await callAI(`You are Dr. Gram Vaidya, a compassionate AI village doctor for rural India. Give practical, simple health advice. Mention 112 for emergencies. Be warm and thorough. Under 150 words. ${langNote}`, text)
      setMessages(m => m.map((x, i) => i === m.length - 1 ? { role: 'ai', text: r } : x))
    } catch { setMessages(m => m.map((x, i) => i === m.length - 1 ? { role: 'ai', text: 'Network error. Please try again.' } : x)) }
    setLoading(false)
    setTimeout(() => chatEnd.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  async function analyzeSym() {
    if (!selSyms.length) return
    setLoading(true); setSymResult('Analyzing your symptoms with AI...')
    try {
      const r = await callAI('You are Gram Vaidya. Give: 1) Likely condition, 2) Severity (mild/moderate/severe/emergency), 3) Immediate first-aid steps, 4) Medicines that may help (OTC only), 5) When to see a doctor urgently. Simple language for rural India.', `Patient symptoms: ${selSyms.join(', ')}`)
      setSymResult(r)
    } catch { setSymResult('Could not connect. Check internet.') }
    setLoading(false)
  }

  if (subPage === 'scanner') return <MedicineScanner onBack={() => setSubPage(null)} />
  if (subPage === 'tracker') return <HealthTracker onBack={() => setSubPage(null)} />
  if (subPage === 'translator') return <VoiceTranslator onBack={() => setSubPage(null)} />

  return (
    <div className="page-overlay" style={{ background: '#07110d' }}>
      <BgBlobs g p={false} />
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', zIndex: 1 }}>
        {/* Top bar */}
        <div style={{ padding: '14px 20px', borderBottom: '0.5px solid rgba(29,158,117,0.15)', background: 'rgba(7,17,13,0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '7px 13px', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>← Back</button>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1D9E75,#0d7a5c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, animation: 'heartbeat 3s ease infinite' }}>🌿</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#6ee7b7' }}>Village Doctor</div>
            <div style={{ fontSize: 10, color: 'rgba(110,231,183,0.45)' }}>● AI Online · 24/7</div>
          </div>
          {/* Lang */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {Object.entries(LANGS).slice(0, 5).map(([k, v]) => (
              <button key={k} onClick={() => setLang(k)} className={`tab-pill${lang === k ? ' tab-g' : ''}`} style={{ fontSize: 10, padding: '4px 9px' }}>{v}</button>
            ))}
          </div>
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', gap: 4, padding: '10px 16px', overflowX: 'auto', borderBottom: '0.5px solid rgba(29,158,117,0.08)', flexShrink: 0, background: 'rgba(7,17,13,0.7)' }}>
          {pages.map(p => (
            <button key={p.id} onClick={() => p.id === 'scanner' ? setSubPage('scanner') : p.id === 'tracker' ? setSubPage('tracker') : p.id === 'translator' ? setSubPage('translator') : setPage(p.id)} className={`tab-pill${page === p.id && !subPage ? ' tab-g' : ''}`} style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{p.icon} {p.label}</button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

          {/* CHAT */}
          {page === 'chat' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages.map((m, i) => (
                  <div key={i} className={m.role === 'user' ? 'msg-g' : 'msg-ai'} style={{ animation: 'fadeIn 0.3s ease' }}>
                    {m.loading ? <Loader color="g" /> : m.text}
                  </div>
                ))}
                <div ref={chatEnd} />
              </div>
              {messages.length < 3 && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Quick questions</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['I have fever since 2 days', 'My child is not eating', 'Severe stomach pain', 'I need medicine for cold', 'What is normal blood pressure?', 'Safe medicines in pregnancy'].map(q => (
                      <button key={q} className="chip" onClick={() => send(q)}>{q}</button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* SYMPTOMS */}
          {page === 'symptoms' && (
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>Select all symptoms you have right now</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 18 }}>
                {SYMPTOMS.map(s => (
                  <div key={s} className={`chip${selSyms.includes(s) ? ' chip-g-sel' : ''}`} onClick={() => setSelSyms(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])}>{s}</div>
                ))}
              </div>
              {selSyms.length > 0 && (
                <div style={{ padding: '10px 14px', background: 'rgba(29,158,117,0.06)', border: '0.5px solid rgba(29,158,117,0.15)', borderRadius: 12, marginBottom: 14, fontSize: 12, color: 'rgba(110,231,183,0.7)' }}>
                  Selected: {selSyms.join(', ')}
                </div>
              )}
              <button className="btn-g" onClick={analyzeSym} disabled={loading || !selSyms.length} style={{ width: '100%', marginBottom: 16 }}>
                {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner />Analyzing...</span> : `🤖 Analyze ${selSyms.length} symptom${selSyms.length !== 1 ? 's' : ''}`}
              </button>
              {symResult && (
                <div className="glass-g fade-in" style={{ borderRadius: 16, padding: '16px 18px' }}>
                  <div style={{ fontSize: 11, color: 'rgba(110,231,183,0.5)', marginBottom: 8 }}>AI Symptom Assessment</div>
                  <div style={{ fontSize: 13, lineHeight: 1.8, color: '#c8d8c8', whiteSpace: 'pre-wrap' }}>{symResult}</div>
                </div>
              )}
            </div>
          )}

          {/* MEDICINES */}
          {page === 'medicines' && <MedicinesPage lang={lang} />}

          {/* FIRST AID */}
          {page === 'firstaid' && <FirstAidPage lang={lang} />}

          {/* SOS */}
          {page === 'sos' && <SOSPage />}
        </div>

        {/* Chat input */}
        {page === 'chat' && (
          <div style={{ padding: '12px 20px 18px', borderTop: '0.5px solid rgba(29,158,117,0.1)', background: 'rgba(7,17,13,0.9)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <MicButton recording={recording} onToggle={toggle} color="g" />
              <input className="input-f" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={`Type or speak in ${LANGS[lang]}...`} style={{ flex: 1 }} />
              <button className="btn-g" onClick={() => send()} disabled={loading || !input.trim()} style={{ padding: '11px 16px' }}>➤</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Medicines Page ── */
function MedicinesPage({ lang }) {
  const [q, setQ] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const common = [['Paracetamol', 'Fever, pain', 'Safe', '1-2 tabs every 6 hrs'], ['ORS', 'Dehydration', 'Safe', '1 sachet in 1L water'], ['Antacid', 'Acidity', 'Safe', 'After meals'], ['Cetirizine', 'Allergy, cold', 'Safe', '1 tab at night'], ['Metformin', 'Diabetes', 'Rx needed', 'As prescribed'], ['Amlodipine', 'Blood pressure', 'Rx needed', 'As prescribed']]

  async function search() {
    if (!q.trim()) return
    setLoading(true); setResult('')
    const langNote = lang !== 'en' ? `Respond in ${LANGS[lang]}.` : ''
    try {
      const r = await callAI(`You are a pharmacist for rural India. For the medicine/condition queried give: 1) What it is used for, 2) Dosage & timing, 3) Warnings & side effects, 4) Common Indian brands, 5) Whether prescription required, 6) Safe alternatives if any. Simple language. ${langNote}`, q)
      setResult(r)
    } catch { setResult('Could not connect.') }
    setLoading(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input className="input-f" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder="Search medicine or condition..." style={{ flex: 1 }} />
        <button className="btn-g" onClick={search} disabled={loading} style={{ padding: '11px 18px' }}>{loading ? <Spinner size={16} /> : '🔍'}</button>
      </div>
      {result && <div className="glass-g fade-in" style={{ borderRadius: 16, padding: '16px 18px', marginBottom: 16 }}><div style={{ fontSize: 13, lineHeight: 1.8, color: '#c8d8c8', whiteSpace: 'pre-wrap' }}>{result}</div></div>}
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>Common medicines guide</div>
      {common.map(([n, use, safe, dose]) => (
        <div key={n} onClick={() => { setQ(n); search() }} className="glass card-hover" style={{ borderRadius: 12, padding: '11px 14px', marginBottom: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#c8d8c8', marginBottom: 2 }}>{n}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{use} · {dose}</div>
          </div>
          <span className={`badge ${safe === 'Safe' ? 'badge-g' : 'badge-y'}`}>{safe}</span>
        </div>
      ))}
    </div>
  )
}

/* ── First Aid Page ── */
function FirstAidPage({ lang }) {
  const [sel, setSel] = useState(null)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const topics = [['🔥', 'Burns', 'Fire, hot liquid'], ['🩸', 'Bleeding', 'Cuts, wounds'], ['💀', 'Snake Bite', 'Venomous bite'], ['😵', 'Unconscious', 'Fainting, collapse'], ['🫁', 'Choking', 'Blocked airway'], ['⚡', 'Electric Shock', 'Electrocution'], ['🤕', 'Head Injury', 'Fall, accident'], ['🤧', 'Fever Crisis', 'Very high fever'], ['🤰', 'Pregnancy Emergency', 'Labor, bleeding'], ['☀️', 'Heat Stroke', 'Sun exposure'], ['🐍', 'Dog Bite', 'Animal bite'], ['💊', 'Overdose', 'Too much medicine']]

  async function getGuide(topic) {
    setSel(topic); setLoading(true); setResult('')
    const langNote = lang !== 'en' ? `Respond in ${LANGS[lang]}.` : ''
    try {
      const r = await callAI(`You are a first aid expert for rural India. Give step-by-step first aid for ${topic}. Include: 1) Immediate actions (numbered steps), 2) What NOT to do, 3) When to call 112, 4) Items needed from home. Very clear, simple language. ${langNote}`, `First aid guide for: ${topic}`)
      setResult(r)
    } catch { setResult('Could not load guide.') }
    setLoading(false)
  }

  return (
    <div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>Tap any emergency for instant first-aid guide</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        {topics.map(([icon, name, sub]) => (
          <div key={name} onClick={() => getGuide(name)} className="glass card-hover" style={{ borderRadius: 14, padding: '12px 10px', cursor: 'pointer', textAlign: 'center', border: sel === name ? '0.5px solid rgba(29,158,117,0.5)' : '0.5px solid rgba(255,255,255,0.06)', background: sel === name ? 'rgba(29,158,117,0.1)' : 'rgba(255,255,255,0.02)' }}>
            <div style={{ fontSize: 22, marginBottom: 5 }}>{icon}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: sel === name ? '#6ee7b7' : '#c8d8c8' }}>{name}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>
      {loading && <div className="glass-g" style={{ borderRadius: 14, padding: '16px', textAlign: 'center' }}><Loader color="g" /></div>}
      {result && (
        <div className="fade-in glass-g" style={{ borderRadius: 16, padding: '16px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#6ee7b7', marginBottom: 10 }}>First Aid: {sel}</div>
          <div style={{ fontSize: 13, lineHeight: 1.85, color: '#c8d8c8', whiteSpace: 'pre-wrap' }}>{result}</div>
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            <button onClick={() => alert('Calling 112')} style={{ flex: 1, padding: '11px', background: 'rgba(239,68,68,0.2)', border: '0.5px solid rgba(239,68,68,0.4)', borderRadius: 10, color: '#fca5a5', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>📞 Call 112 now</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── SOS Page ── */
function SOSPage() {
  const [locating, setLocating] = useState(false)
  const [loc, setLoc] = useState(null)

  function getLocation() {
    setLocating(true)
    navigator.geolocation?.getCurrentPosition(p => { setLoc({ lat: p.coords.latitude.toFixed(4), lng: p.coords.longitude.toFixed(4) }); setLocating(false) }, () => setLocating(false))
  }

  return (
    <div>
      <div style={{ padding: '24px', background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.25)', borderRadius: 20, textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 48, marginBottom: 10, animation: 'pulse 1s ease infinite' }}>🆘</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#fca5a5', marginBottom: 6 }}>Emergency SOS</div>
        <p style={{ fontSize: 12, color: 'rgba(252,165,165,0.65)', lineHeight: 1.6, marginBottom: 16 }}>For life-threatening emergencies — heart attack, stroke, severe bleeding, unconsciousness</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => alert('Calling 112')} style={{ flex: 1, padding: '16px', background: 'linear-gradient(135deg,#dc2626,#b91c1c)', color: 'white', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', animation: 'glowGreen 1.5s ease infinite' }}>📞 CALL 112</button>
          <button onClick={() => alert('SMS sent')} style={{ flex: 1, padding: '16px', background: 'rgba(239,68,68,0.12)', border: '0.5px solid rgba(239,68,68,0.35)', borderRadius: 14, color: '#fca5a5', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>📩 SMS ASHA</button>
        </div>
      </div>
      <button onClick={getLocation} disabled={locating} className="btn-b" style={{ width: '100%', marginBottom: 14 }}>
        {locating ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner />Getting location...</span> : '📍 Share My Location'}
      </button>
      {loc && <div style={{ padding: '10px 14px', background: 'rgba(59,130,246,0.08)', border: '0.5px solid rgba(59,130,246,0.2)', borderRadius: 10, fontSize: 12, color: '#93c5fd', marginBottom: 14 }}>📍 Location: {loc.lat}, {loc.lng} — Ready to share</div>}
      {[['🏥', 'Primary Health Centre', '2.4 km', '08232-234567'], ['👩‍⚕️', 'ASHA Worker — Meena', '0.8 km', '94481-12345'], ['🏨', 'District Hospital', '14 km', '08232-456789'], ['🚑', 'Ambulance (108)', 'State wide', '108']].map(([icon, n, d, ph]) => (
        <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#e4e8f0' }}>{n}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{d} away</div>
          </div>
          <button onClick={() => alert(`Calling ${ph}`)} style={{ padding: '7px 14px', background: 'rgba(29,158,117,0.15)', border: '0.5px solid rgba(29,158,117,0.3)', borderRadius: 20, color: '#6ee7b7', fontSize: 12, cursor: 'pointer' }}>Call</button>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════
   MENTAL HEALTH FULL APP
══════════════════════════════════ */
function MentalHealth({ onBack }) {
  const [page, setPage] = useState('chat')
  const [lang, setLang] = useState('en')
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hello 💜 I am here for you. This is a completely private, safe space. How are you feeling today? You can share anything — stress, anxiety, grief, loneliness, or just thoughts you need to talk through.' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mood, setMood] = useState(null)
  const [moodResult, setMoodResult] = useState('')
  const [breathPhase, setBreathPhase] = useState('idle')
  const [breathCount, setBreathCount] = useState(0)
  const [journal, setJournal] = useState('')
  const [savedJournals, setSavedJournals] = useState(() => JSON.parse(localStorage.getItem('gv_journal') || '[]'))
  const [aiJournalInsight, setAiJournalInsight] = useState('')
  const chatEnd = useRef(null)
  const breathRef = useRef(null)
  const { recording, toggle } = useVoice(lang, t => setInput(p => p + ' ' + t))

  const navPages = [
    { id: 'chat', icon: '💬', label: 'Talk' },
    { id: 'mood', icon: '🌈', label: 'Mood' },
    { id: 'breathe', icon: '🫁', label: 'Breathe' },
    { id: 'journal', icon: '📖', label: 'Journal' },
    { id: 'meditate', icon: '🧘', label: 'Meditate' },
    { id: 'resources', icon: '📚', label: 'Help' },
  ]

  async function send(msg) {
    const text = msg || input.trim()
    if (!text || loading) return
    setMessages(m => [...m, { role: 'user', text }])
    setInput('')
    setLoading(true)
    setMessages(m => [...m, { role: 'ai', loading: true }])
    const langNote = lang !== 'en' ? `Respond in ${LANGS[lang]}.` : ''
    try {
      const r = await callAI(`You are a warm, empathetic mental wellness companion for rural India. Listen deeply, validate feelings, offer gentle practical coping strategies rooted in Indian context. Never diagnose. For crisis (suicidal thoughts), gently suggest iCall: 9152987821. Be gentle, warm, non-judgmental. Under 150 words. ${langNote}`, text)
      setMessages(m => m.map((x, i) => i === m.length - 1 ? { role: 'ai', text: r } : x))
    } catch { setMessages(m => m.map((x, i) => i === m.length - 1 ? { role: 'ai', text: 'I am still here. Please check your connection.' } : x)) }
    setLoading(false)
    setTimeout(() => chatEnd.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  async function checkMood(m) {
    setMood(m); setLoading(true); setMoodResult('')
    try {
      const r = await callAI('You are a mental wellness advisor for rural India. Given this mood, give: 1) Acknowledgment of feeling, 2) Why this happens (simple), 3) 3 practical coping tips rooted in Indian daily life, 4) A simple affirmation. Warm, gentle tone. Under 120 words.', `Person is feeling: ${m}`)
      setMoodResult(r)
    } catch { setMoodResult('Could not connect.') }
    setLoading(false)
  }

  function startBreath() {
    setBreathCount(0); setBreathPhase('inhale')
    let c = 0
    const next = () => {
      setBreathPhase('inhale')
      setTimeout(() => {
        setBreathPhase('hold')
        setTimeout(() => {
          setBreathPhase('exhale')
          c++; setBreathCount(c)
          setTimeout(() => { if (c < 5) next(); else setBreathPhase('done') }, 6000)
        }, 4000)
      }, 4000)
    }
    next()
  }

  async function analyzeJournal() {
    if (!journal.trim()) return
    setLoading(true); setAiJournalInsight('')
    try {
      const r = await callAI('You are a compassionate mental wellness guide. Read this journal entry and provide: 1) Key emotions detected, 2) Positive aspects to acknowledge, 3) Gentle reflection question, 4) One small actionable step. Warm and supportive. Under 120 words.', journal)
      setAiJournalInsight(r)
    } catch { setAiJournalInsight('Could not analyze.') }
    setLoading(false)
  }

  function saveJournal() {
    if (!journal.trim()) return
    const entry = { text: journal, date: new Date().toLocaleDateString('en-IN'), time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }
    const updated = [entry, ...savedJournals.slice(0, 29)]
    setSavedJournals(updated)
    localStorage.setItem('gv_journal', JSON.stringify(updated))
    setJournal('')
    setAiJournalInsight('')
    alert('Journal entry saved!')
  }

  const bConfig = { idle: { text: 'Tap to begin', scale: 1, c: 'rgba(139,92,246,0.3)' }, inhale: { text: 'Breathe IN... (4s)', scale: 1.4, c: 'rgba(139,92,246,0.75)' }, hold: { text: 'Hold... (4s)', scale: 1.4, c: 'rgba(139,92,246,0.5)' }, exhale: { text: 'Breathe OUT... (6s)', scale: 0.75, c: 'rgba(139,92,246,0.25)' }, done: { text: '✓ Complete!', scale: 1, c: 'rgba(110,231,183,0.6)' } }
  const bc = bConfig[breathPhase]

  const MOODS = [{ e: '😁', l: 'Very happy' }, { e: '😊', l: 'Good' }, { e: '😐', l: 'Okay' }, { e: '😔', l: 'Sad' }, { e: '😰', l: 'Anxious' }, { e: '😤', l: 'Angry' }, { e: '😴', l: 'Tired' }, { e: '😶', l: 'Numb' }]

  return (
    <div className="page-overlay" style={{ background: '#0a0714' }}>
      <BgBlobs g={false} p />
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', zIndex: 1 }}>
        {/* Top bar */}
        <div style={{ padding: '14px 20px', borderBottom: '0.5px solid rgba(139,92,246,0.15)', background: 'rgba(10,7,20,0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '7px 13px', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>← Back</button>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, animation: 'glowPurple 3s ease infinite' }}>🧠</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#c4b5fd' }}>Mental Wellness</div>
            <div style={{ fontSize: 10, color: 'rgba(196,181,253,0.45)' }}>Private · Safe · Judgment-free</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            {Object.entries(LANGS).slice(0, 4).map(([k, v]) => (
              <button key={k} onClick={() => setLang(k)} className={`tab-pill${lang === k ? ' tab-p' : ''}`} style={{ fontSize: 10, padding: '4px 9px' }}>{v}</button>
            ))}
          </div>
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', gap: 4, padding: '10px 16px', overflowX: 'auto', borderBottom: '0.5px solid rgba(139,92,246,0.08)', flexShrink: 0, background: 'rgba(10,7,20,0.7)' }}>
          {navPages.map(p => (
            <button key={p.id} onClick={() => setPage(p.id)} className={`tab-pill${page === p.id ? ' tab-p' : ''}`} style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{p.icon} {p.label}</button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

          {/* CHAT */}
          {page === 'chat' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages.map((m, i) => (
                  <div key={i} className={m.role === 'user' ? 'msg-p' : 'msg-ai'} style={{ animation: 'fadeIn 0.3s ease' }}>
                    {m.loading ? <Loader color="p" /> : m.text}
                  </div>
                ))}
                <div ref={chatEnd} />
              </div>
              {messages.length < 3 && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>What's on your mind?</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['I feel very anxious today', 'I cannot sleep at night', 'I feel lonely and sad', 'Too much stress at work', 'I had a panic attack', 'I need to talk to someone'].map(q => (
                      <button key={q} className="chip" onClick={() => send(q)}>{q}</button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* MOOD */}
          {page === 'mood' && (
            <div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 16, textAlign: 'center' }}>How are you feeling right now?</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                {MOODS.map(m => (
                  <button key={m.l} onClick={() => checkMood(m.l)} style={{ padding: '14px 16px', borderRadius: 14, background: mood === m.l ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)', border: `0.5px solid ${mood === m.l ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer', transition: 'all 0.2s', transform: mood === m.l ? 'scale(1.1)' : 'scale(1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 28 }}>{m.e}</span>
                    <span style={{ fontSize: 11, color: mood === m.l ? '#c4b5fd' : 'rgba(255,255,255,0.4)' }}>{m.l}</span>
                  </button>
                ))}
              </div>
              {loading && <div style={{ textAlign: 'center' }}><Loader color="p" /></div>}
              {moodResult && (
                <div className="fade-in glass-p" style={{ borderRadius: 16, padding: '16px 18px', marginBottom: 14 }}>
                  <div style={{ fontSize: 13, lineHeight: 1.8, color: '#ddd6fe' }}>{moodResult}</div>
                </div>
              )}
              {/* Weekly mood chart */}
              <div className="glass" style={{ borderRadius: 16, padding: '16px', marginTop: 8 }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>This week's mood</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 60 }}>
                  {[['M','😊',80],['T','😴',40],['W','😰',30],['T','😊',75],['F','😔',50],['S','😊',85],['S','🌟',95]].map(([d, e, h]) => (
                    <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 14 }}>{e}</span>
                      <div style={{ width: '100%', height: `${h * 0.45}px`, background: `rgba(139,92,246,${h / 150 + 0.15})`, borderRadius: 4 }} />
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BREATHE */}
          {page === 'breathe' && (
            <div style={{ textAlign: 'center', paddingTop: 10 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>4-4-6 Breathing Technique</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginBottom: 32 }}>Inhale 4s · Hold 4s · Exhale 6s · 5 cycles</div>
              <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 28px', cursor: breathPhase === 'idle' ? 'pointer' : 'default' }} onClick={() => breathPhase === 'idle' && startBreath()}>
                {[40, 20, 0].map((inset, i) => (
                  <div key={i} style={{ position: 'absolute', inset, borderRadius: '50%', border: `0.5px solid ${bc.c}`, opacity: 1 - i * 0.25, transition: 'all 1.8s ease', transform: `scale(${breathPhase !== 'idle' ? bc.scale * (1 - i * 0.08) : 1})` }} />
                ))}
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(circle, ${bc.c} 0%, transparent 70%)`, transition: 'all 1.8s ease' }}>
                  <div style={{ fontSize: 36, marginBottom: 6 }}>🫁</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{bc.text}</div>
                  {breathCount > 0 && <div style={{ fontSize: 11, color: 'rgba(196,181,253,0.5)', marginTop: 4 }}>{breathCount}/5 cycles</div>}
                </div>
              </div>
              {breathPhase === 'idle' && <button className="btn-p" onClick={startBreath} style={{ padding: '12px 32px', marginBottom: 16 }}>Begin Breathing</button>}
              {breathPhase === 'done' && (
                <div>
                  <div style={{ fontSize: 14, color: '#6ee7b7', marginBottom: 14 }}>🎉 Excellent! You completed 5 cycles.</div>
                  <button className="btn-p" onClick={() => { setBreathPhase('idle'); setBreathCount(0) }}>Do again</button>
                </div>
              )}
              <div style={{ marginTop: 24, padding: '14px', background: 'rgba(139,92,246,0.06)', border: '0.5px solid rgba(139,92,246,0.15)', borderRadius: 14, fontSize: 12, color: 'rgba(196,181,253,0.6)', lineHeight: 1.7 }}>
                💡 Box breathing activates your parasympathetic nervous system — reducing cortisol and calming anxiety within minutes.
              </div>
              {/* Other techniques */}
              <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, textAlign: 'left' }}>
                {[['🌊 Ocean breathing', '3-3-3 pattern, for quick calm'], ['🕯️ Candle breath', 'Long slow exhale, for sleep'], ['👃 Alternate nostril', 'Ancient pranayama technique'], ['🫶 Heart coherence', '5s in, 5s out, for stress']].map(([t, d]) => (
                  <div key={t} className="glass" style={{ borderRadius: 12, padding: '12px', cursor: 'pointer' }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#c4b5fd', marginBottom: 4 }}>{t}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* JOURNAL */}
          {page === 'journal' && (
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>Write freely — your entries are saved only on this device</div>
              <textarea className="input-f input-fp" value={journal} onChange={e => setJournal(e.target.value)} placeholder="How are you feeling today? What's on your mind? Write anything..." rows={7} style={{ marginBottom: 10, resize: 'none' }} />
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <button className="btn-p" onClick={analyzeJournal} disabled={loading || !journal.trim()} style={{ flex: 1 }}>
                  {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner />Analyzing...</span> : '🤖 AI Insight'}
                </button>
                <button className="btn-outline" onClick={saveJournal} disabled={!journal.trim()} style={{ flex: 1 }}>💾 Save Entry</button>
              </div>
              {aiJournalInsight && (
                <div className="fade-in glass-p" style={{ borderRadius: 16, padding: '16px 18px', marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: 'rgba(196,181,253,0.5)', marginBottom: 8 }}>AI Reflection</div>
                  <div style={{ fontSize: 13, lineHeight: 1.8, color: '#ddd6fe' }}>{aiJournalInsight}</div>
                </div>
              )}
              {savedJournals.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>Previous entries</div>
                  {savedJournals.slice(0, 5).map((j, i) => (
                    <div key={i} className="glass" style={{ borderRadius: 12, padding: '12px 14px', marginBottom: 8 }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 5 }}>{j.date} · {j.time}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{j.text.slice(0, 120)}{j.text.length > 120 ? '...' : ''}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MEDITATE */}
          {page === 'meditate' && <MeditatePage />}

          {/* RESOURCES */}
          {page === 'resources' && (
            <div>
              <div style={{ padding: '14px 16px', background: 'rgba(139,92,246,0.06)', border: '0.5px solid rgba(139,92,246,0.15)', borderRadius: 14, fontSize: 12, color: 'rgba(196,181,253,0.6)', lineHeight: 1.7, marginBottom: 16 }}>
                🔒 All conversations in this app are completely private. Seeking help is a sign of strength, not weakness.
              </div>
              {[['iCall — TISS', '9152987821', 'Mon–Sat 8am–10pm', 'Free counseling by trained professionals'],['Vandrevala Foundation', '1860-2662-345', '24/7 helpline', 'Crisis support in multiple languages'],['NIMHANS', '080-46110007', '24/7', 'National mental health helpline'],['Snehi', '044-24640050', 'Mon–Sat 8am–10pm', 'Emotional support helpline'],['iCall WhatsApp', '9152987821', 'Chat support', 'Message on WhatsApp for text support']].map(([n, ph, t, d]) => (
                <div key={n} className="glass-p card-hover" style={{ borderRadius: 14, padding: '14px 16px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#c4b5fd' }}>{n}</div>
                    <span style={{ fontSize: 10, color: 'rgba(196,181,253,0.4)', textAlign: 'right' }}>{t}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>{d}</div>
                  <button onClick={() => alert(`Calling ${n}: ${ph}`)} style={{ padding: '7px 18px', background: 'rgba(139,92,246,0.15)', border: '0.5px solid rgba(139,92,246,0.3)', borderRadius: 20, color: '#c4b5fd', fontSize: 12, cursor: 'pointer' }}>📞 {ph}</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat input */}
        {page === 'chat' && (
          <div style={{ padding: '12px 20px 18px', borderTop: '0.5px solid rgba(139,92,246,0.1)', background: 'rgba(10,7,20,0.9)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <MicButton recording={recording} onToggle={toggle} color="p" />
              <input className="input-f input-fp" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Share what's on your mind..." style={{ flex: 1 }} />
              <button className="btn-p" onClick={() => send()} disabled={loading || !input.trim()} style={{ padding: '11px 16px' }}>➤</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Meditate Page ── */
function MeditatePage() {
  const [playing, setPlaying] = useState(null)
  const [timer, setTimer] = useState(0)
  const timerRef = useRef(null)
  const sessions = [
    { id: 'calm', title: 'Morning Calm', desc: '5 min guided meditation to start your day', duration: 300, color: 'rgba(29,158,117,0.2)', icon: '🌅' },
    { id: 'stress', title: 'Stress Relief', desc: '8 min body scan to release tension', duration: 480, color: 'rgba(139,92,246,0.2)', icon: '🌊' },
    { id: 'sleep', title: 'Sleep Meditation', desc: '10 min to ease into restful sleep', duration: 600, color: 'rgba(59,130,246,0.2)', icon: '🌙' },
    { id: 'focus', title: 'Focus & Clarity', desc: '5 min mindfulness for better concentration', duration: 300, color: 'rgba(251,191,36,0.15)', icon: '🎯' },
  ]
  function startSession(s) {
    if (playing === s.id) { clearInterval(timerRef.current); setPlaying(null); setTimer(0); return }
    setPlaying(s.id); setTimer(s.duration)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setTimer(t => { if (t <= 1) { clearInterval(timerRef.current); setPlaying(null); return 0 } return t - 1 }), 1000)
  }
  useEffect(() => () => clearInterval(timerRef.current), [])
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Choose a guided meditation session</div>
      {sessions.map(s => (
        <div key={s.id} className="card-hover" onClick={() => startSession(s)} style={{ padding: '16px 18px', background: playing === s.id ? s.color : 'rgba(255,255,255,0.03)', border: `0.5px solid ${playing === s.id ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, marginBottom: 12, cursor: 'pointer', transition: 'all 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 28, width: 52, height: 52, borderRadius: 14, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: playing === s.id ? 'pulse 2s ease infinite' : 'none' }}>{s.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e4e8f0', marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.desc}</div>
            </div>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              {playing === s.id ? (
                <>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#c4b5fd', fontFamily: 'monospace' }}>{fmt(timer)}</div>
                  <div style={{ fontSize: 10, color: 'rgba(196,181,253,0.5)' }}>tap to stop</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{Math.floor(s.duration / 60)} min</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>tap to start</div>
                </>
              )}
            </div>
          </div>
          {playing === s.id && (
            <div style={{ marginTop: 12, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg,#8b5cf6,#c4b5fd)', borderRadius: 2, width: `${((s.duration - timer) / s.duration) * 100}%`, transition: 'width 1s linear' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════
   LOGIN PAGE
══════════════════════════════════ */
function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function submit() {
    if (!form.email || !form.password) { setErr('Please fill all fields'); return }
    setLoading(true); setErr('')
    await new Promise(r => setTimeout(r, 1400))
    onLogin({ name: form.name || form.email.split('@')[0], email: form.email })
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: 20 }}>
      <BgBlobs />
      <Particles n={22} />
      <div style={{ position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)', fontSize: 11, letterSpacing: 4, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }} className="fade-in">Gram Vaidya</div>

      <div style={{ width: '100%', maxWidth: 430, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div className="fade-in d1" style={{ textAlign: 'center', marginBottom: 0, position: 'relative', zIndex: 2 }}>
          <div style={{ width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', animation: 'pulse 4s ease infinite' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#1D9E75,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, animation: 'glowGreen 3s ease infinite' }}>⚕</div>
          </div>
        </div>

        <div className="glass fade-in d2" style={{ borderRadius: 28, padding: '48px 34px 34px', marginTop: -30, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1.5, background: 'linear-gradient(90deg,transparent,rgba(29,158,117,0.7),rgba(139,92,246,0.7),transparent)', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite' }} />
          <div className="fade-in d3" style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 300, marginBottom: 8, lineHeight: 1.2 }}>{mode === 'login' ? 'Welcome back' : 'Join Gram Vaidya'}</h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>AI healthcare & mental wellness for every Indian village</p>
          </div>

          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, marginBottom: 22 }} className="fade-in d3">
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setErr('') }} style={{ flex: 1, padding: '9px 0', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 500, background: mode === m ? 'rgba(29,158,117,0.2)' : 'transparent', color: mode === m ? '#6ee7b7' : 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'all 0.3s' }}>
                {m === 'login' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} className="fade-in d4">
            {mode === 'signup' && <input className="input-f" placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />}
            <input className="input-f" type="email" placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <input className="input-f" type="password" placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} onKeyDown={e => e.key === 'Enter' && submit()} />
            {mode === 'signup' && <input className="input-f" placeholder="Mobile (+91...)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />}
          </div>
          {err && <p style={{ fontSize: 12, color: '#f87171', marginTop: 8, textAlign: 'center' }}>{err}</p>}

          <button className="btn-g fade-in d5" onClick={submit} disabled={loading} style={{ width: '100%', marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? <><Spinner />Please wait...</> : (mode === 'login' ? 'Sign in →' : 'Create account →')}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }} className="fade-in d5">
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>or</span>
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <div style={{ display: 'flex', gap: 8 }} className="fade-in d6">
            {[['📱', 'Phone OTP'], ['👤', 'Guest demo'], ['🌐', 'Google']].map(([icon, label]) => (
              <button key={label} onClick={() => onLogin({ name: label === 'Guest demo' ? 'Demo User' : 'Visitor', email: 'demo@gramvaidya.in' })} style={{ flex: 1, padding: '10px 0', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 500, transition: 'all 0.2s', cursor: 'pointer' }}>
                {icon} {label}
              </button>
            ))}
          </div>
          <p className="fade-in d7" style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)', textAlign: 'center', marginTop: 18, lineHeight: 1.6 }}>Free forever · 8 Indian languages · Private & secure</p>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════
   DASHBOARD
══════════════════════════════════ */
function Dashboard({ user, onLogout }) {
  const [open, setOpen] = useState(null)
  const [time, setTime] = useState(new Date())
  const hour = time.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  if (open === 'doctor') return <VillageDoctor onBack={() => setOpen(null)} />
  if (open === 'mental') return <MentalHealth onBack={() => setOpen(null)} />
  if (open === 'scanner') return <MedicineScanner onBack={() => setOpen(null)} />
  if (open === 'translator') return <VoiceTranslator onBack={() => setOpen(null)} />
  if (open === 'tracker') return <HealthTracker onBack={() => setOpen(null)} />

  const tools = [
    { id: 'scanner', icon: '📷', title: 'Medicine Scanner', desc: 'AI photo recognition', color: 'rgba(59,130,246,0.15)', bc: 'rgba(59,130,246,0.3)', tc: '#93c5fd' },
    { id: 'translator', icon: '🌐', title: 'Voice Translator', desc: '8 Indian languages', color: 'rgba(251,191,36,0.1)', bc: 'rgba(251,191,36,0.25)', tc: '#fcd34d' },
    { id: 'tracker', icon: '📊', title: 'Health Tracker', desc: 'Track your vitals', color: 'rgba(239,68,68,0.1)', bc: 'rgba(239,68,68,0.25)', tc: '#fca5a5' },
    { id: 'doctor', icon: '🩺', title: 'First Aid Guide', desc: '12 emergency guides', color: 'rgba(29,158,117,0.12)', bc: 'rgba(29,158,117,0.25)', tc: '#6ee7b7' },
  ]

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: '#07090f' }}>
      <BgBlobs />
      <Particles n={14} />

      {/* Nav */}
      <nav className="fade-in" style={{ position: 'sticky', top: 0, zIndex: 50, height: 62, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, borderBottom: '0.5px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)', background: 'rgba(7,9,15,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#1D9E75,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⚕</div>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 300 }}>Gram Vaidya</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1D9E75', animation: 'pulse 2s ease infinite' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>AI Online</span>
          </div>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(29,158,117,0.3),rgba(139,92,246,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, border: '0.5px solid rgba(255,255,255,0.08)' }}>{user.name.charAt(0).toUpperCase()}</div>
          <button onClick={onLogout} style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 20, color: 'rgba(255,255,255,0.35)', fontSize: 11, cursor: 'pointer' }}>Sign out</button>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1060, margin: '0 auto', padding: '40px 22px 60px' }}>
        {/* Greeting */}
        <div className="fade-in d1" style={{ marginBottom: 44 }}>
          <p style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 8 }}>{greeting}</p>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(26px,4.5vw,46px)', fontWeight: 300, lineHeight: 1.15, marginBottom: 12 }}>
            Hello, <span style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#6ee7b7,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user.name}</span>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', maxWidth: 480, lineHeight: 1.65 }}>Your complete AI health companion — village doctor, mental wellness, medicine scanner, and more. All in 8 Indian languages.</p>
        </div>

        {/* Main two sections */}
        <div className="dash-grid" style={{ display: 'flex', gap: 18, marginBottom: 20 }}>
          {/* Village Doctor */}
          <div className="glass-g card-hover slide-left d2" onClick={() => setOpen('doctor')} style={{ flex: 1, borderRadius: 26, padding: '26px 28px', cursor: 'pointer', minWidth: 280, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '0.5px', background: 'linear-gradient(90deg,transparent,rgba(29,158,117,0.8),transparent)' }} />
            {/* ECG animation */}
            <div style={{ marginBottom: 18, overflow: 'hidden' }}>
              <svg width="100%" height="44" viewBox="0 0 320 44" preserveAspectRatio="none">
                <polyline style={{ strokeDasharray: 600, strokeDashoffset: 600, animation: 'drawECG 2.5s ease forwards 0.5s' }} fill="none" stroke="rgba(29,158,117,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  points="0,22 30,22 42,8 50,36 58,4 66,40 74,22 110,22 122,8 130,36 138,4 146,40 154,22 190,22 202,8 210,36 218,4 226,40 234,22 280,22 292,8 300,36 308,4 316,40 320,22" />
              </svg>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ width: 54, height: 54, borderRadius: 16, background: 'linear-gradient(135deg,rgba(29,158,117,0.35),rgba(29,158,117,0.12))', border: '0.5px solid rgba(29,158,117,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, animation: 'heartbeat 3s ease infinite' }}>🌿</div>
              <span className="badge badge-g">● Live AI</span>
            </div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, lineHeight: 1.15, marginBottom: 8 }}>Village<br /><em style={{ color: '#6ee7b7' }}>Doctor</em></h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.65, marginBottom: 18 }}>AI diagnosis, symptom checker, medicine guide, first aid, emergency SOS — all in your language.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
              {['💬 AI Chat', '🔍 Symptoms', '💊 Medicines', '🩹 First Aid', '🆘 Emergency'].map(f => <span key={f} className="badge badge-g">{f}</span>)}
            </div>
            <button className="btn-g" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>Open Village Doctor →</button>
          </div>

          {/* Mental Health */}
          <div className="glass-p card-hover slide-right d3" onClick={() => setOpen('mental')} style={{ flex: 1, borderRadius: 26, padding: '26px 28px', cursor: 'pointer', minWidth: 280, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '0.5px', background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.8),transparent)' }} />
            {/* Breathing animation */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 18 }}>
              <div style={{ position: 'relative', width: 44, height: 44 }}>
                {[0, 1, 2].map(i => <div key={i} style={{ position: 'absolute', inset: -i * 8, borderRadius: '50%', border: `0.5px solid rgba(139,92,246,${0.6 - i * 0.18})`, animation: `breatheIn ${3 + i}s ease-in-out infinite alternate`, animationDelay: `${i * 0.4}s` }} />)}
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧠</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ width: 54, height: 54, borderRadius: 16, background: 'linear-gradient(135deg,rgba(139,92,246,0.35),rgba(139,92,246,0.12))', border: '0.5px solid rgba(139,92,246,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, animation: 'glowPurple 3s ease infinite' }}>💜</div>
              <span className="badge badge-p">Private</span>
            </div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, lineHeight: 1.15, marginBottom: 8 }}>Mental<br /><em style={{ color: '#c4b5fd' }}>Wellness</em></h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.65, marginBottom: 18 }}>A safe space to talk, track mood, practice breathing, journal your thoughts, and meditate.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
              {['💬 AI Talk', '🌈 Mood', '🫁 Breathe', '📖 Journal', '🧘 Meditate'].map(f => <span key={f} className="badge badge-p">{f}</span>)}
            </div>
            <button className="btn-p" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>Open Mental Wellness →</button>
          </div>
        </div>

        {/* AI Tools grid */}
        <div className="fade-in d4" style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 14 }}>AI Tools</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {tools.map((t, i) => (
              <div key={t.id} className={`glass card-hover fade-in d${i + 4}`} onClick={() => setOpen(t.id)} style={{ borderRadius: 18, padding: '18px 20px', cursor: 'pointer', border: `0.5px solid ${t.bc}`, background: t.color }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{t.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.tc, marginBottom: 4 }}>{t.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

/* ── Root ── */
export default function App() {
  const [user, setUser] = useState(null)
  return user ? <Dashboard user={user} onLogout={() => setUser(null)} /> : <Login onLogin={setUser} />
}
