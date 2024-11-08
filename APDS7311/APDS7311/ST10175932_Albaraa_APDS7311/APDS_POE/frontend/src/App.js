import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PaymentForm from './components/PaymentForm';
import EmployeeLogin from './components/EmployeeLogin';
import EmployeeDashboard from './components/EmployeeDashboard';
import TransactionVerification from './components/TransactionVerification';
import SwiftSubmission from './components/SwiftSubmission';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || '');
    const [currentPage, setCurrentPage] = useState('/');

    const handleLogin = (newToken, role) => {
        setToken(newToken);
        setUserRole(role);
        localStorage.setItem('token', newToken);
        localStorage.setItem('userRole', role);
    };

    const handleLogout = () => {
        setToken('');
        setUserRole('');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setCurrentPage('/login');
    };

    const renderPage = () => {
        switch (currentPage) {
            case '/':
            case '/login':
                return <Login onLogin={(token) => handleLogin(token, 'customer')} onNavigate={setCurrentPage} />;
            case '/employee/login':
                return <EmployeeLogin onLogin={(token) => handleLogin(token, 'employee')} onNavigate={setCurrentPage} />;
            case '/register':
                return <Register onNavigate={setCurrentPage} />;
            case '/dashboard':
                return token && userRole === 'customer' ? 
                    <Dashboard token={token} /> : 
                    <Login onLogin={(token) => handleLogin(token, 'customer')} onNavigate={setCurrentPage} />;
            case '/payment':
                return token && userRole === 'customer' ? 
                    <PaymentForm token={token} /> : 
                    <Login onLogin={(token) => handleLogin(token, 'customer')} onNavigate={setCurrentPage} />;
            case '/employee/dashboard':
                return token && userRole === 'employee' ? 
                    <EmployeeDashboard token={token} /> : 
                    <EmployeeLogin onLogin={(token) => handleLogin(token, 'employee')} onNavigate={setCurrentPage} />;
            default:
                return <Login onLogin={(token) => handleLogin(token, 'customer')} onNavigate={setCurrentPage} />;
        }
    };

    return (
        <div>
            {(token && userRole) && (
                <nav className="bg-blue-600 text-white p-4">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="font-bold text-xl">
                            {userRole === 'employee' ? 'Employee Portal' : 'Customer Portal'}
                        </div>
                        <div className="flex gap-4">
                            {userRole === 'employee' ? (
                                <button 
                                    onClick={() => setCurrentPage('/employee/dashboard')}
                                    className="text-white hover:text-blue-200"
                                >
                                    Dashboard
                                </button>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => setCurrentPage('/dashboard')}
                                        className="text-white hover:text-blue-200"
                                    >
                                        Dashboard
                                    </button>
                                    <button 
                                        onClick={() => setCurrentPage('/payment')}
                                        className="text-white hover:text-blue-200"
                                    >
                                        Make Payment
                                    </button>
                                </>
                            )}
                            <button 
                                onClick={handleLogout}
                                className="text-white hover:text-blue-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>
            )}
            {renderPage()}
        </div>
    );
};

export default App;