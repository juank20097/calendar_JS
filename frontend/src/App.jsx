import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CoverPage from './components/CoverPage'
import MonthView from './components/MonthView'
import AccessModal, { isVerified } from './components/AccessModal'
import GestionPage from './components/GestionPage'
import AboutPage from './components/AboutPage'

export default function App() {
  const [view, setView]             = useState('cover')
  const [showModal, setShowModal]   = useState(false)
  const [currentMonth, setCurrentMonth] = useState({ year: 2026, month: 4 })

  // Acceso a gestión: doble tap en el título
  const [tapCount, setTapCount]     = useState(0)
  function handleTitleTap() {
    const next = tapCount + 1
    if (next >= 5) { setView('gestion'); setTapCount(0) }
    else { setTapCount(next); setTimeout(() => setTapCount(0), 2000) }
  }

  function handleEnterCalendar() {
    if (isVerified()) {
      setView('month')
    } else {
      setShowModal(true)
    }
  }

  function handleAccessGranted() {
    setShowModal(false)
    setView('month')
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {view === 'gestion' ? (
        <GestionPage onBack={() => setView('cover')} />
      ) : view === 'about' ? (
        <AboutPage onBack={() => setView('cover')} />
      ) : view === 'cover' ? (
          <motion.div
            key="cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.4 } }}
          >
            <CoverPage onEnter={handleEnterCalendar} onTitleTap={handleTitleTap} onAbout={() => setView('about')} />
          </motion.div>
          ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120 }}
          >
            <MonthView
              year={currentMonth.year}
              month={currentMonth.month}
              onBack={() => setView('cover')}
              onPrev={() => {
                const d = new Date(currentMonth.year, currentMonth.month - 1, 1)
                setCurrentMonth({ year: d.getFullYear(), month: d.getMonth() })
              }}
              onNext={() => {
                const d = new Date(currentMonth.year, currentMonth.month + 1, 1)
                setCurrentMonth({ year: d.getFullYear(), month: d.getMonth() })
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de acceso familiar */}
      <AnimatePresence>
        {showModal && (
          <AccessModal onSuccess={handleAccessGranted} />
        )}
      </AnimatePresence>
    </>
  )
}
