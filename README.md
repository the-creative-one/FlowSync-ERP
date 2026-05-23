# FlowSync ERP

A modern full-stack ERP (Enterprise Resource Planning) system built using the MERN stack with Role-Based Access Control (RBAC), employee management, analytics permissions, responsive dashboard UI, and secure authentication workflows.

---

# 🚀 Tech Stack

## Frontend

* React
* React Router DOM
* Axios
* Tailwind CSS
* Vite
* Lucide React
* React Hot Toast

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

---

# ✨ Features Implemented

## Authentication & Security

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Role-Based Authorization (RBAC)
* Permission-Based Access Control
* Secure Password Hashing
* Auth Context Management

---

# 👥 Role-Based Access System

## Roles

* Admin
* Manager
* Operations
* Analyst
* Employee

## Admin Access

* Full system access
* Manage all employees
* Assign all roles
* Grant/revoke permissions
* Settings access
* Full analytics access
* Delete orders
* Export reports

## Manager Access

* Manage Operations / Analyst / Employee roles
* Update employee permissions
* Create / Update / Delete orders
* Export analytics reports
* Advanced analytics access
* Cannot assign Admin/Manager roles
* Cannot grant Settings access

## Operations Access

* Create Orders
* Update Orders
* Limited dashboard access
* Order workflow handling

## Analyst Access

* Analytics viewing
* Report exports
* Sales insights access

## Employee Access

* Dashboard access
* Orders viewing access
* Limited operational visibility

---

# 📦 Orders Module

## Features

* Create Orders
* Fetch Orders
* Update Order Status
* Delete Orders
* Permission-Based Order Controls
* Dynamic Status Workflow
* Interactive Status Dropdown
* Responsive Orders Table
* Mobile Orders Cards

## Order Status Flow

* Pending
* Processing
* Shipped
* Delivered

---

# 📊 Dashboard & Analytics

## Dashboard Features

* Total Orders
* Pending Orders
* Delivered Orders
* Revenue Analytics
* Dynamic Dashboard Cards

## Analytics Features

* Role-Based Analytics Access
* Advanced Analytics Permissions
* Export Reports Access
* CSV Export Planning
* Sales Insights

---

# 👨‍💼 Employee Management System

## Features

* Employee Listing
* Role Assignment
* Permission Management
* Dynamic Role Dropdowns
* Manager Restrictions
* Admin Restrictions
* Responsive Employee Management UI

## Permissions System

* Create Orders
* Update Orders
* Delete Orders
* View Advanced Analytics
* Export Reports
* Access Settings
* Manage Employees

---

# 🎨 Frontend Features

## UI/UX

* Modern ERP UI Design
* Fully Responsive Layout
* Mobile Drawer Sidebar
* Collapsible Sidebar
* Sticky Sidebar Layout
* Responsive Tables & Cards
* Interactive Dropdowns
* Animated Buttons & Transitions
* Toast Notifications
* Dynamic Layout System

## Pages

* Login Page
* Register Page
* Dashboard
* Orders Management
* Employee Management
* Analytics
* Settings

---

# 📱 Responsive Design

* Mobile Responsive Layout
* Tablet Responsive UI
* Desktop Optimized Dashboard
* Adaptive Orders View
* Adaptive Employee Cards
* Responsive Sidebar Navigation
* Mobile Overlay Navigation
* Dynamic Dropdown Positioning

---

# 📁 Project Structure

## Client

```bash
client/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── App.jsx
│   └── main.jsx
```

## Server

```bash
server/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── server.js
```

---

# ⚙️ Environment Variables

Create a `.env` file inside `server/`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

# ▶️ Run Project

## Frontend

```bash
cd client
npm install
npm run dev
```

## Backend

```bash
cd server
npm install
npm run dev
```

---

# 🔐 Protected Routes

## Frontend Protected Routes

* Dashboard
* Orders
* Analytics
* Employees
* Settings

## Backend Protected APIs

* JWT Middleware Protection
* Permission-Based APIs
* Admin/Manager Middleware
* Role Validation

---

# 🧠 Future Plans

* Inventory Management
* Vendor Management
* Profile Management
* Task Assignment System
* Access Request Workflow
* Email Verification with OTP
* Real-Time Notifications
* Advanced Charts & Analytics
* AI Assistant Integration
* CSV & Excel Export System
* WebSocket Real-Time Updates
* Dark / Light Theme
* Audit Logs
* CI/CD Pipeline
* Cloud Deployment

---

# 👨‍💻 Developer

Built by Shruti Dubey
