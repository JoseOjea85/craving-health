import { useState, useEffect, useRef, useCallback } from 'react';
import { Flame, Plus, X, Check, Brain, Heart, Phone, User, Home, Activity, ChevronRight, Loader2, Camera, Play, Pause, Trophy, LogOut, BookOpen, Star } from 'lucide-react';
import { format, subDays, differenceInDays } from 'date-fns';
import { supabase } from './supabase';

const C = {
  bg: '#0d0d14', card: '#13131f', border: '#1e1e30',
  primary: '#7c5cfc', cyan: '#22d3ee', orange: '#fb923c',
  green: '#4ade80', red: '#f87171', text: '#f0f0ff', muted: '#6b6b8a',
};


const MANTRAS = [
  "Algún día contarás la historia de cómo saliste adelante.",
  "Un día a la vez. Hoy es suficiente.",
  "Eres más fuerte que el impulso que sientes ahora.",
  "La recuperación no es una línea recta. Sigue.",
  "Cada momento de resistencia es una victoria.",
  "Tu historia no ha terminado. Sigue escribiéndola.",
  "El craving pasa. Tú te quedas.",
  "No estás solo. Nunca lo has estado.",
  "Hoy eliges tu futuro.",
  "La fuerza que buscas ya está en ti.",
];

function CravingModal({ onSave, onClose }) {
  const [intensity, setIntensity] = useState(5);
  const [saving, setSaving] = useState(false);
  const submit = async (resisted) => {
    setSaving(true);
    await onSave({ intensity, resisted });
    setSaving(false);
    onClose();
  };
  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)', zIndex:40 }} />
      <div style={{ position:'fixed', left:0, right:0, bottom:0, zIndex:50, background:C.card, borderTop:`1px solid ${C.border}`, borderRadius:'24px 24px 0 0', padding:'24px 24px 48px', maxWidth:480, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h2 style={{ color:C.text, fontSize:18, fontWeight:700, margin:0 }}>Registrar craving</h2>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:'50%', background:C.border, border:'none', cursor:'pointer', color:C.text, display:'flex', alignItems:'center', justifyContent:'center' }}><X size={16} /></button>
        </div>
        <p style={{ color:C.muted, fontSize:13, marginBottom:20 }}>Intensidad del craving</p>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:32 }}>
          <button onClick={() => setIntensity(i => Math.max(1, i-1))} style={{ width:48, height:48, borderRadius:'50%', background:C.border, border:'none', color:C.text, fontSize:22, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>-</button>
          <div style={{ flex:1, textAlign:'center' }}>
            <div style={{ fontSize:52, fontWeight:900, color: intensity > 7 ? C.red : intensity > 4 ? C.orange : C.green }}>{intensity}</div>
            <div style={{ fontSize:12, color:C.muted }}>de 10</div>
          </div>
          <button onClick={() => setIntensity(i => Math.min(10, i+1))} style={{ width:48, height:48, borderRadius:'50%', background:C.border, border:'none', color:C.text, fontSize:22, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <button onClick={() => submit(true)} disabled={saving} style={{ flex:1, padding:'14px 0', borderRadius:14, background:`linear-gradient(135deg, ${C.green}, #22d3ee)`, border:'none', color:'#fff', fontWeight:700, fontSize:15, cursor:'pointer' }}>
            ✓ Lo resistí
          </button>
          <button onClick={() => submit(false)} disabled={saving} style={{ flex:1, padding:'14px 0', borderRadius:14, background:C.border, border:'none', color:C.muted, fontWeight:700, fontSize:15, cursor:'pointer' }}>
            Cedí
          </button>
        </div>
      </div>
    </>
  );
}
const WORKOUT_ICONS = { caminar:'🚶', correr:'🏃', gimnasio:'🏋️', yoga:'🧘', ciclismo:'🚴', otro:'⚡' };

const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 12, background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 14, outline: 'none', marginBottom: 12 };

// ─── AUTH PAGE ────────────────────────────────────────────────
function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async () => {
    setError(''); setMsg(''); setLoading(true);
    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuth(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          await supabase.from('profiles').upsert({ id: data.user.id, name });
          setMsg('¡Cuenta creada! Revisa tu email para confirmar.');
        }
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { background: ${C.bg}; } input::placeholder { color: ${C.muted}; }`}</style>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💙</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: C.text }}>Craving Health</h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>Tu camino hacia una vida mejor</p>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 28 }}>
          <div style={{ display: 'flex', background: C.bg, borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {['login','register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }} style={{ flex: 1, padding: '10px 0', borderRadius: 10, background: mode === m ? C.primary : 'none', border: 'none', color: mode === m ? '#fff' : C.muted, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                {m === 'login' ? 'Entrar' : 'Registrarse'}
              </button>
            ))}
          </div>

          {mode === 'register' && (
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" style={inputStyle} />
          )}
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" style={inputStyle} />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" type="password" style={{ ...inputStyle, marginBottom: 20 }} />

          {error && <p style={{ color: C.red, fontSize: 12, marginBottom: 12, textAlign: 'center' }}>{error}</p>}
          {msg && <p style={{ color: C.green, fontSize: 12, marginBottom: 12, textAlign: 'center' }}>{msg}</p>}

          <button onClick={submit} disabled={loading} style={{ width: '100%', padding: '14px 0', borderRadius: 14, background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`, border: 'none', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? <Loader2 size={18} /> : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────
function BottomNav({ page, setPage }) {
  const items = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'actividad', icon: Activity, label: 'Actividad' },
    { id: 'diario', icon: BookOpen, label: 'Diario' },
    { id: 'apoyo', icon: Heart, label: 'Apoyo' },
    { id: 'perfil', icon: User, label: 'Perfil' },
  ];
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.card, borderTop: `1px solid ${C.border}`, display: 'flex', zIndex: 30 }}>
      {items.map(({ id, icon: Icon, label }) => (
        <button key={id} onClick={() => setPage(id)} style={{ flex: 1, padding: '10px 0 8px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: page === id ? C.primary : C.muted }}>
          <Icon size={20} />
          <span style={{ fontSize: 10, fontWeight: page === id ? 600 : 400 }}>{label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── PULSE CIRCLE ─────────────────────────────────────────────
function PulseCircle({ onSOS }) {
  const [bpm, setBpm] = useState(62);
  const [scale, setScale] = useState(1);
  const bpmRef = useRef(62);

  useEffect(() => {
    const t = setInterval(() => {
      const delta = (Math.random() - 0.5) * 4;
      const next = Math.min(110, Math.max(52, bpmRef.current + delta));
      bpmRef.current = next;
      setBpm(Math.round(next));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const interval = 60000 / bpm;
    const beat = () => {
      setScale(1.18);
      setTimeout(() => setScale(1.06), 100);
      setTimeout(() => setScale(1.13), 180);
      setTimeout(() => setScale(1), 320);
    };
    beat();
    const t = setInterval(beat, interval);
    return () => clearInterval(t);
  }, [bpm]);

  const danger = bpm > 90;
  const color = danger ? C.red : bpm > 75 ? C.orange : C.primary;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
      <button onClick={onSOS} style={{ width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle at 40% 35%, ${color}35, ${color}10)`, border: `2.5px solid ${color}60`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${scale})`, transition: 'transform 0.1s ease', boxShadow: `0 0 ${danger ? 40 : 20}px ${color}30`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: `1px solid ${color}25`, animation: 'pulseRing 1.5s ease-out infinite' }} />
        <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: `1px solid ${color}12`, animation: 'pulseRing 1.5s ease-out infinite 0.4s' }} />
        <svg width="38" height="34" viewBox="0 0 38 34" fill="none" style={{ marginBottom: 6 }}>
          <path d="M19 31C19 31 2 20 2 10C2 5.58 5.58 2 10 2C13.5 2 16.5 4 19 7C21.5 4 24.5 2 28 2C32.42 2 36 5.58 36 10C36 20 19 31 19 31Z" fill={color} fillOpacity="0.85" />
        </svg>
        <div style={{ fontSize: 22, fontWeight: 900, color: C.text, lineHeight: 1 }}>{bpm}</div>
        <div style={{ fontSize: 10, color: C.muted, marginTop: 2, letterSpacing: '0.1em' }}>BPM</div>
      </button>
      <div style={{ marginTop: 10, fontSize: 11, color: danger ? C.red : C.muted, fontWeight: danger ? 700 : 400, letterSpacing: '0.1em' }}>
        {danger ? '⚠️ PULSO ELEVADO · TOCA PARA AYUDA' : 'TOCA SI ESTÁS EN RIESGO'}
      </div>
      <style>{`@keyframes pulseRing { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.5); opacity: 0; } }`}</style>
    </div>
  );
}

// ─── BREATHING ────────────────────────────────────────────────
function BreathingExercise({ onDone }) {
  const phases = [{ label: 'Inhala', duration: 4 }, { label: 'Retén', duration: 7 }, { label: 'Exhala', duration: 8 }];
  const [cycle, setCycle] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(phases[0].duration);
  const totalCycles = 3;
  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          const nextPhase = (phaseIdx + 1) % phases.length;
          if (nextPhase === 0) {
            const nextCycle = cycle + 1;
            if (nextCycle >= totalCycles) { clearInterval(t); setTimeout(onDone, 500); return 0; }
            setCycle(nextCycle);
          }
          setPhaseIdx(nextPhase);
          return phases[nextPhase].duration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phaseIdx, cycle]);
  const progress = 1 - timeLeft / phases[phaseIdx].duration;
  const size = 180, r = 80, circ = 2 * Math.PI * r;
  return (
    <div style={{ textAlign: 'center', color: C.text }}>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 8 }}>Ciclo {cycle + 1} de {totalCycles}</p>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 32 }}>Respiración 4-7-8</h2>
      <svg width={size} height={size} style={{ marginBottom: 24 }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={6} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.primary} strokeWidth={6} strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: 'stroke-dashoffset 1s linear' }} />
        <text x={size/2} y={size/2 - 8} textAnchor="middle" fill={C.text} fontSize="36" fontWeight="800">{timeLeft}</text>
        <text x={size/2} y={size/2 + 20} textAnchor="middle" fill={C.primary} fontSize="14" fontWeight="600">{phases[phaseIdx].label}</text>
      </svg>
      <p style={{ color: C.muted, fontSize: 14 }}>Deja pasar el craving.</p>
    </div>
  );
}

// ─── SOS MODAL ────────────────────────────────────────────────
function SOSModal({ onClose, anchors, blackPhotos, contacts }) {
  const [phase, setPhase] = useState('sos');
  if (phase === 'breathe') return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.97)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <BreathingExercise onDone={() => setPhase('anchors')} />
      <button onClick={onClose} style={{ marginTop: 32, background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13 }}>Cerrar</button>
    </div>
  );
  if (phase === 'anchors') return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.97)', padding: '48px 24px 32px', overflowY: 'auto' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 8 }}>Tus motivos 💙</h2>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>Por esto luchas cada día</p>
        {anchors.length === 0 ? <p style={{ color: C.muted, textAlign: 'center', marginTop: 40, marginBottom: 40 }}>Añade fotos en Perfil → Anclaje emocional.</p>
          : <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {anchors.map((a, i) => <div key={i} style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '1' }}><img src={a} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>)}
            </div>}
        <button onClick={() => setPhase('black')} style={{ width: '100%', padding: '14px 0', borderRadius: 14, background: C.border, border: 'none', color: C.text, fontWeight: 600, cursor: 'pointer', marginBottom: 10 }}>Ver foto negra →</button>
        <button onClick={onClose} style={{ width: '100%', padding: '14px 0', borderRadius: 14, background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`, border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>✓ Ya pasó. Sigo adelante.</button>
      </div>
    </div>
  );
  if (phase === 'black') return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#000', padding: '48px 24px 32px', overflowY: 'auto' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Recuerda el daño 🖤</h2>
        <p style={{ color: '#555', fontSize: 13, marginBottom: 24 }}>Lo que no quieres volver a ser</p>
        {blackPhotos.length === 0 ? <p style={{ color: '#444', marginBottom: 32 }}>Añade fotos en Perfil → Foto negra.</p>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {blackPhotos.map((p, i) => <div key={i} style={{ borderRadius: 16, overflow: 'hidden' }}><img src={p} alt="" style={{ width: '100%', objectFit: 'cover', filter: 'grayscale(80%) contrast(1.2)' }} /></div>)}
            </div>}
        <button onClick={onClose} style={{ width: '100%', padding: '16px 0', borderRadius: 14, background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`, border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 16 }}>✓ Sigo adelante.</button>
      </div>
    </div>
  );
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 420, width: '100%', background: C.card, border: `2px solid ${C.red}40`, borderRadius: 28, padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🆘</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 8 }}>Momento de riesgo</h2>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>Tienes esto. Elige tu primer paso.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <button onClick={() => setPhase('breathe')} style={{ padding: '16px', borderRadius: 16, background: `${C.primary}20`, border: `1px solid ${C.primary}40`, color: C.text, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>🌬️ Respiración guiada</button>
          <button onClick={() => setPhase('anchors')} style={{ padding: '16px', borderRadius: 16, background: `${C.cyan}15`, border: `1px solid ${C.cyan}30`, color: C.text, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>💙 Ver mis motivos</button>
          <button onClick={() => setPhase('black')} style={{ padding: '16px', borderRadius: 16, background: '#111', border: '1px solid #333', color: '#aaa', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>🖤 Ver foto negra</button>
        </div>
        <p style={{ color: C.muted, fontSize: 11, letterSpacing: '0.15em', fontWeight: 600, marginBottom: 12 }}>LLAMAR AHORA</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {contacts.filter(c => c.name && c.phone).map((c, i) => (
            <a key={i} href={`tel:${c.phone.replace(/\s/g,'')}`} style={{ padding: '13px 16px', borderRadius: 14, background: `${C.green}15`, border: `1px solid ${C.green}30`, color: C.green, fontWeight: 600, fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Phone size={16} /> {c.name} — {c.phone}
            </a>
          ))}
          <a href="tel:717003717" style={{ padding: '13px 16px', borderRadius: 14, background: `${C.red}15`, border: `1px solid ${C.red}30`, color: C.red, fontWeight: 600, fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Phone size={16} /> Línea de crisis — 717 003 717
          </a>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 13, cursor: 'pointer' }}>Cerrar</button>
      </div>
    </div>
  );
}

// ─── PHOTO UPLOADER ───────────────────────────────────────────
function PhotoUploader({ photos, onAdd, onRemove, title, desc, dark }) {
  const inputRef = useRef();
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onAdd(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{desc}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {photos.map((p, i) => (
          <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 12, overflow: 'hidden', background: dark ? '#111' : C.card, border: `1px solid ${dark ? '#333' : C.border}` }}>
            <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: dark ? 'grayscale(60%)' : 'none' }} />
            <button onClick={() => onRemove(i)} style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>
        ))}
        {photos.length < 9 && (
          <button onClick={() => inputRef.current.click()} style={{ aspectRatio: '1', borderRadius: 12, border: `2px dashed ${dark ? '#333' : C.border}`, background: 'none', color: dark ? '#555' : C.muted, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 11 }}>
            <Camera size={20} /><span>Añadir</span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
    </div>
  );
}

// ─── WEEK CHART ───────────────────────────────────────────────
function WeekChart({ workouts, goal }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const key = format(date, 'yyyy-MM-dd');
    const minutes = workouts.filter(w => w.date === key).reduce((s, w) => s + w.minutes, 0);
    return { key, minutes, label: format(date, 'EEE').slice(0, 2).toUpperCase() };
  });
  const max = Math.max(goal * 1.5, ...days.map(d => d.minutes), 1);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: '12px 16px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ color: C.muted, fontSize: 11, letterSpacing: '0.2em', fontWeight: 600 }}>ESTA SEMANA</span>
        <span style={{ color: C.muted, fontSize: 11 }}>Meta: {goal} min/día</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
        {days.map((d) => {
          const height = Math.round((d.minutes / max) * 80);
          const isToday = d.key === format(new Date(), 'yyyy-MM-dd');
          const met = d.minutes >= goal;
          return (
            <div key={d.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', height: 80, display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: Math.round((goal / max) * 80), left: 0, right: 0, borderTop: `1px dashed ${C.primary}40` }} />
                <div style={{ width: '100%', height: Math.max(height, 3), borderRadius: 6, background: met ? `linear-gradient(to top, ${C.primary}, ${C.cyan})` : isToday ? `${C.primary}60` : C.border }} />
              </div>
              <span style={{ fontSize: 10, color: isToday ? C.primary : C.muted, fontWeight: isToday ? 700 : 400 }}>{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── LOG MODAL ────────────────────────────────────────────────
function LogModal({ onAdd, onClose }) {
  const [minutes, setMinutes] = useState(30);
  const [type, setType] = useState('caminar');
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    await onAdd({ date: format(new Date(), 'yyyy-MM-dd'), minutes: Number(minutes), type });
    setSaving(false);
    onClose();
  };
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 40 }} />
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50, background: C.card, borderTop: `1px solid ${C.border}`, borderRadius: '24px 24px 0 0', padding: '24px 24px 48px', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ color: C.text, fontSize: 18, fontWeight: 700, margin: 0 }}>Registrar actividad</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: C.border, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.text }}><X size={16} /></button>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ color: C.muted, fontSize: 11, letterSpacing: '0.2em', fontWeight: 600 }}>TIPO</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
            {Object.entries(WORKOUT_ICONS).map(([key, emoji]) => (
              <button key={key} onClick={() => setType(key)} style={{ padding: '12px 0', borderRadius: 14, border: `1px solid ${type === key ? C.primary : C.border}`, background: type === key ? `${C.primary}20` : `${C.border}40`, color: type === key ? C.primary : C.muted, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 20 }}>{emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'capitalize' }}>{key}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ color: C.muted, fontSize: 11, letterSpacing: '0.2em', fontWeight: 600 }}>MINUTOS</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
            <button onClick={() => setMinutes(m => Math.max(5, m - 5))} style={{ width: 48, height: 48, borderRadius: '50%', background: C.border, border: 'none', color: C.text, fontSize: 22, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <span style={{ fontSize: 52, fontWeight: 700, color: C.text }}>{minutes}</span>
              <span style={{ color: C.muted, marginLeft: 8 }}>min</span>
            </div>
            <button onClick={() => setMinutes(m => m + 5)} style={{ width: 48, height: 48, borderRadius: '50%', background: C.border, border: 'none', color: C.text, fontSize: 22, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </div>
        </div>
        <button onClick={submit} disabled={saving} style={{ width: '100%', padding: '16px 0', borderRadius: 16, background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`, border: 'none', cursor: 'pointer', color: '#fff', fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {saving ? <Loader2 size={20} /> : <Check size={20} />} Guardar
        </button>
      </div>
    </>
  );
}

// ─── PAGE: HOME ───────────────────────────────────────────────
function PageHome({ workouts, profile, setPage, onSOS, onCraving, sobrietyDays, diary, cravings }) {
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    supabase.rpc('get_user_count').then(({ data }) => setUserCount(data));
  }, []);
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayMin = workouts.filter(w => w.date === today).reduce((s, w) => s + w.minutes, 0);
  const streak = (() => {
    let count = 0, d = new Date();
    while (workouts.some(w => w.date === format(d, 'yyyy-MM-dd'))) { count++; d.setDate(d.getDate() - 1); }
    return count;
  })();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';
  return (
    <div style={{ padding: '48px 20px 100px', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: C.muted, fontSize: 13 }}>{greeting}{profile?.name ? `, ${profile.name}` : ''} 👋</p>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>Craving Health</h1>
      </div>
      {/* Mantra del dia */}
      <div style={{ background:`linear-gradient(135deg, ${C.primary}15, ${C.cyan}08)`, border:`1px solid ${C.primary}20`, borderRadius:16, padding:'14px 16px', marginBottom:16, textAlign:'center' }}>
        <p style={{ fontSize:13, color:C.text, fontStyle:'italic', lineHeight:1.5 }}>{MANTRAS[new Date().getDate() % MANTRAS.length]}</p>
      </div>
      <PulseCircle onSOS={onSOS} />
      <button onClick={onCraving} style={{ width:'100%', padding:'14px', borderRadius:16, background:`${C.orange}15`, border:`1px solid ${C.orange}30`, color:C.orange, fontSize:14, fontWeight:700, cursor:'pointer', marginBottom:16, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
        ⚡ Estoy sintiendo un craving ahora
      </button>
      {sobrietyDays > 0 && (
        <div style={{ background: `linear-gradient(135deg, ${C.green}20, ${C.cyan}10)`, border: `1px solid ${C.green}40`, borderRadius: 20, padding: '20px 24px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 40 }}>🏆</div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 900, color: C.green, lineHeight: 1 }}>{sobrietyDays}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>días en abstinencia</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: C.muted }}>Desde</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{format(new Date(profile.sobriety_date), 'dd/MM/yyyy')}</div>
          </div>
        </div>
      )}
      {!profile?.sobriety_date && (
        <button onClick={() => setPage('perfil')} style={{ width: '100%', padding: '14px', borderRadius: 16, background: C.card, border: `1px dashed ${C.green}40`, color: C.green, fontSize: 13, cursor: 'pointer', marginBottom: 16, fontWeight: 600 }}>
          🏆 Registra tu fecha de inicio →
        </button>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div style={{ background: `linear-gradient(135deg, ${C.primary}30, ${C.cyan}15)`, border: `1px solid ${C.primary}30`, borderRadius: 20, padding: 20 }}>
          <div style={{ fontSize: 36, fontWeight: 800 }}>{todayMin}<span style={{ fontSize: 14, color: C.muted, fontWeight: 400 }}> min</span></div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Actividad hoy</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(251,146,60,0.2), rgba(239,68,68,0.05))', border: '1px solid rgba(251,146,60,0.3)', borderRadius: 20, padding: 20 }}>
          <div style={{ fontSize: 36, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}><Flame size={28} color={C.orange} />{streak}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Días activo</div>
        </div>
      </div>
      <Achievements sobrietyDays={sobrietyDays || 0} workouts={workouts} diary={diary || []} />

      {/* Comunidad */}
      {userCount !== null && (
        <div style={{ background: `linear-gradient(135deg, ${C.primary}20, ${C.cyan}10)`, border: `1px solid ${C.primary}30`, borderRadius: 20, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 36 }}>🌍</div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.primary, lineHeight: 1 }}>{userCount}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{userCount === 1 ? 'persona en la comunidad' : 'personas en la comunidad'}</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 12, color: C.muted, textAlign: 'right', maxWidth: 100 }}>
            Nadie lucha solo
          </div>
        </div>
      )}

      <p style={{ color: C.muted, fontSize: 11, letterSpacing: '0.2em', fontWeight: 600, marginBottom: 12 }}>ACCESO RÁPIDO</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { icon: '🏃', title: 'Registrar actividad', sub: 'Añade tu ejercicio de hoy', page: 'actividad', color: C.primary },
          { icon: '🧘', title: 'Meditación matinal', sub: 'Empieza el día con calma', page: 'meditacion', color: C.cyan },
          { icon: '💙', title: 'Necesito apoyo', sub: 'Teléfonos y recursos', page: 'apoyo', color: C.green },
        ].map(item => (
          <button key={item.page} onClick={() => setPage(item.page)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', width: '100%', textAlign: 'left' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${item.color}15`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{item.title}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{item.sub}</div>
            </div>
            <ChevronRight size={16} color={C.muted} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE: ACTIVIDAD ──────────────────────────────────────────
function PageActividad({ workouts, onAdd }) {
  const [showLog, setShowLog] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayMin = workouts.filter(w => w.date === today).reduce((s, w) => s + w.minutes, 0);
  const totalMin = workouts.reduce((s, w) => s + w.minutes, 0);
  const streak = (() => {
    let count = 0, d = new Date();
    while (workouts.some(w => w.date === format(d, 'yyyy-MM-dd'))) { count++; d.setDate(d.getDate() - 1); }
    return count;
  })();
  return (
    <div style={{ padding: '48px 20px 100px', maxWidth: 480, margin: '0 auto' }}>
      {showLog && <LogModal onAdd={onAdd} onClose={() => setShowLog(false)} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Tu actividad</h1>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>El cuerpo cura. Muévete cada día.</p>
        </div>
        <button onClick={() => setShowLog(true)} style={{ width: 40, height: 40, borderRadius: '50%', background: `${C.primary}20`, border: `1px solid ${C.primary}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.primary }}>
          <Plus size={20} />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {[{ v: todayMin, l: 'Hoy (min)' }, { v: streak, l: 'Racha', icon: <Flame size={18} color={C.orange} /> }, { v: Math.round(totalMin / 60), l: 'Total (h)' }].map((s, i) => (
          <div key={i} style={{ background: i === 1 ? 'linear-gradient(135deg, rgba(251,146,60,0.15), rgba(239,68,68,0.05))' : C.card, border: `1px solid ${i === 1 ? 'rgba(251,146,60,0.25)' : C.border}`, borderRadius: 16, padding: '16px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>{s.icon}{s.v}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <WeekChart workouts={workouts} goal={30} />
      {workouts.filter(w => w.date === today).length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: C.muted, fontSize: 11, letterSpacing: '0.25em', fontWeight: 600, marginBottom: 12 }}>HOY</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {workouts.filter(w => w.date === today).map((w, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{WORKOUT_ICONS[w.type] || '⚡'}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}>{w.type}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{w.minutes} min</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <button onClick={() => setShowLog(true)} style={{ width: '100%', padding: '16px 0', borderRadius: 16, background: 'transparent', border: `2px dashed ${C.primary}30`, color: `${C.primary}90`, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Plus size={16} /> Registrar actividad
      </button>
    </div>
  );
}

// ─── PAGE: MEDITACIÓN ─────────────────────────────────────────

function BreathingCircle({ running }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setPhase(p => (p + 1) % 3), 2000);
    return () => clearInterval(t);
  }, [running]);
  const sizes = [80, 120, 100];
  const labels = ["Inhala", "Reten", "Exhala"];
  const size = sizes[phase];
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:160, marginBottom:16 }}>
      <div style={{ width:size, height:size, borderRadius:"50%", background:"radial-gradient(circle, #7c5cfc40, #22d3ee20)", border:"2px solid #7c5cfc60", transition:"all 1.8s ease-in-out", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 30px #7c5cfc30" }}>
        <span style={{ fontSize:12, color:"#7c5cfc", fontWeight:600 }}>{labels[phase]}</span>
      </div>
    </div>
  );
}
function CircularProgress({ seconds, totalSeconds }) {
  const size = 140, r = 60, circ = 2 * Math.PI * r;
  const progress = Math.min(seconds / totalSeconds, 1);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:160, marginBottom:16 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e1e30" strokeWidth={8} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#22d3ee" strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)}
          strokeLinecap="round" transform={"rotate(-90 " + size/2 + " " + size/2 + ")"}
          style={{ transition:"stroke-dashoffset 1s linear" }} />
        <text x={size/2} y={size/2 + 6} textAnchor="middle" fill="#22d3ee" fontSize="18" fontWeight="800">
          {Math.round(progress * 100)}%
        </text>
      </svg>
    </div>
  );
}
function MandalaGraphic({ running }) {
  const [rotation, setRotation] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setRotation(r => r + 1), 50);
    return () => clearInterval(t);
  }, [running]);
  const angles = [0,45,90,135,180,225,270,315];
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:160, marginBottom:16 }}>
      <svg width={140} height={140} style={{ transform:"rotate(" + rotation + "deg)" }}>
        {angles.map((angle, i) => (
          <g key={i} transform={"rotate(" + angle + " 70 70)"}>
            <ellipse cx={70} cy={35} rx={8} ry={20} fill={i % 2 === 0 ? "#7c5cfc80" : "#22d3ee40"} />
          </g>
        ))}
        <circle cx={70} cy={70} r={20} fill="#22d3ee30" stroke="#22d3ee" strokeWidth={2} />
        <circle cx={70} cy={70} r={8} fill="#7c5cfc" />
      </svg>
    </div>
  );
}
function WavesGraphic({ running }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(t);
  }, [running]);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:160, marginBottom:16 }}>
      <div style={{ position:"relative", width:140, height:140 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ position:"absolute", inset:i*18, borderRadius:"50%", border:"2px solid #4ade80", opacity:Math.max(0, 1-((tick*0.05+i*0.25)%1)), transition:"opacity 0.1s" }} />
        ))}
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32 }}>🌱</div>
      </div>
    </div>
  );
}
function HeartbeatGraphic({ running }) {
  const [beat, setBeat] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => { setBeat(true); setTimeout(() => setBeat(false), 200); }, 800);
    return () => clearInterval(t);
  }, [running]);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:160, marginBottom:16 }}>
      <div style={{ transform:"scale(" + (beat ? 1.3 : 1) + ")", transition:"transform 0.15s ease", fontSize:80, filter:"drop-shadow(0 0 " + (beat ? 20 : 8) + "px #f87171)" }}>💪</div>
    </div>
  );
}
function MeditationGraphic({ sessionId, seconds, running }) {
  const totalSeconds = [300, 600, 420, 180, 300][sessionId - 1] || 300;
  if (sessionId === 1) return <BreathingCircle running={running} />;
  if (sessionId === 2) return <CircularProgress seconds={seconds} totalSeconds={totalSeconds} />;
  if (sessionId === 3) return <MandalaGraphic running={running} />;
  if (sessionId === 4) return <WavesGraphic running={running} />;
  if (sessionId === 5) return <HeartbeatGraphic running={running} />;
  return null;
}
function PageMeditacion() {
  const [active, setActive] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  const sessions = [
    { id: 1, title: 'Respiración 4-7-8', duration: '5 min', emoji: '🌬️', desc: 'Inhala 4s, retén 7s, exhala 8s. Calma instantánea.' },
    { id: 2, title: 'Escaneo corporal', duration: '10 min', emoji: '🧘', desc: 'Recorre tu cuerpo soltando tensión de pies a cabeza.' },
    { id: 3, title: 'Visualización positiva', duration: '7 min', emoji: '🌅', desc: 'Imagina tu vida sin el tóxico. Vívela en tu mente.' },
    { id: 4, title: 'Gratitud matinal', duration: '3 min', emoji: '🌱', desc: 'Tres cosas por las que estás agradecido hoy.' },
    { id: 5, title: 'Mantra de fuerza', duration: '5 min', emoji: '💪', desc: 'Soy más fuerte que este impulso.' },
  ];
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  return (
    <div style={{ padding: '48px 20px 100px', maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Meditación</h1>
      <p style={{ fontSize: 12, color: C.muted, marginBottom: 24 }}>Cada mañana, 5 minutos cambian el día</p>
      {active ? (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 28, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{active.emoji}</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{active.title}</h2>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>{active.desc}</p>
          <MeditationGraphic sessionId={active.id} seconds={seconds} running={running} />
          <div style={{ fontSize: 52, fontWeight: 800, color: C.primary, marginBottom: 8 }}>{fmt(seconds)}</div>
          <p style={{ color: C.muted, fontSize: 12, marginBottom: 24 }}>Respira. Estás en el lugar correcto.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => setRunning(r => !r)} style={{ padding: '12px 28px', borderRadius: 14, background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`, border: 'none', color: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              {running ? <Pause size={16} /> : <Play size={16} />} {running ? 'Pausar' : 'Reanudar'}
            </button>
            <button onClick={() => { setActive(null); setSeconds(0); setRunning(false); }} style={{ padding: '12px 28px', borderRadius: 14, background: C.border, border: 'none', color: C.text, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Terminar</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sessions.map(s => (
            <button key={s.id} onClick={() => { setActive(s); setSeconds(0); setRunning(true); }} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${C.cyan}15`, border: `1px solid ${C.cyan}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{s.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{s.title}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.desc}</div>
              </div>
              <span style={{ fontSize: 11, color: C.cyan, fontWeight: 600, whiteSpace: 'nowrap' }}>{s.duration}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PAGE: APOYO ──────────────────────────────────────────────
function PageApoyo({ contacts, helpLines }) {
  const DEFAULT_TELEFONOS = [
    { nombre: 'Teléfono de la Esperanza', numero: '717 003 717', descripcion: 'Crisis emocional · 24h', emoji: '🆘' },
    { nombre: 'Alcohólicos Anónimos', numero: '900 200 525', descripcion: 'Apoyo en adicción al alcohol', emoji: '🤝' },
    { nombre: 'Proyecto Hombre', numero: '914 020 417', descripcion: 'Drogodependencias', emoji: '🏥' },
    { nombre: 'Emergencias', numero: '112', descripcion: 'Emergencias generales', emoji: '🚨' },
  ];
  const telefonos = helpLines?.length > 0 ? helpLines : DEFAULT_TELEFONOS;
  return (
    <div style={{ padding: '48px 20px 100px', maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Apoyo</h1>
      <p style={{ fontSize: 12, color: C.muted, marginBottom: 24 }}>No estás solo. Siempre hay alguien aquí.</p>
      <div style={{ background: `linear-gradient(135deg, ${C.primary}25, ${C.cyan}10)`, border: `1px solid ${C.primary}40`, borderRadius: 20, padding: 20, marginBottom: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>💙</div>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>¿Momento difícil ahora?</div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Llama. Un humano real coge el teléfono.</div>
        <a href="tel:717003717" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 14, background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`, color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>📞 Llamar ahora</a>
      </div>
      {contacts?.filter(c => c.name && c.phone).length > 0 && (
        <>
          <p style={{ color: C.muted, fontSize: 11, letterSpacing: '0.2em', fontWeight: 600, marginBottom: 12 }}>MIS CONTACTOS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {contacts.filter(c => c.name && c.phone).map((c, i) => (
              <a key={i} href={`tel:${c.phone.replace(/\s/g,'')}`} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.primary}15`, border: `1px solid ${C.primary}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{c.role || 'Contacto de confianza'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>{c.phone}</div>
                  <Phone size={14} color={C.green} style={{ marginTop: 2 }} />
                </div>
              </a>
            ))}
          </div>
        </>
      )}
      <p style={{ color: C.muted, fontSize: 11, letterSpacing: '0.2em', fontWeight: 600, marginBottom: 12 }}>TELÉFONOS DE AYUDA</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {telefonos.map((t, i) => (
          <a key={i} href={`tel:${t.numero.replace(/\s/g,'')}`} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.green}15`, border: `1px solid ${C.green}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{t.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{t.nombre}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{t.descripcion}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>{t.numero}</div>
              <Phone size={14} color={C.green} style={{ marginTop: 2 }} />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE: PERFIL ─────────────────────────────────────────────
function PagePerfil({ workouts, profile, contacts, helpLines, anchors, blackPhotos, onSave, onLogout, sobrietyDays, diary }) {
  const [name, setName] = useState(profile?.name || '');
  const [sobrietyDate, setSobrietyDate] = useState(profile?.sobriety_date || '');
  const [myContacts, setMyContacts] = useState(contacts?.length > 0 ? contacts : [{ name: '', phone: '', role: '' }, { name: '', phone: '', role: '' }]);
  const [myHelpLines, setMyHelpLines] = useState(helpLines?.length > 0 ? helpLines : [
    { nombre: 'Teléfono de la Esperanza', numero: '717 003 717', descripcion: 'Crisis emocional · 24h', emoji: '🆘' },
    { nombre: 'Alcohólicos Anónimos', numero: '900 200 525', descripcion: 'Apoyo en adicción al alcohol', emoji: '🤝' },
    { nombre: 'Proyecto Hombre', numero: '914 020 417', descripcion: 'Drogodependencias', emoji: '🏥' },
    { nombre: 'Emergencias', numero: '112', descripcion: 'Emergencias generales', emoji: '🚨' },
  ]);
  const [myAnchors, setMyAnchors] = useState(anchors || []);
  const [myBlackPhotos, setMyBlackPhotos] = useState(blackPhotos || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const totalMin = workouts.reduce((s, w) => s + w.minutes, 0);
  const days = new Set(workouts.map(w => w.date)).size;

  const saveAll = async () => {
    setSaving(true);
    await onSave({ name, sobrietyDate, contacts: myContacts, helpLines: myHelpLines, anchors: myAnchors, blackPhotos: myBlackPhotos });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: '48px 20px 100px', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${C.primary}, ${C.cyan})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 10px' }}>
            {name ? name[0].toUpperCase() : '👤'}
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 800 }}>{name || 'Tu perfil'}</h1>
          {sobrietyDays !== null && <p style={{ fontSize: 13, color: C.green, marginTop: 4, fontWeight: 600 }}>🏆 {sobrietyDays} días limpio/a</p>}
        </div>
        <button onClick={onLogout} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 10, padding: '8px 12px', color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <LogOut size={14} /> Salir
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {[{ v: days, l: 'Días activo' }, { v: Math.round(totalMin/60), l: 'Horas total' }, { v: workouts.length, l: 'Sesiones' }].map(s => (
          <div key={s.l} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 700 }}>{s.v}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <Achievements sobrietyDays={sobrietyDays || 0} workouts={workouts} diary={diary || []} />

      <label style={{ color: C.muted, fontSize: 11, letterSpacing: '0.15em', fontWeight: 600 }}>NOMBRE</label>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" style={{ ...inputStyle, marginTop: 8 }} />

      <label style={{ color: C.muted, fontSize: 11, letterSpacing: '0.15em', fontWeight: 600 }}>FECHA DE ABSTINENCIA</label>
      <input type="date" value={sobrietyDate} onChange={e => setSobrietyDate(e.target.value)} style={{ ...inputStyle, marginTop: 8, border: `1px solid ${C.green}40`, colorScheme: 'dark' }} />
      {sobrietyDays !== null && (
        <div style={{ background: `${C.green}15`, border: `1px solid ${C.green}30`, borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Trophy size={20} color={C.green} />
          <span style={{ fontSize: 14, fontWeight: 700, color: C.green }}>{sobrietyDays} días limpio/a 🎉</span>
        </div>
      )}

      <label style={{ color: C.muted, fontSize: 11, letterSpacing: '0.15em', fontWeight: 600 }}>CONTACTOS DE CONFIANZA</label>
      <div style={{ marginTop: 8, marginBottom: 20 }}>
        {myContacts.map((c, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, fontWeight: 600 }}>Contacto {i + 1}</div>
            <input value={c.name} onChange={e => { const n=[...myContacts]; n[i].name=e.target.value; setMyContacts(n); }} placeholder="Nombre" style={{ ...inputStyle, marginBottom: 8 }} />
            <input value={c.phone} onChange={e => { const n=[...myContacts]; n[i].phone=e.target.value; setMyContacts(n); }} placeholder="Teléfono" style={{ ...inputStyle, marginBottom: 8 }} />
            <input value={c.role} onChange={e => { const n=[...myContacts]; n[i].role=e.target.value; setMyContacts(n); }} placeholder="Rol (terapeuta, familiar...)" style={{ ...inputStyle, marginBottom: 0 }} />
          </div>
        ))}
        <button onClick={() => setMyContacts([...myContacts, { name: '', phone: '', role: '' }])} style={{ width: '100%', padding: '10px 0', borderRadius: 12, background: 'none', border: `1px dashed ${C.border}`, color: C.muted, fontSize: 13, cursor: 'pointer' }}>+ Añadir contacto</button>
      </div>

      <label style={{ color: C.muted, fontSize: 11, letterSpacing: '0.15em', fontWeight: 600 }}>TELÉFONOS DE AYUDA</label>
      <div style={{ marginTop: 8, marginBottom: 20 }}>
        {myHelpLines.map((t, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Teléfono {i + 1}</span>
              <button onClick={() => setMyHelpLines(myHelpLines.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: C.red, cursor: 'pointer', fontSize: 12 }}>Eliminar</button>
            </div>
            <input value={t.nombre} onChange={e => { const n=[...myHelpLines]; n[i].nombre=e.target.value; setMyHelpLines(n); }} placeholder="Nombre" style={{ ...inputStyle, marginBottom: 8 }} />
            <input value={t.numero} onChange={e => { const n=[...myHelpLines]; n[i].numero=e.target.value; setMyHelpLines(n); }} placeholder="Número" style={{ ...inputStyle, marginBottom: 8 }} />
            <input value={t.descripcion} onChange={e => { const n=[...myHelpLines]; n[i].descripcion=e.target.value; setMyHelpLines(n); }} placeholder="Descripción" style={{ ...inputStyle, marginBottom: 8 }} />
            <input value={t.emoji} onChange={e => { const n=[...myHelpLines]; n[i].emoji=e.target.value; setMyHelpLines(n); }} placeholder="Emoji" style={{ ...inputStyle, width: 80, marginBottom: 0 }} />
          </div>
        ))}
        <button onClick={() => setMyHelpLines([...myHelpLines, { nombre: '', numero: '', descripcion: '', emoji: '📞' }])} style={{ width: '100%', padding: '10px 0', borderRadius: 12, background: 'none', border: `1px dashed ${C.border}`, color: C.muted, fontSize: 13, cursor: 'pointer' }}>+ Añadir teléfono</button>
      </div>

      <PhotoUploader photos={myAnchors} onAdd={p => setMyAnchors([...myAnchors, p])} onRemove={i => setMyAnchors(myAnchors.filter((_, idx) => idx !== i))} title="💙 Anclaje emocional" desc="Fotos de tus motivos para seguir" dark={false} />
      <PhotoUploader photos={myBlackPhotos} onAdd={p => setMyBlackPhotos([...myBlackPhotos, p])} onRemove={i => setMyBlackPhotos(myBlackPhotos.filter((_, idx) => idx !== i))} title="🖤 Foto negra" desc="Imágenes que te recuerdan el daño" dark={true} />

      <button onClick={saveAll} disabled={saving} style={{ width: '100%', padding: '16px 0', borderRadius: 16, background: saved ? `${C.green}30` : `linear-gradient(135deg, ${C.primary}, ${C.cyan})`, border: saved ? `1px solid ${C.green}` : 'none', color: saved ? C.green : '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {saving ? <Loader2 size={20} /> : saved ? <><Check size={20} /> Guardado</> : 'Guardar perfil'}
      </button>
    </div>
  );
}

// ─── PAGE: DIARIO ─────────────────────────────────────────────
function PageDiario({ diary, onAdd }) {
  const [mood, setMood] = useState(3);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEntry = diary.find(d => d.date === today);

  const MOODS = [
    { v: 1, emoji: '😔', label: 'Muy mal' },
    { v: 2, emoji: '😟', label: 'Mal' },
    { v: 3, emoji: '😐', label: 'Regular' },
    { v: 4, emoji: '🙂', label: 'Bien' },
    { v: 5, emoji: '😊', label: 'Muy bien' },
  ];

  const submit = async () => {
    setSaving(true);
    await onAdd({ date: today, mood, text });
    setSaving(false);
    setSaved(true);
    setText('');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: '48px 20px 100px', maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Diario</h1>
      <p style={{ fontSize: 12, color: C.muted, marginBottom: 24 }}>¿Cómo estás hoy? Escríbelo.</p>

      {/* Today entry */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, marginBottom: 16 }}>HOY — {format(new Date(), 'dd/MM/yyyy')}</div>

        {/* Mood selector */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>¿Cómo te sientes?</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
            {MOODS.map(m => (
              <button key={m.v} onClick={() => setMood(m.v)} style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: `1px solid ${mood === m.v ? C.primary : C.border}`, background: mood === m.v ? `${C.primary}20` : 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 22 }}>{m.emoji}</span>
                <span style={{ fontSize: 9, color: mood === m.v ? C.primary : C.muted, fontWeight: 600 }}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text */}
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Escribe cómo te sientes, qué ha pasado hoy, qué te preocupa..." rows={4} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit', marginBottom: 12 }} />

        <button onClick={submit} disabled={saving} style={{ width: '100%', padding: '13px 0', borderRadius: 14, background: saved ? `${C.green}30` : `linear-gradient(135deg, ${C.primary}, ${C.cyan})`, border: saved ? `1px solid ${C.green}` : 'none', color: saved ? C.green : '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {saving ? <Loader2 size={18} /> : saved ? <><Check size={18} /> Guardado</> : 'Guardar entrada'}
        </button>
      </div>

      {/* Past entries */}
      {diary.filter(d => d.date !== today).length > 0 && (
        <>
          <div style={{ color: C.muted, fontSize: 11, letterSpacing: '0.2em', fontWeight: 600, marginBottom: 12 }}>ENTRADAS ANTERIORES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {diary.filter(d => d.date !== today).slice(0, 10).map((d, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: d.text ? 8 : 0 }}>
                  <span style={{ fontSize: 12, color: C.muted }}>{format(new Date(d.date), 'dd/MM/yyyy')}</span>
                  <span style={{ fontSize: 22 }}>{MOODS.find(m => m.v === d.mood)?.emoji || '😐'}</span>
                </div>
                {d.text && <p style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{d.text}</p>}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Meditación shortcut */}
      <button onClick={() => {}} style={{ marginTop: 16, width: '100%', background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.cyan}15`, border: `1px solid ${C.cyan}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🧘</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Meditación matinal</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>5 minutos para empezar bien el día</div>
        </div>
        <ChevronRight size={16} color={C.muted} />
      </button>
    </div>
  );
}

// ─── ACHIEVEMENTS ─────────────────────────────────────────────
function Achievements({ sobrietyDays, workouts, diary }) {
  const totalMin = workouts.reduce((s, w) => s + w.minutes, 0);
  const workoutDays = new Set(workouts.map(w => w.date)).size;

  const badges = [
    { id: 1, emoji: '🌱', title: 'Primer día', desc: '1 día en abstinencia', unlocked: sobrietyDays >= 1 },
    { id: 2, emoji: '🔥', title: 'Una semana', desc: '7 días en abstinencia', unlocked: sobrietyDays >= 7 },
    { id: 3, emoji: '💪', title: 'Un mes', desc: '30 días en abstinencia', unlocked: sobrietyDays >= 30 },
    { id: 4, emoji: '🏆', title: 'Tres meses', desc: '90 días en abstinencia', unlocked: sobrietyDays >= 90 },
    { id: 5, emoji: '👑', title: 'Medio año', desc: '180 días en abstinencia', unlocked: sobrietyDays >= 180 },
    { id: 6, emoji: '🎯', title: 'Un año', desc: '365 días en abstinencia', unlocked: sobrietyDays >= 365 },
    { id: 7, emoji: '🏃', title: 'En movimiento', desc: 'Primera sesión de ejercicio', unlocked: workoutDays >= 1 },
    { id: 8, emoji: '⚡', title: 'Constante', desc: '7 días de ejercicio', unlocked: workoutDays >= 7 },
    { id: 9, emoji: '🧘', title: 'Mente sana', desc: '10 horas de ejercicio total', unlocked: totalMin >= 600 },
    { id: 10, emoji: '📖', title: 'Primer diario', desc: 'Primera entrada en el diario', unlocked: diary.length >= 1 },
    { id: 11, emoji: '✍️', title: 'Escritor', desc: '7 entradas en el diario', unlocked: diary.length >= 7 },
    { id: 12, emoji: '💙', title: 'Comprometido', desc: '30 entradas en el diario', unlocked: diary.length >= 30 },
  ];

  const unlocked = badges.filter(b => b.unlocked);

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ color: C.muted, fontSize: 11, letterSpacing: '0.2em', fontWeight: 600 }}>LOGROS</div>
        <div style={{ fontSize: 12, color: C.primary, fontWeight: 600 }}>{unlocked.length}/{badges.length}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {badges.map(b => (
          <div key={b.id} style={{ background: b.unlocked ? `${C.primary}15` : C.card, border: `1px solid ${b.unlocked ? C.primary + '40' : C.border}`, borderRadius: 14, padding: '12px 8px', textAlign: 'center', opacity: b.unlocked ? 1 : 0.4 }}>
            <div style={{ fontSize: 24, marginBottom: 4, filter: b.unlocked ? 'none' : 'grayscale(1)' }}>{b.emoji}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: b.unlocked ? C.text : C.muted, lineHeight: 1.2 }}>{b.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


function useNotifications(){useEffect(()=>{if(!("Notification" in window))return;if(Notification.permission==="default")Notification.requestPermission();const s=(h,m,t,b)=>{const now=new Date(),tg=new Date();tg.setHours(h,m,0,0);if(tg<=now)tg.setDate(tg.getDate()+1);const id=setTimeout(()=>{if(Notification.permission==="granted")new Notification(t,{body:b});s(h,m,t,b);},tg-now);return id;};const t1=s(8,0,"💙 Craving Health","Algún día contarás la historia de cómo saliste adelante y serás la guía de superación para otra persona.");const t2=s(17,0,"🏆 Craving Health","Cada tarde es una victoria más. Regístrala.");return()=>{clearTimeout(t1);clearTimeout(t2);};},[]); }
// ─── APP ROOT ─────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('home');
  const [showSOS, setShowSOS] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [helpLines, setHelpLines] = useState([]);
  const [anchors, setAnchors] = useState([]);
  const [blackPhotos, setBlackPhotos] = useState([]);
  const [diary, setDiary] = useState([]);
  const [cravings, setCravings] = useState([]);
  const [showCraving, setShowCraving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    const uid = user.id;
    const [{ data: prof }, { data: w }, { data: c }, { data: h }, { data: d }, { data: cr }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', uid).single(),
      supabase.from('workouts').select('*').eq('user_id', uid).order('date', { ascending: false }),
      supabase.from('contacts').select('*').eq('user_id', uid),
      supabase.from('help_lines').select('*').eq('user_id', uid),
      supabase.from('diary').select('*').eq('user_id', uid).order('date', { ascending: false }),
      supabase.from('cravings').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
    ]);
    if (prof) { setProfile(prof); setAnchors(JSON.parse(prof.anchors || '[]')); setBlackPhotos(JSON.parse(prof.black_photos || '[]')); }
    if (w) setWorkouts(w);
    if (c) setContacts(c);
    if (h) setHelpLines(h);
    if (d) setDiary(d);
    if (cr) setCravings(cr);
  };

  const addWorkout = async (data) => {
    const { data: w } = await supabase.from('workouts').insert({ ...data, user_id: user.id }).select().single();
    if (w) setWorkouts(prev => [w, ...prev]);
  };

  const saveProfile = async ({ name, sobrietyDate, contacts: c, helpLines: h, anchors: a, blackPhotos: b }) => {
    await supabase.from('profiles').upsert({ id: user.id, name, sobriety_date: sobrietyDate || null, anchors: JSON.stringify(a), black_photos: JSON.stringify(b) });
    await supabase.from('contacts').delete().eq('user_id', user.id);
    const validContacts = c.filter(x => x.name || x.phone);
    if (validContacts.length > 0) await supabase.from('contacts').insert(validContacts.map(x => ({ ...x, user_id: user.id })));
    await supabase.from('help_lines').delete().eq('user_id', user.id);
    const validH = h.filter(x => x.nombre || x.numero);
    if (validH.length > 0) await supabase.from('help_lines').insert(validH.map(x => ({ ...x, user_id: user.id })));
    setProfile(prev => ({ ...prev, name, sobriety_date: sobrietyDate }));
    setContacts(validContacts);
    setHelpLines(validH);
    setAnchors(a);
    setBlackPhotos(b);
  };

  const addCraving = async (data) => {
    const { data: cr } = await supabase.from('cravings').insert({ ...data, user_id: user.id }).select().single();
    if (cr) setCravings(prev => [cr, ...prev]);
  };
  const addDiary = async (data) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    await supabase.from('diary').delete().eq('user_id', user.id).eq('date', today);
    const { data: d } = await supabase.from('diary').insert({ ...data, user_id: user.id }).select().single();
    if (d) setDiary(prev => [d, ...prev.filter(x => x.date !== today)]);
  };

  const logout = async () => { await supabase.auth.signOut(); setUser(null); };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { background: ${C.bg}; }`}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💙</div>
        <Loader2 size={24} color={C.primary} style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (!user) return <AuthPage onAuth={u => { setUser(u); }} />;

  const sobrietyDays = profile?.sobriety_date ? differenceInDays(new Date(), new Date(profile.sobriety_date)) : 0;

  const pages = {
    home: <PageHome workouts={workouts} profile={profile} setPage={setPage} onSOS={() => setShowSOS(true)} onCraving={() => setShowCraving(true)} sobrietyDays={sobrietyDays} workouts={workouts} diary={diary} cravings={cravings} />,
    actividad: <PageActividad workouts={workouts} onAdd={addWorkout} />,
    meditacion: <PageMeditacion />,
    diario: <PageDiario diary={diary} onAdd={addDiary} />,
    apoyo: <PageApoyo contacts={contacts} helpLines={helpLines} />,
    perfil: <PagePerfil workouts={workouts} profile={profile} contacts={contacts} helpLines={helpLines} anchors={anchors} blackPhotos={blackPhotos} onSave={saveProfile} onLogout={logout} sobrietyDays={sobrietyDays} diary={diary} />,
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { background: ${C.bg}; } input[type=date]::-webkit-calendar-picker-indicator { filter: invert(1); } input::placeholder { color: ${C.muted}; } @keyframes pulseRing { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.5); opacity: 0; } }`}</style>
      {showCraving && <CravingModal onSave={addCraving} onClose={() => setShowCraving(false)} />}
      {showSOS && <SOSModal onClose={() => setShowSOS(false)} anchors={anchors} blackPhotos={blackPhotos} contacts={contacts} />}
      {pages[page]}
      <BottomNav page={page} setPage={setPage} />
    </div>
  );
}
