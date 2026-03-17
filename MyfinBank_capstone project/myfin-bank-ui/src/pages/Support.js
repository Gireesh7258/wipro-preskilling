import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Support = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const chatEndRef = useRef(null);

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const fetchChat = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:8082/api/owner/support/history/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (err) { console.error("Chat sync failed"); }
    }, [userId, token]);

    useEffect(() => {
        fetchChat();
        const interval = setInterval(fetchChat, 5000);
        return () => clearInterval(interval);
    }, [fetchChat]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        try {
            await axios.post("http://localhost:8082/api/owner/support/send", {
                senderId: parseInt(userId),
                receiverId: 999, // Banker ID
                content: input
            }, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            setInput("");
            fetchChat();
        } catch (err) { alert("Message failed to send."); }
    };

    return (
        <div className="container py-5">
            <div className="card shadow-lg border-0 rounded-4 mx-auto" style={{ maxWidth: '500px' }}>
                <div className="p-3 bg-primary text-white d-flex justify-content-between align-items-center rounded-top-4">
                    <span className="fw-bold">Markapur Branch Support</span>
                    <button className="btn btn-sm btn-light rounded-pill" onClick={() => navigate("/dashboard")}>Close</button>
                </div>
                
                <div className="card-body bg-light overflow-auto" style={{ height: '450px' }}>
                    {messages.map((m, i) => (
                        <div key={i} className={`d-flex mb-3 ${m.senderId === parseInt(userId) ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div className={`p-3 rounded-4 shadow-sm ${m.senderId === parseInt(userId) ? 'bg-primary text-white' : 'bg-white text-dark'}`} style={{ maxWidth: '80%' }}>
                                <p className="mb-0 small">{m.content}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <form className="p-3 border-top bg-white d-flex" onSubmit={handleSend}>
                    <input className="form-control border-0 bg-light me-2 rounded-pill" 
                           placeholder="Type your query..." value={input}
                           onChange={(e) => setInput(e.target.value)} />
                    <button type="submit" className="btn btn-primary rounded-circle">➤</button>
                </form>
            </div>
        </div>
    );
};

export default Support;