# Job Portal API Documentation

Base URL: `http://localhost:5000/api`

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## 🔐 Authentication (`/api/auth`)

### POST `/api/auth/register`

Register a new user.

**Access:** Public

**Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123",
  "userType": "jobseeker" // optional: "jobseeker" | "employer"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token",
  "user": { ... }
}
```

---

### POST `/api/auth/login`

Login user.

**Access:** Public

**Body:**

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token",
  "user": { ... }
}
```

---

### GET `/api/auth/me`

Get current authenticated user.

**Access:** Authenticated

**Response:**

```json
{
  "success": true,
  "user": { ... }
}
```

---

### PUT `/api/auth/profile`

Update user profile (legacy endpoint, use `/api/users/me` instead).

**Access:** Authenticated

**Body:** (all optional)

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "location": "New York",
  "bio": "Software developer...",
  "skills": ["React", "Node.js"]
}
```

---

### PUT `/api/auth/avatar`

Upload user avatar.

**Access:** Authenticated

**Body:** FormData with `avatar` file

**Response:**

```json
{
  "success": true,
  "avatar": "https://cloudinary.com/...",
  "user": { ... }
}
```

---

## 👤 Users (`/api/users`)

### GET `/api/users/:id`

Get user by ID (detailed, protected).

**Access:** Authenticated

**Response:**

```json
{
  "success": true,
  "user": { ... }
}
```

---

### GET `/api/users/public/:id`

Get public user profile.

**Access:** Public

**Response:**

```json
{
  "success": true,
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "...",
    "bio": "...",
    "skills": [...],
    "location": "...",
    "userType": "jobseeker",
    "createdAt": "...",
    "resumeUrl": "..."
  }
}
```

---

### PUT `/api/users/me`

Update current user profile.

**Access:** Authenticated

**Body:** (all optional)

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "location": "New York",
  "bio": "Software developer...",
  "skills": ["React", "Node.js"],
  "avatar": "https://...",
  "resumeUrl": "https://..."
}
```

---

### DELETE `/api/users/me/resume`

Delete user's resume.

**Access:** Authenticated

**Response:**

```json
{
  "success": true,
  "user": { ... }
}
```

---

## 💼 Jobs (`/api/jobs`)

### GET `/api/jobs`

List jobs with filters and pagination.

**Access:** Public

**Query Parameters:**

- `q` - Search query (text search)
- `type` - Job type: `full-time`, `part-time`, `contract`, `internship`, `remote`
- `category` - Job category
- `location` - Location filter
- `experience` - Experience level: `entry`, `mid`, `senior`, `executive`
- `status` - Job status: `active`, `paused`, `closed` (default: `active`)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sort` - Sort field (default: `-createdAt`)

**Response:**

```json
{
  "success": true,
  "items": [...],
  "total": 100,
  "page": 1,
  "pageSize": 10,
  "pages": 10
}
```

---

### GET `/api/jobs/:id`

Get job by ID.

**Access:** Public

**Response:**

```json
{
  "success": true,
  "job": { ... }
}
```

_Note: Automatically increments view count_

---

### POST `/api/jobs`

Create a new job.

**Access:** Employer/Admin

**Body:**

```json
{
  "title": "Senior React Developer",
  "description": "We are looking for...",
  "company": "Acme Inc",
  "location": "Remote",
  "type": "full-time",
  "category": "Engineering",
  "experience": "senior",
  "salary": {
    "min": 90000,
    "max": 130000,
    "currency": "USD",
    "period": "yearly"
  },
  "requirements": ["5+ years experience", "..."],
  "skills": ["React", "Node.js", "TypeScript"],
  "benefits": ["Health insurance", "..."],
  "status": "active",
  "featured": false,
  "deadline": "2024-12-31"
}
```

**Response:**

```json
{
  "success": true,
  "job": { ... }
}
```

---

### PUT `/api/jobs/:id`

Update a job (owner or admin only).

**Access:** Employer/Admin (must own job or be admin)

**Body:** (all fields optional, same as POST)

---

### DELETE `/api/jobs/:id`

Delete a job (owner or admin only).

**Access:** Employer/Admin (must own job or be admin)

**Response:**

```json
{
  "success": true,
  "message": "Job deleted"
}
```

---

## 📝 Applications (`/api/applications`)

### POST `/api/applications/:jobId/apply`

Apply to a job.

**Access:** Jobseeker/Admin

**Body:**

```json
{
  "resumeUrl": "https://...",
  "coverLetter": "I am interested in...",
  "additionalDocuments": [
    {
      "name": "Portfolio",
      "url": "https://..."
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "application": { ... }
}
```

---

### GET `/api/applications/my`

List current user's applications.

**Access:** Authenticated

**Query Parameters:**

- `status` - Filter by status: `pending`, `reviewed`, `shortlisted`, `rejected`, `hired`
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Response:**

```json
{
  "success": true,
  "items": [...],
  "total": 10,
  "page": 1,
  "pageSize": 10,
  "pages": 1
}
```

---

### GET `/api/applications/job/:jobId`

List applications for a specific job (employer/admin only, must own job).

**Access:** Employer/Admin (must own job or be admin)

**Query Parameters:** Same as `/my`

**Response:** Same format as `/my`

---

### PATCH `/api/applications/:id/status`

Update application status.

**Access:** Employer/Admin (must own job or be admin)

**Body:**

```json
{
  "status": "shortlisted", // pending | reviewed | shortlisted | rejected | hired
  "notes": "Great candidate, scheduling interview..."
}
```

**Response:**

```json
{
  "success": true,
  "application": { ... }
}
```

---

## ⭐ Saved Jobs (`/api/saved`)

### POST `/api/saved/:jobId`

Save a job.

**Access:** Jobseeker/Admin

**Body:** (optional)

```json
{
  "note": "Interested in this position"
}
```

**Response:**

```json
{
  "success": true,
  "saved": { ... }
}
```

---

### GET `/api/saved`

List saved jobs.

**Access:** Authenticated

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Response:**

```json
{
  "success": true,
  "items": [...],
  "total": 5,
  "page": 1,
  "pageSize": 10,
  "pages": 1
}
```

---

### DELETE `/api/saved/:jobId`

Remove saved job.

**Access:** Authenticated

**Response:**

```json
{
  "success": true,
  "message": "Removed from saved"
}
```

---

## 📊 Analytics (`/api/analytics`)

### GET `/api/analytics/overview`

Get dashboard overview metrics.

**Access:** Authenticated

**Query Parameters:**

- `range` - Time range (e.g., `7d`, `30d`, default: `7d`)

**Response:**

```json
{
  "success": true,
  "metrics": {
    "totalUsers": 100,
    "totalJobs": 50,
    "totalApplications": 200,
    "applicationsByStatus": {
      "pending": 50,
      "reviewed": 30,
      "shortlisted": 20,
      "rejected": 80,
      "hired": 20
    },
    "jobsCreatedInRange": 10,
    "applicationsInRange": 25,
    "eventsInRange": 500
  }
}
```

_Note: Employers see metrics scoped to their jobs only_

---

### GET `/api/analytics/timeseries`

Get time series data for metrics.

**Access:** Authenticated

**Query Parameters:**

- `metric` - Metric type: `applications`, `jobs`, `users`, `events` (default: `applications`)
- `range` - Time range (e.g., `30d`, default: `30d`)

**Response:**

```json
{
  "success": true,
  "metric": "applications",
  "rangeDays": 30,
  "data": [
    { "date": "2024-01-01", "count": 5 },
    { "date": "2024-01-02", "count": 8 },
    ...
  ]
}
```

---

### GET `/api/analytics/top-jobs`

Get top jobs by application count.

**Access:** Authenticated

**Query Parameters:**

- `limit` - Number of jobs to return (default: 5, max: 50)

**Response:**

```json
{
  "success": true,
  "items": [
    {
      "_id": "...",
      "applications": 25,
      "job": { ... }
    },
    ...
  ]
}
```

---

### POST `/api/analytics/event`

Track an analytics event.

**Access:** Public

**Body:**

```json
{
  "eventName": "page_view",
  "sessionId": "abc123",
  "page": "/jobs",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1",
  "metadata": { "custom": "data" },
  "job": "job_id_here"
}
```

**Response:**

```json
{
  "success": true,
  "event": { ... }
}
```

---

## 🏥 Health Check

### GET `/api/health`

Check API health status.

**Access:** Public

**Response:**

```json
{
  "success": true,
  "message": "Job Portal API is running!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "db": {
    "readyState": 1
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**Common Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., already applied)
- `500` - Server Error

---

## Notes

1. **Pagination:** All list endpoints support pagination with `page` and `limit` query parameters
2. **Authentication:** Use Bearer token in Authorization header for protected routes
3. **Role-based Access:**
   - `jobseeker` - Can apply to jobs, save jobs
   - `employer` - Can create/manage jobs, view applications for their jobs
   - `admin` - Full access to all endpoints
4. **Employer Scoping:** Employers see analytics and applications only for jobs they own
5. **Validation:** All endpoints use express-validator for input validation
6. **File Uploads:** Avatar uploads use multipart/form-data and Cloudinary
