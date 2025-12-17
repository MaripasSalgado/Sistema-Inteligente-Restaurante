/**
 * Helper para convertir entre dólares (DB) y colones (UI)
 * Tasa de cambio: $1 USD = ₡500 CRC
 */

const EXCHANGE_RATE = 500

/**
 * Convierte dólares a colones para mostrar en UI
 * @param {number} dolares - Valor en dólares
 * @returns {number} - Valor en colones
 */
export function dolaresAColones(dolares) {
  return Number(dolares || 0) * EXCHANGE_RATE
}

/**
 * Convierte colones a dólares para guardar en DB
 * @param {number} colones - Valor en colones
 * @returns {number} - Valor en dólares
 */
export function colonesADolares(colones) {
  return Number(colones || 0) / EXCHANGE_RATE
}

/**
 * Formatea un valor monetario en colones con separadores de miles
 * @param {number} valor - Valor a formatear
 * @returns {string} - Valor formateado (ej: "12,500.00")
 */
export function formatearColones(valor) {
  return new Intl.NumberFormat('es-CR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor || 0)
}

/**
 * Formatea un valor en dólares de la DB a colones formateados para UI
 * @param {number} dolares - Valor en dólares desde DB
 * @returns {string} - Valor en colones formateado
 */
export function formatearDolaresAColones(dolares) {
  const colones = dolaresAColones(dolares)
  return formatearColones(colones)
}
