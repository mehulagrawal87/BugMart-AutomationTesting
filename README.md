# 🛒 BugMart - Manual Testing Playground

A purpose-built, full-stack e-commerce web application engineered specifically for **Software QA Engineers, Manual Testers, and QA Students** to practice manual test case design, exploratory testing, boundary testing, and bug logging.

---

## 🚀 Quick Start Guide

The application consists of an **Express.js REST API** backend and a **React + Vite** frontend.

### Running the App

Both servers are currently active:
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

To start or restart the servers manually:

```cmd
# Terminal 1: Backend Server (Port 5000)
cd server
node server.js

# Terminal 2: Frontend Client (Port 5173)
cd client
npm run dev
```

*(Tip for Windows PowerShell users: if execution policy blocks `npm`, run via `cmd.exe /c "npm --prefix client run dev"`)*

---

## 🔑 Pre-Configured Test Credentials & QA Helper

The application features a built-in **"Test Accounts & Data" drawer** accessible from anywhere via the floating bottom-right badge or header button.

### Demo User Accounts

| Persona | Email | Password | Role / Access Privileges |
| :--- | :--- | :--- | :--- |
| **Standard Customer** | `tester@example.com` | `Test@123` | Can browse, manage cart, place orders, view order history, edit profile |
| **Store Administrator** | `admin@example.com` | `Admin@123` | Full access + **Admin Dashboard** (Product CRUD, Inventory management, Order fulfillment) |

### Test Shipping & Payment Data

- **Recipient**: Alex Morgan
- **Address**: 742 Evergreen Terrace, Springfield, OR 97477
- **Phone**: `9876543210`
- **Test Card**: `4111 2222 3333 4444` (Expiry: `12/28`, CVV: `789`)

### Promo Coupons for Discount Testing

- `SAVE10` — 10% discount on orders of $40 or more
- `FIRST20` — 20% discount on entire order
- `FREESHIP` — Free shipping ($0 delivery fee)

### Database Reset
Click the **"Reset Store Data to Default"** button in the Test Data Drawer (or `POST /api/system/reset`) at any time to return all products, stock levels, orders, and user carts back to their original testing state.

---

## 📋 Comprehensive QA Manual Test Matrix

Use this checklist to practice writing test plans, executing test cases, and filing defect tickets.

### 1. Authentication & Security Testing
- [ ] **TC-AUTH-01 (Positive)**: Login with valid customer credentials (`tester@example.com` / `Test@123`). Verify session persistence and greeting banner.
- [ ] **TC-AUTH-02 (Positive)**: Login with admin credentials (`admin@example.com` / `Admin@123`). Verify "Admin Dashboard" navigation link appears.
- [ ] **TC-AUTH-03 (Negative)**: Attempt login with invalid password. Verify appropriate error message.
- [ ] **TC-AUTH-04 (Negative)**: Attempt login with unformatted email (e.g. `invalid-email`). Verify client-side format validation.
- [ ] **TC-AUTH-05 (Negative)**: Attempt login with blank email and password fields.
- [ ] **TC-AUTH-06 (Functional)**: Register a new account with unique email. Confirm account creation and automatic login.
- [ ] **TC-AUTH-07 (Security/RBAC)**: Attempt direct navigation to `/admin` as a standard logged-in customer or guest. Verify non-admin access is restricted.
- [ ] **TC-AUTH-08 (Functional)**: Log out from the user dropdown and confirm session termination.

### 2. Product Catalog & Search/Filter Testing
- [ ] **TC-PROD-01 (Functional)**: Search products by keyword (e.g., `"Headphones"`, `"Mug"`, `"SoundBar"`). Verify real-time filtering.
- [ ] **TC-PROD-02 (Negative)**: Search for a non-existent item (e.g., `"xyzabc"`). Verify "No products found" empty state message.
- [ ] **TC-PROD-03 (Functional)**: Filter by category (Electronics, Home & Living, Apparel & Footwear, Books & Stationery, Wearables).
- [ ] **TC-PROD-04 (Functional)**: Filter by price range slider. Verify only items within bounds are displayed.
- [ ] **TC-PROD-05 (Functional)**: Toggle "In Stock Only" checkbox. Verify out-of-stock or low-stock items behave as expected.
- [ ] **TC-PROD-06 (Functional)**: Sort products by Price: Low to High, Price: High to Low, and Highest Rating. Verify sort order accuracy.

### 3. Product Details & Stock Validation
- [ ] **TC-DET-01 (Functional)**: Click on a product card to open Product Detail page. Verify name, price, description, feature bullets, and ratings.
- [ ] **TC-DET-02 (Boundary)**: Increment quantity counter up to maximum available stock. Verify the `+` button disables or warns when reaching stock limit.
- [ ] **TC-DET-03 (Negative)**: Test decrementing quantity below 1. Verify quantity cannot be negative or zero.
- [ ] **TC-DET-04 (Functional)**: Click "Add to Cart" and verify cart badge count updates in the navbar.

### 4. Shopping Cart & Calculations
- [ ] **TC-CART-01 (Functional)**: View cart page. Verify item details, unit price, quantity, and line subtotal.
- [ ] **TC-CART-02 (Boundary)**: Increase and decrease item quantities inside the cart. Verify subtotal, estimated tax, and shipping recalculate instantly.
- [ ] **TC-CART-03 (Functional)**: Remove an individual item from cart. Verify confirmation toast / item disappearance.
- [ ] **TC-CART-04 (Boundary)**: Remove all items to reach empty cart state. Verify "Your cart is empty" view with a link back to catalog.

### 5. Checkout & Coupon Logic Testing
- [ ] **TC-CHK-01 (Validation)**: Submit checkout form with blank required fields (Full Name, Address, City, ZIP, Phone). Verify validation error flags.
- [ ] **TC-CHK-02 (Functional)**: Apply promo code `FIRST20` and verify 20% deduction is applied to the total.
- [ ] **TC-CHK-03 (Negative)**: Apply an invalid coupon (e.g., `FAKE50`). Verify appropriate rejection message.
- [ ] **TC-CHK-04 (Boundary)**: Apply `SAVE10` on an order below $40 minimum threshold. Verify minimum purchase rule is enforced.
- [ ] **TC-CHK-05 (Functional)**: Switch between payment methods: Credit/Debit Card, Cash on Delivery (COD), UPI/Net Banking.
- [ ] **TC-CHK-06 (End-to-End)**: Complete order with valid card details. Verify redirection to Order Confirmation page with unique Order ID and summary.

### 6. Order History & Profile Management
- [ ] **TC-ORD-01 (Functional)**: Navigate to "My Orders" as a logged-in user. Verify recently placed order appears in the list with correct status ("Processing" or "Pending").
- [ ] **TC-ORD-02 (Functional)**: Expand order details to review ordered items, delivery address, and total amount paid.
- [ ] **TC-PROF-01 (Functional)**: Update user profile name and phone number on Profile Page. Verify changes persist after page refresh.

### 7. Admin Dashboard & Inventory Management
- [ ] **TC-ADM-01 (Functional)**: Log in as `admin@example.com` and open Admin Dashboard.
- [ ] **TC-ADM-02 (CRUD - Create)**: Click "Add New Product", fill out title, price, category, initial stock, and submit. Verify new product appears in storefront.
- [ ] **TC-ADM-03 (CRUD - Update)**: Edit an existing product's price or stock quantity. Verify change reflects in catalog immediately.
- [ ] **TC-ADM-04 (CRUD - Delete)**: Delete a product and verify it is removed from catalog.
- [ ] **TC-ADM-05 (Fulfillment)**: Update customer order status from "Processing" to "Shipped" or "Delivered". Verify updated status in customer order view.

---

## 🐞 Bug Report Template

When you discover an anomaly or defect during testing, use this standard QA defect format to document it:

```markdown
**Defect ID:** BUG-001
**Title:** [Component] - Brief summary of the defect
**Severity:** Critical / Major / Minor / Trivial
**Priority:** High / Medium / Low
**Environment:** Chrome 120 / Windows 11 / Localhost:5173

**Pre-Conditions:**
1. User is logged in as 'tester@example.com'
2. Cart contains at least 1 item

**Steps to Reproduce:**
1. Navigate to /cart
2. Click on 'Proceed to Checkout'
3. Enter invalid postal code 'ABCDE'
4. Click 'Place Order'

**Expected Result:**
System should display validation error: "Please enter a valid 5 or 6 digit postal code."

**Actual Result:**
Order was submitted without validating the postal code format.

**Attachments / Console Logs:**
(Attach screenshot or browser console logs if applicable)
```

---

## 🛠️ Architecture & Folder Structure

```
Manual Testing/
├── client/                     # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProductCard, TestDataDrawer, Modal
│   │   ├── context/            # AuthContext (sessions, roles), CartContext (pricing, items)
│   │   ├── pages/              # 11 Dedicated Pages (Home, Catalog, Detail, Cart, Checkout, etc.)
│   │   ├── App.jsx             # Main router and shell
│   │   ├── index.css           # Custom modern design system
│   │   └── main.jsx            # React root
│   ├── index.html              # HTML shell with meta tags & Google fonts
│   └── vite.config.js          # Vite config with API proxy to localhost:5000
│
├── server/                     # Backend API Server (Node.js + Express)
│   ├── data/
│   │   ├── db.js               # JSON store manager with reset capabilities
│   │   ├── initialData.json    # Canonical seed dataset (18 products, users, orders)
│   │   └── store.json          # Active mutable runtime database
│   ├── routes/
│   │   ├── auth.js             # User login, registration, profile routes
│   │   ├── products.js         # Product listing, filtering, and admin CRUD
│   │   ├── orders.js           # Order creation, history, and status updates
│   │   └── cart.js             # Cart sync and promo code validation
│   └── server.js               # Express application entrypoint
│
└── README.md                   # This QA manual testing guide and matrix
```
