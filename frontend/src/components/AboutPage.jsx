import { motion } from 'framer-motion'

const TECH = ['Django', 'Django REST Framework', 'React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'PostgreSQL', 'AWS S3', 'Docker', 'Nginx', 'Gunicorn', 'n8n']

export default function AboutPage({ onBack }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #050d1a 0%, #0a1628 50%, #0d1f3c 100%)',
      padding: '28px 16px 48px',
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>

        {/* Botón volver */}
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={onBack}
          style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(100,150,255,0.2)',
            color: '#a8c8f0', fontSize: 18, cursor: 'pointer',
            marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ←
        </motion.button>

        {/* Card principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          style={{
            background: 'linear-gradient(160deg, #0a1628, #0d1f3c)',
            border: '1px solid rgba(100,150,255,0.2)',
            borderRadius: 28,
            overflow: 'hidden',
            boxShadow: '0 0 60px rgba(30,80,200,0.2)',
          }}
        >
          {/* Header con avatar */}
          <div style={{
            background: 'linear-gradient(135deg, #0a2060, #1a3a8e)',
            padding: '36px 24px 28px',
            textAlign: 'center',
            borderBottom: '1px solid rgba(100,150,255,0.15)',
            position: 'relative',
          }}>
            {/* Avatar */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 90, height: 90, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1a3a7e, #2a5298)',
                border: '3px solid rgba(100,150,255,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 44, margin: '0 auto 16px',
                boxShadow: '0 0 30px rgba(100,160,255,0.3)',
              }}
            >
              👨‍💻
            </motion.div>

            <h1 style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: 28, color: '#e8f0ff',
              textShadow: '0 0 20px rgba(100,160,255,0.5)',
              margin: '0 0 6px',
            }}>
              Juan Carlos Estévez H.
            </h1>
            <p style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 13, fontWeight: 700,
              color: '#f5c842',
              letterSpacing: 2, textTransform: 'uppercase',
              margin: 0,
            }}>
              Solutions Architecture Lead
            </p>
          </div>

          {/* Cuerpo */}
          <div style={{ padding: '24px 20px' }}>

            {/* Contacto */}
            <Section title="📡 Contacto">
              <ContactItem
                icon="💼"
                label="LinkedIn"
                value="juan-carlos-estévez"
                href="https://www.linkedin.com/in/juan-carlos-est%C3%A9vez-hidalgo-18324591/"
              />
              <ContactItem
                icon="🐙"
                label="GitHub"
                value="juank20097"
                href="https://github.com/juank20097"
              />
              <ContactItem
                icon="✉️"
                label="Correo"
                value="juank20097@gmail.com"
                href="mailto:juank20097@gmail.com"
              />
              <ContactItem
                icon="📱"
                label="Celular"
                value="0980365958"
                href="tel:+593980365958"
              />
            </Section>

            <Divider />

            {/* Proyecto */}
            <Section title="🚀 Sobre el Proyecto">
              <InfoRow label="Nombre" value="Memorias JS" />
              <InfoRow label="Versión" value="1.0.0" />
              <InfoRow label="Año" value="2026" />
              <InfoRow label="Propósito" value="Calendario fotográfico privado para compartir los momentos más bonitos de Juan Sebastián con la familia" />
            </Section>

            <Divider />

            {/* Stack tecnológico */}
            <Section title="⚙️ Tecnologías">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {TECH.map(t => (
                  <motion.span
                    key={t}
                    whileHover={{ scale: 1.08 }}
                    style={{
                      padding: '5px 12px', borderRadius: 99,
                      background: 'rgba(100,150,255,0.1)',
                      border: '1px solid rgba(100,150,255,0.25)',
                      color: '#a8c8f0',
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: 12, fontWeight: 700,
                    }}
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </Section>

          </div>

          {/* Footer */}
          <div style={{
            borderTop: '1px solid rgba(100,150,255,0.1)',
            padding: '16px 20px',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 12, color: '#2a4a6a', margin: 0,
            }}>
              Hecho con 💙 para Juan Sebastián · 2026
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <p style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 12, fontWeight: 800,
        color: '#3a5a7a', letterSpacing: 2,
        textTransform: 'uppercase', marginBottom: 12,
      }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function ContactItem({ icon, label, value, href }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ x: 4 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px', borderRadius: 12, marginBottom: 6,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(100,150,255,0.1)',
        textDecoration: 'none', cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <div>
        <p style={{ margin: 0, fontSize: 10, color: '#3a5a7a', fontFamily: "'Nunito',sans-serif", fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
          {label}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: '#a8c8f0', fontFamily: "'Nunito',sans-serif", fontWeight: 600 }}>
          {value}
        </p>
      </div>
      <span style={{ marginLeft: 'auto', color: '#2a4a6a', fontSize: 14 }}>→</span>
    </motion.a>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', gap: 8, marginBottom: 8,
      fontFamily: "'Nunito', sans-serif",
    }}>
      <span style={{ fontSize: 12, color: '#3a5a7a', fontWeight: 700, minWidth: 70, paddingTop: 1 }}>
        {label}
      </span>
      <span style={{ fontSize: 13, color: '#a8c8f0', fontWeight: 600, lineHeight: 1.5 }}>
        {value}
      </span>
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(100,150,255,0.08)', margin: '20px 0' }} />
}
