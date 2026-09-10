# 🚀 BugMart - Automation Testing Suite

> **🌐 Live Production Application:** [https://bugmart-manualtesting.onrender.com](https://bugmart-manualtesting.onrender.com)  
> **👨‍💻 SDET / Automation Engineer:** Mehul Agrawal  
> **🛠️ Framework:** Playwright (TypeScript) + Node.js  
> **📊 Target Application:** BugMart Full-Stack E-Commerce Platform  

---

## 📌 Project Overview

This repository contains the **End-to-End (E2E) UI Automation Test Suite** for **BugMart**, a modern e-commerce web application. The suite is engineered following industry best practices to validate critical user journeys, negative validation cases, and core business flows.

---

## 🎯 Test Scope & Automated Flows

The automation suite covers the essential customer journeys:

1. **🔐 Authentication & Session Management**:
   * **Positive Login**: Customer login with valid credentials (`tester@example.com` / `Test@123`), asserting session persistence and user profile greeting.
   * **Negative Login**: Login with an invalid password, asserting that an appropriate error alert is displayed.

2. **🔍 Product Catalog & Discovery**:
   * **Product Search**: Real-time keyword search for catalog items (e.g., `"Headphones"`), asserting matching product results.
   * **Category Filtering**: Filtering by specific product categories (e.g., `"Wearables"`), asserting that only relevant items are rendered.

3. **🛒 Shopping Cart Management**:
   * **Add to Cart**: Navigating to product detail, adding an item, and verifying its presence in the cart.
   * **Quantity Adjustment & Item Removal**: Incrementing product quantities and removing items to verify the empty cart state.

4. **💳 Checkout & Order Fulfillment**:
   * **Positive End-to-End Checkout**: Filling required delivery address, selecting payment method, and placing order to verify the **Order Confirmation** receipt with a unique `ORD-XXXXX` reference ID.
   * **Negative Form Validation**: Submitting the checkout form with missing required fields to assert that validation error messages appear.

---

## 🏗️ Project Structure

```
BugMart-AutomationTesting/
├── client/                     # Frontend Application (React 18 + Vite)
├── server/                     # Backend API Server (Node.js + Express REST API)
├── tests/                      # Playwright E2E Test Specifications
│   ├── login.spec.ts           # Authentication test flows (Positive & Negative)
│   ├── product.spec.ts         # Product search and category filter flows
│   ├── cart.spec.ts            # Cart management & quantity update flows
│   ├── checkout.spec.ts        # Positive checkout & negative form validations
│   └── test-data.ts            # Centralized test fixtures & credentials
├── playwright.config.ts        # Playwright runner & HTML reporting configuration
├── render.yaml                 # Cloud deployment infrastructure blueprint
└── package.json                # Project dependencies and test runner scripts
```

---

## 💡 Automation Best Practices Implemented

* **User-Facing Locators**: Prioritizes Playwright's semantic locators (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`) rather than brittle CSS or XPath selectors.
* **Web-First Assertions**: Uses auto-retrying assertions (`toBeVisible()`, `toContainText()`, `toHaveValue()`) to prevent flaky tests.
* **Zero Hard Waits**: Completely avoids `page.waitForTimeout()`, relying strictly on Playwright's built-in event-driven auto-waiting.
* **Clean State Isolation**: Resets sessions and storage before each test to ensure tests remain independent and idempotent.

---

## 🚀 Getting Started & Execution Commands

### 1. Install Dependencies
```bash
npm install
npm --prefix client install
npm --prefix server install
npx playwright install chromium
```

### 2. Run the Application Locally
```bash
npm run dev
```
* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000](http://localhost:5000)

### 3. Run Automation Tests
```bash
# Run all Playwright tests headlessly
npx playwright test

# Run tests in headed browser mode (watch execution visually)
npx playwright test --headed

# Run a specific test file
npx playwright test tests/login.spec.ts

# Run against the live production environment
BASE_URL=https://bugmart-manualtesting.onrender.com npx playwright test
```

### 4. View Test Execution Report
```bash
npx playwright show-report
```
Opens Playwright's interactive HTML test report detailing execution steps, timelines, screenshots, and failure traces.

---

## 👨‍💻 Author
**Mehul Agrawal**  
*QA & SDET Engineer*  
* GitHub: [@mehulagrawal87](https://github.com/mehulagrawal87)