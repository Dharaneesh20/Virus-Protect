import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaShieldAlt, FaTrash, FaUndo, FaSearch, FaExclamationTriangle, FaFileCode } from 'react-icons/fa';

const QuarantinePage = () => {
    const [quarantine, setQuarantine] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuarantine();
    }, []);

    const fetchQuarantine = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/quarantine');
            setQuarantine(res.data);
        } catch (error) {
            console.error("Failed to fetch quarantine", error);
        } finally {
            setLoading(false);
        }
    };

    const deletePermanently = async (id) => {
        if (!window.confirm("Are you sure? This action cannot be undone.")) return;

        try {
            await axios.delete('http://localhost:5000/api/file', { data: { id, type: 'quarantine' } });
            setQuarantine(prev => prev.filter(q => q.id !== id));
        } catch (error) {
            console.error("Failed to delete file", error);
            alert("Failed to delete file");
        }
    };

    return (
        <div className="space-y-8 ">
            <header>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <FaShieldAlt className="text-red-500" /> QUARANTINE ZONE
                </h2>
                <p className="text-gray-500">ISOLATED THREATS & MALICIOUS CODE FRAGMENTS</p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="text-center text-gray-500 p-8 glass-panel rounded-xl">Loading containment units...</div>
                ) : quarantine.length === 0 ? (
                    <div className="text-center p-12 glass-panel rounded-xl border border-neon-green/20 flex flex-col items-center">
                        <FaShieldAlt className="text-6xl text-neon-green mb-4 opacity-50" />
                        <h3 className="text-2xl font-bold text-white">CONTAINMENT CLEAR</h3>
                        <p className="text-gray-500 mt-2">No active threats in isolation.</p>
                    </div>
                ) : (
                    quarantine.map((item) => (
                        <div key={item.id} className="glass-panel p-6 rounded-xl border border-red-500/30 flex justify-between items-center hover:bg-red-900/10 transition-colors group">
                            <div className="flex items-start gap-4">
                                <div className="p-4 bg-red-500/10 rounded-lg text-red-500">
                                    <FaExclamationTriangle className="text-2xl" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-bold text-lg text-white font-mono">{item.fileName}</span>
                                        <span className="text-xs bg-red-500 text-black font-bold px-2 py-0.5 rounded uppercase">Malicious</span>
                                    </div>
                                    <p className="text-sm text-gray-400 font-mono mb-2">Original Path: {item.originalPath}</p>
                                    <p className="text-xs text-gray-500">Isolated: {new Date(item.timestamp).toLocaleString()}</p>
                                    <div className="mt-3 text-xs text-red-400 border-l-2 border-red-500/20 pl-2">
                                        Reason: {item.reason}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => deletePermanently(item.id)}
                                    className="px-4 py-2 border border-red-500/50 text-red-500 rounded hover:bg-red-500 hover:text-black transition-all flex items-center gap-2 font-bold text-sm"
                                >
                                    <FaTrash /> DELETE PERMANENTLY
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default QuarantinePage;
