// playlist of tracks :p
const playlist = [
  {
    title: "Track 1: ReFantazio - Ode to Heroes",
    url: "https://www.youtube.com/embed/8u_Ex2Pk3Ww?autoplay=1&mute=0&controls=0&loop=1&playlist=8u_Ex2Pk3Ww"
  },
  {
    title: "Track 2: Innocent Sin - Velvet Room Piano cover [Synthesia]",
    url: "https://www.youtube.com/embed/K3r_X-yBY08?autoplay=1&mute=0&controls=0&loop=1&playlist=K3r_X-yBY08&start=4"
  },
  {
    title: "Track 3: Scala Ad Caelum (Piano Cover)",
    url: "https://www.youtube.com/embed/uHOIx_feOz4?autoplay=1&mute=0&controls=0&loop=1&playlist=uHOIx_feOz4&start=8"
  },
  {
    title: "Track 4: Dearly Beloved | Flute & Piano cover",
    url: "https://www.youtube.com/embed/ggZdvCdI0FI?autoplay=1&mute=0&controls=0&loop=1&playlist=ggZdvCdI0FI"
  },
  {
    title: "Track 5: Sanctuary",
    url: "https://www.youtube.com/embed/HTUq3Ik1GHM?autoplay=1&mute=0&controls=0&loop=1&playlist=HTUq3Ik1GHM"
  },
  {
    title: "Track 6: Melissa - Porno Graffitti",
    url: "https://www.youtube.com/embed/Yag2txXDAKM?autoplay=1&mute=0&controls=0&loop=1&playlist=Yag2txXDAKM"
  },
  {
    title: "Track 7: Pride",
    url: "https://www.youtube.com/embed/m0iMQCrDobI?autoplay=1&mute=0&controls=0&loop=1&playlist=m0iMQCrDobI&start=42"
  },
  {
    title: "Track 8: 70cm Square Window",
    url: "https://www.youtube.com/embed/mbAMtrhhwf0?autoplay=1&mute=0&controls=0&loop=1&playlist=mbAMtrhhwf0"
  },
  {
    title: "Track 9: Final Fantasy X - Battle Theme",
    url: "https://www.youtube.com/embed/7AjXgK0NYTo?autoplay=1&mute=0&controls=0&loop=1&playlist=7AjXgK0NYTo"
  }
];

let index = 0;
let isPlaying = true;
let isMuted = false;

// UI elements for the music controller
const titleBar = document.getElementById("track-title");
const btnPrev = document.getElementById("btn-prev");
const btnPlay = document.getElementById("btn-play");
const btnNext = document.getElementById("btn-next");
const btnMute = document.getElementById("btn-mute");

// hidden iframe used to play YouTube tracks
const musicFrame = document.createElement("iframe");
musicFrame.width = "1";
musicFrame.height = "1";
musicFrame.style.position = "absolute";
musicFrame.style.left = "-9999px";  // dingy, keeps it off-screen
musicFrame.style.top = "-9999px";
musicFrame.allow = "autoplay";
document.body.appendChild(musicFrame);

function loadTrack(i) {
  const track = playlist[i];
  musicFrame.src = track.url;
  titleBar.textContent = track.title;
}

// start the first song when page loads
window.addEventListener("load", () => {
  index = 0;
  isPlaying = true;
  loadTrack(index);
});

// play / pause button
btnPlay.addEventListener("click", () => {
  if (isPlaying) {
    musicFrame.src = "about:blank";
    btnPlay.textContent = "▶";
  } else {
    // resume current track
    loadTrack(index);
    btnPlay.textContent = "⏸";
  }
  isPlaying = !isPlaying;
});

// go to next track
btnNext.addEventListener("click", () => {
  index = (index + 1) % playlist.length;
  loadTrack(index);
  btnPlay.textContent = "⏸";
  isPlaying = true;
});

// go to previous track
btnPrev.addEventListener("click", () => {
  index = (index - 1 + playlist.length) % playlist.length;
  loadTrack(index);
  btnPlay.textContent = "⏸";
  isPlaying = true;
});

// mute/unmute button — rebuilds the URL with mute=1 or mute=0
btnMute.addEventListener("click", () => {
  isMuted = !isMuted;
  
  const base = playlist[index].url.split("&mute=")[0];
  const newURL = base + "&mute=" + (isMuted ? "1" : "0");

  playlist[index].url = newURL;
  musicFrame.src = newURL;

  btnMute.textContent = isMuted ? "🔈" : "🔇";
});

const commandButtons = document.querySelectorAll(".command-item");
const sfxMove = new Audio("MENU_MOVE_SFX_URL");
const sfxSelect = new Audio("MENU_SELECT_SFX_URL");
sfxMove.volume = 0.4;
sfxSelect.volume = 0.5;

// handles showing different page sections
function showSection(id) {
  const sections = document.querySelectorAll(".panel");
  sections.forEach(sec => {
    if (!sec.id) return;
    sec.style.display = sec.id === id ? "block" : (sec.id === "home" ? "block" : "none");
  });
}

// attach behaviour to sidebar buttons
commandButtons.forEach(btn => {
  const target = btn.dataset.target;
  const popup = btn.dataset.popup;

  btn.addEventListener("mouseenter", () => {
    sfxMove.currentTime = 0;
    sfxMove.play().catch(() => {});
  });

  btn.addEventListener("click", () => {
    commandButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    sfxSelect.currentTime = 0;
    sfxSelect.play().catch(() => {});

    if (target) showSection(target);
    if (popup) openPopup(popup);
  });
});

if (document.getElementById("home")) showSection("home");


// makes the popup windows draggable by their top bar
function makeDraggable(popup) {
  const bar = popup.querySelector(".popup-bar");
  if (!bar) return;

  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;

  bar.addEventListener("mousedown", (e) => {
    dragging = true;

    const rect = popup.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    popup.style.transition = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    popup.style.left = e.clientX - offsetX + "px";
    popup.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });
}

// show a popup window
function openPopup(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = "block";
}

// hide a popup window
function closePopup(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = "none";
}

// enable dragging for these pop up windows
["soraWindow", "bodyWindow", "handheldWindow"].forEach(id => {
  const el = document.getElementById(id);
  if (el) makeDraggable(el);
});

// close buttons inside popups
document.querySelectorAll(".popup-close").forEach(btn => {
  btn.addEventListener("click", () => closePopup(btn.dataset.close));
});
