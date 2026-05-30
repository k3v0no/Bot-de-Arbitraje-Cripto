import { CONFIGURACION } from '../configuracion.js';

let precios = {};
let ultimaOportunidad = null;
let balances = { ...CONFIGURACION.balancesIniciales };
let historial = [];

let historialOportunidades = [];

let estadisticas = {
  oportunidadesDetectadas: 0,
  oportunidadesDescartadas: 0,
  operacionesEjecutadas: 0,
  gananciaAcumuladaUsd: 0,
  mejorGananciaUsd: 0,
  peorGananciaUsd: 0,
  exchangesActivos: 0,
  exchangesMasActivos: {},
  iniciadoEn: Date.now(),
  uptimeSegundos: 0
};

export const ALMACEN = {
  getPrecios: () => precios,
  setPrecios: (nuevosPrecios) => { precios = nuevosPrecios; },

  getUltimaOportunidad: () => ultimaOportunidad,
  setUltimaOportunidad: (op) => {
    ultimaOportunidad = op;
    if (op) {
      estadisticas.oportunidadesDetectadas++;
      
      if (!op.esViable && op.detalles) {
        estadisticas.oportunidadesDescartadas++;
        
        historialOportunidades.unshift({
          timestamp: Date.now(),
          esViable: false,
          direccion: op.detalles.direccion || 'ESCANEO_PREVIO',
          spreadBrutoUsd: op.detalles.spreadBrutoUsd || 0,
          gananciaNetaUsd: op.detalles.gananciaNetaUsd || 0,
          razonDescarte: op.detalles.razonDescarte || 'FILTRADO'
        });

        if (historialOportunidades.length > 20) {
          historialOportunidades.pop();
        }
      }
    }
  },

  getBalances: () => balances,
  setBalances: (nuevosBalances) => { balances = nuevosBalances; },

  getHistorial: () => historial,
  getHistorialOportunidades: () => historialOportunidades,

  registrarTrade: (trade) => {
    historial.unshift(trade);
    
    estadisticas.operacionesEjecutadas++;
    estadisticas.gananciaAcumuladaUsd += (trade.gananciaNetaUsd || 0);
    
    if ((trade.gananciaNetaUsd || 0) > estadisticas.mejorGananciaUsd) {
      estadisticas.mejorGananciaUsd = trade.gananciaNetaUsd;
    }
    if ((trade.gananciaNetaUsd || 0) < estadisticas.peorGananciaUsd || estadisticas.peorGananciaUsd === 0) {
      estadisticas.peorGananciaUsd = trade.gananciaNetaUsd;
    }

    if (trade.comprarEn) {
      estadisticas.exchangesMasActivos[trade.comprarEn] = (estadisticas.exchangesMasActivos[trade.comprarEn] || 0) + 1;
    }
    if (trade.venderEn) {
      estadisticas.exchangesMasActivos[trade.venderEn] = (estadisticas.exchangesMasActivos[trade.venderEn] || 0) + 1;
    }

    if (historial.length > 50) historial.pop();
  },

  getEstadisticas: () => {
    estadisticas.uptimeSegundos = Math.floor((Date.now() - estadisticas.iniciadoEn) / 1000);
    return estadisticas;
  }
};
