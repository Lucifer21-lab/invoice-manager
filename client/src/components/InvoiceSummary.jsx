import { CURRENCY_MAP } from '../utils/currencies';

const InvoiceSummary = ({ invoice, onOpenModal }) => {
    const currency = CURRENCY_MAP[invoice.currency] || CURRENCY_MAP.USD;

    return (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-6">Payment Summary</h3>

            <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">{currency.symbol}{invoice.total.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                    <span>Paid to Date</span>
                    <span className="text-green-600 font-medium">
                        ({currency.symbol}{invoice.amountPaid.toLocaleString()})
                    </span>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
                    <div>
                        <span className="block text-xs font-bold text-gray-400 uppercase">Amount Due</span>
                        <span className="text-3xl font-bold text-gray-900">
                            {currency.symbol}{invoice.balanceDue.toLocaleString()}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-xl">{currency.icon}</span>
                        <span className="block text-[10px] font-bold text-gray-400">{invoice.currency}</span>
                    </div>
                </div>
            </div>

            {invoice.status !== 'PAID' ? (
                <button
                    onClick={onOpenModal}
                    className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-200 no-print"
                >
                    Add Payment
                </button>
            ) : (
                <div className="mt-8 bg-green-100 text-green-700 text-center py-3 rounded-xl font-bold border border-green-200 uppercase text-xs tracking-widest">
                    Fully Settled
                </div>
            )}
        </div>
    );
};

export default InvoiceSummary;