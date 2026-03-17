import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ApplyLoan = () => {
    const [loan, setLoan] = useState({ 
        principal: 100000, 
        tenure: 12, 
        interestRate: 10.5, 
        loanType: 'PERSONAL' 
    });
    const [emi, setEmi] = useState(0);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true); // NEW: To stop the loop
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("No token found, redirecting...");
                navigate("/");
            } else {
                setIsVerifying(false); // Stop the "Verifying" state
            }
        };
        checkAuth();
    }, [navigate]);

    const handleTypeChange = (e) => {
        const type = e.target.value;
        let rate = 10.5;
        if (type === 'HOME') rate = 8.5;
        if (type === 'CAR') rate = 9.0;
        setLoan({ ...loan, loanType: type, interestRate: rate });
    };

    const calculateEmi = async () => {
        const token = localStorage.getItem("token");
        setIsCalculating(true);
        try {
            const res = await axios.post(`http://localhost:8082/api/owner/calculate-emi`, 
            { 
                amount: parseFloat(loan.principal), 
                interestRate: parseFloat(loan.interestRate), 
                tenure: parseInt(loan.tenure) 
            },
            {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setEmi(res.data);
        } catch (err) {
            alert("EMI calculation failed. Check Owner Service (8082).");
        } finally {
            setIsCalculating(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        
        const payload = { 
            userId: parseInt(userId), 
            principal: parseFloat(loan.principal), 
            tenure: parseInt(loan.tenure), 
            interestRate: parseFloat(loan.interestRate), 
            loanType: loan.loanType,
            status: 'PENDING' 
        };

        try {
            await axios.post("http://localhost:8082/api/owner/apply-loan", payload, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            alert("Loan application submitted successfully!");
            navigate("/dashboard");
        } catch (err) {
            alert("Submission failed. Session may have expired.");
            navigate("/");
        }
    };

    // While checking if the user is logged in, show a simple loader
    if (isVerifying) {
        return <div className="vh-100 d-flex align-items-center justify-content-center">Authenticating...</div>;
    }

    return (
        <div className="container mt-5 animate__animated animate__fadeIn">
            <div className="row g-4">
                <div className="col-md-7">
                    <div className="card shadow-lg border-0 p-4 rounded-4">
                        <div className="d-flex align-items-center mb-4">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-4 me-3">🏢</div>
                            <h4 className="fw-bold mb-0">Loan Application</h4>
                        </div>
                        <form onSubmit={handleApply}>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="small fw-bold text-muted">CATEGORY</label>
                                    <select className="form-select bg-light border-0 p-3" value={loan.loanType} onChange={handleTypeChange}>
                                        <option value="PERSONAL">Personal (10.5%)</option>
                                        <option value="HOME">Home (8.5%)</option>
                                        <option value="CAR">Car (9.0%)</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="small fw-bold text-muted">RATE</label>
                                    <input type="text" className="form-control bg-light border-0 p-3" value={`${loan.interestRate}%`} disabled />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="small fw-bold text-muted">PRINCIPAL (₹)</label>
                                <input type="number" className="form-control bg-light border-0 p-3" value={loan.principal} onChange={(e) => setLoan({...loan, principal: e.target.value})} required />
                            </div>
                            <div className="mb-4">
                                <label className="small fw-bold text-muted">TENURE (MONTHS)</label>
                                <input type="number" className="form-control bg-light border-0 p-3" value={loan.tenure} onChange={(e) => setLoan({...loan, tenure: e.target.value})} required />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-primary w-100 py-3 rounded-3 shadow-sm" onClick={calculateEmi} disabled={isCalculating}>
                                    {isCalculating ? "..." : "Calculate EMI"}
                                </button>
                                <button type="submit" className="btn btn-success w-100 py-3 rounded-3 shadow-sm">Apply Now</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="card shadow-lg border-0 text-white p-5 text-center h-100 d-flex flex-column justify-content-center" 
                         style={{ background: 'linear-gradient(135deg, #002e6e 0%, #0056b3 100%)', borderRadius: '24px' }}>
                        <h6 className="opacity-50 small fw-bold mb-2">Monthly EMI</h6>
                        <h1 className="display-3 fw-bold mb-3">₹{emi ? emi.toLocaleString('en-IN') : "0"}</h1>
                        <button className="btn btn-link text-white opacity-50 small" onClick={() => navigate("/dashboard")}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplyLoan;