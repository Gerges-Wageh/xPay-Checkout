# Implementation Plan: Merchant Landing Page Application

**Branch**: `001-merchant-storefront` | **Date**: 2026-03-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-merchant-storefront/spec.md`

## Summary

Build a standalone React 18+ web application that serves as a merchant storefront in the xPay Checkout ecosystem. The application displays a curated list of products with full details (name, price, description, image) and enables users to initiate checkout by clicking "Buy Now". When a user purchases, the app calls the xPay Backend API to create a checkout session and redirects to the hosted checkout page. After payment processing, users are redirected back to the merchant app with success or failure status. The app uses React hooks only, Fetch API for HTTP requests, and plain CSS for styling — no external UI frameworks or state management libraries.

## Technical Context

**Language/Version**: JavaScript (ES2020+), React 18.2+ (target latest stable)  
**Build Tooling**: Vite 5.0+ or Create React App 5.0+ (prefer Vite for minimal setup)  
**Primary Dependencies**: React 18+, React DOM 18+ (no other npm packages permitted except build tooling)  
**HTTP Client**: Fetch API (native browser API, no axios or external HTTP libraries)  
**Styling**: Plain CSS (separate files or inline styles, no CSS-in-JS, no Tailwind/Material-UI/Bootstrap)  
**State Management**: React Hooks only (useState, useEffect, useContext if needed; no Redux, Zustand, Recoil)  
**Storage**: In-memory product data (static JSON or hardcoded array; no localStorage, no database)  
**Testing**: Jest (built-in with Create React App) or Vitest (built-in with Vite) for unit/integration tests  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge latest 2 versions; no IE11 support)  
**Project Type**: Single-page application (SPA) web frontend  
**Performance Goals**: First Paint <1s, Interactive <2s on 4G/desktop; Product list loads instantly (local data)  
**Constraints**: Application MUST run independently without other xPay services; API timeout 5-10 seconds  
**Scale/Scope**: 3-5 sample products; responsive UI for desktop/tablet; mobile support optional (Phase 2)  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Microservice Architecture ✅
- Single React service with clear boundaries
- Only communicates with xPay Backend via REST API (no direct Payment Provider access)
- Independently runnable via `npm install && npm start`
- **Status**: PASS

### Explicit API Contracts ✅
- All calls to xPay Backend will use documented REST endpoints
- Request/response schemas defined in `contracts/merchant-xpay-backend.md`
- JSON only; HTTP status codes validated
- **Status**: PASS (will document in Phase 1)

### Minimal Dependencies & Standard Library Preference ✅
- Only React 18+, React DOM 18+ permitted
- Fetch API (native browser) for HTTP, no external HTTP library
- No UI framework dependencies (Tailwind, Material-UI, etc. prohibited)
- No state management library (Redux, Zustand, etc. prohibited)
- **Status**: PASS

### Educational Simplicity ✅
- Static product data (in-memory, no database)
- Simple Fetch + redirect flow for checkout
- No authentication, no cart, no advanced features
- Focus on understanding merchant-to-gateway integration
- **Status**: PASS

### Client-Server Boundary Clarity ✅
- Frontend ONLY talks to xPay Backend
- No direct calls to Payment Provider service
- Clear one-way dependency: Merchant → xPay Backend only
- **Status**: PASS

### Verifiable Service Contracts ✅
- API calls to xPay Backend testable without backend running (mock/stub responses)
- Each user story independently testable
- Contract tests will verify request/response shapes
- **Status**: PASS (contract file will be created in Phase 1)

**GATE RESULT: PASS** ✅ All principles satisfied. No violations. No complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-merchant-storefront/
├── plan.md                    # This file
├── research.md                # Phase 0 findings (to be created)
├── data-model.md              # Phase 1 data structures (to be created)
├── quickstart.md              # Phase 1 dev setup (to be created)
├── contracts/                 # Phase 1 API contracts (to be created)
│   └── merchant-xpay-backend.md
├── checklists/
│   └── requirements.md        # Quality checklist
└── spec.md                    # Original feature specification
```

### Source Code (repository root)

```text
merchant-webapp/
├── public/
│   ├── index.html            # Single HTML entry point
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ProductCard.jsx   # Reusable product card component
│   │   ├── ProductList.jsx   # Product list container
│   │   ├── CheckoutButton.jsx # Buy Now button with API integration
│   │   ├── ErrorMessage.jsx  # Error notification component
│   │   └── SuccessMessage.jsx # Success/failure redirect result
│   ├── data/
│   │   └── products.json     # Static product data
│   ├── services/
│   │   └── checkoutService.js # Fetch wrapper for xPay Backend API calls
│   ├── styles/
│   │   ├── index.css         # Global styles
│   │   ├── components.css    # Component-scoped styles
│   │   └── layout.css        # Layout and responsive design
│   ├── hooks/
│   │   ├── useCheckout.js    # Custom hook for checkout logic
│   │   └── useRedirectStatus.js # Custom hook for redirect status handling
│   ├── App.jsx               # Root component with routing logic
│   ├── index.jsx             # React entry point
│   └── constants.js          # Configuration (API base URL, timeouts)
├── tests/
│   ├── components/
│   │   ├── ProductCard.test.jsx
│   │   ├── ProductList.test.jsx
│   │   └── CheckoutButton.test.jsx
│   ├── services/
│   │   └── checkoutService.test.js
│   └── integration/
│       └── checkout-flow.test.jsx
├── package.json              # Dependencies, scripts
├── vite.config.js (or react-scripts) # Build config
├── .env.example              # Config template
├── README.md                 # Local dev instructions
└── .gitignore
```

**Structure Decision**: 
Single React application using the above layout. Components are broken into product display and checkout flow domains. Services handle API communication via Fetch. Hooks encapsulate stateful logic for product display and checkout status. Styles are organized by scope (global, component, layout). This structure supports independent testing of each user story:
- **US1** (Browse Products): ProductList + ProductCard components testable alone
- **US2** (Initiate Checkout): CheckoutButton + checkoutService testable with mocked xPay API
- **US3** (Handle Redirect): SuccessMessage + useRedirectStatus testable with mocked URL parameters

## Complexity Tracking

No violations detected. Constitution fully satisfied. No exceptions or complexity justifications required.

---

## Next Steps

**Phase 0 (Research)**: Identify any missing technical decisions  
**Phase 1 (Design)**: Generate research.md, data-model.md, quickstart.md, and API contracts  
**Phase 2 (Implementation)**: Run `/speckit.tasks` to generate implementation task list
