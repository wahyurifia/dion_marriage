// ---------- Page navigation ----------
const cover = document.getElementById('cover');
const question = document.getElementById('question');
const answer = document.getElementById('answer');

function goTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  page.classList.add('active');
}

document.getElementById('open-btn').addEventListener('click', () => {
  goTo(question);
});

// ---------- "No" button runs away ----------
const noBtn = document.getElementById('no-btn');
const btnRow = document.querySelector('.btn-row');

function runAway() {
  const btnWidth = noBtn.offsetWidth;
  const btnHeight = noBtn.offsetHeight;
  const margin = 20;

  const maxLeft = window.innerWidth - btnWidth - margin;
  const maxTop = window.innerHeight - btnHeight - margin;

  const randomLeft = Math.random() * (maxLeft - margin) + margin;
  const randomTop = Math.random() * (maxTop - margin) + margin;

  noBtn.classList.add('escaping');
  noBtn.style.left = randomLeft + 'px';
  noBtn.style.top = randomTop + 'px';
}

noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  runAway();
}, { passive: false });
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  runAway();
});

// ---------- "Yes" button ----------
document.getElementById('yes-btn').addEventListener('click', () => {
  goTo(answer);
  launchConfetti();
  tryPlayMusic();
  goToSlide(0);
  startAutoSlide();
});

// ---------- Video carousel ----------
const carouselTrack = document.getElementById('carousel-track');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselVideos = document.querySelectorAll('.carousel-slide video');
const carouselDots = document.getElementById('carousel-dots');

let currentSlide = 0;

carouselSlides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'carousel-dot';
  dot.addEventListener('click', () => {
    goToSlide(i);
    startAutoSlide();
  });
  carouselDots.appendChild(dot);
});
const dotEls = document.querySelectorAll('.carousel-dot');

function goToSlide(index) {
  currentSlide = (index + carouselSlides.length) % carouselSlides.length;
  carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

  carouselVideos.forEach((video, i) => {
    if (i === currentSlide) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });

  dotEls.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

let autoSlideTimer;
function startAutoSlide() {
  clearInterval(autoSlideTimer);
  autoSlideTimer = setInterval(() => goToSlide(currentSlide + 1), 4000);
}

// ---------- Marquee foto: gandakan otomatis sampai penuh, seberapapun lebar layarnya ----------
function fillMarqueeRow(row) {
  const track = row.querySelector('.marquee-track');
  if (!track.dataset.original) {
    track.dataset.original = track.innerHTML;
  }
  track.innerHTML = track.dataset.original;

  // gandakan isi track sampai satu "set"-nya sendiri sudah selebar baris
  while (track.scrollWidth < row.clientWidth) {
    track.insertAdjacentHTML('beforeend', track.innerHTML);
  }
  // lalu gandakan sekali lagi supaya loop translateX(-50%) mulus tanpa celah
  track.insertAdjacentHTML('beforeend', track.innerHTML);
}

function fillAllMarquees() {
  document.querySelectorAll('.marquee-row').forEach(fillMarqueeRow);
}

window.addEventListener('load', fillAllMarquees);
let marqueeResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(marqueeResizeTimer);
  marqueeResizeTimer = setTimeout(fillAllMarquees, 250);
});

// ---------- Confetti ----------
function launchConfetti() {
  const container = document.getElementById('confetti-container');
  const colors = ['#ff7fa8', '#ff5c8a', '#ffd166', '#ff8fab', '#c9506f', '#ffffff'];

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
    piece.style.animationDelay = (Math.random() * 0.5) + 's';
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 3500);
  }
}

// ---------- Floating hearts background ----------
const heartsBg = document.getElementById('hearts-bg');
const heartSymbols = ['❤️', '💕', '💖', '💗', '💘'];

function spawnHeart() {
  const heart = document.createElement('div');
  heart.className = 'heart-particle';
  heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  heart.style.left = Math.random() * 100 + '%';
  heart.style.fontSize = (14 + Math.random() * 18) + 'px';
  const duration = 6 + Math.random() * 6;
  heart.style.animationDuration = duration + 's';
  heartsBg.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000);
}

setInterval(spawnHeart, 700);

// ---------- Background music ----------
const music = document.getElementById('bg-music');
const soundToggle = document.getElementById('sound-toggle');
let musicPlaying = false;

function tryPlayMusic() {
  music.play().then(() => {
    musicPlaying = true;
    soundToggle.textContent = '🔊';
  }).catch(() => {
    // autoplay blocked, wait for user interaction
  });
}

soundToggle.addEventListener('click', () => {
  if (musicPlaying) {
    music.pause();
    musicPlaying = false;
    soundToggle.textContent = '🔈';
  } else {
    tryPlayMusic();
  }
});

