import React from 'react';

const ScanResult = ({ result, onReset }) => {
    // Parsing the VT result structure
    const attributes = result.data.attributes;
    const stats = attributes.stats || attributes.last_analysis_stats; // Analysis object vs File object structure diff

    if (!stats) return <div className="text-red-500">Invalid Result Data</div>;

    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const harmless = stats.harmless || 0;
    const undetectable = stats.undetected || 0;

    const total = malicious + suspicious + harmless + undetectable;
    const score = malicious + suspicious;

    const isClean = score === 0;

    return (
        <div className="w-full text-center space-y-6 animate-matrix-fade">

            <div className={`text-5xl font-bold mb-2 ${isClean ? 'text-neon-green' : 'text-red-500'} text-glow`}>
                {isClean ? 'SYSTEM CLEAN' : 'THREAT DETECTED'}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <StatBox label="MALICIOUS" value={malicious} color="text-red-500" />
                <StatBox label="SUSPICIOUS" value={suspicious} color="text-yellow-500" />
                <StatBox label="HARMLESS" value={harmless} color="text-neon-green" />
                <StatBox label="UNDETECTED" value={undetectable} color="text-gray-400" />
            </div>

            <div className="mt-8 p-4 border border-gray-700 bg-black/50 rounded text-left font-mono text-sm h-48 overflow-y-auto">
                <p className="text-gray-400 mb-2">Detailed Analysis Engines:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {attributes.results && Object.entries(attributes.results).slice(0, 10).map(([engine, res]) => (
                        <div key={engine} className="flex justify-between border-b border-gray-800 pb-1">
                            <span>{engine}</span>
                            <span className={res.category === 'malicious' ? 'text-red-500' : 'text-neon-green'}>
                                {res.result || 'Clean'}
                            </span>
                        </div>
                    ))}
                    {/* Fallback if it's a file report (results are usually in last_analysis_results) */}
                    {attributes.last_analysis_results && Object.entries(attributes.last_analysis_results).slice(0, 10).map(([engine, res]) => (
                        <div key={engine} className="flex justify-between border-b border-gray-800 pb-1">
                            <span>{engine}</span>
                            <span className={res.category === 'malicious' ? 'text-red-500' : 'text-neon-green'}>
                                {res.result || 'Clean'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={onReset}
                className="mt-6 px-8 py-3 bg-neon-green text-black font-bold text-lg rounded hover:bg-white transition-all shadow-[0_0_15px_rgba(57,255,20,0.5)]"
            >
                SCAN ANOTHER FILE
            </button>

            <div className="text-xs text-gray-600 mt-4">
                MD5: {attributes.md5 || 'N/A'} <br />
                SHA-256: {attributes.sha256 || 'N/A'}
            </div>

        </div>
    );
};

const StatBox = ({ label, value, color }) => (
    <div className="bg-black/40 border border-gray-800 p-4 rounded flex flex-col items-center">
        <span className={`text-4xl font-bold ${color}`}>{value}</span>
        <span className="text-xs text-gray-500 tracking-wider mt-1">{label}</span>
    </div>
);

export default ScanResult;
