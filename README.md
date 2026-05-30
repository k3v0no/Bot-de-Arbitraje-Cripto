# Bot de Arbitraje Cripto de Alta Frecuencia (CCXT)

Monitor de arbitraje bidireccional en tiempo real entre exchanges (Coinbase y Gemini) con arquitectura modular y sistema de control de riesgos automatizado. Desarrollado en el marco del Hackathon 2026.

## Características Principales

- **Conectividad Multimercado:** Integración nativa con múltiples casas de cambio utilizando la librería CCXT.
- **Gráfica Temporal Elástica:** Interfaz gráfica que proyecta la curva de P&L acumulada respetando el espaciado de tiempo real entre ejecuciones (evitando distorsiones lineales).
- **Gestión de Riesgos Avanzada (Lógica de Negocio):**
  - **Circuit Breaker:** Suspensión automática del bot por 30 segundos ante fallos de conexión secuenciales o spreads fantasma.
  - **Protección de Wallets:** Monitoreo activo de saldos mínimos requeridos para evitar el colapso por falta de recursos líquidos.
  - **Control de Slippage:** Filtrado de órdenes en milisegundos si la volatilidad del mercado excede el 0.2% de desviación del precio esperado.

## Arquitectura del Proyecto

El proyecto está estructurado como un monorepo para facilitar su auditoría y despliegue:

```text
├── backend/          # Motor del bot en Node.js, lógica de riesgo y API REST (Express)
└── frontend/         # Panel de control visual en React (Vite, TailwindCSS, Recharts)
