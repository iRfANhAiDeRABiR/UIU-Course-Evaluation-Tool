/**
 * ============================================================================
 *  UIU UCAM COURSE EVALUATION AUTOMATOR - POPUP LOGIC
 *  AUTHOR & ARCHITECT : IRFAN HAIDER ABIR (iabir2230474)
 *  STUDENT ID         : 0112230474
 *  COPYRIGHT (C) 2026 IRFAN HAIDER ABIR. ALL RIGHTS RESERVED.
 * ============================================================================
 */

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
    "courseProgress",
    "detectedCourses",
    "skippedCourses"
  ]);

  let detectedCourses = data.detectedCourses || [];
  let skippedCourses = data.skippedCourses || [];

  const checklistToggleBtn = document.getElementById("checklist-toggle-btn");
  const checklistCollapse = document.getElementById("checklist-collapse");
  const checklistChevron = document.getElementById("checklist-chevron");
  const checklistCounterBadge = document.getElementById("checklist-counter-badge");
  const btnSelectAllCourses = document.getElementById("btn-select-all-courses");
  const btnDeselectAllCourses = document.getElementById("btn-deselect-all-courses");
  const courseListItems = document.getElementById("course-list-items");

  function renderCourseChecklist(courses, skipped) {
    if (!courseListItems) return;
    courseListItems.innerHTML = "";

    if (!courses || courses.length === 0) {
      if (checklistCounterBadge) {
        checklistCounterBadge.textContent = "Auto";
        checklistCounterBadge.title = "Courses will be detected on UCAM";
      }
      courseListItems.innerHTML = `
        <div class="course-empty-hint">
          <span>💡</span>
          <p>Enrolled courses will appear here once detected on UCAM, or you can skip courses on-the-fly using the live on-page badge.</p>
        </div>
      `;
      return;
    }

    const activeCount = courses.filter((c) => !skipped.includes(c.id)).length;
    if (checklistCounterBadge) {
      checklistCounterBadge.textContent = `${activeCount}/${courses.length}`;
      checklistCounterBadge.title = `${activeCount} out of ${courses.length} courses selected for automation`;
    }

    courses.forEach((c) => {
      const isSkipped = skipped.includes(c.id);
      const label = document.createElement("label");
      label.className = isSkipped ? "course-item is-skipped" : "course-item";
      label.title = isSkipped ? "Skipped (Will be left for manual review)" : "Included in automation";

      const leftDiv = document.createElement("div");
      leftDiv.className = "course-item-left";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = !isSkipped;
      checkbox.dataset.courseId = c.id;

      const nameSpan = document.createElement("span");
      nameSpan.className = "course-item-name";
      nameSpan.textContent = c.name;

      leftDiv.appendChild(checkbox);
      leftDiv.appendChild(nameSpan);

      const badgeSpan = document.createElement("span");
      badgeSpan.className = `course-badge-pill ${isSkipped ? "skip" : "auto"}`;
      badgeSpan.textContent = isSkipped ? "Skip" : "Automate";

      label.appendChild(leftDiv);
      label.appendChild(badgeSpan);

      checkbox.addEventListener("change", async () => {
        let curSkipped = (await chrome.storage.local.get("skippedCourses")).skippedCourses || [];
        if (checkbox.checked) {
          curSkipped = curSkipped.filter((id) => id !== c.id);
        } else {
          if (!curSkipped.includes(c.id)) curSkipped.push(c.id);
        }
        skippedCourses = curSkipped;
        await chrome.storage.local.set({ skippedCourses: curSkipped });
        renderCourseChecklist(detectedCourses, skippedCourses);
      });

      courseListItems.appendChild(label);
    });
  }

  renderCourseChecklist(detectedCourses, skippedCourses);

  // Toggle Collapse
  if (checklistToggleBtn) {
    checklistToggleBtn.addEventListener("click", () => {
      if (checklistCollapse) checklistCollapse.classList.toggle("is-collapsed");
      if (checklistChevron) checklistChevron.classList.toggle("collapsed");
    });
  }

  // Quick action: Select All
  if (btnSelectAllCourses) {
    btnSelectAllCourses.addEventListener("click", async () => {
      skippedCourses = [];
      await chrome.storage.local.set({ skippedCourses: [] });
      renderCourseChecklist(detectedCourses, skippedCourses);
    });
  }

  // Quick action: Clear All (Skip All)
  if (btnDeselectAllCourses) {
    btnDeselectAllCourses.addEventListener("click", async () => {
      skippedCourses = detectedCourses.map((c) => c.id);
      await chrome.storage.local.set({ skippedCourses });
      renderCourseChecklist(detectedCourses, skippedCourses);
    });
  }

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
          rememberMe: true
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

  // 3.5 Detect if active tab is already on an authenticated UCAM page
  let isSessionActive = false;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0] && tabs[0].url) {
      const url = tabs[0].url.toLowerCase();
      if (url.includes("ucam.uiu.ac.bd") && !url.includes("login.aspx")) {
        isSessionActive = true;
        const banner = document.getElementById("session-banner");
        if (banner) banner.style.display = "block";
        const credentialsSection = document.getElementById("credentials-section");
        if (credentialsSection) credentialsSection.style.display = "none";
        startBtn.innerHTML = `
          <span class="btn-sparkle">⚡</span>
          <span>One-Click Evaluate</span>
          <span class="btn-arrow">→</span>
        `;

        // If on UCAM tab, try to fetch live course list if on Evaluation Form
        chrome.tabs.sendMessage(tabs[0].id, { action: "GET_COURSES" }, (res) => {
          if (!chrome.runtime.lastError && res && res.courses && res.courses.length > 0) {
            detectedCourses = res.courses;
            renderCourseChecklist(detectedCourses, skippedCourses);
          }
        });
      }
    }
  });

  // 4. Start Automation
  startBtn.addEventListener("click", () => {
    const userId = userIdInput.value.trim();
    const password = passwordInput.value.trim();
    const targetGrade = gradeSelect.value;

    // Credentials are only required if user is not already logged in on UCAM
    if (!isSessionActive && (!userId || !password)) {
      showPopupToast("Please enter both Student ID and Password, or open UCAM in your browser.", "error");
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
          isSessionActive
        }
      },
      (response) => {
        console.log("Automation started:", response);
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
      if (changes.detectedCourses || changes.skippedCourses) {
        chrome.storage.local.get(["detectedCourses", "skippedCourses"], (st) => {
          detectedCourses = st.detectedCourses || [];
          skippedCourses = st.skippedCourses || [];
          renderCourseChecklist(detectedCourses, skippedCourses);
        });
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
