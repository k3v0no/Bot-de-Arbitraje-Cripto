import React from 'react';

export default function Historial({ historial, oportunidades, estadisticas, tema }) {

  const ejecutadas    = estadisticas?.operacionesEjecutadas    ?? 0;
  const descartadas   = estadisticas?.oportunidadesDescartadas ?? 0;
  const gananciaAcum  = estadisticas?.gananciaAcumuladaUsd     ?? 0;
  const mejorGanancia = estadisticas?.mejorGananciaUsd         ?? 0;
  const peorGanancia  = estadisticas?.peorGananciaUsd          ?? 0;

  const totalAnalizados = ejecutadas + descartadas;
  const tasaEjec = totalAnalizados > 0
    ? ((ejecutadas / totalAnalizados) * 100).toFixed(2) + '%'
    : '0.00%';

  const mapaExchanges = estadisticas?.exchangesMasActivos ?? {};
  const exchangeTop = Object.entries(mapaExchanges)
    .sort((a, b) => b[1] - a[1])[0];
  const exchangeTopStr = exchangeTop
    ? `${exchangeTop[0].toUpperCase()} (${exchangeTop[1]}x)`
    : '—';

  const feesTotales = historial.reduce((acc, tx) => acc + (tx.feesPagadosUsd ?? 0), 0);

  const celda = { padding: '8px 0', fontFamily: 'monospace', fontSize: '12px' };
  const th = {
    ...celda, fontSize: '10px', color: tema.grisTexto,
    textTransform: 'uppercase', borderBottom: `1px solid ${tema.border}`,
    paddingBottom: '10px', textAlign: 'left'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── BLOQUE 3 — ESTADÍSTICAS REALES DE SESIÓN ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px', backgroundColor: tema.cardBg,
        padding: '20px', border: `1px solid ${tema.border}`, borderRadius: '4px'
      }}>
        {[
          { label: 'TASA DE EJECUCIÓN',  valor: tasaEjec,                                         color: tema.verde },
          { label: 'MEJOR OPERACIÓN',    valor: `$${mejorGanancia.toFixed(4)}`,                    color: tema.verde },
          { label: 'PEOR OPERACIÓN',     valor: `$${peorGanancia.toFixed(4)}`,                     color: tema.rojo  },
          { label: 'EXCHANGE TOP',       valor: exchangeTopStr,                                    color: tema.texto },
          { label: 'CICLOS DESCARTADOS', valor: descartadas.toLocaleString(),                      color: tema.grisTexto },
          { label: 'FEES TOTALES PAGADOS', valor: `$${feesTotales.toFixed(4)}`,                   color: tema.rojo  },
        ].map(({ label, valor, color }) => (
          <div key={label}>
            <span style={{ color: tema.grisTexto, display: 'block', fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace' }}>
              {label}
            </span>
            <span style={{ fontSize: '15px', fontWeight: 'bold', color, display: 'block', marginTop: '4px', fontFamily: 'monospace' }}>
              {valor}
            </span>
          </div>
        ))}
      </div>

      {/* ── BLOQUE 1 — TABLA DE OPERACIONES EJECUTADAS ── */}
      <div style={{
        border: `1px solid ${tema.border}`, padding: '24px',
        backgroundColor: tema.cardBg, borderRadius: '4px', overflowX: 'auto'
      }}>
        <span style={{
          fontSize: '11px', fontFamily: 'monospace', color: tema.grisTexto,
          fontWeight: 'bold', display: 'block', marginBottom: '12px'
        }}>
          OPERACIONES EJECUTADAS ({ejecutadas})
        </span>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              {['HORA', 'RUTA', 'VOL. BTC', 'PRECIO COMPRA', 'PRECIO VENTA',
                'SPREAD BRUTO', 'FEES + RETIRO', 'GANANCIA NETA', 'PARCIAL'].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {historial.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ ...celda, textAlign: 'center', padding: '24px', color: tema.grisTexto }}>
                  El bot está monitoreando — sin operaciones ejecutadas aún
                </td>
              </tr>
            ) : (
              historial.map((tx) => {
                const feesTotal = (tx.feesPagadosUsd ?? 0) + (tx.costoRetiroUsd ?? 0);
                return (
                  <tr key={tx.id} style={{ borderBottom: `1px solid ${tema.border}` }}>
                    <td style={celda}>{tx.ts ? new Date(tx.ts).toLocaleTimeString() : '—'}</td>
                    <td style={{ ...celda, textTransform: 'uppercase' }}>
                      {tx.comprarEn} → {tx.venderEn}
                    </td>
                    <td style={celda}>{(tx.volumenBtc ?? 0).toFixed(4)}</td>
                    <td style={{ ...celda, color: tema.rojo }}>${(tx.precioCompra ?? 0).toFixed(2)}</td>
                    <td style={{ ...celda, color: tema.verde }}>${(tx.precioVenta ?? 0).toFixed(2)}</td>
                    <td style={celda}>${(tx.spreadBrutoUsd ?? 0).toFixed(2)}</td>
                    <td style={{ ...celda, color: tema.rojo }}>-${feesTotal.toFixed(4)}</td>
                    <td style={{ ...celda, fontWeight: 'bold', color: (tx.gananciaNetaUsd ?? 0) > 0 ? tema.verde : tema.rojo }}>
                      ${(tx.gananciaNetaUsd ?? 0).toFixed(4)}
                    </td>
                    <td style={{ ...celda, color: tx.esOrdenParcial ? tema.rojo : tema.grisTexto }}>
                      {tx.esOrdenParcial ? 'PARCIAL' : '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── BLOQUE 2 — OPORTUNIDADES DESCARTADAS (datos reales) ── */}
      <div style={{
        border: `1px solid ${tema.border}`, padding: '24px',
        backgroundColor: tema.cardBg, borderRadius: '4px', overflowX: 'auto'
      }}>
        <span style={{
          fontSize: '11px', fontFamily: 'monospace', color: tema.grisTexto,
          fontWeight: 'bold', display: 'block', marginBottom: '12px'
        }}>
          OPORTUNIDADES DESCARTADAS (últimas {oportunidades?.length ?? 0})
        </span>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              {['HORA', 'RUTA EVALUADA', 'SPREAD BRUTO', 'GANANCIA NETA', 'RAZÓN DE DESCARTE'].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(!oportunidades || oportunidades.length === 0) ? (
              <tr>
                <td colSpan="5" style={{ ...celda, textAlign: 'center', padding: '24px', color: tema.grisTexto }}>
                  Sin datos de descartes aún
                </td>
              </tr>
            ) : (
              oportunidades
                .filter(op => !op.esViable)
                .slice(0, 50)
                .map((op, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${tema.border}` }}>
                    <td style={{ ...celda, color: tema.grisTexto }}>
                      {op.timestamp ? new Date(op.timestamp).toLocaleTimeString() : '—'}
                    </td>
                    <td style={{ ...celda, textTransform: 'uppercase' }}>
                      {op.direccion ?? '—'}
                    </td>
                    <td style={celda}>${(op.spreadBrutoUsd ?? 0).toFixed(2)}</td>
                    <td style={{ ...celda, color: tema.rojo }}>
                      ${(op.gananciaNetaUsd ?? 0).toFixed(4)}
                    </td>
                    <td style={{ ...celda, color: tema.rojo, fontWeight: 'bold' }}>
                      {op.razonDescarte ?? '—'}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
