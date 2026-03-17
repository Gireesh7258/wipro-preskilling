import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Withdraw = () => {
    const [amount, setAmount] = useState("");
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    // This name was 'handleWithdraw' in your logic...
    const handleWithdraw = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8081/api/user/withdraw", {
                userId: userId,
                amount: amount
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert("Main Account Withdrawal Successful!");
            navigate("/dashboard");
        } catch (err) {
            alert(err.response?.data || "Withdrawal Failed");
        }
    };

    return (
        <div className="container py-5">
            <div className="card shadow-sm border-0 rounded-4 p-4 mx-auto" style={{maxWidth: '400px'}}>
                <h4 className="fw-bold mb-4">Main Account <span className="text-primary">Withdraw</span></h4>
                
                {/* FIX: Change 'handleLiquidate' to 'handleWithdraw' here! */}
                <form onSubmit={handleWithdraw}>
                    <input 
                        type="number" 
                        className="form-control mb-3 p-3 rounded-3 bg-light border-0" 
                        placeholder="Enter Amount" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)} 
                        required 
                    />
                    <button className="btn btn-primary w-100 py-3 fw-bold rounded-pill">
                        Confirm Withdrawal
                    </button>
                    <button type="button" className="btn btn-link w-100 mt-2 text-muted" onClick={() => navigate("/dashboard")}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Withdraw;