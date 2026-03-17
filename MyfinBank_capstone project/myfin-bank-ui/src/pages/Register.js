import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '' });
    const [isBanker, setIsBanker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const port = isBanker ? '8082' : '8081';
        const rolePath = isBanker ? 'owner' : 'user';
        
        try {
            await axios.post(`http://localhost:${port}/api/${rolePath}/register`, formData);
            alert("Registration Successful! Please login to continue.");
            navigate("/");
        } catch (error) {
            console.error("Registration Error:", error);
            alert("Registration failed. Please ensure the backend services are running.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex p-0">
            {/* Left Side: Professional Branding */}
            <div className={`col-md-6 d-none d-md-flex align-items-center justify-content-center text-white p-5`} 
                 style={{ backgroundColor: isBanker ? '#1a1a1a' : '#002e6e', transition: '0.5s' }}>
                <div className="text-center">
                    <h1 className="display-3 fw-bold mb-4">Start Your <br/> Journey.</h1>
                    <p className="fs-4 opacity-75">
                        {isBanker ? 'Authorized Access for MyFin Officials' : 'Join the elite circle of MyFin digital customers.'}
                    </p>
                </div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="col-md-6 bg-white d-flex align-items-center p-5">
                <div className="w-100 px-lg-5">
                    <div className="mb-4">
                        <h2 className="fw-bold">{isBanker ? 'Staff Registration' : 'Open New Account'}</h2>
                        <p className="text-muted">Fill in your details to get started.</p>
                    </div>

                    <div className="form-check form-switch mb-4">
                        <input className="form-check-input" type="checkbox" id="roleToggle" 
                               onChange={() => setIsBanker(!isBanker)} />
                        <label className="form-check-label fw-bold small text-primary" htmlFor="roleToggle">
                            REGISTER AS BANK OFFICIAL
                        </label>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="mb-3">
                            <label className="small fw-bold text-muted mb-1">FULL NAME</label>
                            <input type="text" className="form-control form-control-lg border-0 bg-light rounded-3" 
                                   placeholder="Gireesh Kumar Reddy"
                                   onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="small fw-bold text-muted mb-1">USERNAME</label>
                                <input type="text" className="form-control form-control-lg border-0 bg-light rounded-3" 
                                       placeholder="gireesh_72"
                                       onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="small fw-bold text-muted mb-1">EMAIL</label>
                                <input type="email" className="form-control form-control-lg border-0 bg-light rounded-3" 
                                       placeholder="name@email.com"
                                       onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="small fw-bold text-muted mb-1">PASSWORD</label>
                            <input type="password" className="form-control form-control-lg border-0 bg-light rounded-3" 
                                   placeholder="••••••••"
                                   onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                        </div>

                        <button className="btn btn-lg w-100 text-white fw-bold py-3 mb-4 shadow" 
                                style={{ backgroundColor: isBanker ? '#1a1a1a' : '#004a99', borderRadius: '12px', border: 'none' }}
                                disabled={isLoading}>
                            {isLoading ? 'Processing...' : (isBanker ? 'Register Official' : 'Create Account')}
                        </button>
                    </form>

                    <p className="text-center small">Already have an account? 
                        <Link to="/" className="ms-2 fw-bold text-primary text-decoration-none">Login Here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;