# VPS Docker Deployment Guide

This project deploys as three Docker services behind host-level Nginx:

- `frontend`: Next.js app on internal container port `3000`, bound to `127.0.0.1:9719` by default.
- `backend`: Express API on internal container port `3000`, bound to `127.0.0.1:3397` by default.
- `postgres`: PostgreSQL on a private Docker network, not exposed to the VPS host.

Nginx terminates HTTPS on the VPS and proxies web traffic to the frontend and `/api/v1/*` traffic to the backend.

## Important Security Note

The previous `docker-compose.yml` contained live-looking database, Cloudinary, and Paymob credentials. I removed those from Compose, but any credential that has been committed or shared should be treated as exposed. Rotate those secrets before using this deployment in production.

## Step 1/7: Prepare The VPS

On a fresh Ubuntu VPS:

```bash
sudo ./setup-docker.sh
```

The script installs Docker Engine, Docker Compose V2, Nginx, Certbot, and basic firewall rules. If you install manually, make sure these commands work:

```bash
docker --version
docker compose version
nginx -v
certbot --version
```

## Step 2/7: Configure Environment

From the repo root on the VPS:

```bash
cp .env.example .env
chmod 600 .env
openssl rand -base64 48
```

Edit `.env` and replace every placeholder.

Key values:

| Variable | Production value |
| --- | --- |
| `FRONTEND_URL` | `https://your-domain.com` |
| `BACKEND_URL` | `https://your-domain.com/api/v1` |
| `NEXT_PUBLIC_API_URL` | `http://backend:3000` |
| `DB_PASS` | Long random password |
| `JWT_SECRET` | Output from `openssl rand -base64 48` |

Do not add `/api/v1` to `NEXT_PUBLIC_API_URL`; the Next.js route handlers already append it.

## Step 3/7: Validate Compose

```bash
docker compose config
```

If this fails, the error usually points to a missing required `.env` variable.

## Step 4/7: Build And Start

```bash
docker compose build
docker compose up -d
docker compose ps
```

The backend entrypoint runs Sequelize migrations before starting `node dist/server.js`. Check logs after the first start:

```bash
docker compose logs -f postgres
docker compose logs -f backend
docker compose logs -f frontend
```

## Step 5/7: Configure Nginx

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/interioro
sudo sed -i 's/example.com/your-domain.com/g' /etc/nginx/sites-available/interioro
sudo ln -s /etc/nginx/sites-available/interioro /etc/nginx/sites-enabled/interioro
sudo nginx -t
sudo systemctl reload nginx
```

If your `.env` uses different host ports, update the upstream ports in the Nginx file.

## Step 6/7: Enable HTTPS

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
sudo certbot renew --dry-run
```

After Certbot succeeds:

```bash
curl -I https://your-domain.com
curl -I https://your-domain.com/health
```

## Step 7/7: Deploy Updates

```bash
git pull
docker compose build
docker compose up -d
docker compose ps
docker compose logs --tail=200 backend frontend
```

## Backups

Create a database backup:

```bash
set -a
. ./.env
set +a
mkdir -p /opt/backups/interioro
docker compose exec -T postgres pg_dump -U "$DB_USER" "$DB_NAME" > "/opt/backups/interioro/interioro-$(date +%F-%H%M%S).sql"
```

Restore into an empty database only after testing on a staging copy:

```bash
set -a
. ./.env
set +a
docker compose exec -T postgres psql -U "$DB_USER" "$DB_NAME" < backup.sql
```

## Troubleshooting

### `docker compose config` reports a missing variable

Open `.env` and fill the named variable. Required variables use Compose's `:?` validation.

### Backend exits during startup

Check database and migration logs:

```bash
docker compose logs --tail=200 postgres
docker compose logs --tail=200 backend
```

Common causes are wrong `DB_*` values, failed migrations, or a reused Postgres volume with incompatible credentials.

### Nginx returns 502

Confirm the app ports are listening on localhost:

```bash
docker compose ps
ss -tulpn | grep -E '3397|9719'
```

Then test directly from the VPS:

```bash
curl http://127.0.0.1:3397/health
curl http://127.0.0.1:9719
```

### Paymob callback fails

Confirm `BACKEND_URL` is the public HTTPS API base, for example:

```env
BACKEND_URL=https://your-domain.com/api/v1
```

The payment provider cannot reach Docker-internal hostnames.
