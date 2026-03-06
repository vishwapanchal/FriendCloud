import React from 'react';
import { CloudIcon, SunIcon, MoonIcon, GoogleIcon } from './Icons';
import { APP_MODES } from '../../utils/constants';

const Navbar = ({ token, userEmail, theme, toggleTheme, setAppMode }) => {
    return (
        <header className="nav-header">
            <div
                className="nav-brand"
                onClick={() => token ? setAppMode(APP_MODES.SELECT) : window.scrollTo(0, 0)}
                style={{ cursor: token ? 'pointer' : 'default' }}
            >
                <CloudIcon /> FriendCloud
            </div>

            {!token ? (
                <>
                    <div className="nav-links desktop-only">
                        <a href="#features">Architecture</a>
                        <a href="#docs">Implementation</a>
                    </div>
                    <div className="nav-links">
                        <button className="theme-toggle" onClick={toggleTheme}>
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </button>
                        <button className="btn btn-secondary" onClick={() => window.location.href = '/auth/google/login'}>
                            Sign In
                        </button>
                    </div>
                </>
            ) : (
                <div className="nav-links">
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--neon-cyan)' }}>
                        {userEmail?.split('@')[0] || 'User'}
                    </span>
                    <button className="theme-toggle" onClick={toggleTheme}>
                        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </button>
                    <button className="btn btn-secondary" onClick={() => { localStorage.clear(); window.location.reload(); }}>
                        Sign Out
                    </button>
                </div>
            )}
        </header>
    );
};

export default Navbar;
