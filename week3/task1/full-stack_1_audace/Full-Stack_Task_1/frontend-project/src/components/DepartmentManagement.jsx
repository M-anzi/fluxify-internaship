import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    departmentCode: '',
    departmentName: '',
    grossSalary: '',
    totalDeduction: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/departments');
      setDepartments(response.data);
    } catch (error) {
      setError('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await axios.post('/api/departments', formData);
      setSuccess('Department created successfully!');
      setFormData({
        departmentCode: '',
        departmentName: '',
        grossSalary: '',
        totalDeduction: ''
      });
      fetchDepartments();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create department');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Department Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Department Form */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Add New Department
                </h3>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-4">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Department Code *
                    </label>
                    <input
                      type="text"
                      name="departmentCode"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formData.departmentCode}
                      onChange={handleChange}
                      placeholder="e.g., CW, ST, MC, ADMS"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Department Name *
                    </label>
                    <input
                      type="text"
                      name="departmentName"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formData.departmentName}
                      onChange={handleChange}
                      placeholder="e.g., Carwash, Stock, Mechanic"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Gross Salary (RWF) *
                    </label>
                    <input
                      type="number"
                      name="grossSalary"
                      required
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formData.grossSalary}
                      onChange={handleChange}
                      placeholder="300000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Total Deduction (RWF) *
                    </label>
                    <input
                      type="number"
                      name="totalDeduction"
                      required
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formData.totalDeduction}
                      onChange={handleChange}
                      placeholder="20000"
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Net Salary Preview</h4>
                    <p className="text-lg font-semibold text-gray-900">
                      {formData.grossSalary && formData.totalDeduction 
                        ? parseInt(formData.grossSalary - formData.totalDeduction).toLocaleString() + ' RWF'
                        : '0 RWF'
                      }
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Gross Salary - Total Deduction
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Add Department'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Departments List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Departments List
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gross Salary
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Deduction
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Net Salary
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {departments.map((department) => {
                        const netSalary = department.grossSalary - department.totalDeduction;
                        return (
                          <tr key={department.departmentCode}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                              {department.departmentCode}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                              {department.departmentName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                              {parseInt(department.grossSalary).toLocaleString()} RWF
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                              {parseInt(department.totalDeduction).toLocaleString()} RWF
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                              {parseInt(netSalary).toLocaleString()} RWF
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  
                  {departments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No departments found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement;
