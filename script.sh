#!/bin/bash

cd frontend || exit 1

cat << 'EOF' > src/index.css
:root {
  --bg-color: #020617;
  --card-bg: rgba(15, 23, 42, 0.4);
  --card-border: rgba(51, 65, 85, 0.3);
  --border-color: rgba(51, 65, 85, 0.4);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --danger: #ef4444;
  --success: #10b981;
  --terminal-bg: #0f172a;
  --terminal-text: #34d399;
  --input-bg: rgba(30, 41, 59, 0.5);
  --header-bg: rgba(2, 6, 23, 0.8);
  --radius: 24px;
  --font-sans: ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, monospace;
  --neon-cyan: #06b6d4;
  --neon-blue: #3b82f6;
}

[data-theme='light'] {
  --bg-color: #f8fafc;
  --card-bg: rgba(255, 255, 255, 0.6);
  --card-border: rgba(226, 232, 240, 0.6);
  --border-color: rgba(226, 232, 240, 0.8);
  --text-main: #0f172a;
  --text-muted: #64748b;
  --input-bg: rgba(255, 255, 255, 0.8);
  --header-bg: rgba(255, 255, 255, 0.8);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: var(--font-sans);
  background-color: var(--bg-color);
  color: var(--text-main);
  line-height: 1.5;
  transition: background-color 0.3s ease, color 0.3s ease;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
  align-items: center;
  position: relative;
  z-index: 10;
}

@media (min-width: 768px) {
  .page-wrapper {
    padding: 40px 24px;
  }
}

.app-container {
  background: var(--card-bg);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  width: 100%;
  max-width: 1000px;
  border-radius: var(--radius);
  border: 1px solid var(--card-border);
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  padding: 20px 32px;
  border-bottom: 1px solid var(--card-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--header-bg);
  backdrop-filter: blur(20px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header h1 {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.body-content {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

@media (min-width: 768px) {
  .body-content {
    padding: 48px;
  }
}

.section-title {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.input-field {
  width: 100%;
  padding: 16px 20px;
  border: 1px solid var(--card-border);
  border-radius: 16px;
  font-size: 0.95rem;
  background: var(--input-bg);
  color: var(--text-main);
  outline: none;
  transition: all 0.2s ease;
  font-family: var(--font-sans);
}

.input-field:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  background: transparent;
}

.input-field:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn {
  padding: 14px 28px;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-primary {
  background: var(--primary);
  color: white;
  box-shadow: 0 8px 20px -6px rgba(59, 130, 246, 0.5);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 12px 25px -6px rgba(59, 130, 246, 0.6);
}

.btn-danger {
  background: transparent;
  color: var(--danger);
  border: 1px solid var(--danger);
}

.btn-danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.1);
  transform: translateY(-2px);
}

.btn-icon {
  background: var(--input-bg);
  border: 1px solid var(--card-border);
  color: var(--text-main);
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.btn-icon:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-2px);
}

.terminal-container {
  background: var(--terminal-bg);
  border-radius: 16px;
  padding: 20px;
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.5), 0 10px 30px -10px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255,255,255,0.05);
}

.terminal-header {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
}

.term-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.term-dot.red { background: #ff5f56; }
.term-dot.yellow { background: #ffbd2e; }
.term-dot.green { background: #27c93f; }

.terminal-output {
  font-family: var(--font-mono);
  color: var(--terminal-text);
  font-size: 0.9rem;
  white-space: pre-wrap;
  max-height: 350px;
  overflow-y: auto;
}

.app-footer {
  margin-top: auto;
  padding: 32px 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
  z-index: 10;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 10px 20px;
  background: var(--input-bg);
  border-radius: 20px;
  border: 1px solid var(--card-border);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 10px currentColor;
}

.status-dot.offline { background: var(--text-muted); color: var(--text-muted); }
.status-dot.launching { background: #f59e0b; color: #f59e0b; }
.status-dot.online { background: var(--success); color: var(--success); }

.host-specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 16px;
  background: var(--input-bg);
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 24px;
  border: 1px solid var(--card-border);
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.spec-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 800;
  letter-spacing: 0.05em;
}

.spec-value {
  font-size: 1rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 10px 0;
}

.dashboard-header {
  text-align: left;
  margin-bottom: 10px;
}

.dashboard-greeting {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 8px;
}

.highlight-text {
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dashboard-sub {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.role-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.role-banner {
  display: flex;
  align-items: center;
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 28px;
  padding: 32px 40px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
  gap: 32px;
  position: relative;
  overflow: hidden;
}

@media (max-width: 640px) {
  .role-banner {
    flex-direction: column;
    text-align: center;
    padding: 32px 24px;
  }
}

.role-banner::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.role-banner:hover::after {
  transform: translateX(100%);
}

.role-banner:hover {
  transform: translateX(8px);
  border-color: var(--primary);
  box-shadow: 0 20px 40px -10px rgba(59, 130, 246, 0.15);
}

.rent-banner:hover {
  border-color: #8b5cf6;
  box-shadow: 0 20px 40px -10px rgba(139, 92, 246, 0.15);
}

.banner-icon {
  width: 80px;
  height: 80px;
  border-radius: 24px;
  background: rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.rent-banner .banner-icon {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.role-banner:hover .banner-icon {
  transform: scale(1.1) rotate(-5deg);
  border-radius: 16px;
}

.banner-content {
  flex-grow: 1;
}

.banner-content h2 {
  font-size: 1.7rem;
  font-weight: 800;
  margin-bottom: 8px;
}

.banner-content p {
  color: var(--text-muted);
  font-size: 1.1rem;
  line-height: 1.5;
}

.banner-features {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .banner-features {
    justify-content: center;
  }
}

.feature-chip {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.85rem;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.feature-chip::before {
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  background: var(--success);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--success);
}

.role-banner:hover .feature-chip {
  background: var(--input-bg);
}

.banner-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.role-banner:hover .banner-action {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
  transform: scale(1.1) translateX(4px);
}

.rent-banner:hover .banner-action {
  background: #8b5cf6;
  border-color: #8b5cf6;
}

.nav-back-row {
  margin-bottom: 10px;
}


@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

@keyframes glitch {
  0% { transform: translate(0) }
  20% { transform: translate(-2px, 1px) }
  40% { transform: translate(-1px, -1px) }
  60% { transform: translate(2px, 1px) }
  80% { transform: translate(1px, -1px) }
  100% { transform: translate(0) }
}

.hud-body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  background-color: #020617;
  background-image: 
    linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: center center;
  overflow: hidden;
  color: var(--neon-cyan);
  font-family: var(--font-mono);
  display: flex;
  justify-content: center;
  align-items: center;
}

.hud-scanline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.1), transparent);
  animation: scanline 8s linear infinite;
  pointer-events: none;
  z-index: 999;
}

.hud-mainframe {
  width: 95vw;
  height: 90vh;
  max-width: 1400px;
  border: 1px solid rgba(6, 182, 212, 0.3);
  background: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(10px);
  display: grid;
  grid-template-columns: 280px 1fr;
  grid-template-rows: 60px 1fr;
  position: relative;
  box-shadow: 0 0 40px rgba(6, 182, 212, 0.1) inset, 0 0 20px rgba(0,0,0,0.8);
  clip-path: polygon(
    0 20px, 
    20px 0, 
    calc(100% - 20px) 0, 
    100% 20px, 
    100% calc(100% - 20px), 
    calc(100% - 20px) 100%, 
    20px 100%, 
    0 calc(100% - 20px)
  );
}

.hud-mainframe::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border: 2px solid var(--neon-cyan);
  pointer-events: none;
  opacity: 0.5;
  clip-path: polygon(
    0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 
    100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px)
  );
}

.hud-topbar {
  grid-column: 1 / -1;
  border-bottom: 1px solid rgba(6, 182, 212, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: rgba(6, 182, 212, 0.05);
}

.hud-logo {
  font-weight: 800;
  letter-spacing: 0.2em;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  text-shadow: 0 0 10px var(--neon-cyan);
}

.hud-sysinfo {
  font-size: 0.75rem;
  color: rgba(6, 182, 212, 0.7);
  display: flex;
  gap: 20px;
}

.hud-sidebar {
  border-right: 1px solid rgba(6, 182, 212, 0.3);
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: linear-gradient(90deg, rgba(6, 182, 212, 0.02), transparent);
}

.hud-nav-item {
  padding: 16px 24px;
  cursor: pointer;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.hud-nav-item:hover {
  background: rgba(6, 182, 212, 0.1);
  color: #fff;
  border-left: 3px solid rgba(6, 182, 212, 0.5);
}

.hud-nav-item.active {
  background: rgba(6, 182, 212, 0.15);
  color: var(--neon-cyan);
  border-left: 3px solid var(--neon-cyan);
  font-weight: bold;
  text-shadow: 0 0 8px rgba(6, 182, 212, 0.5);
}

.hud-content {
  padding: 40px;
  overflow-y: auto;
  position: relative;
}

.hud-content::-webkit-scrollbar {
  width: 4px;
}
.hud-content::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.2);
}
.hud-content::-webkit-scrollbar-thumb {
  background: var(--neon-cyan);
}

.hud-title {
  font-family: var(--font-sans);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 900;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.hud-desc {
  font-size: 1.1rem;
  color: #cbd5e1;
  max-width: 600px;
  line-height: 1.7;
  margin-bottom: 40px;
  font-family: var(--font-sans);
}

.hud-btn {
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid var(--neon-cyan);
  color: var(--neon-cyan);
  padding: 16px 32px;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.2) inset;
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}

.hud-btn:hover {
  background: var(--neon-cyan);
  color: #000;
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.6);
}

.hud-btn-google {
  background: #ffffff;
  border: 1px solid #ffffff;
  color: #000000;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

.hud-btn-google:hover {
  background: #f8fafc;
  color: #000;
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.hud-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.hud-panel {
  border: 1px solid rgba(6, 182, 212, 0.3);
  background: rgba(0, 0, 0, 0.4);
  padding: 24px;
  position: relative;
}

.hud-panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 10px; height: 10px;
  border-top: 2px solid var(--neon-cyan);
  border-left: 2px solid var(--neon-cyan);
}

.hud-panel h3 {
  color: #fff;
  font-family: var(--font-sans);
  font-size: 1.2rem;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.hud-panel p {
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.6;
}

.architect-data {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.data-row {
  display: flex;
  border-bottom: 1px dashed rgba(6, 182, 212, 0.2);
  padding-bottom: 12px;
}

.data-label {
  width: 150px;
  color: rgba(6, 182, 212, 0.7);
  font-size: 0.85rem;
}

.data-value {
  color: #fff;
  font-family: var(--font-sans);
  font-weight: 500;
}

.blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink { 50% { opacity: 0; } }

@media (max-width: 768px) {
  .hud-mainframe {
    grid-template-columns: 1fr;
    grid-template-rows: 60px auto 1fr;
    height: 95vh;
  }
  .hud-sidebar {
    flex-direction: row;
    overflow-x: auto;
    padding: 0;
    border-right: none;
    border-bottom: 1px solid rgba(6, 182, 212, 0.3);
  }
  .hud-nav-item {
    border-left: none;
    border-bottom: 3px solid transparent;
    white-space: nowrap;
  }
  .hud-nav-item.active {
    border-left: none;
    border-bottom: 3px solid var(--neon-cyan);
  }
  .hud-sysinfo {
    display: none;
  }
}
EOF

cat << 'EOF' > src/App.jsx
import { useState, useEffect } from 'react';
import './index.css';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const ShieldIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
  </svg>
);

const CpuIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
  </svg>
);

const GlobeIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
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
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
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
  <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"></path>
  </svg>
);

const LinkedInIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
  </svg>
);

function App() {
  const [landingTab, setLandingTab] = useState('sys_core');
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
        <button className="btn btn-icon" onClick={() => setAppMode('select')} style={{ padding: '8px 12px', boxShadow: 'none' }}>
          <CloudIcon />
        </button>
        <h1>FriendCloud <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '12px', fontWeight: '500' }}>/ {subtitle}</span></h1>
      </div>
      <div className="header-right">
        <span style={{ fontSize: '0.9rem', fontWeight: '600', marginRight: '12px', color: 'var(--text-muted)' }}>{userEmail.split('@')[0]}</span>
        <button className="btn btn-icon" style={{ padding: '10px', boxShadow: 'none' }} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <button className="btn btn-danger" style={{ padding: '10px 20px' }} onClick={() => { localStorage.clear(); window.location.reload(); }}>
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
      <div className="hud-body">
        <div className="hud-scanline"></div>
        <div className="hud-mainframe">
          <div className="hud-topbar">
            <div className="hud-logo">
              <CloudIcon /> FRIENDCLOUD_OS
            </div>
            <div className="hud-sysinfo">
              <span>STATUS: ONLINE</span>
              <span>NETWORK: SECURE</span>
              <span>USER: UNVERIFIED</span>
            </div>
          </div>
          
          <div className="hud-sidebar">
            <div className={`hud-nav-item ${landingTab === 'sys_core' ? 'active' : ''}`} onClick={() => setLandingTab('sys_core')}>
              [0x01] SYS_CORE
            </div>
            <div className={`hud-nav-item ${landingTab === 'topology' ? 'active' : ''}`} onClick={() => setLandingTab('topology')}>
              [0x02] NETWORK_TOPOLOGY
            </div>
            <div className={`hud-nav-item ${landingTab === 'architect' ? 'active' : ''}`} onClick={() => setLandingTab('architect')}>
              [0x03] ARCHITECT_DATA
            </div>
          </div>

          <div className="hud-content">
            {landingTab === 'sys_core' && (
              <div style={{ animation: 'glitch 0.2s ease-out' }}>
                <div style={{ color: 'var(--neon-cyan)', marginBottom: '10px', letterSpacing: '0.2em', fontSize: '0.8rem' }}>> INITIALIZING DISTRIBUTED CLUSTER...</div>
                <h1 className="hud-title">Decentralized<br/>P2P Compute</h1>
                <p className="hud-desc">
                  Bypass NAT. Leverage hardware GPU acceleration. Spawn isolated Docker container instances natively across a zero-trust peer-to-peer relay network. No cloud providers. Full hardware control.
                </p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <button className="hud-btn hud-btn-google" onClick={() => window.location.href='/auth/google/login'}>
                    <GoogleIcon /> AUTHENTICATE VIA GOOGLE
                  </button>
                  <button className="hud-btn" onClick={() => setLandingTab('topology')}>
                    VIEW TOPOLOGY
                  </button>
                </div>
              </div>
            )}

            {landingTab === 'topology' && (
              <div style={{ animation: 'glitch 0.2s ease-out' }}>
                <div style={{ color: 'var(--neon-cyan)', marginBottom: '10px', letterSpacing: '0.2em', fontSize: '0.8rem' }}>> QUERYING INFRASTRUCTURE SPECS...</div>
                <h2 className="hud-title" style={{ fontSize: '2rem' }}>Network Capabilities</h2>
                <div className="hud-grid">
                  <div className="hud-panel">
                    <h3><ShieldIcon /> Zero-Trust Isolation</h3>
                    <p>Payloads execute within strict Daemon constraints. Network and hardware capabilities are heavily restricted via symmetric keys to protect the host machine.</p>
                  </div>
                  <div className="hud-panel">
                    <h3><GlobeIcon /> NAT Traversal</h3>
                    <p>Reverse SSH tunneling completely bypasses home routers and firewalls. No port-forwarding or dynamic DNS configuration required.</p>
                  </div>
                  <div className="hud-panel">
                    <h3><CpuIcon /> Hardware Allocation</h3>
                    <p>Host agent dynamically scans motherboards for available RAM, CPU Cores, and NVIDIA GPUs, establishing absolute hardware governor limits.</p>
                  </div>
                </div>
              </div>
            )}

            {landingTab === 'architect' && (
              <div style={{ animation: 'glitch 0.2s ease-out' }}>
                <div style={{ color: 'var(--neon-cyan)', marginBottom: '10px', letterSpacing: '0.2em', fontSize: '0.8rem' }}>> ACCESSING PERSONNEL DATABASE...</div>
                <h2 className="hud-title" style={{ fontSize: '2rem' }}>Vishwa Panchal</h2>
                
                <div className="architect-data">
                  <div className="data-row">
                    <div className="data-label">ROLE:</div>
                    <div className="data-value">System Architect / Infrastructure Engineer</div>
                  </div>
                  <div className="data-row">
                    <div className="data-label">SPECIALIZATION:</div>
                    <div className="data-value">DevOps, Cloud Architecture, Distributed Systems</div>
                  </div>
                  <div className="data-row">
                    <div className="data-label">PROJECT_DIRECTIVE:</div>
                    <div className="data-value" style={{ lineHeight: '1.6', color: '#cbd5e1' }}>
                      Engineered FriendCloud to eliminate the friction of localized network traversal. By abstracting complex routing requirements, this protocol provides seamless, zero-trust execution environments directly on peer hardware.
                    </div>
                  </div>
                  <div className="data-row" style={{ borderBottom: 'none', marginTop: '20px' }}>
                    <div className="data-label">EXTERNAL_LINKS:</div>
                    <div className="data-value" style={{ display: 'flex', gap: '20px' }}>
                      <a href="https://github.com/vishwapanchal" target="_blank" rel="noreferrer" style={{ color: 'var(--neon-cyan)', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <GithubIcon /> GITHUB
                      </a>
                      <a href="https://linkedin.com/in/thevishwapanchal" target="_blank" rel="noreferrer" style={{ color: 'var(--neon-cyan)', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <LinkedInIcon /> LINKEDIN
                      </a>
                    </div>
                  </div>
                </div>
                
                <div style={{ position: 'absolute', bottom: '40px', right: '40px', color: 'var(--neon-cyan)', opacity: '0.5', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  END_OF_FILE <span className="blink">_</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {appMode === 'select' ? (
          <>
            <AppHeader subtitle="Network Console" />
            <div className="body-content">
              <div className="dashboard-wrapper">
                <div className="dashboard-header">
                  <h1 className="dashboard-greeting">Session <span className="highlight-text">Active</span></h1>
                  <p className="dashboard-sub">Select a network role to begin orchestration.</p>
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
                <button className="btn btn-icon" onClick={() => setAppMode('select')} style={{ background: 'transparent', border: 'none', padding: '0', color: 'var(--text-muted)', boxShadow: 'none' }}><BackIcon /> Cancel</button>
              </div>
              <div className="section-title">Deployment Protocol</div>
              <div className="form-grid">
                <div className="role-card" style={{ cursor: 'default', alignItems: 'flex-start', textAlign: 'left', padding: '32px' }}>
                  <strong style={{ marginBottom: '12px', fontSize: '1.1rem' }}>1. System Binary</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.6' }}>Acquire the standalone host agent executable for your system.</p>
                  <button className="btn btn-primary" onClick={() => window.open('/download-agent', '_blank')}>Download Agent &darr;</button>
                </div>
                <div className="role-card" style={{ cursor: 'default', alignItems: 'flex-start', textAlign: 'left', padding: '32px' }}>
                  <strong style={{ marginBottom: '12px', fontSize: '1.1rem' }}>2. Initialize Tunnel</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>Execute the binary locally. It will secure the SSH tunnel and generate your ephemeral session key.</p>
                </div>
              </div>
            </div>
          </>
        ) : appMode === 'rent' ? (
          <>
            <AppHeader subtitle="Establish Link" />
            <div className="body-content" style={{ alignItems: 'center' }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                <button className="btn btn-icon" onClick={() => setAppMode('select')} style={{ background: 'transparent', border: 'none', padding: '0', color: 'var(--text-muted)', boxShadow: 'none' }}><BackIcon /> Cancel</button>
              </div>
              <div style={{ width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--input-bg)', padding: '40px', borderRadius: '24px', border: '1px solid var(--card-border)' }}>
                <div className="section-title" style={{ justifyContent: 'center', marginBottom: '0' }}>Symmetric Key Exchange</div>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Input the secure token provided by the host node.</p>
                <input 
                  className="input-field" 
                  type="password" 
                  placeholder="Paste authorization string..." 
                  value={secretCode} 
                  onChange={(e) => setSecretCode(e.target.value)} 
                  style={{ textAlign: 'center', letterSpacing: '2px', padding: '20px' }}
                />
                <button className="btn btn-primary" onClick={connectToHost} disabled={!secretCode.trim() || isConnecting} style={{ padding: '16px', fontSize: '1rem' }}>
                  {isConnecting ? "Negotiating Handshake..." : "Initialize Connection"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <AppHeader subtitle="Remote Execution" />
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <select className="input-field" value={ram} onChange={(e) => setRam(e.target.value)} disabled={status !== 'Offline'}>
                      {getRamOptions().map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                    </select>
                    <select className="input-field" value={cpu} onChange={(e) => setCpu(e.target.value)} disabled={status !== 'Offline'}>
                      {getCpuOptions().map(c => <option key={c} value={c}>{c} vCPU</option>)}
                    </select>
                  </div>
                </div>

                {hostInfo?.has_gpu && hostInfo?.allowed_gpu && (
                  <div style={{ marginTop: '20px', padding: '16px 20px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid var(--success)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: '800', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        NVIDIA GPU Available
                      </span>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{hostInfo.gpu_name}</div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: 'var(--input-bg)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                      <input type="checkbox" checked={useGpu} onChange={(e) => setUseGpu(e.target.checked)} disabled={status !== 'Offline'} style={{ width: '18px', height: '18px', accentColor: 'var(--success)' }} />
                      <span style={{ fontSize: '0.95rem', fontWeight: '700' }}>Attach via Toolkit</span>
                    </label>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', background: 'var(--input-bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
                  <div className="status-indicator" style={{ border: 'none', boxShadow: 'none', background: 'transparent', padding: '0' }}>
                    <div className={`status-dot ${status.toLowerCase()}`}></div>
                    <span style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>{status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary" onClick={handleLaunch} disabled={status !== 'Offline'}>Deploy Image</button>
                    <button className="btn btn-danger" onClick={handleTerminate} disabled={status !== 'Online'}>Terminate Process</button>
                  </div>
                </div>
              </div>

              <div>
                <div className="section-title">Execution Shell</div>
                <textarea 
                  className="input-field" 
                  placeholder=">_ Enter payload command..." 
                  value={command} 
                  onChange={(e) => setCommand(e.target.value)} 
                  disabled={status !== 'Online'} 
                  style={{ height: '100px', marginBottom: '16px', fontFamily: 'var(--font-mono)' }} 
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={handleExecute} disabled={status !== 'Online' || !command.trim()}>Execute Payload</button>
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
EOF

npm run build