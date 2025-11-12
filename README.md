# Product Management App

A simple Node.js + Express + PostgreSQL application to manage products. The app provides a REST API for adding, listing, and searching products, along with a simple frontend interface.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Frontend](#frontend)
- [Docker](#docker)
- [Git Ignore](#git-ignore)

---

## Features

- Add products with name, description, and price
- List all products
- Search products by name or description
- Simple frontend for managing products

---

## Tech Stack

- Node.js 18
- Express.js
- PostgreSQL
- Fetch API (frontend)
- Docker (optional)
- Render or any hosting service

---

## Setup

1. Clone the repository:

```bash
git clone <repo_url>
cd <repo_name>

để kết nối với postgreSQL thì trong file .env ta cấu hình như dưới và lên railway.com để tạo một cái postgreSQL sau khi tạo xong thì vào mục variables để lấy DATABASE_PUBLIC_URL cho file .env và thay thế vào phần DATABASE_URL.
    PORT=3000
    DATABASE_URL=postgresql://username:password@host:port/dbname
    NODE_ENV=development
về phần deploy lên render tạo dockerfile sau đó đẩy code lên github dockerfile sẽ hỗ trợ deploy trên render tiếp theo tạo một tài khoản render sau đó ấn new chọn web service tiếp theo liên kết với github và chọn vào Repositories dự án và tiếp theo ấn deploy web