// src/TypeSelection.tsx
import { useNavigate } from 'react-router-dom';
import './TypeSelection.css';

export default function TypeSelection() {
    const navigate = useNavigate();
    // Force HMR update

    return (
        <div className="stage-container fade-in">
            <div className="selection-card slide-up">
                <h1 className="selection-title">Start the analysis</h1>
                <p className="selection-subtitle">Choose the choice to proceed ahead</p>

                <div className="button-group">
                    <button
                        className="selection-btn"
                        onClick={() => navigate('/upload')}
                    >
                        Audio
                    </button>
                    <button
                        className="selection-btn"
                        onClick={() => window.location.href = 'http://localhost:5175/upload'}
                    >
                        Text
                    </button>
                </div>
            </div>
        </div>
    );
}
