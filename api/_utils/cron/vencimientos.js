import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  const hoy = new Date();
  const en3Dias = new Date();
  en3Dias.setDate(hoy.getDate() + 3);

  const { data: lotes } = await supabase
    .from('lotes_insumos')
    .select('lote, fecha_vencimiento, cantidad_actual, insumo:insumo_id(nombre)')
    .lte('fecha_vencimiento', en3Dias.toISOString())
    .gt('cantidad_actual', 0);

  if (!lotes || lotes.length === 0) return res.status(200).send('Clean');

  const lista = lotes.map(l => `- ${l.insumo.nombre} (Lote: ${l.lote}, Vence: ${new Date(l.fecha_vencimiento).toLocaleDateString()})`).join('\n');
  
  await supabase.from('alertas_consumo').insert([{
    tipo_alerta: 'vencimiento',
    mensaje: `Se detectaron insumos críticos:\n${lista}`,
    estado: 'pendiente'
  }]);

  res.status(200).send('Alert created');
}