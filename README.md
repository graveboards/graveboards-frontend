# Graveboards Frontend

> Next.js/React frontend for Graveboards

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
- `dev` - Development (default)
- `prod` - Production
- `test` - Testing

**Services:**
- `all` - All services (default)
- `backend` - Backend service
- `frontend` - Frontend service
- `postgres` - PostgreSQL database
- `redis` - Redis cache

```
### Frontend (npm)

```bash
cd graveboards-frontend
npm run dev      # Development server
npm run build    # Production build
npm run lint     # Lint code
npm start        # Production server
```

---

## Configuration

### Environment Variables

Copy `.env.local.example` to `.env.local` for development:

- `NEXT_PUBLIC_API_URL` - Public API URL (browser) | default: /api/v1
- `INTERNAL_API_URL` - Backend API URL (server-side) | default: http://localhost:8000/api/v1
- `SESSION_SECRET` - Session signing key (32+ chars)

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

**Development Mode (Hot-Reload):**
```bash
docker build --target development -t graveboards-frontend:dev .
docker run -p 3000:3000 --env-file .env.local graveboards-frontend:dev
```

**Production Mode:**
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
