// ===== CORE UI INJECTION =====

// Inject banner + overlay
document.body.insertAdjacentHTML("afterbegin", `
  <div class="panic-banner">
    <span>Teacher coming?</span>
    <button id="panicBtn">PANIC</button>
    <span class="shortcut">(Ctrl + E)</span>
  </div>

  <div id="panicOverlay">
    <img src="assets/edulink_fake.png" alt="EduLink One Login">
  </div>
`);

// State
let stealth = false;
let muted = [];

// Toggle stealth
function toggleStealth() {
  stealth = !stealth;
  document.body.classList.toggle("stealth", stealth);

  const overlay = document.getElementById("panicOverlay");

  if (stealth) {
    overlay.classList.add("active");

    muted = [];
    document.querySelectorAll("audio, video").forEach(el => {
      muted.push({ el, muted: el.muted, volume: el.volume });
      el.muted = true;
      el.volume = 0;
    });
  } else {
    overlay.classList.remove("active");

    muted.forEach(item => {
      item.el.muted = item.muted;
      item.el.volume = item.volume;
    });
  }
}

// Ctrl + E
document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key.toLowerCase() === "e") {
    e.preventDefault();
    toggleStealth();
  }
});

// Button
document.addEventListener("click", e => {
  if (e.target && e.target.id === "panicBtn") {
    toggleStealth();
  }
});
