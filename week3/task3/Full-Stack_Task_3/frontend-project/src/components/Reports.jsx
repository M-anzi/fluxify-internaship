import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('daily-stock-out');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [stockOutReport, setStockOutReport] = useState(null);
    const [stockStatusReport, setStockStatusReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchDailyStockOutReport = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:5000/api/reports/daily-stock-out?date=${selectedDate}`, {
                withCredentials: true
            });
            setStockOutReport(response.data);
        } catch (err) {
            setError('Failed to fetch daily stock out report');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStockStatusReport = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:5000/api/reports/stock-status?date=${selectedDate}`, {
                withCredentials: true
            });
            setStockStatusReport(response.data);
        } catch (err) {
            setError('Failed to fetch stock status report');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'daily-stock-out') {
            fetchDailyStockOutReport();
        } else {
            fetchStockStatusReport();
        }
    }, [activeTab, selectedDate]);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleGenerateReport = () => {
        if (activeTab === 'daily-stock-out') {
            fetchDailyStockOutReport();
        } else {
            fetchStockStatusReport();
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Reports</h2>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('daily-stock-out')}
                    className={`pb-2 px-4 font-medium transition-colors ${
                        activeTab === 'daily-stock-out'
                            ? 'border-b-2 border-primary-600 text-primary-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Daily Stock Out
                </button>
                <button
                    onClick={() => setActiveTab('stock-status')}
                    className={`pb-2 px-4 font-medium transition-colors ${
                        activeTab === 'stock-status'
                            ? 'border-b-2 border-primary-600 text-primary-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Stock Status
                </button>
            </div>

            {/* Date Filter */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-full md:w-auto">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={handleGenerateReport}
                        disabled={loading}
                        className="mt-6 md:mt-0 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Generating...' : 'Generate Report'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Daily Stock Out Report */}
            {activeTab === 'daily-stock-out' && stockOutReport && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Daily Stock Out Report
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Date: {new Date(stockOutReport.date).toLocaleDateString()}
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                            <div>
                                <p className="text-sm text-gray-600">Total Records</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stockOutReport.totalRecords}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Amount</p>
                                <p className="text-2xl font-bold text-primary-600">
                                    RWF {stockOutReport.totalAmount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
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
                                {stockOutReport.records.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            No stock out records found for this date.
                                        </td>
                                    </tr>
                                ) : (
                                    stockOutReport.records.map((record) => (
                                        <tr key={record.StockOutID} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {record.SparePartName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                                                    {record.Category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {record.StockOutQuantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                RWF {parseFloat(record.StockOutUnitPrice).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                                                RWF {parseFloat(record.StockOutTotalPrice).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Stock Status Report */}
            {activeTab === 'stock-status' && stockStatusReport && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Daily Stock Status Report
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Date: {new Date(stockStatusReport.date).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Spare Part Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stored Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock In (Total)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock Out
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Remaining
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {stockStatusReport.records.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            No stock status data found.
                                        </td>
                                    </tr>
                                ) : (
                                    stockStatusReport.records.map((record) => (
                                        <tr key={record.SparePartID} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {record.SparePartName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800">
                                                    {record.Category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {record.StoredQuantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                                +{record.TotalStockIn}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                                                -{record.TotalStockOut}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-600">
                                                {record.Remaining}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {record.Remaining > 20 ? (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                                        In Stock
                                                    </span>
                                                ) : record.Remaining > 0 ? (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                                        Low Stock
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                                        Out of Stock
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Cards */}
                    <div className="p-6 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <p className="text-sm text-gray-600">Total Items In Stock</p>
                            <p className="text-2xl font-bold text-green-600">
                                {stockStatusReport.records.filter(r => r.Remaining > 20).length}
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <p className="text-sm text-gray-600">Low Stock Items</p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {stockStatusReport.records.filter(r => r.Remaining > 0 && r.Remaining <= 20).length}
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <p className="text-sm text-gray-600">Out of Stock</p>
                            <p className="text-2xl font-bold text-red-600">
                                {stockStatusReport.records.filter(r => r.Remaining === 0).length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
