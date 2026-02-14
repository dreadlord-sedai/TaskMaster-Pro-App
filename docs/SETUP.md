# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- JDK 21
- Maven
- MySQL 8

## Database Setup

1. Create a database named `taskmaster_pro`.
2. Update credentials in the TaskTarget backend config at [TaskMasterProBackend/src/main/resources/hibernate.cfg.xml](TaskMasterProBackend/src/main/resources/hibernate.cfg.xml).

## Run The Backend

From the TaskTarget backend folder [TaskMasterProBackend](TaskMasterProBackend):

```bash
mvn -q -DskipTests exec:java -Dexec.mainClass=com.taskmaster.server.TaskServer
```

The server listens on `http://localhost:8080`.

## Run The Mobile App

From the repo root:

```bash
npm install
npm run start
```

If you run on a physical device, set the API host to your LAN IP in [src/services/api.ts](src/services/api.ts).

## Common Issues

- If the app cannot reach the API, verify the IP address and firewall rules.
- If Hibernate fails to connect, double-check MySQL credentials and that the database exists.
