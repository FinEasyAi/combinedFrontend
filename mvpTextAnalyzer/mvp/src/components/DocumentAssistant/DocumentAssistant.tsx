import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DocumentAssistant.css';

interface Assistant {
    id: number;
    name: string;
    createdAt: string;
}

export default function DocumentAssistant() {
    const [assistants, setAssistants] = useState<Assistant[]>([]);
    const [name, setName] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    // Load assistants on mount
    useEffect(() => {
        fetchAssistants();
    }, []);

    const fetchAssistants = async () => {
        try {
            const { assistantService } = await import('../../services/assistantService');
            const result = await assistantService.listAssistants();
            if (result.success && Array.isArray(result.data)) {
                // Map API response to expected structure if needed, or if API matches great.
                // API returns: { name, id, user_id, backboard_assistant_id, created_at, documents }
                // Interface has: id, name, createdAt
                // We can map created_at to createdAt
                const mapped = result.data.map((a: any) => ({
                    id: a.id,
                    name: a.name,
                    createdAt: a.created_at ? a.created_at.split('T')[0] : 'N/A'
                }));
                setAssistants(mapped);
            }
        } catch (error) {
            console.error('Error fetching assistants:', error);
        }
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleCreate = async () => {
        if (!name || !selectedFile) return;

        setIsLoading(true);

        try {
            const { assistantService } = await import('../../services/assistantService');
            const result = await assistantService.createAssistant(name, selectedFile);

            if (result.success && result.data) {
                // Navigate to chatbot with new assistant
                navigate(`/chatbot/${result.data.id}`);
            } else {
                console.error('Failed to create assistant');
                alert('Failed to create assistant');
            }
        } catch (error) {
            console.error('Error creating assistant:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        // Implement delete if API exists
        // User didn't ask for delete implementation details but specified DELETE endpoint in request?
        // DELETE /api/assistants/{assistant_id}

        try {
            const { authService } = await import('../../services/authService');
            const token = authService.getToken();
            const response = await fetch(`http://localhost:8002/api/assistants/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setAssistants(prev => prev.filter(a => a.id !== id));
            }
        } catch (error) {
            console.error('Error deleting assistant:', error);
        }
    };

    const handleChat = (id: number) => {
        navigate(`/chatbot/${id}`);
    };

    const handleAnalyze = (id: number) => {
        navigate(`/analysis-summary/${id}`);
    };

    return (
        <div className="assistant-container embedded">
            {/* ... header and form ... */}
            {/* Note: I am truncating the middle part as I can't match it all easily without errors if I include too much context. 
                 I'll target the table rows specifically or the whole file if needed.
                 Wait, I can't use "..." in ReplacementContent. 
                 I will target the specific functions and the table row content separately or use multi_replace.
             */}
            {/* Header Section */}
            <header className="assistant-header">
                <h1 className="title-large">FinEasy Document Analyzer</h1>
                <div className="subtitle">Upload the document for analysis</div>
            </header>

            {/* Create Section */}
            <div className="form-card">
                <h2 className="sub-section-heading">Create New Assistant</h2>

                <div className="input-group">
                    <label className="input-label">Assistant Name</label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="e.g., Financial Report Analyzer"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Upload Initial Document</label>
                    <div className="file-upload-wrapper">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden-input"
                            onChange={handleFileChange}
                        />
                        <button className="file-chosen-btn" onClick={handleFileClick}>
                            Choose File
                        </button>
                        <span className="file-name-display">
                            {selectedFile ? selectedFile.name : 'No file chosen'}
                        </span>
                    </div>
                </div>

                <button
                    className="create-btn"
                    onClick={handleCreate}
                    disabled={isLoading || !name || !selectedFile}
                >
                    {isLoading ? 'Creating...' : 'Create Assistant'}
                </button>
            </div>

            {/* List Section */}
            <div className="table-card">
                <table className="assistants-table">
                    <thead>
                        <tr>
                            <th style={{ width: '10%' }}>SN</th>
                            <th style={{ width: '40%' }}>Name</th>
                            <th style={{ width: '30%' }}>Created At</th>
                            <th style={{ width: '20%' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assistants.length > 0 ? (
                            assistants.map((assistant, index) => (
                                <tr key={assistant.id}>
                                    <td>{index + 1}</td>
                                    <td>{assistant.name}</td>
                                    <td>{assistant.createdAt}</td>
                                    <td>
                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => handleDelete(assistant.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="action-btn chat-btn"
                                            onClick={() => handleChat(assistant.id)}
                                            style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}
                                        >
                                            Chat
                                        </button>
                                        <button
                                            className="action-btn analyze-btn"
                                            onClick={() => handleAnalyze(assistant.id)}
                                            style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Analyze
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="empty-state">
                                    No assistants found. Create one above!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
