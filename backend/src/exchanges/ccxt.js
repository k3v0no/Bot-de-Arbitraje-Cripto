import ccxt from 'ccxt';

const instancias = {};

function obtenerInstancia(exchangeId) {
  if (!instancias[exchangeId]) {
    instancias[exchangeId] = new ccxt[exchangeId]({
      enableRateLimit: true,
      timeout: 5000,
    });
  }
  return instancias[exchangeId];
}

export async function obtenerDatosCCXT(exchangeId, simbolo) {
  const tiempoInicio = Date.now();
  try {
    const exchange = obtenerInstancia(exchangeId);
    const ticker = await exchange.fetchTicker(simbolo);

    const precioCompra = ticker.ask;
    const precioVenta = ticker.bid;

    if (isNaN(precioCompra) || isNaN(precioVenta) || !precioCompra || !precioVenta) {
      throw new Error(`Precios inválidos de ${exchangeId}: ask=${ticker.ask} bid=${ticker.bid}`);
    }

    return {
      intercambio: exchangeId,
      precioCompra,
      precioVenta,
      cantidadCompra: ticker.askVolume ?? 0,
      cantidadVenta: ticker.bidVolume ?? 0,
      latenciaMs: Date.now() - tiempoInicio,
      ts: Date.now(),
      error: null,
    };
  } catch (error) {
    return {
      intercambio: exchangeId,
      error: error.message,
      ts: Date.now(),
    };
  }
}
