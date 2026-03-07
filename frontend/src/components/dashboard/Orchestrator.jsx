import React from 'react';
import { BoxSvg, TermSvg } from '../common/Icons';
import { APP_MODES, TEMPLATES } from '../../utils/constants';

const Orchestrator = ({
    setAppMode,
    setHostInfo,
    secretCode,
    setSecretCode,
    setStatus,
    status,
    wsRef,
    hostInfo,
    image,
    setImage,
    ram,
    setRam,
    maxRam,
    cpu,
    setCpu,
    maxCpu,
    storage,
    setStorage,
    maxStorage,
    handleLaunch,
    handleTerminate
}) => {
    return (
        <div style={{ animation: 'slideUpFade 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <button
                    className="btn btn-secondary"
                    style={{ borderRadius: '50px' }}
                    onClick={() => {
                        setAppMode(APP_MODES.SELECT);
                        setHostInfo(null);
                        setSecretCode('');
                        setStatus('Offline');
                        if (wsRef.current) wsRef.current.close();
                    }}
                >
                    &larr; Disconnect Connection
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Target Host:</span>
                    <span className="badge" style={{ fontFamily: 'var(--font-mono)' }}>{hostInfo?.os || "Unknown OS"}</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card">
                        <h3 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <BoxSvg /> Container Orchestration
                        </h3>

                        <div className="input-group">
                            <label className="input-label">Quick Templates</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                                {TEMPLATES.map(t => (
                                    <div
                                        key={t.id}
                                        className={`template-card ${image === t.image ? 'active' : ''} ${status !== 'Offline' ? 'disabled' : ''}`}
                                        onClick={() => status === 'Offline' && setImage(t.image)}
                                    >
                                        <span style={{ color: image === t.image ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>{t.icon}</span>
                                        <span style={{ fontSize: '1rem', fontWeight: 600 }}>{t.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="input-group" style={{ marginBottom: '32px' }}>
                            <label className="input-label">Custom DockerHub Link</label>
                            <input
                                type="text"
                                className="input-control"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                disabled={status !== 'Offline'}
                                placeholder="e.g., node:18-alpine"
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                <span>Memory Allocation:</span>
                                <span style={{ color: 'var(--neon-cyan)' }}>{ram < 1 ? '512 MB' : `${ram} GB`} {`(Owner Limit: ${maxRam} GB)`}</span>
                            </label>
                            <input
                                type="range"
                                className="slider-control"
                                min="0.5"
                                max={maxRam}
                                step="0.5"
                                value={ram}
                                onChange={(e) => setRam(Math.min(parseFloat(e.target.value), maxRam))}
                                disabled={status !== 'Offline'}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                <span>vCPU Cores:</span>
                                <span style={{ color: 'var(--neon-cyan)' }}>{cpu} Core{cpu > 1 ? 's' : ''} {`(Owner Limit: ${maxCpu})`}</span>
                            </label>
                            <input
                                type="range"
                                className="slider-control"
                                min="1"
                                max={maxCpu}
                                step="1"
                                value={cpu}
                                onChange={(e) => setCpu(Math.min(parseInt(e.target.value), maxCpu))}
                                disabled={status !== 'Offline'}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                <span>Storage Volume:</span>
                                <span style={{ color: 'var(--neon-cyan)' }}>{storage} GB {`(Owner Limit: ${maxStorage} GB)`}</span>
                            </label>
                            <input
                                type="range"
                                className="slider-control"
                                min="1"
                                max={maxStorage}
                                step="1"
                                value={storage}
                                onChange={(e) => setStorage(Math.min(parseInt(e.target.value), maxStorage))}
                                disabled={status !== 'Offline'}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--border-light)' }}>
                            <div className={`badge ${status === 'Online' ? 'badge-success' : ''}`} style={{ fontSize: '0.95rem', padding: '10px 20px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor', marginRight: '8px', display: 'inline-block', boxShadow: '0 0 10px currentColor' }}></div>
                                {status}
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button className="btn btn-primary" style={{ padding: '12px 24px' }} onClick={handleLaunch} disabled={status !== 'Offline'}>
                                    Deploy Workload
                                </button>
                                <button className="btn btn-danger" style={{ padding: '12px 24px' }} onClick={handleTerminate} disabled={status !== 'Online'}>
                                    Terminate Session
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', border: '1px solid var(--neon-cyan)', boxShadow: '0 0 30px rgba(6, 182, 212, 0.15)', justifyContent: 'center', alignItems: 'center', minHeight: '500px', backgroundColor: 'rgba(6, 182, 212, 0.02)' }}>
                        <div style={{ padding: '32px', textAlign: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', color: 'var(--neon-cyan)' }}>
                                <TermSvg />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#fff' }}>Interactive Session</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '300px', lineHeight: '1.6' }}>Launch a dedicated terminal tab to securely interact with your deployed container workload using xterm.js.</p>

                            <button
                                className="btn"
                                style={{
                                    padding: '16px 32px',
                                    fontSize: '1.1rem',
                                    background: status === 'Online' ? 'var(--neon-cyan)' : 'var(--bg-lighter)',
                                    color: status === 'Online' ? '#000' : 'var(--text-muted)',
                                    boxShadow: status === 'Online' ? '0 0 20px rgba(6, 182, 212, 0.4)' : 'none',
                                    border: status === 'Online' ? 'none' : '1px solid var(--border-light)',
                                    transition: 'all 0.3s ease',
                                    fontWeight: 'bold'
                                }}
                                disabled={status !== 'Online'}
                                onClick={() => {
                                    if (secretCode) window.open(`/?terminal=true&key=${encodeURIComponent(secretCode)}`, '_blank');
                                }}
                            >
                                {status === 'Online' ? 'Open CLI Terminal \u2197' : 'Waiting for Deployment...'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orchestrator;
