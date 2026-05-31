export const CONFIGURACION = {
  intercambios: {
    binance: { comisionTaker: 0.001, deslizamiento: 0.00005, feeRetiroBtc: 0.0001, nombre: 'Binance' },
    okx: { comisionTaker: 0.001, deslizamiento: 0.00006, feeRetiroBtc: 0.0002, nombre: 'OKX' },
    bybit: { comisionTaker: 0.001, deslizamiento: 0.00006, feeRetiroBtc: 0.0002, nombre: 'Bybit' },
    kucoin: { comisionTaker: 0.001, deslizamiento: 0.00008, feeRetiroBtc: 0.0004, nombre: 'KuCoin' },
    kraken: { comisionTaker: 0.0026, deslizamiento: 0.00015, feeRetiroBtc: 0.0001, nombre: 'Kraken' },
    bitfinex: { comisionTaker: 0.002, deslizamiento: 0.00010, feeRetiroBtc: 0.0004, nombre: 'Bitfinex' },
    gate: { comisionTaker: 0.002, deslizamiento: 0.00012, feeRetiroBtc: 0.0005, nombre: 'Gate.io' },
    bitstamp: { comisionTaker: 0.004, deslizamiento: 0.00010, feeRetiroBtc: 0.00005, nombre: 'Bitstamp' },
    coinbase: { comisionTaker: 0.006, deslizamiento: 0.00010, feeRetiroBtc: 0.00001, nombre: 'Coinbase' },
    gemini: { comisionTaker: 0.004, deslizamiento: 0.00020, feeRetiroBtc: 0.0001, nombre: 'Gemini' },
    _default: { comisionTaker: 0.002, deslizamiento: 0.00010, feeRetiroBtc: 0.0002, nombre: 'Genérico' }
  },
  controlRiesgo: {
    volumenOperacionBtc: 0.005,
    margenMinimoGananciaUsd: 0.10,
    maxOperacionesPorMinuto: 100,
    intervaloPollingMs: 1000
  },
  balancesIniciales: {
    binance: { USDT: 5000, BTC: 0.1 },
    okx: { USDT: 5000, BTC: 0.1 },
    bybit: { USDT: 5000, BTC: 0.1 },
    kucoin: { USDT: 5000, BTC: 0.1 },
    kraken: { USDT: 5000, BTC: 0.1 },
    bitfinex: { USDT: 5000, BTC: 0.1 },
    gate: { USDT: 5000, BTC: 0.1 },
    bitstamp: { USDT: 5000, BTC: 0.1 },
    coinbase: { USDT: 5000, BTC: 0.1 },
    gemini: { USDT: 5000, BTC: 0.1 }
  }
};
