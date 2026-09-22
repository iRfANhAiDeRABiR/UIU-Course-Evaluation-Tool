# UIU UCAM Course Evaluation Automator (Chrome Extension)

**Author & Architect**: **IRFAN HAIDER ABIR**  
**Student ID**: `0112230474`  
**Copyright**: © 2026 IRFAN HAIDER ABIR. All rights reserved.  
**Security Status**: Code Locked, Watermarked, and Obfuscated.

---

## 📁 Extension Directory
```
C:\Users\irfan\Desktop\Selenium\UIU Course Evaluation Tool (Chrome-Extension)
```

---

## 🔒 Security & Code Integrity Details

- **Chrome Web Store Compliant**: All source and production files are fully human-readable, audit-hardened, and clean from forbidden obfuscation in strict accordance with Google Chrome Web Store Developer Program Policies.
- **Credential Protection**: Runtime passwords are automatically purged from local storage immediately upon form submission, preventing unencrypted plaintext persistence on disk.
- **DOM XSS Sanitization**: Dynamic badge and modal content use secure `textContent` DOM node construction rather than raw string interpolation.
- **Principle of Least Privilege**: Minimized permissions down to `storage` and `activeTab`, scoped exclusively to `https://ucam.uiu.ac.bd/*`.
- **Embedded Integrity Signatures**: The author signature **`IRFAN HAIDER ABIR`** is preserved across:
  - `manifest.json` (author & developer fields)
  - `popup.html` (metadata tags, security seals, and UI footer)
  - `background.js` (byte array integrity verification & storage tags)
  - `content.js` (DOM watermark attributes, console stamps, and runtime guards)
  - `popup.js` (signature validation checks)

---

## 🚀 How to Install in Google Chrome

1. Open **Google Chrome**.
2. Navigate to `chrome://extensions` in the address bar.
3. Turn **ON** the **Developer mode** toggle in the top-right corner.
4. Click **Load unpacked** in the top-left corner.
5. Select this folder:
   ```
   C:\Users\irfan\Desktop\Selenium\UIU Course Evaluation Tool (Chrome-Extension)
   ```
6. Click the Extensions menu (puzzle piece icon 🧩) and **Pin** 📌 **UIU UCAM Evaluation Automator**.

---

## 💻 How to Use

1. Click the **UCAM Automator** icon in your Chrome toolbar.
2. Enter your **Student ID** and **Password**.
3. Select your **Expected Grade** (default: `A`).
4. Click **🚀 Start Automation**.
5. The extension will automatically log in, open course evaluation, loop through every registered course, answer **"Strongly Agree"**, and save until all courses are completed!
