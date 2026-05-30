import WebSocket from 'ws';

let memoriaPrecioBinance = {
  intercambio: 'binance',
  precioCompra: 0,
  precioVenta: 0,
  cantidadCompra: 0,     
  cantidadVenta: 0,      
  latenciaMs: 0,
  ts: Date.now(),
  error: false
};

let ws = null;
let reconexionPermitida = true;
let temporizadorReconexion = null;
let ultimoMensajeTs = Date.now();

export function iniciarWebSocketBinance() {
  if (ws) return;

  const urlStream = 'wss://stream.binance.com:9443/ws/btcusdt@bookTicker';
  ws = new WebSocket(urlStream);

  ws.on('message', (data) => {
    try {
      const parsed = JSON.parse(data);
      const ahora = Date.now();

      memoriaPrecioBinance.precioCompra = parseFloat(parsed.a);
      memoriaPrecioBinance.precioVenta = parseFloat(parsed.b);
      memoriaPrecioBinance.cantidadCompra = parseFloat(parsed.A); // ← NUEVO
      memoriaPrecioBinance.cantidadVenta = parseFloat(parsed.B); // ← NUEVO
      memoriaPrecioBinance.latenciaMs = ahora - ultimoMensajeTs; // latencia real entre msgs
      memoriaPrecioBinance.ts = ahora;
      memoriaPrecioBinance.error = false;
      ultimoMensajeTs = ahora;
    } catch (e) {
      memoriaPrecioBinance.error = true;
    }
  });

  ws.on('error', () => {
    memoriaPrecioBinance.error = true;
  });

  ws.on('close', () => {
    ws = null;
    if (reconexionPermitida) {
      temporizadorReconexion = setTimeout(() => {
        iniciarWebSocketBinance();
      }, 5000);
    }
  });
}

async function obtenerPrecioBinanceRestFallback() {
  const tsInicio = Date.now();
  try {
    const respuesta = await fetch(
      'https://api.binance.com/api/v3/ticker/bookTicker?symbol=BTCUSDT'
    );
    const datos = await respuesta.json();
    return {
      intercambio: 'binance',
      precioCompra: parseFloat(datos.askPrice),
      precioVenta: parseFloat(datos.bidPrice),
      cantidadCompra: parseFloat(datos.askQty),
      cantidadVenta: parseFloat(datos.bidQty),
      latenciaMs: Date.now() - tsInicio,
      ts: Date.now(),
      error: false
    };
  } catch (error) {
    return {
      intercambio: 'binance', precioCompra: 0, precioVenta: 0,
      cantidadCompra: 0, cantidadVenta: 0, latenciaMs: 0,
      ts: Date.now(), error: true
    };
  }
}

export async function obtenerDatosBinance() {
  const edadDatosMs = Date.now() - ultimoMensajeTs;
  if (!memoriaPrecioBinance.error && memoriaPrecioBinance.precioCompra > 0 && edadDatosMs < 5000) {
    return memoriaPrecioBinance;
  }
  return await obtenerPrecioBinanceRestFallback();
}
