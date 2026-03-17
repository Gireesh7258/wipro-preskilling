import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- CORE PAGES ---
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Support from './pages/Support';

// --- BANKING OPERATIONS ---
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw'; // For Main Account
import FundsTransfer from './pages/FundsTransfer';

// --- WEALTH & LOANS ---
import Investments from './pages/Investments';
import Liquidate from './pages/Liquidate'; // For Investment Account
import ApplyLoan from './pages/ApplyLoan';

// --- ADMIN/BANKER PORTAL ---
import AdminDashboard from './pages/AdminDashboard';
import AdminUserTransactions from './pages/AdminUserTransactions';
/**
 * MyFin Digital Banking - Application Router
 * Markapur Branch Portal
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* --- PUBLIC ACCESS --- */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/register" element={<Register />} />
          
          {/* --- CUSTOMER COMMAND CENTER --- */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/support" element={<Support />} />
          
          {/* --- MAIN ACCOUNT ACTIONS --- */}
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/transfer" element={<FundsTransfer />} />
          
          {/* --- WEALTH MANAGEMENT ACTIONS --- */}
          <Route path="/investments" element={<Investments />} />
          <Route path="/investments/liquidate" element={<Liquidate />} />
          
          {/* --- LOAN SERVICES --- */}
          <Route path="/loans" element={<ApplyLoan />} />
          <Route path="/apply-loan" element={<ApplyLoan />} />

          {/* --- BANKER ADMINISTRATION --- */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/transactions/:userId" element={<AdminUserTransactions />} />
          {/* --- SECURITY GUARD: Redirect unknown paths to Login --- */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;