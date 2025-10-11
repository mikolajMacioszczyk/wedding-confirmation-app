# Wedding Confirmation App

A simple web application for wedding guests to confirm their attendance and select drink preferences. Built with .NET 8 API and Angular 20.

## Prerequisites

- Docker and Docker Compose V2 (docker compose command)
- A domain name pointing to your server (for SSL)
- Ports 80 and 443 open on your server

## Quick Start

```bash
# Clone and setup
git clone <repo-url>
cd wedding-confirmation-app
cp .env.example .env
# Edit .env with your configuration

# Development - Run with Docker
docker compose up --build
```

**Development URLs:**
- Frontend: http://localhost:4200
- API: http://localhost:8081  
- Admin Panel: http://localhost:4200/admin

## Docker Architecture

The application consists of following components:
- **Frontend**: Angular app built and served by nginx
- **Backend**: .NET 8 API in container
- **Database**: PostgreSQL container
- **Reverse Proxy**: nginx handles routing and API proxying

## Architecture

```
wedding-confirmation-app/
├── backend/               # .NET 8 Web API
│   ├── WeddingConfirmationApp.Api/
│   ├── WeddingConfirmationApp.Domain/
│   ├── WeddingConfirmationApp.Application/
│   └── WeddingConfirmationApp.Infrastructure/
├── frontend/              # Angular 20
└── docker-compose.yaml
```

## Features

**Guest Flow:**
- Scan QR code → Confirm attendance → Select drinks → Save

**Admin Panel:**
- Manage invitations, persons, drink types
- View confirmations overview
- CRUD operations for all entities

## Tech Stack

**Backend:**
- .NET 8 Web API
- Entity Framework Core
- PostgreSQL
- OpenAPI/Swagger

**Frontend:**
- Angular 20 (standalone components)
- TypeScript
- SCSS
- Signals-based state management

## SSL Certificate Setup (Production)

### Automatic SSL with Let's Encrypt

The `init-letsencrypt.sh` script automates SSL certificate setup:

```bash
# Test with staging environment first (recommended)
./init-letsencrypt.sh yourdomain.com admin@yourdomain.com --staging

# Once working, get production certificate
./init-letsencrypt.sh yourdomain.com admin@yourdomain.com
```

### What the script does:
1. Creates necessary directories for Let's Encrypt
2. Configures nginx for domain validation
3. Requests SSL certificate from Let's Encrypt
4. Configures nginx with SSL
5. Sets up automatic certificate renewal

### Certificate Renewal
Certificates automatically renew via the certbot container every 12 hours.

## Production Deployment

### Host Configuration

When deploying to production, update the following files to match your domain:

#### 1. Angular Environment (`frontend/src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://yourdomain.com/api',   // ← Change this
  frontendDomain: 'http://localhost:4200' // ← Change this
};
```

#### 2. nginx Configuration (`frontend/nginx.conf`)
```nginx
server {
    listen 80;
    server_name yourdomain.com;  # ← Change this
    # ... rest of config
}
```

The frontend nginx container handles both frontend and API routing:

```
Browser → nginx (port 80/443)
├── /api/* → Proxy to Backend (.NET API)
└── /*     → Serve Angular App (SPA routing)
```

### 3. Environment Variables for Production

Create a `.env` file and set environment variables for production
