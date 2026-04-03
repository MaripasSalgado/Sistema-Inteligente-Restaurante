import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sendAlertMail } from './mailerService.js';

dotenv.config();
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/api/enviar-alerta', async (req, res) => {
  const { insumo, cantidad, usuario_id } = req.body;
  try {
    await sendAlertMail(
      process.env.ADMIN_EMAILS,
      '⚠ Alerta de consumo anormal',
      `<p>Se detectó un consumo anormal:</p>
       <strong>${cantidad}</strong> en lote ${insumo} (Usuario: ${usuario_id})`
    );
    res.json({ ok: true, message: 'Email enviado' });
  } catch (err) {
    console.error('❌ Error enviando email:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {});
