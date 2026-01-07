import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaShieldAlt, FaFolderOpen, FaGlobe, FaHistory, FaSkull } from 'react-icons/fa';

const Sidebar = () => {
    const navItems = [
        { to: '/', icon: FaHome, label: 'DASHBOARD' },
        { to: '/scan-file', icon: FaShieldAlt, label: 'FILE SCAN' },
        { to: '/scan-project', icon: FaFolderOpen, label: 'PROJECT SCAN' },
        { to: '/monitor-web', icon: FaGlobe, label: 'WEB MONITOR' },
        { to: '/history', icon: FaHistory, label: 'HISTORY' },
        { to: '/quarantine', icon: FaSkull, label: 'QUARANTINE' },
    ];

    return (
        <div className="w-64 bg-[#0a0a0a]/90 h-screen fixed left-0 top-0 border-r border-gray-800 flex flex-col backdrop-blur-md z-50">
            <div className="p-8 border-b border-gray-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-green to-emerald-500 bg-clip-text text-transparent tracking-tighter">
                    VIRUSPROTECT
                </h1>
                <p className="text-[10px] text-gray-500 tracking-[0.5em] mt-1">SENTINEL SYSTEM</p>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group ${isActive
                                ? 'bg-neon-green/10 text-neon-green border border-neon-green/30 shadow-[0_0_15px_rgba(57,255,20,0.1)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <item.icon className="text-xl group-hover:scale-110 transition-transform" />
                        <span className="font-mono text-sm tracking-wide font-bold">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <div className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
                        <span className="text-xs text-uppercase text-gray-400 font-bold tracking-wider">SYSTEM ONLINE</span>
                    </div>
                    <div className="text-[10px] text-gray-600 font-mono">
                        Security Protocols Active<br />
                        Monitoring Localhost:5000
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
