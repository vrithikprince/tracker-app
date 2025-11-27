import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Vrithik Prince' && password === 'LetsDoIt') {
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="blur-bg" style={{ top: '-20%', left: '-10%', width: '500px', height: '500px', background: 'rgba(139, 92, 246, 0.2)' }} />
      <div className="blur-bg" style={{ bottom: '-20%', right: '-10%', width: '500px', height: '500px', background: 'rgba(59, 130, 246, 0.2)' }} />

      <div className="glass-panel p-8 w-full relative z-10 animate-fade-in" style={{ maxWidth: '400px' }}>
        <h2 className="font-bold text-center mb-2 gradient-text bg-clip-text text-transparent" style={{ fontSize: '2rem' }}>
          Tracker Access
        </h2>
        <p className="text-center text-gray mb-8">Please sign in to continue</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray">Username</label>
            <div className="relative">
              <User className="absolute text-gray" size={20} style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '40px', boxSizing: 'border-box' }}
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray">Password</label>
            <div className="relative">
              <Lock className="absolute text-gray" size={20} style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '40px', boxSizing: 'border-box' }}
                placeholder="Enter password"
              />
            </div>
          </div>

          {error && <p className="text-red text-sm text-center">{error}</p>}

          <button type="submit" className="btn-primary w-full">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray">
          <p>Credentials:</p>
          <p>User: Vrithik Prince | Pass: LetsDoIt</p>
        </div>
      </div>
    </div>
  );
};
