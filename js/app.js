const clock = document.getElementById("clock");
const subtitle = document.getElementById("subtitle");
const a = document.getElementById("audioA");
const b = document.getElementById("audioB");

let active = a;
let idle = b;
let currentMood = null;

const subtitleText = "Use Your Time Wisely.";

const playlists = {
  subuh: [
    "assets/audio/dawn1.mp3",
    "assets/audio/dawn2.mp3"
  ],
  pagi: [
    "assets/audio/morning1.mp3",
    "assets/audio/morning2.mp3"
  ],
  siang: [
    "assets/audio/noon1.mp3",
    "assets/audio/noon2.mp3"
  ],
  sore: [
    "assets/audio/evening1.mp3",
    "assets/audio/evening2.mp3"
  ],
  malam: [
    "assets/audio/night1.mp3",
    "assets/audio/night2.mp3"
  ]
};

const volumes = {
  subuh: 0.25,
  pagi: 0.45,
  siang: 0.5,
  sore: 0.4,
  malam: 0.3
};

function getMood(h) {
  if (h >= 4 && h < 5.5) return "subuh";
  if (h >= 5.5 && h < 9) return "pagi";
  if (h >= 9 && h < 16) return "siang";
  if (h >= 16 && h < 18.5) return "sore";
  return "malam";
}

function updateClock() {
  const now = new Date();
  clock.textContent =
    String(now.getHours()).padStart(2,"0") + ":" +
    String(now.getMinutes()).padStart(2,"0") + ":" +
    String(now.getSeconds()).padStart(2,"0");

  const mood = getMood(now.getHours() + now.getMinutes() / 60);
  if (mood !== currentMood) {
    currentMood = mood;
    document.body.className = mood;
  }
}

function typeText(el, text, speed) {
  let i = 0;
  el.textContent = "";
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

function pickSong() {
  const list = playlists[currentMood];
  return list[Math.floor(Math.random() * list.length)];
}

function crossfade(next) {
  idle.src = next;
  idle.volume = 0;
  idle.play();

  let step = 0;
  const max = volumes[currentMood];
  const fade = setInterval(() => {
    step++;
    active.volume = max * (1 - step / 50);
    idle.volume = max * (step / 50);
    if (step >= 50) {
      clearInterval(fade);
      active.pause();
      [active, idle] = [idle, active];
    }
  }, 100);
}

setInterval(() => {
  updateClock();
  if (!active.paused && active.duration - active.currentTime < 6) {
    crossfade(pickSong());
  }
}, 1000);

window.addEventListener("load", () => {
  updateClock();
  typeText(clock, clock.textContent, 100);
  setTimeout(() => typeText(subtitle, subtitleText, 80), 600);
});

document.body.addEventListener("dblclick", () => {
  if (active.paused) {
    active.src = pickSong();
    active.volume = volumes[currentMood];
    active.play();
  } else {
    active.pause();
  }
});