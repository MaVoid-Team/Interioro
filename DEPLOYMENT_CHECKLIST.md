# Deployment Checklist

## Pre-Deployment Tasks

- [ ] Rotate all database, Cloudinary, JWT, and Paymob secrets that were previously present in `docker-compose.yml`.
- [ ] Confirm the VPS has at least 2 GB RAM, 20 GB disk, and Ubuntu 22.04/24.04 or Debian 12.
- [ ] Point the domain A record to the VPS public IP.
- [ ] Open firewall ports `22`, `80`, and `443` only.
- [ ] Install Docker Engine, Docker Compose V2, Nginx, and Certbot.
- [ ] Clone the repo into `/opt/interioro` or another stable app directory.

## Environment Configuration

- [ ] Copy `.env.example` to `.env`.
- [ ] Replace every placeholder in `.env`.
- [ ] Set `FRONTEND_URL=https://your-domain.com`.
- [ ] Set `BACKEND_URL=https://your-domain.com/api/v1`.
- [ ] Keep `NEXT_PUBLIC_API_URL=http://backend:3000` for the Docker deployment.
- [ ] Generate `JWT_SECRET` with `openssl rand -base64 48`.
- [ ] Confirm `.env` is not committed or copied into public backups.

## Docker Build & Deployment

- [ ] Run `docker compose config` and confirm no validation errors.
- [ ] Run `docker compose build`.
- [ ] Start services with `docker compose up -d`.
- [ ] Confirm all services are healthy with `docker compose ps`.
- [ ] Confirm backend logs show a successful database connection.
- [ ] Confirm migrations completed without errors.

## Nginx Setup

- [ ] Copy `deploy/nginx.conf.example` to `/etc/nginx/sites-available/interioro`.
- [ ] Replace `example.com` with the real domain.
- [ ] Verify `proxy_pass` ports match `FRONTEND_PORT` and `BACKEND_PORT`.
- [ ] Enable the site with `ln -s /etc/nginx/sites-available/interioro /etc/nginx/sites-enabled/interioro`.
- [ ] Run `nginx -t`.
- [ ] Reload Nginx with `systemctl reload nginx`.

## SSL Certificate Setup

- [ ] Run `certbot --nginx -d your-domain.com`.
- [ ] Confirm HTTP redirects to HTTPS.
- [ ] Test renewal with `certbot renew --dry-run`.
- [ ] Confirm the Nginx SSL paths match the issued certificate paths.

## Post-Deployment Testing

- [ ] Visit `https://your-domain.com`.
- [ ] Visit `https://your-domain.com/api/v1` or a known API endpoint.
- [ ] Visit `https://your-domain.com/health`.
- [ ] Test signup/login.
- [ ] Test product listing and product detail pages.
- [ ] Test cart and checkout flow in the intended Paymob mode.
- [ ] Test admin pages with an admin account.
- [ ] Upload one image and confirm Cloudinary delivery works.

## Security Verification

- [ ] Confirm Postgres is not exposed with `ss -tulpn | grep 5432`.
- [ ] Confirm app ports bind to `127.0.0.1`, not `0.0.0.0`.
- [ ] Confirm security headers are present with `curl -I https://your-domain.com`.
- [ ] Confirm `.env` permissions are restricted: `chmod 600 .env`.
- [ ] Confirm root SSH login is disabled if your VPS policy requires it.
- [ ] Configure unattended security updates.

## Backup & Recovery

- [ ] Create `/opt/backups/interioro`.
- [ ] Test a database backup with `docker compose exec -T postgres pg_dump -U "$DB_USER" "$DB_NAME" > backup.sql`.
- [ ] Store off-server backups.
- [ ] Document restore command and test it on a non-production database.

## Ongoing Maintenance

- [ ] Review `docker compose logs --tail=200 backend frontend` after each deploy.
- [ ] Run `docker image prune` only after confirming the new release works.
- [ ] Run `npm audit` for backend and frontend before major releases.
- [ ] Renew and verify SSL automatically through the systemd Certbot timer.
