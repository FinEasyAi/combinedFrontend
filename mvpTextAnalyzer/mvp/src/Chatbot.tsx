import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Chatbot.css';

interface Message {
    id: number;
    text: string;
    sender: 'bot' | 'user';
}

export default function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { id } = useParams();
    const assistantId = id ? parseInt(id) : null;
    const navigate = useNavigate();

    useEffect(() => {
        if (!assistantId) {
            navigate('/upload');
            return;
        }
        // Initial bot message
        setMessages([{
            id: Date.now(),
            text: "Hello! Ask me anything about your documents.",
            sender: 'bot'
        }]);
    }, [assistantId, navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim() || !assistantId) return;

        const text = inputValue.trim();
        const newUserMsg: Message = {
            id: Date.now(),
            text: text,
            sender: 'user'
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const { assistantService } = await import('./services/assistantService');
            const result = await assistantService.chat(assistantId, text);

            if (result.success) {
                const newBotMsg: Message = {
                    id: Date.now() + 1,
                    text: result.data.response || "No response text provided.",
                    sender: 'bot'
                };
                setMessages(prev => [...prev, newBotMsg]);
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: "Error communicating with assistant.",
                    sender: 'bot'
                }]);
            }
        } catch (e) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Network Error.",
                sender: 'bot'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !assistantId) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const { assistantService } = await import('./services/assistantService');
            const result = await assistantService.uploadDocument(assistantId, file);

            if (result.success) {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    text: "System: New document added to context.",
                    sender: 'bot'
                }]);
            } else {
                alert("Upload failed.");
            }
        } catch (error) {
            alert("Upload error.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h2 id="assistantName">Chat (ID: {assistantId})</h2>
                <button onClick={() => navigate('/upload')}
                    style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '5px 10px', cursor: 'pointer' }}>
                    Back
                </button>
            </div>

            <div className="upload-area" style={{ margin: '20px 0', padding: '10px', border: '1px dashed #ccc' }}>
                <input
                    type="file"
                    id="newDoc"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <button
                    id="uploadBtn"
                    onClick={handleUploadClick}
                    style={{ padding: '5px 10px', cursor: 'pointer' }}
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Add Document'}
                </button>
                <span id="uploadStatus" style={{ marginLeft: '10px' }}></span>
            </div>

            <div className="chat-box" id="chatBox" style={{
                height: '400px',
                overflowY: 'auto',
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
                        style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            background: msg.sender === 'user' ? '#007bff' : '#f1f1f1',
                            color: msg.sender === 'user' ? 'white' : 'black',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            maxWidth: '70%'
                        }}
                    >
                        {msg.text}
                    </div>
                ))}
                {isTyping && (
                    <div className="message bot-msg" style={{ alignSelf: 'flex-start', background: '#f1f1f1', color: 'black', padding: '8px 12px', borderRadius: '10px', maxWidth: '70%' }}>
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area" style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    id="userInput"
                    placeholder="Type your question..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ flex: 1, padding: '10px' }}
                />
                <button id="sendBtn" onClick={handleSend} style={{ padding: '10px 20px', cursor: 'pointer' }}>Send</button>
            </div>
        </div>
    );
}
