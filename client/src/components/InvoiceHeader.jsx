import React from 'react';

const InvoiceHeader = ({ invoice }) => {
    // Overdue Logic: Calculate difference in days
    const today = new Date();
    const dueDate = new Date(invoice.dueDate);

    // Calculate difference in time then convert to days
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Status Logic
    const isPaid = invoice.status === 'PAID';
    const isOverdue = diffDays < 0 && !isPaid;

    return (
        <div className="flex justify-between items-start mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            {/* Left Side: Invoice Info */}
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Invoice #{invoice.invoiceNumber}
                    </h1>
                    {isOverdue && (
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase animate-pulse border border-red-200">
                            Overdue
                        </span>
                    )}
                </div>

                <p className="text-gray-500 mt-2">
                    Billed to: <span className="font-semibold text-gray-700">{invoice.customerName}</span>
                </p>

                {/* Overdue/Due Countdown Logic */}
                {!isPaid && (
                    <p className={`text-sm mt-1 font-medium ${isOverdue ? 'text-red-500' : 'text-blue-500'}`}>
                        {isOverdue
                            ? `⚠️ This invoice is ${Math.abs(diffDays)} days past due.`
                            : `Payment is due in ${diffDays} days.`}
                    </p>
                )}
            </div>

            {/* Right Side: Status and Dates */}
            <div className="text-right">
                <div className="mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border ${isPaid
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : isOverdue
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                        {invoice.status}
                    </span>
                </div>

                <div className="text-xs text-gray-400 space-y-1">
                    <p>
                        <span className="font-semibold uppercase">Issued:</span> {new Date(invoice.issueDate).toLocaleDateString()}
                    </p>
                    <p className={isOverdue ? "text-red-500 font-bold" : ""}>
                        <span className="font-semibold uppercase">Due:</span> {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InvoiceHeader;