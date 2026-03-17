import React from 'react';
import { useNavigate } from 'react-router-dom';

const Gateway = () => {
    const navigate = useNavigate();

    return (
        <div className="vh-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: '#002e6e', background: 'linear-gradient(135deg, #002e6e 0%, #004a99 100%)' }}>
            <div className="container text-center text-white">
                <div className="mb-5">
                    <h1 className="display-4 fw-bold">MyFin <span style={{ color: '#ffb400' }}>Bank</span></h1>
                    <p className="opacity-75">Secure • Reliable • Digital</p>
                </div>

                <div className="row justify-content-center g-4">
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-lg p-4 bg-white text-dark role-card" 
                             onClick={() => navigate('/login')} style={{ cursor: 'pointer', borderRadius: '20px' }}>
                            <div className="display-3 mb-3">👤</div>
                            <h3 className="fw-bold">Personal Banking</h3>
                            <p className="text-muted">Manage your savings, transfers, and investments.</p>
                            <button className="btn btn-primary w-100 fw-bold rounded-pill mt-3">Enter Customer Portal</button>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-lg p-4 bg-white text-dark role-card" 
                             onClick={() => navigate('/admin-login')} style={{ cursor: 'pointer', borderRadius: '20px' }}>
                            <div className="display-3 mb-3">🏦</div>
                            <h3 className="fw-bold">Banker Portal</h3>
                            <p className="text-muted">Approve loans, manage users, and support customers.</p>
                            <button className="btn btn-dark w-100 fw-bold rounded-pill mt-3">Staff Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gateway;