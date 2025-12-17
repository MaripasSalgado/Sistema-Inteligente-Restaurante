/**
 * Helper para manejo de fechas con timezone de Costa Rica
 * Todas las fechas del sistema deben usar esta utilidad para mantener consistencia
 */

// Timezone de Costa Rica
const COSTA_RICA_TZ = 'America/Costa_Rica'

/**
 * Obtiene la fecha/hora actual en timezone de Costa Rica en formato ISO
 * @returns {string} Fecha en formato ISO con timezone de Costa Rica
 */
export const getNowCostaRica = () => {
  return new Date().toLocaleString('en-US', { timeZone: COSTA_RICA_TZ })
}

/**
 * Obtiene la fecha/hora actual en timestamp ISO para Supabase
 * @returns {string} Timestamp en formato ISO
 */
export const getTimestampCostaRica = () => {
  // Crear fecha en timezone de Costa Rica
  const costaRicaDate = new Date(getNowCostaRica())
  return costaRicaDate.toISOString()
}

/**
 * Convierte una fecha local a timestamp para guardar en Supabase
 * @param {string|Date} fecha - Fecha a convertir
 * @returns {string} Timestamp en formato ISO
 */
export const toTimestampCostaRica = (fecha) => {
  if (!fecha) return getTimestampCostaRica()
  
  // Si es string, parsearlo
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha
  
  // Asegurar que se interprete en timezone de Costa Rica
  const costaRicaDate = new Date(date.toLocaleString('en-US', { timeZone: COSTA_RICA_TZ }))
  return costaRicaDate.toISOString()
}

/**
 * Formatea una fecha para mostrar en inputs datetime-local
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha en formato YYYY-MM-DDTHH:mm
 */
export const toDatetimeLocal = (fecha = null) => {
  const date = fecha ? new Date(fecha) : new Date()
  
  // Obtener fecha en timezone de Costa Rica
  const costaRicaDateStr = date.toLocaleString('en-US', { 
    timeZone: COSTA_RICA_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  
  // Convertir "MM/DD/YYYY, HH:mm" a "YYYY-MM-DDTHH:mm"
  const [datePart, timePart] = costaRicaDateStr.split(', ')
  const [month, day, year] = datePart.split('/')
  
  return `${year}-${month}-${day}T${timePart}`
}

/**
 * Formatea una fecha para mostrar en inputs date
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const toDateLocal = (fecha = null) => {
  const date = fecha ? new Date(fecha) : new Date()
  
  // Obtener fecha en timezone de Costa Rica
  const costaRicaDateStr = date.toLocaleString('en-US', { 
    timeZone: COSTA_RICA_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  
  // Convertir "MM/DD/YYYY" a "YYYY-MM-DD"
  const [month, day, year] = costaRicaDateStr.split('/')
  
  return `${year}-${month}-${day}`
}

/**
 * Formatea una fecha para mostrar al usuario en español
 * @param {string|Date} fecha - Fecha a formatear
 * @param {boolean} incluirHora - Si incluir hora o solo fecha
 * @returns {string} Fecha formateada
 */
export const formatearFecha = (fecha, incluirHora = true) => {
  if (!fecha) return '-'
  
  const date = new Date(fecha)
  
  const opciones = {
    timeZone: COSTA_RICA_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
  
  if (incluirHora) {
    opciones.hour = '2-digit'
    opciones.minute = '2-digit'
    opciones.hour12 = true
  }
  
  return date.toLocaleString('es-CR', opciones)
}

/**
 * Calcula la diferencia en días entre dos fechas
 * @param {string|Date} fecha1 - Primera fecha
 * @param {string|Date} fecha2 - Segunda fecha (default: hoy)
 * @returns {number} Diferencia en días
 */
export const diferenciaDias = (fecha1, fecha2 = new Date()) => {
  const date1 = new Date(fecha1)
  const date2 = typeof fecha2 === 'string' ? new Date(fecha2) : fecha2
  
  const diffTime = date2 - date1
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

/**
 * Verifica si una fecha está vencida
 * @param {string|Date} fecha - Fecha a verificar
 * @returns {boolean} True si está vencida
 */
export const estaVencido = (fecha) => {
  if (!fecha) return false
  return diferenciaDias(fecha) < 0
}

/**
 * Verifica si una fecha está próxima a vencer (dentro de X días)
 * @param {string|Date} fecha - Fecha a verificar
 * @param {number} diasAlerta - Días de anticipación para alerta (default: 7)
 * @returns {boolean} True si está próximo a vencer
 */
export const proximoVencer = (fecha, diasAlerta = 7) => {
  if (!fecha) return false
  const dias = diferenciaDias(fecha)
  return dias >= 0 && dias <= diasAlerta
}

export default {
  getNowCostaRica,
  getTimestampCostaRica,
  toTimestampCostaRica,
  toDatetimeLocal,
  toDateLocal,
  formatearFecha,
  diferenciaDias,
  estaVencido,
  proximoVencer,
  COSTA_RICA_TZ
}

