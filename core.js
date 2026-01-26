/* =========================
   STEALTH AUDIO KILL SYSTEM
   ========================= */

let stealthActive = false;
const audioContexts = [];

/* Hijack WebAudio so games can't bypass mute */
(() => {
  const OriginalAC = window.AudioContext || window.webkitAudioContext;
  if (!OriginalAC) return;

  window.AudioContext = window.webkitAudioContext = function () {
    const ctx = new OriginalAC();
    audioContexts.push(ctx);
    if (stealthActive) ctx.suspend();
    return ctx;
  };
})();

/* Hard mute EVERYTHING */
function muteAllAudio() {
  // audio + video tags
  document.querySelectorAll("audio, video").forEach(el => {
    el.muted = true;
    el.pause?.();
  });

  // iframes (best-effort)
  document.querySelectorAll("iframe").forEach(f => {
    try {
      f.contentWindow.postMessage({ mute: true }, "*");
    } catch {}
  });

  // WebAudio
  audioContexts.forEach(ctx => {
    if (ctx.state === "running") ctx.suspend();
  });
}

/* Resume audio */
function unmuteAllAudio() {
  document.querySelectorAll("audio, video").forEach(el => {
    el.muted = false;
  });

  audioContexts.forEach(ctx => {
    if (ctx.state === "suspended") ctx.resume();
  });
}

/* Toggle stealth */
function toggleStealth() {
  stealthActive = !stealthActive;

  if (stealthActive) {
    muteAllAudio();
  } else {
    unmuteAllAudio();
  }
}

/* Keyboard shortcut */
document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key.toLowerCase() === "e") {
    e.preventDefault();
    toggleStealth();
  }
});
