import { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import './chart.css';

interface ChartConfig {
    type: string;
    title: string;
    data: any;
    options?: any;
}

const AnalysisView = () => {
    const [charts, setCharts] = useState<ChartConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Store chart instances to destroy them later
    const chartInstancesRef = useRef<ChartJS[]>([]);
    // Store references to canvas elements
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

    useEffect(() => {
        fetchAnalytics();

        // Cleanup on unmount
        return () => {
            destroyCharts();
        };
    }, []);

    // Re-render charts when data changes
    useEffect(() => {
        if (charts.length > 0) {
            renderCharts();
        }
    }, [charts]);

    const destroyCharts = () => {
        chartInstancesRef.current.forEach(instance => {
            if (instance) instance.destroy();
        });
        chartInstancesRef.current = [];
    };

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            const { authService } = await import('../services/authService');
            const token = authService.getToken();

            const headers: HeadersInit = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('http://localhost:8002/api/analytics/dashboard', {
                headers: headers
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('Session expired. Please login again.');
                } else {
                    setError('Failed to load analytics data.');
                }
                setLoading(false);
                return;
            }

            const data: ChartConfig[] = await response.json();

            if (!Array.isArray(data) || data.length === 0) {
                setError('No analytics data available.');
            } else {
                setCharts(data);
            }
        } catch (err) {
            console.error(err);
            setError('Network error. Could not reach server.');
        } finally {
            setLoading(false);
        }
    };

    const renderCharts = () => {
        // Destroy existing before creating new to prevent "Canvas is already in use"
        destroyCharts();

        charts.forEach((config, index) => {
            const canvas = canvasRefs.current[index];
            if (canvas) {
                try {
                    const newChart = new ChartJS(canvas, {
                        type: config.type as any,
                        data: config.data,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        padding: 20,
                                        usePointStyle: true,
                                        font: {
                                            family: "'Inter', sans-serif",
                                            size: 12
                                        }
                                    }
                                },
                                tooltip: {
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    padding: 12,
                                    titleFont: { size: 13, weight: '600' },
                                    bodyFont: { size: 12 },
                                    cornerRadius: 8,
                                    displayColors: true
                                }
                            },
                            scales: config.type === 'bar' || config.type === 'line' ? {
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                        color: 'rgba(0, 0, 0, 0.05)',
                                        drawBorder: false
                                    },
                                    ticks: { font: { size: 11 } }
                                },
                                x: {
                                    grid: { display: false },
                                    ticks: { font: { size: 11 } }
                                }
                            } : undefined,
                            ...config.options
                        }
                    });
                    chartInstancesRef.current.push(newChart);
                } catch (err) {
                    console.error(`Failed to render chart ${index}`, err);
                }
            }
        });
    };

    return (
        <div className="analysis-board-container fade-in">
            <h2 className="section-heading">Analysis Board</h2>

            {loading && (
                <div className="analysis-state-card glass-panel slide-up">
                    <div className="loader" style={{ margin: '0 auto 1rem' }}></div>
                    <p className="placeholder-text">Loading analytics...</p>
                </div>
            )}

            {error && !loading && (
                <div className="analysis-state-card glass-panel slide-up">
                    <p className="placeholder-text error-text">{error}</p>
                    <button
                        className="retry-btn"
                        onClick={fetchAnalytics}
                        style={{ marginTop: '1rem' }}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !error && charts.length > 0 && (
                <div className="charts-grid">
                    {charts.map((chart, index) => (
                        <div key={index} className="chart-card glass-panel slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <h3 className="chart-title">{chart.title}</h3>
                            <div className="chart-canvas-wrapper">
                                <canvas
                                    ref={el => { canvasRefs.current[index] = el; }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnalysisView;