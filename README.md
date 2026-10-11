# UIU UCAM Course Evaluation Automator

**Author**: **Irfan Haider Abir** ([@iRfANhAiDeRABiR](https://github.com/iRfANhAiDeRABiR))  
**Version**: `1.0.2` (Manifest V3 — Chrome & Firefox)  
**Chrome Web Store**: [Install from Chrome Web Store](https://chromewebstore.google.com/detail/uiu-ucam-evaluation-autom/meooagbgjigmhcmbbfjbkdnjdicgccea)  
**Website**: [https://irfanhaiderabir.github.io/UIU-Course-Evaluation-Tool/](https://irfanhaiderabir.github.io/UIU-Course-Evaluation-Tool/)

---

## ✨ Features

- **⚡ One-Click Active Session Evaluation**: Automatically detects when you are already logged into `ucam.uiu.ac.bd` and evaluates your courses with a single click—no need to re-enter credentials.
- **📋 Per-Course Checklist & Live Skip**: Choose which enrolled courses to automate and which to skip for manual evaluation, or click **⏩ Skip** directly from the on-page floating badge.
- **🎯 Customizable Expected Grade**: Select your target expected grade (`A`, `A-`, `B+`, `B`, etc.) across all course evaluations.
- **🛑 Smart Inactive Evaluation Detection**: Automatically detects when the university's evaluation period is closed (*"Course evaluation is off now."*) and stops immediately without retrying.
- **📊 Real-Time Progress & Logs**: Live progress bar (`Course X of Y`) and step-by-step activity log inside the popup and on-page status badge.

---

## 📁 Project Structure

```text
UIU-Course-Evaluation-Tool/
├── chrome/          # Dedicated Google Chrome / Edge / Brave (Manifest V3) package
├── firefox/         # Dedicated Mozilla Firefox (Manifest V3) package
├── src/             # Shared core extension scripts
├── index.html       # Landing page (GitHub Pages)
├── privacy-policy.html
└── build.ps1        # Build script for generating Chrome & Firefox .zip packages
```

---

## 🔒 Privacy & Security

- **100% Client-Side Execution**: All form automation runs locally in your browser on `https://ucam.uiu.ac.bd/*`.
- **Credential Protection**: Runtime passwords are removed from local storage immediately after login, and credentials are completely optional when using an active UCAM session.
- **DOM XSS Sanitization**: Dynamic badge and modal elements are constructed safely using `textContent` and DOM APIs.
- **Minimal Permissions**: Scoped strictly to `storage`, `activeTab`, and `https://ucam.uiu.ac.bd/*`.

---

## 🚀 How to Install

### Option 1: Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store listing](https://chromewebstore.google.com/detail/uiu-ucam-evaluation-autom/meooagbgjigmhcmbbfjbkdnjdicgccea).
2. Click **Add to Chrome**.

### Option 2: Manual Installation (Developer Mode)
1. Clone or download this repository.
2. **For Chrome / Edge / Brave**:
   - Open `chrome://extensions` and enable **Developer mode**.
   - Click **Load unpacked** and select the `chrome/` folder.
3. **For Mozilla Firefox**:
   - Open `about:debugging#/runtime/this-firefox`.
   - Click **Load Temporary Add-on...** and select `firefox/manifest.json`.

---

## 💻 How to Use

1. Log in to [UIU UCAM](https://ucam.uiu.ac.bd/) (or enter your credentials in the extension popup).
2. Click the **UIU UCAM Evaluation Automator** icon in your browser toolbar.
3. Select your **Expected Grade** (default: `A`) and optionally uncheck any courses you wish to skip.
4. Click **⚡ One-Click Evaluate** (or **✨ Start Automation**).
5. The extension will automatically navigate to the Course Evaluation page, complete each selected course, and notify you when finished!

