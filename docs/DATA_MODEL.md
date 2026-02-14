# Data Model

## Task Entity

The task entity maps to the `tasks` table.

| Field        | Type      | Notes                       |
| ------------ | --------- | --------------------------- |
| id           | Integer   | Primary key, auto-increment |
| title        | String    | Required, max 255 chars     |
| description  | String    | Optional, TEXT              |
| created_date | LocalDate | Stored as DATE              |
| is_completed | Boolean   | Completion flag             |

The Java entity definition is in [TaskMasterProBackend/src/main/java/com/taskmaster/model/Task.java](TaskMasterProBackend/src/main/java/com/taskmaster/model/Task.java).
