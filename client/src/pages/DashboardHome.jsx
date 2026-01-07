import React from 'react';
import { FaShieldAlt, FaBug, FaSkull, FaCheckCircle } from 'react-icons/fa';

const DashboardHome = () => {
    return (
        <div className="space-y-8 ">
            <header>
                <h2 className="text-3xl font-bold text-white mb-2">SECURITY OVERVIEW</h2>
                <p className="text-gray-500">SYSTEM STATUS: <span className="text-neon-green">OPERATIONAL</span></p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={FaShieldAlt} label="TOTAL SCANS" value="0" color="text-neon-green" />
                <StatCard icon={FaSkull} label="THREATS BLOCKED" value="0" color="text-red-500" />
                <StatCard icon={FaBug} label="VULNERABILITIES" value="0" color="text-yellow-500" />
                <StatCard icon={FaCheckCircle} label="SYSTEM HEALTH" value="100%" color="text-blue-400" />
            </div>

            {/* Recent Activity Placeholder */}
            <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">RECENT ACTIVITY</h3>
                <div className="text-center text-gray-500 py-8 font-mono text-sm">
                    NO RECENT SCANS LOGGED
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="glass-panel p-6 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors">
        <div className={`p-4 rounded-full bg-white/5 ${color}`}>
            <Icon className="text-2xl" />
        </div>
        <div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-gray-400 tracking-wider">{label}</div>
        </div>
    </div>
);

export default DashboardHome;
