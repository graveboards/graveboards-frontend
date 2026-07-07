# Graveboards Frontend

> Next.js 15 / React 19 frontend for Graveboards

## Quick Start

### Prerequisites

- Docker Engine 24+
- Docker Compose 2.0+
- Git
- Node.js 22+
- npm

### Installation

```bash
# Clone all repositories
git clone https://github.com/graveboards/graveboards-frontend.git
git clone https://github.com/graveboards/graveboards-backend.git
git clone https://github.com/graveboards/graveboards-deploy.git

# Start all services
cd graveboards-deploy
./deploy.sh up dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/api/v1/ui

---

## Management

### Orchestrator (Docker)

```bash
cd graveboards-deploy
./deploy.sh up [mode]               # Start services
./deploy.sh down [mode]             # Stop services
./deploy.sh logs [mode] [service]   # View logs
./deploy.sh test                    # Run tests
./deploy.sh build [mode]            # Build images
./deploy.sh status                  # Show status
./deploy.sh clean                   # Remove volumes and images
```

**Modes:**
- `dev`      - Development (default, hot-reload)
- `prod`     - Production (optimized standalone build)
- `prod-nas` - Production (NAS volumes)
- `test`     - Testing (no frontend)

### Frontend (npm)

```bash
cd graveboards-frontend
npm run dev      # Development server (hot-reload)
npm run build    # Production build (standalone output)
npm run lint     # Lint code (next lint)
npm start        # Production server
```

---

## Configuration

### Environment Variables

Copy `.env.local.example` to `.env.local` for development:

| Variable | Default | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | `/api/v1` | Public API URL (browser/client code) |
| `INTERNAL_API_URL` | `http://localhost:8000/api/v1` | Backend API URL (server-side only, proxied to backend) |
| `SESSION_SECRET` | _(required)_ | JWT signing key for session cookies (32+ chars) |
| `APP_URL` | `http://localhost:3000` | Canonical public origin for absolute URLs and redirects |

**Docker build args (defaults):**
- `NEXT_PUBLIC_API_URL=/api/v1`
- `INTERNAL_API_URL=http://graveboards-backend:8000/api/v1` (internal Docker network)

---

## Development

### Without Docker

```bash
# Setup
npm install
cp .env.local.example .env.local  # Configure environment

# Run
npm run dev
```

### With Docker

The Dockerfile uses a multi-stage build with four stages: `deps`, `builder`, `development`, and `production`.

**Development Mode (Hot-Reload):**
```bash
docker build --target development -t graveboards-frontend:dev .
docker run -p 3000:3000 --env-file .env.local graveboards-frontend:dev
```

**Production Mode (Standalone):**
```bash
docker build --target production -t graveboards-frontend:latest .
docker run -p 3000:3000 --env-file .env.local graveboards-frontend:latest
```

---

## Documentation

- [Backend README](../graveboards-backend/README.md)
- [Architecture Docs](../graveboards-backend/docs)
- [Production Deployment Guide](../graveboards-deploy/docs/PRODUCTION_DEPLOYMENT.md)

---

## License

MIT License
