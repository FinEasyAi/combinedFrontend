import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./chart.css";

const API_URL = "http://localhost:3000/api/analytics/dashboard";

const AnalysisView = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartsRef = useRef<Chart[]>([]);

    useEffect(() => {
        loadAnalytics();

        return () => {
            chartsRef.current.forEach(chart => chart.destroy());
            chartsRef.current = [];
        };
    }, []);

    async function loadAnalytics() {
        if (!containerRef.current) return;

        // Cleanup previous charts
        chartsRef.current.forEach(chart => chart.destroy());
        chartsRef.current = [];
        containerRef.current.innerHTML = "";

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) return;

            const chartsData = await response.json();

            chartsData.forEach((chartConfig: any, index: number) => {
                // Wrapper
                const wrapper = document.createElement("div");
                wrapper.className = "glass-panel slide-up";
                wrapper.style.width = "360px";
                wrapper.style.height = "360px";
                wrapper.style.padding = "16px";
                wrapper.style.borderRadius = "16px";
                wrapper.style.display = "flex";
                wrapper.style.flexDirection = "column";
                wrapper.style.justifyContent = "center";

                // Title
                const title = document.createElement("h4");
                title.innerText = chartConfig.title || `Chart ${index + 1}`;
                title.style.textAlign = "center";
                title.style.marginBottom = "10px";
                title.style.fontWeight = "600";
                wrapper.appendChild(title);

                // Canvas
                const canvas = document.createElement("canvas");
                wrapper.appendChild(canvas);
                containerRef.current!.appendChild(wrapper);

                // Chart
                const chart = new Chart(canvas, {
                    type: chartConfig.type,
                    data: chartConfig.data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: "bottom"
                            }
                        },
                        ...chartConfig.options
                    }
                });

                chartsRef.current.push(chart);
            });
        } catch (err) {
            console.error("Analytics load failed", err);
        }
    }

    return (
        <div className="stage-container fade-in">
            <h2 className="section-heading">Analysis Board</h2>

            <div
                ref={containerRef}
                className="results-placeholder"
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "24px",
                    justifyContent: "center",
                    width: "100%",
                    padding: "24px"
                }}
            />
        </div>
    );
};

export default AnalysisView;
