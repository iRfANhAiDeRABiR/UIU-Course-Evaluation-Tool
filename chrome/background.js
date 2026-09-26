/**
 * UIU UCAM Course Evaluation Automator - Background Service Worker
 * Author: Irfan Haider Abir (Student ID: 0112230474)
 * Copyright (C) 2026 Irfan Haider Abir. All rights reserved.
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "START_AUTOMATION") {
    const { userId, password, targetGrade, isSessionActive } = message.payload || {};

    // Save state to chrome.storage.local
    chrome.storage.local.set({
      isAutomating: true,
      userId: userId || "",
      password: password || "",
      targetGrade: targetGrade || "A",
      evaluatedCourses: [],
      currentStatus: "Starting automation...",
      logs: ["Starting automation..."],
      loginAttempts: 0,
      courseProgress: null
    }, () => {
      // If user is already on an active UCAM session, preserve the current tab and don't navigate to login
      chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
        const activeTab = activeTabs && activeTabs[0];
        const isActiveUcam = activeTab && activeTab.url && activeTab.url.toLowerCase().includes("ucam.uiu.ac.bd") && !activeTab.url.toLowerCase().includes("login.aspx");

        if (isSessionActive || isActiveUcam) {
          if (activeTab) {
            chrome.tabs.sendMessage(activeTab.id, { action: "TRIGGER_AUTOMATION" }, () => {
              if (chrome.runtime.lastError) {
                // Content script will also trigger via chrome.storage.onChanged
              }
            });
          }
        } else {
          // Find or create a tab for UCAM
          chrome.tabs.query({ url: "*://ucam.uiu.ac.bd/*" }, (tabs) => {
            if (tabs && tabs.length > 0) {
              const tab = tabs[0];
              chrome.tabs.update(tab.id, { active: true, url: "https://ucam.uiu.ac.bd/" });
            } else {
              chrome.tabs.create({ url: "https://ucam.uiu.ac.bd/", active: true });
            }
          });
        }
      });
      sendResponse({ status: "started" });
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
