# 📄Invoice Manager

A high-performance **MERN Stack** invoice management application featuring automated tax logic, multi-currency support, professional PDF generation, and high-end **Framer Motion** animations.

## 🚀 Key Features

* **Intelligent Invoice Engine**: 
    * **Auto-generated** read-only Invoice Numbers to prevent manual errors.
    * **Locked Issue Date**: Automatically set to the current date and non-editable.
    * **Smart Validation**: Due Date must be at least one day after the current date.
* **Tax & Multi-Currency**: Real-time tax calculation and global currency support ($, ₹, €, £) with country icons.
* **Advanced UI**: Staggered entrance animations and spring-physics modals using **Framer Motion**.
* **Professional PDF Export**: High-quality, downloadable PDF invoices using `html2pdf.js`.
* **Overdue Tracking**: Automatic visual alerts and red-row highlighting for late payments.

---

## 🛠️ Tech Stack

**Frontend:**
* React.js
* Tailwind CSS (Styling)
* Framer Motion (Animations)
* Axios (API Requests)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (Database)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone [https://github.com/Lucifer-Lab/invoice-manager.git]
cd invoice-manager

**Backend:**
1. Create dotenv file with PORT and MONGO_URI as 5000 and your own mongodb url
2. cd server
3. npm install
4. npm run dev or node server.js

**Frontend:**
1. cd client
2. npm install
3. npm run dev

** Folder Structure: **

pro-invoice-manager/
├── backend/
│   ├── controllers/    # Auth, Tax, and Invoice logic
│   ├── models/         # User and Invoice Mongoose schemas
│   ├── routes/         # Express API endpoints
│   └── middleware/     # JWT & Route protection
└── client/
    ├── src/
    │   ├── components/ # Animated UI (Modal, Summary, Table)
    │   ├── pages/      # Dashboard, Login, Register, Reset Password
    │   └── utils/      # Currency Map and Global constants