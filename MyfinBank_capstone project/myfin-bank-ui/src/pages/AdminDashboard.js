import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BankerChat from '../components/BankerChat';
import { generatePDF } from '../utils/ReportGenerator';

const AdminDashboard = () => {
    const [loans, setLoans] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('loans');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, capital: 0 });
    
    // --- NOTIFICATION STATES ---
    const [notifications, setNotifications] = useState([]);
    const [showNotifs, setShowNotifs] = useState(false);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            // 1. Fetch Loan Data from Owner Service
            const loanRes = await axios.get("http://localhost:8082/api/owner/loans/all", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const loanData = loanRes.data || [];
            setLoans(loanData);

            // 2. Fetch User Data from User Service
            const userRes = await axios.get("http://localhost:8081/api/user/all-customers", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const userData = userRes.data || [];
            setUsers(userData);

            // 3. Update Global Stats
            setStats({
                total: loanData.length,
                pending: loanData.filter(l => l.status === 'PENDING').length,
                approved: loanData.filter(l => l.status === 'APPROVED').length,
                capital: loanData.reduce((acc, curr) => acc + (curr.status === 'APPROVED' ? curr.principal : 0), 0)
            });

            // 4. GENERATE LIVE NOTIFICATIONS (Sprint 3 Goal)
            const alerts = [];
            userData.forEach(u => {
                if (u.balance === 0) {
                    alerts.push({ id: `zero-${u.id}`, text: `CRITICAL: ${u.name} reached ₹0 balance.`, type: 'danger' });
                }
            });
            loanData.forEach(l => {
                if (l.status === 'PENDING') {
                    alerts.push({ id: `loan-${l.id}`, text: `NEW LOAN: Application ID #${l.id} pending review.`, type: 'info' });
                }
            });
            setNotifications(alerts);

        } catch (err) { 
            console.error("Admin Sync Error", err); 
            if (err.response?.status === 401) navigate("/");
        }
    }, [token, navigate]);

    useEffect(() => {
        if (token) {
            fetchData();
            const interval = setInterval(fetchData, 15000); // Live sync every 15s
            return () => clearInterval(interval);
        }
    }, [fetchData, token]);

    // --- LOAN ACTIONS ---
    const handleLoanStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:8082/api/owner/loan-status/${id}?status=${status}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData();
        } catch (err) { alert("Status Update Failed"); }
    };

    // --- USER SECURITY ACTIONS ---
    const toggleUserSecurity = async (userId, current) => {
        try {
            await axios.put(`http://localhost:8081/api/user/status/${userId}?active=${!current}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData();
        } catch (err) { alert("Security Override Failed"); }
    };

    // --- REPORT GENERATION (Extra Marks Feature) ---
    const handleDownloadMasterReport = () => {
        const headers = ["Customer Name", "Account Number", "Liquid Balance", "Investment", "Status"];
        const rows = users.map(u => [
            u.name,
            u.accountNumber,
            `INR ${u.balance?.toLocaleString()}`,
            `INR ${u.investmentBalance?.toLocaleString() || 0}`,
            u.active ? "ACTIVE" : "SUSPENDED"
        ]);
        generatePDF("Bank Master Operations Report", headers, rows, "MyFin_Master_Report");
    };

    // --- SEARCH FILTER LOGIC ---
    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredLoans = loans.filter(l => 
        l.id.toString().includes(searchTerm) || 
        l.loanType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="d-flex" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
            
            {/* --- FIXED SIDEBAR --- */}
            <div className="bg-dark text-white p-4 d-none d-lg-block shadow" style={{ width: '280px' }}>
                <div className="mb-5 py-2 border-bottom border-secondary text-center">
                    <h3 className="fw-bold mb-0 text-primary italic">MyFin Admin</h3>
                    <small className="opacity-50">MARKAPUR OPERATIONS</small>
                </div>
                <nav className="nav flex-column gap-3">
                    <button className={`btn text-start p-3 border-0 rounded-4 ${activeTab === 'loans' ? 'btn-primary' : 'text-white-50'}`} onClick={() => {setActiveTab('loans'); setSearchTerm("");}}>
                        🏢 Loan Pipeline
                    </button>
                    <button className={`btn text-start p-3 border-0 rounded-4 ${activeTab === 'users' ? 'btn-primary' : 'text-white-50'}`} onClick={() => {setActiveTab('users'); setSearchTerm("");}}>
                        👥 User Management
                    </button>
                </nav>
                <div className="mt-auto pt-5">
                    <button className="btn btn-outline-danger w-100 rounded-pill mt-5" onClick={() => {localStorage.clear(); navigate("/");}}>Logout Terminal</button>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-grow-1 p-4 p-md-5 overflow-auto">
                
                {/* --- HEADER --- */}
                <header className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="fw-bold mb-0">People's <span className="text-primary">Bank</span></h2>
                        <p className="text-muted small">Branch Monitoring & Risk Control</p>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        {/* MASTER PDF BUTTON */}
                        <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={handleDownloadMasterReport}>
                            📥 Master Report
                        </button>

                        {/* NOTIFICATION CENTER */}
                        <div className="position-relative">
                            <button className="btn btn-white shadow-sm rounded-circle p-3 border-0 bg-white" onClick={() => setShowNotifs(!showNotifs)}>
                                🔔 {notifications.length > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '10px'}}>
                                        {notifications.length}
                                    </span>
                                )}
                            </button>

                            {showNotifs && (
                                <div className="position-absolute end-0 mt-3 shadow-lg rounded-4 bg-white p-3 border animate__animated animate__fadeInDown" style={{ width: '320px', zIndex: 1000 }}>
                                    <h6 className="fw-bold border-bottom pb-2 mb-2">Live System Alerts</h6>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {notifications.length > 0 ? notifications.map(n => (
                                            <div key={n.id} className={`alert alert-${n.type} small py-2 mb-2 border-0 shadow-sm`}>
                                                {n.text}
                                            </div>
                                        )) : <p className="text-muted small text-center my-3 italic">All Systems Normal</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* --- ANALYTICS CARDS --- */}
                <div className="row g-4 mb-5">
                    {[
                        { title: 'Portfolio Capital', val: `₹${stats.capital.toLocaleString()}`, icon: '💰', color: 'text-success' },
                        { title: 'Pending Tasks', val: stats.pending, icon: '⏳', color: 'text-warning' },
                        { title: 'Active Accounts', val: users.length, icon: '👤', color: 'text-primary' }
                    ].map((card, i) => (
                        <div key={i} className="col-md-4">
                            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                                <div className="d-flex justify-content-between mb-2">
                                    <h6 className="text-muted small fw-bold uppercase">{card.title}</h6>
                                    <span className="fs-5">{card.icon}</span>
                                </div>
                                <h2 className={`fw-bold mb-0 ${card.color}`}>{card.val}</h2>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- DATA SEARCH --- */}
                <div className="input-group shadow-sm rounded-4 overflow-hidden bg-white border mb-4">
                    <span className="input-group-text bg-white border-0 ps-3">🔍</span>
                    <input 
                        type="text" 
                        className="form-control border-0 py-3" 
                        placeholder={activeTab === 'loans' ? "Filter loans by ID or Category..." : "Search customers by name or account..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* --- DATA TABLES --- */}
                <div className="row g-4">
                    <div className={selectedUserId ? "col-lg-7" : "col-12"}>
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden border">
                            <div className="table-responsive">
                                <table className="table align-middle mb-0 table-hover">
                                    <thead className="bg-light text-muted small uppercase">
                                        {activeTab === 'loans' ? (
                                            <tr><th className="ps-4">Application</th><th>Category</th><th>Principal</th><th>Status</th><th>Control</th></tr>
                                        ) : (
                                            <tr><th className="ps-4">Customer</th><th>Account</th><th>Balance</th><th>Audit/Chat</th><th>Security</th></tr>
                                        )}
                                    </thead>
                                    <tbody>
                                        {activeTab === 'loans' ? (
                                            filteredLoans.map(l => (
                                                <tr key={l.id}>
                                                    <td className="ps-4 py-3 fw-bold text-dark">#APP-{l.id}</td>
                                                    <td><span className="badge bg-light text-dark border px-3">{l.loanType}</span></td>
                                                    <td className="fw-bold">₹{l.principal?.toLocaleString()}</td>
                                                    <td>
                                                        <span className={`badge rounded-pill px-3 py-2 ${l.status === 'APPROVED' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                            {l.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {l.status === 'PENDING' && (
                                                            <div className="btn-group">
                                                                <button className="btn btn-sm btn-success px-3" onClick={() => handleLoanStatus(l.id, 'APPROVED')}>✓</button>
                                                                <button className="btn btn-sm btn-outline-danger px-3" onClick={() => handleLoanStatus(l.id, 'REJECTED')}>✗</button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            filteredUsers.map(u => (
                                                <tr key={u.id}>
                                                    <td className="ps-4 py-3 fw-bold text-dark">{u.name}</td>
                                                    <td className="font-monospace text-primary small">{u.accountNumber}</td>
                                                    <td className={u.balance === 0 ? "text-danger fw-bold" : "fw-bold text-dark"}>
                                                        ₹{u.balance?.toLocaleString()}
                                                        {u.balance === 0 && <span className="ms-1 badge bg-danger" style={{fontSize: '8px'}}>ALERT</span>}
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-sm btn-outline-info me-2 rounded-pill px-3" onClick={() => navigate(`/admin/transactions/${u.id}`)}>Ledger</button>
                                                        <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => setSelectedUserId(u.id)}>Chat</button>
                                                    </td>
                                                    <td>
                                                        <button className={`btn btn-sm rounded-pill w-100 fw-bold ${u.active ? 'btn-dark' : 'btn-success'}`} onClick={() => toggleUserSecurity(u.id, u.active)}>
                                                            {u.active ? 'Suspend' : 'Allow'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* --- SUPPORT PANEL --- */}
                    {selectedUserId && (
                        <div className="col-lg-5 animate__animated animate__fadeInRight">
                            <BankerChat selectedUserId={selectedUserId} onClose={() => setSelectedUserId(null)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;