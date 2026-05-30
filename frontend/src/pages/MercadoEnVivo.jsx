import React from 'react';

export default function MercadoEnVivo({ precios, balances, oportunidad, tema }) {
  const exchanges = Object.keys(precios);

  const det = oportunidad?.detalles ?? {};
  const feeCompra     = det.costoCompraUsd   ? det.costoCompraUsd - (det.volumenBtc ?? 0) * (det.precioCompra ?? 0) : null;
  const totalDescuentos = [
    det.penalizacionLatenciaUsd,
    det.costoRetiroUsd,
  ].filter(Boolean).reduce((a, b) => a + b, 0);

  const celda = {
    display: 'flex', justifyContent: 'space-between',
    borderBottom: `1px dashed ${tema.border}`, paddingBottom: '8px',
    fontFamily: 'monospace', fontSize: '11px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

        {/* BLOQUE 1 — TABLA DE PRECIOS */}
        <div style={{
          border: `1px solid ${tema.border}`, padding: '24px',
          backgroundColor: tema.cardBg, borderRadius: '4px'
        }}>
          <span style={{
            fontSize: '11px', fontFamily: 'monospace', color: tema.grisTexto,
            fontWeight: 'bold', display: 'block', marginBottom: '12px'
          }}>
            PRECIOS EN VIVO
          </span>

          <div style={{
            display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 0.8fr',
            fontSize: '9px', fontFamily: 'monospace', color: tema.grisTexto,
            textTransform: 'uppercase', paddingBottom: '6px',
            borderBottom: `1px solid ${tema.border}`, marginBottom: '6px'
          }}>
            <span>Exchange</span>
            <span style={{ textAlign: 'right' }}>Ask (compra)</span>
            <span style={{ textAlign: 'right' }}>Bid (venta)</span>
            <span style={{ textAlign: 'right' }}>Liquidez Ask</span>
            <span style={{ textAlign: 'right' }}>Lat.</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '300px', overflowY: 'auto' }}>
            {exchanges.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: tema.grisTexto, fontSize: '12px' }}>
                Conectando exchanges...
              </div>
            ) : exchanges.map((id) => {
              const p = precios[id];
              const esMejorCompra = det.comprarEn === id;
              const esMejorVenta  = det.venderEn  === id;
              const destacado = esMejorCompra || esMejorVenta;

              return (
                <div key={id} style={{
                  display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 0.8fr',
                  backgroundColor: destacado ? 'rgba(16,185,129,0.05)' : tema.bg,
                  padding: '8px', border: `1px solid ${destacado ? tema.verde : tema.border}`,
                  fontSize: '11px', fontFamily: 'monospace', borderRadius: '2px'
                }}>
                  <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {id}{esMejorCompra ? ' ▼' : esMejorVenta ? ' ▲' : ''}
                  </span>
                  <span style={{ textAlign: 'right', color: tema.rojo }}>
                    ${(p?.precioCompra ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span style={{ textAlign: 'right', color: tema.verde }}>
                    ${(p?.precioVenta ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span style={{ textAlign: 'right', color: tema.grisTexto }}>
                    {(p?.cantidadCompra ?? 0) > 0 ? `${(p.cantidadCompra).toFixed(3)} BTC` : '—'}
                  </span>
                  <span style={{ textAlign: 'right', color: tema.grisTexto }}>
                    {p?.latenciaMs ?? '—'}ms
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* BLOQUE 4 — BALANCES */}
        <div style={{
          border: `1px solid ${tema.border}`, padding: '24px',
          backgroundColor: tema.cardBg, borderRadius: '4px'
        }}>
          <span style={{
            fontSize: '11px', fontFamily: 'monospace', color: tema.grisTexto,
            fontWeight: 'bold', display: 'block', marginBottom: '12px'
          }}>
            BALANCES POR WALLET
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '300px', overflowY: 'auto' }}>
            {Object.keys(balances).map((id) => (
              <div key={id} style={{
                display: 'flex', justifyContent: 'space-between',
                backgroundColor: tema.bg, padding: '8px 12px',
                border: `1px solid ${tema.border}`,
                fontSize: '11px', fontFamily: 'monospace', borderRadius: '2px'
              }}>
                <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{id}</span>
                <span>${(balances[id]?.USDT ?? 0).toFixed(2)} USDT</span>
                <span style={{ color: tema.grisTexto }}>{(balances[id]?.BTC ?? 0).toFixed(4)} BTC</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

        {/* BLOQUE 2 — MAPA DE CALOR */}
        <div style={{
          border: `1px solid ${tema.border}`, padding: '24px',
          backgroundColor: tema.cardBg, borderRadius: '4px', overflowX: 'auto'
        }}>
          <span style={{
            fontSize: '11px', fontFamily: 'monospace', color: tema.grisTexto,
            fontWeight: 'bold', display: 'block', marginBottom: '16px'
          }}>
            MAPA SPREAD BRUTO (bid destino − ask origen)
          </span>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `80px repeat(${exchanges.length}, 1fr)`,
            gap: '3px', fontFamily: 'monospace', fontSize: '9px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '8px', color: tema.grisTexto, alignSelf: 'end', paddingBottom: '4px' }}>
              compra↓ venta→
            </div>
            {exchanges.map(ex => (
              <div key={ex} style={{ fontWeight: 'bold', textTransform: 'uppercase', color: tema.grisTexto, paddingBottom: '4px' }}>
                {ex.slice(0,4)}
              </div>
            ))}

            {exchanges.map((exOrigen) => (
              <React.Fragment key={exOrigen}>
                <div style={{
                  fontWeight: 'bold', textTransform: 'uppercase',
                  textAlign: 'right', paddingRight: '8px', color: tema.grisTexto,
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end'
                }}>
                  {exOrigen.slice(0,4)}
                </div>

                {exchanges.map((exDestino) => {
                  if (exOrigen === exDestino) {
                    return (
                      <div key={exDestino} style={{ padding: '5px 0', backgroundColor: tema.border, color: tema.grisTexto, borderRadius: '2px' }}>
                        —
                      </div>
                    );
                  }

                  const askOrigen  = precios[exOrigen]?.precioCompra  ?? 0;
                  const bidDestino = precios[exDestino]?.precioVenta   ?? 0;
                  const spreadUsd  = bidDestino - askOrigen;
                  const esPositivo = spreadUsd > 0;

                  return (
                    <div key={exDestino} style={{
                      padding: '5px 2px', borderRadius: '2px',
                      backgroundColor: esPositivo ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.06)',
                      color: esPositivo ? tema.verde : tema.grisTexto,
                      fontWeight: esPositivo ? 'bold' : 'normal',
                      border: esPositivo ? `1px solid rgba(16,185,129,0.3)` : 'none',
                      fontSize: '9px'
                    }}>
                      {esPositivo ? '+' : ''}{spreadUsd.toFixed(0)}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* BLOQUE 3 — DESGLOSE DE COSTOS REALES */}
        <div style={{
          border: `1px solid ${tema.border}`, padding: '24px',
          backgroundColor: tema.cardBg, borderRadius: '4px',
          fontFamily: 'monospace', fontSize: '11px'
        }}>
          <span style={{
            fontSize: '11px', color: tema.grisTexto,
            fontWeight: 'bold', display: 'block', marginBottom: '16px'
          }}>
            DESGLOSE COSTOS PAR ÓPTIMO
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={celda}>
              <span style={{ color: tema.grisTexto }}>Par analizado</span>
              <span style={{ color: tema.verde, fontWeight: 'bold' }}>
                {det.direccion ?? 'Sin par activo'}
              </span>
            </div>
            <div style={celda}>
              <span>Spread bruto</span>
              <span>${(det.spreadBrutoUsd ?? 0).toFixed(2)}</span>
            </div>
            <div style={celda}>
              <span>Costo total compra (ask + fee + slip)</span>
              <span style={{ color: tema.rojo }}>-${(det.costoCompraUsd ?? 0).toFixed(4)}</span>
            </div>
            <div style={celda}>
              <span>Ingreso total venta (bid - fee - slip)</span>
              <span style={{ color: tema.verde }}>+${(det.ingresoVentaUsd ?? 0).toFixed(4)}</span>
            </div>
            <div style={celda}>
              <span>Withdrawal fee</span>
              <span style={{ color: tema.rojo }}>-${(det.costoRetiroUsd ?? 0).toFixed(4)}</span>
            </div>
            <div style={celda}>
              <span>Penalización latencia ({det.latenciaDiferenciaMs ?? 0}ms)</span>
              <span style={{ color: tema.rojo }}>-${(det.penalizacionLatenciaUsd ?? 0).toFixed(4)}</span>
            </div>
            <div style={{
              ...celda, borderBottom: 'none', paddingTop: '8px',
              borderTop: `1px solid ${tema.border}`, fontWeight: 'bold', fontSize: '13px'
            }}>
              <span>GANANCIA NETA</span>
              <span style={{ color: (det.gananciaNetaUsd ?? 0) > 0 ? tema.verde : tema.rojo }}>
                ${(det.gananciaNetaUsd ?? 0).toFixed(4)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
