import React, { useState } from 'react';
import axios from 'axios';
import { FaFolderOpen, FaCheckSquare, FaSquare, FaMicrochip, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const ScanProjectPage = () => {
    const [files, setFiles] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState(null);

    const [exclusions, setExclusions] = useState({
        node_modules: true,
        git: true,
        venv: true,
        dist: true
    });

    const toggleExclusion = (key) => {
        setExclusions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleFolderSelect = (event) => {
        const fileList = Array.from(event.target.files);

        // Filter files based on exclusions
        const blockedTerms = [];
        if (exclusions.node_modules) blockedTerms.push('node_modules');
        if (exclusions.git) blockedTerms.push('.git');
        if (exclusions.venv) blockedTerms.push('.venv', 'venv', 'env');
        if (exclusions.dist) blockedTerms.push('dist', 'build');

        const filtered = fileList.filter(file => {
            const path = file.webkitRelativePath;
            return !blockedTerms.some(term => path.includes(`/${term}/`) || path.includes(`${term}/`));
        });

        setFiles(filtered);
        setResults(null);
    };

    const startScan = async () => {
        if (files.length === 0) return;
        setScanning(true);
        setProgress(0);
        setResults([]);

        const batchSize = 10; // Batch files to avoid payload limits
        const totalBatches = Math.ceil(files.length / batchSize);
        let allResults = [];

        // We mostly want to check for SECRETS (Content) and THREATS (Hash)
        // For V1, we'll implement a "Light Scan" where we send content for small files to check secrets,
        // and hashes for all files to check VT.

        // Actually, due to browser limitations, we can't easily "stream" the folder. 
        // We will send batches of files to the backend.

        try {
            for (let i = 0; i < files.length; i += batchSize) {
                const batch = files.slice(i, i + batchSize);
                const formData = new FormData();

                batch.forEach(file => {
                    formData.append('files', file);
                    formData.append('paths', file.webkitRelativePath);
                });

                const res = await axios.post('http://localhost:5000/api/scan/project-batch', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                allResults = [...allResults, ...res.data.results];
                setProgress(Math.round(((i + batchSize) / files.length) * 100));
            }
            setResults(allResults);
        } catch (error) {
            console.error("Scan failed", error);
            alert("Scan interrupted due to server error.");
        } finally {
            setScanning(false);
            setProgress(100);
        }
    };

    return (
        <div className="space-y-8 animate-matrix-fade text-white">
            <header>
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <FaMicrochip className="text-neon-green" /> PROJECT VULNERABILITY SCANNER
                </h2>
                <p className="text-gray-500">DEEP SCAN LOCAL REPOSITORIES FOR SECRETS & MALWARE</p>
            </header>

            {/* Control Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Upload Zone */}
                <div className="md:col-span-2 glass-panel p-8 rounded-xl flex flex-col items-center justify-center border-dashed border-2 border-gray-700 hover:border-neon-green transition-colors relative overflow-hidden">
                    <input
                        type="file"
                        webkitdirectory=""
                        directory=""
                        onChange={handleFolderSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <FaFolderOpen className="text-6xl text-gray-500 mb-4" />
                    <h3 className="text-xl font-bold">{files.length > 0 ? `${files.length} FILES SELECTED` : "SELECT PROJECT FOLDER"}</h3>
                    <p className="text-sm text-gray-400 mt-2">SUPPORTS: .JS, .PY, .ENV, .JSON, ETC.</p>
                </div>

                {/* Exclusions */}
                <div className="glass-panel p-6 rounded-xl">
                    <h3 className="font-bold text-neon-green mb-4 border-b border-gray-700 pb-2">EXCLUSION ZONES</h3>
                    <div className="space-y-3">
                        {Object.entries(exclusions).map(([key, enabled]) => (
                            <div
                                key={key}
                                onClick={() => toggleExclusion(key)}
                                className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded"
                            >
                                {enabled ? <FaCheckSquare className="text-neon-green" /> : <FaSquare className="text-gray-600" />}
                                <span className="font-mono uppercase">{key}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions */}
            {files.length > 0 && !scanning && (
                <button
                    onClick={startScan}
                    className="w-full py-4 bg-neon-green text-black font-bold text-xl rounded hover:bg-white shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all"
                >
                    INITIATE DEEP SCAN
                </button>
            )}

            {/* Progress */}
            {scanning && (
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-neon-green">
                        <span>SCANNING SECTORS...</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-neon-green shadow-[0_0_10px_#39ff14] transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Results */}
            {results && (
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        SCAN REPORT
                        <span className="text-sm bg-gray-800 px-2 py-1 rounded text-gray-300 font-normal">
                            {results.length} ISSUES FOUND
                        </span>
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                        {results.length === 0 ? (
                            <div className="p-8 text-center text-neon-green border border-neon-green/30 rounded bg-green-900/10">
                                NO THREATS OR SECRETS DETECTED. SYSTEM CLEAN.
                            </div>
                        ) : (
                            results.map((item, idx) => (
                                <div key={idx} className="glass-panel p-4 rounded border-l-4 border-red-500 flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 text-red-400 font-bold mb-1">
                                            <FaExclamationTriangle />
                                            {item.type.toUpperCase()}
                                        </div>
                                        <div className="text-sm text-gray-300 font-mono break-all">{item.path}</div>
                                        <div className="text-xs text-gray-500 mt-2">{item.details}</div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded">HIGH RISK</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default ScanProjectPage;
