import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockIn = () => {
    const [formData, setFormData] = useState({
        sparePartId: '',
        stockInQuantity: '',
        stockInDate: new Date().toISOString().split('T')[0],
        unitPrice: ''
    });
    const [spareParts, setSpareParts] = useState([]);
    const [stockInRecords, setStockInRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch spare parts and stock in records on component mount
    useEffect(() => {
        fetchSpareParts();
        fetchStockInRecords();
    }, []);

    const fetchSpareParts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/spare-parts', {
                withCredentials: true
            });
            setSpareParts(response.data);
        } catch (error) {
            console.error('Error fetching spare parts:', error);
            setMessage({ type: 'error', text: 'Failed to load spare parts' });
        }
    };

    const fetchStockInRecords = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/stock-in', {
                withCredentials: true
            });
            setStockInRecords(response.data);
        } catch (error) {
            console.error('Error fetching stock in records:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-fill unit price when spare part is selected
        if (name === 'sparePartId') {
            const selectedPart = spareParts.find(p => p.SparePartID === parseInt(value));
            if (selectedPart) {
                setFormData(prev => ({
                    ...prev,
                    sparePartId: value,
                    unitPrice: selectedPart.UnitPrice
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await axios.post('http://localhost:5000/api/stock-in', {
                sparePartId: parseInt(formData.sparePartId),
                stockInQuantity: parseInt(formData.stockInQuantity),
                stockInDate: formData.stockInDate,
                unitPrice: parseFloat(formData.unitPrice)
            }, {
                withCredentials: true
            });

            setMessage({ 
                type: 'success', 
                text: response.data.message || 'Stock in record created successfully' 
            });
            
            // Reset form
            setFormData({
                sparePartId: '',
                stockInQuantity: '',
                stockInDate: new Date().toISOString().split('T')[0],
                unitPrice: ''
            });

            // Refresh lists
            fetchStockInRecords();
            fetchSpareParts();
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.error || 'Failed to create stock in record' 
            });
        } finally {
            setLoading(false);
        }
    };

    // Calculate total price
    const calculateTotal = () => {
        const qty = parseFloat(formData.stockInQuantity) || 0;
        const price = parseFloat(formData.unitPrice) || 0;
        return (qty * price).toFixed(2);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Stock In Management</h2>

            {/* Form Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Add Stock In Record
                </h3>

                {message.text && (
                    <div className={`mb-4 p-4 rounded-md ${
                        message.type === 'success' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Spare Part *
                        </label>
                        <select
                            name="sparePartId"
                            value={formData.sparePartId}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="">Select a spare part</option>
                            {spareParts.map((part) => (
                                <option key={part.SparePartID} value={part.SparePartID}>
                                    {part.Name} - {part.Category} (Current: {part.Quantity})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock In Date *
                        </label>
                        <input
                            type="date"
                            name="stockInDate"
                            value={formData.stockInDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity Received *
                        </label>
                        <input
                            type="number"
                            name="stockInQuantity"
                            value={formData.stockInQuantity}
                            onChange={handleChange}
                            required
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter quantity received"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit Price (RWF) *
                        </label>
                        <input
                            type="number"
                            name="unitPrice"
                            value={formData.unitPrice}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter unit price"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total Price (Calculated)
                        </label>
                        <input
                            type="text"
                            value={`RWF ${calculateTotal()}`}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Record Stock In'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Stock In Records List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h3 className="text-lg font-semibold text-gray-800 p-6 border-b">
                    Stock In History
                </h3>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Spare Part
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Unit Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Price
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stockInRecords.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No stock in records found.
                                    </td>
                                </tr>
                            ) : (
                                stockInRecords.map((record) => (
                                    <tr key={record.StockInID} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(record.StockInDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {record.SparePartName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800">
                                                {record.Category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <span className="text-green-600 font-medium">
                                                +{record.StockInQuantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            RWF {parseFloat(record.UnitPrice).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            RWF {parseFloat(record.TotalPrice).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StockIn;
