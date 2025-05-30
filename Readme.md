# 🛠️ ProductHunt Clone - Backend

An Express.js-powered backend for a **ProductHunt-like platform**, built with robust features like authentication, product submission, comment system, image uploads, and more.

---

## 🚀 Tech Stack

| Technology | Purpose                  |
|------------|---------------------------|
| **Node.js** | Server runtime            |
| **Express.js** | REST API framework     |
| **MongoDB** | Database                  |
| **Mongoose** | ODM for MongoDB          |
| **Cloudinary** | Image hosting           |
| **Multer** | File upload middleware     |
| **JWT** | Authentication               |
| **Netlify** | Deployed frontend         |
| **GitHub** | Code hosting               |

---

## 🌐 Deployed Frontend

🔗 **Frontend on Netlify:** [https://your-frontend-link.netlify.app](https://your-frontend-link.netlify.app)

---

## 🔐 Authentication APIs (User)

| Method | Endpoint              | Description           |
|--------|------------------------|-----------------------|
| POST   | `/api/v1/user/register` | Register a new user   |
| POST   | `/api/v1/user/login`    | Login existing user   |
| POST   | `/api/v1/user/logout`   | Logout user (JWT)     |
| GET    | `/api/v1/user/profile`  | Get current user info |
| PATCH  | `/api/v1/user/update-profile` | Update user profile (auth required) |

---

## 📦 Product APIs

| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| POST   | `/api/v1/product/create`  | Submit new product (auth) |
| PATCH  | `/api/v1/product/:id`     | Update product (auth)     |
| DELETE | `/api/v1/product/:id`     | Delete product (auth)     |
| PATCH  | `/api/v1/product/:id/upvote` | Upvote product (auth)  |
| PATCH  | `/api/v1/product/:id/downvote` | Downvote product (auth) |
| GET    | `/api/v1/product/`        | Get all products          |
| GET    | `/api/v1/product/:id`     | Get single product        |

---

## 💬 Comment APIs

| Method | Endpoint                      | Description                |
|--------|-------------------------------|----------------------------|
| POST   | `/api/v1/comment/create`      | Create a comment (auth)    |
| PATCH  | `/api/v1/comment/:id`         | Update a comment (auth)    |
| POST   | `/api/v1/comment/:id/reply`   | Reply to a comment (auth)  |
| DELETE | `/api/v1/comment/:id`         | Delete a comment (auth)    |
| GET    | `/api/v1/comment/:productId`  | Get all comments on product|

---

## 📁 Image Uploads

- Users can upload profile pictures via `Multer` → stored on **Cloudinary**.
- Products can include a logo during creation → also stored on **Cloudinary**.
- Files are processed in-memory using `multer.memoryStorage()` and streamed to Cloudinary.

---

## 📂 Project Structure

