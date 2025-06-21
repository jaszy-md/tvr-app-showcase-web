const video = document.getElementById('myVideo');
const playPauseBtn = document.getElementById('playPause');
const rewindBtn = document.getElementById('rewind');
const forwardBtn = document.getElementById('forward');
const progressBar = document.getElementById('progressBar');
const remainingTimeEl = document.getElementById('remainingTime');
const controlsContainer = document.getElementById('controlsContainer');
const rebootImg = document.querySelector('.reboot-logo');
const phoneWrapper = document.getElementById('phoneWrapper');
const shineWrapper = document.getElementById('shineWrapper');
const scrollArrow = document.getElementById('scrollArrow');

let phoneInView = false;

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

video.addEventListener('loadedmetadata', () => {
  progressBar.max = video.duration;
});

video.addEventListener('timeupdate', () => {
  progressBar.value = video.currentTime;
  const remaining = video.duration - video.currentTime;
  remainingTimeEl.textContent = formatTime(remaining);
});

progressBar.addEventListener('input', () => {
  video.currentTime = progressBar.value;
});

playPauseBtn.addEventListener('click', () => {
  if (video.paused) {
    video.play();
    playPauseBtn.textContent = '⏸️';
  } else {
    video.pause();
    playPauseBtn.textContent = '▶️';
  }
});

rewindBtn.addEventListener('click', () => {
  video.currentTime = Math.max(video.currentTime - 5, 0);
});

forwardBtn.addEventListener('click', () => {
  video.currentTime = Math.min(video.currentTime + 5, video.duration);
});

function tryAutoplay() {
  if (video.paused) {
    video.play().then(() => {
      playPauseBtn.textContent = '⏸️';
    }).catch((e) => {
      console.log('Autoplay failed:', e);
    });
  }
}

let autoplayTriggered = false;
function triggerOnce(fn) {
  if (!autoplayTriggered) {
    autoplayTriggered = true;
    fn();
  }
}

window.addEventListener('scroll', () => triggerOnce(tryAutoplay));
document.addEventListener('click', () => triggerOnce(tryAutoplay));
document.addEventListener('touchstart', () => triggerOnce(tryAutoplay));

window.onload = () => {
  rebootImg.classList.add('fade-in');
  setTimeout(() => {
    triggerShine();
    setInterval(triggerShine, 5000);
  }, 2000);

  setTimeout(() => {
    scrollArrow.classList.add('start-bounce');
  }, 3000);
};

function triggerShine() {
  shineWrapper.classList.remove('start-shine');
  void shineWrapper.offsetWidth;
  shineWrapper.classList.add('start-shine');
}

function getScrollThreshold() {
  const width = window.innerWidth;
  if (width < 600) return 120;
  if (width < 1024) return 200;
  return 310;
}

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const threshold = getScrollThreshold();

  if (scrolled >= threshold) {
    if (!phoneInView) {
      phoneInView = true;
      phoneWrapper.classList.add('animate-in');
      phoneWrapper.classList.remove('animate-out');
      setTimeout(() => {
        controlsContainer.classList.add('controls-in');
        controlsContainer.classList.remove('controls-out');
      }, 2500);
    }
  } else {
    if (phoneInView) {
      phoneInView = false;
      phoneWrapper.classList.remove('animate-in');
      phoneWrapper.classList.add('animate-out');
      controlsContainer.classList.remove('controls-in');
      controlsContainer.classList.add('controls-out');
      video.pause();
      video.currentTime = 0;
      playPauseBtn.textContent = '▶️';
    }
  }
});
