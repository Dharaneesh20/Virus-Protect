import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaFileCsv, FaFileCode, FaDownload, FaTrash, FaPlus, FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import axios from 'axios';

const ReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/reports');
            setReports(response.data.reports);
        } catch (error) {
            console.error('Failed to load reports:', error);
        }
    };

    const generateReport = async (type, format) => {
        setGenerating(true);
        try {
            const response = await axios.post('http://localhost:5000/api/reports/generate', {
                type,
                format
            });
            alert('Report generated successfully!');
            loadReports(); // Refresh the list
        } catch (error) {
            alert('Failed to generate report: ' + error.response?.data?.error);
        } finally {
            setGenerating(false);
        }
    };

    const downloadReport = (filename) => {
        window.open(`http://localhost:5000/api/reports/download/${filename}`, '_blank');
    };

    const deleteReport = async (filename) => {
        if (!confirm(`Delete report "${filename}"?`)) return;
        
        try {
            await axios.delete(`http://localhost:5000/api/reports/${filename}`);
            loadReports(); // Refresh the list
        } catch (error) {
            alert('Failed to delete report: ' + error.response?.data?.error);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const getFormatIcon = (format) => {
        switch (format) {
            case 'pdf': return <FaFilePdf className="text-red-500" />;
            case 'csv': return <FaFileCsv className="text-green-500" />;
            default: return <FaFileCode className="text-blue-500" />;
        }
    };

    return (
        <div className="space-y-8 text-white pb-20">
            <header>
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <FaChartBar className="text-neon-green" /> AUTOMATED REPORTS
                </h2>
                <p className="text-gray-500">GENERATE AND MANAGE SECURITY REPORTS</p>
            </header>

            {/* Generate Report Section */}
            <div className="glass-panel p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-bold text-neon-green mb-4 flex items-center gap-2">
                    <FaPlus /> GENERATE NEW REPORT
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => generateReport('daily', 'json')}
                        disabled={generating}
                        className="glass-panel p-4 rounded-lg border border-gray-700 hover:border-neon-green transition-colors disabled:opacity-50"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <FaCalendarAlt className="text-neon-green" />
                            <span className="font-bold">DAILY REPORT</span>
                        </div>
                        <p className="text-sm text-gray-400">Today's security activity</p>
                    </button>
                    
                    <button
                        onClick={() => generateReport('weekly', 'json')}
                        disabled={generating}
                        className="glass-panel p-4 rounded-lg border border-gray-700 hover:border-neon-green transition-colors disabled:opacity-50"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <FaCalendarAlt className="text-blue-400" />
                            <span className="font-bold">WEEKLY REPORT</span>
                        </div>
                        <p className="text-sm text-gray-400">This week's security summary</p>
                    </button>
                    
                    <button
                        onClick={() => generateReport('monthly', 'json')}
                        disabled={generating}
                        className="glass-panel p-4 rounded-lg border border-gray-700 hover:border-neon-green transition-colors disabled:opacity-50"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <FaCalendarAlt className="text-purple-400" />
                            <span className="font-bold">MONTHLY REPORT</span>
                        </div>
                        <p className="text-sm text-gray-400">This month's security overview</p>
                    </button>
                </div>
                
                {generating && (
                    <div className="mt-4 text-center text-neon-green">
                        <div className="animate-spin inline-block mr-2">⟳</div>
                        Generating report...
                    </div>
                )}
            </div>

            {/* Reports List */}
            <div className="glass-panel p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-bold text-neon-green mb-4 flex items-center gap-2">
                    <FaFileCode /> GENERATED REPORTS
                </h3>
                
                {reports.length === 0 ? (
                    <div className="text-center py-12">
                        <FaFileCode className="text-6xl text-gray-600 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-gray-400">NO REPORTS GENERATED</h4>
                        <p className="text-gray-500 mt-2">Generate your first security report above</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reports.map((report, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-gray-700">
                                <div className="flex items-center gap-4">
                                    {getFormatIcon(report.format)}
                                    <div>
                                        <h4 className="font-bold text-white">{report.filename}</h4>
                                        <div className="text-sm text-gray-400">
                                            {formatDate(report.created)} • {formatFileSize(report.size)}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => downloadReport(report.filename)}
                                        className="p-2 text-neon-green hover:bg-neon-green hover:text-black rounded transition-colors"
                                        title="Download"
                                    >
                                        <FaDownload />
                                    </button>
                                    <button
                                        onClick={() => deleteReport(report.filename)}
                                        className="p-2 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Automated Reports Info */}
            <div className="glass-panel p-6 rounded-xl border border-blue-500/30 bg-blue-900/10">
                <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <FaCalendarAlt /> AUTOMATED REPORTING
                </h3>
                <div className="space-y-2 text-sm text-gray-300">
                    <p>• <strong>Daily Reports:</strong> Generated automatically at 6:00 AM every day</p>
                    <p>• <strong>Weekly Reports:</strong> Generated every Monday at 6:00 AM</p>
                    <p>• <strong>Monthly Reports:</strong> Generated on the 1st of every month at 6:00 AM</p>
                    <p>• All automated reports are saved in JSON format for easy processing</p>
                    <p>• Reports include scan statistics, threat breakdowns, and quarantine summaries</p>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;