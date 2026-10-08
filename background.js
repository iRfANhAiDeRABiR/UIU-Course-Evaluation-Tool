/**
 * UIU UCAM Course Evaluation Automator - Background Service Worker
 * Author: Irfan Haider Abir (Student ID: 0112230474)
 * Copyright (C) 2026 Irfan Haider Abir. All rights reserved.
 */

/**
 * ============================================================================
 *  GOOGLE ANALYTICS 4 (GA4) - MANIFEST V3 INTEGRATION
 *  Measurement ID: G-C4N17838KF
 * ============================================================================
 */
const GA_MEASUREMENT_ID = "G-C4N17838KF";
const GA_API_SECRET = ""; // Optional: Add GA4 Measurement Protocol API Secret if desired
const GA_MP_ENDPOINT = "https://www.google-analytics.com/mp/collect";
const GA_COLLECT_ENDPOINT = "https://www.google-analytics.com/g/collect";
const SESSION_EXPIRATION_IN_MIN = 30;
const DEFAULT_ENGAGEMENT_TIME_IN_MSEC = 100;

function generateRandomId() {
  const digits = "123456789".split("");
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += digits[Math.floor(Math.random() * 9)];
  }
  return result;
}

async function getOrCreateClientId() {
  const result = await chrome.storage.local.get("gaClientId");
  let clientId = result.gaClientId;
  if (!clientId) {
    const unixTimestampSeconds = Math.floor(Date.now() / 1000);
    clientId = `${generateRandomId()}.${unixTimestampSeconds}`;
    await chrome.storage.local.set({ gaClientId: clientId });
  }
  return clientId;
}

async function getOrCreateSessionId() {
  let { gaSessionData } = await chrome.storage.local.get("gaSessionData");
  const currentTimeInMs = Date.now();
  if (gaSessionData && gaSessionData.timestamp) {
    const durationInMin = (currentTimeInMs - Number(gaSessionData.timestamp)) / 60000;
    if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
      gaSessionData = null;
    } else {
      gaSessionData.timestamp = currentTimeInMs.toString();
      await chrome.storage.local.set({ gaSessionData });
    }
  }
  if (!gaSessionData) {
    const sessionId = Math.floor(currentTimeInMs / 1000).toString();
    gaSessionData = {
      session_id: sessionId,
      timestamp: currentTimeInMs.toString()
    };
    await chrome.storage.local.set({ gaSessionData });
  }
  return gaSessionData.session_id;
}

async function sendAnalyticsEvent(eventName, eventParams = {}) {
  try {
    const clientId = await getOrCreateClientId();
    const sessionId = await getOrCreateSessionId();

    if (GA_API_SECRET) {
      await fetch(
        `${GA_MP_ENDPOINT}?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`,
        {
          method: "POST",
          body: JSON.stringify({
            client_id: clientId,
            events: [
              {
                name: eventName,
                params: {
                  session_id: sessionId,
                  engagement_time_msec: DEFAULT_ENGAGEMENT_TIME_IN_MSEC,
                  ...eventParams
                }
              }
            ]
          })
        }
      );
    } else {
      const params = new URLSearchParams({
        v: "2",
        tid: GA_MEASUREMENT_ID,
        cid: clientId,
        sid: sessionId,
        sct: "1",
        seg: "1",
        _et: String(DEFAULT_ENGAGEMENT_TIME_IN_MSEC),
        en: eventName,
        dl: eventParams.page_location || "https://irfanhaiderabir.github.io/UIU-Course-Evaluation-Tool-Chrome-Extension-/",
        dt: eventParams.page_title || "UIU UCAM Evaluation Automator"
      });

      Object.entries(eventParams).forEach(([key, val]) => {
        if (key === "page_location" || key === "page_title") return;
        if (typeof val === "number") {
          params.append(`epn.${key}`, String(val));
        } else if (val !== undefined && val !== null) {
          params.append(`ep.${key}`, String(val));
        }
      });

      await fetch(`${GA_COLLECT_ENDPOINT}?${params.toString()}`, {
        method: "POST",
        mode: "no-cors"
      });
    }
  } catch (err) {
    // Fail silently so analytics never interrupts extension functionality
  }
}

chrome.runtime.onInstalled.addListener((details) => {
  sendAnalyticsEvent("extension_installed", {
    reason: details.reason || "install",
    version: chrome.runtime.getManifest().version
  });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.currentStatus) {
    const newStatus = changes.currentStatus.newValue || "";
    if (newStatus === "All courses evaluated!") {
      chrome.storage.local.get(["evaluatedCourses", "targetGrade"], (st) => {
        sendAnalyticsEvent("automation_complete", {
          courses_evaluated: (st.evaluatedCourses || []).length,
          target_grade: st.targetGrade || "A"
        });
      });
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "TRACK_EVENT") {
    sendAnalyticsEvent(message.eventName || "extension_event", message.eventParams || {});
    sendResponse({ status: "tracked" });
    return true;
  }

  if (message.action === "START_AUTOMATION") {
    const { userId, password, targetGrade, isSessionActive } = message.payload || {};

    sendAnalyticsEvent("automation_start", {
      target_grade: targetGrade || "A",
      session_mode: isSessionActive ? "active_session" : "credentials"
    });

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
    sendAnalyticsEvent("automation_stop");

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

