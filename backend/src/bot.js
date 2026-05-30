import { CONFIGURACION } from './configuracion.js';
import { iniciarWebSocketBinance, obtenerTodosLosPrecios } from './exchanges/index.js'; 
import { analizarOportunidades } from './arbitraje/motor.js';
import { ejecutarOperacionSimulada } from './arbitraje/ejecutor.js';
import { ALMACEN } from './state/almacen.js';

let operacionesEsteMinuto = 0;

setInterval(() => {
  operacionesEsteMinuto = 0;
}, 60000);

export function iniciarBotCore() {
  iniciarWebSocketBinance();

  setInterval(async () => {
    try {
      const precios = await obtenerTodosLosPrecios();
      ALMACEN.setPrecios(precios);

      const oportunidad = analizarOportunidades(precios);

      if (oportunidad.esViable) {
        if (operacionesEsteMinuto >= CONFIGURACION.controlRiesgo.maxOperacionesPorMinuto) {
          oportunidad.esViable = false;
          oportunidad.detalles.razonDescarte = 'AI_CIRCUIT_BREAKER_MAX_TRADES_EXCEEDED';
          ALMACEN.setUltimaOportunidad(oportunidad);
          return;
        }

        const ejecutado = ejecutarOperacionSimulada(oportunidad);
        if (ejecutado) {
          operacionesEsteMinuto++;
        }
      }

      ALMACEN.setUltimaOportunidad(oportunidad);
    } catch (error) {
      console.error("[BOT CORE ERROR]:", error.message);
    }
  }, CONFIGURACION.controlRiesgo.intervaloPollingMs);
}
