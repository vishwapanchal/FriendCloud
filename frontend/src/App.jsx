import { useState, useEffect } from 'react';
import './index.css';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const ServerIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
  </svg>
);

const RocketIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.45m.001 0c-.019.104-.039.208-.06.311m7.28-7.28c-.08-.135-.164-.268-.25-.4m-.4.25c.132.086.265.169.4.25m-7.28 7.28a14.927 14.927 0 01-5.841-2.58m-.12-8.54a6 6 0 017.38-5.84h-4.8m2.58 5.84a14.927 14.927 0 012.58-5.84"></path>
  </svg>
);

const BackIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
  </svg>
);

const CloudIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
  </svg>
);

const SunIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
  </svg>
);

const MoonIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
  </svg>
);

const GithubIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"></path>
  </svg>
);

const LinkedInIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
  </svg>
);

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
        <button className="btn btn-icon" onClick={() => setAppMode('select')} style={{ padding: '8px' }}>
          <CloudIcon />
        </button>
        <h1>FriendCloud <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '8px', fontWeight: '500' }}>{subtitle}</span></h1>
      </div>
      <div className="header-right">
        <span style={{ fontSize: '0.85rem', fontWeight: '600', marginRight: '8px' }}>{userEmail.split('@')[0]}</span>
        <button className="btn btn-icon" style={{ padding: '8px' }} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
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
          <h2><CloudIcon /> FriendCloud</h2>
          <button className="btn btn-primary auth-btn" style={{ padding: '10px 24px' }} onClick={() => window.location.href='/auth/google/login'}>
             Enter Network
          </button>
        </nav>
        
        <main className="landing-main">
          <h1 className="hero-title">Decentralized P2P Compute.</h1>
          <p className="hero-subtitle">
            Bypass NAT, share GPU and CPU resources, and execute isolated Docker containers natively on peer hardware. Zero network configuration required.
          </p>
          <div className="hero-cta">
            <button className="auth-btn" onClick={() => window.location.href='/auth/google/login'}>
              <GoogleIcon />
              Sign in with Google
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
                <GithubIcon /> GitHub
              </a>
              <a href="https://linkedin.com/in/thevishwapanchal" target="_blank" rel="noreferrer" className="social-btn">
                <span style={{ color: '#60a5fa', display: 'flex' }}><LinkedInIcon /></span> LinkedIn
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
                
                <div className="role-list">
                  <div className="role-banner" onClick={() => setAppMode('host')}>
                    <div className="banner-icon">
                      <ServerIcon />
                    </div>
                    <div className="banner-content">
                      <h2>Provision Node</h2>
                      <p>Allocate your local hardware resources to the secure network.</p>
                      <div className="banner-features">
                        <div className="feature-chip">Docker Isolation</div>
                        <div className="feature-chip">Hardware Limits</div>
                        <div className="feature-chip">Ephemeral Keys</div>
                      </div>
                    </div>
                    <div className="banner-action">
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </div>
                  
                  <div className="role-banner rent-banner" onClick={() => setAppMode('rent')}>
                    <div className="banner-icon">
                      <RocketIcon />
                    </div>
                    <div className="banner-content">
                      <h2>Access Compute</h2>
                      <p>Connect to a peer node using a symmetric authorization key.</p>
                      <div className="banner-features">
                        <div className="feature-chip">Ephemeral Envs</div>
                        <div className="feature-chip">GPU Acceleration</div>
                        <div className="feature-chip">Zero NAT Config</div>
                      </div>
                    </div>
                    <div className="banner-action">
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : appMode === 'host' ? (
          <>
            <AppHeader subtitle="Agent Setup" />
            <div className="body-content">
              <div className="nav-back-row">
                <button className="btn btn-icon" onClick={() => setAppMode('select')} style={{ background: 'transparent', border: 'none', padding: '0', color: 'var(--text-muted)' }}><BackIcon /> Back to Dashboard</button>
              </div>
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
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                <button className="btn btn-icon" onClick={() => setAppMode('select')} style={{ background: 'transparent', border: 'none', padding: '0', color: 'var(--text-muted)' }}><BackIcon /> Back to Dashboard</button>
              </div>
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
                      <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>NVIDIA GPU Available</span>
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
        FriendCloud Protocol • Vishwa Panchal
      </footer>
    </div>
  );
}

export default App;
