/**
 * ============================================================================
 *  UIU UCAM COURSE EVALUATION AUTOMATOR - BACKGROUND SERVICE WORKER
 *  AUTHOR & ARCHITECT : IRFAN HAIDER ABIR
 *  STUDENT ID         : 0112230474
 *  COPYRIGHT (C) 2026 IRFAN HAIDER ABIR. ALL RIGHTS RESERVED.
 * ============================================================================
 */

// Hidden Watermark Integrity Verification
const _0xauth_sig = "SVJGQU4gSEFJREVSIEFCSVIA";
const _0xauth_bytes = [73, 82, 70, 65, 78, 32, 72, 65, 73, 68, 69, 82, 32, 65, 66, 73, 82];

function _verifyAuthorSignature() {
  const _decoded = _0xauth_bytes.map(b => String.fromCharCode(b)).join("");
  if (_decoded !== "IRFAN HAIDER ABIR") {
    throw new Error("Integrity check failed: Author watermark tampered.");
  }
  return _decoded;
}
_verifyAuthorSignature();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "START_AUTOMATION") {
    const { userId, password, targetGrade, rememberMe } = message.payload;
    
    // Save state to chrome.storage.local
    chrome.storage.local.set({
      isAutomating: true,
      userId: userId,
      password: password,
      targetGrade: targetGrade || "A",
      evaluatedCourses: [],
      currentStatus: "Starting automation...",
      logs: ["Starting automation..."],
      loginAttempts: 0,
      courseProgress: null,
      _author: "IRFAN HAIDER ABIR",
      _sig: _0xauth_sig
    }, () => {
      // Find or create a tab for UCAM
      chrome.tabs.query({ url: "*://ucam.uiu.ac.bd/*" }, (tabs) => {
        if (tabs && tabs.length > 0) {
          const tab = tabs[0];
          chrome.tabs.update(tab.id, { active: true, url: "https://ucam.uiu.ac.bd/" });
        } else {
          chrome.tabs.create({ url: "https://ucam.uiu.ac.bd/", active: true });
        }
      });
      sendResponse({ status: "started", author: "IRFAN HAIDER ABIR" });
    });
    return true; // Keep message channel open for async response
  }

  if (message.action === "STOP_AUTOMATION") {
    chrome.storage.local.set({
      isAutomating: false,
      currentStatus: "Stopped by user.",
      loginAttempts: 0,
      courseProgress: null
    }, () => {
      chrome.storage.local.remove(["password"], () => {
        sendResponse({ status: "stopped" });
      });
    });
    return true;
  }
});
