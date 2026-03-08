# Quick Start Guide: Merchant Landing Page Application

**Phase**: 1 (Design - Development Setup)  
**Date**: 2026-03-08  
**Purpose**: Enable developers to run the merchant-webapp locally and understand the project structure

## Prerequisites

- **Node.js**: 18.17 LTS or higher (download from [nodejs.org](https://nodejs.org))
- **npm**: 9+ (included with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended (or other modern editor)

**Verify installation**:
```bash
node --version    # Should be v18.17.0 or higher
npm --version     # Should be 9.0.0 or higher
git --version     # Optional but recommended
```

---

## Project Setup (First Time)

### 1. Clone or Create the Repository

```bash
# If cloning from existing repo
git clone <repository-url>
cd xPay-Checkout/merchant-webapp

# OR if starting from scratch, Vite provides a template
npm create vite@latest merchant-webapp -- --template react
cd merchant-webapp
```

### 2. Install Dependencies

```bash
npm install
```

**What gets installed**:
- `react` (18.2+) - React library
- `react-dom` (18.2+) - React DOM rendering
- `vite` (5.0+) - Build and dev server tool
- `@vitejs/plugin-react` - Vite plugin for React JSX transformation
- `@vitest/ui` - Test runner UI (optional, for testing)

**Note**: No other npm dependencies installed (per Constitution: Minimal Dependencies)

### 3. Configure Environment

Create a `.env.local` file in the project root (git-ignored):

```bash
# .env.local
VITE_XPAY_BACKEND_URL=http://localhost:3001
VITE_APP_PORT=5173
```

**Settings**:
- `VITE_XPAY_BACKEND_URL`: URL of the xPay Backend service (required for checkout integration)
- `VITE_APP_PORT`: Port for local dev server (default 5173; override if needed)

Create `.env.example` for team sharing (git-tracked):

```bash
# .env.example (commit this to git)
VITE_XPAY_BACKEND_URL=http://localhost:3001
VITE_APP_PORT=5173
```

---

## Running the Application

### Start Development Server

```bash
npm run dev
```

**Expected output**:
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Open in browser**:
- Navigate to `http://localhost:5173`
- You should see the product list with at least 3 sample products
- Each product card should have: name, price, description, image, and "Buy Now" button

### Build for Production

```bash
npm run build
```

**Output**:
- Creates `dist/` directory with optimized production bundle
- Ready for deployment to static hosting (nginx, Vercel, Netlify, etc.)

### Preview Production Build

```bash
npm run preview
```

**Opens**:
- Local server on `http://localhost:4173` to preview the production build
- Useful for testing before deployment

---

## Project Structure

```
merchant-webapp/
├── node_modules/              # npm dependencies (git-ignored)
├── public/
│   ├── index.html             # Single HTML entry point (rarely modified)
│   └── favicon.ico            # Merchant branding
├── src/
│   ├── components/
│   │   ├── ProductCard.jsx    # Displays individual product (name, price, image, button)
│   │   ├── ProductList.jsx    # Container for all products
│   │   ├── CheckoutButton.jsx # Buy Now button with xPay Backend integration
│   │   ├── ErrorMessage.jsx   # Error notification display
│   │   └── SuccessMessage.jsx # Success/failure message after redirect
│   ├── data/
│   │   └── products.json      # Static product list (EDIT THIS to change products)
│   ├── services/
│   │   └── checkoutService.js # Fetch wrapper for xPay Backend API calls
│   ├── hooks/
│   │   ├── useCheckout.js     # Custom hook for checkout flow
│   │   └── useRedirectStatus.js # Custom hook to parse redirect URL params
│   ├── styles/
│   │   ├── index.css          # Global styles
│   │   ├── components.css     # Component-specific styles
│   │   └── layout.css         # Responsive layout styles
│   ├── constants.js           # Configuration (API URL, timeouts, etc.)
│   ├── App.jsx                # Root component (main app logic)
│   ├── index.jsx              # React entry point (renders App to DOM)
│   └── main.jsx               # Vite entry point (imports index.jsx)
├── tests/
│   ├── components/
│   │   ├── ProductCard.test.jsx
│   │   ├── ProductList.test.jsx
│   │   └── CheckoutButton.test.jsx
│   ├── services/
│   │   └── checkoutService.test.js
│   └── integration/
│       └── checkout-flow.test.jsx
├── .env.local                 # Environment variables (git-ignored, create manually)
├── .env.example               # Template for .env.local (git-tracked)
├── .gitignore                 # Git ignore rules
├── package.json               # npm dependencies and scripts
├── vite.config.js             # Vite build configuration
├── vitest.config.js           # Test configuration (if using Vitest)
├── README.md                  # Technical documentation
└── index.html                 # Old CRA entry point (remove if using Vite)
```

---

## Development Workflow

### 1. Edit Product Data

Products are defined in `src/data/products.json`:

```json
{
  "products": [
    {
      "id": "prod_001",
      "name": "Product Name",
      "price": 99.99,
      "description": "Product description",
      "image_url": "https://via.placeholder.com/300x200"
    }
  ]
}
```

**To add/remove products**:
1. Edit `src/data/products.json`
2. Save file
3. Browser will hot-reload automatically (Vite HMR)

### 2. Edit Components

Example: Modify the product card layout in `src/components/ProductCard.jsx`:

```javascript
// Change UI, appearance, or logic
// Save file → Browser hot-reloads → See changes instantly
```

**Hot Module Replacement**: Changes apply without full page reload (within ~100ms)

### 3. Run Tests

```bash
npm test
```

**Test files**:
- Files ending in `.test.jsx` or `.test.js` are automatically discovered
- Jest or Vitest runs them, shows results with coverage

### 4. Debug in Browser

**Open DevTools**: Press `F12` or Right-click → Inspect

**Debugging tips**:
- React DevTools browser extension (recommended)
  - Inspect component props and state
  - Trace re-renders
- Network tab: Monitor fetch requests to xPay Backend
  - Verify request payload shape
  - Inspect response data
- Console: View logs and errors

---

## Integrating with xPay Backend

### Prerequisites

xPay Backend must be running on the configured URL:

```bash
# In another terminal, start xPay Backend
cd ../xpay-backend
go run ./...  # Should start on http://localhost:3001
```

### Testing the Integration

#### Happy Path (Successful Checkout)

1. Start merchant-webapp: `npm run dev`
2. Start xPay Backend: `go run ./...` (in separate terminal)
3. Open merchant-webapp in browser: `http://localhost:5173`
4. Click "Buy Now" on any product
5. Verify:
   - Network tab shows POST request to `http://localhost:3001/checkout/session`
   - Request body includes `product_id`, `product_name`, `product_price`
   - Response includes `session_id` and `checkout_url`
   - You're redirected to xPay Checkout URL

#### Error Path (Backend Unavailable)

1. Start merchant-webapp without xPay Backend
2. Click "Buy Now"
3. Verify: Error message displayed (e.g., "Failed to reach payment service")

---

## Running Tests

### Unit Tests (Component & Service)

```bash
npm test -- --run
```

**Tests included**:
- ProductCard rendering test (verify all fields display)
- ProductList loading test (verify products render correctly)
- CheckoutButton integration test (verify fetch call is made)
- checkoutService test (verify request/response validation)

### Integration Tests

```bash
npm test -- --run -- integration/
```

**Tests included**:
- End-to-end checkout flow (product display → API call → redirect)
- Redirect status parsing (success/failure message display)

### Test Coverage

```bash
npm test -- --coverage
```

**Coverage targets**:
- Components: 80%+ coverage
- Services: 90%+ coverage
- Hooks: 85%+ coverage

---

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_XPAY_BACKEND_URL` | Merchant app connects to xPay Backend at this URL | `http://localhost:3001` |
| `VITE_APP_PORT` | Dev server port | `5173` |
| `NODE_ENV` | Runtime environment (auto-set by Vite) | `development` or `production` |

---

## Troubleshooting

### Issue: "Cannot find module 'react'"

**Cause**: Dependencies not installed  
**Solution**: Run `npm install`

### Issue: "Port 5173 is already in use"

**Cause**: Dev server already running or port in use  
**Solution**: 
```bash
# Option 1: Kill existing process
# Option 2: Change port in command
npm run dev -- --port 5174
```

### Issue: "Failed to reach payment service" error message on "Buy Now"

**Cause**: xPay Backend not running or wrong URL  
**Solution**:
1. Check xPay Backend is running: `go run ./...` in separate terminal
2. Verify `VITE_XPAY_BACKEND_URL` in `.env.local` matches actual backend URL
3. Restart merchant-webapp: `npm run dev`

### Issue: Hot reload not working

**Cause**: Vite HMR misconfiguration  
**Solution**: 
1. Check browser DevTools for errors
2. Restart dev server: `npm run dev`
3. Clear browser cache: Ctrl+Shift+Delete (Chrome), Cmd+Shift+Delete (Safari)

### Issue: Build fails with "vite not found"

**Cause**: Vite dependency not installed  
**Solution**: `npm install` then try `npm run build` again

---

## Next Steps

1. **Understand the Code**: Read through `src/App.jsx` and `src/components/ProductCard.jsx`
2. **Make Changes**: Edit `src/data/products.json` to add your own products
3. **Test Integration**: Start xPay Backend and click "Buy Now" on a product
4. **Write Tests**: Add new tests in `tests/` directory as you modify components
5. **Deploy**: Run `npm run build` and deploy `dist/` folder to static hosting

---

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [JavaScript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

---

## Questions?

- Check `.specify/memory/constitution.md` for architectural principles
- Review `spec.md` for feature requirements
- Read `data-model.md` for data structure details
- See `contracts/merchant-xpay-backend.md` for API contract
