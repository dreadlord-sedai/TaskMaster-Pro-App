# TaskTarget

TaskTarget is a full-stack task management app built with Expo (React Native) and a Java backend. It supports creating, viewing, updating, and deleting tasks with a clean mobile-first UI and a simple REST API backed by MySQL.

## Features

- Create, edit, and delete tasks
- Toggle task completion status
- Pull-to-refresh task list
- Java REST API with Hibernate persistence
- MySQL storage with automatic schema updates

## Architecture At A Glance

- Mobile app (Expo + React Native) calls a Java HTTP server REST API.
- The API uses Hibernate to read/write tasks in MySQL.
- Gson handles JSON serialization (including `LocalDate`).

For deeper details, see the docs:

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/TECH_STACK.md](docs/TECH_STACK.md)
- [docs/API.md](docs/API.md)
- [docs/DATA_MODEL.md](docs/DATA_MODEL.md)
- [docs/SETUP.md](docs/SETUP.md)

## Quick Start

### Backend (Java + MySQL)

1. Install prerequisites: JDK 21, Maven, and MySQL.
2. Create a database named `taskmaster_pro`.
3. Update credentials and connection settings in the TaskTarget backend config at [TaskMasterProBackend/src/main/resources/hibernate.cfg.xml](TaskMasterProBackend/src/main/resources/hibernate.cfg.xml).
4. Start the server:

```bash
mvn -q -DskipTests exec:java -Dexec.mainClass=com.taskmaster.server.TaskServer
```

The API starts on `http://localhost:8080`.

### Frontend (Expo + React Native)

1. Install dependencies:

```bash
npm install
```

2. Update the API base URL in [src/services/api.ts](src/services/api.ts) with your machine IP (required for physical devices).
3. Start the app:

```bash
npm run start
```

## API Summary

- `GET /api/tasks`
- `POST /api/tasks/save`
- `POST /api/tasks/update`
- `POST /api/tasks/delete`

Full request and response details are in [docs/API.md](docs/API.md).

## Project Structure

```
TaskTarget/
├── App.tsx
├── src/
│   ├── screens/
│   ├── services/
│   ├── types/
│   └── utils/
├── TaskMasterProBackend/
│   └── src/main/java/com/taskmaster/
└── docs/
```

## Notes

- Keep database credentials out of source control for real deployments.
- If the mobile app runs on a device, the API host must be your computer's LAN IP.
