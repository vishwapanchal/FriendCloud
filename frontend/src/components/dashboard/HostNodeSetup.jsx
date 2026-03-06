import React from 'react';
import { CloudIcon } from '../common/Icons';
import { APP_MODES } from '../../utils/constants';

const HostNodeSetup = ({ setAppMode }) => {
    return (
        <div className="card container-sm" style={{ animation: 'slideUpFade 0.4s ease-out' }}>
            <button
                className="btn btn-secondary"
                style={{ marginBottom: '32px', borderRadius: '50px' }}
                onClick={() => setAppMode(APP_MODES.SELECT)}
            >
                &larr; Back to Selection
            </button>

            <h2 className="card-title" style={{ fontSize: '2.2rem' }}>Agent Deployment</h2>
            <p className="card-desc">Execute the lightweight client on the target host machine.</p>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '40px', borderRadius: 'var(--radius-lg)', marginBottom: '24px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ padding: '20px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--neon-cyan)', borderRadius: '50%', marginBottom: '20px' }}>
                    <CloudIcon />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Download the Node Binary</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px', maxWidth: '400px' }}>
                    The executable will automatically check dependencies (Docker, OpenSSH) and spin up a secure relay to our network.
                </p>
                <button
                    className="btn btn-primary"
                    style={{ borderRadius: '50px', padding: '16px 32px' }}
                    onClick={() => window.open('/download-agent', '_blank')}
                >
                    Download Windows Agent (.exe)
                </button>
            </div>
        </div>
    );
};

export default HostNodeSetup;
