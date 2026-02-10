import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AnalysisSummary.css';

interface AnalysisReport {
    summary: string;
    details: string;
    flags: {
        data_quality: string[];
        financial_risk: string[];
        performance_trend: string[];
        compliance: string[];
        fraud_indicators: string[];
    };
}

export default function AnalysisSummary() {
    const { id } = useParams();
    const assistantId = id ? parseInt(id) : null;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState<AnalysisReport | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!assistantId) {
            navigate('/upload');
            return;
        }
        runAnalysis();
    }, [assistantId, navigate]);

    const runAnalysis = async () => {
        setLoading(true);
        setError('');
        try {
            const { assistantService } = await import('../../services/assistantService');
            // Ensure assistantId is valid number
            if (!assistantId) return;

            const result = await assistantService.analyze(assistantId);

            if (result.success) {
                const analysisText = result.data.analysis;
                let jsonString = analysisText;
                // Attempt to clean markdown code blocks
                if (jsonString.includes('```json')) {
                    jsonString = jsonString.split('```json')[1].split('```')[0];
                } else if (jsonString.includes('```')) {
                    jsonString = jsonString.split('```')[1].split('```')[0];
                }

                try {
                    const parsedReport = JSON.parse(jsonString);
                    setReport(parsedReport);
                } catch (e) {
                    // Fallback if not JSON
                    setError("Could not parse analysis report JSON.");
                    console.error("Parse error", e);
                }
            } else {
                setError(result.error || "Analysis failed.");
            }
        } catch (err) {
            setError("Network error.");
        } finally {
            setLoading(false);
        }
    };

    const renderFlagList = (items: string[], colorClass: string) => {
        if (!items || items.length === 0) {
            return <li className="flag-item" style={{ borderLeftColor: '#28a745', backgroundColor: '#f0fff4', padding: '10px', listStyle: 'none', borderLeft: '4px solid #28a745', marginBottom: '5px' }}>No issues detected.</li>;
        }
        return items.map((item, index) => (
            <li key={index} className={`flag-item ${colorClass}`} style={{ padding: '10px', listStyle: 'none', borderLeft: '4px solid', marginBottom: '5px', backgroundColor: '#fff' }}>
                {item}
            </li>
        ));
    };

    if (loading) {
        return (
            <div className="container">
                <button onClick={() => navigate('/upload')} className="back-link" style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>&larr; Back to Documents</button>
                <h1>Deep Document Analysis</h1>
                <div id="loading" className="loading" style={{ margin: '20px 0', fontSize: '1.2em' }}>
                    Generating Analysis... this usually takes 10-20 seconds.<br />
                    Please wait.
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <button onClick={() => navigate('/upload')} className="back-link">&larr; Back to Documents</button>
                <h1>Deep Document Analysis</h1>
                <div style={{ color: 'red', margin: '20px 0' }}>{error}</div>
                <button onClick={runAnalysis}>Retry</button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate('/upload')} className="back-link" style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', marginBottom: '20px' }}>&larr; Back to Documents</button>
            <h1>Deep Document Analysis</h1>

            <div id="content" className="summary-card">
                <div className="section">
                    <h2>Summary</h2>
                    <p id="summaryText">{report?.summary || "No summary provided."}</p>
                </div>

                <div className="section">
                    <h2 style={{ color: '#ef4444' }}>🔴 Data Quality & Consistency</h2>
                    <ul id="dataQualityList" className="flag-list">
                        {renderFlagList(report?.flags?.data_quality || [], 'red-flag')}
                    </ul>
                </div>

                <div className="section">
                    <h2 style={{ color: '#f97316' }}>🟠 Financial Risk</h2>
                    <ul id="financialRiskList" className="flag-list">
                        {renderFlagList(report?.flags?.financial_risk || [], 'orange-flag')}
                    </ul>
                </div>

                <div className="section">
                    <h2 style={{ color: '#eab308' }}>🟡 Performance & Trends</h2>
                    <ul id="performanceList" className="flag-list">
                        {renderFlagList(report?.flags?.performance_trend || [], 'yellow-flag')}
                    </ul>
                </div>

                <div className="section">
                    <h2 style={{ color: '#3b82f6' }}>🔵 Compliance & Accounting</h2>
                    <ul id="complianceList" className="flag-list">
                        {renderFlagList(report?.flags?.compliance || [], 'blue-flag')}
                    </ul>
                </div>

                <div className="section">
                    <h2 style={{ color: '#a855f7' }}>🟣 Fraud & Anomalies</h2>
                    <ul id="fraudList" className="flag-list">
                        {renderFlagList(report?.flags?.fraud_indicators || [], 'purple-flag')}
                    </ul>
                </div>

                <div className="section">
                    <h2>Detailed Insights</h2>
                    <p id="detailsText" style={{ whiteSpace: 'pre-wrap' }}>{report?.details || ""}</p>
                </div>
            </div>
        </div>
    );
}
