# Colf API Specification

This document lists the backend APIs needed to support the Colf frontend (booking marketplace). It includes endpoints, request/response models, auth, error model and integration notes. Save this file and use it as the single reference while building the backend.

---

## Authentication

All protected endpoints require `Authorization: Bearer <token>` (JWT). Use standard login/register flows. Tokens expire; provide a refresh endpoint.

- POST /api/auth/register
  - Request
    {
      "name": "string",
      "email": "string",
      "phone": "string",
      "password": "string"
    }
  - Response 201
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "createdAt": "ISO8601"
    }

- POST /api/auth/login
  - Request
    {
      "email": "string",
      "password": "string"
    }
  - Response 200
    {
      "accessToken": "string",
      "refreshToken": "string",
      "expiresIn": 3600,
      "user": { "id":"string","name":"string","email":"string","phone":"string" }
    }

- POST /api/auth/refresh
  - Request
    { "refreshToken": "string" }
  - Response 200
    { "accessToken": "string", "expiresIn": 3600 }

---

## Services (catalog)

- GET /api/services
  - Query params (optional): `?page=1&limit=20&category=&q=`
  - Response 200
    {
      "data": [
        {
          "id": "string",
          "title": "string",
          "slug": "string",
          "description": "string",
          "priceFrom": number,
          "image": "/images/..",
          "category": "string"
        }
      ],
      "page": 1,
      "limit": 20,
      "total": 123
    }

- GET /api/services/{serviceId}
  - Response 200
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "priceFrom": number,
      "durationMinutes": 60,
      "images": ["/images/.."],
      "providerInfo": { "id":"string","name":"string" }
    }

- GET /api/services/{serviceId}/slots?date=YYYY-MM-DD
  - Returns available time slots for the given date (respect provider working hours + existing bookings)
  - Response 200
    {
      "date": "2026-03-21",
      "serviceId": "string",
      "slots": [
        { "time": "09:00", "available": true },
        { "time": "10:00", "available": false }
      ]
    }

- GET /api/search?q=ac+repair
  - Response 200 same shape as `GET /api/services` but filtered by search.

---

## Booking APIs

- POST /api/bookings
  - Create a provisional booking (reservation). The booking is persisted and may be `paid: false` initially. Backend must check slot availability and lock the slot for a short window.
  - Request
    {
      "serviceId": "string",
      "userId": "string",         // if not logged-in allow guest with contact
      "date": "YYYY-MM-DD",
      "time": "HH:mm",
      "name": "string",
      "phone": "string",
      "metadata": { }
    }
  - Responses
    - 201 Created
      {
        "id": "string",
        "serviceId": "string",
        "userId": "string",
        "date": "YYYY-MM-DD",
        "time": "HH:mm",
        "name": "string",
        "phone": "string",
        "paid": false,
        "status": "reserved",    // reserved | confirmed | cancelled
        "createdAt": "ISO8601"
      }
    - 409 Conflict (slot already taken)
      { "error": "Slot not available", "code": "slot_unavailable" }

- GET /api/bookings/{bookingId}
  - Response 200 booking object (as above)

- GET /api/bookings?userId={id}&page=&limit=
  - Returns list of bookings for a user (or for provider/admin with appropriate filters)
  - Response 200
    {
      "data": [ /* booking objects */ ],
      "page":1,"limit":20,"total":10
    }

- DELETE /api/bookings/{bookingId}
  - Cancel a booking (if allowed). Response 204 on success.

- PATCH /api/bookings/{bookingId}/status
  - For provider/admin to update booking status
  - Request { "status": "confirmed" }  (allowed: reserved, confirmed, completed, cancelled)
  - Response 200 updated booking object

---

## Payments

Keep payments decoupled from bookings using a payments resource. Support both mock payments and real gateway webhooks.

- POST /api/bookings/{bookingId}/pay
  - Initiate a payment and (for mock) mark paid; for real gateway, return payment intent/client token.
  - Request
    {
      "method": "mock" | "stripe" | "paypal",
      "amount": number,
      "currency": "INR"
    }
  - Response
    - For `method: mock` -> 200
      { "status":"paid", "booking": { ...booking... } }
    - For real provider -> 200
      { "provider":"stripe", "clientSecret":"<secret>" }

- POST /api/payments/webhook
  - Payment gateway webhook to confirm successful payments.
  - Request: gateway-specific payload
  - Response 200

- GET /api/payments/{id}
  - Return payment object for audit
  - Response
    {
      "id":"string",
      "bookingId":"string",
      "amount": number,
      "currency":"INR",
      "status":"succeeded|failed|pending",
      "provider":"stripe",
      "meta": {}
    }

Notes: use idempotency keys on payment creation to avoid double-charges. Store provider webhook secrets.

---

## Users & Profiles

- GET /api/users/{id}
- PUT /api/users/{id}
- GET /api/me  (returns current user)

User model
{
  "id":"string",
  "name":"string",
  "email":"string",
  "phone":"string",
  "role":"user|provider|admin",
  "createdAt":"ISO8601"
}

---

## Provider / Admin APIs (management)

- GET /api/providers/{providerId}/bookings?date=&status=
- GET /api/dashboard/overview (admin)
  - Response sample
    {
      "todayBookings": 5,
      "upcoming": 12,
      "revenueToday": 12345
    }
- PATCH /api/bookings/{id} (update status/assign provider)

---

## Notifications

- POST /api/notifications/send  (internal) to send SMS / email for booking confirmations.
- Webhook endpoints for third-party notifications if required.

---

## Assets

Serve images from a static asset path, e.g. `/images/...`. Provide endpoints if you want signed uploads:
- POST /api/uploads (return URL)

---

## Error model

All errors should return a consistent model:

- 4xx / 5xx
  {
    "error": "Human readable message",
    "code": "machine_code",
    "details": { /* optional */ }
  }

Common codes
- `slot_unavailable` – booking conflicts
- `auth_required` – missing/invalid token
- `validation_error` – request body invalid

---

## Misc / Integration notes

- All date/time fields use ISO date for `date` (YYYY-MM-DD) and 24-hour `HH:mm` for `time`.
- Timezone: store with timezone or clearly document server timezone. Prefer storing timestamps in UTC.
- Concurrency: when creating bookings, implement a short lock or transactional insert to prevent double-booking.
- Idempotency: accept `Idempotency-Key` for booking and payment creation to avoid duplicates.
- Pagination: use `page` and `limit` with sensible defaults.
- Security: protect webhook endpoints with secret validation; only expose provider-specific data to the owner.

---

## Quick Example: Create booking + pay (mock)

1) POST /api/bookings
Request
{
  "serviceId":"s1",
  "userId":"u1",
  "date":"2026-03-25",
  "time":"10:00",
  "name":"Alice",
  "phone":"9999999999"
}
Response 201
{
  "id":"b_abc123",
  "serviceId":"s1",
  "date":"2026-03-25",
  "time":"10:00",
  "paid": false,
  "status":"reserved"
}

2) POST /api/bookings/b_abc123/pay
Request { "method":"mock", "amount":499, "currency":"INR" }
Response 200
{ "status":"paid", "booking": { "id":"b_abc123","paid":true } }

---

If you want, I can also export this document to PDF or a different format before you leave. Would you like a PDF copy of this API spec now?