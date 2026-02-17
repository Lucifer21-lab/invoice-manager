import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CURRENCY_MAP } from '../utils/currencies';

const CreateInvoicePage = () => {
    const navigate = useNavigate();

    // Logic for today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        invoiceNumber: `INV-${Date.now()}`, // Auto-generated
        customerName: '',
        issueDate: today, // Fixed to current date
        dueDate: '',
        currency: 'USD',
        taxRate: 0
    });

    const [lineItems, setLineItems] = useState([
        { description: '', quantity: 1, unitPrice: 0 }
    ]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLineItemChange = (index, e) => {
        const { name, value } = e.target;
        const list = [...lineItems];
        list[index][name] = value;
        setLineItems(list);
    };

    const addLineItem = () => {
        setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0 }]);
    };

    const removeLineItem = (index) => {
        const list = [...lineItems];
        list.splice(index, 1);
        setLineItems(list);
    };

    // Calculations
    const subtotal = lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const taxAmount = (subtotal * (Number(formData.taxRate) / 100));
    const finalTotal = subtotal + taxAmount;
    const currentCurrency = CURRENCY_MAP[formData.currency] || CURRENCY_MAP.USD;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation for Due Date
        if (new Date(formData.dueDate) <= new Date(today)) {
            return alert("Due Date must be at least one day after the Issue Date.");
        }

        try {
            const payload = {
                ...formData,
                subtotal,
                taxAmount,
                total: finalTotal,
                lineItems: lineItems.map(item => ({
                    ...item,
                    quantity: Number(item.quantity),
                    unitPrice: Number(item.unitPrice),
                    lineTotal: item.quantity * item.unitPrice
                }))
            };

            const res = await axios.post('http://localhost:5000/api/invoices', payload);
            navigate(`/invoices/${res.data._id}`, { replace: true });
        } catch (err) {
            alert("Error: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Invoice</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2 italic underline">Invoice Number (Auto-generated)</label>
                        <input type="text" name="invoiceNumber" value={formData.invoiceNumber} readOnly className="w-full border p-3 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Customer Name *</label>
                        <input type="text" name="customerName" required placeholder="Client Name" value={formData.customerName} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2 italic underline">Issue Date (Fixed)</label>
                        <input type="date" name="issueDate" value={formData.issueDate} readOnly className="w-full border p-3 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Due Date *</label>
                        <input
                            type="date"
                            name="dueDate"
                            required
                            min={new Date(new Date().getTime() + 86400000).toISOString().split('T')[0]}
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Tax Rate (%)</label>
                        <input type="number" name="taxRate" min="0" value={formData.taxRate} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 18" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Currency Selector</label>
                        <select name="currency" value={formData.currency} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                            {Object.entries(CURRENCY_MAP).map(([code, { icon, label }]) => (
                                <option key={code} value={code}>{icon} {label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <hr className="border-gray-100" />

                <div>
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Line Items</h3>
                    <div className="space-y-4">
                        {lineItems.map((item, index) => (
                            <div key={index} className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg border border-transparent hover:border-blue-200 transition-all">
                                <div className="flex-grow">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">Description</label>
                                    <input type="text" name="description" required value={item.description} onChange={(e) => handleLineItemChange(index, e)} className="w-full border p-2 rounded" />
                                </div>
                                <div className="w-24">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">Qty</label>
                                    <input type="number" name="quantity" min="1" required value={item.quantity} onChange={(e) => handleLineItemChange(index, e)} className="w-full border p-2 rounded text-center" />
                                </div>
                                <div className="w-32">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">Price</label>
                                    <input type="number" name="unitPrice" min="0" required value={item.unitPrice} onChange={(e) => handleLineItemChange(index, e)} className="w-full border p-2 rounded text-right" />
                                </div>
                                {lineItems.length > 1 && (
                                    <button type="button" onClick={() => removeLineItem(index)} className="text-red-500 pb-2 px-2 hover:bg-red-50 rounded">✕</button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addLineItem} className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">+ Add Item</button>
                </div>

                <div className="border-t pt-6 flex flex-col items-end space-y-2">
                    <div className="text-gray-500 text-sm">Subtotal: {currentCurrency.symbol}{subtotal.toFixed(2)}</div>
                    <div className="text-gray-500 text-sm">Tax ({formData.taxRate}%): {currentCurrency.symbol}{taxAmount.toFixed(2)}</div>
                    <div className="text-2xl font-bold text-gray-800 pt-2">
                        Total: <span className="text-blue-600">{currentCurrency.symbol}{finalTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => navigate('/')} className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg">Cancel</button>
                        <button type="submit" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-200 transition-all">
                            Create Invoice
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateInvoicePage;