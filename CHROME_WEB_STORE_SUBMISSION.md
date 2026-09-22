# Chrome Web Store Publishing Guide & Submission Assets

This document contains all the exact details, copy-paste descriptions, permissions justifications, asset dimensions, and step-by-step instructions needed to publish the **UIU UCAM Course Evaluation Automator** on the **Google Chrome Web Store Developer Dashboard**.

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
*(Length: 120 characters - Well within the 132-character limit)*

### Detailed Description
```markdown
UIU UCAM Course Evaluation Automator is a modern, lightweight, and secure browser extension designed specifically for United International University (UIU) students. It automates the tedious end-of-trimester course evaluation process on the official UIU UCAM portal (https://ucam.uiu.ac.bd/) in seconds.

⚡ KEY FEATURES:
• One-Click Course Evaluation: Automatically evaluates all registered courses with a single click.
• Customizable Target Grade: Choose your desired expected grade (A, A-, B+, etc.) across all evaluation forms.
• Consistent Rating System: Answers all evaluation questions with positive ratings (Strongly Agree) automatically.
• Real-Time Course Progress Tracker: Live progress bar and counter (Course X of Y) in both the extension popup and on-page floating badge.
• Smart ASP.NET AJAX Error Detection: Instantly detects invalid passwords, account status issues, or server errors, halting automation safely.
• Interactive Bottom-Right Toast Alerts: Informs you of errors or completion without disruptive browser alerts.
• Dual Confetti Celebration Engine: Features animated celebration cannons and a completion summary dialog upon finishing all course evaluations.
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

## 2. Privacy & Single Purpose Justification

Chrome Web Store reviewers require precise justifications for all requested permissions and data declarations. Copy and paste the following:

### Single Purpose Description
```text
The sole purpose of this extension is to automate the repetitive course evaluation form filling and submission process for students on the United International University (UIU) UCAM portal.
```

### Permissions Justifications

| Permission | Justification (Paste into Dashboard) |
| :--- | :--- |
| **`storage`** | Used exclusively to save user UI preferences (selected expected grade, remember login switch) and live activity logs locally on the student's browser via chrome.storage.local. No data is ever transmitted to any external server. |
| **`activeTab`** | Used to interact with the active tab when the student starts automation from the popup to navigate to the evaluation form and submit responses. |
| **Host Permission (`https://ucam.uiu.ac.bd/*`)** | Required to automate login, navigation, and evaluation form submissions exclusively on the United International University student portal. The extension does not access or run on any other domain. |

### Data Usage Declarations (Checkboxes in Developer Dashboard)
- **Do you collect personal information?** $\rightarrow$ **No** (all data remains in `chrome.storage.local` on the user's device).
- **Do you collect authentication information?** $\rightarrow$ Select **Yes - Only to authenticate locally on the user's device**, and certify:
  - [x] *"I certify that this data is not sold or transferred to any third party."*
  - [x] *"I certify that this data is not used or transferred for purposes unrelated to the item's core functionality."*
  - [x] *"I certify that this data is not used or transferred to determine creditworthiness or for lending purposes."*

### Privacy Policy URL
Host your `PRIVACY_POLICY.md` on GitHub Pages or use the raw GitHub URL:
```text
https://github.com/iRfANhAiDeRABiR/UIU-Course-Evaluation-Tool/blob/main/PRIVACY_POLICY.md
```

---

## 3. Graphic Assets Requirements

The Chrome Web Store requires specific graphic assets:

| Asset | Dimensions | Requirement | Format |
| :--- | :--- | :--- | :--- |
| **Store Icon** | `128 x 128 px` | **Mandatory** | PNG (Already present: `icon128.png`) |
| **Screenshot 1** | `1280 x 800 px` or `640 x 400 px` | **Mandatory** (At least 1) | PNG / JPEG (Popup UI) |
| **Screenshot 2** | `1280 x 800 px` or `640 x 400 px` | Recommended | PNG / JPEG (Floating pill & evaluation in progress) |
| **Screenshot 3** | `1280 x 800 px` or `640 x 400 px` | Recommended | PNG / JPEG (Celebration modal & confetti) |
| **Small Promo Tile** | `440 x 280 px` | Optional (Recommended for search visibility) | PNG / JPEG |
| **Marquee Promo Tile** | `1400 x 560 px` | Optional (For featured placement) | PNG / JPEG |

---

## 4. How to Package the Extension (.ZIP)

Before uploading to Chrome Web Store, package only the runtime extension files (excluding `.git`, `README.md`, etc.).

### PowerShell Command to Create the Upload ZIP:
```powershell
Compress-Archive -Path manifest.json, background.js, content.js, popup.html, popup.css, popup.js, icon16.png, icon48.png, icon128.png -DestinationPath "UIU-UCAM-Evaluation-Automator-v1.0.0.zip" -Force
```

---

## 5. Step-by-Step Submission Process

1. **Open the Developer Dashboard**:
   Navigate to [https://chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole).
2. **Pay One-Time Developer Fee**:
   Google charges a one-time \$5 registration fee for new developer accounts.
3. **Add New Item**:
   Click **"Add new item"** and upload `UIU-UCAM-Evaluation-Automator-v1.0.0.zip`.
4. **Fill "Store Listing"**:
   Paste the Title, Short Description, Detailed Description, select Category (`Productivity`), and upload the Icon and Screenshots.
5. **Fill "Privacy" Tab**:
   - Paste the Single Purpose description.
   - Paste the justifications for `storage`, `activeTab`, and `https://ucam.uiu.ac.bd/*`.
   - Check the three data usage certification boxes.
   - Enter the Privacy Policy URL.
6. **Fill "Distribution" Tab**:
   - Visibility: **Public** (or **Unlisted** if you only want students with the direct link to install).
   - Regions: **All regions** (or Bangladesh).
7. **Submit for Review**:
   Click **"Submit for review"**. Typical approval time is **24 to 72 hours**.
