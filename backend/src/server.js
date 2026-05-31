import express from 'express';
import cors from 'cors';
import { ALMACEN } from './state/almacen.js';
import { iniciarBotCore } from './bot.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/estado', (req, res) => {
  try {
    const precios = typeof ALMACEN.getPrecios === 'function' ? ALMACEN.getPrecios() : (ALMACEN.precios || {});
    const balances = typeof ALMACEN.getBalances === 'function' ? ALMACEN.getBalances() : (ALMACEN.balances || {});
    const oportunidad = typeof ALMACEN.getUltimaOportunidad === 'function' ? ALMACEN.getUltimaOportunidad() : (ALMACEN.ultimaOportunidad || null);
    
    const estadisticas = typeof ALMACEN.getEstadisticas === 'function' ? ALMACEN.getEstadisticas() : null;
    const historialOportunidades = typeof ALMACEN.getHistorialOportunidades === 'function' ? ALMACEN.getHistorialOportunidades() : [];

    if (estadisticas && precios) {
      estadisticas.exchangesActivos = Object.keys(precios).length;
    }

    res.json({
      precios,
      balances,
      oportunidad,
      estadisticas,
      historialOportunidades
    });
  } catch (error) {
    console.error("Error crítico en endpoint estado:", error.message);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});

app.get('/api/historial', (req, res) => {
  try {
    const limite = parseInt(req.query.limite, 10) || 50;
    const historial = typeof ALMACEN.getHistorial === 'function' ? ALMACEN.getHistorial() : (ALMACEN.historial || []);

    res.json(historial.slice(0, limite));
  } catch (error) {
    console.error("Error en endpoint historial:", error.message);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});

app.get('/health', (req, res) => {
  res.json({ estatus: 'ONLINE', uptime: process.uptime() });
});

const PUERTO = process.env.PORT || process.env.PUERTO || 4000;;
app.listen(PUERTO, () => {
  console.log(` SERVIDOR C.A.T.: http://localhost:${PUERTO}`);
  
  iniciarBotCore();
});
