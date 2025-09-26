# QRZMail Portal (Mailcow + Roundcube)

Sign-in & registration portal that:
- proxies `/webmail/` to Roundcube
- exposes `/api/*` for registration/login
- calls Mailcow API to create a mailbox
- serves a simple static frontend

## Quick start (dev)
```bash
cp .env.sample .env   # fill values
docker compose -f docker-compose.portal.yml up -d --build
# UI -> http://localhost:8081
# API -> http://localhost:8080/api/health
