import { useState, useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import './index.css';

// Components
import Background from './components/common/Background';
import Navbar from './components/common/Navbar';
import LandingPage from './components/landing/LandingPage';
import RoleSelection from './components/dashboard/RoleSelection';
import HostNodeSetup from './components/dashboard/HostNodeSetup';
import UplinkConnect from './components/dashboard/UplinkConnect';
import Orchestrator from './components/dashboard/Orchestrator';
import DedicatedTerminal from './components/dashboard/DedicatedTerminal';

// Utils
import { APP_MODES } from './utils/constants';

function App() {
  // Authentication & State
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('email') || '');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // App Navigation
  const [appMode, setAppMode] = useState(APP_MODES.SELECT); // select | host | rent | dashboard
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDedicatedTerminal, setIsDedicatedTerminal] = useState(false);

  // Connection Details
  const [secretCode, setSecretCode] = useState('');
  const [status, setStatus] = useState('Offline');
  const [hostInfo, setHostInfo] = useState(null);

  // Workload Configuration
  const [image, setImage] = useState('ubuntu:latest');
  const [ram, setRam] = useState(1);
  const [cpu, setCpu] = useState(1);
  const [storage, setStorage] = useState(5);
  const [maxRam, setMaxRam] = useState(2);
  const [maxCpu, setMaxCpu] = useState(2);
  const [maxStorage, setMaxStorage] = useState(20);

  // Terminal References
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const wsRef = useRef(null);

  // Maintain Theme State
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Extract auth query params if any
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("terminal") === "true") {
      setIsDedicatedTerminal(true);
      return;
    }
    const urlToken = params.get("token");
    const urlEmail = params.get("email");
    if (urlToken && urlEmail) {
      localStorage.setItem("token", urlToken);
      localStorage.setItem("email", urlEmail);
      setToken(urlToken);
      setUserEmail(urlEmail);
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // Window Resize handler for Xterm
  useEffect(() => {
    const handleResize = () => {
      if (fitAddonRef.current) fitAddonRef.current.fit();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize Terminal ONLY when in dashboard mode
  useEffect(() => {
    if (appMode === APP_MODES.DASHBOARD && terminalRef.current && !xtermRef.current) {
      const term = new Terminal({
        cursorBlink: true,
        fontFamily: '"Fira Code", monospace',
        fontSize: 14,
        theme: {
          background: '#0a0a0a',
          foreground: '#e2e8f0',
          cursor: '#06b6d4',
          selectionBackground: 'rgba(6, 182, 212, 0.3)'
        }
      });
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();
      term.writeln('\x1b[1;36m[FriendCloud Engine]\x1b[0m Terminal Initialized.');
      term.writeln('Awaiting workload instruction...');

      xtermRef.current = term;
      fitAddonRef.current = fitAddon;
    }

    // Cleanup if leaving dashboard
    return () => {
      if (appMode !== APP_MODES.DASHBOARD) {
        if (xtermRef.current) {
          xtermRef.current.dispose();
          xtermRef.current = null;
        }
        if (wsRef.current) {
          wsRef.current.close();
          wsRef.current = null;
        }
      }
    };
  }, [appMode]);

  // Connect to the provider Host
  const connectToHost = async () => {
    if (!secretCode) return;
    setIsConnecting(true);
    try {
      const decoded = atob(secretCode.trim());
      const [decodedHost, passkey] = decoded.split('|');
      const res = await fetch(`${decodedHost}/sysinfo`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkey, token })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Connection Failed");

      setHostInfo(data);
      let hostMaxRam = 2;
      let hostMaxCpu = 2;
      let hostMaxStorage = 20;

      if (data.allowed_ram !== undefined) {
        hostMaxRam = parseFloat(data.allowed_ram);
      } else if (data.ram && typeof data.ram === 'string') {
        const parsed = parseFloat(data.ram.replace(' GB', ''));
        hostMaxRam = isNaN(parsed) ? 2 : parsed;
      }

      if (data.allowed_storage !== undefined) {
        hostMaxStorage = parseInt(data.allowed_storage);
      }

      hostMaxCpu = data.allowed_cpu ? parseInt(data.allowed_cpu) : (data.cores || 2);

      setMaxRam(hostMaxRam);
      setMaxCpu(hostMaxCpu);
      setMaxStorage(hostMaxStorage);
      setRam(prev => Math.min(prev, hostMaxRam));
      setCpu(prev => Math.min(prev, hostMaxCpu));
      setStorage(prev => Math.min(prev, hostMaxStorage));

      setAppMode(APP_MODES.DASHBOARD);
    } catch (e) {
      alert(`Handshake Failed: ${e.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  // Launch Container Workload
  const handleLaunch = async () => {
    if (!secretCode) return;
    const decoded = atob(secretCode.trim());
    const [decodedHost, passkey] = decoded.split('|');
    const term = xtermRef.current;
    if (term) term.writeln(`\x1b[1;33m[SYS]\x1b[0m Requesting container allocation (${image})...`);

    try {
      const formattedRam = ram < 1 ? "512m" : `${ram}g`;
      const res = await fetch(`${decodedHost}/launch`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instance_id: "demo", image, ram: formattedRam, cpu: String(cpu), storage: `${storage}g`, passkey, token })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Launch failed");

      setStatus('Online');
      if (term) term.writeln(`\x1b[1;32m[SYS]\x1b[0m ${data.message}`);

      // Establish PTY WebSocket Tunnel
      const wsUrl = decodedHost.replace(/^http/, 'ws');
      const ws = new WebSocket(`${wsUrl}/pty?instance_id=demo&passkey=${encodeURIComponent(passkey)}`);

      ws.onopen = () => {
        if (term) term.writeln('\x1b[1;36m[SYS]\x1b[0m Secure PTY Link Established.');
      };

      ws.onmessage = (event) => {
        if (term) term.write(event.data);
      };

      ws.onerror = () => {
        if (term) term.writeln('\x1b[1;31m[SYS]\x1b[0m PTY Connection Disrupted.');
      };

      ws.onclose = () => {
        if (term) term.writeln('\x1b[1;31m[SYS]\x1b[0m Remote Host severed the connection.');
        setStatus('Offline');
      };

      term.onData(data => {
        if (ws.readyState === WebSocket.OPEN) ws.send(data);
      });

      wsRef.current = ws;
    } catch (e) {
      if (term) term.writeln(`\x1b[1;31m[ERR]\x1b[0m ${e.message}`);
      alert(`Launch error: ${e.message}`);
    }
  };

  // Terminate Container Workload
  const handleTerminate = async () => {
    if (!secretCode) return;
    const decoded = atob(secretCode.trim());
    const [decodedHost, passkey] = decoded.split('|');
    try {
      await fetch(`${decodedHost}/terminate`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instance_id: "demo", passkey, token })
      });
      setStatus('Offline');
      if (xtermRef.current) xtermRef.current.writeln('\x1b[1;31m[SYS]\x1b[0m Resources Released. Container Terminated.');
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    } catch (e) {
      alert("Failed to terminate container");
    }
  };

  // RENDER BLOCKS
  if (isDedicatedTerminal) {
    return <DedicatedTerminal theme={theme} />;
  }

  if (!token) {
    return (
      <div className="page-layout">
        <Background />
        <Navbar token={token} userEmail={userEmail} theme={theme} toggleTheme={toggleTheme} setAppMode={setAppMode} />
        <LandingPage />
      </div>
    );
  }

  return (
    <div className="page-layout">
      <Background />
      <Navbar token={token} userEmail={userEmail} theme={theme} toggleTheme={toggleTheme} setAppMode={setAppMode} />

      <main className="main-content">
        {appMode === APP_MODES.SELECT && <RoleSelection setAppMode={setAppMode} />}
        {appMode === APP_MODES.HOST && <HostNodeSetup setAppMode={setAppMode} />}
        {appMode === APP_MODES.RENT && (
          <UplinkConnect
            setAppMode={setAppMode}
            secretCode={secretCode}
            setSecretCode={setSecretCode}
            isConnecting={isConnecting}
            connectToHost={connectToHost}
          />
        )}
        {appMode === APP_MODES.DASHBOARD && (
          <Orchestrator
            setAppMode={setAppMode}
            setHostInfo={setHostInfo}
            secretCode={secretCode}
            setSecretCode={setSecretCode}
            setStatus={setStatus}
            status={status}
            wsRef={wsRef}
            hostInfo={hostInfo}
            image={image}
            setImage={setImage}
            ram={ram}
            setRam={setRam}
            maxRam={maxRam}
            cpu={cpu}
            setCpu={setCpu}
            maxCpu={maxCpu}
            storage={storage}
            setStorage={setStorage}
            maxStorage={maxStorage}
            handleLaunch={handleLaunch}
            handleTerminate={handleTerminate}
            terminalRef={terminalRef}
          />
        )}
      </main>
    </div>
  );
}

export default App;
