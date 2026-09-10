# 🚀 BugMart - Automation Testing Suite

> **🌐 Live Production Application:** [https://bugmart-manualtesting.onrender.com](https://bugmart-manualtesting.onrender.com)  
> **👨‍💻 SDET / Automation Engineer:** Mehul Agrawal  
> **🛠️ Framework:** Playwright (TypeScript) + Node.js  
> **📊 Target Application:** BugMart Full-Stack E-Commerce Platform  

---

## 📌 1. What is Playwright?

**Playwright** is a modern, open-source End-to-End (E2E) automation testing framework created by Microsoft. It is designed for fast, reliable, and headless/headed browser testing across Chromium, WebKit, and Firefox. 

Key advantages demonstrated in this suite:
* **Auto-Waiting**: Playwright automatically waits for elements to be actionable (visible, enabled, stable) before executing actions, eliminating the need for arbitrary hardcoded sleep/timeout calls.
* **Web-First Assertions**: Auto-retrying assertions (`toBeVisible()`, `toContainText()`, `toHaveValue()`) that wait until expected conditions are satisfied.
* **Semantic, User-Facing Locators**: Locators that mimic how real users interact with the application (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`) rather than fragile CSS or XPath selectors.
* **Rich Reporting**: Out-of-the-box interactive HTML reports with screenshots, execution timelines, and failure tracing.

---

## 🎯 2. What is Being Tested?

The automation suite consists of **9 focused, high-value E2E test scenarios** validating core user journeys and negative edge cases:

1. **🔐 Authentication (`tests/login.spec.ts`)**:
   * `TC-AUTH-01`: **Valid Login** — Signs in with customer credentials (`tester@example.com` / `Test@123`), asserts user profile greeting (`Alex`) is displayed in the navigation header, and verifies redirection to the catalog.
   * `TC-AUTH-02`: **Invalid Login (Negative)** — Attempts sign-in with an incorrect password, asserting the error alert (`Invalid credentials` / `Authentication failed`) appears.

2. **🔍 Product Discovery (`tests/product.spec.ts`)**:
   * `TC-CAT-01`: **Product Search** — Searches catalog for keyword (`"Headphones"`), asserting the matching product (`"AeroBeat Pro Wireless Headphones"`) is displayed.
   * `TC-CAT-02`: **Product Filtering** — Applies the `"Wearables"` category filter, asserting category-specific products (`"Titan Pulse Smart Fitness Watch"`) appear while other categories are excluded.

3. **🛒 Shopping Cart Management (`tests/cart.spec.ts`)**:
   * `TC-CART-01`: **Add to Cart** — Opens product detail view, adds the item to the cart, navigates to Cart, and verifies item title.
   * `TC-CART-02`: **Quantity Modification** — Increments quantity from 1 to 2 using the `+` button and asserts recalculated subtotal.
   * `TC-CART-03`: **Item Removal** — Removes the item via the trash button and asserts empty cart state (`"Your Cart is Empty"`).

4. **💳 Checkout & Validation (`tests/checkout.spec.ts`)**:
   * `TC-CHK-01`: **End-to-End Checkout** — Completes the checkout form with valid shipping details and places the order; verifies the `"Order Confirmed!"` screen and receipt of an `ORD-XXXXX` reference ID.
   * `TC-CHK-02`: **Form Validation (Negative)** — Clears required `"Recipient Name"` field and attempts submission; asserts that the validation error `"Full name is required"` is shown and the order is blocked.

---

## 🏗️ 3. Project Structure

```
BugMart-AutomationTesting/
├── tests/                      # Playwright E2E Test Specifications (20 Tests Total)
│   ├── login.spec.ts           # Core Authentication flows (TC-AUTH-01, TC-AUTH-02)
│   ├── product.spec.ts         # Core Product Catalog flows (TC-CAT-01, TC-CAT-02)
│   ├── cart.spec.ts            # Core Cart Management flows (TC-CART-01, TC-CART-02, TC-CART-03)
│   ├── checkout.spec.ts        # Core Checkout & Negative Form validation (TC-CHK-01, TC-CHK-02)
│   ├── defects.spec.ts         # Automated Defect Regression Suite reproducing BugMart_Defect_Log.csv
│   └── test-data.ts            # Centralized test fixtures & credentials
├── playwright.config.ts        # Playwright runner & HTML reporting configuration
├── package.json                # Project scripts & devDependencies (@playwright/test)
├── BugMart_Defect_Log.csv      # Defect log identified during manual QA testing
├── client/                     # Frontend application (React 18 + Vite)
├── server/                     # Backend API server (Express + Node.js)
└── README.md                   # Automation documentation & execution guide
```

---

## 💡 4. Automation Best Practices Implemented

* **User-Facing Locators**: Exclusively uses Playwright's accessible selectors (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`). Avoids brittle XPath or nested CSS classes.
* **Web-First Assertions**: Auto-retrying assertions (`toBeVisible()`, `toContainText()`, `toHaveValue()`) prevent flakiness and race conditions.
* **Zero Hard Waits**: Strict compliance with Playwright best practices — no `page.waitForTimeout()` used anywhere.
* **No Over-Engineering**: Clean, flat test specs without unnecessary abstractions, designed so every line is easy to explain during an SDET interview.

---

## 🚀 5. How to Run the Tests

### Step 1: Install Dependencies
```bash
npm install
npx playwright install chromium
```
*(On Windows PowerShell, use `npm.cmd` and `npx.cmd` if PowerShell script execution is restricted).*

### Step 2: Run All Tests
```bash
npm test
# Or directly via npx:
npx playwright test
```

### Step 3: Run in Headed Browser Mode (Watch Tests Visually)
```bash
npm run test:headed
# Or:
npx playwright test --headed
```

### Step 4: Run a Specific Test File
```bash
npx playwright test tests/login.spec.ts
npx playwright test tests/product.spec.ts
npx playwright test tests/cart.spec.ts
npx playwright test tests/checkout.spec.ts
npx playwright test tests/defects.spec.ts  # Run the defect reproduction suite
```

### Step 5: Test Against Local vs. Production
By default, tests run against the live production environment ([https://bugmart-manualtesting.onrender.com](https://bugmart-manualtesting.onrender.com)).
To run against your local dev server:
```bash
BASE_URL=http://localhost:5173 npx playwright test
```

---

## 📊 6. How to View the HTML Report

Playwright automatically records complete test execution data:
```bash
npm run test:report
# Or:
npx playwright show-report
```
This opens the interactive HTML report in your default browser, showing:
* Status of each test (passed / failed)
* Step-by-step execution timeline
* Duration of each action and assertion
* Screenshots and trace logs for any failed runs

---

## 👨‍💻 Author
**Mehul Agrawal**  
*QA & SDET Engineer*  
* GitHub: [@mehulagrawal87](https://github.com/mehulagrawal87)