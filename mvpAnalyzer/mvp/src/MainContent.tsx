import { useState, useRef, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Home from './Home';
import './MainContent.css';
import AnalysisView from './Chart/Chart';
import TypeSelection from './TypeSelection';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface AudioRecord {
    audio_id: number;
    name: string;
    status: string;
    description?: string | null;
}

interface UploadedFile {
    id: number;
    name: string;
    type: string;
    fileObject: File;
}

export default function MainContent() {
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
    const [errorCode, setErrorCode] = useState<string | null>(null);
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [audioList, setAudioList] = useState<AudioRecord[]>([]);
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

    // Derive analysis completion status from audioList
    // If ANY record is NOT completed, show "Try Again"
    // If ALL records are COMPLETED, show "See Analysis"
    // Note: If list is empty, treat as not completed (show Try Again) or error state
    const isAnalysisComplete = audioList.length > 0 && audioList.every(r => r.status === 'COMPLETED');
    const showSeeAnalysis = isAnalysisComplete;

    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Handlers ---

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const newFiles: UploadedFile[] = Array.from(event.target.files).map((file, index) => ({
                id: files.length + index + 1,
                name: file.name,
                type: file.type || 'audio/unknown',
                fileObject: file,
            }));
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    // Navigate to Status Page and trigger upload
    const handleProceed = () => {
        if (files.length === 0) return;
        setUploadStatus('uploading');
        navigate('/status');
    };



    const handleSeeAnalysis = () => {
        navigate('/analysis');
    };

    // --- API Effect ---
    // Trigger upload if we are on /status and status is 'uploading'
    useEffect(() => {
        if (location.pathname === '/status') {
            // 1. Handle Upload if needed
            if (uploadStatus === 'uploading') {
                const performUpload = async () => {
                    // Check auth first
                    const { authService } = await import('./services/authService');
                    if (!authService.isAuthenticated()) {
                        setUploadStatus('error');
                        setErrorCode("Authentication missing");
                        navigate('/login');
                        return;
                    }

                    const { audioService } = await import('./services/audioService');

                    // Upload files sequentially or parallel. API seems to take single file?
                    // "file * string($binary)" -> Single file upload based on Swagger.
                    // We'll upload the first file for now or loop if multiple supported.
                    // The UI allows multiple, let's loop.

                    let hasError = false;

                    for (const file of files) {
                        const result = await audioService.uploadAudio(file.fileObject);
                        if (!result.success) {
                            hasError = true;
                            setErrorCode(result.error || "Upload failed");
                            // Keep going or stop? Let's stop on first error for MVP
                            break;
                        }
                    }

                    if (!hasError) {
                        setUploadStatus('success');
                        setErrorCode(null);
                        // Fetch list after successful upload
                        fetchAudioList();
                    } else {
                        setUploadStatus('error');
                        // errorCode already set
                    }
                };
                performUpload();
            } else {
                // If just visiting /status (e.g. redirected or navigated), fetch list
                fetchAudioList();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, uploadStatus]);

    const fetchAudioList = async () => {
        const { audioService } = await import('./services/audioService');
        const result = await audioService.getUserAudios();

        if (result.success && result.data) {
            setAudioList(result.data);
        } else {
            console.error("Failed to fetch audio list", result.error);
            // Optionally handle 401 redirect if error indicates it, 
            // but authService handles token retrieval. 
            // If token is missing, result.error will say so.
        }
    };

    // Toggle row expansion
    const toggleRow = (id: number) => {
        setExpandedRowId(prev => prev === id ? null : id);
    };


    // --- Views ---

    const SelectionView = () => (
        <div className="stage-container fade-in">
            <h1 className="main-heading">FinEasy Audio Analyzer</h1>
            <p className="sub-heading">Upload the audio file for analysis</p>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                multiple
                accept="audio/*,video/*"
                onChange={handleFileChange}
            />

            <button className="upload-btn" onClick={handleUploadClick}>
                Upload
            </button>

            {files.length > 0 && (
                <div className="slide-up width-full">
                    <div className="status-card">
                        <div className="file-list">
                            {files.map((file) => (
                                <div key={file.id} className="file-row">
                                    <span className="file-index">{file.id}.</span>
                                    <div className="file-info">
                                        <span className="file-name" title={file.name}>{file.name}</span>
                                        <span className="file-type">{file.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="proceed-btn" onClick={handleProceed}>
                        Proceed
                    </button>
                </div>
            )}
        </div>
    );

    const StatusView = () => {
        // 1. Uploading State
        if (uploadStatus === 'uploading') {
            return (
                <div className="loader-container fade-in">
                    <div className="spinner"></div>
                    <p className="loader-text">Uploading files...</p>
                </div>
            );
        }

        // 2. Success/Error State
        const isSuccess = uploadStatus === 'success';


        return (
            <div className="stage-container fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className="section-heading" style={{ margin: 0 }}>Analysis Status</h2>
                    {audioList.length > 0 && (
                        <button
                            className="upload-btn"
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                height: 'auto',
                                backgroundColor: '#10b981' // Green for excel
                            }}
                            onClick={() => {
                                // Export Logic
                                try {
                                    // Header row
                                    const headers = [
                                        "Audio ID", "Name", "Status",
                                        "Intent", "Promise To Pay", "Risk Level",
                                        "Fraud Flag", "Emotion", "Stress Score",
                                        "Payment Date", "Amount", "Reject Reason"
                                    ];

                                    const rows = audioList.map(record => {
                                        let data: any = {};
                                        try {
                                            if (record.description) {
                                                data = JSON.parse(record.description);
                                            }
                                        } catch (e) {
                                            // Fallback if description is not JSON
                                            console.warn("Failed to parse description for export", record.audio_id);
                                        }

                                        const entities = data.entities || {};

                                        return [
                                            record.audio_id,
                                            `"${record.name.replace(/"/g, '""')}"`, // CSV escape
                                            record.status,
                                            data.intent || "",
                                            data.promise_to_pay ? "Yes" : "No",
                                            data.risk_level || "",
                                            data.fraud_flag ? "Yes" : "No",
                                            data.emotion_text || "",
                                            data.stress_score || "",
                                            entities.payment_date || "",
                                            entities.amount_inr || "",
                                            data.reject_reason || ""
                                        ].join(",");
                                    });

                                    const csvContent = [headers.join(","), ...rows].join("\n");
                                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                    const url = URL.createObjectURL(blob);
                                    const link = document.createElement("a");
                                    link.setAttribute("href", url);
                                    link.setAttribute("download", "analysis_report.csv");
                                    link.style.visibility = 'hidden';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                } catch (error) {
                                    console.error("Export failed", error);
                                    alert("Failed to export data");
                                }
                            }}
                        >
                            Export Excel
                        </button>
                    )}
                </div>

                <div className="status-card slide-up expanded-card">
                    <div className="file-list">
                        {audioList.length === 0 && uploadStatus !== 'error' ? (
                            <div className="empty-state" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                                <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Upload audio file to see status</p>
                                <button
                                    className="upload-btn"
                                    onClick={() => navigate('/upload')}
                                    style={{ margin: '0 auto', maxWidth: '200px' }}
                                >
                                    Go to Upload
                                </button>
                            </div>
                        ) : (
                            audioList.map((record, index) => (
                                <div key={record.audio_id} className="file-row-container">
                                    <div
                                        className={`file-row ${expandedRowId === record.audio_id ? 'active' : ''}`}
                                        onClick={() => toggleRow(record.audio_id)}
                                    >
                                        <span className="file-index">{index + 1}.</span>
                                        <div className="file-info">
                                            <span className="file-name" title={record.name}>{record.name}</span>
                                        </div>
                                        <div className="status-label-container">
                                            <span className={`status-label ${record.status === 'COMPLETED' ? 'status-success' :
                                                record.status === 'FAILED' ? 'status-error' : 'status-pending'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </div>
                                        <div className={`chevron ${expandedRowId === record.audio_id ? 'rotated' : ''}`}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className={`description-row ${expandedRowId === record.audio_id ? 'expanded' : ''}`}>
                                        <div className="description-content">
                                            <span className="desc-label">Analysis Result:</span>
                                            <p>{record.description || "Analysis pending or not available."}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {/* Fallback for error state specifically if we want to show local files or just the error message */}
                        {!isSuccess && files.length > 0 && uploadStatus === 'error' && (
                            audioList.length === 0 && (
                                files.map((file, index) => (
                                    <div key={file.id} className="file-row">
                                        <span className="file-index">{index + 1}.</span>
                                        <div className="file-info">
                                            <span className="file-name" title={file.name}>{file.name}</span>
                                        </div>
                                        <div className="status-label-container">
                                            <span className="status-label status-error">Failed</span>
                                            {errorCode && <span className="error-code">{errorCode}</span>}
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </div>

                {showSeeAnalysis ? (
                    <button className="proceed-btn slide-up" onClick={handleSeeAnalysis}>
                        See Analysis
                    </button>
                ) : (
                    <button className="retry-btn slide-up" onClick={handleSeeAnalysis}>
                        See Analysis
                    </button>
                )}

            </div>
        );
    };

    // Removed floating AnalysisView



    return (
        <main className="main-content">
            <div className="content-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/select-type" element={<TypeSelection />} />
                    <Route path="/upload" element={<SelectionView />} />
                    <Route path="/status" element={<StatusView />} />
                    <Route path="/analysis" element={<AnalysisView />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </main>
    );
}
