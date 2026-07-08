# 🧼 Lather & Leaf — Organic Soap E-Commerce Store

Lather & Leaf is a modern, premium e-commerce web application specializing in handmade organic soaps. It is a full-stack MERN web application equipped with dynamic scroll animations, product inventory management, order processing, and custom image file uploads.

---

## 🚀 Tech Stack

- **Frontend**: React (Vite), Vanilla CSS, Lucide Icons, ScrollReveal transitions.
- **Backend**: Node.js, Express.js, Multer (local image storage).
- **Database**: MongoDB (Mongoose ODM).

---

## ✨ Features

- **Storefront**: Browse categoric organic soap bars (Neem, Rose Milk, Sandalwood, Mint, Turmeric) with beautiful staggered entrance animations.
- **Cart & Checkout**: Interactive side drawer cart, local cart caching, and structured shipping/delivery fields.
- **Customer Account**: Profile tracking, shipping logs, and order history status check.
- **Admin Panel**:
  - Track total sales revenue, order counts, and review sentiments.
  - Modify order statuses (Processing, Shipped, Delivered, Cancelled).
  - **Product CRUD**: Add new soaps, edit details, delete soaps, or mark them out-of-stock.
  - **Direct Image Uploads**: Select an image file from your computer and upload it directly to the server.

---

## 🛠️ How to Run Locally

### Prerequisites
Make sure you have the following installed on your computer:
1. **Node.js** (v18 or higher recommended)
2. **MongoDB** (running locally on port `27017`)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/KISHANN16/lather-and-leaf.git
cd lather-and-leaf
```

---

### Step 2: Setup the Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and populate it:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://127.0.0.1:27017/lather-leaf
   JWT_SECRET=latherleafsecretkey12345
   NODE_ENV=development
   ```
4. **Seed the database** (this registers the default products and admin user):
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5001`.*

---

### Step 3: Setup the Frontend

1. Open a new terminal window, navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Check the API URL target inside `frontend/src/config.js` to ensure it points to the backend address:
   ```javascript
   export const API_URL = 'http://localhost:5001';
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## 🔒 Admin Credentials

Admin credentials are created during the database seeding process. You can check or configure the default admin credentials inside the database seeding script at `backend/data/seed.js`.

