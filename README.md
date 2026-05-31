# C.A.T. — Crypto Arbitrage Trader ⚡

[![Production Frontend](https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square&logo=vercel)](https://bot-de-arbitraje-cripto.vercel.app/)
[![Production Backend](https://img.shields.io/badge/Backend-Railway-0B0D17?style=flat-square&logo=railway)](https://bot-de-arbitraje-cripto-production.up.railway.app/)
[![Repo](https://img.shields.io/badge/GitHub-k3v0no-181717?style=flat-square&logo=github)](https://github.com/k3v0no/Bot-de-Arbitraje-Cripto)
[![Environment](https://img.shields.io/badge/OS-Linux%20Mint-transparent?style=flat-square&logo=linuxmint&logoColor=white)](https://linuxmint.com/)

---

## 📝 1. Descripción del Proyecto

**C.A.T. (Crypto Arbitrage Trader)** es un bot modular automatizado de arbitraje de criptomonedas diseñado para operar en tiempo real a través de múltiples exchanges simultáneamente. El sistema detecta divergencias de precio de BTC entre exchanges, evalúa la rentabilidad neta descontando fees de trading, slippage estimado, withdrawal fees y penalización por latencia de red, y simula la ejecución de la operación más rentable disponible en cada ciclo.

El proyecto está estructurado como un **monorepo** con separación estricta de responsabilidades: el backend ejecuta toda la lógica financiera y el frontend solo visualiza los datos recibidos.

🔗 **Aplicación en producción:** [https://bot-de-arbitraje-cripto.vercel.app/](https://bot-de-arbitraje-cripto.vercel.app/)

### ¿Cómo funciona?

1. Cada 500ms el bot consulta en paralelo hasta 8 exchanges (Binance vía WebSocket, el resto vía REST + CCXT)
2. Por cada snapshot de precios evalúa N×(N-1) pares posibles de compra/venta
3. Para cada par calcula: `ganancia neta = ingreso_venta × (1 - fee - slippage) - costo_compra × (1 + fee + slippage) - withdrawal_fee - penalización_latencia`
4. Si la mejor oportunidad supera el umbral mínimo de ganancia, simula la ejecución y actualiza los balances
5. El frontend consume `/api/estado` cada 3 segundos y pinta los resultados en tiempo real

### 📸 Capturas de pantalla

| 🖥️ Dashboard | 📊 Mercado en Vivo |
| :---: | :---: |
| *(sube tu captura aquí)* | *(sube tu captura aquí)* |
| *P&L acumulado, oportunidad del ciclo actual y razón de descarte* | *Precios en vivo, mapa de calor de spreads y balances por wallet* |

---

## 🛠️ 2. Tecnologías Utilizadas

### Backend
| Tecnología | Uso |
|---|---|
| Node.js v22 (ESM) | Runtime del servidor |
| Express.js | API REST (`/api/estado`, `/api/historial`, `/health`) |
| CCXT | Normalización de APIs de 7 exchanges |
| WebSocket (`ws`) | Stream en tiempo real de Binance |
| Railway | Deploy y hosting del backend |

### Frontend
| Tecnología | Uso |
|---|---|
| React + Vite | UI y compilación |
| Recharts | Gráfica de P&L acumulado |
| pnpm | Gestor de paquetes |
| Vercel | Deploy y hosting del frontend |

---

## 🚀 3. Instalación y Ejecución Local

### Prerrequisitos

- Node.js v18 o superior
- pnpm instalado globalmente

```bash
npm install -g pnpm
```

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/k3v0no/Bot-de-Arbitraje-Cripto.git
cd Bot-de-Arbitraje-Cripto
```

### Paso 2 — Configurar y ejecutar el backend

```bash
cd backend
pnpm install
```

Crea un archivo `.env` dentro de `backend/` con el siguiente contenido:
PORT=4000
Inicia el servidor:

```bash
pnpm start
```

El bot arranca en `http://localhost:4000`. Verás en consola los exchanges conectados y el ciclo de escaneo activo.

### Paso 3 — Configurar y ejecutar el frontend

Abre una segunda terminal desde la raíz del proyecto:

```bash
cd frontend
pnpm install
```

Crea un archivo `.env` dentro de `frontend/` con el siguiente contenido:
VITE_API_URL=http://localhost:4000
Inicia la interfaz:

```bash
pnpm dev
```

Abre `http://localhost:5173` en tu navegador. El indicador de estado debe pasar a **ONLINE** en verde.

---
