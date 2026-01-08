
<div align="center">

# VIRUSPROTECT - Sentinel System

![Status](https://img.shields.io/badge/Status-Online-brightgreen)
![CI](https://github.com/Dharaneesh20/Virus-Protect/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node Version](https://img.shields.io/badge/node-18.x%20%7C%2020.x-brightgreen)
![React Version](https://img.shields.io/badge/react-19.2.0-blue)
![Express Version](https://img.shields.io/badge/express-5.2.1-yellow)

**VirusProtect** is a cutting-edge, full-stack security dashboard designed to scan files, analyze project secrecy leaks, and monitor web applications. It integrates advanced AI models (Claude, Gemini, GPT-4, DeepSeek, Grok, Ollama) to explain threats and recommend fixes.

[Features](#-key-features) • [Installation](#%EF%B8%8F-installation--setup) • [Usage](#-usage) • [Architecture](#%EF%B8%8F-architecture) • [Contributing](#-contributing)

</div>

---

## 📸 Screenshots

<div align="center">
<table>
<tr>
<td width="50%">
<img src="https://i.ibb.co/Rp3KcBNn/Screenshot-from-2026-01-08-00-15-23.png" alt="Dashboard Overview" width="100%"/>
<p><b>Dashboard Overview</b></p>
</td>
<td width="50%">
<img src="https://i.ibb.co/twwwqzKP/Screenshot-from-2026-01-08-00-15-32.png" alt="File Scanning Interface" width="100%"/>
<p><b>File Scanning Interface</b></p>
</td>
</tr>
<tr>
<td width="50%">
<img src="https://i.ibb.co/1GWv3YW7/Screenshot-from-2026-01-08-00-16-11.png" alt="Scan Results" width="100%"/>
<p><b>Scan Results</b></p>
</td>
<td width="50%">
<img src="https://i.ibb.co/JFmkrFrB/Screenshot-from-2026-01-08-00-16-16.png" alt="AI Threat Analysis" width="100%"/>
<p><b>AI Threat Analysis</b></p>
</td>
</tr>
<tr>
<td width="50%">
<img src="https://i.ibb.co/jPB98vqL/Screenshot-from-2026-01-08-00-17-01.png" alt="Secret Detection" width="100%"/>
<p><b>Secret Detection</b></p>
</td>
<td width="50%">
<img src="https://i.ibb.co/JFF40cjF/Screenshot-from-2026-01-08-00-17-31.png" alt="Web Monitoring" width="100%"/>
<p><b>Web Monitoring</b></p>
</td>
</tr>
<tr>
<td width="50%">
<img src="https://i.ibb.co/zWrbGCrz/Screenshot-from-2026-01-08-00-17-38.png" alt="Security Analysis" width="100%"/>
<p><b>Security Analysis</b></p>
</td>
<td width="50%">
<img src="https://i.ibb.co/r2DtN60c/Screenshot-from-2026-01-08-00-20-10.png" alt="Quarantine Management" width="100%"/>
<p><b>Quarantine Management</b></p>
</td>
</tr>
</table>
</div>

---

##  Key Features

### 🛡️ Advanced Malware Scanning
- **VirusTotal Integration**: Leverages 70+ antivirus engines for comprehensive threat detection
- **Hash-based File Analysis**: Quick reputation checks via SHA-256 hashing
- **Upload & Deep Scan**: Automatically uploads unknown files for detailed analysis
- **AI-Powered Threat Explanation**: Integrates with Claude 3.5, Gemini 2.0/2.5, GPT-4o, DeepSeek, Grok, and Ollama to explain scan results in plain English

### 🕵️ Intelligent Secrecy Scanner
- **Multi-Pattern Detection**: Identifies leaked API keys (Google, AWS, Stripe), private keys, and sensitive credentials
- **Project-Wide Scanning**: Recursively scans entire codebases for security vulnerabilities
- **Batch Processing**: Efficiently handles thousands of files simultaneously
- **AI Remediation Assistant**: Generates actionable fix recommendations (key rotation, environment variable usage)

### 🌐 Web Application Security Monitor
- **HTTP Header Analysis**: Validates security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- **URL Reputation Check**: Verifies domains against VirusTotal's threat database
- **Configuration Generator**: Produces ready-to-use Nginx/Express.js security config snippets
- **Real-Time Monitoring**: Continuous security assessment for development environments

### 🧠 Multi-Provider AI Integration
- **6+ AI Providers**: Support for Anthropic (Claude), Google (Gemini), OpenAI (GPT), DeepSeek, xAI (Grok), and Ollama
- **Secure Key Management**: Client-side encryption of API credentials stored in localStorage
- **Context-Aware Responses**: Tailored security advice with risk assessment and remediation steps
- **Flexible Configuration**: Easy provider switching through intuitive modal interface

### 📊 Comprehensive Security Dashboard
- **Real-Time Statistics**: Visual overview of scan activities and threat levels
- **History & Audit Trail**: Complete logs of all security operations with timestamps
- **Quarantine Management**: Isolated storage for malicious files with secure deletion
- **Persistent Storage**: JSON-based local database for offline operation

---

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- **React 19.2** with React Router for SPA navigation
- **Vite** for blazing-fast build and development
- **TailwindCSS** for responsive, utility-first styling
- **Framer Motion** for smooth animations
- **Axios** for HTTP client
- **React Dropzone** for intuitive file uploads
- **React Markdown** with GitHub Flavored Markdown support

**Backend:**
- **Node.js** with **Express 5.2**
- **Multer** for secure file handling
- **Axios** for VirusTotal API integration
- **Crypto** module for SHA-256 hashing
- **CORS** enabled for cross-origin requests
- **JSON file database** for lightweight persistence

**External Services:**
- **VirusTotal API** - Malware scanning and URL reputation
- **Multiple AI Providers** - Claude, Gemini, GPT-4o, DeepSeek, Grok, Ollama

### Project Structure

```
Virus-Protect/
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   │   ├── AIConfigModal.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── ScanResult.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/        # Route-based pages
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── ScanFilePage.jsx
│   │   │   ├── ScanProjectPage.jsx
│   │   │   ├── WebMonitorPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   └── QuarantinePage.jsx
│   │   ├── layouts/      # Layout wrappers
│   │   └── assets/       # Static resources
│   ├── public/           # Public assets
│   └── package.json
├── server/               # Express API server
│   ├── index.js          # Main server file
│   ├── db.json           # Local database
│   ├── uploads/          # Temporary file uploads
│   ├── quarantine/       # Quarantined files
│   └── package.json
├── .github/workflows/    # CI/CD pipelines
│   └── ci.yml
├── CHANGELOG.md
├── SECURITY.md
├── LICENSE
└── README.md
```
👥 Collaborators
This project is made possible by these amazing contributors:
<div align="center">
<table>
<tr>
    <td align="center">
        <a href="https://github.com/Dharaneesh20">
            <img src="https://github.com/Dharaneesh20.png" width="100px;" alt="Dharaneesh20"/>
            <br />
            <sub><b>Dharaneesh20</b></sub>
        </a>
        <br />
        <sub>Project Lead & Core Developer</sub>
    </td>
    <td align="center">
        <a href="https://github.com/deepan-crypto">
            <img src="https://github.com/deepan-crypto.png" width="100px;" alt="deepan-crypto"/>
            <br />
            <sub><b>deepan-crypto</b></sub>
        </a>
        <br />
        <sub>Contributor</sub>
    </td>
    <!-- Add more collaborators here -->
    <!-- Example template:
    <td align="center">
        <a href="https://github.com/USERNAME">
            <img src="https://github.com/USERNAME.png" width="100px;" alt="USERNAME"/>
            <br />
            <sub><b>Display Name</b></sub>
        </a>
        <br />
        <sub>Role/Contribution</sub>
    </td>
    -->
</tr>
</table>
</div>

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js**: v18.x or v20.x (LTS recommended)
- **npm**: v9+ (comes with Node.js)
- **VirusTotal API Key**: [Get your free API key](https://www.virustotal.com/gui/join-us)
- **AI Provider API Keys** (Optional): For enhanced threat analysis
  - [Anthropic Claude](https://www.anthropic.com/)
  - [Google Gemini](https://ai.google.dev/)
  - [OpenAI GPT](https://platform.openai.com/)
  - [DeepSeek](https://www.deepseek.com/)
  - [xAI Grok](https://x.ai/)
  - [Ollama](https://ollama.ai/) (Local models)

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Dharaneesh20/Virus-Protect.git
   cd Virus-Protect
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   
   # Create environment configuration
   echo "VT_API_KEY=your_virustotal_api_key_here" > .env
   echo "PORT=5000" >> .env
   
   # Start the server
   npm start
   ```
   
   The server will run on `http://localhost:5000`

3. **Frontend Setup (New Terminal)**
   ```bash
   cd client
   npm install
   
   # Start development server
   npm run dev
   ```
   
   The application will open at `http://localhost:5173`

4. **Configure AI Providers (Optional)**
   - Click the **"AI Config"** button in the dashboard
   - Select your preferred AI provider
   - Enter your API key
   - Keys are securely stored in browser localStorage

### Production Build

```bash
# Build client for production
cd client
npm run build

# Preview production build
npm run preview
```

---

## 📖 Usage

### File Scanning
1. Navigate to **Scan File** from the sidebar
2. Drag & drop or click to upload a file
3. View real-time scan results from VirusTotal
4. Click **"Explain with AI"** for detailed threat analysis
5. Quarantine suspicious files if needed

### Project Secret Scanning
1. Go to **Scan Project** page
2. Select your project directory
3. System scans for hardcoded API keys, credentials, and secrets
4. Review detected issues with severity levels
5. Use AI assistant to get remediation steps

### Web Monitoring
1. Navigate to **Monitor Web** section
2. Enter the URL to analyze
3. Review security header compliance
4. Check URL reputation via VirusTotal
5. Download generated security configurations

### History & Quarantine
- **History**: View all past scans with timestamps and results
- **Quarantine**: Manage isolated malicious files with secure deletion

---

## 🔧 Configuration

### Environment Variables

**Server (.env)**
```env
VT_API_KEY=your_virustotal_api_key
PORT=5000
```

### AI Provider Setup

The application supports multiple AI providers. Configure them via the dashboard:

| Provider | Model Examples | Use Case |
|----------|---------------|----------|
| Anthropic | claude-3-5-sonnet-latest | Deep security analysis |
| Google | gemini-2.0-flash-exp | Fast explanations |
| OpenAI | gpt-4o | Comprehensive reports |
| DeepSeek | deepseek-chat | Code-focused analysis |
| xAI | grok-2-latest | Real-time threat intel |
| Ollama | llama3.2, mistral | Local/offline analysis |

---

## 🔐 Security Policy

We take security seriously. If you discover a vulnerability, please read our [Security Policy](SECURITY.md) for responsible disclosure guidelines.

**Security Features:**
- No sensitive data leaves your system (except for VirusTotal API calls)
- AI API keys stored client-side with encryption
- File quarantine system with isolated storage
- No database credentials required (JSON-based local storage)
- CORS configured for localhost development

---

## 🧪 Testing & CI/CD

### Current CI/CD Status: ✅ **ACTIVE**

The project uses **GitHub Actions** for continuous integration:

**Workflow:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

**Pipeline Steps:**
1. ✅ **Multi-Version Testing**: Runs on Node.js 18.x and 20.x
2. ✅ **Client Build Verification**: Installs dependencies and builds React app
3. ✅ **Server Dependency Check**: Validates backend package integrity
4. ✅ **Automated on Push/PR**: Triggers on commits to `main` branch

**Triggered on:**
- Push to `main` branch
- Pull requests to `main` branch

**Status:** ![CI Badge](https://github.com/Dharaneesh20/Virus-Protect/actions/workflows/ci.yml/badge.svg)

### Future Testing Roadmap
- [ ] Unit tests for security scanning logic
- [ ] Integration tests for VirusTotal API
- [ ] E2E tests with Playwright/Cypress
- [ ] Code coverage reporting
- [ ] Automated security scanning (Dependabot)
- [ ] Docker containerization
- [ ] CD pipeline for automatic deployment

---

## 🤝 Contributing

**WE NEED YOU, CYBERSECURITY ENTHUSIASTS!**

VirusProtect is an open-source initiative, and we welcome contributions from the community to make it the ultimate local security tool.

### How to Contribute

1. **Fork** the repository: [Virus-Protect on GitHub](https://github.com/Dharaneesh20/Virus-Protect)
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Virus-Protect.git
   cd Virus-Protect
   ```
3. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-security-feature
   ```
4. **Make Your Changes** and commit:
   ```bash
   git add .
   git commit -m "Add: New pattern detection for Azure keys"
   ```
5. **Push** to your fork:
   ```bash
   git push origin feature/amazing-security-feature
   ```
6. **Open a Pull Request** on the main repository

---


## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - Copyright (c) 2026 Dharaneesh20
```

---

## 🙏 Acknowledgments

- **VirusTotal** for their comprehensive malware scanning API
- **Anthropic, Google, OpenAI, DeepSeek, xAI** for AI integration support
- **Open Source Community** for inspiration and tools
- **The Matrix** for aesthetic inspiration 🟢

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Dharaneesh20/Virus-Protect/issues)
- **Security Reports**: dharaneeshrs@proton.me
- **Discussions**: [GitHub Discussions](https://github.com/Dharaneesh20/Virus-Protect/discussions)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Dharaneesh20](https://github.com/Dharaneesh20)

</div>

---

*Built with React, Express, Node.js, and Paranoia.*
