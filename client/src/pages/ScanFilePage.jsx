import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ScanResult from '../components/ScanResult';
import AIConfigModal from '../components/AIConfigModal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import { FaRobot, FaTimes, FaSpinner } from 'react-icons/fa';

const ScanFilePage = () => {
    const [scanResult, setScanResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // AI State
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [aiExplanation, setAiExplanation] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

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
            // Construct context from VT result
            const attributes = scanResult.data.attributes;
            const stats = attributes.stats || attributes.last_analysis_stats;
            const context = {
                md5: attributes.md5,
                stats: stats,
                name: attributes.meaningful_name || "Unknown File",
                tags: attributes.tags || []
            };

            const prompt = `This file was flagged as malicious by ${stats.malicious} engines. Explain the potential threat based on the metadata.`;

            const response = await axios.post('http://localhost:5000/api/explain', {
                provider: config.provider,
                model: config.model,
                apiKey: config.apiKey,
                prompt: prompt,
                context: context
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
        <div className="w-full max-w-4xl mx-auto space-y-8 ">
            <AIConfigModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                onConfigSave={() => { }}
            />

            <header className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">FILE INTEGRITY SCANNER</h2>
                <p className="text-gray-500">UPLOAD INDIVIDUAL FILES FOR MALWARE ANALYSIS</p>
            </header>

            <div className="glass-panel rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center transition-all duration-500">
                {!scanResult ? (
                    <FileUpload setScanResult={setScanResult} setLoading={setLoading} loading={loading} />
                ) : (
                    <div className="w-full">
                        <ScanResult
                            result={scanResult}
                            onReset={() => { setScanResult(null); setAiExplanation(null); }}
                            onAnalyze={handleExplainWithAI}
                        />

                        {analyzing && (
                            <div className="mt-6 text-center text-neon-green flex flex-col items-center">
                                <FaSpinner className="animate-spin text-2xl mb-2" />
                                <span>NEURAL NETWORK ANALYSIS IN PROGRESS...</span>
                            </div>
                        )}

                        {aiExplanation && (
                            <div className="mt-8 p-6 glass-panel border border-neon-green/30 rounded-lg animate-float relative text-left">
                                <button
                                    onClick={() => setAiExplanation(null)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                                >
                                    <FaTimes />
                                </button>
                                <h3 className="text-xl font-bold text-neon-green mb-4 flex items-center gap-2">
                                    <FaRobot /> THREAT INTELLIGENCE REPORT
                                </h3>
                                <div className="prose prose-invert prose-green max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {aiExplanation}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScanFilePage;
