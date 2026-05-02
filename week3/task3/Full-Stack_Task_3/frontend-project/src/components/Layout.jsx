import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            navigate('/login');
        }
    };

    const navLinkClass = ({ isActive }) =>
        `px-4 py-2 rounded-md transition-colors duration-200 ${
            isActive 
                ? 'bg-primary-700 text-white' 
                : 'text-primary-100 hover:bg-primary-600 hover:text-white'
        }`;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation Bar */}
            <nav className="bg-primary-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <h1 className="text-white text-xl font-bold">
                                SIMS - SmartPark
                            </h1>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex space-x-2">
                            <NavLink to="/spare-parts" className={navLinkClass}>
                                Spare Parts
                            </NavLink>
                            <NavLink to="/stock-in" className={navLinkClass}>
                                Stock In
                            </NavLink>
                            <NavLink to="/stock-out" className={navLinkClass}>
                                Stock Out
                            </NavLink>
                            <NavLink to="/reports" className={navLinkClass}>
                                Reports
                            </NavLink>
                        </div>

                        {/* User Info & Logout */}
                        <div className="flex items-center space-x-4">
                            <span className="text-primary-100 text-sm">
                                Welcome, {user?.username}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink to="/spare-parts" className={navLinkClass}>
                            Spare Parts
                        </NavLink>
                        <NavLink to="/stock-in" className={navLinkClass}>
                            Stock In
                        </NavLink>
                        <NavLink to="/stock-out" className={navLinkClass}>
                            Stock Out
                        </NavLink>
                        <NavLink to="/reports" className={navLinkClass}>
                            Reports
                        </NavLink>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
