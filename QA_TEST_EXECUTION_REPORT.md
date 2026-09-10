# 📋 BugMart - QA Manual Test Execution & Defect Report

**Application Under Test (AUT):** BugMart E-Commerce Store  
**Live Environment:** [https://bugmart-manualtesting.onrender.com](https://bugmart-manualtesting.onrender.com)  
**Test Cycle:** Sprint 1 — End-to-End Functional, Regression & Edge-Case Testing  
**Execution Date:** September 11, 2026  
**QA Lead / Tester:** Pair Programming QA Subagent  

---

## 1. 📊 Executive Summary & Test Metrics

A total of **27 structured test cases** across 7 functional modules were executed on the live cloud production deployment of BugMart.

| Metric | Count | Percentage |
| :--- | :--- | :--- |
| **Total Test Cases Executed** | **27** | **100%** |
| **Passed Test Cases** | **15** | **55.6%** |
| **Failed Test Cases (Defects Caught)** | **12** | **44.4%** |
| **Blocked / Skipped** | **0** | **0%** |

```
Test Execution Status:
[============================= 100% Executed ]
Passed: [############### 55.6% ]
Failed: [############    44.4% ]
```

### Defect Breakdown by Severity

* 🔴 **Critical (2 Defects)**: Broken password confirmation check (security), negative shopping cart balance logic.
* 🟠 **Major (7 Defects)**: Category filter corruption, lexicographical string sorting, unbounded inventory additions, checkout form validation bypasses (phone & UPI), duplicate case-sensitive email registration, expired card date acceptance.
* 🟡 **Minor (3 Defects)**: Admin search case-sensitivity, user count off-by-one discrepancy, navbar user menu event capture glitch.

---

## 2. 🧩 Module-Wise Test Results

| Module | Total | Pass | Fail | Pass Rate | Key Observations |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Smoke & UI Sanity** | 2 | 2 | 0 | 100% | Fast page load (1.2s), responsive layout, clean typography. |
| **Authentication & RBAC** | 5 | 3 | 2 | 60.0% | Customer & Admin login work; registration allows prefix confirm password. |
| **Catalog & Discovery** | 4 | 2 | 2 | 50.0% | Search works; Category filter leaks Product #6; Sort uses string comparator. |
| **Product Detail & Stock** | 2 | 0 | 2 | 0% | No lower bound (allows 0 units) or upper bound (exceeds in-stock limit). |
| **Cart & Calculations** | 4 | 3 | 1 | 75.0% | Subtotals, discounts, taxes accurate; decrement button allows negative totals. |
| **Checkout & Payments** | 5 | 2 | 3 | 40.0% | Required fields checked; letters allowed in phone, empty UPI ID allowed. |
| **Admin Portal & System** | 5 | 3 | 2 | 60.0% | Order status update and reset work; price truncation & user count flawed. |

---

## 3. 🐞 Comprehensive Defect Log (Bugs Found)

### [BUG-001] Bamboo Desk Organizer appears under Electronics category
* **Severity:** Major | **Priority:** High | **Module:** Catalog
* **Steps to Reproduce:**
  1. Navigate to the Catalog page.
  2. In the sidebar, select **"Electronics"**.
* **Expected Result:** Only electronics products should display.
* **Actual Result:** Product #6 (*Bamboo Eco-Friendly Desk Organizer*) from Home & Living is displayed under Electronics.
* **Code Reference:** `server/routes/products.js` (Line 15: `p.category === 'Electronics' || p.id === 6`).

---

### [BUG-002] Price sorting sorts alphabetically instead of numerically
* **Severity:** Major | **Priority:** High | **Module:** Catalog
* **Steps to Reproduce:**
  1. On Catalog page, select Sort: **"Price: Low to High"**.
* **Expected Result:** Products appear in ascending dollar order: $16.00, $18.50, $19.99 ... $110.00, $149.99.
* **Actual Result:** Items are sorted as strings. Products priced at `$110.00` and `$149.99` appear before `$18.50` and `$22.00` because `'1'` < `'2'`.
* **Code Reference:** `server/routes/products.js` (Line 41: `String(a.price).localeCompare(...)`).

---

### [BUG-003] Confirm password field accepts partial prefix matches
* **Severity:** Critical | **Priority:** High | **Module:** Authentication
* **Steps to Reproduce:**
  1. Open Register page.
  2. Enter Password: `Secret123`.
  3. Enter Confirm Password: `Secret` (only the prefix).
  4. Submit form.
* **Expected Result:** Validation rejects registration with *"Passwords do not match"*.
* **Actual Result:** Registration succeeds and logs the user in.
* **Code Reference:** `client/src/pages/RegisterPage.jsx` (Line 66: uses `.startsWith()` instead of `===`).

---

### [BUG-004] Cart allows zero and negative quantities via minus button
* **Severity:** Critical | **Priority:** High | **Module:** Shopping Cart
* **Steps to Reproduce:**
  1. Add an item to the cart with quantity 1.
  2. Open the Cart page.
  3. Click the `-` button. Quantity becomes `0`.
  4. Click `-` again. Quantity becomes `-1`.
* **Expected Result:** Quantity stops at 1 or prompts to remove the line item.
* **Actual Result:** Item remains with negative quantity, creating a negative line subtotal that reduces order balance.
* **Code Reference:** `client/src/pages/CartPage.jsx` & `client/src/context/CartContext.jsx`.

---

### [BUG-005] Product Detail quantity counter exceeds in-stock inventory & allows 0 units
* **Severity:** Major | **Priority:** Medium | **Module:** Product Detail
* **Steps to Reproduce:**
  1. Open Product #11 (*Apex SoundBar*, stock: 8 units).
  2. Click `+` 25 times and click "Add to Cart".
* **Expected Result:** Counter caps at 8 and `+` button disables.
* **Actual Result:** Cart receives 25 units, exceeding total warehouse inventory.
* **Code Reference:** `client/src/pages/ProductDetailPage.jsx`.

---

### [BUG-006] Checkout phone number field accepts non-numeric alphabet characters
* **Severity:** Major | **Priority:** Medium | **Module:** Checkout
* **Steps to Reproduce:**
  1. Proceed to Checkout.
  2. In Contact Phone Number, enter `abcdefgh`.
  3. Complete checkout and click "Place Order".
* **Expected Result:** Form error: *"Please enter a valid numeric phone number"*.
* **Actual Result:** Order is placed successfully with phone number stored as letters.
* **Code Reference:** `client/src/pages/CheckoutPage.jsx`.

---

### [BUG-007] Checkout allows submitting UPI payment with empty UPI ID
* **Severity:** Major | **Priority:** High | **Module:** Checkout
* **Steps to Reproduce:**
  1. In Checkout, select Payment Method: **"UPI / Instant Banking"**.
  2. Leave the UPI ID input field blank.
  3. Click "Place Order".
* **Expected Result:** Form requires entering a valid UPI ID (e.g. `user@bank`).
* **Actual Result:** Order succeeds immediately with an empty payment identifier.
* **Code Reference:** `client/src/pages/CheckoutPage.jsx`.

---

### [BUG-008] Admin new product creation truncates decimal prices
* **Severity:** Major | **Priority:** Medium | **Module:** Admin Dashboard
* **Steps to Reproduce:**
  1. Log in as Admin and open Admin Dashboard.
  2. Click "Add New Product", set Price to `24.99`, and save.
* **Expected Result:** Product is saved with price `$24.99`.
* **Actual Result:** Product is saved as `$24.00` due to `parseInt(price, 10)` truncation.
* **Code Reference:** `server/routes/products.js` (Line 92).

---

### [BUG-009] Admin product search filter is case-sensitive
* **Severity:** Minor | **Priority:** Low | **Module:** Admin Dashboard
* **Steps to Reproduce:**
  1. In Admin Products tab, search for `headphones` (lowercase).
* **Expected Result:** "Aura Noise-Canceling Wireless Headphones" is displayed.
* **Actual Result:** 0 products match because `.includes()` is strictly case-sensitive.
* **Code Reference:** `client/src/pages/AdminDashboardPage.jsx` (Line 179).

---

### [BUG-010] Total Recorded Users shows off-by-one discrepancy in Admin tab
* **Severity:** Minor | **Priority:** Low | **Module:** Admin Dashboard
* **Steps to Reproduce:**
  1. Open Admin Dashboard ➔ **Users** tab.
  2. Count rows in the table (2 users).
  3. Read the top banner: *"Total Recorded Users: 3"*.
* **Expected Result:** Header displays 2 users.
* **Actual Result:** Header displays 3 users due to backend `safeUsers.length + 1`.
* **Code Reference:** `server/routes/auth.js` (Line 145).

---

### [BUG-011] Navbar user menu closes prematurely on mousedown in some viewports
* **Severity:** Minor | **Priority:** Medium | **Module:** Navigation
* **Steps to Reproduce:**
  1. Log in to customer account.
  2. Click the username button in the top navbar.
* **Expected Result:** Dropdown menu toggles open and stays open.
* **Actual Result:** Dropdown opens and instantly closes due to a document `mousedown` listener race condition.
* **Code Reference:** `client/src/components/Navbar.jsx`.

---

### [BUG-012] Case-sensitive registration email check allows duplicate accounts
* **Severity:** Major | **Priority:** Medium | **Module:** Authentication
* **Steps to Reproduce:**
  1. Attempt registration with `Tester@example.com` when `tester@example.com` exists.
* **Expected Result:** System rejects registration: *"Email already registered"*.
* **Actual Result:** New duplicate account is created because check uses `===` without `.toLowerCase()`.
* **Code Reference:** `server/routes/auth.js` (Line 42).

---

### [BUG-013] Checkout card payment accepts expired credit card dates
* **Severity:** Major | **Priority:** Medium | **Module:** Checkout
* **Steps to Reproduce:**
  1. Enter Card Expiry as `01/20` (past date).
  2. Place order.
* **Expected Result:** Rejects card with validation error: *"Card has expired"*.
* **Actual Result:** Order is accepted without verifying if date is in the future.
* **Code Reference:** `client/src/pages/CheckoutPage.jsx`.

---

## 4. 🏁 QA Recommendation & Release Verdict

* **Release Recommendation:** ❌ **REJECT FOR PRODUCTION RELEASE**
* **Reason:** Critical financial defects (negative cart balance) and authentication vulnerabilities (loose password confirmation, duplicate accounts) must be remediated before production release.
* **Artifacts Generated for the QA Team:**
  * [**`BugMart_Test_Cases.csv`**](file:///c:/Users/HP/Desktop/Manual%20Testing/BugMart_Test_Cases.csv) (Executed Test Suite with Statuses)
  * [**`BugMart_Defect_Log.csv`**](file:///c:/Users/HP/Desktop/Manual%20Testing/BugMart_Defect_Log.csv) (Detailed Bug Log)
