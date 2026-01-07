import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaShieldAlt, FaFolderOpen, FaGlobe, FaHome, FaBug } from 'react-icons/fa';

const Sidebar = () => {
    const navItems = [
        { to: '/', icon: FaHome, label: 'DASHBOARD' },
        { to: '/scan-file', icon: FaShieldAlt, label: 'FILE SCAN' },
        { to: '/scan-project', icon: FaFolderOpen, label: 'PROJECT SCAN' },
        { to: '/monitor-web', icon: FaGlobe, label: 'WEB MONITOR' },
    ];

    return (
        <aside className="w-64 h-screen bg-black/90 border-r border-gray-800 flex flex-col fixed left-0 top-0 z-50 backdrop-blur-md">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-bold text-neon-green tracking-tighter text-glow truncate">
                    VIRUS<span className="text-white">PROTECT</span>
                </h1>
                <p className="text-[10px] text-gray-500 tracking-widest mt-1">V2.0 SECURITY SUITE</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 font-mono text-sm tracking-wider
              ${isActive
                                ? 'bg-neon-green/10 text-neon-green border border-neon-green/20 shadow-[0_0_10px_rgba(57,255,20,0.1)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}
                    >
                        <item.icon className="text-lg" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-gray-800">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
                    SYSTEM ONLINE
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
