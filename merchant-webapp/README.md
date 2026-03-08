# xPay Merchant Storefront Application

A React-based merchant landing page for the xPay payment processing ecosystem. Enables merchants to display products and initiate secure checkout through the xPay Backend API.

## Quick Start

### Prerequisites

- Node.js 18.17.0 or higher
- npm 9.0.0 or higher

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create local environment configuration
cp .env.example .env.local

# 3. Edit .env.local to point to your xPay Backend instance (optional)
# VITE_XPAY_BACKEND_URL=http://localhost:3001
```

### Running Locally

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

After running `npm run dev`, open **http://localhost:5173** in your browser.

## Features

### User Story 1: Browse Products
- View curated product catalog
- See product details: name, price, description, image
- Responsive design for desktop, tablet, mobile

### User Story 2: Initiate Checkout  
- Click "Buy Now" on any product
- Create checkout session with xPay Backend
- Redirect to hosted checkout UI
- Error handling with user-friendly messages

### User Story 3: Handle Redirect
- Process redirect from xPay with payment status
- Display success or failure confirmation message
- Return to product list for another purchase

## Project Structure

```
merchant-webapp/
├── src/
│   ├── components/           # React components (ProductCard, ProductList, etc.)
│   ├── hooks/               # Custom hooks (useProducts, useCheckout, useRedirectStatus)
│   ├── services/            # API services (checkoutService)
│   ├── styles/              # CSS files (global, layout, components)
│   ├── data/                # Static JSON data (products.json)
│   ├── constants.js         # Configuration and constants
│   ├── App.jsx              # Root component
│   ├── index.jsx            # React entry point
│   └── README.md            # Detailed development documentation
├── tests/                   # Test files (unit, integration, e2e)
├── public/                  # Static assets
│   └── index.html           # HTML entry point
├── package.json             # Dependencies and scripts
├── vite.config.js           # Build configuration
├── .env.example             # Environment template
└── README.md                # This file
```

## Configuration

### Environment Variables

Create `.env.local` to override defaults:

```
# xPay Backend URL (default: http://localhost:3001)
VITE_XPAY_BACKEND_URL=http://localhost:3001

# Application port (default: 5173)
VITE_APP_PORT=5173
```

### Build Configuration

See `vite.config.js` for:
- React plugin setup
- Dev server configuration
- Build output settings
- Preview server settings

## API Integration

### xPay Backend API

**Endpoint**: `POST /checkout/session`

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

**Error Response** (4xx/5xx):
```json
{
  "message": "Error description"
}
```

For full API specification, see [`contracts/merchant-xpay-backend.md`](../specs/001-merchant-storefront/contracts/merchant-xpay-backend.md)

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

### Test Coverage

Target: ≥80% overall coverage

- **Unit Tests**: Components and hooks tested individually
- **Service Tests**: API client error handling and validation
- **Integration Tests**: End-to-end checkout flow simulation

Test files:
- `tests/components/*.test.jsx` - Component rendering and behavior
- `tests/hooks/*.test.js` - Custom hook logic
- `tests/services/*.test.js` - API service functions
- `tests/integration/*.test.jsx` - Full feature flows

## Development

### Scripts

```bash
# Development
npm run dev              # Start dev server with HMR
npm run build            # Production build
npm run preview          # Preview production build
npm test                 # Run tests
npm run lint             # Run ESLint (if configured)

# Testing
npm test -- --watch     # Watch mode
npm test -- --coverage  # Coverage report
npm run test:ui         # Vitest UI dashboard (if installed)
```

### Code Organization

**React Hooks Pattern Only**:
- No Redux or other state libraries
- Use `useState` for component state
- Use `useEffect` for side effects
- Create custom hooks for reusable logic

**Component Structure**:
- Functional components only
- Props-based customization
- Default props for optional features
- Clear prop documentation in JSDoc comments

**Styling Approach**:
- Plain CSS only (no CSS-in-JS, Tailwind, or Material-UI)
- Three-tier CSS organization:
  1. Global: `index.css` (reset, typography, utilities)
  2. Layout: `layout.css` (grid, flexbox, page structure)
  3. Components: `components.css` (specific component styles)
- Responsive design: desktop-first with mobile breakpoints

**API Integration**:
- Fetch API only (no axios or other HTTP clients)
- Service layer (`checkoutService.js`) for API abstraction
- Error handling with user-friendly messages
- Request timeout: 10 seconds

### Adding Features

**New Component**:
1. Create file in `src/components/ComponentName.jsx`
2. Implement as functional component
3. Add tests in `tests/components/ComponentName.test.jsx`
4. Update parent component to import and render

**New Hook**:
1. Create file in `src/hooks/useHookName.js`
2. Implement custom React hook
3. Add tests in `tests/hooks/useHookName.test.js`
4. Use in components via import

**New API Endpoint**:
1. Add to `API_ENDPOINTS` in `src/constants.js` (if using constants)
2. Create service function in `src/services/...Service.js`
3. Add error handling and validation
4. Write contract tests to verify request/response format

## Deployment

### Production Build

```bash
npm run build
```

outputs to `dist/` folder:
- Minified JavaScript
- Optimized CSS
- Static assets

### Deploy to Hosting

The `dist/` folder contains a static SPA. Deploy to:
- Vercel, Netlify, GitHub Pages (auto-git deployment)
- AWS S3 + CloudFront
- Docker/Kubernetes (as part of microservice)
- Any static site hosting

### Environment-Specific Configuration

Before deployment, ensure `.env` has correct values:
- Development: `http://localhost:3001` (local xPay Backend)
- Staging: `https://xpay-backend-staging.example.com`
- Production: `https://xpay-backend.example.com`

## Troubleshooting

### Port Already in Use

```bash
# Vite dev server defaults to 5173
# Kill process on that port or specify different port:
npm run dev -- --port 3000
```

### Module Resolution Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Tests Failing

```bash
# Ensure all dependencies installed
npm install

# Run tests with verbose output
npm test -- --reporter=verbose
```

### Checkout Not Working

1. Verify xPay Backend is running: `curl http://localhost:3001/health`
2. Check `VITE_XPAY_BACKEND_URL` in `.env.local`
3. Inspect browser console (F12) for errors
4. Test API directly in browser DevTools or Postman

### Build Size Issues

```bash
# Analyze bundle size
npm run build -- --analyze
```

The app minimizes dependencies to keep bundle small:
- React + ReactDOM: ~40KB gzip
- App code: ~20KB gzip
- Total: ~60KB for full feature

## Architecture Principles

### Microservice Design
- Single Responsibility: Merchant app only handles product display and checkout UI
- Service Communication: Only calls xPay Backend API
- Independence: Works without Payment Provider or xPay UI services

### Simplicity First
- No complex state management
- No framework overhead
- Plain CSS organization
- Minimal dependencies

### Testing Philosophy
- Unit tests for components and hooks
- Integration tests for feature flows
- Contract tests to verify API compatibility
- Target coverage: 80%+

### Performance
- Vite for fast development experience
- Lazy image loading with native `loading="lazy"`
- Responsive CSS grid prevents layout thrashing
- Fetch API with 10s timeout prevents hangs

## Related Documentation

- [Feature Specification](../specs/001-merchant-storefront/spec.md) - User stories and requirements
- [Technical Plan](../specs/001-merchant-storefront/plan.md) - Architecture and tech decisions
- [API Contract](../specs/001-merchant-storefront/contracts/merchant-xpay-backend.md) - Endpoint specification
- [Source Code Documentation](./src/README.md) - Component and hook reference
- [Project Constitution](../../.specify/memory/constitution.md) - Microservice principles

## Support

### Common Issues

**Q: Where are the products coming from?**
A: Static `src/data/products.json` file. Merchants update this file with their own products.

**Q: Can I customize the styling?**
A: Yes! Modify CSS files in `src/styles/`. All styles use plain CSS (no frameworks).

**Q: How do I add more products?**
A: Edit `src/data/products.json` with new product objects. ProductList component automatically renders them.

**Q: What if xPay Backend is down?**
A: Error message is shown, button remains clickable for retry. App doesn't break.

### Getting Help

- Check browser console (F12) for JavaScript errors
- Run tests: `npm test` to verify application state
- Review component tests to understand expected behavior
- See source documentation: `src/README.md`

## Contributing

When contributing:
1. Follow existing code style (React Hooks, plain CSS, Fetch API)
2. Write tests for new features (target 80%+ coverage)
3. Update documentation as needed
4. Test on multiple devices (desktop, tablet, mobile)
5. Verify with xPay Backend running locally

## Version

- **App Version**: 1.0.0
- **React**: 18.3.1
- **Vite**: 5.0.8
- **Node.js**: 18.17.0+
- **npm**: 9.0.0+

## License

xPay Merchant Storefront - Educational demonstration of microservice checkout architecture
