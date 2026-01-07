import React, { useState } from 'react';
import { FaFolderOpen, FaCheckSquare, FaSquare, FaMicrochip, FaSpinner, FaExclamationTriangle, FaCode, FaSearch } from 'react-icons/fa';

const SECRET_PATTERNS = [
    { name: 'Google API Key', regex: /AIza[0-9A-Za-z-_]{35}/ },
    { name: 'Firebase API Key', regex: /AIza[0-9A-Za-z-_]{35}/ },
    { name: 'AWS Access Key ID', regex: /AKIA[0-9A-Z]{16}/ },
    { name: 'AWS Secret Access Key', regex: /(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/ },
    { name: 'GitHub Personal Access Token', regex: /ghp_[0-9a-zA-Z]{36}/ },
    { name: 'Slack Bot Token', regex: /xoxb-[0-9]{11}-[0-9]{11}-[0-9a-zA-Z]{24}/ },
    { name: 'Stripe Secret Key', regex: /sk_live_[0-9a-zA-Z]{24}/ },
    { name: 'OpenAI API Key', regex: /sk-[a-zA-Z0-9]{48}/ },
    { name: 'Generic Private Key', regex: /-----BEGIN PRIVATE KEY-----/ },
    { name: 'MongoDB Connection String', regex: /mongodb(\+srv)?:\/\/[^\s]+/ },
    { name: 'SQL Connection String', regex: /(postgres|mysql|mssql):\/\/[^\s]+/ },
    { name: 'Azure Storage Key', regex: /[a-zA-Z0-9+/=]{88}/ } // Basic heuristic for Azure keys
];

const ScanProjectPage = () => {
    const [files, setFiles] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState(null);
    const [scanStats, setScanStats] = useState({ filesScanned: 0, secretsFound: 0 });

    const [exclusions, setExclusions] = useState({
        node_modules: true,
        git: true,
        venv: true,
        dist: true,
        images: true
    });

    const toggleExclusion = (key) => {
        setExclusions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleFolderSelect = (event) => {
        const fileList = Array.from(event.target.files);
        setFiles(fileList);
        setResults(null);
        setScanStats({ filesScanned: 0, secretsFound: 0 });
    };

    const isExcluded = (path) => {
        if (exclusions.node_modules && path.includes('node_modules')) return true;
        if (exclusions.git && path.includes('.git')) return true;
        if (exclusions.venv && (path.includes('.venv') || path.includes('venv') || path.includes('env'))) return true;
        if (exclusions.dist && (path.includes('dist') || path.includes('build'))) return true;
        return false;
    };

    const isTextFile = (file) => {
        const textExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.json', '.env', '.txt', '.md', '.html', '.css', '.xml', '.yml', '.yaml', '.sql', '.java', '.c', '.cpp', '.rb', '.go', '.php'];
        return textExtensions.some(ext => file.name.endsWith(ext)) || file.type.startsWith('text/');
    };

    const readFileContent = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    };

    const scanFile = async (file) => {
        try {
            const content = await readFileContent(file);
            const lines = content.split('\n');
            const fileIssues = [];

            lines.forEach((line, index) => {
                SECRET_PATTERNS.forEach(pattern => {
                    if (pattern.regex.test(line)) {
                        // Avoid false positives (very basic) by checking content length if needed, 
                        // but sticking to regex for now.
                        fileIssues.push({
                            type: pattern.name,
                            line: index + 1,
                            content: line.trim(),
                            rawLine: line
                        });
                    }
                });
            });

            return fileIssues.length > 0 ? { file: file.webkitRelativePath, issues: fileIssues } : null;
        } catch (error) {
            console.error(`Error reading ${file.name}`, error);
            return null;
        }
    };

    const startScan = async () => {
        if (files.length === 0) return;
        setScanning(true);
        setProgress(0);
        setResults([]);

        let foundIssues = [];
        let scannedCount = 0;

        // Filter files based on exclusions
        const filesToScan = files.filter(f => !isExcluded(f.webkitRelativePath));

        if (filesToScan.length === 0) {
            alert("No files to scan after exclusions.");
            setScanning(false);
            return;
        }

        const total = filesToScan.length;

        for (let i = 0; i < total; i++) {
            const file = filesToScan[i];

            // Checking if file is potentially binary to skip large binaries if exclusions.images is on
            if (exclusions.images && file.type.startsWith('image/')) {
                // Skip
            } else if (isTextFile(file)) {
                const result = await scanFile(file);
                if (result) {
                    foundIssues.push(result);
                }
            }

            scannedCount++;
            setProgress(Math.round((scannedCount / total) * 100));

            // Allow UI update
            if (i % 10 === 0) await new Promise(r => setTimeout(r, 0));
        }

        setResults(foundIssues);
        setScanStats({ filesScanned: scannedCount, secretsFound: foundIssues.reduce((acc, curr) => acc + curr.issues.length, 0) });
        setScanning(false);
    };

    return (
        <div className="space-y-8 animate-matrix-fade text-white pb-20">
            <header>
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <FaCode className="text-neon-green" /> SECRECY SCANNER
                </h2>
                <p className="text-gray-500">DEEP SCAN SOURCE CODE FOR HARDCODED SECRETS & API KEYS</p>
            </header>

            {/* Control Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Upload Zone */}
                <div className="md:col-span-2 glass-panel p-8 rounded-xl flex flex-col items-center justify-center border-dashed border-2 border-gray-700 hover:border-neon-green transition-colors relative overflow-hidden min-h-[250px]">
                    <input
                        type="file"
                        webkitdirectory=""
                        directory=""
                        onChange={handleFolderSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="absolute inset-0 bg-neon-green/5 pointer-events-none" />

                    <FaFolderOpen className="text-6xl text-neon-green mb-4 animate-pulse" />
                    <h3 className="text-2xl font-bold font-mono">
                        {files.length > 0 ? `${files.length} FILES LOADED` : "DRAG PROJECT FOLDER"}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 font-mono">
                        {files.length > 0 ? "READY ASSAULT" : "INITIATE DIRECTORY LINK"}
                    </p>
                </div>

                {/* Exclusions */}
                <div className="glass-panel p-6 rounded-xl border border-gray-800">
                    <h3 className="font-bold text-neon-green mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
                        <FaMicrochip /> SCAN PARAMETERS
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(exclusions).map(([key, enabled]) => (
                            <div
                                key={key}
                                onClick={() => toggleExclusion(key)}
                                className={`flex items-center gap-3 cursor-pointer p-2 rounded transition-all ${enabled ? 'bg-neon-green/10 border border-neon-green/30' : 'hover:bg-white/5 border border-transparent'}`}
                            >
                                {enabled ? <FaCheckSquare className="text-neon-green" /> : <FaSquare className="text-gray-600" />}
                                <span className="font-mono uppercase text-sm tracking-widest">{key}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions */}
            {files.length > 0 && !scanning && (
                <button
                    onClick={startScan}
                    className="w-full py-4 bg-neon-green text-black font-bold text-xl rounded hover:bg-[#2ecc71] shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all uppercase tracking-widest flex items-center justify-center gap-2 group"
                >
                    <FaSearch className="group-hover:rotate-90 transition-transform" /> Initiate Secrecy Protocol
                </button>
            )}

            {/* Progress */}
            {scanning && (
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-neon-green">
                        <span className="animate-pulse">SCANNING SECTORS...</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="relative w-full h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
                        <div
                            className="absolute top-0 left-0 h-full bg-neon-green shadow-[0_0_15px_#39ff14] transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                        {/* Matrix rain effect overlay could go here */}
                    </div>
                </div>
            )}

            {/* Results */}
            {results && (
                <div className="space-y-6 animate-slide-up">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            SCAN REPORT
                            <span className={`text-sm px-3 py-1 rounded font-bold ${scanStats.secretsFound > 0 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                                {scanStats.secretsFound} SECRETS FOUND
                            </span>
                        </h3>
                        <div className="text-xs text-gray-500 font-mono">
                            SCANNED: {scanStats.filesScanned} FILES
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {results.length === 0 ? (
                            <div className="p-12 text-center border border-neon-green/30 rounded bg-green-900/10 flex flex-col items-center">
                                <FaCheckSquare className="text-5xl text-neon-green mb-4" />
                                <h4 className="text-xl font-bold text-neon-green">NO LEAKS DETECTED</h4>
                                <p className="text-gray-400 mt-2">Codebase appears clean of known API key patterns.</p>
                            </div>
                        ) : (
                            results.map((fileResult, idx) => (
                                <div key={idx} className="glass-panel overflow-hidden rounded-lg border border-gray-800 hover:border-red-500/50 transition-colors">
                                    <div className="bg-red-900/20 p-3 border-b border-gray-800 flex items-center gap-3">
                                        <FaFolderOpen className="text-red-400" />
                                        <span className="font-mono text-sm text-gray-200">{fileResult.file}</span>
                                        <span className="ml-auto text-xs bg-red-500 text-black font-bold px-2 py-0.5 rounded">
                                            {fileResult.issues.length} ISSUES
                                        </span>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        {fileResult.issues.map((issue, i) => (
                                            <div key={i} className="bg-black/50 p-3 rounded border border-gray-800 text-sm">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-red-400 font-bold text-xs uppercase flex items-center gap-2">
                                                        <FaExclamationTriangle /> {issue.type}
                                                    </span>
                                                    <span className="text-gray-500 text-xs font-mono">Line {issue.line}</span>
                                                </div>
                                                <div className="font-mono bg-[#050505] p-2 rounded border border-gray-800 text-gray-300 overflow-x-auto whitespace-pre">
                                                    <code>
                                                        <span className="text-gray-600 mr-3 select-none">{issue.line}</span>
                                                        {issue.content}
                                                    </code>
                                                </div>
                                            </div>
                                        ))}
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
