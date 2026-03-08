# Research: Merchant Landing Page Application

**Phase**: 0 (Research & Clarification)  
**Date**: 2026-03-08  
**Purpose**: Resolve technical unknowns and validate technology choices for merchant-webapp

## Research Findings

### 1. React + Vite vs Create React App (CRA)

**Question**: Which build tool should the merchant-webapp use?

**Decision**: **Vite 5.0+** (preferred) with fallback to Create React App 5.0+

**Rationale**:
- Vite: Extremely fast cold start (<500ms), instant HMR (hot module replacement), minimal configuration, modern ES modules by default
- Both support React 18+ and can generate a production bundle with zero external framework dependencies
- Vite requires `@vitejs/plugin-react` only; CRA requires no additional setup
- Per Constitution: "Build tooling: Vite or Create React App supported"
- For educational purposes, Vite demonstrates modern frontend tooling

**Alternatives Considered**:
- Webpack directly: Rejected - too complex for MVP, no clear advantage over Vite/CRA
- Next.js/Remix: Rejected - full-framework overkill; Constitution prohibits unnecessary dependencies
- Parcel: Rejected - Vite/CRA are better maintained and more aligned with React ecosystem

**Implementation**:
```bash
# Initialize with Vite + React
npm create vite@latest merchant-webapp -- --template react
cd merchant-webapp
npm install
npm run dev  # Starts on http://localhost:5173
```

---

### 2. Product Data Storage (Static vs Dynamic)

**Question**: How should product data be loaded and stored in the application?

**Decision**: **Static JSON file bundled with the app** (committed to git), loaded on page init into memory

**Rationale**:
- Per spec requirement FR-001 and FR-004: "Static JSON or in-memory data"
- Constitution: "Educational simplicity over production patterns" — no database needed
- Spec edge case: "If product list is empty? Display placeholder" — doesn't require dynamic loading complexity
- Makes testing independent: No network call needed for products
- Demonstrates clear separation: Products are merchant data; xPay Backend only provides checkout functionality
- File location: `src/data/products.json` (5KB max; 3-10 products for demo)

**Alternatives Considered**:
- API call to fetch products from backend: Rejected - adds unnecessary complexity, violates independence requirement (can't test without xPay Backend)
- Hardcoded array in component: Rejected - less maintainable if we want to update product list
- Database (SQLite / IndexedDB): Rejected - violates Constitution principle "Educational Simplicity"

**Implementation**:
```json
// src/data/products.json
{
  "products": [
    {
      "id": "prod_001",
      "name": "Premium Widget",
      "price": 99.99,
      "description": "High-quality widget for all your needs",
      "image_url": "https://via.placeholder.com/300x200?text=Widget"
    },
    ...
  ]
}
```

---

### 3. State Management Approach (Hooks vs External Library)

**Question**: How should component state be managed?

**Decision**: **React Hooks only** (useState, useEffect); no Redux, Zustand, Recoil, or Mobx

**Rationale**:
- Constitution requirement: "No state management library (Redux, Zustand prohibited); use React hooks only"
- For this scope (3 user stories), hooks are sufficient and cleaner
- Custom hooks (`useCheckout`, `useRedirectStatus`) encapsulate logic without external dependencies
- Per spec: Application focus is on demonstrating payment flow, not state management patterns

**Alternatives Considered**:
- Redux: Rejected - over-engineered for this scope; Constitution prohibits
- Context API alone: Considered but hooks are simpler for this feature scope
- MobX: Rejected - not needed; Constitution explicitly prohibits state libraries

**Implementation**:
```javascript
// src/hooks/useCheckout.js encapsulates checkout logic
function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const initiateCheckout = async (product) => {
    // Fetch from xPay Backend, handle redirect
  };
  
  return { isLoading, error, initiateCheckout };
}
```

---

### 4. HTTP Client Library (Fetch vs Axios)

**Question**: How should HTTP requests to xPay Backend be made?

**Decision**: **Fetch API** (native browser API); no axios, superagent, or ky

**Rationale**:
- Native browser API; no external dependency required
- Per spec FR-010: "Application MUST use Fetch API for all HTTP requests"
- Per Constitution: "Minimal Dependencies and Standard Library Preference"
- Adequate for educational MVP; shows foundations of HTTP communication
- Simple error handling + retry wrapper is built-in to learning

**Alternatives Considered**:
- Axios: Rejected - adds external dependency; Fetch is sufficient
- Superagent: Rejected - same as above
- GraphQL (Apollo): Rejected - REST APIs are simpler per Constitution

**Implementation**:
```javascript
// src/services/checkoutService.js
export async function createCheckoutSession(product) {
  const response = await fetch('/api/checkout/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: product.id, price: product.price })
  });
  
  if (!response.ok) throw new Error('Checkout session creation failed');
  return await response.json();
}
```

---

### 5. Styling Approach (Plain CSS vs CSS-in-JS)

**Question**: How should component styling be implemented?

**Decision**: **Plain CSS** (separate `.css` files or inline styles); no styled-components, CSS-in-JS, or Tailwind

**Rationale**:
- Per spec FR-012: "Application styling MUST be minimal and focus on clarity"
- Per Constitution: "No CSS-in-JS libraries, no Tailwind/Material-UI/Bootstrap"
- Plain CSS demonstrates fundamentals; CSS-in-JS adds unnecessary complexity for MVP
- Easier to reason about; clearer separation of concerns (HTML/JSX, CSS, JavaScript)
- Plain CSS is fast; no runtime overhead

**Alternatives Considered**:
- Tailwind CSS: Rejected - Constitution explicitly prohibits UI frameworks
- Styled-components: Rejected - Constitution prohibits CSS-in-JS
- Sass/SCSS: Rejected - adds build complexity; plain CSS sufficient for educational project

**Implementation**:
```css
/* src/styles/components.css */
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin: 12px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-buy-now {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

---

### 6. API Base URL Configuration

**Question**: How should the xPay Backend API endpoint be configured?

**Decision**: **Environment-based configuration** via `.env.local` file; xPay Backend assumed at `http://localhost:3001`

**Rationale**:
- Allows different URLs in development, staging, production
- Per assumption: "xPay Backend assumed to be running at http://localhost:3001 (configurable via environment variable)"
- Keeps credentials/URLs out of committed code
- Simple Vite/CRA support via `VITE_` or `REACT_APP_` prefixes

**Alternatives Considered**:
- Hardcoded URL: Rejected - inflexible; breaks when running on different ports
- Runtime config endpoint: Rejected - over-engineered for MVP
- DNS/service discovery: Rejected - educational project, not production deployment

**Implementation**:
```env
# .env.local (git-ignored)
VITE_XPAY_BACKEND_URL=http://localhost:3001

# src/constants.js
export const XPAY_BACKEND_URL = import.meta.env.VITE_XPAY_BACKEND_URL || 'http://localhost:3001';
```

---

### 7. Error Handling Strategy

**Question**: How should errors from xPay Backend be handled?

**Decision**: User-friendly error messages with retry capability; no error stack traces in UI

**Rationale**:
- Per spec FR-007: "If API fails, display user-friendly error message and remain on landing page"
- Educational context: Users should understand failure modes without technical details
- Prevents information leakage (no stack traces in production)
- Per edge case: "slow API calls (>5s) should display loading indicator; timeout after 10s"

**Alternatives Considered**:
- Silent failures: Rejected - violates user experience requirement
- Raw error stack traces: Rejected - confusing for users

**Implementation**:
```javascript
// Timeout wrapper
const fetchWithTimeout = (url, options, timeout = 10000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

// User-facing error messages
const errorMessages = {
  'Request timeout': 'Payment service is taking too long. Please try again.',
  'Network error': 'Unable to connect to payment service. Check your internet.',
  'Bad request': 'Invalid request. Please try again.',
  'Server error': 'Payment service encountered an error. Please try again.'
};
```

---

### 8. Testing Strategy

**Question**: How should the merchant-webapp be tested?

**Decision**: Unit + integration tests using Jest/Vitest; contract tests for xPay Backend API calls

**Rationale**:
- Jest (CRA): Built-in, no setup; Vitest (Vite): Modern, fast, compatible with Jest syntax
- Unit tests: Component rendering, user interactions, hooks logic
- Integration tests: Full checkout flow from product display to redirect
- Contract tests: Verify request shapes sent to xPay Backend (testable without running backend)
- Per Constitution: "Contract tests MUST exist for all inter-service communication"

**Alternatives Considered**:
- E2E tests only (Cypress/Playwright): Rejected - unnecessary for this scope; unit/integration sufficient
- No tests: Rejected - violates Constitution principle "Verifiable Service Contracts"

**Implementation**:
```javascript
// src/services/checkoutService.test.js - Contract test
describe('checkoutService', () => {
  it('sends correct request shape to xPay Backend', async () => {
    const mockProduct = { id: 'prod_001', name: 'Widget', price: 99.99 };
    // Mock fetch, verify request payload matches contract
  });
});

// src/components/ProductCard.test.jsx - Unit test
describe('ProductCard', () => {
  it('renders product name, price, and Buy Now button', () => {
    // Render, assert DOM contains expected elements
  });
});
```

---

## Resolved Unknowns

| Area | Unknown | Resolution |
|------|---------|-----------|
| Build Tool | Vite or CRA? | **Vite 5+** (faster, minimal config) |
| Product Data | Static JSON or API? | **Static JSON** (bundled, independent) |
| State Mgmt | Hooks or Redux? | **React Hooks only** (simple, sufficient) |
| HTTP Client | Fetch or Axios? | **Fetch API** (native, no dependency) |
| Styling | Plain CSS or Tailwind? | **Plain CSS** (simple, no frameworks) |
| Config | Hardcoded or Env? | **Environment variables** via `.env.local` |
| Error Handling | Type of messages? | **User-friendly** with retry & timeout |
| Testing | What to test? | **Unit + Integration + Contract** (via Jest/Vitest) |

## Technology Stack Summary

| Category | Choice | Rationale |
|----------|--------|-----------|
| Runtime | Node 18+ LTS | Latest stable JavaScript runtime |
| React | 18.2+ | Latest stable React with hooks |
| Build | Vite 5.0+ | Fast, minimal setup, modern tooling |
| HTTP | Fetch API | Native, no dependency |
| Styling | CSS (plain) | Simple, focused on clarity |
| Testing | Jest/Vitest | Built-in, adequate coverage |
| State | React Hooks | Sufficient, no extra dependencies |

## Implementation Readiness

✅ All research questions resolved  
✅ No "NEEDS CLARIFICATION" items remain  
✅ Technology choices align with Constitution  
✅ Ready to proceed to Phase 1 (Design) with data-model.md, quickstart.md, contracts/
