# Nginx Advanced Config

## Single Domain With App And API

Use this when the site and API share one domain:

```nginx
location ^~ /api/v1/ {
    proxy_pass http://127.0.0.1:3397;
}

location / {
    proxy_pass http://127.0.0.1:9719;
}
```

Set these `.env` values:

```env
FRONTEND_URL=https://example.com
BACKEND_URL=https://example.com/api/v1
NEXT_PUBLIC_API_URL=http://backend:3000
```

## Separate API Subdomain

Use this when the frontend is on `example.com` and the API is on `api.example.com`.

```nginx
server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3397;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

Set these `.env` values:

```env
FRONTEND_URL=https://example.com
BACKEND_URL=https://api.example.com/api/v1
NEXT_PUBLIC_API_URL=http://backend:3000
```

## Multiple Apps On One VPS

Give each app its own compose project and host ports:

```env
COMPOSE_PROJECT_NAME=interioro
FRONTEND_PORT=9719
BACKEND_PORT=3397
```

For another app, use different ports:

```env
COMPOSE_PROJECT_NAME=otherapp
FRONTEND_PORT=9720
BACKEND_PORT=3398
```

Each Nginx server block should proxy to that app's assigned localhost ports.

## Load Balancing Frontend Containers

If you scale the frontend outside this Compose file, define multiple upstream targets:

```nginx
upstream interioro_frontend {
    server 127.0.0.1:9719;
    server 127.0.0.1:9720;
}
```

Keep sticky sessions unnecessary by storing auth state in tokens rather than memory.

## Common Issues

### Certbot Fails With 404

Check that port `80` reaches this server and that the HTTP server block includes:

```nginx
location /.well-known/acme-challenge/ {
    root /var/www/html;
}
```

### API Returns 502

Check the backend container and port binding:

```bash
docker compose ps
docker compose logs --tail=200 backend
ss -tulpn | grep 3397
```

### Frontend Builds With Wrong API URL

Rebuild the frontend after changing `NEXT_PUBLIC_API_URL`:

```bash
docker compose build frontend
docker compose up -d frontend
```
