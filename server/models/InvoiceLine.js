const { default: mongoose } = require("mongoose");

// Schema for Line Items 
const InvoiceLineSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    lineTotal: {
        type: Number,
        required: true
    } // calculated as quantity * unitPrice 
});
module.exports = InvoiceLineSchema;