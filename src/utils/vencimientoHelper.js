/**
 * Calcular criticidad basado en la fecha de vencimiento
 * @param {string|Date} fechaVencimiento
 * @returns {{label: string|null, color: string}}
 */
export function calcularCriticidad(fechaVencimiento) {
  if (!fechaVencimiento) {
    return { label: null, color: "" };
  }

  const hoy = new Date();
  const vencimiento = new Date(fechaVencimiento);

  // Si ya pasó → criticidad nula
  if (vencimiento < hoy.setHours(0, 0, 0, 0)) {
    return { label: null, color: "" };
  }

  const diffMs = vencimiento - hoy;
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // Vence hoy
  if (diffDias === 0) {
    return { label: "Vence hoy", color: "#ff4d4f" };
  }

  // Vence en 1–2 días
  if (diffDias <= 2) {
    return { label: `Vence en ${diffDias} día(s)`, color: "#ff7a45" };
  }

  // Vence esta semana (<7 días)
  if (diffDias <= 7) {
    return { label: "Vence esta semana", color: "#ffa940" };
  }

  // Vence este mes
  const hoyMes = hoy.getMonth();
  const hoyAño = hoy.getFullYear();
  if (vencimiento.getMonth() === hoyMes && vencimiento.getFullYear() === hoyAño) {
    return { label: "Vence este mes", color: "#ffd666" };
  }

  // No es crítico
  return { label: "", color: "" };
}
