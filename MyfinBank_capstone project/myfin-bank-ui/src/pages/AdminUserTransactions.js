import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { generatePDF } from '../utils/ReportGenerator'; // Import the utility

const AdminUserTransactions = () => {
    const { userId } = useParams();
    const [transactions, setTransactions] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchLedger = async () => {
            try {
                const userRes = await axios.get(`http://localhost:8081/api/user/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCustomer(userRes.data);

                const txnRes = await axios.get(`http://localhost:8081/api/user/transactions/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setTransactions(txnRes.data || []);
            } catch (err) {
                console.error("Ledger Fetch Error", err);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchLedger();
    }, [userId, token]);

    // --- PDF GENERATION LOGIC ---
    const handleDownloadLedger = () => {
        const headers = ["Timestamp", "Activity Type", "Description", "Amount (INR)"];
        const rows = transactions.map(t => [
            new Date(t.timestamp).toLocaleString(),
            t.type,
            t.description,
            `${t.type.includes('DEBIT') || t.type.includes('WITHDRAW') || t.type.includes('ALLOCATION') ? '-' : '+'} ${t.amount.toLocaleString('en-IN')}`
        ]);
        
        generatePDF(
            `Audit Ledger: ${customer?.name}`, 
            headers, 
            rows, 
            `Audit_Trail_${customer?.name.replace(/\s+/g, '_')}`
        );
    };

    if (loading) return <div className="p-5 text-center">Syncing Ledger Data...</div>;

    return (
        <div className="container-fluid py-5 bg-light min-vh-100">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <button className="btn btn-outline-secondary rounded-pill px-4 shadow-sm" onClick={() => navigate("/admin-dashboard")}>
                        ← Back to Directory
                    </button>
                    
                    {/* --- ADDED DOWNLOAD BUTTON --- */}
                    <div className="d-flex gap-3 align-items-center">
                        <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={handleDownloadLedger}>
                            📥 Download Ledger PDF
                        </button>
                        <div className="text-end">
                            <h3 className="fw-bold mb-0">Customer <span className="text-primary">Ledger</span></h3>
                            <p className="text-muted small mb-0">Viewing Audit Trail for: <strong>{customer?.name}</strong></p>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0 table-hover">
                            <thead className="bg-dark text-white small uppercase">
                                <tr>
                                    <th className="ps-4 py-3">Timestamp</th>
                                    <th>Activity Type</th>
                                    <th>Description</th>
                                    <th className="text-end pe-4">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length > 0 ? transactions.map((txn, i) => (
                                    <tr key={i} className="border-bottom">
                                        <td className="ps-4 py-3 small text-muted">
                                            {new Date(txn.timestamp).toLocaleString()}
                                        </td>
                                        <td>
                                            <span className={`badge rounded-pill px-3 ${
                                                txn.type.includes('CREDIT') || txn.type.includes('DEPOSIT') ? 'bg-success' : 'bg-danger'
                                            }`}>
                                                {txn.type}
                                            </span>
                                        </td>
                                        <td className="small text-secondary">{txn.description}</td>
                                        <td className={`text-end pe-4 fw-bold ${
                                            txn.type.includes('CREDIT') || txn.type.includes('DEPOSIT') ? 'text-success' : 'text-danger'
                                        }`}>
                                            {txn.type.includes('CREDIT') || txn.type.includes('DEPOSIT') ? '+' : '-'} ₹{txn.amount?.toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserTransactions;