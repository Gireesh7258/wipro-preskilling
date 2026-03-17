import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { generatePDF } from '../utils/ReportGenerator';

const Dashboard = () => {
    const [data, setData] = useState({ 
        balance: 0, 
        investmentBalance: 0, 
        accountNumber: '', 
        investmentType: '' 
    });
    const [transactions, setTransactions] = useState([]);
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- NOTIFICATION & UI STATES ---
    const [notifications, setNotifications] = useState([]);
    const [showNotifs, setShowNotifs] = useState(false);

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    
    // FETCH DYNAMIC NAME
    const userName = localStorage.getItem("name") || "Welcome";

    const fetchDashboardData = useCallback(async () => {
        if (!token || !userId) return;
        try {
            // 1. Fetch Account Details
            const accountRes = await axios.get(`http://localhost:8081/api/user/account/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setData(accountRes.data);

            // 2. Fetch Audit Trail
            const txnRes = await axios.get(`http://localhost:8081/api/user/transactions/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setTransactions(txnRes.data || []);

            // 3. Fetch Loan Applications
            const loanRes = await axios.get(`http://localhost:8082/api/owner/loans/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const userLoans = loanRes.data.filter(l => l.userId === parseInt(userId));
            setLoans(userLoans);

            // --- SMART NOTIFICATION ENGINE ---
            const alerts = [];
            userLoans.forEach(l => {
                if (l.status === 'APPROVED') {
                    alerts.push({ id: `loan-${l.id}`, text: `SUCCESS: Your ${l.loanType} loan is APPROVED!`, type: 'success' });
                } else if (l.status === 'REJECTED') {
                    alerts.push({ id: `loan-${l.id}`, text: `UPDATE: Your ${l.loanType} application was declined.`, type: 'danger' });
                }
            });
            if (accountRes.data.balance < 1000) {
                alerts.push({ id: 'low-bal', text: "ALERT: Minimum balance warning (Below ₹1,000).", type: 'warning' });
            }
            setNotifications(alerts);

        } catch (err) {
            console.error("Sync Error:", err);
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate("/");
            }
        } finally {
            setLoading(false);
        }
    }, [userId, token, navigate]);

    useEffect(() => {
        if (!token) navigate("/");
        else {
            fetchDashboardData();
            const interval = setInterval(fetchDashboardData, 10000); 
            return () => clearInterval(interval);
        }
    }, [token, navigate, fetchDashboardData]);

    // --- PDF GENERATION HANDLER ---
    const handleDownloadStatement = () => {
        const headers = ["Date", "Type", "Description", "Amount (INR)"];
        const rows = transactions.map(t => [
            new Date(t.timestamp).toLocaleDateString(),
            t.type.replace('_', ' '),
            t.description || 'General Transaction',
            t.amount.toLocaleString('en-IN')
        ]);
        generatePDF(`Account Ledger - ${userName}`, headers, rows, `MyFin_Statement_${userName.replace(/\s+/g, '_')}`);
    };

    if (loading) return (
        <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-white">
            <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}} role="status"></div>
            <h5 className="fw-bold text-dark italic">MyFin • Secure Session Sync...</h5>
        </div>
    );

    return (
        <div className="container-fluid py-4 px-md-5" style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            
            {/* TOP COMMAND BAR */}
            <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-4 shadow-sm border">
                <div>
                    <span className="badge bg-primary mb-1 uppercase letter-spacing-1">Markapur Branch</span>
                    <h4 className="fw-bold mb-0">MyFin Bank • <span className="text-primary">{userName}</span></h4>
                </div>
                
                <div className="d-flex gap-3 align-items-center">
                    {/* NOTIFICATION HUB */}
                    <div className="position-relative">
                        <button className="btn btn-light rounded-circle shadow-sm border" onClick={() => setShowNotifs(!showNotifs)}>
                            🔔{notifications.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light" style={{fontSize:'10px'}}>
                                    {notifications.length}
                                </span>
                            )}
                        </button>

                        {showNotifs && (
                            <div className="position-absolute end-0 mt-3 shadow-lg rounded-4 bg-white p-3 border animate__animated animate__fadeInDown" style={{ width: '320px', zIndex: 1000 }}>
                                <h6 className="fw-bold border-bottom pb-2 mb-2">My System Alerts</h6>
                                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                    {notifications.length > 0 ? notifications.map(n => (
                                        <div key={n.id} className={`alert alert-${n.type} small py-2 mb-2 border-0 shadow-sm`}>
                                            {n.text}
                                        </div>
                                    )) : <p className="text-muted small text-center my-3 italic">Account Status: Normal</p>}
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="btn btn-dark fw-bold px-4 rounded-pill shadow-sm" onClick={() => {localStorage.clear(); navigate("/");}}>
                        Secure Logout
                    </button>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="row g-4">
                        {/* MAIN BALANCE CARD */}
                        <div className="col-md-6">
                            <div className="p-4 text-white shadow-lg d-flex flex-column justify-content-between" 
                                 style={{ 
                                     height: '260px', borderRadius: '28px', 
                                     background: 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)',
                                     border: '1px solid rgba(255,255,255,0.1)',
                                     position: 'relative', overflow: 'hidden'
                                 }}>
                                <div className="d-flex justify-content-between">
                                    <h5 className="fw-bold mb-0 italic text-warning">MyFin Platinum</h5>
                                    <div className="bg-warning rounded-2" style={{width: '45px', height: '30px', opacity: 0.8}}></div>
                                </div>
                                <div>
                                    <p className="small opacity-50 mb-0 uppercase tracking-1">Liquid Balance</p>
                                    <h1 className="fw-bold display-6">₹{data.balance?.toLocaleString('en-IN')}</h1>
                                    <small className="font-monospace tracking-widest opacity-75">{data.accountNumber}</small>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-light btn-sm flex-grow-1 fw-bold rounded-pill" onClick={() => navigate("/deposit")}>Deposit</button>
                                    <button className="btn btn-outline-light btn-sm flex-grow-1 fw-bold rounded-pill" onClick={() => navigate("/withdraw")}>Withdraw</button>
                                </div>
                            </div>
                        </div>

                        {/* PORTFOLIO CARD */}
                        <div className="col-md-6">
                            <div className="card h-100 border-0 shadow-sm p-4 rounded-4 bg-white position-relative overflow-hidden border">
                                <div className="position-absolute top-0 end-0 p-3 opacity-10 display-1">📈</div>
                                <h6 className="text-muted small fw-bold mb-3 uppercase tracking-1">Portfolio Summary</h6>
                                <div className="mb-3">
                                    <small className="text-muted d-block uppercase fw-bold" style={{fontSize:'10px'}}>Active Strategy</small>
                                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold border border-primary">
                                        {data.investmentType || 'Standard Savings'}
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <small className="text-muted d-block uppercase fw-bold" style={{fontSize:'10px'}}>Locked Capital</small>
                                    <h2 className="fw-bold text-dark">₹{data.investmentBalance?.toLocaleString('en-IN')}</h2>
                                </div>
                                <div className="d-flex gap-2 mt-auto">
                                    <button className="btn btn-primary btn-sm flex-grow-1 fw-bold rounded-3" onClick={() => navigate("/investments")}>Invest More</button>
                                    <button className="btn btn-outline-secondary btn-sm flex-grow-1 fw-bold rounded-3" onClick={() => navigate("/investments/liquidate")}>Liquidate</button>
                                </div>
                            </div>
                        </div>

                        
                        <div className="col-12">
                            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white border">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="fw-bold mb-0 text-muted uppercase tracking-1">Credit Line Tracker</h6>
                                    {/* RESTORED BUTTON HERE */}
                                    <button className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold" onClick={() => navigate("/loans")}>
                                        Apply New
                                    </button>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light text-muted small uppercase">
                                            <tr><th>Category</th><th>Principal Requested</th><th>Interest</th><th>Status</th></tr>
                                        </thead>
                                        <tbody>
                                            {loans.length > 0 ? loans.map((l, i) => (
                                                <tr key={i} className="border-top">
                                                    <td className="fw-bold py-3 text-dark">{l.loanType}</td>
                                                    <td className="fw-bold text-primary">₹{l.principal?.toLocaleString('en-IN')}</td>
                                                    <td className="small text-muted">{l.interestRate}% P.A.</td>
                                                    <td>
                                                        <span className={`badge rounded-pill px-3 py-2 ${
                                                            l.status === 'APPROVED' ? 'bg-success' : 
                                                            l.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'
                                                        }`}>
                                                            {l.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )) : <tr><td colSpan="4" className="text-center text-muted py-4 small italic">No active credit applications.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR: SERVICES & AUDIT LOG */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4 border">
                        <h6 className="fw-bold mb-4 text-muted uppercase tracking-1">Branch Services</h6>
                        <div className="row g-3">
                            {[
                                { n: 'Transfer', i: '💸', p: '/transfer', c: '#eef2ff' },
                                { n: 'Ledger', i: '📄', p: '/transactions', c: '#fff7ed' },
                                { n: 'Wealth', i: '📈', p: '/investments', c: '#ecfdf5' },
                                { n: 'Support', i: '💬', p: '/support', c: '#fdf2f8' }
                            ].map((btn, idx) => (
                                <div key={idx} className="col-6">
                                    <div className="p-3 rounded-4 text-center shadow-sm" 
                                         onClick={() => navigate(btn.p)}
                                         style={{ backgroundColor: btn.c, cursor: 'pointer', transition: '0.2s' }}>
                                        <div className="fs-3 mb-1">{btn.i}</div>
                                        <span className="small fw-bold text-dark">{btn.n}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden border">
                        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                            <h6 className="mb-0 fw-bold text-muted uppercase tracking-1">Recent Activity</h6>
                            <button className="btn btn-link btn-sm text-primary text-decoration-none fw-bold" onClick={handleDownloadStatement}>
                                📄 Export PDF
                            </button>
                        </div>
                        <div className="card-body p-0" style={{maxHeight: '420px', overflowY: 'auto'}}>
                            {transactions.length > 0 ? transactions.map((txn, i) => (
                                <div key={i} className="px-4 py-3 border-bottom d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <div className={`p-2 rounded-circle me-3 ${
                                            txn.type.includes('DEPOSIT') || txn.type.includes('CREDIT') || txn.type.includes('LIQUID_CREDIT') ? 'bg-success' : 'bg-danger'
                                        } bg-opacity-10 text-center`} style={{width: '38px', height:'38px'}}>
                                            <span className="small fw-bold" style={{fontSize: '10px'}}>{
                                                txn.type.includes('DEPOSIT') || txn.type.includes('CREDIT') || txn.type.includes('LIQUID_CREDIT') ? 'IN' : 'OT'
                                            }</span>
                                        </div>
                                        <div>
                                            <p className="mb-0 fw-bold small text-dark">{txn.type.replace('_', ' ')}</p>
                                            <p className="mb-0 text-muted" style={{ fontSize: '10px' }}>{new Date(txn.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`fw-bold ${
                                        txn.type.includes('DEPOSIT') || txn.type.includes('CREDIT') || txn.type.includes('LIQUID_CREDIT') ? 'text-success' : 'text-danger'
                                    }`}>
                                        ₹{txn.amount?.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            )) : <div className="p-5 text-center text-muted small italic">No ledger activity detected.</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;