export async function obtenerDatosKraken() {
  const tiempoInicio = Date.now();
  try {
    const respuesta = await fetch('https://api.kraken.com/0/public/Ticker?pair=XBTUSD');
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

    const datos = await respuesta.json();
    if (datos.error && datos.error.length > 0) throw new Error(datos.error[0]);

    const datosPar = Object.values(datos.result)[0];

    const precioCompra = parseFloat(datosPar.a[0]);
    const precioVenta = parseFloat(datosPar.b[0]);

    if (isNaN(precioCompra) || isNaN(precioVenta)) {
      throw new Error(`Precios inválidos de Kraken: a=${datosPar.a}, b=${datosPar.b}`);
    }

    return {
      intercambio: 'kraken',
      precioCompra,
      precioVenta,
      cantidadCompra: parseFloat(datosPar.a[2]),
      cantidadVenta: parseFloat(datosPar.b[2]),
      latenciaMs: Date.now() - tiempoInicio,
      timestamp: Date.now(),
      error: null
    };
  } catch (error) {
    return { intercambio: 'kraken', error: error.message, timestamp: Date.now() };
  }
}
