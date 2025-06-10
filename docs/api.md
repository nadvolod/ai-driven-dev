# Task Management REST API

A comprehensive REST API for managing tasks with filtering, pagination, and full CRUD operations.

## Base URL

```
/api/tasks
```

## Authentication

Currently, no authentication is required. This API uses in-memory storage for simplicity.

---

## 📋 **Endpoints Overview**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Retrieve all tasks with filtering |
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks/{id}` | Retrieve a specific task |
| `PUT` | `/api/tasks/{id}` | Update an existing task |
| `DELETE` | `/api/tasks/{id}` | Delete a task |

---

## 🔍 **GET /api/tasks**

Retrieve all tasks with optional filtering, sorting, and pagination.

### Query Parameters

| Parameter | Type | Description | Default | Example |
|-----------|------|-------------|---------|---------|
| `status` | `string` | Filter by status: `all`, `completed`, `pending` | `all` | `?status=completed` |
| `priority` | `string` | Filter by priority: `low`, `medium`, `high` | - | `?priority=high` |
| `category` | `string` | Filter by category name | - | `?category=Development` |
| `search` | `string` | Search in title and description | - | `?search=authentication` |
| `sortBy` | `string` | Sort field: `createdAt`, `updatedAt`, `title`, `priority` | `createdAt` | `?sortBy=priority` |
| `sortOrder` | `string` | Sort direction: `asc`, `desc` | `desc` | `?sortOrder=asc` |
| `page` | `number` | Page number (1-based) | `1` | `?page=2` |
| `limit` | `number` | Items per page (1-100) | `20` | `?limit=10` |

### Example Request

```http
GET /api/tasks?status=pending&priority=high&page=1&limit=10
```

### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Fix critical authentication bug",
      "description": "Users unable to login with OAuth providers",
      "completed": false,
      "priority": "high",
      "category": "Development",
      "createdAt": "2025-01-10T10:30:00.000Z",
      "updatedAt": "2025-01-10T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false,
    "stats": {
      "total": 25,
      "completed": 10,
      "pending": 15,
      "byPriority": {
        "low": 8,
        "medium": 12,
        "high": 5
      }
    }
  }
}
```

### Status Codes

- `200` - Success
- `400` - Invalid query parameters
- `500` - Server error

---

## ➕ **POST /api/tasks**

Create a new task.

### Request Body

```json
{
  "task": {
    "title": "Implement user authentication",
    "description": "Set up OAuth integration with Google and GitHub",
    "priority": "high",
    "category": "Development",
    "completed": false
  }
}
```

### Required Fields

- `title` (string, 1-100 characters)
- `priority` (enum: `low`, `medium`, `high`)

### Optional Fields

- `description` (string, max 500 characters)
- `category` (string, max 50 characters)
- `completed` (boolean, defaults to `false`)

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Implement user authentication",
    "description": "Set up OAuth integration with Google and GitHub",
    "completed": false,
    "priority": "high",
    "category": "Development",
    "createdAt": "2025-01-10T10:30:00.000Z",
    "updatedAt": "2025-01-10T10:30:00.000Z"
  }
}
```

### Status Codes

- `201` - Task created successfully
- `400` - Invalid request body
- `422` - Validation error
- `500` - Server error

---

## 🔍 **GET /api/tasks/{id}**

Retrieve a specific task by its ID.

### Path Parameters

- `id` (string) - Task UUID

### Example Request

```http
GET /api/tasks/123e4567-e89b-12d3-a456-426614174000
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Implement user authentication",
    "description": "Set up OAuth integration with Google and GitHub",
    "completed": false,
    "priority": "high",
    "category": "Development",
    "createdAt": "2025-01-10T10:30:00.000Z",
    "updatedAt": "2025-01-10T10:30:00.000Z"
  }
}
```

### Status Codes

- `200` - Success
- `404` - Task not found
- `500` - Server error

---

## ✏️ **PUT /api/tasks/{id}**

Update an existing task.

### Path Parameters

- `id` (string) - Task UUID

### Request Body

```json
{
  "task": {
    "title": "Updated task title",
    "description": "Updated description",
    "priority": "medium",
    "category": "Development",
    "completed": true
  }
}
```

### Updatable Fields

All fields are optional in updates:

- `title` (string, 1-100 characters)
- `description` (string, max 500 characters)
- `priority` (enum: `low`, `medium`, `high`)
- `category` (string, max 50 characters)
- `completed` (boolean)

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Updated task title",
    "description": "Updated description",
    "completed": true,
    "priority": "medium",
    "category": "Development",
    "createdAt": "2025-01-10T10:30:00.000Z",
    "updatedAt": "2025-01-10T11:45:00.000Z"
  }
}
```

### Status Codes

- `200` - Task updated successfully
- `400` - Invalid request body
- `404` - Task not found
- `422` - Validation error
- `500` - Server error

---

## 🗑️ **DELETE /api/tasks/{id}**

Delete a specific task.

### Path Parameters

- `id` (string) - Task UUID

### Example Request

```http
DELETE /api/tasks/123e4567-e89b-12d3-a456-426614174000
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "message": "Task deleted successfully"
  }
}
```

### Status Codes

- `200` - Task deleted successfully
- `404` - Task not found
- `500` - Server error

---

## ❌ **Error Responses**

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "validation": [
      {
        "field": "title",
        "message": "Title is required",
        "value": ""
      }
    ]
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400/422 | Request validation failed |
| `INVALID_REQUEST_BODY` | 400 | Malformed JSON or missing required fields |
| `INVALID_QUERY_PARAMS` | 400 | Invalid query parameters |
| `TASK_NOT_FOUND` | 404 | Task with specified ID not found |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource not found |
| `DUPLICATE_TASK` | 409 | Task with same title already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |
| `DATABASE_ERROR` | 500 | Database operation failed |

---

## 📋 **Usage Examples**

### Filter high priority pending tasks

```bash
curl "http://localhost:3000/api/tasks?status=pending&priority=high"
```

### Search for tasks containing "auth"

```bash
curl "http://localhost:3000/api/tasks?search=auth"
```

### Get tasks sorted by priority (high to low)

```bash
curl "http://localhost:3000/api/tasks?sortBy=priority&sortOrder=desc"
```

### Create a new task

```bash
curl -X POST "http://localhost:3000/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "task": {
      "title": "Review pull request",
      "priority": "medium",
      "category": "Development"
    }
  }'
```

### Update task completion status

```bash
curl -X PUT "http://localhost:3000/api/tasks/123e4567-e89b-12d3-a456-426614174000" \
  -H "Content-Type: application/json" \
  -d '{
    "task": {
      "completed": true
    }
  }'
```

### Delete a task

```bash
curl -X DELETE "http://localhost:3000/api/tasks/123e4567-e89b-12d3-a456-426614174000"
```

---

## 📊 **Response Structure**

All API responses follow a consistent structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;           // Present on success
  error?: ApiError;   // Present on failure  
  meta?: ResponseMeta; // Additional metadata (pagination, stats)
}
```

### Pagination Metadata

```typescript
interface ResponseMeta {
  total: number;      // Total items available
  page: number;       // Current page (1-based)
  limit: number;      // Items per page
  totalPages: number; // Total number of pages
  hasNext: boolean;   // More pages available
  hasPrev: boolean;   // Previous pages available
}
```

---

## 🔧 **Implementation Notes**

### In-Memory Storage
- Tasks are stored in memory and will reset on server restart
- No persistent storage is implemented
- Suitable for development and testing

### Rate Limiting
- Currently not implemented
- Recommended for production: 100 requests per minute per IP

### Validation
- All input is validated against defined schemas
- XSS protection through input sanitization
- SQL injection prevention (when database is added)

### CORS
- Configure CORS headers for frontend integration
- Allow credentials if authentication is added

This API provides a solid foundation for task management with room for extension and enhancement as requirements grow. 