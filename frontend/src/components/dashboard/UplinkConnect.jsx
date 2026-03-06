import React from 'react';
import { APP_MODES } from '../../utils/constants';

const UplinkConnect = ({ setAppMode, secretCode, setSecretCode, isConnecting, connectToHost }) => {
    return (
        <div className="card container-sm" style={{ animation: 'slideUpFade 0.4s ease-out', maxWidth: '600px' }}>
            <button
                className="btn btn-secondary"
                style={{ marginBottom: '32px', borderRadius: '50px' }}
                onClick={() => setAppMode(APP_MODES.SELECT)}
            >
                &larr; Back to Selection
            </button>

            <h2 className="card-title" style={{ fontSize: '2.2rem', textAlign: 'center' }}>Establish Uplink</h2>
            <p className="card-desc" style={{ textAlign: 'center', marginBottom: '40px' }}>
                Enter the encoded symmetric key provided by your host.
            </p>

            <div className="input-group">
                <input
                    type="password"
                    className="input-control"
                    placeholder="Paste Symmetric Key here..."
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    style={{ fontFamily: 'var(--font-mono)', letterSpacing: '2px', fontSize: '1.2rem', padding: '24px', borderRadius: '16px', textAlign: 'center' }}
                />
            </div>

            <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '20px', fontSize: '1.1rem', borderRadius: '16px', marginTop: '10px' }}
                onClick={connectToHost}
                disabled={!secretCode.trim() || isConnecting}
            >
                {isConnecting ? 'Negotiating handshake...' : 'Initialize Connection'}
            </button>
        </div>
    );
};

export default UplinkConnect;
