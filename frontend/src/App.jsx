import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [appMode, setAppMode] = useState('select');
  const [image, setImage] = useState('ubuntu');
  const [ram, setRam] = useState('512m');
  const [cpu, setCpu] = useState('1');
  const [command, setCommand] = useState('');
  const [status, setStatus] = useState('Offline');
  const [output, setOutput] = useState('> System Ready.\n> Waiting for connection...');
  const [instanceId, setInstanceId] = useState('');
  const [token, setToken] = useState(localStorage.getItem('fc_token') || '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('fc_email') || '');
  const [theme, setTheme] = useState(() => localStorage.getItem('fc_theme') || 'dark');
  const [secretCode, setSecretCode] = useState('');
  const [hostUrl, setHostUrl] = useState('');
  const [hostPasskey, setHostPasskey] = useState('');
  const [hostInfo, setHostInfo] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const API_HEADERS = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fc_theme', theme);
  }, [theme]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('token') && params.get('email')) {
      setToken(params.get('token'));
      setUserEmail(params.get('email'));
      localStorage.setItem('fc_token', params.get('token'));
      localStorage.setItem('fc_email', params.get('email'));
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const logToConsole = (text) => setOutput((prev) => prev + text + '\n');

  const connectToHost = async () => {
    try {
      setIsConnecting(true);
      const decoded = atob(secretCode.trim());
      const [url, passkey] = decoded.split('|');
      if (!url || !passkey || !url.startsWith('http')) throw new Error("Invalid Format");

      const sysResponse = await fetch(`${url}/sysinfo`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ passkey })
      });

      if (!sysResponse.ok) throw new Error("Host denied connection.");
      const sysData = await sysResponse.json();

      setHostUrl(url);
      setHostPasskey(passkey);
      setHostInfo(sysData);
      setAppMode('dashboard');
      logToConsole(`> Connected to ${sysData.node}`);
    } catch (e) {
      alert("Connection Failed: " + e.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLaunch = async () => {
    setStatus('Launching');
    const newInstanceId = Math.random().toString(36).substring(2, 10);
    setInstanceId(newInstanceId);
    logToConsole(`> Booting ${image}...`);
    try {
      const response = await fetch(`${hostUrl}/launch`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ image, ram, cpu, passkey: hostPasskey, instance_id: newInstanceId })
      });
      const data = await response.json();
      if (!response.ok) { setStatus('Error'); logToConsole(`> ${data.detail}`); return; }
      setStatus('Online');
      logToConsole(`> ${data.message}`);
    } catch (error) { setStatus('Error'); logToConsole(`> Remote Host offline.`); }
  };

  const handleExecute = async () => {
    if (!command.trim() || status !== 'Online') return;
    logToConsole(`> Executing...`);
    try {
      const response = await fetch(`${hostUrl}/execute`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ command, image, passkey: hostPasskey, instance_id: instanceId })
      });
      const data = await response.json();
      if (!response.ok) { logToConsole(`> ${data.detail}`); return; }
      logToConsole(`${data.output}`);
    } catch (error) { logToConsole(`> Connection lost.`); }
  };

  const handleTerminate = async () => {
    setStatus('Terminating');
    try {
      const response = await fetch(`${hostUrl}/terminate`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ passkey: hostPasskey, instance_id: instanceId })
      });
      const data = await response.json();
      if (!response.ok) { setStatus('Error'); logToConsole(`> ${data.detail}`); return; }
      setStatus('Offline');
      setInstanceId('');
      logToConsole(`> Terminated.`);
    } catch (error) { setStatus('Error'); logToConsole(`> Host unreachable.`); }
  };

  const AppHeader = ({ subtitle }) => (
    <div className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="btn" style={{ padding: '8px', background: 'transparent' }} onClick={() => setAppMode('select')}>🏠</button>
        <h1>FriendCloud <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{subtitle}</span></h1>
      </div>
      <div className="header-controls" style={{ display: 'flex', gap: '8px' }}>
        <button className="btn" style={{ padding: '8px' }} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☀️' : '🌙'}</button>
        <button className="btn btn-danger" style={{ padding: '8px 16px' }} onClick={() => { localStorage.clear(); window.location.reload(); }}>Exit</button>
      </div>
    </div>
  );

  if (!token) {
    return (
      <div className="page-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="app-container" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>FriendCloud</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Secure P2P compute.</p>
          <button className="btn btn-primary" onClick={() => window.location.href='/auth/google/login'}>Sign in</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {appMode === 'select' ? (
          <>
            <AppHeader subtitle="Dashboard" />
            <div className="body-content">
              <div className="role-grid">
                <div className="role-card" onClick={() => setAppMode('host')}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🖥️</div>
                  <h2>Be a Host</h2>
                </div>
                <div className="role-card" onClick={() => setAppMode('rent')}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
                  <h2>Rent Compute</h2>
                </div>
              </div>
            </div>
          </>
        ) : appMode === 'host' ? (
          <>
            <AppHeader subtitle="Host Setup" />
            <div className="body-content">
              <h2>Host Instructions</h2>
              <div className="form-grid">
                <div className="role-card" style={{ cursor: 'default' }}>
                  <p>Download the agent executable.</p>
                  <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => window.open('/download-agent', '_blank')}>Download</button>
                </div>
              </div>
            </div>
          </>
        ) : appMode === 'rent' ? (
          <>
            <AppHeader subtitle="Connect" />
            <div className="body-content" style={{ textAlign: 'center' }}>
              <input className="input-field" type="password" placeholder="Secret Code..." value={secretCode} onChange={(e) => setSecretCode(e.target.value)} style={{ marginBottom: '20px', textAlign: 'center' }}/>
              <button className="btn btn-primary" onClick={connectToHost} disabled={!secretCode.trim() || isConnecting}>
                {isConnecting ? "Connecting..." : "Establish Link"}
              </button>
            </div>
          </>
        ) : (
          <>
            <AppHeader subtitle="Terminal" />
            <div className="body-content">
              {hostInfo && (
                <div className="host-specs-grid">
                  <div className="spec-item"><span className="spec-label">Node</span><span className="spec-value">{hostInfo.node}</span></div>
                  <div className="spec-item"><span className="spec-label">OS</span><span className="spec-value">{hostInfo.os}</span></div>
                  <div className="spec-item"><span className="spec-label">CPU</span><span className="spec-value">{hostInfo.cpu_name}</span></div>
                  <div className="spec-item"><span className="spec-label">RAM</span><span className="spec-value">{hostInfo.ram}</span></div>
                </div>
              )}
              <div className="section">
                <div className="section-title">Environment</div>
                <div className="form-grid">
                  <select className="input-field" value={image} onChange={(e) => setImage(e.target.value)} disabled={status !== 'Offline'}>
                    <option value="ubuntu">Ubuntu</option>
                    <option value="python:3.9-slim">Python 3.9</option>
                    <option value="node:18-alpine">Node.js 18</option>
                  </select>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <select className="input-field" value={ram} onChange={(e) => setRam(e.target.value)} disabled={status !== 'Offline'}>
                      <option value="512m">512 MB</option><option value="1g">1 GB</option><option value="2g">2 GB</option>
                    </select>
                    <select className="input-field" value={cpu} onChange={(e) => setCpu(e.target.value)} disabled={status !== 'Offline'}>
                      <option value="1">1 Core</option><option value="2">2 Cores</option>
                    </select>
                  </div>
                </div>
                <div className="controls-row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                  <div className="status-indicator"><div className={`status-dot ${status.toLowerCase()}`}></div>{status}</div>
                  <div className="btn-group" style={{ flexDirection: 'row' }}>
                    <button className="btn btn-primary" onClick={handleLaunch} disabled={status !== 'Offline'}>Deploy</button>
                    <button className="btn btn-danger" onClick={handleTerminate} disabled={status !== 'Online'}>Destroy</button>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="section-title">Payload</div>
                <textarea className="input-field" placeholder="ls -la" value={command} onChange={(e)=>setCommand(e.target.value)} disabled={status!=='Online'} style={{ height: '80px', marginBottom: '16px' }} />
                <button className="btn btn-primary" onClick={handleExecute} disabled={status!=='Online'||!command.trim()}>Execute</button>
              </div>
              <div className="terminal-container">
                <div className="terminal-header">
                  <div className="term-dot red"></div><div className="term-dot yellow"></div><div className="term-dot green"></div>
                </div>
                <pre className="terminal-output">{output}</pre>
              </div>
            </div>
          </>
        )}
      </div>
      <footer className="app-footer">
        <p>© 2026 FriendCloud Network • Engineered by Vishwa Panchal</p>
      </footer>
    </div>
  );
}

export default App;
