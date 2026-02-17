import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { motion } from 'framer-motion';
import { CURRENCY_MAP } from '../utils/currencies';

import InvoiceHeader from '../components/InvoiceHeader';
import LineItemsTable from '../components/LineItemsTable';
import PaymentHistory from '../components/PaymentHistory';
import InvoiceSummary from '../components/InvoiceSummary';
import PaymentModal from '../components/PaymentModal';

const InvoicePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const invoiceRef = useRef();

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchInvoice = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/invoices/${id}`);
            setInvoice(res.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || "Error loading invoice");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    const handlePaymentSubmit = async (amount) => {
        try {
            await axios.post(`http://localhost:5000/api/invoices/${id}/payments`, {
                amount: Number(amount)
            });
            setIsModalOpen(false);
            fetchInvoice();
        } catch (err) {
            alert(err.response?.data?.message || "Payment Failed");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Permanently delete this invoice?")) {
            try {
                await axios.delete(`http://localhost:5000/api/invoices/${id}`);
                navigate('/');
            } catch (err) {
                alert("Failed to delete invoice");
            }
        }
    };

    const handleDownloadPDF = () => {
        const element = invoiceRef.current;
        const options = {
            margin: [0.5, 0.5],
            filename: `Invoice_${invoice.invoiceNumber}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(options).from(element).save();
    };

    if (loading) return <div className="p-10 text-center font-medium text-gray-500">Loading Invoice Details...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    const currency = CURRENCY_MAP[invoice.currency] || CURRENCY_MAP.USD;

    return (
        <div className="max-w-5xl mx-auto p-8">
            {/* Action Bar - Animated on Page Load */}
            <div className="flex justify-between items-center mb-8 no-print">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => navigate('/')}
                    className="text-gray-500 hover:text-blue-600 font-medium transition-colors flex items-center gap-2"
                >
                    &larr; Dashboard
                </motion.button>

                <div className="flex gap-3">
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        onClick={handleDelete}
                        className="bg-white text-red-500 px-4 py-2 rounded-lg text-sm font-bold border border-red-100 hover:bg-red-50 transition-all"
                    >
                        Delete
                    </motion.button>

                    {/* Animated Download Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.2
                        }}
                        onClick={handleDownloadPDF}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download PDF
                    </motion.button>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                ref={invoiceRef}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
            >
                <InvoiceHeader invoice={invoice} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <LineItemsTable
                            items={invoice.lineItems}
                            currencySymbol={currency.symbol}
                        />
                        <PaymentHistory
                            payments={invoice.payments}
                            currencySymbol={currency.symbol}
                        />
                    </div>

                    <div className="space-y-8">
                        <InvoiceSummary
                            invoice={invoice}
                            onOpenModal={() => setIsModalOpen(true)}
                        />
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-50 text-center text-gray-400 text-xs italic">
                    Thank you for your business. Please contact us for any payment queries regarding Invoice #{invoice.invoiceNumber}.
                </div>
            </motion.div>

            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handlePaymentSubmit}
                balanceDue={invoice.balanceDue}
                currencySymbol={currency.symbol}
            />
        </div>
    );
};

export default InvoicePage;