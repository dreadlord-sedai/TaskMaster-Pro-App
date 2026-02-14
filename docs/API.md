# API Reference

Base URL: `http://<host>:8080/api`

## GET /tasks

Fetch all tasks.

Response (200):

```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk and eggs",
    "created_date": "2026-02-14",
    "is_completed": false
  }
]
```

## POST /tasks/save

Create a new task.

Request body:

```json
{
  "title": "Read chapter",
  "description": "Chapter 3",
  "created_date": "2026-02-14",
  "is_completed": false
}
```

Response (201):

```json
{
  "id": 2,
  "title": "Read chapter",
  "description": "Chapter 3",
  "created_date": "2026-02-14",
  "is_completed": false
}
```

## POST /tasks/update

Update task completion status.

Request body:

```json
{
  "id": 2,
  "is_completed": true
}
```

Response (200):

```json
{ "success": true, "message": "Task updated successfully" }
```

## POST /tasks/delete

Delete a task.

Request body:

```json
{ "id": 2 }
```

Response (200):

```json
{ "success": true, "message": "Task deleted successfully" }
```
