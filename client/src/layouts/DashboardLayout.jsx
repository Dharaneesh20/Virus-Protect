import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-black text-gray-300 font-mono selection:bg-neon-green selection:text-black">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-10 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-green rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-green rounded-full blur-[120px]"></div>
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
