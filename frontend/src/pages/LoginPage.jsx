import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Dispatcher');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter valid credentials.');
      return;
    }
    // Simulate API call and login success
    setTimeout(() => {
      onLogin(role);
    }, 500);
  };

  return (
    <div className="flex h-screen w-full bg-[#121212] font-sans text-gray-200">
      
      {/* Left Panel: Light Grey Branding */}
      <div className="hidden lg:flex flex-col justify-between w-[40%] bg-[#cfd4d8] text-[#1a1a1a] p-12">
        <div>
          <div className="w-12 h-12 bg-orange-500/20 rounded-md border border-orange-500 flex items-center justify-center mb-6">
            <div className="w-6 h-6 border-[2px] border-orange-600 border-dashed rounded-sm"></div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">TransitOps</h1>
          <p className="text-gray-600 text-sm font-medium tracking-wide">Smart Transport Operations Platform</p>
          
          <div className="mt-24">
            <h2 className="text-lg font-bold mb-6">One login, four roles:</h2>
            <ul className="space-y-4">
              {['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'].map(r => (
                <li key={r} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
          TransitOps © 2026 • RBAC ENABLED
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-12 lg:px-32 relative">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">Sign in to your account</h2>
          <p className="text-sm text-gray-400 mb-10">Enter your credentials to continue</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="raven.k@transitops.in"
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md p-3 text-white focus:border-orange-500 outline-none transition-colors text-sm placeholder-gray-600"
              />
            </div>
            
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md p-3 text-white focus:border-orange-500 outline-none transition-colors text-sm placeholder-gray-600"
              />
            </div>
            
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Role (RBAC)</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md p-3 text-white focus:border-orange-500 outline-none transition-colors text-sm appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
              >
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Dispatcher">Dispatcher</option>
                <option value="Safety Officer">Safety Officer</option>
                <option value="Financial Analyst">Financial Analyst</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-200 transition-colors">
                <input type="checkbox" className="accent-orange-600 rounded bg-[#1a1a1a] border-gray-700" defaultChecked />
                Remember me
              </label>
              <a href="#" className="text-[#5c9ce6] hover:text-blue-400 font-medium transition-colors">Forgot password?</a>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-[#b36b22] hover:bg-[#c97826] text-white font-semibold py-3 rounded-md transition-colors shadow-lg shadow-orange-900/20"
            >
              Sign In
            </button>
          </form>

          <div className="mt-12">
            <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">Access is scoped by role after login:</h3>
            <ul className="text-xs text-gray-500 space-y-2 font-medium">
              <li>• Fleet Manager &rarr; Fleet, Maintenance</li>
              <li>• Dispatcher &rarr; Dashboard, Trips, Live Tracking</li>
              <li>• Safety Officer &rarr; Drivers</li>
              <li>• Financial Analyst &rarr; Fuel & Expenses, Analytics</li>
            </ul>
          </div>
        </div>

        {/* Floating Error State (matches wireframe) */}
        {error && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 w-64 border border-dashed border-red-500/50 bg-red-500/10 rounded-xl p-4 animate-pulse">
            <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
              <span>✕</span> Error state
            </h4>
            <p className="text-red-300 text-sm">{error} Account locked after 5 failed attempts.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginPage;
