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

### Orchestrator (deploy.sh)

```bash
cd graveboards-deploy
./deploy.sh up [mode] [--build] [--no-monitoring] [--nas] [--traefik] [--monitoring-ports] [--monitoring-traefik] [--no-frontend] [service...]  # Start services
./deploy.sh down [mode] [--no-monitoring] [--nas] [--traefik] [--monitoring-traefik] [--no-frontend] [service...]              # Stop services
./deploy.sh build [mode] [--no-monitoring] [--nas] [--traefik] [--no-frontend] [service...]             # Build images
./deploy.sh deploy [mode] [--follow|-f] [--no-monitoring] [--nas] [--traefik] [--monitoring-traefik] [--no-frontend]  # Full pipeline: down + pull + build + up
./deploy.sh pull [repo...]                        # Git pull repositories
./deploy.sh force-pull [repo...]                  # Force reset repositories to origin
./deploy.sh logs [mode] [--no-monitoring] [--nas] [--traefik] [--monitoring-traefik] [--no-frontend] [service]  # View logs
./deploy.sh test [--log-file <path>] [--no-cleanup] [--no-log] [--quiet]  # Run tests
./deploy.sh status                                  # Show status
./deploy.sh clean                                   # Remove volumes and images
./deploy.sh help                                    # Show help
```

**Modes:**
- `dev`      - Development (default, hot-reload, monitoring enabled)
- `prod`     - Production (optimized standalone build, monitoring enabled)
- `test`     - Testing (isolated DB/Redis, runs pytest, no frontend, no monitoring)

**Flags:**
- `--build` - Rebuild images before starting (up only)
- `--no-monitoring` - Skip the monitoring stack
- `--nas`           - Include NAS volume overrides (prod only)
- `--traefik`       - Include Traefik overrides for frontend + Grafana (prod only)
- `--monitoring-ports` - Publish monitoring ports to host (dev only)
- `--monitoring-traefik` - Include Traefik routes for monitoring services (prod only)
- `--no-frontend` - Exclude frontend service

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

**Docker ENV (set in development/production stages):**
- `NEXT_PUBLIC_API_URL=/api/v1` (also accepted as a build arg in the builder stage)
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
