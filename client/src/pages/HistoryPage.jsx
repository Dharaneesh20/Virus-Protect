import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHistory, FaSearch, FaFilter, FaTrash, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/history');
            setHistory(res.data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    const clearLog = async (id) => {
        try {
            await axios.delete('http://localhost:5000/api/file', { data: { id, type: 'history_log' } });
            setHistory(prev => prev.filter(h => h.id !== id));
        } catch (error) {
            console.error("Failed to delete log", error);
        }
    };

    const getStatusIcon = (status) => {
        if (status === 'SAFE') return <FaCheckCircle className="text-neon-green" />;
        if (status === 'THREAT' || status === 'WARNING') return <FaExclamationTriangle className="text-yellow-500" />;
        return <FaTimesCircle className="text-red-500" />;
    };

    const filteredHistory = history.filter(item =>
        item.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 ">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <FaHistory className="text-neon-green" /> SCAN LOGS
                    </h2>
                    <p className="text-gray-500">AUDIT TRAIL OF SYSTEM OPERATIONS</p>
                </div>
            </header>

            {/* Filter Bar */}
            <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
                <FaSearch className="text-gray-500 ml-2" />
                <input
                    type="text"
                    placeholder="Search logs..."
                    className="bg-transparent border-none outline-none text-white w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Logs Table */}
            <div className="glass-panel rounded-xl overflow-hidden min-h-[500px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-700 bg-white/5 text-gray-400 font-mono text-xs uppercase tracking-wider">
                            <th className="p-4">Timestamp</th>
                            <th className="p-4">Operation</th>
                            <th className="p-4">Target</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4">Details</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading neural archives...</td></tr>
                        ) : filteredHistory.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">No logs found.</td></tr>
                        ) : (
                            filteredHistory.map((item) => (
                                <tr key={item.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors text-sm">
                                    <td className="p-4 font-mono text-gray-500">
                                        {new Date(item.timestamp).toLocaleString()}
                                    </td>
                                    <td className="p-4 font-bold text-white">{item.type}</td>
                                    <td className="p-4 text-gray-300 font-mono text-xs truncate max-w-[200px]" title={item.target}>
                                        {item.target}
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${item.status === 'SAFE' ? 'bg-neon-green/10 text-neon-green' :
                                                item.status === 'WARNING' || item.status === 'THREAT' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {getStatusIcon(item.status)}
                                            {item.status}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-400 text-xs">{item.details}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => clearLog(item.id)}
                                            className="text-gray-600 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
                                            title="Delete Log"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryPage;
