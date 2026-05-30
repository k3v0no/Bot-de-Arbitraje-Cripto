import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import MercadoEnVivo from './pages/MercadoEnVivo';
import Historial from './pages/Historial';

export default function App() {
  const [pestanaActiva, setPestanaActiva] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [statusServidor, setStatusServidor] = useState('OFFLINE');

  const [precios, setPrecios] = useState({});
  const [balances, setBalances] = useState({});
  const [oportunidad, setOportunidad] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [oportunidades, setOportunidades] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resEstado = await fetch('http://localhost:4000/api/estado');
        if (!resEstado.ok) throw new Error('OFFLINE');
        const dataEstado = await resEstado.json();

        setPrecios(dataEstado.precios || {});
        setBalances(dataEstado.balances || {});
        setOportunidad(dataEstado.oportunidad || null);
        setOportunidades(dataEstado.historialOportunidades || []);
        setEstadisticas(dataEstado.estadisticas || null);
        setStatusServidor('ONLINE');
      } catch (err) {
        setStatusServidor('OFFLINE');
      }
    };

    const fetchHistorial = async () => {
      try {
        const resHistorial = await fetch('http://localhost:4000/api/historial?limite=50');
        if (resHistorial.ok) {
          const dataHistorial = await resHistorial.json();
          setHistorial(dataHistorial || []);
        }
      } catch (err) {}
    };

    fetchData();
    fetchHistorial();

    const intervalo = setInterval(() => {
      fetchData();
      fetchHistorial();
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const tema = {
    bg: darkMode ? '#121212' : '#ffffff',
    texto: darkMode ? '#e5e7eb' : '#111111',
    cardBg: darkMode ? '#1a1a1a' : '#f9fafb',
    border: darkMode ? '#2d3748' : '#e5e7eb',
    verde: '#10b981',
    rojo: '#ef4444',
    grisTexto: '#6b7280'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tema.bg, color: tema.texto, fontFamily: 'sans-serif', margin: '0', boxSizing: 'border-box' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: `1px solid ${tema.border}`, backgroundColor: tema.cardBg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>
            CAT — Crypto Arbitrage Trader
          </h1>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', padding: '2px 8px', border: `1px solid ${statusServidor === 'ONLINE' ? tema.verde : tema.rojo}`, color: statusServidor === 'ONLINE' ? tema.verde : tema.rojo, borderRadius: '2px', fontWeight: 'bold' }}>
            {statusServidor}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '4px', backgroundColor: darkMode ? '#2d3748' : '#e5e7eb', padding: '4px', borderRadius: '4px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'mercado', label: 'Mercado en Vivo' },
              { id: 'historial', label: 'Historial' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPestanaActiva(p.id)}
                style={{
                  padding: '6px 14px',
                  fontSize: '11px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  backgroundColor: pestanaActiva === p.id ? (darkMode ? '#121212' : '#ffffff') : 'transparent',
                  color: pestanaActiva === p.id ? tema.texto : tema.grisTexto,
                  borderRadius: '2px'
                }}
              >
                {p.label.toUpperCase()}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={{ fontSize: '11px', padding: '6px 12px', border: `1px solid ${tema.border}`, backgroundColor: tema.bg, color: tema.texto, cursor: 'pointer', fontFamily: 'monospace', borderRadius: '2px', fontWeight: 'bold' }}
          >
            {darkMode ? 'LIGHT_MODE' : 'DARK_MODE'}
          </button>
        </div>
      </header>

      <main style={{ padding: '24px' }}>
        {statusServidor === 'OFFLINE' ? (
          <div style={{ padding: '48px', textAlign: 'center', border: `1px solid ${tema.border}`, fontFamily: 'monospace', backgroundColor: tema.cardBg, borderRadius: '4px' }}>
            <div style={{ color: tema.rojo, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>ERR_SOCKET_DISCONNECT</div>
          </div>
        ) : (
          <>
            {pestanaActiva === 'dashboard' && <Dashboard oportunidad={oportunidad} historial={historial} estadisticas={estadisticas} tema={tema} />}
            {pestanaActiva === 'mercado' && <MercadoEnVivo precios={precios} balances={balances} oportunidad={oportunidad} tema={tema} />}
            {pestanaActiva === 'historial' && <Historial historial={historial} oportunidades={oportunidades} estadisticas={estadisticas} tema={tema} />}
          </>
        )}
      </main>
    </div>
  );
}
