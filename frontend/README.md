# Wedding Confirmation App - Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.0.

## Environment Configuration

The application supports multiple environment configurations for different deployment scenarios.

### Available Environments

| Environment | File | Description | Default API URL |
|-------------|------|-------------|-----------------|
| Development | `environment.ts` | Local development | `http://localhost:5000/api` |
| Production | `environment.prod.ts` | Production server | `https://your-production-api.com/api` |

### Configuration

Edit the appropriate environment file to change the API URL:

#### Development (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api' // Your local backend URL
};
```

#### Production (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api' // Your production backend URL
};
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Building for Different Environments

#### Development Build (default)
```bash
ng build
```

#### Production Build
```bash
ng build --configuration=production
```

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Application Features

### Guest Functionality
- **Confirmation Page**: `/potwierdz/:publicId` - Guests can confirm their invitation and select drink preferences

### Administrator Functionality
- **Dashboard**: Overview of invitation statistics
- **Invitations Management**: Create, edit, and manage wedding invitations
- **Persons Management**: Manage guest list and personal information
- **Drink Types Management**: Configure available drink options
- **Confirmations Overview**: View all guest confirmations and responses

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
