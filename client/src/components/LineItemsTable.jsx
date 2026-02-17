const LineItemsTable = ({ items, currencySymbol }) => { // Accept symbol as prop
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                        <th className="p-4 font-medium">Description</th>
                        <th className="p-4 font-medium text-center">Qty</th>
                        <th className="p-4 font-medium text-right">Price ({currencySymbol})</th>
                        <th className="p-4 font-medium text-right">Total ({currencySymbol})</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-gray-800 font-medium">{item.description}</td>
                            <td className="p-4 text-center text-gray-600">{item.quantity}</td>
                            <td className="p-4 text-right text-gray-600">{currencySymbol}{item.unitPrice}</td>
                            <td className="p-4 text-right font-bold text-gray-800">{currencySymbol}{item.lineTotal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LineItemsTable;