import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  const { data: movs } = await supabase
    .from('movimientos_inventario')
    .select('*, insumo:insumo_id(nombre)')
    .eq('tipo_movimiento', 'salida')
    .gt('fecha_movimiento', hace24h)
    .gt('cantidad', 50); // Ajusta este umbral según sea necesario

  if (!movs || movs.length === 0) return res.status(200).send('No anomalies');

  for (const m of movs) {
    await supabase.from('alertas_consumo').insert([{
      insumo_id: m.insumo_id,
      tipo_alerta: 'consumo_anomalo',
      mensaje: `Salida sospechosa detectada:\n- Insumo: ${m.insumo.nombre}\n- Cantidad: ${m.cantidad}\n- Fecha: ${new Date(m.fecha_movimiento).toLocaleString()}`,
      estado: 'pendiente'
    }]);
  }
  res.status(200).send('Anomalies processed');
}