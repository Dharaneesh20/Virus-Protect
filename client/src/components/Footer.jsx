import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full py-6 text-center z-10 mt-auto">
            <p className="text-gray-500 text-sm font-mono">
                DEVELOPED BY <a href="https://github.com/Dharaneesh20" target="_blank" rel="noreferrer" className="text-neon-green hover:text-white underline decoration-dashed underline-offset-4">Dharaneesh20</a>
            </p>
            <p className="text-[10px] text-gray-700 mt-2">
                POWERED BY VIRUSTOTAL API v3
            </p>
        </footer>
    );
};

export default Footer;
