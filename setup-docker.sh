#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this script as root: sudo ./setup-docker.sh"
  exit 1
fi

apt-get update
apt-get install -y ca-certificates curl gnupg lsb-release nginx certbot python3-certbot-nginx ufw

install -m 0755 -d /etc/apt/keyrings
if [[ ! -f /etc/apt/keyrings/docker.gpg ]]; then
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
fi

if [[ ! -f /etc/apt/sources.list.d/docker.list ]]; then
  . /etc/os-release
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" \
    > /etc/apt/sources.list.d/docker.list
fi

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

systemctl enable --now docker
systemctl enable --now nginx

ufw allow OpenSSH
ufw allow "Nginx Full"
ufw --force enable

mkdir -p /opt/interioro /opt/backups/interioro

echo "Docker, Nginx, Certbot, and firewall rules are installed."
echo "Next steps:"
echo "1. Copy this repo to /opt/interioro."
echo "2. Copy .env.example to .env and fill in production values."
echo "3. Run: docker compose config && docker compose build && docker compose up -d"
echo "4. Copy deploy/nginx.conf.example to /etc/nginx/sites-available/interioro and run certbot."
