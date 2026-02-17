const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');

const checkOverdue = (invoice) => {
    const today = new Date();
    const dueDate = new Date(invoice.dueDate);

    // An invoice is overdue if today > due date AND it is not PAID
    return today > dueDate && invoice.status !== 'PAID';
};

// Get all invoices
exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });

        // Map through and attach overdue flag dynamically
        const updatedInvoices = invoices.map(inv => {
            const invoiceObj = inv.toObject();
            invoiceObj.isOverdue = checkOverdue(inv);
            return invoiceObj;
        });

        res.json(updatedInvoices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// create invoice
exports.createInvoice = async (req, res) => {
    const {
        invoiceNumber, customerName, issueDate, dueDate,
        lineItems, currency, taxRate
    } = req.body;

    try {
        // 1. Calculate Subtotal
        const subtotal = lineItems.reduce((acc, item) => {
            return acc + (Number(item.quantity) * Number(item.unitPrice));
        }, 0);

        // 2. Calculate Tax Logic
        const taxPercent = Number(taxRate) || 0;
        const taxAmount = (subtotal * taxPercent) / 100;
        const total = subtotal + taxAmount;

        const invoice = new Invoice({
            invoiceNumber,
            customerName,
            issueDate,
            dueDate,
            currency,
            taxRate: taxPercent,
            taxAmount,
            subtotal,
            total,
            balanceDue: total,
            lineItems: lineItems.map(item => ({
                ...item,
                lineTotal: item.quantity * item.unitPrice
            }))
        });

        const savedInvoice = await invoice.save();
        res.status(201).json(savedInvoice);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get single invoice with payments
exports.getInvoiceById = async (req, res) => {
    try {
        //Return Invoice details, Line items, Payments, total, amountpaid, balanceDue
        const invoice = await Invoice.findById(req.params.id).populate('payments');
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a payment
exports.addPayment = async (req, res) => {
    const { amount } = req.body;
    const invoiceId = req.params.id;

    try {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than 0' });
        }

        if (amount > invoice.balanceDue) {
            return res.status(400).json({ message: 'Amount exceeds balance due' });
        }

        // Create Payment
        const payment = new Payment({ invoiceId, amount });
        await payment.save();

        // Update Invoice
        invoice.payments.push(payment._id);
        invoice.amountPaid += amount;
        invoice.balanceDue = invoice.total - invoice.amountPaid;

        if (invoice.balanceDue === 0) {
            invoice.status = 'PAID';
        }

        await invoice.save();
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Archive or Restore invoice
exports.archiveInvoice = async (req, res) => {
    const { id, isArchived } = req.body;
    try {

        const invoice = await Invoice.findByIdAndUpdate(
            id,
            { isArchived: isArchived },
            { new: true }
        );
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        // 1. Delete associated payments first
        await Payment.deleteMany({ invoiceId: invoice._id });

        // 2. Delete the invoice itself
        await Invoice.findByIdAndDelete(req.params.id);

        res.json({ message: 'Invoice removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
