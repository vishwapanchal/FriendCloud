import React from 'react';
import { GoogleIcon, ShieldIcon, LinkIcon, CpuIcon } from '../common/Icons';

const LandingPage = () => {
    return (
        <main className="main-content">
            <section className="hero-section">
                <div className="badge" style={{ marginBottom: '24px', animation: 'slideUpFade 0.8s ease-out' }}>v1.0 Protocol Engine</div>
                <h1 className="hero-title" style={{ animation: 'slideUpFade 1s ease-out' }}>
                    <span className="text-gradient">Abstract</span> your infrastructure.
                </h1>
                <p className="hero-subtitle" style={{ animation: 'slideUpFade 1.2s ease-out' }}>
                    Bypass NAT configurations, securely share physical GPU hardware, and orchestrate strict Docker environments natively across an encrypted peer-to-peer relay network.
                </p>
                <button
                    className="btn btn-primary"
                    style={{ padding: '16px 36px', fontSize: '1.1rem', borderRadius: '16px', animation: 'slideUpFade 1.4s ease-out' }}
                    onClick={() => window.location.href = '/auth/google/login'}
                >
                    <GoogleIcon /> Enter the Network
                </button>
            </section>

            <section id="features" style={{ padding: '80px 0' }}>
                <h2 className="card-title" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '16px' }}>Protocol Features</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '50px', fontSize: '1.1rem' }}>Built for zero-trust environments and instant compute access.</p>

                <div className="features-grid">
                    <div className="feature-box">
                        <div className="feature-icon-wrapper"><ShieldIcon /></div>
                        <h3>Zero-Trust Isolation</h3>
                        <p>Every payload executes within heavily restricted Docker profiles to ensure absolute host protection against arbitrary execution.</p>
                    </div>
                    <div className="feature-box">
                        <div className="feature-icon-wrapper"><LinkIcon /></div>
                        <h3>Seamless NAT Traversal</h3>
                        <p>Reverse SSH tunneling completely obliterates standard NAT barriers, negating the need for complex router configuration.</p>
                    </div>
                    <div className="feature-box">
                        <div className="feature-icon-wrapper"><CpuIcon /></div>
                        <h3>Hardware Governors</h3>
                        <p>Direct resource scanning enforces precise, granular limitations on CPU, RAM, and NVIDIA GPU extraction over the network.</p>
                    </div>
                </div>
            </section>

            <section id="docs" style={{ padding: '100px 0', display: 'flex', justifyContent: 'center' }}>
                <div className="card container-sm" style={{ width: '100%', border: '1px solid rgba(6, 182, 212, 0.3)', background: 'rgba(0,0,0,0.5)' }}>
                    <h2 className="card-title" style={{ fontSize: '2rem', textAlign: 'center' }}>Establish the Uplink</h2>
                    <p className="card-desc" style={{ textAlign: 'center' }}>The protocol utilizes a rapid two-party handshake to establish a secure compute link.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '40px' }}>
                        <div style={{ paddingLeft: '24px', borderLeft: '4px solid var(--border-light)', transition: 'border-color 0.3s' }}>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>1. Agent Deployment</h4>
                            <p style={{ color: 'var(--text-muted)' }}>The provider executes the lightweight host binary on a PC, defining hardware limits and initiating the relay tunnel automatically.</p>
                        </div>
                        <div style={{ paddingLeft: '24px', borderLeft: '4px solid var(--border-light)' }}>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>2. Key Generation</h4>
                            <p style={{ color: 'var(--text-muted)' }}>The node produces an ephemeral, encoded symmetric authorization key containing routing directions.</p>
                        </div>
                        <div style={{ paddingLeft: '24px', borderLeft: '4px solid var(--neon-cyan)' }}>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>3. Orchestration</h4>
                            <p style={{ color: 'var(--text-muted)' }}>The consumer submits the key via this dashboard to instantly provision isolated Linux shells on the remote host machine.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer style={{ borderTop: '1px solid var(--border-light)', padding: '40px 5%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', backgroundColor: 'var(--bg-surface)', backdropFilter: 'blur(20px)' }}>
                <p id="about" style={{ marginBottom: '12px' }}><strong>System Architect:</strong> Vishwa Panchal (DevOps &amp; Infrastructure Engineer)</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px' }}>
                    <a href="https://github.com/vishwapanchal" target="_blank" rel="noreferrer">GitHub Profile</a>
                    <a href="https://linkedin.com/in/thevishwapanchal" target="_blank" rel="noreferrer">LinkedIn Profile</a>
                </div>
                <p>&copy; {new Date().getFullYear()} FriendCloud Protocol. Built for distributed networking.</p>
            </footer>
        </main>
    );
};

export default LandingPage;
