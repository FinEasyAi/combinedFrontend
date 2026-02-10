import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import './MainContent.css';

import TypeSelection from './TypeSelection';
import Chatbot from './Chatbot';
import DocumentAssistant from './components/DocumentAssistant/DocumentAssistant';
import AnalysisSummary from './components/AnalysisSummary/AnalysisSummary';

export default function MainContent() {

    // --- Views ---

    const SelectionView = () => (
        <DocumentAssistant />
    );

    return (
        <main className="main-content">
            <div className="content-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/select-type" element={<TypeSelection />} />
                    <Route path="/upload" element={<SelectionView />} />
                    {/* Redirect base paths to upload */}
                    <Route path="/analysis-summary" element={<Navigate to="/upload" replace />} />
                    <Route path="/chatbot" element={<Navigate to="/upload" replace />} />

                    <Route path="/analysis-summary/:id" element={<AnalysisSummary />} />
                    <Route path="/chatbot/:id" element={<Chatbot />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </main>
    );
}

