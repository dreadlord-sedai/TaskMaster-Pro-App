# Tech Stack

## Frontend

- Expo SDK 54
- React Native 0.81
- React Navigation (native stack)
- TypeScript

The app renders screens and communicates with the backend using the Fetch API. The API base URL is configured in [src/services/api.ts](src/services/api.ts).

## Backend

- Java 21
- Java SE `HttpServer`
- Gson for JSON serialization
- Hibernate ORM

The backend exposes REST endpoints and uses Gson to convert between JSON and Java models. Hibernate provides object-relational mapping and transaction handling.

## Database

- MySQL 8

The `tasks` table is managed by Hibernate with `hbm2ddl.auto=update`, so the schema is updated on startup.

## How They Work Together

- The mobile app calls the REST API endpoints to read and modify tasks.
- The Java server translates JSON into `Task` entities and uses Hibernate to persist changes.
- MySQL stores all task data and returns results through Hibernate queries.
