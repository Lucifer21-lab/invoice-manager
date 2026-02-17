const PaymentHistory = ({ payments, currencySymbol }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Payment History</h3>
            {payments.length > 0 ? (
                <ul className="space-y-3">
                    {payments.map((pay) => (
                        <li key={pay._id} className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-500">
                                {new Date(pay.paymentDate).toLocaleDateString()}
                            </span>
                            <span className="font-bold text-green-700">+ {currencySymbol}{pay.amount}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-400 italic text-sm">No payments recorded yet.</p>
            )}
        </div>
    );
};

export default PaymentHistory;