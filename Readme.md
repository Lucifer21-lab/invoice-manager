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
git clone https://github.com/Lucifer21-lab/invoice-manager
cd invoice-manager
cd server
npm install
node server.js
cd ../client
npm install
npm run dev

```
### 2. Backend
1. Create .env file with 
```bash
PORT=5000 
MONGO_URI=your-mongodb-url
```


## ** Folder Structure: **

pro-invoice-manager/
├── backend/
│   ├── controllers/    # Tax, and Invoice logic
│   ├── models/         # Invoice and Payment Mongoose schemas
│   ├── routes/         # Express API endpoints
└── client/
    ├── src/
    │   ├── components/ # Animated UI (Modal, Summary, Table)
    │   ├── pages/      # Home, Invoice and Create Invoice
    │   └── utils/      # Currency Map and Global constants