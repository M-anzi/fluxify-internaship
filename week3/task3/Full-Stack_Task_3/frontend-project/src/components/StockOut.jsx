import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockOut = () => {
    const [formData, setFormData] = useState({
        stockOutId: '',
        sparePartId: '',
        stockOutQuantity: '',
        stockOutUnitPrice: '',
        stockOutDate: new Date().toISOString().split('T')[0]
    });
    const [spareParts, setSpareParts] = useState([]);
    const [stockOutRecords, setStockOutRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isEditing, setIsEditing] = useState(false);

    // Fetch spare parts and stock out records on component mount
    useEffect(() => {
        fetchSpareParts();
        fetchStockOutRecords();
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

    const fetchStockOutRecords = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/stock-out', {
                withCredentials: true
            });
            setStockOutRecords(response.data);
        } catch (error) {
            console.error('Error fetching stock out records:', error);
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
                    stockOutUnitPrice: selectedPart.UnitPrice
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            let response;
            
            if (isEditing) {
                // Update existing record
                response = await axios.put(`http://localhost:5000/api/stock-out/${formData.stockOutId}`, {
                    sparePartId: parseInt(formData.sparePartId),
                    stockOutQuantity: parseInt(formData.stockOutQuantity),
                    stockOutUnitPrice: parseFloat(formData.stockOutUnitPrice),
                    stockOutDate: formData.stockOutDate
                }, {
                    withCredentials: true
                });
                setMessage({ type: 'success', text: 'Stock out record updated successfully' });
            } else {
                // Create new record
                response = await axios.post('http://localhost:5000/api/stock-out', {
                    sparePartId: parseInt(formData.sparePartId),
                    stockOutQuantity: parseInt(formData.stockOutQuantity),
                    stockOutUnitPrice: parseFloat(formData.stockOutUnitPrice),
                    stockOutDate: formData.stockOutDate
                }, {
                    withCredentials: true
                });
                setMessage({ type: 'success', text: response.data.message || 'Stock out record created successfully' });
            }
            
            // Reset form
            resetForm();

            // Refresh lists
            fetchStockOutRecords();
            fetchSpareParts();
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.error || `Failed to ${isEditing ? 'update' : 'create'} stock out record` 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record) => {
        setFormData({
            stockOutId: record.StockOutID,
            sparePartId: record.SparePartID,
            stockOutQuantity: record.StockOutQuantity,
            stockOutUnitPrice: record.StockOutUnitPrice,
            stockOutDate: new Date(record.StockOutDate).toISOString().split('T')[0]
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this stock out record?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/stock-out/${id}`, {
                withCredentials: true
            });
            
            setMessage({ type: 'success', text: 'Stock out record deleted successfully' });
            fetchStockOutRecords();
            fetchSpareParts();
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.error || 'Failed to delete stock out record' 
            });
        }
    };

    const resetForm = () => {
        setFormData({
            stockOutId: '',
            sparePartId: '',
            stockOutQuantity: '',
            stockOutUnitPrice: '',
            stockOutDate: new Date().toISOString().split('T')[0]
        });
        setIsEditing(false);
    };

    // Calculate total price
    const calculateTotal = () => {
        const qty = parseFloat(formData.stockOutQuantity) || 0;
        const price = parseFloat(formData.stockOutUnitPrice) || 0;
        return (qty * price).toFixed(2);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Stock Out Management</h2>

            {/* Form Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {isEditing ? 'Edit Stock Out Record' : 'Add Stock Out Record'}
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
                                    {part.Name} - {part.Category} (Available: {part.Quantity})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock Out Date *
                        </label>
                        <input
                            type="date"
                            name="stockOutDate"
                            value={formData.stockOutDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity Out *
                        </label>
                        <input
                            type="number"
                            name="stockOutQuantity"
                            value={formData.stockOutQuantity}
                            onChange={handleChange}
                            required
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter quantity out"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit Price (RWF) *
                        </label>
                        <input
                            type="number"
                            name="stockOutUnitPrice"
                            value={formData.stockOutUnitPrice}
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

                    <div className="md:col-span-2 flex space-x-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`font-semibold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                isEditing 
                                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                            }`}
                        >
                            {loading ? 'Saving...' : (isEditing ? 'Update Record' : 'Record Stock Out')}
                        </button>
                        
                        {isEditing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Stock Out Records List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h3 className="text-lg font-semibold text-gray-800 p-6 border-b">
                    Stock Out History
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stockOutRecords.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        No stock out records found.
                                    </td>
                                </tr>
                            ) : (
                                stockOutRecords.map((record) => (
                                    <tr key={record.StockOutID} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(record.StockOutDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {record.SparePartName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                                                {record.Category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <span className="text-red-600 font-medium">
                                                -{record.StockOutQuantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            RWF {parseFloat(record.StockOutUnitPrice).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            RWF {parseFloat(record.StockOutTotalPrice).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(record)}
                                                className="text-primary-600 hover:text-primary-800 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(record.StockOutID)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
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

export default StockOut;
