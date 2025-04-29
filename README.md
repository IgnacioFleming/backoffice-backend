# 📈 Business Manager - Backend

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![License](https://img.shields.io/badge/license-ISC-blue)](#)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](#)
[![MySQL](https://img.shields.io/badge/Database-MySQL-blue)](#)

Welcome to the **Business Manager API**, the backend service for managing products, clients, and sales operations. Built with Node.js and Express, connected to a MySQL database, and designed for scalability and security.

---

## 📊 Technologies Used

- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Authentication**: Passport.js (JWT + Local Strategy)
- **File Storage**: Cloudinary + Multer
- **Environment Configuration**: dotenv
- **Email Service**: Nodemailer
- **Session Management**: express-session + express-mysql-session
- **Data Validation**: Zod
- **Testing**: Jest + Supertest
- **Utilities**: cookie-parser, cors, bcrypt

---

## 🚀 Key Features

- Secure authentication system (local login + JWT tokens).
- User sessions stored in MySQL.
- File upload to Cloudinary.
- CRUD operations for products, clients, and sales.
- Email notifications via Nodemailer.
- Environment-specific configuration (development and production).
- Modular and scalable project structure.
- Comprehensive testing suite with Jest and Supertest.

---

## ⚙️ How to Run Locally

1. **Clone the repository:**

```bash
git clone https://github.com/IgnacioFleming/business-manager-backend.git
cd business-manager-backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create a `.env` file** based on `.env.develop`, and set your environment variables (MySQL database credentials, Cloudinary keys, JWT secret, etc.).

4. **Run the server in development mode:**

```bash
npm run dev
```

Server will start on `http://localhost:3000` by default.

## 📂 Project Structure

```bash
src/
├── config/          # Database, Passport, Cloudinary configurations
├── controllers/     # Business logic for each entity
├── middlewares/     # Custom Express middlewares
├── models/          # Database models
├── routes/          # API routes
├── utils/           # Utility functions
└── app.js           # Main application entry point
```

## 🛡️ API Endpoints Overview

| Method |    Endpoint     |     Description      |
| :----: | :-------------: | :------------------: |
|  POST  |  `/api/login`   |      User login      |
|  POST  | `/api/register` |  Register new admin  |
|  GET   | `/api/products` |   Get all products   |
|  POST  | `/api/products` | Create a new product |
|  GET   | `/api/clients`  |   Get all clients    |
|  POST  | `/api/clients`  | Create a new client  |
|  GET   |  `/api/sales`   |    Get all sales     |
|  POST  |  `/api/sales`   | Register a new sale  |

(Authentication required for most routes)

## 👨‍💻 Author

Developed by Ignacio Fleming
