import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Transactions = () => {
    const [history, setHistory] = useState([]);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/api/user/transactions/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setHistory(res.data || []);
            } catch (err) {
                console.error("History Error:", err);
            }
        };
        fetchHistory();
    }, [userId, token]);

    return (
        <div className="container mt-5">
            <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white py-3 border-0">
                    <h4 className="fw-bold mb-0">Transaction History</h4>
                    <p className="text-muted small mb-0">Detailed view of your recent activities</p>
                </div>
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Transaction ID</th>
                                <th>Description</th>
                                <th>Date & Time</th>
                                <th>Amount</th>
                                <th className="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? (
                                history.map((txn) => (
                                    <tr key={txn.id}>
                                        <td className="ps-4 text-primary fw-bold">#TXN-{txn.id}</td>
                                        <td>
                                            <div className="fw-semibold">{txn.type}</div>
                                            <div className="small text-muted">{txn.description}</div>
                                        </td>
                                        <td className="text-muted small">
                                            {new Date(txn.timestamp).toLocaleString('en-IN')}
                                        </td>
                                        <td className={`fw-bold ${txn.type.includes('DEPOSIT') || txn.type.includes('CREDIT') ? 'text-success' : 'text-danger'}`}>
                                            {txn.type.includes('DEBIT') || txn.type.includes('WITHDRAW') ? '-' : '+'} 
                                            ₹{txn.amount.toLocaleString('en-IN')}
                                        </td>
                                        <td className="text-center">
                                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">Completed</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted fst-italic">No transactions found for this account.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transactions;