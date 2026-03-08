# xPay Checkout

**xPay Checkout** is an educational **Spec-Driven Development** project
that demonstrates how a modern **payment gateway checkout flow** can be
designed using **microservices**, **explicit API contracts**, and
**agentic AI development workflows**.

The project is built using the **Spec-Kit methodology** with **Gemini
CLI**, where system specifications drive architecture, implementation
tasks, and service contracts.

The goal of this project is to help developers understand the
**end-to-end flow of an online payment system** while maintaining clear
service boundaries and contract-driven integration.

------------------------------------------------------------------------

# Architecture Overview

The system simulates a simplified payment gateway ecosystem composed of
**four independent services**.

    Merchant Web App (React)
            │
            │ redirect / API calls
            ▼
    xPay Hosted Checkout (React)
            │
            │ REST API
            ▼
    xPay Backend (Go)
            │
            │ REST API
            ▼
    Payment Provider Simulator (Go)

Each service is **independently runnable**, **independently testable**,
and communicates **only through REST APIs**.

------------------------------------------------------------------------

# Services

## 1. Merchant Web Application

### Purpose

Represents a merchant website integrating with xPay.

### Responsibilities

-   Display product / checkout page
-   Initiate payment
-   Redirect customer to xPay hosted checkout
-   Receive success or failure redirect after payment completion

### Technology

-   React 18+
-   Fetch API
-   Plain CSS
-   Vite or Create React App

------------------------------------------------------------------------

## 2. xPay Hosted Checkout

### Purpose

Simulates a hosted checkout page similar to Stripe Checkout.

### Responsibilities

-   Display payment UI
-   Accept OTP verification
-   Communicate with xPay backend for payment processing
-   Redirect customer back to merchant after completion

### Technology

-   React 18+
-   Fetch API
-   Plain CSS

------------------------------------------------------------------------

## 3. xPay Backend

### Purpose

Acts as the **core payment orchestration service**.

### Responsibilities

-   Create payment sessions
-   Validate checkout requests
-   Forward payment requests to the payment provider
-   Handle OTP verification
-   Return payment results

### Technology

-   Go 1.21+
-   net/http
-   encoding/json
-   In-memory state

------------------------------------------------------------------------

## 4. Payment Provider Simulator

### Purpose

Simulates an external payment processor.

### Responsibilities

-   Receive payment authorization requests
-   Simulate payment success or failure
-   Respond to xPay backend with transaction results

### Technology

-   Go 1.21+
-   net/http
-   encoding/json
-   In-memory state

------------------------------------------------------------------------

# Service Topology

    merchant-webapp/
    xpay-checkout/
    xpay-backend/
    payment-provider/

Each service has its own:

-   codebase
-   dependencies
-   runtime
-   API contracts

------------------------------------------------------------------------

# Data Flow

### Allowed flows

1.  Merchant → xPay Backend\
2.  xPay Checkout → xPay Backend\
3.  xPay Backend → Payment Provider\
4.  Payment Provider → xPay Backend

### Not allowed

-   Frontend → Payment Provider
-   Payment Provider → Frontend
-   Cross-frontend communication

This ensures **clear client-server boundaries** and proper **payment
orchestration architecture**.

------------------------------------------------------------------------

# Running the Project Locally

No external services are required.

## Run Merchant Web App

``` bash
cd merchant-webapp
npm install
npm start
```

## Run xPay Checkout

``` bash
cd xpay-checkout
npm install
npm start
```

## Run xPay Backend

``` bash
cd xpay-backend
go run ./...
```

## Run Payment Provider

``` bash
cd payment-provider
go run ./...
```

------------------------------------------------------------------------

# Example Payment Flow

1.  Customer opens merchant checkout page\
2.  Merchant creates a payment session with xPay\
3.  Customer is redirected to **xPay hosted checkout**\
4.  Customer enters OTP\
5.  xPay backend sends authorization request to payment provider\
6.  Payment provider returns success or failure\
7.  Customer is redirected back to merchant with result

------------------------------------------------------------------------

# Educational Constraints

To keep the system focused on learning core concepts:

-   In-memory storage is used
-   OTP codes may be logged to console
-   Payment results may be simulated
-   No database required
-   No PCI compliance requirements

This keeps the system simple while demonstrating **real payment gateway
architecture**.

------------------------------------------------------------------------

# Learning Objectives

This project helps developers understand:

-   Payment gateway architecture
-   Hosted checkout systems
-   Microservice service boundaries
-   Contract-first API design
-   Spec-Driven Development
-   Agentic AI software development workflows

------------------------------------------------------------------------

# Future Improvements

Possible extensions include:

-   webhook notifications
-   idempotency keys
-   payment retries
-   distributed tracing
-   message queues
-   real database storage
-   fraud detection simulation
