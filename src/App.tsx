/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  Phone,
  Lock,
  LogOut,
  Settings,
  Users,
  Activity
} from 'lucide-react';

const DEFAULT_DATA = {
  name: "Md Jahid Hasan",
  nameHighlight: "Emon",
  role: "NOC Engineer",
  designation: "Junior Engineer, NOC | Bright Technologies Limited",
  university: "Northern University Bangladesh",
  location: "Dhaka, Bangladesh",
  bio: "IT Support & NOC Engineer specializing in network infrastructure monitoring, configuring Cisco & MikroTik routers, and managing OLT switches to ensure high availability. Dedicated to real-time network monitoring and troubleshooting.",
  phone: "01303258509",
  email: "jahidhasanemon2211@gmail.com",
  github: "https://github.com/jahidhasanemon2211",
  linkedin: "https://www.linkedin.com/in/jahid-hasan-emon-9a4971227/",
  facebook: "https://www.facebook.com/jahidhasan.emon.549/",
  instagram: "https://www.instagram.com/worst_emon/",
  website: "https://jahidhasanemon.pro.bd/"
};

export default function App() {
  const [isAdminPage, setIsAdminPage] = useState(
    window.location.pathname === '/8509' || window.location.pathname === '//8509'
  );
  
  // Dynamic portfolio data
  const [portfolioData, setPortfolioData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin Form State
  const [formData, setFormData] = useState(DEFAULT_DATA);
  const [saveStatus, setSaveStatus] = useState({ success: false, error: '', loading: false });

  // Visitor statistics
  const [stats, setStats] = useState({ onlineVisitors: 0, totalVisitors: 0 });

  // Monitor location changes for routing
  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminPage(window.location.pathname === '/8509' || window.location.pathname === '//8509');
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Check stored auth session
  useEffect(() => {
    if (isAdminPage) {
      const storedPassword = localStorage.getItem('admin_password');
      if (storedPassword === 'Xpon@Olt9417#') {
        setIsAuthenticated(true);
      }
    }
  }, [isAdminPage]);

  // Load portfolio data
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch('/api/portfolio');
        const json = await res.json();
        if (json && json.data) {
          const mergedData = { ...DEFAULT_DATA, ...json.data };
          setPortfolioData(mergedData);
          setFormData(mergedData);
        }
      } catch (err) {
        console.error("Failed to load portfolio data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  // Visitor Heartbeat (only for public view)
  useEffect(() => {
    if (isAdminPage) return;

    let sessId = sessionStorage.getItem('emon_session_id');
    if (!sessId) {
      sessId = 'sess_' + Math.random().toString(36).substring(2, 11);
      sessionStorage.setItem('emon_session_id', sessId);
    }

    const sendHeartbeat = async () => {
      try {
        await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessId })
        });
      } catch (err) {
        // fail silently
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 20000);
    return () => clearInterval(interval);
  }, [isAdminPage]);

  // Admin Visitor Stats polling
  useEffect(() => {
    if (!isAdminPage || !isAuthenticated) return;

    const fetchStats = async () => {
      try {
        const storedPassword = localStorage.getItem('admin_password') || '';
        const res = await fetch(`/api/stats?password=${encodeURIComponent(storedPassword)}`);
        if (res.ok) {
          const json = await res.json();
          setStats({
            onlineVisitors: json.onlineVisitors || 0,
            totalVisitors: json.totalVisitors || 0
          });
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [isAdminPage, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Xpon@Olt9417#') {
      localStorage.setItem('admin_password', passwordInput);
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_password');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus({ success: false, error: '', loading: true });
    
    try {
      const storedPassword = localStorage.getItem('admin_password') || '';
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: storedPassword,
          data: formData
        })
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to save changes');
      }

      setPortfolioData(formData);
      setSaveStatus({ success: true, error: '', loading: false });
      
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, success: false }));
      }, 3000);
    } catch (err: any) {
      setSaveStatus({ success: false, error: err.message, loading: false });
    }
  };

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setIsAdminPage(path === '/8509' || path === '//8509');
  };

  if (loading && !isAdminPage) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-amber-500 font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <span>MONITORING NETWORK...</span>
        </div>
      </div>
    );
  }

  if (isAdminPage) {
    return (
      <div className="min-h-screen bg-[#080808] text-white font-sans relative selection:bg-amber-500/30 selection:text-amber-100 p-6 md:p-12">
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-900 pb-6 mb-8 gap-4">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-amber-500" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">Admin Portal</h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">Control Room // Monitoring System</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigateTo('/')} 
                className="px-4 py-2 border border-gray-800 text-gray-300 hover:text-white hover:border-amber-500 transition-colors text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Exit Portal
              </button>
              {isAuthenticated && (
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 bg-red-950/20 text-red-500 border border-red-900/30 hover:bg-red-900/20 transition-colors text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              )}
            </div>
          </div>

          {!isAuthenticated ? (
            /* Login Screen */
            <div className="max-w-md mx-auto my-12 p-8 bg-[#111] border border-gray-900 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              
              <div className="flex flex-col items-center mb-6 text-center">
                <div className="p-4 bg-amber-500/10 rounded-full text-amber-500 mb-3 border border-amber-500/20">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold uppercase tracking-widest font-mono text-amber-500">Security Gate</h2>
                <p className="text-xs text-gray-500 font-mono mt-1">Authorized personnel only</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-mono text-gray-400 mb-2">Access Key</label>
                  <input
                    type="password"
                    placeholder="Enter authentication key..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-700 text-sm focus:outline-none focus:border-amber-500 transition-all font-mono"
                  />
                  {loginError && <p className="text-red-500 text-xs mt-2 font-mono">{loginError}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 text-black font-semibold uppercase tracking-widest text-xs hover:bg-amber-400 transition-all cursor-pointer"
                >
                  Authenticate
                </button>
              </form>
            </div>
          ) : (
            /* Dashboard Control Panel */
            <div className="space-y-8 animate-fade-in">
              
              {/* Stats Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#111] border border-gray-900 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider font-mono text-gray-500">Current Online Visitors</p>
                    <h3 className="text-3xl font-mono font-bold text-amber-500 mt-1">{stats.onlineVisitors}</h3>
                  </div>
                  <div className="p-3.5 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 relative flex items-center justify-center">
                    <Activity className="w-6 h-6 animate-pulse" />
                  </div>
                </div>
                <div className="bg-[#111] border border-gray-900 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider font-mono text-gray-500">Total Visitors</p>
                    <h3 className="text-3xl font-mono font-bold text-white mt-1">{stats.totalVisitors}</h3>
                  </div>
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <form onSubmit={handleSave} className="space-y-6 bg-[#111] border border-gray-900 rounded-xl p-6 sm:p-8 relative">
                <h3 className="text-md font-mono uppercase tracking-widest text-amber-500 border-b border-gray-900 pb-3 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  Portfolio Customizer
                </h3>

                {/* Grid Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-mono text-gray-400 mb-1">First Name (White)</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-mono text-gray-400 mb-1">Last Name (Amber)</label>
                    <input
                      type="text"
                      value={formData.nameHighlight}
                      onChange={(e) => setFormData({ ...formData, nameHighlight: e.target.value })}
                      className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-mono text-gray-400 mb-1">Header Role Tag</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-mono text-gray-400 mb-1">Designation & Company</label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-mono text-gray-400 mb-1">University Name</label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-mono text-gray-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-mono text-gray-400 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-mono text-gray-400 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Textarea */}
                <div>
                  <label className="block text-xs uppercase tracking-widest font-mono text-gray-400 mb-1">Biography Description</label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors leading-relaxed resize-none font-sans"
                    required
                  />
                </div>

                {/* Social Links */}
                <div className="space-y-4 pt-4 border-t border-gray-900">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-amber-500">Social Media & Websites</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">GitHub Link</label>
                      <input
                        type="url"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">LinkedIn Link</label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">Facebook Link</label>
                      <input
                        type="url"
                        value={formData.facebook}
                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                        className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">Instagram Link</label>
                      <input
                        type="url"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase tracking-widest font-mono text-gray-500 mb-1">Website Link (View Portfolio)</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full bg-[#080808] border border-gray-800 rounded-lg px-4 py-2 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Feedback */}
                {saveStatus.success && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-mono rounded-lg">
                    SYSTEM UPDATE SUCCESSFUL: Changes pushed live.
                  </div>
                )}
                {saveStatus.error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono rounded-lg">
                    SYSTEM ERROR: {saveStatus.error}
                  </div>
                )}

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={saveStatus.loading}
                  className="w-full py-4 bg-amber-500 text-black font-bold uppercase tracking-widest text-xs hover:bg-amber-400 transition-all disabled:opacity-55 cursor-pointer"
                >
                  {saveStatus.loading ? 'Updating Systems...' : 'Commit Changes'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans overflow-x-hidden flex flex-col relative selection:bg-amber-500/30 selection:text-amber-100 animate-fade-in">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <main className="flex-1 flex flex-col lg:flex-row px-8 md:px-12 py-12 lg:py-0 items-center justify-center gap-12 lg:gap-24 relative z-10 w-full max-w-7xl mx-auto min-h-screen">

        {/* Left Column: Biography & Info */}
        <div className="flex-1 flex flex-col justify-center w-full max-w-2xl text-center lg:text-left mt-8 lg:mt-0">
          <div className="mb-4">
            <span className="text-amber-500 text-sm font-mono tracking-tighter uppercase">
              [ {portfolioData.role} ]
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-6 italic uppercase">
            {portfolioData.name} <span className="text-amber-500">{portfolioData.nameHighlight}</span>
          </h1>

          {/* Mobile Profile Image */}
          <div className="lg:hidden w-full max-w-[280px] sm:max-w-[320px] mx-auto mb-8 relative">
            <div className="w-full aspect-[3/4] bg-gradient-to-tr from-[#111] to-[#222] border border-gray-800 rounded-2xl relative overflow-hidden group shadow-2xl">
              <img
                src="https://github.com/jahidhasanemon2211.png"
                alt={`${portfolioData.name} ${portfolioData.nameHighlight} Profile`}
                className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700"
              />
              {/* Decorative corner marks */}
              <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-amber-500/40"></div>
              <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-amber-500/40"></div>
            </div>

            {/* Briefcase Badge */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-amber-500 text-black p-3 sm:p-4 rounded-xl border border-[#111] shadow-xl transform rotate-3 hover:rotate-0 transition-transform">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
            <div className="hidden lg:block h-[1px] w-12 bg-amber-500/50"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 font-light tracking-wide uppercase italic">
              {portfolioData.designation}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-8 text-gray-500 font-mono text-[10px] sm:text-xs uppercase tracking-widest">
            {portfolioData.university && (
              <div className="flex items-center gap-2 border border-gray-800 px-3 py-1 rounded">
                <GraduationCap className="w-4 h-4 text-amber-500" />
                <span>{portfolioData.university}</span>
              </div>
            )}
            {portfolioData.location && (
              <div className="flex items-center gap-2 border border-gray-800 px-3 py-1 rounded">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>{portfolioData.location}</span>
              </div>
            )}
          </div>

          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed mb-10 lg:pr-10 mx-auto lg:mx-0 max-w-lg">
            {portfolioData.bio}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-10">
            {portfolioData.phone && (
              <a href={`tel:${portfolioData.phone}`} className="w-full sm:w-auto px-5 py-3.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 font-semibold text-xs sm:text-sm tracking-widest uppercase hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-colors flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                Call
              </a>
            )}
            {portfolioData.email && (
              <a href={`mailto:${portfolioData.email}`} className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 text-black font-semibold text-xs sm:text-sm tracking-widest uppercase hover:bg-amber-400 transition-colors flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Get in touch
              </a>
            )}
            {portfolioData.website && (
              <a href={portfolioData.website} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-6 py-3.5 bg-transparent text-gray-300 border border-gray-800 font-medium text-xs sm:text-sm tracking-widest uppercase hover:text-amber-500 hover:border-amber-500 transition-colors flex items-center justify-center gap-2 group">
                View Portfolio
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-8 border-t border-gray-900 mx-auto lg:mx-0 w-full max-w-lg">
            {portfolioData.github && <SocialLink href={portfolioData.github} icon={<Github className="w-4 h-4 sm:w-5 sm:h-5" />} label="GitHub" />}
            {portfolioData.linkedin && <SocialLink href={portfolioData.linkedin} icon={<Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />} label="LinkedIn" />}
            {portfolioData.facebook && <SocialLink href={portfolioData.facebook} icon={<Facebook className="w-4 h-4 sm:w-5 sm:h-5" />} label="Facebook" />}
            {portfolioData.instagram && <SocialLink href={portfolioData.instagram} icon={<Instagram className="w-4 h-4 sm:w-5 sm:h-5" />} label="Instagram" />}
            {portfolioData.website && <SocialLink href={portfolioData.website} icon={<ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />} label="Website" />}
          </div>
        </div>

        {/* Right Column: Visual Identity (Desktop) */}
        <div className="hidden lg:flex w-full max-w-[280px] sm:max-w-[360px] flex-col items-center lg:items-end pb-12 lg:pb-0">
          <div className="relative w-full">
            <div className="w-full aspect-[3/4] bg-gradient-to-tr from-[#111] to-[#222] border border-gray-800 rounded-2xl relative overflow-hidden group shadow-2xl">
              <img
                src="https://github.com/jahidhasanemon2211.png"
                alt={`${portfolioData.name} ${portfolioData.nameHighlight} Profile`}
                className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700"
              />
              {/* Decorative corner marks */}
              <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-amber-500/40"></div>
              <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-amber-500/40"></div>
            </div>

            {/* Vertical Text Decorative Element */}
            <div className="hidden lg:block absolute -right-8 top-1/2 -translate-y-1/2 rotate-180" style={{ writingMode: 'vertical-rl' }}>
              <span className="text-[10px] text-gray-700 uppercase tracking-[1em]">NETWORKING. SECURITY. ROUTING. SWITCHING.</span>
            </div>

            {/* Briefcase Badge */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 lg:-right-12 bg-amber-500 text-black p-3 sm:p-4 rounded-xl border border-[#111] shadow-xl transform rotate-3 hover:rotate-0 transition-transform">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Bar Detail */}
      <footer className="py-6 sm:py-0 h-auto sm:h-12 border-t border-gray-900 flex flex-col sm:flex-row items-center px-6 lg:px-12 justify-between gap-4 sm:gap-0 relative z-10 bg-[#080808]/80 backdrop-blur-sm shrink-0">
        <span className="text-[9px] sm:text-[10px] text-gray-600 tracking-widest text-center sm:text-left">
          Handcrafted with ❤️ by {portfolioData.name} {portfolioData.nameHighlight} &copy; {new Date().getFullYear()}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
          <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest">Status: Online & Monitoring</span>
        </div>
      </footer>
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#111] text-gray-400 border border-gray-800 hover:text-amber-500 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      aria-label={label}
      title={label}
    >
      {icon}
    </a>
  );
}
