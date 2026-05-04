import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../api'
import PhotoModal from './PhotoModal'

const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS_ES   = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

// Planetas para decorar esquinas del mes
const CORNER_PLANETS = [
  { pos: { top: 60, left: 10 }, type: 'saturn',  size: 70 },
  { pos: { top: 60, right: 10 }, type: 'mars',    size: 48 },
  { pos: { bottom: 80, left: 16 }, type: 'earth',  size: 52 },
  { pos: { bottom: 80, right: 12 }, type: 'jupiter', size: 56 },
]

export default function MonthView({ year, month, onBack, onPrev, onNext }) {
  const [datesWithPhotos, setDatesWithPhotos] = useState({})
  const [selectedDate, setSelectedDate]       = useState(null)
  const [coverPhoto, setCoverPhoto]           = useState(null)

  useEffect(() => {
    api.getCalendarDates(year, month + 1).then(data => {
      const map = {}
      data.forEach(d => { map[d.date] = d.count })
      setDatesWithPhotos(map)
    }).catch(() => {})
  }, [year, month])

  useEffect(() => {
    api.getMonthCover(year, month + 1).then(data => {
      setCoverPhoto(data.image || null)
    }).catch(() => setCoverPhoto(null))
  }, [year, month])

  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today       = new Date()
  const cells       = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function handleDayClick(day) {
    if (!day) return
    const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    if (datesWithPhotos[dateStr]) setSelectedDate(dateStr)
  }

  function isToday(day) {
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const cellDate   = new Date(year, month, day)
    return day && cellDate.toDateString() === todayLocal.toDateString()
  }

  function hasPhoto(day) {
    if (!day) return false
    const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return !!datesWithPhotos[dateStr]
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 15% 25%, #1a3a7e22 0%, transparent 50%), radial-gradient(ellipse at 85% 75%, #3a1a6e22 0%, transparent 50%), linear-gradient(160deg, #050d1a 0%, #0a1628 50%, #0d1f3c 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <Starfield />
      <Constellations />

      {/* Planetas decorativos esquinas */}
      <FloatPlanet style={{ position:'absolute', top:60, left:10, zIndex:2 }} delay={0}>
        <PlanetSaturn size={70} />
      </FloatPlanet>
      <FloatPlanet style={{ position:'absolute', top:60, right:10, zIndex:2 }} delay={0.8}>
        <PlanetMars size={48} />
      </FloatPlanet>
      <FloatPlanet style={{ position:'absolute', bottom:80, left:12, zIndex:2 }} delay={1.4}>
        <PlanetEarth size={52} />
      </FloatPlanet>
      <FloatPlanet style={{ position:'absolute', bottom:80, right:10, zIndex:2 }} delay={0.5}>
        <PlanetJupiter size={56} />
      </FloatPlanet>
      <FloatPlanet style={{ position:'absolute', top:'40%', right:6, zIndex:2 }} delay={2}>
        <PlanetIce size={36} />
      </FloatPlanet>
      <FloatPlanet style={{ position:'absolute', top:'35%', left:6, zIndex:2 }} delay={1.8}>
        <PlanetMoon size={32} />
      </FloatPlanet>

      {/* Contenido principal */}
      <div style={{ maxWidth: 540, margin: '0 auto', padding: '28px 20px 40px', position: 'relative', zIndex: 10 }}>

        {/* Nav top */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 20 }}>
          <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={onBack}
            style={navBtnStyle}>
            🏠
          </motion.button>
          <div style={{ display:'flex', gap:12 }}>
            <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={onPrev} style={navBtnStyle}>◀</motion.button>
            <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={onNext} style={navBtnStyle}>▶</motion.button>
          </div>
        </div>

        {/* Año + Mes — tipografía script elegante */}
        <motion.div
          key={`${year}-${month}`}
          initial={{ opacity:0, y:-20 }}
          animate={{ opacity:1, y:0 }}
          style={{ textAlign:'center', marginBottom: 18 }}
        >
          <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:15, color:'#7a9abf', letterSpacing:6, textTransform:'uppercase', marginBottom:2 }}>
            {year}
          </p>
          <h2 style={{
            fontFamily:"'Dancing Script', cursive",
            fontSize: 'clamp(42px, 10vw, 64px)',
            color:'#e8f0ff',
            textShadow:'0 0 30px rgba(100,160,255,0.5)',
            lineHeight:1, margin:0,
          }}>
            {MONTHS_ES[month]}
          </h2>
        </motion.div>

        {/* Foto del mes — como ventana al espacio */}
        <motion.div
          key={`photo-${year}-${month}`}
          initial={{ opacity:0, scale:0.95 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ delay:0.1 }}
          style={{
            position:'relative',
            borderRadius:20,
            overflow:'hidden',
            marginBottom:22,
            aspectRatio:'16/9',
            background:'linear-gradient(135deg, #0a1628, #1a2f5e)',
            border:'1.5px solid rgba(100,150,255,0.25)',
            boxShadow:'0 0 40px rgba(50,100,200,0.25), inset 0 0 60px rgba(0,0,50,0.5)',
          }}
        >
          {coverPhoto ? (
            <img src={coverPhoto} alt="Foto del mes"
              style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.9 }} />
          ) : (
            <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10 }}>
              <motion.div animate={{ rotate:[0,360] }} transition={{ duration:20, repeat:Infinity, ease:'linear' }}
                style={{ fontSize:48 }}>🌍</motion.div>
              <p style={{ color:'#4a6fa5', fontSize:13, fontFamily:"'Nunito',sans-serif" }}>Sube fotos para ver aquí</p>
            </div>
          )}
          {/* Overlay sutil estrellas */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 60%, rgba(5,13,26,0.7) 100%)', pointerEvents:'none' }} />
          {/* Marco espacial */}
          <div style={{ position:'absolute', inset:0, border:'1px solid rgba(100,150,255,0.15)', borderRadius:18, pointerEvents:'none' }} />
        </motion.div>

        {/* Grid calendario */}
        <div style={{
          background:'rgba(255,255,255,0.04)',
          backdropFilter:'blur(8px)',
          borderRadius:20,
          border:'1px solid rgba(100,150,255,0.15)',
          padding:'16px 12px',
          boxShadow:'0 0 30px rgba(20,60,150,0.2)',
        }}>
          {/* Encabezados días */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:8 }}>
            {DAYS_ES.map(d => (
              <div key={d} style={{ textAlign:'center', fontSize:10, fontWeight:800, color:'#4a6fa5', letterSpacing:1, textTransform:'uppercase', padding:'4px 0' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Días */}
          <motion.div
            key={`grid-${year}-${month}`}
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:0.2 }}
            style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:5 }}
          >
            {cells.map((day, idx) => {
              if (!day) return <div key={`e-${idx}`} />
              const hp = hasPhoto(day)
              const it = isToday(day)
              return (
                <motion.button
                  key={day}
                  initial={{ opacity:0, scale:0.5 }}
                  animate={{ opacity:1, scale:1 }}
                  transition={{ delay: idx * 0.012, type:'spring', stiffness:220 }}
                  whileHover={hp ? { scale:1.2, zIndex:10 } : { scale:1.05 }}
                  whileTap={hp ? { scale:0.9 } : {}}
                  onClick={() => handleDayClick(day)}
                  style={{
                    aspectRatio:'1',
                    borderRadius:12,
                    border:'none',
                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                    cursor: hp ? 'pointer' : 'default',
                    position:'relative',
                    fontFamily:"'Nunito',sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    ...(hp ? {
                      background:'linear-gradient(135deg, #1a4a9e, #2a6abf)',
                      color:'#e8f0ff',
                      boxShadow:'0 2px 12px rgba(50,120,255,0.4)',
                    } : it ? {
                      background:'transparent',
                      color:'#f5c842',
                      border:'2px solid #f5c842',
                    } : {
                      background:'transparent',
                      color:'#3a5a7a',
                    })
                  }}
                >
                  <span style={{ lineHeight:1 }}>{day}</span>
                  {hp && <span style={{ fontSize:10, lineHeight:1, marginTop:1 }}>📸</span>}
                  {it && !hp && (
                    <div style={{ position:'absolute', top:-3, right:-3, width:7, height:7, borderRadius:'50%', background:'#f5c842', border:'1.5px solid #050d1a' }}>
                      <motion.div animate={{ scale:[1,1.4,1] }} transition={{ duration:1.5, repeat:Infinity }}
                        style={{ width:'100%', height:'100%', borderRadius:'50%', background:'#f5c842' }} />
                    </div>
                  )}
                  {/* Brillo para días con fotos */}
                  {hp && (
                    <motion.div
                      animate={{ opacity:[0,0.4,0] }}
                      transition={{ duration:2.5, repeat:Infinity, delay: day * 0.08 }}
                      style={{ position:'absolute', inset:0, borderRadius:12, background:'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)' }}
                    />
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        </div>

        {/* Leyenda */}
        <div style={{ display:'flex', justifyContent:'center', gap:20, marginTop:16, fontSize:12, color:'#3a5a7a', fontFamily:"'Nunito',sans-serif" }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:14, height:14, borderRadius:4, background:'linear-gradient(135deg,#1a4a9e,#2a6abf)' }} />
            <span>Con fotos</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:14, height:14, borderRadius:4, border:'1.5px solid #f5c842' }} />
            <span>Hoy</span>
          </div>
        </div>
      </div>

      {/* Modal fotos */}
      <AnimatePresence>
        {selectedDate && (
          <PhotoModal date={selectedDate} onClose={() => setSelectedDate(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Helpers ───────────────────────────────────────────────
const navBtnStyle = {
  width:38, height:38, borderRadius:'50%',
  background:'rgba(255,255,255,0.06)',
  border:'1px solid rgba(100,150,255,0.2)',
  color:'#a8c8f0', fontSize:16, cursor:'pointer',
  display:'flex', alignItems:'center', justifyContent:'center',
}

function FloatPlanet({ children, style, delay = 0 }) {
  return (
    <motion.div
      style={{ pointerEvents:'none', ...style }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  )
}

// ─── Starfield ─────────────────────────────────────────────
function Starfield() {
  const stars = Array.from({ length:110 }, (_, i) => ({
    x: ((i * 137.508 + 23) % 100).toFixed(2),
    y: ((i * 97.3 + 11) % 100).toFixed(2),
    r: (0.5 + (i % 4) * 0.4).toFixed(1),
    op: (0.2 + (i % 5) * 0.14).toFixed(2),
    dur: 2 + (i % 4),
    del: ((i % 28) * 0.3).toFixed(1),
  }))
  return (
    <svg style={{ position:'fixed', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}
      viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" fillOpacity={s.op}>
          <animate attributeName="fill-opacity"
            values={`${s.op};${Math.min(1, parseFloat(s.op)+0.5)};${s.op}`}
            dur={`${s.dur}s`} repeatCount="indefinite" begin={`${s.del}s`} />
        </circle>
      ))}
    </svg>
  )
}

function Constellations() {
  const lines = [
    [[5,10],[9,15],[7,22]],
    [[80,8],[84,13],[88,10],[92,15]],
    [[40,5],[45,9],[50,6]],
    [[3,60],[7,65],[12,62]],
    [[82,65],[87,61],[92,67]],
  ]
  return (
    <svg style={{ position:'fixed', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}
      viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {lines.map((pts, ci) => (
        <g key={ci}>
          {pts.slice(0,-1).map((pt,i)=>(
            <line key={i} x1={pt[0]} y1={pt[1]} x2={pts[i+1][0]} y2={pts[i+1][1]}
              stroke="#4a6fa5" strokeWidth="0.14" strokeOpacity="0.4" />
          ))}
          {pts.map((pt,i)=><circle key={i} cx={pt[0]} cy={pt[1]} r="0.3" fill="#8ab4e0" fillOpacity="0.6" />)}
        </g>
      ))}
    </svg>
  )
}

// ─── Planetas (duplicados para evitar IDs SVG conflictivos con CoverPage) ───
function PlanetSaturn({ size }) {
  return (
    <svg width={size*1.8} height={size} viewBox={`0 0 ${size*1.8} ${size}`}>
      <defs><radialGradient id="msat" cx="40%" cy="35%"><stop offset="0%" stopColor="#b8d4e8"/><stop offset="60%" stopColor="#7a9db8"/><stop offset="100%" stopColor="#4a6a88"/></radialGradient></defs>
      <ellipse cx={size*0.9} cy={size/2} rx={size*0.82} ry={size*0.2} fill="none" stroke="#8ab4d4" strokeWidth={size*0.06} strokeOpacity="0.65"/>
      <circle cx={size*0.9} cy={size/2} r={size*0.42} fill="url(#msat)"/>
    </svg>
  )
}
function PlanetMars({ size }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs><radialGradient id="mmars" cx="35%" cy="35%"><stop offset="0%" stopColor="#e8906a"/><stop offset="70%" stopColor="#c4603a"/><stop offset="100%" stopColor="#8a3a20"/></radialGradient></defs>
      <circle cx={size/2} cy={size/2} r={size*0.45} fill="url(#mmars)"/>
    </svg>
  )
}
function PlanetEarth({ size }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs><radialGradient id="mearth" cx="35%" cy="35%"><stop offset="0%" stopColor="#5ab4d4"/><stop offset="60%" stopColor="#2a7abf"/><stop offset="100%" stopColor="#0a3a7a"/></radialGradient></defs>
      <circle cx={size/2} cy={size/2} r={size*0.45} fill="url(#mearth)"/>
      <ellipse cx={size*0.55} cy={size*0.45} rx={size*0.18} ry={size*0.12} fill="#4a9a50" fillOpacity="0.8" transform={`rotate(-20,${size*0.55},${size*0.45})`}/>
    </svg>
  )
}
function PlanetJupiter({ size }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs><radialGradient id="mjup" cx="35%" cy="35%"><stop offset="0%" stopColor="#e8c88a"/><stop offset="50%" stopColor="#c4956a"/><stop offset="100%" stopColor="#8a5a3a"/></radialGradient></defs>
      <circle cx={size/2} cy={size/2} r={size*0.46} fill="url(#mjup)"/>
      {[0.38,0.48,0.56].map((y,i)=>(
        <ellipse key={i} cx={size/2} cy={size*y} rx={size*0.44} ry={size*0.03} fill="none" stroke="#a07040" strokeWidth={size*0.025} strokeOpacity="0.5"/>
      ))}
    </svg>
  )
}
function PlanetIce({ size }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs><radialGradient id="mice" cx="35%" cy="35%"><stop offset="0%" stopColor="#a0d4e8"/><stop offset="70%" stopColor="#5090b8"/><stop offset="100%" stopColor="#205880"/></radialGradient></defs>
      <circle cx={size/2} cy={size/2} r={size*0.45} fill="url(#mice)"/>
      <ellipse cx={size/2} cy={size/2} rx={size*0.44} ry={size*0.15} fill="none" stroke="#80c0d8" strokeWidth={size*0.04} strokeOpacity="0.5" transform={`rotate(30,${size/2},${size/2})`}/>
    </svg>
  )
}
function PlanetMoon({ size }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs><radialGradient id="mmoon" cx="35%" cy="35%"><stop offset="0%" stopColor="#d8d8e8"/><stop offset="70%" stopColor="#9898a8"/><stop offset="100%" stopColor="#686878"/></radialGradient></defs>
      <circle cx={size/2} cy={size/2} r={size*0.45} fill="url(#mmoon)"/>
    </svg>
  )
}
