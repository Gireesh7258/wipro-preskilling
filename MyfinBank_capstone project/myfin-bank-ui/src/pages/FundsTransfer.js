import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FundsTransfer = () => {
    const [recipientAcc, setRecipientAcc] = useState("");
    const [amount, setAmount] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const handleTransfer = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        setIsProcessing(true);
        try {
            // CRITICAL: Keys must match the UserController Map exactly
            const payload = {
                fromUserId: userId,      // Key: fromUserId
                toAccountNumber: recipientAcc, // Key: toAccountNumber
                amount: amount           // Key: amount
            };

            await axios.post("http://localhost:8081/api/user/transfer", payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            alert(`Success! ₹${amount} transferred to ${recipientAcc}`);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Transfer failed. Please check: \n1. Recipient Account exists \n2. You have enough balance.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg border-0 p-4 rounded-4 animate__animated animate__fadeIn">
                        <div className="text-center mb-4">
                            <h3 className="fw-bold">Interbank Transfer</h3>
                            <p className="text-muted small">Markapur Branch • Secure Channel</p>
                        </div>
                        <form onSubmit={handleTransfer}>
                            <div className="mb-3 text-start">
                                <label className="small fw-bold text-muted">RECIPIENT ACCOUNT</label>
                                <input type="text" className="form-control border-0 bg-light p-3" 
                                       placeholder="e.g. MFB-XXXXX" value={recipientAcc}
                                       onChange={(e) => setRecipientAcc(e.target.value)} required />
                            </div>
                            <div className="mb-4 text-start">
                                <label className="small fw-bold text-muted">AMOUNT (₹)</label>
                                <input type="number" className="form-control border-0 bg-light p-3" 
                                       placeholder="0.00" value={amount}
                                       onChange={(e) => setAmount(e.target.value)} required />
                            </div>
                            <button className="btn btn-primary btn-lg w-100 fw-bold py-3" 
                                    style={{backgroundColor: '#002e6e', borderRadius: '12px', border: 'none'}}
                                    disabled={isProcessing}>
                                {isProcessing ? "Processing..." : "Confirm Transfer"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FundsTransfer;