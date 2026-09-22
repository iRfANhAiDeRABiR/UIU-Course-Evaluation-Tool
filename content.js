/**
 * ============================================================================
 *  UIU UCAM COURSE EVALUATION AUTOMATOR - CONTENT SCRIPT
 *  AUTHOR & ARCHITECT : IRFAN HAIDER ABIR (iabir2230474)
 *  STUDENT ID         : 0112230474
 *  COPYRIGHT (C) 2026 IRFAN HAIDER ABIR. ALL RIGHTS RESERVED.
 * ============================================================================
 */

// Hidden Watermark Layers
const _0xwatermark_b64 = "SVJGQU4gSEFJREVSIEFCSVIA";
const _0xauthor_tokens = [0x49, 0x52, 0x46, 0x41, 0x4e, 0x20, 0x48, 0x41, 0x49, 0x44, 0x45, 0x52, 0x20, 0x41, 0x42, 0x49, 0x52];

function _authGuard() {
  const _id = _0xauthor_tokens.map(c => String.fromCharCode(c)).join("");
  if (_id !== "IRFAN HAIDER ABIR") {
    console.error("Critical: Signature validation failure.");
    return false;
  }
  return true;
}
_authGuard();

// Override window.alert and window.confirm in page context to prevent modal blocking
(function injectModalOverrides() {
  const script = document.createElement("script");
  script.textContent = `
    /* Developed by IRFAN HAIDER ABIR (iabir2230474) */
    window.__CREATOR__ = "IRFAN HAIDER ABIR (iabir2230474)";
    window.alert = function(msg) {
      console.log("[UCAM Automator by iabir2230474] Auto-accepted alert:", msg);
      try {
        window.dispatchEvent(new CustomEvent("__ucam_page_alert__", { detail: String(msg || "") }));
      } catch (e) {}
      return true;
    };
    window.confirm = function(msg) {
      console.log("[UCAM Automator by iabir2230474] Auto-accepted confirm:", msg);
      return true;
    };
  `;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
})();

let lastPageAlertMessage = null;
window.addEventListener("__ucam_page_alert__", (e) => {
  if (e && e.detail) {
    lastPageAlertMessage = String(e.detail);
  }
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function appendLog(message, isError = false) {
  console.log(`[UCAM Automator - iabir2230474] ${message}`);
  const data = await chrome.storage.local.get("logs");
  const logs = data.logs || [];
  const timestamp = new Date().toLocaleTimeString();
  const logPrefix = isError ? "❌ " : "";
  logs.push(`[${timestamp}] ${logPrefix}${message}`);
  if (logs.length > 60) logs.shift();
  await chrome.storage.local.set({ logs: logs, currentStatus: message });
}

// Floating UI Badge to show real-time progress & error alerts on UCAM portal
function showFloatingBadge(text, isError = false) {
  let badge = document.getElementById("ucam-automator-badge");
  if (!badge) {
    badge = document.createElement("div");
    badge.id = "ucam-automator-badge";
    badge.setAttribute("data-creator", "IRFAN HAIDER ABIR (iabir2230474)");
    document.body.appendChild(badge);
  }

  const bgGradient = isError
    ? "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)"
    : "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)";

  const icon = isError ? "⚠️" : "⚡";

  badge.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${bgGradient};
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    z-index: 999999;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
  `;

  badge.replaceChildren();
  const iconSpan = document.createElement("span");
  iconSpan.textContent = `${icon} UCAM Automator:`;
  const textSpan = document.createElement("span");
  textSpan.textContent = text;
  badge.appendChild(iconSpan);
  badge.appendChild(textSpan);
}

function removeFloatingBadge() {
  const badge = document.getElementById("ucam-automator-badge");
  if (badge) badge.remove();
}

// =========================================================================
// Modern Toast Notification Component
// =========================================================================
function showToastNotification(message, title = "Notification", type = "error", duration = 6500) {
  removeFloatingBadge();

  let container = document.getElementById("ucam-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "ucam-toast-container";
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999999;
      display: flex;
      flex-direction: column-reverse;
      gap: 12px;
      pointer-events: none;
    `;
    document.body.appendChild(container);

    if (!document.getElementById("ucam-toast-animations")) {
      const style = document.createElement("style");
      style.id = "ucam-toast-animations";
      style.textContent = `
        @keyframes ucamToastSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ucamToastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  const toast = document.createElement("div");
  toast.className = `ucam-toast ucam-toast-${type}`;
  toast.style.cssText = `
    position: relative;
    pointer-events: auto;
    background: #ffffff;
    color: #0f172a;
    border-radius: 16px;
    padding: 16px 20px;
    min-width: 320px;
    max-width: 440px;
    box-shadow: 0 20px 30px -8px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.06);
    border-left: 5px solid ${type === "error" ? "#ef4444" : "#ff6a00"};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    animation: ucamToastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
  `;

  const iconBubble = document.createElement("div");
  iconBubble.style.cssText = `
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: ${type === "error" ? "#fee2e2" : "#ffedd5"};
    color: ${type === "error" ? "#dc2626" : "#ea580c"};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  `;
  iconBubble.textContent = type === "error" ? "⚠️" : "⚡";

  const contentCol = document.createElement("div");
  contentCol.style.cssText = "flex: 1; min-width: 0;";

  const titleEl = document.createElement("div");
  titleEl.style.cssText = `
    font-size: 14px;
    font-weight: 700;
    color: ${type === "error" ? "#b91c1c" : "#c2410c"};
    margin-bottom: 3px;
    letter-spacing: -0.2px;
  `;
  titleEl.textContent = title;

  const messageEl = document.createElement("div");
  messageEl.style.cssText = "font-size: 13.5px; font-weight: 500; color: #334155; line-height: 1.45;";
  messageEl.textContent = message;

  contentCol.appendChild(titleEl);
  contentCol.appendChild(messageEl);

  const closeBtn = document.createElement("button");
  closeBtn.setAttribute("type", "button");
  closeBtn.setAttribute("aria-label", "Close notification");
  closeBtn.textContent = "✕";
  closeBtn.style.cssText = `
    background: transparent;
    border: none;
    font-size: 15px;
    color: #94a3b8;
    cursor: pointer;
    padding: 2px 6px;
    line-height: 1;
    border-radius: 6px;
    transition: all 0.15s ease;
  `;
  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.color = "#0f172a";
    closeBtn.style.background = "#f1f5f9";
  });
  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.color = "#94a3b8";
    closeBtn.style.background = "transparent";
  });

  const progressBar = document.createElement("div");
  progressBar.style.cssText = `
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3.5px;
    background: ${type === "error" ? "#ef4444" : "#ff6a00"};
    animation: ucamToastProgress ${duration}ms linear forwards;
  `;

  toast.appendChild(iconBubble);
  toast.appendChild(contentCol);
  toast.appendChild(closeBtn);
  toast.appendChild(progressBar);

  container.appendChild(toast);

  let isDismissed = false;
  const dismiss = () => {
    if (isDismissed) return;
    isDismissed = true;
    toast.style.transition = "all 0.3s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(16px) scale(0.96)";
    setTimeout(() => {
      toast.remove();
      if (container && container.children.length === 0) {
        container.remove();
      }
    }, 300);
  };

  closeBtn.addEventListener("click", dismiss);
  const timer = setTimeout(dismiss, duration);

  toast.addEventListener("mouseenter", () => {
    clearTimeout(timer);
    progressBar.style.animationPlayState = "paused";
  });
  toast.addEventListener("mouseleave", () => {
    setTimeout(dismiss, 2500);
  });
}

// Full-screen Dual-Side Confetti Cannons Celebration Engine
function triggerDualSideCelebration(statusText = "Completed!") {
  removeFloatingBadge();

  // Create full-screen celebration canvas
  const canvas = document.createElement("canvas");
  canvas.id = "ucam-celebration-canvas";
  canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999999;";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", handleResize);

  const colors = [
    "#ff6a00", "#ff3d00", "#ee0979", "#ff007f",
    "#00e676", "#2979ff", "#ffd600", "#ffeb3b",
    "#7c4dff", "#00e5ff", "#e040fb", "#ffffff"
  ];

  const particles = [];
  let isShooting = true;

  function createParticle(fromLeft) {
    // Left cannon shoots at 38°-75° (towards center-right)
    // Right cannon shoots at 105°-142° (towards center-left)
    const angleDeg = fromLeft
      ? (Math.random() * 37 + 38)
      : (Math.random() * 37 + 105);

    const angleRad = angleDeg * (Math.PI / 180);
    const speed = Math.random() * 22 + 18;

    return {
      x: fromLeft ? 0 : canvas.width,
      y: canvas.height * 0.88,
      vx: Math.cos(angleRad) * speed, // Positive for left cannon, negative for right cannon
      vy: -Math.sin(angleRad) * speed,
      size: Math.random() * 9 + 6,
      aspect: Math.random() * 1.5 + 1.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 18,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.12 + 0.05,
      opacity: 1,
      decay: Math.random() * 0.005 + 0.003,
      shape: Math.random() > 0.3 ? "rect" : "circle"
    };
  }

  // Continuous cannon burst from both sides (left & right)
  const emitter = setInterval(() => {
    if (!isShooting) return;
    for (let i = 0; i < 10; i++) {
      particles.push(createParticle(true));  // Left side cannon
      particles.push(createParticle(false)); // Right side cannon
    }
  }, 35);

  // Stop shooting cannons after 2.5 seconds, let active particles fade out
  setTimeout(() => {
    isShooting = false;
    clearInterval(emitter);
    if (canvas) {
      canvas.style.transition = "opacity 0.4s ease";
      canvas.style.opacity = "0";
      setTimeout(() => {
        window.removeEventListener("resize", handleResize);
        if (canvas && canvas.parentNode) canvas.remove();
      }, 400);
    }
  }, 2500);

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.48;   // Gravity
      p.vx *= 0.982;  // Air drag
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.opacity -= p.decay;

      if (p.opacity <= 0 || p.y > canvas.height + 60) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      // 3D paper flip effect using cosine
      const scaleY = Math.cos(p.wobble);
      ctx.scale(1, scaleY);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;

      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * p.aspect);
      }
      ctx.restore();
    }

    if (particles.length > 0 || isShooting) {
      requestAnimationFrame(render);
    } else {
      window.removeEventListener("resize", handleResize);
      canvas.remove();
    }
  }

  requestAnimationFrame(render);

  // Show congratulatory celebration modal
  showCelebrationModal(statusText);
}

// Celebration Modal Popup Dialog
function showCelebrationModal(statusText) {
  const existing = document.getElementById("ucam-celebration-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "ucam-celebration-modal";
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999998;
    animation: ucamFadeIn 0.3s ease;
  `;

  modal.innerHTML = `
    <div style="
      background: #ffffff;
      border-radius: 22px;
      padding: 32px 36px;
      max-width: 440px;
      width: 90%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: ucamPopIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 1px solid rgba(255, 106, 0, 0.2);
    ">
      <div style="font-size: 56px; margin-bottom: 12px; animation: ucamBounce 1.2s infinite alternate;">🎉</div>
      <h2 style="color: #0f172a; margin: 0 0 8px 0; font-size: 23px; font-weight: 800; letter-spacing: -0.3px;">Evaluation Completed!</h2>
      <p style="color: #475569; font-size: 14px; margin: 0 0 16px 0; line-height: 1.55;">
        All your courses have been evaluated successfully with <strong>Grade A</strong> and <strong>Strongly Agree</strong> ratings!
      </p>
      <div style="
        background: #f0fdf4;
        border: 1.5px solid #86efac;
        border-radius: 12px;
        padding: 10px 14px;
        margin-bottom: 22px;
        font-size: 13.5px;
        color: #15803d;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      ">
        <span>Status:</span> <span id="ucam-celebration-status-val"></span> <span>✅</span>
      </div>
      <div>
        <button id="ucam-close-modal-btn" style="
          background: linear-gradient(135deg, #ff6a00 0%, #ff4500 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 12px 32px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(255, 106, 0, 0.4);
          transition: all 0.2s ease;
        ">
          Awesome, Close! ✨
        </button>
      </div>
      <div style="margin-top: 16px; font-size: 11.5px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 10px;">
        ⚡ Developed by <strong>iabir2230474</strong>
      </div>
    </div>
    <style>
      @keyframes ucamFadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes ucamPopIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      @keyframes ucamBounce { from { transform: translateY(0); } to { transform: translateY(-8px); } }
    </style>
  `;

  document.body.appendChild(modal);

  const statusVal = modal.querySelector("#ucam-celebration-status-val");
  if (statusVal) {
    statusVal.textContent = statusText || "Completed!";
  }

  const closeBtn = document.getElementById("ucam-close-modal-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => modal.remove());
    closeBtn.addEventListener("mouseenter", () => {
      closeBtn.style.transform = "translateY(-2px)";
      closeBtn.style.boxShadow = "0 8px 22px rgba(255, 106, 0, 0.5)";
    });
    closeBtn.addEventListener("mouseleave", () => {
      closeBtn.style.transform = "translateY(0)";
      closeBtn.style.boxShadow = "0 6px 18px rgba(255, 106, 0, 0.4)";
    });
  }
}

// =========================================================================
// Login Error Detection & Handling Helpers
// =========================================================================
function getLoginPageError() {
  // 1. Check if an alert was captured
  if (lastPageAlertMessage) {
    const alertLower = lastPageAlertMessage.toLowerCase();
    if (alertLower.includes("invalid password") || (alertLower.includes("try again") && alertLower.includes("password"))) {
      return { type: "invalid_password", title: "Invalid Password", message: "Invalid password, try again." };
    }
    if (alertLower.includes("an unexpected error occurred") || alertLower.includes("please contact support") || alertLower.includes("unexpected error")) {
      return { type: "unexpected_error", title: "Unexpected Error", message: "An unexpected error occurred. Please contact support." };
    }
    if (alertLower.includes("blocked") || alertLower.includes("disabled")) {
      return { type: "blocked", title: "Account Blocked", message: "Account is blocked or disabled. Contact UIU admin." };
    }
    if (alertLower.includes("incorrect password") || alertLower.includes("invalid student id") || alertLower.includes("login failed")) {
      return { type: "incorrect_password", title: "Login Failed", message: "Incorrect Student ID or Password. Please try again." };
    }
  }

  // 2. Check DOM text
  const form = document.querySelector("form");
  let rawText = "";
  if (form) {
    rawText = form.innerText || form.textContent || "";
  } else if (document.body) {
    rawText = document.body.innerText || document.body.textContent || "";
  }

  // Strip text from our own UI elements to prevent false positives
  const badge = document.getElementById("ucam-automator-badge");
  if (badge && badge.innerText) rawText = rawText.replace(badge.innerText, "");
  const toastContainer = document.getElementById("ucam-toast-container");
  if (toastContainer && toastContainer.innerText) rawText = rawText.replace(toastContainer.innerText, "");
  const modal = document.getElementById("ucam-celebration-modal");
  if (modal && modal.innerText) rawText = rawText.replace(modal.innerText, "");

  const lower = rawText.toLowerCase();

  if (lower.includes("invalid password") || (lower.includes("try again") && lower.includes("password"))) {
    return { type: "invalid_password", title: "Invalid Password", message: "Invalid password, try again." };
  }
  if (lower.includes("an unexpected error occurred") || lower.includes("please contact support") || (lower.includes("unexpected error") && lower.includes("contact support"))) {
    return { type: "unexpected_error", title: "Unexpected Error", message: "An unexpected error occurred. Please contact support." };
  }
  if (lower.includes("user is blocked") || lower.includes("account is disabled") || (lower.includes("account") && lower.includes("blocked"))) {
    return { type: "blocked", title: "Account Blocked", message: "Account is blocked or disabled. Contact UIU admin." };
  }
  if (lower.includes("incorrect password") || lower.includes("invalid student id")) {
    return { type: "incorrect_password", title: "Login Failed", message: "Incorrect Student ID or Password. Please try again." };
  }

  return null;
}

async function handleLoginError(err) {
  const errorMsg = `❌ Login Failed: ${err.message}`;
  console.error(`[UCAM Automator] Login error detected: ${err.message}`);

  // 1. Immediately remove the running floating badge
  removeFloatingBadge();

  // 2. Append error to activity logs
  await appendLog(errorMsg, true);

  // 3. Immediately halt automation and purge runtime password
  await chrome.storage.local.set({
    isAutomating: false,
    currentStatus: errorMsg,
    lastError: errorMsg,
    loginAttempts: 0
  });
  await chrome.storage.local.remove(["password"]);

  // 4. Trigger modern toast notification in bottom-right corner
  showToastNotification(err.message, err.title, "error", 6500);
}

// Main Automation Controller with comprehensive error handling
async function runAutomation() {
  try {
    const storage = await chrome.storage.local.get([
      "isAutomating",
      "userId",
      "password",
      "targetGrade",
      "evaluatedCourses",
      "loginAttempts",
      "retryCount"
    ]);

    if (!storage.isAutomating) {
      removeFloatingBadge();
      return;
    }

    const pathname = window.location.pathname.toLowerCase();
    await sleep(800);

    // =========================================================================
    // 1. LOGIN PAGE (LogIn.aspx or root)
    // =========================================================================
    if (pathname.includes("login.aspx") || pathname === "/" || pathname === "") {
      // Check if an error already exists on the page from a prior attempt
      const attemptsSoFar = storage.loginAttempts || 0;
      if (attemptsSoFar > 0) {
        const priorErr = getLoginPageError();
        if (priorErr) {
          await handleLoginError(priorErr);
          return;
        }
      }

      const userField = document.getElementById("logMain_UserName");
      const passField = document.getElementById("logMain_Password");
      const loginBtn = document.getElementById("logMain_Button1");

      if (!userField || !passField || !loginBtn) {
        await appendLog("Login form fields not ready yet. Retrying...", false);
        setTimeout(runAutomation, 1500);
        return;
      }

      if (!storage.userId || !storage.password) {
        const errorMsg = "❌ Missing credentials: Both Student ID and Password are required.";
        await appendLog(errorMsg, true);
        removeFloatingBadge();
        await chrome.storage.local.set({ isAutomating: false, currentStatus: errorMsg, lastError: errorMsg });
        await chrome.storage.local.remove(["password"]);
        showToastNotification("Both Student ID and Password are required.", "Missing Credentials", "error");
        return;
      }

      const attempts = attemptsSoFar + 1;
      if (attempts > 2) {
        const errorMsg = "❌ Login Failed: Could not authenticate after 2 attempts. Please verify your credentials.";
        await appendLog(errorMsg, true);
        removeFloatingBadge();
        await chrome.storage.local.set({
          isAutomating: false,
          currentStatus: errorMsg,
          lastError: errorMsg,
          loginAttempts: 0
        });
        await chrome.storage.local.remove(["password"]);
        showToastNotification("Could not authenticate after 2 attempts. Please verify your credentials.", "Authentication Failed", "error");
        return;
      }

      showFloatingBadge("Entering credentials & logging in...");
      await appendLog(`Attempting login (Attempt ${attempts})...`);
      await chrome.storage.local.set({ loginAttempts: attempts });

      // Reset alert tracking before submission
      lastPageAlertMessage = null;

      // Fill credentials and dispatch events for ASP.NET WebForms validators
      userField.value = storage.userId;
      userField.dispatchEvent(new Event("input", { bubbles: true }));
      userField.dispatchEvent(new Event("change", { bubbles: true }));

      passField.value = storage.password;
      passField.dispatchEvent(new Event("input", { bubbles: true }));
      passField.dispatchEvent(new Event("change", { bubbles: true }));

      await sleep(500);
      showFloatingBadge("Verifying credentials & waiting for response...");
      await appendLog("Login submitted. Verifying response from UCAM...");

      // Submit login
      loginBtn.click();

      // Poll for up to 12 seconds (48 x 250ms) to detect AJAX UpdatePanel response or navigation
      const maxTicks = 48;
      for (let t = 0; t < maxTicks; t++) {
        await sleep(250);

        // Check if automation was canceled externally (user pressed Stop)
        const currentState = await chrome.storage.local.get(["isAutomating"]);
        if (!currentState.isAutomating) {
          removeFloatingBadge();
          return;
        }

        // Check if page navigated away from login page
        const currentPath = window.location.pathname.toLowerCase();
        if (!currentPath.includes("login.aspx") && currentPath !== "/" && currentPath !== "") {
          // Navigation occurred (e.g. redirected to StudentHome.aspx)
          return;
        }

        // Check if error appeared in the DOM or via alert
        const errorObj = getLoginPageError();
        if (errorObj) {
          await handleLoginError(errorObj);
          return;
        }
      }

      // Check one final time after polling duration
      const finalErr = getLoginPageError();
      if (finalErr) {
        await handleLoginError(finalErr);
        return;
      }

      // Timed out while still on login page
      const timeoutMsg = "❌ Login Failed: Login request timed out or did not redirect. Please check your credentials and internet connection.";
      await appendLog(timeoutMsg, true);
      removeFloatingBadge();
      await chrome.storage.local.set({
        isAutomating: false,
        currentStatus: timeoutMsg,
        lastError: timeoutMsg,
        loginAttempts: 0
      });
      await chrome.storage.local.remove(["password"]);
      showToastNotification("Login request timed out or failed to redirect. Please check your credentials.", "Login Timeout", "error");
      return;
    }

    // =========================================================================
    // 2. STUDENT HOME PAGE (StudentHome.aspx)
    // =========================================================================
    if (pathname.includes("studenthome.aspx")) {
      // Clean up runtime credentials & login attempts upon successful login
      await chrome.storage.local.remove(["password"]);
      await chrome.storage.local.set({ loginAttempts: 0 });

      showFloatingBadge("Navigating to Registration...");
      await appendLog("Successfully logged in! Locating Registration module...");
      await sleep(1000);

      const links = Array.from(document.querySelectorAll("a.level1.static, a.level1"));
      const regLink = links.find((el) => el.textContent.trim() === "Registration");

      if (regLink) {
        await appendLog("Clicking 'Registration' module...");
        await chrome.storage.local.set({ retryCount: 0 });
        regLink.click();
        return;
      } else {
        const retries = (storage.retryCount || 0) + 1;
        if (retries > 4) {
          const errorMsg = "❌ Registration link not found on Student Home. Your account might have a registration restriction.";
          await appendLog(errorMsg, true);
          showFloatingBadge(errorMsg, true);
          await chrome.storage.local.set({ isAutomating: false, currentStatus: errorMsg });
          return;
        }
        await appendLog(`Registration link loading (Retry ${retries}/4)...`);
        await chrome.storage.local.set({ retryCount: retries });
        setTimeout(runAutomation, 2000);
        return;
      }
    }

    // =========================================================================
    // 3. REGISTRATION HOME PAGE (RegistrationHome.aspx)
    // =========================================================================
    if (pathname.includes("registrationhome.aspx")) {
      showFloatingBadge("Opening Course Evaluation menu...");
      await appendLog("On Registration module. Locating Course Evaluation menu...");
      await sleep(1000);

      const dropdowns = Array.from(document.querySelectorAll("a.dropdown-toggle"));
      const courseEvalMenu = dropdowns.find((el) => el.textContent.includes("Course Evaluation"));

      if (courseEvalMenu) {
        courseEvalMenu.click();
        await sleep(800);

        const subLinks = Array.from(document.querySelectorAll("a.level2.dynamic, a.level2"));
        const evalFormLink = subLinks.find((el) => el.textContent.includes("Evaluation Form"));

        if (evalFormLink) {
          await appendLog("Clicking 'Evaluation Form' link...");
          await chrome.storage.local.set({ retryCount: 0 });
          evalFormLink.click();
          return;
        }
      }

      const retries = (storage.retryCount || 0) + 1;
      if (retries > 4) {
        const errorMsg = "❌ Course Evaluation menu not found. The evaluation period may be closed for your trimester.";
        await appendLog(errorMsg, true);
        showFloatingBadge(errorMsg, true);
        await chrome.storage.local.set({ isAutomating: false, currentStatus: errorMsg });
        return;
      }
      await appendLog(`Waiting for Course Evaluation menu (Retry ${retries}/4)...`);
      await chrome.storage.local.set({ retryCount: retries });
      setTimeout(runAutomation, 2000);
      return;
    }

    // =========================================================================
    // 4. EVALUATION FORM PAGE (EvaluationForm.aspx)
    // =========================================================================
    if (pathname.includes("evaluationform.aspx")) {
      showFloatingBadge("Processing Course Evaluation...");
      await appendLog("On Evaluation Form page.");
      await sleep(1000);

      // Check status element
      const statusElem = document.getElementById("ctl00_MainContainer_lblEvaluationStatus");
      const statusText = statusElem ? statusElem.textContent.trim() : "";
      await appendLog(`Current Portal Status: '${statusText}'`);

      // If status is no longer Pending (e.g. Completed! or Passed)
      if (statusText && !statusText.toLowerCase().includes("pending")) {
        const msg = `🎉 Course Evaluation Status is '${statusText}'! All courses are completed!`;
        await appendLog(msg);
        await chrome.storage.local.set({ isAutomating: false, currentStatus: msg, retryCount: 0 });
        await chrome.storage.local.remove(["password"]);
        triggerDualSideCelebration(statusText);
        return;
      }

      // Check Course Dropdown
      const courseSelect = document.getElementById("ctl00_MainContainer_ddlAcaCalSection");
      if (!courseSelect) {
        const retries = (storage.retryCount || 0) + 1;
        if (retries > 4) {
          const errorMsg = "❌ Course selection dropdown not found on Evaluation Form.";
          await appendLog(errorMsg, true);
          showFloatingBadge(errorMsg, true);
          await chrome.storage.local.set({ isAutomating: false, currentStatus: errorMsg });
          await chrome.storage.local.remove(["password"]);
          return;
        }
        await appendLog(`Course dropdown loading (Retry ${retries}/4)...`);
        await chrome.storage.local.set({ retryCount: retries });
        setTimeout(runAutomation, 2000);
        return;
      }

      const evaluatedCourses = storage.evaluatedCourses || [];
      const validOptions = Array.from(courseSelect.options).filter(
        (opt) => opt.value !== "0_0" && opt.value !== "0" && opt.text.trim() !== "Select"
      );

      if (validOptions.length === 0) {
        const msg = "ℹ️ No registered courses available for evaluation.";
        await appendLog(msg);
        showFloatingBadge("No courses to evaluate.");
        await chrome.storage.local.set({ isAutomating: false, currentStatus: msg });
        await chrome.storage.local.remove(["password"]);
        return;
      }

      // Find next unevaluated course
      const nextCourseOpt = validOptions.find((opt) => !evaluatedCourses.includes(opt.value));

      if (!nextCourseOpt) {
        const msg = `All ${validOptions.length} available courses evaluated! Final check completed.`;
        await appendLog(msg);
        await chrome.storage.local.set({ isAutomating: false, currentStatus: msg });
        await chrome.storage.local.remove(["password"]);
        triggerDualSideCelebration(statusText || "Completed!");
        return;
      }

      // If next course is not currently selected, select it
      if (courseSelect.value !== nextCourseOpt.value) {
        await appendLog(`Selecting course: ${nextCourseOpt.text.trim()}...`);
        showFloatingBadge(`Selecting: ${nextCourseOpt.text.trim()}`);
        courseSelect.value = nextCourseOpt.value;
        courseSelect.dispatchEvent(new Event("change", { bubbles: true }));
        return;
      }

      // If next course IS currently selected, check for questions table
      const radios = Array.from(document.querySelectorAll("input[type='radio'][value='5']"));

      if (radios.length === 0) {
        const retries = (storage.retryCount || 0) + 1;
        if (retries > 5) {
          const errorMsg = `❌ Questions table failed to load for course: ${nextCourseOpt.text.trim()}.`;
          await appendLog(errorMsg, true);
          showFloatingBadge(errorMsg, true);
          await chrome.storage.local.set({ isAutomating: false, currentStatus: errorMsg });
          await chrome.storage.local.remove(["password"]);
          return;
        }
        await appendLog(`Waiting for question table to load from server (Retry ${retries}/5)...`);
        await chrome.storage.local.set({ retryCount: retries });
        setTimeout(runAutomation, 2000);
        return;
      }

      // Reset retry count on question table success
      await chrome.storage.local.set({ retryCount: 0 });

      // 1. Select Expected Grade
      const gradeSelect = document.getElementById("ctl00_MainContainer_ddlExpectedGrade");
      const targetGrade = storage.targetGrade || "A";
      if (gradeSelect) {
        await appendLog(`Setting Expected Grade: '${targetGrade}'`);
        gradeSelect.value = targetGrade;
        gradeSelect.dispatchEvent(new Event("change", { bubbles: true }));
        await sleep(600);
      }

      // 2. Answer all questions with 'Strongly Agree' (value 5)
      await appendLog(`Found ${radios.length} questions. Answering 'Strongly Agree'...`);
      showFloatingBadge(`Filling ${radios.length} questions...`);

      for (let i = 0; i < radios.length; i++) {
        const radio = radios[i];
        radio.scrollIntoView({ behavior: "smooth", block: "center" });
        radio.click();
        await sleep(150);
      }

      await appendLog("All questions answered. Preparing to save...");
      await sleep(800);

      // 3. Mark course as evaluated in storage BEFORE submit
      evaluatedCourses.push(nextCourseOpt.value);
      await chrome.storage.local.set({ evaluatedCourses: evaluatedCourses });

      // 4. Locate and click Save button
      const saveBtn =
        document.getElementById("ctl00_MainContainer_btnTheorySubmit") ||
        document.getElementById("ctl00_MainContainer_btnTheoryTop") ||
        document.querySelector("input[type='submit'][value='Save']");

      if (saveBtn) {
        await appendLog(`Saving evaluation for: '${nextCourseOpt.text.trim()}'...`);
        showFloatingBadge(`Saving: ${nextCourseOpt.text.trim()}...`);
        saveBtn.scrollIntoView({ behavior: "smooth", block: "center" });
        await sleep(500);
        saveBtn.click();
        return;
      } else {
        const errorMsg = "❌ Could not locate 'Save' button on Evaluation Form.";
        await appendLog(errorMsg, true);
        showFloatingBadge(errorMsg, true);
        await chrome.storage.local.set({ isAutomating: false, currentStatus: errorMsg });
        await chrome.storage.local.remove(["password"]);
      }
    }
  } catch (err) {
    const errorMsg = `❌ Unexpected Error: ${err.message || err}`;
    console.error("[UCAM Automator]", err);
    await appendLog(errorMsg, true);
    removeFloatingBadge();
    await chrome.storage.local.set({ isAutomating: false, currentStatus: errorMsg, lastError: errorMsg });
    await chrome.storage.local.remove(["password"]);
    showToastNotification(err.message || "An unexpected error occurred. Please contact support.", "Unexpected Error", "error");
  }
}

// Concurrency guard to prevent multiple automation runners from overlapping
let isRunningAutomation = false;

async function safeRunAutomation() {
  if (isRunningAutomation) return;
  isRunningAutomation = true;
  try {
    await runAutomation();
  } finally {
    isRunningAutomation = false;
  }
}

// React to storage changes (e.g. Stop clicked or Start clicked)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    if (changes.isAutomating) {
      if (changes.isAutomating.newValue === true) {
        safeRunAutomation();
      } else if (changes.isAutomating.newValue === false) {
        removeFloatingBadge();
      }
    }
  }
});

// Automatically trigger on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", safeRunAutomation);
} else {
  safeRunAutomation();
}
