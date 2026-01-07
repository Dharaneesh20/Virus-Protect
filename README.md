# VirusProtect - Advanced Security Suite

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0.0-green.svg)
![React](https://img.shields.io/badge/frontend-React_Vite-cyan.svg)
![Node](https://img.shields.io/badge/backend-Node_Express-green.svg)

**VirusProtect** is a futuristic, glassmorphism-styled security dashboard designed for developers and security enthusiasts. It provides a suite of tools to scan files, monitor web endpoints, and deeply analyze source code for hardcoded secrets.

## 🚀 Features

### 1. 🔐 **Secrecy Scanner (New Feature)**
Scan your entire project directory for leaked API keys, tokens, and database connection strings without your code ever leaving your machine.
- **Client-Side Scanning:** Uses advanced Regex patterns within the browser. zero data upload for maximum privacy.
- **Supported Keys:** 
  - Google API Keys (`AIza...`)
  - AWS Access Keys (`AKIA...`)
  - GitHub Tokens (`ghp...`)
  - Stripe, OpenAI, Slack, Firebase, MongoDB, SQL, and more.
- **Visual Reports:** Pinpoints exact file, line number, and code snippet where the secret was found.

### 2. 🛡️ **File Malware Scan**
- Upload individual files to check against global threat databases (integrated with VirusTotal API).
- Real-time hash calculation and reputation check.

### 3. 🌐 **Web Monitor**
- Monitor URL reputation and status.
- Analyze security headers and SSL configuration.

## 🛠️ Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Dharaneesh20/VirusProtect.git
    cd VirusProtect
    ```

2.  **Install Dependencies:**
    
    *Client:*
    ```bash
    cd client
    npm install
    ```

    *Server:*
    ```bash
    cd ../server
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the `server` directory:
    ```env
    PORT=5000
    VIRUSTOTAL_API_KEY=your_key_here
    ```

## 💻 Usage

1.  **Start the Backend:**
    ```bash
    cd server
    npm start
    ```

2.  **Start the Frontend:**
    ```bash
    cd client
    npm run dev
    ```

3.  **Access the Dashboard:**
    Open `http://localhost:5173` in your browser.

## 🌿 Branches

- **`main`**: Stable release branch.
- **`feature-drop`**: Cutting-edge features (currently including the new Secrecy Scanner).

## 👤 Author

**Dharaneesh20**
- GitHub: [Dharaneesh20](https://github.com/Dharaneesh20)
- Email: dharaneeshrs777@gmail.com

## 📄 License

This project is licensed under the MIT License.
