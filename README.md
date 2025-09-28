# Wedding Confirmation App

A simple web application for wedding guests to confirm their attendance and select drink preferences. Built with .NET 8 API and Angular 20.

## Quick Start

```bash
# Clone and setup
git clone <repo-url>
cd wedding-confirmation-app
cp .env.example .env

# Run with Docker
docker-compose up

# Or run separately:
# Backend: dotnet run (from backend/WeddingConfirmationApp/WeddingConfirmationApp.Api)
# Frontend: ng serve (from frontend/)
```

**URLs:**
- Frontend: http://localhost:4200
- API: http://localhost:8081
- Admin Panel: http://localhost:4200/admin

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
