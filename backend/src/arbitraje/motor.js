import { CONFIGURACION } from '../configuracion.js';
import { calcularRentabilidadNeta } from './calculadora.js';

export function analizarOportunidades(todosLosPrecios) {
  const listaCandidatos = [];
  
  const exchanges = Object.values(todosLosPrecios).filter(ex => ex && !ex.error);
  const volumenBtc = CONFIGURACION.controlRiesgo.volumenOperacionBtc;
  const margenMinimo = CONFIGURACION.controlRiesgo.margenMinimoGananciaUsd;

  let paresEvaluados = 0;

  for (const comprador of exchanges) {
    for (const vendedor of exchanges) {
      if (comprador.intercambio === vendedor.intercambio) continue;
      paresEvaluados++;

      const configComp = CONFIGURACION.intercambios[comprador.intercambio] || CONFIGURACION.intercambios._default;
      const configVend = CONFIGURACION.intercambios[vendedor.intercambio] || CONFIGURACION.intercambios._default;

      const metricaFinanciera = calcularRentabilidadNeta({
        precioCompra: comprador.precioCompra,
        precioVenta: vendedor.precioVenta,
        volumenBtc,
        configComprador: configComp,
        configVendedor: configVend,
        latenciaCompradorMs: comprador.latenciaMs,
        latenciaVendedorMs: vendedor.latenciaMs
      });

      let razonDescarte = null;
      let esViable = metricaFinanciera.gananciaNetaUsd >= margenMinimo;

      if (vendedor.precioVenta <= comprador.precioCompra) {
        razonDescarte = 'SPREAD_BRUTO_NEGATIVO';
        esViable = false;
      } else if (!esViable) {
        razonDescarte = 'INSIGNIFICANT_NET_PROFIT_POST_FEES_AND_WITHDRAWAL';
      }

      listaCandidatos.push({
        esViable,
        exchangesActivos: exchanges.length,
        paresEvaluados,
        detalles: {
          comprarEn: comprador.intercambio,
          venderEn: vendedor.intercambio,
          precioCompra: comprador.precioCompra,
          precioVenta: vendedor.precioVenta,
          volumenBtc,
          esOrdenParcial: false,
          razonDescarte,
          direccion: `${comprador.intercambio.toUpperCase()} ➔ ${vendedor.intercambio.toUpperCase()}`,
          ...metricaFinanciera
        }
      });
    }
  }

  listaCandidatos.sort((a, b) => b.detalles.gananciaNetaUsd - a.detalles.gananciaNetaUsd);

  return listaCandidatos[0] || {
    esViable: false,
    exchangesActivos: exchanges.length,
    paresEvaluados,
    detalles: {
      comprarEn: '', venderEn: '', precioCompra: 0, precioVenta: 0,
      spreadBrutoUsd: 0, gananciaNetaUsd: 0, costoCompraUsd: 0,
      ingresoVentaUsd: 0, costoRetiroUsd: 0, penalizacionLatenciaUsd: 0,
      volumenBtc, esOrdenParcial: false, razonDescarte: 'NO_MARKET_DATA_AVAILABLE',
      direccion: 'ESPERANDO FLUJO DE MERCADO...'
    }
  };
}
