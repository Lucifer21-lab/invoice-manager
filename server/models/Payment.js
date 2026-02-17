const mongoose = require("mongoose");
const Invoice = require('./Invoice');

// Schema for Payments 
const PaymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice'
    }
});

const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;