const express = require('express');
const router = express.Router();
const {
    getInvoices,
    getInvoiceById,
    addPayment,
    archiveInvoice,
    createInvoice,
    deleteInvoice
} = require('../controllers/invoiceControllers');

// Define routes
router.get('/', getInvoices);
router.post('/', createInvoice);
router.get('/:id', getInvoiceById);
router.post('/:id/payments', addPayment);
router.post('/archive', archiveInvoice);
router.delete('/:id', deleteInvoice);

module.exports = router;