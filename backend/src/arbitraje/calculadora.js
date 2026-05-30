export function calcularRentabilidadNeta(datos) {
  const {
    precioCompra,
    precioVenta,
    volumenBtc,
    configComprador,
    configVendedor,
    latenciaCompradorMs,
    latenciaVendedorMs
  } = datos;

  const factorDeslizamientoCompra = 1 + (latenciaCompradorMs / 1000) * configComprador.deslizamiento;
  const precioEfectivoCompra = precioCompra * factorDeslizamientoCompra;
  const costoCompraUsd = volumenBtc * precioEfectivoCompra;
  const comisionCompraUsd = costoCompraUsd * configComprador.comisionTaker;
  const costoTotalCompraUsd = costoCompraUsd + comisionCompraUsd;

  const factorDeslizamientoVenta = 1 - (latenciaVendedorMs / 1000) * configVendedor.deslizamiento;
  const precioEfectivoVenta = precioVenta * factorDeslizamientoVenta;
  const ingresoVentaUsd = volumenBtc * precioEfectivoVenta;
  const comisionVentaUsd = ingresoVentaUsd * configVendedor.comisionTaker;
  const ingresoTotalVentaUsd = ingresoVentaUsd - comisionVentaUsd;

  const costoRetiroBtc = configComprador.feeRetiroBtc;
  const costoRetiroUsd = costoRetiroBtc * precioEfectivoVenta;

  const gananciaNetaUsd = ingresoTotalVentaUsd - costoTotalCompraUsd - costoRetiroUsd;
  const penalizacionLatenciaUsd = (costoCompraUsd * 0.0001) * ((latenciaCompradorMs + latenciaVendedorMs) / 100);

  return {
    costoCompraUsd: parseFloat(costoTotalCompraUsd.toFixed(4)),
    ingresoVentaUsd: parseFloat(ingresoTotalVentaUsd.toFixed(4)),
    costoRetiroUsd: parseFloat(costoRetiroUsd.toFixed(4)),
    penalizacionLatenciaUsd: parseFloat(penalizacionLatenciaUsd.toFixed(4)),
    gananciaNetaUsd: parseFloat((gananciaNetaUsd - penalizacionLatenciaUsd).toFixed(4)),
    spreadBrutoUsd: parseFloat((precioVenta - precioCompra).toFixed(2))
  };
}
