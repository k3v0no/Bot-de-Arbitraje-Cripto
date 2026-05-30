import { iniciarWebSocketBinance, obtenerDatosBinance } from './binance.js';
import { obtenerDatosKraken } from './kraken.js';
import { obtenerDatosCCXT } from './ccxt.js';

export { iniciarWebSocketBinance };

const REGISTRO = [
  () => obtenerDatosBinance(),
  () => obtenerDatosKraken(),
  () => obtenerDatosCCXT('bybit', 'BTC/USDT'),
  () => obtenerDatosCCXT('okx', 'BTC/USDT'),
  () => obtenerDatosCCXT('kucoin', 'BTC/USDT'),
  () => obtenerDatosCCXT('bitfinex', 'BTC/USD'),
  () => obtenerDatosCCXT('gate', 'BTC/USDT'),
  () => obtenerDatosCCXT('bitstamp', 'BTC/USD'),
  () => obtenerDatosCCXT('gemini', 'BTC/USD'),
  () => obtenerDatosCCXT('coinbase', 'BTC/USD'),
];

export async function obtenerTodosLosPrecios() {
  const resultados = await Promise.allSettled(REGISTRO.map(fn => fn()));

  const preciosUnificados = {};

  resultados.forEach((res) => {
    if (res.status !== 'fulfilled' || !res.value) return;

    const d = res.value;

    if (typeof d.error === 'string' && d.error !== '') return;
    if (d.error === true) return;

    const id = d.intercambio;

    if (!id || !d.precioCompra || !d.precioVenta) return;
    if (isNaN(d.precioCompra) || isNaN(d.precioVenta)) return;

    preciosUnificados[id] = {
      intercambio: id,
      precioCompra: parseFloat(d.precioCompra),
      precioVenta: parseFloat(d.precioVenta),
      cantidadCompra: parseFloat(d.cantidadCompra) || 0,
      cantidadVenta: parseFloat(d.cantidadVenta) || 0,
      latenciaMs: d.latenciaMs || 0,
      ts: d.ts || Date.now(),
      error: false,
    };
  });

  return preciosUnificados;
}
