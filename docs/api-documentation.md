# 📜 REST API Documentation

**Base URL**: `http://localhost:5000/api/v1` (Development) | `https://api.aurelien.gold/api/v1` (Production)

All API responses follow a uniform JSON envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2026-10-26T13:15:00.000Z"
}
```

Error envelopes:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": [
      { "field": "email", "issue": "Must be a valid email format" }
    ]
  },
  "timestamp": "2026-10-26T13:15:00.000Z"
}
```

---

## 1. Authentication Endpoints

### `POST /auth/login`
Authenticates administrative users and issues a JWT token.

- **Request Body**:
  ```json
  {
    "email": "admin@aurelien.gold",
    "password": "AdminPassword123!"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "usr_9981",
        "email": "admin@aurelien.gold",
        "name": "Master Atelier Admin",
        "role": "ADMIN"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### `GET /auth/me`
Fetches current logged-in user profile.
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: User profile object.

---

## 2. Product Endpoints

### `GET /products`
Retrieves a paginated and filterable list of jewelry items.

- **Query Parameters**:
  - `category` (optional, string): e.g. `bridal-sets`, `necklaces`, `rings`, `bangles`
  - `purity` (optional, string): e.g. `24K`, `22K`, `18K`
  - `minPrice` (optional, number)
  - `maxPrice` (optional, number)
  - `search` (optional, string): Full-text keyword match
  - `sortBy` (optional, string): `price_asc`, `price_desc`, `newest`, `weight_desc`
  - `page` (optional, default: 1)
  - `limit` (optional, default: 12)

- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "prod_01",
          "name": "Aura Imperial 22K Gold Choker",
          "slug": "aura-imperial-22k-gold-choker",
          "category": "necklaces",
          "purity": "22K",
          "grossWeight": 48.65,
          "netWeight": 48.00,
          "makingChargesPerGram": 450,
          "estimatedPrice": 24500,
          "hallmarkCertified": true,
          "inStock": true,
          "featured": true,
          "images": ["/images/products/royal-choker.svg"]
        }
      ],
      "pagination": {
        "total": 42,
        "page": 1,
        "totalPages": 4,
        "limit": 12
      }
    }
  }
  ```

### `GET /products/:id`
Retrieves single product details by ID or slug.

### `POST /products` *(Admin Only)*
Creates a new product in the boutique inventory.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "Celestial Knot Solitaire Ring",
    "description": "Hand-forged 18K yellow gold band encrusted with fine VS diamonds.",
    "categoryId": "cat_rings",
    "purity": "18K",
    "grossWeight": 7.42,
    "netWeight": 7.20,
    "makingChargesPerGram": 600,
    "estimatedPrice": 7200,
    "images": ["/images/products/solitaire-ring.svg"]
  }
  ```

### `PUT /products/:id` *(Admin Only)*
Updates existing jewelry record.

### `DELETE /products/:id` *(Admin Only)*
Soft deletes or removes product from active inventory.

---

## 3. Categories Endpoints

### `GET /categories`
Lists all public active jewelry collections and categories.

### `POST /categories` *(Admin Only)*
Creates a new collection category.

---

## 4. Client Inquiries Endpoints

### `POST /inquiries` *(Public)*
Allows prospective clients to request a private viewing, customization quotation, or consultation.

- **Request Body**:
  ```json
  {
    "fullName": "Lady Evelyn Vance",
    "email": "evelyn@domain.com",
    "phone": "+1 (555) 234-5678",
    "productId": "prod_01",
    "preferredKarat": "22K",
    "message": "Inquiring about bespoke sizing and private boutique viewing in Manhattan."
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Inquiry received. A bespoke concierge will contact you within 2 hours."
  }
  ```

### `GET /inquiries` *(Admin Only)*
Fetches all client inquiries with filtering by status (`PENDING`, `CONTACTED`, `APPOINTMENT_SCHEDULED`, `CLOSED`).

### `PATCH /inquiries/:id/status` *(Admin Only)*
Updates inquiry status and concierge internal notes.

---

## 5. Health & Diagnostic Endpoints

### `GET /health`
Returns system heartbeat, database connection status, and uptime.
```json
{
  "success": true,
  "status": "healthy",
  "uptime": 1420.45,
  "database": "connected"
}
```
