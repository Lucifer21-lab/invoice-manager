import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CURRENCY_MAP } from '../utils/currencies';

const HomePage = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state
    const navigate = useNavigate();

    // Animation Config
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/invoices');
            setInvoices(res.data);
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false); // Stop loading regardless of success/fail
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this invoice?")) {
            try {
                await axios.delete(`http://localhost:5000/api/invoices/${id}`);
                setInvoices(invoices.filter(inv => inv._id !== id));
            } catch (err) {
                alert("Failed to delete");
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8">
            <header className="flex justify-between items-center mb-8">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
                    <p className="text-gray-500">Manage your billing and client payments</p>
                </motion.div>
                <button
                    onClick={() => navigate('/create')}
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg"
                >
                    + Create New
                </button>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="p-4">Invoice #</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Issue Date</th>
                            <th className="p-4">Due Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Amount</th>
                            <th className="p-4 text-center">Actions</th>
                            <th className="p-4 text-center">Alerts</th>
                        </tr>
                    </thead>

                    {/* Logic Fix: Only render tbody when NOT loading */}
                    {!loading && (
                        <motion.tbody
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="divide-y divide-gray-50"
                        >
                            <AnimatePresence>
                                {invoices.map((inv) => {
                                    const currency = CURRENCY_MAP[inv.currency] || CURRENCY_MAP.USD;
                                    const isOverdue = new Date(inv.dueDate) < new Date() && inv.status !== 'PAID';

                                    return (
                                        <motion.tr
                                            key={inv._id}
                                            variants={rowVariants}
                                            exit={{ opacity: 0, x: -20 }}
                                            className={isOverdue ? 'bg-red-50/40' : ''}
                                        >
                                            <td className="p-4 font-bold">{inv.invoiceNumber}</td>
                                            <td className="p-4">{inv.customerName}</td>
                                            <td className="p-4">{new Date(inv.issueDate).toLocaleDateString()}</td>
                                            <td className={`p-4 font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                                                {new Date(inv.dueDate).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${inv.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100'}`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-bold">
                                                {currency.symbol}{inv.total.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-center">
                                                <Link to={`/invoices/${inv._id}`} className="text-blue-600 mr-3">View</Link>
                                                <button onClick={() => handleDelete(inv._id)} className="text-red-500">Delete</button>
                                            </td>
                                            <td className="p-4 text-center">
                                                {isOverdue && <span className="text-red-600 font-bold text-[10px] animate-pulse">⚠️ OVERDUE</span>}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.tbody>
                    )}
                </table>

                {/* Show this if data is still being fetched */}
                {loading && (
                    <div className="p-20 text-center text-gray-400">Fetching invoices...</div>
                )}

                {/* Show this if not loading but no data was found */}
                {!loading && invoices.length === 0 && (
                    <div className="p-20 text-center text-gray-400">No invoices found.</div>
                )}
            </div>
        </div>
    );
};

export default HomePage;