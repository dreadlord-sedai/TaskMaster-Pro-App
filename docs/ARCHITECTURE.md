# Architecture

## System Overview

TaskTarget is a two-tier application with a mobile client and a Java REST API server. The client consumes JSON endpoints to manage tasks stored in a MySQL database.

## Components

- Mobile App: Expo + React Native app that renders screens and calls the REST API.
- API Server: Java SE HTTP server that exposes task endpoints.
- Data Access Layer: Hibernate-based DAO for persistence logic.
- Database: MySQL schema storing tasks.

## Data Flow (Create Task)

1. User fills the task form in the mobile app.
2. App sends a `POST /api/tasks/save` request with JSON payload.
3. The Java server parses JSON with Gson (LocalDate via adapter).
4. `TaskDAO` saves the task using Hibernate.
5. The saved task is returned to the app and the list refreshes.

## Data Flow (Toggle Completion)

1. User toggles the checkbox in the task list.
2. App sends `POST /api/tasks/update` with task id and status.
3. The server updates the task row and returns a success flag.
4. The app updates local state if successful.

## Technology Interaction

- React Native fetch calls the Java server endpoints.
- Gson bridges JSON between the app and Java models.
- Hibernate maps `Task` entities to the `tasks` table.
- MySQL stores persistent task records.
