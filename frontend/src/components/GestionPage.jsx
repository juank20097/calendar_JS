import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { api } from '../api'

dayjs.locale('es')

const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const navBtn = { width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(100,150,255,0.2)', color: '#a8c8f0', fontSize: 16, cursor: 'pointer' }
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid rgba(100,150,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#e8f0ff', fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }

function Label({ children }) {
  return <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: 800, color: '#3a5a7a', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6, marginTop: 0 }}>{children}</p>
}
function Spinner() {
  return <div style={{ textAlign: 'center', padding: '30px 0' }}><motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ fontSize: 36, display: 'inline-block' }}>⭐</motion.div></div>
}
function SuccessMsg({ msg }) {
  return <AnimatePresence>{msg && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: 16, padding: '12px 16px', borderRadius: 12, background: 'rgba(50,180,100,0.15)', border: '1px solid rgba(50,180,100,0.3)', color: '#80e8a0', fontFamily: "'Nunito',sans-serif", fontSize: 14, textAlign: 'center' }}>{msg}</motion.div>}</AnimatePresence>
}
function MonthNav({ year, month, onPrev, onNext }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onPrev} style={navBtn}>◀</motion.button>
      <p style={{ fontFamily: "'Dancing Script',cursive", fontSize: 24, color: '#e8f0ff', margin: 0 }}>{MONTHS_ES[month]} {year}</p>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onNext} style={navBtn}>▶</motion.button>
    </div>
  )
}

// ─── Login ─────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [cedula, setCedula]   = useState('')
  const [error, setError]     = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!cedula.trim()) return
    setLoading(true)
    const res = await api.authAdmin(cedula.trim())
    setLoading(false)
    if (res.ok) { onLogin(cedula.trim()) }
    else { setError(true); setTimeout(() => setError(false), 2500); setCedula('') }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #050d1a, #0a1628, #0d1f3c)', padding: 20 }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ width: '100%', maxWidth: 380, background: 'linear-gradient(160deg, #0a1628, #0d1f3c)', border: '1px solid rgba(100,150,255,0.25)', borderRadius: 28, padding: '40px 28px', boxShadow: '0 0 60px rgba(30,80,200,0.3)', textAlign: 'center' }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🔐</div>
        <h2 style={{ fontFamily: "'Dancing Script',cursive", fontSize: 30, color: '#e8f0ff', textShadow: '0 0 20px rgba(100,160,255,0.5)', margin: '0 0 8px' }}>Área de Gestión</h2>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: '#4a6fa5', marginBottom: 28 }}>Ingresa tu número de cédula para continuar</p>
        <input value={cedula} onChange={e => setCedula(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} placeholder="Número de cédula" autoFocus
          style={{ width: '100%', padding: '14px 18px', borderRadius: 14, border: `1.5px solid ${error ? '#e05555' : 'rgba(100,150,255,0.3)'}`, background: 'rgba(255,255,255,0.05)', color: '#e8f0ff', fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: 3, textAlign: 'center', outline: 'none', boxSizing: 'border-box' }} />
        <AnimatePresence>
          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: '#e07070', fontSize: 13, fontFamily: "'Nunito',sans-serif", marginTop: 8 }}>Cédula no autorizada 🚫</motion.p>}
        </AnimatePresence>
        <motion.button onClick={handleSubmit} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} disabled={loading}
          style={{ marginTop: 20, width: '100%', padding: 14, borderRadius: 14, border: '1.5px solid rgba(100,150,255,0.4)', background: 'linear-gradient(135deg, #1a3a7e, #2a5298)', color: '#e8f0ff', fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, cursor: 'pointer', letterSpacing: 1 }}>
          {loading ? '...' : 'Ingresar 🚀'}
        </motion.button>
      </motion.div>
    </div>
  )
}

// ─── Tab Eliminar ──────────────────────────────────────────────
function TabEliminar({ cedula, year, month, setYear, setMonth, dates, setDates }) {
  const [selectedDate, setSelectedDate]   = useState(null)
  const [photos, setPhotos]               = useState([])
  const [selected, setSelected]           = useState([])
  const [confirm, setConfirm]             = useState(false)
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [deleting, setDeleting]           = useState(false)
  const [successMsg, setSuccessMsg]       = useState('')

  async function loadPhotos(date) {
    setSelectedDate(date); setSelected([]); setLoadingPhotos(true)
    const data = await api.getPhotosByDate(date)
    setPhotos(data); setLoadingPhotos(false)
  }
  function toggleSelect(id) { setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]) }
  async function handleDelete() {
    setDeleting(true)
    const count = selected.length
    for (const id of selected) await api.deletePhoto(id, cedula)
    setDeleting(false); setConfirm(false); setSelected([])
    setPhotos(await api.getPhotosByDate(selectedDate))
    setDates(await api.getCalendarDates(year, month + 1))
    setSuccessMsg(`✅ ${count} foto${count > 1 ? 's' : ''} eliminada${count > 1 ? 's' : ''} correctamente`)
    setTimeout(() => setSuccessMsg(''), 3000)
  }
  const selectedPhotos = photos.filter(p => selected.includes(p.id))

  return (
    <>
      <MonthNav year={year} month={month}
        onPrev={() => { const d = new Date(year, month-1, 1); setYear(d.getFullYear()); setMonth(d.getMonth()); setSelectedDate(null) }}
        onNext={() => { const d = new Date(year, month+1, 1); setYear(d.getFullYear()); setMonth(d.getMonth()); setSelectedDate(null) }}
      />
      {dates.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#3a5a7a', fontFamily: "'Nunito',sans-serif", padding: '40px 0' }}>
          <div style={{ fontSize: 40 }}>🚀</div><p>No hay fotos este mes</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
          {dates.map(d => (
            <motion.button key={d.date} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} onClick={() => loadPhotos(d.date)}
              style={{ padding: '10px 16px', borderRadius: 12, background: selectedDate === d.date ? 'linear-gradient(135deg, #1a3a7e, #2a5298)' : 'rgba(255,255,255,0.06)', border: `1.5px solid ${selectedDate === d.date ? 'rgba(100,150,255,0.5)' : 'rgba(100,150,255,0.15)'}`, color: '#e8f0ff', fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              📅 {dayjs(d.date).format('D [de] MMMM')} <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.6 }}>({d.count})</span>
            </motion.button>
          ))}
        </div>
      )}
      <AnimatePresence>
        {selectedDate && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: '#7a9abf', margin: 0 }}>Toca para seleccionar {selected.length > 0 ? `· ${selected.length} seleccionada${selected.length > 1 ? 's' : ''}` : ''}</p>
              {selected.length > 0 && (
                <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setConfirm(true)}
                  style={{ padding: '8px 14px', borderRadius: 10, background: 'linear-gradient(135deg, #7e1a1a, #a02020)', border: '1px solid rgba(255,100,100,0.3)', color: '#ffe8e8', fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
                  🗑 Eliminar ({selected.length})
                </motion.button>
              )}
            </div>
            {loadingPhotos ? <Spinner /> : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {photos.map(photo => (
                  <motion.div key={photo.id} whileHover={{ scale: 1.04 }} onClick={() => toggleSelect(photo.id)}
                    style={{ aspectRatio: '1', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', position: 'relative', border: selected.includes(photo.id) ? '2.5px solid #e05555' : '1.5px solid rgba(100,150,255,0.15)', boxShadow: selected.includes(photo.id) ? '0 0 16px rgba(220,80,80,0.4)' : 'none' }}>
                    <img src={photo.image} alt={photo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {selected.includes(photo.id) && <div style={{ position: 'absolute', inset: 0, background: 'rgba(220,50,50,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>✓</div>}
                    {photo.title && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', padding: '8px 6px 4px' }}><p style={{ margin: 0, fontSize: 9, color: '#e8f0ff', fontFamily: "'Nunito',sans-serif", fontWeight: 700 }}>{photo.title}</p></div>}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <SuccessMsg msg={successMsg} />
      <AnimatePresence>
        {confirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(5,13,26,0.92)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              style={{ width: '100%', maxWidth: 380, background: 'linear-gradient(160deg, #0a1628, #0d1f3c)', border: '1px solid rgba(220,80,80,0.3)', borderRadius: 24, padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
              <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: 24, color: '#e8f0ff', margin: '0 0 8px' }}>¿Confirmas eliminar?</h3>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: '#7a9abf', marginBottom: 16 }}>
                Vas a eliminar <strong style={{ color: '#e8a0a0' }}>{selected.length} foto{selected.length > 1 ? 's' : ''}</strong> del{' '}
                <strong style={{ color: '#a8c8f0' }}>{dayjs(selectedDate).format('D [de] MMMM')}</strong>.<br />Esta acción no se puede deshacer.
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
                {selectedPhotos.map(p => <img key={p.id} src={p.image} alt={p.title} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '2px solid rgba(220,80,80,0.4)' }} />)}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setConfirm(false)}
                  style={{ flex: 1, padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(100,150,255,0.2)', color: '#a8c8f0', fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>Cancelar</motion.button>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleDelete} disabled={deleting}
                  style={{ flex: 1, padding: 12, borderRadius: 12, background: 'linear-gradient(135deg, #7e1a1a, #a02020)', border: '1px solid rgba(255,100,100,0.3)', color: '#ffe8e8', fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                  {deleting ? '...' : 'Sí, eliminar 🗑'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Tab Subir ─────────────────────────────────────────────────
function TabSubir({ onUploaded }) {
  const [takenAt, setTakenAt]     = useState(dayjs().format('YYYY-MM-DD'))
  const [title, setTitle]         = useState('')
  const [isCover, setIsCover]     = useState(false)
  const [files, setFiles]         = useState([])
  const [previews, setPreviews]   = useState([])
  const [uploading, setUploading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg]   = useState('')
  const fileRef = useRef(null)

  function handleFiles(sel) {
    const arr = Array.from(sel)
    setFiles(arr); setPreviews(arr.map(f => URL.createObjectURL(f)))
  }
  function handleDrop(e) { e.preventDefault(); handleFiles(e.dataTransfer.files) }
  function removeFile(idx) { setFiles(files.filter((_, i) => i !== idx)); setPreviews(previews.filter((_, i) => i !== idx)) }

  async function handleUpload() {
    if (!files.length) { setErrorMsg('Selecciona al menos una foto'); return }
    if (!takenAt) { setErrorMsg('Ingresa la fecha'); return }
    setErrorMsg(''); setUploading(true)
    const formData = new FormData()
    files.forEach(f => formData.append('images', f))
    formData.append('taken_at', takenAt)
    formData.append('title', title)
    formData.append('is_cover', isCover ? 'true' : 'false')
    try {
      const res = await api.uploadPhotos(formData)
      setSuccessMsg(`✅ ${res.total} foto${res.total > 1 ? 's' : ''} subida${res.total > 1 ? 's' : ''} correctamente${isCover ? ' · portada actualizada 🖼' : ''}`)
      setFiles([]); setPreviews([]); setTitle(''); setIsCover(false)
      setTimeout(() => setSuccessMsg(''), 4000)
      onUploaded()
    } catch { setErrorMsg('Error al subir. Intenta de nuevo.') }
    setUploading(false)
  }

  return (
    <div>
      <Label>📅 Fecha de las fotos</Label>
      <input type="date" value={takenAt} onChange={e => setTakenAt(e.target.value)} style={{ ...inputStyle, marginBottom: 16 }} />
      <Label>🏷 Título (opcional)</Label>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Primer mes de Juan Sebastián" style={{ ...inputStyle, marginBottom: 16 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div onClick={() => setIsCover(!isCover)}
          style={{ width: 44, height: 24, borderRadius: 12, cursor: 'pointer', background: isCover ? 'linear-gradient(135deg, #1a3a7e, #2a5298)' : 'rgba(255,255,255,0.1)', border: `1.5px solid ${isCover ? 'rgba(100,150,255,0.5)' : 'rgba(100,150,255,0.2)'}`, position: 'relative', transition: 'all 0.2s', flexShrink: 0 }}>
          <motion.div animate={{ x: isCover ? 22 : 2 }} transition={{ type: 'spring', stiffness: 300 }}
            style={{ position: 'absolute', top: 2, width: 16, height: 16, borderRadius: '50%', background: isCover ? '#e8f0ff' : '#3a5a7a' }} />
        </div>
        <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: isCover ? '#a8c8f0' : '#3a5a7a', fontWeight: 700 }}>🖼 Portada del mes <span style={{ fontSize: 11, opacity: 0.6 }}>(reemplaza la anterior)</span></span>
      </div>
      <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current?.click()}
        style={{ border: '2px dashed rgba(100,150,255,0.3)', borderRadius: 16, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', background: 'rgba(100,150,255,0.04)', marginBottom: 16 }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>📸</div>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, color: '#4a6fa5', margin: 0, fontWeight: 700 }}>Arrastra fotos aquí o toca para seleccionar</p>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: '#2a3a5a', margin: '4px 0 0' }}>JPG, PNG, WEBP — múltiples archivos</p>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={e => handleFiles(e.target.files)} style={{ display: 'none' }} />
      </div>
      {previews.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
          {previews.map((src, i) => (
            <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ aspectRatio: '1', borderRadius: 10, overflow: 'hidden', position: 'relative', border: '1.5px solid rgba(100,150,255,0.2)' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={e => { e.stopPropagation(); removeFile(i) }}
                style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: '50%', background: 'rgba(220,50,50,0.8)', border: 'none', color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </motion.div>
          ))}
        </div>
      )}
      <AnimatePresence>
        {errorMsg && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: '#e07070', marginBottom: 12, textAlign: 'center' }}>{errorMsg}</motion.p>}
      </AnimatePresence>
      <motion.button onClick={handleUpload} disabled={uploading || !files.length}
        whileHover={!uploading && files.length ? { scale: 1.03 } : {}}
        whileTap={!uploading && files.length ? { scale: 0.97 } : {}}
        style={{ width: '100%', padding: 14, borderRadius: 14, background: files.length && !uploading ? 'linear-gradient(135deg, #1a3a7e, #2a5298)' : 'rgba(255,255,255,0.05)', border: `1.5px solid ${files.length && !uploading ? 'rgba(100,150,255,0.4)' : 'rgba(100,150,255,0.1)'}`, color: files.length && !uploading ? '#e8f0ff' : '#2a4a6a', fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, cursor: files.length && !uploading ? 'pointer' : 'default', letterSpacing: 1 }}>
        {uploading ? '⏳ Subiendo...' : `📤 Subir ${files.length > 0 ? files.length + ' foto' + (files.length > 1 ? 's' : '') : 'fotos'}`}
      </motion.button>
      <SuccessMsg msg={successMsg} />
    </div>
  )
}

// ─── Página principal ──────────────────────────────────────────
export default function GestionPage({ onBack }) {
  const [cedula, setCedula] = useState(null)
  const [tab, setTab]       = useState('eliminar')
  const [year, setYear]     = useState(new Date().getFullYear())
  const [month, setMonth]   = useState(new Date().getMonth())
  const [dates, setDates]   = useState([])

  useEffect(() => {
    if (!cedula) return
    api.getCalendarDates(year, month + 1).then(setDates).catch(() => {})
  }, [cedula, year, month])

  function refreshDates() {
    api.getCalendarDates(year, month + 1).then(setDates).catch(() => {})
  }

  if (!cedula) return <LoginScreen onLogin={setCedula} />

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #050d1a, #0a1628, #0d1f3c)', padding: '24px 16px' }}>
      <div style={{ maxWidth: 540, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onBack}
            style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(100,150,255,0.2)', color: '#a8c8f0', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</motion.button>
          <div>
            <h1 style={{ fontFamily: "'Dancing Script',cursive", fontSize: 28, color: '#e8f0ff', margin: 0 }}>Gestión de Fotos</h1>
            <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: '#3a5a7a', margin: 0 }}>🔐 Sesión activa</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 4 }}>
          {[{ key: 'eliminar', label: '🗑 Eliminar fotos' }, { key: 'subir', label: '📤 Subir fotos' }].map(t => (
            <motion.button key={t.key} onClick={() => setTab(t.key)} whileTap={{ scale: 0.97 }}
              style={{ flex: 1, padding: '11px 8px', borderRadius: 11, background: tab === t.key ? 'linear-gradient(135deg, #1a3a7e, #2a5298)' : 'transparent', border: 'none', color: tab === t.key ? '#e8f0ff' : '#3a5a7a', fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
              {t.label}
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {tab === 'eliminar'
              ? <TabEliminar cedula={cedula} year={year} month={month} setYear={setYear} setMonth={setMonth} dates={dates} setDates={setDates} />
              : <TabSubir onUploaded={refreshDates} />
            }
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
