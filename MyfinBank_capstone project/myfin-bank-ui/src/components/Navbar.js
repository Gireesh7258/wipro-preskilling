import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authServiceInstance from '../services/AuthService';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");

    const handleLogout = () => {
        authServiceInstance.logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">MyFin Bank</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        {!isLoggedIn ? (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/transactions">Transactions</Link></li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-danger btn-sm ms-2" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;