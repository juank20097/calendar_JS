import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { api } from '../api'

dayjs.locale('es')

export default function PhotoModal({ date, onClose }) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    api.getPhotosByDate(date)
      .then(data => { setPhotos(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [date])

  const formattedDate = dayjs(date).format('D [de] MMMM [de] YYYY')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        background: 'rgba(5,13,26,0.85)', backdropFilter: 'blur(12px)',
      }}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 460,
          background: 'linear-gradient(160deg, #0a1628, #0d1f3c)',
          border: '1px solid rgba(100,150,255,0.25)',
          borderRadius: 24,
          overflow: 'hidden',
          maxHeight: '85vh',
          boxShadow: '0 0 60px rgba(30,80,200,0.3)',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0a2060, #1a3a8e)',
          padding: '20px 20px 16px',
          textAlign: 'center',
          position: 'relative',
          borderBottom: '1px solid rgba(100,150,255,0.2)',
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 14, right: 14,
            width: 30, height: 30, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#a8c8f0', fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>

          <div style={{ fontSize: 36, marginBottom: 6 }}>🌌</div>
          <h3 style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 24, color: '#e8f0ff',
            textShadow: '0 0 20px rgba(100,160,255,0.5)',
            margin: '0 0 4px',
          }}>
            {formattedDate}
          </h3>
          <p style={{ color: '#4a6fa5', fontSize: 13, fontFamily: "'Nunito',sans-serif" }}>
            {photos.length} {photos.length === 1 ? 'recuerdo' : 'recuerdos'} de este día ✨
          </p>
        </div>

        {/* Fotos */}
        <div style={{ padding: 16, overflowY: 'auto', maxHeight: 'calc(85vh - 130px)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{ fontSize: 40, display: 'inline-block' }}>⭐</motion.div>
            </div>
          ) : photos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#3a5a7a', fontFamily: "'Nunito',sans-serif" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🚀</div>
              <p>No hay fotos para este día</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {photos.map((photo, i) => (
                <motion.div key={photo.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.04 }}
                  onClick={() => setLightbox(photo)}
                  style={{
                    aspectRatio: '1', borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
                    border: '1px solid rgba(100,150,255,0.2)',
                    boxShadow: '0 4px 16px rgba(20,60,200,0.2)',
                  }}
                >
                  <img src={photo.image} alt={photo.title || date}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Lightbox */}
      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.9)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px',
          }}
        >
          <motion.img
            initial={{ scale: 0.85 }} animate={{ scale: 1 }}
            src={lightbox.image} alt={lightbox.title}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 16, objectFit: 'contain' }}
          />
          {lightbox.title && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onClick={e => e.stopPropagation()}
              style={{
                margin: '10px 0 0',
                fontFamily: "'Nunito', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: '#a8c8f0',
                textAlign: 'center',
                letterSpacing: 0.5,
                maxWidth: '85vw',
              }}
            >
              ✨ {lightbox.title}
            </motion.p>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
