import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [view, setView] = useState('gateway');
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e, role) => {
    e.preventDefault();
    setIsLoading(true);
    
    const port = role === 'user' ? '8081' : '8082';
    // Ensure the endpoint matches your @PostMapping in Java
    const url = `http://localhost:${port}/api/${role === 'user' ? 'user' : 'owner'}/login`;

    try {
        localStorage.clear(); // Clear any old "ghost" sessions
        const response = await axios.post(url, credentials);
        const data = response.data;

        // UNIVERSAL STORAGE: Use 'token', 'userId', and 'role' for BOTH types
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", role === 'user' ? 'user' : 'admin');
        
        // This is the critical part: 
        // Save 'ownerId' or 'userId' into a single 'userId' key for the UI
        const idToSave = data.userId || data.ownerId;
        localStorage.setItem("userId", idToSave);

        console.log(`Login Success as ${role}. ID: ${idToSave}. Redirecting...`);
        
        if (role === 'user') {
            navigate("/dashboard");
        } else {
            navigate("/admin-dashboard");
        }
    } catch (error) {
        console.error("Auth Error:", error.response);
        alert("Invalid credentials or Server is Offline.");
    } finally {
        setIsLoading(false);
    }
};

    if (view === 'gateway') {
        return (
            <div className="vh-100 d-flex align-items-center justify-content-center" 
                 style={{ background: 'linear-gradient(135deg, #002e6e 0%, #004a99 100%)' }}>
                <div className="container text-center text-white">
                    <div className="mb-5">
                        <h1 className="display-3 fw-bold">MyFin <span style={{ color: '#ffb400' }}>Bank</span></h1>
                        <p className="fs-5 opacity-75">Secure • Reliable • Digital Banking Solutions</p>
                    </div>

                    <div className="row justify-content-center g-4">
                        <div className="col-md-5 col-lg-4">
                            <div className="card h-100 border-0 shadow-lg p-5 bg-white text-dark role-card" 
                                 onClick={() => setView('user')} 
                                 style={{ borderRadius: '25px', cursor: 'pointer', transition: '0.3s' }}>
                                <div className="display-1 mb-3">👤</div>
                                <h2 className="fw-bold">Personal</h2>
                                <p className="text-muted small">Savings & Transfers</p>
                                <button className="btn btn-lg w-100 fw-bold rounded-pill mt-3" style={{backgroundColor: '#004a99', color: 'white'}}>Enter</button>
                            </div>
                        </div>

                        <div className="col-md-5 col-lg-4">
                            <div className="card h-100 border-0 shadow-lg p-5 bg-white text-dark role-card" 
                                 onClick={() => setView('admin')} 
                                 style={{ borderRadius: '25px', cursor: 'pointer', transition: '0.3s' }}>
                                <div className="display-1 mb-3">🏦</div>
                                <h2 className="fw-bold">Banker</h2>
                                <p className="text-muted small">Staff Administration</p>
                                <button className="btn btn-lg btn-dark w-100 fw-bold rounded-pill mt-3">Access</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid vh-100 d-flex p-0">
            <div className={`col-md-7 d-none d-md-flex align-items-center justify-content-center text-white p-5`} 
                 style={{ backgroundColor: view === 'user' ? '#002e6e' : '#1a1a1a' }}>
                <div className="text-center">
                    <h1 className="display-2 fw-bold mb-3">{view === 'user' ? 'Welcome Back' : 'Staff Portal'}</h1>
                    <p className="fs-4 opacity-75">Verified Secure Access</p>
                </div>
            </div>

            <div className="col-md-5 bg-white d-flex align-items-center p-5 position-relative">
                <button className="btn btn-link position-absolute top-0 start-0 m-4 text-decoration-none text-muted fw-bold" 
                        onClick={() => setView('gateway')}>← GATEWAY</button>
                
                <div className="w-100 px-lg-5">
                    <h2 className="fw-bold mb-4">{view === 'user' ? 'Customer Login' : 'Banker Login'}</h2>
                    <form onSubmit={(e) => handleLogin(e, view === 'user' ? 'user' : 'owner')}>
                        <div className="mb-3">
                            <label className="small fw-bold text-muted">USERNAME</label>
                            <input type="text" className="form-control form-control-lg border-0 bg-light rounded-3" 
                                   onChange={(e) => setCredentials({...credentials, username: e.target.value})} required />
                        </div>
                        <div className="mb-4">
                            <label className="small fw-bold text-muted">PASSWORD</label>
                            <input type="password" className="form-control form-control-lg border-0 bg-light rounded-3" 
                                   onChange={(e) => setCredentials({...credentials, password: e.target.value})} required />
                        </div>
                        <button className="btn btn-lg w-100 text-white fw-bold py-3 mb-4 shadow" 
                                style={{ backgroundColor: view === 'user' ? '#004a99' : '#1a1a1a', borderRadius: '12px' }}>
                            {isLoading ? 'Processing...' : 'Login'}
                        </button>
                    </form>
                    {view === 'user' && (
                        <p className="text-center small">New user? <Link to="/register" className="fw-bold text-decoration-none">Register Now</Link></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;