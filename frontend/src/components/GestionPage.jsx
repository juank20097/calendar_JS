import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { api } from '../api'

dayjs.locale('es')

const ADMIN_KEY  = 'memorias_admin'
const MONTHS_ES  = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

// ─── Login ────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [cedula, setCedula] = useState('')
  const [error,  setError]  = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!cedula.trim()) return
    setLoading(true)
    const res = await api.authAdmin(cedula.trim())
    setLoading(false)
    if (res.ok) {
      onLogin(cedula.trim())
    } else {
      setError(true)
      setTimeout(() => setError(false), 2500)
      setCedula('')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #050d1a, #0a1628, #0d1f3c)',
      padding: 20,
    }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          width: '100%', maxWidth: 380,
          background: 'linear-gradient(160deg, #0a1628, #0d1f3c)',
          border: '1px solid rgba(100,150,255,0.25)',
          borderRadius: 28, padding: '40px 28px',
          boxShadow: '0 0 60px rgba(30,80,200,0.3)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 16 }}>🔐</div>
        <h2 style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: 30, color: '#e8f0ff',
          textShadow: '0 0 20px rgba(100,160,255,0.5)',
          margin: '0 0 8px',
        }}>
          Área de Gestión
        </h2>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: '#4a6fa5', marginBottom: 28 }}>
          Ingresa tu número de cédula para continuar
        </p>

        <input
          value={cedula}
          onChange={e => setCedula(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Número de cédula"
          autoFocus
          style={{
            width: '100%', padding: '14px 18px', borderRadius: 14,
            border: `1.5px solid ${error ? '#e05555' : 'rgba(100,150,255,0.3)'}`,
            background: 'rgba(255,255,255,0.05)', color: '#e8f0ff',
            fontFamily: "'Nunito',sans-serif", fontSize: 16,
            fontWeight: 700, letterSpacing: 3, textAlign: 'center',
            outline: 'none', boxSizing: 'border-box',
          }}
        />

        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ color: '#e07070', fontSize: 13, fontFamily: "'Nunito',sans-serif", marginTop: 8 }}>
              Cédula no autorizada 🚫
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          disabled={loading}
          style={{
            marginTop: 20, width: '100%', padding: 14, borderRadius: 14,
            border: '1.5px solid rgba(100,150,255,0.4)',
            background: 'linear-gradient(135deg, #1a3a7e, #2a5298)',
            color: '#e8f0ff', fontFamily: "'Nunito',sans-serif",
            fontWeight: 800, fontSize: 15, cursor: 'pointer',
            letterSpacing: 1,
          }}
        >
          {loading ? '...' : 'Ingresar 🚀'}
        </motion.button>
      </motion.div>
    </div>
  )
}

// ─── Gestión principal ────────────────────────────────────────
export default function GestionPage({ onBack }) {
  const [cedula, setCedula]         = useState(null)
  const [year, setYear]             = useState(new Date().getFullYear())
  const [month, setMonth]           = useState(new Date().getMonth())
  const [dates, setDates]           = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [photos, setPhotos]         = useState([])
  const [selected, setSelected]     = useState([])
  const [confirm, setConfirm]       = useState(false)
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (!cedula) return
    api.getCalendarDates(year, month + 1).then(data => setDates(data)).catch(() => {})
  }, [cedula, year, month])

  async function loadPhotos(date) {
    setSelectedDate(date)
    setSelected([])
    setLoadingPhotos(true)
    const data = await api.getPhotosByDate(date)
    setPhotos(data)
    setLoadingPhotos(false)
  }

  function toggleSelect(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  async function handleDelete() {
    setDeleting(true)
    for (const id of selected) {
      await api.deletePhoto(id, cedula)
    }
    setDeleting(false)
    setConfirm(false)
    setSelected([])
    // Recargar fotos y fechas
    const updated = await api.getPhotosByDate(selectedDate)
    setPhotos(updated)
    const updatedDates = await api.getCalendarDates(year, month + 1)
    setDates(updatedDates)
    setSuccessMsg(`✅ ${selected.length} foto${selected.length > 1 ? 's' : ''} eliminada${selected.length > 1 ? 's' : ''} correctamente`)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  if (!cedula) return <LoginScreen onLogin={setCedula} />

  const selectedPhotos = photos.filter(p => selected.includes(p.id))

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #050d1a, #0a1628, #0d1f3c)',
      padding: '24px 16px',
    }}>
      {/* Header */}
      <div style={{ maxWidth: 540, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onBack}
            style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(100,150,255,0.2)',
              color: '#a8c8f0', fontSize: 16, cursor: 'pointer',
            }}>
            ←
          </motion.button>
          <div>
            <h1 style={{ fontFamily: "'Dancing Script',cursive", fontSize: 28, color: '#e8f0ff', margin: 0 }}>
              Gestión de Fotos
            </h1>
            <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: '#3a5a7a', margin: 0 }}>
              🔐 Sesión activa
            </p>
          </div>
        </div>

        {/* Navegación de mes */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => { const d = new Date(year, month - 1, 1); setYear(d.getFullYear()); setMonth(d.getMonth()); setSelectedDate(null) }}
            style={navBtn}>◀</motion.button>

          <p style={{ fontFamily: "'Dancing Script',cursive", fontSize: 26, color: '#e8f0ff', margin: 0 }}>
            {MONTHS_ES[month]} {year}
          </p>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => { const d = new Date(year, month + 1, 1); setYear(d.getFullYear()); setMonth(d.getMonth()); setSelectedDate(null) }}
            style={navBtn}>▶</motion.button>
        </div>

        {/* Fechas con fotos */}
        {dates.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#3a5a7a', fontFamily: "'Nunito',sans-serif", padding: '40px 0' }}>
            <div style={{ fontSize: 40 }}>🚀</div>
            <p>No hay fotos este mes</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
            {dates.map(d => (
              <motion.button
                key={d.date}
                whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                onClick={() => loadPhotos(d.date)}
                style={{
                  padding: '10px 16px', borderRadius: 12,
                  background: selectedDate === d.date
                    ? 'linear-gradient(135deg, #1a3a7e, #2a5298)'
                    : 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${selectedDate === d.date ? 'rgba(100,150,255,0.5)' : 'rgba(100,150,255,0.15)'}`,
                  color: '#e8f0ff', fontFamily: "'Nunito',sans-serif",
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}
              >
                📅 {dayjs(d.date).format('D [de] MMMM')}
                <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.6 }}>({d.count})</span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Fotos del día seleccionado */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, color: '#7a9abf', margin: 0 }}>
                  Selecciona las fotos a eliminar
                </p>
                {selected.length > 0 && (
                  <motion.button
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setConfirm(true)}
                    style={{
                      padding: '8px 16px', borderRadius: 10,
                      background: 'linear-gradient(135deg, #7e1a1a, #a02020)',
                      border: '1px solid rgba(255,100,100,0.3)',
                      color: '#ffe8e8', fontFamily: "'Nunito',sans-serif",
                      fontSize: 13, fontWeight: 800, cursor: 'pointer',
                    }}
                  >
                    🗑 Eliminar ({selected.length})
                  </motion.button>
                )}
              </div>

              {loadingPhotos ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{ fontSize: 36, display: 'inline-block' }}>⭐</motion.div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  {photos.map(photo => (
                    <motion.div
                      key={photo.id}
                      whileHover={{ scale: 1.04 }}
                      onClick={() => toggleSelect(photo.id)}
                      style={{
                        aspectRatio: '1', borderRadius: 12, overflow: 'hidden',
                        cursor: 'pointer', position: 'relative',
                        border: selected.includes(photo.id)
                          ? '2.5px solid #e05555'
                          : '1.5px solid rgba(100,150,255,0.15)',
                        boxShadow: selected.includes(photo.id)
                          ? '0 0 16px rgba(220,80,80,0.4)'
                          : 'none',
                      }}
                    >
                      <img src={photo.image} alt={photo.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {/* Overlay seleccionado */}
                      {selected.includes(photo.id) && (
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(220,50,50,0.35)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 28,
                        }}>✓</div>
                      )}
                      {/* Título */}
                      {photo.title && (
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                          padding: '8px 6px 4px',
                        }}>
                          <p style={{ margin: 0, fontSize: 9, color: '#e8f0ff', fontFamily: "'Nunito',sans-serif", fontWeight: 700 }}>
                            {photo.title}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mensaje de éxito */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{
                marginTop: 16, padding: '12px 16px', borderRadius: 12,
                background: 'rgba(50,180,100,0.15)',
                border: '1px solid rgba(50,180,100,0.3)',
                color: '#80e8a0', fontFamily: "'Nunito',sans-serif",
                fontSize: 14, textAlign: 'center',
              }}
            >
              {successMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal de confirmación */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(5,13,26,0.92)', backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                width: '100%', maxWidth: 380,
                background: 'linear-gradient(160deg, #0a1628, #0d1f3c)',
                border: '1px solid rgba(220,80,80,0.3)',
                borderRadius: 24, padding: '32px 24px',
                boxShadow: '0 0 60px rgba(200,50,50,0.2)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
              <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: 24, color: '#e8f0ff', margin: '0 0 8px' }}>
                ¿Confirmas eliminar?
              </h3>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: '#7a9abf', marginBottom: 16 }}>
                Vas a eliminar <strong style={{ color: '#e8a0a0' }}>{selected.length} foto{selected.length > 1 ? 's' : ''}</strong> del{' '}
                <strong style={{ color: '#a8c8f0' }}>{dayjs(selectedDate).format('D [de] MMMM')}</strong>.
                <br />Esta acción no se puede deshacer.
              </p>

              {/* Preview de fotos a borrar */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
                {selectedPhotos.map(p => (
                  <img key={p.id} src={p.image} alt={p.title}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '2px solid rgba(220,80,80,0.4)' }} />
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setConfirm(false)}
                  style={{
                    flex: 1, padding: 12, borderRadius: 12,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(100,150,255,0.2)',
                    color: '#a8c8f0', fontFamily: "'Nunito',sans-serif",
                    fontWeight: 800, fontSize: 14, cursor: 'pointer',
                  }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    flex: 1, padding: 12, borderRadius: 12,
                    background: 'linear-gradient(135deg, #7e1a1a, #a02020)',
                    border: '1px solid rgba(255,100,100,0.3)',
                    color: '#ffe8e8', fontFamily: "'Nunito',sans-serif",
                    fontWeight: 800, fontSize: 14, cursor: 'pointer',
                  }}
                >
                  {deleting ? '...' : 'Sí, eliminar 🗑'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const navBtn = {
  width: 36, height: 36, borderRadius: '50%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(100,150,255,0.2)',
  color: '#a8c8f0', fontSize: 16, cursor: 'pointer',
}
