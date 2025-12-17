import { sendEmail } from './_utils/mailer.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  
  const { record } = req.body;
  if (!record || !record.destinatarios || record.destinatarios.length === 0) return res.status(200).send('No recipients');

  const config = {
    stock_bajo: { titulo: 'STOCK BAJO', color: '#e53e3e', asunto: 'Alerta de Inventario: Stock Crítico' },
    consumo_anomalo: { titulo: 'CONSUMO ANÓMALO', color: '#805ad5', asunto: 'Revisión: Movimiento Inusual' },
    vencimiento: { titulo: 'VENCIMIENTOS', color: '#dd6b20', asunto: 'Aviso: Insumos Próximos a Vencer' }
  };

  const tipo = config[record.tipo_alerta] || { titulo: '🔔 ALERTA', color: '#3182ce', asunto: 'Notificación de Sistema' };

  const html = `
    <div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px; max-width: 600px;">
      <h2 style="color: ${tipo.color}; border-bottom: 2px solid ${tipo.color}; padding-bottom: 10px;">${tipo.titulo}</h2>
      <p style="font-size: 16px; white-space: pre-line; color: #333; line-height: 1.5;">${record.mensaje}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 11px; color: #999;">Generado automáticamente por el Sistema de Inventario.</p>
    </div>
  `;

  try {
    await sendEmail(record.destinatarios.join(','), tipo.asunto, html);
    res.status(200).json({ sent: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}