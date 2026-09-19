# E-Commerce Application - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Architecture](#project-architecture)
4. [Frontend - React Application](#frontend--react-application)
5. [Backend - Spring Boot Application](#backend--spring-boot-application)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Key Features](#key-features)
9. [Security Implementation](#security-implementation)
10. [Setup & Deployment](#setup--deployment)
11. [Project Structure](#project-structure)

---

## 🎯 Project Overview

This is a **full-stack e-commerce application** built with modern technologies. It provides a complete shopping platform with user authentication, product management, shopping cart, order management, payment integration, and admin dashboard.

**Target Users:**
- End Users (Customers)
- Admin Users (Store Managers)

**Core Functionality:**
- User registration and authentication
- Product browsing and searching by category
- Shopping cart management
- Wishlist functionality
- Secure checkout and payment processing
- Order management and history tracking
- User profile management
- Admin dashboard for product and order management
- Product reviews and ratings

---

## 💻 Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.6 | UI library for building interactive user interfaces |
| **React Router DOM** | 7.18.0 | Client-side routing and navigation |
| **Vite** | 8.0.12 | Modern build tool and dev server |
| **Axios** | 1.18.0 | HTTP client for API requests |
| **JWT-Decode** | 4.0.0 | Decoding JWT tokens for authentication |
| **React Icons** | 5.6.0 | Icon library for UI components |
| **ESLint** | 10.3.0 | Code quality and linting |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Spring Boot** | 3.3.5 | Java framework for building REST APIs |
| **Java** | 17 | Programming language |
| **Spring Web** | 3.3.5 | Web and REST API support |
| **Spring Data JPA** | 3.3.5 | ORM and database operations |
| **Spring Security** | 3.3.5 | Authentication and authorization |
| **JWT (JJWT)** | 0.11.5 | JSON Web Token creation and validation |
| **MySQL Connector** | Latest | Database driver |
| **Lombok** | Latest | Code generation for getters, setters, constructors |
| **Razorpay Payment Gateway** | 1.4.6 | Payment processing integration |
| **Cloudinary** | 1.38.0 | Image hosting and management |

### Database
| Technology | Purpose |
|-----------|---------|
| **MySQL** | Relational database for storing application data |
| **Database Name** | `shopping_app` |
| **Port** | 3306 |

---

## 🏗️ Project Architecture

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Browser)                  │
│               React Frontend (Vite + React Router)          │
└────────────────────────────────────────────────────────────┘
                              ↕ (HTTP/AXIOS)
┌─────────────────────────────────────────────────────────────┐
│              REST API LAYER (Spring Boot Backend)            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Controllers (REST Endpoints)                        │  │
│  │  - User, Auth, Product, Category, Order, Cart, etc. │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↕                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Service Layer (Business Logic)                      │  │
│  │  - Authentication, Product Management, Orders, etc. │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↕                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Repository Layer (Data Access - JPA)               │  │
│  │  - Direct database operations                        │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER (MySQL Database)               │
│         Tables: Users, Products, Orders, Cart, etc.        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Frontend - React Application

**Location:** `d:\ecommerce\Reactfront\ecommerce-frontend\`

### 1. Directory Structure

```
src/
├── App.jsx                 # Main application component with routing
├── main.jsx               # React entry point
├── assets/                # Static images and media files
├── components/            # Reusable UI components
├── context/              # React Context for state management
├── pages/                # Page-level components
├── routes/               # Route definitions (currently empty)
├── services/             # API communication services
└── utils/                # Utility functions and helpers
```

### 2. Key Pages (User Side)

| Page | Component | Purpose |
|------|-----------|---------|
| **Welcome** | `Welcome.jsx` | Landing page for new users |
| **User Login** | `pages/user/UserLogin.jsx` | User authentication |
| **User Registration** | `pages/user/UserRegister.jsx` | New user signup |
| **Register Choice** | `RegisterChoice.jsx` | Choose between User/Admin registration |
| **Home** | `Home.jsx` | Main shopping page with featured products |
| **Category Page** | `Category.jsx` | Browse products by category |
| **Product List** | `ProductList.jsx` | Display filtered/searched products |
| **Cart** | `Cart.jsx` | Shopping cart with product management |
| **Checkout** | `Checkout.jsx` | Order finalization and payment |
| **Orders** | `Orders.jsx` | View current/active orders |
| **Order History** | `OrderHistory.jsx` | View past orders |
| **Order Details** | `OrderDetails.jsx` | Detailed view of specific order |
| **Profile** | `Profile.jsx` | User account management |
| **Wishlist** | `Wishlist.jsx` | Saved favorite products |

### 3. Admin Pages

| Page | Component | Purpose |
|------|-----------|---------|
| **Admin Login** | `pages/admin/AdminLogin.jsx` | Admin authentication |
| **Admin Registration** | `pages/admin/AdminRegister.jsx` | Admin account creation |
| **Admin Dashboard** | `pages/admin/AdminDashboard.jsx` | Main admin panel |
| **Admin Categories** | `pages/admin/AdminCategories.jsx` | Manage product categories |
| **Admin Products** | `pages/admin/AdminProducts.jsx` | Add/Edit/Delete products |
| **Admin Orders** | `pages/admin/AdminOrders.jsx` | Manage all customer orders |
| **Admin Profile** | `pages/admin/AdminProfile.jsx` | Admin account settings |

### 4. React Components (Reusable)

| Component | Location | Purpose |
|-----------|----------|---------|
| **Navbar** | `AdminNavbar.jsx` | Navigation bar for regular users |
| **AdminNavbar** | `AdminNavbar.jsx` | Admin-specific navigation |
| **AdminLayout** | `AdminLayout.jsx` | Layout wrapper for admin pages |
| **ProtectedRoute** | `ProtectedRoute.jsx` | Authentication guard for user routes |
| **AdminRoute** | `AdminRoute.jsx` | Authorization guard for admin routes |
| **ProductReviews** | `ProductReviews.jsx` | Display and manage product reviews |
| **StarRating** | `StarRating.jsx` | 5-star rating component |

### 5. Context API (State Management)

| Context | Location | Purpose |
|---------|----------|---------|
| **CartContext** | `context/CartContext.jsx` | Global cart state management |

Provides cart-related state and actions across the application.

### 6. API Services

Each service module handles communication with backend APIs:

| Service | Location | APIs Handled |
|---------|----------|--------------|
| **authService** | `services/authService.js` | User/Admin login, registration, token management |
| **api** | `services/api.js` | Base Axios configuration with interceptors |
| **userService** | `services/userService.js` | User profile, personal data operations |
| **productService** | `services/productService.js` | Product fetching, searching, filtering |
| **categoryService** | `services/categoryService.js` | Category management (admin only) |
| **cartService** | `services/cartService.js` | Cart operations: add, remove, update |
| **orderService** | `services/orderService.js` | Order creation, history, tracking |
| **reviewService** | `services/reviewService.js` | Product reviews and ratings |
| **wishlistService** | `services/wishlistService.js` | Wishlist management |
| **adminService** | `services/adminService.js` | Admin-specific operations |

### 7. Utilities

| Utility | Location | Purpose |
|---------|----------|---------|
| **auth.js** | `utils/auth.js` | Authentication helper functions (JWT validation, token extraction) |
| **wishlist.js** | `utils/wishlist.js` | Wishlist utility functions |

### 8. Assets

- Static images, icons, and media files used throughout the application

---

## ⚙️ Backend - Spring Boot Application

**Location:** `d:\ecommerce\springboot\demo\demo\`

### 1. Directory Structure

```
src/main/java/com/example/demo/
├── DemoApplication.java           # Spring Boot entry point
├── config/                        # Configuration classes
│   ├── Security Config
│   ├── CORS Configuration
│   └── JWT Configuration
├── controller/                    # REST API endpoints (14 controllers)
├── service/                       # Business logic
├── repository/                    # Database access (JPA)
├── model/                         # Entity classes
├── dto/                          # Data Transfer Objects
└── exception/                    # Custom exception classes

src/main/resources/
├── application.properties         # Database & server configuration
└── uploads/                      # File storage directory
```

### 2. Controllers (REST Endpoints)

| Controller | Purpose | Key Endpoints |
|-----------|---------|--------------|
| **AuthController** | User and Admin authentication | POST /api/auth/login, /api/auth/register |
| **UserController** | User data management | GET/POST /api/users, /api/users/profile |
| **AdminProfileController** | Admin profile operations | GET/PUT /api/admin/profile |
| **ProductController** | Product operations (public) | GET /api/products, /api/products/{id} |
| **AdminProductController** | Product management (admin only) | POST/PUT/DELETE /api/admin/products |
| **CategoryController** | Category retrieval (public) | GET /api/categories |
| **AdminCategoryController** | Category management (admin only) | POST/PUT/DELETE /api/admin/categories |
| **CartController** | Shopping cart operations | GET/POST/DELETE /api/cart |
| **OrderController** | User order operations | GET/POST /api/orders |
| **AdminOrderController** | Order management (admin only) | GET/PUT /api/admin/orders |
| **PaymentController** | Payment processing with Razorpay | POST /api/payment/create, /api/payment/verify |
| **ReviewController** | Product review management | GET/POST /api/reviews |
| **WishlistController** | Wishlist operations | GET/POST/DELETE /api/wishlist |
| **ProfileController** | Profile-related endpoints | GET/PUT /api/profile |

### 3. Entity Models (Database Tables)

| Model | Purpose | Key Attributes |
|-------|---------|-----------------|
| **User** | Represents a customer/user | id, username, email, password, firstName, lastName, phone, address |
| **Product** | Product in the catalog | id, name, description, price, stock, category, image, rating |
| **Category** | Product category | id, name, description |
| **Cart** | Shopping cart | id, user, cartItems, totalPrice |
| **CartItem** | Items in cart | id, cart, product, quantity, price |
| **OrderTable** | Customer orders | id, user, orderItems, totalPrice, orderStatus, createdAt |
| **OrderItem** | Individual order items | id, order, product, quantity, price |
| **OrderStatus** | Order status tracking | id, order, status, timestamp |
| **Review** | Product reviews | id, product, user, rating, comment, createdAt |
| **Wishlist** | User's wishlist | id, user, products |

### 4. Service Layer (Business Logic)

Services contain the core business logic for each domain:

- **AuthService** - User registration, login, JWT token generation
- **UserService** - User profile management, data retrieval
- **ProductService** - Product retrieval, search, filtering
- **CategoryService** - Category management
- **CartService** - Cart operations (add, remove, update items)
- **OrderService** - Order creation, status tracking, history
- **PaymentService** - Razorpay integration for payment processing
- **ReviewService** - Create, retrieve product reviews
- **WishlistService** - Wishlist management

### 5. Repository Layer (Data Access)

JPA Repositories for direct database operations:

- **UserRepository** - CRUD operations for User entity
- **ProductRepository** - CRUD + custom queries for Products
- **CategoryRepository** - CRUD for Categories
- **CartRepository** - Cart persistence
- **CartItemRepository** - Cart items persistence
- **OrderRepository** - Order persistence and queries
- **OrderItemRepository** - Order items persistence
- **ReviewRepository** - Review persistence
- **WishlistRepository** - Wishlist persistence

---

## 🗄️ Database Schema

**Database Name:** `shopping_app`
**Database Engine:** MySQL 5.7+
**Connection:** `jdbc:mysql://localhost:3306/shopping_app`

### Entity Relationships

```
User (1) ──── (many) Orders
User (1) ──── (many) Reviews
User (1) ──── (1) Cart
User (1) ──── (1) Wishlist

Cart (1) ──── (many) CartItems
CartItems (many) ──── (1) Product

Product (1) ──── (many) Reviews
Product (1) ──── (many) OrderItems
Product (1) ──── (many) CartItems

Category (1) ──── (many) Products

Order (1) ──── (many) OrderItems
OrderItems (many) ──── (1) Product
```

### Key Tables

**users** - Customer and admin user accounts
```
id (PK), username, email, password, firstName, lastName, phone, address, role, createdAt
```

**products** - Product inventory
```
id (PK), name, description, price, stock, categoryId (FK), imageUrl, rating, createdAt
```

**categories** - Product categories
```
id (PK), name, description, createdAt
```

**orders** - Customer orders
```
id (PK), userId (FK), totalPrice, status, createdAt, updatedAt
```

**order_items** - Line items in orders
```
id (PK), orderId (FK), productId (FK), quantity, price
```

**cart** - Shopping cart
```
id (PK), userId (FK), totalPrice, createdAt, updatedAt
```

**cart_items** - Items in shopping cart
```
id (PK), cartId (FK), productId (FK), quantity, price
```

**reviews** - Product reviews
```
id (PK), productId (FK), userId (FK), rating (1-5), comment, createdAt
```

**wishlist** - User wishlists
```
id (PK), userId (FK), createdAt
```

---

## 🔌 API Endpoints

### Authentication APIs

```
POST /api/auth/login
  - Body: { username, password }
  - Response: { token, user }

POST /api/auth/register
  - Body: { username, email, password, firstName, lastName }
  - Response: { success, message }
```

### User APIs

```
GET /api/users/profile
  - Headers: Authorization: Bearer {token}
  - Response: { user details }

PUT /api/users/profile
  - Headers: Authorization: Bearer {token}
  - Body: { updated user data }
  - Response: { updated user }
```

### Product APIs

```
GET /api/products
  - Query: page, size, search, categoryId
  - Response: [products array]

GET /api/products/{id}
  - Response: { product details with reviews }
```

### Category APIs

```
GET /api/categories
  - Response: [categories array]
```

### Cart APIs

```
GET /api/cart
  - Headers: Authorization: Bearer {token}
  - Response: { cart items and total }

POST /api/cart/add
  - Headers: Authorization: Bearer {token}
  - Body: { productId, quantity }
  - Response: { updated cart }

DELETE /api/cart/remove/{productId}
  - Headers: Authorization: Bearer {token}
  - Response: { success message }
```

### Order APIs

```
POST /api/orders
  - Headers: Authorization: Bearer {token}
  - Body: { cart items, shipping address }
  - Response: { order details with orderId }

GET /api/orders
  - Headers: Authorization: Bearer {token}
  - Response: [user's orders]

GET /api/orders/{orderId}
  - Headers: Authorization: Bearer {token}
  - Response: { order details with items }
```

### Payment APIs

```
POST /api/payment/create
  - Body: { amount, currency, receipt }
  - Response: { razorpay_order_id }

POST /api/payment/verify
  - Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
  - Response: { success, paymentId }
```

### Admin APIs

```
GET /api/admin/orders
  - Headers: Authorization: Bearer {token}
  - Response: [all orders]

PUT /api/admin/orders/{orderId}
  - Headers: Authorization: Bearer {token}
  - Body: { status }
  - Response: { updated order }

POST /api/admin/products
  - Headers: Authorization: Bearer {token}
  - Body: { product data }
  - Response: { created product }

PUT /api/admin/products/{id}
  - Headers: Authorization: Bearer {token}
  - Body: { updated product data }
  - Response: { updated product }

DELETE /api/admin/products/{id}
  - Headers: Authorization: Bearer {token}
  - Response: { success message }
```

### Review APIs

```
GET /api/reviews?productId={id}
  - Response: [reviews for product]

POST /api/reviews
  - Headers: Authorization: Bearer {token}
  - Body: { productId, rating, comment }
  - Response: { created review }
```

### Wishlist APIs

```
GET /api/wishlist
  - Headers: Authorization: Bearer {token}
  - Response: [wishlist items]

POST /api/wishlist/add
  - Headers: Authorization: Bearer {token}
  - Body: { productId }
  - Response: { updated wishlist }

DELETE /api/wishlist/remove/{productId}
  - Headers: Authorization: Bearer {token}
  - Response: { success message }
```

---

## ✨ Key Features

### 🛍️ Customer Features
1. **User Authentication**
   - Registration with email validation
   - Login with JWT token-based authentication
   - Password security with hashing

2. **Product Browsing**
   - View all products with pagination
   - Filter by category
   - Search products by name/keywords
   - View detailed product information
   - Product ratings and reviews

3. **Shopping Cart**
   - Add/remove products from cart
   - Update item quantities
   - View cart total and item count
   - Persistent cart (server-side storage)

4. **Checkout & Payment**
   - Secure checkout process
   - Multiple payment method support (via Razorpay)
   - Order confirmation and receipt
   - Razorpay payment gateway integration

5. **Order Management**
   - View current orders
   - Track order status
   - View order history
   - Download receipts
   - Cancel orders (if allowed)

6. **User Profile**
   - View and edit personal information
   - Manage delivery addresses
   - View order history
   - Account settings

7. **Wishlist**
   - Add products to wishlist
   - Remove from wishlist
   - View all wishlist items
   - Move wishlist items to cart

8. **Product Reviews**
   - Leave ratings and reviews
   - View other users' reviews
   - Display average product rating

### 👨‍💼 Admin Features
1. **Admin Authentication**
   - Separate admin registration and login
   - Role-based access control

2. **Dashboard**
   - View business metrics
   - Quick access to key operations
   - Summary statistics

3. **Product Management**
   - Add new products
   - Edit product details
   - Delete products
   - Upload product images (via Cloudinary)
   - Manage product inventory

4. **Category Management**
   - Create categories
   - Edit category information
   - Delete categories
   - Organize products by category

5. **Order Management**
   - View all customer orders
   - Update order status
   - Track order fulfillment
   - Generate order reports

6. **Profile Management**
   - Edit admin profile
   - Change password
   - Manage admin settings

---

## 🔒 Security Implementation

### 1. Authentication
- **JWT (JSON Web Tokens)** for stateless authentication
- Token issued on login/registration
- Token validation on protected routes
- Token stored in browser localStorage

### 2. Authorization
- **Spring Security** for backend authorization
- Role-based access control (User vs Admin)
- Protected routes for admin-only operations
- Frontend route guards for user/admin pages

### 3. Password Security
- Spring Security's BCrypt for password hashing
- Never store plain text passwords
- Password validation on registration

### 4. CORS (Cross-Origin Resource Sharing)
- Configured to allow requests from React frontend
- Prevents unauthorized cross-origin requests

### 5. API Security
- Bearer token validation on protected endpoints
- Request validation and sanitization
- Exception handling to prevent information leakage

### 6. Data Protection
- Sensitive data (passwords) encrypted
- HTTPS recommended for production
- Database credentials in environment variables

---

## 🚀 Setup & Deployment

### Frontend Setup

**Prerequisites:**
- Node.js 16+ and npm

**Installation:**
```bash
cd Reactfront/ecommerce-frontend
npm install
```

**Development Server:**
```bash
npm run dev
# Runs on http://localhost:5173
```

**Build for Production:**
```bash
npm run build
# Output in dist/ folder
```

**Linting:**
```bash
npm run lint
```

### Backend Setup

**Prerequisites:**
- Java 17+
- Maven 3.8+
- MySQL 5.7+

**Configuration:**
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/shopping_app  
spring.datasource.username=root
spring.datasource.password=root@123
server.port=8080

razorpay.key_id=your_razorpay_key
razorpay.key_secret=your_razorpay_secret
```

**Installation:**
```bash
cd springboot/demo/demo
mvn clean install
```

**Run Application:**
```bash
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

**Build for Production:**
```bash
mvn clean package -DskipTests
# Creates JAR file in target/ directory
```

### Database Setup

**Create Database:**
```sql
CREATE DATABASE shopping_app;
USE shopping_app;
```

**Tables Auto-Created:**
- Hibernate with `ddl-auto=update` automatically creates/updates tables on startup
- Ensure MySQL server is running before starting backend

### External Services Configuration

**Razorpay (Payment Gateway):**
1. Sign up at razorpay.com
2. Get API credentials (Key ID and Secret)
3. Update in `application.properties`

**Cloudinary (Image Hosting):**
1. Sign up at cloudinary.com
2. Get API credentials
3. Configure in backend (if not already)

---

## 📁 Complete Project Structure

```
d:\ecommerce\
├── Reactfront/
│   └── ecommerce-frontend/              # React Frontend
│       ├── src/
│       │   ├── App.jsx                 # Main app component
│       │   ├── main.jsx               # React entry point
│       │   ├── components/            # Reusable components
│       │   │   ├── AdminLayout.jsx
│       │   │   ├── AdminNavbar.jsx
│       │   │   ├── AdminRoute.jsx
│       │   │   ├── Navbar.jsx
│       │   │   ├── ProtectedRoute.jsx
│       │   │   ├── ProductReviews.jsx
│       │   │   └── StarRating.jsx
│       │   ├── context/               # State management
│       │   │   └── CartContext.jsx
│       │   ├── pages/                 # Page components
│       │   │   ├── admin/             # Admin pages
│       │   │   │   ├── AdminCategories.jsx
│       │   │   │   ├── AdminDashboard.jsx
│       │   │   │   ├── AdminLogin.jsx
│       │   │   │   ├── AdminOrders.jsx
│       │   │   │   ├── AdminProducts.jsx
│       │   │   │   ├── AdminProfile.jsx
│       │   │   │   └── AdminRegister.jsx
│       │   │   ├── user/              # User auth pages
│       │   │   │   ├── UserLogin.jsx
│       │   │   │   └── UserRegister.jsx
│       │   │   ├── Cart.jsx
│       │   │   ├── Category.jsx
│       │   │   ├── Checkout.jsx
│       │   │   ├── Home.jsx
│       │   │   ├── OrderDetails.jsx
│       │   │   ├── OrderHistory.jsx
│       │   │   ├── Orders.jsx
│       │   │   ├── ProductList.jsx
│       │   │   ├── Profile.jsx
│       │   │   ├── RegisterChoice.jsx
│       │   │   ├── Welcome.jsx
│       │   │   └── Wishlist.jsx
│       │   ├── routes/               # Route definitions
│       │   ├── services/             # API services
│       │   │   ├── adminService.js
│       │   │   ├── api.js
│       │   │   ├── authService.js
│       │   │   ├── cartService.js
│       │   │   ├── categoryService.js
│       │   │   ├── orderService.js
│       │   │   ├── productService.js
│       │   │   ├── reviewService.js
│       │   │   ├── userService.js
│       │   │   └── wishlistService.js
│       │   ├── utils/                # Utility functions
│       │   │   ├── auth.js
│       │   │   └── wishlist.js
│       │   └── assets/               # Static files
│       ├── package.json              # Dependencies
│       ├── vite.config.js            # Vite configuration
│       ├── eslint.config.js          # ESLint rules
│       ├── vercel.json               # Vercel deployment config
│       └── index.html                # HTML entry point
│
├── springboot/
│   └── demo/
│       └── demo/                      # Spring Boot Backend
│           ├── src/
│           │   ├── main/
│           │   │   ├── java/com/example/demo/
│           │   │   │   ├── DemoApplication.java
│           │   │   │   ├── config/              # Configuration classes
│           │   │   │   ├── controller/         # REST Controllers
│           │   │   │   │   ├── AdminCategoryController.java
│           │   │   │   │   ├── AdminOrderController.java
│           │   │   │   │   ├── AdminProductController.java
│           │   │   │   │   ├── AdminProfileController.java
│           │   │   │   │   ├── AuthController.java
│           │   │   │   │   ├── CartController.java
│           │   │   │   │   ├── CategoryController.java
│           │   │   │   │   ├── OrderController.java
│           │   │   │   │   ├── PaymentController.java
│           │   │   │   │   ├── ProductController.java
│           │   │   │   │   ├── ProfileController.java
│           │   │   │   │   ├── ReviewController.java
│           │   │   │   │   ├── UserController.java
│           │   │   │   │   └── WishlistController.java
│           │   │   │   ├── dto/                 # Data Transfer Objects
│           │   │   │   ├── exception/          # Custom Exceptions
│           │   │   │   ├── model/              # Entity Classes
│           │   │   │   │   ├── CartItem.java
│           │   │   │   │   ├── Category.java
│           │   │   │   │   ├── OrderItem.java
│           │   │   │   │   ├── OrderStatus.java
│           │   │   │   │   ├── OrderTable.java
│           │   │   │   │   ├── Product.java
│           │   │   │   │   ├── Review.java
│           │   │   │   │   ├── User.java
│           │   │   │   │   └── Wishlist.java
│           │   │   │   ├── repository/        # JPA Repositories
│           │   │   │   └── service/           # Service Classes
│           │   │   └── resources/
│           │   │       ├── application.properties
│           │   │       └── uploads/           # File storage
│           │   └── test/                      # Test files
│           ├── pom.xml                        # Maven dependencies
│           ├── mvnw & mvnw.cmd               # Maven wrapper
│           └── target/                        # Build output
│
└── mingit/                                     # Git binaries

```

---

## 🔄 Data Flow Examples

### User Registration & Login Flow
```
1. User enters credentials on RegisterChoice page
2. Frontend sends POST to /api/auth/register (Backend)
3. Backend validates, hashes password, stores in User table
4. Backend returns JWT token
5. Frontend stores token in localStorage
6. User redirected to dashboard
7. All subsequent requests include Authorization header with token
```

### Product Purchase Flow
```
1. User browses products on Home/Category/Search
2. User clicks "Add to Cart"
3. Frontend calls POST /api/cart/add with productId
4. Backend adds CartItem to Cart table
5. Cart total updated
6. User clicks "Checkout"
7. Frontend displays order review
8. User completes payment via Razorpay
9. Backend verifies payment signature
10. Backend creates Order with OrderItems
11. Cart cleared, Order status set to "CONFIRMED"
12. Email confirmation sent to user
13. User can track order from Order History
```

### Admin Product Management Flow
```
1. Admin logs in with separate admin credentials
2. Admin navigates to AdminProducts page
3. Admin creates/edits product details
4. Frontend sends POST/PUT to /api/admin/products
5. Backend validates and updates Product table
6. Image uploaded to Cloudinary, URL stored
7. Product appears in customer store
8. Admin can update inventory, price, description
```

---

## 📊 Performance Considerations

### Frontend Optimization
- **Vite** for fast development and production builds
- Code splitting for lazy loading
- React Router for client-side navigation (no full page reloads)

### Backend Optimization
- **Spring Data JPA** with query optimization
- Pagination for product/order lists
- Caching strategies for frequently accessed data
- Index on frequently queried columns (userId, productId, etc.)

### Database Optimization
- Primary keys on all tables
- Foreign keys for referential integrity
- Indexes on searchable columns
- Query optimization through JPA

---

## 🧪 Testing

### Frontend Testing
- ESLint for code quality
- Manual testing in Vite dev server
- Browser console for debugging

### Backend Testing
- JUnit for unit tests
- Spring Test for integration tests
- Security tests with Spring Security Test

---

## 📝 Additional Configuration Files

### Frontend
- **eslint.config.js** - Linting rules
- **vite.config.js** - Build tool configuration
- **vercel.json** - Vercel deployment settings
- **package.json** - Dependencies and scripts

### Backend
- **pom.xml** - Maven dependencies and build config
- **application.properties** - Spring Boot configuration

---

## 🔧 Common Development Tasks

### Adding a New Product Feature
1. Create model in backend
2. Create repository and service
3. Create controller endpoint
4. Create React component
5. Create API service
6. Add route in React Router

### Adding Authentication to New Page
1. Use `ProtectedRoute` wrapper for users
2. Use `AdminRoute` wrapper for admins
3. Include Authorization header in API calls

### Debugging
- Frontend: Browser DevTools (Network, Console)
- Backend: Application logs in terminal
- Database: MySQL client or workbench

---

## 📞 Support & Documentation

For any clarifications:
- React Documentation: https://react.dev
- Spring Boot Documentation: https://spring.io/projects/spring-boot
- JWT Documentation: https://jwt.io
- Razorpay API: https://razorpay.com/docs

---

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack web application development
- REST API design and implementation
- Database design and relationships
- Authentication and authorization
- Payment gateway integration
- React hooks and Context API
- Spring Boot microservices architecture
- React Router navigation
- Form handling and validation
- Error handling and exceptions
- Image hosting and management

---

**Project Last Updated:** June 29, 2026
**Status:** Production-Ready
**Complexity:** Advanced
**Team Size:** Full-stack team recommended

