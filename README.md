# Graveboards Frontend

## Quickstart (Docker)

1. Clone the repository: `git clone https://github.com/graveboards/graveboards-frontend.git && cd graveboards-frontend`
2. Ensure Docker is installed and running on your system
3. Ensure the backend container is running and reachable as `graveboards-backend` on the same Docker network
   ```bash
   docker network create graveboards
   docker network connect graveboards graveboards-backend
   ```
4. Build the frontend image:
   ```bash
   docker build -t graveboards-frontend .
   ```
5. Run the frontend container:
   ```bash
   docker run --name graveboards-frontend --network graveboards -p 3000:3000 -e SESSION_SECRET=your-private-session-secret -e INTERNAL_API_URL=http://graveboards-backend:8000/api/v1 graveboards-frontend
   ```
6. The frontend should now be running on http://localhost:3000

The frontend defaults browser API calls to `/api/v1`. In Docker, those requests are handled by the frontend container and proxied to `INTERNAL_API_URL`, which should point at the `graveboards-backend` container.

If the `graveboards` network already exists or the backend container is already connected, Docker may print a harmless warning.

## Installation (Non-docker)

### Prerequisites

- Node.js 22+
- npm
- Graveboards Backend

### Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/graveboards/graveboards-frontend.git
    cd graveboards-frontend
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create the `.env.local` file:
    ```shell
    NEXT_PUBLIC_API_URL=/api/v1
    INTERNAL_API_URL=http://localhost:8000/api/v1
    SESSION_SECRET=<private-session-secret>
    ```

4. Run the development server:
    ```bash
    npm run dev
    ```

5. Open http://localhost:3000 in your browser.

## Management (docker)

```text
docker build -t graveboards-frontend .       - Build project image
docker run --name graveboards-frontend ...   - Start frontend container
docker logs -f graveboards-frontend          - View frontend logs
docker stop graveboards-frontend             - Stop frontend container
docker rm graveboards-frontend               - Remove frontend container
docker exec -it graveboards-frontend sh      - Open frontend shell
```

## Management (non-docker)

```text
npm run dev      - Start development server
npm run build    - Create production build
npm run start    - Start production server after building
```

## Configuration

```text
NEXT_PUBLIC_API_URL   Public API URL used by browser code. Defaults to /api/v1.
INTERNAL_API_URL      Server-side backend URL. In Docker, use http://graveboards-backend:8000/api/v1.
SESSION_SECRET        Secret used to sign frontend session cookies.
```

## Documentation

The frontend is available locally at: http://localhost:3000

The backend API spec can be viewed locally at: http://localhost:8000/api/v1/ui

## License

No license file is currently included in this repository.
