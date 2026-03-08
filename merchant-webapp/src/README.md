# xPay Merchant Storefront - Source Code Documentation

## Overview

This directory contains the React-based merchant landing page application for xPay payment processing. The application allows merchants to display products and initiate payment checkout through the xPay Backend API.

## Architecture

### Component Structure

```
src/
├── components/          # React components
│   ├── ProductCard.jsx           # Single product display with Buy Now button
│   ├── ProductList.jsx           # Grid displaying all products
│   ├── CheckoutButton.jsx        # Checkout initiation button with loading/error states
│   ├── ErrorMessage.jsx          # Generic error display with retry option
│   ├── SuccessMessage.jsx        # Payment success confirmation
│   └── FailureMessage.jsx        # Payment failure notification
├── hooks/              # Custom React hooks
│   ├── useProducts.js            # Hook for loading products.json on component mount
│   ├── useCheckout.js            # Hook for managing checkout session state and API calls
│   └── useRedirectStatus.js      # Hook for parsing redirect parameters from URL
├── services/           # API service functions
│   └── checkoutService.js        # Checkout API client with error handling and timeout management
├── data/               # Static JSON data
│   └── products.json             # Sample product catalog (merchant-specific data)
├── styles/             # CSS stylesheets organized by scope
│   ├── index.css                 # Global reset, typography, utilities
│   ├── layout.css                # Grid system, flexbox, responsive breakpoints
│   └── components.css            # Component-specific styles (ProductCard, messages, buttons)
├── constants.js        # Configuration constants and API endpoints
└── App.jsx             # Root component with page routing logic
```

## Data Flow

### Product Display (User Story 1)

```
App.jsx (initial page='products')
  ↓
ProductList.jsx (renders)
  ↓
useProducts() hook (loads src/data/products.json)
  ↓
ProductCard.jsx × 5 (renders each product)
  ↓
User sees: name, price, description, image, "Buy Now" button
```

### Checkout Initiation (User Story 2)

```
ProductCard "Buy Now" button clicked
  ↓
ProductList.onBuyNow(product) handler
  ↓
useCheckout().initiateCheckout(product)
  ↓
checkoutService.createCheckoutSession(product)
  ↓
POST ${XPAY_BACKEND_URL}/checkout/session
  ↓
Response: { session_id, checkout_url }
  ↓
window.location.href = checkout_url (redirect to xPay Checkout UI)
```

### Redirect Handling (User Story 3)

```
User redirected back from xPay with URL: ?success=true/false
  ↓
useRedirectStatus() hook (parses URL on mount)
  ↓
App.jsx detects redirect status
  ↓
Renders SuccessMessage OR FailureMessage
  ↓
"Continue Shopping" button → Reset to products page
```

## API Integration

### checkoutService.js

**Function**: `createCheckoutSession(product)`

**Input**:
```javascript
{
  id: string,           // Product ID
  name: string,         // Product name
  price: number         // Product price in dollars
}
```

**Output**:
```javascript
{
  session_id: string,           // Unique session identifier
  checkout_url: string          // URL to xPay Checkout UI
}
```

**Error Handling**:
- Network errors: "Unable to connect to payment service"
- Timeout (>10s): "Payment service is taking too long"
- Server errors (4xx/5xx): "Payment service encountered an error"
- Validation errors: Specific field messages

### API Endpoint Contract

**POST** `${XPAY_BACKEND_URL}/checkout/session`

**Request**:
```json
{
  "product_id": "prod_001",
  "product_name": "Premium Widget",
  "product_price": 99.99
}
```

**Success Response** (200):
```json
{
  "session_id": "session_abc123",
  "checkout_url": "https://xpay.example.com/checkout/session_abc123"
}
```

**Error Response** (400/500):
```json
{
  "message": "Invalid product price"
}
```

## Hooks Reference

### useProducts()

Loads product catalog on component mount.

**Returns**:
```javascript
{
  products: Array<Product>,    // Array of product objects
  isLoading: boolean,          // True while loading
  error: string | null         // Error message if load fails
}
```

**Usage**:
```javascript
const { products, isLoading, error } = useProducts();
```

### useCheckout()

Manages checkout session state and API communication.

**Returns**:
```javascript
{
  initiateCheckout: (product) => Promise<void>,  // Function to start checkout
  isCheckingOut: boolean,                         // True during API call
  checkoutError: string | null                   // Error message if failed
}
```

**Usage**:
```javascript
const { initiateCheckout, isCheckingOut, checkoutError } = useCheckout();
```

### useRedirectStatus()

Parses redirect parameters from URL query string.

**Returns**:
```javascript
{
  success: boolean,          // True if success=true in query
  sessionId: string | null,  // Session ID if provided
  message: string | null     // Additional message if provided
} | null                      // null if no redirect params
```

**Usage**:
```javascript
const redirectStatus = useRedirectStatus();
```

## Styling System

### CSS Organization

1. **index.css** - Global foundation
   - CSS reset (margins, padding, border-box)
   - Typography defaults (fonts, sizes, colors)
   - Button and form base styles
   - Utility classes (spacing: m-1, p-1, etc.)

2. **layout.css** - Responsive structure
   - Grid system: `.grid-2`, `.grid-3`, `.grid-4` (auto-fit responsive)
   - Flexbox utilities: `.flex`, `.flex-center`, `.flex-between`
   - Page layout: `.page-container`, `.header`, `.main-content`, `.footer`
   - Breakpoints: 768px (tablet), 480px (mobile)

3. **components.css** - Component-specific styles
   - Product cards: `.product-card`, `.product-image`, `.product-content`
   - Buttons: `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-success`
   - Messages: `.message-success`, `.message-error`, `.message-warning`, `.message-info`
   - Status pages: `.status-container`, `.status-content`, `.status-icon`, `.status-title`
   - Loading state: `.loading` with spinner animation

### Color Scheme

- **Primary**: `#667eea` (Blue - actions)
- **Success**: `#51cf66` (Green - payment success)
- **Error**: `#ff6b6b` (Red - failures)
- **Warning**: `#ffd93d` (Yellow - warnings)
- **Info**: `#4dabf7` (Light blue - information)
- **Text**: `#222` (Dark gray - primary), `#666` (Medium gray - secondary)
- **Background**: `#fff` (White), `#f8f9fa` (Light gray - containers)

## Dependencies

**Production**:
- `react@18.3.1` - UI library
- `react-dom@18.3.1` - DOM rendering

**Development**:
- `vite@5.0.8` - Build tool and dev server
- `vitest@1.0+` - Unit testing framework
- `@testing-library/react` - Component testing utilities
- `@vitejs/plugin-react` - React support for Vite
- `eslint` - Code quality (optional)

**Note**: No additional state management, UI frameworks, or HTTP clients. Uses React Hooks and native Fetch API only.

## Configuration

**Environment Variables** (see `.env.example`):
```
VITE_XPAY_BACKEND_URL=http://localhost:3001
VITE_APP_PORT=5173
```

**Build Outputs**:
- Dev: `npm run dev` → http://localhost:5173
- Build: `npm run build` → `dist/` folder
- Preview: `npm run preview` → http://localhost:4173

## Testing

**Test Structure**:
```
tests/
├── components/
│   ├── ProductCard.test.jsx        # Product display unit tests
│   ├── ProductList.test.jsx        # Product list rendering tests
│   ├── CheckoutButton.test.jsx     # Button behavior tests
│   ├── SuccessMessage.test.jsx     # Success page tests
│   └── FailureMessage.test.jsx     # Failure page tests
├── hooks/
│   ├── useRedirectStatus.test.js   # URL parsing tests
│   └── useProducts.test.js         # Product loading tests
├── services/
│   └── checkoutService.test.js     # API client tests
└── integration/
    ├── checkout-flow.test.jsx      # Checkout process tests
    └── full-flow.test.jsx          # End-to-end tests
```

**Run Tests**:
```bash
npm test                    # Run all tests
npm test -- --watch       # Watch mode
npm test -- --coverage    # Coverage report
```

**Coverage Target**: ≥80% (statements, branches, functions, lines)

## Development Workflow

### Adding a New Component

1. Create `src/components/ComponentName.jsx`
2. Import required hooks and styles
3. Export as default
4. Create `tests/components/ComponentName.test.jsx`
5. Add component to parent (e.g., App.jsx or ProductList.jsx)
6. Run tests: `npm test`

### Modifying API Endpoint

1. Update `API_ENDPOINTS` in `src/constants.js`
2. Update `checkoutService.js` to use new endpoint
3. Update `tests/services/checkoutService.test.js` with new mock
4. Update `contracts/merchant-xpay-backend.md` if contract changed

### Styling Changes

1. Identify scope: global (index.css), layout (layout.css), or component (components.css)
2. Add styles in appropriate file
3. Test responsive breakpoints: desktop, tablet (768px), mobile (480px)
4. Verify no color contrast issues (WCAG compliance)

## Troubleshooting

### Product Images Not Loading

**Symptom**: Images show as placeholder or broken

**Solution**: 
- Check image URLs in `src/data/products.json`
- Verify URLs are publicly accessible HTTPS
- ProductCard has fallback SVG placeholder

### Checkout Not Redirecting

**Symptom**: Clicking "Buy Now" shows loading then error or nothing

**Solution**:
- Check xPay Backend is running at `${VITE_XPAY_BACKEND_URL}/checkout/session`
- Verify request body matches contract: `{ product_id, product_name, product_price }`
- Check browser console for fetch errors
- Test with mock in browser DevTools Network tab

### Redirect Status Not Showing

**Symptom**: After redirect, still on product list or error message

**Solution**:
- Check URL has query parameter: `?success=true` or `?success=false`
- Verify `useRedirectStatus()` is called in App.jsx
- Check browser console for JavaScript errors
- Test manually: `http://localhost:5173/?success=true`

## Contributing

- Follow existing component patterns (functional components, React Hooks)
- Write tests for new functionality (target 80%+ coverage)
- Use consistent naming: camelCase for functions/variables, PascalCase for components
- Keep components focused with single responsibility
- Document complex logic with comments

## Related Documentation

- [Project Constitution](../../.specify/memory/constitution.md) - Architectural principles
- [Feature Specification](../001-merchant-storefront/spec.md) - Requirements and user stories
- [Technical Plan](../001-merchant-storefront/plan.md) - Technology decisions and research
- [Data Model](../001-merchant-storefront/data-model.md) - Entity definitions
- [API Contract](../001-merchant-storefront/contracts/merchant-xpay-backend.md) - API specification
- [Quick Start Guide](../001-merchant-storefront/quickstart.md) - Integration steps
