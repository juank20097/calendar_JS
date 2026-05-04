import { motion } from 'framer-motion'

const float = (delay = 0, range = 12) => ({
  animate: { y: [0, -range, 0] },
  transition: { duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay },
})

export default function CoverPage({ onEnter }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 30%, #1a3a7e22 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, #3a1a6e22 0%, transparent 50%), linear-gradient(160deg, #050d1a 0%, #0a1628 50%, #0d1f3c 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', padding: '40px 20px',
    }}>
      <Starfield />
      <Constellations />

      {/* Planetas decorativos esquinas */}
      <motion.div {...float(0)} style={{ position: 'absolute', top: '6%', left: '4%' }}>
        <PlanetSaturn size={90} />
      </motion.div>
      <motion.div {...float(0.7)} style={{ position: 'absolute', top: '5%', right: '5%' }}>
        <PlanetJupiter size={80} />
      </motion.div>
      <motion.div {...float(1.2)} style={{ position: 'absolute', top: '22%', left: '2%' }}>
        <PlanetMars size={55} />
      </motion.div>
      <motion.div {...float(0.4)} style={{ position: 'absolute', top: '25%', right: '3%' }}>
        <PlanetMoon size={50} />
      </motion.div>
      <motion.div {...float(1.8)} style={{ position: 'absolute', bottom: '18%', left: '5%' }}>
        <PlanetEarth size={65} />
      </motion.div>
      <motion.div {...float(0.9)} style={{ position: 'absolute', bottom: '12%', right: '4%' }}>
        <PlanetSaturnSmall size={70} />
      </motion.div>
      <motion.div {...float(2)} style={{ position: 'absolute', bottom: '30%', right: '8%' }}>
        <PlanetIce size={40} />
      </motion.div>
      <motion.div {...float(1.5)} style={{ position: 'absolute', top: '55%', left: '3%' }}>
        <PlanetPurple size={45} />
      </motion.div>

      {/* Cohete pequeño */}
      <motion.div
        animate={{ y: [-5, -15, -5], x: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', bottom: '25%', left: '18%', fontSize: 32 }}
      >🚀</motion.div>

      {/* OVNI */}
      <motion.div
        animate={{ y: [0, -8, 0], x: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{ position: 'absolute', top: '42%', right: '7%' }}
      >
        <Ufo size={44} />
      </motion.div>

      {/* Contenido central */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        style={{ textAlign: 'center', zIndex: 10, maxWidth: 500 }}
      >
        {/* Astronauta */}
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 90, marginBottom: 8, display: 'inline-block' }}
        >
          👨‍🚀
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(18px, 4vw, 26px)',
            color: '#a8c8f0',
            letterSpacing: 3,
            marginBottom: 4,
          }}
        >
          Houston, tenemos un
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 'clamp(52px, 14vw, 96px)',
            color: '#e8f0ff',
            textShadow: '0 0 40px rgba(100,160,255,0.6), 0 0 80px rgba(100,160,255,0.3)',
            lineHeight: 1,
            letterSpacing: 4,
            marginBottom: 6,
          }}
        >
          RECUERDO
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(22px, 5vw, 34px)',
            color: '#f5c842',
            textShadow: '0 0 20px rgba(245,200,66,0.5)',
            letterSpacing: 6,
            marginBottom: 40,
          }}
        >
          ✦ Memorias de Juan Sebastián ✦
        </motion.p>

        {/* Botón entrar */}
        <motion.button
          onClick={onEnter}
          whileHover={{ scale: 1.07, boxShadow: '0 0 30px rgba(100,160,255,0.5)' }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={{
            background: 'linear-gradient(135deg, #1a3a7e, #2a5298)',
            border: '1.5px solid #4a7abf',
            borderRadius: 50,
            padding: '14px 40px',
            color: '#e8f0ff',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: 3,
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          🌙 Ver Calendario
        </motion.button>
      </motion.div>

      {/* Shooting stars */}
      <ShootingStars />
    </div>
  )
}

// ─── Starfield ───────────────────────────────────────────────
const STATIC_STARS = [
  {x:10,y:15},{x:25,y:8},{x:40,y:22},{x:55,y:5},{x:70,y:18},
  {x:85,y:10},{x:15,y:45},{x:50,y:35},{x:75,y:50},{x:90,y:30},
  {x:5,y:70},{x:30,y:80},{x:60,y:72},{x:80,y:85},{x:45,y:90},
  {x:20,y:60},{x:65,y:40},{x:35,y:55},{x:88,y:65},{x:12,y:92},
]
const GOLD_STARS = [
  {x:22,y:25},{x:58,y:12},{x:78,y:60},{x:38,y:75},{x:92,y:45},
]
function Starfield() {
  return (
    <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
      viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {STATIC_STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="0.25" fill="white" fillOpacity="0.4">
          <animate attributeName="fill-opacity" values="0.2;0.6;0.2"
            dur={`${2 + (i % 3)}s`} repeatCount="indefinite" begin={`${(i % 8) * 0.4}s`} />
        </circle>
      ))}
      {GOLD_STARS.map((s, i) => (
        <circle key={`g${i}`} cx={s.x} cy={s.y} r="0.35" fill="#f5c842" fillOpacity="0.75">
          <animate attributeName="r" values="0.25;0.45;0.25" dur="3s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
        </circle>
      ))}
    </svg>
  )
}

// ─── Constellations ──────────────────────────────────────────
function Constellations() {
  const lines = [
    [[5,15],[9,20],[7,27],[11,30]],
    [[75,12],[79,17],[83,14],[87,19],[91,16]],
    [[33,6],[38,10],[43,7],[48,11],[53,7]],
    [[4,65],[8,70],[13,67],[11,75]],
    [[82,68],[87,64],[92,70],[89,77]],
    [[20,85],[25,80],[30,86],[28,92]],
    [[65,88],[70,84],[75,89],[73,95]],
  ]
  return (
    <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
      viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {lines.map((pts, ci) => (
        <g key={ci}>
          {pts.slice(0, -1).map((pt, i) => (
            <line key={i} x1={pt[0]} y1={pt[1]} x2={pts[i+1][0]} y2={pts[i+1][1]}
              stroke="#4a6fa5" strokeWidth="0.15" strokeOpacity="0.45" />
          ))}
          {pts.map((pt, i) => <circle key={i} cx={pt[0]} cy={pt[1]} r="0.35" fill="#8ab4e0" fillOpacity="0.65" />)}
        </g>
      ))}
    </svg>
  )
}

// ─── Shooting Stars ──────────────────────────────────────────
function ShootingStars() {
  return (
    <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
      viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {[
        { x1: 15, y1: 10, x2: 35, y2: 20, dur: 4, begin: 1 },
        { x1: 60, y1: 5, x2: 80, y2: 18, dur: 6, begin: 3 },
        { x1: 25, y1: 40, x2: 45, y2: 52, dur: 5, begin: 7 },
      ].map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke="#f5c842" strokeWidth="0.3" strokeLinecap="round">
          <animate attributeName="stroke-opacity" values="0;0.8;0" dur={`${s.dur}s`} repeatCount="indefinite" begin={`${s.begin}s`} />
          <animate attributeName="x1" values={`${s.x1};${s.x1 + 5};${s.x1}`} dur={`${s.dur}s`} repeatCount="indefinite" begin={`${s.begin}s`} />
          <animate attributeName="x2" values={`${s.x2};${s.x2 + 5};${s.x2}`} dur={`${s.dur}s`} repeatCount="indefinite" begin={`${s.begin}s`} />
        </line>
      ))}
    </svg>
  )
}

// ─── Planetas SVG ────────────────────────────────────────────
function PlanetSaturn({ size }) {
  const r = size / 2
  return (
    <svg width={size * 1.8} height={size} viewBox={`0 0 ${size * 1.8} ${size}`}>
      <ellipse cx={size * 0.9} cy={size / 2} rx={size * 0.85} ry={size * 0.22} fill="none" stroke="#8ab4d4" strokeWidth={size * 0.06} strokeOpacity="0.7" />
      <circle cx={size * 0.9} cy={size / 2} r={r * 0.72}
        fill="url(#sat)" />
      <defs>
        <radialGradient id="sat" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#b8d4e8" />
          <stop offset="60%" stopColor="#7a9db8" />
          <stop offset="100%" stopColor="#4a6a88" />
        </radialGradient>
      </defs>
    </svg>
  )
}

function PlanetJupiter({ size }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="jup" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#e8c88a" />
          <stop offset="50%" stopColor="#c4956a" />
          <stop offset="100%" stopColor="#8a5a3a" />
        </radialGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={size*0.46} fill="url(#jup)" />
      {[0.38,0.48,0.56].map((y, i) => (
        <ellipse key={i} cx={size/2} cy={size*y} rx={size*0.44} ry={size*0.03}
          fill="none" stroke="#a07040" strokeWidth={size*0.025} strokeOpacity="0.5" />
      ))}
    </svg>
  )
}

function PlanetMars({ size }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="mars" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#e8906a" />
          <stop offset="70%" stopColor="#c4603a" />
          <stop offset="100%" stopColor="#8a3a20" />
        </radialGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={size*0.45} fill="url(#mars)" />
    </svg>
  )
}

function PlanetMoon({ size }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="moon" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#d8d8e8" />
          <stop offset="70%" stopColor="#9898a8" />
          <stop offset="100%" stopColor="#686878" />
        </radialGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={size*0.45} fill="url(#moon)" />
      {[[0.35,0.4,0.08],[0.6,0.6,0.06],[0.45,0.65,0.05]].map(([cx,cy,r],i)=>(
        <circle key={i} cx={size*cx} cy={size*cy} r={size*r} fill="#787888" fillOpacity="0.35" />
      ))}
    </svg>
  )
}

function PlanetEarth({ size }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="earth" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#5ab4d4" />
          <stop offset="60%" stopColor="#2a7abf" />
          <stop offset="100%" stopColor="#0a3a7a" />
        </radialGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={size*0.45} fill="url(#earth)" />
      <ellipse cx={size*0.55} cy={size*0.45} rx={size*0.18} ry={size*0.12} fill="#4a9a50" fillOpacity="0.8" transform={`rotate(-20,${size*0.55},${size*0.45})`} />
      <ellipse cx={size*0.38} cy={size*0.55} rx={size*0.12} ry={size*0.08} fill="#4a9a50" fillOpacity="0.7" />
    </svg>
  )
}

function PlanetSaturnSmall({ size }) {
  return (
    <svg width={size * 1.8} height={size} viewBox={`0 0 ${size * 1.8} ${size}`}>
      <ellipse cx={size*0.9} cy={size/2} rx={size*0.82} ry={size*0.2} fill="none" stroke="#c8a86a" strokeWidth={size*0.07} strokeOpacity="0.65" />
      <defs>
        <radialGradient id="sat2" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#e8d4a0" />
          <stop offset="60%" stopColor="#c4a060" />
          <stop offset="100%" stopColor="#8a6030" />
        </radialGradient>
      </defs>
      <circle cx={size*0.9} cy={size/2} r={size*0.42} fill="url(#sat2)" />
    </svg>
  )
}

function PlanetIce({ size }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="ice" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#a0d4e8" />
          <stop offset="70%" stopColor="#5090b8" />
          <stop offset="100%" stopColor="#205880" />
        </radialGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={size*0.45} fill="url(#ice)" />
      <ellipse cx={size/2} cy={size/2} rx={size*0.44} ry={size*0.15} fill="none" stroke="#80c0d8" strokeWidth={size*0.04} strokeOpacity="0.5" transform={`rotate(30,${size/2},${size/2})`} />
    </svg>
  )
}

function PlanetPurple({ size }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="pur" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#d0a0e8" />
          <stop offset="60%" stopColor="#8850c0" />
          <stop offset="100%" stopColor="#402880" />
        </radialGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={size*0.45} fill="url(#pur)" />
    </svg>
  )
}

function Ufo({ size }) {
  return (
    <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
      <ellipse cx={size/2} cy={size*0.42} rx={size*0.48} ry={size*0.18} fill="#5090c0" fillOpacity="0.9" />
      <ellipse cx={size/2} cy={size*0.28} rx={size*0.26} ry={size*0.22} fill="#80c0e8" fillOpacity="0.85" />
      {[-0.18,0,0.18].map((dx,i) => (
        <circle key={i} cx={size/2+size*dx} cy={size*0.46} r={size*0.05} fill="#f5c842" fillOpacity="0.9">
          <animate attributeName="fill-opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" begin={`${i*0.4}s`} />
        </circle>
      ))}
    </svg>
  )
}
