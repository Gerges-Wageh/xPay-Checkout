<!--
SYNC IMPACT REPORT
==================
Version: 1.0.0 (initial release)
Ratified: 2026-03-08

PRINCIPLES DEFINED (6 total):
  1. Microservice Architecture with Clear Service Boundaries (NEW)
  2. Explicit API Contracts as Primary Integration Mechanism (NEW)
  3. Minimal Dependencies and Standard Library Preference (NEW)
  4. Educational Simplicity Over Production Patterns (NEW)
  5. Client-Server Boundary and Information Flow Clarity (NEW)
  6. Verifiable Service Contracts and Runnable Isolation (NEW)

SECTIONS ADDED:
  ✅ Technology Stack & Architectural Requirements
  ✅ Development Workflow & Verification Guidelines

DEPENDENT TEMPLATES STATUS:
  ✅ .specify/templates/plan-template.md - No updates needed (Constitution Check section generic, aligns with principles)
  ✅ .specify/templates/spec-template.md - No updates needed (User story format compatible)
  ✅ .specify/templates/tasks-template.md - No updates needed (Phase and story-based organization compatible)

RUNTIME GUIDANCE:
  - No README.md or docs/ found in repo (will be created during implementation)
  - Agent-specific prompts in .github/prompts/ are generic speckit templates (no updates needed)

FOLLOW-UP:
  None - All placeholders filled, no deferred items.

SUGGESTED COMMIT MESSAGE:
  docs: create project constitution v1.0.0 - xPay checkout microservice architecture

END REPORT
-->

# xPay Checkout Constitution

## Core Principles

### I. Microservice Architecture with Clear Service Boundaries
Each of the four services (Merchant Application, xPay Hosted Checkout, xPay Backend, Payment Provider)
MUST be independently deployable, independently runnable, and testable in isolation. Services
communicate ONLY through well-defined REST API contracts. No service MUST directly import or call
code from another service. Each service has its own codebase, dependencies, and state management.

### II. Explicit API Contracts as Primary Integration Mechanism
All inter-service communication MUST use REST APIs with documented request/response schemas.
API contracts MUST be defined in `contracts/` directories before implementation. Any change to
an API contract MUST be documented and coordinated across dependent services. JSON is the
only supported data format. Clients MUST validate HTTP status codes and JSON structure.

### III. Minimal Dependencies and Standard Library Preference
For Go services: MUST use Go standard library for core functionality (HTTP, JSON, logging).
External dependencies MUST be justified and minimized. For React frontends: external dependencies
MUST be explicitly restricted to essentials only (no CSS frameworks, no state managers, use Fetch API).
This constraint ensures clarity, maintainability, and demonstrates core concepts without
framework-specific abstractions.

### IV. Educational Simplicity Over Production Patterns
This project is for learning payment gateway architecture, not production deployment. Therefore:
In-memory state storage is acceptable (no database required). OTP codes MAY be logged to console
instead of sent via SMS. Payment success/failure outcomes MAY be simulated. Security MUST NOT
implement production-grade requirements (no PCI compliance, no tokenization, no encryption).
Focus MUST remain on the end-to-end checkout flow and service interactions.

### V. Client-Server Boundary and Information Flow Clarity
Frontends (Merchant Application and xPay Checkout UI) MUST NEVER communicate directly with the
Payment Provider service. All information flows MUST route through xPay Backend. This separation
prevents clients from handling sensitive payment details and maintains clear responsibility
boundaries. The Payment Provider service MUST only accept requests from xPay Backend.

### VI. Verifiable Service Contracts and Runnable Isolation
Every API endpoint MUST be verifiable without running other services. Contract tests MUST exist
for all inter-service communication. Each service MUST be independently runnable with minimal
setup (for Go: `go run`, for React: `npm start`). No centralized configuration files or
environment variables MUST block a single service from running standalone.

## Technology Stack & Architectural Requirements

**Frontend Services** (React):
- MUST use React 18+ with no additional UI frameworks.
- MUST use Fetch API only for HTTP requests (no axios, no jQuery).
- MUST use plain CSS or inline styles (no CSS-in-JS libraries, no Tailwind).
- Build tooling: Vite or Create React App supported.
- Each React application (Merchant, Checkout UI) MUST be a separate repository or workspace.

**Backend Services** (Go):
- MUST target Go 1.21 or later.
- MUST use `net/http` standard library for REST APIs.
- MUST use `encoding/json` for JSON serialization.
- No ORM, no database driver required (in-memory storage sufficient).
- State MUST be stored in memory or simple file-based structures.
- MUST expose APIs on `localhost` with documented port numbers.

**Service Topology** (required structure):
```
merchant-webapp/          # React
xpay-checkout/           # React
xpay-backend/            # Go
payment-provider/        # Go
```

**Data Flows** (permitted):
1. Merchant → xPay Backend (via HTTP redirects and REST APIs)
2. xPay Checkout → xPay Backend (REST APIs)
3. xPay Backend → Payment Provider (REST APIs)
4. Payment Provider → xPay Backend (REST API responses)
NOT permitted:
- Frontends → Payment Provider (direct)
- Payment Provider → Frontends (direct)
- Cross-frontend communication

## Development Workflow & Verification Guidelines

**Specification-Driven Development**:
All features MUST start with a spec.md defining user stories and acceptance criteria.
API contracts MUST be documented in contracts/ before implementation begins. Tasks MUST
be generated from specs and tracked in tasks.md. This ensures AI agents generate coherent
tasks aligned with architectural principles and user goals.

**API Contract Verification**:
Contract tests MUST verify that each service's API responses match the documented schema.
Contracts MUST live in `contracts/[service-name].md` with request/response examples.
Any API change MUST update the contract first, then implementation, then dependent services.

**Integration Verification**:
Before marking a user story complete, the end-to-end flow MUST be tested locally:
- Merchant landing page → xPay Checkout redirect → OTP entry → Payment success/failure →
  Redirect back to merchant. This end-to-end test MUST be documented per feature.

**Independent Service Testing**:
Each service MUST be testable without other services running. Unit tests for business logic
are preferred. Integration tests MUST focus on API boundaries and state transitions.
Mock or stub external services in tests.

**Local Runability**:
A new developer MUST be able to run all four services locally with:
- React: `npm install && npm start`
- Go: `go run ./...` or `go build && ./binary`
No Docker, no external services MUST be required to begin local development.

## Governance

This Constitution is the authoritative source for architectural decisions in the xPay Checkout project.
All generated specifications, plans, and tasks MUST comply with these principles and requirements.

**Amendment Process**:
Changes to this Constitution MUST justify the modification (e.g., lessons learned, architectural
issue discovered, principle violation resolved). Version numbers MUST follow MAJOR.MINOR.PATCH:
- PATCH: Clarifications, typo fixes, non-semantic refinements.
- MINOR: New principle added or existing principle clarified with new constraints.
- MAJOR: Principle removal or fundamental redefinition of architecture.

**Compliance Verification**:
AI agents generating specs, plans, and tasks MUST cross-check against this Constitution.
Violations MUST be explicitly justified or escalated for amendment.

**Version**: 1.0.0 | **Ratified**: 2026-03-08 | **Last Amended**: 2026-03-08
