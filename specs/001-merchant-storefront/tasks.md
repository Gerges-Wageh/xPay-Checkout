---
description: "Task list for Merchant Landing Page implementation"
---

# Tasks: Merchant Landing Page Application

**Input**: Design documents from `/specs/001-merchant-storefront/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Format**: `- [ ] [ID] [P?] [Story?] Description` where:
- **[P]**: Can run in parallel (independent files, no dependencies)
- **[Story]**: User story label (US1, US2, US3)
- Include exact file paths for each task

---

## Dependency Graph & Execution Order

### Critical Path (Sequential):
```
T001 → T002 → T003 → T004 → T005/T006/T007 (parallel) 
→ T008 → T009/T010/T011 (parallel) 
→ T012 → T013/T014/T015 (parallel, US1 complete) 
→ T016/T017/T018 (parallel, US2 complete) 
→ T019/T020 (parallel, US3 complete)
→ T021/T022/T023 (parallel, Polish)
```

### Parallel Opportunities:
- **After T004**: Style setup, constants, data loading can proceed in parallel (T005-T007)
- **Within US1**: After ProductList component, ProductCard and utility functions parallel (T009-T011)
- **Within US2**: CheckoutButton, service, hooks can proceed in parallel (T016-T018)
- **Within US3**: SuccessMessage component and redirect hook can proceed in parallel (T019-T020)
- **Polish Phase**: Testing, documentation, example data independent (T021-T023)

### Independent Test Criteria Per User Story:

**US1 (Browse Products)**:
- ProductList component renders without errors
- All 3+ sample products display with name, price, description, image
- CSS styled cleanly; responsive layout works on desktop/tablet
- ✓ Testable without other services

**US2 (Initiate Checkout)**:
- Click "Buy Now" on any product
- Network request to xPay Backend succeeds (mocked in tests)
- User redirected to checkout URL
- Error handling works if API fails
- ✓ Testable without xPay Backend (mocked fetch)

**US3 (Handle Redirect)**:
- Redirect back with `?success=true` shows success message
- Redirect back with `?success=false` shows failure message
- "Continue Shopping" button returns to product list
- ✓ Testable with mocked URL parameters

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize project structure, dev environment, and base configuration

- [x] T001 Create merchant-webapp directory structure and git repository
- [x] T002 Initialize package.json with React 18+, Vite, dependencies (src/package.json)
- [x] T003 Create vite.config.js for React, ESM modules (merchant-webapp/vite.config.js)
- [x] T004 [P] Create .env.example with xPay Backend URL config (merchant-webapp/.env.example)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Create src/constants.js with API base URL and timeout constants
- [x] T006 [P] Create src/styles/index.css with global styles, color scheme, reset
- [x] T007 [P] Create src/styles/layout.css with responsive grid layout, flex utilities
- [x] T008 Create src/data/products.json with 5 sample products (Product entity structure)
- [x] T009 [P] Create src/main.jsx as Vite entry point, imports React/ReactDOM
- [x] T010 [P] Create src/index.jsx with ReactDOM.createRoot() call (merchant-webapp/src/index.jsx)
- [x] T011 [P] Create src/App.jsx root component with page routing logic (useState for currentPage)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel ✅

---

## Phase 3: User Story 1 - Browse and View Products (Priority: P1) 🎯 MVP

**Goal**: Users can land on merchant app and see a curated list of products with complete information

**Independent Test**: Load application → ProductList displays all products with names, prices, descriptions, images → Each card is styled cleanly and readable

### Implementation for User Story 1

- [x] T012 [P] [US1] Create src/styles/components.css with ProductCard, ProductList styles
- [x] T013 [P] [US1] Create src/components/ProductCard.jsx displaying single product (name, price, description, image, Buy Now button)
- [x] T014 [P] [US1] Create src/components/ProductList.jsx mapping products from static JSON file and rendering ProductCard array
- [x] T015 [P] [US1] Create src/hooks/useProducts.js custom hook: loads from src/data/products.json on mount, returns { products, isLoading, error }
- [x] T016 [US1] Integrate ProductList into App.jsx to display on page load (src/App.jsx page routing for 'products' view)
- [x] T017 [US1] Create unit test for ProductCard.jsx: verify name, price, description, image, button render correctly (src/tests/components/ProductCard.test.jsx)
- [x] T018 [US1] Create unit test for ProductList.jsx: verify it renders array of products without errors (src/tests/components/ProductList.test.jsx)

**Acceptance Criteria for US1**:
- ✅ Page loads without console errors
- ✅ ProductList displays all 5 sample products from products.json
- ✅ Each ProductCard shows: product name, price (formatted), description, image (or placeholder if URL broken)
- ✅ "Buy Now" button visible on each card; not clickable yet (placeholder handler)
- ✅ CSS styling is clean, readable, responsive (desktop/tablet); no UI framework libraries used
- ✅ ProductCard and ProductList tests pass with 80%+ coverage

**Checkpoint**: At this point, User Story 1 is fully functional and independently testable ✅

---

## Phase 4: User Story 2 - Initiate Checkout via xPay Backend (Priority: P1)

**Goal**: Clicking "Buy Now" creates a checkout session by calling xPay Backend API and redirects user to hosted checkout

**Independent Test**: On any product, click Buy Now → Network request sent to xPay Backend with correct payload → User redirected to xPay Checkout URL (or error shown if failed)

### Implementation for User Story 2

- [x] T019 [P] [US2] Create src/services/checkoutService.js: `createCheckoutSession(product)` function using Fetch API
  - POST to `${XPAY_BACKEND_URL}/checkout/session`
  - Request body: `{ product_id, product_name, product_price }`
  - Response: `{ session_id, checkout_url }`
  - Error handling: timeout 10s, user-friendly error messages
- [x] T020 [P] [US2] Create src/hooks/useCheckout.js custom hook: manages checkout state ({ isLoading, error }) and provides initiateCheckout(product) function
- [x] T021 [P] [US2] Create src/components/ErrorMessage.jsx component displaying error message with retry capability
- [x] T022 [US2] Modify src/components/CheckoutButton.jsx (split from ProductCard if needed) with onClick handler calling useCheckout.initiateCheckout()
  - Disable button during request (loading state)
  - Handle redirect on success: `window.location.href = checkout_url`
  - Display error message on failure
- [x] T023 [US2] Create contract test for checkoutService.js: verify POST request shape, response parsing, error handling (src/tests/services/checkoutService.test.js)
- [x] T024 [US2] Create unit test for CheckoutButton.jsx: verify click triggers fetch, shows loading, handles success redirect (src/tests/components/CheckoutButton.test.jsx)
- [x] T025 [US2] Create integration test for checkout flow: ProductList → ProductCard → CheckoutButton → API call → redirect (src/tests/integration/checkout-flow.test.jsx)

**Acceptance Criteria for US2**:
- ✅ Click "Buy Now" on any product triggers API call to xPay Backend within 5 seconds
- ✅ Request JSON matches contract: `{ product_id, product_name, product_price }`
- ✅ Success response (200): User redirected to `response.checkout_url`
- ✅ Button shows loading spinner/state during request; cannot be clicked multiple times
- ✅ Timeout or error response (4xx/5xx): Error message displayed; button remains clickable for retry
- ✅ Error messages are user-friendly (not stack traces): "Payment service error" vs "TypeError: undefined is not an object"
- ✅ checkoutService and CheckoutButton tests pass with 85%+ coverage

**Checkpoint**: At this point, User Story 2 is fully functional and independently testable ✅

---

## Phase 5: User Story 3 - Handle Redirect Back from xPay Checkout (Priority: P2)

**Goal**: After xPay payment processing, user is redirected back to merchant app with success/failure status

**Independent Test**: Simulate redirect with `?success=true` or `?success=false` → App displays appropriate message → "Continue Shopping" returns to product list

### Implementation for User Story 3

- [x] T026 [P] [US3] Create src/hooks/useRedirectStatus.js custom hook: on mount, parse URL params for `success` query parameter, return { success, message }
- [x] T027 [P] [US3] Create src/components/SuccessMessage.jsx component displaying success message ("Payment successful. Thank you!")
- [x] T028 [P] [US3] Create src/components/FailureMessage.jsx component displaying failure message ("Payment failed. Please try again.") with "Continue Shopping" button
- [x] T029 [US3] Create src/styles/components.css additions for SuccessMessage, FailureMessage styling (clean, prominent)
- [x] T030 [US3] Modify src/App.jsx to detect redirect status via useRedirectStatus and show SuccessMessage or FailureMessage component
- [x] T031 [US3] Modify SuccessMessage.jsx and FailureMessage.jsx to include "Continue Shopping" button that calls navigate back to products list
- [x] T032 [US3] Create unit test for useRedirectStatus.js: verify it parses `?success=true/false` from URL (src/tests/hooks/useRedirectStatus.test.js)
- [x] T033 [US3] Create unit test for SuccessMessage.jsx: verify message text and button render (src/tests/components/SuccessMessage.test.jsx)
- [x] T034 [US3] Create unit test for FailureMessage.jsx: verify error message and button render (src/tests/components/FailureMessage.test.jsx)

**Acceptance Criteria for US3**:
- ✅ Navigate to `http://localhost:5173/?success=true` → Success message displays
- ✅ Navigate to `http://localhost:5173/?success=false` → Failure message displays
- ✅ Unknown/missing `success` param → Generic message or product list
- ✅ "Continue Shopping" button returns user to product list (clear currentPage state)
- ✅ Styling distinct from product list (different color, larger text)
- ✅ Tests for all redirect components pass with 80%+ coverage

**Checkpoint**: At this point, User Story 3 is fully functional and independently testable ✅

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, documentation, and quality improvements

### Testing & Quality

- [x] T035 [P] Create comprehensive end-to-end test suite simulating full checkout flow (load products → click Buy → mock redirect → show success) (src/tests/integration/full-flow.test.jsx)
- [x] T036 [P] Generate test coverage report: target 80%+ overall coverage (npm run test:coverage)
- [x] T037 [P] Run linting & code quality checks (npm run lint or ESLint config)

### Documentation & Examples

- [x] T038 [P] Create src/README.md explaining component structure and data flow
- [x] T039 [P] Create merchant-webapp/README.md with setup instructions (copy from quickstart.md, tailored)
- [x] T040 [P] Create merchant-webapp/.gitignore with node_modules, dist, .env.local, build artifacts

### Build & Deployment

- [x] T041 [P] Test production build: npm run build → verify dist/ folder is created, no errors
- [x] T042 [P] Test production preview: npm run preview → verify app runs from production bundle
- [x] T043 [P] Verify application works independently of other xPay services (without xPay Backend running)

### Acceptance Criteria for Phase 6 (Polish)

- ✅ All 3 user stories (US1, US2, US3) independently testable without other xPay services
- ✅ Test coverage ≥ 80% overall (components, services, hooks)
- ✅ No console errors or warnings on page load
- ✅ Application runs with `npm install && npm start` on fresh machine
- ✅ Production build works: `npm run build && npm run preview`
- ✅ Documentation complete and up-to-date
- ✅ Code style consistent (no linting errors)

**Checkpoint**: Feature complete and production-ready ✅

---

## Task Summary

| Phase | Tasks | Purpose |
|-------|-------|---------|
| 1. Setup | T001-T004 | Project initialization |
| 2. Foundational | T005-T011 | Base infrastructure (blocking) |
| 3. US1 - Browse Products | T012-T018 | MVP product display (7 tasks) |
| 4. US2 - Initiate Checkout | T019-T025 | Checkout API integration (7 tasks) |
| 5. US3 - Handle Redirect | T026-T034 | Redirect status handling (9 tasks) |
| 6. Polish & QA | T035-T043 | Testing, docs, deployment (9 tasks) |
| **TOTAL** | **43 tasks** | **Complete feature** |

---

## Task Count by Component

| Component | Tasks | Status |
|-----------|-------|--------|
| ProductList + ProductCard | 8 | US1 complete |
| CheckoutButton + Service + Hook | 9 | US2 complete |
| SuccessMessage + FailureMessage | 10 | US3 complete |
| Testing & Documentation | 10 | Polish complete |
| Setup & Infrastructure | 6 | Foundation complete |

---

## Parallel Execution Example (Estimated: 3-4 weeks with 1 developer)

**Week 1: Weeks 1-2 (Setup + Foundational)**
```
Day 1-2:   T001-T004 (Setup, 4 tasks) → 1 day
Day 2-3:   T005-T011 (Foundational parallel, 7 tasks) → 1 day
           (App scaffolding ready for component work)
```

**Weeks 2-3 (User Stories in Parallel)**
```
Day 4-5:   T012-T018 (US1 parallel) 
Day 6-7:   T019-T025 (US2 parallel, can overlap with US1) 
           → After T008 (products.json), US1 and US2 can run in parallel
           → After T011 (App.jsx routing), US3 can begin
Day 8-9:   T026-T034 (US3 parallel)
```

**Week 4 (Polish)**
```
Day 10-12: T035-T043 (Testing, docs, build)
           → All parallel; no blockers
```

**Total Estimated Effort**: 
- Individual component work: ~40 task hours
- Testing & integration: ~15 task hours
- Documentation: ~5 task hours
- **Total: ~60 task hours (~2-3 weeks at full time, one developer)**

---

## Implementation Strategy: MVP First, Incremental Delivery

### MVP Scope (Weeks 1-3: US1 + US2)
- ✅ Product display (US1)
- ✅ Checkout initiation (US2)
- ❌ Redirect handling (US3) — defer to Phase 2

**MVP Deliverable**: Users can browse products and click "Buy Now" to be redirected to xPay Checkout

### Post-MVP (Week 4: US3 + Polish)
- Complete redirect handling (US3)
- Full testing suite
- Production build

**When MVP is ready**: Can deploy and test with xPay Backend immediately (before US3)

---

## File Paths Reference

Quick reference for all files created by these tasks:

```
merchant-webapp/
├── src/
│   ├── components/
│   │   ├── ProductCard.jsx ........................ T013
│   │   ├── ProductList.jsx ........................ T014
│   │   ├── CheckoutButton.jsx ..................... T022
│   │   ├── ErrorMessage.jsx ....................... T021
│   │   ├── SuccessMessage.jsx ..................... T027
│   │   ├── FailureMessage.jsx ..................... T028
│   │   └── [tests/components/*.test.jsx] ......... T017, T018, T024, T033, T034
│   ├── hooks/
│   │   ├── useProducts.js ......................... T015
│   │   ├── useCheckout.js ......................... T020
│   │   ├── useRedirectStatus.js ................... T026
│   │   └── [tests/hooks/*.test.js] ............... T032
│   ├── services/
│   │   ├── checkoutService.js ..................... T019
│   │   └── [tests/services/*.test.js] ............ T023
│   ├── data/
│   │   └── products.json .......................... T008
│   ├── styles/
│   │   ├── index.css ............................. T006
│   │   ├── layout.css ............................ T007
│   │   └── components.css ......................... T012, T029
│   ├── constants.js .............................. T005
│   ├── main.jsx .................................. T009
│   ├── index.jsx .................................. T010
│   └── App.jsx ................................... T011, T016, T030
├── tests/
│   ├── integration/
│   │   ├── checkout-flow.test.jsx ................ T025
│   │   └── full-flow.test.jsx .................... T035
│   ├── components/ ................................. T017, T018, T024, T033, T034
│   ├── services/ .................................. T023
│   └── hooks/ .................................... T032
├── public/
│   └── index.html ................................. (template)
├── package.json ................................... T002
├── vite.config.js ................................. T003
├── .env.example ................................... T004
├── .gitignore .................................... T040
├── README.md ..................................... T039
└── src/README.md ................................. T038
```

---

## Success Definition

✅ **Feature is complete when**:

1. All 43 tasks marked complete ☑️
2. All 3 user stories (US1, US2, US3) independently testable
3. Test coverage ≥ 80%
4. No console errors/warnings on page load
5. Application runs independently: `npm install && npm start` (without xPay Backend)
6. Production build successful: `npm run build && npm run preview`
7. Code matches Constitutional requirements:
   - ✅ React Hooks only (no Redux/Zustand)
   - ✅ Fetch API only (no axios)
   - ✅ Plain CSS only (no Tailwind/Material-UI)
   - ✅ Communicates only with xPay Backend (not Payment Provider)
8. Documentation complete and accurate
