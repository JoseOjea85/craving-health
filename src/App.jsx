import { useState, useEffect } from 'react';
import { Flame, Plus, X, Check, ChevronLeft, Brain, Loader2 } from 'lucide-react';
import { format, subDays } from 'date-fns';

const WORKOUT_ICONS = {
  caminar: '🚶',
  correr: '🏃',
  gimnasio: '🏋️',
  yoga: '🧘',
  ciclismo: '🚴',
  otro: '⚡',
};

const COLORS = {
  bg: '#0d0d14',
  card: '#13131f',
  border: '#1e1e30',
  primary: '#7c5cfc',
  cyan: '#22d3ee',
  orange: '#fb923c',
  text: '#f0f0ff',
  muted: '#6b6b8a',
};

function WeekChart({ workouts, goal }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const key = format(date, 'yyyy-MM-dd');
    const minutes = workouts.filter(w => w.date === key).reduce((s, w) => s + w.minutes, 0);
    const label = format(date, 'EEE').slice(0, 2).toUpperCase();
    return { key, minutes, label };
  });
  const max = Math.max(goal * 1.5, ...days.map(d => d.minutes), 1);

  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 20,
      padding: '20px',
      marginBottom: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ color: COLORS.muted, fontSize: 11, letterSpacing: '0.2em', fontWeight: 600 }}>ESTA SEMANA</span>
        <span style={{ color: COLORS.muted, fontSize: 11 }}>Meta: {goal} min/día</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
        {days.map((d) => {
          const height = Math.round((d.minutes / max) * 80);
          const isToday = d.key === format(new Date(), 'yyyy-MM-dd');
          const metGoal = d.minutes >= goal;
          return (
            <div key={d.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: '100%',
                height: 80,
                display: 'flex',
                alignItems: 'flex-end',
                position: 'relative',
              }}>
                {/* Goal line */}
                <div style={{
                  position: 'absolute',
                  bottom: Math.round((goal / max) * 80),
                  left: 0, right: 0,
                  height: 1,
                  background: `${COLORS.primary}40`,
                  borderTop: `1px dashed ${COLORS.primary}40`,
                }} />
                <div style={{
                  width: '100%',
                  height: Math.max(height, 3),
                  borderRadius: 6,
                  background: metGoal
                    ? `linear-gradient(to top, ${COLORS.primary}, ${COLORS.cyan})`
                    : isToday
                    ? `${COLORS.primary}60`
                    : `${COLORS.border}`,
                  transition: 'height 0.4s ease',
                }} />
              </div>
              <span style={{
                fontSize: 10,
                color: isToday ? COLORS.primary : COLORS.muted,
                fontWeight: isToday ? 700 : 400,
              }}>{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 40,
        }}
      />
      {/* Modal */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0,
        zIndex: 50,
        background: COLORS.card,
        borderTop: `1px solid ${COLORS.border}`,
        borderRadius: '24px 24px 0 0',
        padding: '24px 24px 40px',
        maxWidth: 480,
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ color: COLORS.text, fontSize: 18, fontWeight: 700, margin: 0 }}>Registrar actividad</h2>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: COLORS.border, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: COLORS.text,
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Type selector */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ color: COLORS.muted, fontSize: 11, letterSpacing: '0.2em', fontWeight: 600 }}>TIPO DE EJERCICIO</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
            {Object.entries(WORKOUT_ICONS).map(([key, emoji]) => (
              <button
                key={key}
                onClick={() => setType(key)}
                style={{
                  padding: '12px 0',
                  borderRadius: 14,
                  border: `1px solid ${type === key ? COLORS.primary : COLORS.border}`,
                  background: type === key ? `${COLORS.primary}20` : `${COLORS.border}40`,
                  color: type === key ? COLORS.primary : COLORS.muted,
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 20 }}>{emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'capitalize' }}>{key}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Minutes */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ color: COLORS.muted, fontSize: 11, letterSpacing: '0.2em', fontWeight: 600 }}>MINUTOS</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
            <button
              onClick={() => setMinutes(m => Math.max(5, m - 5))}
              style={{
                width: 48, height: 48, borderRadius: '50%',
                background: COLORS.border, border: 'none',
                color: COLORS.text, fontSize: 22, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >−</button>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <span style={{ fontSize: 52, fontWeight: 700, color: COLORS.text, fontVariantNumeric: 'tabular-nums' }}>{minutes}</span>
              <span style={{ color: COLORS.muted, marginLeft: 8 }}>min</span>
            </div>
            <button
              onClick={() => setMinutes(m => m + 5)}
              style={{
                width: 48, height: 48, borderRadius: '50%',
                background: COLORS.border, border: 'none',
                color: COLORS.text, fontSize: 22, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >+</button>
          </div>
        </div>

        <button
          onClick={submit}
          disabled={saving}
          style={{
            width: '100%', padding: '16px 0',
            borderRadius: 16,
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.cyan})`,
            border: 'none', cursor: 'pointer',
            color: '#fff', fontWeight: 600, fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={20} />}
          Guardar actividad
        </button>
      </div>
    </>
  );
}

const STORAGE_KEY = 'actividad_workouts';

export default function App() {
  const [workouts, setWorkouts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch { return []; }
  });
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  }, [workouts]);

  const addWorkout = (data) => {
    const newWorkout = { ...data, id: Date.now().toString() };
    setWorkouts(prev => [newWorkout, ...prev]);
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayMinutes = workouts.filter(w => w.date === today).reduce((s, w) => s + w.minutes, 0);
  const totalMinutes = workouts.reduce((s, w) => s + w.minutes, 0);
  const streak = (() => {
    let count = 0;
    let d = new Date();
    while (true) {
      const key = format(d, 'yyyy-MM-dd');
      if (!workouts.some(w => w.date === key)) break;
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  })();

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.bg}; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {showLog && (
        <LogModal
          onAdd={(data) => { addWorkout(data); }}
          onClose={() => setShowLog(false)}
        />
      )}

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '48px 20px 100px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: COLORS.card, border: `1px solid ${COLORS.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: COLORS.text,
          }}>
            <ChevronLeft size={20} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 18, fontWeight: 700 }}>Tu actividad</h1>
            <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>El cuerpo cura. Muévete cada día.</p>
          </div>
          <button
            onClick={() => setShowLog(true)}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: `${COLORS.primary}20`,
              border: `1px solid ${COLORS.primary}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: COLORS.primary,
            }}
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          <div style={{
            background: COLORS.card, border: `1px solid ${COLORS.border}`,
            borderRadius: 16, padding: '16px 8px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 30, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{todayMinutes}</div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>Hoy (min)</div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(251,146,60,0.15), rgba(239,68,68,0.05))',
            border: `1px solid rgba(251,146,60,0.25)`,
            borderRadius: 16, padding: '16px 8px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 30, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <Flame size={22} color={COLORS.orange} />
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{streak}</span>
            </div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>Racha (días)</div>
          </div>
          <div style={{
            background: COLORS.card, border: `1px solid ${COLORS.border}`,
            borderRadius: 16, padding: '16px 8px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 30, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{Math.round(totalMinutes / 60)}</div>
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>Total (h)</div>
          </div>
        </div>

        <WeekChart workouts={workouts} goal={30} />

        {/* Today list */}
        {workouts.filter(w => w.date === today).length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: COLORS.muted, fontSize: 11, letterSpacing: '0.25em', fontWeight: 600, marginBottom: 12 }}>HOY</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {workouts.filter(w => w.date === today).map((w) => (
                <div key={w.id} style={{
                  background: COLORS.card, border: `1px solid ${COLORS.border}`,
                  borderRadius: 14, padding: '12px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{WORKOUT_ICONS[w.type] || '⚡'}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}>{w.type}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{w.minutes} min</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add button */}
        <button
          onClick={() => setShowLog(true)}
          style={{
            width: '100%', padding: '16px 0',
            borderRadius: 16,
            background: 'transparent',
            border: `2px dashed ${COLORS.primary}30`,
            color: `${COLORS.primary}90`,
            fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s',
            marginBottom: 16,
          }}
          onMouseEnter={e => { e.target.style.borderColor = `${COLORS.primary}60`; e.target.style.color = COLORS.primary; }}
          onMouseLeave={e => { e.target.style.borderColor = `${COLORS.primary}30`; e.target.style.color = `${COLORS.primary}90`; }}
        >
          <Plus size={16} />
          Registrar actividad
        </button>

        {/* Meditation shortcut */}
        <div style={{
          background: COLORS.card, border: `1px solid ${COLORS.border}`,
          borderRadius: 16, padding: '16px',
          display: 'flex', alignItems: 'center', gap: 16,
          cursor: 'pointer',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(34,211,238,0.1)',
            border: '1px solid rgba(34,211,238,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Brain size={20} color={COLORS.cyan} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Meditación matinal</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>5 minutos para empezar bien el día</div>
          </div>
          <span style={{ color: COLORS.muted }}>→</span>
        </div>

      </div>
    </div>
  );
}
