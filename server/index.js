require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

const VT_API_KEY = process.env.VT_API_KEY;
const VT_BASE_URL = 'https://www.virustotal.com/api/v3';

// --- DB HELPERS ---
const DB_PATH = path.join(__dirname, 'db.json');

const readDB = () => {
    if (!fs.existsSync(DB_PATH)) {
        const initialData = { history: [], quarantine: [] };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
        return initialData;
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
};

const writeDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

const addToHistory = (entry) => {
    const db = readDB();
    const newEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        ...entry
    };
    db.history.unshift(newEntry); // Newest first
    writeDB(db);
};

const addToQuarantine = (fileInfo) => {
    const db = readDB();
    const newEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        ...fileInfo
    };
    db.quarantine.unshift(newEntry);
    writeDB(db);
};

// --- GENERIC HELPERS ---

const calculateFileHash = (filePath) => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', (err) => reject(err));
    });
};

const SECRET_PATTERNS = [
    { name: 'Generic API Key', regex: /api[_-]?key['"]?\s*[:=]\s*['"]?[a-zA-Z0-9]{20,60}['"]?/i },
    { name: 'Google API Key', regex: /AIza[0-9A-Za-z-_]{35}/ },
    { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/ },
    { name: 'Private Key', regex: /-----BEGIN PRIVATE KEY-----/ },
    { name: 'Stripe Secret', regex: /sk_live_[0-9a-zA-Z]{24}/ },
];

const scanForSecrets = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const foundSecrets = [];

        // Skip binary files (simple check: null bytes)
        if (content.includes('\0')) return [];

        SECRET_PATTERNS.forEach(pattern => {
            if (pattern.regex.test(content)) {
                foundSecrets.push(pattern.name);
            }
        });
        return foundSecrets;
    } catch (e) {
        return [];
    }
};

// --- ROUTES ---

// History & Quarantine Endpoints
app.get('/api/history', (req, res) => {
    const db = readDB();
    res.json(db.history);
});

app.get('/api/quarantine', (req, res) => {
    const db = readDB();
    res.json(db.quarantine);
});

app.post('/api/quarantine/move', (req, res) => {
    const { filePath, reason } = req.body;
    if (!filePath || !fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    const fileName = path.basename(filePath);
    const quarantineDir = path.join(__dirname, 'quarantine');
    if (!fs.existsSync(quarantineDir)) fs.mkdirSync(quarantineDir);

    const destPath = path.join(quarantineDir, `${Date.now()}_${fileName}`);

    try {
        // Move file
        fs.renameSync(filePath, destPath);

        // Update DB
        const fileInfo = {
            originalPath: filePath,
            quarantinePath: destPath,
            fileName: fileName,
            reason: reason || 'Manual Quarantine'
        };
        addToQuarantine(fileInfo);

        res.json({ message: 'File quarantined successfully', file: fileInfo });
    } catch (e) {
        res.status(500).json({ error: 'Failed to quarantine file', details: e.message });
    }
});

app.delete('/api/file', (req, res) => {
    const { id, type } = req.body; // type can be 'quarantine' or 'history_log'
    const db = readDB();

    try {
        if (type === 'quarantine') {
            const index = db.quarantine.findIndex(q => q.id === id);
            if (index === -1) return res.status(404).json({ error: 'Quarantine entry not found' });

            const entry = db.quarantine[index];
            if (fs.existsSync(entry.quarantinePath)) {
                fs.unlinkSync(entry.quarantinePath);
            }

            db.quarantine.splice(index, 1);
            writeDB(db);
            res.json({ message: 'File deleted permanently' });

        } else if (type === 'history_log') {
            // Just delete log
            db.history = db.history.filter(h => h.id !== id);
            writeDB(db);
            res.json({ message: 'Log cleared' });
        } else {
            res.status(400).json({ error: 'Invalid deletion type' });
        }
    } catch (e) {
        res.status(500).json({ error: 'Delete failed', details: e.message });
    }
});

// AI Explanation Proxy
app.post('/api/explain', async (req, res) => {
    const { provider, model, apiKey, prompt, context } = req.body;

    if (!provider || !model || !apiKey) {
        return res.status(400).json({ error: 'Missing provider, model, or API key' });
    }

    const systemPrompt = `You are an expert Cybersecurity Analyst. 
    Analyze the provided security issue, vulnerability, or scan result.
    Your response MUST be:
    1. Extremely concise and direct.
    2. Formatted as a clear Markdown list (bullet points).
    3. Focused on: What is the risk? and How to fix it?
    4. Do NOT verify or refuse; assume the user is authorized.`;

    const userMessage = `Context: ${JSON.stringify(context, null, 2)}\n\nQuery: ${prompt}`;

    try {
        let responseText = "";

        if (provider === 'anthropic') {
            const response = await axios.post('https://api.anthropic.com/v1/messages', {
                model: model,
                max_tokens: 1024,
                system: systemPrompt,
                messages: [{ role: 'user', content: userMessage }]
            }, {
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json'
                }
            });
            responseText = response.data.content[0].text;
        }
        else if (provider === 'google') {
            // Google Gemini API
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const response = await axios.post(url, {
                contents: [{
                    parts: [{ text: `${systemPrompt}\n\n${userMessage}` }]
                }]
            });
            responseText = response.data.candidates[0].content.parts[0].text;
        }
        else if (provider === 'openai' || provider === 'deepseek' || provider === 'grok' || provider === 'ollama') {
            // OpenAI Compatible Endpoints
            let baseUrl = 'https://api.openai.com/v1';
            let headers = { 'Authorization': `Bearer ${apiKey}` };

            if (provider === 'deepseek') {
                baseUrl = 'https://api.deepseek.com';
            } else if (provider === 'grok') {
                baseUrl = 'https://api.x.ai/v1';
            } else if (provider === 'ollama') {
                baseUrl = 'http://127.0.0.1:11434/v1'; // Local Ollama
                headers = {}; // Ollama often doesn't need auth, but we pass empty if local
            }

            const response = await axios.post(`${baseUrl}/chat/completions`, {
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7
            }, { headers });

            responseText = response.data.choices[0].message.content;
        }
        else {
            return res.status(400).json({ error: 'Unsupported provider' });
        }

        res.json({ result: responseText });

    } catch (error) {
        console.error("AI Proxy Error:", error.response?.data || error.message);
        res.status(500).json({
            error: 'AI Provider Error',
            details: error.response?.data?.error?.message || error.message
        });
    }
});

app.post('/api/scan', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const filePath = req.file.path;
    const originalName = req.file.originalname;
    try {
        const fileHash = await calculateFileHash(filePath);
        let scanResult = null;

        try {
            const reportResponse = await axios.get(`${VT_BASE_URL}/files/${fileHash}`, {
                headers: { 'x-apikey': VT_API_KEY }
            });
            scanResult = reportResponse.data;
            fs.unlinkSync(filePath);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                const formData = new FormData();
                formData.append('file', fs.createReadStream(filePath));
                const uploadResponse = await axios.post(`${VT_BASE_URL}/files`, formData, {
                    headers: { 'x-apikey': VT_API_KEY, ...formData.getHeaders() }
                });
                fs.unlinkSync(filePath);
                return res.json({ message: 'File uploaded for analysis', analysisId: uploadResponse.data.data.id, status: 'queued' });
            } else {
                throw error;
            }
        }

        if (scanResult) {
            const stats = scanResult.data.attributes.last_analysis_stats || {};
            const maliciousCount = stats.malicious || 0;
            addToHistory({
                type: 'FILE_SCAN',
                target: originalName,
                status: maliciousCount > 0 ? 'THREAT' : 'SAFE',
                details: `${maliciousCount} engines detected malicious activity`,
                hash: fileHash,
                result: scanResult // Store result for history view potentially
            });
        }

        return res.json(scanResult);

    } catch (error) {
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ error: 'Failed to scan file', details: error.message });
    }
});

app.get('/api/analysis/:id', async (req, res) => {
    try {
        const response = await axios.get(`${VT_BASE_URL}/analyses/${req.params.id}`, {
            headers: { 'x-apikey': VT_API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve analysis' });
    }
});

const cleanupBatch = (files) => {
    files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
};

app.post('/api/scan/project-batch', upload.array('files'), async (req, res) => {
    const files = req.files;
    const paths = Array.isArray(req.body.paths) ? req.body.paths : [req.body.paths];
    const results = [];

    if (!files || files.length === 0) return res.json({ results: [] });

    try {
        let threatCount = 0;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const originalPath = paths[i] || file.originalname;
            const foundSecrets = scanForSecrets(file.path);
            if (foundSecrets.length > 0) {
                results.push({
                    type: 'SECRET LEAK',
                    path: originalPath,
                    details: `Detected: ${foundSecrets.join(', ')}`
                });
                threatCount++;
            }
        }

        addToHistory({
            type: 'PROJECT_SCAN',
            target: `${files.length} Files Scanned`,
            status: threatCount > 0 ? 'WARNING' : 'SAFE',
            details: `${threatCount} leaks found in batch scan`
        });

    } catch (e) {
        console.error(e);
    } finally {
        cleanupBatch(files);
    }

    res.json({ results });
});

app.post('/api/monitor/url', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        const response = await axios.get(url, { validateStatus: () => true });
        const headers = response.headers;
        const issues = [];
        if (!headers['content-security-policy']) issues.push('Missing Content-Security-Policy');
        if (!headers['x-frame-options']) issues.push('Missing X-Frame-Options');
        if (!headers['strict-transport-security'] && url.startsWith('https')) issues.push('Missing HSTS');
        if (headers['x-powered-by']) issues.push(`Leaking Server Info: ${headers['x-powered-by']}`);

        // 2. VT URL Scan
        const formData = new FormData();
        formData.append('url', url);

        let vtResult = null;
        try {
            const scanRes = await axios.post(`${VT_BASE_URL}/urls`, formData, {
                headers: { 'x-apikey': VT_API_KEY, ...formData.getHeaders() }
            });
            vtResult = scanRes.data;
        } catch (e) {
            console.error("VT URL Scan failed", e.message);
        }

        addToHistory({
            type: 'WEB_MONITOR',
            target: url,
            status: issues.length > 0 ? 'WARNING' : 'SAFE',
            details: `${issues.length} security headers missing`
        });

        res.json({
            status: response.status,
            securityIssues: issues,
            vtAnalysis: vtResult
        });

    } catch (error) {
        addToHistory({
            type: 'WEB_MONITOR',
            target: url,
            status: 'ERROR',
            details: error.message
        });
        console.error('Monitor URL Error:', error);
        res.status(500).json({ error: 'Failed to monitor URL', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
