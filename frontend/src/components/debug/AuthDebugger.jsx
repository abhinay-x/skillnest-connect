import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const AuthDebugger = () => {
  const { 
    currentUser, 
    userProfile, 
    loading, 
    isAuthenticated, 
    isProfileComplete,
    signup,
    login,
    logout
  } = useAuth();
  
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('Test123!');
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  useEffect(() => {
    addLog(`Auth state: ${currentUser ? `Logged in as ${currentUser.email}` : 'Not logged in'}`, 'info');
  }, [currentUser]);

  useEffect(() => {
    addLog(`Profile state: ${userProfile ? 'Profile loaded' : 'No profile'}`, 'info');
    if (userProfile) {
      addLog(`Profile complete: ${isProfileComplete() ? 'Yes' : 'No'}`, 'info');
    }
  }, [userProfile, isProfileComplete]);

  const handleSignup = async () => {
    addLog('Starting signup...', 'info');
    const result = await signup(testEmail, testPassword, {
      userType: 'customer',
      displayName: 'Test User'
    });
    
    if (result.success) {
      addLog('Signup successful!', 'success');
    } else {
      addLog(`Signup failed: ${result.error}`, 'error');
    }
  };

  const handleLogin = async () => {
    addLog('Starting login...', 'info');
    const result = await login(testEmail, testPassword);
    
    if (result.success) {
      addLog('Login successful!', 'success');
    } else {
      addLog(`Login failed: ${result.error}`, 'error');
    }
  };

  const handleLogout = async () => {
    addLog('Starting logout...', 'info');
    const result = await logout();
    
    if (result.success) {
      addLog('Logout successful!', 'success');
    } else {
      addLog(`Logout failed: ${result.error}`, 'error');
    }
  };

  const clearLogs = () => setLogs([]);

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Auth Debugger</h3>
        <button 
          onClick={clearLogs}
          className="text-xs bg-gray-200 px-2 py-1 rounded"
        >
          Clear
        </button>
      </div>
      
      {/* Current State */}
      <div className="mb-4 p-2 bg-gray-50 rounded text-sm">
        <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
        <div><strong>Authenticated:</strong> {isAuthenticated() ? 'Yes' : 'No'}</div>
        <div><strong>User:</strong> {currentUser ? currentUser.email : 'None'}</div>
        <div><strong>Profile:</strong> {userProfile ? 'Loaded' : 'None'}</div>
        <div><strong>Complete:</strong> {userProfile ? (isProfileComplete() ? 'Yes' : 'No') : 'N/A'}</div>
      </div>

      {/* Test Controls */}
      <div className="mb-4 space-y-2">
        <input
          type="email"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          className="w-full p-1 border rounded text-sm"
          placeholder="Email"
        />
        <input
          type="password"
          value={testPassword}
          onChange={(e) => setTestPassword(e.target.value)}
          className="w-full p-1 border rounded text-sm"
          placeholder="Password"
        />
        <div className="flex space-x-1">
          <button 
            onClick={handleSignup}
            className="flex-1 bg-blue-500 text-white px-2 py-1 rounded text-xs"
          >
            Signup
          </button>
          <button 
            onClick={handleLogin}
            className="flex-1 bg-green-500 text-white px-2 py-1 rounded text-xs"
          >
            Login
          </button>
          <button 
            onClick={handleLogout}
            className="flex-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Logs */}
      <div className="max-h-40 overflow-y-auto text-xs">
        {logs.map((log, index) => (
          <div 
            key={index} 
            className={`mb-1 ${
              log.type === 'error' ? 'text-red-600' : 
              log.type === 'success' ? 'text-green-600' : 
              'text-gray-700'
            }`}
          >
            <span className="text-gray-400">[{log.timestamp}]</span> {log.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthDebugger;
