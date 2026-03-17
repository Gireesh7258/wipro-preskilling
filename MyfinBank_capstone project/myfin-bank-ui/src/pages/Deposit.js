import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Deposit = () => {
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleDeposit = async (e) => {
        e.preventDefault();
        
        // Fetch credentials from storage
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
            alert("Session expired. Please login again.");
            navigate("/");
            return;
        }

        setIsLoading(true);

        try {
            // FIX: Sending as a JSON object to match @RequestBody in Java
            const payload = {
                userId: parseInt(userId),
                amount: parseFloat(amount)
            };

            await axios.post("http://localhost:8081/api/user/deposit", payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' // Crucial fix for your logs
                }
            });

            alert(`₹${amount} deposited successfully into your Markapur branch account.`);
            navigate("/dashboard");
        } catch (err) {
            console.error("Deposit Error:", err.response?.data || err.message);
            alert("Deposit failed. Ensure User Service is running on port 8081.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow border-0 p-4" style={{ borderRadius: '20px' }}>
                        <div className="text-center mb-4">
                            <div className="display-4 mb-2">📥</div>
                            <h3 className="fw-bold">Add Funds</h3>
                            <p className="text-muted small">Secure Instant Deposit</p>
                        </div>
                        
                        <form onSubmit={handleDeposit}>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">AMOUNT (₹)</label>
                                <input 
                                    type="number" 
                                    className="form-control form-control-lg border-0 bg-light p-3" 
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required 
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
                                style={{ backgroundColor: '#002e6e', borderRadius: '12px' }}
                                disabled={isLoading || !amount}
                            >
                                {isLoading ? "Processing..." : "Confirm Deposit"}
                            </button>
                            
                            <button 
                                type="button" 
                                className="btn btn-link w-100 mt-3 text-decoration-none text-muted"
                                onClick={() => navigate("/dashboard")}
                            >
                                Cancel and Return
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Deposit;