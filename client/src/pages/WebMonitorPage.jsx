import React, { useState } from 'react';
import axios from 'axios';
import { FaGlobe, FaSearch, FaExclamationCircle, FaCheckCircle, FaServer, FaRobot, FaTimes, FaSpinner } from 'react-icons/fa';
import AIConfigModal from '../components/AIConfigModal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const WebMonitorPage = () => {
    const [url, setUrl] = useState('http://localhost:');
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);

    // AI State
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [aiExplanation, setAiExplanation] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    const handleScan = async (e) => {
        e.preventDefault();
        setLoading(true);
        setReport(null);
        setAiExplanation(null);

        try {
            const res = await axios.post('http://localhost:5000/api/monitor/url', { url });
            setReport(res.data);
        } catch (error) {
            alert("Failed to reach URL. Ensure local server is running.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleExplainWithAI = async () => {
        const storedConfig = localStorage.getItem('virusprotect_ai_config');
        if (!storedConfig) {
            setIsAIModalOpen(true);
            return;
        }

        const config = JSON.parse(storedConfig);
        if (!config.apiKey && config.provider !== 'ollama') {
            setIsAIModalOpen(true);
            return;
        }

        setAnalyzing(true);
        setAiExplanation(null);

        try {
            const issues = report.securityIssues.join(', ');
            const prompt = `I analyzed the URL ${url} and found the following security issues: ${issues}. Status Code: ${report.status}. Explain the risks and how to fix these headers in Nginx or Express.js.`;

            const response = await axios.post('http://localhost:5000/api/explain', {
                provider: config.provider,
                model: config.model,
                apiKey: config.apiKey,
                prompt: prompt,
                context: {
                    url: url,
                    status: report.status,
                    issues: report.securityIssues
                }
            });

            setAiExplanation(response.data.result);

        } catch (error) {
            console.error("AI Explanation Failed", error);
            setAiExplanation("Failed to get explanation. Please check your API key.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 ">
            <AIConfigModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                onConfigSave={() => { }}
            />

            <header>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <FaGlobe className="text-neon-green" /> WEB APP MONITOR
                </h2>
                <p className="text-gray-500">ANALYZE HTTP HEADERS & REPUTATION OF LOCAL SERVICES</p>
            </header>

            {/* Input */}
            <form onSubmit={handleScan} className="glass-panel p-8 rounded-xl flex gap-4">
                <div className="flex-1 relative">
                    <FaServer className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded p-4 pl-12 text-white focus:border-neon-green outline-none font-mono"
                        placeholder="http://localhost:3000"
                    />
                </div>
                <button
                    disabled={loading}
                    className="px-8 bg-neon-green text-black font-bold rounded hover:bg-white transition-colors"
                >
                    {loading ? "SCANNING..." : "ANALYZE"}
                </button>
            </form>

            {/* Report */}
            {report && (
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="flex gap-6">
                        <div className={`flex-1 glass-panel p-6 rounded-xl flex items-center justify-between border-l-4 ${report.status === 200 ? 'border-neon-green' : 'border-red-500'}`}>
                            <div>
                                <div className="text-gray-400 text-xs tracking-widest">STATUS CODE</div>
                                <div className="text-3xl font-bold text-white">{report.status}</div>
                            </div>
                            {report.status === 200 ? <FaCheckCircle className="text-neon-green text-4xl" /> : <FaExclamationCircle className="text-red-500 text-4xl" />}
                        </div>

                        <div className="flex-1 glass-panel p-6 rounded-xl border-l-4 border-yellow-500">
                            <div className="text-gray-400 text-xs tracking-widest">SECURITY ISSUES</div>
                            <div className="text-3xl font-bold text-white">{report.securityIssues.length}</div>
                        </div>
                    </div>

                    {/* Security Issues List */}
                    <div className="glass-panel p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white">HEADER SECURITY ANALYSIS</h3>
                            {report.securityIssues.length > 0 && (
                                <button
                                    onClick={handleExplainWithAI}
                                    className="text-xs bg-neon-green/10 text-neon-green border border-neon-green/50 px-3 py-1 rounded hover:bg-neon-green hover:text-black transition-colors flex items-center gap-2"
                                >
                                    {analyzing ? <FaSpinner className="animate-spin" /> : <FaRobot />}
                                    RECOMMEND FIXES
                                </button>
                            )}
                        </div>

                        {report.securityIssues.length === 0 ? (
                            <div className="text-neon-green flex items-center gap-2">
                                <FaCheckCircle /> All Core Security Headers Present
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {report.securityIssues.map((issue, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-red-400 bg-red-900/10 p-2 rounded">
                                        <FaExclamationCircle /> {issue}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* AI Report Block */}
                    {aiExplanation && (
                        <div className="glass-panel border border-neon-green/30 p-6 rounded-xl animate-float relative">
                            <button
                                onClick={() => setAiExplanation(null)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white"
                            >
                                <FaTimes />
                            </button>
                            <h3 className="text-xl font-bold text-neon-green mb-4 flex items-center gap-2">
                                <FaRobot /> SECURITY HARDENING PLAN
                            </h3>
                            <div className="prose prose-invert prose-green max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {aiExplanation}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}

                    <div className="text-xs text-gray-500 text-center uppercase tracking-widest">
                        VirusTotal Reputation Check Dispatched
                    </div>
                </div>
            )}
        </div>
    );
};

export default WebMonitorPage;
