import React, { useState } from 'react';
import { ShieldIcon } from '../common/Icons';

const AuthModal = ({ onClose, onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const endpoint = isLogin ? '/auth/login' : '/auth/signup';
        const url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

        try {
            const res = await fetch(`${url}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || 'Authentication failed');
            }

            if (isLogin) {
                // Save token and invoke success callback
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', data.email);
                onSuccess(data.token, data.email);
            } else {
                // Proceed to login on successful signup
                setIsLogin(true);
                setError('Account created successfully! Please log in.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{
                width: '100%', maxWidth: '400px', padding: '32px',
                position: 'relative', animation: 'slideUpFade 0.3s ease-out'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '16px', right: '16px',
                        background: 'transparent', border: 'none',
                        color: 'var(--text-muted)', fontSize: '1.5rem',
                        cursor: 'pointer'
                    }}
                >
                    &times;
                </button>

                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div className="feature-icon-wrapper" style={{ margin: '0 auto 16px' }}>
                        <ShieldIcon />
                    </div>
                    <h2 className="card-title" style={{ fontSize: '1.5rem' }}>
                        {isLogin ? 'Network Authorization' : 'Establish Identity'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                        {isLogin ? 'Enter your credentials to access the encrypted protocol.' : 'Register to allocate resources on the network.'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        padding: '12px', marginBottom: '16px', borderRadius: '8px',
                        backgroundColor: error.includes('success') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${error.includes('success') ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                        color: error.includes('success') ? '#10b981' : '#ef4444',
                        fontSize: '0.9rem', textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>
                            Identity Vector (Email)
                        </label>
                        <input
                            type="email"
                            required
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: '8px',
                                backgroundColor: 'var(--bg-document)',
                                border: '1px solid var(--border-light)',
                                color: 'var(--text-main)', fontSize: '1rem',
                                outline: 'none', transition: 'border-color 0.2s'
                            }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>
                            Encryption Key (Password)
                        </label>
                        <input
                            type="password"
                            required
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: '8px',
                                backgroundColor: 'var(--bg-document)',
                                border: '1px solid var(--border-light)',
                                color: 'var(--text-main)', fontSize: '1rem',
                                outline: 'none', transition: 'border-color 0.2s'
                            }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                        style={{ marginTop: '8px', padding: '14px', fontSize: '1rem', opacity: isLoading ? 0.7 : 1 }}
                    >
                        {isLoading ? 'Authenticating...' : (isLogin ? 'Initiate Uplink' : 'Register Vector')}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                        {isLogin ? "Unrecognized protocol? " : "Already authenticated? "}
                    </span>
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        style={{
                            background: 'none', border: 'none', padding: 0,
                            color: 'var(--neon-cyan)', cursor: 'pointer',
                            fontWeight: 600, textDecoration: 'underline'
                        }}
                    >
                        {isLogin ? 'Initialize new signature' : 'Resume standard uplink'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
