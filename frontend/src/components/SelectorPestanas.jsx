import React from 'react';

export default function SelectorPestanas({ pestanaActiva, setPestanaActiva, darkMode, setDarkMode }) {
  return (
    <nav className="flex gap-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-sm text-xs font-medium">
      <button 
        onClick={() => setPestanaActiva('dashboard')}
        className={`px-4 py-1.5 rounded-sm transition-all ${
          pestanaActiva === 'dashboard' 
            ? (darkMode ? 'bg-[#121212] text-white font-bold' : 'bg-white text-black font-bold') 
            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
      >
        Dashboard (Negocio)
      </button>
      <button 
        onClick={() => setPestanaActiva('tecnico')}
        className={`px-4 py-1.5 rounded-sm transition-all ${
          pestanaActiva === 'tecnico' 
            ? (darkMode ? 'bg-[#121212] text-white font-bold' : 'bg-white text-black font-bold') 
            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
      >
        Datos Técnicos (Jurado)
      </button>
      <button 
        onClick={() => setPestanaActiva('historial')}
        className={`px-4 py-1.5 rounded-sm transition-all ${
          pestanaActiva === 'historial' 
            ? (darkMode ? 'bg-[#121212] text-white font-bold' : 'bg-white text-black font-bold') 
            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
      >
        Historial de Órdenes
      </button>
    </nav>
  );
}
