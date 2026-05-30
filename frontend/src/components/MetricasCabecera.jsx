import React from 'react';

export default function MetricasCabecera({ metricas, darkMode }) {
  const formatUptime = (totalSeconds) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <section className={`grid grid-cols-2 md:grid-cols-6 border-b text-xs font-mono divide-x ${
      darkMode ? 'border-gray-800 bg-[#161616] divide-gray-800' : 'border-gray-200 bg-gray-50 divide-gray-200'
    }`}>
      <div className="p-4">
        <span className="text-gray-500 block uppercase font-bold text-[10px]">P&L Acumulado</span>
        <span className={`text-base font-bold ${metricas.pnlAcumulado >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
          {metricas.pnlAcumulado >= 0 ? '+' : ''}${metricas.pnlAcumulado.toFixed(2)}
        </span>
      </div>
      <div className="p-4">
        <span className="text-gray-500 block uppercase font-bold text-[10px]">Exchanges Activos</span>
        <span className="text-base font-bold text-gray-900 dark:text-white">{metricas.exchangesActivos} / 7</span>
      </div>
      <div className="p-4">
        <span className="text-gray-500 block uppercase font-bold text-[10px]">Oportunidades</span>
        <span className="text-base font-bold text-gray-900 dark:text-white">{metricas.oportunidadesDetectadas}</span>
      </div>
      <div className="p-4">
        <span className="text-gray-500 block uppercase font-bold text-[10px]">TX Ejecutadas</span>
        <span className="text-base font-bold text-gray-900 dark:text-white">{metricas.operacionesEjecutadas}</span>
      </div>
      <div className="p-4">
        <span className="text-gray-500 block uppercase font-bold text-[10px]">Uptime del Bot</span>
        <span className="text-base font-bold text-gray-900 dark:text-white">{formatUptime(metricas.uptimeSec)}</span>
      </div>
      <div className="p-4">
        <span className="text-gray-500 block uppercase font-bold text-[10px]">Ciclos / Minuto</span>
        <span className="text-base font-bold text-emerald-500">{metricas.ciclosPorMinuto} Hz</span>
      </div>
    </section>
  );
}
