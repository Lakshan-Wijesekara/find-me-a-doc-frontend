import React, { useState, useRef, useEffect, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Interfaces matching your Backend DTOs ---
interface TriageResponse {
    isFinalBriefReady: boolean;
    nextQuestion: string;
    urgencyLevel: string;
    recommendedSpecialist: string;
    viralLikelihood: string;
    doctorBrief: string;
}

interface Message {
    sender: 'ai' | 'user';
    text: string;
}

const TriageChat: React.FC = () => {
    const navigate = useNavigate();
    // Unique Chat ID for the session
    const [chatId] = useState<string>(() => Math.random().toString(36).substring(7));

    // State Management
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "Hello. I am the AI triage assistant. Please describe your symptoms in detail." }
    ]);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [triageResult, setTriageResult] = useState<TriageResponse | null>(null);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input;
        setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: userText }]);
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/v1/triage/diagnose', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId, symptoms: userText })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data: TriageResponse = await response.json();

            if (data.isFinalBriefReady) {
                setMessages(prev => [...prev, {
                    sender: 'ai',
                    text: "I have completed your assessment. Please review the summary below."
                }]);
                setTriageResult(data);
            } else {
                setMessages(prev => [...prev, { sender: 'ai', text: data.nextQuestion }]); // Set the next question or finish the thing
            }
        } catch (error) {
            console.error('Triage Error:', error);
            setMessages(prev => [...prev, {
                sender: 'ai',
                text: "I'm having trouble finish analyzing, please start the conversation again?"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '650px', margin: '40px auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Medical Triage Chat</h2>

                {/* Chat Log */}
                <div style={{ height: '450px', overflowY: 'auto', marginBottom: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', margin: '12px 0' }}>
                            <div style={{
                                padding: '12px 16px',
                                borderRadius: '18px',
                                maxWidth: '80%',
                                fontSize: '15px',
                                lineHeight: '1.4',
                                backgroundColor: msg.sender === 'user' ? '#007bff' : '#ffffff',
                                color: msg.sender === 'user' ? '#fff' : '#333',
                                border: msg.sender === 'ai' ? '1px solid #dee2e6' : 'none',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && <div style={{ fontSize: '14px', color: '#6c757d', paddingLeft: '10px' }}>AI is analyzing...</div>}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                {!triageResult && (
                    <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g., I have a sharp pain in my chest..."
                            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ced4da' }}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            style={{ padding: '10px 24px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Send
                        </button>
                    </form>
                )}

                {/* Summary Card */}
                {triageResult && (
                    <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f0fff4', border: '2px solid #38a169', borderRadius: '12px' }}>
                        <h3 style={{ color: '#2f855a', marginTop: 0 }}>Preliminary Assessment</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                            <p><strong>Urgency:</strong> {triageResult.urgencyLevel}</p>
                            <p><strong>Specialist:</strong> {triageResult.recommendedSpecialist}</p>
                            <p><strong>Viral Likelihood:</strong> {triageResult.viralLikelihood}</p>
                        </div>
                        <p style={{ marginTop: '10px', borderTop: '1px solid #c6f6d5', paddingTop: '10px' }}>
                            <strong>Doctor's Brief:</strong> {triageResult.doctorBrief}
                        </p>

                        {/* The Booking Bridge Buttons */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button
                                onClick={() => navigate('/marketplace', {
                                    state: { ...triageResult, preSelectedSpecialty: triageResult.recommendedSpecialist }
                                })}
                                style={{ flex: 1, padding: '10px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#38a169', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Find a {triageResult.recommendedSpecialist}
                            </button>

                            <button
                                onClick={() => window.location.reload()}
                                style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #38a169', backgroundColor: 'transparent', color: '#2f855a', cursor: 'pointer' }}
                            >
                                Restart
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TriageChat;