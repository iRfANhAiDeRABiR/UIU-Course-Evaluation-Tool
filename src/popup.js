/**
 * ============================================================================
 *  UIU UCAM COURSE EVALUATION AUTOMATOR - POPUP LOGIC
 *  AUTHOR & ARCHITECT : IRFAN HAIDER ABIR (iabir2230474)
 *  STUDENT ID         : 0112230474
 *  COPYRIGHT (C) 2026 IRFAN HAIDER ABIR. ALL RIGHTS RESERVED.
 * ============================================================================
 */

const _0x_author_sig = "SVJGQU4gSEFJREVSIEFCSVIA";
const _0x_author_bytes = [73, 82, 70, 65, 78, 32, 72, 65, 73, 68, 69, 82, 32, 65, 66, 73, 82];

function _verifyAuthSeal() {
  const author = _0x_author_bytes.map(b => String.fromCharCode(b)).join("");
  if (author !== "IRFAN HAIDER ABIR") {
    document.body.innerHTML = "<h1>Tampering Detected.</h1>";
    throw new Error("Tampered executable.");
  }
  return author;
}
_verifyAuthSeal();

document.addEventListener("DOMContentLoaded", async () => {
  const userIdInput = document.getElementById("user-id");
  const passwordInput = document.getElementById("password");
  const gradeSelect = document.getElementById("grade-select");
  const rememberMeCheckbox = document.getElementById("remember-me");
  const togglePasswordBtn = document.getElementById("toggle-password");
  const startBtn = document.getElementById("start-btn");
  const stopBtn = document.getElementById("stop-btn");
  const clearLogBtn = document.getElementById("clear-log-btn");
  const statusIndicator = document.getElementById("status-indicator");
  const logBox = document.getElementById("log-box");

  // 1. Load saved credentials & current state
  const data = await chrome.storage.local.get([
    "savedUserId",
    "savedPassword",
    "savedGrade",
    "rememberMe",
    "isAutomating",
    "logs",
    "currentStatus",
    "courseProgress"
  ]);

  if (data.rememberMe !== false) {
    if (data.savedUserId) userIdInput.value = data.savedUserId;
    if (data.savedPassword) passwordInput.value = data.savedPassword;
    if (data.savedGrade) gradeSelect.value = data.savedGrade;
    rememberMeCheckbox.checked = true;
  } else {
    rememberMeCheckbox.checked = false;
  }

  const isErr = data.currentStatus && (data.currentStatus.includes("❌") || data.currentStatus.toLowerCase().includes("failed") || data.currentStatus.toLowerCase().includes("error"));
  updateUIState(data.isAutomating, isErr);
  updateCourseProgressUI(data.courseProgress, data.isAutomating);
  renderLogs(data.logs || []);

  // 2. Toggle password visibility
  togglePasswordBtn.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePasswordBtn.textContent = "🙈";
    } else {
      passwordInput.type = "password";
      togglePasswordBtn.textContent = "👁️";
    }
  });

  // 3. Auto-save credentials handler when user toggles or edits
  const saveCredentialsIfEnabled = () => {
    if (rememberMeCheckbox.checked) {
      const uid = userIdInput.value.trim();
      const pwd = passwordInput.value.trim();
      const grd = gradeSelect.value;
      if (uid || pwd) {
        chrome.storage.local.set({
          savedUserId: uid,
          savedPassword: pwd,
          savedGrade: grd,
          rememberMe: true,
          _author: "IRFAN HAIDER ABIR (iabir2230474)"
        });
      }
    } else {
      chrome.storage.local.remove(["savedUserId", "savedPassword"]);
      chrome.storage.local.set({ rememberMe: false });
    }
  };

  rememberMeCheckbox.addEventListener("change", saveCredentialsIfEnabled);
  userIdInput.addEventListener("change", saveCredentialsIfEnabled);
  passwordInput.addEventListener("change", saveCredentialsIfEnabled);
  gradeSelect.addEventListener("change", saveCredentialsIfEnabled);

  // 4. Start Automation
  startBtn.addEventListener("click", () => {
    const userId = userIdInput.value.trim();
    const password = passwordInput.value.trim();
    const targetGrade = gradeSelect.value;

    if (!userId || !password) {
      showPopupToast("Please enter both Student ID and Password.", "error");
      return;
    }

    saveCredentialsIfEnabled();
    updateUIState(true);

    chrome.runtime.sendMessage(
      {
        action: "START_AUTOMATION",
        payload: {
          userId,
          password,
          targetGrade,
          author: "IRFAN HAIDER ABIR (iabir2230474)"
        }
      },
      (response) => {
        console.log("[Auth: iabir2230474] Start response:", response);
      }
    );
  });

  // 5. Stop Automation
  stopBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "STOP_AUTOMATION" }, (response) => {
      updateUIState(false);
      console.log("[Auth: iabir2230474] Stopped:", response);
    });
  });

  // 6. Clear Log
  clearLogBtn.addEventListener("click", () => {
    chrome.storage.local.set({ logs: [] }, () => {
      logBox.innerHTML = '<div class="log-entry info">[Log cleared]</div>';
    });
  });

  // 7. Listen for state & log updates
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local") {
      if (changes.isAutomating || changes.currentStatus) {
        chrome.storage.local.get(["isAutomating", "currentStatus"], (st) => {
          const isErr = st.currentStatus && (st.currentStatus.includes("❌") || st.currentStatus.toLowerCase().includes("failed"));
          updateUIState(st.isAutomating, isErr);
          if (isErr && changes.currentStatus && changes.currentStatus.newValue) {
            const cleanMsg = changes.currentStatus.newValue.replace(/^❌\s*(Login Failed:\s*)?/, "");
            showPopupToast(cleanMsg, "error");
          }
        });
      }
      if (changes.courseProgress || changes.isAutomating) {
        chrome.storage.local.get(["courseProgress", "isAutomating"], (st) => {
          updateCourseProgressUI(st.courseProgress, st.isAutomating);
        });
      }
      if (changes.logs) {
        renderLogs(changes.logs.newValue || []);
      }
    }
  });

  function showPopupToast(message, type = "error") {
    const existing = document.getElementById("popup-toast-banner");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "popup-toast-banner";
    toast.style.cssText = `
      position: fixed;
      top: 14px;
      left: 14px;
      right: 14px;
      background: ${type === "error" ? "#fee2e2" : "#e0f2fe"};
      color: ${type === "error" ? "#991b1b" : "#0369a1"};
      border: 1px solid ${type === "error" ? "#fca5a5" : "#7dd3fc"};
      border-radius: 12px;
      padding: 10px 14px;
      font-size: 12.5px;
      font-weight: 600;
      box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    `;

    const icon = document.createElement("span");
    icon.textContent = type === "error" ? "⚠️" : "⚡";

    const text = document.createElement("span");
    text.style.flex = "1";
    text.textContent = message;

    const close = document.createElement("button");
    close.textContent = "✕";
    close.style.cssText = "background:transparent;border:none;cursor:pointer;color:inherit;font-size:13px;padding:0 4px;line-height:1;";
    close.addEventListener("click", () => toast.remove());

    toast.appendChild(icon);
    toast.appendChild(text);
    toast.appendChild(close);
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-8px)";
        setTimeout(() => toast.remove(), 300);
      }
    }, 5500);
  }

  function updateUIState(isAutomating, isError = false) {
    if (isError) {
      statusIndicator.textContent = "Error";
      statusIndicator.className = "status error";
      startBtn.style.display = "flex";
      stopBtn.style.display = "none";
      userIdInput.disabled = false;
      passwordInput.disabled = false;
      gradeSelect.disabled = false;
    } else if (isAutomating) {
      statusIndicator.textContent = "Running";
      statusIndicator.className = "status running";
      startBtn.style.display = "none";
      stopBtn.style.display = "flex";
      userIdInput.disabled = true;
      passwordInput.disabled = true;
      gradeSelect.disabled = true;
    } else {
      statusIndicator.textContent = "Idle";
      statusIndicator.className = "status idle";
      startBtn.style.display = "flex";
      stopBtn.style.display = "none";
      userIdInput.disabled = false;
      passwordInput.disabled = false;
      gradeSelect.disabled = false;
    }
  }

  function updateCourseProgressUI(progress, isAutomating) {
    const card = document.getElementById("course-progress-card");
    if (!card) return;

    if (progress && progress.total > 0 && isAutomating) {
      card.style.display = "block";
      const counter = document.getElementById("progress-counter");
      const title = document.getElementById("current-course-title");
      const barFill = document.getElementById("progress-bar-fill");
      const percent = document.getElementById("progress-percent");

      if (counter) counter.textContent = `Course ${progress.current} of ${progress.total}`;
      if (title) {
        title.textContent = progress.courseName || "Evaluating Course...";
        title.title = progress.courseName || "";
      }
      const pct = Math.min(100, Math.max(0, progress.percent || 0));
      if (barFill) barFill.style.width = `${pct}%`;
      if (percent) percent.textContent = `${pct}% Completed`;
    } else if (progress && progress.percent === 100) {
      card.style.display = "block";
      const counter = document.getElementById("progress-counter");
      const title = document.getElementById("current-course-title");
      const barFill = document.getElementById("progress-bar-fill");
      const percent = document.getElementById("progress-percent");

      if (counter) counter.textContent = `All ${progress.total} Evaluated`;
      if (title) title.textContent = "🎉 All courses evaluated successfully!";
      if (barFill) barFill.style.width = "100%";
      if (percent) percent.textContent = "100% Completed";
    } else {
      card.style.display = "none";
    }
  }

  function renderLogs(logs) {
    if (!logs || logs.length === 0) return;
    logBox.innerHTML = "";
    logs.forEach((log) => {
      const entry = document.createElement("div");
      const isErr = log.includes("❌") || log.toLowerCase().includes("failed") || log.toLowerCase().includes("error");
      entry.className = isErr ? "log-entry error" : "log-entry";
      entry.textContent = log;
      logBox.appendChild(entry);
    });
    logBox.scrollTop = logBox.scrollHeight;
  }
});
