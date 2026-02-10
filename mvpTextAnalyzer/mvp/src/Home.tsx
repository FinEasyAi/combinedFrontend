import { useNavigate } from 'react-router-dom';
import CalendarCard from './components/CalendarCard';
import reactLogo from './assets/react.svg';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container fade-in">
            {/* Header Row - Fixed */}
            <header className="home-header">
                <div className="logo-container">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </div>
                <button className="upload-btn start-btn" onClick={() => navigate('/select-type')}>
                    Start Analysis
                </button>
            </header>

            {/* Dashboard Grid */}
            <div className="dashboard-grid">

                {/* Center Content Area */}
                <div className="dashboard-content">
                    <div className="greeting-container">
                        <h1 className="greeting-text">
                            Hey! <br />
                            <span className="greeting-user">Welcome User</span>
                        </h1>
                    </div>
                </div>

                {/* Right Column - Calendar Widget */}
                <div className="dashboard-sidebar">
                    <CalendarCard />
                </div>
            </div>
        </div>
    );
}
