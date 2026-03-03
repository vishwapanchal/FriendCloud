import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [appMode, setAppMode] = useState('select');
  const [image, setImage] = useState('ubuntu');
  const [ram, setRam] = useState('512m');
  const [cpu, setCpu] = useState('1');
  const [useGpu, setUseGpu] = useState(false);
  const [command, setCommand] = useState('');
  const [status, setStatus] = useState('Offline');
  const [output, setOutput] = useState('> System Ready.\n> Waiting for secure connection...');
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
      if (!url || !passkey || !url.startsWith('http')) throw new Error("Invalid format detected.");

      const sysResponse = await fetch(`${url}/sysinfo`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ passkey })
      });

      if (!sysResponse.ok) throw new Error("Host unavailable or rejected connection.");
      const sysData = await sysResponse.json();

      setHostUrl(url);
      setHostPasskey(passkey);
      setHostInfo(sysData);
      setAppMode('dashboard');
      logToConsole(`> Established P2P connection to ${sysData.node}`);
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
    logToConsole(`> Initializing ${image} environment...`);
    try {
      const response = await fetch(`${hostUrl}/launch`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ image, ram, cpu, use_gpu: useGpu, passkey: hostPasskey, instance_id: newInstanceId })
      });
      const data = await response.json();
      if (!response.ok) { setStatus('Error'); logToConsole(`> ${data.detail}`); return; }
      setStatus('Online');
      logToConsole(`> ${data.message}`);
    } catch (error) {
      setStatus('Error');
      logToConsole(`> Fatal: Remote Host offline.`);
    }
  };

  const handleExecute = async () => {
    if (!command.trim() || status !== 'Online') return;
    logToConsole(`> Executing payload...`);
    try {
      const response = await fetch(`${hostUrl}/execute`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ command, image, passkey: hostPasskey, instance_id: instanceId })
      });
      const data = await response.json();
      if (!response.ok) { logToConsole(`> ${data.detail}`); return; }
      logToConsole(`${data.output}`);
    } catch (error) {
      logToConsole(`> Fatal: Connection lost during execution.`);
    }
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
      logToConsole(`> Environment destroyed successfully.`);
    } catch (error) {
      setStatus('Error');
      logToConsole(`> Fatal: Host unreachable.`);
    }
  };

  const AppHeader = ({ subtitle }) => (
    <div className="header">
      <div className="header-left">
        <button className="btn btn-icon" onClick={() => setAppMode('select')}>Ìø†</button>
        <h1>FriendCloud <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '8px' }}>{subtitle}</span></h1>
      </div>
      <div className="header-right">
        <span style={{ fontSize: '0.85rem', fontWeight: '600', marginRight: '8px' }}>{userEmail.split('@')[0]}</span>
        <button className="btn btn-icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '‚òÄÔ∏è' : 'Ìºô'}
        </button>
        <button className="btn btn-danger" style={{ padding: '8px 16px' }} onClick={() => { localStorage.clear(); window.location.reload(); }}>
          Logout
        </button>
      </div>
    </div>
  );

  const getRamOptions = () => {
    const hierarchy = ["512m", "1g", "2g", "4g", "8g", "16g", "32g", "64g"];
    const maxLimit = hostInfo?.allowed_ram || "512m";
    const maxIndex = hierarchy.indexOf(maxLimit) !== -1 ? hierarchy.indexOf(maxLimit) : 0;
    return hierarchy.slice(0, maxIndex + 1);
  };

  const getCpuOptions = () => {
    const maxLimit = parseInt(hostInfo?.allowed_cpu || "1");
    return Array.from({ length: maxLimit }, (_, i) => (i + 1).toString());
  };

  if (!token) {
    return (
      <div className="landing-wrapper">
        <nav className="landing-nav">
          <h2>‚òÅÔ∏è FriendCloud</h2>
          <button className="btn btn-primary" style={{ padding: '12px 28px', borderRadius: '50px' }} onClick={() => window.location.href='/auth/google/login'}>Sign In</button>
        </nav>
        
        <main className="landing-main">
          <h1 className="hero-title">Decentralized P2P Compute.</h1>
          <p className="hero-subtitle">
            Bypass NAT, share GPU and CPU resources, and execute isolated Docker containers natively on peer hardware. Zero network configuration required.
          </p>
          <div className="hero-cta">
            <button onClick={() => window.location.href='/auth/google/login'}>
              Deploy Environment &rarr;
            </button>
          </div>

          <div className="about-card">
            <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', color: '#3b82f6', fontWeight: '800' }}>Meet the Architect</h3>
            <p style={{ fontSize: '1.15rem', marginBottom: '16px', lineHeight: '1.7', color: '#f8fafc' }}>
              Hi, I am <strong>Vishwa Panchal</strong>. I am an Information Science specialist with a deep focus on DevOps, cloud infrastructure, Docker orchestration, and Kubernetes.
            </p>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '40px', lineHeight: '1.7' }}>
              I engineered FriendCloud to solve the real-world friction of NAT-traversal and the high costs associated with cloud hardware. By utilizing reverse SSH tunneling and dynamic resource limitation, this platform enables seamless, zero-trust peer-to-peer compute sharing.
            </p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <a href="https://github.com/vishwapanchal" target="_blank" rel="noreferrer" className="social-btn">
                <span style={{ fontSize: '1.3rem' }}>Ì∞ô</span> GitHub
              </a>
              <a href="https://linkedin.com/in/thevishwapanchal" target="_blank" rel="noreferrer" className="social-btn">
                <span style={{ fontSize: '1.3rem', color: '#60a5fa' }}>Ì≤º</span> LinkedIn
              </a>
            </div>
          </div>
        </main>
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
              <div className="dashboard-wrapper">
                <div className="dashboard-header">
                  <h1 className="dashboard-greeting">Welcome, <span className="highlight-text">{userEmail.split('@')[0]}</span></h1>
                  <p className="dashboard-sub">Select your operational mode for this session.</p>
                </div>
                
                <div className="role-grid-modern">
                  <div className="role-card-modern host-card" onClick={() => setAppMode('host')}>
                    <div className="card-icon-wrapper">
                      <span className="card-icon">Ì∂•Ô∏è</span>
                    </div>
                    <h2>Provision Node</h2>
                    <p>Allocate your local hardware resources to the FriendCloud network.</p>
                    <ul className="card-features">
                      <li>Complete Docker isolation</li>
                      <li>Hardware-level limits</li>
                      <li>Ephemeral symmetric keys</li>
                    </ul>
                    <div className="card-action">Initialize Host &rarr;</div>
                  </div>
                  
                  <div className="role-card-modern rent-card" onClick={() => setAppMode('rent')}>
                    <div className="card-icon-wrapper">
                      <span className="card-icon">Ì∫Ä</span>
                    </div>
                    <h2>Access Compute</h2>
                    <p>Connect to a peer node using a secure symmetric authorization key.</p>
                    <ul className="card-features">
                      <li>Ephemeral environments</li>
                      <li>Hardware GPU acceleration</li>
                      <li>Zero NAT configuration</li>
                    </ul>
                    <div className="card-action">Connect Remote &rarr;</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : appMode === 'host' ? (
          <>
            <AppHeader subtitle="Agent Setup" />
            <div className="body-content">
              <div className="section-title">Deployment Steps</div>
              <div className="form-grid">
                <div className="role-card" style={{ cursor: 'default', alignItems: 'flex-start', textAlign: 'left', padding: '24px' }}>
                  <strong style={{ marginBottom: '8px' }}>1. Retrieve Binary</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Acquire the standalone GUI agent.</p>
                  <button className="btn btn-primary" onClick={() => window.open('/download-agent', '_blank')}>Download Agent</button>
                </div>
                <div className="role-card" style={{ cursor: 'default', alignItems: 'flex-start', textAlign: 'left', padding: '24px' }}>
                  <strong style={{ marginBottom: '8px' }}>2. Initialize Protocol</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Execute the binary and copy the generated symmetric tunnel key.</p>
                </div>
              </div>
            </div>
          </>
        ) : appMode === 'rent' ? (
          <>
            <AppHeader subtitle="Establish Link" />
            <div className="body-content" style={{ alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="section-title" style={{ justifyContent: 'center' }}>Symmetric Key Exchange</div>
                <input 
                  className="input-field" 
                  type="password" 
                  placeholder="Insert authorization string..." 
                  value={secretCode} 
                  onChange={(e) => setSecretCode(e.target.value)} 
                  style={{ textAlign: 'center', letterSpacing: '1px' }}
                />
                <button className="btn btn-primary" onClick={connectToHost} disabled={!secretCode.trim() || isConnecting}>
                  {isConnecting ? "Negotiating Handshake..." : "Initialize Connection"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <AppHeader subtitle="Active Session" />
            <div className="body-content">
              {hostInfo && (
                <div className="host-specs-grid">
                  <div className="spec-item"><span className="spec-label">Target ID</span><span className="spec-value">{hostInfo.node}</span></div>
                  <div className="spec-item"><span className="spec-label">Platform</span><span className="spec-value">{hostInfo.os}</span></div>
                  <div className="spec-item"><span className="spec-label">Processor</span><span className="spec-value">{hostInfo.cpu_name}</span></div>
                  <div className="spec-item"><span className="spec-label">Memory</span><span className="spec-value">{hostInfo.ram}</span></div>
                </div>
              )}
              
              <div>
                <div className="section-title">Container Specification</div>
                <div className="form-grid">
                  <select className="input-field" value={image} onChange={(e) => setImage(e.target.value)} disabled={status !== 'Offline'}>
                    <option value="ubuntu">Ubuntu RootFS</option>
                    <option value="python:3.9-slim">Python 3.9 Daemon</option>
                    <option value="node:18-alpine">Node.js 18 Engine</option>
                  </select>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <select className="input-field" value={ram} onChange={(e) => setRam(e.target.value)} disabled={status !== 'Offline'}>
                      {getRamOptions().map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                    </select>
                    <select className="input-field" value={cpu} onChange={(e) => setCpu(e.target.value)} disabled={status !== 'Offline'}>
                      {getCpuOptions().map(c => <option key={c} value={c}>{c} vCPU</option>)}
                    </select>
                  </div>
                </div>

                {hostInfo?.has_gpu && hostInfo?.allowed_gpu && (
                  <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>‚ö° NVIDIA GPU Available</span>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{hostInfo.gpu_name}</div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={useGpu} onChange={(e) => setUseGpu(e.target.checked)} disabled={status !== 'Offline'} style={{ width: '18px', height: '18px' }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Attach to Container</span>
                    </label>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                  <div className="status-indicator">
                    <div className={`status-dot ${status.toLowerCase()}`}></div>
                    {status}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary" onClick={handleLaunch} disabled={status !== 'Offline'}>Deploy</button>
                    <button className="btn btn-danger" onClick={handleTerminate} disabled={status !== 'Online'}>Destroy</button>
                  </div>
                </div>
              </div>

              <div>
                <div className="section-title">Command Interface</div>
                <textarea 
                  className="input-field" 
                  placeholder=">_" 
                  value={command} 
                  onChange={(e) => setCommand(e.target.value)} 
                  disabled={status !== 'Online'} 
                  style={{ height: '80px', marginBottom: '16px', fontFamily: 'var(--font-mono)' }} 
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={handleExecute} disabled={status !== 'Online' || !command.trim()}>Execute</button>
                </div>
              </div>

              <div className="terminal-container">
                <div className="terminal-header">
                  <div className="term-dot red"></div>
                  <div className="term-dot yellow"></div>
                  <div className="term-dot green"></div>
                </div>
                <pre className="terminal-output">{output}</pre>
              </div>
            </div>
          </>
        )}
      </div>
      <footer className="app-footer">
        FriendCloud Protocol ‚Ä¢ Vishwa Panchal
      </footer>
    </div>
  );
}

export default App;
