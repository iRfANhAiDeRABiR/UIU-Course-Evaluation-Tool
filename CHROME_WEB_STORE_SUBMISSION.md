# Chrome Web Store Publishing & Resubmission Guide

This document contains all details, copy-paste declarations, privacy policy URLs, and step-by-step instructions to successfully resubmit and pass review for the **UIU UCAM Course Evaluation Automator** on the **Google Chrome Web Store Developer Dashboard**.

---

## ⚡ Recent Rejection Remediation Summary

All previous review violations have been completely resolved:

1. **`Red Titanium` (Code Readability / Obfuscation)**:
   - **Resolved**: All obfuscated variables (`_0x...`), hex byte arrays, and integrity validation functions have been completely eliminated from all files (`background.js`, `content.js`, `popup.js`). All code is 100% human-readable and transparent.
2. **`Purple Nickel` (User Data Privacy / Privacy Policy)**:
   - **Resolved**: Provided a direct, standalone HTML privacy policy (`privacy-policy.html`) deployed via GitHub Pages (`https://irfanhaiderabir.github.io/UIU-Course-Evaluation-Tool/privacy-policy.html`). Owner repository raw markdown links (`/blob/main/...`) are no longer used.
3. **`Red Nickel` (Responsible Marketing / Deceptive Graphics)**:
   - **Resolved**: Replaced promotional assets with a 100% compliant banner (`promo_banner.jpg`) containing **ZERO star icons (★, ⭐)**, zero fake review ratings, and zero deceptive claims.

---

## 1. Store Listing Information

### Item Name (Title)
```text
UIU UCAM Course Evaluation Automator
```

### Short Description (Summary - Max 132 chars)
```text
Automates course evaluations on UIU UCAM with smart grading, real-time progress tracking, and secure local authentication.
```
*(Length: 120 characters)*

### Detailed Description
```markdown
UIU UCAM Course Evaluation Automator is a modern, lightweight, and secure browser extension designed specifically for United International University (UIU) students. It automates the tedious end-of-trimester course evaluation process on the official UIU UCAM portal (https://ucam.uiu.ac.bd/) in seconds.

⚡ KEY FEATURES:
• One-Click Course Evaluation: Automatically evaluates all registered courses with a single click.
• Customizable Target Grade: Choose your desired expected grade (A, A-, B+, etc.) across all evaluation forms.
• Consistent Rating System: Answers all evaluation questions with positive ratings automatically.
• Real-Time Course Progress Tracker: Live progress bar and counter (Course X of Y) in both the extension popup and on-page floating badge.
• Smart ASP.NET AJAX Error Detection: Instantly detects invalid passwords, account status issues, or server errors, halting automation safely.
• Interactive Bottom-Right Toast Alerts: Informs you of errors or completion without disruptive browser alerts.
• Completion Celebration Engine: Features animated celebration confetti and a completion summary dialog upon finishing all course evaluations.
• Live Activity Logs: Transparent real-time log box displaying every automated action step-by-step.

🔒 PRIVACY & SECURITY FIRST:
• 100% Client-Side: All processing occurs entirely inside your local browser.
• Zero Data Collection: The extension does NOT collect, track, transmit, or sell any personal data or browsing history.
• Safe Password Handling: Passwords used during the session are purged from memory immediately after authentication.
• Local Storage Only: If "Save Login Info" is enabled, credentials remain encrypted inside Chrome's local storage (chrome.storage.local) on your device only.
• Scoped Exclusively to UCAM: The extension operates ONLY on https://ucam.uiu.ac.bd/* and has zero access to any other website.

📖 HOW TO USE:
1. Open the extension popup from your Chrome toolbar.
2. Enter your UIU Student ID and Password.
3. Select your Expected Grade.
4. Click "✨ Start Automation".
5. Sit back and watch your courses get evaluated with live progress tracking!

⚠️ DISCLAIMER:
This is an independent open-source tool built by Irfan Haider Abir (Student ID: 0112230474) to assist UIU students. It is not officially affiliated with or endorsed by United International University (UIU). All university trademarks and portal rights belong to UIU.
```

### Category & Language
- **Category**: `Productivity` $\rightarrow$ `Workflow & Planning` (or `Tools`)
- **Primary Language**: `English`

---

## 2. Privacy & Single Purpose Justifications (For Privacy Tab)

### Single Purpose Description
```text
The sole purpose of this extension is to automate the repetitive course evaluation form filling and submission process for students on the United International University (UIU) UCAM portal.
```

### Permissions Justifications

| Permission | Justification (Copy & Paste into Developer Console) |
| :--- | :--- |
| **`storage`** | Used exclusively to save user UI preferences (selected expected grade, remember login toggle) and temporary activity logs locally on the student's browser via chrome.storage.local. No data is ever transmitted to any external server. |
| **`activeTab`** | Used to interact with the active tab when the student starts automation from the popup to navigate to the evaluation form and submit responses. |
| **Host Permission (`https://ucam.uiu.ac.bd/*`)** | Required to automate login, navigation, and evaluation form submissions exclusively on the United International University student portal. The extension does not access or run on any other domain. |

### Data Usage Declarations (Checkboxes in Developer Dashboard)
- **Do you collect personal information?** $\rightarrow$ **No**
- **Do you collect authentication information?** $\rightarrow$ Select **Yes - Only to authenticate locally on the user's device**, and certify:
  - [x] *"I certify that this data is not sold or transferred to any third party."*
  - [x] *"I certify that this data is not used or transferred for purposes unrelated to the item's core functionality."*
  - [x] *"I certify that this data is not used or transferred to determine creditworthiness or for lending purposes."*

### Official Privacy Policy URL (Compliant Direct Webpage)
Paste this exact URL into the **Privacy policy** field:
```text
https://irfanhaiderabir.github.io/UIU-Course-Evaluation-Tool/privacy-policy.html
```

> **Note on Enabling GitHub Pages**:
> 1. Go to your repository settings on GitHub: [Settings $\rightarrow$ Pages](https://github.com/iRfANhAiDeRABiR/UIU-Course-Evaluation-Tool/settings/pages).
> 2. Under **Build and deployment $\rightarrow$ Branch**, select `main` and folder `/(root)`.
> 3. Click **Save**. Within 1–2 minutes, your privacy policy page will be live at the URL above.

---

## 3. Graphic Assets

| Asset | File | Dimensions | Compliance Notes |
| :--- | :--- | :--- | :--- |
| **Store Icon** | `icon128.png` | `128 x 128 px` | Clean, transparent background PNG |
| **Promotional Banner** | `promo_banner.jpg` | `1280 x 800 px` (16:9) | 100% compliant: No star icons, no review claims |
| **Popup Screenshot** | User Capture | `1280 x 800 px` or `640 x 400 px` | Screenshot of the popup in Chrome |

---

## 4. Packaging the Extension (.ZIP)

Package only runtime files into `UIU-UCAM-Evaluation-Automator-v1.0.1.zip`:

### PowerShell Command:
```powershell
Compress-Archive -Path manifest.json, background.js, content.js, popup.html, popup.css, popup.js, icon16.png, icon48.png, icon128.png -DestinationPath "UIU-UCAM-Evaluation-Automator-v1.0.1.zip" -Force
```

---

## 5. Resubmission Checklist in Developer Dashboard

1. **Log in to Developer Dashboard**:
   Open [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole).
2. **Select your Item**:
   Click on **UIU UCAM Evaluation Automator**.
3. **Upload Updated Package**:
   - Go to **Package** tab.
   - Click **"Upload new package"** and select `UIU-UCAM-Evaluation-Automator-v1.0.1.zip`.
4. **Update Store Listing Graphics**:
   - In the **Store Listing** tab, ensure any rejected promotional images are replaced with `promo_banner.jpg`.
5. **Update Privacy Tab**:
   - Update the **Privacy policy** link to:
     `https://irfanhaiderabir.github.io/UIU-Course-Evaluation-Tool/privacy-policy.html`
   - Verify permissions justifications match the table in Section 2.
6. **Submit for Review**:
   - Click the blue **"Submit for review"** button at the top right.
   - In the submission comments (if asked), add:
     > *"Updated version 1.0.1: Removed all minified/obfuscated code, replaced promotional banners to ensure compliance with marketing guidelines, and provided a direct, dedicated GitHub Pages URL for the Privacy Policy."*
