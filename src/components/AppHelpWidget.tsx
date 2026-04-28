import React, { useState, useEffect, useRef, type SyntheticEvent } from 'react';
import axios from 'axios'; // Assuming you use axios, or you can swap to fetch

interface Message {
    sender: 'ai' | 'user';
    text: string;
}

interface AppHelpResponse {
    reply: string;
}

const AppHelpWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    // Unique Chat ID for the session, generated once
    const [chatId] = useState<string>(() => Math.random().toString(36).substring(7));

    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "Hi! I'm your app assistant. Need help finding your way around?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll to the bottom of the chat when new messages arrive
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input;
        setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: userText }]);
        setIsLoading(true);

        try {
            // Adjust the URL/Axios instance to match your project's setup
            const response = await axios.post<AppHelpResponse>('http://localhost:8080/api/v1/help/chat', {
                chatId: chatId,
                message: userText
            });

            setMessages(prev => [...prev, { sender: 'ai', text: response.data.reply }]);
        } catch (error) {
            console.error('App Help Chat Error:', error);
            setMessages(prev => [...prev, {
                sender: 'ai',
                text: "I'm having trouble connecting to the server right now. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 left-8 z-50 flex flex-col items-start">

            {/* The Chat Window (Conditionally Rendered) */}
            {isOpen && (
                <div className="mb-4 flex h-[400px] w-80 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
                        <h3 className="font-semibold tracking-tight text-white">App Assistant</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-primary-foreground/80 hover:text-white focus:outline-none"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`whitespace-pre-wrap leading-relaxed max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                    msg.sender === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                                        : 'bg-background border border-border text-foreground rounded-bl-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-background border border-border text-muted-foreground rounded-2xl rounded-bl-sm px-4 py-2 text-sm shadow-sm flex items-center gap-1">
                                    <span className="animate-bounce">●</span>
                                    <span className="animate-bounce delay-100">●</span>
                                    <span className="animate-bounce delay-200">●</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="border-t border-border bg-background p-3 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            disabled={isLoading}
                            className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}

            {/* The Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                    {/* Simple Help Icon (Question Mark) */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <path d="M12 17h.01"></path>
                    </svg>
                </button>
            )}
        </div>
    );
};

export default AppHelpWidget;