import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiDocumentText } from 'react-icons/hi';
import './Sidebar.css';

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [userName, setUserName] = useState<string>('');
    const location = useLocation();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { authService } = await import('./services/authService');
                const user = await authService.getCurrentUser();
                if (user) {
                    setUserName(user.full_name || user.name || user.email.split('@')[0]);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchUser();
    }, []);

    const navItems = [
        { name: 'Upload', icon: UploadIcon, path: '/upload' },
        { name: 'Chatbot', icon: ChatbotIcon, path: '/chatbot' },
        { name: 'Analysis Summary', icon: HiDocumentText, path: '/analysis-summary' },
        { name: 'Home', icon: HomeIcon, path: '/' },
    ];

    // Helper to check active state
    const isActive = (path: string) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/') {
            return location.pathname.startsWith(path);
        }
        return false;
    };

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* User Logic */}
            <div className="user-section">
                <div className="avatar-placeholder">
                    <span>{userName.charAt(0).toUpperCase()}</span>
                </div>
                {!isCollapsed && (
                    <div className="user-info fade-in">
                        <span className="user-name" title={userName}>{userName}</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                            title={isCollapsed ? item.name : ''}
                            style={{ textDecoration: 'none' }}
                            onClick={(e) => {
                                if (item.name === 'Home') {
                                    e.preventDefault();
                                    window.location.href = "http://localhost:5177/";
                                }
                            }}
                        >
                            <span className="icon"><Icon size={20} /></span>
                            {!isCollapsed && <span className="label fade-in">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Toggle Button */}
            <button
                className="toggle-btn"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <ChevronLeftIcon className={isCollapsed ? 'rotate-180' : ''} />
            </button>

            {/* Logout Button */}
            <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <button
                    onClick={() => {
                        import('./services/authService').then(({ authService }) => {
                            authService.logout();
                            window.location.href = 'http://localhost:5177/login';
                        });
                    }}
                    style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        color: '#ef4444',
                        padding: '0.5rem',
                        borderRadius: '0.5rem'
                    }}
                    title="Logout"
                >
                    <LogoutIcon />
                    {!isCollapsed && <span className="fade-in" style={{ marginLeft: '12px', fontWeight: 500 }}>Logout</span>}
                </button>
            </div>
        </aside>
    );
}

// Icons
// Icons
function HomeIcon({ size }: { size?: number }) {
    return (
        <svg width={size || 20} height={size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
    );
}

function UploadIcon({ size }: { size?: number }) {
    return (
        <svg width={size || 20} height={size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
    );
}

function ChatbotIcon({ size }: { size?: number }) {
    return (
        <svg width={size || 20} height={size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    );
}



function ChevronLeftIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transition: 'transform 0.3s' }}>
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    );
}

function LogoutIcon({ size }: { size?: number }) {
    return (
        <svg width={size || 20} height={size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
    );
}
