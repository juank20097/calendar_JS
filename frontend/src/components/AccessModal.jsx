import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ACCESS_CODE = import.meta.env.VITE_FAMILY_CODE || 'JUANSEBAS2026'
const STORAGE_KEY = 'memorias_access'

export function isVerified() {
  return localStorage.getItem(STORAGE_KEY) === 'ok'
}

export default function AccessModal({ onSuccess }) {
  const [code, setCode]       = useState('')
  const [error, setError]     = useState(false)
  const [shaking, setShaking] = useState(false)
  const inputRef              = useRef(null)

  function handleSubmit() {
    if (code.trim().toUpperCase() === ACCESS_CODE.toUpperCase()) {
      localStorage.setItem(STORAGE_KEY, 'ok')
      onSuccess()
    } else {
      setError(true)
      setShaking(true)
      setTimeout(() => setShaking(false), 600)
      setTimeout(() => setError(false), 2500)
      setCode('')
      inputRef.current?.focus()
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        background: 'rgba(5,13,26,0.88)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <motion.div
        initial={{ scale: 0.75, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.75, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        animate={shaking ? {
          x: [-10, 10, -8, 8, -4, 4, 0],
          scale: 1,
          opacity: 1,
          y: 0,
          transition: { duration: 0.5 }
        } : { scale: 1, opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'linear-gradient(160deg, #0a1628, #0d1f3c)',
          border: '1px solid rgba(100,150,255,0.25)',
          borderRadius: 28,
          padding: '36px 28px',
          boxShadow: '0 0 80px rgba(30,80,200,0.3)',
          textAlign: 'center',
        }}
      >
        {/* Emojis decorativos */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 52, marginBottom: 16 }}
        >
          🚀
        </motion.div>

        {/* Título */}
        <h2 style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: 28,
          color: '#e8f0ff',
          textShadow: '0 0 20px rgba(100,160,255,0.5)',
          margin: '0 0 8px',
        }}>
          ¡Hola, familia! 👋
        </h2>

        {/* Mensaje de Juan Carlos y Sofía */}
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 14,
          color: '#7a9abf',
          lineHeight: 1.7,
          margin: '0 0 8px',
        }}>
          Somos <strong style={{ color: '#a8c8f0' }}>Juan Carlos y Sofía</strong> 💛
        </p>
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 14,
          color: '#7a9abf',
          lineHeight: 1.7,
          margin: '0 0 24px',
        }}>
          Hemos creado este espacio especial para compartir los momentos más bonitos de{' '}
          <strong style={{ color: '#f5c842' }}>Juan Sebastián</strong> con ustedes.
          Para proteger estos recuerdos, ingresa el código que te compartimos 🌟
        </p>

        {/* Input código */}
        <input
          ref={inputRef}
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ingresa el código familiar"
          autoFocus
          style={{
            width: '100%',
            padding: '14px 18px',
            borderRadius: 14,
            border: `1.5px solid ${error ? '#e05555' : 'rgba(100,150,255,0.3)'}`,
            background: 'rgba(255,255,255,0.05)',
            color: '#e8f0ff',
            fontFamily: "'Nunito', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 3,
            textAlign: 'center',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
        />

        {/* Mensaje error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 13,
                color: '#e07070',
                margin: '8px 0 0',
              }}
            >
              Código incorrecto, inténtalo de nuevo 🌙
            </motion.p>
          )}
        </AnimatePresence>

        {/* Botón */}
        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(100,160,255,0.4)' }}
          whileTap={{ scale: 0.96 }}
          style={{
            marginTop: 20,
            width: '100%',
            padding: '14px',
            borderRadius: 14,
            border: '1.5px solid rgba(100,150,255,0.4)',
            background: 'linear-gradient(135deg, #1a3a7e, #2a5298)',
            color: '#e8f0ff',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: 2,
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          Ver mis recuerdos 🌟
        </motion.button>

        {/* Nota al pie */}
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 12,
          color: '#3a5a7a',
          marginTop: 16,
        }}>
          ¿No tienes el código? Escríbenos 💬
        </p>
      </motion.div>
    </motion.div>
  )
}
