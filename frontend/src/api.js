const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const api = {
  /** Verificar cédula de admin */
  async authAdmin(cedula) {
    const res = await fetch(`${API_URL}/auth/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cedula }),
    })
    return res.json()
  },

  /** Días con fotos en un mes */
  async getCalendarDates(year, month) {
    const res = await fetch(`${API_URL}/photos/calendar/?year=${year}&month=${month}`)
    if (!res.ok) throw new Error('Error cargando calendario')
    return res.json()
  },

  /** Fotos de una fecha específica */
  async getPhotosByDate(date) {
    const res = await fetch(`${API_URL}/photos/?date=${date}`)
    if (!res.ok) throw new Error('Error cargando fotos')
    return res.json()
  },

  /** Portada de un mes (carrusel) */
  async getMonthCover(year, month) {
    const res = await fetch(`${API_URL}/photos/cover/?year=${year}&month=${month}`)
    if (!res.ok) return { images: [] }
    return res.json()
  },

  /** Borrar foto por ID */
  async deletePhoto(id, cedula) {
    const res = await fetch(`${API_URL}/photos/${id}/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cedula }),
    })
    if (!res.ok) throw new Error('Error borrando foto')
    return res.json()
  },

  /** Subir fotos */
  async uploadPhotos(formData) {
    const res = await fetch(`${API_URL}/photos/upload/`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) throw new Error('Error subiendo fotos')
    return res.json()
  },
}
