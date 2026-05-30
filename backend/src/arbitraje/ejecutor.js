import { ALMACEN } from '../state/almacen.js';
import { CONFIGURACION } from '../configuracion.js';

export function ejecutarOperacionSimulada(oportunidad) {
  const { comprarEn, venderEn, precioCompra, precioVenta, volumenBtc, gananciaNetaUsd, tipo } = oportunidad.detalles;
  let balances = ALMACEN.getBalances();

  if (!balances[comprarEn] || !balances[venderEn]) {
    oportunidad.esViable = false;
    oportunidad.detalles.razonDescarte = 'EXCHANGE_WALLET_NOT_INITIALIZED';
    return false;
  }

  const costoUsdRequerido = precioCompra * volumenBtc;
  if (balances[comprarEn].USDT < costoUsdRequerido || balances[venderEn].BTC < volumenBtc) {
    console.log(`[SIMULADOR] 🔄 Fondos insuficientes en ruta ${comprarEn} ➔ ${venderEn}. Ejecutando rebalanceo automático...`);
    
    balances[comprarEn] = { ...CONFIGURACION.balancesIniciales[comprarEn] };
    balances[venderEn] = { ...CONFIGURACION.balancesIniciales[venderEn] };
    ALMACEN.setBalances(balances);
  }

  if (balances[comprarEn].USDT < costoUsdRequerido) {
    oportunidad.esViable = false;
    oportunidad.detalles.razonDescarte = 'INSUFFICIENT_WALLET_BALANCE';
    return false;
  }
  if (balances[venderEn].BTC < volumenBtc) {
    oportunidad.esViable = false;
    oportunidad.detalles.razonDescarte = 'INSUFFICIENT_CRYPTO_LIQUIDITY';
    return false;
  }

  balances[comprarEn].USDT -= costoUsdRequerido;
  balances[comprarEn].BTC += volumenBtc;

  balances[venderEn].BTC -= volumenBtc;
  balances[venderEn].USDT += (precioVenta * volumenBtc);

  ALMACEN.setBalances(balances);

  const nuevoTrade = {
    id: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    ts: Date.now(),
    tipo: tipo || 'ESPACIAL',
    direccion: oportunidad.detalles.direccion,
    comprarEn,
    venderEn,
    volumenBtc,
    precioCompra,
    precioVenta,
    gananciaNetaUsd
  };

  ALMACEN.registrarTrade(nuevoTrade);
  
  if (typeof ALMACEN.actualizarEstadisticas === 'function') {
    ALMACEN.actualizarEstadisticas(gananciaNetaUsd);
  }

  return true;
}
