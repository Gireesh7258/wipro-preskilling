import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Investments = () => {
    const [investment, setInvestment] = useState({ amount: '', type: 'Gold Bonds' });
    const [balance, setBalance] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/api/user/account/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setBalance(res.data.balance);
            } catch (err) { console.error("Balance sync failed"); }
        };
        fetchBalance();
    }, [userId, token]);

    const handleInvest = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
        // MATCH THE BACKEND URL EXACTLY
        await axios.post("http://localhost:8081/api/user/invest", {
            userId: userId, // Ensure this is the ID from localStorage
            amount: investment.amount,
            type: investment.type
        }, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
        });

        alert("Success! Portfolio updated.");
        navigate("/dashboard");
    } catch (err) {
        // This will now show the REAL error from Spring Boot
        console.error(err.response?.data);
        alert(err.response?.data || "Connection Error to User-Service");
    } finally {
        setIsProcessing(false);
    }
};

    return (
        <div className="container-fluid py-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                            <div className="p-4 bg-primary text-white text-center">
                                <h4 className="fw-bold mb-1">Wealth Management</h4>
                                <p className="small opacity-75 mb-0">Secure Your Future with MyFin</p>
                            </div>
                            
                            <div className="card-body p-4 bg-white">
                                <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-3">
                                    <span className="small fw-bold text-muted">AVAILABLE TO INVEST</span>
                                    <span className="fw-bold text-dark">₹{balance.toLocaleString('en-IN')}</span>
                                </div>

                                <form onSubmit={handleInvest}>
                                    <div className="mb-3">
                                        <label className="small fw-bold text-muted mb-1">SELECT CATEGORY</label>
                                        <select className="form-select border-0 bg-light p-3 shadow-sm"
                                                value={investment.type}
                                                onChange={(e) => setInvestment({...investment, type: e.target.value})}>
                                            <option>Gold Bonds</option>
                                            <option>Mutual Funds</option>
                                            <option>Fixed Deposits</option>
                                            <option>Equity Shares</option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="small fw-bold text-muted mb-1">AMOUNT TO INVEST (₹)</label>
                                        <input type="number" className="form-control border-0 bg-light p-3 shadow-sm" 
                                               placeholder="Enter amount"
                                               value={investment.amount}
                                               onChange={(e) => setInvestment({...investment, amount: e.target.value})} 
                                               required />
                                        {investment.amount > balance && (
                                            <small className="text-danger fw-bold mt-1 d-block">⚠️ Exceeds available balance</small>
                                        )}
                                    </div>

                                    <button className="btn btn-primary btn-lg w-100 fw-bold py-3 shadow" 
                                            disabled={isProcessing || investment.amount > balance}>
                                        {isProcessing ? "Processing Secure Transaction..." : "Confirm Investment"}
                                    </button>

                                    <button type="button" className="btn btn-link w-100 mt-3 text-muted text-decoration-none small"
                                            onClick={() => navigate("/dashboard")}>
                                        Return to Command Center
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Investments;