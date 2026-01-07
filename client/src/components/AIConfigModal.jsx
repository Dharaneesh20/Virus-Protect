import React, { useState, useEffect } from 'react';
import { FaRobot, FaKey, FaChevronDown, FaTimes, FaCheck, FaBrain, FaTrash, FaList } from 'react-icons/fa';

const AI_PROVIDERS = [
    {
        id: 'anthropic',
        name: 'Anthropic',
        models: [
            { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet' },
            { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
            { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
            { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' }
        ]
    },
    {
        id: 'google',
        name: 'Google Gemini',
        models: [
            { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
            { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro' },
            { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
            { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
            { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro' }
        ]
    },
    {
        id: 'openai',
        name: 'OpenAI',
        models: [
            { id: 'gpt-4o', name: 'GPT-4o' },
            { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
        ]
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        models: [
            { id: 'deepseek-chat', name: 'DeepSeek Chat' },
            { id: 'deepseek-coder', name: 'DeepSeek Coder' }
        ]
    },
    {
        id: 'ollama',
        name: 'Ollama (Local)',
        models: [
            { id: 'llama3.1', name: 'Llama 3.1' },
            { id: 'llama3', name: 'Llama 3' },
            { id: 'mistral', name: 'Mistral' },
            { id: 'gemma2', name: 'Gemma 2' }
        ]
    },
    {
        id: 'grok',
        name: 'xAI Grok',
        models: [
            { id: 'grok-4-latest', name: 'Grok 4 Latest' },
            { id: 'grok-2', name: 'Grok 2' },
            { id: 'grok-2-mini', name: 'Grok 2 Mini' },
            { id: 'grok-beta', name: 'Grok Beta' },
            { id: 'grok-vision-beta', name: 'Grok Vision Beta' }
        ]
    }
];

const AIConfigModal = ({ isOpen, onClose, onConfigSave }) => {
    const [provider, setProvider] = useState('anthropic');
    const [model, setModel] = useState('claude-3-sonnet-20240229');
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [view, setView] = useState('config'); // 'config' or 'keys'
    const [savedKeys, setSavedKeys] = useState({});

    useEffect(() => {
        // Load active config
        const activeConfig = localStorage.getItem('virusprotect_ai_config');
        if (activeConfig) {
            const config = JSON.parse(activeConfig);
            setProvider(config.provider || 'anthropic');
            setModel(config.model || 'claude-3-sonnet-20240229');
            setApiKey(config.apiKey || '');
        }

        // Load all saved keys map (provider -> key)
        const keysMap = localStorage.getItem('virusprotect_ai_keys_map');
        if (keysMap) {
            setSavedKeys(JSON.parse(keysMap));
        }
    }, [isOpen]);

    const handleProviderChange = (e) => {
        const newProvider = e.target.value;
        setProvider(newProvider);
        const providerConfig = AI_PROVIDERS.find(p => p.id === newProvider);
        if (providerConfig && providerConfig.models.length > 0) {
            setModel(providerConfig.models[0].id);
        }
        // Auto-fill key if saved
        if (savedKeys[newProvider]) {
            setApiKey(savedKeys[newProvider]);
        } else {
            setApiKey('');
        }
    };

    const handleSave = () => {
        const config = { provider, model, apiKey };
        localStorage.setItem('virusprotect_ai_config', JSON.stringify(config));

        // Save key to map
        if (apiKey) {
            const updatedKeys = { ...savedKeys, [provider]: apiKey };
            setSavedKeys(updatedKeys);
            localStorage.setItem('virusprotect_ai_keys_map', JSON.stringify(updatedKeys));
        }

        onConfigSave(config);
        onClose();
    };

    const deleteKey = (providerId) => {
        const updatedKeys = { ...savedKeys };
        delete updatedKeys[providerId];
        setSavedKeys(updatedKeys);
        localStorage.setItem('virusprotect_ai_keys_map', JSON.stringify(updatedKeys));

        if (provider === providerId) {
            setApiKey('');
        }
    };

    if (!isOpen) return null;

    const currentProvider = AI_PROVIDERS.find(p => p.id === provider);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-float">
            <div className="bg-[#0a0a0a] border border-neon-green/30 p-8 rounded-xl w-full max-w-md shadow-[0_0_50px_rgba(57,255,20,0.2)]">
                <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FaBrain className="text-neon-green" /> AI CONFIGURATION
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setView(view === 'config' ? 'keys' : 'config')}
                            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded transition-colors"
                            title={view === 'config' ? "Manage Keys" : "Back to Config"}
                        >
                            {view === 'config' ? <FaList /> : <FaRobot />}
                        </button>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2">
                            <FaTimes />
                        </button>
                    </div>
                </div>

                {view === 'config' ? (
                    <div className="space-y-6">
                        {/* Provider Select */}
                        <div className="space-y-2">
                            <label className="text-sm font-mono text-neon-green uppercase tracking-widest">AI Provider</label>
                            <div className="relative">
                                <select
                                    value={provider}
                                    onChange={handleProviderChange}
                                    className="w-full bg-black border border-gray-700 rounded p-3 text-white appearance-none focus:border-neon-green focus:outline-none transition-colors"
                                >
                                    {AI_PROVIDERS.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                                <FaChevronDown className="absolute right-4 top-4 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Model Select */}
                        <div className="space-y-2">
                            <label className="text-sm font-mono text-neon-green uppercase tracking-widest">Model Version</label>
                            <div className="relative">
                                <select
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="w-full bg-black border border-gray-700 rounded p-3 text-white appearance-none focus:border-neon-green focus:outline-none transition-colors"
                                >
                                    {currentProvider?.models.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                                <FaChevronDown className="absolute right-4 top-4 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* API Key */}
                        <div className="space-y-2">
                            <label className="text-sm font-mono text-neon-green uppercase tracking-widest">API Key</label>
                            <div className="relative">
                                <input
                                    type={showKey ? "text" : "password"}
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder={`Enter ${currentProvider?.name} API Key`}
                                    className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-neon-green focus:outline-none transition-colors pr-10"
                                />
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="absolute right-4 top-3.5 text-gray-500 hover:text-white"
                                >
                                    <FaKey />
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-500">
                                Keys are stored locally in your browser. {provider === 'ollama' && "Ensure Ollama is running locally."}
                            </p>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={!apiKey && provider !== 'ollama'}
                            className="w-full py-3 bg-neon-green text-black font-bold rounded hover:bg-white transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <FaCheck /> ENABLE NEURAL LINK
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h3 className="text-white font-bold mb-4">STORED API KEYS</h3>
                        {Object.keys(savedKeys).length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No keys stored securely.</p>
                        ) : (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {Object.entries(savedKeys).map(([pid, key]) => {
                                    const pName = AI_PROVIDERS.find(p => p.id === pid)?.name || pid;
                                    return (
                                        <div key={pid} className="flex justify-between items-center bg-white/5 p-3 rounded border border-gray-800">
                                            <div>
                                                <div className="text-neon-green font-bold text-sm">{pName}</div>
                                                <div className="text-gray-500 text-xs font-mono">
                                                    {key.substring(0, 8)}...{key.substring(key.length - 4)}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteKey(pid)}
                                                className="text-gray-600 hover:text-red-500 transition-colors p-2"
                                                title="Revoke Key"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-4 border-t border-gray-800 pt-2">
                            Revoking a key removes it from this browser's secure storage immediately.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIConfigModal;
