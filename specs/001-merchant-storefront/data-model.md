# Data Model: Merchant Landing Page Application

**Phase**: 1 (Design - Data Model)  
**Date**: 2026-03-08  
**Purpose**: Define the data structures and entities for merchant-webapp

## Core Entities

### Product

Represents a merchandise item available for purchase on the store.

```typescript
interface Product {
  id: string;                 // Unique identifier (e.g., "prod_001")
  name: string;              // Product name (e.g., "Premium Widget")
  price: number;             // Price in cents (e.g., 9999 for $99.99) or decimal
  description: string;       // Short product description
  image_url: string;         // URL to product image (external or bundled)
  [key: string]: unknown;    // Allow additional fields for flexibility
}
```

**Validation Rules**:
- `id`: Non-empty string, unique within product list
- `name`: Non-empty string, max 100 characters
- `price`: Positive number, max 2 decimal places (or integer if cents-based)
- `description`: Non-empty string, max 500 characters
- `image_url`: Valid URL format or data URI

**State**: Immutable once loaded; no updates to product list during session

**Example**:
```json
{
  "id": "prod_premium_widget",
  "name": "Premium Widget",
  "price": 99.99,
  "description": "High-quality widget with advanced features and lifetime support",
  "image_url": "https://example.com/images/premium-widget.png"
}
```

---

### Checkout Session Request

Data sent by the merchant app to xPay Backend's `POST /checkout/session` endpoint.

```typescript
interface CheckoutSessionRequest {
  product_id: string;        // ID of the product being purchased
  product_name: string;      // Name of the product (for display on checkout)
  product_price: number;     // Price of the product
  [key: string]: unknown;    // Allow additional fields (e.g., quantity, customer_id)
}
```

**Validation Rules**:
- `product_id`: Must match a valid product ID from the store
- `product_name`: Non-empty string; should match product name
- `product_price`: Must match the product's current price (prevents price manipulation)

**Notes**:
- Merchant app generates this; xPay Backend validates and stores
- No sensitive payment info included (per Constitution: "Client-Server Boundary Clarity")

**Example**:
```json
{
  "product_id": "prod_premium_widget",
  "product_name": "Premium Widget",
  "product_price": 99.99
}
```

---

### Checkout Session Response

Data returned by xPay Backend's `POST /checkout/session` endpoint.

```typescript
interface CheckoutSessionResponse {
  session_id: string;        // Unique session identifier
  checkout_url: string;      // URL where user should be redirected for checkout
  expires_at?: number;       // Optional: session expiration timestamp (ISO 8601 or Unix)
  [key: string]: unknown;    // Allow additional fields
}
```

**Validation Rules**:
- `session_id`: Non-empty string, unique across all sessions
- `checkout_url`: Valid absolute URL; must start with same domain as xPay Checkout host

**Notes**:
- Merchant app uses `checkout_url` for redirect; doesn't process session_id
- Merchant app should not retry if response includes an error status

**Example**:
```json
{
  "session_id": "sess_abc123def456",
  "checkout_url": "http://localhost:3002/checkout/sess_abc123def456",
  "expires_at": "2026-03-08T12:00:00Z"
}
```

---

### Redirect Status (URL Parameters)

Parameters passed back to merchant app when user returns from xPay Checkout.

```typescript
interface RedirectStatus {
  success: boolean;          // true = payment successful; false = failed/cancelled
  session_id?: string;       // Reference to the session (optional)
  message?: string;          // Optional human-readable message
}
```

**Encoded in URL**:
- Success: `?success=true&session_id=sess_abc123`
- Failure: `?success=false&message=payment_declined`

**Validation Rules**:
- `success` parameter must be present ("true" or "false" as string)
- If `success=true`: Payment should be considered completed
- If `success=false`: Payment should be considered failed; user can retry

**Notes**:
- Merchant app shows success/failure message to user
- No payment data returned in URL (sensitive data stays on backend)

**Example**:
```
merchant-app/?success=true&session_id=sess_abc123
```

---

## Component State Management

### ProductList Component State

```typescript
interface ProductListState {
  products: Product[];       // Loaded product array
  isLoading: boolean;        // Initial page load state
  error: string | null;      // Error message if product loading failed
}
```

**Transitions**:
- Initial: `{ products: [], isLoading: true, error: null }`
- Success: `{ products: [...], isLoading: false, error: null }`
- Failure: `{ products: [], isLoading: false, error: "Failed to load products" }`

---

### CheckoutButton Component State

```typescript
interface CheckoutButtonState {
  isLoading: boolean;        // API request in progress
  error: string | null;      // API error message
  isDisabled: boolean;       // Button disabled during request
}
```

**Transitions**:
- Idle: `{ isLoading: false, error: null, isDisabled: false }`
- Requesting: `{ isLoading: true, error: null, isDisabled: true }`
- Success: Redirect happens; state reset
- Failure: `{ isLoading: false, error: "...", isDisabled: false }` (user can retry)

---

### App Component State

```typescript
interface AppState {
  currentPage: 'products' | 'success' | 'error';  // What view to show
  redirectStatus: RedirectStatus | null;          // Parsed from URL on mount
  products: Product[];                             // Cached product list
}
```

**Transitions**:
- On mount: Parse URL; if `?success=true/false`, show result; else show products
- After checkout redirect: URL changes; App detects; shows status

---

## Data Flow

### Initial Load
```
App mounts
  ↓
Parse URL for redirect status (useEffect)
  ↓
If success/failure in URL: show RedirectStatus message
  ↓
Else: Load products from src/data/products.json
  ↓
Display ProductList with products
```

### Checkout Flow
```
User clicks "Buy Now" on a ProductCard
  ↓
CheckoutButton.onClick handler
  ↓
Create CheckoutSessionRequest { product_id, product_name, product_price }
  ↓
Call xPay Backend POST /checkout/session (via checkoutService)
  ↓
Receive CheckoutSessionResponse { session_id, checkout_url }
  ↓
Redirect user to checkout_url (window.location.href = checkout_url)
  ↓
User completes payment on xPay Checkout UI
  ↓
xPay redirects user back to merchant app with ?success=true/false
  ↓
App detects redirect; displays RedirectStatus message
  ↓
User clicks "Continue Shopping" → Return to product list
```

---

## Data Persistence

| Data | Storage | Scope | Lifetime |
|------|---------|-------|----------|
| Products | Static JSON file (src/data/products.json) | App-wide | Session (reloaded on refresh) |
| Checkout Status | URL query parameters | Current session | Until URL changes |
| User Input | None captured | N/A | N/A |

**Notes**:
- No localStorage or IndexedDB needed (per Constitution)
- Products re-loaded on page refresh
- Checkout sessions are server-side (xPay Backend responsible)

---

## API Contracts

### Request: Create Checkout Session

**Endpoint**: `POST /checkout/session`  
**Host**: xPay Backend (e.g., `http://localhost:3001`)

**Request Body** (CheckoutSessionRequest):
```json
{
  "product_id": "prod_001",
  "product_name": "Premium Widget",
  "product_price": 99.99
}
```

**Response: Success (200 OK)**:
```json
{
  "session_id": "sess_abc123def456",
  "checkout_url": "http://localhost:3002/checkout/sess_abc123def456"
}
```

**Response: Error (4xx, 5xx)**:
```json
{
  "error": "Invalid product ID",
  "code": "INVALID_PRODUCT"
}
```

**See**: [contracts/merchant-xpay-backend.md](contracts/merchant-xpay-backend.md) for full contract definition

---

## Validation & Error Handling

### Product Validation

When products are loaded from `products.json`:
- Must be an array of objects
- Each object must have: `id`, `name`, `price`, `description`, `image_url`
- Missing fields → Log error; show placeholder product
- Empty list → Show "No products available" message

### API Request Validation

Before sending request to xPay Backend:
- Product ID must exist in the store
- Price must be positive number
- Product name must be non-empty

### API Response Validation

After receiving response from xPay Backend:
- Must have `session_id` and `checkout_url` fields
- `checkout_url` must be valid URL
- If response has error: Display error message; don't redirect

---

## No-SQL, No-ORM, No-Database

Per Constitution: "Educational Simplicity Over Production Patterns"
- All data is static/in-memory
- No database queries or migrations needed
- No ORM dependencies (TypeORM, Prisma, Sequelize, etc.)
- No async data fetching beyond xPay Backend API calls
- Testing is simplified: No test database setup; data is deterministic
