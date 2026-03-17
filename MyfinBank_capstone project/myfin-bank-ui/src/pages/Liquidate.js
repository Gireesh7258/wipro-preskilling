import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Liquidate = () => {
    const [amount, setAmount] = useState("");
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const handleLiquidate = async (e) => {
    e.preventDefault();
    try {
        // MUST CALL THE LIQUIDATE ENDPOINT
        await axios.post("http://localhost:8081/api/user/invest/liquidate", {
            userId: userId,
            amount: amount
        }, { headers: { 'Authorization': `Bearer ${token}` } });
        alert("Investment Liquidated to Main Account!");
        navigate("/dashboard");
    } catch (err) { alert(err.response?.data || "Liquidation Failed"); }
};

    return (
        <div className="container py-5">
            <div className="card shadow-sm border-0 rounded-4 p-4 mx-auto" style={{maxWidth: '400px'}}>
                <h4 className="fw-bold mb-4 text-success">Sell <span className="text-dark">Investment</span></h4>
                <p className="small text-muted">This will move funds from your Portfolio back to your Liquid Balance.</p>
                <form onSubmit={handleLiquidate}>
                    <input type="number" className="form-control mb-3 p-3 rounded-3 bg-light border-0" 
                           placeholder="Amount to Liquidate" value={amount}
                           onChange={(e) => setAmount(e.target.value)} required />
                    <button className="btn btn-success w-100 py-3 fw-bold rounded-pill">Liquidate Now</button>
                    <button type="button" className="btn btn-link w-100 mt-2 text-muted" onClick={() => navigate("/dashboard")}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default Liquidate;