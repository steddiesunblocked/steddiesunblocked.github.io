/* =====================
   CORE STEALTH SYSTEM
   ===================== */

let stealthActive = false;
const audioContexts = [];

/* ----- UI ----- */
function showStealthOverlay() {
  document.body.classList.add("stealth");
  document.getElementById("stealthOverlay").style.display = "block";
}

function hideStealthOverlay() {
  document.body.classList.remove("stealth");
  document.getElementById("stealthOverlay").style.display = "none";
}

/* ----- AUDIO KILL ----- */
(function () {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;

  window.AudioContext = window.webkitAudioContext = function () {
    const ctx = new AC();
    audioContexts.push(ctx);
    if (stealthActive) ctx.suspend();
    return ctx;
  };
})();

function muteAllAudio() {
  document.querySelectorAll("audio, video").forEach(el => {
    el.muted = true;
    el.pause?.();
  });

  audioContexts.forEach(ctx => {
    if (ctx.state === "running") ctx.suspend();
  });
}

function unmuteAllAudio() {
  document.querySelectorAll("audio, video").forEach(el => {
    el.muted = false;
  });

  audioContexts.forEach(ctx => {
    if (ctx.state === "suspended") ctx.resume();
  });
}

/* ----- TOGGLE ----- */
function enableStealth() {
  stealthActive = true;
  muteAllAudio();
  showStealthOverlay();
}

function disableStealth() {
  stealthActive = false;
  unmuteAllAudio();
  hideStealthOverlay();
}

function toggleStealth() {
  stealthActive ? disableStealth() : enableStealth();
}

/* ----- KEYBIND ----- */
document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key.toLowerCase() === "e") {
    e.preventDefault();
    toggleStealth();
  }
});
