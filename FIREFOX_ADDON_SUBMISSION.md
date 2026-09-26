# Firefox Add-ons (AMO) Submission Guide

This document contains everything needed to submit the **UIU UCAM Course Evaluation Automator** to the **Mozilla Firefox Add-ons Developer Hub (AMO)** without any linting or validation errors.

---

## ⚡ Resolution of Mozilla Linter Errors

The previous two validation errors have been completely resolved:

1. **`Unsupported "/background/service_worker" manifest property used without "/background/scripts"`**:
   - **Resolved**: In Manifest V3, Firefox executes background tasks using event pages defined via `"background": { "scripts": ["background.js"] }`. This property has been configured properly in `firefox/manifest.json`.
2. **`The add-on ID is required in Manifest Version 3 and above`**:
   - **Resolved**: Added a permanent, unique Firefox Add-on ID under `browser_specific_settings.gecko.id`:
     `"id": "uiu-ucam-evaluator@irfanhaiderabir"`
3. **Mandatory Mozilla Data Consent**:
   - Added `"data_collection_permissions": { "required": ["none"] }` to comply with Mozilla's mandatory data transparency requirement.

> **Validation Status**: Passed official `addons-linter` with **0 Errors, 0 Warnings, 0 Notices**.

---

## 📦 Package to Upload

Use the dedicated Firefox package located in your project folder:
```text
UIU-UCAM-Evaluation-Automator-Firefox-v1.0.2.zip
```

---

## 📝 Store Listing Information for Mozilla AMO

### Add-on Name
```text
UIU UCAM Course Evaluation Automator
```

### Summary (Short Description)
```text
Automates course evaluations on UIU UCAM with smart grading, real-time progress tracking, and secure local authentication.
```

### Description
```markdown
UIU UCAM Course Evaluation Automator is a modern, lightweight, and secure browser extension designed specifically for United International University (UIU) students. It automates the tedious end-of-trimester course evaluation process on the official UIU UCAM portal (https://ucam.uiu.ac.bd/) in seconds.

⚡ KEY FEATURES:
• One-Click Course Evaluation: Automatically evaluates all registered courses with a single click.
• Customizable Target Grade: Choose your desired expected grade (A, A-, B+, etc.) across all evaluation forms.
• Consistent Rating System: Answers all evaluation questions with positive ratings automatically.
• Real-Time Course Progress Tracker: Live progress bar and counter (Course X of Y) in both the extension popup and on-page floating badge.
• Smart Inactive Evaluation Detection: Instantly detects when university evaluation is turned off ("Course evaluation is off now"), halting immediately without wasteful retries.
• Smart ASP.NET AJAX Error Detection: Instantly detects invalid passwords, account status issues, or server errors, halting automation safely.
• Interactive Bottom-Right Toast Alerts: Informs you of errors or completion without disruptive browser alerts.
• Completion Celebration Engine: Features celebration confetti and a completion summary dialog upon finishing all course evaluations.
• Live Activity Logs: Transparent real-time log box displaying every automated action step-by-step.

🔒 PRIVACY & SECURITY FIRST:
• 100% Client-Side: All processing occurs entirely inside your local browser.
• Zero Data Collection: The extension does NOT collect, track, transmit, or sell any personal data or browsing history.
• Safe Password Handling: Passwords used during the session are purged from memory immediately after authentication.
• Local Storage Only: If "Save Login Info" is enabled, credentials remain encrypted inside local browser storage on your device only.
• Scoped Exclusively to UCAM: The extension operates ONLY on https://ucam.uiu.ac.bd/* and has zero access to any other website.

📖 HOW TO USE:
1. Open the extension popup from your Firefox toolbar.
2. Enter your UIU Student ID and Password.
3. Select your Expected Grade.
4. Click "✨ Start Automation".
5. Sit back and watch your courses get evaluated with live progress tracking!

⚠️ DISCLAIMER:
This is an independent open-source tool built by Irfan Haider Abir (Student ID: 0112230474) to assist UIU students. It is not officially affiliated with or endorsed by United International University (UIU). All university trademarks and portal rights belong to UIU.
```

### Categories
- **Primary**: `Productivity`
- **Tags / Keywords**: `uiu`, `ucam`, `evaluation`, `bangladesh`, `automation`

### Privacy Policy URL
```text
https://irfanhaiderabir.github.io/UIU-Course-Evaluation-Tool/privacy-policy.html
```

### Support Website / Repository
```text
https://github.com/iRfANhAiDeRABiR/UIU-Course-Evaluation-Tool
```

---

## 🚀 Step-by-Step Submission Process

1. **Sign In to AMO Developer Hub**:
   - Go to [https://addons.mozilla.org/developers/addon/submit/distribution](https://addons.mozilla.org/developers/addon/submit/distribution).
   - Sign in with your Firefox Account.
2. **Distribution Option**:
   - Select **"On this site (recommended)"** so students can install it directly from the Firefox Add-ons marketplace.
3. **Upload Version**:
   - Upload `UIU-UCAM-Evaluation-Automator-Firefox-v1.0.2.zip`.
   - The Mozilla automated validator will run and show **"Validation passed with 0 errors"**.
4. **Source Code Inquiry**:
   - Mozilla asks: *"Do your source files need to be compiled, minified, or built?"*
   - Select **"No"** (All JavaScript files are clean, standard, uncompiled source code).
5. **Describe Add-on & Listing Details**:
   - Paste the Name, Summary, Description, and Categories from above.
   - Enter your Privacy Policy URL.
6. **Submit**:
   - Click **"Submit Version"**.
   - Mozilla Add-ons reviews are typically approved within **a few hours to 24 hours**.
