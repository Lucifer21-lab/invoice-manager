require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const invoiceRoutes = require('./routes/Invoices');

// Initialize App
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Mount Routes
app.use('/api/invoices', invoiceRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));