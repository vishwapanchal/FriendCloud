import React from 'react';
import { ServerIcon, RocketIcon } from '../common/Icons';
import { APP_MODES } from '../../utils/constants';

const RoleSelection = ({ setAppMode }) => {
    return (
        <div className="container-sm" style={{ animation: 'slideUpFade 0.5s ease-out' }}>
            <h1 className="card-title" style={{ fontSize: '2.5rem', marginBottom: '12px', textAlign: 'center' }}>Select Vector</h1>
            <p className="card-desc" style={{ marginBottom: '60px', fontSize: '1.1rem', textAlign: 'center' }}>Choose an operational role to begin orchestration over the network.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                <div
                    className="card card-hoverable"
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                    onClick={() => setAppMode(APP_MODES.HOST)}
                >
                    <div style={{ marginBottom: '24px', padding: '20px', background: 'rgba(59, 130, 246, 0.1)', display: 'inline-block', borderRadius: '24px', color: 'var(--neon-blue)', transition: 'transform 0.3s' }}>
                        <ServerIcon />
                    </div>
                    <h2 className="card-title">Provision Host Node</h2>
                    <p className="card-desc" style={{ minHeight: '60px' }}>Allocate local hardware resources to the network and generate an encrypted tunnel key.</p>
                    <span className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>Setup Node &rarr;</span>
                </div>

                <div
                    className="card card-hoverable"
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                    onClick={() => setAppMode(APP_MODES.RENT)}
                >
                    <div style={{ marginBottom: '24px', padding: '20px', background: 'rgba(139, 92, 246, 0.1)', display: 'inline-block', borderRadius: '24px', color: 'var(--neon-purple)', transition: 'transform 0.3s' }}>
                        <RocketIcon />
                    </div>
                    <h2 className="card-title">Access Compute</h2>
                    <p className="card-desc" style={{ minHeight: '60px' }}>Connect to a peer node using an authorization key to deploy isolated containers.</p>
                    <span className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>Connect &rarr;</span>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
