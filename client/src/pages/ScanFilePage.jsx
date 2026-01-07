import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ScanResult from '../components/ScanResult';

const ScanFilePage = () => {
    const [scanResult, setScanResult] = useState(null);
    const [loading, setLoading] = useState(false);

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-matrix-fade">
            <header className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">FILE INTEGRITY SCANNER</h2>
                <p className="text-gray-500">UPLOAD INDIVIDUAL FILES FOR MALWARE ANALYSIS</p>
            </header>

            <div className="glass-panel rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center transition-all duration-500">
                {!scanResult ? (
                    <FileUpload setScanResult={setScanResult} setLoading={setLoading} loading={loading} />
                ) : (
                    <ScanResult result={scanResult} onReset={() => setScanResult(null)} />
                )}
            </div>
        </div>
    );
};

export default ScanFilePage;
