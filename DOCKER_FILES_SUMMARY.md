# Docker Files Summary

## Deployment Architecture

```text
Internet
  |
Nginx on VPS :80/:443
  |
  +-- 127.0.0.1:9719 -> frontend container, Next.js
  |
  +-- 127.0.0.1:3397 -> backend container, Express API
                               |
                               +-- postgres container on private Docker network
```

## Files

| File | Purpose |
| --- | --- |
| `docker-compose.yml` | Builds and runs Postgres, backend, and frontend with private networking and health checks. |
| `.env.example` | Template for production secrets and deployment-specific values. |
| `backend/Dockerfile` | Multi-stage backend image, TypeScript build, production dependencies, non-root runtime, migration entrypoint. |
| `backend/docker-entrypoint.sh` | Runs Sequelize migrations before starting the backend server. |
| `frontend/Dockerfile` | Multi-stage Next.js image with production runtime and health check. |
| `deploy/nginx.conf.example` | Host-level Nginx reverse proxy with HTTPS, security headers, compression, caching, and API rate limiting. |
| `setup-docker.sh` | Installs Docker, Compose, Nginx, Certbot, and firewall rules on a fresh Ubuntu VPS. |
| `DEPLOYMENT.md` | Main step-by-step deployment guide. |
| `DEPLOYMENT_CHECKLIST.md` | Operator checklist from pre-deploy through maintenance. |
| `NGINX_ADVANCED_CONFIG.md` | Alternate Nginx patterns for multi-app VPS hosting. |

## Security Features

- Secrets are read from `.env` instead of being committed in Compose.
- Postgres is not published to the VPS host.
- Frontend and backend ports bind to `127.0.0.1` for Nginx-only access.
- Containers run as the non-root `node` user.
- `dumb-init` handles process signals inside Node containers.
- Health checks gate service startup order.
- Nginx config includes HTTPS redirect, HSTS, common security headers, gzip, static asset caching, and API rate limiting.

## Quick Commands

```bash
cp .env.example .env
openssl rand -base64 48
docker compose config
docker compose build
docker compose up -d
docker compose ps
docker compose logs -f backend frontend
```

## Important Notes

- Rotate any credentials that were previously committed in `docker-compose.yml`; removing them from Git does not invalidate already exposed secrets.
- `NEXT_PUBLIC_API_URL` should be `http://backend:3000` in this Docker setup because the Next.js route handlers append `/api/v1`.
- `BACKEND_URL` should be the public API base, for example `https://example.com/api/v1`, because Paymob webhook callbacks must reach it from the internet.
