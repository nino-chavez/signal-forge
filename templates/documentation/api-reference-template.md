# API Reference Template

Use this template for API documentation in Documentation mode (Reference quadrant).

---

```markdown
# [API/Service Name] API Reference

## Overview

[One paragraph describing what this API does and its primary use cases]

**Base URL:** `https://api.example.com/v1`
**Authentication:** [Bearer Token | API Key | OAuth 2.0]

## Authentication

[How to authenticate requests]

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.example.com/v1/endpoint
```

## Endpoints

### [Resource Name]

#### List [Resources]

`GET /resources`

Returns a list of [resources].

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number (default: 1) |
| `limit` | integer | No | Items per page (default: 20, max: 100) |
| `filter` | string | No | Filter by [criteria] |

**Response:**

```json
{
  "data": [
    {
      "id": "123",
      "name": "Example",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

**Status Codes:**

| Code | Description |
|------|-------------|
| 200 | Success |
| 401 | Unauthorized |
| 403 | Forbidden |

---

#### Get [Resource]

`GET /resources/:id`

Returns a single [resource] by ID.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The resource ID |

**Response:**

```json
{
  "id": "123",
  "name": "Example",
  "description": "Detailed description",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T12:00:00Z"
}
```

**Status Codes:**

| Code | Description |
|------|-------------|
| 200 | Success |
| 404 | Resource not found |

---

#### Create [Resource]

`POST /resources`

Creates a new [resource].

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Resource name (max 100 chars) |
| `description` | string | No | Optional description |

**Example Request:**

```bash
curl -X POST https://api.example.com/v1/resources \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Resource", "description": "Description here"}'
```

**Response:** `201 Created`

```json
{
  "id": "456",
  "name": "New Resource",
  "description": "Description here",
  "created_at": "2024-01-15T14:00:00Z"
}
```

**Status Codes:**

| Code | Description |
|------|-------------|
| 201 | Created |
| 400 | Validation error |
| 401 | Unauthorized |

---

#### Update [Resource]

`PUT /resources/:id`

Updates an existing [resource].

[Same structure as Create]

---

#### Delete [Resource]

`DELETE /resources/:id`

Deletes a [resource].

**Response:** `204 No Content`

**Status Codes:**

| Code | Description |
|------|-------------|
| 204 | Deleted |
| 404 | Resource not found |

---

## Error Handling

All errors return JSON with the following structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Name is required",
    "details": [
      {
        "field": "name",
        "message": "This field is required"
      }
    ]
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limiting

- **Limit:** 100 requests per minute
- **Headers:** `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Pagination

All list endpoints support pagination:

| Parameter | Default | Max |
|-----------|---------|-----|
| `page` | 1 | - |
| `limit` | 20 | 100 |

## Versioning

The API is versioned via URL path (`/v1/`). Breaking changes will increment the version number.

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2024-02-01 | Added filter parameter to list endpoints |
| 1.0 | 2024-01-01 | Initial release |
```

---

## API Reference Guidelines

### Be Complete
- Every endpoint documented
- All parameters listed with types
- All response codes explained

### Be Accurate
- Examples are tested and work
- Response structures match actual API
- Error codes are comprehensive

### Be Consistent
- Same structure for all endpoints
- Consistent naming conventions
- Uniform example format
