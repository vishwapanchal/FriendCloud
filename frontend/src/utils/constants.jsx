import React from 'react';
import { BoxSvg, CodeSvg, ZapSvg, DbSvg, StackSvg } from '../components/common/Icons';

export const TEMPLATES = [
    { id: 'ubuntu', name: 'Ubuntu Core', icon: <BoxSvg />, image: 'ubuntu:latest' },
    { id: 'python', name: 'Python 3.11', icon: <CodeSvg />, image: 'python:3.11-slim' },
    { id: 'node', name: 'Node.js 20', icon: <ZapSvg />, image: 'node:20-alpine' },
    { id: 'postgres', name: 'PostgreSQL', icon: <DbSvg />, image: 'postgres:15-alpine' },
    { id: 'redis', name: 'Redis Cache', icon: <StackSvg />, image: 'redis:7-alpine' }
];

export const APP_MODES = {
    SELECT: 'select',
    HOST: 'host',
    RENT: 'rent',
    DASHBOARD: 'dashboard'
};
