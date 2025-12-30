# API Contract — Reports, Comments, Evidence

## Reports

### Create Report
- **Endpoint:** POST /api/reports
- **Headers:**
  - Authorization: Bearer <token>
- **Body:**
  ```json
  {
    "title": "string (required)",
    "description": "string (required)",
    "city": "string (optional)",
    "postcode": "string (optional)",
    "street": "string (optional)",
    "property_type": "string (optional)",
    "landlord_or_agency": "string (optional)",
    "advert_source": "string (optional)",
    "category": "string (optional)",
    "is_anonymous": true|false (optional, default: true)
  }
  ```
- **Response:**
  - 201 Created, returns created report object

---

### Get Reports (Feed)
- **Endpoint:** GET /api/reports
- **Query Params:**
  - search: string (optional)
  - city: string (optional)
  - category: string (optional)
  - page: number (optional, default: 1)
  - limit: number (optional, default: 10)
- **Response:**
  ```json
  {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "data": [ ...report objects... ]
  }
  ```

---

### Get Single Report
- **Endpoint:** GET /api/reports/:id
- **Response:**
  - 200 OK, returns report object
  - 404 Not Found if not found

---

## Comments

-### Create Comment on Report
### Delete Comment
- **Endpoint:** DELETE /api/comments/:commentId
- **Headers:**
  - Authorization: Bearer <token>
- **Response:**
  - 200 OK, { message: 'Comment deleted' }
  - 404 Not Found or not authorized

## Account

### Delete Own Account
- **Endpoint:** DELETE /api/users/me
- **Headers:**
  - Authorization: Bearer <token>
- **Response:**
  - 200 OK, { message: 'Account deleted' }
  - 404 Not Found
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

