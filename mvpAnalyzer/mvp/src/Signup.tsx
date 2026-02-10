import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Reusing Login styles
import reactLogo from './assets/react.svg';
import { authService } from './services/authService';

export default function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await authService.signup(email, password);
            if (result.success) {
                // Redirect to login on success
                navigate('/login');
            } else {
                setError(result.error || 'Signup failed');
            }
        } catch (err) {
            setError('An error occurred during signup');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container fade-in">
            <div className="login-card">
                <div className="login-header">
                    <img src={reactLogo} className="login-logo" alt="FinEasy Logo" />
                    <p className="login-subtitle">Create your account</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Create Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-message" style={{ color: 'red', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>

                </form>
            </div>

            <p className="login-footer">
                Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Log in</a>
            </p>
        </div>
    );
}
