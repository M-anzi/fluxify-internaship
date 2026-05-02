import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.js';
import Layout from './components/Layout.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import SparePart from './components/SparePart.jsx';
import StockIn from './components/StockIn.jsx';
import StockOut from './components/StockOut.jsx';
import Reports from './components/Reports.jsx';

function App() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                <Route 
                    path="/login" 
                    element={!isAuthenticated ? <Login /> : <Navigate to="/spare-parts" />} 
                />
                <Route 
                    path="/register" 
                    element={!isAuthenticated ? <Register /> : <Navigate to="/spare-parts" />} 
                />
                <Route 
                    path="/" 
                    element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
                >
                    <Route index element={<Navigate to="/spare-parts" />} />
                    <Route path="spare-parts" element={<SparePart />} />
                    <Route path="stock-in" element={<StockIn />} />
                    <Route path="stock-out" element={<StockOut />} />
                    <Route path="reports" element={<Reports />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
