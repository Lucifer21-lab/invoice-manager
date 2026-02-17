import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Added Framer Motion

const PaymentModal = ({ isOpen, onClose, onSubmit, balanceDue, currencySymbol }) => {
    const [amount, setAmount] = useState('');

    const handleSubmit = () => {
        if (!amount || Number(amount) <= 0) return alert("Please enter a valid amount");
        onSubmit(amount);
        setAmount('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop Animation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Container Animation */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside modal
                            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
                        >
                            {/* Accent line for visual polish */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />

                            <h3 className="text-xl font-bold text-gray-800 mb-2">Record Payment</h3>
                            <p className="text-gray-500 text-sm mb-6">Enter the amount received for this invoice.</p>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">
                                    Amount ({currencySymbol})
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                        {currencySymbol}
                                    </span>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-200 pl-8 pr-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-lg font-semibold transition-all"
                                        placeholder={`Max: ${balanceDue}`}
                                        max={balanceDue}
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        autoFocus
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-3 flex justify-between items-center">
                                    <span>Remaining Balance</span>
                                    <span className="font-medium text-gray-600">
                                        {currencySymbol}{balanceDue.toLocaleString()}
                                    </span>
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                    className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                                >
                                    Confirm Payment
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PaymentModal;