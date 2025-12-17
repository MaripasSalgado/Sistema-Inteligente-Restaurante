import { supabase } from '@/config/supabase'

export const AlertaService = {
  // Obtener solo las pendientes para el Dashboard
  async getAlertasPendientes() {
    const { data, error } = await supabase
      .from('alertas_consumo')
      .select(`
        *,
        insumo:insumo_id (nombre, unidad_medida)
      `)
      .eq('estado', 'pendiente')
      .order('fecha_creacion', { ascending: false });

    return { data, error };
  },

  // Cambiar estado a 'atendida' o 'ignorado'
async actualizarEstado(id, nuevoEstado) {
  try {
    const { data, error } = await supabase
      .from('alertas_consumo')
      .update({ estado: nuevoEstado }) 
      .eq('id', id)
      .select();

    if (error) {
      console.error("Error de Supabase:", error.message, error.details);
    }
    return { data, error };
  } catch (err) {
    console.error("Error inesperado:", err);
    return { data: null, error: err };
  }
},
async getAlertasPendientes() {
  const { data, error } = await supabase
    .from('alertas_consumo')
    .select(`*, insumo:insumo_id (nombre)`)
    .order('fecha_creacion', { ascending: false }); // Quitamos el .eq('estado', 'pendiente')

  return { data, error };
}

};

