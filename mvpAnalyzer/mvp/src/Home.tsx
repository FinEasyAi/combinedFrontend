import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import reactLogo from './assets/react.svg';
import './Home.css';
import 'react-calendar/dist/Calendar.css';

export default function Home() {
    const navigate = useNavigate();
    type ValuePiece = Date | null;
    type Value = ValuePiece | [ValuePiece, ValuePiece];
    const [date, setDate] = useState<Value>(new Date());

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
                    <div className="calendar-card status-card">
                        <Calendar
                            onChange={setDate}
                            value={date}
                            className="custom-calendar"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
