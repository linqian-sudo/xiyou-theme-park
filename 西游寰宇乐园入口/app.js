const modal = document.getElementById('trailer-modal');
const openers = document.querySelectorAll('[data-open-modal]');
const closers = document.querySelectorAll('[data-close-modal]');
const trailerMedia = document.getElementById('trailer-media');
const trailerDescription = document.getElementById('trailer-description');
const trailerStatus = document.getElementById('trailer-status');
let previouslyFocused;

// Adding assets/promo-video.mp4 is all that is needed to connect the official film.
const promoVideo = document.createElement('video');
promoVideo.src = 'assets/promo-video.mp4';
promoVideo.controls = true;
promoVideo.preload = 'metadata';
promoVideo.muted = true;
promoVideo.defaultMuted = true;
promoVideo.setAttribute('playsinline', '');
promoVideo.setAttribute('aria-label', '\u897f\u6e38\u5ba3\u4f20\u7247\u64ad\u653e\u5668');

function startTrailer() {
  if (!trailerMedia.contains(promoVideo)) return;
  promoVideo.muted = true;
  promoVideo.play().catch(() => {});
}

promoVideo.addEventListener('loadedmetadata', () => {
  trailerMedia.replaceChildren(promoVideo);
  trailerDescription.textContent = '\u6b63\u5f0f\u5ba3\u4f20\u7247\u5df2\u63a5\u5165\u3002\u6b63\u5728\u4e3a\u4f60\u5f00\u542f\u897f\u884c\u5192\u9669\u3002';
  trailerStatus.innerHTML = '<i></i><span>\u6b63\u7247\u5df2\u63a5\u5165</span>';
  if (modal.classList.contains('is-open')) startTrailer();
}, { once: true });

function openModal() {
  previouslyFocused = document.activeElement;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  modal.querySelector('.modal-close').focus();
  startTrailer();
}

function closeModal() {
  if (trailerMedia.contains(promoVideo)) {
    promoVideo.pause();
    promoVideo.currentTime = 0;
  }
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  previouslyFocused?.focus();
}

openers.forEach((opener) => opener.addEventListener('click', openModal));
closers.forEach((closer) => closer.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});
