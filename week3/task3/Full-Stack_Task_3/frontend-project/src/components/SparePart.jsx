import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SparePart = () => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: '',
        unitPrice: ''
    });
    const [spareParts, setSpareParts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch spare parts on component mount
    useEffect(() => {
        fetchSpareParts();
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await axios.post('http://localhost:5000/api/spare-parts', {
                name: formData.name,
                category: formData.category,
                quantity: parseInt(formData.quantity),
                unitPrice: parseFloat(formData.unitPrice)
            }, {
                withCredentials: true
            });

            setMessage({ 
                type: 'success', 
                text: response.data.message || 'Spare part created successfully' 
            });
            
            // Reset form
            setFormData({
                name: '',
                category: '',
                quantity: '',
                unitPrice: ''
            });

            // Refresh list
            fetchSpareParts();
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.error || 'Failed to create spare part' 
            });
        } finally {
            setLoading(false);
        }
    };

    // Calculate total price
    const calculateTotal = () => {
        const qty = parseFloat(formData.quantity) || 0;
        const price = parseFloat(formData.unitPrice) || 0;
        return (qty * price).toFixed(2);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Spare Parts Management</h2>

            {/* Form Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Add New Spare Part
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
                            Spare Part Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter spare part name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="">Select Category</option>
                            <option value="Engine Parts">Engine Parts</option>
                            <option value="Braking System">Braking System</option>
                            <option value="Cooling System">Cooling System</option>
                            <option value="Ignition System">Ignition System</option>
                            <option value="Transmission">Transmission</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Suspension">Suspension</option>
                            <option value="Body Parts">Body Parts</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Initial Quantity *
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter quantity"
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
                            className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save Spare Part'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h3 className="text-lg font-semibold text-gray-800 p-6 border-b">
                    Spare Parts Inventory
                </h3>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
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
                            {spareParts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No spare parts found. Add your first spare part above.
                                    </td>
                                </tr>
                            ) : (
                                spareParts.map((part) => (
                                    <tr key={part.SparePartID} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {part.Name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800">
                                                {part.Category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {part.Quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            RWF {parseFloat(part.UnitPrice).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            RWF {parseFloat(part.TotalPrice).toLocaleString()}
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

export default SparePart;
