import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

export default function Dashboard({ oportunidad, historial, estadisticas, tema }) {

  let acumulado = 0;
  const dataGrafica = [...historial].reverse().map((tx) => {
    acumulado += (tx.gananciaNetaUsd || 0);
    return {
      hora: tx.ts ? new Date(tx.ts).toLocaleTimeString() : '—',
      pnl:  parseFloat(acumulado.toFixed(2))
    };
  });

  const uptimeSeg  = estadisticas?.uptimeSegundos ?? 0;
  const uptimeStr  = `${String(Math.floor(uptimeSeg / 3600)).padStart(2,'0')}h ` +
                     `${String(Math.floor((uptimeSeg % 3600) / 60)).padStart(2,'0')}m`;

  const detectadas  = estadisticas?.oportunidadesDetectadas  ?? 0;
  const ejecutadas  = estadisticas?.operacionesEjecutadas    ?? 0;
  const tasaEjec    = detectadas > 0
    ? ((ejecutadas / detectadas) * 100).toFixed(1) + '%'
    : '0.0%';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── BLOQUE 1 — MÉTRICAS DE CABECERA ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px'
      }}>
        {[
          { label: 'P&L ACUMULADO',        valor: `$${(estadisticas?.gananciaAcumuladaUsd ?? 0).toFixed(2)}`,   color: (estadisticas?.gananciaAcumuladaUsd ?? 0) >= 0 ? tema.verde : tema.rojo },
          { label: 'EXCHANGES ACTIVOS',    valor: `${estadisticas?.exchangesActivos ?? 0} / 10`,                color: tema.texto },
          { label: 'OPORT. DETECTADAS',    valor: detectadas.toLocaleString(),                                   color: tema.texto },
          { label: 'OPERACIONES EJEC.',    valor: ejecutadas.toLocaleString(),                                   color: tema.texto },
          { label: 'TASA DE EJECUCIÓN',    valor: tasaEjec,                                                      color: tema.verde },
          { label: 'UPTIME',               valor: uptimeStr,                                                     color: tema.texto },
        ].map(({ label, valor, color }) => (
          <div key={label} style={{
            border: `1px solid ${tema.border}`, padding: '14px 16px',
            backgroundColor: tema.cardBg, borderRadius: '4px'
          }}>
            <span style={{ fontSize: '10px', fontFamily: 'monospace', color: tema.grisTexto, fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
              {label}
            </span>
            <span style={{ fontSize: '18px', fontFamily: 'monospace', fontWeight: 'bold', color }}>
              {valor}
            </span>
          </div>
        ))}
      </div>

      {/* ── BLOQUE 2 — OPORTUNIDAD DEL CICLO ACTUAL ── */}
      <div style={{
        border: `1px solid ${tema.border}`, padding: '24px',
        backgroundColor: tema.cardBg, borderRadius: '4px'
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: `1px solid ${tema.border}`, paddingBottom: '12px', marginBottom: '16px'
        }}>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: tema.grisTexto, fontWeight: 'bold' }}>
            OPORTUNIDAD CICLO ACTUAL
          </span>
          <span style={{
            fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold',
            padding: '2px 8px', borderRadius: '2px',
            backgroundColor: oportunidad?.esViable ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
            color: oportunidad?.esViable ? tema.verde : tema.grisTexto,
            border: `1px solid ${oportunidad?.esViable ? tema.verde : 'transparent'}`
          }}>
            {oportunidad?.esViable ? '✓ EJECUTABLE' : '⚡ ESCANEANDO'}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {/* Dirección */}
          <div style={{ flex: '1', minWidth: '200px' }}>
            <span style={{ fontSize: '10px', color: tema.grisTexto, fontFamily: 'monospace', display: 'block', marginBottom: '4px' }}>
              RUTA DETECTADA
            </span>
            <span style={{ 
              fontSize: '16px', 
              fontFamily: 'monospace', 
              fontWeight: 'bold', 
              color: oportunidad?.detalles?.direccion && oportunidad.detalles.direccion !== "ESPERANDO FLUJO DE MERCADO..." ? tema.verde : tema.grisTexto 
            }}>
              {oportunidad?.detalles?.direccion && oportunidad.detalles.direccion !== "ESPERANDO FLUJO DE MERCADO..." 
                ? oportunidad.detalles.direccion 
                : 'ANALIZANDO LIBROS DE ÓRDENES...'}
            </span>
          </div>

          {[
            { label: 'SPREAD BRUTO',   valor: `$${(oportunidad?.detalles?.spreadBrutoUsd   ?? 0).toFixed(2)}`, color: tema.texto },
            { label: 'GANANCIA NETA',  valor: `$${(oportunidad?.detalles?.gananciaNetaUsd  ?? 0).toFixed(4)}`, color: (oportunidad?.detalles?.gananciaNetaUsd ?? 0) > 0 ? tema.verde : tema.rojo },
            { label: 'PARES EVALUADOS',valor: oportunidad?.paresEvaluados ?? 0,                                color: tema.texto },
          ].map(({ label, valor, color }) => (
            <div key={label} style={{
              padding: '12px 16px', flex: '1', minWidth: '130px',
              backgroundColor: tema.bg, border: `1px solid ${tema.border}`, borderRadius: '4px'
            }}>
              <span style={{ color: tema.grisTexto, fontSize: '10px', fontFamily: 'monospace', display: 'block', marginBottom: '4px' }}>
                {label}
              </span>
              <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '14px', color }}>
                {valor}
              </span>
            </div>
          ))}

          {!oportunidad?.esViable && oportunidad?.detalles?.razonDescarte && (
            <div style={{
              width: '100%', padding: '10px 14px',
              backgroundColor: oportunidad.detalles.razonDescarte === 'NO_MARKET_DATA_AVAILABLE' 
                ? 'rgba(249, 115, 22, 0.05)'  
                : 'rgba(239, 68, 68, 0.05)',  
              border: `1px solid ${
                oportunidad.detalles.razonDescarte === 'NO_MARKET_DATA_AVAILABLE' 
                  ? 'rgba(249, 115, 22, 0.2)' 
                  : 'rgba(239, 68, 68, 0.2)'
              }`, 
              borderRadius: '4px',
              fontFamily: 'monospace', fontSize: '11px', 
              color: oportunidad.detalles.razonDescarte === 'NO_MARKET_DATA_AVAILABLE' ? '#f97316' : tema.rojo
            }}>
              {oportunidad.detalles.razonDescarte === 'NO_MARKET_DATA_AVAILABLE' ? (
                <span>STATUS: <strong>[CONECTADO]</strong> SCONECTANDO APIS // ESPERANDO RECEPCIÓN DE ORDERBOOKS EN BACKEND...</span>
              ) : (
                <span>RAZÓN DE DESCARTE DEL CICLO: {oportunidad.detalles.razonDescarte}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── BLOQUE 3 — GRÁFICA P&L ── */}
      <div style={{
        border: `1px solid ${tema.border}`, padding: '24px',
        backgroundColor: tema.cardBg, borderRadius: '4px'
      }}>
        <span style={{
          fontSize: '11px', fontFamily: 'monospace', color: tema.grisTexto,
          fontWeight: 'bold', display: 'block', marginBottom: '16px'
        }}>
          P&L ACUMULADO TEMPORAL
        </span>
        <div style={{ width: '100%', height: 220 }}>
          {dataGrafica.length === 0 ? (
            <div style={{
              textAlign: 'center', paddingTop: '80px',
              color: tema.grisTexto, fontSize: '12px', fontFamily: 'monospace'
            }}>
              Sin operaciones ejecutadas — el bot está monitoreando el mercado
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataGrafica} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={tema.border} />
                <XAxis dataKey="hora" stroke={tema.grisTexto} style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                <YAxis stroke={tema.grisTexto} style={{ fontSize: '9px', fontFamily: 'monospace' }} unit="$" />
                <Tooltip
                  contentStyle={{ backgroundColor: tema.cardBg, borderColor: tema.border, color: tema.texto, fontFamily: 'monospace', fontSize: '11px' }}
                  formatter={(v) => [`$${v}`, 'P&L acumulado']}
                />
                <Line type="monotone" dataKey="pnl" stroke={tema.verde} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}
