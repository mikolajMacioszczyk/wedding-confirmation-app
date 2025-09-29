# Wedding Confirmation App

A simple web application for wedding guests to confirm their attendance and select drink preferences. Built with .NET 8 API and Angular 20.

## Quick Start

```bash
# Clone and setup
git clone <repo-url>
cd wedding-confirmation-app
cp .env.example .env

# Run with Docker
docker-compose up --build
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

## Production Deployment

### Host Configuration

When deploying to production, update the following files to match your domain:

#### 1. Angular Environment (`frontend/src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://yourdomain.com/api'  // ← Change this
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
