import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BankerChat = ({ selectedUserId, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState("");
    const token = localStorage.getItem("token");

    // FIX: Wrapped in useCallback to satisfy ESLint and optimize performance
    const fetchHistory = useCallback(async () => {
        if (!selectedUserId || !token) return;
        try {
            const res = await axios.get(`http://localhost:8082/api/owner/support/history/${selectedUserId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (err) { 
            console.error("Chat fetch failed", err); 
        }
    }, [selectedUserId, token]);

    useEffect(() => {
        fetchHistory();
        
        // Polling for new messages every 5 seconds
        const timer = setInterval(fetchHistory, 5000);
        
        // Cleanup interval on unmount or when dependencies change
        return () => clearInterval(timer);
    }, [fetchHistory]); // fetchHistory is now a stable dependency

    const handleSend = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;
        try {
            await axios.post("http://localhost:8082/api/owner/support/send", {
                senderId: 999, // Static Admin/Banker ID
                receiverId: selectedUserId,
                content: reply
            }, {
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json' 
                }
            });
            setReply("");
            fetchHistory();
        } catch (err) { 
            alert("Failed to send reply. Banker session might have expired."); 
        }
    };

    return (
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden animate__animated animate__fadeInRight">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center p-3">
                <span className="fw-bold">Support: Customer #{selectedUserId}</span>
                <button className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
            </div>
            
            <div className="card-body bg-light overflow-auto" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                {messages.length === 0 ? (
                    <div className="text-center my-auto text-muted small">No previous conversation found.</div>
                ) : (
                    messages.map((m, i) => (
                        <div key={i} className={`d-flex mb-3 ${m.senderId === 999 ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div className={`p-3 rounded-4 shadow-sm ${m.senderId === 999 ? 'bg-primary text-white' : 'bg-white text-dark'}`} style={{ maxWidth: '80%' }}>
                                <p className="mb-0 small">{m.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form className="p-3 bg-white border-top d-flex" onSubmit={handleSend}>
                <input 
                    className="form-control border-0 bg-light me-2 rounded-pill px-3" 
                    value={reply} 
                    onChange={(e) => setReply(e.target.value)} 
                    placeholder="Type official response..." 
                />
                <button className="btn btn-primary rounded-pill px-4 fw-bold" type="submit">Send</button>
            </form>
        </div>
    );
};

export default BankerChat;