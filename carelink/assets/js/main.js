const videoLeft = document.getElementById('videoLeft');
const phoneLeft = document.getElementById('phoneLeft');
const controlsLeft = document.getElementById('controlsLeft');
const progressLeft = document.getElementById('progressLeft');
const playPauseLeft = document.getElementById('playPauseLeft');
const remainingLeft = document.getElementById('remainingLeft');

const videoRight = document.getElementById('videoRight');
const phoneRight = document.getElementById('phoneRight');
const controlsRight = document.getElementById('controlsRight');
const progressRight = document.getElementById('progressRight');
const playPauseRight = document.getElementById('playPauseRight');
const remainingRight = document.getElementById('remainingRight');

// algemeen
const rebootImg = document.querySelector('.reboot-logo');
const shineWrapper = document.getElementById('shineWrapper');
const scrollArrow = document.getElementById('scrollArrow');

let phonesInView = false;
const PLAY_IMG_SRC = 'assets/images/play.png';
const PAUSE_TEXT_ICON = '⏯';

function setButtonPlaying(btn, isPlaying) {
  btn.classList.remove('is-playing');
  btn.innerHTML = isPlaying
    ? `<img src="${PLAY_IMG_SRC}" alt="Playing" class="play-icon-img">`
    : PAUSE_TEXT_ICON;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function setupVideo(video, progress, remaining) {
  video.muted = true;

  video.addEventListener('loadedmetadata', () => {
    progress.value = 0;
    remaining.textContent = formatTime(video.duration);
  });

  video.addEventListener('timeupdate', () => {
    const pct = video.duration ? (video.currentTime / video.duration) * 100 : 0;
    progress.value = pct;
    remaining.textContent = formatTime(Math.max(video.duration - video.currentTime, 0));
  });

  progress.addEventListener('input', () => {
    if (!video.duration) return;
    video.currentTime = (progress.value / 100) * video.duration;
  });
}

function setupControls(video, btn) {
  setButtonPlaying(btn, !video.paused);

  btn.addEventListener('click', async () => {
    try {
      if (video.paused) {
        await video.play();
        setButtonPlaying(btn, true);
      } else {
        video.pause();
        setButtonPlaying(btn, false);
      }
    } catch (e) {
      setButtonPlaying(btn, false);
    }
  });

  video.addEventListener('ended', () => setButtonPlaying(btn, false));
  video.addEventListener('play', () => setButtonPlaying(btn, true));
  video.addEventListener('pause', () => setButtonPlaying(btn, false));
}

setupVideo(videoLeft, progressLeft, remainingLeft);
setupVideo(videoRight, progressRight, remainingRight);

setupControls(videoLeft, playPauseLeft);
setupControls(videoRight, playPauseRight);

function getScrollThreshold() {
  const w = window.innerWidth;
  if (w < 600) return 100;
  if (w < 1024) return 200;
  return 310;
}

function showControls() {
  controlsLeft.classList.add('controls-in');
  controlsLeft.classList.remove('controls-out');

  controlsRight.classList.add('controls-in');
  controlsRight.classList.remove('controls-out');
}

function hideControls() {
  controlsLeft.classList.remove('controls-in');
  controlsLeft.classList.add('controls-out');

  controlsRight.classList.remove('controls-in');
  controlsRight.classList.add('controls-out');
}

function evaluateScroll() {
  const scrolled = window.scrollY;
  const threshold = getScrollThreshold();

  if (scrolled >= threshold && !phonesInView) {
    phonesInView = true;

    phoneLeft.classList.add('animate-in');
    phoneLeft.classList.remove('animate-out');

    phoneRight.classList.add('animate-in');
    phoneRight.classList.remove('animate-out');

    setTimeout(showControls, 2500);
  }

  if (scrolled < threshold && phonesInView) {
    phonesInView = false;

    phoneLeft.classList.remove('animate-in');
    phoneLeft.classList.add('animate-out');

    phoneRight.classList.remove('animate-in');
    phoneRight.classList.add('animate-out');

    hideControls();

    videoLeft.pause();
    videoLeft.currentTime = 0;
    setButtonPlaying(playPauseLeft, false);

    videoRight.pause();
    videoRight.currentTime = 0;
    setButtonPlaying(playPauseRight, false);
  }
}

window.addEventListener('scroll', evaluateScroll);

window.onload = () => {
  rebootImg.classList.add('fade-in');

  setTimeout(() => {
    triggerShine();
    setInterval(triggerShine, 5000);
  }, 2000);

  setTimeout(() => {
    scrollArrow.classList.add('start-bounce');
  }, 3000);

  evaluateScroll();
};

function triggerShine() {
  shineWrapper.classList.remove('start-shine');
  void shineWrapper.offsetWidth;
  shineWrapper.classList.add('start-shine');
}
