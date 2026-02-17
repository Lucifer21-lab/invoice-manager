const mongoose = require('mongoose');
const InvoiceLineSchema = require('./InvoiceLine');
const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    customerName: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['DRAFT', 'PAID'],
        default: 'DRAFT'
    },
    total: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        default: 0
    },
    balanceDue: {
        type: Number,
        required: true
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    lineItems: [InvoiceLineSchema], // Embedding lines for simpler retrieval
    payments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    }],
    currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'INR', 'EUR', 'GBP']
    }
});

const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = Invoice;