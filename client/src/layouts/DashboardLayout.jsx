import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 font-mono selection:bg-neon-green selection:text-black overflow-hidden relative">

            {/* Dynamic Background */}
            <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                {/* Layer 1: Deep Green Ambient Glow */}
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-green-900/20 rounded-full blur-[100px] animate-float"></div>

                {/* Layer 2: Neon Accent Moving Blob */}
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-neon-green/10 rounded-full blur-[120px] animate-float-delayed"></div>

                {/* Layer 3: The "Abstract Curves" Simulation */}
                {/* Large rotating gradient to create fluid motion */}
                <div className="absolute top-[20%] left-[20%] w-[50vw] h-[50vw] bg-gradient-to-r from-green-900/10 to-transparent rounded-full blur-[80px] animate-drift opacity-60"></div>
                <div className="absolute bottom-[20%] right-[30%] w-[40vw] h-[40vw] bg-gradient-to-b from-teal-900/20 to-transparent rounded-full blur-[90px] animate-drift-slow opacity-50"></div>

                {/* Noise texture overlay for texture */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            <Sidebar />

            <main className="ml-64 p-8 min-h-screen relative z-10 flex flex-col">
                <div className="flex-1">
                    <Outlet />
                </div>
                <Footer />
            </main>
        </div>
    );
};

export default DashboardLayout;
