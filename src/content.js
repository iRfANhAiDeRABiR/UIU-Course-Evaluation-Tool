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
    window.alert = function(msg) { console.log("[UCAM Automator by iabir2230474] Auto-accepted alert:", msg); return true; };
    window.confirm = function(msg) { console.log("[UCAM Automator by iabir2230474] Auto-accepted confirm:", msg); return true; };
  `;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
})();

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

  badge.innerHTML = `<span>${icon} UCAM Automator:</span> <span>${text}</span>`;
}

function removeFloatingBadge() {
  const badge = document.getElementById("ucam-automator-badge");
  if (badge) badge.remove();
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
        <span>Status:</span> <span>${statusText || "Completed!"}</span> <span>✅</span>
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
      const cardBody = document.querySelector(".card-body") || document.body;
      const pageText = cardBody.textContent || "";

      // Check for specific login errors returned by UCAM
      if (
        pageText.includes("Invalid password") ||
        pageText.includes("An unexpected error occurred") ||
        pageText.includes("User is blocked") ||
        pageText.includes("Account is disabled") ||
        pageText.includes("Incorrect password")
      ) {
        let errorMsg = "❌ Login Failed: Incorrect Student ID or Password.";
        if (pageText.includes("Invalid password") || pageText.includes("try again")) {
          errorMsg = "❌ Login Failed: Invalid password! Please re-check your password in the extension.";
        } else if (pageText.includes("An unexpected error occurred")) {
          errorMsg = "❌ Login Failed: Invalid Student ID or account not recognized.";
        } else if (pageText.includes("blocked") || pageText.includes("disabled")) {
          errorMsg = "❌ Login Failed: Account is blocked or disabled. Contact UIU admin.";
        }

        await appendLog(errorMsg, true);
        showFloatingBadge(errorMsg, true);
        await chrome.storage.local.set({
          isAutomating: false,
          currentStatus: errorMsg,
          lastError: errorMsg,
          loginAttempts: 0
        });
        alert(errorMsg);
        return;
      }

      // Check login retry count to prevent infinite login loops
      const attempts = (storage.loginAttempts || 0) + 1;
      if (attempts > 2) {
        const errorMsg = "❌ Login Failed: Could not authenticate after 2 attempts. Please verify your credentials.";
        await appendLog(errorMsg, true);
        showFloatingBadge(errorMsg, true);
        await chrome.storage.local.set({
          isAutomating: false,
          currentStatus: errorMsg,
          lastError: errorMsg,
          loginAttempts: 0
        });
        alert(errorMsg);
        return;
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
        showFloatingBadge(errorMsg, true);
        await chrome.storage.local.set({ isAutomating: false, currentStatus: errorMsg });
        return;
      }

      showFloatingBadge("Entering credentials & logging in...");
      await appendLog(`Attempting login (Attempt ${attempts})...`);
      await chrome.storage.local.set({ loginAttempts: attempts });

      userField.value = storage.userId;
      passField.value = storage.password;
      await sleep(600);
      loginBtn.click();
      return;
    }

    // Reset login attempts once successfully beyond login page
    if (storage.loginAttempts && storage.loginAttempts > 0) {
      await chrome.storage.local.set({ loginAttempts: 0 });
    }

    // =========================================================================
    // 2. STUDENT HOME PAGE (StudentHome.aspx)
    // =========================================================================
    if (pathname.includes("studenthome.aspx")) {
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
        return;
      }

      // Find next unevaluated course
      const nextCourseOpt = validOptions.find((opt) => !evaluatedCourses.includes(opt.value));

      if (!nextCourseOpt) {
        const msg = `All ${validOptions.length} available courses evaluated! Final check completed.`;
        await appendLog(msg);
        await chrome.storage.local.set({ isAutomating: false, currentStatus: msg });
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
      }
    }
  } catch (err) {
    const errorMsg = `❌ Unexpected Error: ${err.message || err}`;
    console.error("[UCAM Automator]", err);
    await appendLog(errorMsg, true);
    showFloatingBadge(errorMsg, true);
    await chrome.storage.local.set({ isAutomating: false, currentStatus: errorMsg, lastError: errorMsg });
  }
}

// Automatically trigger on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runAutomation);
} else {
  runAutomation();
}
