import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const DedicatedTerminal = ({ theme }) => {
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);
    const fitAddonRef = useRef(null);
    const wsRef = useRef(null);

    const [status, setStatus] = useState('Connecting...');
    const [host, setHost] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const rawKey = params.get('key');

        if (!rawKey || !terminalRef.current) {
            setStatus('Invalid Setup: Missing connection keys.');
            return;
        }

        const decoded = atob(rawKey.trim());
        const [decodedHost, passkey] = decoded.split('|');
        setHost(decodedHost);

        // Term Initialization
        const term = new Terminal({
            cursorBlink: true,
            fontFamily: '"Fira Code", monospace',
            fontSize: 15,
            theme: {
                background: '#09090b',
                foreground: '#f8fafc',
                cursor: '#06b6d4',
                selectionBackground: 'rgba(6, 182, 212, 0.3)'
            }
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        term.writeln('\x1b[1;36m=======================================================================\x1b[0m');
        term.writeln(' \x1b[1;36m[\u26A1]\x1b[0m \x1b[1;37mFriendCloud Isolated Command Line Interface\x1b[0m');
        term.writeln('\x1b[1;36m=======================================================================\x1b[0m');
        term.writeln(`\x1b[1;34m[SYS]\x1b[0m Initiating handshake to Host Node...`);

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Resize Hook
        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        // Websocket Instantiation
        const wsUrl = decodedHost.replace(/^http/, 'ws');
        const ws = new WebSocket(`${wsUrl}/ws/demo?passkey=${encodeURIComponent(passkey)}`);

        ws.onopen = () => {
            setStatus('Connected');
            term.writeln('\x1b[1;32m[SYS]\x1b[0m \u2714 Secure PTY Link Established.');
            term.writeln('');
        };

        ws.onmessage = (event) => term.write(event.data);

        ws.onerror = () => {
            setStatus('Connection Disrupted');
            term.writeln('\x1b[1;31m[SYS]\x1b[0m \u2718 PTY Network Failure.');
        };

        ws.onclose = () => {
            setStatus('Offline');
            term.writeln('\n\x1b[1;31m[SYS]\x1b[0m Host closed the session.');
        };

        term.onData(data => {
            if (ws.readyState === WebSocket.OPEN) ws.send(data);
        });

        wsRef.current = ws;

        return () => {
            window.removeEventListener('resize', handleResize);
            if (xtermRef.current) xtermRef.current.dispose();
            if (wsRef.current) wsRef.current.close();
        };
    }, []);

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#09090b', color: '#fff', fontFamily: 'var(--font-mono)' }}>
            <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#000' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div onClick={() => window.close()} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', cursor: 'pointer' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>bash - {host || 'friendcloud-node'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {status !== 'Connected' && (
                        <button
                            onClick={() => window.location.reload()}
                            style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s ease', backgroundColor: 'rgba(6, 182, 212, 0.1)' }}
                        >
                            Reconnect
                        </button>
                    )}
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: status === 'Connected' ? '#10b981' : '#ef4444', boxShadow: `0 0 10px ${status === 'Connected' ? '#10b981' : '#ef4444'}` }}></div>
                    <span style={{ fontSize: '0.85rem', color: status === 'Connected' ? '#10b981' : '#ef4444', fontWeight: 600 }}>{status}</span>
                </div>
            </div>

            <div style={{ flex: 1, padding: '16px', overflow: 'hidden' }}>
                <div ref={terminalRef} style={{ width: '100%', height: '100%' }}></div>
            </div>
        </div>
    );
};

export default DedicatedTerminal;
