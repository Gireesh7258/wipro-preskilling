import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DepositFunds = () => {
    const [amount, setAmount] = useState("");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleDeposit = async (e) => {
        e.preventDefault();
        
        try {
            // Fulfills: Admin can monitor and users can add funds
            await axios.post(`http://localhost:8081/api/user/deposit`, null, {
                params: {
                    userId: userId,
                    amount: amount
                },
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert(`Success! ₹${amount} has been added to your account.`);
            navigate("/dashboard"); 
        } catch (error) {
            console.error("Deposit Error:", error);
            alert("Deposit failed. Check your connection to User-Service.");
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" 
             style={{ background: 'linear-gradient(135deg, #fdf2e9 0%, #ffffff 100%)' }}>
            
            <div className="card border-0 shadow-lg p-4" style={{ width: '100%', maxWidth: '420px', borderRadius: '20px' }}>
                <div className="card-body text-center">
                    <div className="mb-4">
                        <span style={{ fontSize: '50px' }}>💰</span>
                        <h2 className="fw-bold mt-2">Deposit Funds</h2>
                        <p className="text-muted">Top up your MyFin account balance</p>
                    </div>

                    <form onSubmit={handleDeposit}>
                        <div className="form-floating mb-4">
                            <input 
                                type="number" 
                                className="form-control border-0 bg-light" 
                                id="depAmount" 
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required 
                            />
                            <label htmlFor="depAmount">Amount (₹)</label>
                        </div>

                        <button className="btn btn-lg w-100 fw-bold shadow-sm" 
                                style={{ backgroundColor: '#ff6b00', color: 'white', borderRadius: '12px' }}>
                            Confirm Deposit
                        </button>
                    </form>
                    
                    <button className="btn btn-link mt-3 text-decoration-none text-muted small" onClick={() => navigate("/dashboard")}>
                        Go Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DepositFunds;