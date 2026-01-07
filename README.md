# VIRUSPROTECT - Sentinel System

![Status](https://img.shields.io/badge/Status-Online-brightgreen)
![CI](https://github.com/Dharaneesh20/Virus-Protect/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/License-MIT-blue)

**VirusProtect** is a cutting-edge, MERN-stack based security dashboard designed to scan files, analyze project secrecy leaks, and monitor local web applications. It features a cyber-aesthetic UI inspired by "The Matrix" and integrates advanced AI models to explain threats and recommend fixes.

---

## 🚀 Key Features

### 🛡️ Malware Scanning (VirusTotal Integration)
- **Hash-based File Scanning**: Checks file reputation against 70+ antivirus engines.
- **Upload Analysis**: If a file hash is unknown, it's uploaded for deep scanning.
- **AI Threat Explanation**: Uses top-tier LLMs to explain scan tags and threat classifications concisely.

### 🕵️ Local Secrecy Scanner
- **Regex-based Detection**: Scans project folders for leaked API keys (Google, AWS, Stripe, etc.).
- **Batch Processing**: Handles multiple files simultaneously.
- **AI Remediation**: Click "Analyze" on any leak to get an AI-generated fix (e.g., how to rotate keys or use `.env`).

### 🌐 Web App Monitor
- **Header Analysis**: Scans local or remote URLs for missing security headers (CSP, HSTS, X-Frame-Options).
- **Reputation Check**: Verifies the URL against VirusTotal's malicious database.
- **Recommendation Engine**: Generates specific Nginx/Express.js config snippets to harden your server.

### 🧠 "Explain with AI"
- **Multi-Provider Support**: Integrate your own API keys for **Anthropic (Claude 3.5)**, **Google DeepMind (Gemini 2.0/2.5)**, **OpenAI (GPT-4o)**, **DeepSeek**, **xAI (Grok)**, or local **Ollama** models.
- **Secure Storage**: API keys are encrypted and stored in your browser's local storage.
- **Actionable Advice**: AI responses are tuned to be concise, bulleted lists focused on "Risk" and "Fix".

### 📂 Persistence & Quarantine
- **History Log**: A full audit trail of all scan operations.
- **Quarantine Zone**: Isolate malicious files and delete them permanently from a secure sandbox.
- **Local DB**: A lightweight JSON database tracks everything locally without complex setup.

---

## 🛠️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Dharaneesh20/Virus-Protect.git
   cd Virus-Protect
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create a .env file with your VirusTotal API Key
   echo "VT_API_KEY=your_key_here" > .env
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Access the Dashboard**
   Open `http://localhost:5173` in your browser.

---

## 🔐 Security Policy

We take security seriously. If you discover a vulnerability, please read our [Security Policy](SECURITY.md) for reporting guidelines.

---

## 🤝 Contributing

**WE NEED YOU, CYBERSECURITY ENTHUSIASTS!**

VirusProtect is an open-source initiative, and we welcome contributions from the community to make it the ultimate local security tool.

**How to Contribute:**
1.  **Fork** the repository on GitHub: [https://github.com/Dharaneesh20/Virus-Protect](https://github.com/Dharaneesh20/Virus-Protect.git)
2.  **Clone** your fork.
3.  **Create a Branch** (`git checkout -b feature/amazing-new-scanner`).
4.  **Commit** your changes.
5.  **Push** to your fork.
6.  **Open a Pull Request**.

**Ideas for Contribution:**
- Add more regex patterns for secret detection.
- Integrate more AI providers.
- Add a "Network Traffic Analyzer" module.
- Improve the quarantine file encryption.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with React, Express, Node.js, and Paranoia.*
