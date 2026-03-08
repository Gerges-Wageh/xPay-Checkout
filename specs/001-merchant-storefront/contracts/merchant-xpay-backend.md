# API Contract: Merchant App ↔ xPay Backend

**Service Pair**: Merchant Landing Page (React) ↔ xPay Backend (Go)  
**Protocol**: HTTP/REST (JSON)  
**Status**: Draft  
**Version**: 1.0.0  
**Date**: 2026-03-08

---

## Overview

This contract defines the API communication between the **Merchant Web Application** (frontend) and the **xPay Backend** service. The merchant app initiates payment sessions by calling xPay Backend's checkout session endpoint.

**Principles**:
- Merchant app MUST NOT communicate with Payment Provider directly
- All payment session creation requests go through xPay Backend
- API responses are used by merchant app to redirect user to hosted checkout
- Contract changes MUST be coordinated between both services

---

## Endpoint: Create Checkout Session

### Request

**Method**: `POST`  
**Path**: `/checkout/session`  
**Host**: xPay Backend (e.g., `http://localhost:3001`)  
**Content-Type**: `application/json`

### Request Body

```typescript
interface CreateCheckoutSessionRequest {
  product_id: string;        // (Required) ID of the product being purchased
  product_name: string;      // (Required) Name of the product
  product_price: number;     // (Required) Price of the product (in decimal: 99.99 or cents: 9999)
  currency?: string;         // (Optional) Currency code (default: "USD")
  merchant_id?: string;      // (Optional) ID of the merchant (if multi-tenant)
}
```

### Request Example

```bash
POST http://localhost:3001/checkout/session HTTP/1.1
Content-Type: application/json

{
  "product_id": "prod_premium_widget",
  "product_name": "Premium Widget",
  "product_price": 99.99,
  "currency": "USD"
}
```

### Request Validation Rules (Server-side)

- `product_id`: Non-empty string, required
- `product_name`: Non-empty string, required, max 255 characters
- `product_price`: Positive number, required, must be > 0
- `currency`: If provided, must be valid ISO 4217 code (default: USD)

**Error Conditions** (client should not cause these with valid data):
- Malformed JSON: 400 Bad Request
- Missing required fields: 400 Bad Request
- Invalid field types: 400 Bad Request
- Price <= 0: 400 Bad Request

---

## Response Formats

### Success Response (200 OK)

```javascript
HTTP/1.1 200 OK
Content-Type: application/json

{
  "session_id": "sess_8a3b5c9f2e1d4b67",
  "checkout_url": "http://localhost:3002/checkout/sess_8a3b5c9f2e1d4b67",
  "expires_at": "2026-03-08T12:30:00Z",
  "status": "active"
}
```

**Response Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | Yes | Unique session identifier (opaque) |
| `checkout_url` | string | Yes | Absolute URL to redirect user to xPay Checkout |
| `expires_at` | string (ISO 8601) | No | Session expiration time (UTC) |
| `status` | string | No | Session status ("active", "pending", etc.) |

**Validation Rules (Client should enforce)**:
- `session_id`: Non-empty string, treat as opaque (don't parse)
- `checkout_url`: Must be valid absolute URL (http:// or https://), same origin as xPay Checkout
- `expires_at`: If present, must be parseable as ISO 8601 timestamp

### Error Response (4xx, 5xx)

```javascript
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "invalid_product_id",
  "message": "Product ID 'invalid_prod' not found",
  "code": "PRODUCT_NOT_FOUND"
}
```

OR

```javascript
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "internal_error",
  "message": "Failed to create checkout session. Please try again.",
  "code": "SESSION_CREATION_FAILED"
}
```

**Error Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `error` | string | Machine-readable error code |
| `message` | string | Human-readable error message (safe to display to user) |
| `code` | string | Alternative error code format |

**Common Error Codes**:

| Status | Error Code | Meaning | User Message |
|--------|-----------|---------|--------------|
| 400 | `invalid_product_id` | Product not found or invalid | "Product not available" |
| 400 | `invalid_price` | Price is invalid (<=0, wrong format) | "Invalid product price" |
| 400 | `missing_required_field` | Required field missing from request | "Invalid request data" |
| 400 | `malformed_json` | JSON parsing error | "Invalid request format" |
| 500 | `session_creation_failed` | Backend error creating session | "Payment service error. Please try again." |
| 500 | `database_error` | Database/storage failure | "Service unavailable. Please try again." |
| 503 | `service_unavailable` | xPay Backend down or overloaded | "Payment service is down. Please try again later." |

---

## Client Behavior (Merchant App)

### Request Handling

1. **On "Buy Now" click**:
   ```javascript
   const product = { id: "prod_001", name: "Widget", price: 99.99 };
   
   const response = await fetch('http://localhost:3001/checkout/session', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       product_id: product.id,
       product_name: product.name,
       product_price: product.price
     })
   });
   ```

2. **Response handling**:
   - If HTTP 200: Extract `checkout_url` and redirect user
   - If HTTP 4xx or 5xx: Parse error message and display to user

3. **Redirect on success**:
   ```javascript
   window.location.href = response.data.checkout_url;
   ```

### Timeout Handling

- Request timeout: 10 seconds (user should see "Payment service is taking too long" message)
- User can retry by clicking "Buy Now" again

### Error Messages (User-Facing)

| Server Response | Merchant App Shows |
|-----------------|-------------------|
| 200 OK + checkout_url | Redirect (no message) |
| 4xx error | "Something went wrong with your request. Please try again." |
| 5xx error | "Payment service encountered an error. Please try again." |
| Timeout/Network error | "Unable to connect to payment service. Check your internet." |

---

## Testing & Verification

### Manual Testing

**Setup**:
1. Start xPay Backend: `go run ./...` (on port 3001)
2. Start merchant-webapp: `npm run dev` (on port 5173)

**Test Happy Path**:
```bash
# In browser console or via curl
curl -X POST http://localhost:3001/checkout/session \
  -H 'Content-Type: application/json' \
  -d '{"product_id": "prod_001", "product_name": "Widget", "product_price": 99.99}'

# Expected response
{
  "session_id": "sess_abc123",
  "checkout_url": "http://localhost:3002/checkout/sess_abc123"
}
```

**Test Error Path**:
```bash
# Missing required field
curl -X POST http://localhost:3001/checkout/session \
  -H 'Content-Type: application/json' \
  -d '{"product_id": "prod_001"}'

# Expected response (400)
{
  "error": "missing_required_field",
  "message": "product_name is required"
}
```

### Contract Tests (Automated)

The merchant app should include contract tests verifying:

```javascript
// checkoutService.test.js
describe('POST /checkout/session', () => {
  test('sends correct request shape', () => {
    // Verify request includes product_id, product_name, product_price
  });
  
  test('handles 200 success response', () => {
    // Verify response has session_id and checkout_url
  });
  
  test('handles 4xx errors gracefully', () => {
    // Verify error message is parsed and shown to user
  });
  
  test('handles timeout gracefully', () => {
    // Verify timeout error is handled (after 10s)
  });
});
```

---

## API Stability & Changes

### Backward Compatibility

- **New optional fields** can be added to request (merchant app ignores unknown fields on response)
- **New optional fields** can be added to response (merchant app ignores unknown fields)
- **Required fields** CANNOT change without a version bump or deprecation period

### Breaking Changes

If a **breaking change** is necessary:
1. Plan a deprecation period (at least 2 sprints notice)
2. Offer parallel support for old and new formats
3. Update contract document with version number
4. Notify all dependent services (currently: Merchant App)

### Version Bumping

Current contract version: **1.0.0** (Major.Minor.Patch)

- **Patch** (1.0.1): Documentation fixes, non-functional changes
- **Minor** (1.1.0): New optional fields, new error codes
- **Major** (2.0.0): Breaking changes (required field names change, response format changes)

---

## Deployment & Coordination

**When to update this contract**:
- Adding/removing required request fields → Coordinate with merchant app team
- Changing response field names → Coordinate with merchant app team
- Adding new error codes → Update contract; merchant app can ignore unknown errors
- Changing HTTP status codes → Breaking change; full coordination needed

**Deployment order**:
1. Update contract (this file)
2. Update xPay Backend to support new contract
3. Update merchant app to use new contract
4. Test end-to-end before production deployment

---

## See Also

- [Merchant Landing Page Specification](../spec.md)
- [Data Model](../data-model.md)
- [xPay Backend API Contracts](../../xpay-backend/contracts/) (when created)
