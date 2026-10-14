# CraveCraft - Backend (fullstack-backend)

Robust, production-ready REST API service powering the CraveCraft food ordering platform, built with **Node.js**, **Express**, **TypeScript**, and **MongoDB / Mongoose**.

---

## 🛠️ Tech Stack & Architecture

- **Runtime**: Node.js v20 / v22 LTS
- **Framework**: Express.js
- **Language**: TypeScript 5+ (Strict mode, ES2022 / NodeNext)
- **Database & ORM**: MongoDB with Mongoose (with in-memory fallback persistence)
- **Security**: Helmet, CORS, strict JSON body parsers
- **Logging**: Morgan HTTP logger

### Layered Architecture
```text
fullstack-backend/
├── src/
│   ├── config/
│   │   ├── db.ts               # MongoDB connection handler & resilience status
│   │   └── env.ts              # Strongly-typed environment variables
│   ├── controllers/
│   │   ├── authController.ts   # Registration & login handlers
│   │   ├── categoryController.ts # Category catalogue CRUD
│   │   ├── foodController.ts   # Food dishes search & filtering
│   │   ├── healthController.ts # Service status & uptime probe
│   │   └── orderController.ts  # Order placement, status dispatching, OTP
│   ├── middleware/
│   │   └── errorHandler.ts     # Centralized operational error handling
│   ├── models/
│   │   ├── Category.ts         # Mongoose Category schema
│   │   ├── Food.ts             # Mongoose Food schema with dietary flags
│   │   ├── Order.ts            # Mongoose Order schema with items & status
│   │   └── User.ts             # Mongoose User credentials schema
│   ├── routes/
│   │   ├── authRoutes.ts       # /api/auth routes
│   │   ├── categoryRoutes.ts   # /api/categories routes
│   │   ├── foodRoutes.ts       # /api/foods routes
│   │   ├── healthRoutes.ts     # /api/health routes
│   │   ├── orderRoutes.ts      # /api/orders routes
│   │   └── index.ts            # Root /api router aggregator
│   ├── services/
│   │   └── seedService.ts      # Pre-populated Indian cuisine seed catalog
│   ├── app.ts                  # Express application factory & middleware
│   └── server.ts               # HTTP Server bootstrap & startup listener
├── .env.example                # Sample environment configuration
├── .gitignore                  # Ignores node_modules, dist, and local .env files
├── package.json                # Dependencies and build scripts
└── tsconfig.json               # TypeScript compiler options
```

---

## 📡 REST API Reference

### Health & Monitoring
- `GET /api/health` — Probe server uptime, service status, and database connectivity.

### Food Catalogue & Categories
- `GET /api/categories` — List all categories (Biryani & Rice, Curries, Tandoor, Breads, Desserts).
- `POST /api/categories` — Create a new food category.
- `GET /api/foods` — List foods with optional query parameters:
  - `?categoryId=<id>`: Filter by category.
  - `?search=<term>`: Text search across dish names and descriptions.
- `GET /api/foods/:id` — Get food details by ID.
- `POST /api/foods` — Add a new food item.

### Orders & Kitchen Lifecycle
- `POST /api/orders` — Place a new customer order with automatic 5% GST tax calculation and 4-digit OTP generation.
- `GET /api/orders` — Retrieve active and historical orders.
- `GET /api/orders/:id` — Retrieve specific order by ID.
- `PATCH /api/orders/:id/status` — Advance order status:
  - `PENDING` → `PREPARING` → `READY` → `OUT_FOR_DELIVERY` → `DELIVERED`

### Authentication
- `POST /api/auth/register` — Register a new customer.
- `POST /api/auth/login` — Authenticate and receive session token.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20 or v22 LTS ([NodeJS.org](https://nodejs.org/))
- **MongoDB** *(Optional)*: Local MongoDB instance or MongoDB Atlas URI (if unavailable, the server automatically boots into graceful in-memory seed catalog mode).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/prudvirajanika-gif/fullstack-backend.git
   cd fullstack-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. Run in Development Mode:
   ```bash
   npm run dev
   ```

5. Production Build & Start:
   ```bash
   npm run build
   npm start
   ```

The REST API service will listen on `http://localhost:5000`.
