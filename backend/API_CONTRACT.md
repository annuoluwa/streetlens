
# API Contract — Reports, Comments, Evidence

## Reports

### Create Report
- **Endpoint:** POST /api/reports
- **Headers:**
  - Authorization: Bearer <token>
  - Content-Type: multipart/form-data
- **Body:**
  - Fields:
    - title: string (**required**)
    - description: string (**required**)
    - street: string (**required**)
    - postcode: string (**required**)
    - category: string (**required**)
    - evidence: file[] (**required**, at least 1, up to 10 files)
    - city: string (optional)
    - property_type: string (optional)
    - landlord_or_agency: string (optional)
    - advert_source: string (optional)
    - flat_number: string (optional)
    - is_anonymous: boolean (optional, default: true)
- **Response:**
  - 201 Created, returns created report object with fields:
    - id: string
    - title: string (**required**)
    - description: string (**required**)
    - street: string (**required**)
    - postcode: string (**required**)
    - category: string (**required**)
    - evidence: file[] (**required**)
    - city: string (optional)
    - property_type: string (optional)
    - landlord_or_agency: string (optional)
    - advert_source: string (optional)
    - flat_number: string (optional)
    - is_anonymous: boolean (optional, default: true)
    - is_flagged: boolean
    - admin_flagged: boolean
    - created_at: string (ISO date)

---

### Get Reports (Feed)
- **Endpoint:** GET /api/reports
- **Query Params:**
  - search: string (optional)
  - city: string (optional)
  - category: string (optional)
  - admin_flagged: boolean (optional, for admin dashboard)
  - page: number (optional, default: 1)
  - limit: number (optional, default: 10)
- **Response:**
  ```json
  {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "data": [
      {
        "id": "string",
        "title": "string", // **required**
        "description": "string", // **required**
        "street": "string", // **required**
        "postcode": "string", // **required**
        "category": "string", // **required**
        "evidence": ["file1.jpg", "file2.pdf"], // **required**
        "city": "string",
        "property_type": "string",
        "landlord_or_agency": "string",
        "advert_source": "string",
        "flat_number": "string",
        "is_anonymous": true,
        "is_flagged": false,
        "admin_flagged": false,
        "created_at": "2026-01-13T12:34:56.789Z"
      }
    ]
  }
  ```

---

### Get Single Report
- **Endpoint:** GET /api/reports/:id
- **Response:**
  - 200 OK, returns report object (see fields above)
  - 404 Not Found if not found

---

### Delete Report
- **Endpoint:** DELETE /api/reports/:id
- **Headers:**
  - Authorization: Bearer <token>
- **Response:**
  - 200 OK, { message: 'Report deleted successfully' }
  - 403 Forbidden if not owner or admin
  - 404 Not Found

---

## Comments

### Create Comment on Report
- **Endpoint:** POST /api/reports/:reportId/comments
- **Headers:**
  - Authorization: Bearer <token>
- **Body:**
  ```json
  {
    "content": "string (required)",
    "isAnonymous": true|false (optional),
    "parent_comment_id": "string or null (optional)"
  }
  ```
- **Response:**
  - 201 Created, returns created comment object

---

### Get Comments for Report
- **Endpoint:** GET /api/reports/:reportId/comments
- **Response:**
  - 200 OK, returns array of comment objects

---

### Delete Comment
- **Endpoint:** DELETE /api/comments/:commentId
- **Headers:**
  - Authorization: Bearer <token>
- **Response:**
  - 200 OK, { message: 'Comment deleted' }
  - 404 Not Found or not authorized

---

## Evidence

### Upload Evidence File
- **Endpoint:** POST /api/reports/:reportId/evidence
- **Headers:**
  - Authorization: Bearer <token>
  - Content-Type: multipart/form-data
- **Body:**
  - file: (required, file upload)
- **Response:**
  - 201 Created, returns uploaded evidence file object

---

## Account

### Delete Own Account
- **Endpoint:** DELETE /api/users/me
- **Headers:**
  - Authorization: Bearer <token>
- **Response:**
  - 200 OK, { message: 'Account deleted' }
  - 404 Not Found

---

### Admin Flagging & Threshold
- Reports for the same (postcode, street, flat_number) are auto-flagged for admin review if 3+ are submitted in 30 days.
- Admins are notified by email when threshold is reached.
- Use `GET /api/reports?admin_flagged=true` to fetch flagged reports for review.

---


