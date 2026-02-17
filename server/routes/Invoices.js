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
router.get('/:id', getInvoiceById); // get indiviual invoice details
router.post('/:id/payments', addPayment); // add payment
router.post('/archive', archiveInvoice); // archieve invoice
router.delete('/:id', deleteInvoice);

module.exports = router;