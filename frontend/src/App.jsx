import { useState, useEffect } from 'react';
import './index.css';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const CloudIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
  </svg>
);

const ServerIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
  </svg>
);

const RocketIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.45m.001 0c-.019.104-.039.208-.06.311m7.28-7.28c-.08-.135-.164-.268-.25-.4m-.4.25c.132.086.265.169.4.25m-7.28 7.28a14.927 14.927 0 01-5.841-2.58m-.12-8.54a6 6 0 017.38-5.84h-4.8m2.58 5.84a14.927 14.927 0 012.58-5.84"></path>
  </svg>
);

const ShieldIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
  </svg>
);

const LinkIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
  </svg>
);

const CpuIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
  </svg>
);

const TEMPLATES = [
  { id: 'ubuntu', name: 'Ubuntu Core', icon: '���', image: 'ubuntu:latest' },
  { id: 'python', name: 'Python 3.11', icon: '���', image: 'python:3.11-slim' },
  { id: 'node', name: 'Node.js 20', icon: '⚡', image: 'node:20-alpine' },
  { id: 'go', name: 'Golang 1.21', icon: '���', image: 'golang:1.21-alpine' },
  { id: 'postgres', name: 'PostgreSQL', icon: '���', image: 'postgres:15-alpine' },
  { id: 'redis', name: 'Redis Cache', icon: '���', image: 'redis:7-alpine' }
];

const RAM_HIERARCHY = ['512m', '1g', '2g', '4g', '8g', '16g', '32g', '64g'];
const RAM_UNIT_TO_GB = {
  m: 1 / 1024,
  mb: 1 / 1024,
  g: 1,
  gb: 1
};

const clampCpuLimit = (value) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) return 1;
  return parsed;
};

const resolveCpuLimit = (info) => {
  const rawLimit = info?.allowed_cpu ?? info?.max_cpu ?? info?.cpu_limit ?? info?.cores ?? info?.cpu_cores ?? '1';
  if (typeof rawLimit === 'number') return clampCpuLimit(rawLimit);

  const extracted = rawLimit?.toString().match(/\d+/)?.[0];
  return clampCpuLimit(extracted || '1');
};

const resolveRamLimit = (info) => {
  const rawLimit = info?.allowed_ram ?? info?.max_ram ?? info?.ram_limit ?? info?.ram ?? '512m';
  const normalized = rawLimit?.toString().toLowerCase().trim();

  if (!normalized) return '512m';
  if (RAM_HIERARCHY.includes(normalized)) return normalized;

  const numeric = normalized.match(/(\d+(\.\d+)?)/)?.[1];
  const unit = normalized.match(/(gb|g|mb|m)/)?.[1] || (normalized.includes('.') ? 'gb' : 'g');

  if (!numeric) return '512m';

  const amount = parseFloat(numeric);
  if (!Number.isFinite(amount) || amount <= 0) return '512m';

  const gbValue = amount * (RAM_UNIT_TO_GB[unit] || 1);
  if (!Number.isFinite(gbValue) || gbValue <= 0) return '512m';

  if (gbValue <= 0.75) return '512m';

  const maxWithTolerance = gbValue + 0.25;
  const eligible = RAM_HIERARCHY.filter((option) => {
    if (option === '512m') return maxWithTolerance >= 0.5;
    return parseInt(option, 10) <= maxWithTolerance;
  });

  return eligible.length ? eligible[eligible.length - 1] : '512m';
};

function App() {
  const [appMode, setAppMode] = useState('select');
  const [image, setImage] = useState('ubuntu:latest');
  const [ram, setRam] = useState('512m');
  const [cpu, setCpu] = useState('1');
  const [useGpu, setUseGpu] = useState(false);
  const [command, setCommand] = useState('');
  const [status, setStatus] = useState('Offline');
  
  // Standard string without HTML entities to prevent JSX escaping issues
  const [output, setOutput] = useState('> Interface initialized.\n> Awaiting secure handshake...');
  
  const [instanceId, setInstanceId] = useState('');
  const [token, setToken] = useState(localStorage.getItem('fc_token') || '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('fc_email') || '');
  const [secretCode, setSecretCode] = useState('');
  const [hostUrl, setHostUrl] = useState('');
  const [hostPasskey, setHostPasskey] = useState('');
  const [hostInfo, setHostInfo] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

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

  // Sync state explicitly to host limits when hostInfo is populated
  useEffect(() => {
    if (hostInfo) {
      setRam(resolveRamLimit(hostInfo));
      setCpu(resolveCpuLimit(hostInfo).toString());
      if (hostInfo.has_gpu && hostInfo.allowed_gpu) setUseGpu(true);
    }
  }, [hostInfo]);

  const logToConsole = (text) => setOutput((prev) => prev + text + '\n');

  const connectToHost = async () => {
    try {
      setIsConnecting(true);
      const decoded = atob(secretCode.trim());
      const [url, passkey] = decoded.split('|');
      if (!url || !passkey || !url.startsWith('http')) throw new Error("Invalid payload format.");

      const sysResponse = await fetch(`${url}/sysinfo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ passkey })
      });

      if (!sysResponse.ok) throw new Error("Host rejected connection.");
      const sysData = await sysResponse.json();

      setHostUrl(url);
      setHostPasskey(passkey);
      setHostInfo(sysData);
      
      setAppMode('dashboard');
      logToConsole(`> Secure link established to remote node: ${sysData.node}`);
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
    logToConsole(`> Pulling and allocating container [${image}]...`);
    try {
      const response = await fetch(`${hostUrl}/launch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ image, ram, cpu, use_gpu: useGpu, passkey: hostPasskey, instance_id: newInstanceId })
      });
      const data = await response.json();
      if (!response.ok) { setStatus('Error'); logToConsole(`> Rejected: ${data.detail}`); return; }
      setStatus('Online');
      logToConsole(`> Deployment verified.`);
    } catch (error) {
      setStatus('Error');
      logToConsole(`> Fatal: Connection to host lost.`);
    }
  };

  const handleExecute = async () => {
    if (!command.trim() || status !== 'Online') return;
    logToConsole(`> Executing: ${command}`);
    try {
      const response = await fetch(`${hostUrl}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ command, image, passkey: hostPasskey, instance_id: instanceId })
      });
      const data = await response.json();
      if (!response.ok) { logToConsole(`> Error: ${data.detail}`); return; }
      logToConsole(`${data.output}`);
    } catch (error) {
      logToConsole(`> Fatal: Execution timeout.`);
    }
  };

  const handleTerminate = async () => {
    setStatus('Terminating');
    try {
      const response = await fetch(`${hostUrl}/terminate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ passkey: hostPasskey, instance_id: instanceId })
      });
      const data = await response.json();
      if (!response.ok) { setStatus('Error'); logToConsole(`> Error: ${data.detail}`); return; }
      setStatus('Offline');
      setInstanceId('');
      logToConsole(`> Environment destroyed and resources freed.`);
    } catch (error) {
      setStatus('Error');
      logToConsole(`> Fatal: Could not terminate remote process.`);
    }
  };

  const getRamOptions = () => {
    const maxLimit = resolveRamLimit(hostInfo);
    const maxIndex = RAM_HIERARCHY.indexOf(maxLimit);
    return RAM_HIERARCHY.slice(0, maxIndex + 1);
  };

  const getCpuOptions = () => {
    const maxLimit = resolveCpuLimit(hostInfo);
    return Array.from({ length: maxLimit }, (_, i) => (i + 1).toString());
  };

  if (!token) {
    return (
      <div className="page-layout">
        <header className="nav-header">
          <div className="nav-brand">
            <CloudIcon /> FriendCloud
          </div>
          <div className="nav-links desktop-only">
            <a href="#features">Features</a>
            <a href="#docs">Documentation</a>
            <a href="#about">About</a>
          </div>
          <div className="nav-links">
            <button className="btn btn-secondary" onClick={() => window.location.href='/auth/google/login'}>
              Sign In
            </button>
          </div>
        </header>

        <main className="main-content">
          <section className="hero-section">
            <div className="badge" style={{ marginBottom: '24px' }}>v1.0 Production Ready</div>
            <h1 className="hero-title">Decentralized Compute Infrastructure</h1>
            <p className="hero-subtitle">
              Bypass NAT configurations, securely share physical GPU hardware, and orchestrate strict Docker environments directly on peer machines.
            </p>
            <button className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem' }} onClick={() => window.location.href='/auth/google/login'}>
              <GoogleIcon /> Continue with Google
            </button>
          </section>

          <section id="features" style={{ padding: '60px 0' }}>
            <h2 className="card-title" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '16px' }}>Protocol Architecture</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '40px' }}>Built for zero-trust environments and instant peer-to-peer deployments.</p>
            <div className="features-grid">
              <div className="feature-box">
                <div style={{ color: 'var(--primary)', marginBottom: '16px' }}><ShieldIcon /></div>
                <h3>Zero-Trust Isolation</h3>
                <p>Every payload runs within strictly limited Docker containers. Network and hardware access are capped via daemon profiles to protect the host system.</p>
              </div>
              <div className="feature-box">
                <div style={{ color: 'var(--primary)', marginBottom: '16px' }}><LinkIcon /></div>
                <h3>Seamless NAT Traversal</h3>
                <p>Utilizes reverse SSH tunneling to bypass firewalls and routers instantly. No manual port-forwarding or public IP management required.</p>
              </div>
              <div className="feature-box">
                <div style={{ color: 'var(--primary)', marginBottom: '16px' }}><CpuIcon /></div>
                <h3>Hardware Governance</h3>
                <p>The host agent actively scans motherboard components, allowing the node provider to set absolute limits on shared RAM, Cores, and NVIDIA GPUs.</p>
              </div>
            </div>
          </section>

          <section id="docs" style={{ padding: '60px 0' }}>
            <div className="card container-sm">
              <h2 className="card-title" style={{ fontSize: '1.75rem' }}>Implementation Guide</h2>
              <p className="card-desc">The protocol utilizes a two-party handshake to establish a secure peer-to-peer compute link.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '32px' }}>
                <div style={{ paddingLeft: '24px', borderLeft: '3px solid var(--border-light)' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>1. Agent Deployment (Host)</h4>
                  <p style={{ color: 'var(--text-muted)' }}>The provider executes the lightweight host binary, defining hardware limits and initiating the relay tunnel.</p>
                </div>
                <div style={{ paddingLeft: '24px', borderLeft: '3px solid var(--border-light)' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>2. Key Generation (Host)</h4>
                  <p style={{ color: 'var(--text-muted)' }}>The node produces an ephemeral, base64-encoded symmetric authorization key containing relay routing directions.</p>
                </div>
                <div style={{ paddingLeft: '24px', borderLeft: '3px solid var(--primary)' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>3. Environment Orchestration (Renter)</h4>
                  <p style={{ color: 'var(--text-muted)' }}>The consumer submits the key via the dashboard to instantly provision isolated Linux shells on the host machine.</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer style={{ borderTop: '1px solid var(--border-light)', padding: '40px 5%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', backgroundColor: 'var(--bg-surface)' }}>
          <p id="about" style={{ marginBottom: '12px' }}>
            <strong>System Architect:</strong> Vishwa Panchal (DevOps & Infrastructure Engineer)
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px' }}>
            <a href="https://github.com/vishwapanchal" target="_blank" rel="noreferrer">GitHub Profile</a>
            <a href="https://linkedin.com/in/thevishwapanchal" target="_blank" rel="noreferrer">LinkedIn Profile</a>
          </div>
          <p>&copy; {new Date().getFullYear()} FriendCloud Protocol. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <header className="nav-header">
        <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => setAppMode('select')}>
          <CloudIcon /> FC Console
        </div>
        <div className="nav-links">
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{userEmail.split('@')[0]}</span>
          <button className="btn btn-secondary" onClick={() => { localStorage.clear(); window.location.reload(); }}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="main-content">
        
        {appMode === 'select' && (
          <div className="container-sm">
            <h1 className="card-title" style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Select Network Operation</h1>
            <p className="card-desc" style={{ marginBottom: '32px' }}>Choose a role to begin participating in the compute network.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              
              <div className="card" style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setAppMode('host')} onMouseOver={e => {e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-4px)';}} onMouseOut={e => {e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.transform = 'translateY(0)';}}>
                <div style={{ marginBottom: '20px', padding: '12px', background: '#eff6ff', display: 'inline-block', borderRadius: '12px', color: 'var(--primary)' }}>
                  <ServerIcon />
                </div>
                <h2 className="card-title">Provision Host Node</h2>
                <p className="card-desc" style={{ minHeight: '45px' }}>Allocate local hardware resources to the network and generate an access key.</p>
                <span className="btn btn-secondary" style={{ width: '100%' }}>Setup Node &rarr;</span>
              </div>

              <div className="card" style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setAppMode('rent')} onMouseOver={e => {e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-4px)';}} onMouseOut={e => {e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.transform = 'translateY(0)';}}>
                <div style={{ marginBottom: '20px', padding: '12px', background: '#eff6ff', display: 'inline-block', borderRadius: '12px', color: 'var(--primary)' }}>
                  <RocketIcon />
                </div>
                <h2 className="card-title">Access Compute</h2>
                <p className="card-desc" style={{ minHeight: '45px' }}>Connect to a peer node using a symmetric authorization key.</p>
                <span className="btn btn-secondary" style={{ width: '100%' }}>Connect &rarr;</span>
              </div>

            </div>
          </div>
        )}

        {appMode === 'host' && (
          <div className="card container-sm">
            <button className="btn btn-secondary" style={{ marginBottom: '32px' }} onClick={() => setAppMode('select')}>&larr; Back to Operations</button>
            <h2 className="card-title" style={{ fontSize: '1.75rem' }}>Agent Deployment</h2>
            <p className="card-desc" style={{ marginBottom: '32px' }}>Follow the steps below to configure your machine as a secure host.</p>
            
            <div style={{ background: 'var(--bg-body)', padding: '32px', borderRadius: 'var(--radius-lg)', marginBottom: '24px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px' }}>1. Download Binary</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>Retrieve the standalone host executable for your operating system.</p>
              <button className="btn btn-primary" onClick={() => window.open('/download-agent', '_blank')}>Download Agent Executable</button>
            </div>

            <div style={{ background: 'var(--bg-body)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px' }}>2. Initialize Tunnel</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Execute the binary locally. Select your hardware sharing limits in the prompt, and the system will instantly output your session access key.</p>
            </div>
          </div>
        )}

        {appMode === 'rent' && (
          <div className="card container-sm">
            <button className="btn btn-secondary" style={{ marginBottom: '32px' }} onClick={() => setAppMode('select')}>&larr; Back to Operations</button>
            <h2 className="card-title" style={{ fontSize: '1.75rem' }}>Establish Uplink</h2>
            <p className="card-desc" style={{ marginBottom: '32px' }}>Enter the authorization key provided by the host node.</p>
            
            <div className="input-group">
              <label className="input-label">Symmetric Access Token</label>
              <input 
                type="password" 
                className="input-control" 
                placeholder="Paste key here..." 
                value={secretCode} 
                onChange={(e) => setSecretCode(e.target.value)} 
                style={{ fontFamily: 'var(--font-mono)', letterSpacing: '1px', fontSize: '1.1rem', padding: '16px' }}
              />
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.05rem' }} onClick={connectToHost} disabled={!secretCode.trim() || isConnecting}>
              {isConnecting ? "Negotiating handshake..." : "Connect to Node"}
            </button>
          </div>
        )}

        {appMode === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {hostInfo && (
                <div className="card" style={{ padding: '24px' }}>
                  <h3 className="card-title" style={{ fontSize: '1.15rem' }}>Target Node Specs</h3>
                  <div className="data-grid" style={{ marginTop: '16px' }}>
                    <div className="data-item"><span className="data-label">Node ID</span><span className="data-value">{hostInfo.node}</span></div>
                    <div className="data-item"><span className="data-label">OS</span><span className="data-value">{hostInfo.os}</span></div>
                    <div className="data-item"><span className="data-label">CPU</span><span className="data-value">{hostInfo.cpu_name}</span></div>
                    <div className="data-item"><span className="data-label">Max RAM</span><span className="data-value">{hostInfo.ram}</span></div>
                  </div>
                </div>
              )}

              <div className="card">
                <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Container Configuration</h3>
                
                <div className="input-group">
                  <label className="input-label">Quick Templates</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                    {TEMPLATES.map(t => (
                      <div 
                        key={t.id}
                        className={`template-card ${image === t.image ? 'active' : ''} ${status !== 'Offline' ? 'disabled' : ''}`}
                        onClick={() => status === 'Offline' && setImage(t.image)}
                      >
                        <span style={{ fontSize: '1.3rem' }}>{t.icon}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{t.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Custom DockerHub Image</label>
                  <input 
                    type="text" 
                    className="input-control" 
                    value={image} 
                    onChange={(e) => setImage(e.target.value)} 
                    disabled={status !== 'Offline'}
                    placeholder="e.g., redis:alpine, tensorflow/tensorflow:latest"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="input-group">
                    <label className="input-label">Memory Allocation</label>
                    <select className="input-control" value={ram} onChange={(e) => setRam(e.target.value)} disabled={status !== 'Offline'}>
                      {getRamOptions().map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">vCPU Cores</label>
                    <select className="input-control" value={cpu} onChange={(e) => setCpu(e.target.value)} disabled={status !== 'Offline'}>
                      {getCpuOptions().map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {hostInfo?.has_gpu && hostInfo?.allowed_gpu && (
                  <div style={{ padding: '16px', background: 'var(--bg-body)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={useGpu} onChange={(e) => setUseGpu(e.target.checked)} disabled={status !== 'Offline'} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Attach Hardware GPU</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{hostInfo.gpu_name}</div>
                      </div>
                    </label>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
                  <div className={`badge ${status === 'Online' ? 'badge-success' : ''}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                    {status}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary" onClick={handleLaunch} disabled={status !== 'Offline'}>Deploy Instance</button>
                    <button className="btn btn-danger" onClick={handleTerminate} disabled={status !== 'Online'}>Terminate</button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Execution Shell</h3>
                
                <div className="terminal" style={{ flex: 1, marginBottom: '24px', minHeight: '300px' }}>
                  <pre>{output}</pre>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <input 
                    type="text"
                    className="input-control" 
                    placeholder=">_ Enter payload command..." 
                    value={command} 
                    onChange={(e) => setCommand(e.target.value)} 
                    disabled={status !== 'Online'} 
                    onKeyDown={(e) => e.key === 'Enter' && status === 'Online' && command.trim() && handleExecute()}
                  />
                  <button className="btn btn-secondary" onClick={handleExecute} disabled={status !== 'Online' || !command.trim()}>
                    Execute
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default App;


